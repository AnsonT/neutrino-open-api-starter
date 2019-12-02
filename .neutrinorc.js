const standard = require('@neutrinojs/standardjs');
const node = require('@neutrinojs/node');
const jest = require('@neutrinojs/jest');

function ymlLoader (neutrino) {
  neutrino.config.module
  .rule('yml')
    .test(/\.(yml|yaml)$/)
    .use('yml')
      .loader(require.resolve('js-yaml-loader'))
}

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    standard(),
    node(),
    jest(),
    ymlLoader,
  ],
};
