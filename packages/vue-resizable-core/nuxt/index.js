const { resolve } = require('path')

module.exports = function nuxtPortalVue(options) {
    this.addPlugin({
        src: resolve(__dirname, 'plugin.js'),
        fileName: 'vue-resizable-core.js',
        options,
    })
};

module.exports.meta = require('../package.json');
