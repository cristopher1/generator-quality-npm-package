export class PromptBuilder {
  #options = {}

  setOptions(options) {
    this.#options = options
  }

  build() {
    return [
      {
        type: 'input',
        name: 'packageName',
        message: "Project's name",
        default: this.#options.appname,
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
        name: 'authorHomepage',
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
        message: `Do you want to automatically run the scripts that configure the package, then installing the dependencies`,
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
        name: 'includeLicense',
        message: 'Do you want to use a lincese for this package?',
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
        default: false,
      },
    ]
  }
}
