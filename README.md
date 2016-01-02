MarsDB-LocalForage
=========

[![Build Status](https://travis-ci.org/c58/marsdb-localforage.svg?branch=master)](https://travis-ci.org/c58/marsdb-localforage)
[![npm version](https://badge.fury.io/js/marsdb-localforage.svg)](https://www.npmjs.com/package/marsdb-localforage)
[![Dependency Status](https://david-dm.org/c58/marsdb-localforage.svg)](https://david-dm.org/c58/marsdb-localforage)

MarsDB storage implementation for [LocalForage](https://github.com/mozilla/localForage).

## Usage
```javascript
import Collection from ‘marsdb’;
import LocalForageManager from 'marsdb-localforage';

// Setup different storage managers
Collection.defaultStorageManager(LocalForageManager);

const users = new Collection(‘users’);
```

## Contributing
I’m waiting for your pull requests and issues.
Don’t forget to execute `gulp lint` before requesting. Accepted only requests without errors.

## License
See [License](LICENSE)