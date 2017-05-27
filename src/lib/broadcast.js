'use strict';

import {getFromStorage} from './getFromStorage';

export function broadcast(content) {
    const notPGPPrivkey = require('./notPGPPrivkey.js');
    // import notCleartext from './notCleartext.js';
    // import notEmpty from './notEmpty.js';
    notPGPPrivkey(content);
    // notCleartext(content);
    // notEmpty(content);

    gun.get('royale').put({
          name: "LATEST",
          email: content
        });

}
