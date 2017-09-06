'use strict';
/*eslint-env node, mocha, es6 */
process.env.NODE_ENV = 'test';
const chai = require('chai');
const assert = chai.assert;

import notPGPContent from '../../src/lib/notPGPContent.js';
var openpgp = require('../../test/openpgp162/openpgp.js');

suite('notPGPContent', function() {
    test('notPGPContent throws "empty content" if content empty', function testNotPGPContent() {
        const content = '';
        return notPGPContent(content)()
        .then(assert.notEqual('empty content', 'we should never get here'))
        .catch((err) => {
            assert.equal(err.message, 'empty content')
        })
    });

    test('notPGPContent throws "undefined content" if content undefined', function testNotPGPContent() {
        return notPGPContent()()
        .then(testResult => {
            assert.notEqual(1, 1);
        })
        .catch(err => {
            assert.equal(err.message, 'undefined content')
        })
    });

    test('notPGPContent throws "missing openpgp" if not called with openpgp', function testNotPGPContent() {
        const content = 'abcdefghijklmnopqrstuvwxyz'
        return notPGPContent(content)()
        .then((content) => {
            assert.notEqual(1, 1);
        })
        .catch(err => {
            assert.equal(err.message, 'missing openpgp')
        })
    });

    test('notPGPContent throws "PGP content" if content is PGP Message', function testNotPGPContent() {
        const content = `
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
-----END PGP MESSAGE-----`
        return notPGPContent(content)(openpgp)
        .then((content) => {
            assert.notEqual(1, 1)
        })
        .catch(err => {
            assert.equal(err.message, 'PGP content')
        })
    });

    test('notPGPContent throws "PGP content" if content is PGP Private Key', function testNotPGPContent() {
        const content = `
-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: GnuPG v2

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
vKY0DCVIJh3lPln3y0XSF6yYtUukvOLKtw==
=Ksff
-----END PGP PRIVATE KEY BLOCK-----
`
        return notPGPContent(content)(openpgp)
        .then((content) => {
            assert.notEqual(1, 1)
        })
        .catch(err => {
            assert.equal(err.message, 'PGP content')
        })
    });
    test('notPGPContent throws "PGP content" if content is PGP Public Key', function testNotPGPContent() {
        const content = `
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: GnuPG v2

mQENBFgqlVYBCAC6kSJzAJqvsh2hcnOScEJwPirTiInjzVeSrTKnF5MCnfFIL8zX
OjElEDiMvoNWPh3aXZQ6MriCPkn1ECRR5O5eOm9ImTW1/y9vfbdPaU2masznwcF3
bDzp43Tt5SGK+qFfZbQQOs9JYrXYhblevRElKmf+WgeUGQtYWCQQYjT0sFY2TR+u
8zIXMcSY41y5wYmMq7AamfPo/9sulSSbHmxakTOYpmZIDGhEiBo7KH9rsek9ZQU9
MZEyWyPUqHiWGL82F5F3yy4NK5vLUu8RaiVHrbMPrEqgkPTIIlSMo512vQ608hJa
v1Ee28xP6bHdvZeVyqSUcY2Rdoexh+CQ1DOZABEBAAG0E3Rlc3RfY2xpZW50XzAw
MDAwMDGJATkEEwEIACMFAlgqlVYCGwMHCwkIBwMCAQYVCAIJCgsEFgIDAQIeAQIX
gAAKCRDO29wCZYLZsgzXB/48K09OgCZc9SrnsM/OOXbRcfD66bi7ivASM1VsKReN
4LvOG+QhTFcoj/HxJ+EnTXqz2XhxtUvIas33AI33Sip9XZ2Pt0klAWBjbmEiN7nM
tVfgxcB5MU4XSfcvunW9I0EnoR0FlpHyMIS9mTuMVNsOz4WfK4Xy0ipRWAWcX+I+
cLYFpZ41jgcECYb9SsTOWkspBMXkfGMycHisKDPGLYBrsZIuCGdL0vmGmkUlm3BG
psnDwW22ZHydwT/qUKsBeS0vouxfXTyZChpZhJeSf6usGEOH8lBbs4KmlyfXnx7l
FNUZmr4STDvPCVbZ4U/zLNU3Z2xKEI2UmpPtgqlwMlzAuQENBFgqlVYBCACz5W+7
LoF/jYBH6ud5HpW2oGztQWCW5tbSm0IesiqUXanuRsBd22lOcRNwTjtIW/OjvfM5
PCGknr09gOWHyp3+UX4W5VPoigA4OJjKDNqhqIyWLFHJqzE1BsrD4YmlTvbvg/f2
xZk2dxVlMX3M1vwjrhSZweKEq8vWtKnMllywyMn2JAjjimqsEHUcZ5yXrm3cQl/p
ZRSmZXM4gUaag47koWDlojyl58tXVDAl763SzsmCj2pDYv2SMBPuAxTI6NfWmV+g
rkIMgg+nahZeFKVwG2hdWS1RByRGZkx+zZ/LZ2TnDs0Zc/HZmt6zC7c+elQSBgRS
vmpipiUHaW2mHpXFABEBAAGJAR8EGAEIAAkFAlgqlVYCGwwACgkQztvcAmWC2bID
gggAo/wh++bsL0nbvwc4rRIvlq75wtJWGlW3JQ0AWe0O+FYXF7LfyjMn1Nf95jyV
v0qNfb83HqFmnMhcod6sKcLBYbarjxdDiqg0tuLsuwx6zjJfHN6rxU4pWyQ9YQZt
FTDUQu7z2fdbsyoxImI1nl1OWfV+AsLo+JPYzgPRExCHI51VPzQ8z/9GEqv3PfXb
n1wgsuNsqps9DJ8yJE2RcdpWba3RfL9fKDiet4Qpt9u/++e2++SMlliykaKo0oHy
pvoIvX5766bGVIqGyh8DtuzmlWNvkjoTTkJ96Gn66AM1NjRVxs6aW0ndvKY0DCVI
Jh3lPln3y0XSF6yYtUukvOLKtw==
=xC4H
-----END PGP PUBLIC KEY BLOCK-----
`
        return notPGPContent(content)(openpgp)
        .then((content) => {
            assert.notEqual(1, 1)
        })
        .catch(err => {
            assert.equal(err.message, 'PGP content')
        })
    });

    test('notPGPContent returns content if content is not PGP Content', function testNotPGPContent() {
        let content = '123456789';
        return notPGPContent(content)(openpgp)
        .then(testResult => {
            assert.equal(content, testResult);
        })
        .catch(err => {
            throw new Error(err);
        })
    });
});
