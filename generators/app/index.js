import Generator from 'yeoman-generator'
import chalk from 'chalk'
import yosay from 'yosay'

export default class extends Generator {
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

  #copyNormalTemplates(src, templateData, dts = '') {
    this.fs.copyTpl(
      this.templatePath(`${src}/**/*`),
      this.destinationPath(dts),
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
    this.#copyDotFiles(rootDir)
  }

  #copyEsModuleContent(rootDir) {
    this.#copyNormalFilesAndDirectories(rootDir)
  }

  #RunGitInit() {
    console.log('***** Run git init command *****')
    this.spawnSync('git', ['init'])
  }

  #ObtainDependencyManager(dependencyManagers) {
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

  #RunPackageJsonScripts(dependencyManager) {
    console.log('***** Run scripts from package.json *****')
    this.spawnSync(`${dependencyManager}`, ['run', 'init'])
    this.spawnSync(`${dependencyManager}`, ['run', 'documentation:create'])
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
        name: 'packageKeywords',
        message: 'Package keywords (comman to split)',
        default: '',
      },
      {
        type: 'input',
        name: 'yourWebSite',
        message: 'Your website',
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
            name: 'esmodules',
            value: 'esmodules',
          },
        ],
        default: 'commonjs',
      },
      {
        type: 'list',
        name: 'runCommands',
        message:
          'Do you want to run some commands automatically to init the package. For example: git init, documentation:create, etc',
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

    const templateFiles = `template_files/${packageType}`
    this.#copyNormalTemplates(templateFiles, this.answers)
  }

  install() {
    this.addDependencies({
      '@babel/runtime-corejs3': '^7.22.11',
      'core-js': '^3.32.1',
    })
    this.addDevDependencies({
      '@babel/cli': '^7.22.10',
      '@babel/core': '^7.22.10',
      '@babel/plugin-transform-runtime': '^7.22.10',
      '@babel/preset-env': '^7.22.10',
      '@commitlint/cli': '^17.8.0',
      '@commitlint/config-conventional': '^17.8.0',
      '@faker-js/faker': '^8.0.2',
      '@rollup/plugin-babel': '^6.0.3',
      '@rollup/plugin-node-resolve': '^15.2.0',
      eslint: '^8.47.0',
      'eslint-config-prettier': '^9.0.0',
      'eslint-config-standard': '^17.1.0',
      'eslint-plugin-import': '^2.28.1',
      'eslint-plugin-jest': '^27.2.3',
      'eslint-plugin-jsdoc': '^46.8.2',
      'eslint-plugin-n': '^16.0.2',
      'eslint-plugin-promise': '^6.1.1',
      husky: '^8.0.3',
      jest: '^29.7.0',
      'lint-staged': '^14.0.1',
      prettier: '^3.0.2',
      'prettier-plugin-jsdoc': '^1.1.1',
      'readme-md-generator': '^1.0.0',
      rimraf: '^5.0.1',
      rollup: '^3.28.0',
      'rollup-plugin-dts': '^6.1.0',
      typescript: '^5.2.2',
    })
  }

  end() {
    const { runCommands } = this.answers

    if (runCommands) {
      const dependencyManagers = ['yarn', 'npm']
      const dependencyManager =
        this.#ObtainDependencyManager(dependencyManagers)
      this.log(`using ${dependencyManager}`)

      this.#RunGitInit()
      this.#RunPackageJsonScripts(dependencyManager)
    }
  }
}
