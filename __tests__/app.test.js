import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import assert from 'yeoman-assert'
import helpers from 'yeoman-test'

const getBaseStructure = () => [
  '__tests__/helpers/index.js',
  '__tests__/index.test.js',
  'src/index.js',
  '.eslintignore',
  '.eslintrc.json',
  '.gitignore',
  '.lintstagedrc.json',
  'tsconfig.json',
  'package.json',
  '.prettierignore',
  '.prettierrc.json',
  'babel.config.json',
  'commitlint.config.js',
  'jest.config.js',
]

const getCommonjsStructure = () => ['rollup.config.mjs']

const getEsmodulesStructure = () => ['rollup.config.js']

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('generator-quality-npm-package:app', () => {
  describe('commonjs', () => {
    it('Should create the project structure correctly', async () => {
      // Arrange
      const baseStructure = getBaseStructure()
      const commojsBaseStructure = getCommonjsStructure()
      const commonjsStructure = [...baseStructure, ...commojsBaseStructure]

      // Act
      await helpers
        .run(path.join(__dirname, '../generators/app'))
        .withPrompts({ runCommands: false })

      // Assert
      assert.file(commonjsStructure)
    })
  })
  describe('esmodules', () => {
    it('Should create the project structure correctly', async () => {
      // Arrange
      const baseStructure = getBaseStructure()
      const esmodulesBaseStructure = getEsmodulesStructure()
      const esmodulesStructure = [...baseStructure, ...esmodulesBaseStructure]

      // Act
      await helpers
        .run(path.join(__dirname, '../generators/app'))
        .withPrompts({ packageType: 'module', runCommands: false })

      // Assert
      assert.file(esmodulesStructure)
    })
  })
})
