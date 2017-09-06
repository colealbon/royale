'use strict';
/*eslint-env node, mocha, es6 */
process.env.NODE_ENV = 'test';

const Storage = require('dom-storage')
const chai = require('chai');
const assert = chai.assert;

import {getFromStorage} from '../../src/lib/getFromStorage.js';

suite('getFromStorage', function() {
    test('getFromStorage throws error on missing localstorage', function() {
        return getFromStorage()
        .then((storedItems) => assert.equal(true, 'unexpected code path'))
        .catch(err => assert.equal(err, 'Error: missing localStorage'));
    });
    test('getFromStorage without a key returns everything', function() {
        let localStorage = new Storage('./test_getFromStorage.json', { strict: false, ws: '  ' });
        localStorage.clear();
        localStorage.setItem('keyOne', 'valueOne');
        localStorage.setItem('keyTwo', 'valueTwo');
        return getFromStorage(localStorage)()
        .then((storedItems) => {
            assert.equal(storedItems[0], 'valueTwo');
            assert.equal(storedItems[1], 'valueOne');
        })
        .catch(err => assert.equal(true, err));
    });
    test('getFromStorage with a key returns one record', function() {
        let localStorage = new Storage('./test_getFromStorage.json', { strict: false, ws: '  ' });
        localStorage.clear();
        localStorage.setItem('keyOne', 'valueOne');
        localStorage.setItem('keyTwo', 'valueTwo');
        return getFromStorage(localStorage)('keyOne')
        .then((storedItem) => {
            assert.equal(storedItem, 'valueOne');
        })
        .catch(err => assert.equal(true, err));
    });
});
