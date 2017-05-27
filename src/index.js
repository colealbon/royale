'use strict';
//import 'webcomponents.js/webcomponents.js';
//uncomment line above to double app size and support ios.

import {handlePost} from './lib/handlePost.js';
import {determineContentType} from './lib/determineContentType.js'
import {determineKeyType} from './lib/determineKeyType.js'
import {encryptCleartextMulti} from './lib/encryptCleartextMulti.js'
import {encryptClearText} from './lib/encryptClearText.js'
import {decryptPGPMessage} from './lib/decryptPGPMessage.js'
import {savePGPPubkey} from './lib/savePGPPubkey.js'
import {savePGPPrivkey} from './lib/savePGPPrivkey.js'
import {getFromStorage} from './lib/getFromStorage.js'
import {decryptPGPMessageWithKey} from './lib/decryptPGPMessageWithKey.js'

window.handlePost = handlePost ;
window.determineContentType = determineContentType;
window.determineKeyType = determineKeyType;
window.encryptCleartextMulti = encryptCleartextMulti;
window.encryptClearText = encryptClearText;
window.decryptPGPMessage = decryptPGPMessage;
window.savePGPPubkey = savePGPPubkey;
window.savePGPPrivkey = savePGPPrivkey;
window.getFromStorage = getFromStorage;
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
import {ConnectPage} from './pages/connect.js';
