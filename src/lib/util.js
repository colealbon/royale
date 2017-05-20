'use strict';

const PGPPUBKEY = 'PGPPubkey';
const CLEARTEXT = 'cleartext';
const PGPPRIVKEY = 'PGPPrivkey';
const PGPMESSAGE = 'PGPMessage';

function determineKeyType(content) {
    return (!content) ?
    Promise.reject('Error: mising pgpKey'):
    (openpgp) => {
        return (!openpgp) ?
        Promise.reject('Error: missing openpgp'):
        new Promise((resolve, reject) => {
            try {
                let privateKeys = openpgp.key.readArmored(content)
                let privateKey = privateKeys.keys[0]
                if (privateKey.toPublic().armor() !== privateKey.armor() ) {
                    resolve(PGPPRIVKEY);
                } else {
                    resolve(PGPPUBKEY);
                }
            } catch (error) {
                reject(error);
            }
        })
    }
}

export function determineContentType(content) {
    // usage: determineContentType(content)(openpgp).then(result => result)
    return (!content) ?
    Promise.resolve(''):
    (openpgp) => {
        return (!openpgp) ?
        Promise.reject('Error: missing openpgp'):
        new Promise((resolve, reject) => {
            let possiblepgpkey = openpgp.key.readArmored(content);
            if (possiblepgpkey.keys[0]) {
                determineKeyType(content)(openpgp)
                .then((keyType) => {
                    resolve(keyType);
                });
            } else {
                try {
                    openpgp.message.readArmored(content);
                    resolve(PGPMESSAGE);
                } catch (err) {
                    resolve(CLEARTEXT);
                }
            }
        })
    }
}

function getFromStorage(localStorage) {
    // usage: savePGPkey(content)(openpgp)(localStorage).then(result => result)
    return (!localStorage) ?
    Promise.reject('Error: missing localStorage'):
    (indexKey) => {
        return (!indexKey) ?
        // no index -> return everything
        new Promise((resolve, reject) => {
            try {
                let i = localStorage.length
                let keyArr = []
                while (i >= 0) {
                    i = i - 1
                    keyArr.push(localStorage.getItem(localStorage.key(i)))
                    if (i === 0) {
                        resolve(keyArr)
                    }
                }
            }
            catch (err) {
                reject(err)
            }
        }):
        // index provided -> return one
        new Promise((resolve, reject) => {
            try {
                resolve(localStorage.getItem(indexKey))
            }
            catch (err) {
                reject(err)
            }
        })
    }
}

function savePGPPubkey(PGPkeyArmor) {
    // save public key to storage only if it doesn't overwrite a private key
    // usage: savePGPPubkey(content)(openpgp)(localStorage).then(result => result)
    return (!PGPkeyArmor) ?
    Promise.reject('Error: missing PGPkeyArmor'):
    (openpgp) => {
        return (!openpgp) ?
        Promise.reject('Error: missing openpgp'):
        (localStorage) => {
            return (!localStorage) ?
            Promise.reject('Error: missing localStorage'):
            new Promise((resolve, reject) => {
                let PGPkey = openpgp.key.readArmored(PGPkeyArmor);
                getFromStorage(localStorage)(PGPkey.keys[0].users[0].userId.userid)
                .then(existingKey => {
                    return (!existingKey) ?
                    Promise.resolve('none') :
                    determineContentType(existingKey)(openpgp);
                })
                .then(existingKeyType => {
                    if (existingKeyType === 'PGPPrivkey'){
                        resolve('pubkey ignored X- attempted overwrite privkey')
                    } else {
                        localStorage.setItem(PGPkey.keys[0].users[0].userId.userid, PGPkeyArmor)
                        resolve(`public pgp key saved <- ${PGPkey.keys[0].users[0].userId.userid}`)
                    }
                })
                .catch((err) => reject(err))
            })
        }
    }
}

function savePGPPrivkey(PGPkeyArmor) {
    // save private key to storage no questions asked
    // usage: savePGPPrivkey(content)(openpgp)(localStorage).then(result => result)
    return (!PGPkeyArmor) ?
    Promise.reject('Error: missing PGPkeyArmor'):
    (openpgp) => {
        return (!openpgp) ?
        Promise.reject('Error: missing openpgp'):
        (localStorage) => {
            return (!localStorage) ?
            Promise.reject('Error: missing localStorage'):
            new Promise((resolve, reject) => {
                try {
                    let PGPkey = openpgp.key.readArmored(PGPkeyArmor);
                    localStorage.setItem(PGPkey.keys[0].users[0].userId.userid, PGPkeyArmor)
                    process.setImmediate(
                        resolve(`private pgp key saved <- ${PGPkey.keys[0].users[0].userId.userid}`)
                    )
                } catch(err) {
                    reject(err);
                }
            })
        }
    }
}

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
            new Promise((resolve, reject) => {
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

function encryptCleartextMulti(content) {
    // usage: encryptCleartextMulti(content)(openpgp)(localStorage).then(result => result)
    return (!content) ?
    Promise.reject('Error: missing content'):
    (openpgp) => {
        return (!openpgp) ?
        Promise.reject('Error: missing openpgp'):
        (localStorage) => {
            return (!localStorage) ?
            Promise.reject('Error: missing localStorage'):
            new Promise((resolve, reject) => {
                try {
                    getFromStorage(localStorage)()
                    .then((storageArr) => {
                        //let publicKeyArr = [];
                        let encryptedMsgs = [];
                        let i = storageArr.length;
                        let idx = 0;
                        storageArr
                        .map((storageItem) => {
                            i--;
                            return storageItem;
                        })
                        .filter(storageItem => (!storageItem) ? false : true)
                        .map((storageItem) => {
                            determineContentType(storageItem)(openpgp)
                            .then((contentType) => {
                                if (contentType === PGPPUBKEY) {
                                    encryptClearText(openpgp)(storageItem)(content)
                                    .then((encrypted) => {
                                        encryptedMsgs[idx] = encrypted;
                                        idx++;
                                        if (i === 0) {
                                            resolve(encryptedMsgs);
                                        }
                                    })
                                }
                            })
                        })
                    })
                } catch (err) {
                    reject (new Error (err));
                }
            })
        }
    }
}

export function decryptPGPMessageWithKey(PGPMessageArmor) {
    //  usage: decryptPGPMessageWithKey(content)(openpgp)(privateKeyArmor)(password).then(result => result)
    return (!PGPMessageArmor) ?
    Promise.reject('Error: missing PGPMessage'):
    (openpgp) => {
        return (!openpgp) ?
        Promise.reject('Error: missing openpgp'):
        (privateKeyArmor) => {
            return (!privateKeyArmor) ?
            Promise.reject('Error: missing privateKeyArmor'):
            (password) => {
                return (!password) ?
                Promise.reject('Error: missing password'):
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

export function decryptPGPMessage(PGPMessageArmor) {
    //  usage: decryptPGPMessage(content)(openpgp)(localStorage)(password).then(result => result)
    return (!PGPMessageArmor) ?
    Promise.reject('Error: missing PGPMessage'):
    (openpgp) => {
        return (!openpgp) ?
        Promise.reject('Error: missing openpgp'):
        (localStorage) => {
            return (!localStorage) ?
            Promise.reject('Error: missing localStorage'):
            (password) => {
                return (!password) ?
                Promise.reject("Error: missing password"):
                new Promise((resolve, reject) => {
                    getFromStorage(localStorage)().then(storeArr => {
                        try {
                            return storeArr
                            .filter(storageItem => (!storageItem) ? false : true)
                            .map(storageItem => determineContentType(storageItem)(openpgp)
                                .then(contentType => {
                                    if (contentType === PGPPRIVKEY) {
                                        decryptPGPMessageWithKey(PGPMessageArmor)(openpgp)(storageItem)('hotlips')
                                        .then(decrypted => {
                                            resolve(decrypted);
                                        })
                                    }
                                })
                            )
                        } catch(err) {
                            reject(err);
                        }
                    })
                })
            }
        }
    }
}

// export function broadcast(content) {
//     const notPGPPrivkey = require('./notPGPPrivkey.js');
//     // import notCleartext from './notCleartext.js';
//     // import notEmpty from './notEmpty.js';
//     notPGPPrivkey(content);
//     // notCleartext(content);
//     // notEmpty(content);
//
//     gun.get('royale').put({
//           name: "LATEST",
//           email: content
//         });
//
// }

export function handlePost(content) {
    //console.log(`handlePost <- ${content}`);
    return (!content) ?
    Promise.resolve('') :
    (openpgp) => {
        return (!openpgp) ?
        Promise.reject('Error: missing openpgp'):
        (localStorage) => {
            return (password) => {
                return new Promise((resolve, reject) => {
                    determineContentType(content)(openpgp)
                    .then(contentType => {
                        if (contentType === CLEARTEXT) {
                            // encrypt
                            return encryptCleartextMulti(content)(openpgp)(localStorage)
                            .then(result => result);
                        }
                        if (contentType === PGPPRIVKEY) {
                            // save and broadcast converted public key
                            return savePGPPrivkey(content)(openpgp)(localStorage)
                            //return broadcastMessage(content)(openpgp)(localStorage)
                            .then(result => result)
                        }
                        if (contentType === PGPPUBKEY) {
                            // save to localStorage
                            return savePGPPubkey(content)(openpgp)(localStorage)
                            .then(result => result)
                        }
                        if (contentType === PGPMESSAGE) {
                            // get PGPKeys, decrypt,  and return
                            return decryptPGPMessage(content)(openpgp)(localStorage)(password)
                            .then(result => {
                                return result
                            })
                        }
                    })
                    .then(result => {
                        resolve(result)
                    })
                    .catch((err) => reject(err))
                })
            }
        }
    }
}
