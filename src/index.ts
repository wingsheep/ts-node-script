import fs from 'fs/promises'
import path from 'path'
import type { DataItem } from './types'

/**
 * 生成枚举文件
 *
 * @default ./src/enumByGenerate.ts
 */
export const generateEnumFile = async (data: DataItem[], ...pathSegments: string[]): Promise<string> => {
  const _pathSegments = pathSegments && pathSegments.length ? pathSegments : ['./src/enumByGenerate.ts']
  let output = '// eslint-disable-next-line @typescript-eslint/comma-dangle\nexport enum AUTH_KEY {\n  '
  output += data.map(item => `${item.identifier} = '${item.name}'`).join(',\n  ')
  output += '\n}\n'
  await fs.writeFile(path.resolve(..._pathSegments), output)
  return output
}
