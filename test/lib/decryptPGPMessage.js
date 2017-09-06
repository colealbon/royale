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

import {decryptPGPMessage} from '../../src/lib/decryptPGPMessage.js';

suite('decryptPGPMessage', function() {

    test('decryptPGPMessage throws error on missing openpgp', function() {
        return decryptPGPMessage().then(result => result)
        .catch(err => assert.equal(err.toString(), 'Error: missing openpgp'));
    });

    test('decryptPGPMessage throws error on missing localstorage', function() {
        return decryptPGPMessage(openpgp)().then(result => result)
        .catch(err => assert.equal(err.toString(), 'Error: missing localStorage'));
    });
    test('decryptPGPMessage throws error on missing password', function() {
        //decryptPGPMessage(openpgp)(localStorage)(password)(PGPMessageArmor)
        return decryptPGPMessage(openpgp)(openpgp)()
        .catch(err => assert.equal(err.toString(), 'Error: missing password'));
    });
    test('decryptPGPMessage throws error on missing PGPMessageArmor', function() {
        //decryptPGPMessage(openpgp)(localStorage)(password)(PGPMessageArmor)
        let localStorage = new Storage(config.server_localstorage_file, { strict: false, ws: '  ' });
        return decryptPGPMessage(openpgp)(localStorage)(config.server_privkey_password)()
        .catch(err => assert.equal(err.toString(), 'Error: missing PGPMessageArmor'));
    });

    test('decryptPGPMessage decrypts', function() {
        //usage: encryptClearText(openpgp)(publicKeyArmor)(cleartext).then(result => result)
        return new Promise((resolve, reject) => {
            fs.readFile(config.server_privkey_file, 'utf8', (err, privateKeyArmor) => {
                if (err) {
                    reject(err);
                }
                fs.readFile(config.client_to_server_pgp_message, 'utf8', (err2, PGPMessageArmor) => {
                    if (err2) {
                        reject(err2);
                    }
                    let localStorage = new Storage(config.server_localstorage_file, { strict: false, ws: '  ' });
                    let PGPkey = openpgp.key.readArmored(privateKeyArmor);
                    localStorage.setItem(PGPkey.keys[0].users[0].userId.userid, privateKeyArmor)
                    return decryptPGPMessage(openpgp)(localStorage)(config.server_privkey_password)(PGPMessageArmor)
                        .then((decrypted) => {
                            assert.equal(decrypted, 'test client to server');
                            resolve();
                        })
                        .catch((error) => {
                            assert.equal(`unexpected error`, error.toString())
                            reject();
                        })
                })
            })
        })
    })
});
