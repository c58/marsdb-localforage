'use strict';

module.exports = {
  src: 'lib/**/*',
  dist: 'dist',
  build: 'build',

  browser: {
    bundleName: 'marsdb.localForage.js',
    bundleMinName: 'marsdb.localForage.min.js',
    entry: 'index.js',
    entryTests: 'browser_tests.js',
  }
};
