const path = require('path')

module.exports = {

  // Environment mode
  mode: 'development',

  // Entry point of app
  entry: resolveAppPath('src'),

  output: {

    // Development filename output
    filename: 'static/js/bundle.js',
  },
}
