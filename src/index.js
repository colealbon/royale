'use strict';
//import 'webcomponents.js/webcomponents.js';
//uncomment line above to double app size and support ios.

import {handlePost} from './lib/handlePost.js';
window.handlePost = handlePost;
import {determineContentType} from './lib/determineContentType.js'
window.determineContentType = determineContentType;
import {determineKeyType} from './lib/determineKeyType.js'
window.determineKeyType = determineKeyType;
import {encryptCleartextMulti} from './lib/encryptCleartextMulti.js'
window.encryptCleartextMulti = encryptCleartextMulti;
import {encryptClearText} from './lib/encryptClearText.js'
window.encryptClearText = encryptClearText;
import {decryptPGPMessage} from './lib/decryptPGPMessage.js'
window.decryptPGPMessage = decryptPGPMessage;
import {savePGPPubkey} from './lib/savePGPPubkey.js'
window.savePGPPubkey = savePGPPubkey;
import {savePGPPrivkey} from './lib/savePGPPrivkey.js'
window.savePGPPrivkey = savePGPPrivkey;
import {getFromStorage} from './lib/getFromStorage.js'
window.getFromStorage = getFromStorage;
import {decryptPGPMessageWithKey} from './lib/decryptPGPMessageWithKey.js'
window.decryptPGPMessageWithKey = decryptPGPMessageWithKey;

// rebel router
import {RebelRouter} from '../node_modules/rebel-router/src/rebel-router.js';

// Gundb public facing DAG database  (for messages to and from the enemy)
import {Gun} from 'gun/gun.js';

// pages (most of this should be in views/partials to affect isormorphism)
import {IndexPage}   from './pages/index.js';
import {RoadmapPage} from './pages/roadmap.js';
import {ContactPage} from './pages/contact.js';
import {MessagePage} from './pages/message.js';
import {DeckPage}    from './pages/deck.js';
