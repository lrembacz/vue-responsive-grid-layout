const { resolve } = require('path')

module.exports = function nuxtPortalVue(options) {
    this.addPlugin({
        src: resolve(__dirname, 'plugin.js'),
        fileName: 'vue-draggable-core.js',
        options,
    })
};

module.exports.meta = require('../package.json');
