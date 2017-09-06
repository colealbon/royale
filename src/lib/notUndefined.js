'use strict';

export default function notUndefined(content) {
    return new Promise((resolve, reject) => {
        try {
            if(typeof(content).toString() !== 'undefined') {
                resolve(content);
            }
        }
        catch(err) {
            reject(new Error('undefined content'));
        }
    })
};
