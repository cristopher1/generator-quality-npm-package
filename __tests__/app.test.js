import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { jest } from '@jest/globals'
import assert from 'yeoman-assert'
import helpers from 'yeoman-test'

jest.mock('generator-license/app', () => {
  return helpers.createDummyGenerator()
})

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
    describe('Should create the project structure correctly when', () => {
      it('The runGitInit and runPackageScripts options are not used', async () => {
        // Arrange
        const baseStructure = getBaseStructure()
        const commojsBaseStructure = getCommonjsStructure()
        const commonjsStructure = [...baseStructure, ...commojsBaseStructure]

        // Act
        await helpers
          .run(path.join(__dirname, '../generators/app'))
          .withPrompts({ runGitInit: false, runPackageScripts: false })

        // Assert
        assert.file(commonjsStructure)
      })
    })
  })
  describe('esmodules', () => {
    describe('Should create the project structure correctly when', () => {
      it('The runGitInit and runPackageScripts options are not used', async () => {
        // Arrange
        const baseStructure = getBaseStructure()
        const esmodulesBaseStructure = getEsmodulesStructure()
        const esmodulesStructure = [...baseStructure, ...esmodulesBaseStructure]

        // Act
        await helpers
          .run(path.join(__dirname, '../generators/app'))
          .withPrompts({
            packageType: 'module',
            runGitInit: false,
            runPackageScripts: false,
          })

        // Assert
        assert.file(esmodulesStructure)
      })
    })
  })
})
