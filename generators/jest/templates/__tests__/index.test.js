import { faker } from './helpers'
import { getGreeting } from '../../../app/templates/src/index.js'

const filePath = 'src/index.js'

describe(`export function getGreeting (${filePath})`, () => {
  it('Should return a string that includes the hello word', () => {
    // Arrange
    const string = faker.string.sample()

    // Act
    const result = getGreeting(string)

    // Assert
    expect(result).toMatch(/hello /i)
  })
})
