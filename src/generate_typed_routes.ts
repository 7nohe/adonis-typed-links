import {
  createPrinter,
  createSourceFile,
  EmitHint,
  factory,
  NewLineKind,
  NodeFlags,
  ScriptKind,
  ScriptTarget,
  SyntaxKind,
  transpile,
  transpileDeclaration,
} from 'typescript'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { print } from './print.js'
import pkg from '../package.json' assert { type: 'json' }
const execPromise = promisify(exec)

const command = 'node ace list:routes --json'
const outputPath = `node_modules/${pkg.name}/build/generated`
const jsFileName = 'routes.js'
const dtsFileName = 'routes.d.ts'

type Route = Record<string, { methods: string[]; pattern: string; params?: string[] }>

export async function generateTypedRoutes() {
  const { stderr, stdout } = await execPromise(command)

  if (stderr) {
    throw new Error(stderr)
  }

  const json = JSON.parse(stdout) as {
    domain: string
    routes: {
      name: string
      methods: string[]
      pattern: string
    }[]
  }[]

  const routes = json
    .find((item) => item.domain === 'root')
    ?.['routes'].filter((item) => item.name !== undefined)
    .reduce(
      (
        acc: Route,
        route: {
          name: string
          methods: string[]
          pattern: string
        }
      ) => {
        const key = route.name
        acc[key] = {
          methods: route.methods,
          pattern: route.pattern,
          params: route.pattern.match(/:\w+/g)?.map((param) => param.slice(1)),
        }
        return acc
      },
      {} as Route
    )

  if (!routes) {
    throw new Error('No routes found')
  }

  const source = createTypedRoutesSource(routes)

  const js = transpile(source, { target: ScriptTarget.ESNext })
  const { outputText } = transpileDeclaration(source, {
    compilerOptions: {
      strict: true,
    },
  })

  print(jsFileName, js, outputPath)
  print(dtsFileName, outputText, outputPath)
}

function createTypedRoutesSource(routes: Route) {
  const sourceFile = createSourceFile(jsFileName, '', ScriptTarget.Latest, false, ScriptKind.TS)
  const printer = createPrinter({ newLine: NewLineKind.LineFeed })
  const node = createTypedRoutesNode(routes)
  const source = printer.printNode(EmitHint.Unspecified, node, sourceFile)
  return source
}

function createTypedRoutesNode(routes: Route) {
  return factory.createSourceFile(
    [
      factory.createVariableStatement(
        [factory.createToken(SyntaxKind.ExportKeyword)],
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier('routes'),
              undefined,
              undefined,
              factory.createObjectLiteralExpression(
                Object.entries(routes).map(([key, value]) =>
                  factory.createPropertyAssignment(
                    factory.createStringLiteral(key),
                    factory.createObjectLiteralExpression(
                      [
                        factory.createPropertyAssignment(
                          factory.createIdentifier('methods'),
                          factory.createAsExpression(
                            factory.createArrayLiteralExpression(
                              value.methods.map((method) => factory.createStringLiteral(method)),
                              false
                            ),
                            factory.createTypeReferenceNode(
                              factory.createIdentifier('const'),
                              undefined
                            )
                          )
                        ),
                        factory.createPropertyAssignment(
                          factory.createIdentifier('pattern'),
                          factory.createAsExpression(
                            factory.createStringLiteral(value.pattern),
                            factory.createTypeReferenceNode(
                              factory.createIdentifier('const'),
                              undefined
                            )
                          )
                        ),
                        factory.createPropertyAssignment(
                          factory.createIdentifier('params'),
                          value.params
                            ? factory.createAsExpression(
                                factory.createArrayLiteralExpression(
                                  value.params.map((param) => factory.createStringLiteral(param)),
                                  false
                                ),
                                factory.createTypeReferenceNode(
                                  factory.createIdentifier('const'),
                                  undefined
                                )
                              )
                            : factory.createIdentifier('undefined')
                        ),
                      ],
                      true
                    )
                  )
                ),
                true
              )
            ),
          ],
          NodeFlags.Const
        )
      ),
    ],
    factory.createToken(SyntaxKind.EndOfFileToken),
    NodeFlags.None
  )
}
