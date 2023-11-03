import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import assert from 'yeoman-assert'
import helpers from 'yeoman-test'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('generator-quality-npm-package:app', () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/app'))
      .withPrompts({ someAnswer: true })
  })

  it('creates files', () => {
    assert.file(['dummyfile.txt'])
  })
})
