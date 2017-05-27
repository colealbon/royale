'use strict';

export function getFromStorage(localStorage) {
    // usage: getFromStorage(localStorage)([key]).then(result => result)
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
