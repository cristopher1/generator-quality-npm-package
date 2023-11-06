import path from 'path'
import { defineConfig } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'
import { dts } from 'rollup-plugin-dts'

const getOutputFile = (basePath, { outputDir, name, extension }) => {
  return path.resolve(basePath, outputDir, `${name}.${extension}`)
}

// file information
const CJS_FILE = {
  extension: 'cjs',
  format: 'cjs',
  name: 'index',
  outputDir: 'cjs',
  babelEnvName: 'buildCommonJS',
}
const DTS_FILE = {
  extension: 'd.ts',
  format: 'es',
  name: 'index',
  outputDir: 'types',
}

// input files
const INPUT_SRC_FILE = 'generators/app/index.js'
const INPUT_DTS_FILE = 'dist/tmp/types/index.d.ts'

// transpiled files
const BASE_DIR = 'dist'
const OUTPUT_CJS_FILE = getOutputFile(BASE_DIR, CJS_FILE)

// type declaration file
const OUTPUT_DTS_FILE = getOutputFile(BASE_DIR, DTS_FILE)

// getBabelOutputPlugin configuration
const BABEL_CONFIG_FILE = path.resolve('.', 'babel.config.json')

export default defineConfig([
  {
    input: INPUT_SRC_FILE,
    output: [
      {
        file: OUTPUT_CJS_FILE,
        format: CJS_FILE.format,
        sourcemap: true,
        plugins: [
          getBabelOutputPlugin({
            configFile: BABEL_CONFIG_FILE,
            envName: CJS_FILE.babelEnvName,
          }),
        ],
      },
    ],
    external: [/node_module/],
    plugins: [nodeResolve()],
  },
  {
    input: INPUT_DTS_FILE,
    output: [
      {
        file: OUTPUT_DTS_FILE,
        format: DTS_FILE.format,
      },
    ],
    plugins: [dts()],
  },
])
