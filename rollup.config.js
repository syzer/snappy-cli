import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import typescript from '@rollup/plugin-typescript';
import shebang from 'rollup-plugin-preserve-shebang';

export default [{
    input: 'lib/main.ts',
    output: {
        file: 'bin/cli.js',
        format: 'cjs'
    },
    plugins: [
        shebang(),
        typescript({
            exclude: '**/*.spec.ts'
        }),
        babel({
            babelHelpers: 'bundled'
        }),
        nodeResolve({
            resolveOnly: ['yargs']
        }),
        commonjs(),
        terser({
            output: {
                comments: false
            }
        })
    ]
}];