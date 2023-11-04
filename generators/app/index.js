import Generator from 'yeoman-generator'
import chalk from 'chalk'
import yosay from 'yosay'

export default class extends Generator {
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
        name: 'projectName',
        message: "Project's name",
        default: this.appname,
      },
      {
        type: 'input',
        name: 'projectDescription',
        message: "Project's description",
        default: '',
      },
      {
        type: 'input',
        name: 'projectHomePageUrl',
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
    ]

    const answers = await this.prompt(prompts)
    return answers
  }

  writing() {
    this.fs.copy(
      this.templatePath('dummyfile.txt'),
      this.destinationPath('dummyfile.txt'),
    )
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
}
