'use strict';
/*eslint-env node, mocha, es6 */
process.env.NODE_ENV = 'test';
const logger = require('winston');

import {isEmpty} from '../../src/lib/isEmpty.js';

test('isEmpty returns true if empty', function testIsEmpty() {
    return isEmpty('')
    .then((isEmptyResult) => assert.equal(true, isEmptyResult))
    .catch(err => logger.error(err));
});
