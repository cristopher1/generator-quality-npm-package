import path from 'path'
import { defineConfig } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'

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

// input files
const INPUT_SRC_FILE = 'src/index.js'

// transpiled files
const BASE_DIR = 'dist'
const OUTPUT_CJS_FILE = getOutputFile(BASE_DIR, CJS_FILE)

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
])
