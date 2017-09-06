'use strict';
/*eslint-env node, mocha, es6 */
process.env.NODE_ENV = 'test';

const Storage = require('dom-storage')
const chai = require('chai');
const assert = chai.assert;

var openpgp = require('../../test/openpgp162/openpgp.js');
//const openpgp = require('openpgp'); <- use if it stops throwing Float64 err

import {encryptClearText} from '../../src/lib/encryptClearText.js';
import {decryptPGPMessageWithKey} from '../../src/lib/decryptPGPMessageWithKey.js';

suite('encryptClearText', function() {

    test('encryptClearText throws error on missing openpgp', function() {
        return encryptClearText()
        .catch(err => assert.equal(err.toString(), 'Error: missing openpgp'));
    });
    test('encryptClearText throws error on missing public key', function() {
        return encryptClearText(openpgp)()
        .catch(err => assert.equal(err.toString(), 'Error: missing public key'));
    });
    test('encryptClearText throws error on missing cleartext', function() {
        return encryptClearText(openpgp)(`
-----BEGIN PGP PUBLIC KEY BLOCK-----

mQENBFkp3E0BCACm1ITTy9tbDbpK+fN+IeW34zbWFSFmJJhuuXzK0TNiOgZMrW5p
ATuXyljQs3SIbMozqbUWFZbqSm7WVyBKJ+TgHrBh4hH5l5Fd9GNJ0Nn/ud9BrDLD
xQczwfPpn06ALsPfqYI2P5WIydqdsv+AxPhSfBp3CEOGcLpf9uWPxOrvCu1bA19c
Ir3eaj7NKAM2ItXj5f+IwMF/H0iv0rVX0JDso4zEvj29ePDVntzlbNzQF7mmPyAK
fXKuNqE8UZGLsktMsndTseeN8cRLelw3nddr1db21GN0yi/n8Ut4CAVFOoxxZ7uy
KPR/0kY/iR7h/uo+iij8ueUtbSLhpqgC1E4BABEBAAG0EnJveWFsZS1zZXJ2ZXIt
dGVzdIkBVAQTAQgAPhYhBGvmQhHjK37KWzHklQLNmU8j+0YIBQJZKdxNAhsDBQkD
wmcABQsJCAcCBhUICQoLAgQWAgMBAh4BAheAAAoJEALNmU8j+0YIK/cH/iibG1cD
LiT4EKYZDOaqaq7OlQXSgjQLn3VvSe31fXHGbM0Duhgsp5Z9wt6ZvZeNAMCLJCer
KxOvPUITgbIapSMo2MPjmE6Hd5cr9G8bzOL22VzudRInRf+/Y2p48kA0v4bKSKuc
ttogQ5cQtDEWNtSBSdETRz+VMRjiEbK7rN9EjfHiISYIy82UKWuHahZ3ldOF0+uF
azXz05w+n2h34JUHmJovM0GWkw2p7cAS3prrsertMXWP7dJmwmTMfHi4OnUpC+x6
OcUI2POZFzPDRkNhd3g3yUKea2G4Mixrs6aWoNVSoCKw0S/TWOO7kwDVkIq18Ntb
bWshote455RhpAm5AQ0EWSncTQEIAKiftWTpMhl/lR+v811ZpR6nw22Tf8n+4vOB
0WR1XOZZ1C9JxfyhlKndegIo+kp2ydgQKMGACXQRjiptu2AMFVFI2Wvhf2w/hxbZ
Nk2hd0u9Y+fygxJ8kS47453KZarejjEVuKyDzqo+Kz48nLsVLIUzynSLdYupZl4Z
OXIIM1YasP1TTG6MpEoBSC8u+CQMstjXEs88rpPxuSVJjVX+KjORjEiI0Td7dzM8
cxuUXZR9toqGckzlmo1wswMKYROP7Pj7s8nTkXuzrqCPowO0ZSwxysvej1NNgy3K
2qAShcwTeZpUb+3/fYx1MEc666OgAyN/bpUa9oaRyBfuvvE3gocAEQEAAYkBPAQY
AQgAJhYhBGvmQhHjK37KWzHklQLNmU8j+0YIBQJZKdxNAhsMBQkDwmcAAAoJEALN
mU8j+0YIOGoH+QE42edkcIJY0DKB982K1nPMmFHz7/3zpxaH4cRMh9wyZlDZAs8Q
pQki2eJLaN8AHNE5cR6ac4HLo04vqLCtqS25nXgy1vDWNzgpjeGIWCF1/ue77nwH
vFuT9MhsM4iR+s7W8SZwXJMhnGxWQj+YZQiXCihsrIzasRNV1QWVGyvxC0pCtQbZ
+mO+KlWdF+97mlIkHTX+rjiXtPg/1by2AsFGCZ1+8so4/p/ScD/tWSOG9+Xb6OX9
PfLMOVjIpDBrSMO7VvqLNst7y9+PfoA2tbAXAtnnkZmLeV3vY2RjpN1K00r36ecF
VDZ9Zp7E/Wu5Jdbw6EoZ40hbbtcksJwE4XQ=
=QFrJ
-----END PGP PUBLIC KEY BLOCK-----`)()
        .catch(err => assert.equal(err.toString(), 'Error: missing cleartext'));
    });
    test('encryptClearText round trip encrypt -> decrypt', function() {
        let privateKeyHotlips = `
-----BEGIN PGP PRIVATE KEY BLOCK-----

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
5wVUNn1mnsT9a7kl1vDoShnjSFtu1ySwnAThdA==
=N1eN
-----END PGP PRIVATE KEY BLOCK-----
`
    let pubkeyHotlips = `
-----BEGIN PGP PUBLIC KEY BLOCK-----

mQENBFkp3E0BCACm1ITTy9tbDbpK+fN+IeW34zbWFSFmJJhuuXzK0TNiOgZMrW5p
ATuXyljQs3SIbMozqbUWFZbqSm7WVyBKJ+TgHrBh4hH5l5Fd9GNJ0Nn/ud9BrDLD
xQczwfPpn06ALsPfqYI2P5WIydqdsv+AxPhSfBp3CEOGcLpf9uWPxOrvCu1bA19c
Ir3eaj7NKAM2ItXj5f+IwMF/H0iv0rVX0JDso4zEvj29ePDVntzlbNzQF7mmPyAK
fXKuNqE8UZGLsktMsndTseeN8cRLelw3nddr1db21GN0yi/n8Ut4CAVFOoxxZ7uy
KPR/0kY/iR7h/uo+iij8ueUtbSLhpqgC1E4BABEBAAG0EnJveWFsZS1zZXJ2ZXIt
dGVzdIkBVAQTAQgAPhYhBGvmQhHjK37KWzHklQLNmU8j+0YIBQJZKdxNAhsDBQkD
wmcABQsJCAcCBhUICQoLAgQWAgMBAh4BAheAAAoJEALNmU8j+0YIK/cH/iibG1cD
LiT4EKYZDOaqaq7OlQXSgjQLn3VvSe31fXHGbM0Duhgsp5Z9wt6ZvZeNAMCLJCer
KxOvPUITgbIapSMo2MPjmE6Hd5cr9G8bzOL22VzudRInRf+/Y2p48kA0v4bKSKuc
ttogQ5cQtDEWNtSBSdETRz+VMRjiEbK7rN9EjfHiISYIy82UKWuHahZ3ldOF0+uF
azXz05w+n2h34JUHmJovM0GWkw2p7cAS3prrsertMXWP7dJmwmTMfHi4OnUpC+x6
OcUI2POZFzPDRkNhd3g3yUKea2G4Mixrs6aWoNVSoCKw0S/TWOO7kwDVkIq18Ntb
bWshote455RhpAm5AQ0EWSncTQEIAKiftWTpMhl/lR+v811ZpR6nw22Tf8n+4vOB
0WR1XOZZ1C9JxfyhlKndegIo+kp2ydgQKMGACXQRjiptu2AMFVFI2Wvhf2w/hxbZ
Nk2hd0u9Y+fygxJ8kS47453KZarejjEVuKyDzqo+Kz48nLsVLIUzynSLdYupZl4Z
OXIIM1YasP1TTG6MpEoBSC8u+CQMstjXEs88rpPxuSVJjVX+KjORjEiI0Td7dzM8
cxuUXZR9toqGckzlmo1wswMKYROP7Pj7s8nTkXuzrqCPowO0ZSwxysvej1NNgy3K
2qAShcwTeZpUb+3/fYx1MEc666OgAyN/bpUa9oaRyBfuvvE3gocAEQEAAYkBPAQY
AQgAJhYhBGvmQhHjK37KWzHklQLNmU8j+0YIBQJZKdxNAhsMBQkDwmcAAAoJEALN
mU8j+0YIOGoH+QE42edkcIJY0DKB982K1nPMmFHz7/3zpxaH4cRMh9wyZlDZAs8Q
pQki2eJLaN8AHNE5cR6ac4HLo04vqLCtqS25nXgy1vDWNzgpjeGIWCF1/ue77nwH
vFuT9MhsM4iR+s7W8SZwXJMhnGxWQj+YZQiXCihsrIzasRNV1QWVGyvxC0pCtQbZ
+mO+KlWdF+97mlIkHTX+rjiXtPg/1by2AsFGCZ1+8so4/p/ScD/tWSOG9+Xb6OX9
PfLMOVjIpDBrSMO7VvqLNst7y9+PfoA2tbAXAtnnkZmLeV3vY2RjpN1K00r36ecF
VDZ9Zp7E/Wu5Jdbw6EoZ40hbbtcksJwE4XQ=
=QFrJ
-----END PGP PUBLIC KEY BLOCK-----
`
        return encryptClearText(openpgp)(pubkeyHotlips)('always be better')
        .then(encrypted => {
            return decryptPGPMessageWithKey(openpgp)('royale')(privateKeyHotlips)(encrypted)
            .then(decrypted => {
                assert.equal(decrypted, 'always be better')
            })
        })
        .catch(err => {
            assert.equal(true, err);
        })
    });
});
