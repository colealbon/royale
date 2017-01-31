//import 'webcomponents.js/webcomponents.js';
//uncomment line above to double app size and support ios.

// helper functions
import * as util from './lib/util';
window.handlePost = util.handlePost;
// window.handleContent = util.handleContent;
// window.isPGPPubkey   = util.isPGPPubkey;
// window.isPGPPrivkey  = util.isPGPPrivkey;

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
