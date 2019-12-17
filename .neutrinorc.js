const standard = require('@neutrinojs/standardjs');
const node = require('@neutrinojs/node');
const jest = require('@neutrinojs/jest');
const babelMerge = require('babel-merge');

function ymlLoader (neutrino) {
  neutrino.config.module
  .rule('yml')
    .test(/\.(yml|yaml)$/)
    .use('yml')
      .loader(require.resolve('js-yaml-loader'))
}

function babelLoader (neutrino) {
  neutrino.config.module
  .rule('compile')
  .use('babel')
  .tap(options =>
    babelMerge(
      {
        plugins: [
          require.resolve('@babel/plugin-proposal-optional-chaining'),
        ],
      },
      options,
    ),
  );


}

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    standard(),
    node(),
    jest({
      'moduleFileExtensions': ['yaml', 'yml'],
      'transform': {
        '\\.y?ml$': 'yaml-jest'
      }
    }),
    ymlLoader,
    babelLoader,
  ],
};
