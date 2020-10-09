const path = require('path')
const webpack = require('webpack')
const { version } = require('../../package.json')

module.exports = {
    base: '/vue-responsive-grid-layout/',
    title: 'Vue Responsive Grid Layout',
    description:
        "Vue components to make responsive, draggable and resizable grid layout.",
    markdown: {
        lineNumbers: true,
    },
    head: [
        ['script', { src: 'https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js' }],
    ],
    chainWebpack: config => {
        config.plugin('version-env').use(webpack.EnvironmentPlugin, [
            {
                VERSION: version,
            },
        ])

        config.resolve.alias
            .set('vue-draggable-core', path.resolve(__dirname, '../../packages/vue-draggable-core/dist/vue-draggable-core.esm.js'));
        config.resolve.alias
            .set('vue-resizable-core', path.resolve(__dirname, '../../packages/vue-resizable-core/dist/vue-resizable-core.esm.js'));
        config.resolve.alias
            .set('vue-responsive-grid-layout', path.resolve(__dirname, '../../packages/vue-responsive-grid-layout/dist/vue-responsive-grid-layout.esm.js'));
        },
    themeConfig: {
        repo: 'lrembacz/vue-responsive-grid-layout',
        repoLabel: 'GitHub',
        docsDir: 'docs',
        docsBranch: 'next',
        editLinks: true,
        editLinkText: 'Help improve these docs!',
        sidebarDepth: 2,
        nav: [
            { text: 'Installation', link: '/guide/installation' },
            {
                text: 'Guide',
                items: [
                    { text: 'Getting Started', link: '/guide/getting-started' },
                ],
            },
            {
                text: 'API',
                items: [
                    {
                        text: 'Components',
                        items: [
                            { text: 'VueGridLayout', link: '/api/vue-grid-layout' },
                            { text: 'VueResponsiveGridLayout', link: '/api/vue-responsive-grid-layout' },
                            { text: 'VueDraggableCore', link: '/api/vue-draggable-core' },
                            { text: 'VueResizableCore', link: '/api/vue-resizable-core' },
                        ],
                    },
                ],
            },
        ],
    },
    plugins: [
        'demo-block',
        [
            'vuepress-plugin-typescript',
            {
                tsLoaderOptions: {
                    // All options of ts-loader
                },
            },
        ],
    ],
}