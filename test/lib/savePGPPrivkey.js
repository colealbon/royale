'use strict';
/*eslint-env node, mocha, es6 */
process.env.NODE_ENV = 'test';

const Storage = require('dom-storage')
const chai = require('chai');
const assert = chai.assert;
var openpgp = require('../openpgp162/openpgp.js');

import {handlePost} from '../../src/lib/handlePost.js';

var openpgp = require('../../test/openpgp162/openpgp.js');

suite('savePGPPrivkey', function() {
    test('handlePost throws error on missing openpgp', function() {
        return handlePost()
        .catch(err => assert.equal(err.toString(), 'Error: missing openpgp'));
    });
    // test('savePGPPrivkey returns nothing on no content', function() {
    //     return handlePost(openpgp)()()()''
    //     .then((content) => assert.equal(content, ''))
    //     .catch(err => assert.equal(true, false));
    // });
    // test('handlePost happy path unclassified fake data', function() {
    //     let localStorage = new Storage('./db.json', { strict: false, ws: '  ' });
    //     return handlePost('bubblegum')(openpgp)(localStorage)()
    //     .then(response => {
    //         return determineContentType(response[0])(openpgp)
    //         .then(result => {
    //             assert.equal(result, 'PGPMessage')
    //         })
    //         .catch(err => assert.equal(err.toString(), 'this code path should be dead'));
    //     })
    //     .catch(err => assert.equal(err.toString(), 'this code path should be dead'));
    // });
//     test('handlePost happy path public key', function() {
//         let localStorage = new Storage('./db.json', { strict: false, ws: '  ' });
//         return handlePost(`
// -----BEGIN PGP PUBLIC KEY BLOCK-----
// Version: GnuPG v2
//
// mQENBFgqlVYBCAC6kSJzAJqvsh2hcnOScEJwPirTiInjzVeSrTKnF5MCnfFIL8zX
// OjElEDiMvoNWPh3aXZQ6MriCPkn1ECRR5O5eOm9ImTW1/y9vfbdPaU2masznwcF3
// bDzp43Tt5SGK+qFfZbQQOs9JYrXYhblevRElKmf+WgeUGQtYWCQQYjT0sFY2TR+u
// 8zIXMcSY41y5wYmMq7AamfPo/9sulSSbHmxakTOYpmZIDGhEiBo7KH9rsek9ZQU9
// MZEyWyPUqHiWGL82F5F3yy4NK5vLUu8RaiVHrbMPrEqgkPTIIlSMo512vQ608hJa
// v1Ee28xP6bHdvZeVyqSUcY2Rdoexh+CQ1DOZABEBAAG0E3Rlc3RfY2xpZW50XzAw
// MDAwMDGJATkEEwEIACMFAlgqlVYCGwMHCwkIBwMCAQYVCAIJCgsEFgIDAQIeAQIX
// gAAKCRDO29wCZYLZsgzXB/48K09OgCZc9SrnsM/OOXbRcfD66bi7ivASM1VsKReN
// 4LvOG+QhTFcoj/HxJ+EnTXqz2XhxtUvIas33AI33Sip9XZ2Pt0klAWBjbmEiN7nM
// tVfgxcB5MU4XSfcvunW9I0EnoR0FlpHyMIS9mTuMVNsOz4WfK4Xy0ipRWAWcX+I+
// cLYFpZ41jgcECYb9SsTOWkspBMXkfGMycHisKDPGLYBrsZIuCGdL0vmGmkUlm3BG
// psnDwW22ZHydwT/qUKsBeS0vouxfXTyZChpZhJeSf6usGEOH8lBbs4KmlyfXnx7l
// FNUZmr4STDvPCVbZ4U/zLNU3Z2xKEI2UmpPtgqlwMlzAuQENBFgqlVYBCACz5W+7
// LoF/jYBH6ud5HpW2oGztQWCW5tbSm0IesiqUXanuRsBd22lOcRNwTjtIW/OjvfM5
// PCGknr09gOWHyp3+UX4W5VPoigA4OJjKDNqhqIyWLFHJqzE1BsrD4YmlTvbvg/f2
// xZk2dxVlMX3M1vwjrhSZweKEq8vWtKnMllywyMn2JAjjimqsEHUcZ5yXrm3cQl/p
// ZRSmZXM4gUaag47koWDlojyl58tXVDAl763SzsmCj2pDYv2SMBPuAxTI6NfWmV+g
// rkIMgg+nahZeFKVwG2hdWS1RByRGZkx+zZ/LZ2TnDs0Zc/HZmt6zC7c+elQSBgRS
// vmpipiUHaW2mHpXFABEBAAGJAR8EGAEIAAkFAlgqlVYCGwwACgkQztvcAmWC2bID
// gggAo/wh++bsL0nbvwc4rRIvlq75wtJWGlW3JQ0AWe0O+FYXF7LfyjMn1Nf95jyV
// v0qNfb83HqFmnMhcod6sKcLBYbarjxdDiqg0tuLsuwx6zjJfHN6rxU4pWyQ9YQZt
// FTDUQu7z2fdbsyoxImI1nl1OWfV+AsLo+JPYzgPRExCHI51VPzQ8z/9GEqv3PfXb
// n1wgsuNsqps9DJ8yJE2RcdpWba3RfL9fKDiet4Qpt9u/++e2++SMlliykaKo0oHy
// pvoIvX5766bGVIqGyh8DtuzmlWNvkjoTTkJ96Gn66AM1NjRVxs6aW0ndvKY0DCVI
// Jh3lPln3y0XSF6yYtUukvOLKtw==
// =xC4H
// -----END PGP PUBLIC KEY BLOCK-----`)(openpgp)(localStorage)()
//         .then(result => {
//             //console.log(result)
//             var fromStorage = localStorage.getItem('test_client_0000001');
//             var keyFromStorage = openpgp.key.readArmored(fromStorage);
//             var userFromKey = keyFromStorage.keys[0].users[0].userId.userid
//             assert.equal(userFromKey , 'test_client_0000001')
//         })
//         .catch(error => {
//             console.log(error);
//             assert.equal(error, 'caught error')
//         })
//     });

    test('handlePost happy path private key', function() {
        let localStorage = new Storage('./db.json', { strict: false, ws: '  ' });
        return handlePost(openpgp)(localStorage)(`
-----BEGIN PGP PRIVATE KEY BLOCK-----

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
wDM11yrM3S6t
=bF8E
-----END PGP PRIVATE KEY BLOCK-----`)()
        .then(result => {
            var fromStorage = localStorage.getItem('test_hotlips')
            var keyFromStorage = openpgp.key.readArmored(fromStorage)
            var userFromKey = keyFromStorage.keys[0].users[0].userId.userid
            assert.equal(userFromKey , 'test_hotlips')
        })
        .catch(error => {
            assert.equal(error, 'caught error')
        })
    });

//     test('handlePost happy path pgp message', function() {
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
// test('handlePost pgp message should be undefined if decryption key not found', function() {
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
//             console.log(error);
//             assert.equal(error, 'caught error')
//         })
//     })
});
