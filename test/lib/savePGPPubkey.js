'use strict';
/*eslint-env node, mocha, es6 */
process.env.NODE_ENV = 'test';

const fs = require('fs');
const Storage = require('dom-storage')
const chai = require('chai');
const assert = chai.assert;
const config = require(__dirname + '/../../config/options.js');
var openpgp = require('../openpgp162/openpgp.js');

import {savePGPPubkey} from '../../src/lib/savePGPPubkey.js';

var openpgp = require('../../test/openpgp162/openpgp.js');

suite('savePGPPubkey', function() {
    test('savePGPPubkey throws error on missing openpgp', function() {
        return savePGPPubkey()
        .then((result) => assert.notEqual(1, 'this should have errored'))
        .catch(err => assert.equal(err.toString(), 'Error: missing openpgp'));
    });
    test('savePGPPubkey throws error on cleartext', function() {
        let localStorage = new Storage(config.server_localstorage_file, { strict: false, ws: '  ' });
        return savePGPPubkey(openpgp)(localStorage)('fakedata')
        .then((result) => assert.notEqual(1, 'this should have errored'))
        .catch(err => assert.equal(err.message, 'cleartext content'));
    });
    test('savePGPPubkey happy path public key', function testSavePGPPubkey() {
        let localStorage = new Storage(config.server_localstorage_file, { strict: false, ws: '  ' });
        return new Promise((resolve, reject) => {
            fs.readFile(config.client_pubkey_file, 'utf8', (err, PGPPubkeyArmor) => {
                if (err) {
                    reject(err);
                }
                savePGPPubkey(openpgp)(localStorage)(PGPPubkeyArmor)
                .then(result => {
                    var fromStorage = localStorage.getItem(config.client_pubkey_user_id);
                    var keyFromStorage = openpgp.key.readArmored(fromStorage);
                    var userFromKey = keyFromStorage.keys[0].users[0].userId.userid
                    assert.equal(userFromKey , config.client_pubkey_user_id)
                    resolve();
                })
                .catch(error => {
                    reject(error)
                })
            })
        })
    })
    test('savePGPPubkey throws error on PGP Private Key', function testSavePGPPrivkey() {
        let localStorage = new Storage(config.server_localstorage_file, { strict: false, ws: '  ' });
        return new Promise((resolve, reject) => {
            fs.readFile(config.server_privkey_file, 'utf8', (err, PGPPrivkeyArmor) => {
                if (err) {
                    reject(err);
                }
                savePGPPubkey(openpgp)(localStorage)(PGPPrivkeyArmor)
                .then((new Error('savePGPPubkey should throw error on PGP Priv key but it does not')))
                .catch(error => {
                    assert.equal(error.message, 'PGP Privkey content');
                    resolve();
                })
            })
        })
    })
    test('savePGPPubkey throws error on PGP Message', function testSavePGPPrivkey() {
        let localStorage = new Storage(config.server_localstorage_file, { strict: false, ws: '  ' });
        return new Promise((resolve, reject) => {
            fs.readFile(config.client_to_server_pgp_message, 'utf8', (err, PGPMessageArmor) => {
                if (err) {
                    reject(err);
                }
                savePGPPubkey(openpgp)(localStorage)(PGPMessageArmor)
                .then((new Error('savePGPPubkey should throw error on PGP Message but it does not')))
                .catch(error => {
                    assert.equal(error.message, 'Cannot read property \'users\' of undefined');
                    resolve();
                })
            })
        })
    })
});
