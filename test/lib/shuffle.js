'use strict';
/*eslint-env node, mocha, es6 */

process.env.NODE_ENV = 'test';
const chai = require('chai');
const assert = chai.assert;

import {deck} from '../../src/lib/deck.js';
import {shuffle} from '../../src/lib/shuffle.js';

suite('shuffle', function() {
    test('a shuffled deck has 52 cards', function testShuffle() {
        return deck()
        .then(unshuffled => {
            return Promise.resolve(Object.keys(unshuffled.cards.front))
        })
        .then(unshuffled => {
            return shuffle(unshuffled);
        })
        .then((shuffled) => {
            return new Promise((resolve, reject) => {
                try {
                    assert.equal(shuffled.length, 52)
                    resolve();
                } catch (error) {
                    reject(error);
                }
            })
        })
    });
});
