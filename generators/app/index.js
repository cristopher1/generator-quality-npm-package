import Generator from 'yeoman-generator'
import chalk from 'chalk'
import yosay from 'yosay'
import { GeneratorProvider } from './generator_components/GeneratorProvider.js'
import { PromptBuilder } from './generator_components/PromptBuilder.js'

export default class GeneratorQualityNpmPackage extends Generator {
  #promptBuilder
  #generatorProvider

  initializing() {
    this.#promptBuilder = new PromptBuilder()
    this.#generatorProvider = new GeneratorProvider()
  }

  async prompting() {
    const promptBuilder = this.#promptBuilder

    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the glorious ${chalk.red(
          'generator-quality-npm-package',
        )} generator!`,
      ),
    )

    promptBuilder.setOptions({ appname: this.appname })
    const prompts = promptBuilder.build()

    this.answers = await this.prompt(prompts)
  }

  async #addGit() {
    const generator = this.#generatorProvider.getGitGenerator()
    await this.composeWith(generator)
  }

  async #addEslint() {
    const generator = this.#generatorProvider.getEslintGenerator()
    await this.composeWith(generator)
  }

  async #addHusky() {
    const generator = this.#generatorProvider.getHuskyGenerator()
    await this.composeWith(generator)
  }

  async #addLintStaged() {
    const generator = this.#generatorProvider.getLintStagedGenerator()
    await this.composeWith(generator)
  }

  async #addPrettier() {
    const generator = this.#generatorProvider.getPrettierGenerator()
    await this.composeWith(generator)
  }

  async #addTypeScript() {
    const generator = this.#generatorProvider.getTypeScriptGenerator()
    await this.composeWith(generator)
  }

  async #addBabel(options) {
    const generator = this.#generatorProvider.getBabelGenerator()
    await this.composeWith(generator, options)
  }

  async #addJest(options) {
    const generator = this.#generatorProvider.getJestGenerator()
    await this.composeWith(generator, options)
  }

  async #addCommitLint(options) {
    const generator = this.#generatorProvider.getCommitLintGenerator()
    await this.composeWith(generator, options)
  }

  async #addRollup(options) {
    const generator = this.#generatorProvider.getRollupGenerator()
    await this.composeWith(generator, options)
  }

  async #addLicense(options) {
    const generator = this.#generatorProvider.getLicenseGenerator()
    await this.composeWith(generator, options)
  }

  async configuring() {
    const { packageType, includeLicense } = this.answers
    const packageConfig = packageType === 'module' ? { esmodules: true } : {}

    await this.#addGit()
    await this.#addEslint()
    await this.#addHusky()
    await this.#addLintStaged()
    await this.#addPrettier()
    await this.#addTypeScript()

    await this.#addBabel(packageConfig)
    await this.#addJest(packageConfig)
    await this.#addCommitLint(packageConfig)
    await this.#addRollup(packageConfig)

    if (includeLicense) {
      const licenseOptions = {
        name: this.answers.authorName,
        email: this.answers.authorEmail,
        website: this.answers.authorHomepage,
      }

      await this.#addLicense(licenseOptions)
    }
  }

  writing() {
    this.fs.copy(
      this.templatePath('src/index.js'),
      this.destinationPath('src/index.js'),
    )
    this.fs.copy(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
    )
  }

  #getKeywords(packageKeywords) {
    const keywords = packageKeywords.split(',')
    const keywordsWithoutSpaces = keywords.map((elemenet) => {
      return elemenet.trim()
    })

    if (keywordsWithoutSpaces.length === 1 && keywordsWithoutSpaces[0] === '') {
      return []
    }
    return keywordsWithoutSpaces
  }

  conflicts() {
    this.packageJson.merge({
      name: this.answers.packageName,
      description: this.answers.packageDescription,
      type: this.answers.packageType,
      author: {
        name: this.answers.authorName,
        email: this.answers.authorEmail,
        url: this.answers.authorHomepage,
      },
      repository: {
        url: this.answers.urlRepository,
      },
      bugs: {
        url: this.answers.urlRepository
          ? `${this.answers.urlRepository}/issues`
          : '',
      },
      keywords: this.#getKeywords(this.answers.packageKeywords),
      homepage: this.answers.packageWebsite,
    })

    if (this.answers.packageType === 'module') {
      this.packageJson.merge({
        scripts: {
          test: 'node --experimental-vm-modules node_modules/jest/bin/jest.js --verbose',
        },
      })
    }
  }

  #runGitInit() {
    console.log('\n********** Run git init command **********\n')
    this.spawnSync('git', ['init'])
  }

  #getDependencyManager(dependencyManagers) {
    for (const dependencyManager of dependencyManagers) {
      this.log(`Find ${dependencyManager}`)
      const isAvailable = this.#dependencyManagerAvailable(dependencyManager)
      if (isAvailable) {
        return dependencyManager
      }
    }
  }

  #dependencyManagerAvailable(name) {
    try {
      this.spawnSync(`${name}`, ['--version'])
      return true
    } catch (err) {
      return false
    }
  }

  #runPackageScripts(dependencyManager) {
    console.log('\n********** Run scripts from package.json **********')
    const scriptArguments = [
      ['init'],
      ['documentation:create'],
      ['test'],
      ['build'],
    ]
    for (const args of scriptArguments)
      this.spawnSync(`${dependencyManager}`, ['run', ...args])
  }

  #runGoodBye() {
    this.log('\n')
    this.log('****************************************************')
    this.log('****************************************************')
    this.log('********                                    ********')
    this.log('******    Thanks for to use this generator    ******')
    this.log('****                                            ****')
    this.log('******     The project structure is ready     ******')
    this.log('********                                    ********')
    this.log('****************************************************')
    this.log('****************************************************')
    this.log('\n')
  }

  end() {
    const dependencyManagers = ['yarn', 'npm']
    const { runGitInit, runPackageScripts } = this.answers

    if (runGitInit) {
      this.#runGitInit()
    }

    if (runPackageScripts) {
      const dependencyManager = this.#getDependencyManager(dependencyManagers)
      this.log(`using ${dependencyManager}`)

      this.#runPackageScripts(dependencyManager)
    }

    this.#runGoodBye()
  }
}
