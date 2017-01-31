'use strict';
/*eslint-env node, mocha, es6 */
//process.env.NODE_ENV = 'test';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const assert = require('chai').assert;

suite('#5 install mocha/chai for TDD:', function() {
    test('this always passes', function() {
        return new Promise(function(resolve, reject) {
            resolve(assert.equal(1, 1));
        })
    });
});
