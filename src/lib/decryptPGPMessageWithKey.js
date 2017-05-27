'use strict';

export function decryptPGPMessageWithKey(openpgp) {
    //  usage: decryptPGPMessageWithKey(openpgp)(privateKeyArmor)(password)(GPMessageArmor).then(result => result)
    return (!openpgp) ?
    Promise.reject('Error: missing openpgp'):
    (privateKeyArmor) => {
        return (!privateKeyArmor) ?
        Promise.reject('Error: missing privateKeyArmor'):
        (password) => {
            return (!password) ?
            Promise.reject('Error: missing password'):
            (PGPMessageArmor) => {
                return (!PGPMessageArmor) ?
                Promise.reject('Error: missing PGPMessageArmor'):
                new Promise((resolve, reject) => {
                    try {
                        let privateKeys = openpgp.key.readArmored(privateKeyArmor)
                        let privateKey = privateKeys.keys[0]
                        privateKey.decrypt(password)
                        let message = openpgp.message.readArmored(PGPMessageArmor)
                        return (!openpgp.decrypt) ?
                        openpgp.decryptMessage(privateKey, message)
                        .then(result => {
                            resolve(result);
                            }
                        ):
                        openpgp.decrypt({ 'message': message, 'privateKey': privateKey })
                        .then(result => {
                            resolve(result.data);
                        });
                    } catch(err) {
                        //resolve();
                        reject(err);
                    }
                })
            }
        }
    }
}
