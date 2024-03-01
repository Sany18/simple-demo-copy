require('dotenv').config({ path: '../.env' });

const common = require('./webpack.common.js');
const path = require('path');

module.exports = {
  ...common,
  devServer: {
    static: {
      directory: path.resolve(__dirname, '..', '_dist', 'synthwave'),
    },
    compress: true,
    port: process.env.GAME_SYNTHWAVE_FE_PORT,
  }
}
