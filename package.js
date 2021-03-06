/* eslint-disable strict, indent, max-len, quote-props, quotes, no-underscore-dangle */

'use strict';

// ===============================================
// Basic config
// ===============================================
const NAME = 'docx-templates';
const VERSION = '2.1.1';
const DESCRIPTION = 'Template-based docx report creation';
const KEYWORDS = ['docx', 'office', 'word', 'ms-word', 'report', 'template'];

// ===============================================
// Helpers
// ===============================================
const runMultiple = (arr) => arr.join(' && ');
const runTestCov = (env, name) => {
  const envStr = env != null ? `${env} ` : '';
  return runMultiple([
    `cross-env ${envStr}jest --coverage`,
    `mv .nyc_output/coverage-final.json .nyc_tmp/coverage-${name}.json`,
    'rm -rf .nyc_output',
  ]);
};

// ===============================================
// Specs
// ===============================================
const specs = {

  // -----------------------------------------------
  // General
  // -----------------------------------------------
  name: NAME,
  version: VERSION,
  description: DESCRIPTION,
  main: 'lib/index.js',
  author: 'Guillermo Grau Panea',
  license: 'MIT',
  keywords: KEYWORDS,
  homepage: `https://github.com/guigrpa/${NAME}#readme`,
  bugs: { url: `https://github.com/guigrpa/${NAME}/issues` },
  repository: { type: 'git', url: `git+https://github.com/guigrpa/${NAME}.git` },

  // -----------------------------------------------
  // Scripts
  // -----------------------------------------------
  scripts: {

    // Top-level
    compile:                    runMultiple([
                                  'rm -rf ./lib',
                                  'mkdir lib',
                                  'babel --out-dir lib --ignore "**/__mocks__/**","**/__tests__/**" src',
                                  'flow-copy-source -i "**/__mocks__/**" -i "**/__tests__/**" src lib',
                                ]),
    docs:                       'extract-docs --template docs/templates/README.md --output README.md',
    build:                      runMultiple([
                                  'node package',
                                  'npm run lint',
                                  'npm run flow',
                                  'npm run test',
                                  'npm run compile',
                                  'npm run docs',
                                  'npm run xxl',
                                ]),
    travis:                     runMultiple([
                                  'npm run compile',
                                  'npm run test',
                                ]),

    // Static analysis
    lint:                       'eslint src',
    flow:                       'flow check || exit 0',
    xxl:                        "xxl --src src",

    // Testing - general
    jest:                       'jest --watch --coverage',
    'jest-html':                'jest-html --snapshot-patterns "src/**/*.snap"',
    test:                       'npm run testCovFull',
    testFast:                   'jest',
    testCovFull:                runMultiple([
                                  'npm run testCovPrepare',
                                  'npm run testDev',
                                  // 'npm run testProd',
                                  'npm run testCovReport',
                                ]),

    // Testing - steps
    testCovPrepare:             runMultiple([
                                  'rm -rf ./coverage .nyc_output .nyc_tmp',
                                  'mkdir .nyc_tmp',
                                ]),
    testDev:                    runTestCov('NODE_ENV=development', 'dev'),
    testProd:                   runTestCov('NODE_ENV=production', 'prod'),
    testCovReport:              runMultiple([
                                  'cp -r .nyc_tmp .nyc_output',
                                  'nyc report --reporter=html --reporter=lcov --reporter=text',
                                ]),
  },


  // -----------------------------------------------
  // Deps
  // -----------------------------------------------
  engines: {
    node: '>=6',
  },

  dependencies: {
    timm: '1.2.3',
    bluebird: '3.4.6',
    'fs-extra': '1.0.0',
    archiver: '1.3.0',
    fstream: '1.0.10',
    unzip: '0.1.11',
    sax: '1.2.1',
    uuid: '3.0.1',
    globby: '6.1.0',
  },

  devDependencies: {
    storyboard: '^2.3.1',
    'isomorphic-fetch': '2.2.1',
    'xxl': '^1.0.0',
    'cross-env': '3.1.3',

    // Babel (except babel-eslint)
    'babel-cli': '6.18.0',
    'babel-core': '6.20.0',
    // 'babel-polyfill': '6.20.0',
    'babel-preset-es2015': '6.18.0',
    'babel-preset-stage-0': '6.16.0',
    'babel-preset-react': '6.16.0',

    // Linting
    'eslint': '3.14.0',
    'eslint-config-airbnb': '13.0.0',
    'eslint-plugin-flowtype': '2.29.1',
    'eslint-plugin-import': '2.2.0',
    'eslint-plugin-jsx-a11y': '2.2.3',
    'eslint-plugin-react': '6.8.0',
    'babel-eslint': '7.1.1',

    // Documentation
    'extract-docs': '^1.4.0',

    // Testing
    'jest': '18.0.0',
    'babel-jest': '18.0.0',
    'jest-html': '^1.3.3',

    // Coverage testing
    'nyc': '10.0.0',
    coveralls: '2.11.15',

    // Other tools
    'flow-bin': '0.38.0',
    'flow-copy-source': '1.1.0',
  },

  // -----------------------------------------------
  // Other configs
  // -----------------------------------------------
  jest: {
    testRegex: 'src/.*__tests__/.*\\.(test|spec)\\.(js|jsx)$',
    coverageDirectory: '.nyc_output',
    coverageReporters: ['json', 'text', 'html'],
    snapshotSerializers: ['<rootDir>/node_modules/jest-html'],
    collectCoverageFrom: [
      'src/**/*.js',
      '!src/debug.js',
      '!test/**',
      '!**/node_modules/**',
      '!**/__tests__/**',
      '!**/__mocks__/**',
    ],
  },
};

// ===============================================
// Build package.json
// ===============================================
const _sortDeps = (deps) => {
  const newDeps = {};
  Object.keys(deps).sort().forEach((key) => { newDeps[key] = deps[key]; });
  return newDeps;
};
specs.dependencies = _sortDeps(specs.dependencies);
specs.devDependencies = _sortDeps(specs.devDependencies);
const packageJson = `${JSON.stringify(specs, null, '  ')}\n`;
require('fs').writeFileSync('package.json', packageJson);

/* eslint-enable strict, indent, max-len, quote-props */
