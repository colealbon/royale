'use strict';
/*eslint-env node, mocha, es6 */
process.env.NODE_ENV = 'test';

const Storage = require('dom-storage')
const chai = require('chai');
const assert = chai.assert;

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
        let localStorage = new Storage('./db.json', { strict: false, ws: '  ' });
        return decryptPGPMessage(openpgp)(localStorage)('hotlips')()
        .catch(err => assert.equal(err.toString(), 'Error: missing PGPMessageArmor'));
    });

    test('decryptPGPMessage decrypts', function() {
        //usage: encryptClearText(openpgp)(publicKeyArmor)(cleartext).then(result => result)
        let localStorage = new Storage('./db.json', { strict: false, ws: '  ' });

        return decryptPGPMessage(openpgp)(localStorage)('hotlips')(`
-----BEGIN PGP MESSAGE-----

hQIMA0bt80axx5bJAQ/9GhmdJbcYwZIvK/782D13H8+FJWr1aSq4WMRjRJnKOHwL
TqbP2N7LAzYDj/uKZjh1VBDT3LvXdwXeKJY4zS1idPfUwSaYWGpV9N7eO1vM0X7v
HtTaNG/hkCpeO9faC3bMi11QB/ZjVGFV9XJ5Q9jSL2x9W+hwV0zPfAcS0R6YzMVj
tHprSu3MRsYBKuXiyywwFsG4p69TxRRu/XBKXKL4GsRYKee5EybbpQCK3b6VB7cm
FkULNw1ER8600UMOp690YClJSMW5yVE1C+aHJ8UDKTbuZpgffRFkiqT3XBDK4uS6
sWbiw7FZFHNSTiOecwbiIkGjzfEm84IWJRSVruBWaNjCaXAbjw6WoP36V7y/IiGt
J1bIigjOM5v3R+kbh2nTGMnV8mnMrwYMRi//dWslwSlZFev9BClgzLZ0GCmB5aJm
ximN+nNfZ1JvctFkGC1643I5KrcHi05attIjURMqJoJRgQ9KB21NydXwabul09CV
dlAPjdE0fInNM+xYEsRRjWKnLZ/x/caC4rNQrrzSLLIZxOXgNc6iif2pzezAu1AP
hqkmRVOtgo/wCooFEzwe894tXklOL6HWmUvyB9U6zlwe9kHhfAAOQudg8p70O4ib
imDDbKFMFM73WDIa75EcpaEYZtF3SW8saXNqDkUnIdar+avwnnNAfZxdof7WcuzS
SgEePD1t1pvowvu4/dn0Ja10oyo20eTqtTFfrRw5ROeZafswVDrC5q5KAFfm2Q2W
G7Pw9EktJ8t0DvuKMjl9CsI7cY6BDXs3Jn4J
=rfvU
-----END PGP MESSAGE-----`)
        .then((decrypted) => {
            assert.equal(decrypted, 'stay in school\n');
        })
        .catch(err => assert.equal(err.toString(), 'not an expected path'));
    });
});
