MarsDB-LocalStorage
=========

[![Build Status](https://travis-ci.org/c58/marsdb-localstorage.svg?branch=master)](https://travis-ci.org/c58/marsdb-localstorage)
[![npm version](https://badge.fury.io/js/marsdb-localstorage.svg)](https://www.npmjs.com/package/marsdb-localstorage)
[![Dependency Status](https://david-dm.org/c58/marsdb-localstorage.svg)](https://david-dm.org/c58/marsdb-localstorage)

MarsDB storage implementation for LocalStorage.

## Usage
```javascript
import Collection from ‘marsdb’;
import LocalStorageManager from 'marsdb-localstorage';

// Setup different storage managers
Collection.defaultStorageManager(LocalStorageManager);

const users = new Collection(‘users’);
```

## Contributing
I’m waiting for your pull requests and issues.
Don’t forget to execute `gulp lint` before requesting. Accepted only requests without errors.

## License
See [License](LICENSE)