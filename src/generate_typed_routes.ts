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
const execPromise = promisify(exec)

const command = 'node ace list:routes --json'
const outputPath = 'node_modules/@7nohe/adonis-typed-links/build/generated'
const jsFileName = 'routes.js'
const dtsFileName = 'routes.d.ts'

type Route = Record<string, { methods: string[]; pattern: string; params?: string[] }>

const reducer = (
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
}

export async function generateTypedRoutes() {
  const { stderr, stdout } = await execPromise(command)

  if (stderr) {
    console.error(stderr)
  }

  const json = JSON.parse(stdout) as {
    domain: string
    routes: {
      name: string
      methods: string[]
      pattern: string
    }[]
  }[]

  const filtered = json
    .find((item) => item.domain === 'root')
    ?.['routes'].filter((item) => item.name !== undefined)

  const routes = filtered?.reduce(reducer, {} as Route)

  const getRoutes = filtered
    ?.filter((route) => route.methods.includes('GET'))
    .reduce(reducer, {} as Route)
  const postRoutes = filtered
    ?.filter((route) => route.methods.includes('POST'))
    .reduce(reducer, {} as Route)
  const patchRoutes = filtered
    ?.filter((route) => route.methods.includes('PATCH'))
    .reduce(reducer, {} as Route)
  const putRoutes = filtered
    ?.filter((route) => route.methods.includes('PUT'))
    .reduce(reducer, {} as Route)
  const deleteRoutes = filtered
    ?.filter((route) => route.methods.includes('DELETE'))
    .reduce(reducer, {} as Route)

  if (routes) {
    const source = createTypedRoutesSource(routes, 'routes')
    const getSource = createTypedRoutesSource(getRoutes ?? {}, 'getRoutes')
    const postSource = createTypedRoutesSource(postRoutes ?? {}, 'postRoutes')
    const patchSource = createTypedRoutesSource(patchRoutes ?? {}, 'patchRoutes')
    const putSource = createTypedRoutesSource(putRoutes ?? {}, 'putRoutes')
    const deleteSource = createTypedRoutesSource(deleteRoutes ?? {}, 'deleteRoutes')
    createRoutesSource(
      `${source}\n${getSource}\n${postSource}\n${patchSource}\n${putSource}\n${deleteSource}`
    )
  } else {
    console.error('No routes found')
  }
}

function createRoutesSource(source: string) {
  const js = transpile(source, { target: ScriptTarget.ESNext })
  const { outputText } = transpileDeclaration(source, {
    compilerOptions: {
      strict: true,
    },
  })

  print(jsFileName, js, outputPath)
  print(dtsFileName, outputText, outputPath)
}

function createTypedRoutesSource(routes: Route, variableName: string) {
  const sourceFile = createSourceFile(jsFileName, '', ScriptTarget.Latest, false, ScriptKind.TS)
  const printer = createPrinter({ newLine: NewLineKind.LineFeed })
  const node = createTypedRoutesNode(routes, variableName)
  const source = printer.printNode(EmitHint.Unspecified, node, sourceFile)
  return source
}

function createTypedRoutesNode(routes: Route, variableName: string) {
  return factory.createSourceFile(
    [
      factory.createVariableStatement(
        [factory.createToken(SyntaxKind.ExportKeyword)],
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              factory.createIdentifier(variableName),
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
