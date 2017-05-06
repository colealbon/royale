/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	//import 'webcomponents.js/webcomponents.js';
	//uncomment line above to double app size and support ios.
	
	// helper functions
	
	var _util = __webpack_require__(1);
	
	var util = _interopRequireWildcard(_util);
	
	var _rebelRouter = __webpack_require__(3);
	
	var _gun = __webpack_require__(4);
	
	var _index = __webpack_require__(6);
	
	var _roadmap = __webpack_require__(8);
	
	var _contact = __webpack_require__(10);
	
	var _message = __webpack_require__(12);
	
	var _deck = __webpack_require__(14);
	
	var _connect = __webpack_require__(16);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	window.handlePost = util.handlePost;
	
	// window.handleContent = util.handleContent;
	// window.isPGPPubkey   = util.isPGPPubkey;
	// window.isPGPPrivkey  = util.isPGPPrivkey;
	
	// rebel router
	
	
	// Gundb public facing DAG database  (for messages to and from the enemy)
	
	
	// pages (most of this should be in views/partials to affect isormorphism)

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.determineContentType = determineContentType;
	exports.encryptClearText = encryptClearText;
	exports.decryptPGPMessageWithKey = decryptPGPMessageWithKey;
	exports.decryptPGPMessage = decryptPGPMessage;
	exports.handlePost = handlePost;
	var PGPPUBKEY = 'PGPPubkey';
	var CLEARTEXT = 'cleartext';
	var PGPPRIVKEY = 'PGPPrivkey';
	var PGPMESSAGE = 'PGPMessage';
	
	function determineKeyType(content) {
	    return !content ? Promise.reject('Error: mising pgpKey') : function (openpgp) {
	        return !openpgp ? Promise.reject('Error: missing openpgp') : new Promise(function (resolve, reject) {
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
	
	function determineContentType(content) {
	    // usage: determineContentType(content)(openpgp).then(result => result)
	    return !content ? Promise.resolve('') : function (openpgp) {
	        return !openpgp ? Promise.reject('Error: missing openpgp') : new Promise(function (resolve, reject) {
	            var possiblepgpkey = openpgp.key.readArmored(content);
	            if (possiblepgpkey.keys[0]) {
	                determineKeyType(content)(openpgp).then(function (keyType) {
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
	
	function getFromStorage(localStorage) {
	    // usage: savePGPkey(content)(openpgp)(localStorage).then(result => result)
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
	
	function savePGPPubkey(PGPkeyArmor) {
	    // save public key to storage only if it doesn't overwrite a private key
	    // usage: savePGPPubkey(content)(openpgp)(localStorage).then(result => result)
	    return !PGPkeyArmor ? Promise.reject('Error: missing PGPkeyArmor') : function (openpgp) {
	        return !openpgp ? Promise.reject('Error: missing openpgp') : function (localStorage) {
	            return !localStorage ? Promise.reject('Error: missing localStorage') : new Promise(function (resolve, reject) {
	                var PGPkey = openpgp.key.readArmored(PGPkeyArmor);
	                getFromStorage(localStorage)(PGPkey.keys[0].users[0].userId.userid).then(function (existingKey) {
	                    return !existingKey ? Promise.resolve('none') : determineContentType(existingKey)(openpgp);
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
	
	function encryptClearText(openpgp) {
	    // usage: encryptClearText(openpgp)(publicKeyArmor)(cleartext).then(result => result)
	    return !openpgp ? Promise.reject('Error: missing openpgp') : function (publicKeyArmor) {
	        return !publicKeyArmor ? Promise.reject('Error: missing public key') : function (cleartext) {
	            return !cleartext ? Promise.reject('Error: missing cleartext') : new Promise(function (resolve, reject) {
	                var PGPPubkey = openpgp.key.readArmored(publicKeyArmor);
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
	                try {
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
	
	// function encryptContent(content) {
	//     // usage: encryptContent(content)(openpgp)(localStorage).then(result => result)
	//     return (!content) ?
	//     Promise.reject('Error: missing content'):
	//     (openpgp) => {
	//         return (!openpgp) ?
	//         Promise.reject('Error: missing openpgp'):
	//         (localStorage) => {
	//             if (!localStorage) {
	//                 return Promise.reject('Error: missing localStorage');
	//             }
	//             let encryptedArr = [];
	//             getFromStorage(localStorage)()
	//             .then(storageArr => {
	//                 storageArr
	//                 .filter((storageItem) => storageItem !== null)
	//                 .filter((storageItem) => {
	//                     return determineContentType(storageItem)(openpgp)
	//                     .then(result => {
	//                         return ( result === PGPPUBKEY )
	//                     });
	//                 })
	//                 .map((storageItem) => {
	//                     encryptClearText(openpgp)(storageItem)(content)
	//                     .then((encrypted) => {
	//                         console.log(encrypted)
	//                         return encrypted;
	//                     })
	//                 })
	//             })
	//         }
	//     }
	// }
	
	function decryptPGPMessageWithKey(PGPMessageArmor) {
	    //  usage: decryptPGPMessageWithKey(content)(openpgp)(privateKeyArmor)(password).then(result => result)
	    return !PGPMessageArmor ? Promise.reject('Error: missing PGPMessage') : function (openpgp) {
	        return !openpgp ? Promise.reject('Error: missing openpgp') : function (privateKeyArmor) {
	            return !privateKeyArmor ? Promise.reject('Error: missing privateKeyArmor') : function (password) {
	                return !password ? Promise.reject('Error: missing password') : new Promise(function (resolve, reject) {
	                    try {
	                        var privateKeys = openpgp.key.readArmored(privateKeyArmor);
	                        var privateKey = privateKeys.keys[0];
	                        privateKey.decrypt(password);
	                        var message = openpgp.message.readArmored(PGPMessageArmor);
	                        return !openpgp.decrypt ? openpgp.decryptMessage(privateKey, message).then(function (result) {
	                            resolve(result);
	                        }) : openpgp.decrypt({ 'message': message, 'privateKey': privateKey }).then(function (result) {
	                            resolve(result.data);
	                        });
	                    } catch (err) {
	                        //resolve();
	                        reject(err);
	                    }
	                });
	            };
	        };
	    };
	}
	
	function decryptPGPMessage(PGPMessageArmor) {
	    //  usage: decryptPGPMessage(content)(openpgp)(localStorage)(password).then(result => result)
	    return !PGPMessageArmor ? Promise.reject('Error: missing PGPMessage') : function (openpgp) {
	        return !openpgp ? Promise.reject('Error: missing openpgp') : function (localStorage) {
	            return !localStorage ? Promise.reject('Error: missing localStorage') : function (password) {
	                return !password ? Promise.reject("Error: missing password") : new Promise(function (resolve, reject) {
	                    getFromStorage(localStorage)().then(function (storeArr) {
	                        try {
	                            return storeArr.filter(function (storageItem) {
	                                return !storageItem ? false : true;
	                            }).map(function (storageItem) {
	                                return determineContentType(storageItem)(openpgp).then(function (contentType) {
	                                    if (contentType === PGPPRIVKEY) {
	                                        decryptPGPMessageWithKey(PGPMessageArmor)(openpgp)(storageItem)('hotlips').then(function (decrypted) {
	                                            resolve(decrypted);
	                                        });
	                                    }
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
	
	// export function broadcast(content) {
	//     const notPGPPrivkey = require('./notPGPPrivkey.js');
	//     // import notCleartext from './notCleartext.js';
	//     // import notEmpty from './notEmpty.js';
	//     notPGPPrivkey(content);
	//     // notCleartext(content);
	//     // notEmpty(content);
	//
	//     gun.get('royale').put({
	//           name: "LATEST",
	//           email: content
	//         });
	//
	// }
	
	function handlePost(content) {
	    //console.log(`handlePost <- ${content}`);
	    return !content ? Promise.resolve('') : function (openpgp) {
	        return !openpgp ? Promise.reject('Error: missing openpgp') : function (localStorage) {
	            return function (password) {
	                return new Promise(function (resolve, reject) {
	                    determineContentType(content)(openpgp).then(function (contentType) {
	                        if (contentType === CLEARTEXT) {
	                            //encrypt
	                            var encryptedArr = [];
	                            getFromStorage(localStorage)().then(function (storageArr) {
	                                return new Promise(function (resolve, reject) {
	                                    var i = storageArr.length;
	                                    storageArr.map(function (storageItem) {
	                                        i--;
	                                        return storageItem;
	                                    }).filter(function (storageItem) {
	                                        return storageItem !== null;
	                                    }).filter(function (storageItem) {
	                                        return determineContentType(storageItem)(openpgp).then(function (result) {
	                                            return result === PGPPUBKEY;
	                                        });
	                                    }).map(function (storageItem) {
	                                        encryptClearText(openpgp)(storageItem)(content).then(function (encrypted) {
	                                            encryptedArr.push(encrypted);
	                                            if (i == 0) {
	                                                resolve(encryptedArr);
	                                            }
	                                        });
	                                    });
	                                });
	                            }).then(function (encryptedArr) {
	                                // broadcast here
	                                encryptedArr.map(function (encrypted) {
	                                    console.log(encrypted);
	                                    console.log('broadcast here');
	                                });
	                            });
	                        }
	                        if (contentType === PGPPRIVKEY) {
	                            // save and broadcast converted public key
	                            return savePGPPrivkey(content)(openpgp)(localStorage)
	                            //return broadcastMessage(content)(openpgp)(localStorage)
	                            .then(function (result) {
	                                return result;
	                            });
	                        }
	                        if (contentType === PGPPUBKEY) {
	                            // save to localStorage
	                            return savePGPPubkey(content)(openpgp)(localStorage).then(function (result) {
	                                return result;
	                            });
	                        }
	                        if (contentType === PGPMESSAGE) {
	                            // get PGPKeys, decrypt,  and return
	                            return decryptPGPMessage(content)(openpgp)(localStorage)(password).then(function (result) {
	                                return result;
	                            });
	                        }
	                    }).then(function (result) {
	                        resolve(result);
	                    }).catch(function (err) {
	                        return reject(err);
	                    });
	                });
	            };
	        };
	    };
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	'use strict';
	
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
/* 3 */
/***/ (function(module, exports) {

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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, module) {"use strict";
	
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
				s.time = time || Gun.time.is;
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
					if (Lexical(incomingValue) === Lexical(currentValue)) {
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
					if (Lexical(incomingValue) < Lexical(currentValue)) {
						// Lexical only works on simple value types!
						return { converge: true, current: true };
					}
					if (Lexical(currentValue) < Lexical(incomingValue)) {
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
				if (text_is(v) // by "text" we mean strings.
				|| bi_is(v) // by "binary" we mean boolean.
				|| num_is(v)) {
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
			};(function () {
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
			var soul_ = Val.rel._;
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
			State.is = function (n, f, o) {
				// convenience function to get the state on a field on a node and return it.
				var tmp = f && n && n[N_] && n[N_][State._] || o;
				if (!tmp) {
					return;
				}
				return num_is(tmp[f]) ? tmp[f] : -Infinity;
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
			    obj_map = obj.map;
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
					// we invert this because the way we check for this is via a negation.
					if (!n || s !== Node.soul(n) || !Node.is(n, this.fn)) {
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
						if (obj_has(v, Node._) && !Gun.is(v)) {
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
	
			Gun.version = 0.6;
	
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
					if (!at['#'] && at['@']) {
						at['#'] = Gun.text.random(); // TODO: Use what is used other places instead.
						// TODO: BUG! For multi-instances, the "ack" system is globally shared, but it shouldn't be. 
						if (cat.ack(at['@'], at)) {
							return;
						} // TODO: Consider not returning here, maybe, where this would let the "handshake" on sync occur for Holy Grail?
						cat.dup.track(at['#']);
						Gun.on('out', obj_to(at, { gun: cat.gun }));
						return;
					}
					if (at['#'] && cat.dup.check(at['#'])) {
						return;
					}
					cat.dup.track(at['#']);
					if (cat.ack(at['@'], at)) {
						return;
					}
					//cat.ack(at['@'], at);
					coat = obj_to(at, { gun: cat.gun });
					if (at.get) {
						if (!get(at, cat)) {
							Gun.on('get', coat);
						}
					}
					if (at.put) {
						Gun.HAM.synth(at, ev, cat.gun); // TODO: Clean up, just make it part of on('put')!
						Gun.on('put', coat);
					}
					Gun.on('out', coat);
				}
				function get(at, cat) {
					var soul = at.get[_soul],
					    node = cat.graph[soul],
					    field = at.get[_field],
					    tmp;
					var next = cat.next || (cat.next = {}),
					    as = /*(at.gun||empty)._ ||*/(next[soul] || (next[soul] = cat.gun.get(soul)))._;
					if (!node) {
						return;
					}
					if (field) {
						if (!obj_has(node, field)) {
							return;
						}
						tmp = Gun.obj.put(Gun.node.soul.ify({}, soul), field, node[field]);
						node = Gun.state.ify(tmp, field, Gun.state.is(node, field));
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
						return true;
					}
				}
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
					at.opt.wsc = at.opt.wsc || { protocols: null };
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
			    obj_map = obj.map;
			var _soul = Gun._.soul,
			    _field = Gun._.field;
			//var u;
	
			console.debug = function (i, s) {
				return console.debug.i && i === console.debug.i && console.debug.i++ && (console.log.apply(console, arguments) || s);
			};
	
			Gun.log = function () {
				return !Gun.log.off && console.log.apply(console, arguments), [].slice.call(arguments).join(' ');
			};
			Gun.log.once = function (w, s, o) {
				return (o = Gun.log.once)[w] = o[w] || 0, o[w]++ || Gun.log(s);
			};
	
			/* Please do not remove these messages unless you are paying for a monthly sponsorship, thanks! */
			Gun.log.once("welcome", "Hello wonderful person! :) Thanks for using GUN, feel free to ask for help on https://gitter.im/amark/gun and ask StackOverflow questions tagged with 'gun'!");
			/* Please do not remove these messages unless you are paying for a monthly sponsorship, thanks! */
	
			if (typeof window !== "undefined") {
				window.Gun = Gun;
			}
			if (typeof common !== "undefined") {
				common.exports = Gun;
			}
			module.exports = Gun;
		})(require, './root');
	
		;require(function (module) {
			return;
			var Gun = require('./root');
			var onto = require('./onto');
			function Chain(back) {
				var at = this._ = { back: back, on: onto, $: this, next: {} };
				at.root = back ? back.root : at;
				at.on('in', input, at);
				at.on('out', output, at);
			}
			var chain = Chain.prototype;
			chain.back = function (arg) {
				var tmp;
				if (tmp = this._.back) {
					return tmp.$;
				}
			};
			chain.next = function (arg) {
				var at = this._,
				    cat;
				if (cat = at.next[arg]) {
					return cat.$;
				}
				cat = new Chain(at)._;
				at.next[arg] = cat;
				cat.key = arg;
				return cat.$;
			};
			chain.get = function (arg) {
				if (typeof arg == 'string') {
					var at = this._,
					    cat;
					if (cat = at.next[arg]) {
						return cat.$;
					}
					cat = this.next(arg)._;
					if (at.get || at === at.root) {
						cat.get = arg;
					}
					return cat.$;
				} else {
					var at = this._;
					var out = { '#': Gun.text.random(), get: {}, cap: 1 };
					var to = at.root.on(out['#'], get, { next: arg });
					at.on('in', get, to);
					at.on('out', out);
				}
				return this;
			};
			function get(env) {
				var as = this.as;
				if (as.next) {
					as.next(env, this);
				}
			}
			chain.map = function (cb) {
				var at = this._;
				var chain = new Chain(at);
				var cat = chain._;
				var u;
				at.on('in', function (env) {
					var tmp;
					if (!env) {
						return;
					}
					var cat = this.as;
					var to = this.to;
					if (tmp = env.put) {
						to.next(env);
						Gun.obj.map(tmp, function (data, key) {
							if ('_' == key) {
								return;
							}
							if (cb) {
								data = cb(data, key);
								if (u === data) {
									return;
								}
							}
							cat.on('in', Gun.obj.to(env, { put: data }));
						});
					}
				}, cat);
				return chain;
			};
			function input(env) {
				var tmp;
				if (!env) {
					return;
				}
				var cat = this.as;
				var to = this.to;
				if (tmp = env.put) {
					if (tmp && tmp['#'] && (tmp = Gun.val.rel.is(tmp))) {
						//input.call(this, Gun.obj.to(env, {put: cat.root.put[tmp]}));
						return;
					}
					cat.put = tmp;
					to.next(env);
					var next = cat.next;
					Gun.obj.map(tmp, function (data, key) {
						if (!(key = next[key])) {
							return;
						}
						key.on('in', Gun.obj.to(env, { put: data }));
					});
				}
			}
			function output(env) {
				var tmp;
				var u;
				if (!env) {
					return;
				}
				var cat = this.as;
				var to = this;
				if (!cat.back) {
					env.test = true;
					env.gun = cat.root.$;
					Gun.on('out', env);
					return;
				}
				if (tmp = env.get) {
					if (cat.get) {
						env = Gun.obj.to(env, { get: { '#': cat.get, '.': tmp } });
					} else if (cat.key) {
						env = Gun.obj.to(env, { get: Gun.obj.put({}, cat.key, tmp) });
					} else {
						env = Gun.obj.to(env, { get: { '*': tmp } });
					}
				}
				cat.back.on('out', env);
			}
			chain.val = function (cb, opt) {
				var at = this._;
				if (cb) {
					if (opt) {} else {
						if (at.val) {
							cb(at.put, at.get, at);
						}
					}
					this.get(function (env, ev) {
						cb(env.put, env.get, env);
					});
				}
			};
	
			var graph = {
				app: { _: { '#': 'app' },
					foo: { _: { '#': 'foo' },
						bar: { '#': 'asdf' },
						rab: { '#': 'fdsa' }
					} /*,
	      oof: {_:{'#':'oof'},
	      bar: {bat: "really"},
	      rab: {bat: "nice!"}
	      }*/
				},
				asdf: { _: { '#': 'asdf' }, baz: "hello world!" },
				fdsa: { _: { '#': 'fdsa' }, baz: "world hello!" }
			};
			Gun.on('out', function (env) {
				if (!env.test) {
					return;
				}
				setTimeout(function () {
					console.log("reply", env.get);
					env.gun._.on('in', { '@': env['#'],
						put: Gun.graph.node(graph[env.get['#']])
					});
					return;
					env.gun._.on('in', { put: graph, '@': env['#'] });
				}, 100);
			});
			setTimeout(function () {
	
				//var c = new Chain(), u;
				//c.get('app').map().map(x => x.bat? {baz: x.bat} : u).get('baz').val(function(data, key, env){
				//	console.log("envelope", env);
				//});
	
			}, 1000);
		})(require, './experiment');
	
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
					if (!get[_soul]) {
						if (obj_has(get, _field)) {
							get = get[_field];
							var next = get ? gun.get(get)._ : cat;
							// TODO: BUG! Handle plural chains by iterating over them.
							if (obj_has(next, 'put')) {
								// potentially incorrect? Maybe?
								//if(u !== next.put){ // potentially incorrect? Maybe?
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
										get: { '#': rel, '.': get },
										'#': root._.ask(Gun.HAM.synth, at.gun),
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
							}
							if (cat.soul) {
								if (!at.gun._) {
									return;
								}
								at.gun._.on('out', {
									get: { '#': cat.soul, '.': get },
									'#': root._.ask(Gun.HAM.synth, at.gun),
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
									return;
								}
							}
							cat.ack = -1;
							if (cat.soul) {
								cat.on('out', {
									get: { '#': cat.soul },
									'#': root._.ask(Gun.HAM.synth, cat.gun),
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
				if (0 > cat.ack && !Gun.val.rel.is(change)) {
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
				if (rel !== tmp.rel) {
					ask(cat, tmp.rel = rel);
				}
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
						get: { '#': soul },
						'#': cat.root._.ask(Gun.HAM.synth, tmp.gun),
						gun: tmp.gun
					});
					return;
				}
				obj_map(cat.next, function (gun, key) {
					gun._.on('out', {
						get: { '#': soul, '.': key },
						'#': cat.root._.ask(Gun.HAM.synth, tmp.gun),
						gun: gun
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
						at.soul(Gun.node.soul(at.obj) || ((as.opt || {}).uuid || as.gun.back('opt.uuid') || Gun.text.random)());
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
				cat.soul(Gun.node.soul(cat.obj) || Gun.node.soul(at.put) || Gun.val.rel.is(at.put) || ((as.opt || {}).uuid || as.gun.back('opt.uuid') || Gun.text.random)()); // TODO: BUG!? Do we really want the soul of the object given to us? Could that be dangerous?
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
				Gun.HAM.synth = function (at, ev, as) {
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
			var obj = Gun.obj,
			    obj_is = obj.is,
			    obj_put = obj.put,
			    obj_map = obj.map,
			    obj_empty = obj.empty;
			var num = Gun.num,
			    num_is = num.is;
			var _soul = Gun.val.rel._,
			    _field = '.';
	
			;(function () {
				Gun.chain.key = function (index, cb, opt) {
					if (!index) {
						if (cb) {
							cb.call(this, { err: Gun.log('No key!') });
						}
						return this;
					}
					var gun = this;
					if (typeof opt === 'string') {
						console.log("Please report this as an issue! key.opt.string");
						return gun;
					}
					if (gun === gun._.root) {
						if (cb) {
							cb({ err: Gun.log("Can't do that on root instance.") });
						};return gun;
					}
					opt = opt || {};
					opt.key = index;
					opt.any = cb || function () {};
					opt.ref = gun.back(-1).get(opt.key);
					opt.gun = opt.gun || gun;
					gun.on(key, { as: opt });
					if (!opt.data) {
						opt.res = Gun.on.stun(opt.ref);
					}
					return gun;
				};
				function key(at, ev) {
					var opt = this;
					ev.off();
					opt.soul = Gun.node.soul(at.put);
					if (!opt.soul || opt.key === opt.soul) {
						return opt.data = {};
					}
					opt.data = obj_put({}, keyed._, Gun.node.ify(obj_put({}, opt.soul, Gun.val.rel.ify(opt.soul)), '#' + opt.key + '#'));
					(opt.res || iffe)(function () {
						opt.ref.put(opt.data, opt.any, { soul: opt.key, key: opt.key });
					}, opt);
					if (opt.res) {
						opt.res();
					}
				}
				function iffe(fn, as) {
					fn.call(as || {});
				}
				function keyed(f) {
					if (!f || !('#' === f[0] && '#' === f[f.length - 1])) {
						return;
					}
					var s = f.slice(1, -1);
					if (!s) {
						return;
					}
					return s;
				}
				keyed._ = '##';
				Gun.on('next', function (at) {
					var gun = at.gun;
					if (gun.back(-1) !== at.back) {
						return;
					}
					gun.on('in', pseudo, gun._);
					gun.on('out', normalize, gun._);
				});
				function normalize(at) {
					var cat = this;
					if (!at.put) {
						if (at.get) {
							search.call(at.gun ? at.gun._ : cat, at);
						}
						return;
					}
					if (at.opt && at.opt.key) {
						return;
					}
					var put = at.put,
					    graph = cat.gun.back(-1)._.graph;
					Gun.graph.is(put, function (node, soul) {
						if (!Gun.node.is(graph['#' + soul + '#'], function each(rel, id) {
							if (id !== Gun.val.rel.is(rel)) {
								return;
							}
							if (rel = graph['#' + id + '#']) {
								Gun.node.is(rel, each); // correct params?
								return;
							}
							Gun.node.soul.ify(rel = put[id] = Gun.obj.copy(node), id);
						})) {
							return;
						}
						Gun.obj.del(put, soul);
					});
				}
				function search(at) {
					var cat = this;
					var tmp;
					if (!Gun.obj.is(tmp = at.get)) {
						return;
					}
					if (!Gun.obj.has(tmp, '#')) {
						return;
					}
					if ((tmp = at.get) && null === tmp['.']) {
						tmp['.'] = '##';
						return;
					}
					if ((tmp = at.get) && Gun.obj.has(tmp, '.')) {
						if (tmp['#']) {
							cat = cat.root.gun.get(tmp['#'])._;
						}
						tmp = at['#'];
						at['#'] = Gun.on.ask(proxy);
					}
					var tried = {};
					function proxy(ack, ev) {
						var put = ack.put,
						    lex = at.get;
						if (!cat.pseudo || ack.via) {
							// TODO: BUG! MEMORY PERF! What about unsubscribing?
							//ev.off();
							//ack.via = ack.via || {};
							return Gun.on.ack(tmp, ack);
						}
						if (ack.put) {
							if (!lex['.']) {
								ev.off();
								return Gun.on.ack(tmp, ack);
							}
							if (obj_has(ack.put[lex['#']], lex['.'])) {
								ev.off();
								return Gun.on.ack(tmp, ack);
							}
						}
						Gun.obj.map(cat.seen, function (ref, id) {
							// TODO: BUG! In-memory versus future?
							if (tried[id]) {
								return Gun.on.ack(tmp, ack);
							}
							tried[id] = true;
							ref.on('out', {
								gun: ref,
								get: id = { '#': id, '.': at.get['.'] },
								'#': Gun.on.ask(proxy)
							});
						});
					}
				}
				function pseudo(at, ev) {
					var cat = this;
					// TODO: BUG! Pseudo can't handle plurals!?
					if (cat.pseudo) {
						//ev.stun();return;
						if (cat.pseudo === at.put) {
							return;
						}
						ev.stun();
						cat.change = cat.changed || cat.pseudo;
						cat.on('in', Gun.obj.to(at, { put: cat.put = cat.pseudo }));
						return;
					}
					if (!at.put) {
						return;
					}
					var rel = Gun.val.rel.is(at.put[keyed._]);
					if (!rel) {
						return;
					}
					var soul = Gun.node.soul(at.put),
					    resume = ev.stun(resume),
					    root = cat.gun.back(-1),
					    seen = cat.seen = {};
					cat.pseudo = cat.put = Gun.state.ify(Gun.node.ify({}, soul));
					root.get(rel).on(each, { change: true });
					function each(change) {
						Gun.node.is(change, map);
					}
					function map(rel, soul) {
						if (soul !== Gun.val.rel.is(rel)) {
							return;
						}
						if (seen[soul]) {
							return;
						}
						seen[soul] = root.get(soul).on(on, true);
					}
					function on(put) {
						if (!put) {
							return;
						}
						cat.pseudo = Gun.HAM.union(cat.pseudo, put) || cat.pseudo;
						cat.change = cat.changed = put;
						cat.put = cat.pseudo;
						resume({
							gun: cat.gun,
							put: cat.pseudo,
							get: soul
							//via: this.at
						});
					}
				}
				var obj = Gun.obj,
				    obj_has = obj.has;
			})();
		})(require, './key');
	
		;require(function (module) {
			var Gun = require('./core');
			Gun.chain.path = function (field, cb, opt) {
				var back = this,
				    gun = back,
				    tmp;
				opt = opt || {};opt.path = true;
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
					return;
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
					async[soul] = graph[soul] || node;
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
						node = graph[soul] || all[soul];
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
					data = Gun.state.ify(u, field, Gun.state.is(data, field), data[field], soul);
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
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(5)(module)))

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	"use strict";
	
	module.exports = function (module) {
		if (!module.webpackPolyfill) {
			module.deprecate = function () {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var indexPartial = __webpack_require__(7);
	
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
/* 7 */
/***/ (function(module, exports) {

	module.exports = "<p>index</p>\n"

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var roadmapPartial = __webpack_require__(9);
	
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
/* 9 */
/***/ (function(module, exports) {

	module.exports = "<span class=\"roadmap\">\n    <details>\n    <summary>road map</summary>\n    <ul>\n        <li><del><a href=\"https://github.com/colealbon/hotlips/commit/3b70981cbe4e11e1400ae8e948a06e3582d9c2d2\">Install node/koa/webpack</a></del></li>\n        <li><del><a href=\"https://github.com/colealbon/hotlips/issues/2\">Install gundb</a></del></li>\n        <li><del>make a <a href=\"#/deck\">deck</a> of cards</del></li>\n        <li><del>Alice and Bob <a href=\"#/message\">identify</a></del></li>\n        <li><del>Alice and Bob <a href=\"#/connect\">connect</a></del></li>\n        <li><del>Alice and Bob <a href=\"https://github.com/colealbon/streamliner\">exchange keys</a></del?</li>\n        <li>Alice and Bob agree on a certain \"<a href=\"#/deck\">deck</a>\" of cards. In practice, this means they agree on a set of numbers or other data such that each element of the set represents a card.</li>\n        <li>Alice picks an encryption key A and uses this to encrypt each card of the deck.</li>\n        <li>Alice <a href=\"https://bost.ocks.org/mike/shuffle/\">shuffles</a> the cards.</li>\n        <li>Alice passes the encrypted and shuffled deck to Bob. With the encryption in place, Bob cannot know which card is which.</li>\n        <li>Bob shuffles the deck.</li>\n        <li>Bob passes the double encrypted and shuffled deck back to Alice.</li>\n        <li>Alice decrypts each card using her key A. This still leaves Bob's encryption in place though so she cannot know which card is which.</li>\n        <li>Alice picks one encryption key for each card (A1, A2, etc.) and encrypts them individually.</li>\n        <li>Alice passes the deck to Bob.</li>\n        <li>Bob decrypts each card using his key B. This still leaves Alice's individual encryption in place though so he cannot know which card is which.</li>\n        <li>Bob picks one encryption key for each card (B1, B2, etc.) and encrypts them individually.</li>\n        <li>Bob passes the deck back to Alice.</li>\n        <li>Alice publishes the deck for everyone playing (in this case only Alice and Bob, see below on expansion though).</li>\n    </ul>\n</details>\n</span>\n"

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var contactPartial = __webpack_require__(11);
	
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
/* 11 */
/***/ (function(module, exports) {

	module.exports = "<span class=\"contact\">\n    Cole Albon<br>\n    <a href=\"tel:+14156721648\">(415) 672-1648</a><br>\n    <a href=\"mailto:cole.albon@gmail.com\">cole.albon@gmail.com</a><br>\n    <a href=\"https://github.com/colealbon\">https://github.com/colealbon</a><br>\n    <a href=\"https://www.linkedin.com/in/cole-albon-5934634\">\n        <span id=\"linkedinaddress\" class=\"linkedinaddress\">https://www.linkedin.com/in/cole-albon-5934634</span>\n    </a><br>\n</span>\n"

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var clientPubkeyFormPartial = __webpack_require__(13);
	
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
/* 13 */
/***/ (function(module, exports) {

	module.exports = "<form\n    id=\"message_form\"\n    onsubmit=\"\n     var gun = Gun(location.origin + '/gun');\n     openpgp.config.aead_protect = true\n     openpgp.initWorker({ path:'/js/openpgp.worker.js' })\n     if (!message_txt.value) {\n          return false\n     }\n     window.handlePost(message_txt.value)(openpgp)(window.localStorage)('royale').then(result => {if (result) {console.log(result)}}).catch(err => console.error(err));document.getElementById('message_txt').value = ''; return false\"\n    method=\"post\"\n    action=\"/message\">\n    <input id=\"message_form_input\"\n        type=\"submit\"\n        value=\"post message\"\n        form=\"message_form\"\n        >\n</form>\n<textarea\n    id=\"message_txt\"\n    name=\"message_txt\"\n    form=\"message_form\"\n    rows=51\n    cols=70\n    placeholder=\"paste plaintext message, public key, or private key\"\n    style=\"font-family:Menlo,Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New, monospace;\"\n    >\n</textarea>\n"

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var freshDeckPartial = __webpack_require__(15);
	
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
	                var colorOverride = this.querySelector('span') ? this.querySelector('span').style.color : null;
	                if (colorOverride) {
	                    clone.querySelector('svg').style.fill = this.querySelector('span').style.color;
	                }
	                root.appendChild(clone);
	            }
	        }
	    })
	});

/***/ }),
/* 15 */
/***/ (function(module, exports) {

	module.exports = "    <div id=\"deck\" class=\"deck\">\n    <template id=\"█\"><svg viewBox=\"24 62 247 343\"><path d=\"M61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM70.3125 362.25 L70.3125 110.1094 L224.2969 110.1094 L224.2969 362.25 L70.3125 362.25 Z\"/></svg></template>\n    <template id=\"♠A\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.6719 115.7344 L91.8281 175.7812 L129.5156 175.7812 L110.6719 115.7344 ZM99.9844 101.6719 L121.6406 101.6719 L162.1406 219.2344 L143.5781 219.2344 L134.0156 188.5781 L87.6094 188.5781 L78.0469 219.2344 L59.4844 219.2344 L99.9844 101.6719 Z\"/></svg></template>\n    <template id=\"♠2\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM86.3438 203.0625 L145.9688 203.0625 L145.9688 219.0938 L61.875 219.0938 L61.875 203.625 Q66.6562 199.2656 75.5156 191.3906 Q123.8906 148.5 123.8906 135.2812 Q123.8906 126 116.5781 120.3047 Q109.2656 114.6094 97.3125 114.6094 Q90 114.6094 81.4219 117.0703 Q72.8438 119.5312 62.7188 124.4531 L62.7188 107.1562 Q73.5469 103.2188 82.8984 101.25 Q92.25 99.2812 100.2656 99.2812 Q120.6562 99.2812 132.8906 108.5625 Q145.125 117.8438 145.125 133.0312 Q145.125 152.5781 98.5781 192.5156 Q90.7031 199.2656 86.3438 203.0625 Z\"/></svg></template>\n    <template id=\"♠3\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM121.7812 155.5312 Q134.7188 158.0625 141.8203 165.7266 Q148.9219 173.3906 148.9219 184.9219 Q148.9219 202.3594 135.5625 211.7812 Q122.2031 221.2031 97.3125 221.2031 Q89.2969 221.2031 80.5078 219.7266 Q71.7188 218.25 61.875 215.4375 L61.875 198.4219 Q69.1875 202.2188 77.5547 204.0469 Q85.9219 205.875 95.3438 205.875 Q110.6719 205.875 119.1094 200.3203 Q127.5469 194.7656 127.5469 184.9219 Q127.5469 174.5156 119.7422 169.1719 Q111.9375 163.8281 96.75 163.8281 L84.6562 163.8281 L84.6562 148.6406 L97.875 148.6406 Q111.0938 148.6406 117.9141 144.2109 Q124.7344 139.7812 124.7344 131.3438 Q124.7344 123.1875 117.7031 118.8984 Q110.6719 114.6094 97.3125 114.6094 Q91.6875 114.6094 84.5156 115.875 Q77.3438 117.1406 65.9531 120.375 L65.9531 104.2031 Q76.2188 101.8125 85.2188 100.5469 Q94.2188 99.2812 101.9531 99.2812 Q122.2031 99.2812 134.0859 107.5781 Q145.9688 115.875 145.9688 129.7969 Q145.9688 139.5 139.6406 146.25 Q133.3125 153 121.7812 155.5312 Z\"/></svg></template>\n    <template id=\"♠4\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM120.0938 118.6875 L76.6406 177.6094 L120.0938 177.6094 L120.0938 118.6875 ZM117 101.6719 L140.3438 101.6719 L140.3438 177.6094 L159.3281 177.6094 L159.3281 192.9375 L140.3438 192.9375 L140.3438 219.0938 L120.0938 219.0938 L120.0938 192.9375 L61.875 192.9375 L61.875 175.9219 L117 101.6719 Z\"/></svg></template>\n    <template id=\"♠5\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM67.5 101.6719 L139.2188 101.6719 L139.2188 115.0312 L84.2344 115.0312 L84.2344 143.7188 Q88.1719 142.4531 92.25 141.8906 Q96.1875 141.3281 100.125 141.3281 Q122.7656 141.3281 135.9844 152.1562 Q149.2031 162.8438 149.2031 181.2656 Q149.2031 200.25 135.5625 210.7969 Q122.0625 221.2031 97.3125 221.2031 Q88.875 221.2031 80.0156 219.9375 Q71.1562 218.6719 61.875 216.1406 L61.875 200.25 Q69.8906 204.0469 78.6094 206.0156 Q87.3281 207.8438 97.0312 207.8438 Q112.6406 207.8438 121.7812 200.6719 Q130.9219 193.5 130.9219 181.2656 Q130.9219 169.0312 121.7812 161.8594 Q112.6406 154.6875 97.0312 154.6875 Q89.7188 154.6875 82.4062 156.0938 Q75.0938 157.5 67.5 160.4531 L67.5 101.6719 Z\"/></svg></template>\n    <template id=\"♠6\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.1094 153.7031 Q97.7344 153.7031 90.5625 161.0156 Q83.3906 168.4688 83.3906 181.2656 Q83.3906 193.9219 90.5625 201.2344 Q97.7344 208.6875 110.1094 208.6875 Q122.3438 208.6875 129.5156 201.2344 Q136.6875 193.9219 136.6875 181.2656 Q136.6875 168.4688 129.5156 161.0156 Q122.3438 153.7031 110.1094 153.7031 ZM146.3906 103.9219 L146.3906 118.4062 Q139.5 115.5938 132.4688 114.1875 Q125.4375 112.6406 118.5469 112.6406 Q100.5469 112.6406 90.9844 123.1875 Q81.4219 133.875 80.0156 155.3906 Q85.3594 148.5 93.375 144.8438 Q101.5312 141.1875 111.0938 141.1875 Q131.4844 141.1875 143.2969 151.875 Q155.1094 162.7031 155.1094 181.2656 Q155.1094 199.125 142.7344 210.2344 Q130.5 221.2031 110.1094 221.2031 Q86.625 221.2031 74.25 205.5938 Q61.875 189.9844 61.875 160.1719 Q61.875 132.3281 77.0625 115.875 Q92.25 99.2812 117.8438 99.2812 Q124.7344 99.2812 131.7656 100.4062 Q138.7969 101.6719 146.3906 103.9219 Z\"/></svg></template>\n    <template id=\"♠7\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L148.6406 101.6719 L148.6406 108.4219 L99.7031 219.0938 L80.5781 219.0938 L126.7031 115.0312 L61.875 115.0312 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♠8\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM108.2812 163.125 Q95.2031 163.125 87.75 169.3125 Q80.2969 175.3594 80.2969 185.9062 Q80.2969 196.5938 87.75 202.6406 Q95.2031 208.6875 108.2812 208.6875 Q121.2188 208.6875 128.8125 202.5 Q136.2656 196.4531 136.2656 185.9062 Q136.2656 175.3594 128.8125 169.3125 Q121.3594 163.125 108.2812 163.125 ZM90 156.2344 Q78.1875 153.7031 71.7188 146.8125 Q65.1094 139.7812 65.1094 129.6562 Q65.1094 115.5938 76.6406 107.4375 Q88.1719 99.2812 108.2812 99.2812 Q128.3906 99.2812 139.9219 107.4375 Q151.3125 115.5938 151.3125 129.6562 Q151.3125 140.0625 144.8438 146.8125 Q138.2344 153.7031 126.5625 156.2344 Q139.2188 158.7656 147.0938 166.9219 Q154.5469 174.6562 154.5469 185.9062 Q154.5469 202.9219 142.5938 212.0625 Q130.5 221.2031 108.2812 221.2031 Q85.9219 221.2031 73.9688 212.0625 Q61.875 202.9219 61.875 185.9062 Q61.875 174.9375 69.3281 166.9219 Q76.9219 159.0469 90 156.2344 ZM83.25 131.2031 Q83.25 140.0625 89.8594 145.4062 Q96.3281 150.6094 108.2812 150.6094 Q119.6719 150.6094 126.5625 145.4062 Q133.3125 140.3438 133.3125 131.2031 Q133.3125 122.3438 126.5625 117 Q119.9531 111.7969 108.2812 111.7969 Q96.6094 111.7969 89.8594 117 Q83.25 122.0625 83.25 131.2031 Z\"/></svg></template>\n    <template id=\"♠9\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM70.5938 216.5625 L70.5938 202.0781 Q77.4844 204.8906 84.5156 206.4375 Q91.5469 207.8438 98.2969 207.8438 Q116.4375 207.8438 126 197.2969 Q135.4219 186.75 136.8281 165.0938 Q131.9062 171.7031 123.4688 175.5 Q115.4531 179.1562 105.75 179.1562 Q85.5 179.1562 73.6875 168.4688 Q61.875 157.7812 61.875 139.2188 Q61.875 121.0781 74.1094 110.25 Q86.4844 99.2812 106.875 99.2812 Q130.3594 99.2812 142.5938 114.8906 Q154.9688 130.5 154.9688 160.3125 Q154.9688 188.1562 139.9219 204.6094 Q124.7344 221.2031 99.1406 221.2031 Q92.25 221.2031 85.2188 220.0781 Q78.1875 218.8125 70.5938 216.5625 ZM106.875 166.7812 Q119.25 166.7812 126.4219 159.4688 Q133.5938 152.1562 133.5938 139.2188 Q133.5938 126.5625 126.4219 119.25 Q119.25 111.7969 106.875 111.7969 Q94.9219 111.7969 87.4688 119.25 Q80.1562 126.5625 80.1562 139.2188 Q80.1562 152.1562 87.4688 159.4688 Q94.6406 166.7812 106.875 166.7812 Z\"/></svg></template>\n    <template id=\"♠10\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM159.0469 111.7969 Q149.0625 111.7969 142.0312 123.8906 Q134.8594 135.9844 134.8594 160.1719 Q134.8594 184.5 142.0312 196.5938 Q149.0625 208.6875 159.0469 208.6875 Q169.0312 208.6875 176.0625 196.5938 Q183.2344 184.5 183.2344 160.1719 Q183.2344 135.9844 176.0625 123.8906 Q169.0312 111.7969 159.0469 111.7969 ZM159.0469 99.2812 Q177.4688 99.2812 189.4219 114.8906 Q201.375 130.5 201.375 160.1719 Q201.375 189.9844 189.4219 205.5938 Q177.4688 221.2031 159.0469 221.2031 Q136.2656 221.2031 126.4219 205.5938 Q116.5781 189.9844 116.5781 160.1719 Q116.5781 130.5 126.4219 114.8906 Q136.2656 99.2812 159.0469 99.2812 ZM80.5781 219.0938 L80.5781 117.7031 L61.875 123.4688 L61.875 107.1562 L81.5625 101.6719 L100.8281 101.6719 L100.8281 219.0938 L80.5781 219.0938 Z\"/></svg></template>\n    <template id=\"♠J\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM89.1562 101.6719 L107.0156 101.6719 L107.0156 178.7344 Q107.0156 199.6875 97.875 209.5312 Q88.875 219.2344 68.7656 219.2344 L61.875 219.2344 L61.875 205.7344 L67.5 205.7344 Q79.3125 205.7344 84.2344 199.8281 Q89.1562 193.9219 89.1562 178.7344 L89.1562 101.6719 Z\"/></svg></template>\n    <template id=\"♠Q\"><svg viewBox=\"24 62 247 343\"><path d=\"M107.2969 221.0625 Q106.7344 221.0625 105.5391 221.1328 Q104.3438 221.2031 103.6406 221.2031 Q81.4219 221.2031 70.5234 206.0859 Q59.625 190.9688 59.625 160.3125 Q59.625 129.5156 70.5938 114.3984 Q81.5625 99.2812 103.7812 99.2812 Q126.1406 99.2812 137.1094 114.3984 Q148.0781 129.5156 148.0781 160.3125 Q148.0781 183.5156 142.0312 197.6484 Q135.9844 211.7812 123.6094 217.4062 L141.3281 232.3125 L127.9688 240.1875 L107.2969 221.0625 ZM129.375 160.3125 Q129.375 134.4375 123.3984 123.3281 Q117.4219 112.2188 103.7812 112.2188 Q90.2812 112.2188 84.3047 123.3281 Q78.3281 134.4375 78.3281 160.3125 Q78.3281 186.1875 84.3047 197.2969 Q90.2812 208.4062 103.7812 208.4062 Q117.4219 208.4062 123.3984 197.2969 Q129.375 186.1875 129.375 160.3125 ZM174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 Z\"/></svg></template>\n    <template id=\"♠K\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L79.7344 101.6719 L79.7344 151.3125 L130.6406 101.6719 L153.7031 101.6719 L96.4688 156.5156 L158.3438 219.2344 L134.8594 219.2344 L79.7344 162.5625 L79.7344 219.2344 L61.875 219.2344 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♥A\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.6719 115.7344 L91.8281 175.7812 L129.5156 175.7812 L110.6719 115.7344 ZM99.9844 101.6719 L121.6406 101.6719 L162.1406 219.2344 L143.5781 219.2344 L134.0156 188.5781 L87.6094 188.5781 L78.0469 219.2344 L59.4844 219.2344 L99.9844 101.6719 Z\"/></svg></template>\n    <template id=\"♥2\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM86.3438 203.0625 L145.9688 203.0625 L145.9688 219.0938 L61.875 219.0938 L61.875 203.625 Q66.6562 199.2656 75.5156 191.3906 Q123.8906 148.5 123.8906 135.2812 Q123.8906 126 116.5781 120.3047 Q109.2656 114.6094 97.3125 114.6094 Q90 114.6094 81.4219 117.0703 Q72.8438 119.5312 62.7188 124.4531 L62.7188 107.1562 Q73.5469 103.2188 82.8984 101.25 Q92.25 99.2812 100.2656 99.2812 Q120.6562 99.2812 132.8906 108.5625 Q145.125 117.8438 145.125 133.0312 Q145.125 152.5781 98.5781 192.5156 Q90.7031 199.2656 86.3438 203.0625 Z\"/></svg></template>\n    <template id=\"♥3\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM121.7812 155.5312 Q134.7188 158.0625 141.8203 165.7266 Q148.9219 173.3906 148.9219 184.9219 Q148.9219 202.3594 135.5625 211.7812 Q122.2031 221.2031 97.3125 221.2031 Q89.2969 221.2031 80.5078 219.7266 Q71.7188 218.25 61.875 215.4375 L61.875 198.4219 Q69.1875 202.2188 77.5547 204.0469 Q85.9219 205.875 95.3438 205.875 Q110.6719 205.875 119.1094 200.3203 Q127.5469 194.7656 127.5469 184.9219 Q127.5469 174.5156 119.7422 169.1719 Q111.9375 163.8281 96.75 163.8281 L84.6562 163.8281 L84.6562 148.6406 L97.875 148.6406 Q111.0938 148.6406 117.9141 144.2109 Q124.7344 139.7812 124.7344 131.3438 Q124.7344 123.1875 117.7031 118.8984 Q110.6719 114.6094 97.3125 114.6094 Q91.6875 114.6094 84.5156 115.875 Q77.3438 117.1406 65.9531 120.375 L65.9531 104.2031 Q76.2188 101.8125 85.2188 100.5469 Q94.2188 99.2812 101.9531 99.2812 Q122.2031 99.2812 134.0859 107.5781 Q145.9688 115.875 145.9688 129.7969 Q145.9688 139.5 139.6406 146.25 Q133.3125 153 121.7812 155.5312 Z\"/></svg></template>\n    <template id=\"♥4\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM120.0938 118.6875 L76.6406 177.6094 L120.0938 177.6094 L120.0938 118.6875 ZM117 101.6719 L140.3438 101.6719 L140.3438 177.6094 L159.3281 177.6094 L159.3281 192.9375 L140.3438 192.9375 L140.3438 219.0938 L120.0938 219.0938 L120.0938 192.9375 L61.875 192.9375 L61.875 175.9219 L117 101.6719 Z\"/></svg></template>\n    <template id=\"♥5\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM67.5 101.6719 L139.2188 101.6719 L139.2188 115.0312 L84.2344 115.0312 L84.2344 143.7188 Q88.1719 142.4531 92.25 141.8906 Q96.1875 141.3281 100.125 141.3281 Q122.7656 141.3281 135.9844 152.1562 Q149.2031 162.8438 149.2031 181.2656 Q149.2031 200.25 135.5625 210.7969 Q122.0625 221.2031 97.3125 221.2031 Q88.875 221.2031 80.0156 219.9375 Q71.1562 218.6719 61.875 216.1406 L61.875 200.25 Q69.8906 204.0469 78.6094 206.0156 Q87.3281 207.8438 97.0312 207.8438 Q112.6406 207.8438 121.7812 200.6719 Q130.9219 193.5 130.9219 181.2656 Q130.9219 169.0312 121.7812 161.8594 Q112.6406 154.6875 97.0312 154.6875 Q89.7188 154.6875 82.4062 156.0938 Q75.0938 157.5 67.5 160.4531 L67.5 101.6719 Z\"/></svg></template>\n    <template id=\"♥6\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.1094 153.7031 Q97.7344 153.7031 90.5625 161.0156 Q83.3906 168.4688 83.3906 181.2656 Q83.3906 193.9219 90.5625 201.2344 Q97.7344 208.6875 110.1094 208.6875 Q122.3438 208.6875 129.5156 201.2344 Q136.6875 193.9219 136.6875 181.2656 Q136.6875 168.4688 129.5156 161.0156 Q122.3438 153.7031 110.1094 153.7031 ZM146.3906 103.9219 L146.3906 118.4062 Q139.5 115.5938 132.4688 114.1875 Q125.4375 112.6406 118.5469 112.6406 Q100.5469 112.6406 90.9844 123.1875 Q81.4219 133.875 80.0156 155.3906 Q85.3594 148.5 93.375 144.8438 Q101.5312 141.1875 111.0938 141.1875 Q131.4844 141.1875 143.2969 151.875 Q155.1094 162.7031 155.1094 181.2656 Q155.1094 199.125 142.7344 210.2344 Q130.5 221.2031 110.1094 221.2031 Q86.625 221.2031 74.25 205.5938 Q61.875 189.9844 61.875 160.1719 Q61.875 132.3281 77.0625 115.875 Q92.25 99.2812 117.8438 99.2812 Q124.7344 99.2812 131.7656 100.4062 Q138.7969 101.6719 146.3906 103.9219 Z\"/></svg></template>\n    <template id=\"♥7\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L148.6406 101.6719 L148.6406 108.4219 L99.7031 219.0938 L80.5781 219.0938 L126.7031 115.0312 L61.875 115.0312 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♥8\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM108.2812 163.125 Q95.2031 163.125 87.75 169.3125 Q80.2969 175.3594 80.2969 185.9062 Q80.2969 196.5938 87.75 202.6406 Q95.2031 208.6875 108.2812 208.6875 Q121.2188 208.6875 128.8125 202.5 Q136.2656 196.4531 136.2656 185.9062 Q136.2656 175.3594 128.8125 169.3125 Q121.3594 163.125 108.2812 163.125 ZM90 156.2344 Q78.1875 153.7031 71.7188 146.8125 Q65.1094 139.7812 65.1094 129.6562 Q65.1094 115.5938 76.6406 107.4375 Q88.1719 99.2812 108.2812 99.2812 Q128.3906 99.2812 139.9219 107.4375 Q151.3125 115.5938 151.3125 129.6562 Q151.3125 140.0625 144.8438 146.8125 Q138.2344 153.7031 126.5625 156.2344 Q139.2188 158.7656 147.0938 166.9219 Q154.5469 174.6562 154.5469 185.9062 Q154.5469 202.9219 142.5938 212.0625 Q130.5 221.2031 108.2812 221.2031 Q85.9219 221.2031 73.9688 212.0625 Q61.875 202.9219 61.875 185.9062 Q61.875 174.9375 69.3281 166.9219 Q76.9219 159.0469 90 156.2344 ZM83.25 131.2031 Q83.25 140.0625 89.8594 145.4062 Q96.3281 150.6094 108.2812 150.6094 Q119.6719 150.6094 126.5625 145.4062 Q133.3125 140.3438 133.3125 131.2031 Q133.3125 122.3438 126.5625 117 Q119.9531 111.7969 108.2812 111.7969 Q96.6094 111.7969 89.8594 117 Q83.25 122.0625 83.25 131.2031 Z\"/></svg></template>\n    <template id=\"♥9\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM70.5938 216.5625 L70.5938 202.0781 Q77.4844 204.8906 84.5156 206.4375 Q91.5469 207.8438 98.2969 207.8438 Q116.4375 207.8438 126 197.2969 Q135.4219 186.75 136.8281 165.0938 Q131.9062 171.7031 123.4688 175.5 Q115.4531 179.1562 105.75 179.1562 Q85.5 179.1562 73.6875 168.4688 Q61.875 157.7812 61.875 139.2188 Q61.875 121.0781 74.1094 110.25 Q86.4844 99.2812 106.875 99.2812 Q130.3594 99.2812 142.5938 114.8906 Q154.9688 130.5 154.9688 160.3125 Q154.9688 188.1562 139.9219 204.6094 Q124.7344 221.2031 99.1406 221.2031 Q92.25 221.2031 85.2188 220.0781 Q78.1875 218.8125 70.5938 216.5625 ZM106.875 166.7812 Q119.25 166.7812 126.4219 159.4688 Q133.5938 152.1562 133.5938 139.2188 Q133.5938 126.5625 126.4219 119.25 Q119.25 111.7969 106.875 111.7969 Q94.9219 111.7969 87.4688 119.25 Q80.1562 126.5625 80.1562 139.2188 Q80.1562 152.1562 87.4688 159.4688 Q94.6406 166.7812 106.875 166.7812 Z\"/></svg></template>\n    <template id=\"♥10\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM159.0469 111.7969 Q149.0625 111.7969 142.0312 123.8906 Q134.8594 135.9844 134.8594 160.1719 Q134.8594 184.5 142.0312 196.5938 Q149.0625 208.6875 159.0469 208.6875 Q169.0312 208.6875 176.0625 196.5938 Q183.2344 184.5 183.2344 160.1719 Q183.2344 135.9844 176.0625 123.8906 Q169.0312 111.7969 159.0469 111.7969 ZM159.0469 99.2812 Q177.4688 99.2812 189.4219 114.8906 Q201.375 130.5 201.375 160.1719 Q201.375 189.9844 189.4219 205.5938 Q177.4688 221.2031 159.0469 221.2031 Q136.2656 221.2031 126.4219 205.5938 Q116.5781 189.9844 116.5781 160.1719 Q116.5781 130.5 126.4219 114.8906 Q136.2656 99.2812 159.0469 99.2812 ZM80.5781 219.0938 L80.5781 117.7031 L61.875 123.4688 L61.875 107.1562 L81.5625 101.6719 L100.8281 101.6719 L100.8281 219.0938 L80.5781 219.0938 Z\"/></svg></template>\n    <template id=\"♥J\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM89.1562 101.6719 L107.0156 101.6719 L107.0156 178.7344 Q107.0156 199.6875 97.875 209.5312 Q88.875 219.2344 68.7656 219.2344 L61.875 219.2344 L61.875 205.7344 L67.5 205.7344 Q79.3125 205.7344 84.2344 199.8281 Q89.1562 193.9219 89.1562 178.7344 L89.1562 101.6719 Z\"/></svg></template>\n    <template id=\"♥Q\"><svg viewBox=\"24 62 247 343\"><path d=\"M107.2969 221.0625 Q106.7344 221.0625 105.5391 221.1328 Q104.3438 221.2031 103.6406 221.2031 Q81.4219 221.2031 70.5234 206.0859 Q59.625 190.9688 59.625 160.3125 Q59.625 129.5156 70.5938 114.3984 Q81.5625 99.2812 103.7812 99.2812 Q126.1406 99.2812 137.1094 114.3984 Q148.0781 129.5156 148.0781 160.3125 Q148.0781 183.5156 142.0312 197.6484 Q135.9844 211.7812 123.6094 217.4062 L141.3281 232.3125 L127.9688 240.1875 L107.2969 221.0625 ZM129.375 160.3125 Q129.375 134.4375 123.3984 123.3281 Q117.4219 112.2188 103.7812 112.2188 Q90.2812 112.2188 84.3047 123.3281 Q78.3281 134.4375 78.3281 160.3125 Q78.3281 186.1875 84.3047 197.2969 Q90.2812 208.4062 103.7812 208.4062 Q117.4219 208.4062 123.3984 197.2969 Q129.375 186.1875 129.375 160.3125 ZM172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM64.2656 84.7969 Q47.3906 84.7969 47.3906 101.6719 L47.3906 370.6875 Q47.3906 387.5625 64.2656 387.5625 L235.125 387.5625 Q252 387.5625 252 370.6875 L252 101.6719 Q252 84.7969 235.125 84.7969 L64.2656 84.7969 ZM64.2656 67.9219 L235.125 67.9219 Q268.875 67.9219 268.875 101.6719 L268.875 370.6875 Q268.875 404.4375 235.125 404.4375 L64.2656 404.4375 Q30.5156 404.4375 30.5156 370.6875 L30.5156 101.6719 Q30.5156 67.9219 64.2656 67.9219 Z\"/></svg></template>\n    <template id=\"♥K\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L79.7344 101.6719 L79.7344 151.3125 L130.6406 101.6719 L153.7031 101.6719 L96.4688 156.5156 L158.3438 219.2344 L134.8594 219.2344 L79.7344 162.5625 L79.7344 219.2344 L61.875 219.2344 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♦A\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.6719 115.7344 L91.8281 175.7812 L129.5156 175.7812 L110.6719 115.7344 ZM99.9844 101.6719 L121.6406 101.6719 L162.1406 219.2344 L143.5781 219.2344 L134.0156 188.5781 L87.6094 188.5781 L78.0469 219.2344 L59.4844 219.2344 L99.9844 101.6719 Z\"/></svg></template>\n    <template id=\"♦2\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM86.3438 203.0625 L145.9688 203.0625 L145.9688 219.0938 L61.875 219.0938 L61.875 203.625 Q66.6562 199.2656 75.5156 191.3906 Q123.8906 148.5 123.8906 135.2812 Q123.8906 126 116.5781 120.3047 Q109.2656 114.6094 97.3125 114.6094 Q90 114.6094 81.4219 117.0703 Q72.8438 119.5312 62.7188 124.4531 L62.7188 107.1562 Q73.5469 103.2188 82.8984 101.25 Q92.25 99.2812 100.2656 99.2812 Q120.6562 99.2812 132.8906 108.5625 Q145.125 117.8438 145.125 133.0312 Q145.125 152.5781 98.5781 192.5156 Q90.7031 199.2656 86.3438 203.0625 Z\"/></svg></template>\n    <template id=\"♦3\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM121.7812 155.5312 Q134.7188 158.0625 141.8203 165.7266 Q148.9219 173.3906 148.9219 184.9219 Q148.9219 202.3594 135.5625 211.7812 Q122.2031 221.2031 97.3125 221.2031 Q89.2969 221.2031 80.5078 219.7266 Q71.7188 218.25 61.875 215.4375 L61.875 198.4219 Q69.1875 202.2188 77.5547 204.0469 Q85.9219 205.875 95.3438 205.875 Q110.6719 205.875 119.1094 200.3203 Q127.5469 194.7656 127.5469 184.9219 Q127.5469 174.5156 119.7422 169.1719 Q111.9375 163.8281 96.75 163.8281 L84.6562 163.8281 L84.6562 148.6406 L97.875 148.6406 Q111.0938 148.6406 117.9141 144.2109 Q124.7344 139.7812 124.7344 131.3438 Q124.7344 123.1875 117.7031 118.8984 Q110.6719 114.6094 97.3125 114.6094 Q91.6875 114.6094 84.5156 115.875 Q77.3438 117.1406 65.9531 120.375 L65.9531 104.2031 Q76.2188 101.8125 85.2188 100.5469 Q94.2188 99.2812 101.9531 99.2812 Q122.2031 99.2812 134.0859 107.5781 Q145.9688 115.875 145.9688 129.7969 Q145.9688 139.5 139.6406 146.25 Q133.3125 153 121.7812 155.5312 Z\"/></svg></template>\n    <template id=\"♦4\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM120.0938 118.6875 L76.6406 177.6094 L120.0938 177.6094 L120.0938 118.6875 ZM117 101.6719 L140.3438 101.6719 L140.3438 177.6094 L159.3281 177.6094 L159.3281 192.9375 L140.3438 192.9375 L140.3438 219.0938 L120.0938 219.0938 L120.0938 192.9375 L61.875 192.9375 L61.875 175.9219 L117 101.6719 Z\"/></svg></template>\n    <template id=\"♦5\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM67.5 101.6719 L139.2188 101.6719 L139.2188 115.0312 L84.2344 115.0312 L84.2344 143.7188 Q88.1719 142.4531 92.25 141.8906 Q96.1875 141.3281 100.125 141.3281 Q122.7656 141.3281 135.9844 152.1562 Q149.2031 162.8438 149.2031 181.2656 Q149.2031 200.25 135.5625 210.7969 Q122.0625 221.2031 97.3125 221.2031 Q88.875 221.2031 80.0156 219.9375 Q71.1562 218.6719 61.875 216.1406 L61.875 200.25 Q69.8906 204.0469 78.6094 206.0156 Q87.3281 207.8438 97.0312 207.8438 Q112.6406 207.8438 121.7812 200.6719 Q130.9219 193.5 130.9219 181.2656 Q130.9219 169.0312 121.7812 161.8594 Q112.6406 154.6875 97.0312 154.6875 Q89.7188 154.6875 82.4062 156.0938 Q75.0938 157.5 67.5 160.4531 L67.5 101.6719 Z\"/></svg></template>\n    <template id=\"♦6\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.1094 153.7031 Q97.7344 153.7031 90.5625 161.0156 Q83.3906 168.4688 83.3906 181.2656 Q83.3906 193.9219 90.5625 201.2344 Q97.7344 208.6875 110.1094 208.6875 Q122.3438 208.6875 129.5156 201.2344 Q136.6875 193.9219 136.6875 181.2656 Q136.6875 168.4688 129.5156 161.0156 Q122.3438 153.7031 110.1094 153.7031 ZM146.3906 103.9219 L146.3906 118.4062 Q139.5 115.5938 132.4688 114.1875 Q125.4375 112.6406 118.5469 112.6406 Q100.5469 112.6406 90.9844 123.1875 Q81.4219 133.875 80.0156 155.3906 Q85.3594 148.5 93.375 144.8438 Q101.5312 141.1875 111.0938 141.1875 Q131.4844 141.1875 143.2969 151.875 Q155.1094 162.7031 155.1094 181.2656 Q155.1094 199.125 142.7344 210.2344 Q130.5 221.2031 110.1094 221.2031 Q86.625 221.2031 74.25 205.5938 Q61.875 189.9844 61.875 160.1719 Q61.875 132.3281 77.0625 115.875 Q92.25 99.2812 117.8438 99.2812 Q124.7344 99.2812 131.7656 100.4062 Q138.7969 101.6719 146.3906 103.9219 Z\"/></svg></template>\n    <template id=\"♦7\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L148.6406 101.6719 L148.6406 108.4219 L99.7031 219.0938 L80.5781 219.0938 L126.7031 115.0312 L61.875 115.0312 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♦8\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM108.2812 163.125 Q95.2031 163.125 87.75 169.3125 Q80.2969 175.3594 80.2969 185.9062 Q80.2969 196.5938 87.75 202.6406 Q95.2031 208.6875 108.2812 208.6875 Q121.2188 208.6875 128.8125 202.5 Q136.2656 196.4531 136.2656 185.9062 Q136.2656 175.3594 128.8125 169.3125 Q121.3594 163.125 108.2812 163.125 ZM90 156.2344 Q78.1875 153.7031 71.7188 146.8125 Q65.1094 139.7812 65.1094 129.6562 Q65.1094 115.5938 76.6406 107.4375 Q88.1719 99.2812 108.2812 99.2812 Q128.3906 99.2812 139.9219 107.4375 Q151.3125 115.5938 151.3125 129.6562 Q151.3125 140.0625 144.8438 146.8125 Q138.2344 153.7031 126.5625 156.2344 Q139.2188 158.7656 147.0938 166.9219 Q154.5469 174.6562 154.5469 185.9062 Q154.5469 202.9219 142.5938 212.0625 Q130.5 221.2031 108.2812 221.2031 Q85.9219 221.2031 73.9688 212.0625 Q61.875 202.9219 61.875 185.9062 Q61.875 174.9375 69.3281 166.9219 Q76.9219 159.0469 90 156.2344 ZM83.25 131.2031 Q83.25 140.0625 89.8594 145.4062 Q96.3281 150.6094 108.2812 150.6094 Q119.6719 150.6094 126.5625 145.4062 Q133.3125 140.3438 133.3125 131.2031 Q133.3125 122.3438 126.5625 117 Q119.9531 111.7969 108.2812 111.7969 Q96.6094 111.7969 89.8594 117 Q83.25 122.0625 83.25 131.2031 Z\"/></svg></template>\n    <template id=\"♦9\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM70.5938 216.5625 L70.5938 202.0781 Q77.4844 204.8906 84.5156 206.4375 Q91.5469 207.8438 98.2969 207.8438 Q116.4375 207.8438 126 197.2969 Q135.4219 186.75 136.8281 165.0938 Q131.9062 171.7031 123.4688 175.5 Q115.4531 179.1562 105.75 179.1562 Q85.5 179.1562 73.6875 168.4688 Q61.875 157.7812 61.875 139.2188 Q61.875 121.0781 74.1094 110.25 Q86.4844 99.2812 106.875 99.2812 Q130.3594 99.2812 142.5938 114.8906 Q154.9688 130.5 154.9688 160.3125 Q154.9688 188.1562 139.9219 204.6094 Q124.7344 221.2031 99.1406 221.2031 Q92.25 221.2031 85.2188 220.0781 Q78.1875 218.8125 70.5938 216.5625 ZM106.875 166.7812 Q119.25 166.7812 126.4219 159.4688 Q133.5938 152.1562 133.5938 139.2188 Q133.5938 126.5625 126.4219 119.25 Q119.25 111.7969 106.875 111.7969 Q94.9219 111.7969 87.4688 119.25 Q80.1562 126.5625 80.1562 139.2188 Q80.1562 152.1562 87.4688 159.4688 Q94.6406 166.7812 106.875 166.7812 Z\"/></svg></template>\n    <template id=\"♦10\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM159.0469 111.7969 Q149.0625 111.7969 142.0312 123.8906 Q134.8594 135.9844 134.8594 160.1719 Q134.8594 184.5 142.0312 196.5938 Q149.0625 208.6875 159.0469 208.6875 Q169.0312 208.6875 176.0625 196.5938 Q183.2344 184.5 183.2344 160.1719 Q183.2344 135.9844 176.0625 123.8906 Q169.0312 111.7969 159.0469 111.7969 ZM159.0469 99.2812 Q177.4688 99.2812 189.4219 114.8906 Q201.375 130.5 201.375 160.1719 Q201.375 189.9844 189.4219 205.5938 Q177.4688 221.2031 159.0469 221.2031 Q136.2656 221.2031 126.4219 205.5938 Q116.5781 189.9844 116.5781 160.1719 Q116.5781 130.5 126.4219 114.8906 Q136.2656 99.2812 159.0469 99.2812 ZM80.5781 219.0938 L80.5781 117.7031 L61.875 123.4688 L61.875 107.1562 L81.5625 101.6719 L100.8281 101.6719 L100.8281 219.0938 L80.5781 219.0938 Z\"/></svg></template>\n    <template id=\"♦J\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM89.1562 101.6719 L107.0156 101.6719 L107.0156 178.7344 Q107.0156 199.6875 97.875 209.5312 Q88.875 219.2344 68.7656 219.2344 L61.875 219.2344 L61.875 205.7344 L67.5 205.7344 Q79.3125 205.7344 84.2344 199.8281 Q89.1562 193.9219 89.1562 178.7344 L89.1562 101.6719 Z\"/></svg></template>\n    <template id=\"♦Q\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM107.2969 221.0625 Q106.7344 221.0625 105.5391 221.1328 Q104.3438 221.2031 103.6406 221.2031 Q81.4219 221.2031 70.5234 206.0859 Q59.625 190.9688 59.625 160.3125 Q59.625 129.5156 70.5938 114.3984 Q81.5625 99.2812 103.7812 99.2812 Q126.1406 99.2812 137.1094 114.3984 Q148.0781 129.5156 148.0781 160.3125 Q148.0781 183.5156 142.0312 197.6484 Q135.9844 211.7812 123.6094 217.4062 L141.3281 232.3125 L127.9688 240.1875 L107.2969 221.0625 ZM129.375 160.3125 Q129.375 134.4375 123.3984 123.3281 Q117.4219 112.2188 103.7812 112.2188 Q90.2812 112.2188 84.3047 123.3281 Q78.3281 134.4375 78.3281 160.3125 Q78.3281 186.1875 84.3047 197.2969 Q90.2812 208.4062 103.7812 208.4062 Q117.4219 208.4062 123.3984 197.2969 Q129.375 186.1875 129.375 160.3125 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 Z\"/></svg></template>\n    <template id=\"♦K\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L79.7344 101.6719 L79.7344 151.3125 L130.6406 101.6719 L153.7031 101.6719 L96.4688 156.5156 L158.3438 219.2344 L134.8594 219.2344 L79.7344 162.5625 L79.7344 219.2344 L61.875 219.2344 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♣A\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.6719 115.7344 L91.8281 175.7812 L129.5156 175.7812 L110.6719 115.7344 ZM99.9844 101.6719 L121.6406 101.6719 L162.1406 219.2344 L143.5781 219.2344 L134.0156 188.5781 L87.6094 188.5781 L78.0469 219.2344 L59.4844 219.2344 L99.9844 101.6719 Z\"/></svg></template>\n    <template id=\"♣2\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM86.3438 203.0625 L145.9688 203.0625 L145.9688 219.0938 L61.875 219.0938 L61.875 203.625 Q66.6562 199.2656 75.5156 191.3906 Q123.8906 148.5 123.8906 135.2812 Q123.8906 126 116.5781 120.3047 Q109.2656 114.6094 97.3125 114.6094 Q90 114.6094 81.4219 117.0703 Q72.8438 119.5312 62.7188 124.4531 L62.7188 107.1562 Q73.5469 103.2188 82.8984 101.25 Q92.25 99.2812 100.2656 99.2812 Q120.6562 99.2812 132.8906 108.5625 Q145.125 117.8438 145.125 133.0312 Q145.125 152.5781 98.5781 192.5156 Q90.7031 199.2656 86.3438 203.0625 Z\"/></svg></template>\n    <template id=\"♣3\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM121.7812 155.5312 Q134.7188 158.0625 141.8203 165.7266 Q148.9219 173.3906 148.9219 184.9219 Q148.9219 202.3594 135.5625 211.7812 Q122.2031 221.2031 97.3125 221.2031 Q89.2969 221.2031 80.5078 219.7266 Q71.7188 218.25 61.875 215.4375 L61.875 198.4219 Q69.1875 202.2188 77.5547 204.0469 Q85.9219 205.875 95.3438 205.875 Q110.6719 205.875 119.1094 200.3203 Q127.5469 194.7656 127.5469 184.9219 Q127.5469 174.5156 119.7422 169.1719 Q111.9375 163.8281 96.75 163.8281 L84.6562 163.8281 L84.6562 148.6406 L97.875 148.6406 Q111.0938 148.6406 117.9141 144.2109 Q124.7344 139.7812 124.7344 131.3438 Q124.7344 123.1875 117.7031 118.8984 Q110.6719 114.6094 97.3125 114.6094 Q91.6875 114.6094 84.5156 115.875 Q77.3438 117.1406 65.9531 120.375 L65.9531 104.2031 Q76.2188 101.8125 85.2188 100.5469 Q94.2188 99.2812 101.9531 99.2812 Q122.2031 99.2812 134.0859 107.5781 Q145.9688 115.875 145.9688 129.7969 Q145.9688 139.5 139.6406 146.25 Q133.3125 153 121.7812 155.5312 Z\"/></svg></template>\n    <template id=\"♣4\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM120.0938 118.6875 L76.6406 177.6094 L120.0938 177.6094 L120.0938 118.6875 ZM117 101.6719 L140.3438 101.6719 L140.3438 177.6094 L159.3281 177.6094 L159.3281 192.9375 L140.3438 192.9375 L140.3438 219.0938 L120.0938 219.0938 L120.0938 192.9375 L61.875 192.9375 L61.875 175.9219 L117 101.6719 Z\"/></svg></template>\n    <template id=\"♣5\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM67.5 101.6719 L139.2188 101.6719 L139.2188 115.0312 L84.2344 115.0312 L84.2344 143.7188 Q88.1719 142.4531 92.25 141.8906 Q96.1875 141.3281 100.125 141.3281 Q122.7656 141.3281 135.9844 152.1562 Q149.2031 162.8438 149.2031 181.2656 Q149.2031 200.25 135.5625 210.7969 Q122.0625 221.2031 97.3125 221.2031 Q88.875 221.2031 80.0156 219.9375 Q71.1562 218.6719 61.875 216.1406 L61.875 200.25 Q69.8906 204.0469 78.6094 206.0156 Q87.3281 207.8438 97.0312 207.8438 Q112.6406 207.8438 121.7812 200.6719 Q130.9219 193.5 130.9219 181.2656 Q130.9219 169.0312 121.7812 161.8594 Q112.6406 154.6875 97.0312 154.6875 Q89.7188 154.6875 82.4062 156.0938 Q75.0938 157.5 67.5 160.4531 L67.5 101.6719 Z\"/></svg></template>\n    <template id=\"♣6\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.1094 153.7031 Q97.7344 153.7031 90.5625 161.0156 Q83.3906 168.4688 83.3906 181.2656 Q83.3906 193.9219 90.5625 201.2344 Q97.7344 208.6875 110.1094 208.6875 Q122.3438 208.6875 129.5156 201.2344 Q136.6875 193.9219 136.6875 181.2656 Q136.6875 168.4688 129.5156 161.0156 Q122.3438 153.7031 110.1094 153.7031 ZM146.3906 103.9219 L146.3906 118.4062 Q139.5 115.5938 132.4688 114.1875 Q125.4375 112.6406 118.5469 112.6406 Q100.5469 112.6406 90.9844 123.1875 Q81.4219 133.875 80.0156 155.3906 Q85.3594 148.5 93.375 144.8438 Q101.5312 141.1875 111.0938 141.1875 Q131.4844 141.1875 143.2969 151.875 Q155.1094 162.7031 155.1094 181.2656 Q155.1094 199.125 142.7344 210.2344 Q130.5 221.2031 110.1094 221.2031 Q86.625 221.2031 74.25 205.5938 Q61.875 189.9844 61.875 160.1719 Q61.875 132.3281 77.0625 115.875 Q92.25 99.2812 117.8438 99.2812 Q124.7344 99.2812 131.7656 100.4062 Q138.7969 101.6719 146.3906 103.9219 Z\"/></svg></template>\n    <template id=\"♣7\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L148.6406 101.6719 L148.6406 108.4219 L99.7031 219.0938 L80.5781 219.0938 L126.7031 115.0312 L61.875 115.0312 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♣8\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM108.2812 163.125 Q95.2031 163.125 87.75 169.3125 Q80.2969 175.3594 80.2969 185.9062 Q80.2969 196.5938 87.75 202.6406 Q95.2031 208.6875 108.2812 208.6875 Q121.2188 208.6875 128.8125 202.5 Q136.2656 196.4531 136.2656 185.9062 Q136.2656 175.3594 128.8125 169.3125 Q121.3594 163.125 108.2812 163.125 ZM90 156.2344 Q78.1875 153.7031 71.7188 146.8125 Q65.1094 139.7812 65.1094 129.6562 Q65.1094 115.5938 76.6406 107.4375 Q88.1719 99.2812 108.2812 99.2812 Q128.3906 99.2812 139.9219 107.4375 Q151.3125 115.5938 151.3125 129.6562 Q151.3125 140.0625 144.8438 146.8125 Q138.2344 153.7031 126.5625 156.2344 Q139.2188 158.7656 147.0938 166.9219 Q154.5469 174.6562 154.5469 185.9062 Q154.5469 202.9219 142.5938 212.0625 Q130.5 221.2031 108.2812 221.2031 Q85.9219 221.2031 73.9688 212.0625 Q61.875 202.9219 61.875 185.9062 Q61.875 174.9375 69.3281 166.9219 Q76.9219 159.0469 90 156.2344 ZM83.25 131.2031 Q83.25 140.0625 89.8594 145.4062 Q96.3281 150.6094 108.2812 150.6094 Q119.6719 150.6094 126.5625 145.4062 Q133.3125 140.3438 133.3125 131.2031 Q133.3125 122.3438 126.5625 117 Q119.9531 111.7969 108.2812 111.7969 Q96.6094 111.7969 89.8594 117 Q83.25 122.0625 83.25 131.2031 Z\"/></svg></template>\n    <template id=\"♣9\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM70.5938 216.5625 L70.5938 202.0781 Q77.4844 204.8906 84.5156 206.4375 Q91.5469 207.8438 98.2969 207.8438 Q116.4375 207.8438 126 197.2969 Q135.4219 186.75 136.8281 165.0938 Q131.9062 171.7031 123.4688 175.5 Q115.4531 179.1562 105.75 179.1562 Q85.5 179.1562 73.6875 168.4688 Q61.875 157.7812 61.875 139.2188 Q61.875 121.0781 74.1094 110.25 Q86.4844 99.2812 106.875 99.2812 Q130.3594 99.2812 142.5938 114.8906 Q154.9688 130.5 154.9688 160.3125 Q154.9688 188.1562 139.9219 204.6094 Q124.7344 221.2031 99.1406 221.2031 Q92.25 221.2031 85.2188 220.0781 Q78.1875 218.8125 70.5938 216.5625 ZM106.875 166.7812 Q119.25 166.7812 126.4219 159.4688 Q133.5938 152.1562 133.5938 139.2188 Q133.5938 126.5625 126.4219 119.25 Q119.25 111.7969 106.875 111.7969 Q94.9219 111.7969 87.4688 119.25 Q80.1562 126.5625 80.1562 139.2188 Q80.1562 152.1562 87.4688 159.4688 Q94.6406 166.7812 106.875 166.7812 Z\"/></svg></template>\n    <template id=\"♣10\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM159.0469 111.7969 Q149.0625 111.7969 142.0312 123.8906 Q134.8594 135.9844 134.8594 160.1719 Q134.8594 184.5 142.0312 196.5938 Q149.0625 208.6875 159.0469 208.6875 Q169.0312 208.6875 176.0625 196.5938 Q183.2344 184.5 183.2344 160.1719 Q183.2344 135.9844 176.0625 123.8906 Q169.0312 111.7969 159.0469 111.7969 ZM159.0469 99.2812 Q177.4688 99.2812 189.4219 114.8906 Q201.375 130.5 201.375 160.1719 Q201.375 189.9844 189.4219 205.5938 Q177.4688 221.2031 159.0469 221.2031 Q136.2656 221.2031 126.4219 205.5938 Q116.5781 189.9844 116.5781 160.1719 Q116.5781 130.5 126.4219 114.8906 Q136.2656 99.2812 159.0469 99.2812 ZM80.5781 219.0938 L80.5781 117.7031 L61.875 123.4688 L61.875 107.1562 L81.5625 101.6719 L100.8281 101.6719 L100.8281 219.0938 L80.5781 219.0938 Z\"/></svg></template>\n    <template id=\"♣J\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM89.1562 101.6719 L107.0156 101.6719 L107.0156 178.7344 Q107.0156 199.6875 97.875 209.5312 Q88.875 219.2344 68.7656 219.2344 L61.875 219.2344 L61.875 205.7344 L67.5 205.7344 Q79.3125 205.7344 84.2344 199.8281 Q89.1562 193.9219 89.1562 178.7344 L89.1562 101.6719 Z\"/></svg></template>\n    <template id=\"♣Q\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM107.2969 221.0625 Q106.7344 221.0625 105.5391 221.1328 Q104.3438 221.2031 103.6406 221.2031 Q81.4219 221.2031 70.5234 206.0859 Q59.625 190.9688 59.625 160.3125 Q59.625 129.5156 70.5938 114.3984 Q81.5625 99.2812 103.7812 99.2812 Q126.1406 99.2812 137.1094 114.3984 Q148.0781 129.5156 148.0781 160.3125 Q148.0781 183.5156 142.0312 197.6484 Q135.9844 211.7812 123.6094 217.4062 L141.3281 232.3125 L127.9688 240.1875 L107.2969 221.0625 ZM129.375 160.3125 Q129.375 134.4375 123.3984 123.3281 Q117.4219 112.2188 103.7812 112.2188 Q90.2812 112.2188 84.3047 123.3281 Q78.3281 134.4375 78.3281 160.3125 Q78.3281 186.1875 84.3047 197.2969 Q90.2812 208.4062 103.7812 208.4062 Q117.4219 208.4062 123.3984 197.2969 Q129.375 186.1875 129.375 160.3125 Z\"/></svg></template>\n    <template id=\"♣K\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L79.7344 101.6719 L79.7344 151.3125 L130.6406 101.6719 L153.7031 101.6719 L96.4688 156.5156 L158.3438 219.2344 L134.8594 219.2344 L79.7344 162.5625 L79.7344 219.2344 L61.875 219.2344 L61.875 101.6719 Z\"/></svg></template>\n\n    <table style=\"border-width:1px\">\n        <tr width=\"100%\" height=\"10px\" style=\"visibility:visible\"}>\n            <td width=\"50px\"><playing-card><span style=\"color:blue\">&block;</span></playing-card</td>\n        </tr>\n        <tr width=\"100%\">\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;A</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;2</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;3</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;4</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;5</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;6</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;7</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;8</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;9</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;10</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;J</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;Q</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;K</span></playing-card></td>\n        </tr>\n        <tr>\n            <td><playing-card><span style=\"color:red\">&hearts;A</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;2</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;3</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;4</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;5</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;6</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;7</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;8</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;9</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;10</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;J</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;Q</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;K</span></playing-card></td>\n        </tr>\n        <tr>\n            <td><playing-card><span style=\"color:red\">&diams;A</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;2</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;3</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;4</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;5</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;6</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;7</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;8</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;9</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;10</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;J</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;Q</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;K</span></playing-card></td>\n        </tr>\n        <tr>\n            <td><playing-card><span style=\"color:black\">&clubs;A</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;2</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;3</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;4</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;5</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;6</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;7</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;8</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;9</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;10</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;J</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;Q</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;K</span></playing-card></td>\n        </tr>\n    </table>\n</div>\n"

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var connectPartial = __webpack_require__(17);
	
	var ConnectPage = exports.ConnectPage = function (_HTMLElement) {
	    _inherits(ConnectPage, _HTMLElement);
	
	    function ConnectPage() {
	        _classCallCheck(this, ConnectPage);
	
	        return _possibleConstructorReturn(this, (ConnectPage.__proto__ || Object.getPrototypeOf(ConnectPage)).apply(this, arguments));
	    }
	
	    _createClass(ConnectPage, [{
	        key: 'attachedCallback',
	        value: function attachedCallback() {
	            this.innerHTML = '<p>' + connectPartial + '</p>';
	        }
	    }]);
	
	    return ConnectPage;
	}(HTMLElement);
	
	document.registerElement("connect-page", ConnectPage);

/***/ }),
/* 17 */
/***/ (function(module, exports) {

	module.exports = "<span class=\"connect\">\n<p>This is the connect page.</p>\n<ul>\n<li>pending invitations</>\n<li>list of players</li>\n<li>connected players</li>\n\n<h1>Hello world gun app</h1>\n<p>Open your web console</p>\n</span>\n"

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOGM4NTg4YjA1MmUzZWUzNjQ2NTMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvdXRpbC5qcyIsIndlYnBhY2s6Ly8vLi9+L3Byb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlYmVsLXJvdXRlci9zcmMvcmViZWwtcm91dGVyLmpzIiwid2VicGFjazovLy8uL34vZ3VuL2d1bi5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vbW9kdWxlLmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi92aWV3cy9wYXJ0aWFscy9pbmRleC5odG1sIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9yb2FkbWFwLmpzIiwid2VicGFjazovLy8uL3ZpZXdzL3BhcnRpYWxzL3JvYWRtYXAuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvY29udGFjdC5qcyIsIndlYnBhY2s6Ly8vLi92aWV3cy9wYXJ0aWFscy9jb250YWN0Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL21lc3NhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vdmlld3MvcGFydGlhbHMvbWVzc2FnZV9mb3JtLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2RlY2suanMiLCJ3ZWJwYWNrOi8vLy4vdmlld3MvcGFydGlhbHMvZnJlc2hkZWNrLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2Nvbm5lY3QuanMiLCJ3ZWJwYWNrOi8vLy4vdmlld3MvcGFydGlhbHMvY29ubmVjdC5odG1sIl0sIm5hbWVzIjpbInV0aWwiLCJ3aW5kb3ciLCJoYW5kbGVQb3N0IiwiZGV0ZXJtaW5lQ29udGVudFR5cGUiLCJlbmNyeXB0Q2xlYXJUZXh0IiwiZGVjcnlwdFBHUE1lc3NhZ2VXaXRoS2V5IiwiZGVjcnlwdFBHUE1lc3NhZ2UiLCJQR1BQVUJLRVkiLCJDTEVBUlRFWFQiLCJQR1BQUklWS0VZIiwiUEdQTUVTU0FHRSIsImRldGVybWluZUtleVR5cGUiLCJjb250ZW50IiwiUHJvbWlzZSIsInJlamVjdCIsIm9wZW5wZ3AiLCJyZXNvbHZlIiwicHJpdmF0ZUtleXMiLCJrZXkiLCJyZWFkQXJtb3JlZCIsInByaXZhdGVLZXkiLCJrZXlzIiwidG9QdWJsaWMiLCJhcm1vciIsImVycm9yIiwicG9zc2libGVwZ3BrZXkiLCJ0aGVuIiwia2V5VHlwZSIsIm1lc3NhZ2UiLCJlcnIiLCJnZXRGcm9tU3RvcmFnZSIsImxvY2FsU3RvcmFnZSIsImluZGV4S2V5IiwiaSIsImxlbmd0aCIsImtleUFyciIsInB1c2giLCJnZXRJdGVtIiwic2F2ZVBHUFB1YmtleSIsIlBHUGtleUFybW9yIiwiUEdQa2V5IiwidXNlcnMiLCJ1c2VySWQiLCJ1c2VyaWQiLCJleGlzdGluZ0tleSIsImV4aXN0aW5nS2V5VHlwZSIsInNldEl0ZW0iLCJjYXRjaCIsInNhdmVQR1BQcml2a2V5IiwicHJvY2VzcyIsInNldEltbWVkaWF0ZSIsInB1YmxpY0tleUFybW9yIiwiY2xlYXJ0ZXh0IiwiUEdQUHVia2V5IiwiZW5jcnlwdE1lc3NhZ2UiLCJlbmNyeXB0ZWR0eHQiLCJvcHRpb25zIiwiZGF0YSIsInB1YmxpY0tleXMiLCJlbmNyeXB0IiwiY2lwaGVydGV4dCIsIlBHUE1lc3NhZ2VBcm1vciIsInByaXZhdGVLZXlBcm1vciIsInBhc3N3b3JkIiwiZGVjcnlwdCIsImRlY3J5cHRNZXNzYWdlIiwicmVzdWx0Iiwic3RvcmVBcnIiLCJmaWx0ZXIiLCJzdG9yYWdlSXRlbSIsIm1hcCIsImNvbnRlbnRUeXBlIiwiZGVjcnlwdGVkIiwiZW5jcnlwdGVkQXJyIiwic3RvcmFnZUFyciIsImVuY3J5cHRlZCIsImNvbnNvbGUiLCJsb2ciLCJtb2R1bGUiLCJleHBvcnRzIiwiY2FjaGVkU2V0VGltZW91dCIsImNhY2hlZENsZWFyVGltZW91dCIsImRlZmF1bHRTZXRUaW1vdXQiLCJFcnJvciIsImRlZmF1bHRDbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiZSIsImNsZWFyVGltZW91dCIsInJ1blRpbWVvdXQiLCJmdW4iLCJjYWxsIiwicnVuQ2xlYXJUaW1lb3V0IiwibWFya2VyIiwicXVldWUiLCJkcmFpbmluZyIsImN1cnJlbnRRdWV1ZSIsInF1ZXVlSW5kZXgiLCJjbGVhblVwTmV4dFRpY2siLCJjb25jYXQiLCJkcmFpblF1ZXVlIiwidGltZW91dCIsImxlbiIsInJ1biIsIm5leHRUaWNrIiwiYXJncyIsIkFycmF5IiwiYXJndW1lbnRzIiwiSXRlbSIsImFycmF5IiwicHJvdG90eXBlIiwiYXBwbHkiLCJ0aXRsZSIsImJyb3dzZXIiLCJlbnYiLCJhcmd2IiwidmVyc2lvbiIsInZlcnNpb25zIiwibm9vcCIsIm9uIiwiYWRkTGlzdGVuZXIiLCJvbmNlIiwib2ZmIiwicmVtb3ZlTGlzdGVuZXIiLCJyZW1vdmVBbGxMaXN0ZW5lcnMiLCJlbWl0IiwicHJlcGVuZExpc3RlbmVyIiwicHJlcGVuZE9uY2VMaXN0ZW5lciIsImxpc3RlbmVycyIsIm5hbWUiLCJiaW5kaW5nIiwiY3dkIiwiY2hkaXIiLCJkaXIiLCJ1bWFzayIsIlJlYmVsUm91dGVyIiwicHJlZml4IiwiX3ByZWZpeCIsInByZXZpb3VzUGF0aCIsImJhc2VQYXRoIiwiZ2V0QXR0cmlidXRlIiwiaW5oZXJpdCIsIiRlbGVtZW50IiwicGFyZW50Tm9kZSIsIm5vZGVOYW1lIiwidG9Mb3dlckNhc2UiLCJjdXJyZW50Iiwicm91dGUiLCJyb3V0ZXMiLCIkY2hpbGRyZW4iLCJjaGlsZHJlbiIsIiRjaGlsZCIsInBhdGgiLCIkdGVtcGxhdGUiLCJpbm5lckhUTUwiLCJzaGFkb3dSb290IiwiY3JlYXRlU2hhZG93Um9vdCIsInJvb3QiLCJhbmltYXRpb24iLCJpbml0QW5pbWF0aW9uIiwicmVuZGVyIiwicGF0aENoYW5nZSIsImlzQmFjayIsImNsYXNzTGlzdCIsImFkZCIsInJlbW92ZSIsIm9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsIm5vZGUiLCJhZGRlZE5vZGVzIiwidW5kZWZpbmVkIiwib3RoZXJDaGlsZHJlbiIsImdldE90aGVyQ2hpbGRyZW4iLCJmb3JFYWNoIiwiY2hpbGQiLCJhbmltYXRpb25FbmQiLCJldmVudCIsInRhcmdldCIsImNsYXNzTmFtZSIsImluZGV4T2YiLCJyZW1vdmVDaGlsZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJvYnNlcnZlIiwiY2hpbGRMaXN0IiwiZ2V0UGF0aEZyb21VcmwiLCJyZWdleFN0cmluZyIsInJlcGxhY2UiLCJyZWdleCIsIlJlZ0V4cCIsInRlc3QiLCJfcm91dGVSZXN1bHQiLCJjb21wb25lbnQiLCIkY29tcG9uZW50IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwicGFyYW1zIiwidmFsdWUiLCJKU09OIiwicGFyc2UiLCJzZXRBdHRyaWJ1dGUiLCJhcHBlbmRDaGlsZCIsInRlbXBsYXRlIiwiYSIsImIiLCJyIiwicmVzdWx0cyIsInVybCIsInF1ZXJ5U3RyaW5nIiwic3Vic3RyIiwic3BsaXQiLCJwYXJ0IiwiZXEiLCJ2YWwiLCJkZWNvZGVVUklDb21wb25lbnQiLCJmcm9tIiwidG8iLCJpbmRleCIsInN1YnN0cmluZyIsIkNsYXNzIiwidG9TdHJpbmciLCJtYXRjaCIsInZhbGlkRWxlbWVudFRhZyIsImNvbnN0cnVjdG9yIiwiSFRNTEVsZW1lbnQiLCJjbGFzc1RvVGFnIiwiaXNSZWdpc3RlcmVkRWxlbWVudCIsInJlZ2lzdGVyRWxlbWVudCIsInRhZyIsImNhbGxiYWNrIiwiY2hhbmdlQ2FsbGJhY2tzIiwiY2hhbmdlSGFuZGxlciIsImxvY2F0aW9uIiwiaHJlZiIsIm9sZFVSTCIsIm9uaGFzaGNoYW5nZSIsInBhcnNlUXVlcnlTdHJpbmciLCJyZSIsImV4ZWMiLCJyZXN1bHRzMiIsIml0ZW0iLCJpZHgiLCJSZWJlbFJvdXRlIiwiUmViZWxEZWZhdWx0IiwiUmViZWxCYWNrQSIsInByZXZlbnREZWZhdWx0IiwiZGlzcGF0Y2hFdmVudCIsIkN1c3RvbUV2ZW50IiwiaGFzaCIsIkhUTUxBbmNob3JFbGVtZW50IiwiZXh0ZW5kcyIsIm9iaiIsImhhc093blByb3BlcnR5IiwiZ2V0UGFyYW1zRnJvbVVybCIsImdsb2JhbCIsInJlcXVpcmUiLCJhcmciLCJzbGljZSIsIm1vZCIsImNvbW1vbiIsIlR5cGUiLCJmbnMiLCJmbiIsImlzIiwiYmkiLCJCb29sZWFuIiwibnVtIiwibiIsImxpc3RfaXMiLCJwYXJzZUZsb2F0IiwiSW5maW5pdHkiLCJ0ZXh0IiwidCIsImlmeSIsInN0cmluZ2lmeSIsInJhbmRvbSIsImwiLCJjIiwicyIsImNoYXJBdCIsIk1hdGgiLCJmbG9vciIsIm8iLCJoYXMiLCJsaXN0IiwibSIsImZ1enp5IiwiZiIsInNsaXQiLCJzb3J0IiwiayIsIkEiLCJCIiwiXyIsIm9ial9tYXAiLCJPYmplY3QiLCJwdXQiLCJ2IiwiZGVsIiwiYXMiLCJ1Iiwib2JqX2lzIiwib2JqX2hhcyIsImNvcHkiLCJlbXB0eSIsIngiLCJsbCIsImxsZSIsImZuX2lzIiwiaWkiLCJ0aW1lIiwiRGF0ZSIsImdldFRpbWUiLCJvbnRvIiwibmV4dCIsIkZ1bmN0aW9uIiwiYmUiLCJ0aGUiLCJsYXN0IiwiYmFjayIsIk9uIiwiQ2hhaW4iLCJjcmVhdGUiLCJvcHQiLCJpZCIsInJpZCIsInV1aWQiLCJzdHVuIiwiY2hhaW4iLCJldiIsInNraXAiLCJjYiIsInJlcyIsInRtcCIsInEiLCJhY3QiLCJhdCIsImN0eCIsImFzayIsInNjb3BlIiwiYWNrIiwicmVwbHkiLCJvbnMiLCJHdW4iLCJpbnB1dCIsImd1biIsInNvdWwiLCJzdGF0ZSIsIndhaXRpbmciLCJ3aGVuIiwic29vbmVzdCIsInNldCIsImZ1dHVyZSIsIm5vdyIsImNoZWNrIiwiZWFjaCIsIndhaXQiLCJIQU0iLCJtYWNoaW5lU3RhdGUiLCJpbmNvbWluZ1N0YXRlIiwiY3VycmVudFN0YXRlIiwiaW5jb21pbmdWYWx1ZSIsImN1cnJlbnRWYWx1ZSIsImRlZmVyIiwiaGlzdG9yaWNhbCIsImNvbnZlcmdlIiwiaW5jb21pbmciLCJMZXhpY2FsIiwiVmFsIiwidGV4dF9pcyIsImJpX2lzIiwibnVtX2lzIiwicmVsIiwicmVsXyIsIm9ial9wdXQiLCJOb2RlIiwic291bF8iLCJ0ZXh0X3JhbmRvbSIsIm9ial9kZWwiLCJTdGF0ZSIsInBlcmYiLCJzdGFydCIsIk4iLCJkcmlmdCIsIkQiLCJwZXJmb3JtYW5jZSIsInRpbWluZyIsIm5hdmlnYXRpb25TdGFydCIsIk5fIiwib2JqX2FzIiwiR3JhcGgiLCJnIiwib2JqX2VtcHR5IiwibmYiLCJncmFwaCIsInNlZW4iLCJ2YWxpZCIsIm9ial9jb3B5IiwicHJldiIsImludmFsaWQiLCJqb2luIiwiYXJyIiwiRHVwIiwiY2FjaGUiLCJ0cmFjayIsImdjIiwiZGUiLCJvbGRlc3QiLCJtYXhBZ2UiLCJtaW4iLCJkb25lIiwiZWxhcHNlZCIsIm5leHRHQyIsInRvSlNPTiIsImR1cCIsImZpZWxkIiwiY2F0IiwiY29hdCIsIm9ial90byIsImdldCIsInN5bnRoIiwiX3NvdWwiLCJfZmllbGQiLCJob3ciLCJwZWVycyIsIndzYyIsInByb3RvY29scyIsImRlYnVnIiwidyIsIiQiLCJvdXRwdXQiLCJvdXQiLCJjYXAiLCJhcHAiLCJmb28iLCJiYXIiLCJyYWIiLCJhc2RmIiwiYmF6IiwiZmRzYSIsInllcyIsInByb3h5IiwiY2hhbmdlIiwiZWNobyIsIm5vdCIsInJlbGF0ZSIsIm5vZGVfIiwicmV2ZXJiIiwidmlhIiwidXNlIiwicmVmIiwiYW55IiwiYmF0Y2giLCJubyIsImlpZmUiLCJtZXRhIiwiX18iLCJ2ZXJ0ZXgiLCJ1bmlvbiIsIm1hY2hpbmUiLCJzdGF0ZV9pcyIsImNzIiwiaXYiLCJjdiIsInZhbF9pcyIsInN0YXRlX2lmeSIsImRlbHRhIiwiZGlmZiIsIm5vZGVfc291bCIsIm5vZGVfaXMiLCJub2RlX2lmeSIsInJlbF9pcyIsImtleWVkIiwiaWZmZSIsInBzZXVkbyIsIm5vcm1hbGl6ZSIsInNlYXJjaCIsInRyaWVkIiwibGV4IiwiY2hhbmdlZCIsInJlc3VtZSIsImVhcyIsInN1YnMiLCJiaW5kIiwib2siLCJhc3luYyIsIm91Z2h0IiwibmVlZCIsImltcGxlbWVudCIsImZpZWxkcyIsIm5fIiwic3RvcmUiLCJyZW1vdmVJdGVtIiwiZGlydHkiLCJjb3VudCIsIm1heCIsInNhdmUiLCJhbGwiLCJXZWJTb2NrZXQiLCJ3ZWJraXRXZWJTb2NrZXQiLCJtb3pXZWJTb2NrZXQiLCJ3c3AiLCJ1ZHJhaW4iLCJzZW5kIiwicGVlciIsIm1zZyIsIndpcmUiLCJvcGVuIiwicmVhZHlTdGF0ZSIsIk9QRU4iLCJyZWNlaXZlIiwiYm9keSIsIm9uY2xvc2UiLCJyZWNvbm5lY3QiLCJvbmVycm9yIiwiY29kZSIsIm9ub3BlbiIsIm9ubWVzc2FnZSIsIndlYnBhY2tQb2x5ZmlsbCIsImRlcHJlY2F0ZSIsInBhdGhzIiwiaW5kZXhQYXJ0aWFsIiwiSW5kZXhQYWdlIiwicm9hZG1hcFBhcnRpYWwiLCJSb2FkbWFwUGFnZSIsImNvbnRhY3RQYXJ0aWFsIiwiQ29udGFjdFBhZ2UiLCJjbGllbnRQdWJrZXlGb3JtUGFydGlhbCIsIk1lc3NhZ2VQYWdlIiwiZnJlc2hEZWNrUGFydGlhbCIsIkRlY2tQYWdlIiwiY3JlYXRlZENhbGxiYWNrIiwicXVlcnlTZWxlY3RvciIsInRleHRDb250ZW50IiwiY2xvbmUiLCJpbXBvcnROb2RlIiwiY29sb3JPdmVycmlkZSIsInN0eWxlIiwiY29sb3IiLCJmaWxsIiwiY29ubmVjdFBhcnRpYWwiLCJDb25uZWN0UGFnZSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBOztBQUVBOztBQUNBOztLQUFZQSxJOztBQVFaOztBQUdBOztBQUdBOztBQUNBOztBQUNBOztBQUNBOztB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IFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgOGM4NTg4YjA1MmUzZWUzNjQ2NTMiLCIndXNlIHN0cmljdCc7XG4vL2ltcG9ydCAnd2ViY29tcG9uZW50cy5qcy93ZWJjb21wb25lbnRzLmpzJztcbi8vdW5jb21tZW50IGxpbmUgYWJvdmUgdG8gZG91YmxlIGFwcCBzaXplIGFuZCBzdXBwb3J0IGlvcy5cblxuLy8gaGVscGVyIGZ1bmN0aW9uc1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuL2xpYi91dGlsJztcbndpbmRvdy5oYW5kbGVQb3N0ID0gdXRpbC5oYW5kbGVQb3N0O1xuXG4vLyB3aW5kb3cuaGFuZGxlQ29udGVudCA9IHV0aWwuaGFuZGxlQ29udGVudDtcbi8vIHdpbmRvdy5pc1BHUFB1YmtleSAgID0gdXRpbC5pc1BHUFB1YmtleTtcbi8vIHdpbmRvdy5pc1BHUFByaXZrZXkgID0gdXRpbC5pc1BHUFByaXZrZXk7XG5cbi8vIHJlYmVsIHJvdXRlclxuaW1wb3J0IHtSZWJlbFJvdXRlcn0gZnJvbSAnLi4vbm9kZV9tb2R1bGVzL3JlYmVsLXJvdXRlci9zcmMvcmViZWwtcm91dGVyLmpzJztcblxuLy8gR3VuZGIgcHVibGljIGZhY2luZyBEQUcgZGF0YWJhc2UgIChmb3IgbWVzc2FnZXMgdG8gYW5kIGZyb20gdGhlIGVuZW15KVxuaW1wb3J0IHtHdW59IGZyb20gJ2d1bi9ndW4uanMnO1xuXG4vLyBwYWdlcyAobW9zdCBvZiB0aGlzIHNob3VsZCBiZSBpbiB2aWV3cy9wYXJ0aWFscyB0byBhZmZlY3QgaXNvcm1vcnBoaXNtKVxuaW1wb3J0IHtJbmRleFBhZ2V9ICAgZnJvbSAnLi9wYWdlcy9pbmRleC5qcyc7XG5pbXBvcnQge1JvYWRtYXBQYWdlfSBmcm9tICcuL3BhZ2VzL3JvYWRtYXAuanMnO1xuaW1wb3J0IHtDb250YWN0UGFnZX0gZnJvbSAnLi9wYWdlcy9jb250YWN0LmpzJztcbmltcG9ydCB7TWVzc2FnZVBhZ2V9IGZyb20gJy4vcGFnZXMvbWVzc2FnZS5qcyc7XG5pbXBvcnQge0RlY2tQYWdlfSAgICBmcm9tICcuL3BhZ2VzL2RlY2suanMnO1xuaW1wb3J0IHtDb25uZWN0UGFnZX0gZnJvbSAnLi9wYWdlcy9jb25uZWN0LmpzJztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgUEdQUFVCS0VZID0gJ1BHUFB1YmtleSc7XG5jb25zdCBDTEVBUlRFWFQgPSAnY2xlYXJ0ZXh0JztcbmNvbnN0IFBHUFBSSVZLRVkgPSAnUEdQUHJpdmtleSc7XG5jb25zdCBQR1BNRVNTQUdFID0gJ1BHUE1lc3NhZ2UnO1xuXG5mdW5jdGlvbiBkZXRlcm1pbmVLZXlUeXBlKGNvbnRlbnQpIHtcbiAgICByZXR1cm4gKCFjb250ZW50KSA/XG4gICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNpbmcgcGdwS2V5Jyk6XG4gICAgKG9wZW5wZ3ApID0+IHtcbiAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxldCBwcml2YXRlS2V5cyA9IG9wZW5wZ3Aua2V5LnJlYWRBcm1vcmVkKGNvbnRlbnQpXG4gICAgICAgICAgICAgICAgbGV0IHByaXZhdGVLZXkgPSBwcml2YXRlS2V5cy5rZXlzWzBdXG4gICAgICAgICAgICAgICAgaWYgKHByaXZhdGVLZXkudG9QdWJsaWMoKS5hcm1vcigpICE9PSBwcml2YXRlS2V5LmFybW9yKCkgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoUEdQUFJJVktFWSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShQR1BQVUJLRVkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXRlcm1pbmVDb250ZW50VHlwZShjb250ZW50KSB7XG4gICAgLy8gdXNhZ2U6IGRldGVybWluZUNvbnRlbnRUeXBlKGNvbnRlbnQpKG9wZW5wZ3ApLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbiAgICByZXR1cm4gKCFjb250ZW50KSA/XG4gICAgUHJvbWlzZS5yZXNvbHZlKCcnKTpcbiAgICAob3BlbnBncCkgPT4ge1xuICAgICAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBvcGVucGdwJyk6XG4gICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGxldCBwb3NzaWJsZXBncGtleSA9IG9wZW5wZ3Aua2V5LnJlYWRBcm1vcmVkKGNvbnRlbnQpO1xuICAgICAgICAgICAgaWYgKHBvc3NpYmxlcGdwa2V5LmtleXNbMF0pIHtcbiAgICAgICAgICAgICAgICBkZXRlcm1pbmVLZXlUeXBlKGNvbnRlbnQpKG9wZW5wZ3ApXG4gICAgICAgICAgICAgICAgLnRoZW4oKGtleVR5cGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShrZXlUeXBlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbnBncC5tZXNzYWdlLnJlYWRBcm1vcmVkKGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKFBHUE1FU1NBR0UpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKENMRUFSVEVYVCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0RnJvbVN0b3JhZ2UobG9jYWxTdG9yYWdlKSB7XG4gICAgLy8gdXNhZ2U6IHNhdmVQR1BrZXkoY29udGVudCkob3BlbnBncCkobG9jYWxTdG9yYWdlKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpXG4gICAgcmV0dXJuICghbG9jYWxTdG9yYWdlKSA/XG4gICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIGxvY2FsU3RvcmFnZScpOlxuICAgIChpbmRleEtleSkgPT4ge1xuICAgICAgICByZXR1cm4gKCFpbmRleEtleSkgP1xuICAgICAgICAvLyBubyBpbmRleCAtPiByZXR1cm4gZXZlcnl0aGluZ1xuICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxldCBpID0gbG9jYWxTdG9yYWdlLmxlbmd0aFxuICAgICAgICAgICAgICAgIGxldCBrZXlBcnIgPSBbXVxuICAgICAgICAgICAgICAgIHdoaWxlIChpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaSA9IGkgLSAxXG4gICAgICAgICAgICAgICAgICAgIGtleUFyci5wdXNoKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGxvY2FsU3RvcmFnZS5rZXkoaSkpKVxuICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShrZXlBcnIpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk6XG4gICAgICAgIC8vIGluZGV4IHByb3ZpZGVkIC0+IHJldHVybiBvbmVcbiAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGluZGV4S2V5KSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbn1cblxuZnVuY3Rpb24gc2F2ZVBHUFB1YmtleShQR1BrZXlBcm1vcikge1xuICAgIC8vIHNhdmUgcHVibGljIGtleSB0byBzdG9yYWdlIG9ubHkgaWYgaXQgZG9lc24ndCBvdmVyd3JpdGUgYSBwcml2YXRlIGtleVxuICAgIC8vIHVzYWdlOiBzYXZlUEdQUHVia2V5KGNvbnRlbnQpKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSkudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgIHJldHVybiAoIVBHUGtleUFybW9yKSA/XG4gICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIFBHUGtleUFybW9yJyk6XG4gICAgKG9wZW5wZ3ApID0+IHtcbiAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgICAgICAobG9jYWxTdG9yYWdlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCFsb2NhbFN0b3JhZ2UpID9cbiAgICAgICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBsb2NhbFN0b3JhZ2UnKTpcbiAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgUEdQa2V5ID0gb3BlbnBncC5rZXkucmVhZEFybW9yZWQoUEdQa2V5QXJtb3IpO1xuICAgICAgICAgICAgICAgIGdldEZyb21TdG9yYWdlKGxvY2FsU3RvcmFnZSkoUEdQa2V5LmtleXNbMF0udXNlcnNbMF0udXNlcklkLnVzZXJpZClcbiAgICAgICAgICAgICAgICAudGhlbihleGlzdGluZ0tleSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoIWV4aXN0aW5nS2V5KSA/XG4gICAgICAgICAgICAgICAgICAgIFByb21pc2UucmVzb2x2ZSgnbm9uZScpIDpcbiAgICAgICAgICAgICAgICAgICAgZGV0ZXJtaW5lQ29udGVudFR5cGUoZXhpc3RpbmdLZXkpKG9wZW5wZ3ApO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZXhpc3RpbmdLZXlUeXBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0aW5nS2V5VHlwZSA9PT0gJ1BHUFByaXZrZXknKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoJ3B1YmtleSBpZ25vcmVkIFgtIGF0dGVtcHRlZCBvdmVyd3JpdGUgcHJpdmtleScpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShQR1BrZXkua2V5c1swXS51c2Vyc1swXS51c2VySWQudXNlcmlkLCBQR1BrZXlBcm1vcilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYHB1YmxpYyBwZ3Aga2V5IHNhdmVkIDwtICR7UEdQa2V5LmtleXNbMF0udXNlcnNbMF0udXNlcklkLnVzZXJpZH1gKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gcmVqZWN0KGVycikpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzYXZlUEdQUHJpdmtleShQR1BrZXlBcm1vcikge1xuICAgIC8vIHNhdmUgcHJpdmF0ZSBrZXkgdG8gc3RvcmFnZSBubyBxdWVzdGlvbnMgYXNrZWRcbiAgICAvLyB1c2FnZTogc2F2ZVBHUFByaXZrZXkoY29udGVudCkob3BlbnBncCkobG9jYWxTdG9yYWdlKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpXG4gICAgcmV0dXJuICghUEdQa2V5QXJtb3IpID9cbiAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgUEdQa2V5QXJtb3InKTpcbiAgICAob3BlbnBncCkgPT4ge1xuICAgICAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBvcGVucGdwJyk6XG4gICAgICAgIChsb2NhbFN0b3JhZ2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoIWxvY2FsU3RvcmFnZSkgP1xuICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIGxvY2FsU3RvcmFnZScpOlxuICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBQR1BrZXkgPSBvcGVucGdwLmtleS5yZWFkQXJtb3JlZChQR1BrZXlBcm1vcik7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFBHUGtleS5rZXlzWzBdLnVzZXJzWzBdLnVzZXJJZC51c2VyaWQsIFBHUGtleUFybW9yKVxuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLnNldEltbWVkaWF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYHByaXZhdGUgcGdwIGtleSBzYXZlZCA8LSAke1BHUGtleS5rZXlzWzBdLnVzZXJzWzBdLnVzZXJJZC51c2VyaWR9YClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbmNyeXB0Q2xlYXJUZXh0KG9wZW5wZ3ApIHtcbiAgICAvLyB1c2FnZTogZW5jcnlwdENsZWFyVGV4dChvcGVucGdwKShwdWJsaWNLZXlBcm1vcikoY2xlYXJ0ZXh0KS50aGVuKHJlc3VsdCA9PiByZXN1bHQpXG4gICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBvcGVucGdwJyk6XG4gICAgKHB1YmxpY0tleUFybW9yKSA9PiB7XG4gICAgICAgIHJldHVybiAoIXB1YmxpY0tleUFybW9yKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBwdWJsaWMga2V5Jyk6XG4gICAgICAgIChjbGVhcnRleHQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoIWNsZWFydGV4dCkgP1xuICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIGNsZWFydGV4dCcpOlxuICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBQR1BQdWJrZXkgPSBvcGVucGdwLmtleS5yZWFkQXJtb3JlZChwdWJsaWNLZXlBcm1vcilcbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgIHRoZSBsYXRlc3Qgb3BlbnBncCAyLjUuNCBicmVha3Mgb24gb3VyIGNvbnNvbGUgb25seSB0b29scy5cbiAgICAgICAgICAgICAgICBidXQgaXQncyAxMHggZmFzdGVyIG9uIGJyb3dzZXJzIHNvIFRIRSBORVcgQ09ERSBTVEFZUyBJTi5cbiAgICAgICAgICAgICAgICBiZWxvdyB3ZSBleHBsb2l0IGZhbGxiYWNrIHRvIG9sZCBzbG93IGVycm9yIGZyZWUgb3BlbnBncCAxLjYuMlxuICAgICAgICAgICAgICAgIGJ5IGFkYXB0aW5nIG9uIHRoZSBmbHkgdG8gYSBicmVha2luZyBjaGFuZ2VcbiAgICAgICAgICAgICAgICAob3BlbnBncCBidWcgXjEuNi4yIC0+IDIuNS40IG1hZGUgdXMgZG8gaXQpXG4gICAgICAgICAgICAgICAgcmVmYWN0b3I6IHJlbW92ZSB0cnkgc2VjdGlvbiBvZiB0cnljYXRjaCBrZWVwIGNhdGNoIHNlY3Rpb25cbiAgICAgICAgICAgICAgICBieSBhbGwgbWVhbnMgcmVmYWN0b3IgaWYgbm90IGJyb2tlbiBhZnRlciBvcGVucGdwIDIuNS40XG4gICAgICAgICAgICAgICAgaWYgeW91IGNoZWNrIG9wZW5wZ3AgcGxlYXNlIGJ1bXAgZmFpbGluZyB2ZXJzaW9uICBeXl5eXlxuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gd29ya3Mgb25seSBvbiBvcGVucGdwIHZlcnNpb24gMS42LjJcbiAgICAgICAgICAgICAgICAgICAgb3BlbnBncC5lbmNyeXB0TWVzc2FnZShQR1BQdWJrZXkua2V5c1swXSwgY2xlYXJ0ZXh0KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihlbmNyeXB0ZWR0eHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShlbmNyeXB0ZWR0eHQpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgpXG4gICAgICAgICAgICAgICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gd29ya3Mgb24gb3BlbnBncCB2ZXJzaW9uIDIuNS40XG4gICAgICAgICAgICAgICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogY2xlYXJ0ZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcHVibGljS2V5czogb3BlbnBncC5rZXkucmVhZEFybW9yZWQocHVibGljS2V5QXJtb3IpLmtleXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcm1vcjogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBvcGVucGdwLmVuY3J5cHQob3B0aW9ucylcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGNpcGhlcnRleHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY2lwaGVydGV4dC5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gZnVuY3Rpb24gZW5jcnlwdENvbnRlbnQoY29udGVudCkge1xuLy8gICAgIC8vIHVzYWdlOiBlbmNyeXB0Q29udGVudChjb250ZW50KShvcGVucGdwKShsb2NhbFN0b3JhZ2UpLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbi8vICAgICByZXR1cm4gKCFjb250ZW50KSA/XG4vLyAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIGNvbnRlbnQnKTpcbi8vICAgICAob3BlbnBncCkgPT4ge1xuLy8gICAgICAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4vLyAgICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBvcGVucGdwJyk6XG4vLyAgICAgICAgIChsb2NhbFN0b3JhZ2UpID0+IHtcbi8vICAgICAgICAgICAgIGlmICghbG9jYWxTdG9yYWdlKSB7XG4vLyAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBsb2NhbFN0b3JhZ2UnKTtcbi8vICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgIGxldCBlbmNyeXB0ZWRBcnIgPSBbXTtcbi8vICAgICAgICAgICAgIGdldEZyb21TdG9yYWdlKGxvY2FsU3RvcmFnZSkoKVxuLy8gICAgICAgICAgICAgLnRoZW4oc3RvcmFnZUFyciA9PiB7XG4vLyAgICAgICAgICAgICAgICAgc3RvcmFnZUFyclxuLy8gICAgICAgICAgICAgICAgIC5maWx0ZXIoKHN0b3JhZ2VJdGVtKSA9PiBzdG9yYWdlSXRlbSAhPT0gbnVsbClcbi8vICAgICAgICAgICAgICAgICAuZmlsdGVyKChzdG9yYWdlSXRlbSkgPT4ge1xuLy8gICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGV0ZXJtaW5lQ29udGVudFR5cGUoc3RvcmFnZUl0ZW0pKG9wZW5wZ3ApXG4vLyAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiB7XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCByZXN1bHQgPT09IFBHUFBVQktFWSApXG4vLyAgICAgICAgICAgICAgICAgICAgIH0pO1xuLy8gICAgICAgICAgICAgICAgIH0pXG4vLyAgICAgICAgICAgICAgICAgLm1hcCgoc3RvcmFnZUl0ZW0pID0+IHtcbi8vICAgICAgICAgICAgICAgICAgICAgZW5jcnlwdENsZWFyVGV4dChvcGVucGdwKShzdG9yYWdlSXRlbSkoY29udGVudClcbi8vICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGVuY3J5cHRlZCkgPT4ge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZW5jcnlwdGVkKVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVuY3J5cHRlZDtcbi8vICAgICAgICAgICAgICAgICAgICAgfSlcbi8vICAgICAgICAgICAgICAgICB9KVxuLy8gICAgICAgICAgICAgfSlcbi8vICAgICAgICAgfVxuLy8gICAgIH1cbi8vIH1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlY3J5cHRQR1BNZXNzYWdlV2l0aEtleShQR1BNZXNzYWdlQXJtb3IpIHtcbiAgICAvLyAgdXNhZ2U6IGRlY3J5cHRQR1BNZXNzYWdlV2l0aEtleShjb250ZW50KShvcGVucGdwKShwcml2YXRlS2V5QXJtb3IpKHBhc3N3b3JkKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpXG4gICAgcmV0dXJuICghUEdQTWVzc2FnZUFybW9yKSA/XG4gICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIFBHUE1lc3NhZ2UnKTpcbiAgICAob3BlbnBncCkgPT4ge1xuICAgICAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBvcGVucGdwJyk6XG4gICAgICAgIChwcml2YXRlS2V5QXJtb3IpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoIXByaXZhdGVLZXlBcm1vcikgP1xuICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIHByaXZhdGVLZXlBcm1vcicpOlxuICAgICAgICAgICAgKHBhc3N3b3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICghcGFzc3dvcmQpID9cbiAgICAgICAgICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgcGFzc3dvcmQnKTpcbiAgICAgICAgICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcHJpdmF0ZUtleXMgPSBvcGVucGdwLmtleS5yZWFkQXJtb3JlZChwcml2YXRlS2V5QXJtb3IpXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcHJpdmF0ZUtleSA9IHByaXZhdGVLZXlzLmtleXNbMF1cbiAgICAgICAgICAgICAgICAgICAgICAgIHByaXZhdGVLZXkuZGVjcnlwdChwYXNzd29yZClcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtZXNzYWdlID0gb3BlbnBncC5tZXNzYWdlLnJlYWRBcm1vcmVkKFBHUE1lc3NhZ2VBcm1vcilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoIW9wZW5wZ3AuZGVjcnlwdCkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbnBncC5kZWNyeXB0TWVzc2FnZShwcml2YXRlS2V5LCBtZXNzYWdlKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKTpcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5wZ3AuZGVjcnlwdCh7ICdtZXNzYWdlJzogbWVzc2FnZSwgJ3ByaXZhdGVLZXknOiBwcml2YXRlS2V5IH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0LmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3Jlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlY3J5cHRQR1BNZXNzYWdlKFBHUE1lc3NhZ2VBcm1vcikge1xuICAgIC8vICB1c2FnZTogZGVjcnlwdFBHUE1lc3NhZ2UoY29udGVudCkob3BlbnBncCkobG9jYWxTdG9yYWdlKShwYXNzd29yZCkudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgIHJldHVybiAoIVBHUE1lc3NhZ2VBcm1vcikgP1xuICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBQR1BNZXNzYWdlJyk6XG4gICAgKG9wZW5wZ3ApID0+IHtcbiAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgICAgICAobG9jYWxTdG9yYWdlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCFsb2NhbFN0b3JhZ2UpID9cbiAgICAgICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBsb2NhbFN0b3JhZ2UnKTpcbiAgICAgICAgICAgIChwYXNzd29yZCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAoIXBhc3N3b3JkKSA/XG4gICAgICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QoXCJFcnJvcjogbWlzc2luZyBwYXNzd29yZFwiKTpcbiAgICAgICAgICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGdldEZyb21TdG9yYWdlKGxvY2FsU3RvcmFnZSkoKS50aGVuKHN0b3JlQXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0b3JlQXJyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihzdG9yYWdlSXRlbSA9PiAoIXN0b3JhZ2VJdGVtKSA/IGZhbHNlIDogdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKHN0b3JhZ2VJdGVtID0+IGRldGVybWluZUNvbnRlbnRUeXBlKHN0b3JhZ2VJdGVtKShvcGVucGdwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihjb250ZW50VHlwZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudFR5cGUgPT09IFBHUFBSSVZLRVkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWNyeXB0UEdQTWVzc2FnZVdpdGhLZXkoUEdQTWVzc2FnZUFybW9yKShvcGVucGdwKShzdG9yYWdlSXRlbSkoJ2hvdGxpcHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGRlY3J5cHRlZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGVjcnlwdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gZXhwb3J0IGZ1bmN0aW9uIGJyb2FkY2FzdChjb250ZW50KSB7XG4vLyAgICAgY29uc3Qgbm90UEdQUHJpdmtleSA9IHJlcXVpcmUoJy4vbm90UEdQUHJpdmtleS5qcycpO1xuLy8gICAgIC8vIGltcG9ydCBub3RDbGVhcnRleHQgZnJvbSAnLi9ub3RDbGVhcnRleHQuanMnO1xuLy8gICAgIC8vIGltcG9ydCBub3RFbXB0eSBmcm9tICcuL25vdEVtcHR5LmpzJztcbi8vICAgICBub3RQR1BQcml2a2V5KGNvbnRlbnQpO1xuLy8gICAgIC8vIG5vdENsZWFydGV4dChjb250ZW50KTtcbi8vICAgICAvLyBub3RFbXB0eShjb250ZW50KTtcbi8vXG4vLyAgICAgZ3VuLmdldCgncm95YWxlJykucHV0KHtcbi8vICAgICAgICAgICBuYW1lOiBcIkxBVEVTVFwiLFxuLy8gICAgICAgICAgIGVtYWlsOiBjb250ZW50XG4vLyAgICAgICAgIH0pO1xuLy9cbi8vIH1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZVBvc3QoY29udGVudCkge1xuICAgIC8vY29uc29sZS5sb2coYGhhbmRsZVBvc3QgPC0gJHtjb250ZW50fWApO1xuICAgIHJldHVybiAoIWNvbnRlbnQpID9cbiAgICBQcm9taXNlLnJlc29sdmUoJycpIDpcbiAgICAob3BlbnBncCkgPT4ge1xuICAgICAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBvcGVucGdwJyk6XG4gICAgICAgIChsb2NhbFN0b3JhZ2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAocGFzc3dvcmQpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBkZXRlcm1pbmVDb250ZW50VHlwZShjb250ZW50KShvcGVucGdwKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihjb250ZW50VHlwZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudFR5cGUgPT09IENMRUFSVEVYVCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vZW5jcnlwdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBlbmNyeXB0ZWRBcnIgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRGcm9tU3RvcmFnZShsb2NhbFN0b3JhZ2UpKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihzdG9yYWdlQXJyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpID0gc3RvcmFnZUFyci5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9yYWdlQXJyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKChzdG9yYWdlSXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RvcmFnZUl0ZW07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcigoc3RvcmFnZUl0ZW0pID0+IHN0b3JhZ2VJdGVtICE9PSBudWxsIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoKHN0b3JhZ2VJdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRldGVybWluZUNvbnRlbnRUeXBlKHN0b3JhZ2VJdGVtKShvcGVucGdwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoIHJlc3VsdCA9PT0gUEdQUFVCS0VZIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKChzdG9yYWdlSXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuY3J5cHRDbGVhclRleHQob3BlbnBncCkoc3RvcmFnZUl0ZW0pKGNvbnRlbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGVuY3J5cHRlZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmNyeXB0ZWRBcnIucHVzaChlbmNyeXB0ZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIGkgPT0gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZW5jcnlwdGVkQXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChlbmNyeXB0ZWRBcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYnJvYWRjYXN0IGhlcmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5jcnlwdGVkQXJyLm1hcCgoZW5jcnlwdGVkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlbmNyeXB0ZWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Jyb2FkY2FzdCBoZXJlJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRlbnRUeXBlID09PSBQR1BQUklWS0VZKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2F2ZSBhbmQgYnJvYWRjYXN0IGNvbnZlcnRlZCBwdWJsaWMga2V5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNhdmVQR1BQcml2a2V5KGNvbnRlbnQpKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3JldHVybiBicm9hZGNhc3RNZXNzYWdlKGNvbnRlbnQpKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRlbnRUeXBlID09PSBQR1BQVUJLRVkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzYXZlIHRvIGxvY2FsU3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzYXZlUEdQUHVia2V5KGNvbnRlbnQpKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRlbnRUeXBlID09PSBQR1BNRVNTQUdFKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IFBHUEtleXMsIGRlY3J5cHQsICBhbmQgcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlY3J5cHRQR1BNZXNzYWdlKGNvbnRlbnQpKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSkocGFzc3dvcmQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdClcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlamVjdChlcnIpKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGliL3V0aWwuanMiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9wcm9jZXNzL2Jyb3dzZXIuanMiLCIvKipcbiAqIENyZWF0ZWQgYnkgTGVvbiBSZXZpbGwgb24gMTUvMTIvMjAxNS5cbiAqIEJsb2c6IGJsb2cucmV2aWxsd2ViLmNvbVxuICogR2l0SHViOiBodHRwczovL2dpdGh1Yi5jb20vUmV2aWxsV2ViXG4gKiBUd2l0dGVyOiBAUmV2aWxsV2ViXG4gKi9cblxuLyoqXG4gKiBUaGUgbWFpbiByb3V0ZXIgY2xhc3MgYW5kIGVudHJ5IHBvaW50IHRvIHRoZSByb3V0ZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWJlbFJvdXRlciBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxuICAgIC8qKlxuICAgICAqIE1haW4gaW5pdGlhbGlzYXRpb24gcG9pbnQgb2YgcmViZWwtcm91dGVyXG4gICAgICogQHBhcmFtIHByZWZpeCAtIElmIGV4dGVuZGluZyByZWJlbC1yb3V0ZXIgeW91IGNhbiBzcGVjaWZ5IGEgcHJlZml4IHdoZW4gY2FsbGluZyBjcmVhdGVkQ2FsbGJhY2sgaW4gY2FzZSB5b3VyIGVsZW1lbnRzIG5lZWQgdG8gYmUgbmFtZWQgZGlmZmVyZW50bHlcbiAgICAgKi9cbiAgICBjcmVhdGVkQ2FsbGJhY2socHJlZml4KSB7XG5cbiAgICAgICAgY29uc3QgX3ByZWZpeCA9IHByZWZpeCB8fCBcInJlYmVsXCI7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnByZXZpb3VzUGF0aCA9IG51bGw7XG4gICAgICAgIHRoaXMuYmFzZVBhdGggPSBudWxsO1xuXG4gICAgICAgIC8vR2V0IG9wdGlvbnNcbiAgICAgICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgICAgICAgXCJhbmltYXRpb25cIjogKHRoaXMuZ2V0QXR0cmlidXRlKFwiYW5pbWF0aW9uXCIpID09IFwidHJ1ZVwiKSxcbiAgICAgICAgICAgIFwic2hhZG93Um9vdFwiOiAodGhpcy5nZXRBdHRyaWJ1dGUoXCJzaGFkb3dcIikgPT0gXCJ0cnVlXCIpLFxuICAgICAgICAgICAgXCJpbmhlcml0XCI6ICh0aGlzLmdldEF0dHJpYnV0ZShcImluaGVyaXRcIikgIT0gXCJmYWxzZVwiKVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vR2V0IHJvdXRlc1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmluaGVyaXQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIC8vSWYgdGhpcyBpcyBhIG5lc3RlZCByb3V0ZXIgdGhlbiB3ZSBuZWVkIHRvIGdvIGFuZCBnZXQgdGhlIHBhcmVudCBwYXRoXG4gICAgICAgICAgICBsZXQgJGVsZW1lbnQgPSB0aGlzO1xuICAgICAgICAgICAgd2hpbGUgKCRlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICAkZWxlbWVudCA9ICRlbGVtZW50LnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgaWYgKCRlbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT0gX3ByZWZpeCArIFwiLXJvdXRlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnQgPSAkZWxlbWVudC5jdXJyZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFzZVBhdGggPSBjdXJyZW50LnJvdXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yb3V0ZXMgPSB7fTtcbiAgICAgICAgY29uc3QgJGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0ICRjaGlsZCA9ICRjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGxldCBwYXRoID0gJGNoaWxkLmdldEF0dHJpYnV0ZShcInBhdGhcIik7XG4gICAgICAgICAgICBzd2l0Y2ggKCRjaGlsZC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBfcHJlZml4ICsgXCItZGVmYXVsdFwiOlxuICAgICAgICAgICAgICAgICAgICBwYXRoID0gXCIqXCI7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgX3ByZWZpeCArIFwiLXJvdXRlXCI6XG4gICAgICAgICAgICAgICAgICAgIHBhdGggPSAodGhpcy5iYXNlUGF0aCAhPT0gbnVsbCkgPyB0aGlzLmJhc2VQYXRoICsgcGF0aCA6IHBhdGg7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhdGggIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBsZXQgJHRlbXBsYXRlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAoJGNoaWxkLmlubmVySFRNTCkge1xuICAgICAgICAgICAgICAgICAgICAkdGVtcGxhdGUgPSBcIjxcIiArIF9wcmVmaXggKyBcIi1yb3V0ZT5cIiArICRjaGlsZC5pbm5lckhUTUwgKyBcIjwvXCIgKyBfcHJlZml4ICsgXCItcm91dGU+XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucm91dGVzW3BhdGhdID0ge1xuICAgICAgICAgICAgICAgICAgICBcImNvbXBvbmVudFwiOiAkY2hpbGQuZ2V0QXR0cmlidXRlKFwiY29tcG9uZW50XCIpLFxuICAgICAgICAgICAgICAgICAgICBcInRlbXBsYXRlXCI6ICR0ZW1wbGF0ZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL0FmdGVyIHdlIGhhdmUgY29sbGVjdGVkIGFsbCBjb25maWd1cmF0aW9uIGNsZWFyIGlubmVySFRNTFxuICAgICAgICB0aGlzLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaGFkb3dSb290ID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVNoYWRvd1Jvb3QoKTtcbiAgICAgICAgICAgIHRoaXMucm9vdCA9IHRoaXMuc2hhZG93Um9vdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucm9vdCA9IHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hbmltYXRpb24gPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdEFuaW1hdGlvbigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgIFJlYmVsUm91dGVyLnBhdGhDaGFuZ2UoKGlzQmFjaykgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hbmltYXRpb24gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNCYWNrID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZChcInJibC1iYWNrXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZShcInJibC1iYWNrXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRnVuY3Rpb24gdXNlZCB0byBpbml0aWFsaXNlIHRoZSBhbmltYXRpb24gbWVjaGFuaWNzIGlmIGFuaW1hdGlvbiBpcyB0dXJuZWQgb25cbiAgICAgKi9cbiAgICBpbml0QW5pbWF0aW9uKCkge1xuICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnMpID0+IHtcbiAgICAgICAgICAgIGxldCBub2RlID0gbXV0YXRpb25zWzBdLmFkZGVkTm9kZXNbMF07XG4gICAgICAgICAgICBpZiAobm9kZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3RoZXJDaGlsZHJlbiA9IHRoaXMuZ2V0T3RoZXJDaGlsZHJlbihub2RlKTtcbiAgICAgICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5hZGQoXCJyZWJlbC1hbmltYXRlXCIpO1xuICAgICAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChcImVudGVyXCIpO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAob3RoZXJDaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdGhlckNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQuY2xhc3NMaXN0LmFkZChcImV4aXRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLmNsYXNzTGlzdC5hZGQoXCJjb21wbGV0ZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAxMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChcImNvbXBsZXRlXCIpO1xuICAgICAgICAgICAgICAgICAgICB9LCAxMCk7XG4gICAgICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICAgICAgICAgIGNvbnN0IGFuaW1hdGlvbkVuZCA9IChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LmNsYXNzTmFtZS5pbmRleE9mKFwiZXhpdFwiKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJvb3QucmVtb3ZlQ2hpbGQoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKFwidHJhbnNpdGlvbmVuZFwiLCBhbmltYXRpb25FbmQpO1xuICAgICAgICAgICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCBhbmltYXRpb25FbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLCB7Y2hpbGRMaXN0OiB0cnVlfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWV0aG9kIHVzZWQgdG8gZ2V0IHRoZSBjdXJyZW50IHJvdXRlIG9iamVjdFxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGN1cnJlbnQoKSB7XG4gICAgICAgIGNvbnN0IHBhdGggPSBSZWJlbFJvdXRlci5nZXRQYXRoRnJvbVVybCgpO1xuICAgICAgICBmb3IgKGNvbnN0IHJvdXRlIGluIHRoaXMucm91dGVzKSB7XG4gICAgICAgICAgICBpZiAocm91dGUgIT09IFwiKlwiKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJlZ2V4U3RyaW5nID0gXCJeXCIgKyByb3V0ZS5yZXBsYWNlKC97XFx3K31cXC8/L2csIFwiKFxcXFx3KylcXC8/XCIpO1xuICAgICAgICAgICAgICAgIHJlZ2V4U3RyaW5nICs9IChyZWdleFN0cmluZy5pbmRleE9mKFwiXFxcXC8/XCIpID4gLTEpID8gXCJcIiA6IFwiXFxcXC8/XCIgKyBcIihbPz0mLVxcL1xcXFx3K10rKT8kXCI7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKHJlZ2V4U3RyaW5nKTtcbiAgICAgICAgICAgICAgICBpZiAocmVnZXgudGVzdChwYXRoKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3JvdXRlUmVzdWx0KHRoaXMucm91dGVzW3JvdXRlXSwgcm91dGUsIHJlZ2V4LCBwYXRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICh0aGlzLnJvdXRlc1tcIipcIl0gIT09IHVuZGVmaW5lZCkgPyBfcm91dGVSZXN1bHQodGhpcy5yb3V0ZXNbXCIqXCJdLCBcIipcIiwgbnVsbCwgcGF0aCkgOiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1ldGhvZCBjYWxsZWQgdG8gcmVuZGVyIHRoZSBjdXJyZW50IHZpZXdcbiAgICAgKi9cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuY3VycmVudCgpO1xuICAgICAgICBpZiAocmVzdWx0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0LnBhdGggIT09IHRoaXMucHJldmlvdXNQYXRoIHx8IHRoaXMub3B0aW9ucy5hbmltYXRpb24gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmFuaW1hdGlvbiAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvb3QuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5jb21wb25lbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0ICRjb21wb25lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHJlc3VsdC5jb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gcmVzdWx0LnBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gcmVzdWx0LnBhcmFtc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSBcIk9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBKU09OLnBhcnNlKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDb3VsZG4ndCBwYXJzZSBwYXJhbSB2YWx1ZTpcIiwgZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgJGNvbXBvbmVudC5zZXRBdHRyaWJ1dGUoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb290LmFwcGVuZENoaWxkKCRjb21wb25lbnQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCAkdGVtcGxhdGUgPSByZXN1bHQudGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIC8vVE9ETzogRmluZCBhIGZhc3RlciBhbHRlcm5hdGl2ZVxuICAgICAgICAgICAgICAgICAgICBpZiAoJHRlbXBsYXRlLmluZGV4T2YoXCIke1wiKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGVtcGxhdGUgPSAkdGVtcGxhdGUucmVwbGFjZSgvXFwkeyhbXnt9XSopfS9nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByID0gcmVzdWx0LnBhcmFtc1tiXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiByID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgciA9PT0gJ251bWJlcicgPyByIDogYTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm9vdC5pbm5lckhUTUwgPSAkdGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucHJldmlvdXNQYXRoID0gcmVzdWx0LnBhdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIG5vZGUgLSBVc2VkIHdpdGggdGhlIGFuaW1hdGlvbiBtZWNoYW5pY3MgdG8gZ2V0IGFsbCBvdGhlciB2aWV3IGNoaWxkcmVuIGV4Y2VwdCBpdHNlbGZcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAgICovXG4gICAgZ2V0T3RoZXJDaGlsZHJlbihub2RlKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkcmVuID0gdGhpcy5yb290LmNoaWxkcmVuO1xuICAgICAgICBsZXQgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGlmIChjaGlsZCAhPSBub2RlKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBTdGF0aWMgaGVscGVyIG1ldGhvZCB0byBwYXJzZSB0aGUgcXVlcnkgc3RyaW5nIGZyb20gYSB1cmwgaW50byBhbiBvYmplY3QuXG4gICAgICogQHBhcmFtIHVybFxuICAgICAqIEByZXR1cm5zIHt7fX1cbiAgICAgKi9cbiAgICBzdGF0aWMgcGFyc2VRdWVyeVN0cmluZyh1cmwpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgICBpZiAodXJsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHZhciBxdWVyeVN0cmluZyA9ICh1cmwuaW5kZXhPZihcIj9cIikgPiAtMSkgPyB1cmwuc3Vic3RyKHVybC5pbmRleE9mKFwiP1wiKSArIDEsIHVybC5sZW5ndGgpIDogbnVsbDtcbiAgICAgICAgICAgIGlmIChxdWVyeVN0cmluZyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHF1ZXJ5U3RyaW5nLnNwbGl0KFwiJlwiKS5mb3JFYWNoKGZ1bmN0aW9uIChwYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcGFydCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICBwYXJ0ID0gcGFydC5yZXBsYWNlKFwiK1wiLCBcIiBcIik7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlcSA9IHBhcnQuaW5kZXhPZihcIj1cIik7XG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXkgPSBlcSA+IC0xID8gcGFydC5zdWJzdHIoMCwgZXEpIDogcGFydDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbCA9IGVxID4gLTEgPyBkZWNvZGVVUklDb21wb25lbnQocGFydC5zdWJzdHIoZXEgKyAxKSkgOiBcIlwiO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZnJvbSA9IGtleS5pbmRleE9mKFwiW1wiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZyb20gPT0gLTEpIHJlc3VsdFtkZWNvZGVVUklDb21wb25lbnQoa2V5KV0gPSB2YWw7XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRvID0ga2V5LmluZGV4T2YoXCJdXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZGVjb2RlVVJJQ29tcG9uZW50KGtleS5zdWJzdHJpbmcoZnJvbSArIDEsIHRvKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXkgPSBkZWNvZGVVUklDb21wb25lbnQoa2V5LnN1YnN0cmluZygwLCBmcm9tKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdFtrZXldKSByZXN1bHRba2V5XSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpbmRleCkgcmVzdWx0W2tleV0ucHVzaCh2YWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSByZXN1bHRba2V5XVtpbmRleF0gPSB2YWw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0YXRpYyBoZWxwZXIgbWV0aG9kIHRvIGNvbnZlcnQgYSBjbGFzcyBuYW1lIHRvIGEgdmFsaWQgZWxlbWVudCBuYW1lLlxuICAgICAqIEBwYXJhbSBDbGFzc1xuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgc3RhdGljIGNsYXNzVG9UYWcoQ2xhc3MpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENsYXNzLm5hbWUgd291bGQgYmUgYmV0dGVyIGJ1dCB0aGlzIGlzbid0IHN1cHBvcnRlZCBpbiBJRSAxMS5cbiAgICAgICAgICovXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgbmFtZSA9IENsYXNzLnRvU3RyaW5nKCkubWF0Y2goL15mdW5jdGlvblxccyooW15cXHMoXSspLylbMV0ucmVwbGFjZSgvXFxXKy9nLCAnLScpLnJlcGxhY2UoLyhbYS16XFxkXSkoW0EtWjAtOV0pL2csICckMS0kMicpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IHBhcnNlIGNsYXNzIG5hbWU6XCIsIGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChSZWJlbFJvdXRlci52YWxpZEVsZW1lbnRUYWcobmFtZSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDbGFzcyBuYW1lIGNvdWxkbid0IGJlIHRyYW5zbGF0ZWQgdG8gdGFnLlwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmFtZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdGF0aWMgaGVscGVyIG1ldGhvZCB1c2VkIHRvIGRldGVybWluZSBpZiBhbiBlbGVtZW50IHdpdGggdGhlIHNwZWNpZmllZCBuYW1lIGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZC5cbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIHN0YXRpYyBpc1JlZ2lzdGVyZWRFbGVtZW50KG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmFtZSkuY29uc3RydWN0b3IgIT09IEhUTUxFbGVtZW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0YXRpYyBoZWxwZXIgbWV0aG9kIHRvIHRha2UgYSB3ZWIgY29tcG9uZW50IGNsYXNzLCBjcmVhdGUgYW4gZWxlbWVudCBuYW1lIGFuZCByZWdpc3RlciB0aGUgbmV3IGVsZW1lbnQgb24gdGhlIGRvY3VtZW50LlxuICAgICAqIEBwYXJhbSBDbGFzc1xuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgc3RhdGljIGNyZWF0ZUVsZW1lbnQoQ2xhc3MpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IFJlYmVsUm91dGVyLmNsYXNzVG9UYWcoQ2xhc3MpO1xuICAgICAgICBpZiAoUmViZWxSb3V0ZXIuaXNSZWdpc3RlcmVkRWxlbWVudChuYW1lKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIENsYXNzLnByb3RvdHlwZS5uYW1lID0gbmFtZTtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChuYW1lLCBDbGFzcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2ltcGxlIHN0YXRpYyBoZWxwZXIgbWV0aG9kIGNvbnRhaW5pbmcgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gdmFsaWRhdGUgYW4gZWxlbWVudCBuYW1lXG4gICAgICogQHBhcmFtIHRhZ1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIHN0YXRpYyB2YWxpZEVsZW1lbnRUYWcodGFnKSB7XG4gICAgICAgIHJldHVybiAvXlthLXowLTlcXC1dKyQvLnRlc3QodGFnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNZXRob2QgdXNlZCB0byByZWdpc3RlciBhIGNhbGxiYWNrIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBVUkwgcGF0aCBjaGFuZ2VzLlxuICAgICAqIEBwYXJhbSBjYWxsYmFja1xuICAgICAqL1xuICAgIHN0YXRpYyBwYXRoQ2hhbmdlKGNhbGxiYWNrKSB7XG4gICAgICAgIGlmIChSZWJlbFJvdXRlci5jaGFuZ2VDYWxsYmFja3MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgUmViZWxSb3V0ZXIuY2hhbmdlQ2FsbGJhY2tzID0gW107XG4gICAgICAgIH1cbiAgICAgICAgUmViZWxSb3V0ZXIuY2hhbmdlQ2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICBjb25zdCBjaGFuZ2VIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgZXZlbnQub2xkVVJMIGFuZCBldmVudC5uZXdVUkwgd291bGQgYmUgYmV0dGVyIGhlcmUgYnV0IHRoaXMgZG9lc24ndCB3b3JrIGluIElFIDooXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uaHJlZiAhPSBSZWJlbFJvdXRlci5vbGRVUkwpIHtcbiAgICAgICAgICAgICAgICBSZWJlbFJvdXRlci5jaGFuZ2VDYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbihjYWxsYmFjayl7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKFJlYmVsUm91dGVyLmlzQmFjayk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgUmViZWxSb3V0ZXIuaXNCYWNrID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBSZWJlbFJvdXRlci5vbGRVUkwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHdpbmRvdy5vbmhhc2hjaGFuZ2UgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmJsYmFja1wiLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIFJlYmVsUm91dGVyLmlzQmFjayA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cub25oYXNoY2hhbmdlID0gY2hhbmdlSGFuZGxlcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdGF0aWMgaGVscGVyIG1ldGhvZCB1c2VkIHRvIGdldCB0aGUgcGFyYW1ldGVycyBmcm9tIHRoZSBwcm92aWRlZCByb3V0ZS5cbiAgICAgKiBAcGFyYW0gcmVnZXhcbiAgICAgKiBAcGFyYW0gcm91dGVcbiAgICAgKiBAcGFyYW0gcGF0aFxuICAgICAqIEByZXR1cm5zIHt7fX1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0UGFyYW1zRnJvbVVybChyZWdleCwgcm91dGUsIHBhdGgpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFJlYmVsUm91dGVyLnBhcnNlUXVlcnlTdHJpbmcocGF0aCk7XG4gICAgICAgIHZhciByZSA9IC97KFxcdyspfS9nO1xuICAgICAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgICAgICBsZXQgbWF0Y2g7XG4gICAgICAgIHdoaWxlIChtYXRjaCA9IHJlLmV4ZWMocm91dGUpKSB7XG4gICAgICAgICAgICByZXN1bHRzLnB1c2gobWF0Y2hbMV0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWdleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdHMyID0gcmVnZXguZXhlYyhwYXRoKTtcbiAgICAgICAgICAgIHJlc3VsdHMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaWR4KSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W2l0ZW1dID0gcmVzdWx0czJbaWR4ICsgMV07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0YXRpYyBoZWxwZXIgbWV0aG9kIHVzZWQgdG8gZ2V0IHRoZSBwYXRoIGZyb20gdGhlIGN1cnJlbnQgVVJMLlxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRQYXRoRnJvbVVybCgpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLm1hdGNoKC8jKC4qKSQvKTtcbiAgICAgICAgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFsxXTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwicmViZWwtcm91dGVyXCIsIFJlYmVsUm91dGVyKTtcblxuLyoqXG4gKiBDbGFzcyB3aGljaCByZXByZXNlbnRzIHRoZSByZWJlbC1yb3V0ZSBjdXN0b20gZWxlbWVudFxuICovXG5leHBvcnQgY2xhc3MgUmViZWxSb3V0ZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxufVxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwicmViZWwtcm91dGVcIiwgUmViZWxSb3V0ZSk7XG5cbi8qKlxuICogQ2xhc3Mgd2hpY2ggcmVwcmVzZW50cyB0aGUgcmViZWwtZGVmYXVsdCBjdXN0b20gZWxlbWVudFxuICovXG5jbGFzcyBSZWJlbERlZmF1bHQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cbn1cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcInJlYmVsLWRlZmF1bHRcIiwgUmViZWxEZWZhdWx0KTtcblxuXG4vKipcbiAqIFJlcHJlc2VudHMgdGhlIHByb3RvdHlwZSBmb3IgYW4gYW5jaG9yIGVsZW1lbnQgd2hpY2ggYWRkZWQgZnVuY3Rpb25hbGl0eSB0byBwZXJmb3JtIGEgYmFjayB0cmFuc2l0aW9uLlxuICovXG5jbGFzcyBSZWJlbEJhY2tBIGV4dGVuZHMgSFRNTEFuY2hvckVsZW1lbnQge1xuICAgIGF0dGFjaGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKTtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBpZiAocGF0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdyYmxiYWNrJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBwYXRoO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4vKipcbiAqIFJlZ2lzdGVyIHRoZSBiYWNrIGJ1dHRvbiBjdXN0b20gZWxlbWVudFxuICovXG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJyZWJlbC1iYWNrLWFcIiwge1xuICAgIGV4dGVuZHM6IFwiYVwiLFxuICAgIHByb3RvdHlwZTogUmViZWxCYWNrQS5wcm90b3R5cGVcbn0pO1xuXG4vKipcbiAqIENvbnN0cnVjdHMgYSByb3V0ZSBvYmplY3RcbiAqIEBwYXJhbSBvYmogLSB0aGUgY29tcG9uZW50IG5hbWUgb3IgdGhlIEhUTUwgdGVtcGxhdGVcbiAqIEBwYXJhbSByb3V0ZVxuICogQHBhcmFtIHJlZ2V4XG4gKiBAcGFyYW0gcGF0aFxuICogQHJldHVybnMge3t9fVxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gX3JvdXRlUmVzdWx0KG9iaiwgcm91dGUsIHJlZ2V4LCBwYXRoKSB7XG4gICAgbGV0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICByZXN1bHRba2V5XSA9IG9ialtrZXldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5yb3V0ZSA9IHJvdXRlO1xuICAgIHJlc3VsdC5wYXRoID0gcGF0aDtcbiAgICByZXN1bHQucGFyYW1zID0gUmViZWxSb3V0ZXIuZ2V0UGFyYW1zRnJvbVVybChyZWdleCwgcm91dGUsIHBhdGgpO1xuICAgIHJldHVybiByZXN1bHQ7XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9yZWJlbC1yb3V0ZXIvc3JjL3JlYmVsLXJvdXRlci5qcyIsIjsoZnVuY3Rpb24oKXtcclxuXHJcblx0LyogVU5CVUlMRCAqL1xyXG5cdHZhciByb290O1xyXG5cdGlmKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpeyByb290ID0gd2luZG93IH1cclxuXHRpZih0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiKXsgcm9vdCA9IGdsb2JhbCB9XHJcblx0cm9vdCA9IHJvb3QgfHwge307XHJcblx0dmFyIGNvbnNvbGUgPSByb290LmNvbnNvbGUgfHwge2xvZzogZnVuY3Rpb24oKXt9fTtcclxuXHRmdW5jdGlvbiByZXF1aXJlKGFyZyl7XHJcblx0XHRyZXR1cm4gYXJnLnNsaWNlPyByZXF1aXJlW3Jlc29sdmUoYXJnKV0gOiBmdW5jdGlvbihtb2QsIHBhdGgpe1xyXG5cdFx0XHRhcmcobW9kID0ge2V4cG9ydHM6IHt9fSk7XHJcblx0XHRcdHJlcXVpcmVbcmVzb2x2ZShwYXRoKV0gPSBtb2QuZXhwb3J0cztcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIHJlc29sdmUocGF0aCl7XHJcblx0XHRcdHJldHVybiBwYXRoLnNwbGl0KCcvJykuc2xpY2UoLTEpLnRvU3RyaW5nKCkucmVwbGFjZSgnLmpzJywnJyk7XHJcblx0XHR9XHJcblx0fVxyXG5cdGlmKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIpeyB2YXIgY29tbW9uID0gbW9kdWxlIH1cclxuXHQvKiBVTkJVSUxEICovXHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHQvLyBHZW5lcmljIGphdmFzY3JpcHQgdXRpbGl0aWVzLlxyXG5cdFx0dmFyIFR5cGUgPSB7fTtcclxuXHRcdC8vVHlwZS5mbnMgPSBUeXBlLmZuID0ge2lzOiBmdW5jdGlvbihmbil7IHJldHVybiAoISFmbiAmJiBmbiBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB9fVxyXG5cdFx0VHlwZS5mbnMgPSBUeXBlLmZuID0ge2lzOiBmdW5jdGlvbihmbil7IHJldHVybiAoISFmbiAmJiAnZnVuY3Rpb24nID09IHR5cGVvZiBmbikgfX1cclxuXHRcdFR5cGUuYmkgPSB7aXM6IGZ1bmN0aW9uKGIpeyByZXR1cm4gKGIgaW5zdGFuY2VvZiBCb29sZWFuIHx8IHR5cGVvZiBiID09ICdib29sZWFuJykgfX1cclxuXHRcdFR5cGUubnVtID0ge2lzOiBmdW5jdGlvbihuKXsgcmV0dXJuICFsaXN0X2lzKG4pICYmICgobiAtIHBhcnNlRmxvYXQobikgKyAxKSA+PSAwIHx8IEluZmluaXR5ID09PSBuIHx8IC1JbmZpbml0eSA9PT0gbikgfX1cclxuXHRcdFR5cGUudGV4dCA9IHtpczogZnVuY3Rpb24odCl7IHJldHVybiAodHlwZW9mIHQgPT0gJ3N0cmluZycpIH19XHJcblx0XHRUeXBlLnRleHQuaWZ5ID0gZnVuY3Rpb24odCl7XHJcblx0XHRcdGlmKFR5cGUudGV4dC5pcyh0KSl7IHJldHVybiB0IH1cclxuXHRcdFx0aWYodHlwZW9mIEpTT04gIT09IFwidW5kZWZpbmVkXCIpeyByZXR1cm4gSlNPTi5zdHJpbmdpZnkodCkgfVxyXG5cdFx0XHRyZXR1cm4gKHQgJiYgdC50b1N0cmluZyk/IHQudG9TdHJpbmcoKSA6IHQ7XHJcblx0XHR9XHJcblx0XHRUeXBlLnRleHQucmFuZG9tID0gZnVuY3Rpb24obCwgYyl7XHJcblx0XHRcdHZhciBzID0gJyc7XHJcblx0XHRcdGwgPSBsIHx8IDI0OyAvLyB5b3UgYXJlIG5vdCBnb2luZyB0byBtYWtlIGEgMCBsZW5ndGggcmFuZG9tIG51bWJlciwgc28gbm8gbmVlZCB0byBjaGVjayB0eXBlXHJcblx0XHRcdGMgPSBjIHx8ICcwMTIzNDU2Nzg5QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6JztcclxuXHRcdFx0d2hpbGUobCA+IDApeyBzICs9IGMuY2hhckF0KE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGMubGVuZ3RoKSk7IGwtLSB9XHJcblx0XHRcdHJldHVybiBzO1xyXG5cdFx0fVxyXG5cdFx0VHlwZS50ZXh0Lm1hdGNoID0gZnVuY3Rpb24odCwgbyl7IHZhciByID0gZmFsc2U7XHJcblx0XHRcdHQgPSB0IHx8ICcnO1xyXG5cdFx0XHRvID0gVHlwZS50ZXh0LmlzKG8pPyB7Jz0nOiBvfSA6IG8gfHwge307IC8vIHsnficsICc9JywgJyonLCAnPCcsICc+JywgJysnLCAnLScsICc/JywgJyEnfSAvLyBpZ25vcmUgY2FzZSwgZXhhY3RseSBlcXVhbCwgYW55dGhpbmcgYWZ0ZXIsIGxleGljYWxseSBsYXJnZXIsIGxleGljYWxseSBsZXNzZXIsIGFkZGVkIGluLCBzdWJ0YWN0ZWQgZnJvbSwgcXVlc3Rpb25hYmxlIGZ1enp5IG1hdGNoLCBhbmQgZW5kcyB3aXRoLlxyXG5cdFx0XHRpZihUeXBlLm9iai5oYXMobywnficpKXsgdCA9IHQudG9Mb3dlckNhc2UoKTsgb1snPSddID0gKG9bJz0nXSB8fCBvWyd+J10pLnRvTG93ZXJDYXNlKCkgfVxyXG5cdFx0XHRpZihUeXBlLm9iai5oYXMobywnPScpKXsgcmV0dXJuIHQgPT09IG9bJz0nXSB9XHJcblx0XHRcdGlmKFR5cGUub2JqLmhhcyhvLCcqJykpeyBpZih0LnNsaWNlKDAsIG9bJyonXS5sZW5ndGgpID09PSBvWycqJ10peyByID0gdHJ1ZTsgdCA9IHQuc2xpY2Uob1snKiddLmxlbmd0aCkgfSBlbHNlIHsgcmV0dXJuIGZhbHNlIH19XHJcblx0XHRcdGlmKFR5cGUub2JqLmhhcyhvLCchJykpeyBpZih0LnNsaWNlKC1vWychJ10ubGVuZ3RoKSA9PT0gb1snISddKXsgciA9IHRydWUgfSBlbHNlIHsgcmV0dXJuIGZhbHNlIH19XHJcblx0XHRcdGlmKFR5cGUub2JqLmhhcyhvLCcrJykpe1xyXG5cdFx0XHRcdGlmKFR5cGUubGlzdC5tYXAoVHlwZS5saXN0LmlzKG9bJysnXSk/IG9bJysnXSA6IFtvWycrJ11dLCBmdW5jdGlvbihtKXtcclxuXHRcdFx0XHRcdGlmKHQuaW5kZXhPZihtKSA+PSAwKXsgciA9IHRydWUgfSBlbHNlIHsgcmV0dXJuIHRydWUgfVxyXG5cdFx0XHRcdH0pKXsgcmV0dXJuIGZhbHNlIH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZihUeXBlLm9iai5oYXMobywnLScpKXtcclxuXHRcdFx0XHRpZihUeXBlLmxpc3QubWFwKFR5cGUubGlzdC5pcyhvWyctJ10pPyBvWyctJ10gOiBbb1snLSddXSwgZnVuY3Rpb24obSl7XHJcblx0XHRcdFx0XHRpZih0LmluZGV4T2YobSkgPCAwKXsgciA9IHRydWUgfSBlbHNlIHsgcmV0dXJuIHRydWUgfVxyXG5cdFx0XHRcdH0pKXsgcmV0dXJuIGZhbHNlIH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZihUeXBlLm9iai5oYXMobywnPicpKXsgaWYodCA+IG9bJz4nXSl7IHIgPSB0cnVlIH0gZWxzZSB7IHJldHVybiBmYWxzZSB9fVxyXG5cdFx0XHRpZihUeXBlLm9iai5oYXMobywnPCcpKXsgaWYodCA8IG9bJzwnXSl7IHIgPSB0cnVlIH0gZWxzZSB7IHJldHVybiBmYWxzZSB9fVxyXG5cdFx0XHRmdW5jdGlvbiBmdXp6eSh0LGYpeyB2YXIgbiA9IC0xLCBpID0gMCwgYzsgZm9yKDtjID0gZltpKytdOyl7IGlmKCF+KG4gPSB0LmluZGV4T2YoYywgbisxKSkpeyByZXR1cm4gZmFsc2UgfX0gcmV0dXJuIHRydWUgfSAvLyB2aWEgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy85MjA2MDEzL2phdmFzY3JpcHQtZnV6enktc2VhcmNoXHJcblx0XHRcdGlmKFR5cGUub2JqLmhhcyhvLCc/JykpeyBpZihmdXp6eSh0LCBvWyc/J10pKXsgciA9IHRydWUgfSBlbHNlIHsgcmV0dXJuIGZhbHNlIH19IC8vIGNoYW5nZSBuYW1lIVxyXG5cdFx0XHRyZXR1cm4gcjtcclxuXHRcdH1cclxuXHRcdFR5cGUubGlzdCA9IHtpczogZnVuY3Rpb24obCl7IHJldHVybiAobCBpbnN0YW5jZW9mIEFycmF5KSB9fVxyXG5cdFx0VHlwZS5saXN0LnNsaXQgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XHJcblx0XHRUeXBlLmxpc3Quc29ydCA9IGZ1bmN0aW9uKGspeyAvLyBjcmVhdGVzIGEgbmV3IHNvcnQgZnVuY3Rpb24gYmFzZWQgb2ZmIHNvbWUgZmllbGRcclxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKEEsQil7XHJcblx0XHRcdFx0aWYoIUEgfHwgIUIpeyByZXR1cm4gMCB9IEEgPSBBW2tdOyBCID0gQltrXTtcclxuXHRcdFx0XHRpZihBIDwgQil7IHJldHVybiAtMSB9ZWxzZSBpZihBID4gQil7IHJldHVybiAxIH1cclxuXHRcdFx0XHRlbHNlIHsgcmV0dXJuIDAgfVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRUeXBlLmxpc3QubWFwID0gZnVuY3Rpb24obCwgYywgXyl7IHJldHVybiBvYmpfbWFwKGwsIGMsIF8pIH1cclxuXHRcdFR5cGUubGlzdC5pbmRleCA9IDE7IC8vIGNoYW5nZSB0aGlzIHRvIDAgaWYgeW91IHdhbnQgbm9uLWxvZ2ljYWwsIG5vbi1tYXRoZW1hdGljYWwsIG5vbi1tYXRyaXgsIG5vbi1jb252ZW5pZW50IGFycmF5IG5vdGF0aW9uXHJcblx0XHRUeXBlLm9iaiA9IHtpczogZnVuY3Rpb24obyl7IHJldHVybiBvPyAobyBpbnN0YW5jZW9mIE9iamVjdCAmJiBvLmNvbnN0cnVjdG9yID09PSBPYmplY3QpIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5tYXRjaCgvXlxcW29iamVjdCAoXFx3KylcXF0kLylbMV0gPT09ICdPYmplY3QnIDogZmFsc2UgfX1cclxuXHRcdFR5cGUub2JqLnB1dCA9IGZ1bmN0aW9uKG8sIGYsIHYpeyByZXR1cm4gKG98fHt9KVtmXSA9IHYsIG8gfVxyXG5cdFx0VHlwZS5vYmouaGFzID0gZnVuY3Rpb24obywgZil7IHJldHVybiBvICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBmKSB9XHJcblx0XHRUeXBlLm9iai5kZWwgPSBmdW5jdGlvbihvLCBrKXtcclxuXHRcdFx0aWYoIW8peyByZXR1cm4gfVxyXG5cdFx0XHRvW2tdID0gbnVsbDtcclxuXHRcdFx0ZGVsZXRlIG9ba107XHJcblx0XHRcdHJldHVybiBvO1xyXG5cdFx0fVxyXG5cdFx0VHlwZS5vYmouYXMgPSBmdW5jdGlvbihvLCBmLCB2LCB1KXsgcmV0dXJuIG9bZl0gPSBvW2ZdIHx8ICh1ID09PSB2PyB7fSA6IHYpIH1cclxuXHRcdFR5cGUub2JqLmlmeSA9IGZ1bmN0aW9uKG8pe1xyXG5cdFx0XHRpZihvYmpfaXMobykpeyByZXR1cm4gbyB9XHJcblx0XHRcdHRyeXtvID0gSlNPTi5wYXJzZShvKTtcclxuXHRcdFx0fWNhdGNoKGUpe289e319O1xyXG5cdFx0XHRyZXR1cm4gbztcclxuXHRcdH1cclxuXHRcdDsoZnVuY3Rpb24oKXsgdmFyIHU7XHJcblx0XHRcdGZ1bmN0aW9uIG1hcCh2LGYpe1xyXG5cdFx0XHRcdGlmKG9ial9oYXModGhpcyxmKSAmJiB1ICE9PSB0aGlzW2ZdKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR0aGlzW2ZdID0gdjtcclxuXHRcdFx0fVxyXG5cdFx0XHRUeXBlLm9iai50byA9IGZ1bmN0aW9uKGZyb20sIHRvKXtcclxuXHRcdFx0XHR0byA9IHRvIHx8IHt9O1xyXG5cdFx0XHRcdG9ial9tYXAoZnJvbSwgbWFwLCB0byk7XHJcblx0XHRcdFx0cmV0dXJuIHRvO1xyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0VHlwZS5vYmouY29weSA9IGZ1bmN0aW9uKG8peyAvLyBiZWNhdXNlIGh0dHA6Ly93ZWIuYXJjaGl2ZS5vcmcvd2ViLzIwMTQwMzI4MjI0MDI1L2h0dHA6Ly9qc3BlcmYuY29tL2Nsb25pbmctYW4tb2JqZWN0LzJcclxuXHRcdFx0cmV0dXJuICFvPyBvIDogSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvKSk7IC8vIGlzIHNob2NraW5nbHkgZmFzdGVyIHRoYW4gYW55dGhpbmcgZWxzZSwgYW5kIG91ciBkYXRhIGhhcyB0byBiZSBhIHN1YnNldCBvZiBKU09OIGFueXdheXMhXHJcblx0XHR9XHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdGZ1bmN0aW9uIGVtcHR5KHYsaSl7IHZhciBuID0gdGhpcy5uO1xyXG5cdFx0XHRcdGlmKG4gJiYgKGkgPT09IG4gfHwgKG9ial9pcyhuKSAmJiBvYmpfaGFzKG4sIGkpKSkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGlmKGkpeyByZXR1cm4gdHJ1ZSB9XHJcblx0XHRcdH1cclxuXHRcdFx0VHlwZS5vYmouZW1wdHkgPSBmdW5jdGlvbihvLCBuKXtcclxuXHRcdFx0XHRpZighbyl7IHJldHVybiB0cnVlIH1cclxuXHRcdFx0XHRyZXR1cm4gb2JqX21hcChvLGVtcHR5LHtuOm59KT8gZmFsc2UgOiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRmdW5jdGlvbiB0KGssdil7XHJcblx0XHRcdFx0aWYoMiA9PT0gYXJndW1lbnRzLmxlbmd0aCl7XHJcblx0XHRcdFx0XHR0LnIgPSB0LnIgfHwge307XHJcblx0XHRcdFx0XHR0LnJba10gPSB2O1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH0gdC5yID0gdC5yIHx8IFtdO1xyXG5cdFx0XHRcdHQuci5wdXNoKGspO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHR2YXIga2V5cyA9IE9iamVjdC5rZXlzO1xyXG5cdFx0XHRUeXBlLm9iai5tYXAgPSBmdW5jdGlvbihsLCBjLCBfKXtcclxuXHRcdFx0XHR2YXIgdSwgaSA9IDAsIHgsIHIsIGxsLCBsbGUsIGYgPSBmbl9pcyhjKTtcclxuXHRcdFx0XHR0LnIgPSBudWxsO1xyXG5cdFx0XHRcdGlmKGtleXMgJiYgb2JqX2lzKGwpKXtcclxuXHRcdFx0XHRcdGxsID0gT2JqZWN0LmtleXMobCk7IGxsZSA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGxpc3RfaXMobCkgfHwgbGwpe1xyXG5cdFx0XHRcdFx0eCA9IChsbCB8fCBsKS5sZW5ndGg7XHJcblx0XHRcdFx0XHRmb3IoO2kgPCB4OyBpKyspe1xyXG5cdFx0XHRcdFx0XHR2YXIgaWkgPSAoaSArIFR5cGUubGlzdC5pbmRleCk7XHJcblx0XHRcdFx0XHRcdGlmKGYpe1xyXG5cdFx0XHRcdFx0XHRcdHIgPSBsbGU/IGMuY2FsbChfIHx8IHRoaXMsIGxbbGxbaV1dLCBsbFtpXSwgdCkgOiBjLmNhbGwoXyB8fCB0aGlzLCBsW2ldLCBpaSwgdCk7XHJcblx0XHRcdFx0XHRcdFx0aWYociAhPT0gdSl7IHJldHVybiByIH1cclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHQvL2lmKFR5cGUudGVzdC5pcyhjLGxbaV0pKXsgcmV0dXJuIGlpIH0gLy8gc2hvdWxkIGltcGxlbWVudCBkZWVwIGVxdWFsaXR5IHRlc3RpbmchXHJcblx0XHRcdFx0XHRcdFx0aWYoYyA9PT0gbFtsbGU/IGxsW2ldIDogaV0peyByZXR1cm4gbGw/IGxsW2ldIDogaWkgfSAvLyB1c2UgdGhpcyBmb3Igbm93XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Zm9yKGkgaW4gbCl7XHJcblx0XHRcdFx0XHRcdGlmKGYpe1xyXG5cdFx0XHRcdFx0XHRcdGlmKG9ial9oYXMobCxpKSl7XHJcblx0XHRcdFx0XHRcdFx0XHRyID0gXz8gYy5jYWxsKF8sIGxbaV0sIGksIHQpIDogYyhsW2ldLCBpLCB0KTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmKHIgIT09IHUpeyByZXR1cm4gciB9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdC8vaWYoYS50ZXN0LmlzKGMsbFtpXSkpeyByZXR1cm4gaSB9IC8vIHNob3VsZCBpbXBsZW1lbnQgZGVlcCBlcXVhbGl0eSB0ZXN0aW5nIVxyXG5cdFx0XHRcdFx0XHRcdGlmKGMgPT09IGxbaV0peyByZXR1cm4gaSB9IC8vIHVzZSB0aGlzIGZvciBub3dcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gZj8gdC5yIDogVHlwZS5saXN0LmluZGV4PyAwIDogLTE7XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblx0XHRUeXBlLnRpbWUgPSB7fTtcclxuXHRcdFR5cGUudGltZS5pcyA9IGZ1bmN0aW9uKHQpeyByZXR1cm4gdD8gdCBpbnN0YW5jZW9mIERhdGUgOiAoK25ldyBEYXRlKCkuZ2V0VGltZSgpKSB9XHJcblxyXG5cdFx0dmFyIGZuX2lzID0gVHlwZS5mbi5pcztcclxuXHRcdHZhciBsaXN0X2lzID0gVHlwZS5saXN0LmlzO1xyXG5cdFx0dmFyIG9iaiA9IFR5cGUub2JqLCBvYmpfaXMgPSBvYmouaXMsIG9ial9oYXMgPSBvYmouaGFzLCBvYmpfbWFwID0gb2JqLm1hcDtcclxuXHRcdG1vZHVsZS5leHBvcnRzID0gVHlwZTtcclxuXHR9KShyZXF1aXJlLCAnLi90eXBlJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHQvLyBPbiBldmVudCBlbWl0dGVyIGdlbmVyaWMgamF2YXNjcmlwdCB1dGlsaXR5LlxyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBvbnRvKHRhZywgYXJnLCBhcyl7XHJcblx0XHRcdGlmKCF0YWcpeyByZXR1cm4ge3RvOiBvbnRvfSB9XHJcblx0XHRcdHZhciB0YWcgPSAodGhpcy50YWcgfHwgKHRoaXMudGFnID0ge30pKVt0YWddIHx8XHJcblx0XHRcdCh0aGlzLnRhZ1t0YWddID0ge3RhZzogdGFnLCB0bzogb250by5fID0ge1xyXG5cdFx0XHRcdG5leHQ6IGZ1bmN0aW9uKCl7fVxyXG5cdFx0XHR9fSk7XHJcblx0XHRcdGlmKGFyZyBpbnN0YW5jZW9mIEZ1bmN0aW9uKXtcclxuXHRcdFx0XHR2YXIgYmUgPSB7XHJcblx0XHRcdFx0XHRvZmY6IG9udG8ub2ZmIHx8IFxyXG5cdFx0XHRcdFx0KG9udG8ub2ZmID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdFx0aWYodGhpcy5uZXh0ID09PSBvbnRvLl8ubmV4dCl7IHJldHVybiAhMCB9XHJcblx0XHRcdFx0XHRcdGlmKHRoaXMgPT09IHRoaXMudGhlLmxhc3Qpe1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMudGhlLmxhc3QgPSB0aGlzLmJhY2s7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0dGhpcy50by5iYWNrID0gdGhpcy5iYWNrO1xyXG5cdFx0XHRcdFx0XHR0aGlzLm5leHQgPSBvbnRvLl8ubmV4dDtcclxuXHRcdFx0XHRcdFx0dGhpcy5iYWNrLnRvID0gdGhpcy50bztcclxuXHRcdFx0XHRcdH0pLFxyXG5cdFx0XHRcdFx0dG86IG9udG8uXyxcclxuXHRcdFx0XHRcdG5leHQ6IGFyZyxcclxuXHRcdFx0XHRcdHRoZTogdGFnLFxyXG5cdFx0XHRcdFx0b246IHRoaXMsXHJcblx0XHRcdFx0XHRhczogYXMsXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHQoYmUuYmFjayA9IHRhZy5sYXN0IHx8IHRhZykudG8gPSBiZTtcclxuXHRcdFx0XHRyZXR1cm4gdGFnLmxhc3QgPSBiZTtcclxuXHRcdFx0fVxyXG5cdFx0XHQodGFnID0gdGFnLnRvKS5uZXh0KGFyZyk7XHJcblx0XHRcdHJldHVybiB0YWc7XHJcblx0XHR9O1xyXG5cdH0pKHJlcXVpcmUsICcuL29udG8nKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdC8vIFRPRE86IE5lZWRzIHRvIGJlIHJlZG9uZS5cclxuXHRcdHZhciBPbiA9IHJlcXVpcmUoJy4vb250bycpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIENoYWluKGNyZWF0ZSwgb3B0KXtcclxuXHRcdFx0b3B0ID0gb3B0IHx8IHt9O1xyXG5cdFx0XHRvcHQuaWQgPSBvcHQuaWQgfHwgJyMnO1xyXG5cdFx0XHRvcHQucmlkID0gb3B0LnJpZCB8fCAnQCc7XHJcblx0XHRcdG9wdC51dWlkID0gb3B0LnV1aWQgfHwgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4gKCtuZXcgRGF0ZSgpKSArIE1hdGgucmFuZG9tKCk7XHJcblx0XHRcdH07XHJcblx0XHRcdHZhciBvbiA9IE9uOy8vT24uc2NvcGUoKTtcclxuXHJcblx0XHRcdG9uLnN0dW4gPSBmdW5jdGlvbihjaGFpbil7XHJcblx0XHRcdFx0dmFyIHN0dW4gPSBmdW5jdGlvbihldil7XHJcblx0XHRcdFx0XHRpZihzdHVuLm9mZiAmJiBzdHVuID09PSB0aGlzLnN0dW4pe1xyXG5cdFx0XHRcdFx0XHR0aGlzLnN0dW4gPSBudWxsO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZihvbi5zdHVuLnNraXApe1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZihldil7XHJcblx0XHRcdFx0XHRcdGV2LmNiID0gZXYuZm47XHJcblx0XHRcdFx0XHRcdGV2Lm9mZigpO1xyXG5cdFx0XHRcdFx0XHRyZXMucXVldWUucHVzaChldik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9LCByZXMgPSBzdHVuLnJlcyA9IGZ1bmN0aW9uKHRtcCwgYXMpe1xyXG5cdFx0XHRcdFx0aWYoc3R1bi5vZmYpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0aWYodG1wIGluc3RhbmNlb2YgRnVuY3Rpb24pe1xyXG5cdFx0XHRcdFx0XHRvbi5zdHVuLnNraXAgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHR0bXAuY2FsbChhcyk7XHJcblx0XHRcdFx0XHRcdG9uLnN0dW4uc2tpcCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRzdHVuLm9mZiA9IHRydWU7XHJcblx0XHRcdFx0XHR2YXIgaSA9IDAsIHEgPSByZXMucXVldWUsIGwgPSBxLmxlbmd0aCwgYWN0O1xyXG5cdFx0XHRcdFx0cmVzLnF1ZXVlID0gW107XHJcblx0XHRcdFx0XHRpZihzdHVuID09PSBhdC5zdHVuKXtcclxuXHRcdFx0XHRcdFx0YXQuc3R1biA9IG51bGw7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRmb3IoaTsgaSA8IGw7IGkrKyl7IGFjdCA9IHFbaV07XHJcblx0XHRcdFx0XHRcdGFjdC5mbiA9IGFjdC5jYjtcclxuXHRcdFx0XHRcdFx0YWN0LmNiID0gbnVsbDtcclxuXHRcdFx0XHRcdFx0b24uc3R1bi5za2lwID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0YWN0LmN0eC5vbihhY3QudGFnLCBhY3QuZm4sIGFjdCk7XHJcblx0XHRcdFx0XHRcdG9uLnN0dW4uc2tpcCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sIGF0ID0gY2hhaW4uXztcclxuXHRcdFx0XHRyZXMuYmFjayA9IGF0LnN0dW4gfHwgKGF0LmJhY2t8fHtfOnt9fSkuXy5zdHVuO1xyXG5cdFx0XHRcdGlmKHJlcy5iYWNrKXtcclxuXHRcdFx0XHRcdHJlcy5iYWNrLm5leHQgPSBzdHVuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXMucXVldWUgPSBbXTtcclxuXHRcdFx0XHRhdC5zdHVuID0gc3R1bjsgXHJcblx0XHRcdFx0cmV0dXJuIHJlcztcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gb247XHJcblx0XHRcdHJldHVybjtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHRcdHJldHVybjtcclxuXHRcdFx0dmFyIGFzayA9IG9uLmFzayA9IGZ1bmN0aW9uKGNiLCBhcyl7XHJcblx0XHRcdFx0aWYoIWFzay5vbil7IGFzay5vbiA9IE9uLnNjb3BlKCkgfVxyXG5cdFx0XHRcdHZhciBpZCA9IG9wdC51dWlkKCk7XHJcblx0XHRcdFx0aWYoY2IpeyBhc2sub24oaWQsIGNiLCBhcykgfVxyXG5cdFx0XHRcdHJldHVybiBpZDtcclxuXHRcdFx0fVxyXG5cdFx0XHRhc2suXyA9IG9wdC5pZDtcclxuXHRcdFx0b24uYWNrID0gZnVuY3Rpb24oYXQsIHJlcGx5KXtcclxuXHRcdFx0XHRpZighYXQgfHwgIXJlcGx5IHx8ICFhc2sub24peyByZXR1cm4gfVxyXG5cdFx0XHRcdHZhciBpZCA9IGF0W29wdC5pZF0gfHwgYXQ7XHJcblx0XHRcdFx0aWYoIWFzay5vbnNbaWRdKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRhc2sub24oaWQsIHJlcGx5KTtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRvbi5hY2suXyA9IG9wdC5yaWQ7XHJcblxyXG5cclxuXHRcdFx0cmV0dXJuIG9uO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHRcdHJldHVybjtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHRcdG9uLm9uKCdldmVudCcsIGZ1bmN0aW9uIGV2ZW50KGFjdCl7XHJcblx0XHRcdFx0dmFyIGxhc3QgPSBhY3Qub24ubGFzdCwgdG1wO1xyXG5cdFx0XHRcdGlmKCdpbicgPT09IGFjdC50YWcgJiYgR3VuLmNoYWluLmNoYWluLmlucHV0ICE9PSBhY3QuZm4peyAvLyBUT0RPOiBCVUchIEd1biBpcyBub3QgYXZhaWxhYmxlIGluIHRoaXMgbW9kdWxlLlxyXG5cdFx0XHRcdFx0aWYoKHRtcCA9IGFjdC5jdHgpICYmIHRtcC5zdHVuKXtcclxuXHRcdFx0XHRcdFx0aWYodG1wLnN0dW4oYWN0KSl7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKCFsYXN0KXsgcmV0dXJuIH1cclxuXHRcdFx0XHRpZihhY3Qub24ubWFwKXtcclxuXHRcdFx0XHRcdHZhciBtYXAgPSBhY3Qub24ubWFwLCB2O1xyXG5cdFx0XHRcdFx0Zm9yKHZhciBmIGluIG1hcCl7IHYgPSBtYXBbZl07XHJcblx0XHRcdFx0XHRcdGlmKHYpe1xyXG5cdFx0XHRcdFx0XHRcdGVtaXQodiwgYWN0LCBldmVudCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8qXHJcblx0XHRcdFx0XHRHdW4ub2JqLm1hcChhY3Qub24ubWFwLCBmdW5jdGlvbih2LGYpeyAvLyBUT0RPOiBCVUchIEd1biBpcyBub3QgYXZhaWxhYmxlIGluIHRoaXMgbW9kdWxlLlxyXG5cdFx0XHRcdFx0XHQvL2VtaXQodlswXSwgYWN0LCBldmVudCwgdlsxXSk7IC8vIGJlbG93IGVuYWJsZXMgbW9yZSBjb250cm9sXHJcblx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCJib29vb29vb29cIiwgZix2KTtcclxuXHRcdFx0XHRcdFx0ZW1pdCh2LCBhY3QsIGV2ZW50KTtcclxuXHRcdFx0XHRcdFx0Ly9lbWl0KHZbMV0sIGFjdCwgZXZlbnQsIHZbMl0pO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHQqL1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRlbWl0KGxhc3QsIGFjdCwgZXZlbnQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihsYXN0ICE9PSBhY3Qub24ubGFzdCl7XHJcblx0XHRcdFx0XHRldmVudChhY3QpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdGZ1bmN0aW9uIGVtaXQobGFzdCwgYWN0LCBldmVudCwgZXYpe1xyXG5cdFx0XHRcdGlmKGxhc3QgaW5zdGFuY2VvZiBBcnJheSl7XHJcblx0XHRcdFx0XHRhY3QuZm4uYXBwbHkoYWN0LmFzLCBsYXN0LmNvbmNhdChldnx8YWN0KSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGFjdC5mbi5jYWxsKGFjdC5hcywgbGFzdCwgZXZ8fGFjdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvKm9uLm9uKCdlbWl0JywgZnVuY3Rpb24oZXYpe1xyXG5cdFx0XHRcdGlmKGV2Lm9uLm1hcCl7XHJcblx0XHRcdFx0XHR2YXIgaWQgPSBldi5hcmcudmlhLmd1bi5fLmlkICsgZXYuYXJnLmdldDtcclxuXHRcdFx0XHRcdC8vXHJcblx0XHRcdFx0XHQvL2V2LmlkID0gZXYuaWQgfHwgR3VuLnRleHQucmFuZG9tKDYpO1xyXG5cdFx0XHRcdFx0Ly9ldi5vbi5tYXBbZXYuaWRdID0gZXYuYXJnO1xyXG5cdFx0XHRcdFx0Ly9ldi5wcm94eSA9IGV2LmFyZ1sxXTtcclxuXHRcdFx0XHRcdC8vZXYuYXJnID0gZXYuYXJnWzBdO1xyXG5cdFx0XHRcdFx0Ly8gYmVsb3cgZ2l2ZXMgbW9yZSBjb250cm9sLlxyXG5cdFx0XHRcdFx0ZXYub24ubWFwW2lkXSA9IGV2LmFyZztcclxuXHRcdFx0XHRcdC8vZXYucHJveHkgPSBldi5hcmdbMl07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGV2Lm9uLmxhc3QgPSBldi5hcmc7XHJcblx0XHRcdH0pOyovXHJcblxyXG5cdFx0XHRvbi5vbignZW1pdCcsIGZ1bmN0aW9uKGV2KXtcclxuXHRcdFx0XHR2YXIgZ3VuID0gZXYuYXJnLmd1bjtcclxuXHRcdFx0XHRpZignaW4nID09PSBldi50YWcgJiYgZ3VuICYmICFndW4uXy5zb3VsKXsgLy8gVE9ETzogQlVHISBTb3VsIHNob3VsZCBiZSBhdmFpbGFibGUuIEN1cnJlbnRseSBub3QgdXNpbmcgaXQgdGhvdWdoLCBidXQgc2hvdWxkIGVuYWJsZSBpdCAoY2hlY2sgZm9yIHNpZGUgZWZmZWN0cyBpZiBtYWRlIGF2YWlsYWJsZSkuXHJcblx0XHRcdFx0XHQoZXYub24ubWFwID0gZXYub24ubWFwIHx8IHt9KVtndW4uXy5pZCB8fCAoZ3VuLl8uaWQgPSBNYXRoLnJhbmRvbSgpKV0gPSBldi5hcmc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGV2Lm9uLmxhc3QgPSBldi5hcmc7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gb247XHJcblx0XHR9XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IENoYWluO1xyXG5cdH0pKHJlcXVpcmUsICcuL29uaWZ5Jyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHQvLyBHZW5lcmljIGphdmFzY3JpcHQgc2NoZWR1bGVyIHV0aWxpdHkuXHJcblx0XHR2YXIgVHlwZSA9IHJlcXVpcmUoJy4vdHlwZScpO1xyXG5cdFx0ZnVuY3Rpb24gcyhzdGF0ZSwgY2IsIHRpbWUpeyAvLyBtYXliZSB1c2UgbHJ1LWNhY2hlP1xyXG5cdFx0XHRzLnRpbWUgPSB0aW1lIHx8IEd1bi50aW1lLmlzO1xyXG5cdFx0XHRzLndhaXRpbmcucHVzaCh7d2hlbjogc3RhdGUsIGV2ZW50OiBjYiB8fCBmdW5jdGlvbigpe319KTtcclxuXHRcdFx0aWYocy5zb29uZXN0IDwgc3RhdGUpeyByZXR1cm4gfVxyXG5cdFx0XHRzLnNldChzdGF0ZSk7XHJcblx0XHR9XHJcblx0XHRzLndhaXRpbmcgPSBbXTtcclxuXHRcdHMuc29vbmVzdCA9IEluZmluaXR5O1xyXG5cdFx0cy5zb3J0ID0gVHlwZS5saXN0LnNvcnQoJ3doZW4nKTtcclxuXHRcdHMuc2V0ID0gZnVuY3Rpb24oZnV0dXJlKXtcclxuXHRcdFx0aWYoSW5maW5pdHkgPD0gKHMuc29vbmVzdCA9IGZ1dHVyZSkpeyByZXR1cm4gfVxyXG5cdFx0XHR2YXIgbm93ID0gcy50aW1lKCk7XHJcblx0XHRcdGZ1dHVyZSA9IChmdXR1cmUgPD0gbm93KT8gMCA6IChmdXR1cmUgLSBub3cpO1xyXG5cdFx0XHRjbGVhclRpbWVvdXQocy5pZCk7XHJcblx0XHRcdHMuaWQgPSBzZXRUaW1lb3V0KHMuY2hlY2ssIGZ1dHVyZSk7XHJcblx0XHR9XHJcblx0XHRzLmVhY2ggPSBmdW5jdGlvbih3YWl0LCBpLCBtYXApe1xyXG5cdFx0XHR2YXIgY3R4ID0gdGhpcztcclxuXHRcdFx0aWYoIXdhaXQpeyByZXR1cm4gfVxyXG5cdFx0XHRpZih3YWl0LndoZW4gPD0gY3R4Lm5vdyl7XHJcblx0XHRcdFx0aWYod2FpdC5ldmVudCBpbnN0YW5jZW9mIEZ1bmN0aW9uKXtcclxuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgd2FpdC5ldmVudCgpIH0sMCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGN0eC5zb29uZXN0ID0gKGN0eC5zb29uZXN0IDwgd2FpdC53aGVuKT8gY3R4LnNvb25lc3QgOiB3YWl0LndoZW47XHJcblx0XHRcdFx0bWFwKHdhaXQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRzLmNoZWNrID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIGN0eCA9IHtub3c6IHMudGltZSgpLCBzb29uZXN0OiBJbmZpbml0eX07XHJcblx0XHRcdHMud2FpdGluZy5zb3J0KHMuc29ydCk7XHJcblx0XHRcdHMud2FpdGluZyA9IFR5cGUubGlzdC5tYXAocy53YWl0aW5nLCBzLmVhY2gsIGN0eCkgfHwgW107XHJcblx0XHRcdHMuc2V0KGN0eC5zb29uZXN0KTtcclxuXHRcdH1cclxuXHRcdG1vZHVsZS5leHBvcnRzID0gcztcclxuXHR9KShyZXF1aXJlLCAnLi9zY2hlZHVsZScpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0LyogQmFzZWQgb24gdGhlIEh5cG90aGV0aWNhbCBBbW5lc2lhIE1hY2hpbmUgdGhvdWdodCBleHBlcmltZW50ICovXHJcblx0XHRmdW5jdGlvbiBIQU0obWFjaGluZVN0YXRlLCBpbmNvbWluZ1N0YXRlLCBjdXJyZW50U3RhdGUsIGluY29taW5nVmFsdWUsIGN1cnJlbnRWYWx1ZSl7XHJcblx0XHRcdGlmKG1hY2hpbmVTdGF0ZSA8IGluY29taW5nU3RhdGUpe1xyXG5cdFx0XHRcdHJldHVybiB7ZGVmZXI6IHRydWV9OyAvLyB0aGUgaW5jb21pbmcgdmFsdWUgaXMgb3V0c2lkZSB0aGUgYm91bmRhcnkgb2YgdGhlIG1hY2hpbmUncyBzdGF0ZSwgaXQgbXVzdCBiZSByZXByb2Nlc3NlZCBpbiBhbm90aGVyIHN0YXRlLlxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGluY29taW5nU3RhdGUgPCBjdXJyZW50U3RhdGUpe1xyXG5cdFx0XHRcdHJldHVybiB7aGlzdG9yaWNhbDogdHJ1ZX07IC8vIHRoZSBpbmNvbWluZyB2YWx1ZSBpcyB3aXRoaW4gdGhlIGJvdW5kYXJ5IG9mIHRoZSBtYWNoaW5lJ3Mgc3RhdGUsIGJ1dCBub3Qgd2l0aGluIHRoZSByYW5nZS5cclxuXHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY3VycmVudFN0YXRlIDwgaW5jb21pbmdTdGF0ZSl7XHJcblx0XHRcdFx0cmV0dXJuIHtjb252ZXJnZTogdHJ1ZSwgaW5jb21pbmc6IHRydWV9OyAvLyB0aGUgaW5jb21pbmcgdmFsdWUgaXMgd2l0aGluIGJvdGggdGhlIGJvdW5kYXJ5IGFuZCB0aGUgcmFuZ2Ugb2YgdGhlIG1hY2hpbmUncyBzdGF0ZS5cclxuXHJcblx0XHRcdH1cclxuXHRcdFx0aWYoaW5jb21pbmdTdGF0ZSA9PT0gY3VycmVudFN0YXRlKXtcclxuXHRcdFx0XHRpZihMZXhpY2FsKGluY29taW5nVmFsdWUpID09PSBMZXhpY2FsKGN1cnJlbnRWYWx1ZSkpeyAvLyBOb3RlOiB3aGlsZSB0aGVzZSBhcmUgcHJhY3RpY2FsbHkgdGhlIHNhbWUsIHRoZSBkZWx0YXMgY291bGQgYmUgdGVjaG5pY2FsbHkgZGlmZmVyZW50XHJcblx0XHRcdFx0XHRyZXR1cm4ge3N0YXRlOiB0cnVlfTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0LypcclxuXHRcdFx0XHRcdFRoZSBmb2xsb3dpbmcgaXMgYSBuYWl2ZSBpbXBsZW1lbnRhdGlvbiwgYnV0IHdpbGwgYWx3YXlzIHdvcmsuXHJcblx0XHRcdFx0XHROZXZlciBjaGFuZ2UgaXQgdW5sZXNzIHlvdSBoYXZlIHNwZWNpZmljIG5lZWRzIHRoYXQgYWJzb2x1dGVseSByZXF1aXJlIGl0LlxyXG5cdFx0XHRcdFx0SWYgY2hhbmdlZCwgeW91ciBkYXRhIHdpbGwgZGl2ZXJnZSB1bmxlc3MgeW91IGd1YXJhbnRlZSBldmVyeSBwZWVyJ3MgYWxnb3JpdGhtIGhhcyBhbHNvIGJlZW4gY2hhbmdlZCB0byBiZSB0aGUgc2FtZS5cclxuXHRcdFx0XHRcdEFzIGEgcmVzdWx0LCBpdCBpcyBoaWdobHkgZGlzY291cmFnZWQgdG8gbW9kaWZ5IGRlc3BpdGUgdGhlIGZhY3QgdGhhdCBpdCBpcyBuYWl2ZSxcclxuXHRcdFx0XHRcdGJlY2F1c2UgY29udmVyZ2VuY2UgKGRhdGEgaW50ZWdyaXR5KSBpcyBnZW5lcmFsbHkgbW9yZSBpbXBvcnRhbnQuXHJcblx0XHRcdFx0XHRBbnkgZGlmZmVyZW5jZSBpbiB0aGlzIGFsZ29yaXRobSBtdXN0IGJlIGdpdmVuIGEgbmV3IGFuZCBkaWZmZXJlbnQgbmFtZS5cclxuXHRcdFx0XHQqL1xyXG5cdFx0XHRcdGlmKExleGljYWwoaW5jb21pbmdWYWx1ZSkgPCBMZXhpY2FsKGN1cnJlbnRWYWx1ZSkpeyAvLyBMZXhpY2FsIG9ubHkgd29ya3Mgb24gc2ltcGxlIHZhbHVlIHR5cGVzIVxyXG5cdFx0XHRcdFx0cmV0dXJuIHtjb252ZXJnZTogdHJ1ZSwgY3VycmVudDogdHJ1ZX07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKExleGljYWwoY3VycmVudFZhbHVlKSA8IExleGljYWwoaW5jb21pbmdWYWx1ZSkpeyAvLyBMZXhpY2FsIG9ubHkgd29ya3Mgb24gc2ltcGxlIHZhbHVlIHR5cGVzIVxyXG5cdFx0XHRcdFx0cmV0dXJuIHtjb252ZXJnZTogdHJ1ZSwgaW5jb21pbmc6IHRydWV9O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4ge2VycjogXCJJbnZhbGlkIENSRFQgRGF0YTogXCIrIGluY29taW5nVmFsdWUgK1wiIHRvIFwiKyBjdXJyZW50VmFsdWUgK1wiIGF0IFwiKyBpbmNvbWluZ1N0YXRlICtcIiB0byBcIisgY3VycmVudFN0YXRlICtcIiFcIn07XHJcblx0XHR9XHJcblx0XHRpZih0eXBlb2YgSlNPTiA9PT0gJ3VuZGVmaW5lZCcpe1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXHJcblx0XHRcdFx0J0pTT04gaXMgbm90IGluY2x1ZGVkIGluIHRoaXMgYnJvd3Nlci4gUGxlYXNlIGxvYWQgaXQgZmlyc3Q6ICcgK1xyXG5cdFx0XHRcdCdhamF4LmNkbmpzLmNvbS9hamF4L2xpYnMvanNvbjIvMjAxMTAyMjMvanNvbjIuanMnXHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblx0XHR2YXIgTGV4aWNhbCA9IEpTT04uc3RyaW5naWZ5LCB1bmRlZmluZWQ7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IEhBTTtcclxuXHR9KShyZXF1aXJlLCAnLi9IQU0nKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBUeXBlID0gcmVxdWlyZSgnLi90eXBlJyk7XHJcblx0XHR2YXIgVmFsID0ge307XHJcblx0XHRWYWwuaXMgPSBmdW5jdGlvbih2KXsgLy8gVmFsaWQgdmFsdWVzIGFyZSBhIHN1YnNldCBvZiBKU09OOiBudWxsLCBiaW5hcnksIG51bWJlciAoIUluZmluaXR5KSwgdGV4dCwgb3IgYSBzb3VsIHJlbGF0aW9uLiBBcnJheXMgbmVlZCBzcGVjaWFsIGFsZ29yaXRobXMgdG8gaGFuZGxlIGNvbmN1cnJlbmN5LCBzbyB0aGV5IGFyZSBub3Qgc3VwcG9ydGVkIGRpcmVjdGx5LiBVc2UgYW4gZXh0ZW5zaW9uIHRoYXQgc3VwcG9ydHMgdGhlbSBpZiBuZWVkZWQgYnV0IHJlc2VhcmNoIHRoZWlyIHByb2JsZW1zIGZpcnN0LlxyXG5cdFx0XHRpZih2ID09PSB1KXsgcmV0dXJuIGZhbHNlIH1cclxuXHRcdFx0aWYodiA9PT0gbnVsbCl7IHJldHVybiB0cnVlIH0gLy8gXCJkZWxldGVzXCIsIG51bGxpbmcgb3V0IGZpZWxkcy5cclxuXHRcdFx0aWYodiA9PT0gSW5maW5pdHkpeyByZXR1cm4gZmFsc2UgfSAvLyB3ZSB3YW50IHRoaXMgdG8gYmUsIGJ1dCBKU09OIGRvZXMgbm90IHN1cHBvcnQgaXQsIHNhZCBmYWNlLlxyXG5cdFx0XHRpZih0ZXh0X2lzKHYpIC8vIGJ5IFwidGV4dFwiIHdlIG1lYW4gc3RyaW5ncy5cclxuXHRcdFx0fHwgYmlfaXModikgLy8gYnkgXCJiaW5hcnlcIiB3ZSBtZWFuIGJvb2xlYW4uXHJcblx0XHRcdHx8IG51bV9pcyh2KSl7IC8vIGJ5IFwibnVtYmVyXCIgd2UgbWVhbiBpbnRlZ2VycyBvciBkZWNpbWFscy4gXHJcblx0XHRcdFx0cmV0dXJuIHRydWU7IC8vIHNpbXBsZSB2YWx1ZXMgYXJlIHZhbGlkLlxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBWYWwucmVsLmlzKHYpIHx8IGZhbHNlOyAvLyBpcyB0aGUgdmFsdWUgYSBzb3VsIHJlbGF0aW9uPyBUaGVuIGl0IGlzIHZhbGlkIGFuZCByZXR1cm4gaXQuIElmIG5vdCwgZXZlcnl0aGluZyBlbHNlIHJlbWFpbmluZyBpcyBhbiBpbnZhbGlkIGRhdGEgdHlwZS4gQ3VzdG9tIGV4dGVuc2lvbnMgY2FuIGJlIGJ1aWx0IG9uIHRvcCBvZiB0aGVzZSBwcmltaXRpdmVzIHRvIHN1cHBvcnQgb3RoZXIgdHlwZXMuXHJcblx0XHR9XHJcblx0XHRWYWwucmVsID0ge186ICcjJ307XHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFZhbC5yZWwuaXMgPSBmdW5jdGlvbih2KXsgLy8gdGhpcyBkZWZpbmVzIHdoZXRoZXIgYW4gb2JqZWN0IGlzIGEgc291bCByZWxhdGlvbiBvciBub3QsIHRoZXkgbG9vayBsaWtlIHRoaXM6IHsnIyc6ICdVVUlEJ31cclxuXHRcdFx0XHRpZih2ICYmIHZbcmVsX10gJiYgIXYuXyAmJiBvYmpfaXModikpeyAvLyBtdXN0IGJlIGFuIG9iamVjdC5cclxuXHRcdFx0XHRcdHZhciBvID0ge307XHJcblx0XHRcdFx0XHRvYmpfbWFwKHYsIG1hcCwgbyk7XHJcblx0XHRcdFx0XHRpZihvLmlkKXsgLy8gYSB2YWxpZCBpZCB3YXMgZm91bmQuXHJcblx0XHRcdFx0XHRcdHJldHVybiBvLmlkOyAvLyB5YXkhIFJldHVybiBpdC5cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlOyAvLyB0aGUgdmFsdWUgd2FzIG5vdCBhIHZhbGlkIHNvdWwgcmVsYXRpb24uXHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbWFwKHMsIGYpeyB2YXIgbyA9IHRoaXM7IC8vIG1hcCBvdmVyIHRoZSBvYmplY3QuLi5cclxuXHRcdFx0XHRpZihvLmlkKXsgcmV0dXJuIG8uaWQgPSBmYWxzZSB9IC8vIGlmIElEIGlzIGFscmVhZHkgZGVmaW5lZCBBTkQgd2UncmUgc3RpbGwgbG9vcGluZyB0aHJvdWdoIHRoZSBvYmplY3QsIGl0IGlzIGNvbnNpZGVyZWQgaW52YWxpZC5cclxuXHRcdFx0XHRpZihmID09IHJlbF8gJiYgdGV4dF9pcyhzKSl7IC8vIHRoZSBmaWVsZCBzaG91bGQgYmUgJyMnIGFuZCBoYXZlIGEgdGV4dCB2YWx1ZS5cclxuXHRcdFx0XHRcdG8uaWQgPSBzOyAvLyB3ZSBmb3VuZCB0aGUgc291bCFcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuIG8uaWQgPSBmYWxzZTsgLy8gaWYgdGhlcmUgZXhpc3RzIGFueXRoaW5nIGVsc2Ugb24gdGhlIG9iamVjdCB0aGF0IGlzbid0IHRoZSBzb3VsLCB0aGVuIGl0IGlzIGNvbnNpZGVyZWQgaW52YWxpZC5cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblx0XHRWYWwucmVsLmlmeSA9IGZ1bmN0aW9uKHQpeyByZXR1cm4gb2JqX3B1dCh7fSwgcmVsXywgdCkgfSAvLyBjb252ZXJ0IGEgc291bCBpbnRvIGEgcmVsYXRpb24gYW5kIHJldHVybiBpdC5cclxuXHRcdHZhciByZWxfID0gVmFsLnJlbC5fLCB1O1xyXG5cdFx0dmFyIGJpX2lzID0gVHlwZS5iaS5pcztcclxuXHRcdHZhciBudW1faXMgPSBUeXBlLm51bS5pcztcclxuXHRcdHZhciB0ZXh0X2lzID0gVHlwZS50ZXh0LmlzO1xyXG5cdFx0dmFyIG9iaiA9IFR5cGUub2JqLCBvYmpfaXMgPSBvYmouaXMsIG9ial9wdXQgPSBvYmoucHV0LCBvYmpfbWFwID0gb2JqLm1hcDtcclxuXHRcdG1vZHVsZS5leHBvcnRzID0gVmFsO1xyXG5cdH0pKHJlcXVpcmUsICcuL3ZhbCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIFR5cGUgPSByZXF1aXJlKCcuL3R5cGUnKTtcclxuXHRcdHZhciBWYWwgPSByZXF1aXJlKCcuL3ZhbCcpO1xyXG5cdFx0dmFyIE5vZGUgPSB7XzogJ18nfTtcclxuXHRcdE5vZGUuc291bCA9IGZ1bmN0aW9uKG4sIG8peyByZXR1cm4gKG4gJiYgbi5fICYmIG4uX1tvIHx8IHNvdWxfXSkgfSAvLyBjb252ZW5pZW5jZSBmdW5jdGlvbiB0byBjaGVjayB0byBzZWUgaWYgdGhlcmUgaXMgYSBzb3VsIG9uIGEgbm9kZSBhbmQgcmV0dXJuIGl0LlxyXG5cdFx0Tm9kZS5zb3VsLmlmeSA9IGZ1bmN0aW9uKG4sIG8peyAvLyBwdXQgYSBzb3VsIG9uIGFuIG9iamVjdC5cclxuXHRcdFx0byA9ICh0eXBlb2YgbyA9PT0gJ3N0cmluZycpPyB7c291bDogb30gOiBvIHx8IHt9O1xyXG5cdFx0XHRuID0gbiB8fCB7fTsgLy8gbWFrZSBzdXJlIGl0IGV4aXN0cy5cclxuXHRcdFx0bi5fID0gbi5fIHx8IHt9OyAvLyBtYWtlIHN1cmUgbWV0YSBleGlzdHMuXHJcblx0XHRcdG4uX1tzb3VsX10gPSBvLnNvdWwgfHwgbi5fW3NvdWxfXSB8fCB0ZXh0X3JhbmRvbSgpOyAvLyBwdXQgdGhlIHNvdWwgb24gaXQuXHJcblx0XHRcdHJldHVybiBuO1xyXG5cdFx0fVxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHROb2RlLmlzID0gZnVuY3Rpb24obiwgY2IsIGFzKXsgdmFyIHM7IC8vIGNoZWNrcyB0byBzZWUgaWYgYW4gb2JqZWN0IGlzIGEgdmFsaWQgbm9kZS5cclxuXHRcdFx0XHRpZighb2JqX2lzKG4pKXsgcmV0dXJuIGZhbHNlIH0gLy8gbXVzdCBiZSBhbiBvYmplY3QuXHJcblx0XHRcdFx0aWYocyA9IE5vZGUuc291bChuKSl7IC8vIG11c3QgaGF2ZSBhIHNvdWwgb24gaXQuXHJcblx0XHRcdFx0XHRyZXR1cm4gIW9ial9tYXAobiwgbWFwLCB7YXM6YXMsY2I6Y2IsczpzLG46bn0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7IC8vIG5vcGUhIFRoaXMgd2FzIG5vdCBhIHZhbGlkIG5vZGUuXHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbWFwKHYsIGYpeyAvLyB3ZSBpbnZlcnQgdGhpcyBiZWNhdXNlIHRoZSB3YXkgd2UgY2hlY2sgZm9yIHRoaXMgaXMgdmlhIGEgbmVnYXRpb24uXHJcblx0XHRcdFx0aWYoZiA9PT0gTm9kZS5fKXsgcmV0dXJuIH0gLy8gc2tpcCBvdmVyIHRoZSBtZXRhZGF0YS5cclxuXHRcdFx0XHRpZighVmFsLmlzKHYpKXsgcmV0dXJuIHRydWUgfSAvLyBpdCBpcyB0cnVlIHRoYXQgdGhpcyBpcyBhbiBpbnZhbGlkIG5vZGUuXHJcblx0XHRcdFx0aWYodGhpcy5jYil7IHRoaXMuY2IuY2FsbCh0aGlzLmFzLCB2LCBmLCB0aGlzLm4sIHRoaXMucykgfSAvLyBvcHRpb25hbGx5IGNhbGxiYWNrIGVhY2ggZmllbGQvdmFsdWUuXHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdE5vZGUuaWZ5ID0gZnVuY3Rpb24ob2JqLCBvLCBhcyl7IC8vIHJldHVybnMgYSBub2RlIGZyb20gYSBzaGFsbG93IG9iamVjdC5cclxuXHRcdFx0XHRpZighbyl7IG8gPSB7fSB9XHJcblx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgbyA9PT0gJ3N0cmluZycpeyBvID0ge3NvdWw6IG99IH1cclxuXHRcdFx0XHRlbHNlIGlmKG8gaW5zdGFuY2VvZiBGdW5jdGlvbil7IG8gPSB7bWFwOiBvfSB9XHJcblx0XHRcdFx0aWYoby5tYXApeyBvLm5vZGUgPSBvLm1hcC5jYWxsKGFzLCBvYmosIHUsIG8ubm9kZSB8fCB7fSkgfVxyXG5cdFx0XHRcdGlmKG8ubm9kZSA9IE5vZGUuc291bC5pZnkoby5ub2RlIHx8IHt9LCBvKSl7XHJcblx0XHRcdFx0XHRvYmpfbWFwKG9iaiwgbWFwLCB7bzpvLGFzOmFzfSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBvLm5vZGU7IC8vIFRoaXMgd2lsbCBvbmx5IGJlIGEgdmFsaWQgbm9kZSBpZiB0aGUgb2JqZWN0IHdhc24ndCBhbHJlYWR5IGRlZXAhXHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbWFwKHYsIGYpeyB2YXIgbyA9IHRoaXMubywgdG1wLCB1OyAvLyBpdGVyYXRlIG92ZXIgZWFjaCBmaWVsZC92YWx1ZS5cclxuXHRcdFx0XHRpZihvLm1hcCl7XHJcblx0XHRcdFx0XHR0bXAgPSBvLm1hcC5jYWxsKHRoaXMuYXMsIHYsICcnK2YsIG8ubm9kZSk7XHJcblx0XHRcdFx0XHRpZih1ID09PSB0bXApe1xyXG5cdFx0XHRcdFx0XHRvYmpfZGVsKG8ubm9kZSwgZik7XHJcblx0XHRcdFx0XHR9IGVsc2VcclxuXHRcdFx0XHRcdGlmKG8ubm9kZSl7IG8ubm9kZVtmXSA9IHRtcCB9XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKFZhbC5pcyh2KSl7XHJcblx0XHRcdFx0XHRvLm5vZGVbZl0gPSB2O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdHZhciBvYmogPSBUeXBlLm9iaiwgb2JqX2lzID0gb2JqLmlzLCBvYmpfZGVsID0gb2JqLmRlbCwgb2JqX21hcCA9IG9iai5tYXA7XHJcblx0XHR2YXIgdGV4dCA9IFR5cGUudGV4dCwgdGV4dF9yYW5kb20gPSB0ZXh0LnJhbmRvbTtcclxuXHRcdHZhciBzb3VsXyA9IFZhbC5yZWwuXztcclxuXHRcdHZhciB1O1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBOb2RlO1xyXG5cdH0pKHJlcXVpcmUsICcuL25vZGUnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBUeXBlID0gcmVxdWlyZSgnLi90eXBlJyk7XHJcblx0XHR2YXIgTm9kZSA9IHJlcXVpcmUoJy4vbm9kZScpO1xyXG5cdFx0ZnVuY3Rpb24gU3RhdGUoKXtcclxuXHRcdFx0dmFyIHQ7XHJcblx0XHRcdGlmKHBlcmYpe1xyXG5cdFx0XHRcdHQgPSBzdGFydCArIHBlcmYubm93KCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dCA9IHRpbWUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihsYXN0IDwgdCl7XHJcblx0XHRcdFx0cmV0dXJuIE4gPSAwLCBsYXN0ID0gdCArIFN0YXRlLmRyaWZ0O1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBsYXN0ID0gdCArICgoTiArPSAxKSAvIEQpICsgU3RhdGUuZHJpZnQ7XHJcblx0XHR9XHJcblx0XHR2YXIgdGltZSA9IFR5cGUudGltZS5pcywgbGFzdCA9IC1JbmZpbml0eSwgTiA9IDAsIEQgPSAxMDAwOyAvLyBXQVJOSU5HISBJbiB0aGUgZnV0dXJlLCBvbiBtYWNoaW5lcyB0aGF0IGFyZSBEIHRpbWVzIGZhc3RlciB0aGFuIDIwMTZBRCBtYWNoaW5lcywgeW91IHdpbGwgd2FudCB0byBpbmNyZWFzZSBEIGJ5IGFub3RoZXIgc2V2ZXJhbCBvcmRlcnMgb2YgbWFnbml0dWRlIHNvIHRoZSBwcm9jZXNzaW5nIHNwZWVkIG5ldmVyIG91dCBwYWNlcyB0aGUgZGVjaW1hbCByZXNvbHV0aW9uIChpbmNyZWFzaW5nIGFuIGludGVnZXIgZWZmZWN0cyB0aGUgc3RhdGUgYWNjdXJhY3kpLlxyXG5cdFx0dmFyIHBlcmYgPSAodHlwZW9mIHBlcmZvcm1hbmNlICE9PSAndW5kZWZpbmVkJyk/IChwZXJmb3JtYW5jZS50aW1pbmcgJiYgcGVyZm9ybWFuY2UpIDogZmFsc2UsIHN0YXJ0ID0gKHBlcmYgJiYgcGVyZi50aW1pbmcgJiYgcGVyZi50aW1pbmcubmF2aWdhdGlvblN0YXJ0KSB8fCAocGVyZiA9IGZhbHNlKTtcclxuXHRcdFN0YXRlLl8gPSAnPic7XHJcblx0XHRTdGF0ZS5kcmlmdCA9IDA7XHJcblx0XHRTdGF0ZS5pZnkgPSBmdW5jdGlvbihuLCBmLCBzLCB2LCBzb3VsKXsgLy8gcHV0IGEgZmllbGQncyBzdGF0ZSBvbiBhIG5vZGUuXHJcblx0XHRcdGlmKCFuIHx8ICFuW05fXSl7IC8vIHJlamVjdCBpZiBpdCBpcyBub3Qgbm9kZS1saWtlLlxyXG5cdFx0XHRcdGlmKCFzb3VsKXsgLy8gdW5sZXNzIHRoZXkgcGFzc2VkIGEgc291bFxyXG5cdFx0XHRcdFx0cmV0dXJuOyBcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0biA9IE5vZGUuc291bC5pZnkobiwgc291bCk7IC8vIHRoZW4gbWFrZSBpdCBzbyFcclxuXHRcdFx0fSBcclxuXHRcdFx0dmFyIHRtcCA9IG9ial9hcyhuW05fXSwgU3RhdGUuXyk7IC8vIGdyYWIgdGhlIHN0YXRlcyBkYXRhLlxyXG5cdFx0XHRpZih1ICE9PSBmICYmIGYgIT09IE5fKXtcclxuXHRcdFx0XHRpZihudW1faXMocykpe1xyXG5cdFx0XHRcdFx0dG1wW2ZdID0gczsgLy8gYWRkIHRoZSB2YWxpZCBzdGF0ZS5cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYodSAhPT0gdil7IC8vIE5vdGU6IE5vdCBpdHMgam9iIHRvIGNoZWNrIGZvciB2YWxpZCB2YWx1ZXMhXHJcblx0XHRcdFx0XHRuW2ZdID0gdjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIG47XHJcblx0XHR9XHJcblx0XHRTdGF0ZS5pcyA9IGZ1bmN0aW9uKG4sIGYsIG8peyAvLyBjb252ZW5pZW5jZSBmdW5jdGlvbiB0byBnZXQgdGhlIHN0YXRlIG9uIGEgZmllbGQgb24gYSBub2RlIGFuZCByZXR1cm4gaXQuXHJcblx0XHRcdHZhciB0bXAgPSAoZiAmJiBuICYmIG5bTl9dICYmIG5bTl9dW1N0YXRlLl9dKSB8fCBvO1xyXG5cdFx0XHRpZighdG1wKXsgcmV0dXJuIH1cclxuXHRcdFx0cmV0dXJuIG51bV9pcyh0bXBbZl0pPyB0bXBbZl0gOiAtSW5maW5pdHk7XHJcblx0XHR9XHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFN0YXRlLm1hcCA9IGZ1bmN0aW9uKGNiLCBzLCBhcyl7IHZhciB1OyAvLyBmb3IgdXNlIHdpdGggTm9kZS5pZnlcclxuXHRcdFx0XHR2YXIgbyA9IG9ial9pcyhvID0gY2IgfHwgcyk/IG8gOiBudWxsO1xyXG5cdFx0XHRcdGNiID0gZm5faXMoY2IgPSBjYiB8fCBzKT8gY2IgOiBudWxsO1xyXG5cdFx0XHRcdGlmKG8gJiYgIWNiKXtcclxuXHRcdFx0XHRcdHMgPSBudW1faXMocyk/IHMgOiBTdGF0ZSgpO1xyXG5cdFx0XHRcdFx0b1tOX10gPSBvW05fXSB8fCB7fTtcclxuXHRcdFx0XHRcdG9ial9tYXAobywgbWFwLCB7bzpvLHM6c30pO1xyXG5cdFx0XHRcdFx0cmV0dXJuIG87XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGFzID0gYXMgfHwgb2JqX2lzKHMpPyBzIDogdTtcclxuXHRcdFx0XHRzID0gbnVtX2lzKHMpPyBzIDogU3RhdGUoKTtcclxuXHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24odiwgZiwgbywgb3B0KXtcclxuXHRcdFx0XHRcdGlmKCFjYil7XHJcblx0XHRcdFx0XHRcdG1hcC5jYWxsKHtvOiBvLCBzOiBzfSwgdixmKTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHY7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjYi5jYWxsKGFzIHx8IHRoaXMgfHwge30sIHYsIGYsIG8sIG9wdCk7XHJcblx0XHRcdFx0XHRpZihvYmpfaGFzKG8sZikgJiYgdSA9PT0gb1tmXSl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRtYXAuY2FsbCh7bzogbywgczogc30sIHYsZik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcCh2LGYpe1xyXG5cdFx0XHRcdGlmKE5fID09PSBmKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRTdGF0ZS5pZnkodGhpcy5vLCBmLCB0aGlzLnMpIDtcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdHZhciBvYmogPSBUeXBlLm9iaiwgb2JqX2FzID0gb2JqLmFzLCBvYmpfaGFzID0gb2JqLmhhcywgb2JqX2lzID0gb2JqLmlzLCBvYmpfbWFwID0gb2JqLm1hcDtcclxuXHRcdHZhciBudW0gPSBUeXBlLm51bSwgbnVtX2lzID0gbnVtLmlzO1xyXG5cdFx0dmFyIGZuID0gVHlwZS5mbiwgZm5faXMgPSBmbi5pcztcclxuXHRcdHZhciBOXyA9IE5vZGUuXywgdTtcclxuXHRcdG1vZHVsZS5leHBvcnRzID0gU3RhdGU7XHJcblx0fSkocmVxdWlyZSwgJy4vc3RhdGUnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBUeXBlID0gcmVxdWlyZSgnLi90eXBlJyk7XHJcblx0XHR2YXIgVmFsID0gcmVxdWlyZSgnLi92YWwnKTtcclxuXHRcdHZhciBOb2RlID0gcmVxdWlyZSgnLi9ub2RlJyk7XHJcblx0XHR2YXIgR3JhcGggPSB7fTtcclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0R3JhcGguaXMgPSBmdW5jdGlvbihnLCBjYiwgZm4sIGFzKXsgLy8gY2hlY2tzIHRvIHNlZSBpZiBhbiBvYmplY3QgaXMgYSB2YWxpZCBncmFwaC5cclxuXHRcdFx0XHRpZighZyB8fCAhb2JqX2lzKGcpIHx8IG9ial9lbXB0eShnKSl7IHJldHVybiBmYWxzZSB9IC8vIG11c3QgYmUgYW4gb2JqZWN0LlxyXG5cdFx0XHRcdHJldHVybiAhb2JqX21hcChnLCBtYXAsIHtjYjpjYixmbjpmbixhczphc30pOyAvLyBtYWtlcyBzdXJlIGl0IHdhc24ndCBhbiBlbXB0eSBvYmplY3QuXHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbWFwKG4sIHMpeyAvLyB3ZSBpbnZlcnQgdGhpcyBiZWNhdXNlIHRoZSB3YXkgd2UgY2hlY2sgZm9yIHRoaXMgaXMgdmlhIGEgbmVnYXRpb24uXHJcblx0XHRcdFx0aWYoIW4gfHwgcyAhPT0gTm9kZS5zb3VsKG4pIHx8ICFOb2RlLmlzKG4sIHRoaXMuZm4pKXsgcmV0dXJuIHRydWUgfSAvLyBpdCBpcyB0cnVlIHRoYXQgdGhpcyBpcyBhbiBpbnZhbGlkIGdyYXBoLlxyXG5cdFx0XHRcdGlmKCF0aGlzLmNiKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRuZi5uID0gbjsgbmYuYXMgPSB0aGlzLmFzOyAvLyBzZXF1ZW50aWFsIHJhY2UgY29uZGl0aW9ucyBhcmVuJ3QgcmFjZXMuXHJcblx0XHRcdFx0dGhpcy5jYi5jYWxsKG5mLmFzLCBuLCBzLCBuZik7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbmYoZm4peyAvLyBvcHRpb25hbCBjYWxsYmFjayBmb3IgZWFjaCBub2RlLlxyXG5cdFx0XHRcdGlmKGZuKXsgTm9kZS5pcyhuZi5uLCBmbiwgbmYuYXMpIH0gLy8gd2hlcmUgd2UgdGhlbiBoYXZlIGFuIG9wdGlvbmFsIGNhbGxiYWNrIGZvciBlYWNoIGZpZWxkL3ZhbHVlLlxyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRHcmFwaC5pZnkgPSBmdW5jdGlvbihvYmosIGVudiwgYXMpe1xyXG5cdFx0XHRcdHZhciBhdCA9IHtwYXRoOiBbXSwgb2JqOiBvYmp9O1xyXG5cdFx0XHRcdGlmKCFlbnYpe1xyXG5cdFx0XHRcdFx0ZW52ID0ge307XHJcblx0XHRcdFx0fSBlbHNlXHJcblx0XHRcdFx0aWYodHlwZW9mIGVudiA9PT0gJ3N0cmluZycpe1xyXG5cdFx0XHRcdFx0ZW52ID0ge3NvdWw6IGVudn07XHJcblx0XHRcdFx0fSBlbHNlXHJcblx0XHRcdFx0aWYoZW52IGluc3RhbmNlb2YgRnVuY3Rpb24pe1xyXG5cdFx0XHRcdFx0ZW52Lm1hcCA9IGVudjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoZW52LnNvdWwpe1xyXG5cdFx0XHRcdFx0YXQucmVsID0gVmFsLnJlbC5pZnkoZW52LnNvdWwpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbnYuZ3JhcGggPSBlbnYuZ3JhcGggfHwge307XHJcblx0XHRcdFx0ZW52LnNlZW4gPSBlbnYuc2VlbiB8fCBbXTtcclxuXHRcdFx0XHRlbnYuYXMgPSBlbnYuYXMgfHwgYXM7XHJcblx0XHRcdFx0bm9kZShlbnYsIGF0KTtcclxuXHRcdFx0XHRlbnYucm9vdCA9IGF0Lm5vZGU7XHJcblx0XHRcdFx0cmV0dXJuIGVudi5ncmFwaDtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBub2RlKGVudiwgYXQpeyB2YXIgdG1wO1xyXG5cdFx0XHRcdGlmKHRtcCA9IHNlZW4oZW52LCBhdCkpeyByZXR1cm4gdG1wIH1cclxuXHRcdFx0XHRhdC5lbnYgPSBlbnY7XHJcblx0XHRcdFx0YXQuc291bCA9IHNvdWw7XHJcblx0XHRcdFx0aWYoTm9kZS5pZnkoYXQub2JqLCBtYXAsIGF0KSl7XHJcblx0XHRcdFx0XHQvL2F0LnJlbCA9IGF0LnJlbCB8fCBWYWwucmVsLmlmeShOb2RlLnNvdWwoYXQubm9kZSkpO1xyXG5cdFx0XHRcdFx0ZW52LmdyYXBoW1ZhbC5yZWwuaXMoYXQucmVsKV0gPSBhdC5ub2RlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gYXQ7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbWFwKHYsZixuKXtcclxuXHRcdFx0XHR2YXIgYXQgPSB0aGlzLCBlbnYgPSBhdC5lbnYsIGlzLCB0bXA7XHJcblx0XHRcdFx0aWYoTm9kZS5fID09PSBmICYmIG9ial9oYXModixWYWwucmVsLl8pKXtcclxuXHRcdFx0XHRcdHJldHVybiBuLl87IC8vIFRPRE86IEJ1Zz9cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoIShpcyA9IHZhbGlkKHYsZixuLCBhdCxlbnYpKSl7IHJldHVybiB9XHJcblx0XHRcdFx0aWYoIWYpe1xyXG5cdFx0XHRcdFx0YXQubm9kZSA9IGF0Lm5vZGUgfHwgbiB8fCB7fTtcclxuXHRcdFx0XHRcdGlmKG9ial9oYXModiwgTm9kZS5fKSAmJiAhR3VuLmlzKHYpKXtcclxuXHRcdFx0XHRcdFx0YXQubm9kZS5fID0gb2JqX2NvcHkodi5fKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGF0Lm5vZGUgPSBOb2RlLnNvdWwuaWZ5KGF0Lm5vZGUsIFZhbC5yZWwuaXMoYXQucmVsKSk7XHJcblx0XHRcdFx0XHRhdC5yZWwgPSBhdC5yZWwgfHwgVmFsLnJlbC5pZnkoTm9kZS5zb3VsKGF0Lm5vZGUpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYodG1wID0gZW52Lm1hcCl7XHJcblx0XHRcdFx0XHR0bXAuY2FsbChlbnYuYXMgfHwge30sIHYsZixuLCBhdCk7XHJcblx0XHRcdFx0XHRpZihvYmpfaGFzKG4sZikpe1xyXG5cdFx0XHRcdFx0XHR2ID0gbltmXTtcclxuXHRcdFx0XHRcdFx0aWYodSA9PT0gdil7XHJcblx0XHRcdFx0XHRcdFx0b2JqX2RlbChuLCBmKTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYoIShpcyA9IHZhbGlkKHYsZixuLCBhdCxlbnYpKSl7IHJldHVybiB9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKCFmKXsgcmV0dXJuIGF0Lm5vZGUgfVxyXG5cdFx0XHRcdGlmKHRydWUgPT09IGlzKXtcclxuXHRcdFx0XHRcdHJldHVybiB2O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0bXAgPSBub2RlKGVudiwge29iajogdiwgcGF0aDogYXQucGF0aC5jb25jYXQoZil9KTtcclxuXHRcdFx0XHRpZighdG1wLm5vZGUpeyByZXR1cm4gfVxyXG5cdFx0XHRcdHJldHVybiB0bXAucmVsOyAvL3snIyc6IE5vZGUuc291bCh0bXAubm9kZSl9O1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIHNvdWwoaWQpeyB2YXIgYXQgPSB0aGlzO1xyXG5cdFx0XHRcdHZhciBwcmV2ID0gVmFsLnJlbC5pcyhhdC5yZWwpLCBncmFwaCA9IGF0LmVudi5ncmFwaDtcclxuXHRcdFx0XHRhdC5yZWwgPSBhdC5yZWwgfHwgVmFsLnJlbC5pZnkoaWQpO1xyXG5cdFx0XHRcdGF0LnJlbFtWYWwucmVsLl9dID0gaWQ7XHJcblx0XHRcdFx0aWYoYXQubm9kZSAmJiBhdC5ub2RlW05vZGUuX10pe1xyXG5cdFx0XHRcdFx0YXQubm9kZVtOb2RlLl9dW1ZhbC5yZWwuX10gPSBpZDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYob2JqX2hhcyhncmFwaCwgcHJldikpe1xyXG5cdFx0XHRcdFx0Z3JhcGhbaWRdID0gZ3JhcGhbcHJldl07XHJcblx0XHRcdFx0XHRvYmpfZGVsKGdyYXBoLCBwcmV2KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gdmFsaWQodixmLG4sIGF0LGVudil7IHZhciB0bXA7XHJcblx0XHRcdFx0aWYoVmFsLmlzKHYpKXsgcmV0dXJuIHRydWUgfVxyXG5cdFx0XHRcdGlmKG9ial9pcyh2KSl7IHJldHVybiAxIH1cclxuXHRcdFx0XHRpZih0bXAgPSBlbnYuaW52YWxpZCl7XHJcblx0XHRcdFx0XHR2ID0gdG1wLmNhbGwoZW52LmFzIHx8IHt9LCB2LGYsbik7XHJcblx0XHRcdFx0XHRyZXR1cm4gdmFsaWQodixmLG4sIGF0LGVudik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVudi5lcnIgPSBcIkludmFsaWQgdmFsdWUgYXQgJ1wiICsgYXQucGF0aC5jb25jYXQoZikuam9pbignLicpICsgXCInIVwiO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIHNlZW4oZW52LCBhdCl7XHJcblx0XHRcdFx0dmFyIGFyciA9IGVudi5zZWVuLCBpID0gYXJyLmxlbmd0aCwgaGFzO1xyXG5cdFx0XHRcdHdoaWxlKGktLSl7IGhhcyA9IGFycltpXTtcclxuXHRcdFx0XHRcdGlmKGF0Lm9iaiA9PT0gaGFzLm9iail7IHJldHVybiBoYXMgfVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRhcnIucHVzaChhdCk7XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblx0XHRHcmFwaC5ub2RlID0gZnVuY3Rpb24obm9kZSl7XHJcblx0XHRcdHZhciBzb3VsID0gTm9kZS5zb3VsKG5vZGUpO1xyXG5cdFx0XHRpZighc291bCl7IHJldHVybiB9XHJcblx0XHRcdHJldHVybiBvYmpfcHV0KHt9LCBzb3VsLCBub2RlKTtcclxuXHRcdH1cclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0R3JhcGgudG8gPSBmdW5jdGlvbihncmFwaCwgcm9vdCwgb3B0KXtcclxuXHRcdFx0XHRpZighZ3JhcGgpeyByZXR1cm4gfVxyXG5cdFx0XHRcdHZhciBvYmogPSB7fTtcclxuXHRcdFx0XHRvcHQgPSBvcHQgfHwge3NlZW46IHt9fTtcclxuXHRcdFx0XHRvYmpfbWFwKGdyYXBoW3Jvb3RdLCBtYXAsIHtvYmo6b2JqLCBncmFwaDogZ3JhcGgsIG9wdDogb3B0fSk7XHJcblx0XHRcdFx0cmV0dXJuIG9iajtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBtYXAodixmKXsgdmFyIHRtcCwgb2JqO1xyXG5cdFx0XHRcdGlmKE5vZGUuXyA9PT0gZil7XHJcblx0XHRcdFx0XHRpZihvYmpfZW1wdHkodiwgVmFsLnJlbC5fKSl7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHRoaXMub2JqW2ZdID0gb2JqX2NvcHkodik7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKCEodG1wID0gVmFsLnJlbC5pcyh2KSkpe1xyXG5cdFx0XHRcdFx0dGhpcy5vYmpbZl0gPSB2O1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihvYmogPSB0aGlzLm9wdC5zZWVuW3RtcF0pe1xyXG5cdFx0XHRcdFx0dGhpcy5vYmpbZl0gPSBvYmo7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMub2JqW2ZdID0gdGhpcy5vcHQuc2Vlblt0bXBdID0gR3JhcGgudG8odGhpcy5ncmFwaCwgdG1wLCB0aGlzLm9wdCk7XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblx0XHR2YXIgZm5faXMgPSBUeXBlLmZuLmlzO1xyXG5cdFx0dmFyIG9iaiA9IFR5cGUub2JqLCBvYmpfaXMgPSBvYmouaXMsIG9ial9kZWwgPSBvYmouZGVsLCBvYmpfaGFzID0gb2JqLmhhcywgb2JqX2VtcHR5ID0gb2JqLmVtcHR5LCBvYmpfcHV0ID0gb2JqLnB1dCwgb2JqX21hcCA9IG9iai5tYXAsIG9ial9jb3B5ID0gb2JqLmNvcHk7XHJcblx0XHR2YXIgdTtcclxuXHRcdG1vZHVsZS5leHBvcnRzID0gR3JhcGg7XHJcblx0fSkocmVxdWlyZSwgJy4vZ3JhcGgnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBUeXBlID0gcmVxdWlyZSgnLi90eXBlJyk7XHJcblx0XHRmdW5jdGlvbiBEdXAoKXtcclxuXHRcdFx0dGhpcy5jYWNoZSA9IHt9O1xyXG5cdFx0fVxyXG5cdFx0RHVwLnByb3RvdHlwZS50cmFjayA9IGZ1bmN0aW9uKGlkKXtcclxuXHRcdFx0dGhpcy5jYWNoZVtpZF0gPSBUeXBlLnRpbWUuaXMoKTtcclxuXHRcdFx0aWYgKCF0aGlzLnRvKSB7XHJcblx0XHRcdFx0dGhpcy5nYygpOyAvLyBFbmdhZ2UgR0MuXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGlkO1xyXG5cdFx0fTtcclxuXHRcdER1cC5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbihpZCl7XHJcblx0XHRcdC8vIEhhdmUgd2Ugc2VlbiB0aGlzIElEIHJlY2VudGx5P1xyXG5cdFx0XHRyZXR1cm4gVHlwZS5vYmouaGFzKHRoaXMuY2FjaGUsIGlkKT8gdGhpcy50cmFjayhpZCkgOiBmYWxzZTsgLy8gSW1wb3J0YW50LCBidW1wIHRoZSBJRCdzIGxpdmVsaW5lc3MgaWYgaXQgaGFzIGFscmVhZHkgYmVlbiBzZWVuIGJlZm9yZSAtIHRoaXMgaXMgY3JpdGljYWwgdG8gc3RvcHBpbmcgYnJvYWRjYXN0IHN0b3Jtcy5cclxuXHRcdH1cclxuXHRcdER1cC5wcm90b3R5cGUuZ2MgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgZGUgPSB0aGlzLCBub3cgPSBUeXBlLnRpbWUuaXMoKSwgb2xkZXN0ID0gbm93LCBtYXhBZ2UgPSA1ICogNjAgKiAxMDAwO1xyXG5cdFx0XHQvLyBUT0RPOiBHdW4uc2NoZWR1bGVyIGFscmVhZHkgZG9lcyB0aGlzPyBSZXVzZSB0aGF0LlxyXG5cdFx0XHRUeXBlLm9iai5tYXAoZGUuY2FjaGUsIGZ1bmN0aW9uKHRpbWUsIGlkKXtcclxuXHRcdFx0XHRvbGRlc3QgPSBNYXRoLm1pbihub3csIHRpbWUpO1xyXG5cdFx0XHRcdGlmICgobm93IC0gdGltZSkgPCBtYXhBZ2UpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFR5cGUub2JqLmRlbChkZS5jYWNoZSwgaWQpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0dmFyIGRvbmUgPSBUeXBlLm9iai5lbXB0eShkZS5jYWNoZSk7XHJcblx0XHRcdGlmKGRvbmUpe1xyXG5cdFx0XHRcdGRlLnRvID0gbnVsbDsgLy8gRGlzZW5nYWdlIEdDLlxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgZWxhcHNlZCA9IG5vdyAtIG9sZGVzdDsgLy8gSnVzdCBob3cgb2xkP1xyXG5cdFx0XHR2YXIgbmV4dEdDID0gbWF4QWdlIC0gZWxhcHNlZDsgLy8gSG93IGxvbmcgYmVmb3JlIGl0J3MgdG9vIG9sZD9cclxuXHRcdFx0ZGUudG8gPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IGRlLmdjKCkgfSwgbmV4dEdDKTsgLy8gU2NoZWR1bGUgdGhlIG5leHQgR0MgZXZlbnQuXHJcblx0XHR9XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IER1cDtcclxuXHR9KShyZXF1aXJlLCAnLi9kdXAnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHJcblx0XHRmdW5jdGlvbiBHdW4obyl7XHJcblx0XHRcdGlmKG8gaW5zdGFuY2VvZiBHdW4peyByZXR1cm4gKHRoaXMuXyA9IHtndW46IHRoaXN9KS5ndW4gfVxyXG5cdFx0XHRpZighKHRoaXMgaW5zdGFuY2VvZiBHdW4pKXsgcmV0dXJuIG5ldyBHdW4obykgfVxyXG5cdFx0XHRyZXR1cm4gR3VuLmNyZWF0ZSh0aGlzLl8gPSB7Z3VuOiB0aGlzLCBvcHQ6IG99KTtcclxuXHRcdH1cclxuXHJcblx0XHRHdW4uaXMgPSBmdW5jdGlvbihndW4peyByZXR1cm4gKGd1biBpbnN0YW5jZW9mIEd1bikgfVxyXG5cclxuXHRcdEd1bi52ZXJzaW9uID0gMC42O1xyXG5cclxuXHRcdEd1bi5jaGFpbiA9IEd1bi5wcm90b3R5cGU7XHJcblx0XHRHdW4uY2hhaW4udG9KU09OID0gZnVuY3Rpb24oKXt9O1xyXG5cclxuXHRcdHZhciBUeXBlID0gcmVxdWlyZSgnLi90eXBlJyk7XHJcblx0XHRUeXBlLm9iai50byhUeXBlLCBHdW4pO1xyXG5cdFx0R3VuLkhBTSA9IHJlcXVpcmUoJy4vSEFNJyk7XHJcblx0XHRHdW4udmFsID0gcmVxdWlyZSgnLi92YWwnKTtcclxuXHRcdEd1bi5ub2RlID0gcmVxdWlyZSgnLi9ub2RlJyk7XHJcblx0XHRHdW4uc3RhdGUgPSByZXF1aXJlKCcuL3N0YXRlJyk7XHJcblx0XHRHdW4uZ3JhcGggPSByZXF1aXJlKCcuL2dyYXBoJyk7XHJcblx0XHRHdW4uZHVwID0gcmVxdWlyZSgnLi9kdXAnKTtcclxuXHRcdEd1bi5vbiA9IHJlcXVpcmUoJy4vb25pZnknKSgpO1xyXG5cdFx0XHJcblx0XHRHdW4uXyA9IHsgLy8gc29tZSByZXNlcnZlZCBrZXkgd29yZHMsIHRoZXNlIGFyZSBub3QgdGhlIG9ubHkgb25lcy5cclxuXHRcdFx0bm9kZTogR3VuLm5vZGUuXyAvLyBhbGwgbWV0YWRhdGEgb2YgYSBub2RlIGlzIHN0b3JlZCBpbiB0aGUgbWV0YSBwcm9wZXJ0eSBvbiB0aGUgbm9kZS5cclxuXHRcdFx0LHNvdWw6IEd1bi52YWwucmVsLl8gLy8gYSBzb3VsIGlzIGEgVVVJRCBvZiBhIG5vZGUgYnV0IGl0IGFsd2F5cyBwb2ludHMgdG8gdGhlIFwibGF0ZXN0XCIgZGF0YSBrbm93bi5cclxuXHRcdFx0LHN0YXRlOiBHdW4uc3RhdGUuXyAvLyBvdGhlciB0aGFuIHRoZSBzb3VsLCB3ZSBzdG9yZSBIQU0gbWV0YWRhdGEuXHJcblx0XHRcdCxmaWVsZDogJy4nIC8vIGEgZmllbGQgaXMgYSBwcm9wZXJ0eSBvbiBhIG5vZGUgd2hpY2ggcG9pbnRzIHRvIGEgdmFsdWUuXHJcblx0XHRcdCx2YWx1ZTogJz0nIC8vIHRoZSBwcmltaXRpdmUgdmFsdWUuXHJcblx0XHR9XHJcblxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRHdW4uY3JlYXRlID0gZnVuY3Rpb24oYXQpe1xyXG5cdFx0XHRcdGF0Lm9uID0gYXQub24gfHwgR3VuLm9uO1xyXG5cdFx0XHRcdGF0LnJvb3QgPSBhdC5yb290IHx8IGF0Lmd1bjtcclxuXHRcdFx0XHRhdC5ncmFwaCA9IGF0LmdyYXBoIHx8IHt9O1xyXG5cdFx0XHRcdGF0LmR1cCA9IGF0LmR1cCB8fCBuZXcgR3VuLmR1cDtcclxuXHRcdFx0XHRhdC5hc2sgPSBHdW4ub24uYXNrO1xyXG5cdFx0XHRcdGF0LmFjayA9IEd1bi5vbi5hY2s7XHJcblx0XHRcdFx0dmFyIGd1biA9IGF0Lmd1bi5vcHQoYXQub3B0KTtcclxuXHRcdFx0XHRpZighYXQub25jZSl7XHJcblx0XHRcdFx0XHRhdC5vbignaW4nLCByb290LCBhdCk7XHJcblx0XHRcdFx0XHRhdC5vbignb3V0Jywgcm9vdCwgYXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRhdC5vbmNlID0gMTtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIHJvb3QoYXQpe1xyXG5cdFx0XHRcdC8vY29uc29sZS5sb2coXCJhZGQgdG8ubmV4dChhdClcIik7IC8vIFRPRE86IEJVRyEhIVxyXG5cdFx0XHRcdHZhciBldiA9IHRoaXMsIGNhdCA9IGV2LmFzLCBjb2F0O1xyXG5cdFx0XHRcdGlmKCFhdC5ndW4peyBhdC5ndW4gPSBjYXQuZ3VuIH1cclxuXHRcdFx0XHRpZighYXRbJyMnXSAmJiBhdFsnQCddKXtcclxuXHRcdFx0XHRcdGF0WycjJ10gPSBHdW4udGV4dC5yYW5kb20oKTsgLy8gVE9ETzogVXNlIHdoYXQgaXMgdXNlZCBvdGhlciBwbGFjZXMgaW5zdGVhZC5cclxuXHRcdFx0XHRcdC8vIFRPRE86IEJVRyEgRm9yIG11bHRpLWluc3RhbmNlcywgdGhlIFwiYWNrXCIgc3lzdGVtIGlzIGdsb2JhbGx5IHNoYXJlZCwgYnV0IGl0IHNob3VsZG4ndCBiZS4gXHJcblx0XHRcdFx0XHRpZihjYXQuYWNrKGF0WydAJ10sIGF0KSl7IHJldHVybiB9IC8vIFRPRE86IENvbnNpZGVyIG5vdCByZXR1cm5pbmcgaGVyZSwgbWF5YmUsIHdoZXJlIHRoaXMgd291bGQgbGV0IHRoZSBcImhhbmRzaGFrZVwiIG9uIHN5bmMgb2NjdXIgZm9yIEhvbHkgR3JhaWw/XHJcblx0XHRcdFx0XHRjYXQuZHVwLnRyYWNrKGF0WycjJ10pO1xyXG5cdFx0XHRcdFx0R3VuLm9uKCdvdXQnLCBvYmpfdG8oYXQsIHtndW46IGNhdC5ndW59KSk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGF0WycjJ10gJiYgY2F0LmR1cC5jaGVjayhhdFsnIyddKSl7IHJldHVybiB9XHJcblx0XHRcdFx0Y2F0LmR1cC50cmFjayhhdFsnIyddKTtcclxuXHRcdFx0XHRpZihjYXQuYWNrKGF0WydAJ10sIGF0KSl7IHJldHVybiB9XHJcblx0XHRcdFx0Ly9jYXQuYWNrKGF0WydAJ10sIGF0KTtcclxuXHRcdFx0XHRjb2F0ID0gb2JqX3RvKGF0LCB7Z3VuOiBjYXQuZ3VufSk7XHJcblx0XHRcdFx0aWYoYXQuZ2V0KXtcclxuXHRcdFx0XHRcdGlmKCFnZXQoYXQsIGNhdCkpe1xyXG5cdFx0XHRcdFx0XHRHdW4ub24oJ2dldCcsIGNvYXQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihhdC5wdXQpe1xyXG5cdFx0XHRcdFx0R3VuLkhBTS5zeW50aChhdCwgZXYsIGNhdC5ndW4pOyAvLyBUT0RPOiBDbGVhbiB1cCwganVzdCBtYWtlIGl0IHBhcnQgb2Ygb24oJ3B1dCcpIVxyXG5cdFx0XHRcdFx0R3VuLm9uKCdwdXQnLCBjb2F0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0R3VuLm9uKCdvdXQnLCBjb2F0KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBnZXQoYXQsIGNhdCl7XHJcblx0XHRcdFx0dmFyIHNvdWwgPSBhdC5nZXRbX3NvdWxdLCBub2RlID0gY2F0LmdyYXBoW3NvdWxdLCBmaWVsZCA9IGF0LmdldFtfZmllbGRdLCB0bXA7XHJcblx0XHRcdFx0dmFyIG5leHQgPSBjYXQubmV4dCB8fCAoY2F0Lm5leHQgPSB7fSksIGFzID0gLyooYXQuZ3VufHxlbXB0eSkuXyB8fCovIChuZXh0W3NvdWxdIHx8IChuZXh0W3NvdWxdID0gY2F0Lmd1bi5nZXQoc291bCkpKS5fO1xyXG5cdFx0XHRcdGlmKCFub2RlKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRpZihmaWVsZCl7XHJcblx0XHRcdFx0XHRpZighb2JqX2hhcyhub2RlLCBmaWVsZCkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0dG1wID0gR3VuLm9iai5wdXQoR3VuLm5vZGUuc291bC5pZnkoe30sIHNvdWwpLCBmaWVsZCwgbm9kZVtmaWVsZF0pO1xyXG5cdFx0XHRcdFx0bm9kZSA9IEd1bi5zdGF0ZS5pZnkodG1wLCBmaWVsZCwgR3VuLnN0YXRlLmlzKG5vZGUsIGZpZWxkKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vaWYoYXQuZ3VuID09PSBjYXQuZ3VuKXtcclxuXHRcdFx0XHRcdG5vZGUgPSBHdW4uZ3JhcGgubm9kZShub2RlKTsgLy8gVE9ETzogQlVHISBDbG9uZSBub2RlP1xyXG5cdFx0XHRcdC8vfSBlbHNlIHtcclxuXHRcdFx0XHQvL1x0Y2F0ID0gKGF0Lmd1bi5fKTtcclxuXHRcdFx0XHQvL31cclxuXHRcdFx0XHR0bXAgPSBhcy5hY2s7XHJcblx0XHRcdFx0Y2F0Lm9uKCdpbicsIHtcclxuXHRcdFx0XHRcdCdAJzogYXRbJyMnXSxcclxuXHRcdFx0XHRcdGhvdzogJ21lbScsXHJcblx0XHRcdFx0XHRwdXQ6IG5vZGUsXHJcblx0XHRcdFx0XHRndW46IGFzLmd1blxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdGlmKDAgPCB0bXApe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0XHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdEd1bi5vbi5hc2sgPSBmdW5jdGlvbihjYiwgYXMpe1xyXG5cdFx0XHRcdGlmKCF0aGlzLm9uKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgaWQgPSBHdW4udGV4dC5yYW5kb20oKTtcclxuXHRcdFx0XHRpZihjYil7IHRoaXMub24oaWQsIGNiLCBhcykgfVxyXG5cdFx0XHRcdHJldHVybiBpZDtcclxuXHRcdFx0fVxyXG5cdFx0XHRHdW4ub24uYWNrID0gZnVuY3Rpb24oYXQsIHJlcGx5KXtcclxuXHRcdFx0XHRpZighYXQgfHwgIXJlcGx5IHx8ICF0aGlzLm9uKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgaWQgPSBhdFsnIyddIHx8IGF0O1xyXG5cdFx0XHRcdGlmKCF0aGlzLnRhZyB8fCAhdGhpcy50YWdbaWRdKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR0aGlzLm9uKGlkLCByZXBseSk7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRHdW4uY2hhaW4ub3B0ID0gZnVuY3Rpb24ob3B0KXtcclxuXHRcdFx0XHRvcHQgPSBvcHQgfHwge307XHJcblx0XHRcdFx0dmFyIGd1biA9IHRoaXMsIGF0ID0gZ3VuLl8sIHRtcCA9IG9wdC5wZWVycyB8fCBvcHQ7XHJcblx0XHRcdFx0aWYoIW9ial9pcyhvcHQpKXsgb3B0ID0ge30gfVxyXG5cdFx0XHRcdGlmKCFvYmpfaXMoYXQub3B0KSl7IGF0Lm9wdCA9IG9wdCB9XHJcblx0XHRcdFx0aWYodGV4dF9pcyh0bXApKXsgdG1wID0gW3RtcF0gfVxyXG5cdFx0XHRcdGlmKGxpc3RfaXModG1wKSl7XHJcblx0XHRcdFx0XHR0bXAgPSBvYmpfbWFwKHRtcCwgZnVuY3Rpb24odXJsLCBpLCBtYXApe1xyXG5cdFx0XHRcdFx0XHRtYXAodXJsLCB7dXJsOiB1cmx9KTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0aWYoIW9ial9pcyhhdC5vcHQucGVlcnMpKXsgYXQub3B0LnBlZXJzID0ge319XHJcblx0XHRcdFx0XHRhdC5vcHQucGVlcnMgPSBvYmpfdG8odG1wLCBhdC5vcHQucGVlcnMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRhdC5vcHQud3NjID0gYXQub3B0LndzYyB8fCB7cHJvdG9jb2xzOm51bGx9IFxyXG5cdFx0XHRcdGF0Lm9wdC5wZWVycyA9IGF0Lm9wdC5wZWVycyB8fCB7fTtcclxuXHRcdFx0XHRvYmpfdG8ob3B0LCBhdC5vcHQpOyAvLyBjb3BpZXMgb3B0aW9ucyBvbiB0byBgYXQub3B0YCBvbmx5IGlmIG5vdCBhbHJlYWR5IHRha2VuLlxyXG5cdFx0XHRcdEd1bi5vbignb3B0JywgYXQpO1xyXG5cdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblxyXG5cdFx0dmFyIHRleHRfaXMgPSBHdW4udGV4dC5pcztcclxuXHRcdHZhciBsaXN0X2lzID0gR3VuLmxpc3QuaXM7XHJcblx0XHR2YXIgb2JqID0gR3VuLm9iaiwgb2JqX2lzID0gb2JqLmlzLCBvYmpfaGFzID0gb2JqLmhhcywgb2JqX3RvID0gb2JqLnRvLCBvYmpfbWFwID0gb2JqLm1hcDtcclxuXHRcdHZhciBfc291bCA9IEd1bi5fLnNvdWwsIF9maWVsZCA9IEd1bi5fLmZpZWxkO1xyXG5cdFx0Ly92YXIgdTtcclxuXHJcblx0XHRjb25zb2xlLmRlYnVnID0gZnVuY3Rpb24oaSwgcyl7IHJldHVybiAoY29uc29sZS5kZWJ1Zy5pICYmIGkgPT09IGNvbnNvbGUuZGVidWcuaSAmJiBjb25zb2xlLmRlYnVnLmkrKykgJiYgKGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cykgfHwgcykgfTtcclxuXHJcblx0XHRHdW4ubG9nID0gZnVuY3Rpb24oKXsgcmV0dXJuICghR3VuLmxvZy5vZmYgJiYgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKSksIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5qb2luKCcgJykgfVxyXG5cdFx0R3VuLmxvZy5vbmNlID0gZnVuY3Rpb24odyxzLG8peyByZXR1cm4gKG8gPSBHdW4ubG9nLm9uY2UpW3ddID0gb1t3XSB8fCAwLCBvW3ddKysgfHwgR3VuLmxvZyhzKSB9XHJcblxyXG5cdFx0LyogUGxlYXNlIGRvIG5vdCByZW1vdmUgdGhlc2UgbWVzc2FnZXMgdW5sZXNzIHlvdSBhcmUgcGF5aW5nIGZvciBhIG1vbnRobHkgc3BvbnNvcnNoaXAsIHRoYW5rcyEgKi9cclxuXHRcdEd1bi5sb2cub25jZShcIndlbGNvbWVcIiwgXCJIZWxsbyB3b25kZXJmdWwgcGVyc29uISA6KSBUaGFua3MgZm9yIHVzaW5nIEdVTiwgZmVlbCBmcmVlIHRvIGFzayBmb3IgaGVscCBvbiBodHRwczovL2dpdHRlci5pbS9hbWFyay9ndW4gYW5kIGFzayBTdGFja092ZXJmbG93IHF1ZXN0aW9ucyB0YWdnZWQgd2l0aCAnZ3VuJyFcIik7XHJcblx0XHQvKiBQbGVhc2UgZG8gbm90IHJlbW92ZSB0aGVzZSBtZXNzYWdlcyB1bmxlc3MgeW91IGFyZSBwYXlpbmcgZm9yIGEgbW9udGhseSBzcG9uc29yc2hpcCwgdGhhbmtzISAqL1xyXG5cdFx0XHJcblx0XHRpZih0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKXsgd2luZG93Lkd1biA9IEd1biB9XHJcblx0XHRpZih0eXBlb2YgY29tbW9uICE9PSBcInVuZGVmaW5lZFwiKXsgY29tbW9uLmV4cG9ydHMgPSBHdW4gfVxyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBHdW47XHJcblx0fSkocmVxdWlyZSwgJy4vcm9vdCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0cmV0dXJuO1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vcm9vdCcpO1xyXG5cdFx0dmFyIG9udG8gPSByZXF1aXJlKCcuL29udG8nKTtcclxuXHRcdGZ1bmN0aW9uIENoYWluKGJhY2spe1xyXG5cdFx0XHR2YXIgYXQgPSB0aGlzLl8gPSB7YmFjazogYmFjaywgb246IG9udG8sICQ6IHRoaXMsIG5leHQ6IHt9fTtcclxuXHRcdFx0YXQucm9vdCA9IGJhY2s/IGJhY2sucm9vdCA6IGF0O1xyXG5cdFx0XHRhdC5vbignaW4nLCBpbnB1dCwgYXQpO1xyXG5cdFx0XHRhdC5vbignb3V0Jywgb3V0cHV0LCBhdCk7XHJcblx0XHR9XHJcblx0XHR2YXIgY2hhaW4gPSBDaGFpbi5wcm90b3R5cGU7XHJcblx0XHRjaGFpbi5iYWNrID0gZnVuY3Rpb24oYXJnKXsgdmFyIHRtcDtcclxuXHRcdFx0aWYodG1wID0gdGhpcy5fLmJhY2spe1xyXG5cdFx0XHRcdHJldHVybiB0bXAuJDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Y2hhaW4ubmV4dCA9IGZ1bmN0aW9uKGFyZyl7XHJcblx0XHRcdHZhciBhdCA9IHRoaXMuXywgY2F0O1xyXG5cdFx0XHRpZihjYXQgPSBhdC5uZXh0W2FyZ10pe1xyXG5cdFx0XHRcdHJldHVybiBjYXQuJDtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYXQgPSAobmV3IENoYWluKGF0KS5fKTtcclxuXHRcdFx0YXQubmV4dFthcmddID0gY2F0O1xyXG5cdFx0XHRjYXQua2V5ID0gYXJnO1xyXG5cdFx0XHRyZXR1cm4gY2F0LiQ7XHJcblx0XHR9XHJcblx0XHRjaGFpbi5nZXQgPSBmdW5jdGlvbihhcmcpe1xyXG5cdFx0XHRpZih0eXBlb2YgYXJnID09ICdzdHJpbmcnKXtcclxuXHRcdFx0XHR2YXIgYXQgPSB0aGlzLl8sIGNhdDtcclxuXHRcdFx0XHRpZihjYXQgPSBhdC5uZXh0W2FyZ10pe1xyXG5cdFx0XHRcdFx0cmV0dXJuIGNhdC4kO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXQgPSAodGhpcy5uZXh0KGFyZykuXyk7XHJcblx0XHRcdFx0aWYoYXQuZ2V0IHx8IGF0ID09PSBhdC5yb290KXtcclxuXHRcdFx0XHRcdGNhdC5nZXQgPSBhcmc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBjYXQuJDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR2YXIgYXQgPSB0aGlzLl87XHJcblx0XHRcdFx0dmFyIG91dCA9IHsnIyc6IEd1bi50ZXh0LnJhbmRvbSgpLCBnZXQ6IHt9LCBjYXA6IDF9O1xyXG5cdFx0XHRcdHZhciB0byA9IGF0LnJvb3Qub24ob3V0WycjJ10sIGdldCwge25leHQ6IGFyZ30pXHJcblx0XHRcdFx0YXQub24oJ2luJywgZ2V0LCB0byk7XHJcblx0XHRcdFx0YXQub24oJ291dCcsIG91dCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBnZXQoZW52KXtcclxuXHRcdFx0dmFyIGFzID0gdGhpcy5hcztcclxuXHRcdFx0aWYoYXMubmV4dCl7XHJcblx0XHRcdFx0YXMubmV4dChlbnYsIHRoaXMpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRjaGFpbi5tYXAgPSBmdW5jdGlvbihjYil7XHJcblx0XHRcdHZhciBhdCA9IHRoaXMuXztcclxuXHRcdFx0dmFyIGNoYWluID0gbmV3IENoYWluKGF0KTtcclxuXHRcdFx0dmFyIGNhdCA9IGNoYWluLl87XHJcblx0XHRcdHZhciB1O1xyXG5cdFx0XHRhdC5vbignaW4nLCBmdW5jdGlvbihlbnYpeyB2YXIgdG1wO1xyXG5cdFx0XHRcdGlmKCFlbnYpeyByZXR1cm4gfVxyXG5cdFx0XHRcdHZhciBjYXQgPSB0aGlzLmFzO1xyXG5cdFx0XHRcdHZhciB0byA9IHRoaXMudG87XHJcblx0XHRcdFx0aWYodG1wID0gZW52LnB1dCl7XHJcblx0XHRcdFx0XHR0by5uZXh0KGVudik7XHJcblx0XHRcdFx0XHRHdW4ub2JqLm1hcCh0bXAsIGZ1bmN0aW9uKGRhdGEsIGtleSl7XHJcblx0XHRcdFx0XHRcdGlmKCdfJyA9PSBrZXkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0XHRpZihjYil7XHJcblx0XHRcdFx0XHRcdFx0ZGF0YSA9IGNiKGRhdGEsIGtleSk7XHJcblx0XHRcdFx0XHRcdFx0aWYodSA9PT0gZGF0YSl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0Y2F0Lm9uKCdpbicsIEd1bi5vYmoudG8oZW52LCB7cHV0OiBkYXRhfSkpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCBjYXQpO1xyXG5cdFx0XHRyZXR1cm4gY2hhaW47XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBpbnB1dChlbnYpeyB2YXIgdG1wO1xyXG5cdFx0XHRpZighZW52KXsgcmV0dXJuIH1cclxuXHRcdFx0dmFyIGNhdCA9IHRoaXMuYXM7XHJcblx0XHRcdHZhciB0byA9IHRoaXMudG87XHJcblx0XHRcdGlmKHRtcCA9IGVudi5wdXQpe1xyXG5cdFx0XHRcdGlmKHRtcCAmJiB0bXBbJyMnXSAmJiAodG1wID0gR3VuLnZhbC5yZWwuaXModG1wKSkpe1xyXG5cdFx0XHRcdFx0Ly9pbnB1dC5jYWxsKHRoaXMsIEd1bi5vYmoudG8oZW52LCB7cHV0OiBjYXQucm9vdC5wdXRbdG1wXX0pKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2F0LnB1dCA9IHRtcDtcclxuXHRcdFx0XHR0by5uZXh0KGVudik7XHJcblx0XHRcdFx0dmFyIG5leHQgPSBjYXQubmV4dDtcclxuXHRcdFx0XHRHdW4ub2JqLm1hcCh0bXAsIGZ1bmN0aW9uKGRhdGEsIGtleSl7XHJcblx0XHRcdFx0XHRpZighKGtleSA9IG5leHRba2V5XSkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0a2V5Lm9uKCdpbicsIEd1bi5vYmoudG8oZW52LCB7cHV0OiBkYXRhfSkpXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIG91dHB1dChlbnYpeyB2YXIgdG1wO1xyXG5cdFx0XHR2YXIgdTtcclxuXHRcdFx0aWYoIWVudil7IHJldHVybiB9XHJcblx0XHRcdHZhciBjYXQgPSB0aGlzLmFzO1xyXG5cdFx0XHR2YXIgdG8gPSB0aGlzO1xyXG5cdFx0XHRpZighY2F0LmJhY2spe1xyXG5cdFx0XHRcdGVudi50ZXN0ID0gdHJ1ZTtcclxuXHRcdFx0XHRlbnYuZ3VuID0gY2F0LnJvb3QuJDtcclxuXHRcdFx0XHRHdW4ub24oJ291dCcsIGVudik7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHRtcCA9IGVudi5nZXQpe1xyXG5cdFx0XHRcdGlmKGNhdC5nZXQpe1xyXG5cdFx0XHRcdFx0ZW52ID0gR3VuLm9iai50byhlbnYsIHtnZXQ6IHsnIyc6IGNhdC5nZXQsICcuJzogdG1wfX0pO1xyXG5cdFx0XHRcdH0gZWxzZVxyXG5cdFx0XHRcdGlmKGNhdC5rZXkpe1xyXG5cdFx0XHRcdFx0ZW52ID0gR3VuLm9iai50byhlbnYsIHtnZXQ6IEd1bi5vYmoucHV0KHt9LCBjYXQua2V5LCB0bXApfSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGVudiA9IEd1bi5vYmoudG8oZW52LCB7Z2V0OiB7JyonOiB0bXB9fSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Y2F0LmJhY2sub24oJ291dCcsIGVudik7XHJcblx0XHR9XHJcblx0XHRjaGFpbi52YWwgPSBmdW5jdGlvbihjYiwgb3B0KXtcclxuXHRcdFx0dmFyIGF0ID0gdGhpcy5fO1xyXG5cdFx0XHRpZihjYil7XHJcblx0XHRcdFx0aWYob3B0KXtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYoYXQudmFsKXtcclxuXHRcdFx0XHRcdFx0Y2IoYXQucHV0LCBhdC5nZXQsIGF0KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5nZXQoZnVuY3Rpb24oZW52LCBldil7XHJcblx0XHRcdFx0XHRjYihlbnYucHV0LCBlbnYuZ2V0LCBlbnYpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cclxuXHJcblxyXG5cdFx0dmFyIGdyYXBoID0ge1xyXG5cdFx0XHRcdGFwcDoge186eycjJzonYXBwJ30sXHJcblx0XHRcdFx0XHRmb286IHtfOnsnIyc6J2Zvbyd9LFxyXG5cdFx0XHRcdFx0XHRiYXI6IHsnIyc6ICdhc2RmJ30sXHJcblx0XHRcdFx0XHRcdHJhYjogeycjJzogJ2Zkc2EnfVxyXG5cdFx0XHRcdFx0fS8qLFxyXG5cdFx0XHRcdFx0b29mOiB7Xzp7JyMnOidvb2YnfSxcclxuXHRcdFx0XHRcdFx0YmFyOiB7YmF0OiBcInJlYWxseVwifSxcclxuXHRcdFx0XHRcdFx0cmFiOiB7YmF0OiBcIm5pY2UhXCJ9XHJcblx0XHRcdFx0XHR9Ki9cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGFzZGY6IHtfOnsnIyc6ICdhc2RmJ30sIGJhejogXCJoZWxsbyB3b3JsZCFcIn0sXHJcblx0XHRcdFx0ZmRzYToge186eycjJzogJ2Zkc2EnfSwgYmF6OiBcIndvcmxkIGhlbGxvIVwifVxyXG5cdFx0XHR9XHJcblx0XHRHdW4ub24oJ291dCcsIGZ1bmN0aW9uKGVudil7XHJcblx0XHRcdGlmKCFlbnYudGVzdCl7IHJldHVybiB9XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcInJlcGx5XCIsIGVudi5nZXQpO1xyXG5cdFx0XHRcdGVudi5ndW4uXy5vbignaW4nLCB7J0AnOiBlbnZbJyMnXSxcclxuXHRcdFx0XHRcdHB1dDogR3VuLmdyYXBoLm5vZGUoZ3JhcGhbZW52LmdldFsnIyddXSlcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0ZW52Lmd1bi5fLm9uKCdpbicsIHtwdXQ6IGdyYXBoLCAnQCc6IGVudlsnIyddfSk7XHJcblx0XHRcdH0sMTAwKTtcclxuXHRcdH0pO1xyXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cclxuXHRcdFx0Ly92YXIgYyA9IG5ldyBDaGFpbigpLCB1O1xyXG5cdFx0XHQvL2MuZ2V0KCdhcHAnKS5tYXAoKS5tYXAoeCA9PiB4LmJhdD8ge2JhejogeC5iYXR9IDogdSkuZ2V0KCdiYXonKS52YWwoZnVuY3Rpb24oZGF0YSwga2V5LCBlbnYpe1xyXG5cdFx0XHQvL1x0Y29uc29sZS5sb2coXCJlbnZlbG9wZVwiLCBlbnYpO1xyXG5cdFx0XHQvL30pO1xyXG5cclxuXHRcdH0sMTAwMCk7XHJcblxyXG5cdH0pKHJlcXVpcmUsICcuL2V4cGVyaW1lbnQnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL3Jvb3QnKTtcclxuXHRcdEd1bi5jaGFpbi5iYWNrID0gZnVuY3Rpb24obiwgb3B0KXsgdmFyIHRtcDtcclxuXHRcdFx0aWYoLTEgPT09IG4gfHwgSW5maW5pdHkgPT09IG4pe1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLl8ucm9vdDtcclxuXHRcdFx0fSBlbHNlXHJcblx0XHRcdGlmKDEgPT09IG4pe1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLl8uYmFjayB8fCB0aGlzO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBndW4gPSB0aGlzLCBhdCA9IGd1bi5fO1xyXG5cdFx0XHRpZih0eXBlb2YgbiA9PT0gJ3N0cmluZycpe1xyXG5cdFx0XHRcdG4gPSBuLnNwbGl0KCcuJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYobiBpbnN0YW5jZW9mIEFycmF5KXtcclxuXHRcdFx0XHR2YXIgaSA9IDAsIGwgPSBuLmxlbmd0aCwgdG1wID0gYXQ7XHJcblx0XHRcdFx0Zm9yKGk7IGkgPCBsOyBpKyspe1xyXG5cdFx0XHRcdFx0dG1wID0gKHRtcHx8ZW1wdHkpW25baV1dO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZih1ICE9PSB0bXApe1xyXG5cdFx0XHRcdFx0cmV0dXJuIG9wdD8gZ3VuIDogdG1wO1xyXG5cdFx0XHRcdH0gZWxzZVxyXG5cdFx0XHRcdGlmKCh0bXAgPSBhdC5iYWNrKSl7XHJcblx0XHRcdFx0XHRyZXR1cm4gdG1wLmJhY2sobiwgb3B0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKG4gaW5zdGFuY2VvZiBGdW5jdGlvbil7XHJcblx0XHRcdFx0dmFyIHllcywgdG1wID0ge2JhY2s6IGd1bn07XHJcblx0XHRcdFx0d2hpbGUoKHRtcCA9IHRtcC5iYWNrKVxyXG5cdFx0XHRcdCYmICh0bXAgPSB0bXAuXylcclxuXHRcdFx0XHQmJiAhKHllcyA9IG4odG1wLCBvcHQpKSl7fVxyXG5cdFx0XHRcdHJldHVybiB5ZXM7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHZhciBlbXB0eSA9IHt9LCB1O1xyXG5cdH0pKHJlcXVpcmUsICcuL2JhY2snKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL3Jvb3QnKTtcclxuXHRcdEd1bi5jaGFpbi5jaGFpbiA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBhdCA9IHRoaXMuXywgY2hhaW4gPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKSwgY2F0ID0gY2hhaW4uXztcclxuXHRcdFx0Y2F0LnJvb3QgPSByb290ID0gYXQucm9vdDtcclxuXHRcdFx0Y2F0LmlkID0gKytyb290Ll8ub25jZTtcclxuXHRcdFx0Y2F0LmJhY2sgPSB0aGlzO1xyXG5cdFx0XHRjYXQub24gPSBHdW4ub247XHJcblx0XHRcdEd1bi5vbignY2hhaW4nLCBjYXQpO1xyXG5cdFx0XHRjYXQub24oJ2luJywgaW5wdXQsIGNhdCk7IC8vIEZvciAnaW4nIGlmIEkgYWRkIG15IG93biBsaXN0ZW5lcnMgdG8gZWFjaCB0aGVuIEkgTVVTVCBkbyBpdCBiZWZvcmUgaW4gZ2V0cyBjYWxsZWQuIElmIEkgbGlzdGVuIGdsb2JhbGx5IGZvciBhbGwgaW5jb21pbmcgZGF0YSBpbnN0ZWFkIHRob3VnaCwgcmVnYXJkbGVzcyBvZiBpbmRpdmlkdWFsIGxpc3RlbmVycywgSSBjYW4gdHJhbnNmb3JtIHRoZSBkYXRhIHRoZXJlIGFuZCB0aGVuIGFzIHdlbGwuXHJcblx0XHRcdGNhdC5vbignb3V0Jywgb3V0cHV0LCBjYXQpOyAvLyBIb3dldmVyIGZvciBvdXRwdXQsIHRoZXJlIGlzbid0IHJlYWxseSB0aGUgZ2xvYmFsIG9wdGlvbi4gSSBtdXN0IGxpc3RlbiBieSBhZGRpbmcgbXkgb3duIGxpc3RlbmVyIGluZGl2aWR1YWxseSBCRUZPUkUgdGhpcyBvbmUgaXMgZXZlciBjYWxsZWQuXHJcblx0XHRcdHJldHVybiBjaGFpbjtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIG91dHB1dChhdCl7XHJcblx0XHRcdHZhciBjYXQgPSB0aGlzLmFzLCBndW4gPSBjYXQuZ3VuLCByb290ID0gZ3VuLmJhY2soLTEpLCBwdXQsIGdldCwgbm93LCB0bXA7XHJcblx0XHRcdGlmKCFhdC5ndW4pe1xyXG5cdFx0XHRcdGF0Lmd1biA9IGd1bjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihnZXQgPSBhdC5nZXQpe1xyXG5cdFx0XHRcdGlmKCFnZXRbX3NvdWxdKXtcclxuXHRcdFx0XHRcdGlmKG9ial9oYXMoZ2V0LCBfZmllbGQpKXtcclxuXHRcdFx0XHRcdFx0Z2V0ID0gZ2V0W19maWVsZF07XHJcblx0XHRcdFx0XHRcdHZhciBuZXh0ID0gZ2V0PyAoZ3VuLmdldChnZXQpLl8pIDogY2F0O1xyXG5cdFx0XHRcdFx0XHQvLyBUT0RPOiBCVUchIEhhbmRsZSBwbHVyYWwgY2hhaW5zIGJ5IGl0ZXJhdGluZyBvdmVyIHRoZW0uXHJcblx0XHRcdFx0XHRcdGlmKG9ial9oYXMobmV4dCwgJ3B1dCcpKXsgLy8gcG90ZW50aWFsbHkgaW5jb3JyZWN0PyBNYXliZT9cclxuXHRcdFx0XHRcdFx0Ly9pZih1ICE9PSBuZXh0LnB1dCl7IC8vIHBvdGVudGlhbGx5IGluY29ycmVjdD8gTWF5YmU/XHJcblx0XHRcdFx0XHRcdFx0Ly9uZXh0LnRhZ1snaW4nXS5sYXN0Lm5leHQobmV4dCk7XHJcblx0XHRcdFx0XHRcdFx0bmV4dC5vbignaW4nLCBuZXh0KTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYob2JqX2hhcyhjYXQsICdwdXQnKSl7XHJcblx0XHRcdFx0XHRcdC8vaWYodSAhPT0gY2F0LnB1dCl7XHJcblx0XHRcdFx0XHRcdFx0dmFyIHZhbCA9IGNhdC5wdXQsIHJlbDtcclxuXHRcdFx0XHRcdFx0XHRpZihyZWwgPSBHdW4ubm9kZS5zb3VsKHZhbCkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFsID0gR3VuLnZhbC5yZWwuaWZ5KHJlbCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGlmKHJlbCA9IEd1bi52YWwucmVsLmlzKHZhbCkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYoIWF0Lmd1bi5fKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdFx0XHRcdChhdC5ndW4uXykub24oJ291dCcsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Z2V0OiB7JyMnOiByZWwsICcuJzogZ2V0fSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0JyMnOiByb290Ll8uYXNrKEd1bi5IQU0uc3ludGgsIGF0Lmd1biksXHJcblx0XHRcdFx0XHRcdFx0XHRcdGd1bjogYXQuZ3VuXHJcblx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0aWYodSA9PT0gdmFsIHx8IEd1bi52YWwuaXModmFsKSl7XHJcblx0XHRcdFx0XHRcdFx0XHRpZighYXQuZ3VuLl8peyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0XHRcdFx0KGF0Lmd1bi5fKS5vbignaW4nLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGdldDogZ2V0LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRndW46IGF0Lmd1blxyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9IGVsc2VcclxuXHRcdFx0XHRcdFx0aWYoY2F0Lm1hcCl7XHJcblx0XHRcdFx0XHRcdFx0b2JqX21hcChjYXQubWFwLCBmdW5jdGlvbihwcm94eSl7XHJcblx0XHRcdFx0XHRcdFx0XHRwcm94eS5hdC5vbignaW4nLCBwcm94eS5hdCk7XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYoY2F0LnNvdWwpe1xyXG5cdFx0XHRcdFx0XHRcdGlmKCFhdC5ndW4uXyl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRcdFx0KGF0Lmd1bi5fKS5vbignb3V0Jywge1xyXG5cdFx0XHRcdFx0XHRcdFx0Z2V0OiB7JyMnOiBjYXQuc291bCwgJy4nOiBnZXR9LFxyXG5cdFx0XHRcdFx0XHRcdFx0JyMnOiByb290Ll8uYXNrKEd1bi5IQU0uc3ludGgsIGF0Lmd1biksXHJcblx0XHRcdFx0XHRcdFx0XHRndW46IGF0Lmd1blxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZihjYXQuZ2V0KXtcclxuXHRcdFx0XHRcdFx0XHRpZighY2F0LmJhY2suXyl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRcdFx0KGNhdC5iYWNrLl8pLm9uKCdvdXQnLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRnZXQ6IG9ial9wdXQoe30sIF9maWVsZCwgY2F0LmdldCksXHJcblx0XHRcdFx0XHRcdFx0XHRndW46IGd1blxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRhdCA9IG9ial90byhhdCwge2dldDoge319KTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGlmKG9ial9oYXMoY2F0LCAncHV0Jykpe1xyXG5cdFx0XHRcdFx0XHQvL2lmKHUgIT09IGNhdC5wdXQpe1xyXG5cdFx0XHRcdFx0XHRcdGNhdC5vbignaW4nLCBjYXQpO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2VcclxuXHRcdFx0XHRcdFx0aWYoY2F0Lm1hcCl7XHJcblx0XHRcdFx0XHRcdFx0b2JqX21hcChjYXQubWFwLCBmdW5jdGlvbihwcm94eSl7XHJcblx0XHRcdFx0XHRcdFx0XHRwcm94eS5hdC5vbignaW4nLCBwcm94eS5hdCk7XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYoY2F0LmFjayl7XHJcblx0XHRcdFx0XHRcdFx0aWYoIW9ial9oYXMoY2F0LCAncHV0JykpeyAvLyB1ICE9PSBjYXQucHV0IGluc3RlYWQ/XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGNhdC5hY2sgPSAtMTtcclxuXHRcdFx0XHRcdFx0aWYoY2F0LnNvdWwpe1xyXG5cdFx0XHRcdFx0XHRcdGNhdC5vbignb3V0Jywge1xyXG5cdFx0XHRcdFx0XHRcdFx0Z2V0OiB7JyMnOiBjYXQuc291bH0sXHJcblx0XHRcdFx0XHRcdFx0XHQnIyc6IHJvb3QuXy5hc2soR3VuLkhBTS5zeW50aCwgY2F0Lmd1biksXHJcblx0XHRcdFx0XHRcdFx0XHRndW46IGNhdC5ndW5cclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYoY2F0LmdldCl7XHJcblx0XHRcdFx0XHRcdFx0aWYoIWNhdC5iYWNrLl8peyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0XHRcdChjYXQuYmFjay5fKS5vbignb3V0Jywge1xyXG5cdFx0XHRcdFx0XHRcdFx0Z2V0OiBvYmpfcHV0KHt9LCBfZmllbGQsIGNhdC5nZXQpLFxyXG5cdFx0XHRcdFx0XHRcdFx0Z3VuOiBjYXQuZ3VuXHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdChjYXQuYmFjay5fKS5vbignb3V0JywgYXQpO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gaW5wdXQoYXQpe1xyXG5cdFx0XHRhdCA9IGF0Ll8gfHwgYXQ7XHJcblx0XHRcdHZhciBldiA9IHRoaXMsIGNhdCA9IHRoaXMuYXMsIGd1biA9IGF0Lmd1biwgY29hdCA9IGd1bi5fLCBjaGFuZ2UgPSBhdC5wdXQsIGJhY2sgPSBjYXQuYmFjay5fIHx8IGVtcHR5LCByZWwsIHRtcDtcclxuXHRcdFx0aWYoMCA+IGNhdC5hY2sgJiYgIUd1bi52YWwucmVsLmlzKGNoYW5nZSkpeyAvLyBmb3IgYmV0dGVyIGJlaGF2aW9yP1xyXG5cdFx0XHRcdGNhdC5hY2sgPSAxO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNhdC5nZXQgJiYgYXQuZ2V0ICE9PSBjYXQuZ2V0KXtcclxuXHRcdFx0XHRhdCA9IG9ial90byhhdCwge2dldDogY2F0LmdldH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNhdC5maWVsZCAmJiBjb2F0ICE9PSBjYXQpe1xyXG5cdFx0XHRcdGF0ID0gb2JqX3RvKGF0LCB7Z3VuOiBjYXQuZ3VufSk7XHJcblx0XHRcdFx0aWYoY29hdC5hY2spe1xyXG5cdFx0XHRcdFx0Y2F0LmFjayA9IGNhdC5hY2sgfHwgY29hdC5hY2s7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHUgPT09IGNoYW5nZSl7XHJcblx0XHRcdFx0ZXYudG8ubmV4dChhdCk7XHJcblx0XHRcdFx0aWYoY2F0LnNvdWwpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGVjaG8oY2F0LCBhdCwgZXYpO1xyXG5cdFx0XHRcdGlmKGNhdC5maWVsZCl7XHJcblx0XHRcdFx0XHRub3QoY2F0LCBhdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG9ial9kZWwoY29hdC5lY2hvLCBjYXQuaWQpO1xyXG5cdFx0XHRcdG9ial9kZWwoY2F0Lm1hcCwgY29hdC5pZCk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNhdC5zb3VsKXtcclxuXHRcdFx0XHRpZihjYXQucm9vdC5fLm5vdyl7IGF0ID0gb2JqX3RvKGF0LCB7cHV0OiBjaGFuZ2UgPSBjb2F0LnB1dH0pIH0gLy8gVE9ETzogVWdseSBoYWNrIGZvciB1bmNhY2hlZCBzeW5jaHJvbm91cyBtYXBzLlxyXG5cdFx0XHRcdGV2LnRvLm5leHQoYXQpO1xyXG5cdFx0XHRcdGVjaG8oY2F0LCBhdCwgZXYpO1xyXG5cdFx0XHRcdG9ial9tYXAoY2hhbmdlLCBtYXAsIHthdDogYXQsIGNhdDogY2F0fSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCEocmVsID0gR3VuLnZhbC5yZWwuaXMoY2hhbmdlKSkpe1xyXG5cdFx0XHRcdGlmKEd1bi52YWwuaXMoY2hhbmdlKSl7XHJcblx0XHRcdFx0XHRpZihjYXQuZmllbGQgfHwgY2F0LnNvdWwpe1xyXG5cdFx0XHRcdFx0XHRub3QoY2F0LCBhdCk7XHJcblx0XHRcdFx0XHR9IGVsc2VcclxuXHRcdFx0XHRcdGlmKGNvYXQuZmllbGQgfHwgY29hdC5zb3VsKXtcclxuXHRcdFx0XHRcdFx0KGNvYXQuZWNobyB8fCAoY29hdC5lY2hvID0ge30pKVtjYXQuaWRdID0gY2F0O1xyXG5cdFx0XHRcdFx0XHQoY2F0Lm1hcCB8fCAoY2F0Lm1hcCA9IHt9KSlbY29hdC5pZF0gPSBjYXQubWFwW2NvYXQuaWRdIHx8IHthdDogY29hdH07XHJcblx0XHRcdFx0XHRcdC8vaWYodSA9PT0gY29hdC5wdXQpeyByZXR1cm4gfSAvLyBOb3QgbmVjZXNzYXJ5IGJ1dCBpbXByb3ZlcyBwZXJmb3JtYW5jZS4gSWYgd2UgaGF2ZSBpdCBidXQgY29hdCBkb2VzIG5vdCwgdGhhdCBtZWFucyB3ZSBnb3QgdGhpbmdzIG91dCBvZiBvcmRlciBhbmQgY29hdCB3aWxsIGdldCBpdC4gT25jZSBjb2F0IGdldHMgaXQsIGl0IHdpbGwgdGVsbCB1cyBhZ2Fpbi5cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGV2LnRvLm5leHQoYXQpO1xyXG5cdFx0XHRcdFx0ZWNobyhjYXQsIGF0LCBldik7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGNhdC5maWVsZCAmJiBjb2F0ICE9PSBjYXQgJiYgb2JqX2hhcyhjb2F0LCAncHV0Jykpe1xyXG5cdFx0XHRcdFx0Y2F0LnB1dCA9IGNvYXQucHV0O1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0aWYoKHJlbCA9IEd1bi5ub2RlLnNvdWwoY2hhbmdlKSkgJiYgY29hdC5maWVsZCl7XHJcblx0XHRcdFx0XHRjb2F0LnB1dCA9IChjYXQucm9vdC5nZXQocmVsKS5fKS5wdXQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGV2LnRvLm5leHQoYXQpO1xyXG5cdFx0XHRcdGVjaG8oY2F0LCBhdCwgZXYpO1xyXG5cdFx0XHRcdHJlbGF0ZShjYXQsIGF0LCBjb2F0LCByZWwpO1xyXG5cdFx0XHRcdG9ial9tYXAoY2hhbmdlLCBtYXAsIHthdDogYXQsIGNhdDogY2F0fSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJlbGF0ZShjYXQsIGF0LCBjb2F0LCByZWwpO1xyXG5cdFx0XHRldi50by5uZXh0KGF0KTtcclxuXHRcdFx0ZWNobyhjYXQsIGF0LCBldik7XHJcblx0XHR9XHJcblx0XHRHdW4uY2hhaW4uY2hhaW4uaW5wdXQgPSBpbnB1dDtcclxuXHRcdGZ1bmN0aW9uIHJlbGF0ZShjYXQsIGF0LCBjb2F0LCByZWwpe1xyXG5cdFx0XHRpZighcmVsIHx8IG5vZGVfID09PSBjYXQuZ2V0KXsgcmV0dXJuIH1cclxuXHRcdFx0dmFyIHRtcCA9IChjYXQucm9vdC5nZXQocmVsKS5fKTtcclxuXHRcdFx0aWYoY2F0LmZpZWxkKXtcclxuXHRcdFx0XHRjb2F0ID0gdG1wO1xyXG5cdFx0XHR9IGVsc2UgXHJcblx0XHRcdGlmKGNvYXQuZmllbGQpe1xyXG5cdFx0XHRcdHJlbGF0ZShjb2F0LCBhdCwgY29hdCwgcmVsKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjb2F0ID09PSBjYXQpeyByZXR1cm4gfVxyXG5cdFx0XHQoY29hdC5lY2hvIHx8IChjb2F0LmVjaG8gPSB7fSkpW2NhdC5pZF0gPSBjYXQ7XHJcblx0XHRcdGlmKGNhdC5maWVsZCAmJiAhKGNhdC5tYXB8fGVtcHR5KVtjb2F0LmlkXSl7XHJcblx0XHRcdFx0bm90KGNhdCwgYXQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRtcCA9IChjYXQubWFwIHx8IChjYXQubWFwID0ge30pKVtjb2F0LmlkXSA9IGNhdC5tYXBbY29hdC5pZF0gfHwge2F0OiBjb2F0fTtcclxuXHRcdFx0aWYocmVsICE9PSB0bXAucmVsKXtcclxuXHRcdFx0XHRhc2soY2F0LCB0bXAucmVsID0gcmVsKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gZWNobyhjYXQsIGF0LCBldil7XHJcblx0XHRcdGlmKCFjYXQuZWNobyl7IHJldHVybiB9IC8vIHx8IG5vZGVfID09PSBhdC5nZXQgPz8/P1xyXG5cdFx0XHRpZihjYXQuZmllbGQpeyBhdCA9IG9ial90byhhdCwge2V2ZW50OiBldn0pIH1cclxuXHRcdFx0b2JqX21hcChjYXQuZWNobywgcmV2ZXJiLCBhdCk7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiByZXZlcmIoY2F0KXtcclxuXHRcdFx0Y2F0Lm9uKCdpbicsIHRoaXMpO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gbWFwKGRhdGEsIGtleSl7IC8vIE1hcCBvdmVyIG9ubHkgdGhlIGNoYW5nZXMgb24gZXZlcnkgdXBkYXRlLlxyXG5cdFx0XHR2YXIgY2F0ID0gdGhpcy5jYXQsIG5leHQgPSBjYXQubmV4dCB8fCBlbXB0eSwgdmlhID0gdGhpcy5hdCwgZ3VuLCBjaGFpbiwgYXQsIHRtcDtcclxuXHRcdFx0aWYobm9kZV8gPT09IGtleSAmJiAhbmV4dFtrZXldKXsgcmV0dXJuIH1cclxuXHRcdFx0aWYoIShndW4gPSBuZXh0W2tleV0pKXtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0YXQgPSAoZ3VuLl8pO1xyXG5cdFx0XHQvL2lmKGRhdGEgJiYgZGF0YVtfc291bF0gJiYgKHRtcCA9IEd1bi52YWwucmVsLmlzKGRhdGEpKSAmJiAodG1wID0gKGNhdC5yb290LmdldCh0bXApLl8pKSAmJiBvYmpfaGFzKHRtcCwgJ3B1dCcpKXtcclxuXHRcdFx0Ly9cdGRhdGEgPSB0bXAucHV0O1xyXG5cdFx0XHQvL31cclxuXHRcdFx0aWYoYXQuZmllbGQpe1xyXG5cdFx0XHRcdGlmKCEoZGF0YSAmJiBkYXRhW19zb3VsXSAmJiBHdW4udmFsLnJlbC5pcyhkYXRhKSA9PT0gR3VuLm5vZGUuc291bChhdC5wdXQpKSl7XHJcblx0XHRcdFx0XHRhdC5wdXQgPSBkYXRhO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjaGFpbiA9IGd1bjtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjaGFpbiA9IHZpYS5ndW4uZ2V0KGtleSk7XHJcblx0XHRcdH1cclxuXHRcdFx0YXQub24oJ2luJywge1xyXG5cdFx0XHRcdHB1dDogZGF0YSxcclxuXHRcdFx0XHRnZXQ6IGtleSxcclxuXHRcdFx0XHRndW46IGNoYWluLFxyXG5cdFx0XHRcdHZpYTogdmlhXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gbm90KGNhdCwgYXQpe1xyXG5cdFx0XHRpZighKGNhdC5maWVsZCB8fCBjYXQuc291bCkpeyByZXR1cm4gfVxyXG5cdFx0XHR2YXIgdG1wID0gY2F0Lm1hcDtcclxuXHRcdFx0Y2F0Lm1hcCA9IG51bGw7XHJcblx0XHRcdGlmKG51bGwgPT09IHRtcCl7IHJldHVybiB9XHJcblx0XHRcdGlmKHUgPT09IHRtcCAmJiBjYXQucHV0ICE9PSB1KXsgcmV0dXJuIH0gLy8gVE9ETzogQnVnPyBUaHJldyBzZWNvbmQgY29uZGl0aW9uIGluIGZvciBhIHBhcnRpY3VsYXIgdGVzdCwgbm90IHN1cmUgaWYgYSBjb3VudGVyIGV4YW1wbGUgaXMgdGVzdGVkIHRob3VnaC5cclxuXHRcdFx0b2JqX21hcCh0bXAsIGZ1bmN0aW9uKHByb3h5KXtcclxuXHRcdFx0XHRpZighKHByb3h5ID0gcHJveHkuYXQpKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRvYmpfZGVsKHByb3h5LmVjaG8sIGNhdC5pZCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRvYmpfbWFwKGNhdC5uZXh0LCBmdW5jdGlvbihndW4sIGtleSl7XHJcblx0XHRcdFx0dmFyIGNvYXQgPSAoZ3VuLl8pO1xyXG5cdFx0XHRcdGNvYXQucHV0ID0gdTtcclxuXHRcdFx0XHRpZihjb2F0LmFjayl7XHJcblx0XHRcdFx0XHRjb2F0LmFjayA9IC0xO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjb2F0Lm9uKCdpbicsIHtcclxuXHRcdFx0XHRcdGdldDoga2V5LFxyXG5cdFx0XHRcdFx0Z3VuOiBndW4sXHJcblx0XHRcdFx0XHRwdXQ6IHVcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBhc2soY2F0LCBzb3VsKXtcclxuXHRcdFx0dmFyIHRtcCA9IChjYXQucm9vdC5nZXQoc291bCkuXyk7XHJcblx0XHRcdGlmKGNhdC5hY2spe1xyXG5cdFx0XHRcdHRtcC5hY2sgPSB0bXAuYWNrIHx8IC0xO1xyXG5cdFx0XHRcdHRtcC5vbignb3V0Jywge1xyXG5cdFx0XHRcdFx0Z2V0OiB7JyMnOiBzb3VsfSxcclxuXHRcdFx0XHRcdCcjJzogY2F0LnJvb3QuXy5hc2soR3VuLkhBTS5zeW50aCwgdG1wLmd1biksXHJcblx0XHRcdFx0XHRndW46IHRtcC5ndW5cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0b2JqX21hcChjYXQubmV4dCwgZnVuY3Rpb24oZ3VuLCBrZXkpe1xyXG5cdFx0XHRcdChndW4uXykub24oJ291dCcsIHtcclxuXHRcdFx0XHRcdGdldDogeycjJzogc291bCwgJy4nOiBrZXl9LFxyXG5cdFx0XHRcdFx0JyMnOiBjYXQucm9vdC5fLmFzayhHdW4uSEFNLnN5bnRoLCB0bXAuZ3VuKSxcclxuXHRcdFx0XHRcdGd1bjogZ3VuXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0dmFyIGVtcHR5ID0ge30sIHU7XHJcblx0XHR2YXIgb2JqID0gR3VuLm9iaiwgb2JqX2hhcyA9IG9iai5oYXMsIG9ial9wdXQgPSBvYmoucHV0LCBvYmpfZGVsID0gb2JqLmRlbCwgb2JqX3RvID0gb2JqLnRvLCBvYmpfbWFwID0gb2JqLm1hcDtcclxuXHRcdHZhciBfc291bCA9IEd1bi5fLnNvdWwsIF9maWVsZCA9IEd1bi5fLmZpZWxkLCBub2RlXyA9IEd1bi5ub2RlLl87XHJcblx0fSkocmVxdWlyZSwgJy4vY2hhaW4nKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL3Jvb3QnKTtcclxuXHRcdEd1bi5jaGFpbi5nZXQgPSBmdW5jdGlvbihrZXksIGNiLCBhcyl7XHJcblx0XHRcdGlmKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnKXtcclxuXHRcdFx0XHR2YXIgZ3VuLCBiYWNrID0gdGhpcywgY2F0ID0gYmFjay5fO1xyXG5cdFx0XHRcdHZhciBuZXh0ID0gY2F0Lm5leHQgfHwgZW1wdHksIHRtcDtcclxuXHRcdFx0XHRpZighKGd1biA9IG5leHRba2V5XSkpe1xyXG5cdFx0XHRcdFx0Z3VuID0gY2FjaGUoa2V5LCBiYWNrKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZVxyXG5cdFx0XHRpZihrZXkgaW5zdGFuY2VvZiBGdW5jdGlvbil7XHJcblx0XHRcdFx0dmFyIGd1biA9IHRoaXMsIGF0ID0gZ3VuLl87XHJcblx0XHRcdFx0YXMgPSBjYiB8fCB7fTtcclxuXHRcdFx0XHRhcy51c2UgPSBrZXk7XHJcblx0XHRcdFx0YXMub3V0ID0gYXMub3V0IHx8IHtjYXA6IDF9O1xyXG5cdFx0XHRcdGFzLm91dC5nZXQgPSBhcy5vdXQuZ2V0IHx8IHt9O1xyXG5cdFx0XHRcdCdfJyAhPSBhdC5nZXQgJiYgKChhdC5yb290Ll8pLm5vdyA9IHRydWUpOyAvLyB1Z2x5IGhhY2sgZm9yIG5vdy5cclxuXHRcdFx0XHRhdC5vbignaW4nLCB1c2UsIGFzKTtcclxuXHRcdFx0XHRhdC5vbignb3V0JywgYXMub3V0KTtcclxuXHRcdFx0XHQoYXQucm9vdC5fKS5ub3cgPSBmYWxzZTtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9IGVsc2VcclxuXHRcdFx0aWYobnVtX2lzKGtleSkpe1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmdldCgnJytrZXksIGNiLCBhcyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0KGFzID0gdGhpcy5jaGFpbigpKS5fLmVyciA9IHtlcnI6IEd1bi5sb2coJ0ludmFsaWQgZ2V0IHJlcXVlc3QhJywga2V5KX07IC8vIENMRUFOIFVQXHJcblx0XHRcdFx0aWYoY2IpeyBjYi5jYWxsKGFzLCBhcy5fLmVycikgfVxyXG5cdFx0XHRcdHJldHVybiBhcztcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih0bXAgPSBjYXQuc3R1bil7IC8vIFRPRE86IFJlZmFjdG9yP1xyXG5cdFx0XHRcdGd1bi5fLnN0dW4gPSBndW4uXy5zdHVuIHx8IHRtcDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjYiAmJiBjYiBpbnN0YW5jZW9mIEZ1bmN0aW9uKXtcclxuXHRcdFx0XHRndW4uZ2V0KGNiLCBhcyk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIGNhY2hlKGtleSwgYmFjayl7XHJcblx0XHRcdHZhciBjYXQgPSBiYWNrLl8sIG5leHQgPSBjYXQubmV4dCwgZ3VuID0gYmFjay5jaGFpbigpLCBhdCA9IGd1bi5fO1xyXG5cdFx0XHRpZighbmV4dCl7IG5leHQgPSBjYXQubmV4dCA9IHt9IH1cclxuXHRcdFx0bmV4dFthdC5nZXQgPSBrZXldID0gZ3VuO1xyXG5cdFx0XHRpZihjYXQucm9vdCA9PT0gYmFjayl7IGF0LnNvdWwgPSBrZXkgfVxyXG5cdFx0XHRlbHNlIGlmKGNhdC5zb3VsIHx8IGNhdC5maWVsZCl7IGF0LmZpZWxkID0ga2V5IH1cclxuXHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIHVzZShhdCl7XHJcblx0XHRcdHZhciBldiA9IHRoaXMsIGFzID0gZXYuYXMsIGd1biA9IGF0Lmd1biwgY2F0ID0gZ3VuLl8sIGRhdGEgPSBhdC5wdXQsIHRtcDtcclxuXHRcdFx0aWYodSA9PT0gZGF0YSl7XHJcblx0XHRcdFx0ZGF0YSA9IGNhdC5wdXQ7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoKHRtcCA9IGRhdGEpICYmIHRtcFtyZWwuX10gJiYgKHRtcCA9IHJlbC5pcyh0bXApKSl7XHJcblx0XHRcdFx0dG1wID0gKGNhdC5yb290LmdldCh0bXApLl8pO1xyXG5cdFx0XHRcdGlmKHUgIT09IHRtcC5wdXQpe1xyXG5cdFx0XHRcdFx0YXQgPSBvYmpfdG8oYXQsIHtwdXQ6IHRtcC5wdXR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0YXMudXNlKGF0LCBhdC5ldmVudCB8fCBldik7XHJcblx0XHRcdGV2LnRvLm5leHQoYXQpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIG9iaiA9IEd1bi5vYmosIG9ial9oYXMgPSBvYmouaGFzLCBvYmpfdG8gPSBHdW4ub2JqLnRvO1xyXG5cdFx0dmFyIG51bV9pcyA9IEd1bi5udW0uaXM7XHJcblx0XHR2YXIgcmVsID0gR3VuLnZhbC5yZWwsIG5vZGVfID0gR3VuLm5vZGUuXztcclxuXHRcdHZhciBlbXB0eSA9IHt9LCB1O1xyXG5cdH0pKHJlcXVpcmUsICcuL2dldCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vcm9vdCcpO1xyXG5cdFx0R3VuLmNoYWluLnB1dCA9IGZ1bmN0aW9uKGRhdGEsIGNiLCBhcyl7XHJcblx0XHRcdC8vICNzb3VsLmZpZWxkPXZhbHVlPnN0YXRlXHJcblx0XHRcdC8vIH53aG8jd2hlcmUud2hlcmU9d2hhdD53aGVuQHdhc1xyXG5cdFx0XHQvLyBUT0RPOiBCVUchIFB1dCBwcm9iYWJseSBjYW5ub3QgaGFuZGxlIHBsdXJhbCBjaGFpbnMhXHJcblx0XHRcdHZhciBndW4gPSB0aGlzLCBhdCA9IChndW4uXyksIHJvb3QgPSBhdC5yb290LCB0bXA7XHJcblx0XHRcdGFzID0gYXMgfHwge307XHJcblx0XHRcdGFzLmRhdGEgPSBkYXRhO1xyXG5cdFx0XHRhcy5ndW4gPSBhcy5ndW4gfHwgZ3VuO1xyXG5cdFx0XHRpZih0eXBlb2YgY2IgPT09ICdzdHJpbmcnKXtcclxuXHRcdFx0XHRhcy5zb3VsID0gY2I7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0YXMuYWNrID0gY2I7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoYXQuc291bCl7XHJcblx0XHRcdFx0YXMuc291bCA9IGF0LnNvdWw7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoYXMuc291bCB8fCByb290ID09PSBndW4pe1xyXG5cdFx0XHRcdGlmKCFvYmpfaXMoYXMuZGF0YSkpe1xyXG5cdFx0XHRcdFx0KGFzLmFja3x8bm9vcCkuY2FsbChhcywgYXMub3V0ID0ge2VycjogR3VuLmxvZyhcIkRhdGEgc2F2ZWQgdG8gdGhlIHJvb3QgbGV2ZWwgb2YgdGhlIGdyYXBoIG11c3QgYmUgYSBub2RlIChhbiBvYmplY3QpLCBub3QgYVwiLCAodHlwZW9mIGFzLmRhdGEpLCAnb2YgXCInICsgYXMuZGF0YSArICdcIiEnKX0pO1xyXG5cdFx0XHRcdFx0aWYoYXMucmVzKXsgYXMucmVzKCkgfVxyXG5cdFx0XHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YXMuZ3VuID0gZ3VuID0gcm9vdC5nZXQoYXMuc291bCA9IGFzLnNvdWwgfHwgKGFzLm5vdCA9IEd1bi5ub2RlLnNvdWwoYXMuZGF0YSkgfHwgKChyb290Ll8pLm9wdC51dWlkIHx8IEd1bi50ZXh0LnJhbmRvbSkoKSkpO1xyXG5cdFx0XHRcdGFzLnJlZiA9IGFzLmd1bjtcclxuXHRcdFx0XHRpZnkoYXMpO1xyXG5cdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoR3VuLmlzKGRhdGEpKXtcclxuXHRcdFx0XHRkYXRhLmdldChmdW5jdGlvbihhdCxldil7ZXYub2ZmKCk7XHJcblx0XHRcdFx0XHR2YXIgcyA9IEd1bi5ub2RlLnNvdWwoYXQucHV0KTtcclxuXHRcdFx0XHRcdGlmKCFzKXtHdW4ubG9nKFwiVGhlIHJlZmVyZW5jZSB5b3UgYXJlIHNhdmluZyBpcyBhXCIsIHR5cGVvZiBhdC5wdXQsICdcIicrIGFzLnB1dCArJ1wiLCBub3QgYSBub2RlIChvYmplY3QpIScpO3JldHVybn1cclxuXHRcdFx0XHRcdGd1bi5wdXQoR3VuLnZhbC5yZWwuaWZ5KHMpLCBjYiwgYXMpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdH1cclxuXHRcdFx0YXMucmVmID0gYXMucmVmIHx8IChyb290ID09PSAodG1wID0gYXQuYmFjaykpPyBndW4gOiB0bXA7XHJcblx0XHRcdGlmKGFzLnJlZi5fLnNvdWwgJiYgR3VuLnZhbC5pcyhhcy5kYXRhKSAmJiBhdC5nZXQpe1xyXG5cdFx0XHRcdGFzLmRhdGEgPSBvYmpfcHV0KHt9LCBhdC5nZXQsIGFzLmRhdGEpO1xyXG5cdFx0XHRcdGFzLnJlZi5wdXQoYXMuZGF0YSwgYXMuc291bCwgYXMpO1xyXG5cdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdH1cclxuXHRcdFx0YXMucmVmLmdldCgnXycpLmdldChhbnksIHthczogYXN9KTtcclxuXHRcdFx0aWYoIWFzLm91dCl7XHJcblx0XHRcdFx0Ly8gVE9ETzogUGVyZiBpZGVhISBNYWtlIGEgZ2xvYmFsIGxvY2ssIHRoYXQgYmxvY2tzIGV2ZXJ5dGhpbmcgd2hpbGUgaXQgaXMgb24sIGJ1dCBpZiBpdCBpcyBvbiB0aGUgbG9jayBpdCBkb2VzIHRoZSBleHBlbnNpdmUgbG9va3VwIHRvIHNlZSBpZiBpdCBpcyBhIGRlcGVuZGVudCB3cml0ZSBvciBub3QgYW5kIGlmIG5vdCB0aGVuIGl0IHByb2NlZWRzIGZ1bGwgc3BlZWQuIE1laD8gRm9yIHdyaXRlIGhlYXZ5IGFzeW5jIGFwcHMgdGhhdCB3b3VsZCBiZSB0ZXJyaWJsZS5cclxuXHRcdFx0XHRhcy5yZXMgPSBhcy5yZXMgfHwgR3VuLm9uLnN0dW4oYXMucmVmKTtcclxuXHRcdFx0XHRhcy5ndW4uXy5zdHVuID0gYXMucmVmLl8uc3R1bjtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0fTtcclxuXHJcblx0XHRmdW5jdGlvbiBpZnkoYXMpe1xyXG5cdFx0XHRhcy5iYXRjaCA9IGJhdGNoO1xyXG5cdFx0XHR2YXIgb3B0ID0gYXMub3B0fHx7fSwgZW52ID0gYXMuZW52ID0gR3VuLnN0YXRlLm1hcChtYXAsIG9wdC5zdGF0ZSk7XHJcblx0XHRcdGVudi5zb3VsID0gYXMuc291bDtcclxuXHRcdFx0YXMuZ3JhcGggPSBHdW4uZ3JhcGguaWZ5KGFzLmRhdGEsIGVudiwgYXMpO1xyXG5cdFx0XHRpZihlbnYuZXJyKXtcclxuXHRcdFx0XHQoYXMuYWNrfHxub29wKS5jYWxsKGFzLCBhcy5vdXQgPSB7ZXJyOiBHdW4ubG9nKGVudi5lcnIpfSk7XHJcblx0XHRcdFx0aWYoYXMucmVzKXsgYXMucmVzKCkgfVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRhcy5iYXRjaCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGJhdGNoKCl7IHZhciBhcyA9IHRoaXM7XHJcblx0XHRcdGlmKCFhcy5ncmFwaCB8fCBvYmpfbWFwKGFzLnN0dW4sIG5vKSl7IHJldHVybiB9XHJcblx0XHRcdChhcy5yZXN8fGlpZmUpKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0KGFzLnJlZi5fKS5vbignb3V0Jywge1xyXG5cdFx0XHRcdFx0Y2FwOiAzLFxyXG5cdFx0XHRcdFx0Z3VuOiBhcy5yZWYsIHB1dDogYXMub3V0ID0gYXMuZW52LmdyYXBoLCBvcHQ6IGFzLm9wdCxcclxuXHRcdFx0XHRcdCcjJzogYXMuZ3VuLmJhY2soLTEpLl8uYXNrKGZ1bmN0aW9uKGFjayl7IHRoaXMub2ZmKCk7IC8vIE9uZSByZXNwb25zZSBpcyBnb29kIGVub3VnaCBmb3IgdXMgY3VycmVudGx5LiBMYXRlciB3ZSBtYXkgd2FudCB0byBhZGp1c3QgdGhpcy5cclxuXHRcdFx0XHRcdFx0aWYoIWFzLmFjayl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRcdGFzLmFjayhhY2ssIHRoaXMpO1xyXG5cdFx0XHRcdFx0fSwgYXMub3B0KVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9LCBhcyk7XHJcblx0XHRcdGlmKGFzLnJlcyl7IGFzLnJlcygpIH1cclxuXHRcdH0gZnVuY3Rpb24gbm8odixmKXsgaWYodil7IHJldHVybiB0cnVlIH0gfVxyXG5cclxuXHRcdGZ1bmN0aW9uIG1hcCh2LGYsbiwgYXQpeyB2YXIgYXMgPSB0aGlzO1xyXG5cdFx0XHRpZihmIHx8ICFhdC5wYXRoLmxlbmd0aCl7IHJldHVybiB9XHJcblx0XHRcdChhcy5yZXN8fGlpZmUpKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIHBhdGggPSBhdC5wYXRoLCByZWYgPSBhcy5yZWYsIG9wdCA9IGFzLm9wdDtcclxuXHRcdFx0XHR2YXIgaSA9IDAsIGwgPSBwYXRoLmxlbmd0aDtcclxuXHRcdFx0XHRmb3IoaTsgaSA8IGw7IGkrKyl7XHJcblx0XHRcdFx0XHRyZWYgPSByZWYuZ2V0KHBhdGhbaV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihhcy5ub3QgfHwgR3VuLm5vZGUuc291bChhdC5vYmopKXtcclxuXHRcdFx0XHRcdGF0LnNvdWwoR3VuLm5vZGUuc291bChhdC5vYmopIHx8ICgoYXMub3B0fHx7fSkudXVpZCB8fCBhcy5ndW4uYmFjaygnb3B0LnV1aWQnKSB8fCBHdW4udGV4dC5yYW5kb20pKCkpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQoYXMuc3R1biA9IGFzLnN0dW4gfHwge30pW3BhdGhdID0gdHJ1ZTtcclxuXHRcdFx0XHRyZWYuZ2V0KCdfJykuZ2V0KHNvdWwsIHthczoge2F0OiBhdCwgYXM6IGFzfX0pO1xyXG5cdFx0XHR9LCB7YXM6IGFzLCBhdDogYXR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBzb3VsKGF0LCBldil7IHZhciBhcyA9IHRoaXMuYXMsIGNhdCA9IGFzLmF0OyBhcyA9IGFzLmFzO1xyXG5cdFx0XHQvL2V2LnN0dW4oKTsgLy8gVE9ETzogQlVHIT9cclxuXHRcdFx0aWYoIWF0Lmd1biB8fCAhYXQuZ3VuLl8uYmFjayl7IHJldHVybiB9IC8vIFRPRE86IEhhbmRsZVxyXG5cdFx0XHRldi5vZmYoKTtcclxuXHRcdFx0YXQgPSAoYXQuZ3VuLl8uYmFjay5fKTtcclxuXHRcdFx0Y2F0LnNvdWwoR3VuLm5vZGUuc291bChjYXQub2JqKSB8fCBHdW4ubm9kZS5zb3VsKGF0LnB1dCkgfHwgR3VuLnZhbC5yZWwuaXMoYXQucHV0KSB8fCAoKGFzLm9wdHx8e30pLnV1aWQgfHwgYXMuZ3VuLmJhY2soJ29wdC51dWlkJykgfHwgR3VuLnRleHQucmFuZG9tKSgpKTsgLy8gVE9ETzogQlVHIT8gRG8gd2UgcmVhbGx5IHdhbnQgdGhlIHNvdWwgb2YgdGhlIG9iamVjdCBnaXZlbiB0byB1cz8gQ291bGQgdGhhdCBiZSBkYW5nZXJvdXM/XHJcblx0XHRcdGFzLnN0dW5bY2F0LnBhdGhdID0gZmFsc2U7XHJcblx0XHRcdGFzLmJhdGNoKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gYW55KGF0LCBldil7XHJcblx0XHRcdHZhciBhcyA9IHRoaXMuYXM7XHJcblx0XHRcdGlmKCFhdC5ndW4gfHwgIWF0Lmd1bi5fKXsgcmV0dXJuIH0gLy8gVE9ETzogSGFuZGxlXHJcblx0XHRcdGlmKGF0LmVycil7IC8vIFRPRE86IEhhbmRsZVxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiUGxlYXNlIHJlcG9ydCB0aGlzIGFzIGFuIGlzc3VlISBQdXQuYW55LmVyclwiKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIGNhdCA9IChhdC5ndW4uXy5iYWNrLl8pLCBkYXRhID0gY2F0LnB1dCwgb3B0ID0gYXMub3B0fHx7fSwgcm9vdCwgdG1wO1xyXG5cdFx0XHRldi5vZmYoKTtcclxuXHRcdFx0aWYoYXMucmVmICE9PSBhcy5ndW4pe1xyXG5cdFx0XHRcdHRtcCA9IChhcy5ndW4uXykuZ2V0IHx8IGNhdC5nZXQ7XHJcblx0XHRcdFx0aWYoIXRtcCl7IC8vIFRPRE86IEhhbmRsZVxyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJQbGVhc2UgcmVwb3J0IHRoaXMgYXMgYW4gaXNzdWUhIFB1dC5uby5nZXRcIik7IC8vIFRPRE86IEJVRyE/P1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRhcy5kYXRhID0gb2JqX3B1dCh7fSwgdG1wLCBhcy5kYXRhKTtcclxuXHRcdFx0XHR0bXAgPSBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHUgPT09IGRhdGEpe1xyXG5cdFx0XHRcdGlmKCFjYXQuZ2V0KXsgcmV0dXJuIH0gLy8gVE9ETzogSGFuZGxlXHJcblx0XHRcdFx0aWYoIWNhdC5zb3VsKXtcclxuXHRcdFx0XHRcdHRtcCA9IGNhdC5ndW4uYmFjayhmdW5jdGlvbihhdCl7XHJcblx0XHRcdFx0XHRcdGlmKGF0LnNvdWwpeyByZXR1cm4gYXQuc291bCB9XHJcblx0XHRcdFx0XHRcdGFzLmRhdGEgPSBvYmpfcHV0KHt9LCBhdC5nZXQsIGFzLmRhdGEpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRtcCA9IHRtcCB8fCBjYXQuZ2V0O1xyXG5cdFx0XHRcdGNhdCA9IChjYXQucm9vdC5nZXQodG1wKS5fKTtcclxuXHRcdFx0XHRhcy5ub3QgPSBhcy5zb3VsID0gdG1wO1xyXG5cdFx0XHRcdGRhdGEgPSBhcy5kYXRhO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCFhcy5ub3QgJiYgIShhcy5zb3VsID0gR3VuLm5vZGUuc291bChkYXRhKSkpe1xyXG5cdFx0XHRcdGlmKGFzLnBhdGggJiYgb2JqX2lzKGFzLmRhdGEpKXsgLy8gQXBwYXJlbnRseSBuZWNlc3NhcnlcclxuXHRcdFx0XHRcdGFzLnNvdWwgPSAob3B0LnV1aWQgfHwgY2F0LnJvb3QuXy5vcHQudXVpZCB8fCBHdW4udGV4dC5yYW5kb20pKCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vYXMuZGF0YSA9IG9ial9wdXQoe30sIGFzLmd1bi5fLmdldCwgYXMuZGF0YSk7XHJcblx0XHRcdFx0XHRhcy5zb3VsID0gYXQuc291bCB8fCBjYXQuc291bCB8fCAob3B0LnV1aWQgfHwgY2F0LnJvb3QuXy5vcHQudXVpZCB8fCBHdW4udGV4dC5yYW5kb20pKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGFzLnJlZi5wdXQoYXMuZGF0YSwgYXMuc291bCwgYXMpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIG9iaiA9IEd1bi5vYmosIG9ial9pcyA9IG9iai5pcywgb2JqX3B1dCA9IG9iai5wdXQsIG9ial9tYXAgPSBvYmoubWFwO1xyXG5cdFx0dmFyIHUsIGVtcHR5ID0ge30sIG5vb3AgPSBmdW5jdGlvbigpe30sIGlpZmUgPSBmdW5jdGlvbihmbixhcyl7Zm4uY2FsbChhc3x8ZW1wdHkpfTtcclxuXHR9KShyZXF1aXJlLCAnLi9wdXQnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9yb290Jyk7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IEd1bjtcclxuXHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdGZ1bmN0aW9uIG1ldGEodixmKXtcclxuXHRcdFx0XHRpZihvYmpfaGFzKEd1bi5fXy5fLCBmKSl7IHJldHVybiB9XHJcblx0XHRcdFx0b2JqX3B1dCh0aGlzLl8sIGYsIHYpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcCh2YWx1ZSwgZmllbGQpe1xyXG5cdFx0XHRcdGlmKEd1bi5fLm5vZGUgPT09IGZpZWxkKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgbm9kZSA9IHRoaXMubm9kZSwgdmVydGV4ID0gdGhpcy52ZXJ0ZXgsIHVuaW9uID0gdGhpcy51bmlvbiwgbWFjaGluZSA9IHRoaXMubWFjaGluZTtcclxuXHRcdFx0XHR2YXIgaXMgPSBzdGF0ZV9pcyhub2RlLCBmaWVsZCksIGNzID0gc3RhdGVfaXModmVydGV4LCBmaWVsZCk7XHJcblx0XHRcdFx0aWYodSA9PT0gaXMgfHwgdSA9PT0gY3MpeyByZXR1cm4gdHJ1ZSB9IC8vIGl0IGlzIHRydWUgdGhhdCB0aGlzIGlzIGFuIGludmFsaWQgSEFNIGNvbXBhcmlzb24uXHJcblx0XHRcdFx0dmFyIGl2ID0gdmFsdWUsIGN2ID0gdmVydGV4W2ZpZWxkXTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cdFx0XHRcdC8vIFRPRE86IEJVRyEgTmVlZCB0byBjb21wYXJlIHJlbGF0aW9uIHRvIG5vdCByZWxhdGlvbiwgYW5kIGNob29zZSB0aGUgcmVsYXRpb24gaWYgdGhlcmUgaXMgYSBzdGF0ZSBjb25mbGljdC5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cdFx0XHRcdGlmKCF2YWxfaXMoaXYpICYmIHUgIT09IGl2KXsgcmV0dXJuIHRydWUgfSAvLyBVbmRlZmluZWQgaXMgb2theSBzaW5jZSBhIHZhbHVlIG1pZ2h0IG5vdCBleGlzdCBvbiBib3RoIG5vZGVzLiAvLyBpdCBpcyB0cnVlIHRoYXQgdGhpcyBpcyBhbiBpbnZhbGlkIEhBTSBjb21wYXJpc29uLlxyXG5cdFx0XHRcdGlmKCF2YWxfaXMoY3YpICYmIHUgIT09IGN2KXsgcmV0dXJuIHRydWUgfSAgLy8gVW5kZWZpbmVkIGlzIG9rYXkgc2luY2UgYSB2YWx1ZSBtaWdodCBub3QgZXhpc3Qgb24gYm90aCBub2Rlcy4gLy8gaXQgaXMgdHJ1ZSB0aGF0IHRoaXMgaXMgYW4gaW52YWxpZCBIQU0gY29tcGFyaXNvbi5cclxuXHRcdFx0XHR2YXIgSEFNID0gR3VuLkhBTShtYWNoaW5lLCBpcywgY3MsIGl2LCBjdik7XHJcblx0XHRcdFx0aWYoSEFNLmVycil7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIi4hSFlQT1RIRVRJQ0FMIEFNTkVTSUEgTUFDSElORSBFUlIhLlwiLCBmaWVsZCwgSEFNLmVycik7IC8vIHRoaXMgZXJyb3Igc2hvdWxkIG5ldmVyIGhhcHBlbi5cclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoSEFNLnN0YXRlIHx8IEhBTS5oaXN0b3JpY2FsIHx8IEhBTS5jdXJyZW50KXsgLy8gVE9ETzogQlVHISBOb3QgaW1wbGVtZW50ZWQuXHJcblx0XHRcdFx0XHQvL29wdC5sb3dlcih2ZXJ0ZXgsIHtmaWVsZDogZmllbGQsIHZhbHVlOiB2YWx1ZSwgc3RhdGU6IGlzfSk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKEhBTS5pbmNvbWluZyl7XHJcblx0XHRcdFx0XHR1bmlvbltmaWVsZF0gPSB2YWx1ZTtcclxuXHRcdFx0XHRcdHN0YXRlX2lmeSh1bmlvbiwgZmllbGQsIGlzKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoSEFNLmRlZmVyKXsgLy8gVE9ETzogQlVHISBOb3QgaW1wbGVtZW50ZWQuXHJcblx0XHRcdFx0XHR1bmlvbltmaWVsZF0gPSB2YWx1ZTsgLy8gV1JPTkchIEJVRyEgTmVlZCB0byBpbXBsZW1lbnQgY29ycmVjdCBhbGdvcml0aG0uXHJcblx0XHRcdFx0XHRzdGF0ZV9pZnkodW5pb24sIGZpZWxkLCBpcyk7IC8vIFdST05HISBCVUchIE5lZWQgdG8gaW1wbGVtZW50IGNvcnJlY3QgYWxnb3JpdGhtLlxyXG5cdFx0XHRcdFx0Ly8gZmlsbGVyIGFsZ29yaXRobSBmb3Igbm93LlxyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0Lyp1cHBlci53YWl0ID0gdHJ1ZTtcclxuXHRcdFx0XHRcdG9wdC51cHBlci5jYWxsKHN0YXRlLCB2ZXJ0ZXgsIGZpZWxkLCBpbmNvbWluZywgY3R4LmluY29taW5nLnN0YXRlKTsgLy8gc2lnbmFscyB0aGF0IHRoZXJlIGFyZSBzdGlsbCBmdXR1cmUgbW9kaWZpY2F0aW9ucy5cclxuXHRcdFx0XHRcdEd1bi5zY2hlZHVsZShjdHguaW5jb21pbmcuc3RhdGUsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRcdHVwZGF0ZShpbmNvbWluZywgZmllbGQpO1xyXG5cdFx0XHRcdFx0XHRpZihjdHguaW5jb21pbmcuc3RhdGUgPT09IHVwcGVyLm1heCl7ICh1cHBlci5sYXN0IHx8IGZ1bmN0aW9uKCl7fSkoKSB9XHJcblx0XHRcdFx0XHR9LCBndW4uX18ub3B0LnN0YXRlKTsqL1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRHdW4uSEFNLnVuaW9uID0gZnVuY3Rpb24odmVydGV4LCBub2RlLCBvcHQpe1xyXG5cdFx0XHRcdGlmKCFub2RlIHx8ICFub2RlLl8peyByZXR1cm4gfVxyXG5cdFx0XHRcdHZlcnRleCA9IHZlcnRleCB8fCBHdW4ubm9kZS5zb3VsLmlmeSh7Xzp7Jz4nOnt9fX0sIEd1bi5ub2RlLnNvdWwobm9kZSkpO1xyXG5cdFx0XHRcdGlmKCF2ZXJ0ZXggfHwgIXZlcnRleC5fKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRvcHQgPSBudW1faXMob3B0KT8ge21hY2hpbmU6IG9wdH0gOiB7bWFjaGluZTogR3VuLnN0YXRlKCl9O1xyXG5cdFx0XHRcdG9wdC51bmlvbiA9IHZlcnRleCB8fCBHdW4ub2JqLmNvcHkodmVydGV4KTsgLy8gVE9ETzogUEVSRiEgVGhpcyB3aWxsIHNsb3cgdGhpbmdzIGRvd24hXHJcblx0XHRcdFx0Ly8gVE9ETzogUEVSRiEgQmlnZ2VzdCBzbG93ZG93biAoYWZ0ZXIgMW9jYWxTdG9yYWdlKSBpcyB0aGUgYWJvdmUgbGluZS4gRml4ISBGaXghXHJcblx0XHRcdFx0b3B0LnZlcnRleCA9IHZlcnRleDtcclxuXHRcdFx0XHRvcHQubm9kZSA9IG5vZGU7XHJcblx0XHRcdFx0Ly9vYmpfbWFwKG5vZGUuXywgbWV0YSwgb3B0LnVuaW9uKTsgLy8gVE9ETzogUmV2aWV3IGF0IHNvbWUgcG9pbnQ/XHJcblx0XHRcdFx0aWYob2JqX21hcChub2RlLCBtYXAsIG9wdCkpeyAvLyBpZiB0aGlzIHJldHVybnMgdHJ1ZSB0aGVuIHNvbWV0aGluZyB3YXMgaW52YWxpZC5cclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIG9wdC51bmlvbjtcclxuXHRcdFx0fVxyXG5cdFx0XHRHdW4uSEFNLmRlbHRhID0gZnVuY3Rpb24odmVydGV4LCBub2RlLCBvcHQpe1xyXG5cdFx0XHRcdG9wdCA9IG51bV9pcyhvcHQpPyB7bWFjaGluZTogb3B0fSA6IHttYWNoaW5lOiBHdW4uc3RhdGUoKX07XHJcblx0XHRcdFx0aWYoIXZlcnRleCl7IHJldHVybiBHdW4ub2JqLmNvcHkobm9kZSkgfVxyXG5cdFx0XHRcdG9wdC5zb3VsID0gR3VuLm5vZGUuc291bChvcHQudmVydGV4ID0gdmVydGV4KTtcclxuXHRcdFx0XHRpZighb3B0LnNvdWwpeyByZXR1cm4gfVxyXG5cdFx0XHRcdG9wdC5kZWx0YSA9IEd1bi5ub2RlLnNvdWwuaWZ5KHt9LCBvcHQuc291bCk7XHJcblx0XHRcdFx0b2JqX21hcChvcHQubm9kZSA9IG5vZGUsIGRpZmYsIG9wdCk7XHJcblx0XHRcdFx0cmV0dXJuIG9wdC5kZWx0YTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBkaWZmKHZhbHVlLCBmaWVsZCl7IHZhciBvcHQgPSB0aGlzO1xyXG5cdFx0XHRcdGlmKEd1bi5fLm5vZGUgPT09IGZpZWxkKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRpZighdmFsX2lzKHZhbHVlKSl7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIG5vZGUgPSBvcHQubm9kZSwgdmVydGV4ID0gb3B0LnZlcnRleCwgaXMgPSBzdGF0ZV9pcyhub2RlLCBmaWVsZCwgdHJ1ZSksIGNzID0gc3RhdGVfaXModmVydGV4LCBmaWVsZCwgdHJ1ZSksIGRlbHRhID0gb3B0LmRlbHRhO1xyXG5cdFx0XHRcdHZhciBIQU0gPSBHdW4uSEFNKG9wdC5tYWNoaW5lLCBpcywgY3MsIHZhbHVlLCB2ZXJ0ZXhbZmllbGRdKTtcclxuXHJcblxyXG5cclxuXHRcdFx0XHQvLyBUT0RPOiBCVUchISEhIFdIQVQgQUJPVVQgREVGRVJSRUQhPz8/XHJcblx0XHRcdFx0XHJcblxyXG5cclxuXHRcdFx0XHRpZihIQU0uaW5jb21pbmcpe1xyXG5cdFx0XHRcdFx0ZGVsdGFbZmllbGRdID0gdmFsdWU7XHJcblx0XHRcdFx0XHRzdGF0ZV9pZnkoZGVsdGEsIGZpZWxkLCBpcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdEd1bi5IQU0uc3ludGggPSBmdW5jdGlvbihhdCwgZXYsIGFzKXsgdmFyIGd1biA9IHRoaXMuYXMgfHwgYXM7XHJcblx0XHRcdFx0dmFyIGNhdCA9IGd1bi5fLCByb290ID0gY2F0LnJvb3QuXywgcHV0ID0ge30sIHRtcDtcclxuXHRcdFx0XHRpZighYXQucHV0KXtcclxuXHRcdFx0XHRcdC8vaWYob2JqX2hhcyhjYXQsICdwdXQnKSl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRpZihjYXQucHV0ICE9PSB1KXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdGNhdC5vbignaW4nLCB7XHJcblx0XHRcdFx0XHQvL3Jvb3QuYWNrKGF0WydAJ10sIHtcclxuXHRcdFx0XHRcdFx0Z2V0OiBjYXQuZ2V0LFxyXG5cdFx0XHRcdFx0XHRwdXQ6IGNhdC5wdXQgPSB1LFxyXG5cdFx0XHRcdFx0XHRndW46IGd1bixcclxuXHRcdFx0XHRcdFx0dmlhOiBhdFxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gVE9ETzogUEVSRiEgSGF2ZSBvcHRpb25zIHRvIGRldGVybWluZSBpZiB0aGlzIGRhdGEgc2hvdWxkIGV2ZW4gYmUgaW4gbWVtb3J5IG9uIHRoaXMgcGVlciFcclxuXHRcdFx0XHRvYmpfbWFwKGF0LnB1dCwgZnVuY3Rpb24obm9kZSwgc291bCl7IHZhciBncmFwaCA9IHRoaXMuZ3JhcGg7XHJcblx0XHRcdFx0XHRwdXRbc291bF0gPSBHdW4uSEFNLmRlbHRhKGdyYXBoW3NvdWxdLCBub2RlLCB7Z3JhcGg6IGdyYXBofSk7IC8vIFRPRE86IFBFUkYhIFNFRSBJRiBXRSBDQU4gT1BUSU1JWkUgVEhJUyBCWSBNRVJHSU5HIFVOSU9OIElOVE8gREVMVEEhXHJcblx0XHRcdFx0XHRncmFwaFtzb3VsXSA9IEd1bi5IQU0udW5pb24oZ3JhcGhbc291bF0sIG5vZGUpIHx8IGdyYXBoW3NvdWxdO1xyXG5cdFx0XHRcdH0sIHJvb3QpO1xyXG5cdFx0XHRcdGlmKGF0Lmd1biAhPT0gcm9vdC5ndW4pe1xyXG5cdFx0XHRcdFx0cHV0ID0gYXQucHV0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBUT0RPOiBQRVJGISBIYXZlIG9wdGlvbnMgdG8gZGV0ZXJtaW5lIGlmIHRoaXMgZGF0YSBzaG91bGQgZXZlbiBiZSBpbiBtZW1vcnkgb24gdGhpcyBwZWVyIVxyXG5cdFx0XHRcdG9ial9tYXAocHV0LCBmdW5jdGlvbihub2RlLCBzb3VsKXtcclxuXHRcdFx0XHRcdHZhciByb290ID0gdGhpcywgbmV4dCA9IHJvb3QubmV4dCB8fCAocm9vdC5uZXh0ID0ge30pLCBndW4gPSBuZXh0W3NvdWxdIHx8IChuZXh0W3NvdWxdID0gcm9vdC5ndW4uZ2V0KHNvdWwpKSwgY29hdCA9IChndW4uXyk7XHJcblx0XHRcdFx0XHRjb2F0LnB1dCA9IHJvb3QuZ3JhcGhbc291bF07IC8vIFRPRE86IEJVRyEgQ2xvbmUhXHJcblx0XHRcdFx0XHRpZihjYXQuZmllbGQgJiYgIW9ial9oYXMobm9kZSwgY2F0LmZpZWxkKSl7XHJcblx0XHRcdFx0XHRcdChhdCA9IG9ial90byhhdCwge30pKS5wdXQgPSB1O1xyXG5cdFx0XHRcdFx0XHRHdW4uSEFNLnN5bnRoKGF0LCBldiwgY2F0Lmd1bik7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNvYXQub24oJ2luJywge1xyXG5cdFx0XHRcdFx0XHRwdXQ6IG5vZGUsXHJcblx0XHRcdFx0XHRcdGdldDogc291bCxcclxuXHRcdFx0XHRcdFx0Z3VuOiBndW4sXHJcblx0XHRcdFx0XHRcdHZpYTogYXRcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0sIHJvb3QpO1xyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cclxuXHRcdHZhciBUeXBlID0gR3VuO1xyXG5cdFx0dmFyIG51bSA9IFR5cGUubnVtLCBudW1faXMgPSBudW0uaXM7XHJcblx0XHR2YXIgb2JqID0gVHlwZS5vYmosIG9ial9oYXMgPSBvYmouaGFzLCBvYmpfcHV0ID0gb2JqLnB1dCwgb2JqX3RvID0gb2JqLnRvLCBvYmpfbWFwID0gb2JqLm1hcDtcclxuXHRcdHZhciBub2RlID0gR3VuLm5vZGUsIG5vZGVfc291bCA9IG5vZGUuc291bCwgbm9kZV9pcyA9IG5vZGUuaXMsIG5vZGVfaWZ5ID0gbm9kZS5pZnk7XHJcblx0XHR2YXIgc3RhdGUgPSBHdW4uc3RhdGUsIHN0YXRlX2lzID0gc3RhdGUuaXMsIHN0YXRlX2lmeSA9IHN0YXRlLmlmeTtcclxuXHRcdHZhciB2YWwgPSBHdW4udmFsLCB2YWxfaXMgPSB2YWwuaXMsIHJlbF9pcyA9IHZhbC5yZWwuaXM7XHJcblx0XHR2YXIgdTtcclxuXHR9KShyZXF1aXJlLCAnLi9pbmRleCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vcm9vdCcpO1xyXG5cdFx0cmVxdWlyZSgnLi9pbmRleCcpOyAvLyBUT0RPOiBDTEVBTiBVUCEgTUVSR0UgSU5UTyBST09UIVxyXG5cdFx0cmVxdWlyZSgnLi9vcHQnKTtcclxuXHRcdHJlcXVpcmUoJy4vY2hhaW4nKTtcclxuXHRcdHJlcXVpcmUoJy4vYmFjaycpO1xyXG5cdFx0cmVxdWlyZSgnLi9wdXQnKTtcclxuXHRcdHJlcXVpcmUoJy4vZ2V0Jyk7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IEd1bjtcclxuXHR9KShyZXF1aXJlLCAnLi9jb3JlJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9jb3JlJyk7XHJcblx0XHR2YXIgb2JqID0gR3VuLm9iaiwgb2JqX2lzID0gb2JqLmlzLCBvYmpfcHV0ID0gb2JqLnB1dCwgb2JqX21hcCA9IG9iai5tYXAsIG9ial9lbXB0eSA9IG9iai5lbXB0eTtcclxuXHRcdHZhciBudW0gPSBHdW4ubnVtLCBudW1faXMgPSBudW0uaXM7XHJcblx0XHR2YXIgX3NvdWwgPSBHdW4udmFsLnJlbC5fLCBfZmllbGQgPSAnLic7XHJcblxyXG5cclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0R3VuLmNoYWluLmtleSA9IGZ1bmN0aW9uKGluZGV4LCBjYiwgb3B0KXtcclxuXHRcdFx0XHRpZighaW5kZXgpe1xyXG5cdFx0XHRcdFx0aWYoY2Ipe1xyXG5cdFx0XHRcdFx0XHRjYi5jYWxsKHRoaXMsIHtlcnI6IEd1bi5sb2coJ05vIGtleSEnKX0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHZhciBndW4gPSB0aGlzO1xyXG5cdFx0XHRcdGlmKHR5cGVvZiBvcHQgPT09ICdzdHJpbmcnKXtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiUGxlYXNlIHJlcG9ydCB0aGlzIGFzIGFuIGlzc3VlISBrZXkub3B0LnN0cmluZ1wiKTtcclxuXHRcdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGd1biA9PT0gZ3VuLl8ucm9vdCl7aWYoY2Ipe2NiKHtlcnI6IEd1bi5sb2coXCJDYW4ndCBkbyB0aGF0IG9uIHJvb3QgaW5zdGFuY2UuXCIpfSl9O3JldHVybiBndW59XHJcblx0XHRcdFx0b3B0ID0gb3B0IHx8IHt9O1xyXG5cdFx0XHRcdG9wdC5rZXkgPSBpbmRleDtcclxuXHRcdFx0XHRvcHQuYW55ID0gY2IgfHwgZnVuY3Rpb24oKXt9O1xyXG5cdFx0XHRcdG9wdC5yZWYgPSBndW4uYmFjaygtMSkuZ2V0KG9wdC5rZXkpO1xyXG5cdFx0XHRcdG9wdC5ndW4gPSBvcHQuZ3VuIHx8IGd1bjtcclxuXHRcdFx0XHRndW4ub24oa2V5LCB7YXM6IG9wdH0pO1xyXG5cdFx0XHRcdGlmKCFvcHQuZGF0YSl7XHJcblx0XHRcdFx0XHRvcHQucmVzID0gR3VuLm9uLnN0dW4ob3B0LnJlZik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24ga2V5KGF0LCBldil7IHZhciBvcHQgPSB0aGlzO1xyXG5cdFx0XHRcdGV2Lm9mZigpO1xyXG5cdFx0XHRcdG9wdC5zb3VsID0gR3VuLm5vZGUuc291bChhdC5wdXQpO1xyXG5cdFx0XHRcdGlmKCFvcHQuc291bCB8fCBvcHQua2V5ID09PSBvcHQuc291bCl7IHJldHVybiBvcHQuZGF0YSA9IHt9IH1cclxuXHRcdFx0XHRvcHQuZGF0YSA9IG9ial9wdXQoe30sIGtleWVkLl8sIEd1bi5ub2RlLmlmeShvYmpfcHV0KHt9LCBvcHQuc291bCwgR3VuLnZhbC5yZWwuaWZ5KG9wdC5zb3VsKSksICcjJytvcHQua2V5KycjJykpO1xyXG5cdFx0XHRcdChvcHQucmVzfHxpZmZlKShmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0b3B0LnJlZi5wdXQob3B0LmRhdGEsIG9wdC5hbnksIHtzb3VsOiBvcHQua2V5LCBrZXk6IG9wdC5rZXl9KTtcdFx0XHRcdFxyXG5cdFx0XHRcdH0sb3B0KTtcclxuXHRcdFx0XHRpZihvcHQucmVzKXtcclxuXHRcdFx0XHRcdG9wdC5yZXMoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gaWZmZShmbixhcyl7Zm4uY2FsbChhc3x8e30pfVxyXG5cdFx0XHRmdW5jdGlvbiBrZXllZChmKXtcclxuXHRcdFx0XHRpZighZiB8fCAhKCcjJyA9PT0gZlswXSAmJiAnIycgPT09IGZbZi5sZW5ndGgtMV0pKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgcyA9IGYuc2xpY2UoMSwtMSk7XHJcblx0XHRcdFx0aWYoIXMpeyByZXR1cm4gfVxyXG5cdFx0XHRcdHJldHVybiBzO1xyXG5cdFx0XHR9XHJcblx0XHRcdGtleWVkLl8gPSAnIyMnO1xyXG5cdFx0XHRHdW4ub24oJ25leHQnLCBmdW5jdGlvbihhdCl7XHJcblx0XHRcdFx0dmFyIGd1biA9IGF0Lmd1bjtcclxuXHRcdFx0XHRpZihndW4uYmFjaygtMSkgIT09IGF0LmJhY2speyByZXR1cm4gfVxyXG5cdFx0XHRcdGd1bi5vbignaW4nLCBwc2V1ZG8sIGd1bi5fKTtcclxuXHRcdFx0XHRndW4ub24oJ291dCcsIG5vcm1hbGl6ZSwgZ3VuLl8pO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0ZnVuY3Rpb24gbm9ybWFsaXplKGF0KXsgdmFyIGNhdCA9IHRoaXM7XHJcblx0XHRcdFx0aWYoIWF0LnB1dCl7XHJcblx0XHRcdFx0XHRpZihhdC5nZXQpe1xyXG5cdFx0XHRcdFx0XHRzZWFyY2guY2FsbChhdC5ndW4/IGF0Lmd1bi5fIDogY2F0LCBhdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGF0Lm9wdCAmJiBhdC5vcHQua2V5KXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgcHV0ID0gYXQucHV0LCBncmFwaCA9IGNhdC5ndW4uYmFjaygtMSkuXy5ncmFwaDtcclxuXHRcdFx0XHRHdW4uZ3JhcGguaXMocHV0LCBmdW5jdGlvbihub2RlLCBzb3VsKXtcclxuXHRcdFx0XHRcdGlmKCFHdW4ubm9kZS5pcyhncmFwaFsnIycrc291bCsnIyddLCBmdW5jdGlvbiBlYWNoKHJlbCxpZCl7XHJcblx0XHRcdFx0XHRcdGlmKGlkICE9PSBHdW4udmFsLnJlbC5pcyhyZWwpKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdFx0aWYocmVsID0gZ3JhcGhbJyMnK2lkKycjJ10pe1xyXG5cdFx0XHRcdFx0XHRcdEd1bi5ub2RlLmlzKHJlbCwgZWFjaCk7IC8vIGNvcnJlY3QgcGFyYW1zP1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRHdW4ubm9kZS5zb3VsLmlmeShyZWwgPSBwdXRbaWRdID0gR3VuLm9iai5jb3B5KG5vZGUpLCBpZCk7XHJcblx0XHRcdFx0XHR9KSl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRHdW4ub2JqLmRlbChwdXQsIHNvdWwpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIHNlYXJjaChhdCl7IHZhciBjYXQgPSB0aGlzO1xyXG5cdFx0XHRcdHZhciB0bXA7XHJcblx0XHRcdFx0aWYoIUd1bi5vYmouaXModG1wID0gYXQuZ2V0KSl7IHJldHVybiB9XHJcblx0XHRcdFx0aWYoIUd1bi5vYmouaGFzKHRtcCwgJyMnKSl7IHJldHVybiB9XHJcblx0XHRcdFx0aWYoKHRtcCA9IGF0LmdldCkgJiYgKG51bGwgPT09IHRtcFsnLiddKSl7XHJcblx0XHRcdFx0XHR0bXBbJy4nXSA9ICcjIyc7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKCh0bXAgPSBhdC5nZXQpICYmIEd1bi5vYmouaGFzKHRtcCwgJy4nKSl7XHJcblx0XHRcdFx0XHRpZih0bXBbJyMnXSl7XHJcblx0XHRcdFx0XHRcdGNhdCA9IGNhdC5yb290Lmd1bi5nZXQodG1wWycjJ10pLl87XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR0bXAgPSBhdFsnIyddO1xyXG5cdFx0XHRcdFx0YXRbJyMnXSA9IEd1bi5vbi5hc2socHJveHkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR2YXIgdHJpZWQgPSB7fTtcclxuXHRcdFx0XHRmdW5jdGlvbiBwcm94eShhY2ssIGV2KXtcclxuXHRcdFx0XHRcdHZhciBwdXQgPSBhY2sucHV0LCBsZXggPSBhdC5nZXQ7XHJcblx0XHRcdFx0XHRpZighY2F0LnBzZXVkbyB8fCBhY2sudmlhKXsgLy8gVE9ETzogQlVHISBNRU1PUlkgUEVSRiEgV2hhdCBhYm91dCB1bnN1YnNjcmliaW5nP1xyXG5cdFx0XHRcdFx0XHQvL2V2Lm9mZigpO1xyXG5cdFx0XHRcdFx0XHQvL2Fjay52aWEgPSBhY2sudmlhIHx8IHt9O1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gR3VuLm9uLmFjayh0bXAsIGFjayk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZihhY2sucHV0KXtcclxuXHRcdFx0XHRcdFx0aWYoIWxleFsnLiddKXtcclxuXHRcdFx0XHRcdFx0XHRldi5vZmYoKTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gR3VuLm9uLmFjayh0bXAsIGFjayk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYob2JqX2hhcyhhY2sucHV0W2xleFsnIyddXSwgbGV4WycuJ10pKXtcclxuXHRcdFx0XHRcdFx0XHRldi5vZmYoKTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gR3VuLm9uLmFjayh0bXAsIGFjayk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdEd1bi5vYmoubWFwKGNhdC5zZWVuLCBmdW5jdGlvbihyZWYsaWQpeyAvLyBUT0RPOiBCVUchIEluLW1lbW9yeSB2ZXJzdXMgZnV0dXJlP1xyXG5cdFx0XHRcdFx0XHRpZih0cmllZFtpZF0pe1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBHdW4ub24uYWNrKHRtcCwgYWNrKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR0cmllZFtpZF0gPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRyZWYub24oJ291dCcsIHtcclxuXHRcdFx0XHRcdFx0XHRndW46IHJlZixcclxuXHRcdFx0XHRcdFx0XHRnZXQ6IGlkID0geycjJzogaWQsICcuJzogYXQuZ2V0WycuJ119LFxyXG5cdFx0XHRcdFx0XHRcdCcjJzogR3VuLm9uLmFzayhwcm94eSlcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gcHNldWRvKGF0LCBldil7IHZhciBjYXQgPSB0aGlzO1xyXG5cdFx0XHRcdC8vIFRPRE86IEJVRyEgUHNldWRvIGNhbid0IGhhbmRsZSBwbHVyYWxzIT9cclxuXHRcdFx0XHRpZihjYXQucHNldWRvKXtcclxuXHRcdFx0XHRcdC8vZXYuc3R1bigpO3JldHVybjtcclxuXHRcdFx0XHRcdGlmKGNhdC5wc2V1ZG8gPT09IGF0LnB1dCl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRldi5zdHVuKCk7XHJcblx0XHRcdFx0XHRjYXQuY2hhbmdlID0gY2F0LmNoYW5nZWQgfHwgY2F0LnBzZXVkbztcclxuXHRcdFx0XHRcdGNhdC5vbignaW4nLCBHdW4ub2JqLnRvKGF0LCB7cHV0OiBjYXQucHV0ID0gY2F0LnBzZXVkb30pKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoIWF0LnB1dCl7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIHJlbCA9IEd1bi52YWwucmVsLmlzKGF0LnB1dFtrZXllZC5fXSk7XHJcblx0XHRcdFx0aWYoIXJlbCl7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIHNvdWwgPSBHdW4ubm9kZS5zb3VsKGF0LnB1dCksIHJlc3VtZSA9IGV2LnN0dW4ocmVzdW1lKSwgcm9vdCA9IGNhdC5ndW4uYmFjaygtMSksIHNlZW4gPSBjYXQuc2VlbiA9IHt9O1xyXG5cdFx0XHRcdGNhdC5wc2V1ZG8gPSBjYXQucHV0ID0gR3VuLnN0YXRlLmlmeShHdW4ubm9kZS5pZnkoe30sIHNvdWwpKTtcclxuXHRcdFx0XHRyb290LmdldChyZWwpLm9uKGVhY2gsIHtjaGFuZ2U6IHRydWV9KTtcclxuXHRcdFx0XHRmdW5jdGlvbiBlYWNoKGNoYW5nZSl7XHJcblx0XHRcdFx0XHRHdW4ubm9kZS5pcyhjaGFuZ2UsIG1hcCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZ1bmN0aW9uIG1hcChyZWwsIHNvdWwpe1xyXG5cdFx0XHRcdFx0aWYoc291bCAhPT0gR3VuLnZhbC5yZWwuaXMocmVsKSl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRpZihzZWVuW3NvdWxdKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdHNlZW5bc291bF0gPSByb290LmdldChzb3VsKS5vbihvbiwgdHJ1ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZ1bmN0aW9uIG9uKHB1dCl7XHJcblx0XHRcdFx0XHRpZighcHV0KXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdGNhdC5wc2V1ZG8gPSBHdW4uSEFNLnVuaW9uKGNhdC5wc2V1ZG8sIHB1dCkgfHwgY2F0LnBzZXVkbztcclxuXHRcdFx0XHRcdGNhdC5jaGFuZ2UgPSBjYXQuY2hhbmdlZCA9IHB1dDtcclxuXHRcdFx0XHRcdGNhdC5wdXQgPSBjYXQucHNldWRvO1xyXG5cdFx0XHRcdFx0cmVzdW1lKHtcclxuXHRcdFx0XHRcdFx0Z3VuOiBjYXQuZ3VuLFxyXG5cdFx0XHRcdFx0XHRwdXQ6IGNhdC5wc2V1ZG8sXHJcblx0XHRcdFx0XHRcdGdldDogc291bFxyXG5cdFx0XHRcdFx0XHQvL3ZpYTogdGhpcy5hdFxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBvYmogPSBHdW4ub2JqLCBvYmpfaGFzID0gb2JqLmhhcztcclxuXHRcdH0oKSk7XHJcblxyXG5cdH0pKHJlcXVpcmUsICcuL2tleScpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vY29yZScpO1xyXG5cdFx0R3VuLmNoYWluLnBhdGggPSBmdW5jdGlvbihmaWVsZCwgY2IsIG9wdCl7XHJcblx0XHRcdHZhciBiYWNrID0gdGhpcywgZ3VuID0gYmFjaywgdG1wO1xyXG5cdFx0XHRvcHQgPSBvcHQgfHwge307IG9wdC5wYXRoID0gdHJ1ZTtcclxuXHRcdFx0aWYoZ3VuID09PSBndW4uXy5yb290KXtpZihjYil7Y2Ioe2VycjogR3VuLmxvZyhcIkNhbid0IGRvIHRoYXQgb24gcm9vdCBpbnN0YW5jZS5cIil9KX1yZXR1cm4gZ3VufVxyXG5cdFx0XHRpZih0eXBlb2YgZmllbGQgPT09ICdzdHJpbmcnKXtcclxuXHRcdFx0XHR0bXAgPSBmaWVsZC5zcGxpdChvcHQuc3BsaXQgfHwgJy4nKTtcclxuXHRcdFx0XHRpZigxID09PSB0bXAubGVuZ3RoKXtcclxuXHRcdFx0XHRcdGd1biA9IGJhY2suZ2V0KGZpZWxkLCBjYiwgb3B0KTtcclxuXHRcdFx0XHRcdGd1bi5fLm9wdCA9IG9wdDtcclxuXHRcdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZpZWxkID0gdG1wO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGZpZWxkIGluc3RhbmNlb2YgQXJyYXkpe1xyXG5cdFx0XHRcdGlmKGZpZWxkLmxlbmd0aCA+IDEpe1xyXG5cdFx0XHRcdFx0Z3VuID0gYmFjaztcclxuXHRcdFx0XHRcdHZhciBpID0gMCwgbCA9IGZpZWxkLmxlbmd0aDtcclxuXHRcdFx0XHRcdGZvcihpOyBpIDwgbDsgaSsrKXtcclxuXHRcdFx0XHRcdFx0Z3VuID0gZ3VuLmdldChmaWVsZFtpXSwgKGkrMSA9PT0gbCk/IGNiIDogbnVsbCwgb3B0KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vZ3VuLmJhY2sgPSBiYWNrOyAvLyBUT0RPOiBBUEkgY2hhbmdlIVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRndW4gPSBiYWNrLmdldChmaWVsZFswXSwgY2IsIG9wdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGd1bi5fLm9wdCA9IG9wdDtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCFmaWVsZCAmJiAwICE9IGZpZWxkKXtcclxuXHRcdFx0XHRyZXR1cm4gYmFjaztcclxuXHRcdFx0fVxyXG5cdFx0XHRndW4gPSBiYWNrLmdldCgnJytmaWVsZCwgY2IsIG9wdCk7XHJcblx0XHRcdGd1bi5fLm9wdCA9IG9wdDtcclxuXHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdH1cclxuXHR9KShyZXF1aXJlLCAnLi9wYXRoJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9jb3JlJyk7XHJcblx0XHRHdW4uY2hhaW4ub24gPSBmdW5jdGlvbih0YWcsIGFyZywgZWFzLCBhcyl7XHJcblx0XHRcdHZhciBndW4gPSB0aGlzLCBhdCA9IGd1bi5fLCB0bXAsIGFjdCwgb2ZmO1xyXG5cdFx0XHRpZih0eXBlb2YgdGFnID09PSAnc3RyaW5nJyl7XHJcblx0XHRcdFx0aWYoIWFyZyl7IHJldHVybiBhdC5vbih0YWcpIH1cclxuXHRcdFx0XHRhY3QgPSBhdC5vbih0YWcsIGFyZywgZWFzIHx8IGF0LCBhcyk7XHJcblx0XHRcdFx0aWYoZWFzICYmIGVhcy5ndW4pe1xyXG5cdFx0XHRcdFx0KGVhcy5zdWJzIHx8IChlYXMuc3VicyA9IFtdKSkucHVzaChhY3QpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRvZmYgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGlmIChhY3QgJiYgYWN0Lm9mZikgYWN0Lm9mZigpO1xyXG5cdFx0XHRcdFx0b2ZmLm9mZigpO1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0b2ZmLm9mZiA9IGd1bi5vZmYuYmluZChndW4pIHx8IG5vb3A7XHJcblx0XHRcdFx0Z3VuLm9mZiA9IG9mZjtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBvcHQgPSBhcmc7XHJcblx0XHRcdG9wdCA9ICh0cnVlID09PSBvcHQpPyB7Y2hhbmdlOiB0cnVlfSA6IG9wdCB8fCB7fTtcclxuXHRcdFx0b3B0Lm9rID0gdGFnO1xyXG5cdFx0XHRvcHQubGFzdCA9IHt9O1xyXG5cdFx0XHRndW4uZ2V0KG9rLCBvcHQpOyAvLyBUT0RPOiBQRVJGISBFdmVudCBsaXN0ZW5lciBsZWFrISEhPz8/P1xyXG5cdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIG9rKGF0LCBldil7IHZhciBvcHQgPSB0aGlzO1xyXG5cdFx0XHR2YXIgZ3VuID0gYXQuZ3VuLCBjYXQgPSBndW4uXywgZGF0YSA9IGNhdC5wdXQgfHwgYXQucHV0LCB0bXAgPSBvcHQubGFzdCwgaWQgPSBjYXQuaWQrYXQuZ2V0LCB0bXA7XHJcblx0XHRcdGlmKHUgPT09IGRhdGEpe1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihkYXRhICYmIGRhdGFbcmVsLl9dICYmICh0bXAgPSByZWwuaXMoZGF0YSkpKXtcclxuXHRcdFx0XHR0bXAgPSAoY2F0LnJvb3QuZ2V0KHRtcCkuXyk7XHJcblx0XHRcdFx0aWYodSA9PT0gdG1wLnB1dCl7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGRhdGEgPSB0bXAucHV0O1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKG9wdC5jaGFuZ2UpeyAvLyBUT0RPOiBCVUc/IE1vdmUgYWJvdmUgdGhlIHVuZGVmIGNoZWNrcz9cclxuXHRcdFx0XHRkYXRhID0gYXQucHV0O1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIERFRFVQTElDQVRFIC8vIFRPRE86IE5FRURTIFdPUkshIEJBRCBQUk9UT1RZUEVcclxuXHRcdFx0aWYodG1wLnB1dCA9PT0gZGF0YSAmJiB0bXAuZ2V0ID09PSBpZCAmJiAhR3VuLm5vZGUuc291bChkYXRhKSl7IHJldHVybiB9XHJcblx0XHRcdHRtcC5wdXQgPSBkYXRhO1xyXG5cdFx0XHR0bXAuZ2V0ID0gaWQ7XHJcblx0XHRcdC8vIERFRFVQTElDQVRFIC8vIFRPRE86IE5FRURTIFdPUkshIEJBRCBQUk9UT1RZUEVcclxuXHRcdFx0Y2F0Lmxhc3QgPSBkYXRhO1xyXG5cdFx0XHRpZihvcHQuYXMpe1xyXG5cdFx0XHRcdG9wdC5vay5jYWxsKG9wdC5hcywgYXQsIGV2KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRvcHQub2suY2FsbChndW4sIGRhdGEsIGF0LmdldCwgYXQsIGV2KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdEd1bi5jaGFpbi52YWwgPSBmdW5jdGlvbihjYiwgb3B0KXtcclxuXHRcdFx0dmFyIGd1biA9IHRoaXMsIGF0ID0gZ3VuLl8sIGRhdGEgPSBhdC5wdXQ7XHJcblx0XHRcdGlmKDAgPCBhdC5hY2sgJiYgdSAhPT0gZGF0YSl7XHJcblx0XHRcdFx0KGNiIHx8IG5vb3ApLmNhbGwoZ3VuLCBkYXRhLCBhdC5nZXQpO1xyXG5cdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY2Ipe1xyXG5cdFx0XHRcdChvcHQgPSBvcHQgfHwge30pLm9rID0gY2I7XHJcblx0XHRcdFx0b3B0LmNhdCA9IGF0O1xyXG5cdFx0XHRcdGd1bi5nZXQodmFsLCB7YXM6IG9wdH0pO1xyXG5cdFx0XHRcdG9wdC5hc3luYyA9IHRydWU7IC8vb3B0LmFzeW5jID0gYXQuc3R1bj8gMSA6IHRydWU7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0R3VuLmxvZy5vbmNlKFwidmFsb25jZVwiLCBcIkNoYWluYWJsZSB2YWwgaXMgZXhwZXJpbWVudGFsLCBpdHMgYmVoYXZpb3IgYW5kIEFQSSBtYXkgY2hhbmdlIG1vdmluZyBmb3J3YXJkLiBQbGVhc2UgcGxheSB3aXRoIGl0IGFuZCByZXBvcnQgYnVncyBhbmQgaWRlYXMgb24gaG93IHRvIGltcHJvdmUgaXQuXCIpO1xyXG5cdFx0XHRcdHZhciBjaGFpbiA9IGd1bi5jaGFpbigpO1xyXG5cdFx0XHRcdGNoYWluLl8udmFsID0gZ3VuLnZhbChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0Y2hhaW4uXy5vbignaW4nLCBndW4uXyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0cmV0dXJuIGNoYWluO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBndW47XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gdmFsKGF0LCBldiwgdG8pe1xyXG5cdFx0XHR2YXIgb3B0ID0gdGhpcy5hcywgY2F0ID0gb3B0LmNhdCwgZ3VuID0gYXQuZ3VuLCBjb2F0ID0gZ3VuLl8sIGRhdGEgPSBjb2F0LnB1dCB8fCBhdC5wdXQsIHRtcDtcclxuXHRcdFx0aWYodSA9PT0gZGF0YSl7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGRhdGEgJiYgZGF0YVtyZWwuX10gJiYgKHRtcCA9IHJlbC5pcyhkYXRhKSkpe1xyXG5cdFx0XHRcdHRtcCA9IChjYXQucm9vdC5nZXQodG1wKS5fKTtcclxuXHRcdFx0XHRpZih1ID09PSB0bXAucHV0KXtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZGF0YSA9IHRtcC5wdXQ7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoZXYud2FpdCl7IGNsZWFyVGltZW91dChldi53YWl0KSB9XHJcblx0XHRcdC8vaWYoIXRvICYmICghKDAgPCBjb2F0LmFjaykgfHwgKCh0cnVlID09PSBvcHQuYXN5bmMpICYmIDAgIT09IG9wdC53YWl0KSkpe1xyXG5cdFx0XHRpZighb3B0LmFzeW5jKXtcclxuXHRcdFx0XHRldi53YWl0ID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0dmFsLmNhbGwoe2FzOm9wdH0sIGF0LCBldiwgZXYud2FpdCB8fCAxKVxyXG5cdFx0XHRcdH0sIG9wdC53YWl0IHx8IDk5KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY2F0LmZpZWxkIHx8IGNhdC5zb3VsKXtcclxuXHRcdFx0XHRpZihldi5vZmYoKSl7IHJldHVybiB9IC8vIGlmIGl0IGlzIGFscmVhZHkgb2ZmLCBkb24ndCBjYWxsIGFnYWluIVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmKChvcHQuc2VlbiA9IG9wdC5zZWVuIHx8IHt9KVtjb2F0LmlkXSl7IHJldHVybiB9XHJcblx0XHRcdFx0b3B0LnNlZW5bY29hdC5pZF0gPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdG9wdC5vay5jYWxsKGF0Lmd1biB8fCBvcHQuZ3VuLCBkYXRhLCBhdC5nZXQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdEd1bi5jaGFpbi5vZmYgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgZ3VuID0gdGhpcywgYXQgPSBndW4uXywgdG1wO1xyXG5cdFx0XHR2YXIgYmFjayA9IGF0LmJhY2sgfHwge30sIGNhdCA9IGJhY2suXztcclxuXHRcdFx0aWYoIWNhdCl7IHJldHVybiB9XHJcblx0XHRcdGlmKHRtcCA9IGNhdC5uZXh0KXtcclxuXHRcdFx0XHRpZih0bXBbYXQuZ2V0XSl7XHJcblx0XHRcdFx0XHRvYmpfZGVsKHRtcCwgYXQuZ2V0KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0b2JqX21hcCh0bXAsIGZ1bmN0aW9uKHBhdGgsIGtleSl7XHJcblx0XHRcdFx0XHRcdGlmKGd1biAhPT0gcGF0aCl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRcdG9ial9kZWwodG1wLCBrZXkpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCh0bXAgPSBndW4uYmFjaygtMSkpID09PSBiYWNrKXtcclxuXHRcdFx0XHRvYmpfZGVsKHRtcC5ncmFwaCwgYXQuZ2V0KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihhdC5vbnMgJiYgKHRtcCA9IGF0Lm9uc1snQCQnXSkpe1xyXG5cdFx0XHRcdG9ial9tYXAodG1wLnMsIGZ1bmN0aW9uKGV2KXtcclxuXHRcdFx0XHRcdGV2Lm9mZigpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBndW47XHJcblx0XHR9XHJcblx0XHR2YXIgb2JqID0gR3VuLm9iaiwgb2JqX2hhcyA9IG9iai5oYXMsIG9ial9kZWwgPSBvYmouZGVsLCBvYmpfdG8gPSBvYmoudG87XHJcblx0XHR2YXIgcmVsID0gR3VuLnZhbC5yZWw7XHJcblx0XHR2YXIgZW1wdHkgPSB7fSwgbm9vcCA9IGZ1bmN0aW9uKCl7fSwgdTtcclxuXHR9KShyZXF1aXJlLCAnLi9vbicpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vY29yZScpLCB1O1xyXG5cdFx0R3VuLmNoYWluLm5vdCA9IGZ1bmN0aW9uKGNiLCBvcHQsIHQpe1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5nZXQob3VnaHQsIHtub3Q6IGNifSk7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBvdWdodChhdCwgZXYpeyBldi5vZmYoKTtcclxuXHRcdFx0aWYoYXQuZXJyIHx8ICh1ICE9PSBhdC5wdXQpKXsgcmV0dXJuIH1cclxuXHRcdFx0aWYoIXRoaXMubm90KXsgcmV0dXJuIH1cclxuXHRcdFx0dGhpcy5ub3QuY2FsbChhdC5ndW4sIGF0LmdldCwgZnVuY3Rpb24oKXsgY29uc29sZS5sb2coXCJQbGVhc2UgcmVwb3J0IHRoaXMgYnVnIG9uIGh0dHBzOi8vZ2l0dGVyLmltL2FtYXJrL2d1biBhbmQgaW4gdGhlIGlzc3Vlcy5cIik7IG5lZWQudG8uaW1wbGVtZW50OyB9KTtcclxuXHRcdH1cclxuXHR9KShyZXF1aXJlLCAnLi9ub3QnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL2NvcmUnKTtcclxuXHRcdEd1bi5jaGFpbi5tYXAgPSBmdW5jdGlvbihjYiwgb3B0LCB0KXtcclxuXHRcdFx0dmFyIGd1biA9IHRoaXMsIGNhdCA9IGd1bi5fLCBjaGFpbjtcclxuXHRcdFx0aWYoIWNiKXtcclxuXHRcdFx0XHRpZihjaGFpbiA9IGNhdC5maWVsZHMpeyByZXR1cm4gY2hhaW4gfVxyXG5cdFx0XHRcdGNoYWluID0gY2F0LmZpZWxkcyA9IGd1bi5jaGFpbigpO1xyXG5cdFx0XHRcdGNoYWluLl8udmFsID0gZ3VuLmJhY2soJ3ZhbCcpO1xyXG5cdFx0XHRcdGd1bi5vbignaW4nLCBtYXAsIGNoYWluLl8pO1xyXG5cdFx0XHRcdHJldHVybiBjaGFpbjtcclxuXHRcdFx0fVxyXG5cdFx0XHRHdW4ubG9nLm9uY2UoXCJtYXBmblwiLCBcIk1hcCBmdW5jdGlvbnMgYXJlIGV4cGVyaW1lbnRhbCwgdGhlaXIgYmVoYXZpb3IgYW5kIEFQSSBtYXkgY2hhbmdlIG1vdmluZyBmb3J3YXJkLiBQbGVhc2UgcGxheSB3aXRoIGl0IGFuZCByZXBvcnQgYnVncyBhbmQgaWRlYXMgb24gaG93IHRvIGltcHJvdmUgaXQuXCIpO1xyXG5cdFx0XHRjaGFpbiA9IGd1bi5jaGFpbigpO1xyXG5cdFx0XHRndW4ubWFwKCkub24oZnVuY3Rpb24oZGF0YSwga2V5LCBhdCwgZXYpe1xyXG5cdFx0XHRcdHZhciBuZXh0ID0gKGNifHxub29wKS5jYWxsKHRoaXMsIGRhdGEsIGtleSwgYXQsIGV2KTtcclxuXHRcdFx0XHRpZih1ID09PSBuZXh0KXsgcmV0dXJuIH1cclxuXHRcdFx0XHRpZihHdW4uaXMobmV4dCkpe1xyXG5cdFx0XHRcdFx0Y2hhaW4uXy5vbignaW4nLCBuZXh0Ll8pO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjaGFpbi5fLm9uKCdpbicsIHtnZXQ6IGtleSwgcHV0OiBuZXh0LCBndW46IGNoYWlufSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gY2hhaW47XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBtYXAoYXQpe1xyXG5cdFx0XHRpZighYXQucHV0IHx8IEd1bi52YWwuaXMoYXQucHV0KSl7IHJldHVybiB9XHJcblx0XHRcdGlmKHRoaXMuYXMudmFsKXsgdGhpcy5vZmYoKSB9IC8vIFRPRE86IFVnbHkgaGFjayFcclxuXHRcdFx0b2JqX21hcChhdC5wdXQsIGVhY2gsIHtjYXQ6IHRoaXMuYXMsIGd1bjogYXQuZ3VufSk7XHJcblx0XHRcdHRoaXMudG8ubmV4dChhdCk7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBlYWNoKHYsZil7XHJcblx0XHRcdGlmKG5fID09PSBmKXsgcmV0dXJuIH1cclxuXHRcdFx0dmFyIGNhdCA9IHRoaXMuY2F0LCBndW4gPSB0aGlzLmd1bi5nZXQoZiksIGF0ID0gKGd1bi5fKTtcclxuXHRcdFx0KGF0LmVjaG8gfHwgKGF0LmVjaG8gPSB7fSkpW2NhdC5pZF0gPSBjYXQ7XHJcblx0XHR9XHJcblx0XHR2YXIgb2JqX21hcCA9IEd1bi5vYmoubWFwLCBub29wID0gZnVuY3Rpb24oKXt9LCBldmVudCA9IHtzdHVuOiBub29wLCBvZmY6IG5vb3B9LCBuXyA9IEd1bi5ub2RlLl8sIHU7XHJcblx0fSkocmVxdWlyZSwgJy4vbWFwJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9jb3JlJyk7XHJcblx0XHRHdW4uY2hhaW4uc2V0ID0gZnVuY3Rpb24oaXRlbSwgY2IsIG9wdCl7XHJcblx0XHRcdHZhciBndW4gPSB0aGlzLCBzb3VsO1xyXG5cdFx0XHRjYiA9IGNiIHx8IGZ1bmN0aW9uKCl7fTtcclxuXHRcdFx0aWYoc291bCA9IEd1bi5ub2RlLnNvdWwoaXRlbSkpeyByZXR1cm4gZ3VuLnNldChndW4uYmFjaygtMSkuZ2V0KHNvdWwpLCBjYiwgb3B0KSB9XHJcblx0XHRcdGlmKCFHdW4uaXMoaXRlbSkpe1xyXG5cdFx0XHRcdGlmKEd1bi5vYmouaXMoaXRlbSkpeyByZXR1cm4gZ3VuLnNldChndW4uXy5yb290LnB1dChpdGVtKSwgY2IsIG9wdCkgfVxyXG5cdFx0XHRcdHJldHVybiBndW4uZ2V0KEd1bi50ZXh0LnJhbmRvbSgpKS5wdXQoaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aXRlbS5nZXQoJ18nKS5nZXQoZnVuY3Rpb24oYXQsIGV2KXtcclxuXHRcdFx0XHRpZighYXQuZ3VuIHx8ICFhdC5ndW4uXy5iYWNrKTtcclxuXHRcdFx0XHRldi5vZmYoKTtcclxuXHRcdFx0XHRhdCA9IChhdC5ndW4uXy5iYWNrLl8pO1xyXG5cdFx0XHRcdHZhciBwdXQgPSB7fSwgbm9kZSA9IGF0LnB1dCwgc291bCA9IEd1bi5ub2RlLnNvdWwobm9kZSk7XHJcblx0XHRcdFx0aWYoIXNvdWwpeyByZXR1cm4gY2IuY2FsbChndW4sIHtlcnI6IEd1bi5sb2coJ09ubHkgYSBub2RlIGNhbiBiZSBsaW5rZWQhIE5vdCBcIicgKyBub2RlICsgJ1wiIScpfSkgfVxyXG5cdFx0XHRcdGd1bi5wdXQoR3VuLm9iai5wdXQocHV0LCBzb3VsLCBHdW4udmFsLnJlbC5pZnkoc291bCkpLCBjYiwgb3B0KTtcclxuXHRcdFx0fSx7d2FpdDowfSk7XHJcblx0XHRcdHJldHVybiBpdGVtO1xyXG5cdFx0fVxyXG5cdH0pKHJlcXVpcmUsICcuL3NldCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0aWYodHlwZW9mIEd1biA9PT0gJ3VuZGVmaW5lZCcpeyByZXR1cm4gfSAvLyBUT0RPOiBsb2NhbFN0b3JhZ2UgaXMgQnJvd3NlciBvbmx5LiBCdXQgaXQgd291bGQgYmUgbmljZSBpZiBpdCBjb3VsZCBzb21laG93IHBsdWdpbiBpbnRvIE5vZGVKUyBjb21wYXRpYmxlIGxvY2FsU3RvcmFnZSBBUElzP1xyXG5cclxuXHRcdHZhciByb290LCBub29wID0gZnVuY3Rpb24oKXt9LCB1O1xyXG5cdFx0aWYodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpeyByb290ID0gd2luZG93IH1cclxuXHRcdHZhciBzdG9yZSA9IHJvb3QubG9jYWxTdG9yYWdlIHx8IHtzZXRJdGVtOiBub29wLCByZW1vdmVJdGVtOiBub29wLCBnZXRJdGVtOiBub29wfTtcclxuXHJcblx0XHR2YXIgY2hlY2sgPSB7fSwgZGlydHkgPSB7fSwgYXN5bmMgPSB7fSwgY291bnQgPSAwLCBtYXggPSAxMDAwMCwgd2FpdDtcclxuXHRcdFxyXG5cdFx0R3VuLm9uKCdwdXQnLCBmdW5jdGlvbihhdCl7IHZhciBlcnIsIGlkLCBvcHQsIHJvb3QgPSBhdC5ndW4uXy5yb290O1xyXG5cdFx0XHR0aGlzLnRvLm5leHQoYXQpO1xyXG5cdFx0XHQob3B0ID0ge30pLnByZWZpeCA9IChhdC5vcHQgfHwgb3B0KS5wcmVmaXggfHwgYXQuZ3VuLmJhY2soJ29wdC5wcmVmaXgnKSB8fCAnZ3VuLyc7XHJcblx0XHRcdHZhciBncmFwaCA9IHJvb3QuXy5ncmFwaDtcclxuXHRcdFx0XHJcblx0XHRcdEd1bi5vYmoubWFwKGF0LnB1dCwgZnVuY3Rpb24obm9kZSwgc291bCl7XHJcblx0XHRcdFx0YXN5bmNbc291bF0gPSBncmFwaFtzb3VsXSB8fCBub2RlO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0Y291bnQgKz0gMTtcclxuXHRcdFx0Y2hlY2tbYXRbJyMnXV0gPSByb290O1xyXG5cdFx0XHRmdW5jdGlvbiBzYXZlKCl7XHJcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KHdhaXQpO1xyXG5cdFx0XHRcdHZhciBhY2sgPSBjaGVjaztcclxuXHRcdFx0XHR2YXIgYWxsID0gYXN5bmM7XHJcblx0XHRcdFx0Y291bnQgPSAwO1xyXG5cdFx0XHRcdHdhaXQgPSBmYWxzZTtcclxuXHRcdFx0XHRjaGVjayA9IHt9O1xyXG5cdFx0XHRcdGFzeW5jID0ge307XHJcblx0XHRcdFx0R3VuLm9iai5tYXAoYWxsLCBmdW5jdGlvbihub2RlLCBzb3VsKXtcclxuXHRcdFx0XHRcdC8vIFNpbmNlIGxvY2FsU3RvcmFnZSBvbmx5IGhhcyA1TUIsIGl0IGlzIGJldHRlciB0aGF0IHdlIGtlZXAgb25seVxyXG5cdFx0XHRcdFx0Ly8gdGhlIGRhdGEgdGhhdCB0aGUgdXNlciBpcyBjdXJyZW50bHkgaW50ZXJlc3RlZCBpbi5cclxuXHRcdFx0XHRcdG5vZGUgPSBncmFwaFtzb3VsXSB8fCBhbGxbc291bF07XHJcblx0XHRcdFx0XHR0cnl7c3RvcmUuc2V0SXRlbShvcHQucHJlZml4ICsgc291bCwgSlNPTi5zdHJpbmdpZnkobm9kZSkpO1xyXG5cdFx0XHRcdFx0fWNhdGNoKGUpeyBlcnIgPSBlIHx8IFwibG9jYWxTdG9yYWdlIGZhaWx1cmVcIiB9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0aWYoIUd1bi5vYmouZW1wdHkoYXQuZ3VuLmJhY2soJ29wdC5wZWVycycpKSl7IHJldHVybiB9IC8vIG9ubHkgYWNrIGlmIHRoZXJlIGFyZSBubyBwZWVycy5cclxuXHRcdFx0XHRHdW4ub2JqLm1hcChhY2ssIGZ1bmN0aW9uKHJvb3QsIGlkKXtcclxuXHRcdFx0XHRcdHJvb3Qub24oJ2luJywge1xyXG5cdFx0XHRcdFx0XHQnQCc6IGlkLFxyXG5cdFx0XHRcdFx0XHRlcnI6IGVycixcclxuXHRcdFx0XHRcdFx0b2s6IDAgLy8gbG9jYWxTdG9yYWdlIGlzbid0IHJlbGlhYmxlLCBzbyBtYWtlIGl0cyBgb2tgIGNvZGUgYmUgYSBsb3cgbnVtYmVyLlxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY291bnQgPj0gbWF4KXsgLy8gZ29hbCBpcyB0byBkbyAxMEsgaW5zZXJ0cy9zZWNvbmQuXHJcblx0XHRcdFx0cmV0dXJuIHNhdmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih3YWl0KXsgcmV0dXJuIH1cclxuXHRcdFx0Y2xlYXJUaW1lb3V0KHdhaXQpO1xyXG5cdFx0XHR3YWl0ID0gc2V0VGltZW91dChzYXZlLCAxMDAwKTtcclxuXHRcdH0pO1xyXG5cdFx0R3VuLm9uKCdnZXQnLCBmdW5jdGlvbihhdCl7XHJcblx0XHRcdHRoaXMudG8ubmV4dChhdCk7XHJcblx0XHRcdHZhciBndW4gPSBhdC5ndW4sIGxleCA9IGF0LmdldCwgc291bCwgZGF0YSwgb3B0LCB1O1xyXG5cdFx0XHQvL3NldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0KG9wdCA9IGF0Lm9wdCB8fCB7fSkucHJlZml4ID0gb3B0LnByZWZpeCB8fCBhdC5ndW4uYmFjaygnb3B0LnByZWZpeCcpIHx8ICdndW4vJztcclxuXHRcdFx0aWYoIWxleCB8fCAhKHNvdWwgPSBsZXhbR3VuLl8uc291bF0pKXsgcmV0dXJuIH1cclxuXHRcdFx0Ly9pZigwID49IGF0LmNhcCl7IHJldHVybiB9XHJcblx0XHRcdHZhciBmaWVsZCA9IGxleFsnLiddO1xyXG5cclxuXHRcdFx0ZGF0YSA9IEd1bi5vYmouaWZ5KHN0b3JlLmdldEl0ZW0ob3B0LnByZWZpeCArIHNvdWwpIHx8IG51bGwpIHx8IGFzeW5jW3NvdWxdIHx8IHU7XHJcblx0XHRcdGlmKGRhdGEgJiYgZmllbGQpe1xyXG5cdFx0XHRcdGRhdGEgPSBHdW4uc3RhdGUuaWZ5KHUsIGZpZWxkLCBHdW4uc3RhdGUuaXMoZGF0YSwgZmllbGQpLCBkYXRhW2ZpZWxkXSwgc291bCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoIWRhdGEgJiYgIUd1bi5vYmouZW1wdHkoZ3VuLmJhY2soJ29wdC5wZWVycycpKSl7IC8vIGlmIGRhdGEgbm90IGZvdW5kLCBkb24ndCBhY2sgaWYgdGhlcmUgYXJlIHBlZXJzLlxyXG5cdFx0XHRcdHJldHVybjsgLy8gSG1tLCB3aGF0IGlmIHdlIGhhdmUgcGVlcnMgYnV0IHdlIGFyZSBkaXNjb25uZWN0ZWQ/XHJcblx0XHRcdH1cclxuXHRcdFx0Z3VuLm9uKCdpbicsIHsnQCc6IGF0WycjJ10sIHB1dDogR3VuLmdyYXBoLm5vZGUoZGF0YSksIGhvdzogJ2xTJ30pO1xyXG5cdFx0XHQvL30sMTEpO1xyXG5cdFx0fSk7XHJcblx0fSkocmVxdWlyZSwgJy4vYWRhcHRlcnMvbG9jYWxTdG9yYWdlJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9jb3JlJyk7XHJcblxyXG5cdFx0aWYgKHR5cGVvZiBKU09OID09PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXHJcblx0XHRcdFx0J0d1biBkZXBlbmRzIG9uIEpTT04uIFBsZWFzZSBsb2FkIGl0IGZpcnN0OlxcbicgK1xyXG5cdFx0XHRcdCdhamF4LmNkbmpzLmNvbS9hamF4L2xpYnMvanNvbjIvMjAxMTAyMjMvanNvbjIuanMnXHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIFdlYlNvY2tldDtcclxuXHRcdGlmKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKXtcclxuXHRcdFx0V2ViU29ja2V0ID0gd2luZG93LldlYlNvY2tldCB8fCB3aW5kb3cud2Via2l0V2ViU29ja2V0IHx8IHdpbmRvdy5tb3pXZWJTb2NrZXQ7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHR2YXIgbWVzc2FnZSwgY291bnQgPSAwLCBub29wID0gZnVuY3Rpb24oKXt9LCB3YWl0O1xyXG5cclxuXHRcdEd1bi5vbignb3V0JywgZnVuY3Rpb24oYXQpe1xyXG5cdFx0XHR0aGlzLnRvLm5leHQoYXQpO1xyXG5cdFx0XHR2YXIgY2F0ID0gYXQuZ3VuLl8ucm9vdC5fLCB3c3AgPSBjYXQud3NwIHx8IChjYXQud3NwID0ge30pO1xyXG5cdFx0XHRpZihhdC53c3AgJiYgMSA9PT0gd3NwLmNvdW50KXsgcmV0dXJuIH0gLy8gaWYgdGhlIG1lc3NhZ2UgY2FtZSBGUk9NIHRoZSBvbmx5IHBlZXIgd2UgYXJlIGNvbm5lY3RlZCB0bywgZG9uJ3QgZWNobyBpdCBiYWNrLlxyXG5cdFx0XHRtZXNzYWdlID0gSlNPTi5zdHJpbmdpZnkoYXQpO1xyXG5cdFx0XHQvL2lmKCsrY291bnQpeyBjb25zb2xlLmxvZyhcIm1zZyBPVVQ6XCIsIGNvdW50LCBHdW4ub2JqLmlmeShtZXNzYWdlKSkgfVxyXG5cdFx0XHRpZihjYXQudWRyYWluKXtcclxuXHRcdFx0XHRjYXQudWRyYWluLnB1c2gobWVzc2FnZSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhdC51ZHJhaW4gPSBbXTtcclxuXHRcdFx0Y2xlYXJUaW1lb3V0KHdhaXQpO1xyXG5cdFx0XHR3YWl0ID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdGlmKCFjYXQudWRyYWluKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgdG1wID0gY2F0LnVkcmFpbjtcclxuXHRcdFx0XHRjYXQudWRyYWluID0gbnVsbDtcclxuXHRcdFx0XHRpZiggdG1wLmxlbmd0aCApIHtcclxuXHRcdFx0XHRcdG1lc3NhZ2UgPSBKU09OLnN0cmluZ2lmeSh0bXApO1xyXG5cdFx0XHRcdFx0R3VuLm9iai5tYXAoY2F0Lm9wdC5wZWVycywgc2VuZCwgY2F0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sMSk7XHJcblx0XHRcdHdzcC5jb3VudCA9IDA7XHJcblx0XHRcdEd1bi5vYmoubWFwKGNhdC5vcHQucGVlcnMsIHNlbmQsIGNhdCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRmdW5jdGlvbiBzZW5kKHBlZXIpe1xyXG5cdFx0XHR2YXIgbXNnID0gbWVzc2FnZSwgY2F0ID0gdGhpcztcclxuXHRcdFx0dmFyIHdpcmUgPSBwZWVyLndpcmUgfHwgb3BlbihwZWVyLCBjYXQpO1xyXG5cdFx0XHRpZihjYXQud3NwKXsgY2F0LndzcC5jb3VudCsrIH1cclxuXHRcdFx0aWYoIXdpcmUpeyByZXR1cm4gfVxyXG5cdFx0XHRpZih3aXJlLnJlYWR5U3RhdGUgPT09IHdpcmUuT1BFTil7XHJcblx0XHRcdFx0d2lyZS5zZW5kKG1zZyk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdChwZWVyLnF1ZXVlID0gcGVlci5xdWV1ZSB8fCBbXSkucHVzaChtc2cpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHJlY2VpdmUobXNnLCBwZWVyLCBjYXQpe1xyXG5cdFx0XHRpZighY2F0IHx8ICFtc2cpeyByZXR1cm4gfVxyXG5cdFx0XHR0cnl7bXNnID0gSlNPTi5wYXJzZShtc2cuZGF0YSB8fCBtc2cpO1xyXG5cdFx0XHR9Y2F0Y2goZSl7fVxyXG5cdFx0XHRpZihtc2cgaW5zdGFuY2VvZiBBcnJheSl7XHJcblx0XHRcdFx0dmFyIGkgPSAwLCBtO1xyXG5cdFx0XHRcdHdoaWxlKG0gPSBtc2dbaSsrXSl7XHJcblx0XHRcdFx0XHRyZWNlaXZlKG0sIHBlZXIsIGNhdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHQvL2lmKCsrY291bnQpeyBjb25zb2xlLmxvZyhcIm1zZyBpbjpcIiwgY291bnQsIG1zZy5ib2R5IHx8IG1zZykgfVxyXG5cdFx0XHRpZihjYXQud3NwICYmIDEgPT09IGNhdC53c3AuY291bnQpeyAobXNnLmJvZHkgfHwgbXNnKS53c3AgPSBub29wIH0gLy8gSWYgdGhlcmUgaXMgb25seSAxIGNsaWVudCwganVzdCB1c2Ugbm9vcCBzaW5jZSBpdCBkb2Vzbid0IG1hdHRlci5cclxuXHRcdFx0Y2F0Lmd1bi5vbignaW4nLCBtc2cuYm9keSB8fCBtc2cpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIG9wZW4ocGVlciwgYXMpe1xyXG5cdFx0XHRpZighcGVlciB8fCAhcGVlci51cmwpeyByZXR1cm4gfVxyXG5cdFx0XHR2YXIgdXJsID0gcGVlci51cmwucmVwbGFjZSgnaHR0cCcsICd3cycpO1xyXG5cdFx0XHR2YXIgd2lyZSA9IHBlZXIud2lyZSA9IG5ldyBXZWJTb2NrZXQodXJsLCBhcy5vcHQud3NjLnByb3RvY29scywgYXMub3B0LndzYyApO1xyXG5cdFx0XHR3aXJlLm9uY2xvc2UgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHJlY29ubmVjdChwZWVyLCBhcyk7XHJcblx0XHRcdH07XHJcblx0XHRcdHdpcmUub25lcnJvciA9IGZ1bmN0aW9uKGVycm9yKXtcclxuXHRcdFx0XHRyZWNvbm5lY3QocGVlciwgYXMpO1xyXG5cdFx0XHRcdGlmKCFlcnJvcil7IHJldHVybiB9XHJcblx0XHRcdFx0aWYoZXJyb3IuY29kZSA9PT0gJ0VDT05OUkVGVVNFRCcpe1xyXG5cdFx0XHRcdFx0Ly9yZWNvbm5lY3QocGVlciwgYXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0d2lyZS5vbm9wZW4gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciBxdWV1ZSA9IHBlZXIucXVldWU7XHJcblx0XHRcdFx0cGVlci5xdWV1ZSA9IFtdO1xyXG5cdFx0XHRcdEd1bi5vYmoubWFwKHF1ZXVlLCBmdW5jdGlvbihtc2cpe1xyXG5cdFx0XHRcdFx0bWVzc2FnZSA9IG1zZztcclxuXHRcdFx0XHRcdHNlbmQuY2FsbChhcywgcGVlcik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0d2lyZS5vbm1lc3NhZ2UgPSBmdW5jdGlvbihtc2cpe1xyXG5cdFx0XHRcdHJlY2VpdmUobXNnLCBwZWVyLCBhcyk7XHJcblx0XHRcdH07XHJcblx0XHRcdHJldHVybiB3aXJlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHJlY29ubmVjdChwZWVyLCBhcyl7XHJcblx0XHRcdGNsZWFyVGltZW91dChwZWVyLmRlZmVyKTtcclxuXHRcdFx0cGVlci5kZWZlciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRvcGVuKHBlZXIsIGFzKTtcclxuXHRcdFx0fSwgMiAqIDEwMDApO1xyXG5cdFx0fVxyXG5cdH0pKHJlcXVpcmUsICcuL3BvbHlmaWxsL3JlcXVlc3QnKTtcclxuXHJcbn0oKSk7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vZ3VuL2d1bi5qcyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obW9kdWxlKSB7XHJcblx0aWYoIW1vZHVsZS53ZWJwYWNrUG9seWZpbGwpIHtcclxuXHRcdG1vZHVsZS5kZXByZWNhdGUgPSBmdW5jdGlvbigpIHt9O1xyXG5cdFx0bW9kdWxlLnBhdGhzID0gW107XHJcblx0XHQvLyBtb2R1bGUucGFyZW50ID0gdW5kZWZpbmVkIGJ5IGRlZmF1bHRcclxuXHRcdG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xyXG5cdFx0bW9kdWxlLndlYnBhY2tQb2x5ZmlsbCA9IDE7XHJcblx0fVxyXG5cdHJldHVybiBtb2R1bGU7XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vICh3ZWJwYWNrKS9idWlsZGluL21vZHVsZS5qcyIsInZhciBpbmRleFBhcnRpYWwgPSByZXF1aXJlKFwicmF3LWxvYWRlciEuLi8uLi92aWV3cy9wYXJ0aWFscy9pbmRleC5odG1sXCIpO1xuZXhwb3J0IGNsYXNzIEluZGV4UGFnZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLmlubmVySFRNTCA9IGBcbiAgICAgICAgPHA+JHtpbmRleFBhcnRpYWx9PC9wPlxuICAgICAgICBgO1xuICAgIH1cbn1cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcImluZGV4LXBhZ2VcIiwgSW5kZXhQYWdlKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYWdlcy9pbmRleC5qcyIsIm1vZHVsZS5leHBvcnRzID0gXCI8cD5pbmRleDwvcD5cXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yYXctbG9hZGVyIS4vdmlld3MvcGFydGlhbHMvaW5kZXguaHRtbFxuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgcm9hZG1hcFBhcnRpYWwgPSByZXF1aXJlKFwicmF3LWxvYWRlciEuLi8uLi92aWV3cy9wYXJ0aWFscy9yb2FkbWFwLmh0bWxcIik7XG5leHBvcnQgY2xhc3MgUm9hZG1hcFBhZ2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSAnPHA+JyArIHJvYWRtYXBQYXJ0aWFsICsgJzwvcD4nO1xuICAgIH1cbn1cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcInJvYWRtYXAtcGFnZVwiLCBSb2FkbWFwUGFnZSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFnZXMvcm9hZG1hcC5qcyIsIm1vZHVsZS5leHBvcnRzID0gXCI8c3BhbiBjbGFzcz1cXFwicm9hZG1hcFxcXCI+XFxuICAgIDxkZXRhaWxzPlxcbiAgICA8c3VtbWFyeT5yb2FkIG1hcDwvc3VtbWFyeT5cXG4gICAgPHVsPlxcbiAgICAgICAgPGxpPjxkZWw+PGEgaHJlZj1cXFwiaHR0cHM6Ly9naXRodWIuY29tL2NvbGVhbGJvbi9ob3RsaXBzL2NvbW1pdC8zYjcwOTgxY2JlNGUxMWUxNDAwYWU4ZTk0OGEwNmUzNTgyZDljMmQyXFxcIj5JbnN0YWxsIG5vZGUva29hL3dlYnBhY2s8L2E+PC9kZWw+PC9saT5cXG4gICAgICAgIDxsaT48ZGVsPjxhIGhyZWY9XFxcImh0dHBzOi8vZ2l0aHViLmNvbS9jb2xlYWxib24vaG90bGlwcy9pc3N1ZXMvMlxcXCI+SW5zdGFsbCBndW5kYjwvYT48L2RlbD48L2xpPlxcbiAgICAgICAgPGxpPjxkZWw+bWFrZSBhIDxhIGhyZWY9XFxcIiMvZGVja1xcXCI+ZGVjazwvYT4gb2YgY2FyZHM8L2RlbD48L2xpPlxcbiAgICAgICAgPGxpPjxkZWw+QWxpY2UgYW5kIEJvYiA8YSBocmVmPVxcXCIjL21lc3NhZ2VcXFwiPmlkZW50aWZ5PC9hPjwvZGVsPjwvbGk+XFxuICAgICAgICA8bGk+PGRlbD5BbGljZSBhbmQgQm9iIDxhIGhyZWY9XFxcIiMvY29ubmVjdFxcXCI+Y29ubmVjdDwvYT48L2RlbD48L2xpPlxcbiAgICAgICAgPGxpPjxkZWw+QWxpY2UgYW5kIEJvYiA8YSBocmVmPVxcXCJodHRwczovL2dpdGh1Yi5jb20vY29sZWFsYm9uL3N0cmVhbWxpbmVyXFxcIj5leGNoYW5nZSBrZXlzPC9hPjwvZGVsPzwvbGk+XFxuICAgICAgICA8bGk+QWxpY2UgYW5kIEJvYiBhZ3JlZSBvbiBhIGNlcnRhaW4gXFxcIjxhIGhyZWY9XFxcIiMvZGVja1xcXCI+ZGVjazwvYT5cXFwiIG9mIGNhcmRzLiBJbiBwcmFjdGljZSwgdGhpcyBtZWFucyB0aGV5IGFncmVlIG9uIGEgc2V0IG9mIG51bWJlcnMgb3Igb3RoZXIgZGF0YSBzdWNoIHRoYXQgZWFjaCBlbGVtZW50IG9mIHRoZSBzZXQgcmVwcmVzZW50cyBhIGNhcmQuPC9saT5cXG4gICAgICAgIDxsaT5BbGljZSBwaWNrcyBhbiBlbmNyeXB0aW9uIGtleSBBIGFuZCB1c2VzIHRoaXMgdG8gZW5jcnlwdCBlYWNoIGNhcmQgb2YgdGhlIGRlY2suPC9saT5cXG4gICAgICAgIDxsaT5BbGljZSA8YSBocmVmPVxcXCJodHRwczovL2Jvc3Qub2Nrcy5vcmcvbWlrZS9zaHVmZmxlL1xcXCI+c2h1ZmZsZXM8L2E+IHRoZSBjYXJkcy48L2xpPlxcbiAgICAgICAgPGxpPkFsaWNlIHBhc3NlcyB0aGUgZW5jcnlwdGVkIGFuZCBzaHVmZmxlZCBkZWNrIHRvIEJvYi4gV2l0aCB0aGUgZW5jcnlwdGlvbiBpbiBwbGFjZSwgQm9iIGNhbm5vdCBrbm93IHdoaWNoIGNhcmQgaXMgd2hpY2guPC9saT5cXG4gICAgICAgIDxsaT5Cb2Igc2h1ZmZsZXMgdGhlIGRlY2suPC9saT5cXG4gICAgICAgIDxsaT5Cb2IgcGFzc2VzIHRoZSBkb3VibGUgZW5jcnlwdGVkIGFuZCBzaHVmZmxlZCBkZWNrIGJhY2sgdG8gQWxpY2UuPC9saT5cXG4gICAgICAgIDxsaT5BbGljZSBkZWNyeXB0cyBlYWNoIGNhcmQgdXNpbmcgaGVyIGtleSBBLiBUaGlzIHN0aWxsIGxlYXZlcyBCb2IncyBlbmNyeXB0aW9uIGluIHBsYWNlIHRob3VnaCBzbyBzaGUgY2Fubm90IGtub3cgd2hpY2ggY2FyZCBpcyB3aGljaC48L2xpPlxcbiAgICAgICAgPGxpPkFsaWNlIHBpY2tzIG9uZSBlbmNyeXB0aW9uIGtleSBmb3IgZWFjaCBjYXJkIChBMSwgQTIsIGV0Yy4pIGFuZCBlbmNyeXB0cyB0aGVtIGluZGl2aWR1YWxseS48L2xpPlxcbiAgICAgICAgPGxpPkFsaWNlIHBhc3NlcyB0aGUgZGVjayB0byBCb2IuPC9saT5cXG4gICAgICAgIDxsaT5Cb2IgZGVjcnlwdHMgZWFjaCBjYXJkIHVzaW5nIGhpcyBrZXkgQi4gVGhpcyBzdGlsbCBsZWF2ZXMgQWxpY2UncyBpbmRpdmlkdWFsIGVuY3J5cHRpb24gaW4gcGxhY2UgdGhvdWdoIHNvIGhlIGNhbm5vdCBrbm93IHdoaWNoIGNhcmQgaXMgd2hpY2guPC9saT5cXG4gICAgICAgIDxsaT5Cb2IgcGlja3Mgb25lIGVuY3J5cHRpb24ga2V5IGZvciBlYWNoIGNhcmQgKEIxLCBCMiwgZXRjLikgYW5kIGVuY3J5cHRzIHRoZW0gaW5kaXZpZHVhbGx5LjwvbGk+XFxuICAgICAgICA8bGk+Qm9iIHBhc3NlcyB0aGUgZGVjayBiYWNrIHRvIEFsaWNlLjwvbGk+XFxuICAgICAgICA8bGk+QWxpY2UgcHVibGlzaGVzIHRoZSBkZWNrIGZvciBldmVyeW9uZSBwbGF5aW5nIChpbiB0aGlzIGNhc2Ugb25seSBBbGljZSBhbmQgQm9iLCBzZWUgYmVsb3cgb24gZXhwYW5zaW9uIHRob3VnaCkuPC9saT5cXG4gICAgPC91bD5cXG48L2RldGFpbHM+XFxuPC9zcGFuPlxcblwiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3Jhdy1sb2FkZXIhLi92aWV3cy9wYXJ0aWFscy9yb2FkbWFwLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibGV0IGNvbnRhY3RQYXJ0aWFsID0gcmVxdWlyZShcInJhdy1sb2FkZXIhLi4vLi4vdmlld3MvcGFydGlhbHMvY29udGFjdC5odG1sXCIpO1xuZXhwb3J0IGNsYXNzIENvbnRhY3RQYWdlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICAgIGF0dGFjaGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuaW5uZXJIVE1MID0gJzxwPicgKyBjb250YWN0UGFydGlhbCArICc8L3A+JztcbiAgICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJjb250YWN0LXBhZ2VcIiwgQ29udGFjdFBhZ2UpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhZ2VzL2NvbnRhY3QuanMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPHNwYW4gY2xhc3M9XFxcImNvbnRhY3RcXFwiPlxcbiAgICBDb2xlIEFsYm9uPGJyPlxcbiAgICA8YSBocmVmPVxcXCJ0ZWw6KzE0MTU2NzIxNjQ4XFxcIj4oNDE1KSA2NzItMTY0ODwvYT48YnI+XFxuICAgIDxhIGhyZWY9XFxcIm1haWx0bzpjb2xlLmFsYm9uQGdtYWlsLmNvbVxcXCI+Y29sZS5hbGJvbkBnbWFpbC5jb208L2E+PGJyPlxcbiAgICA8YSBocmVmPVxcXCJodHRwczovL2dpdGh1Yi5jb20vY29sZWFsYm9uXFxcIj5odHRwczovL2dpdGh1Yi5jb20vY29sZWFsYm9uPC9hPjxicj5cXG4gICAgPGEgaHJlZj1cXFwiaHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL2NvbGUtYWxib24tNTkzNDYzNFxcXCI+XFxuICAgICAgICA8c3BhbiBpZD1cXFwibGlua2VkaW5hZGRyZXNzXFxcIiBjbGFzcz1cXFwibGlua2VkaW5hZGRyZXNzXFxcIj5odHRwczovL3d3dy5saW5rZWRpbi5jb20vaW4vY29sZS1hbGJvbi01OTM0NjM0PC9zcGFuPlxcbiAgICA8L2E+PGJyPlxcbjwvc3Bhbj5cXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yYXctbG9hZGVyIS4vdmlld3MvcGFydGlhbHMvY29udGFjdC5odG1sXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgY2xpZW50UHVia2V5Rm9ybVBhcnRpYWwgPSByZXF1aXJlKFwicmF3LWxvYWRlciEuLi8uLi92aWV3cy9wYXJ0aWFscy9tZXNzYWdlX2Zvcm0uaHRtbFwiKTtcblxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VQYWdlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICAgIGF0dGFjaGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuaW5uZXJIVE1MID0gYFxuICAgICAgICAgICAgPHA+JHtjbGllbnRQdWJrZXlGb3JtUGFydGlhbH08L3A+XG4gICAgICAgIGBcbiAgICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJtZXNzYWdlLXBhZ2VcIiwgTWVzc2FnZVBhZ2UpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhZ2VzL21lc3NhZ2UuanMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGZvcm1cXG4gICAgaWQ9XFxcIm1lc3NhZ2VfZm9ybVxcXCJcXG4gICAgb25zdWJtaXQ9XFxcIlxcbiAgICAgdmFyIGd1biA9IEd1bihsb2NhdGlvbi5vcmlnaW4gKyAnL2d1bicpO1xcbiAgICAgb3BlbnBncC5jb25maWcuYWVhZF9wcm90ZWN0ID0gdHJ1ZVxcbiAgICAgb3BlbnBncC5pbml0V29ya2VyKHsgcGF0aDonL2pzL29wZW5wZ3Aud29ya2VyLmpzJyB9KVxcbiAgICAgaWYgKCFtZXNzYWdlX3R4dC52YWx1ZSkge1xcbiAgICAgICAgICByZXR1cm4gZmFsc2VcXG4gICAgIH1cXG4gICAgIHdpbmRvdy5oYW5kbGVQb3N0KG1lc3NhZ2VfdHh0LnZhbHVlKShvcGVucGdwKSh3aW5kb3cubG9jYWxTdG9yYWdlKSgncm95YWxlJykudGhlbihyZXN1bHQgPT4ge2lmIChyZXN1bHQpIHtjb25zb2xlLmxvZyhyZXN1bHQpfX0pLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKGVycikpO2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZXNzYWdlX3R4dCcpLnZhbHVlID0gJyc7IHJldHVybiBmYWxzZVxcXCJcXG4gICAgbWV0aG9kPVxcXCJwb3N0XFxcIlxcbiAgICBhY3Rpb249XFxcIi9tZXNzYWdlXFxcIj5cXG4gICAgPGlucHV0IGlkPVxcXCJtZXNzYWdlX2Zvcm1faW5wdXRcXFwiXFxuICAgICAgICB0eXBlPVxcXCJzdWJtaXRcXFwiXFxuICAgICAgICB2YWx1ZT1cXFwicG9zdCBtZXNzYWdlXFxcIlxcbiAgICAgICAgZm9ybT1cXFwibWVzc2FnZV9mb3JtXFxcIlxcbiAgICAgICAgPlxcbjwvZm9ybT5cXG48dGV4dGFyZWFcXG4gICAgaWQ9XFxcIm1lc3NhZ2VfdHh0XFxcIlxcbiAgICBuYW1lPVxcXCJtZXNzYWdlX3R4dFxcXCJcXG4gICAgZm9ybT1cXFwibWVzc2FnZV9mb3JtXFxcIlxcbiAgICByb3dzPTUxXFxuICAgIGNvbHM9NzBcXG4gICAgcGxhY2Vob2xkZXI9XFxcInBhc3RlIHBsYWludGV4dCBtZXNzYWdlLCBwdWJsaWMga2V5LCBvciBwcml2YXRlIGtleVxcXCJcXG4gICAgc3R5bGU9XFxcImZvbnQtZmFtaWx5Ok1lbmxvLENvbnNvbGFzLE1vbmFjbyxMdWNpZGEgQ29uc29sZSxMaWJlcmF0aW9uIE1vbm8sRGVqYVZ1IFNhbnMgTW9ubyxCaXRzdHJlYW0gVmVyYSBTYW5zIE1vbm8sQ291cmllciBOZXcsIG1vbm9zcGFjZTtcXFwiXFxuICAgID5cXG48L3RleHRhcmVhPlxcblwiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3Jhdy1sb2FkZXIhLi92aWV3cy9wYXJ0aWFscy9tZXNzYWdlX2Zvcm0uaHRtbFxuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGZyZXNoRGVja1BhcnRpYWwgPSByZXF1aXJlKFwicmF3LWxvYWRlciEuLi8uLi92aWV3cy9wYXJ0aWFscy9mcmVzaGRlY2suaHRtbFwiKTtcblxuZXhwb3J0IGNsYXNzIERlY2tQYWdlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICAgIGF0dGFjaGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuaW5uZXJIVE1MID0gJzxwPicgKyBmcmVzaERlY2tQYXJ0aWFsICsgJzwvcD4nO1xuICAgIH1cbn1cblxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwiZGVjay1wYWdlXCIsIERlY2tQYWdlKTtcbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgncGxheWluZy1jYXJkJywge1xuICAgIHByb3RvdHlwZTogT2JqZWN0LmNyZWF0ZShIVE1MRWxlbWVudC5wcm90b3R5cGUsIHsgY3JlYXRlZENhbGxiYWNrOiB7XG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgcm9vdCA9IHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpO1xuICAgICAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyB0aGlzLnRleHRDb250ZW50IHx8ICcj4paIJyk7XG4gICAgICAgICAgICAgICAgICB2YXIgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgdmFyIGNvbG9yT3ZlcnJpZGUgPSAodGhpcy5xdWVyeVNlbGVjdG9yKCdzcGFuJykpID8gdGhpcy5xdWVyeVNlbGVjdG9yKCdzcGFuJykuc3R5bGUuY29sb3I6IG51bGw7XG4gICAgICAgICAgICAgICAgICBpZiAoY29sb3JPdmVycmlkZSkge1xuICAgICAgICAgICAgICAgICAgICAgIGNsb25lLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpLnN0eWxlLmZpbGwgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKS5zdHlsZS5jb2xvcjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcbn0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhZ2VzL2RlY2suanMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiICAgIDxkaXYgaWQ9XFxcImRlY2tcXFwiIGNsYXNzPVxcXCJkZWNrXFxcIj5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLilohcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNzAuMzEyNSAzNjIuMjUgTDcwLjMxMjUgMTEwLjEwOTQgTDIyNC4yOTY5IDExMC4xMDk0IEwyMjQuMjk2OSAzNjIuMjUgTDcwLjMxMjUgMzYyLjI1IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoEFcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTExMC42NzE5IDExNS43MzQ0IEw5MS44MjgxIDE3NS43ODEyIEwxMjkuNTE1NiAxNzUuNzgxMiBMMTEwLjY3MTkgMTE1LjczNDQgWk05OS45ODQ0IDEwMS42NzE5IEwxMjEuNjQwNiAxMDEuNjcxOSBMMTYyLjE0MDYgMjE5LjIzNDQgTDE0My41NzgxIDIxOS4yMzQ0IEwxMzQuMDE1NiAxODguNTc4MSBMODcuNjA5NCAxODguNTc4MSBMNzguMDQ2OSAyMTkuMjM0NCBMNTkuNDg0NCAyMTkuMjM0NCBMOTkuOTg0NCAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaAyXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk04Ni4zNDM4IDIwMy4wNjI1IEwxNDUuOTY4OCAyMDMuMDYyNSBMMTQ1Ljk2ODggMjE5LjA5MzggTDYxLjg3NSAyMTkuMDkzOCBMNjEuODc1IDIwMy42MjUgUTY2LjY1NjIgMTk5LjI2NTYgNzUuNTE1NiAxOTEuMzkwNiBRMTIzLjg5MDYgMTQ4LjUgMTIzLjg5MDYgMTM1LjI4MTIgUTEyMy44OTA2IDEyNiAxMTYuNTc4MSAxMjAuMzA0NyBRMTA5LjI2NTYgMTE0LjYwOTQgOTcuMzEyNSAxMTQuNjA5NCBROTAgMTE0LjYwOTQgODEuNDIxOSAxMTcuMDcwMyBRNzIuODQzOCAxMTkuNTMxMiA2Mi43MTg4IDEyNC40NTMxIEw2Mi43MTg4IDEwNy4xNTYyIFE3My41NDY5IDEwMy4yMTg4IDgyLjg5ODQgMTAxLjI1IFE5Mi4yNSA5OS4yODEyIDEwMC4yNjU2IDk5LjI4MTIgUTEyMC42NTYyIDk5LjI4MTIgMTMyLjg5MDYgMTA4LjU2MjUgUTE0NS4xMjUgMTE3Ljg0MzggMTQ1LjEyNSAxMzMuMDMxMiBRMTQ1LjEyNSAxNTIuNTc4MSA5OC41NzgxIDE5Mi41MTU2IFE5MC43MDMxIDE5OS4yNjU2IDg2LjM0MzggMjAzLjA2MjUgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgM1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTIxLjc4MTIgMTU1LjUzMTIgUTEzNC43MTg4IDE1OC4wNjI1IDE0MS44MjAzIDE2NS43MjY2IFExNDguOTIxOSAxNzMuMzkwNiAxNDguOTIxOSAxODQuOTIxOSBRMTQ4LjkyMTkgMjAyLjM1OTQgMTM1LjU2MjUgMjExLjc4MTIgUTEyMi4yMDMxIDIyMS4yMDMxIDk3LjMxMjUgMjIxLjIwMzEgUTg5LjI5NjkgMjIxLjIwMzEgODAuNTA3OCAyMTkuNzI2NiBRNzEuNzE4OCAyMTguMjUgNjEuODc1IDIxNS40Mzc1IEw2MS44NzUgMTk4LjQyMTkgUTY5LjE4NzUgMjAyLjIxODggNzcuNTU0NyAyMDQuMDQ2OSBRODUuOTIxOSAyMDUuODc1IDk1LjM0MzggMjA1Ljg3NSBRMTEwLjY3MTkgMjA1Ljg3NSAxMTkuMTA5NCAyMDAuMzIwMyBRMTI3LjU0NjkgMTk0Ljc2NTYgMTI3LjU0NjkgMTg0LjkyMTkgUTEyNy41NDY5IDE3NC41MTU2IDExOS43NDIyIDE2OS4xNzE5IFExMTEuOTM3NSAxNjMuODI4MSA5Ni43NSAxNjMuODI4MSBMODQuNjU2MiAxNjMuODI4MSBMODQuNjU2MiAxNDguNjQwNiBMOTcuODc1IDE0OC42NDA2IFExMTEuMDkzOCAxNDguNjQwNiAxMTcuOTE0MSAxNDQuMjEwOSBRMTI0LjczNDQgMTM5Ljc4MTIgMTI0LjczNDQgMTMxLjM0MzggUTEyNC43MzQ0IDEyMy4xODc1IDExNy43MDMxIDExOC44OTg0IFExMTAuNjcxOSAxMTQuNjA5NCA5Ny4zMTI1IDExNC42MDk0IFE5MS42ODc1IDExNC42MDk0IDg0LjUxNTYgMTE1Ljg3NSBRNzcuMzQzOCAxMTcuMTQwNiA2NS45NTMxIDEyMC4zNzUgTDY1Ljk1MzEgMTA0LjIwMzEgUTc2LjIxODggMTAxLjgxMjUgODUuMjE4OCAxMDAuNTQ2OSBROTQuMjE4OCA5OS4yODEyIDEwMS45NTMxIDk5LjI4MTIgUTEyMi4yMDMxIDk5LjI4MTIgMTM0LjA4NTkgMTA3LjU3ODEgUTE0NS45Njg4IDExNS44NzUgMTQ1Ljk2ODggMTI5Ljc5NjkgUTE0NS45Njg4IDEzOS41IDEzOS42NDA2IDE0Ni4yNSBRMTMzLjMxMjUgMTUzIDEyMS43ODEyIDE1NS41MzEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoDRcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEyMC4wOTM4IDExOC42ODc1IEw3Ni42NDA2IDE3Ny42MDk0IEwxMjAuMDkzOCAxNzcuNjA5NCBMMTIwLjA5MzggMTE4LjY4NzUgWk0xMTcgMTAxLjY3MTkgTDE0MC4zNDM4IDEwMS42NzE5IEwxNDAuMzQzOCAxNzcuNjA5NCBMMTU5LjMyODEgMTc3LjYwOTQgTDE1OS4zMjgxIDE5Mi45Mzc1IEwxNDAuMzQzOCAxOTIuOTM3NSBMMTQwLjM0MzggMjE5LjA5MzggTDEyMC4wOTM4IDIxOS4wOTM4IEwxMjAuMDkzOCAxOTIuOTM3NSBMNjEuODc1IDE5Mi45Mzc1IEw2MS44NzUgMTc1LjkyMTkgTDExNyAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaA1XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02Ny41IDEwMS42NzE5IEwxMzkuMjE4OCAxMDEuNjcxOSBMMTM5LjIxODggMTE1LjAzMTIgTDg0LjIzNDQgMTE1LjAzMTIgTDg0LjIzNDQgMTQzLjcxODggUTg4LjE3MTkgMTQyLjQ1MzEgOTIuMjUgMTQxLjg5MDYgUTk2LjE4NzUgMTQxLjMyODEgMTAwLjEyNSAxNDEuMzI4MSBRMTIyLjc2NTYgMTQxLjMyODEgMTM1Ljk4NDQgMTUyLjE1NjIgUTE0OS4yMDMxIDE2Mi44NDM4IDE0OS4yMDMxIDE4MS4yNjU2IFExNDkuMjAzMSAyMDAuMjUgMTM1LjU2MjUgMjEwLjc5NjkgUTEyMi4wNjI1IDIyMS4yMDMxIDk3LjMxMjUgMjIxLjIwMzEgUTg4Ljg3NSAyMjEuMjAzMSA4MC4wMTU2IDIxOS45Mzc1IFE3MS4xNTYyIDIxOC42NzE5IDYxLjg3NSAyMTYuMTQwNiBMNjEuODc1IDIwMC4yNSBRNjkuODkwNiAyMDQuMDQ2OSA3OC42MDk0IDIwNi4wMTU2IFE4Ny4zMjgxIDIwNy44NDM4IDk3LjAzMTIgMjA3Ljg0MzggUTExMi42NDA2IDIwNy44NDM4IDEyMS43ODEyIDIwMC42NzE5IFExMzAuOTIxOSAxOTMuNSAxMzAuOTIxOSAxODEuMjY1NiBRMTMwLjkyMTkgMTY5LjAzMTIgMTIxLjc4MTIgMTYxLjg1OTQgUTExMi42NDA2IDE1NC42ODc1IDk3LjAzMTIgMTU0LjY4NzUgUTg5LjcxODggMTU0LjY4NzUgODIuNDA2MiAxNTYuMDkzOCBRNzUuMDkzOCAxNTcuNSA2Ny41IDE2MC40NTMxIEw2Ny41IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoDZcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTExMC4xMDk0IDE1My43MDMxIFE5Ny43MzQ0IDE1My43MDMxIDkwLjU2MjUgMTYxLjAxNTYgUTgzLjM5MDYgMTY4LjQ2ODggODMuMzkwNiAxODEuMjY1NiBRODMuMzkwNiAxOTMuOTIxOSA5MC41NjI1IDIwMS4yMzQ0IFE5Ny43MzQ0IDIwOC42ODc1IDExMC4xMDk0IDIwOC42ODc1IFExMjIuMzQzOCAyMDguNjg3NSAxMjkuNTE1NiAyMDEuMjM0NCBRMTM2LjY4NzUgMTkzLjkyMTkgMTM2LjY4NzUgMTgxLjI2NTYgUTEzNi42ODc1IDE2OC40Njg4IDEyOS41MTU2IDE2MS4wMTU2IFExMjIuMzQzOCAxNTMuNzAzMSAxMTAuMTA5NCAxNTMuNzAzMSBaTTE0Ni4zOTA2IDEwMy45MjE5IEwxNDYuMzkwNiAxMTguNDA2MiBRMTM5LjUgMTE1LjU5MzggMTMyLjQ2ODggMTE0LjE4NzUgUTEyNS40Mzc1IDExMi42NDA2IDExOC41NDY5IDExMi42NDA2IFExMDAuNTQ2OSAxMTIuNjQwNiA5MC45ODQ0IDEyMy4xODc1IFE4MS40MjE5IDEzMy44NzUgODAuMDE1NiAxNTUuMzkwNiBRODUuMzU5NCAxNDguNSA5My4zNzUgMTQ0Ljg0MzggUTEwMS41MzEyIDE0MS4xODc1IDExMS4wOTM4IDE0MS4xODc1IFExMzEuNDg0NCAxNDEuMTg3NSAxNDMuMjk2OSAxNTEuODc1IFExNTUuMTA5NCAxNjIuNzAzMSAxNTUuMTA5NCAxODEuMjY1NiBRMTU1LjEwOTQgMTk5LjEyNSAxNDIuNzM0NCAyMTAuMjM0NCBRMTMwLjUgMjIxLjIwMzEgMTEwLjEwOTQgMjIxLjIwMzEgUTg2LjYyNSAyMjEuMjAzMSA3NC4yNSAyMDUuNTkzOCBRNjEuODc1IDE4OS45ODQ0IDYxLjg3NSAxNjAuMTcxOSBRNjEuODc1IDEzMi4zMjgxIDc3LjA2MjUgMTE1Ljg3NSBROTIuMjUgOTkuMjgxMiAxMTcuODQzOCA5OS4yODEyIFExMjQuNzM0NCA5OS4yODEyIDEzMS43NjU2IDEwMC40MDYyIFExMzguNzk2OSAxMDEuNjcxOSAxNDYuMzkwNiAxMDMuOTIxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaA3XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02MS44NzUgMTAxLjY3MTkgTDE0OC42NDA2IDEwMS42NzE5IEwxNDguNjQwNiAxMDguNDIxOSBMOTkuNzAzMSAyMTkuMDkzOCBMODAuNTc4MSAyMTkuMDkzOCBMMTI2LjcwMzEgMTE1LjAzMTIgTDYxLjg3NSAxMTUuMDMxMiBMNjEuODc1IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoDhcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEwOC4yODEyIDE2My4xMjUgUTk1LjIwMzEgMTYzLjEyNSA4Ny43NSAxNjkuMzEyNSBRODAuMjk2OSAxNzUuMzU5NCA4MC4yOTY5IDE4NS45MDYyIFE4MC4yOTY5IDE5Ni41OTM4IDg3Ljc1IDIwMi42NDA2IFE5NS4yMDMxIDIwOC42ODc1IDEwOC4yODEyIDIwOC42ODc1IFExMjEuMjE4OCAyMDguNjg3NSAxMjguODEyNSAyMDIuNSBRMTM2LjI2NTYgMTk2LjQ1MzEgMTM2LjI2NTYgMTg1LjkwNjIgUTEzNi4yNjU2IDE3NS4zNTk0IDEyOC44MTI1IDE2OS4zMTI1IFExMjEuMzU5NCAxNjMuMTI1IDEwOC4yODEyIDE2My4xMjUgWk05MCAxNTYuMjM0NCBRNzguMTg3NSAxNTMuNzAzMSA3MS43MTg4IDE0Ni44MTI1IFE2NS4xMDk0IDEzOS43ODEyIDY1LjEwOTQgMTI5LjY1NjIgUTY1LjEwOTQgMTE1LjU5MzggNzYuNjQwNiAxMDcuNDM3NSBRODguMTcxOSA5OS4yODEyIDEwOC4yODEyIDk5LjI4MTIgUTEyOC4zOTA2IDk5LjI4MTIgMTM5LjkyMTkgMTA3LjQzNzUgUTE1MS4zMTI1IDExNS41OTM4IDE1MS4zMTI1IDEyOS42NTYyIFExNTEuMzEyNSAxNDAuMDYyNSAxNDQuODQzOCAxNDYuODEyNSBRMTM4LjIzNDQgMTUzLjcwMzEgMTI2LjU2MjUgMTU2LjIzNDQgUTEzOS4yMTg4IDE1OC43NjU2IDE0Ny4wOTM4IDE2Ni45MjE5IFExNTQuNTQ2OSAxNzQuNjU2MiAxNTQuNTQ2OSAxODUuOTA2MiBRMTU0LjU0NjkgMjAyLjkyMTkgMTQyLjU5MzggMjEyLjA2MjUgUTEzMC41IDIyMS4yMDMxIDEwOC4yODEyIDIyMS4yMDMxIFE4NS45MjE5IDIyMS4yMDMxIDczLjk2ODggMjEyLjA2MjUgUTYxLjg3NSAyMDIuOTIxOSA2MS44NzUgMTg1LjkwNjIgUTYxLjg3NSAxNzQuOTM3NSA2OS4zMjgxIDE2Ni45MjE5IFE3Ni45MjE5IDE1OS4wNDY5IDkwIDE1Ni4yMzQ0IFpNODMuMjUgMTMxLjIwMzEgUTgzLjI1IDE0MC4wNjI1IDg5Ljg1OTQgMTQ1LjQwNjIgUTk2LjMyODEgMTUwLjYwOTQgMTA4LjI4MTIgMTUwLjYwOTQgUTExOS42NzE5IDE1MC42MDk0IDEyNi41NjI1IDE0NS40MDYyIFExMzMuMzEyNSAxNDAuMzQzOCAxMzMuMzEyNSAxMzEuMjAzMSBRMTMzLjMxMjUgMTIyLjM0MzggMTI2LjU2MjUgMTE3IFExMTkuOTUzMSAxMTEuNzk2OSAxMDguMjgxMiAxMTEuNzk2OSBROTYuNjA5NCAxMTEuNzk2OSA4OS44NTk0IDExNyBRODMuMjUgMTIyLjA2MjUgODMuMjUgMTMxLjIwMzEgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgOVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNzAuNTkzOCAyMTYuNTYyNSBMNzAuNTkzOCAyMDIuMDc4MSBRNzcuNDg0NCAyMDQuODkwNiA4NC41MTU2IDIwNi40Mzc1IFE5MS41NDY5IDIwNy44NDM4IDk4LjI5NjkgMjA3Ljg0MzggUTExNi40Mzc1IDIwNy44NDM4IDEyNiAxOTcuMjk2OSBRMTM1LjQyMTkgMTg2Ljc1IDEzNi44MjgxIDE2NS4wOTM4IFExMzEuOTA2MiAxNzEuNzAzMSAxMjMuNDY4OCAxNzUuNSBRMTE1LjQ1MzEgMTc5LjE1NjIgMTA1Ljc1IDE3OS4xNTYyIFE4NS41IDE3OS4xNTYyIDczLjY4NzUgMTY4LjQ2ODggUTYxLjg3NSAxNTcuNzgxMiA2MS44NzUgMTM5LjIxODggUTYxLjg3NSAxMjEuMDc4MSA3NC4xMDk0IDExMC4yNSBRODYuNDg0NCA5OS4yODEyIDEwNi44NzUgOTkuMjgxMiBRMTMwLjM1OTQgOTkuMjgxMiAxNDIuNTkzOCAxMTQuODkwNiBRMTU0Ljk2ODggMTMwLjUgMTU0Ljk2ODggMTYwLjMxMjUgUTE1NC45Njg4IDE4OC4xNTYyIDEzOS45MjE5IDIwNC42MDk0IFExMjQuNzM0NCAyMjEuMjAzMSA5OS4xNDA2IDIyMS4yMDMxIFE5Mi4yNSAyMjEuMjAzMSA4NS4yMTg4IDIyMC4wNzgxIFE3OC4xODc1IDIxOC44MTI1IDcwLjU5MzggMjE2LjU2MjUgWk0xMDYuODc1IDE2Ni43ODEyIFExMTkuMjUgMTY2Ljc4MTIgMTI2LjQyMTkgMTU5LjQ2ODggUTEzMy41OTM4IDE1Mi4xNTYyIDEzMy41OTM4IDEzOS4yMTg4IFExMzMuNTkzOCAxMjYuNTYyNSAxMjYuNDIxOSAxMTkuMjUgUTExOS4yNSAxMTEuNzk2OSAxMDYuODc1IDExMS43OTY5IFE5NC45MjE5IDExMS43OTY5IDg3LjQ2ODggMTE5LjI1IFE4MC4xNTYyIDEyNi41NjI1IDgwLjE1NjIgMTM5LjIxODggUTgwLjE1NjIgMTUyLjE1NjIgODcuNDY4OCAxNTkuNDY4OCBROTQuNjQwNiAxNjYuNzgxMiAxMDYuODc1IDE2Ni43ODEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoDEwXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xNTkuMDQ2OSAxMTEuNzk2OSBRMTQ5LjA2MjUgMTExLjc5NjkgMTQyLjAzMTIgMTIzLjg5MDYgUTEzNC44NTk0IDEzNS45ODQ0IDEzNC44NTk0IDE2MC4xNzE5IFExMzQuODU5NCAxODQuNSAxNDIuMDMxMiAxOTYuNTkzOCBRMTQ5LjA2MjUgMjA4LjY4NzUgMTU5LjA0NjkgMjA4LjY4NzUgUTE2OS4wMzEyIDIwOC42ODc1IDE3Ni4wNjI1IDE5Ni41OTM4IFExODMuMjM0NCAxODQuNSAxODMuMjM0NCAxNjAuMTcxOSBRMTgzLjIzNDQgMTM1Ljk4NDQgMTc2LjA2MjUgMTIzLjg5MDYgUTE2OS4wMzEyIDExMS43OTY5IDE1OS4wNDY5IDExMS43OTY5IFpNMTU5LjA0NjkgOTkuMjgxMiBRMTc3LjQ2ODggOTkuMjgxMiAxODkuNDIxOSAxMTQuODkwNiBRMjAxLjM3NSAxMzAuNSAyMDEuMzc1IDE2MC4xNzE5IFEyMDEuMzc1IDE4OS45ODQ0IDE4OS40MjE5IDIwNS41OTM4IFExNzcuNDY4OCAyMjEuMjAzMSAxNTkuMDQ2OSAyMjEuMjAzMSBRMTM2LjI2NTYgMjIxLjIwMzEgMTI2LjQyMTkgMjA1LjU5MzggUTExNi41NzgxIDE4OS45ODQ0IDExNi41NzgxIDE2MC4xNzE5IFExMTYuNTc4MSAxMzAuNSAxMjYuNDIxOSAxMTQuODkwNiBRMTM2LjI2NTYgOTkuMjgxMiAxNTkuMDQ2OSA5OS4yODEyIFpNODAuNTc4MSAyMTkuMDkzOCBMODAuNTc4MSAxMTcuNzAzMSBMNjEuODc1IDEyMy40Njg4IEw2MS44NzUgMTA3LjE1NjIgTDgxLjU2MjUgMTAxLjY3MTkgTDEwMC44MjgxIDEwMS42NzE5IEwxMDAuODI4MSAyMTkuMDkzOCBMODAuNTc4MSAyMTkuMDkzOCBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaBKXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk04OS4xNTYyIDEwMS42NzE5IEwxMDcuMDE1NiAxMDEuNjcxOSBMMTA3LjAxNTYgMTc4LjczNDQgUTEwNy4wMTU2IDE5OS42ODc1IDk3Ljg3NSAyMDkuNTMxMiBRODguODc1IDIxOS4yMzQ0IDY4Ljc2NTYgMjE5LjIzNDQgTDYxLjg3NSAyMTkuMjM0NCBMNjEuODc1IDIwNS43MzQ0IEw2Ny41IDIwNS43MzQ0IFE3OS4zMTI1IDIwNS43MzQ0IDg0LjIzNDQgMTk5LjgyODEgUTg5LjE1NjIgMTkzLjkyMTkgODkuMTU2MiAxNzguNzM0NCBMODkuMTU2MiAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaBRXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xMDcuMjk2OSAyMjEuMDYyNSBRMTA2LjczNDQgMjIxLjA2MjUgMTA1LjUzOTEgMjIxLjEzMjggUTEwNC4zNDM4IDIyMS4yMDMxIDEwMy42NDA2IDIyMS4yMDMxIFE4MS40MjE5IDIyMS4yMDMxIDcwLjUyMzQgMjA2LjA4NTkgUTU5LjYyNSAxOTAuOTY4OCA1OS42MjUgMTYwLjMxMjUgUTU5LjYyNSAxMjkuNTE1NiA3MC41OTM4IDExNC4zOTg0IFE4MS41NjI1IDk5LjI4MTIgMTAzLjc4MTIgOTkuMjgxMiBRMTI2LjE0MDYgOTkuMjgxMiAxMzcuMTA5NCAxMTQuMzk4NCBRMTQ4LjA3ODEgMTI5LjUxNTYgMTQ4LjA3ODEgMTYwLjMxMjUgUTE0OC4wNzgxIDE4My41MTU2IDE0Mi4wMzEyIDE5Ny42NDg0IFExMzUuOTg0NCAyMTEuNzgxMiAxMjMuNjA5NCAyMTcuNDA2MiBMMTQxLjMyODEgMjMyLjMxMjUgTDEyNy45Njg4IDI0MC4xODc1IEwxMDcuMjk2OSAyMjEuMDYyNSBaTTEyOS4zNzUgMTYwLjMxMjUgUTEyOS4zNzUgMTM0LjQzNzUgMTIzLjM5ODQgMTIzLjMyODEgUTExNy40MjE5IDExMi4yMTg4IDEwMy43ODEyIDExMi4yMTg4IFE5MC4yODEyIDExMi4yMTg4IDg0LjMwNDcgMTIzLjMyODEgUTc4LjMyODEgMTM0LjQzNzUgNzguMzI4MSAxNjAuMzEyNSBRNzguMzI4MSAxODYuMTg3NSA4NC4zMDQ3IDE5Ny4yOTY5IFE5MC4yODEyIDIwOC40MDYyIDEwMy43ODEyIDIwOC40MDYyIFExMTcuNDIxOSAyMDguNDA2MiAxMjMuMzk4NCAxOTcuMjk2OSBRMTI5LjM3NSAxODYuMTg3NSAxMjkuMzc1IDE2MC4zMTI1IFpNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoEtcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTYxLjg3NSAxMDEuNjcxOSBMNzkuNzM0NCAxMDEuNjcxOSBMNzkuNzM0NCAxNTEuMzEyNSBMMTMwLjY0MDYgMTAxLjY3MTkgTDE1My43MDMxIDEwMS42NzE5IEw5Ni40Njg4IDE1Ni41MTU2IEwxNTguMzQzOCAyMTkuMjM0NCBMMTM0Ljg1OTQgMjE5LjIzNDQgTDc5LjczNDQgMTYyLjU2MjUgTDc5LjczNDQgMjE5LjIzNDQgTDYxLjg3NSAyMTkuMjM0NCBMNjEuODc1IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpUFcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTExMC42NzE5IDExNS43MzQ0IEw5MS44MjgxIDE3NS43ODEyIEwxMjkuNTE1NiAxNzUuNzgxMiBMMTEwLjY3MTkgMTE1LjczNDQgWk05OS45ODQ0IDEwMS42NzE5IEwxMjEuNjQwNiAxMDEuNjcxOSBMMTYyLjE0MDYgMjE5LjIzNDQgTDE0My41NzgxIDIxOS4yMzQ0IEwxMzQuMDE1NiAxODguNTc4MSBMODcuNjA5NCAxODguNTc4MSBMNzguMDQ2OSAyMTkuMjM0NCBMNTkuNDg0NCAyMTkuMjM0NCBMOTkuOTg0NCAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaUyXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODYuMzQzOCAyMDMuMDYyNSBMMTQ1Ljk2ODggMjAzLjA2MjUgTDE0NS45Njg4IDIxOS4wOTM4IEw2MS44NzUgMjE5LjA5MzggTDYxLjg3NSAyMDMuNjI1IFE2Ni42NTYyIDE5OS4yNjU2IDc1LjUxNTYgMTkxLjM5MDYgUTEyMy44OTA2IDE0OC41IDEyMy44OTA2IDEzNS4yODEyIFExMjMuODkwNiAxMjYgMTE2LjU3ODEgMTIwLjMwNDcgUTEwOS4yNjU2IDExNC42MDk0IDk3LjMxMjUgMTE0LjYwOTQgUTkwIDExNC42MDk0IDgxLjQyMTkgMTE3LjA3MDMgUTcyLjg0MzggMTE5LjUzMTIgNjIuNzE4OCAxMjQuNDUzMSBMNjIuNzE4OCAxMDcuMTU2MiBRNzMuNTQ2OSAxMDMuMjE4OCA4Mi44OTg0IDEwMS4yNSBROTIuMjUgOTkuMjgxMiAxMDAuMjY1NiA5OS4yODEyIFExMjAuNjU2MiA5OS4yODEyIDEzMi44OTA2IDEwOC41NjI1IFExNDUuMTI1IDExNy44NDM4IDE0NS4xMjUgMTMzLjAzMTIgUTE0NS4xMjUgMTUyLjU3ODEgOTguNTc4MSAxOTIuNTE1NiBROTAuNzAzMSAxOTkuMjY1NiA4Ni4zNDM4IDIwMy4wNjI1IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpTNcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi42ODc1IDI3My42NTYyIFExNzUuNzgxMiAyNTcuMDYyNSAxODMuNTE1NiAyNDguMzQzOCBRMTkyLjIzNDQgMjM4LjM1OTQgMjA0LjA0NjkgMjM4LjM1OTQgUTIyMy41OTM4IDIzOC4zNTk0IDIzMi4zMTI1IDI1OS4zMTI1IFEyMzQuOTg0NCAyNjUuNjQwNiAyMzQuOTg0NCAyNzMuOTM3NSBRMjM0Ljk4NDQgMjk2LjE1NjIgMjE3LjQwNjIgMzE4LjUxNTYgTDE3Mi45Njg4IDM3NS4wNDY5IEwxMjcuOTY4OCAzMTguNTE1NiBRMTEwLjM5MDYgMjk2LjQzNzUgMTEwLjM5MDYgMjczLjkzNzUgUTExMC4zOTA2IDI2NS42NDA2IDExMy4wNjI1IDI1OS4zMTI1IFExMjEuOTIxOSAyMzguMzU5NCAxNDEuMzI4MSAyMzguMzU5NCBRMTUzLjQyMTkgMjM4LjM1OTQgMTYxLjg1OTQgMjQ4LjM0MzggUTE2OS41OTM4IDI1Ny40ODQ0IDE3Mi42ODc1IDI3My42NTYyIFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMjEuNzgxMiAxNTUuNTMxMiBRMTM0LjcxODggMTU4LjA2MjUgMTQxLjgyMDMgMTY1LjcyNjYgUTE0OC45MjE5IDE3My4zOTA2IDE0OC45MjE5IDE4NC45MjE5IFExNDguOTIxOSAyMDIuMzU5NCAxMzUuNTYyNSAyMTEuNzgxMiBRMTIyLjIwMzEgMjIxLjIwMzEgOTcuMzEyNSAyMjEuMjAzMSBRODkuMjk2OSAyMjEuMjAzMSA4MC41MDc4IDIxOS43MjY2IFE3MS43MTg4IDIxOC4yNSA2MS44NzUgMjE1LjQzNzUgTDYxLjg3NSAxOTguNDIxOSBRNjkuMTg3NSAyMDIuMjE4OCA3Ny41NTQ3IDIwNC4wNDY5IFE4NS45MjE5IDIwNS44NzUgOTUuMzQzOCAyMDUuODc1IFExMTAuNjcxOSAyMDUuODc1IDExOS4xMDk0IDIwMC4zMjAzIFExMjcuNTQ2OSAxOTQuNzY1NiAxMjcuNTQ2OSAxODQuOTIxOSBRMTI3LjU0NjkgMTc0LjUxNTYgMTE5Ljc0MjIgMTY5LjE3MTkgUTExMS45Mzc1IDE2My44MjgxIDk2Ljc1IDE2My44MjgxIEw4NC42NTYyIDE2My44MjgxIEw4NC42NTYyIDE0OC42NDA2IEw5Ny44NzUgMTQ4LjY0MDYgUTExMS4wOTM4IDE0OC42NDA2IDExNy45MTQxIDE0NC4yMTA5IFExMjQuNzM0NCAxMzkuNzgxMiAxMjQuNzM0NCAxMzEuMzQzOCBRMTI0LjczNDQgMTIzLjE4NzUgMTE3LjcwMzEgMTE4Ljg5ODQgUTExMC42NzE5IDExNC42MDk0IDk3LjMxMjUgMTE0LjYwOTQgUTkxLjY4NzUgMTE0LjYwOTQgODQuNTE1NiAxMTUuODc1IFE3Ny4zNDM4IDExNy4xNDA2IDY1Ljk1MzEgMTIwLjM3NSBMNjUuOTUzMSAxMDQuMjAzMSBRNzYuMjE4OCAxMDEuODEyNSA4NS4yMTg4IDEwMC41NDY5IFE5NC4yMTg4IDk5LjI4MTIgMTAxLjk1MzEgOTkuMjgxMiBRMTIyLjIwMzEgOTkuMjgxMiAxMzQuMDg1OSAxMDcuNTc4MSBRMTQ1Ljk2ODggMTE1Ljg3NSAxNDUuOTY4OCAxMjkuNzk2OSBRMTQ1Ljk2ODggMTM5LjUgMTM5LjY0MDYgMTQ2LjI1IFExMzMuMzEyNSAxNTMgMTIxLjc4MTIgMTU1LjUzMTIgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlNFxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEyMC4wOTM4IDExOC42ODc1IEw3Ni42NDA2IDE3Ny42MDk0IEwxMjAuMDkzOCAxNzcuNjA5NCBMMTIwLjA5MzggMTE4LjY4NzUgWk0xMTcgMTAxLjY3MTkgTDE0MC4zNDM4IDEwMS42NzE5IEwxNDAuMzQzOCAxNzcuNjA5NCBMMTU5LjMyODEgMTc3LjYwOTQgTDE1OS4zMjgxIDE5Mi45Mzc1IEwxNDAuMzQzOCAxOTIuOTM3NSBMMTQwLjM0MzggMjE5LjA5MzggTDEyMC4wOTM4IDIxOS4wOTM4IEwxMjAuMDkzOCAxOTIuOTM3NSBMNjEuODc1IDE5Mi45Mzc1IEw2MS44NzUgMTc1LjkyMTkgTDExNyAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaU1XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjcuNSAxMDEuNjcxOSBMMTM5LjIxODggMTAxLjY3MTkgTDEzOS4yMTg4IDExNS4wMzEyIEw4NC4yMzQ0IDExNS4wMzEyIEw4NC4yMzQ0IDE0My43MTg4IFE4OC4xNzE5IDE0Mi40NTMxIDkyLjI1IDE0MS44OTA2IFE5Ni4xODc1IDE0MS4zMjgxIDEwMC4xMjUgMTQxLjMyODEgUTEyMi43NjU2IDE0MS4zMjgxIDEzNS45ODQ0IDE1Mi4xNTYyIFExNDkuMjAzMSAxNjIuODQzOCAxNDkuMjAzMSAxODEuMjY1NiBRMTQ5LjIwMzEgMjAwLjI1IDEzNS41NjI1IDIxMC43OTY5IFExMjIuMDYyNSAyMjEuMjAzMSA5Ny4zMTI1IDIyMS4yMDMxIFE4OC44NzUgMjIxLjIwMzEgODAuMDE1NiAyMTkuOTM3NSBRNzEuMTU2MiAyMTguNjcxOSA2MS44NzUgMjE2LjE0MDYgTDYxLjg3NSAyMDAuMjUgUTY5Ljg5MDYgMjA0LjA0NjkgNzguNjA5NCAyMDYuMDE1NiBRODcuMzI4MSAyMDcuODQzOCA5Ny4wMzEyIDIwNy44NDM4IFExMTIuNjQwNiAyMDcuODQzOCAxMjEuNzgxMiAyMDAuNjcxOSBRMTMwLjkyMTkgMTkzLjUgMTMwLjkyMTkgMTgxLjI2NTYgUTEzMC45MjE5IDE2OS4wMzEyIDEyMS43ODEyIDE2MS44NTk0IFExMTIuNjQwNiAxNTQuNjg3NSA5Ny4wMzEyIDE1NC42ODc1IFE4OS43MTg4IDE1NC42ODc1IDgyLjQwNjIgMTU2LjA5MzggUTc1LjA5MzggMTU3LjUgNjcuNSAxNjAuNDUzMSBMNjcuNSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaU2XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTEwLjEwOTQgMTUzLjcwMzEgUTk3LjczNDQgMTUzLjcwMzEgOTAuNTYyNSAxNjEuMDE1NiBRODMuMzkwNiAxNjguNDY4OCA4My4zOTA2IDE4MS4yNjU2IFE4My4zOTA2IDE5My45MjE5IDkwLjU2MjUgMjAxLjIzNDQgUTk3LjczNDQgMjA4LjY4NzUgMTEwLjEwOTQgMjA4LjY4NzUgUTEyMi4zNDM4IDIwOC42ODc1IDEyOS41MTU2IDIwMS4yMzQ0IFExMzYuNjg3NSAxOTMuOTIxOSAxMzYuNjg3NSAxODEuMjY1NiBRMTM2LjY4NzUgMTY4LjQ2ODggMTI5LjUxNTYgMTYxLjAxNTYgUTEyMi4zNDM4IDE1My43MDMxIDExMC4xMDk0IDE1My43MDMxIFpNMTQ2LjM5MDYgMTAzLjkyMTkgTDE0Ni4zOTA2IDExOC40MDYyIFExMzkuNSAxMTUuNTkzOCAxMzIuNDY4OCAxMTQuMTg3NSBRMTI1LjQzNzUgMTEyLjY0MDYgMTE4LjU0NjkgMTEyLjY0MDYgUTEwMC41NDY5IDExMi42NDA2IDkwLjk4NDQgMTIzLjE4NzUgUTgxLjQyMTkgMTMzLjg3NSA4MC4wMTU2IDE1NS4zOTA2IFE4NS4zNTk0IDE0OC41IDkzLjM3NSAxNDQuODQzOCBRMTAxLjUzMTIgMTQxLjE4NzUgMTExLjA5MzggMTQxLjE4NzUgUTEzMS40ODQ0IDE0MS4xODc1IDE0My4yOTY5IDE1MS44NzUgUTE1NS4xMDk0IDE2Mi43MDMxIDE1NS4xMDk0IDE4MS4yNjU2IFExNTUuMTA5NCAxOTkuMTI1IDE0Mi43MzQ0IDIxMC4yMzQ0IFExMzAuNSAyMjEuMjAzMSAxMTAuMTA5NCAyMjEuMjAzMSBRODYuNjI1IDIyMS4yMDMxIDc0LjI1IDIwNS41OTM4IFE2MS44NzUgMTg5Ljk4NDQgNjEuODc1IDE2MC4xNzE5IFE2MS44NzUgMTMyLjMyODEgNzcuMDYyNSAxMTUuODc1IFE5Mi4yNSA5OS4yODEyIDExNy44NDM4IDk5LjI4MTIgUTEyNC43MzQ0IDk5LjI4MTIgMTMxLjc2NTYgMTAwLjQwNjIgUTEzOC43OTY5IDEwMS42NzE5IDE0Ni4zOTA2IDEwMy45MjE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpTdcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi42ODc1IDI3My42NTYyIFExNzUuNzgxMiAyNTcuMDYyNSAxODMuNTE1NiAyNDguMzQzOCBRMTkyLjIzNDQgMjM4LjM1OTQgMjA0LjA0NjkgMjM4LjM1OTQgUTIyMy41OTM4IDIzOC4zNTk0IDIzMi4zMTI1IDI1OS4zMTI1IFEyMzQuOTg0NCAyNjUuNjQwNiAyMzQuOTg0NCAyNzMuOTM3NSBRMjM0Ljk4NDQgMjk2LjE1NjIgMjE3LjQwNjIgMzE4LjUxNTYgTDE3Mi45Njg4IDM3NS4wNDY5IEwxMjcuOTY4OCAzMTguNTE1NiBRMTEwLjM5MDYgMjk2LjQzNzUgMTEwLjM5MDYgMjczLjkzNzUgUTExMC4zOTA2IDI2NS42NDA2IDExMy4wNjI1IDI1OS4zMTI1IFExMjEuOTIxOSAyMzguMzU5NCAxNDEuMzI4MSAyMzguMzU5NCBRMTUzLjQyMTkgMjM4LjM1OTQgMTYxLjg1OTQgMjQ4LjM0MzggUTE2OS41OTM4IDI1Ny40ODQ0IDE3Mi42ODc1IDI3My42NTYyIFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02MS44NzUgMTAxLjY3MTkgTDE0OC42NDA2IDEwMS42NzE5IEwxNDguNjQwNiAxMDguNDIxOSBMOTkuNzAzMSAyMTkuMDkzOCBMODAuNTc4MSAyMTkuMDkzOCBMMTI2LjcwMzEgMTE1LjAzMTIgTDYxLjg3NSAxMTUuMDMxMiBMNjEuODc1IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpThcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi42ODc1IDI3My42NTYyIFExNzUuNzgxMiAyNTcuMDYyNSAxODMuNTE1NiAyNDguMzQzOCBRMTkyLjIzNDQgMjM4LjM1OTQgMjA0LjA0NjkgMjM4LjM1OTQgUTIyMy41OTM4IDIzOC4zNTk0IDIzMi4zMTI1IDI1OS4zMTI1IFEyMzQuOTg0NCAyNjUuNjQwNiAyMzQuOTg0NCAyNzMuOTM3NSBRMjM0Ljk4NDQgMjk2LjE1NjIgMjE3LjQwNjIgMzE4LjUxNTYgTDE3Mi45Njg4IDM3NS4wNDY5IEwxMjcuOTY4OCAzMTguNTE1NiBRMTEwLjM5MDYgMjk2LjQzNzUgMTEwLjM5MDYgMjczLjkzNzUgUTExMC4zOTA2IDI2NS42NDA2IDExMy4wNjI1IDI1OS4zMTI1IFExMjEuOTIxOSAyMzguMzU5NCAxNDEuMzI4MSAyMzguMzU5NCBRMTUzLjQyMTkgMjM4LjM1OTQgMTYxLjg1OTQgMjQ4LjM0MzggUTE2OS41OTM4IDI1Ny40ODQ0IDE3Mi42ODc1IDI3My42NTYyIFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMDguMjgxMiAxNjMuMTI1IFE5NS4yMDMxIDE2My4xMjUgODcuNzUgMTY5LjMxMjUgUTgwLjI5NjkgMTc1LjM1OTQgODAuMjk2OSAxODUuOTA2MiBRODAuMjk2OSAxOTYuNTkzOCA4Ny43NSAyMDIuNjQwNiBROTUuMjAzMSAyMDguNjg3NSAxMDguMjgxMiAyMDguNjg3NSBRMTIxLjIxODggMjA4LjY4NzUgMTI4LjgxMjUgMjAyLjUgUTEzNi4yNjU2IDE5Ni40NTMxIDEzNi4yNjU2IDE4NS45MDYyIFExMzYuMjY1NiAxNzUuMzU5NCAxMjguODEyNSAxNjkuMzEyNSBRMTIxLjM1OTQgMTYzLjEyNSAxMDguMjgxMiAxNjMuMTI1IFpNOTAgMTU2LjIzNDQgUTc4LjE4NzUgMTUzLjcwMzEgNzEuNzE4OCAxNDYuODEyNSBRNjUuMTA5NCAxMzkuNzgxMiA2NS4xMDk0IDEyOS42NTYyIFE2NS4xMDk0IDExNS41OTM4IDc2LjY0MDYgMTA3LjQzNzUgUTg4LjE3MTkgOTkuMjgxMiAxMDguMjgxMiA5OS4yODEyIFExMjguMzkwNiA5OS4yODEyIDEzOS45MjE5IDEwNy40Mzc1IFExNTEuMzEyNSAxMTUuNTkzOCAxNTEuMzEyNSAxMjkuNjU2MiBRMTUxLjMxMjUgMTQwLjA2MjUgMTQ0Ljg0MzggMTQ2LjgxMjUgUTEzOC4yMzQ0IDE1My43MDMxIDEyNi41NjI1IDE1Ni4yMzQ0IFExMzkuMjE4OCAxNTguNzY1NiAxNDcuMDkzOCAxNjYuOTIxOSBRMTU0LjU0NjkgMTc0LjY1NjIgMTU0LjU0NjkgMTg1LjkwNjIgUTE1NC41NDY5IDIwMi45MjE5IDE0Mi41OTM4IDIxMi4wNjI1IFExMzAuNSAyMjEuMjAzMSAxMDguMjgxMiAyMjEuMjAzMSBRODUuOTIxOSAyMjEuMjAzMSA3My45Njg4IDIxMi4wNjI1IFE2MS44NzUgMjAyLjkyMTkgNjEuODc1IDE4NS45MDYyIFE2MS44NzUgMTc0LjkzNzUgNjkuMzI4MSAxNjYuOTIxOSBRNzYuOTIxOSAxNTkuMDQ2OSA5MCAxNTYuMjM0NCBaTTgzLjI1IDEzMS4yMDMxIFE4My4yNSAxNDAuMDYyNSA4OS44NTk0IDE0NS40MDYyIFE5Ni4zMjgxIDE1MC42MDk0IDEwOC4yODEyIDE1MC42MDk0IFExMTkuNjcxOSAxNTAuNjA5NCAxMjYuNTYyNSAxNDUuNDA2MiBRMTMzLjMxMjUgMTQwLjM0MzggMTMzLjMxMjUgMTMxLjIwMzEgUTEzMy4zMTI1IDEyMi4zNDM4IDEyNi41NjI1IDExNyBRMTE5Ljk1MzEgMTExLjc5NjkgMTA4LjI4MTIgMTExLjc5NjkgUTk2LjYwOTQgMTExLjc5NjkgODkuODU5NCAxMTcgUTgzLjI1IDEyMi4wNjI1IDgzLjI1IDEzMS4yMDMxIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpTlcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi42ODc1IDI3My42NTYyIFExNzUuNzgxMiAyNTcuMDYyNSAxODMuNTE1NiAyNDguMzQzOCBRMTkyLjIzNDQgMjM4LjM1OTQgMjA0LjA0NjkgMjM4LjM1OTQgUTIyMy41OTM4IDIzOC4zNTk0IDIzMi4zMTI1IDI1OS4zMTI1IFEyMzQuOTg0NCAyNjUuNjQwNiAyMzQuOTg0NCAyNzMuOTM3NSBRMjM0Ljk4NDQgMjk2LjE1NjIgMjE3LjQwNjIgMzE4LjUxNTYgTDE3Mi45Njg4IDM3NS4wNDY5IEwxMjcuOTY4OCAzMTguNTE1NiBRMTEwLjM5MDYgMjk2LjQzNzUgMTEwLjM5MDYgMjczLjkzNzUgUTExMC4zOTA2IDI2NS42NDA2IDExMy4wNjI1IDI1OS4zMTI1IFExMjEuOTIxOSAyMzguMzU5NCAxNDEuMzI4MSAyMzguMzU5NCBRMTUzLjQyMTkgMjM4LjM1OTQgMTYxLjg1OTQgMjQ4LjM0MzggUTE2OS41OTM4IDI1Ny40ODQ0IDE3Mi42ODc1IDI3My42NTYyIFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk03MC41OTM4IDIxNi41NjI1IEw3MC41OTM4IDIwMi4wNzgxIFE3Ny40ODQ0IDIwNC44OTA2IDg0LjUxNTYgMjA2LjQzNzUgUTkxLjU0NjkgMjA3Ljg0MzggOTguMjk2OSAyMDcuODQzOCBRMTE2LjQzNzUgMjA3Ljg0MzggMTI2IDE5Ny4yOTY5IFExMzUuNDIxOSAxODYuNzUgMTM2LjgyODEgMTY1LjA5MzggUTEzMS45MDYyIDE3MS43MDMxIDEyMy40Njg4IDE3NS41IFExMTUuNDUzMSAxNzkuMTU2MiAxMDUuNzUgMTc5LjE1NjIgUTg1LjUgMTc5LjE1NjIgNzMuNjg3NSAxNjguNDY4OCBRNjEuODc1IDE1Ny43ODEyIDYxLjg3NSAxMzkuMjE4OCBRNjEuODc1IDEyMS4wNzgxIDc0LjEwOTQgMTEwLjI1IFE4Ni40ODQ0IDk5LjI4MTIgMTA2Ljg3NSA5OS4yODEyIFExMzAuMzU5NCA5OS4yODEyIDE0Mi41OTM4IDExNC44OTA2IFExNTQuOTY4OCAxMzAuNSAxNTQuOTY4OCAxNjAuMzEyNSBRMTU0Ljk2ODggMTg4LjE1NjIgMTM5LjkyMTkgMjA0LjYwOTQgUTEyNC43MzQ0IDIyMS4yMDMxIDk5LjE0MDYgMjIxLjIwMzEgUTkyLjI1IDIyMS4yMDMxIDg1LjIxODggMjIwLjA3ODEgUTc4LjE4NzUgMjE4LjgxMjUgNzAuNTkzOCAyMTYuNTYyNSBaTTEwNi44NzUgMTY2Ljc4MTIgUTExOS4yNSAxNjYuNzgxMiAxMjYuNDIxOSAxNTkuNDY4OCBRMTMzLjU5MzggMTUyLjE1NjIgMTMzLjU5MzggMTM5LjIxODggUTEzMy41OTM4IDEyNi41NjI1IDEyNi40MjE5IDExOS4yNSBRMTE5LjI1IDExMS43OTY5IDEwNi44NzUgMTExLjc5NjkgUTk0LjkyMTkgMTExLjc5NjkgODcuNDY4OCAxMTkuMjUgUTgwLjE1NjIgMTI2LjU2MjUgODAuMTU2MiAxMzkuMjE4OCBRODAuMTU2MiAxNTIuMTU2MiA4Ny40Njg4IDE1OS40Njg4IFE5NC42NDA2IDE2Ni43ODEyIDEwNi44NzUgMTY2Ljc4MTIgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlMTBcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi42ODc1IDI3My42NTYyIFExNzUuNzgxMiAyNTcuMDYyNSAxODMuNTE1NiAyNDguMzQzOCBRMTkyLjIzNDQgMjM4LjM1OTQgMjA0LjA0NjkgMjM4LjM1OTQgUTIyMy41OTM4IDIzOC4zNTk0IDIzMi4zMTI1IDI1OS4zMTI1IFEyMzQuOTg0NCAyNjUuNjQwNiAyMzQuOTg0NCAyNzMuOTM3NSBRMjM0Ljk4NDQgMjk2LjE1NjIgMjE3LjQwNjIgMzE4LjUxNTYgTDE3Mi45Njg4IDM3NS4wNDY5IEwxMjcuOTY4OCAzMTguNTE1NiBRMTEwLjM5MDYgMjk2LjQzNzUgMTEwLjM5MDYgMjczLjkzNzUgUTExMC4zOTA2IDI2NS42NDA2IDExMy4wNjI1IDI1OS4zMTI1IFExMjEuOTIxOSAyMzguMzU5NCAxNDEuMzI4MSAyMzguMzU5NCBRMTUzLjQyMTkgMjM4LjM1OTQgMTYxLjg1OTQgMjQ4LjM0MzggUTE2OS41OTM4IDI1Ny40ODQ0IDE3Mi42ODc1IDI3My42NTYyIFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xNTkuMDQ2OSAxMTEuNzk2OSBRMTQ5LjA2MjUgMTExLjc5NjkgMTQyLjAzMTIgMTIzLjg5MDYgUTEzNC44NTk0IDEzNS45ODQ0IDEzNC44NTk0IDE2MC4xNzE5IFExMzQuODU5NCAxODQuNSAxNDIuMDMxMiAxOTYuNTkzOCBRMTQ5LjA2MjUgMjA4LjY4NzUgMTU5LjA0NjkgMjA4LjY4NzUgUTE2OS4wMzEyIDIwOC42ODc1IDE3Ni4wNjI1IDE5Ni41OTM4IFExODMuMjM0NCAxODQuNSAxODMuMjM0NCAxNjAuMTcxOSBRMTgzLjIzNDQgMTM1Ljk4NDQgMTc2LjA2MjUgMTIzLjg5MDYgUTE2OS4wMzEyIDExMS43OTY5IDE1OS4wNDY5IDExMS43OTY5IFpNMTU5LjA0NjkgOTkuMjgxMiBRMTc3LjQ2ODggOTkuMjgxMiAxODkuNDIxOSAxMTQuODkwNiBRMjAxLjM3NSAxMzAuNSAyMDEuMzc1IDE2MC4xNzE5IFEyMDEuMzc1IDE4OS45ODQ0IDE4OS40MjE5IDIwNS41OTM4IFExNzcuNDY4OCAyMjEuMjAzMSAxNTkuMDQ2OSAyMjEuMjAzMSBRMTM2LjI2NTYgMjIxLjIwMzEgMTI2LjQyMTkgMjA1LjU5MzggUTExNi41NzgxIDE4OS45ODQ0IDExNi41NzgxIDE2MC4xNzE5IFExMTYuNTc4MSAxMzAuNSAxMjYuNDIxOSAxMTQuODkwNiBRMTM2LjI2NTYgOTkuMjgxMiAxNTkuMDQ2OSA5OS4yODEyIFpNODAuNTc4MSAyMTkuMDkzOCBMODAuNTc4MSAxMTcuNzAzMSBMNjEuODc1IDEyMy40Njg4IEw2MS44NzUgMTA3LjE1NjIgTDgxLjU2MjUgMTAxLjY3MTkgTDEwMC44MjgxIDEwMS42NzE5IEwxMDAuODI4MSAyMTkuMDkzOCBMODAuNTc4MSAyMTkuMDkzOCBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaVKXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODkuMTU2MiAxMDEuNjcxOSBMMTA3LjAxNTYgMTAxLjY3MTkgTDEwNy4wMTU2IDE3OC43MzQ0IFExMDcuMDE1NiAxOTkuNjg3NSA5Ny44NzUgMjA5LjUzMTIgUTg4Ljg3NSAyMTkuMjM0NCA2OC43NjU2IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAyMDUuNzM0NCBMNjcuNSAyMDUuNzM0NCBRNzkuMzEyNSAyMDUuNzM0NCA4NC4yMzQ0IDE5OS44MjgxIFE4OS4xNTYyIDE5My45MjE5IDg5LjE1NjIgMTc4LjczNDQgTDg5LjE1NjIgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlUVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTA3LjI5NjkgMjIxLjA2MjUgUTEwNi43MzQ0IDIyMS4wNjI1IDEwNS41MzkxIDIyMS4xMzI4IFExMDQuMzQzOCAyMjEuMjAzMSAxMDMuNjQwNiAyMjEuMjAzMSBRODEuNDIxOSAyMjEuMjAzMSA3MC41MjM0IDIwNi4wODU5IFE1OS42MjUgMTkwLjk2ODggNTkuNjI1IDE2MC4zMTI1IFE1OS42MjUgMTI5LjUxNTYgNzAuNTkzOCAxMTQuMzk4NCBRODEuNTYyNSA5OS4yODEyIDEwMy43ODEyIDk5LjI4MTIgUTEyNi4xNDA2IDk5LjI4MTIgMTM3LjEwOTQgMTE0LjM5ODQgUTE0OC4wNzgxIDEyOS41MTU2IDE0OC4wNzgxIDE2MC4zMTI1IFExNDguMDc4MSAxODMuNTE1NiAxNDIuMDMxMiAxOTcuNjQ4NCBRMTM1Ljk4NDQgMjExLjc4MTIgMTIzLjYwOTQgMjE3LjQwNjIgTDE0MS4zMjgxIDIzMi4zMTI1IEwxMjcuOTY4OCAyNDAuMTg3NSBMMTA3LjI5NjkgMjIxLjA2MjUgWk0xMjkuMzc1IDE2MC4zMTI1IFExMjkuMzc1IDEzNC40Mzc1IDEyMy4zOTg0IDEyMy4zMjgxIFExMTcuNDIxOSAxMTIuMjE4OCAxMDMuNzgxMiAxMTIuMjE4OCBROTAuMjgxMiAxMTIuMjE4OCA4NC4zMDQ3IDEyMy4zMjgxIFE3OC4zMjgxIDEzNC40Mzc1IDc4LjMyODEgMTYwLjMxMjUgUTc4LjMyODEgMTg2LjE4NzUgODQuMzA0NyAxOTcuMjk2OSBROTAuMjgxMiAyMDguNDA2MiAxMDMuNzgxMiAyMDguNDA2MiBRMTE3LjQyMTkgMjA4LjQwNjIgMTIzLjM5ODQgMTk3LjI5NjkgUTEyOS4zNzUgMTg2LjE4NzUgMTI5LjM3NSAxNjAuMzEyNSBaTTE3Mi42ODc1IDI3My42NTYyIFExNzUuNzgxMiAyNTcuMDYyNSAxODMuNTE1NiAyNDguMzQzOCBRMTkyLjIzNDQgMjM4LjM1OTQgMjA0LjA0NjkgMjM4LjM1OTQgUTIyMy41OTM4IDIzOC4zNTk0IDIzMi4zMTI1IDI1OS4zMTI1IFEyMzQuOTg0NCAyNjUuNjQwNiAyMzQuOTg0NCAyNzMuOTM3NSBRMjM0Ljk4NDQgMjk2LjE1NjIgMjE3LjQwNjIgMzE4LjUxNTYgTDE3Mi45Njg4IDM3NS4wNDY5IEwxMjcuOTY4OCAzMTguNTE1NiBRMTEwLjM5MDYgMjk2LjQzNzUgMTEwLjM5MDYgMjczLjkzNzUgUTExMC4zOTA2IDI2NS42NDA2IDExMy4wNjI1IDI1OS4zMTI1IFExMjEuOTIxOSAyMzguMzU5NCAxNDEuMzI4MSAyMzguMzU5NCBRMTUzLjQyMTkgMjM4LjM1OTQgMTYxLjg1OTQgMjQ4LjM0MzggUTE2OS41OTM4IDI1Ny40ODQ0IDE3Mi42ODc1IDI3My42NTYyIFpNNjQuMjY1NiA4NC43OTY5IFE0Ny4zOTA2IDg0Ljc5NjkgNDcuMzkwNiAxMDEuNjcxOSBMNDcuMzkwNiAzNzAuNjg3NSBRNDcuMzkwNiAzODcuNTYyNSA2NC4yNjU2IDM4Ny41NjI1IEwyMzUuMTI1IDM4Ny41NjI1IFEyNTIgMzg3LjU2MjUgMjUyIDM3MC42ODc1IEwyNTIgMTAxLjY3MTkgUTI1MiA4NC43OTY5IDIzNS4xMjUgODQuNzk2OSBMNjQuMjY1NiA4NC43OTY5IFpNNjQuMjY1NiA2Ny45MjE5IEwyMzUuMTI1IDY3LjkyMTkgUTI2OC44NzUgNjcuOTIxOSAyNjguODc1IDEwMS42NzE5IEwyNjguODc1IDM3MC42ODc1IFEyNjguODc1IDQwNC40Mzc1IDIzNS4xMjUgNDA0LjQzNzUgTDY0LjI2NTYgNDA0LjQzNzUgUTMwLjUxNTYgNDA0LjQzNzUgMzAuNTE1NiAzNzAuNjg3NSBMMzAuNTE1NiAxMDEuNjcxOSBRMzAuNTE1NiA2Ny45MjE5IDY0LjI2NTYgNjcuOTIxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaVLXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjEuODc1IDEwMS42NzE5IEw3OS43MzQ0IDEwMS42NzE5IEw3OS43MzQ0IDE1MS4zMTI1IEwxMzAuNjQwNiAxMDEuNjcxOSBMMTUzLjcwMzEgMTAxLjY3MTkgTDk2LjQ2ODggMTU2LjUxNTYgTDE1OC4zNDM4IDIxOS4yMzQ0IEwxMzQuODU5NCAyMTkuMjM0NCBMNzkuNzM0NCAxNjIuNTYyNSBMNzkuNzM0NCAyMTkuMjM0NCBMNjEuODc1IDIxOS4yMzQ0IEw2MS44NzUgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmQVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTExMC42NzE5IDExNS43MzQ0IEw5MS44MjgxIDE3NS43ODEyIEwxMjkuNTE1NiAxNzUuNzgxMiBMMTEwLjY3MTkgMTE1LjczNDQgWk05OS45ODQ0IDEwMS42NzE5IEwxMjEuNjQwNiAxMDEuNjcxOSBMMTYyLjE0MDYgMjE5LjIzNDQgTDE0My41NzgxIDIxOS4yMzQ0IEwxMzQuMDE1NiAxODguNTc4MSBMODcuNjA5NCAxODguNTc4MSBMNzguMDQ2OSAyMTkuMjM0NCBMNTkuNDg0NCAyMTkuMjM0NCBMOTkuOTg0NCAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaYyXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODYuMzQzOCAyMDMuMDYyNSBMMTQ1Ljk2ODggMjAzLjA2MjUgTDE0NS45Njg4IDIxOS4wOTM4IEw2MS44NzUgMjE5LjA5MzggTDYxLjg3NSAyMDMuNjI1IFE2Ni42NTYyIDE5OS4yNjU2IDc1LjUxNTYgMTkxLjM5MDYgUTEyMy44OTA2IDE0OC41IDEyMy44OTA2IDEzNS4yODEyIFExMjMuODkwNiAxMjYgMTE2LjU3ODEgMTIwLjMwNDcgUTEwOS4yNjU2IDExNC42MDk0IDk3LjMxMjUgMTE0LjYwOTQgUTkwIDExNC42MDk0IDgxLjQyMTkgMTE3LjA3MDMgUTcyLjg0MzggMTE5LjUzMTIgNjIuNzE4OCAxMjQuNDUzMSBMNjIuNzE4OCAxMDcuMTU2MiBRNzMuNTQ2OSAxMDMuMjE4OCA4Mi44OTg0IDEwMS4yNSBROTIuMjUgOTkuMjgxMiAxMDAuMjY1NiA5OS4yODEyIFExMjAuNjU2MiA5OS4yODEyIDEzMi44OTA2IDEwOC41NjI1IFExNDUuMTI1IDExNy44NDM4IDE0NS4xMjUgMTMzLjAzMTIgUTE0NS4xMjUgMTUyLjU3ODEgOTguNTc4MSAxOTIuNTE1NiBROTAuNzAzMSAxOTkuMjY1NiA4Ni4zNDM4IDIwMy4wNjI1IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpjNcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMjEuNzgxMiAxNTUuNTMxMiBRMTM0LjcxODggMTU4LjA2MjUgMTQxLjgyMDMgMTY1LjcyNjYgUTE0OC45MjE5IDE3My4zOTA2IDE0OC45MjE5IDE4NC45MjE5IFExNDguOTIxOSAyMDIuMzU5NCAxMzUuNTYyNSAyMTEuNzgxMiBRMTIyLjIwMzEgMjIxLjIwMzEgOTcuMzEyNSAyMjEuMjAzMSBRODkuMjk2OSAyMjEuMjAzMSA4MC41MDc4IDIxOS43MjY2IFE3MS43MTg4IDIxOC4yNSA2MS44NzUgMjE1LjQzNzUgTDYxLjg3NSAxOTguNDIxOSBRNjkuMTg3NSAyMDIuMjE4OCA3Ny41NTQ3IDIwNC4wNDY5IFE4NS45MjE5IDIwNS44NzUgOTUuMzQzOCAyMDUuODc1IFExMTAuNjcxOSAyMDUuODc1IDExOS4xMDk0IDIwMC4zMjAzIFExMjcuNTQ2OSAxOTQuNzY1NiAxMjcuNTQ2OSAxODQuOTIxOSBRMTI3LjU0NjkgMTc0LjUxNTYgMTE5Ljc0MjIgMTY5LjE3MTkgUTExMS45Mzc1IDE2My44MjgxIDk2Ljc1IDE2My44MjgxIEw4NC42NTYyIDE2My44MjgxIEw4NC42NTYyIDE0OC42NDA2IEw5Ny44NzUgMTQ4LjY0MDYgUTExMS4wOTM4IDE0OC42NDA2IDExNy45MTQxIDE0NC4yMTA5IFExMjQuNzM0NCAxMzkuNzgxMiAxMjQuNzM0NCAxMzEuMzQzOCBRMTI0LjczNDQgMTIzLjE4NzUgMTE3LjcwMzEgMTE4Ljg5ODQgUTExMC42NzE5IDExNC42MDk0IDk3LjMxMjUgMTE0LjYwOTQgUTkxLjY4NzUgMTE0LjYwOTQgODQuNTE1NiAxMTUuODc1IFE3Ny4zNDM4IDExNy4xNDA2IDY1Ljk1MzEgMTIwLjM3NSBMNjUuOTUzMSAxMDQuMjAzMSBRNzYuMjE4OCAxMDEuODEyNSA4NS4yMTg4IDEwMC41NDY5IFE5NC4yMTg4IDk5LjI4MTIgMTAxLjk1MzEgOTkuMjgxMiBRMTIyLjIwMzEgOTkuMjgxMiAxMzQuMDg1OSAxMDcuNTc4MSBRMTQ1Ljk2ODggMTE1Ljg3NSAxNDUuOTY4OCAxMjkuNzk2OSBRMTQ1Ljk2ODggMTM5LjUgMTM5LjY0MDYgMTQ2LjI1IFExMzMuMzEyNSAxNTMgMTIxLjc4MTIgMTU1LjUzMTIgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmNFxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEyMC4wOTM4IDExOC42ODc1IEw3Ni42NDA2IDE3Ny42MDk0IEwxMjAuMDkzOCAxNzcuNjA5NCBMMTIwLjA5MzggMTE4LjY4NzUgWk0xMTcgMTAxLjY3MTkgTDE0MC4zNDM4IDEwMS42NzE5IEwxNDAuMzQzOCAxNzcuNjA5NCBMMTU5LjMyODEgMTc3LjYwOTQgTDE1OS4zMjgxIDE5Mi45Mzc1IEwxNDAuMzQzOCAxOTIuOTM3NSBMMTQwLjM0MzggMjE5LjA5MzggTDEyMC4wOTM4IDIxOS4wOTM4IEwxMjAuMDkzOCAxOTIuOTM3NSBMNjEuODc1IDE5Mi45Mzc1IEw2MS44NzUgMTc1LjkyMTkgTDExNyAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaY1XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjcuNSAxMDEuNjcxOSBMMTM5LjIxODggMTAxLjY3MTkgTDEzOS4yMTg4IDExNS4wMzEyIEw4NC4yMzQ0IDExNS4wMzEyIEw4NC4yMzQ0IDE0My43MTg4IFE4OC4xNzE5IDE0Mi40NTMxIDkyLjI1IDE0MS44OTA2IFE5Ni4xODc1IDE0MS4zMjgxIDEwMC4xMjUgMTQxLjMyODEgUTEyMi43NjU2IDE0MS4zMjgxIDEzNS45ODQ0IDE1Mi4xNTYyIFExNDkuMjAzMSAxNjIuODQzOCAxNDkuMjAzMSAxODEuMjY1NiBRMTQ5LjIwMzEgMjAwLjI1IDEzNS41NjI1IDIxMC43OTY5IFExMjIuMDYyNSAyMjEuMjAzMSA5Ny4zMTI1IDIyMS4yMDMxIFE4OC44NzUgMjIxLjIwMzEgODAuMDE1NiAyMTkuOTM3NSBRNzEuMTU2MiAyMTguNjcxOSA2MS44NzUgMjE2LjE0MDYgTDYxLjg3NSAyMDAuMjUgUTY5Ljg5MDYgMjA0LjA0NjkgNzguNjA5NCAyMDYuMDE1NiBRODcuMzI4MSAyMDcuODQzOCA5Ny4wMzEyIDIwNy44NDM4IFExMTIuNjQwNiAyMDcuODQzOCAxMjEuNzgxMiAyMDAuNjcxOSBRMTMwLjkyMTkgMTkzLjUgMTMwLjkyMTkgMTgxLjI2NTYgUTEzMC45MjE5IDE2OS4wMzEyIDEyMS43ODEyIDE2MS44NTk0IFExMTIuNjQwNiAxNTQuNjg3NSA5Ny4wMzEyIDE1NC42ODc1IFE4OS43MTg4IDE1NC42ODc1IDgyLjQwNjIgMTU2LjA5MzggUTc1LjA5MzggMTU3LjUgNjcuNSAxNjAuNDUzMSBMNjcuNSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaY2XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTEwLjEwOTQgMTUzLjcwMzEgUTk3LjczNDQgMTUzLjcwMzEgOTAuNTYyNSAxNjEuMDE1NiBRODMuMzkwNiAxNjguNDY4OCA4My4zOTA2IDE4MS4yNjU2IFE4My4zOTA2IDE5My45MjE5IDkwLjU2MjUgMjAxLjIzNDQgUTk3LjczNDQgMjA4LjY4NzUgMTEwLjEwOTQgMjA4LjY4NzUgUTEyMi4zNDM4IDIwOC42ODc1IDEyOS41MTU2IDIwMS4yMzQ0IFExMzYuNjg3NSAxOTMuOTIxOSAxMzYuNjg3NSAxODEuMjY1NiBRMTM2LjY4NzUgMTY4LjQ2ODggMTI5LjUxNTYgMTYxLjAxNTYgUTEyMi4zNDM4IDE1My43MDMxIDExMC4xMDk0IDE1My43MDMxIFpNMTQ2LjM5MDYgMTAzLjkyMTkgTDE0Ni4zOTA2IDExOC40MDYyIFExMzkuNSAxMTUuNTkzOCAxMzIuNDY4OCAxMTQuMTg3NSBRMTI1LjQzNzUgMTEyLjY0MDYgMTE4LjU0NjkgMTEyLjY0MDYgUTEwMC41NDY5IDExMi42NDA2IDkwLjk4NDQgMTIzLjE4NzUgUTgxLjQyMTkgMTMzLjg3NSA4MC4wMTU2IDE1NS4zOTA2IFE4NS4zNTk0IDE0OC41IDkzLjM3NSAxNDQuODQzOCBRMTAxLjUzMTIgMTQxLjE4NzUgMTExLjA5MzggMTQxLjE4NzUgUTEzMS40ODQ0IDE0MS4xODc1IDE0My4yOTY5IDE1MS44NzUgUTE1NS4xMDk0IDE2Mi43MDMxIDE1NS4xMDk0IDE4MS4yNjU2IFExNTUuMTA5NCAxOTkuMTI1IDE0Mi43MzQ0IDIxMC4yMzQ0IFExMzAuNSAyMjEuMjAzMSAxMTAuMTA5NCAyMjEuMjAzMSBRODYuNjI1IDIyMS4yMDMxIDc0LjI1IDIwNS41OTM4IFE2MS44NzUgMTg5Ljk4NDQgNjEuODc1IDE2MC4xNzE5IFE2MS44NzUgMTMyLjMyODEgNzcuMDYyNSAxMTUuODc1IFE5Mi4yNSA5OS4yODEyIDExNy44NDM4IDk5LjI4MTIgUTEyNC43MzQ0IDk5LjI4MTIgMTMxLjc2NTYgMTAwLjQwNjIgUTEzOC43OTY5IDEwMS42NzE5IDE0Ni4zOTA2IDEwMy45MjE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpjdcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02MS44NzUgMTAxLjY3MTkgTDE0OC42NDA2IDEwMS42NzE5IEwxNDguNjQwNiAxMDguNDIxOSBMOTkuNzAzMSAyMTkuMDkzOCBMODAuNTc4MSAyMTkuMDkzOCBMMTI2LjcwMzEgMTE1LjAzMTIgTDYxLjg3NSAxMTUuMDMxMiBMNjEuODc1IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpjhcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMDguMjgxMiAxNjMuMTI1IFE5NS4yMDMxIDE2My4xMjUgODcuNzUgMTY5LjMxMjUgUTgwLjI5NjkgMTc1LjM1OTQgODAuMjk2OSAxODUuOTA2MiBRODAuMjk2OSAxOTYuNTkzOCA4Ny43NSAyMDIuNjQwNiBROTUuMjAzMSAyMDguNjg3NSAxMDguMjgxMiAyMDguNjg3NSBRMTIxLjIxODggMjA4LjY4NzUgMTI4LjgxMjUgMjAyLjUgUTEzNi4yNjU2IDE5Ni40NTMxIDEzNi4yNjU2IDE4NS45MDYyIFExMzYuMjY1NiAxNzUuMzU5NCAxMjguODEyNSAxNjkuMzEyNSBRMTIxLjM1OTQgMTYzLjEyNSAxMDguMjgxMiAxNjMuMTI1IFpNOTAgMTU2LjIzNDQgUTc4LjE4NzUgMTUzLjcwMzEgNzEuNzE4OCAxNDYuODEyNSBRNjUuMTA5NCAxMzkuNzgxMiA2NS4xMDk0IDEyOS42NTYyIFE2NS4xMDk0IDExNS41OTM4IDc2LjY0MDYgMTA3LjQzNzUgUTg4LjE3MTkgOTkuMjgxMiAxMDguMjgxMiA5OS4yODEyIFExMjguMzkwNiA5OS4yODEyIDEzOS45MjE5IDEwNy40Mzc1IFExNTEuMzEyNSAxMTUuNTkzOCAxNTEuMzEyNSAxMjkuNjU2MiBRMTUxLjMxMjUgMTQwLjA2MjUgMTQ0Ljg0MzggMTQ2LjgxMjUgUTEzOC4yMzQ0IDE1My43MDMxIDEyNi41NjI1IDE1Ni4yMzQ0IFExMzkuMjE4OCAxNTguNzY1NiAxNDcuMDkzOCAxNjYuOTIxOSBRMTU0LjU0NjkgMTc0LjY1NjIgMTU0LjU0NjkgMTg1LjkwNjIgUTE1NC41NDY5IDIwMi45MjE5IDE0Mi41OTM4IDIxMi4wNjI1IFExMzAuNSAyMjEuMjAzMSAxMDguMjgxMiAyMjEuMjAzMSBRODUuOTIxOSAyMjEuMjAzMSA3My45Njg4IDIxMi4wNjI1IFE2MS44NzUgMjAyLjkyMTkgNjEuODc1IDE4NS45MDYyIFE2MS44NzUgMTc0LjkzNzUgNjkuMzI4MSAxNjYuOTIxOSBRNzYuOTIxOSAxNTkuMDQ2OSA5MCAxNTYuMjM0NCBaTTgzLjI1IDEzMS4yMDMxIFE4My4yNSAxNDAuMDYyNSA4OS44NTk0IDE0NS40MDYyIFE5Ni4zMjgxIDE1MC42MDk0IDEwOC4yODEyIDE1MC42MDk0IFExMTkuNjcxOSAxNTAuNjA5NCAxMjYuNTYyNSAxNDUuNDA2MiBRMTMzLjMxMjUgMTQwLjM0MzggMTMzLjMxMjUgMTMxLjIwMzEgUTEzMy4zMTI1IDEyMi4zNDM4IDEyNi41NjI1IDExNyBRMTE5Ljk1MzEgMTExLjc5NjkgMTA4LjI4MTIgMTExLjc5NjkgUTk2LjYwOTQgMTExLjc5NjkgODkuODU5NCAxMTcgUTgzLjI1IDEyMi4wNjI1IDgzLjI1IDEzMS4yMDMxIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpjlcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk03MC41OTM4IDIxNi41NjI1IEw3MC41OTM4IDIwMi4wNzgxIFE3Ny40ODQ0IDIwNC44OTA2IDg0LjUxNTYgMjA2LjQzNzUgUTkxLjU0NjkgMjA3Ljg0MzggOTguMjk2OSAyMDcuODQzOCBRMTE2LjQzNzUgMjA3Ljg0MzggMTI2IDE5Ny4yOTY5IFExMzUuNDIxOSAxODYuNzUgMTM2LjgyODEgMTY1LjA5MzggUTEzMS45MDYyIDE3MS43MDMxIDEyMy40Njg4IDE3NS41IFExMTUuNDUzMSAxNzkuMTU2MiAxMDUuNzUgMTc5LjE1NjIgUTg1LjUgMTc5LjE1NjIgNzMuNjg3NSAxNjguNDY4OCBRNjEuODc1IDE1Ny43ODEyIDYxLjg3NSAxMzkuMjE4OCBRNjEuODc1IDEyMS4wNzgxIDc0LjEwOTQgMTEwLjI1IFE4Ni40ODQ0IDk5LjI4MTIgMTA2Ljg3NSA5OS4yODEyIFExMzAuMzU5NCA5OS4yODEyIDE0Mi41OTM4IDExNC44OTA2IFExNTQuOTY4OCAxMzAuNSAxNTQuOTY4OCAxNjAuMzEyNSBRMTU0Ljk2ODggMTg4LjE1NjIgMTM5LjkyMTkgMjA0LjYwOTQgUTEyNC43MzQ0IDIyMS4yMDMxIDk5LjE0MDYgMjIxLjIwMzEgUTkyLjI1IDIyMS4yMDMxIDg1LjIxODggMjIwLjA3ODEgUTc4LjE4NzUgMjE4LjgxMjUgNzAuNTkzOCAyMTYuNTYyNSBaTTEwNi44NzUgMTY2Ljc4MTIgUTExOS4yNSAxNjYuNzgxMiAxMjYuNDIxOSAxNTkuNDY4OCBRMTMzLjU5MzggMTUyLjE1NjIgMTMzLjU5MzggMTM5LjIxODggUTEzMy41OTM4IDEyNi41NjI1IDEyNi40MjE5IDExOS4yNSBRMTE5LjI1IDExMS43OTY5IDEwNi44NzUgMTExLjc5NjkgUTk0LjkyMTkgMTExLjc5NjkgODcuNDY4OCAxMTkuMjUgUTgwLjE1NjIgMTI2LjU2MjUgODAuMTU2MiAxMzkuMjE4OCBRODAuMTU2MiAxNTIuMTU2MiA4Ny40Njg4IDE1OS40Njg4IFE5NC42NDA2IDE2Ni43ODEyIDEwNi44NzUgMTY2Ljc4MTIgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmMTBcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xNTkuMDQ2OSAxMTEuNzk2OSBRMTQ5LjA2MjUgMTExLjc5NjkgMTQyLjAzMTIgMTIzLjg5MDYgUTEzNC44NTk0IDEzNS45ODQ0IDEzNC44NTk0IDE2MC4xNzE5IFExMzQuODU5NCAxODQuNSAxNDIuMDMxMiAxOTYuNTkzOCBRMTQ5LjA2MjUgMjA4LjY4NzUgMTU5LjA0NjkgMjA4LjY4NzUgUTE2OS4wMzEyIDIwOC42ODc1IDE3Ni4wNjI1IDE5Ni41OTM4IFExODMuMjM0NCAxODQuNSAxODMuMjM0NCAxNjAuMTcxOSBRMTgzLjIzNDQgMTM1Ljk4NDQgMTc2LjA2MjUgMTIzLjg5MDYgUTE2OS4wMzEyIDExMS43OTY5IDE1OS4wNDY5IDExMS43OTY5IFpNMTU5LjA0NjkgOTkuMjgxMiBRMTc3LjQ2ODggOTkuMjgxMiAxODkuNDIxOSAxMTQuODkwNiBRMjAxLjM3NSAxMzAuNSAyMDEuMzc1IDE2MC4xNzE5IFEyMDEuMzc1IDE4OS45ODQ0IDE4OS40MjE5IDIwNS41OTM4IFExNzcuNDY4OCAyMjEuMjAzMSAxNTkuMDQ2OSAyMjEuMjAzMSBRMTM2LjI2NTYgMjIxLjIwMzEgMTI2LjQyMTkgMjA1LjU5MzggUTExNi41NzgxIDE4OS45ODQ0IDExNi41NzgxIDE2MC4xNzE5IFExMTYuNTc4MSAxMzAuNSAxMjYuNDIxOSAxMTQuODkwNiBRMTM2LjI2NTYgOTkuMjgxMiAxNTkuMDQ2OSA5OS4yODEyIFpNODAuNTc4MSAyMTkuMDkzOCBMODAuNTc4MSAxMTcuNzAzMSBMNjEuODc1IDEyMy40Njg4IEw2MS44NzUgMTA3LjE1NjIgTDgxLjU2MjUgMTAxLjY3MTkgTDEwMC44MjgxIDEwMS42NzE5IEwxMDAuODI4MSAyMTkuMDkzOCBMODAuNTc4MSAyMTkuMDkzOCBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaZKXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODkuMTU2MiAxMDEuNjcxOSBMMTA3LjAxNTYgMTAxLjY3MTkgTDEwNy4wMTU2IDE3OC43MzQ0IFExMDcuMDE1NiAxOTkuNjg3NSA5Ny44NzUgMjA5LjUzMTIgUTg4Ljg3NSAyMTkuMjM0NCA2OC43NjU2IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAyMDUuNzM0NCBMNjcuNSAyMDUuNzM0NCBRNzkuMzEyNSAyMDUuNzM0NCA4NC4yMzQ0IDE5OS44MjgxIFE4OS4xNTYyIDE5My45MjE5IDg5LjE1NjIgMTc4LjczNDQgTDg5LjE1NjIgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmUVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk0xMDcuMjk2OSAyMjEuMDYyNSBRMTA2LjczNDQgMjIxLjA2MjUgMTA1LjUzOTEgMjIxLjEzMjggUTEwNC4zNDM4IDIyMS4yMDMxIDEwMy42NDA2IDIyMS4yMDMxIFE4MS40MjE5IDIyMS4yMDMxIDcwLjUyMzQgMjA2LjA4NTkgUTU5LjYyNSAxOTAuOTY4OCA1OS42MjUgMTYwLjMxMjUgUTU5LjYyNSAxMjkuNTE1NiA3MC41OTM4IDExNC4zOTg0IFE4MS41NjI1IDk5LjI4MTIgMTAzLjc4MTIgOTkuMjgxMiBRMTI2LjE0MDYgOTkuMjgxMiAxMzcuMTA5NCAxMTQuMzk4NCBRMTQ4LjA3ODEgMTI5LjUxNTYgMTQ4LjA3ODEgMTYwLjMxMjUgUTE0OC4wNzgxIDE4My41MTU2IDE0Mi4wMzEyIDE5Ny42NDg0IFExMzUuOTg0NCAyMTEuNzgxMiAxMjMuNjA5NCAyMTcuNDA2MiBMMTQxLjMyODEgMjMyLjMxMjUgTDEyNy45Njg4IDI0MC4xODc1IEwxMDcuMjk2OSAyMjEuMDYyNSBaTTEyOS4zNzUgMTYwLjMxMjUgUTEyOS4zNzUgMTM0LjQzNzUgMTIzLjM5ODQgMTIzLjMyODEgUTExNy40MjE5IDExMi4yMTg4IDEwMy43ODEyIDExMi4yMTg4IFE5MC4yODEyIDExMi4yMTg4IDg0LjMwNDcgMTIzLjMyODEgUTc4LjMyODEgMTM0LjQzNzUgNzguMzI4MSAxNjAuMzEyNSBRNzguMzI4MSAxODYuMTg3NSA4NC4zMDQ3IDE5Ny4yOTY5IFE5MC4yODEyIDIwOC40MDYyIDEwMy43ODEyIDIwOC40MDYyIFExMTcuNDIxOSAyMDguNDA2MiAxMjMuMzk4NCAxOTcuMjk2OSBRMTI5LjM3NSAxODYuMTg3NSAxMjkuMzc1IDE2MC4zMTI1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmS1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTYxLjg3NSAxMDEuNjcxOSBMNzkuNzM0NCAxMDEuNjcxOSBMNzkuNzM0NCAxNTEuMzEyNSBMMTMwLjY0MDYgMTAxLjY3MTkgTDE1My43MDMxIDEwMS42NzE5IEw5Ni40Njg4IDE1Ni41MTU2IEwxNTguMzQzOCAyMTkuMjM0NCBMMTM0Ljg1OTQgMjE5LjIzNDQgTDc5LjczNDQgMTYyLjU2MjUgTDc5LjczNDQgMjE5LjIzNDQgTDYxLjg3NSAyMTkuMjM0NCBMNjEuODc1IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZo0FcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTExMC42NzE5IDExNS43MzQ0IEw5MS44MjgxIDE3NS43ODEyIEwxMjkuNTE1NiAxNzUuNzgxMiBMMTEwLjY3MTkgMTE1LjczNDQgWk05OS45ODQ0IDEwMS42NzE5IEwxMjEuNjQwNiAxMDEuNjcxOSBMMTYyLjE0MDYgMjE5LjIzNDQgTDE0My41NzgxIDIxOS4yMzQ0IEwxMzQuMDE1NiAxODguNTc4MSBMODcuNjA5NCAxODguNTc4MSBMNzguMDQ2OSAyMTkuMjM0NCBMNTkuNDg0NCAyMTkuMjM0NCBMOTkuOTg0NCAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaMyXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk04Ni4zNDM4IDIwMy4wNjI1IEwxNDUuOTY4OCAyMDMuMDYyNSBMMTQ1Ljk2ODggMjE5LjA5MzggTDYxLjg3NSAyMTkuMDkzOCBMNjEuODc1IDIwMy42MjUgUTY2LjY1NjIgMTk5LjI2NTYgNzUuNTE1NiAxOTEuMzkwNiBRMTIzLjg5MDYgMTQ4LjUgMTIzLjg5MDYgMTM1LjI4MTIgUTEyMy44OTA2IDEyNiAxMTYuNTc4MSAxMjAuMzA0NyBRMTA5LjI2NTYgMTE0LjYwOTQgOTcuMzEyNSAxMTQuNjA5NCBROTAgMTE0LjYwOTQgODEuNDIxOSAxMTcuMDcwMyBRNzIuODQzOCAxMTkuNTMxMiA2Mi43MTg4IDEyNC40NTMxIEw2Mi43MTg4IDEwNy4xNTYyIFE3My41NDY5IDEwMy4yMTg4IDgyLjg5ODQgMTAxLjI1IFE5Mi4yNSA5OS4yODEyIDEwMC4yNjU2IDk5LjI4MTIgUTEyMC42NTYyIDk5LjI4MTIgMTMyLjg5MDYgMTA4LjU2MjUgUTE0NS4xMjUgMTE3Ljg0MzggMTQ1LjEyNSAxMzMuMDMxMiBRMTQ1LjEyNSAxNTIuNTc4MSA5OC41NzgxIDE5Mi41MTU2IFE5MC43MDMxIDE5OS4yNjU2IDg2LjM0MzggMjAzLjA2MjUgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjM1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTIxLjc4MTIgMTU1LjUzMTIgUTEzNC43MTg4IDE1OC4wNjI1IDE0MS44MjAzIDE2NS43MjY2IFExNDguOTIxOSAxNzMuMzkwNiAxNDguOTIxOSAxODQuOTIxOSBRMTQ4LjkyMTkgMjAyLjM1OTQgMTM1LjU2MjUgMjExLjc4MTIgUTEyMi4yMDMxIDIyMS4yMDMxIDk3LjMxMjUgMjIxLjIwMzEgUTg5LjI5NjkgMjIxLjIwMzEgODAuNTA3OCAyMTkuNzI2NiBRNzEuNzE4OCAyMTguMjUgNjEuODc1IDIxNS40Mzc1IEw2MS44NzUgMTk4LjQyMTkgUTY5LjE4NzUgMjAyLjIxODggNzcuNTU0NyAyMDQuMDQ2OSBRODUuOTIxOSAyMDUuODc1IDk1LjM0MzggMjA1Ljg3NSBRMTEwLjY3MTkgMjA1Ljg3NSAxMTkuMTA5NCAyMDAuMzIwMyBRMTI3LjU0NjkgMTk0Ljc2NTYgMTI3LjU0NjkgMTg0LjkyMTkgUTEyNy41NDY5IDE3NC41MTU2IDExOS43NDIyIDE2OS4xNzE5IFExMTEuOTM3NSAxNjMuODI4MSA5Ni43NSAxNjMuODI4MSBMODQuNjU2MiAxNjMuODI4MSBMODQuNjU2MiAxNDguNjQwNiBMOTcuODc1IDE0OC42NDA2IFExMTEuMDkzOCAxNDguNjQwNiAxMTcuOTE0MSAxNDQuMjEwOSBRMTI0LjczNDQgMTM5Ljc4MTIgMTI0LjczNDQgMTMxLjM0MzggUTEyNC43MzQ0IDEyMy4xODc1IDExNy43MDMxIDExOC44OTg0IFExMTAuNjcxOSAxMTQuNjA5NCA5Ny4zMTI1IDExNC42MDk0IFE5MS42ODc1IDExNC42MDk0IDg0LjUxNTYgMTE1Ljg3NSBRNzcuMzQzOCAxMTcuMTQwNiA2NS45NTMxIDEyMC4zNzUgTDY1Ljk1MzEgMTA0LjIwMzEgUTc2LjIxODggMTAxLjgxMjUgODUuMjE4OCAxMDAuNTQ2OSBROTQuMjE4OCA5OS4yODEyIDEwMS45NTMxIDk5LjI4MTIgUTEyMi4yMDMxIDk5LjI4MTIgMTM0LjA4NTkgMTA3LjU3ODEgUTE0NS45Njg4IDExNS44NzUgMTQ1Ljk2ODggMTI5Ljc5NjkgUTE0NS45Njg4IDEzOS41IDEzOS42NDA2IDE0Ni4yNSBRMTMzLjMxMjUgMTUzIDEyMS43ODEyIDE1NS41MzEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZozRcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEyMC4wOTM4IDExOC42ODc1IEw3Ni42NDA2IDE3Ny42MDk0IEwxMjAuMDkzOCAxNzcuNjA5NCBMMTIwLjA5MzggMTE4LjY4NzUgWk0xMTcgMTAxLjY3MTkgTDE0MC4zNDM4IDEwMS42NzE5IEwxNDAuMzQzOCAxNzcuNjA5NCBMMTU5LjMyODEgMTc3LjYwOTQgTDE1OS4zMjgxIDE5Mi45Mzc1IEwxNDAuMzQzOCAxOTIuOTM3NSBMMTQwLjM0MzggMjE5LjA5MzggTDEyMC4wOTM4IDIxOS4wOTM4IEwxMjAuMDkzOCAxOTIuOTM3NSBMNjEuODc1IDE5Mi45Mzc1IEw2MS44NzUgMTc1LjkyMTkgTDExNyAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaM1XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02Ny41IDEwMS42NzE5IEwxMzkuMjE4OCAxMDEuNjcxOSBMMTM5LjIxODggMTE1LjAzMTIgTDg0LjIzNDQgMTE1LjAzMTIgTDg0LjIzNDQgMTQzLjcxODggUTg4LjE3MTkgMTQyLjQ1MzEgOTIuMjUgMTQxLjg5MDYgUTk2LjE4NzUgMTQxLjMyODEgMTAwLjEyNSAxNDEuMzI4MSBRMTIyLjc2NTYgMTQxLjMyODEgMTM1Ljk4NDQgMTUyLjE1NjIgUTE0OS4yMDMxIDE2Mi44NDM4IDE0OS4yMDMxIDE4MS4yNjU2IFExNDkuMjAzMSAyMDAuMjUgMTM1LjU2MjUgMjEwLjc5NjkgUTEyMi4wNjI1IDIyMS4yMDMxIDk3LjMxMjUgMjIxLjIwMzEgUTg4Ljg3NSAyMjEuMjAzMSA4MC4wMTU2IDIxOS45Mzc1IFE3MS4xNTYyIDIxOC42NzE5IDYxLjg3NSAyMTYuMTQwNiBMNjEuODc1IDIwMC4yNSBRNjkuODkwNiAyMDQuMDQ2OSA3OC42MDk0IDIwNi4wMTU2IFE4Ny4zMjgxIDIwNy44NDM4IDk3LjAzMTIgMjA3Ljg0MzggUTExMi42NDA2IDIwNy44NDM4IDEyMS43ODEyIDIwMC42NzE5IFExMzAuOTIxOSAxOTMuNSAxMzAuOTIxOSAxODEuMjY1NiBRMTMwLjkyMTkgMTY5LjAzMTIgMTIxLjc4MTIgMTYxLjg1OTQgUTExMi42NDA2IDE1NC42ODc1IDk3LjAzMTIgMTU0LjY4NzUgUTg5LjcxODggMTU0LjY4NzUgODIuNDA2MiAxNTYuMDkzOCBRNzUuMDkzOCAxNTcuNSA2Ny41IDE2MC40NTMxIEw2Ny41IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZozZcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTExMC4xMDk0IDE1My43MDMxIFE5Ny43MzQ0IDE1My43MDMxIDkwLjU2MjUgMTYxLjAxNTYgUTgzLjM5MDYgMTY4LjQ2ODggODMuMzkwNiAxODEuMjY1NiBRODMuMzkwNiAxOTMuOTIxOSA5MC41NjI1IDIwMS4yMzQ0IFE5Ny43MzQ0IDIwOC42ODc1IDExMC4xMDk0IDIwOC42ODc1IFExMjIuMzQzOCAyMDguNjg3NSAxMjkuNTE1NiAyMDEuMjM0NCBRMTM2LjY4NzUgMTkzLjkyMTkgMTM2LjY4NzUgMTgxLjI2NTYgUTEzNi42ODc1IDE2OC40Njg4IDEyOS41MTU2IDE2MS4wMTU2IFExMjIuMzQzOCAxNTMuNzAzMSAxMTAuMTA5NCAxNTMuNzAzMSBaTTE0Ni4zOTA2IDEwMy45MjE5IEwxNDYuMzkwNiAxMTguNDA2MiBRMTM5LjUgMTE1LjU5MzggMTMyLjQ2ODggMTE0LjE4NzUgUTEyNS40Mzc1IDExMi42NDA2IDExOC41NDY5IDExMi42NDA2IFExMDAuNTQ2OSAxMTIuNjQwNiA5MC45ODQ0IDEyMy4xODc1IFE4MS40MjE5IDEzMy44NzUgODAuMDE1NiAxNTUuMzkwNiBRODUuMzU5NCAxNDguNSA5My4zNzUgMTQ0Ljg0MzggUTEwMS41MzEyIDE0MS4xODc1IDExMS4wOTM4IDE0MS4xODc1IFExMzEuNDg0NCAxNDEuMTg3NSAxNDMuMjk2OSAxNTEuODc1IFExNTUuMTA5NCAxNjIuNzAzMSAxNTUuMTA5NCAxODEuMjY1NiBRMTU1LjEwOTQgMTk5LjEyNSAxNDIuNzM0NCAyMTAuMjM0NCBRMTMwLjUgMjIxLjIwMzEgMTEwLjEwOTQgMjIxLjIwMzEgUTg2LjYyNSAyMjEuMjAzMSA3NC4yNSAyMDUuNTkzOCBRNjEuODc1IDE4OS45ODQ0IDYxLjg3NSAxNjAuMTcxOSBRNjEuODc1IDEzMi4zMjgxIDc3LjA2MjUgMTE1Ljg3NSBROTIuMjUgOTkuMjgxMiAxMTcuODQzOCA5OS4yODEyIFExMjQuNzM0NCA5OS4yODEyIDEzMS43NjU2IDEwMC40MDYyIFExMzguNzk2OSAxMDEuNjcxOSAxNDYuMzkwNiAxMDMuOTIxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaM3XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02MS44NzUgMTAxLjY3MTkgTDE0OC42NDA2IDEwMS42NzE5IEwxNDguNjQwNiAxMDguNDIxOSBMOTkuNzAzMSAyMTkuMDkzOCBMODAuNTc4MSAyMTkuMDkzOCBMMTI2LjcwMzEgMTE1LjAzMTIgTDYxLjg3NSAxMTUuMDMxMiBMNjEuODc1IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZozhcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEwOC4yODEyIDE2My4xMjUgUTk1LjIwMzEgMTYzLjEyNSA4Ny43NSAxNjkuMzEyNSBRODAuMjk2OSAxNzUuMzU5NCA4MC4yOTY5IDE4NS45MDYyIFE4MC4yOTY5IDE5Ni41OTM4IDg3Ljc1IDIwMi42NDA2IFE5NS4yMDMxIDIwOC42ODc1IDEwOC4yODEyIDIwOC42ODc1IFExMjEuMjE4OCAyMDguNjg3NSAxMjguODEyNSAyMDIuNSBRMTM2LjI2NTYgMTk2LjQ1MzEgMTM2LjI2NTYgMTg1LjkwNjIgUTEzNi4yNjU2IDE3NS4zNTk0IDEyOC44MTI1IDE2OS4zMTI1IFExMjEuMzU5NCAxNjMuMTI1IDEwOC4yODEyIDE2My4xMjUgWk05MCAxNTYuMjM0NCBRNzguMTg3NSAxNTMuNzAzMSA3MS43MTg4IDE0Ni44MTI1IFE2NS4xMDk0IDEzOS43ODEyIDY1LjEwOTQgMTI5LjY1NjIgUTY1LjEwOTQgMTE1LjU5MzggNzYuNjQwNiAxMDcuNDM3NSBRODguMTcxOSA5OS4yODEyIDEwOC4yODEyIDk5LjI4MTIgUTEyOC4zOTA2IDk5LjI4MTIgMTM5LjkyMTkgMTA3LjQzNzUgUTE1MS4zMTI1IDExNS41OTM4IDE1MS4zMTI1IDEyOS42NTYyIFExNTEuMzEyNSAxNDAuMDYyNSAxNDQuODQzOCAxNDYuODEyNSBRMTM4LjIzNDQgMTUzLjcwMzEgMTI2LjU2MjUgMTU2LjIzNDQgUTEzOS4yMTg4IDE1OC43NjU2IDE0Ny4wOTM4IDE2Ni45MjE5IFExNTQuNTQ2OSAxNzQuNjU2MiAxNTQuNTQ2OSAxODUuOTA2MiBRMTU0LjU0NjkgMjAyLjkyMTkgMTQyLjU5MzggMjEyLjA2MjUgUTEzMC41IDIyMS4yMDMxIDEwOC4yODEyIDIyMS4yMDMxIFE4NS45MjE5IDIyMS4yMDMxIDczLjk2ODggMjEyLjA2MjUgUTYxLjg3NSAyMDIuOTIxOSA2MS44NzUgMTg1LjkwNjIgUTYxLjg3NSAxNzQuOTM3NSA2OS4zMjgxIDE2Ni45MjE5IFE3Ni45MjE5IDE1OS4wNDY5IDkwIDE1Ni4yMzQ0IFpNODMuMjUgMTMxLjIwMzEgUTgzLjI1IDE0MC4wNjI1IDg5Ljg1OTQgMTQ1LjQwNjIgUTk2LjMyODEgMTUwLjYwOTQgMTA4LjI4MTIgMTUwLjYwOTQgUTExOS42NzE5IDE1MC42MDk0IDEyNi41NjI1IDE0NS40MDYyIFExMzMuMzEyNSAxNDAuMzQzOCAxMzMuMzEyNSAxMzEuMjAzMSBRMTMzLjMxMjUgMTIyLjM0MzggMTI2LjU2MjUgMTE3IFExMTkuOTUzMSAxMTEuNzk2OSAxMDguMjgxMiAxMTEuNzk2OSBROTYuNjA5NCAxMTEuNzk2OSA4OS44NTk0IDExNyBRODMuMjUgMTIyLjA2MjUgODMuMjUgMTMxLjIwMzEgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjOVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNzAuNTkzOCAyMTYuNTYyNSBMNzAuNTkzOCAyMDIuMDc4MSBRNzcuNDg0NCAyMDQuODkwNiA4NC41MTU2IDIwNi40Mzc1IFE5MS41NDY5IDIwNy44NDM4IDk4LjI5NjkgMjA3Ljg0MzggUTExNi40Mzc1IDIwNy44NDM4IDEyNiAxOTcuMjk2OSBRMTM1LjQyMTkgMTg2Ljc1IDEzNi44MjgxIDE2NS4wOTM4IFExMzEuOTA2MiAxNzEuNzAzMSAxMjMuNDY4OCAxNzUuNSBRMTE1LjQ1MzEgMTc5LjE1NjIgMTA1Ljc1IDE3OS4xNTYyIFE4NS41IDE3OS4xNTYyIDczLjY4NzUgMTY4LjQ2ODggUTYxLjg3NSAxNTcuNzgxMiA2MS44NzUgMTM5LjIxODggUTYxLjg3NSAxMjEuMDc4MSA3NC4xMDk0IDExMC4yNSBRODYuNDg0NCA5OS4yODEyIDEwNi44NzUgOTkuMjgxMiBRMTMwLjM1OTQgOTkuMjgxMiAxNDIuNTkzOCAxMTQuODkwNiBRMTU0Ljk2ODggMTMwLjUgMTU0Ljk2ODggMTYwLjMxMjUgUTE1NC45Njg4IDE4OC4xNTYyIDEzOS45MjE5IDIwNC42MDk0IFExMjQuNzM0NCAyMjEuMjAzMSA5OS4xNDA2IDIyMS4yMDMxIFE5Mi4yNSAyMjEuMjAzMSA4NS4yMTg4IDIyMC4wNzgxIFE3OC4xODc1IDIxOC44MTI1IDcwLjU5MzggMjE2LjU2MjUgWk0xMDYuODc1IDE2Ni43ODEyIFExMTkuMjUgMTY2Ljc4MTIgMTI2LjQyMTkgMTU5LjQ2ODggUTEzMy41OTM4IDE1Mi4xNTYyIDEzMy41OTM4IDEzOS4yMTg4IFExMzMuNTkzOCAxMjYuNTYyNSAxMjYuNDIxOSAxMTkuMjUgUTExOS4yNSAxMTEuNzk2OSAxMDYuODc1IDExMS43OTY5IFE5NC45MjE5IDExMS43OTY5IDg3LjQ2ODggMTE5LjI1IFE4MC4xNTYyIDEyNi41NjI1IDgwLjE1NjIgMTM5LjIxODggUTgwLjE1NjIgMTUyLjE1NjIgODcuNDY4OCAxNTkuNDY4OCBROTQuNjQwNiAxNjYuNzgxMiAxMDYuODc1IDE2Ni43ODEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZozEwXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xNTkuMDQ2OSAxMTEuNzk2OSBRMTQ5LjA2MjUgMTExLjc5NjkgMTQyLjAzMTIgMTIzLjg5MDYgUTEzNC44NTk0IDEzNS45ODQ0IDEzNC44NTk0IDE2MC4xNzE5IFExMzQuODU5NCAxODQuNSAxNDIuMDMxMiAxOTYuNTkzOCBRMTQ5LjA2MjUgMjA4LjY4NzUgMTU5LjA0NjkgMjA4LjY4NzUgUTE2OS4wMzEyIDIwOC42ODc1IDE3Ni4wNjI1IDE5Ni41OTM4IFExODMuMjM0NCAxODQuNSAxODMuMjM0NCAxNjAuMTcxOSBRMTgzLjIzNDQgMTM1Ljk4NDQgMTc2LjA2MjUgMTIzLjg5MDYgUTE2OS4wMzEyIDExMS43OTY5IDE1OS4wNDY5IDExMS43OTY5IFpNMTU5LjA0NjkgOTkuMjgxMiBRMTc3LjQ2ODggOTkuMjgxMiAxODkuNDIxOSAxMTQuODkwNiBRMjAxLjM3NSAxMzAuNSAyMDEuMzc1IDE2MC4xNzE5IFEyMDEuMzc1IDE4OS45ODQ0IDE4OS40MjE5IDIwNS41OTM4IFExNzcuNDY4OCAyMjEuMjAzMSAxNTkuMDQ2OSAyMjEuMjAzMSBRMTM2LjI2NTYgMjIxLjIwMzEgMTI2LjQyMTkgMjA1LjU5MzggUTExNi41NzgxIDE4OS45ODQ0IDExNi41NzgxIDE2MC4xNzE5IFExMTYuNTc4MSAxMzAuNSAxMjYuNDIxOSAxMTQuODkwNiBRMTM2LjI2NTYgOTkuMjgxMiAxNTkuMDQ2OSA5OS4yODEyIFpNODAuNTc4MSAyMTkuMDkzOCBMODAuNTc4MSAxMTcuNzAzMSBMNjEuODc1IDEyMy40Njg4IEw2MS44NzUgMTA3LjE1NjIgTDgxLjU2MjUgMTAxLjY3MTkgTDEwMC44MjgxIDEwMS42NzE5IEwxMDAuODI4MSAyMTkuMDkzOCBMODAuNTc4MSAyMTkuMDkzOCBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaNKXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk04OS4xNTYyIDEwMS42NzE5IEwxMDcuMDE1NiAxMDEuNjcxOSBMMTA3LjAxNTYgMTc4LjczNDQgUTEwNy4wMTU2IDE5OS42ODc1IDk3Ljg3NSAyMDkuNTMxMiBRODguODc1IDIxOS4yMzQ0IDY4Ljc2NTYgMjE5LjIzNDQgTDYxLjg3NSAyMTkuMjM0NCBMNjEuODc1IDIwNS43MzQ0IEw2Ny41IDIwNS43MzQ0IFE3OS4zMTI1IDIwNS43MzQ0IDg0LjIzNDQgMTk5LjgyODEgUTg5LjE1NjIgMTkzLjkyMTkgODkuMTU2MiAxNzguNzM0NCBMODkuMTU2MiAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaNRXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMDcuMjk2OSAyMjEuMDYyNSBRMTA2LjczNDQgMjIxLjA2MjUgMTA1LjUzOTEgMjIxLjEzMjggUTEwNC4zNDM4IDIyMS4yMDMxIDEwMy42NDA2IDIyMS4yMDMxIFE4MS40MjE5IDIyMS4yMDMxIDcwLjUyMzQgMjA2LjA4NTkgUTU5LjYyNSAxOTAuOTY4OCA1OS42MjUgMTYwLjMxMjUgUTU5LjYyNSAxMjkuNTE1NiA3MC41OTM4IDExNC4zOTg0IFE4MS41NjI1IDk5LjI4MTIgMTAzLjc4MTIgOTkuMjgxMiBRMTI2LjE0MDYgOTkuMjgxMiAxMzcuMTA5NCAxMTQuMzk4NCBRMTQ4LjA3ODEgMTI5LjUxNTYgMTQ4LjA3ODEgMTYwLjMxMjUgUTE0OC4wNzgxIDE4My41MTU2IDE0Mi4wMzEyIDE5Ny42NDg0IFExMzUuOTg0NCAyMTEuNzgxMiAxMjMuNjA5NCAyMTcuNDA2MiBMMTQxLjMyODEgMjMyLjMxMjUgTDEyNy45Njg4IDI0MC4xODc1IEwxMDcuMjk2OSAyMjEuMDYyNSBaTTEyOS4zNzUgMTYwLjMxMjUgUTEyOS4zNzUgMTM0LjQzNzUgMTIzLjM5ODQgMTIzLjMyODEgUTExNy40MjE5IDExMi4yMTg4IDEwMy43ODEyIDExMi4yMTg4IFE5MC4yODEyIDExMi4yMTg4IDg0LjMwNDcgMTIzLjMyODEgUTc4LjMyODEgMTM0LjQzNzUgNzguMzI4MSAxNjAuMzEyNSBRNzguMzI4MSAxODYuMTg3NSA4NC4zMDQ3IDE5Ny4yOTY5IFE5MC4yODEyIDIwOC40MDYyIDEwMy43ODEyIDIwOC40MDYyIFExMTcuNDIxOSAyMDguNDA2MiAxMjMuMzk4NCAxOTcuMjk2OSBRMTI5LjM3NSAxODYuMTg3NSAxMjkuMzc1IDE2MC4zMTI1IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZo0tcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTYxLjg3NSAxMDEuNjcxOSBMNzkuNzM0NCAxMDEuNjcxOSBMNzkuNzM0NCAxNTEuMzEyNSBMMTMwLjY0MDYgMTAxLjY3MTkgTDE1My43MDMxIDEwMS42NzE5IEw5Ni40Njg4IDE1Ni41MTU2IEwxNTguMzQzOCAyMTkuMjM0NCBMMTM0Ljg1OTQgMjE5LjIzNDQgTDc5LjczNDQgMTYyLjU2MjUgTDc5LjczNDQgMjE5LjIzNDQgTDYxLjg3NSAyMTkuMjM0NCBMNjEuODc1IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcblxcbiAgICA8dGFibGUgc3R5bGU9XFxcImJvcmRlci13aWR0aDoxcHhcXFwiPlxcbiAgICAgICAgPHRyIHdpZHRoPVxcXCIxMDAlXFxcIiBoZWlnaHQ9XFxcIjEwcHhcXFwiIHN0eWxlPVxcXCJ2aXNpYmlsaXR5OnZpc2libGVcXFwifT5cXG4gICAgICAgICAgICA8dGQgd2lkdGg9XFxcIjUwcHhcXFwiPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsdWVcXFwiPiZibG9jazs8L3NwYW4+PC9wbGF5aW5nLWNhcmQ8L3RkPlxcbiAgICAgICAgPC90cj5cXG4gICAgICAgIDx0ciB3aWR0aD1cXFwiMTAwJVxcXCI+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlcztBPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlczsyPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlczszPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlczs0PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlczs1PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlczs2PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlczs3PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlczs4PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlczs5PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlczsxMDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7Sjwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7UTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7Szwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgPC90cj5cXG4gICAgICAgIDx0cj5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzO0E8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzI8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzM8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzQ8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzU8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzY8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzc8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzg8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzk8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzEwPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0cztKPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0cztRPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0cztLPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICA8L3RyPlxcbiAgICAgICAgPHRyPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtcztBPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zOzI8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7Mzwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczs0PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zOzU8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7Njwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczs3PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zOzg8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7OTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczsxMDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtcztKPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zO1E8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7Szwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgPC90cj5cXG4gICAgICAgIDx0cj5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHVicztBPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7Mjwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzM8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczs0PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7NTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzY8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczs3PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7ODwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzk8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczsxMDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzO0o8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHVicztRPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7Szwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgPC90cj5cXG4gICAgPC90YWJsZT5cXG48L2Rpdj5cXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yYXctbG9hZGVyIS4vdmlld3MvcGFydGlhbHMvZnJlc2hkZWNrLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImxldCBjb25uZWN0UGFydGlhbCA9IHJlcXVpcmUoXCJyYXctbG9hZGVyIS4uLy4uL3ZpZXdzL3BhcnRpYWxzL2Nvbm5lY3QuaHRtbFwiKTtcbmV4cG9ydCBjbGFzcyBDb25uZWN0UGFnZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLmlubmVySFRNTCA9ICc8cD4nICsgY29ubmVjdFBhcnRpYWwgKyAnPC9wPic7XG4gICAgfVxufVxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwiY29ubmVjdC1wYWdlXCIsIENvbm5lY3RQYWdlKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYWdlcy9jb25uZWN0LmpzIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxzcGFuIGNsYXNzPVxcXCJjb25uZWN0XFxcIj5cXG48cD5UaGlzIGlzIHRoZSBjb25uZWN0IHBhZ2UuPC9wPlxcbjx1bD5cXG48bGk+cGVuZGluZyBpbnZpdGF0aW9uczwvPlxcbjxsaT5saXN0IG9mIHBsYXllcnM8L2xpPlxcbjxsaT5jb25uZWN0ZWQgcGxheWVyczwvbGk+XFxuXFxuPGgxPkhlbGxvIHdvcmxkIGd1biBhcHA8L2gxPlxcbjxwPk9wZW4geW91ciB3ZWIgY29uc29sZTwvcD5cXG48L3NwYW4+XFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmF3LWxvYWRlciEuL3ZpZXdzL3BhcnRpYWxzL2Nvbm5lY3QuaHRtbFxuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==