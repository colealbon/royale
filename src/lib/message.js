'use strict';

let const isEmpty = function isEmpty(content) {
    return new Promise((resolve, reject) => {
        try {
            resolve(!content);
        }
        catch (err) {
            reject(err)
        }
    })
};
exports.isEmpty = isEmpty;
