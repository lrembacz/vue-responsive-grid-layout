module.exports = {
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/src/**/*.{js,ts,vue}',
        '!**/*.d.ts',
        '!<rootDir>/src/index.ts'
    ],
    resetModules: true,
    restoreMocks: true,
    modulePaths: ['<rootDir>'],
    modulePathIgnorePatterns: [
        '<rootDir>/node_modules',
        '<rootDir>/dist',
        '<rootDir>/develop'
    ],
    moduleFileExtensions: ['ts', 'js', 'json', 'vue'],
    prettierPath: '<rootDir>/node_modules/prettier',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
        '.*\\.(vue)$': 'vue-jest',
        '^.+\\.(js)$': '<rootDir>/node_modules/babel-jest'
    },
    transformIgnorePatterns: ['/node_modules/(?!MODULE_NAME_HERE).+\\.js$']
};
