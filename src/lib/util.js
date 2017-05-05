'use strict';

const classifyKeyType = (content) => {
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
                    resolve('PGPPrivkey');
                } else {
                    resolve('PGPPubkey');
                }
            } catch (error) {
                reject(error);
            }
        })
    }
}
// export function processCleartext(content) {
//     // usage: classifyContent(content)(openpgp).then(result => result)
//     return (!content) ?
//     Promise.resolve(''):
//     (openpgp) => {
//         return (!openpgp) ?
//         Promise.reject('Error: missing openpgp'):
//         new Promise((resolve, reject) => {
//             let possiblepgpkey = openpgp.key.readArmored(content);
//             if (possiblepgpkey.keys[0]) {
//                 return classifyKeyType(possiblepgpkey)(openpgp)();
//             } else {
//                 try {
//                     openpgp.message.readArmored(content);
//                     resolve('PGPMessage');
//                 } catch (err) {
//                     resolve('cleartext');
//                 }
//             }
//         })
//     }
// }

export function classifyContent(content) {
    // usage: classifyContent(content)(openpgp).then(result => result)
    return (!content) ?
    Promise.resolve(''):
    (openpgp) => {
        return (!openpgp) ?
        Promise.reject('Error: missing openpgp'):
        new Promise((resolve, reject) => {
            let possiblepgpkey = openpgp.key.readArmored(content);
            if (possiblepgpkey.keys[0]) {
                classifyKeyType(content)(openpgp)
                .then((keyType) => {
                    resolve(keyType);
                });
            } else {
                try {
                    openpgp.message.readArmored(content);
                    resolve('PGPMessage');
                } catch (err) {
                    resolve('cleartext');
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
                    classifyContent(existingKey)(openpgp);
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
                openpgp.encryptMessage(PGPPubkey.keys[0], cleartext)
                .then(encryptedtxt => {
                    resolve(encryptedtxt)
                })
                .catch((err) => reject(err))
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
                            .filter(storeItem => (!storeItem) ? false : true)
                            .map(storeItem => classifyContent(storeItem)(openpgp)
                                .then(contentType => {
                                    if (contentType === 'PGPPrivkey') {
                                        decryptPGPMessageWithKey(PGPMessageArmor)(openpgp)(storeItem)('hotlips')
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
                    classifyContent(content)(openpgp)
                    .then(contentType => {
                        if (contentType === 'cleartext') {
                            // encrypt and broadcast
                            return content;
                        }
                        if (contentType === 'PGPPrivkey') {
                            // save and broadcast converted public key
                            return savePGPPrivkey(content)(openpgp)(localStorage)
                            //return broadcastMessage(content)(openpgp)(localStorage)
                            .then(result => result)
                        }
                        if (contentType === 'PGPPubkey') {
                            // save to localStorage
                            return savePGPPubkey(content)(openpgp)(localStorage)
                            .then(result => result)
                        }
                        if (contentType === 'PGPMessage') {
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
//     var gunaddress = '{{ip_local}}:{{port}}'
//     var gun = Gun(`http://${gunaddress}/gun`);
//     var gundata = gun.get('data');
//     gundata.put({ message:`client listening to http://${gunaddress}/gun` });
//     gundata.path('message').on(function (message) {
//         handleIncomingMessage(message)
//     });
// </script>
