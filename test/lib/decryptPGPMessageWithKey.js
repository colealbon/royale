'use strict';
/*eslint-env node, mocha, es6 */
process.env.NODE_ENV = 'test';

const Storage = require('dom-storage')
const chai = require('chai');
const assert = chai.assert;
const config = require(__dirname + '/../../config/options.js');
const fs = require('fs');

var openpgp = require('../../test/openpgp162/openpgp.js');
//const openpgp = require('openpgp'); <- use if it stops throwing Float64 err

import {decryptPGPMessageWithKey} from '../../src/lib/decryptPGPMessageWithKey.js';

suite('decryptPGPMessageWithKey', function() {

    test('decryptPGPMessageWithKey throws error on missing openpgp', function() {
        return decryptPGPMessageWithKey().then(result => result)
        .catch(err => assert.equal(err.toString(), 'Error: missing openpgp'));
    });
    test('decryptPGPMessageWithKey throws error on missing password', function() {
        return decryptPGPMessageWithKey(openpgp)()
        .catch(err => assert.equal(err.toString(), 'Error: missing password'));
    });
    test('decryptPGPMessageWithKey throws error on missing privateKeyArmor', function() {
        return decryptPGPMessageWithKey(openpgp)(config.server_privkey_password)().then(result => result)
        .catch(err => assert.equal(err.toString(), `Error: missing privateKeyArmor` ));
    });
    test('decryptPGPMessageWithKey throws error on failed private key decrypt (bad password)', function() {
        return new Promise((resolve, reject) => {
            fs.readFile(config.server_privkey_file, 'utf8', function (err, privateKeyArmor) {
                if (err) {
                    reject(err);
                }
                // decryptPGPMessage(openpgp)(localStorage)(config.server_privkey_password)(data)
                fs.readFile(config.client_to_server_pgp_message, 'utf8', function (err, PGPMessageArmor) {
                    if (err) {
                        reject(err);
                    }
                    decryptPGPMessageWithKey(openpgp)('bogus')(privateKeyArmor)(PGPMessageArmor)
                    .then((decrypted) => {
                        assert.equal('good advice', 'stay in school\n');
                        resolve();
                    })
                    .catch((error) => {
                        assert.equal(`Error: Private key is not decrypted`, error.toString())
                        resolve();
                    })
                })
            })
        })
    });
    test('decryptPGPMessageWithKey throws error on missing PGPMessageArmor', function() {
        return new Promise((resolve, reject) => {
            fs.readFile(config.server_privkey_file, 'utf8', function (err, privateKeyArmor) {
                if (err) {
                    reject(err);
                }
                // decryptPGPMessage(openpgp)(localStorage)(config.server_privkey_password)(data)
                fs.readFile(config.client_to_server_pgp_message, 'utf8', function (err, PGPMessageArmor) {
                    if (err) {
                        reject(err);
                    }
                    decryptPGPMessageWithKey(openpgp)(config.server_privkey_password)(privateKeyArmor)()
                    .then((decrypted) => {
                        assert.equal('good advice', 'stay in school\n');
                        resolve();
                    })
                    .catch((error) => {
                        assert.equal(`Error: missing PGPMessageArmor`, error.toString())
                        resolve();
                    })
                })
            })
        })
    });
    test('decryptPGPMessageWithKey decrypts', function testDecryptPGPMessageWithKey () {
        return new Promise((resolve, reject) => {
            fs.readFile(config.server_privkey_file, 'utf8', (err, privateKeyArmor) => {
                if (err) {
                    reject(err);
                }
                fs.readFile(config.client_to_server_pgp_message, 'utf8', (err2, PGPMessageArmor) => {
                    if (err2) {
                        reject(err2);
                    }
                    decryptPGPMessageWithKey(openpgp)(config.server_privkey_password)(privateKeyArmor)(PGPMessageArmor)
                    .then((decrypted) => {
                        assert.equal(decrypted, 'test client to server');
                        resolve();
                    })
                    .catch((error) => {
                        assert.equal(`unexpected error`, error.toString())
                        resolve();
                    })
                })
            })
        })
    })
});
