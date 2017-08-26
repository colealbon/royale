'use strict';

export function encryptClearText(openpgp) {
    // usage: encryptClearText(openpgp)(publicKeyArmor)(cleartext).then(result => result)
    return (!openpgp) ?
    Promise.reject('Error: missing openpgp'):
    (publicKeyArmor) => {
        return (!publicKeyArmor) ?
        Promise.reject('Error: missing public key'):
        (cleartext) => {
            return (!cleartext) ?
            Promise.reject('Error: missing cleartext'):
            new Promise((resolve) => {
                let PGPPubkey = openpgp.key.readArmored(publicKeyArmor)
                /*
                the latest openpgp 2.5.4 breaks on our console only tools.
                but it's 10x faster on browsers so THE NEW CODE STAYS IN.
                below we exploit fallback to old slow error free openpgp 1.6.2
                by adapting on the fly to a breaking change
                (openpgp bug ^1.6.2 -> 2.5.4 made us do it)
                refactor: remove try section of trycatch keep catch section
                by all means refactor if not broken after openpgp 2.5.4
                if you check openpgp please bump failing version  ^^^^^
                */
                try {
                    // works only on openpgp version 1.6.2
                    openpgp.encryptMessage(PGPPubkey.keys[0], cleartext)
                    .then(encryptedtxt => {
                        resolve(encryptedtxt)
                    })
                    .catch()
                } catch(err) {
                    // works on openpgp version 2.5.4
                    let options = {
                        data: cleartext,
                        publicKeys: openpgp.key.readArmored(publicKeyArmor).keys,
                        armor: true
                    };
                    openpgp.encrypt(options)
                    .then((ciphertext) => {
                        resolve(ciphertext.data);
                    });
                }
            })
        }
    }
}
