import Generator from 'yeoman-generator'
import chalk from 'chalk'
import yosay from 'yosay'
import { createRequire } from 'node:module'
import { GeneratorProvider } from './generator_components/GeneratorProvider.js'
import { PromptBuilder } from './generator_components/PromptBuilder.js'

import GeneratorLicense from 'generator-license/app/index.js'

const require = createRequire(import.meta.url)

export default class GeneratorQualityNpmPackage extends Generator {
  #promptBuilder
  #generatorProvider

  constructor(args, opts) {
    super(args, opts)

    this.#promptBuilder = new PromptBuilder()
    this.#generatorProvider = new GeneratorProvider()
  }

  #getKeywords(packageKeywords) {
    const keywords = packageKeywords.split(',')

    if (keywords.length === 1 && keywords[0] === '') {
      return []
    }
    return keywords
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

    this.composeWith(
      {
        Generator: GeneratorLicense,
        path: require.resolve('generator-license/app'),
      },
      {
        name: this.answers.authorName,
        email: this.answers.authorEmail,
        website: this.answers.authorHomepage,
      },
    )
  }

  writing() {
    this.fs.copy(this.templatePath('./**/*'), this.destinationPath(''))

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

  #addGit() {
    const generator = this.#generatorProvider.getGitGenerator()
    this.composeWith(generator)
  }

  #addEslint() {
    const generator = this.#generatorProvider.getEslintGenerator()
    this.composeWith(generator)
  }

  #addHusky() {
    const generator = this.#generatorProvider.getHuskyGenerator()
    this.composeWith(generator)
  }

  #addLintStaged() {
    const generator = this.#generatorProvider.getLintStagedGenerator()
    this.composeWith(generator)
  }

  #addPrettier() {
    const generator = this.#generatorProvider.getPrettierGenerator()
    this.composeWith(generator)
  }

  #addTypeScript() {
    const generator = this.#generatorProvider.getTypeScriptGenerator()
    this.composeWith(generator)
  }

  #addBabel(options) {
    const generator = this.#generatorProvider.getBabelGenerator()
    this.composeWith(generator, options)
  }

  #addJest(options) {
    const generator = this.#generatorProvider.getJestGenerator()
    this.composeWith(generator, options)
  }

  #addCommitLint(options) {
    const generator = this.#generatorProvider.getCommitLintGenerator()
    this.composeWith(generator, options)
  }

  #addRollup(options) {
    const generator = this.#generatorProvider.getRollupGenerator()
    this.composeWith(generator, options)
  }

  default() {
    const { packageType } = this.answers
    const packageConfig = packageType === 'module' ? { esmodules: true } : {}

    this.#addGit()
    this.#addEslint()
    this.#addHusky()
    this.#addLintStaged()
    this.#addPrettier()
    this.#addTypeScript()

    this.#addBabel(packageConfig)
    this.#addJest(packageConfig)
    this.#addCommitLint(packageConfig)
    this.#addRollup(packageConfig)
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
