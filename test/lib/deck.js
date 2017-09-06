'use strict';
/*eslint-env node, mocha, es6 */

process.env.NODE_ENV = 'test';
const chai = require('chai');
const assert = chai.assert;

import {deck} from '../../src/lib/deck.js';

suite('deck', function() {
    test('a new deck has 52 cards', function() {
        return deck()
        .then(result => {
            assert.equal(Object.keys(result.cards.front).length, 52)
        })
    });
});
