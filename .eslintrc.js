module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    parser: 'vue-eslint-parser',
    plugins: ['@typescript-eslint', 'eslint-plugin-prettier'],
    extends: [
        'plugin:vue/recommended',
        'eslint-config-prettier',
        'eslint-config-prettier/vue',
        'plugin:@typescript-eslint/eslint-recommended'
    ],
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2018,
        sourceType: 'module',
        extraFileExtensions: ['.vue']
    },
    rules: {
        'prettier/prettier': 'error'
    }
};
