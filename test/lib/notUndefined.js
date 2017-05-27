'use strict';
/*eslint-env node, mocha, es6 */
process.env.NODE_ENV = 'test';
const chai = require('chai');
const assert = chai.assert;

import notUndefined from '../../src/lib/notUndefined.js';

suite('notUndefined', function() {
    test('notUndefined returns content if not undefined', function testNotUndefined() {
        const content = '';
        return notUndefined(content)
        .then(testResult => {
            assert.equal(content, testResult);
        })
        .catch(err => {
            if (err) throw(err)
        })
    });

    test('notUndefined throws "undefined content" if content undefined', function testNotUndefined() {
        let content ;
        return notUndefined(content)
        .then(testResult => {
            assert.notEqual(1, 1);
        })
        .catch(err => {
            assert.equal(err.message, 'undefined content')
        })
    });
});
