const { resolve } = require('path')

module.exports = function nuxtPortalVue() {
    this.addPlugin({
        src: resolve(__dirname, 'plugin.js'),
        fileName: 'vue-responsive-grid-layout.js',
    })
}

module.exports.meta = require('../../../package.json')