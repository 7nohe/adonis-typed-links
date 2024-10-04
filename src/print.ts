import fs from 'node:fs'
import path from 'node:path'

export function print(filename: string, result: string, outputPath: string) {
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true })
  }

  fs.writeFileSync(path.join(outputPath, filename), result)
}
