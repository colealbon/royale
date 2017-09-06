'use strict';
import notUndefined from '../../src/lib/notUndefined.js';
export default function notEmpty(content) {
    return notUndefined(content)
    .then(() => {
        return new Promise((resolve, reject) => {
            try {
                if(content !== '') {
                    resolve(content);
                } else {
                    reject(new Error('empty content'));
                }
            } catch (err) {
                reject(err);
            }
        })
    });
};
