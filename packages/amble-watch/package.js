Package.describe({
  name: 'amble-watch',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1');
  api.use(['session', 'deps', 'logging'], 'client');
  api.addFiles('amble-watch.js', 'client');
  api.export(['AmbleWatch'], 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('amble-watch');
  api.addFiles('amble-watch-tests.js');
});

Cordova.depends({
  'uk.co.ilee.applewatch': 'https://github.com/leecrossley/cordova-plugin-apple-watch/tarball/6bb5cf9a1e6023792c9e68ddb1ccfd090b4fff47'
});