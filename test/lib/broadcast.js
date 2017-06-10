'use strict';
/*eslint-env node, mocha, es6 */
process.env.NODE_ENV = 'test';
const chai = require('chai');
const assert = chai.assert;
const config = require(__dirname + '/../../config/options.js');

const app = require('../../app');
const http = require('http');
const fs = require('fs');
var openpgp = require('../../test/openpgp162/openpgp.js');

// LAUNCH HTTP SERVER
var port = process.env.PORT || config.port || '3000';
var server = http.createServer(app.callback());

var Gun = require('gun');
var gun = Gun({
	file: 'gundata.json',
    web: server
})

import {broadcast} from '../../src/lib/broadcast.js';

suite('broadcast ', function() {

    test('broadcast throws error on no content', function() {
        return broadcast()
        .then((result) => assert.equal(result, 'not a valid code path'))
        .catch(err => assert.equal(err.message, 'missing content'));
    });

    test('broadcast throws "missing gundb" if not called with gundb', function testBroadcast() {
        const content = 'abcdefghijklmnopqrstuvwxyz'
        return broadcast(content)()
        .then(() => {
            assert.notEqual(1, 1);
        })
        .catch(err => {
            assert.equal(err.message, 'missing gundb')
        })
    });

    test('broadcast throws "missing openpgp" if not called with openpgp', function testBroadcast() {
        const content = 'abcdefghijklmnopqrstuvwxyz'
        return broadcast(content)(gun)()
        .then(() => {
            assert.notEqual(1, 1);
        })
        .catch(err => {
            assert.equal(err.message, 'missing openpgp')
        })
    });

    test('broadcast happy path PGP Message', function testBroadcast() {
        return new Promise((resolve, reject) => {
            fs.readFile(config.client_to_server_pgp_message, 'utf8', (err, PGPMessageArmor) => {
                if (err) {
                    reject(err);
                }
                broadcast(PGPMessageArmor)(gun)(openpgp)
                .then((broadcastResult) => {
                    gun.get('royale').map().on(function(message, id){
                        if(message) {
                            assert.equal(message, PGPMessageArmor);
                            resolve()
                        }
                    });
                })
                .catch((err) => {
                    reject(err);
                })
            })
        })
    })
    
    test('broadcast throws error on Private PGP key', function testBroadcast() {
        return new Promise((resolve, reject) => {
            fs.readFile(config.server_privkey_file, 'utf8', (err, PGPPrivateKey) => {
                if (err) {
                    reject(err);
                }
                broadcast(PGPPrivateKey)(gun)(openpgp)
                .then((broadcastResult) => {
                    assert.notEqual(1, 1);
                })
                .catch((err) => {
                    assert.equal(err.message, 'PGP Privkey content')
                    resolve(err);
                })
            })
        })
    })
});
