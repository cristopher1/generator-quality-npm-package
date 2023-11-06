import Generator from 'yeoman-generator'
import chalk from 'chalk'
import yosay from 'yosay'

export default class extends Generator {
  #getKeywords(packageKeywords) {
    const keywords = packageKeywords.split(',')

    // There are not keywords
    if (keywords.length === 1 && keywords[0] === '') {
      return []
    }
    return keywords
  }

  #copyNormalFilesAndDirectories(src, dst = '') {
    // Copy all directories. It does not include the dotfiles.
    this.fs.copy(this.templatePath(`${src}/**/*`), this.destinationPath(dst))
  }

  #copyDotFiles(src, dst = '') {
    // Copy all directories. It includes the dotfiles.
    this.fs.copy(this.templatePath(`${src}/**/.*`), this.destinationPath(dst))
  }

  #copyDotDirectories(src, dst = '') {
    // Copy all dotdirectories. It does not include the dotfiles.
    this.fs.copy(this.templatePath(`${src}/.**/*`), this.destinationPath(dst))
  }

  #copyNormalTemplates(src, templateData, dst = '') {
    this.fs.copyTpl(
      this.templatePath(`${src}/**/*`),
      this.destinationPath(dst),
      templateData,
    )
  }

  #copyCommonStructureContent(rootDir) {
    this.#copyNormalFilesAndDirectories(rootDir)
    this.#copyDotFiles(rootDir)
    this.#copyDotDirectories(rootDir)
  }

  #copyTypePackageContent(packageType) {
    switch (packageType) {
      case 'esmodules':
        this.#copyEsModuleContent(packageType)
        break
      default:
        this.#copyCommonjsContent(packageType)
    }
  }

  #copyCommonjsContent(rootDir) {
    this.#copyNormalFilesAndDirectories(rootDir)
  }

  #copyEsModuleContent(rootDir) {
    this.#copyNormalFilesAndDirectories(rootDir)
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
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the glorious ${chalk.red(
          'generator-quality-npm-package',
        )} generator!`,
      ),
    )

    const prompts = [
      {
        type: 'input',
        name: 'packageName',
        message: "Project's name",
        default: this.appname,
      },
      {
        type: 'input',
        name: 'packageDescription',
        message: "Project's description",
        default: '',
      },
      {
        type: 'input',
        name: 'packageHomePageUrl',
        message: 'Project homepage url',
        default: '',
      },
      {
        type: 'input',
        name: 'authorName',
        message: "Author's name",
        default: '',
      },
      {
        type: 'input',
        name: 'authorEmail',
        message: "Author's email",
        default: '',
      },
      {
        type: 'input',
        name: 'authorHomePage',
        message: "Author's homepage",
        default: '',
      },
      {
        type: 'input',
        name: 'urlRepository',
        message: 'Github repository url',
        default: '',
      },
      {
        type: 'input',
        name: 'packageKeywords',
        message: 'Package keywords (comman to split)',
        default: '',
      },
      {
        type: 'input',
        name: 'packageWebsite',
        message: 'Your package website',
        default: '',
      },
      {
        type: 'list',
        name: 'packageType',
        message:
          'Do you want to use the field type:commonjs or type:module into package.json',
        choices: [
          {
            name: 'commonjs',
            value: 'commonjs',
          },
          {
            name: 'module',
            value: 'module',
          },
        ],
        default: 'commonjs',
      },
      {
        type: 'list',
        name: 'runGitInit',
        message:
          'Do you want to run git init automatically, then installing the dependencies',
        choices: [
          {
            name: 'yes',
            value: true,
          },
          {
            name: 'no',
            value: false,
          },
        ],
        default: true,
      },
      {
        type: 'list',
        name: 'runPackageScripts',
        message: `Do you want to run the configuration package scripts automatically, then installing the dependencies`,
        choices: [
          {
            name: 'yes',
            value: true,
          },
          {
            name: 'no',
            value: false,
          },
        ],
        default: true,
      },
    ]

    this.answers = await this.prompt(prompts)
  }

  writing() {
    const commonStructure = 'common_structure'
    this.#copyCommonStructureContent(commonStructure)

    const { packageType } = this.answers
    this.#copyTypePackageContent(packageType)

    this.answers.keywords = this.#getKeywords(this.answers.packageKeywords)

    const templateFiles = `template_files/${packageType}`
    this.#copyNormalTemplates(templateFiles, this.answers)
  }

  install() {}

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
