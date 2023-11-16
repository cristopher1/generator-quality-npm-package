import Generator from 'yeoman-generator'

export default class GeneratorJset extends Generator {
  constructor(args, opts) {
    super(args, opts)

    this.option('esmodules')

    this.packageType = this.options.esmodules ? 'esmodules' : 'commonjs'
  }

  writing() {
    const { packageType } = this

    this.fs.copy(
      this.templatePath('./__tests__/**/*'),
      this.destinationPath('__tests__'),
    )

    this.fs.copy(
      this.templatePath(`./${packageType}/*`),
      this.destinationPath(''),
    )
  }
}
