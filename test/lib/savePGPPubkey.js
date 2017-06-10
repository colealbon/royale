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
        return savePGPPubkey('fakedata')()
        .then((result) => assert.notEqual(1, 'this should have errored'))
        .catch(err => assert.equal(err.toString(), 'Error: missing openpgp'));
    });

    test('savePGPPubkey throws error on cleartext', function() {
        let localStorage = new Storage(config.server_localstorage_file, { strict: false, ws: '  ' });
        return savePGPPubkey('fakedata')(openpgp)(localStorage)
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
                savePGPPubkey(PGPPubkeyArmor)(openpgp)(localStorage)
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
            fs.readFile(config.client_privkey_file, 'utf8', (err, PGPPrivkeyArmor) => {
                if (err) {
                    reject(err);
                }
                savePGPPubkey(PGPPrivkeyArmor)(openpgp)(localStorage)
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
                savePGPPubkey(PGPMessageArmor)(openpgp)(localStorage)
                .then((new Error('savePGPPubkey should throw error on PGP Message but it does not')))
                .catch(error => {
                    assert.equal(error.message, 'Cannot read property \'users\' of undefined');
                    resolve();
                })
            })
        })
    })

//
//     test('savePGPPubkey throws error on pgp message', function() {
//         let localStorage = new Storage('./db.json', { strict: false, ws: '  ' });
//         return handlePost(`
// -----BEGIN PGP MESSAGE-----
//
// hQIMA0bt80axx5bJAQ/9GhmdJbcYwZIvK/782D13H8+FJWr1aSq4WMRjRJnKOHwL
// TqbP2N7LAzYDj/uKZjh1VBDT3LvXdwXeKJY4zS1idPfUwSaYWGpV9N7eO1vM0X7v
// HtTaNG/hkCpeO9faC3bMi11QB/ZjVGFV9XJ5Q9jSL2x9W+hwV0zPfAcS0R6YzMVj
// tHprSu3MRsYBKuXiyywwFsG4p69TxRRu/XBKXKL4GsRYKee5EybbpQCK3b6VB7cm
// FkULNw1ER8600UMOp690YClJSMW5yVE1C+aHJ8UDKTbuZpgffRFkiqT3XBDK4uS6
// sWbiw7FZFHNSTiOecwbiIkGjzfEm84IWJRSVruBWaNjCaXAbjw6WoP36V7y/IiGt
// J1bIigjOM5v3R+kbh2nTGMnV8mnMrwYMRi//dWslwSlZFev9BClgzLZ0GCmB5aJm
// ximN+nNfZ1JvctFkGC1643I5KrcHi05attIjURMqJoJRgQ9KB21NydXwabul09CV
// dlAPjdE0fInNM+xYEsRRjWKnLZ/x/caC4rNQrrzSLLIZxOXgNc6iif2pzezAu1AP
// hqkmRVOtgo/wCooFEzwe894tXklOL6HWmUvyB9U6zlwe9kHhfAAOQudg8p70O4ib
// imDDbKFMFM73WDIa75EcpaEYZtF3SW8saXNqDkUnIdar+avwnnNAfZxdof7WcuzS
// SgEePD1t1pvowvu4/dn0Ja10oyo20eTqtTFfrRw5ROeZafswVDrC5q5KAFfm2Q2W
// G7Pw9EktJ8t0DvuKMjl9CsI7cY6BDXs3Jn4J
// =rfvU
// -----END PGP MESSAGE-----`)(openpgp)(localStorage)('hotlips')
//         .then(result => assert.equal(result, 'stay in school\n'))
//         .catch(error => {
//             assert.equal(error, 'caught error')
//         })
//         done();
//     })
// test('savePGPPubkey throws error on pgp message', function() {
//     let localStorage = new Storage('./db.json', { strict: false, ws: '  ' });
//     return handlePost(`-----BEGIN PGP MESSAGE-----
// Version: OpenPGP.js v2.3.5
// Comment: http://openpgpjs.org
//
// wcBMA5yCLAa7UWYAAQf9EyuVxfLLzih6nd8Dd4b2T7Wz8uBJhTot0Am7qgOK
// CwsksviMQpaBhF8lHOC7neueAr1x7kOazm+4GQmDyWcni4cm/EZBDoS0i67q
// kK7HMHNYyJtPyutJ9RzULfJKyN6Pl8ZmnfBMSmSe2AZmw5IDiqZeyzXJgkUE
// yxH1NK8UNIPbxOLZH4gR0ryFHQeqfqTcxSmYtgSXJbuaglHun7BEXyLyGfRO
// fTv/zCfHFZjIUmN5kHPqD+zuiDxm3OUFjO7t3AqNimnO9LSLQkJXd/2Pf3sV
// zWrcMz0c6agYLSqU5Pq30V31WpiD/C0VGPzF90qmd/kURjKuAcOfDDuT9tLy
// UNLGKwHmShBmH7i84gSCWNFYXVYtKhrr9qWjL3V4hoshhmyP7YqjS1Mu2I2T
// kfJntXh3M2dyiS2i1JNYPQ/p5kTgX03tjpeyQMGQmyxLobHl0InJW6B31hvm
// /CqJx612T0VOSh08WlngnrPTT2B7iBnrXTfVynBM2xmYa1m+t6aGcohqs3ak
// Q7lg89eswmDAU4A/txkd6nvE4fqh8lXZUWOZUUwUb3bKp4bxx/F/9177qX5a
// QEncH8GDI6Twtwokqr8ONUxG7YtsXsYcNzl67grsswc7YnpJdOGGRfRSWlFM
// lUguY8qVtXLEdlC/zyLzcywM6MHl7jqik223oAwlLzTt10Vi10laRxoGDEDb
// DgX0Hd2QUNhyDm8ssGZbeYY49obVFcfl9MO8UhihVLe8F1lt08hYr3dj+A7S
// ReSmUCfII9XaxY6uwZmwME92W6LHUOyqRFuAEHzAKRxMGWuVFOSRZBXU44q8
// TrOLn4TMBNuZMtC9g9VZn46bJET8ckts6Mc+sI7JyytL4st4Rcnrs9z0v9qT
// yA+AYNIDJIJfmkfHJzKp6oo/nTxGYMPLIUb1vRBQ7w30lPzuO+2sfPcAafjN
// 2RGVeq88OThtTyIcnBYxvCt+srzhlflcmQdKbNeCWFUUu9srCEj/GJ6hTZ21
// gmBUWT8JDvyvtPtn8T1pMjwSZgZ6cRdc+UVbc9cFcqWJQ4E3BiKlgQ+0661X
// LeJpJ2vnSC1FpCGXCr/tMly1IWQSVq5SLT6ppIEEfbwgK259fePOUkFHkit+
// Rcj29KLBBmf0Afg8popAd26BNe1QE5S5E7d6vhH+XMTbFJMDJeHA63wsInMu
// qLnGfXI/uOrPWLQ7I5AP6B1abQuZbK33nO+E9X7OySyO2No9JUW3+7SwBsHU
// Tju5FzkoyaY4P3KlFGoW0ejVD9jP26p8jF4EyowqzTYyhyyUx9EcC5zjBQEp
// /eFx/k5zMuY4nQ27cbx26QN/jCrLXoWqybwVTBxwUzBV+ViqoAgVo8s37gQO
// oke775ouRC6n4YbRKN1twITzRZDLQsKCRReHtQRcvCI3LUV7Zhon51PvVA6b
// kk//jg9PVfNYnQr5UXkN1hbZpoOyHjk0ctSJQ8uY0zb5LWMpdFOTcoPTnlVH
// 33923c5RrOSS8gD0kMFb3Sp2RnfDXOBb6bGVyLpOaZ2CJHk4NL66ZT2982DY
// EOUwX9zoVu4duEiP8zB0gN/lWlRNifbEpzkTFnHrTmtCRSwawv7TYQIcnQMi
// Ii9YlL2N0MxFCXJKUzzjfJMbKiKmmF6iAVdGh8YLKWlT431iR+evHiCpFRvr
// kwHwvC+v3MHZsk43Yio1Mh54F1qA+jxZyFr+0NKfZO5r0UMtaaGdO+Ig7pdg
// 7sDikXH2sEAGVXaX9oKAutpygI+i/WMZ7prQgfe2Bm4rXaLF3uioKdXgNgKq
// PTxFN4KpMMq2ha5lgks7okNuiZR2y6OKjLwzPcDfCVyDf9IMi5Hq8FLGMVGI
// S1tlYFFEh7pssAlLB50vyMsyBitJO8YM6yn+Pxq8+DHmgmV+VEJuQ9SyuB2G
// gu+5WItNwy6CxPlf7uKSZLAZZnnoVdND8/mhOiUW9JLU9ihUdWTpvb0j+tHP
// ziDUiLjsbyJY7GSQl6veBXzxzGN2cw9WKystywh0dGtXIHs35A/S7/8t7+Jl
// kZMkz2fSsBUaudzKVqXIEEl5NAsWp2ZaTwrmjJde912gcDtWSSyot+8JKSyJ
// ZgHoMV1yzgxf8uZMSprtM7wFbmoNq3wVxRxrD/ubg5e51vwCkgAx8bn8pJvZ
// w67/LSeWjMYiDQ29dbzhsf0GHSEh+zL846IPGuF1TLFp5ubTj362alyTLCsA
// X61m+Oavx79lE/fy6JpZ55qk3gXlDZGgKT4K5JZCSETqiffRuqImQ6lsWyb2
// CqubRwm8g7Nash6OTAPdMNRzrND2m7BT4XHhnGjrmNcJlvKO5RL5Af4chKZE
// BcSiw/SIrFxqScC6IP/4XvowMJWBrmMzueHyAyktL4ElUzpy8FcE6m9C10WN
// auOSSDakqw3reNdo/nF1cZt5DIcRRvbxnbZAMP7ysSsSsXA7PSyjkwxy8m3W
// VXNKMAWJ/3c5bShcPiyQNihmyFfP2SGFFeQJdyHMiUruU2Ju+EEAHLD1BeYO
// VHR6TdcGTspLwyAYamGjO1y+gesc14ou6K8TWtTE0+6A8uIJ0RBkEGdUqUof
// 6aU8Jh1X/PbGhi2ZaCtaeXmS/zUakGQkBCifTrxwTmbUuGXiiTNlscabopAC
// 9y+NyQG8rUQXEKo21GRXatAnoM4FpSAeiYv3vy1d0s+C0tBXN4TiT5UpLztX
// zhr+ok5qak1vOjBi6qpoZFASb8w=
// =Gen8
// -----END PGP MESSAGE-----`)(openpgp)(localStorage)('hotlips')
//         .then(result => assert.equal(result, undefined))
//         .catch(error => {
//             assert.equal(error, 'caught error')
//         })
//     })
});
