import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default [
  // browser-friendly UMD build
  {
    input: 'src/index.ts',
    output: {
      name: 'lino',
      file: pkg.browser,
      format: 'umd',
      sourcemap: true
    },
    plugins: [
      babel({
        exclude: 'node_modules/**'
      }),
      builtins(),
      globals(),
      json(),
      commonjs({
        namedExports: {
          'node_modules/elliptic/lib/elliptic.js': ['ec']
        }
      }),
      resolve({
        browser: true
      }),
      typescript({
        tsconfig: 'tsconfig.json'
      })
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/index.ts',
    external: Object.keys(pkg.dependencies),
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true
      }
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: 'tsconfig.json'
      })
    ]
  }
];
