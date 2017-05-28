'use strict';

export function decryptPGPMessageWithKey(openpgp) {
    return (!openpgp) ?
    Promise.reject(new Error('missing openpgp')):
    (password) => {
        return (!password) ?
        Promise.reject(new Error('missing password')):
        (privateKeyArmor) => {
            return (!privateKeyArmor) ?
            Promise.reject(new Error('missing privateKeyArmor')):
            (PGPMessageArmor) => {
                return (!PGPMessageArmor) ?
                Promise.reject(new Error('missing PGPMessageArmor')):
                new Promise((resolve, reject) => {
                    try {
                        var passphrase = `${password}`; //what the privKey is encrypted with
                        var privKeyObj = openpgp.key.readArmored(`${privateKeyArmor}`).keys[0];
                        privKeyObj.decrypt(passphrase);
                        try {
                            var message = openpgp.message.readArmored(PGPMessageArmor)
                            if (!privKeyObj.primaryKey.isDecrypted) {
                                reject(new Error('Private key is not decrypted'));
                            }
                            if (!openpgp.decrypt) {
                                openpgp.decryptMessage(privKeyObj, message)
                                .then(cleartext => {
                                    resolve(cleartext);
                                })
                                .catch((err) => reject(err))
                            } else {
                                openpgp.decrypt({ 'message': message, 'privateKey': privKeyObj })
                                .then(result => {
                                    console.log(result.data)
                                    resolve(result.data);
                                })
                            };
                        } catch(err) {
                            //resolve();
                            reject(err);
                        }
                    } catch (err) {
                        reject(new Error('bad privateKeyArmor'));
                    }
                })
            }
        }
    }
}
