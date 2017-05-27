'use strict';

import notEmpty from '../../src/lib/notEmpty.js';
import notPGPContent from '../../src/lib/notPGPContent.js';

export function handleCleartext(content) {
    return (!content) ?
    () => notEmpty(content):
    (openpgp) => {
        return (!openpgp) ?
        Promise.reject(new Error('missing openpgp')):
        notPGPContent(content)(openpgp);
    }
};
