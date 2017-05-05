'use strict';
/*eslint-env node, mocha, es6 */
process.env.NODE_ENV = 'test';
const chai = require('chai');
const assert = chai.assert;

import notEmpty from '../../src/lib/notEmpty.js';

test('notEmpty throws "empty content" if content empty', function testNotEmpty() {
    const content = '';
    return notEmpty(content)
    .then(testResult => {
        assert.notEqual(1, 1);
    })
    .catch(err => {
        assert.equal(err.message, 'empty content')
    })
});

test('notEmpty throws "undefined content" if content undefined', function testNotEmpty() {
    let content;
    return notEmpty(content)
    .then(testResult => {
        assert.notEqual(1, 1);
    })
    .catch(err => {
        assert.equal(err.message, 'undefined content')
    })
});
