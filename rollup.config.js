import typescript from 'rollup-plugin-typescript2';
import vue from 'rollup-plugin-vue';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import replace from 'rollup-plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

const path = require('path');
const PACKAGE_ROOT_PATH = process.cwd();
const INPUT_FILE = path.join(PACKAGE_ROOT_PATH, 'src/index.ts');
const PKG_JSON = require(path.join(PACKAGE_ROOT_PATH, 'package.json'));

const builds = {
    cjs: {
        output: {
            file: PKG_JSON.browser,
            format: 'cjs',
            sourcemap: true
        }
    },
    esm: {
        output: {
            file: PKG_JSON.module,
            format: 'esm',
            sourcemap: true
        }
    },
    umd: {
        output: {
            file: PKG_JSON.main,
            format: 'umd',
            name: PKG_JSON.buildOptions.name,
            globals: {
                vue: 'Vue'
            }
        }
    }
};

export default Object.keys(builds).map(format => ({
    input: INPUT_FILE,
    output: builds[format].output,
    external: format !== 'umd' ? [...Object.keys(PKG_JSON.peerDependencies)] : ['vue'],
    plugins: [
        nodeResolve(),
        commonjs(),
        typescript({
            tsconfig: path.join(PACKAGE_ROOT_PATH, 'tsconfig.build.json'),
            useTsconfigDeclarationDir: true
        }),
        replace({
            ...(format === 'umd' && {'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)}),
            'process.env.ROLLUP_BUILD_FORMAT': JSON.stringify(format),
        }),
        vue({
            css: false
        }),
        getBabelOutputPlugin({
            presets: [
                [
                    '@babel/preset-env',
                    {
                        modules: false,
                        useBuiltIns: false
                    }
                ]
            ],
            plugins: ['@babel/plugin-proposal-object-rest-spread'],
            allowAllFormats: true
        })
    ]
}));
