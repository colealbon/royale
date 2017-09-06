/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 31);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = notEmpty;

var _notUndefined = __webpack_require__(34);

var _notUndefined2 = _interopRequireDefault(_notUndefined);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function notEmpty(content) {
    return (0, _notUndefined2.default)(content).then(function () {
        return new Promise(function (resolve, reject) {
            try {
                if (content !== '') {
                    resolve(content);
                } else {
                    reject(new Error('empty content'));
                }
            } catch (err) {
                reject(err);
            }
        });
    });
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.determineContentType = determineContentType;

var _determineKeyType = __webpack_require__(9);

function determineContentType(content) {
    // usage: determineContentType(content)(openpgp).then(result => result)
    return !content ? Promise.resolve('') : function (openpgp) {
        return !openpgp ? Promise.reject('Error: missing openpgp') : new Promise(function (resolve, reject) {
            var CLEARTEXT = 'cleartext';
            var PGPMESSAGE = 'PGPMessage';
            var possiblepgpkey = openpgp.key.readArmored(content);
            if (possiblepgpkey.keys[0]) {
                (0, _determineKeyType.determineKeyType)(content)(openpgp).then(function (keyType) {
                    resolve(keyType);
                });
            } else {
                try {
                    openpgp.message.readArmored(content);
                    resolve(PGPMESSAGE);
                } catch (err) {
                    resolve(CLEARTEXT);
                }
            }
        });
    };
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getFromStorage = getFromStorage;
function getFromStorage(localStorage) {
    // usage: getFromStorage(localStorage)([key]).then(result => result)
    return !localStorage ? Promise.reject('Error: missing localStorage') : function (indexKey) {
        return !indexKey ?
        // no index -> return everything
        new Promise(function (resolve, reject) {
            try {
                var i = localStorage.length;
                var keyArr = [];
                while (i >= 0) {
                    i = i - 1;
                    keyArr.push(localStorage.getItem(localStorage.key(i)));
                    if (i === 0) {
                        resolve(keyArr);
                    }
                }
            } catch (err) {
                reject(err);
            }
        }) :
        // index provided -> return one
        new Promise(function (resolve, reject) {
            try {
                resolve(localStorage.getItem(indexKey));
            } catch (err) {
                reject(err);
            }
        });
    };
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.savePGPPubkey = savePGPPubkey;

var _getFromStorage = __webpack_require__(2);

var _determineContentType = __webpack_require__(1);

var _notEmpty = __webpack_require__(0);

var _notEmpty2 = _interopRequireDefault(_notEmpty);

var _notCleartext = __webpack_require__(14);

var _notCleartext2 = _interopRequireDefault(_notCleartext);

var _notPGPPrivkey = __webpack_require__(5);

var _notPGPPrivkey2 = _interopRequireDefault(_notPGPPrivkey);

var _notPGPMessage = __webpack_require__(33);

var _notPGPMessage2 = _interopRequireDefault(_notPGPMessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function savePGPPubkey(PGPkeyArmor) {
    // save public key to storage only if it doesn't overwrite a private key
    // usage: savePGPPubkey(content)(openpgp)(localStorage).then(result => result)
    return !PGPkeyArmor ? Promise.reject('Error: missing PGPkeyArmor') : function (openpgp) {
        return !openpgp ? Promise.reject('Error: missing openpgp') : function (localStorage) {
            return !localStorage ? Promise.reject('Error: missing localStorage') : new Promise(function (resolve, reject) {
                var PGPkey = openpgp.key.readArmored(PGPkeyArmor);
                (0, _notEmpty2.default)(PGPkeyArmor).then(function () {
                    return (0, _notCleartext2.default)(PGPkeyArmor)(openpgp);
                }).then(function () {
                    return (0, _notPGPPrivkey2.default)(PGPkeyArmor)(openpgp);
                }).then(function () {
                    return (0, _notPGPMessage2.default)(PGPkeyArmor)(openpgp);
                }).then(function () {
                    return (0, _getFromStorage.getFromStorage)(localStorage)(PGPkey.keys[0].users[0].userId.userid);
                }).then(function (existingKey) {
                    return !existingKey ? Promise.resolve('none') : (0, _determineContentType.determineContentType)(existingKey)(openpgp);
                }).then(function (existingKeyType) {
                    if (existingKeyType === 'PGPPrivkey') {
                        resolve('pubkey ignored X- attempted overwrite privkey');
                    } else {
                        localStorage.setItem(PGPkey.keys[0].users[0].userId.userid, PGPkeyArmor);
                        resolve('public pgp key saved <- ' + PGPkey.keys[0].users[0].userId.userid);
                    }
                }).catch(function (err) {
                    return reject(err);
                });
            });
        };
    };
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = notPGPPrivkey;

var _notEmpty = __webpack_require__(0);

var _notEmpty2 = _interopRequireDefault(_notEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function notPGPPrivkey(content) {
    return !content ? function () {
        return (0, _notEmpty2.default)(content);
    } : function (openpgp) {
        return !openpgp ? Promise.reject(new Error('missing openpgp')) : new Promise(function (resolve, reject) {
            try {
                var pgpKey = openpgp.key.readArmored(content).keys[0];
                if (pgpKey.toPublic().armor() !== pgpKey.armor()) {
                    reject(new Error('PGP Privkey content'));
                } else {
                    resolve(content);
                }
            } catch (error) {
                resolve(content);
            }
        });
    };
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.broadcastMulti = broadcastMulti;

var _notEmpty = __webpack_require__(0);

var _notEmpty2 = _interopRequireDefault(_notEmpty);

var _notPGPPrivkey = __webpack_require__(5);

var _notPGPPrivkey2 = _interopRequireDefault(_notPGPPrivkey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function broadcastMulti(content) {
    return !content ? Promise.reject(new Error('missing content')) : function (gun) {
        return !gun ? Promise.reject(new Error('missing gundb')) : function (openpgp) {
            return !openpgp ? Promise.reject(new Error('missing openpgp')) : (0, _notEmpty2.default)(content).then(function (content) {
                return (0, _notPGPPrivkey2.default)(content)(openpgp);
            }).then(function (content) {
                return new Promise(function (resolve, reject) {
                    try {
                        var id = 'royale';
                        var broadcastQueue = [];
                        content.map(function (message) {
                            broadcastQueue.push(broadcast(message)(gun)(openpgp));
                        });
                        Promise.all(broadcastQueue, function (result) {
                            return resolve(result);
                        });
                    } catch (error) {
                        reject(error);
                    }
                });
            });
        };
    };
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.decryptPGPMessage = decryptPGPMessage;

var _getFromStorage = __webpack_require__(2);

var _decryptPGPMessageWithKey = __webpack_require__(8);

var _determineContentType = __webpack_require__(1);

var PGPPRIVKEY = 'PGPPrivkey';

function decryptPGPMessage(openpgp) {
    //  usage: decryptPGPMessage(openpgp)(localStorage)(password)(PGPMessageArmor).then(result => result)
    return !openpgp ? Promise.reject('Error: missing openpgp') : function (localStorage) {
        return !localStorage ? Promise.reject('Error: missing localStorage') : function (password) {
            return !password ? Promise.reject("Error: missing password") : function (PGPMessageArmor) {
                return !PGPMessageArmor ? Promise.reject('Error: missing PGPMessageArmor') : new Promise(function (resolve, reject) {
                    var decryptQueue = [];
                    (0, _getFromStorage.getFromStorage)(localStorage)().then(function (storeArr) {
                        try {
                            storeArr.map(function (storageItem) {
                                try {
                                    (0, _determineContentType.determineContentType)(storageItem)(openpgp).then(function (contentType) {
                                        console.log('contentType', contentType);
                                        if (contentType === PGPPRIVKEY) {
                                            console.log('privateKey');
                                            decryptQueue.push((0, _decryptPGPMessageWithKey.decryptPGPMessageWithKey)(openpgp)(password)(storageItem)(PGPMessageArmor));
                                        }
                                    });
                                } catch (error) {}
                            });
                            process.nextTick(function () {
                                Promise.all(decryptQueue).then(function (decryptedArr) {
                                    resolve(decryptedArr[0]);
                                });
                            });
                        } catch (err) {
                            reject(err);
                        }
                    });
                });
            };
        };
    };
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.decryptPGPMessageWithKey = decryptPGPMessageWithKey;
function decryptPGPMessageWithKey(openpgp) {
    return !openpgp ? Promise.reject(new Error('missing openpgp')) : function (password) {
        return !password ? Promise.reject(new Error('missing password')) : function (privateKeyArmor) {
            return !privateKeyArmor ? Promise.reject(new Error('missing privateKeyArmor')) : function (PGPMessageArmor) {
                return !PGPMessageArmor ? Promise.reject(new Error('missing PGPMessageArmor')) : new Promise(function (resolve, reject) {
                    try {
                        var passphrase = '' + password; //what the privKey is encrypted with
                        var privKeyObj = openpgp.key.readArmored('' + privateKeyArmor).keys[0];
                        privKeyObj.decrypt(passphrase);
                        try {
                            var message = openpgp.message.readArmored(PGPMessageArmor);
                            if (!privKeyObj.primaryKey.isDecrypted) {
                                reject(new Error('Private key is not decrypted'));
                            }
                            if (!openpgp.decrypt) {
                                openpgp.decryptMessage(privKeyObj, message).then(function (cleartext) {
                                    resolve(cleartext);
                                }).catch(function (err) {
                                    return reject(err);
                                });
                            } else {
                                openpgp.decrypt({ 'message': message, 'privateKey': privKeyObj }).then(function (result) {
                                    resolve(result.data);
                                });
                            };
                        } catch (err) {
                            //resolve();
                            reject(err);
                        }
                    } catch (err) {
                        reject(new Error('bad privateKeyArmor'));
                    }
                });
            };
        };
    };
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.determineKeyType = determineKeyType;
function determineKeyType(content) {
    return !content ? Promise.reject('Error: missing pgpKey') : function (openpgp) {
        return !openpgp ? Promise.reject('Error: missing openpgp') : new Promise(function (resolve, reject) {
            var PGPPUBKEY = 'PGPPubkey';
            var PGPPRIVKEY = 'PGPPrivkey';
            try {
                var privateKeys = openpgp.key.readArmored(content);
                var privateKey = privateKeys.keys[0];
                if (privateKey.toPublic().armor() !== privateKey.armor()) {
                    resolve(PGPPRIVKEY);
                } else {
                    resolve(PGPPUBKEY);
                }
            } catch (error) {
                reject(error);
            }
        });
    };
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.encryptClearText = encryptClearText;
function encryptClearText(openpgp) {
    // usage: encryptClearText(openpgp)(publicKeyArmor)(cleartext).then(result => result)
    return !openpgp ? Promise.reject('Error: missing openpgp') : function (publicKeyArmor) {
        return !publicKeyArmor ? Promise.reject('Error: missing public key') : function (cleartext) {
            return !cleartext ? Promise.reject('Error: missing cleartext') : new Promise(function (resolve) {
                var PGPPubkey = openpgp.key.readArmored(publicKeyArmor
                /*
                the latest openpgp 2.5.4 breaks on our console only tools.
                but it's 10x faster on browsers so THE NEW CODE STAYS IN.
                below we exploit fallback to old slow error free openpgp 1.6.2
                by adapting on the fly to a breaking change
                (openpgp bug ^1.6.2 -> 2.5.4 made us do it)
                refactor: remove try section of trycatch keep catch section
                by all means refactor if not broken after openpgp 2.5.4
                if you check openpgp please bump failing version  ^^^^^
                */
                );try {
                    // works only on openpgp version 1.6.2
                    openpgp.encryptMessage(PGPPubkey.keys[0], cleartext).then(function (encryptedtxt) {
                        resolve(encryptedtxt);
                    }).catch();
                } catch (err) {
                    // works on openpgp version 2.5.4
                    var options = {
                        data: cleartext,
                        publicKeys: openpgp.key.readArmored(publicKeyArmor).keys,
                        armor: true
                    };
                    openpgp.encrypt(options).then(function (ciphertext) {
                        resolve(ciphertext.data);
                    });
                }
            });
        };
    };
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.encryptCleartextMulti = encryptCleartextMulti;

var _getFromStorage = __webpack_require__(2);

var _determineContentType = __webpack_require__(1);

var _encryptClearText = __webpack_require__(10);

var PGPPUBKEY = 'PGPPubkey';

function encryptCleartextMulti(content) {
    // usage: encryptCleartextMulti(content)(openpgp)(localStorage).then(result => result)
    return !content ? Promise.reject('Error: missing content') : function (openpgp) {
        return !openpgp ? Promise.reject('Error: missing openpgp') : function (localStorage) {
            return !localStorage ? Promise.reject('Error: missing localStorage') : new Promise(function (resolve, reject) {
                try {
                    var encryptQueue = [];
                    (0, _getFromStorage.getFromStorage)(localStorage)().then(function (storageArr) {
                        storageArr.map(function (storageItem) {
                            try {
                                (0, _determineContentType.determineContentType)(storageItem)(openpgp).then(function (contentType) {
                                    if (contentType === PGPPUBKEY) {
                                        encryptQueue.push((0, _encryptClearText.encryptClearText)(openpgp)(storageItem)(content));
                                    }
                                });
                            } catch (error) {}
                        });
                    });
                    process.nextTick(function () {
                        Promise.all(encryptQueue).then(function (encryptedArr) {
                            resolve(encryptedArr);
                        });
                    });
                } catch (err) {
                    reject(new Error(err));
                }
            });
        };
    };
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.savePGPPrivkey = savePGPPrivkey;
function savePGPPrivkey(PGPkeyArmor) {
    // save private key to storage no questions asked
    // usage: savePGPPrivkey(content)(openpgp)(localStorage).then(result => result)
    return !PGPkeyArmor ? Promise.reject('Error: missing PGPkeyArmor') : function (openpgp) {
        return !openpgp ? Promise.reject('Error: missing openpgp') : function (localStorage) {
            return !localStorage ? Promise.reject('Error: missing localStorage') : new Promise(function (resolve, reject) {
                try {
                    var PGPkey = openpgp.key.readArmored(PGPkeyArmor);
                    localStorage.setItem(PGPkey.keys[0].users[0].userId.userid, PGPkeyArmor);
                    process.setImmediate(resolve('private pgp key saved <- ' + PGPkey.keys[0].users[0].userId.userid));
                } catch (err) {
                    reject(err);
                }
            });
        };
    };
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = notCleartext;

var _notEmpty = __webpack_require__(0);

var _notEmpty2 = _interopRequireDefault(_notEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function notCleartext(content) {
    return !content ? function () {
        return (0, _notEmpty2.default)(content);
    } : function (openpgp) {
        return !openpgp ? Promise.reject(new Error('missing openpgp')) : new Promise(function (resolve, reject) {
            var possiblepgpkey = openpgp.key.readArmored(content);
            if (possiblepgpkey.keys[0]) {
                resolve(content);
            } else {
                try {
                    openpgp.message.readArmored(content);
                    resolve(content);
                } catch (err) {
                    reject(new Error('cleartext content'));
                }
            }
        });
    };
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, module) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;(function () {

	/* UNBUILD */
	var root;
	if (typeof window !== "undefined") {
		root = window;
	}
	if (typeof global !== "undefined") {
		root = global;
	}
	root = root || {};
	var console = root.console || { log: function log() {} };
	function require(arg) {
		return arg.slice ? require[resolve(arg)] : function (mod, path) {
			arg(mod = { exports: {} });
			require[resolve(path)] = mod.exports;
		};
		function resolve(path) {
			return path.split('/').slice(-1).toString().replace('.js', '');
		}
	}
	if (true) {
		var common = module;
	}
	/* UNBUILD */

	;require(function (module) {
		// Generic javascript utilities.
		var Type = {};
		//Type.fns = Type.fn = {is: function(fn){ return (!!fn && fn instanceof Function) }}
		Type.fns = Type.fn = { is: function is(fn) {
				return !!fn && 'function' == typeof fn;
			} };
		Type.bi = { is: function is(b) {
				return b instanceof Boolean || typeof b == 'boolean';
			} };
		Type.num = { is: function is(n) {
				return !list_is(n) && (n - parseFloat(n) + 1 >= 0 || Infinity === n || -Infinity === n);
			} };
		Type.text = { is: function is(t) {
				return typeof t == 'string';
			} };
		Type.text.ify = function (t) {
			if (Type.text.is(t)) {
				return t;
			}
			if (typeof JSON !== "undefined") {
				return JSON.stringify(t);
			}
			return t && t.toString ? t.toString() : t;
		};
		Type.text.random = function (l, c) {
			var s = '';
			l = l || 24; // you are not going to make a 0 length random number, so no need to check type
			c = c || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXZabcdefghijklmnopqrstuvwxyz';
			while (l > 0) {
				s += c.charAt(Math.floor(Math.random() * c.length));l--;
			}
			return s;
		};
		Type.text.match = function (t, o) {
			var r = false;
			t = t || '';
			o = Type.text.is(o) ? { '=': o } : o || {}; // {'~', '=', '*', '<', '>', '+', '-', '?', '!'} // ignore case, exactly equal, anything after, lexically larger, lexically lesser, added in, subtacted from, questionable fuzzy match, and ends with.
			if (Type.obj.has(o, '~')) {
				t = t.toLowerCase();o['='] = (o['='] || o['~']).toLowerCase();
			}
			if (Type.obj.has(o, '=')) {
				return t === o['='];
			}
			if (Type.obj.has(o, '*')) {
				if (t.slice(0, o['*'].length) === o['*']) {
					r = true;t = t.slice(o['*'].length);
				} else {
					return false;
				}
			}
			if (Type.obj.has(o, '!')) {
				if (t.slice(-o['!'].length) === o['!']) {
					r = true;
				} else {
					return false;
				}
			}
			if (Type.obj.has(o, '+')) {
				if (Type.list.map(Type.list.is(o['+']) ? o['+'] : [o['+']], function (m) {
					if (t.indexOf(m) >= 0) {
						r = true;
					} else {
						return true;
					}
				})) {
					return false;
				}
			}
			if (Type.obj.has(o, '-')) {
				if (Type.list.map(Type.list.is(o['-']) ? o['-'] : [o['-']], function (m) {
					if (t.indexOf(m) < 0) {
						r = true;
					} else {
						return true;
					}
				})) {
					return false;
				}
			}
			if (Type.obj.has(o, '>')) {
				if (t > o['>']) {
					r = true;
				} else {
					return false;
				}
			}
			if (Type.obj.has(o, '<')) {
				if (t < o['<']) {
					r = true;
				} else {
					return false;
				}
			}
			function fuzzy(t, f) {
				var n = -1,
				    i = 0,
				    c;for (; c = f[i++];) {
					if (!~(n = t.indexOf(c, n + 1))) {
						return false;
					}
				}return true;
			} // via http://stackoverflow.com/questions/9206013/javascript-fuzzy-search
			if (Type.obj.has(o, '?')) {
				if (fuzzy(t, o['?'])) {
					r = true;
				} else {
					return false;
				}
			} // change name!
			return r;
		};
		Type.list = { is: function is(l) {
				return l instanceof Array;
			} };
		Type.list.slit = Array.prototype.slice;
		Type.list.sort = function (k) {
			// creates a new sort function based off some field
			return function (A, B) {
				if (!A || !B) {
					return 0;
				}A = A[k];B = B[k];
				if (A < B) {
					return -1;
				} else if (A > B) {
					return 1;
				} else {
					return 0;
				}
			};
		};
		Type.list.map = function (l, c, _) {
			return obj_map(l, c, _);
		};
		Type.list.index = 1; // change this to 0 if you want non-logical, non-mathematical, non-matrix, non-convenient array notation
		Type.obj = { is: function is(o) {
				return o ? o instanceof Object && o.constructor === Object || Object.prototype.toString.call(o).match(/^\[object (\w+)\]$/)[1] === 'Object' : false;
			} };
		Type.obj.put = function (o, f, v) {
			return (o || {})[f] = v, o;
		};
		Type.obj.has = function (o, f) {
			return o && Object.prototype.hasOwnProperty.call(o, f);
		};
		Type.obj.del = function (o, k) {
			if (!o) {
				return;
			}
			o[k] = null;
			delete o[k];
			return o;
		};
		Type.obj.as = function (o, f, v, u) {
			return o[f] = o[f] || (u === v ? {} : v);
		};
		Type.obj.ify = function (o) {
			if (obj_is(o)) {
				return o;
			}
			try {
				o = JSON.parse(o);
			} catch (e) {
				o = {};
			};
			return o;
		};(function () {
			var u;
			function map(v, f) {
				if (obj_has(this, f) && u !== this[f]) {
					return;
				}
				this[f] = v;
			}
			Type.obj.to = function (from, to) {
				to = to || {};
				obj_map(from, map, to);
				return to;
			};
		})();
		Type.obj.copy = function (o) {
			// because http://web.archive.org/web/20140328224025/http://jsperf.com/cloning-an-object/2
			return !o ? o : JSON.parse(JSON.stringify(o)); // is shockingly faster than anything else, and our data has to be a subset of JSON anyways!
		};(function () {
			function empty(v, i) {
				var n = this.n;
				if (n && (i === n || obj_is(n) && obj_has(n, i))) {
					return;
				}
				if (i) {
					return true;
				}
			}
			Type.obj.empty = function (o, n) {
				if (!o) {
					return true;
				}
				return obj_map(o, empty, { n: n }) ? false : true;
			};
		})();
		;(function () {
			function t(k, v) {
				if (2 === arguments.length) {
					t.r = t.r || {};
					t.r[k] = v;
					return;
				}t.r = t.r || [];
				t.r.push(k);
			};
			var keys = Object.keys;
			Type.obj.map = function (l, c, _) {
				var u,
				    i = 0,
				    x,
				    r,
				    ll,
				    lle,
				    f = fn_is(c);
				t.r = null;
				if (keys && obj_is(l)) {
					ll = Object.keys(l);lle = true;
				}
				if (list_is(l) || ll) {
					x = (ll || l).length;
					for (; i < x; i++) {
						var ii = i + Type.list.index;
						if (f) {
							r = lle ? c.call(_ || this, l[ll[i]], ll[i], t) : c.call(_ || this, l[i], ii, t);
							if (r !== u) {
								return r;
							}
						} else {
							//if(Type.test.is(c,l[i])){ return ii } // should implement deep equality testing!
							if (c === l[lle ? ll[i] : i]) {
								return ll ? ll[i] : ii;
							} // use this for now
						}
					}
				} else {
					for (i in l) {
						if (f) {
							if (obj_has(l, i)) {
								r = _ ? c.call(_, l[i], i, t) : c(l[i], i, t);
								if (r !== u) {
									return r;
								}
							}
						} else {
							//if(a.test.is(c,l[i])){ return i } // should implement deep equality testing!
							if (c === l[i]) {
								return i;
							} // use this for now
						}
					}
				}
				return f ? t.r : Type.list.index ? 0 : -1;
			};
		})();
		Type.time = {};
		Type.time.is = function (t) {
			return t ? t instanceof Date : +new Date().getTime();
		};

		var fn_is = Type.fn.is;
		var list_is = Type.list.is;
		var obj = Type.obj,
		    obj_is = obj.is,
		    obj_has = obj.has,
		    obj_map = obj.map;
		module.exports = Type;
	})(require, './type');

	;require(function (module) {
		// On event emitter generic javascript utility.
		module.exports = function onto(tag, arg, as) {
			if (!tag) {
				return { to: onto };
			}
			var tag = (this.tag || (this.tag = {}))[tag] || (this.tag[tag] = { tag: tag, to: onto._ = {
					next: function next() {}
				} });
			if (arg instanceof Function) {
				var be = {
					off: onto.off || (onto.off = function () {
						if (this.next === onto._.next) {
							return !0;
						}
						if (this === this.the.last) {
							this.the.last = this.back;
						}
						this.to.back = this.back;
						this.next = onto._.next;
						this.back.to = this.to;
					}),
					to: onto._,
					next: arg,
					the: tag,
					on: this,
					as: as
				};
				(be.back = tag.last || tag).to = be;
				return tag.last = be;
			}
			(tag = tag.to).next(arg);
			return tag;
		};
	})(require, './onto');

	;require(function (module) {
		// TODO: Needs to be redone.
		var On = require('./onto');

		function Chain(create, opt) {
			opt = opt || {};
			opt.id = opt.id || '#';
			opt.rid = opt.rid || '@';
			opt.uuid = opt.uuid || function () {
				return +new Date() + Math.random();
			};
			var on = On; //On.scope();

			on.stun = function (chain) {
				var stun = function stun(ev) {
					if (stun.off && stun === this.stun) {
						this.stun = null;
						return false;
					}
					if (on.stun.skip) {
						return false;
					}
					if (ev) {
						ev.cb = ev.fn;
						ev.off();
						res.queue.push(ev);
					}
					return true;
				},
				    res = stun.res = function (tmp, as) {
					if (stun.off) {
						return;
					}
					if (tmp instanceof Function) {
						on.stun.skip = true;
						tmp.call(as);
						on.stun.skip = false;
						return;
					}
					stun.off = true;
					var i = 0,
					    q = res.queue,
					    l = q.length,
					    act;
					res.queue = [];
					if (stun === at.stun) {
						at.stun = null;
					}
					for (i; i < l; i++) {
						act = q[i];
						act.fn = act.cb;
						act.cb = null;
						on.stun.skip = true;
						act.ctx.on(act.tag, act.fn, act);
						on.stun.skip = false;
					}
				},
				    at = chain._;
				res.back = at.stun || (at.back || { _: {} })._.stun;
				if (res.back) {
					res.back.next = stun;
				}
				res.queue = [];
				at.stun = stun;
				return res;
			};
			return on;
			return;
			return;
			return;
			return;
			var ask = on.ask = function (cb, as) {
				if (!ask.on) {
					ask.on = On.scope();
				}
				var id = opt.uuid();
				if (cb) {
					ask.on(id, cb, as);
				}
				return id;
			};
			ask._ = opt.id;
			on.ack = function (at, reply) {
				if (!at || !reply || !ask.on) {
					return;
				}
				var id = at[opt.id] || at;
				if (!ask.ons[id]) {
					return;
				}
				ask.on(id, reply);
				return true;
			};
			on.ack._ = opt.rid;

			return on;
			return;
			return;
			return;
			return;
			on.on('event', function event(act) {
				var last = act.on.last,
				    tmp;
				if ('in' === act.tag && Gun.chain.chain.input !== act.fn) {
					// TODO: BUG! Gun is not available in this module.
					if ((tmp = act.ctx) && tmp.stun) {
						if (tmp.stun(act)) {
							return;
						}
					}
				}
				if (!last) {
					return;
				}
				if (act.on.map) {
					var map = act.on.map,
					    v;
					for (var f in map) {
						v = map[f];
						if (v) {
							emit(v, act, event);
						}
					}
					/*
     Gun.obj.map(act.on.map, function(v,f){ // TODO: BUG! Gun is not available in this module.
     	//emit(v[0], act, event, v[1]); // below enables more control
     	//console.log("boooooooo", f,v);
     	emit(v, act, event);
     	//emit(v[1], act, event, v[2]);
     });
     */
				} else {
					emit(last, act, event);
				}
				if (last !== act.on.last) {
					event(act);
				}
			});
			function emit(last, act, event, ev) {
				if (last instanceof Array) {
					act.fn.apply(act.as, last.concat(ev || act));
				} else {
					act.fn.call(act.as, last, ev || act);
				}
			}

			/*on.on('emit', function(ev){
   	if(ev.on.map){
   		var id = ev.arg.via.gun._.id + ev.arg.get;
   		//
   		//ev.id = ev.id || Gun.text.random(6);
   		//ev.on.map[ev.id] = ev.arg;
   		//ev.proxy = ev.arg[1];
   		//ev.arg = ev.arg[0];
   		// below gives more control.
   		ev.on.map[id] = ev.arg;
   		//ev.proxy = ev.arg[2];
   	}
   	ev.on.last = ev.arg;
   });*/

			on.on('emit', function (ev) {
				var gun = ev.arg.gun;
				if ('in' === ev.tag && gun && !gun._.soul) {
					// TODO: BUG! Soul should be available. Currently not using it though, but should enable it (check for side effects if made available).
					(ev.on.map = ev.on.map || {})[gun._.id || (gun._.id = Math.random())] = ev.arg;
				}
				ev.on.last = ev.arg;
			});
			return on;
		}
		module.exports = Chain;
	})(require, './onify');

	;require(function (module) {
		// Generic javascript scheduler utility.
		var Type = require('./type');
		function s(state, cb, time) {
			// maybe use lru-cache?
			s.time = time;
			s.waiting.push({ when: state, event: cb || function () {} });
			if (s.soonest < state) {
				return;
			}
			s.set(state);
		}
		s.waiting = [];
		s.soonest = Infinity;
		s.sort = Type.list.sort('when');
		s.set = function (future) {
			if (Infinity <= (s.soonest = future)) {
				return;
			}
			var now = s.time();
			future = future <= now ? 0 : future - now;
			clearTimeout(s.id);
			s.id = setTimeout(s.check, future);
		};
		s.each = function (wait, i, map) {
			var ctx = this;
			if (!wait) {
				return;
			}
			if (wait.when <= ctx.now) {
				if (wait.event instanceof Function) {
					setTimeout(function () {
						wait.event();
					}, 0);
				}
			} else {
				ctx.soonest = ctx.soonest < wait.when ? ctx.soonest : wait.when;
				map(wait);
			}
		};
		s.check = function () {
			var ctx = { now: s.time(), soonest: Infinity };
			s.waiting.sort(s.sort);
			s.waiting = Type.list.map(s.waiting, s.each, ctx) || [];
			s.set(ctx.soonest);
		};
		module.exports = s;
	})(require, './schedule');

	;require(function (module) {
		/* Based on the Hypothetical Amnesia Machine thought experiment */
		function HAM(machineState, incomingState, currentState, incomingValue, currentValue) {
			if (machineState < incomingState) {
				return { defer: true }; // the incoming value is outside the boundary of the machine's state, it must be reprocessed in another state.
			}
			if (incomingState < currentState) {
				return { historical: true }; // the incoming value is within the boundary of the machine's state, but not within the range.
			}
			if (currentState < incomingState) {
				return { converge: true, incoming: true }; // the incoming value is within both the boundary and the range of the machine's state.
			}
			if (incomingState === currentState) {
				incomingValue = Lexical(incomingValue) || "";
				currentValue = Lexical(currentValue) || "";
				if (incomingValue === currentValue) {
					// Note: while these are practically the same, the deltas could be technically different
					return { state: true };
				}
				/*
    	The following is a naive implementation, but will always work.
    	Never change it unless you have specific needs that absolutely require it.
    	If changed, your data will diverge unless you guarantee every peer's algorithm has also been changed to be the same.
    	As a result, it is highly discouraged to modify despite the fact that it is naive,
    	because convergence (data integrity) is generally more important.
    	Any difference in this algorithm must be given a new and different name.
    */
				if (incomingValue < currentValue) {
					// Lexical only works on simple value types!
					return { converge: true, current: true };
				}
				if (currentValue < incomingValue) {
					// Lexical only works on simple value types!
					return { converge: true, incoming: true };
				}
			}
			return { err: "Invalid CRDT Data: " + incomingValue + " to " + currentValue + " at " + incomingState + " to " + currentState + "!" };
		}
		if (typeof JSON === 'undefined') {
			throw new Error('JSON is not included in this browser. Please load it first: ' + 'ajax.cdnjs.com/ajax/libs/json2/20110223/json2.js');
		}
		var Lexical = JSON.stringify,
		    undefined;
		module.exports = HAM;
	})(require, './HAM');

	;require(function (module) {
		var Type = require('./type');
		var Val = {};
		Val.is = function (v) {
			// Valid values are a subset of JSON: null, binary, number (!Infinity), text, or a soul relation. Arrays need special algorithms to handle concurrency, so they are not supported directly. Use an extension that supports them if needed but research their problems first.
			if (v === u) {
				return false;
			}
			if (v === null) {
				return true;
			} // "deletes", nulling out fields.
			if (v === Infinity) {
				return false;
			} // we want this to be, but JSON does not support it, sad face.
			if (text_is(v // by "text" we mean strings.
			) || bi_is(v // by "binary" we mean boolean.
			) || num_is(v)) {
				// by "number" we mean integers or decimals. 
				return true; // simple values are valid.
			}
			return Val.rel.is(v) || false; // is the value a soul relation? Then it is valid and return it. If not, everything else remaining is an invalid data type. Custom extensions can be built on top of these primitives to support other types.
		};
		Val.rel = { _: '#' };
		;(function () {
			Val.rel.is = function (v) {
				// this defines whether an object is a soul relation or not, they look like this: {'#': 'UUID'}
				if (v && v[rel_] && !v._ && obj_is(v)) {
					// must be an object.
					var o = {};
					obj_map(v, map, o);
					if (o.id) {
						// a valid id was found.
						return o.id; // yay! Return it.
					}
				}
				return false; // the value was not a valid soul relation.
			};
			function map(s, f) {
				var o = this; // map over the object...
				if (o.id) {
					return o.id = false;
				} // if ID is already defined AND we're still looping through the object, it is considered invalid.
				if (f == rel_ && text_is(s)) {
					// the field should be '#' and have a text value.
					o.id = s; // we found the soul!
				} else {
					return o.id = false; // if there exists anything else on the object that isn't the soul, then it is considered invalid.
				}
			}
		})();
		Val.rel.ify = function (t) {
			return obj_put({}, rel_, t);
		}; // convert a soul into a relation and return it.
		var rel_ = Val.rel._,
		    u;
		var bi_is = Type.bi.is;
		var num_is = Type.num.is;
		var text_is = Type.text.is;
		var obj = Type.obj,
		    obj_is = obj.is,
		    obj_put = obj.put,
		    obj_map = obj.map;
		module.exports = Val;
	})(require, './val');

	;require(function (module) {
		var Type = require('./type');
		var Val = require('./val');
		var Node = { _: '_' };
		Node.soul = function (n, o) {
			return n && n._ && n._[o || soul_];
		}; // convenience function to check to see if there is a soul on a node and return it.
		Node.soul.ify = function (n, o) {
			// put a soul on an object.
			o = typeof o === 'string' ? { soul: o } : o || {};
			n = n || {}; // make sure it exists.
			n._ = n._ || {}; // make sure meta exists.
			n._[soul_] = o.soul || n._[soul_] || text_random(); // put the soul on it.
			return n;
		};
		Node.soul._ = Val.rel._;
		;(function () {
			Node.is = function (n, cb, as) {
				var s; // checks to see if an object is a valid node.
				if (!obj_is(n)) {
					return false;
				} // must be an object.
				if (s = Node.soul(n)) {
					// must have a soul on it.
					return !obj_map(n, map, { as: as, cb: cb, s: s, n: n });
				}
				return false; // nope! This was not a valid node.
			};
			function map(v, f) {
				// we invert this because the way we check for this is via a negation.
				if (f === Node._) {
					return;
				} // skip over the metadata.
				if (!Val.is(v)) {
					return true;
				} // it is true that this is an invalid node.
				if (this.cb) {
					this.cb.call(this.as, v, f, this.n, this.s);
				} // optionally callback each field/value.
			}
		})();
		;(function () {
			Node.ify = function (obj, o, as) {
				// returns a node from a shallow object.
				if (!o) {
					o = {};
				} else if (typeof o === 'string') {
					o = { soul: o };
				} else if (o instanceof Function) {
					o = { map: o };
				}
				if (o.map) {
					o.node = o.map.call(as, obj, u, o.node || {});
				}
				if (o.node = Node.soul.ify(o.node || {}, o)) {
					obj_map(obj, map, { o: o, as: as });
				}
				return o.node; // This will only be a valid node if the object wasn't already deep!
			};
			function map(v, f) {
				var o = this.o,
				    tmp,
				    u; // iterate over each field/value.
				if (o.map) {
					tmp = o.map.call(this.as, v, '' + f, o.node);
					if (u === tmp) {
						obj_del(o.node, f);
					} else if (o.node) {
						o.node[f] = tmp;
					}
					return;
				}
				if (Val.is(v)) {
					o.node[f] = v;
				}
			}
		})();
		var obj = Type.obj,
		    obj_is = obj.is,
		    obj_del = obj.del,
		    obj_map = obj.map;
		var text = Type.text,
		    text_random = text.random;
		var soul_ = Node.soul._;
		var u;
		module.exports = Node;
	})(require, './node');

	;require(function (module) {
		var Type = require('./type');
		var Node = require('./node');
		function State() {
			var t;
			if (perf) {
				t = start + perf.now();
			} else {
				t = time();
			}
			if (last < t) {
				return N = 0, last = t + State.drift;
			}
			return last = t + (N += 1) / D + State.drift;
		}
		var time = Type.time.is,
		    last = -Infinity,
		    N = 0,
		    D = 1000; // WARNING! In the future, on machines that are D times faster than 2016AD machines, you will want to increase D by another several orders of magnitude so the processing speed never out paces the decimal resolution (increasing an integer effects the state accuracy).
		var perf = typeof performance !== 'undefined' ? performance.timing && performance : false,
		    start = perf && perf.timing && perf.timing.navigationStart || (perf = false);
		State._ = '>';
		State.drift = 0;
		State.is = function (n, f, o) {
			// convenience function to get the state on a field on a node and return it.
			var tmp = f && n && n[N_] && n[N_][State._] || o;
			if (!tmp) {
				return;
			}
			return num_is(tmp = tmp[f]) ? tmp : -Infinity;
		};
		State.ify = function (n, f, s, v, soul) {
			// put a field's state on a node.
			if (!n || !n[N_]) {
				// reject if it is not node-like.
				if (!soul) {
					// unless they passed a soul
					return;
				}
				n = Node.soul.ify(n, soul); // then make it so!
			}
			var tmp = obj_as(n[N_], State._); // grab the states data.
			if (u !== f && f !== N_) {
				if (num_is(s)) {
					tmp[f] = s; // add the valid state.
				}
				if (u !== v) {
					// Note: Not its job to check for valid values!
					n[f] = v;
				}
			}
			return n;
		};
		State.to = function (from, f, to) {
			var val = from[f];
			if (obj_is(val)) {
				val = obj_copy(val);
			}
			return State.ify(to, f, State.is(from, f), val, Node.soul(from));
		};(function () {
			State.map = function (cb, s, as) {
				var u; // for use with Node.ify
				var o = obj_is(o = cb || s) ? o : null;
				cb = fn_is(cb = cb || s) ? cb : null;
				if (o && !cb) {
					s = num_is(s) ? s : State();
					o[N_] = o[N_] || {};
					obj_map(o, map, { o: o, s: s });
					return o;
				}
				as = as || obj_is(s) ? s : u;
				s = num_is(s) ? s : State();
				return function (v, f, o, opt) {
					if (!cb) {
						map.call({ o: o, s: s }, v, f);
						return v;
					}
					cb.call(as || this || {}, v, f, o, opt);
					if (obj_has(o, f) && u === o[f]) {
						return;
					}
					map.call({ o: o, s: s }, v, f);
				};
			};
			function map(v, f) {
				if (N_ === f) {
					return;
				}
				State.ify(this.o, f, this.s);
			}
		})();
		var obj = Type.obj,
		    obj_as = obj.as,
		    obj_has = obj.has,
		    obj_is = obj.is,
		    obj_map = obj.map,
		    obj_copy = obj.copy;
		var num = Type.num,
		    num_is = num.is;
		var fn = Type.fn,
		    fn_is = fn.is;
		var N_ = Node._,
		    u;
		module.exports = State;
	})(require, './state');

	;require(function (module) {
		var Type = require('./type');
		var Val = require('./val');
		var Node = require('./node');
		var Graph = {};
		;(function () {
			Graph.is = function (g, cb, fn, as) {
				// checks to see if an object is a valid graph.
				if (!g || !obj_is(g) || obj_empty(g)) {
					return false;
				} // must be an object.
				return !obj_map(g, map, { cb: cb, fn: fn, as: as }); // makes sure it wasn't an empty object.
			};
			function map(n, s) {
				// we invert this because the way'? we check for this is via a negation.
				if (!n || s !== Node.soul(n) || !Node.is(n, this.fn, this.as)) {
					return true;
				} // it is true that this is an invalid graph.
				if (!this.cb) {
					return;
				}
				nf.n = n;nf.as = this.as; // sequential race conditions aren't races.
				this.cb.call(nf.as, n, s, nf);
			}
			function nf(fn) {
				// optional callback for each node.
				if (fn) {
					Node.is(nf.n, fn, nf.as);
				} // where we then have an optional callback for each field/value.
			}
		})();
		;(function () {
			Graph.ify = function (obj, env, as) {
				var at = { path: [], obj: obj };
				if (!env) {
					env = {};
				} else if (typeof env === 'string') {
					env = { soul: env };
				} else if (env instanceof Function) {
					env.map = env;
				}
				if (env.soul) {
					at.rel = Val.rel.ify(env.soul);
				}
				env.graph = env.graph || {};
				env.seen = env.seen || [];
				env.as = env.as || as;
				node(env, at);
				env.root = at.node;
				return env.graph;
			};
			function node(env, at) {
				var tmp;
				if (tmp = seen(env, at)) {
					return tmp;
				}
				at.env = env;
				at.soul = soul;
				if (Node.ify(at.obj, map, at)) {
					//at.rel = at.rel || Val.rel.ify(Node.soul(at.node));
					env.graph[Val.rel.is(at.rel)] = at.node;
				}
				return at;
			}
			function map(v, f, n) {
				var at = this,
				    env = at.env,
				    is,
				    tmp;
				if (Node._ === f && obj_has(v, Val.rel._)) {
					return n._; // TODO: Bug?
				}
				if (!(is = valid(v, f, n, at, env))) {
					return;
				}
				if (!f) {
					at.node = at.node || n || {};
					if (obj_has(v, Node._)) {
						at.node._ = obj_copy(v._);
					}
					at.node = Node.soul.ify(at.node, Val.rel.is(at.rel));
					at.rel = at.rel || Val.rel.ify(Node.soul(at.node));
				}
				if (tmp = env.map) {
					tmp.call(env.as || {}, v, f, n, at);
					if (obj_has(n, f)) {
						v = n[f];
						if (u === v) {
							obj_del(n, f);
							return;
						}
						if (!(is = valid(v, f, n, at, env))) {
							return;
						}
					}
				}
				if (!f) {
					return at.node;
				}
				if (true === is) {
					return v;
				}
				tmp = node(env, { obj: v, path: at.path.concat(f) });
				if (!tmp.node) {
					return;
				}
				return tmp.rel; //{'#': Node.soul(tmp.node)};
			}
			function soul(id) {
				var at = this;
				var prev = Val.rel.is(at.rel),
				    graph = at.env.graph;
				at.rel = at.rel || Val.rel.ify(id);
				at.rel[Val.rel._] = id;
				if (at.node && at.node[Node._]) {
					at.node[Node._][Val.rel._] = id;
				}
				if (obj_has(graph, prev)) {
					graph[id] = graph[prev];
					obj_del(graph, prev);
				}
			}
			function valid(v, f, n, at, env) {
				var tmp;
				if (Val.is(v)) {
					return true;
				}
				if (obj_is(v)) {
					return 1;
				}
				if (tmp = env.invalid) {
					v = tmp.call(env.as || {}, v, f, n);
					return valid(v, f, n, at, env);
				}
				env.err = "Invalid value at '" + at.path.concat(f).join('.') + "'!";
			}
			function seen(env, at) {
				var arr = env.seen,
				    i = arr.length,
				    has;
				while (i--) {
					has = arr[i];
					if (at.obj === has.obj) {
						return has;
					}
				}
				arr.push(at);
			}
		})();
		Graph.node = function (node) {
			var soul = Node.soul(node);
			if (!soul) {
				return;
			}
			return obj_put({}, soul, node);
		};(function () {
			Graph.to = function (graph, root, opt) {
				if (!graph) {
					return;
				}
				var obj = {};
				opt = opt || { seen: {} };
				obj_map(graph[root], map, { obj: obj, graph: graph, opt: opt });
				return obj;
			};
			function map(v, f) {
				var tmp, obj;
				if (Node._ === f) {
					if (obj_empty(v, Val.rel._)) {
						return;
					}
					this.obj[f] = obj_copy(v);
					return;
				}
				if (!(tmp = Val.rel.is(v))) {
					this.obj[f] = v;
					return;
				}
				if (obj = this.opt.seen[tmp]) {
					this.obj[f] = obj;
					return;
				}
				this.obj[f] = this.opt.seen[tmp] = Graph.to(this.graph, tmp, this.opt);
			}
		})();
		var fn_is = Type.fn.is;
		var obj = Type.obj,
		    obj_is = obj.is,
		    obj_del = obj.del,
		    obj_has = obj.has,
		    obj_empty = obj.empty,
		    obj_put = obj.put,
		    obj_map = obj.map,
		    obj_copy = obj.copy;
		var u;
		module.exports = Graph;
	})(require, './graph');

	;require(function (module) {
		var Type = require('./type');
		function Dup() {
			this.cache = {};
		}
		Dup.prototype.track = function (id) {
			this.cache[id] = Type.time.is();
			if (!this.to) {
				this.gc(); // Engage GC.
			}
			return id;
		};
		Dup.prototype.check = function (id) {
			// Have we seen this ID recently?
			return Type.obj.has(this.cache, id) ? this.track(id) : false; // Important, bump the ID's liveliness if it has already been seen before - this is critical to stopping broadcast storms.
		};
		Dup.prototype.gc = function () {
			var de = this,
			    now = Type.time.is(),
			    oldest = now,
			    maxAge = 5 * 60 * 1000;
			// TODO: Gun.scheduler already does this? Reuse that.
			Type.obj.map(de.cache, function (time, id) {
				oldest = Math.min(now, time);
				if (now - time < maxAge) {
					return;
				}
				Type.obj.del(de.cache, id);
			});
			var done = Type.obj.empty(de.cache);
			if (done) {
				de.to = null; // Disengage GC.
				return;
			}
			var elapsed = now - oldest; // Just how old?
			var nextGC = maxAge - elapsed; // How long before it's too old?
			de.to = setTimeout(function () {
				de.gc();
			}, nextGC); // Schedule the next GC event.
		};
		module.exports = Dup;
	})(require, './dup');

	;require(function (module) {

		function Gun(o) {
			if (o instanceof Gun) {
				return (this._ = { gun: this }).gun;
			}
			if (!(this instanceof Gun)) {
				return new Gun(o);
			}
			return Gun.create(this._ = { gun: this, opt: o });
		}

		Gun.is = function (gun) {
			return gun instanceof Gun;
		};

		Gun.version = 0.7;

		Gun.chain = Gun.prototype;
		Gun.chain.toJSON = function () {};

		var Type = require('./type');
		Type.obj.to(Type, Gun);
		Gun.HAM = require('./HAM');
		Gun.val = require('./val');
		Gun.node = require('./node');
		Gun.state = require('./state');
		Gun.graph = require('./graph');
		Gun.dup = require('./dup');
		Gun.schedule = require('./schedule');
		Gun.on = require('./onify')();

		Gun._ = { // some reserved key words, these are not the only ones.
			node: Gun.node._ // all metadata of a node is stored in the meta property on the node.
			, soul: Gun.val.rel._ // a soul is a UUID of a node but it always points to the "latest" data known.
			, state: Gun.state._ // other than the soul, we store HAM metadata.
			, field: '.' // a field is a property on a node which points to a value.
			, value: '=' // the primitive value.
		};(function () {
			Gun.create = function (at) {
				at.on = at.on || Gun.on;
				at.root = at.root || at.gun;
				at.graph = at.graph || {};
				at.dup = at.dup || new Gun.dup();
				at.ask = Gun.on.ask;
				at.ack = Gun.on.ack;
				var gun = at.gun.opt(at.opt);
				if (!at.once) {
					at.on('in', root, at);
					at.on('out', root, at);
				}
				at.once = 1;
				return gun;
			};
			function root(at) {
				//console.log("add to.next(at)"); // TODO: BUG!!!
				var ev = this,
				    cat = ev.as,
				    coat;
				if (!at.gun) {
					at.gun = cat.gun;
				}
				if (!at['#']) {
					at['#'] = Gun.text.random();
				} // TODO: Use what is used other places instead.
				if (cat.dup.check(at['#'])) {
					return;
				}
				if (at['@']) {
					// TODO: BUG! For multi-instances, the "ack" system is globally shared, but it shouldn't be.
					if (cat.ack(at['@'], at)) {
						return;
					} // TODO: Consider not returning here, maybe, where this would let the "handshake" on sync occur for Holy Grail?
					cat.dup.track(at['#']);
					Gun.on('out', obj_to(at, { gun: cat.gun }));
					return;
				}
				cat.dup.track(at['#']);
				//if(cat.ack(at['@'], at)){ return }
				//cat.ack(at['@'], at);
				coat = obj_to(at, { gun: cat.gun });
				if (at.get) {
					//Gun.on.GET(coat);
					Gun.on('get', coat);
				}
				if (at.put) {
					//Gun.on.PUT(coat);
					Gun.on('put', coat);
				}
				Gun.on('out', coat);
			}
		})();

		;(function () {
			Gun.on('put', function (at) {
				//Gun.on.PUT = function(at){
				if (!at['#']) {
					return this.to.next(at);
				} // for tests.
				var ev = this,
				    ctx = { gun: at.gun, graph: at.gun._.graph, put: {}, map: {}, machine: Gun.state() };
				if (!Gun.graph.is(at.put, null, verify, ctx)) {
					ctx.err = "Error: Invalid graph!";
				}
				if (ctx.err) {
					return ctx.gun.on('in', { '@': at['#'], err: Gun.log(ctx.err) });
				}
				obj_map(ctx.put, merge, ctx);
				obj_map(ctx.map, map, ctx);
				if (u !== ctx.defer) {
					Gun.schedule(ctx.defer, function () {
						Gun.on('put', at);
					}, Gun.state);
				}
				if (!ctx.diff) {
					return;
				}
				ev.to.next(obj_to(at, { put: ctx.diff }));
			});
			function verify(val, key, node, soul) {
				var ctx = this;
				var state = Gun.state.is(node, key),
				    tmp;
				if (!state) {
					return ctx.err = "Error: No state on '" + key + "' in node '" + soul + "'!";
				}
				var vertex = ctx.graph[soul] || empty,
				    was = Gun.state.is(vertex, key, true),
				    known = vertex[key];
				var HAM = Gun.HAM(ctx.machine, state, was, val, known);
				if (!HAM.incoming) {
					if (HAM.defer) {
						// pick the lowest
						ctx.defer = state < (ctx.defer || Infinity) ? state : ctx.defer;
					}
				}
				ctx.put[soul] = Gun.state.to(node, key, ctx.put[soul]);
				(ctx.diff || (ctx.diff = {}))[soul] = Gun.state.to(node, key, ctx.diff[soul]);
			}
			function merge(node, soul) {
				var ref = (this.gun._.next || empty)[soul];
				if (!ref) {
					return;
				}
				var at = this.map[soul] = {
					put: this.node = node,
					get: this.soul = soul,
					gun: this.ref = ref
				};
				obj_map(node, each, this);
				Gun.on('node', at);
			}
			function each(val, key) {
				var graph = this.graph,
				    soul = this.soul,
				    cat = this.ref._,
				    tmp;
				graph[soul] = Gun.state.to(this.node, key, graph[soul]);
				(cat.put || (cat.put = {}))[key] = val;
			}
			function map(at, soul) {
				if (!at.gun) {
					return;
				}
				at.gun._.on('in', at);
			}
		})();

		;(function () {
			Gun.on('get', function (at) {
				var ev = this,
				    soul = at.get[_soul],
				    cat = at.gun._,
				    node = cat.graph[soul],
				    field = at.get[_field],
				    tmp;
				var next = cat.next || (cat.next = {}),
				    as = (next[soul] || empty)._;
				if (!node || !as) {
					return ev.to.next(at);
				}
				if (field) {
					if (!obj_has(node, field)) {
						return ev.to.next(at);
					}
					node = Gun.state.to(node, field);
				} else {
					node = Gun.obj.copy(node);
				}
				//if(at.gun === cat.gun){
				node = Gun.graph.node(node); // TODO: BUG! Clone node?
				//} else {
				//	cat = (at.gun._);
				//}
				tmp = as.ack;
				cat.on('in', {
					'@': at['#'],
					how: 'mem',
					put: node,
					gun: as.gun
				});
				if (0 < tmp) {
					return;
				}
				ev.to.next(at);
			});
		})();

		;(function () {
			Gun.on.ask = function (cb, as) {
				if (!this.on) {
					return;
				}
				var id = Gun.text.random();
				if (cb) {
					this.on(id, cb, as);
				}
				return id;
			};
			Gun.on.ack = function (at, reply) {
				if (!at || !reply || !this.on) {
					return;
				}
				var id = at['#'] || at;
				if (!this.tag || !this.tag[id]) {
					return;
				}
				this.on(id, reply);
				return true;
			};
		})();

		;(function () {
			Gun.chain.opt = function (opt) {
				opt = opt || {};
				var gun = this,
				    at = gun._,
				    tmp = opt.peers || opt;
				if (!obj_is(opt)) {
					opt = {};
				}
				if (!obj_is(at.opt)) {
					at.opt = opt;
				}
				if (text_is(tmp)) {
					tmp = [tmp];
				}
				if (list_is(tmp)) {
					tmp = obj_map(tmp, function (url, i, map) {
						map(url, { url: url });
					});
					if (!obj_is(at.opt.peers)) {
						at.opt.peers = {};
					}
					at.opt.peers = obj_to(tmp, at.opt.peers);
				}
				at.opt.wsc = at.opt.wsc || { protocols: [] };
				at.opt.peers = at.opt.peers || {};
				obj_to(opt, at.opt); // copies options on to `at.opt` only if not already taken.
				Gun.on('opt', at);
				return gun;
			};
		})();

		var text_is = Gun.text.is;
		var list_is = Gun.list.is;
		var obj = Gun.obj,
		    obj_is = obj.is,
		    obj_has = obj.has,
		    obj_to = obj.to,
		    obj_map = obj.map,
		    obj_copy = obj.copy;
		var _soul = Gun._.soul,
		    _field = Gun._.field,
		    rel_is = Gun.val.rel.is;
		var empty = {},
		    u;

		console.debug = function (i, s) {
			return console.debug.i && i === console.debug.i && console.debug.i++ && (console.log.apply(console, arguments) || s);
		};

		Gun.log = function () {
			return !Gun.log.off && console.log.apply(console, arguments), [].slice.call(arguments).join(' ');
		};
		Gun.log.once = function (w, s, o) {
			return (o = Gun.log.once)[w] = o[w] || 0, o[w]++ || Gun.log(s);
		};"Please do not remove these messages unless you are paying for a monthly sponsorship, thanks!";
		Gun.log.once("welcome", "Hello wonderful person! :) Thanks for using GUN, feel free to ask for help on https://gitter.im/amark/gun and ask StackOverflow questions tagged with 'gun'!");
		;"Please do not remove these messages unless you are paying for a monthly sponsorship, thanks!";

		if (typeof window !== "undefined") {
			window.Gun = Gun;
		}
		if (typeof common !== "undefined") {
			common.exports = Gun;
		}
		module.exports = Gun;
	})(require, './root');

	;require(function (module) {
		var Gun = require('./root');
		Gun.chain.back = function (n, opt) {
			var tmp;
			if (-1 === n || Infinity === n) {
				return this._.root;
			} else if (1 === n) {
				return this._.back || this;
			}
			var gun = this,
			    at = gun._;
			if (typeof n === 'string') {
				n = n.split('.');
			}
			if (n instanceof Array) {
				var i = 0,
				    l = n.length,
				    tmp = at;
				for (i; i < l; i++) {
					tmp = (tmp || empty)[n[i]];
				}
				if (u !== tmp) {
					return opt ? gun : tmp;
				} else if (tmp = at.back) {
					return tmp.back(n, opt);
				}
				return;
			}
			if (n instanceof Function) {
				var yes,
				    tmp = { back: gun };
				while ((tmp = tmp.back) && (tmp = tmp._) && !(yes = n(tmp, opt))) {}
				return yes;
			}
		};
		var empty = {},
		    u;
	})(require, './back');

	;require(function (module) {
		var Gun = require('./root');
		Gun.chain.chain = function () {
			var at = this._,
			    chain = new this.constructor(this),
			    cat = chain._;
			cat.root = root = at.root;
			cat.id = ++root._.once;
			cat.back = this;
			cat.on = Gun.on;
			Gun.on('chain', cat);
			cat.on('in', input, cat); // For 'in' if I add my own listeners to each then I MUST do it before in gets called. If I listen globally for all incoming data instead though, regardless of individual listeners, I can transform the data there and then as well.
			cat.on('out', output, cat); // However for output, there isn't really the global option. I must listen by adding my own listener individually BEFORE this one is ever called.
			return chain;
		};
		function output(at) {
			var cat = this.as,
			    gun = cat.gun,
			    root = gun.back(-1),
			    put,
			    get,
			    now,
			    tmp;
			if (!at.gun) {
				at.gun = gun;
			}
			if (get = at.get) {
				if (tmp = get[_soul]) {
					tmp = root.get(tmp)._;
					if (obj_has(get, _field)) {
						if (obj_has(put = tmp.put, get = get[_field])) {
							tmp.on('in', { get: tmp.get, put: Gun.state.to(put, get), gun: tmp.gun }); // TODO: Ugly, clean up? Simplify all these if conditions (without ruining the whole chaining API)?
						}
					} else if (obj_has(tmp, 'put')) {
						//if(u !== tmp.put){
						tmp.on('in', tmp);
					}
				} else {
					if (obj_has(get, _field)) {
						get = get[_field];
						var next = get ? gun.get(get)._ : cat;
						// TODO: BUG! Handle plural chains by iterating over them.
						//if(obj_has(next, 'put')){ // potentially incorrect? Maybe?
						if (u !== next.put) {
							// potentially incorrect? Maybe?
							//next.tag['in'].last.next(next);
							next.on('in', next);
							return;
						}
						if (obj_has(cat, 'put')) {
							//if(u !== cat.put){
							var val = cat.put,
							    rel;
							if (rel = Gun.node.soul(val)) {
								val = Gun.val.rel.ify(rel);
							}
							if (rel = Gun.val.rel.is(val)) {
								if (!at.gun._) {
									return;
								}
								at.gun._.on('out', {
									get: tmp = { '#': rel, '.': get, gun: at.gun },
									'#': root._.ask(Gun.HAM.synth, tmp),
									gun: at.gun
								});
								return;
							}
							if (u === val || Gun.val.is(val)) {
								if (!at.gun._) {
									return;
								}
								at.gun._.on('in', {
									get: get,
									gun: at.gun
								});
								return;
							}
						} else if (cat.map) {
							obj_map(cat.map, function (proxy) {
								proxy.at.on('in', proxy.at);
							});
						};
						if (cat.soul) {
							if (!at.gun._) {
								return;
							}
							at.gun._.on('out', {
								get: tmp = { '#': cat.soul, '.': get, gun: at.gun },
								'#': root._.ask(Gun.HAM.synth, tmp),
								gun: at.gun
							});
							return;
						}
						if (cat.get) {
							if (!cat.back._) {
								return;
							}
							cat.back._.on('out', {
								get: obj_put({}, _field, cat.get),
								gun: gun
							});
							return;
						}
						at = obj_to(at, { get: {} });
					} else {
						if (obj_has(cat, 'put')) {
							//if(u !== cat.put){
							cat.on('in', cat);
						} else if (cat.map) {
							obj_map(cat.map, function (proxy) {
								proxy.at.on('in', proxy.at);
							});
						}
						if (cat.ack) {
							if (!obj_has(cat, 'put')) {
								// u !== cat.put instead?
								//if(u !== cat.put){
								return;
							}
						}
						cat.ack = -1;
						if (cat.soul) {
							cat.on('out', {
								get: tmp = { '#': cat.soul, gun: cat.gun },
								'#': root._.ask(Gun.HAM.synth, tmp),
								gun: cat.gun
							});
							return;
						}
						if (cat.get) {
							if (!cat.back._) {
								return;
							}
							cat.back._.on('out', {
								get: obj_put({}, _field, cat.get),
								gun: cat.gun
							});
							return;
						}
					}
				}
			}
			cat.back._.on('out', at);
		}
		function input(at) {
			at = at._ || at;
			var ev = this,
			    cat = this.as,
			    gun = at.gun,
			    coat = gun._,
			    change = at.put,
			    back = cat.back._ || empty,
			    rel,
			    tmp;
			if (0 > cat.ack && !at.ack && !Gun.val.rel.is(change)) {
				// for better behavior?
				cat.ack = 1;
			}
			if (cat.get && at.get !== cat.get) {
				at = obj_to(at, { get: cat.get });
			}
			if (cat.field && coat !== cat) {
				at = obj_to(at, { gun: cat.gun });
				if (coat.ack) {
					cat.ack = cat.ack || coat.ack;
				}
			}
			if (u === change) {
				ev.to.next(at);
				if (cat.soul) {
					return;
				}
				echo(cat, at, ev);
				if (cat.field) {
					not(cat, at);
				}
				obj_del(coat.echo, cat.id);
				obj_del(cat.map, coat.id);
				return;
			}
			if (cat.soul) {
				if (cat.root._.now) {
					at = obj_to(at, { put: change = coat.put });
				} // TODO: Ugly hack for uncached synchronous maps.
				ev.to.next(at);
				echo(cat, at, ev);
				obj_map(change, map, { at: at, cat: cat });
				return;
			}
			if (!(rel = Gun.val.rel.is(change))) {
				if (Gun.val.is(change)) {
					if (cat.field || cat.soul) {
						not(cat, at);
					} else if (coat.field || coat.soul) {
						(coat.echo || (coat.echo = {}))[cat.id] = cat;
						(cat.map || (cat.map = {}))[coat.id] = cat.map[coat.id] || { at: coat };
						//if(u === coat.put){ return } // Not necessary but improves performance. If we have it but coat does not, that means we got things out of order and coat will get it. Once coat gets it, it will tell us again.
					}
					ev.to.next(at);
					echo(cat, at, ev);
					return;
				}
				if (cat.field && coat !== cat && obj_has(coat, 'put')) {
					cat.put = coat.put;
				};
				if ((rel = Gun.node.soul(change)) && coat.field) {
					coat.put = cat.root.get(rel)._.put;
				}
				ev.to.next(at);
				echo(cat, at, ev);
				relate(cat, at, coat, rel);
				obj_map(change, map, { at: at, cat: cat });
				return;
			}
			relate(cat, at, coat, rel);
			ev.to.next(at);
			echo(cat, at, ev);
		}
		Gun.chain.chain.input = input;
		function relate(cat, at, coat, rel) {
			if (!rel || node_ === cat.get) {
				return;
			}
			var tmp = cat.root.get(rel)._;
			if (cat.field) {
				coat = tmp;
			} else if (coat.field) {
				relate(coat, at, coat, rel);
			}
			if (coat === cat) {
				return;
			}
			(coat.echo || (coat.echo = {}))[cat.id] = cat;
			if (cat.field && !(cat.map || empty)[coat.id]) {
				not(cat, at);
			}
			tmp = (cat.map || (cat.map = {}))[coat.id] = cat.map[coat.id] || { at: coat };
			if (rel === tmp.rel) {
				return;
			}
			ask(cat, tmp.rel = rel);
		}
		function echo(cat, at, ev) {
			if (!cat.echo) {
				return;
			} // || node_ === at.get ????
			if (cat.field) {
				at = obj_to(at, { event: ev });
			}
			obj_map(cat.echo, reverb, at);
		}
		function reverb(cat) {
			cat.on('in', this);
		}
		function map(data, key) {
			// Map over only the changes on every update.
			var cat = this.cat,
			    next = cat.next || empty,
			    via = this.at,
			    gun,
			    chain,
			    at,
			    tmp;
			if (node_ === key && !next[key]) {
				return;
			}
			if (!(gun = next[key])) {
				return;
			}
			at = gun._;
			//if(data && data[_soul] && (tmp = Gun.val.rel.is(data)) && (tmp = (cat.root.get(tmp)._)) && obj_has(tmp, 'put')){
			//	data = tmp.put;
			//}
			if (at.field) {
				if (!(data && data[_soul] && Gun.val.rel.is(data) === Gun.node.soul(at.put))) {
					at.put = data;
				}
				chain = gun;
			} else {
				chain = via.gun.get(key);
			}
			at.on('in', {
				put: data,
				get: key,
				gun: chain,
				via: via
			});
		}
		function not(cat, at) {
			if (!(cat.field || cat.soul)) {
				return;
			}
			var tmp = cat.map;
			cat.map = null;
			if (null === tmp) {
				return;
			}
			if (u === tmp && cat.put !== u) {
				return;
			} // TODO: Bug? Threw second condition in for a particular test, not sure if a counter example is tested though.
			obj_map(tmp, function (proxy) {
				if (!(proxy = proxy.at)) {
					return;
				}
				obj_del(proxy.echo, cat.id);
			});
			obj_map(cat.next, function (gun, key) {
				var coat = gun._;
				coat.put = u;
				if (coat.ack) {
					coat.ack = -1;
				}
				coat.on('in', {
					get: key,
					gun: gun,
					put: u
				});
			});
		}
		function ask(cat, soul) {
			var tmp = cat.root.get(soul)._;
			if (cat.ack) {
				tmp.ack = tmp.ack || -1;
				tmp.on('out', {
					get: tmp = { '#': soul, gun: tmp.gun },
					'#': cat.root._.ask(Gun.HAM.synth, tmp)
				});
				return;
			}
			obj_map(cat.next, function (gun, key) {
				gun._.on('out', {
					get: gun = { '#': soul, '.': key, gun: gun },
					'#': cat.root._.ask(Gun.HAM.synth, gun)
				});
			});
		}
		var empty = {},
		    u;
		var obj = Gun.obj,
		    obj_has = obj.has,
		    obj_put = obj.put,
		    obj_del = obj.del,
		    obj_to = obj.to,
		    obj_map = obj.map;
		var _soul = Gun._.soul,
		    _field = Gun._.field,
		    node_ = Gun.node._;
	})(require, './chain');

	;require(function (module) {
		var Gun = require('./root');
		Gun.chain.get = function (key, cb, as) {
			if (typeof key === 'string') {
				var gun,
				    back = this,
				    cat = back._;
				var next = cat.next || empty,
				    tmp;
				if (!(gun = next[key])) {
					gun = cache(key, back);
				}
			} else if (key instanceof Function) {
				var gun = this,
				    at = gun._;
				as = cb || {};
				as.use = key;
				as.out = as.out || { cap: 1 };
				as.out.get = as.out.get || {};
				'_' != at.get && (at.root._.now = true); // ugly hack for now.
				at.on('in', use, as);
				at.on('out', as.out);
				at.root._.now = false;
				return gun;
			} else if (num_is(key)) {
				return this.get('' + key, cb, as);
			} else {
				(as = this.chain())._.err = { err: Gun.log('Invalid get request!', key) }; // CLEAN UP
				if (cb) {
					cb.call(as, as._.err);
				}
				return as;
			}
			if (tmp = cat.stun) {
				// TODO: Refactor?
				gun._.stun = gun._.stun || tmp;
			}
			if (cb && cb instanceof Function) {
				gun.get(cb, as);
			}
			return gun;
		};
		function cache(key, back) {
			var cat = back._,
			    next = cat.next,
			    gun = back.chain(),
			    at = gun._;
			if (!next) {
				next = cat.next = {};
			}
			next[at.get = key] = gun;
			if (cat.root === back) {
				at.soul = key;
			} else if (cat.soul || cat.field) {
				at.field = key;
			}
			return gun;
		}
		function use(at) {
			var ev = this,
			    as = ev.as,
			    gun = at.gun,
			    cat = gun._,
			    data = at.put,
			    tmp;
			if (u === data) {
				data = cat.put;
			}
			if ((tmp = data) && tmp[rel._] && (tmp = rel.is(tmp))) {
				tmp = cat.root.get(tmp)._;
				if (u !== tmp.put) {
					at = obj_to(at, { put: tmp.put });
				}
			}
			as.use(at, at.event || ev);
			ev.to.next(at);
		}
		var obj = Gun.obj,
		    obj_has = obj.has,
		    obj_to = Gun.obj.to;
		var num_is = Gun.num.is;
		var rel = Gun.val.rel,
		    node_ = Gun.node._;
		var empty = {},
		    u;
	})(require, './get');

	;require(function (module) {
		var Gun = require('./root');
		Gun.chain.put = function (data, cb, as) {
			// #soul.field=value>state
			// ~who#where.where=what>when@was
			// TODO: BUG! Put probably cannot handle plural chains!
			var gun = this,
			    at = gun._,
			    root = at.root,
			    tmp;
			as = as || {};
			as.data = data;
			as.gun = as.gun || gun;
			if (typeof cb === 'string') {
				as.soul = cb;
			} else {
				as.ack = cb;
			}
			if (at.soul) {
				as.soul = at.soul;
			}
			if (as.soul || root === gun) {
				if (!obj_is(as.data)) {
					(as.ack || noop).call(as, as.out = { err: Gun.log("Data saved to the root level of the graph must be a node (an object), not a", _typeof(as.data), 'of "' + as.data + '"!') });
					if (as.res) {
						as.res();
					}
					return gun;
				}
				as.gun = gun = root.get(as.soul = as.soul || (as.not = Gun.node.soul(as.data) || (root._.opt.uuid || Gun.text.random)()));
				as.ref = as.gun;
				ify(as);
				return gun;
			}
			if (Gun.is(data)) {
				data.get(function (at, ev) {
					ev.off();
					var s = Gun.node.soul(at.put);
					if (!s) {
						Gun.log("The reference you are saving is a", _typeof(at.put), '"' + as.put + '", not a node (object)!');return;
					}
					gun.put(Gun.val.rel.ify(s), cb, as);
				});
				return gun;
			}
			as.ref = as.ref || root === (tmp = at.back) ? gun : tmp;
			if (as.ref._.soul && Gun.val.is(as.data) && at.get) {
				as.data = obj_put({}, at.get, as.data);
				as.ref.put(as.data, as.soul, as);
				return gun;
			}
			as.ref.get('_').get(any, { as: as });
			if (!as.out) {
				// TODO: Perf idea! Make a global lock, that blocks everything while it is on, but if it is on the lock it does the expensive lookup to see if it is a dependent write or not and if not then it proceeds full speed. Meh? For write heavy async apps that would be terrible.
				as.res = as.res || Gun.on.stun(as.ref);
				as.gun._.stun = as.ref._.stun;
			}
			return gun;
		};

		function ify(as) {
			as.batch = batch;
			var opt = as.opt || {},
			    env = as.env = Gun.state.map(map, opt.state);
			env.soul = as.soul;
			as.graph = Gun.graph.ify(as.data, env, as);
			if (env.err) {
				(as.ack || noop).call(as, as.out = { err: Gun.log(env.err) });
				if (as.res) {
					as.res();
				}
				return;
			}
			as.batch();
		}

		function batch() {
			var as = this;
			if (!as.graph || obj_map(as.stun, no)) {
				return;
			}
			(as.res || iife)(function () {
				as.ref._.on('out', {
					cap: 3,
					gun: as.ref, put: as.out = as.env.graph, opt: as.opt,
					'#': as.gun.back(-1)._.ask(function (ack) {
						this.off(); // One response is good enough for us currently. Later we may want to adjust this.
						if (!as.ack) {
							return;
						}
						as.ack(ack, this);
					}, as.opt)
				});
			}, as);
			if (as.res) {
				as.res();
			}
		}function no(v, f) {
			if (v) {
				return true;
			}
		}

		function map(v, f, n, at) {
			var as = this;
			if (f || !at.path.length) {
				return;
			}
			(as.res || iife)(function () {
				var path = at.path,
				    ref = as.ref,
				    opt = as.opt;
				var i = 0,
				    l = path.length;
				for (i; i < l; i++) {
					ref = ref.get(path[i]);
				}
				if (as.not || Gun.node.soul(at.obj)) {
					var id = Gun.node.soul(at.obj) || ((as.opt || {}).uuid || as.gun.back('opt.uuid') || Gun.text.random)();
					ref.back(-1).get(id);
					at.soul(id);
					return;
				}
				(as.stun = as.stun || {})[path] = true;
				ref.get('_').get(soul, { as: { at: at, as: as } });
			}, { as: as, at: at });
		}

		function soul(at, ev) {
			var as = this.as,
			    cat = as.at;as = as.as;
			//ev.stun(); // TODO: BUG!?
			if (!at.gun || !at.gun._.back) {
				return;
			} // TODO: Handle
			ev.off();
			at = at.gun._.back._;
			var id = Gun.node.soul(cat.obj) || Gun.node.soul(at.put) || Gun.val.rel.is(at.put) || ((as.opt || {}).uuid || as.gun.back('opt.uuid') || Gun.text.random)(); // TODO: BUG!? Do we really want the soul of the object given to us? Could that be dangerous?
			at.gun.back(-1).get(id);
			cat.soul(id);
			as.stun[cat.path] = false;
			as.batch();
		}

		function any(at, ev) {
			var as = this.as;
			if (!at.gun || !at.gun._) {
				return;
			} // TODO: Handle
			if (at.err) {
				// TODO: Handle
				console.log("Please report this as an issue! Put.any.err");
				return;
			}
			var cat = at.gun._.back._,
			    data = cat.put,
			    opt = as.opt || {},
			    root,
			    tmp;
			ev.off();
			if (as.ref !== as.gun) {
				tmp = as.gun._.get || cat.get;
				if (!tmp) {
					// TODO: Handle
					console.log("Please report this as an issue! Put.no.get"); // TODO: BUG!??
					return;
				}
				as.data = obj_put({}, tmp, as.data);
				tmp = null;
			}
			if (u === data) {
				if (!cat.get) {
					return;
				} // TODO: Handle
				if (!cat.soul) {
					tmp = cat.gun.back(function (at) {
						if (at.soul) {
							return at.soul;
						}
						as.data = obj_put({}, at.get, as.data);
					});
				}
				tmp = tmp || cat.get;
				cat = cat.root.get(tmp)._;
				as.not = as.soul = tmp;
				data = as.data;
			}
			if (!as.not && !(as.soul = Gun.node.soul(data))) {
				if (as.path && obj_is(as.data)) {
					// Apparently necessary
					as.soul = (opt.uuid || cat.root._.opt.uuid || Gun.text.random)();
				} else {
					//as.data = obj_put({}, as.gun._.get, as.data);
					as.soul = at.soul || cat.soul || (opt.uuid || cat.root._.opt.uuid || Gun.text.random)();
				}
			}
			as.ref.put(as.data, as.soul, as);
		}
		var obj = Gun.obj,
		    obj_is = obj.is,
		    obj_put = obj.put,
		    obj_map = obj.map;
		var u,
		    empty = {},
		    noop = function noop() {},
		    iife = function iife(fn, as) {
			fn.call(as || empty);
		};
	})(require, './put');

	;require(function (module) {

		var Gun = require('./root');
		module.exports = Gun;

		;(function () {
			function meta(v, f) {
				if (obj_has(Gun.__._, f)) {
					return;
				}
				obj_put(this._, f, v);
			}
			function map(value, field) {
				if (Gun._.node === field) {
					return;
				}
				var node = this.node,
				    vertex = this.vertex,
				    union = this.union,
				    machine = this.machine;
				var is = state_is(node, field),
				    cs = state_is(vertex, field);
				if (u === is || u === cs) {
					return true;
				} // it is true that this is an invalid HAM comparison.
				var iv = value,
				    cv = vertex[field];

				// TODO: BUG! Need to compare relation to not relation, and choose the relation if there is a state conflict.


				if (!val_is(iv) && u !== iv) {
					return true;
				} // Undefined is okay since a value might not exist on both nodes. // it is true that this is an invalid HAM comparison.
				if (!val_is(cv) && u !== cv) {
					return true;
				} // Undefined is okay since a value might not exist on both nodes. // it is true that this is an invalid HAM comparison.
				var HAM = Gun.HAM(machine, is, cs, iv, cv);
				if (HAM.err) {
					console.log(".!HYPOTHETICAL AMNESIA MACHINE ERR!.", field, HAM.err); // this error should never happen.
					return;
				}
				if (HAM.state || HAM.historical || HAM.current) {
					// TODO: BUG! Not implemented.
					//opt.lower(vertex, {field: field, value: value, state: is});
					return;
				}
				if (HAM.incoming) {
					union[field] = value;
					state_ify(union, field, is);
					return;
				}
				if (HAM.defer) {
					// TODO: BUG! Not implemented.
					union[field] = value; // WRONG! BUG! Need to implement correct algorithm.
					state_ify(union, field, is); // WRONG! BUG! Need to implement correct algorithm.
					// filler algorithm for now.
					return;
					/*upper.wait = true;
     opt.upper.call(state, vertex, field, incoming, ctx.incoming.state); // signals that there are still future modifications.
     Gun.schedule(ctx.incoming.state, function(){
     	update(incoming, field);
     	if(ctx.incoming.state === upper.max){ (upper.last || function(){})() }
     }, gun.__.opt.state);*/
				}
			}
			Gun.HAM.union = function (vertex, node, opt) {
				if (!node || !node._) {
					return;
				}
				vertex = vertex || Gun.node.soul.ify({ _: { '>': {} } }, Gun.node.soul(node));
				if (!vertex || !vertex._) {
					return;
				}
				opt = num_is(opt) ? { machine: opt } : { machine: Gun.state() };
				opt.union = vertex || Gun.obj.copy(vertex); // TODO: PERF! This will slow things down!
				// TODO: PERF! Biggest slowdown (after 1ocalStorage) is the above line. Fix! Fix!
				opt.vertex = vertex;
				opt.node = node;
				//obj_map(node._, meta, opt.union); // TODO: Review at some point?
				if (obj_map(node, map, opt)) {
					// if this returns true then something was invalid.
					return;
				}
				return opt.union;
			};
			Gun.HAM.delta = function (vertex, node, opt) {
				opt = num_is(opt) ? { machine: opt } : { machine: Gun.state() };
				if (!vertex) {
					return Gun.obj.copy(node);
				}
				opt.soul = Gun.node.soul(opt.vertex = vertex);
				if (!opt.soul) {
					return;
				}
				opt.delta = Gun.node.soul.ify({}, opt.soul);
				obj_map(opt.node = node, diff, opt);
				return opt.delta;
			};
			function diff(value, field) {
				var opt = this;
				if (Gun._.node === field) {
					return;
				}
				if (!val_is(value)) {
					return;
				}
				var node = opt.node,
				    vertex = opt.vertex,
				    is = state_is(node, field, true),
				    cs = state_is(vertex, field, true),
				    delta = opt.delta;
				var HAM = Gun.HAM(opt.machine, is, cs, value, vertex[field]);

				// TODO: BUG!!!! WHAT ABOUT DEFERRED!???


				if (HAM.incoming) {
					delta[field] = value;
					state_ify(delta, field, is);
				}
			}
			Gun.HAM.synth = function (at, ev) {
				var as = this.as,
				    cat = as.gun._;
				if (!at.put || as['.'] && !obj_has(at.put[as['#']], cat.get)) {
					if (cat.put !== u) {
						return;
					}
					cat.on('in', {
						get: cat.get,
						put: cat.put = u,
						gun: cat.gun
					});
					return;
				}
				at.gun = cat.root;
				Gun.on('put', at);
			};
			Gun.HAM.synth_ = function (at, ev, as) {
				var gun = this.as || as;
				var cat = gun._,
				    root = cat.root._,
				    put = {},
				    tmp;
				if (!at.put) {
					//if(obj_has(cat, 'put')){ return }
					if (cat.put !== u) {
						return;
					}
					cat.on('in', {
						//root.ack(at['@'], {
						get: cat.get,
						put: cat.put = u,
						gun: gun,
						via: at
					});
					return;
				}
				// TODO: PERF! Have options to determine if this data should even be in memory on this peer!
				obj_map(at.put, function (node, soul) {
					var graph = this.graph;
					put[soul] = Gun.HAM.delta(graph[soul], node, { graph: graph }); // TODO: PERF! SEE IF WE CAN OPTIMIZE THIS BY MERGING UNION INTO DELTA!
					graph[soul] = Gun.HAM.union(graph[soul], node) || graph[soul];
				}, root);
				if (at.gun !== root.gun) {
					put = at.put;
				}
				// TODO: PERF! Have options to determine if this data should even be in memory on this peer!
				obj_map(put, function (node, soul) {
					var root = this,
					    next = root.next || (root.next = {}),
					    gun = next[soul] || (next[soul] = root.gun.get(soul)),
					    coat = gun._;
					coat.put = root.graph[soul]; // TODO: BUG! Clone!
					if (cat.field && !obj_has(node, cat.field)) {
						(at = obj_to(at, {})).put = u;
						Gun.HAM.synth(at, ev, cat.gun);
						return;
					}
					coat.on('in', {
						put: node,
						get: soul,
						gun: gun,
						via: at
					});
				}, root);
			};
		})();

		var Type = Gun;
		var num = Type.num,
		    num_is = num.is;
		var obj = Type.obj,
		    obj_has = obj.has,
		    obj_put = obj.put,
		    obj_to = obj.to,
		    obj_map = obj.map;
		var node = Gun.node,
		    node_soul = node.soul,
		    node_is = node.is,
		    node_ify = node.ify;
		var state = Gun.state,
		    state_is = state.is,
		    state_ify = state.ify;
		var val = Gun.val,
		    val_is = val.is,
		    rel_is = val.rel.is;
		var u;
	})(require, './index');

	;require(function (module) {
		var Gun = require('./root');
		require('./index'); // TODO: CLEAN UP! MERGE INTO ROOT!
		require('./opt');
		require('./chain');
		require('./back');
		require('./put');
		require('./get');
		module.exports = Gun;
	})(require, './core');

	;require(function (module) {
		var Gun = require('./core');
		Gun.chain.path = function (field, cb, opt) {
			var back = this,
			    gun = back,
			    tmp;
			opt = opt || {};opt.path = true;
			Gun.log.once("pathing", "Warning: `.path` to be removed from core (but available as an extension), use `.get` chains instead. If you are opposed to this, please voice your opinion in https://gitter.im/amark/gun and ask others.");
			if (gun === gun._.root) {
				if (cb) {
					cb({ err: Gun.log("Can't do that on root instance.") });
				}return gun;
			}
			if (typeof field === 'string') {
				tmp = field.split(opt.split || '.');
				if (1 === tmp.length) {
					gun = back.get(field, cb, opt);
					gun._.opt = opt;
					return gun;
				}
				field = tmp;
			}
			if (field instanceof Array) {
				if (field.length > 1) {
					gun = back;
					var i = 0,
					    l = field.length;
					for (i; i < l; i++) {
						gun = gun.get(field[i], i + 1 === l ? cb : null, opt);
					}
					//gun.back = back; // TODO: API change!
				} else {
					gun = back.get(field[0], cb, opt);
				}
				gun._.opt = opt;
				return gun;
			}
			if (!field && 0 != field) {
				return back;
			}
			gun = back.get('' + field, cb, opt);
			gun._.opt = opt;
			return gun;
		};
	})(require, './path');

	;require(function (module) {
		var Gun = require('./core');
		Gun.chain.on = function (tag, arg, eas, as) {
			var gun = this,
			    at = gun._,
			    tmp,
			    act,
			    _off;
			if (typeof tag === 'string') {
				if (!arg) {
					return at.on(tag);
				}
				act = at.on(tag, arg, eas || at, as);
				if (eas && eas.gun) {
					(eas.subs || (eas.subs = [])).push(act);
				}
				_off = function off() {
					if (act && act.off) act.off();
					_off.off();
				};
				_off.off = gun.off.bind(gun) || noop;
				gun.off = _off;
				return gun;
			}
			var opt = arg;
			opt = true === opt ? { change: true } : opt || {};
			opt.ok = tag;
			opt.last = {};
			gun.get(ok, opt); // TODO: PERF! Event listener leak!!!????
			return gun;
		};

		function ok(at, ev) {
			var opt = this;
			var gun = at.gun,
			    cat = gun._,
			    data = cat.put || at.put,
			    tmp = opt.last,
			    id = cat.id + at.get,
			    tmp;
			if (u === data) {
				return;
			}
			if (data && data[rel._] && (tmp = rel.is(data))) {
				tmp = cat.root.get(tmp)._;
				if (u === tmp.put) {
					return;
				}
				data = tmp.put;
			}
			if (opt.change) {
				// TODO: BUG? Move above the undef checks?
				data = at.put;
			}
			// DEDUPLICATE // TODO: NEEDS WORK! BAD PROTOTYPE
			if (tmp.put === data && tmp.get === id && !Gun.node.soul(data)) {
				return;
			}
			tmp.put = data;
			tmp.get = id;
			// DEDUPLICATE // TODO: NEEDS WORK! BAD PROTOTYPE
			cat.last = data;
			if (opt.as) {
				opt.ok.call(opt.as, at, ev);
			} else {
				opt.ok.call(gun, data, at.get, at, ev);
			}
		}

		Gun.chain.val = function (cb, opt) {
			var gun = this,
			    at = gun._,
			    data = at.put;
			if (0 < at.ack && u !== data) {
				(cb || noop).call(gun, data, at.get);
				return gun;
			}
			if (cb) {
				(opt = opt || {}).ok = cb;
				opt.cat = at;
				gun.get(val, { as: opt });
				opt.async = true; //opt.async = at.stun? 1 : true;
			} else {
				Gun.log.once("valonce", "Chainable val is experimental, its behavior and API may change moving forward. Please play with it and report bugs and ideas on how to improve it.");
				var chain = gun.chain();
				chain._.val = gun.val(function () {
					chain._.on('in', gun._);
				});
				return chain;
			}
			return gun;
		};

		function val(at, ev, to) {
			var opt = this.as,
			    cat = opt.cat,
			    gun = at.gun,
			    coat = gun._,
			    data = coat.put || at.put,
			    tmp;
			if (u === data) {
				//return;
			}
			if (data && data[rel._] && (tmp = rel.is(data))) {
				tmp = cat.root.get(tmp)._;
				if (u === tmp.put) {
					return;
				}
				data = tmp.put;
			}
			if (ev.wait) {
				clearTimeout(ev.wait);
			}
			//if(!to && (!(0 < coat.ack) || ((true === opt.async) && 0 !== opt.wait))){
			if (!opt.async) {
				ev.wait = setTimeout(function () {
					val.call({ as: opt }, at, ev, ev.wait || 1);
				}, opt.wait || 99);
				return;
			}
			if (cat.field || cat.soul) {
				if (ev.off()) {
					return;
				} // if it is already off, don't call again!
			} else {
				if ((opt.seen = opt.seen || {})[coat.id]) {
					return;
				}
				opt.seen[coat.id] = true;
			}
			opt.ok.call(at.gun || opt.gun, data, at.get);
		}

		Gun.chain.off = function () {
			var gun = this,
			    at = gun._,
			    tmp;
			var back = at.back || {},
			    cat = back._;
			if (!cat) {
				return;
			}
			if (tmp = cat.next) {
				if (tmp[at.get]) {
					obj_del(tmp, at.get);
				} else {
					obj_map(tmp, function (path, key) {
						if (gun !== path) {
							return;
						}
						obj_del(tmp, key);
					});
				}
			}
			if ((tmp = gun.back(-1)) === back) {
				obj_del(tmp.graph, at.get);
			}
			if (at.ons && (tmp = at.ons['@$'])) {
				obj_map(tmp.s, function (ev) {
					ev.off();
				});
			}
			return gun;
		};
		var obj = Gun.obj,
		    obj_has = obj.has,
		    obj_del = obj.del,
		    obj_to = obj.to;
		var rel = Gun.val.rel;
		var empty = {},
		    noop = function noop() {},
		    u;
	})(require, './on');

	;require(function (module) {
		var Gun = require('./core'),
		    u;
		Gun.chain.not = function (cb, opt, t) {
			Gun.log.once("nottobe", "Warning: `.not` to be removed from core (but available as an extension), use `.val` instead, which now supports (v0.7.x+) 'not found data' as `undefined` data in callbacks. If you are opposed to this, please voice your opinion in https://gitter.im/amark/gun and ask others.");
			return this.get(ought, { not: cb });
		};
		function ought(at, ev) {
			ev.off();
			if (at.err || u !== at.put) {
				return;
			}
			if (!this.not) {
				return;
			}
			this.not.call(at.gun, at.get, function () {
				console.log("Please report this bug on https://gitter.im/amark/gun and in the issues.");need.to.implement;
			});
		}
	})(require, './not');

	;require(function (module) {
		var Gun = require('./core');
		Gun.chain.map = function (cb, opt, t) {
			var gun = this,
			    cat = gun._,
			    chain;
			if (!cb) {
				if (chain = cat.fields) {
					return chain;
				}
				chain = cat.fields = gun.chain();
				chain._.val = gun.back('val');
				gun.on('in', map, chain._);
				return chain;
			}
			Gun.log.once("mapfn", "Map functions are experimental, their behavior and API may change moving forward. Please play with it and report bugs and ideas on how to improve it.");
			chain = gun.chain();
			gun.map().on(function (data, key, at, ev) {
				var next = (cb || noop).call(this, data, key, at, ev);
				if (u === next) {
					return;
				}
				if (Gun.is(next)) {
					chain._.on('in', next._);
					return;
				}
				chain._.on('in', { get: key, put: next, gun: chain });
			});
			return chain;
		};
		function map(at) {
			if (!at.put || Gun.val.is(at.put)) {
				return;
			}
			if (this.as.val) {
				this.off();
			} // TODO: Ugly hack!
			obj_map(at.put, each, { cat: this.as, gun: at.gun });
			this.to.next(at);
		}
		function each(v, f) {
			if (n_ === f) {
				return;
			}
			var cat = this.cat,
			    gun = this.gun.get(f),
			    at = gun._;
			(at.echo || (at.echo = {}))[cat.id] = cat;
		}
		var obj_map = Gun.obj.map,
		    noop = function noop() {},
		    event = { stun: noop, off: noop },
		    n_ = Gun.node._,
		    u;
	})(require, './map');

	;require(function (module) {
		var Gun = require('./core');
		Gun.chain.set = function (item, cb, opt) {
			var gun = this,
			    soul;
			cb = cb || function () {};
			if (soul = Gun.node.soul(item)) {
				return gun.set(gun.back(-1).get(soul), cb, opt);
			}
			if (!Gun.is(item)) {
				if (Gun.obj.is(item)) {
					return gun.set(gun._.root.put(item), cb, opt);
				}
				return gun.get(Gun.text.random()).put(item);
			}
			item.get('_').get(function (at, ev) {
				if (!at.gun || !at.gun._.back) ;
				ev.off();
				at = at.gun._.back._;
				var put = {},
				    node = at.put,
				    soul = Gun.node.soul(node);
				if (!soul) {
					return cb.call(gun, { err: Gun.log('Only a node can be linked! Not "' + node + '"!') });
				}
				gun.put(Gun.obj.put(put, soul, Gun.val.rel.ify(soul)), cb, opt);
			}, { wait: 0 });
			return item;
		};
	})(require, './set');

	;require(function (module) {
		if (typeof Gun === 'undefined') {
			return;
		} // TODO: localStorage is Browser only. But it would be nice if it could somehow plugin into NodeJS compatible localStorage APIs?

		var root,
		    noop = function noop() {},
		    u;
		if (typeof window !== 'undefined') {
			root = window;
		}
		var store = root.localStorage || { setItem: noop, removeItem: noop, getItem: noop };

		var check = {},
		    dirty = {},
		    async = {},
		    count = 0,
		    max = 10000,
		    wait;

		Gun.on('put', function (at) {
			var err,
			    id,
			    opt,
			    root = at.gun._.root;
			this.to.next(at);
			(opt = {}).prefix = (at.opt || opt).prefix || at.gun.back('opt.prefix') || 'gun/';
			var graph = root._.graph;
			Gun.obj.map(at.put, function (node, soul) {
				async[soul] = async[soul] || graph[soul] || node;
			});
			count += 1;
			check[at['#']] = root;
			function save() {
				clearTimeout(wait);
				var ack = check;
				var all = async;
				count = 0;
				wait = false;
				check = {};
				async = {};
				Gun.obj.map(all, function (node, soul) {
					// Since localStorage only has 5MB, it is better that we keep only
					// the data that the user is currently interested in.
					node = graph[soul] || all[soul] || node;
					try {
						store.setItem(opt.prefix + soul, JSON.stringify(node));
					} catch (e) {
						err = e || "localStorage failure";
					}
				});
				if (!Gun.obj.empty(at.gun.back('opt.peers'))) {
					return;
				} // only ack if there are no peers.
				Gun.obj.map(ack, function (root, id) {
					root.on('in', {
						'@': id,
						err: err,
						ok: 0 // localStorage isn't reliable, so make its `ok` code be a low number.
					});
				});
			}
			if (count >= max) {
				// goal is to do 10K inserts/second.
				return save();
			}
			if (wait) {
				return;
			}
			clearTimeout(wait);
			wait = setTimeout(save, 1000);
		});
		Gun.on('get', function (at) {
			this.to.next(at);
			var gun = at.gun,
			    lex = at.get,
			    soul,
			    data,
			    opt,
			    u;
			//setTimeout(function(){
			(opt = at.opt || {}).prefix = opt.prefix || at.gun.back('opt.prefix') || 'gun/';
			if (!lex || !(soul = lex[Gun._.soul])) {
				return;
			}
			//if(0 >= at.cap){ return }
			var field = lex['.'];
			data = Gun.obj.ify(store.getItem(opt.prefix + soul) || null) || async[soul] || u;
			if (data && field) {
				data = Gun.state.to(data, field);
			}
			if (!data && !Gun.obj.empty(gun.back('opt.peers'))) {
				// if data not found, don't ack if there are peers.
				return; // Hmm, what if we have peers but we are disconnected?
			}
			gun.on('in', { '@': at['#'], put: Gun.graph.node(data), how: 'lS' });
			//},11);
		});
	})(require, './adapters/localStorage');

	;require(function (module) {
		var Gun = require('./core');

		if (typeof JSON === 'undefined') {
			throw new Error('Gun depends on JSON. Please load it first:\n' + 'ajax.cdnjs.com/ajax/libs/json2/20110223/json2.js');
		}

		var WebSocket;
		if (typeof window !== 'undefined') {
			WebSocket = window.WebSocket || window.webkitWebSocket || window.mozWebSocket;
		} else {
			return;
		}
		var message,
		    count = 0,
		    noop = function noop() {},
		    wait;

		Gun.on('out', function (at) {
			this.to.next(at);
			var cat = at.gun._.root._,
			    wsp = cat.wsp || (cat.wsp = {});
			if (at.wsp && 1 === wsp.count) {
				return;
			} // if the message came FROM the only peer we are connected to, don't echo it back.
			message = JSON.stringify(at);
			//if(++count){ console.log("msg OUT:", count, Gun.obj.ify(message)) }
			if (cat.udrain) {
				cat.udrain.push(message);
				return;
			}
			cat.udrain = [];
			clearTimeout(wait);
			wait = setTimeout(function () {
				if (!cat.udrain) {
					return;
				}
				var tmp = cat.udrain;
				cat.udrain = null;
				if (tmp.length) {
					message = JSON.stringify(tmp);
					Gun.obj.map(cat.opt.peers, send, cat);
				}
			}, 1);
			wsp.count = 0;
			Gun.obj.map(cat.opt.peers, send, cat);
		});

		function send(peer) {
			var msg = message,
			    cat = this;
			var wire = peer.wire || open(peer, cat);
			if (cat.wsp) {
				cat.wsp.count++;
			}
			if (!wire) {
				return;
			}
			if (wire.readyState === wire.OPEN) {
				wire.send(msg);
				return;
			}
			(peer.queue = peer.queue || []).push(msg);
		}

		function receive(msg, peer, cat) {
			if (!cat || !msg) {
				return;
			}
			try {
				msg = JSON.parse(msg.data || msg);
			} catch (e) {}
			if (msg instanceof Array) {
				var i = 0,
				    m;
				while (m = msg[i++]) {
					receive(m, peer, cat);
				}
				return;
			}
			//if(++count){ console.log("msg in:", count, msg.body || msg) }
			if (cat.wsp && 1 === cat.wsp.count) {
				(msg.body || msg).wsp = noop;
			} // If there is only 1 client, just use noop since it doesn't matter.
			cat.gun.on('in', msg.body || msg);
		}

		function open(peer, as) {
			if (!peer || !peer.url) {
				return;
			}
			var url = peer.url.replace('http', 'ws');
			var wire = peer.wire = new WebSocket(url, as.opt.wsc.protocols, as.opt.wsc);
			wire.onclose = function () {
				reconnect(peer, as);
			};
			wire.onerror = function (error) {
				reconnect(peer, as);
				if (!error) {
					return;
				}
				if (error.code === 'ECONNREFUSED') {
					//reconnect(peer, as);
				}
			};
			wire.onopen = function () {
				var queue = peer.queue;
				peer.queue = [];
				Gun.obj.map(queue, function (msg) {
					message = msg;
					send.call(as, peer);
				});
			};
			wire.onmessage = function (msg) {
				receive(msg, peer, as);
			};
			return wire;
		}

		function reconnect(peer, as) {
			clearTimeout(peer.defer);
			peer.defer = setTimeout(function () {
				open(peer, as);
			}, 2 * 1000);
		}
	})(require, './polyfill/request');
})();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13), __webpack_require__(30)(module)))

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by Leon Revill on 15/12/2015.
 * Blog: blog.revillweb.com
 * GitHub: https://github.com/RevillWeb
 * Twitter: @RevillWeb
 */

/**
 * The main router class and entry point to the router.
 */
var RebelRouter = exports.RebelRouter = function (_HTMLElement) {
    _inherits(RebelRouter, _HTMLElement);

    function RebelRouter() {
        _classCallCheck(this, RebelRouter);

        return _possibleConstructorReturn(this, (RebelRouter.__proto__ || Object.getPrototypeOf(RebelRouter)).apply(this, arguments));
    }

    _createClass(RebelRouter, [{
        key: "createdCallback",


        /**
         * Main initialisation point of rebel-router
         * @param prefix - If extending rebel-router you can specify a prefix when calling createdCallback in case your elements need to be named differently
         */
        value: function createdCallback(prefix) {
            var _this2 = this;

            var _prefix = prefix || "rebel";

            this.previousPath = null;
            this.basePath = null;

            //Get options
            this.options = {
                "animation": this.getAttribute("animation") == "true",
                "shadowRoot": this.getAttribute("shadow") == "true",
                "inherit": this.getAttribute("inherit") != "false"
            };

            //Get routes
            if (this.options.inherit === true) {
                //If this is a nested router then we need to go and get the parent path
                var $element = this;
                while ($element.parentNode) {
                    $element = $element.parentNode;
                    if ($element.nodeName.toLowerCase() == _prefix + "-router") {
                        var current = $element.current();
                        this.basePath = current.route;
                        break;
                    }
                }
            }
            this.routes = {};
            var $children = this.children;
            for (var i = 0; i < $children.length; i++) {
                var $child = $children[i];
                var path = $child.getAttribute("path");
                switch ($child.nodeName.toLowerCase()) {
                    case _prefix + "-default":
                        path = "*";
                        break;
                    case _prefix + "-route":
                        path = this.basePath !== null ? this.basePath + path : path;
                        break;
                }
                if (path !== null) {
                    var $template = null;
                    if ($child.innerHTML) {
                        $template = "<" + _prefix + "-route>" + $child.innerHTML + "</" + _prefix + "-route>";
                    }
                    this.routes[path] = {
                        "component": $child.getAttribute("component"),
                        "template": $template
                    };
                }
            }

            //After we have collected all configuration clear innerHTML
            this.innerHTML = "";

            if (this.options.shadowRoot === true) {
                this.createShadowRoot();
                this.root = this.shadowRoot;
            } else {
                this.root = this;
            }
            if (this.options.animation === true) {
                this.initAnimation();
            }
            this.render();
            RebelRouter.pathChange(function (isBack) {
                if (_this2.options.animation === true) {
                    if (isBack === true) {
                        _this2.classList.add("rbl-back");
                    } else {
                        _this2.classList.remove("rbl-back");
                    }
                }
                _this2.render();
            });
        }

        /**
         * Function used to initialise the animation mechanics if animation is turned on
         */

    }, {
        key: "initAnimation",
        value: function initAnimation() {
            var _this3 = this;

            var observer = new MutationObserver(function (mutations) {
                var node = mutations[0].addedNodes[0];
                if (node !== undefined) {
                    var otherChildren = _this3.getOtherChildren(node);
                    node.classList.add("rebel-animate");
                    node.classList.add("enter");
                    setTimeout(function () {
                        if (otherChildren.length > 0) {
                            otherChildren.forEach(function (child) {
                                child.classList.add("exit");
                                setTimeout(function () {
                                    child.classList.add("complete");
                                }, 10);
                            });
                        }
                        setTimeout(function () {
                            node.classList.add("complete");
                        }, 10);
                    }, 10);
                    var animationEnd = function animationEnd(event) {
                        if (event.target.className.indexOf("exit") > -1) {
                            _this3.root.removeChild(event.target);
                        }
                    };
                    node.addEventListener("transitionend", animationEnd);
                    node.addEventListener("animationend", animationEnd);
                }
            });
            observer.observe(this, { childList: true });
        }

        /**
         * Method used to get the current route object
         * @returns {*}
         */

    }, {
        key: "current",
        value: function current() {
            var path = RebelRouter.getPathFromUrl();
            for (var route in this.routes) {
                if (route !== "*") {
                    var regexString = "^" + route.replace(/{\w+}\/?/g, "(\\w+)\/?");
                    regexString += regexString.indexOf("\\/?") > -1 ? "" : "\\/?" + "([?=&-\/\\w+]+)?$";
                    var regex = new RegExp(regexString);
                    if (regex.test(path)) {
                        return _routeResult(this.routes[route], route, regex, path);
                    }
                }
            }
            return this.routes["*"] !== undefined ? _routeResult(this.routes["*"], "*", null, path) : null;
        }

        /**
         * Method called to render the current view
         */

    }, {
        key: "render",
        value: function render() {
            var result = this.current();
            if (result !== null) {
                if (result.path !== this.previousPath || this.options.animation === true) {
                    if (this.options.animation !== true) {
                        this.root.innerHTML = "";
                    }
                    if (result.component !== null) {
                        var $component = document.createElement(result.component);
                        for (var key in result.params) {
                            var value = result.params[key];
                            if (typeof value == "Object") {
                                try {
                                    value = JSON.parse(value);
                                } catch (e) {
                                    console.error("Couldn't parse param value:", e);
                                }
                            }
                            $component.setAttribute(key, value);
                        }
                        this.root.appendChild($component);
                    } else {
                        var $template = result.template;
                        //TODO: Find a faster alternative
                        if ($template.indexOf("${") > -1) {
                            $template = $template.replace(/\${([^{}]*)}/g, function (a, b) {
                                var r = result.params[b];
                                return typeof r === 'string' || typeof r === 'number' ? r : a;
                            });
                        }
                        this.root.innerHTML = $template;
                    }
                    this.previousPath = result.path;
                }
            }
        }

        /**
         *
         * @param node - Used with the animation mechanics to get all other view children except itself
         * @returns {Array}
         */

    }, {
        key: "getOtherChildren",
        value: function getOtherChildren(node) {
            var children = this.root.children;
            var results = [];
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (child != node) {
                    results.push(child);
                }
            }
            return results;
        }
    }], [{
        key: "parseQueryString",


        /**
         * Static helper method to parse the query string from a url into an object.
         * @param url
         * @returns {{}}
         */
        value: function parseQueryString(url) {
            var result = {};
            if (url !== undefined) {
                var queryString = url.indexOf("?") > -1 ? url.substr(url.indexOf("?") + 1, url.length) : null;
                if (queryString !== null) {
                    queryString.split("&").forEach(function (part) {
                        if (!part) return;
                        part = part.replace("+", " ");
                        var eq = part.indexOf("=");
                        var key = eq > -1 ? part.substr(0, eq) : part;
                        var val = eq > -1 ? decodeURIComponent(part.substr(eq + 1)) : "";
                        var from = key.indexOf("[");
                        if (from == -1) result[decodeURIComponent(key)] = val;else {
                            var to = key.indexOf("]");
                            var index = decodeURIComponent(key.substring(from + 1, to));
                            key = decodeURIComponent(key.substring(0, from));
                            if (!result[key]) result[key] = [];
                            if (!index) result[key].push(val);else result[key][index] = val;
                        }
                    });
                }
            }
            return result;
        }

        /**
         * Static helper method to convert a class name to a valid element name.
         * @param Class
         * @returns {string}
         */

    }, {
        key: "classToTag",
        value: function classToTag(Class) {
            /**
             * Class.name would be better but this isn't supported in IE 11.
             */
            try {
                var name = Class.toString().match(/^function\s*([^\s(]+)/)[1].replace(/\W+/g, '-').replace(/([a-z\d])([A-Z0-9])/g, '$1-$2').toLowerCase();
            } catch (e) {
                throw new Error("Couldn't parse class name:", e);
            }
            if (RebelRouter.validElementTag(name) === false) {
                throw new Error("Class name couldn't be translated to tag.");
            }
            return name;
        }

        /**
         * Static helper method used to determine if an element with the specified name has already been registered.
         * @param name
         * @returns {boolean}
         */

    }, {
        key: "isRegisteredElement",
        value: function isRegisteredElement(name) {
            return document.createElement(name).constructor !== HTMLElement;
        }

        /**
         * Static helper method to take a web component class, create an element name and register the new element on the document.
         * @param Class
         * @returns {string}
         */

    }, {
        key: "createElement",
        value: function createElement(Class) {
            var name = RebelRouter.classToTag(Class);
            if (RebelRouter.isRegisteredElement(name) === false) {
                Class.prototype.name = name;
                document.registerElement(name, Class);
            }
            return name;
        }

        /**
         * Simple static helper method containing a regular expression to validate an element name
         * @param tag
         * @returns {boolean}
         */

    }, {
        key: "validElementTag",
        value: function validElementTag(tag) {
            return (/^[a-z0-9\-]+$/.test(tag)
            );
        }

        /**
         * Method used to register a callback to be called when the URL path changes.
         * @param callback
         */

    }, {
        key: "pathChange",
        value: function pathChange(callback) {
            if (RebelRouter.changeCallbacks === undefined) {
                RebelRouter.changeCallbacks = [];
            }
            RebelRouter.changeCallbacks.push(callback);
            var changeHandler = function changeHandler() {
                /**
                 *  event.oldURL and event.newURL would be better here but this doesn't work in IE :(
                 */
                if (window.location.href != RebelRouter.oldURL) {
                    RebelRouter.changeCallbacks.forEach(function (callback) {
                        callback(RebelRouter.isBack);
                    });
                    RebelRouter.isBack = false;
                }
                RebelRouter.oldURL = window.location.href;
            };
            if (window.onhashchange === null) {
                window.addEventListener("rblback", function () {
                    RebelRouter.isBack = true;
                });
            }
            window.onhashchange = changeHandler;
        }

        /**
         * Static helper method used to get the parameters from the provided route.
         * @param regex
         * @param route
         * @param path
         * @returns {{}}
         */

    }, {
        key: "getParamsFromUrl",
        value: function getParamsFromUrl(regex, route, path) {
            var result = RebelRouter.parseQueryString(path);
            var re = /{(\w+)}/g;
            var results = [];
            var match = void 0;
            while (match = re.exec(route)) {
                results.push(match[1]);
            }
            if (regex !== null) {
                var results2 = regex.exec(path);
                results.forEach(function (item, idx) {
                    result[item] = results2[idx + 1];
                });
            }
            return result;
        }

        /**
         * Static helper method used to get the path from the current URL.
         * @returns {*}
         */

    }, {
        key: "getPathFromUrl",
        value: function getPathFromUrl() {
            var result = window.location.href.match(/#(.*)$/);
            if (result !== null) {
                return result[1];
            }
        }
    }]);

    return RebelRouter;
}(HTMLElement);

document.registerElement("rebel-router", RebelRouter);

/**
 * Class which represents the rebel-route custom element
 */

var RebelRoute = exports.RebelRoute = function (_HTMLElement2) {
    _inherits(RebelRoute, _HTMLElement2);

    function RebelRoute() {
        _classCallCheck(this, RebelRoute);

        return _possibleConstructorReturn(this, (RebelRoute.__proto__ || Object.getPrototypeOf(RebelRoute)).apply(this, arguments));
    }

    return RebelRoute;
}(HTMLElement);

document.registerElement("rebel-route", RebelRoute);

/**
 * Class which represents the rebel-default custom element
 */

var RebelDefault = function (_HTMLElement3) {
    _inherits(RebelDefault, _HTMLElement3);

    function RebelDefault() {
        _classCallCheck(this, RebelDefault);

        return _possibleConstructorReturn(this, (RebelDefault.__proto__ || Object.getPrototypeOf(RebelDefault)).apply(this, arguments));
    }

    return RebelDefault;
}(HTMLElement);

document.registerElement("rebel-default", RebelDefault);

/**
 * Represents the prototype for an anchor element which added functionality to perform a back transition.
 */

var RebelBackA = function (_HTMLAnchorElement) {
    _inherits(RebelBackA, _HTMLAnchorElement);

    function RebelBackA() {
        _classCallCheck(this, RebelBackA);

        return _possibleConstructorReturn(this, (RebelBackA.__proto__ || Object.getPrototypeOf(RebelBackA)).apply(this, arguments));
    }

    _createClass(RebelBackA, [{
        key: "attachedCallback",
        value: function attachedCallback() {
            var _this7 = this;

            this.addEventListener("click", function (event) {
                var path = _this7.getAttribute("href");
                event.preventDefault();
                if (path !== undefined) {
                    window.dispatchEvent(new CustomEvent('rblback'));
                }
                window.location.hash = path;
            });
        }
    }]);

    return RebelBackA;
}(HTMLAnchorElement);
/**
 * Register the back button custom element
 */


document.registerElement("rebel-back-a", {
    extends: "a",
    prototype: RebelBackA.prototype
});

/**
 * Constructs a route object
 * @param obj - the component name or the HTML template
 * @param route
 * @param regex
 * @param path
 * @returns {{}}
 * @private
 */
function _routeResult(obj, route, regex, path) {
    var result = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            result[key] = obj[key];
        }
    }
    result.route = route;
    result.path = path;
    result.params = RebelRouter.getParamsFromUrl(regex, route, path);
    return result;
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Unique ID creation requires a high quality random # generator.  We feature
// detect to determine the best RNG source, normalizing to a function that
// returns 128-bits of randomness, since that's what's usually required
var rng = __webpack_require__(29);
var bytesToUuid = __webpack_require__(28);

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

// random #'s we need to init node and clockseq
var _seedBytes = rng();

// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
var _nodeId = [_seedBytes[0] | 0x01, _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]];

// Per 4.2.2, randomize (14 bit) clockseq
var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

// Previous uuid creation time
var _lastMSecs = 0,
    _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};

  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  var node = options.node || _nodeId;
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.broadcast = broadcast;

var _notEmpty = __webpack_require__(0);

var _notEmpty2 = _interopRequireDefault(_notEmpty);

var _notPGPPrivkey = __webpack_require__(5);

var _notPGPPrivkey2 = _interopRequireDefault(_notPGPPrivkey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function broadcast(content) {
    return !content ? Promise.reject(new Error('missing content')) : function (gun) {
        return !gun ? Promise.reject(new Error('missing gundb')) : function (openpgp) {
            return !openpgp ? Promise.reject(new Error('missing openpgp')) : (0, _notEmpty2.default)(content).then(function (content) {
                return (0, _notPGPPrivkey2.default)(content)(openpgp);
            }).then(function (content) {
                return new Promise(function (resolve, reject) {
                    try {
                        var putResult = gun.get('message').put({ message: content });
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                });
            });
        };
    };
}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.handleMessage = handleMessage;

var _decryptPGPMessage = __webpack_require__(7);

var _determineContentType = __webpack_require__(1);

var _savePGPPubkey = __webpack_require__(3);

var PGPPUBKEY = 'PGPPubkey';
var CLEARTEXT = 'cleartext';
var PGPPRIVKEY = 'PGPPrivkey';
var PGPMESSAGE = 'PGPMessage';

function handleMessage(content) {
    return !content ? Promise.resolve('') : function (openpgp) {
        return !openpgp ? Promise.reject('Error: missing openpgp') : function (localStorage) {
            return function (password) {
                return function () {
                    return new Promise(function (resolve, reject) {
                        (0, _determineContentType.determineContentType)(content)(openpgp).then(function (contentType) {
                            console.log(contentType);
                            if (contentType === PGPPUBKEY) {
                                // save to localStorage
                                (0, _savePGPPubkey.savePGPPubkey)(content)(openpgp)(localStorage).then(function (result) {
                                    return resolve(result);
                                }).catch(function (error) {
                                    return reject(error);
                                });
                            } else if (contentType === PGPMESSAGE) {
                                // get PGPKeys, decrypt,  and return
                                (0, _decryptPGPMessage.decryptPGPMessage)(openpgp)(localStorage)(password)(content).then(function (result) {
                                    console.log(result);
                                    resolve(result);
                                }).catch(function (error) {
                                    return reject(error);
                                });
                            } else {
                                resolve();
                            }
                        }).catch(function (err) {
                            return reject(err);
                        });
                    });
                };
            };
        };
    };
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.handlePost = handlePost;

var _broadcastMulti = __webpack_require__(6);

var _encryptCleartextMulti = __webpack_require__(11);

var _determineContentType = __webpack_require__(1);

var _savePGPPubkey = __webpack_require__(3);

var _savePGPPrivkey = __webpack_require__(12);

var PGPPUBKEY = 'PGPPubkey';
var CLEARTEXT = 'cleartext';
var PGPPRIVKEY = 'PGPPrivkey';
var PGPMESSAGE = 'PGPMessage';

function handlePost(content) {
    return !content ? Promise.resolve('') : function (openpgp) {
        return !openpgp ? Promise.reject('Error: missing openpgp') : function (localStorage) {
            return function (password) {
                return function (gundb) {
                    return new Promise(function (resolve, reject) {
                        (0, _determineContentType.determineContentType)(content)(openpgp).then(function (contentType) {
                            if (contentType === CLEARTEXT) {
                                (0, _encryptCleartextMulti.encryptCleartextMulti)(content)(openpgp)(localStorage).then(function (encrypted) {
                                    (0, _broadcastMulti.broadcastMulti)(encrypted)(gundb)(openpgp).then(function (result) {
                                        console.log(result);
                                        resolve(result);
                                    }).catch(function (error) {
                                        return reject(error);
                                    });
                                });
                            }
                            if (contentType === PGPPRIVKEY) {
                                (0, _savePGPPrivkey.savePGPPrivkey)(content)(openpgp)(localStorage).then(function (result) {
                                    return resolve(result);
                                });
                            }
                            if (contentType === PGPPUBKEY) {
                                (0, _savePGPPubkey.savePGPPubkey)(content)(openpgp)(localStorage).then(function (result) {
                                    console.log(result);
                                    resolve(result);
                                });
                            }
                            if (contentType === PGPMESSAGE) {
                                broadcast(content)(gun)(openpgp).then(function (result) {
                                    return resolve(result);
                                });
                            }
                        }).catch(function (err) {
                            return reject(err);
                        });
                    });
                };
            };
        };
    };
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*eslint-env node, mocha, es6 */
/* https://bost.ocks.org/mike/shuffle/ */

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.shuffle = shuffle;
function shuffle(array) {
    return !array ? Promise.reject(new Error('missing array')) : new Promise(function (resolve, reject) {
        try {
            var m = array.length,
                t,
                i;
            while (m) {
                i = Math.floor(Math.random() * m--);
                t = array[m];
                array[m] = array[i];
                array[i] = t;
            }
            resolve(array);
        } catch (error) {
            reject(error);
        }
    });
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var contactPartial = __webpack_require__(35);

var ContactPage = exports.ContactPage = function (_HTMLElement) {
    _inherits(ContactPage, _HTMLElement);

    function ContactPage() {
        _classCallCheck(this, ContactPage);

        return _possibleConstructorReturn(this, (ContactPage.__proto__ || Object.getPrototypeOf(ContactPage)).apply(this, arguments));
    }

    _createClass(ContactPage, [{
        key: 'attachedCallback',
        value: function attachedCallback() {
            this.innerHTML = '<p>' + contactPartial + '</p>';
        }
    }]);

    return ContactPage;
}(HTMLElement);

document.registerElement("contact-page", ContactPage);

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var freshDeckPartial = __webpack_require__(37);

var DeckPage = exports.DeckPage = function (_HTMLElement) {
    _inherits(DeckPage, _HTMLElement);

    function DeckPage() {
        _classCallCheck(this, DeckPage);

        return _possibleConstructorReturn(this, (DeckPage.__proto__ || Object.getPrototypeOf(DeckPage)).apply(this, arguments));
    }

    _createClass(DeckPage, [{
        key: 'attachedCallback',
        value: function attachedCallback() {
            this.innerHTML = '<p>' + freshDeckPartial + '</p>';
        }
    }]);

    return DeckPage;
}(HTMLElement);

document.registerElement("deck-page", DeckPage);
document.registerElement('playing-card', {
    prototype: Object.create(HTMLElement.prototype, { createdCallback: {
            value: function value() {
                var root = this.createShadowRoot();
                var template = document.querySelector('#' + this.textContent || '#█');
                var clone = document.importNode(template.content, true);
                var colorOverride = this.querySelector('span') ? this.querySelector('span').style.color : null;if (colorOverride) {
                    clone.querySelector('svg').style.fill = this.querySelector('span').style.color;
                };root.appendChild(clone);
            }
        }
    })
});

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var indexPartial = __webpack_require__(38);

var IndexPage = exports.IndexPage = function (_HTMLElement) {
    _inherits(IndexPage, _HTMLElement);

    function IndexPage() {
        _classCallCheck(this, IndexPage);

        return _possibleConstructorReturn(this, (IndexPage.__proto__ || Object.getPrototypeOf(IndexPage)).apply(this, arguments));
    }

    _createClass(IndexPage, [{
        key: "attachedCallback",
        value: function attachedCallback() {
            this.innerHTML = "\n        <p>" + indexPartial + "</p>\n        ";
        }
    }]);

    return IndexPage;
}(HTMLElement);

document.registerElement("index-page", IndexPage);

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var clientPubkeyFormPartial = __webpack_require__(39);

var MessagePage = exports.MessagePage = function (_HTMLElement) {
    _inherits(MessagePage, _HTMLElement);

    function MessagePage() {
        _classCallCheck(this, MessagePage);

        return _possibleConstructorReturn(this, (MessagePage.__proto__ || Object.getPrototypeOf(MessagePage)).apply(this, arguments));
    }

    _createClass(MessagePage, [{
        key: "attachedCallback",
        value: function attachedCallback() {
            this.innerHTML = "\n            <p>" + clientPubkeyFormPartial + "</p>\n        ";
        }
    }]);

    return MessagePage;
}(HTMLElement);

document.registerElement("message-page", MessagePage);

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var feltPartial = __webpack_require__(36);

var PlayPage = exports.PlayPage = function (_HTMLElement) {
    _inherits(PlayPage, _HTMLElement);

    function PlayPage() {
        _classCallCheck(this, PlayPage);

        return _possibleConstructorReturn(this, (PlayPage.__proto__ || Object.getPrototypeOf(PlayPage)).apply(this, arguments));
    }

    _createClass(PlayPage, [{
        key: 'attachedCallback',
        value: function attachedCallback() {
            this.innerHTML = '<p>' + feltPartial + '</p>';
        }
    }]);

    return PlayPage;
}(HTMLElement);

document.registerElement("play-page", PlayPage);

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var roadmapPartial = __webpack_require__(40);

var RoadmapPage = exports.RoadmapPage = function (_HTMLElement) {
    _inherits(RoadmapPage, _HTMLElement);

    function RoadmapPage() {
        _classCallCheck(this, RoadmapPage);

        return _possibleConstructorReturn(this, (RoadmapPage.__proto__ || Object.getPrototypeOf(RoadmapPage)).apply(this, arguments));
    }

    _createClass(RoadmapPage, [{
        key: 'attachedCallback',
        value: function attachedCallback() {
            this.innerHTML = '<p>' + roadmapPartial + '</p>';
        }
    }]);

    return RoadmapPage;
}(HTMLElement);

document.registerElement("roadmap-page", RoadmapPage);

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
var rng;

var crypto = global.crypto || global.msCrypto; // for IE 11
if (crypto && crypto.getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16);
  rng = function whatwgRNG() {
    crypto.getRandomValues(rnds8);
    return rnds8;
  };
}

if (!rng) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);
  rng = function rng() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

module.exports = rng;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function () {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//import 'webcomponents.js/webcomponents.js';
//uncomment line above to double app size and support ios.

var _handleMessage = __webpack_require__(19);

var _handlePost = __webpack_require__(20);

var _determineContentType = __webpack_require__(1);

var _determineKeyType = __webpack_require__(9);

var _encryptCleartextMulti = __webpack_require__(11);

var _encryptClearText = __webpack_require__(10);

var _decryptPGPMessage = __webpack_require__(7);

var _savePGPPubkey = __webpack_require__(3);

var _savePGPPrivkey = __webpack_require__(12);

var _getFromStorage = __webpack_require__(2);

var _decryptPGPMessageWithKey = __webpack_require__(8);

var _shuffle = __webpack_require__(21);

var _broadcast = __webpack_require__(18);

var _broadcastMulti = __webpack_require__(6);

var _rebelRouter = __webpack_require__(16);

var _gun = __webpack_require__(15);

var _index = __webpack_require__(24);

var _roadmap = __webpack_require__(27);

var _contact = __webpack_require__(22);

var _message = __webpack_require__(25);

var _play = __webpack_require__(26);

var _deck = __webpack_require__(23);

var uuidv1 = __webpack_require__(17);
window.uuidv1 = uuidv1;

window.handleMessage = _handleMessage.handleMessage;

window.handlePost = _handlePost.handlePost;

window.determineContentType = _determineContentType.determineContentType;

window.determineKeyType = _determineKeyType.determineKeyType;

window.encryptCleartextMulti = _encryptCleartextMulti.encryptCleartextMulti;

window.encryptClearText = _encryptClearText.encryptClearText;

window.decryptPGPMessage = _decryptPGPMessage.decryptPGPMessage;

window.savePGPPubkey = _savePGPPubkey.savePGPPubkey;

window.savePGPPrivkey = _savePGPPrivkey.savePGPPrivkey;

window.getFromStorage = _getFromStorage.getFromStorage;

window.decryptPGPMessageWithKey = _decryptPGPMessageWithKey.decryptPGPMessageWithKey;

window.shuffle = _shuffle.shuffle;

window.broadcast = _broadcast.broadcast;

window.broadcastMulti = _broadcastMulti.broadcastMulti;

// rebel router


// Gundb public facing DAG database  (for messages to and from the enemy)


// pages (most of this should be in views/partials to affect isormorphism)

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = notPGPKey;

var _notEmpty = __webpack_require__(0);

var _notEmpty2 = _interopRequireDefault(_notEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function notPGPKey(content) {
    return !content ? function () {
        return (0, _notEmpty2.default)(content);
    } : function (openpgp) {
        return !openpgp ? Promise.reject(new Error('missing openpgp')) : new Promise(function (resolve, reject) {
            var possiblepgpkey = openpgp.key.readArmored(content);
            if (possiblepgpkey.keys[0]) {
                reject(new Error('PGP key'));
            } else {
                resolve(content);
            }
        });
    };
};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = notPGPMessage;

var _notEmpty = __webpack_require__(0);

var _notEmpty2 = _interopRequireDefault(_notEmpty);

var _notCleartext = __webpack_require__(14);

var _notCleartext2 = _interopRequireDefault(_notCleartext);

var _notPGPKey = __webpack_require__(32);

var _notPGPKey2 = _interopRequireDefault(_notPGPKey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function notPGPMessage(content) {
    return !content ? function () {
        return (0, _notEmpty2.default)(content);
    } : function (openpgp) {
        return !openpgp ? Promise.reject(new Error('missing openpgp')) : new Promise(function (resolve, reject) {
            try {
                (0, _notCleartext2.default)(content)(openpgp).then(function () {
                    return (0, _notPGPKey2.default)(content)(openpgp);
                }).then(function () {
                    resolve(content);
                }).catch(function (error) {
                    resolve(content);
                });
            } catch (err) {
                reject(new Error('PGPMessage content'));
            }
        });
    };
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = notUndefined;
function notUndefined(content) {
    return new Promise(function (resolve, reject) {
        try {
            if (typeof content.toString() !== 'undefined') {
                resolve(content);
            }
        } catch (err) {
            reject(new Error('undefined content'));
        }
    });
};

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = "<span class=\"contact\">\n    Cole Albon<br>\n    <a href=\"tel:+14156721648\">(415) 672-1648</a><br>\n    <a href=\"mailto:cole.albon@gmail.com\">cole.albon@gmail.com</a><br>\n    <a href=\"https://github.com/colealbon\">https://github.com/colealbon</a><br>\n    <a href=\"https://www.linkedin.com/in/cole-albon-5934634\">\n        <span id=\"linkedinaddress\" class=\"linkedinaddress\">https://www.linkedin.com/in/cole-albon-5934634</span>\n    </a><br>\n</span>\n"

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = "    <div id=\"felt\" class=\"felt\">\n    <table style=\"border-width:1px\">\n    <tr width=\"100%\">\n        <td><span id='#card00' style=\"color:black\">&spades;A</span></td>\n        <td><span id='#card01' style=\"color:black\">&spades;2</span></td>\n        <td><span id='#card02' style=\"color:black\">&spades;3</span></td>\n        <td><span id='#card03' style=\"color:black\">&spades;4</span></td>\n        <td><span id='#card04' style=\"color:black\">&spades;5</span></td>\n        <td><span id='#card05' style=\"color:black\">&spades;6</span></td>\n        <td><span id='#card06' style=\"color:black\">&spades;7</span></td>\n        <td><span id='#card07' style=\"color:black\">&spades;8</span></td>\n        <td><span id='#card08' style=\"color:black\">&spades;9</span></td>\n        <td><span id='#card09' style=\"color:black\">&spades;10</span></td>\n        <td><span id='#card10' style=\"color:black\">&spades;J</span></td>\n        <td><span id='#card11' style=\"color:black\">&spades;Q</span></td>\n        <td><span id='#card12' style=\"color:black\">&spades;K</span></td>\n    </tr>\n    <tr>\n        <td><span id='#card13' style=\"color:red\">&hearts;A</span></td>\n        <td><span id='#card14' style=\"color:red\">&hearts;2</span></td>\n        <td><span id='#card15' style=\"color:red\">&hearts;3</span></td>\n        <td><span id='#card16' style=\"color:red\">&hearts;4</span></td>\n        <td><span id='#card17' style=\"color:red\">&hearts;5</span></td>\n        <td><span id='#card18' style=\"color:red\">&hearts;6</span></td>\n        <td><span id='#card19' style=\"color:red\">&hearts;7</span></td>\n        <td><span id='#card20' style=\"color:red\">&hearts;8</span></td>\n        <td><span id='#card21' style=\"color:red\">&hearts;9</span></td>\n        <td><span id='#card22' style=\"color:red\">&hearts;10</span></td>\n        <td><span id='#card23' style=\"color:red\">&hearts;J</span></td>\n        <td><span id='#card24' style=\"color:red\">&hearts;Q</span></td>\n        <td><span id='#card25' style=\"color:red\">&hearts;K</span></td>\n    </tr>\n    <tr>\n        <td><span id='#card26' style=\"color:red\">&diams;A</span></td>\n        <td><span id='#card27' style=\"color:red\">&diams;2</span></td>\n        <td><span id='#card28' style=\"color:red\">&diams;3</span></td>\n        <td><span id='#card29' style=\"color:red\">&diams;4</span></td>\n        <td><span id='#card30' style=\"color:red\">&diams;5</span></td>\n        <td><span id='#card31' style=\"color:red\">&diams;6</span></td>\n        <td><span id='#card32' style=\"color:red\">&diams;7</span></td>\n        <td><span id='#card33' style=\"color:red\">&diams;8</span></td>\n        <td><span id='#card34' style=\"color:red\">&diams;9</span></td>\n        <td><span id='#card35' style=\"color:red\">&diams;10</span></td>\n        <td><span id='#card36' style=\"color:red\">&diams;J</span></td>\n        <td><span id='#card37' style=\"color:red\">&diams;Q</span></td>\n        <td><span id='#card38' style=\"color:red\">&diams;K</span></td>\n    </tr>\n    <tr>\n        <td><span id='#card39' style=\"color:black\">&clubs;A</span></td>\n        <td><span id='#card40' style=\"color:black\">&clubs;2</span></td>\n        <td><span id='#card41' style=\"color:black\">&clubs;3</span></td>\n        <td><span id='#card42' style=\"color:black\">&clubs;4</span></td>\n        <td><span id='#card43' style=\"color:black\">&clubs;5</span></td>\n        <td><span id='#card44' style=\"color:black\">&clubs;6</span></td>\n        <td><span id='#card45' style=\"color:black\">&clubs;7</span></td>\n        <td><span id='#card46' style=\"color:black\">&clubs;8</span></td>\n        <td><span id='#card47' style=\"color:black\">&clubs;9</span></td>\n        <td><span id='#card48' style=\"color:black\">&clubs;10</span></td>\n        <td><span id='#card49' style=\"color:black\">&clubs;J</span></td>\n        <td><span id='#card50' style=\"color:black\">&clubs;Q</span></td>\n        <td><span id='#card51' style=\"color:black\">&clubs;K</span></td>\n    </tr>\n</table>\n    <button onclick=\"\n        function zeroPad(num, places) {\n            var zero = places - num.toString().length + 1;\n            return Array(+(zero > 0 && zero)).join('0') + num;\n        };\n        let freshdeck = {\n        '🂡': {'suit': '♠', 'face': 'A', 'html': '&spades;A', 'color': 'black'},\n        '🂢': {'suit': '♠', 'face': '2', 'html': '&spades;2', 'color': 'black'},\n        '🂣': {'suit': '♠', 'face': '3', 'html': '&spades;3', 'color': 'black'},\n        '🂤': {'suit': '♠', 'face': '4', 'html': '&spades;4', 'color': 'black'},\n        '🂥': {'suit': '♠', 'face': '5', 'html': '&spades;5', 'color': 'black'},\n        '🂦': {'suit': '♠', 'face': '6', 'html': '&spades;6', 'color': 'black'},\n        '🂧': {'suit': '♠', 'face': '7', 'html': '&spades;7', 'color': 'black'},\n        '🂨': {'suit': '♠', 'face': '8', 'html': '&spades;8', 'color': 'black'},\n        '🂩': {'suit': '♠', 'face': '9', 'html': '&spades;9', 'color': 'black'},\n        '🂪': {'suit': '♠', 'face': '10', 'html': '&spades;10', 'color': 'black'},\n        '🂫': {'suit': '♠', 'face': 'J', 'html': '&spades;J', 'color': 'black'},\n        '🂭': {'suit': '♠', 'face': 'Q', 'html': '&spades;Q', 'color': 'black'},\n        '🂮': {'suit': '♠', 'face': 'K', 'html': '&spades;K', 'color': 'black'},\n        '🂱': {'suit': '♥', 'face': 'A', 'html': '&hearts;A', 'color': 'red'},\n        '🂲': {'suit': '♥', 'face': '2', 'html': '&hearts;2', 'color': 'red'},\n        '🂳': {'suit': '♥', 'face': '3', 'html': '&hearts;3', 'color': 'red'},\n        '🂴': {'suit': '♥', 'face': '4', 'html': '&hearts;4', 'color': 'red'},\n        '🂵': {'suit': '♥', 'face': '5', 'html': '&hearts;5', 'color': 'red'},\n        '🂶': {'suit': '♥', 'face': '6', 'html': '&hearts;6', 'color': 'red'},\n        '🂷': {'suit': '♥', 'face': '7', 'html': '&hearts;7', 'color': 'red'},\n        '🂸': {'suit': '♥', 'face': '8', 'html': '&hearts;8', 'color': 'red'},\n        '🂹': {'suit': '♥', 'face': '9', 'html': '&hearts;9', 'color': 'red'},\n        '🂺': {'suit': '♥', 'face': '10', 'html': '&hearts;10', 'color': 'red'},\n        '🂻': {'suit': '♥', 'face': 'J', 'html': '&hearts;J', 'color': 'red'},\n        '🂽': {'suit': '♥', 'face': 'Q', 'html': '&hearts;Q', 'color': 'red'},\n        '🂾': {'suit': '♥', 'face': 'K', 'html': '&hearts;K', 'color': 'red'},\n        '🃁': {'suit': '♦', 'face': 'A', 'html': '&diams;A', 'color': 'red'},\n        '🃂': {'suit': '♦', 'face': '2', 'html': '&diams;2', 'color': 'red'},\n        '🃃': {'suit': '♦', 'face': '3', 'html': '&diams;3', 'color': 'red'},\n        '🃄': {'suit': '♦', 'face': '4', 'html': '&diams;4', 'color': 'red'},\n        '🃅': {'suit': '♦', 'face': '5', 'html': '&diams;5', 'color': 'red'},\n        '🃆': {'suit': '♦', 'face': '6', 'html': '&diams;6', 'color': 'red'},\n        '🃇': {'suit': '♦', 'face': '7', 'html': '&diams;7', 'color': 'red'},\n        '🃈': {'suit': '♦', 'face': '8', 'html': '&diams;8', 'color': 'red'},\n        '🃉': {'suit': '♦', 'face': '9', 'html': '&diams;9', 'color': 'red'},\n        '🃊': {'suit': '♦', 'face': '10', 'html': '&diams;10', 'color': 'red'},\n        '🃋': {'suit': '♦', 'face': 'J', 'html': '&diams;J', 'color': 'red'},\n        '🃍': {'suit': '♦', 'face': 'Q', 'html': '&diams;Q', 'color': 'red'},\n        '🃎': {'suit': '♦', 'face': 'K', 'html': '&diams;K', 'color': 'red'},\n        '🃑': {'suit': '♣', 'face': 'A', 'html': '&clubs;A', 'color': 'black'},\n        '🃒': {'suit': '♣', 'face': '2', 'html': '&clubs;2', 'color': 'black'},\n        '🃓': {'suit': '♣', 'face': '3', 'html': '&clubs;3', 'color': 'black'},\n        '🃔': {'suit': '♣', 'face': '4', 'html': '&clubs;4', 'color': 'black'},\n        '🃕': {'suit': '♣', 'face': '5', 'html': '&clubs;5', 'color': 'black'},\n        '🃖': {'suit': '♣', 'face': '6', 'html': '&clubs;6', 'color': 'black'},\n        '🃗': {'suit': '♣', 'face': '7', 'html': '&clubs;7', 'color': 'black'},\n        '🃘': {'suit': '♣', 'face': '8', 'html': '&clubs;8', 'color': 'black'},\n        '🃙': {'suit': '♣', 'face': '9', 'html': '&clubs;9', 'color': 'black'},\n        '🃚': {'suit': '♣', 'face': '10', 'html': '&clubs;10', 'color': 'black'},\n        '🃛': {'suit': '♣', 'face': 'J', 'html': '&clubs;J', 'color': 'black'},\n        '🃝': {'suit': '♣', 'face': 'Q', 'html': '&clubs;Q', 'color': 'black'},\n        '🃞': {'suit': '♣', 'face': 'K', 'html': '&clubs;K', 'color': 'black'}\n        };\n        shuffle(Object.keys(freshdeck))\n        .then((shuffled) => {\n            return new Promise((resolve, reject) => {\n                try {\n                    let deckPositionidx = 51;\n                    let deckKey = '';\n                    while (deckPositionidx >= 0) {\n                        deckKey = '#card' + zeroPad(deckPositionidx, 2)\n                        document.getElementById(deckKey).innerHTML = freshdeck[shuffled[deckPositionidx]].html\n                        document.getElementById(deckKey).style.color = freshdeck[shuffled[deckPositionidx]].color\n                        deckPositionidx--;\n                        if (deckPositionidx === 0) {\n                            resolve(shuffled);\n                        }\n                    }\n                } catch (err) {\n                    reject(new Error(err));\n                }\n            })\n        })\n        .then((shuffled) => {\n            return new Promise((resolve, reject) => {\n                try {\n                    let deckPositionidx = 51;\n                    encrypting = [];\n                    while (deckPositionidx >= 0) {\n                        encrypting.push(new Promise((resolve, reject) => {\n                            try {\n                                let shuffledCard = Object.assign(freshdeck[shuffled[deckPositionidx]]);\n                                shuffledCard.deckPositionIndex = deckPositionidx;\n                                getFromStorage(localStorage)()\n                                .then((storedItems) => {\n                                    storedItems.map((storedItem) => {\n                                        determineContentType(storedItem)(openpgp)\n                                        .then((contentType) => {\n                                            if (contentType === 'PGPPrivkey') {\n                                                let privateKeys = openpgp.key.readArmored(storedItem);\n                                                let privateKey = privateKeys.keys[0];\n                                                let publicKeyArmor = privateKey.toPublic().armor();\n                                                let shuffledStr = JSON.stringify(shuffledCard)\n                                                encryptClearText(openpgp)(publicKeyArmor)(shuffledStr)\n                                                .then((cipherText) => {\n                                                    resolve(cipherText);\n                                                })\n                                            }\n                                        })\n                                        .catch((err) => reject(err));\n                                    })\n                                })\n                                .catch((TypeError)) // determineContentType not a function\n                                .catch((err) => reject(err));\n                            } catch (err) {\n                                reject(err); // reject this\n                            }\n                        }))\n                        deckPositionidx--;\n                        if (deckPositionidx === 0) {\n                            resolve(encrypting);\n                        }\n                    }\n                } catch (err) {\n                    reject(new Error(err));\n                }\n            })\n        })\n        .then((encrypting) => {\n            return Promise.all(encrypting)\n            .then((encrypted) => {\n                console.log(encrypted);\n                return(encrypted);\n            })\n        })\n        .catch(function (err) {\n            alert(`error: ${err}`);\n            console.log(`error: ${err}`);\n        })\n    \">shuffle and encrypt</button>\n\n</div>\n"

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = "    <div id=\"deck\" class=\"deck\">\n    <template id=\"█\"><svg viewBox=\"24 62 247 343\"><path d=\"M61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM70.3125 362.25 L70.3125 110.1094 L224.2969 110.1094 L224.2969 362.25 L70.3125 362.25 Z\"/></svg></template>\n    <template id=\"♠A\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.6719 115.7344 L91.8281 175.7812 L129.5156 175.7812 L110.6719 115.7344 ZM99.9844 101.6719 L121.6406 101.6719 L162.1406 219.2344 L143.5781 219.2344 L134.0156 188.5781 L87.6094 188.5781 L78.0469 219.2344 L59.4844 219.2344 L99.9844 101.6719 Z\"/></svg></template>\n    <template id=\"♠2\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM86.3438 203.0625 L145.9688 203.0625 L145.9688 219.0938 L61.875 219.0938 L61.875 203.625 Q66.6562 199.2656 75.5156 191.3906 Q123.8906 148.5 123.8906 135.2812 Q123.8906 126 116.5781 120.3047 Q109.2656 114.6094 97.3125 114.6094 Q90 114.6094 81.4219 117.0703 Q72.8438 119.5312 62.7188 124.4531 L62.7188 107.1562 Q73.5469 103.2188 82.8984 101.25 Q92.25 99.2812 100.2656 99.2812 Q120.6562 99.2812 132.8906 108.5625 Q145.125 117.8438 145.125 133.0312 Q145.125 152.5781 98.5781 192.5156 Q90.7031 199.2656 86.3438 203.0625 Z\"/></svg></template>\n    <template id=\"♠3\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM121.7812 155.5312 Q134.7188 158.0625 141.8203 165.7266 Q148.9219 173.3906 148.9219 184.9219 Q148.9219 202.3594 135.5625 211.7812 Q122.2031 221.2031 97.3125 221.2031 Q89.2969 221.2031 80.5078 219.7266 Q71.7188 218.25 61.875 215.4375 L61.875 198.4219 Q69.1875 202.2188 77.5547 204.0469 Q85.9219 205.875 95.3438 205.875 Q110.6719 205.875 119.1094 200.3203 Q127.5469 194.7656 127.5469 184.9219 Q127.5469 174.5156 119.7422 169.1719 Q111.9375 163.8281 96.75 163.8281 L84.6562 163.8281 L84.6562 148.6406 L97.875 148.6406 Q111.0938 148.6406 117.9141 144.2109 Q124.7344 139.7812 124.7344 131.3438 Q124.7344 123.1875 117.7031 118.8984 Q110.6719 114.6094 97.3125 114.6094 Q91.6875 114.6094 84.5156 115.875 Q77.3438 117.1406 65.9531 120.375 L65.9531 104.2031 Q76.2188 101.8125 85.2188 100.5469 Q94.2188 99.2812 101.9531 99.2812 Q122.2031 99.2812 134.0859 107.5781 Q145.9688 115.875 145.9688 129.7969 Q145.9688 139.5 139.6406 146.25 Q133.3125 153 121.7812 155.5312 Z\"/></svg></template>\n    <template id=\"♠4\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM120.0938 118.6875 L76.6406 177.6094 L120.0938 177.6094 L120.0938 118.6875 ZM117 101.6719 L140.3438 101.6719 L140.3438 177.6094 L159.3281 177.6094 L159.3281 192.9375 L140.3438 192.9375 L140.3438 219.0938 L120.0938 219.0938 L120.0938 192.9375 L61.875 192.9375 L61.875 175.9219 L117 101.6719 Z\"/></svg></template>\n    <template id=\"♠5\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM67.5 101.6719 L139.2188 101.6719 L139.2188 115.0312 L84.2344 115.0312 L84.2344 143.7188 Q88.1719 142.4531 92.25 141.8906 Q96.1875 141.3281 100.125 141.3281 Q122.7656 141.3281 135.9844 152.1562 Q149.2031 162.8438 149.2031 181.2656 Q149.2031 200.25 135.5625 210.7969 Q122.0625 221.2031 97.3125 221.2031 Q88.875 221.2031 80.0156 219.9375 Q71.1562 218.6719 61.875 216.1406 L61.875 200.25 Q69.8906 204.0469 78.6094 206.0156 Q87.3281 207.8438 97.0312 207.8438 Q112.6406 207.8438 121.7812 200.6719 Q130.9219 193.5 130.9219 181.2656 Q130.9219 169.0312 121.7812 161.8594 Q112.6406 154.6875 97.0312 154.6875 Q89.7188 154.6875 82.4062 156.0938 Q75.0938 157.5 67.5 160.4531 L67.5 101.6719 Z\"/></svg></template>\n    <template id=\"♠6\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.1094 153.7031 Q97.7344 153.7031 90.5625 161.0156 Q83.3906 168.4688 83.3906 181.2656 Q83.3906 193.9219 90.5625 201.2344 Q97.7344 208.6875 110.1094 208.6875 Q122.3438 208.6875 129.5156 201.2344 Q136.6875 193.9219 136.6875 181.2656 Q136.6875 168.4688 129.5156 161.0156 Q122.3438 153.7031 110.1094 153.7031 ZM146.3906 103.9219 L146.3906 118.4062 Q139.5 115.5938 132.4688 114.1875 Q125.4375 112.6406 118.5469 112.6406 Q100.5469 112.6406 90.9844 123.1875 Q81.4219 133.875 80.0156 155.3906 Q85.3594 148.5 93.375 144.8438 Q101.5312 141.1875 111.0938 141.1875 Q131.4844 141.1875 143.2969 151.875 Q155.1094 162.7031 155.1094 181.2656 Q155.1094 199.125 142.7344 210.2344 Q130.5 221.2031 110.1094 221.2031 Q86.625 221.2031 74.25 205.5938 Q61.875 189.9844 61.875 160.1719 Q61.875 132.3281 77.0625 115.875 Q92.25 99.2812 117.8438 99.2812 Q124.7344 99.2812 131.7656 100.4062 Q138.7969 101.6719 146.3906 103.9219 Z\"/></svg></template>\n    <template id=\"♠7\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L148.6406 101.6719 L148.6406 108.4219 L99.7031 219.0938 L80.5781 219.0938 L126.7031 115.0312 L61.875 115.0312 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♠8\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM108.2812 163.125 Q95.2031 163.125 87.75 169.3125 Q80.2969 175.3594 80.2969 185.9062 Q80.2969 196.5938 87.75 202.6406 Q95.2031 208.6875 108.2812 208.6875 Q121.2188 208.6875 128.8125 202.5 Q136.2656 196.4531 136.2656 185.9062 Q136.2656 175.3594 128.8125 169.3125 Q121.3594 163.125 108.2812 163.125 ZM90 156.2344 Q78.1875 153.7031 71.7188 146.8125 Q65.1094 139.7812 65.1094 129.6562 Q65.1094 115.5938 76.6406 107.4375 Q88.1719 99.2812 108.2812 99.2812 Q128.3906 99.2812 139.9219 107.4375 Q151.3125 115.5938 151.3125 129.6562 Q151.3125 140.0625 144.8438 146.8125 Q138.2344 153.7031 126.5625 156.2344 Q139.2188 158.7656 147.0938 166.9219 Q154.5469 174.6562 154.5469 185.9062 Q154.5469 202.9219 142.5938 212.0625 Q130.5 221.2031 108.2812 221.2031 Q85.9219 221.2031 73.9688 212.0625 Q61.875 202.9219 61.875 185.9062 Q61.875 174.9375 69.3281 166.9219 Q76.9219 159.0469 90 156.2344 ZM83.25 131.2031 Q83.25 140.0625 89.8594 145.4062 Q96.3281 150.6094 108.2812 150.6094 Q119.6719 150.6094 126.5625 145.4062 Q133.3125 140.3438 133.3125 131.2031 Q133.3125 122.3438 126.5625 117 Q119.9531 111.7969 108.2812 111.7969 Q96.6094 111.7969 89.8594 117 Q83.25 122.0625 83.25 131.2031 Z\"/></svg></template>\n    <template id=\"♠9\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM70.5938 216.5625 L70.5938 202.0781 Q77.4844 204.8906 84.5156 206.4375 Q91.5469 207.8438 98.2969 207.8438 Q116.4375 207.8438 126 197.2969 Q135.4219 186.75 136.8281 165.0938 Q131.9062 171.7031 123.4688 175.5 Q115.4531 179.1562 105.75 179.1562 Q85.5 179.1562 73.6875 168.4688 Q61.875 157.7812 61.875 139.2188 Q61.875 121.0781 74.1094 110.25 Q86.4844 99.2812 106.875 99.2812 Q130.3594 99.2812 142.5938 114.8906 Q154.9688 130.5 154.9688 160.3125 Q154.9688 188.1562 139.9219 204.6094 Q124.7344 221.2031 99.1406 221.2031 Q92.25 221.2031 85.2188 220.0781 Q78.1875 218.8125 70.5938 216.5625 ZM106.875 166.7812 Q119.25 166.7812 126.4219 159.4688 Q133.5938 152.1562 133.5938 139.2188 Q133.5938 126.5625 126.4219 119.25 Q119.25 111.7969 106.875 111.7969 Q94.9219 111.7969 87.4688 119.25 Q80.1562 126.5625 80.1562 139.2188 Q80.1562 152.1562 87.4688 159.4688 Q94.6406 166.7812 106.875 166.7812 Z\"/></svg></template>\n    <template id=\"♠10\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM159.0469 111.7969 Q149.0625 111.7969 142.0312 123.8906 Q134.8594 135.9844 134.8594 160.1719 Q134.8594 184.5 142.0312 196.5938 Q149.0625 208.6875 159.0469 208.6875 Q169.0312 208.6875 176.0625 196.5938 Q183.2344 184.5 183.2344 160.1719 Q183.2344 135.9844 176.0625 123.8906 Q169.0312 111.7969 159.0469 111.7969 ZM159.0469 99.2812 Q177.4688 99.2812 189.4219 114.8906 Q201.375 130.5 201.375 160.1719 Q201.375 189.9844 189.4219 205.5938 Q177.4688 221.2031 159.0469 221.2031 Q136.2656 221.2031 126.4219 205.5938 Q116.5781 189.9844 116.5781 160.1719 Q116.5781 130.5 126.4219 114.8906 Q136.2656 99.2812 159.0469 99.2812 ZM80.5781 219.0938 L80.5781 117.7031 L61.875 123.4688 L61.875 107.1562 L81.5625 101.6719 L100.8281 101.6719 L100.8281 219.0938 L80.5781 219.0938 Z\"/></svg></template>\n    <template id=\"♠J\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM89.1562 101.6719 L107.0156 101.6719 L107.0156 178.7344 Q107.0156 199.6875 97.875 209.5312 Q88.875 219.2344 68.7656 219.2344 L61.875 219.2344 L61.875 205.7344 L67.5 205.7344 Q79.3125 205.7344 84.2344 199.8281 Q89.1562 193.9219 89.1562 178.7344 L89.1562 101.6719 Z\"/></svg></template>\n    <template id=\"♠Q\"><svg viewBox=\"24 62 247 343\"><path d=\"M107.2969 221.0625 Q106.7344 221.0625 105.5391 221.1328 Q104.3438 221.2031 103.6406 221.2031 Q81.4219 221.2031 70.5234 206.0859 Q59.625 190.9688 59.625 160.3125 Q59.625 129.5156 70.5938 114.3984 Q81.5625 99.2812 103.7812 99.2812 Q126.1406 99.2812 137.1094 114.3984 Q148.0781 129.5156 148.0781 160.3125 Q148.0781 183.5156 142.0312 197.6484 Q135.9844 211.7812 123.6094 217.4062 L141.3281 232.3125 L127.9688 240.1875 L107.2969 221.0625 ZM129.375 160.3125 Q129.375 134.4375 123.3984 123.3281 Q117.4219 112.2188 103.7812 112.2188 Q90.2812 112.2188 84.3047 123.3281 Q78.3281 134.4375 78.3281 160.3125 Q78.3281 186.1875 84.3047 197.2969 Q90.2812 208.4062 103.7812 208.4062 Q117.4219 208.4062 123.3984 197.2969 Q129.375 186.1875 129.375 160.3125 ZM174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 Z\"/></svg></template>\n    <template id=\"♠K\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L79.7344 101.6719 L79.7344 151.3125 L130.6406 101.6719 L153.7031 101.6719 L96.4688 156.5156 L158.3438 219.2344 L134.8594 219.2344 L79.7344 162.5625 L79.7344 219.2344 L61.875 219.2344 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♥A\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.6719 115.7344 L91.8281 175.7812 L129.5156 175.7812 L110.6719 115.7344 ZM99.9844 101.6719 L121.6406 101.6719 L162.1406 219.2344 L143.5781 219.2344 L134.0156 188.5781 L87.6094 188.5781 L78.0469 219.2344 L59.4844 219.2344 L99.9844 101.6719 Z\"/></svg></template>\n    <template id=\"♥2\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM86.3438 203.0625 L145.9688 203.0625 L145.9688 219.0938 L61.875 219.0938 L61.875 203.625 Q66.6562 199.2656 75.5156 191.3906 Q123.8906 148.5 123.8906 135.2812 Q123.8906 126 116.5781 120.3047 Q109.2656 114.6094 97.3125 114.6094 Q90 114.6094 81.4219 117.0703 Q72.8438 119.5312 62.7188 124.4531 L62.7188 107.1562 Q73.5469 103.2188 82.8984 101.25 Q92.25 99.2812 100.2656 99.2812 Q120.6562 99.2812 132.8906 108.5625 Q145.125 117.8438 145.125 133.0312 Q145.125 152.5781 98.5781 192.5156 Q90.7031 199.2656 86.3438 203.0625 Z\"/></svg></template>\n    <template id=\"♥3\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM121.7812 155.5312 Q134.7188 158.0625 141.8203 165.7266 Q148.9219 173.3906 148.9219 184.9219 Q148.9219 202.3594 135.5625 211.7812 Q122.2031 221.2031 97.3125 221.2031 Q89.2969 221.2031 80.5078 219.7266 Q71.7188 218.25 61.875 215.4375 L61.875 198.4219 Q69.1875 202.2188 77.5547 204.0469 Q85.9219 205.875 95.3438 205.875 Q110.6719 205.875 119.1094 200.3203 Q127.5469 194.7656 127.5469 184.9219 Q127.5469 174.5156 119.7422 169.1719 Q111.9375 163.8281 96.75 163.8281 L84.6562 163.8281 L84.6562 148.6406 L97.875 148.6406 Q111.0938 148.6406 117.9141 144.2109 Q124.7344 139.7812 124.7344 131.3438 Q124.7344 123.1875 117.7031 118.8984 Q110.6719 114.6094 97.3125 114.6094 Q91.6875 114.6094 84.5156 115.875 Q77.3438 117.1406 65.9531 120.375 L65.9531 104.2031 Q76.2188 101.8125 85.2188 100.5469 Q94.2188 99.2812 101.9531 99.2812 Q122.2031 99.2812 134.0859 107.5781 Q145.9688 115.875 145.9688 129.7969 Q145.9688 139.5 139.6406 146.25 Q133.3125 153 121.7812 155.5312 Z\"/></svg></template>\n    <template id=\"♥4\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM120.0938 118.6875 L76.6406 177.6094 L120.0938 177.6094 L120.0938 118.6875 ZM117 101.6719 L140.3438 101.6719 L140.3438 177.6094 L159.3281 177.6094 L159.3281 192.9375 L140.3438 192.9375 L140.3438 219.0938 L120.0938 219.0938 L120.0938 192.9375 L61.875 192.9375 L61.875 175.9219 L117 101.6719 Z\"/></svg></template>\n    <template id=\"♥5\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM67.5 101.6719 L139.2188 101.6719 L139.2188 115.0312 L84.2344 115.0312 L84.2344 143.7188 Q88.1719 142.4531 92.25 141.8906 Q96.1875 141.3281 100.125 141.3281 Q122.7656 141.3281 135.9844 152.1562 Q149.2031 162.8438 149.2031 181.2656 Q149.2031 200.25 135.5625 210.7969 Q122.0625 221.2031 97.3125 221.2031 Q88.875 221.2031 80.0156 219.9375 Q71.1562 218.6719 61.875 216.1406 L61.875 200.25 Q69.8906 204.0469 78.6094 206.0156 Q87.3281 207.8438 97.0312 207.8438 Q112.6406 207.8438 121.7812 200.6719 Q130.9219 193.5 130.9219 181.2656 Q130.9219 169.0312 121.7812 161.8594 Q112.6406 154.6875 97.0312 154.6875 Q89.7188 154.6875 82.4062 156.0938 Q75.0938 157.5 67.5 160.4531 L67.5 101.6719 Z\"/></svg></template>\n    <template id=\"♥6\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.1094 153.7031 Q97.7344 153.7031 90.5625 161.0156 Q83.3906 168.4688 83.3906 181.2656 Q83.3906 193.9219 90.5625 201.2344 Q97.7344 208.6875 110.1094 208.6875 Q122.3438 208.6875 129.5156 201.2344 Q136.6875 193.9219 136.6875 181.2656 Q136.6875 168.4688 129.5156 161.0156 Q122.3438 153.7031 110.1094 153.7031 ZM146.3906 103.9219 L146.3906 118.4062 Q139.5 115.5938 132.4688 114.1875 Q125.4375 112.6406 118.5469 112.6406 Q100.5469 112.6406 90.9844 123.1875 Q81.4219 133.875 80.0156 155.3906 Q85.3594 148.5 93.375 144.8438 Q101.5312 141.1875 111.0938 141.1875 Q131.4844 141.1875 143.2969 151.875 Q155.1094 162.7031 155.1094 181.2656 Q155.1094 199.125 142.7344 210.2344 Q130.5 221.2031 110.1094 221.2031 Q86.625 221.2031 74.25 205.5938 Q61.875 189.9844 61.875 160.1719 Q61.875 132.3281 77.0625 115.875 Q92.25 99.2812 117.8438 99.2812 Q124.7344 99.2812 131.7656 100.4062 Q138.7969 101.6719 146.3906 103.9219 Z\"/></svg></template>\n    <template id=\"♥7\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L148.6406 101.6719 L148.6406 108.4219 L99.7031 219.0938 L80.5781 219.0938 L126.7031 115.0312 L61.875 115.0312 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♥8\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM108.2812 163.125 Q95.2031 163.125 87.75 169.3125 Q80.2969 175.3594 80.2969 185.9062 Q80.2969 196.5938 87.75 202.6406 Q95.2031 208.6875 108.2812 208.6875 Q121.2188 208.6875 128.8125 202.5 Q136.2656 196.4531 136.2656 185.9062 Q136.2656 175.3594 128.8125 169.3125 Q121.3594 163.125 108.2812 163.125 ZM90 156.2344 Q78.1875 153.7031 71.7188 146.8125 Q65.1094 139.7812 65.1094 129.6562 Q65.1094 115.5938 76.6406 107.4375 Q88.1719 99.2812 108.2812 99.2812 Q128.3906 99.2812 139.9219 107.4375 Q151.3125 115.5938 151.3125 129.6562 Q151.3125 140.0625 144.8438 146.8125 Q138.2344 153.7031 126.5625 156.2344 Q139.2188 158.7656 147.0938 166.9219 Q154.5469 174.6562 154.5469 185.9062 Q154.5469 202.9219 142.5938 212.0625 Q130.5 221.2031 108.2812 221.2031 Q85.9219 221.2031 73.9688 212.0625 Q61.875 202.9219 61.875 185.9062 Q61.875 174.9375 69.3281 166.9219 Q76.9219 159.0469 90 156.2344 ZM83.25 131.2031 Q83.25 140.0625 89.8594 145.4062 Q96.3281 150.6094 108.2812 150.6094 Q119.6719 150.6094 126.5625 145.4062 Q133.3125 140.3438 133.3125 131.2031 Q133.3125 122.3438 126.5625 117 Q119.9531 111.7969 108.2812 111.7969 Q96.6094 111.7969 89.8594 117 Q83.25 122.0625 83.25 131.2031 Z\"/></svg></template>\n    <template id=\"♥9\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM70.5938 216.5625 L70.5938 202.0781 Q77.4844 204.8906 84.5156 206.4375 Q91.5469 207.8438 98.2969 207.8438 Q116.4375 207.8438 126 197.2969 Q135.4219 186.75 136.8281 165.0938 Q131.9062 171.7031 123.4688 175.5 Q115.4531 179.1562 105.75 179.1562 Q85.5 179.1562 73.6875 168.4688 Q61.875 157.7812 61.875 139.2188 Q61.875 121.0781 74.1094 110.25 Q86.4844 99.2812 106.875 99.2812 Q130.3594 99.2812 142.5938 114.8906 Q154.9688 130.5 154.9688 160.3125 Q154.9688 188.1562 139.9219 204.6094 Q124.7344 221.2031 99.1406 221.2031 Q92.25 221.2031 85.2188 220.0781 Q78.1875 218.8125 70.5938 216.5625 ZM106.875 166.7812 Q119.25 166.7812 126.4219 159.4688 Q133.5938 152.1562 133.5938 139.2188 Q133.5938 126.5625 126.4219 119.25 Q119.25 111.7969 106.875 111.7969 Q94.9219 111.7969 87.4688 119.25 Q80.1562 126.5625 80.1562 139.2188 Q80.1562 152.1562 87.4688 159.4688 Q94.6406 166.7812 106.875 166.7812 Z\"/></svg></template>\n    <template id=\"♥10\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM159.0469 111.7969 Q149.0625 111.7969 142.0312 123.8906 Q134.8594 135.9844 134.8594 160.1719 Q134.8594 184.5 142.0312 196.5938 Q149.0625 208.6875 159.0469 208.6875 Q169.0312 208.6875 176.0625 196.5938 Q183.2344 184.5 183.2344 160.1719 Q183.2344 135.9844 176.0625 123.8906 Q169.0312 111.7969 159.0469 111.7969 ZM159.0469 99.2812 Q177.4688 99.2812 189.4219 114.8906 Q201.375 130.5 201.375 160.1719 Q201.375 189.9844 189.4219 205.5938 Q177.4688 221.2031 159.0469 221.2031 Q136.2656 221.2031 126.4219 205.5938 Q116.5781 189.9844 116.5781 160.1719 Q116.5781 130.5 126.4219 114.8906 Q136.2656 99.2812 159.0469 99.2812 ZM80.5781 219.0938 L80.5781 117.7031 L61.875 123.4688 L61.875 107.1562 L81.5625 101.6719 L100.8281 101.6719 L100.8281 219.0938 L80.5781 219.0938 Z\"/></svg></template>\n    <template id=\"♥J\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM89.1562 101.6719 L107.0156 101.6719 L107.0156 178.7344 Q107.0156 199.6875 97.875 209.5312 Q88.875 219.2344 68.7656 219.2344 L61.875 219.2344 L61.875 205.7344 L67.5 205.7344 Q79.3125 205.7344 84.2344 199.8281 Q89.1562 193.9219 89.1562 178.7344 L89.1562 101.6719 Z\"/></svg></template>\n    <template id=\"♥Q\"><svg viewBox=\"24 62 247 343\"><path d=\"M107.2969 221.0625 Q106.7344 221.0625 105.5391 221.1328 Q104.3438 221.2031 103.6406 221.2031 Q81.4219 221.2031 70.5234 206.0859 Q59.625 190.9688 59.625 160.3125 Q59.625 129.5156 70.5938 114.3984 Q81.5625 99.2812 103.7812 99.2812 Q126.1406 99.2812 137.1094 114.3984 Q148.0781 129.5156 148.0781 160.3125 Q148.0781 183.5156 142.0312 197.6484 Q135.9844 211.7812 123.6094 217.4062 L141.3281 232.3125 L127.9688 240.1875 L107.2969 221.0625 ZM129.375 160.3125 Q129.375 134.4375 123.3984 123.3281 Q117.4219 112.2188 103.7812 112.2188 Q90.2812 112.2188 84.3047 123.3281 Q78.3281 134.4375 78.3281 160.3125 Q78.3281 186.1875 84.3047 197.2969 Q90.2812 208.4062 103.7812 208.4062 Q117.4219 208.4062 123.3984 197.2969 Q129.375 186.1875 129.375 160.3125 ZM172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM64.2656 84.7969 Q47.3906 84.7969 47.3906 101.6719 L47.3906 370.6875 Q47.3906 387.5625 64.2656 387.5625 L235.125 387.5625 Q252 387.5625 252 370.6875 L252 101.6719 Q252 84.7969 235.125 84.7969 L64.2656 84.7969 ZM64.2656 67.9219 L235.125 67.9219 Q268.875 67.9219 268.875 101.6719 L268.875 370.6875 Q268.875 404.4375 235.125 404.4375 L64.2656 404.4375 Q30.5156 404.4375 30.5156 370.6875 L30.5156 101.6719 Q30.5156 67.9219 64.2656 67.9219 Z\"/></svg></template>\n    <template id=\"♥K\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L79.7344 101.6719 L79.7344 151.3125 L130.6406 101.6719 L153.7031 101.6719 L96.4688 156.5156 L158.3438 219.2344 L134.8594 219.2344 L79.7344 162.5625 L79.7344 219.2344 L61.875 219.2344 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♦A\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.6719 115.7344 L91.8281 175.7812 L129.5156 175.7812 L110.6719 115.7344 ZM99.9844 101.6719 L121.6406 101.6719 L162.1406 219.2344 L143.5781 219.2344 L134.0156 188.5781 L87.6094 188.5781 L78.0469 219.2344 L59.4844 219.2344 L99.9844 101.6719 Z\"/></svg></template>\n    <template id=\"♦2\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM86.3438 203.0625 L145.9688 203.0625 L145.9688 219.0938 L61.875 219.0938 L61.875 203.625 Q66.6562 199.2656 75.5156 191.3906 Q123.8906 148.5 123.8906 135.2812 Q123.8906 126 116.5781 120.3047 Q109.2656 114.6094 97.3125 114.6094 Q90 114.6094 81.4219 117.0703 Q72.8438 119.5312 62.7188 124.4531 L62.7188 107.1562 Q73.5469 103.2188 82.8984 101.25 Q92.25 99.2812 100.2656 99.2812 Q120.6562 99.2812 132.8906 108.5625 Q145.125 117.8438 145.125 133.0312 Q145.125 152.5781 98.5781 192.5156 Q90.7031 199.2656 86.3438 203.0625 Z\"/></svg></template>\n    <template id=\"♦3\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM121.7812 155.5312 Q134.7188 158.0625 141.8203 165.7266 Q148.9219 173.3906 148.9219 184.9219 Q148.9219 202.3594 135.5625 211.7812 Q122.2031 221.2031 97.3125 221.2031 Q89.2969 221.2031 80.5078 219.7266 Q71.7188 218.25 61.875 215.4375 L61.875 198.4219 Q69.1875 202.2188 77.5547 204.0469 Q85.9219 205.875 95.3438 205.875 Q110.6719 205.875 119.1094 200.3203 Q127.5469 194.7656 127.5469 184.9219 Q127.5469 174.5156 119.7422 169.1719 Q111.9375 163.8281 96.75 163.8281 L84.6562 163.8281 L84.6562 148.6406 L97.875 148.6406 Q111.0938 148.6406 117.9141 144.2109 Q124.7344 139.7812 124.7344 131.3438 Q124.7344 123.1875 117.7031 118.8984 Q110.6719 114.6094 97.3125 114.6094 Q91.6875 114.6094 84.5156 115.875 Q77.3438 117.1406 65.9531 120.375 L65.9531 104.2031 Q76.2188 101.8125 85.2188 100.5469 Q94.2188 99.2812 101.9531 99.2812 Q122.2031 99.2812 134.0859 107.5781 Q145.9688 115.875 145.9688 129.7969 Q145.9688 139.5 139.6406 146.25 Q133.3125 153 121.7812 155.5312 Z\"/></svg></template>\n    <template id=\"♦4\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM120.0938 118.6875 L76.6406 177.6094 L120.0938 177.6094 L120.0938 118.6875 ZM117 101.6719 L140.3438 101.6719 L140.3438 177.6094 L159.3281 177.6094 L159.3281 192.9375 L140.3438 192.9375 L140.3438 219.0938 L120.0938 219.0938 L120.0938 192.9375 L61.875 192.9375 L61.875 175.9219 L117 101.6719 Z\"/></svg></template>\n    <template id=\"♦5\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM67.5 101.6719 L139.2188 101.6719 L139.2188 115.0312 L84.2344 115.0312 L84.2344 143.7188 Q88.1719 142.4531 92.25 141.8906 Q96.1875 141.3281 100.125 141.3281 Q122.7656 141.3281 135.9844 152.1562 Q149.2031 162.8438 149.2031 181.2656 Q149.2031 200.25 135.5625 210.7969 Q122.0625 221.2031 97.3125 221.2031 Q88.875 221.2031 80.0156 219.9375 Q71.1562 218.6719 61.875 216.1406 L61.875 200.25 Q69.8906 204.0469 78.6094 206.0156 Q87.3281 207.8438 97.0312 207.8438 Q112.6406 207.8438 121.7812 200.6719 Q130.9219 193.5 130.9219 181.2656 Q130.9219 169.0312 121.7812 161.8594 Q112.6406 154.6875 97.0312 154.6875 Q89.7188 154.6875 82.4062 156.0938 Q75.0938 157.5 67.5 160.4531 L67.5 101.6719 Z\"/></svg></template>\n    <template id=\"♦6\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.1094 153.7031 Q97.7344 153.7031 90.5625 161.0156 Q83.3906 168.4688 83.3906 181.2656 Q83.3906 193.9219 90.5625 201.2344 Q97.7344 208.6875 110.1094 208.6875 Q122.3438 208.6875 129.5156 201.2344 Q136.6875 193.9219 136.6875 181.2656 Q136.6875 168.4688 129.5156 161.0156 Q122.3438 153.7031 110.1094 153.7031 ZM146.3906 103.9219 L146.3906 118.4062 Q139.5 115.5938 132.4688 114.1875 Q125.4375 112.6406 118.5469 112.6406 Q100.5469 112.6406 90.9844 123.1875 Q81.4219 133.875 80.0156 155.3906 Q85.3594 148.5 93.375 144.8438 Q101.5312 141.1875 111.0938 141.1875 Q131.4844 141.1875 143.2969 151.875 Q155.1094 162.7031 155.1094 181.2656 Q155.1094 199.125 142.7344 210.2344 Q130.5 221.2031 110.1094 221.2031 Q86.625 221.2031 74.25 205.5938 Q61.875 189.9844 61.875 160.1719 Q61.875 132.3281 77.0625 115.875 Q92.25 99.2812 117.8438 99.2812 Q124.7344 99.2812 131.7656 100.4062 Q138.7969 101.6719 146.3906 103.9219 Z\"/></svg></template>\n    <template id=\"♦7\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L148.6406 101.6719 L148.6406 108.4219 L99.7031 219.0938 L80.5781 219.0938 L126.7031 115.0312 L61.875 115.0312 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♦8\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM108.2812 163.125 Q95.2031 163.125 87.75 169.3125 Q80.2969 175.3594 80.2969 185.9062 Q80.2969 196.5938 87.75 202.6406 Q95.2031 208.6875 108.2812 208.6875 Q121.2188 208.6875 128.8125 202.5 Q136.2656 196.4531 136.2656 185.9062 Q136.2656 175.3594 128.8125 169.3125 Q121.3594 163.125 108.2812 163.125 ZM90 156.2344 Q78.1875 153.7031 71.7188 146.8125 Q65.1094 139.7812 65.1094 129.6562 Q65.1094 115.5938 76.6406 107.4375 Q88.1719 99.2812 108.2812 99.2812 Q128.3906 99.2812 139.9219 107.4375 Q151.3125 115.5938 151.3125 129.6562 Q151.3125 140.0625 144.8438 146.8125 Q138.2344 153.7031 126.5625 156.2344 Q139.2188 158.7656 147.0938 166.9219 Q154.5469 174.6562 154.5469 185.9062 Q154.5469 202.9219 142.5938 212.0625 Q130.5 221.2031 108.2812 221.2031 Q85.9219 221.2031 73.9688 212.0625 Q61.875 202.9219 61.875 185.9062 Q61.875 174.9375 69.3281 166.9219 Q76.9219 159.0469 90 156.2344 ZM83.25 131.2031 Q83.25 140.0625 89.8594 145.4062 Q96.3281 150.6094 108.2812 150.6094 Q119.6719 150.6094 126.5625 145.4062 Q133.3125 140.3438 133.3125 131.2031 Q133.3125 122.3438 126.5625 117 Q119.9531 111.7969 108.2812 111.7969 Q96.6094 111.7969 89.8594 117 Q83.25 122.0625 83.25 131.2031 Z\"/></svg></template>\n    <template id=\"♦9\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM70.5938 216.5625 L70.5938 202.0781 Q77.4844 204.8906 84.5156 206.4375 Q91.5469 207.8438 98.2969 207.8438 Q116.4375 207.8438 126 197.2969 Q135.4219 186.75 136.8281 165.0938 Q131.9062 171.7031 123.4688 175.5 Q115.4531 179.1562 105.75 179.1562 Q85.5 179.1562 73.6875 168.4688 Q61.875 157.7812 61.875 139.2188 Q61.875 121.0781 74.1094 110.25 Q86.4844 99.2812 106.875 99.2812 Q130.3594 99.2812 142.5938 114.8906 Q154.9688 130.5 154.9688 160.3125 Q154.9688 188.1562 139.9219 204.6094 Q124.7344 221.2031 99.1406 221.2031 Q92.25 221.2031 85.2188 220.0781 Q78.1875 218.8125 70.5938 216.5625 ZM106.875 166.7812 Q119.25 166.7812 126.4219 159.4688 Q133.5938 152.1562 133.5938 139.2188 Q133.5938 126.5625 126.4219 119.25 Q119.25 111.7969 106.875 111.7969 Q94.9219 111.7969 87.4688 119.25 Q80.1562 126.5625 80.1562 139.2188 Q80.1562 152.1562 87.4688 159.4688 Q94.6406 166.7812 106.875 166.7812 Z\"/></svg></template>\n    <template id=\"♦10\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM159.0469 111.7969 Q149.0625 111.7969 142.0312 123.8906 Q134.8594 135.9844 134.8594 160.1719 Q134.8594 184.5 142.0312 196.5938 Q149.0625 208.6875 159.0469 208.6875 Q169.0312 208.6875 176.0625 196.5938 Q183.2344 184.5 183.2344 160.1719 Q183.2344 135.9844 176.0625 123.8906 Q169.0312 111.7969 159.0469 111.7969 ZM159.0469 99.2812 Q177.4688 99.2812 189.4219 114.8906 Q201.375 130.5 201.375 160.1719 Q201.375 189.9844 189.4219 205.5938 Q177.4688 221.2031 159.0469 221.2031 Q136.2656 221.2031 126.4219 205.5938 Q116.5781 189.9844 116.5781 160.1719 Q116.5781 130.5 126.4219 114.8906 Q136.2656 99.2812 159.0469 99.2812 ZM80.5781 219.0938 L80.5781 117.7031 L61.875 123.4688 L61.875 107.1562 L81.5625 101.6719 L100.8281 101.6719 L100.8281 219.0938 L80.5781 219.0938 Z\"/></svg></template>\n    <template id=\"♦J\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM89.1562 101.6719 L107.0156 101.6719 L107.0156 178.7344 Q107.0156 199.6875 97.875 209.5312 Q88.875 219.2344 68.7656 219.2344 L61.875 219.2344 L61.875 205.7344 L67.5 205.7344 Q79.3125 205.7344 84.2344 199.8281 Q89.1562 193.9219 89.1562 178.7344 L89.1562 101.6719 Z\"/></svg></template>\n    <template id=\"♦Q\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM107.2969 221.0625 Q106.7344 221.0625 105.5391 221.1328 Q104.3438 221.2031 103.6406 221.2031 Q81.4219 221.2031 70.5234 206.0859 Q59.625 190.9688 59.625 160.3125 Q59.625 129.5156 70.5938 114.3984 Q81.5625 99.2812 103.7812 99.2812 Q126.1406 99.2812 137.1094 114.3984 Q148.0781 129.5156 148.0781 160.3125 Q148.0781 183.5156 142.0312 197.6484 Q135.9844 211.7812 123.6094 217.4062 L141.3281 232.3125 L127.9688 240.1875 L107.2969 221.0625 ZM129.375 160.3125 Q129.375 134.4375 123.3984 123.3281 Q117.4219 112.2188 103.7812 112.2188 Q90.2812 112.2188 84.3047 123.3281 Q78.3281 134.4375 78.3281 160.3125 Q78.3281 186.1875 84.3047 197.2969 Q90.2812 208.4062 103.7812 208.4062 Q117.4219 208.4062 123.3984 197.2969 Q129.375 186.1875 129.375 160.3125 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 Z\"/></svg></template>\n    <template id=\"♦K\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L79.7344 101.6719 L79.7344 151.3125 L130.6406 101.6719 L153.7031 101.6719 L96.4688 156.5156 L158.3438 219.2344 L134.8594 219.2344 L79.7344 162.5625 L79.7344 219.2344 L61.875 219.2344 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♣A\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.6719 115.7344 L91.8281 175.7812 L129.5156 175.7812 L110.6719 115.7344 ZM99.9844 101.6719 L121.6406 101.6719 L162.1406 219.2344 L143.5781 219.2344 L134.0156 188.5781 L87.6094 188.5781 L78.0469 219.2344 L59.4844 219.2344 L99.9844 101.6719 Z\"/></svg></template>\n    <template id=\"♣2\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM86.3438 203.0625 L145.9688 203.0625 L145.9688 219.0938 L61.875 219.0938 L61.875 203.625 Q66.6562 199.2656 75.5156 191.3906 Q123.8906 148.5 123.8906 135.2812 Q123.8906 126 116.5781 120.3047 Q109.2656 114.6094 97.3125 114.6094 Q90 114.6094 81.4219 117.0703 Q72.8438 119.5312 62.7188 124.4531 L62.7188 107.1562 Q73.5469 103.2188 82.8984 101.25 Q92.25 99.2812 100.2656 99.2812 Q120.6562 99.2812 132.8906 108.5625 Q145.125 117.8438 145.125 133.0312 Q145.125 152.5781 98.5781 192.5156 Q90.7031 199.2656 86.3438 203.0625 Z\"/></svg></template>\n    <template id=\"♣3\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM121.7812 155.5312 Q134.7188 158.0625 141.8203 165.7266 Q148.9219 173.3906 148.9219 184.9219 Q148.9219 202.3594 135.5625 211.7812 Q122.2031 221.2031 97.3125 221.2031 Q89.2969 221.2031 80.5078 219.7266 Q71.7188 218.25 61.875 215.4375 L61.875 198.4219 Q69.1875 202.2188 77.5547 204.0469 Q85.9219 205.875 95.3438 205.875 Q110.6719 205.875 119.1094 200.3203 Q127.5469 194.7656 127.5469 184.9219 Q127.5469 174.5156 119.7422 169.1719 Q111.9375 163.8281 96.75 163.8281 L84.6562 163.8281 L84.6562 148.6406 L97.875 148.6406 Q111.0938 148.6406 117.9141 144.2109 Q124.7344 139.7812 124.7344 131.3438 Q124.7344 123.1875 117.7031 118.8984 Q110.6719 114.6094 97.3125 114.6094 Q91.6875 114.6094 84.5156 115.875 Q77.3438 117.1406 65.9531 120.375 L65.9531 104.2031 Q76.2188 101.8125 85.2188 100.5469 Q94.2188 99.2812 101.9531 99.2812 Q122.2031 99.2812 134.0859 107.5781 Q145.9688 115.875 145.9688 129.7969 Q145.9688 139.5 139.6406 146.25 Q133.3125 153 121.7812 155.5312 Z\"/></svg></template>\n    <template id=\"♣4\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM120.0938 118.6875 L76.6406 177.6094 L120.0938 177.6094 L120.0938 118.6875 ZM117 101.6719 L140.3438 101.6719 L140.3438 177.6094 L159.3281 177.6094 L159.3281 192.9375 L140.3438 192.9375 L140.3438 219.0938 L120.0938 219.0938 L120.0938 192.9375 L61.875 192.9375 L61.875 175.9219 L117 101.6719 Z\"/></svg></template>\n    <template id=\"♣5\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM67.5 101.6719 L139.2188 101.6719 L139.2188 115.0312 L84.2344 115.0312 L84.2344 143.7188 Q88.1719 142.4531 92.25 141.8906 Q96.1875 141.3281 100.125 141.3281 Q122.7656 141.3281 135.9844 152.1562 Q149.2031 162.8438 149.2031 181.2656 Q149.2031 200.25 135.5625 210.7969 Q122.0625 221.2031 97.3125 221.2031 Q88.875 221.2031 80.0156 219.9375 Q71.1562 218.6719 61.875 216.1406 L61.875 200.25 Q69.8906 204.0469 78.6094 206.0156 Q87.3281 207.8438 97.0312 207.8438 Q112.6406 207.8438 121.7812 200.6719 Q130.9219 193.5 130.9219 181.2656 Q130.9219 169.0312 121.7812 161.8594 Q112.6406 154.6875 97.0312 154.6875 Q89.7188 154.6875 82.4062 156.0938 Q75.0938 157.5 67.5 160.4531 L67.5 101.6719 Z\"/></svg></template>\n    <template id=\"♣6\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.1094 153.7031 Q97.7344 153.7031 90.5625 161.0156 Q83.3906 168.4688 83.3906 181.2656 Q83.3906 193.9219 90.5625 201.2344 Q97.7344 208.6875 110.1094 208.6875 Q122.3438 208.6875 129.5156 201.2344 Q136.6875 193.9219 136.6875 181.2656 Q136.6875 168.4688 129.5156 161.0156 Q122.3438 153.7031 110.1094 153.7031 ZM146.3906 103.9219 L146.3906 118.4062 Q139.5 115.5938 132.4688 114.1875 Q125.4375 112.6406 118.5469 112.6406 Q100.5469 112.6406 90.9844 123.1875 Q81.4219 133.875 80.0156 155.3906 Q85.3594 148.5 93.375 144.8438 Q101.5312 141.1875 111.0938 141.1875 Q131.4844 141.1875 143.2969 151.875 Q155.1094 162.7031 155.1094 181.2656 Q155.1094 199.125 142.7344 210.2344 Q130.5 221.2031 110.1094 221.2031 Q86.625 221.2031 74.25 205.5938 Q61.875 189.9844 61.875 160.1719 Q61.875 132.3281 77.0625 115.875 Q92.25 99.2812 117.8438 99.2812 Q124.7344 99.2812 131.7656 100.4062 Q138.7969 101.6719 146.3906 103.9219 Z\"/></svg></template>\n    <template id=\"♣7\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L148.6406 101.6719 L148.6406 108.4219 L99.7031 219.0938 L80.5781 219.0938 L126.7031 115.0312 L61.875 115.0312 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♣8\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM108.2812 163.125 Q95.2031 163.125 87.75 169.3125 Q80.2969 175.3594 80.2969 185.9062 Q80.2969 196.5938 87.75 202.6406 Q95.2031 208.6875 108.2812 208.6875 Q121.2188 208.6875 128.8125 202.5 Q136.2656 196.4531 136.2656 185.9062 Q136.2656 175.3594 128.8125 169.3125 Q121.3594 163.125 108.2812 163.125 ZM90 156.2344 Q78.1875 153.7031 71.7188 146.8125 Q65.1094 139.7812 65.1094 129.6562 Q65.1094 115.5938 76.6406 107.4375 Q88.1719 99.2812 108.2812 99.2812 Q128.3906 99.2812 139.9219 107.4375 Q151.3125 115.5938 151.3125 129.6562 Q151.3125 140.0625 144.8438 146.8125 Q138.2344 153.7031 126.5625 156.2344 Q139.2188 158.7656 147.0938 166.9219 Q154.5469 174.6562 154.5469 185.9062 Q154.5469 202.9219 142.5938 212.0625 Q130.5 221.2031 108.2812 221.2031 Q85.9219 221.2031 73.9688 212.0625 Q61.875 202.9219 61.875 185.9062 Q61.875 174.9375 69.3281 166.9219 Q76.9219 159.0469 90 156.2344 ZM83.25 131.2031 Q83.25 140.0625 89.8594 145.4062 Q96.3281 150.6094 108.2812 150.6094 Q119.6719 150.6094 126.5625 145.4062 Q133.3125 140.3438 133.3125 131.2031 Q133.3125 122.3438 126.5625 117 Q119.9531 111.7969 108.2812 111.7969 Q96.6094 111.7969 89.8594 117 Q83.25 122.0625 83.25 131.2031 Z\"/></svg></template>\n    <template id=\"♣9\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM70.5938 216.5625 L70.5938 202.0781 Q77.4844 204.8906 84.5156 206.4375 Q91.5469 207.8438 98.2969 207.8438 Q116.4375 207.8438 126 197.2969 Q135.4219 186.75 136.8281 165.0938 Q131.9062 171.7031 123.4688 175.5 Q115.4531 179.1562 105.75 179.1562 Q85.5 179.1562 73.6875 168.4688 Q61.875 157.7812 61.875 139.2188 Q61.875 121.0781 74.1094 110.25 Q86.4844 99.2812 106.875 99.2812 Q130.3594 99.2812 142.5938 114.8906 Q154.9688 130.5 154.9688 160.3125 Q154.9688 188.1562 139.9219 204.6094 Q124.7344 221.2031 99.1406 221.2031 Q92.25 221.2031 85.2188 220.0781 Q78.1875 218.8125 70.5938 216.5625 ZM106.875 166.7812 Q119.25 166.7812 126.4219 159.4688 Q133.5938 152.1562 133.5938 139.2188 Q133.5938 126.5625 126.4219 119.25 Q119.25 111.7969 106.875 111.7969 Q94.9219 111.7969 87.4688 119.25 Q80.1562 126.5625 80.1562 139.2188 Q80.1562 152.1562 87.4688 159.4688 Q94.6406 166.7812 106.875 166.7812 Z\"/></svg></template>\n    <template id=\"♣10\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM159.0469 111.7969 Q149.0625 111.7969 142.0312 123.8906 Q134.8594 135.9844 134.8594 160.1719 Q134.8594 184.5 142.0312 196.5938 Q149.0625 208.6875 159.0469 208.6875 Q169.0312 208.6875 176.0625 196.5938 Q183.2344 184.5 183.2344 160.1719 Q183.2344 135.9844 176.0625 123.8906 Q169.0312 111.7969 159.0469 111.7969 ZM159.0469 99.2812 Q177.4688 99.2812 189.4219 114.8906 Q201.375 130.5 201.375 160.1719 Q201.375 189.9844 189.4219 205.5938 Q177.4688 221.2031 159.0469 221.2031 Q136.2656 221.2031 126.4219 205.5938 Q116.5781 189.9844 116.5781 160.1719 Q116.5781 130.5 126.4219 114.8906 Q136.2656 99.2812 159.0469 99.2812 ZM80.5781 219.0938 L80.5781 117.7031 L61.875 123.4688 L61.875 107.1562 L81.5625 101.6719 L100.8281 101.6719 L100.8281 219.0938 L80.5781 219.0938 Z\"/></svg></template>\n    <template id=\"♣J\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM89.1562 101.6719 L107.0156 101.6719 L107.0156 178.7344 Q107.0156 199.6875 97.875 209.5312 Q88.875 219.2344 68.7656 219.2344 L61.875 219.2344 L61.875 205.7344 L67.5 205.7344 Q79.3125 205.7344 84.2344 199.8281 Q89.1562 193.9219 89.1562 178.7344 L89.1562 101.6719 Z\"/></svg></template>\n    <template id=\"♣Q\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM107.2969 221.0625 Q106.7344 221.0625 105.5391 221.1328 Q104.3438 221.2031 103.6406 221.2031 Q81.4219 221.2031 70.5234 206.0859 Q59.625 190.9688 59.625 160.3125 Q59.625 129.5156 70.5938 114.3984 Q81.5625 99.2812 103.7812 99.2812 Q126.1406 99.2812 137.1094 114.3984 Q148.0781 129.5156 148.0781 160.3125 Q148.0781 183.5156 142.0312 197.6484 Q135.9844 211.7812 123.6094 217.4062 L141.3281 232.3125 L127.9688 240.1875 L107.2969 221.0625 ZM129.375 160.3125 Q129.375 134.4375 123.3984 123.3281 Q117.4219 112.2188 103.7812 112.2188 Q90.2812 112.2188 84.3047 123.3281 Q78.3281 134.4375 78.3281 160.3125 Q78.3281 186.1875 84.3047 197.2969 Q90.2812 208.4062 103.7812 208.4062 Q117.4219 208.4062 123.3984 197.2969 Q129.375 186.1875 129.375 160.3125 Z\"/></svg></template>\n    <template id=\"♣K\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L79.7344 101.6719 L79.7344 151.3125 L130.6406 101.6719 L153.7031 101.6719 L96.4688 156.5156 L158.3438 219.2344 L134.8594 219.2344 L79.7344 162.5625 L79.7344 219.2344 L61.875 219.2344 L61.875 101.6719 Z\"/></svg></template>\n\n    <table style=\"border-width:1px\">\n        <tr width=\"100%\" height=\"10px\" style=\"visibility:visible\"}>\n            <td width=\"50px\"><playing-card><span style=\"color:blue\">&block;</span></playing-card</td>\n        </tr>\n        <tr width=\"100%\">\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;A</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;2</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;3</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;4</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;5</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;6</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;7</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;8</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;9</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;10</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;J</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;Q</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;K</span></playing-card></td>\n        </tr>\n        <tr>\n            <td><playing-card><span style=\"color:red\">&hearts;A</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;2</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;3</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;4</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;5</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;6</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;7</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;8</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;9</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;10</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;J</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;Q</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;K</span></playing-card></td>\n        </tr>\n        <tr>\n            <td><playing-card><span style=\"color:red\">&diams;A</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;2</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;3</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;4</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;5</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;6</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;7</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;8</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;9</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;10</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;J</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;Q</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;K</span></playing-card></td>\n        </tr>\n        <tr>\n            <td><playing-card><span style=\"color:black\">&clubs;A</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;2</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;3</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;4</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;5</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;6</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;7</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;8</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;9</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;10</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;J</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;Q</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;K</span></playing-card></td>\n        </tr>\n    </table>\n</div>\n"

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = "<p>index</p>\n"

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = "<form\n    id=\"message_form\"\n    onsubmit=\"\n     var gun = Gun(location.origin + '/gun');\n     openpgp.config.aead_protect = true\n     openpgp.initWorker({ path:'/js/openpgp.worker.js' })\n     if (!message_txt.value) {\n          return false\n     }\n\n     window.handlePost(message_txt.value)(openpgp)(window.localStorage)('royale')(gun).then(result => {if (result) {console.log(result)}}).catch(err => console.error(err));document.getElementById('message_txt').value = ''; return false\"\n    method=\"post\"\n    action=\"/message\">\n    <input id=\"message_form_input\"\n        type=\"submit\"\n        value=\"post message\"\n        form=\"message_form\"\n        >\n</form>\n<textarea\n    id=\"message_txt\"\n    name=\"message_txt\"\n    form=\"message_form\"\n    rows=51\n    cols=70\n    placeholder=\"paste plaintext message, public key, or private key\"\n    style=\"font-family:Menlo,Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New, monospace;\"\n    >\n</textarea>\n"

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = "<span class=\"roadmap\">\n    <details>\n    <summary>road map</summary>\n    <ul>\n        <li><del><a href=\"https://github.com/colealbon/hotlips/commit/3b70981cbe4e11e1400ae8e948a06e3582d9c2d2\">Install node/koa/webpack</a></del></li>\n        <li><del><a href=\"https://github.com/colealbon/hotlips/issues/2\">Install gundb</a></del></li>\n        <li><del>make a <a href=\"#/deck\">deck</a> of cards</del></li>\n        <li><del>Alice and Bob <a href=\"#/message\">identify</a></del></li>\n        <li><del>Alice and Bob <a href=\"#/connect\">connect</a></del></li>\n        <li><del>Alice and Bob <a href=\"https://github.com/colealbon/streamliner\">exchange keys</a></del?</li>\n        <li>Alice picks an encryption key A and uses this to encrypt each card of the deck.</li>\n        <li>Alice <a href=\"https://bost.ocks.org/mike/shuffle/\">shuffles</a> the cards.</li>\n        <li>Alice passes the encrypted and shuffled deck to Bob. With the encryption in place, Bob cannot know which card is which.</li>\n        <li>Bob shuffles the deck.</li>\n        <li>Bob passes the double encrypted and shuffled deck back to Alice.</li>\n        <li>Alice decrypts each card using her key A. This still leaves Bob's encryption in place though so she cannot know which card is which.</li>\n        <li>Alice picks one encryption key for each card (A1, A2, etc.) and encrypts them individually.</li>\n        <li>Alice passes the deck to Bob.</li>\n        <li>Bob decrypts each card using his key B. This still leaves Alice's individual encryption in place though so he cannot know which card is which.</li>\n        <li>Bob picks one encryption key for each card (B1, B2, etc.) and encrypts them individually.</li>\n        <li>Bob passes the deck back to Alice.</li>\n        <li>Alice publishes the deck for everyone playing (in this case only Alice and Bob, see below on expansion though).</li>\n    </ul>\n</details>\n</span>\n"

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTkwMGUzNWZlNGJkMGUxM2EwNGUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9ub3RFbXB0eS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL2RldGVybWluZUNvbnRlbnRUeXBlLmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvZ2V0RnJvbVN0b3JhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9zYXZlUEdQUHVia2V5LmpzIiwid2VicGFjazovLy8uL34vcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvbm90UEdQUHJpdmtleS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL2Jyb2FkY2FzdE11bHRpLmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvZGVjcnlwdFBHUE1lc3NhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9kZWNyeXB0UEdQTWVzc2FnZVdpdGhLZXkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9kZXRlcm1pbmVLZXlUeXBlLmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvZW5jcnlwdENsZWFyVGV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL2VuY3J5cHRDbGVhcnRleHRNdWx0aS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL3NhdmVQR1BQcml2a2V5LmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9ub3RDbGVhcnRleHQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9ndW4vZ3VuLmpzIiwid2VicGFjazovLy8uL34vcmViZWwtcm91dGVyL3NyYy9yZWJlbC1yb3V0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi91dWlkL3YxLmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvYnJvYWRjYXN0LmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvaGFuZGxlTWVzc2FnZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL2hhbmRsZVBvc3QuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9zaHVmZmxlLmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9jb250YWN0LmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9kZWNrLmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvbWVzc2FnZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvcGxheS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvcm9hZG1hcC5qcyIsIndlYnBhY2s6Ly8vLi9+L3V1aWQvbGliL2J5dGVzVG9VdWlkLmpzIiwid2VicGFjazovLy8uL34vdXVpZC9saWIvcm5nLWJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL21vZHVsZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9ub3RQR1BLZXkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9ub3RQR1BNZXNzYWdlLmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvbm90VW5kZWZpbmVkLmpzIiwid2VicGFjazovLy8uL3ZpZXdzL3BhcnRpYWxzL2NvbnRhY3QuaHRtbCIsIndlYnBhY2s6Ly8vLi92aWV3cy9wYXJ0aWFscy9mZWx0Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vdmlld3MvcGFydGlhbHMvZnJlc2hkZWNrLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vdmlld3MvcGFydGlhbHMvaW5kZXguaHRtbCIsIndlYnBhY2s6Ly8vLi92aWV3cy9wYXJ0aWFscy9tZXNzYWdlX2Zvcm0uaHRtbCIsIndlYnBhY2s6Ly8vLi92aWV3cy9wYXJ0aWFscy9yb2FkbWFwLmh0bWwiXSwibmFtZXMiOlsibm90RW1wdHkiLCJjb250ZW50IiwidGhlbiIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiRXJyb3IiLCJlcnIiLCJkZXRlcm1pbmVDb250ZW50VHlwZSIsIm9wZW5wZ3AiLCJDTEVBUlRFWFQiLCJQR1BNRVNTQUdFIiwicG9zc2libGVwZ3BrZXkiLCJrZXkiLCJyZWFkQXJtb3JlZCIsImtleXMiLCJrZXlUeXBlIiwibWVzc2FnZSIsImdldEZyb21TdG9yYWdlIiwibG9jYWxTdG9yYWdlIiwiaW5kZXhLZXkiLCJpIiwibGVuZ3RoIiwia2V5QXJyIiwicHVzaCIsImdldEl0ZW0iLCJzYXZlUEdQUHVia2V5IiwiUEdQa2V5QXJtb3IiLCJQR1BrZXkiLCJ1c2VycyIsInVzZXJJZCIsInVzZXJpZCIsImV4aXN0aW5nS2V5IiwiZXhpc3RpbmdLZXlUeXBlIiwic2V0SXRlbSIsImNhdGNoIiwicHJvY2VzcyIsIm1vZHVsZSIsImV4cG9ydHMiLCJjYWNoZWRTZXRUaW1lb3V0IiwiY2FjaGVkQ2xlYXJUaW1lb3V0IiwiZGVmYXVsdFNldFRpbW91dCIsImRlZmF1bHRDbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiZSIsImNsZWFyVGltZW91dCIsInJ1blRpbWVvdXQiLCJmdW4iLCJjYWxsIiwicnVuQ2xlYXJUaW1lb3V0IiwibWFya2VyIiwicXVldWUiLCJkcmFpbmluZyIsImN1cnJlbnRRdWV1ZSIsInF1ZXVlSW5kZXgiLCJjbGVhblVwTmV4dFRpY2siLCJjb25jYXQiLCJkcmFpblF1ZXVlIiwidGltZW91dCIsImxlbiIsInJ1biIsIm5leHRUaWNrIiwiYXJncyIsIkFycmF5IiwiYXJndW1lbnRzIiwiSXRlbSIsImFycmF5IiwicHJvdG90eXBlIiwiYXBwbHkiLCJ0aXRsZSIsImJyb3dzZXIiLCJlbnYiLCJhcmd2IiwidmVyc2lvbiIsInZlcnNpb25zIiwibm9vcCIsIm9uIiwiYWRkTGlzdGVuZXIiLCJvbmNlIiwib2ZmIiwicmVtb3ZlTGlzdGVuZXIiLCJyZW1vdmVBbGxMaXN0ZW5lcnMiLCJlbWl0IiwicHJlcGVuZExpc3RlbmVyIiwicHJlcGVuZE9uY2VMaXN0ZW5lciIsImxpc3RlbmVycyIsIm5hbWUiLCJiaW5kaW5nIiwiY3dkIiwiY2hkaXIiLCJkaXIiLCJ1bWFzayIsIm5vdFBHUFByaXZrZXkiLCJwZ3BLZXkiLCJ0b1B1YmxpYyIsImFybW9yIiwiZXJyb3IiLCJicm9hZGNhc3RNdWx0aSIsImd1biIsImlkIiwiYnJvYWRjYXN0UXVldWUiLCJtYXAiLCJicm9hZGNhc3QiLCJhbGwiLCJyZXN1bHQiLCJkZWNyeXB0UEdQTWVzc2FnZSIsIlBHUFBSSVZLRVkiLCJwYXNzd29yZCIsIlBHUE1lc3NhZ2VBcm1vciIsImRlY3J5cHRRdWV1ZSIsInN0b3JlQXJyIiwic3RvcmFnZUl0ZW0iLCJjb25zb2xlIiwibG9nIiwiY29udGVudFR5cGUiLCJkZWNyeXB0ZWRBcnIiLCJkZWNyeXB0UEdQTWVzc2FnZVdpdGhLZXkiLCJwcml2YXRlS2V5QXJtb3IiLCJwYXNzcGhyYXNlIiwicHJpdktleU9iaiIsImRlY3J5cHQiLCJwcmltYXJ5S2V5IiwiaXNEZWNyeXB0ZWQiLCJkZWNyeXB0TWVzc2FnZSIsImNsZWFydGV4dCIsImRhdGEiLCJkZXRlcm1pbmVLZXlUeXBlIiwiUEdQUFVCS0VZIiwicHJpdmF0ZUtleXMiLCJwcml2YXRlS2V5IiwiZW5jcnlwdENsZWFyVGV4dCIsInB1YmxpY0tleUFybW9yIiwiUEdQUHVia2V5IiwiZW5jcnlwdE1lc3NhZ2UiLCJlbmNyeXB0ZWR0eHQiLCJvcHRpb25zIiwicHVibGljS2V5cyIsImVuY3J5cHQiLCJjaXBoZXJ0ZXh0IiwiZW5jcnlwdENsZWFydGV4dE11bHRpIiwiZW5jcnlwdFF1ZXVlIiwic3RvcmFnZUFyciIsImVuY3J5cHRlZEFyciIsInNhdmVQR1BQcml2a2V5Iiwic2V0SW1tZWRpYXRlIiwiZyIsIkZ1bmN0aW9uIiwiZXZhbCIsIndpbmRvdyIsIm5vdENsZWFydGV4dCIsInJvb3QiLCJnbG9iYWwiLCJyZXF1aXJlIiwiYXJnIiwic2xpY2UiLCJtb2QiLCJwYXRoIiwic3BsaXQiLCJ0b1N0cmluZyIsInJlcGxhY2UiLCJjb21tb24iLCJUeXBlIiwiZm5zIiwiZm4iLCJpcyIsImJpIiwiYiIsIkJvb2xlYW4iLCJudW0iLCJuIiwibGlzdF9pcyIsInBhcnNlRmxvYXQiLCJJbmZpbml0eSIsInRleHQiLCJ0IiwiaWZ5IiwiSlNPTiIsInN0cmluZ2lmeSIsInJhbmRvbSIsImwiLCJjIiwicyIsImNoYXJBdCIsIk1hdGgiLCJmbG9vciIsIm1hdGNoIiwibyIsInIiLCJvYmoiLCJoYXMiLCJ0b0xvd2VyQ2FzZSIsImxpc3QiLCJtIiwiaW5kZXhPZiIsImZ1enp5IiwiZiIsInNsaXQiLCJzb3J0IiwiayIsIkEiLCJCIiwiXyIsIm9ial9tYXAiLCJpbmRleCIsIk9iamVjdCIsImNvbnN0cnVjdG9yIiwicHV0IiwidiIsImhhc093blByb3BlcnR5IiwiZGVsIiwiYXMiLCJ1Iiwib2JqX2lzIiwicGFyc2UiLCJvYmpfaGFzIiwidG8iLCJmcm9tIiwiY29weSIsImVtcHR5IiwieCIsImxsIiwibGxlIiwiZm5faXMiLCJpaSIsInRpbWUiLCJEYXRlIiwiZ2V0VGltZSIsIm9udG8iLCJ0YWciLCJuZXh0IiwiYmUiLCJ0aGUiLCJsYXN0IiwiYmFjayIsIk9uIiwiQ2hhaW4iLCJjcmVhdGUiLCJvcHQiLCJyaWQiLCJ1dWlkIiwic3R1biIsImNoYWluIiwiZXYiLCJza2lwIiwiY2IiLCJyZXMiLCJ0bXAiLCJxIiwiYWN0IiwiYXQiLCJjdHgiLCJhc2siLCJzY29wZSIsImFjayIsInJlcGx5Iiwib25zIiwiZXZlbnQiLCJHdW4iLCJpbnB1dCIsInNvdWwiLCJzdGF0ZSIsIndhaXRpbmciLCJ3aGVuIiwic29vbmVzdCIsInNldCIsImZ1dHVyZSIsIm5vdyIsImNoZWNrIiwiZWFjaCIsIndhaXQiLCJIQU0iLCJtYWNoaW5lU3RhdGUiLCJpbmNvbWluZ1N0YXRlIiwiY3VycmVudFN0YXRlIiwiaW5jb21pbmdWYWx1ZSIsImN1cnJlbnRWYWx1ZSIsImRlZmVyIiwiaGlzdG9yaWNhbCIsImNvbnZlcmdlIiwiaW5jb21pbmciLCJMZXhpY2FsIiwiY3VycmVudCIsInVuZGVmaW5lZCIsIlZhbCIsInRleHRfaXMiLCJiaV9pcyIsIm51bV9pcyIsInJlbCIsInJlbF8iLCJvYmpfcHV0IiwiTm9kZSIsInNvdWxfIiwidGV4dF9yYW5kb20iLCJub2RlIiwib2JqX2RlbCIsIlN0YXRlIiwicGVyZiIsInN0YXJ0IiwiTiIsImRyaWZ0IiwiRCIsInBlcmZvcm1hbmNlIiwidGltaW5nIiwibmF2aWdhdGlvblN0YXJ0IiwiTl8iLCJvYmpfYXMiLCJ2YWwiLCJvYmpfY29weSIsIkdyYXBoIiwib2JqX2VtcHR5IiwibmYiLCJncmFwaCIsInNlZW4iLCJ2YWxpZCIsInByZXYiLCJpbnZhbGlkIiwiam9pbiIsImFyciIsIkR1cCIsImNhY2hlIiwidHJhY2siLCJnYyIsImRlIiwib2xkZXN0IiwibWF4QWdlIiwibWluIiwiZG9uZSIsImVsYXBzZWQiLCJuZXh0R0MiLCJ0b0pTT04iLCJkdXAiLCJzY2hlZHVsZSIsImZpZWxkIiwidmFsdWUiLCJjYXQiLCJjb2F0Iiwib2JqX3RvIiwiZ2V0IiwibWFjaGluZSIsInZlcmlmeSIsIm1lcmdlIiwiZGlmZiIsInZlcnRleCIsIndhcyIsImtub3duIiwicmVmIiwiX3NvdWwiLCJfZmllbGQiLCJob3ciLCJwZWVycyIsInVybCIsIndzYyIsInByb3RvY29scyIsInJlbF9pcyIsImRlYnVnIiwidyIsInllcyIsIm91dHB1dCIsInN5bnRoIiwicHJveHkiLCJjaGFuZ2UiLCJlY2hvIiwibm90IiwicmVsYXRlIiwibm9kZV8iLCJyZXZlcmIiLCJ2aWEiLCJ1c2UiLCJvdXQiLCJjYXAiLCJhbnkiLCJiYXRjaCIsIm5vIiwiaWlmZSIsIm1ldGEiLCJfXyIsInVuaW9uIiwic3RhdGVfaXMiLCJjcyIsIml2IiwiY3YiLCJ2YWxfaXMiLCJzdGF0ZV9pZnkiLCJkZWx0YSIsInN5bnRoXyIsIm5vZGVfc291bCIsIm5vZGVfaXMiLCJub2RlX2lmeSIsImVhcyIsInN1YnMiLCJiaW5kIiwib2siLCJhc3luYyIsIm91Z2h0IiwibmVlZCIsImltcGxlbWVudCIsImZpZWxkcyIsIm5fIiwiaXRlbSIsInN0b3JlIiwicmVtb3ZlSXRlbSIsImRpcnR5IiwiY291bnQiLCJtYXgiLCJwcmVmaXgiLCJzYXZlIiwibGV4IiwiV2ViU29ja2V0Iiwid2Via2l0V2ViU29ja2V0IiwibW96V2ViU29ja2V0Iiwid3NwIiwidWRyYWluIiwic2VuZCIsInBlZXIiLCJtc2ciLCJ3aXJlIiwib3BlbiIsInJlYWR5U3RhdGUiLCJPUEVOIiwicmVjZWl2ZSIsImJvZHkiLCJvbmNsb3NlIiwicmVjb25uZWN0Iiwib25lcnJvciIsImNvZGUiLCJvbm9wZW4iLCJvbm1lc3NhZ2UiLCJSZWJlbFJvdXRlciIsIl9wcmVmaXgiLCJwcmV2aW91c1BhdGgiLCJiYXNlUGF0aCIsImdldEF0dHJpYnV0ZSIsImluaGVyaXQiLCIkZWxlbWVudCIsInBhcmVudE5vZGUiLCJub2RlTmFtZSIsInJvdXRlIiwicm91dGVzIiwiJGNoaWxkcmVuIiwiY2hpbGRyZW4iLCIkY2hpbGQiLCIkdGVtcGxhdGUiLCJpbm5lckhUTUwiLCJzaGFkb3dSb290IiwiY3JlYXRlU2hhZG93Um9vdCIsImFuaW1hdGlvbiIsImluaXRBbmltYXRpb24iLCJyZW5kZXIiLCJwYXRoQ2hhbmdlIiwiaXNCYWNrIiwiY2xhc3NMaXN0IiwiYWRkIiwicmVtb3ZlIiwib2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwibXV0YXRpb25zIiwiYWRkZWROb2RlcyIsIm90aGVyQ2hpbGRyZW4iLCJnZXRPdGhlckNoaWxkcmVuIiwiZm9yRWFjaCIsImNoaWxkIiwiYW5pbWF0aW9uRW5kIiwidGFyZ2V0IiwiY2xhc3NOYW1lIiwicmVtb3ZlQ2hpbGQiLCJhZGRFdmVudExpc3RlbmVyIiwib2JzZXJ2ZSIsImNoaWxkTGlzdCIsImdldFBhdGhGcm9tVXJsIiwicmVnZXhTdHJpbmciLCJyZWdleCIsIlJlZ0V4cCIsInRlc3QiLCJfcm91dGVSZXN1bHQiLCJjb21wb25lbnQiLCIkY29tcG9uZW50IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwicGFyYW1zIiwic2V0QXR0cmlidXRlIiwiYXBwZW5kQ2hpbGQiLCJ0ZW1wbGF0ZSIsImEiLCJyZXN1bHRzIiwicXVlcnlTdHJpbmciLCJzdWJzdHIiLCJwYXJ0IiwiZXEiLCJkZWNvZGVVUklDb21wb25lbnQiLCJzdWJzdHJpbmciLCJDbGFzcyIsInZhbGlkRWxlbWVudFRhZyIsIkhUTUxFbGVtZW50IiwiY2xhc3NUb1RhZyIsImlzUmVnaXN0ZXJlZEVsZW1lbnQiLCJyZWdpc3RlckVsZW1lbnQiLCJjYWxsYmFjayIsImNoYW5nZUNhbGxiYWNrcyIsImNoYW5nZUhhbmRsZXIiLCJsb2NhdGlvbiIsImhyZWYiLCJvbGRVUkwiLCJvbmhhc2hjaGFuZ2UiLCJwYXJzZVF1ZXJ5U3RyaW5nIiwicmUiLCJleGVjIiwicmVzdWx0czIiLCJpZHgiLCJSZWJlbFJvdXRlIiwiUmViZWxEZWZhdWx0IiwiUmViZWxCYWNrQSIsInByZXZlbnREZWZhdWx0IiwiZGlzcGF0Y2hFdmVudCIsIkN1c3RvbUV2ZW50IiwiaGFzaCIsIkhUTUxBbmNob3JFbGVtZW50IiwiZXh0ZW5kcyIsImdldFBhcmFtc0Zyb21VcmwiLCJybmciLCJieXRlc1RvVXVpZCIsIl9zZWVkQnl0ZXMiLCJfbm9kZUlkIiwiX2Nsb2Nrc2VxIiwiX2xhc3RNU2VjcyIsIl9sYXN0TlNlY3MiLCJ2MSIsImJ1ZiIsIm9mZnNldCIsImNsb2Nrc2VxIiwibXNlY3MiLCJuc2VjcyIsImR0IiwidGwiLCJ0bWgiLCJwdXRSZXN1bHQiLCJoYW5kbGVNZXNzYWdlIiwiaGFuZGxlUG9zdCIsImd1bmRiIiwiZW5jcnlwdGVkIiwic2h1ZmZsZSIsImNvbnRhY3RQYXJ0aWFsIiwiQ29udGFjdFBhZ2UiLCJmcmVzaERlY2tQYXJ0aWFsIiwiRGVja1BhZ2UiLCJjcmVhdGVkQ2FsbGJhY2siLCJxdWVyeVNlbGVjdG9yIiwidGV4dENvbnRlbnQiLCJjbG9uZSIsImltcG9ydE5vZGUiLCJjb2xvck92ZXJyaWRlIiwic3R5bGUiLCJjb2xvciIsImZpbGwiLCJpbmRleFBhcnRpYWwiLCJJbmRleFBhZ2UiLCJjbGllbnRQdWJrZXlGb3JtUGFydGlhbCIsIk1lc3NhZ2VQYWdlIiwiZmVsdFBhcnRpYWwiLCJQbGF5UGFnZSIsInJvYWRtYXBQYXJ0aWFsIiwiUm9hZG1hcFBhZ2UiLCJieXRlVG9IZXgiLCJidGgiLCJjcnlwdG8iLCJtc0NyeXB0byIsImdldFJhbmRvbVZhbHVlcyIsInJuZHM4IiwiVWludDhBcnJheSIsIndoYXR3Z1JORyIsInJuZHMiLCJ3ZWJwYWNrUG9seWZpbGwiLCJkZXByZWNhdGUiLCJwYXRocyIsImRlZmluZVByb3BlcnR5IiwiZW51bWVyYWJsZSIsInV1aWR2MSIsIm5vdFBHUEtleSIsIm5vdFBHUE1lc3NhZ2UiLCJub3RVbmRlZmluZWQiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUNoRUE7Ozs7O2tCQUV3QkEsUTs7QUFEeEI7Ozs7OztBQUNlLFNBQVNBLFFBQVQsQ0FBa0JDLE9BQWxCLEVBQTJCO0FBQ3RDLFdBQU8sNEJBQWFBLE9BQWIsRUFDTkMsSUFETSxDQUNELFlBQU07QUFDUixlQUFPLElBQUlDLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDcEMsZ0JBQUk7QUFDQSxvQkFBR0osWUFBWSxFQUFmLEVBQW1CO0FBQ2ZHLDRCQUFRSCxPQUFSO0FBQ0gsaUJBRkQsTUFFTztBQUNISSwyQkFBTyxJQUFJQyxLQUFKLENBQVUsZUFBVixDQUFQO0FBQ0g7QUFDSixhQU5ELENBTUUsT0FBT0MsR0FBUCxFQUFZO0FBQ1ZGLHVCQUFPRSxHQUFQO0FBQ0g7QUFDSixTQVZNLENBQVA7QUFXSCxLQWJNLENBQVA7QUFjSCxFOzs7Ozs7O0FDakJEOzs7OztRQUlnQkMsb0IsR0FBQUEsb0I7O0FBRmhCOztBQUVPLFNBQVNBLG9CQUFULENBQThCUCxPQUE5QixFQUF1QztBQUMxQztBQUNBLFdBQVEsQ0FBQ0EsT0FBRixHQUNQRSxRQUFRQyxPQUFSLENBQWdCLEVBQWhCLENBRE8sR0FFUCxVQUFDSyxPQUFELEVBQWE7QUFDVCxlQUFRLENBQUNBLE9BQUYsR0FDUE4sUUFBUUUsTUFBUixDQUFlLHdCQUFmLENBRE8sR0FFUCxJQUFJRixPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQzdCLGdCQUFNSyxZQUFZLFdBQWxCO0FBQ0EsZ0JBQU1DLGFBQWEsWUFBbkI7QUFDQSxnQkFBSUMsaUJBQWlCSCxRQUFRSSxHQUFSLENBQVlDLFdBQVosQ0FBd0JiLE9BQXhCLENBQXJCO0FBQ0EsZ0JBQUlXLGVBQWVHLElBQWYsQ0FBb0IsQ0FBcEIsQ0FBSixFQUE0QjtBQUN4Qix3REFBaUJkLE9BQWpCLEVBQTBCUSxPQUExQixFQUNDUCxJQURELENBQ00sVUFBQ2MsT0FBRCxFQUFhO0FBQ2ZaLDRCQUFRWSxPQUFSO0FBQ0gsaUJBSEQ7QUFJSCxhQUxELE1BS087QUFDSCxvQkFBSTtBQUNBUCw0QkFBUVEsT0FBUixDQUFnQkgsV0FBaEIsQ0FBNEJiLE9BQTVCO0FBQ0FHLDRCQUFRTyxVQUFSO0FBQ0gsaUJBSEQsQ0FHRSxPQUFPSixHQUFQLEVBQVk7QUFDVkgsNEJBQVFNLFNBQVI7QUFDSDtBQUNKO0FBQ0osU0FqQkQsQ0FGQTtBQW9CSCxLQXZCRDtBQXdCSCxDOzs7Ozs7O0FDOUJEOzs7OztRQUVnQlEsYyxHQUFBQSxjO0FBQVQsU0FBU0EsY0FBVCxDQUF3QkMsWUFBeEIsRUFBc0M7QUFDekM7QUFDQSxXQUFRLENBQUNBLFlBQUYsR0FDUGhCLFFBQVFFLE1BQVIsQ0FBZSw2QkFBZixDQURPLEdBRVAsVUFBQ2UsUUFBRCxFQUFjO0FBQ1YsZUFBUSxDQUFDQSxRQUFGO0FBQ1A7QUFDQSxZQUFJakIsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUM3QixnQkFBSTtBQUNBLG9CQUFJZ0IsSUFBSUYsYUFBYUcsTUFBckI7QUFDQSxvQkFBSUMsU0FBUyxFQUFiO0FBQ0EsdUJBQU9GLEtBQUssQ0FBWixFQUFlO0FBQ1hBLHdCQUFJQSxJQUFJLENBQVI7QUFDQUUsMkJBQU9DLElBQVAsQ0FBWUwsYUFBYU0sT0FBYixDQUFxQk4sYUFBYU4sR0FBYixDQUFpQlEsQ0FBakIsQ0FBckIsQ0FBWjtBQUNBLHdCQUFJQSxNQUFNLENBQVYsRUFBYTtBQUNUakIsZ0NBQVFtQixNQUFSO0FBQ0g7QUFDSjtBQUNKLGFBVkQsQ0FXQSxPQUFPaEIsR0FBUCxFQUFZO0FBQ1JGLHVCQUFPRSxHQUFQO0FBQ0g7QUFDSixTQWZELENBRk87QUFrQlA7QUFDQSxZQUFJSixPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQzdCLGdCQUFJO0FBQ0FELHdCQUFRZSxhQUFhTSxPQUFiLENBQXFCTCxRQUFyQixDQUFSO0FBQ0gsYUFGRCxDQUdBLE9BQU9iLEdBQVAsRUFBWTtBQUNSRix1QkFBT0UsR0FBUDtBQUNIO0FBQ0osU0FQRCxDQW5CQTtBQTJCSCxLQTlCRDtBQStCSCxDOzs7Ozs7O0FDbkNEOzs7OztRQVNnQm1CLGEsR0FBQUEsYTs7QUFQaEI7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVPLFNBQVNBLGFBQVQsQ0FBdUJDLFdBQXZCLEVBQW9DO0FBQ3ZDO0FBQ0E7QUFDQSxXQUFRLENBQUNBLFdBQUYsR0FDUHhCLFFBQVFFLE1BQVIsQ0FBZSw0QkFBZixDQURPLEdBRVAsVUFBQ0ksT0FBRCxFQUFhO0FBQ1QsZUFBUSxDQUFDQSxPQUFGLEdBQ1BOLFFBQVFFLE1BQVIsQ0FBZSx3QkFBZixDQURPLEdBRVAsVUFBQ2MsWUFBRCxFQUFrQjtBQUNkLG1CQUFRLENBQUNBLFlBQUYsR0FDUGhCLFFBQVFFLE1BQVIsQ0FBZSw2QkFBZixDQURPLEdBRVAsSUFBSUYsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUM3QixvQkFBSXVCLFNBQVNuQixRQUFRSSxHQUFSLENBQVlDLFdBQVosQ0FBd0JhLFdBQXhCLENBQWI7QUFDQSx3Q0FBU0EsV0FBVCxFQUNDekIsSUFERCxDQUNNO0FBQUEsMkJBQU0sNEJBQWF5QixXQUFiLEVBQTBCbEIsT0FBMUIsQ0FBTjtBQUFBLGlCQUROLEVBRUNQLElBRkQsQ0FFTTtBQUFBLDJCQUFNLDZCQUFjeUIsV0FBZCxFQUEyQmxCLE9BQTNCLENBQU47QUFBQSxpQkFGTixFQUdDUCxJQUhELENBR007QUFBQSwyQkFBTSw2QkFBY3lCLFdBQWQsRUFBMkJsQixPQUEzQixDQUFOO0FBQUEsaUJBSE4sRUFJQ1AsSUFKRCxDQUlNO0FBQUEsMkJBQU0sb0NBQWVpQixZQUFmLEVBQTZCUyxPQUFPYixJQUFQLENBQVksQ0FBWixFQUFlYyxLQUFmLENBQXFCLENBQXJCLEVBQXdCQyxNQUF4QixDQUErQkMsTUFBNUQsQ0FBTjtBQUFBLGlCQUpOLEVBS0M3QixJQUxELENBS00sdUJBQWU7QUFDakIsMkJBQVEsQ0FBQzhCLFdBQUYsR0FDUDdCLFFBQVFDLE9BQVIsQ0FBZ0IsTUFBaEIsQ0FETyxHQUVQLGdEQUFxQjRCLFdBQXJCLEVBQWtDdkIsT0FBbEMsQ0FGQTtBQUdILGlCQVRELEVBVUNQLElBVkQsQ0FVTSwyQkFBbUI7QUFDckIsd0JBQUkrQixvQkFBb0IsWUFBeEIsRUFBcUM7QUFDakM3QixnQ0FBUSwrQ0FBUjtBQUNILHFCQUZELE1BRU87QUFDSGUscUNBQWFlLE9BQWIsQ0FBcUJOLE9BQU9iLElBQVAsQ0FBWSxDQUFaLEVBQWVjLEtBQWYsQ0FBcUIsQ0FBckIsRUFBd0JDLE1BQXhCLENBQStCQyxNQUFwRCxFQUE0REosV0FBNUQ7QUFDQXZCLDZEQUFtQ3dCLE9BQU9iLElBQVAsQ0FBWSxDQUFaLEVBQWVjLEtBQWYsQ0FBcUIsQ0FBckIsRUFBd0JDLE1BQXhCLENBQStCQyxNQUFsRTtBQUNIO0FBQ0osaUJBakJELEVBa0JDSSxLQWxCRCxDQWtCTyxVQUFDNUIsR0FBRDtBQUFBLDJCQUFTRixPQUFPRSxHQUFQLENBQVQ7QUFBQSxpQkFsQlA7QUFtQkgsYUFyQkQsQ0FGQTtBQXdCSCxTQTNCRDtBQTRCSCxLQS9CRDtBQWdDSCxDOzs7Ozs7Ozs7QUM1Q0Q7QUFDQSxJQUFJNkIsVUFBVUMsT0FBT0MsT0FBUCxHQUFpQixFQUEvQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJQyxnQkFBSjtBQUNBLElBQUlDLGtCQUFKOztBQUVBLFNBQVNDLGdCQUFULEdBQTRCO0FBQ3hCLFVBQU0sSUFBSW5DLEtBQUosQ0FBVSxpQ0FBVixDQUFOO0FBQ0g7QUFDRCxTQUFTb0MsbUJBQVQsR0FBZ0M7QUFDNUIsVUFBTSxJQUFJcEMsS0FBSixDQUFVLG1DQUFWLENBQU47QUFDSDtBQUNBLGFBQVk7QUFDVCxRQUFJO0FBQ0EsWUFBSSxPQUFPcUMsVUFBUCxLQUFzQixVQUExQixFQUFzQztBQUNsQ0osK0JBQW1CSSxVQUFuQjtBQUNILFNBRkQsTUFFTztBQUNISiwrQkFBbUJFLGdCQUFuQjtBQUNIO0FBQ0osS0FORCxDQU1FLE9BQU9HLENBQVAsRUFBVTtBQUNSTCwyQkFBbUJFLGdCQUFuQjtBQUNIO0FBQ0QsUUFBSTtBQUNBLFlBQUksT0FBT0ksWUFBUCxLQUF3QixVQUE1QixFQUF3QztBQUNwQ0wsaUNBQXFCSyxZQUFyQjtBQUNILFNBRkQsTUFFTztBQUNITCxpQ0FBcUJFLG1CQUFyQjtBQUNIO0FBQ0osS0FORCxDQU1FLE9BQU9FLENBQVAsRUFBVTtBQUNSSiw2QkFBcUJFLG1CQUFyQjtBQUNIO0FBQ0osQ0FuQkEsR0FBRDtBQW9CQSxTQUFTSSxVQUFULENBQW9CQyxHQUFwQixFQUF5QjtBQUNyQixRQUFJUixxQkFBcUJJLFVBQXpCLEVBQXFDO0FBQ2pDO0FBQ0EsZUFBT0EsV0FBV0ksR0FBWCxFQUFnQixDQUFoQixDQUFQO0FBQ0g7QUFDRDtBQUNBLFFBQUksQ0FBQ1IscUJBQXFCRSxnQkFBckIsSUFBeUMsQ0FBQ0YsZ0JBQTNDLEtBQWdFSSxVQUFwRSxFQUFnRjtBQUM1RUosMkJBQW1CSSxVQUFuQjtBQUNBLGVBQU9BLFdBQVdJLEdBQVgsRUFBZ0IsQ0FBaEIsQ0FBUDtBQUNIO0FBQ0QsUUFBSTtBQUNBO0FBQ0EsZUFBT1IsaUJBQWlCUSxHQUFqQixFQUFzQixDQUF0QixDQUFQO0FBQ0gsS0FIRCxDQUdFLE9BQU1ILENBQU4sRUFBUTtBQUNOLFlBQUk7QUFDQTtBQUNBLG1CQUFPTCxpQkFBaUJTLElBQWpCLENBQXNCLElBQXRCLEVBQTRCRCxHQUE1QixFQUFpQyxDQUFqQyxDQUFQO0FBQ0gsU0FIRCxDQUdFLE9BQU1ILENBQU4sRUFBUTtBQUNOO0FBQ0EsbUJBQU9MLGlCQUFpQlMsSUFBakIsQ0FBc0IsSUFBdEIsRUFBNEJELEdBQTVCLEVBQWlDLENBQWpDLENBQVA7QUFDSDtBQUNKO0FBR0o7QUFDRCxTQUFTRSxlQUFULENBQXlCQyxNQUF6QixFQUFpQztBQUM3QixRQUFJVix1QkFBdUJLLFlBQTNCLEVBQXlDO0FBQ3JDO0FBQ0EsZUFBT0EsYUFBYUssTUFBYixDQUFQO0FBQ0g7QUFDRDtBQUNBLFFBQUksQ0FBQ1YsdUJBQXVCRSxtQkFBdkIsSUFBOEMsQ0FBQ0Ysa0JBQWhELEtBQXVFSyxZQUEzRSxFQUF5RjtBQUNyRkwsNkJBQXFCSyxZQUFyQjtBQUNBLGVBQU9BLGFBQWFLLE1BQWIsQ0FBUDtBQUNIO0FBQ0QsUUFBSTtBQUNBO0FBQ0EsZUFBT1YsbUJBQW1CVSxNQUFuQixDQUFQO0FBQ0gsS0FIRCxDQUdFLE9BQU9OLENBQVAsRUFBUztBQUNQLFlBQUk7QUFDQTtBQUNBLG1CQUFPSixtQkFBbUJRLElBQW5CLENBQXdCLElBQXhCLEVBQThCRSxNQUE5QixDQUFQO0FBQ0gsU0FIRCxDQUdFLE9BQU9OLENBQVAsRUFBUztBQUNQO0FBQ0E7QUFDQSxtQkFBT0osbUJBQW1CUSxJQUFuQixDQUF3QixJQUF4QixFQUE4QkUsTUFBOUIsQ0FBUDtBQUNIO0FBQ0o7QUFJSjtBQUNELElBQUlDLFFBQVEsRUFBWjtBQUNBLElBQUlDLFdBQVcsS0FBZjtBQUNBLElBQUlDLFlBQUo7QUFDQSxJQUFJQyxhQUFhLENBQUMsQ0FBbEI7O0FBRUEsU0FBU0MsZUFBVCxHQUEyQjtBQUN2QixRQUFJLENBQUNILFFBQUQsSUFBYSxDQUFDQyxZQUFsQixFQUFnQztBQUM1QjtBQUNIO0FBQ0RELGVBQVcsS0FBWDtBQUNBLFFBQUlDLGFBQWEvQixNQUFqQixFQUF5QjtBQUNyQjZCLGdCQUFRRSxhQUFhRyxNQUFiLENBQW9CTCxLQUFwQixDQUFSO0FBQ0gsS0FGRCxNQUVPO0FBQ0hHLHFCQUFhLENBQUMsQ0FBZDtBQUNIO0FBQ0QsUUFBSUgsTUFBTTdCLE1BQVYsRUFBa0I7QUFDZG1DO0FBQ0g7QUFDSjs7QUFFRCxTQUFTQSxVQUFULEdBQXNCO0FBQ2xCLFFBQUlMLFFBQUosRUFBYztBQUNWO0FBQ0g7QUFDRCxRQUFJTSxVQUFVWixXQUFXUyxlQUFYLENBQWQ7QUFDQUgsZUFBVyxJQUFYOztBQUVBLFFBQUlPLE1BQU1SLE1BQU03QixNQUFoQjtBQUNBLFdBQU1xQyxHQUFOLEVBQVc7QUFDUE4sdUJBQWVGLEtBQWY7QUFDQUEsZ0JBQVEsRUFBUjtBQUNBLGVBQU8sRUFBRUcsVUFBRixHQUFlSyxHQUF0QixFQUEyQjtBQUN2QixnQkFBSU4sWUFBSixFQUFrQjtBQUNkQSw2QkFBYUMsVUFBYixFQUF5Qk0sR0FBekI7QUFDSDtBQUNKO0FBQ0ROLHFCQUFhLENBQUMsQ0FBZDtBQUNBSyxjQUFNUixNQUFNN0IsTUFBWjtBQUNIO0FBQ0QrQixtQkFBZSxJQUFmO0FBQ0FELGVBQVcsS0FBWDtBQUNBSCxvQkFBZ0JTLE9BQWhCO0FBQ0g7O0FBRUR0QixRQUFReUIsUUFBUixHQUFtQixVQUFVZCxHQUFWLEVBQWU7QUFDOUIsUUFBSWUsT0FBTyxJQUFJQyxLQUFKLENBQVVDLFVBQVUxQyxNQUFWLEdBQW1CLENBQTdCLENBQVg7QUFDQSxRQUFJMEMsVUFBVTFDLE1BQVYsR0FBbUIsQ0FBdkIsRUFBMEI7QUFDdEIsYUFBSyxJQUFJRCxJQUFJLENBQWIsRUFBZ0JBLElBQUkyQyxVQUFVMUMsTUFBOUIsRUFBc0NELEdBQXRDLEVBQTJDO0FBQ3ZDeUMsaUJBQUt6QyxJQUFJLENBQVQsSUFBYzJDLFVBQVUzQyxDQUFWLENBQWQ7QUFDSDtBQUNKO0FBQ0Q4QixVQUFNM0IsSUFBTixDQUFXLElBQUl5QyxJQUFKLENBQVNsQixHQUFULEVBQWNlLElBQWQsQ0FBWDtBQUNBLFFBQUlYLE1BQU03QixNQUFOLEtBQWlCLENBQWpCLElBQXNCLENBQUM4QixRQUEzQixFQUFxQztBQUNqQ04sbUJBQVdXLFVBQVg7QUFDSDtBQUNKLENBWEQ7O0FBYUE7QUFDQSxTQUFTUSxJQUFULENBQWNsQixHQUFkLEVBQW1CbUIsS0FBbkIsRUFBMEI7QUFDdEIsU0FBS25CLEdBQUwsR0FBV0EsR0FBWDtBQUNBLFNBQUttQixLQUFMLEdBQWFBLEtBQWI7QUFDSDtBQUNERCxLQUFLRSxTQUFMLENBQWVQLEdBQWYsR0FBcUIsWUFBWTtBQUM3QixTQUFLYixHQUFMLENBQVNxQixLQUFULENBQWUsSUFBZixFQUFxQixLQUFLRixLQUExQjtBQUNILENBRkQ7QUFHQTlCLFFBQVFpQyxLQUFSLEdBQWdCLFNBQWhCO0FBQ0FqQyxRQUFRa0MsT0FBUixHQUFrQixJQUFsQjtBQUNBbEMsUUFBUW1DLEdBQVIsR0FBYyxFQUFkO0FBQ0FuQyxRQUFRb0MsSUFBUixHQUFlLEVBQWY7QUFDQXBDLFFBQVFxQyxPQUFSLEdBQWtCLEVBQWxCLEMsQ0FBc0I7QUFDdEJyQyxRQUFRc0MsUUFBUixHQUFtQixFQUFuQjs7QUFFQSxTQUFTQyxJQUFULEdBQWdCLENBQUU7O0FBRWxCdkMsUUFBUXdDLEVBQVIsR0FBYUQsSUFBYjtBQUNBdkMsUUFBUXlDLFdBQVIsR0FBc0JGLElBQXRCO0FBQ0F2QyxRQUFRMEMsSUFBUixHQUFlSCxJQUFmO0FBQ0F2QyxRQUFRMkMsR0FBUixHQUFjSixJQUFkO0FBQ0F2QyxRQUFRNEMsY0FBUixHQUF5QkwsSUFBekI7QUFDQXZDLFFBQVE2QyxrQkFBUixHQUE2Qk4sSUFBN0I7QUFDQXZDLFFBQVE4QyxJQUFSLEdBQWVQLElBQWY7QUFDQXZDLFFBQVErQyxlQUFSLEdBQTBCUixJQUExQjtBQUNBdkMsUUFBUWdELG1CQUFSLEdBQThCVCxJQUE5Qjs7QUFFQXZDLFFBQVFpRCxTQUFSLEdBQW9CLFVBQVVDLElBQVYsRUFBZ0I7QUFBRSxXQUFPLEVBQVA7QUFBVyxDQUFqRDs7QUFFQWxELFFBQVFtRCxPQUFSLEdBQWtCLFVBQVVELElBQVYsRUFBZ0I7QUFDOUIsVUFBTSxJQUFJaEYsS0FBSixDQUFVLGtDQUFWLENBQU47QUFDSCxDQUZEOztBQUlBOEIsUUFBUW9ELEdBQVIsR0FBYyxZQUFZO0FBQUUsV0FBTyxHQUFQO0FBQVksQ0FBeEM7QUFDQXBELFFBQVFxRCxLQUFSLEdBQWdCLFVBQVVDLEdBQVYsRUFBZTtBQUMzQixVQUFNLElBQUlwRixLQUFKLENBQVUsZ0NBQVYsQ0FBTjtBQUNILENBRkQ7QUFHQThCLFFBQVF1RCxLQUFSLEdBQWdCLFlBQVc7QUFBRSxXQUFPLENBQVA7QUFBVyxDQUF4QyxDOzs7Ozs7O0FDdkxBOzs7OztrQkFHd0JDLGE7O0FBRHhCOzs7Ozs7QUFDZSxTQUFTQSxhQUFULENBQXVCM0YsT0FBdkIsRUFBZ0M7QUFDM0MsV0FBUSxDQUFDQSxPQUFGLEdBQ1A7QUFBQSxlQUFNLHdCQUFTQSxPQUFULENBQU47QUFBQSxLQURPLEdBRVAsVUFBQ1EsT0FBRCxFQUFhO0FBQ1QsZUFBUSxDQUFDQSxPQUFGLEdBQ1BOLFFBQVFFLE1BQVIsQ0FBZSxJQUFJQyxLQUFKLENBQVUsaUJBQVYsQ0FBZixDQURPLEdBRVAsSUFBSUgsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUM3QixnQkFBSTtBQUNBLG9CQUFJd0YsU0FBU3BGLFFBQVFJLEdBQVIsQ0FBWUMsV0FBWixDQUF3QmIsT0FBeEIsRUFBaUNjLElBQWpDLENBQXNDLENBQXRDLENBQWI7QUFDQSxvQkFBSThFLE9BQU9DLFFBQVAsR0FBa0JDLEtBQWxCLE9BQThCRixPQUFPRSxLQUFQLEVBQWxDLEVBQWtEO0FBQzlDMUYsMkJBQU8sSUFBSUMsS0FBSixDQUFVLHFCQUFWLENBQVA7QUFDSCxpQkFGRCxNQUVPO0FBQ0hGLDRCQUFRSCxPQUFSO0FBQ0g7QUFDSixhQVBELENBUUEsT0FBTytGLEtBQVAsRUFBYztBQUNWNUYsd0JBQVFILE9BQVI7QUFDSDtBQUNKLFNBWkQsQ0FGQTtBQWVILEtBbEJEO0FBbUJILEU7Ozs7Ozs7QUN2QkQ7Ozs7O1FBSWdCZ0csYyxHQUFBQSxjOztBQUhoQjs7OztBQUNBOzs7Ozs7QUFFTyxTQUFTQSxjQUFULENBQXdCaEcsT0FBeEIsRUFBaUM7QUFDcEMsV0FBUSxDQUFDQSxPQUFGLEdBQ1BFLFFBQVFFLE1BQVIsQ0FBZSxJQUFJQyxLQUFKLENBQVUsaUJBQVYsQ0FBZixDQURPLEdBRVAsVUFBQzRGLEdBQUQsRUFBUztBQUNMLGVBQVEsQ0FBQ0EsR0FBRixHQUNQL0YsUUFBUUUsTUFBUixDQUFlLElBQUlDLEtBQUosQ0FBVSxlQUFWLENBQWYsQ0FETyxHQUVQLFVBQUNHLE9BQUQsRUFBYTtBQUNULG1CQUFRLENBQUNBLE9BQUYsR0FDUE4sUUFBUUUsTUFBUixDQUFlLElBQUlDLEtBQUosQ0FBVSxpQkFBVixDQUFmLENBRE8sR0FFUCx3QkFBU0wsT0FBVCxFQUNDQyxJQURELENBQ00sVUFBQ0QsT0FBRCxFQUFhO0FBQ2YsdUJBQU8sNkJBQWNBLE9BQWQsRUFBdUJRLE9BQXZCLENBQVA7QUFDSCxhQUhELEVBSUNQLElBSkQsQ0FJTSxVQUFDRCxPQUFELEVBQWE7QUFDZix1QkFBTyxJQUFJRSxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3BDLHdCQUFJO0FBQ0EsNEJBQU04RixLQUFLLFFBQVg7QUFDQSw0QkFBSUMsaUJBQWlCLEVBQXJCO0FBQ0FuRyxnQ0FBUW9HLEdBQVIsQ0FBWSxVQUFDcEYsT0FBRCxFQUFhO0FBQ3JCbUYsMkNBQWU1RSxJQUFmLENBQW9COEUsVUFBVXJGLE9BQVYsRUFBbUJpRixHQUFuQixFQUF3QnpGLE9BQXhCLENBQXBCO0FBQ0gseUJBRkQ7QUFHQU4sZ0NBQVFvRyxHQUFSLENBQVlILGNBQVosRUFBNEIsVUFBQ0ksTUFBRDtBQUFBLG1DQUFZcEcsUUFBUW9HLE1BQVIsQ0FBWjtBQUFBLHlCQUE1QjtBQUNILHFCQVBELENBT0UsT0FBT1IsS0FBUCxFQUFjO0FBQ1ozRiwrQkFBTzJGLEtBQVA7QUFDSDtBQUNKLGlCQVhNLENBQVA7QUFZSCxhQWpCRCxDQUZBO0FBb0JILFNBdkJEO0FBd0JILEtBM0JEO0FBNEJILEM7Ozs7Ozs7K0NDakNEOzs7OztRQVFnQlMsaUIsR0FBQUEsaUI7O0FBTmhCOztBQUNBOztBQUNBOztBQUVBLElBQU1DLGFBQWEsWUFBbkI7O0FBRU8sU0FBU0QsaUJBQVQsQ0FBMkJoRyxPQUEzQixFQUFvQztBQUN2QztBQUNBLFdBQVEsQ0FBQ0EsT0FBRixHQUNQTixRQUFRRSxNQUFSLENBQWUsd0JBQWYsQ0FETyxHQUVQLFVBQUNjLFlBQUQsRUFBa0I7QUFDZCxlQUFRLENBQUNBLFlBQUYsR0FDUGhCLFFBQVFFLE1BQVIsQ0FBZSw2QkFBZixDQURPLEdBRVAsVUFBQ3NHLFFBQUQsRUFBYztBQUNWLG1CQUFRLENBQUNBLFFBQUYsR0FDUHhHLFFBQVFFLE1BQVIsQ0FBZSx5QkFBZixDQURPLEdBRVAsVUFBQ3VHLGVBQUQsRUFBcUI7QUFDakIsdUJBQVEsQ0FBQ0EsZUFBRixHQUNQekcsUUFBUUUsTUFBUixDQUFlLGdDQUFmLENBRE8sR0FFUCxJQUFJRixPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQzdCLHdCQUFJd0csZUFBZSxFQUFuQjtBQUNBLHdEQUFlMUYsWUFBZixJQUNDakIsSUFERCxDQUNNLG9CQUFZO0FBQ2QsNEJBQUk7QUFDQTRHLHFDQUNDVCxHQURELENBQ0ssdUJBQWU7QUFDaEIsb0NBQUk7QUFDQSxvRkFBcUJVLFdBQXJCLEVBQWtDdEcsT0FBbEMsRUFDQ1AsSUFERCxDQUNNLHVCQUFlO0FBQ2pCOEcsZ0RBQVFDLEdBQVIsQ0FBWSxhQUFaLEVBQTJCQyxXQUEzQjtBQUNBLDRDQUFJQSxnQkFBZ0JSLFVBQXBCLEVBQWdDO0FBQzVCTSxvREFBUUMsR0FBUixDQUFZLFlBQVo7QUFDQUoseURBQWFyRixJQUFiLENBQWtCLHdEQUF5QmYsT0FBekIsRUFBa0NrRyxRQUFsQyxFQUE0Q0ksV0FBNUMsRUFBeURILGVBQXpELENBQWxCO0FBQ0g7QUFDSixxQ0FQRDtBQVFILGlDQVRELENBU0UsT0FBT1osS0FBUCxFQUFjLENBQUU7QUFDckIsNkJBWkQ7QUFhQTVELG9DQUFReUIsUUFBUixDQUFpQixZQUFNO0FBQ25CMUQsd0NBQVFvRyxHQUFSLENBQVlNLFlBQVosRUFDQzNHLElBREQsQ0FDTSxVQUFDaUgsWUFBRCxFQUFrQjtBQUNwQi9HLDRDQUFRK0csYUFBYSxDQUFiLENBQVI7QUFDSCxpQ0FIRDtBQUlILDZCQUxEO0FBTUgseUJBcEJELENBb0JFLE9BQU01RyxHQUFOLEVBQVc7QUFDVEYsbUNBQU9FLEdBQVA7QUFDSDtBQUNKLHFCQXpCRDtBQTBCSCxpQkE1QkQsQ0FGQTtBQStCSCxhQWxDRDtBQW1DSCxTQXRDRDtBQXVDSCxLQTFDRDtBQTJDSCxDOzs7Ozs7OztBQ3JERDs7Ozs7UUFFZ0I2Ryx3QixHQUFBQSx3QjtBQUFULFNBQVNBLHdCQUFULENBQWtDM0csT0FBbEMsRUFBMkM7QUFDOUMsV0FBUSxDQUFDQSxPQUFGLEdBQ1BOLFFBQVFFLE1BQVIsQ0FBZSxJQUFJQyxLQUFKLENBQVUsaUJBQVYsQ0FBZixDQURPLEdBRVAsVUFBQ3FHLFFBQUQsRUFBYztBQUNWLGVBQVEsQ0FBQ0EsUUFBRixHQUNQeEcsUUFBUUUsTUFBUixDQUFlLElBQUlDLEtBQUosQ0FBVSxrQkFBVixDQUFmLENBRE8sR0FFUCxVQUFDK0csZUFBRCxFQUFxQjtBQUNqQixtQkFBUSxDQUFDQSxlQUFGLEdBQ1BsSCxRQUFRRSxNQUFSLENBQWUsSUFBSUMsS0FBSixDQUFVLHlCQUFWLENBQWYsQ0FETyxHQUVQLFVBQUNzRyxlQUFELEVBQXFCO0FBQ2pCLHVCQUFRLENBQUNBLGVBQUYsR0FDUHpHLFFBQVFFLE1BQVIsQ0FBZSxJQUFJQyxLQUFKLENBQVUseUJBQVYsQ0FBZixDQURPLEdBRVAsSUFBSUgsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUM3Qix3QkFBSTtBQUNBLDRCQUFJaUgsa0JBQWdCWCxRQUFwQixDQURBLENBQ2dDO0FBQ2hDLDRCQUFJWSxhQUFhOUcsUUFBUUksR0FBUixDQUFZQyxXQUFaLE1BQTJCdUcsZUFBM0IsRUFBOEN0RyxJQUE5QyxDQUFtRCxDQUFuRCxDQUFqQjtBQUNBd0csbUNBQVdDLE9BQVgsQ0FBbUJGLFVBQW5CO0FBQ0EsNEJBQUk7QUFDQSxnQ0FBSXJHLFVBQVVSLFFBQVFRLE9BQVIsQ0FBZ0JILFdBQWhCLENBQTRCOEYsZUFBNUIsQ0FBZDtBQUNBLGdDQUFJLENBQUNXLFdBQVdFLFVBQVgsQ0FBc0JDLFdBQTNCLEVBQXdDO0FBQ3BDckgsdUNBQU8sSUFBSUMsS0FBSixDQUFVLDhCQUFWLENBQVA7QUFDSDtBQUNELGdDQUFJLENBQUNHLFFBQVErRyxPQUFiLEVBQXNCO0FBQ2xCL0csd0NBQVFrSCxjQUFSLENBQXVCSixVQUF2QixFQUFtQ3RHLE9BQW5DLEVBQ0NmLElBREQsQ0FDTSxxQkFBYTtBQUNmRSw0Q0FBUXdILFNBQVI7QUFDSCxpQ0FIRCxFQUlDekYsS0FKRCxDQUlPLFVBQUM1QixHQUFEO0FBQUEsMkNBQVNGLE9BQU9FLEdBQVAsQ0FBVDtBQUFBLGlDQUpQO0FBS0gsNkJBTkQsTUFNTztBQUNIRSx3Q0FBUStHLE9BQVIsQ0FBZ0IsRUFBRSxXQUFXdkcsT0FBYixFQUFzQixjQUFjc0csVUFBcEMsRUFBaEIsRUFDQ3JILElBREQsQ0FDTSxrQkFBVTtBQUNaRSw0Q0FBUW9HLE9BQU9xQixJQUFmO0FBQ0gsaUNBSEQ7QUFJSDtBQUNKLHlCQWpCRCxDQWlCRSxPQUFNdEgsR0FBTixFQUFXO0FBQ1Q7QUFDQUYsbUNBQU9FLEdBQVA7QUFDSDtBQUNKLHFCQXpCRCxDQXlCRSxPQUFPQSxHQUFQLEVBQVk7QUFDVkYsK0JBQU8sSUFBSUMsS0FBSixDQUFVLHFCQUFWLENBQVA7QUFDSDtBQUNKLGlCQTdCRCxDQUZBO0FBZ0NILGFBbkNEO0FBb0NILFNBdkNEO0FBd0NILEtBM0NEO0FBNENILEM7Ozs7Ozs7QUMvQ0Q7Ozs7O1FBRWdCd0gsZ0IsR0FBQUEsZ0I7QUFBVCxTQUFTQSxnQkFBVCxDQUEwQjdILE9BQTFCLEVBQW1DO0FBQ3RDLFdBQVEsQ0FBQ0EsT0FBRixHQUNQRSxRQUFRRSxNQUFSLENBQWUsdUJBQWYsQ0FETyxHQUVQLFVBQUNJLE9BQUQsRUFBYTtBQUNULGVBQVEsQ0FBQ0EsT0FBRixHQUNQTixRQUFRRSxNQUFSLENBQWUsd0JBQWYsQ0FETyxHQUVQLElBQUlGLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDN0IsZ0JBQU0wSCxZQUFZLFdBQWxCO0FBQ0EsZ0JBQU1yQixhQUFhLFlBQW5CO0FBQ0EsZ0JBQUk7QUFDQSxvQkFBSXNCLGNBQWN2SCxRQUFRSSxHQUFSLENBQVlDLFdBQVosQ0FBd0JiLE9BQXhCLENBQWxCO0FBQ0Esb0JBQUlnSSxhQUFhRCxZQUFZakgsSUFBWixDQUFpQixDQUFqQixDQUFqQjtBQUNBLG9CQUFJa0gsV0FBV25DLFFBQVgsR0FBc0JDLEtBQXRCLE9BQWtDa0MsV0FBV2xDLEtBQVgsRUFBdEMsRUFBMkQ7QUFDdkQzRiw0QkFBUXNHLFVBQVI7QUFDSCxpQkFGRCxNQUVPO0FBQ0h0Ryw0QkFBUTJILFNBQVI7QUFDSDtBQUNKLGFBUkQsQ0FRRSxPQUFPL0IsS0FBUCxFQUFjO0FBQ1ozRix1QkFBTzJGLEtBQVA7QUFDSDtBQUNKLFNBZEQsQ0FGQTtBQWlCSCxLQXBCRDtBQXFCSCxDOzs7Ozs7O0FDeEJEOzs7OztRQUVnQmtDLGdCLEdBQUFBLGdCO0FBQVQsU0FBU0EsZ0JBQVQsQ0FBMEJ6SCxPQUExQixFQUFtQztBQUN0QztBQUNBLFdBQVEsQ0FBQ0EsT0FBRixHQUNQTixRQUFRRSxNQUFSLENBQWUsd0JBQWYsQ0FETyxHQUVQLFVBQUM4SCxjQUFELEVBQW9CO0FBQ2hCLGVBQVEsQ0FBQ0EsY0FBRixHQUNQaEksUUFBUUUsTUFBUixDQUFlLDJCQUFmLENBRE8sR0FFUCxVQUFDdUgsU0FBRCxFQUFlO0FBQ1gsbUJBQVEsQ0FBQ0EsU0FBRixHQUNQekgsUUFBUUUsTUFBUixDQUFlLDBCQUFmLENBRE8sR0FFUCxJQUFJRixPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFhO0FBQ3JCLG9CQUFJZ0ksWUFBWTNILFFBQVFJLEdBQVIsQ0FBWUMsV0FBWixDQUF3QnFIO0FBQ3hDOzs7Ozs7Ozs7O0FBRGdCLGlCQUFoQixDQVdBLElBQUk7QUFDQTtBQUNBMUgsNEJBQVE0SCxjQUFSLENBQXVCRCxVQUFVckgsSUFBVixDQUFlLENBQWYsQ0FBdkIsRUFBMEM2RyxTQUExQyxFQUNDMUgsSUFERCxDQUNNLHdCQUFnQjtBQUNsQkUsZ0NBQVFrSSxZQUFSO0FBQ0gscUJBSEQsRUFJQ25HLEtBSkQ7QUFLSCxpQkFQRCxDQU9FLE9BQU01QixHQUFOLEVBQVc7QUFDVDtBQUNBLHdCQUFJZ0ksVUFBVTtBQUNWViw4QkFBTUQsU0FESTtBQUVWWSxvQ0FBWS9ILFFBQVFJLEdBQVIsQ0FBWUMsV0FBWixDQUF3QnFILGNBQXhCLEVBQXdDcEgsSUFGMUM7QUFHVmdGLCtCQUFPO0FBSEcscUJBQWQ7QUFLQXRGLDRCQUFRZ0ksT0FBUixDQUFnQkYsT0FBaEIsRUFDQ3JJLElBREQsQ0FDTSxVQUFDd0ksVUFBRCxFQUFnQjtBQUNsQnRJLGdDQUFRc0ksV0FBV2IsSUFBbkI7QUFDSCxxQkFIRDtBQUlIO0FBQ0osYUEvQkQsQ0FGQTtBQWtDSCxTQXJDRDtBQXNDSCxLQXpDRDtBQTBDSCxDOzs7Ozs7OytDQzlDRDs7Ozs7UUFRZ0JjLHFCLEdBQUFBLHFCOztBQU5oQjs7QUFDQTs7QUFDQTs7QUFFQSxJQUFNWixZQUFZLFdBQWxCOztBQUVPLFNBQVNZLHFCQUFULENBQStCMUksT0FBL0IsRUFBd0M7QUFDM0M7QUFDQSxXQUFRLENBQUNBLE9BQUYsR0FDUEUsUUFBUUUsTUFBUixDQUFlLHdCQUFmLENBRE8sR0FFUCxVQUFDSSxPQUFELEVBQWE7QUFDVCxlQUFRLENBQUNBLE9BQUYsR0FDUE4sUUFBUUUsTUFBUixDQUFlLHdCQUFmLENBRE8sR0FFUCxVQUFDYyxZQUFELEVBQWtCO0FBQ2QsbUJBQVEsQ0FBQ0EsWUFBRixHQUNQaEIsUUFBUUUsTUFBUixDQUFlLDZCQUFmLENBRE8sR0FFUCxJQUFJRixPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQzdCLG9CQUFJO0FBQ0Esd0JBQUl1SSxlQUFlLEVBQW5CO0FBQ0Esd0RBQWV6SCxZQUFmLElBQ0NqQixJQURELENBQ00sVUFBQzJJLFVBQUQsRUFBZ0I7QUFDbEJBLG1DQUNDeEMsR0FERCxDQUNLLFVBQUNVLFdBQUQsRUFBaUI7QUFDbEIsZ0NBQUk7QUFDQSxnRkFBcUJBLFdBQXJCLEVBQWtDdEcsT0FBbEMsRUFDQ1AsSUFERCxDQUNNLFVBQUNnSCxXQUFELEVBQWlCO0FBQ25CLHdDQUFJQSxnQkFBZ0JhLFNBQXBCLEVBQStCO0FBQzNCYSxxREFBYXBILElBQWIsQ0FBa0Isd0NBQWlCZixPQUFqQixFQUEwQnNHLFdBQTFCLEVBQXVDOUcsT0FBdkMsQ0FBbEI7QUFDSDtBQUNKLGlDQUxEO0FBTUgsNkJBUEQsQ0FPRSxPQUFPK0YsS0FBUCxFQUFjLENBQUU7QUFDckIseUJBVkQ7QUFXSCxxQkFiRDtBQWNBNUQsNEJBQVF5QixRQUFSLENBQWlCLFlBQU07QUFDbkIxRCxnQ0FBUW9HLEdBQVIsQ0FBWXFDLFlBQVosRUFDQzFJLElBREQsQ0FDTSxVQUFDNEksWUFBRCxFQUFrQjtBQUNwQjFJLG9DQUFRMEksWUFBUjtBQUNILHlCQUhEO0FBSUgscUJBTEQ7QUFNSCxpQkF0QkQsQ0FzQkUsT0FBT3ZJLEdBQVAsRUFBWTtBQUNWRiwyQkFBUSxJQUFJQyxLQUFKLENBQVdDLEdBQVgsQ0FBUjtBQUNIO0FBQ0osYUExQkQsQ0FGQTtBQTZCSCxTQWhDRDtBQWlDSCxLQXBDRDtBQXFDSCxDOzs7Ozs7OzsrQ0MvQ0Q7Ozs7O1FBRWdCd0ksYyxHQUFBQSxjO0FBQVQsU0FBU0EsY0FBVCxDQUF3QnBILFdBQXhCLEVBQXFDO0FBQ3hDO0FBQ0E7QUFDQSxXQUFRLENBQUNBLFdBQUYsR0FDUHhCLFFBQVFFLE1BQVIsQ0FBZSw0QkFBZixDQURPLEdBRVAsVUFBQ0ksT0FBRCxFQUFhO0FBQ1QsZUFBUSxDQUFDQSxPQUFGLEdBQ1BOLFFBQVFFLE1BQVIsQ0FBZSx3QkFBZixDQURPLEdBRVAsVUFBQ2MsWUFBRCxFQUFrQjtBQUNkLG1CQUFRLENBQUNBLFlBQUYsR0FDUGhCLFFBQVFFLE1BQVIsQ0FBZSw2QkFBZixDQURPLEdBRVAsSUFBSUYsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUM3QixvQkFBSTtBQUNBLHdCQUFJdUIsU0FBU25CLFFBQVFJLEdBQVIsQ0FBWUMsV0FBWixDQUF3QmEsV0FBeEIsQ0FBYjtBQUNBUixpQ0FBYWUsT0FBYixDQUFxQk4sT0FBT2IsSUFBUCxDQUFZLENBQVosRUFBZWMsS0FBZixDQUFxQixDQUFyQixFQUF3QkMsTUFBeEIsQ0FBK0JDLE1BQXBELEVBQTRESixXQUE1RDtBQUNBUyw0QkFBUTRHLFlBQVIsQ0FDSTVJLHNDQUFvQ3dCLE9BQU9iLElBQVAsQ0FBWSxDQUFaLEVBQWVjLEtBQWYsQ0FBcUIsQ0FBckIsRUFBd0JDLE1BQXhCLENBQStCQyxNQUFuRSxDQURKO0FBR0gsaUJBTkQsQ0FNRSxPQUFNeEIsR0FBTixFQUFXO0FBQ1RGLDJCQUFPRSxHQUFQO0FBQ0g7QUFDSixhQVZELENBRkE7QUFhSCxTQWhCRDtBQWlCSCxLQXBCRDtBQXFCSCxDOzs7Ozs7Ozs7Ozs7QUMxQkQsSUFBSTBJLENBQUo7O0FBRUE7QUFDQUEsSUFBSyxZQUFXO0FBQ2YsUUFBTyxJQUFQO0FBQ0EsQ0FGRyxFQUFKOztBQUlBLElBQUk7QUFDSDtBQUNBQSxLQUFJQSxLQUFLQyxTQUFTLGFBQVQsR0FBTCxJQUFrQyxDQUFDLEdBQUVDLElBQUgsRUFBUyxNQUFULENBQXRDO0FBQ0EsQ0FIRCxDQUdFLE9BQU12RyxDQUFOLEVBQVM7QUFDVjtBQUNBLEtBQUcsUUFBT3dHLE1BQVAseUNBQU9BLE1BQVAsT0FBa0IsUUFBckIsRUFDQ0gsSUFBSUcsTUFBSjtBQUNEOztBQUVEO0FBQ0E7QUFDQTs7QUFFQS9HLE9BQU9DLE9BQVAsR0FBaUIyRyxDQUFqQixDOzs7Ozs7O0FDcEJBOzs7OztrQkFHd0JJLFk7O0FBRHhCOzs7Ozs7QUFDZSxTQUFTQSxZQUFULENBQXNCcEosT0FBdEIsRUFBK0I7QUFDMUMsV0FBUSxDQUFDQSxPQUFGLEdBQ1A7QUFBQSxlQUFNLHdCQUFTQSxPQUFULENBQU47QUFBQSxLQURPLEdBRVAsVUFBQ1EsT0FBRCxFQUFhO0FBQ1QsZUFBUSxDQUFDQSxPQUFGLEdBQ1BOLFFBQVFFLE1BQVIsQ0FBZSxJQUFJQyxLQUFKLENBQVUsaUJBQVYsQ0FBZixDQURPLEdBRVAsSUFBSUgsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUM3QixnQkFBSU8saUJBQWlCSCxRQUFRSSxHQUFSLENBQVlDLFdBQVosQ0FBd0JiLE9BQXhCLENBQXJCO0FBQ0EsZ0JBQUlXLGVBQWVHLElBQWYsQ0FBb0IsQ0FBcEIsQ0FBSixFQUE0QjtBQUN4Qlgsd0JBQVFILE9BQVI7QUFDSCxhQUZELE1BRU87QUFDSCxvQkFBSTtBQUNBUSw0QkFBUVEsT0FBUixDQUFnQkgsV0FBaEIsQ0FBNEJiLE9BQTVCO0FBQ0FHLDRCQUFRSCxPQUFSO0FBQ0gsaUJBSEQsQ0FHRSxPQUFPTSxHQUFQLEVBQVk7QUFDVkYsMkJBQU8sSUFBSUMsS0FBSixDQUFVLG1CQUFWLENBQVA7QUFDSDtBQUNKO0FBQ0osU0FaRCxDQUZBO0FBZUgsS0FsQkQ7QUFtQkgsRTs7Ozs7Ozs7Ozs7QUN2QkQsQ0FBRSxhQUFVOztBQUVYO0FBQ0EsS0FBSWdKLElBQUo7QUFDQSxLQUFHLE9BQU9GLE1BQVAsS0FBa0IsV0FBckIsRUFBaUM7QUFBRUUsU0FBT0YsTUFBUDtBQUFlO0FBQ2xELEtBQUcsT0FBT0csTUFBUCxLQUFrQixXQUFyQixFQUFpQztBQUFFRCxTQUFPQyxNQUFQO0FBQWU7QUFDbERELFFBQU9BLFFBQVEsRUFBZjtBQUNBLEtBQUl0QyxVQUFVc0MsS0FBS3RDLE9BQUwsSUFBZ0IsRUFBQ0MsS0FBSyxlQUFVLENBQUUsQ0FBbEIsRUFBOUI7QUFDQSxVQUFTdUMsT0FBVCxDQUFpQkMsR0FBakIsRUFBcUI7QUFDcEIsU0FBT0EsSUFBSUMsS0FBSixHQUFXRixRQUFRcEosUUFBUXFKLEdBQVIsQ0FBUixDQUFYLEdBQW1DLFVBQVNFLEdBQVQsRUFBY0MsSUFBZCxFQUFtQjtBQUM1REgsT0FBSUUsTUFBTSxFQUFDckgsU0FBUyxFQUFWLEVBQVY7QUFDQWtILFdBQVFwSixRQUFRd0osSUFBUixDQUFSLElBQXlCRCxJQUFJckgsT0FBN0I7QUFDQSxHQUhEO0FBSUEsV0FBU2xDLE9BQVQsQ0FBaUJ3SixJQUFqQixFQUFzQjtBQUNyQixVQUFPQSxLQUFLQyxLQUFMLENBQVcsR0FBWCxFQUFnQkgsS0FBaEIsQ0FBc0IsQ0FBQyxDQUF2QixFQUEwQkksUUFBMUIsR0FBcUNDLE9BQXJDLENBQTZDLEtBQTdDLEVBQW1ELEVBQW5ELENBQVA7QUFDQTtBQUNEO0FBQ0QsS0FBRyxJQUFILEVBQWlDO0FBQUUsTUFBSUMsU0FBUzNILE1BQWI7QUFBcUI7QUFDeEQ7O0FBRUEsRUFBQ21ILFFBQVEsVUFBU25ILE1BQVQsRUFBZ0I7QUFDeEI7QUFDQSxNQUFJNEgsT0FBTyxFQUFYO0FBQ0E7QUFDQUEsT0FBS0MsR0FBTCxHQUFXRCxLQUFLRSxFQUFMLEdBQVUsRUFBQ0MsSUFBSSxZQUFTRCxFQUFULEVBQVk7QUFBRSxXQUFRLENBQUMsQ0FBQ0EsRUFBRixJQUFRLGNBQWMsT0FBT0EsRUFBckM7QUFBMEMsSUFBN0QsRUFBckI7QUFDQUYsT0FBS0ksRUFBTCxHQUFVLEVBQUNELElBQUksWUFBU0UsQ0FBVCxFQUFXO0FBQUUsV0FBUUEsYUFBYUMsT0FBYixJQUF3QixPQUFPRCxDQUFQLElBQVksU0FBNUM7QUFBd0QsSUFBMUUsRUFBVjtBQUNBTCxPQUFLTyxHQUFMLEdBQVcsRUFBQ0osSUFBSSxZQUFTSyxDQUFULEVBQVc7QUFBRSxXQUFPLENBQUNDLFFBQVFELENBQVIsQ0FBRCxLQUFpQkEsSUFBSUUsV0FBV0YsQ0FBWCxDQUFKLEdBQW9CLENBQXJCLElBQTJCLENBQTNCLElBQWdDRyxhQUFhSCxDQUE3QyxJQUFrRCxDQUFDRyxRQUFELEtBQWNILENBQWhGLENBQVA7QUFBMkYsSUFBN0csRUFBWDtBQUNBUixPQUFLWSxJQUFMLEdBQVksRUFBQ1QsSUFBSSxZQUFTVSxDQUFULEVBQVc7QUFBRSxXQUFRLE9BQU9BLENBQVAsSUFBWSxRQUFwQjtBQUErQixJQUFqRCxFQUFaO0FBQ0FiLE9BQUtZLElBQUwsQ0FBVUUsR0FBVixHQUFnQixVQUFTRCxDQUFULEVBQVc7QUFDMUIsT0FBR2IsS0FBS1ksSUFBTCxDQUFVVCxFQUFWLENBQWFVLENBQWIsQ0FBSCxFQUFtQjtBQUFFLFdBQU9BLENBQVA7QUFBVTtBQUMvQixPQUFHLE9BQU9FLElBQVAsS0FBZ0IsV0FBbkIsRUFBK0I7QUFBRSxXQUFPQSxLQUFLQyxTQUFMLENBQWVILENBQWYsQ0FBUDtBQUEwQjtBQUMzRCxVQUFRQSxLQUFLQSxFQUFFaEIsUUFBUixHQUFtQmdCLEVBQUVoQixRQUFGLEVBQW5CLEdBQWtDZ0IsQ0FBekM7QUFDQSxHQUpEO0FBS0FiLE9BQUtZLElBQUwsQ0FBVUssTUFBVixHQUFtQixVQUFTQyxDQUFULEVBQVlDLENBQVosRUFBYztBQUNoQyxPQUFJQyxJQUFJLEVBQVI7QUFDQUYsT0FBSUEsS0FBSyxFQUFULENBRmdDLENBRW5CO0FBQ2JDLE9BQUlBLEtBQUssK0RBQVQ7QUFDQSxVQUFNRCxJQUFJLENBQVYsRUFBWTtBQUFFRSxTQUFLRCxFQUFFRSxNQUFGLENBQVNDLEtBQUtDLEtBQUwsQ0FBV0QsS0FBS0wsTUFBTCxLQUFnQkUsRUFBRTlKLE1BQTdCLENBQVQsQ0FBTCxDQUFxRDZKO0FBQUs7QUFDeEUsVUFBT0UsQ0FBUDtBQUNBLEdBTkQ7QUFPQXBCLE9BQUtZLElBQUwsQ0FBVVksS0FBVixHQUFrQixVQUFTWCxDQUFULEVBQVlZLENBQVosRUFBYztBQUFFLE9BQUlDLElBQUksS0FBUjtBQUNqQ2IsT0FBSUEsS0FBSyxFQUFUO0FBQ0FZLE9BQUl6QixLQUFLWSxJQUFMLENBQVVULEVBQVYsQ0FBYXNCLENBQWIsSUFBaUIsRUFBQyxLQUFLQSxDQUFOLEVBQWpCLEdBQTRCQSxLQUFLLEVBQXJDLENBRitCLENBRVU7QUFDekMsT0FBR3pCLEtBQUsyQixHQUFMLENBQVNDLEdBQVQsQ0FBYUgsQ0FBYixFQUFlLEdBQWYsQ0FBSCxFQUF1QjtBQUFFWixRQUFJQSxFQUFFZ0IsV0FBRixFQUFKLENBQXFCSixFQUFFLEdBQUYsSUFBUyxDQUFDQSxFQUFFLEdBQUYsS0FBVUEsRUFBRSxHQUFGLENBQVgsRUFBbUJJLFdBQW5CLEVBQVQ7QUFBMkM7QUFDekYsT0FBRzdCLEtBQUsyQixHQUFMLENBQVNDLEdBQVQsQ0FBYUgsQ0FBYixFQUFlLEdBQWYsQ0FBSCxFQUF1QjtBQUFFLFdBQU9aLE1BQU1ZLEVBQUUsR0FBRixDQUFiO0FBQXFCO0FBQzlDLE9BQUd6QixLQUFLMkIsR0FBTCxDQUFTQyxHQUFULENBQWFILENBQWIsRUFBZSxHQUFmLENBQUgsRUFBdUI7QUFBRSxRQUFHWixFQUFFcEIsS0FBRixDQUFRLENBQVIsRUFBV2dDLEVBQUUsR0FBRixFQUFPcEssTUFBbEIsTUFBOEJvSyxFQUFFLEdBQUYsQ0FBakMsRUFBd0M7QUFBRUMsU0FBSSxJQUFKLENBQVViLElBQUlBLEVBQUVwQixLQUFGLENBQVFnQyxFQUFFLEdBQUYsRUFBT3BLLE1BQWYsQ0FBSjtBQUE0QixLQUFoRixNQUFzRjtBQUFFLFlBQU8sS0FBUDtBQUFjO0FBQUM7QUFDaEksT0FBRzJJLEtBQUsyQixHQUFMLENBQVNDLEdBQVQsQ0FBYUgsQ0FBYixFQUFlLEdBQWYsQ0FBSCxFQUF1QjtBQUFFLFFBQUdaLEVBQUVwQixLQUFGLENBQVEsQ0FBQ2dDLEVBQUUsR0FBRixFQUFPcEssTUFBaEIsTUFBNEJvSyxFQUFFLEdBQUYsQ0FBL0IsRUFBc0M7QUFBRUMsU0FBSSxJQUFKO0FBQVUsS0FBbEQsTUFBd0Q7QUFBRSxZQUFPLEtBQVA7QUFBYztBQUFDO0FBQ2xHLE9BQUcxQixLQUFLMkIsR0FBTCxDQUFTQyxHQUFULENBQWFILENBQWIsRUFBZSxHQUFmLENBQUgsRUFBdUI7QUFDdEIsUUFBR3pCLEtBQUs4QixJQUFMLENBQVUxRixHQUFWLENBQWM0RCxLQUFLOEIsSUFBTCxDQUFVM0IsRUFBVixDQUFhc0IsRUFBRSxHQUFGLENBQWIsSUFBc0JBLEVBQUUsR0FBRixDQUF0QixHQUErQixDQUFDQSxFQUFFLEdBQUYsQ0FBRCxDQUE3QyxFQUF1RCxVQUFTTSxDQUFULEVBQVc7QUFDcEUsU0FBR2xCLEVBQUVtQixPQUFGLENBQVVELENBQVYsS0FBZ0IsQ0FBbkIsRUFBcUI7QUFBRUwsVUFBSSxJQUFKO0FBQVUsTUFBakMsTUFBdUM7QUFBRSxhQUFPLElBQVA7QUFBYTtBQUN0RCxLQUZFLENBQUgsRUFFRztBQUFFLFlBQU8sS0FBUDtBQUFjO0FBQ25CO0FBQ0QsT0FBRzFCLEtBQUsyQixHQUFMLENBQVNDLEdBQVQsQ0FBYUgsQ0FBYixFQUFlLEdBQWYsQ0FBSCxFQUF1QjtBQUN0QixRQUFHekIsS0FBSzhCLElBQUwsQ0FBVTFGLEdBQVYsQ0FBYzRELEtBQUs4QixJQUFMLENBQVUzQixFQUFWLENBQWFzQixFQUFFLEdBQUYsQ0FBYixJQUFzQkEsRUFBRSxHQUFGLENBQXRCLEdBQStCLENBQUNBLEVBQUUsR0FBRixDQUFELENBQTdDLEVBQXVELFVBQVNNLENBQVQsRUFBVztBQUNwRSxTQUFHbEIsRUFBRW1CLE9BQUYsQ0FBVUQsQ0FBVixJQUFlLENBQWxCLEVBQW9CO0FBQUVMLFVBQUksSUFBSjtBQUFVLE1BQWhDLE1BQXNDO0FBQUUsYUFBTyxJQUFQO0FBQWE7QUFDckQsS0FGRSxDQUFILEVBRUc7QUFBRSxZQUFPLEtBQVA7QUFBYztBQUNuQjtBQUNELE9BQUcxQixLQUFLMkIsR0FBTCxDQUFTQyxHQUFULENBQWFILENBQWIsRUFBZSxHQUFmLENBQUgsRUFBdUI7QUFBRSxRQUFHWixJQUFJWSxFQUFFLEdBQUYsQ0FBUCxFQUFjO0FBQUVDLFNBQUksSUFBSjtBQUFVLEtBQTFCLE1BQWdDO0FBQUUsWUFBTyxLQUFQO0FBQWM7QUFBQztBQUMxRSxPQUFHMUIsS0FBSzJCLEdBQUwsQ0FBU0MsR0FBVCxDQUFhSCxDQUFiLEVBQWUsR0FBZixDQUFILEVBQXVCO0FBQUUsUUFBR1osSUFBSVksRUFBRSxHQUFGLENBQVAsRUFBYztBQUFFQyxTQUFJLElBQUo7QUFBVSxLQUExQixNQUFnQztBQUFFLFlBQU8sS0FBUDtBQUFjO0FBQUM7QUFDMUUsWUFBU08sS0FBVCxDQUFlcEIsQ0FBZixFQUFpQnFCLENBQWpCLEVBQW1CO0FBQUUsUUFBSTFCLElBQUksQ0FBQyxDQUFUO0FBQUEsUUFBWXBKLElBQUksQ0FBaEI7QUFBQSxRQUFtQitKLENBQW5CLENBQXNCLE9BQUtBLElBQUllLEVBQUU5SyxHQUFGLENBQVQsR0FBaUI7QUFBRSxTQUFHLENBQUMsRUFBRW9KLElBQUlLLEVBQUVtQixPQUFGLENBQVViLENBQVYsRUFBYVgsSUFBRSxDQUFmLENBQU4sQ0FBSixFQUE2QjtBQUFFLGFBQU8sS0FBUDtBQUFjO0FBQUMsS0FBQyxPQUFPLElBQVA7QUFBYSxJQW5CM0YsQ0FtQjRGO0FBQzNILE9BQUdSLEtBQUsyQixHQUFMLENBQVNDLEdBQVQsQ0FBYUgsQ0FBYixFQUFlLEdBQWYsQ0FBSCxFQUF1QjtBQUFFLFFBQUdRLE1BQU1wQixDQUFOLEVBQVNZLEVBQUUsR0FBRixDQUFULENBQUgsRUFBb0I7QUFBRUMsU0FBSSxJQUFKO0FBQVUsS0FBaEMsTUFBc0M7QUFBRSxZQUFPLEtBQVA7QUFBYztBQUFDLElBcEJqRCxDQW9Ca0Q7QUFDakYsVUFBT0EsQ0FBUDtBQUNBLEdBdEJEO0FBdUJBMUIsT0FBSzhCLElBQUwsR0FBWSxFQUFDM0IsSUFBSSxZQUFTZSxDQUFULEVBQVc7QUFBRSxXQUFRQSxhQUFhcEgsS0FBckI7QUFBNkIsSUFBL0MsRUFBWjtBQUNBa0csT0FBSzhCLElBQUwsQ0FBVUssSUFBVixHQUFpQnJJLE1BQU1JLFNBQU4sQ0FBZ0J1RixLQUFqQztBQUNBTyxPQUFLOEIsSUFBTCxDQUFVTSxJQUFWLEdBQWlCLFVBQVNDLENBQVQsRUFBVztBQUFFO0FBQzdCLFVBQU8sVUFBU0MsQ0FBVCxFQUFXQyxDQUFYLEVBQWE7QUFDbkIsUUFBRyxDQUFDRCxDQUFELElBQU0sQ0FBQ0MsQ0FBVixFQUFZO0FBQUUsWUFBTyxDQUFQO0FBQVUsS0FBQ0QsSUFBSUEsRUFBRUQsQ0FBRixDQUFKLENBQVVFLElBQUlBLEVBQUVGLENBQUYsQ0FBSjtBQUNuQyxRQUFHQyxJQUFJQyxDQUFQLEVBQVM7QUFBRSxZQUFPLENBQUMsQ0FBUjtBQUFXLEtBQXRCLE1BQTJCLElBQUdELElBQUlDLENBQVAsRUFBUztBQUFFLFlBQU8sQ0FBUDtBQUFVLEtBQXJCLE1BQ3RCO0FBQUUsWUFBTyxDQUFQO0FBQVU7QUFDakIsSUFKRDtBQUtBLEdBTkQ7QUFPQXZDLE9BQUs4QixJQUFMLENBQVUxRixHQUFWLEdBQWdCLFVBQVM4RSxDQUFULEVBQVlDLENBQVosRUFBZXFCLENBQWYsRUFBaUI7QUFBRSxVQUFPQyxRQUFRdkIsQ0FBUixFQUFXQyxDQUFYLEVBQWNxQixDQUFkLENBQVA7QUFBeUIsR0FBNUQ7QUFDQXhDLE9BQUs4QixJQUFMLENBQVVZLEtBQVYsR0FBa0IsQ0FBbEIsQ0FyRHdCLENBcURIO0FBQ3JCMUMsT0FBSzJCLEdBQUwsR0FBVyxFQUFDeEIsSUFBSSxZQUFTc0IsQ0FBVCxFQUFXO0FBQUUsV0FBT0EsSUFBSUEsYUFBYWtCLE1BQWIsSUFBdUJsQixFQUFFbUIsV0FBRixLQUFrQkQsTUFBMUMsSUFBcURBLE9BQU96SSxTQUFQLENBQWlCMkYsUUFBakIsQ0FBMEI5RyxJQUExQixDQUErQjBJLENBQS9CLEVBQWtDRCxLQUFsQyxDQUF3QyxvQkFBeEMsRUFBOEQsQ0FBOUQsTUFBcUUsUUFBN0gsR0FBd0ksS0FBL0k7QUFBc0osSUFBeEssRUFBWDtBQUNBeEIsT0FBSzJCLEdBQUwsQ0FBU2tCLEdBQVQsR0FBZSxVQUFTcEIsQ0FBVCxFQUFZUyxDQUFaLEVBQWVZLENBQWYsRUFBaUI7QUFBRSxVQUFPLENBQUNyQixLQUFHLEVBQUosRUFBUVMsQ0FBUixJQUFhWSxDQUFiLEVBQWdCckIsQ0FBdkI7QUFBMEIsR0FBNUQ7QUFDQXpCLE9BQUsyQixHQUFMLENBQVNDLEdBQVQsR0FBZSxVQUFTSCxDQUFULEVBQVlTLENBQVosRUFBYztBQUFFLFVBQU9ULEtBQUtrQixPQUFPekksU0FBUCxDQUFpQjZJLGNBQWpCLENBQWdDaEssSUFBaEMsQ0FBcUMwSSxDQUFyQyxFQUF3Q1MsQ0FBeEMsQ0FBWjtBQUF3RCxHQUF2RjtBQUNBbEMsT0FBSzJCLEdBQUwsQ0FBU3FCLEdBQVQsR0FBZSxVQUFTdkIsQ0FBVCxFQUFZWSxDQUFaLEVBQWM7QUFDNUIsT0FBRyxDQUFDWixDQUFKLEVBQU07QUFBRTtBQUFRO0FBQ2hCQSxLQUFFWSxDQUFGLElBQU8sSUFBUDtBQUNBLFVBQU9aLEVBQUVZLENBQUYsQ0FBUDtBQUNBLFVBQU9aLENBQVA7QUFDQSxHQUxEO0FBTUF6QixPQUFLMkIsR0FBTCxDQUFTc0IsRUFBVCxHQUFjLFVBQVN4QixDQUFULEVBQVlTLENBQVosRUFBZVksQ0FBZixFQUFrQkksQ0FBbEIsRUFBb0I7QUFBRSxVQUFPekIsRUFBRVMsQ0FBRixJQUFPVCxFQUFFUyxDQUFGLE1BQVNnQixNQUFNSixDQUFOLEdBQVMsRUFBVCxHQUFjQSxDQUF2QixDQUFkO0FBQXlDLEdBQTdFO0FBQ0E5QyxPQUFLMkIsR0FBTCxDQUFTYixHQUFULEdBQWUsVUFBU1csQ0FBVCxFQUFXO0FBQ3pCLE9BQUcwQixPQUFPMUIsQ0FBUCxDQUFILEVBQWE7QUFBRSxXQUFPQSxDQUFQO0FBQVU7QUFDekIsT0FBRztBQUFDQSxRQUFJVixLQUFLcUMsS0FBTCxDQUFXM0IsQ0FBWCxDQUFKO0FBQ0gsSUFERCxDQUNDLE9BQU05SSxDQUFOLEVBQVE7QUFBQzhJLFFBQUUsRUFBRjtBQUFLO0FBQ2YsVUFBT0EsQ0FBUDtBQUNBLEdBTEQsQ0FNRSxhQUFVO0FBQUUsT0FBSXlCLENBQUo7QUFDYixZQUFTOUcsR0FBVCxDQUFhMEcsQ0FBYixFQUFlWixDQUFmLEVBQWlCO0FBQ2hCLFFBQUdtQixRQUFRLElBQVIsRUFBYW5CLENBQWIsS0FBbUJnQixNQUFNLEtBQUtoQixDQUFMLENBQTVCLEVBQW9DO0FBQUU7QUFBUTtBQUM5QyxTQUFLQSxDQUFMLElBQVVZLENBQVY7QUFDQTtBQUNEOUMsUUFBSzJCLEdBQUwsQ0FBUzJCLEVBQVQsR0FBYyxVQUFTQyxJQUFULEVBQWVELEVBQWYsRUFBa0I7QUFDL0JBLFNBQUtBLE1BQU0sRUFBWDtBQUNBYixZQUFRYyxJQUFSLEVBQWNuSCxHQUFkLEVBQW1Ca0gsRUFBbkI7QUFDQSxXQUFPQSxFQUFQO0FBQ0EsSUFKRDtBQUtBLEdBVkMsR0FBRDtBQVdEdEQsT0FBSzJCLEdBQUwsQ0FBUzZCLElBQVQsR0FBZ0IsVUFBUy9CLENBQVQsRUFBVztBQUFFO0FBQzVCLFVBQU8sQ0FBQ0EsQ0FBRCxHQUFJQSxDQUFKLEdBQVFWLEtBQUtxQyxLQUFMLENBQVdyQyxLQUFLQyxTQUFMLENBQWVTLENBQWYsQ0FBWCxDQUFmLENBRDBCLENBQ29CO0FBQzlDLEdBRkQsQ0FHRSxhQUFVO0FBQ1gsWUFBU2dDLEtBQVQsQ0FBZVgsQ0FBZixFQUFpQjFMLENBQWpCLEVBQW1CO0FBQUUsUUFBSW9KLElBQUksS0FBS0EsQ0FBYjtBQUNwQixRQUFHQSxNQUFNcEosTUFBTW9KLENBQU4sSUFBWTJDLE9BQU8zQyxDQUFQLEtBQWE2QyxRQUFRN0MsQ0FBUixFQUFXcEosQ0FBWCxDQUEvQixDQUFILEVBQWtEO0FBQUU7QUFBUTtBQUM1RCxRQUFHQSxDQUFILEVBQUs7QUFBRSxZQUFPLElBQVA7QUFBYTtBQUNwQjtBQUNENEksUUFBSzJCLEdBQUwsQ0FBUzhCLEtBQVQsR0FBaUIsVUFBU2hDLENBQVQsRUFBWWpCLENBQVosRUFBYztBQUM5QixRQUFHLENBQUNpQixDQUFKLEVBQU07QUFBRSxZQUFPLElBQVA7QUFBYTtBQUNyQixXQUFPZ0IsUUFBUWhCLENBQVIsRUFBVWdDLEtBQVYsRUFBZ0IsRUFBQ2pELEdBQUVBLENBQUgsRUFBaEIsSUFBd0IsS0FBeEIsR0FBZ0MsSUFBdkM7QUFDQSxJQUhEO0FBSUEsR0FUQyxHQUFEO0FBVUQsR0FBRSxhQUFVO0FBQ1gsWUFBU0ssQ0FBVCxDQUFXd0IsQ0FBWCxFQUFhUyxDQUFiLEVBQWU7QUFDZCxRQUFHLE1BQU0vSSxVQUFVMUMsTUFBbkIsRUFBMEI7QUFDekJ3SixPQUFFYSxDQUFGLEdBQU1iLEVBQUVhLENBQUYsSUFBTyxFQUFiO0FBQ0FiLE9BQUVhLENBQUYsQ0FBSVcsQ0FBSixJQUFTUyxDQUFUO0FBQ0E7QUFDQSxLQUFDakMsRUFBRWEsQ0FBRixHQUFNYixFQUFFYSxDQUFGLElBQU8sRUFBYjtBQUNGYixNQUFFYSxDQUFGLENBQUluSyxJQUFKLENBQVM4SyxDQUFUO0FBQ0E7QUFDRCxPQUFJdkwsT0FBTzZMLE9BQU83TCxJQUFsQjtBQUNBa0osUUFBSzJCLEdBQUwsQ0FBU3ZGLEdBQVQsR0FBZSxVQUFTOEUsQ0FBVCxFQUFZQyxDQUFaLEVBQWVxQixDQUFmLEVBQWlCO0FBQy9CLFFBQUlVLENBQUo7QUFBQSxRQUFPOUwsSUFBSSxDQUFYO0FBQUEsUUFBY3NNLENBQWQ7QUFBQSxRQUFpQmhDLENBQWpCO0FBQUEsUUFBb0JpQyxFQUFwQjtBQUFBLFFBQXdCQyxHQUF4QjtBQUFBLFFBQTZCMUIsSUFBSTJCLE1BQU0xQyxDQUFOLENBQWpDO0FBQ0FOLE1BQUVhLENBQUYsR0FBTSxJQUFOO0FBQ0EsUUFBRzVLLFFBQVFxTSxPQUFPakMsQ0FBUCxDQUFYLEVBQXFCO0FBQ3BCeUMsVUFBS2hCLE9BQU83TCxJQUFQLENBQVlvSyxDQUFaLENBQUwsQ0FBcUIwQyxNQUFNLElBQU47QUFDckI7QUFDRCxRQUFHbkQsUUFBUVMsQ0FBUixLQUFjeUMsRUFBakIsRUFBb0I7QUFDbkJELFNBQUksQ0FBQ0MsTUFBTXpDLENBQVAsRUFBVTdKLE1BQWQ7QUFDQSxZQUFLRCxJQUFJc00sQ0FBVCxFQUFZdE0sR0FBWixFQUFnQjtBQUNmLFVBQUkwTSxLQUFNMU0sSUFBSTRJLEtBQUs4QixJQUFMLENBQVVZLEtBQXhCO0FBQ0EsVUFBR1IsQ0FBSCxFQUFLO0FBQ0pSLFdBQUlrQyxNQUFLekMsRUFBRXBJLElBQUYsQ0FBT3lKLEtBQUssSUFBWixFQUFrQnRCLEVBQUV5QyxHQUFHdk0sQ0FBSCxDQUFGLENBQWxCLEVBQTRCdU0sR0FBR3ZNLENBQUgsQ0FBNUIsRUFBbUN5SixDQUFuQyxDQUFMLEdBQTZDTSxFQUFFcEksSUFBRixDQUFPeUosS0FBSyxJQUFaLEVBQWtCdEIsRUFBRTlKLENBQUYsQ0FBbEIsRUFBd0IwTSxFQUF4QixFQUE0QmpELENBQTVCLENBQWpEO0FBQ0EsV0FBR2EsTUFBTXdCLENBQVQsRUFBVztBQUFFLGVBQU94QixDQUFQO0FBQVU7QUFDdkIsT0FIRCxNQUdPO0FBQ047QUFDQSxXQUFHUCxNQUFNRCxFQUFFMEMsTUFBS0QsR0FBR3ZNLENBQUgsQ0FBTCxHQUFhQSxDQUFmLENBQVQsRUFBMkI7QUFBRSxlQUFPdU0sS0FBSUEsR0FBR3ZNLENBQUgsQ0FBSixHQUFZME0sRUFBbkI7QUFBdUIsUUFGOUMsQ0FFK0M7QUFDckQ7QUFDRDtBQUNELEtBWkQsTUFZTztBQUNOLFVBQUkxTSxDQUFKLElBQVM4SixDQUFULEVBQVc7QUFDVixVQUFHZ0IsQ0FBSCxFQUFLO0FBQ0osV0FBR21CLFFBQVFuQyxDQUFSLEVBQVU5SixDQUFWLENBQUgsRUFBZ0I7QUFDZnNLLFlBQUljLElBQUdyQixFQUFFcEksSUFBRixDQUFPeUosQ0FBUCxFQUFVdEIsRUFBRTlKLENBQUYsQ0FBVixFQUFnQkEsQ0FBaEIsRUFBbUJ5SixDQUFuQixDQUFILEdBQTJCTSxFQUFFRCxFQUFFOUosQ0FBRixDQUFGLEVBQVFBLENBQVIsRUFBV3lKLENBQVgsQ0FBL0I7QUFDQSxZQUFHYSxNQUFNd0IsQ0FBVCxFQUFXO0FBQUUsZ0JBQU94QixDQUFQO0FBQVU7QUFDdkI7QUFDRCxPQUxELE1BS087QUFDTjtBQUNBLFdBQUdQLE1BQU1ELEVBQUU5SixDQUFGLENBQVQsRUFBYztBQUFFLGVBQU9BLENBQVA7QUFBVSxRQUZwQixDQUVxQjtBQUMzQjtBQUNEO0FBQ0Q7QUFDRCxXQUFPOEssSUFBR3JCLEVBQUVhLENBQUwsR0FBUzFCLEtBQUs4QixJQUFMLENBQVVZLEtBQVYsR0FBaUIsQ0FBakIsR0FBcUIsQ0FBQyxDQUF0QztBQUNBLElBaENEO0FBaUNBLEdBM0NDLEdBQUQ7QUE0Q0QxQyxPQUFLK0QsSUFBTCxHQUFZLEVBQVo7QUFDQS9ELE9BQUsrRCxJQUFMLENBQVU1RCxFQUFWLEdBQWUsVUFBU1UsQ0FBVCxFQUFXO0FBQUUsVUFBT0EsSUFBR0EsYUFBYW1ELElBQWhCLEdBQXdCLENBQUMsSUFBSUEsSUFBSixHQUFXQyxPQUFYLEVBQWhDO0FBQXVELEdBQW5GOztBQUVBLE1BQUlKLFFBQVE3RCxLQUFLRSxFQUFMLENBQVFDLEVBQXBCO0FBQ0EsTUFBSU0sVUFBVVQsS0FBSzhCLElBQUwsQ0FBVTNCLEVBQXhCO0FBQ0EsTUFBSXdCLE1BQU0zQixLQUFLMkIsR0FBZjtBQUFBLE1BQW9Cd0IsU0FBU3hCLElBQUl4QixFQUFqQztBQUFBLE1BQXFDa0QsVUFBVTFCLElBQUlDLEdBQW5EO0FBQUEsTUFBd0RhLFVBQVVkLElBQUl2RixHQUF0RTtBQUNBaEUsU0FBT0MsT0FBUCxHQUFpQjJILElBQWpCO0FBQ0EsRUFqSkEsRUFpSkVULE9BakpGLEVBaUpXLFFBakpYOztBQW1KRCxFQUFDQSxRQUFRLFVBQVNuSCxNQUFULEVBQWdCO0FBQ3hCO0FBQ0FBLFNBQU9DLE9BQVAsR0FBaUIsU0FBUzZMLElBQVQsQ0FBY0MsR0FBZCxFQUFtQjNFLEdBQW5CLEVBQXdCeUQsRUFBeEIsRUFBMkI7QUFDM0MsT0FBRyxDQUFDa0IsR0FBSixFQUFRO0FBQUUsV0FBTyxFQUFDYixJQUFJWSxJQUFMLEVBQVA7QUFBbUI7QUFDN0IsT0FBSUMsTUFBTSxDQUFDLEtBQUtBLEdBQUwsS0FBYSxLQUFLQSxHQUFMLEdBQVcsRUFBeEIsQ0FBRCxFQUE4QkEsR0FBOUIsTUFDVCxLQUFLQSxHQUFMLENBQVNBLEdBQVQsSUFBZ0IsRUFBQ0EsS0FBS0EsR0FBTixFQUFXYixJQUFJWSxLQUFLMUIsQ0FBTCxHQUFTO0FBQ3hDNEIsV0FBTSxnQkFBVSxDQUFFO0FBRHNCLEtBQXhCLEVBRFAsQ0FBVjtBQUlBLE9BQUc1RSxlQUFlUCxRQUFsQixFQUEyQjtBQUMxQixRQUFJb0YsS0FBSztBQUNSdkosVUFBS29KLEtBQUtwSixHQUFMLEtBQ0pvSixLQUFLcEosR0FBTCxHQUFXLFlBQVU7QUFDckIsVUFBRyxLQUFLc0osSUFBTCxLQUFjRixLQUFLMUIsQ0FBTCxDQUFPNEIsSUFBeEIsRUFBNkI7QUFBRSxjQUFPLENBQUMsQ0FBUjtBQUFXO0FBQzFDLFVBQUcsU0FBUyxLQUFLRSxHQUFMLENBQVNDLElBQXJCLEVBQTBCO0FBQ3pCLFlBQUtELEdBQUwsQ0FBU0MsSUFBVCxHQUFnQixLQUFLQyxJQUFyQjtBQUNBO0FBQ0QsV0FBS2xCLEVBQUwsQ0FBUWtCLElBQVIsR0FBZSxLQUFLQSxJQUFwQjtBQUNBLFdBQUtKLElBQUwsR0FBWUYsS0FBSzFCLENBQUwsQ0FBTzRCLElBQW5CO0FBQ0EsV0FBS0ksSUFBTCxDQUFVbEIsRUFBVixHQUFlLEtBQUtBLEVBQXBCO0FBQ0EsTUFUSSxDQURHO0FBV1JBLFNBQUlZLEtBQUsxQixDQVhEO0FBWVI0QixXQUFNNUUsR0FaRTtBQWFSOEUsVUFBS0gsR0FiRztBQWNSeEosU0FBSSxJQWRJO0FBZVJzSSxTQUFJQTtBQWZJLEtBQVQ7QUFpQkEsS0FBQ29CLEdBQUdHLElBQUgsR0FBVUwsSUFBSUksSUFBSixJQUFZSixHQUF2QixFQUE0QmIsRUFBNUIsR0FBaUNlLEVBQWpDO0FBQ0EsV0FBT0YsSUFBSUksSUFBSixHQUFXRixFQUFsQjtBQUNBO0FBQ0QsSUFBQ0YsTUFBTUEsSUFBSWIsRUFBWCxFQUFlYyxJQUFmLENBQW9CNUUsR0FBcEI7QUFDQSxVQUFPMkUsR0FBUDtBQUNBLEdBN0JEO0FBOEJBLEVBaENBLEVBZ0NFNUUsT0FoQ0YsRUFnQ1csUUFoQ1g7O0FBa0NELEVBQUNBLFFBQVEsVUFBU25ILE1BQVQsRUFBZ0I7QUFDeEI7QUFDQSxNQUFJcU0sS0FBS2xGLFFBQVEsUUFBUixDQUFUOztBQUVBLFdBQVNtRixLQUFULENBQWVDLE1BQWYsRUFBdUJDLEdBQXZCLEVBQTJCO0FBQzFCQSxTQUFNQSxPQUFPLEVBQWI7QUFDQUEsT0FBSTFJLEVBQUosR0FBUzBJLElBQUkxSSxFQUFKLElBQVUsR0FBbkI7QUFDQTBJLE9BQUlDLEdBQUosR0FBVUQsSUFBSUMsR0FBSixJQUFXLEdBQXJCO0FBQ0FELE9BQUlFLElBQUosR0FBV0YsSUFBSUUsSUFBSixJQUFZLFlBQVU7QUFDaEMsV0FBUSxDQUFDLElBQUlkLElBQUosRUFBRixHQUFnQjFDLEtBQUtMLE1BQUwsRUFBdkI7QUFDQSxJQUZEO0FBR0EsT0FBSXRHLEtBQUs4SixFQUFULENBUDBCLENBT2Q7O0FBRVo5SixNQUFHb0ssSUFBSCxHQUFVLFVBQVNDLEtBQVQsRUFBZTtBQUN4QixRQUFJRCxPQUFPLFNBQVBBLElBQU8sQ0FBU0UsRUFBVCxFQUFZO0FBQ3RCLFNBQUdGLEtBQUtqSyxHQUFMLElBQVlpSyxTQUFTLEtBQUtBLElBQTdCLEVBQWtDO0FBQ2pDLFdBQUtBLElBQUwsR0FBWSxJQUFaO0FBQ0EsYUFBTyxLQUFQO0FBQ0E7QUFDRCxTQUFHcEssR0FBR29LLElBQUgsQ0FBUUcsSUFBWCxFQUFnQjtBQUNmLGFBQU8sS0FBUDtBQUNBO0FBQ0QsU0FBR0QsRUFBSCxFQUFNO0FBQ0xBLFNBQUdFLEVBQUgsR0FBUUYsR0FBRy9FLEVBQVg7QUFDQStFLFNBQUduSyxHQUFIO0FBQ0FzSyxVQUFJbE0sS0FBSixDQUFVM0IsSUFBVixDQUFlME4sRUFBZjtBQUNBO0FBQ0QsWUFBTyxJQUFQO0FBQ0EsS0FkRDtBQUFBLFFBY0dHLE1BQU1MLEtBQUtLLEdBQUwsR0FBVyxVQUFTQyxHQUFULEVBQWNwQyxFQUFkLEVBQWlCO0FBQ3BDLFNBQUc4QixLQUFLakssR0FBUixFQUFZO0FBQUU7QUFBUTtBQUN0QixTQUFHdUssZUFBZXBHLFFBQWxCLEVBQTJCO0FBQzFCdEUsU0FBR29LLElBQUgsQ0FBUUcsSUFBUixHQUFlLElBQWY7QUFDQUcsVUFBSXRNLElBQUosQ0FBU2tLLEVBQVQ7QUFDQXRJLFNBQUdvSyxJQUFILENBQVFHLElBQVIsR0FBZSxLQUFmO0FBQ0E7QUFDQTtBQUNESCxVQUFLakssR0FBTCxHQUFXLElBQVg7QUFDQSxTQUFJMUQsSUFBSSxDQUFSO0FBQUEsU0FBV2tPLElBQUlGLElBQUlsTSxLQUFuQjtBQUFBLFNBQTBCZ0ksSUFBSW9FLEVBQUVqTyxNQUFoQztBQUFBLFNBQXdDa08sR0FBeEM7QUFDQUgsU0FBSWxNLEtBQUosR0FBWSxFQUFaO0FBQ0EsU0FBRzZMLFNBQVNTLEdBQUdULElBQWYsRUFBb0I7QUFDbkJTLFNBQUdULElBQUgsR0FBVSxJQUFWO0FBQ0E7QUFDRCxVQUFJM04sQ0FBSixFQUFPQSxJQUFJOEosQ0FBWCxFQUFjOUosR0FBZCxFQUFrQjtBQUFFbU8sWUFBTUQsRUFBRWxPLENBQUYsQ0FBTjtBQUNuQm1PLFVBQUlyRixFQUFKLEdBQVNxRixJQUFJSixFQUFiO0FBQ0FJLFVBQUlKLEVBQUosR0FBUyxJQUFUO0FBQ0F4SyxTQUFHb0ssSUFBSCxDQUFRRyxJQUFSLEdBQWUsSUFBZjtBQUNBSyxVQUFJRSxHQUFKLENBQVE5SyxFQUFSLENBQVc0SyxJQUFJcEIsR0FBZixFQUFvQm9CLElBQUlyRixFQUF4QixFQUE0QnFGLEdBQTVCO0FBQ0E1SyxTQUFHb0ssSUFBSCxDQUFRRyxJQUFSLEdBQWUsS0FBZjtBQUNBO0FBQ0QsS0FuQ0Q7QUFBQSxRQW1DR00sS0FBS1IsTUFBTXhDLENBbkNkO0FBb0NBNEMsUUFBSVosSUFBSixHQUFXZ0IsR0FBR1QsSUFBSCxJQUFXLENBQUNTLEdBQUdoQixJQUFILElBQVMsRUFBQ2hDLEdBQUUsRUFBSCxFQUFWLEVBQWtCQSxDQUFsQixDQUFvQnVDLElBQTFDO0FBQ0EsUUFBR0ssSUFBSVosSUFBUCxFQUFZO0FBQ1hZLFNBQUlaLElBQUosQ0FBU0osSUFBVCxHQUFnQlcsSUFBaEI7QUFDQTtBQUNESyxRQUFJbE0sS0FBSixHQUFZLEVBQVo7QUFDQXNNLE9BQUdULElBQUgsR0FBVUEsSUFBVjtBQUNBLFdBQU9LLEdBQVA7QUFDQSxJQTVDRDtBQTZDQSxVQUFPekssRUFBUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBSStLLE1BQU0vSyxHQUFHK0ssR0FBSCxHQUFTLFVBQVNQLEVBQVQsRUFBYWxDLEVBQWIsRUFBZ0I7QUFDbEMsUUFBRyxDQUFDeUMsSUFBSS9LLEVBQVIsRUFBVztBQUFFK0ssU0FBSS9LLEVBQUosR0FBUzhKLEdBQUdrQixLQUFILEVBQVQ7QUFBcUI7QUFDbEMsUUFBSXpKLEtBQUswSSxJQUFJRSxJQUFKLEVBQVQ7QUFDQSxRQUFHSyxFQUFILEVBQU07QUFBRU8sU0FBSS9LLEVBQUosQ0FBT3VCLEVBQVAsRUFBV2lKLEVBQVgsRUFBZWxDLEVBQWY7QUFBb0I7QUFDNUIsV0FBTy9HLEVBQVA7QUFDQSxJQUxEO0FBTUF3SixPQUFJbEQsQ0FBSixHQUFRb0MsSUFBSTFJLEVBQVo7QUFDQXZCLE1BQUdpTCxHQUFILEdBQVMsVUFBU0osRUFBVCxFQUFhSyxLQUFiLEVBQW1CO0FBQzNCLFFBQUcsQ0FBQ0wsRUFBRCxJQUFPLENBQUNLLEtBQVIsSUFBaUIsQ0FBQ0gsSUFBSS9LLEVBQXpCLEVBQTRCO0FBQUU7QUFBUTtBQUN0QyxRQUFJdUIsS0FBS3NKLEdBQUdaLElBQUkxSSxFQUFQLEtBQWNzSixFQUF2QjtBQUNBLFFBQUcsQ0FBQ0UsSUFBSUksR0FBSixDQUFRNUosRUFBUixDQUFKLEVBQWdCO0FBQUU7QUFBUTtBQUMxQndKLFFBQUkvSyxFQUFKLENBQU91QixFQUFQLEVBQVcySixLQUFYO0FBQ0EsV0FBTyxJQUFQO0FBQ0EsSUFORDtBQU9BbEwsTUFBR2lMLEdBQUgsQ0FBT3BELENBQVAsR0FBV29DLElBQUlDLEdBQWY7O0FBR0EsVUFBT2xLLEVBQVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBQSxNQUFHQSxFQUFILENBQU0sT0FBTixFQUFlLFNBQVNvTCxLQUFULENBQWVSLEdBQWYsRUFBbUI7QUFDakMsUUFBSWhCLE9BQU9nQixJQUFJNUssRUFBSixDQUFPNEosSUFBbEI7QUFBQSxRQUF3QmMsR0FBeEI7QUFDQSxRQUFHLFNBQVNFLElBQUlwQixHQUFiLElBQW9CNkIsSUFBSWhCLEtBQUosQ0FBVUEsS0FBVixDQUFnQmlCLEtBQWhCLEtBQTBCVixJQUFJckYsRUFBckQsRUFBd0Q7QUFBRTtBQUN6RCxTQUFHLENBQUNtRixNQUFNRSxJQUFJRSxHQUFYLEtBQW1CSixJQUFJTixJQUExQixFQUErQjtBQUM5QixVQUFHTSxJQUFJTixJQUFKLENBQVNRLEdBQVQsQ0FBSCxFQUFpQjtBQUNoQjtBQUNBO0FBQ0Q7QUFDRDtBQUNELFFBQUcsQ0FBQ2hCLElBQUosRUFBUztBQUFFO0FBQVE7QUFDbkIsUUFBR2dCLElBQUk1SyxFQUFKLENBQU95QixHQUFWLEVBQWM7QUFDYixTQUFJQSxNQUFNbUosSUFBSTVLLEVBQUosQ0FBT3lCLEdBQWpCO0FBQUEsU0FBc0IwRyxDQUF0QjtBQUNBLFVBQUksSUFBSVosQ0FBUixJQUFhOUYsR0FBYixFQUFpQjtBQUFFMEcsVUFBSTFHLElBQUk4RixDQUFKLENBQUo7QUFDbEIsVUFBR1ksQ0FBSCxFQUFLO0FBQ0o3SCxZQUFLNkgsQ0FBTCxFQUFReUMsR0FBUixFQUFhUSxLQUFiO0FBQ0E7QUFDRDtBQUNEOzs7Ozs7OztBQVFBLEtBZkQsTUFlTztBQUNOOUssVUFBS3NKLElBQUwsRUFBV2dCLEdBQVgsRUFBZ0JRLEtBQWhCO0FBQ0E7QUFDRCxRQUFHeEIsU0FBU2dCLElBQUk1SyxFQUFKLENBQU80SixJQUFuQixFQUF3QjtBQUN2QndCLFdBQU1SLEdBQU47QUFDQTtBQUNELElBL0JEO0FBZ0NBLFlBQVN0SyxJQUFULENBQWNzSixJQUFkLEVBQW9CZ0IsR0FBcEIsRUFBeUJRLEtBQXpCLEVBQWdDZCxFQUFoQyxFQUFtQztBQUNsQyxRQUFHVixnQkFBZ0J6SyxLQUFuQixFQUF5QjtBQUN4QnlMLFNBQUlyRixFQUFKLENBQU8vRixLQUFQLENBQWFvTCxJQUFJdEMsRUFBakIsRUFBcUJzQixLQUFLaEwsTUFBTCxDQUFZMEwsTUFBSU0sR0FBaEIsQ0FBckI7QUFDQSxLQUZELE1BRU87QUFDTkEsU0FBSXJGLEVBQUosQ0FBT25ILElBQVAsQ0FBWXdNLElBQUl0QyxFQUFoQixFQUFvQnNCLElBQXBCLEVBQTBCVSxNQUFJTSxHQUE5QjtBQUNBO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7OztBQWVBNUssTUFBR0EsRUFBSCxDQUFNLE1BQU4sRUFBYyxVQUFTc0ssRUFBVCxFQUFZO0FBQ3pCLFFBQUloSixNQUFNZ0osR0FBR3pGLEdBQUgsQ0FBT3ZELEdBQWpCO0FBQ0EsUUFBRyxTQUFTZ0osR0FBR2QsR0FBWixJQUFtQmxJLEdBQW5CLElBQTBCLENBQUNBLElBQUl1RyxDQUFKLENBQU0wRCxJQUFwQyxFQUF5QztBQUFFO0FBQzFDLE1BQUNqQixHQUFHdEssRUFBSCxDQUFNeUIsR0FBTixHQUFZNkksR0FBR3RLLEVBQUgsQ0FBTXlCLEdBQU4sSUFBYSxFQUExQixFQUE4QkgsSUFBSXVHLENBQUosQ0FBTXRHLEVBQU4sS0FBYUQsSUFBSXVHLENBQUosQ0FBTXRHLEVBQU4sR0FBV29GLEtBQUtMLE1BQUwsRUFBeEIsQ0FBOUIsSUFBd0VnRSxHQUFHekYsR0FBM0U7QUFDQTtBQUNEeUYsT0FBR3RLLEVBQUgsQ0FBTTRKLElBQU4sR0FBYVUsR0FBR3pGLEdBQWhCO0FBQ0EsSUFORDtBQU9BLFVBQU83RSxFQUFQO0FBQ0E7QUFDRHZDLFNBQU9DLE9BQVAsR0FBaUJxTSxLQUFqQjtBQUNBLEVBdEpBLEVBc0pFbkYsT0F0SkYsRUFzSlcsU0F0Slg7O0FBd0pELEVBQUNBLFFBQVEsVUFBU25ILE1BQVQsRUFBZ0I7QUFDeEI7QUFDQSxNQUFJNEgsT0FBT1QsUUFBUSxRQUFSLENBQVg7QUFDQSxXQUFTNkIsQ0FBVCxDQUFXK0UsS0FBWCxFQUFrQmhCLEVBQWxCLEVBQXNCcEIsSUFBdEIsRUFBMkI7QUFBRTtBQUM1QjNDLEtBQUUyQyxJQUFGLEdBQVNBLElBQVQ7QUFDQTNDLEtBQUVnRixPQUFGLENBQVU3TyxJQUFWLENBQWUsRUFBQzhPLE1BQU1GLEtBQVAsRUFBY0osT0FBT1osTUFBTSxZQUFVLENBQUUsQ0FBdkMsRUFBZjtBQUNBLE9BQUcvRCxFQUFFa0YsT0FBRixHQUFZSCxLQUFmLEVBQXFCO0FBQUU7QUFBUTtBQUMvQi9FLEtBQUVtRixHQUFGLENBQU1KLEtBQU47QUFDQTtBQUNEL0UsSUFBRWdGLE9BQUYsR0FBWSxFQUFaO0FBQ0FoRixJQUFFa0YsT0FBRixHQUFZM0YsUUFBWjtBQUNBUyxJQUFFZ0IsSUFBRixHQUFTcEMsS0FBSzhCLElBQUwsQ0FBVU0sSUFBVixDQUFlLE1BQWYsQ0FBVDtBQUNBaEIsSUFBRW1GLEdBQUYsR0FBUSxVQUFTQyxNQUFULEVBQWdCO0FBQ3ZCLE9BQUc3RixhQUFhUyxFQUFFa0YsT0FBRixHQUFZRSxNQUF6QixDQUFILEVBQW9DO0FBQUU7QUFBUTtBQUM5QyxPQUFJQyxNQUFNckYsRUFBRTJDLElBQUYsRUFBVjtBQUNBeUMsWUFBVUEsVUFBVUMsR0FBWCxHQUFpQixDQUFqQixHQUFzQkQsU0FBU0MsR0FBeEM7QUFDQTdOLGdCQUFhd0ksRUFBRWxGLEVBQWY7QUFDQWtGLEtBQUVsRixFQUFGLEdBQU94RCxXQUFXMEksRUFBRXNGLEtBQWIsRUFBb0JGLE1BQXBCLENBQVA7QUFDQSxHQU5EO0FBT0FwRixJQUFFdUYsSUFBRixHQUFTLFVBQVNDLElBQVQsRUFBZXhQLENBQWYsRUFBa0JnRixHQUFsQixFQUFzQjtBQUM5QixPQUFJcUosTUFBTSxJQUFWO0FBQ0EsT0FBRyxDQUFDbUIsSUFBSixFQUFTO0FBQUU7QUFBUTtBQUNuQixPQUFHQSxLQUFLUCxJQUFMLElBQWFaLElBQUlnQixHQUFwQixFQUF3QjtBQUN2QixRQUFHRyxLQUFLYixLQUFMLFlBQXNCOUcsUUFBekIsRUFBa0M7QUFDakN2RyxnQkFBVyxZQUFVO0FBQUVrTyxXQUFLYixLQUFMO0FBQWMsTUFBckMsRUFBc0MsQ0FBdEM7QUFDQTtBQUNELElBSkQsTUFJTztBQUNOTixRQUFJYSxPQUFKLEdBQWViLElBQUlhLE9BQUosR0FBY00sS0FBS1AsSUFBcEIsR0FBMkJaLElBQUlhLE9BQS9CLEdBQXlDTSxLQUFLUCxJQUE1RDtBQUNBakssUUFBSXdLLElBQUo7QUFDQTtBQUNELEdBWEQ7QUFZQXhGLElBQUVzRixLQUFGLEdBQVUsWUFBVTtBQUNuQixPQUFJakIsTUFBTSxFQUFDZ0IsS0FBS3JGLEVBQUUyQyxJQUFGLEVBQU4sRUFBZ0J1QyxTQUFTM0YsUUFBekIsRUFBVjtBQUNBUyxLQUFFZ0YsT0FBRixDQUFVaEUsSUFBVixDQUFlaEIsRUFBRWdCLElBQWpCO0FBQ0FoQixLQUFFZ0YsT0FBRixHQUFZcEcsS0FBSzhCLElBQUwsQ0FBVTFGLEdBQVYsQ0FBY2dGLEVBQUVnRixPQUFoQixFQUF5QmhGLEVBQUV1RixJQUEzQixFQUFpQ2xCLEdBQWpDLEtBQXlDLEVBQXJEO0FBQ0FyRSxLQUFFbUYsR0FBRixDQUFNZCxJQUFJYSxPQUFWO0FBQ0EsR0FMRDtBQU1BbE8sU0FBT0MsT0FBUCxHQUFpQitJLENBQWpCO0FBQ0EsRUF0Q0EsRUFzQ0U3QixPQXRDRixFQXNDVyxZQXRDWDs7QUF3Q0QsRUFBQ0EsUUFBUSxVQUFTbkgsTUFBVCxFQUFnQjtBQUN4QjtBQUNBLFdBQVN5TyxHQUFULENBQWFDLFlBQWIsRUFBMkJDLGFBQTNCLEVBQTBDQyxZQUExQyxFQUF3REMsYUFBeEQsRUFBdUVDLFlBQXZFLEVBQW9GO0FBQ25GLE9BQUdKLGVBQWVDLGFBQWxCLEVBQWdDO0FBQy9CLFdBQU8sRUFBQ0ksT0FBTyxJQUFSLEVBQVAsQ0FEK0IsQ0FDVDtBQUN0QjtBQUNELE9BQUdKLGdCQUFnQkMsWUFBbkIsRUFBZ0M7QUFDL0IsV0FBTyxFQUFDSSxZQUFZLElBQWIsRUFBUCxDQUQrQixDQUNKO0FBRTNCO0FBQ0QsT0FBR0osZUFBZUQsYUFBbEIsRUFBZ0M7QUFDL0IsV0FBTyxFQUFDTSxVQUFVLElBQVgsRUFBaUJDLFVBQVUsSUFBM0IsRUFBUCxDQUQrQixDQUNVO0FBRXpDO0FBQ0QsT0FBR1Asa0JBQWtCQyxZQUFyQixFQUFrQztBQUNqQ0Msb0JBQWdCTSxRQUFRTixhQUFSLEtBQTBCLEVBQTFDO0FBQ0FDLG1CQUFlSyxRQUFRTCxZQUFSLEtBQXlCLEVBQXhDO0FBQ0EsUUFBR0Qsa0JBQWtCQyxZQUFyQixFQUFrQztBQUFFO0FBQ25DLFlBQU8sRUFBQ2YsT0FBTyxJQUFSLEVBQVA7QUFDQTtBQUNEOzs7Ozs7OztBQVFBLFFBQUdjLGdCQUFnQkMsWUFBbkIsRUFBZ0M7QUFBRTtBQUNqQyxZQUFPLEVBQUNHLFVBQVUsSUFBWCxFQUFpQkcsU0FBUyxJQUExQixFQUFQO0FBQ0E7QUFDRCxRQUFHTixlQUFlRCxhQUFsQixFQUFnQztBQUFFO0FBQ2pDLFlBQU8sRUFBQ0ksVUFBVSxJQUFYLEVBQWlCQyxVQUFVLElBQTNCLEVBQVA7QUFDQTtBQUNEO0FBQ0QsVUFBTyxFQUFDaFIsS0FBSyx3QkFBdUIyUSxhQUF2QixHQUFzQyxNQUF0QyxHQUE4Q0MsWUFBOUMsR0FBNEQsTUFBNUQsR0FBb0VILGFBQXBFLEdBQW1GLE1BQW5GLEdBQTJGQyxZQUEzRixHQUF5RyxHQUEvRyxFQUFQO0FBQ0E7QUFDRCxNQUFHLE9BQU9qRyxJQUFQLEtBQWdCLFdBQW5CLEVBQStCO0FBQzlCLFNBQU0sSUFBSTFLLEtBQUosQ0FDTCxpRUFDQSxrREFGSyxDQUFOO0FBSUE7QUFDRCxNQUFJa1IsVUFBVXhHLEtBQUtDLFNBQW5CO0FBQUEsTUFBOEJ5RyxTQUE5QjtBQUNBclAsU0FBT0MsT0FBUCxHQUFpQndPLEdBQWpCO0FBQ0EsRUE3Q0EsRUE2Q0V0SCxPQTdDRixFQTZDVyxPQTdDWDs7QUErQ0QsRUFBQ0EsUUFBUSxVQUFTbkgsTUFBVCxFQUFnQjtBQUN4QixNQUFJNEgsT0FBT1QsUUFBUSxRQUFSLENBQVg7QUFDQSxNQUFJbUksTUFBTSxFQUFWO0FBQ0FBLE1BQUl2SCxFQUFKLEdBQVMsVUFBUzJDLENBQVQsRUFBVztBQUFFO0FBQ3JCLE9BQUdBLE1BQU1JLENBQVQsRUFBVztBQUFFLFdBQU8sS0FBUDtBQUFjO0FBQzNCLE9BQUdKLE1BQU0sSUFBVCxFQUFjO0FBQUUsV0FBTyxJQUFQO0FBQWEsSUFGVixDQUVXO0FBQzlCLE9BQUdBLE1BQU1uQyxRQUFULEVBQWtCO0FBQUUsV0FBTyxLQUFQO0FBQWMsSUFIZixDQUdnQjtBQUNuQyxPQUFHZ0gsUUFBUTdFLENBQVIsQ0FBVztBQUFYLFFBQ0E4RSxNQUFNOUUsQ0FBTixDQUFTO0FBQVQsSUFEQSxJQUVBK0UsT0FBTy9FLENBQVAsQ0FGSCxFQUVhO0FBQUU7QUFDZCxXQUFPLElBQVAsQ0FEWSxDQUNDO0FBQ2I7QUFDRCxVQUFPNEUsSUFBSUksR0FBSixDQUFRM0gsRUFBUixDQUFXMkMsQ0FBWCxLQUFpQixLQUF4QixDQVRtQixDQVNZO0FBQy9CLEdBVkQ7QUFXQTRFLE1BQUlJLEdBQUosR0FBVSxFQUFDdEYsR0FBRyxHQUFKLEVBQVY7QUFDQSxHQUFFLGFBQVU7QUFDWGtGLE9BQUlJLEdBQUosQ0FBUTNILEVBQVIsR0FBYSxVQUFTMkMsQ0FBVCxFQUFXO0FBQUU7QUFDekIsUUFBR0EsS0FBS0EsRUFBRWlGLElBQUYsQ0FBTCxJQUFnQixDQUFDakYsRUFBRU4sQ0FBbkIsSUFBd0JXLE9BQU9MLENBQVAsQ0FBM0IsRUFBcUM7QUFBRTtBQUN0QyxTQUFJckIsSUFBSSxFQUFSO0FBQ0FnQixhQUFRSyxDQUFSLEVBQVcxRyxHQUFYLEVBQWdCcUYsQ0FBaEI7QUFDQSxTQUFHQSxFQUFFdkYsRUFBTCxFQUFRO0FBQUU7QUFDVCxhQUFPdUYsRUFBRXZGLEVBQVQsQ0FETyxDQUNNO0FBQ2I7QUFDRDtBQUNELFdBQU8sS0FBUCxDQVJ1QixDQVFUO0FBQ2QsSUFURDtBQVVBLFlBQVNFLEdBQVQsQ0FBYWdGLENBQWIsRUFBZ0JjLENBQWhCLEVBQWtCO0FBQUUsUUFBSVQsSUFBSSxJQUFSLENBQUYsQ0FBZ0I7QUFDakMsUUFBR0EsRUFBRXZGLEVBQUwsRUFBUTtBQUFFLFlBQU91RixFQUFFdkYsRUFBRixHQUFPLEtBQWQ7QUFBcUIsS0FEZCxDQUNlO0FBQ2hDLFFBQUdnRyxLQUFLNkYsSUFBTCxJQUFhSixRQUFRdkcsQ0FBUixDQUFoQixFQUEyQjtBQUFFO0FBQzVCSyxPQUFFdkYsRUFBRixHQUFPa0YsQ0FBUCxDQUQwQixDQUNoQjtBQUNWLEtBRkQsTUFFTztBQUNOLFlBQU9LLEVBQUV2RixFQUFGLEdBQU8sS0FBZCxDQURNLENBQ2U7QUFDckI7QUFDRDtBQUNELEdBbkJDLEdBQUQ7QUFvQkR3TCxNQUFJSSxHQUFKLENBQVFoSCxHQUFSLEdBQWMsVUFBU0QsQ0FBVCxFQUFXO0FBQUUsVUFBT21ILFFBQVEsRUFBUixFQUFZRCxJQUFaLEVBQWtCbEgsQ0FBbEIsQ0FBUDtBQUE2QixHQUF4RCxDQW5Dd0IsQ0FtQ2lDO0FBQ3pELE1BQUlrSCxPQUFPTCxJQUFJSSxHQUFKLENBQVF0RixDQUFuQjtBQUFBLE1BQXNCVSxDQUF0QjtBQUNBLE1BQUkwRSxRQUFRNUgsS0FBS0ksRUFBTCxDQUFRRCxFQUFwQjtBQUNBLE1BQUkwSCxTQUFTN0gsS0FBS08sR0FBTCxDQUFTSixFQUF0QjtBQUNBLE1BQUl3SCxVQUFVM0gsS0FBS1ksSUFBTCxDQUFVVCxFQUF4QjtBQUNBLE1BQUl3QixNQUFNM0IsS0FBSzJCLEdBQWY7QUFBQSxNQUFvQndCLFNBQVN4QixJQUFJeEIsRUFBakM7QUFBQSxNQUFxQzZILFVBQVVyRyxJQUFJa0IsR0FBbkQ7QUFBQSxNQUF3REosVUFBVWQsSUFBSXZGLEdBQXRFO0FBQ0FoRSxTQUFPQyxPQUFQLEdBQWlCcVAsR0FBakI7QUFDQSxFQTFDQSxFQTBDRW5JLE9BMUNGLEVBMENXLE9BMUNYOztBQTRDRCxFQUFDQSxRQUFRLFVBQVNuSCxNQUFULEVBQWdCO0FBQ3hCLE1BQUk0SCxPQUFPVCxRQUFRLFFBQVIsQ0FBWDtBQUNBLE1BQUltSSxNQUFNbkksUUFBUSxPQUFSLENBQVY7QUFDQSxNQUFJMEksT0FBTyxFQUFDekYsR0FBRyxHQUFKLEVBQVg7QUFDQXlGLE9BQUsvQixJQUFMLEdBQVksVUFBUzFGLENBQVQsRUFBWWlCLENBQVosRUFBYztBQUFFLFVBQVFqQixLQUFLQSxFQUFFZ0MsQ0FBUCxJQUFZaEMsRUFBRWdDLENBQUYsQ0FBSWYsS0FBS3lHLEtBQVQsQ0FBcEI7QUFBc0MsR0FBbEUsQ0FKd0IsQ0FJMkM7QUFDbkVELE9BQUsvQixJQUFMLENBQVVwRixHQUFWLEdBQWdCLFVBQVNOLENBQVQsRUFBWWlCLENBQVosRUFBYztBQUFFO0FBQy9CQSxPQUFLLE9BQU9BLENBQVAsS0FBYSxRQUFkLEdBQXlCLEVBQUN5RSxNQUFNekUsQ0FBUCxFQUF6QixHQUFxQ0EsS0FBSyxFQUE5QztBQUNBakIsT0FBSUEsS0FBSyxFQUFULENBRjZCLENBRWhCO0FBQ2JBLEtBQUVnQyxDQUFGLEdBQU1oQyxFQUFFZ0MsQ0FBRixJQUFPLEVBQWIsQ0FINkIsQ0FHWjtBQUNqQmhDLEtBQUVnQyxDQUFGLENBQUkwRixLQUFKLElBQWF6RyxFQUFFeUUsSUFBRixJQUFVMUYsRUFBRWdDLENBQUYsQ0FBSTBGLEtBQUosQ0FBVixJQUF3QkMsYUFBckMsQ0FKNkIsQ0FJdUI7QUFDcEQsVUFBTzNILENBQVA7QUFDQSxHQU5EO0FBT0F5SCxPQUFLL0IsSUFBTCxDQUFVMUQsQ0FBVixHQUFja0YsSUFBSUksR0FBSixDQUFRdEYsQ0FBdEI7QUFDQSxHQUFFLGFBQVU7QUFDWHlGLFFBQUs5SCxFQUFMLEdBQVUsVUFBU0ssQ0FBVCxFQUFZMkUsRUFBWixFQUFnQmxDLEVBQWhCLEVBQW1CO0FBQUUsUUFBSTdCLENBQUosQ0FBRixDQUFTO0FBQ3JDLFFBQUcsQ0FBQytCLE9BQU8zQyxDQUFQLENBQUosRUFBYztBQUFFLFlBQU8sS0FBUDtBQUFjLEtBREYsQ0FDRztBQUMvQixRQUFHWSxJQUFJNkcsS0FBSy9CLElBQUwsQ0FBVTFGLENBQVYsQ0FBUCxFQUFvQjtBQUFFO0FBQ3JCLFlBQU8sQ0FBQ2lDLFFBQVFqQyxDQUFSLEVBQVdwRSxHQUFYLEVBQWdCLEVBQUM2RyxJQUFHQSxFQUFKLEVBQU9rQyxJQUFHQSxFQUFWLEVBQWEvRCxHQUFFQSxDQUFmLEVBQWlCWixHQUFFQSxDQUFuQixFQUFoQixDQUFSO0FBQ0E7QUFDRCxXQUFPLEtBQVAsQ0FMNEIsQ0FLZDtBQUNkLElBTkQ7QUFPQSxZQUFTcEUsR0FBVCxDQUFhMEcsQ0FBYixFQUFnQlosQ0FBaEIsRUFBa0I7QUFBRTtBQUNuQixRQUFHQSxNQUFNK0YsS0FBS3pGLENBQWQsRUFBZ0I7QUFBRTtBQUFRLEtBRFQsQ0FDVTtBQUMzQixRQUFHLENBQUNrRixJQUFJdkgsRUFBSixDQUFPMkMsQ0FBUCxDQUFKLEVBQWM7QUFBRSxZQUFPLElBQVA7QUFBYSxLQUZaLENBRWE7QUFDOUIsUUFBRyxLQUFLcUMsRUFBUixFQUFXO0FBQUUsVUFBS0EsRUFBTCxDQUFRcE0sSUFBUixDQUFhLEtBQUtrSyxFQUFsQixFQUFzQkgsQ0FBdEIsRUFBeUJaLENBQXpCLEVBQTRCLEtBQUsxQixDQUFqQyxFQUFvQyxLQUFLWSxDQUF6QztBQUE2QyxLQUh6QyxDQUcwQztBQUMzRDtBQUNELEdBYkMsR0FBRDtBQWNELEdBQUUsYUFBVTtBQUNYNkcsUUFBS25ILEdBQUwsR0FBVyxVQUFTYSxHQUFULEVBQWNGLENBQWQsRUFBaUJ3QixFQUFqQixFQUFvQjtBQUFFO0FBQ2hDLFFBQUcsQ0FBQ3hCLENBQUosRUFBTTtBQUFFQSxTQUFJLEVBQUo7QUFBUSxLQUFoQixNQUNLLElBQUcsT0FBT0EsQ0FBUCxLQUFhLFFBQWhCLEVBQXlCO0FBQUVBLFNBQUksRUFBQ3lFLE1BQU16RSxDQUFQLEVBQUo7QUFBZSxLQUExQyxNQUNBLElBQUdBLGFBQWF4QyxRQUFoQixFQUF5QjtBQUFFd0MsU0FBSSxFQUFDckYsS0FBS3FGLENBQU4sRUFBSjtBQUFjO0FBQzlDLFFBQUdBLEVBQUVyRixHQUFMLEVBQVM7QUFBRXFGLE9BQUUyRyxJQUFGLEdBQVMzRyxFQUFFckYsR0FBRixDQUFNckQsSUFBTixDQUFXa0ssRUFBWCxFQUFldEIsR0FBZixFQUFvQnVCLENBQXBCLEVBQXVCekIsRUFBRTJHLElBQUYsSUFBVSxFQUFqQyxDQUFUO0FBQStDO0FBQzFELFFBQUczRyxFQUFFMkcsSUFBRixHQUFTSCxLQUFLL0IsSUFBTCxDQUFVcEYsR0FBVixDQUFjVyxFQUFFMkcsSUFBRixJQUFVLEVBQXhCLEVBQTRCM0csQ0FBNUIsQ0FBWixFQUEyQztBQUMxQ2dCLGFBQVFkLEdBQVIsRUFBYXZGLEdBQWIsRUFBa0IsRUFBQ3FGLEdBQUVBLENBQUgsRUFBS3dCLElBQUdBLEVBQVIsRUFBbEI7QUFDQTtBQUNELFdBQU94QixFQUFFMkcsSUFBVCxDQVI4QixDQVFmO0FBQ2YsSUFURDtBQVVBLFlBQVNoTSxHQUFULENBQWEwRyxDQUFiLEVBQWdCWixDQUFoQixFQUFrQjtBQUFFLFFBQUlULElBQUksS0FBS0EsQ0FBYjtBQUFBLFFBQWdCNEQsR0FBaEI7QUFBQSxRQUFxQm5DLENBQXJCLENBQUYsQ0FBMEI7QUFDM0MsUUFBR3pCLEVBQUVyRixHQUFMLEVBQVM7QUFDUmlKLFdBQU01RCxFQUFFckYsR0FBRixDQUFNckQsSUFBTixDQUFXLEtBQUtrSyxFQUFoQixFQUFvQkgsQ0FBcEIsRUFBdUIsS0FBR1osQ0FBMUIsRUFBNkJULEVBQUUyRyxJQUEvQixDQUFOO0FBQ0EsU0FBR2xGLE1BQU1tQyxHQUFULEVBQWE7QUFDWmdELGNBQVE1RyxFQUFFMkcsSUFBVixFQUFnQmxHLENBQWhCO0FBQ0EsTUFGRCxNQUdBLElBQUdULEVBQUUyRyxJQUFMLEVBQVU7QUFBRTNHLFFBQUUyRyxJQUFGLENBQU9sRyxDQUFQLElBQVltRCxHQUFaO0FBQWlCO0FBQzdCO0FBQ0E7QUFDRCxRQUFHcUMsSUFBSXZILEVBQUosQ0FBTzJDLENBQVAsQ0FBSCxFQUFhO0FBQ1pyQixPQUFFMkcsSUFBRixDQUFPbEcsQ0FBUCxJQUFZWSxDQUFaO0FBQ0E7QUFDRDtBQUNELEdBeEJDLEdBQUQ7QUF5QkQsTUFBSW5CLE1BQU0zQixLQUFLMkIsR0FBZjtBQUFBLE1BQW9Cd0IsU0FBU3hCLElBQUl4QixFQUFqQztBQUFBLE1BQXFDa0ksVUFBVTFHLElBQUlxQixHQUFuRDtBQUFBLE1BQXdEUCxVQUFVZCxJQUFJdkYsR0FBdEU7QUFDQSxNQUFJd0UsT0FBT1osS0FBS1ksSUFBaEI7QUFBQSxNQUFzQnVILGNBQWN2SCxLQUFLSyxNQUF6QztBQUNBLE1BQUlpSCxRQUFRRCxLQUFLL0IsSUFBTCxDQUFVMUQsQ0FBdEI7QUFDQSxNQUFJVSxDQUFKO0FBQ0E5SyxTQUFPQyxPQUFQLEdBQWlCNFAsSUFBakI7QUFDQSxFQXpEQSxFQXlERTFJLE9BekRGLEVBeURXLFFBekRYOztBQTJERCxFQUFDQSxRQUFRLFVBQVNuSCxNQUFULEVBQWdCO0FBQ3hCLE1BQUk0SCxPQUFPVCxRQUFRLFFBQVIsQ0FBWDtBQUNBLE1BQUkwSSxPQUFPMUksUUFBUSxRQUFSLENBQVg7QUFDQSxXQUFTK0ksS0FBVCxHQUFnQjtBQUNmLE9BQUl6SCxDQUFKO0FBQ0EsT0FBRzBILElBQUgsRUFBUTtBQUNQMUgsUUFBSTJILFFBQVFELEtBQUs5QixHQUFMLEVBQVo7QUFDQSxJQUZELE1BRU87QUFDTjVGLFFBQUlrRCxNQUFKO0FBQ0E7QUFDRCxPQUFHUSxPQUFPMUQsQ0FBVixFQUFZO0FBQ1gsV0FBTzRILElBQUksQ0FBSixFQUFPbEUsT0FBTzFELElBQUl5SCxNQUFNSSxLQUEvQjtBQUNBO0FBQ0QsVUFBT25FLE9BQU8xRCxJQUFLLENBQUM0SCxLQUFLLENBQU4sSUFBV0UsQ0FBaEIsR0FBcUJMLE1BQU1JLEtBQXpDO0FBQ0E7QUFDRCxNQUFJM0UsT0FBTy9ELEtBQUsrRCxJQUFMLENBQVU1RCxFQUFyQjtBQUFBLE1BQXlCb0UsT0FBTyxDQUFDNUQsUUFBakM7QUFBQSxNQUEyQzhILElBQUksQ0FBL0M7QUFBQSxNQUFrREUsSUFBSSxJQUF0RCxDQWZ3QixDQWVvQztBQUM1RCxNQUFJSixPQUFRLE9BQU9LLFdBQVAsS0FBdUIsV0FBeEIsR0FBdUNBLFlBQVlDLE1BQVosSUFBc0JELFdBQTdELEdBQTRFLEtBQXZGO0FBQUEsTUFBOEZKLFFBQVNELFFBQVFBLEtBQUtNLE1BQWIsSUFBdUJOLEtBQUtNLE1BQUwsQ0FBWUMsZUFBcEMsS0FBeURQLE9BQU8sS0FBaEUsQ0FBdEc7QUFDQUQsUUFBTTlGLENBQU4sR0FBVSxHQUFWO0FBQ0E4RixRQUFNSSxLQUFOLEdBQWMsQ0FBZDtBQUNBSixRQUFNbkksRUFBTixHQUFXLFVBQVNLLENBQVQsRUFBWTBCLENBQVosRUFBZVQsQ0FBZixFQUFpQjtBQUFFO0FBQzdCLE9BQUk0RCxNQUFPbkQsS0FBSzFCLENBQUwsSUFBVUEsRUFBRXVJLEVBQUYsQ0FBVixJQUFtQnZJLEVBQUV1SSxFQUFGLEVBQU1ULE1BQU05RixDQUFaLENBQXBCLElBQXVDZixDQUFqRDtBQUNBLE9BQUcsQ0FBQzRELEdBQUosRUFBUTtBQUFFO0FBQVE7QUFDbEIsVUFBT3dDLE9BQU94QyxNQUFNQSxJQUFJbkQsQ0FBSixDQUFiLElBQXNCbUQsR0FBdEIsR0FBNEIsQ0FBQzFFLFFBQXBDO0FBQ0EsR0FKRDtBQUtBMkgsUUFBTXhILEdBQU4sR0FBWSxVQUFTTixDQUFULEVBQVkwQixDQUFaLEVBQWVkLENBQWYsRUFBa0IwQixDQUFsQixFQUFxQm9ELElBQXJCLEVBQTBCO0FBQUU7QUFDdkMsT0FBRyxDQUFDMUYsQ0FBRCxJQUFNLENBQUNBLEVBQUV1SSxFQUFGLENBQVYsRUFBZ0I7QUFBRTtBQUNqQixRQUFHLENBQUM3QyxJQUFKLEVBQVM7QUFBRTtBQUNWO0FBQ0E7QUFDRDFGLFFBQUl5SCxLQUFLL0IsSUFBTCxDQUFVcEYsR0FBVixDQUFjTixDQUFkLEVBQWlCMEYsSUFBakIsQ0FBSixDQUplLENBSWE7QUFDNUI7QUFDRCxPQUFJYixNQUFNMkQsT0FBT3hJLEVBQUV1SSxFQUFGLENBQVAsRUFBY1QsTUFBTTlGLENBQXBCLENBQVYsQ0FQcUMsQ0FPSDtBQUNsQyxPQUFHVSxNQUFNaEIsQ0FBTixJQUFXQSxNQUFNNkcsRUFBcEIsRUFBdUI7QUFDdEIsUUFBR2xCLE9BQU96RyxDQUFQLENBQUgsRUFBYTtBQUNaaUUsU0FBSW5ELENBQUosSUFBU2QsQ0FBVCxDQURZLENBQ0E7QUFDWjtBQUNELFFBQUc4QixNQUFNSixDQUFULEVBQVc7QUFBRTtBQUNadEMsT0FBRTBCLENBQUYsSUFBT1ksQ0FBUDtBQUNBO0FBQ0Q7QUFDRCxVQUFPdEMsQ0FBUDtBQUNBLEdBakJEO0FBa0JBOEgsUUFBTWhGLEVBQU4sR0FBVyxVQUFTQyxJQUFULEVBQWVyQixDQUFmLEVBQWtCb0IsRUFBbEIsRUFBcUI7QUFDL0IsT0FBSTJGLE1BQU0xRixLQUFLckIsQ0FBTCxDQUFWO0FBQ0EsT0FBR2lCLE9BQU84RixHQUFQLENBQUgsRUFBZTtBQUNkQSxVQUFNQyxTQUFTRCxHQUFULENBQU47QUFDQTtBQUNELFVBQU9YLE1BQU14SCxHQUFOLENBQVV3QyxFQUFWLEVBQWNwQixDQUFkLEVBQWlCb0csTUFBTW5JLEVBQU4sQ0FBU29ELElBQVQsRUFBZXJCLENBQWYsQ0FBakIsRUFBb0MrRyxHQUFwQyxFQUF5Q2hCLEtBQUsvQixJQUFMLENBQVUzQyxJQUFWLENBQXpDLENBQVA7QUFDQSxHQU5ELENBT0UsYUFBVTtBQUNYK0UsU0FBTWxNLEdBQU4sR0FBWSxVQUFTK0ksRUFBVCxFQUFhL0QsQ0FBYixFQUFnQjZCLEVBQWhCLEVBQW1CO0FBQUUsUUFBSUMsQ0FBSixDQUFGLENBQVM7QUFDdkMsUUFBSXpCLElBQUkwQixPQUFPMUIsSUFBSTBELE1BQU0vRCxDQUFqQixJQUFxQkssQ0FBckIsR0FBeUIsSUFBakM7QUFDQTBELFNBQUt0QixNQUFNc0IsS0FBS0EsTUFBTS9ELENBQWpCLElBQXFCK0QsRUFBckIsR0FBMEIsSUFBL0I7QUFDQSxRQUFHMUQsS0FBSyxDQUFDMEQsRUFBVCxFQUFZO0FBQ1gvRCxTQUFJeUcsT0FBT3pHLENBQVAsSUFBV0EsQ0FBWCxHQUFla0gsT0FBbkI7QUFDQTdHLE9BQUVzSCxFQUFGLElBQVF0SCxFQUFFc0gsRUFBRixLQUFTLEVBQWpCO0FBQ0F0RyxhQUFRaEIsQ0FBUixFQUFXckYsR0FBWCxFQUFnQixFQUFDcUYsR0FBRUEsQ0FBSCxFQUFLTCxHQUFFQSxDQUFQLEVBQWhCO0FBQ0EsWUFBT0ssQ0FBUDtBQUNBO0FBQ0R3QixTQUFLQSxNQUFNRSxPQUFPL0IsQ0FBUCxDQUFOLEdBQWlCQSxDQUFqQixHQUFxQjhCLENBQTFCO0FBQ0E5QixRQUFJeUcsT0FBT3pHLENBQVAsSUFBV0EsQ0FBWCxHQUFla0gsT0FBbkI7QUFDQSxXQUFPLFVBQVN4RixDQUFULEVBQVlaLENBQVosRUFBZVQsQ0FBZixFQUFrQm1ELEdBQWxCLEVBQXNCO0FBQzVCLFNBQUcsQ0FBQ08sRUFBSixFQUFPO0FBQ04vSSxVQUFJckQsSUFBSixDQUFTLEVBQUMwSSxHQUFHQSxDQUFKLEVBQU9MLEdBQUdBLENBQVYsRUFBVCxFQUF1QjBCLENBQXZCLEVBQXlCWixDQUF6QjtBQUNBLGFBQU9ZLENBQVA7QUFDQTtBQUNEcUMsUUFBR3BNLElBQUgsQ0FBUWtLLE1BQU0sSUFBTixJQUFjLEVBQXRCLEVBQTBCSCxDQUExQixFQUE2QlosQ0FBN0IsRUFBZ0NULENBQWhDLEVBQW1DbUQsR0FBbkM7QUFDQSxTQUFHdkIsUUFBUTVCLENBQVIsRUFBVVMsQ0FBVixLQUFnQmdCLE1BQU16QixFQUFFUyxDQUFGLENBQXpCLEVBQThCO0FBQUU7QUFBUTtBQUN4QzlGLFNBQUlyRCxJQUFKLENBQVMsRUFBQzBJLEdBQUdBLENBQUosRUFBT0wsR0FBR0EsQ0FBVixFQUFULEVBQXVCMEIsQ0FBdkIsRUFBeUJaLENBQXpCO0FBQ0EsS0FSRDtBQVNBLElBcEJEO0FBcUJBLFlBQVM5RixHQUFULENBQWEwRyxDQUFiLEVBQWVaLENBQWYsRUFBaUI7QUFDaEIsUUFBRzZHLE9BQU83RyxDQUFWLEVBQVk7QUFBRTtBQUFRO0FBQ3RCb0csVUFBTXhILEdBQU4sQ0FBVSxLQUFLVyxDQUFmLEVBQWtCUyxDQUFsQixFQUFxQixLQUFLZCxDQUExQjtBQUNBO0FBQ0QsR0ExQkMsR0FBRDtBQTJCRCxNQUFJTyxNQUFNM0IsS0FBSzJCLEdBQWY7QUFBQSxNQUFvQnFILFNBQVNySCxJQUFJc0IsRUFBakM7QUFBQSxNQUFxQ0ksVUFBVTFCLElBQUlDLEdBQW5EO0FBQUEsTUFBd0R1QixTQUFTeEIsSUFBSXhCLEVBQXJFO0FBQUEsTUFBeUVzQyxVQUFVZCxJQUFJdkYsR0FBdkY7QUFBQSxNQUE0RjhNLFdBQVd2SCxJQUFJNkIsSUFBM0c7QUFDQSxNQUFJakQsTUFBTVAsS0FBS08sR0FBZjtBQUFBLE1BQW9Cc0gsU0FBU3RILElBQUlKLEVBQWpDO0FBQ0EsTUFBSUQsS0FBS0YsS0FBS0UsRUFBZDtBQUFBLE1BQWtCMkQsUUFBUTNELEdBQUdDLEVBQTdCO0FBQ0EsTUFBSTRJLEtBQUtkLEtBQUt6RixDQUFkO0FBQUEsTUFBaUJVLENBQWpCO0FBQ0E5SyxTQUFPQyxPQUFQLEdBQWlCaVEsS0FBakI7QUFDQSxFQWpGQSxFQWlGRS9JLE9BakZGLEVBaUZXLFNBakZYOztBQW1GRCxFQUFDQSxRQUFRLFVBQVNuSCxNQUFULEVBQWdCO0FBQ3hCLE1BQUk0SCxPQUFPVCxRQUFRLFFBQVIsQ0FBWDtBQUNBLE1BQUltSSxNQUFNbkksUUFBUSxPQUFSLENBQVY7QUFDQSxNQUFJMEksT0FBTzFJLFFBQVEsUUFBUixDQUFYO0FBQ0EsTUFBSTRKLFFBQVEsRUFBWjtBQUNBLEdBQUUsYUFBVTtBQUNYQSxTQUFNaEosRUFBTixHQUFXLFVBQVNuQixDQUFULEVBQVltRyxFQUFaLEVBQWdCakYsRUFBaEIsRUFBb0IrQyxFQUFwQixFQUF1QjtBQUFFO0FBQ25DLFFBQUcsQ0FBQ2pFLENBQUQsSUFBTSxDQUFDbUUsT0FBT25FLENBQVAsQ0FBUCxJQUFvQm9LLFVBQVVwSyxDQUFWLENBQXZCLEVBQW9DO0FBQUUsWUFBTyxLQUFQO0FBQWMsS0FEbkIsQ0FDb0I7QUFDckQsV0FBTyxDQUFDeUQsUUFBUXpELENBQVIsRUFBVzVDLEdBQVgsRUFBZ0IsRUFBQytJLElBQUdBLEVBQUosRUFBT2pGLElBQUdBLEVBQVYsRUFBYStDLElBQUdBLEVBQWhCLEVBQWhCLENBQVIsQ0FGaUMsQ0FFYTtBQUM5QyxJQUhEO0FBSUEsWUFBUzdHLEdBQVQsQ0FBYW9FLENBQWIsRUFBZ0JZLENBQWhCLEVBQWtCO0FBQUU7QUFDbkIsUUFBRyxDQUFDWixDQUFELElBQU1ZLE1BQU02RyxLQUFLL0IsSUFBTCxDQUFVMUYsQ0FBVixDQUFaLElBQTRCLENBQUN5SCxLQUFLOUgsRUFBTCxDQUFRSyxDQUFSLEVBQVcsS0FBS04sRUFBaEIsRUFBb0IsS0FBSytDLEVBQXpCLENBQWhDLEVBQTZEO0FBQUUsWUFBTyxJQUFQO0FBQWEsS0FEM0QsQ0FDNEQ7QUFDN0UsUUFBRyxDQUFDLEtBQUtrQyxFQUFULEVBQVk7QUFBRTtBQUFRO0FBQ3RCa0UsT0FBRzdJLENBQUgsR0FBT0EsQ0FBUCxDQUFVNkksR0FBR3BHLEVBQUgsR0FBUSxLQUFLQSxFQUFiLENBSE8sQ0FHVTtBQUMzQixTQUFLa0MsRUFBTCxDQUFRcE0sSUFBUixDQUFhc1EsR0FBR3BHLEVBQWhCLEVBQW9CekMsQ0FBcEIsRUFBdUJZLENBQXZCLEVBQTBCaUksRUFBMUI7QUFDQTtBQUNELFlBQVNBLEVBQVQsQ0FBWW5KLEVBQVosRUFBZTtBQUFFO0FBQ2hCLFFBQUdBLEVBQUgsRUFBTTtBQUFFK0gsVUFBSzlILEVBQUwsQ0FBUWtKLEdBQUc3SSxDQUFYLEVBQWNOLEVBQWQsRUFBa0JtSixHQUFHcEcsRUFBckI7QUFBMEIsS0FEcEIsQ0FDcUI7QUFDbkM7QUFDRCxHQWRDLEdBQUQ7QUFlRCxHQUFFLGFBQVU7QUFDWGtHLFNBQU1ySSxHQUFOLEdBQVksVUFBU2EsR0FBVCxFQUFjckgsR0FBZCxFQUFtQjJJLEVBQW5CLEVBQXNCO0FBQ2pDLFFBQUl1QyxLQUFLLEVBQUM3RixNQUFNLEVBQVAsRUFBV2dDLEtBQUtBLEdBQWhCLEVBQVQ7QUFDQSxRQUFHLENBQUNySCxHQUFKLEVBQVE7QUFDUEEsV0FBTSxFQUFOO0FBQ0EsS0FGRCxNQUdBLElBQUcsT0FBT0EsR0FBUCxLQUFlLFFBQWxCLEVBQTJCO0FBQzFCQSxXQUFNLEVBQUM0TCxNQUFNNUwsR0FBUCxFQUFOO0FBQ0EsS0FGRCxNQUdBLElBQUdBLGVBQWUyRSxRQUFsQixFQUEyQjtBQUMxQjNFLFNBQUk4QixHQUFKLEdBQVU5QixHQUFWO0FBQ0E7QUFDRCxRQUFHQSxJQUFJNEwsSUFBUCxFQUFZO0FBQ1hWLFFBQUdzQyxHQUFILEdBQVNKLElBQUlJLEdBQUosQ0FBUWhILEdBQVIsQ0FBWXhHLElBQUk0TCxJQUFoQixDQUFUO0FBQ0E7QUFDRDVMLFFBQUlnUCxLQUFKLEdBQVloUCxJQUFJZ1AsS0FBSixJQUFhLEVBQXpCO0FBQ0FoUCxRQUFJaVAsSUFBSixHQUFXalAsSUFBSWlQLElBQUosSUFBWSxFQUF2QjtBQUNBalAsUUFBSTJJLEVBQUosR0FBUzNJLElBQUkySSxFQUFKLElBQVVBLEVBQW5CO0FBQ0FtRixTQUFLOU4sR0FBTCxFQUFVa0wsRUFBVjtBQUNBbEwsUUFBSStFLElBQUosR0FBV21HLEdBQUc0QyxJQUFkO0FBQ0EsV0FBTzlOLElBQUlnUCxLQUFYO0FBQ0EsSUFwQkQ7QUFxQkEsWUFBU2xCLElBQVQsQ0FBYzlOLEdBQWQsRUFBbUJrTCxFQUFuQixFQUFzQjtBQUFFLFFBQUlILEdBQUo7QUFDdkIsUUFBR0EsTUFBTWtFLEtBQUtqUCxHQUFMLEVBQVVrTCxFQUFWLENBQVQsRUFBdUI7QUFBRSxZQUFPSCxHQUFQO0FBQVk7QUFDckNHLE9BQUdsTCxHQUFILEdBQVNBLEdBQVQ7QUFDQWtMLE9BQUdVLElBQUgsR0FBVUEsSUFBVjtBQUNBLFFBQUcrQixLQUFLbkgsR0FBTCxDQUFTMEUsR0FBRzdELEdBQVosRUFBaUJ2RixHQUFqQixFQUFzQm9KLEVBQXRCLENBQUgsRUFBNkI7QUFDNUI7QUFDQWxMLFNBQUlnUCxLQUFKLENBQVU1QixJQUFJSSxHQUFKLENBQVEzSCxFQUFSLENBQVdxRixHQUFHc0MsR0FBZCxDQUFWLElBQWdDdEMsR0FBRzRDLElBQW5DO0FBQ0E7QUFDRCxXQUFPNUMsRUFBUDtBQUNBO0FBQ0QsWUFBU3BKLEdBQVQsQ0FBYTBHLENBQWIsRUFBZVosQ0FBZixFQUFpQjFCLENBQWpCLEVBQW1CO0FBQ2xCLFFBQUlnRixLQUFLLElBQVQ7QUFBQSxRQUFlbEwsTUFBTWtMLEdBQUdsTCxHQUF4QjtBQUFBLFFBQTZCNkYsRUFBN0I7QUFBQSxRQUFpQ2tGLEdBQWpDO0FBQ0EsUUFBRzRDLEtBQUt6RixDQUFMLEtBQVdOLENBQVgsSUFBZ0JtQixRQUFRUCxDQUFSLEVBQVU0RSxJQUFJSSxHQUFKLENBQVF0RixDQUFsQixDQUFuQixFQUF3QztBQUN2QyxZQUFPaEMsRUFBRWdDLENBQVQsQ0FEdUMsQ0FDM0I7QUFDWjtBQUNELFFBQUcsRUFBRXJDLEtBQUtxSixNQUFNMUcsQ0FBTixFQUFRWixDQUFSLEVBQVUxQixDQUFWLEVBQWFnRixFQUFiLEVBQWdCbEwsR0FBaEIsQ0FBUCxDQUFILEVBQWdDO0FBQUU7QUFBUTtBQUMxQyxRQUFHLENBQUM0SCxDQUFKLEVBQU07QUFDTHNELFFBQUc0QyxJQUFILEdBQVU1QyxHQUFHNEMsSUFBSCxJQUFXNUgsQ0FBWCxJQUFnQixFQUExQjtBQUNBLFNBQUc2QyxRQUFRUCxDQUFSLEVBQVdtRixLQUFLekYsQ0FBaEIsQ0FBSCxFQUFzQjtBQUNyQmdELFNBQUc0QyxJQUFILENBQVE1RixDQUFSLEdBQVkwRyxTQUFTcEcsRUFBRU4sQ0FBWCxDQUFaO0FBQ0E7QUFDRGdELFFBQUc0QyxJQUFILEdBQVVILEtBQUsvQixJQUFMLENBQVVwRixHQUFWLENBQWMwRSxHQUFHNEMsSUFBakIsRUFBdUJWLElBQUlJLEdBQUosQ0FBUTNILEVBQVIsQ0FBV3FGLEdBQUdzQyxHQUFkLENBQXZCLENBQVY7QUFDQXRDLFFBQUdzQyxHQUFILEdBQVN0QyxHQUFHc0MsR0FBSCxJQUFVSixJQUFJSSxHQUFKLENBQVFoSCxHQUFSLENBQVltSCxLQUFLL0IsSUFBTCxDQUFVVixHQUFHNEMsSUFBYixDQUFaLENBQW5CO0FBQ0E7QUFDRCxRQUFHL0MsTUFBTS9LLElBQUk4QixHQUFiLEVBQWlCO0FBQ2hCaUosU0FBSXRNLElBQUosQ0FBU3VCLElBQUkySSxFQUFKLElBQVUsRUFBbkIsRUFBdUJILENBQXZCLEVBQXlCWixDQUF6QixFQUEyQjFCLENBQTNCLEVBQThCZ0YsRUFBOUI7QUFDQSxTQUFHbkMsUUFBUTdDLENBQVIsRUFBVTBCLENBQVYsQ0FBSCxFQUFnQjtBQUNmWSxVQUFJdEMsRUFBRTBCLENBQUYsQ0FBSjtBQUNBLFVBQUdnQixNQUFNSixDQUFULEVBQVc7QUFDVnVGLGVBQVE3SCxDQUFSLEVBQVcwQixDQUFYO0FBQ0E7QUFDQTtBQUNELFVBQUcsRUFBRS9CLEtBQUtxSixNQUFNMUcsQ0FBTixFQUFRWixDQUFSLEVBQVUxQixDQUFWLEVBQWFnRixFQUFiLEVBQWdCbEwsR0FBaEIsQ0FBUCxDQUFILEVBQWdDO0FBQUU7QUFBUTtBQUMxQztBQUNEO0FBQ0QsUUFBRyxDQUFDNEgsQ0FBSixFQUFNO0FBQUUsWUFBT3NELEdBQUc0QyxJQUFWO0FBQWdCO0FBQ3hCLFFBQUcsU0FBU2pJLEVBQVosRUFBZTtBQUNkLFlBQU8yQyxDQUFQO0FBQ0E7QUFDRHVDLFVBQU0rQyxLQUFLOU4sR0FBTCxFQUFVLEVBQUNxSCxLQUFLbUIsQ0FBTixFQUFTbkQsTUFBTTZGLEdBQUc3RixJQUFILENBQVFwRyxNQUFSLENBQWUySSxDQUFmLENBQWYsRUFBVixDQUFOO0FBQ0EsUUFBRyxDQUFDbUQsSUFBSStDLElBQVIsRUFBYTtBQUFFO0FBQVE7QUFDdkIsV0FBTy9DLElBQUl5QyxHQUFYLENBL0JrQixDQStCRjtBQUNoQjtBQUNELFlBQVM1QixJQUFULENBQWNoSyxFQUFkLEVBQWlCO0FBQUUsUUFBSXNKLEtBQUssSUFBVDtBQUNsQixRQUFJaUUsT0FBTy9CLElBQUlJLEdBQUosQ0FBUTNILEVBQVIsQ0FBV3FGLEdBQUdzQyxHQUFkLENBQVg7QUFBQSxRQUErQndCLFFBQVE5RCxHQUFHbEwsR0FBSCxDQUFPZ1AsS0FBOUM7QUFDQTlELE9BQUdzQyxHQUFILEdBQVN0QyxHQUFHc0MsR0FBSCxJQUFVSixJQUFJSSxHQUFKLENBQVFoSCxHQUFSLENBQVk1RSxFQUFaLENBQW5CO0FBQ0FzSixPQUFHc0MsR0FBSCxDQUFPSixJQUFJSSxHQUFKLENBQVF0RixDQUFmLElBQW9CdEcsRUFBcEI7QUFDQSxRQUFHc0osR0FBRzRDLElBQUgsSUFBVzVDLEdBQUc0QyxJQUFILENBQVFILEtBQUt6RixDQUFiLENBQWQsRUFBOEI7QUFDN0JnRCxRQUFHNEMsSUFBSCxDQUFRSCxLQUFLekYsQ0FBYixFQUFnQmtGLElBQUlJLEdBQUosQ0FBUXRGLENBQXhCLElBQTZCdEcsRUFBN0I7QUFDQTtBQUNELFFBQUdtSCxRQUFRaUcsS0FBUixFQUFlRyxJQUFmLENBQUgsRUFBd0I7QUFDdkJILFdBQU1wTixFQUFOLElBQVlvTixNQUFNRyxJQUFOLENBQVo7QUFDQXBCLGFBQVFpQixLQUFSLEVBQWVHLElBQWY7QUFDQTtBQUNEO0FBQ0QsWUFBU0QsS0FBVCxDQUFlMUcsQ0FBZixFQUFpQlosQ0FBakIsRUFBbUIxQixDQUFuQixFQUFzQmdGLEVBQXRCLEVBQXlCbEwsR0FBekIsRUFBNkI7QUFBRSxRQUFJK0ssR0FBSjtBQUM5QixRQUFHcUMsSUFBSXZILEVBQUosQ0FBTzJDLENBQVAsQ0FBSCxFQUFhO0FBQUUsWUFBTyxJQUFQO0FBQWE7QUFDNUIsUUFBR0ssT0FBT0wsQ0FBUCxDQUFILEVBQWE7QUFBRSxZQUFPLENBQVA7QUFBVTtBQUN6QixRQUFHdUMsTUFBTS9LLElBQUlvUCxPQUFiLEVBQXFCO0FBQ3BCNUcsU0FBSXVDLElBQUl0TSxJQUFKLENBQVN1QixJQUFJMkksRUFBSixJQUFVLEVBQW5CLEVBQXVCSCxDQUF2QixFQUF5QlosQ0FBekIsRUFBMkIxQixDQUEzQixDQUFKO0FBQ0EsWUFBT2dKLE1BQU0xRyxDQUFOLEVBQVFaLENBQVIsRUFBVTFCLENBQVYsRUFBYWdGLEVBQWIsRUFBZ0JsTCxHQUFoQixDQUFQO0FBQ0E7QUFDREEsUUFBSWhFLEdBQUosR0FBVSx1QkFBdUJrUCxHQUFHN0YsSUFBSCxDQUFRcEcsTUFBUixDQUFlMkksQ0FBZixFQUFrQnlILElBQWxCLENBQXVCLEdBQXZCLENBQXZCLEdBQXFELElBQS9EO0FBQ0E7QUFDRCxZQUFTSixJQUFULENBQWNqUCxHQUFkLEVBQW1Ca0wsRUFBbkIsRUFBc0I7QUFDckIsUUFBSW9FLE1BQU10UCxJQUFJaVAsSUFBZDtBQUFBLFFBQW9CblMsSUFBSXdTLElBQUl2UyxNQUE1QjtBQUFBLFFBQW9DdUssR0FBcEM7QUFDQSxXQUFNeEssR0FBTixFQUFVO0FBQUV3SyxXQUFNZ0ksSUFBSXhTLENBQUosQ0FBTjtBQUNYLFNBQUdvTyxHQUFHN0QsR0FBSCxLQUFXQyxJQUFJRCxHQUFsQixFQUFzQjtBQUFFLGFBQU9DLEdBQVA7QUFBWTtBQUNwQztBQUNEZ0ksUUFBSXJTLElBQUosQ0FBU2lPLEVBQVQ7QUFDQTtBQUNELEdBN0ZDLEdBQUQ7QUE4RkQyRCxRQUFNZixJQUFOLEdBQWEsVUFBU0EsSUFBVCxFQUFjO0FBQzFCLE9BQUlsQyxPQUFPK0IsS0FBSy9CLElBQUwsQ0FBVWtDLElBQVYsQ0FBWDtBQUNBLE9BQUcsQ0FBQ2xDLElBQUosRUFBUztBQUFFO0FBQVE7QUFDbkIsVUFBTzhCLFFBQVEsRUFBUixFQUFZOUIsSUFBWixFQUFrQmtDLElBQWxCLENBQVA7QUFDQSxHQUpELENBS0UsYUFBVTtBQUNYZSxTQUFNN0YsRUFBTixHQUFXLFVBQVNnRyxLQUFULEVBQWdCakssSUFBaEIsRUFBc0J1RixHQUF0QixFQUEwQjtBQUNwQyxRQUFHLENBQUMwRSxLQUFKLEVBQVU7QUFBRTtBQUFRO0FBQ3BCLFFBQUkzSCxNQUFNLEVBQVY7QUFDQWlELFVBQU1BLE9BQU8sRUFBQzJFLE1BQU0sRUFBUCxFQUFiO0FBQ0E5RyxZQUFRNkcsTUFBTWpLLElBQU4sQ0FBUixFQUFxQmpELEdBQXJCLEVBQTBCLEVBQUN1RixLQUFJQSxHQUFMLEVBQVUySCxPQUFPQSxLQUFqQixFQUF3QjFFLEtBQUtBLEdBQTdCLEVBQTFCO0FBQ0EsV0FBT2pELEdBQVA7QUFDQSxJQU5EO0FBT0EsWUFBU3ZGLEdBQVQsQ0FBYTBHLENBQWIsRUFBZVosQ0FBZixFQUFpQjtBQUFFLFFBQUltRCxHQUFKLEVBQVMxRCxHQUFUO0FBQ2xCLFFBQUdzRyxLQUFLekYsQ0FBTCxLQUFXTixDQUFkLEVBQWdCO0FBQ2YsU0FBR2tILFVBQVV0RyxDQUFWLEVBQWE0RSxJQUFJSSxHQUFKLENBQVF0RixDQUFyQixDQUFILEVBQTJCO0FBQzFCO0FBQ0E7QUFDRCxVQUFLYixHQUFMLENBQVNPLENBQVQsSUFBY2dILFNBQVNwRyxDQUFULENBQWQ7QUFDQTtBQUNBO0FBQ0QsUUFBRyxFQUFFdUMsTUFBTXFDLElBQUlJLEdBQUosQ0FBUTNILEVBQVIsQ0FBVzJDLENBQVgsQ0FBUixDQUFILEVBQTBCO0FBQ3pCLFVBQUtuQixHQUFMLENBQVNPLENBQVQsSUFBY1ksQ0FBZDtBQUNBO0FBQ0E7QUFDRCxRQUFHbkIsTUFBTSxLQUFLaUQsR0FBTCxDQUFTMkUsSUFBVCxDQUFjbEUsR0FBZCxDQUFULEVBQTRCO0FBQzNCLFVBQUsxRCxHQUFMLENBQVNPLENBQVQsSUFBY1AsR0FBZDtBQUNBO0FBQ0E7QUFDRCxTQUFLQSxHQUFMLENBQVNPLENBQVQsSUFBYyxLQUFLMEMsR0FBTCxDQUFTMkUsSUFBVCxDQUFjbEUsR0FBZCxJQUFxQjhELE1BQU03RixFQUFOLENBQVMsS0FBS2dHLEtBQWQsRUFBcUJqRSxHQUFyQixFQUEwQixLQUFLVCxHQUEvQixDQUFuQztBQUNBO0FBQ0QsR0ExQkMsR0FBRDtBQTJCRCxNQUFJZixRQUFRN0QsS0FBS0UsRUFBTCxDQUFRQyxFQUFwQjtBQUNBLE1BQUl3QixNQUFNM0IsS0FBSzJCLEdBQWY7QUFBQSxNQUFvQndCLFNBQVN4QixJQUFJeEIsRUFBakM7QUFBQSxNQUFxQ2tJLFVBQVUxRyxJQUFJcUIsR0FBbkQ7QUFBQSxNQUF3REssVUFBVTFCLElBQUlDLEdBQXRFO0FBQUEsTUFBMkV3SCxZQUFZekgsSUFBSThCLEtBQTNGO0FBQUEsTUFBa0d1RSxVQUFVckcsSUFBSWtCLEdBQWhIO0FBQUEsTUFBcUhKLFVBQVVkLElBQUl2RixHQUFuSTtBQUFBLE1BQXdJOE0sV0FBV3ZILElBQUk2QixJQUF2SjtBQUNBLE1BQUlOLENBQUo7QUFDQTlLLFNBQU9DLE9BQVAsR0FBaUI4USxLQUFqQjtBQUNBLEVBdEpBLEVBc0pFNUosT0F0SkYsRUFzSlcsU0F0Slg7O0FBd0pELEVBQUNBLFFBQVEsVUFBU25ILE1BQVQsRUFBZ0I7QUFDeEIsTUFBSTRILE9BQU9ULFFBQVEsUUFBUixDQUFYO0FBQ0EsV0FBU3NLLEdBQVQsR0FBYztBQUNiLFFBQUtDLEtBQUwsR0FBYSxFQUFiO0FBQ0E7QUFDREQsTUFBSTNQLFNBQUosQ0FBYzZQLEtBQWQsR0FBc0IsVUFBUzdOLEVBQVQsRUFBWTtBQUNqQyxRQUFLNE4sS0FBTCxDQUFXNU4sRUFBWCxJQUFpQjhELEtBQUsrRCxJQUFMLENBQVU1RCxFQUFWLEVBQWpCO0FBQ0EsT0FBSSxDQUFDLEtBQUttRCxFQUFWLEVBQWM7QUFDYixTQUFLMEcsRUFBTCxHQURhLENBQ0Y7QUFDWDtBQUNELFVBQU85TixFQUFQO0FBQ0EsR0FORDtBQU9BMk4sTUFBSTNQLFNBQUosQ0FBY3dNLEtBQWQsR0FBc0IsVUFBU3hLLEVBQVQsRUFBWTtBQUNqQztBQUNBLFVBQU84RCxLQUFLMkIsR0FBTCxDQUFTQyxHQUFULENBQWEsS0FBS2tJLEtBQWxCLEVBQXlCNU4sRUFBekIsSUFBOEIsS0FBSzZOLEtBQUwsQ0FBVzdOLEVBQVgsQ0FBOUIsR0FBK0MsS0FBdEQsQ0FGaUMsQ0FFNEI7QUFDN0QsR0FIRDtBQUlBMk4sTUFBSTNQLFNBQUosQ0FBYzhQLEVBQWQsR0FBbUIsWUFBVTtBQUM1QixPQUFJQyxLQUFLLElBQVQ7QUFBQSxPQUFleEQsTUFBTXpHLEtBQUsrRCxJQUFMLENBQVU1RCxFQUFWLEVBQXJCO0FBQUEsT0FBcUMrSixTQUFTekQsR0FBOUM7QUFBQSxPQUFtRDBELFNBQVMsSUFBSSxFQUFKLEdBQVMsSUFBckU7QUFDQTtBQUNBbkssUUFBSzJCLEdBQUwsQ0FBU3ZGLEdBQVQsQ0FBYTZOLEdBQUdILEtBQWhCLEVBQXVCLFVBQVMvRixJQUFULEVBQWU3SCxFQUFmLEVBQWtCO0FBQ3hDZ08sYUFBUzVJLEtBQUs4SSxHQUFMLENBQVMzRCxHQUFULEVBQWMxQyxJQUFkLENBQVQ7QUFDQSxRQUFLMEMsTUFBTTFDLElBQVAsR0FBZW9HLE1BQW5CLEVBQTBCO0FBQUU7QUFBUTtBQUNwQ25LLFNBQUsyQixHQUFMLENBQVNxQixHQUFULENBQWFpSCxHQUFHSCxLQUFoQixFQUF1QjVOLEVBQXZCO0FBQ0EsSUFKRDtBQUtBLE9BQUltTyxPQUFPckssS0FBSzJCLEdBQUwsQ0FBUzhCLEtBQVQsQ0FBZXdHLEdBQUdILEtBQWxCLENBQVg7QUFDQSxPQUFHTyxJQUFILEVBQVE7QUFDUEosT0FBRzNHLEVBQUgsR0FBUSxJQUFSLENBRE8sQ0FDTztBQUNkO0FBQ0E7QUFDRCxPQUFJZ0gsVUFBVTdELE1BQU15RCxNQUFwQixDQWI0QixDQWFBO0FBQzVCLE9BQUlLLFNBQVNKLFNBQVNHLE9BQXRCLENBZDRCLENBY0c7QUFDL0JMLE1BQUczRyxFQUFILEdBQVE1SyxXQUFXLFlBQVU7QUFBRXVSLE9BQUdELEVBQUg7QUFBUyxJQUFoQyxFQUFrQ08sTUFBbEMsQ0FBUixDQWY0QixDQWV1QjtBQUNuRCxHQWhCRDtBQWlCQW5TLFNBQU9DLE9BQVAsR0FBaUJ3UixHQUFqQjtBQUNBLEVBbENBLEVBa0NFdEssT0FsQ0YsRUFrQ1csT0FsQ1g7O0FBb0NELEVBQUNBLFFBQVEsVUFBU25ILE1BQVQsRUFBZ0I7O0FBRXhCLFdBQVM0TixHQUFULENBQWF2RSxDQUFiLEVBQWU7QUFDZCxPQUFHQSxhQUFhdUUsR0FBaEIsRUFBb0I7QUFBRSxXQUFPLENBQUMsS0FBS3hELENBQUwsR0FBUyxFQUFDdkcsS0FBSyxJQUFOLEVBQVYsRUFBdUJBLEdBQTlCO0FBQW1DO0FBQ3pELE9BQUcsRUFBRSxnQkFBZ0IrSixHQUFsQixDQUFILEVBQTBCO0FBQUUsV0FBTyxJQUFJQSxHQUFKLENBQVF2RSxDQUFSLENBQVA7QUFBbUI7QUFDL0MsVUFBT3VFLElBQUlyQixNQUFKLENBQVcsS0FBS25DLENBQUwsR0FBUyxFQUFDdkcsS0FBSyxJQUFOLEVBQVkySSxLQUFLbkQsQ0FBakIsRUFBcEIsQ0FBUDtBQUNBOztBQUVEdUUsTUFBSTdGLEVBQUosR0FBUyxVQUFTbEUsR0FBVCxFQUFhO0FBQUUsVUFBUUEsZUFBZStKLEdBQXZCO0FBQTZCLEdBQXJEOztBQUVBQSxNQUFJeEwsT0FBSixHQUFjLEdBQWQ7O0FBRUF3TCxNQUFJaEIsS0FBSixHQUFZZ0IsSUFBSTlMLFNBQWhCO0FBQ0E4TCxNQUFJaEIsS0FBSixDQUFVd0YsTUFBVixHQUFtQixZQUFVLENBQUUsQ0FBL0I7O0FBRUEsTUFBSXhLLE9BQU9ULFFBQVEsUUFBUixDQUFYO0FBQ0FTLE9BQUsyQixHQUFMLENBQVMyQixFQUFULENBQVl0RCxJQUFaLEVBQWtCZ0csR0FBbEI7QUFDQUEsTUFBSWEsR0FBSixHQUFVdEgsUUFBUSxPQUFSLENBQVY7QUFDQXlHLE1BQUlpRCxHQUFKLEdBQVUxSixRQUFRLE9BQVIsQ0FBVjtBQUNBeUcsTUFBSW9DLElBQUosR0FBVzdJLFFBQVEsUUFBUixDQUFYO0FBQ0F5RyxNQUFJRyxLQUFKLEdBQVk1RyxRQUFRLFNBQVIsQ0FBWjtBQUNBeUcsTUFBSXNELEtBQUosR0FBWS9KLFFBQVEsU0FBUixDQUFaO0FBQ0F5RyxNQUFJeUUsR0FBSixHQUFVbEwsUUFBUSxPQUFSLENBQVY7QUFDQXlHLE1BQUkwRSxRQUFKLEdBQWVuTCxRQUFRLFlBQVIsQ0FBZjtBQUNBeUcsTUFBSXJMLEVBQUosR0FBUzRFLFFBQVEsU0FBUixHQUFUOztBQUVBeUcsTUFBSXhELENBQUosR0FBUSxFQUFFO0FBQ1Q0RixTQUFNcEMsSUFBSW9DLElBQUosQ0FBUzVGLENBRFIsQ0FDVTtBQURWLEtBRU4wRCxNQUFNRixJQUFJaUQsR0FBSixDQUFRbkIsR0FBUixDQUFZdEYsQ0FGWixDQUVjO0FBRmQsS0FHTjJELE9BQU9ILElBQUlHLEtBQUosQ0FBVTNELENBSFgsQ0FHYTtBQUhiLEtBSU5tSSxPQUFPLEdBSkQsQ0FJSztBQUpMLEtBS05DLE9BQU8sR0FMRCxDQUtLO0FBTEwsR0FBUixDQVFFLGFBQVU7QUFDWDVFLE9BQUlyQixNQUFKLEdBQWEsVUFBU2EsRUFBVCxFQUFZO0FBQ3hCQSxPQUFHN0ssRUFBSCxHQUFRNkssR0FBRzdLLEVBQUgsSUFBU3FMLElBQUlyTCxFQUFyQjtBQUNBNkssT0FBR25HLElBQUgsR0FBVW1HLEdBQUduRyxJQUFILElBQVdtRyxHQUFHdkosR0FBeEI7QUFDQXVKLE9BQUc4RCxLQUFILEdBQVc5RCxHQUFHOEQsS0FBSCxJQUFZLEVBQXZCO0FBQ0E5RCxPQUFHaUYsR0FBSCxHQUFTakYsR0FBR2lGLEdBQUgsSUFBVSxJQUFJekUsSUFBSXlFLEdBQVIsRUFBbkI7QUFDQWpGLE9BQUdFLEdBQUgsR0FBU00sSUFBSXJMLEVBQUosQ0FBTytLLEdBQWhCO0FBQ0FGLE9BQUdJLEdBQUgsR0FBU0ksSUFBSXJMLEVBQUosQ0FBT2lMLEdBQWhCO0FBQ0EsUUFBSTNKLE1BQU11SixHQUFHdkosR0FBSCxDQUFPMkksR0FBUCxDQUFXWSxHQUFHWixHQUFkLENBQVY7QUFDQSxRQUFHLENBQUNZLEdBQUczSyxJQUFQLEVBQVk7QUFDWDJLLFFBQUc3SyxFQUFILENBQU0sSUFBTixFQUFZMEUsSUFBWixFQUFrQm1HLEVBQWxCO0FBQ0FBLFFBQUc3SyxFQUFILENBQU0sS0FBTixFQUFhMEUsSUFBYixFQUFtQm1HLEVBQW5CO0FBQ0E7QUFDREEsT0FBRzNLLElBQUgsR0FBVSxDQUFWO0FBQ0EsV0FBT29CLEdBQVA7QUFDQSxJQWREO0FBZUEsWUFBU29ELElBQVQsQ0FBY21HLEVBQWQsRUFBaUI7QUFDaEI7QUFDQSxRQUFJUCxLQUFLLElBQVQ7QUFBQSxRQUFlNEYsTUFBTTVGLEdBQUdoQyxFQUF4QjtBQUFBLFFBQTRCNkgsSUFBNUI7QUFDQSxRQUFHLENBQUN0RixHQUFHdkosR0FBUCxFQUFXO0FBQUV1SixRQUFHdkosR0FBSCxHQUFTNE8sSUFBSTVPLEdBQWI7QUFBa0I7QUFDL0IsUUFBRyxDQUFDdUosR0FBRyxHQUFILENBQUosRUFBWTtBQUFFQSxRQUFHLEdBQUgsSUFBVVEsSUFBSXBGLElBQUosQ0FBU0ssTUFBVCxFQUFWO0FBQTZCLEtBSjNCLENBSTRCO0FBQzVDLFFBQUc0SixJQUFJSixHQUFKLENBQVEvRCxLQUFSLENBQWNsQixHQUFHLEdBQUgsQ0FBZCxDQUFILEVBQTBCO0FBQUU7QUFBUTtBQUNwQyxRQUFHQSxHQUFHLEdBQUgsQ0FBSCxFQUFXO0FBQ1Y7QUFDQSxTQUFHcUYsSUFBSWpGLEdBQUosQ0FBUUosR0FBRyxHQUFILENBQVIsRUFBaUJBLEVBQWpCLENBQUgsRUFBd0I7QUFBRTtBQUFRLE1BRnhCLENBRXlCO0FBQ25DcUYsU0FBSUosR0FBSixDQUFRVixLQUFSLENBQWN2RSxHQUFHLEdBQUgsQ0FBZDtBQUNBUSxTQUFJckwsRUFBSixDQUFPLEtBQVAsRUFBY29RLE9BQU92RixFQUFQLEVBQVcsRUFBQ3ZKLEtBQUs0TyxJQUFJNU8sR0FBVixFQUFYLENBQWQ7QUFDQTtBQUNBO0FBQ0Q0TyxRQUFJSixHQUFKLENBQVFWLEtBQVIsQ0FBY3ZFLEdBQUcsR0FBSCxDQUFkO0FBQ0E7QUFDQTtBQUNBc0YsV0FBT0MsT0FBT3ZGLEVBQVAsRUFBVyxFQUFDdkosS0FBSzRPLElBQUk1TyxHQUFWLEVBQVgsQ0FBUDtBQUNBLFFBQUd1SixHQUFHd0YsR0FBTixFQUFVO0FBQ1Q7QUFDQWhGLFNBQUlyTCxFQUFKLENBQU8sS0FBUCxFQUFjbVEsSUFBZDtBQUNBO0FBQ0QsUUFBR3RGLEdBQUczQyxHQUFOLEVBQVU7QUFDVDtBQUNBbUQsU0FBSXJMLEVBQUosQ0FBTyxLQUFQLEVBQWNtUSxJQUFkO0FBQ0E7QUFDRDlFLFFBQUlyTCxFQUFKLENBQU8sS0FBUCxFQUFjbVEsSUFBZDtBQUNBO0FBQ0QsR0EzQ0MsR0FBRDs7QUE2Q0QsR0FBRSxhQUFVO0FBQ1g5RSxPQUFJckwsRUFBSixDQUFPLEtBQVAsRUFBYyxVQUFTNkssRUFBVCxFQUFZO0FBQzFCO0FBQ0MsUUFBRyxDQUFDQSxHQUFHLEdBQUgsQ0FBSixFQUFZO0FBQUUsWUFBTyxLQUFLbEMsRUFBTCxDQUFRYyxJQUFSLENBQWFvQixFQUFiLENBQVA7QUFBeUIsS0FGZCxDQUVlO0FBQ3hDLFFBQUlQLEtBQUssSUFBVDtBQUFBLFFBQWVRLE1BQU0sRUFBQ3hKLEtBQUt1SixHQUFHdkosR0FBVCxFQUFjcU4sT0FBTzlELEdBQUd2SixHQUFILENBQU91RyxDQUFQLENBQVM4RyxLQUE5QixFQUFxQ3pHLEtBQUssRUFBMUMsRUFBOEN6RyxLQUFLLEVBQW5ELEVBQXVENk8sU0FBU2pGLElBQUlHLEtBQUosRUFBaEUsRUFBckI7QUFDQSxRQUFHLENBQUNILElBQUlzRCxLQUFKLENBQVVuSixFQUFWLENBQWFxRixHQUFHM0MsR0FBaEIsRUFBcUIsSUFBckIsRUFBMkJxSSxNQUEzQixFQUFtQ3pGLEdBQW5DLENBQUosRUFBNEM7QUFBRUEsU0FBSW5QLEdBQUosR0FBVSx1QkFBVjtBQUFtQztBQUNqRixRQUFHbVAsSUFBSW5QLEdBQVAsRUFBVztBQUFFLFlBQU9tUCxJQUFJeEosR0FBSixDQUFRdEIsRUFBUixDQUFXLElBQVgsRUFBaUIsRUFBQyxLQUFLNkssR0FBRyxHQUFILENBQU4sRUFBZWxQLEtBQUswUCxJQUFJaEosR0FBSixDQUFReUksSUFBSW5QLEdBQVosQ0FBcEIsRUFBakIsQ0FBUDtBQUFpRTtBQUM5RW1NLFlBQVFnRCxJQUFJNUMsR0FBWixFQUFpQnNJLEtBQWpCLEVBQXdCMUYsR0FBeEI7QUFDQWhELFlBQVFnRCxJQUFJckosR0FBWixFQUFpQkEsR0FBakIsRUFBc0JxSixHQUF0QjtBQUNBLFFBQUd2QyxNQUFNdUMsSUFBSTBCLEtBQWIsRUFBbUI7QUFDbEJuQixTQUFJMEUsUUFBSixDQUFhakYsSUFBSTBCLEtBQWpCLEVBQXdCLFlBQVU7QUFDakNuQixVQUFJckwsRUFBSixDQUFPLEtBQVAsRUFBYzZLLEVBQWQ7QUFDQSxNQUZELEVBRUdRLElBQUlHLEtBRlA7QUFHQTtBQUNELFFBQUcsQ0FBQ1YsSUFBSTJGLElBQVIsRUFBYTtBQUFFO0FBQVE7QUFDdkJuRyxPQUFHM0IsRUFBSCxDQUFNYyxJQUFOLENBQVcyRyxPQUFPdkYsRUFBUCxFQUFXLEVBQUMzQyxLQUFLNEMsSUFBSTJGLElBQVYsRUFBWCxDQUFYO0FBQ0EsSUFmRDtBQWdCQSxZQUFTRixNQUFULENBQWdCakMsR0FBaEIsRUFBcUJyUyxHQUFyQixFQUEwQndSLElBQTFCLEVBQWdDbEMsSUFBaEMsRUFBcUM7QUFBRSxRQUFJVCxNQUFNLElBQVY7QUFDdEMsUUFBSVUsUUFBUUgsSUFBSUcsS0FBSixDQUFVaEcsRUFBVixDQUFhaUksSUFBYixFQUFtQnhSLEdBQW5CLENBQVo7QUFBQSxRQUFxQ3lPLEdBQXJDO0FBQ0EsUUFBRyxDQUFDYyxLQUFKLEVBQVU7QUFBRSxZQUFPVixJQUFJblAsR0FBSixHQUFVLHlCQUF1Qk0sR0FBdkIsR0FBMkIsYUFBM0IsR0FBeUNzUCxJQUF6QyxHQUE4QyxJQUEvRDtBQUFxRTtBQUNqRixRQUFJbUYsU0FBUzVGLElBQUk2RCxLQUFKLENBQVVwRCxJQUFWLEtBQW1CekMsS0FBaEM7QUFBQSxRQUF1QzZILE1BQU10RixJQUFJRyxLQUFKLENBQVVoRyxFQUFWLENBQWFrTCxNQUFiLEVBQXFCelUsR0FBckIsRUFBMEIsSUFBMUIsQ0FBN0M7QUFBQSxRQUE4RTJVLFFBQVFGLE9BQU96VSxHQUFQLENBQXRGO0FBQ0EsUUFBSWlRLE1BQU1iLElBQUlhLEdBQUosQ0FBUXBCLElBQUl3RixPQUFaLEVBQXFCOUUsS0FBckIsRUFBNEJtRixHQUE1QixFQUFpQ3JDLEdBQWpDLEVBQXNDc0MsS0FBdEMsQ0FBVjtBQUNBLFFBQUcsQ0FBQzFFLElBQUlTLFFBQVIsRUFBaUI7QUFDaEIsU0FBR1QsSUFBSU0sS0FBUCxFQUFhO0FBQUU7QUFDZDFCLFVBQUkwQixLQUFKLEdBQWFoQixTQUFTVixJQUFJMEIsS0FBSixJQUFheEcsUUFBdEIsQ0FBRCxHQUFtQ3dGLEtBQW5DLEdBQTJDVixJQUFJMEIsS0FBM0Q7QUFDQTtBQUNEO0FBQ0QxQixRQUFJNUMsR0FBSixDQUFRcUQsSUFBUixJQUFnQkYsSUFBSUcsS0FBSixDQUFVN0MsRUFBVixDQUFhOEUsSUFBYixFQUFtQnhSLEdBQW5CLEVBQXdCNk8sSUFBSTVDLEdBQUosQ0FBUXFELElBQVIsQ0FBeEIsQ0FBaEI7QUFDQSxLQUFDVCxJQUFJMkYsSUFBSixLQUFhM0YsSUFBSTJGLElBQUosR0FBVyxFQUF4QixDQUFELEVBQThCbEYsSUFBOUIsSUFBc0NGLElBQUlHLEtBQUosQ0FBVTdDLEVBQVYsQ0FBYThFLElBQWIsRUFBbUJ4UixHQUFuQixFQUF3QjZPLElBQUkyRixJQUFKLENBQVNsRixJQUFULENBQXhCLENBQXRDO0FBQ0E7QUFDRCxZQUFTaUYsS0FBVCxDQUFlL0MsSUFBZixFQUFxQmxDLElBQXJCLEVBQTBCO0FBQ3pCLFFBQUlzRixNQUFNLENBQUUsS0FBS3ZQLEdBQUwsQ0FBU3VHLENBQVYsQ0FBYTRCLElBQWIsSUFBcUJYLEtBQXRCLEVBQTZCeUMsSUFBN0IsQ0FBVjtBQUNBLFFBQUcsQ0FBQ3NGLEdBQUosRUFBUTtBQUFFO0FBQVE7QUFDbEIsUUFBSWhHLEtBQUssS0FBS3BKLEdBQUwsQ0FBUzhKLElBQVQsSUFBaUI7QUFDekJyRCxVQUFLLEtBQUt1RixJQUFMLEdBQVlBLElBRFE7QUFFekI0QyxVQUFLLEtBQUs5RSxJQUFMLEdBQVlBLElBRlE7QUFHekJqSyxVQUFLLEtBQUt1UCxHQUFMLEdBQVdBO0FBSFMsS0FBMUI7QUFLQS9JLFlBQVEyRixJQUFSLEVBQWN6QixJQUFkLEVBQW9CLElBQXBCO0FBQ0FYLFFBQUlyTCxFQUFKLENBQU8sTUFBUCxFQUFlNkssRUFBZjtBQUNBO0FBQ0QsWUFBU21CLElBQVQsQ0FBY3NDLEdBQWQsRUFBbUJyUyxHQUFuQixFQUF1QjtBQUN0QixRQUFJMFMsUUFBUSxLQUFLQSxLQUFqQjtBQUFBLFFBQXdCcEQsT0FBTyxLQUFLQSxJQUFwQztBQUFBLFFBQTBDMkUsTUFBTyxLQUFLVyxHQUFMLENBQVNoSixDQUExRDtBQUFBLFFBQThENkMsR0FBOUQ7QUFDQWlFLFVBQU1wRCxJQUFOLElBQWNGLElBQUlHLEtBQUosQ0FBVTdDLEVBQVYsQ0FBYSxLQUFLOEUsSUFBbEIsRUFBd0J4UixHQUF4QixFQUE2QjBTLE1BQU1wRCxJQUFOLENBQTdCLENBQWQ7QUFDQSxLQUFDMkUsSUFBSWhJLEdBQUosS0FBWWdJLElBQUloSSxHQUFKLEdBQVUsRUFBdEIsQ0FBRCxFQUE0QmpNLEdBQTVCLElBQW1DcVMsR0FBbkM7QUFDQTtBQUNELFlBQVM3TSxHQUFULENBQWFvSixFQUFiLEVBQWlCVSxJQUFqQixFQUFzQjtBQUNyQixRQUFHLENBQUNWLEdBQUd2SixHQUFQLEVBQVc7QUFBRTtBQUFRO0FBQ3BCdUosT0FBR3ZKLEdBQUgsQ0FBT3VHLENBQVIsQ0FBVzdILEVBQVgsQ0FBYyxJQUFkLEVBQW9CNkssRUFBcEI7QUFDQTtBQUNELEdBbERDLEdBQUQ7O0FBb0RELEdBQUUsYUFBVTtBQUNYUSxPQUFJckwsRUFBSixDQUFPLEtBQVAsRUFBYyxVQUFTNkssRUFBVCxFQUFZO0FBQ3pCLFFBQUlQLEtBQUssSUFBVDtBQUFBLFFBQWVpQixPQUFPVixHQUFHd0YsR0FBSCxDQUFPUyxLQUFQLENBQXRCO0FBQUEsUUFBcUNaLE1BQU1yRixHQUFHdkosR0FBSCxDQUFPdUcsQ0FBbEQ7QUFBQSxRQUFxRDRGLE9BQU95QyxJQUFJdkIsS0FBSixDQUFVcEQsSUFBVixDQUE1RDtBQUFBLFFBQTZFeUUsUUFBUW5GLEdBQUd3RixHQUFILENBQU9VLE1BQVAsQ0FBckY7QUFBQSxRQUFxR3JHLEdBQXJHO0FBQ0EsUUFBSWpCLE9BQU95RyxJQUFJekcsSUFBSixLQUFheUcsSUFBSXpHLElBQUosR0FBVyxFQUF4QixDQUFYO0FBQUEsUUFBd0NuQixLQUFNLENBQUNtQixLQUFLOEIsSUFBTCxLQUFjekMsS0FBZixFQUFzQmpCLENBQXBFO0FBQ0EsUUFBRyxDQUFDNEYsSUFBRCxJQUFTLENBQUNuRixFQUFiLEVBQWdCO0FBQUUsWUFBT2dDLEdBQUczQixFQUFILENBQU1jLElBQU4sQ0FBV29CLEVBQVgsQ0FBUDtBQUF1QjtBQUN6QyxRQUFHbUYsS0FBSCxFQUFTO0FBQ1IsU0FBRyxDQUFDdEgsUUFBUStFLElBQVIsRUFBY3VDLEtBQWQsQ0FBSixFQUF5QjtBQUFFLGFBQU8xRixHQUFHM0IsRUFBSCxDQUFNYyxJQUFOLENBQVdvQixFQUFYLENBQVA7QUFBdUI7QUFDbEQ0QyxZQUFPcEMsSUFBSUcsS0FBSixDQUFVN0MsRUFBVixDQUFhOEUsSUFBYixFQUFtQnVDLEtBQW5CLENBQVA7QUFDQSxLQUhELE1BR087QUFDTnZDLFlBQU9wQyxJQUFJckUsR0FBSixDQUFRNkIsSUFBUixDQUFhNEUsSUFBYixDQUFQO0FBQ0E7QUFDRDtBQUNDQSxXQUFPcEMsSUFBSXNELEtBQUosQ0FBVWxCLElBQVYsQ0FBZUEsSUFBZixDQUFQLENBWHdCLENBV0s7QUFDOUI7QUFDQTtBQUNBO0FBQ0EvQyxVQUFNcEMsR0FBRzJDLEdBQVQ7QUFDQWlGLFFBQUlsUSxFQUFKLENBQU8sSUFBUCxFQUFhO0FBQ1osVUFBSzZLLEdBQUcsR0FBSCxDQURPO0FBRVptRyxVQUFLLEtBRk87QUFHWjlJLFVBQUt1RixJQUhPO0FBSVpuTSxVQUFLZ0gsR0FBR2hIO0FBSkksS0FBYjtBQU1BLFFBQUcsSUFBSW9KLEdBQVAsRUFBVztBQUNWO0FBQ0E7QUFDREosT0FBRzNCLEVBQUgsQ0FBTWMsSUFBTixDQUFXb0IsRUFBWDtBQUNBLElBMUJEO0FBMkJBLEdBNUJDLEdBQUQ7O0FBOEJELEdBQUUsYUFBVTtBQUNYUSxPQUFJckwsRUFBSixDQUFPK0ssR0FBUCxHQUFhLFVBQVNQLEVBQVQsRUFBYWxDLEVBQWIsRUFBZ0I7QUFDNUIsUUFBRyxDQUFDLEtBQUt0SSxFQUFULEVBQVk7QUFBRTtBQUFRO0FBQ3RCLFFBQUl1QixLQUFLOEosSUFBSXBGLElBQUosQ0FBU0ssTUFBVCxFQUFUO0FBQ0EsUUFBR2tFLEVBQUgsRUFBTTtBQUFFLFVBQUt4SyxFQUFMLENBQVF1QixFQUFSLEVBQVlpSixFQUFaLEVBQWdCbEMsRUFBaEI7QUFBcUI7QUFDN0IsV0FBTy9HLEVBQVA7QUFDQSxJQUxEO0FBTUE4SixPQUFJckwsRUFBSixDQUFPaUwsR0FBUCxHQUFhLFVBQVNKLEVBQVQsRUFBYUssS0FBYixFQUFtQjtBQUMvQixRQUFHLENBQUNMLEVBQUQsSUFBTyxDQUFDSyxLQUFSLElBQWlCLENBQUMsS0FBS2xMLEVBQTFCLEVBQTZCO0FBQUU7QUFBUTtBQUN2QyxRQUFJdUIsS0FBS3NKLEdBQUcsR0FBSCxLQUFXQSxFQUFwQjtBQUNBLFFBQUcsQ0FBQyxLQUFLckIsR0FBTixJQUFhLENBQUMsS0FBS0EsR0FBTCxDQUFTakksRUFBVCxDQUFqQixFQUE4QjtBQUFFO0FBQVE7QUFDeEMsU0FBS3ZCLEVBQUwsQ0FBUXVCLEVBQVIsRUFBWTJKLEtBQVo7QUFDQSxXQUFPLElBQVA7QUFDQSxJQU5EO0FBT0EsR0FkQyxHQUFEOztBQWdCRCxHQUFFLGFBQVU7QUFDWEcsT0FBSWhCLEtBQUosQ0FBVUosR0FBVixHQUFnQixVQUFTQSxHQUFULEVBQWE7QUFDNUJBLFVBQU1BLE9BQU8sRUFBYjtBQUNBLFFBQUkzSSxNQUFNLElBQVY7QUFBQSxRQUFnQnVKLEtBQUt2SixJQUFJdUcsQ0FBekI7QUFBQSxRQUE0QjZDLE1BQU1ULElBQUlnSCxLQUFKLElBQWFoSCxHQUEvQztBQUNBLFFBQUcsQ0FBQ3pCLE9BQU95QixHQUFQLENBQUosRUFBZ0I7QUFBRUEsV0FBTSxFQUFOO0FBQVU7QUFDNUIsUUFBRyxDQUFDekIsT0FBT3FDLEdBQUdaLEdBQVYsQ0FBSixFQUFtQjtBQUFFWSxRQUFHWixHQUFILEdBQVNBLEdBQVQ7QUFBYztBQUNuQyxRQUFHK0MsUUFBUXRDLEdBQVIsQ0FBSCxFQUFnQjtBQUFFQSxXQUFNLENBQUNBLEdBQUQsQ0FBTjtBQUFhO0FBQy9CLFFBQUc1RSxRQUFRNEUsR0FBUixDQUFILEVBQWdCO0FBQ2ZBLFdBQU01QyxRQUFRNEMsR0FBUixFQUFhLFVBQVN3RyxHQUFULEVBQWN6VSxDQUFkLEVBQWlCZ0YsR0FBakIsRUFBcUI7QUFDdkNBLFVBQUl5UCxHQUFKLEVBQVMsRUFBQ0EsS0FBS0EsR0FBTixFQUFUO0FBQ0EsTUFGSyxDQUFOO0FBR0EsU0FBRyxDQUFDMUksT0FBT3FDLEdBQUdaLEdBQUgsQ0FBT2dILEtBQWQsQ0FBSixFQUF5QjtBQUFFcEcsU0FBR1osR0FBSCxDQUFPZ0gsS0FBUCxHQUFlLEVBQWY7QUFBa0I7QUFDN0NwRyxRQUFHWixHQUFILENBQU9nSCxLQUFQLEdBQWViLE9BQU8xRixHQUFQLEVBQVlHLEdBQUdaLEdBQUgsQ0FBT2dILEtBQW5CLENBQWY7QUFDQTtBQUNEcEcsT0FBR1osR0FBSCxDQUFPa0gsR0FBUCxHQUFhdEcsR0FBR1osR0FBSCxDQUFPa0gsR0FBUCxJQUFjLEVBQUNDLFdBQVUsRUFBWCxFQUEzQjtBQUNBdkcsT0FBR1osR0FBSCxDQUFPZ0gsS0FBUCxHQUFlcEcsR0FBR1osR0FBSCxDQUFPZ0gsS0FBUCxJQUFnQixFQUEvQjtBQUNBYixXQUFPbkcsR0FBUCxFQUFZWSxHQUFHWixHQUFmLEVBZjRCLENBZVA7QUFDckJvQixRQUFJckwsRUFBSixDQUFPLEtBQVAsRUFBYzZLLEVBQWQ7QUFDQSxXQUFPdkosR0FBUDtBQUNBLElBbEJEO0FBbUJBLEdBcEJDLEdBQUQ7O0FBc0JELE1BQUkwTCxVQUFVM0IsSUFBSXBGLElBQUosQ0FBU1QsRUFBdkI7QUFDQSxNQUFJTSxVQUFVdUYsSUFBSWxFLElBQUosQ0FBUzNCLEVBQXZCO0FBQ0EsTUFBSXdCLE1BQU1xRSxJQUFJckUsR0FBZDtBQUFBLE1BQW1Cd0IsU0FBU3hCLElBQUl4QixFQUFoQztBQUFBLE1BQW9Da0QsVUFBVTFCLElBQUlDLEdBQWxEO0FBQUEsTUFBdURtSixTQUFTcEosSUFBSTJCLEVBQXBFO0FBQUEsTUFBd0ViLFVBQVVkLElBQUl2RixHQUF0RjtBQUFBLE1BQTJGOE0sV0FBV3ZILElBQUk2QixJQUExRztBQUNBLE1BQUlpSSxRQUFRekYsSUFBSXhELENBQUosQ0FBTTBELElBQWxCO0FBQUEsTUFBd0J3RixTQUFTMUYsSUFBSXhELENBQUosQ0FBTW1JLEtBQXZDO0FBQUEsTUFBOENxQixTQUFTaEcsSUFBSWlELEdBQUosQ0FBUW5CLEdBQVIsQ0FBWTNILEVBQW5FO0FBQ0EsTUFBSXNELFFBQVEsRUFBWjtBQUFBLE1BQWdCUCxDQUFoQjs7QUFFQW5HLFVBQVFrUCxLQUFSLEdBQWdCLFVBQVM3VSxDQUFULEVBQVlnSyxDQUFaLEVBQWM7QUFBRSxVQUFRckUsUUFBUWtQLEtBQVIsQ0FBYzdVLENBQWQsSUFBbUJBLE1BQU0yRixRQUFRa1AsS0FBUixDQUFjN1UsQ0FBdkMsSUFBNEMyRixRQUFRa1AsS0FBUixDQUFjN1UsQ0FBZCxFQUE3QyxLQUFvRTJGLFFBQVFDLEdBQVIsQ0FBWTdDLEtBQVosQ0FBa0I0QyxPQUFsQixFQUEyQmhELFNBQTNCLEtBQXlDcUgsQ0FBN0csQ0FBUDtBQUF3SCxHQUF4Sjs7QUFFQTRFLE1BQUloSixHQUFKLEdBQVUsWUFBVTtBQUFFLFVBQVEsQ0FBQ2dKLElBQUloSixHQUFKLENBQVFsQyxHQUFULElBQWdCaUMsUUFBUUMsR0FBUixDQUFZN0MsS0FBWixDQUFrQjRDLE9BQWxCLEVBQTJCaEQsU0FBM0IsQ0FBakIsRUFBeUQsR0FBRzBGLEtBQUgsQ0FBUzFHLElBQVQsQ0FBY2dCLFNBQWQsRUFBeUI0UCxJQUF6QixDQUE4QixHQUE5QixDQUFoRTtBQUFvRyxHQUExSDtBQUNBM0QsTUFBSWhKLEdBQUosQ0FBUW5DLElBQVIsR0FBZSxVQUFTcVIsQ0FBVCxFQUFXOUssQ0FBWCxFQUFhSyxDQUFiLEVBQWU7QUFBRSxVQUFPLENBQUNBLElBQUl1RSxJQUFJaEosR0FBSixDQUFRbkMsSUFBYixFQUFtQnFSLENBQW5CLElBQXdCekssRUFBRXlLLENBQUYsS0FBUSxDQUFoQyxFQUFtQ3pLLEVBQUV5SyxDQUFGLE9BQVVsRyxJQUFJaEosR0FBSixDQUFRb0UsQ0FBUixDQUFwRDtBQUFnRSxHQUFoRyxDQUVDO0FBQ0Q0RSxNQUFJaEosR0FBSixDQUFRbkMsSUFBUixDQUFhLFNBQWIsRUFBd0IsOEpBQXhCO0FBQ0EsR0FBQzs7QUFFRCxNQUFHLE9BQU9zRSxNQUFQLEtBQWtCLFdBQXJCLEVBQWlDO0FBQUVBLFVBQU82RyxHQUFQLEdBQWFBLEdBQWI7QUFBa0I7QUFDckQsTUFBRyxPQUFPakcsTUFBUCxLQUFrQixXQUFyQixFQUFpQztBQUFFQSxVQUFPMUgsT0FBUCxHQUFpQjJOLEdBQWpCO0FBQXNCO0FBQ3pENU4sU0FBT0MsT0FBUCxHQUFpQjJOLEdBQWpCO0FBQ0EsRUF6TkEsRUF5TkV6RyxPQXpORixFQXlOVyxRQXpOWDs7QUEyTkQsRUFBQ0EsUUFBUSxVQUFTbkgsTUFBVCxFQUFnQjtBQUN4QixNQUFJNE4sTUFBTXpHLFFBQVEsUUFBUixDQUFWO0FBQ0F5RyxNQUFJaEIsS0FBSixDQUFVUixJQUFWLEdBQWlCLFVBQVNoRSxDQUFULEVBQVlvRSxHQUFaLEVBQWdCO0FBQUUsT0FBSVMsR0FBSjtBQUNsQyxPQUFHLENBQUMsQ0FBRCxLQUFPN0UsQ0FBUCxJQUFZRyxhQUFhSCxDQUE1QixFQUE4QjtBQUM3QixXQUFPLEtBQUtnQyxDQUFMLENBQU9uRCxJQUFkO0FBQ0EsSUFGRCxNQUdBLElBQUcsTUFBTW1CLENBQVQsRUFBVztBQUNWLFdBQU8sS0FBS2dDLENBQUwsQ0FBT2dDLElBQVAsSUFBZSxJQUF0QjtBQUNBO0FBQ0QsT0FBSXZJLE1BQU0sSUFBVjtBQUFBLE9BQWdCdUosS0FBS3ZKLElBQUl1RyxDQUF6QjtBQUNBLE9BQUcsT0FBT2hDLENBQVAsS0FBYSxRQUFoQixFQUF5QjtBQUN4QkEsUUFBSUEsRUFBRVosS0FBRixDQUFRLEdBQVIsQ0FBSjtBQUNBO0FBQ0QsT0FBR1ksYUFBYTFHLEtBQWhCLEVBQXNCO0FBQ3JCLFFBQUkxQyxJQUFJLENBQVI7QUFBQSxRQUFXOEosSUFBSVYsRUFBRW5KLE1BQWpCO0FBQUEsUUFBeUJnTyxNQUFNRyxFQUEvQjtBQUNBLFNBQUlwTyxDQUFKLEVBQU9BLElBQUk4SixDQUFYLEVBQWM5SixHQUFkLEVBQWtCO0FBQ2pCaU8sV0FBTSxDQUFDQSxPQUFLNUIsS0FBTixFQUFhakQsRUFBRXBKLENBQUYsQ0FBYixDQUFOO0FBQ0E7QUFDRCxRQUFHOEwsTUFBTW1DLEdBQVQsRUFBYTtBQUNaLFlBQU9ULE1BQUszSSxHQUFMLEdBQVdvSixHQUFsQjtBQUNBLEtBRkQsTUFHQSxJQUFJQSxNQUFNRyxHQUFHaEIsSUFBYixFQUFtQjtBQUNsQixZQUFPYSxJQUFJYixJQUFKLENBQVNoRSxDQUFULEVBQVlvRSxHQUFaLENBQVA7QUFDQTtBQUNEO0FBQ0E7QUFDRCxPQUFHcEUsYUFBYXZCLFFBQWhCLEVBQXlCO0FBQ3hCLFFBQUlrTixHQUFKO0FBQUEsUUFBUzlHLE1BQU0sRUFBQ2IsTUFBTXZJLEdBQVAsRUFBZjtBQUNBLFdBQU0sQ0FBQ29KLE1BQU1BLElBQUliLElBQVgsTUFDRmEsTUFBTUEsSUFBSTdDLENBRFIsS0FFSCxFQUFFMkosTUFBTTNMLEVBQUU2RSxHQUFGLEVBQU9ULEdBQVAsQ0FBUixDQUZILEVBRXdCLENBQUU7QUFDMUIsV0FBT3VILEdBQVA7QUFDQTtBQUNELEdBL0JEO0FBZ0NBLE1BQUkxSSxRQUFRLEVBQVo7QUFBQSxNQUFnQlAsQ0FBaEI7QUFDQSxFQW5DQSxFQW1DRTNELE9BbkNGLEVBbUNXLFFBbkNYOztBQXFDRCxFQUFDQSxRQUFRLFVBQVNuSCxNQUFULEVBQWdCO0FBQ3hCLE1BQUk0TixNQUFNekcsUUFBUSxRQUFSLENBQVY7QUFDQXlHLE1BQUloQixLQUFKLENBQVVBLEtBQVYsR0FBa0IsWUFBVTtBQUMzQixPQUFJUSxLQUFLLEtBQUtoRCxDQUFkO0FBQUEsT0FBaUJ3QyxRQUFRLElBQUksS0FBS3BDLFdBQVQsQ0FBcUIsSUFBckIsQ0FBekI7QUFBQSxPQUFxRGlJLE1BQU03RixNQUFNeEMsQ0FBakU7QUFDQXFJLE9BQUl4TCxJQUFKLEdBQVdBLE9BQU9tRyxHQUFHbkcsSUFBckI7QUFDQXdMLE9BQUkzTyxFQUFKLEdBQVMsRUFBRW1ELEtBQUttRCxDQUFMLENBQU8zSCxJQUFsQjtBQUNBZ1EsT0FBSXJHLElBQUosR0FBVyxJQUFYO0FBQ0FxRyxPQUFJbFEsRUFBSixHQUFTcUwsSUFBSXJMLEVBQWI7QUFDQXFMLE9BQUlyTCxFQUFKLENBQU8sT0FBUCxFQUFnQmtRLEdBQWhCO0FBQ0FBLE9BQUlsUSxFQUFKLENBQU8sSUFBUCxFQUFhc0wsS0FBYixFQUFvQjRFLEdBQXBCLEVBUDJCLENBT0Q7QUFDMUJBLE9BQUlsUSxFQUFKLENBQU8sS0FBUCxFQUFjeVIsTUFBZCxFQUFzQnZCLEdBQXRCLEVBUjJCLENBUUM7QUFDNUIsVUFBTzdGLEtBQVA7QUFDQSxHQVZEO0FBV0EsV0FBU29ILE1BQVQsQ0FBZ0I1RyxFQUFoQixFQUFtQjtBQUNsQixPQUFJcUYsTUFBTSxLQUFLNUgsRUFBZjtBQUFBLE9BQW1CaEgsTUFBTTRPLElBQUk1TyxHQUE3QjtBQUFBLE9BQWtDb0QsT0FBT3BELElBQUl1SSxJQUFKLENBQVMsQ0FBQyxDQUFWLENBQXpDO0FBQUEsT0FBdUQzQixHQUF2RDtBQUFBLE9BQTREbUksR0FBNUQ7QUFBQSxPQUFpRXZFLEdBQWpFO0FBQUEsT0FBc0VwQixHQUF0RTtBQUNBLE9BQUcsQ0FBQ0csR0FBR3ZKLEdBQVAsRUFBVztBQUNWdUosT0FBR3ZKLEdBQUgsR0FBU0EsR0FBVDtBQUNBO0FBQ0QsT0FBRytPLE1BQU14RixHQUFHd0YsR0FBWixFQUFnQjtBQUNmLFFBQUczRixNQUFNMkYsSUFBSVMsS0FBSixDQUFULEVBQW9CO0FBQ25CcEcsV0FBT2hHLEtBQUsyTCxHQUFMLENBQVMzRixHQUFULEVBQWM3QyxDQUFyQjtBQUNBLFNBQUdhLFFBQVEySCxHQUFSLEVBQWFVLE1BQWIsQ0FBSCxFQUF3QjtBQUN2QixVQUFHckksUUFBUVIsTUFBTXdDLElBQUl4QyxHQUFsQixFQUF1Qm1JLE1BQU1BLElBQUlVLE1BQUosQ0FBN0IsQ0FBSCxFQUE2QztBQUM1Q3JHLFdBQUkxSyxFQUFKLENBQU8sSUFBUCxFQUFhLEVBQUNxUSxLQUFLM0YsSUFBSTJGLEdBQVYsRUFBZW5JLEtBQUttRCxJQUFJRyxLQUFKLENBQVU3QyxFQUFWLENBQWFULEdBQWIsRUFBa0JtSSxHQUFsQixDQUFwQixFQUE0Qy9PLEtBQUtvSixJQUFJcEosR0FBckQsRUFBYixFQUQ0QyxDQUM2QjtBQUN6RTtBQUNELE1BSkQsTUFLQSxJQUFHb0gsUUFBUWdDLEdBQVIsRUFBYSxLQUFiLENBQUgsRUFBdUI7QUFDdkI7QUFDQ0EsVUFBSTFLLEVBQUosQ0FBTyxJQUFQLEVBQWEwSyxHQUFiO0FBQ0E7QUFDRCxLQVhELE1BV087QUFDTixTQUFHaEMsUUFBUTJILEdBQVIsRUFBYVUsTUFBYixDQUFILEVBQXdCO0FBQ3ZCVixZQUFNQSxJQUFJVSxNQUFKLENBQU47QUFDQSxVQUFJdEgsT0FBTzRHLE1BQU0vTyxJQUFJK08sR0FBSixDQUFRQSxHQUFSLEVBQWF4SSxDQUFuQixHQUF3QnFJLEdBQW5DO0FBQ0E7QUFDQTtBQUNBLFVBQUczSCxNQUFNa0IsS0FBS3ZCLEdBQWQsRUFBa0I7QUFBRTtBQUNuQjtBQUNBdUIsWUFBS3pKLEVBQUwsQ0FBUSxJQUFSLEVBQWN5SixJQUFkO0FBQ0E7QUFDQTtBQUNELFVBQUdmLFFBQVF3SCxHQUFSLEVBQWEsS0FBYixDQUFILEVBQXVCO0FBQ3ZCO0FBQ0MsV0FBSTVCLE1BQU00QixJQUFJaEksR0FBZDtBQUFBLFdBQW1CaUYsR0FBbkI7QUFDQSxXQUFHQSxNQUFNOUIsSUFBSW9DLElBQUosQ0FBU2xDLElBQVQsQ0FBYytDLEdBQWQsQ0FBVCxFQUE0QjtBQUMzQkEsY0FBTWpELElBQUlpRCxHQUFKLENBQVFuQixHQUFSLENBQVloSCxHQUFaLENBQWdCZ0gsR0FBaEIsQ0FBTjtBQUNBO0FBQ0QsV0FBR0EsTUFBTTlCLElBQUlpRCxHQUFKLENBQVFuQixHQUFSLENBQVkzSCxFQUFaLENBQWU4SSxHQUFmLENBQVQsRUFBNkI7QUFDNUIsWUFBRyxDQUFDekQsR0FBR3ZKLEdBQUgsQ0FBT3VHLENBQVgsRUFBYTtBQUFFO0FBQVE7QUFDdEJnRCxXQUFHdkosR0FBSCxDQUFPdUcsQ0FBUixDQUFXN0gsRUFBWCxDQUFjLEtBQWQsRUFBcUI7QUFDcEJxUSxjQUFLM0YsTUFBTSxFQUFDLEtBQUt5QyxHQUFOLEVBQVcsS0FBS2tELEdBQWhCLEVBQXFCL08sS0FBS3VKLEdBQUd2SixHQUE3QixFQURTO0FBRXBCLGNBQUtvRCxLQUFLbUQsQ0FBTCxDQUFPa0QsR0FBUCxDQUFXTSxJQUFJYSxHQUFKLENBQVF3RixLQUFuQixFQUEwQmhILEdBQTFCLENBRmU7QUFHcEJwSixjQUFLdUosR0FBR3ZKO0FBSFksU0FBckI7QUFLQTtBQUNBO0FBQ0QsV0FBR2lILE1BQU0rRixHQUFOLElBQWFqRCxJQUFJaUQsR0FBSixDQUFROUksRUFBUixDQUFXOEksR0FBWCxDQUFoQixFQUFnQztBQUMvQixZQUFHLENBQUN6RCxHQUFHdkosR0FBSCxDQUFPdUcsQ0FBWCxFQUFhO0FBQUU7QUFBUTtBQUN0QmdELFdBQUd2SixHQUFILENBQU91RyxDQUFSLENBQVc3SCxFQUFYLENBQWMsSUFBZCxFQUFvQjtBQUNuQnFRLGNBQUtBLEdBRGM7QUFFbkIvTyxjQUFLdUosR0FBR3ZKO0FBRlcsU0FBcEI7QUFJQTtBQUNBO0FBQ0QsT0F2QkQsTUF3QkEsSUFBRzRPLElBQUl6TyxHQUFQLEVBQVc7QUFDVnFHLGVBQVFvSSxJQUFJek8sR0FBWixFQUFpQixVQUFTa1EsS0FBVCxFQUFlO0FBQy9CQSxjQUFNOUcsRUFBTixDQUFTN0ssRUFBVCxDQUFZLElBQVosRUFBa0IyUixNQUFNOUcsRUFBeEI7QUFDQSxRQUZEO0FBR0E7QUFDRCxVQUFHcUYsSUFBSTNFLElBQVAsRUFBWTtBQUNYLFdBQUcsQ0FBQ1YsR0FBR3ZKLEdBQUgsQ0FBT3VHLENBQVgsRUFBYTtBQUFFO0FBQVE7QUFDdEJnRCxVQUFHdkosR0FBSCxDQUFPdUcsQ0FBUixDQUFXN0gsRUFBWCxDQUFjLEtBQWQsRUFBcUI7QUFDcEJxUSxhQUFLM0YsTUFBTSxFQUFDLEtBQUt3RixJQUFJM0UsSUFBVixFQUFnQixLQUFLOEUsR0FBckIsRUFBMEIvTyxLQUFLdUosR0FBR3ZKLEdBQWxDLEVBRFM7QUFFcEIsYUFBS29ELEtBQUttRCxDQUFMLENBQU9rRCxHQUFQLENBQVdNLElBQUlhLEdBQUosQ0FBUXdGLEtBQW5CLEVBQTBCaEgsR0FBMUIsQ0FGZTtBQUdwQnBKLGFBQUt1SixHQUFHdko7QUFIWSxRQUFyQjtBQUtBO0FBQ0E7QUFDRCxVQUFHNE8sSUFBSUcsR0FBUCxFQUFXO0FBQ1YsV0FBRyxDQUFDSCxJQUFJckcsSUFBSixDQUFTaEMsQ0FBYixFQUFlO0FBQUU7QUFBUTtBQUN4QnFJLFdBQUlyRyxJQUFKLENBQVNoQyxDQUFWLENBQWE3SCxFQUFiLENBQWdCLEtBQWhCLEVBQXVCO0FBQ3RCcVEsYUFBS2hELFFBQVEsRUFBUixFQUFZMEQsTUFBWixFQUFvQmIsSUFBSUcsR0FBeEIsQ0FEaUI7QUFFdEIvTyxhQUFLQTtBQUZpQixRQUF2QjtBQUlBO0FBQ0E7QUFDRHVKLFdBQUt1RixPQUFPdkYsRUFBUCxFQUFXLEVBQUN3RixLQUFLLEVBQU4sRUFBWCxDQUFMO0FBQ0EsTUF6REQsTUF5RE87QUFDTixVQUFHM0gsUUFBUXdILEdBQVIsRUFBYSxLQUFiLENBQUgsRUFBdUI7QUFDdkI7QUFDQ0EsV0FBSWxRLEVBQUosQ0FBTyxJQUFQLEVBQWFrUSxHQUFiO0FBQ0EsT0FIRCxNQUlBLElBQUdBLElBQUl6TyxHQUFQLEVBQVc7QUFDVnFHLGVBQVFvSSxJQUFJek8sR0FBWixFQUFpQixVQUFTa1EsS0FBVCxFQUFlO0FBQy9CQSxjQUFNOUcsRUFBTixDQUFTN0ssRUFBVCxDQUFZLElBQVosRUFBa0IyUixNQUFNOUcsRUFBeEI7QUFDQSxRQUZEO0FBR0E7QUFDRCxVQUFHcUYsSUFBSWpGLEdBQVAsRUFBVztBQUNWLFdBQUcsQ0FBQ3ZDLFFBQVF3SCxHQUFSLEVBQWEsS0FBYixDQUFKLEVBQXdCO0FBQUU7QUFDMUI7QUFDQztBQUNBO0FBQ0Q7QUFDREEsVUFBSWpGLEdBQUosR0FBVSxDQUFDLENBQVg7QUFDQSxVQUFHaUYsSUFBSTNFLElBQVAsRUFBWTtBQUNYMkUsV0FBSWxRLEVBQUosQ0FBTyxLQUFQLEVBQWM7QUFDYnFRLGFBQUszRixNQUFNLEVBQUMsS0FBS3dGLElBQUkzRSxJQUFWLEVBQWdCakssS0FBSzRPLElBQUk1TyxHQUF6QixFQURFO0FBRWIsYUFBS29ELEtBQUttRCxDQUFMLENBQU9rRCxHQUFQLENBQVdNLElBQUlhLEdBQUosQ0FBUXdGLEtBQW5CLEVBQTBCaEgsR0FBMUIsQ0FGUTtBQUdicEosYUFBSzRPLElBQUk1TztBQUhJLFFBQWQ7QUFLQTtBQUNBO0FBQ0QsVUFBRzRPLElBQUlHLEdBQVAsRUFBVztBQUNWLFdBQUcsQ0FBQ0gsSUFBSXJHLElBQUosQ0FBU2hDLENBQWIsRUFBZTtBQUFFO0FBQVE7QUFDeEJxSSxXQUFJckcsSUFBSixDQUFTaEMsQ0FBVixDQUFhN0gsRUFBYixDQUFnQixLQUFoQixFQUF1QjtBQUN0QnFRLGFBQUtoRCxRQUFRLEVBQVIsRUFBWTBELE1BQVosRUFBb0JiLElBQUlHLEdBQXhCLENBRGlCO0FBRXRCL08sYUFBSzRPLElBQUk1TztBQUZhLFFBQXZCO0FBSUE7QUFDQTtBQUNEO0FBQ0Q7QUFDRDtBQUNBNE8sT0FBSXJHLElBQUosQ0FBU2hDLENBQVYsQ0FBYTdILEVBQWIsQ0FBZ0IsS0FBaEIsRUFBdUI2SyxFQUF2QjtBQUNBO0FBQ0QsV0FBU1MsS0FBVCxDQUFlVCxFQUFmLEVBQWtCO0FBQ2pCQSxRQUFLQSxHQUFHaEQsQ0FBSCxJQUFRZ0QsRUFBYjtBQUNBLE9BQUlQLEtBQUssSUFBVDtBQUFBLE9BQWU0RixNQUFNLEtBQUs1SCxFQUExQjtBQUFBLE9BQThCaEgsTUFBTXVKLEdBQUd2SixHQUF2QztBQUFBLE9BQTRDNk8sT0FBTzdPLElBQUl1RyxDQUF2RDtBQUFBLE9BQTBEK0osU0FBUy9HLEdBQUczQyxHQUF0RTtBQUFBLE9BQTJFMkIsT0FBT3FHLElBQUlyRyxJQUFKLENBQVNoQyxDQUFULElBQWNpQixLQUFoRztBQUFBLE9BQXVHcUUsR0FBdkc7QUFBQSxPQUE0R3pDLEdBQTVHO0FBQ0EsT0FBRyxJQUFJd0YsSUFBSWpGLEdBQVIsSUFBZSxDQUFDSixHQUFHSSxHQUFuQixJQUEwQixDQUFDSSxJQUFJaUQsR0FBSixDQUFRbkIsR0FBUixDQUFZM0gsRUFBWixDQUFlb00sTUFBZixDQUE5QixFQUFxRDtBQUFFO0FBQ3REMUIsUUFBSWpGLEdBQUosR0FBVSxDQUFWO0FBQ0E7QUFDRCxPQUFHaUYsSUFBSUcsR0FBSixJQUFXeEYsR0FBR3dGLEdBQUgsS0FBV0gsSUFBSUcsR0FBN0IsRUFBaUM7QUFDaEN4RixTQUFLdUYsT0FBT3ZGLEVBQVAsRUFBVyxFQUFDd0YsS0FBS0gsSUFBSUcsR0FBVixFQUFYLENBQUw7QUFDQTtBQUNELE9BQUdILElBQUlGLEtBQUosSUFBYUcsU0FBU0QsR0FBekIsRUFBNkI7QUFDNUJyRixTQUFLdUYsT0FBT3ZGLEVBQVAsRUFBVyxFQUFDdkosS0FBSzRPLElBQUk1TyxHQUFWLEVBQVgsQ0FBTDtBQUNBLFFBQUc2TyxLQUFLbEYsR0FBUixFQUFZO0FBQ1hpRixTQUFJakYsR0FBSixHQUFVaUYsSUFBSWpGLEdBQUosSUFBV2tGLEtBQUtsRixHQUExQjtBQUNBO0FBQ0Q7QUFDRCxPQUFHMUMsTUFBTXFKLE1BQVQsRUFBZ0I7QUFDZnRILE9BQUczQixFQUFILENBQU1jLElBQU4sQ0FBV29CLEVBQVg7QUFDQSxRQUFHcUYsSUFBSTNFLElBQVAsRUFBWTtBQUFFO0FBQVE7QUFDdEJzRyxTQUFLM0IsR0FBTCxFQUFVckYsRUFBVixFQUFjUCxFQUFkO0FBQ0EsUUFBRzRGLElBQUlGLEtBQVAsRUFBYTtBQUNaOEIsU0FBSTVCLEdBQUosRUFBU3JGLEVBQVQ7QUFDQTtBQUNENkMsWUFBUXlDLEtBQUswQixJQUFiLEVBQW1CM0IsSUFBSTNPLEVBQXZCO0FBQ0FtTSxZQUFRd0MsSUFBSXpPLEdBQVosRUFBaUIwTyxLQUFLNU8sRUFBdEI7QUFDQTtBQUNBO0FBQ0QsT0FBRzJPLElBQUkzRSxJQUFQLEVBQVk7QUFDWCxRQUFHMkUsSUFBSXhMLElBQUosQ0FBU21ELENBQVQsQ0FBV2lFLEdBQWQsRUFBa0I7QUFBRWpCLFVBQUt1RixPQUFPdkYsRUFBUCxFQUFXLEVBQUMzQyxLQUFLMEosU0FBU3pCLEtBQUtqSSxHQUFwQixFQUFYLENBQUw7QUFBMkMsS0FEcEQsQ0FDcUQ7QUFDaEVvQyxPQUFHM0IsRUFBSCxDQUFNYyxJQUFOLENBQVdvQixFQUFYO0FBQ0FnSCxTQUFLM0IsR0FBTCxFQUFVckYsRUFBVixFQUFjUCxFQUFkO0FBQ0F4QyxZQUFROEosTUFBUixFQUFnQm5RLEdBQWhCLEVBQXFCLEVBQUNvSixJQUFJQSxFQUFMLEVBQVNxRixLQUFLQSxHQUFkLEVBQXJCO0FBQ0E7QUFDQTtBQUNELE9BQUcsRUFBRS9DLE1BQU05QixJQUFJaUQsR0FBSixDQUFRbkIsR0FBUixDQUFZM0gsRUFBWixDQUFlb00sTUFBZixDQUFSLENBQUgsRUFBbUM7QUFDbEMsUUFBR3ZHLElBQUlpRCxHQUFKLENBQVE5SSxFQUFSLENBQVdvTSxNQUFYLENBQUgsRUFBc0I7QUFDckIsU0FBRzFCLElBQUlGLEtBQUosSUFBYUUsSUFBSTNFLElBQXBCLEVBQXlCO0FBQ3hCdUcsVUFBSTVCLEdBQUosRUFBU3JGLEVBQVQ7QUFDQSxNQUZELE1BR0EsSUFBR3NGLEtBQUtILEtBQUwsSUFBY0csS0FBSzVFLElBQXRCLEVBQTJCO0FBQzFCLE9BQUM0RSxLQUFLMEIsSUFBTCxLQUFjMUIsS0FBSzBCLElBQUwsR0FBWSxFQUExQixDQUFELEVBQWdDM0IsSUFBSTNPLEVBQXBDLElBQTBDMk8sR0FBMUM7QUFDQSxPQUFDQSxJQUFJek8sR0FBSixLQUFZeU8sSUFBSXpPLEdBQUosR0FBVSxFQUF0QixDQUFELEVBQTRCME8sS0FBSzVPLEVBQWpDLElBQXVDMk8sSUFBSXpPLEdBQUosQ0FBUTBPLEtBQUs1TyxFQUFiLEtBQW9CLEVBQUNzSixJQUFJc0YsSUFBTCxFQUEzRDtBQUNBO0FBQ0E7QUFDRDdGLFFBQUczQixFQUFILENBQU1jLElBQU4sQ0FBV29CLEVBQVg7QUFDQWdILFVBQUszQixHQUFMLEVBQVVyRixFQUFWLEVBQWNQLEVBQWQ7QUFDQTtBQUNBO0FBQ0QsUUFBRzRGLElBQUlGLEtBQUosSUFBYUcsU0FBU0QsR0FBdEIsSUFBNkJ4SCxRQUFReUgsSUFBUixFQUFjLEtBQWQsQ0FBaEMsRUFBcUQ7QUFDcERELFNBQUloSSxHQUFKLEdBQVVpSSxLQUFLakksR0FBZjtBQUNBO0FBQ0QsUUFBRyxDQUFDaUYsTUFBTTlCLElBQUlvQyxJQUFKLENBQVNsQyxJQUFULENBQWNxRyxNQUFkLENBQVAsS0FBaUN6QixLQUFLSCxLQUF6QyxFQUErQztBQUM5Q0csVUFBS2pJLEdBQUwsR0FBWWdJLElBQUl4TCxJQUFKLENBQVMyTCxHQUFULENBQWFsRCxHQUFiLEVBQWtCdEYsQ0FBbkIsQ0FBc0JLLEdBQWpDO0FBQ0E7QUFDRG9DLE9BQUczQixFQUFILENBQU1jLElBQU4sQ0FBV29CLEVBQVg7QUFDQWdILFNBQUszQixHQUFMLEVBQVVyRixFQUFWLEVBQWNQLEVBQWQ7QUFDQXlILFdBQU83QixHQUFQLEVBQVlyRixFQUFaLEVBQWdCc0YsSUFBaEIsRUFBc0JoRCxHQUF0QjtBQUNBckYsWUFBUThKLE1BQVIsRUFBZ0JuUSxHQUFoQixFQUFxQixFQUFDb0osSUFBSUEsRUFBTCxFQUFTcUYsS0FBS0EsR0FBZCxFQUFyQjtBQUNBO0FBQ0E7QUFDRDZCLFVBQU83QixHQUFQLEVBQVlyRixFQUFaLEVBQWdCc0YsSUFBaEIsRUFBc0JoRCxHQUF0QjtBQUNBN0MsTUFBRzNCLEVBQUgsQ0FBTWMsSUFBTixDQUFXb0IsRUFBWDtBQUNBZ0gsUUFBSzNCLEdBQUwsRUFBVXJGLEVBQVYsRUFBY1AsRUFBZDtBQUNBO0FBQ0RlLE1BQUloQixLQUFKLENBQVVBLEtBQVYsQ0FBZ0JpQixLQUFoQixHQUF3QkEsS0FBeEI7QUFDQSxXQUFTeUcsTUFBVCxDQUFnQjdCLEdBQWhCLEVBQXFCckYsRUFBckIsRUFBeUJzRixJQUF6QixFQUErQmhELEdBQS9CLEVBQW1DO0FBQ2xDLE9BQUcsQ0FBQ0EsR0FBRCxJQUFRNkUsVUFBVTlCLElBQUlHLEdBQXpCLEVBQTZCO0FBQUU7QUFBUTtBQUN2QyxPQUFJM0YsTUFBT3dGLElBQUl4TCxJQUFKLENBQVMyTCxHQUFULENBQWFsRCxHQUFiLEVBQWtCdEYsQ0FBN0I7QUFDQSxPQUFHcUksSUFBSUYsS0FBUCxFQUFhO0FBQ1pHLFdBQU96RixHQUFQO0FBQ0EsSUFGRCxNQUdBLElBQUd5RixLQUFLSCxLQUFSLEVBQWM7QUFDYitCLFdBQU81QixJQUFQLEVBQWF0RixFQUFiLEVBQWlCc0YsSUFBakIsRUFBdUJoRCxHQUF2QjtBQUNBO0FBQ0QsT0FBR2dELFNBQVNELEdBQVosRUFBZ0I7QUFBRTtBQUFRO0FBQzFCLElBQUNDLEtBQUswQixJQUFMLEtBQWMxQixLQUFLMEIsSUFBTCxHQUFZLEVBQTFCLENBQUQsRUFBZ0MzQixJQUFJM08sRUFBcEMsSUFBMEMyTyxHQUExQztBQUNBLE9BQUdBLElBQUlGLEtBQUosSUFBYSxDQUFDLENBQUNFLElBQUl6TyxHQUFKLElBQVNxSCxLQUFWLEVBQWlCcUgsS0FBSzVPLEVBQXRCLENBQWpCLEVBQTJDO0FBQzFDdVEsUUFBSTVCLEdBQUosRUFBU3JGLEVBQVQ7QUFDQTtBQUNESCxTQUFNLENBQUN3RixJQUFJek8sR0FBSixLQUFZeU8sSUFBSXpPLEdBQUosR0FBVSxFQUF0QixDQUFELEVBQTRCME8sS0FBSzVPLEVBQWpDLElBQXVDMk8sSUFBSXpPLEdBQUosQ0FBUTBPLEtBQUs1TyxFQUFiLEtBQW9CLEVBQUNzSixJQUFJc0YsSUFBTCxFQUFqRTtBQUNBLE9BQUdoRCxRQUFRekMsSUFBSXlDLEdBQWYsRUFBbUI7QUFBRTtBQUFRO0FBQzdCcEMsT0FBSW1GLEdBQUosRUFBU3hGLElBQUl5QyxHQUFKLEdBQVVBLEdBQW5CO0FBQ0E7QUFDRCxXQUFTMEUsSUFBVCxDQUFjM0IsR0FBZCxFQUFtQnJGLEVBQW5CLEVBQXVCUCxFQUF2QixFQUEwQjtBQUN6QixPQUFHLENBQUM0RixJQUFJMkIsSUFBUixFQUFhO0FBQUU7QUFBUSxJQURFLENBQ0Q7QUFDeEIsT0FBRzNCLElBQUlGLEtBQVAsRUFBYTtBQUFFbkYsU0FBS3VGLE9BQU92RixFQUFQLEVBQVcsRUFBQ08sT0FBT2QsRUFBUixFQUFYLENBQUw7QUFBOEI7QUFDN0N4QyxXQUFRb0ksSUFBSTJCLElBQVosRUFBa0JJLE1BQWxCLEVBQTBCcEgsRUFBMUI7QUFDQTtBQUNELFdBQVNvSCxNQUFULENBQWdCL0IsR0FBaEIsRUFBb0I7QUFDbkJBLE9BQUlsUSxFQUFKLENBQU8sSUFBUCxFQUFhLElBQWI7QUFDQTtBQUNELFdBQVN5QixHQUFULENBQWF3QixJQUFiLEVBQW1CaEgsR0FBbkIsRUFBdUI7QUFBRTtBQUN4QixPQUFJaVUsTUFBTSxLQUFLQSxHQUFmO0FBQUEsT0FBb0J6RyxPQUFPeUcsSUFBSXpHLElBQUosSUFBWVgsS0FBdkM7QUFBQSxPQUE4Q29KLE1BQU0sS0FBS3JILEVBQXpEO0FBQUEsT0FBNkR2SixHQUE3RDtBQUFBLE9BQWtFK0ksS0FBbEU7QUFBQSxPQUF5RVEsRUFBekU7QUFBQSxPQUE2RUgsR0FBN0U7QUFDQSxPQUFHc0gsVUFBVS9WLEdBQVYsSUFBaUIsQ0FBQ3dOLEtBQUt4TixHQUFMLENBQXJCLEVBQStCO0FBQUU7QUFBUTtBQUN6QyxPQUFHLEVBQUVxRixNQUFNbUksS0FBS3hOLEdBQUwsQ0FBUixDQUFILEVBQXNCO0FBQ3JCO0FBQ0E7QUFDRDRPLFFBQU12SixJQUFJdUcsQ0FBVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQUdnRCxHQUFHbUYsS0FBTixFQUFZO0FBQ1gsUUFBRyxFQUFFL00sUUFBUUEsS0FBSzZOLEtBQUwsQ0FBUixJQUF1QnpGLElBQUlpRCxHQUFKLENBQVFuQixHQUFSLENBQVkzSCxFQUFaLENBQWV2QyxJQUFmLE1BQXlCb0ksSUFBSW9DLElBQUosQ0FBU2xDLElBQVQsQ0FBY1YsR0FBRzNDLEdBQWpCLENBQWxELENBQUgsRUFBNEU7QUFDM0UyQyxRQUFHM0MsR0FBSCxHQUFTakYsSUFBVDtBQUNBO0FBQ0RvSCxZQUFRL0ksR0FBUjtBQUNBLElBTEQsTUFLTztBQUNOK0ksWUFBUTZILElBQUk1USxHQUFKLENBQVErTyxHQUFSLENBQVlwVSxHQUFaLENBQVI7QUFDQTtBQUNENE8sTUFBRzdLLEVBQUgsQ0FBTSxJQUFOLEVBQVk7QUFDWGtJLFNBQUtqRixJQURNO0FBRVhvTixTQUFLcFUsR0FGTTtBQUdYcUYsU0FBSytJLEtBSE07QUFJWDZILFNBQUtBO0FBSk0sSUFBWjtBQU1BO0FBQ0QsV0FBU0osR0FBVCxDQUFhNUIsR0FBYixFQUFrQnJGLEVBQWxCLEVBQXFCO0FBQ3BCLE9BQUcsRUFBRXFGLElBQUlGLEtBQUosSUFBYUUsSUFBSTNFLElBQW5CLENBQUgsRUFBNEI7QUFBRTtBQUFRO0FBQ3RDLE9BQUliLE1BQU13RixJQUFJek8sR0FBZDtBQUNBeU8sT0FBSXpPLEdBQUosR0FBVSxJQUFWO0FBQ0EsT0FBRyxTQUFTaUosR0FBWixFQUFnQjtBQUFFO0FBQVE7QUFDMUIsT0FBR25DLE1BQU1tQyxHQUFOLElBQWF3RixJQUFJaEksR0FBSixLQUFZSyxDQUE1QixFQUE4QjtBQUFFO0FBQVEsSUFMcEIsQ0FLcUI7QUFDekNULFdBQVE0QyxHQUFSLEVBQWEsVUFBU2lILEtBQVQsRUFBZTtBQUMzQixRQUFHLEVBQUVBLFFBQVFBLE1BQU05RyxFQUFoQixDQUFILEVBQXVCO0FBQUU7QUFBUTtBQUNqQzZDLFlBQVFpRSxNQUFNRSxJQUFkLEVBQW9CM0IsSUFBSTNPLEVBQXhCO0FBQ0EsSUFIRDtBQUlBdUcsV0FBUW9JLElBQUl6RyxJQUFaLEVBQWtCLFVBQVNuSSxHQUFULEVBQWNyRixHQUFkLEVBQWtCO0FBQ25DLFFBQUlrVSxPQUFRN08sSUFBSXVHLENBQWhCO0FBQ0FzSSxTQUFLakksR0FBTCxHQUFXSyxDQUFYO0FBQ0EsUUFBRzRILEtBQUtsRixHQUFSLEVBQVk7QUFDWGtGLFVBQUtsRixHQUFMLEdBQVcsQ0FBQyxDQUFaO0FBQ0E7QUFDRGtGLFNBQUtuUSxFQUFMLENBQVEsSUFBUixFQUFjO0FBQ2JxUSxVQUFLcFUsR0FEUTtBQUVicUYsVUFBS0EsR0FGUTtBQUdiNEcsVUFBS0s7QUFIUSxLQUFkO0FBS0EsSUFYRDtBQVlBO0FBQ0QsV0FBU3dDLEdBQVQsQ0FBYW1GLEdBQWIsRUFBa0IzRSxJQUFsQixFQUF1QjtBQUN0QixPQUFJYixNQUFPd0YsSUFBSXhMLElBQUosQ0FBUzJMLEdBQVQsQ0FBYTlFLElBQWIsRUFBbUIxRCxDQUE5QjtBQUNBLE9BQUdxSSxJQUFJakYsR0FBUCxFQUFXO0FBQ1ZQLFFBQUlPLEdBQUosR0FBVVAsSUFBSU8sR0FBSixJQUFXLENBQUMsQ0FBdEI7QUFDQVAsUUFBSTFLLEVBQUosQ0FBTyxLQUFQLEVBQWM7QUFDYnFRLFVBQUszRixNQUFNLEVBQUMsS0FBS2EsSUFBTixFQUFZakssS0FBS29KLElBQUlwSixHQUFyQixFQURFO0FBRWIsVUFBSzRPLElBQUl4TCxJQUFKLENBQVNtRCxDQUFULENBQVdrRCxHQUFYLENBQWVNLElBQUlhLEdBQUosQ0FBUXdGLEtBQXZCLEVBQThCaEgsR0FBOUI7QUFGUSxLQUFkO0FBSUE7QUFDQTtBQUNENUMsV0FBUW9JLElBQUl6RyxJQUFaLEVBQWtCLFVBQVNuSSxHQUFULEVBQWNyRixHQUFkLEVBQWtCO0FBQ2xDcUYsUUFBSXVHLENBQUwsQ0FBUTdILEVBQVIsQ0FBVyxLQUFYLEVBQWtCO0FBQ2pCcVEsVUFBSy9PLE1BQU0sRUFBQyxLQUFLaUssSUFBTixFQUFZLEtBQUt0UCxHQUFqQixFQUFzQnFGLEtBQUtBLEdBQTNCLEVBRE07QUFFakIsVUFBSzRPLElBQUl4TCxJQUFKLENBQVNtRCxDQUFULENBQVdrRCxHQUFYLENBQWVNLElBQUlhLEdBQUosQ0FBUXdGLEtBQXZCLEVBQThCcFEsR0FBOUI7QUFGWSxLQUFsQjtBQUlBLElBTEQ7QUFNQTtBQUNELE1BQUl3SCxRQUFRLEVBQVo7QUFBQSxNQUFnQlAsQ0FBaEI7QUFDQSxNQUFJdkIsTUFBTXFFLElBQUlyRSxHQUFkO0FBQUEsTUFBbUIwQixVQUFVMUIsSUFBSUMsR0FBakM7QUFBQSxNQUFzQ29HLFVBQVVyRyxJQUFJa0IsR0FBcEQ7QUFBQSxNQUF5RHdGLFVBQVUxRyxJQUFJcUIsR0FBdkU7QUFBQSxNQUE0RStILFNBQVNwSixJQUFJMkIsRUFBekY7QUFBQSxNQUE2RmIsVUFBVWQsSUFBSXZGLEdBQTNHO0FBQ0EsTUFBSXFQLFFBQVF6RixJQUFJeEQsQ0FBSixDQUFNMEQsSUFBbEI7QUFBQSxNQUF3QndGLFNBQVMxRixJQUFJeEQsQ0FBSixDQUFNbUksS0FBdkM7QUFBQSxNQUE4Q2dDLFFBQVEzRyxJQUFJb0MsSUFBSixDQUFTNUYsQ0FBL0Q7QUFDQSxFQTVSQSxFQTRSRWpELE9BNVJGLEVBNFJXLFNBNVJYOztBQThSRCxFQUFDQSxRQUFRLFVBQVNuSCxNQUFULEVBQWdCO0FBQ3hCLE1BQUk0TixNQUFNekcsUUFBUSxRQUFSLENBQVY7QUFDQXlHLE1BQUloQixLQUFKLENBQVVnRyxHQUFWLEdBQWdCLFVBQVNwVSxHQUFULEVBQWN1TyxFQUFkLEVBQWtCbEMsRUFBbEIsRUFBcUI7QUFDcEMsT0FBRyxPQUFPck0sR0FBUCxLQUFlLFFBQWxCLEVBQTJCO0FBQzFCLFFBQUlxRixHQUFKO0FBQUEsUUFBU3VJLE9BQU8sSUFBaEI7QUFBQSxRQUFzQnFHLE1BQU1yRyxLQUFLaEMsQ0FBakM7QUFDQSxRQUFJNEIsT0FBT3lHLElBQUl6RyxJQUFKLElBQVlYLEtBQXZCO0FBQUEsUUFBOEI0QixHQUE5QjtBQUNBLFFBQUcsRUFBRXBKLE1BQU1tSSxLQUFLeE4sR0FBTCxDQUFSLENBQUgsRUFBc0I7QUFDckJxRixXQUFNNk4sTUFBTWxULEdBQU4sRUFBVzROLElBQVgsQ0FBTjtBQUNBO0FBQ0QsSUFORCxNQU9BLElBQUc1TixlQUFlcUksUUFBbEIsRUFBMkI7QUFDMUIsUUFBSWhELE1BQU0sSUFBVjtBQUFBLFFBQWdCdUosS0FBS3ZKLElBQUl1RyxDQUF6QjtBQUNBUyxTQUFLa0MsTUFBTSxFQUFYO0FBQ0FsQyxPQUFHNkosR0FBSCxHQUFTbFcsR0FBVDtBQUNBcU0sT0FBRzhKLEdBQUgsR0FBUzlKLEdBQUc4SixHQUFILElBQVUsRUFBQ0MsS0FBSyxDQUFOLEVBQW5CO0FBQ0EvSixPQUFHOEosR0FBSCxDQUFPL0IsR0FBUCxHQUFhL0gsR0FBRzhKLEdBQUgsQ0FBTy9CLEdBQVAsSUFBYyxFQUEzQjtBQUNBLFdBQU94RixHQUFHd0YsR0FBVixLQUFtQnhGLEdBQUduRyxJQUFILENBQVFtRCxDQUFULENBQVlpRSxHQUFaLEdBQWtCLElBQXBDLEVBTjBCLENBTWlCO0FBQzNDakIsT0FBRzdLLEVBQUgsQ0FBTSxJQUFOLEVBQVltUyxHQUFaLEVBQWlCN0osRUFBakI7QUFDQXVDLE9BQUc3SyxFQUFILENBQU0sS0FBTixFQUFhc0ksR0FBRzhKLEdBQWhCO0FBQ0N2SCxPQUFHbkcsSUFBSCxDQUFRbUQsQ0FBVCxDQUFZaUUsR0FBWixHQUFrQixLQUFsQjtBQUNBLFdBQU94SyxHQUFQO0FBQ0EsSUFYRCxNQVlBLElBQUc0TCxPQUFPalIsR0FBUCxDQUFILEVBQWU7QUFDZCxXQUFPLEtBQUtvVSxHQUFMLENBQVMsS0FBR3BVLEdBQVosRUFBaUJ1TyxFQUFqQixFQUFxQmxDLEVBQXJCLENBQVA7QUFDQSxJQUZELE1BRU87QUFDTixLQUFDQSxLQUFLLEtBQUsrQixLQUFMLEVBQU4sRUFBb0J4QyxDQUFwQixDQUFzQmxNLEdBQXRCLEdBQTRCLEVBQUNBLEtBQUswUCxJQUFJaEosR0FBSixDQUFRLHNCQUFSLEVBQWdDcEcsR0FBaEMsQ0FBTixFQUE1QixDQURNLENBQ21FO0FBQ3pFLFFBQUd1TyxFQUFILEVBQU07QUFBRUEsUUFBR3BNLElBQUgsQ0FBUWtLLEVBQVIsRUFBWUEsR0FBR1QsQ0FBSCxDQUFLbE0sR0FBakI7QUFBdUI7QUFDL0IsV0FBTzJNLEVBQVA7QUFDQTtBQUNELE9BQUdvQyxNQUFNd0YsSUFBSTlGLElBQWIsRUFBa0I7QUFBRTtBQUNuQjlJLFFBQUl1RyxDQUFKLENBQU11QyxJQUFOLEdBQWE5SSxJQUFJdUcsQ0FBSixDQUFNdUMsSUFBTixJQUFjTSxHQUEzQjtBQUNBO0FBQ0QsT0FBR0YsTUFBTUEsY0FBY2xHLFFBQXZCLEVBQWdDO0FBQy9CaEQsUUFBSStPLEdBQUosQ0FBUTdGLEVBQVIsRUFBWWxDLEVBQVo7QUFDQTtBQUNELFVBQU9oSCxHQUFQO0FBQ0EsR0FsQ0Q7QUFtQ0EsV0FBUzZOLEtBQVQsQ0FBZWxULEdBQWYsRUFBb0I0TixJQUFwQixFQUF5QjtBQUN4QixPQUFJcUcsTUFBTXJHLEtBQUtoQyxDQUFmO0FBQUEsT0FBa0I0QixPQUFPeUcsSUFBSXpHLElBQTdCO0FBQUEsT0FBbUNuSSxNQUFNdUksS0FBS1EsS0FBTCxFQUF6QztBQUFBLE9BQXVEUSxLQUFLdkosSUFBSXVHLENBQWhFO0FBQ0EsT0FBRyxDQUFDNEIsSUFBSixFQUFTO0FBQUVBLFdBQU95RyxJQUFJekcsSUFBSixHQUFXLEVBQWxCO0FBQXNCO0FBQ2pDQSxRQUFLb0IsR0FBR3dGLEdBQUgsR0FBU3BVLEdBQWQsSUFBcUJxRixHQUFyQjtBQUNBLE9BQUc0TyxJQUFJeEwsSUFBSixLQUFhbUYsSUFBaEIsRUFBcUI7QUFBRWdCLE9BQUdVLElBQUgsR0FBVXRQLEdBQVY7QUFBZSxJQUF0QyxNQUNLLElBQUdpVSxJQUFJM0UsSUFBSixJQUFZMkUsSUFBSUYsS0FBbkIsRUFBeUI7QUFBRW5GLE9BQUdtRixLQUFILEdBQVcvVCxHQUFYO0FBQWdCO0FBQ2hELFVBQU9xRixHQUFQO0FBQ0E7QUFDRCxXQUFTNlEsR0FBVCxDQUFhdEgsRUFBYixFQUFnQjtBQUNmLE9BQUlQLEtBQUssSUFBVDtBQUFBLE9BQWVoQyxLQUFLZ0MsR0FBR2hDLEVBQXZCO0FBQUEsT0FBMkJoSCxNQUFNdUosR0FBR3ZKLEdBQXBDO0FBQUEsT0FBeUM0TyxNQUFNNU8sSUFBSXVHLENBQW5EO0FBQUEsT0FBc0Q1RSxPQUFPNEgsR0FBRzNDLEdBQWhFO0FBQUEsT0FBcUV3QyxHQUFyRTtBQUNBLE9BQUduQyxNQUFNdEYsSUFBVCxFQUFjO0FBQ2JBLFdBQU9pTixJQUFJaEksR0FBWDtBQUNBO0FBQ0QsT0FBRyxDQUFDd0MsTUFBTXpILElBQVAsS0FBZ0J5SCxJQUFJeUMsSUFBSXRGLENBQVIsQ0FBaEIsS0FBK0I2QyxNQUFNeUMsSUFBSTNILEVBQUosQ0FBT2tGLEdBQVAsQ0FBckMsQ0FBSCxFQUFxRDtBQUNwREEsVUFBT3dGLElBQUl4TCxJQUFKLENBQVMyTCxHQUFULENBQWEzRixHQUFiLEVBQWtCN0MsQ0FBekI7QUFDQSxRQUFHVSxNQUFNbUMsSUFBSXhDLEdBQWIsRUFBaUI7QUFDaEIyQyxVQUFLdUYsT0FBT3ZGLEVBQVAsRUFBVyxFQUFDM0MsS0FBS3dDLElBQUl4QyxHQUFWLEVBQVgsQ0FBTDtBQUNBO0FBQ0Q7QUFDREksTUFBRzZKLEdBQUgsQ0FBT3RILEVBQVAsRUFBV0EsR0FBR08sS0FBSCxJQUFZZCxFQUF2QjtBQUNBQSxNQUFHM0IsRUFBSCxDQUFNYyxJQUFOLENBQVdvQixFQUFYO0FBQ0E7QUFDRCxNQUFJN0QsTUFBTXFFLElBQUlyRSxHQUFkO0FBQUEsTUFBbUIwQixVQUFVMUIsSUFBSUMsR0FBakM7QUFBQSxNQUFzQ21KLFNBQVMvRSxJQUFJckUsR0FBSixDQUFRMkIsRUFBdkQ7QUFDQSxNQUFJdUUsU0FBUzdCLElBQUl6RixHQUFKLENBQVFKLEVBQXJCO0FBQ0EsTUFBSTJILE1BQU05QixJQUFJaUQsR0FBSixDQUFRbkIsR0FBbEI7QUFBQSxNQUF1QjZFLFFBQVEzRyxJQUFJb0MsSUFBSixDQUFTNUYsQ0FBeEM7QUFDQSxNQUFJaUIsUUFBUSxFQUFaO0FBQUEsTUFBZ0JQLENBQWhCO0FBQ0EsRUEvREEsRUErREUzRCxPQS9ERixFQStEVyxPQS9EWDs7QUFpRUQsRUFBQ0EsUUFBUSxVQUFTbkgsTUFBVCxFQUFnQjtBQUN4QixNQUFJNE4sTUFBTXpHLFFBQVEsUUFBUixDQUFWO0FBQ0F5RyxNQUFJaEIsS0FBSixDQUFVbkMsR0FBVixHQUFnQixVQUFTakYsSUFBVCxFQUFldUgsRUFBZixFQUFtQmxDLEVBQW5CLEVBQXNCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBLE9BQUloSCxNQUFNLElBQVY7QUFBQSxPQUFnQnVKLEtBQU12SixJQUFJdUcsQ0FBMUI7QUFBQSxPQUE4Qm5ELE9BQU9tRyxHQUFHbkcsSUFBeEM7QUFBQSxPQUE4Q2dHLEdBQTlDO0FBQ0FwQyxRQUFLQSxNQUFNLEVBQVg7QUFDQUEsTUFBR3JGLElBQUgsR0FBVUEsSUFBVjtBQUNBcUYsTUFBR2hILEdBQUgsR0FBU2dILEdBQUdoSCxHQUFILElBQVVBLEdBQW5CO0FBQ0EsT0FBRyxPQUFPa0osRUFBUCxLQUFjLFFBQWpCLEVBQTBCO0FBQ3pCbEMsT0FBR2lELElBQUgsR0FBVWYsRUFBVjtBQUNBLElBRkQsTUFFTztBQUNObEMsT0FBRzJDLEdBQUgsR0FBU1QsRUFBVDtBQUNBO0FBQ0QsT0FBR0ssR0FBR1UsSUFBTixFQUFXO0FBQ1ZqRCxPQUFHaUQsSUFBSCxHQUFVVixHQUFHVSxJQUFiO0FBQ0E7QUFDRCxPQUFHakQsR0FBR2lELElBQUgsSUFBVzdHLFNBQVNwRCxHQUF2QixFQUEyQjtBQUMxQixRQUFHLENBQUNrSCxPQUFPRixHQUFHckYsSUFBVixDQUFKLEVBQW9CO0FBQ25CLE1BQUNxRixHQUFHMkMsR0FBSCxJQUFRbEwsSUFBVCxFQUFlM0IsSUFBZixDQUFvQmtLLEVBQXBCLEVBQXdCQSxHQUFHOEosR0FBSCxHQUFTLEVBQUN6VyxLQUFLMFAsSUFBSWhKLEdBQUosQ0FBUSw2RUFBUixVQUErRmlHLEdBQUdyRixJQUFsRyxHQUF5RyxTQUFTcUYsR0FBR3JGLElBQVosR0FBbUIsSUFBNUgsQ0FBTixFQUFqQztBQUNBLFNBQUdxRixHQUFHbUMsR0FBTixFQUFVO0FBQUVuQyxTQUFHbUMsR0FBSDtBQUFVO0FBQ3RCLFlBQU9uSixHQUFQO0FBQ0E7QUFDRGdILE9BQUdoSCxHQUFILEdBQVNBLE1BQU1vRCxLQUFLMkwsR0FBTCxDQUFTL0gsR0FBR2lELElBQUgsR0FBVWpELEdBQUdpRCxJQUFILEtBQVlqRCxHQUFHd0osR0FBSCxHQUFTekcsSUFBSW9DLElBQUosQ0FBU2xDLElBQVQsQ0FBY2pELEdBQUdyRixJQUFqQixLQUEwQixDQUFFeUIsS0FBS21ELENBQU4sQ0FBU29DLEdBQVQsQ0FBYUUsSUFBYixJQUFxQmtCLElBQUlwRixJQUFKLENBQVNLLE1BQS9CLEdBQS9DLENBQW5CLENBQWY7QUFDQWdDLE9BQUd1SSxHQUFILEdBQVN2SSxHQUFHaEgsR0FBWjtBQUNBNkUsUUFBSW1DLEVBQUo7QUFDQSxXQUFPaEgsR0FBUDtBQUNBO0FBQ0QsT0FBRytKLElBQUk3RixFQUFKLENBQU92QyxJQUFQLENBQUgsRUFBZ0I7QUFDZkEsU0FBS29OLEdBQUwsQ0FBUyxVQUFTeEYsRUFBVCxFQUFZUCxFQUFaLEVBQWU7QUFBQ0EsUUFBR25LLEdBQUg7QUFDeEIsU0FBSXNHLElBQUk0RSxJQUFJb0MsSUFBSixDQUFTbEMsSUFBVCxDQUFjVixHQUFHM0MsR0FBakIsQ0FBUjtBQUNBLFNBQUcsQ0FBQ3pCLENBQUosRUFBTTtBQUFDNEUsVUFBSWhKLEdBQUosQ0FBUSxtQ0FBUixVQUFvRHdJLEdBQUczQyxHQUF2RCxHQUE0RCxNQUFLSSxHQUFHSixHQUFSLEdBQWEseUJBQXpFLEVBQW9HO0FBQU87QUFDbEg1RyxTQUFJNEcsR0FBSixDQUFRbUQsSUFBSWlELEdBQUosQ0FBUW5CLEdBQVIsQ0FBWWhILEdBQVosQ0FBZ0JNLENBQWhCLENBQVIsRUFBNEIrRCxFQUE1QixFQUFnQ2xDLEVBQWhDO0FBQ0EsS0FKRDtBQUtBLFdBQU9oSCxHQUFQO0FBQ0E7QUFDRGdILE1BQUd1SSxHQUFILEdBQVN2SSxHQUFHdUksR0FBSCxJQUFXbk0sVUFBVWdHLE1BQU1HLEdBQUdoQixJQUFuQixDQUFYLEdBQXNDdkksR0FBdEMsR0FBNENvSixHQUFyRDtBQUNBLE9BQUdwQyxHQUFHdUksR0FBSCxDQUFPaEosQ0FBUCxDQUFTMEQsSUFBVCxJQUFpQkYsSUFBSWlELEdBQUosQ0FBUTlJLEVBQVIsQ0FBVzhDLEdBQUdyRixJQUFkLENBQWpCLElBQXdDNEgsR0FBR3dGLEdBQTlDLEVBQWtEO0FBQ2pEL0gsT0FBR3JGLElBQUgsR0FBVW9LLFFBQVEsRUFBUixFQUFZeEMsR0FBR3dGLEdBQWYsRUFBb0IvSCxHQUFHckYsSUFBdkIsQ0FBVjtBQUNBcUYsT0FBR3VJLEdBQUgsQ0FBTzNJLEdBQVAsQ0FBV0ksR0FBR3JGLElBQWQsRUFBb0JxRixHQUFHaUQsSUFBdkIsRUFBNkJqRCxFQUE3QjtBQUNBLFdBQU9oSCxHQUFQO0FBQ0E7QUFDRGdILE1BQUd1SSxHQUFILENBQU9SLEdBQVAsQ0FBVyxHQUFYLEVBQWdCQSxHQUFoQixDQUFvQmlDLEdBQXBCLEVBQXlCLEVBQUNoSyxJQUFJQSxFQUFMLEVBQXpCO0FBQ0EsT0FBRyxDQUFDQSxHQUFHOEosR0FBUCxFQUFXO0FBQ1Y7QUFDQTlKLE9BQUdtQyxHQUFILEdBQVNuQyxHQUFHbUMsR0FBSCxJQUFVWSxJQUFJckwsRUFBSixDQUFPb0ssSUFBUCxDQUFZOUIsR0FBR3VJLEdBQWYsQ0FBbkI7QUFDQXZJLE9BQUdoSCxHQUFILENBQU91RyxDQUFQLENBQVN1QyxJQUFULEdBQWdCOUIsR0FBR3VJLEdBQUgsQ0FBT2hKLENBQVAsQ0FBU3VDLElBQXpCO0FBQ0E7QUFDRCxVQUFPOUksR0FBUDtBQUNBLEdBaEREOztBQWtEQSxXQUFTNkUsR0FBVCxDQUFhbUMsRUFBYixFQUFnQjtBQUNmQSxNQUFHaUssS0FBSCxHQUFXQSxLQUFYO0FBQ0EsT0FBSXRJLE1BQU0zQixHQUFHMkIsR0FBSCxJQUFRLEVBQWxCO0FBQUEsT0FBc0J0SyxNQUFNMkksR0FBRzNJLEdBQUgsR0FBUzBMLElBQUlHLEtBQUosQ0FBVS9KLEdBQVYsQ0FBY0EsR0FBZCxFQUFtQndJLElBQUl1QixLQUF2QixDQUFyQztBQUNBN0wsT0FBSTRMLElBQUosR0FBV2pELEdBQUdpRCxJQUFkO0FBQ0FqRCxNQUFHcUcsS0FBSCxHQUFXdEQsSUFBSXNELEtBQUosQ0FBVXhJLEdBQVYsQ0FBY21DLEdBQUdyRixJQUFqQixFQUF1QnRELEdBQXZCLEVBQTRCMkksRUFBNUIsQ0FBWDtBQUNBLE9BQUczSSxJQUFJaEUsR0FBUCxFQUFXO0FBQ1YsS0FBQzJNLEdBQUcyQyxHQUFILElBQVFsTCxJQUFULEVBQWUzQixJQUFmLENBQW9Ca0ssRUFBcEIsRUFBd0JBLEdBQUc4SixHQUFILEdBQVMsRUFBQ3pXLEtBQUswUCxJQUFJaEosR0FBSixDQUFRMUMsSUFBSWhFLEdBQVosQ0FBTixFQUFqQztBQUNBLFFBQUcyTSxHQUFHbUMsR0FBTixFQUFVO0FBQUVuQyxRQUFHbUMsR0FBSDtBQUFVO0FBQ3RCO0FBQ0E7QUFDRG5DLE1BQUdpSyxLQUFIO0FBQ0E7O0FBRUQsV0FBU0EsS0FBVCxHQUFnQjtBQUFFLE9BQUlqSyxLQUFLLElBQVQ7QUFDakIsT0FBRyxDQUFDQSxHQUFHcUcsS0FBSixJQUFhN0csUUFBUVEsR0FBRzhCLElBQVgsRUFBaUJvSSxFQUFqQixDQUFoQixFQUFxQztBQUFFO0FBQVE7QUFDL0MsSUFBQ2xLLEdBQUdtQyxHQUFILElBQVFnSSxJQUFULEVBQWUsWUFBVTtBQUN2Qm5LLE9BQUd1SSxHQUFILENBQU9oSixDQUFSLENBQVc3SCxFQUFYLENBQWMsS0FBZCxFQUFxQjtBQUNwQnFTLFVBQUssQ0FEZTtBQUVwQi9RLFVBQUtnSCxHQUFHdUksR0FGWSxFQUVQM0ksS0FBS0ksR0FBRzhKLEdBQUgsR0FBUzlKLEdBQUczSSxHQUFILENBQU9nUCxLQUZkLEVBRXFCMUUsS0FBSzNCLEdBQUcyQixHQUY3QjtBQUdwQixVQUFLM0IsR0FBR2hILEdBQUgsQ0FBT3VJLElBQVAsQ0FBWSxDQUFDLENBQWIsRUFBZ0JoQyxDQUFoQixDQUFrQmtELEdBQWxCLENBQXNCLFVBQVNFLEdBQVQsRUFBYTtBQUFFLFdBQUs5SyxHQUFMLEdBQUYsQ0FBYztBQUNyRCxVQUFHLENBQUNtSSxHQUFHMkMsR0FBUCxFQUFXO0FBQUU7QUFBUTtBQUNyQjNDLFNBQUcyQyxHQUFILENBQU9BLEdBQVAsRUFBWSxJQUFaO0FBQ0EsTUFISSxFQUdGM0MsR0FBRzJCLEdBSEQ7QUFIZSxLQUFyQjtBQVFBLElBVEQsRUFTRzNCLEVBVEg7QUFVQSxPQUFHQSxHQUFHbUMsR0FBTixFQUFVO0FBQUVuQyxPQUFHbUMsR0FBSDtBQUFVO0FBQ3RCLEdBQUMsU0FBUytILEVBQVQsQ0FBWXJLLENBQVosRUFBY1osQ0FBZCxFQUFnQjtBQUFFLE9BQUdZLENBQUgsRUFBSztBQUFFLFdBQU8sSUFBUDtBQUFhO0FBQUU7O0FBRTFDLFdBQVMxRyxHQUFULENBQWEwRyxDQUFiLEVBQWVaLENBQWYsRUFBaUIxQixDQUFqQixFQUFvQmdGLEVBQXBCLEVBQXVCO0FBQUUsT0FBSXZDLEtBQUssSUFBVDtBQUN4QixPQUFHZixLQUFLLENBQUNzRCxHQUFHN0YsSUFBSCxDQUFRdEksTUFBakIsRUFBd0I7QUFBRTtBQUFRO0FBQ2xDLElBQUM0TCxHQUFHbUMsR0FBSCxJQUFRZ0ksSUFBVCxFQUFlLFlBQVU7QUFDeEIsUUFBSXpOLE9BQU82RixHQUFHN0YsSUFBZDtBQUFBLFFBQW9CNkwsTUFBTXZJLEdBQUd1SSxHQUE3QjtBQUFBLFFBQWtDNUcsTUFBTTNCLEdBQUcyQixHQUEzQztBQUNBLFFBQUl4TixJQUFJLENBQVI7QUFBQSxRQUFXOEosSUFBSXZCLEtBQUt0SSxNQUFwQjtBQUNBLFNBQUlELENBQUosRUFBT0EsSUFBSThKLENBQVgsRUFBYzlKLEdBQWQsRUFBa0I7QUFDakJvVSxXQUFNQSxJQUFJUixHQUFKLENBQVFyTCxLQUFLdkksQ0FBTCxDQUFSLENBQU47QUFDQTtBQUNELFFBQUc2TCxHQUFHd0osR0FBSCxJQUFVekcsSUFBSW9DLElBQUosQ0FBU2xDLElBQVQsQ0FBY1YsR0FBRzdELEdBQWpCLENBQWIsRUFBbUM7QUFDbEMsU0FBSXpGLEtBQUs4SixJQUFJb0MsSUFBSixDQUFTbEMsSUFBVCxDQUFjVixHQUFHN0QsR0FBakIsS0FBeUIsQ0FBQyxDQUFDc0IsR0FBRzJCLEdBQUgsSUFBUSxFQUFULEVBQWFFLElBQWIsSUFBcUI3QixHQUFHaEgsR0FBSCxDQUFPdUksSUFBUCxDQUFZLFVBQVosQ0FBckIsSUFBZ0R3QixJQUFJcEYsSUFBSixDQUFTSyxNQUExRCxHQUFsQztBQUNBdUssU0FBSWhILElBQUosQ0FBUyxDQUFDLENBQVYsRUFBYXdHLEdBQWIsQ0FBaUI5TyxFQUFqQjtBQUNBc0osUUFBR1UsSUFBSCxDQUFRaEssRUFBUjtBQUNBO0FBQ0E7QUFDRCxLQUFDK0csR0FBRzhCLElBQUgsR0FBVTlCLEdBQUc4QixJQUFILElBQVcsRUFBdEIsRUFBMEJwRixJQUExQixJQUFrQyxJQUFsQztBQUNBNkwsUUFBSVIsR0FBSixDQUFRLEdBQVIsRUFBYUEsR0FBYixDQUFpQjlFLElBQWpCLEVBQXVCLEVBQUNqRCxJQUFJLEVBQUN1QyxJQUFJQSxFQUFMLEVBQVN2QyxJQUFJQSxFQUFiLEVBQUwsRUFBdkI7QUFDQSxJQWRELEVBY0csRUFBQ0EsSUFBSUEsRUFBTCxFQUFTdUMsSUFBSUEsRUFBYixFQWRIO0FBZUE7O0FBRUQsV0FBU1UsSUFBVCxDQUFjVixFQUFkLEVBQWtCUCxFQUFsQixFQUFxQjtBQUFFLE9BQUloQyxLQUFLLEtBQUtBLEVBQWQ7QUFBQSxPQUFrQjRILE1BQU01SCxHQUFHdUMsRUFBM0IsQ0FBK0J2QyxLQUFLQSxHQUFHQSxFQUFSO0FBQ3JEO0FBQ0EsT0FBRyxDQUFDdUMsR0FBR3ZKLEdBQUosSUFBVyxDQUFDdUosR0FBR3ZKLEdBQUgsQ0FBT3VHLENBQVAsQ0FBU2dDLElBQXhCLEVBQTZCO0FBQUU7QUFBUSxJQUZuQixDQUVvQjtBQUN4Q1MsTUFBR25LLEdBQUg7QUFDQTBLLFFBQU1BLEdBQUd2SixHQUFILENBQU91RyxDQUFQLENBQVNnQyxJQUFULENBQWNoQyxDQUFwQjtBQUNBLE9BQUl0RyxLQUFLOEosSUFBSW9DLElBQUosQ0FBU2xDLElBQVQsQ0FBYzJFLElBQUlsSixHQUFsQixLQUEwQnFFLElBQUlvQyxJQUFKLENBQVNsQyxJQUFULENBQWNWLEdBQUczQyxHQUFqQixDQUExQixJQUFtRG1ELElBQUlpRCxHQUFKLENBQVFuQixHQUFSLENBQVkzSCxFQUFaLENBQWVxRixHQUFHM0MsR0FBbEIsQ0FBbkQsSUFBNkUsQ0FBQyxDQUFDSSxHQUFHMkIsR0FBSCxJQUFRLEVBQVQsRUFBYUUsSUFBYixJQUFxQjdCLEdBQUdoSCxHQUFILENBQU91SSxJQUFQLENBQVksVUFBWixDQUFyQixJQUFnRHdCLElBQUlwRixJQUFKLENBQVNLLE1BQTFELEdBQXRGLENBTG9CLENBS3VJO0FBQzNKdUUsTUFBR3ZKLEdBQUgsQ0FBT3VJLElBQVAsQ0FBWSxDQUFDLENBQWIsRUFBZ0J3RyxHQUFoQixDQUFvQjlPLEVBQXBCO0FBQ0EyTyxPQUFJM0UsSUFBSixDQUFTaEssRUFBVDtBQUNBK0csTUFBRzhCLElBQUgsQ0FBUThGLElBQUlsTCxJQUFaLElBQW9CLEtBQXBCO0FBQ0FzRCxNQUFHaUssS0FBSDtBQUNBOztBQUVELFdBQVNELEdBQVQsQ0FBYXpILEVBQWIsRUFBaUJQLEVBQWpCLEVBQW9CO0FBQ25CLE9BQUloQyxLQUFLLEtBQUtBLEVBQWQ7QUFDQSxPQUFHLENBQUN1QyxHQUFHdkosR0FBSixJQUFXLENBQUN1SixHQUFHdkosR0FBSCxDQUFPdUcsQ0FBdEIsRUFBd0I7QUFBRTtBQUFRLElBRmYsQ0FFZ0I7QUFDbkMsT0FBR2dELEdBQUdsUCxHQUFOLEVBQVU7QUFBRTtBQUNYeUcsWUFBUUMsR0FBUixDQUFZLDZDQUFaO0FBQ0E7QUFDQTtBQUNELE9BQUk2TixNQUFPckYsR0FBR3ZKLEdBQUgsQ0FBT3VHLENBQVAsQ0FBU2dDLElBQVQsQ0FBY2hDLENBQXpCO0FBQUEsT0FBNkI1RSxPQUFPaU4sSUFBSWhJLEdBQXhDO0FBQUEsT0FBNkMrQixNQUFNM0IsR0FBRzJCLEdBQUgsSUFBUSxFQUEzRDtBQUFBLE9BQStEdkYsSUFBL0Q7QUFBQSxPQUFxRWdHLEdBQXJFO0FBQ0FKLE1BQUduSyxHQUFIO0FBQ0EsT0FBR21JLEdBQUd1SSxHQUFILEtBQVd2SSxHQUFHaEgsR0FBakIsRUFBcUI7QUFDcEJvSixVQUFPcEMsR0FBR2hILEdBQUgsQ0FBT3VHLENBQVIsQ0FBV3dJLEdBQVgsSUFBa0JILElBQUlHLEdBQTVCO0FBQ0EsUUFBRyxDQUFDM0YsR0FBSixFQUFRO0FBQUU7QUFDVHRJLGFBQVFDLEdBQVIsQ0FBWSw0Q0FBWixFQURPLENBQ29EO0FBQzNEO0FBQ0E7QUFDRGlHLE9BQUdyRixJQUFILEdBQVVvSyxRQUFRLEVBQVIsRUFBWTNDLEdBQVosRUFBaUJwQyxHQUFHckYsSUFBcEIsQ0FBVjtBQUNBeUgsVUFBTSxJQUFOO0FBQ0E7QUFDRCxPQUFHbkMsTUFBTXRGLElBQVQsRUFBYztBQUNiLFFBQUcsQ0FBQ2lOLElBQUlHLEdBQVIsRUFBWTtBQUFFO0FBQVEsS0FEVCxDQUNVO0FBQ3ZCLFFBQUcsQ0FBQ0gsSUFBSTNFLElBQVIsRUFBYTtBQUNaYixXQUFNd0YsSUFBSTVPLEdBQUosQ0FBUXVJLElBQVIsQ0FBYSxVQUFTZ0IsRUFBVCxFQUFZO0FBQzlCLFVBQUdBLEdBQUdVLElBQU4sRUFBVztBQUFFLGNBQU9WLEdBQUdVLElBQVY7QUFBZ0I7QUFDN0JqRCxTQUFHckYsSUFBSCxHQUFVb0ssUUFBUSxFQUFSLEVBQVl4QyxHQUFHd0YsR0FBZixFQUFvQi9ILEdBQUdyRixJQUF2QixDQUFWO0FBQ0EsTUFISyxDQUFOO0FBSUE7QUFDRHlILFVBQU1BLE9BQU93RixJQUFJRyxHQUFqQjtBQUNBSCxVQUFPQSxJQUFJeEwsSUFBSixDQUFTMkwsR0FBVCxDQUFhM0YsR0FBYixFQUFrQjdDLENBQXpCO0FBQ0FTLE9BQUd3SixHQUFILEdBQVN4SixHQUFHaUQsSUFBSCxHQUFVYixHQUFuQjtBQUNBekgsV0FBT3FGLEdBQUdyRixJQUFWO0FBQ0E7QUFDRCxPQUFHLENBQUNxRixHQUFHd0osR0FBSixJQUFXLEVBQUV4SixHQUFHaUQsSUFBSCxHQUFVRixJQUFJb0MsSUFBSixDQUFTbEMsSUFBVCxDQUFjdEksSUFBZCxDQUFaLENBQWQsRUFBK0M7QUFDOUMsUUFBR3FGLEdBQUd0RCxJQUFILElBQVd3RCxPQUFPRixHQUFHckYsSUFBVixDQUFkLEVBQThCO0FBQUU7QUFDL0JxRixRQUFHaUQsSUFBSCxHQUFVLENBQUN0QixJQUFJRSxJQUFKLElBQVkrRixJQUFJeEwsSUFBSixDQUFTbUQsQ0FBVCxDQUFXb0MsR0FBWCxDQUFlRSxJQUEzQixJQUFtQ2tCLElBQUlwRixJQUFKLENBQVNLLE1BQTdDLEdBQVY7QUFDQSxLQUZELE1BRU87QUFDTjtBQUNBZ0MsUUFBR2lELElBQUgsR0FBVVYsR0FBR1UsSUFBSCxJQUFXMkUsSUFBSTNFLElBQWYsSUFBdUIsQ0FBQ3RCLElBQUlFLElBQUosSUFBWStGLElBQUl4TCxJQUFKLENBQVNtRCxDQUFULENBQVdvQyxHQUFYLENBQWVFLElBQTNCLElBQW1Da0IsSUFBSXBGLElBQUosQ0FBU0ssTUFBN0MsR0FBakM7QUFDQTtBQUNEO0FBQ0RnQyxNQUFHdUksR0FBSCxDQUFPM0ksR0FBUCxDQUFXSSxHQUFHckYsSUFBZCxFQUFvQnFGLEdBQUdpRCxJQUF2QixFQUE2QmpELEVBQTdCO0FBQ0E7QUFDRCxNQUFJdEIsTUFBTXFFLElBQUlyRSxHQUFkO0FBQUEsTUFBbUJ3QixTQUFTeEIsSUFBSXhCLEVBQWhDO0FBQUEsTUFBb0M2SCxVQUFVckcsSUFBSWtCLEdBQWxEO0FBQUEsTUFBdURKLFVBQVVkLElBQUl2RixHQUFyRTtBQUNBLE1BQUk4RyxDQUFKO0FBQUEsTUFBT08sUUFBUSxFQUFmO0FBQUEsTUFBbUIvSSxPQUFPLFNBQVBBLElBQU8sR0FBVSxDQUFFLENBQXRDO0FBQUEsTUFBd0MwUyxPQUFPLFNBQVBBLElBQU8sQ0FBU2xOLEVBQVQsRUFBWStDLEVBQVosRUFBZTtBQUFDL0MsTUFBR25ILElBQUgsQ0FBUWtLLE1BQUlRLEtBQVo7QUFBbUIsR0FBbEY7QUFDQSxFQTFKQSxFQTBKRWxFLE9BMUpGLEVBMEpXLE9BMUpYOztBQTRKRCxFQUFDQSxRQUFRLFVBQVNuSCxNQUFULEVBQWdCOztBQUV4QixNQUFJNE4sTUFBTXpHLFFBQVEsUUFBUixDQUFWO0FBQ0FuSCxTQUFPQyxPQUFQLEdBQWlCMk4sR0FBakI7O0FBRUEsR0FBRSxhQUFVO0FBQ1gsWUFBU3FILElBQVQsQ0FBY3ZLLENBQWQsRUFBZ0JaLENBQWhCLEVBQWtCO0FBQ2pCLFFBQUdtQixRQUFRMkMsSUFBSXNILEVBQUosQ0FBTzlLLENBQWYsRUFBa0JOLENBQWxCLENBQUgsRUFBd0I7QUFBRTtBQUFRO0FBQ2xDOEYsWUFBUSxLQUFLeEYsQ0FBYixFQUFnQk4sQ0FBaEIsRUFBbUJZLENBQW5CO0FBQ0E7QUFDRCxZQUFTMUcsR0FBVCxDQUFhd08sS0FBYixFQUFvQkQsS0FBcEIsRUFBMEI7QUFDekIsUUFBRzNFLElBQUl4RCxDQUFKLENBQU00RixJQUFOLEtBQWV1QyxLQUFsQixFQUF3QjtBQUFFO0FBQVE7QUFDbEMsUUFBSXZDLE9BQU8sS0FBS0EsSUFBaEI7QUFBQSxRQUFzQmlELFNBQVMsS0FBS0EsTUFBcEM7QUFBQSxRQUE0Q2tDLFFBQVEsS0FBS0EsS0FBekQ7QUFBQSxRQUFnRXRDLFVBQVUsS0FBS0EsT0FBL0U7QUFDQSxRQUFJOUssS0FBS3FOLFNBQVNwRixJQUFULEVBQWV1QyxLQUFmLENBQVQ7QUFBQSxRQUFnQzhDLEtBQUtELFNBQVNuQyxNQUFULEVBQWlCVixLQUFqQixDQUFyQztBQUNBLFFBQUd6SCxNQUFNL0MsRUFBTixJQUFZK0MsTUFBTXVLLEVBQXJCLEVBQXdCO0FBQUUsWUFBTyxJQUFQO0FBQWEsS0FKZCxDQUllO0FBQ3hDLFFBQUlDLEtBQUs5QyxLQUFUO0FBQUEsUUFBZ0IrQyxLQUFLdEMsT0FBT1YsS0FBUCxDQUFyQjs7QUFTQTs7O0FBU0EsUUFBRyxDQUFDaUQsT0FBT0YsRUFBUCxDQUFELElBQWV4SyxNQUFNd0ssRUFBeEIsRUFBMkI7QUFBRSxZQUFPLElBQVA7QUFBYSxLQXZCakIsQ0F1QmtCO0FBQzNDLFFBQUcsQ0FBQ0UsT0FBT0QsRUFBUCxDQUFELElBQWV6SyxNQUFNeUssRUFBeEIsRUFBMkI7QUFBRSxZQUFPLElBQVA7QUFBYSxLQXhCakIsQ0F3Qm1CO0FBQzVDLFFBQUk5RyxNQUFNYixJQUFJYSxHQUFKLENBQVFvRSxPQUFSLEVBQWlCOUssRUFBakIsRUFBcUJzTixFQUFyQixFQUF5QkMsRUFBekIsRUFBNkJDLEVBQTdCLENBQVY7QUFDQSxRQUFHOUcsSUFBSXZRLEdBQVAsRUFBVztBQUNWeUcsYUFBUUMsR0FBUixDQUFZLHNDQUFaLEVBQW9EMk4sS0FBcEQsRUFBMkQ5RCxJQUFJdlEsR0FBL0QsRUFEVSxDQUMyRDtBQUNyRTtBQUNBO0FBQ0QsUUFBR3VRLElBQUlWLEtBQUosSUFBYVUsSUFBSU8sVUFBakIsSUFBK0JQLElBQUlXLE9BQXRDLEVBQThDO0FBQUU7QUFDL0M7QUFDQTtBQUNBO0FBQ0QsUUFBR1gsSUFBSVMsUUFBUCxFQUFnQjtBQUNmaUcsV0FBTTVDLEtBQU4sSUFBZUMsS0FBZjtBQUNBaUQsZUFBVU4sS0FBVixFQUFpQjVDLEtBQWpCLEVBQXdCeEssRUFBeEI7QUFDQTtBQUNBO0FBQ0QsUUFBRzBHLElBQUlNLEtBQVAsRUFBYTtBQUFFO0FBQ2RvRyxXQUFNNUMsS0FBTixJQUFlQyxLQUFmLENBRFksQ0FDVTtBQUN0QmlELGVBQVVOLEtBQVYsRUFBaUI1QyxLQUFqQixFQUF3QnhLLEVBQXhCLEVBRlksQ0FFaUI7QUFDN0I7QUFDQTtBQUNBOzs7Ozs7QUFNQTtBQUNEO0FBQ0Q2RixPQUFJYSxHQUFKLENBQVEwRyxLQUFSLEdBQWdCLFVBQVNsQyxNQUFULEVBQWlCakQsSUFBakIsRUFBdUJ4RCxHQUF2QixFQUEyQjtBQUMxQyxRQUFHLENBQUN3RCxJQUFELElBQVMsQ0FBQ0EsS0FBSzVGLENBQWxCLEVBQW9CO0FBQUU7QUFBUTtBQUM5QjZJLGFBQVNBLFVBQVVyRixJQUFJb0MsSUFBSixDQUFTbEMsSUFBVCxDQUFjcEYsR0FBZCxDQUFrQixFQUFDMEIsR0FBRSxFQUFDLEtBQUksRUFBTCxFQUFILEVBQWxCLEVBQWdDd0QsSUFBSW9DLElBQUosQ0FBU2xDLElBQVQsQ0FBY2tDLElBQWQsQ0FBaEMsQ0FBbkI7QUFDQSxRQUFHLENBQUNpRCxNQUFELElBQVcsQ0FBQ0EsT0FBTzdJLENBQXRCLEVBQXdCO0FBQUU7QUFBUTtBQUNsQ29DLFVBQU1pRCxPQUFPakQsR0FBUCxJQUFhLEVBQUNxRyxTQUFTckcsR0FBVixFQUFiLEdBQThCLEVBQUNxRyxTQUFTakYsSUFBSUcsS0FBSixFQUFWLEVBQXBDO0FBQ0F2QixRQUFJMkksS0FBSixHQUFZbEMsVUFBVXJGLElBQUlyRSxHQUFKLENBQVE2QixJQUFSLENBQWE2SCxNQUFiLENBQXRCLENBTDBDLENBS0U7QUFDNUM7QUFDQXpHLFFBQUl5RyxNQUFKLEdBQWFBLE1BQWI7QUFDQXpHLFFBQUl3RCxJQUFKLEdBQVdBLElBQVg7QUFDQTtBQUNBLFFBQUczRixRQUFRMkYsSUFBUixFQUFjaE0sR0FBZCxFQUFtQndJLEdBQW5CLENBQUgsRUFBMkI7QUFBRTtBQUM1QjtBQUNBO0FBQ0QsV0FBT0EsSUFBSTJJLEtBQVg7QUFDQSxJQWREO0FBZUF2SCxPQUFJYSxHQUFKLENBQVFpSCxLQUFSLEdBQWdCLFVBQVN6QyxNQUFULEVBQWlCakQsSUFBakIsRUFBdUJ4RCxHQUF2QixFQUEyQjtBQUMxQ0EsVUFBTWlELE9BQU9qRCxHQUFQLElBQWEsRUFBQ3FHLFNBQVNyRyxHQUFWLEVBQWIsR0FBOEIsRUFBQ3FHLFNBQVNqRixJQUFJRyxLQUFKLEVBQVYsRUFBcEM7QUFDQSxRQUFHLENBQUNrRixNQUFKLEVBQVc7QUFBRSxZQUFPckYsSUFBSXJFLEdBQUosQ0FBUTZCLElBQVIsQ0FBYTRFLElBQWIsQ0FBUDtBQUEyQjtBQUN4Q3hELFFBQUlzQixJQUFKLEdBQVdGLElBQUlvQyxJQUFKLENBQVNsQyxJQUFULENBQWN0QixJQUFJeUcsTUFBSixHQUFhQSxNQUEzQixDQUFYO0FBQ0EsUUFBRyxDQUFDekcsSUFBSXNCLElBQVIsRUFBYTtBQUFFO0FBQVE7QUFDdkJ0QixRQUFJa0osS0FBSixHQUFZOUgsSUFBSW9DLElBQUosQ0FBU2xDLElBQVQsQ0FBY3BGLEdBQWQsQ0FBa0IsRUFBbEIsRUFBc0I4RCxJQUFJc0IsSUFBMUIsQ0FBWjtBQUNBekQsWUFBUW1DLElBQUl3RCxJQUFKLEdBQVdBLElBQW5CLEVBQXlCZ0QsSUFBekIsRUFBK0J4RyxHQUEvQjtBQUNBLFdBQU9BLElBQUlrSixLQUFYO0FBQ0EsSUFSRDtBQVNBLFlBQVMxQyxJQUFULENBQWNSLEtBQWQsRUFBcUJELEtBQXJCLEVBQTJCO0FBQUUsUUFBSS9GLE1BQU0sSUFBVjtBQUM1QixRQUFHb0IsSUFBSXhELENBQUosQ0FBTTRGLElBQU4sS0FBZXVDLEtBQWxCLEVBQXdCO0FBQUU7QUFBUTtBQUNsQyxRQUFHLENBQUNpRCxPQUFPaEQsS0FBUCxDQUFKLEVBQWtCO0FBQUU7QUFBUTtBQUM1QixRQUFJeEMsT0FBT3hELElBQUl3RCxJQUFmO0FBQUEsUUFBcUJpRCxTQUFTekcsSUFBSXlHLE1BQWxDO0FBQUEsUUFBMENsTCxLQUFLcU4sU0FBU3BGLElBQVQsRUFBZXVDLEtBQWYsRUFBc0IsSUFBdEIsQ0FBL0M7QUFBQSxRQUE0RThDLEtBQUtELFNBQVNuQyxNQUFULEVBQWlCVixLQUFqQixFQUF3QixJQUF4QixDQUFqRjtBQUFBLFFBQWdIbUQsUUFBUWxKLElBQUlrSixLQUE1SDtBQUNBLFFBQUlqSCxNQUFNYixJQUFJYSxHQUFKLENBQVFqQyxJQUFJcUcsT0FBWixFQUFxQjlLLEVBQXJCLEVBQXlCc04sRUFBekIsRUFBNkI3QyxLQUE3QixFQUFvQ1MsT0FBT1YsS0FBUCxDQUFwQyxDQUFWOztBQUlBOzs7QUFJQSxRQUFHOUQsSUFBSVMsUUFBUCxFQUFnQjtBQUNmd0csV0FBTW5ELEtBQU4sSUFBZUMsS0FBZjtBQUNBaUQsZUFBVUMsS0FBVixFQUFpQm5ELEtBQWpCLEVBQXdCeEssRUFBeEI7QUFDQTtBQUNEO0FBQ0Q2RixPQUFJYSxHQUFKLENBQVF3RixLQUFSLEdBQWdCLFVBQVM3RyxFQUFULEVBQWFQLEVBQWIsRUFBZ0I7QUFDL0IsUUFBSWhDLEtBQUssS0FBS0EsRUFBZDtBQUFBLFFBQWtCNEgsTUFBTTVILEdBQUdoSCxHQUFILENBQU91RyxDQUEvQjtBQUNBLFFBQUcsQ0FBQ2dELEdBQUczQyxHQUFKLElBQVlJLEdBQUcsR0FBSCxLQUFXLENBQUNJLFFBQVFtQyxHQUFHM0MsR0FBSCxDQUFPSSxHQUFHLEdBQUgsQ0FBUCxDQUFSLEVBQXlCNEgsSUFBSUcsR0FBN0IsQ0FBM0IsRUFBOEQ7QUFDN0QsU0FBR0gsSUFBSWhJLEdBQUosS0FBWUssQ0FBZixFQUFpQjtBQUFFO0FBQVE7QUFDM0IySCxTQUFJbFEsRUFBSixDQUFPLElBQVAsRUFBYTtBQUNacVEsV0FBS0gsSUFBSUcsR0FERztBQUVabkksV0FBS2dJLElBQUloSSxHQUFKLEdBQVVLLENBRkg7QUFHWmpILFdBQUs0TyxJQUFJNU87QUFIRyxNQUFiO0FBS0E7QUFDQTtBQUNEdUosT0FBR3ZKLEdBQUgsR0FBUzRPLElBQUl4TCxJQUFiO0FBQ0EyRyxRQUFJckwsRUFBSixDQUFPLEtBQVAsRUFBYzZLLEVBQWQ7QUFDQSxJQWJEO0FBY0FRLE9BQUlhLEdBQUosQ0FBUWtILE1BQVIsR0FBaUIsVUFBU3ZJLEVBQVQsRUFBYVAsRUFBYixFQUFpQmhDLEVBQWpCLEVBQW9CO0FBQUUsUUFBSWhILE1BQU0sS0FBS2dILEVBQUwsSUFBV0EsRUFBckI7QUFDdEMsUUFBSTRILE1BQU01TyxJQUFJdUcsQ0FBZDtBQUFBLFFBQWlCbkQsT0FBT3dMLElBQUl4TCxJQUFKLENBQVNtRCxDQUFqQztBQUFBLFFBQW9DSyxNQUFNLEVBQTFDO0FBQUEsUUFBOEN3QyxHQUE5QztBQUNBLFFBQUcsQ0FBQ0csR0FBRzNDLEdBQVAsRUFBVztBQUNWO0FBQ0EsU0FBR2dJLElBQUloSSxHQUFKLEtBQVlLLENBQWYsRUFBaUI7QUFBRTtBQUFRO0FBQzNCMkgsU0FBSWxRLEVBQUosQ0FBTyxJQUFQLEVBQWE7QUFDYjtBQUNDcVEsV0FBS0gsSUFBSUcsR0FGRztBQUdabkksV0FBS2dJLElBQUloSSxHQUFKLEdBQVVLLENBSEg7QUFJWmpILFdBQUtBLEdBSk87QUFLWjRRLFdBQUtySDtBQUxPLE1BQWI7QUFPQTtBQUNBO0FBQ0Q7QUFDQS9DLFlBQVErQyxHQUFHM0MsR0FBWCxFQUFnQixVQUFTdUYsSUFBVCxFQUFlbEMsSUFBZixFQUFvQjtBQUFFLFNBQUlvRCxRQUFRLEtBQUtBLEtBQWpCO0FBQ3JDekcsU0FBSXFELElBQUosSUFBWUYsSUFBSWEsR0FBSixDQUFRaUgsS0FBUixDQUFjeEUsTUFBTXBELElBQU4sQ0FBZCxFQUEyQmtDLElBQTNCLEVBQWlDLEVBQUNrQixPQUFPQSxLQUFSLEVBQWpDLENBQVosQ0FEbUMsQ0FDMkI7QUFDOURBLFdBQU1wRCxJQUFOLElBQWNGLElBQUlhLEdBQUosQ0FBUTBHLEtBQVIsQ0FBY2pFLE1BQU1wRCxJQUFOLENBQWQsRUFBMkJrQyxJQUEzQixLQUFvQ2tCLE1BQU1wRCxJQUFOLENBQWxEO0FBQ0EsS0FIRCxFQUdHN0csSUFISDtBQUlBLFFBQUdtRyxHQUFHdkosR0FBSCxLQUFXb0QsS0FBS3BELEdBQW5CLEVBQXVCO0FBQ3RCNEcsV0FBTTJDLEdBQUczQyxHQUFUO0FBQ0E7QUFDRDtBQUNBSixZQUFRSSxHQUFSLEVBQWEsVUFBU3VGLElBQVQsRUFBZWxDLElBQWYsRUFBb0I7QUFDaEMsU0FBSTdHLE9BQU8sSUFBWDtBQUFBLFNBQWlCK0UsT0FBTy9FLEtBQUsrRSxJQUFMLEtBQWMvRSxLQUFLK0UsSUFBTCxHQUFZLEVBQTFCLENBQXhCO0FBQUEsU0FBdURuSSxNQUFNbUksS0FBSzhCLElBQUwsTUFBZTlCLEtBQUs4QixJQUFMLElBQWE3RyxLQUFLcEQsR0FBTCxDQUFTK08sR0FBVCxDQUFhOUUsSUFBYixDQUE1QixDQUE3RDtBQUFBLFNBQThHNEUsT0FBUTdPLElBQUl1RyxDQUExSDtBQUNBc0ksVUFBS2pJLEdBQUwsR0FBV3hELEtBQUtpSyxLQUFMLENBQVdwRCxJQUFYLENBQVgsQ0FGZ0MsQ0FFSDtBQUM3QixTQUFHMkUsSUFBSUYsS0FBSixJQUFhLENBQUN0SCxRQUFRK0UsSUFBUixFQUFjeUMsSUFBSUYsS0FBbEIsQ0FBakIsRUFBMEM7QUFDekMsT0FBQ25GLEtBQUt1RixPQUFPdkYsRUFBUCxFQUFXLEVBQVgsQ0FBTixFQUFzQjNDLEdBQXRCLEdBQTRCSyxDQUE1QjtBQUNBOEMsVUFBSWEsR0FBSixDQUFRd0YsS0FBUixDQUFjN0csRUFBZCxFQUFrQlAsRUFBbEIsRUFBc0I0RixJQUFJNU8sR0FBMUI7QUFDQTtBQUNBO0FBQ0Q2TyxVQUFLblEsRUFBTCxDQUFRLElBQVIsRUFBYztBQUNia0ksV0FBS3VGLElBRFE7QUFFYjRDLFdBQUs5RSxJQUZRO0FBR2JqSyxXQUFLQSxHQUhRO0FBSWI0USxXQUFLckg7QUFKUSxNQUFkO0FBTUEsS0FkRCxFQWNHbkcsSUFkSDtBQWVBLElBdENEO0FBdUNBLEdBdkpDLEdBQUQ7O0FBeUpELE1BQUlXLE9BQU9nRyxHQUFYO0FBQ0EsTUFBSXpGLE1BQU1QLEtBQUtPLEdBQWY7QUFBQSxNQUFvQnNILFNBQVN0SCxJQUFJSixFQUFqQztBQUNBLE1BQUl3QixNQUFNM0IsS0FBSzJCLEdBQWY7QUFBQSxNQUFvQjBCLFVBQVUxQixJQUFJQyxHQUFsQztBQUFBLE1BQXVDb0csVUFBVXJHLElBQUlrQixHQUFyRDtBQUFBLE1BQTBEa0ksU0FBU3BKLElBQUkyQixFQUF2RTtBQUFBLE1BQTJFYixVQUFVZCxJQUFJdkYsR0FBekY7QUFDQSxNQUFJZ00sT0FBT3BDLElBQUlvQyxJQUFmO0FBQUEsTUFBcUI0RixZQUFZNUYsS0FBS2xDLElBQXRDO0FBQUEsTUFBNEMrSCxVQUFVN0YsS0FBS2pJLEVBQTNEO0FBQUEsTUFBK0QrTixXQUFXOUYsS0FBS3RILEdBQS9FO0FBQ0EsTUFBSXFGLFFBQVFILElBQUlHLEtBQWhCO0FBQUEsTUFBdUJxSCxXQUFXckgsTUFBTWhHLEVBQXhDO0FBQUEsTUFBNEMwTixZQUFZMUgsTUFBTXJGLEdBQTlEO0FBQ0EsTUFBSW1JLE1BQU1qRCxJQUFJaUQsR0FBZDtBQUFBLE1BQW1CMkUsU0FBUzNFLElBQUk5SSxFQUFoQztBQUFBLE1BQW9DNkwsU0FBUy9DLElBQUluQixHQUFKLENBQVEzSCxFQUFyRDtBQUNBLE1BQUkrQyxDQUFKO0FBQ0EsRUFyS0EsRUFxS0UzRCxPQXJLRixFQXFLVyxTQXJLWDs7QUF1S0QsRUFBQ0EsUUFBUSxVQUFTbkgsTUFBVCxFQUFnQjtBQUN4QixNQUFJNE4sTUFBTXpHLFFBQVEsUUFBUixDQUFWO0FBQ0FBLFVBQVEsU0FBUixFQUZ3QixDQUVKO0FBQ3BCQSxVQUFRLE9BQVI7QUFDQUEsVUFBUSxTQUFSO0FBQ0FBLFVBQVEsUUFBUjtBQUNBQSxVQUFRLE9BQVI7QUFDQUEsVUFBUSxPQUFSO0FBQ0FuSCxTQUFPQyxPQUFQLEdBQWlCMk4sR0FBakI7QUFDQSxFQVRBLEVBU0V6RyxPQVRGLEVBU1csUUFUWDs7QUFXRCxFQUFDQSxRQUFRLFVBQVNuSCxNQUFULEVBQWdCO0FBQ3hCLE1BQUk0TixNQUFNekcsUUFBUSxRQUFSLENBQVY7QUFDQXlHLE1BQUloQixLQUFKLENBQVVyRixJQUFWLEdBQWlCLFVBQVNnTCxLQUFULEVBQWdCeEYsRUFBaEIsRUFBb0JQLEdBQXBCLEVBQXdCO0FBQ3hDLE9BQUlKLE9BQU8sSUFBWDtBQUFBLE9BQWlCdkksTUFBTXVJLElBQXZCO0FBQUEsT0FBNkJhLEdBQTdCO0FBQ0FULFNBQU1BLE9BQU8sRUFBYixDQUFpQkEsSUFBSWpGLElBQUosR0FBVyxJQUFYO0FBQ2pCcUcsT0FBSWhKLEdBQUosQ0FBUW5DLElBQVIsQ0FBYSxTQUFiLEVBQXdCLDJNQUF4QjtBQUNBLE9BQUdvQixRQUFRQSxJQUFJdUcsQ0FBSixDQUFNbkQsSUFBakIsRUFBc0I7QUFBQyxRQUFHOEYsRUFBSCxFQUFNO0FBQUNBLFFBQUcsRUFBQzdPLEtBQUswUCxJQUFJaEosR0FBSixDQUFRLGlDQUFSLENBQU4sRUFBSDtBQUFzRCxZQUFPZixHQUFQO0FBQVc7QUFDL0YsT0FBRyxPQUFPME8sS0FBUCxLQUFpQixRQUFwQixFQUE2QjtBQUM1QnRGLFVBQU1zRixNQUFNL0ssS0FBTixDQUFZZ0YsSUFBSWhGLEtBQUosSUFBYSxHQUF6QixDQUFOO0FBQ0EsUUFBRyxNQUFNeUYsSUFBSWhPLE1BQWIsRUFBb0I7QUFDbkI0RSxXQUFNdUksS0FBS3dHLEdBQUwsQ0FBU0wsS0FBVCxFQUFnQnhGLEVBQWhCLEVBQW9CUCxHQUFwQixDQUFOO0FBQ0EzSSxTQUFJdUcsQ0FBSixDQUFNb0MsR0FBTixHQUFZQSxHQUFaO0FBQ0EsWUFBTzNJLEdBQVA7QUFDQTtBQUNEME8sWUFBUXRGLEdBQVI7QUFDQTtBQUNELE9BQUdzRixpQkFBaUI3USxLQUFwQixFQUEwQjtBQUN6QixRQUFHNlEsTUFBTXRULE1BQU4sR0FBZSxDQUFsQixFQUFvQjtBQUNuQjRFLFdBQU11SSxJQUFOO0FBQ0EsU0FBSXBOLElBQUksQ0FBUjtBQUFBLFNBQVc4SixJQUFJeUosTUFBTXRULE1BQXJCO0FBQ0EsVUFBSUQsQ0FBSixFQUFPQSxJQUFJOEosQ0FBWCxFQUFjOUosR0FBZCxFQUFrQjtBQUNqQjZFLFlBQU1BLElBQUkrTyxHQUFKLENBQVFMLE1BQU12VCxDQUFOLENBQVIsRUFBbUJBLElBQUUsQ0FBRixLQUFROEosQ0FBVCxHQUFhaUUsRUFBYixHQUFrQixJQUFwQyxFQUEwQ1AsR0FBMUMsQ0FBTjtBQUNBO0FBQ0Q7QUFDQSxLQVBELE1BT087QUFDTjNJLFdBQU11SSxLQUFLd0csR0FBTCxDQUFTTCxNQUFNLENBQU4sQ0FBVCxFQUFtQnhGLEVBQW5CLEVBQXVCUCxHQUF2QixDQUFOO0FBQ0E7QUFDRDNJLFFBQUl1RyxDQUFKLENBQU1vQyxHQUFOLEdBQVlBLEdBQVo7QUFDQSxXQUFPM0ksR0FBUDtBQUNBO0FBQ0QsT0FBRyxDQUFDME8sS0FBRCxJQUFVLEtBQUtBLEtBQWxCLEVBQXdCO0FBQ3ZCLFdBQU9uRyxJQUFQO0FBQ0E7QUFDRHZJLFNBQU11SSxLQUFLd0csR0FBTCxDQUFTLEtBQUdMLEtBQVosRUFBbUJ4RixFQUFuQixFQUF1QlAsR0FBdkIsQ0FBTjtBQUNBM0ksT0FBSXVHLENBQUosQ0FBTW9DLEdBQU4sR0FBWUEsR0FBWjtBQUNBLFVBQU8zSSxHQUFQO0FBQ0EsR0FsQ0Q7QUFtQ0EsRUFyQ0EsRUFxQ0VzRCxPQXJDRixFQXFDVyxRQXJDWDs7QUF1Q0QsRUFBQ0EsUUFBUSxVQUFTbkgsTUFBVCxFQUFnQjtBQUN4QixNQUFJNE4sTUFBTXpHLFFBQVEsUUFBUixDQUFWO0FBQ0F5RyxNQUFJaEIsS0FBSixDQUFVckssRUFBVixHQUFlLFVBQVN3SixHQUFULEVBQWMzRSxHQUFkLEVBQW1CMk8sR0FBbkIsRUFBd0JsTCxFQUF4QixFQUEyQjtBQUN6QyxPQUFJaEgsTUFBTSxJQUFWO0FBQUEsT0FBZ0J1SixLQUFLdkosSUFBSXVHLENBQXpCO0FBQUEsT0FBNEI2QyxHQUE1QjtBQUFBLE9BQWlDRSxHQUFqQztBQUFBLE9BQXNDekssSUFBdEM7QUFDQSxPQUFHLE9BQU9xSixHQUFQLEtBQWUsUUFBbEIsRUFBMkI7QUFDMUIsUUFBRyxDQUFDM0UsR0FBSixFQUFRO0FBQUUsWUFBT2dHLEdBQUc3SyxFQUFILENBQU13SixHQUFOLENBQVA7QUFBbUI7QUFDN0JvQixVQUFNQyxHQUFHN0ssRUFBSCxDQUFNd0osR0FBTixFQUFXM0UsR0FBWCxFQUFnQjJPLE9BQU8zSSxFQUF2QixFQUEyQnZDLEVBQTNCLENBQU47QUFDQSxRQUFHa0wsT0FBT0EsSUFBSWxTLEdBQWQsRUFBa0I7QUFDakIsTUFBQ2tTLElBQUlDLElBQUosS0FBYUQsSUFBSUMsSUFBSixHQUFXLEVBQXhCLENBQUQsRUFBOEI3VyxJQUE5QixDQUFtQ2dPLEdBQW5DO0FBQ0E7QUFDRHpLLFdBQU0sZUFBVztBQUNoQixTQUFJeUssT0FBT0EsSUFBSXpLLEdBQWYsRUFBb0J5SyxJQUFJekssR0FBSjtBQUNwQkEsVUFBSUEsR0FBSjtBQUNBLEtBSEQ7QUFJQUEsU0FBSUEsR0FBSixHQUFVbUIsSUFBSW5CLEdBQUosQ0FBUXVULElBQVIsQ0FBYXBTLEdBQWIsS0FBcUJ2QixJQUEvQjtBQUNBdUIsUUFBSW5CLEdBQUosR0FBVUEsSUFBVjtBQUNBLFdBQU9tQixHQUFQO0FBQ0E7QUFDRCxPQUFJMkksTUFBTXBGLEdBQVY7QUFDQW9GLFNBQU8sU0FBU0EsR0FBVixHQUFnQixFQUFDMkgsUUFBUSxJQUFULEVBQWhCLEdBQWlDM0gsT0FBTyxFQUE5QztBQUNBQSxPQUFJMEosRUFBSixHQUFTbkssR0FBVDtBQUNBUyxPQUFJTCxJQUFKLEdBQVcsRUFBWDtBQUNBdEksT0FBSStPLEdBQUosQ0FBUXNELEVBQVIsRUFBWTFKLEdBQVosRUFwQnlDLENBb0J2QjtBQUNsQixVQUFPM0ksR0FBUDtBQUNBLEdBdEJEOztBQXdCQSxXQUFTcVMsRUFBVCxDQUFZOUksRUFBWixFQUFnQlAsRUFBaEIsRUFBbUI7QUFBRSxPQUFJTCxNQUFNLElBQVY7QUFDcEIsT0FBSTNJLE1BQU11SixHQUFHdkosR0FBYjtBQUFBLE9BQWtCNE8sTUFBTTVPLElBQUl1RyxDQUE1QjtBQUFBLE9BQStCNUUsT0FBT2lOLElBQUloSSxHQUFKLElBQVcyQyxHQUFHM0MsR0FBcEQ7QUFBQSxPQUF5RHdDLE1BQU1ULElBQUlMLElBQW5FO0FBQUEsT0FBeUVySSxLQUFLMk8sSUFBSTNPLEVBQUosR0FBT3NKLEdBQUd3RixHQUF4RjtBQUFBLE9BQTZGM0YsR0FBN0Y7QUFDQSxPQUFHbkMsTUFBTXRGLElBQVQsRUFBYztBQUNiO0FBQ0E7QUFDRCxPQUFHQSxRQUFRQSxLQUFLa0ssSUFBSXRGLENBQVQsQ0FBUixLQUF3QjZDLE1BQU15QyxJQUFJM0gsRUFBSixDQUFPdkMsSUFBUCxDQUE5QixDQUFILEVBQStDO0FBQzlDeUgsVUFBT3dGLElBQUl4TCxJQUFKLENBQVMyTCxHQUFULENBQWEzRixHQUFiLEVBQWtCN0MsQ0FBekI7QUFDQSxRQUFHVSxNQUFNbUMsSUFBSXhDLEdBQWIsRUFBaUI7QUFDaEI7QUFDQTtBQUNEakYsV0FBT3lILElBQUl4QyxHQUFYO0FBQ0E7QUFDRCxPQUFHK0IsSUFBSTJILE1BQVAsRUFBYztBQUFFO0FBQ2YzTyxXQUFPNEgsR0FBRzNDLEdBQVY7QUFDQTtBQUNEO0FBQ0EsT0FBR3dDLElBQUl4QyxHQUFKLEtBQVlqRixJQUFaLElBQW9CeUgsSUFBSTJGLEdBQUosS0FBWTlPLEVBQWhDLElBQXNDLENBQUM4SixJQUFJb0MsSUFBSixDQUFTbEMsSUFBVCxDQUFjdEksSUFBZCxDQUExQyxFQUE4RDtBQUFFO0FBQVE7QUFDeEV5SCxPQUFJeEMsR0FBSixHQUFVakYsSUFBVjtBQUNBeUgsT0FBSTJGLEdBQUosR0FBVTlPLEVBQVY7QUFDQTtBQUNBMk8sT0FBSXRHLElBQUosR0FBVzNHLElBQVg7QUFDQSxPQUFHZ0gsSUFBSTNCLEVBQVAsRUFBVTtBQUNUMkIsUUFBSTBKLEVBQUosQ0FBT3ZWLElBQVAsQ0FBWTZMLElBQUkzQixFQUFoQixFQUFvQnVDLEVBQXBCLEVBQXdCUCxFQUF4QjtBQUNBLElBRkQsTUFFTztBQUNOTCxRQUFJMEosRUFBSixDQUFPdlYsSUFBUCxDQUFZa0QsR0FBWixFQUFpQjJCLElBQWpCLEVBQXVCNEgsR0FBR3dGLEdBQTFCLEVBQStCeEYsRUFBL0IsRUFBbUNQLEVBQW5DO0FBQ0E7QUFDRDs7QUFFRGUsTUFBSWhCLEtBQUosQ0FBVWlFLEdBQVYsR0FBZ0IsVUFBUzlELEVBQVQsRUFBYVAsR0FBYixFQUFpQjtBQUNoQyxPQUFJM0ksTUFBTSxJQUFWO0FBQUEsT0FBZ0J1SixLQUFLdkosSUFBSXVHLENBQXpCO0FBQUEsT0FBNEI1RSxPQUFPNEgsR0FBRzNDLEdBQXRDO0FBQ0EsT0FBRyxJQUFJMkMsR0FBR0ksR0FBUCxJQUFjMUMsTUFBTXRGLElBQXZCLEVBQTRCO0FBQzNCLEtBQUN1SCxNQUFNekssSUFBUCxFQUFhM0IsSUFBYixDQUFrQmtELEdBQWxCLEVBQXVCMkIsSUFBdkIsRUFBNkI0SCxHQUFHd0YsR0FBaEM7QUFDQSxXQUFPL08sR0FBUDtBQUNBO0FBQ0QsT0FBR2tKLEVBQUgsRUFBTTtBQUNMLEtBQUNQLE1BQU1BLE9BQU8sRUFBZCxFQUFrQjBKLEVBQWxCLEdBQXVCbkosRUFBdkI7QUFDQVAsUUFBSWlHLEdBQUosR0FBVXJGLEVBQVY7QUFDQXZKLFFBQUkrTyxHQUFKLENBQVEvQixHQUFSLEVBQWEsRUFBQ2hHLElBQUkyQixHQUFMLEVBQWI7QUFDQUEsUUFBSTJKLEtBQUosR0FBWSxJQUFaLENBSkssQ0FJYTtBQUNsQixJQUxELE1BS087QUFDTnZJLFFBQUloSixHQUFKLENBQVFuQyxJQUFSLENBQWEsU0FBYixFQUF3QixvSkFBeEI7QUFDQSxRQUFJbUssUUFBUS9JLElBQUkrSSxLQUFKLEVBQVo7QUFDQUEsVUFBTXhDLENBQU4sQ0FBUXlHLEdBQVIsR0FBY2hOLElBQUlnTixHQUFKLENBQVEsWUFBVTtBQUMvQmpFLFdBQU14QyxDQUFOLENBQVE3SCxFQUFSLENBQVcsSUFBWCxFQUFpQnNCLElBQUl1RyxDQUFyQjtBQUNBLEtBRmEsQ0FBZDtBQUdBLFdBQU93QyxLQUFQO0FBQ0E7QUFDRCxVQUFPL0ksR0FBUDtBQUNBLEdBcEJEOztBQXNCQSxXQUFTZ04sR0FBVCxDQUFhekQsRUFBYixFQUFpQlAsRUFBakIsRUFBcUIzQixFQUFyQixFQUF3QjtBQUN2QixPQUFJc0IsTUFBTSxLQUFLM0IsRUFBZjtBQUFBLE9BQW1CNEgsTUFBTWpHLElBQUlpRyxHQUE3QjtBQUFBLE9BQWtDNU8sTUFBTXVKLEdBQUd2SixHQUEzQztBQUFBLE9BQWdENk8sT0FBTzdPLElBQUl1RyxDQUEzRDtBQUFBLE9BQThENUUsT0FBT2tOLEtBQUtqSSxHQUFMLElBQVkyQyxHQUFHM0MsR0FBcEY7QUFBQSxPQUF5RndDLEdBQXpGO0FBQ0EsT0FBR25DLE1BQU10RixJQUFULEVBQWM7QUFDYjtBQUNBO0FBQ0QsT0FBR0EsUUFBUUEsS0FBS2tLLElBQUl0RixDQUFULENBQVIsS0FBd0I2QyxNQUFNeUMsSUFBSTNILEVBQUosQ0FBT3ZDLElBQVAsQ0FBOUIsQ0FBSCxFQUErQztBQUM5Q3lILFVBQU93RixJQUFJeEwsSUFBSixDQUFTMkwsR0FBVCxDQUFhM0YsR0FBYixFQUFrQjdDLENBQXpCO0FBQ0EsUUFBR1UsTUFBTW1DLElBQUl4QyxHQUFiLEVBQWlCO0FBQ2hCO0FBQ0E7QUFDRGpGLFdBQU95SCxJQUFJeEMsR0FBWDtBQUNBO0FBQ0QsT0FBR29DLEdBQUcyQixJQUFOLEVBQVc7QUFBRWhPLGlCQUFhcU0sR0FBRzJCLElBQWhCO0FBQXVCO0FBQ3BDO0FBQ0EsT0FBRyxDQUFDaEMsSUFBSTJKLEtBQVIsRUFBYztBQUNidEosT0FBRzJCLElBQUgsR0FBVWxPLFdBQVcsWUFBVTtBQUM5QnVRLFNBQUlsUSxJQUFKLENBQVMsRUFBQ2tLLElBQUcyQixHQUFKLEVBQVQsRUFBbUJZLEVBQW5CLEVBQXVCUCxFQUF2QixFQUEyQkEsR0FBRzJCLElBQUgsSUFBVyxDQUF0QztBQUNBLEtBRlMsRUFFUGhDLElBQUlnQyxJQUFKLElBQVksRUFGTCxDQUFWO0FBR0E7QUFDQTtBQUNELE9BQUdpRSxJQUFJRixLQUFKLElBQWFFLElBQUkzRSxJQUFwQixFQUF5QjtBQUN4QixRQUFHakIsR0FBR25LLEdBQUgsRUFBSCxFQUFZO0FBQUU7QUFBUSxLQURFLENBQ0Q7QUFDdkIsSUFGRCxNQUVPO0FBQ04sUUFBRyxDQUFDOEosSUFBSTJFLElBQUosR0FBVzNFLElBQUkyRSxJQUFKLElBQVksRUFBeEIsRUFBNEJ1QixLQUFLNU8sRUFBakMsQ0FBSCxFQUF3QztBQUFFO0FBQVE7QUFDbEQwSSxRQUFJMkUsSUFBSixDQUFTdUIsS0FBSzVPLEVBQWQsSUFBb0IsSUFBcEI7QUFDQTtBQUNEMEksT0FBSTBKLEVBQUosQ0FBT3ZWLElBQVAsQ0FBWXlNLEdBQUd2SixHQUFILElBQVUySSxJQUFJM0ksR0FBMUIsRUFBK0IyQixJQUEvQixFQUFxQzRILEdBQUd3RixHQUF4QztBQUNBOztBQUVEaEYsTUFBSWhCLEtBQUosQ0FBVWxLLEdBQVYsR0FBZ0IsWUFBVTtBQUN6QixPQUFJbUIsTUFBTSxJQUFWO0FBQUEsT0FBZ0J1SixLQUFLdkosSUFBSXVHLENBQXpCO0FBQUEsT0FBNEI2QyxHQUE1QjtBQUNBLE9BQUliLE9BQU9nQixHQUFHaEIsSUFBSCxJQUFXLEVBQXRCO0FBQUEsT0FBMEJxRyxNQUFNckcsS0FBS2hDLENBQXJDO0FBQ0EsT0FBRyxDQUFDcUksR0FBSixFQUFRO0FBQUU7QUFBUTtBQUNsQixPQUFHeEYsTUFBTXdGLElBQUl6RyxJQUFiLEVBQWtCO0FBQ2pCLFFBQUdpQixJQUFJRyxHQUFHd0YsR0FBUCxDQUFILEVBQWU7QUFDZDNDLGFBQVFoRCxHQUFSLEVBQWFHLEdBQUd3RixHQUFoQjtBQUNBLEtBRkQsTUFFTztBQUNOdkksYUFBUTRDLEdBQVIsRUFBYSxVQUFTMUYsSUFBVCxFQUFlL0ksR0FBZixFQUFtQjtBQUMvQixVQUFHcUYsUUFBUTBELElBQVgsRUFBZ0I7QUFBRTtBQUFRO0FBQzFCMEksY0FBUWhELEdBQVIsRUFBYXpPLEdBQWI7QUFDQSxNQUhEO0FBSUE7QUFDRDtBQUNELE9BQUcsQ0FBQ3lPLE1BQU1wSixJQUFJdUksSUFBSixDQUFTLENBQUMsQ0FBVixDQUFQLE1BQXlCQSxJQUE1QixFQUFpQztBQUNoQzZELFlBQVFoRCxJQUFJaUUsS0FBWixFQUFtQjlELEdBQUd3RixHQUF0QjtBQUNBO0FBQ0QsT0FBR3hGLEdBQUdNLEdBQUgsS0FBV1QsTUFBTUcsR0FBR00sR0FBSCxDQUFPLElBQVAsQ0FBakIsQ0FBSCxFQUFrQztBQUNqQ3JELFlBQVE0QyxJQUFJakUsQ0FBWixFQUFlLFVBQVM2RCxFQUFULEVBQVk7QUFDMUJBLFFBQUduSyxHQUFIO0FBQ0EsS0FGRDtBQUdBO0FBQ0QsVUFBT21CLEdBQVA7QUFDQSxHQXZCRDtBQXdCQSxNQUFJMEYsTUFBTXFFLElBQUlyRSxHQUFkO0FBQUEsTUFBbUIwQixVQUFVMUIsSUFBSUMsR0FBakM7QUFBQSxNQUFzQ3lHLFVBQVUxRyxJQUFJcUIsR0FBcEQ7QUFBQSxNQUF5RCtILFNBQVNwSixJQUFJMkIsRUFBdEU7QUFDQSxNQUFJd0UsTUFBTTlCLElBQUlpRCxHQUFKLENBQVFuQixHQUFsQjtBQUNBLE1BQUlyRSxRQUFRLEVBQVo7QUFBQSxNQUFnQi9JLE9BQU8sU0FBUEEsSUFBTyxHQUFVLENBQUUsQ0FBbkM7QUFBQSxNQUFxQ3dJLENBQXJDO0FBQ0EsRUFwSUEsRUFvSUUzRCxPQXBJRixFQW9JVyxNQXBJWDs7QUFzSUQsRUFBQ0EsUUFBUSxVQUFTbkgsTUFBVCxFQUFnQjtBQUN4QixNQUFJNE4sTUFBTXpHLFFBQVEsUUFBUixDQUFWO0FBQUEsTUFBNkIyRCxDQUE3QjtBQUNBOEMsTUFBSWhCLEtBQUosQ0FBVXlILEdBQVYsR0FBZ0IsVUFBU3RILEVBQVQsRUFBYVAsR0FBYixFQUFrQi9ELENBQWxCLEVBQW9CO0FBQ25DbUYsT0FBSWhKLEdBQUosQ0FBUW5DLElBQVIsQ0FBYSxTQUFiLEVBQXdCLG1SQUF4QjtBQUNBLFVBQU8sS0FBS21RLEdBQUwsQ0FBU3dELEtBQVQsRUFBZ0IsRUFBQy9CLEtBQUt0SCxFQUFOLEVBQWhCLENBQVA7QUFDQSxHQUhEO0FBSUEsV0FBU3FKLEtBQVQsQ0FBZWhKLEVBQWYsRUFBbUJQLEVBQW5CLEVBQXNCO0FBQUVBLE1BQUduSyxHQUFIO0FBQ3ZCLE9BQUcwSyxHQUFHbFAsR0FBSCxJQUFXNE0sTUFBTXNDLEdBQUczQyxHQUF2QixFQUE0QjtBQUFFO0FBQVE7QUFDdEMsT0FBRyxDQUFDLEtBQUs0SixHQUFULEVBQWE7QUFBRTtBQUFRO0FBQ3ZCLFFBQUtBLEdBQUwsQ0FBUzFULElBQVQsQ0FBY3lNLEdBQUd2SixHQUFqQixFQUFzQnVKLEdBQUd3RixHQUF6QixFQUE4QixZQUFVO0FBQUVqTyxZQUFRQyxHQUFSLENBQVksMEVBQVosRUFBeUZ5UixLQUFLbkwsRUFBTCxDQUFRb0wsU0FBUjtBQUFvQixJQUF2SjtBQUNBO0FBQ0QsRUFYQSxFQVdFblAsT0FYRixFQVdXLE9BWFg7O0FBYUQsRUFBQ0EsUUFBUSxVQUFTbkgsTUFBVCxFQUFnQjtBQUN4QixNQUFJNE4sTUFBTXpHLFFBQVEsUUFBUixDQUFWO0FBQ0F5RyxNQUFJaEIsS0FBSixDQUFVNUksR0FBVixHQUFnQixVQUFTK0ksRUFBVCxFQUFhUCxHQUFiLEVBQWtCL0QsQ0FBbEIsRUFBb0I7QUFDbkMsT0FBSTVFLE1BQU0sSUFBVjtBQUFBLE9BQWdCNE8sTUFBTTVPLElBQUl1RyxDQUExQjtBQUFBLE9BQTZCd0MsS0FBN0I7QUFDQSxPQUFHLENBQUNHLEVBQUosRUFBTztBQUNOLFFBQUdILFFBQVE2RixJQUFJOEQsTUFBZixFQUFzQjtBQUFFLFlBQU8zSixLQUFQO0FBQWM7QUFDdENBLFlBQVE2RixJQUFJOEQsTUFBSixHQUFhMVMsSUFBSStJLEtBQUosRUFBckI7QUFDQUEsVUFBTXhDLENBQU4sQ0FBUXlHLEdBQVIsR0FBY2hOLElBQUl1SSxJQUFKLENBQVMsS0FBVCxDQUFkO0FBQ0F2SSxRQUFJdEIsRUFBSixDQUFPLElBQVAsRUFBYXlCLEdBQWIsRUFBa0I0SSxNQUFNeEMsQ0FBeEI7QUFDQSxXQUFPd0MsS0FBUDtBQUNBO0FBQ0RnQixPQUFJaEosR0FBSixDQUFRbkMsSUFBUixDQUFhLE9BQWIsRUFBc0IsdUpBQXRCO0FBQ0FtSyxXQUFRL0ksSUFBSStJLEtBQUosRUFBUjtBQUNBL0ksT0FBSUcsR0FBSixHQUFVekIsRUFBVixDQUFhLFVBQVNpRCxJQUFULEVBQWVoSCxHQUFmLEVBQW9CNE8sRUFBcEIsRUFBd0JQLEVBQXhCLEVBQTJCO0FBQ3ZDLFFBQUliLE9BQU8sQ0FBQ2UsTUFBSXpLLElBQUwsRUFBVzNCLElBQVgsQ0FBZ0IsSUFBaEIsRUFBc0I2RSxJQUF0QixFQUE0QmhILEdBQTVCLEVBQWlDNE8sRUFBakMsRUFBcUNQLEVBQXJDLENBQVg7QUFDQSxRQUFHL0IsTUFBTWtCLElBQVQsRUFBYztBQUFFO0FBQVE7QUFDeEIsUUFBRzRCLElBQUk3RixFQUFKLENBQU9pRSxJQUFQLENBQUgsRUFBZ0I7QUFDZlksV0FBTXhDLENBQU4sQ0FBUTdILEVBQVIsQ0FBVyxJQUFYLEVBQWlCeUosS0FBSzVCLENBQXRCO0FBQ0E7QUFDQTtBQUNEd0MsVUFBTXhDLENBQU4sQ0FBUTdILEVBQVIsQ0FBVyxJQUFYLEVBQWlCLEVBQUNxUSxLQUFLcFUsR0FBTixFQUFXaU0sS0FBS3VCLElBQWhCLEVBQXNCbkksS0FBSytJLEtBQTNCLEVBQWpCO0FBQ0EsSUFSRDtBQVNBLFVBQU9BLEtBQVA7QUFDQSxHQXJCRDtBQXNCQSxXQUFTNUksR0FBVCxDQUFhb0osRUFBYixFQUFnQjtBQUNmLE9BQUcsQ0FBQ0EsR0FBRzNDLEdBQUosSUFBV21ELElBQUlpRCxHQUFKLENBQVE5SSxFQUFSLENBQVdxRixHQUFHM0MsR0FBZCxDQUFkLEVBQWlDO0FBQUU7QUFBUTtBQUMzQyxPQUFHLEtBQUtJLEVBQUwsQ0FBUWdHLEdBQVgsRUFBZTtBQUFFLFNBQUtuTyxHQUFMO0FBQVksSUFGZCxDQUVlO0FBQzlCMkgsV0FBUStDLEdBQUczQyxHQUFYLEVBQWdCOEQsSUFBaEIsRUFBc0IsRUFBQ2tFLEtBQUssS0FBSzVILEVBQVgsRUFBZWhILEtBQUt1SixHQUFHdkosR0FBdkIsRUFBdEI7QUFDQSxRQUFLcUgsRUFBTCxDQUFRYyxJQUFSLENBQWFvQixFQUFiO0FBQ0E7QUFDRCxXQUFTbUIsSUFBVCxDQUFjN0QsQ0FBZCxFQUFnQlosQ0FBaEIsRUFBa0I7QUFDakIsT0FBRzBNLE9BQU8xTSxDQUFWLEVBQVk7QUFBRTtBQUFRO0FBQ3RCLE9BQUkySSxNQUFNLEtBQUtBLEdBQWY7QUFBQSxPQUFvQjVPLE1BQU0sS0FBS0EsR0FBTCxDQUFTK08sR0FBVCxDQUFhOUksQ0FBYixDQUExQjtBQUFBLE9BQTJDc0QsS0FBTXZKLElBQUl1RyxDQUFyRDtBQUNBLElBQUNnRCxHQUFHZ0gsSUFBSCxLQUFZaEgsR0FBR2dILElBQUgsR0FBVSxFQUF0QixDQUFELEVBQTRCM0IsSUFBSTNPLEVBQWhDLElBQXNDMk8sR0FBdEM7QUFDQTtBQUNELE1BQUlwSSxVQUFVdUQsSUFBSXJFLEdBQUosQ0FBUXZGLEdBQXRCO0FBQUEsTUFBMkIxQixPQUFPLFNBQVBBLElBQU8sR0FBVSxDQUFFLENBQTlDO0FBQUEsTUFBZ0RxTCxRQUFRLEVBQUNoQixNQUFNckssSUFBUCxFQUFhSSxLQUFLSixJQUFsQixFQUF4RDtBQUFBLE1BQWlGa1UsS0FBSzVJLElBQUlvQyxJQUFKLENBQVM1RixDQUEvRjtBQUFBLE1BQWtHVSxDQUFsRztBQUNBLEVBcENBLEVBb0NFM0QsT0FwQ0YsRUFvQ1csT0FwQ1g7O0FBc0NELEVBQUNBLFFBQVEsVUFBU25ILE1BQVQsRUFBZ0I7QUFDeEIsTUFBSTROLE1BQU16RyxRQUFRLFFBQVIsQ0FBVjtBQUNBeUcsTUFBSWhCLEtBQUosQ0FBVXVCLEdBQVYsR0FBZ0IsVUFBU3NJLElBQVQsRUFBZTFKLEVBQWYsRUFBbUJQLEdBQW5CLEVBQXVCO0FBQ3RDLE9BQUkzSSxNQUFNLElBQVY7QUFBQSxPQUFnQmlLLElBQWhCO0FBQ0FmLFFBQUtBLE1BQU0sWUFBVSxDQUFFLENBQXZCO0FBQ0EsT0FBR2UsT0FBT0YsSUFBSW9DLElBQUosQ0FBU2xDLElBQVQsQ0FBYzJJLElBQWQsQ0FBVixFQUE4QjtBQUFFLFdBQU81UyxJQUFJc0ssR0FBSixDQUFRdEssSUFBSXVJLElBQUosQ0FBUyxDQUFDLENBQVYsRUFBYXdHLEdBQWIsQ0FBaUI5RSxJQUFqQixDQUFSLEVBQWdDZixFQUFoQyxFQUFvQ1AsR0FBcEMsQ0FBUDtBQUFpRDtBQUNqRixPQUFHLENBQUNvQixJQUFJN0YsRUFBSixDQUFPME8sSUFBUCxDQUFKLEVBQWlCO0FBQ2hCLFFBQUc3SSxJQUFJckUsR0FBSixDQUFReEIsRUFBUixDQUFXME8sSUFBWCxDQUFILEVBQW9CO0FBQUUsWUFBTzVTLElBQUlzSyxHQUFKLENBQVF0SyxJQUFJdUcsQ0FBSixDQUFNbkQsSUFBTixDQUFXd0QsR0FBWCxDQUFlZ00sSUFBZixDQUFSLEVBQThCMUosRUFBOUIsRUFBa0NQLEdBQWxDLENBQVA7QUFBK0M7QUFDckUsV0FBTzNJLElBQUkrTyxHQUFKLENBQVFoRixJQUFJcEYsSUFBSixDQUFTSyxNQUFULEVBQVIsRUFBMkI0QixHQUEzQixDQUErQmdNLElBQS9CLENBQVA7QUFDQTtBQUNEQSxRQUFLN0QsR0FBTCxDQUFTLEdBQVQsRUFBY0EsR0FBZCxDQUFrQixVQUFTeEYsRUFBVCxFQUFhUCxFQUFiLEVBQWdCO0FBQ2pDLFFBQUcsQ0FBQ08sR0FBR3ZKLEdBQUosSUFBVyxDQUFDdUosR0FBR3ZKLEdBQUgsQ0FBT3VHLENBQVAsQ0FBU2dDLElBQXhCLEVBQTZCO0FBQzdCUyxPQUFHbkssR0FBSDtBQUNBMEssU0FBTUEsR0FBR3ZKLEdBQUgsQ0FBT3VHLENBQVAsQ0FBU2dDLElBQVQsQ0FBY2hDLENBQXBCO0FBQ0EsUUFBSUssTUFBTSxFQUFWO0FBQUEsUUFBY3VGLE9BQU81QyxHQUFHM0MsR0FBeEI7QUFBQSxRQUE2QnFELE9BQU9GLElBQUlvQyxJQUFKLENBQVNsQyxJQUFULENBQWNrQyxJQUFkLENBQXBDO0FBQ0EsUUFBRyxDQUFDbEMsSUFBSixFQUFTO0FBQUUsWUFBT2YsR0FBR3BNLElBQUgsQ0FBUWtELEdBQVIsRUFBYSxFQUFDM0YsS0FBSzBQLElBQUloSixHQUFKLENBQVEscUNBQXFDb0wsSUFBckMsR0FBNEMsSUFBcEQsQ0FBTixFQUFiLENBQVA7QUFBdUY7QUFDbEduTSxRQUFJNEcsR0FBSixDQUFRbUQsSUFBSXJFLEdBQUosQ0FBUWtCLEdBQVIsQ0FBWUEsR0FBWixFQUFpQnFELElBQWpCLEVBQXVCRixJQUFJaUQsR0FBSixDQUFRbkIsR0FBUixDQUFZaEgsR0FBWixDQUFnQm9GLElBQWhCLENBQXZCLENBQVIsRUFBdURmLEVBQXZELEVBQTJEUCxHQUEzRDtBQUNBLElBUEQsRUFPRSxFQUFDZ0MsTUFBSyxDQUFOLEVBUEY7QUFRQSxVQUFPaUksSUFBUDtBQUNBLEdBakJEO0FBa0JBLEVBcEJBLEVBb0JFdFAsT0FwQkYsRUFvQlcsT0FwQlg7O0FBc0JELEVBQUNBLFFBQVEsVUFBU25ILE1BQVQsRUFBZ0I7QUFDeEIsTUFBRyxPQUFPNE4sR0FBUCxLQUFlLFdBQWxCLEVBQThCO0FBQUU7QUFBUSxHQURoQixDQUNpQjs7QUFFekMsTUFBSTNHLElBQUo7QUFBQSxNQUFVM0UsT0FBTyxTQUFQQSxJQUFPLEdBQVUsQ0FBRSxDQUE3QjtBQUFBLE1BQStCd0ksQ0FBL0I7QUFDQSxNQUFHLE9BQU8vRCxNQUFQLEtBQWtCLFdBQXJCLEVBQWlDO0FBQUVFLFVBQU9GLE1BQVA7QUFBZTtBQUNsRCxNQUFJMlAsUUFBUXpQLEtBQUtuSSxZQUFMLElBQXFCLEVBQUNlLFNBQVN5QyxJQUFWLEVBQWdCcVUsWUFBWXJVLElBQTVCLEVBQWtDbEQsU0FBU2tELElBQTNDLEVBQWpDOztBQUVBLE1BQUlnTSxRQUFRLEVBQVo7QUFBQSxNQUFnQnNJLFFBQVEsRUFBeEI7QUFBQSxNQUE0QlQsUUFBUSxFQUFwQztBQUFBLE1BQXdDVSxRQUFRLENBQWhEO0FBQUEsTUFBbURDLE1BQU0sS0FBekQ7QUFBQSxNQUFnRXRJLElBQWhFOztBQUVBWixNQUFJckwsRUFBSixDQUFPLEtBQVAsRUFBYyxVQUFTNkssRUFBVCxFQUFZO0FBQUUsT0FBSWxQLEdBQUo7QUFBQSxPQUFTNEYsRUFBVDtBQUFBLE9BQWEwSSxHQUFiO0FBQUEsT0FBa0J2RixPQUFPbUcsR0FBR3ZKLEdBQUgsQ0FBT3VHLENBQVAsQ0FBU25ELElBQWxDO0FBQzNCLFFBQUtpRSxFQUFMLENBQVFjLElBQVIsQ0FBYW9CLEVBQWI7QUFDQSxJQUFDWixNQUFNLEVBQVAsRUFBV3VLLE1BQVgsR0FBb0IsQ0FBQzNKLEdBQUdaLEdBQUgsSUFBVUEsR0FBWCxFQUFnQnVLLE1BQWhCLElBQTBCM0osR0FBR3ZKLEdBQUgsQ0FBT3VJLElBQVAsQ0FBWSxZQUFaLENBQTFCLElBQXVELE1BQTNFO0FBQ0EsT0FBSThFLFFBQVFqSyxLQUFLbUQsQ0FBTCxDQUFPOEcsS0FBbkI7QUFDQXRELE9BQUlyRSxHQUFKLENBQVF2RixHQUFSLENBQVlvSixHQUFHM0MsR0FBZixFQUFvQixVQUFTdUYsSUFBVCxFQUFlbEMsSUFBZixFQUFvQjtBQUN2Q3FJLFVBQU1ySSxJQUFOLElBQWNxSSxNQUFNckksSUFBTixLQUFlb0QsTUFBTXBELElBQU4sQ0FBZixJQUE4QmtDLElBQTVDO0FBQ0EsSUFGRDtBQUdBNkcsWUFBUyxDQUFUO0FBQ0F2SSxTQUFNbEIsR0FBRyxHQUFILENBQU4sSUFBaUJuRyxJQUFqQjtBQUNBLFlBQVMrUCxJQUFULEdBQWU7QUFDZHhXLGlCQUFhZ08sSUFBYjtBQUNBLFFBQUloQixNQUFNYyxLQUFWO0FBQ0EsUUFBSXBLLE1BQU1pUyxLQUFWO0FBQ0FVLFlBQVEsQ0FBUjtBQUNBckksV0FBTyxLQUFQO0FBQ0FGLFlBQVEsRUFBUjtBQUNBNkgsWUFBUSxFQUFSO0FBQ0F2SSxRQUFJckUsR0FBSixDQUFRdkYsR0FBUixDQUFZRSxHQUFaLEVBQWlCLFVBQVM4TCxJQUFULEVBQWVsQyxJQUFmLEVBQW9CO0FBQ3BDO0FBQ0E7QUFDQWtDLFlBQU9rQixNQUFNcEQsSUFBTixLQUFlNUosSUFBSTRKLElBQUosQ0FBZixJQUE0QmtDLElBQW5DO0FBQ0EsU0FBRztBQUFDMEcsWUFBTTdXLE9BQU4sQ0FBYzJNLElBQUl1SyxNQUFKLEdBQWFqSixJQUEzQixFQUFpQ25GLEtBQUtDLFNBQUwsQ0FBZW9ILElBQWYsQ0FBakM7QUFDSCxNQURELENBQ0MsT0FBTXpQLENBQU4sRUFBUTtBQUFFckMsWUFBTXFDLEtBQUssc0JBQVg7QUFBbUM7QUFDOUMsS0FORDtBQU9BLFFBQUcsQ0FBQ3FOLElBQUlyRSxHQUFKLENBQVE4QixLQUFSLENBQWMrQixHQUFHdkosR0FBSCxDQUFPdUksSUFBUCxDQUFZLFdBQVosQ0FBZCxDQUFKLEVBQTRDO0FBQUU7QUFBUSxLQWZ4QyxDQWV5QztBQUN2RHdCLFFBQUlyRSxHQUFKLENBQVF2RixHQUFSLENBQVl3SixHQUFaLEVBQWlCLFVBQVN2RyxJQUFULEVBQWVuRCxFQUFmLEVBQWtCO0FBQ2xDbUQsVUFBSzFFLEVBQUwsQ0FBUSxJQUFSLEVBQWM7QUFDYixXQUFLdUIsRUFEUTtBQUViNUYsV0FBS0EsR0FGUTtBQUdiZ1ksVUFBSSxDQUhTLENBR1A7QUFITyxNQUFkO0FBS0EsS0FORDtBQU9BO0FBQ0QsT0FBR1csU0FBU0MsR0FBWixFQUFnQjtBQUFFO0FBQ2pCLFdBQU9FLE1BQVA7QUFDQTtBQUNELE9BQUd4SSxJQUFILEVBQVE7QUFBRTtBQUFRO0FBQ2xCaE8sZ0JBQWFnTyxJQUFiO0FBQ0FBLFVBQU9sTyxXQUFXMFcsSUFBWCxFQUFpQixJQUFqQixDQUFQO0FBQ0EsR0F2Q0Q7QUF3Q0FwSixNQUFJckwsRUFBSixDQUFPLEtBQVAsRUFBYyxVQUFTNkssRUFBVCxFQUFZO0FBQ3pCLFFBQUtsQyxFQUFMLENBQVFjLElBQVIsQ0FBYW9CLEVBQWI7QUFDQSxPQUFJdkosTUFBTXVKLEdBQUd2SixHQUFiO0FBQUEsT0FBa0JvVCxNQUFNN0osR0FBR3dGLEdBQTNCO0FBQUEsT0FBZ0M5RSxJQUFoQztBQUFBLE9BQXNDdEksSUFBdEM7QUFBQSxPQUE0Q2dILEdBQTVDO0FBQUEsT0FBaUQxQixDQUFqRDtBQUNBO0FBQ0EsSUFBQzBCLE1BQU1ZLEdBQUdaLEdBQUgsSUFBVSxFQUFqQixFQUFxQnVLLE1BQXJCLEdBQThCdkssSUFBSXVLLE1BQUosSUFBYzNKLEdBQUd2SixHQUFILENBQU91SSxJQUFQLENBQVksWUFBWixDQUFkLElBQTJDLE1BQXpFO0FBQ0EsT0FBRyxDQUFDNkssR0FBRCxJQUFRLEVBQUVuSixPQUFPbUosSUFBSXJKLElBQUl4RCxDQUFKLENBQU0wRCxJQUFWLENBQVQsQ0FBWCxFQUFxQztBQUFFO0FBQVE7QUFDL0M7QUFDQSxPQUFJeUUsUUFBUTBFLElBQUksR0FBSixDQUFaO0FBQ0F6UixVQUFPb0ksSUFBSXJFLEdBQUosQ0FBUWIsR0FBUixDQUFZZ08sTUFBTXRYLE9BQU4sQ0FBY29OLElBQUl1SyxNQUFKLEdBQWFqSixJQUEzQixLQUFvQyxJQUFoRCxLQUF5RHFJLE1BQU1ySSxJQUFOLENBQXpELElBQXdFaEQsQ0FBL0U7QUFDQSxPQUFHdEYsUUFBUStNLEtBQVgsRUFBaUI7QUFDaEIvTSxXQUFPb0ksSUFBSUcsS0FBSixDQUFVN0MsRUFBVixDQUFhMUYsSUFBYixFQUFtQitNLEtBQW5CLENBQVA7QUFDQTtBQUNELE9BQUcsQ0FBQy9NLElBQUQsSUFBUyxDQUFDb0ksSUFBSXJFLEdBQUosQ0FBUThCLEtBQVIsQ0FBY3hILElBQUl1SSxJQUFKLENBQVMsV0FBVCxDQUFkLENBQWIsRUFBa0Q7QUFBRTtBQUNuRCxXQURpRCxDQUN6QztBQUNSO0FBQ0R2SSxPQUFJdEIsRUFBSixDQUFPLElBQVAsRUFBYSxFQUFDLEtBQUs2SyxHQUFHLEdBQUgsQ0FBTixFQUFlM0MsS0FBS21ELElBQUlzRCxLQUFKLENBQVVsQixJQUFWLENBQWV4SyxJQUFmLENBQXBCLEVBQTBDK04sS0FBSyxJQUEvQyxFQUFiO0FBQ0E7QUFDQSxHQWpCRDtBQWtCQSxFQW5FQSxFQW1FRXBNLE9BbkVGLEVBbUVXLHlCQW5FWDs7QUFxRUQsRUFBQ0EsUUFBUSxVQUFTbkgsTUFBVCxFQUFnQjtBQUN4QixNQUFJNE4sTUFBTXpHLFFBQVEsUUFBUixDQUFWOztBQUVBLE1BQUksT0FBT3dCLElBQVAsS0FBZ0IsV0FBcEIsRUFBaUM7QUFDaEMsU0FBTSxJQUFJMUssS0FBSixDQUNMLGlEQUNBLGtEQUZLLENBQU47QUFJQTs7QUFFRCxNQUFJaVosU0FBSjtBQUNBLE1BQUcsT0FBT25RLE1BQVAsS0FBa0IsV0FBckIsRUFBaUM7QUFDaENtUSxlQUFZblEsT0FBT21RLFNBQVAsSUFBb0JuUSxPQUFPb1EsZUFBM0IsSUFBOENwUSxPQUFPcVEsWUFBakU7QUFDQSxHQUZELE1BRU87QUFDTjtBQUNBO0FBQ0QsTUFBSXhZLE9BQUo7QUFBQSxNQUFhaVksUUFBUSxDQUFyQjtBQUFBLE1BQXdCdlUsT0FBTyxTQUFQQSxJQUFPLEdBQVUsQ0FBRSxDQUEzQztBQUFBLE1BQTZDa00sSUFBN0M7O0FBRUFaLE1BQUlyTCxFQUFKLENBQU8sS0FBUCxFQUFjLFVBQVM2SyxFQUFULEVBQVk7QUFDekIsUUFBS2xDLEVBQUwsQ0FBUWMsSUFBUixDQUFhb0IsRUFBYjtBQUNBLE9BQUlxRixNQUFNckYsR0FBR3ZKLEdBQUgsQ0FBT3VHLENBQVAsQ0FBU25ELElBQVQsQ0FBY21ELENBQXhCO0FBQUEsT0FBMkJpTixNQUFNNUUsSUFBSTRFLEdBQUosS0FBWTVFLElBQUk0RSxHQUFKLEdBQVUsRUFBdEIsQ0FBakM7QUFDQSxPQUFHakssR0FBR2lLLEdBQUgsSUFBVSxNQUFNQSxJQUFJUixLQUF2QixFQUE2QjtBQUFFO0FBQVEsSUFIZCxDQUdlO0FBQ3hDalksYUFBVStKLEtBQUtDLFNBQUwsQ0FBZXdFLEVBQWYsQ0FBVjtBQUNBO0FBQ0EsT0FBR3FGLElBQUk2RSxNQUFQLEVBQWM7QUFDYjdFLFFBQUk2RSxNQUFKLENBQVduWSxJQUFYLENBQWdCUCxPQUFoQjtBQUNBO0FBQ0E7QUFDRDZULE9BQUk2RSxNQUFKLEdBQWEsRUFBYjtBQUNBOVcsZ0JBQWFnTyxJQUFiO0FBQ0FBLFVBQU9sTyxXQUFXLFlBQVU7QUFDM0IsUUFBRyxDQUFDbVMsSUFBSTZFLE1BQVIsRUFBZTtBQUFFO0FBQVE7QUFDekIsUUFBSXJLLE1BQU13RixJQUFJNkUsTUFBZDtBQUNBN0UsUUFBSTZFLE1BQUosR0FBYSxJQUFiO0FBQ0EsUUFBSXJLLElBQUloTyxNQUFSLEVBQWlCO0FBQ2hCTCxlQUFVK0osS0FBS0MsU0FBTCxDQUFlcUUsR0FBZixDQUFWO0FBQ0FXLFNBQUlyRSxHQUFKLENBQVF2RixHQUFSLENBQVl5TyxJQUFJakcsR0FBSixDQUFRZ0gsS0FBcEIsRUFBMkIrRCxJQUEzQixFQUFpQzlFLEdBQWpDO0FBQ0E7QUFDRCxJQVJNLEVBUUwsQ0FSSyxDQUFQO0FBU0E0RSxPQUFJUixLQUFKLEdBQVksQ0FBWjtBQUNBakosT0FBSXJFLEdBQUosQ0FBUXZGLEdBQVIsQ0FBWXlPLElBQUlqRyxHQUFKLENBQVFnSCxLQUFwQixFQUEyQitELElBQTNCLEVBQWlDOUUsR0FBakM7QUFDQSxHQXZCRDs7QUF5QkEsV0FBUzhFLElBQVQsQ0FBY0MsSUFBZCxFQUFtQjtBQUNsQixPQUFJQyxNQUFNN1ksT0FBVjtBQUFBLE9BQW1CNlQsTUFBTSxJQUF6QjtBQUNBLE9BQUlpRixPQUFPRixLQUFLRSxJQUFMLElBQWFDLEtBQUtILElBQUwsRUFBVy9FLEdBQVgsQ0FBeEI7QUFDQSxPQUFHQSxJQUFJNEUsR0FBUCxFQUFXO0FBQUU1RSxRQUFJNEUsR0FBSixDQUFRUixLQUFSO0FBQWlCO0FBQzlCLE9BQUcsQ0FBQ2EsSUFBSixFQUFTO0FBQUU7QUFBUTtBQUNuQixPQUFHQSxLQUFLRSxVQUFMLEtBQW9CRixLQUFLRyxJQUE1QixFQUFpQztBQUNoQ0gsU0FBS0gsSUFBTCxDQUFVRSxHQUFWO0FBQ0E7QUFDQTtBQUNELElBQUNELEtBQUsxVyxLQUFMLEdBQWEwVyxLQUFLMVcsS0FBTCxJQUFjLEVBQTVCLEVBQWdDM0IsSUFBaEMsQ0FBcUNzWSxHQUFyQztBQUNBOztBQUVELFdBQVNLLE9BQVQsQ0FBaUJMLEdBQWpCLEVBQXNCRCxJQUF0QixFQUE0Qi9FLEdBQTVCLEVBQWdDO0FBQy9CLE9BQUcsQ0FBQ0EsR0FBRCxJQUFRLENBQUNnRixHQUFaLEVBQWdCO0FBQUU7QUFBUTtBQUMxQixPQUFHO0FBQUNBLFVBQU05TyxLQUFLcUMsS0FBTCxDQUFXeU0sSUFBSWpTLElBQUosSUFBWWlTLEdBQXZCLENBQU47QUFDSCxJQURELENBQ0MsT0FBTWxYLENBQU4sRUFBUSxDQUFFO0FBQ1gsT0FBR2tYLGVBQWUvVixLQUFsQixFQUF3QjtBQUN2QixRQUFJMUMsSUFBSSxDQUFSO0FBQUEsUUFBVzJLLENBQVg7QUFDQSxXQUFNQSxJQUFJOE4sSUFBSXpZLEdBQUosQ0FBVixFQUFtQjtBQUNsQjhZLGFBQVFuTyxDQUFSLEVBQVc2TixJQUFYLEVBQWlCL0UsR0FBakI7QUFDQTtBQUNEO0FBQ0E7QUFDRDtBQUNBLE9BQUdBLElBQUk0RSxHQUFKLElBQVcsTUFBTTVFLElBQUk0RSxHQUFKLENBQVFSLEtBQTVCLEVBQWtDO0FBQUUsS0FBQ1ksSUFBSU0sSUFBSixJQUFZTixHQUFiLEVBQWtCSixHQUFsQixHQUF3Qi9VLElBQXhCO0FBQThCLElBWm5DLENBWW9DO0FBQ25FbVEsT0FBSTVPLEdBQUosQ0FBUXRCLEVBQVIsQ0FBVyxJQUFYLEVBQWlCa1YsSUFBSU0sSUFBSixJQUFZTixHQUE3QjtBQUNBOztBQUVELFdBQVNFLElBQVQsQ0FBY0gsSUFBZCxFQUFvQjNNLEVBQXBCLEVBQXVCO0FBQ3RCLE9BQUcsQ0FBQzJNLElBQUQsSUFBUyxDQUFDQSxLQUFLL0QsR0FBbEIsRUFBc0I7QUFBRTtBQUFRO0FBQ2hDLE9BQUlBLE1BQU0rRCxLQUFLL0QsR0FBTCxDQUFTL0wsT0FBVCxDQUFpQixNQUFqQixFQUF5QixJQUF6QixDQUFWO0FBQ0EsT0FBSWdRLE9BQU9GLEtBQUtFLElBQUwsR0FBWSxJQUFJUixTQUFKLENBQWN6RCxHQUFkLEVBQW1CNUksR0FBRzJCLEdBQUgsQ0FBT2tILEdBQVAsQ0FBV0MsU0FBOUIsRUFBeUM5SSxHQUFHMkIsR0FBSCxDQUFPa0gsR0FBaEQsQ0FBdkI7QUFDQWdFLFFBQUtNLE9BQUwsR0FBZSxZQUFVO0FBQ3hCQyxjQUFVVCxJQUFWLEVBQWdCM00sRUFBaEI7QUFDQSxJQUZEO0FBR0E2TSxRQUFLUSxPQUFMLEdBQWUsVUFBU3ZVLEtBQVQsRUFBZTtBQUM3QnNVLGNBQVVULElBQVYsRUFBZ0IzTSxFQUFoQjtBQUNBLFFBQUcsQ0FBQ2xILEtBQUosRUFBVTtBQUFFO0FBQVE7QUFDcEIsUUFBR0EsTUFBTXdVLElBQU4sS0FBZSxjQUFsQixFQUFpQztBQUNoQztBQUNBO0FBQ0QsSUFORDtBQU9BVCxRQUFLVSxNQUFMLEdBQWMsWUFBVTtBQUN2QixRQUFJdFgsUUFBUTBXLEtBQUsxVyxLQUFqQjtBQUNBMFcsU0FBSzFXLEtBQUwsR0FBYSxFQUFiO0FBQ0E4TSxRQUFJckUsR0FBSixDQUFRdkYsR0FBUixDQUFZbEQsS0FBWixFQUFtQixVQUFTMlcsR0FBVCxFQUFhO0FBQy9CN1ksZUFBVTZZLEdBQVY7QUFDQUYsVUFBSzVXLElBQUwsQ0FBVWtLLEVBQVYsRUFBYzJNLElBQWQ7QUFDQSxLQUhEO0FBSUEsSUFQRDtBQVFBRSxRQUFLVyxTQUFMLEdBQWlCLFVBQVNaLEdBQVQsRUFBYTtBQUM3QkssWUFBUUwsR0FBUixFQUFhRCxJQUFiLEVBQW1CM00sRUFBbkI7QUFDQSxJQUZEO0FBR0EsVUFBTzZNLElBQVA7QUFDQTs7QUFFRCxXQUFTTyxTQUFULENBQW1CVCxJQUFuQixFQUF5QjNNLEVBQXpCLEVBQTRCO0FBQzNCckssZ0JBQWFnWCxLQUFLekksS0FBbEI7QUFDQXlJLFFBQUt6SSxLQUFMLEdBQWF6TyxXQUFXLFlBQVU7QUFDakNxWCxTQUFLSCxJQUFMLEVBQVczTSxFQUFYO0FBQ0EsSUFGWSxFQUVWLElBQUksSUFGTSxDQUFiO0FBR0E7QUFDRCxFQXpHQSxFQXlHRTFELE9BekdGLEVBeUdXLG9CQXpHWDtBQTJHRCxDQWpvRUMsR0FBRCxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUQ7Ozs7Ozs7QUFPQTs7O0lBR2FtUixXLFdBQUFBLFc7Ozs7Ozs7Ozs7Ozs7QUFFVDs7Ozt3Q0FJZ0J2QixNLEVBQVE7QUFBQTs7QUFFcEIsZ0JBQU13QixVQUFVeEIsVUFBVSxPQUExQjs7QUFFQSxpQkFBS3lCLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxpQkFBS0MsUUFBTCxHQUFnQixJQUFoQjs7QUFFQTtBQUNBLGlCQUFLdlMsT0FBTCxHQUFlO0FBQ1gsNkJBQWMsS0FBS3dTLFlBQUwsQ0FBa0IsV0FBbEIsS0FBa0MsTUFEckM7QUFFWCw4QkFBZSxLQUFLQSxZQUFMLENBQWtCLFFBQWxCLEtBQStCLE1BRm5DO0FBR1gsMkJBQVksS0FBS0EsWUFBTCxDQUFrQixTQUFsQixLQUFnQztBQUhqQyxhQUFmOztBQU1BO0FBQ0EsZ0JBQUksS0FBS3hTLE9BQUwsQ0FBYXlTLE9BQWIsS0FBeUIsSUFBN0IsRUFBbUM7QUFDL0I7QUFDQSxvQkFBSUMsV0FBVyxJQUFmO0FBQ0EsdUJBQU9BLFNBQVNDLFVBQWhCLEVBQTRCO0FBQ3hCRCwrQkFBV0EsU0FBU0MsVUFBcEI7QUFDQSx3QkFBSUQsU0FBU0UsUUFBVCxDQUFrQnJQLFdBQWxCLE1BQW1DOE8sVUFBVSxTQUFqRCxFQUE0RDtBQUN4RCw0QkFBTW5KLFVBQVV3SixTQUFTeEosT0FBVCxFQUFoQjtBQUNBLDZCQUFLcUosUUFBTCxHQUFnQnJKLFFBQVEySixLQUF4QjtBQUNBO0FBQ0g7QUFDSjtBQUNKO0FBQ0QsaUJBQUtDLE1BQUwsR0FBYyxFQUFkO0FBQ0EsZ0JBQU1DLFlBQVksS0FBS0MsUUFBdkI7QUFDQSxpQkFBSyxJQUFJbGEsSUFBSSxDQUFiLEVBQWdCQSxJQUFJaWEsVUFBVWhhLE1BQTlCLEVBQXNDRCxHQUF0QyxFQUEyQztBQUN2QyxvQkFBTW1hLFNBQVNGLFVBQVVqYSxDQUFWLENBQWY7QUFDQSxvQkFBSXVJLE9BQU80UixPQUFPVCxZQUFQLENBQW9CLE1BQXBCLENBQVg7QUFDQSx3QkFBUVMsT0FBT0wsUUFBUCxDQUFnQnJQLFdBQWhCLEVBQVI7QUFDSSx5QkFBSzhPLFVBQVUsVUFBZjtBQUNJaFIsK0JBQU8sR0FBUDtBQUNBO0FBQ0oseUJBQUtnUixVQUFVLFFBQWY7QUFDSWhSLCtCQUFRLEtBQUtrUixRQUFMLEtBQWtCLElBQW5CLEdBQTJCLEtBQUtBLFFBQUwsR0FBZ0JsUixJQUEzQyxHQUFrREEsSUFBekQ7QUFDQTtBQU5SO0FBUUEsb0JBQUlBLFNBQVMsSUFBYixFQUFtQjtBQUNmLHdCQUFJNlIsWUFBWSxJQUFoQjtBQUNBLHdCQUFJRCxPQUFPRSxTQUFYLEVBQXNCO0FBQ2xCRCxvQ0FBWSxNQUFNYixPQUFOLEdBQWdCLFNBQWhCLEdBQTRCWSxPQUFPRSxTQUFuQyxHQUErQyxJQUEvQyxHQUFzRGQsT0FBdEQsR0FBZ0UsU0FBNUU7QUFDSDtBQUNELHlCQUFLUyxNQUFMLENBQVl6UixJQUFaLElBQW9CO0FBQ2hCLHFDQUFhNFIsT0FBT1QsWUFBUCxDQUFvQixXQUFwQixDQURHO0FBRWhCLG9DQUFZVTtBQUZJLHFCQUFwQjtBQUlIO0FBQ0o7O0FBRUQ7QUFDQSxpQkFBS0MsU0FBTCxHQUFpQixFQUFqQjs7QUFFQSxnQkFBSSxLQUFLblQsT0FBTCxDQUFhb1QsVUFBYixLQUE0QixJQUFoQyxFQUFzQztBQUNsQyxxQkFBS0MsZ0JBQUw7QUFDQSxxQkFBS3RTLElBQUwsR0FBWSxLQUFLcVMsVUFBakI7QUFDSCxhQUhELE1BR087QUFDSCxxQkFBS3JTLElBQUwsR0FBWSxJQUFaO0FBQ0g7QUFDRCxnQkFBSSxLQUFLZixPQUFMLENBQWFzVCxTQUFiLEtBQTJCLElBQS9CLEVBQXFDO0FBQ2pDLHFCQUFLQyxhQUFMO0FBQ0g7QUFDRCxpQkFBS0MsTUFBTDtBQUNBcEIsd0JBQVlxQixVQUFaLENBQXVCLFVBQUNDLE1BQUQsRUFBWTtBQUMvQixvQkFBSSxPQUFLMVQsT0FBTCxDQUFhc1QsU0FBYixLQUEyQixJQUEvQixFQUFxQztBQUNqQyx3QkFBSUksV0FBVyxJQUFmLEVBQXFCO0FBQ2pCLCtCQUFLQyxTQUFMLENBQWVDLEdBQWYsQ0FBbUIsVUFBbkI7QUFDSCxxQkFGRCxNQUVPO0FBQ0gsK0JBQUtELFNBQUwsQ0FBZUUsTUFBZixDQUFzQixVQUF0QjtBQUNIO0FBQ0o7QUFDRCx1QkFBS0wsTUFBTDtBQUNILGFBVEQ7QUFXSDs7QUFFRDs7Ozs7O3dDQUdnQjtBQUFBOztBQUNaLGdCQUFNTSxXQUFXLElBQUlDLGdCQUFKLENBQXFCLFVBQUNDLFNBQUQsRUFBZTtBQUNqRCxvQkFBSWxLLE9BQU9rSyxVQUFVLENBQVYsRUFBYUMsVUFBYixDQUF3QixDQUF4QixDQUFYO0FBQ0Esb0JBQUluSyxTQUFTWCxTQUFiLEVBQXdCO0FBQ3BCLHdCQUFNK0ssZ0JBQWdCLE9BQUtDLGdCQUFMLENBQXNCckssSUFBdEIsQ0FBdEI7QUFDQUEseUJBQUs2SixTQUFMLENBQWVDLEdBQWYsQ0FBbUIsZUFBbkI7QUFDQTlKLHlCQUFLNkosU0FBTCxDQUFlQyxHQUFmLENBQW1CLE9BQW5CO0FBQ0F4WiwrQkFBVyxZQUFNO0FBQ2IsNEJBQUk4WixjQUFjbmIsTUFBZCxHQUF1QixDQUEzQixFQUE4QjtBQUMxQm1iLDBDQUFjRSxPQUFkLENBQXNCLFVBQUNDLEtBQUQsRUFBVztBQUM3QkEsc0NBQU1WLFNBQU4sQ0FBZ0JDLEdBQWhCLENBQW9CLE1BQXBCO0FBQ0F4WiwyQ0FBVyxZQUFNO0FBQ2JpYSwwQ0FBTVYsU0FBTixDQUFnQkMsR0FBaEIsQ0FBb0IsVUFBcEI7QUFDSCxpQ0FGRCxFQUVHLEVBRkg7QUFHSCw2QkFMRDtBQU1IO0FBQ0R4WixtQ0FBVyxZQUFNO0FBQ2IwUCxpQ0FBSzZKLFNBQUwsQ0FBZUMsR0FBZixDQUFtQixVQUFuQjtBQUNILHlCQUZELEVBRUcsRUFGSDtBQUdILHFCQVpELEVBWUcsRUFaSDtBQWFBLHdCQUFNVSxlQUFlLFNBQWZBLFlBQWUsQ0FBQzdNLEtBQUQsRUFBVztBQUM1Qiw0QkFBSUEsTUFBTThNLE1BQU4sQ0FBYUMsU0FBYixDQUF1QjlRLE9BQXZCLENBQStCLE1BQS9CLElBQXlDLENBQUMsQ0FBOUMsRUFBaUQ7QUFDN0MsbUNBQUszQyxJQUFMLENBQVUwVCxXQUFWLENBQXNCaE4sTUFBTThNLE1BQTVCO0FBQ0g7QUFDSixxQkFKRDtBQUtBeksseUJBQUs0SyxnQkFBTCxDQUFzQixlQUF0QixFQUF1Q0osWUFBdkM7QUFDQXhLLHlCQUFLNEssZ0JBQUwsQ0FBc0IsY0FBdEIsRUFBc0NKLFlBQXRDO0FBQ0g7QUFDSixhQTNCZ0IsQ0FBakI7QUE0QkFSLHFCQUFTYSxPQUFULENBQWlCLElBQWpCLEVBQXVCLEVBQUNDLFdBQVcsSUFBWixFQUF2QjtBQUNIOztBQUVEOzs7Ozs7O2tDQUlVO0FBQ04sZ0JBQU12VCxPQUFPK1EsWUFBWXlDLGNBQVosRUFBYjtBQUNBLGlCQUFLLElBQU1oQyxLQUFYLElBQW9CLEtBQUtDLE1BQXpCLEVBQWlDO0FBQzdCLG9CQUFJRCxVQUFVLEdBQWQsRUFBbUI7QUFDZix3QkFBSWlDLGNBQWMsTUFBTWpDLE1BQU1yUixPQUFOLENBQWMsV0FBZCxFQUEyQixXQUEzQixDQUF4QjtBQUNBc1QsbUNBQWdCQSxZQUFZcFIsT0FBWixDQUFvQixNQUFwQixJQUE4QixDQUFDLENBQWhDLEdBQXFDLEVBQXJDLEdBQTBDLFNBQVMsbUJBQWxFO0FBQ0Esd0JBQU1xUixRQUFRLElBQUlDLE1BQUosQ0FBV0YsV0FBWCxDQUFkO0FBQ0Esd0JBQUlDLE1BQU1FLElBQU4sQ0FBVzVULElBQVgsQ0FBSixFQUFzQjtBQUNsQiwrQkFBTzZULGFBQWEsS0FBS3BDLE1BQUwsQ0FBWUQsS0FBWixDQUFiLEVBQWlDQSxLQUFqQyxFQUF3Q2tDLEtBQXhDLEVBQStDMVQsSUFBL0MsQ0FBUDtBQUNIO0FBQ0o7QUFDSjtBQUNELG1CQUFRLEtBQUt5UixNQUFMLENBQVksR0FBWixNQUFxQjNKLFNBQXRCLEdBQW1DK0wsYUFBYSxLQUFLcEMsTUFBTCxDQUFZLEdBQVosQ0FBYixFQUErQixHQUEvQixFQUFvQyxJQUFwQyxFQUEwQ3pSLElBQTFDLENBQW5DLEdBQXFGLElBQTVGO0FBQ0g7O0FBRUQ7Ozs7OztpQ0FHUztBQUNMLGdCQUFNcEQsU0FBUyxLQUFLaUwsT0FBTCxFQUFmO0FBQ0EsZ0JBQUlqTCxXQUFXLElBQWYsRUFBcUI7QUFDakIsb0JBQUlBLE9BQU9vRCxJQUFQLEtBQWdCLEtBQUtpUixZQUFyQixJQUFxQyxLQUFLdFMsT0FBTCxDQUFhc1QsU0FBYixLQUEyQixJQUFwRSxFQUEwRTtBQUN0RSx3QkFBSSxLQUFLdFQsT0FBTCxDQUFhc1QsU0FBYixLQUEyQixJQUEvQixFQUFxQztBQUNqQyw2QkFBS3ZTLElBQUwsQ0FBVW9TLFNBQVYsR0FBc0IsRUFBdEI7QUFDSDtBQUNELHdCQUFJbFYsT0FBT2tYLFNBQVAsS0FBcUIsSUFBekIsRUFBK0I7QUFDM0IsNEJBQUlDLGFBQWFDLFNBQVNDLGFBQVQsQ0FBdUJyWCxPQUFPa1gsU0FBOUIsQ0FBakI7QUFDQSw2QkFBSyxJQUFJN2MsR0FBVCxJQUFnQjJGLE9BQU9zWCxNQUF2QixFQUErQjtBQUMzQixnQ0FBSWpKLFFBQVFyTyxPQUFPc1gsTUFBUCxDQUFjamQsR0FBZCxDQUFaO0FBQ0EsZ0NBQUksT0FBT2dVLEtBQVAsSUFBZ0IsUUFBcEIsRUFBOEI7QUFDMUIsb0NBQUk7QUFDQUEsNENBQVE3SixLQUFLcUMsS0FBTCxDQUFXd0gsS0FBWCxDQUFSO0FBQ0gsaUNBRkQsQ0FFRSxPQUFPalMsQ0FBUCxFQUFVO0FBQ1JvRSw0Q0FBUWhCLEtBQVIsQ0FBYyw2QkFBZCxFQUE2Q3BELENBQTdDO0FBQ0g7QUFDSjtBQUNEK2EsdUNBQVdJLFlBQVgsQ0FBd0JsZCxHQUF4QixFQUE2QmdVLEtBQTdCO0FBQ0g7QUFDRCw2QkFBS3ZMLElBQUwsQ0FBVTBVLFdBQVYsQ0FBc0JMLFVBQXRCO0FBQ0gscUJBZEQsTUFjTztBQUNILDRCQUFJbEMsWUFBWWpWLE9BQU95WCxRQUF2QjtBQUNBO0FBQ0EsNEJBQUl4QyxVQUFVeFAsT0FBVixDQUFrQixJQUFsQixJQUEwQixDQUFDLENBQS9CLEVBQWtDO0FBQzlCd1Asd0NBQVlBLFVBQVUxUixPQUFWLENBQWtCLGVBQWxCLEVBQ1IsVUFBVW1VLENBQVYsRUFBYTVULENBQWIsRUFBZ0I7QUFDWixvQ0FBSXFCLElBQUluRixPQUFPc1gsTUFBUCxDQUFjeFQsQ0FBZCxDQUFSO0FBQ0EsdUNBQU8sT0FBT3FCLENBQVAsS0FBYSxRQUFiLElBQXlCLE9BQU9BLENBQVAsS0FBYSxRQUF0QyxHQUFpREEsQ0FBakQsR0FBcUR1UyxDQUE1RDtBQUNILDZCQUpPLENBQVo7QUFNSDtBQUNELDZCQUFLNVUsSUFBTCxDQUFVb1MsU0FBVixHQUFzQkQsU0FBdEI7QUFDSDtBQUNELHlCQUFLWixZQUFMLEdBQW9CclUsT0FBT29ELElBQTNCO0FBQ0g7QUFDSjtBQUNKOztBQUdEOzs7Ozs7Ozt5Q0FLaUJ5SSxJLEVBQU07QUFDbkIsZ0JBQU1rSixXQUFXLEtBQUtqUyxJQUFMLENBQVVpUyxRQUEzQjtBQUNBLGdCQUFJNEMsVUFBVSxFQUFkO0FBQ0EsaUJBQUssSUFBSTljLElBQUksQ0FBYixFQUFnQkEsSUFBSWthLFNBQVNqYSxNQUE3QixFQUFxQ0QsR0FBckMsRUFBMEM7QUFDdEMsb0JBQUl1YixRQUFRckIsU0FBU2xhLENBQVQsQ0FBWjtBQUNBLG9CQUFJdWIsU0FBU3ZLLElBQWIsRUFBbUI7QUFDZjhMLDRCQUFRM2MsSUFBUixDQUFhb2IsS0FBYjtBQUNIO0FBQ0o7QUFDRCxtQkFBT3VCLE9BQVA7QUFDSDs7Ozs7QUFHRDs7Ozs7eUNBS3dCckksRyxFQUFLO0FBQ3pCLGdCQUFJdFAsU0FBUyxFQUFiO0FBQ0EsZ0JBQUlzUCxRQUFRcEUsU0FBWixFQUF1QjtBQUNuQixvQkFBSTBNLGNBQWV0SSxJQUFJN0osT0FBSixDQUFZLEdBQVosSUFBbUIsQ0FBQyxDQUFyQixHQUEwQjZKLElBQUl1SSxNQUFKLENBQVd2SSxJQUFJN0osT0FBSixDQUFZLEdBQVosSUFBbUIsQ0FBOUIsRUFBaUM2SixJQUFJeFUsTUFBckMsQ0FBMUIsR0FBeUUsSUFBM0Y7QUFDQSxvQkFBSThjLGdCQUFnQixJQUFwQixFQUEwQjtBQUN0QkEsZ0NBQVl2VSxLQUFaLENBQWtCLEdBQWxCLEVBQXVCOFMsT0FBdkIsQ0FBK0IsVUFBVTJCLElBQVYsRUFBZ0I7QUFDM0MsNEJBQUksQ0FBQ0EsSUFBTCxFQUFXO0FBQ1hBLCtCQUFPQSxLQUFLdlUsT0FBTCxDQUFhLEdBQWIsRUFBa0IsR0FBbEIsQ0FBUDtBQUNBLDRCQUFJd1UsS0FBS0QsS0FBS3JTLE9BQUwsQ0FBYSxHQUFiLENBQVQ7QUFDQSw0QkFBSXBMLE1BQU0wZCxLQUFLLENBQUMsQ0FBTixHQUFVRCxLQUFLRCxNQUFMLENBQVksQ0FBWixFQUFlRSxFQUFmLENBQVYsR0FBK0JELElBQXpDO0FBQ0EsNEJBQUlwTCxNQUFNcUwsS0FBSyxDQUFDLENBQU4sR0FBVUMsbUJBQW1CRixLQUFLRCxNQUFMLENBQVlFLEtBQUssQ0FBakIsQ0FBbkIsQ0FBVixHQUFvRCxFQUE5RDtBQUNBLDRCQUFJL1EsT0FBTzNNLElBQUlvTCxPQUFKLENBQVksR0FBWixDQUFYO0FBQ0EsNEJBQUl1QixRQUFRLENBQUMsQ0FBYixFQUFnQmhILE9BQU9nWSxtQkFBbUIzZCxHQUFuQixDQUFQLElBQWtDcVMsR0FBbEMsQ0FBaEIsS0FDSztBQUNELGdDQUFJM0YsS0FBSzFNLElBQUlvTCxPQUFKLENBQVksR0FBWixDQUFUO0FBQ0EsZ0NBQUlVLFFBQVE2UixtQkFBbUIzZCxJQUFJNGQsU0FBSixDQUFjalIsT0FBTyxDQUFyQixFQUF3QkQsRUFBeEIsQ0FBbkIsQ0FBWjtBQUNBMU0sa0NBQU0yZCxtQkFBbUIzZCxJQUFJNGQsU0FBSixDQUFjLENBQWQsRUFBaUJqUixJQUFqQixDQUFuQixDQUFOO0FBQ0EsZ0NBQUksQ0FBQ2hILE9BQU8zRixHQUFQLENBQUwsRUFBa0IyRixPQUFPM0YsR0FBUCxJQUFjLEVBQWQ7QUFDbEIsZ0NBQUksQ0FBQzhMLEtBQUwsRUFBWW5HLE9BQU8zRixHQUFQLEVBQVlXLElBQVosQ0FBaUIwUixHQUFqQixFQUFaLEtBQ0sxTSxPQUFPM0YsR0FBUCxFQUFZOEwsS0FBWixJQUFxQnVHLEdBQXJCO0FBQ1I7QUFDSixxQkFoQkQ7QUFpQkg7QUFDSjtBQUNELG1CQUFPMU0sTUFBUDtBQUNIOztBQUVEOzs7Ozs7OzttQ0FLa0JrWSxLLEVBQU87QUFDckI7OztBQUdBLGdCQUFJO0FBQ0Esb0JBQUlwWixPQUFPb1osTUFBTTVVLFFBQU4sR0FBaUIyQixLQUFqQixDQUF1Qix1QkFBdkIsRUFBZ0QsQ0FBaEQsRUFBbUQxQixPQUFuRCxDQUEyRCxNQUEzRCxFQUFtRSxHQUFuRSxFQUF3RUEsT0FBeEUsQ0FBZ0Ysc0JBQWhGLEVBQXdHLE9BQXhHLEVBQWlIK0IsV0FBakgsRUFBWDtBQUNILGFBRkQsQ0FFRSxPQUFPbEosQ0FBUCxFQUFVO0FBQ1Isc0JBQU0sSUFBSXRDLEtBQUosQ0FBVSw0QkFBVixFQUF3Q3NDLENBQXhDLENBQU47QUFDSDtBQUNELGdCQUFJK1gsWUFBWWdFLGVBQVosQ0FBNEJyWixJQUE1QixNQUFzQyxLQUExQyxFQUFpRDtBQUM3QyxzQkFBTSxJQUFJaEYsS0FBSixDQUFVLDJDQUFWLENBQU47QUFDSDtBQUNELG1CQUFPZ0YsSUFBUDtBQUNIOztBQUVEOzs7Ozs7Ozs0Q0FLMkJBLEksRUFBTTtBQUM3QixtQkFBT3NZLFNBQVNDLGFBQVQsQ0FBdUJ2WSxJQUF2QixFQUE2QnVILFdBQTdCLEtBQTZDK1IsV0FBcEQ7QUFDSDs7QUFFRDs7Ozs7Ozs7c0NBS3FCRixLLEVBQU87QUFDeEIsZ0JBQU1wWixPQUFPcVYsWUFBWWtFLFVBQVosQ0FBdUJILEtBQXZCLENBQWI7QUFDQSxnQkFBSS9ELFlBQVltRSxtQkFBWixDQUFnQ3haLElBQWhDLE1BQTBDLEtBQTlDLEVBQXFEO0FBQ2pEb1osc0JBQU12YSxTQUFOLENBQWdCbUIsSUFBaEIsR0FBdUJBLElBQXZCO0FBQ0FzWSx5QkFBU21CLGVBQVQsQ0FBeUJ6WixJQUF6QixFQUErQm9aLEtBQS9CO0FBQ0g7QUFDRCxtQkFBT3BaLElBQVA7QUFDSDs7QUFFRDs7Ozs7Ozs7d0NBS3VCOEksRyxFQUFLO0FBQ3hCLG1CQUFPLGlCQUFnQm9QLElBQWhCLENBQXFCcFAsR0FBckI7QUFBUDtBQUNIOztBQUVEOzs7Ozs7O21DQUlrQjRRLFEsRUFBVTtBQUN4QixnQkFBSXJFLFlBQVlzRSxlQUFaLEtBQWdDdk4sU0FBcEMsRUFBK0M7QUFDM0NpSiw0QkFBWXNFLGVBQVosR0FBOEIsRUFBOUI7QUFDSDtBQUNEdEUsd0JBQVlzRSxlQUFaLENBQTRCemQsSUFBNUIsQ0FBaUN3ZCxRQUFqQztBQUNBLGdCQUFNRSxnQkFBZ0IsU0FBaEJBLGFBQWdCLEdBQU07QUFDeEI7OztBQUdBLG9CQUFJOVYsT0FBTytWLFFBQVAsQ0FBZ0JDLElBQWhCLElBQXdCekUsWUFBWTBFLE1BQXhDLEVBQWdEO0FBQzVDMUUsZ0NBQVlzRSxlQUFaLENBQTRCdEMsT0FBNUIsQ0FBb0MsVUFBU3FDLFFBQVQsRUFBa0I7QUFDbERBLGlDQUFTckUsWUFBWXNCLE1BQXJCO0FBQ0gscUJBRkQ7QUFHQXRCLGdDQUFZc0IsTUFBWixHQUFxQixLQUFyQjtBQUNIO0FBQ0R0Qiw0QkFBWTBFLE1BQVosR0FBcUJqVyxPQUFPK1YsUUFBUCxDQUFnQkMsSUFBckM7QUFDSCxhQVhEO0FBWUEsZ0JBQUloVyxPQUFPa1csWUFBUCxLQUF3QixJQUE1QixFQUFrQztBQUM5QmxXLHVCQUFPNlQsZ0JBQVAsQ0FBd0IsU0FBeEIsRUFBbUMsWUFBVTtBQUN6Q3RDLGdDQUFZc0IsTUFBWixHQUFxQixJQUFyQjtBQUNILGlCQUZEO0FBR0g7QUFDRDdTLG1CQUFPa1csWUFBUCxHQUFzQkosYUFBdEI7QUFDSDs7QUFFRDs7Ozs7Ozs7Ozt5Q0FPd0I1QixLLEVBQU9sQyxLLEVBQU94UixJLEVBQU07QUFDeEMsZ0JBQUlwRCxTQUFTbVUsWUFBWTRFLGdCQUFaLENBQTZCM1YsSUFBN0IsQ0FBYjtBQUNBLGdCQUFJNFYsS0FBSyxVQUFUO0FBQ0EsZ0JBQUlyQixVQUFVLEVBQWQ7QUFDQSxnQkFBSTFTLGNBQUo7QUFDQSxtQkFBT0EsUUFBUStULEdBQUdDLElBQUgsQ0FBUXJFLEtBQVIsQ0FBZixFQUErQjtBQUMzQitDLHdCQUFRM2MsSUFBUixDQUFhaUssTUFBTSxDQUFOLENBQWI7QUFDSDtBQUNELGdCQUFJNlIsVUFBVSxJQUFkLEVBQW9CO0FBQ2hCLG9CQUFJb0MsV0FBV3BDLE1BQU1tQyxJQUFOLENBQVc3VixJQUFYLENBQWY7QUFDQXVVLHdCQUFReEIsT0FBUixDQUFnQixVQUFVN0QsSUFBVixFQUFnQjZHLEdBQWhCLEVBQXFCO0FBQ2pDblosMkJBQU9zUyxJQUFQLElBQWU0RyxTQUFTQyxNQUFNLENBQWYsQ0FBZjtBQUNILGlCQUZEO0FBR0g7QUFDRCxtQkFBT25aLE1BQVA7QUFDSDs7QUFFRDs7Ozs7Ozt5Q0FJd0I7QUFDcEIsZ0JBQUlBLFNBQVM0QyxPQUFPK1YsUUFBUCxDQUFnQkMsSUFBaEIsQ0FBcUIzVCxLQUFyQixDQUEyQixRQUEzQixDQUFiO0FBQ0EsZ0JBQUlqRixXQUFXLElBQWYsRUFBcUI7QUFDakIsdUJBQU9BLE9BQU8sQ0FBUCxDQUFQO0FBQ0g7QUFDSjs7OztFQXpWNEJvWSxXOztBQTRWakNoQixTQUFTbUIsZUFBVCxDQUF5QixjQUF6QixFQUF5Q3BFLFdBQXpDOztBQUVBOzs7O0lBR2FpRixVLFdBQUFBLFU7Ozs7Ozs7Ozs7RUFBbUJoQixXOztBQUdoQ2hCLFNBQVNtQixlQUFULENBQXlCLGFBQXpCLEVBQXdDYSxVQUF4Qzs7QUFFQTs7OztJQUdNQyxZOzs7Ozs7Ozs7O0VBQXFCakIsVzs7QUFHM0JoQixTQUFTbUIsZUFBVCxDQUF5QixlQUF6QixFQUEwQ2MsWUFBMUM7O0FBR0E7Ozs7SUFHTUMsVTs7Ozs7Ozs7Ozs7MkNBQ2lCO0FBQUE7O0FBQ2YsaUJBQUs3QyxnQkFBTCxDQUFzQixPQUF0QixFQUErQixVQUFDak4sS0FBRCxFQUFXO0FBQ3RDLG9CQUFNcEcsT0FBTyxPQUFLbVIsWUFBTCxDQUFrQixNQUFsQixDQUFiO0FBQ0EvSyxzQkFBTStQLGNBQU47QUFDQSxvQkFBSW5XLFNBQVM4SCxTQUFiLEVBQXdCO0FBQ3BCdEksMkJBQU80VyxhQUFQLENBQXFCLElBQUlDLFdBQUosQ0FBZ0IsU0FBaEIsQ0FBckI7QUFDSDtBQUNEN1csdUJBQU8rVixRQUFQLENBQWdCZSxJQUFoQixHQUF1QnRXLElBQXZCO0FBQ0gsYUFQRDtBQVFIOzs7O0VBVm9CdVcsaUI7QUFZekI7Ozs7O0FBR0F2QyxTQUFTbUIsZUFBVCxDQUF5QixjQUF6QixFQUF5QztBQUNyQ3FCLGFBQVMsR0FENEI7QUFFckNqYyxlQUFXMmIsV0FBVzNiO0FBRmUsQ0FBekM7O0FBS0E7Ozs7Ozs7OztBQVNBLFNBQVNzWixZQUFULENBQXNCN1IsR0FBdEIsRUFBMkJ3UCxLQUEzQixFQUFrQ2tDLEtBQWxDLEVBQXlDMVQsSUFBekMsRUFBK0M7QUFDM0MsUUFBSXBELFNBQVMsRUFBYjtBQUNBLFNBQUssSUFBSTNGLEdBQVQsSUFBZ0IrSyxHQUFoQixFQUFxQjtBQUNqQixZQUFJQSxJQUFJb0IsY0FBSixDQUFtQm5NLEdBQW5CLENBQUosRUFBNkI7QUFDekIyRixtQkFBTzNGLEdBQVAsSUFBYytLLElBQUkvSyxHQUFKLENBQWQ7QUFDSDtBQUNKO0FBQ0QyRixXQUFPNFUsS0FBUCxHQUFlQSxLQUFmO0FBQ0E1VSxXQUFPb0QsSUFBUCxHQUFjQSxJQUFkO0FBQ0FwRCxXQUFPc1gsTUFBUCxHQUFnQm5ELFlBQVkwRixnQkFBWixDQUE2Qi9DLEtBQTdCLEVBQW9DbEMsS0FBcEMsRUFBMkN4UixJQUEzQyxDQUFoQjtBQUNBLFdBQU9wRCxNQUFQO0FBQ0gsQzs7Ozs7Ozs7O0FDcGFEO0FBQ0E7QUFDQTtBQUNBLElBQUk4WixNQUFNLG1CQUFBOVcsQ0FBUSxFQUFSLENBQVY7QUFDQSxJQUFJK1csY0FBYyxtQkFBQS9XLENBQVEsRUFBUixDQUFsQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLElBQUlnWCxhQUFhRixLQUFqQjs7QUFFQTtBQUNBLElBQUlHLFVBQVUsQ0FDWkQsV0FBVyxDQUFYLElBQWdCLElBREosRUFFWkEsV0FBVyxDQUFYLENBRlksRUFFR0EsV0FBVyxDQUFYLENBRkgsRUFFa0JBLFdBQVcsQ0FBWCxDQUZsQixFQUVpQ0EsV0FBVyxDQUFYLENBRmpDLEVBRWdEQSxXQUFXLENBQVgsQ0FGaEQsQ0FBZDs7QUFLQTtBQUNBLElBQUlFLFlBQVksQ0FBQ0YsV0FBVyxDQUFYLEtBQWlCLENBQWpCLEdBQXFCQSxXQUFXLENBQVgsQ0FBdEIsSUFBdUMsTUFBdkQ7O0FBRUE7QUFDQSxJQUFJRyxhQUFhLENBQWpCO0FBQUEsSUFBb0JDLGFBQWEsQ0FBakM7O0FBRUE7QUFDQSxTQUFTQyxFQUFULENBQVl0WSxPQUFaLEVBQXFCdVksR0FBckIsRUFBMEJDLE1BQTFCLEVBQWtDO0FBQ2hDLE1BQUkxZixJQUFJeWYsT0FBT0MsTUFBUCxJQUFpQixDQUF6QjtBQUNBLE1BQUl6VyxJQUFJd1csT0FBTyxFQUFmOztBQUVBdlksWUFBVUEsV0FBVyxFQUFyQjs7QUFFQSxNQUFJeVksV0FBV3pZLFFBQVF5WSxRQUFSLEtBQXFCdFAsU0FBckIsR0FBaUNuSixRQUFReVksUUFBekMsR0FBb0ROLFNBQW5FOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSU8sUUFBUTFZLFFBQVEwWSxLQUFSLEtBQWtCdlAsU0FBbEIsR0FBOEJuSixRQUFRMFksS0FBdEMsR0FBOEMsSUFBSWhULElBQUosR0FBV0MsT0FBWCxFQUExRDs7QUFFQTtBQUNBO0FBQ0EsTUFBSWdULFFBQVEzWSxRQUFRMlksS0FBUixLQUFrQnhQLFNBQWxCLEdBQThCbkosUUFBUTJZLEtBQXRDLEdBQThDTixhQUFhLENBQXZFOztBQUVBO0FBQ0EsTUFBSU8sS0FBTUYsUUFBUU4sVUFBVCxHQUF1QixDQUFDTyxRQUFRTixVQUFULElBQXFCLEtBQXJEOztBQUVBO0FBQ0EsTUFBSU8sS0FBSyxDQUFMLElBQVU1WSxRQUFReVksUUFBUixLQUFxQnRQLFNBQW5DLEVBQThDO0FBQzVDc1AsZUFBV0EsV0FBVyxDQUFYLEdBQWUsTUFBMUI7QUFDRDs7QUFFRDtBQUNBO0FBQ0EsTUFBSSxDQUFDRyxLQUFLLENBQUwsSUFBVUYsUUFBUU4sVUFBbkIsS0FBa0NwWSxRQUFRMlksS0FBUixLQUFrQnhQLFNBQXhELEVBQW1FO0FBQ2pFd1AsWUFBUSxDQUFSO0FBQ0Q7O0FBRUQ7QUFDQSxNQUFJQSxTQUFTLEtBQWIsRUFBb0I7QUFDbEIsVUFBTSxJQUFJNWdCLEtBQUosQ0FBVSxrREFBVixDQUFOO0FBQ0Q7O0FBRURxZ0IsZUFBYU0sS0FBYjtBQUNBTCxlQUFhTSxLQUFiO0FBQ0FSLGNBQVlNLFFBQVo7O0FBRUE7QUFDQUMsV0FBUyxjQUFUOztBQUVBO0FBQ0EsTUFBSUcsS0FBSyxDQUFDLENBQUNILFFBQVEsU0FBVCxJQUFzQixLQUF0QixHQUE4QkMsS0FBL0IsSUFBd0MsV0FBakQ7QUFDQTVXLElBQUVqSixHQUFGLElBQVMrZixPQUFPLEVBQVAsR0FBWSxJQUFyQjtBQUNBOVcsSUFBRWpKLEdBQUYsSUFBUytmLE9BQU8sRUFBUCxHQUFZLElBQXJCO0FBQ0E5VyxJQUFFakosR0FBRixJQUFTK2YsT0FBTyxDQUFQLEdBQVcsSUFBcEI7QUFDQTlXLElBQUVqSixHQUFGLElBQVMrZixLQUFLLElBQWQ7O0FBRUE7QUFDQSxNQUFJQyxNQUFPSixRQUFRLFdBQVIsR0FBc0IsS0FBdkIsR0FBZ0MsU0FBMUM7QUFDQTNXLElBQUVqSixHQUFGLElBQVNnZ0IsUUFBUSxDQUFSLEdBQVksSUFBckI7QUFDQS9XLElBQUVqSixHQUFGLElBQVNnZ0IsTUFBTSxJQUFmOztBQUVBO0FBQ0EvVyxJQUFFakosR0FBRixJQUFTZ2dCLFFBQVEsRUFBUixHQUFhLEdBQWIsR0FBbUIsSUFBNUIsQ0F6RGdDLENBeURFO0FBQ2xDL1csSUFBRWpKLEdBQUYsSUFBU2dnQixRQUFRLEVBQVIsR0FBYSxJQUF0Qjs7QUFFQTtBQUNBL1csSUFBRWpKLEdBQUYsSUFBUzJmLGFBQWEsQ0FBYixHQUFpQixJQUExQjs7QUFFQTtBQUNBMVcsSUFBRWpKLEdBQUYsSUFBUzJmLFdBQVcsSUFBcEI7O0FBRUE7QUFDQSxNQUFJM08sT0FBTzlKLFFBQVE4SixJQUFSLElBQWdCb08sT0FBM0I7QUFDQSxPQUFLLElBQUloVyxJQUFJLENBQWIsRUFBZ0JBLElBQUksQ0FBcEIsRUFBdUIsRUFBRUEsQ0FBekIsRUFBNEI7QUFDMUJILE1BQUVqSixJQUFJb0osQ0FBTixJQUFXNEgsS0FBSzVILENBQUwsQ0FBWDtBQUNEOztBQUVELFNBQU9xVyxNQUFNQSxHQUFOLEdBQVlQLFlBQVlqVyxDQUFaLENBQW5CO0FBQ0Q7O0FBRURqSSxPQUFPQyxPQUFQLEdBQWlCdWUsRUFBakIsQzs7Ozs7OztBQ3RHQTs7Ozs7UUFLZ0J2YSxTLEdBQUFBLFM7O0FBSmhCOzs7O0FBQ0E7Ozs7OztBQUdPLFNBQVNBLFNBQVQsQ0FBbUJyRyxPQUFuQixFQUE0QjtBQUMvQixXQUFRLENBQUNBLE9BQUYsR0FDUEUsUUFBUUUsTUFBUixDQUFlLElBQUlDLEtBQUosQ0FBVSxpQkFBVixDQUFmLENBRE8sR0FFUCxVQUFDNEYsR0FBRCxFQUFTO0FBQ0wsZUFBUSxDQUFDQSxHQUFGLEdBQ1AvRixRQUFRRSxNQUFSLENBQWUsSUFBSUMsS0FBSixDQUFVLGVBQVYsQ0FBZixDQURPLEdBRVAsVUFBQ0csT0FBRCxFQUFhO0FBQ1QsbUJBQVEsQ0FBQ0EsT0FBRixHQUNQTixRQUFRRSxNQUFSLENBQWUsSUFBSUMsS0FBSixDQUFVLGlCQUFWLENBQWYsQ0FETyxHQUVQLHdCQUFTTCxPQUFULEVBQ0NDLElBREQsQ0FDTSxVQUFDRCxPQUFELEVBQWE7QUFDZix1QkFBTyw2QkFBY0EsT0FBZCxFQUF1QlEsT0FBdkIsQ0FBUDtBQUNILGFBSEQsRUFJQ1AsSUFKRCxDQUlNLFVBQUNELE9BQUQsRUFBYTtBQUNmLHVCQUFPLElBQUlFLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDcEMsd0JBQUk7QUFDQSw0QkFBSWloQixZQUFZcGIsSUFBSStPLEdBQUosQ0FBUSxTQUFSLEVBQW1CbkksR0FBbkIsQ0FBdUIsRUFBQzdMLFNBQVNoQixPQUFWLEVBQXZCLENBQWhCO0FBQ0FHO0FBQ0gscUJBSEQsQ0FHRSxPQUFPNEYsS0FBUCxFQUFjO0FBQ1ozRiwrQkFBTzJGLEtBQVA7QUFDSDtBQUNKLGlCQVBNLENBQVA7QUFRSCxhQWJELENBRkE7QUFnQkgsU0FuQkQ7QUFvQkgsS0F2QkQ7QUF3QkgsQzs7Ozs7OztBQzlCRDs7Ozs7UUFXZ0J1YixhLEdBQUFBLGE7O0FBVGhCOztBQUNBOztBQUNBOztBQUVBLElBQU14WixZQUFZLFdBQWxCO0FBQ0EsSUFBTXJILFlBQVksV0FBbEI7QUFDQSxJQUFNZ0csYUFBYSxZQUFuQjtBQUNBLElBQU0vRixhQUFhLFlBQW5COztBQUVPLFNBQVM0Z0IsYUFBVCxDQUF1QnRoQixPQUF2QixFQUFnQztBQUNuQyxXQUFRLENBQUNBLE9BQUYsR0FDUEUsUUFBUUMsT0FBUixDQUFnQixFQUFoQixDQURPLEdBRVAsVUFBQ0ssT0FBRCxFQUFhO0FBQ1QsZUFBUSxDQUFDQSxPQUFGLEdBQ1BOLFFBQVFFLE1BQVIsQ0FBZSx3QkFBZixDQURPLEdBRVAsVUFBQ2MsWUFBRCxFQUFrQjtBQUNkLG1CQUFPLFVBQUN3RixRQUFELEVBQWM7QUFDakIsdUJBQU8sWUFBTTtBQUNULDJCQUFPLElBQUl4RyxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3BDLHdFQUFxQkosT0FBckIsRUFBOEJRLE9BQTlCLEVBQ0NQLElBREQsQ0FDTSx1QkFBZTtBQUNqQjhHLG9DQUFRQyxHQUFSLENBQVlDLFdBQVo7QUFDQSxnQ0FBSUEsZ0JBQWdCYSxTQUFwQixFQUErQjtBQUMzQjtBQUNBLGtFQUFjOUgsT0FBZCxFQUF1QlEsT0FBdkIsRUFBZ0NVLFlBQWhDLEVBQ0NqQixJQURELENBQ007QUFBQSwyQ0FBVUUsUUFBUW9HLE1BQVIsQ0FBVjtBQUFBLGlDQUROLEVBRUNyRSxLQUZELENBRU8sVUFBQzZELEtBQUQ7QUFBQSwyQ0FBVzNGLE9BQU8yRixLQUFQLENBQVg7QUFBQSxpQ0FGUDtBQUdILDZCQUxELE1BS08sSUFBSWtCLGdCQUFnQnZHLFVBQXBCLEVBQWdDO0FBQ25DO0FBQ0EsMEVBQWtCRixPQUFsQixFQUEyQlUsWUFBM0IsRUFBeUN3RixRQUF6QyxFQUFtRDFHLE9BQW5ELEVBQ0NDLElBREQsQ0FDTSxrQkFBVTtBQUNaOEcsNENBQVFDLEdBQVIsQ0FBWVQsTUFBWjtBQUNBcEcsNENBQVFvRyxNQUFSO0FBQ0gsaUNBSkQsRUFLQ3JFLEtBTEQsQ0FLTyxVQUFDNkQsS0FBRDtBQUFBLDJDQUFXM0YsT0FBTzJGLEtBQVAsQ0FBWDtBQUFBLGlDQUxQO0FBTUgsNkJBUk0sTUFRQTtBQUNINUY7QUFDSDtBQUNKLHlCQW5CRCxFQW9CQytCLEtBcEJELENBb0JPLFVBQUM1QixHQUFEO0FBQUEsbUNBQVNGLE9BQU9FLEdBQVAsQ0FBVDtBQUFBLHlCQXBCUDtBQXFCSCxxQkF0Qk0sQ0FBUDtBQXVCSCxpQkF4QkQ7QUF5QkgsYUExQkQ7QUEyQkgsU0E5QkQ7QUErQkgsS0FsQ0Q7QUFtQ0gsQzs7Ozs7OztBQy9DRDs7Ozs7UUFhZ0JpaEIsVSxHQUFBQSxVOztBQVhoQjs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQSxJQUFNelosWUFBWSxXQUFsQjtBQUNBLElBQU1ySCxZQUFZLFdBQWxCO0FBQ0EsSUFBTWdHLGFBQWEsWUFBbkI7QUFDQSxJQUFNL0YsYUFBYSxZQUFuQjs7QUFFTyxTQUFTNmdCLFVBQVQsQ0FBb0J2aEIsT0FBcEIsRUFBNkI7QUFDaEMsV0FBUSxDQUFDQSxPQUFGLEdBQ1BFLFFBQVFDLE9BQVIsQ0FBZ0IsRUFBaEIsQ0FETyxHQUVQLFVBQUNLLE9BQUQsRUFBYTtBQUNULGVBQVEsQ0FBQ0EsT0FBRixHQUNQTixRQUFRRSxNQUFSLENBQWUsd0JBQWYsQ0FETyxHQUVQLFVBQUNjLFlBQUQsRUFBa0I7QUFDZCxtQkFBTyxVQUFDd0YsUUFBRCxFQUFjO0FBQ2pCLHVCQUFPLFVBQUM4YSxLQUFELEVBQVc7QUFDZCwyQkFBTyxJQUFJdGhCLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDcEMsd0VBQXFCSixPQUFyQixFQUE4QlEsT0FBOUIsRUFDQ1AsSUFERCxDQUNNLHVCQUFlO0FBQ2pCLGdDQUFJZ0gsZ0JBQWdCeEcsU0FBcEIsRUFBK0I7QUFDM0Isa0ZBQXNCVCxPQUF0QixFQUErQlEsT0FBL0IsRUFBd0NVLFlBQXhDLEVBQ0NqQixJQURELENBQ00sVUFBQ3doQixTQUFELEVBQWU7QUFDakIsd0VBQWVBLFNBQWYsRUFBMEJELEtBQTFCLEVBQWlDaGhCLE9BQWpDLEVBQ0NQLElBREQsQ0FDTSxVQUFDc0csTUFBRCxFQUFZO0FBQ2RRLGdEQUFRQyxHQUFSLENBQVlULE1BQVo7QUFDQXBHLGdEQUFRb0csTUFBUjtBQUNILHFDQUpELEVBS0NyRSxLQUxELENBS08sVUFBQzZELEtBQUQ7QUFBQSwrQ0FBVzNGLE9BQU8yRixLQUFQLENBQVg7QUFBQSxxQ0FMUDtBQU1ILGlDQVJEO0FBU0g7QUFDRCxnQ0FBSWtCLGdCQUFnQlIsVUFBcEIsRUFBZ0M7QUFDNUIsb0VBQWV6RyxPQUFmLEVBQXdCUSxPQUF4QixFQUFpQ1UsWUFBakMsRUFDQ2pCLElBREQsQ0FDTTtBQUFBLDJDQUFVRSxRQUFRb0csTUFBUixDQUFWO0FBQUEsaUNBRE47QUFFSDtBQUNELGdDQUFJVSxnQkFBZ0JhLFNBQXBCLEVBQStCO0FBQzNCLGtFQUFjOUgsT0FBZCxFQUF1QlEsT0FBdkIsRUFBZ0NVLFlBQWhDLEVBQ0NqQixJQURELENBQ00sa0JBQVU7QUFDWjhHLDRDQUFRQyxHQUFSLENBQVlULE1BQVo7QUFDQXBHLDRDQUFRb0csTUFBUjtBQUNILGlDQUpEO0FBS0g7QUFDRCxnQ0FBSVUsZ0JBQWdCdkcsVUFBcEIsRUFBZ0M7QUFDNUIyRiwwQ0FBVXJHLE9BQVYsRUFBbUJpRyxHQUFuQixFQUF3QnpGLE9BQXhCLEVBQ0NQLElBREQsQ0FDTTtBQUFBLDJDQUFVRSxRQUFRb0csTUFBUixDQUFWO0FBQUEsaUNBRE47QUFFSDtBQUNKLHlCQTVCRCxFQTZCQ3JFLEtBN0JELENBNkJPLFVBQUM1QixHQUFEO0FBQUEsbUNBQVNGLE9BQU9FLEdBQVAsQ0FBVDtBQUFBLHlCQTdCUDtBQThCSCxxQkEvQk0sQ0FBUDtBQWdDSCxpQkFqQ0Q7QUFrQ0gsYUFuQ0Q7QUFvQ0gsU0F2Q0Q7QUF3Q0gsS0EzQ0Q7QUE0Q0gsQzs7Ozs7OztBQzFERDtBQUNBO0FBQ0E7Ozs7O1FBRWdCb2hCLE8sR0FBQUEsTztBQUFULFNBQVNBLE9BQVQsQ0FBaUJ6ZCxLQUFqQixFQUF3QjtBQUMzQixXQUFRLENBQUNBLEtBQUYsR0FDUC9ELFFBQVFFLE1BQVIsQ0FBZSxJQUFJQyxLQUFKLENBQVUsZUFBVixDQUFmLENBRE8sR0FFUCxJQUFJSCxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQzdCLFlBQUk7QUFDQSxnQkFBSTJMLElBQUk5SCxNQUFNNUMsTUFBZDtBQUFBLGdCQUFzQndKLENBQXRCO0FBQUEsZ0JBQXlCekosQ0FBekI7QUFDQSxtQkFBTzJLLENBQVAsRUFBVTtBQUNSM0ssb0JBQUlrSyxLQUFLQyxLQUFMLENBQVdELEtBQUtMLE1BQUwsS0FBZ0JjLEdBQTNCLENBQUo7QUFDQWxCLG9CQUFJNUcsTUFBTThILENBQU4sQ0FBSjtBQUNBOUgsc0JBQU04SCxDQUFOLElBQVc5SCxNQUFNN0MsQ0FBTixDQUFYO0FBQ0E2QyxzQkFBTTdDLENBQU4sSUFBV3lKLENBQVg7QUFDRDtBQUNEMUssb0JBQVE4RCxLQUFSO0FBQ0gsU0FURCxDQVNFLE9BQU04QixLQUFOLEVBQWE7QUFDWDNGLG1CQUFPMkYsS0FBUDtBQUNIO0FBQ0osS0FiRCxDQUZBO0FBZ0JILEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3JCRCxJQUFJNGIsaUJBQWlCLG1CQUFBcFksQ0FBUSxFQUFSLENBQXJCOztJQUNhcVksVyxXQUFBQSxXOzs7Ozs7Ozs7OzsyQ0FDVTtBQUNmLGlCQUFLbkcsU0FBTCxHQUFpQixRQUFRa0csY0FBUixHQUF5QixNQUExQztBQUNIOzs7O0VBSDRCaEQsVzs7QUFLakNoQixTQUFTbUIsZUFBVCxDQUF5QixjQUF6QixFQUF5QzhDLFdBQXpDLEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05BLElBQUlDLG1CQUFtQixtQkFBQXRZLENBQVEsRUFBUixDQUF2Qjs7SUFFYXVZLFEsV0FBQUEsUTs7Ozs7Ozs7Ozs7MkNBQ1U7QUFDZixpQkFBS3JHLFNBQUwsR0FBaUIsUUFBUW9HLGdCQUFSLEdBQTJCLE1BQTVDO0FBQ0g7Ozs7RUFIeUJsRCxXOztBQUs5QmhCLFNBQVNtQixlQUFULENBQXlCLFdBQXpCLEVBQXNDZ0QsUUFBdEM7QUFDQW5FLFNBQVNtQixlQUFULENBQXlCLGNBQXpCLEVBQXlDO0FBQ3JDNWEsZUFBV3lJLE9BQU9nQyxNQUFQLENBQWNnUSxZQUFZemEsU0FBMUIsRUFBcUMsRUFBRTZkLGlCQUFpQjtBQUMzRG5OLG1CQUFPLGlCQUFXO0FBQ1osb0JBQUl2TCxPQUFPLEtBQUtzUyxnQkFBTCxFQUFYO0FBQ0Esb0JBQUlxQyxXQUFXTCxTQUFTcUUsYUFBVCxDQUF1QixNQUFNLEtBQUtDLFdBQVgsSUFBMEIsSUFBakQsQ0FBZjtBQUNBLG9CQUFJQyxRQUFRdkUsU0FBU3dFLFVBQVQsQ0FBb0JuRSxTQUFTaGUsT0FBN0IsRUFBc0MsSUFBdEMsQ0FBWjtBQUNBLG9CQUFJb2lCLGdCQUFpQixLQUFLSixhQUFMLENBQW1CLE1BQW5CLENBQUQsR0FBK0IsS0FBS0EsYUFBTCxDQUFtQixNQUFuQixFQUEyQkssS0FBM0IsQ0FBaUNDLEtBQWhFLEdBQXVFLElBQTNGLENBQWlHLElBQUlGLGFBQUosRUFBbUI7QUFBRUYsMEJBQU1GLGFBQU4sQ0FBb0IsS0FBcEIsRUFBMkJLLEtBQTNCLENBQWlDRSxJQUFqQyxHQUF3QyxLQUFLUCxhQUFMLENBQW1CLE1BQW5CLEVBQTJCSyxLQUEzQixDQUFpQ0MsS0FBekU7QUFBaUYsa0JBQUVqWixLQUFLMFUsV0FBTCxDQUFpQm1FLEtBQWpCO0FBQzlNO0FBTjBEO0FBQW5CLEtBQXJDO0FBRDBCLENBQXpDLEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1JBLElBQUlNLGVBQWUsbUJBQUFqWixDQUFRLEVBQVIsQ0FBbkI7O0lBQ2FrWixTLFdBQUFBLFM7Ozs7Ozs7Ozs7OzJDQUNVO0FBQ2YsaUJBQUtoSCxTQUFMLHFCQUNLK0csWUFETDtBQUdIOzs7O0VBTDBCN0QsVzs7QUFPL0JoQixTQUFTbUIsZUFBVCxDQUF5QixZQUF6QixFQUF1QzJELFNBQXZDLEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1JBLElBQUlDLDBCQUEwQixtQkFBQW5aLENBQVEsRUFBUixDQUE5Qjs7SUFFYW9aLFcsV0FBQUEsVzs7Ozs7Ozs7Ozs7MkNBQ1U7QUFDZixpQkFBS2xILFNBQUwseUJBQ1NpSCx1QkFEVDtBQUdIOzs7O0VBTDRCL0QsVzs7QUFPakNoQixTQUFTbUIsZUFBVCxDQUF5QixjQUF6QixFQUF5QzZELFdBQXpDLEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1RBLElBQUlDLGNBQWMsbUJBQUFyWixDQUFRLEVBQVIsQ0FBbEI7O0lBRWFzWixRLFdBQUFBLFE7Ozs7Ozs7Ozs7OzJDQUNVO0FBQ2YsaUJBQUtwSCxTQUFMLEdBQWlCLFFBQVFtSCxXQUFSLEdBQXNCLE1BQXZDO0FBQ0g7Ozs7RUFIeUJqRSxXOztBQU05QmhCLFNBQVNtQixlQUFULENBQXlCLFdBQXpCLEVBQXNDK0QsUUFBdEMsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDUkEsSUFBSUMsaUJBQWlCLG1CQUFBdlosQ0FBUSxFQUFSLENBQXJCOztJQUNhd1osVyxXQUFBQSxXOzs7Ozs7Ozs7OzsyQ0FDVTtBQUNmLGlCQUFLdEgsU0FBTCxHQUFpQixRQUFRcUgsY0FBUixHQUF5QixNQUExQztBQUNIOzs7O0VBSDRCbkUsVzs7QUFLakNoQixTQUFTbUIsZUFBVCxDQUF5QixjQUF6QixFQUF5Q2lFLFdBQXpDLEU7Ozs7Ozs7OztBQ05BOzs7O0FBSUEsSUFBSUMsWUFBWSxFQUFoQjtBQUNBLEtBQUssSUFBSTVoQixJQUFJLENBQWIsRUFBZ0JBLElBQUksR0FBcEIsRUFBeUIsRUFBRUEsQ0FBM0IsRUFBOEI7QUFDNUI0aEIsWUFBVTVoQixDQUFWLElBQWUsQ0FBQ0EsSUFBSSxLQUFMLEVBQVl5SSxRQUFaLENBQXFCLEVBQXJCLEVBQXlCdVUsTUFBekIsQ0FBZ0MsQ0FBaEMsQ0FBZjtBQUNEOztBQUVELFNBQVNrQyxXQUFULENBQXFCTyxHQUFyQixFQUEwQkMsTUFBMUIsRUFBa0M7QUFDaEMsTUFBSTFmLElBQUkwZixVQUFVLENBQWxCO0FBQ0EsTUFBSW1DLE1BQU1ELFNBQVY7QUFDQSxTQUFRQyxJQUFJcEMsSUFBSXpmLEdBQUosQ0FBSixJQUFnQjZoQixJQUFJcEMsSUFBSXpmLEdBQUosQ0FBSixDQUFoQixHQUNBNmhCLElBQUlwQyxJQUFJemYsR0FBSixDQUFKLENBREEsR0FDZ0I2aEIsSUFBSXBDLElBQUl6ZixHQUFKLENBQUosQ0FEaEIsR0FDZ0MsR0FEaEMsR0FFQTZoQixJQUFJcEMsSUFBSXpmLEdBQUosQ0FBSixDQUZBLEdBRWdCNmhCLElBQUlwQyxJQUFJemYsR0FBSixDQUFKLENBRmhCLEdBRWdDLEdBRmhDLEdBR0E2aEIsSUFBSXBDLElBQUl6ZixHQUFKLENBQUosQ0FIQSxHQUdnQjZoQixJQUFJcEMsSUFBSXpmLEdBQUosQ0FBSixDQUhoQixHQUdnQyxHQUhoQyxHQUlBNmhCLElBQUlwQyxJQUFJemYsR0FBSixDQUFKLENBSkEsR0FJZ0I2aEIsSUFBSXBDLElBQUl6ZixHQUFKLENBQUosQ0FKaEIsR0FJZ0MsR0FKaEMsR0FLQTZoQixJQUFJcEMsSUFBSXpmLEdBQUosQ0FBSixDQUxBLEdBS2dCNmhCLElBQUlwQyxJQUFJemYsR0FBSixDQUFKLENBTGhCLEdBTUE2aEIsSUFBSXBDLElBQUl6ZixHQUFKLENBQUosQ0FOQSxHQU1nQjZoQixJQUFJcEMsSUFBSXpmLEdBQUosQ0FBSixDQU5oQixHQU9BNmhCLElBQUlwQyxJQUFJemYsR0FBSixDQUFKLENBUEEsR0FPZ0I2aEIsSUFBSXBDLElBQUl6ZixHQUFKLENBQUosQ0FQeEI7QUFRRDs7QUFFRGdCLE9BQU9DLE9BQVAsR0FBaUJpZSxXQUFqQixDOzs7Ozs7Ozs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJRCxHQUFKOztBQUVBLElBQUk2QyxTQUFTNVosT0FBTzRaLE1BQVAsSUFBaUI1WixPQUFPNlosUUFBckMsQyxDQUErQztBQUMvQyxJQUFJRCxVQUFVQSxPQUFPRSxlQUFyQixFQUFzQztBQUNwQztBQUNBLE1BQUlDLFFBQVEsSUFBSUMsVUFBSixDQUFlLEVBQWYsQ0FBWjtBQUNBakQsUUFBTSxTQUFTa0QsU0FBVCxHQUFxQjtBQUN6QkwsV0FBT0UsZUFBUCxDQUF1QkMsS0FBdkI7QUFDQSxXQUFPQSxLQUFQO0FBQ0QsR0FIRDtBQUlEOztBQUVELElBQUksQ0FBQ2hELEdBQUwsRUFBVTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBS21ELE9BQU8sSUFBSTFmLEtBQUosQ0FBVSxFQUFWLENBQVo7QUFDQXVjLFFBQU0sZUFBVztBQUNmLFNBQUssSUFBSWpmLElBQUksQ0FBUixFQUFXc0ssQ0FBaEIsRUFBbUJ0SyxJQUFJLEVBQXZCLEVBQTJCQSxHQUEzQixFQUFnQztBQUM5QixVQUFJLENBQUNBLElBQUksSUFBTCxNQUFlLENBQW5CLEVBQXNCc0ssSUFBSUosS0FBS0wsTUFBTCxLQUFnQixXQUFwQjtBQUN0QnVZLFdBQUtwaUIsQ0FBTCxJQUFVc0ssT0FBTyxDQUFDdEssSUFBSSxJQUFMLEtBQWMsQ0FBckIsSUFBMEIsSUFBcEM7QUFDRDs7QUFFRCxXQUFPb2lCLElBQVA7QUFDRCxHQVBEO0FBUUQ7O0FBRURwaEIsT0FBT0MsT0FBUCxHQUFpQmdlLEdBQWpCLEM7Ozs7Ozs7Ozs7QUNoQ0FqZSxPQUFPQyxPQUFQLEdBQWlCLFVBQVNELE1BQVQsRUFBaUI7QUFDakMsS0FBRyxDQUFDQSxPQUFPcWhCLGVBQVgsRUFBNEI7QUFDM0JyaEIsU0FBT3NoQixTQUFQLEdBQW1CLFlBQVcsQ0FBRSxDQUFoQztBQUNBdGhCLFNBQU91aEIsS0FBUCxHQUFlLEVBQWY7QUFDQTtBQUNBLE1BQUcsQ0FBQ3ZoQixPQUFPa1osUUFBWCxFQUFxQmxaLE9BQU9rWixRQUFQLEdBQWtCLEVBQWxCO0FBQ3JCM08sU0FBT2lYLGNBQVAsQ0FBc0J4aEIsTUFBdEIsRUFBOEIsUUFBOUIsRUFBd0M7QUFDdkN5aEIsZUFBWSxJQUQyQjtBQUV2QzdPLFFBQUssZUFBVztBQUNmLFdBQU81UyxPQUFPOEksQ0FBZDtBQUNBO0FBSnNDLEdBQXhDO0FBTUF5QixTQUFPaVgsY0FBUCxDQUFzQnhoQixNQUF0QixFQUE4QixJQUE5QixFQUFvQztBQUNuQ3loQixlQUFZLElBRHVCO0FBRW5DN08sUUFBSyxlQUFXO0FBQ2YsV0FBTzVTLE9BQU9oQixDQUFkO0FBQ0E7QUFKa0MsR0FBcEM7QUFNQWdCLFNBQU9xaEIsZUFBUCxHQUF5QixDQUF6QjtBQUNBO0FBQ0QsUUFBT3JoQixNQUFQO0FBQ0EsQ0FyQkQsQzs7Ozs7OztBQ0FBO0FBQ0E7QUFDQTs7QUFLQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFJQTs7QUFHQTs7QUFHQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUE1Q0EsSUFBTTBoQixTQUFTLG1CQUFBdmEsQ0FBUSxFQUFSLENBQWY7QUFDQUosT0FBTzJhLE1BQVAsR0FBZ0JBLE1BQWhCOztBQUdBM2EsT0FBT21ZLGFBQVA7O0FBRUFuWSxPQUFPb1ksVUFBUDs7QUFFQXBZLE9BQU81SSxvQkFBUDs7QUFFQTRJLE9BQU90QixnQkFBUDs7QUFFQXNCLE9BQU9ULHFCQUFQOztBQUVBUyxPQUFPbEIsZ0JBQVA7O0FBRUFrQixPQUFPM0MsaUJBQVA7O0FBRUEyQyxPQUFPMUgsYUFBUDs7QUFFQTBILE9BQU9MLGNBQVA7O0FBRUFLLE9BQU9sSSxjQUFQOztBQUVBa0ksT0FBT2hDLHdCQUFQOztBQUVBZ0MsT0FBT3VZLE9BQVA7O0FBRUF2WSxPQUFPOUMsU0FBUDs7QUFFQThDLE9BQU9uRCxjQUFQOztBQUVBOzs7QUFHQTs7O0FBR0EsMEU7Ozs7Ozs7QUMxQ0E7Ozs7O2tCQUd3QitkLFM7O0FBRHhCOzs7Ozs7QUFDZSxTQUFTQSxTQUFULENBQW1CL2pCLE9BQW5CLEVBQTRCO0FBQ3ZDLFdBQVEsQ0FBQ0EsT0FBRixHQUNQO0FBQUEsZUFBTSx3QkFBU0EsT0FBVCxDQUFOO0FBQUEsS0FETyxHQUVQLFVBQUNRLE9BQUQsRUFBYTtBQUNULGVBQVEsQ0FBQ0EsT0FBRixHQUNQTixRQUFRRSxNQUFSLENBQWUsSUFBSUMsS0FBSixDQUFVLGlCQUFWLENBQWYsQ0FETyxHQUVQLElBQUlILE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDN0IsZ0JBQUlPLGlCQUFpQkgsUUFBUUksR0FBUixDQUFZQyxXQUFaLENBQXdCYixPQUF4QixDQUFyQjtBQUNBLGdCQUFJVyxlQUFlRyxJQUFmLENBQW9CLENBQXBCLENBQUosRUFBNEI7QUFDeEJWLHVCQUFPLElBQUlDLEtBQUosQ0FBVSxTQUFWLENBQVA7QUFDSCxhQUZELE1BRU87QUFDSEYsd0JBQVFILE9BQVI7QUFDSDtBQUNKLFNBUEQsQ0FGQTtBQVVILEtBYkQ7QUFjSCxFOzs7Ozs7O0FDbEJEOzs7OztrQkFLd0Jna0IsYTs7QUFIeEI7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFDZSxTQUFTQSxhQUFULENBQXVCaGtCLE9BQXZCLEVBQWdDO0FBQzNDLFdBQVEsQ0FBQ0EsT0FBRixHQUNQO0FBQUEsZUFBTSx3QkFBU0EsT0FBVCxDQUFOO0FBQUEsS0FETyxHQUVQLFVBQUNRLE9BQUQsRUFBYTtBQUNULGVBQVEsQ0FBQ0EsT0FBRixHQUNQTixRQUFRRSxNQUFSLENBQWUsSUFBSUMsS0FBSixDQUFVLGlCQUFWLENBQWYsQ0FETyxHQUVQLElBQUlILE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDN0IsZ0JBQUk7QUFDQSw0Q0FBYUosT0FBYixFQUFzQlEsT0FBdEIsRUFDQ1AsSUFERCxDQUNNLFlBQU07QUFDUiwyQkFBTyx5QkFBVUQsT0FBVixFQUFtQlEsT0FBbkIsQ0FBUDtBQUNILGlCQUhELEVBSUNQLElBSkQsQ0FJTSxZQUFNO0FBQ1JFLDRCQUFRSCxPQUFSO0FBQ0gsaUJBTkQsRUFPQ2tDLEtBUEQsQ0FPTyxVQUFDNkQsS0FBRCxFQUFXO0FBQ2Q1Riw0QkFBUUgsT0FBUjtBQUNILGlCQVREO0FBVUgsYUFYRCxDQVdFLE9BQU9NLEdBQVAsRUFBWTtBQUNWRix1QkFBTyxJQUFJQyxLQUFKLENBQVcsb0JBQVgsQ0FBUDtBQUNIO0FBQ0osU0FmRCxDQUZBO0FBa0JILEtBckJEO0FBc0JILEU7Ozs7Ozs7QUM1QkQ7Ozs7O2tCQUV3QjRqQixZO0FBQVQsU0FBU0EsWUFBVCxDQUFzQmprQixPQUF0QixFQUErQjtBQUMxQyxXQUFPLElBQUlFLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDcEMsWUFBSTtBQUNBLGdCQUFHLE9BQU9KLE9BQUQsQ0FBVTZKLFFBQVYsRUFBTixLQUErQixXQUFsQyxFQUErQztBQUMzQzFKLHdCQUFRSCxPQUFSO0FBQ0g7QUFDSixTQUpELENBS0EsT0FBTU0sR0FBTixFQUFXO0FBQ1BGLG1CQUFPLElBQUlDLEtBQUosQ0FBVSxtQkFBVixDQUFQO0FBQ0g7QUFDSixLQVRNLENBQVA7QUFVSCxFOzs7Ozs7QUNiRCxxZTs7Ozs7O0FDQUEsc0xBQXNMLDRFQUE0RSw0RUFBNEUsNEVBQTRFLDRFQUE0RSw0RUFBNEUsNEVBQTRFLDRFQUE0RSw0RUFBNEUsNEVBQTRFLDZFQUE2RSw0RUFBNEUsNEVBQTRFLCtGQUErRiwwRUFBMEUsMEVBQTBFLDBFQUEwRSwwRUFBMEUsMEVBQTBFLDBFQUEwRSwwRUFBMEUsMEVBQTBFLDBFQUEwRSwyRUFBMkUsMEVBQTBFLDBFQUEwRSw4RkFBOEYseUVBQXlFLHlFQUF5RSx5RUFBeUUseUVBQXlFLHlFQUF5RSx5RUFBeUUseUVBQXlFLHlFQUF5RSx5RUFBeUUsMEVBQTBFLHlFQUF5RSx5RUFBeUUsZ0dBQWdHLDJFQUEyRSwyRUFBMkUsMkVBQTJFLDJFQUEyRSwyRUFBMkUsMkVBQTJFLDJFQUEyRSwyRUFBMkUsMkVBQTJFLDRFQUE0RSwyRUFBMkUsMkVBQTJFLG1HQUFtRyw0REFBNEQsZ0VBQWdFLFlBQVksMkJBQTJCLGlCQUFpQiwyQ0FBMkMscUJBQXFCLGtCQUFrQiwyQ0FBMkMscUJBQXFCLGtCQUFrQiwyQ0FBMkMscUJBQXFCLGtCQUFrQiwyQ0FBMkMscUJBQXFCLGtCQUFrQiwyQ0FBMkMscUJBQXFCLGtCQUFrQiwyQ0FBMkMscUJBQXFCLGtCQUFrQiwyQ0FBMkMscUJBQXFCLGtCQUFrQiwyQ0FBMkMscUJBQXFCLGtCQUFrQiwyQ0FBMkMscUJBQXFCLGtCQUFrQiw0Q0FBNEMsc0JBQXNCLGtCQUFrQiwyQ0FBMkMscUJBQXFCLGtCQUFrQiwyQ0FBMkMscUJBQXFCLGtCQUFrQiwyQ0FBMkMscUJBQXFCLGtCQUFrQiwyQ0FBMkMsbUJBQW1CLGtCQUFrQiwyQ0FBMkMsbUJBQW1CLGtCQUFrQiwyQ0FBMkMsbUJBQW1CLGtCQUFrQiwyQ0FBMkMsbUJBQW1CLGtCQUFrQiwyQ0FBMkMsbUJBQW1CLGtCQUFrQiwyQ0FBMkMsbUJBQW1CLGtCQUFrQiwyQ0FBMkMsbUJBQW1CLGtCQUFrQiwyQ0FBMkMsbUJBQW1CLGtCQUFrQiwyQ0FBMkMsbUJBQW1CLGtCQUFrQiw0Q0FBNEMsb0JBQW9CLGtCQUFrQiwyQ0FBMkMsbUJBQW1CLGtCQUFrQiwyQ0FBMkMsbUJBQW1CLGtCQUFrQiwyQ0FBMkMsbUJBQW1CLGtCQUFrQiwwQ0FBMEMsbUJBQW1CLGtCQUFrQiwwQ0FBMEMsbUJBQW1CLGtCQUFrQiwwQ0FBMEMsbUJBQW1CLGtCQUFrQiwwQ0FBMEMsbUJBQW1CLGtCQUFrQiwwQ0FBMEMsbUJBQW1CLGtCQUFrQiwwQ0FBMEMsbUJBQW1CLGtCQUFrQiwwQ0FBMEMsbUJBQW1CLGtCQUFrQiwwQ0FBMEMsbUJBQW1CLGtCQUFrQiwwQ0FBMEMsbUJBQW1CLGtCQUFrQiwyQ0FBMkMsb0JBQW9CLGtCQUFrQiwwQ0FBMEMsbUJBQW1CLGtCQUFrQiwwQ0FBMEMsbUJBQW1CLGtCQUFrQiwwQ0FBMEMsbUJBQW1CLGtCQUFrQiwwQ0FBMEMscUJBQXFCLGtCQUFrQiwwQ0FBMEMscUJBQXFCLGtCQUFrQiwwQ0FBMEMscUJBQXFCLGtCQUFrQiwwQ0FBMEMscUJBQXFCLGtCQUFrQiwwQ0FBMEMscUJBQXFCLGtCQUFrQiwwQ0FBMEMscUJBQXFCLGtCQUFrQiwwQ0FBMEMscUJBQXFCLGtCQUFrQiwwQ0FBMEMscUJBQXFCLGtCQUFrQiwwQ0FBMEMscUJBQXFCLGtCQUFrQiwyQ0FBMkMsc0JBQXNCLGtCQUFrQiwwQ0FBMEMscUJBQXFCLGtCQUFrQiwwQ0FBMEMscUJBQXFCLGtCQUFrQiwwQ0FBMEMscUJBQXFCLFlBQVksd0VBQXdFLHVEQUF1RCx1QkFBdUIsK0NBQStDLHVDQUF1QyxvREFBb0Qsd1ZBQXdWLHNEQUFzRCxnREFBZ0QsMkJBQTJCLHVCQUF1QixtQkFBbUIsY0FBYyw2Q0FBNkMsbUJBQW1CLGVBQWUsWUFBWSxnQ0FBZ0MsdURBQXVELHVCQUF1QiwrQ0FBK0Msc0NBQXNDLG9EQUFvRCw0RUFBNEUsbUNBQW1DLHlHQUF5RyxtRkFBbUYsMEhBQTBILHVFQUF1RSxxSkFBcUosaUZBQWlGLHdHQUF3Ryx1RkFBdUYscUdBQXFHLGlSQUFpUiwwRUFBMEUsbURBQW1ELGdEQUFnRCwyQ0FBMkMsd0VBQXdFLHVDQUF1QyxvQ0FBb0MsNEpBQTRKLCtCQUErQixjQUFjLDhDQUE4Qyw4Q0FBOEMsMkJBQTJCLDhDQUE4QyxzREFBc0Qsa0RBQWtELDJCQUEyQix1QkFBdUIsbUJBQW1CLGNBQWMsNkNBQTZDLG1CQUFtQixlQUFlLFlBQVksa0NBQWtDLGdGQUFnRix5Q0FBeUMsb0NBQW9DLGVBQWUsWUFBWSxrQ0FBa0MsOEJBQThCLElBQUksR0FBRyxvQ0FBb0MsSUFBSSxHQUFHLFdBQVcsbUQ7Ozs7OztBQ0FsaFksbTIvRUFBbTIvRSxrRkFBa0YseUpBQXlKLCtHQUErRywrR0FBK0csK0dBQStHLCtHQUErRywrR0FBK0csK0dBQStHLCtHQUErRywrR0FBK0csK0dBQStHLGdIQUFnSCwrR0FBK0csK0dBQStHLDJIQUEySCw4RkFBOEYsOEZBQThGLDhGQUE4Riw4RkFBOEYsOEZBQThGLDhGQUE4Riw4RkFBOEYsOEZBQThGLDhGQUE4RiwrRkFBK0YsOEZBQThGLDhGQUE4RiwwSEFBMEgsNkZBQTZGLDZGQUE2Riw2RkFBNkYsNkZBQTZGLDZGQUE2Riw2RkFBNkYsNkZBQTZGLDZGQUE2Riw2RkFBNkYsOEZBQThGLDZGQUE2Riw2RkFBNkYsNEhBQTRILCtGQUErRiwrRkFBK0YsK0ZBQStGLCtGQUErRiwrRkFBK0YsK0ZBQStGLCtGQUErRiwrRkFBK0YsK0ZBQStGLGdHQUFnRywrRkFBK0YsK0ZBQStGLG9FOzs7Ozs7QUNBL2lxRixpQzs7Ozs7O0FDQUEsZ0hBQWdILG9FQUFvRSwrQkFBK0IsaUNBQWlDLGdDQUFnQywyR0FBMkcsYUFBYSxxQkFBcUIsbUNBQW1DLGtEQUFrRCwyaEJBQTJoQix5Qjs7Ozs7O0FDQWpoQyxrNkQiLCJmaWxlIjoicm95YWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAzMSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMTkwMGUzNWZlNGJkMGUxM2EwNGUiLCIndXNlIHN0cmljdCc7XG5pbXBvcnQgbm90VW5kZWZpbmVkIGZyb20gJy4uLy4uL3NyYy9saWIvbm90VW5kZWZpbmVkLmpzJztcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG5vdEVtcHR5KGNvbnRlbnQpIHtcbiAgICByZXR1cm4gbm90VW5kZWZpbmVkKGNvbnRlbnQpXG4gICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZihjb250ZW50ICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ2VtcHR5IGNvbnRlbnQnKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSk7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xpYi9ub3RFbXB0eS5qcyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtkZXRlcm1pbmVLZXlUeXBlfSBmcm9tICcuL2RldGVybWluZUtleVR5cGUuanMnO1xuXG5leHBvcnQgZnVuY3Rpb24gZGV0ZXJtaW5lQ29udGVudFR5cGUoY29udGVudCkge1xuICAgIC8vIHVzYWdlOiBkZXRlcm1pbmVDb250ZW50VHlwZShjb250ZW50KShvcGVucGdwKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpXG4gICAgcmV0dXJuICghY29udGVudCkgP1xuICAgIFByb21pc2UucmVzb2x2ZSgnJyk6XG4gICAgKG9wZW5wZ3ApID0+IHtcbiAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBDTEVBUlRFWFQgPSAnY2xlYXJ0ZXh0JztcbiAgICAgICAgICAgIGNvbnN0IFBHUE1FU1NBR0UgPSAnUEdQTWVzc2FnZSc7XG4gICAgICAgICAgICBsZXQgcG9zc2libGVwZ3BrZXkgPSBvcGVucGdwLmtleS5yZWFkQXJtb3JlZChjb250ZW50KTtcbiAgICAgICAgICAgIGlmIChwb3NzaWJsZXBncGtleS5rZXlzWzBdKSB7XG4gICAgICAgICAgICAgICAgZGV0ZXJtaW5lS2V5VHlwZShjb250ZW50KShvcGVucGdwKVxuICAgICAgICAgICAgICAgIC50aGVuKChrZXlUeXBlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoa2V5VHlwZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5wZ3AubWVzc2FnZS5yZWFkQXJtb3JlZChjb250ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShQR1BNRVNTQUdFKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShDTEVBUlRFWFQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGliL2RldGVybWluZUNvbnRlbnRUeXBlLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RnJvbVN0b3JhZ2UobG9jYWxTdG9yYWdlKSB7XG4gICAgLy8gdXNhZ2U6IGdldEZyb21TdG9yYWdlKGxvY2FsU3RvcmFnZSkoW2tleV0pLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbiAgICByZXR1cm4gKCFsb2NhbFN0b3JhZ2UpID9cbiAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgbG9jYWxTdG9yYWdlJyk6XG4gICAgKGluZGV4S2V5KSA9PiB7XG4gICAgICAgIHJldHVybiAoIWluZGV4S2V5KSA/XG4gICAgICAgIC8vIG5vIGluZGV4IC0+IHJldHVybiBldmVyeXRoaW5nXG4gICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbGV0IGkgPSBsb2NhbFN0b3JhZ2UubGVuZ3RoXG4gICAgICAgICAgICAgICAgbGV0IGtleUFyciA9IFtdXG4gICAgICAgICAgICAgICAgd2hpbGUgKGkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICBpID0gaSAtIDFcbiAgICAgICAgICAgICAgICAgICAga2V5QXJyLnB1c2gobG9jYWxTdG9yYWdlLmdldEl0ZW0obG9jYWxTdG9yYWdlLmtleShpKSkpXG4gICAgICAgICAgICAgICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGtleUFycilcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTpcbiAgICAgICAgLy8gaW5kZXggcHJvdmlkZWQgLT4gcmV0dXJuIG9uZVxuICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUobG9jYWxTdG9yYWdlLmdldEl0ZW0oaW5kZXhLZXkpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xpYi9nZXRGcm9tU3RvcmFnZS5qcyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtnZXRGcm9tU3RvcmFnZX0gZnJvbSAnLi9nZXRGcm9tU3RvcmFnZSc7XG5pbXBvcnQge2RldGVybWluZUNvbnRlbnRUeXBlfSBmcm9tICcuL2RldGVybWluZUNvbnRlbnRUeXBlJztcbmltcG9ydCBub3RFbXB0eSBmcm9tICcuLi8uLi9zcmMvbGliL25vdEVtcHR5LmpzJztcbmltcG9ydCBub3RDbGVhcnRleHQgZnJvbSAnLi4vLi4vc3JjL2xpYi9ub3RDbGVhcnRleHQuanMnO1xuaW1wb3J0IG5vdFBHUFByaXZrZXkgZnJvbSAnLi4vLi4vc3JjL2xpYi9ub3RQR1BQcml2a2V5LmpzJztcbmltcG9ydCBub3RQR1BNZXNzYWdlIGZyb20gJy4uLy4uL3NyYy9saWIvbm90UEdQTWVzc2FnZS5qcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlUEdQUHVia2V5KFBHUGtleUFybW9yKSB7XG4gICAgLy8gc2F2ZSBwdWJsaWMga2V5IHRvIHN0b3JhZ2Ugb25seSBpZiBpdCBkb2Vzbid0IG92ZXJ3cml0ZSBhIHByaXZhdGUga2V5XG4gICAgLy8gdXNhZ2U6IHNhdmVQR1BQdWJrZXkoY29udGVudCkob3BlbnBncCkobG9jYWxTdG9yYWdlKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpXG4gICAgcmV0dXJuICghUEdQa2V5QXJtb3IpID9cbiAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgUEdQa2V5QXJtb3InKTpcbiAgICAob3BlbnBncCkgPT4ge1xuICAgICAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBvcGVucGdwJyk6XG4gICAgICAgIChsb2NhbFN0b3JhZ2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoIWxvY2FsU3RvcmFnZSkgP1xuICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIGxvY2FsU3RvcmFnZScpOlxuICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBQR1BrZXkgPSBvcGVucGdwLmtleS5yZWFkQXJtb3JlZChQR1BrZXlBcm1vcik7XG4gICAgICAgICAgICAgICAgbm90RW1wdHkoUEdQa2V5QXJtb3IpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gbm90Q2xlYXJ0ZXh0KFBHUGtleUFybW9yKShvcGVucGdwKSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiBub3RQR1BQcml2a2V5KFBHUGtleUFybW9yKShvcGVucGdwKSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiBub3RQR1BNZXNzYWdlKFBHUGtleUFybW9yKShvcGVucGdwKSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiBnZXRGcm9tU3RvcmFnZShsb2NhbFN0b3JhZ2UpKFBHUGtleS5rZXlzWzBdLnVzZXJzWzBdLnVzZXJJZC51c2VyaWQpKVxuICAgICAgICAgICAgICAgIC50aGVuKGV4aXN0aW5nS2V5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICghZXhpc3RpbmdLZXkpID9cbiAgICAgICAgICAgICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCdub25lJykgOlxuICAgICAgICAgICAgICAgICAgICBkZXRlcm1pbmVDb250ZW50VHlwZShleGlzdGluZ0tleSkob3BlbnBncCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihleGlzdGluZ0tleVR5cGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RpbmdLZXlUeXBlID09PSAnUEdQUHJpdmtleScpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgncHVia2V5IGlnbm9yZWQgWC0gYXR0ZW1wdGVkIG92ZXJ3cml0ZSBwcml2a2V5JylcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFBHUGtleS5rZXlzWzBdLnVzZXJzWzBdLnVzZXJJZC51c2VyaWQsIFBHUGtleUFybW9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShgcHVibGljIHBncCBrZXkgc2F2ZWQgPC0gJHtQR1BrZXkua2V5c1swXS51c2Vyc1swXS51c2VySWQudXNlcmlkfWApXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiByZWplY3QoZXJyKSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGliL3NhdmVQR1BQdWJrZXkuanMiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9wcm9jZXNzL2Jyb3dzZXIuanMiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBub3RFbXB0eSBmcm9tICcuLi8uLi9zcmMvbGliL25vdEVtcHR5LmpzJztcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG5vdFBHUFByaXZrZXkoY29udGVudCkge1xuICAgIHJldHVybiAoIWNvbnRlbnQpID9cbiAgICAoKSA9PiBub3RFbXB0eShjb250ZW50KTpcbiAgICAob3BlbnBncCkgPT4ge1xuICAgICAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignbWlzc2luZyBvcGVucGdwJykpOlxuICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxldCBwZ3BLZXkgPSBvcGVucGdwLmtleS5yZWFkQXJtb3JlZChjb250ZW50KS5rZXlzWzBdO1xuICAgICAgICAgICAgICAgIGlmIChwZ3BLZXkudG9QdWJsaWMoKS5hcm1vcigpICE9PSBwZ3BLZXkuYXJtb3IoKSkge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdQR1AgUHJpdmtleSBjb250ZW50JykpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY29udGVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShjb250ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvbm90UEdQUHJpdmtleS5qcyIsIid1c2Ugc3RyaWN0JztcbmltcG9ydCBub3RFbXB0eSBmcm9tICcuLi8uLi9zcmMvbGliL25vdEVtcHR5LmpzJztcbmltcG9ydCBub3RQR1BQcml2a2V5IGZyb20gJy4uLy4uL3NyYy9saWIvbm90UEdQUHJpdmtleS5qcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBicm9hZGNhc3RNdWx0aShjb250ZW50KSB7XG4gICAgcmV0dXJuICghY29udGVudCkgP1xuICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignbWlzc2luZyBjb250ZW50JykpIDpcbiAgICAoZ3VuKSA9PiB7XG4gICAgICAgIHJldHVybiAoIWd1bikgP1xuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ21pc3NpbmcgZ3VuZGInKSkgOlxuICAgICAgICAob3BlbnBncCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdtaXNzaW5nIG9wZW5wZ3AnKSkgOlxuICAgICAgICAgICAgbm90RW1wdHkoY29udGVudClcbiAgICAgICAgICAgIC50aGVuKChjb250ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vdFBHUFByaXZrZXkoY29udGVudCkob3BlbnBncClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoY29udGVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpZCA9ICdyb3lhbGUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJyb2FkY2FzdFF1ZXVlID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50Lm1hcCgobWVzc2FnZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyb2FkY2FzdFF1ZXVlLnB1c2goYnJvYWRjYXN0KG1lc3NhZ2UpKGd1bikob3BlbnBncCkpXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgUHJvbWlzZS5hbGwoYnJvYWRjYXN0UXVldWUsIChyZXN1bHQpID0+IHJlc29sdmUocmVzdWx0KSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGliL2Jyb2FkY2FzdE11bHRpLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2dldEZyb21TdG9yYWdlfSBmcm9tICcuL2dldEZyb21TdG9yYWdlJztcbmltcG9ydCB7ZGVjcnlwdFBHUE1lc3NhZ2VXaXRoS2V5fSBmcm9tICcuLi8uLi9zcmMvbGliL2RlY3J5cHRQR1BNZXNzYWdlV2l0aEtleS5qcyc7XG5pbXBvcnQge2RldGVybWluZUNvbnRlbnRUeXBlfSBmcm9tICcuLi8uLi9zcmMvbGliL2RldGVybWluZUNvbnRlbnRUeXBlLmpzJztcblxuY29uc3QgUEdQUFJJVktFWSA9ICdQR1BQcml2a2V5JztcblxuZXhwb3J0IGZ1bmN0aW9uIGRlY3J5cHRQR1BNZXNzYWdlKG9wZW5wZ3ApIHtcbiAgICAvLyAgdXNhZ2U6IGRlY3J5cHRQR1BNZXNzYWdlKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSkocGFzc3dvcmQpKFBHUE1lc3NhZ2VBcm1vcikudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgIHJldHVybiAoIW9wZW5wZ3ApID9cbiAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgIChsb2NhbFN0b3JhZ2UpID0+IHtcbiAgICAgICAgcmV0dXJuICghbG9jYWxTdG9yYWdlKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBsb2NhbFN0b3JhZ2UnKTpcbiAgICAgICAgKHBhc3N3b3JkKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCFwYXNzd29yZCkgP1xuICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QoXCJFcnJvcjogbWlzc2luZyBwYXNzd29yZFwiKTpcbiAgICAgICAgICAgIChQR1BNZXNzYWdlQXJtb3IpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKCFQR1BNZXNzYWdlQXJtb3IpID9cbiAgICAgICAgICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgUEdQTWVzc2FnZUFybW9yJyk6XG4gICAgICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZGVjcnlwdFF1ZXVlID0gW107XG4gICAgICAgICAgICAgICAgICAgIGdldEZyb21TdG9yYWdlKGxvY2FsU3RvcmFnZSkoKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihzdG9yZUFyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlQXJyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChzdG9yYWdlSXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXRlcm1pbmVDb250ZW50VHlwZShzdG9yYWdlSXRlbSkob3BlbnBncClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGNvbnRlbnRUeXBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY29udGVudFR5cGUnLCBjb250ZW50VHlwZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudFR5cGUgPT09IFBHUFBSSVZLRVkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3ByaXZhdGVLZXknKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWNyeXB0UXVldWUucHVzaChkZWNyeXB0UEdQTWVzc2FnZVdpdGhLZXkob3BlbnBncCkocGFzc3dvcmQpKHN0b3JhZ2VJdGVtKShQR1BNZXNzYWdlQXJtb3IpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFByb21pc2UuYWxsKGRlY3J5cHRRdWV1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGRlY3J5cHRlZEFycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkZWNyeXB0ZWRBcnJbMF0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvZGVjcnlwdFBHUE1lc3NhZ2UuanMiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWNyeXB0UEdQTWVzc2FnZVdpdGhLZXkob3BlbnBncCkge1xuICAgIHJldHVybiAoIW9wZW5wZ3ApID9cbiAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ21pc3Npbmcgb3BlbnBncCcpKTpcbiAgICAocGFzc3dvcmQpID0+IHtcbiAgICAgICAgcmV0dXJuICghcGFzc3dvcmQpID9cbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdtaXNzaW5nIHBhc3N3b3JkJykpOlxuICAgICAgICAocHJpdmF0ZUtleUFybW9yKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCFwcml2YXRlS2V5QXJtb3IpID9cbiAgICAgICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignbWlzc2luZyBwcml2YXRlS2V5QXJtb3InKSk6XG4gICAgICAgICAgICAoUEdQTWVzc2FnZUFybW9yKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICghUEdQTWVzc2FnZUFybW9yKSA/XG4gICAgICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdtaXNzaW5nIFBHUE1lc3NhZ2VBcm1vcicpKTpcbiAgICAgICAgICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFzc3BocmFzZSA9IGAke3Bhc3N3b3JkfWA7IC8vd2hhdCB0aGUgcHJpdktleSBpcyBlbmNyeXB0ZWQgd2l0aFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByaXZLZXlPYmogPSBvcGVucGdwLmtleS5yZWFkQXJtb3JlZChgJHtwcml2YXRlS2V5QXJtb3J9YCkua2V5c1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaXZLZXlPYmouZGVjcnlwdChwYXNzcGhyYXNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSBvcGVucGdwLm1lc3NhZ2UucmVhZEFybW9yZWQoUEdQTWVzc2FnZUFybW9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcHJpdktleU9iai5wcmltYXJ5S2V5LmlzRGVjcnlwdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ1ByaXZhdGUga2V5IGlzIG5vdCBkZWNyeXB0ZWQnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghb3BlbnBncC5kZWNyeXB0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5wZ3AuZGVjcnlwdE1lc3NhZ2UocHJpdktleU9iaiwgbWVzc2FnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oY2xlYXJ0ZXh0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY2xlYXJ0ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlamVjdChlcnIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5wZ3AuZGVjcnlwdCh7ICdtZXNzYWdlJzogbWVzc2FnZSwgJ3ByaXZhdGVLZXknOiBwcml2S2V5T2JqIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdC5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3Jlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdiYWQgcHJpdmF0ZUtleUFybW9yJykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvZGVjcnlwdFBHUE1lc3NhZ2VXaXRoS2V5LmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgZnVuY3Rpb24gZGV0ZXJtaW5lS2V5VHlwZShjb250ZW50KSB7XG4gICAgcmV0dXJuICghY29udGVudCkgP1xuICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBwZ3BLZXknKTpcbiAgICAob3BlbnBncCkgPT4ge1xuICAgICAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBvcGVucGdwJyk6XG4gICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IFBHUFBVQktFWSA9ICdQR1BQdWJrZXknO1xuICAgICAgICAgICAgY29uc3QgUEdQUFJJVktFWSA9ICdQR1BQcml2a2V5JztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbGV0IHByaXZhdGVLZXlzID0gb3BlbnBncC5rZXkucmVhZEFybW9yZWQoY29udGVudClcbiAgICAgICAgICAgICAgICBsZXQgcHJpdmF0ZUtleSA9IHByaXZhdGVLZXlzLmtleXNbMF1cbiAgICAgICAgICAgICAgICBpZiAocHJpdmF0ZUtleS50b1B1YmxpYygpLmFybW9yKCkgIT09IHByaXZhdGVLZXkuYXJtb3IoKSApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShQR1BQUklWS0VZKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKFBHUFBVQktFWSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvZGV0ZXJtaW5lS2V5VHlwZS5qcyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGZ1bmN0aW9uIGVuY3J5cHRDbGVhclRleHQob3BlbnBncCkge1xuICAgIC8vIHVzYWdlOiBlbmNyeXB0Q2xlYXJUZXh0KG9wZW5wZ3ApKHB1YmxpY0tleUFybW9yKShjbGVhcnRleHQpLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbiAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIG9wZW5wZ3AnKTpcbiAgICAocHVibGljS2V5QXJtb3IpID0+IHtcbiAgICAgICAgcmV0dXJuICghcHVibGljS2V5QXJtb3IpID9cbiAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIHB1YmxpYyBrZXknKTpcbiAgICAgICAgKGNsZWFydGV4dCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICghY2xlYXJ0ZXh0KSA/XG4gICAgICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgY2xlYXJ0ZXh0Jyk6XG4gICAgICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBQR1BQdWJrZXkgPSBvcGVucGdwLmtleS5yZWFkQXJtb3JlZChwdWJsaWNLZXlBcm1vcilcbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgIHRoZSBsYXRlc3Qgb3BlbnBncCAyLjUuNCBicmVha3Mgb24gb3VyIGNvbnNvbGUgb25seSB0b29scy5cbiAgICAgICAgICAgICAgICBidXQgaXQncyAxMHggZmFzdGVyIG9uIGJyb3dzZXJzIHNvIFRIRSBORVcgQ09ERSBTVEFZUyBJTi5cbiAgICAgICAgICAgICAgICBiZWxvdyB3ZSBleHBsb2l0IGZhbGxiYWNrIHRvIG9sZCBzbG93IGVycm9yIGZyZWUgb3BlbnBncCAxLjYuMlxuICAgICAgICAgICAgICAgIGJ5IGFkYXB0aW5nIG9uIHRoZSBmbHkgdG8gYSBicmVha2luZyBjaGFuZ2VcbiAgICAgICAgICAgICAgICAob3BlbnBncCBidWcgXjEuNi4yIC0+IDIuNS40IG1hZGUgdXMgZG8gaXQpXG4gICAgICAgICAgICAgICAgcmVmYWN0b3I6IHJlbW92ZSB0cnkgc2VjdGlvbiBvZiB0cnljYXRjaCBrZWVwIGNhdGNoIHNlY3Rpb25cbiAgICAgICAgICAgICAgICBieSBhbGwgbWVhbnMgcmVmYWN0b3IgaWYgbm90IGJyb2tlbiBhZnRlciBvcGVucGdwIDIuNS40XG4gICAgICAgICAgICAgICAgaWYgeW91IGNoZWNrIG9wZW5wZ3AgcGxlYXNlIGJ1bXAgZmFpbGluZyB2ZXJzaW9uICBeXl5eXlxuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gd29ya3Mgb25seSBvbiBvcGVucGdwIHZlcnNpb24gMS42LjJcbiAgICAgICAgICAgICAgICAgICAgb3BlbnBncC5lbmNyeXB0TWVzc2FnZShQR1BQdWJrZXkua2V5c1swXSwgY2xlYXJ0ZXh0KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihlbmNyeXB0ZWR0eHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShlbmNyeXB0ZWR0eHQpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgpXG4gICAgICAgICAgICAgICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gd29ya3Mgb24gb3BlbnBncCB2ZXJzaW9uIDIuNS40XG4gICAgICAgICAgICAgICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogY2xlYXJ0ZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcHVibGljS2V5czogb3BlbnBncC5rZXkucmVhZEFybW9yZWQocHVibGljS2V5QXJtb3IpLmtleXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcm1vcjogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBvcGVucGdwLmVuY3J5cHQob3B0aW9ucylcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGNpcGhlcnRleHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY2lwaGVydGV4dC5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvZW5jcnlwdENsZWFyVGV4dC5qcyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtnZXRGcm9tU3RvcmFnZX0gZnJvbSAnLi9nZXRGcm9tU3RvcmFnZSc7XG5pbXBvcnQge2RldGVybWluZUNvbnRlbnRUeXBlfSBmcm9tICcuL2RldGVybWluZUNvbnRlbnRUeXBlJztcbmltcG9ydCB7ZW5jcnlwdENsZWFyVGV4dH0gZnJvbSAnLi9lbmNyeXB0Q2xlYXJUZXh0JztcblxuY29uc3QgUEdQUFVCS0VZID0gJ1BHUFB1YmtleSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBlbmNyeXB0Q2xlYXJ0ZXh0TXVsdGkoY29udGVudCkge1xuICAgIC8vIHVzYWdlOiBlbmNyeXB0Q2xlYXJ0ZXh0TXVsdGkoY29udGVudCkob3BlbnBncCkobG9jYWxTdG9yYWdlKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpXG4gICAgcmV0dXJuICghY29udGVudCkgP1xuICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBjb250ZW50Jyk6XG4gICAgKG9wZW5wZ3ApID0+IHtcbiAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgICAgICAobG9jYWxTdG9yYWdlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCFsb2NhbFN0b3JhZ2UpID9cbiAgICAgICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBsb2NhbFN0b3JhZ2UnKTpcbiAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZW5jcnlwdFF1ZXVlID0gW107XG4gICAgICAgICAgICAgICAgICAgIGdldEZyb21TdG9yYWdlKGxvY2FsU3RvcmFnZSkoKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoc3RvcmFnZUFycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmFnZUFyclxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgoc3RvcmFnZUl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXRlcm1pbmVDb250ZW50VHlwZShzdG9yYWdlSXRlbSkob3BlbnBncClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGNvbnRlbnRUeXBlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudFR5cGUgPT09IFBHUFBVQktFWSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuY3J5cHRRdWV1ZS5wdXNoKGVuY3J5cHRDbGVhclRleHQob3BlbnBncCkoc3RvcmFnZUl0ZW0pKGNvbnRlbnQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBQcm9taXNlLmFsbChlbmNyeXB0UXVldWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoZW5jcnlwdGVkQXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShlbmNyeXB0ZWRBcnIpXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QgKG5ldyBFcnJvciAoZXJyKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvZW5jcnlwdENsZWFydGV4dE11bHRpLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZVBHUFByaXZrZXkoUEdQa2V5QXJtb3IpIHtcbiAgICAvLyBzYXZlIHByaXZhdGUga2V5IHRvIHN0b3JhZ2Ugbm8gcXVlc3Rpb25zIGFza2VkXG4gICAgLy8gdXNhZ2U6IHNhdmVQR1BQcml2a2V5KGNvbnRlbnQpKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSkudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgIHJldHVybiAoIVBHUGtleUFybW9yKSA/XG4gICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIFBHUGtleUFybW9yJyk6XG4gICAgKG9wZW5wZ3ApID0+IHtcbiAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgICAgICAobG9jYWxTdG9yYWdlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCFsb2NhbFN0b3JhZ2UpID9cbiAgICAgICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBsb2NhbFN0b3JhZ2UnKTpcbiAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgUEdQa2V5ID0gb3BlbnBncC5rZXkucmVhZEFybW9yZWQoUEdQa2V5QXJtb3IpO1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShQR1BrZXkua2V5c1swXS51c2Vyc1swXS51c2VySWQudXNlcmlkLCBQR1BrZXlBcm1vcilcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5zZXRJbW1lZGlhdGUoXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGBwcml2YXRlIHBncCBrZXkgc2F2ZWQgPC0gJHtQR1BrZXkua2V5c1swXS51c2Vyc1swXS51c2VySWQudXNlcmlkfWApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB9IGNhdGNoKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xpYi9zYXZlUEdQUHJpdmtleS5qcyIsInZhciBnO1xyXG5cclxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcclxuZyA9IChmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcztcclxufSkoKTtcclxuXHJcbnRyeSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXHJcblx0ZyA9IGcgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpIHx8ICgxLGV2YWwpKFwidGhpc1wiKTtcclxufSBjYXRjaChlKSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcclxuXHRpZih0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKVxyXG5cdFx0ZyA9IHdpbmRvdztcclxufVxyXG5cclxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxyXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xyXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGc7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAod2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBub3RFbXB0eSBmcm9tICcuLi8uLi9zcmMvbGliL25vdEVtcHR5LmpzJztcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG5vdENsZWFydGV4dChjb250ZW50KSB7XG4gICAgcmV0dXJuICghY29udGVudCkgP1xuICAgICgpID0+IG5vdEVtcHR5KGNvbnRlbnQpOlxuICAgIChvcGVucGdwKSA9PiB7XG4gICAgICAgIHJldHVybiAoIW9wZW5wZ3ApID9cbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdtaXNzaW5nIG9wZW5wZ3AnKSk6XG4gICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGxldCBwb3NzaWJsZXBncGtleSA9IG9wZW5wZ3Aua2V5LnJlYWRBcm1vcmVkKGNvbnRlbnQpO1xuICAgICAgICAgICAgaWYgKHBvc3NpYmxlcGdwa2V5LmtleXNbMF0pIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGNvbnRlbnQpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5wZ3AubWVzc2FnZS5yZWFkQXJtb3JlZChjb250ZW50KVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdjbGVhcnRleHQgY29udGVudCcpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvbm90Q2xlYXJ0ZXh0LmpzIiwiOyhmdW5jdGlvbigpe1xyXG5cclxuXHQvKiBVTkJVSUxEICovXHJcblx0dmFyIHJvb3Q7XHJcblx0aWYodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIil7IHJvb3QgPSB3aW5kb3cgfVxyXG5cdGlmKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIpeyByb290ID0gZ2xvYmFsIH1cclxuXHRyb290ID0gcm9vdCB8fCB7fTtcclxuXHR2YXIgY29uc29sZSA9IHJvb3QuY29uc29sZSB8fCB7bG9nOiBmdW5jdGlvbigpe319O1xyXG5cdGZ1bmN0aW9uIHJlcXVpcmUoYXJnKXtcclxuXHRcdHJldHVybiBhcmcuc2xpY2U/IHJlcXVpcmVbcmVzb2x2ZShhcmcpXSA6IGZ1bmN0aW9uKG1vZCwgcGF0aCl7XHJcblx0XHRcdGFyZyhtb2QgPSB7ZXhwb3J0czoge319KTtcclxuXHRcdFx0cmVxdWlyZVtyZXNvbHZlKHBhdGgpXSA9IG1vZC5leHBvcnRzO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gcmVzb2x2ZShwYXRoKXtcclxuXHRcdFx0cmV0dXJuIHBhdGguc3BsaXQoJy8nKS5zbGljZSgtMSkudG9TdHJpbmcoKS5yZXBsYWNlKCcuanMnLCcnKTtcclxuXHRcdH1cclxuXHR9XHJcblx0aWYodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIil7IHZhciBjb21tb24gPSBtb2R1bGUgfVxyXG5cdC8qIFVOQlVJTEQgKi9cclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdC8vIEdlbmVyaWMgamF2YXNjcmlwdCB1dGlsaXRpZXMuXHJcblx0XHR2YXIgVHlwZSA9IHt9O1xyXG5cdFx0Ly9UeXBlLmZucyA9IFR5cGUuZm4gPSB7aXM6IGZ1bmN0aW9uKGZuKXsgcmV0dXJuICghIWZuICYmIGZuIGluc3RhbmNlb2YgRnVuY3Rpb24pIH19XHJcblx0XHRUeXBlLmZucyA9IFR5cGUuZm4gPSB7aXM6IGZ1bmN0aW9uKGZuKXsgcmV0dXJuICghIWZuICYmICdmdW5jdGlvbicgPT0gdHlwZW9mIGZuKSB9fVxyXG5cdFx0VHlwZS5iaSA9IHtpczogZnVuY3Rpb24oYil7IHJldHVybiAoYiBpbnN0YW5jZW9mIEJvb2xlYW4gfHwgdHlwZW9mIGIgPT0gJ2Jvb2xlYW4nKSB9fVxyXG5cdFx0VHlwZS5udW0gPSB7aXM6IGZ1bmN0aW9uKG4peyByZXR1cm4gIWxpc3RfaXMobikgJiYgKChuIC0gcGFyc2VGbG9hdChuKSArIDEpID49IDAgfHwgSW5maW5pdHkgPT09IG4gfHwgLUluZmluaXR5ID09PSBuKSB9fVxyXG5cdFx0VHlwZS50ZXh0ID0ge2lzOiBmdW5jdGlvbih0KXsgcmV0dXJuICh0eXBlb2YgdCA9PSAnc3RyaW5nJykgfX1cclxuXHRcdFR5cGUudGV4dC5pZnkgPSBmdW5jdGlvbih0KXtcclxuXHRcdFx0aWYoVHlwZS50ZXh0LmlzKHQpKXsgcmV0dXJuIHQgfVxyXG5cdFx0XHRpZih0eXBlb2YgSlNPTiAhPT0gXCJ1bmRlZmluZWRcIil7IHJldHVybiBKU09OLnN0cmluZ2lmeSh0KSB9XHJcblx0XHRcdHJldHVybiAodCAmJiB0LnRvU3RyaW5nKT8gdC50b1N0cmluZygpIDogdDtcclxuXHRcdH1cclxuXHRcdFR5cGUudGV4dC5yYW5kb20gPSBmdW5jdGlvbihsLCBjKXtcclxuXHRcdFx0dmFyIHMgPSAnJztcclxuXHRcdFx0bCA9IGwgfHwgMjQ7IC8vIHlvdSBhcmUgbm90IGdvaW5nIHRvIG1ha2UgYSAwIGxlbmd0aCByYW5kb20gbnVtYmVyLCBzbyBubyBuZWVkIHRvIGNoZWNrIHR5cGVcclxuXHRcdFx0YyA9IGMgfHwgJzAxMjM0NTY3ODlBQkNERUZHSElKS0xNTk9QUVJTVFVWV1haYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonO1xyXG5cdFx0XHR3aGlsZShsID4gMCl7IHMgKz0gYy5jaGFyQXQoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYy5sZW5ndGgpKTsgbC0tIH1cclxuXHRcdFx0cmV0dXJuIHM7XHJcblx0XHR9XHJcblx0XHRUeXBlLnRleHQubWF0Y2ggPSBmdW5jdGlvbih0LCBvKXsgdmFyIHIgPSBmYWxzZTtcclxuXHRcdFx0dCA9IHQgfHwgJyc7XHJcblx0XHRcdG8gPSBUeXBlLnRleHQuaXMobyk/IHsnPSc6IG99IDogbyB8fCB7fTsgLy8geyd+JywgJz0nLCAnKicsICc8JywgJz4nLCAnKycsICctJywgJz8nLCAnISd9IC8vIGlnbm9yZSBjYXNlLCBleGFjdGx5IGVxdWFsLCBhbnl0aGluZyBhZnRlciwgbGV4aWNhbGx5IGxhcmdlciwgbGV4aWNhbGx5IGxlc3NlciwgYWRkZWQgaW4sIHN1YnRhY3RlZCBmcm9tLCBxdWVzdGlvbmFibGUgZnV6enkgbWF0Y2gsIGFuZCBlbmRzIHdpdGguXHJcblx0XHRcdGlmKFR5cGUub2JqLmhhcyhvLCd+JykpeyB0ID0gdC50b0xvd2VyQ2FzZSgpOyBvWyc9J10gPSAob1snPSddIHx8IG9bJ34nXSkudG9Mb3dlckNhc2UoKSB9XHJcblx0XHRcdGlmKFR5cGUub2JqLmhhcyhvLCc9JykpeyByZXR1cm4gdCA9PT0gb1snPSddIH1cclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJyonKSl7IGlmKHQuc2xpY2UoMCwgb1snKiddLmxlbmd0aCkgPT09IG9bJyonXSl7IHIgPSB0cnVlOyB0ID0gdC5zbGljZShvWycqJ10ubGVuZ3RoKSB9IGVsc2UgeyByZXR1cm4gZmFsc2UgfX1cclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJyEnKSl7IGlmKHQuc2xpY2UoLW9bJyEnXS5sZW5ndGgpID09PSBvWychJ10peyByID0gdHJ1ZSB9IGVsc2UgeyByZXR1cm4gZmFsc2UgfX1cclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJysnKSl7XHJcblx0XHRcdFx0aWYoVHlwZS5saXN0Lm1hcChUeXBlLmxpc3QuaXMob1snKyddKT8gb1snKyddIDogW29bJysnXV0sIGZ1bmN0aW9uKG0pe1xyXG5cdFx0XHRcdFx0aWYodC5pbmRleE9mKG0pID49IDApeyByID0gdHJ1ZSB9IGVsc2UgeyByZXR1cm4gdHJ1ZSB9XHJcblx0XHRcdFx0fSkpeyByZXR1cm4gZmFsc2UgfVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKFR5cGUub2JqLmhhcyhvLCctJykpe1xyXG5cdFx0XHRcdGlmKFR5cGUubGlzdC5tYXAoVHlwZS5saXN0LmlzKG9bJy0nXSk/IG9bJy0nXSA6IFtvWyctJ11dLCBmdW5jdGlvbihtKXtcclxuXHRcdFx0XHRcdGlmKHQuaW5kZXhPZihtKSA8IDApeyByID0gdHJ1ZSB9IGVsc2UgeyByZXR1cm4gdHJ1ZSB9XHJcblx0XHRcdFx0fSkpeyByZXR1cm4gZmFsc2UgfVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKFR5cGUub2JqLmhhcyhvLCc+JykpeyBpZih0ID4gb1snPiddKXsgciA9IHRydWUgfSBlbHNlIHsgcmV0dXJuIGZhbHNlIH19XHJcblx0XHRcdGlmKFR5cGUub2JqLmhhcyhvLCc8JykpeyBpZih0IDwgb1snPCddKXsgciA9IHRydWUgfSBlbHNlIHsgcmV0dXJuIGZhbHNlIH19XHJcblx0XHRcdGZ1bmN0aW9uIGZ1enp5KHQsZil7IHZhciBuID0gLTEsIGkgPSAwLCBjOyBmb3IoO2MgPSBmW2krK107KXsgaWYoIX4obiA9IHQuaW5kZXhPZihjLCBuKzEpKSl7IHJldHVybiBmYWxzZSB9fSByZXR1cm4gdHJ1ZSB9IC8vIHZpYSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzkyMDYwMTMvamF2YXNjcmlwdC1mdXp6eS1zZWFyY2hcclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJz8nKSl7IGlmKGZ1enp5KHQsIG9bJz8nXSkpeyByID0gdHJ1ZSB9IGVsc2UgeyByZXR1cm4gZmFsc2UgfX0gLy8gY2hhbmdlIG5hbWUhXHJcblx0XHRcdHJldHVybiByO1xyXG5cdFx0fVxyXG5cdFx0VHlwZS5saXN0ID0ge2lzOiBmdW5jdGlvbihsKXsgcmV0dXJuIChsIGluc3RhbmNlb2YgQXJyYXkpIH19XHJcblx0XHRUeXBlLmxpc3Quc2xpdCA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcclxuXHRcdFR5cGUubGlzdC5zb3J0ID0gZnVuY3Rpb24oayl7IC8vIGNyZWF0ZXMgYSBuZXcgc29ydCBmdW5jdGlvbiBiYXNlZCBvZmYgc29tZSBmaWVsZFxyXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oQSxCKXtcclxuXHRcdFx0XHRpZighQSB8fCAhQil7IHJldHVybiAwIH0gQSA9IEFba107IEIgPSBCW2tdO1xyXG5cdFx0XHRcdGlmKEEgPCBCKXsgcmV0dXJuIC0xIH1lbHNlIGlmKEEgPiBCKXsgcmV0dXJuIDEgfVxyXG5cdFx0XHRcdGVsc2UgeyByZXR1cm4gMCB9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFR5cGUubGlzdC5tYXAgPSBmdW5jdGlvbihsLCBjLCBfKXsgcmV0dXJuIG9ial9tYXAobCwgYywgXykgfVxyXG5cdFx0VHlwZS5saXN0LmluZGV4ID0gMTsgLy8gY2hhbmdlIHRoaXMgdG8gMCBpZiB5b3Ugd2FudCBub24tbG9naWNhbCwgbm9uLW1hdGhlbWF0aWNhbCwgbm9uLW1hdHJpeCwgbm9uLWNvbnZlbmllbnQgYXJyYXkgbm90YXRpb25cclxuXHRcdFR5cGUub2JqID0ge2lzOiBmdW5jdGlvbihvKXsgcmV0dXJuIG8/IChvIGluc3RhbmNlb2YgT2JqZWN0ICYmIG8uY29uc3RydWN0b3IgPT09IE9iamVjdCkgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLm1hdGNoKC9eXFxbb2JqZWN0IChcXHcrKVxcXSQvKVsxXSA9PT0gJ09iamVjdCcgOiBmYWxzZSB9fVxyXG5cdFx0VHlwZS5vYmoucHV0ID0gZnVuY3Rpb24obywgZiwgdil7IHJldHVybiAob3x8e30pW2ZdID0gdiwgbyB9XHJcblx0XHRUeXBlLm9iai5oYXMgPSBmdW5jdGlvbihvLCBmKXsgcmV0dXJuIG8gJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIGYpIH1cclxuXHRcdFR5cGUub2JqLmRlbCA9IGZ1bmN0aW9uKG8sIGspe1xyXG5cdFx0XHRpZighbyl7IHJldHVybiB9XHJcblx0XHRcdG9ba10gPSBudWxsO1xyXG5cdFx0XHRkZWxldGUgb1trXTtcclxuXHRcdFx0cmV0dXJuIG87XHJcblx0XHR9XHJcblx0XHRUeXBlLm9iai5hcyA9IGZ1bmN0aW9uKG8sIGYsIHYsIHUpeyByZXR1cm4gb1tmXSA9IG9bZl0gfHwgKHUgPT09IHY/IHt9IDogdikgfVxyXG5cdFx0VHlwZS5vYmouaWZ5ID0gZnVuY3Rpb24obyl7XHJcblx0XHRcdGlmKG9ial9pcyhvKSl7IHJldHVybiBvIH1cclxuXHRcdFx0dHJ5e28gPSBKU09OLnBhcnNlKG8pO1xyXG5cdFx0XHR9Y2F0Y2goZSl7bz17fX07XHJcblx0XHRcdHJldHVybiBvO1xyXG5cdFx0fVxyXG5cdFx0OyhmdW5jdGlvbigpeyB2YXIgdTtcclxuXHRcdFx0ZnVuY3Rpb24gbWFwKHYsZil7XHJcblx0XHRcdFx0aWYob2JqX2hhcyh0aGlzLGYpICYmIHUgIT09IHRoaXNbZl0peyByZXR1cm4gfVxyXG5cdFx0XHRcdHRoaXNbZl0gPSB2O1xyXG5cdFx0XHR9XHJcblx0XHRcdFR5cGUub2JqLnRvID0gZnVuY3Rpb24oZnJvbSwgdG8pe1xyXG5cdFx0XHRcdHRvID0gdG8gfHwge307XHJcblx0XHRcdFx0b2JqX21hcChmcm9tLCBtYXAsIHRvKTtcclxuXHRcdFx0XHRyZXR1cm4gdG87XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblx0XHRUeXBlLm9iai5jb3B5ID0gZnVuY3Rpb24obyl7IC8vIGJlY2F1c2UgaHR0cDovL3dlYi5hcmNoaXZlLm9yZy93ZWIvMjAxNDAzMjgyMjQwMjUvaHR0cDovL2pzcGVyZi5jb20vY2xvbmluZy1hbi1vYmplY3QvMlxyXG5cdFx0XHRyZXR1cm4gIW8/IG8gOiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG8pKTsgLy8gaXMgc2hvY2tpbmdseSBmYXN0ZXIgdGhhbiBhbnl0aGluZyBlbHNlLCBhbmQgb3VyIGRhdGEgaGFzIHRvIGJlIGEgc3Vic2V0IG9mIEpTT04gYW55d2F5cyFcclxuXHRcdH1cclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0ZnVuY3Rpb24gZW1wdHkodixpKXsgdmFyIG4gPSB0aGlzLm47XHJcblx0XHRcdFx0aWYobiAmJiAoaSA9PT0gbiB8fCAob2JqX2lzKG4pICYmIG9ial9oYXMobiwgaSkpKSl7IHJldHVybiB9XHJcblx0XHRcdFx0aWYoaSl7IHJldHVybiB0cnVlIH1cclxuXHRcdFx0fVxyXG5cdFx0XHRUeXBlLm9iai5lbXB0eSA9IGZ1bmN0aW9uKG8sIG4pe1xyXG5cdFx0XHRcdGlmKCFvKXsgcmV0dXJuIHRydWUgfVxyXG5cdFx0XHRcdHJldHVybiBvYmpfbWFwKG8sZW1wdHkse246bn0pPyBmYWxzZSA6IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdGZ1bmN0aW9uIHQoayx2KXtcclxuXHRcdFx0XHRpZigyID09PSBhcmd1bWVudHMubGVuZ3RoKXtcclxuXHRcdFx0XHRcdHQuciA9IHQuciB8fCB7fTtcclxuXHRcdFx0XHRcdHQucltrXSA9IHY7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fSB0LnIgPSB0LnIgfHwgW107XHJcblx0XHRcdFx0dC5yLnB1c2goayk7XHJcblx0XHRcdH07XHJcblx0XHRcdHZhciBrZXlzID0gT2JqZWN0LmtleXM7XHJcblx0XHRcdFR5cGUub2JqLm1hcCA9IGZ1bmN0aW9uKGwsIGMsIF8pe1xyXG5cdFx0XHRcdHZhciB1LCBpID0gMCwgeCwgciwgbGwsIGxsZSwgZiA9IGZuX2lzKGMpO1xyXG5cdFx0XHRcdHQuciA9IG51bGw7XHJcblx0XHRcdFx0aWYoa2V5cyAmJiBvYmpfaXMobCkpe1xyXG5cdFx0XHRcdFx0bGwgPSBPYmplY3Qua2V5cyhsKTsgbGxlID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYobGlzdF9pcyhsKSB8fCBsbCl7XHJcblx0XHRcdFx0XHR4ID0gKGxsIHx8IGwpLmxlbmd0aDtcclxuXHRcdFx0XHRcdGZvcig7aSA8IHg7IGkrKyl7XHJcblx0XHRcdFx0XHRcdHZhciBpaSA9IChpICsgVHlwZS5saXN0LmluZGV4KTtcclxuXHRcdFx0XHRcdFx0aWYoZil7XHJcblx0XHRcdFx0XHRcdFx0ciA9IGxsZT8gYy5jYWxsKF8gfHwgdGhpcywgbFtsbFtpXV0sIGxsW2ldLCB0KSA6IGMuY2FsbChfIHx8IHRoaXMsIGxbaV0sIGlpLCB0KTtcclxuXHRcdFx0XHRcdFx0XHRpZihyICE9PSB1KXsgcmV0dXJuIHIgfVxyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdC8vaWYoVHlwZS50ZXN0LmlzKGMsbFtpXSkpeyByZXR1cm4gaWkgfSAvLyBzaG91bGQgaW1wbGVtZW50IGRlZXAgZXF1YWxpdHkgdGVzdGluZyFcclxuXHRcdFx0XHRcdFx0XHRpZihjID09PSBsW2xsZT8gbGxbaV0gOiBpXSl7IHJldHVybiBsbD8gbGxbaV0gOiBpaSB9IC8vIHVzZSB0aGlzIGZvciBub3dcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRmb3IoaSBpbiBsKXtcclxuXHRcdFx0XHRcdFx0aWYoZil7XHJcblx0XHRcdFx0XHRcdFx0aWYob2JqX2hhcyhsLGkpKXtcclxuXHRcdFx0XHRcdFx0XHRcdHIgPSBfPyBjLmNhbGwoXywgbFtpXSwgaSwgdCkgOiBjKGxbaV0sIGksIHQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYociAhPT0gdSl7IHJldHVybiByIH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Ly9pZihhLnRlc3QuaXMoYyxsW2ldKSl7IHJldHVybiBpIH0gLy8gc2hvdWxkIGltcGxlbWVudCBkZWVwIGVxdWFsaXR5IHRlc3RpbmchXHJcblx0XHRcdFx0XHRcdFx0aWYoYyA9PT0gbFtpXSl7IHJldHVybiBpIH0gLy8gdXNlIHRoaXMgZm9yIG5vd1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBmPyB0LnIgOiBUeXBlLmxpc3QuaW5kZXg/IDAgOiAtMTtcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdFR5cGUudGltZSA9IHt9O1xyXG5cdFx0VHlwZS50aW1lLmlzID0gZnVuY3Rpb24odCl7IHJldHVybiB0PyB0IGluc3RhbmNlb2YgRGF0ZSA6ICgrbmV3IERhdGUoKS5nZXRUaW1lKCkpIH1cclxuXHJcblx0XHR2YXIgZm5faXMgPSBUeXBlLmZuLmlzO1xyXG5cdFx0dmFyIGxpc3RfaXMgPSBUeXBlLmxpc3QuaXM7XHJcblx0XHR2YXIgb2JqID0gVHlwZS5vYmosIG9ial9pcyA9IG9iai5pcywgb2JqX2hhcyA9IG9iai5oYXMsIG9ial9tYXAgPSBvYmoubWFwO1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBUeXBlO1xyXG5cdH0pKHJlcXVpcmUsICcuL3R5cGUnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdC8vIE9uIGV2ZW50IGVtaXR0ZXIgZ2VuZXJpYyBqYXZhc2NyaXB0IHV0aWxpdHkuXHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG9udG8odGFnLCBhcmcsIGFzKXtcclxuXHRcdFx0aWYoIXRhZyl7IHJldHVybiB7dG86IG9udG99IH1cclxuXHRcdFx0dmFyIHRhZyA9ICh0aGlzLnRhZyB8fCAodGhpcy50YWcgPSB7fSkpW3RhZ10gfHxcclxuXHRcdFx0KHRoaXMudGFnW3RhZ10gPSB7dGFnOiB0YWcsIHRvOiBvbnRvLl8gPSB7XHJcblx0XHRcdFx0bmV4dDogZnVuY3Rpb24oKXt9XHJcblx0XHRcdH19KTtcclxuXHRcdFx0aWYoYXJnIGluc3RhbmNlb2YgRnVuY3Rpb24pe1xyXG5cdFx0XHRcdHZhciBiZSA9IHtcclxuXHRcdFx0XHRcdG9mZjogb250by5vZmYgfHwgXHJcblx0XHRcdFx0XHQob250by5vZmYgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0XHRpZih0aGlzLm5leHQgPT09IG9udG8uXy5uZXh0KXsgcmV0dXJuICEwIH1cclxuXHRcdFx0XHRcdFx0aWYodGhpcyA9PT0gdGhpcy50aGUubGFzdCl7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy50aGUubGFzdCA9IHRoaXMuYmFjaztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR0aGlzLnRvLmJhY2sgPSB0aGlzLmJhY2s7XHJcblx0XHRcdFx0XHRcdHRoaXMubmV4dCA9IG9udG8uXy5uZXh0O1xyXG5cdFx0XHRcdFx0XHR0aGlzLmJhY2sudG8gPSB0aGlzLnRvO1xyXG5cdFx0XHRcdFx0fSksXHJcblx0XHRcdFx0XHR0bzogb250by5fLFxyXG5cdFx0XHRcdFx0bmV4dDogYXJnLFxyXG5cdFx0XHRcdFx0dGhlOiB0YWcsXHJcblx0XHRcdFx0XHRvbjogdGhpcyxcclxuXHRcdFx0XHRcdGFzOiBhcyxcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdChiZS5iYWNrID0gdGFnLmxhc3QgfHwgdGFnKS50byA9IGJlO1xyXG5cdFx0XHRcdHJldHVybiB0YWcubGFzdCA9IGJlO1xyXG5cdFx0XHR9XHJcblx0XHRcdCh0YWcgPSB0YWcudG8pLm5leHQoYXJnKTtcclxuXHRcdFx0cmV0dXJuIHRhZztcclxuXHRcdH07XHJcblx0fSkocmVxdWlyZSwgJy4vb250bycpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0Ly8gVE9ETzogTmVlZHMgdG8gYmUgcmVkb25lLlxyXG5cdFx0dmFyIE9uID0gcmVxdWlyZSgnLi9vbnRvJyk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gQ2hhaW4oY3JlYXRlLCBvcHQpe1xyXG5cdFx0XHRvcHQgPSBvcHQgfHwge307XHJcblx0XHRcdG9wdC5pZCA9IG9wdC5pZCB8fCAnIyc7XHJcblx0XHRcdG9wdC5yaWQgPSBvcHQucmlkIHx8ICdAJztcclxuXHRcdFx0b3B0LnV1aWQgPSBvcHQudXVpZCB8fCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHJldHVybiAoK25ldyBEYXRlKCkpICsgTWF0aC5yYW5kb20oKTtcclxuXHRcdFx0fTtcclxuXHRcdFx0dmFyIG9uID0gT247Ly9Pbi5zY29wZSgpO1xyXG5cclxuXHRcdFx0b24uc3R1biA9IGZ1bmN0aW9uKGNoYWluKXtcclxuXHRcdFx0XHR2YXIgc3R1biA9IGZ1bmN0aW9uKGV2KXtcclxuXHRcdFx0XHRcdGlmKHN0dW4ub2ZmICYmIHN0dW4gPT09IHRoaXMuc3R1bil7XHJcblx0XHRcdFx0XHRcdHRoaXMuc3R1biA9IG51bGw7XHJcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmKG9uLnN0dW4uc2tpcCl7XHJcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmKGV2KXtcclxuXHRcdFx0XHRcdFx0ZXYuY2IgPSBldi5mbjtcclxuXHRcdFx0XHRcdFx0ZXYub2ZmKCk7XHJcblx0XHRcdFx0XHRcdHJlcy5xdWV1ZS5wdXNoKGV2KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH0sIHJlcyA9IHN0dW4ucmVzID0gZnVuY3Rpb24odG1wLCBhcyl7XHJcblx0XHRcdFx0XHRpZihzdHVuLm9mZil7IHJldHVybiB9XHJcblx0XHRcdFx0XHRpZih0bXAgaW5zdGFuY2VvZiBGdW5jdGlvbil7XHJcblx0XHRcdFx0XHRcdG9uLnN0dW4uc2tpcCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdHRtcC5jYWxsKGFzKTtcclxuXHRcdFx0XHRcdFx0b24uc3R1bi5za2lwID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHN0dW4ub2ZmID0gdHJ1ZTtcclxuXHRcdFx0XHRcdHZhciBpID0gMCwgcSA9IHJlcy5xdWV1ZSwgbCA9IHEubGVuZ3RoLCBhY3Q7XHJcblx0XHRcdFx0XHRyZXMucXVldWUgPSBbXTtcclxuXHRcdFx0XHRcdGlmKHN0dW4gPT09IGF0LnN0dW4pe1xyXG5cdFx0XHRcdFx0XHRhdC5zdHVuID0gbnVsbDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGZvcihpOyBpIDwgbDsgaSsrKXsgYWN0ID0gcVtpXTtcclxuXHRcdFx0XHRcdFx0YWN0LmZuID0gYWN0LmNiO1xyXG5cdFx0XHRcdFx0XHRhY3QuY2IgPSBudWxsO1xyXG5cdFx0XHRcdFx0XHRvbi5zdHVuLnNraXAgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRhY3QuY3R4Lm9uKGFjdC50YWcsIGFjdC5mbiwgYWN0KTtcclxuXHRcdFx0XHRcdFx0b24uc3R1bi5za2lwID0gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSwgYXQgPSBjaGFpbi5fO1xyXG5cdFx0XHRcdHJlcy5iYWNrID0gYXQuc3R1biB8fCAoYXQuYmFja3x8e186e319KS5fLnN0dW47XHJcblx0XHRcdFx0aWYocmVzLmJhY2spe1xyXG5cdFx0XHRcdFx0cmVzLmJhY2submV4dCA9IHN0dW47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJlcy5xdWV1ZSA9IFtdO1xyXG5cdFx0XHRcdGF0LnN0dW4gPSBzdHVuOyBcclxuXHRcdFx0XHRyZXR1cm4gcmVzO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBvbjtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHRcdHJldHVybjtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR2YXIgYXNrID0gb24uYXNrID0gZnVuY3Rpb24oY2IsIGFzKXtcclxuXHRcdFx0XHRpZighYXNrLm9uKXsgYXNrLm9uID0gT24uc2NvcGUoKSB9XHJcblx0XHRcdFx0dmFyIGlkID0gb3B0LnV1aWQoKTtcclxuXHRcdFx0XHRpZihjYil7IGFzay5vbihpZCwgY2IsIGFzKSB9XHJcblx0XHRcdFx0cmV0dXJuIGlkO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFzay5fID0gb3B0LmlkO1xyXG5cdFx0XHRvbi5hY2sgPSBmdW5jdGlvbihhdCwgcmVwbHkpe1xyXG5cdFx0XHRcdGlmKCFhdCB8fCAhcmVwbHkgfHwgIWFzay5vbil7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIGlkID0gYXRbb3B0LmlkXSB8fCBhdDtcclxuXHRcdFx0XHRpZighYXNrLm9uc1tpZF0peyByZXR1cm4gfVxyXG5cdFx0XHRcdGFzay5vbihpZCwgcmVwbHkpO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdG9uLmFjay5fID0gb3B0LnJpZDtcclxuXHJcblxyXG5cdFx0XHRyZXR1cm4gb247XHJcblx0XHRcdHJldHVybjtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHRcdHJldHVybjtcclxuXHRcdFx0b24ub24oJ2V2ZW50JywgZnVuY3Rpb24gZXZlbnQoYWN0KXtcclxuXHRcdFx0XHR2YXIgbGFzdCA9IGFjdC5vbi5sYXN0LCB0bXA7XHJcblx0XHRcdFx0aWYoJ2luJyA9PT0gYWN0LnRhZyAmJiBHdW4uY2hhaW4uY2hhaW4uaW5wdXQgIT09IGFjdC5mbil7IC8vIFRPRE86IEJVRyEgR3VuIGlzIG5vdCBhdmFpbGFibGUgaW4gdGhpcyBtb2R1bGUuXHJcblx0XHRcdFx0XHRpZigodG1wID0gYWN0LmN0eCkgJiYgdG1wLnN0dW4pe1xyXG5cdFx0XHRcdFx0XHRpZih0bXAuc3R1bihhY3QpKXtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoIWxhc3QpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGlmKGFjdC5vbi5tYXApe1xyXG5cdFx0XHRcdFx0dmFyIG1hcCA9IGFjdC5vbi5tYXAsIHY7XHJcblx0XHRcdFx0XHRmb3IodmFyIGYgaW4gbWFwKXsgdiA9IG1hcFtmXTtcclxuXHRcdFx0XHRcdFx0aWYodil7XHJcblx0XHRcdFx0XHRcdFx0ZW1pdCh2LCBhY3QsIGV2ZW50KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0LypcclxuXHRcdFx0XHRcdEd1bi5vYmoubWFwKGFjdC5vbi5tYXAsIGZ1bmN0aW9uKHYsZil7IC8vIFRPRE86IEJVRyEgR3VuIGlzIG5vdCBhdmFpbGFibGUgaW4gdGhpcyBtb2R1bGUuXHJcblx0XHRcdFx0XHRcdC8vZW1pdCh2WzBdLCBhY3QsIGV2ZW50LCB2WzFdKTsgLy8gYmVsb3cgZW5hYmxlcyBtb3JlIGNvbnRyb2xcclxuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcImJvb29vb29vb1wiLCBmLHYpO1xyXG5cdFx0XHRcdFx0XHRlbWl0KHYsIGFjdCwgZXZlbnQpO1xyXG5cdFx0XHRcdFx0XHQvL2VtaXQodlsxXSwgYWN0LCBldmVudCwgdlsyXSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdCovXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGVtaXQobGFzdCwgYWN0LCBldmVudCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGxhc3QgIT09IGFjdC5vbi5sYXN0KXtcclxuXHRcdFx0XHRcdGV2ZW50KGFjdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0ZnVuY3Rpb24gZW1pdChsYXN0LCBhY3QsIGV2ZW50LCBldil7XHJcblx0XHRcdFx0aWYobGFzdCBpbnN0YW5jZW9mIEFycmF5KXtcclxuXHRcdFx0XHRcdGFjdC5mbi5hcHBseShhY3QuYXMsIGxhc3QuY29uY2F0KGV2fHxhY3QpKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0YWN0LmZuLmNhbGwoYWN0LmFzLCBsYXN0LCBldnx8YWN0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8qb24ub24oJ2VtaXQnLCBmdW5jdGlvbihldil7XHJcblx0XHRcdFx0aWYoZXYub24ubWFwKXtcclxuXHRcdFx0XHRcdHZhciBpZCA9IGV2LmFyZy52aWEuZ3VuLl8uaWQgKyBldi5hcmcuZ2V0O1xyXG5cdFx0XHRcdFx0Ly9cclxuXHRcdFx0XHRcdC8vZXYuaWQgPSBldi5pZCB8fCBHdW4udGV4dC5yYW5kb20oNik7XHJcblx0XHRcdFx0XHQvL2V2Lm9uLm1hcFtldi5pZF0gPSBldi5hcmc7XHJcblx0XHRcdFx0XHQvL2V2LnByb3h5ID0gZXYuYXJnWzFdO1xyXG5cdFx0XHRcdFx0Ly9ldi5hcmcgPSBldi5hcmdbMF07XHJcblx0XHRcdFx0XHQvLyBiZWxvdyBnaXZlcyBtb3JlIGNvbnRyb2wuXHJcblx0XHRcdFx0XHRldi5vbi5tYXBbaWRdID0gZXYuYXJnO1xyXG5cdFx0XHRcdFx0Ly9ldi5wcm94eSA9IGV2LmFyZ1syXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZXYub24ubGFzdCA9IGV2LmFyZztcclxuXHRcdFx0fSk7Ki9cclxuXHJcblx0XHRcdG9uLm9uKCdlbWl0JywgZnVuY3Rpb24oZXYpe1xyXG5cdFx0XHRcdHZhciBndW4gPSBldi5hcmcuZ3VuO1xyXG5cdFx0XHRcdGlmKCdpbicgPT09IGV2LnRhZyAmJiBndW4gJiYgIWd1bi5fLnNvdWwpeyAvLyBUT0RPOiBCVUchIFNvdWwgc2hvdWxkIGJlIGF2YWlsYWJsZS4gQ3VycmVudGx5IG5vdCB1c2luZyBpdCB0aG91Z2gsIGJ1dCBzaG91bGQgZW5hYmxlIGl0IChjaGVjayBmb3Igc2lkZSBlZmZlY3RzIGlmIG1hZGUgYXZhaWxhYmxlKS5cclxuXHRcdFx0XHRcdChldi5vbi5tYXAgPSBldi5vbi5tYXAgfHwge30pW2d1bi5fLmlkIHx8IChndW4uXy5pZCA9IE1hdGgucmFuZG9tKCkpXSA9IGV2LmFyZztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZXYub24ubGFzdCA9IGV2LmFyZztcclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBvbjtcclxuXHRcdH1cclxuXHRcdG1vZHVsZS5leHBvcnRzID0gQ2hhaW47XHJcblx0fSkocmVxdWlyZSwgJy4vb25pZnknKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdC8vIEdlbmVyaWMgamF2YXNjcmlwdCBzY2hlZHVsZXIgdXRpbGl0eS5cclxuXHRcdHZhciBUeXBlID0gcmVxdWlyZSgnLi90eXBlJyk7XHJcblx0XHRmdW5jdGlvbiBzKHN0YXRlLCBjYiwgdGltZSl7IC8vIG1heWJlIHVzZSBscnUtY2FjaGU/XHJcblx0XHRcdHMudGltZSA9IHRpbWU7XHJcblx0XHRcdHMud2FpdGluZy5wdXNoKHt3aGVuOiBzdGF0ZSwgZXZlbnQ6IGNiIHx8IGZ1bmN0aW9uKCl7fX0pO1xyXG5cdFx0XHRpZihzLnNvb25lc3QgPCBzdGF0ZSl7IHJldHVybiB9XHJcblx0XHRcdHMuc2V0KHN0YXRlKTtcclxuXHRcdH1cclxuXHRcdHMud2FpdGluZyA9IFtdO1xyXG5cdFx0cy5zb29uZXN0ID0gSW5maW5pdHk7XHJcblx0XHRzLnNvcnQgPSBUeXBlLmxpc3Quc29ydCgnd2hlbicpO1xyXG5cdFx0cy5zZXQgPSBmdW5jdGlvbihmdXR1cmUpe1xyXG5cdFx0XHRpZihJbmZpbml0eSA8PSAocy5zb29uZXN0ID0gZnV0dXJlKSl7IHJldHVybiB9XHJcblx0XHRcdHZhciBub3cgPSBzLnRpbWUoKTtcclxuXHRcdFx0ZnV0dXJlID0gKGZ1dHVyZSA8PSBub3cpPyAwIDogKGZ1dHVyZSAtIG5vdyk7XHJcblx0XHRcdGNsZWFyVGltZW91dChzLmlkKTtcclxuXHRcdFx0cy5pZCA9IHNldFRpbWVvdXQocy5jaGVjaywgZnV0dXJlKTtcclxuXHRcdH1cclxuXHRcdHMuZWFjaCA9IGZ1bmN0aW9uKHdhaXQsIGksIG1hcCl7XHJcblx0XHRcdHZhciBjdHggPSB0aGlzO1xyXG5cdFx0XHRpZighd2FpdCl7IHJldHVybiB9XHJcblx0XHRcdGlmKHdhaXQud2hlbiA8PSBjdHgubm93KXtcclxuXHRcdFx0XHRpZih3YWl0LmV2ZW50IGluc3RhbmNlb2YgRnVuY3Rpb24pe1xyXG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpeyB3YWl0LmV2ZW50KCkgfSwwKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y3R4LnNvb25lc3QgPSAoY3R4LnNvb25lc3QgPCB3YWl0LndoZW4pPyBjdHguc29vbmVzdCA6IHdhaXQud2hlbjtcclxuXHRcdFx0XHRtYXAod2FpdCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHMuY2hlY2sgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgY3R4ID0ge25vdzogcy50aW1lKCksIHNvb25lc3Q6IEluZmluaXR5fTtcclxuXHRcdFx0cy53YWl0aW5nLnNvcnQocy5zb3J0KTtcclxuXHRcdFx0cy53YWl0aW5nID0gVHlwZS5saXN0Lm1hcChzLndhaXRpbmcsIHMuZWFjaCwgY3R4KSB8fCBbXTtcclxuXHRcdFx0cy5zZXQoY3R4LnNvb25lc3QpO1xyXG5cdFx0fVxyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBzO1xyXG5cdH0pKHJlcXVpcmUsICcuL3NjaGVkdWxlJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHQvKiBCYXNlZCBvbiB0aGUgSHlwb3RoZXRpY2FsIEFtbmVzaWEgTWFjaGluZSB0aG91Z2h0IGV4cGVyaW1lbnQgKi9cclxuXHRcdGZ1bmN0aW9uIEhBTShtYWNoaW5lU3RhdGUsIGluY29taW5nU3RhdGUsIGN1cnJlbnRTdGF0ZSwgaW5jb21pbmdWYWx1ZSwgY3VycmVudFZhbHVlKXtcclxuXHRcdFx0aWYobWFjaGluZVN0YXRlIDwgaW5jb21pbmdTdGF0ZSl7XHJcblx0XHRcdFx0cmV0dXJuIHtkZWZlcjogdHJ1ZX07IC8vIHRoZSBpbmNvbWluZyB2YWx1ZSBpcyBvdXRzaWRlIHRoZSBib3VuZGFyeSBvZiB0aGUgbWFjaGluZSdzIHN0YXRlLCBpdCBtdXN0IGJlIHJlcHJvY2Vzc2VkIGluIGFub3RoZXIgc3RhdGUuXHJcblx0XHRcdH1cclxuXHRcdFx0aWYoaW5jb21pbmdTdGF0ZSA8IGN1cnJlbnRTdGF0ZSl7XHJcblx0XHRcdFx0cmV0dXJuIHtoaXN0b3JpY2FsOiB0cnVlfTsgLy8gdGhlIGluY29taW5nIHZhbHVlIGlzIHdpdGhpbiB0aGUgYm91bmRhcnkgb2YgdGhlIG1hY2hpbmUncyBzdGF0ZSwgYnV0IG5vdCB3aXRoaW4gdGhlIHJhbmdlLlxyXG5cclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjdXJyZW50U3RhdGUgPCBpbmNvbWluZ1N0YXRlKXtcclxuXHRcdFx0XHRyZXR1cm4ge2NvbnZlcmdlOiB0cnVlLCBpbmNvbWluZzogdHJ1ZX07IC8vIHRoZSBpbmNvbWluZyB2YWx1ZSBpcyB3aXRoaW4gYm90aCB0aGUgYm91bmRhcnkgYW5kIHRoZSByYW5nZSBvZiB0aGUgbWFjaGluZSdzIHN0YXRlLlxyXG5cclxuXHRcdFx0fVxyXG5cdFx0XHRpZihpbmNvbWluZ1N0YXRlID09PSBjdXJyZW50U3RhdGUpe1xyXG5cdFx0XHRcdGluY29taW5nVmFsdWUgPSBMZXhpY2FsKGluY29taW5nVmFsdWUpIHx8IFwiXCI7XHJcblx0XHRcdFx0Y3VycmVudFZhbHVlID0gTGV4aWNhbChjdXJyZW50VmFsdWUpIHx8IFwiXCI7XHJcblx0XHRcdFx0aWYoaW5jb21pbmdWYWx1ZSA9PT0gY3VycmVudFZhbHVlKXsgLy8gTm90ZTogd2hpbGUgdGhlc2UgYXJlIHByYWN0aWNhbGx5IHRoZSBzYW1lLCB0aGUgZGVsdGFzIGNvdWxkIGJlIHRlY2huaWNhbGx5IGRpZmZlcmVudFxyXG5cdFx0XHRcdFx0cmV0dXJuIHtzdGF0ZTogdHJ1ZX07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8qXHJcblx0XHRcdFx0XHRUaGUgZm9sbG93aW5nIGlzIGEgbmFpdmUgaW1wbGVtZW50YXRpb24sIGJ1dCB3aWxsIGFsd2F5cyB3b3JrLlxyXG5cdFx0XHRcdFx0TmV2ZXIgY2hhbmdlIGl0IHVubGVzcyB5b3UgaGF2ZSBzcGVjaWZpYyBuZWVkcyB0aGF0IGFic29sdXRlbHkgcmVxdWlyZSBpdC5cclxuXHRcdFx0XHRcdElmIGNoYW5nZWQsIHlvdXIgZGF0YSB3aWxsIGRpdmVyZ2UgdW5sZXNzIHlvdSBndWFyYW50ZWUgZXZlcnkgcGVlcidzIGFsZ29yaXRobSBoYXMgYWxzbyBiZWVuIGNoYW5nZWQgdG8gYmUgdGhlIHNhbWUuXHJcblx0XHRcdFx0XHRBcyBhIHJlc3VsdCwgaXQgaXMgaGlnaGx5IGRpc2NvdXJhZ2VkIHRvIG1vZGlmeSBkZXNwaXRlIHRoZSBmYWN0IHRoYXQgaXQgaXMgbmFpdmUsXHJcblx0XHRcdFx0XHRiZWNhdXNlIGNvbnZlcmdlbmNlIChkYXRhIGludGVncml0eSkgaXMgZ2VuZXJhbGx5IG1vcmUgaW1wb3J0YW50LlxyXG5cdFx0XHRcdFx0QW55IGRpZmZlcmVuY2UgaW4gdGhpcyBhbGdvcml0aG0gbXVzdCBiZSBnaXZlbiBhIG5ldyBhbmQgZGlmZmVyZW50IG5hbWUuXHJcblx0XHRcdFx0Ki9cclxuXHRcdFx0XHRpZihpbmNvbWluZ1ZhbHVlIDwgY3VycmVudFZhbHVlKXsgLy8gTGV4aWNhbCBvbmx5IHdvcmtzIG9uIHNpbXBsZSB2YWx1ZSB0eXBlcyFcclxuXHRcdFx0XHRcdHJldHVybiB7Y29udmVyZ2U6IHRydWUsIGN1cnJlbnQ6IHRydWV9O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihjdXJyZW50VmFsdWUgPCBpbmNvbWluZ1ZhbHVlKXsgLy8gTGV4aWNhbCBvbmx5IHdvcmtzIG9uIHNpbXBsZSB2YWx1ZSB0eXBlcyFcclxuXHRcdFx0XHRcdHJldHVybiB7Y29udmVyZ2U6IHRydWUsIGluY29taW5nOiB0cnVlfTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHtlcnI6IFwiSW52YWxpZCBDUkRUIERhdGE6IFwiKyBpbmNvbWluZ1ZhbHVlICtcIiB0byBcIisgY3VycmVudFZhbHVlICtcIiBhdCBcIisgaW5jb21pbmdTdGF0ZSArXCIgdG8gXCIrIGN1cnJlbnRTdGF0ZSArXCIhXCJ9O1xyXG5cdFx0fVxyXG5cdFx0aWYodHlwZW9mIEpTT04gPT09ICd1bmRlZmluZWQnKXtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFxyXG5cdFx0XHRcdCdKU09OIGlzIG5vdCBpbmNsdWRlZCBpbiB0aGlzIGJyb3dzZXIuIFBsZWFzZSBsb2FkIGl0IGZpcnN0OiAnICtcclxuXHRcdFx0XHQnYWpheC5jZG5qcy5jb20vYWpheC9saWJzL2pzb24yLzIwMTEwMjIzL2pzb24yLmpzJ1xyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIExleGljYWwgPSBKU09OLnN0cmluZ2lmeSwgdW5kZWZpbmVkO1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBIQU07XHJcblx0fSkocmVxdWlyZSwgJy4vSEFNJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgVHlwZSA9IHJlcXVpcmUoJy4vdHlwZScpO1xyXG5cdFx0dmFyIFZhbCA9IHt9O1xyXG5cdFx0VmFsLmlzID0gZnVuY3Rpb24odil7IC8vIFZhbGlkIHZhbHVlcyBhcmUgYSBzdWJzZXQgb2YgSlNPTjogbnVsbCwgYmluYXJ5LCBudW1iZXIgKCFJbmZpbml0eSksIHRleHQsIG9yIGEgc291bCByZWxhdGlvbi4gQXJyYXlzIG5lZWQgc3BlY2lhbCBhbGdvcml0aG1zIHRvIGhhbmRsZSBjb25jdXJyZW5jeSwgc28gdGhleSBhcmUgbm90IHN1cHBvcnRlZCBkaXJlY3RseS4gVXNlIGFuIGV4dGVuc2lvbiB0aGF0IHN1cHBvcnRzIHRoZW0gaWYgbmVlZGVkIGJ1dCByZXNlYXJjaCB0aGVpciBwcm9ibGVtcyBmaXJzdC5cclxuXHRcdFx0aWYodiA9PT0gdSl7IHJldHVybiBmYWxzZSB9XHJcblx0XHRcdGlmKHYgPT09IG51bGwpeyByZXR1cm4gdHJ1ZSB9IC8vIFwiZGVsZXRlc1wiLCBudWxsaW5nIG91dCBmaWVsZHMuXHJcblx0XHRcdGlmKHYgPT09IEluZmluaXR5KXsgcmV0dXJuIGZhbHNlIH0gLy8gd2Ugd2FudCB0aGlzIHRvIGJlLCBidXQgSlNPTiBkb2VzIG5vdCBzdXBwb3J0IGl0LCBzYWQgZmFjZS5cclxuXHRcdFx0aWYodGV4dF9pcyh2KSAvLyBieSBcInRleHRcIiB3ZSBtZWFuIHN0cmluZ3MuXHJcblx0XHRcdHx8IGJpX2lzKHYpIC8vIGJ5IFwiYmluYXJ5XCIgd2UgbWVhbiBib29sZWFuLlxyXG5cdFx0XHR8fCBudW1faXModikpeyAvLyBieSBcIm51bWJlclwiIHdlIG1lYW4gaW50ZWdlcnMgb3IgZGVjaW1hbHMuIFxyXG5cdFx0XHRcdHJldHVybiB0cnVlOyAvLyBzaW1wbGUgdmFsdWVzIGFyZSB2YWxpZC5cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gVmFsLnJlbC5pcyh2KSB8fCBmYWxzZTsgLy8gaXMgdGhlIHZhbHVlIGEgc291bCByZWxhdGlvbj8gVGhlbiBpdCBpcyB2YWxpZCBhbmQgcmV0dXJuIGl0LiBJZiBub3QsIGV2ZXJ5dGhpbmcgZWxzZSByZW1haW5pbmcgaXMgYW4gaW52YWxpZCBkYXRhIHR5cGUuIEN1c3RvbSBleHRlbnNpb25zIGNhbiBiZSBidWlsdCBvbiB0b3Agb2YgdGhlc2UgcHJpbWl0aXZlcyB0byBzdXBwb3J0IG90aGVyIHR5cGVzLlxyXG5cdFx0fVxyXG5cdFx0VmFsLnJlbCA9IHtfOiAnIyd9O1xyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRWYWwucmVsLmlzID0gZnVuY3Rpb24odil7IC8vIHRoaXMgZGVmaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhIHNvdWwgcmVsYXRpb24gb3Igbm90LCB0aGV5IGxvb2sgbGlrZSB0aGlzOiB7JyMnOiAnVVVJRCd9XHJcblx0XHRcdFx0aWYodiAmJiB2W3JlbF9dICYmICF2Ll8gJiYgb2JqX2lzKHYpKXsgLy8gbXVzdCBiZSBhbiBvYmplY3QuXHJcblx0XHRcdFx0XHR2YXIgbyA9IHt9O1xyXG5cdFx0XHRcdFx0b2JqX21hcCh2LCBtYXAsIG8pO1xyXG5cdFx0XHRcdFx0aWYoby5pZCl7IC8vIGEgdmFsaWQgaWQgd2FzIGZvdW5kLlxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gby5pZDsgLy8geWF5ISBSZXR1cm4gaXQuXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZTsgLy8gdGhlIHZhbHVlIHdhcyBub3QgYSB2YWxpZCBzb3VsIHJlbGF0aW9uLlxyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcChzLCBmKXsgdmFyIG8gPSB0aGlzOyAvLyBtYXAgb3ZlciB0aGUgb2JqZWN0Li4uXHJcblx0XHRcdFx0aWYoby5pZCl7IHJldHVybiBvLmlkID0gZmFsc2UgfSAvLyBpZiBJRCBpcyBhbHJlYWR5IGRlZmluZWQgQU5EIHdlJ3JlIHN0aWxsIGxvb3BpbmcgdGhyb3VnaCB0aGUgb2JqZWN0LCBpdCBpcyBjb25zaWRlcmVkIGludmFsaWQuXHJcblx0XHRcdFx0aWYoZiA9PSByZWxfICYmIHRleHRfaXMocykpeyAvLyB0aGUgZmllbGQgc2hvdWxkIGJlICcjJyBhbmQgaGF2ZSBhIHRleHQgdmFsdWUuXHJcblx0XHRcdFx0XHRvLmlkID0gczsgLy8gd2UgZm91bmQgdGhlIHNvdWwhXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiBvLmlkID0gZmFsc2U7IC8vIGlmIHRoZXJlIGV4aXN0cyBhbnl0aGluZyBlbHNlIG9uIHRoZSBvYmplY3QgdGhhdCBpc24ndCB0aGUgc291bCwgdGhlbiBpdCBpcyBjb25zaWRlcmVkIGludmFsaWQuXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0VmFsLnJlbC5pZnkgPSBmdW5jdGlvbih0KXsgcmV0dXJuIG9ial9wdXQoe30sIHJlbF8sIHQpIH0gLy8gY29udmVydCBhIHNvdWwgaW50byBhIHJlbGF0aW9uIGFuZCByZXR1cm4gaXQuXHJcblx0XHR2YXIgcmVsXyA9IFZhbC5yZWwuXywgdTtcclxuXHRcdHZhciBiaV9pcyA9IFR5cGUuYmkuaXM7XHJcblx0XHR2YXIgbnVtX2lzID0gVHlwZS5udW0uaXM7XHJcblx0XHR2YXIgdGV4dF9pcyA9IFR5cGUudGV4dC5pcztcclxuXHRcdHZhciBvYmogPSBUeXBlLm9iaiwgb2JqX2lzID0gb2JqLmlzLCBvYmpfcHV0ID0gb2JqLnB1dCwgb2JqX21hcCA9IG9iai5tYXA7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IFZhbDtcclxuXHR9KShyZXF1aXJlLCAnLi92YWwnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBUeXBlID0gcmVxdWlyZSgnLi90eXBlJyk7XHJcblx0XHR2YXIgVmFsID0gcmVxdWlyZSgnLi92YWwnKTtcclxuXHRcdHZhciBOb2RlID0ge186ICdfJ307XHJcblx0XHROb2RlLnNvdWwgPSBmdW5jdGlvbihuLCBvKXsgcmV0dXJuIChuICYmIG4uXyAmJiBuLl9bbyB8fCBzb3VsX10pIH0gLy8gY29udmVuaWVuY2UgZnVuY3Rpb24gdG8gY2hlY2sgdG8gc2VlIGlmIHRoZXJlIGlzIGEgc291bCBvbiBhIG5vZGUgYW5kIHJldHVybiBpdC5cclxuXHRcdE5vZGUuc291bC5pZnkgPSBmdW5jdGlvbihuLCBvKXsgLy8gcHV0IGEgc291bCBvbiBhbiBvYmplY3QuXHJcblx0XHRcdG8gPSAodHlwZW9mIG8gPT09ICdzdHJpbmcnKT8ge3NvdWw6IG99IDogbyB8fCB7fTtcclxuXHRcdFx0biA9IG4gfHwge307IC8vIG1ha2Ugc3VyZSBpdCBleGlzdHMuXHJcblx0XHRcdG4uXyA9IG4uXyB8fCB7fTsgLy8gbWFrZSBzdXJlIG1ldGEgZXhpc3RzLlxyXG5cdFx0XHRuLl9bc291bF9dID0gby5zb3VsIHx8IG4uX1tzb3VsX10gfHwgdGV4dF9yYW5kb20oKTsgLy8gcHV0IHRoZSBzb3VsIG9uIGl0LlxyXG5cdFx0XHRyZXR1cm4gbjtcclxuXHRcdH1cclxuXHRcdE5vZGUuc291bC5fID0gVmFsLnJlbC5fO1xyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHROb2RlLmlzID0gZnVuY3Rpb24obiwgY2IsIGFzKXsgdmFyIHM7IC8vIGNoZWNrcyB0byBzZWUgaWYgYW4gb2JqZWN0IGlzIGEgdmFsaWQgbm9kZS5cclxuXHRcdFx0XHRpZighb2JqX2lzKG4pKXsgcmV0dXJuIGZhbHNlIH0gLy8gbXVzdCBiZSBhbiBvYmplY3QuXHJcblx0XHRcdFx0aWYocyA9IE5vZGUuc291bChuKSl7IC8vIG11c3QgaGF2ZSBhIHNvdWwgb24gaXQuXHJcblx0XHRcdFx0XHRyZXR1cm4gIW9ial9tYXAobiwgbWFwLCB7YXM6YXMsY2I6Y2IsczpzLG46bn0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7IC8vIG5vcGUhIFRoaXMgd2FzIG5vdCBhIHZhbGlkIG5vZGUuXHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbWFwKHYsIGYpeyAvLyB3ZSBpbnZlcnQgdGhpcyBiZWNhdXNlIHRoZSB3YXkgd2UgY2hlY2sgZm9yIHRoaXMgaXMgdmlhIGEgbmVnYXRpb24uXHJcblx0XHRcdFx0aWYoZiA9PT0gTm9kZS5fKXsgcmV0dXJuIH0gLy8gc2tpcCBvdmVyIHRoZSBtZXRhZGF0YS5cclxuXHRcdFx0XHRpZighVmFsLmlzKHYpKXsgcmV0dXJuIHRydWUgfSAvLyBpdCBpcyB0cnVlIHRoYXQgdGhpcyBpcyBhbiBpbnZhbGlkIG5vZGUuXHJcblx0XHRcdFx0aWYodGhpcy5jYil7IHRoaXMuY2IuY2FsbCh0aGlzLmFzLCB2LCBmLCB0aGlzLm4sIHRoaXMucykgfSAvLyBvcHRpb25hbGx5IGNhbGxiYWNrIGVhY2ggZmllbGQvdmFsdWUuXHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdE5vZGUuaWZ5ID0gZnVuY3Rpb24ob2JqLCBvLCBhcyl7IC8vIHJldHVybnMgYSBub2RlIGZyb20gYSBzaGFsbG93IG9iamVjdC5cclxuXHRcdFx0XHRpZighbyl7IG8gPSB7fSB9XHJcblx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgbyA9PT0gJ3N0cmluZycpeyBvID0ge3NvdWw6IG99IH1cclxuXHRcdFx0XHRlbHNlIGlmKG8gaW5zdGFuY2VvZiBGdW5jdGlvbil7IG8gPSB7bWFwOiBvfSB9XHJcblx0XHRcdFx0aWYoby5tYXApeyBvLm5vZGUgPSBvLm1hcC5jYWxsKGFzLCBvYmosIHUsIG8ubm9kZSB8fCB7fSkgfVxyXG5cdFx0XHRcdGlmKG8ubm9kZSA9IE5vZGUuc291bC5pZnkoby5ub2RlIHx8IHt9LCBvKSl7XHJcblx0XHRcdFx0XHRvYmpfbWFwKG9iaiwgbWFwLCB7bzpvLGFzOmFzfSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBvLm5vZGU7IC8vIFRoaXMgd2lsbCBvbmx5IGJlIGEgdmFsaWQgbm9kZSBpZiB0aGUgb2JqZWN0IHdhc24ndCBhbHJlYWR5IGRlZXAhXHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbWFwKHYsIGYpeyB2YXIgbyA9IHRoaXMubywgdG1wLCB1OyAvLyBpdGVyYXRlIG92ZXIgZWFjaCBmaWVsZC92YWx1ZS5cclxuXHRcdFx0XHRpZihvLm1hcCl7XHJcblx0XHRcdFx0XHR0bXAgPSBvLm1hcC5jYWxsKHRoaXMuYXMsIHYsICcnK2YsIG8ubm9kZSk7XHJcblx0XHRcdFx0XHRpZih1ID09PSB0bXApe1xyXG5cdFx0XHRcdFx0XHRvYmpfZGVsKG8ubm9kZSwgZik7XHJcblx0XHRcdFx0XHR9IGVsc2VcclxuXHRcdFx0XHRcdGlmKG8ubm9kZSl7IG8ubm9kZVtmXSA9IHRtcCB9XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKFZhbC5pcyh2KSl7XHJcblx0XHRcdFx0XHRvLm5vZGVbZl0gPSB2O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdHZhciBvYmogPSBUeXBlLm9iaiwgb2JqX2lzID0gb2JqLmlzLCBvYmpfZGVsID0gb2JqLmRlbCwgb2JqX21hcCA9IG9iai5tYXA7XHJcblx0XHR2YXIgdGV4dCA9IFR5cGUudGV4dCwgdGV4dF9yYW5kb20gPSB0ZXh0LnJhbmRvbTtcclxuXHRcdHZhciBzb3VsXyA9IE5vZGUuc291bC5fO1xyXG5cdFx0dmFyIHU7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IE5vZGU7XHJcblx0fSkocmVxdWlyZSwgJy4vbm9kZScpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIFR5cGUgPSByZXF1aXJlKCcuL3R5cGUnKTtcclxuXHRcdHZhciBOb2RlID0gcmVxdWlyZSgnLi9ub2RlJyk7XHJcblx0XHRmdW5jdGlvbiBTdGF0ZSgpe1xyXG5cdFx0XHR2YXIgdDtcclxuXHRcdFx0aWYocGVyZil7XHJcblx0XHRcdFx0dCA9IHN0YXJ0ICsgcGVyZi5ub3coKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0ID0gdGltZSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGxhc3QgPCB0KXtcclxuXHRcdFx0XHRyZXR1cm4gTiA9IDAsIGxhc3QgPSB0ICsgU3RhdGUuZHJpZnQ7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGxhc3QgPSB0ICsgKChOICs9IDEpIC8gRCkgKyBTdGF0ZS5kcmlmdDtcclxuXHRcdH1cclxuXHRcdHZhciB0aW1lID0gVHlwZS50aW1lLmlzLCBsYXN0ID0gLUluZmluaXR5LCBOID0gMCwgRCA9IDEwMDA7IC8vIFdBUk5JTkchIEluIHRoZSBmdXR1cmUsIG9uIG1hY2hpbmVzIHRoYXQgYXJlIEQgdGltZXMgZmFzdGVyIHRoYW4gMjAxNkFEIG1hY2hpbmVzLCB5b3Ugd2lsbCB3YW50IHRvIGluY3JlYXNlIEQgYnkgYW5vdGhlciBzZXZlcmFsIG9yZGVycyBvZiBtYWduaXR1ZGUgc28gdGhlIHByb2Nlc3Npbmcgc3BlZWQgbmV2ZXIgb3V0IHBhY2VzIHRoZSBkZWNpbWFsIHJlc29sdXRpb24gKGluY3JlYXNpbmcgYW4gaW50ZWdlciBlZmZlY3RzIHRoZSBzdGF0ZSBhY2N1cmFjeSkuXHJcblx0XHR2YXIgcGVyZiA9ICh0eXBlb2YgcGVyZm9ybWFuY2UgIT09ICd1bmRlZmluZWQnKT8gKHBlcmZvcm1hbmNlLnRpbWluZyAmJiBwZXJmb3JtYW5jZSkgOiBmYWxzZSwgc3RhcnQgPSAocGVyZiAmJiBwZXJmLnRpbWluZyAmJiBwZXJmLnRpbWluZy5uYXZpZ2F0aW9uU3RhcnQpIHx8IChwZXJmID0gZmFsc2UpO1xyXG5cdFx0U3RhdGUuXyA9ICc+JztcclxuXHRcdFN0YXRlLmRyaWZ0ID0gMDtcclxuXHRcdFN0YXRlLmlzID0gZnVuY3Rpb24obiwgZiwgbyl7IC8vIGNvbnZlbmllbmNlIGZ1bmN0aW9uIHRvIGdldCB0aGUgc3RhdGUgb24gYSBmaWVsZCBvbiBhIG5vZGUgYW5kIHJldHVybiBpdC5cclxuXHRcdFx0dmFyIHRtcCA9IChmICYmIG4gJiYgbltOX10gJiYgbltOX11bU3RhdGUuX10pIHx8IG87XHJcblx0XHRcdGlmKCF0bXApeyByZXR1cm4gfVxyXG5cdFx0XHRyZXR1cm4gbnVtX2lzKHRtcCA9IHRtcFtmXSk/IHRtcCA6IC1JbmZpbml0eTtcclxuXHRcdH1cclxuXHRcdFN0YXRlLmlmeSA9IGZ1bmN0aW9uKG4sIGYsIHMsIHYsIHNvdWwpeyAvLyBwdXQgYSBmaWVsZCdzIHN0YXRlIG9uIGEgbm9kZS5cclxuXHRcdFx0aWYoIW4gfHwgIW5bTl9dKXsgLy8gcmVqZWN0IGlmIGl0IGlzIG5vdCBub2RlLWxpa2UuXHJcblx0XHRcdFx0aWYoIXNvdWwpeyAvLyB1bmxlc3MgdGhleSBwYXNzZWQgYSBzb3VsXHJcblx0XHRcdFx0XHRyZXR1cm47IFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuID0gTm9kZS5zb3VsLmlmeShuLCBzb3VsKTsgLy8gdGhlbiBtYWtlIGl0IHNvIVxyXG5cdFx0XHR9IFxyXG5cdFx0XHR2YXIgdG1wID0gb2JqX2FzKG5bTl9dLCBTdGF0ZS5fKTsgLy8gZ3JhYiB0aGUgc3RhdGVzIGRhdGEuXHJcblx0XHRcdGlmKHUgIT09IGYgJiYgZiAhPT0gTl8pe1xyXG5cdFx0XHRcdGlmKG51bV9pcyhzKSl7XHJcblx0XHRcdFx0XHR0bXBbZl0gPSBzOyAvLyBhZGQgdGhlIHZhbGlkIHN0YXRlLlxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZih1ICE9PSB2KXsgLy8gTm90ZTogTm90IGl0cyBqb2IgdG8gY2hlY2sgZm9yIHZhbGlkIHZhbHVlcyFcclxuXHRcdFx0XHRcdG5bZl0gPSB2O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gbjtcclxuXHRcdH1cclxuXHRcdFN0YXRlLnRvID0gZnVuY3Rpb24oZnJvbSwgZiwgdG8pe1xyXG5cdFx0XHR2YXIgdmFsID0gZnJvbVtmXTtcclxuXHRcdFx0aWYob2JqX2lzKHZhbCkpe1xyXG5cdFx0XHRcdHZhbCA9IG9ial9jb3B5KHZhbCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIFN0YXRlLmlmeSh0bywgZiwgU3RhdGUuaXMoZnJvbSwgZiksIHZhbCwgTm9kZS5zb3VsKGZyb20pKTtcclxuXHRcdH1cclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0U3RhdGUubWFwID0gZnVuY3Rpb24oY2IsIHMsIGFzKXsgdmFyIHU7IC8vIGZvciB1c2Ugd2l0aCBOb2RlLmlmeVxyXG5cdFx0XHRcdHZhciBvID0gb2JqX2lzKG8gPSBjYiB8fCBzKT8gbyA6IG51bGw7XHJcblx0XHRcdFx0Y2IgPSBmbl9pcyhjYiA9IGNiIHx8IHMpPyBjYiA6IG51bGw7XHJcblx0XHRcdFx0aWYobyAmJiAhY2Ipe1xyXG5cdFx0XHRcdFx0cyA9IG51bV9pcyhzKT8gcyA6IFN0YXRlKCk7XHJcblx0XHRcdFx0XHRvW05fXSA9IG9bTl9dIHx8IHt9O1xyXG5cdFx0XHRcdFx0b2JqX21hcChvLCBtYXAsIHtvOm8sczpzfSk7XHJcblx0XHRcdFx0XHRyZXR1cm4gbztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YXMgPSBhcyB8fCBvYmpfaXMocyk/IHMgOiB1O1xyXG5cdFx0XHRcdHMgPSBudW1faXMocyk/IHMgOiBTdGF0ZSgpO1xyXG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbih2LCBmLCBvLCBvcHQpe1xyXG5cdFx0XHRcdFx0aWYoIWNiKXtcclxuXHRcdFx0XHRcdFx0bWFwLmNhbGwoe286IG8sIHM6IHN9LCB2LGYpO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNiLmNhbGwoYXMgfHwgdGhpcyB8fCB7fSwgdiwgZiwgbywgb3B0KTtcclxuXHRcdFx0XHRcdGlmKG9ial9oYXMobyxmKSAmJiB1ID09PSBvW2ZdKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdG1hcC5jYWxsKHtvOiBvLCBzOiBzfSwgdixmKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbWFwKHYsZil7XHJcblx0XHRcdFx0aWYoTl8gPT09IGYpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFN0YXRlLmlmeSh0aGlzLm8sIGYsIHRoaXMucykgO1xyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0dmFyIG9iaiA9IFR5cGUub2JqLCBvYmpfYXMgPSBvYmouYXMsIG9ial9oYXMgPSBvYmouaGFzLCBvYmpfaXMgPSBvYmouaXMsIG9ial9tYXAgPSBvYmoubWFwLCBvYmpfY29weSA9IG9iai5jb3B5O1xyXG5cdFx0dmFyIG51bSA9IFR5cGUubnVtLCBudW1faXMgPSBudW0uaXM7XHJcblx0XHR2YXIgZm4gPSBUeXBlLmZuLCBmbl9pcyA9IGZuLmlzO1xyXG5cdFx0dmFyIE5fID0gTm9kZS5fLCB1O1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBTdGF0ZTtcclxuXHR9KShyZXF1aXJlLCAnLi9zdGF0ZScpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIFR5cGUgPSByZXF1aXJlKCcuL3R5cGUnKTtcclxuXHRcdHZhciBWYWwgPSByZXF1aXJlKCcuL3ZhbCcpO1xyXG5cdFx0dmFyIE5vZGUgPSByZXF1aXJlKCcuL25vZGUnKTtcclxuXHRcdHZhciBHcmFwaCA9IHt9O1xyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRHcmFwaC5pcyA9IGZ1bmN0aW9uKGcsIGNiLCBmbiwgYXMpeyAvLyBjaGVja3MgdG8gc2VlIGlmIGFuIG9iamVjdCBpcyBhIHZhbGlkIGdyYXBoLlxyXG5cdFx0XHRcdGlmKCFnIHx8ICFvYmpfaXMoZykgfHwgb2JqX2VtcHR5KGcpKXsgcmV0dXJuIGZhbHNlIH0gLy8gbXVzdCBiZSBhbiBvYmplY3QuXHJcblx0XHRcdFx0cmV0dXJuICFvYmpfbWFwKGcsIG1hcCwge2NiOmNiLGZuOmZuLGFzOmFzfSk7IC8vIG1ha2VzIHN1cmUgaXQgd2Fzbid0IGFuIGVtcHR5IG9iamVjdC5cclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBtYXAobiwgcyl7IC8vIHdlIGludmVydCB0aGlzIGJlY2F1c2UgdGhlIHdheSc/IHdlIGNoZWNrIGZvciB0aGlzIGlzIHZpYSBhIG5lZ2F0aW9uLlxyXG5cdFx0XHRcdGlmKCFuIHx8IHMgIT09IE5vZGUuc291bChuKSB8fCAhTm9kZS5pcyhuLCB0aGlzLmZuLCB0aGlzLmFzKSl7IHJldHVybiB0cnVlIH0gLy8gaXQgaXMgdHJ1ZSB0aGF0IHRoaXMgaXMgYW4gaW52YWxpZCBncmFwaC5cclxuXHRcdFx0XHRpZighdGhpcy5jYil7IHJldHVybiB9XHJcblx0XHRcdFx0bmYubiA9IG47IG5mLmFzID0gdGhpcy5hczsgLy8gc2VxdWVudGlhbCByYWNlIGNvbmRpdGlvbnMgYXJlbid0IHJhY2VzLlxyXG5cdFx0XHRcdHRoaXMuY2IuY2FsbChuZi5hcywgbiwgcywgbmYpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG5mKGZuKXsgLy8gb3B0aW9uYWwgY2FsbGJhY2sgZm9yIGVhY2ggbm9kZS5cclxuXHRcdFx0XHRpZihmbil7IE5vZGUuaXMobmYubiwgZm4sIG5mLmFzKSB9IC8vIHdoZXJlIHdlIHRoZW4gaGF2ZSBhbiBvcHRpb25hbCBjYWxsYmFjayBmb3IgZWFjaCBmaWVsZC92YWx1ZS5cclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0R3JhcGguaWZ5ID0gZnVuY3Rpb24ob2JqLCBlbnYsIGFzKXtcclxuXHRcdFx0XHR2YXIgYXQgPSB7cGF0aDogW10sIG9iajogb2JqfTtcclxuXHRcdFx0XHRpZighZW52KXtcclxuXHRcdFx0XHRcdGVudiA9IHt9O1xyXG5cdFx0XHRcdH0gZWxzZVxyXG5cdFx0XHRcdGlmKHR5cGVvZiBlbnYgPT09ICdzdHJpbmcnKXtcclxuXHRcdFx0XHRcdGVudiA9IHtzb3VsOiBlbnZ9O1xyXG5cdFx0XHRcdH0gZWxzZVxyXG5cdFx0XHRcdGlmKGVudiBpbnN0YW5jZW9mIEZ1bmN0aW9uKXtcclxuXHRcdFx0XHRcdGVudi5tYXAgPSBlbnY7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGVudi5zb3VsKXtcclxuXHRcdFx0XHRcdGF0LnJlbCA9IFZhbC5yZWwuaWZ5KGVudi5zb3VsKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZW52LmdyYXBoID0gZW52LmdyYXBoIHx8IHt9O1xyXG5cdFx0XHRcdGVudi5zZWVuID0gZW52LnNlZW4gfHwgW107XHJcblx0XHRcdFx0ZW52LmFzID0gZW52LmFzIHx8IGFzO1xyXG5cdFx0XHRcdG5vZGUoZW52LCBhdCk7XHJcblx0XHRcdFx0ZW52LnJvb3QgPSBhdC5ub2RlO1xyXG5cdFx0XHRcdHJldHVybiBlbnYuZ3JhcGg7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbm9kZShlbnYsIGF0KXsgdmFyIHRtcDtcclxuXHRcdFx0XHRpZih0bXAgPSBzZWVuKGVudiwgYXQpKXsgcmV0dXJuIHRtcCB9XHJcblx0XHRcdFx0YXQuZW52ID0gZW52O1xyXG5cdFx0XHRcdGF0LnNvdWwgPSBzb3VsO1xyXG5cdFx0XHRcdGlmKE5vZGUuaWZ5KGF0Lm9iaiwgbWFwLCBhdCkpe1xyXG5cdFx0XHRcdFx0Ly9hdC5yZWwgPSBhdC5yZWwgfHwgVmFsLnJlbC5pZnkoTm9kZS5zb3VsKGF0Lm5vZGUpKTtcclxuXHRcdFx0XHRcdGVudi5ncmFwaFtWYWwucmVsLmlzKGF0LnJlbCldID0gYXQubm9kZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGF0O1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcCh2LGYsbil7XHJcblx0XHRcdFx0dmFyIGF0ID0gdGhpcywgZW52ID0gYXQuZW52LCBpcywgdG1wO1xyXG5cdFx0XHRcdGlmKE5vZGUuXyA9PT0gZiAmJiBvYmpfaGFzKHYsVmFsLnJlbC5fKSl7XHJcblx0XHRcdFx0XHRyZXR1cm4gbi5fOyAvLyBUT0RPOiBCdWc/XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKCEoaXMgPSB2YWxpZCh2LGYsbiwgYXQsZW52KSkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGlmKCFmKXtcclxuXHRcdFx0XHRcdGF0Lm5vZGUgPSBhdC5ub2RlIHx8IG4gfHwge307XHJcblx0XHRcdFx0XHRpZihvYmpfaGFzKHYsIE5vZGUuXykpe1xyXG5cdFx0XHRcdFx0XHRhdC5ub2RlLl8gPSBvYmpfY29weSh2Ll8pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YXQubm9kZSA9IE5vZGUuc291bC5pZnkoYXQubm9kZSwgVmFsLnJlbC5pcyhhdC5yZWwpKTtcclxuXHRcdFx0XHRcdGF0LnJlbCA9IGF0LnJlbCB8fCBWYWwucmVsLmlmeShOb2RlLnNvdWwoYXQubm9kZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZih0bXAgPSBlbnYubWFwKXtcclxuXHRcdFx0XHRcdHRtcC5jYWxsKGVudi5hcyB8fCB7fSwgdixmLG4sIGF0KTtcclxuXHRcdFx0XHRcdGlmKG9ial9oYXMobixmKSl7XHJcblx0XHRcdFx0XHRcdHYgPSBuW2ZdO1xyXG5cdFx0XHRcdFx0XHRpZih1ID09PSB2KXtcclxuXHRcdFx0XHRcdFx0XHRvYmpfZGVsKG4sIGYpO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZighKGlzID0gdmFsaWQodixmLG4sIGF0LGVudikpKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoIWYpeyByZXR1cm4gYXQubm9kZSB9XHJcblx0XHRcdFx0aWYodHJ1ZSA9PT0gaXMpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHY7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRtcCA9IG5vZGUoZW52LCB7b2JqOiB2LCBwYXRoOiBhdC5wYXRoLmNvbmNhdChmKX0pO1xyXG5cdFx0XHRcdGlmKCF0bXAubm9kZSl7IHJldHVybiB9XHJcblx0XHRcdFx0cmV0dXJuIHRtcC5yZWw7IC8veycjJzogTm9kZS5zb3VsKHRtcC5ub2RlKX07XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gc291bChpZCl7IHZhciBhdCA9IHRoaXM7XHJcblx0XHRcdFx0dmFyIHByZXYgPSBWYWwucmVsLmlzKGF0LnJlbCksIGdyYXBoID0gYXQuZW52LmdyYXBoO1xyXG5cdFx0XHRcdGF0LnJlbCA9IGF0LnJlbCB8fCBWYWwucmVsLmlmeShpZCk7XHJcblx0XHRcdFx0YXQucmVsW1ZhbC5yZWwuX10gPSBpZDtcclxuXHRcdFx0XHRpZihhdC5ub2RlICYmIGF0Lm5vZGVbTm9kZS5fXSl7XHJcblx0XHRcdFx0XHRhdC5ub2RlW05vZGUuX11bVmFsLnJlbC5fXSA9IGlkO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihvYmpfaGFzKGdyYXBoLCBwcmV2KSl7XHJcblx0XHRcdFx0XHRncmFwaFtpZF0gPSBncmFwaFtwcmV2XTtcclxuXHRcdFx0XHRcdG9ial9kZWwoZ3JhcGgsIHByZXYpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiB2YWxpZCh2LGYsbiwgYXQsZW52KXsgdmFyIHRtcDtcclxuXHRcdFx0XHRpZihWYWwuaXModikpeyByZXR1cm4gdHJ1ZSB9XHJcblx0XHRcdFx0aWYob2JqX2lzKHYpKXsgcmV0dXJuIDEgfVxyXG5cdFx0XHRcdGlmKHRtcCA9IGVudi5pbnZhbGlkKXtcclxuXHRcdFx0XHRcdHYgPSB0bXAuY2FsbChlbnYuYXMgfHwge30sIHYsZixuKTtcclxuXHRcdFx0XHRcdHJldHVybiB2YWxpZCh2LGYsbiwgYXQsZW52KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZW52LmVyciA9IFwiSW52YWxpZCB2YWx1ZSBhdCAnXCIgKyBhdC5wYXRoLmNvbmNhdChmKS5qb2luKCcuJykgKyBcIichXCI7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gc2VlbihlbnYsIGF0KXtcclxuXHRcdFx0XHR2YXIgYXJyID0gZW52LnNlZW4sIGkgPSBhcnIubGVuZ3RoLCBoYXM7XHJcblx0XHRcdFx0d2hpbGUoaS0tKXsgaGFzID0gYXJyW2ldO1xyXG5cdFx0XHRcdFx0aWYoYXQub2JqID09PSBoYXMub2JqKXsgcmV0dXJuIGhhcyB9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGFyci5wdXNoKGF0KTtcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdEdyYXBoLm5vZGUgPSBmdW5jdGlvbihub2RlKXtcclxuXHRcdFx0dmFyIHNvdWwgPSBOb2RlLnNvdWwobm9kZSk7XHJcblx0XHRcdGlmKCFzb3VsKXsgcmV0dXJuIH1cclxuXHRcdFx0cmV0dXJuIG9ial9wdXQoe30sIHNvdWwsIG5vZGUpO1xyXG5cdFx0fVxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRHcmFwaC50byA9IGZ1bmN0aW9uKGdyYXBoLCByb290LCBvcHQpe1xyXG5cdFx0XHRcdGlmKCFncmFwaCl7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIG9iaiA9IHt9O1xyXG5cdFx0XHRcdG9wdCA9IG9wdCB8fCB7c2Vlbjoge319O1xyXG5cdFx0XHRcdG9ial9tYXAoZ3JhcGhbcm9vdF0sIG1hcCwge29iajpvYmosIGdyYXBoOiBncmFwaCwgb3B0OiBvcHR9KTtcclxuXHRcdFx0XHRyZXR1cm4gb2JqO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcCh2LGYpeyB2YXIgdG1wLCBvYmo7XHJcblx0XHRcdFx0aWYoTm9kZS5fID09PSBmKXtcclxuXHRcdFx0XHRcdGlmKG9ial9lbXB0eSh2LCBWYWwucmVsLl8pKXtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dGhpcy5vYmpbZl0gPSBvYmpfY29weSh2KTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoISh0bXAgPSBWYWwucmVsLmlzKHYpKSl7XHJcblx0XHRcdFx0XHR0aGlzLm9ialtmXSA9IHY7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKG9iaiA9IHRoaXMub3B0LnNlZW5bdG1wXSl7XHJcblx0XHRcdFx0XHR0aGlzLm9ialtmXSA9IG9iajtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5vYmpbZl0gPSB0aGlzLm9wdC5zZWVuW3RtcF0gPSBHcmFwaC50byh0aGlzLmdyYXBoLCB0bXAsIHRoaXMub3B0KTtcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdHZhciBmbl9pcyA9IFR5cGUuZm4uaXM7XHJcblx0XHR2YXIgb2JqID0gVHlwZS5vYmosIG9ial9pcyA9IG9iai5pcywgb2JqX2RlbCA9IG9iai5kZWwsIG9ial9oYXMgPSBvYmouaGFzLCBvYmpfZW1wdHkgPSBvYmouZW1wdHksIG9ial9wdXQgPSBvYmoucHV0LCBvYmpfbWFwID0gb2JqLm1hcCwgb2JqX2NvcHkgPSBvYmouY29weTtcclxuXHRcdHZhciB1O1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBHcmFwaDtcclxuXHR9KShyZXF1aXJlLCAnLi9ncmFwaCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIFR5cGUgPSByZXF1aXJlKCcuL3R5cGUnKTtcclxuXHRcdGZ1bmN0aW9uIER1cCgpe1xyXG5cdFx0XHR0aGlzLmNhY2hlID0ge307XHJcblx0XHR9XHJcblx0XHREdXAucHJvdG90eXBlLnRyYWNrID0gZnVuY3Rpb24oaWQpe1xyXG5cdFx0XHR0aGlzLmNhY2hlW2lkXSA9IFR5cGUudGltZS5pcygpO1xyXG5cdFx0XHRpZiAoIXRoaXMudG8pIHtcclxuXHRcdFx0XHR0aGlzLmdjKCk7IC8vIEVuZ2FnZSBHQy5cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gaWQ7XHJcblx0XHR9O1xyXG5cdFx0RHVwLnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGlkKXtcclxuXHRcdFx0Ly8gSGF2ZSB3ZSBzZWVuIHRoaXMgSUQgcmVjZW50bHk/XHJcblx0XHRcdHJldHVybiBUeXBlLm9iai5oYXModGhpcy5jYWNoZSwgaWQpPyB0aGlzLnRyYWNrKGlkKSA6IGZhbHNlOyAvLyBJbXBvcnRhbnQsIGJ1bXAgdGhlIElEJ3MgbGl2ZWxpbmVzcyBpZiBpdCBoYXMgYWxyZWFkeSBiZWVuIHNlZW4gYmVmb3JlIC0gdGhpcyBpcyBjcml0aWNhbCB0byBzdG9wcGluZyBicm9hZGNhc3Qgc3Rvcm1zLlxyXG5cdFx0fVxyXG5cdFx0RHVwLnByb3RvdHlwZS5nYyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBkZSA9IHRoaXMsIG5vdyA9IFR5cGUudGltZS5pcygpLCBvbGRlc3QgPSBub3csIG1heEFnZSA9IDUgKiA2MCAqIDEwMDA7XHJcblx0XHRcdC8vIFRPRE86IEd1bi5zY2hlZHVsZXIgYWxyZWFkeSBkb2VzIHRoaXM/IFJldXNlIHRoYXQuXHJcblx0XHRcdFR5cGUub2JqLm1hcChkZS5jYWNoZSwgZnVuY3Rpb24odGltZSwgaWQpe1xyXG5cdFx0XHRcdG9sZGVzdCA9IE1hdGgubWluKG5vdywgdGltZSk7XHJcblx0XHRcdFx0aWYgKChub3cgLSB0aW1lKSA8IG1heEFnZSl7IHJldHVybiB9XHJcblx0XHRcdFx0VHlwZS5vYmouZGVsKGRlLmNhY2hlLCBpZCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHR2YXIgZG9uZSA9IFR5cGUub2JqLmVtcHR5KGRlLmNhY2hlKTtcclxuXHRcdFx0aWYoZG9uZSl7XHJcblx0XHRcdFx0ZGUudG8gPSBudWxsOyAvLyBEaXNlbmdhZ2UgR0MuXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBlbGFwc2VkID0gbm93IC0gb2xkZXN0OyAvLyBKdXN0IGhvdyBvbGQ/XHJcblx0XHRcdHZhciBuZXh0R0MgPSBtYXhBZ2UgLSBlbGFwc2VkOyAvLyBIb3cgbG9uZyBiZWZvcmUgaXQncyB0b28gb2xkP1xyXG5cdFx0XHRkZS50byA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgZGUuZ2MoKSB9LCBuZXh0R0MpOyAvLyBTY2hlZHVsZSB0aGUgbmV4dCBHQyBldmVudC5cclxuXHRcdH1cclxuXHRcdG1vZHVsZS5leHBvcnRzID0gRHVwO1xyXG5cdH0pKHJlcXVpcmUsICcuL2R1cCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cclxuXHRcdGZ1bmN0aW9uIEd1bihvKXtcclxuXHRcdFx0aWYobyBpbnN0YW5jZW9mIEd1bil7IHJldHVybiAodGhpcy5fID0ge2d1bjogdGhpc30pLmd1biB9XHJcblx0XHRcdGlmKCEodGhpcyBpbnN0YW5jZW9mIEd1bikpeyByZXR1cm4gbmV3IEd1bihvKSB9XHJcblx0XHRcdHJldHVybiBHdW4uY3JlYXRlKHRoaXMuXyA9IHtndW46IHRoaXMsIG9wdDogb30pO1xyXG5cdFx0fVxyXG5cclxuXHRcdEd1bi5pcyA9IGZ1bmN0aW9uKGd1bil7IHJldHVybiAoZ3VuIGluc3RhbmNlb2YgR3VuKSB9XHJcblxyXG5cdFx0R3VuLnZlcnNpb24gPSAwLjc7XHJcblxyXG5cdFx0R3VuLmNoYWluID0gR3VuLnByb3RvdHlwZTtcclxuXHRcdEd1bi5jaGFpbi50b0pTT04gPSBmdW5jdGlvbigpe307XHJcblxyXG5cdFx0dmFyIFR5cGUgPSByZXF1aXJlKCcuL3R5cGUnKTtcclxuXHRcdFR5cGUub2JqLnRvKFR5cGUsIEd1bik7XHJcblx0XHRHdW4uSEFNID0gcmVxdWlyZSgnLi9IQU0nKTtcclxuXHRcdEd1bi52YWwgPSByZXF1aXJlKCcuL3ZhbCcpO1xyXG5cdFx0R3VuLm5vZGUgPSByZXF1aXJlKCcuL25vZGUnKTtcclxuXHRcdEd1bi5zdGF0ZSA9IHJlcXVpcmUoJy4vc3RhdGUnKTtcclxuXHRcdEd1bi5ncmFwaCA9IHJlcXVpcmUoJy4vZ3JhcGgnKTtcclxuXHRcdEd1bi5kdXAgPSByZXF1aXJlKCcuL2R1cCcpO1xyXG5cdFx0R3VuLnNjaGVkdWxlID0gcmVxdWlyZSgnLi9zY2hlZHVsZScpO1xyXG5cdFx0R3VuLm9uID0gcmVxdWlyZSgnLi9vbmlmeScpKCk7XHJcblx0XHRcclxuXHRcdEd1bi5fID0geyAvLyBzb21lIHJlc2VydmVkIGtleSB3b3JkcywgdGhlc2UgYXJlIG5vdCB0aGUgb25seSBvbmVzLlxyXG5cdFx0XHRub2RlOiBHdW4ubm9kZS5fIC8vIGFsbCBtZXRhZGF0YSBvZiBhIG5vZGUgaXMgc3RvcmVkIGluIHRoZSBtZXRhIHByb3BlcnR5IG9uIHRoZSBub2RlLlxyXG5cdFx0XHQsc291bDogR3VuLnZhbC5yZWwuXyAvLyBhIHNvdWwgaXMgYSBVVUlEIG9mIGEgbm9kZSBidXQgaXQgYWx3YXlzIHBvaW50cyB0byB0aGUgXCJsYXRlc3RcIiBkYXRhIGtub3duLlxyXG5cdFx0XHQsc3RhdGU6IEd1bi5zdGF0ZS5fIC8vIG90aGVyIHRoYW4gdGhlIHNvdWwsIHdlIHN0b3JlIEhBTSBtZXRhZGF0YS5cclxuXHRcdFx0LGZpZWxkOiAnLicgLy8gYSBmaWVsZCBpcyBhIHByb3BlcnR5IG9uIGEgbm9kZSB3aGljaCBwb2ludHMgdG8gYSB2YWx1ZS5cclxuXHRcdFx0LHZhbHVlOiAnPScgLy8gdGhlIHByaW1pdGl2ZSB2YWx1ZS5cclxuXHRcdH1cclxuXHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdEd1bi5jcmVhdGUgPSBmdW5jdGlvbihhdCl7XHJcblx0XHRcdFx0YXQub24gPSBhdC5vbiB8fCBHdW4ub247XHJcblx0XHRcdFx0YXQucm9vdCA9IGF0LnJvb3QgfHwgYXQuZ3VuO1xyXG5cdFx0XHRcdGF0LmdyYXBoID0gYXQuZ3JhcGggfHwge307XHJcblx0XHRcdFx0YXQuZHVwID0gYXQuZHVwIHx8IG5ldyBHdW4uZHVwO1xyXG5cdFx0XHRcdGF0LmFzayA9IEd1bi5vbi5hc2s7XHJcblx0XHRcdFx0YXQuYWNrID0gR3VuLm9uLmFjaztcclxuXHRcdFx0XHR2YXIgZ3VuID0gYXQuZ3VuLm9wdChhdC5vcHQpO1xyXG5cdFx0XHRcdGlmKCFhdC5vbmNlKXtcclxuXHRcdFx0XHRcdGF0Lm9uKCdpbicsIHJvb3QsIGF0KTtcclxuXHRcdFx0XHRcdGF0Lm9uKCdvdXQnLCByb290LCBhdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGF0Lm9uY2UgPSAxO1xyXG5cdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gcm9vdChhdCl7XHJcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcImFkZCB0by5uZXh0KGF0KVwiKTsgLy8gVE9ETzogQlVHISEhXHJcblx0XHRcdFx0dmFyIGV2ID0gdGhpcywgY2F0ID0gZXYuYXMsIGNvYXQ7XHJcblx0XHRcdFx0aWYoIWF0Lmd1bil7IGF0Lmd1biA9IGNhdC5ndW4gfVxyXG5cdFx0XHRcdGlmKCFhdFsnIyddKXsgYXRbJyMnXSA9IEd1bi50ZXh0LnJhbmRvbSgpIH0gLy8gVE9ETzogVXNlIHdoYXQgaXMgdXNlZCBvdGhlciBwbGFjZXMgaW5zdGVhZC5cclxuXHRcdFx0XHRpZihjYXQuZHVwLmNoZWNrKGF0WycjJ10pKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRpZihhdFsnQCddKXtcclxuXHRcdFx0XHRcdC8vIFRPRE86IEJVRyEgRm9yIG11bHRpLWluc3RhbmNlcywgdGhlIFwiYWNrXCIgc3lzdGVtIGlzIGdsb2JhbGx5IHNoYXJlZCwgYnV0IGl0IHNob3VsZG4ndCBiZS5cclxuXHRcdFx0XHRcdGlmKGNhdC5hY2soYXRbJ0AnXSwgYXQpKXsgcmV0dXJuIH0gLy8gVE9ETzogQ29uc2lkZXIgbm90IHJldHVybmluZyBoZXJlLCBtYXliZSwgd2hlcmUgdGhpcyB3b3VsZCBsZXQgdGhlIFwiaGFuZHNoYWtlXCIgb24gc3luYyBvY2N1ciBmb3IgSG9seSBHcmFpbD9cclxuXHRcdFx0XHRcdGNhdC5kdXAudHJhY2soYXRbJyMnXSk7XHJcblx0XHRcdFx0XHRHdW4ub24oJ291dCcsIG9ial90byhhdCwge2d1bjogY2F0Lmd1bn0pKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2F0LmR1cC50cmFjayhhdFsnIyddKTtcclxuXHRcdFx0XHQvL2lmKGNhdC5hY2soYXRbJ0AnXSwgYXQpKXsgcmV0dXJuIH1cclxuXHRcdFx0XHQvL2NhdC5hY2soYXRbJ0AnXSwgYXQpO1xyXG5cdFx0XHRcdGNvYXQgPSBvYmpfdG8oYXQsIHtndW46IGNhdC5ndW59KTtcclxuXHRcdFx0XHRpZihhdC5nZXQpe1xyXG5cdFx0XHRcdFx0Ly9HdW4ub24uR0VUKGNvYXQpO1xyXG5cdFx0XHRcdFx0R3VuLm9uKCdnZXQnLCBjb2F0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoYXQucHV0KXtcclxuXHRcdFx0XHRcdC8vR3VuLm9uLlBVVChjb2F0KTtcclxuXHRcdFx0XHRcdEd1bi5vbigncHV0JywgY29hdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdEd1bi5vbignb3V0JywgY29hdCk7XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRHdW4ub24oJ3B1dCcsIGZ1bmN0aW9uKGF0KXtcclxuXHRcdFx0Ly9HdW4ub24uUFVUID0gZnVuY3Rpb24oYXQpe1xyXG5cdFx0XHRcdGlmKCFhdFsnIyddKXsgcmV0dXJuIHRoaXMudG8ubmV4dChhdCkgfSAvLyBmb3IgdGVzdHMuXHJcblx0XHRcdFx0dmFyIGV2ID0gdGhpcywgY3R4ID0ge2d1bjogYXQuZ3VuLCBncmFwaDogYXQuZ3VuLl8uZ3JhcGgsIHB1dDoge30sIG1hcDoge30sIG1hY2hpbmU6IEd1bi5zdGF0ZSgpfTtcclxuXHRcdFx0XHRpZighR3VuLmdyYXBoLmlzKGF0LnB1dCwgbnVsbCwgdmVyaWZ5LCBjdHgpKXsgY3R4LmVyciA9IFwiRXJyb3I6IEludmFsaWQgZ3JhcGghXCIgfVxyXG5cdFx0XHRcdGlmKGN0eC5lcnIpeyByZXR1cm4gY3R4Lmd1bi5vbignaW4nLCB7J0AnOiBhdFsnIyddLCBlcnI6IEd1bi5sb2coY3R4LmVycikgfSkgfVxyXG5cdFx0XHRcdG9ial9tYXAoY3R4LnB1dCwgbWVyZ2UsIGN0eCk7XHJcblx0XHRcdFx0b2JqX21hcChjdHgubWFwLCBtYXAsIGN0eCk7XHJcblx0XHRcdFx0aWYodSAhPT0gY3R4LmRlZmVyKXtcclxuXHRcdFx0XHRcdEd1bi5zY2hlZHVsZShjdHguZGVmZXIsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRcdEd1bi5vbigncHV0JywgYXQpO1xyXG5cdFx0XHRcdFx0fSwgR3VuLnN0YXRlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoIWN0eC5kaWZmKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRldi50by5uZXh0KG9ial90byhhdCwge3B1dDogY3R4LmRpZmZ9KSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRmdW5jdGlvbiB2ZXJpZnkodmFsLCBrZXksIG5vZGUsIHNvdWwpeyB2YXIgY3R4ID0gdGhpcztcclxuXHRcdFx0XHR2YXIgc3RhdGUgPSBHdW4uc3RhdGUuaXMobm9kZSwga2V5KSwgdG1wO1xyXG5cdFx0XHRcdGlmKCFzdGF0ZSl7IHJldHVybiBjdHguZXJyID0gXCJFcnJvcjogTm8gc3RhdGUgb24gJ1wiK2tleStcIicgaW4gbm9kZSAnXCIrc291bCtcIichXCIgfVxyXG5cdFx0XHRcdHZhciB2ZXJ0ZXggPSBjdHguZ3JhcGhbc291bF0gfHwgZW1wdHksIHdhcyA9IEd1bi5zdGF0ZS5pcyh2ZXJ0ZXgsIGtleSwgdHJ1ZSksIGtub3duID0gdmVydGV4W2tleV07XHJcblx0XHRcdFx0dmFyIEhBTSA9IEd1bi5IQU0oY3R4Lm1hY2hpbmUsIHN0YXRlLCB3YXMsIHZhbCwga25vd24pO1xyXG5cdFx0XHRcdGlmKCFIQU0uaW5jb21pbmcpe1xyXG5cdFx0XHRcdFx0aWYoSEFNLmRlZmVyKXsgLy8gcGljayB0aGUgbG93ZXN0XHJcblx0XHRcdFx0XHRcdGN0eC5kZWZlciA9IChzdGF0ZSA8IChjdHguZGVmZXIgfHwgSW5maW5pdHkpKT8gc3RhdGUgOiBjdHguZGVmZXI7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGN0eC5wdXRbc291bF0gPSBHdW4uc3RhdGUudG8obm9kZSwga2V5LCBjdHgucHV0W3NvdWxdKTtcclxuXHRcdFx0XHQoY3R4LmRpZmYgfHwgKGN0eC5kaWZmID0ge30pKVtzb3VsXSA9IEd1bi5zdGF0ZS50byhub2RlLCBrZXksIGN0eC5kaWZmW3NvdWxdKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBtZXJnZShub2RlLCBzb3VsKXtcclxuXHRcdFx0XHR2YXIgcmVmID0gKCh0aGlzLmd1bi5fKS5uZXh0IHx8IGVtcHR5KVtzb3VsXTtcclxuXHRcdFx0XHRpZighcmVmKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgYXQgPSB0aGlzLm1hcFtzb3VsXSA9IHtcclxuXHRcdFx0XHRcdHB1dDogdGhpcy5ub2RlID0gbm9kZSxcclxuXHRcdFx0XHRcdGdldDogdGhpcy5zb3VsID0gc291bCxcclxuXHRcdFx0XHRcdGd1bjogdGhpcy5yZWYgPSByZWZcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdG9ial9tYXAobm9kZSwgZWFjaCwgdGhpcyk7XHJcblx0XHRcdFx0R3VuLm9uKCdub2RlJywgYXQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIGVhY2godmFsLCBrZXkpe1xyXG5cdFx0XHRcdHZhciBncmFwaCA9IHRoaXMuZ3JhcGgsIHNvdWwgPSB0aGlzLnNvdWwsIGNhdCA9ICh0aGlzLnJlZi5fKSwgdG1wO1xyXG5cdFx0XHRcdGdyYXBoW3NvdWxdID0gR3VuLnN0YXRlLnRvKHRoaXMubm9kZSwga2V5LCBncmFwaFtzb3VsXSk7XHJcblx0XHRcdFx0KGNhdC5wdXQgfHwgKGNhdC5wdXQgPSB7fSkpW2tleV0gPSB2YWw7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbWFwKGF0LCBzb3VsKXtcclxuXHRcdFx0XHRpZighYXQuZ3VuKXsgcmV0dXJuIH1cclxuXHRcdFx0XHQoYXQuZ3VuLl8pLm9uKCdpbicsIGF0KTtcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdEd1bi5vbignZ2V0JywgZnVuY3Rpb24oYXQpe1xyXG5cdFx0XHRcdHZhciBldiA9IHRoaXMsIHNvdWwgPSBhdC5nZXRbX3NvdWxdLCBjYXQgPSBhdC5ndW4uXywgbm9kZSA9IGNhdC5ncmFwaFtzb3VsXSwgZmllbGQgPSBhdC5nZXRbX2ZpZWxkXSwgdG1wO1xyXG5cdFx0XHRcdHZhciBuZXh0ID0gY2F0Lm5leHQgfHwgKGNhdC5uZXh0ID0ge30pLCBhcyA9ICgobmV4dFtzb3VsXSB8fCBlbXB0eSkuXyk7XHJcblx0XHRcdFx0aWYoIW5vZGUgfHwgIWFzKXsgcmV0dXJuIGV2LnRvLm5leHQoYXQpIH1cclxuXHRcdFx0XHRpZihmaWVsZCl7XHJcblx0XHRcdFx0XHRpZighb2JqX2hhcyhub2RlLCBmaWVsZCkpeyByZXR1cm4gZXYudG8ubmV4dChhdCkgfVxyXG5cdFx0XHRcdFx0bm9kZSA9IEd1bi5zdGF0ZS50byhub2RlLCBmaWVsZCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdG5vZGUgPSBHdW4ub2JqLmNvcHkobm9kZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vaWYoYXQuZ3VuID09PSBjYXQuZ3VuKXtcclxuXHRcdFx0XHRcdG5vZGUgPSBHdW4uZ3JhcGgubm9kZShub2RlKTsgLy8gVE9ETzogQlVHISBDbG9uZSBub2RlP1xyXG5cdFx0XHRcdC8vfSBlbHNlIHtcclxuXHRcdFx0XHQvL1x0Y2F0ID0gKGF0Lmd1bi5fKTtcclxuXHRcdFx0XHQvL31cclxuXHRcdFx0XHR0bXAgPSBhcy5hY2s7XHJcblx0XHRcdFx0Y2F0Lm9uKCdpbicsIHtcclxuXHRcdFx0XHRcdCdAJzogYXRbJyMnXSxcclxuXHRcdFx0XHRcdGhvdzogJ21lbScsXHJcblx0XHRcdFx0XHRwdXQ6IG5vZGUsXHJcblx0XHRcdFx0XHRndW46IGFzLmd1blxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdGlmKDAgPCB0bXApe1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRldi50by5uZXh0KGF0KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KCkpO1xyXG5cdFx0XHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdEd1bi5vbi5hc2sgPSBmdW5jdGlvbihjYiwgYXMpe1xyXG5cdFx0XHRcdGlmKCF0aGlzLm9uKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgaWQgPSBHdW4udGV4dC5yYW5kb20oKTtcclxuXHRcdFx0XHRpZihjYil7IHRoaXMub24oaWQsIGNiLCBhcykgfVxyXG5cdFx0XHRcdHJldHVybiBpZDtcclxuXHRcdFx0fVxyXG5cdFx0XHRHdW4ub24uYWNrID0gZnVuY3Rpb24oYXQsIHJlcGx5KXtcclxuXHRcdFx0XHRpZighYXQgfHwgIXJlcGx5IHx8ICF0aGlzLm9uKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgaWQgPSBhdFsnIyddIHx8IGF0O1xyXG5cdFx0XHRcdGlmKCF0aGlzLnRhZyB8fCAhdGhpcy50YWdbaWRdKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR0aGlzLm9uKGlkLCByZXBseSk7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRHdW4uY2hhaW4ub3B0ID0gZnVuY3Rpb24ob3B0KXtcclxuXHRcdFx0XHRvcHQgPSBvcHQgfHwge307XHJcblx0XHRcdFx0dmFyIGd1biA9IHRoaXMsIGF0ID0gZ3VuLl8sIHRtcCA9IG9wdC5wZWVycyB8fCBvcHQ7XHJcblx0XHRcdFx0aWYoIW9ial9pcyhvcHQpKXsgb3B0ID0ge30gfVxyXG5cdFx0XHRcdGlmKCFvYmpfaXMoYXQub3B0KSl7IGF0Lm9wdCA9IG9wdCB9XHJcblx0XHRcdFx0aWYodGV4dF9pcyh0bXApKXsgdG1wID0gW3RtcF0gfVxyXG5cdFx0XHRcdGlmKGxpc3RfaXModG1wKSl7XHJcblx0XHRcdFx0XHR0bXAgPSBvYmpfbWFwKHRtcCwgZnVuY3Rpb24odXJsLCBpLCBtYXApe1xyXG5cdFx0XHRcdFx0XHRtYXAodXJsLCB7dXJsOiB1cmx9KTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0aWYoIW9ial9pcyhhdC5vcHQucGVlcnMpKXsgYXQub3B0LnBlZXJzID0ge319XHJcblx0XHRcdFx0XHRhdC5vcHQucGVlcnMgPSBvYmpfdG8odG1wLCBhdC5vcHQucGVlcnMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRhdC5vcHQud3NjID0gYXQub3B0LndzYyB8fCB7cHJvdG9jb2xzOltdfSBcclxuXHRcdFx0XHRhdC5vcHQucGVlcnMgPSBhdC5vcHQucGVlcnMgfHwge307XHJcblx0XHRcdFx0b2JqX3RvKG9wdCwgYXQub3B0KTsgLy8gY29waWVzIG9wdGlvbnMgb24gdG8gYGF0Lm9wdGAgb25seSBpZiBub3QgYWxyZWFkeSB0YWtlbi5cclxuXHRcdFx0XHRHdW4ub24oJ29wdCcsIGF0KTtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cclxuXHRcdHZhciB0ZXh0X2lzID0gR3VuLnRleHQuaXM7XHJcblx0XHR2YXIgbGlzdF9pcyA9IEd1bi5saXN0LmlzO1xyXG5cdFx0dmFyIG9iaiA9IEd1bi5vYmosIG9ial9pcyA9IG9iai5pcywgb2JqX2hhcyA9IG9iai5oYXMsIG9ial90byA9IG9iai50bywgb2JqX21hcCA9IG9iai5tYXAsIG9ial9jb3B5ID0gb2JqLmNvcHk7XHJcblx0XHR2YXIgX3NvdWwgPSBHdW4uXy5zb3VsLCBfZmllbGQgPSBHdW4uXy5maWVsZCwgcmVsX2lzID0gR3VuLnZhbC5yZWwuaXM7XHJcblx0XHR2YXIgZW1wdHkgPSB7fSwgdTtcclxuXHJcblx0XHRjb25zb2xlLmRlYnVnID0gZnVuY3Rpb24oaSwgcyl7IHJldHVybiAoY29uc29sZS5kZWJ1Zy5pICYmIGkgPT09IGNvbnNvbGUuZGVidWcuaSAmJiBjb25zb2xlLmRlYnVnLmkrKykgJiYgKGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cykgfHwgcykgfTtcclxuXHJcblx0XHRHdW4ubG9nID0gZnVuY3Rpb24oKXsgcmV0dXJuICghR3VuLmxvZy5vZmYgJiYgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKSksIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5qb2luKCcgJykgfVxyXG5cdFx0R3VuLmxvZy5vbmNlID0gZnVuY3Rpb24odyxzLG8peyByZXR1cm4gKG8gPSBHdW4ubG9nLm9uY2UpW3ddID0gb1t3XSB8fCAwLCBvW3ddKysgfHwgR3VuLmxvZyhzKSB9XHJcblxyXG5cdFx0O1wiUGxlYXNlIGRvIG5vdCByZW1vdmUgdGhlc2UgbWVzc2FnZXMgdW5sZXNzIHlvdSBhcmUgcGF5aW5nIGZvciBhIG1vbnRobHkgc3BvbnNvcnNoaXAsIHRoYW5rcyFcIjtcclxuXHRcdEd1bi5sb2cub25jZShcIndlbGNvbWVcIiwgXCJIZWxsbyB3b25kZXJmdWwgcGVyc29uISA6KSBUaGFua3MgZm9yIHVzaW5nIEdVTiwgZmVlbCBmcmVlIHRvIGFzayBmb3IgaGVscCBvbiBodHRwczovL2dpdHRlci5pbS9hbWFyay9ndW4gYW5kIGFzayBTdGFja092ZXJmbG93IHF1ZXN0aW9ucyB0YWdnZWQgd2l0aCAnZ3VuJyFcIik7XHJcblx0XHQ7XCJQbGVhc2UgZG8gbm90IHJlbW92ZSB0aGVzZSBtZXNzYWdlcyB1bmxlc3MgeW91IGFyZSBwYXlpbmcgZm9yIGEgbW9udGhseSBzcG9uc29yc2hpcCwgdGhhbmtzIVwiO1xyXG5cdFx0XHJcblx0XHRpZih0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKXsgd2luZG93Lkd1biA9IEd1biB9XHJcblx0XHRpZih0eXBlb2YgY29tbW9uICE9PSBcInVuZGVmaW5lZFwiKXsgY29tbW9uLmV4cG9ydHMgPSBHdW4gfVxyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBHdW47XHJcblx0fSkocmVxdWlyZSwgJy4vcm9vdCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vcm9vdCcpO1xyXG5cdFx0R3VuLmNoYWluLmJhY2sgPSBmdW5jdGlvbihuLCBvcHQpeyB2YXIgdG1wO1xyXG5cdFx0XHRpZigtMSA9PT0gbiB8fCBJbmZpbml0eSA9PT0gbil7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuXy5yb290O1xyXG5cdFx0XHR9IGVsc2VcclxuXHRcdFx0aWYoMSA9PT0gbil7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuXy5iYWNrIHx8IHRoaXM7XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIGd1biA9IHRoaXMsIGF0ID0gZ3VuLl87XHJcblx0XHRcdGlmKHR5cGVvZiBuID09PSAnc3RyaW5nJyl7XHJcblx0XHRcdFx0biA9IG4uc3BsaXQoJy4nKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihuIGluc3RhbmNlb2YgQXJyYXkpe1xyXG5cdFx0XHRcdHZhciBpID0gMCwgbCA9IG4ubGVuZ3RoLCB0bXAgPSBhdDtcclxuXHRcdFx0XHRmb3IoaTsgaSA8IGw7IGkrKyl7XHJcblx0XHRcdFx0XHR0bXAgPSAodG1wfHxlbXB0eSlbbltpXV07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKHUgIT09IHRtcCl7XHJcblx0XHRcdFx0XHRyZXR1cm4gb3B0PyBndW4gOiB0bXA7XHJcblx0XHRcdFx0fSBlbHNlXHJcblx0XHRcdFx0aWYoKHRtcCA9IGF0LmJhY2spKXtcclxuXHRcdFx0XHRcdHJldHVybiB0bXAuYmFjayhuLCBvcHQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYobiBpbnN0YW5jZW9mIEZ1bmN0aW9uKXtcclxuXHRcdFx0XHR2YXIgeWVzLCB0bXAgPSB7YmFjazogZ3VufTtcclxuXHRcdFx0XHR3aGlsZSgodG1wID0gdG1wLmJhY2spXHJcblx0XHRcdFx0JiYgKHRtcCA9IHRtcC5fKVxyXG5cdFx0XHRcdCYmICEoeWVzID0gbih0bXAsIG9wdCkpKXt9XHJcblx0XHRcdFx0cmV0dXJuIHllcztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0dmFyIGVtcHR5ID0ge30sIHU7XHJcblx0fSkocmVxdWlyZSwgJy4vYmFjaycpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vcm9vdCcpO1xyXG5cdFx0R3VuLmNoYWluLmNoYWluID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIGF0ID0gdGhpcy5fLCBjaGFpbiA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpLCBjYXQgPSBjaGFpbi5fO1xyXG5cdFx0XHRjYXQucm9vdCA9IHJvb3QgPSBhdC5yb290O1xyXG5cdFx0XHRjYXQuaWQgPSArK3Jvb3QuXy5vbmNlO1xyXG5cdFx0XHRjYXQuYmFjayA9IHRoaXM7XHJcblx0XHRcdGNhdC5vbiA9IEd1bi5vbjtcclxuXHRcdFx0R3VuLm9uKCdjaGFpbicsIGNhdCk7XHJcblx0XHRcdGNhdC5vbignaW4nLCBpbnB1dCwgY2F0KTsgLy8gRm9yICdpbicgaWYgSSBhZGQgbXkgb3duIGxpc3RlbmVycyB0byBlYWNoIHRoZW4gSSBNVVNUIGRvIGl0IGJlZm9yZSBpbiBnZXRzIGNhbGxlZC4gSWYgSSBsaXN0ZW4gZ2xvYmFsbHkgZm9yIGFsbCBpbmNvbWluZyBkYXRhIGluc3RlYWQgdGhvdWdoLCByZWdhcmRsZXNzIG9mIGluZGl2aWR1YWwgbGlzdGVuZXJzLCBJIGNhbiB0cmFuc2Zvcm0gdGhlIGRhdGEgdGhlcmUgYW5kIHRoZW4gYXMgd2VsbC5cclxuXHRcdFx0Y2F0Lm9uKCdvdXQnLCBvdXRwdXQsIGNhdCk7IC8vIEhvd2V2ZXIgZm9yIG91dHB1dCwgdGhlcmUgaXNuJ3QgcmVhbGx5IHRoZSBnbG9iYWwgb3B0aW9uLiBJIG11c3QgbGlzdGVuIGJ5IGFkZGluZyBteSBvd24gbGlzdGVuZXIgaW5kaXZpZHVhbGx5IEJFRk9SRSB0aGlzIG9uZSBpcyBldmVyIGNhbGxlZC5cclxuXHRcdFx0cmV0dXJuIGNoYWluO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gb3V0cHV0KGF0KXtcclxuXHRcdFx0dmFyIGNhdCA9IHRoaXMuYXMsIGd1biA9IGNhdC5ndW4sIHJvb3QgPSBndW4uYmFjaygtMSksIHB1dCwgZ2V0LCBub3csIHRtcDtcclxuXHRcdFx0aWYoIWF0Lmd1bil7XHJcblx0XHRcdFx0YXQuZ3VuID0gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGdldCA9IGF0LmdldCl7XHJcblx0XHRcdFx0aWYodG1wID0gZ2V0W19zb3VsXSl7XHJcblx0XHRcdFx0XHR0bXAgPSAocm9vdC5nZXQodG1wKS5fKTtcclxuXHRcdFx0XHRcdGlmKG9ial9oYXMoZ2V0LCBfZmllbGQpKXtcclxuXHRcdFx0XHRcdFx0aWYob2JqX2hhcyhwdXQgPSB0bXAucHV0LCBnZXQgPSBnZXRbX2ZpZWxkXSkpe1xyXG5cdFx0XHRcdFx0XHRcdHRtcC5vbignaW4nLCB7Z2V0OiB0bXAuZ2V0LCBwdXQ6IEd1bi5zdGF0ZS50byhwdXQsIGdldCksIGd1bjogdG1wLmd1bn0pOyAvLyBUT0RPOiBVZ2x5LCBjbGVhbiB1cD8gU2ltcGxpZnkgYWxsIHRoZXNlIGlmIGNvbmRpdGlvbnMgKHdpdGhvdXQgcnVpbmluZyB0aGUgd2hvbGUgY2hhaW5pbmcgQVBJKT9cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSBlbHNlXHJcblx0XHRcdFx0XHRpZihvYmpfaGFzKHRtcCwgJ3B1dCcpKXtcclxuXHRcdFx0XHRcdC8vaWYodSAhPT0gdG1wLnB1dCl7XHJcblx0XHRcdFx0XHRcdHRtcC5vbignaW4nLCB0bXApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRpZihvYmpfaGFzKGdldCwgX2ZpZWxkKSl7XHJcblx0XHRcdFx0XHRcdGdldCA9IGdldFtfZmllbGRdO1xyXG5cdFx0XHRcdFx0XHR2YXIgbmV4dCA9IGdldD8gKGd1bi5nZXQoZ2V0KS5fKSA6IGNhdDtcclxuXHRcdFx0XHRcdFx0Ly8gVE9ETzogQlVHISBIYW5kbGUgcGx1cmFsIGNoYWlucyBieSBpdGVyYXRpbmcgb3ZlciB0aGVtLlxyXG5cdFx0XHRcdFx0XHQvL2lmKG9ial9oYXMobmV4dCwgJ3B1dCcpKXsgLy8gcG90ZW50aWFsbHkgaW5jb3JyZWN0PyBNYXliZT9cclxuXHRcdFx0XHRcdFx0aWYodSAhPT0gbmV4dC5wdXQpeyAvLyBwb3RlbnRpYWxseSBpbmNvcnJlY3Q/IE1heWJlP1xyXG5cdFx0XHRcdFx0XHRcdC8vbmV4dC50YWdbJ2luJ10ubGFzdC5uZXh0KG5leHQpO1xyXG5cdFx0XHRcdFx0XHRcdG5leHQub24oJ2luJywgbmV4dCk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmKG9ial9oYXMoY2F0LCAncHV0Jykpe1xyXG5cdFx0XHRcdFx0XHQvL2lmKHUgIT09IGNhdC5wdXQpe1xyXG5cdFx0XHRcdFx0XHRcdHZhciB2YWwgPSBjYXQucHV0LCByZWw7XHJcblx0XHRcdFx0XHRcdFx0aWYocmVsID0gR3VuLm5vZGUuc291bCh2YWwpKXtcclxuXHRcdFx0XHRcdFx0XHRcdHZhbCA9IEd1bi52YWwucmVsLmlmeShyZWwpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRpZihyZWwgPSBHdW4udmFsLnJlbC5pcyh2YWwpKXtcclxuXHRcdFx0XHRcdFx0XHRcdGlmKCFhdC5ndW4uXyl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRcdFx0XHQoYXQuZ3VuLl8pLm9uKCdvdXQnLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGdldDogdG1wID0geycjJzogcmVsLCAnLic6IGdldCwgZ3VuOiBhdC5ndW59LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHQnIyc6IHJvb3QuXy5hc2soR3VuLkhBTS5zeW50aCwgdG1wKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0Z3VuOiBhdC5ndW5cclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRpZih1ID09PSB2YWwgfHwgR3VuLnZhbC5pcyh2YWwpKXtcclxuXHRcdFx0XHRcdFx0XHRcdGlmKCFhdC5ndW4uXyl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRcdFx0XHQoYXQuZ3VuLl8pLm9uKCdpbicsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Z2V0OiBnZXQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGd1bjogYXQuZ3VuXHJcblx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0gZWxzZVxyXG5cdFx0XHRcdFx0XHRpZihjYXQubWFwKXtcclxuXHRcdFx0XHRcdFx0XHRvYmpfbWFwKGNhdC5tYXAsIGZ1bmN0aW9uKHByb3h5KXtcclxuXHRcdFx0XHRcdFx0XHRcdHByb3h5LmF0Lm9uKCdpbicsIHByb3h5LmF0KTtcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0aWYoY2F0LnNvdWwpe1xyXG5cdFx0XHRcdFx0XHRcdGlmKCFhdC5ndW4uXyl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRcdFx0KGF0Lmd1bi5fKS5vbignb3V0Jywge1xyXG5cdFx0XHRcdFx0XHRcdFx0Z2V0OiB0bXAgPSB7JyMnOiBjYXQuc291bCwgJy4nOiBnZXQsIGd1bjogYXQuZ3VufSxcclxuXHRcdFx0XHRcdFx0XHRcdCcjJzogcm9vdC5fLmFzayhHdW4uSEFNLnN5bnRoLCB0bXApLFxyXG5cdFx0XHRcdFx0XHRcdFx0Z3VuOiBhdC5ndW5cclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYoY2F0LmdldCl7XHJcblx0XHRcdFx0XHRcdFx0aWYoIWNhdC5iYWNrLl8peyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0XHRcdChjYXQuYmFjay5fKS5vbignb3V0Jywge1xyXG5cdFx0XHRcdFx0XHRcdFx0Z2V0OiBvYmpfcHV0KHt9LCBfZmllbGQsIGNhdC5nZXQpLFxyXG5cdFx0XHRcdFx0XHRcdFx0Z3VuOiBndW5cclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YXQgPSBvYmpfdG8oYXQsIHtnZXQ6IHt9fSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZihvYmpfaGFzKGNhdCwgJ3B1dCcpKXtcclxuXHRcdFx0XHRcdFx0Ly9pZih1ICE9PSBjYXQucHV0KXtcclxuXHRcdFx0XHRcdFx0XHRjYXQub24oJ2luJywgY2F0KTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlXHJcblx0XHRcdFx0XHRcdGlmKGNhdC5tYXApe1xyXG5cdFx0XHRcdFx0XHRcdG9ial9tYXAoY2F0Lm1hcCwgZnVuY3Rpb24ocHJveHkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0cHJveHkuYXQub24oJ2luJywgcHJveHkuYXQpO1xyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmKGNhdC5hY2spe1xyXG5cdFx0XHRcdFx0XHRcdGlmKCFvYmpfaGFzKGNhdCwgJ3B1dCcpKXsgLy8gdSAhPT0gY2F0LnB1dCBpbnN0ZWFkP1xyXG5cdFx0XHRcdFx0XHRcdC8vaWYodSAhPT0gY2F0LnB1dCl7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGNhdC5hY2sgPSAtMTtcclxuXHRcdFx0XHRcdFx0aWYoY2F0LnNvdWwpe1xyXG5cdFx0XHRcdFx0XHRcdGNhdC5vbignb3V0Jywge1xyXG5cdFx0XHRcdFx0XHRcdFx0Z2V0OiB0bXAgPSB7JyMnOiBjYXQuc291bCwgZ3VuOiBjYXQuZ3VufSxcclxuXHRcdFx0XHRcdFx0XHRcdCcjJzogcm9vdC5fLmFzayhHdW4uSEFNLnN5bnRoLCB0bXApLFxyXG5cdFx0XHRcdFx0XHRcdFx0Z3VuOiBjYXQuZ3VuXHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmKGNhdC5nZXQpe1xyXG5cdFx0XHRcdFx0XHRcdGlmKCFjYXQuYmFjay5fKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdFx0XHQoY2F0LmJhY2suXykub24oJ291dCcsIHtcclxuXHRcdFx0XHRcdFx0XHRcdGdldDogb2JqX3B1dCh7fSwgX2ZpZWxkLCBjYXQuZ2V0KSxcclxuXHRcdFx0XHRcdFx0XHRcdGd1bjogY2F0Lmd1blxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQoY2F0LmJhY2suXykub24oJ291dCcsIGF0KTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIGlucHV0KGF0KXtcclxuXHRcdFx0YXQgPSBhdC5fIHx8IGF0O1xyXG5cdFx0XHR2YXIgZXYgPSB0aGlzLCBjYXQgPSB0aGlzLmFzLCBndW4gPSBhdC5ndW4sIGNvYXQgPSBndW4uXywgY2hhbmdlID0gYXQucHV0LCBiYWNrID0gY2F0LmJhY2suXyB8fCBlbXB0eSwgcmVsLCB0bXA7XHJcblx0XHRcdGlmKDAgPiBjYXQuYWNrICYmICFhdC5hY2sgJiYgIUd1bi52YWwucmVsLmlzKGNoYW5nZSkpeyAvLyBmb3IgYmV0dGVyIGJlaGF2aW9yP1xyXG5cdFx0XHRcdGNhdC5hY2sgPSAxO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNhdC5nZXQgJiYgYXQuZ2V0ICE9PSBjYXQuZ2V0KXtcclxuXHRcdFx0XHRhdCA9IG9ial90byhhdCwge2dldDogY2F0LmdldH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNhdC5maWVsZCAmJiBjb2F0ICE9PSBjYXQpe1xyXG5cdFx0XHRcdGF0ID0gb2JqX3RvKGF0LCB7Z3VuOiBjYXQuZ3VufSk7XHJcblx0XHRcdFx0aWYoY29hdC5hY2spe1xyXG5cdFx0XHRcdFx0Y2F0LmFjayA9IGNhdC5hY2sgfHwgY29hdC5hY2s7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHUgPT09IGNoYW5nZSl7XHJcblx0XHRcdFx0ZXYudG8ubmV4dChhdCk7XHJcblx0XHRcdFx0aWYoY2F0LnNvdWwpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGVjaG8oY2F0LCBhdCwgZXYpO1xyXG5cdFx0XHRcdGlmKGNhdC5maWVsZCl7XHJcblx0XHRcdFx0XHRub3QoY2F0LCBhdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG9ial9kZWwoY29hdC5lY2hvLCBjYXQuaWQpO1xyXG5cdFx0XHRcdG9ial9kZWwoY2F0Lm1hcCwgY29hdC5pZCk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNhdC5zb3VsKXtcclxuXHRcdFx0XHRpZihjYXQucm9vdC5fLm5vdyl7IGF0ID0gb2JqX3RvKGF0LCB7cHV0OiBjaGFuZ2UgPSBjb2F0LnB1dH0pIH0gLy8gVE9ETzogVWdseSBoYWNrIGZvciB1bmNhY2hlZCBzeW5jaHJvbm91cyBtYXBzLlxyXG5cdFx0XHRcdGV2LnRvLm5leHQoYXQpO1xyXG5cdFx0XHRcdGVjaG8oY2F0LCBhdCwgZXYpO1xyXG5cdFx0XHRcdG9ial9tYXAoY2hhbmdlLCBtYXAsIHthdDogYXQsIGNhdDogY2F0fSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCEocmVsID0gR3VuLnZhbC5yZWwuaXMoY2hhbmdlKSkpe1xyXG5cdFx0XHRcdGlmKEd1bi52YWwuaXMoY2hhbmdlKSl7XHJcblx0XHRcdFx0XHRpZihjYXQuZmllbGQgfHwgY2F0LnNvdWwpe1xyXG5cdFx0XHRcdFx0XHRub3QoY2F0LCBhdCk7XHJcblx0XHRcdFx0XHR9IGVsc2VcclxuXHRcdFx0XHRcdGlmKGNvYXQuZmllbGQgfHwgY29hdC5zb3VsKXtcclxuXHRcdFx0XHRcdFx0KGNvYXQuZWNobyB8fCAoY29hdC5lY2hvID0ge30pKVtjYXQuaWRdID0gY2F0O1xyXG5cdFx0XHRcdFx0XHQoY2F0Lm1hcCB8fCAoY2F0Lm1hcCA9IHt9KSlbY29hdC5pZF0gPSBjYXQubWFwW2NvYXQuaWRdIHx8IHthdDogY29hdH07XHJcblx0XHRcdFx0XHRcdC8vaWYodSA9PT0gY29hdC5wdXQpeyByZXR1cm4gfSAvLyBOb3QgbmVjZXNzYXJ5IGJ1dCBpbXByb3ZlcyBwZXJmb3JtYW5jZS4gSWYgd2UgaGF2ZSBpdCBidXQgY29hdCBkb2VzIG5vdCwgdGhhdCBtZWFucyB3ZSBnb3QgdGhpbmdzIG91dCBvZiBvcmRlciBhbmQgY29hdCB3aWxsIGdldCBpdC4gT25jZSBjb2F0IGdldHMgaXQsIGl0IHdpbGwgdGVsbCB1cyBhZ2Fpbi5cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGV2LnRvLm5leHQoYXQpO1xyXG5cdFx0XHRcdFx0ZWNobyhjYXQsIGF0LCBldik7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGNhdC5maWVsZCAmJiBjb2F0ICE9PSBjYXQgJiYgb2JqX2hhcyhjb2F0LCAncHV0Jykpe1xyXG5cdFx0XHRcdFx0Y2F0LnB1dCA9IGNvYXQucHV0O1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0aWYoKHJlbCA9IEd1bi5ub2RlLnNvdWwoY2hhbmdlKSkgJiYgY29hdC5maWVsZCl7XHJcblx0XHRcdFx0XHRjb2F0LnB1dCA9IChjYXQucm9vdC5nZXQocmVsKS5fKS5wdXQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGV2LnRvLm5leHQoYXQpO1xyXG5cdFx0XHRcdGVjaG8oY2F0LCBhdCwgZXYpO1xyXG5cdFx0XHRcdHJlbGF0ZShjYXQsIGF0LCBjb2F0LCByZWwpO1xyXG5cdFx0XHRcdG9ial9tYXAoY2hhbmdlLCBtYXAsIHthdDogYXQsIGNhdDogY2F0fSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJlbGF0ZShjYXQsIGF0LCBjb2F0LCByZWwpO1xyXG5cdFx0XHRldi50by5uZXh0KGF0KTtcclxuXHRcdFx0ZWNobyhjYXQsIGF0LCBldik7XHJcblx0XHR9XHJcblx0XHRHdW4uY2hhaW4uY2hhaW4uaW5wdXQgPSBpbnB1dDtcclxuXHRcdGZ1bmN0aW9uIHJlbGF0ZShjYXQsIGF0LCBjb2F0LCByZWwpe1xyXG5cdFx0XHRpZighcmVsIHx8IG5vZGVfID09PSBjYXQuZ2V0KXsgcmV0dXJuIH1cclxuXHRcdFx0dmFyIHRtcCA9IChjYXQucm9vdC5nZXQocmVsKS5fKTtcclxuXHRcdFx0aWYoY2F0LmZpZWxkKXtcclxuXHRcdFx0XHRjb2F0ID0gdG1wO1xyXG5cdFx0XHR9IGVsc2UgXHJcblx0XHRcdGlmKGNvYXQuZmllbGQpe1xyXG5cdFx0XHRcdHJlbGF0ZShjb2F0LCBhdCwgY29hdCwgcmVsKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjb2F0ID09PSBjYXQpeyByZXR1cm4gfVxyXG5cdFx0XHQoY29hdC5lY2hvIHx8IChjb2F0LmVjaG8gPSB7fSkpW2NhdC5pZF0gPSBjYXQ7XHJcblx0XHRcdGlmKGNhdC5maWVsZCAmJiAhKGNhdC5tYXB8fGVtcHR5KVtjb2F0LmlkXSl7XHJcblx0XHRcdFx0bm90KGNhdCwgYXQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRtcCA9IChjYXQubWFwIHx8IChjYXQubWFwID0ge30pKVtjb2F0LmlkXSA9IGNhdC5tYXBbY29hdC5pZF0gfHwge2F0OiBjb2F0fTtcclxuXHRcdFx0aWYocmVsID09PSB0bXAucmVsKXsgcmV0dXJuIH1cclxuXHRcdFx0YXNrKGNhdCwgdG1wLnJlbCA9IHJlbCk7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBlY2hvKGNhdCwgYXQsIGV2KXtcclxuXHRcdFx0aWYoIWNhdC5lY2hvKXsgcmV0dXJuIH0gLy8gfHwgbm9kZV8gPT09IGF0LmdldCA/Pz8/XHJcblx0XHRcdGlmKGNhdC5maWVsZCl7IGF0ID0gb2JqX3RvKGF0LCB7ZXZlbnQ6IGV2fSkgfVxyXG5cdFx0XHRvYmpfbWFwKGNhdC5lY2hvLCByZXZlcmIsIGF0KTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIHJldmVyYihjYXQpe1xyXG5cdFx0XHRjYXQub24oJ2luJywgdGhpcyk7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBtYXAoZGF0YSwga2V5KXsgLy8gTWFwIG92ZXIgb25seSB0aGUgY2hhbmdlcyBvbiBldmVyeSB1cGRhdGUuXHJcblx0XHRcdHZhciBjYXQgPSB0aGlzLmNhdCwgbmV4dCA9IGNhdC5uZXh0IHx8IGVtcHR5LCB2aWEgPSB0aGlzLmF0LCBndW4sIGNoYWluLCBhdCwgdG1wO1xyXG5cdFx0XHRpZihub2RlXyA9PT0ga2V5ICYmICFuZXh0W2tleV0peyByZXR1cm4gfVxyXG5cdFx0XHRpZighKGd1biA9IG5leHRba2V5XSkpe1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRhdCA9IChndW4uXyk7XHJcblx0XHRcdC8vaWYoZGF0YSAmJiBkYXRhW19zb3VsXSAmJiAodG1wID0gR3VuLnZhbC5yZWwuaXMoZGF0YSkpICYmICh0bXAgPSAoY2F0LnJvb3QuZ2V0KHRtcCkuXykpICYmIG9ial9oYXModG1wLCAncHV0Jykpe1xyXG5cdFx0XHQvL1x0ZGF0YSA9IHRtcC5wdXQ7XHJcblx0XHRcdC8vfVxyXG5cdFx0XHRpZihhdC5maWVsZCl7XHJcblx0XHRcdFx0aWYoIShkYXRhICYmIGRhdGFbX3NvdWxdICYmIEd1bi52YWwucmVsLmlzKGRhdGEpID09PSBHdW4ubm9kZS5zb3VsKGF0LnB1dCkpKXtcclxuXHRcdFx0XHRcdGF0LnB1dCA9IGRhdGE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNoYWluID0gZ3VuO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNoYWluID0gdmlhLmd1bi5nZXQoa2V5KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhdC5vbignaW4nLCB7XHJcblx0XHRcdFx0cHV0OiBkYXRhLFxyXG5cdFx0XHRcdGdldDoga2V5LFxyXG5cdFx0XHRcdGd1bjogY2hhaW4sXHJcblx0XHRcdFx0dmlhOiB2aWFcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBub3QoY2F0LCBhdCl7XHJcblx0XHRcdGlmKCEoY2F0LmZpZWxkIHx8IGNhdC5zb3VsKSl7IHJldHVybiB9XHJcblx0XHRcdHZhciB0bXAgPSBjYXQubWFwO1xyXG5cdFx0XHRjYXQubWFwID0gbnVsbDtcclxuXHRcdFx0aWYobnVsbCA9PT0gdG1wKXsgcmV0dXJuIH1cclxuXHRcdFx0aWYodSA9PT0gdG1wICYmIGNhdC5wdXQgIT09IHUpeyByZXR1cm4gfSAvLyBUT0RPOiBCdWc/IFRocmV3IHNlY29uZCBjb25kaXRpb24gaW4gZm9yIGEgcGFydGljdWxhciB0ZXN0LCBub3Qgc3VyZSBpZiBhIGNvdW50ZXIgZXhhbXBsZSBpcyB0ZXN0ZWQgdGhvdWdoLlxyXG5cdFx0XHRvYmpfbWFwKHRtcCwgZnVuY3Rpb24ocHJveHkpe1xyXG5cdFx0XHRcdGlmKCEocHJveHkgPSBwcm94eS5hdCkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdG9ial9kZWwocHJveHkuZWNobywgY2F0LmlkKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdG9ial9tYXAoY2F0Lm5leHQsIGZ1bmN0aW9uKGd1biwga2V5KXtcclxuXHRcdFx0XHR2YXIgY29hdCA9IChndW4uXyk7XHJcblx0XHRcdFx0Y29hdC5wdXQgPSB1O1xyXG5cdFx0XHRcdGlmKGNvYXQuYWNrKXtcclxuXHRcdFx0XHRcdGNvYXQuYWNrID0gLTE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNvYXQub24oJ2luJywge1xyXG5cdFx0XHRcdFx0Z2V0OiBrZXksXHJcblx0XHRcdFx0XHRndW46IGd1bixcclxuXHRcdFx0XHRcdHB1dDogdVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIGFzayhjYXQsIHNvdWwpe1xyXG5cdFx0XHR2YXIgdG1wID0gKGNhdC5yb290LmdldChzb3VsKS5fKTtcclxuXHRcdFx0aWYoY2F0LmFjayl7XHJcblx0XHRcdFx0dG1wLmFjayA9IHRtcC5hY2sgfHwgLTE7XHJcblx0XHRcdFx0dG1wLm9uKCdvdXQnLCB7XHJcblx0XHRcdFx0XHRnZXQ6IHRtcCA9IHsnIyc6IHNvdWwsIGd1bjogdG1wLmd1bn0sXHJcblx0XHRcdFx0XHQnIyc6IGNhdC5yb290Ll8uYXNrKEd1bi5IQU0uc3ludGgsIHRtcClcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0b2JqX21hcChjYXQubmV4dCwgZnVuY3Rpb24oZ3VuLCBrZXkpe1xyXG5cdFx0XHRcdChndW4uXykub24oJ291dCcsIHtcclxuXHRcdFx0XHRcdGdldDogZ3VuID0geycjJzogc291bCwgJy4nOiBrZXksIGd1bjogZ3VufSxcclxuXHRcdFx0XHRcdCcjJzogY2F0LnJvb3QuXy5hc2soR3VuLkhBTS5zeW50aCwgZ3VuKVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdHZhciBlbXB0eSA9IHt9LCB1O1xyXG5cdFx0dmFyIG9iaiA9IEd1bi5vYmosIG9ial9oYXMgPSBvYmouaGFzLCBvYmpfcHV0ID0gb2JqLnB1dCwgb2JqX2RlbCA9IG9iai5kZWwsIG9ial90byA9IG9iai50bywgb2JqX21hcCA9IG9iai5tYXA7XHJcblx0XHR2YXIgX3NvdWwgPSBHdW4uXy5zb3VsLCBfZmllbGQgPSBHdW4uXy5maWVsZCwgbm9kZV8gPSBHdW4ubm9kZS5fO1xyXG5cdH0pKHJlcXVpcmUsICcuL2NoYWluJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9yb290Jyk7XHJcblx0XHRHdW4uY2hhaW4uZ2V0ID0gZnVuY3Rpb24oa2V5LCBjYiwgYXMpe1xyXG5cdFx0XHRpZih0eXBlb2Yga2V5ID09PSAnc3RyaW5nJyl7XHJcblx0XHRcdFx0dmFyIGd1biwgYmFjayA9IHRoaXMsIGNhdCA9IGJhY2suXztcclxuXHRcdFx0XHR2YXIgbmV4dCA9IGNhdC5uZXh0IHx8IGVtcHR5LCB0bXA7XHJcblx0XHRcdFx0aWYoIShndW4gPSBuZXh0W2tleV0pKXtcclxuXHRcdFx0XHRcdGd1biA9IGNhY2hlKGtleSwgYmFjayk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2VcclxuXHRcdFx0aWYoa2V5IGluc3RhbmNlb2YgRnVuY3Rpb24pe1xyXG5cdFx0XHRcdHZhciBndW4gPSB0aGlzLCBhdCA9IGd1bi5fO1xyXG5cdFx0XHRcdGFzID0gY2IgfHwge307XHJcblx0XHRcdFx0YXMudXNlID0ga2V5O1xyXG5cdFx0XHRcdGFzLm91dCA9IGFzLm91dCB8fCB7Y2FwOiAxfTtcclxuXHRcdFx0XHRhcy5vdXQuZ2V0ID0gYXMub3V0LmdldCB8fCB7fTtcclxuXHRcdFx0XHQnXycgIT0gYXQuZ2V0ICYmICgoYXQucm9vdC5fKS5ub3cgPSB0cnVlKTsgLy8gdWdseSBoYWNrIGZvciBub3cuXHJcblx0XHRcdFx0YXQub24oJ2luJywgdXNlLCBhcyk7XHJcblx0XHRcdFx0YXQub24oJ291dCcsIGFzLm91dCk7XHJcblx0XHRcdFx0KGF0LnJvb3QuXykubm93ID0gZmFsc2U7XHJcblx0XHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdFx0fSBlbHNlXHJcblx0XHRcdGlmKG51bV9pcyhrZXkpKXtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5nZXQoJycra2V5LCBjYiwgYXMpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdChhcyA9IHRoaXMuY2hhaW4oKSkuXy5lcnIgPSB7ZXJyOiBHdW4ubG9nKCdJbnZhbGlkIGdldCByZXF1ZXN0IScsIGtleSl9OyAvLyBDTEVBTiBVUFxyXG5cdFx0XHRcdGlmKGNiKXsgY2IuY2FsbChhcywgYXMuXy5lcnIpIH1cclxuXHRcdFx0XHRyZXR1cm4gYXM7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYodG1wID0gY2F0LnN0dW4peyAvLyBUT0RPOiBSZWZhY3Rvcj9cclxuXHRcdFx0XHRndW4uXy5zdHVuID0gZ3VuLl8uc3R1biB8fCB0bXA7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY2IgJiYgY2IgaW5zdGFuY2VvZiBGdW5jdGlvbil7XHJcblx0XHRcdFx0Z3VuLmdldChjYiwgYXMpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBndW47XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBjYWNoZShrZXksIGJhY2spe1xyXG5cdFx0XHR2YXIgY2F0ID0gYmFjay5fLCBuZXh0ID0gY2F0Lm5leHQsIGd1biA9IGJhY2suY2hhaW4oKSwgYXQgPSBndW4uXztcclxuXHRcdFx0aWYoIW5leHQpeyBuZXh0ID0gY2F0Lm5leHQgPSB7fSB9XHJcblx0XHRcdG5leHRbYXQuZ2V0ID0ga2V5XSA9IGd1bjtcclxuXHRcdFx0aWYoY2F0LnJvb3QgPT09IGJhY2speyBhdC5zb3VsID0ga2V5IH1cclxuXHRcdFx0ZWxzZSBpZihjYXQuc291bCB8fCBjYXQuZmllbGQpeyBhdC5maWVsZCA9IGtleSB9XHJcblx0XHRcdHJldHVybiBndW47XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiB1c2UoYXQpe1xyXG5cdFx0XHR2YXIgZXYgPSB0aGlzLCBhcyA9IGV2LmFzLCBndW4gPSBhdC5ndW4sIGNhdCA9IGd1bi5fLCBkYXRhID0gYXQucHV0LCB0bXA7XHJcblx0XHRcdGlmKHUgPT09IGRhdGEpe1xyXG5cdFx0XHRcdGRhdGEgPSBjYXQucHV0O1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCh0bXAgPSBkYXRhKSAmJiB0bXBbcmVsLl9dICYmICh0bXAgPSByZWwuaXModG1wKSkpe1xyXG5cdFx0XHRcdHRtcCA9IChjYXQucm9vdC5nZXQodG1wKS5fKTtcclxuXHRcdFx0XHRpZih1ICE9PSB0bXAucHV0KXtcclxuXHRcdFx0XHRcdGF0ID0gb2JqX3RvKGF0LCB7cHV0OiB0bXAucHV0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGFzLnVzZShhdCwgYXQuZXZlbnQgfHwgZXYpO1xyXG5cdFx0XHRldi50by5uZXh0KGF0KTtcclxuXHRcdH1cclxuXHRcdHZhciBvYmogPSBHdW4ub2JqLCBvYmpfaGFzID0gb2JqLmhhcywgb2JqX3RvID0gR3VuLm9iai50bztcclxuXHRcdHZhciBudW1faXMgPSBHdW4ubnVtLmlzO1xyXG5cdFx0dmFyIHJlbCA9IEd1bi52YWwucmVsLCBub2RlXyA9IEd1bi5ub2RlLl87XHJcblx0XHR2YXIgZW1wdHkgPSB7fSwgdTtcclxuXHR9KShyZXF1aXJlLCAnLi9nZXQnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL3Jvb3QnKTtcclxuXHRcdEd1bi5jaGFpbi5wdXQgPSBmdW5jdGlvbihkYXRhLCBjYiwgYXMpe1xyXG5cdFx0XHQvLyAjc291bC5maWVsZD12YWx1ZT5zdGF0ZVxyXG5cdFx0XHQvLyB+d2hvI3doZXJlLndoZXJlPXdoYXQ+d2hlbkB3YXNcclxuXHRcdFx0Ly8gVE9ETzogQlVHISBQdXQgcHJvYmFibHkgY2Fubm90IGhhbmRsZSBwbHVyYWwgY2hhaW5zIVxyXG5cdFx0XHR2YXIgZ3VuID0gdGhpcywgYXQgPSAoZ3VuLl8pLCByb290ID0gYXQucm9vdCwgdG1wO1xyXG5cdFx0XHRhcyA9IGFzIHx8IHt9O1xyXG5cdFx0XHRhcy5kYXRhID0gZGF0YTtcclxuXHRcdFx0YXMuZ3VuID0gYXMuZ3VuIHx8IGd1bjtcclxuXHRcdFx0aWYodHlwZW9mIGNiID09PSAnc3RyaW5nJyl7XHJcblx0XHRcdFx0YXMuc291bCA9IGNiO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGFzLmFjayA9IGNiO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGF0LnNvdWwpe1xyXG5cdFx0XHRcdGFzLnNvdWwgPSBhdC5zb3VsO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGFzLnNvdWwgfHwgcm9vdCA9PT0gZ3VuKXtcclxuXHRcdFx0XHRpZighb2JqX2lzKGFzLmRhdGEpKXtcclxuXHRcdFx0XHRcdChhcy5hY2t8fG5vb3ApLmNhbGwoYXMsIGFzLm91dCA9IHtlcnI6IEd1bi5sb2coXCJEYXRhIHNhdmVkIHRvIHRoZSByb290IGxldmVsIG9mIHRoZSBncmFwaCBtdXN0IGJlIGEgbm9kZSAoYW4gb2JqZWN0KSwgbm90IGFcIiwgKHR5cGVvZiBhcy5kYXRhKSwgJ29mIFwiJyArIGFzLmRhdGEgKyAnXCIhJyl9KTtcclxuXHRcdFx0XHRcdGlmKGFzLnJlcyl7IGFzLnJlcygpIH1cclxuXHRcdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGFzLmd1biA9IGd1biA9IHJvb3QuZ2V0KGFzLnNvdWwgPSBhcy5zb3VsIHx8IChhcy5ub3QgPSBHdW4ubm9kZS5zb3VsKGFzLmRhdGEpIHx8ICgocm9vdC5fKS5vcHQudXVpZCB8fCBHdW4udGV4dC5yYW5kb20pKCkpKTtcclxuXHRcdFx0XHRhcy5yZWYgPSBhcy5ndW47XHJcblx0XHRcdFx0aWZ5KGFzKTtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKEd1bi5pcyhkYXRhKSl7XHJcblx0XHRcdFx0ZGF0YS5nZXQoZnVuY3Rpb24oYXQsZXYpe2V2Lm9mZigpO1xyXG5cdFx0XHRcdFx0dmFyIHMgPSBHdW4ubm9kZS5zb3VsKGF0LnB1dCk7XHJcblx0XHRcdFx0XHRpZighcyl7R3VuLmxvZyhcIlRoZSByZWZlcmVuY2UgeW91IGFyZSBzYXZpbmcgaXMgYVwiLCB0eXBlb2YgYXQucHV0LCAnXCInKyBhcy5wdXQgKydcIiwgbm90IGEgbm9kZSAob2JqZWN0KSEnKTtyZXR1cm59XHJcblx0XHRcdFx0XHRndW4ucHV0KEd1bi52YWwucmVsLmlmeShzKSwgY2IsIGFzKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFzLnJlZiA9IGFzLnJlZiB8fCAocm9vdCA9PT0gKHRtcCA9IGF0LmJhY2spKT8gZ3VuIDogdG1wO1xyXG5cdFx0XHRpZihhcy5yZWYuXy5zb3VsICYmIEd1bi52YWwuaXMoYXMuZGF0YSkgJiYgYXQuZ2V0KXtcclxuXHRcdFx0XHRhcy5kYXRhID0gb2JqX3B1dCh7fSwgYXQuZ2V0LCBhcy5kYXRhKTtcclxuXHRcdFx0XHRhcy5yZWYucHV0KGFzLmRhdGEsIGFzLnNvdWwsIGFzKTtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFzLnJlZi5nZXQoJ18nKS5nZXQoYW55LCB7YXM6IGFzfSk7XHJcblx0XHRcdGlmKCFhcy5vdXQpe1xyXG5cdFx0XHRcdC8vIFRPRE86IFBlcmYgaWRlYSEgTWFrZSBhIGdsb2JhbCBsb2NrLCB0aGF0IGJsb2NrcyBldmVyeXRoaW5nIHdoaWxlIGl0IGlzIG9uLCBidXQgaWYgaXQgaXMgb24gdGhlIGxvY2sgaXQgZG9lcyB0aGUgZXhwZW5zaXZlIGxvb2t1cCB0byBzZWUgaWYgaXQgaXMgYSBkZXBlbmRlbnQgd3JpdGUgb3Igbm90IGFuZCBpZiBub3QgdGhlbiBpdCBwcm9jZWVkcyBmdWxsIHNwZWVkLiBNZWg/IEZvciB3cml0ZSBoZWF2eSBhc3luYyBhcHBzIHRoYXQgd291bGQgYmUgdGVycmlibGUuXHJcblx0XHRcdFx0YXMucmVzID0gYXMucmVzIHx8IEd1bi5vbi5zdHVuKGFzLnJlZik7XHJcblx0XHRcdFx0YXMuZ3VuLl8uc3R1biA9IGFzLnJlZi5fLnN0dW47XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdH07XHJcblxyXG5cdFx0ZnVuY3Rpb24gaWZ5KGFzKXtcclxuXHRcdFx0YXMuYmF0Y2ggPSBiYXRjaDtcclxuXHRcdFx0dmFyIG9wdCA9IGFzLm9wdHx8e30sIGVudiA9IGFzLmVudiA9IEd1bi5zdGF0ZS5tYXAobWFwLCBvcHQuc3RhdGUpO1xyXG5cdFx0XHRlbnYuc291bCA9IGFzLnNvdWw7XHJcblx0XHRcdGFzLmdyYXBoID0gR3VuLmdyYXBoLmlmeShhcy5kYXRhLCBlbnYsIGFzKTtcclxuXHRcdFx0aWYoZW52LmVycil7XHJcblx0XHRcdFx0KGFzLmFja3x8bm9vcCkuY2FsbChhcywgYXMub3V0ID0ge2VycjogR3VuLmxvZyhlbnYuZXJyKX0pO1xyXG5cdFx0XHRcdGlmKGFzLnJlcyl7IGFzLnJlcygpIH1cclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0YXMuYmF0Y2goKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBiYXRjaCgpeyB2YXIgYXMgPSB0aGlzO1xyXG5cdFx0XHRpZighYXMuZ3JhcGggfHwgb2JqX21hcChhcy5zdHVuLCBubykpeyByZXR1cm4gfVxyXG5cdFx0XHQoYXMucmVzfHxpaWZlKShmdW5jdGlvbigpe1xyXG5cdFx0XHRcdChhcy5yZWYuXykub24oJ291dCcsIHtcclxuXHRcdFx0XHRcdGNhcDogMyxcclxuXHRcdFx0XHRcdGd1bjogYXMucmVmLCBwdXQ6IGFzLm91dCA9IGFzLmVudi5ncmFwaCwgb3B0OiBhcy5vcHQsXHJcblx0XHRcdFx0XHQnIyc6IGFzLmd1bi5iYWNrKC0xKS5fLmFzayhmdW5jdGlvbihhY2speyB0aGlzLm9mZigpOyAvLyBPbmUgcmVzcG9uc2UgaXMgZ29vZCBlbm91Z2ggZm9yIHVzIGN1cnJlbnRseS4gTGF0ZXIgd2UgbWF5IHdhbnQgdG8gYWRqdXN0IHRoaXMuXHJcblx0XHRcdFx0XHRcdGlmKCFhcy5hY2speyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0XHRhcy5hY2soYWNrLCB0aGlzKTtcclxuXHRcdFx0XHRcdH0sIGFzLm9wdClcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSwgYXMpO1xyXG5cdFx0XHRpZihhcy5yZXMpeyBhcy5yZXMoKSB9XHJcblx0XHR9IGZ1bmN0aW9uIG5vKHYsZil7IGlmKHYpeyByZXR1cm4gdHJ1ZSB9IH1cclxuXHJcblx0XHRmdW5jdGlvbiBtYXAodixmLG4sIGF0KXsgdmFyIGFzID0gdGhpcztcclxuXHRcdFx0aWYoZiB8fCAhYXQucGF0aC5sZW5ndGgpeyByZXR1cm4gfVxyXG5cdFx0XHQoYXMucmVzfHxpaWZlKShmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciBwYXRoID0gYXQucGF0aCwgcmVmID0gYXMucmVmLCBvcHQgPSBhcy5vcHQ7XHJcblx0XHRcdFx0dmFyIGkgPSAwLCBsID0gcGF0aC5sZW5ndGg7XHJcblx0XHRcdFx0Zm9yKGk7IGkgPCBsOyBpKyspe1xyXG5cdFx0XHRcdFx0cmVmID0gcmVmLmdldChwYXRoW2ldKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoYXMubm90IHx8IEd1bi5ub2RlLnNvdWwoYXQub2JqKSl7XHJcblx0XHRcdFx0XHR2YXIgaWQgPSBHdW4ubm9kZS5zb3VsKGF0Lm9iaikgfHwgKChhcy5vcHR8fHt9KS51dWlkIHx8IGFzLmd1bi5iYWNrKCdvcHQudXVpZCcpIHx8IEd1bi50ZXh0LnJhbmRvbSkoKTtcclxuXHRcdFx0XHRcdHJlZi5iYWNrKC0xKS5nZXQoaWQpO1xyXG5cdFx0XHRcdFx0YXQuc291bChpZCk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdChhcy5zdHVuID0gYXMuc3R1biB8fCB7fSlbcGF0aF0gPSB0cnVlO1xyXG5cdFx0XHRcdHJlZi5nZXQoJ18nKS5nZXQoc291bCwge2FzOiB7YXQ6IGF0LCBhczogYXN9fSk7XHJcblx0XHRcdH0sIHthczogYXMsIGF0OiBhdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHNvdWwoYXQsIGV2KXsgdmFyIGFzID0gdGhpcy5hcywgY2F0ID0gYXMuYXQ7IGFzID0gYXMuYXM7XHJcblx0XHRcdC8vZXYuc3R1bigpOyAvLyBUT0RPOiBCVUchP1xyXG5cdFx0XHRpZighYXQuZ3VuIHx8ICFhdC5ndW4uXy5iYWNrKXsgcmV0dXJuIH0gLy8gVE9ETzogSGFuZGxlXHJcblx0XHRcdGV2Lm9mZigpO1xyXG5cdFx0XHRhdCA9IChhdC5ndW4uXy5iYWNrLl8pO1xyXG5cdFx0XHR2YXIgaWQgPSBHdW4ubm9kZS5zb3VsKGNhdC5vYmopIHx8IEd1bi5ub2RlLnNvdWwoYXQucHV0KSB8fCBHdW4udmFsLnJlbC5pcyhhdC5wdXQpIHx8ICgoYXMub3B0fHx7fSkudXVpZCB8fCBhcy5ndW4uYmFjaygnb3B0LnV1aWQnKSB8fCBHdW4udGV4dC5yYW5kb20pKCk7IC8vIFRPRE86IEJVRyE/IERvIHdlIHJlYWxseSB3YW50IHRoZSBzb3VsIG9mIHRoZSBvYmplY3QgZ2l2ZW4gdG8gdXM/IENvdWxkIHRoYXQgYmUgZGFuZ2Vyb3VzP1xyXG5cdFx0XHRhdC5ndW4uYmFjaygtMSkuZ2V0KGlkKTtcclxuXHRcdFx0Y2F0LnNvdWwoaWQpO1xyXG5cdFx0XHRhcy5zdHVuW2NhdC5wYXRoXSA9IGZhbHNlO1xyXG5cdFx0XHRhcy5iYXRjaCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGFueShhdCwgZXYpe1xyXG5cdFx0XHR2YXIgYXMgPSB0aGlzLmFzO1xyXG5cdFx0XHRpZighYXQuZ3VuIHx8ICFhdC5ndW4uXyl7IHJldHVybiB9IC8vIFRPRE86IEhhbmRsZVxyXG5cdFx0XHRpZihhdC5lcnIpeyAvLyBUT0RPOiBIYW5kbGVcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIlBsZWFzZSByZXBvcnQgdGhpcyBhcyBhbiBpc3N1ZSEgUHV0LmFueS5lcnJcIik7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBjYXQgPSAoYXQuZ3VuLl8uYmFjay5fKSwgZGF0YSA9IGNhdC5wdXQsIG9wdCA9IGFzLm9wdHx8e30sIHJvb3QsIHRtcDtcclxuXHRcdFx0ZXYub2ZmKCk7XHJcblx0XHRcdGlmKGFzLnJlZiAhPT0gYXMuZ3VuKXtcclxuXHRcdFx0XHR0bXAgPSAoYXMuZ3VuLl8pLmdldCB8fCBjYXQuZ2V0O1xyXG5cdFx0XHRcdGlmKCF0bXApeyAvLyBUT0RPOiBIYW5kbGVcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiUGxlYXNlIHJlcG9ydCB0aGlzIGFzIGFuIGlzc3VlISBQdXQubm8uZ2V0XCIpOyAvLyBUT0RPOiBCVUchPz9cclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YXMuZGF0YSA9IG9ial9wdXQoe30sIHRtcCwgYXMuZGF0YSk7XHJcblx0XHRcdFx0dG1wID0gbnVsbDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih1ID09PSBkYXRhKXtcclxuXHRcdFx0XHRpZighY2F0LmdldCl7IHJldHVybiB9IC8vIFRPRE86IEhhbmRsZVxyXG5cdFx0XHRcdGlmKCFjYXQuc291bCl7XHJcblx0XHRcdFx0XHR0bXAgPSBjYXQuZ3VuLmJhY2soZnVuY3Rpb24oYXQpe1xyXG5cdFx0XHRcdFx0XHRpZihhdC5zb3VsKXsgcmV0dXJuIGF0LnNvdWwgfVxyXG5cdFx0XHRcdFx0XHRhcy5kYXRhID0gb2JqX3B1dCh7fSwgYXQuZ2V0LCBhcy5kYXRhKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0bXAgPSB0bXAgfHwgY2F0LmdldDtcclxuXHRcdFx0XHRjYXQgPSAoY2F0LnJvb3QuZ2V0KHRtcCkuXyk7XHJcblx0XHRcdFx0YXMubm90ID0gYXMuc291bCA9IHRtcDtcclxuXHRcdFx0XHRkYXRhID0gYXMuZGF0YTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZighYXMubm90ICYmICEoYXMuc291bCA9IEd1bi5ub2RlLnNvdWwoZGF0YSkpKXtcclxuXHRcdFx0XHRpZihhcy5wYXRoICYmIG9ial9pcyhhcy5kYXRhKSl7IC8vIEFwcGFyZW50bHkgbmVjZXNzYXJ5XHJcblx0XHRcdFx0XHRhcy5zb3VsID0gKG9wdC51dWlkIHx8IGNhdC5yb290Ll8ub3B0LnV1aWQgfHwgR3VuLnRleHQucmFuZG9tKSgpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvL2FzLmRhdGEgPSBvYmpfcHV0KHt9LCBhcy5ndW4uXy5nZXQsIGFzLmRhdGEpO1xyXG5cdFx0XHRcdFx0YXMuc291bCA9IGF0LnNvdWwgfHwgY2F0LnNvdWwgfHwgKG9wdC51dWlkIHx8IGNhdC5yb290Ll8ub3B0LnV1aWQgfHwgR3VuLnRleHQucmFuZG9tKSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRhcy5yZWYucHV0KGFzLmRhdGEsIGFzLnNvdWwsIGFzKTtcclxuXHRcdH1cclxuXHRcdHZhciBvYmogPSBHdW4ub2JqLCBvYmpfaXMgPSBvYmouaXMsIG9ial9wdXQgPSBvYmoucHV0LCBvYmpfbWFwID0gb2JqLm1hcDtcclxuXHRcdHZhciB1LCBlbXB0eSA9IHt9LCBub29wID0gZnVuY3Rpb24oKXt9LCBpaWZlID0gZnVuY3Rpb24oZm4sYXMpe2ZuLmNhbGwoYXN8fGVtcHR5KX07XHJcblx0fSkocmVxdWlyZSwgJy4vcHV0Jyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblxyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vcm9vdCcpO1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBHdW47XHJcblxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRmdW5jdGlvbiBtZXRhKHYsZil7XHJcblx0XHRcdFx0aWYob2JqX2hhcyhHdW4uX18uXywgZikpeyByZXR1cm4gfVxyXG5cdFx0XHRcdG9ial9wdXQodGhpcy5fLCBmLCB2KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBtYXAodmFsdWUsIGZpZWxkKXtcclxuXHRcdFx0XHRpZihHdW4uXy5ub2RlID09PSBmaWVsZCl7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIG5vZGUgPSB0aGlzLm5vZGUsIHZlcnRleCA9IHRoaXMudmVydGV4LCB1bmlvbiA9IHRoaXMudW5pb24sIG1hY2hpbmUgPSB0aGlzLm1hY2hpbmU7XHJcblx0XHRcdFx0dmFyIGlzID0gc3RhdGVfaXMobm9kZSwgZmllbGQpLCBjcyA9IHN0YXRlX2lzKHZlcnRleCwgZmllbGQpO1xyXG5cdFx0XHRcdGlmKHUgPT09IGlzIHx8IHUgPT09IGNzKXsgcmV0dXJuIHRydWUgfSAvLyBpdCBpcyB0cnVlIHRoYXQgdGhpcyBpcyBhbiBpbnZhbGlkIEhBTSBjb21wYXJpc29uLlxyXG5cdFx0XHRcdHZhciBpdiA9IHZhbHVlLCBjdiA9IHZlcnRleFtmaWVsZF07XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHRcdFx0XHQvLyBUT0RPOiBCVUchIE5lZWQgdG8gY29tcGFyZSByZWxhdGlvbiB0byBub3QgcmVsYXRpb24sIGFuZCBjaG9vc2UgdGhlIHJlbGF0aW9uIGlmIHRoZXJlIGlzIGEgc3RhdGUgY29uZmxpY3QuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHRcdFx0XHRpZighdmFsX2lzKGl2KSAmJiB1ICE9PSBpdil7IHJldHVybiB0cnVlIH0gLy8gVW5kZWZpbmVkIGlzIG9rYXkgc2luY2UgYSB2YWx1ZSBtaWdodCBub3QgZXhpc3Qgb24gYm90aCBub2Rlcy4gLy8gaXQgaXMgdHJ1ZSB0aGF0IHRoaXMgaXMgYW4gaW52YWxpZCBIQU0gY29tcGFyaXNvbi5cclxuXHRcdFx0XHRpZighdmFsX2lzKGN2KSAmJiB1ICE9PSBjdil7IHJldHVybiB0cnVlIH0gIC8vIFVuZGVmaW5lZCBpcyBva2F5IHNpbmNlIGEgdmFsdWUgbWlnaHQgbm90IGV4aXN0IG9uIGJvdGggbm9kZXMuIC8vIGl0IGlzIHRydWUgdGhhdCB0aGlzIGlzIGFuIGludmFsaWQgSEFNIGNvbXBhcmlzb24uXHJcblx0XHRcdFx0dmFyIEhBTSA9IEd1bi5IQU0obWFjaGluZSwgaXMsIGNzLCBpdiwgY3YpO1xyXG5cdFx0XHRcdGlmKEhBTS5lcnIpe1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCIuIUhZUE9USEVUSUNBTCBBTU5FU0lBIE1BQ0hJTkUgRVJSIS5cIiwgZmllbGQsIEhBTS5lcnIpOyAvLyB0aGlzIGVycm9yIHNob3VsZCBuZXZlciBoYXBwZW4uXHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKEhBTS5zdGF0ZSB8fCBIQU0uaGlzdG9yaWNhbCB8fCBIQU0uY3VycmVudCl7IC8vIFRPRE86IEJVRyEgTm90IGltcGxlbWVudGVkLlxyXG5cdFx0XHRcdFx0Ly9vcHQubG93ZXIodmVydGV4LCB7ZmllbGQ6IGZpZWxkLCB2YWx1ZTogdmFsdWUsIHN0YXRlOiBpc30pO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihIQU0uaW5jb21pbmcpe1xyXG5cdFx0XHRcdFx0dW5pb25bZmllbGRdID0gdmFsdWU7XHJcblx0XHRcdFx0XHRzdGF0ZV9pZnkodW5pb24sIGZpZWxkLCBpcyk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKEhBTS5kZWZlcil7IC8vIFRPRE86IEJVRyEgTm90IGltcGxlbWVudGVkLlxyXG5cdFx0XHRcdFx0dW5pb25bZmllbGRdID0gdmFsdWU7IC8vIFdST05HISBCVUchIE5lZWQgdG8gaW1wbGVtZW50IGNvcnJlY3QgYWxnb3JpdGhtLlxyXG5cdFx0XHRcdFx0c3RhdGVfaWZ5KHVuaW9uLCBmaWVsZCwgaXMpOyAvLyBXUk9ORyEgQlVHISBOZWVkIHRvIGltcGxlbWVudCBjb3JyZWN0IGFsZ29yaXRobS5cclxuXHRcdFx0XHRcdC8vIGZpbGxlciBhbGdvcml0aG0gZm9yIG5vdy5cclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdC8qdXBwZXIud2FpdCA9IHRydWU7XHJcblx0XHRcdFx0XHRvcHQudXBwZXIuY2FsbChzdGF0ZSwgdmVydGV4LCBmaWVsZCwgaW5jb21pbmcsIGN0eC5pbmNvbWluZy5zdGF0ZSk7IC8vIHNpZ25hbHMgdGhhdCB0aGVyZSBhcmUgc3RpbGwgZnV0dXJlIG1vZGlmaWNhdGlvbnMuXHJcblx0XHRcdFx0XHRHdW4uc2NoZWR1bGUoY3R4LmluY29taW5nLnN0YXRlLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0XHR1cGRhdGUoaW5jb21pbmcsIGZpZWxkKTtcclxuXHRcdFx0XHRcdFx0aWYoY3R4LmluY29taW5nLnN0YXRlID09PSB1cHBlci5tYXgpeyAodXBwZXIubGFzdCB8fCBmdW5jdGlvbigpe30pKCkgfVxyXG5cdFx0XHRcdFx0fSwgZ3VuLl9fLm9wdC5zdGF0ZSk7Ki9cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0R3VuLkhBTS51bmlvbiA9IGZ1bmN0aW9uKHZlcnRleCwgbm9kZSwgb3B0KXtcclxuXHRcdFx0XHRpZighbm9kZSB8fCAhbm9kZS5fKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2ZXJ0ZXggPSB2ZXJ0ZXggfHwgR3VuLm5vZGUuc291bC5pZnkoe186eyc+Jzp7fX19LCBHdW4ubm9kZS5zb3VsKG5vZGUpKTtcclxuXHRcdFx0XHRpZighdmVydGV4IHx8ICF2ZXJ0ZXguXyl7IHJldHVybiB9XHJcblx0XHRcdFx0b3B0ID0gbnVtX2lzKG9wdCk/IHttYWNoaW5lOiBvcHR9IDoge21hY2hpbmU6IEd1bi5zdGF0ZSgpfTtcclxuXHRcdFx0XHRvcHQudW5pb24gPSB2ZXJ0ZXggfHwgR3VuLm9iai5jb3B5KHZlcnRleCk7IC8vIFRPRE86IFBFUkYhIFRoaXMgd2lsbCBzbG93IHRoaW5ncyBkb3duIVxyXG5cdFx0XHRcdC8vIFRPRE86IFBFUkYhIEJpZ2dlc3Qgc2xvd2Rvd24gKGFmdGVyIDFvY2FsU3RvcmFnZSkgaXMgdGhlIGFib3ZlIGxpbmUuIEZpeCEgRml4IVxyXG5cdFx0XHRcdG9wdC52ZXJ0ZXggPSB2ZXJ0ZXg7XHJcblx0XHRcdFx0b3B0Lm5vZGUgPSBub2RlO1xyXG5cdFx0XHRcdC8vb2JqX21hcChub2RlLl8sIG1ldGEsIG9wdC51bmlvbik7IC8vIFRPRE86IFJldmlldyBhdCBzb21lIHBvaW50P1xyXG5cdFx0XHRcdGlmKG9ial9tYXAobm9kZSwgbWFwLCBvcHQpKXsgLy8gaWYgdGhpcyByZXR1cm5zIHRydWUgdGhlbiBzb21ldGhpbmcgd2FzIGludmFsaWQuXHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBvcHQudW5pb247XHJcblx0XHRcdH1cclxuXHRcdFx0R3VuLkhBTS5kZWx0YSA9IGZ1bmN0aW9uKHZlcnRleCwgbm9kZSwgb3B0KXtcclxuXHRcdFx0XHRvcHQgPSBudW1faXMob3B0KT8ge21hY2hpbmU6IG9wdH0gOiB7bWFjaGluZTogR3VuLnN0YXRlKCl9O1xyXG5cdFx0XHRcdGlmKCF2ZXJ0ZXgpeyByZXR1cm4gR3VuLm9iai5jb3B5KG5vZGUpIH1cclxuXHRcdFx0XHRvcHQuc291bCA9IEd1bi5ub2RlLnNvdWwob3B0LnZlcnRleCA9IHZlcnRleCk7XHJcblx0XHRcdFx0aWYoIW9wdC5zb3VsKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRvcHQuZGVsdGEgPSBHdW4ubm9kZS5zb3VsLmlmeSh7fSwgb3B0LnNvdWwpO1xyXG5cdFx0XHRcdG9ial9tYXAob3B0Lm5vZGUgPSBub2RlLCBkaWZmLCBvcHQpO1xyXG5cdFx0XHRcdHJldHVybiBvcHQuZGVsdGE7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gZGlmZih2YWx1ZSwgZmllbGQpeyB2YXIgb3B0ID0gdGhpcztcclxuXHRcdFx0XHRpZihHdW4uXy5ub2RlID09PSBmaWVsZCl7IHJldHVybiB9XHJcblx0XHRcdFx0aWYoIXZhbF9pcyh2YWx1ZSkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdHZhciBub2RlID0gb3B0Lm5vZGUsIHZlcnRleCA9IG9wdC52ZXJ0ZXgsIGlzID0gc3RhdGVfaXMobm9kZSwgZmllbGQsIHRydWUpLCBjcyA9IHN0YXRlX2lzKHZlcnRleCwgZmllbGQsIHRydWUpLCBkZWx0YSA9IG9wdC5kZWx0YTtcclxuXHRcdFx0XHR2YXIgSEFNID0gR3VuLkhBTShvcHQubWFjaGluZSwgaXMsIGNzLCB2YWx1ZSwgdmVydGV4W2ZpZWxkXSk7XHJcblxyXG5cclxuXHJcblx0XHRcdFx0Ly8gVE9ETzogQlVHISEhISBXSEFUIEFCT1VUIERFRkVSUkVEIT8/P1xyXG5cdFx0XHRcdFxyXG5cclxuXHJcblx0XHRcdFx0aWYoSEFNLmluY29taW5nKXtcclxuXHRcdFx0XHRcdGRlbHRhW2ZpZWxkXSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0c3RhdGVfaWZ5KGRlbHRhLCBmaWVsZCwgaXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRHdW4uSEFNLnN5bnRoID0gZnVuY3Rpb24oYXQsIGV2KXtcclxuXHRcdFx0XHR2YXIgYXMgPSB0aGlzLmFzLCBjYXQgPSBhcy5ndW4uXztcclxuXHRcdFx0XHRpZighYXQucHV0IHx8IChhc1snLiddICYmICFvYmpfaGFzKGF0LnB1dFthc1snIyddXSwgY2F0LmdldCkpKXtcclxuXHRcdFx0XHRcdGlmKGNhdC5wdXQgIT09IHUpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0Y2F0Lm9uKCdpbicsIHtcclxuXHRcdFx0XHRcdFx0Z2V0OiBjYXQuZ2V0LFxyXG5cdFx0XHRcdFx0XHRwdXQ6IGNhdC5wdXQgPSB1LFxyXG5cdFx0XHRcdFx0XHRndW46IGNhdC5ndW4sXHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRhdC5ndW4gPSBjYXQucm9vdDtcclxuXHRcdFx0XHRHdW4ub24oJ3B1dCcsIGF0KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRHdW4uSEFNLnN5bnRoXyA9IGZ1bmN0aW9uKGF0LCBldiwgYXMpeyB2YXIgZ3VuID0gdGhpcy5hcyB8fCBhcztcclxuXHRcdFx0XHR2YXIgY2F0ID0gZ3VuLl8sIHJvb3QgPSBjYXQucm9vdC5fLCBwdXQgPSB7fSwgdG1wO1xyXG5cdFx0XHRcdGlmKCFhdC5wdXQpe1xyXG5cdFx0XHRcdFx0Ly9pZihvYmpfaGFzKGNhdCwgJ3B1dCcpKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdGlmKGNhdC5wdXQgIT09IHUpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0Y2F0Lm9uKCdpbicsIHtcclxuXHRcdFx0XHRcdC8vcm9vdC5hY2soYXRbJ0AnXSwge1xyXG5cdFx0XHRcdFx0XHRnZXQ6IGNhdC5nZXQsXHJcblx0XHRcdFx0XHRcdHB1dDogY2F0LnB1dCA9IHUsXHJcblx0XHRcdFx0XHRcdGd1bjogZ3VuLFxyXG5cdFx0XHRcdFx0XHR2aWE6IGF0XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBUT0RPOiBQRVJGISBIYXZlIG9wdGlvbnMgdG8gZGV0ZXJtaW5lIGlmIHRoaXMgZGF0YSBzaG91bGQgZXZlbiBiZSBpbiBtZW1vcnkgb24gdGhpcyBwZWVyIVxyXG5cdFx0XHRcdG9ial9tYXAoYXQucHV0LCBmdW5jdGlvbihub2RlLCBzb3VsKXsgdmFyIGdyYXBoID0gdGhpcy5ncmFwaDtcclxuXHRcdFx0XHRcdHB1dFtzb3VsXSA9IEd1bi5IQU0uZGVsdGEoZ3JhcGhbc291bF0sIG5vZGUsIHtncmFwaDogZ3JhcGh9KTsgLy8gVE9ETzogUEVSRiEgU0VFIElGIFdFIENBTiBPUFRJTUlaRSBUSElTIEJZIE1FUkdJTkcgVU5JT04gSU5UTyBERUxUQSFcclxuXHRcdFx0XHRcdGdyYXBoW3NvdWxdID0gR3VuLkhBTS51bmlvbihncmFwaFtzb3VsXSwgbm9kZSkgfHwgZ3JhcGhbc291bF07XHJcblx0XHRcdFx0fSwgcm9vdCk7XHJcblx0XHRcdFx0aWYoYXQuZ3VuICE9PSByb290Lmd1bil7XHJcblx0XHRcdFx0XHRwdXQgPSBhdC5wdXQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIFRPRE86IFBFUkYhIEhhdmUgb3B0aW9ucyB0byBkZXRlcm1pbmUgaWYgdGhpcyBkYXRhIHNob3VsZCBldmVuIGJlIGluIG1lbW9yeSBvbiB0aGlzIHBlZXIhXHJcblx0XHRcdFx0b2JqX21hcChwdXQsIGZ1bmN0aW9uKG5vZGUsIHNvdWwpe1xyXG5cdFx0XHRcdFx0dmFyIHJvb3QgPSB0aGlzLCBuZXh0ID0gcm9vdC5uZXh0IHx8IChyb290Lm5leHQgPSB7fSksIGd1biA9IG5leHRbc291bF0gfHwgKG5leHRbc291bF0gPSByb290Lmd1bi5nZXQoc291bCkpLCBjb2F0ID0gKGd1bi5fKTtcclxuXHRcdFx0XHRcdGNvYXQucHV0ID0gcm9vdC5ncmFwaFtzb3VsXTsgLy8gVE9ETzogQlVHISBDbG9uZSFcclxuXHRcdFx0XHRcdGlmKGNhdC5maWVsZCAmJiAhb2JqX2hhcyhub2RlLCBjYXQuZmllbGQpKXtcclxuXHRcdFx0XHRcdFx0KGF0ID0gb2JqX3RvKGF0LCB7fSkpLnB1dCA9IHU7XHJcblx0XHRcdFx0XHRcdEd1bi5IQU0uc3ludGgoYXQsIGV2LCBjYXQuZ3VuKTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y29hdC5vbignaW4nLCB7XHJcblx0XHRcdFx0XHRcdHB1dDogbm9kZSxcclxuXHRcdFx0XHRcdFx0Z2V0OiBzb3VsLFxyXG5cdFx0XHRcdFx0XHRndW46IGd1bixcclxuXHRcdFx0XHRcdFx0dmlhOiBhdFxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSwgcm9vdCk7XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblxyXG5cdFx0dmFyIFR5cGUgPSBHdW47XHJcblx0XHR2YXIgbnVtID0gVHlwZS5udW0sIG51bV9pcyA9IG51bS5pcztcclxuXHRcdHZhciBvYmogPSBUeXBlLm9iaiwgb2JqX2hhcyA9IG9iai5oYXMsIG9ial9wdXQgPSBvYmoucHV0LCBvYmpfdG8gPSBvYmoudG8sIG9ial9tYXAgPSBvYmoubWFwO1xyXG5cdFx0dmFyIG5vZGUgPSBHdW4ubm9kZSwgbm9kZV9zb3VsID0gbm9kZS5zb3VsLCBub2RlX2lzID0gbm9kZS5pcywgbm9kZV9pZnkgPSBub2RlLmlmeTtcclxuXHRcdHZhciBzdGF0ZSA9IEd1bi5zdGF0ZSwgc3RhdGVfaXMgPSBzdGF0ZS5pcywgc3RhdGVfaWZ5ID0gc3RhdGUuaWZ5O1xyXG5cdFx0dmFyIHZhbCA9IEd1bi52YWwsIHZhbF9pcyA9IHZhbC5pcywgcmVsX2lzID0gdmFsLnJlbC5pcztcclxuXHRcdHZhciB1O1xyXG5cdH0pKHJlcXVpcmUsICcuL2luZGV4Jyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9yb290Jyk7XHJcblx0XHRyZXF1aXJlKCcuL2luZGV4Jyk7IC8vIFRPRE86IENMRUFOIFVQISBNRVJHRSBJTlRPIFJPT1QhXHJcblx0XHRyZXF1aXJlKCcuL29wdCcpO1xyXG5cdFx0cmVxdWlyZSgnLi9jaGFpbicpO1xyXG5cdFx0cmVxdWlyZSgnLi9iYWNrJyk7XHJcblx0XHRyZXF1aXJlKCcuL3B1dCcpO1xyXG5cdFx0cmVxdWlyZSgnLi9nZXQnKTtcclxuXHRcdG1vZHVsZS5leHBvcnRzID0gR3VuO1xyXG5cdH0pKHJlcXVpcmUsICcuL2NvcmUnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL2NvcmUnKTtcclxuXHRcdEd1bi5jaGFpbi5wYXRoID0gZnVuY3Rpb24oZmllbGQsIGNiLCBvcHQpe1xyXG5cdFx0XHR2YXIgYmFjayA9IHRoaXMsIGd1biA9IGJhY2ssIHRtcDtcclxuXHRcdFx0b3B0ID0gb3B0IHx8IHt9OyBvcHQucGF0aCA9IHRydWU7XHJcblx0XHRcdEd1bi5sb2cub25jZShcInBhdGhpbmdcIiwgXCJXYXJuaW5nOiBgLnBhdGhgIHRvIGJlIHJlbW92ZWQgZnJvbSBjb3JlIChidXQgYXZhaWxhYmxlIGFzIGFuIGV4dGVuc2lvbiksIHVzZSBgLmdldGAgY2hhaW5zIGluc3RlYWQuIElmIHlvdSBhcmUgb3Bwb3NlZCB0byB0aGlzLCBwbGVhc2Ugdm9pY2UgeW91ciBvcGluaW9uIGluIGh0dHBzOi8vZ2l0dGVyLmltL2FtYXJrL2d1biBhbmQgYXNrIG90aGVycy5cIik7XHJcblx0XHRcdGlmKGd1biA9PT0gZ3VuLl8ucm9vdCl7aWYoY2Ipe2NiKHtlcnI6IEd1bi5sb2coXCJDYW4ndCBkbyB0aGF0IG9uIHJvb3QgaW5zdGFuY2UuXCIpfSl9cmV0dXJuIGd1bn1cclxuXHRcdFx0aWYodHlwZW9mIGZpZWxkID09PSAnc3RyaW5nJyl7XHJcblx0XHRcdFx0dG1wID0gZmllbGQuc3BsaXQob3B0LnNwbGl0IHx8ICcuJyk7XHJcblx0XHRcdFx0aWYoMSA9PT0gdG1wLmxlbmd0aCl7XHJcblx0XHRcdFx0XHRndW4gPSBiYWNrLmdldChmaWVsZCwgY2IsIG9wdCk7XHJcblx0XHRcdFx0XHRndW4uXy5vcHQgPSBvcHQ7XHJcblx0XHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRmaWVsZCA9IHRtcDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihmaWVsZCBpbnN0YW5jZW9mIEFycmF5KXtcclxuXHRcdFx0XHRpZihmaWVsZC5sZW5ndGggPiAxKXtcclxuXHRcdFx0XHRcdGd1biA9IGJhY2s7XHJcblx0XHRcdFx0XHR2YXIgaSA9IDAsIGwgPSBmaWVsZC5sZW5ndGg7XHJcblx0XHRcdFx0XHRmb3IoaTsgaSA8IGw7IGkrKyl7XHJcblx0XHRcdFx0XHRcdGd1biA9IGd1bi5nZXQoZmllbGRbaV0sIChpKzEgPT09IGwpPyBjYiA6IG51bGwsIG9wdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvL2d1bi5iYWNrID0gYmFjazsgLy8gVE9ETzogQVBJIGNoYW5nZSFcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Z3VuID0gYmFjay5nZXQoZmllbGRbMF0sIGNiLCBvcHQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRndW4uXy5vcHQgPSBvcHQ7XHJcblx0XHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZighZmllbGQgJiYgMCAhPSBmaWVsZCl7XHJcblx0XHRcdFx0cmV0dXJuIGJhY2s7XHJcblx0XHRcdH1cclxuXHRcdFx0Z3VuID0gYmFjay5nZXQoJycrZmllbGQsIGNiLCBvcHQpO1xyXG5cdFx0XHRndW4uXy5vcHQgPSBvcHQ7XHJcblx0XHRcdHJldHVybiBndW47XHJcblx0XHR9XHJcblx0fSkocmVxdWlyZSwgJy4vcGF0aCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vY29yZScpO1xyXG5cdFx0R3VuLmNoYWluLm9uID0gZnVuY3Rpb24odGFnLCBhcmcsIGVhcywgYXMpe1xyXG5cdFx0XHR2YXIgZ3VuID0gdGhpcywgYXQgPSBndW4uXywgdG1wLCBhY3QsIG9mZjtcclxuXHRcdFx0aWYodHlwZW9mIHRhZyA9PT0gJ3N0cmluZycpe1xyXG5cdFx0XHRcdGlmKCFhcmcpeyByZXR1cm4gYXQub24odGFnKSB9XHJcblx0XHRcdFx0YWN0ID0gYXQub24odGFnLCBhcmcsIGVhcyB8fCBhdCwgYXMpO1xyXG5cdFx0XHRcdGlmKGVhcyAmJiBlYXMuZ3VuKXtcclxuXHRcdFx0XHRcdChlYXMuc3VicyB8fCAoZWFzLnN1YnMgPSBbXSkpLnB1c2goYWN0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0b2ZmID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRpZiAoYWN0ICYmIGFjdC5vZmYpIGFjdC5vZmYoKTtcclxuXHRcdFx0XHRcdG9mZi5vZmYoKTtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdG9mZi5vZmYgPSBndW4ub2ZmLmJpbmQoZ3VuKSB8fCBub29wO1xyXG5cdFx0XHRcdGd1bi5vZmYgPSBvZmY7XHJcblx0XHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgb3B0ID0gYXJnO1xyXG5cdFx0XHRvcHQgPSAodHJ1ZSA9PT0gb3B0KT8ge2NoYW5nZTogdHJ1ZX0gOiBvcHQgfHwge307XHJcblx0XHRcdG9wdC5vayA9IHRhZztcclxuXHRcdFx0b3B0Lmxhc3QgPSB7fTtcclxuXHRcdFx0Z3VuLmdldChvaywgb3B0KTsgLy8gVE9ETzogUEVSRiEgRXZlbnQgbGlzdGVuZXIgbGVhayEhIT8/Pz9cclxuXHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBvayhhdCwgZXYpeyB2YXIgb3B0ID0gdGhpcztcclxuXHRcdFx0dmFyIGd1biA9IGF0Lmd1biwgY2F0ID0gZ3VuLl8sIGRhdGEgPSBjYXQucHV0IHx8IGF0LnB1dCwgdG1wID0gb3B0Lmxhc3QsIGlkID0gY2F0LmlkK2F0LmdldCwgdG1wO1xyXG5cdFx0XHRpZih1ID09PSBkYXRhKXtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoZGF0YSAmJiBkYXRhW3JlbC5fXSAmJiAodG1wID0gcmVsLmlzKGRhdGEpKSl7XHJcblx0XHRcdFx0dG1wID0gKGNhdC5yb290LmdldCh0bXApLl8pO1xyXG5cdFx0XHRcdGlmKHUgPT09IHRtcC5wdXQpe1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRkYXRhID0gdG1wLnB1dDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihvcHQuY2hhbmdlKXsgLy8gVE9ETzogQlVHPyBNb3ZlIGFib3ZlIHRoZSB1bmRlZiBjaGVja3M/XHJcblx0XHRcdFx0ZGF0YSA9IGF0LnB1dDtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBERURVUExJQ0FURSAvLyBUT0RPOiBORUVEUyBXT1JLISBCQUQgUFJPVE9UWVBFXHJcblx0XHRcdGlmKHRtcC5wdXQgPT09IGRhdGEgJiYgdG1wLmdldCA9PT0gaWQgJiYgIUd1bi5ub2RlLnNvdWwoZGF0YSkpeyByZXR1cm4gfVxyXG5cdFx0XHR0bXAucHV0ID0gZGF0YTtcclxuXHRcdFx0dG1wLmdldCA9IGlkO1xyXG5cdFx0XHQvLyBERURVUExJQ0FURSAvLyBUT0RPOiBORUVEUyBXT1JLISBCQUQgUFJPVE9UWVBFXHJcblx0XHRcdGNhdC5sYXN0ID0gZGF0YTtcclxuXHRcdFx0aWYob3B0LmFzKXtcclxuXHRcdFx0XHRvcHQub2suY2FsbChvcHQuYXMsIGF0LCBldik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0b3B0Lm9rLmNhbGwoZ3VuLCBkYXRhLCBhdC5nZXQsIGF0LCBldik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRHdW4uY2hhaW4udmFsID0gZnVuY3Rpb24oY2IsIG9wdCl7XHJcblx0XHRcdHZhciBndW4gPSB0aGlzLCBhdCA9IGd1bi5fLCBkYXRhID0gYXQucHV0O1xyXG5cdFx0XHRpZigwIDwgYXQuYWNrICYmIHUgIT09IGRhdGEpe1xyXG5cdFx0XHRcdChjYiB8fCBub29wKS5jYWxsKGd1biwgZGF0YSwgYXQuZ2V0KTtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNiKXtcclxuXHRcdFx0XHQob3B0ID0gb3B0IHx8IHt9KS5vayA9IGNiO1xyXG5cdFx0XHRcdG9wdC5jYXQgPSBhdDtcclxuXHRcdFx0XHRndW4uZ2V0KHZhbCwge2FzOiBvcHR9KTtcclxuXHRcdFx0XHRvcHQuYXN5bmMgPSB0cnVlOyAvL29wdC5hc3luYyA9IGF0LnN0dW4/IDEgOiB0cnVlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdEd1bi5sb2cub25jZShcInZhbG9uY2VcIiwgXCJDaGFpbmFibGUgdmFsIGlzIGV4cGVyaW1lbnRhbCwgaXRzIGJlaGF2aW9yIGFuZCBBUEkgbWF5IGNoYW5nZSBtb3ZpbmcgZm9yd2FyZC4gUGxlYXNlIHBsYXkgd2l0aCBpdCBhbmQgcmVwb3J0IGJ1Z3MgYW5kIGlkZWFzIG9uIGhvdyB0byBpbXByb3ZlIGl0LlwiKTtcclxuXHRcdFx0XHR2YXIgY2hhaW4gPSBndW4uY2hhaW4oKTtcclxuXHRcdFx0XHRjaGFpbi5fLnZhbCA9IGd1bi52YWwoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdGNoYWluLl8ub24oJ2luJywgZ3VuLl8pO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJldHVybiBjaGFpbjtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHZhbChhdCwgZXYsIHRvKXtcclxuXHRcdFx0dmFyIG9wdCA9IHRoaXMuYXMsIGNhdCA9IG9wdC5jYXQsIGd1biA9IGF0Lmd1biwgY29hdCA9IGd1bi5fLCBkYXRhID0gY29hdC5wdXQgfHwgYXQucHV0LCB0bXA7XHJcblx0XHRcdGlmKHUgPT09IGRhdGEpe1xyXG5cdFx0XHRcdC8vcmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGRhdGEgJiYgZGF0YVtyZWwuX10gJiYgKHRtcCA9IHJlbC5pcyhkYXRhKSkpe1xyXG5cdFx0XHRcdHRtcCA9IChjYXQucm9vdC5nZXQodG1wKS5fKTtcclxuXHRcdFx0XHRpZih1ID09PSB0bXAucHV0KXtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZGF0YSA9IHRtcC5wdXQ7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoZXYud2FpdCl7IGNsZWFyVGltZW91dChldi53YWl0KSB9XHJcblx0XHRcdC8vaWYoIXRvICYmICghKDAgPCBjb2F0LmFjaykgfHwgKCh0cnVlID09PSBvcHQuYXN5bmMpICYmIDAgIT09IG9wdC53YWl0KSkpe1xyXG5cdFx0XHRpZighb3B0LmFzeW5jKXtcclxuXHRcdFx0XHRldi53YWl0ID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0dmFsLmNhbGwoe2FzOm9wdH0sIGF0LCBldiwgZXYud2FpdCB8fCAxKVxyXG5cdFx0XHRcdH0sIG9wdC53YWl0IHx8IDk5KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY2F0LmZpZWxkIHx8IGNhdC5zb3VsKXtcclxuXHRcdFx0XHRpZihldi5vZmYoKSl7IHJldHVybiB9IC8vIGlmIGl0IGlzIGFscmVhZHkgb2ZmLCBkb24ndCBjYWxsIGFnYWluIVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmKChvcHQuc2VlbiA9IG9wdC5zZWVuIHx8IHt9KVtjb2F0LmlkXSl7IHJldHVybiB9XHJcblx0XHRcdFx0b3B0LnNlZW5bY29hdC5pZF0gPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdG9wdC5vay5jYWxsKGF0Lmd1biB8fCBvcHQuZ3VuLCBkYXRhLCBhdC5nZXQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdEd1bi5jaGFpbi5vZmYgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgZ3VuID0gdGhpcywgYXQgPSBndW4uXywgdG1wO1xyXG5cdFx0XHR2YXIgYmFjayA9IGF0LmJhY2sgfHwge30sIGNhdCA9IGJhY2suXztcclxuXHRcdFx0aWYoIWNhdCl7IHJldHVybiB9XHJcblx0XHRcdGlmKHRtcCA9IGNhdC5uZXh0KXtcclxuXHRcdFx0XHRpZih0bXBbYXQuZ2V0XSl7XHJcblx0XHRcdFx0XHRvYmpfZGVsKHRtcCwgYXQuZ2V0KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0b2JqX21hcCh0bXAsIGZ1bmN0aW9uKHBhdGgsIGtleSl7XHJcblx0XHRcdFx0XHRcdGlmKGd1biAhPT0gcGF0aCl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRcdG9ial9kZWwodG1wLCBrZXkpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCh0bXAgPSBndW4uYmFjaygtMSkpID09PSBiYWNrKXtcclxuXHRcdFx0XHRvYmpfZGVsKHRtcC5ncmFwaCwgYXQuZ2V0KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihhdC5vbnMgJiYgKHRtcCA9IGF0Lm9uc1snQCQnXSkpe1xyXG5cdFx0XHRcdG9ial9tYXAodG1wLnMsIGZ1bmN0aW9uKGV2KXtcclxuXHRcdFx0XHRcdGV2Lm9mZigpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBndW47XHJcblx0XHR9XHJcblx0XHR2YXIgb2JqID0gR3VuLm9iaiwgb2JqX2hhcyA9IG9iai5oYXMsIG9ial9kZWwgPSBvYmouZGVsLCBvYmpfdG8gPSBvYmoudG87XHJcblx0XHR2YXIgcmVsID0gR3VuLnZhbC5yZWw7XHJcblx0XHR2YXIgZW1wdHkgPSB7fSwgbm9vcCA9IGZ1bmN0aW9uKCl7fSwgdTtcclxuXHR9KShyZXF1aXJlLCAnLi9vbicpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vY29yZScpLCB1O1xyXG5cdFx0R3VuLmNoYWluLm5vdCA9IGZ1bmN0aW9uKGNiLCBvcHQsIHQpe1xyXG5cdFx0XHRHdW4ubG9nLm9uY2UoXCJub3R0b2JlXCIsIFwiV2FybmluZzogYC5ub3RgIHRvIGJlIHJlbW92ZWQgZnJvbSBjb3JlIChidXQgYXZhaWxhYmxlIGFzIGFuIGV4dGVuc2lvbiksIHVzZSBgLnZhbGAgaW5zdGVhZCwgd2hpY2ggbm93IHN1cHBvcnRzICh2MC43LngrKSAnbm90IGZvdW5kIGRhdGEnIGFzIGB1bmRlZmluZWRgIGRhdGEgaW4gY2FsbGJhY2tzLiBJZiB5b3UgYXJlIG9wcG9zZWQgdG8gdGhpcywgcGxlYXNlIHZvaWNlIHlvdXIgb3BpbmlvbiBpbiBodHRwczovL2dpdHRlci5pbS9hbWFyay9ndW4gYW5kIGFzayBvdGhlcnMuXCIpO1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5nZXQob3VnaHQsIHtub3Q6IGNifSk7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBvdWdodChhdCwgZXYpeyBldi5vZmYoKTtcclxuXHRcdFx0aWYoYXQuZXJyIHx8ICh1ICE9PSBhdC5wdXQpKXsgcmV0dXJuIH1cclxuXHRcdFx0aWYoIXRoaXMubm90KXsgcmV0dXJuIH1cclxuXHRcdFx0dGhpcy5ub3QuY2FsbChhdC5ndW4sIGF0LmdldCwgZnVuY3Rpb24oKXsgY29uc29sZS5sb2coXCJQbGVhc2UgcmVwb3J0IHRoaXMgYnVnIG9uIGh0dHBzOi8vZ2l0dGVyLmltL2FtYXJrL2d1biBhbmQgaW4gdGhlIGlzc3Vlcy5cIik7IG5lZWQudG8uaW1wbGVtZW50OyB9KTtcclxuXHRcdH1cclxuXHR9KShyZXF1aXJlLCAnLi9ub3QnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL2NvcmUnKTtcclxuXHRcdEd1bi5jaGFpbi5tYXAgPSBmdW5jdGlvbihjYiwgb3B0LCB0KXtcclxuXHRcdFx0dmFyIGd1biA9IHRoaXMsIGNhdCA9IGd1bi5fLCBjaGFpbjtcclxuXHRcdFx0aWYoIWNiKXtcclxuXHRcdFx0XHRpZihjaGFpbiA9IGNhdC5maWVsZHMpeyByZXR1cm4gY2hhaW4gfVxyXG5cdFx0XHRcdGNoYWluID0gY2F0LmZpZWxkcyA9IGd1bi5jaGFpbigpO1xyXG5cdFx0XHRcdGNoYWluLl8udmFsID0gZ3VuLmJhY2soJ3ZhbCcpO1xyXG5cdFx0XHRcdGd1bi5vbignaW4nLCBtYXAsIGNoYWluLl8pO1xyXG5cdFx0XHRcdHJldHVybiBjaGFpbjtcclxuXHRcdFx0fVxyXG5cdFx0XHRHdW4ubG9nLm9uY2UoXCJtYXBmblwiLCBcIk1hcCBmdW5jdGlvbnMgYXJlIGV4cGVyaW1lbnRhbCwgdGhlaXIgYmVoYXZpb3IgYW5kIEFQSSBtYXkgY2hhbmdlIG1vdmluZyBmb3J3YXJkLiBQbGVhc2UgcGxheSB3aXRoIGl0IGFuZCByZXBvcnQgYnVncyBhbmQgaWRlYXMgb24gaG93IHRvIGltcHJvdmUgaXQuXCIpO1xyXG5cdFx0XHRjaGFpbiA9IGd1bi5jaGFpbigpO1xyXG5cdFx0XHRndW4ubWFwKCkub24oZnVuY3Rpb24oZGF0YSwga2V5LCBhdCwgZXYpe1xyXG5cdFx0XHRcdHZhciBuZXh0ID0gKGNifHxub29wKS5jYWxsKHRoaXMsIGRhdGEsIGtleSwgYXQsIGV2KTtcclxuXHRcdFx0XHRpZih1ID09PSBuZXh0KXsgcmV0dXJuIH1cclxuXHRcdFx0XHRpZihHdW4uaXMobmV4dCkpe1xyXG5cdFx0XHRcdFx0Y2hhaW4uXy5vbignaW4nLCBuZXh0Ll8pO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjaGFpbi5fLm9uKCdpbicsIHtnZXQ6IGtleSwgcHV0OiBuZXh0LCBndW46IGNoYWlufSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gY2hhaW47XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBtYXAoYXQpe1xyXG5cdFx0XHRpZighYXQucHV0IHx8IEd1bi52YWwuaXMoYXQucHV0KSl7IHJldHVybiB9XHJcblx0XHRcdGlmKHRoaXMuYXMudmFsKXsgdGhpcy5vZmYoKSB9IC8vIFRPRE86IFVnbHkgaGFjayFcclxuXHRcdFx0b2JqX21hcChhdC5wdXQsIGVhY2gsIHtjYXQ6IHRoaXMuYXMsIGd1bjogYXQuZ3VufSk7XHJcblx0XHRcdHRoaXMudG8ubmV4dChhdCk7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBlYWNoKHYsZil7XHJcblx0XHRcdGlmKG5fID09PSBmKXsgcmV0dXJuIH1cclxuXHRcdFx0dmFyIGNhdCA9IHRoaXMuY2F0LCBndW4gPSB0aGlzLmd1bi5nZXQoZiksIGF0ID0gKGd1bi5fKTtcclxuXHRcdFx0KGF0LmVjaG8gfHwgKGF0LmVjaG8gPSB7fSkpW2NhdC5pZF0gPSBjYXQ7XHJcblx0XHR9XHJcblx0XHR2YXIgb2JqX21hcCA9IEd1bi5vYmoubWFwLCBub29wID0gZnVuY3Rpb24oKXt9LCBldmVudCA9IHtzdHVuOiBub29wLCBvZmY6IG5vb3B9LCBuXyA9IEd1bi5ub2RlLl8sIHU7XHJcblx0fSkocmVxdWlyZSwgJy4vbWFwJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9jb3JlJyk7XHJcblx0XHRHdW4uY2hhaW4uc2V0ID0gZnVuY3Rpb24oaXRlbSwgY2IsIG9wdCl7XHJcblx0XHRcdHZhciBndW4gPSB0aGlzLCBzb3VsO1xyXG5cdFx0XHRjYiA9IGNiIHx8IGZ1bmN0aW9uKCl7fTtcclxuXHRcdFx0aWYoc291bCA9IEd1bi5ub2RlLnNvdWwoaXRlbSkpeyByZXR1cm4gZ3VuLnNldChndW4uYmFjaygtMSkuZ2V0KHNvdWwpLCBjYiwgb3B0KSB9XHJcblx0XHRcdGlmKCFHdW4uaXMoaXRlbSkpe1xyXG5cdFx0XHRcdGlmKEd1bi5vYmouaXMoaXRlbSkpeyByZXR1cm4gZ3VuLnNldChndW4uXy5yb290LnB1dChpdGVtKSwgY2IsIG9wdCkgfVxyXG5cdFx0XHRcdHJldHVybiBndW4uZ2V0KEd1bi50ZXh0LnJhbmRvbSgpKS5wdXQoaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aXRlbS5nZXQoJ18nKS5nZXQoZnVuY3Rpb24oYXQsIGV2KXtcclxuXHRcdFx0XHRpZighYXQuZ3VuIHx8ICFhdC5ndW4uXy5iYWNrKTtcclxuXHRcdFx0XHRldi5vZmYoKTtcclxuXHRcdFx0XHRhdCA9IChhdC5ndW4uXy5iYWNrLl8pO1xyXG5cdFx0XHRcdHZhciBwdXQgPSB7fSwgbm9kZSA9IGF0LnB1dCwgc291bCA9IEd1bi5ub2RlLnNvdWwobm9kZSk7XHJcblx0XHRcdFx0aWYoIXNvdWwpeyByZXR1cm4gY2IuY2FsbChndW4sIHtlcnI6IEd1bi5sb2coJ09ubHkgYSBub2RlIGNhbiBiZSBsaW5rZWQhIE5vdCBcIicgKyBub2RlICsgJ1wiIScpfSkgfVxyXG5cdFx0XHRcdGd1bi5wdXQoR3VuLm9iai5wdXQocHV0LCBzb3VsLCBHdW4udmFsLnJlbC5pZnkoc291bCkpLCBjYiwgb3B0KTtcclxuXHRcdFx0fSx7d2FpdDowfSk7XHJcblx0XHRcdHJldHVybiBpdGVtO1xyXG5cdFx0fVxyXG5cdH0pKHJlcXVpcmUsICcuL3NldCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0aWYodHlwZW9mIEd1biA9PT0gJ3VuZGVmaW5lZCcpeyByZXR1cm4gfSAvLyBUT0RPOiBsb2NhbFN0b3JhZ2UgaXMgQnJvd3NlciBvbmx5LiBCdXQgaXQgd291bGQgYmUgbmljZSBpZiBpdCBjb3VsZCBzb21laG93IHBsdWdpbiBpbnRvIE5vZGVKUyBjb21wYXRpYmxlIGxvY2FsU3RvcmFnZSBBUElzP1xyXG5cclxuXHRcdHZhciByb290LCBub29wID0gZnVuY3Rpb24oKXt9LCB1O1xyXG5cdFx0aWYodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpeyByb290ID0gd2luZG93IH1cclxuXHRcdHZhciBzdG9yZSA9IHJvb3QubG9jYWxTdG9yYWdlIHx8IHtzZXRJdGVtOiBub29wLCByZW1vdmVJdGVtOiBub29wLCBnZXRJdGVtOiBub29wfTtcclxuXHJcblx0XHR2YXIgY2hlY2sgPSB7fSwgZGlydHkgPSB7fSwgYXN5bmMgPSB7fSwgY291bnQgPSAwLCBtYXggPSAxMDAwMCwgd2FpdDtcclxuXHRcdFxyXG5cdFx0R3VuLm9uKCdwdXQnLCBmdW5jdGlvbihhdCl7IHZhciBlcnIsIGlkLCBvcHQsIHJvb3QgPSBhdC5ndW4uXy5yb290O1xyXG5cdFx0XHR0aGlzLnRvLm5leHQoYXQpO1xyXG5cdFx0XHQob3B0ID0ge30pLnByZWZpeCA9IChhdC5vcHQgfHwgb3B0KS5wcmVmaXggfHwgYXQuZ3VuLmJhY2soJ29wdC5wcmVmaXgnKSB8fCAnZ3VuLyc7XHJcblx0XHRcdHZhciBncmFwaCA9IHJvb3QuXy5ncmFwaDtcclxuXHRcdFx0R3VuLm9iai5tYXAoYXQucHV0LCBmdW5jdGlvbihub2RlLCBzb3VsKXtcclxuXHRcdFx0XHRhc3luY1tzb3VsXSA9IGFzeW5jW3NvdWxdIHx8IGdyYXBoW3NvdWxdIHx8IG5vZGU7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRjb3VudCArPSAxO1xyXG5cdFx0XHRjaGVja1thdFsnIyddXSA9IHJvb3Q7XHJcblx0XHRcdGZ1bmN0aW9uIHNhdmUoKXtcclxuXHRcdFx0XHRjbGVhclRpbWVvdXQod2FpdCk7XHJcblx0XHRcdFx0dmFyIGFjayA9IGNoZWNrO1xyXG5cdFx0XHRcdHZhciBhbGwgPSBhc3luYztcclxuXHRcdFx0XHRjb3VudCA9IDA7XHJcblx0XHRcdFx0d2FpdCA9IGZhbHNlO1xyXG5cdFx0XHRcdGNoZWNrID0ge307XHJcblx0XHRcdFx0YXN5bmMgPSB7fTtcclxuXHRcdFx0XHRHdW4ub2JqLm1hcChhbGwsIGZ1bmN0aW9uKG5vZGUsIHNvdWwpe1xyXG5cdFx0XHRcdFx0Ly8gU2luY2UgbG9jYWxTdG9yYWdlIG9ubHkgaGFzIDVNQiwgaXQgaXMgYmV0dGVyIHRoYXQgd2Uga2VlcCBvbmx5XHJcblx0XHRcdFx0XHQvLyB0aGUgZGF0YSB0aGF0IHRoZSB1c2VyIGlzIGN1cnJlbnRseSBpbnRlcmVzdGVkIGluLlxyXG5cdFx0XHRcdFx0bm9kZSA9IGdyYXBoW3NvdWxdIHx8IGFsbFtzb3VsXSB8fCBub2RlO1xyXG5cdFx0XHRcdFx0dHJ5e3N0b3JlLnNldEl0ZW0ob3B0LnByZWZpeCArIHNvdWwsIEpTT04uc3RyaW5naWZ5KG5vZGUpKTtcclxuXHRcdFx0XHRcdH1jYXRjaChlKXsgZXJyID0gZSB8fCBcImxvY2FsU3RvcmFnZSBmYWlsdXJlXCIgfVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdGlmKCFHdW4ub2JqLmVtcHR5KGF0Lmd1bi5iYWNrKCdvcHQucGVlcnMnKSkpeyByZXR1cm4gfSAvLyBvbmx5IGFjayBpZiB0aGVyZSBhcmUgbm8gcGVlcnMuXHJcblx0XHRcdFx0R3VuLm9iai5tYXAoYWNrLCBmdW5jdGlvbihyb290LCBpZCl7XHJcblx0XHRcdFx0XHRyb290Lm9uKCdpbicsIHtcclxuXHRcdFx0XHRcdFx0J0AnOiBpZCxcclxuXHRcdFx0XHRcdFx0ZXJyOiBlcnIsXHJcblx0XHRcdFx0XHRcdG9rOiAwIC8vIGxvY2FsU3RvcmFnZSBpc24ndCByZWxpYWJsZSwgc28gbWFrZSBpdHMgYG9rYCBjb2RlIGJlIGEgbG93IG51bWJlci5cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNvdW50ID49IG1heCl7IC8vIGdvYWwgaXMgdG8gZG8gMTBLIGluc2VydHMvc2Vjb25kLlxyXG5cdFx0XHRcdHJldHVybiBzYXZlKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYod2FpdCl7IHJldHVybiB9XHJcblx0XHRcdGNsZWFyVGltZW91dCh3YWl0KTtcclxuXHRcdFx0d2FpdCA9IHNldFRpbWVvdXQoc2F2ZSwgMTAwMCk7XHJcblx0XHR9KTtcclxuXHRcdEd1bi5vbignZ2V0JywgZnVuY3Rpb24oYXQpe1xyXG5cdFx0XHR0aGlzLnRvLm5leHQoYXQpO1xyXG5cdFx0XHR2YXIgZ3VuID0gYXQuZ3VuLCBsZXggPSBhdC5nZXQsIHNvdWwsIGRhdGEsIG9wdCwgdTtcclxuXHRcdFx0Ly9zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdChvcHQgPSBhdC5vcHQgfHwge30pLnByZWZpeCA9IG9wdC5wcmVmaXggfHwgYXQuZ3VuLmJhY2soJ29wdC5wcmVmaXgnKSB8fCAnZ3VuLyc7XHJcblx0XHRcdGlmKCFsZXggfHwgIShzb3VsID0gbGV4W0d1bi5fLnNvdWxdKSl7IHJldHVybiB9XHJcblx0XHRcdC8vaWYoMCA+PSBhdC5jYXApeyByZXR1cm4gfVxyXG5cdFx0XHR2YXIgZmllbGQgPSBsZXhbJy4nXTtcclxuXHRcdFx0ZGF0YSA9IEd1bi5vYmouaWZ5KHN0b3JlLmdldEl0ZW0ob3B0LnByZWZpeCArIHNvdWwpIHx8IG51bGwpIHx8IGFzeW5jW3NvdWxdIHx8IHU7XHJcblx0XHRcdGlmKGRhdGEgJiYgZmllbGQpe1xyXG5cdFx0XHRcdGRhdGEgPSBHdW4uc3RhdGUudG8oZGF0YSwgZmllbGQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCFkYXRhICYmICFHdW4ub2JqLmVtcHR5KGd1bi5iYWNrKCdvcHQucGVlcnMnKSkpeyAvLyBpZiBkYXRhIG5vdCBmb3VuZCwgZG9uJ3QgYWNrIGlmIHRoZXJlIGFyZSBwZWVycy5cclxuXHRcdFx0XHRyZXR1cm47IC8vIEhtbSwgd2hhdCBpZiB3ZSBoYXZlIHBlZXJzIGJ1dCB3ZSBhcmUgZGlzY29ubmVjdGVkP1xyXG5cdFx0XHR9XHJcblx0XHRcdGd1bi5vbignaW4nLCB7J0AnOiBhdFsnIyddLCBwdXQ6IEd1bi5ncmFwaC5ub2RlKGRhdGEpLCBob3c6ICdsUyd9KTtcclxuXHRcdFx0Ly99LDExKTtcclxuXHRcdH0pO1xyXG5cdH0pKHJlcXVpcmUsICcuL2FkYXB0ZXJzL2xvY2FsU3RvcmFnZScpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vY29yZScpO1xyXG5cclxuXHRcdGlmICh0eXBlb2YgSlNPTiA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFxyXG5cdFx0XHRcdCdHdW4gZGVwZW5kcyBvbiBKU09OLiBQbGVhc2UgbG9hZCBpdCBmaXJzdDpcXG4nICtcclxuXHRcdFx0XHQnYWpheC5jZG5qcy5jb20vYWpheC9saWJzL2pzb24yLzIwMTEwMjIzL2pzb24yLmpzJ1xyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBXZWJTb2NrZXQ7XHJcblx0XHRpZih0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyl7XHJcblx0XHRcdFdlYlNvY2tldCA9IHdpbmRvdy5XZWJTb2NrZXQgfHwgd2luZG93LndlYmtpdFdlYlNvY2tldCB8fCB3aW5kb3cubW96V2ViU29ja2V0O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0dmFyIG1lc3NhZ2UsIGNvdW50ID0gMCwgbm9vcCA9IGZ1bmN0aW9uKCl7fSwgd2FpdDtcclxuXHJcblx0XHRHdW4ub24oJ291dCcsIGZ1bmN0aW9uKGF0KXtcclxuXHRcdFx0dGhpcy50by5uZXh0KGF0KTtcclxuXHRcdFx0dmFyIGNhdCA9IGF0Lmd1bi5fLnJvb3QuXywgd3NwID0gY2F0LndzcCB8fCAoY2F0LndzcCA9IHt9KTtcclxuXHRcdFx0aWYoYXQud3NwICYmIDEgPT09IHdzcC5jb3VudCl7IHJldHVybiB9IC8vIGlmIHRoZSBtZXNzYWdlIGNhbWUgRlJPTSB0aGUgb25seSBwZWVyIHdlIGFyZSBjb25uZWN0ZWQgdG8sIGRvbid0IGVjaG8gaXQgYmFjay5cclxuXHRcdFx0bWVzc2FnZSA9IEpTT04uc3RyaW5naWZ5KGF0KTtcclxuXHRcdFx0Ly9pZigrK2NvdW50KXsgY29uc29sZS5sb2coXCJtc2cgT1VUOlwiLCBjb3VudCwgR3VuLm9iai5pZnkobWVzc2FnZSkpIH1cclxuXHRcdFx0aWYoY2F0LnVkcmFpbil7XHJcblx0XHRcdFx0Y2F0LnVkcmFpbi5wdXNoKG1lc3NhZ2UpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYXQudWRyYWluID0gW107XHJcblx0XHRcdGNsZWFyVGltZW91dCh3YWl0KTtcclxuXHRcdFx0d2FpdCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRpZighY2F0LnVkcmFpbil7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIHRtcCA9IGNhdC51ZHJhaW47XHJcblx0XHRcdFx0Y2F0LnVkcmFpbiA9IG51bGw7XHJcblx0XHRcdFx0aWYoIHRtcC5sZW5ndGggKSB7XHJcblx0XHRcdFx0XHRtZXNzYWdlID0gSlNPTi5zdHJpbmdpZnkodG1wKTtcclxuXHRcdFx0XHRcdEd1bi5vYmoubWFwKGNhdC5vcHQucGVlcnMsIHNlbmQsIGNhdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LDEpO1xyXG5cdFx0XHR3c3AuY291bnQgPSAwO1xyXG5cdFx0XHRHdW4ub2JqLm1hcChjYXQub3B0LnBlZXJzLCBzZW5kLCBjYXQpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gc2VuZChwZWVyKXtcclxuXHRcdFx0dmFyIG1zZyA9IG1lc3NhZ2UsIGNhdCA9IHRoaXM7XHJcblx0XHRcdHZhciB3aXJlID0gcGVlci53aXJlIHx8IG9wZW4ocGVlciwgY2F0KTtcclxuXHRcdFx0aWYoY2F0LndzcCl7IGNhdC53c3AuY291bnQrKyB9XHJcblx0XHRcdGlmKCF3aXJlKXsgcmV0dXJuIH1cclxuXHRcdFx0aWYod2lyZS5yZWFkeVN0YXRlID09PSB3aXJlLk9QRU4pe1xyXG5cdFx0XHRcdHdpcmUuc2VuZChtc2cpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHQocGVlci5xdWV1ZSA9IHBlZXIucXVldWUgfHwgW10pLnB1c2gobXNnKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiByZWNlaXZlKG1zZywgcGVlciwgY2F0KXtcclxuXHRcdFx0aWYoIWNhdCB8fCAhbXNnKXsgcmV0dXJuIH1cclxuXHRcdFx0dHJ5e21zZyA9IEpTT04ucGFyc2UobXNnLmRhdGEgfHwgbXNnKTtcclxuXHRcdFx0fWNhdGNoKGUpe31cclxuXHRcdFx0aWYobXNnIGluc3RhbmNlb2YgQXJyYXkpe1xyXG5cdFx0XHRcdHZhciBpID0gMCwgbTtcclxuXHRcdFx0XHR3aGlsZShtID0gbXNnW2krK10pe1xyXG5cdFx0XHRcdFx0cmVjZWl2ZShtLCBwZWVyLCBjYXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0Ly9pZigrK2NvdW50KXsgY29uc29sZS5sb2coXCJtc2cgaW46XCIsIGNvdW50LCBtc2cuYm9keSB8fCBtc2cpIH1cclxuXHRcdFx0aWYoY2F0LndzcCAmJiAxID09PSBjYXQud3NwLmNvdW50KXsgKG1zZy5ib2R5IHx8IG1zZykud3NwID0gbm9vcCB9IC8vIElmIHRoZXJlIGlzIG9ubHkgMSBjbGllbnQsIGp1c3QgdXNlIG5vb3Agc2luY2UgaXQgZG9lc24ndCBtYXR0ZXIuXHJcblx0XHRcdGNhdC5ndW4ub24oJ2luJywgbXNnLmJvZHkgfHwgbXNnKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBvcGVuKHBlZXIsIGFzKXtcclxuXHRcdFx0aWYoIXBlZXIgfHwgIXBlZXIudXJsKXsgcmV0dXJuIH1cclxuXHRcdFx0dmFyIHVybCA9IHBlZXIudXJsLnJlcGxhY2UoJ2h0dHAnLCAnd3MnKTtcclxuXHRcdFx0dmFyIHdpcmUgPSBwZWVyLndpcmUgPSBuZXcgV2ViU29ja2V0KHVybCwgYXMub3B0LndzYy5wcm90b2NvbHMsIGFzLm9wdC53c2MgKTtcclxuXHRcdFx0d2lyZS5vbmNsb3NlID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZWNvbm5lY3QocGVlciwgYXMpO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHR3aXJlLm9uZXJyb3IgPSBmdW5jdGlvbihlcnJvcil7XHJcblx0XHRcdFx0cmVjb25uZWN0KHBlZXIsIGFzKTtcclxuXHRcdFx0XHRpZighZXJyb3IpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGlmKGVycm9yLmNvZGUgPT09ICdFQ09OTlJFRlVTRUQnKXtcclxuXHRcdFx0XHRcdC8vcmVjb25uZWN0KHBlZXIsIGFzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdHdpcmUub25vcGVuID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgcXVldWUgPSBwZWVyLnF1ZXVlO1xyXG5cdFx0XHRcdHBlZXIucXVldWUgPSBbXTtcclxuXHRcdFx0XHRHdW4ub2JqLm1hcChxdWV1ZSwgZnVuY3Rpb24obXNnKXtcclxuXHRcdFx0XHRcdG1lc3NhZ2UgPSBtc2c7XHJcblx0XHRcdFx0XHRzZW5kLmNhbGwoYXMsIHBlZXIpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdHdpcmUub25tZXNzYWdlID0gZnVuY3Rpb24obXNnKXtcclxuXHRcdFx0XHRyZWNlaXZlKG1zZywgcGVlciwgYXMpO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHRyZXR1cm4gd2lyZTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiByZWNvbm5lY3QocGVlciwgYXMpe1xyXG5cdFx0XHRjbGVhclRpbWVvdXQocGVlci5kZWZlcik7XHJcblx0XHRcdHBlZXIuZGVmZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0b3BlbihwZWVyLCBhcyk7XHJcblx0XHRcdH0sIDIgKiAxMDAwKTtcclxuXHRcdH1cclxuXHR9KShyZXF1aXJlLCAnLi9wb2x5ZmlsbC9yZXF1ZXN0Jyk7XHJcblxyXG59KCkpO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2d1bi9ndW4uanMiLCIvKipcbiAqIENyZWF0ZWQgYnkgTGVvbiBSZXZpbGwgb24gMTUvMTIvMjAxNS5cbiAqIEJsb2c6IGJsb2cucmV2aWxsd2ViLmNvbVxuICogR2l0SHViOiBodHRwczovL2dpdGh1Yi5jb20vUmV2aWxsV2ViXG4gKiBUd2l0dGVyOiBAUmV2aWxsV2ViXG4gKi9cblxuLyoqXG4gKiBUaGUgbWFpbiByb3V0ZXIgY2xhc3MgYW5kIGVudHJ5IHBvaW50IHRvIHRoZSByb3V0ZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWJlbFJvdXRlciBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxuICAgIC8qKlxuICAgICAqIE1haW4gaW5pdGlhbGlzYXRpb24gcG9pbnQgb2YgcmViZWwtcm91dGVyXG4gICAgICogQHBhcmFtIHByZWZpeCAtIElmIGV4dGVuZGluZyByZWJlbC1yb3V0ZXIgeW91IGNhbiBzcGVjaWZ5IGEgcHJlZml4IHdoZW4gY2FsbGluZyBjcmVhdGVkQ2FsbGJhY2sgaW4gY2FzZSB5b3VyIGVsZW1lbnRzIG5lZWQgdG8gYmUgbmFtZWQgZGlmZmVyZW50bHlcbiAgICAgKi9cbiAgICBjcmVhdGVkQ2FsbGJhY2socHJlZml4KSB7XG5cbiAgICAgICAgY29uc3QgX3ByZWZpeCA9IHByZWZpeCB8fCBcInJlYmVsXCI7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnByZXZpb3VzUGF0aCA9IG51bGw7XG4gICAgICAgIHRoaXMuYmFzZVBhdGggPSBudWxsO1xuXG4gICAgICAgIC8vR2V0IG9wdGlvbnNcbiAgICAgICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgICAgICAgXCJhbmltYXRpb25cIjogKHRoaXMuZ2V0QXR0cmlidXRlKFwiYW5pbWF0aW9uXCIpID09IFwidHJ1ZVwiKSxcbiAgICAgICAgICAgIFwic2hhZG93Um9vdFwiOiAodGhpcy5nZXRBdHRyaWJ1dGUoXCJzaGFkb3dcIikgPT0gXCJ0cnVlXCIpLFxuICAgICAgICAgICAgXCJpbmhlcml0XCI6ICh0aGlzLmdldEF0dHJpYnV0ZShcImluaGVyaXRcIikgIT0gXCJmYWxzZVwiKVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vR2V0IHJvdXRlc1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmluaGVyaXQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIC8vSWYgdGhpcyBpcyBhIG5lc3RlZCByb3V0ZXIgdGhlbiB3ZSBuZWVkIHRvIGdvIGFuZCBnZXQgdGhlIHBhcmVudCBwYXRoXG4gICAgICAgICAgICBsZXQgJGVsZW1lbnQgPSB0aGlzO1xuICAgICAgICAgICAgd2hpbGUgKCRlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICAkZWxlbWVudCA9ICRlbGVtZW50LnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgaWYgKCRlbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT0gX3ByZWZpeCArIFwiLXJvdXRlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnQgPSAkZWxlbWVudC5jdXJyZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFzZVBhdGggPSBjdXJyZW50LnJvdXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yb3V0ZXMgPSB7fTtcbiAgICAgICAgY29uc3QgJGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0ICRjaGlsZCA9ICRjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGxldCBwYXRoID0gJGNoaWxkLmdldEF0dHJpYnV0ZShcInBhdGhcIik7XG4gICAgICAgICAgICBzd2l0Y2ggKCRjaGlsZC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBfcHJlZml4ICsgXCItZGVmYXVsdFwiOlxuICAgICAgICAgICAgICAgICAgICBwYXRoID0gXCIqXCI7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgX3ByZWZpeCArIFwiLXJvdXRlXCI6XG4gICAgICAgICAgICAgICAgICAgIHBhdGggPSAodGhpcy5iYXNlUGF0aCAhPT0gbnVsbCkgPyB0aGlzLmJhc2VQYXRoICsgcGF0aCA6IHBhdGg7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhdGggIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBsZXQgJHRlbXBsYXRlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAoJGNoaWxkLmlubmVySFRNTCkge1xuICAgICAgICAgICAgICAgICAgICAkdGVtcGxhdGUgPSBcIjxcIiArIF9wcmVmaXggKyBcIi1yb3V0ZT5cIiArICRjaGlsZC5pbm5lckhUTUwgKyBcIjwvXCIgKyBfcHJlZml4ICsgXCItcm91dGU+XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucm91dGVzW3BhdGhdID0ge1xuICAgICAgICAgICAgICAgICAgICBcImNvbXBvbmVudFwiOiAkY2hpbGQuZ2V0QXR0cmlidXRlKFwiY29tcG9uZW50XCIpLFxuICAgICAgICAgICAgICAgICAgICBcInRlbXBsYXRlXCI6ICR0ZW1wbGF0ZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL0FmdGVyIHdlIGhhdmUgY29sbGVjdGVkIGFsbCBjb25maWd1cmF0aW9uIGNsZWFyIGlubmVySFRNTFxuICAgICAgICB0aGlzLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaGFkb3dSb290ID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVNoYWRvd1Jvb3QoKTtcbiAgICAgICAgICAgIHRoaXMucm9vdCA9IHRoaXMuc2hhZG93Um9vdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucm9vdCA9IHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hbmltYXRpb24gPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdEFuaW1hdGlvbigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgIFJlYmVsUm91dGVyLnBhdGhDaGFuZ2UoKGlzQmFjaykgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hbmltYXRpb24gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNCYWNrID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZChcInJibC1iYWNrXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZShcInJibC1iYWNrXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRnVuY3Rpb24gdXNlZCB0byBpbml0aWFsaXNlIHRoZSBhbmltYXRpb24gbWVjaGFuaWNzIGlmIGFuaW1hdGlvbiBpcyB0dXJuZWQgb25cbiAgICAgKi9cbiAgICBpbml0QW5pbWF0aW9uKCkge1xuICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnMpID0+IHtcbiAgICAgICAgICAgIGxldCBub2RlID0gbXV0YXRpb25zWzBdLmFkZGVkTm9kZXNbMF07XG4gICAgICAgICAgICBpZiAobm9kZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3RoZXJDaGlsZHJlbiA9IHRoaXMuZ2V0T3RoZXJDaGlsZHJlbihub2RlKTtcbiAgICAgICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5hZGQoXCJyZWJlbC1hbmltYXRlXCIpO1xuICAgICAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChcImVudGVyXCIpO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAob3RoZXJDaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdGhlckNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQuY2xhc3NMaXN0LmFkZChcImV4aXRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLmNsYXNzTGlzdC5hZGQoXCJjb21wbGV0ZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAxMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChcImNvbXBsZXRlXCIpO1xuICAgICAgICAgICAgICAgICAgICB9LCAxMCk7XG4gICAgICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICAgICAgICAgIGNvbnN0IGFuaW1hdGlvbkVuZCA9IChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LmNsYXNzTmFtZS5pbmRleE9mKFwiZXhpdFwiKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJvb3QucmVtb3ZlQ2hpbGQoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKFwidHJhbnNpdGlvbmVuZFwiLCBhbmltYXRpb25FbmQpO1xuICAgICAgICAgICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCBhbmltYXRpb25FbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLCB7Y2hpbGRMaXN0OiB0cnVlfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWV0aG9kIHVzZWQgdG8gZ2V0IHRoZSBjdXJyZW50IHJvdXRlIG9iamVjdFxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGN1cnJlbnQoKSB7XG4gICAgICAgIGNvbnN0IHBhdGggPSBSZWJlbFJvdXRlci5nZXRQYXRoRnJvbVVybCgpO1xuICAgICAgICBmb3IgKGNvbnN0IHJvdXRlIGluIHRoaXMucm91dGVzKSB7XG4gICAgICAgICAgICBpZiAocm91dGUgIT09IFwiKlwiKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJlZ2V4U3RyaW5nID0gXCJeXCIgKyByb3V0ZS5yZXBsYWNlKC97XFx3K31cXC8/L2csIFwiKFxcXFx3KylcXC8/XCIpO1xuICAgICAgICAgICAgICAgIHJlZ2V4U3RyaW5nICs9IChyZWdleFN0cmluZy5pbmRleE9mKFwiXFxcXC8/XCIpID4gLTEpID8gXCJcIiA6IFwiXFxcXC8/XCIgKyBcIihbPz0mLVxcL1xcXFx3K10rKT8kXCI7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKHJlZ2V4U3RyaW5nKTtcbiAgICAgICAgICAgICAgICBpZiAocmVnZXgudGVzdChwYXRoKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3JvdXRlUmVzdWx0KHRoaXMucm91dGVzW3JvdXRlXSwgcm91dGUsIHJlZ2V4LCBwYXRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICh0aGlzLnJvdXRlc1tcIipcIl0gIT09IHVuZGVmaW5lZCkgPyBfcm91dGVSZXN1bHQodGhpcy5yb3V0ZXNbXCIqXCJdLCBcIipcIiwgbnVsbCwgcGF0aCkgOiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1ldGhvZCBjYWxsZWQgdG8gcmVuZGVyIHRoZSBjdXJyZW50IHZpZXdcbiAgICAgKi9cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuY3VycmVudCgpO1xuICAgICAgICBpZiAocmVzdWx0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0LnBhdGggIT09IHRoaXMucHJldmlvdXNQYXRoIHx8IHRoaXMub3B0aW9ucy5hbmltYXRpb24gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmFuaW1hdGlvbiAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvb3QuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5jb21wb25lbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0ICRjb21wb25lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHJlc3VsdC5jb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gcmVzdWx0LnBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gcmVzdWx0LnBhcmFtc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSBcIk9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBKU09OLnBhcnNlKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDb3VsZG4ndCBwYXJzZSBwYXJhbSB2YWx1ZTpcIiwgZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgJGNvbXBvbmVudC5zZXRBdHRyaWJ1dGUoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb290LmFwcGVuZENoaWxkKCRjb21wb25lbnQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCAkdGVtcGxhdGUgPSByZXN1bHQudGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIC8vVE9ETzogRmluZCBhIGZhc3RlciBhbHRlcm5hdGl2ZVxuICAgICAgICAgICAgICAgICAgICBpZiAoJHRlbXBsYXRlLmluZGV4T2YoXCIke1wiKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGVtcGxhdGUgPSAkdGVtcGxhdGUucmVwbGFjZSgvXFwkeyhbXnt9XSopfS9nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByID0gcmVzdWx0LnBhcmFtc1tiXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiByID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgciA9PT0gJ251bWJlcicgPyByIDogYTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm9vdC5pbm5lckhUTUwgPSAkdGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucHJldmlvdXNQYXRoID0gcmVzdWx0LnBhdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIG5vZGUgLSBVc2VkIHdpdGggdGhlIGFuaW1hdGlvbiBtZWNoYW5pY3MgdG8gZ2V0IGFsbCBvdGhlciB2aWV3IGNoaWxkcmVuIGV4Y2VwdCBpdHNlbGZcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAgICovXG4gICAgZ2V0T3RoZXJDaGlsZHJlbihub2RlKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkcmVuID0gdGhpcy5yb290LmNoaWxkcmVuO1xuICAgICAgICBsZXQgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGlmIChjaGlsZCAhPSBub2RlKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBTdGF0aWMgaGVscGVyIG1ldGhvZCB0byBwYXJzZSB0aGUgcXVlcnkgc3RyaW5nIGZyb20gYSB1cmwgaW50byBhbiBvYmplY3QuXG4gICAgICogQHBhcmFtIHVybFxuICAgICAqIEByZXR1cm5zIHt7fX1cbiAgICAgKi9cbiAgICBzdGF0aWMgcGFyc2VRdWVyeVN0cmluZyh1cmwpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgICBpZiAodXJsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHZhciBxdWVyeVN0cmluZyA9ICh1cmwuaW5kZXhPZihcIj9cIikgPiAtMSkgPyB1cmwuc3Vic3RyKHVybC5pbmRleE9mKFwiP1wiKSArIDEsIHVybC5sZW5ndGgpIDogbnVsbDtcbiAgICAgICAgICAgIGlmIChxdWVyeVN0cmluZyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHF1ZXJ5U3RyaW5nLnNwbGl0KFwiJlwiKS5mb3JFYWNoKGZ1bmN0aW9uIChwYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcGFydCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICBwYXJ0ID0gcGFydC5yZXBsYWNlKFwiK1wiLCBcIiBcIik7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlcSA9IHBhcnQuaW5kZXhPZihcIj1cIik7XG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXkgPSBlcSA+IC0xID8gcGFydC5zdWJzdHIoMCwgZXEpIDogcGFydDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbCA9IGVxID4gLTEgPyBkZWNvZGVVUklDb21wb25lbnQocGFydC5zdWJzdHIoZXEgKyAxKSkgOiBcIlwiO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZnJvbSA9IGtleS5pbmRleE9mKFwiW1wiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZyb20gPT0gLTEpIHJlc3VsdFtkZWNvZGVVUklDb21wb25lbnQoa2V5KV0gPSB2YWw7XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRvID0ga2V5LmluZGV4T2YoXCJdXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZGVjb2RlVVJJQ29tcG9uZW50KGtleS5zdWJzdHJpbmcoZnJvbSArIDEsIHRvKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXkgPSBkZWNvZGVVUklDb21wb25lbnQoa2V5LnN1YnN0cmluZygwLCBmcm9tKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdFtrZXldKSByZXN1bHRba2V5XSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpbmRleCkgcmVzdWx0W2tleV0ucHVzaCh2YWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSByZXN1bHRba2V5XVtpbmRleF0gPSB2YWw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0YXRpYyBoZWxwZXIgbWV0aG9kIHRvIGNvbnZlcnQgYSBjbGFzcyBuYW1lIHRvIGEgdmFsaWQgZWxlbWVudCBuYW1lLlxuICAgICAqIEBwYXJhbSBDbGFzc1xuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgc3RhdGljIGNsYXNzVG9UYWcoQ2xhc3MpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENsYXNzLm5hbWUgd291bGQgYmUgYmV0dGVyIGJ1dCB0aGlzIGlzbid0IHN1cHBvcnRlZCBpbiBJRSAxMS5cbiAgICAgICAgICovXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgbmFtZSA9IENsYXNzLnRvU3RyaW5nKCkubWF0Y2goL15mdW5jdGlvblxccyooW15cXHMoXSspLylbMV0ucmVwbGFjZSgvXFxXKy9nLCAnLScpLnJlcGxhY2UoLyhbYS16XFxkXSkoW0EtWjAtOV0pL2csICckMS0kMicpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IHBhcnNlIGNsYXNzIG5hbWU6XCIsIGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChSZWJlbFJvdXRlci52YWxpZEVsZW1lbnRUYWcobmFtZSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDbGFzcyBuYW1lIGNvdWxkbid0IGJlIHRyYW5zbGF0ZWQgdG8gdGFnLlwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmFtZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdGF0aWMgaGVscGVyIG1ldGhvZCB1c2VkIHRvIGRldGVybWluZSBpZiBhbiBlbGVtZW50IHdpdGggdGhlIHNwZWNpZmllZCBuYW1lIGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZC5cbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIHN0YXRpYyBpc1JlZ2lzdGVyZWRFbGVtZW50KG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmFtZSkuY29uc3RydWN0b3IgIT09IEhUTUxFbGVtZW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0YXRpYyBoZWxwZXIgbWV0aG9kIHRvIHRha2UgYSB3ZWIgY29tcG9uZW50IGNsYXNzLCBjcmVhdGUgYW4gZWxlbWVudCBuYW1lIGFuZCByZWdpc3RlciB0aGUgbmV3IGVsZW1lbnQgb24gdGhlIGRvY3VtZW50LlxuICAgICAqIEBwYXJhbSBDbGFzc1xuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgc3RhdGljIGNyZWF0ZUVsZW1lbnQoQ2xhc3MpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IFJlYmVsUm91dGVyLmNsYXNzVG9UYWcoQ2xhc3MpO1xuICAgICAgICBpZiAoUmViZWxSb3V0ZXIuaXNSZWdpc3RlcmVkRWxlbWVudChuYW1lKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIENsYXNzLnByb3RvdHlwZS5uYW1lID0gbmFtZTtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChuYW1lLCBDbGFzcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2ltcGxlIHN0YXRpYyBoZWxwZXIgbWV0aG9kIGNvbnRhaW5pbmcgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gdmFsaWRhdGUgYW4gZWxlbWVudCBuYW1lXG4gICAgICogQHBhcmFtIHRhZ1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIHN0YXRpYyB2YWxpZEVsZW1lbnRUYWcodGFnKSB7XG4gICAgICAgIHJldHVybiAvXlthLXowLTlcXC1dKyQvLnRlc3QodGFnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNZXRob2QgdXNlZCB0byByZWdpc3RlciBhIGNhbGxiYWNrIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBVUkwgcGF0aCBjaGFuZ2VzLlxuICAgICAqIEBwYXJhbSBjYWxsYmFja1xuICAgICAqL1xuICAgIHN0YXRpYyBwYXRoQ2hhbmdlKGNhbGxiYWNrKSB7XG4gICAgICAgIGlmIChSZWJlbFJvdXRlci5jaGFuZ2VDYWxsYmFja3MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgUmViZWxSb3V0ZXIuY2hhbmdlQ2FsbGJhY2tzID0gW107XG4gICAgICAgIH1cbiAgICAgICAgUmViZWxSb3V0ZXIuY2hhbmdlQ2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICBjb25zdCBjaGFuZ2VIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgZXZlbnQub2xkVVJMIGFuZCBldmVudC5uZXdVUkwgd291bGQgYmUgYmV0dGVyIGhlcmUgYnV0IHRoaXMgZG9lc24ndCB3b3JrIGluIElFIDooXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uaHJlZiAhPSBSZWJlbFJvdXRlci5vbGRVUkwpIHtcbiAgICAgICAgICAgICAgICBSZWJlbFJvdXRlci5jaGFuZ2VDYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbihjYWxsYmFjayl7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKFJlYmVsUm91dGVyLmlzQmFjayk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgUmViZWxSb3V0ZXIuaXNCYWNrID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBSZWJlbFJvdXRlci5vbGRVUkwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHdpbmRvdy5vbmhhc2hjaGFuZ2UgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmJsYmFja1wiLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIFJlYmVsUm91dGVyLmlzQmFjayA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cub25oYXNoY2hhbmdlID0gY2hhbmdlSGFuZGxlcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdGF0aWMgaGVscGVyIG1ldGhvZCB1c2VkIHRvIGdldCB0aGUgcGFyYW1ldGVycyBmcm9tIHRoZSBwcm92aWRlZCByb3V0ZS5cbiAgICAgKiBAcGFyYW0gcmVnZXhcbiAgICAgKiBAcGFyYW0gcm91dGVcbiAgICAgKiBAcGFyYW0gcGF0aFxuICAgICAqIEByZXR1cm5zIHt7fX1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0UGFyYW1zRnJvbVVybChyZWdleCwgcm91dGUsIHBhdGgpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFJlYmVsUm91dGVyLnBhcnNlUXVlcnlTdHJpbmcocGF0aCk7XG4gICAgICAgIHZhciByZSA9IC97KFxcdyspfS9nO1xuICAgICAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgICAgICBsZXQgbWF0Y2g7XG4gICAgICAgIHdoaWxlIChtYXRjaCA9IHJlLmV4ZWMocm91dGUpKSB7XG4gICAgICAgICAgICByZXN1bHRzLnB1c2gobWF0Y2hbMV0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWdleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdHMyID0gcmVnZXguZXhlYyhwYXRoKTtcbiAgICAgICAgICAgIHJlc3VsdHMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaWR4KSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W2l0ZW1dID0gcmVzdWx0czJbaWR4ICsgMV07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0YXRpYyBoZWxwZXIgbWV0aG9kIHVzZWQgdG8gZ2V0IHRoZSBwYXRoIGZyb20gdGhlIGN1cnJlbnQgVVJMLlxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRQYXRoRnJvbVVybCgpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLm1hdGNoKC8jKC4qKSQvKTtcbiAgICAgICAgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFsxXTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwicmViZWwtcm91dGVyXCIsIFJlYmVsUm91dGVyKTtcblxuLyoqXG4gKiBDbGFzcyB3aGljaCByZXByZXNlbnRzIHRoZSByZWJlbC1yb3V0ZSBjdXN0b20gZWxlbWVudFxuICovXG5leHBvcnQgY2xhc3MgUmViZWxSb3V0ZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxufVxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwicmViZWwtcm91dGVcIiwgUmViZWxSb3V0ZSk7XG5cbi8qKlxuICogQ2xhc3Mgd2hpY2ggcmVwcmVzZW50cyB0aGUgcmViZWwtZGVmYXVsdCBjdXN0b20gZWxlbWVudFxuICovXG5jbGFzcyBSZWJlbERlZmF1bHQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cbn1cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcInJlYmVsLWRlZmF1bHRcIiwgUmViZWxEZWZhdWx0KTtcblxuXG4vKipcbiAqIFJlcHJlc2VudHMgdGhlIHByb3RvdHlwZSBmb3IgYW4gYW5jaG9yIGVsZW1lbnQgd2hpY2ggYWRkZWQgZnVuY3Rpb25hbGl0eSB0byBwZXJmb3JtIGEgYmFjayB0cmFuc2l0aW9uLlxuICovXG5jbGFzcyBSZWJlbEJhY2tBIGV4dGVuZHMgSFRNTEFuY2hvckVsZW1lbnQge1xuICAgIGF0dGFjaGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKTtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBpZiAocGF0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdyYmxiYWNrJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBwYXRoO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4vKipcbiAqIFJlZ2lzdGVyIHRoZSBiYWNrIGJ1dHRvbiBjdXN0b20gZWxlbWVudFxuICovXG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJyZWJlbC1iYWNrLWFcIiwge1xuICAgIGV4dGVuZHM6IFwiYVwiLFxuICAgIHByb3RvdHlwZTogUmViZWxCYWNrQS5wcm90b3R5cGVcbn0pO1xuXG4vKipcbiAqIENvbnN0cnVjdHMgYSByb3V0ZSBvYmplY3RcbiAqIEBwYXJhbSBvYmogLSB0aGUgY29tcG9uZW50IG5hbWUgb3IgdGhlIEhUTUwgdGVtcGxhdGVcbiAqIEBwYXJhbSByb3V0ZVxuICogQHBhcmFtIHJlZ2V4XG4gKiBAcGFyYW0gcGF0aFxuICogQHJldHVybnMge3t9fVxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gX3JvdXRlUmVzdWx0KG9iaiwgcm91dGUsIHJlZ2V4LCBwYXRoKSB7XG4gICAgbGV0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICByZXN1bHRba2V5XSA9IG9ialtrZXldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5yb3V0ZSA9IHJvdXRlO1xuICAgIHJlc3VsdC5wYXRoID0gcGF0aDtcbiAgICByZXN1bHQucGFyYW1zID0gUmViZWxSb3V0ZXIuZ2V0UGFyYW1zRnJvbVVybChyZWdleCwgcm91dGUsIHBhdGgpO1xuICAgIHJldHVybiByZXN1bHQ7XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9yZWJlbC1yb3V0ZXIvc3JjL3JlYmVsLXJvdXRlci5qcyIsIi8vIFVuaXF1ZSBJRCBjcmVhdGlvbiByZXF1aXJlcyBhIGhpZ2ggcXVhbGl0eSByYW5kb20gIyBnZW5lcmF0b3IuICBXZSBmZWF0dXJlXG4vLyBkZXRlY3QgdG8gZGV0ZXJtaW5lIHRoZSBiZXN0IFJORyBzb3VyY2UsIG5vcm1hbGl6aW5nIHRvIGEgZnVuY3Rpb24gdGhhdFxuLy8gcmV0dXJucyAxMjgtYml0cyBvZiByYW5kb21uZXNzLCBzaW5jZSB0aGF0J3Mgd2hhdCdzIHVzdWFsbHkgcmVxdWlyZWRcbnZhciBybmcgPSByZXF1aXJlKCcuL2xpYi9ybmcnKTtcbnZhciBieXRlc1RvVXVpZCA9IHJlcXVpcmUoJy4vbGliL2J5dGVzVG9VdWlkJyk7XG5cbi8vICoqYHYxKClgIC0gR2VuZXJhdGUgdGltZS1iYXNlZCBVVUlEKipcbi8vXG4vLyBJbnNwaXJlZCBieSBodHRwczovL2dpdGh1Yi5jb20vTGlvc0svVVVJRC5qc1xuLy8gYW5kIGh0dHA6Ly9kb2NzLnB5dGhvbi5vcmcvbGlicmFyeS91dWlkLmh0bWxcblxuLy8gcmFuZG9tICMncyB3ZSBuZWVkIHRvIGluaXQgbm9kZSBhbmQgY2xvY2tzZXFcbnZhciBfc2VlZEJ5dGVzID0gcm5nKCk7XG5cbi8vIFBlciA0LjUsIGNyZWF0ZSBhbmQgNDgtYml0IG5vZGUgaWQsICg0NyByYW5kb20gYml0cyArIG11bHRpY2FzdCBiaXQgPSAxKVxudmFyIF9ub2RlSWQgPSBbXG4gIF9zZWVkQnl0ZXNbMF0gfCAweDAxLFxuICBfc2VlZEJ5dGVzWzFdLCBfc2VlZEJ5dGVzWzJdLCBfc2VlZEJ5dGVzWzNdLCBfc2VlZEJ5dGVzWzRdLCBfc2VlZEJ5dGVzWzVdXG5dO1xuXG4vLyBQZXIgNC4yLjIsIHJhbmRvbWl6ZSAoMTQgYml0KSBjbG9ja3NlcVxudmFyIF9jbG9ja3NlcSA9IChfc2VlZEJ5dGVzWzZdIDw8IDggfCBfc2VlZEJ5dGVzWzddKSAmIDB4M2ZmZjtcblxuLy8gUHJldmlvdXMgdXVpZCBjcmVhdGlvbiB0aW1lXG52YXIgX2xhc3RNU2VjcyA9IDAsIF9sYXN0TlNlY3MgPSAwO1xuXG4vLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2Jyb29mYS9ub2RlLXV1aWQgZm9yIEFQSSBkZXRhaWxzXG5mdW5jdGlvbiB2MShvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICB2YXIgaSA9IGJ1ZiAmJiBvZmZzZXQgfHwgMDtcbiAgdmFyIGIgPSBidWYgfHwgW107XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgdmFyIGNsb2Nrc2VxID0gb3B0aW9ucy5jbG9ja3NlcSAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5jbG9ja3NlcSA6IF9jbG9ja3NlcTtcblxuICAvLyBVVUlEIHRpbWVzdGFtcHMgYXJlIDEwMCBuYW5vLXNlY29uZCB1bml0cyBzaW5jZSB0aGUgR3JlZ29yaWFuIGVwb2NoLFxuICAvLyAoMTU4Mi0xMC0xNSAwMDowMCkuICBKU051bWJlcnMgYXJlbid0IHByZWNpc2UgZW5vdWdoIGZvciB0aGlzLCBzb1xuICAvLyB0aW1lIGlzIGhhbmRsZWQgaW50ZXJuYWxseSBhcyAnbXNlY3MnIChpbnRlZ2VyIG1pbGxpc2Vjb25kcykgYW5kICduc2VjcydcbiAgLy8gKDEwMC1uYW5vc2Vjb25kcyBvZmZzZXQgZnJvbSBtc2Vjcykgc2luY2UgdW5peCBlcG9jaCwgMTk3MC0wMS0wMSAwMDowMC5cbiAgdmFyIG1zZWNzID0gb3B0aW9ucy5tc2VjcyAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5tc2VjcyA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG4gIC8vIFBlciA0LjIuMS4yLCB1c2UgY291bnQgb2YgdXVpZCdzIGdlbmVyYXRlZCBkdXJpbmcgdGhlIGN1cnJlbnQgY2xvY2tcbiAgLy8gY3ljbGUgdG8gc2ltdWxhdGUgaGlnaGVyIHJlc29sdXRpb24gY2xvY2tcbiAgdmFyIG5zZWNzID0gb3B0aW9ucy5uc2VjcyAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5uc2VjcyA6IF9sYXN0TlNlY3MgKyAxO1xuXG4gIC8vIFRpbWUgc2luY2UgbGFzdCB1dWlkIGNyZWF0aW9uIChpbiBtc2VjcylcbiAgdmFyIGR0ID0gKG1zZWNzIC0gX2xhc3RNU2VjcykgKyAobnNlY3MgLSBfbGFzdE5TZWNzKS8xMDAwMDtcblxuICAvLyBQZXIgNC4yLjEuMiwgQnVtcCBjbG9ja3NlcSBvbiBjbG9jayByZWdyZXNzaW9uXG4gIGlmIChkdCA8IDAgJiYgb3B0aW9ucy5jbG9ja3NlcSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgY2xvY2tzZXEgPSBjbG9ja3NlcSArIDEgJiAweDNmZmY7XG4gIH1cblxuICAvLyBSZXNldCBuc2VjcyBpZiBjbG9jayByZWdyZXNzZXMgKG5ldyBjbG9ja3NlcSkgb3Igd2UndmUgbW92ZWQgb250byBhIG5ld1xuICAvLyB0aW1lIGludGVydmFsXG4gIGlmICgoZHQgPCAwIHx8IG1zZWNzID4gX2xhc3RNU2VjcykgJiYgb3B0aW9ucy5uc2VjcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbnNlY3MgPSAwO1xuICB9XG5cbiAgLy8gUGVyIDQuMi4xLjIgVGhyb3cgZXJyb3IgaWYgdG9vIG1hbnkgdXVpZHMgYXJlIHJlcXVlc3RlZFxuICBpZiAobnNlY3MgPj0gMTAwMDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3V1aWQudjEoKTogQ2FuXFwndCBjcmVhdGUgbW9yZSB0aGFuIDEwTSB1dWlkcy9zZWMnKTtcbiAgfVxuXG4gIF9sYXN0TVNlY3MgPSBtc2VjcztcbiAgX2xhc3ROU2VjcyA9IG5zZWNzO1xuICBfY2xvY2tzZXEgPSBjbG9ja3NlcTtcblxuICAvLyBQZXIgNC4xLjQgLSBDb252ZXJ0IGZyb20gdW5peCBlcG9jaCB0byBHcmVnb3JpYW4gZXBvY2hcbiAgbXNlY3MgKz0gMTIyMTkyOTI4MDAwMDA7XG5cbiAgLy8gYHRpbWVfbG93YFxuICB2YXIgdGwgPSAoKG1zZWNzICYgMHhmZmZmZmZmKSAqIDEwMDAwICsgbnNlY3MpICUgMHgxMDAwMDAwMDA7XG4gIGJbaSsrXSA9IHRsID4+PiAyNCAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRsID4+PiAxNiAmIDB4ZmY7XG4gIGJbaSsrXSA9IHRsID4+PiA4ICYgMHhmZjtcbiAgYltpKytdID0gdGwgJiAweGZmO1xuXG4gIC8vIGB0aW1lX21pZGBcbiAgdmFyIHRtaCA9IChtc2VjcyAvIDB4MTAwMDAwMDAwICogMTAwMDApICYgMHhmZmZmZmZmO1xuICBiW2krK10gPSB0bWggPj4+IDggJiAweGZmO1xuICBiW2krK10gPSB0bWggJiAweGZmO1xuXG4gIC8vIGB0aW1lX2hpZ2hfYW5kX3ZlcnNpb25gXG4gIGJbaSsrXSA9IHRtaCA+Pj4gMjQgJiAweGYgfCAweDEwOyAvLyBpbmNsdWRlIHZlcnNpb25cbiAgYltpKytdID0gdG1oID4+PiAxNiAmIDB4ZmY7XG5cbiAgLy8gYGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWRgIChQZXIgNC4yLjIgLSBpbmNsdWRlIHZhcmlhbnQpXG4gIGJbaSsrXSA9IGNsb2Nrc2VxID4+PiA4IHwgMHg4MDtcblxuICAvLyBgY2xvY2tfc2VxX2xvd2BcbiAgYltpKytdID0gY2xvY2tzZXEgJiAweGZmO1xuXG4gIC8vIGBub2RlYFxuICB2YXIgbm9kZSA9IG9wdGlvbnMubm9kZSB8fCBfbm9kZUlkO1xuICBmb3IgKHZhciBuID0gMDsgbiA8IDY7ICsrbikge1xuICAgIGJbaSArIG5dID0gbm9kZVtuXTtcbiAgfVxuXG4gIHJldHVybiBidWYgPyBidWYgOiBieXRlc1RvVXVpZChiKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB2MTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vdXVpZC92MS5qcyIsIid1c2Ugc3RyaWN0JztcbmltcG9ydCBub3RFbXB0eSBmcm9tICcuLi8uLi9zcmMvbGliL25vdEVtcHR5LmpzJztcbmltcG9ydCBub3RQR1BQcml2a2V5IGZyb20gJy4uLy4uL3NyYy9saWIvbm90UEdQUHJpdmtleS5qcyc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGJyb2FkY2FzdChjb250ZW50KSB7XG4gICAgcmV0dXJuICghY29udGVudCkgP1xuICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignbWlzc2luZyBjb250ZW50JykpIDpcbiAgICAoZ3VuKSA9PiB7XG4gICAgICAgIHJldHVybiAoIWd1bikgP1xuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ21pc3NpbmcgZ3VuZGInKSkgOlxuICAgICAgICAob3BlbnBncCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdtaXNzaW5nIG9wZW5wZ3AnKSkgOlxuICAgICAgICAgICAgbm90RW1wdHkoY29udGVudClcbiAgICAgICAgICAgIC50aGVuKChjb250ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vdFBHUFByaXZrZXkoY29udGVudCkob3BlbnBncClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoY29udGVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcHV0UmVzdWx0ID0gZ3VuLmdldCgnbWVzc2FnZScpLnB1dCh7bWVzc2FnZTogY29udGVudH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xpYi9icm9hZGNhc3QuanMiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7ZGVjcnlwdFBHUE1lc3NhZ2V9IGZyb20gJy4vZGVjcnlwdFBHUE1lc3NhZ2UuanMnO1xuaW1wb3J0IHtkZXRlcm1pbmVDb250ZW50VHlwZX0gZnJvbSAnLi9kZXRlcm1pbmVDb250ZW50VHlwZS5qcyc7XG5pbXBvcnQge3NhdmVQR1BQdWJrZXl9IGZyb20gJy4vc2F2ZVBHUFB1YmtleS5qcyc7XG5cbmNvbnN0IFBHUFBVQktFWSA9ICdQR1BQdWJrZXknO1xuY29uc3QgQ0xFQVJURVhUID0gJ2NsZWFydGV4dCc7XG5jb25zdCBQR1BQUklWS0VZID0gJ1BHUFByaXZrZXknO1xuY29uc3QgUEdQTUVTU0FHRSA9ICdQR1BNZXNzYWdlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZU1lc3NhZ2UoY29udGVudCkge1xuICAgIHJldHVybiAoIWNvbnRlbnQpID9cbiAgICBQcm9taXNlLnJlc29sdmUoJycpIDpcbiAgICAob3BlbnBncCkgPT4ge1xuICAgICAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBvcGVucGdwJyk6XG4gICAgICAgIChsb2NhbFN0b3JhZ2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAocGFzc3dvcmQpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGV0ZXJtaW5lQ29udGVudFR5cGUoY29udGVudCkob3BlbnBncClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGNvbnRlbnRUeXBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjb250ZW50VHlwZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudFR5cGUgPT09IFBHUFBVQktFWSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzYXZlIHRvIGxvY2FsU3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYXZlUEdQUHVia2V5KGNvbnRlbnQpKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHJlc29sdmUocmVzdWx0KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcikgPT4gcmVqZWN0KGVycm9yKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb250ZW50VHlwZSA9PT0gUEdQTUVTU0FHRSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBnZXQgUEdQS2V5cywgZGVjcnlwdCwgIGFuZCByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVjcnlwdFBHUE1lc3NhZ2Uob3BlbnBncCkobG9jYWxTdG9yYWdlKShwYXNzd29yZCkoY29udGVudClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcikgPT4gcmVqZWN0KGVycm9yKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gcmVqZWN0KGVycikpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xpYi9oYW5kbGVNZXNzYWdlLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2Jyb2FkY2FzdE11bHRpfSBmcm9tICcuL2Jyb2FkY2FzdE11bHRpLmpzJztcbmltcG9ydCB7ZW5jcnlwdENsZWFydGV4dE11bHRpfSBmcm9tICcuL2VuY3J5cHRDbGVhcnRleHRNdWx0aS5qcyc7XG5pbXBvcnQge2RldGVybWluZUNvbnRlbnRUeXBlfSBmcm9tICcuL2RldGVybWluZUNvbnRlbnRUeXBlLmpzJztcbmltcG9ydCB7c2F2ZVBHUFB1YmtleX0gZnJvbSAnLi9zYXZlUEdQUHVia2V5LmpzJztcbmltcG9ydCB7c2F2ZVBHUFByaXZrZXl9IGZyb20gJy4vc2F2ZVBHUFByaXZrZXkuanMnO1xuXG5jb25zdCBQR1BQVUJLRVkgPSAnUEdQUHVia2V5JztcbmNvbnN0IENMRUFSVEVYVCA9ICdjbGVhcnRleHQnO1xuY29uc3QgUEdQUFJJVktFWSA9ICdQR1BQcml2a2V5JztcbmNvbnN0IFBHUE1FU1NBR0UgPSAnUEdQTWVzc2FnZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVQb3N0KGNvbnRlbnQpIHtcbiAgICByZXR1cm4gKCFjb250ZW50KSA/XG4gICAgUHJvbWlzZS5yZXNvbHZlKCcnKSA6XG4gICAgKG9wZW5wZ3ApID0+IHtcbiAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgICAgICAobG9jYWxTdG9yYWdlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKHBhc3N3b3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChndW5kYikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGV0ZXJtaW5lQ29udGVudFR5cGUoY29udGVudCkob3BlbnBncClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGNvbnRlbnRUeXBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudFR5cGUgPT09IENMRUFSVEVYVCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmNyeXB0Q2xlYXJ0ZXh0TXVsdGkoY29udGVudCkob3BlbnBncCkobG9jYWxTdG9yYWdlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoZW5jcnlwdGVkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicm9hZGNhc3RNdWx0aShlbmNyeXB0ZWQpKGd1bmRiKShvcGVucGdwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHJlamVjdChlcnJvcikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudFR5cGUgPT09IFBHUFBSSVZLRVkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVBHUFByaXZrZXkoY29udGVudCkob3BlbnBncCkobG9jYWxTdG9yYWdlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4gcmVzb2x2ZShyZXN1bHQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudFR5cGUgPT09IFBHUFBVQktFWSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYXZlUEdQUHVia2V5KGNvbnRlbnQpKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRlbnRUeXBlID09PSBQR1BNRVNTQUdFKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyb2FkY2FzdChjb250ZW50KShndW4pKG9wZW5wZ3ApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiByZXNvbHZlKHJlc3VsdCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiByZWplY3QoZXJyKSlcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGliL2hhbmRsZVBvc3QuanMiLCIndXNlIHN0cmljdCc7XG4vKmVzbGludC1lbnYgbm9kZSwgbW9jaGEsIGVzNiAqL1xuLyogaHR0cHM6Ly9ib3N0Lm9ja3Mub3JnL21pa2Uvc2h1ZmZsZS8gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHNodWZmbGUoYXJyYXkpIHtcbiAgICByZXR1cm4gKCFhcnJheSkgP1xuICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignbWlzc2luZyBhcnJheScpKSA6XG4gICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIG0gPSBhcnJheS5sZW5ndGgsIHQsIGk7XG4gICAgICAgICAgICB3aGlsZSAobSkge1xuICAgICAgICAgICAgICBpID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbS0tKTtcbiAgICAgICAgICAgICAgdCA9IGFycmF5W21dO1xuICAgICAgICAgICAgICBhcnJheVttXSA9IGFycmF5W2ldO1xuICAgICAgICAgICAgICBhcnJheVtpXSA9IHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXNvbHZlKGFycmF5KTtcbiAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xpYi9zaHVmZmxlLmpzIiwibGV0IGNvbnRhY3RQYXJ0aWFsID0gcmVxdWlyZShcInJhdy1sb2FkZXIhLi4vLi4vdmlld3MvcGFydGlhbHMvY29udGFjdC5odG1sXCIpO1xuZXhwb3J0IGNsYXNzIENvbnRhY3RQYWdlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICAgIGF0dGFjaGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuaW5uZXJIVE1MID0gJzxwPicgKyBjb250YWN0UGFydGlhbCArICc8L3A+JztcbiAgICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJjb250YWN0LXBhZ2VcIiwgQ29udGFjdFBhZ2UpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhZ2VzL2NvbnRhY3QuanMiLCJ2YXIgZnJlc2hEZWNrUGFydGlhbCA9IHJlcXVpcmUoXCJyYXctbG9hZGVyIS4uLy4uL3ZpZXdzL3BhcnRpYWxzL2ZyZXNoZGVjay5odG1sXCIpO1xuXG5leHBvcnQgY2xhc3MgRGVja1BhZ2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSAnPHA+JyArIGZyZXNoRGVja1BhcnRpYWwgKyAnPC9wPic7XG4gICAgfVxufVxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwiZGVjay1wYWdlXCIsIERlY2tQYWdlKTtcbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgncGxheWluZy1jYXJkJywge1xuICAgIHByb3RvdHlwZTogT2JqZWN0LmNyZWF0ZShIVE1MRWxlbWVudC5wcm90b3R5cGUsIHsgY3JlYXRlZENhbGxiYWNrOiB7XG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgcm9vdCA9IHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpO1xuICAgICAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyB0aGlzLnRleHRDb250ZW50IHx8ICcj4paIJyk7XG4gICAgICAgICAgICAgICAgICB2YXIgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgdmFyIGNvbG9yT3ZlcnJpZGUgPSAodGhpcy5xdWVyeVNlbGVjdG9yKCdzcGFuJykpID8gdGhpcy5xdWVyeVNlbGVjdG9yKCdzcGFuJykuc3R5bGUuY29sb3I6IG51bGw7IGlmIChjb2xvck92ZXJyaWRlKSB7IGNsb25lLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpLnN0eWxlLmZpbGwgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKS5zdHlsZS5jb2xvcjsgfTsgcm9vdC5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9XG4gICAgfSlcbn0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhZ2VzL2RlY2suanMiLCJ2YXIgaW5kZXhQYXJ0aWFsID0gcmVxdWlyZShcInJhdy1sb2FkZXIhLi4vLi4vdmlld3MvcGFydGlhbHMvaW5kZXguaHRtbFwiKTtcbmV4cG9ydCBjbGFzcyBJbmRleFBhZ2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSBgXG4gICAgICAgIDxwPiR7aW5kZXhQYXJ0aWFsfTwvcD5cbiAgICAgICAgYDtcbiAgICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJpbmRleC1wYWdlXCIsIEluZGV4UGFnZSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFnZXMvaW5kZXguanMiLCJ2YXIgY2xpZW50UHVia2V5Rm9ybVBhcnRpYWwgPSByZXF1aXJlKFwicmF3LWxvYWRlciEuLi8uLi92aWV3cy9wYXJ0aWFscy9tZXNzYWdlX2Zvcm0uaHRtbFwiKTtcblxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VQYWdlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICAgIGF0dGFjaGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuaW5uZXJIVE1MID0gYFxuICAgICAgICAgICAgPHA+JHtjbGllbnRQdWJrZXlGb3JtUGFydGlhbH08L3A+XG4gICAgICAgIGBcbiAgICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJtZXNzYWdlLXBhZ2VcIiwgTWVzc2FnZVBhZ2UpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhZ2VzL21lc3NhZ2UuanMiLCJ2YXIgZmVsdFBhcnRpYWwgPSByZXF1aXJlKFwicmF3LWxvYWRlciEuLi8uLi92aWV3cy9wYXJ0aWFscy9mZWx0Lmh0bWxcIik7XG5cbmV4cG9ydCBjbGFzcyBQbGF5UGFnZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLmlubmVySFRNTCA9ICc8cD4nICsgZmVsdFBhcnRpYWwgKyAnPC9wPic7XG4gICAgfVxufVxuXG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJwbGF5LXBhZ2VcIiwgUGxheVBhZ2UpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhZ2VzL3BsYXkuanMiLCJ2YXIgcm9hZG1hcFBhcnRpYWwgPSByZXF1aXJlKFwicmF3LWxvYWRlciEuLi8uLi92aWV3cy9wYXJ0aWFscy9yb2FkbWFwLmh0bWxcIik7XG5leHBvcnQgY2xhc3MgUm9hZG1hcFBhZ2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSAnPHA+JyArIHJvYWRtYXBQYXJ0aWFsICsgJzwvcD4nO1xuICAgIH1cbn1cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcInJvYWRtYXAtcGFnZVwiLCBSb2FkbWFwUGFnZSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFnZXMvcm9hZG1hcC5qcyIsIi8qKlxuICogQ29udmVydCBhcnJheSBvZiAxNiBieXRlIHZhbHVlcyB0byBVVUlEIHN0cmluZyBmb3JtYXQgb2YgdGhlIGZvcm06XG4gKiBYWFhYWFhYWC1YWFhYLVhYWFgtWFhYWC1YWFhYLVhYWFhYWFhYWFhYWFxuICovXG52YXIgYnl0ZVRvSGV4ID0gW107XG5mb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gIGJ5dGVUb0hleFtpXSA9IChpICsgMHgxMDApLnRvU3RyaW5nKDE2KS5zdWJzdHIoMSk7XG59XG5cbmZ1bmN0aW9uIGJ5dGVzVG9VdWlkKGJ1Ziwgb2Zmc2V0KSB7XG4gIHZhciBpID0gb2Zmc2V0IHx8IDA7XG4gIHZhciBidGggPSBieXRlVG9IZXg7XG4gIHJldHVybiAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gK1xuICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICsgJy0nICtcbiAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArICctJyArXG4gICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gKyAnLScgK1xuICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dICsgJy0nICtcbiAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArXG4gICAgICAgICAgYnRoW2J1ZltpKytdXSArIGJ0aFtidWZbaSsrXV0gK1xuICAgICAgICAgIGJ0aFtidWZbaSsrXV0gKyBidGhbYnVmW2krK11dO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJ5dGVzVG9VdWlkO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi91dWlkL2xpYi9ieXRlc1RvVXVpZC5qcyIsIi8vIFVuaXF1ZSBJRCBjcmVhdGlvbiByZXF1aXJlcyBhIGhpZ2ggcXVhbGl0eSByYW5kb20gIyBnZW5lcmF0b3IuICBJbiB0aGVcbi8vIGJyb3dzZXIgdGhpcyBpcyBhIGxpdHRsZSBjb21wbGljYXRlZCBkdWUgdG8gdW5rbm93biBxdWFsaXR5IG9mIE1hdGgucmFuZG9tKClcbi8vIGFuZCBpbmNvbnNpc3RlbnQgc3VwcG9ydCBmb3IgdGhlIGBjcnlwdG9gIEFQSS4gIFdlIGRvIHRoZSBiZXN0IHdlIGNhbiB2aWFcbi8vIGZlYXR1cmUtZGV0ZWN0aW9uXG52YXIgcm5nO1xuXG52YXIgY3J5cHRvID0gZ2xvYmFsLmNyeXB0byB8fCBnbG9iYWwubXNDcnlwdG87IC8vIGZvciBJRSAxMVxuaWYgKGNyeXB0byAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB7XG4gIC8vIFdIQVRXRyBjcnlwdG8gUk5HIC0gaHR0cDovL3dpa2kud2hhdHdnLm9yZy93aWtpL0NyeXB0b1xuICB2YXIgcm5kczggPSBuZXcgVWludDhBcnJheSgxNik7XG4gIHJuZyA9IGZ1bmN0aW9uIHdoYXR3Z1JORygpIHtcbiAgICBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKHJuZHM4KTtcbiAgICByZXR1cm4gcm5kczg7XG4gIH07XG59XG5cbmlmICghcm5nKSB7XG4gIC8vIE1hdGgucmFuZG9tKCktYmFzZWQgKFJORylcbiAgLy9cbiAgLy8gSWYgYWxsIGVsc2UgZmFpbHMsIHVzZSBNYXRoLnJhbmRvbSgpLiAgSXQncyBmYXN0LCBidXQgaXMgb2YgdW5zcGVjaWZpZWRcbiAgLy8gcXVhbGl0eS5cbiAgdmFyICBybmRzID0gbmV3IEFycmF5KDE2KTtcbiAgcm5nID0gZnVuY3Rpb24oKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIHI7IGkgPCAxNjsgaSsrKSB7XG4gICAgICBpZiAoKGkgJiAweDAzKSA9PT0gMCkgciA9IE1hdGgucmFuZG9tKCkgKiAweDEwMDAwMDAwMDtcbiAgICAgIHJuZHNbaV0gPSByID4+PiAoKGkgJiAweDAzKSA8PCAzKSAmIDB4ZmY7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJuZHM7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcm5nO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi91dWlkL2xpYi9ybmctYnJvd3Nlci5qcyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obW9kdWxlKSB7XHJcblx0aWYoIW1vZHVsZS53ZWJwYWNrUG9seWZpbGwpIHtcclxuXHRcdG1vZHVsZS5kZXByZWNhdGUgPSBmdW5jdGlvbigpIHt9O1xyXG5cdFx0bW9kdWxlLnBhdGhzID0gW107XHJcblx0XHQvLyBtb2R1bGUucGFyZW50ID0gdW5kZWZpbmVkIGJ5IGRlZmF1bHRcclxuXHRcdGlmKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJsb2FkZWRcIiwge1xyXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBtb2R1bGUubDtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImlkXCIsIHtcclxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0bW9kdWxlLndlYnBhY2tQb2x5ZmlsbCA9IDE7XHJcblx0fVxyXG5cdHJldHVybiBtb2R1bGU7XHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAod2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanMiLCIndXNlIHN0cmljdCc7XG4vL2ltcG9ydCAnd2ViY29tcG9uZW50cy5qcy93ZWJjb21wb25lbnRzLmpzJztcbi8vdW5jb21tZW50IGxpbmUgYWJvdmUgdG8gZG91YmxlIGFwcCBzaXplIGFuZCBzdXBwb3J0IGlvcy5cblxuY29uc3QgdXVpZHYxID0gcmVxdWlyZSgndXVpZC92MScpO1xud2luZG93LnV1aWR2MSA9IHV1aWR2MTtcblxuaW1wb3J0IHtoYW5kbGVNZXNzYWdlfSBmcm9tICcuL2xpYi9oYW5kbGVNZXNzYWdlLmpzJztcbndpbmRvdy5oYW5kbGVNZXNzYWdlID0gaGFuZGxlTWVzc2FnZTtcbmltcG9ydCB7aGFuZGxlUG9zdH0gZnJvbSAnLi9saWIvaGFuZGxlUG9zdC5qcyc7XG53aW5kb3cuaGFuZGxlUG9zdCA9IGhhbmRsZVBvc3Q7XG5pbXBvcnQge2RldGVybWluZUNvbnRlbnRUeXBlfSBmcm9tICcuL2xpYi9kZXRlcm1pbmVDb250ZW50VHlwZS5qcydcbndpbmRvdy5kZXRlcm1pbmVDb250ZW50VHlwZSA9IGRldGVybWluZUNvbnRlbnRUeXBlO1xuaW1wb3J0IHtkZXRlcm1pbmVLZXlUeXBlfSBmcm9tICcuL2xpYi9kZXRlcm1pbmVLZXlUeXBlLmpzJ1xud2luZG93LmRldGVybWluZUtleVR5cGUgPSBkZXRlcm1pbmVLZXlUeXBlO1xuaW1wb3J0IHtlbmNyeXB0Q2xlYXJ0ZXh0TXVsdGl9IGZyb20gJy4vbGliL2VuY3J5cHRDbGVhcnRleHRNdWx0aS5qcydcbndpbmRvdy5lbmNyeXB0Q2xlYXJ0ZXh0TXVsdGkgPSBlbmNyeXB0Q2xlYXJ0ZXh0TXVsdGk7XG5pbXBvcnQge2VuY3J5cHRDbGVhclRleHR9IGZyb20gJy4vbGliL2VuY3J5cHRDbGVhclRleHQuanMnXG53aW5kb3cuZW5jcnlwdENsZWFyVGV4dCA9IGVuY3J5cHRDbGVhclRleHQ7XG5pbXBvcnQge2RlY3J5cHRQR1BNZXNzYWdlfSBmcm9tICcuL2xpYi9kZWNyeXB0UEdQTWVzc2FnZS5qcydcbndpbmRvdy5kZWNyeXB0UEdQTWVzc2FnZSA9IGRlY3J5cHRQR1BNZXNzYWdlO1xuaW1wb3J0IHtzYXZlUEdQUHVia2V5fSBmcm9tICcuL2xpYi9zYXZlUEdQUHVia2V5LmpzJ1xud2luZG93LnNhdmVQR1BQdWJrZXkgPSBzYXZlUEdQUHVia2V5O1xuaW1wb3J0IHtzYXZlUEdQUHJpdmtleX0gZnJvbSAnLi9saWIvc2F2ZVBHUFByaXZrZXkuanMnXG53aW5kb3cuc2F2ZVBHUFByaXZrZXkgPSBzYXZlUEdQUHJpdmtleTtcbmltcG9ydCB7Z2V0RnJvbVN0b3JhZ2V9IGZyb20gJy4vbGliL2dldEZyb21TdG9yYWdlLmpzJ1xud2luZG93LmdldEZyb21TdG9yYWdlID0gZ2V0RnJvbVN0b3JhZ2U7XG5pbXBvcnQge2RlY3J5cHRQR1BNZXNzYWdlV2l0aEtleX0gZnJvbSAnLi9saWIvZGVjcnlwdFBHUE1lc3NhZ2VXaXRoS2V5LmpzJ1xud2luZG93LmRlY3J5cHRQR1BNZXNzYWdlV2l0aEtleSA9IGRlY3J5cHRQR1BNZXNzYWdlV2l0aEtleTtcbmltcG9ydCB7c2h1ZmZsZX0gZnJvbSAnLi9saWIvc2h1ZmZsZS5qcyc7XG53aW5kb3cuc2h1ZmZsZSA9IHNodWZmbGU7XG5pbXBvcnQge2Jyb2FkY2FzdH0gZnJvbSAnLi9saWIvYnJvYWRjYXN0LmpzJztcbndpbmRvdy5icm9hZGNhc3QgPSBicm9hZGNhc3Q7XG5pbXBvcnQge2Jyb2FkY2FzdE11bHRpfSBmcm9tICcuL2xpYi9icm9hZGNhc3RNdWx0aS5qcyc7XG53aW5kb3cuYnJvYWRjYXN0TXVsdGkgPSBicm9hZGNhc3RNdWx0aTtcblxuLy8gcmViZWwgcm91dGVyXG5pbXBvcnQge1JlYmVsUm91dGVyfSBmcm9tICcuLi9ub2RlX21vZHVsZXMvcmViZWwtcm91dGVyL3NyYy9yZWJlbC1yb3V0ZXIuanMnO1xuXG4vLyBHdW5kYiBwdWJsaWMgZmFjaW5nIERBRyBkYXRhYmFzZSAgKGZvciBtZXNzYWdlcyB0byBhbmQgZnJvbSB0aGUgZW5lbXkpXG5pbXBvcnQge0d1bn0gZnJvbSAnZ3VuL2d1bi5qcyc7XG5cbi8vIHBhZ2VzIChtb3N0IG9mIHRoaXMgc2hvdWxkIGJlIGluIHZpZXdzL3BhcnRpYWxzIHRvIGFmZmVjdCBpc29ybW9ycGhpc20pXG5pbXBvcnQge0luZGV4UGFnZX0gICBmcm9tICcuL3BhZ2VzL2luZGV4LmpzJztcbmltcG9ydCB7Um9hZG1hcFBhZ2V9IGZyb20gJy4vcGFnZXMvcm9hZG1hcC5qcyc7XG5pbXBvcnQge0NvbnRhY3RQYWdlfSBmcm9tICcuL3BhZ2VzL2NvbnRhY3QuanMnO1xuaW1wb3J0IHtNZXNzYWdlUGFnZX0gZnJvbSAnLi9wYWdlcy9tZXNzYWdlLmpzJztcbmltcG9ydCB7UGxheVBhZ2V9ICAgIGZyb20gJy4vcGFnZXMvcGxheS5qcyc7XG5pbXBvcnQge0RlY2tQYWdlfSAgICBmcm9tICcuL3BhZ2VzL2RlY2suanMnO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgbm90RW1wdHkgZnJvbSAnLi4vLi4vc3JjL2xpYi9ub3RFbXB0eS5qcyc7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBub3RQR1BLZXkoY29udGVudCkge1xuICAgIHJldHVybiAoIWNvbnRlbnQpID9cbiAgICAoKSA9PiBub3RFbXB0eShjb250ZW50KTpcbiAgICAob3BlbnBncCkgPT4ge1xuICAgICAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignbWlzc2luZyBvcGVucGdwJykpOlxuICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBsZXQgcG9zc2libGVwZ3BrZXkgPSBvcGVucGdwLmtleS5yZWFkQXJtb3JlZChjb250ZW50KTtcbiAgICAgICAgICAgIGlmIChwb3NzaWJsZXBncGtleS5rZXlzWzBdKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignUEdQIGtleScpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShjb250ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xpYi9ub3RQR1BLZXkuanMiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBub3RFbXB0eSBmcm9tICcuLi8uLi9zcmMvbGliL25vdEVtcHR5LmpzJztcbmltcG9ydCBub3RDbGVhcnRleHQgZnJvbSAnLi4vLi4vc3JjL2xpYi9ub3RDbGVhcnRleHQuanMnO1xuaW1wb3J0IG5vdFBHUEtleSBmcm9tICcuLi8uLi9zcmMvbGliL25vdFBHUEtleS5qcyc7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBub3RQR1BNZXNzYWdlKGNvbnRlbnQpIHtcbiAgICByZXR1cm4gKCFjb250ZW50KSA/XG4gICAgKCkgPT4gbm90RW1wdHkoY29udGVudCk6XG4gICAgKG9wZW5wZ3ApID0+IHtcbiAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ21pc3Npbmcgb3BlbnBncCcpKTpcbiAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBub3RDbGVhcnRleHQoY29udGVudCkob3BlbnBncClcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBub3RQR1BLZXkoY29udGVudCkob3BlbnBncClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjb250ZW50KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNvbnRlbnQpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IgKCdQR1BNZXNzYWdlIGNvbnRlbnQnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGliL25vdFBHUE1lc3NhZ2UuanMiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG5vdFVuZGVmaW5lZChjb250ZW50KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmKHR5cGVvZihjb250ZW50KS50b1N0cmluZygpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoY29udGVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2goZXJyKSB7XG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCd1bmRlZmluZWQgY29udGVudCcpKTtcbiAgICAgICAgfVxuICAgIH0pXG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xpYi9ub3RVbmRlZmluZWQuanMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPHNwYW4gY2xhc3M9XFxcImNvbnRhY3RcXFwiPlxcbiAgICBDb2xlIEFsYm9uPGJyPlxcbiAgICA8YSBocmVmPVxcXCJ0ZWw6KzE0MTU2NzIxNjQ4XFxcIj4oNDE1KSA2NzItMTY0ODwvYT48YnI+XFxuICAgIDxhIGhyZWY9XFxcIm1haWx0bzpjb2xlLmFsYm9uQGdtYWlsLmNvbVxcXCI+Y29sZS5hbGJvbkBnbWFpbC5jb208L2E+PGJyPlxcbiAgICA8YSBocmVmPVxcXCJodHRwczovL2dpdGh1Yi5jb20vY29sZWFsYm9uXFxcIj5odHRwczovL2dpdGh1Yi5jb20vY29sZWFsYm9uPC9hPjxicj5cXG4gICAgPGEgaHJlZj1cXFwiaHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL2NvbGUtYWxib24tNTkzNDYzNFxcXCI+XFxuICAgICAgICA8c3BhbiBpZD1cXFwibGlua2VkaW5hZGRyZXNzXFxcIiBjbGFzcz1cXFwibGlua2VkaW5hZGRyZXNzXFxcIj5odHRwczovL3d3dy5saW5rZWRpbi5jb20vaW4vY29sZS1hbGJvbi01OTM0NjM0PC9zcGFuPlxcbiAgICA8L2E+PGJyPlxcbjwvc3Bhbj5cXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yYXctbG9hZGVyIS4vdmlld3MvcGFydGlhbHMvY29udGFjdC5odG1sXG4vLyBtb2R1bGUgaWQgPSAzNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiICAgIDxkaXYgaWQ9XFxcImZlbHRcXFwiIGNsYXNzPVxcXCJmZWx0XFxcIj5cXG4gICAgPHRhYmxlIHN0eWxlPVxcXCJib3JkZXItd2lkdGg6MXB4XFxcIj5cXG4gICAgPHRyIHdpZHRoPVxcXCIxMDAlXFxcIj5cXG4gICAgICAgIDx0ZD48c3BhbiBpZD0nI2NhcmQwMCcgc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzO0E8L3NwYW4+PC90ZD5cXG4gICAgICAgIDx0ZD48c3BhbiBpZD0nI2NhcmQwMScgc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzOzI8L3NwYW4+PC90ZD5cXG4gICAgICAgIDx0ZD48c3BhbiBpZD0nI2NhcmQwMicgc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzOzM8L3NwYW4+PC90ZD5cXG4gICAgICAgIDx0ZD48c3BhbiBpZD0nI2NhcmQwMycgc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzOzQ8L3NwYW4+PC90ZD5cXG4gICAgICAgIDx0ZD48c3BhbiBpZD0nI2NhcmQwNCcgc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzOzU8L3NwYW4+PC90ZD5cXG4gICAgICAgIDx0ZD48c3BhbiBpZD0nI2NhcmQwNScgc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzOzY8L3NwYW4+PC90ZD5cXG4gICAgICAgIDx0ZD48c3BhbiBpZD0nI2NhcmQwNicgc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzOzc8L3NwYW4+PC90ZD5cXG4gICAgICAgIDx0ZD48c3BhbiBpZD0nI2NhcmQwNycgc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzOzg8L3NwYW4+PC90ZD5cXG4gICAgICAgIDx0ZD48c3BhbiBpZD0nI2NhcmQwOCcgc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzOzk8L3NwYW4+PC90ZD5cXG4gICAgICAgIDx0ZD48c3BhbiBpZD0nI2NhcmQwOScgc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzOzEwPC9zcGFuPjwvdGQ+XFxuICAgICAgICA8dGQ+PHNwYW4gaWQ9JyNjYXJkMTAnIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlcztKPC9zcGFuPjwvdGQ+XFxuICAgICAgICA8dGQ+PHNwYW4gaWQ9JyNjYXJkMTEnIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlcztRPC9zcGFuPjwvdGQ+XFxuICAgICAgICA8dGQ+PHNwYW4gaWQ9JyNjYXJkMTInIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlcztLPC9zcGFuPjwvdGQ+XFxuICAgIDwvdHI+XFxuICAgIDx0cj5cXG4gICAgICAgIDx0ZD48c3BhbiBpZD0nI2NhcmQxMycgc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0cztBPC9zcGFuPjwvdGQ+XFxuICAgICAgICA8dGQ+PHNwYW4gaWQ9JyNjYXJkMTQnIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZoZWFydHM7Mjwvc3Bhbj48L3RkPlxcbiAgICAgICAgPHRkPjxzcGFuIGlkPScjY2FyZDE1JyBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzM8L3NwYW4+PC90ZD5cXG4gICAgICAgIDx0ZD48c3BhbiBpZD0nI2NhcmQxNicgc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs0PC9zcGFuPjwvdGQ+XFxuICAgICAgICA8dGQ+PHNwYW4gaWQ9JyNjYXJkMTcnIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZoZWFydHM7NTwvc3Bhbj48L3RkPlxcbiAgICAgICAgPHRkPjxzcGFuIGlkPScjY2FyZDE4JyBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzY8L3NwYW4+PC90ZD5cXG4gICAgICAgIDx0ZD48c3BhbiBpZD0nI2NhcmQxOScgc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs3PC9zcGFuPjwvdGQ+XFxuICAgICAgICA8dGQ+PHNwYW4gaWQ9JyNjYXJkMjAnIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZoZWFydHM7ODwvc3Bhbj48L3RkPlxcbiAgICAgICAgPHRkPjxzcGFuIGlkPScjY2FyZDIxJyBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzk8L3NwYW4+PC90ZD5cXG4gICAgICAgIDx0ZD48c3BhbiBpZD0nI2NhcmQyMicgc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czsxMDwvc3Bhbj48L3RkPlxcbiAgICAgICAgPHRkPjxzcGFuIGlkPScjY2FyZDIzJyBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzO0o8L3NwYW4+PC90ZD5cXG4gICAgICAgIDx0ZD48c3BhbiBpZD0nI2NhcmQyNCcgc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0cztRPC9zcGFuPjwvdGQ+XFxuICAgICAgICA8dGQ+PHNwYW4gaWQ9JyNjYXJkMjUnIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZoZWFydHM7Szwvc3Bhbj48L3RkPlxcbiAgICA8L3RyPlxcbiAgICA8dHI+XFxuICAgICAgICA8dGQ+PHNwYW4gaWQ9JyNjYXJkMjYnIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtcztBPC9zcGFuPjwvdGQ+XFxuICAgICAgICA8dGQ+PHNwYW4gaWQ9JyNjYXJkMjcnIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczsyPC9zcGFuPjwvdGQ+XFxuICAgICAgICA8dGQ+PHNwYW4gaWQ9JyNjYXJkMjgnIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczszPC9zcGFuPjwvdGQ+XFxuICAgICAgICA8dGQ+PHNwYW4gaWQ9JyNjYXJkMjknIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczs0PC9zcGFuPjwvdGQ+XFxuICAgICAgICA8dGQ+PHNwYW4gaWQ9JyNjYXJkMzAnIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczs1PC9zcGFuPjwvdGQ+XFxuICAgICAgICA8dGQ+PHNwYW4gaWQ9JyNjYXJkMzEnIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczs2PC9zcGFuPjwvdGQ+XFxuICAgICAgICA8dGQ+PHNwYW4gaWQ9JyNjYXJkMzInIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczs3PC9zcGFuPjwvdGQ+XFxuICAgICAgICA8dGQ+PHNwYW4gaWQ9JyNjYXJkMzMnIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczs4PC9zcGFuPjwvdGQ+XFxuICAgICAgICA8dGQ+PHNwYW4gaWQ9JyNjYXJkMzQnIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczs5PC9zcGFuPjwvdGQ+XFxuICAgICAgICA8dGQ+PHNwYW4gaWQ9JyNjYXJkMzUnIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczsxMDwvc3Bhbj48L3RkPlxcbiAgICAgICAgPHRkPjxzcGFuIGlkPScjY2FyZDM2JyBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7Sjwvc3Bhbj48L3RkPlxcbiAgICAgICAgPHRkPjxzcGFuIGlkPScjY2FyZDM3JyBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7UTwvc3Bhbj48L3RkPlxcbiAgICAgICAgPHRkPjxzcGFuIGlkPScjY2FyZDM4JyBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7Szwvc3Bhbj48L3RkPlxcbiAgICA8L3RyPlxcbiAgICA8dHI+XFxuICAgICAgICA8dGQ+PHNwYW4gaWQ9JyNjYXJkMzknIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzO0E8L3NwYW4+PC90ZD5cXG4gICAgICAgIDx0ZD48c3BhbiBpZD0nI2NhcmQ0MCcgc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7Mjwvc3Bhbj48L3RkPlxcbiAgICAgICAgPHRkPjxzcGFuIGlkPScjY2FyZDQxJyBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczszPC9zcGFuPjwvdGQ+XFxuICAgICAgICA8dGQ+PHNwYW4gaWQ9JyNjYXJkNDInIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzQ8L3NwYW4+PC90ZD5cXG4gICAgICAgIDx0ZD48c3BhbiBpZD0nI2NhcmQ0Mycgc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7NTwvc3Bhbj48L3RkPlxcbiAgICAgICAgPHRkPjxzcGFuIGlkPScjY2FyZDQ0JyBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczs2PC9zcGFuPjwvdGQ+XFxuICAgICAgICA8dGQ+PHNwYW4gaWQ9JyNjYXJkNDUnIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzc8L3NwYW4+PC90ZD5cXG4gICAgICAgIDx0ZD48c3BhbiBpZD0nI2NhcmQ0Nicgc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7ODwvc3Bhbj48L3RkPlxcbiAgICAgICAgPHRkPjxzcGFuIGlkPScjY2FyZDQ3JyBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczs5PC9zcGFuPjwvdGQ+XFxuICAgICAgICA8dGQ+PHNwYW4gaWQ9JyNjYXJkNDgnIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzEwPC9zcGFuPjwvdGQ+XFxuICAgICAgICA8dGQ+PHNwYW4gaWQ9JyNjYXJkNDknIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzO0o8L3NwYW4+PC90ZD5cXG4gICAgICAgIDx0ZD48c3BhbiBpZD0nI2NhcmQ1MCcgc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7UTwvc3Bhbj48L3RkPlxcbiAgICAgICAgPHRkPjxzcGFuIGlkPScjY2FyZDUxJyBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHVicztLPC9zcGFuPjwvdGQ+XFxuICAgIDwvdHI+XFxuPC90YWJsZT5cXG4gICAgPGJ1dHRvbiBvbmNsaWNrPVxcXCJcXG4gICAgICAgIGZ1bmN0aW9uIHplcm9QYWQobnVtLCBwbGFjZXMpIHtcXG4gICAgICAgICAgICB2YXIgemVybyA9IHBsYWNlcyAtIG51bS50b1N0cmluZygpLmxlbmd0aCArIDE7XFxuICAgICAgICAgICAgcmV0dXJuIEFycmF5KCsoemVybyA+IDAgJiYgemVybykpLmpvaW4oJzAnKSArIG51bTtcXG4gICAgICAgIH07XFxuICAgICAgICBsZXQgZnJlc2hkZWNrID0ge1xcbiAgICAgICAgJ/CfgqEnOiB7J3N1aXQnOiAn4pmgJywgJ2ZhY2UnOiAnQScsICdodG1sJzogJyZzcGFkZXM7QScsICdjb2xvcic6ICdibGFjayd9LFxcbiAgICAgICAgJ/CfgqInOiB7J3N1aXQnOiAn4pmgJywgJ2ZhY2UnOiAnMicsICdodG1sJzogJyZzcGFkZXM7MicsICdjb2xvcic6ICdibGFjayd9LFxcbiAgICAgICAgJ/CfgqMnOiB7J3N1aXQnOiAn4pmgJywgJ2ZhY2UnOiAnMycsICdodG1sJzogJyZzcGFkZXM7MycsICdjb2xvcic6ICdibGFjayd9LFxcbiAgICAgICAgJ/CfgqQnOiB7J3N1aXQnOiAn4pmgJywgJ2ZhY2UnOiAnNCcsICdodG1sJzogJyZzcGFkZXM7NCcsICdjb2xvcic6ICdibGFjayd9LFxcbiAgICAgICAgJ/CfgqUnOiB7J3N1aXQnOiAn4pmgJywgJ2ZhY2UnOiAnNScsICdodG1sJzogJyZzcGFkZXM7NScsICdjb2xvcic6ICdibGFjayd9LFxcbiAgICAgICAgJ/CfgqYnOiB7J3N1aXQnOiAn4pmgJywgJ2ZhY2UnOiAnNicsICdodG1sJzogJyZzcGFkZXM7NicsICdjb2xvcic6ICdibGFjayd9LFxcbiAgICAgICAgJ/CfgqcnOiB7J3N1aXQnOiAn4pmgJywgJ2ZhY2UnOiAnNycsICdodG1sJzogJyZzcGFkZXM7NycsICdjb2xvcic6ICdibGFjayd9LFxcbiAgICAgICAgJ/CfgqgnOiB7J3N1aXQnOiAn4pmgJywgJ2ZhY2UnOiAnOCcsICdodG1sJzogJyZzcGFkZXM7OCcsICdjb2xvcic6ICdibGFjayd9LFxcbiAgICAgICAgJ/CfgqknOiB7J3N1aXQnOiAn4pmgJywgJ2ZhY2UnOiAnOScsICdodG1sJzogJyZzcGFkZXM7OScsICdjb2xvcic6ICdibGFjayd9LFxcbiAgICAgICAgJ/CfgqonOiB7J3N1aXQnOiAn4pmgJywgJ2ZhY2UnOiAnMTAnLCAnaHRtbCc6ICcmc3BhZGVzOzEwJywgJ2NvbG9yJzogJ2JsYWNrJ30sXFxuICAgICAgICAn8J+Cqyc6IHsnc3VpdCc6ICfimaAnLCAnZmFjZSc6ICdKJywgJ2h0bWwnOiAnJnNwYWRlcztKJywgJ2NvbG9yJzogJ2JsYWNrJ30sXFxuICAgICAgICAn8J+CrSc6IHsnc3VpdCc6ICfimaAnLCAnZmFjZSc6ICdRJywgJ2h0bWwnOiAnJnNwYWRlcztRJywgJ2NvbG9yJzogJ2JsYWNrJ30sXFxuICAgICAgICAn8J+Cric6IHsnc3VpdCc6ICfimaAnLCAnZmFjZSc6ICdLJywgJ2h0bWwnOiAnJnNwYWRlcztLJywgJ2NvbG9yJzogJ2JsYWNrJ30sXFxuICAgICAgICAn8J+CsSc6IHsnc3VpdCc6ICfimaUnLCAnZmFjZSc6ICdBJywgJ2h0bWwnOiAnJmhlYXJ0cztBJywgJ2NvbG9yJzogJ3JlZCd9LFxcbiAgICAgICAgJ/CfgrInOiB7J3N1aXQnOiAn4pmlJywgJ2ZhY2UnOiAnMicsICdodG1sJzogJyZoZWFydHM7MicsICdjb2xvcic6ICdyZWQnfSxcXG4gICAgICAgICfwn4KzJzogeydzdWl0JzogJ+KZpScsICdmYWNlJzogJzMnLCAnaHRtbCc6ICcmaGVhcnRzOzMnLCAnY29sb3InOiAncmVkJ30sXFxuICAgICAgICAn8J+CtCc6IHsnc3VpdCc6ICfimaUnLCAnZmFjZSc6ICc0JywgJ2h0bWwnOiAnJmhlYXJ0czs0JywgJ2NvbG9yJzogJ3JlZCd9LFxcbiAgICAgICAgJ/CfgrUnOiB7J3N1aXQnOiAn4pmlJywgJ2ZhY2UnOiAnNScsICdodG1sJzogJyZoZWFydHM7NScsICdjb2xvcic6ICdyZWQnfSxcXG4gICAgICAgICfwn4K2JzogeydzdWl0JzogJ+KZpScsICdmYWNlJzogJzYnLCAnaHRtbCc6ICcmaGVhcnRzOzYnLCAnY29sb3InOiAncmVkJ30sXFxuICAgICAgICAn8J+Ctyc6IHsnc3VpdCc6ICfimaUnLCAnZmFjZSc6ICc3JywgJ2h0bWwnOiAnJmhlYXJ0czs3JywgJ2NvbG9yJzogJ3JlZCd9LFxcbiAgICAgICAgJ/CfgrgnOiB7J3N1aXQnOiAn4pmlJywgJ2ZhY2UnOiAnOCcsICdodG1sJzogJyZoZWFydHM7OCcsICdjb2xvcic6ICdyZWQnfSxcXG4gICAgICAgICfwn4K5JzogeydzdWl0JzogJ+KZpScsICdmYWNlJzogJzknLCAnaHRtbCc6ICcmaGVhcnRzOzknLCAnY29sb3InOiAncmVkJ30sXFxuICAgICAgICAn8J+Cuic6IHsnc3VpdCc6ICfimaUnLCAnZmFjZSc6ICcxMCcsICdodG1sJzogJyZoZWFydHM7MTAnLCAnY29sb3InOiAncmVkJ30sXFxuICAgICAgICAn8J+Cuyc6IHsnc3VpdCc6ICfimaUnLCAnZmFjZSc6ICdKJywgJ2h0bWwnOiAnJmhlYXJ0cztKJywgJ2NvbG9yJzogJ3JlZCd9LFxcbiAgICAgICAgJ/Cfgr0nOiB7J3N1aXQnOiAn4pmlJywgJ2ZhY2UnOiAnUScsICdodG1sJzogJyZoZWFydHM7UScsICdjb2xvcic6ICdyZWQnfSxcXG4gICAgICAgICfwn4K+JzogeydzdWl0JzogJ+KZpScsICdmYWNlJzogJ0snLCAnaHRtbCc6ICcmaGVhcnRzO0snLCAnY29sb3InOiAncmVkJ30sXFxuICAgICAgICAn8J+DgSc6IHsnc3VpdCc6ICfimaYnLCAnZmFjZSc6ICdBJywgJ2h0bWwnOiAnJmRpYW1zO0EnLCAnY29sb3InOiAncmVkJ30sXFxuICAgICAgICAn8J+Dgic6IHsnc3VpdCc6ICfimaYnLCAnZmFjZSc6ICcyJywgJ2h0bWwnOiAnJmRpYW1zOzInLCAnY29sb3InOiAncmVkJ30sXFxuICAgICAgICAn8J+Dgyc6IHsnc3VpdCc6ICfimaYnLCAnZmFjZSc6ICczJywgJ2h0bWwnOiAnJmRpYW1zOzMnLCAnY29sb3InOiAncmVkJ30sXFxuICAgICAgICAn8J+DhCc6IHsnc3VpdCc6ICfimaYnLCAnZmFjZSc6ICc0JywgJ2h0bWwnOiAnJmRpYW1zOzQnLCAnY29sb3InOiAncmVkJ30sXFxuICAgICAgICAn8J+DhSc6IHsnc3VpdCc6ICfimaYnLCAnZmFjZSc6ICc1JywgJ2h0bWwnOiAnJmRpYW1zOzUnLCAnY29sb3InOiAncmVkJ30sXFxuICAgICAgICAn8J+Dhic6IHsnc3VpdCc6ICfimaYnLCAnZmFjZSc6ICc2JywgJ2h0bWwnOiAnJmRpYW1zOzYnLCAnY29sb3InOiAncmVkJ30sXFxuICAgICAgICAn8J+Dhyc6IHsnc3VpdCc6ICfimaYnLCAnZmFjZSc6ICc3JywgJ2h0bWwnOiAnJmRpYW1zOzcnLCAnY29sb3InOiAncmVkJ30sXFxuICAgICAgICAn8J+DiCc6IHsnc3VpdCc6ICfimaYnLCAnZmFjZSc6ICc4JywgJ2h0bWwnOiAnJmRpYW1zOzgnLCAnY29sb3InOiAncmVkJ30sXFxuICAgICAgICAn8J+DiSc6IHsnc3VpdCc6ICfimaYnLCAnZmFjZSc6ICc5JywgJ2h0bWwnOiAnJmRpYW1zOzknLCAnY29sb3InOiAncmVkJ30sXFxuICAgICAgICAn8J+Diic6IHsnc3VpdCc6ICfimaYnLCAnZmFjZSc6ICcxMCcsICdodG1sJzogJyZkaWFtczsxMCcsICdjb2xvcic6ICdyZWQnfSxcXG4gICAgICAgICfwn4OLJzogeydzdWl0JzogJ+KZpicsICdmYWNlJzogJ0onLCAnaHRtbCc6ICcmZGlhbXM7SicsICdjb2xvcic6ICdyZWQnfSxcXG4gICAgICAgICfwn4ONJzogeydzdWl0JzogJ+KZpicsICdmYWNlJzogJ1EnLCAnaHRtbCc6ICcmZGlhbXM7UScsICdjb2xvcic6ICdyZWQnfSxcXG4gICAgICAgICfwn4OOJzogeydzdWl0JzogJ+KZpicsICdmYWNlJzogJ0snLCAnaHRtbCc6ICcmZGlhbXM7SycsICdjb2xvcic6ICdyZWQnfSxcXG4gICAgICAgICfwn4ORJzogeydzdWl0JzogJ+KZoycsICdmYWNlJzogJ0EnLCAnaHRtbCc6ICcmY2x1YnM7QScsICdjb2xvcic6ICdibGFjayd9LFxcbiAgICAgICAgJ/Cfg5InOiB7J3N1aXQnOiAn4pmjJywgJ2ZhY2UnOiAnMicsICdodG1sJzogJyZjbHViczsyJywgJ2NvbG9yJzogJ2JsYWNrJ30sXFxuICAgICAgICAn8J+Dkyc6IHsnc3VpdCc6ICfimaMnLCAnZmFjZSc6ICczJywgJ2h0bWwnOiAnJmNsdWJzOzMnLCAnY29sb3InOiAnYmxhY2snfSxcXG4gICAgICAgICfwn4OUJzogeydzdWl0JzogJ+KZoycsICdmYWNlJzogJzQnLCAnaHRtbCc6ICcmY2x1YnM7NCcsICdjb2xvcic6ICdibGFjayd9LFxcbiAgICAgICAgJ/Cfg5UnOiB7J3N1aXQnOiAn4pmjJywgJ2ZhY2UnOiAnNScsICdodG1sJzogJyZjbHViczs1JywgJ2NvbG9yJzogJ2JsYWNrJ30sXFxuICAgICAgICAn8J+Dlic6IHsnc3VpdCc6ICfimaMnLCAnZmFjZSc6ICc2JywgJ2h0bWwnOiAnJmNsdWJzOzYnLCAnY29sb3InOiAnYmxhY2snfSxcXG4gICAgICAgICfwn4OXJzogeydzdWl0JzogJ+KZoycsICdmYWNlJzogJzcnLCAnaHRtbCc6ICcmY2x1YnM7NycsICdjb2xvcic6ICdibGFjayd9LFxcbiAgICAgICAgJ/Cfg5gnOiB7J3N1aXQnOiAn4pmjJywgJ2ZhY2UnOiAnOCcsICdodG1sJzogJyZjbHViczs4JywgJ2NvbG9yJzogJ2JsYWNrJ30sXFxuICAgICAgICAn8J+DmSc6IHsnc3VpdCc6ICfimaMnLCAnZmFjZSc6ICc5JywgJ2h0bWwnOiAnJmNsdWJzOzknLCAnY29sb3InOiAnYmxhY2snfSxcXG4gICAgICAgICfwn4OaJzogeydzdWl0JzogJ+KZoycsICdmYWNlJzogJzEwJywgJ2h0bWwnOiAnJmNsdWJzOzEwJywgJ2NvbG9yJzogJ2JsYWNrJ30sXFxuICAgICAgICAn8J+Dmyc6IHsnc3VpdCc6ICfimaMnLCAnZmFjZSc6ICdKJywgJ2h0bWwnOiAnJmNsdWJzO0onLCAnY29sb3InOiAnYmxhY2snfSxcXG4gICAgICAgICfwn4OdJzogeydzdWl0JzogJ+KZoycsICdmYWNlJzogJ1EnLCAnaHRtbCc6ICcmY2x1YnM7UScsICdjb2xvcic6ICdibGFjayd9LFxcbiAgICAgICAgJ/Cfg54nOiB7J3N1aXQnOiAn4pmjJywgJ2ZhY2UnOiAnSycsICdodG1sJzogJyZjbHVicztLJywgJ2NvbG9yJzogJ2JsYWNrJ31cXG4gICAgICAgIH07XFxuICAgICAgICBzaHVmZmxlKE9iamVjdC5rZXlzKGZyZXNoZGVjaykpXFxuICAgICAgICAudGhlbigoc2h1ZmZsZWQpID0+IHtcXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xcbiAgICAgICAgICAgICAgICB0cnkge1xcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRlY2tQb3NpdGlvbmlkeCA9IDUxO1xcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRlY2tLZXkgPSAnJztcXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChkZWNrUG9zaXRpb25pZHggPj0gMCkge1xcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlY2tLZXkgPSAnI2NhcmQnICsgemVyb1BhZChkZWNrUG9zaXRpb25pZHgsIDIpXFxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZGVja0tleSkuaW5uZXJIVE1MID0gZnJlc2hkZWNrW3NodWZmbGVkW2RlY2tQb3NpdGlvbmlkeF1dLmh0bWxcXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkZWNrS2V5KS5zdHlsZS5jb2xvciA9IGZyZXNoZGVja1tzaHVmZmxlZFtkZWNrUG9zaXRpb25pZHhdXS5jb2xvclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlY2tQb3NpdGlvbmlkeC0tO1xcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZWNrUG9zaXRpb25pZHggPT09IDApIHtcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShzaHVmZmxlZCk7XFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxcbiAgICAgICAgICAgICAgICAgICAgfVxcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoZXJyKSk7XFxuICAgICAgICAgICAgICAgIH1cXG4gICAgICAgICAgICB9KVxcbiAgICAgICAgfSlcXG4gICAgICAgIC50aGVuKChzaHVmZmxlZCkgPT4ge1xcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XFxuICAgICAgICAgICAgICAgIHRyeSB7XFxuICAgICAgICAgICAgICAgICAgICBsZXQgZGVja1Bvc2l0aW9uaWR4ID0gNTE7XFxuICAgICAgICAgICAgICAgICAgICBlbmNyeXB0aW5nID0gW107XFxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoZGVja1Bvc2l0aW9uaWR4ID49IDApIHtcXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmNyeXB0aW5nLnB1c2gobmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNodWZmbGVkQ2FyZCA9IE9iamVjdC5hc3NpZ24oZnJlc2hkZWNrW3NodWZmbGVkW2RlY2tQb3NpdGlvbmlkeF1dKTtcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNodWZmbGVkQ2FyZC5kZWNrUG9zaXRpb25JbmRleCA9IGRlY2tQb3NpdGlvbmlkeDtcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEZyb21TdG9yYWdlKGxvY2FsU3RvcmFnZSkoKVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHN0b3JlZEl0ZW1zKSA9PiB7XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmVkSXRlbXMubWFwKChzdG9yZWRJdGVtKSA9PiB7XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldGVybWluZUNvbnRlbnRUeXBlKHN0b3JlZEl0ZW0pKG9wZW5wZ3ApXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChjb250ZW50VHlwZSkgPT4ge1xcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRlbnRUeXBlID09PSAnUEdQUHJpdmtleScpIHtcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcHJpdmF0ZUtleXMgPSBvcGVucGdwLmtleS5yZWFkQXJtb3JlZChzdG9yZWRJdGVtKTtcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcHJpdmF0ZUtleSA9IHByaXZhdGVLZXlzLmtleXNbMF07XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHB1YmxpY0tleUFybW9yID0gcHJpdmF0ZUtleS50b1B1YmxpYygpLmFybW9yKCk7XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNodWZmbGVkU3RyID0gSlNPTi5zdHJpbmdpZnkoc2h1ZmZsZWRDYXJkKVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuY3J5cHRDbGVhclRleHQob3BlbnBncCkocHVibGljS2V5QXJtb3IpKHNodWZmbGVkU3RyKVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChjaXBoZXJUZXh0KSA9PiB7XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY2lwaGVyVGV4dCk7XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlamVjdChlcnIpKTtcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoVHlwZUVycm9yKSkgLy8gZGV0ZXJtaW5lQ29udGVudFR5cGUgbm90IGEgZnVuY3Rpb25cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiByZWplY3QoZXJyKSk7XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7IC8vIHJlamVjdCB0aGlzXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSlcXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWNrUG9zaXRpb25pZHgtLTtcXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGVja1Bvc2l0aW9uaWR4ID09PSAwKSB7XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZW5jcnlwdGluZyk7XFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxcbiAgICAgICAgICAgICAgICAgICAgfVxcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoZXJyKSk7XFxuICAgICAgICAgICAgICAgIH1cXG4gICAgICAgICAgICB9KVxcbiAgICAgICAgfSlcXG4gICAgICAgIC50aGVuKChlbmNyeXB0aW5nKSA9PiB7XFxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGVuY3J5cHRpbmcpXFxuICAgICAgICAgICAgLnRoZW4oKGVuY3J5cHRlZCkgPT4ge1xcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlbmNyeXB0ZWQpO1xcbiAgICAgICAgICAgICAgICByZXR1cm4oZW5jcnlwdGVkKTtcXG4gICAgICAgICAgICB9KVxcbiAgICAgICAgfSlcXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XFxuICAgICAgICAgICAgYWxlcnQoYGVycm9yOiAke2Vycn1gKTtcXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgZXJyb3I6ICR7ZXJyfWApO1xcbiAgICAgICAgfSlcXG4gICAgXFxcIj5zaHVmZmxlIGFuZCBlbmNyeXB0PC9idXR0b24+XFxuXFxuPC9kaXY+XFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmF3LWxvYWRlciEuL3ZpZXdzL3BhcnRpYWxzL2ZlbHQuaHRtbFxuLy8gbW9kdWxlIGlkID0gMzZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIiAgICA8ZGl2IGlkPVxcXCJkZWNrXFxcIiBjbGFzcz1cXFwiZGVja1xcXCI+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4paIXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTcwLjMxMjUgMzYyLjI1IEw3MC4zMTI1IDExMC4xMDk0IEwyMjQuMjk2OSAxMTAuMTA5NCBMMjI0LjI5NjkgMzYyLjI1IEw3MC4zMTI1IDM2Mi4yNSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaBBXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuNjcxOSAxMTUuNzM0NCBMOTEuODI4MSAxNzUuNzgxMiBMMTI5LjUxNTYgMTc1Ljc4MTIgTDExMC42NzE5IDExNS43MzQ0IFpNOTkuOTg0NCAxMDEuNjcxOSBMMTIxLjY0MDYgMTAxLjY3MTkgTDE2Mi4xNDA2IDIxOS4yMzQ0IEwxNDMuNTc4MSAyMTkuMjM0NCBMMTM0LjAxNTYgMTg4LjU3ODEgTDg3LjYwOTQgMTg4LjU3ODEgTDc4LjA0NjkgMjE5LjIzNDQgTDU5LjQ4NDQgMjE5LjIzNDQgTDk5Ljk4NDQgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgMlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODYuMzQzOCAyMDMuMDYyNSBMMTQ1Ljk2ODggMjAzLjA2MjUgTDE0NS45Njg4IDIxOS4wOTM4IEw2MS44NzUgMjE5LjA5MzggTDYxLjg3NSAyMDMuNjI1IFE2Ni42NTYyIDE5OS4yNjU2IDc1LjUxNTYgMTkxLjM5MDYgUTEyMy44OTA2IDE0OC41IDEyMy44OTA2IDEzNS4yODEyIFExMjMuODkwNiAxMjYgMTE2LjU3ODEgMTIwLjMwNDcgUTEwOS4yNjU2IDExNC42MDk0IDk3LjMxMjUgMTE0LjYwOTQgUTkwIDExNC42MDk0IDgxLjQyMTkgMTE3LjA3MDMgUTcyLjg0MzggMTE5LjUzMTIgNjIuNzE4OCAxMjQuNDUzMSBMNjIuNzE4OCAxMDcuMTU2MiBRNzMuNTQ2OSAxMDMuMjE4OCA4Mi44OTg0IDEwMS4yNSBROTIuMjUgOTkuMjgxMiAxMDAuMjY1NiA5OS4yODEyIFExMjAuNjU2MiA5OS4yODEyIDEzMi44OTA2IDEwOC41NjI1IFExNDUuMTI1IDExNy44NDM4IDE0NS4xMjUgMTMzLjAzMTIgUTE0NS4xMjUgMTUyLjU3ODEgOTguNTc4MSAxOTIuNTE1NiBROTAuNzAzMSAxOTkuMjY1NiA4Ni4zNDM4IDIwMy4wNjI1IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoDNcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEyMS43ODEyIDE1NS41MzEyIFExMzQuNzE4OCAxNTguMDYyNSAxNDEuODIwMyAxNjUuNzI2NiBRMTQ4LjkyMTkgMTczLjM5MDYgMTQ4LjkyMTkgMTg0LjkyMTkgUTE0OC45MjE5IDIwMi4zNTk0IDEzNS41NjI1IDIxMS43ODEyIFExMjIuMjAzMSAyMjEuMjAzMSA5Ny4zMTI1IDIyMS4yMDMxIFE4OS4yOTY5IDIyMS4yMDMxIDgwLjUwNzggMjE5LjcyNjYgUTcxLjcxODggMjE4LjI1IDYxLjg3NSAyMTUuNDM3NSBMNjEuODc1IDE5OC40MjE5IFE2OS4xODc1IDIwMi4yMTg4IDc3LjU1NDcgMjA0LjA0NjkgUTg1LjkyMTkgMjA1Ljg3NSA5NS4zNDM4IDIwNS44NzUgUTExMC42NzE5IDIwNS44NzUgMTE5LjEwOTQgMjAwLjMyMDMgUTEyNy41NDY5IDE5NC43NjU2IDEyNy41NDY5IDE4NC45MjE5IFExMjcuNTQ2OSAxNzQuNTE1NiAxMTkuNzQyMiAxNjkuMTcxOSBRMTExLjkzNzUgMTYzLjgyODEgOTYuNzUgMTYzLjgyODEgTDg0LjY1NjIgMTYzLjgyODEgTDg0LjY1NjIgMTQ4LjY0MDYgTDk3Ljg3NSAxNDguNjQwNiBRMTExLjA5MzggMTQ4LjY0MDYgMTE3LjkxNDEgMTQ0LjIxMDkgUTEyNC43MzQ0IDEzOS43ODEyIDEyNC43MzQ0IDEzMS4zNDM4IFExMjQuNzM0NCAxMjMuMTg3NSAxMTcuNzAzMSAxMTguODk4NCBRMTEwLjY3MTkgMTE0LjYwOTQgOTcuMzEyNSAxMTQuNjA5NCBROTEuNjg3NSAxMTQuNjA5NCA4NC41MTU2IDExNS44NzUgUTc3LjM0MzggMTE3LjE0MDYgNjUuOTUzMSAxMjAuMzc1IEw2NS45NTMxIDEwNC4yMDMxIFE3Ni4yMTg4IDEwMS44MTI1IDg1LjIxODggMTAwLjU0NjkgUTk0LjIxODggOTkuMjgxMiAxMDEuOTUzMSA5OS4yODEyIFExMjIuMjAzMSA5OS4yODEyIDEzNC4wODU5IDEwNy41NzgxIFExNDUuOTY4OCAxMTUuODc1IDE0NS45Njg4IDEyOS43OTY5IFExNDUuOTY4OCAxMzkuNSAxMzkuNjQwNiAxNDYuMjUgUTEzMy4zMTI1IDE1MyAxMjEuNzgxMiAxNTUuNTMxMiBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaA0XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMjAuMDkzOCAxMTguNjg3NSBMNzYuNjQwNiAxNzcuNjA5NCBMMTIwLjA5MzggMTc3LjYwOTQgTDEyMC4wOTM4IDExOC42ODc1IFpNMTE3IDEwMS42NzE5IEwxNDAuMzQzOCAxMDEuNjcxOSBMMTQwLjM0MzggMTc3LjYwOTQgTDE1OS4zMjgxIDE3Ny42MDk0IEwxNTkuMzI4MSAxOTIuOTM3NSBMMTQwLjM0MzggMTkyLjkzNzUgTDE0MC4zNDM4IDIxOS4wOTM4IEwxMjAuMDkzOCAyMTkuMDkzOCBMMTIwLjA5MzggMTkyLjkzNzUgTDYxLjg3NSAxOTIuOTM3NSBMNjEuODc1IDE3NS45MjE5IEwxMTcgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgNVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjcuNSAxMDEuNjcxOSBMMTM5LjIxODggMTAxLjY3MTkgTDEzOS4yMTg4IDExNS4wMzEyIEw4NC4yMzQ0IDExNS4wMzEyIEw4NC4yMzQ0IDE0My43MTg4IFE4OC4xNzE5IDE0Mi40NTMxIDkyLjI1IDE0MS44OTA2IFE5Ni4xODc1IDE0MS4zMjgxIDEwMC4xMjUgMTQxLjMyODEgUTEyMi43NjU2IDE0MS4zMjgxIDEzNS45ODQ0IDE1Mi4xNTYyIFExNDkuMjAzMSAxNjIuODQzOCAxNDkuMjAzMSAxODEuMjY1NiBRMTQ5LjIwMzEgMjAwLjI1IDEzNS41NjI1IDIxMC43OTY5IFExMjIuMDYyNSAyMjEuMjAzMSA5Ny4zMTI1IDIyMS4yMDMxIFE4OC44NzUgMjIxLjIwMzEgODAuMDE1NiAyMTkuOTM3NSBRNzEuMTU2MiAyMTguNjcxOSA2MS44NzUgMjE2LjE0MDYgTDYxLjg3NSAyMDAuMjUgUTY5Ljg5MDYgMjA0LjA0NjkgNzguNjA5NCAyMDYuMDE1NiBRODcuMzI4MSAyMDcuODQzOCA5Ny4wMzEyIDIwNy44NDM4IFExMTIuNjQwNiAyMDcuODQzOCAxMjEuNzgxMiAyMDAuNjcxOSBRMTMwLjkyMTkgMTkzLjUgMTMwLjkyMTkgMTgxLjI2NTYgUTEzMC45MjE5IDE2OS4wMzEyIDEyMS43ODEyIDE2MS44NTk0IFExMTIuNjQwNiAxNTQuNjg3NSA5Ny4wMzEyIDE1NC42ODc1IFE4OS43MTg4IDE1NC42ODc1IDgyLjQwNjIgMTU2LjA5MzggUTc1LjA5MzggMTU3LjUgNjcuNSAxNjAuNDUzMSBMNjcuNSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaA2XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuMTA5NCAxNTMuNzAzMSBROTcuNzM0NCAxNTMuNzAzMSA5MC41NjI1IDE2MS4wMTU2IFE4My4zOTA2IDE2OC40Njg4IDgzLjM5MDYgMTgxLjI2NTYgUTgzLjM5MDYgMTkzLjkyMTkgOTAuNTYyNSAyMDEuMjM0NCBROTcuNzM0NCAyMDguNjg3NSAxMTAuMTA5NCAyMDguNjg3NSBRMTIyLjM0MzggMjA4LjY4NzUgMTI5LjUxNTYgMjAxLjIzNDQgUTEzNi42ODc1IDE5My45MjE5IDEzNi42ODc1IDE4MS4yNjU2IFExMzYuNjg3NSAxNjguNDY4OCAxMjkuNTE1NiAxNjEuMDE1NiBRMTIyLjM0MzggMTUzLjcwMzEgMTEwLjEwOTQgMTUzLjcwMzEgWk0xNDYuMzkwNiAxMDMuOTIxOSBMMTQ2LjM5MDYgMTE4LjQwNjIgUTEzOS41IDExNS41OTM4IDEzMi40Njg4IDExNC4xODc1IFExMjUuNDM3NSAxMTIuNjQwNiAxMTguNTQ2OSAxMTIuNjQwNiBRMTAwLjU0NjkgMTEyLjY0MDYgOTAuOTg0NCAxMjMuMTg3NSBRODEuNDIxOSAxMzMuODc1IDgwLjAxNTYgMTU1LjM5MDYgUTg1LjM1OTQgMTQ4LjUgOTMuMzc1IDE0NC44NDM4IFExMDEuNTMxMiAxNDEuMTg3NSAxMTEuMDkzOCAxNDEuMTg3NSBRMTMxLjQ4NDQgMTQxLjE4NzUgMTQzLjI5NjkgMTUxLjg3NSBRMTU1LjEwOTQgMTYyLjcwMzEgMTU1LjEwOTQgMTgxLjI2NTYgUTE1NS4xMDk0IDE5OS4xMjUgMTQyLjczNDQgMjEwLjIzNDQgUTEzMC41IDIyMS4yMDMxIDExMC4xMDk0IDIyMS4yMDMxIFE4Ni42MjUgMjIxLjIwMzEgNzQuMjUgMjA1LjU5MzggUTYxLjg3NSAxODkuOTg0NCA2MS44NzUgMTYwLjE3MTkgUTYxLjg3NSAxMzIuMzI4MSA3Ny4wNjI1IDExNS44NzUgUTkyLjI1IDk5LjI4MTIgMTE3Ljg0MzggOTkuMjgxMiBRMTI0LjczNDQgOTkuMjgxMiAxMzEuNzY1NiAxMDAuNDA2MiBRMTM4Ljc5NjkgMTAxLjY3MTkgMTQ2LjM5MDYgMTAzLjkyMTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgN1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjEuODc1IDEwMS42NzE5IEwxNDguNjQwNiAxMDEuNjcxOSBMMTQ4LjY0MDYgMTA4LjQyMTkgTDk5LjcwMzEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggTDEyNi43MDMxIDExNS4wMzEyIEw2MS44NzUgMTE1LjAzMTIgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaA4XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMDguMjgxMiAxNjMuMTI1IFE5NS4yMDMxIDE2My4xMjUgODcuNzUgMTY5LjMxMjUgUTgwLjI5NjkgMTc1LjM1OTQgODAuMjk2OSAxODUuOTA2MiBRODAuMjk2OSAxOTYuNTkzOCA4Ny43NSAyMDIuNjQwNiBROTUuMjAzMSAyMDguNjg3NSAxMDguMjgxMiAyMDguNjg3NSBRMTIxLjIxODggMjA4LjY4NzUgMTI4LjgxMjUgMjAyLjUgUTEzNi4yNjU2IDE5Ni40NTMxIDEzNi4yNjU2IDE4NS45MDYyIFExMzYuMjY1NiAxNzUuMzU5NCAxMjguODEyNSAxNjkuMzEyNSBRMTIxLjM1OTQgMTYzLjEyNSAxMDguMjgxMiAxNjMuMTI1IFpNOTAgMTU2LjIzNDQgUTc4LjE4NzUgMTUzLjcwMzEgNzEuNzE4OCAxNDYuODEyNSBRNjUuMTA5NCAxMzkuNzgxMiA2NS4xMDk0IDEyOS42NTYyIFE2NS4xMDk0IDExNS41OTM4IDc2LjY0MDYgMTA3LjQzNzUgUTg4LjE3MTkgOTkuMjgxMiAxMDguMjgxMiA5OS4yODEyIFExMjguMzkwNiA5OS4yODEyIDEzOS45MjE5IDEwNy40Mzc1IFExNTEuMzEyNSAxMTUuNTkzOCAxNTEuMzEyNSAxMjkuNjU2MiBRMTUxLjMxMjUgMTQwLjA2MjUgMTQ0Ljg0MzggMTQ2LjgxMjUgUTEzOC4yMzQ0IDE1My43MDMxIDEyNi41NjI1IDE1Ni4yMzQ0IFExMzkuMjE4OCAxNTguNzY1NiAxNDcuMDkzOCAxNjYuOTIxOSBRMTU0LjU0NjkgMTc0LjY1NjIgMTU0LjU0NjkgMTg1LjkwNjIgUTE1NC41NDY5IDIwMi45MjE5IDE0Mi41OTM4IDIxMi4wNjI1IFExMzAuNSAyMjEuMjAzMSAxMDguMjgxMiAyMjEuMjAzMSBRODUuOTIxOSAyMjEuMjAzMSA3My45Njg4IDIxMi4wNjI1IFE2MS44NzUgMjAyLjkyMTkgNjEuODc1IDE4NS45MDYyIFE2MS44NzUgMTc0LjkzNzUgNjkuMzI4MSAxNjYuOTIxOSBRNzYuOTIxOSAxNTkuMDQ2OSA5MCAxNTYuMjM0NCBaTTgzLjI1IDEzMS4yMDMxIFE4My4yNSAxNDAuMDYyNSA4OS44NTk0IDE0NS40MDYyIFE5Ni4zMjgxIDE1MC42MDk0IDEwOC4yODEyIDE1MC42MDk0IFExMTkuNjcxOSAxNTAuNjA5NCAxMjYuNTYyNSAxNDUuNDA2MiBRMTMzLjMxMjUgMTQwLjM0MzggMTMzLjMxMjUgMTMxLjIwMzEgUTEzMy4zMTI1IDEyMi4zNDM4IDEyNi41NjI1IDExNyBRMTE5Ljk1MzEgMTExLjc5NjkgMTA4LjI4MTIgMTExLjc5NjkgUTk2LjYwOTQgMTExLjc5NjkgODkuODU5NCAxMTcgUTgzLjI1IDEyMi4wNjI1IDgzLjI1IDEzMS4yMDMxIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoDlcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTcwLjU5MzggMjE2LjU2MjUgTDcwLjU5MzggMjAyLjA3ODEgUTc3LjQ4NDQgMjA0Ljg5MDYgODQuNTE1NiAyMDYuNDM3NSBROTEuNTQ2OSAyMDcuODQzOCA5OC4yOTY5IDIwNy44NDM4IFExMTYuNDM3NSAyMDcuODQzOCAxMjYgMTk3LjI5NjkgUTEzNS40MjE5IDE4Ni43NSAxMzYuODI4MSAxNjUuMDkzOCBRMTMxLjkwNjIgMTcxLjcwMzEgMTIzLjQ2ODggMTc1LjUgUTExNS40NTMxIDE3OS4xNTYyIDEwNS43NSAxNzkuMTU2MiBRODUuNSAxNzkuMTU2MiA3My42ODc1IDE2OC40Njg4IFE2MS44NzUgMTU3Ljc4MTIgNjEuODc1IDEzOS4yMTg4IFE2MS44NzUgMTIxLjA3ODEgNzQuMTA5NCAxMTAuMjUgUTg2LjQ4NDQgOTkuMjgxMiAxMDYuODc1IDk5LjI4MTIgUTEzMC4zNTk0IDk5LjI4MTIgMTQyLjU5MzggMTE0Ljg5MDYgUTE1NC45Njg4IDEzMC41IDE1NC45Njg4IDE2MC4zMTI1IFExNTQuOTY4OCAxODguMTU2MiAxMzkuOTIxOSAyMDQuNjA5NCBRMTI0LjczNDQgMjIxLjIwMzEgOTkuMTQwNiAyMjEuMjAzMSBROTIuMjUgMjIxLjIwMzEgODUuMjE4OCAyMjAuMDc4MSBRNzguMTg3NSAyMTguODEyNSA3MC41OTM4IDIxNi41NjI1IFpNMTA2Ljg3NSAxNjYuNzgxMiBRMTE5LjI1IDE2Ni43ODEyIDEyNi40MjE5IDE1OS40Njg4IFExMzMuNTkzOCAxNTIuMTU2MiAxMzMuNTkzOCAxMzkuMjE4OCBRMTMzLjU5MzggMTI2LjU2MjUgMTI2LjQyMTkgMTE5LjI1IFExMTkuMjUgMTExLjc5NjkgMTA2Ljg3NSAxMTEuNzk2OSBROTQuOTIxOSAxMTEuNzk2OSA4Ny40Njg4IDExOS4yNSBRODAuMTU2MiAxMjYuNTYyNSA4MC4xNTYyIDEzOS4yMTg4IFE4MC4xNTYyIDE1Mi4xNTYyIDg3LjQ2ODggMTU5LjQ2ODggUTk0LjY0MDYgMTY2Ljc4MTIgMTA2Ljg3NSAxNjYuNzgxMiBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaAxMFxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTU5LjA0NjkgMTExLjc5NjkgUTE0OS4wNjI1IDExMS43OTY5IDE0Mi4wMzEyIDEyMy44OTA2IFExMzQuODU5NCAxMzUuOTg0NCAxMzQuODU5NCAxNjAuMTcxOSBRMTM0Ljg1OTQgMTg0LjUgMTQyLjAzMTIgMTk2LjU5MzggUTE0OS4wNjI1IDIwOC42ODc1IDE1OS4wNDY5IDIwOC42ODc1IFExNjkuMDMxMiAyMDguNjg3NSAxNzYuMDYyNSAxOTYuNTkzOCBRMTgzLjIzNDQgMTg0LjUgMTgzLjIzNDQgMTYwLjE3MTkgUTE4My4yMzQ0IDEzNS45ODQ0IDE3Ni4wNjI1IDEyMy44OTA2IFExNjkuMDMxMiAxMTEuNzk2OSAxNTkuMDQ2OSAxMTEuNzk2OSBaTTE1OS4wNDY5IDk5LjI4MTIgUTE3Ny40Njg4IDk5LjI4MTIgMTg5LjQyMTkgMTE0Ljg5MDYgUTIwMS4zNzUgMTMwLjUgMjAxLjM3NSAxNjAuMTcxOSBRMjAxLjM3NSAxODkuOTg0NCAxODkuNDIxOSAyMDUuNTkzOCBRMTc3LjQ2ODggMjIxLjIwMzEgMTU5LjA0NjkgMjIxLjIwMzEgUTEzNi4yNjU2IDIyMS4yMDMxIDEyNi40MjE5IDIwNS41OTM4IFExMTYuNTc4MSAxODkuOTg0NCAxMTYuNTc4MSAxNjAuMTcxOSBRMTE2LjU3ODEgMTMwLjUgMTI2LjQyMTkgMTE0Ljg5MDYgUTEzNi4yNjU2IDk5LjI4MTIgMTU5LjA0NjkgOTkuMjgxMiBaTTgwLjU3ODEgMjE5LjA5MzggTDgwLjU3ODEgMTE3LjcwMzEgTDYxLjg3NSAxMjMuNDY4OCBMNjEuODc1IDEwNy4xNTYyIEw4MS41NjI1IDEwMS42NzE5IEwxMDAuODI4MSAxMDEuNjcxOSBMMTAwLjgyODEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgSlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODkuMTU2MiAxMDEuNjcxOSBMMTA3LjAxNTYgMTAxLjY3MTkgTDEwNy4wMTU2IDE3OC43MzQ0IFExMDcuMDE1NiAxOTkuNjg3NSA5Ny44NzUgMjA5LjUzMTIgUTg4Ljg3NSAyMTkuMjM0NCA2OC43NjU2IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAyMDUuNzM0NCBMNjcuNSAyMDUuNzM0NCBRNzkuMzEyNSAyMDUuNzM0NCA4NC4yMzQ0IDE5OS44MjgxIFE4OS4xNTYyIDE5My45MjE5IDg5LjE1NjIgMTc4LjczNDQgTDg5LjE1NjIgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgUVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTA3LjI5NjkgMjIxLjA2MjUgUTEwNi43MzQ0IDIyMS4wNjI1IDEwNS41MzkxIDIyMS4xMzI4IFExMDQuMzQzOCAyMjEuMjAzMSAxMDMuNjQwNiAyMjEuMjAzMSBRODEuNDIxOSAyMjEuMjAzMSA3MC41MjM0IDIwNi4wODU5IFE1OS42MjUgMTkwLjk2ODggNTkuNjI1IDE2MC4zMTI1IFE1OS42MjUgMTI5LjUxNTYgNzAuNTkzOCAxMTQuMzk4NCBRODEuNTYyNSA5OS4yODEyIDEwMy43ODEyIDk5LjI4MTIgUTEyNi4xNDA2IDk5LjI4MTIgMTM3LjEwOTQgMTE0LjM5ODQgUTE0OC4wNzgxIDEyOS41MTU2IDE0OC4wNzgxIDE2MC4zMTI1IFExNDguMDc4MSAxODMuNTE1NiAxNDIuMDMxMiAxOTcuNjQ4NCBRMTM1Ljk4NDQgMjExLjc4MTIgMTIzLjYwOTQgMjE3LjQwNjIgTDE0MS4zMjgxIDIzMi4zMTI1IEwxMjcuOTY4OCAyNDAuMTg3NSBMMTA3LjI5NjkgMjIxLjA2MjUgWk0xMjkuMzc1IDE2MC4zMTI1IFExMjkuMzc1IDEzNC40Mzc1IDEyMy4zOTg0IDEyMy4zMjgxIFExMTcuNDIxOSAxMTIuMjE4OCAxMDMuNzgxMiAxMTIuMjE4OCBROTAuMjgxMiAxMTIuMjE4OCA4NC4zMDQ3IDEyMy4zMjgxIFE3OC4zMjgxIDEzNC40Mzc1IDc4LjMyODEgMTYwLjMxMjUgUTc4LjMyODEgMTg2LjE4NzUgODQuMzA0NyAxOTcuMjk2OSBROTAuMjgxMiAyMDguNDA2MiAxMDMuNzgxMiAyMDguNDA2MiBRMTE3LjQyMTkgMjA4LjQwNjIgMTIzLjM5ODQgMTk3LjI5NjkgUTEyOS4zNzUgMTg2LjE4NzUgMTI5LjM3NSAxNjAuMzEyNSBaTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaBLXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02MS44NzUgMTAxLjY3MTkgTDc5LjczNDQgMTAxLjY3MTkgTDc5LjczNDQgMTUxLjMxMjUgTDEzMC42NDA2IDEwMS42NzE5IEwxNTMuNzAzMSAxMDEuNjcxOSBMOTYuNDY4OCAxNTYuNTE1NiBMMTU4LjM0MzggMjE5LjIzNDQgTDEzNC44NTk0IDIxOS4yMzQ0IEw3OS43MzQ0IDE2Mi41NjI1IEw3OS43MzQ0IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaVBXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuNjcxOSAxMTUuNzM0NCBMOTEuODI4MSAxNzUuNzgxMiBMMTI5LjUxNTYgMTc1Ljc4MTIgTDExMC42NzE5IDExNS43MzQ0IFpNOTkuOTg0NCAxMDEuNjcxOSBMMTIxLjY0MDYgMTAxLjY3MTkgTDE2Mi4xNDA2IDIxOS4yMzQ0IEwxNDMuNTc4MSAyMTkuMjM0NCBMMTM0LjAxNTYgMTg4LjU3ODEgTDg3LjYwOTQgMTg4LjU3ODEgTDc4LjA0NjkgMjE5LjIzNDQgTDU5LjQ4NDQgMjE5LjIzNDQgTDk5Ljk4NDQgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlMlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTg2LjM0MzggMjAzLjA2MjUgTDE0NS45Njg4IDIwMy4wNjI1IEwxNDUuOTY4OCAyMTkuMDkzOCBMNjEuODc1IDIxOS4wOTM4IEw2MS44NzUgMjAzLjYyNSBRNjYuNjU2MiAxOTkuMjY1NiA3NS41MTU2IDE5MS4zOTA2IFExMjMuODkwNiAxNDguNSAxMjMuODkwNiAxMzUuMjgxMiBRMTIzLjg5MDYgMTI2IDExNi41NzgxIDEyMC4zMDQ3IFExMDkuMjY1NiAxMTQuNjA5NCA5Ny4zMTI1IDExNC42MDk0IFE5MCAxMTQuNjA5NCA4MS40MjE5IDExNy4wNzAzIFE3Mi44NDM4IDExOS41MzEyIDYyLjcxODggMTI0LjQ1MzEgTDYyLjcxODggMTA3LjE1NjIgUTczLjU0NjkgMTAzLjIxODggODIuODk4NCAxMDEuMjUgUTkyLjI1IDk5LjI4MTIgMTAwLjI2NTYgOTkuMjgxMiBRMTIwLjY1NjIgOTkuMjgxMiAxMzIuODkwNiAxMDguNTYyNSBRMTQ1LjEyNSAxMTcuODQzOCAxNDUuMTI1IDEzMy4wMzEyIFExNDUuMTI1IDE1Mi41NzgxIDk4LjU3ODEgMTkyLjUxNTYgUTkwLjcwMzEgMTk5LjI2NTYgODYuMzQzOCAyMDMuMDYyNSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaUzXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTIxLjc4MTIgMTU1LjUzMTIgUTEzNC43MTg4IDE1OC4wNjI1IDE0MS44MjAzIDE2NS43MjY2IFExNDguOTIxOSAxNzMuMzkwNiAxNDguOTIxOSAxODQuOTIxOSBRMTQ4LjkyMTkgMjAyLjM1OTQgMTM1LjU2MjUgMjExLjc4MTIgUTEyMi4yMDMxIDIyMS4yMDMxIDk3LjMxMjUgMjIxLjIwMzEgUTg5LjI5NjkgMjIxLjIwMzEgODAuNTA3OCAyMTkuNzI2NiBRNzEuNzE4OCAyMTguMjUgNjEuODc1IDIxNS40Mzc1IEw2MS44NzUgMTk4LjQyMTkgUTY5LjE4NzUgMjAyLjIxODggNzcuNTU0NyAyMDQuMDQ2OSBRODUuOTIxOSAyMDUuODc1IDk1LjM0MzggMjA1Ljg3NSBRMTEwLjY3MTkgMjA1Ljg3NSAxMTkuMTA5NCAyMDAuMzIwMyBRMTI3LjU0NjkgMTk0Ljc2NTYgMTI3LjU0NjkgMTg0LjkyMTkgUTEyNy41NDY5IDE3NC41MTU2IDExOS43NDIyIDE2OS4xNzE5IFExMTEuOTM3NSAxNjMuODI4MSA5Ni43NSAxNjMuODI4MSBMODQuNjU2MiAxNjMuODI4MSBMODQuNjU2MiAxNDguNjQwNiBMOTcuODc1IDE0OC42NDA2IFExMTEuMDkzOCAxNDguNjQwNiAxMTcuOTE0MSAxNDQuMjEwOSBRMTI0LjczNDQgMTM5Ljc4MTIgMTI0LjczNDQgMTMxLjM0MzggUTEyNC43MzQ0IDEyMy4xODc1IDExNy43MDMxIDExOC44OTg0IFExMTAuNjcxOSAxMTQuNjA5NCA5Ny4zMTI1IDExNC42MDk0IFE5MS42ODc1IDExNC42MDk0IDg0LjUxNTYgMTE1Ljg3NSBRNzcuMzQzOCAxMTcuMTQwNiA2NS45NTMxIDEyMC4zNzUgTDY1Ljk1MzEgMTA0LjIwMzEgUTc2LjIxODggMTAxLjgxMjUgODUuMjE4OCAxMDAuNTQ2OSBROTQuMjE4OCA5OS4yODEyIDEwMS45NTMxIDk5LjI4MTIgUTEyMi4yMDMxIDk5LjI4MTIgMTM0LjA4NTkgMTA3LjU3ODEgUTE0NS45Njg4IDExNS44NzUgMTQ1Ljk2ODggMTI5Ljc5NjkgUTE0NS45Njg4IDEzOS41IDEzOS42NDA2IDE0Ni4yNSBRMTMzLjMxMjUgMTUzIDEyMS43ODEyIDE1NS41MzEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpTRcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi42ODc1IDI3My42NTYyIFExNzUuNzgxMiAyNTcuMDYyNSAxODMuNTE1NiAyNDguMzQzOCBRMTkyLjIzNDQgMjM4LjM1OTQgMjA0LjA0NjkgMjM4LjM1OTQgUTIyMy41OTM4IDIzOC4zNTk0IDIzMi4zMTI1IDI1OS4zMTI1IFEyMzQuOTg0NCAyNjUuNjQwNiAyMzQuOTg0NCAyNzMuOTM3NSBRMjM0Ljk4NDQgMjk2LjE1NjIgMjE3LjQwNjIgMzE4LjUxNTYgTDE3Mi45Njg4IDM3NS4wNDY5IEwxMjcuOTY4OCAzMTguNTE1NiBRMTEwLjM5MDYgMjk2LjQzNzUgMTEwLjM5MDYgMjczLjkzNzUgUTExMC4zOTA2IDI2NS42NDA2IDExMy4wNjI1IDI1OS4zMTI1IFExMjEuOTIxOSAyMzguMzU5NCAxNDEuMzI4MSAyMzguMzU5NCBRMTUzLjQyMTkgMjM4LjM1OTQgMTYxLjg1OTQgMjQ4LjM0MzggUTE2OS41OTM4IDI1Ny40ODQ0IDE3Mi42ODc1IDI3My42NTYyIFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMjAuMDkzOCAxMTguNjg3NSBMNzYuNjQwNiAxNzcuNjA5NCBMMTIwLjA5MzggMTc3LjYwOTQgTDEyMC4wOTM4IDExOC42ODc1IFpNMTE3IDEwMS42NzE5IEwxNDAuMzQzOCAxMDEuNjcxOSBMMTQwLjM0MzggMTc3LjYwOTQgTDE1OS4zMjgxIDE3Ny42MDk0IEwxNTkuMzI4MSAxOTIuOTM3NSBMMTQwLjM0MzggMTkyLjkzNzUgTDE0MC4zNDM4IDIxOS4wOTM4IEwxMjAuMDkzOCAyMTkuMDkzOCBMMTIwLjA5MzggMTkyLjkzNzUgTDYxLjg3NSAxOTIuOTM3NSBMNjEuODc1IDE3NS45MjE5IEwxMTcgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlNVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTY3LjUgMTAxLjY3MTkgTDEzOS4yMTg4IDEwMS42NzE5IEwxMzkuMjE4OCAxMTUuMDMxMiBMODQuMjM0NCAxMTUuMDMxMiBMODQuMjM0NCAxNDMuNzE4OCBRODguMTcxOSAxNDIuNDUzMSA5Mi4yNSAxNDEuODkwNiBROTYuMTg3NSAxNDEuMzI4MSAxMDAuMTI1IDE0MS4zMjgxIFExMjIuNzY1NiAxNDEuMzI4MSAxMzUuOTg0NCAxNTIuMTU2MiBRMTQ5LjIwMzEgMTYyLjg0MzggMTQ5LjIwMzEgMTgxLjI2NTYgUTE0OS4yMDMxIDIwMC4yNSAxMzUuNTYyNSAyMTAuNzk2OSBRMTIyLjA2MjUgMjIxLjIwMzEgOTcuMzEyNSAyMjEuMjAzMSBRODguODc1IDIyMS4yMDMxIDgwLjAxNTYgMjE5LjkzNzUgUTcxLjE1NjIgMjE4LjY3MTkgNjEuODc1IDIxNi4xNDA2IEw2MS44NzUgMjAwLjI1IFE2OS44OTA2IDIwNC4wNDY5IDc4LjYwOTQgMjA2LjAxNTYgUTg3LjMyODEgMjA3Ljg0MzggOTcuMDMxMiAyMDcuODQzOCBRMTEyLjY0MDYgMjA3Ljg0MzggMTIxLjc4MTIgMjAwLjY3MTkgUTEzMC45MjE5IDE5My41IDEzMC45MjE5IDE4MS4yNjU2IFExMzAuOTIxOSAxNjkuMDMxMiAxMjEuNzgxMiAxNjEuODU5NCBRMTEyLjY0MDYgMTU0LjY4NzUgOTcuMDMxMiAxNTQuNjg3NSBRODkuNzE4OCAxNTQuNjg3NSA4Mi40MDYyIDE1Ni4wOTM4IFE3NS4wOTM4IDE1Ny41IDY3LjUgMTYwLjQ1MzEgTDY3LjUgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlNlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTExMC4xMDk0IDE1My43MDMxIFE5Ny43MzQ0IDE1My43MDMxIDkwLjU2MjUgMTYxLjAxNTYgUTgzLjM5MDYgMTY4LjQ2ODggODMuMzkwNiAxODEuMjY1NiBRODMuMzkwNiAxOTMuOTIxOSA5MC41NjI1IDIwMS4yMzQ0IFE5Ny43MzQ0IDIwOC42ODc1IDExMC4xMDk0IDIwOC42ODc1IFExMjIuMzQzOCAyMDguNjg3NSAxMjkuNTE1NiAyMDEuMjM0NCBRMTM2LjY4NzUgMTkzLjkyMTkgMTM2LjY4NzUgMTgxLjI2NTYgUTEzNi42ODc1IDE2OC40Njg4IDEyOS41MTU2IDE2MS4wMTU2IFExMjIuMzQzOCAxNTMuNzAzMSAxMTAuMTA5NCAxNTMuNzAzMSBaTTE0Ni4zOTA2IDEwMy45MjE5IEwxNDYuMzkwNiAxMTguNDA2MiBRMTM5LjUgMTE1LjU5MzggMTMyLjQ2ODggMTE0LjE4NzUgUTEyNS40Mzc1IDExMi42NDA2IDExOC41NDY5IDExMi42NDA2IFExMDAuNTQ2OSAxMTIuNjQwNiA5MC45ODQ0IDEyMy4xODc1IFE4MS40MjE5IDEzMy44NzUgODAuMDE1NiAxNTUuMzkwNiBRODUuMzU5NCAxNDguNSA5My4zNzUgMTQ0Ljg0MzggUTEwMS41MzEyIDE0MS4xODc1IDExMS4wOTM4IDE0MS4xODc1IFExMzEuNDg0NCAxNDEuMTg3NSAxNDMuMjk2OSAxNTEuODc1IFExNTUuMTA5NCAxNjIuNzAzMSAxNTUuMTA5NCAxODEuMjY1NiBRMTU1LjEwOTQgMTk5LjEyNSAxNDIuNzM0NCAyMTAuMjM0NCBRMTMwLjUgMjIxLjIwMzEgMTEwLjEwOTQgMjIxLjIwMzEgUTg2LjYyNSAyMjEuMjAzMSA3NC4yNSAyMDUuNTkzOCBRNjEuODc1IDE4OS45ODQ0IDYxLjg3NSAxNjAuMTcxOSBRNjEuODc1IDEzMi4zMjgxIDc3LjA2MjUgMTE1Ljg3NSBROTIuMjUgOTkuMjgxMiAxMTcuODQzOCA5OS4yODEyIFExMjQuNzM0NCA5OS4yODEyIDEzMS43NjU2IDEwMC40MDYyIFExMzguNzk2OSAxMDEuNjcxOSAxNDYuMzkwNiAxMDMuOTIxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaU3XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjEuODc1IDEwMS42NzE5IEwxNDguNjQwNiAxMDEuNjcxOSBMMTQ4LjY0MDYgMTA4LjQyMTkgTDk5LjcwMzEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggTDEyNi43MDMxIDExNS4wMzEyIEw2MS44NzUgMTE1LjAzMTIgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaU4XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTA4LjI4MTIgMTYzLjEyNSBROTUuMjAzMSAxNjMuMTI1IDg3Ljc1IDE2OS4zMTI1IFE4MC4yOTY5IDE3NS4zNTk0IDgwLjI5NjkgMTg1LjkwNjIgUTgwLjI5NjkgMTk2LjU5MzggODcuNzUgMjAyLjY0MDYgUTk1LjIwMzEgMjA4LjY4NzUgMTA4LjI4MTIgMjA4LjY4NzUgUTEyMS4yMTg4IDIwOC42ODc1IDEyOC44MTI1IDIwMi41IFExMzYuMjY1NiAxOTYuNDUzMSAxMzYuMjY1NiAxODUuOTA2MiBRMTM2LjI2NTYgMTc1LjM1OTQgMTI4LjgxMjUgMTY5LjMxMjUgUTEyMS4zNTk0IDE2My4xMjUgMTA4LjI4MTIgMTYzLjEyNSBaTTkwIDE1Ni4yMzQ0IFE3OC4xODc1IDE1My43MDMxIDcxLjcxODggMTQ2LjgxMjUgUTY1LjEwOTQgMTM5Ljc4MTIgNjUuMTA5NCAxMjkuNjU2MiBRNjUuMTA5NCAxMTUuNTkzOCA3Ni42NDA2IDEwNy40Mzc1IFE4OC4xNzE5IDk5LjI4MTIgMTA4LjI4MTIgOTkuMjgxMiBRMTI4LjM5MDYgOTkuMjgxMiAxMzkuOTIxOSAxMDcuNDM3NSBRMTUxLjMxMjUgMTE1LjU5MzggMTUxLjMxMjUgMTI5LjY1NjIgUTE1MS4zMTI1IDE0MC4wNjI1IDE0NC44NDM4IDE0Ni44MTI1IFExMzguMjM0NCAxNTMuNzAzMSAxMjYuNTYyNSAxNTYuMjM0NCBRMTM5LjIxODggMTU4Ljc2NTYgMTQ3LjA5MzggMTY2LjkyMTkgUTE1NC41NDY5IDE3NC42NTYyIDE1NC41NDY5IDE4NS45MDYyIFExNTQuNTQ2OSAyMDIuOTIxOSAxNDIuNTkzOCAyMTIuMDYyNSBRMTMwLjUgMjIxLjIwMzEgMTA4LjI4MTIgMjIxLjIwMzEgUTg1LjkyMTkgMjIxLjIwMzEgNzMuOTY4OCAyMTIuMDYyNSBRNjEuODc1IDIwMi45MjE5IDYxLjg3NSAxODUuOTA2MiBRNjEuODc1IDE3NC45Mzc1IDY5LjMyODEgMTY2LjkyMTkgUTc2LjkyMTkgMTU5LjA0NjkgOTAgMTU2LjIzNDQgWk04My4yNSAxMzEuMjAzMSBRODMuMjUgMTQwLjA2MjUgODkuODU5NCAxNDUuNDA2MiBROTYuMzI4MSAxNTAuNjA5NCAxMDguMjgxMiAxNTAuNjA5NCBRMTE5LjY3MTkgMTUwLjYwOTQgMTI2LjU2MjUgMTQ1LjQwNjIgUTEzMy4zMTI1IDE0MC4zNDM4IDEzMy4zMTI1IDEzMS4yMDMxIFExMzMuMzEyNSAxMjIuMzQzOCAxMjYuNTYyNSAxMTcgUTExOS45NTMxIDExMS43OTY5IDEwOC4yODEyIDExMS43OTY5IFE5Ni42MDk0IDExMS43OTY5IDg5Ljg1OTQgMTE3IFE4My4yNSAxMjIuMDYyNSA4My4yNSAxMzEuMjAzMSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaU5XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNzAuNTkzOCAyMTYuNTYyNSBMNzAuNTkzOCAyMDIuMDc4MSBRNzcuNDg0NCAyMDQuODkwNiA4NC41MTU2IDIwNi40Mzc1IFE5MS41NDY5IDIwNy44NDM4IDk4LjI5NjkgMjA3Ljg0MzggUTExNi40Mzc1IDIwNy44NDM4IDEyNiAxOTcuMjk2OSBRMTM1LjQyMTkgMTg2Ljc1IDEzNi44MjgxIDE2NS4wOTM4IFExMzEuOTA2MiAxNzEuNzAzMSAxMjMuNDY4OCAxNzUuNSBRMTE1LjQ1MzEgMTc5LjE1NjIgMTA1Ljc1IDE3OS4xNTYyIFE4NS41IDE3OS4xNTYyIDczLjY4NzUgMTY4LjQ2ODggUTYxLjg3NSAxNTcuNzgxMiA2MS44NzUgMTM5LjIxODggUTYxLjg3NSAxMjEuMDc4MSA3NC4xMDk0IDExMC4yNSBRODYuNDg0NCA5OS4yODEyIDEwNi44NzUgOTkuMjgxMiBRMTMwLjM1OTQgOTkuMjgxMiAxNDIuNTkzOCAxMTQuODkwNiBRMTU0Ljk2ODggMTMwLjUgMTU0Ljk2ODggMTYwLjMxMjUgUTE1NC45Njg4IDE4OC4xNTYyIDEzOS45MjE5IDIwNC42MDk0IFExMjQuNzM0NCAyMjEuMjAzMSA5OS4xNDA2IDIyMS4yMDMxIFE5Mi4yNSAyMjEuMjAzMSA4NS4yMTg4IDIyMC4wNzgxIFE3OC4xODc1IDIxOC44MTI1IDcwLjU5MzggMjE2LjU2MjUgWk0xMDYuODc1IDE2Ni43ODEyIFExMTkuMjUgMTY2Ljc4MTIgMTI2LjQyMTkgMTU5LjQ2ODggUTEzMy41OTM4IDE1Mi4xNTYyIDEzMy41OTM4IDEzOS4yMTg4IFExMzMuNTkzOCAxMjYuNTYyNSAxMjYuNDIxOSAxMTkuMjUgUTExOS4yNSAxMTEuNzk2OSAxMDYuODc1IDExMS43OTY5IFE5NC45MjE5IDExMS43OTY5IDg3LjQ2ODggMTE5LjI1IFE4MC4xNTYyIDEyNi41NjI1IDgwLjE1NjIgMTM5LjIxODggUTgwLjE1NjIgMTUyLjE1NjIgODcuNDY4OCAxNTkuNDY4OCBROTQuNjQwNiAxNjYuNzgxMiAxMDYuODc1IDE2Ni43ODEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpTEwXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTU5LjA0NjkgMTExLjc5NjkgUTE0OS4wNjI1IDExMS43OTY5IDE0Mi4wMzEyIDEyMy44OTA2IFExMzQuODU5NCAxMzUuOTg0NCAxMzQuODU5NCAxNjAuMTcxOSBRMTM0Ljg1OTQgMTg0LjUgMTQyLjAzMTIgMTk2LjU5MzggUTE0OS4wNjI1IDIwOC42ODc1IDE1OS4wNDY5IDIwOC42ODc1IFExNjkuMDMxMiAyMDguNjg3NSAxNzYuMDYyNSAxOTYuNTkzOCBRMTgzLjIzNDQgMTg0LjUgMTgzLjIzNDQgMTYwLjE3MTkgUTE4My4yMzQ0IDEzNS45ODQ0IDE3Ni4wNjI1IDEyMy44OTA2IFExNjkuMDMxMiAxMTEuNzk2OSAxNTkuMDQ2OSAxMTEuNzk2OSBaTTE1OS4wNDY5IDk5LjI4MTIgUTE3Ny40Njg4IDk5LjI4MTIgMTg5LjQyMTkgMTE0Ljg5MDYgUTIwMS4zNzUgMTMwLjUgMjAxLjM3NSAxNjAuMTcxOSBRMjAxLjM3NSAxODkuOTg0NCAxODkuNDIxOSAyMDUuNTkzOCBRMTc3LjQ2ODggMjIxLjIwMzEgMTU5LjA0NjkgMjIxLjIwMzEgUTEzNi4yNjU2IDIyMS4yMDMxIDEyNi40MjE5IDIwNS41OTM4IFExMTYuNTc4MSAxODkuOTg0NCAxMTYuNTc4MSAxNjAuMTcxOSBRMTE2LjU3ODEgMTMwLjUgMTI2LjQyMTkgMTE0Ljg5MDYgUTEzNi4yNjU2IDk5LjI4MTIgMTU5LjA0NjkgOTkuMjgxMiBaTTgwLjU3ODEgMjE5LjA5MzggTDgwLjU3ODEgMTE3LjcwMzEgTDYxLjg3NSAxMjMuNDY4OCBMNjEuODc1IDEwNy4xNTYyIEw4MS41NjI1IDEwMS42NzE5IEwxMDAuODI4MSAxMDEuNjcxOSBMMTAwLjgyODEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlSlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTg5LjE1NjIgMTAxLjY3MTkgTDEwNy4wMTU2IDEwMS42NzE5IEwxMDcuMDE1NiAxNzguNzM0NCBRMTA3LjAxNTYgMTk5LjY4NzUgOTcuODc1IDIwOS41MzEyIFE4OC44NzUgMjE5LjIzNDQgNjguNzY1NiAyMTkuMjM0NCBMNjEuODc1IDIxOS4yMzQ0IEw2MS44NzUgMjA1LjczNDQgTDY3LjUgMjA1LjczNDQgUTc5LjMxMjUgMjA1LjczNDQgODQuMjM0NCAxOTkuODI4MSBRODkuMTU2MiAxOTMuOTIxOSA4OS4xNTYyIDE3OC43MzQ0IEw4OS4xNTYyIDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpVFcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTEwNy4yOTY5IDIyMS4wNjI1IFExMDYuNzM0NCAyMjEuMDYyNSAxMDUuNTM5MSAyMjEuMTMyOCBRMTA0LjM0MzggMjIxLjIwMzEgMTAzLjY0MDYgMjIxLjIwMzEgUTgxLjQyMTkgMjIxLjIwMzEgNzAuNTIzNCAyMDYuMDg1OSBRNTkuNjI1IDE5MC45Njg4IDU5LjYyNSAxNjAuMzEyNSBRNTkuNjI1IDEyOS41MTU2IDcwLjU5MzggMTE0LjM5ODQgUTgxLjU2MjUgOTkuMjgxMiAxMDMuNzgxMiA5OS4yODEyIFExMjYuMTQwNiA5OS4yODEyIDEzNy4xMDk0IDExNC4zOTg0IFExNDguMDc4MSAxMjkuNTE1NiAxNDguMDc4MSAxNjAuMzEyNSBRMTQ4LjA3ODEgMTgzLjUxNTYgMTQyLjAzMTIgMTk3LjY0ODQgUTEzNS45ODQ0IDIxMS43ODEyIDEyMy42MDk0IDIxNy40MDYyIEwxNDEuMzI4MSAyMzIuMzEyNSBMMTI3Ljk2ODggMjQwLjE4NzUgTDEwNy4yOTY5IDIyMS4wNjI1IFpNMTI5LjM3NSAxNjAuMzEyNSBRMTI5LjM3NSAxMzQuNDM3NSAxMjMuMzk4NCAxMjMuMzI4MSBRMTE3LjQyMTkgMTEyLjIxODggMTAzLjc4MTIgMTEyLjIxODggUTkwLjI4MTIgMTEyLjIxODggODQuMzA0NyAxMjMuMzI4MSBRNzguMzI4MSAxMzQuNDM3NSA3OC4zMjgxIDE2MC4zMTI1IFE3OC4zMjgxIDE4Ni4xODc1IDg0LjMwNDcgMTk3LjI5NjkgUTkwLjI4MTIgMjA4LjQwNjIgMTAzLjc4MTIgMjA4LjQwNjIgUTExNy40MjE5IDIwOC40MDYyIDEyMy4zOTg0IDE5Ny4yOTY5IFExMjkuMzc1IDE4Ni4xODc1IDEyOS4zNzUgMTYwLjMxMjUgWk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTY0LjI2NTYgODQuNzk2OSBRNDcuMzkwNiA4NC43OTY5IDQ3LjM5MDYgMTAxLjY3MTkgTDQ3LjM5MDYgMzcwLjY4NzUgUTQ3LjM5MDYgMzg3LjU2MjUgNjQuMjY1NiAzODcuNTYyNSBMMjM1LjEyNSAzODcuNTYyNSBRMjUyIDM4Ny41NjI1IDI1MiAzNzAuNjg3NSBMMjUyIDEwMS42NzE5IFEyNTIgODQuNzk2OSAyMzUuMTI1IDg0Ljc5NjkgTDY0LjI2NTYgODQuNzk2OSBaTTY0LjI2NTYgNjcuOTIxOSBMMjM1LjEyNSA2Ny45MjE5IFEyNjguODc1IDY3LjkyMTkgMjY4Ljg3NSAxMDEuNjcxOSBMMjY4Ljg3NSAzNzAuNjg3NSBRMjY4Ljg3NSA0MDQuNDM3NSAyMzUuMTI1IDQwNC40Mzc1IEw2NC4yNjU2IDQwNC40Mzc1IFEzMC41MTU2IDQwNC40Mzc1IDMwLjUxNTYgMzcwLjY4NzUgTDMwLjUxNTYgMTAxLjY3MTkgUTMwLjUxNTYgNjcuOTIxOSA2NC4yNjU2IDY3LjkyMTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlS1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTYxLjg3NSAxMDEuNjcxOSBMNzkuNzM0NCAxMDEuNjcxOSBMNzkuNzM0NCAxNTEuMzEyNSBMMTMwLjY0MDYgMTAxLjY3MTkgTDE1My43MDMxIDEwMS42NzE5IEw5Ni40Njg4IDE1Ni41MTU2IEwxNTguMzQzOCAyMTkuMjM0NCBMMTM0Ljg1OTQgMjE5LjIzNDQgTDc5LjczNDQgMTYyLjU2MjUgTDc5LjczNDQgMjE5LjIzNDQgTDYxLjg3NSAyMTkuMjM0NCBMNjEuODc1IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpkFcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuNjcxOSAxMTUuNzM0NCBMOTEuODI4MSAxNzUuNzgxMiBMMTI5LjUxNTYgMTc1Ljc4MTIgTDExMC42NzE5IDExNS43MzQ0IFpNOTkuOTg0NCAxMDEuNjcxOSBMMTIxLjY0MDYgMTAxLjY3MTkgTDE2Mi4xNDA2IDIxOS4yMzQ0IEwxNDMuNTc4MSAyMTkuMjM0NCBMMTM0LjAxNTYgMTg4LjU3ODEgTDg3LjYwOTQgMTg4LjU3ODEgTDc4LjA0NjkgMjE5LjIzNDQgTDU5LjQ4NDQgMjE5LjIzNDQgTDk5Ljk4NDQgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmMlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTg2LjM0MzggMjAzLjA2MjUgTDE0NS45Njg4IDIwMy4wNjI1IEwxNDUuOTY4OCAyMTkuMDkzOCBMNjEuODc1IDIxOS4wOTM4IEw2MS44NzUgMjAzLjYyNSBRNjYuNjU2MiAxOTkuMjY1NiA3NS41MTU2IDE5MS4zOTA2IFExMjMuODkwNiAxNDguNSAxMjMuODkwNiAxMzUuMjgxMiBRMTIzLjg5MDYgMTI2IDExNi41NzgxIDEyMC4zMDQ3IFExMDkuMjY1NiAxMTQuNjA5NCA5Ny4zMTI1IDExNC42MDk0IFE5MCAxMTQuNjA5NCA4MS40MjE5IDExNy4wNzAzIFE3Mi44NDM4IDExOS41MzEyIDYyLjcxODggMTI0LjQ1MzEgTDYyLjcxODggMTA3LjE1NjIgUTczLjU0NjkgMTAzLjIxODggODIuODk4NCAxMDEuMjUgUTkyLjI1IDk5LjI4MTIgMTAwLjI2NTYgOTkuMjgxMiBRMTIwLjY1NjIgOTkuMjgxMiAxMzIuODkwNiAxMDguNTYyNSBRMTQ1LjEyNSAxMTcuODQzOCAxNDUuMTI1IDEzMy4wMzEyIFExNDUuMTI1IDE1Mi41NzgxIDk4LjU3ODEgMTkyLjUxNTYgUTkwLjcwMzEgMTk5LjI2NTYgODYuMzQzOCAyMDMuMDYyNSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaYzXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTIxLjc4MTIgMTU1LjUzMTIgUTEzNC43MTg4IDE1OC4wNjI1IDE0MS44MjAzIDE2NS43MjY2IFExNDguOTIxOSAxNzMuMzkwNiAxNDguOTIxOSAxODQuOTIxOSBRMTQ4LjkyMTkgMjAyLjM1OTQgMTM1LjU2MjUgMjExLjc4MTIgUTEyMi4yMDMxIDIyMS4yMDMxIDk3LjMxMjUgMjIxLjIwMzEgUTg5LjI5NjkgMjIxLjIwMzEgODAuNTA3OCAyMTkuNzI2NiBRNzEuNzE4OCAyMTguMjUgNjEuODc1IDIxNS40Mzc1IEw2MS44NzUgMTk4LjQyMTkgUTY5LjE4NzUgMjAyLjIxODggNzcuNTU0NyAyMDQuMDQ2OSBRODUuOTIxOSAyMDUuODc1IDk1LjM0MzggMjA1Ljg3NSBRMTEwLjY3MTkgMjA1Ljg3NSAxMTkuMTA5NCAyMDAuMzIwMyBRMTI3LjU0NjkgMTk0Ljc2NTYgMTI3LjU0NjkgMTg0LjkyMTkgUTEyNy41NDY5IDE3NC41MTU2IDExOS43NDIyIDE2OS4xNzE5IFExMTEuOTM3NSAxNjMuODI4MSA5Ni43NSAxNjMuODI4MSBMODQuNjU2MiAxNjMuODI4MSBMODQuNjU2MiAxNDguNjQwNiBMOTcuODc1IDE0OC42NDA2IFExMTEuMDkzOCAxNDguNjQwNiAxMTcuOTE0MSAxNDQuMjEwOSBRMTI0LjczNDQgMTM5Ljc4MTIgMTI0LjczNDQgMTMxLjM0MzggUTEyNC43MzQ0IDEyMy4xODc1IDExNy43MDMxIDExOC44OTg0IFExMTAuNjcxOSAxMTQuNjA5NCA5Ny4zMTI1IDExNC42MDk0IFE5MS42ODc1IDExNC42MDk0IDg0LjUxNTYgMTE1Ljg3NSBRNzcuMzQzOCAxMTcuMTQwNiA2NS45NTMxIDEyMC4zNzUgTDY1Ljk1MzEgMTA0LjIwMzEgUTc2LjIxODggMTAxLjgxMjUgODUuMjE4OCAxMDAuNTQ2OSBROTQuMjE4OCA5OS4yODEyIDEwMS45NTMxIDk5LjI4MTIgUTEyMi4yMDMxIDk5LjI4MTIgMTM0LjA4NTkgMTA3LjU3ODEgUTE0NS45Njg4IDExNS44NzUgMTQ1Ljk2ODggMTI5Ljc5NjkgUTE0NS45Njg4IDEzOS41IDEzOS42NDA2IDE0Ni4yNSBRMTMzLjMxMjUgMTUzIDEyMS43ODEyIDE1NS41MzEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpjRcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMjAuMDkzOCAxMTguNjg3NSBMNzYuNjQwNiAxNzcuNjA5NCBMMTIwLjA5MzggMTc3LjYwOTQgTDEyMC4wOTM4IDExOC42ODc1IFpNMTE3IDEwMS42NzE5IEwxNDAuMzQzOCAxMDEuNjcxOSBMMTQwLjM0MzggMTc3LjYwOTQgTDE1OS4zMjgxIDE3Ny42MDk0IEwxNTkuMzI4MSAxOTIuOTM3NSBMMTQwLjM0MzggMTkyLjkzNzUgTDE0MC4zNDM4IDIxOS4wOTM4IEwxMjAuMDkzOCAyMTkuMDkzOCBMMTIwLjA5MzggMTkyLjkzNzUgTDYxLjg3NSAxOTIuOTM3NSBMNjEuODc1IDE3NS45MjE5IEwxMTcgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmNVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTY3LjUgMTAxLjY3MTkgTDEzOS4yMTg4IDEwMS42NzE5IEwxMzkuMjE4OCAxMTUuMDMxMiBMODQuMjM0NCAxMTUuMDMxMiBMODQuMjM0NCAxNDMuNzE4OCBRODguMTcxOSAxNDIuNDUzMSA5Mi4yNSAxNDEuODkwNiBROTYuMTg3NSAxNDEuMzI4MSAxMDAuMTI1IDE0MS4zMjgxIFExMjIuNzY1NiAxNDEuMzI4MSAxMzUuOTg0NCAxNTIuMTU2MiBRMTQ5LjIwMzEgMTYyLjg0MzggMTQ5LjIwMzEgMTgxLjI2NTYgUTE0OS4yMDMxIDIwMC4yNSAxMzUuNTYyNSAyMTAuNzk2OSBRMTIyLjA2MjUgMjIxLjIwMzEgOTcuMzEyNSAyMjEuMjAzMSBRODguODc1IDIyMS4yMDMxIDgwLjAxNTYgMjE5LjkzNzUgUTcxLjE1NjIgMjE4LjY3MTkgNjEuODc1IDIxNi4xNDA2IEw2MS44NzUgMjAwLjI1IFE2OS44OTA2IDIwNC4wNDY5IDc4LjYwOTQgMjA2LjAxNTYgUTg3LjMyODEgMjA3Ljg0MzggOTcuMDMxMiAyMDcuODQzOCBRMTEyLjY0MDYgMjA3Ljg0MzggMTIxLjc4MTIgMjAwLjY3MTkgUTEzMC45MjE5IDE5My41IDEzMC45MjE5IDE4MS4yNjU2IFExMzAuOTIxOSAxNjkuMDMxMiAxMjEuNzgxMiAxNjEuODU5NCBRMTEyLjY0MDYgMTU0LjY4NzUgOTcuMDMxMiAxNTQuNjg3NSBRODkuNzE4OCAxNTQuNjg3NSA4Mi40MDYyIDE1Ni4wOTM4IFE3NS4wOTM4IDE1Ny41IDY3LjUgMTYwLjQ1MzEgTDY3LjUgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmNlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTExMC4xMDk0IDE1My43MDMxIFE5Ny43MzQ0IDE1My43MDMxIDkwLjU2MjUgMTYxLjAxNTYgUTgzLjM5MDYgMTY4LjQ2ODggODMuMzkwNiAxODEuMjY1NiBRODMuMzkwNiAxOTMuOTIxOSA5MC41NjI1IDIwMS4yMzQ0IFE5Ny43MzQ0IDIwOC42ODc1IDExMC4xMDk0IDIwOC42ODc1IFExMjIuMzQzOCAyMDguNjg3NSAxMjkuNTE1NiAyMDEuMjM0NCBRMTM2LjY4NzUgMTkzLjkyMTkgMTM2LjY4NzUgMTgxLjI2NTYgUTEzNi42ODc1IDE2OC40Njg4IDEyOS41MTU2IDE2MS4wMTU2IFExMjIuMzQzOCAxNTMuNzAzMSAxMTAuMTA5NCAxNTMuNzAzMSBaTTE0Ni4zOTA2IDEwMy45MjE5IEwxNDYuMzkwNiAxMTguNDA2MiBRMTM5LjUgMTE1LjU5MzggMTMyLjQ2ODggMTE0LjE4NzUgUTEyNS40Mzc1IDExMi42NDA2IDExOC41NDY5IDExMi42NDA2IFExMDAuNTQ2OSAxMTIuNjQwNiA5MC45ODQ0IDEyMy4xODc1IFE4MS40MjE5IDEzMy44NzUgODAuMDE1NiAxNTUuMzkwNiBRODUuMzU5NCAxNDguNSA5My4zNzUgMTQ0Ljg0MzggUTEwMS41MzEyIDE0MS4xODc1IDExMS4wOTM4IDE0MS4xODc1IFExMzEuNDg0NCAxNDEuMTg3NSAxNDMuMjk2OSAxNTEuODc1IFExNTUuMTA5NCAxNjIuNzAzMSAxNTUuMTA5NCAxODEuMjY1NiBRMTU1LjEwOTQgMTk5LjEyNSAxNDIuNzM0NCAyMTAuMjM0NCBRMTMwLjUgMjIxLjIwMzEgMTEwLjEwOTQgMjIxLjIwMzEgUTg2LjYyNSAyMjEuMjAzMSA3NC4yNSAyMDUuNTkzOCBRNjEuODc1IDE4OS45ODQ0IDYxLjg3NSAxNjAuMTcxOSBRNjEuODc1IDEzMi4zMjgxIDc3LjA2MjUgMTE1Ljg3NSBROTIuMjUgOTkuMjgxMiAxMTcuODQzOCA5OS4yODEyIFExMjQuNzM0NCA5OS4yODEyIDEzMS43NjU2IDEwMC40MDYyIFExMzguNzk2OSAxMDEuNjcxOSAxNDYuMzkwNiAxMDMuOTIxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaY3XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjEuODc1IDEwMS42NzE5IEwxNDguNjQwNiAxMDEuNjcxOSBMMTQ4LjY0MDYgMTA4LjQyMTkgTDk5LjcwMzEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggTDEyNi43MDMxIDExNS4wMzEyIEw2MS44NzUgMTE1LjAzMTIgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaY4XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTA4LjI4MTIgMTYzLjEyNSBROTUuMjAzMSAxNjMuMTI1IDg3Ljc1IDE2OS4zMTI1IFE4MC4yOTY5IDE3NS4zNTk0IDgwLjI5NjkgMTg1LjkwNjIgUTgwLjI5NjkgMTk2LjU5MzggODcuNzUgMjAyLjY0MDYgUTk1LjIwMzEgMjA4LjY4NzUgMTA4LjI4MTIgMjA4LjY4NzUgUTEyMS4yMTg4IDIwOC42ODc1IDEyOC44MTI1IDIwMi41IFExMzYuMjY1NiAxOTYuNDUzMSAxMzYuMjY1NiAxODUuOTA2MiBRMTM2LjI2NTYgMTc1LjM1OTQgMTI4LjgxMjUgMTY5LjMxMjUgUTEyMS4zNTk0IDE2My4xMjUgMTA4LjI4MTIgMTYzLjEyNSBaTTkwIDE1Ni4yMzQ0IFE3OC4xODc1IDE1My43MDMxIDcxLjcxODggMTQ2LjgxMjUgUTY1LjEwOTQgMTM5Ljc4MTIgNjUuMTA5NCAxMjkuNjU2MiBRNjUuMTA5NCAxMTUuNTkzOCA3Ni42NDA2IDEwNy40Mzc1IFE4OC4xNzE5IDk5LjI4MTIgMTA4LjI4MTIgOTkuMjgxMiBRMTI4LjM5MDYgOTkuMjgxMiAxMzkuOTIxOSAxMDcuNDM3NSBRMTUxLjMxMjUgMTE1LjU5MzggMTUxLjMxMjUgMTI5LjY1NjIgUTE1MS4zMTI1IDE0MC4wNjI1IDE0NC44NDM4IDE0Ni44MTI1IFExMzguMjM0NCAxNTMuNzAzMSAxMjYuNTYyNSAxNTYuMjM0NCBRMTM5LjIxODggMTU4Ljc2NTYgMTQ3LjA5MzggMTY2LjkyMTkgUTE1NC41NDY5IDE3NC42NTYyIDE1NC41NDY5IDE4NS45MDYyIFExNTQuNTQ2OSAyMDIuOTIxOSAxNDIuNTkzOCAyMTIuMDYyNSBRMTMwLjUgMjIxLjIwMzEgMTA4LjI4MTIgMjIxLjIwMzEgUTg1LjkyMTkgMjIxLjIwMzEgNzMuOTY4OCAyMTIuMDYyNSBRNjEuODc1IDIwMi45MjE5IDYxLjg3NSAxODUuOTA2MiBRNjEuODc1IDE3NC45Mzc1IDY5LjMyODEgMTY2LjkyMTkgUTc2LjkyMTkgMTU5LjA0NjkgOTAgMTU2LjIzNDQgWk04My4yNSAxMzEuMjAzMSBRODMuMjUgMTQwLjA2MjUgODkuODU5NCAxNDUuNDA2MiBROTYuMzI4MSAxNTAuNjA5NCAxMDguMjgxMiAxNTAuNjA5NCBRMTE5LjY3MTkgMTUwLjYwOTQgMTI2LjU2MjUgMTQ1LjQwNjIgUTEzMy4zMTI1IDE0MC4zNDM4IDEzMy4zMTI1IDEzMS4yMDMxIFExMzMuMzEyNSAxMjIuMzQzOCAxMjYuNTYyNSAxMTcgUTExOS45NTMxIDExMS43OTY5IDEwOC4yODEyIDExMS43OTY5IFE5Ni42MDk0IDExMS43OTY5IDg5Ljg1OTQgMTE3IFE4My4yNSAxMjIuMDYyNSA4My4yNSAxMzEuMjAzMSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaY5XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNzAuNTkzOCAyMTYuNTYyNSBMNzAuNTkzOCAyMDIuMDc4MSBRNzcuNDg0NCAyMDQuODkwNiA4NC41MTU2IDIwNi40Mzc1IFE5MS41NDY5IDIwNy44NDM4IDk4LjI5NjkgMjA3Ljg0MzggUTExNi40Mzc1IDIwNy44NDM4IDEyNiAxOTcuMjk2OSBRMTM1LjQyMTkgMTg2Ljc1IDEzNi44MjgxIDE2NS4wOTM4IFExMzEuOTA2MiAxNzEuNzAzMSAxMjMuNDY4OCAxNzUuNSBRMTE1LjQ1MzEgMTc5LjE1NjIgMTA1Ljc1IDE3OS4xNTYyIFE4NS41IDE3OS4xNTYyIDczLjY4NzUgMTY4LjQ2ODggUTYxLjg3NSAxNTcuNzgxMiA2MS44NzUgMTM5LjIxODggUTYxLjg3NSAxMjEuMDc4MSA3NC4xMDk0IDExMC4yNSBRODYuNDg0NCA5OS4yODEyIDEwNi44NzUgOTkuMjgxMiBRMTMwLjM1OTQgOTkuMjgxMiAxNDIuNTkzOCAxMTQuODkwNiBRMTU0Ljk2ODggMTMwLjUgMTU0Ljk2ODggMTYwLjMxMjUgUTE1NC45Njg4IDE4OC4xNTYyIDEzOS45MjE5IDIwNC42MDk0IFExMjQuNzM0NCAyMjEuMjAzMSA5OS4xNDA2IDIyMS4yMDMxIFE5Mi4yNSAyMjEuMjAzMSA4NS4yMTg4IDIyMC4wNzgxIFE3OC4xODc1IDIxOC44MTI1IDcwLjU5MzggMjE2LjU2MjUgWk0xMDYuODc1IDE2Ni43ODEyIFExMTkuMjUgMTY2Ljc4MTIgMTI2LjQyMTkgMTU5LjQ2ODggUTEzMy41OTM4IDE1Mi4xNTYyIDEzMy41OTM4IDEzOS4yMTg4IFExMzMuNTkzOCAxMjYuNTYyNSAxMjYuNDIxOSAxMTkuMjUgUTExOS4yNSAxMTEuNzk2OSAxMDYuODc1IDExMS43OTY5IFE5NC45MjE5IDExMS43OTY5IDg3LjQ2ODggMTE5LjI1IFE4MC4xNTYyIDEyNi41NjI1IDgwLjE1NjIgMTM5LjIxODggUTgwLjE1NjIgMTUyLjE1NjIgODcuNDY4OCAxNTkuNDY4OCBROTQuNjQwNiAxNjYuNzgxMiAxMDYuODc1IDE2Ni43ODEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpjEwXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTU5LjA0NjkgMTExLjc5NjkgUTE0OS4wNjI1IDExMS43OTY5IDE0Mi4wMzEyIDEyMy44OTA2IFExMzQuODU5NCAxMzUuOTg0NCAxMzQuODU5NCAxNjAuMTcxOSBRMTM0Ljg1OTQgMTg0LjUgMTQyLjAzMTIgMTk2LjU5MzggUTE0OS4wNjI1IDIwOC42ODc1IDE1OS4wNDY5IDIwOC42ODc1IFExNjkuMDMxMiAyMDguNjg3NSAxNzYuMDYyNSAxOTYuNTkzOCBRMTgzLjIzNDQgMTg0LjUgMTgzLjIzNDQgMTYwLjE3MTkgUTE4My4yMzQ0IDEzNS45ODQ0IDE3Ni4wNjI1IDEyMy44OTA2IFExNjkuMDMxMiAxMTEuNzk2OSAxNTkuMDQ2OSAxMTEuNzk2OSBaTTE1OS4wNDY5IDk5LjI4MTIgUTE3Ny40Njg4IDk5LjI4MTIgMTg5LjQyMTkgMTE0Ljg5MDYgUTIwMS4zNzUgMTMwLjUgMjAxLjM3NSAxNjAuMTcxOSBRMjAxLjM3NSAxODkuOTg0NCAxODkuNDIxOSAyMDUuNTkzOCBRMTc3LjQ2ODggMjIxLjIwMzEgMTU5LjA0NjkgMjIxLjIwMzEgUTEzNi4yNjU2IDIyMS4yMDMxIDEyNi40MjE5IDIwNS41OTM4IFExMTYuNTc4MSAxODkuOTg0NCAxMTYuNTc4MSAxNjAuMTcxOSBRMTE2LjU3ODEgMTMwLjUgMTI2LjQyMTkgMTE0Ljg5MDYgUTEzNi4yNjU2IDk5LjI4MTIgMTU5LjA0NjkgOTkuMjgxMiBaTTgwLjU3ODEgMjE5LjA5MzggTDgwLjU3ODEgMTE3LjcwMzEgTDYxLjg3NSAxMjMuNDY4OCBMNjEuODc1IDEwNy4xNTYyIEw4MS41NjI1IDEwMS42NzE5IEwxMDAuODI4MSAxMDEuNjcxOSBMMTAwLjgyODEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmSlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTg5LjE1NjIgMTAxLjY3MTkgTDEwNy4wMTU2IDEwMS42NzE5IEwxMDcuMDE1NiAxNzguNzM0NCBRMTA3LjAxNTYgMTk5LjY4NzUgOTcuODc1IDIwOS41MzEyIFE4OC44NzUgMjE5LjIzNDQgNjguNzY1NiAyMTkuMjM0NCBMNjEuODc1IDIxOS4yMzQ0IEw2MS44NzUgMjA1LjczNDQgTDY3LjUgMjA1LjczNDQgUTc5LjMxMjUgMjA1LjczNDQgODQuMjM0NCAxOTkuODI4MSBRODkuMTU2MiAxOTMuOTIxOSA4OS4xNTYyIDE3OC43MzQ0IEw4OS4xNTYyIDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZplFcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNMTA3LjI5NjkgMjIxLjA2MjUgUTEwNi43MzQ0IDIyMS4wNjI1IDEwNS41MzkxIDIyMS4xMzI4IFExMDQuMzQzOCAyMjEuMjAzMSAxMDMuNjQwNiAyMjEuMjAzMSBRODEuNDIxOSAyMjEuMjAzMSA3MC41MjM0IDIwNi4wODU5IFE1OS42MjUgMTkwLjk2ODggNTkuNjI1IDE2MC4zMTI1IFE1OS42MjUgMTI5LjUxNTYgNzAuNTkzOCAxMTQuMzk4NCBRODEuNTYyNSA5OS4yODEyIDEwMy43ODEyIDk5LjI4MTIgUTEyNi4xNDA2IDk5LjI4MTIgMTM3LjEwOTQgMTE0LjM5ODQgUTE0OC4wNzgxIDEyOS41MTU2IDE0OC4wNzgxIDE2MC4zMTI1IFExNDguMDc4MSAxODMuNTE1NiAxNDIuMDMxMiAxOTcuNjQ4NCBRMTM1Ljk4NDQgMjExLjc4MTIgMTIzLjYwOTQgMjE3LjQwNjIgTDE0MS4zMjgxIDIzMi4zMTI1IEwxMjcuOTY4OCAyNDAuMTg3NSBMMTA3LjI5NjkgMjIxLjA2MjUgWk0xMjkuMzc1IDE2MC4zMTI1IFExMjkuMzc1IDEzNC40Mzc1IDEyMy4zOTg0IDEyMy4zMjgxIFExMTcuNDIxOSAxMTIuMjE4OCAxMDMuNzgxMiAxMTIuMjE4OCBROTAuMjgxMiAxMTIuMjE4OCA4NC4zMDQ3IDEyMy4zMjgxIFE3OC4zMjgxIDEzNC40Mzc1IDc4LjMyODEgMTYwLjMxMjUgUTc4LjMyODEgMTg2LjE4NzUgODQuMzA0NyAxOTcuMjk2OSBROTAuMjgxMiAyMDguNDA2MiAxMDMuNzgxMiAyMDguNDA2MiBRMTE3LjQyMTkgMjA4LjQwNjIgMTIzLjM5ODQgMTk3LjI5NjkgUTEyOS4zNzUgMTg2LjE4NzUgMTI5LjM3NSAxNjAuMzEyNSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpktcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02MS44NzUgMTAxLjY3MTkgTDc5LjczNDQgMTAxLjY3MTkgTDc5LjczNDQgMTUxLjMxMjUgTDEzMC42NDA2IDEwMS42NzE5IEwxNTMuNzAzMSAxMDEuNjcxOSBMOTYuNDY4OCAxNTYuNTE1NiBMMTU4LjM0MzggMjE5LjIzNDQgTDEzNC44NTk0IDIxOS4yMzQ0IEw3OS43MzQ0IDE2Mi41NjI1IEw3OS43MzQ0IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaNBXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuNjcxOSAxMTUuNzM0NCBMOTEuODI4MSAxNzUuNzgxMiBMMTI5LjUxNTYgMTc1Ljc4MTIgTDExMC42NzE5IDExNS43MzQ0IFpNOTkuOTg0NCAxMDEuNjcxOSBMMTIxLjY0MDYgMTAxLjY3MTkgTDE2Mi4xNDA2IDIxOS4yMzQ0IEwxNDMuNTc4MSAyMTkuMjM0NCBMMTM0LjAxNTYgMTg4LjU3ODEgTDg3LjYwOTQgMTg4LjU3ODEgTDc4LjA0NjkgMjE5LjIzNDQgTDU5LjQ4NDQgMjE5LjIzNDQgTDk5Ljk4NDQgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjMlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODYuMzQzOCAyMDMuMDYyNSBMMTQ1Ljk2ODggMjAzLjA2MjUgTDE0NS45Njg4IDIxOS4wOTM4IEw2MS44NzUgMjE5LjA5MzggTDYxLjg3NSAyMDMuNjI1IFE2Ni42NTYyIDE5OS4yNjU2IDc1LjUxNTYgMTkxLjM5MDYgUTEyMy44OTA2IDE0OC41IDEyMy44OTA2IDEzNS4yODEyIFExMjMuODkwNiAxMjYgMTE2LjU3ODEgMTIwLjMwNDcgUTEwOS4yNjU2IDExNC42MDk0IDk3LjMxMjUgMTE0LjYwOTQgUTkwIDExNC42MDk0IDgxLjQyMTkgMTE3LjA3MDMgUTcyLjg0MzggMTE5LjUzMTIgNjIuNzE4OCAxMjQuNDUzMSBMNjIuNzE4OCAxMDcuMTU2MiBRNzMuNTQ2OSAxMDMuMjE4OCA4Mi44OTg0IDEwMS4yNSBROTIuMjUgOTkuMjgxMiAxMDAuMjY1NiA5OS4yODEyIFExMjAuNjU2MiA5OS4yODEyIDEzMi44OTA2IDEwOC41NjI1IFExNDUuMTI1IDExNy44NDM4IDE0NS4xMjUgMTMzLjAzMTIgUTE0NS4xMjUgMTUyLjU3ODEgOTguNTc4MSAxOTIuNTE1NiBROTAuNzAzMSAxOTkuMjY1NiA4Ni4zNDM4IDIwMy4wNjI1IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZozNcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEyMS43ODEyIDE1NS41MzEyIFExMzQuNzE4OCAxNTguMDYyNSAxNDEuODIwMyAxNjUuNzI2NiBRMTQ4LjkyMTkgMTczLjM5MDYgMTQ4LjkyMTkgMTg0LjkyMTkgUTE0OC45MjE5IDIwMi4zNTk0IDEzNS41NjI1IDIxMS43ODEyIFExMjIuMjAzMSAyMjEuMjAzMSA5Ny4zMTI1IDIyMS4yMDMxIFE4OS4yOTY5IDIyMS4yMDMxIDgwLjUwNzggMjE5LjcyNjYgUTcxLjcxODggMjE4LjI1IDYxLjg3NSAyMTUuNDM3NSBMNjEuODc1IDE5OC40MjE5IFE2OS4xODc1IDIwMi4yMTg4IDc3LjU1NDcgMjA0LjA0NjkgUTg1LjkyMTkgMjA1Ljg3NSA5NS4zNDM4IDIwNS44NzUgUTExMC42NzE5IDIwNS44NzUgMTE5LjEwOTQgMjAwLjMyMDMgUTEyNy41NDY5IDE5NC43NjU2IDEyNy41NDY5IDE4NC45MjE5IFExMjcuNTQ2OSAxNzQuNTE1NiAxMTkuNzQyMiAxNjkuMTcxOSBRMTExLjkzNzUgMTYzLjgyODEgOTYuNzUgMTYzLjgyODEgTDg0LjY1NjIgMTYzLjgyODEgTDg0LjY1NjIgMTQ4LjY0MDYgTDk3Ljg3NSAxNDguNjQwNiBRMTExLjA5MzggMTQ4LjY0MDYgMTE3LjkxNDEgMTQ0LjIxMDkgUTEyNC43MzQ0IDEzOS43ODEyIDEyNC43MzQ0IDEzMS4zNDM4IFExMjQuNzM0NCAxMjMuMTg3NSAxMTcuNzAzMSAxMTguODk4NCBRMTEwLjY3MTkgMTE0LjYwOTQgOTcuMzEyNSAxMTQuNjA5NCBROTEuNjg3NSAxMTQuNjA5NCA4NC41MTU2IDExNS44NzUgUTc3LjM0MzggMTE3LjE0MDYgNjUuOTUzMSAxMjAuMzc1IEw2NS45NTMxIDEwNC4yMDMxIFE3Ni4yMTg4IDEwMS44MTI1IDg1LjIxODggMTAwLjU0NjkgUTk0LjIxODggOTkuMjgxMiAxMDEuOTUzMSA5OS4yODEyIFExMjIuMjAzMSA5OS4yODEyIDEzNC4wODU5IDEwNy41NzgxIFExNDUuOTY4OCAxMTUuODc1IDE0NS45Njg4IDEyOS43OTY5IFExNDUuOTY4OCAxMzkuNSAxMzkuNjQwNiAxNDYuMjUgUTEzMy4zMTI1IDE1MyAxMjEuNzgxMiAxNTUuNTMxMiBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaM0XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMjAuMDkzOCAxMTguNjg3NSBMNzYuNjQwNiAxNzcuNjA5NCBMMTIwLjA5MzggMTc3LjYwOTQgTDEyMC4wOTM4IDExOC42ODc1IFpNMTE3IDEwMS42NzE5IEwxNDAuMzQzOCAxMDEuNjcxOSBMMTQwLjM0MzggMTc3LjYwOTQgTDE1OS4zMjgxIDE3Ny42MDk0IEwxNTkuMzI4MSAxOTIuOTM3NSBMMTQwLjM0MzggMTkyLjkzNzUgTDE0MC4zNDM4IDIxOS4wOTM4IEwxMjAuMDkzOCAyMTkuMDkzOCBMMTIwLjA5MzggMTkyLjkzNzUgTDYxLjg3NSAxOTIuOTM3NSBMNjEuODc1IDE3NS45MjE5IEwxMTcgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjNVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjcuNSAxMDEuNjcxOSBMMTM5LjIxODggMTAxLjY3MTkgTDEzOS4yMTg4IDExNS4wMzEyIEw4NC4yMzQ0IDExNS4wMzEyIEw4NC4yMzQ0IDE0My43MTg4IFE4OC4xNzE5IDE0Mi40NTMxIDkyLjI1IDE0MS44OTA2IFE5Ni4xODc1IDE0MS4zMjgxIDEwMC4xMjUgMTQxLjMyODEgUTEyMi43NjU2IDE0MS4zMjgxIDEzNS45ODQ0IDE1Mi4xNTYyIFExNDkuMjAzMSAxNjIuODQzOCAxNDkuMjAzMSAxODEuMjY1NiBRMTQ5LjIwMzEgMjAwLjI1IDEzNS41NjI1IDIxMC43OTY5IFExMjIuMDYyNSAyMjEuMjAzMSA5Ny4zMTI1IDIyMS4yMDMxIFE4OC44NzUgMjIxLjIwMzEgODAuMDE1NiAyMTkuOTM3NSBRNzEuMTU2MiAyMTguNjcxOSA2MS44NzUgMjE2LjE0MDYgTDYxLjg3NSAyMDAuMjUgUTY5Ljg5MDYgMjA0LjA0NjkgNzguNjA5NCAyMDYuMDE1NiBRODcuMzI4MSAyMDcuODQzOCA5Ny4wMzEyIDIwNy44NDM4IFExMTIuNjQwNiAyMDcuODQzOCAxMjEuNzgxMiAyMDAuNjcxOSBRMTMwLjkyMTkgMTkzLjUgMTMwLjkyMTkgMTgxLjI2NTYgUTEzMC45MjE5IDE2OS4wMzEyIDEyMS43ODEyIDE2MS44NTk0IFExMTIuNjQwNiAxNTQuNjg3NSA5Ny4wMzEyIDE1NC42ODc1IFE4OS43MTg4IDE1NC42ODc1IDgyLjQwNjIgMTU2LjA5MzggUTc1LjA5MzggMTU3LjUgNjcuNSAxNjAuNDUzMSBMNjcuNSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaM2XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuMTA5NCAxNTMuNzAzMSBROTcuNzM0NCAxNTMuNzAzMSA5MC41NjI1IDE2MS4wMTU2IFE4My4zOTA2IDE2OC40Njg4IDgzLjM5MDYgMTgxLjI2NTYgUTgzLjM5MDYgMTkzLjkyMTkgOTAuNTYyNSAyMDEuMjM0NCBROTcuNzM0NCAyMDguNjg3NSAxMTAuMTA5NCAyMDguNjg3NSBRMTIyLjM0MzggMjA4LjY4NzUgMTI5LjUxNTYgMjAxLjIzNDQgUTEzNi42ODc1IDE5My45MjE5IDEzNi42ODc1IDE4MS4yNjU2IFExMzYuNjg3NSAxNjguNDY4OCAxMjkuNTE1NiAxNjEuMDE1NiBRMTIyLjM0MzggMTUzLjcwMzEgMTEwLjEwOTQgMTUzLjcwMzEgWk0xNDYuMzkwNiAxMDMuOTIxOSBMMTQ2LjM5MDYgMTE4LjQwNjIgUTEzOS41IDExNS41OTM4IDEzMi40Njg4IDExNC4xODc1IFExMjUuNDM3NSAxMTIuNjQwNiAxMTguNTQ2OSAxMTIuNjQwNiBRMTAwLjU0NjkgMTEyLjY0MDYgOTAuOTg0NCAxMjMuMTg3NSBRODEuNDIxOSAxMzMuODc1IDgwLjAxNTYgMTU1LjM5MDYgUTg1LjM1OTQgMTQ4LjUgOTMuMzc1IDE0NC44NDM4IFExMDEuNTMxMiAxNDEuMTg3NSAxMTEuMDkzOCAxNDEuMTg3NSBRMTMxLjQ4NDQgMTQxLjE4NzUgMTQzLjI5NjkgMTUxLjg3NSBRMTU1LjEwOTQgMTYyLjcwMzEgMTU1LjEwOTQgMTgxLjI2NTYgUTE1NS4xMDk0IDE5OS4xMjUgMTQyLjczNDQgMjEwLjIzNDQgUTEzMC41IDIyMS4yMDMxIDExMC4xMDk0IDIyMS4yMDMxIFE4Ni42MjUgMjIxLjIwMzEgNzQuMjUgMjA1LjU5MzggUTYxLjg3NSAxODkuOTg0NCA2MS44NzUgMTYwLjE3MTkgUTYxLjg3NSAxMzIuMzI4MSA3Ny4wNjI1IDExNS44NzUgUTkyLjI1IDk5LjI4MTIgMTE3Ljg0MzggOTkuMjgxMiBRMTI0LjczNDQgOTkuMjgxMiAxMzEuNzY1NiAxMDAuNDA2MiBRMTM4Ljc5NjkgMTAxLjY3MTkgMTQ2LjM5MDYgMTAzLjkyMTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjN1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjEuODc1IDEwMS42NzE5IEwxNDguNjQwNiAxMDEuNjcxOSBMMTQ4LjY0MDYgMTA4LjQyMTkgTDk5LjcwMzEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggTDEyNi43MDMxIDExNS4wMzEyIEw2MS44NzUgMTE1LjAzMTIgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaM4XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMDguMjgxMiAxNjMuMTI1IFE5NS4yMDMxIDE2My4xMjUgODcuNzUgMTY5LjMxMjUgUTgwLjI5NjkgMTc1LjM1OTQgODAuMjk2OSAxODUuOTA2MiBRODAuMjk2OSAxOTYuNTkzOCA4Ny43NSAyMDIuNjQwNiBROTUuMjAzMSAyMDguNjg3NSAxMDguMjgxMiAyMDguNjg3NSBRMTIxLjIxODggMjA4LjY4NzUgMTI4LjgxMjUgMjAyLjUgUTEzNi4yNjU2IDE5Ni40NTMxIDEzNi4yNjU2IDE4NS45MDYyIFExMzYuMjY1NiAxNzUuMzU5NCAxMjguODEyNSAxNjkuMzEyNSBRMTIxLjM1OTQgMTYzLjEyNSAxMDguMjgxMiAxNjMuMTI1IFpNOTAgMTU2LjIzNDQgUTc4LjE4NzUgMTUzLjcwMzEgNzEuNzE4OCAxNDYuODEyNSBRNjUuMTA5NCAxMzkuNzgxMiA2NS4xMDk0IDEyOS42NTYyIFE2NS4xMDk0IDExNS41OTM4IDc2LjY0MDYgMTA3LjQzNzUgUTg4LjE3MTkgOTkuMjgxMiAxMDguMjgxMiA5OS4yODEyIFExMjguMzkwNiA5OS4yODEyIDEzOS45MjE5IDEwNy40Mzc1IFExNTEuMzEyNSAxMTUuNTkzOCAxNTEuMzEyNSAxMjkuNjU2MiBRMTUxLjMxMjUgMTQwLjA2MjUgMTQ0Ljg0MzggMTQ2LjgxMjUgUTEzOC4yMzQ0IDE1My43MDMxIDEyNi41NjI1IDE1Ni4yMzQ0IFExMzkuMjE4OCAxNTguNzY1NiAxNDcuMDkzOCAxNjYuOTIxOSBRMTU0LjU0NjkgMTc0LjY1NjIgMTU0LjU0NjkgMTg1LjkwNjIgUTE1NC41NDY5IDIwMi45MjE5IDE0Mi41OTM4IDIxMi4wNjI1IFExMzAuNSAyMjEuMjAzMSAxMDguMjgxMiAyMjEuMjAzMSBRODUuOTIxOSAyMjEuMjAzMSA3My45Njg4IDIxMi4wNjI1IFE2MS44NzUgMjAyLjkyMTkgNjEuODc1IDE4NS45MDYyIFE2MS44NzUgMTc0LjkzNzUgNjkuMzI4MSAxNjYuOTIxOSBRNzYuOTIxOSAxNTkuMDQ2OSA5MCAxNTYuMjM0NCBaTTgzLjI1IDEzMS4yMDMxIFE4My4yNSAxNDAuMDYyNSA4OS44NTk0IDE0NS40MDYyIFE5Ni4zMjgxIDE1MC42MDk0IDEwOC4yODEyIDE1MC42MDk0IFExMTkuNjcxOSAxNTAuNjA5NCAxMjYuNTYyNSAxNDUuNDA2MiBRMTMzLjMxMjUgMTQwLjM0MzggMTMzLjMxMjUgMTMxLjIwMzEgUTEzMy4zMTI1IDEyMi4zNDM4IDEyNi41NjI1IDExNyBRMTE5Ljk1MzEgMTExLjc5NjkgMTA4LjI4MTIgMTExLjc5NjkgUTk2LjYwOTQgMTExLjc5NjkgODkuODU5NCAxMTcgUTgzLjI1IDEyMi4wNjI1IDgzLjI1IDEzMS4yMDMxIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZozlcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTcwLjU5MzggMjE2LjU2MjUgTDcwLjU5MzggMjAyLjA3ODEgUTc3LjQ4NDQgMjA0Ljg5MDYgODQuNTE1NiAyMDYuNDM3NSBROTEuNTQ2OSAyMDcuODQzOCA5OC4yOTY5IDIwNy44NDM4IFExMTYuNDM3NSAyMDcuODQzOCAxMjYgMTk3LjI5NjkgUTEzNS40MjE5IDE4Ni43NSAxMzYuODI4MSAxNjUuMDkzOCBRMTMxLjkwNjIgMTcxLjcwMzEgMTIzLjQ2ODggMTc1LjUgUTExNS40NTMxIDE3OS4xNTYyIDEwNS43NSAxNzkuMTU2MiBRODUuNSAxNzkuMTU2MiA3My42ODc1IDE2OC40Njg4IFE2MS44NzUgMTU3Ljc4MTIgNjEuODc1IDEzOS4yMTg4IFE2MS44NzUgMTIxLjA3ODEgNzQuMTA5NCAxMTAuMjUgUTg2LjQ4NDQgOTkuMjgxMiAxMDYuODc1IDk5LjI4MTIgUTEzMC4zNTk0IDk5LjI4MTIgMTQyLjU5MzggMTE0Ljg5MDYgUTE1NC45Njg4IDEzMC41IDE1NC45Njg4IDE2MC4zMTI1IFExNTQuOTY4OCAxODguMTU2MiAxMzkuOTIxOSAyMDQuNjA5NCBRMTI0LjczNDQgMjIxLjIwMzEgOTkuMTQwNiAyMjEuMjAzMSBROTIuMjUgMjIxLjIwMzEgODUuMjE4OCAyMjAuMDc4MSBRNzguMTg3NSAyMTguODEyNSA3MC41OTM4IDIxNi41NjI1IFpNMTA2Ljg3NSAxNjYuNzgxMiBRMTE5LjI1IDE2Ni43ODEyIDEyNi40MjE5IDE1OS40Njg4IFExMzMuNTkzOCAxNTIuMTU2MiAxMzMuNTkzOCAxMzkuMjE4OCBRMTMzLjU5MzggMTI2LjU2MjUgMTI2LjQyMTkgMTE5LjI1IFExMTkuMjUgMTExLjc5NjkgMTA2Ljg3NSAxMTEuNzk2OSBROTQuOTIxOSAxMTEuNzk2OSA4Ny40Njg4IDExOS4yNSBRODAuMTU2MiAxMjYuNTYyNSA4MC4xNTYyIDEzOS4yMTg4IFE4MC4xNTYyIDE1Mi4xNTYyIDg3LjQ2ODggMTU5LjQ2ODggUTk0LjY0MDYgMTY2Ljc4MTIgMTA2Ljg3NSAxNjYuNzgxMiBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaMxMFxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTU5LjA0NjkgMTExLjc5NjkgUTE0OS4wNjI1IDExMS43OTY5IDE0Mi4wMzEyIDEyMy44OTA2IFExMzQuODU5NCAxMzUuOTg0NCAxMzQuODU5NCAxNjAuMTcxOSBRMTM0Ljg1OTQgMTg0LjUgMTQyLjAzMTIgMTk2LjU5MzggUTE0OS4wNjI1IDIwOC42ODc1IDE1OS4wNDY5IDIwOC42ODc1IFExNjkuMDMxMiAyMDguNjg3NSAxNzYuMDYyNSAxOTYuNTkzOCBRMTgzLjIzNDQgMTg0LjUgMTgzLjIzNDQgMTYwLjE3MTkgUTE4My4yMzQ0IDEzNS45ODQ0IDE3Ni4wNjI1IDEyMy44OTA2IFExNjkuMDMxMiAxMTEuNzk2OSAxNTkuMDQ2OSAxMTEuNzk2OSBaTTE1OS4wNDY5IDk5LjI4MTIgUTE3Ny40Njg4IDk5LjI4MTIgMTg5LjQyMTkgMTE0Ljg5MDYgUTIwMS4zNzUgMTMwLjUgMjAxLjM3NSAxNjAuMTcxOSBRMjAxLjM3NSAxODkuOTg0NCAxODkuNDIxOSAyMDUuNTkzOCBRMTc3LjQ2ODggMjIxLjIwMzEgMTU5LjA0NjkgMjIxLjIwMzEgUTEzNi4yNjU2IDIyMS4yMDMxIDEyNi40MjE5IDIwNS41OTM4IFExMTYuNTc4MSAxODkuOTg0NCAxMTYuNTc4MSAxNjAuMTcxOSBRMTE2LjU3ODEgMTMwLjUgMTI2LjQyMTkgMTE0Ljg5MDYgUTEzNi4yNjU2IDk5LjI4MTIgMTU5LjA0NjkgOTkuMjgxMiBaTTgwLjU3ODEgMjE5LjA5MzggTDgwLjU3ODEgMTE3LjcwMzEgTDYxLjg3NSAxMjMuNDY4OCBMNjEuODc1IDEwNy4xNTYyIEw4MS41NjI1IDEwMS42NzE5IEwxMDAuODI4MSAxMDEuNjcxOSBMMTAwLjgyODEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjSlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODkuMTU2MiAxMDEuNjcxOSBMMTA3LjAxNTYgMTAxLjY3MTkgTDEwNy4wMTU2IDE3OC43MzQ0IFExMDcuMDE1NiAxOTkuNjg3NSA5Ny44NzUgMjA5LjUzMTIgUTg4Ljg3NSAyMTkuMjM0NCA2OC43NjU2IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAyMDUuNzM0NCBMNjcuNSAyMDUuNzM0NCBRNzkuMzEyNSAyMDUuNzM0NCA4NC4yMzQ0IDE5OS44MjgxIFE4OS4xNTYyIDE5My45MjE5IDg5LjE1NjIgMTc4LjczNDQgTDg5LjE1NjIgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjUVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTA3LjI5NjkgMjIxLjA2MjUgUTEwNi43MzQ0IDIyMS4wNjI1IDEwNS41MzkxIDIyMS4xMzI4IFExMDQuMzQzOCAyMjEuMjAzMSAxMDMuNjQwNiAyMjEuMjAzMSBRODEuNDIxOSAyMjEuMjAzMSA3MC41MjM0IDIwNi4wODU5IFE1OS42MjUgMTkwLjk2ODggNTkuNjI1IDE2MC4zMTI1IFE1OS42MjUgMTI5LjUxNTYgNzAuNTkzOCAxMTQuMzk4NCBRODEuNTYyNSA5OS4yODEyIDEwMy43ODEyIDk5LjI4MTIgUTEyNi4xNDA2IDk5LjI4MTIgMTM3LjEwOTQgMTE0LjM5ODQgUTE0OC4wNzgxIDEyOS41MTU2IDE0OC4wNzgxIDE2MC4zMTI1IFExNDguMDc4MSAxODMuNTE1NiAxNDIuMDMxMiAxOTcuNjQ4NCBRMTM1Ljk4NDQgMjExLjc4MTIgMTIzLjYwOTQgMjE3LjQwNjIgTDE0MS4zMjgxIDIzMi4zMTI1IEwxMjcuOTY4OCAyNDAuMTg3NSBMMTA3LjI5NjkgMjIxLjA2MjUgWk0xMjkuMzc1IDE2MC4zMTI1IFExMjkuMzc1IDEzNC40Mzc1IDEyMy4zOTg0IDEyMy4zMjgxIFExMTcuNDIxOSAxMTIuMjE4OCAxMDMuNzgxMiAxMTIuMjE4OCBROTAuMjgxMiAxMTIuMjE4OCA4NC4zMDQ3IDEyMy4zMjgxIFE3OC4zMjgxIDEzNC40Mzc1IDc4LjMyODEgMTYwLjMxMjUgUTc4LjMyODEgMTg2LjE4NzUgODQuMzA0NyAxOTcuMjk2OSBROTAuMjgxMiAyMDguNDA2MiAxMDMuNzgxMiAyMDguNDA2MiBRMTE3LjQyMTkgMjA4LjQwNjIgMTIzLjM5ODQgMTk3LjI5NjkgUTEyOS4zNzUgMTg2LjE4NzUgMTI5LjM3NSAxNjAuMzEyNSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaNLXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02MS44NzUgMTAxLjY3MTkgTDc5LjczNDQgMTAxLjY3MTkgTDc5LjczNDQgMTUxLjMxMjUgTDEzMC42NDA2IDEwMS42NzE5IEwxNTMuNzAzMSAxMDEuNjcxOSBMOTYuNDY4OCAxNTYuNTE1NiBMMTU4LjM0MzggMjE5LjIzNDQgTDEzNC44NTk0IDIxOS4yMzQ0IEw3OS43MzQ0IDE2Mi41NjI1IEw3OS43MzQ0IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG5cXG4gICAgPHRhYmxlIHN0eWxlPVxcXCJib3JkZXItd2lkdGg6MXB4XFxcIj5cXG4gICAgICAgIDx0ciB3aWR0aD1cXFwiMTAwJVxcXCIgaGVpZ2h0PVxcXCIxMHB4XFxcIiBzdHlsZT1cXFwidmlzaWJpbGl0eTp2aXNpYmxlXFxcIn0+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibHVlXFxcIj4mYmxvY2s7PC9zcGFuPjwvcGxheWluZy1jYXJkPC90ZD5cXG4gICAgICAgIDwvdHI+XFxuICAgICAgICA8dHIgd2lkdGg9XFxcIjEwMCVcXFwiPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7QTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7Mjwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7Mzwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7NDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7NTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7Njwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7Nzwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7ODwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7OTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7MTA8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQgd2lkdGg9XFxcIjUwcHhcXFwiPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzO0o8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQgd2lkdGg9XFxcIjUwcHhcXFwiPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzO1E8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQgd2lkdGg9XFxcIjUwcHhcXFwiPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzO0s8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgIDwvdHI+XFxuICAgICAgICA8dHI+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0cztBPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czsyPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czszPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs0PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs1PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs2PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs3PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs4PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs5PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czsxMDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZoZWFydHM7Sjwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZoZWFydHM7UTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZoZWFydHM7Szwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgPC90cj5cXG4gICAgICAgIDx0cj5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7QTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczsyPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zOzM8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7NDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczs1PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zOzY8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7Nzwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczs4PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zOzk8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7MTA8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7Sjwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtcztRPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zO0s8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgIDwvdHI+XFxuICAgICAgICA8dHI+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7QTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzI8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczszPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7NDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzU8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczs2PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7Nzwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzg8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczs5PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7MTA8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHVicztKPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7UTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzO0s8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgIDwvdHI+XFxuICAgIDwvdGFibGU+XFxuPC9kaXY+XFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmF3LWxvYWRlciEuL3ZpZXdzL3BhcnRpYWxzL2ZyZXNoZGVjay5odG1sXG4vLyBtb2R1bGUgaWQgPSAzN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+aW5kZXg8L3A+XFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmF3LWxvYWRlciEuL3ZpZXdzL3BhcnRpYWxzL2luZGV4Lmh0bWxcbi8vIG1vZHVsZSBpZCA9IDM4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8Zm9ybVxcbiAgICBpZD1cXFwibWVzc2FnZV9mb3JtXFxcIlxcbiAgICBvbnN1Ym1pdD1cXFwiXFxuICAgICB2YXIgZ3VuID0gR3VuKGxvY2F0aW9uLm9yaWdpbiArICcvZ3VuJyk7XFxuICAgICBvcGVucGdwLmNvbmZpZy5hZWFkX3Byb3RlY3QgPSB0cnVlXFxuICAgICBvcGVucGdwLmluaXRXb3JrZXIoeyBwYXRoOicvanMvb3BlbnBncC53b3JrZXIuanMnIH0pXFxuICAgICBpZiAoIW1lc3NhZ2VfdHh0LnZhbHVlKSB7XFxuICAgICAgICAgIHJldHVybiBmYWxzZVxcbiAgICAgfVxcblxcbiAgICAgd2luZG93LmhhbmRsZVBvc3QobWVzc2FnZV90eHQudmFsdWUpKG9wZW5wZ3ApKHdpbmRvdy5sb2NhbFN0b3JhZ2UpKCdyb3lhbGUnKShndW4pLnRoZW4ocmVzdWx0ID0+IHtpZiAocmVzdWx0KSB7Y29uc29sZS5sb2cocmVzdWx0KX19KS5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcihlcnIpKTtkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVzc2FnZV90eHQnKS52YWx1ZSA9ICcnOyByZXR1cm4gZmFsc2VcXFwiXFxuICAgIG1ldGhvZD1cXFwicG9zdFxcXCJcXG4gICAgYWN0aW9uPVxcXCIvbWVzc2FnZVxcXCI+XFxuICAgIDxpbnB1dCBpZD1cXFwibWVzc2FnZV9mb3JtX2lucHV0XFxcIlxcbiAgICAgICAgdHlwZT1cXFwic3VibWl0XFxcIlxcbiAgICAgICAgdmFsdWU9XFxcInBvc3QgbWVzc2FnZVxcXCJcXG4gICAgICAgIGZvcm09XFxcIm1lc3NhZ2VfZm9ybVxcXCJcXG4gICAgICAgID5cXG48L2Zvcm0+XFxuPHRleHRhcmVhXFxuICAgIGlkPVxcXCJtZXNzYWdlX3R4dFxcXCJcXG4gICAgbmFtZT1cXFwibWVzc2FnZV90eHRcXFwiXFxuICAgIGZvcm09XFxcIm1lc3NhZ2VfZm9ybVxcXCJcXG4gICAgcm93cz01MVxcbiAgICBjb2xzPTcwXFxuICAgIHBsYWNlaG9sZGVyPVxcXCJwYXN0ZSBwbGFpbnRleHQgbWVzc2FnZSwgcHVibGljIGtleSwgb3IgcHJpdmF0ZSBrZXlcXFwiXFxuICAgIHN0eWxlPVxcXCJmb250LWZhbWlseTpNZW5sbyxDb25zb2xhcyxNb25hY28sTHVjaWRhIENvbnNvbGUsTGliZXJhdGlvbiBNb25vLERlamFWdSBTYW5zIE1vbm8sQml0c3RyZWFtIFZlcmEgU2FucyBNb25vLENvdXJpZXIgTmV3LCBtb25vc3BhY2U7XFxcIlxcbiAgICA+XFxuPC90ZXh0YXJlYT5cXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yYXctbG9hZGVyIS4vdmlld3MvcGFydGlhbHMvbWVzc2FnZV9mb3JtLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDM5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8c3BhbiBjbGFzcz1cXFwicm9hZG1hcFxcXCI+XFxuICAgIDxkZXRhaWxzPlxcbiAgICA8c3VtbWFyeT5yb2FkIG1hcDwvc3VtbWFyeT5cXG4gICAgPHVsPlxcbiAgICAgICAgPGxpPjxkZWw+PGEgaHJlZj1cXFwiaHR0cHM6Ly9naXRodWIuY29tL2NvbGVhbGJvbi9ob3RsaXBzL2NvbW1pdC8zYjcwOTgxY2JlNGUxMWUxNDAwYWU4ZTk0OGEwNmUzNTgyZDljMmQyXFxcIj5JbnN0YWxsIG5vZGUva29hL3dlYnBhY2s8L2E+PC9kZWw+PC9saT5cXG4gICAgICAgIDxsaT48ZGVsPjxhIGhyZWY9XFxcImh0dHBzOi8vZ2l0aHViLmNvbS9jb2xlYWxib24vaG90bGlwcy9pc3N1ZXMvMlxcXCI+SW5zdGFsbCBndW5kYjwvYT48L2RlbD48L2xpPlxcbiAgICAgICAgPGxpPjxkZWw+bWFrZSBhIDxhIGhyZWY9XFxcIiMvZGVja1xcXCI+ZGVjazwvYT4gb2YgY2FyZHM8L2RlbD48L2xpPlxcbiAgICAgICAgPGxpPjxkZWw+QWxpY2UgYW5kIEJvYiA8YSBocmVmPVxcXCIjL21lc3NhZ2VcXFwiPmlkZW50aWZ5PC9hPjwvZGVsPjwvbGk+XFxuICAgICAgICA8bGk+PGRlbD5BbGljZSBhbmQgQm9iIDxhIGhyZWY9XFxcIiMvY29ubmVjdFxcXCI+Y29ubmVjdDwvYT48L2RlbD48L2xpPlxcbiAgICAgICAgPGxpPjxkZWw+QWxpY2UgYW5kIEJvYiA8YSBocmVmPVxcXCJodHRwczovL2dpdGh1Yi5jb20vY29sZWFsYm9uL3N0cmVhbWxpbmVyXFxcIj5leGNoYW5nZSBrZXlzPC9hPjwvZGVsPzwvbGk+XFxuICAgICAgICA8bGk+QWxpY2UgcGlja3MgYW4gZW5jcnlwdGlvbiBrZXkgQSBhbmQgdXNlcyB0aGlzIHRvIGVuY3J5cHQgZWFjaCBjYXJkIG9mIHRoZSBkZWNrLjwvbGk+XFxuICAgICAgICA8bGk+QWxpY2UgPGEgaHJlZj1cXFwiaHR0cHM6Ly9ib3N0Lm9ja3Mub3JnL21pa2Uvc2h1ZmZsZS9cXFwiPnNodWZmbGVzPC9hPiB0aGUgY2FyZHMuPC9saT5cXG4gICAgICAgIDxsaT5BbGljZSBwYXNzZXMgdGhlIGVuY3J5cHRlZCBhbmQgc2h1ZmZsZWQgZGVjayB0byBCb2IuIFdpdGggdGhlIGVuY3J5cHRpb24gaW4gcGxhY2UsIEJvYiBjYW5ub3Qga25vdyB3aGljaCBjYXJkIGlzIHdoaWNoLjwvbGk+XFxuICAgICAgICA8bGk+Qm9iIHNodWZmbGVzIHRoZSBkZWNrLjwvbGk+XFxuICAgICAgICA8bGk+Qm9iIHBhc3NlcyB0aGUgZG91YmxlIGVuY3J5cHRlZCBhbmQgc2h1ZmZsZWQgZGVjayBiYWNrIHRvIEFsaWNlLjwvbGk+XFxuICAgICAgICA8bGk+QWxpY2UgZGVjcnlwdHMgZWFjaCBjYXJkIHVzaW5nIGhlciBrZXkgQS4gVGhpcyBzdGlsbCBsZWF2ZXMgQm9iJ3MgZW5jcnlwdGlvbiBpbiBwbGFjZSB0aG91Z2ggc28gc2hlIGNhbm5vdCBrbm93IHdoaWNoIGNhcmQgaXMgd2hpY2guPC9saT5cXG4gICAgICAgIDxsaT5BbGljZSBwaWNrcyBvbmUgZW5jcnlwdGlvbiBrZXkgZm9yIGVhY2ggY2FyZCAoQTEsIEEyLCBldGMuKSBhbmQgZW5jcnlwdHMgdGhlbSBpbmRpdmlkdWFsbHkuPC9saT5cXG4gICAgICAgIDxsaT5BbGljZSBwYXNzZXMgdGhlIGRlY2sgdG8gQm9iLjwvbGk+XFxuICAgICAgICA8bGk+Qm9iIGRlY3J5cHRzIGVhY2ggY2FyZCB1c2luZyBoaXMga2V5IEIuIFRoaXMgc3RpbGwgbGVhdmVzIEFsaWNlJ3MgaW5kaXZpZHVhbCBlbmNyeXB0aW9uIGluIHBsYWNlIHRob3VnaCBzbyBoZSBjYW5ub3Qga25vdyB3aGljaCBjYXJkIGlzIHdoaWNoLjwvbGk+XFxuICAgICAgICA8bGk+Qm9iIHBpY2tzIG9uZSBlbmNyeXB0aW9uIGtleSBmb3IgZWFjaCBjYXJkIChCMSwgQjIsIGV0Yy4pIGFuZCBlbmNyeXB0cyB0aGVtIGluZGl2aWR1YWxseS48L2xpPlxcbiAgICAgICAgPGxpPkJvYiBwYXNzZXMgdGhlIGRlY2sgYmFjayB0byBBbGljZS48L2xpPlxcbiAgICAgICAgPGxpPkFsaWNlIHB1Ymxpc2hlcyB0aGUgZGVjayBmb3IgZXZlcnlvbmUgcGxheWluZyAoaW4gdGhpcyBjYXNlIG9ubHkgQWxpY2UgYW5kIEJvYiwgc2VlIGJlbG93IG9uIGV4cGFuc2lvbiB0aG91Z2gpLjwvbGk+XFxuICAgIDwvdWw+XFxuPC9kZXRhaWxzPlxcbjwvc3Bhbj5cXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yYXctbG9hZGVyIS4vdmlld3MvcGFydGlhbHMvcm9hZG1hcC5odG1sXG4vLyBtb2R1bGUgaWQgPSA0MFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9