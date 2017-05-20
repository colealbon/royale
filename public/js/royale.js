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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZGZiNzc0YTVmMDA0YjA4ZTU3ZTEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvdXRpbC5qcyIsIndlYnBhY2s6Ly8vLi9+L3Byb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlYmVsLXJvdXRlci9zcmMvcmViZWwtcm91dGVyLmpzIiwid2VicGFjazovLy8uL34vZ3VuL2d1bi5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vbW9kdWxlLmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi92aWV3cy9wYXJ0aWFscy9pbmRleC5odG1sIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9yb2FkbWFwLmpzIiwid2VicGFjazovLy8uL3ZpZXdzL3BhcnRpYWxzL3JvYWRtYXAuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvY29udGFjdC5qcyIsIndlYnBhY2s6Ly8vLi92aWV3cy9wYXJ0aWFscy9jb250YWN0Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL21lc3NhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vdmlld3MvcGFydGlhbHMvbWVzc2FnZV9mb3JtLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2RlY2suanMiLCJ3ZWJwYWNrOi8vLy4vdmlld3MvcGFydGlhbHMvZnJlc2hkZWNrLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2Nvbm5lY3QuanMiLCJ3ZWJwYWNrOi8vLy4vdmlld3MvcGFydGlhbHMvY29ubmVjdC5odG1sIl0sIm5hbWVzIjpbInV0aWwiLCJ3aW5kb3ciLCJoYW5kbGVQb3N0IiwiZGV0ZXJtaW5lQ29udGVudFR5cGUiLCJlbmNyeXB0Q2xlYXJUZXh0IiwiZGVjcnlwdFBHUE1lc3NhZ2VXaXRoS2V5IiwiZGVjcnlwdFBHUE1lc3NhZ2UiLCJQR1BQVUJLRVkiLCJDTEVBUlRFWFQiLCJQR1BQUklWS0VZIiwiUEdQTUVTU0FHRSIsImRldGVybWluZUtleVR5cGUiLCJjb250ZW50IiwiUHJvbWlzZSIsInJlamVjdCIsIm9wZW5wZ3AiLCJyZXNvbHZlIiwicHJpdmF0ZUtleXMiLCJrZXkiLCJyZWFkQXJtb3JlZCIsInByaXZhdGVLZXkiLCJrZXlzIiwidG9QdWJsaWMiLCJhcm1vciIsImVycm9yIiwicG9zc2libGVwZ3BrZXkiLCJ0aGVuIiwia2V5VHlwZSIsIm1lc3NhZ2UiLCJlcnIiLCJnZXRGcm9tU3RvcmFnZSIsImxvY2FsU3RvcmFnZSIsImluZGV4S2V5IiwiaSIsImxlbmd0aCIsImtleUFyciIsInB1c2giLCJnZXRJdGVtIiwic2F2ZVBHUFB1YmtleSIsIlBHUGtleUFybW9yIiwiUEdQa2V5IiwidXNlcnMiLCJ1c2VySWQiLCJ1c2VyaWQiLCJleGlzdGluZ0tleSIsImV4aXN0aW5nS2V5VHlwZSIsInNldEl0ZW0iLCJjYXRjaCIsInNhdmVQR1BQcml2a2V5IiwicHJvY2VzcyIsInNldEltbWVkaWF0ZSIsInB1YmxpY0tleUFybW9yIiwiY2xlYXJ0ZXh0IiwiUEdQUHVia2V5IiwiZW5jcnlwdE1lc3NhZ2UiLCJlbmNyeXB0ZWR0eHQiLCJvcHRpb25zIiwiZGF0YSIsInB1YmxpY0tleXMiLCJlbmNyeXB0IiwiY2lwaGVydGV4dCIsIlBHUE1lc3NhZ2VBcm1vciIsInByaXZhdGVLZXlBcm1vciIsInBhc3N3b3JkIiwiZGVjcnlwdCIsImRlY3J5cHRNZXNzYWdlIiwicmVzdWx0Iiwic3RvcmVBcnIiLCJmaWx0ZXIiLCJzdG9yYWdlSXRlbSIsIm1hcCIsImNvbnRlbnRUeXBlIiwiZGVjcnlwdGVkIiwiZW5jcnlwdGVkQXJyIiwic3RvcmFnZUFyciIsImVuY3J5cHRlZCIsImNvbnNvbGUiLCJsb2ciLCJtb2R1bGUiLCJleHBvcnRzIiwiY2FjaGVkU2V0VGltZW91dCIsImNhY2hlZENsZWFyVGltZW91dCIsImRlZmF1bHRTZXRUaW1vdXQiLCJFcnJvciIsImRlZmF1bHRDbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiZSIsImNsZWFyVGltZW91dCIsInJ1blRpbWVvdXQiLCJmdW4iLCJjYWxsIiwicnVuQ2xlYXJUaW1lb3V0IiwibWFya2VyIiwicXVldWUiLCJkcmFpbmluZyIsImN1cnJlbnRRdWV1ZSIsInF1ZXVlSW5kZXgiLCJjbGVhblVwTmV4dFRpY2siLCJjb25jYXQiLCJkcmFpblF1ZXVlIiwidGltZW91dCIsImxlbiIsInJ1biIsIm5leHRUaWNrIiwiYXJncyIsIkFycmF5IiwiYXJndW1lbnRzIiwiSXRlbSIsImFycmF5IiwicHJvdG90eXBlIiwiYXBwbHkiLCJ0aXRsZSIsImJyb3dzZXIiLCJlbnYiLCJhcmd2IiwidmVyc2lvbiIsInZlcnNpb25zIiwibm9vcCIsIm9uIiwiYWRkTGlzdGVuZXIiLCJvbmNlIiwib2ZmIiwicmVtb3ZlTGlzdGVuZXIiLCJyZW1vdmVBbGxMaXN0ZW5lcnMiLCJlbWl0IiwicHJlcGVuZExpc3RlbmVyIiwicHJlcGVuZE9uY2VMaXN0ZW5lciIsImxpc3RlbmVycyIsIm5hbWUiLCJiaW5kaW5nIiwiY3dkIiwiY2hkaXIiLCJkaXIiLCJ1bWFzayIsIlJlYmVsUm91dGVyIiwicHJlZml4IiwiX3ByZWZpeCIsInByZXZpb3VzUGF0aCIsImJhc2VQYXRoIiwiZ2V0QXR0cmlidXRlIiwiaW5oZXJpdCIsIiRlbGVtZW50IiwicGFyZW50Tm9kZSIsIm5vZGVOYW1lIiwidG9Mb3dlckNhc2UiLCJjdXJyZW50Iiwicm91dGUiLCJyb3V0ZXMiLCIkY2hpbGRyZW4iLCJjaGlsZHJlbiIsIiRjaGlsZCIsInBhdGgiLCIkdGVtcGxhdGUiLCJpbm5lckhUTUwiLCJzaGFkb3dSb290IiwiY3JlYXRlU2hhZG93Um9vdCIsInJvb3QiLCJhbmltYXRpb24iLCJpbml0QW5pbWF0aW9uIiwicmVuZGVyIiwicGF0aENoYW5nZSIsImlzQmFjayIsImNsYXNzTGlzdCIsImFkZCIsInJlbW92ZSIsIm9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsIm5vZGUiLCJhZGRlZE5vZGVzIiwidW5kZWZpbmVkIiwib3RoZXJDaGlsZHJlbiIsImdldE90aGVyQ2hpbGRyZW4iLCJmb3JFYWNoIiwiY2hpbGQiLCJhbmltYXRpb25FbmQiLCJldmVudCIsInRhcmdldCIsImNsYXNzTmFtZSIsImluZGV4T2YiLCJyZW1vdmVDaGlsZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJvYnNlcnZlIiwiY2hpbGRMaXN0IiwiZ2V0UGF0aEZyb21VcmwiLCJyZWdleFN0cmluZyIsInJlcGxhY2UiLCJyZWdleCIsIlJlZ0V4cCIsInRlc3QiLCJfcm91dGVSZXN1bHQiLCJjb21wb25lbnQiLCIkY29tcG9uZW50IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwicGFyYW1zIiwidmFsdWUiLCJKU09OIiwicGFyc2UiLCJzZXRBdHRyaWJ1dGUiLCJhcHBlbmRDaGlsZCIsInRlbXBsYXRlIiwiYSIsImIiLCJyIiwicmVzdWx0cyIsInVybCIsInF1ZXJ5U3RyaW5nIiwic3Vic3RyIiwic3BsaXQiLCJwYXJ0IiwiZXEiLCJ2YWwiLCJkZWNvZGVVUklDb21wb25lbnQiLCJmcm9tIiwidG8iLCJpbmRleCIsInN1YnN0cmluZyIsIkNsYXNzIiwidG9TdHJpbmciLCJtYXRjaCIsInZhbGlkRWxlbWVudFRhZyIsImNvbnN0cnVjdG9yIiwiSFRNTEVsZW1lbnQiLCJjbGFzc1RvVGFnIiwiaXNSZWdpc3RlcmVkRWxlbWVudCIsInJlZ2lzdGVyRWxlbWVudCIsInRhZyIsImNhbGxiYWNrIiwiY2hhbmdlQ2FsbGJhY2tzIiwiY2hhbmdlSGFuZGxlciIsImxvY2F0aW9uIiwiaHJlZiIsIm9sZFVSTCIsIm9uaGFzaGNoYW5nZSIsInBhcnNlUXVlcnlTdHJpbmciLCJyZSIsImV4ZWMiLCJyZXN1bHRzMiIsIml0ZW0iLCJpZHgiLCJSZWJlbFJvdXRlIiwiUmViZWxEZWZhdWx0IiwiUmViZWxCYWNrQSIsInByZXZlbnREZWZhdWx0IiwiZGlzcGF0Y2hFdmVudCIsIkN1c3RvbUV2ZW50IiwiaGFzaCIsIkhUTUxBbmNob3JFbGVtZW50IiwiZXh0ZW5kcyIsIm9iaiIsImhhc093blByb3BlcnR5IiwiZ2V0UGFyYW1zRnJvbVVybCIsImdsb2JhbCIsInJlcXVpcmUiLCJhcmciLCJzbGljZSIsIm1vZCIsImNvbW1vbiIsIlR5cGUiLCJmbnMiLCJmbiIsImlzIiwiYmkiLCJCb29sZWFuIiwibnVtIiwibiIsImxpc3RfaXMiLCJwYXJzZUZsb2F0IiwiSW5maW5pdHkiLCJ0ZXh0IiwidCIsImlmeSIsInN0cmluZ2lmeSIsInJhbmRvbSIsImwiLCJjIiwicyIsImNoYXJBdCIsIk1hdGgiLCJmbG9vciIsIm8iLCJoYXMiLCJsaXN0IiwibSIsImZ1enp5IiwiZiIsInNsaXQiLCJzb3J0IiwiayIsIkEiLCJCIiwiXyIsIm9ial9tYXAiLCJPYmplY3QiLCJwdXQiLCJ2IiwiZGVsIiwiYXMiLCJ1Iiwib2JqX2lzIiwib2JqX2hhcyIsImNvcHkiLCJlbXB0eSIsIngiLCJsbCIsImxsZSIsImZuX2lzIiwiaWkiLCJ0aW1lIiwiRGF0ZSIsImdldFRpbWUiLCJvbnRvIiwibmV4dCIsIkZ1bmN0aW9uIiwiYmUiLCJ0aGUiLCJsYXN0IiwiYmFjayIsIk9uIiwiQ2hhaW4iLCJjcmVhdGUiLCJvcHQiLCJpZCIsInJpZCIsInV1aWQiLCJzdHVuIiwiY2hhaW4iLCJldiIsInNraXAiLCJjYiIsInJlcyIsInRtcCIsInEiLCJhY3QiLCJhdCIsImN0eCIsImFzayIsInNjb3BlIiwiYWNrIiwicmVwbHkiLCJvbnMiLCJHdW4iLCJpbnB1dCIsImd1biIsInNvdWwiLCJzdGF0ZSIsIndhaXRpbmciLCJ3aGVuIiwic29vbmVzdCIsInNldCIsImZ1dHVyZSIsIm5vdyIsImNoZWNrIiwiZWFjaCIsIndhaXQiLCJIQU0iLCJtYWNoaW5lU3RhdGUiLCJpbmNvbWluZ1N0YXRlIiwiY3VycmVudFN0YXRlIiwiaW5jb21pbmdWYWx1ZSIsImN1cnJlbnRWYWx1ZSIsImRlZmVyIiwiaGlzdG9yaWNhbCIsImNvbnZlcmdlIiwiaW5jb21pbmciLCJMZXhpY2FsIiwiVmFsIiwidGV4dF9pcyIsImJpX2lzIiwibnVtX2lzIiwicmVsIiwicmVsXyIsIm9ial9wdXQiLCJOb2RlIiwic291bF8iLCJ0ZXh0X3JhbmRvbSIsIm9ial9kZWwiLCJTdGF0ZSIsInBlcmYiLCJzdGFydCIsIk4iLCJkcmlmdCIsIkQiLCJwZXJmb3JtYW5jZSIsInRpbWluZyIsIm5hdmlnYXRpb25TdGFydCIsIk5fIiwib2JqX2FzIiwiR3JhcGgiLCJnIiwib2JqX2VtcHR5IiwibmYiLCJncmFwaCIsInNlZW4iLCJ2YWxpZCIsIm9ial9jb3B5IiwicHJldiIsImludmFsaWQiLCJqb2luIiwiYXJyIiwiRHVwIiwiY2FjaGUiLCJ0cmFjayIsImdjIiwiZGUiLCJvbGRlc3QiLCJtYXhBZ2UiLCJtaW4iLCJkb25lIiwiZWxhcHNlZCIsIm5leHRHQyIsInRvSlNPTiIsImR1cCIsImZpZWxkIiwiY2F0IiwiY29hdCIsIm9ial90byIsImdldCIsInN5bnRoIiwiX3NvdWwiLCJfZmllbGQiLCJob3ciLCJwZWVycyIsIndzYyIsInByb3RvY29scyIsImRlYnVnIiwidyIsIiQiLCJvdXRwdXQiLCJvdXQiLCJjYXAiLCJhcHAiLCJmb28iLCJiYXIiLCJyYWIiLCJhc2RmIiwiYmF6IiwiZmRzYSIsInllcyIsInByb3h5IiwiY2hhbmdlIiwiZWNobyIsIm5vdCIsInJlbGF0ZSIsIm5vZGVfIiwicmV2ZXJiIiwidmlhIiwidXNlIiwicmVmIiwiYW55IiwiYmF0Y2giLCJubyIsImlpZmUiLCJtZXRhIiwiX18iLCJ2ZXJ0ZXgiLCJ1bmlvbiIsIm1hY2hpbmUiLCJzdGF0ZV9pcyIsImNzIiwiaXYiLCJjdiIsInZhbF9pcyIsInN0YXRlX2lmeSIsImRlbHRhIiwiZGlmZiIsIm5vZGVfc291bCIsIm5vZGVfaXMiLCJub2RlX2lmeSIsInJlbF9pcyIsImtleWVkIiwiaWZmZSIsInBzZXVkbyIsIm5vcm1hbGl6ZSIsInNlYXJjaCIsInRyaWVkIiwibGV4IiwiY2hhbmdlZCIsInJlc3VtZSIsImVhcyIsInN1YnMiLCJiaW5kIiwib2siLCJhc3luYyIsIm91Z2h0IiwibmVlZCIsImltcGxlbWVudCIsImZpZWxkcyIsIm5fIiwic3RvcmUiLCJyZW1vdmVJdGVtIiwiZGlydHkiLCJjb3VudCIsIm1heCIsInNhdmUiLCJhbGwiLCJXZWJTb2NrZXQiLCJ3ZWJraXRXZWJTb2NrZXQiLCJtb3pXZWJTb2NrZXQiLCJ3c3AiLCJ1ZHJhaW4iLCJzZW5kIiwicGVlciIsIm1zZyIsIndpcmUiLCJvcGVuIiwicmVhZHlTdGF0ZSIsIk9QRU4iLCJyZWNlaXZlIiwiYm9keSIsIm9uY2xvc2UiLCJyZWNvbm5lY3QiLCJvbmVycm9yIiwiY29kZSIsIm9ub3BlbiIsIm9ubWVzc2FnZSIsIndlYnBhY2tQb2x5ZmlsbCIsImRlcHJlY2F0ZSIsInBhdGhzIiwiaW5kZXhQYXJ0aWFsIiwiSW5kZXhQYWdlIiwicm9hZG1hcFBhcnRpYWwiLCJSb2FkbWFwUGFnZSIsImNvbnRhY3RQYXJ0aWFsIiwiQ29udGFjdFBhZ2UiLCJjbGllbnRQdWJrZXlGb3JtUGFydGlhbCIsIk1lc3NhZ2VQYWdlIiwiZnJlc2hEZWNrUGFydGlhbCIsIkRlY2tQYWdlIiwiY3JlYXRlZENhbGxiYWNrIiwicXVlcnlTZWxlY3RvciIsInRleHRDb250ZW50IiwiY2xvbmUiLCJpbXBvcnROb2RlIiwiY29sb3JPdmVycmlkZSIsInN0eWxlIiwiY29sb3IiLCJmaWxsIiwiY29ubmVjdFBhcnRpYWwiLCJDb25uZWN0UGFnZSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBOztBQUVBOztBQUNBOztLQUFZQSxJOztBQVFaOztBQUdBOztBQUdBOztBQUNBOztBQUNBOztBQUNBOztB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IFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGRmYjc3NGE1ZjAwNGIwOGU1N2UxIiwiJ3VzZSBzdHJpY3QnO1xuLy9pbXBvcnQgJ3dlYmNvbXBvbmVudHMuanMvd2ViY29tcG9uZW50cy5qcyc7XG4vL3VuY29tbWVudCBsaW5lIGFib3ZlIHRvIGRvdWJsZSBhcHAgc2l6ZSBhbmQgc3VwcG9ydCBpb3MuXG5cbi8vIGhlbHBlciBmdW5jdGlvbnNcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi9saWIvdXRpbCc7XG53aW5kb3cuaGFuZGxlUG9zdCA9IHV0aWwuaGFuZGxlUG9zdDtcblxuLy8gd2luZG93LmhhbmRsZUNvbnRlbnQgPSB1dGlsLmhhbmRsZUNvbnRlbnQ7XG4vLyB3aW5kb3cuaXNQR1BQdWJrZXkgICA9IHV0aWwuaXNQR1BQdWJrZXk7XG4vLyB3aW5kb3cuaXNQR1BQcml2a2V5ICA9IHV0aWwuaXNQR1BQcml2a2V5O1xuXG4vLyByZWJlbCByb3V0ZXJcbmltcG9ydCB7UmViZWxSb3V0ZXJ9IGZyb20gJy4uL25vZGVfbW9kdWxlcy9yZWJlbC1yb3V0ZXIvc3JjL3JlYmVsLXJvdXRlci5qcyc7XG5cbi8vIEd1bmRiIHB1YmxpYyBmYWNpbmcgREFHIGRhdGFiYXNlICAoZm9yIG1lc3NhZ2VzIHRvIGFuZCBmcm9tIHRoZSBlbmVteSlcbmltcG9ydCB7R3VufSBmcm9tICdndW4vZ3VuLmpzJztcblxuLy8gcGFnZXMgKG1vc3Qgb2YgdGhpcyBzaG91bGQgYmUgaW4gdmlld3MvcGFydGlhbHMgdG8gYWZmZWN0IGlzb3Jtb3JwaGlzbSlcbmltcG9ydCB7SW5kZXhQYWdlfSAgIGZyb20gJy4vcGFnZXMvaW5kZXguanMnO1xuaW1wb3J0IHtSb2FkbWFwUGFnZX0gZnJvbSAnLi9wYWdlcy9yb2FkbWFwLmpzJztcbmltcG9ydCB7Q29udGFjdFBhZ2V9IGZyb20gJy4vcGFnZXMvY29udGFjdC5qcyc7XG5pbXBvcnQge01lc3NhZ2VQYWdlfSBmcm9tICcuL3BhZ2VzL21lc3NhZ2UuanMnO1xuaW1wb3J0IHtEZWNrUGFnZX0gICAgZnJvbSAnLi9wYWdlcy9kZWNrLmpzJztcbmltcG9ydCB7Q29ubmVjdFBhZ2V9IGZyb20gJy4vcGFnZXMvY29ubmVjdC5qcyc7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IFBHUFBVQktFWSA9ICdQR1BQdWJrZXknO1xuY29uc3QgQ0xFQVJURVhUID0gJ2NsZWFydGV4dCc7XG5jb25zdCBQR1BQUklWS0VZID0gJ1BHUFByaXZrZXknO1xuY29uc3QgUEdQTUVTU0FHRSA9ICdQR1BNZXNzYWdlJztcblxuZnVuY3Rpb24gZGV0ZXJtaW5lS2V5VHlwZShjb250ZW50KSB7XG4gICAgcmV0dXJuICghY29udGVudCkgP1xuICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzaW5nIHBncEtleScpOlxuICAgIChvcGVucGdwKSA9PiB7XG4gICAgICAgIHJldHVybiAoIW9wZW5wZ3ApID9cbiAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIG9wZW5wZ3AnKTpcbiAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsZXQgcHJpdmF0ZUtleXMgPSBvcGVucGdwLmtleS5yZWFkQXJtb3JlZChjb250ZW50KVxuICAgICAgICAgICAgICAgIGxldCBwcml2YXRlS2V5ID0gcHJpdmF0ZUtleXMua2V5c1swXVxuICAgICAgICAgICAgICAgIGlmIChwcml2YXRlS2V5LnRvUHVibGljKCkuYXJtb3IoKSAhPT0gcHJpdmF0ZUtleS5hcm1vcigpICkge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKFBHUFBSSVZLRVkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoUEdQUFVCS0VZKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGV0ZXJtaW5lQ29udGVudFR5cGUoY29udGVudCkge1xuICAgIC8vIHVzYWdlOiBkZXRlcm1pbmVDb250ZW50VHlwZShjb250ZW50KShvcGVucGdwKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpXG4gICAgcmV0dXJuICghY29udGVudCkgP1xuICAgIFByb21pc2UucmVzb2x2ZSgnJyk6XG4gICAgKG9wZW5wZ3ApID0+IHtcbiAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBsZXQgcG9zc2libGVwZ3BrZXkgPSBvcGVucGdwLmtleS5yZWFkQXJtb3JlZChjb250ZW50KTtcbiAgICAgICAgICAgIGlmIChwb3NzaWJsZXBncGtleS5rZXlzWzBdKSB7XG4gICAgICAgICAgICAgICAgZGV0ZXJtaW5lS2V5VHlwZShjb250ZW50KShvcGVucGdwKVxuICAgICAgICAgICAgICAgIC50aGVuKChrZXlUeXBlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoa2V5VHlwZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5wZ3AubWVzc2FnZS5yZWFkQXJtb3JlZChjb250ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShQR1BNRVNTQUdFKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShDTEVBUlRFWFQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGdldEZyb21TdG9yYWdlKGxvY2FsU3RvcmFnZSkge1xuICAgIC8vIHVzYWdlOiBzYXZlUEdQa2V5KGNvbnRlbnQpKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSkudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgIHJldHVybiAoIWxvY2FsU3RvcmFnZSkgP1xuICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBsb2NhbFN0b3JhZ2UnKTpcbiAgICAoaW5kZXhLZXkpID0+IHtcbiAgICAgICAgcmV0dXJuICghaW5kZXhLZXkpID9cbiAgICAgICAgLy8gbm8gaW5kZXggLT4gcmV0dXJuIGV2ZXJ5dGhpbmdcbiAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsZXQgaSA9IGxvY2FsU3RvcmFnZS5sZW5ndGhcbiAgICAgICAgICAgICAgICBsZXQga2V5QXJyID0gW11cbiAgICAgICAgICAgICAgICB3aGlsZSAoaSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGkgPSBpIC0gMVxuICAgICAgICAgICAgICAgICAgICBrZXlBcnIucHVzaChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShsb2NhbFN0b3JhZ2Uua2V5KGkpKSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoa2V5QXJyKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pOlxuICAgICAgICAvLyBpbmRleCBwcm92aWRlZCAtPiByZXR1cm4gb25lXG4gICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShpbmRleEtleSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNhdmVQR1BQdWJrZXkoUEdQa2V5QXJtb3IpIHtcbiAgICAvLyBzYXZlIHB1YmxpYyBrZXkgdG8gc3RvcmFnZSBvbmx5IGlmIGl0IGRvZXNuJ3Qgb3ZlcndyaXRlIGEgcHJpdmF0ZSBrZXlcbiAgICAvLyB1c2FnZTogc2F2ZVBHUFB1YmtleShjb250ZW50KShvcGVucGdwKShsb2NhbFN0b3JhZ2UpLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbiAgICByZXR1cm4gKCFQR1BrZXlBcm1vcikgP1xuICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBQR1BrZXlBcm1vcicpOlxuICAgIChvcGVucGdwKSA9PiB7XG4gICAgICAgIHJldHVybiAoIW9wZW5wZ3ApID9cbiAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIG9wZW5wZ3AnKTpcbiAgICAgICAgKGxvY2FsU3RvcmFnZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICghbG9jYWxTdG9yYWdlKSA/XG4gICAgICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgbG9jYWxTdG9yYWdlJyk6XG4gICAgICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IFBHUGtleSA9IG9wZW5wZ3Aua2V5LnJlYWRBcm1vcmVkKFBHUGtleUFybW9yKTtcbiAgICAgICAgICAgICAgICBnZXRGcm9tU3RvcmFnZShsb2NhbFN0b3JhZ2UpKFBHUGtleS5rZXlzWzBdLnVzZXJzWzBdLnVzZXJJZC51c2VyaWQpXG4gICAgICAgICAgICAgICAgLnRoZW4oZXhpc3RpbmdLZXkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCFleGlzdGluZ0tleSkgP1xuICAgICAgICAgICAgICAgICAgICBQcm9taXNlLnJlc29sdmUoJ25vbmUnKSA6XG4gICAgICAgICAgICAgICAgICAgIGRldGVybWluZUNvbnRlbnRUeXBlKGV4aXN0aW5nS2V5KShvcGVucGdwKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKGV4aXN0aW5nS2V5VHlwZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleGlzdGluZ0tleVR5cGUgPT09ICdQR1BQcml2a2V5Jyl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCdwdWJrZXkgaWdub3JlZCBYLSBhdHRlbXB0ZWQgb3ZlcndyaXRlIHByaXZrZXknKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oUEdQa2V5LmtleXNbMF0udXNlcnNbMF0udXNlcklkLnVzZXJpZCwgUEdQa2V5QXJtb3IpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGBwdWJsaWMgcGdwIGtleSBzYXZlZCA8LSAke1BHUGtleS5rZXlzWzBdLnVzZXJzWzBdLnVzZXJJZC51c2VyaWR9YClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlamVjdChlcnIpKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gc2F2ZVBHUFByaXZrZXkoUEdQa2V5QXJtb3IpIHtcbiAgICAvLyBzYXZlIHByaXZhdGUga2V5IHRvIHN0b3JhZ2Ugbm8gcXVlc3Rpb25zIGFza2VkXG4gICAgLy8gdXNhZ2U6IHNhdmVQR1BQcml2a2V5KGNvbnRlbnQpKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSkudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgIHJldHVybiAoIVBHUGtleUFybW9yKSA/XG4gICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIFBHUGtleUFybW9yJyk6XG4gICAgKG9wZW5wZ3ApID0+IHtcbiAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgICAgICAobG9jYWxTdG9yYWdlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCFsb2NhbFN0b3JhZ2UpID9cbiAgICAgICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBsb2NhbFN0b3JhZ2UnKTpcbiAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgUEdQa2V5ID0gb3BlbnBncC5rZXkucmVhZEFybW9yZWQoUEdQa2V5QXJtb3IpO1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShQR1BrZXkua2V5c1swXS51c2Vyc1swXS51c2VySWQudXNlcmlkLCBQR1BrZXlBcm1vcilcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5zZXRJbW1lZGlhdGUoXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGBwcml2YXRlIHBncCBrZXkgc2F2ZWQgPC0gJHtQR1BrZXkua2V5c1swXS51c2Vyc1swXS51c2VySWQudXNlcmlkfWApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB9IGNhdGNoKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5jcnlwdENsZWFyVGV4dChvcGVucGdwKSB7XG4gICAgLy8gdXNhZ2U6IGVuY3J5cHRDbGVhclRleHQob3BlbnBncCkocHVibGljS2V5QXJtb3IpKGNsZWFydGV4dCkudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgIHJldHVybiAoIW9wZW5wZ3ApID9cbiAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgIChwdWJsaWNLZXlBcm1vcikgPT4ge1xuICAgICAgICByZXR1cm4gKCFwdWJsaWNLZXlBcm1vcikgP1xuICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgcHVibGljIGtleScpOlxuICAgICAgICAoY2xlYXJ0ZXh0KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCFjbGVhcnRleHQpID9cbiAgICAgICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBjbGVhcnRleHQnKTpcbiAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgUEdQUHVia2V5ID0gb3BlbnBncC5rZXkucmVhZEFybW9yZWQocHVibGljS2V5QXJtb3IpXG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICB0aGUgbGF0ZXN0IG9wZW5wZ3AgMi41LjQgYnJlYWtzIG9uIG91ciBjb25zb2xlIG9ubHkgdG9vbHMuXG4gICAgICAgICAgICAgICAgYnV0IGl0J3MgMTB4IGZhc3RlciBvbiBicm93c2VycyBzbyBUSEUgTkVXIENPREUgU1RBWVMgSU4uXG4gICAgICAgICAgICAgICAgYmVsb3cgd2UgZXhwbG9pdCBmYWxsYmFjayB0byBvbGQgc2xvdyBlcnJvciBmcmVlIG9wZW5wZ3AgMS42LjJcbiAgICAgICAgICAgICAgICBieSBhZGFwdGluZyBvbiB0aGUgZmx5IHRvIGEgYnJlYWtpbmcgY2hhbmdlXG4gICAgICAgICAgICAgICAgKG9wZW5wZ3AgYnVnIF4xLjYuMiAtPiAyLjUuNCBtYWRlIHVzIGRvIGl0KVxuICAgICAgICAgICAgICAgIHJlZmFjdG9yOiByZW1vdmUgdHJ5IHNlY3Rpb24gb2YgdHJ5Y2F0Y2gga2VlcCBjYXRjaCBzZWN0aW9uXG4gICAgICAgICAgICAgICAgYnkgYWxsIG1lYW5zIHJlZmFjdG9yIGlmIG5vdCBicm9rZW4gYWZ0ZXIgb3BlbnBncCAyLjUuNFxuICAgICAgICAgICAgICAgIGlmIHlvdSBjaGVjayBvcGVucGdwIHBsZWFzZSBidW1wIGZhaWxpbmcgdmVyc2lvbiAgXl5eXl5cbiAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHdvcmtzIG9ubHkgb24gb3BlbnBncCB2ZXJzaW9uIDEuNi4yXG4gICAgICAgICAgICAgICAgICAgIG9wZW5wZ3AuZW5jcnlwdE1lc3NhZ2UoUEdQUHVia2V5LmtleXNbMF0sIGNsZWFydGV4dClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZW5jcnlwdGVkdHh0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZW5jcnlwdGVkdHh0KVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKVxuICAgICAgICAgICAgICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHdvcmtzIG9uIG9wZW5wZ3AgdmVyc2lvbiAyLjUuNFxuICAgICAgICAgICAgICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGNsZWFydGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1YmxpY0tleXM6IG9wZW5wZ3Aua2V5LnJlYWRBcm1vcmVkKHB1YmxpY0tleUFybW9yKS5rZXlzLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJtb3I6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgb3BlbnBncC5lbmNyeXB0KG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChjaXBoZXJ0ZXh0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNpcGhlcnRleHQuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIGZ1bmN0aW9uIGVuY3J5cHRDb250ZW50KGNvbnRlbnQpIHtcbi8vICAgICAvLyB1c2FnZTogZW5jcnlwdENvbnRlbnQoY29udGVudCkob3BlbnBncCkobG9jYWxTdG9yYWdlKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpXG4vLyAgICAgcmV0dXJuICghY29udGVudCkgP1xuLy8gICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBjb250ZW50Jyk6XG4vLyAgICAgKG9wZW5wZ3ApID0+IHtcbi8vICAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuLy8gICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuLy8gICAgICAgICAobG9jYWxTdG9yYWdlKSA9PiB7XG4vLyAgICAgICAgICAgICBpZiAoIWxvY2FsU3RvcmFnZSkge1xuLy8gICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgbG9jYWxTdG9yYWdlJyk7XG4vLyAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICBsZXQgZW5jcnlwdGVkQXJyID0gW107XG4vLyAgICAgICAgICAgICBnZXRGcm9tU3RvcmFnZShsb2NhbFN0b3JhZ2UpKClcbi8vICAgICAgICAgICAgIC50aGVuKHN0b3JhZ2VBcnIgPT4ge1xuLy8gICAgICAgICAgICAgICAgIHN0b3JhZ2VBcnJcbi8vICAgICAgICAgICAgICAgICAuZmlsdGVyKChzdG9yYWdlSXRlbSkgPT4gc3RvcmFnZUl0ZW0gIT09IG51bGwpXG4vLyAgICAgICAgICAgICAgICAgLmZpbHRlcigoc3RvcmFnZUl0ZW0pID0+IHtcbi8vICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRldGVybWluZUNvbnRlbnRUeXBlKHN0b3JhZ2VJdGVtKShvcGVucGdwKVxuLy8gICAgICAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4ge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICggcmVzdWx0ID09PSBQR1BQVUJLRVkgKVxuLy8gICAgICAgICAgICAgICAgICAgICB9KTtcbi8vICAgICAgICAgICAgICAgICB9KVxuLy8gICAgICAgICAgICAgICAgIC5tYXAoKHN0b3JhZ2VJdGVtKSA9PiB7XG4vLyAgICAgICAgICAgICAgICAgICAgIGVuY3J5cHRDbGVhclRleHQob3BlbnBncCkoc3RvcmFnZUl0ZW0pKGNvbnRlbnQpXG4vLyAgICAgICAgICAgICAgICAgICAgIC50aGVuKChlbmNyeXB0ZWQpID0+IHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVuY3J5cHRlZClcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBlbmNyeXB0ZWQ7XG4vLyAgICAgICAgICAgICAgICAgICAgIH0pXG4vLyAgICAgICAgICAgICAgICAgfSlcbi8vICAgICAgICAgICAgIH0pXG4vLyAgICAgICAgIH1cbi8vICAgICB9XG4vLyB9XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWNyeXB0UEdQTWVzc2FnZVdpdGhLZXkoUEdQTWVzc2FnZUFybW9yKSB7XG4gICAgLy8gIHVzYWdlOiBkZWNyeXB0UEdQTWVzc2FnZVdpdGhLZXkoY29udGVudCkob3BlbnBncCkocHJpdmF0ZUtleUFybW9yKShwYXNzd29yZCkudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgIHJldHVybiAoIVBHUE1lc3NhZ2VBcm1vcikgP1xuICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBQR1BNZXNzYWdlJyk6XG4gICAgKG9wZW5wZ3ApID0+IHtcbiAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgICAgICAocHJpdmF0ZUtleUFybW9yKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCFwcml2YXRlS2V5QXJtb3IpID9cbiAgICAgICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBwcml2YXRlS2V5QXJtb3InKTpcbiAgICAgICAgICAgIChwYXNzd29yZCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAoIXBhc3N3b3JkKSA/XG4gICAgICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIHBhc3N3b3JkJyk6XG4gICAgICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHByaXZhdGVLZXlzID0gb3BlbnBncC5rZXkucmVhZEFybW9yZWQocHJpdmF0ZUtleUFybW9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHByaXZhdGVLZXkgPSBwcml2YXRlS2V5cy5rZXlzWzBdXG4gICAgICAgICAgICAgICAgICAgICAgICBwcml2YXRlS2V5LmRlY3J5cHQocGFzc3dvcmQpXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbWVzc2FnZSA9IG9wZW5wZ3AubWVzc2FnZS5yZWFkQXJtb3JlZChQR1BNZXNzYWdlQXJtb3IpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCFvcGVucGdwLmRlY3J5cHQpID9cbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5wZ3AuZGVjcnlwdE1lc3NhZ2UocHJpdmF0ZUtleSwgbWVzc2FnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICk6XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVucGdwLmRlY3J5cHQoeyAnbWVzc2FnZSc6IG1lc3NhZ2UsICdwcml2YXRlS2V5JzogcHJpdmF0ZUtleSB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdC5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9yZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWNyeXB0UEdQTWVzc2FnZShQR1BNZXNzYWdlQXJtb3IpIHtcbiAgICAvLyAgdXNhZ2U6IGRlY3J5cHRQR1BNZXNzYWdlKGNvbnRlbnQpKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSkocGFzc3dvcmQpLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbiAgICByZXR1cm4gKCFQR1BNZXNzYWdlQXJtb3IpID9cbiAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgUEdQTWVzc2FnZScpOlxuICAgIChvcGVucGdwKSA9PiB7XG4gICAgICAgIHJldHVybiAoIW9wZW5wZ3ApID9cbiAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIG9wZW5wZ3AnKTpcbiAgICAgICAgKGxvY2FsU3RvcmFnZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICghbG9jYWxTdG9yYWdlKSA/XG4gICAgICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgbG9jYWxTdG9yYWdlJyk6XG4gICAgICAgICAgICAocGFzc3dvcmQpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKCFwYXNzd29yZCkgP1xuICAgICAgICAgICAgICAgIFByb21pc2UucmVqZWN0KFwiRXJyb3I6IG1pc3NpbmcgcGFzc3dvcmRcIik6XG4gICAgICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBnZXRGcm9tU3RvcmFnZShsb2NhbFN0b3JhZ2UpKCkudGhlbihzdG9yZUFyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdG9yZUFyclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoc3RvcmFnZUl0ZW0gPT4gKCFzdG9yYWdlSXRlbSkgPyBmYWxzZSA6IHRydWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChzdG9yYWdlSXRlbSA9PiBkZXRlcm1pbmVDb250ZW50VHlwZShzdG9yYWdlSXRlbSkob3BlbnBncClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oY29udGVudFR5cGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRlbnRUeXBlID09PSBQR1BQUklWS0VZKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVjcnlwdFBHUE1lc3NhZ2VXaXRoS2V5KFBHUE1lc3NhZ2VBcm1vcikob3BlbnBncCkoc3RvcmFnZUl0ZW0pKCdob3RsaXBzJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihkZWNyeXB0ZWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRlY3J5cHRlZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIGV4cG9ydCBmdW5jdGlvbiBicm9hZGNhc3QoY29udGVudCkge1xuLy8gICAgIGNvbnN0IG5vdFBHUFByaXZrZXkgPSByZXF1aXJlKCcuL25vdFBHUFByaXZrZXkuanMnKTtcbi8vICAgICAvLyBpbXBvcnQgbm90Q2xlYXJ0ZXh0IGZyb20gJy4vbm90Q2xlYXJ0ZXh0LmpzJztcbi8vICAgICAvLyBpbXBvcnQgbm90RW1wdHkgZnJvbSAnLi9ub3RFbXB0eS5qcyc7XG4vLyAgICAgbm90UEdQUHJpdmtleShjb250ZW50KTtcbi8vICAgICAvLyBub3RDbGVhcnRleHQoY29udGVudCk7XG4vLyAgICAgLy8gbm90RW1wdHkoY29udGVudCk7XG4vL1xuLy8gICAgIGd1bi5nZXQoJ3JveWFsZScpLnB1dCh7XG4vLyAgICAgICAgICAgbmFtZTogXCJMQVRFU1RcIixcbi8vICAgICAgICAgICBlbWFpbDogY29udGVudFxuLy8gICAgICAgICB9KTtcbi8vXG4vLyB9XG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVQb3N0KGNvbnRlbnQpIHtcbiAgICAvL2NvbnNvbGUubG9nKGBoYW5kbGVQb3N0IDwtICR7Y29udGVudH1gKTtcbiAgICByZXR1cm4gKCFjb250ZW50KSA/XG4gICAgUHJvbWlzZS5yZXNvbHZlKCcnKSA6XG4gICAgKG9wZW5wZ3ApID0+IHtcbiAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgICAgICAobG9jYWxTdG9yYWdlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKHBhc3N3b3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZGV0ZXJtaW5lQ29udGVudFR5cGUoY29udGVudCkob3BlbnBncClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oY29udGVudFR5cGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRlbnRUeXBlID09PSBDTEVBUlRFWFQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2VuY3J5cHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZW5jcnlwdGVkQXJyID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RnJvbVN0b3JhZ2UobG9jYWxTdG9yYWdlKSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oc3RvcmFnZUFyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaSA9IHN0b3JhZ2VBcnIubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmFnZUFyclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgoc3RvcmFnZUl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0b3JhZ2VJdGVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoKHN0b3JhZ2VJdGVtKSA9PiBzdG9yYWdlSXRlbSAhPT0gbnVsbCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKChzdG9yYWdlSXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkZXRlcm1pbmVDb250ZW50VHlwZShzdG9yYWdlSXRlbSkob3BlbnBncClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCByZXN1bHQgPT09IFBHUFBVQktFWSApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgoc3RvcmFnZUl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmNyeXB0Q2xlYXJUZXh0KG9wZW5wZ3ApKHN0b3JhZ2VJdGVtKShjb250ZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChlbmNyeXB0ZWQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5jcnlwdGVkQXJyLnB1c2goZW5jcnlwdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBpID09IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGVuY3J5cHRlZEFycik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoZW5jcnlwdGVkQXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuY3J5cHRlZEFyci5tYXAoKGVuY3J5cHRlZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZW5jcnlwdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdicm9hZGNhc3QgaGVyZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50VHlwZSA9PT0gUEdQUFJJVktFWSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNhdmUgYW5kIGJyb2FkY2FzdCBjb252ZXJ0ZWQgcHVibGljIGtleVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzYXZlUEdQUHJpdmtleShjb250ZW50KShvcGVucGdwKShsb2NhbFN0b3JhZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9yZXR1cm4gYnJvYWRjYXN0TWVzc2FnZShjb250ZW50KShvcGVucGdwKShsb2NhbFN0b3JhZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50VHlwZSA9PT0gUEdQUFVCS0VZKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2F2ZSB0byBsb2NhbFN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2F2ZVBHUFB1YmtleShjb250ZW50KShvcGVucGdwKShsb2NhbFN0b3JhZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50VHlwZSA9PT0gUEdQTUVTU0FHRSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdldCBQR1BLZXlzLCBkZWNyeXB0LCAgYW5kIHJldHVyblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWNyeXB0UEdQTWVzc2FnZShjb250ZW50KShvcGVucGdwKShsb2NhbFN0b3JhZ2UpKHBhc3N3b3JkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiByZWplY3QoZXJyKSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xpYi91dGlsLmpzIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vcHJvY2Vzcy9icm93c2VyLmpzIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IExlb24gUmV2aWxsIG9uIDE1LzEyLzIwMTUuXG4gKiBCbG9nOiBibG9nLnJldmlsbHdlYi5jb21cbiAqIEdpdEh1YjogaHR0cHM6Ly9naXRodWIuY29tL1JldmlsbFdlYlxuICogVHdpdHRlcjogQFJldmlsbFdlYlxuICovXG5cbi8qKlxuICogVGhlIG1haW4gcm91dGVyIGNsYXNzIGFuZCBlbnRyeSBwb2ludCB0byB0aGUgcm91dGVyLlxuICovXG5leHBvcnQgY2xhc3MgUmViZWxSb3V0ZXIgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cbiAgICAvKipcbiAgICAgKiBNYWluIGluaXRpYWxpc2F0aW9uIHBvaW50IG9mIHJlYmVsLXJvdXRlclxuICAgICAqIEBwYXJhbSBwcmVmaXggLSBJZiBleHRlbmRpbmcgcmViZWwtcm91dGVyIHlvdSBjYW4gc3BlY2lmeSBhIHByZWZpeCB3aGVuIGNhbGxpbmcgY3JlYXRlZENhbGxiYWNrIGluIGNhc2UgeW91ciBlbGVtZW50cyBuZWVkIHRvIGJlIG5hbWVkIGRpZmZlcmVudGx5XG4gICAgICovXG4gICAgY3JlYXRlZENhbGxiYWNrKHByZWZpeCkge1xuXG4gICAgICAgIGNvbnN0IF9wcmVmaXggPSBwcmVmaXggfHwgXCJyZWJlbFwiO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5wcmV2aW91c1BhdGggPSBudWxsO1xuICAgICAgICB0aGlzLmJhc2VQYXRoID0gbnVsbDtcblxuICAgICAgICAvL0dldCBvcHRpb25zXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgICAgICAgIFwiYW5pbWF0aW9uXCI6ICh0aGlzLmdldEF0dHJpYnV0ZShcImFuaW1hdGlvblwiKSA9PSBcInRydWVcIiksXG4gICAgICAgICAgICBcInNoYWRvd1Jvb3RcIjogKHRoaXMuZ2V0QXR0cmlidXRlKFwic2hhZG93XCIpID09IFwidHJ1ZVwiKSxcbiAgICAgICAgICAgIFwiaW5oZXJpdFwiOiAodGhpcy5nZXRBdHRyaWJ1dGUoXCJpbmhlcml0XCIpICE9IFwiZmFsc2VcIilcbiAgICAgICAgfTtcblxuICAgICAgICAvL0dldCByb3V0ZXNcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5pbmhlcml0ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAvL0lmIHRoaXMgaXMgYSBuZXN0ZWQgcm91dGVyIHRoZW4gd2UgbmVlZCB0byBnbyBhbmQgZ2V0IHRoZSBwYXJlbnQgcGF0aFxuICAgICAgICAgICAgbGV0ICRlbGVtZW50ID0gdGhpcztcbiAgICAgICAgICAgIHdoaWxlICgkZWxlbWVudC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgJGVsZW1lbnQgPSAkZWxlbWVudC5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIGlmICgkZWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09IF9wcmVmaXggKyBcIi1yb3V0ZXJcIikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50ID0gJGVsZW1lbnQuY3VycmVudCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJhc2VQYXRoID0gY3VycmVudC5yb3V0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucm91dGVzID0ge307XG4gICAgICAgIGNvbnN0ICRjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCAkY2hpbGQgPSAkY2hpbGRyZW5baV07XG4gICAgICAgICAgICBsZXQgcGF0aCA9ICRjaGlsZC5nZXRBdHRyaWJ1dGUoXCJwYXRoXCIpO1xuICAgICAgICAgICAgc3dpdGNoICgkY2hpbGQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgX3ByZWZpeCArIFwiLWRlZmF1bHRcIjpcbiAgICAgICAgICAgICAgICAgICAgcGF0aCA9IFwiKlwiO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIF9wcmVmaXggKyBcIi1yb3V0ZVwiOlxuICAgICAgICAgICAgICAgICAgICBwYXRoID0gKHRoaXMuYmFzZVBhdGggIT09IG51bGwpID8gdGhpcy5iYXNlUGF0aCArIHBhdGggOiBwYXRoO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXRoICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbGV0ICR0ZW1wbGF0ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKCRjaGlsZC5pbm5lckhUTUwpIHtcbiAgICAgICAgICAgICAgICAgICAgJHRlbXBsYXRlID0gXCI8XCIgKyBfcHJlZml4ICsgXCItcm91dGU+XCIgKyAkY2hpbGQuaW5uZXJIVE1MICsgXCI8L1wiICsgX3ByZWZpeCArIFwiLXJvdXRlPlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlc1twYXRoXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJjb21wb25lbnRcIjogJGNoaWxkLmdldEF0dHJpYnV0ZShcImNvbXBvbmVudFwiKSxcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiAkdGVtcGxhdGVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9BZnRlciB3ZSBoYXZlIGNvbGxlY3RlZCBhbGwgY29uZmlndXJhdGlvbiBjbGVhciBpbm5lckhUTUxcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hhZG93Um9vdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVTaGFkb3dSb290KCk7XG4gICAgICAgICAgICB0aGlzLnJvb3QgPSB0aGlzLnNoYWRvd1Jvb3Q7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJvb3QgPSB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYW5pbWF0aW9uID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLmluaXRBbmltYXRpb24oKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICBSZWJlbFJvdXRlci5wYXRoQ2hhbmdlKChpc0JhY2spID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYW5pbWF0aW9uID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzQmFjayA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoXCJyYmwtYmFja1wiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoXCJyYmwtYmFja1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZ1bmN0aW9uIHVzZWQgdG8gaW5pdGlhbGlzZSB0aGUgYW5pbWF0aW9uIG1lY2hhbmljcyBpZiBhbmltYXRpb24gaXMgdHVybmVkIG9uXG4gICAgICovXG4gICAgaW5pdEFuaW1hdGlvbigpIHtcbiAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG4gICAgICAgICAgICBsZXQgbm9kZSA9IG11dGF0aW9uc1swXS5hZGRlZE5vZGVzWzBdO1xuICAgICAgICAgICAgaWYgKG5vZGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG90aGVyQ2hpbGRyZW4gPSB0aGlzLmdldE90aGVyQ2hpbGRyZW4obm9kZSk7XG4gICAgICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QuYWRkKFwicmViZWwtYW5pbWF0ZVwiKTtcbiAgICAgICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5hZGQoXCJlbnRlclwiKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG90aGVyQ2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJDaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLmNsYXNzTGlzdC5hZGQoXCJleGl0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZC5jbGFzc0xpc3QuYWRkKFwiY29tcGxldGVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5hZGQoXCJjb21wbGV0ZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgICAgICAgICBjb25zdCBhbmltYXRpb25FbmQgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5jbGFzc05hbWUuaW5kZXhPZihcImV4aXRcIikgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yb290LnJlbW92ZUNoaWxkKGV2ZW50LnRhcmdldCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihcInRyYW5zaXRpb25lbmRcIiwgYW5pbWF0aW9uRW5kKTtcbiAgICAgICAgICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgYW5pbWF0aW9uRW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUodGhpcywge2NoaWxkTGlzdDogdHJ1ZX0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1ldGhvZCB1c2VkIHRvIGdldCB0aGUgY3VycmVudCByb3V0ZSBvYmplY3RcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBjdXJyZW50KCkge1xuICAgICAgICBjb25zdCBwYXRoID0gUmViZWxSb3V0ZXIuZ2V0UGF0aEZyb21VcmwoKTtcbiAgICAgICAgZm9yIChjb25zdCByb3V0ZSBpbiB0aGlzLnJvdXRlcykge1xuICAgICAgICAgICAgaWYgKHJvdXRlICE9PSBcIipcIikge1xuICAgICAgICAgICAgICAgIGxldCByZWdleFN0cmluZyA9IFwiXlwiICsgcm91dGUucmVwbGFjZSgve1xcdyt9XFwvPy9nLCBcIihcXFxcdyspXFwvP1wiKTtcbiAgICAgICAgICAgICAgICByZWdleFN0cmluZyArPSAocmVnZXhTdHJpbmcuaW5kZXhPZihcIlxcXFwvP1wiKSA+IC0xKSA/IFwiXCIgOiBcIlxcXFwvP1wiICsgXCIoWz89Ji1cXC9cXFxcdytdKyk/JFwiO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChyZWdleFN0cmluZyk7XG4gICAgICAgICAgICAgICAgaWYgKHJlZ2V4LnRlc3QocGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9yb3V0ZVJlc3VsdCh0aGlzLnJvdXRlc1tyb3V0ZV0sIHJvdXRlLCByZWdleCwgcGF0aCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAodGhpcy5yb3V0ZXNbXCIqXCJdICE9PSB1bmRlZmluZWQpID8gX3JvdXRlUmVzdWx0KHRoaXMucm91dGVzW1wiKlwiXSwgXCIqXCIsIG51bGwsIHBhdGgpIDogbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNZXRob2QgY2FsbGVkIHRvIHJlbmRlciB0aGUgY3VycmVudCB2aWV3XG4gICAgICovXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmN1cnJlbnQoKTtcbiAgICAgICAgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5wYXRoICE9PSB0aGlzLnByZXZpb3VzUGF0aCB8fCB0aGlzLm9wdGlvbnMuYW5pbWF0aW9uID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hbmltYXRpb24gIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb290LmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuY29tcG9uZW50ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCAkY29tcG9uZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChyZXN1bHQuY29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIHJlc3VsdC5wYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHJlc3VsdC5wYXJhbXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gXCJPYmplY3RcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gSlNPTi5wYXJzZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ291bGRuJ3QgcGFyc2UgcGFyYW0gdmFsdWU6XCIsIGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICRjb21wb25lbnQuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm9vdC5hcHBlbmRDaGlsZCgkY29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgJHRlbXBsYXRlID0gcmVzdWx0LnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICAvL1RPRE86IEZpbmQgYSBmYXN0ZXIgYWx0ZXJuYXRpdmVcbiAgICAgICAgICAgICAgICAgICAgaWYgKCR0ZW1wbGF0ZS5pbmRleE9mKFwiJHtcIikgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHRlbXBsYXRlID0gJHRlbXBsYXRlLnJlcGxhY2UoL1xcJHsoW157fV0qKX0vZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgciA9IHJlc3VsdC5wYXJhbXNbYl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YgciA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHIgPT09ICdudW1iZXInID8gciA6IGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvb3QuaW5uZXJIVE1MID0gJHRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnByZXZpb3VzUGF0aCA9IHJlc3VsdC5wYXRoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBub2RlIC0gVXNlZCB3aXRoIHRoZSBhbmltYXRpb24gbWVjaGFuaWNzIHRvIGdldCBhbGwgb3RoZXIgdmlldyBjaGlsZHJlbiBleGNlcHQgaXRzZWxmXG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqL1xuICAgIGdldE90aGVyQ2hpbGRyZW4obm9kZSkge1xuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IHRoaXMucm9vdC5jaGlsZHJlbjtcbiAgICAgICAgbGV0IHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgICAgICAgICBpZiAoY2hpbGQgIT0gbm9kZSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChjaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogU3RhdGljIGhlbHBlciBtZXRob2QgdG8gcGFyc2UgdGhlIHF1ZXJ5IHN0cmluZyBmcm9tIGEgdXJsIGludG8gYW4gb2JqZWN0LlxuICAgICAqIEBwYXJhbSB1cmxcbiAgICAgKiBAcmV0dXJucyB7e319XG4gICAgICovXG4gICAgc3RhdGljIHBhcnNlUXVlcnlTdHJpbmcodXJsKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgICAgaWYgKHVybCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB2YXIgcXVlcnlTdHJpbmcgPSAodXJsLmluZGV4T2YoXCI/XCIpID4gLTEpID8gdXJsLnN1YnN0cih1cmwuaW5kZXhPZihcIj9cIikgKyAxLCB1cmwubGVuZ3RoKSA6IG51bGw7XG4gICAgICAgICAgICBpZiAocXVlcnlTdHJpbmcgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBxdWVyeVN0cmluZy5zcGxpdChcIiZcIikuZm9yRWFjaChmdW5jdGlvbiAocGFydCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXBhcnQpIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgcGFydCA9IHBhcnQucmVwbGFjZShcIitcIiwgXCIgXCIpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXEgPSBwYXJ0LmluZGV4T2YoXCI9XCIpO1xuICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gZXEgPiAtMSA/IHBhcnQuc3Vic3RyKDAsIGVxKSA6IHBhcnQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWwgPSBlcSA+IC0xID8gZGVjb2RlVVJJQ29tcG9uZW50KHBhcnQuc3Vic3RyKGVxICsgMSkpIDogXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZyb20gPSBrZXkuaW5kZXhPZihcIltcIik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmcm9tID09IC0xKSByZXN1bHRbZGVjb2RlVVJJQ29tcG9uZW50KGtleSldID0gdmFsO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0byA9IGtleS5pbmRleE9mKFwiXVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IGRlY29kZVVSSUNvbXBvbmVudChrZXkuc3Vic3RyaW5nKGZyb20gKyAxLCB0bykpO1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5ID0gZGVjb2RlVVJJQ29tcG9uZW50KGtleS5zdWJzdHJpbmcoMCwgZnJvbSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXN1bHRba2V5XSkgcmVzdWx0W2tleV0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaW5kZXgpIHJlc3VsdFtrZXldLnB1c2godmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgcmVzdWx0W2tleV1baW5kZXhdID0gdmFsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdGF0aWMgaGVscGVyIG1ldGhvZCB0byBjb252ZXJ0IGEgY2xhc3MgbmFtZSB0byBhIHZhbGlkIGVsZW1lbnQgbmFtZS5cbiAgICAgKiBAcGFyYW0gQ2xhc3NcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIHN0YXRpYyBjbGFzc1RvVGFnKENsYXNzKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDbGFzcy5uYW1lIHdvdWxkIGJlIGJldHRlciBidXQgdGhpcyBpc24ndCBzdXBwb3J0ZWQgaW4gSUUgMTEuXG4gICAgICAgICAqL1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIG5hbWUgPSBDbGFzcy50b1N0cmluZygpLm1hdGNoKC9eZnVuY3Rpb25cXHMqKFteXFxzKF0rKS8pWzFdLnJlcGxhY2UoL1xcVysvZywgJy0nKS5yZXBsYWNlKC8oW2EtelxcZF0pKFtBLVowLTldKS9nLCAnJDEtJDInKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBwYXJzZSBjbGFzcyBuYW1lOlwiLCBlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoUmViZWxSb3V0ZXIudmFsaWRFbGVtZW50VGFnKG5hbWUpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2xhc3MgbmFtZSBjb3VsZG4ndCBiZSB0cmFuc2xhdGVkIHRvIHRhZy5cIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RhdGljIGhlbHBlciBtZXRob2QgdXNlZCB0byBkZXRlcm1pbmUgaWYgYW4gZWxlbWVudCB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZSBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQuXG4gICAgICogQHBhcmFtIG5hbWVcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBzdGF0aWMgaXNSZWdpc3RlcmVkRWxlbWVudChuYW1lKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5hbWUpLmNvbnN0cnVjdG9yICE9PSBIVE1MRWxlbWVudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdGF0aWMgaGVscGVyIG1ldGhvZCB0byB0YWtlIGEgd2ViIGNvbXBvbmVudCBjbGFzcywgY3JlYXRlIGFuIGVsZW1lbnQgbmFtZSBhbmQgcmVnaXN0ZXIgdGhlIG5ldyBlbGVtZW50IG9uIHRoZSBkb2N1bWVudC5cbiAgICAgKiBAcGFyYW0gQ2xhc3NcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIHN0YXRpYyBjcmVhdGVFbGVtZW50KENsYXNzKSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBSZWJlbFJvdXRlci5jbGFzc1RvVGFnKENsYXNzKTtcbiAgICAgICAgaWYgKFJlYmVsUm91dGVyLmlzUmVnaXN0ZXJlZEVsZW1lbnQobmFtZSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBDbGFzcy5wcm90b3R5cGUubmFtZSA9IG5hbWU7XG4gICAgICAgICAgICBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQobmFtZSwgQ2xhc3MpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuYW1lO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNpbXBsZSBzdGF0aWMgaGVscGVyIG1ldGhvZCBjb250YWluaW5nIGEgcmVndWxhciBleHByZXNzaW9uIHRvIHZhbGlkYXRlIGFuIGVsZW1lbnQgbmFtZVxuICAgICAqIEBwYXJhbSB0YWdcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBzdGF0aWMgdmFsaWRFbGVtZW50VGFnKHRhZykge1xuICAgICAgICByZXR1cm4gL15bYS16MC05XFwtXSskLy50ZXN0KHRhZyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWV0aG9kIHVzZWQgdG8gcmVnaXN0ZXIgYSBjYWxsYmFjayB0byBiZSBjYWxsZWQgd2hlbiB0aGUgVVJMIHBhdGggY2hhbmdlcy5cbiAgICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICAgKi9cbiAgICBzdGF0aWMgcGF0aENoYW5nZShjYWxsYmFjaykge1xuICAgICAgICBpZiAoUmViZWxSb3V0ZXIuY2hhbmdlQ2FsbGJhY2tzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIFJlYmVsUm91dGVyLmNoYW5nZUNhbGxiYWNrcyA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIFJlYmVsUm91dGVyLmNoYW5nZUNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgY29uc3QgY2hhbmdlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogIGV2ZW50Lm9sZFVSTCBhbmQgZXZlbnQubmV3VVJMIHdvdWxkIGJlIGJldHRlciBoZXJlIGJ1dCB0aGlzIGRvZXNuJ3Qgd29yayBpbiBJRSA6KFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhyZWYgIT0gUmViZWxSb3V0ZXIub2xkVVJMKSB7XG4gICAgICAgICAgICAgICAgUmViZWxSb3V0ZXIuY2hhbmdlQ2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24oY2FsbGJhY2spe1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhSZWJlbFJvdXRlci5pc0JhY2spO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFJlYmVsUm91dGVyLmlzQmFjayA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgUmViZWxSb3V0ZXIub2xkVVJMID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgICAgIH07XG4gICAgICAgIGlmICh3aW5kb3cub25oYXNoY2hhbmdlID09PSBudWxsKSB7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJibGJhY2tcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBSZWJlbFJvdXRlci5pc0JhY2sgPSB0cnVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgd2luZG93Lm9uaGFzaGNoYW5nZSA9IGNoYW5nZUhhbmRsZXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RhdGljIGhlbHBlciBtZXRob2QgdXNlZCB0byBnZXQgdGhlIHBhcmFtZXRlcnMgZnJvbSB0aGUgcHJvdmlkZWQgcm91dGUuXG4gICAgICogQHBhcmFtIHJlZ2V4XG4gICAgICogQHBhcmFtIHJvdXRlXG4gICAgICogQHBhcmFtIHBhdGhcbiAgICAgKiBAcmV0dXJucyB7e319XG4gICAgICovXG4gICAgc3RhdGljIGdldFBhcmFtc0Zyb21VcmwocmVnZXgsIHJvdXRlLCBwYXRoKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBSZWJlbFJvdXRlci5wYXJzZVF1ZXJ5U3RyaW5nKHBhdGgpO1xuICAgICAgICB2YXIgcmUgPSAveyhcXHcrKX0vZztcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgbGV0IG1hdGNoO1xuICAgICAgICB3aGlsZSAobWF0Y2ggPSByZS5leGVjKHJvdXRlKSkge1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKG1hdGNoWzFdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVnZXggIT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHRzMiA9IHJlZ2V4LmV4ZWMocGF0aCk7XG4gICAgICAgICAgICByZXN1bHRzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGlkeCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtpdGVtXSA9IHJlc3VsdHMyW2lkeCArIDFdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdGF0aWMgaGVscGVyIG1ldGhvZCB1c2VkIHRvIGdldCB0aGUgcGF0aCBmcm9tIHRoZSBjdXJyZW50IFVSTC5cbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0UGF0aEZyb21VcmwoKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5tYXRjaCgvIyguKikkLyk7XG4gICAgICAgIGlmIChyZXN1bHQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRbMV07XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcInJlYmVsLXJvdXRlclwiLCBSZWJlbFJvdXRlcik7XG5cbi8qKlxuICogQ2xhc3Mgd2hpY2ggcmVwcmVzZW50cyB0aGUgcmViZWwtcm91dGUgY3VzdG9tIGVsZW1lbnRcbiAqL1xuZXhwb3J0IGNsYXNzIFJlYmVsUm91dGUgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cbn1cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcInJlYmVsLXJvdXRlXCIsIFJlYmVsUm91dGUpO1xuXG4vKipcbiAqIENsYXNzIHdoaWNoIHJlcHJlc2VudHMgdGhlIHJlYmVsLWRlZmF1bHQgY3VzdG9tIGVsZW1lbnRcbiAqL1xuY2xhc3MgUmViZWxEZWZhdWx0IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJyZWJlbC1kZWZhdWx0XCIsIFJlYmVsRGVmYXVsdCk7XG5cblxuLyoqXG4gKiBSZXByZXNlbnRzIHRoZSBwcm90b3R5cGUgZm9yIGFuIGFuY2hvciBlbGVtZW50IHdoaWNoIGFkZGVkIGZ1bmN0aW9uYWxpdHkgdG8gcGVyZm9ybSBhIGJhY2sgdHJhbnNpdGlvbi5cbiAqL1xuY2xhc3MgUmViZWxCYWNrQSBleHRlbmRzIEhUTUxBbmNob3JFbGVtZW50IHtcbiAgICBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmdldEF0dHJpYnV0ZShcImhyZWZcIik7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgaWYgKHBhdGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncmJsYmFjaycpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gcGF0aDtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuLyoqXG4gKiBSZWdpc3RlciB0aGUgYmFjayBidXR0b24gY3VzdG9tIGVsZW1lbnRcbiAqL1xuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwicmViZWwtYmFjay1hXCIsIHtcbiAgICBleHRlbmRzOiBcImFcIixcbiAgICBwcm90b3R5cGU6IFJlYmVsQmFja0EucHJvdG90eXBlXG59KTtcblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGEgcm91dGUgb2JqZWN0XG4gKiBAcGFyYW0gb2JqIC0gdGhlIGNvbXBvbmVudCBuYW1lIG9yIHRoZSBIVE1MIHRlbXBsYXRlXG4gKiBAcGFyYW0gcm91dGVcbiAqIEBwYXJhbSByZWdleFxuICogQHBhcmFtIHBhdGhcbiAqIEByZXR1cm5zIHt7fX1cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIF9yb3V0ZVJlc3VsdChvYmosIHJvdXRlLCByZWdleCwgcGF0aCkge1xuICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBvYmpba2V5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQucm91dGUgPSByb3V0ZTtcbiAgICByZXN1bHQucGF0aCA9IHBhdGg7XG4gICAgcmVzdWx0LnBhcmFtcyA9IFJlYmVsUm91dGVyLmdldFBhcmFtc0Zyb21VcmwocmVnZXgsIHJvdXRlLCBwYXRoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vcmViZWwtcm91dGVyL3NyYy9yZWJlbC1yb3V0ZXIuanMiLCI7KGZ1bmN0aW9uKCl7XHJcblxyXG5cdC8qIFVOQlVJTEQgKi9cclxuXHR2YXIgcm9vdDtcclxuXHRpZih0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKXsgcm9vdCA9IHdpbmRvdyB9XHJcblx0aWYodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIil7IHJvb3QgPSBnbG9iYWwgfVxyXG5cdHJvb3QgPSByb290IHx8IHt9O1xyXG5cdHZhciBjb25zb2xlID0gcm9vdC5jb25zb2xlIHx8IHtsb2c6IGZ1bmN0aW9uKCl7fX07XHJcblx0ZnVuY3Rpb24gcmVxdWlyZShhcmcpe1xyXG5cdFx0cmV0dXJuIGFyZy5zbGljZT8gcmVxdWlyZVtyZXNvbHZlKGFyZyldIDogZnVuY3Rpb24obW9kLCBwYXRoKXtcclxuXHRcdFx0YXJnKG1vZCA9IHtleHBvcnRzOiB7fX0pO1xyXG5cdFx0XHRyZXF1aXJlW3Jlc29sdmUocGF0aCldID0gbW9kLmV4cG9ydHM7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiByZXNvbHZlKHBhdGgpe1xyXG5cdFx0XHRyZXR1cm4gcGF0aC5zcGxpdCgnLycpLnNsaWNlKC0xKS50b1N0cmluZygpLnJlcGxhY2UoJy5qcycsJycpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRpZih0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiKXsgdmFyIGNvbW1vbiA9IG1vZHVsZSB9XHJcblx0LyogVU5CVUlMRCAqL1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0Ly8gR2VuZXJpYyBqYXZhc2NyaXB0IHV0aWxpdGllcy5cclxuXHRcdHZhciBUeXBlID0ge307XHJcblx0XHQvL1R5cGUuZm5zID0gVHlwZS5mbiA9IHtpczogZnVuY3Rpb24oZm4peyByZXR1cm4gKCEhZm4gJiYgZm4gaW5zdGFuY2VvZiBGdW5jdGlvbikgfX1cclxuXHRcdFR5cGUuZm5zID0gVHlwZS5mbiA9IHtpczogZnVuY3Rpb24oZm4peyByZXR1cm4gKCEhZm4gJiYgJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZm4pIH19XHJcblx0XHRUeXBlLmJpID0ge2lzOiBmdW5jdGlvbihiKXsgcmV0dXJuIChiIGluc3RhbmNlb2YgQm9vbGVhbiB8fCB0eXBlb2YgYiA9PSAnYm9vbGVhbicpIH19XHJcblx0XHRUeXBlLm51bSA9IHtpczogZnVuY3Rpb24obil7IHJldHVybiAhbGlzdF9pcyhuKSAmJiAoKG4gLSBwYXJzZUZsb2F0KG4pICsgMSkgPj0gMCB8fCBJbmZpbml0eSA9PT0gbiB8fCAtSW5maW5pdHkgPT09IG4pIH19XHJcblx0XHRUeXBlLnRleHQgPSB7aXM6IGZ1bmN0aW9uKHQpeyByZXR1cm4gKHR5cGVvZiB0ID09ICdzdHJpbmcnKSB9fVxyXG5cdFx0VHlwZS50ZXh0LmlmeSA9IGZ1bmN0aW9uKHQpe1xyXG5cdFx0XHRpZihUeXBlLnRleHQuaXModCkpeyByZXR1cm4gdCB9XHJcblx0XHRcdGlmKHR5cGVvZiBKU09OICE9PSBcInVuZGVmaW5lZFwiKXsgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHQpIH1cclxuXHRcdFx0cmV0dXJuICh0ICYmIHQudG9TdHJpbmcpPyB0LnRvU3RyaW5nKCkgOiB0O1xyXG5cdFx0fVxyXG5cdFx0VHlwZS50ZXh0LnJhbmRvbSA9IGZ1bmN0aW9uKGwsIGMpe1xyXG5cdFx0XHR2YXIgcyA9ICcnO1xyXG5cdFx0XHRsID0gbCB8fCAyNDsgLy8geW91IGFyZSBub3QgZ29pbmcgdG8gbWFrZSBhIDAgbGVuZ3RoIHJhbmRvbSBudW1iZXIsIHNvIG5vIG5lZWQgdG8gY2hlY2sgdHlwZVxyXG5cdFx0XHRjID0gYyB8fCAnMDEyMzQ1Njc4OUFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eic7XHJcblx0XHRcdHdoaWxlKGwgPiAwKXsgcyArPSBjLmNoYXJBdChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjLmxlbmd0aCkpOyBsLS0gfVxyXG5cdFx0XHRyZXR1cm4gcztcclxuXHRcdH1cclxuXHRcdFR5cGUudGV4dC5tYXRjaCA9IGZ1bmN0aW9uKHQsIG8peyB2YXIgciA9IGZhbHNlO1xyXG5cdFx0XHR0ID0gdCB8fCAnJztcclxuXHRcdFx0byA9IFR5cGUudGV4dC5pcyhvKT8geyc9Jzogb30gOiBvIHx8IHt9OyAvLyB7J34nLCAnPScsICcqJywgJzwnLCAnPicsICcrJywgJy0nLCAnPycsICchJ30gLy8gaWdub3JlIGNhc2UsIGV4YWN0bHkgZXF1YWwsIGFueXRoaW5nIGFmdGVyLCBsZXhpY2FsbHkgbGFyZ2VyLCBsZXhpY2FsbHkgbGVzc2VyLCBhZGRlZCBpbiwgc3VidGFjdGVkIGZyb20sIHF1ZXN0aW9uYWJsZSBmdXp6eSBtYXRjaCwgYW5kIGVuZHMgd2l0aC5cclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJ34nKSl7IHQgPSB0LnRvTG93ZXJDYXNlKCk7IG9bJz0nXSA9IChvWyc9J10gfHwgb1snfiddKS50b0xvd2VyQ2FzZSgpIH1cclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJz0nKSl7IHJldHVybiB0ID09PSBvWyc9J10gfVxyXG5cdFx0XHRpZihUeXBlLm9iai5oYXMobywnKicpKXsgaWYodC5zbGljZSgwLCBvWycqJ10ubGVuZ3RoKSA9PT0gb1snKiddKXsgciA9IHRydWU7IHQgPSB0LnNsaWNlKG9bJyonXS5sZW5ndGgpIH0gZWxzZSB7IHJldHVybiBmYWxzZSB9fVxyXG5cdFx0XHRpZihUeXBlLm9iai5oYXMobywnIScpKXsgaWYodC5zbGljZSgtb1snISddLmxlbmd0aCkgPT09IG9bJyEnXSl7IHIgPSB0cnVlIH0gZWxzZSB7IHJldHVybiBmYWxzZSB9fVxyXG5cdFx0XHRpZihUeXBlLm9iai5oYXMobywnKycpKXtcclxuXHRcdFx0XHRpZihUeXBlLmxpc3QubWFwKFR5cGUubGlzdC5pcyhvWycrJ10pPyBvWycrJ10gOiBbb1snKyddXSwgZnVuY3Rpb24obSl7XHJcblx0XHRcdFx0XHRpZih0LmluZGV4T2YobSkgPj0gMCl7IHIgPSB0cnVlIH0gZWxzZSB7IHJldHVybiB0cnVlIH1cclxuXHRcdFx0XHR9KSl7IHJldHVybiBmYWxzZSB9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJy0nKSl7XHJcblx0XHRcdFx0aWYoVHlwZS5saXN0Lm1hcChUeXBlLmxpc3QuaXMob1snLSddKT8gb1snLSddIDogW29bJy0nXV0sIGZ1bmN0aW9uKG0pe1xyXG5cdFx0XHRcdFx0aWYodC5pbmRleE9mKG0pIDwgMCl7IHIgPSB0cnVlIH0gZWxzZSB7IHJldHVybiB0cnVlIH1cclxuXHRcdFx0XHR9KSl7IHJldHVybiBmYWxzZSB9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJz4nKSl7IGlmKHQgPiBvWyc+J10peyByID0gdHJ1ZSB9IGVsc2UgeyByZXR1cm4gZmFsc2UgfX1cclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJzwnKSl7IGlmKHQgPCBvWyc8J10peyByID0gdHJ1ZSB9IGVsc2UgeyByZXR1cm4gZmFsc2UgfX1cclxuXHRcdFx0ZnVuY3Rpb24gZnV6enkodCxmKXsgdmFyIG4gPSAtMSwgaSA9IDAsIGM7IGZvcig7YyA9IGZbaSsrXTspeyBpZighfihuID0gdC5pbmRleE9mKGMsIG4rMSkpKXsgcmV0dXJuIGZhbHNlIH19IHJldHVybiB0cnVlIH0gLy8gdmlhIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvOTIwNjAxMy9qYXZhc2NyaXB0LWZ1enp5LXNlYXJjaFxyXG5cdFx0XHRpZihUeXBlLm9iai5oYXMobywnPycpKXsgaWYoZnV6enkodCwgb1snPyddKSl7IHIgPSB0cnVlIH0gZWxzZSB7IHJldHVybiBmYWxzZSB9fSAvLyBjaGFuZ2UgbmFtZSFcclxuXHRcdFx0cmV0dXJuIHI7XHJcblx0XHR9XHJcblx0XHRUeXBlLmxpc3QgPSB7aXM6IGZ1bmN0aW9uKGwpeyByZXR1cm4gKGwgaW5zdGFuY2VvZiBBcnJheSkgfX1cclxuXHRcdFR5cGUubGlzdC5zbGl0ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xyXG5cdFx0VHlwZS5saXN0LnNvcnQgPSBmdW5jdGlvbihrKXsgLy8gY3JlYXRlcyBhIG5ldyBzb3J0IGZ1bmN0aW9uIGJhc2VkIG9mZiBzb21lIGZpZWxkXHJcblx0XHRcdHJldHVybiBmdW5jdGlvbihBLEIpe1xyXG5cdFx0XHRcdGlmKCFBIHx8ICFCKXsgcmV0dXJuIDAgfSBBID0gQVtrXTsgQiA9IEJba107XHJcblx0XHRcdFx0aWYoQSA8IEIpeyByZXR1cm4gLTEgfWVsc2UgaWYoQSA+IEIpeyByZXR1cm4gMSB9XHJcblx0XHRcdFx0ZWxzZSB7IHJldHVybiAwIH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0VHlwZS5saXN0Lm1hcCA9IGZ1bmN0aW9uKGwsIGMsIF8peyByZXR1cm4gb2JqX21hcChsLCBjLCBfKSB9XHJcblx0XHRUeXBlLmxpc3QuaW5kZXggPSAxOyAvLyBjaGFuZ2UgdGhpcyB0byAwIGlmIHlvdSB3YW50IG5vbi1sb2dpY2FsLCBub24tbWF0aGVtYXRpY2FsLCBub24tbWF0cml4LCBub24tY29udmVuaWVudCBhcnJheSBub3RhdGlvblxyXG5cdFx0VHlwZS5vYmogPSB7aXM6IGZ1bmN0aW9uKG8peyByZXR1cm4gbz8gKG8gaW5zdGFuY2VvZiBPYmplY3QgJiYgby5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykubWF0Y2goL15cXFtvYmplY3QgKFxcdyspXFxdJC8pWzFdID09PSAnT2JqZWN0JyA6IGZhbHNlIH19XHJcblx0XHRUeXBlLm9iai5wdXQgPSBmdW5jdGlvbihvLCBmLCB2KXsgcmV0dXJuIChvfHx7fSlbZl0gPSB2LCBvIH1cclxuXHRcdFR5cGUub2JqLmhhcyA9IGZ1bmN0aW9uKG8sIGYpeyByZXR1cm4gbyAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgZikgfVxyXG5cdFx0VHlwZS5vYmouZGVsID0gZnVuY3Rpb24obywgayl7XHJcblx0XHRcdGlmKCFvKXsgcmV0dXJuIH1cclxuXHRcdFx0b1trXSA9IG51bGw7XHJcblx0XHRcdGRlbGV0ZSBvW2tdO1xyXG5cdFx0XHRyZXR1cm4gbztcclxuXHRcdH1cclxuXHRcdFR5cGUub2JqLmFzID0gZnVuY3Rpb24obywgZiwgdiwgdSl7IHJldHVybiBvW2ZdID0gb1tmXSB8fCAodSA9PT0gdj8ge30gOiB2KSB9XHJcblx0XHRUeXBlLm9iai5pZnkgPSBmdW5jdGlvbihvKXtcclxuXHRcdFx0aWYob2JqX2lzKG8pKXsgcmV0dXJuIG8gfVxyXG5cdFx0XHR0cnl7byA9IEpTT04ucGFyc2Uobyk7XHJcblx0XHRcdH1jYXRjaChlKXtvPXt9fTtcclxuXHRcdFx0cmV0dXJuIG87XHJcblx0XHR9XHJcblx0XHQ7KGZ1bmN0aW9uKCl7IHZhciB1O1xyXG5cdFx0XHRmdW5jdGlvbiBtYXAodixmKXtcclxuXHRcdFx0XHRpZihvYmpfaGFzKHRoaXMsZikgJiYgdSAhPT0gdGhpc1tmXSl7IHJldHVybiB9XHJcblx0XHRcdFx0dGhpc1tmXSA9IHY7XHJcblx0XHRcdH1cclxuXHRcdFx0VHlwZS5vYmoudG8gPSBmdW5jdGlvbihmcm9tLCB0byl7XHJcblx0XHRcdFx0dG8gPSB0byB8fCB7fTtcclxuXHRcdFx0XHRvYmpfbWFwKGZyb20sIG1hcCwgdG8pO1xyXG5cdFx0XHRcdHJldHVybiB0bztcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdFR5cGUub2JqLmNvcHkgPSBmdW5jdGlvbihvKXsgLy8gYmVjYXVzZSBodHRwOi8vd2ViLmFyY2hpdmUub3JnL3dlYi8yMDE0MDMyODIyNDAyNS9odHRwOi8vanNwZXJmLmNvbS9jbG9uaW5nLWFuLW9iamVjdC8yXHJcblx0XHRcdHJldHVybiAhbz8gbyA6IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobykpOyAvLyBpcyBzaG9ja2luZ2x5IGZhc3RlciB0aGFuIGFueXRoaW5nIGVsc2UsIGFuZCBvdXIgZGF0YSBoYXMgdG8gYmUgYSBzdWJzZXQgb2YgSlNPTiBhbnl3YXlzIVxyXG5cdFx0fVxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRmdW5jdGlvbiBlbXB0eSh2LGkpeyB2YXIgbiA9IHRoaXMubjtcclxuXHRcdFx0XHRpZihuICYmIChpID09PSBuIHx8IChvYmpfaXMobikgJiYgb2JqX2hhcyhuLCBpKSkpKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRpZihpKXsgcmV0dXJuIHRydWUgfVxyXG5cdFx0XHR9XHJcblx0XHRcdFR5cGUub2JqLmVtcHR5ID0gZnVuY3Rpb24obywgbil7XHJcblx0XHRcdFx0aWYoIW8peyByZXR1cm4gdHJ1ZSB9XHJcblx0XHRcdFx0cmV0dXJuIG9ial9tYXAobyxlbXB0eSx7bjpufSk/IGZhbHNlIDogdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0ZnVuY3Rpb24gdChrLHYpe1xyXG5cdFx0XHRcdGlmKDIgPT09IGFyZ3VtZW50cy5sZW5ndGgpe1xyXG5cdFx0XHRcdFx0dC5yID0gdC5yIHx8IHt9O1xyXG5cdFx0XHRcdFx0dC5yW2tdID0gdjtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9IHQuciA9IHQuciB8fCBbXTtcclxuXHRcdFx0XHR0LnIucHVzaChrKTtcclxuXHRcdFx0fTtcclxuXHRcdFx0dmFyIGtleXMgPSBPYmplY3Qua2V5cztcclxuXHRcdFx0VHlwZS5vYmoubWFwID0gZnVuY3Rpb24obCwgYywgXyl7XHJcblx0XHRcdFx0dmFyIHUsIGkgPSAwLCB4LCByLCBsbCwgbGxlLCBmID0gZm5faXMoYyk7XHJcblx0XHRcdFx0dC5yID0gbnVsbDtcclxuXHRcdFx0XHRpZihrZXlzICYmIG9ial9pcyhsKSl7XHJcblx0XHRcdFx0XHRsbCA9IE9iamVjdC5rZXlzKGwpOyBsbGUgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihsaXN0X2lzKGwpIHx8IGxsKXtcclxuXHRcdFx0XHRcdHggPSAobGwgfHwgbCkubGVuZ3RoO1xyXG5cdFx0XHRcdFx0Zm9yKDtpIDwgeDsgaSsrKXtcclxuXHRcdFx0XHRcdFx0dmFyIGlpID0gKGkgKyBUeXBlLmxpc3QuaW5kZXgpO1xyXG5cdFx0XHRcdFx0XHRpZihmKXtcclxuXHRcdFx0XHRcdFx0XHRyID0gbGxlPyBjLmNhbGwoXyB8fCB0aGlzLCBsW2xsW2ldXSwgbGxbaV0sIHQpIDogYy5jYWxsKF8gfHwgdGhpcywgbFtpXSwgaWksIHQpO1xyXG5cdFx0XHRcdFx0XHRcdGlmKHIgIT09IHUpeyByZXR1cm4gciB9XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Ly9pZihUeXBlLnRlc3QuaXMoYyxsW2ldKSl7IHJldHVybiBpaSB9IC8vIHNob3VsZCBpbXBsZW1lbnQgZGVlcCBlcXVhbGl0eSB0ZXN0aW5nIVxyXG5cdFx0XHRcdFx0XHRcdGlmKGMgPT09IGxbbGxlPyBsbFtpXSA6IGldKXsgcmV0dXJuIGxsPyBsbFtpXSA6IGlpIH0gLy8gdXNlIHRoaXMgZm9yIG5vd1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGZvcihpIGluIGwpe1xyXG5cdFx0XHRcdFx0XHRpZihmKXtcclxuXHRcdFx0XHRcdFx0XHRpZihvYmpfaGFzKGwsaSkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0ciA9IF8/IGMuY2FsbChfLCBsW2ldLCBpLCB0KSA6IGMobFtpXSwgaSwgdCk7XHJcblx0XHRcdFx0XHRcdFx0XHRpZihyICE9PSB1KXsgcmV0dXJuIHIgfVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHQvL2lmKGEudGVzdC5pcyhjLGxbaV0pKXsgcmV0dXJuIGkgfSAvLyBzaG91bGQgaW1wbGVtZW50IGRlZXAgZXF1YWxpdHkgdGVzdGluZyFcclxuXHRcdFx0XHRcdFx0XHRpZihjID09PSBsW2ldKXsgcmV0dXJuIGkgfSAvLyB1c2UgdGhpcyBmb3Igbm93XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGY/IHQuciA6IFR5cGUubGlzdC5pbmRleD8gMCA6IC0xO1xyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0VHlwZS50aW1lID0ge307XHJcblx0XHRUeXBlLnRpbWUuaXMgPSBmdW5jdGlvbih0KXsgcmV0dXJuIHQ/IHQgaW5zdGFuY2VvZiBEYXRlIDogKCtuZXcgRGF0ZSgpLmdldFRpbWUoKSkgfVxyXG5cclxuXHRcdHZhciBmbl9pcyA9IFR5cGUuZm4uaXM7XHJcblx0XHR2YXIgbGlzdF9pcyA9IFR5cGUubGlzdC5pcztcclxuXHRcdHZhciBvYmogPSBUeXBlLm9iaiwgb2JqX2lzID0gb2JqLmlzLCBvYmpfaGFzID0gb2JqLmhhcywgb2JqX21hcCA9IG9iai5tYXA7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IFR5cGU7XHJcblx0fSkocmVxdWlyZSwgJy4vdHlwZScpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0Ly8gT24gZXZlbnQgZW1pdHRlciBnZW5lcmljIGphdmFzY3JpcHQgdXRpbGl0eS5cclxuXHRcdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gb250byh0YWcsIGFyZywgYXMpe1xyXG5cdFx0XHRpZighdGFnKXsgcmV0dXJuIHt0bzogb250b30gfVxyXG5cdFx0XHR2YXIgdGFnID0gKHRoaXMudGFnIHx8ICh0aGlzLnRhZyA9IHt9KSlbdGFnXSB8fFxyXG5cdFx0XHQodGhpcy50YWdbdGFnXSA9IHt0YWc6IHRhZywgdG86IG9udG8uXyA9IHtcclxuXHRcdFx0XHRuZXh0OiBmdW5jdGlvbigpe31cclxuXHRcdFx0fX0pO1xyXG5cdFx0XHRpZihhcmcgaW5zdGFuY2VvZiBGdW5jdGlvbil7XHJcblx0XHRcdFx0dmFyIGJlID0ge1xyXG5cdFx0XHRcdFx0b2ZmOiBvbnRvLm9mZiB8fCBcclxuXHRcdFx0XHRcdChvbnRvLm9mZiA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRcdGlmKHRoaXMubmV4dCA9PT0gb250by5fLm5leHQpeyByZXR1cm4gITAgfVxyXG5cdFx0XHRcdFx0XHRpZih0aGlzID09PSB0aGlzLnRoZS5sYXN0KXtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnRoZS5sYXN0ID0gdGhpcy5iYWNrO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHRoaXMudG8uYmFjayA9IHRoaXMuYmFjaztcclxuXHRcdFx0XHRcdFx0dGhpcy5uZXh0ID0gb250by5fLm5leHQ7XHJcblx0XHRcdFx0XHRcdHRoaXMuYmFjay50byA9IHRoaXMudG87XHJcblx0XHRcdFx0XHR9KSxcclxuXHRcdFx0XHRcdHRvOiBvbnRvLl8sXHJcblx0XHRcdFx0XHRuZXh0OiBhcmcsXHJcblx0XHRcdFx0XHR0aGU6IHRhZyxcclxuXHRcdFx0XHRcdG9uOiB0aGlzLFxyXG5cdFx0XHRcdFx0YXM6IGFzLFxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0KGJlLmJhY2sgPSB0YWcubGFzdCB8fCB0YWcpLnRvID0gYmU7XHJcblx0XHRcdFx0cmV0dXJuIHRhZy5sYXN0ID0gYmU7XHJcblx0XHRcdH1cclxuXHRcdFx0KHRhZyA9IHRhZy50bykubmV4dChhcmcpO1xyXG5cdFx0XHRyZXR1cm4gdGFnO1xyXG5cdFx0fTtcclxuXHR9KShyZXF1aXJlLCAnLi9vbnRvJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHQvLyBUT0RPOiBOZWVkcyB0byBiZSByZWRvbmUuXHJcblx0XHR2YXIgT24gPSByZXF1aXJlKCcuL29udG8nKTtcclxuXHJcblx0XHRmdW5jdGlvbiBDaGFpbihjcmVhdGUsIG9wdCl7XHJcblx0XHRcdG9wdCA9IG9wdCB8fCB7fTtcclxuXHRcdFx0b3B0LmlkID0gb3B0LmlkIHx8ICcjJztcclxuXHRcdFx0b3B0LnJpZCA9IG9wdC5yaWQgfHwgJ0AnO1xyXG5cdFx0XHRvcHQudXVpZCA9IG9wdC51dWlkIHx8IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0cmV0dXJuICgrbmV3IERhdGUoKSkgKyBNYXRoLnJhbmRvbSgpO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHR2YXIgb24gPSBPbjsvL09uLnNjb3BlKCk7XHJcblxyXG5cdFx0XHRvbi5zdHVuID0gZnVuY3Rpb24oY2hhaW4pe1xyXG5cdFx0XHRcdHZhciBzdHVuID0gZnVuY3Rpb24oZXYpe1xyXG5cdFx0XHRcdFx0aWYoc3R1bi5vZmYgJiYgc3R1biA9PT0gdGhpcy5zdHVuKXtcclxuXHRcdFx0XHRcdFx0dGhpcy5zdHVuID0gbnVsbDtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYob24uc3R1bi5za2lwKXtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYoZXYpe1xyXG5cdFx0XHRcdFx0XHRldi5jYiA9IGV2LmZuO1xyXG5cdFx0XHRcdFx0XHRldi5vZmYoKTtcclxuXHRcdFx0XHRcdFx0cmVzLnF1ZXVlLnB1c2goZXYpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fSwgcmVzID0gc3R1bi5yZXMgPSBmdW5jdGlvbih0bXAsIGFzKXtcclxuXHRcdFx0XHRcdGlmKHN0dW4ub2ZmKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdGlmKHRtcCBpbnN0YW5jZW9mIEZ1bmN0aW9uKXtcclxuXHRcdFx0XHRcdFx0b24uc3R1bi5za2lwID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0dG1wLmNhbGwoYXMpO1xyXG5cdFx0XHRcdFx0XHRvbi5zdHVuLnNraXAgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0c3R1bi5vZmYgPSB0cnVlO1xyXG5cdFx0XHRcdFx0dmFyIGkgPSAwLCBxID0gcmVzLnF1ZXVlLCBsID0gcS5sZW5ndGgsIGFjdDtcclxuXHRcdFx0XHRcdHJlcy5xdWV1ZSA9IFtdO1xyXG5cdFx0XHRcdFx0aWYoc3R1biA9PT0gYXQuc3R1bil7XHJcblx0XHRcdFx0XHRcdGF0LnN0dW4gPSBudWxsO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Zm9yKGk7IGkgPCBsOyBpKyspeyBhY3QgPSBxW2ldO1xyXG5cdFx0XHRcdFx0XHRhY3QuZm4gPSBhY3QuY2I7XHJcblx0XHRcdFx0XHRcdGFjdC5jYiA9IG51bGw7XHJcblx0XHRcdFx0XHRcdG9uLnN0dW4uc2tpcCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdGFjdC5jdHgub24oYWN0LnRhZywgYWN0LmZuLCBhY3QpO1xyXG5cdFx0XHRcdFx0XHRvbi5zdHVuLnNraXAgPSBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LCBhdCA9IGNoYWluLl87XHJcblx0XHRcdFx0cmVzLmJhY2sgPSBhdC5zdHVuIHx8IChhdC5iYWNrfHx7Xzp7fX0pLl8uc3R1bjtcclxuXHRcdFx0XHRpZihyZXMuYmFjayl7XHJcblx0XHRcdFx0XHRyZXMuYmFjay5uZXh0ID0gc3R1bjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmVzLnF1ZXVlID0gW107XHJcblx0XHRcdFx0YXQuc3R1biA9IHN0dW47IFxyXG5cdFx0XHRcdHJldHVybiByZXM7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIG9uO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHRcdHJldHVybjtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHRcdHZhciBhc2sgPSBvbi5hc2sgPSBmdW5jdGlvbihjYiwgYXMpe1xyXG5cdFx0XHRcdGlmKCFhc2sub24peyBhc2sub24gPSBPbi5zY29wZSgpIH1cclxuXHRcdFx0XHR2YXIgaWQgPSBvcHQudXVpZCgpO1xyXG5cdFx0XHRcdGlmKGNiKXsgYXNrLm9uKGlkLCBjYiwgYXMpIH1cclxuXHRcdFx0XHRyZXR1cm4gaWQ7XHJcblx0XHRcdH1cclxuXHRcdFx0YXNrLl8gPSBvcHQuaWQ7XHJcblx0XHRcdG9uLmFjayA9IGZ1bmN0aW9uKGF0LCByZXBseSl7XHJcblx0XHRcdFx0aWYoIWF0IHx8ICFyZXBseSB8fCAhYXNrLm9uKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgaWQgPSBhdFtvcHQuaWRdIHx8IGF0O1xyXG5cdFx0XHRcdGlmKCFhc2sub25zW2lkXSl7IHJldHVybiB9XHJcblx0XHRcdFx0YXNrLm9uKGlkLCByZXBseSk7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0b24uYWNrLl8gPSBvcHQucmlkO1xyXG5cclxuXHJcblx0XHRcdHJldHVybiBvbjtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHRcdHJldHVybjtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRvbi5vbignZXZlbnQnLCBmdW5jdGlvbiBldmVudChhY3Qpe1xyXG5cdFx0XHRcdHZhciBsYXN0ID0gYWN0Lm9uLmxhc3QsIHRtcDtcclxuXHRcdFx0XHRpZignaW4nID09PSBhY3QudGFnICYmIEd1bi5jaGFpbi5jaGFpbi5pbnB1dCAhPT0gYWN0LmZuKXsgLy8gVE9ETzogQlVHISBHdW4gaXMgbm90IGF2YWlsYWJsZSBpbiB0aGlzIG1vZHVsZS5cclxuXHRcdFx0XHRcdGlmKCh0bXAgPSBhY3QuY3R4KSAmJiB0bXAuc3R1bil7XHJcblx0XHRcdFx0XHRcdGlmKHRtcC5zdHVuKGFjdCkpe1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZighbGFzdCl7IHJldHVybiB9XHJcblx0XHRcdFx0aWYoYWN0Lm9uLm1hcCl7XHJcblx0XHRcdFx0XHR2YXIgbWFwID0gYWN0Lm9uLm1hcCwgdjtcclxuXHRcdFx0XHRcdGZvcih2YXIgZiBpbiBtYXApeyB2ID0gbWFwW2ZdO1xyXG5cdFx0XHRcdFx0XHRpZih2KXtcclxuXHRcdFx0XHRcdFx0XHRlbWl0KHYsIGFjdCwgZXZlbnQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvKlxyXG5cdFx0XHRcdFx0R3VuLm9iai5tYXAoYWN0Lm9uLm1hcCwgZnVuY3Rpb24odixmKXsgLy8gVE9ETzogQlVHISBHdW4gaXMgbm90IGF2YWlsYWJsZSBpbiB0aGlzIG1vZHVsZS5cclxuXHRcdFx0XHRcdFx0Ly9lbWl0KHZbMF0sIGFjdCwgZXZlbnQsIHZbMV0pOyAvLyBiZWxvdyBlbmFibGVzIG1vcmUgY29udHJvbFxyXG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiYm9vb29vb29vXCIsIGYsdik7XHJcblx0XHRcdFx0XHRcdGVtaXQodiwgYWN0LCBldmVudCk7XHJcblx0XHRcdFx0XHRcdC8vZW1pdCh2WzFdLCBhY3QsIGV2ZW50LCB2WzJdKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0Ki9cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0ZW1pdChsYXN0LCBhY3QsIGV2ZW50KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYobGFzdCAhPT0gYWN0Lm9uLmxhc3Qpe1xyXG5cdFx0XHRcdFx0ZXZlbnQoYWN0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRmdW5jdGlvbiBlbWl0KGxhc3QsIGFjdCwgZXZlbnQsIGV2KXtcclxuXHRcdFx0XHRpZihsYXN0IGluc3RhbmNlb2YgQXJyYXkpe1xyXG5cdFx0XHRcdFx0YWN0LmZuLmFwcGx5KGFjdC5hcywgbGFzdC5jb25jYXQoZXZ8fGFjdCkpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRhY3QuZm4uY2FsbChhY3QuYXMsIGxhc3QsIGV2fHxhY3QpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Lypvbi5vbignZW1pdCcsIGZ1bmN0aW9uKGV2KXtcclxuXHRcdFx0XHRpZihldi5vbi5tYXApe1xyXG5cdFx0XHRcdFx0dmFyIGlkID0gZXYuYXJnLnZpYS5ndW4uXy5pZCArIGV2LmFyZy5nZXQ7XHJcblx0XHRcdFx0XHQvL1xyXG5cdFx0XHRcdFx0Ly9ldi5pZCA9IGV2LmlkIHx8IEd1bi50ZXh0LnJhbmRvbSg2KTtcclxuXHRcdFx0XHRcdC8vZXYub24ubWFwW2V2LmlkXSA9IGV2LmFyZztcclxuXHRcdFx0XHRcdC8vZXYucHJveHkgPSBldi5hcmdbMV07XHJcblx0XHRcdFx0XHQvL2V2LmFyZyA9IGV2LmFyZ1swXTtcclxuXHRcdFx0XHRcdC8vIGJlbG93IGdpdmVzIG1vcmUgY29udHJvbC5cclxuXHRcdFx0XHRcdGV2Lm9uLm1hcFtpZF0gPSBldi5hcmc7XHJcblx0XHRcdFx0XHQvL2V2LnByb3h5ID0gZXYuYXJnWzJdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRldi5vbi5sYXN0ID0gZXYuYXJnO1xyXG5cdFx0XHR9KTsqL1xyXG5cclxuXHRcdFx0b24ub24oJ2VtaXQnLCBmdW5jdGlvbihldil7XHJcblx0XHRcdFx0dmFyIGd1biA9IGV2LmFyZy5ndW47XHJcblx0XHRcdFx0aWYoJ2luJyA9PT0gZXYudGFnICYmIGd1biAmJiAhZ3VuLl8uc291bCl7IC8vIFRPRE86IEJVRyEgU291bCBzaG91bGQgYmUgYXZhaWxhYmxlLiBDdXJyZW50bHkgbm90IHVzaW5nIGl0IHRob3VnaCwgYnV0IHNob3VsZCBlbmFibGUgaXQgKGNoZWNrIGZvciBzaWRlIGVmZmVjdHMgaWYgbWFkZSBhdmFpbGFibGUpLlxyXG5cdFx0XHRcdFx0KGV2Lm9uLm1hcCA9IGV2Lm9uLm1hcCB8fCB7fSlbZ3VuLl8uaWQgfHwgKGd1bi5fLmlkID0gTWF0aC5yYW5kb20oKSldID0gZXYuYXJnO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRldi5vbi5sYXN0ID0gZXYuYXJnO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG9uO1xyXG5cdFx0fVxyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBDaGFpbjtcclxuXHR9KShyZXF1aXJlLCAnLi9vbmlmeScpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0Ly8gR2VuZXJpYyBqYXZhc2NyaXB0IHNjaGVkdWxlciB1dGlsaXR5LlxyXG5cdFx0dmFyIFR5cGUgPSByZXF1aXJlKCcuL3R5cGUnKTtcclxuXHRcdGZ1bmN0aW9uIHMoc3RhdGUsIGNiLCB0aW1lKXsgLy8gbWF5YmUgdXNlIGxydS1jYWNoZT9cclxuXHRcdFx0cy50aW1lID0gdGltZSB8fCBHdW4udGltZS5pcztcclxuXHRcdFx0cy53YWl0aW5nLnB1c2goe3doZW46IHN0YXRlLCBldmVudDogY2IgfHwgZnVuY3Rpb24oKXt9fSk7XHJcblx0XHRcdGlmKHMuc29vbmVzdCA8IHN0YXRlKXsgcmV0dXJuIH1cclxuXHRcdFx0cy5zZXQoc3RhdGUpO1xyXG5cdFx0fVxyXG5cdFx0cy53YWl0aW5nID0gW107XHJcblx0XHRzLnNvb25lc3QgPSBJbmZpbml0eTtcclxuXHRcdHMuc29ydCA9IFR5cGUubGlzdC5zb3J0KCd3aGVuJyk7XHJcblx0XHRzLnNldCA9IGZ1bmN0aW9uKGZ1dHVyZSl7XHJcblx0XHRcdGlmKEluZmluaXR5IDw9IChzLnNvb25lc3QgPSBmdXR1cmUpKXsgcmV0dXJuIH1cclxuXHRcdFx0dmFyIG5vdyA9IHMudGltZSgpO1xyXG5cdFx0XHRmdXR1cmUgPSAoZnV0dXJlIDw9IG5vdyk/IDAgOiAoZnV0dXJlIC0gbm93KTtcclxuXHRcdFx0Y2xlYXJUaW1lb3V0KHMuaWQpO1xyXG5cdFx0XHRzLmlkID0gc2V0VGltZW91dChzLmNoZWNrLCBmdXR1cmUpO1xyXG5cdFx0fVxyXG5cdFx0cy5lYWNoID0gZnVuY3Rpb24od2FpdCwgaSwgbWFwKXtcclxuXHRcdFx0dmFyIGN0eCA9IHRoaXM7XHJcblx0XHRcdGlmKCF3YWl0KXsgcmV0dXJuIH1cclxuXHRcdFx0aWYod2FpdC53aGVuIDw9IGN0eC5ub3cpe1xyXG5cdFx0XHRcdGlmKHdhaXQuZXZlbnQgaW5zdGFuY2VvZiBGdW5jdGlvbil7XHJcblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IHdhaXQuZXZlbnQoKSB9LDApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjdHguc29vbmVzdCA9IChjdHguc29vbmVzdCA8IHdhaXQud2hlbik/IGN0eC5zb29uZXN0IDogd2FpdC53aGVuO1xyXG5cdFx0XHRcdG1hcCh3YWl0KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cy5jaGVjayA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBjdHggPSB7bm93OiBzLnRpbWUoKSwgc29vbmVzdDogSW5maW5pdHl9O1xyXG5cdFx0XHRzLndhaXRpbmcuc29ydChzLnNvcnQpO1xyXG5cdFx0XHRzLndhaXRpbmcgPSBUeXBlLmxpc3QubWFwKHMud2FpdGluZywgcy5lYWNoLCBjdHgpIHx8IFtdO1xyXG5cdFx0XHRzLnNldChjdHguc29vbmVzdCk7XHJcblx0XHR9XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IHM7XHJcblx0fSkocmVxdWlyZSwgJy4vc2NoZWR1bGUnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdC8qIEJhc2VkIG9uIHRoZSBIeXBvdGhldGljYWwgQW1uZXNpYSBNYWNoaW5lIHRob3VnaHQgZXhwZXJpbWVudCAqL1xyXG5cdFx0ZnVuY3Rpb24gSEFNKG1hY2hpbmVTdGF0ZSwgaW5jb21pbmdTdGF0ZSwgY3VycmVudFN0YXRlLCBpbmNvbWluZ1ZhbHVlLCBjdXJyZW50VmFsdWUpe1xyXG5cdFx0XHRpZihtYWNoaW5lU3RhdGUgPCBpbmNvbWluZ1N0YXRlKXtcclxuXHRcdFx0XHRyZXR1cm4ge2RlZmVyOiB0cnVlfTsgLy8gdGhlIGluY29taW5nIHZhbHVlIGlzIG91dHNpZGUgdGhlIGJvdW5kYXJ5IG9mIHRoZSBtYWNoaW5lJ3Mgc3RhdGUsIGl0IG11c3QgYmUgcmVwcm9jZXNzZWQgaW4gYW5vdGhlciBzdGF0ZS5cclxuXHRcdFx0fVxyXG5cdFx0XHRpZihpbmNvbWluZ1N0YXRlIDwgY3VycmVudFN0YXRlKXtcclxuXHRcdFx0XHRyZXR1cm4ge2hpc3RvcmljYWw6IHRydWV9OyAvLyB0aGUgaW5jb21pbmcgdmFsdWUgaXMgd2l0aGluIHRoZSBib3VuZGFyeSBvZiB0aGUgbWFjaGluZSdzIHN0YXRlLCBidXQgbm90IHdpdGhpbiB0aGUgcmFuZ2UuXHJcblxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGN1cnJlbnRTdGF0ZSA8IGluY29taW5nU3RhdGUpe1xyXG5cdFx0XHRcdHJldHVybiB7Y29udmVyZ2U6IHRydWUsIGluY29taW5nOiB0cnVlfTsgLy8gdGhlIGluY29taW5nIHZhbHVlIGlzIHdpdGhpbiBib3RoIHRoZSBib3VuZGFyeSBhbmQgdGhlIHJhbmdlIG9mIHRoZSBtYWNoaW5lJ3Mgc3RhdGUuXHJcblxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGluY29taW5nU3RhdGUgPT09IGN1cnJlbnRTdGF0ZSl7XHJcblx0XHRcdFx0aWYoTGV4aWNhbChpbmNvbWluZ1ZhbHVlKSA9PT0gTGV4aWNhbChjdXJyZW50VmFsdWUpKXsgLy8gTm90ZTogd2hpbGUgdGhlc2UgYXJlIHByYWN0aWNhbGx5IHRoZSBzYW1lLCB0aGUgZGVsdGFzIGNvdWxkIGJlIHRlY2huaWNhbGx5IGRpZmZlcmVudFxyXG5cdFx0XHRcdFx0cmV0dXJuIHtzdGF0ZTogdHJ1ZX07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8qXHJcblx0XHRcdFx0XHRUaGUgZm9sbG93aW5nIGlzIGEgbmFpdmUgaW1wbGVtZW50YXRpb24sIGJ1dCB3aWxsIGFsd2F5cyB3b3JrLlxyXG5cdFx0XHRcdFx0TmV2ZXIgY2hhbmdlIGl0IHVubGVzcyB5b3UgaGF2ZSBzcGVjaWZpYyBuZWVkcyB0aGF0IGFic29sdXRlbHkgcmVxdWlyZSBpdC5cclxuXHRcdFx0XHRcdElmIGNoYW5nZWQsIHlvdXIgZGF0YSB3aWxsIGRpdmVyZ2UgdW5sZXNzIHlvdSBndWFyYW50ZWUgZXZlcnkgcGVlcidzIGFsZ29yaXRobSBoYXMgYWxzbyBiZWVuIGNoYW5nZWQgdG8gYmUgdGhlIHNhbWUuXHJcblx0XHRcdFx0XHRBcyBhIHJlc3VsdCwgaXQgaXMgaGlnaGx5IGRpc2NvdXJhZ2VkIHRvIG1vZGlmeSBkZXNwaXRlIHRoZSBmYWN0IHRoYXQgaXQgaXMgbmFpdmUsXHJcblx0XHRcdFx0XHRiZWNhdXNlIGNvbnZlcmdlbmNlIChkYXRhIGludGVncml0eSkgaXMgZ2VuZXJhbGx5IG1vcmUgaW1wb3J0YW50LlxyXG5cdFx0XHRcdFx0QW55IGRpZmZlcmVuY2UgaW4gdGhpcyBhbGdvcml0aG0gbXVzdCBiZSBnaXZlbiBhIG5ldyBhbmQgZGlmZmVyZW50IG5hbWUuXHJcblx0XHRcdFx0Ki9cclxuXHRcdFx0XHRpZihMZXhpY2FsKGluY29taW5nVmFsdWUpIDwgTGV4aWNhbChjdXJyZW50VmFsdWUpKXsgLy8gTGV4aWNhbCBvbmx5IHdvcmtzIG9uIHNpbXBsZSB2YWx1ZSB0eXBlcyFcclxuXHRcdFx0XHRcdHJldHVybiB7Y29udmVyZ2U6IHRydWUsIGN1cnJlbnQ6IHRydWV9O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihMZXhpY2FsKGN1cnJlbnRWYWx1ZSkgPCBMZXhpY2FsKGluY29taW5nVmFsdWUpKXsgLy8gTGV4aWNhbCBvbmx5IHdvcmtzIG9uIHNpbXBsZSB2YWx1ZSB0eXBlcyFcclxuXHRcdFx0XHRcdHJldHVybiB7Y29udmVyZ2U6IHRydWUsIGluY29taW5nOiB0cnVlfTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHtlcnI6IFwiSW52YWxpZCBDUkRUIERhdGE6IFwiKyBpbmNvbWluZ1ZhbHVlICtcIiB0byBcIisgY3VycmVudFZhbHVlICtcIiBhdCBcIisgaW5jb21pbmdTdGF0ZSArXCIgdG8gXCIrIGN1cnJlbnRTdGF0ZSArXCIhXCJ9O1xyXG5cdFx0fVxyXG5cdFx0aWYodHlwZW9mIEpTT04gPT09ICd1bmRlZmluZWQnKXtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFxyXG5cdFx0XHRcdCdKU09OIGlzIG5vdCBpbmNsdWRlZCBpbiB0aGlzIGJyb3dzZXIuIFBsZWFzZSBsb2FkIGl0IGZpcnN0OiAnICtcclxuXHRcdFx0XHQnYWpheC5jZG5qcy5jb20vYWpheC9saWJzL2pzb24yLzIwMTEwMjIzL2pzb24yLmpzJ1xyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIExleGljYWwgPSBKU09OLnN0cmluZ2lmeSwgdW5kZWZpbmVkO1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBIQU07XHJcblx0fSkocmVxdWlyZSwgJy4vSEFNJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgVHlwZSA9IHJlcXVpcmUoJy4vdHlwZScpO1xyXG5cdFx0dmFyIFZhbCA9IHt9O1xyXG5cdFx0VmFsLmlzID0gZnVuY3Rpb24odil7IC8vIFZhbGlkIHZhbHVlcyBhcmUgYSBzdWJzZXQgb2YgSlNPTjogbnVsbCwgYmluYXJ5LCBudW1iZXIgKCFJbmZpbml0eSksIHRleHQsIG9yIGEgc291bCByZWxhdGlvbi4gQXJyYXlzIG5lZWQgc3BlY2lhbCBhbGdvcml0aG1zIHRvIGhhbmRsZSBjb25jdXJyZW5jeSwgc28gdGhleSBhcmUgbm90IHN1cHBvcnRlZCBkaXJlY3RseS4gVXNlIGFuIGV4dGVuc2lvbiB0aGF0IHN1cHBvcnRzIHRoZW0gaWYgbmVlZGVkIGJ1dCByZXNlYXJjaCB0aGVpciBwcm9ibGVtcyBmaXJzdC5cclxuXHRcdFx0aWYodiA9PT0gdSl7IHJldHVybiBmYWxzZSB9XHJcblx0XHRcdGlmKHYgPT09IG51bGwpeyByZXR1cm4gdHJ1ZSB9IC8vIFwiZGVsZXRlc1wiLCBudWxsaW5nIG91dCBmaWVsZHMuXHJcblx0XHRcdGlmKHYgPT09IEluZmluaXR5KXsgcmV0dXJuIGZhbHNlIH0gLy8gd2Ugd2FudCB0aGlzIHRvIGJlLCBidXQgSlNPTiBkb2VzIG5vdCBzdXBwb3J0IGl0LCBzYWQgZmFjZS5cclxuXHRcdFx0aWYodGV4dF9pcyh2KSAvLyBieSBcInRleHRcIiB3ZSBtZWFuIHN0cmluZ3MuXHJcblx0XHRcdHx8IGJpX2lzKHYpIC8vIGJ5IFwiYmluYXJ5XCIgd2UgbWVhbiBib29sZWFuLlxyXG5cdFx0XHR8fCBudW1faXModikpeyAvLyBieSBcIm51bWJlclwiIHdlIG1lYW4gaW50ZWdlcnMgb3IgZGVjaW1hbHMuIFxyXG5cdFx0XHRcdHJldHVybiB0cnVlOyAvLyBzaW1wbGUgdmFsdWVzIGFyZSB2YWxpZC5cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gVmFsLnJlbC5pcyh2KSB8fCBmYWxzZTsgLy8gaXMgdGhlIHZhbHVlIGEgc291bCByZWxhdGlvbj8gVGhlbiBpdCBpcyB2YWxpZCBhbmQgcmV0dXJuIGl0LiBJZiBub3QsIGV2ZXJ5dGhpbmcgZWxzZSByZW1haW5pbmcgaXMgYW4gaW52YWxpZCBkYXRhIHR5cGUuIEN1c3RvbSBleHRlbnNpb25zIGNhbiBiZSBidWlsdCBvbiB0b3Agb2YgdGhlc2UgcHJpbWl0aXZlcyB0byBzdXBwb3J0IG90aGVyIHR5cGVzLlxyXG5cdFx0fVxyXG5cdFx0VmFsLnJlbCA9IHtfOiAnIyd9O1xyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRWYWwucmVsLmlzID0gZnVuY3Rpb24odil7IC8vIHRoaXMgZGVmaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhIHNvdWwgcmVsYXRpb24gb3Igbm90LCB0aGV5IGxvb2sgbGlrZSB0aGlzOiB7JyMnOiAnVVVJRCd9XHJcblx0XHRcdFx0aWYodiAmJiB2W3JlbF9dICYmICF2Ll8gJiYgb2JqX2lzKHYpKXsgLy8gbXVzdCBiZSBhbiBvYmplY3QuXHJcblx0XHRcdFx0XHR2YXIgbyA9IHt9O1xyXG5cdFx0XHRcdFx0b2JqX21hcCh2LCBtYXAsIG8pO1xyXG5cdFx0XHRcdFx0aWYoby5pZCl7IC8vIGEgdmFsaWQgaWQgd2FzIGZvdW5kLlxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gby5pZDsgLy8geWF5ISBSZXR1cm4gaXQuXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZTsgLy8gdGhlIHZhbHVlIHdhcyBub3QgYSB2YWxpZCBzb3VsIHJlbGF0aW9uLlxyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcChzLCBmKXsgdmFyIG8gPSB0aGlzOyAvLyBtYXAgb3ZlciB0aGUgb2JqZWN0Li4uXHJcblx0XHRcdFx0aWYoby5pZCl7IHJldHVybiBvLmlkID0gZmFsc2UgfSAvLyBpZiBJRCBpcyBhbHJlYWR5IGRlZmluZWQgQU5EIHdlJ3JlIHN0aWxsIGxvb3BpbmcgdGhyb3VnaCB0aGUgb2JqZWN0LCBpdCBpcyBjb25zaWRlcmVkIGludmFsaWQuXHJcblx0XHRcdFx0aWYoZiA9PSByZWxfICYmIHRleHRfaXMocykpeyAvLyB0aGUgZmllbGQgc2hvdWxkIGJlICcjJyBhbmQgaGF2ZSBhIHRleHQgdmFsdWUuXHJcblx0XHRcdFx0XHRvLmlkID0gczsgLy8gd2UgZm91bmQgdGhlIHNvdWwhXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiBvLmlkID0gZmFsc2U7IC8vIGlmIHRoZXJlIGV4aXN0cyBhbnl0aGluZyBlbHNlIG9uIHRoZSBvYmplY3QgdGhhdCBpc24ndCB0aGUgc291bCwgdGhlbiBpdCBpcyBjb25zaWRlcmVkIGludmFsaWQuXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0VmFsLnJlbC5pZnkgPSBmdW5jdGlvbih0KXsgcmV0dXJuIG9ial9wdXQoe30sIHJlbF8sIHQpIH0gLy8gY29udmVydCBhIHNvdWwgaW50byBhIHJlbGF0aW9uIGFuZCByZXR1cm4gaXQuXHJcblx0XHR2YXIgcmVsXyA9IFZhbC5yZWwuXywgdTtcclxuXHRcdHZhciBiaV9pcyA9IFR5cGUuYmkuaXM7XHJcblx0XHR2YXIgbnVtX2lzID0gVHlwZS5udW0uaXM7XHJcblx0XHR2YXIgdGV4dF9pcyA9IFR5cGUudGV4dC5pcztcclxuXHRcdHZhciBvYmogPSBUeXBlLm9iaiwgb2JqX2lzID0gb2JqLmlzLCBvYmpfcHV0ID0gb2JqLnB1dCwgb2JqX21hcCA9IG9iai5tYXA7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IFZhbDtcclxuXHR9KShyZXF1aXJlLCAnLi92YWwnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBUeXBlID0gcmVxdWlyZSgnLi90eXBlJyk7XHJcblx0XHR2YXIgVmFsID0gcmVxdWlyZSgnLi92YWwnKTtcclxuXHRcdHZhciBOb2RlID0ge186ICdfJ307XHJcblx0XHROb2RlLnNvdWwgPSBmdW5jdGlvbihuLCBvKXsgcmV0dXJuIChuICYmIG4uXyAmJiBuLl9bbyB8fCBzb3VsX10pIH0gLy8gY29udmVuaWVuY2UgZnVuY3Rpb24gdG8gY2hlY2sgdG8gc2VlIGlmIHRoZXJlIGlzIGEgc291bCBvbiBhIG5vZGUgYW5kIHJldHVybiBpdC5cclxuXHRcdE5vZGUuc291bC5pZnkgPSBmdW5jdGlvbihuLCBvKXsgLy8gcHV0IGEgc291bCBvbiBhbiBvYmplY3QuXHJcblx0XHRcdG8gPSAodHlwZW9mIG8gPT09ICdzdHJpbmcnKT8ge3NvdWw6IG99IDogbyB8fCB7fTtcclxuXHRcdFx0biA9IG4gfHwge307IC8vIG1ha2Ugc3VyZSBpdCBleGlzdHMuXHJcblx0XHRcdG4uXyA9IG4uXyB8fCB7fTsgLy8gbWFrZSBzdXJlIG1ldGEgZXhpc3RzLlxyXG5cdFx0XHRuLl9bc291bF9dID0gby5zb3VsIHx8IG4uX1tzb3VsX10gfHwgdGV4dF9yYW5kb20oKTsgLy8gcHV0IHRoZSBzb3VsIG9uIGl0LlxyXG5cdFx0XHRyZXR1cm4gbjtcclxuXHRcdH1cclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0Tm9kZS5pcyA9IGZ1bmN0aW9uKG4sIGNiLCBhcyl7IHZhciBzOyAvLyBjaGVja3MgdG8gc2VlIGlmIGFuIG9iamVjdCBpcyBhIHZhbGlkIG5vZGUuXHJcblx0XHRcdFx0aWYoIW9ial9pcyhuKSl7IHJldHVybiBmYWxzZSB9IC8vIG11c3QgYmUgYW4gb2JqZWN0LlxyXG5cdFx0XHRcdGlmKHMgPSBOb2RlLnNvdWwobikpeyAvLyBtdXN0IGhhdmUgYSBzb3VsIG9uIGl0LlxyXG5cdFx0XHRcdFx0cmV0dXJuICFvYmpfbWFwKG4sIG1hcCwge2FzOmFzLGNiOmNiLHM6cyxuOm59KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlOyAvLyBub3BlISBUaGlzIHdhcyBub3QgYSB2YWxpZCBub2RlLlxyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcCh2LCBmKXsgLy8gd2UgaW52ZXJ0IHRoaXMgYmVjYXVzZSB0aGUgd2F5IHdlIGNoZWNrIGZvciB0aGlzIGlzIHZpYSBhIG5lZ2F0aW9uLlxyXG5cdFx0XHRcdGlmKGYgPT09IE5vZGUuXyl7IHJldHVybiB9IC8vIHNraXAgb3ZlciB0aGUgbWV0YWRhdGEuXHJcblx0XHRcdFx0aWYoIVZhbC5pcyh2KSl7IHJldHVybiB0cnVlIH0gLy8gaXQgaXMgdHJ1ZSB0aGF0IHRoaXMgaXMgYW4gaW52YWxpZCBub2RlLlxyXG5cdFx0XHRcdGlmKHRoaXMuY2IpeyB0aGlzLmNiLmNhbGwodGhpcy5hcywgdiwgZiwgdGhpcy5uLCB0aGlzLnMpIH0gLy8gb3B0aW9uYWxseSBjYWxsYmFjayBlYWNoIGZpZWxkL3ZhbHVlLlxyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHROb2RlLmlmeSA9IGZ1bmN0aW9uKG9iaiwgbywgYXMpeyAvLyByZXR1cm5zIGEgbm9kZSBmcm9tIGEgc2hhbGxvdyBvYmplY3QuXHJcblx0XHRcdFx0aWYoIW8peyBvID0ge30gfVxyXG5cdFx0XHRcdGVsc2UgaWYodHlwZW9mIG8gPT09ICdzdHJpbmcnKXsgbyA9IHtzb3VsOiBvfSB9XHJcblx0XHRcdFx0ZWxzZSBpZihvIGluc3RhbmNlb2YgRnVuY3Rpb24peyBvID0ge21hcDogb30gfVxyXG5cdFx0XHRcdGlmKG8ubWFwKXsgby5ub2RlID0gby5tYXAuY2FsbChhcywgb2JqLCB1LCBvLm5vZGUgfHwge30pIH1cclxuXHRcdFx0XHRpZihvLm5vZGUgPSBOb2RlLnNvdWwuaWZ5KG8ubm9kZSB8fCB7fSwgbykpe1xyXG5cdFx0XHRcdFx0b2JqX21hcChvYmosIG1hcCwge286byxhczphc30pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gby5ub2RlOyAvLyBUaGlzIHdpbGwgb25seSBiZSBhIHZhbGlkIG5vZGUgaWYgdGhlIG9iamVjdCB3YXNuJ3QgYWxyZWFkeSBkZWVwIVxyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcCh2LCBmKXsgdmFyIG8gPSB0aGlzLm8sIHRtcCwgdTsgLy8gaXRlcmF0ZSBvdmVyIGVhY2ggZmllbGQvdmFsdWUuXHJcblx0XHRcdFx0aWYoby5tYXApe1xyXG5cdFx0XHRcdFx0dG1wID0gby5tYXAuY2FsbCh0aGlzLmFzLCB2LCAnJytmLCBvLm5vZGUpO1xyXG5cdFx0XHRcdFx0aWYodSA9PT0gdG1wKXtcclxuXHRcdFx0XHRcdFx0b2JqX2RlbChvLm5vZGUsIGYpO1xyXG5cdFx0XHRcdFx0fSBlbHNlXHJcblx0XHRcdFx0XHRpZihvLm5vZGUpeyBvLm5vZGVbZl0gPSB0bXAgfVxyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihWYWwuaXModikpe1xyXG5cdFx0XHRcdFx0by5ub2RlW2ZdID0gdjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblx0XHR2YXIgb2JqID0gVHlwZS5vYmosIG9ial9pcyA9IG9iai5pcywgb2JqX2RlbCA9IG9iai5kZWwsIG9ial9tYXAgPSBvYmoubWFwO1xyXG5cdFx0dmFyIHRleHQgPSBUeXBlLnRleHQsIHRleHRfcmFuZG9tID0gdGV4dC5yYW5kb207XHJcblx0XHR2YXIgc291bF8gPSBWYWwucmVsLl87XHJcblx0XHR2YXIgdTtcclxuXHRcdG1vZHVsZS5leHBvcnRzID0gTm9kZTtcclxuXHR9KShyZXF1aXJlLCAnLi9ub2RlJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgVHlwZSA9IHJlcXVpcmUoJy4vdHlwZScpO1xyXG5cdFx0dmFyIE5vZGUgPSByZXF1aXJlKCcuL25vZGUnKTtcclxuXHRcdGZ1bmN0aW9uIFN0YXRlKCl7XHJcblx0XHRcdHZhciB0O1xyXG5cdFx0XHRpZihwZXJmKXtcclxuXHRcdFx0XHR0ID0gc3RhcnQgKyBwZXJmLm5vdygpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHQgPSB0aW1lKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYobGFzdCA8IHQpe1xyXG5cdFx0XHRcdHJldHVybiBOID0gMCwgbGFzdCA9IHQgKyBTdGF0ZS5kcmlmdDtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gbGFzdCA9IHQgKyAoKE4gKz0gMSkgLyBEKSArIFN0YXRlLmRyaWZ0O1xyXG5cdFx0fVxyXG5cdFx0dmFyIHRpbWUgPSBUeXBlLnRpbWUuaXMsIGxhc3QgPSAtSW5maW5pdHksIE4gPSAwLCBEID0gMTAwMDsgLy8gV0FSTklORyEgSW4gdGhlIGZ1dHVyZSwgb24gbWFjaGluZXMgdGhhdCBhcmUgRCB0aW1lcyBmYXN0ZXIgdGhhbiAyMDE2QUQgbWFjaGluZXMsIHlvdSB3aWxsIHdhbnQgdG8gaW5jcmVhc2UgRCBieSBhbm90aGVyIHNldmVyYWwgb3JkZXJzIG9mIG1hZ25pdHVkZSBzbyB0aGUgcHJvY2Vzc2luZyBzcGVlZCBuZXZlciBvdXQgcGFjZXMgdGhlIGRlY2ltYWwgcmVzb2x1dGlvbiAoaW5jcmVhc2luZyBhbiBpbnRlZ2VyIGVmZmVjdHMgdGhlIHN0YXRlIGFjY3VyYWN5KS5cclxuXHRcdHZhciBwZXJmID0gKHR5cGVvZiBwZXJmb3JtYW5jZSAhPT0gJ3VuZGVmaW5lZCcpPyAocGVyZm9ybWFuY2UudGltaW5nICYmIHBlcmZvcm1hbmNlKSA6IGZhbHNlLCBzdGFydCA9IChwZXJmICYmIHBlcmYudGltaW5nICYmIHBlcmYudGltaW5nLm5hdmlnYXRpb25TdGFydCkgfHwgKHBlcmYgPSBmYWxzZSk7XHJcblx0XHRTdGF0ZS5fID0gJz4nO1xyXG5cdFx0U3RhdGUuZHJpZnQgPSAwO1xyXG5cdFx0U3RhdGUuaWZ5ID0gZnVuY3Rpb24obiwgZiwgcywgdiwgc291bCl7IC8vIHB1dCBhIGZpZWxkJ3Mgc3RhdGUgb24gYSBub2RlLlxyXG5cdFx0XHRpZighbiB8fCAhbltOX10peyAvLyByZWplY3QgaWYgaXQgaXMgbm90IG5vZGUtbGlrZS5cclxuXHRcdFx0XHRpZighc291bCl7IC8vIHVubGVzcyB0aGV5IHBhc3NlZCBhIHNvdWxcclxuXHRcdFx0XHRcdHJldHVybjsgXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG4gPSBOb2RlLnNvdWwuaWZ5KG4sIHNvdWwpOyAvLyB0aGVuIG1ha2UgaXQgc28hXHJcblx0XHRcdH0gXHJcblx0XHRcdHZhciB0bXAgPSBvYmpfYXMobltOX10sIFN0YXRlLl8pOyAvLyBncmFiIHRoZSBzdGF0ZXMgZGF0YS5cclxuXHRcdFx0aWYodSAhPT0gZiAmJiBmICE9PSBOXyl7XHJcblx0XHRcdFx0aWYobnVtX2lzKHMpKXtcclxuXHRcdFx0XHRcdHRtcFtmXSA9IHM7IC8vIGFkZCB0aGUgdmFsaWQgc3RhdGUuXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKHUgIT09IHYpeyAvLyBOb3RlOiBOb3QgaXRzIGpvYiB0byBjaGVjayBmb3IgdmFsaWQgdmFsdWVzIVxyXG5cdFx0XHRcdFx0bltmXSA9IHY7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBuO1xyXG5cdFx0fVxyXG5cdFx0U3RhdGUuaXMgPSBmdW5jdGlvbihuLCBmLCBvKXsgLy8gY29udmVuaWVuY2UgZnVuY3Rpb24gdG8gZ2V0IHRoZSBzdGF0ZSBvbiBhIGZpZWxkIG9uIGEgbm9kZSBhbmQgcmV0dXJuIGl0LlxyXG5cdFx0XHR2YXIgdG1wID0gKGYgJiYgbiAmJiBuW05fXSAmJiBuW05fXVtTdGF0ZS5fXSkgfHwgbztcclxuXHRcdFx0aWYoIXRtcCl7IHJldHVybiB9XHJcblx0XHRcdHJldHVybiBudW1faXModG1wW2ZdKT8gdG1wW2ZdIDogLUluZmluaXR5O1xyXG5cdFx0fVxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRTdGF0ZS5tYXAgPSBmdW5jdGlvbihjYiwgcywgYXMpeyB2YXIgdTsgLy8gZm9yIHVzZSB3aXRoIE5vZGUuaWZ5XHJcblx0XHRcdFx0dmFyIG8gPSBvYmpfaXMobyA9IGNiIHx8IHMpPyBvIDogbnVsbDtcclxuXHRcdFx0XHRjYiA9IGZuX2lzKGNiID0gY2IgfHwgcyk/IGNiIDogbnVsbDtcclxuXHRcdFx0XHRpZihvICYmICFjYil7XHJcblx0XHRcdFx0XHRzID0gbnVtX2lzKHMpPyBzIDogU3RhdGUoKTtcclxuXHRcdFx0XHRcdG9bTl9dID0gb1tOX10gfHwge307XHJcblx0XHRcdFx0XHRvYmpfbWFwKG8sIG1hcCwge286byxzOnN9KTtcclxuXHRcdFx0XHRcdHJldHVybiBvO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRhcyA9IGFzIHx8IG9ial9pcyhzKT8gcyA6IHU7XHJcblx0XHRcdFx0cyA9IG51bV9pcyhzKT8gcyA6IFN0YXRlKCk7XHJcblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKHYsIGYsIG8sIG9wdCl7XHJcblx0XHRcdFx0XHRpZighY2Ipe1xyXG5cdFx0XHRcdFx0XHRtYXAuY2FsbCh7bzogbywgczogc30sIHYsZik7XHJcblx0XHRcdFx0XHRcdHJldHVybiB2O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y2IuY2FsbChhcyB8fCB0aGlzIHx8IHt9LCB2LCBmLCBvLCBvcHQpO1xyXG5cdFx0XHRcdFx0aWYob2JqX2hhcyhvLGYpICYmIHUgPT09IG9bZl0peyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0bWFwLmNhbGwoe286IG8sIHM6IHN9LCB2LGYpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBtYXAodixmKXtcclxuXHRcdFx0XHRpZihOXyA9PT0gZil7IHJldHVybiB9XHJcblx0XHRcdFx0U3RhdGUuaWZ5KHRoaXMubywgZiwgdGhpcy5zKSA7XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblx0XHR2YXIgb2JqID0gVHlwZS5vYmosIG9ial9hcyA9IG9iai5hcywgb2JqX2hhcyA9IG9iai5oYXMsIG9ial9pcyA9IG9iai5pcywgb2JqX21hcCA9IG9iai5tYXA7XHJcblx0XHR2YXIgbnVtID0gVHlwZS5udW0sIG51bV9pcyA9IG51bS5pcztcclxuXHRcdHZhciBmbiA9IFR5cGUuZm4sIGZuX2lzID0gZm4uaXM7XHJcblx0XHR2YXIgTl8gPSBOb2RlLl8sIHU7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IFN0YXRlO1xyXG5cdH0pKHJlcXVpcmUsICcuL3N0YXRlJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgVHlwZSA9IHJlcXVpcmUoJy4vdHlwZScpO1xyXG5cdFx0dmFyIFZhbCA9IHJlcXVpcmUoJy4vdmFsJyk7XHJcblx0XHR2YXIgTm9kZSA9IHJlcXVpcmUoJy4vbm9kZScpO1xyXG5cdFx0dmFyIEdyYXBoID0ge307XHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdEdyYXBoLmlzID0gZnVuY3Rpb24oZywgY2IsIGZuLCBhcyl7IC8vIGNoZWNrcyB0byBzZWUgaWYgYW4gb2JqZWN0IGlzIGEgdmFsaWQgZ3JhcGguXHJcblx0XHRcdFx0aWYoIWcgfHwgIW9ial9pcyhnKSB8fCBvYmpfZW1wdHkoZykpeyByZXR1cm4gZmFsc2UgfSAvLyBtdXN0IGJlIGFuIG9iamVjdC5cclxuXHRcdFx0XHRyZXR1cm4gIW9ial9tYXAoZywgbWFwLCB7Y2I6Y2IsZm46Zm4sYXM6YXN9KTsgLy8gbWFrZXMgc3VyZSBpdCB3YXNuJ3QgYW4gZW1wdHkgb2JqZWN0LlxyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcChuLCBzKXsgLy8gd2UgaW52ZXJ0IHRoaXMgYmVjYXVzZSB0aGUgd2F5IHdlIGNoZWNrIGZvciB0aGlzIGlzIHZpYSBhIG5lZ2F0aW9uLlxyXG5cdFx0XHRcdGlmKCFuIHx8IHMgIT09IE5vZGUuc291bChuKSB8fCAhTm9kZS5pcyhuLCB0aGlzLmZuKSl7IHJldHVybiB0cnVlIH0gLy8gaXQgaXMgdHJ1ZSB0aGF0IHRoaXMgaXMgYW4gaW52YWxpZCBncmFwaC5cclxuXHRcdFx0XHRpZighdGhpcy5jYil7IHJldHVybiB9XHJcblx0XHRcdFx0bmYubiA9IG47IG5mLmFzID0gdGhpcy5hczsgLy8gc2VxdWVudGlhbCByYWNlIGNvbmRpdGlvbnMgYXJlbid0IHJhY2VzLlxyXG5cdFx0XHRcdHRoaXMuY2IuY2FsbChuZi5hcywgbiwgcywgbmYpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG5mKGZuKXsgLy8gb3B0aW9uYWwgY2FsbGJhY2sgZm9yIGVhY2ggbm9kZS5cclxuXHRcdFx0XHRpZihmbil7IE5vZGUuaXMobmYubiwgZm4sIG5mLmFzKSB9IC8vIHdoZXJlIHdlIHRoZW4gaGF2ZSBhbiBvcHRpb25hbCBjYWxsYmFjayBmb3IgZWFjaCBmaWVsZC92YWx1ZS5cclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0R3JhcGguaWZ5ID0gZnVuY3Rpb24ob2JqLCBlbnYsIGFzKXtcclxuXHRcdFx0XHR2YXIgYXQgPSB7cGF0aDogW10sIG9iajogb2JqfTtcclxuXHRcdFx0XHRpZighZW52KXtcclxuXHRcdFx0XHRcdGVudiA9IHt9O1xyXG5cdFx0XHRcdH0gZWxzZVxyXG5cdFx0XHRcdGlmKHR5cGVvZiBlbnYgPT09ICdzdHJpbmcnKXtcclxuXHRcdFx0XHRcdGVudiA9IHtzb3VsOiBlbnZ9O1xyXG5cdFx0XHRcdH0gZWxzZVxyXG5cdFx0XHRcdGlmKGVudiBpbnN0YW5jZW9mIEZ1bmN0aW9uKXtcclxuXHRcdFx0XHRcdGVudi5tYXAgPSBlbnY7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGVudi5zb3VsKXtcclxuXHRcdFx0XHRcdGF0LnJlbCA9IFZhbC5yZWwuaWZ5KGVudi5zb3VsKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZW52LmdyYXBoID0gZW52LmdyYXBoIHx8IHt9O1xyXG5cdFx0XHRcdGVudi5zZWVuID0gZW52LnNlZW4gfHwgW107XHJcblx0XHRcdFx0ZW52LmFzID0gZW52LmFzIHx8IGFzO1xyXG5cdFx0XHRcdG5vZGUoZW52LCBhdCk7XHJcblx0XHRcdFx0ZW52LnJvb3QgPSBhdC5ub2RlO1xyXG5cdFx0XHRcdHJldHVybiBlbnYuZ3JhcGg7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbm9kZShlbnYsIGF0KXsgdmFyIHRtcDtcclxuXHRcdFx0XHRpZih0bXAgPSBzZWVuKGVudiwgYXQpKXsgcmV0dXJuIHRtcCB9XHJcblx0XHRcdFx0YXQuZW52ID0gZW52O1xyXG5cdFx0XHRcdGF0LnNvdWwgPSBzb3VsO1xyXG5cdFx0XHRcdGlmKE5vZGUuaWZ5KGF0Lm9iaiwgbWFwLCBhdCkpe1xyXG5cdFx0XHRcdFx0Ly9hdC5yZWwgPSBhdC5yZWwgfHwgVmFsLnJlbC5pZnkoTm9kZS5zb3VsKGF0Lm5vZGUpKTtcclxuXHRcdFx0XHRcdGVudi5ncmFwaFtWYWwucmVsLmlzKGF0LnJlbCldID0gYXQubm9kZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGF0O1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcCh2LGYsbil7XHJcblx0XHRcdFx0dmFyIGF0ID0gdGhpcywgZW52ID0gYXQuZW52LCBpcywgdG1wO1xyXG5cdFx0XHRcdGlmKE5vZGUuXyA9PT0gZiAmJiBvYmpfaGFzKHYsVmFsLnJlbC5fKSl7XHJcblx0XHRcdFx0XHRyZXR1cm4gbi5fOyAvLyBUT0RPOiBCdWc/XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKCEoaXMgPSB2YWxpZCh2LGYsbiwgYXQsZW52KSkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGlmKCFmKXtcclxuXHRcdFx0XHRcdGF0Lm5vZGUgPSBhdC5ub2RlIHx8IG4gfHwge307XHJcblx0XHRcdFx0XHRpZihvYmpfaGFzKHYsIE5vZGUuXykgJiYgIUd1bi5pcyh2KSl7XHJcblx0XHRcdFx0XHRcdGF0Lm5vZGUuXyA9IG9ial9jb3B5KHYuXyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRhdC5ub2RlID0gTm9kZS5zb3VsLmlmeShhdC5ub2RlLCBWYWwucmVsLmlzKGF0LnJlbCkpO1xyXG5cdFx0XHRcdFx0YXQucmVsID0gYXQucmVsIHx8IFZhbC5yZWwuaWZ5KE5vZGUuc291bChhdC5ub2RlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKHRtcCA9IGVudi5tYXApe1xyXG5cdFx0XHRcdFx0dG1wLmNhbGwoZW52LmFzIHx8IHt9LCB2LGYsbiwgYXQpO1xyXG5cdFx0XHRcdFx0aWYob2JqX2hhcyhuLGYpKXtcclxuXHRcdFx0XHRcdFx0diA9IG5bZl07XHJcblx0XHRcdFx0XHRcdGlmKHUgPT09IHYpe1xyXG5cdFx0XHRcdFx0XHRcdG9ial9kZWwobiwgZik7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmKCEoaXMgPSB2YWxpZCh2LGYsbiwgYXQsZW52KSkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZighZil7IHJldHVybiBhdC5ub2RlIH1cclxuXHRcdFx0XHRpZih0cnVlID09PSBpcyl7XHJcblx0XHRcdFx0XHRyZXR1cm4gdjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dG1wID0gbm9kZShlbnYsIHtvYmo6IHYsIHBhdGg6IGF0LnBhdGguY29uY2F0KGYpfSk7XHJcblx0XHRcdFx0aWYoIXRtcC5ub2RlKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRyZXR1cm4gdG1wLnJlbDsgLy97JyMnOiBOb2RlLnNvdWwodG1wLm5vZGUpfTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBzb3VsKGlkKXsgdmFyIGF0ID0gdGhpcztcclxuXHRcdFx0XHR2YXIgcHJldiA9IFZhbC5yZWwuaXMoYXQucmVsKSwgZ3JhcGggPSBhdC5lbnYuZ3JhcGg7XHJcblx0XHRcdFx0YXQucmVsID0gYXQucmVsIHx8IFZhbC5yZWwuaWZ5KGlkKTtcclxuXHRcdFx0XHRhdC5yZWxbVmFsLnJlbC5fXSA9IGlkO1xyXG5cdFx0XHRcdGlmKGF0Lm5vZGUgJiYgYXQubm9kZVtOb2RlLl9dKXtcclxuXHRcdFx0XHRcdGF0Lm5vZGVbTm9kZS5fXVtWYWwucmVsLl9dID0gaWQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKG9ial9oYXMoZ3JhcGgsIHByZXYpKXtcclxuXHRcdFx0XHRcdGdyYXBoW2lkXSA9IGdyYXBoW3ByZXZdO1xyXG5cdFx0XHRcdFx0b2JqX2RlbChncmFwaCwgcHJldik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIHZhbGlkKHYsZixuLCBhdCxlbnYpeyB2YXIgdG1wO1xyXG5cdFx0XHRcdGlmKFZhbC5pcyh2KSl7IHJldHVybiB0cnVlIH1cclxuXHRcdFx0XHRpZihvYmpfaXModikpeyByZXR1cm4gMSB9XHJcblx0XHRcdFx0aWYodG1wID0gZW52LmludmFsaWQpe1xyXG5cdFx0XHRcdFx0diA9IHRtcC5jYWxsKGVudi5hcyB8fCB7fSwgdixmLG4pO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHZhbGlkKHYsZixuLCBhdCxlbnYpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbnYuZXJyID0gXCJJbnZhbGlkIHZhbHVlIGF0ICdcIiArIGF0LnBhdGguY29uY2F0KGYpLmpvaW4oJy4nKSArIFwiJyFcIjtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBzZWVuKGVudiwgYXQpe1xyXG5cdFx0XHRcdHZhciBhcnIgPSBlbnYuc2VlbiwgaSA9IGFyci5sZW5ndGgsIGhhcztcclxuXHRcdFx0XHR3aGlsZShpLS0peyBoYXMgPSBhcnJbaV07XHJcblx0XHRcdFx0XHRpZihhdC5vYmogPT09IGhhcy5vYmopeyByZXR1cm4gaGFzIH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YXJyLnB1c2goYXQpO1xyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0R3JhcGgubm9kZSA9IGZ1bmN0aW9uKG5vZGUpe1xyXG5cdFx0XHR2YXIgc291bCA9IE5vZGUuc291bChub2RlKTtcclxuXHRcdFx0aWYoIXNvdWwpeyByZXR1cm4gfVxyXG5cdFx0XHRyZXR1cm4gb2JqX3B1dCh7fSwgc291bCwgbm9kZSk7XHJcblx0XHR9XHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdEdyYXBoLnRvID0gZnVuY3Rpb24oZ3JhcGgsIHJvb3QsIG9wdCl7XHJcblx0XHRcdFx0aWYoIWdyYXBoKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgb2JqID0ge307XHJcblx0XHRcdFx0b3B0ID0gb3B0IHx8IHtzZWVuOiB7fX07XHJcblx0XHRcdFx0b2JqX21hcChncmFwaFtyb290XSwgbWFwLCB7b2JqOm9iaiwgZ3JhcGg6IGdyYXBoLCBvcHQ6IG9wdH0pO1xyXG5cdFx0XHRcdHJldHVybiBvYmo7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbWFwKHYsZil7IHZhciB0bXAsIG9iajtcclxuXHRcdFx0XHRpZihOb2RlLl8gPT09IGYpe1xyXG5cdFx0XHRcdFx0aWYob2JqX2VtcHR5KHYsIFZhbC5yZWwuXykpe1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR0aGlzLm9ialtmXSA9IG9ial9jb3B5KHYpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZighKHRtcCA9IFZhbC5yZWwuaXModikpKXtcclxuXHRcdFx0XHRcdHRoaXMub2JqW2ZdID0gdjtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYob2JqID0gdGhpcy5vcHQuc2Vlblt0bXBdKXtcclxuXHRcdFx0XHRcdHRoaXMub2JqW2ZdID0gb2JqO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLm9ialtmXSA9IHRoaXMub3B0LnNlZW5bdG1wXSA9IEdyYXBoLnRvKHRoaXMuZ3JhcGgsIHRtcCwgdGhpcy5vcHQpO1xyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0dmFyIGZuX2lzID0gVHlwZS5mbi5pcztcclxuXHRcdHZhciBvYmogPSBUeXBlLm9iaiwgb2JqX2lzID0gb2JqLmlzLCBvYmpfZGVsID0gb2JqLmRlbCwgb2JqX2hhcyA9IG9iai5oYXMsIG9ial9lbXB0eSA9IG9iai5lbXB0eSwgb2JqX3B1dCA9IG9iai5wdXQsIG9ial9tYXAgPSBvYmoubWFwLCBvYmpfY29weSA9IG9iai5jb3B5O1xyXG5cdFx0dmFyIHU7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IEdyYXBoO1xyXG5cdH0pKHJlcXVpcmUsICcuL2dyYXBoJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgVHlwZSA9IHJlcXVpcmUoJy4vdHlwZScpO1xyXG5cdFx0ZnVuY3Rpb24gRHVwKCl7XHJcblx0XHRcdHRoaXMuY2FjaGUgPSB7fTtcclxuXHRcdH1cclxuXHRcdER1cC5wcm90b3R5cGUudHJhY2sgPSBmdW5jdGlvbihpZCl7XHJcblx0XHRcdHRoaXMuY2FjaGVbaWRdID0gVHlwZS50aW1lLmlzKCk7XHJcblx0XHRcdGlmICghdGhpcy50bykge1xyXG5cdFx0XHRcdHRoaXMuZ2MoKTsgLy8gRW5nYWdlIEdDLlxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBpZDtcclxuXHRcdH07XHJcblx0XHREdXAucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oaWQpe1xyXG5cdFx0XHQvLyBIYXZlIHdlIHNlZW4gdGhpcyBJRCByZWNlbnRseT9cclxuXHRcdFx0cmV0dXJuIFR5cGUub2JqLmhhcyh0aGlzLmNhY2hlLCBpZCk/IHRoaXMudHJhY2soaWQpIDogZmFsc2U7IC8vIEltcG9ydGFudCwgYnVtcCB0aGUgSUQncyBsaXZlbGluZXNzIGlmIGl0IGhhcyBhbHJlYWR5IGJlZW4gc2VlbiBiZWZvcmUgLSB0aGlzIGlzIGNyaXRpY2FsIHRvIHN0b3BwaW5nIGJyb2FkY2FzdCBzdG9ybXMuXHJcblx0XHR9XHJcblx0XHREdXAucHJvdG90eXBlLmdjID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIGRlID0gdGhpcywgbm93ID0gVHlwZS50aW1lLmlzKCksIG9sZGVzdCA9IG5vdywgbWF4QWdlID0gNSAqIDYwICogMTAwMDtcclxuXHRcdFx0Ly8gVE9ETzogR3VuLnNjaGVkdWxlciBhbHJlYWR5IGRvZXMgdGhpcz8gUmV1c2UgdGhhdC5cclxuXHRcdFx0VHlwZS5vYmoubWFwKGRlLmNhY2hlLCBmdW5jdGlvbih0aW1lLCBpZCl7XHJcblx0XHRcdFx0b2xkZXN0ID0gTWF0aC5taW4obm93LCB0aW1lKTtcclxuXHRcdFx0XHRpZiAoKG5vdyAtIHRpbWUpIDwgbWF4QWdlKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRUeXBlLm9iai5kZWwoZGUuY2FjaGUsIGlkKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHZhciBkb25lID0gVHlwZS5vYmouZW1wdHkoZGUuY2FjaGUpO1xyXG5cdFx0XHRpZihkb25lKXtcclxuXHRcdFx0XHRkZS50byA9IG51bGw7IC8vIERpc2VuZ2FnZSBHQy5cclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIGVsYXBzZWQgPSBub3cgLSBvbGRlc3Q7IC8vIEp1c3QgaG93IG9sZD9cclxuXHRcdFx0dmFyIG5leHRHQyA9IG1heEFnZSAtIGVsYXBzZWQ7IC8vIEhvdyBsb25nIGJlZm9yZSBpdCdzIHRvbyBvbGQ/XHJcblx0XHRcdGRlLnRvID0gc2V0VGltZW91dChmdW5jdGlvbigpeyBkZS5nYygpIH0sIG5leHRHQyk7IC8vIFNjaGVkdWxlIHRoZSBuZXh0IEdDIGV2ZW50LlxyXG5cdFx0fVxyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBEdXA7XHJcblx0fSkocmVxdWlyZSwgJy4vZHVwJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblxyXG5cdFx0ZnVuY3Rpb24gR3VuKG8pe1xyXG5cdFx0XHRpZihvIGluc3RhbmNlb2YgR3VuKXsgcmV0dXJuICh0aGlzLl8gPSB7Z3VuOiB0aGlzfSkuZ3VuIH1cclxuXHRcdFx0aWYoISh0aGlzIGluc3RhbmNlb2YgR3VuKSl7IHJldHVybiBuZXcgR3VuKG8pIH1cclxuXHRcdFx0cmV0dXJuIEd1bi5jcmVhdGUodGhpcy5fID0ge2d1bjogdGhpcywgb3B0OiBvfSk7XHJcblx0XHR9XHJcblxyXG5cdFx0R3VuLmlzID0gZnVuY3Rpb24oZ3VuKXsgcmV0dXJuIChndW4gaW5zdGFuY2VvZiBHdW4pIH1cclxuXHJcblx0XHRHdW4udmVyc2lvbiA9IDAuNjtcclxuXHJcblx0XHRHdW4uY2hhaW4gPSBHdW4ucHJvdG90eXBlO1xyXG5cdFx0R3VuLmNoYWluLnRvSlNPTiA9IGZ1bmN0aW9uKCl7fTtcclxuXHJcblx0XHR2YXIgVHlwZSA9IHJlcXVpcmUoJy4vdHlwZScpO1xyXG5cdFx0VHlwZS5vYmoudG8oVHlwZSwgR3VuKTtcclxuXHRcdEd1bi5IQU0gPSByZXF1aXJlKCcuL0hBTScpO1xyXG5cdFx0R3VuLnZhbCA9IHJlcXVpcmUoJy4vdmFsJyk7XHJcblx0XHRHdW4ubm9kZSA9IHJlcXVpcmUoJy4vbm9kZScpO1xyXG5cdFx0R3VuLnN0YXRlID0gcmVxdWlyZSgnLi9zdGF0ZScpO1xyXG5cdFx0R3VuLmdyYXBoID0gcmVxdWlyZSgnLi9ncmFwaCcpO1xyXG5cdFx0R3VuLmR1cCA9IHJlcXVpcmUoJy4vZHVwJyk7XHJcblx0XHRHdW4ub24gPSByZXF1aXJlKCcuL29uaWZ5JykoKTtcclxuXHRcdFxyXG5cdFx0R3VuLl8gPSB7IC8vIHNvbWUgcmVzZXJ2ZWQga2V5IHdvcmRzLCB0aGVzZSBhcmUgbm90IHRoZSBvbmx5IG9uZXMuXHJcblx0XHRcdG5vZGU6IEd1bi5ub2RlLl8gLy8gYWxsIG1ldGFkYXRhIG9mIGEgbm9kZSBpcyBzdG9yZWQgaW4gdGhlIG1ldGEgcHJvcGVydHkgb24gdGhlIG5vZGUuXHJcblx0XHRcdCxzb3VsOiBHdW4udmFsLnJlbC5fIC8vIGEgc291bCBpcyBhIFVVSUQgb2YgYSBub2RlIGJ1dCBpdCBhbHdheXMgcG9pbnRzIHRvIHRoZSBcImxhdGVzdFwiIGRhdGEga25vd24uXHJcblx0XHRcdCxzdGF0ZTogR3VuLnN0YXRlLl8gLy8gb3RoZXIgdGhhbiB0aGUgc291bCwgd2Ugc3RvcmUgSEFNIG1ldGFkYXRhLlxyXG5cdFx0XHQsZmllbGQ6ICcuJyAvLyBhIGZpZWxkIGlzIGEgcHJvcGVydHkgb24gYSBub2RlIHdoaWNoIHBvaW50cyB0byBhIHZhbHVlLlxyXG5cdFx0XHQsdmFsdWU6ICc9JyAvLyB0aGUgcHJpbWl0aXZlIHZhbHVlLlxyXG5cdFx0fVxyXG5cclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0R3VuLmNyZWF0ZSA9IGZ1bmN0aW9uKGF0KXtcclxuXHRcdFx0XHRhdC5vbiA9IGF0Lm9uIHx8IEd1bi5vbjtcclxuXHRcdFx0XHRhdC5yb290ID0gYXQucm9vdCB8fCBhdC5ndW47XHJcblx0XHRcdFx0YXQuZ3JhcGggPSBhdC5ncmFwaCB8fCB7fTtcclxuXHRcdFx0XHRhdC5kdXAgPSBhdC5kdXAgfHwgbmV3IEd1bi5kdXA7XHJcblx0XHRcdFx0YXQuYXNrID0gR3VuLm9uLmFzaztcclxuXHRcdFx0XHRhdC5hY2sgPSBHdW4ub24uYWNrO1xyXG5cdFx0XHRcdHZhciBndW4gPSBhdC5ndW4ub3B0KGF0Lm9wdCk7XHJcblx0XHRcdFx0aWYoIWF0Lm9uY2Upe1xyXG5cdFx0XHRcdFx0YXQub24oJ2luJywgcm9vdCwgYXQpO1xyXG5cdFx0XHRcdFx0YXQub24oJ291dCcsIHJvb3QsIGF0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YXQub25jZSA9IDE7XHJcblx0XHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiByb290KGF0KXtcclxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiYWRkIHRvLm5leHQoYXQpXCIpOyAvLyBUT0RPOiBCVUchISFcclxuXHRcdFx0XHR2YXIgZXYgPSB0aGlzLCBjYXQgPSBldi5hcywgY29hdDtcclxuXHRcdFx0XHRpZighYXQuZ3VuKXsgYXQuZ3VuID0gY2F0Lmd1biB9XHJcblx0XHRcdFx0aWYoIWF0WycjJ10gJiYgYXRbJ0AnXSl7XHJcblx0XHRcdFx0XHRhdFsnIyddID0gR3VuLnRleHQucmFuZG9tKCk7IC8vIFRPRE86IFVzZSB3aGF0IGlzIHVzZWQgb3RoZXIgcGxhY2VzIGluc3RlYWQuXHJcblx0XHRcdFx0XHQvLyBUT0RPOiBCVUchIEZvciBtdWx0aS1pbnN0YW5jZXMsIHRoZSBcImFja1wiIHN5c3RlbSBpcyBnbG9iYWxseSBzaGFyZWQsIGJ1dCBpdCBzaG91bGRuJ3QgYmUuIFxyXG5cdFx0XHRcdFx0aWYoY2F0LmFjayhhdFsnQCddLCBhdCkpeyByZXR1cm4gfSAvLyBUT0RPOiBDb25zaWRlciBub3QgcmV0dXJuaW5nIGhlcmUsIG1heWJlLCB3aGVyZSB0aGlzIHdvdWxkIGxldCB0aGUgXCJoYW5kc2hha2VcIiBvbiBzeW5jIG9jY3VyIGZvciBIb2x5IEdyYWlsP1xyXG5cdFx0XHRcdFx0Y2F0LmR1cC50cmFjayhhdFsnIyddKTtcclxuXHRcdFx0XHRcdEd1bi5vbignb3V0Jywgb2JqX3RvKGF0LCB7Z3VuOiBjYXQuZ3VufSkpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihhdFsnIyddICYmIGNhdC5kdXAuY2hlY2soYXRbJyMnXSkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGNhdC5kdXAudHJhY2soYXRbJyMnXSk7XHJcblx0XHRcdFx0aWYoY2F0LmFjayhhdFsnQCddLCBhdCkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdC8vY2F0LmFjayhhdFsnQCddLCBhdCk7XHJcblx0XHRcdFx0Y29hdCA9IG9ial90byhhdCwge2d1bjogY2F0Lmd1bn0pO1xyXG5cdFx0XHRcdGlmKGF0LmdldCl7XHJcblx0XHRcdFx0XHRpZighZ2V0KGF0LCBjYXQpKXtcclxuXHRcdFx0XHRcdFx0R3VuLm9uKCdnZXQnLCBjb2F0KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoYXQucHV0KXtcclxuXHRcdFx0XHRcdEd1bi5IQU0uc3ludGgoYXQsIGV2LCBjYXQuZ3VuKTsgLy8gVE9ETzogQ2xlYW4gdXAsIGp1c3QgbWFrZSBpdCBwYXJ0IG9mIG9uKCdwdXQnKSFcclxuXHRcdFx0XHRcdEd1bi5vbigncHV0JywgY29hdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdEd1bi5vbignb3V0JywgY29hdCk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gZ2V0KGF0LCBjYXQpe1xyXG5cdFx0XHRcdHZhciBzb3VsID0gYXQuZ2V0W19zb3VsXSwgbm9kZSA9IGNhdC5ncmFwaFtzb3VsXSwgZmllbGQgPSBhdC5nZXRbX2ZpZWxkXSwgdG1wO1xyXG5cdFx0XHRcdHZhciBuZXh0ID0gY2F0Lm5leHQgfHwgKGNhdC5uZXh0ID0ge30pLCBhcyA9IC8qKGF0Lmd1bnx8ZW1wdHkpLl8gfHwqLyAobmV4dFtzb3VsXSB8fCAobmV4dFtzb3VsXSA9IGNhdC5ndW4uZ2V0KHNvdWwpKSkuXztcclxuXHRcdFx0XHRpZighbm9kZSl7IHJldHVybiB9XHJcblx0XHRcdFx0aWYoZmllbGQpe1xyXG5cdFx0XHRcdFx0aWYoIW9ial9oYXMobm9kZSwgZmllbGQpKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdHRtcCA9IEd1bi5vYmoucHV0KEd1bi5ub2RlLnNvdWwuaWZ5KHt9LCBzb3VsKSwgZmllbGQsIG5vZGVbZmllbGRdKTtcclxuXHRcdFx0XHRcdG5vZGUgPSBHdW4uc3RhdGUuaWZ5KHRtcCwgZmllbGQsIEd1bi5zdGF0ZS5pcyhub2RlLCBmaWVsZCkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvL2lmKGF0Lmd1biA9PT0gY2F0Lmd1bil7XHJcblx0XHRcdFx0XHRub2RlID0gR3VuLmdyYXBoLm5vZGUobm9kZSk7IC8vIFRPRE86IEJVRyEgQ2xvbmUgbm9kZT9cclxuXHRcdFx0XHQvL30gZWxzZSB7XHJcblx0XHRcdFx0Ly9cdGNhdCA9IChhdC5ndW4uXyk7XHJcblx0XHRcdFx0Ly99XHJcblx0XHRcdFx0dG1wID0gYXMuYWNrO1xyXG5cdFx0XHRcdGNhdC5vbignaW4nLCB7XHJcblx0XHRcdFx0XHQnQCc6IGF0WycjJ10sXHJcblx0XHRcdFx0XHRob3c6ICdtZW0nLFxyXG5cdFx0XHRcdFx0cHV0OiBub2RlLFxyXG5cdFx0XHRcdFx0Z3VuOiBhcy5ndW5cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRpZigwIDwgdG1wKXtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdFxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRHdW4ub24uYXNrID0gZnVuY3Rpb24oY2IsIGFzKXtcclxuXHRcdFx0XHRpZighdGhpcy5vbil7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIGlkID0gR3VuLnRleHQucmFuZG9tKCk7XHJcblx0XHRcdFx0aWYoY2IpeyB0aGlzLm9uKGlkLCBjYiwgYXMpIH1cclxuXHRcdFx0XHRyZXR1cm4gaWQ7XHJcblx0XHRcdH1cclxuXHRcdFx0R3VuLm9uLmFjayA9IGZ1bmN0aW9uKGF0LCByZXBseSl7XHJcblx0XHRcdFx0aWYoIWF0IHx8ICFyZXBseSB8fCAhdGhpcy5vbil7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIGlkID0gYXRbJyMnXSB8fCBhdDtcclxuXHRcdFx0XHRpZighdGhpcy50YWcgfHwgIXRoaXMudGFnW2lkXSl7IHJldHVybiB9XHJcblx0XHRcdFx0dGhpcy5vbihpZCwgcmVwbHkpO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0R3VuLmNoYWluLm9wdCA9IGZ1bmN0aW9uKG9wdCl7XHJcblx0XHRcdFx0b3B0ID0gb3B0IHx8IHt9O1xyXG5cdFx0XHRcdHZhciBndW4gPSB0aGlzLCBhdCA9IGd1bi5fLCB0bXAgPSBvcHQucGVlcnMgfHwgb3B0O1xyXG5cdFx0XHRcdGlmKCFvYmpfaXMob3B0KSl7IG9wdCA9IHt9IH1cclxuXHRcdFx0XHRpZighb2JqX2lzKGF0Lm9wdCkpeyBhdC5vcHQgPSBvcHQgfVxyXG5cdFx0XHRcdGlmKHRleHRfaXModG1wKSl7IHRtcCA9IFt0bXBdIH1cclxuXHRcdFx0XHRpZihsaXN0X2lzKHRtcCkpe1xyXG5cdFx0XHRcdFx0dG1wID0gb2JqX21hcCh0bXAsIGZ1bmN0aW9uKHVybCwgaSwgbWFwKXtcclxuXHRcdFx0XHRcdFx0bWFwKHVybCwge3VybDogdXJsfSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdGlmKCFvYmpfaXMoYXQub3B0LnBlZXJzKSl7IGF0Lm9wdC5wZWVycyA9IHt9fVxyXG5cdFx0XHRcdFx0YXQub3B0LnBlZXJzID0gb2JqX3RvKHRtcCwgYXQub3B0LnBlZXJzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YXQub3B0LndzYyA9IGF0Lm9wdC53c2MgfHwge3Byb3RvY29sczpudWxsfSBcclxuXHRcdFx0XHRhdC5vcHQucGVlcnMgPSBhdC5vcHQucGVlcnMgfHwge307XHJcblx0XHRcdFx0b2JqX3RvKG9wdCwgYXQub3B0KTsgLy8gY29waWVzIG9wdGlvbnMgb24gdG8gYGF0Lm9wdGAgb25seSBpZiBub3QgYWxyZWFkeSB0YWtlbi5cclxuXHRcdFx0XHRHdW4ub24oJ29wdCcsIGF0KTtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cclxuXHRcdHZhciB0ZXh0X2lzID0gR3VuLnRleHQuaXM7XHJcblx0XHR2YXIgbGlzdF9pcyA9IEd1bi5saXN0LmlzO1xyXG5cdFx0dmFyIG9iaiA9IEd1bi5vYmosIG9ial9pcyA9IG9iai5pcywgb2JqX2hhcyA9IG9iai5oYXMsIG9ial90byA9IG9iai50bywgb2JqX21hcCA9IG9iai5tYXA7XHJcblx0XHR2YXIgX3NvdWwgPSBHdW4uXy5zb3VsLCBfZmllbGQgPSBHdW4uXy5maWVsZDtcclxuXHRcdC8vdmFyIHU7XHJcblxyXG5cdFx0Y29uc29sZS5kZWJ1ZyA9IGZ1bmN0aW9uKGksIHMpeyByZXR1cm4gKGNvbnNvbGUuZGVidWcuaSAmJiBpID09PSBjb25zb2xlLmRlYnVnLmkgJiYgY29uc29sZS5kZWJ1Zy5pKyspICYmIChjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpIHx8IHMpIH07XHJcblxyXG5cdFx0R3VuLmxvZyA9IGZ1bmN0aW9uKCl7IHJldHVybiAoIUd1bi5sb2cub2ZmICYmIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cykpLCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykuam9pbignICcpIH1cclxuXHRcdEd1bi5sb2cub25jZSA9IGZ1bmN0aW9uKHcscyxvKXsgcmV0dXJuIChvID0gR3VuLmxvZy5vbmNlKVt3XSA9IG9bd10gfHwgMCwgb1t3XSsrIHx8IEd1bi5sb2cocykgfVxyXG5cclxuXHRcdC8qIFBsZWFzZSBkbyBub3QgcmVtb3ZlIHRoZXNlIG1lc3NhZ2VzIHVubGVzcyB5b3UgYXJlIHBheWluZyBmb3IgYSBtb250aGx5IHNwb25zb3JzaGlwLCB0aGFua3MhICovXHJcblx0XHRHdW4ubG9nLm9uY2UoXCJ3ZWxjb21lXCIsIFwiSGVsbG8gd29uZGVyZnVsIHBlcnNvbiEgOikgVGhhbmtzIGZvciB1c2luZyBHVU4sIGZlZWwgZnJlZSB0byBhc2sgZm9yIGhlbHAgb24gaHR0cHM6Ly9naXR0ZXIuaW0vYW1hcmsvZ3VuIGFuZCBhc2sgU3RhY2tPdmVyZmxvdyBxdWVzdGlvbnMgdGFnZ2VkIHdpdGggJ2d1bichXCIpO1xyXG5cdFx0LyogUGxlYXNlIGRvIG5vdCByZW1vdmUgdGhlc2UgbWVzc2FnZXMgdW5sZXNzIHlvdSBhcmUgcGF5aW5nIGZvciBhIG1vbnRobHkgc3BvbnNvcnNoaXAsIHRoYW5rcyEgKi9cclxuXHRcdFxyXG5cdFx0aWYodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIil7IHdpbmRvdy5HdW4gPSBHdW4gfVxyXG5cdFx0aWYodHlwZW9mIGNvbW1vbiAhPT0gXCJ1bmRlZmluZWRcIil7IGNvbW1vbi5leHBvcnRzID0gR3VuIH1cclxuXHRcdG1vZHVsZS5leHBvcnRzID0gR3VuO1xyXG5cdH0pKHJlcXVpcmUsICcuL3Jvb3QnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHJldHVybjtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL3Jvb3QnKTtcclxuXHRcdHZhciBvbnRvID0gcmVxdWlyZSgnLi9vbnRvJyk7XHJcblx0XHRmdW5jdGlvbiBDaGFpbihiYWNrKXtcclxuXHRcdFx0dmFyIGF0ID0gdGhpcy5fID0ge2JhY2s6IGJhY2ssIG9uOiBvbnRvLCAkOiB0aGlzLCBuZXh0OiB7fX07XHJcblx0XHRcdGF0LnJvb3QgPSBiYWNrPyBiYWNrLnJvb3QgOiBhdDtcclxuXHRcdFx0YXQub24oJ2luJywgaW5wdXQsIGF0KTtcclxuXHRcdFx0YXQub24oJ291dCcsIG91dHB1dCwgYXQpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIGNoYWluID0gQ2hhaW4ucHJvdG90eXBlO1xyXG5cdFx0Y2hhaW4uYmFjayA9IGZ1bmN0aW9uKGFyZyl7IHZhciB0bXA7XHJcblx0XHRcdGlmKHRtcCA9IHRoaXMuXy5iYWNrKXtcclxuXHRcdFx0XHRyZXR1cm4gdG1wLiQ7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGNoYWluLm5leHQgPSBmdW5jdGlvbihhcmcpe1xyXG5cdFx0XHR2YXIgYXQgPSB0aGlzLl8sIGNhdDtcclxuXHRcdFx0aWYoY2F0ID0gYXQubmV4dFthcmddKXtcclxuXHRcdFx0XHRyZXR1cm4gY2F0LiQ7XHJcblx0XHRcdH1cclxuXHRcdFx0Y2F0ID0gKG5ldyBDaGFpbihhdCkuXyk7XHJcblx0XHRcdGF0Lm5leHRbYXJnXSA9IGNhdDtcclxuXHRcdFx0Y2F0LmtleSA9IGFyZztcclxuXHRcdFx0cmV0dXJuIGNhdC4kO1xyXG5cdFx0fVxyXG5cdFx0Y2hhaW4uZ2V0ID0gZnVuY3Rpb24oYXJnKXtcclxuXHRcdFx0aWYodHlwZW9mIGFyZyA9PSAnc3RyaW5nJyl7XHJcblx0XHRcdFx0dmFyIGF0ID0gdGhpcy5fLCBjYXQ7XHJcblx0XHRcdFx0aWYoY2F0ID0gYXQubmV4dFthcmddKXtcclxuXHRcdFx0XHRcdHJldHVybiBjYXQuJDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2F0ID0gKHRoaXMubmV4dChhcmcpLl8pO1xyXG5cdFx0XHRcdGlmKGF0LmdldCB8fCBhdCA9PT0gYXQucm9vdCl7XHJcblx0XHRcdFx0XHRjYXQuZ2V0ID0gYXJnO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gY2F0LiQ7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFyIGF0ID0gdGhpcy5fO1xyXG5cdFx0XHRcdHZhciBvdXQgPSB7JyMnOiBHdW4udGV4dC5yYW5kb20oKSwgZ2V0OiB7fSwgY2FwOiAxfTtcclxuXHRcdFx0XHR2YXIgdG8gPSBhdC5yb290Lm9uKG91dFsnIyddLCBnZXQsIHtuZXh0OiBhcmd9KVxyXG5cdFx0XHRcdGF0Lm9uKCdpbicsIGdldCwgdG8pO1xyXG5cdFx0XHRcdGF0Lm9uKCdvdXQnLCBvdXQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gZ2V0KGVudil7XHJcblx0XHRcdHZhciBhcyA9IHRoaXMuYXM7XHJcblx0XHRcdGlmKGFzLm5leHQpe1xyXG5cdFx0XHRcdGFzLm5leHQoZW52LCB0aGlzKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Y2hhaW4ubWFwID0gZnVuY3Rpb24oY2Ipe1xyXG5cdFx0XHR2YXIgYXQgPSB0aGlzLl87XHJcblx0XHRcdHZhciBjaGFpbiA9IG5ldyBDaGFpbihhdCk7XHJcblx0XHRcdHZhciBjYXQgPSBjaGFpbi5fO1xyXG5cdFx0XHR2YXIgdTtcclxuXHRcdFx0YXQub24oJ2luJywgZnVuY3Rpb24oZW52KXsgdmFyIHRtcDtcclxuXHRcdFx0XHRpZighZW52KXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgY2F0ID0gdGhpcy5hcztcclxuXHRcdFx0XHR2YXIgdG8gPSB0aGlzLnRvO1xyXG5cdFx0XHRcdGlmKHRtcCA9IGVudi5wdXQpe1xyXG5cdFx0XHRcdFx0dG8ubmV4dChlbnYpO1xyXG5cdFx0XHRcdFx0R3VuLm9iai5tYXAodG1wLCBmdW5jdGlvbihkYXRhLCBrZXkpe1xyXG5cdFx0XHRcdFx0XHRpZignXycgPT0ga2V5KXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdFx0aWYoY2Ipe1xyXG5cdFx0XHRcdFx0XHRcdGRhdGEgPSBjYihkYXRhLCBrZXkpO1xyXG5cdFx0XHRcdFx0XHRcdGlmKHUgPT09IGRhdGEpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGNhdC5vbignaW4nLCBHdW4ub2JqLnRvKGVudiwge3B1dDogZGF0YX0pKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgY2F0KTtcclxuXHRcdFx0cmV0dXJuIGNoYWluO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gaW5wdXQoZW52KXsgdmFyIHRtcDtcclxuXHRcdFx0aWYoIWVudil7IHJldHVybiB9XHJcblx0XHRcdHZhciBjYXQgPSB0aGlzLmFzO1xyXG5cdFx0XHR2YXIgdG8gPSB0aGlzLnRvO1xyXG5cdFx0XHRpZih0bXAgPSBlbnYucHV0KXtcclxuXHRcdFx0XHRpZih0bXAgJiYgdG1wWycjJ10gJiYgKHRtcCA9IEd1bi52YWwucmVsLmlzKHRtcCkpKXtcclxuXHRcdFx0XHRcdC8vaW5wdXQuY2FsbCh0aGlzLCBHdW4ub2JqLnRvKGVudiwge3B1dDogY2F0LnJvb3QucHV0W3RtcF19KSk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhdC5wdXQgPSB0bXA7XHJcblx0XHRcdFx0dG8ubmV4dChlbnYpO1xyXG5cdFx0XHRcdHZhciBuZXh0ID0gY2F0Lm5leHQ7XHJcblx0XHRcdFx0R3VuLm9iai5tYXAodG1wLCBmdW5jdGlvbihkYXRhLCBrZXkpe1xyXG5cdFx0XHRcdFx0aWYoIShrZXkgPSBuZXh0W2tleV0pKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdGtleS5vbignaW4nLCBHdW4ub2JqLnRvKGVudiwge3B1dDogZGF0YX0pKVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBvdXRwdXQoZW52KXsgdmFyIHRtcDtcclxuXHRcdFx0dmFyIHU7XHJcblx0XHRcdGlmKCFlbnYpeyByZXR1cm4gfVxyXG5cdFx0XHR2YXIgY2F0ID0gdGhpcy5hcztcclxuXHRcdFx0dmFyIHRvID0gdGhpcztcclxuXHRcdFx0aWYoIWNhdC5iYWNrKXtcclxuXHRcdFx0XHRlbnYudGVzdCA9IHRydWU7XHJcblx0XHRcdFx0ZW52Lmd1biA9IGNhdC5yb290LiQ7XHJcblx0XHRcdFx0R3VuLm9uKCdvdXQnLCBlbnYpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih0bXAgPSBlbnYuZ2V0KXtcclxuXHRcdFx0XHRpZihjYXQuZ2V0KXtcclxuXHRcdFx0XHRcdGVudiA9IEd1bi5vYmoudG8oZW52LCB7Z2V0OiB7JyMnOiBjYXQuZ2V0LCAnLic6IHRtcH19KTtcclxuXHRcdFx0XHR9IGVsc2VcclxuXHRcdFx0XHRpZihjYXQua2V5KXtcclxuXHRcdFx0XHRcdGVudiA9IEd1bi5vYmoudG8oZW52LCB7Z2V0OiBHdW4ub2JqLnB1dCh7fSwgY2F0LmtleSwgdG1wKX0pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRlbnYgPSBHdW4ub2JqLnRvKGVudiwge2dldDogeycqJzogdG1wfX0pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGNhdC5iYWNrLm9uKCdvdXQnLCBlbnYpO1xyXG5cdFx0fVxyXG5cdFx0Y2hhaW4udmFsID0gZnVuY3Rpb24oY2IsIG9wdCl7XHJcblx0XHRcdHZhciBhdCA9IHRoaXMuXztcclxuXHRcdFx0aWYoY2Ipe1xyXG5cdFx0XHRcdGlmKG9wdCl7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmKGF0LnZhbCl7XHJcblx0XHRcdFx0XHRcdGNiKGF0LnB1dCwgYXQuZ2V0LCBhdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMuZ2V0KGZ1bmN0aW9uKGVudiwgZXYpe1xyXG5cdFx0XHRcdFx0Y2IoZW52LnB1dCwgZW52LmdldCwgZW52KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHJcblxyXG5cclxuXHRcdHZhciBncmFwaCA9IHtcclxuXHRcdFx0XHRhcHA6IHtfOnsnIyc6J2FwcCd9LFxyXG5cdFx0XHRcdFx0Zm9vOiB7Xzp7JyMnOidmb28nfSxcclxuXHRcdFx0XHRcdFx0YmFyOiB7JyMnOiAnYXNkZid9LFxyXG5cdFx0XHRcdFx0XHRyYWI6IHsnIyc6ICdmZHNhJ31cclxuXHRcdFx0XHRcdH0vKixcclxuXHRcdFx0XHRcdG9vZjoge186eycjJzonb29mJ30sXHJcblx0XHRcdFx0XHRcdGJhcjoge2JhdDogXCJyZWFsbHlcIn0sXHJcblx0XHRcdFx0XHRcdHJhYjoge2JhdDogXCJuaWNlIVwifVxyXG5cdFx0XHRcdFx0fSovXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRhc2RmOiB7Xzp7JyMnOiAnYXNkZid9LCBiYXo6IFwiaGVsbG8gd29ybGQhXCJ9LFxyXG5cdFx0XHRcdGZkc2E6IHtfOnsnIyc6ICdmZHNhJ30sIGJhejogXCJ3b3JsZCBoZWxsbyFcIn1cclxuXHRcdFx0fVxyXG5cdFx0R3VuLm9uKCdvdXQnLCBmdW5jdGlvbihlbnYpe1xyXG5cdFx0XHRpZighZW52LnRlc3QpeyByZXR1cm4gfVxyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJyZXBseVwiLCBlbnYuZ2V0KTtcclxuXHRcdFx0XHRlbnYuZ3VuLl8ub24oJ2luJywgeydAJzogZW52WycjJ10sXHJcblx0XHRcdFx0XHRwdXQ6IEd1bi5ncmFwaC5ub2RlKGdyYXBoW2Vudi5nZXRbJyMnXV0pXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdGVudi5ndW4uXy5vbignaW4nLCB7cHV0OiBncmFwaCwgJ0AnOiBlbnZbJyMnXX0pO1xyXG5cdFx0XHR9LDEwMCk7XHJcblx0XHR9KTtcclxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHJcblx0XHRcdC8vdmFyIGMgPSBuZXcgQ2hhaW4oKSwgdTtcclxuXHRcdFx0Ly9jLmdldCgnYXBwJykubWFwKCkubWFwKHggPT4geC5iYXQ/IHtiYXo6IHguYmF0fSA6IHUpLmdldCgnYmF6JykudmFsKGZ1bmN0aW9uKGRhdGEsIGtleSwgZW52KXtcclxuXHRcdFx0Ly9cdGNvbnNvbGUubG9nKFwiZW52ZWxvcGVcIiwgZW52KTtcclxuXHRcdFx0Ly99KTtcclxuXHJcblx0XHR9LDEwMDApO1xyXG5cclxuXHR9KShyZXF1aXJlLCAnLi9leHBlcmltZW50Jyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9yb290Jyk7XHJcblx0XHRHdW4uY2hhaW4uYmFjayA9IGZ1bmN0aW9uKG4sIG9wdCl7IHZhciB0bXA7XHJcblx0XHRcdGlmKC0xID09PSBuIHx8IEluZmluaXR5ID09PSBuKXtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5fLnJvb3Q7XHJcblx0XHRcdH0gZWxzZVxyXG5cdFx0XHRpZigxID09PSBuKXtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5fLmJhY2sgfHwgdGhpcztcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgZ3VuID0gdGhpcywgYXQgPSBndW4uXztcclxuXHRcdFx0aWYodHlwZW9mIG4gPT09ICdzdHJpbmcnKXtcclxuXHRcdFx0XHRuID0gbi5zcGxpdCgnLicpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKG4gaW5zdGFuY2VvZiBBcnJheSl7XHJcblx0XHRcdFx0dmFyIGkgPSAwLCBsID0gbi5sZW5ndGgsIHRtcCA9IGF0O1xyXG5cdFx0XHRcdGZvcihpOyBpIDwgbDsgaSsrKXtcclxuXHRcdFx0XHRcdHRtcCA9ICh0bXB8fGVtcHR5KVtuW2ldXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYodSAhPT0gdG1wKXtcclxuXHRcdFx0XHRcdHJldHVybiBvcHQ/IGd1biA6IHRtcDtcclxuXHRcdFx0XHR9IGVsc2VcclxuXHRcdFx0XHRpZigodG1wID0gYXQuYmFjaykpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRtcC5iYWNrKG4sIG9wdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihuIGluc3RhbmNlb2YgRnVuY3Rpb24pe1xyXG5cdFx0XHRcdHZhciB5ZXMsIHRtcCA9IHtiYWNrOiBndW59O1xyXG5cdFx0XHRcdHdoaWxlKCh0bXAgPSB0bXAuYmFjaylcclxuXHRcdFx0XHQmJiAodG1wID0gdG1wLl8pXHJcblx0XHRcdFx0JiYgISh5ZXMgPSBuKHRtcCwgb3B0KSkpe31cclxuXHRcdFx0XHRyZXR1cm4geWVzO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR2YXIgZW1wdHkgPSB7fSwgdTtcclxuXHR9KShyZXF1aXJlLCAnLi9iYWNrJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9yb290Jyk7XHJcblx0XHRHdW4uY2hhaW4uY2hhaW4gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgYXQgPSB0aGlzLl8sIGNoYWluID0gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcyksIGNhdCA9IGNoYWluLl87XHJcblx0XHRcdGNhdC5yb290ID0gcm9vdCA9IGF0LnJvb3Q7XHJcblx0XHRcdGNhdC5pZCA9ICsrcm9vdC5fLm9uY2U7XHJcblx0XHRcdGNhdC5iYWNrID0gdGhpcztcclxuXHRcdFx0Y2F0Lm9uID0gR3VuLm9uO1xyXG5cdFx0XHRHdW4ub24oJ2NoYWluJywgY2F0KTtcclxuXHRcdFx0Y2F0Lm9uKCdpbicsIGlucHV0LCBjYXQpOyAvLyBGb3IgJ2luJyBpZiBJIGFkZCBteSBvd24gbGlzdGVuZXJzIHRvIGVhY2ggdGhlbiBJIE1VU1QgZG8gaXQgYmVmb3JlIGluIGdldHMgY2FsbGVkLiBJZiBJIGxpc3RlbiBnbG9iYWxseSBmb3IgYWxsIGluY29taW5nIGRhdGEgaW5zdGVhZCB0aG91Z2gsIHJlZ2FyZGxlc3Mgb2YgaW5kaXZpZHVhbCBsaXN0ZW5lcnMsIEkgY2FuIHRyYW5zZm9ybSB0aGUgZGF0YSB0aGVyZSBhbmQgdGhlbiBhcyB3ZWxsLlxyXG5cdFx0XHRjYXQub24oJ291dCcsIG91dHB1dCwgY2F0KTsgLy8gSG93ZXZlciBmb3Igb3V0cHV0LCB0aGVyZSBpc24ndCByZWFsbHkgdGhlIGdsb2JhbCBvcHRpb24uIEkgbXVzdCBsaXN0ZW4gYnkgYWRkaW5nIG15IG93biBsaXN0ZW5lciBpbmRpdmlkdWFsbHkgQkVGT1JFIHRoaXMgb25lIGlzIGV2ZXIgY2FsbGVkLlxyXG5cdFx0XHRyZXR1cm4gY2hhaW47XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBvdXRwdXQoYXQpe1xyXG5cdFx0XHR2YXIgY2F0ID0gdGhpcy5hcywgZ3VuID0gY2F0Lmd1biwgcm9vdCA9IGd1bi5iYWNrKC0xKSwgcHV0LCBnZXQsIG5vdywgdG1wO1xyXG5cdFx0XHRpZighYXQuZ3VuKXtcclxuXHRcdFx0XHRhdC5ndW4gPSBndW47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoZ2V0ID0gYXQuZ2V0KXtcclxuXHRcdFx0XHRpZighZ2V0W19zb3VsXSl7XHJcblx0XHRcdFx0XHRpZihvYmpfaGFzKGdldCwgX2ZpZWxkKSl7XHJcblx0XHRcdFx0XHRcdGdldCA9IGdldFtfZmllbGRdO1xyXG5cdFx0XHRcdFx0XHR2YXIgbmV4dCA9IGdldD8gKGd1bi5nZXQoZ2V0KS5fKSA6IGNhdDtcclxuXHRcdFx0XHRcdFx0Ly8gVE9ETzogQlVHISBIYW5kbGUgcGx1cmFsIGNoYWlucyBieSBpdGVyYXRpbmcgb3ZlciB0aGVtLlxyXG5cdFx0XHRcdFx0XHRpZihvYmpfaGFzKG5leHQsICdwdXQnKSl7IC8vIHBvdGVudGlhbGx5IGluY29ycmVjdD8gTWF5YmU/XHJcblx0XHRcdFx0XHRcdC8vaWYodSAhPT0gbmV4dC5wdXQpeyAvLyBwb3RlbnRpYWxseSBpbmNvcnJlY3Q/IE1heWJlP1xyXG5cdFx0XHRcdFx0XHRcdC8vbmV4dC50YWdbJ2luJ10ubGFzdC5uZXh0KG5leHQpO1xyXG5cdFx0XHRcdFx0XHRcdG5leHQub24oJ2luJywgbmV4dCk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmKG9ial9oYXMoY2F0LCAncHV0Jykpe1xyXG5cdFx0XHRcdFx0XHQvL2lmKHUgIT09IGNhdC5wdXQpe1xyXG5cdFx0XHRcdFx0XHRcdHZhciB2YWwgPSBjYXQucHV0LCByZWw7XHJcblx0XHRcdFx0XHRcdFx0aWYocmVsID0gR3VuLm5vZGUuc291bCh2YWwpKXtcclxuXHRcdFx0XHRcdFx0XHRcdHZhbCA9IEd1bi52YWwucmVsLmlmeShyZWwpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRpZihyZWwgPSBHdW4udmFsLnJlbC5pcyh2YWwpKXtcclxuXHRcdFx0XHRcdFx0XHRcdGlmKCFhdC5ndW4uXyl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRcdFx0XHQoYXQuZ3VuLl8pLm9uKCdvdXQnLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGdldDogeycjJzogcmVsLCAnLic6IGdldH0sXHJcblx0XHRcdFx0XHRcdFx0XHRcdCcjJzogcm9vdC5fLmFzayhHdW4uSEFNLnN5bnRoLCBhdC5ndW4pLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRndW46IGF0Lmd1blxyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGlmKHUgPT09IHZhbCB8fCBHdW4udmFsLmlzKHZhbCkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYoIWF0Lmd1bi5fKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdFx0XHRcdChhdC5ndW4uXykub24oJ2luJywge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRnZXQ6IGdldCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0Z3VuOiBhdC5ndW5cclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSBlbHNlXHJcblx0XHRcdFx0XHRcdGlmKGNhdC5tYXApe1xyXG5cdFx0XHRcdFx0XHRcdG9ial9tYXAoY2F0Lm1hcCwgZnVuY3Rpb24ocHJveHkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0cHJveHkuYXQub24oJ2luJywgcHJveHkuYXQpO1xyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmKGNhdC5zb3VsKXtcclxuXHRcdFx0XHRcdFx0XHRpZighYXQuZ3VuLl8peyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0XHRcdChhdC5ndW4uXykub24oJ291dCcsIHtcclxuXHRcdFx0XHRcdFx0XHRcdGdldDogeycjJzogY2F0LnNvdWwsICcuJzogZ2V0fSxcclxuXHRcdFx0XHRcdFx0XHRcdCcjJzogcm9vdC5fLmFzayhHdW4uSEFNLnN5bnRoLCBhdC5ndW4pLFxyXG5cdFx0XHRcdFx0XHRcdFx0Z3VuOiBhdC5ndW5cclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYoY2F0LmdldCl7XHJcblx0XHRcdFx0XHRcdFx0aWYoIWNhdC5iYWNrLl8peyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0XHRcdChjYXQuYmFjay5fKS5vbignb3V0Jywge1xyXG5cdFx0XHRcdFx0XHRcdFx0Z2V0OiBvYmpfcHV0KHt9LCBfZmllbGQsIGNhdC5nZXQpLFxyXG5cdFx0XHRcdFx0XHRcdFx0Z3VuOiBndW5cclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YXQgPSBvYmpfdG8oYXQsIHtnZXQ6IHt9fSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZihvYmpfaGFzKGNhdCwgJ3B1dCcpKXtcclxuXHRcdFx0XHRcdFx0Ly9pZih1ICE9PSBjYXQucHV0KXtcclxuXHRcdFx0XHRcdFx0XHRjYXQub24oJ2luJywgY2F0KTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlXHJcblx0XHRcdFx0XHRcdGlmKGNhdC5tYXApe1xyXG5cdFx0XHRcdFx0XHRcdG9ial9tYXAoY2F0Lm1hcCwgZnVuY3Rpb24ocHJveHkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0cHJveHkuYXQub24oJ2luJywgcHJveHkuYXQpO1xyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmKGNhdC5hY2spe1xyXG5cdFx0XHRcdFx0XHRcdGlmKCFvYmpfaGFzKGNhdCwgJ3B1dCcpKXsgLy8gdSAhPT0gY2F0LnB1dCBpbnN0ZWFkP1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRjYXQuYWNrID0gLTE7XHJcblx0XHRcdFx0XHRcdGlmKGNhdC5zb3VsKXtcclxuXHRcdFx0XHRcdFx0XHRjYXQub24oJ291dCcsIHtcclxuXHRcdFx0XHRcdFx0XHRcdGdldDogeycjJzogY2F0LnNvdWx9LFxyXG5cdFx0XHRcdFx0XHRcdFx0JyMnOiByb290Ll8uYXNrKEd1bi5IQU0uc3ludGgsIGNhdC5ndW4pLFxyXG5cdFx0XHRcdFx0XHRcdFx0Z3VuOiBjYXQuZ3VuXHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmKGNhdC5nZXQpe1xyXG5cdFx0XHRcdFx0XHRcdGlmKCFjYXQuYmFjay5fKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdFx0XHQoY2F0LmJhY2suXykub24oJ291dCcsIHtcclxuXHRcdFx0XHRcdFx0XHRcdGdldDogb2JqX3B1dCh7fSwgX2ZpZWxkLCBjYXQuZ2V0KSxcclxuXHRcdFx0XHRcdFx0XHRcdGd1bjogY2F0Lmd1blxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQoY2F0LmJhY2suXykub24oJ291dCcsIGF0KTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIGlucHV0KGF0KXtcclxuXHRcdFx0YXQgPSBhdC5fIHx8IGF0O1xyXG5cdFx0XHR2YXIgZXYgPSB0aGlzLCBjYXQgPSB0aGlzLmFzLCBndW4gPSBhdC5ndW4sIGNvYXQgPSBndW4uXywgY2hhbmdlID0gYXQucHV0LCBiYWNrID0gY2F0LmJhY2suXyB8fCBlbXB0eSwgcmVsLCB0bXA7XHJcblx0XHRcdGlmKDAgPiBjYXQuYWNrICYmICFHdW4udmFsLnJlbC5pcyhjaGFuZ2UpKXsgLy8gZm9yIGJldHRlciBiZWhhdmlvcj9cclxuXHRcdFx0XHRjYXQuYWNrID0gMTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjYXQuZ2V0ICYmIGF0LmdldCAhPT0gY2F0LmdldCl7XHJcblx0XHRcdFx0YXQgPSBvYmpfdG8oYXQsIHtnZXQ6IGNhdC5nZXR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjYXQuZmllbGQgJiYgY29hdCAhPT0gY2F0KXtcclxuXHRcdFx0XHRhdCA9IG9ial90byhhdCwge2d1bjogY2F0Lmd1bn0pO1xyXG5cdFx0XHRcdGlmKGNvYXQuYWNrKXtcclxuXHRcdFx0XHRcdGNhdC5hY2sgPSBjYXQuYWNrIHx8IGNvYXQuYWNrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZih1ID09PSBjaGFuZ2Upe1xyXG5cdFx0XHRcdGV2LnRvLm5leHQoYXQpO1xyXG5cdFx0XHRcdGlmKGNhdC5zb3VsKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRlY2hvKGNhdCwgYXQsIGV2KTtcclxuXHRcdFx0XHRpZihjYXQuZmllbGQpe1xyXG5cdFx0XHRcdFx0bm90KGNhdCwgYXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRvYmpfZGVsKGNvYXQuZWNobywgY2F0LmlkKTtcclxuXHRcdFx0XHRvYmpfZGVsKGNhdC5tYXAsIGNvYXQuaWQpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjYXQuc291bCl7XHJcblx0XHRcdFx0aWYoY2F0LnJvb3QuXy5ub3cpeyBhdCA9IG9ial90byhhdCwge3B1dDogY2hhbmdlID0gY29hdC5wdXR9KSB9IC8vIFRPRE86IFVnbHkgaGFjayBmb3IgdW5jYWNoZWQgc3luY2hyb25vdXMgbWFwcy5cclxuXHRcdFx0XHRldi50by5uZXh0KGF0KTtcclxuXHRcdFx0XHRlY2hvKGNhdCwgYXQsIGV2KTtcclxuXHRcdFx0XHRvYmpfbWFwKGNoYW5nZSwgbWFwLCB7YXQ6IGF0LCBjYXQ6IGNhdH0pO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZighKHJlbCA9IEd1bi52YWwucmVsLmlzKGNoYW5nZSkpKXtcclxuXHRcdFx0XHRpZihHdW4udmFsLmlzKGNoYW5nZSkpe1xyXG5cdFx0XHRcdFx0aWYoY2F0LmZpZWxkIHx8IGNhdC5zb3VsKXtcclxuXHRcdFx0XHRcdFx0bm90KGNhdCwgYXQpO1xyXG5cdFx0XHRcdFx0fSBlbHNlXHJcblx0XHRcdFx0XHRpZihjb2F0LmZpZWxkIHx8IGNvYXQuc291bCl7XHJcblx0XHRcdFx0XHRcdChjb2F0LmVjaG8gfHwgKGNvYXQuZWNobyA9IHt9KSlbY2F0LmlkXSA9IGNhdDtcclxuXHRcdFx0XHRcdFx0KGNhdC5tYXAgfHwgKGNhdC5tYXAgPSB7fSkpW2NvYXQuaWRdID0gY2F0Lm1hcFtjb2F0LmlkXSB8fCB7YXQ6IGNvYXR9O1xyXG5cdFx0XHRcdFx0XHQvL2lmKHUgPT09IGNvYXQucHV0KXsgcmV0dXJuIH0gLy8gTm90IG5lY2Vzc2FyeSBidXQgaW1wcm92ZXMgcGVyZm9ybWFuY2UuIElmIHdlIGhhdmUgaXQgYnV0IGNvYXQgZG9lcyBub3QsIHRoYXQgbWVhbnMgd2UgZ290IHRoaW5ncyBvdXQgb2Ygb3JkZXIgYW5kIGNvYXQgd2lsbCBnZXQgaXQuIE9uY2UgY29hdCBnZXRzIGl0LCBpdCB3aWxsIHRlbGwgdXMgYWdhaW4uXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRldi50by5uZXh0KGF0KTtcclxuXHRcdFx0XHRcdGVjaG8oY2F0LCBhdCwgZXYpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihjYXQuZmllbGQgJiYgY29hdCAhPT0gY2F0ICYmIG9ial9oYXMoY29hdCwgJ3B1dCcpKXtcclxuXHRcdFx0XHRcdGNhdC5wdXQgPSBjb2F0LnB1dDtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGlmKChyZWwgPSBHdW4ubm9kZS5zb3VsKGNoYW5nZSkpICYmIGNvYXQuZmllbGQpe1xyXG5cdFx0XHRcdFx0Y29hdC5wdXQgPSAoY2F0LnJvb3QuZ2V0KHJlbCkuXykucHV0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRldi50by5uZXh0KGF0KTtcclxuXHRcdFx0XHRlY2hvKGNhdCwgYXQsIGV2KTtcclxuXHRcdFx0XHRyZWxhdGUoY2F0LCBhdCwgY29hdCwgcmVsKTtcclxuXHRcdFx0XHRvYmpfbWFwKGNoYW5nZSwgbWFwLCB7YXQ6IGF0LCBjYXQ6IGNhdH0pO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZWxhdGUoY2F0LCBhdCwgY29hdCwgcmVsKTtcclxuXHRcdFx0ZXYudG8ubmV4dChhdCk7XHJcblx0XHRcdGVjaG8oY2F0LCBhdCwgZXYpO1xyXG5cdFx0fVxyXG5cdFx0R3VuLmNoYWluLmNoYWluLmlucHV0ID0gaW5wdXQ7XHJcblx0XHRmdW5jdGlvbiByZWxhdGUoY2F0LCBhdCwgY29hdCwgcmVsKXtcclxuXHRcdFx0aWYoIXJlbCB8fCBub2RlXyA9PT0gY2F0LmdldCl7IHJldHVybiB9XHJcblx0XHRcdHZhciB0bXAgPSAoY2F0LnJvb3QuZ2V0KHJlbCkuXyk7XHJcblx0XHRcdGlmKGNhdC5maWVsZCl7XHJcblx0XHRcdFx0Y29hdCA9IHRtcDtcclxuXHRcdFx0fSBlbHNlIFxyXG5cdFx0XHRpZihjb2F0LmZpZWxkKXtcclxuXHRcdFx0XHRyZWxhdGUoY29hdCwgYXQsIGNvYXQsIHJlbCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY29hdCA9PT0gY2F0KXsgcmV0dXJuIH1cclxuXHRcdFx0KGNvYXQuZWNobyB8fCAoY29hdC5lY2hvID0ge30pKVtjYXQuaWRdID0gY2F0O1xyXG5cdFx0XHRpZihjYXQuZmllbGQgJiYgIShjYXQubWFwfHxlbXB0eSlbY29hdC5pZF0pe1xyXG5cdFx0XHRcdG5vdChjYXQsIGF0KTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0bXAgPSAoY2F0Lm1hcCB8fCAoY2F0Lm1hcCA9IHt9KSlbY29hdC5pZF0gPSBjYXQubWFwW2NvYXQuaWRdIHx8IHthdDogY29hdH07XHJcblx0XHRcdGlmKHJlbCAhPT0gdG1wLnJlbCl7XHJcblx0XHRcdFx0YXNrKGNhdCwgdG1wLnJlbCA9IHJlbCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIGVjaG8oY2F0LCBhdCwgZXYpe1xyXG5cdFx0XHRpZighY2F0LmVjaG8peyByZXR1cm4gfSAvLyB8fCBub2RlXyA9PT0gYXQuZ2V0ID8/Pz9cclxuXHRcdFx0aWYoY2F0LmZpZWxkKXsgYXQgPSBvYmpfdG8oYXQsIHtldmVudDogZXZ9KSB9XHJcblx0XHRcdG9ial9tYXAoY2F0LmVjaG8sIHJldmVyYiwgYXQpO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gcmV2ZXJiKGNhdCl7XHJcblx0XHRcdGNhdC5vbignaW4nLCB0aGlzKTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIG1hcChkYXRhLCBrZXkpeyAvLyBNYXAgb3ZlciBvbmx5IHRoZSBjaGFuZ2VzIG9uIGV2ZXJ5IHVwZGF0ZS5cclxuXHRcdFx0dmFyIGNhdCA9IHRoaXMuY2F0LCBuZXh0ID0gY2F0Lm5leHQgfHwgZW1wdHksIHZpYSA9IHRoaXMuYXQsIGd1biwgY2hhaW4sIGF0LCB0bXA7XHJcblx0XHRcdGlmKG5vZGVfID09PSBrZXkgJiYgIW5leHRba2V5XSl7IHJldHVybiB9XHJcblx0XHRcdGlmKCEoZ3VuID0gbmV4dFtrZXldKSl7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGF0ID0gKGd1bi5fKTtcclxuXHRcdFx0Ly9pZihkYXRhICYmIGRhdGFbX3NvdWxdICYmICh0bXAgPSBHdW4udmFsLnJlbC5pcyhkYXRhKSkgJiYgKHRtcCA9IChjYXQucm9vdC5nZXQodG1wKS5fKSkgJiYgb2JqX2hhcyh0bXAsICdwdXQnKSl7XHJcblx0XHRcdC8vXHRkYXRhID0gdG1wLnB1dDtcclxuXHRcdFx0Ly99XHJcblx0XHRcdGlmKGF0LmZpZWxkKXtcclxuXHRcdFx0XHRpZighKGRhdGEgJiYgZGF0YVtfc291bF0gJiYgR3VuLnZhbC5yZWwuaXMoZGF0YSkgPT09IEd1bi5ub2RlLnNvdWwoYXQucHV0KSkpe1xyXG5cdFx0XHRcdFx0YXQucHV0ID0gZGF0YTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2hhaW4gPSBndW47XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y2hhaW4gPSB2aWEuZ3VuLmdldChrZXkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGF0Lm9uKCdpbicsIHtcclxuXHRcdFx0XHRwdXQ6IGRhdGEsXHJcblx0XHRcdFx0Z2V0OiBrZXksXHJcblx0XHRcdFx0Z3VuOiBjaGFpbixcclxuXHRcdFx0XHR2aWE6IHZpYVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIG5vdChjYXQsIGF0KXtcclxuXHRcdFx0aWYoIShjYXQuZmllbGQgfHwgY2F0LnNvdWwpKXsgcmV0dXJuIH1cclxuXHRcdFx0dmFyIHRtcCA9IGNhdC5tYXA7XHJcblx0XHRcdGNhdC5tYXAgPSBudWxsO1xyXG5cdFx0XHRpZihudWxsID09PSB0bXApeyByZXR1cm4gfVxyXG5cdFx0XHRpZih1ID09PSB0bXAgJiYgY2F0LnB1dCAhPT0gdSl7IHJldHVybiB9IC8vIFRPRE86IEJ1Zz8gVGhyZXcgc2Vjb25kIGNvbmRpdGlvbiBpbiBmb3IgYSBwYXJ0aWN1bGFyIHRlc3QsIG5vdCBzdXJlIGlmIGEgY291bnRlciBleGFtcGxlIGlzIHRlc3RlZCB0aG91Z2guXHJcblx0XHRcdG9ial9tYXAodG1wLCBmdW5jdGlvbihwcm94eSl7XHJcblx0XHRcdFx0aWYoIShwcm94eSA9IHByb3h5LmF0KSl7IHJldHVybiB9XHJcblx0XHRcdFx0b2JqX2RlbChwcm94eS5lY2hvLCBjYXQuaWQpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0b2JqX21hcChjYXQubmV4dCwgZnVuY3Rpb24oZ3VuLCBrZXkpe1xyXG5cdFx0XHRcdHZhciBjb2F0ID0gKGd1bi5fKTtcclxuXHRcdFx0XHRjb2F0LnB1dCA9IHU7XHJcblx0XHRcdFx0aWYoY29hdC5hY2spe1xyXG5cdFx0XHRcdFx0Y29hdC5hY2sgPSAtMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y29hdC5vbignaW4nLCB7XHJcblx0XHRcdFx0XHRnZXQ6IGtleSxcclxuXHRcdFx0XHRcdGd1bjogZ3VuLFxyXG5cdFx0XHRcdFx0cHV0OiB1XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gYXNrKGNhdCwgc291bCl7XHJcblx0XHRcdHZhciB0bXAgPSAoY2F0LnJvb3QuZ2V0KHNvdWwpLl8pO1xyXG5cdFx0XHRpZihjYXQuYWNrKXtcclxuXHRcdFx0XHR0bXAuYWNrID0gdG1wLmFjayB8fCAtMTtcclxuXHRcdFx0XHR0bXAub24oJ291dCcsIHtcclxuXHRcdFx0XHRcdGdldDogeycjJzogc291bH0sXHJcblx0XHRcdFx0XHQnIyc6IGNhdC5yb290Ll8uYXNrKEd1bi5IQU0uc3ludGgsIHRtcC5ndW4pLFxyXG5cdFx0XHRcdFx0Z3VuOiB0bXAuZ3VuXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdG9ial9tYXAoY2F0Lm5leHQsIGZ1bmN0aW9uKGd1biwga2V5KXtcclxuXHRcdFx0XHQoZ3VuLl8pLm9uKCdvdXQnLCB7XHJcblx0XHRcdFx0XHRnZXQ6IHsnIyc6IHNvdWwsICcuJzoga2V5fSxcclxuXHRcdFx0XHRcdCcjJzogY2F0LnJvb3QuXy5hc2soR3VuLkhBTS5zeW50aCwgdG1wLmd1biksXHJcblx0XHRcdFx0XHRndW46IGd1blxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdHZhciBlbXB0eSA9IHt9LCB1O1xyXG5cdFx0dmFyIG9iaiA9IEd1bi5vYmosIG9ial9oYXMgPSBvYmouaGFzLCBvYmpfcHV0ID0gb2JqLnB1dCwgb2JqX2RlbCA9IG9iai5kZWwsIG9ial90byA9IG9iai50bywgb2JqX21hcCA9IG9iai5tYXA7XHJcblx0XHR2YXIgX3NvdWwgPSBHdW4uXy5zb3VsLCBfZmllbGQgPSBHdW4uXy5maWVsZCwgbm9kZV8gPSBHdW4ubm9kZS5fO1xyXG5cdH0pKHJlcXVpcmUsICcuL2NoYWluJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9yb290Jyk7XHJcblx0XHRHdW4uY2hhaW4uZ2V0ID0gZnVuY3Rpb24oa2V5LCBjYiwgYXMpe1xyXG5cdFx0XHRpZih0eXBlb2Yga2V5ID09PSAnc3RyaW5nJyl7XHJcblx0XHRcdFx0dmFyIGd1biwgYmFjayA9IHRoaXMsIGNhdCA9IGJhY2suXztcclxuXHRcdFx0XHR2YXIgbmV4dCA9IGNhdC5uZXh0IHx8IGVtcHR5LCB0bXA7XHJcblx0XHRcdFx0aWYoIShndW4gPSBuZXh0W2tleV0pKXtcclxuXHRcdFx0XHRcdGd1biA9IGNhY2hlKGtleSwgYmFjayk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2VcclxuXHRcdFx0aWYoa2V5IGluc3RhbmNlb2YgRnVuY3Rpb24pe1xyXG5cdFx0XHRcdHZhciBndW4gPSB0aGlzLCBhdCA9IGd1bi5fO1xyXG5cdFx0XHRcdGFzID0gY2IgfHwge307XHJcblx0XHRcdFx0YXMudXNlID0ga2V5O1xyXG5cdFx0XHRcdGFzLm91dCA9IGFzLm91dCB8fCB7Y2FwOiAxfTtcclxuXHRcdFx0XHRhcy5vdXQuZ2V0ID0gYXMub3V0LmdldCB8fCB7fTtcclxuXHRcdFx0XHQnXycgIT0gYXQuZ2V0ICYmICgoYXQucm9vdC5fKS5ub3cgPSB0cnVlKTsgLy8gdWdseSBoYWNrIGZvciBub3cuXHJcblx0XHRcdFx0YXQub24oJ2luJywgdXNlLCBhcyk7XHJcblx0XHRcdFx0YXQub24oJ291dCcsIGFzLm91dCk7XHJcblx0XHRcdFx0KGF0LnJvb3QuXykubm93ID0gZmFsc2U7XHJcblx0XHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdFx0fSBlbHNlXHJcblx0XHRcdGlmKG51bV9pcyhrZXkpKXtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5nZXQoJycra2V5LCBjYiwgYXMpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdChhcyA9IHRoaXMuY2hhaW4oKSkuXy5lcnIgPSB7ZXJyOiBHdW4ubG9nKCdJbnZhbGlkIGdldCByZXF1ZXN0IScsIGtleSl9OyAvLyBDTEVBTiBVUFxyXG5cdFx0XHRcdGlmKGNiKXsgY2IuY2FsbChhcywgYXMuXy5lcnIpIH1cclxuXHRcdFx0XHRyZXR1cm4gYXM7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYodG1wID0gY2F0LnN0dW4peyAvLyBUT0RPOiBSZWZhY3Rvcj9cclxuXHRcdFx0XHRndW4uXy5zdHVuID0gZ3VuLl8uc3R1biB8fCB0bXA7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY2IgJiYgY2IgaW5zdGFuY2VvZiBGdW5jdGlvbil7XHJcblx0XHRcdFx0Z3VuLmdldChjYiwgYXMpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBndW47XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBjYWNoZShrZXksIGJhY2spe1xyXG5cdFx0XHR2YXIgY2F0ID0gYmFjay5fLCBuZXh0ID0gY2F0Lm5leHQsIGd1biA9IGJhY2suY2hhaW4oKSwgYXQgPSBndW4uXztcclxuXHRcdFx0aWYoIW5leHQpeyBuZXh0ID0gY2F0Lm5leHQgPSB7fSB9XHJcblx0XHRcdG5leHRbYXQuZ2V0ID0ga2V5XSA9IGd1bjtcclxuXHRcdFx0aWYoY2F0LnJvb3QgPT09IGJhY2speyBhdC5zb3VsID0ga2V5IH1cclxuXHRcdFx0ZWxzZSBpZihjYXQuc291bCB8fCBjYXQuZmllbGQpeyBhdC5maWVsZCA9IGtleSB9XHJcblx0XHRcdHJldHVybiBndW47XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiB1c2UoYXQpe1xyXG5cdFx0XHR2YXIgZXYgPSB0aGlzLCBhcyA9IGV2LmFzLCBndW4gPSBhdC5ndW4sIGNhdCA9IGd1bi5fLCBkYXRhID0gYXQucHV0LCB0bXA7XHJcblx0XHRcdGlmKHUgPT09IGRhdGEpe1xyXG5cdFx0XHRcdGRhdGEgPSBjYXQucHV0O1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCh0bXAgPSBkYXRhKSAmJiB0bXBbcmVsLl9dICYmICh0bXAgPSByZWwuaXModG1wKSkpe1xyXG5cdFx0XHRcdHRtcCA9IChjYXQucm9vdC5nZXQodG1wKS5fKTtcclxuXHRcdFx0XHRpZih1ICE9PSB0bXAucHV0KXtcclxuXHRcdFx0XHRcdGF0ID0gb2JqX3RvKGF0LCB7cHV0OiB0bXAucHV0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGFzLnVzZShhdCwgYXQuZXZlbnQgfHwgZXYpO1xyXG5cdFx0XHRldi50by5uZXh0KGF0KTtcclxuXHRcdH1cclxuXHRcdHZhciBvYmogPSBHdW4ub2JqLCBvYmpfaGFzID0gb2JqLmhhcywgb2JqX3RvID0gR3VuLm9iai50bztcclxuXHRcdHZhciBudW1faXMgPSBHdW4ubnVtLmlzO1xyXG5cdFx0dmFyIHJlbCA9IEd1bi52YWwucmVsLCBub2RlXyA9IEd1bi5ub2RlLl87XHJcblx0XHR2YXIgZW1wdHkgPSB7fSwgdTtcclxuXHR9KShyZXF1aXJlLCAnLi9nZXQnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL3Jvb3QnKTtcclxuXHRcdEd1bi5jaGFpbi5wdXQgPSBmdW5jdGlvbihkYXRhLCBjYiwgYXMpe1xyXG5cdFx0XHQvLyAjc291bC5maWVsZD12YWx1ZT5zdGF0ZVxyXG5cdFx0XHQvLyB+d2hvI3doZXJlLndoZXJlPXdoYXQ+d2hlbkB3YXNcclxuXHRcdFx0Ly8gVE9ETzogQlVHISBQdXQgcHJvYmFibHkgY2Fubm90IGhhbmRsZSBwbHVyYWwgY2hhaW5zIVxyXG5cdFx0XHR2YXIgZ3VuID0gdGhpcywgYXQgPSAoZ3VuLl8pLCByb290ID0gYXQucm9vdCwgdG1wO1xyXG5cdFx0XHRhcyA9IGFzIHx8IHt9O1xyXG5cdFx0XHRhcy5kYXRhID0gZGF0YTtcclxuXHRcdFx0YXMuZ3VuID0gYXMuZ3VuIHx8IGd1bjtcclxuXHRcdFx0aWYodHlwZW9mIGNiID09PSAnc3RyaW5nJyl7XHJcblx0XHRcdFx0YXMuc291bCA9IGNiO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGFzLmFjayA9IGNiO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGF0LnNvdWwpe1xyXG5cdFx0XHRcdGFzLnNvdWwgPSBhdC5zb3VsO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGFzLnNvdWwgfHwgcm9vdCA9PT0gZ3VuKXtcclxuXHRcdFx0XHRpZighb2JqX2lzKGFzLmRhdGEpKXtcclxuXHRcdFx0XHRcdChhcy5hY2t8fG5vb3ApLmNhbGwoYXMsIGFzLm91dCA9IHtlcnI6IEd1bi5sb2coXCJEYXRhIHNhdmVkIHRvIHRoZSByb290IGxldmVsIG9mIHRoZSBncmFwaCBtdXN0IGJlIGEgbm9kZSAoYW4gb2JqZWN0KSwgbm90IGFcIiwgKHR5cGVvZiBhcy5kYXRhKSwgJ29mIFwiJyArIGFzLmRhdGEgKyAnXCIhJyl9KTtcclxuXHRcdFx0XHRcdGlmKGFzLnJlcyl7IGFzLnJlcygpIH1cclxuXHRcdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGFzLmd1biA9IGd1biA9IHJvb3QuZ2V0KGFzLnNvdWwgPSBhcy5zb3VsIHx8IChhcy5ub3QgPSBHdW4ubm9kZS5zb3VsKGFzLmRhdGEpIHx8ICgocm9vdC5fKS5vcHQudXVpZCB8fCBHdW4udGV4dC5yYW5kb20pKCkpKTtcclxuXHRcdFx0XHRhcy5yZWYgPSBhcy5ndW47XHJcblx0XHRcdFx0aWZ5KGFzKTtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKEd1bi5pcyhkYXRhKSl7XHJcblx0XHRcdFx0ZGF0YS5nZXQoZnVuY3Rpb24oYXQsZXYpe2V2Lm9mZigpO1xyXG5cdFx0XHRcdFx0dmFyIHMgPSBHdW4ubm9kZS5zb3VsKGF0LnB1dCk7XHJcblx0XHRcdFx0XHRpZighcyl7R3VuLmxvZyhcIlRoZSByZWZlcmVuY2UgeW91IGFyZSBzYXZpbmcgaXMgYVwiLCB0eXBlb2YgYXQucHV0LCAnXCInKyBhcy5wdXQgKydcIiwgbm90IGEgbm9kZSAob2JqZWN0KSEnKTtyZXR1cm59XHJcblx0XHRcdFx0XHRndW4ucHV0KEd1bi52YWwucmVsLmlmeShzKSwgY2IsIGFzKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFzLnJlZiA9IGFzLnJlZiB8fCAocm9vdCA9PT0gKHRtcCA9IGF0LmJhY2spKT8gZ3VuIDogdG1wO1xyXG5cdFx0XHRpZihhcy5yZWYuXy5zb3VsICYmIEd1bi52YWwuaXMoYXMuZGF0YSkgJiYgYXQuZ2V0KXtcclxuXHRcdFx0XHRhcy5kYXRhID0gb2JqX3B1dCh7fSwgYXQuZ2V0LCBhcy5kYXRhKTtcclxuXHRcdFx0XHRhcy5yZWYucHV0KGFzLmRhdGEsIGFzLnNvdWwsIGFzKTtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFzLnJlZi5nZXQoJ18nKS5nZXQoYW55LCB7YXM6IGFzfSk7XHJcblx0XHRcdGlmKCFhcy5vdXQpe1xyXG5cdFx0XHRcdC8vIFRPRE86IFBlcmYgaWRlYSEgTWFrZSBhIGdsb2JhbCBsb2NrLCB0aGF0IGJsb2NrcyBldmVyeXRoaW5nIHdoaWxlIGl0IGlzIG9uLCBidXQgaWYgaXQgaXMgb24gdGhlIGxvY2sgaXQgZG9lcyB0aGUgZXhwZW5zaXZlIGxvb2t1cCB0byBzZWUgaWYgaXQgaXMgYSBkZXBlbmRlbnQgd3JpdGUgb3Igbm90IGFuZCBpZiBub3QgdGhlbiBpdCBwcm9jZWVkcyBmdWxsIHNwZWVkLiBNZWg/IEZvciB3cml0ZSBoZWF2eSBhc3luYyBhcHBzIHRoYXQgd291bGQgYmUgdGVycmlibGUuXHJcblx0XHRcdFx0YXMucmVzID0gYXMucmVzIHx8IEd1bi5vbi5zdHVuKGFzLnJlZik7XHJcblx0XHRcdFx0YXMuZ3VuLl8uc3R1biA9IGFzLnJlZi5fLnN0dW47XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdH07XHJcblxyXG5cdFx0ZnVuY3Rpb24gaWZ5KGFzKXtcclxuXHRcdFx0YXMuYmF0Y2ggPSBiYXRjaDtcclxuXHRcdFx0dmFyIG9wdCA9IGFzLm9wdHx8e30sIGVudiA9IGFzLmVudiA9IEd1bi5zdGF0ZS5tYXAobWFwLCBvcHQuc3RhdGUpO1xyXG5cdFx0XHRlbnYuc291bCA9IGFzLnNvdWw7XHJcblx0XHRcdGFzLmdyYXBoID0gR3VuLmdyYXBoLmlmeShhcy5kYXRhLCBlbnYsIGFzKTtcclxuXHRcdFx0aWYoZW52LmVycil7XHJcblx0XHRcdFx0KGFzLmFja3x8bm9vcCkuY2FsbChhcywgYXMub3V0ID0ge2VycjogR3VuLmxvZyhlbnYuZXJyKX0pO1xyXG5cdFx0XHRcdGlmKGFzLnJlcyl7IGFzLnJlcygpIH1cclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0YXMuYmF0Y2goKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBiYXRjaCgpeyB2YXIgYXMgPSB0aGlzO1xyXG5cdFx0XHRpZighYXMuZ3JhcGggfHwgb2JqX21hcChhcy5zdHVuLCBubykpeyByZXR1cm4gfVxyXG5cdFx0XHQoYXMucmVzfHxpaWZlKShmdW5jdGlvbigpe1xyXG5cdFx0XHRcdChhcy5yZWYuXykub24oJ291dCcsIHtcclxuXHRcdFx0XHRcdGNhcDogMyxcclxuXHRcdFx0XHRcdGd1bjogYXMucmVmLCBwdXQ6IGFzLm91dCA9IGFzLmVudi5ncmFwaCwgb3B0OiBhcy5vcHQsXHJcblx0XHRcdFx0XHQnIyc6IGFzLmd1bi5iYWNrKC0xKS5fLmFzayhmdW5jdGlvbihhY2speyB0aGlzLm9mZigpOyAvLyBPbmUgcmVzcG9uc2UgaXMgZ29vZCBlbm91Z2ggZm9yIHVzIGN1cnJlbnRseS4gTGF0ZXIgd2UgbWF5IHdhbnQgdG8gYWRqdXN0IHRoaXMuXHJcblx0XHRcdFx0XHRcdGlmKCFhcy5hY2speyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0XHRhcy5hY2soYWNrLCB0aGlzKTtcclxuXHRcdFx0XHRcdH0sIGFzLm9wdClcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSwgYXMpO1xyXG5cdFx0XHRpZihhcy5yZXMpeyBhcy5yZXMoKSB9XHJcblx0XHR9IGZ1bmN0aW9uIG5vKHYsZil7IGlmKHYpeyByZXR1cm4gdHJ1ZSB9IH1cclxuXHJcblx0XHRmdW5jdGlvbiBtYXAodixmLG4sIGF0KXsgdmFyIGFzID0gdGhpcztcclxuXHRcdFx0aWYoZiB8fCAhYXQucGF0aC5sZW5ndGgpeyByZXR1cm4gfVxyXG5cdFx0XHQoYXMucmVzfHxpaWZlKShmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciBwYXRoID0gYXQucGF0aCwgcmVmID0gYXMucmVmLCBvcHQgPSBhcy5vcHQ7XHJcblx0XHRcdFx0dmFyIGkgPSAwLCBsID0gcGF0aC5sZW5ndGg7XHJcblx0XHRcdFx0Zm9yKGk7IGkgPCBsOyBpKyspe1xyXG5cdFx0XHRcdFx0cmVmID0gcmVmLmdldChwYXRoW2ldKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoYXMubm90IHx8IEd1bi5ub2RlLnNvdWwoYXQub2JqKSl7XHJcblx0XHRcdFx0XHRhdC5zb3VsKEd1bi5ub2RlLnNvdWwoYXQub2JqKSB8fCAoKGFzLm9wdHx8e30pLnV1aWQgfHwgYXMuZ3VuLmJhY2soJ29wdC51dWlkJykgfHwgR3VuLnRleHQucmFuZG9tKSgpKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0KGFzLnN0dW4gPSBhcy5zdHVuIHx8IHt9KVtwYXRoXSA9IHRydWU7XHJcblx0XHRcdFx0cmVmLmdldCgnXycpLmdldChzb3VsLCB7YXM6IHthdDogYXQsIGFzOiBhc319KTtcclxuXHRcdFx0fSwge2FzOiBhcywgYXQ6IGF0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gc291bChhdCwgZXYpeyB2YXIgYXMgPSB0aGlzLmFzLCBjYXQgPSBhcy5hdDsgYXMgPSBhcy5hcztcclxuXHRcdFx0Ly9ldi5zdHVuKCk7IC8vIFRPRE86IEJVRyE/XHJcblx0XHRcdGlmKCFhdC5ndW4gfHwgIWF0Lmd1bi5fLmJhY2speyByZXR1cm4gfSAvLyBUT0RPOiBIYW5kbGVcclxuXHRcdFx0ZXYub2ZmKCk7XHJcblx0XHRcdGF0ID0gKGF0Lmd1bi5fLmJhY2suXyk7XHJcblx0XHRcdGNhdC5zb3VsKEd1bi5ub2RlLnNvdWwoY2F0Lm9iaikgfHwgR3VuLm5vZGUuc291bChhdC5wdXQpIHx8IEd1bi52YWwucmVsLmlzKGF0LnB1dCkgfHwgKChhcy5vcHR8fHt9KS51dWlkIHx8IGFzLmd1bi5iYWNrKCdvcHQudXVpZCcpIHx8IEd1bi50ZXh0LnJhbmRvbSkoKSk7IC8vIFRPRE86IEJVRyE/IERvIHdlIHJlYWxseSB3YW50IHRoZSBzb3VsIG9mIHRoZSBvYmplY3QgZ2l2ZW4gdG8gdXM/IENvdWxkIHRoYXQgYmUgZGFuZ2Vyb3VzP1xyXG5cdFx0XHRhcy5zdHVuW2NhdC5wYXRoXSA9IGZhbHNlO1xyXG5cdFx0XHRhcy5iYXRjaCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGFueShhdCwgZXYpe1xyXG5cdFx0XHR2YXIgYXMgPSB0aGlzLmFzO1xyXG5cdFx0XHRpZighYXQuZ3VuIHx8ICFhdC5ndW4uXyl7IHJldHVybiB9IC8vIFRPRE86IEhhbmRsZVxyXG5cdFx0XHRpZihhdC5lcnIpeyAvLyBUT0RPOiBIYW5kbGVcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIlBsZWFzZSByZXBvcnQgdGhpcyBhcyBhbiBpc3N1ZSEgUHV0LmFueS5lcnJcIik7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBjYXQgPSAoYXQuZ3VuLl8uYmFjay5fKSwgZGF0YSA9IGNhdC5wdXQsIG9wdCA9IGFzLm9wdHx8e30sIHJvb3QsIHRtcDtcclxuXHRcdFx0ZXYub2ZmKCk7XHJcblx0XHRcdGlmKGFzLnJlZiAhPT0gYXMuZ3VuKXtcclxuXHRcdFx0XHR0bXAgPSAoYXMuZ3VuLl8pLmdldCB8fCBjYXQuZ2V0O1xyXG5cdFx0XHRcdGlmKCF0bXApeyAvLyBUT0RPOiBIYW5kbGVcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiUGxlYXNlIHJlcG9ydCB0aGlzIGFzIGFuIGlzc3VlISBQdXQubm8uZ2V0XCIpOyAvLyBUT0RPOiBCVUchPz9cclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YXMuZGF0YSA9IG9ial9wdXQoe30sIHRtcCwgYXMuZGF0YSk7XHJcblx0XHRcdFx0dG1wID0gbnVsbDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih1ID09PSBkYXRhKXtcclxuXHRcdFx0XHRpZighY2F0LmdldCl7IHJldHVybiB9IC8vIFRPRE86IEhhbmRsZVxyXG5cdFx0XHRcdGlmKCFjYXQuc291bCl7XHJcblx0XHRcdFx0XHR0bXAgPSBjYXQuZ3VuLmJhY2soZnVuY3Rpb24oYXQpe1xyXG5cdFx0XHRcdFx0XHRpZihhdC5zb3VsKXsgcmV0dXJuIGF0LnNvdWwgfVxyXG5cdFx0XHRcdFx0XHRhcy5kYXRhID0gb2JqX3B1dCh7fSwgYXQuZ2V0LCBhcy5kYXRhKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0bXAgPSB0bXAgfHwgY2F0LmdldDtcclxuXHRcdFx0XHRjYXQgPSAoY2F0LnJvb3QuZ2V0KHRtcCkuXyk7XHJcblx0XHRcdFx0YXMubm90ID0gYXMuc291bCA9IHRtcDtcclxuXHRcdFx0XHRkYXRhID0gYXMuZGF0YTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZighYXMubm90ICYmICEoYXMuc291bCA9IEd1bi5ub2RlLnNvdWwoZGF0YSkpKXtcclxuXHRcdFx0XHRpZihhcy5wYXRoICYmIG9ial9pcyhhcy5kYXRhKSl7IC8vIEFwcGFyZW50bHkgbmVjZXNzYXJ5XHJcblx0XHRcdFx0XHRhcy5zb3VsID0gKG9wdC51dWlkIHx8IGNhdC5yb290Ll8ub3B0LnV1aWQgfHwgR3VuLnRleHQucmFuZG9tKSgpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvL2FzLmRhdGEgPSBvYmpfcHV0KHt9LCBhcy5ndW4uXy5nZXQsIGFzLmRhdGEpO1xyXG5cdFx0XHRcdFx0YXMuc291bCA9IGF0LnNvdWwgfHwgY2F0LnNvdWwgfHwgKG9wdC51dWlkIHx8IGNhdC5yb290Ll8ub3B0LnV1aWQgfHwgR3VuLnRleHQucmFuZG9tKSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRhcy5yZWYucHV0KGFzLmRhdGEsIGFzLnNvdWwsIGFzKTtcclxuXHRcdH1cclxuXHRcdHZhciBvYmogPSBHdW4ub2JqLCBvYmpfaXMgPSBvYmouaXMsIG9ial9wdXQgPSBvYmoucHV0LCBvYmpfbWFwID0gb2JqLm1hcDtcclxuXHRcdHZhciB1LCBlbXB0eSA9IHt9LCBub29wID0gZnVuY3Rpb24oKXt9LCBpaWZlID0gZnVuY3Rpb24oZm4sYXMpe2ZuLmNhbGwoYXN8fGVtcHR5KX07XHJcblx0fSkocmVxdWlyZSwgJy4vcHV0Jyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblxyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vcm9vdCcpO1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBHdW47XHJcblxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRmdW5jdGlvbiBtZXRhKHYsZil7XHJcblx0XHRcdFx0aWYob2JqX2hhcyhHdW4uX18uXywgZikpeyByZXR1cm4gfVxyXG5cdFx0XHRcdG9ial9wdXQodGhpcy5fLCBmLCB2KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBtYXAodmFsdWUsIGZpZWxkKXtcclxuXHRcdFx0XHRpZihHdW4uXy5ub2RlID09PSBmaWVsZCl7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIG5vZGUgPSB0aGlzLm5vZGUsIHZlcnRleCA9IHRoaXMudmVydGV4LCB1bmlvbiA9IHRoaXMudW5pb24sIG1hY2hpbmUgPSB0aGlzLm1hY2hpbmU7XHJcblx0XHRcdFx0dmFyIGlzID0gc3RhdGVfaXMobm9kZSwgZmllbGQpLCBjcyA9IHN0YXRlX2lzKHZlcnRleCwgZmllbGQpO1xyXG5cdFx0XHRcdGlmKHUgPT09IGlzIHx8IHUgPT09IGNzKXsgcmV0dXJuIHRydWUgfSAvLyBpdCBpcyB0cnVlIHRoYXQgdGhpcyBpcyBhbiBpbnZhbGlkIEhBTSBjb21wYXJpc29uLlxyXG5cdFx0XHRcdHZhciBpdiA9IHZhbHVlLCBjdiA9IHZlcnRleFtmaWVsZF07XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHRcdFx0XHQvLyBUT0RPOiBCVUchIE5lZWQgdG8gY29tcGFyZSByZWxhdGlvbiB0byBub3QgcmVsYXRpb24sIGFuZCBjaG9vc2UgdGhlIHJlbGF0aW9uIGlmIHRoZXJlIGlzIGEgc3RhdGUgY29uZmxpY3QuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHRcdFx0XHRpZighdmFsX2lzKGl2KSAmJiB1ICE9PSBpdil7IHJldHVybiB0cnVlIH0gLy8gVW5kZWZpbmVkIGlzIG9rYXkgc2luY2UgYSB2YWx1ZSBtaWdodCBub3QgZXhpc3Qgb24gYm90aCBub2Rlcy4gLy8gaXQgaXMgdHJ1ZSB0aGF0IHRoaXMgaXMgYW4gaW52YWxpZCBIQU0gY29tcGFyaXNvbi5cclxuXHRcdFx0XHRpZighdmFsX2lzKGN2KSAmJiB1ICE9PSBjdil7IHJldHVybiB0cnVlIH0gIC8vIFVuZGVmaW5lZCBpcyBva2F5IHNpbmNlIGEgdmFsdWUgbWlnaHQgbm90IGV4aXN0IG9uIGJvdGggbm9kZXMuIC8vIGl0IGlzIHRydWUgdGhhdCB0aGlzIGlzIGFuIGludmFsaWQgSEFNIGNvbXBhcmlzb24uXHJcblx0XHRcdFx0dmFyIEhBTSA9IEd1bi5IQU0obWFjaGluZSwgaXMsIGNzLCBpdiwgY3YpO1xyXG5cdFx0XHRcdGlmKEhBTS5lcnIpe1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCIuIUhZUE9USEVUSUNBTCBBTU5FU0lBIE1BQ0hJTkUgRVJSIS5cIiwgZmllbGQsIEhBTS5lcnIpOyAvLyB0aGlzIGVycm9yIHNob3VsZCBuZXZlciBoYXBwZW4uXHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKEhBTS5zdGF0ZSB8fCBIQU0uaGlzdG9yaWNhbCB8fCBIQU0uY3VycmVudCl7IC8vIFRPRE86IEJVRyEgTm90IGltcGxlbWVudGVkLlxyXG5cdFx0XHRcdFx0Ly9vcHQubG93ZXIodmVydGV4LCB7ZmllbGQ6IGZpZWxkLCB2YWx1ZTogdmFsdWUsIHN0YXRlOiBpc30pO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihIQU0uaW5jb21pbmcpe1xyXG5cdFx0XHRcdFx0dW5pb25bZmllbGRdID0gdmFsdWU7XHJcblx0XHRcdFx0XHRzdGF0ZV9pZnkodW5pb24sIGZpZWxkLCBpcyk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKEhBTS5kZWZlcil7IC8vIFRPRE86IEJVRyEgTm90IGltcGxlbWVudGVkLlxyXG5cdFx0XHRcdFx0dW5pb25bZmllbGRdID0gdmFsdWU7IC8vIFdST05HISBCVUchIE5lZWQgdG8gaW1wbGVtZW50IGNvcnJlY3QgYWxnb3JpdGhtLlxyXG5cdFx0XHRcdFx0c3RhdGVfaWZ5KHVuaW9uLCBmaWVsZCwgaXMpOyAvLyBXUk9ORyEgQlVHISBOZWVkIHRvIGltcGxlbWVudCBjb3JyZWN0IGFsZ29yaXRobS5cclxuXHRcdFx0XHRcdC8vIGZpbGxlciBhbGdvcml0aG0gZm9yIG5vdy5cclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdC8qdXBwZXIud2FpdCA9IHRydWU7XHJcblx0XHRcdFx0XHRvcHQudXBwZXIuY2FsbChzdGF0ZSwgdmVydGV4LCBmaWVsZCwgaW5jb21pbmcsIGN0eC5pbmNvbWluZy5zdGF0ZSk7IC8vIHNpZ25hbHMgdGhhdCB0aGVyZSBhcmUgc3RpbGwgZnV0dXJlIG1vZGlmaWNhdGlvbnMuXHJcblx0XHRcdFx0XHRHdW4uc2NoZWR1bGUoY3R4LmluY29taW5nLnN0YXRlLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0XHR1cGRhdGUoaW5jb21pbmcsIGZpZWxkKTtcclxuXHRcdFx0XHRcdFx0aWYoY3R4LmluY29taW5nLnN0YXRlID09PSB1cHBlci5tYXgpeyAodXBwZXIubGFzdCB8fCBmdW5jdGlvbigpe30pKCkgfVxyXG5cdFx0XHRcdFx0fSwgZ3VuLl9fLm9wdC5zdGF0ZSk7Ki9cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0R3VuLkhBTS51bmlvbiA9IGZ1bmN0aW9uKHZlcnRleCwgbm9kZSwgb3B0KXtcclxuXHRcdFx0XHRpZighbm9kZSB8fCAhbm9kZS5fKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2ZXJ0ZXggPSB2ZXJ0ZXggfHwgR3VuLm5vZGUuc291bC5pZnkoe186eyc+Jzp7fX19LCBHdW4ubm9kZS5zb3VsKG5vZGUpKTtcclxuXHRcdFx0XHRpZighdmVydGV4IHx8ICF2ZXJ0ZXguXyl7IHJldHVybiB9XHJcblx0XHRcdFx0b3B0ID0gbnVtX2lzKG9wdCk/IHttYWNoaW5lOiBvcHR9IDoge21hY2hpbmU6IEd1bi5zdGF0ZSgpfTtcclxuXHRcdFx0XHRvcHQudW5pb24gPSB2ZXJ0ZXggfHwgR3VuLm9iai5jb3B5KHZlcnRleCk7IC8vIFRPRE86IFBFUkYhIFRoaXMgd2lsbCBzbG93IHRoaW5ncyBkb3duIVxyXG5cdFx0XHRcdC8vIFRPRE86IFBFUkYhIEJpZ2dlc3Qgc2xvd2Rvd24gKGFmdGVyIDFvY2FsU3RvcmFnZSkgaXMgdGhlIGFib3ZlIGxpbmUuIEZpeCEgRml4IVxyXG5cdFx0XHRcdG9wdC52ZXJ0ZXggPSB2ZXJ0ZXg7XHJcblx0XHRcdFx0b3B0Lm5vZGUgPSBub2RlO1xyXG5cdFx0XHRcdC8vb2JqX21hcChub2RlLl8sIG1ldGEsIG9wdC51bmlvbik7IC8vIFRPRE86IFJldmlldyBhdCBzb21lIHBvaW50P1xyXG5cdFx0XHRcdGlmKG9ial9tYXAobm9kZSwgbWFwLCBvcHQpKXsgLy8gaWYgdGhpcyByZXR1cm5zIHRydWUgdGhlbiBzb21ldGhpbmcgd2FzIGludmFsaWQuXHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBvcHQudW5pb247XHJcblx0XHRcdH1cclxuXHRcdFx0R3VuLkhBTS5kZWx0YSA9IGZ1bmN0aW9uKHZlcnRleCwgbm9kZSwgb3B0KXtcclxuXHRcdFx0XHRvcHQgPSBudW1faXMob3B0KT8ge21hY2hpbmU6IG9wdH0gOiB7bWFjaGluZTogR3VuLnN0YXRlKCl9O1xyXG5cdFx0XHRcdGlmKCF2ZXJ0ZXgpeyByZXR1cm4gR3VuLm9iai5jb3B5KG5vZGUpIH1cclxuXHRcdFx0XHRvcHQuc291bCA9IEd1bi5ub2RlLnNvdWwob3B0LnZlcnRleCA9IHZlcnRleCk7XHJcblx0XHRcdFx0aWYoIW9wdC5zb3VsKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRvcHQuZGVsdGEgPSBHdW4ubm9kZS5zb3VsLmlmeSh7fSwgb3B0LnNvdWwpO1xyXG5cdFx0XHRcdG9ial9tYXAob3B0Lm5vZGUgPSBub2RlLCBkaWZmLCBvcHQpO1xyXG5cdFx0XHRcdHJldHVybiBvcHQuZGVsdGE7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gZGlmZih2YWx1ZSwgZmllbGQpeyB2YXIgb3B0ID0gdGhpcztcclxuXHRcdFx0XHRpZihHdW4uXy5ub2RlID09PSBmaWVsZCl7IHJldHVybiB9XHJcblx0XHRcdFx0aWYoIXZhbF9pcyh2YWx1ZSkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdHZhciBub2RlID0gb3B0Lm5vZGUsIHZlcnRleCA9IG9wdC52ZXJ0ZXgsIGlzID0gc3RhdGVfaXMobm9kZSwgZmllbGQsIHRydWUpLCBjcyA9IHN0YXRlX2lzKHZlcnRleCwgZmllbGQsIHRydWUpLCBkZWx0YSA9IG9wdC5kZWx0YTtcclxuXHRcdFx0XHR2YXIgSEFNID0gR3VuLkhBTShvcHQubWFjaGluZSwgaXMsIGNzLCB2YWx1ZSwgdmVydGV4W2ZpZWxkXSk7XHJcblxyXG5cclxuXHJcblx0XHRcdFx0Ly8gVE9ETzogQlVHISEhISBXSEFUIEFCT1VUIERFRkVSUkVEIT8/P1xyXG5cdFx0XHRcdFxyXG5cclxuXHJcblx0XHRcdFx0aWYoSEFNLmluY29taW5nKXtcclxuXHRcdFx0XHRcdGRlbHRhW2ZpZWxkXSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0c3RhdGVfaWZ5KGRlbHRhLCBmaWVsZCwgaXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRHdW4uSEFNLnN5bnRoID0gZnVuY3Rpb24oYXQsIGV2LCBhcyl7IHZhciBndW4gPSB0aGlzLmFzIHx8IGFzO1xyXG5cdFx0XHRcdHZhciBjYXQgPSBndW4uXywgcm9vdCA9IGNhdC5yb290Ll8sIHB1dCA9IHt9LCB0bXA7XHJcblx0XHRcdFx0aWYoIWF0LnB1dCl7XHJcblx0XHRcdFx0XHQvL2lmKG9ial9oYXMoY2F0LCAncHV0JykpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0aWYoY2F0LnB1dCAhPT0gdSl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRjYXQub24oJ2luJywge1xyXG5cdFx0XHRcdFx0Ly9yb290LmFjayhhdFsnQCddLCB7XHJcblx0XHRcdFx0XHRcdGdldDogY2F0LmdldCxcclxuXHRcdFx0XHRcdFx0cHV0OiBjYXQucHV0ID0gdSxcclxuXHRcdFx0XHRcdFx0Z3VuOiBndW4sXHJcblx0XHRcdFx0XHRcdHZpYTogYXRcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIFRPRE86IFBFUkYhIEhhdmUgb3B0aW9ucyB0byBkZXRlcm1pbmUgaWYgdGhpcyBkYXRhIHNob3VsZCBldmVuIGJlIGluIG1lbW9yeSBvbiB0aGlzIHBlZXIhXHJcblx0XHRcdFx0b2JqX21hcChhdC5wdXQsIGZ1bmN0aW9uKG5vZGUsIHNvdWwpeyB2YXIgZ3JhcGggPSB0aGlzLmdyYXBoO1xyXG5cdFx0XHRcdFx0cHV0W3NvdWxdID0gR3VuLkhBTS5kZWx0YShncmFwaFtzb3VsXSwgbm9kZSwge2dyYXBoOiBncmFwaH0pOyAvLyBUT0RPOiBQRVJGISBTRUUgSUYgV0UgQ0FOIE9QVElNSVpFIFRISVMgQlkgTUVSR0lORyBVTklPTiBJTlRPIERFTFRBIVxyXG5cdFx0XHRcdFx0Z3JhcGhbc291bF0gPSBHdW4uSEFNLnVuaW9uKGdyYXBoW3NvdWxdLCBub2RlKSB8fCBncmFwaFtzb3VsXTtcclxuXHRcdFx0XHR9LCByb290KTtcclxuXHRcdFx0XHRpZihhdC5ndW4gIT09IHJvb3QuZ3VuKXtcclxuXHRcdFx0XHRcdHB1dCA9IGF0LnB1dDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gVE9ETzogUEVSRiEgSGF2ZSBvcHRpb25zIHRvIGRldGVybWluZSBpZiB0aGlzIGRhdGEgc2hvdWxkIGV2ZW4gYmUgaW4gbWVtb3J5IG9uIHRoaXMgcGVlciFcclxuXHRcdFx0XHRvYmpfbWFwKHB1dCwgZnVuY3Rpb24obm9kZSwgc291bCl7XHJcblx0XHRcdFx0XHR2YXIgcm9vdCA9IHRoaXMsIG5leHQgPSByb290Lm5leHQgfHwgKHJvb3QubmV4dCA9IHt9KSwgZ3VuID0gbmV4dFtzb3VsXSB8fCAobmV4dFtzb3VsXSA9IHJvb3QuZ3VuLmdldChzb3VsKSksIGNvYXQgPSAoZ3VuLl8pO1xyXG5cdFx0XHRcdFx0Y29hdC5wdXQgPSByb290LmdyYXBoW3NvdWxdOyAvLyBUT0RPOiBCVUchIENsb25lIVxyXG5cdFx0XHRcdFx0aWYoY2F0LmZpZWxkICYmICFvYmpfaGFzKG5vZGUsIGNhdC5maWVsZCkpe1xyXG5cdFx0XHRcdFx0XHQoYXQgPSBvYmpfdG8oYXQsIHt9KSkucHV0ID0gdTtcclxuXHRcdFx0XHRcdFx0R3VuLkhBTS5zeW50aChhdCwgZXYsIGNhdC5ndW4pO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjb2F0Lm9uKCdpbicsIHtcclxuXHRcdFx0XHRcdFx0cHV0OiBub2RlLFxyXG5cdFx0XHRcdFx0XHRnZXQ6IHNvdWwsXHJcblx0XHRcdFx0XHRcdGd1bjogZ3VuLFxyXG5cdFx0XHRcdFx0XHR2aWE6IGF0XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9LCByb290KTtcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHJcblx0XHR2YXIgVHlwZSA9IEd1bjtcclxuXHRcdHZhciBudW0gPSBUeXBlLm51bSwgbnVtX2lzID0gbnVtLmlzO1xyXG5cdFx0dmFyIG9iaiA9IFR5cGUub2JqLCBvYmpfaGFzID0gb2JqLmhhcywgb2JqX3B1dCA9IG9iai5wdXQsIG9ial90byA9IG9iai50bywgb2JqX21hcCA9IG9iai5tYXA7XHJcblx0XHR2YXIgbm9kZSA9IEd1bi5ub2RlLCBub2RlX3NvdWwgPSBub2RlLnNvdWwsIG5vZGVfaXMgPSBub2RlLmlzLCBub2RlX2lmeSA9IG5vZGUuaWZ5O1xyXG5cdFx0dmFyIHN0YXRlID0gR3VuLnN0YXRlLCBzdGF0ZV9pcyA9IHN0YXRlLmlzLCBzdGF0ZV9pZnkgPSBzdGF0ZS5pZnk7XHJcblx0XHR2YXIgdmFsID0gR3VuLnZhbCwgdmFsX2lzID0gdmFsLmlzLCByZWxfaXMgPSB2YWwucmVsLmlzO1xyXG5cdFx0dmFyIHU7XHJcblx0fSkocmVxdWlyZSwgJy4vaW5kZXgnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL3Jvb3QnKTtcclxuXHRcdHJlcXVpcmUoJy4vaW5kZXgnKTsgLy8gVE9ETzogQ0xFQU4gVVAhIE1FUkdFIElOVE8gUk9PVCFcclxuXHRcdHJlcXVpcmUoJy4vb3B0Jyk7XHJcblx0XHRyZXF1aXJlKCcuL2NoYWluJyk7XHJcblx0XHRyZXF1aXJlKCcuL2JhY2snKTtcclxuXHRcdHJlcXVpcmUoJy4vcHV0Jyk7XHJcblx0XHRyZXF1aXJlKCcuL2dldCcpO1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBHdW47XHJcblx0fSkocmVxdWlyZSwgJy4vY29yZScpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vY29yZScpO1xyXG5cdFx0dmFyIG9iaiA9IEd1bi5vYmosIG9ial9pcyA9IG9iai5pcywgb2JqX3B1dCA9IG9iai5wdXQsIG9ial9tYXAgPSBvYmoubWFwLCBvYmpfZW1wdHkgPSBvYmouZW1wdHk7XHJcblx0XHR2YXIgbnVtID0gR3VuLm51bSwgbnVtX2lzID0gbnVtLmlzO1xyXG5cdFx0dmFyIF9zb3VsID0gR3VuLnZhbC5yZWwuXywgX2ZpZWxkID0gJy4nO1xyXG5cclxuXHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdEd1bi5jaGFpbi5rZXkgPSBmdW5jdGlvbihpbmRleCwgY2IsIG9wdCl7XHJcblx0XHRcdFx0aWYoIWluZGV4KXtcclxuXHRcdFx0XHRcdGlmKGNiKXtcclxuXHRcdFx0XHRcdFx0Y2IuY2FsbCh0aGlzLCB7ZXJyOiBHdW4ubG9nKCdObyBrZXkhJyl9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR2YXIgZ3VuID0gdGhpcztcclxuXHRcdFx0XHRpZih0eXBlb2Ygb3B0ID09PSAnc3RyaW5nJyl7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIlBsZWFzZSByZXBvcnQgdGhpcyBhcyBhbiBpc3N1ZSEga2V5Lm9wdC5zdHJpbmdcIik7XHJcblx0XHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihndW4gPT09IGd1bi5fLnJvb3Qpe2lmKGNiKXtjYih7ZXJyOiBHdW4ubG9nKFwiQ2FuJ3QgZG8gdGhhdCBvbiByb290IGluc3RhbmNlLlwiKX0pfTtyZXR1cm4gZ3VufVxyXG5cdFx0XHRcdG9wdCA9IG9wdCB8fCB7fTtcclxuXHRcdFx0XHRvcHQua2V5ID0gaW5kZXg7XHJcblx0XHRcdFx0b3B0LmFueSA9IGNiIHx8IGZ1bmN0aW9uKCl7fTtcclxuXHRcdFx0XHRvcHQucmVmID0gZ3VuLmJhY2soLTEpLmdldChvcHQua2V5KTtcclxuXHRcdFx0XHRvcHQuZ3VuID0gb3B0Lmd1biB8fCBndW47XHJcblx0XHRcdFx0Z3VuLm9uKGtleSwge2FzOiBvcHR9KTtcclxuXHRcdFx0XHRpZighb3B0LmRhdGEpe1xyXG5cdFx0XHRcdFx0b3B0LnJlcyA9IEd1bi5vbi5zdHVuKG9wdC5yZWYpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIGtleShhdCwgZXYpeyB2YXIgb3B0ID0gdGhpcztcclxuXHRcdFx0XHRldi5vZmYoKTtcclxuXHRcdFx0XHRvcHQuc291bCA9IEd1bi5ub2RlLnNvdWwoYXQucHV0KTtcclxuXHRcdFx0XHRpZighb3B0LnNvdWwgfHwgb3B0LmtleSA9PT0gb3B0LnNvdWwpeyByZXR1cm4gb3B0LmRhdGEgPSB7fSB9XHJcblx0XHRcdFx0b3B0LmRhdGEgPSBvYmpfcHV0KHt9LCBrZXllZC5fLCBHdW4ubm9kZS5pZnkob2JqX3B1dCh7fSwgb3B0LnNvdWwsIEd1bi52YWwucmVsLmlmeShvcHQuc291bCkpLCAnIycrb3B0LmtleSsnIycpKTtcclxuXHRcdFx0XHQob3B0LnJlc3x8aWZmZSkoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdG9wdC5yZWYucHV0KG9wdC5kYXRhLCBvcHQuYW55LCB7c291bDogb3B0LmtleSwga2V5OiBvcHQua2V5fSk7XHRcdFx0XHRcclxuXHRcdFx0XHR9LG9wdCk7XHJcblx0XHRcdFx0aWYob3B0LnJlcyl7XHJcblx0XHRcdFx0XHRvcHQucmVzKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIGlmZmUoZm4sYXMpe2ZuLmNhbGwoYXN8fHt9KX1cclxuXHRcdFx0ZnVuY3Rpb24ga2V5ZWQoZil7XHJcblx0XHRcdFx0aWYoIWYgfHwgISgnIycgPT09IGZbMF0gJiYgJyMnID09PSBmW2YubGVuZ3RoLTFdKSl7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIHMgPSBmLnNsaWNlKDEsLTEpO1xyXG5cdFx0XHRcdGlmKCFzKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRyZXR1cm4gcztcclxuXHRcdFx0fVxyXG5cdFx0XHRrZXllZC5fID0gJyMjJztcclxuXHRcdFx0R3VuLm9uKCduZXh0JywgZnVuY3Rpb24oYXQpe1xyXG5cdFx0XHRcdHZhciBndW4gPSBhdC5ndW47XHJcblx0XHRcdFx0aWYoZ3VuLmJhY2soLTEpICE9PSBhdC5iYWNrKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRndW4ub24oJ2luJywgcHNldWRvLCBndW4uXyk7XHJcblx0XHRcdFx0Z3VuLm9uKCdvdXQnLCBub3JtYWxpemUsIGd1bi5fKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdGZ1bmN0aW9uIG5vcm1hbGl6ZShhdCl7IHZhciBjYXQgPSB0aGlzO1xyXG5cdFx0XHRcdGlmKCFhdC5wdXQpe1xyXG5cdFx0XHRcdFx0aWYoYXQuZ2V0KXtcclxuXHRcdFx0XHRcdFx0c2VhcmNoLmNhbGwoYXQuZ3VuPyBhdC5ndW4uXyA6IGNhdCwgYXQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihhdC5vcHQgJiYgYXQub3B0LmtleSl7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIHB1dCA9IGF0LnB1dCwgZ3JhcGggPSBjYXQuZ3VuLmJhY2soLTEpLl8uZ3JhcGg7XHJcblx0XHRcdFx0R3VuLmdyYXBoLmlzKHB1dCwgZnVuY3Rpb24obm9kZSwgc291bCl7XHJcblx0XHRcdFx0XHRpZighR3VuLm5vZGUuaXMoZ3JhcGhbJyMnK3NvdWwrJyMnXSwgZnVuY3Rpb24gZWFjaChyZWwsaWQpe1xyXG5cdFx0XHRcdFx0XHRpZihpZCAhPT0gR3VuLnZhbC5yZWwuaXMocmVsKSl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRcdGlmKHJlbCA9IGdyYXBoWycjJytpZCsnIyddKXtcclxuXHRcdFx0XHRcdFx0XHRHdW4ubm9kZS5pcyhyZWwsIGVhY2gpOyAvLyBjb3JyZWN0IHBhcmFtcz9cclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0R3VuLm5vZGUuc291bC5pZnkocmVsID0gcHV0W2lkXSA9IEd1bi5vYmouY29weShub2RlKSwgaWQpO1xyXG5cdFx0XHRcdFx0fSkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0R3VuLm9iai5kZWwocHV0LCBzb3VsKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBzZWFyY2goYXQpeyB2YXIgY2F0ID0gdGhpcztcclxuXHRcdFx0XHR2YXIgdG1wO1xyXG5cdFx0XHRcdGlmKCFHdW4ub2JqLmlzKHRtcCA9IGF0LmdldCkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGlmKCFHdW4ub2JqLmhhcyh0bXAsICcjJykpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGlmKCh0bXAgPSBhdC5nZXQpICYmIChudWxsID09PSB0bXBbJy4nXSkpe1xyXG5cdFx0XHRcdFx0dG1wWycuJ10gPSAnIyMnO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZigodG1wID0gYXQuZ2V0KSAmJiBHdW4ub2JqLmhhcyh0bXAsICcuJykpe1xyXG5cdFx0XHRcdFx0aWYodG1wWycjJ10pe1xyXG5cdFx0XHRcdFx0XHRjYXQgPSBjYXQucm9vdC5ndW4uZ2V0KHRtcFsnIyddKS5fO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dG1wID0gYXRbJyMnXTtcclxuXHRcdFx0XHRcdGF0WycjJ10gPSBHdW4ub24uYXNrKHByb3h5KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dmFyIHRyaWVkID0ge307XHJcblx0XHRcdFx0ZnVuY3Rpb24gcHJveHkoYWNrLCBldil7XHJcblx0XHRcdFx0XHR2YXIgcHV0ID0gYWNrLnB1dCwgbGV4ID0gYXQuZ2V0O1xyXG5cdFx0XHRcdFx0aWYoIWNhdC5wc2V1ZG8gfHwgYWNrLnZpYSl7IC8vIFRPRE86IEJVRyEgTUVNT1JZIFBFUkYhIFdoYXQgYWJvdXQgdW5zdWJzY3JpYmluZz9cclxuXHRcdFx0XHRcdFx0Ly9ldi5vZmYoKTtcclxuXHRcdFx0XHRcdFx0Ly9hY2sudmlhID0gYWNrLnZpYSB8fCB7fTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIEd1bi5vbi5hY2sodG1wLCBhY2spO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYoYWNrLnB1dCl7XHJcblx0XHRcdFx0XHRcdGlmKCFsZXhbJy4nXSl7XHJcblx0XHRcdFx0XHRcdFx0ZXYub2ZmKCk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIEd1bi5vbi5hY2sodG1wLCBhY2spO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmKG9ial9oYXMoYWNrLnB1dFtsZXhbJyMnXV0sIGxleFsnLiddKSl7XHJcblx0XHRcdFx0XHRcdFx0ZXYub2ZmKCk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIEd1bi5vbi5hY2sodG1wLCBhY2spO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRHdW4ub2JqLm1hcChjYXQuc2VlbiwgZnVuY3Rpb24ocmVmLGlkKXsgLy8gVE9ETzogQlVHISBJbi1tZW1vcnkgdmVyc3VzIGZ1dHVyZT9cclxuXHRcdFx0XHRcdFx0aWYodHJpZWRbaWRdKXtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gR3VuLm9uLmFjayh0bXAsIGFjayk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0dHJpZWRbaWRdID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0cmVmLm9uKCdvdXQnLCB7XHJcblx0XHRcdFx0XHRcdFx0Z3VuOiByZWYsXHJcblx0XHRcdFx0XHRcdFx0Z2V0OiBpZCA9IHsnIyc6IGlkLCAnLic6IGF0LmdldFsnLiddfSxcclxuXHRcdFx0XHRcdFx0XHQnIyc6IEd1bi5vbi5hc2socHJveHkpXHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIHBzZXVkbyhhdCwgZXYpeyB2YXIgY2F0ID0gdGhpcztcclxuXHRcdFx0XHQvLyBUT0RPOiBCVUchIFBzZXVkbyBjYW4ndCBoYW5kbGUgcGx1cmFscyE/XHJcblx0XHRcdFx0aWYoY2F0LnBzZXVkbyl7XHJcblx0XHRcdFx0XHQvL2V2LnN0dW4oKTtyZXR1cm47XHJcblx0XHRcdFx0XHRpZihjYXQucHNldWRvID09PSBhdC5wdXQpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0ZXYuc3R1bigpO1xyXG5cdFx0XHRcdFx0Y2F0LmNoYW5nZSA9IGNhdC5jaGFuZ2VkIHx8IGNhdC5wc2V1ZG87XHJcblx0XHRcdFx0XHRjYXQub24oJ2luJywgR3VuLm9iai50byhhdCwge3B1dDogY2F0LnB1dCA9IGNhdC5wc2V1ZG99KSk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKCFhdC5wdXQpeyByZXR1cm4gfVxyXG5cdFx0XHRcdHZhciByZWwgPSBHdW4udmFsLnJlbC5pcyhhdC5wdXRba2V5ZWQuX10pO1xyXG5cdFx0XHRcdGlmKCFyZWwpeyByZXR1cm4gfVxyXG5cdFx0XHRcdHZhciBzb3VsID0gR3VuLm5vZGUuc291bChhdC5wdXQpLCByZXN1bWUgPSBldi5zdHVuKHJlc3VtZSksIHJvb3QgPSBjYXQuZ3VuLmJhY2soLTEpLCBzZWVuID0gY2F0LnNlZW4gPSB7fTtcclxuXHRcdFx0XHRjYXQucHNldWRvID0gY2F0LnB1dCA9IEd1bi5zdGF0ZS5pZnkoR3VuLm5vZGUuaWZ5KHt9LCBzb3VsKSk7XHJcblx0XHRcdFx0cm9vdC5nZXQocmVsKS5vbihlYWNoLCB7Y2hhbmdlOiB0cnVlfSk7XHJcblx0XHRcdFx0ZnVuY3Rpb24gZWFjaChjaGFuZ2Upe1xyXG5cdFx0XHRcdFx0R3VuLm5vZGUuaXMoY2hhbmdlLCBtYXApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRmdW5jdGlvbiBtYXAocmVsLCBzb3VsKXtcclxuXHRcdFx0XHRcdGlmKHNvdWwgIT09IEd1bi52YWwucmVsLmlzKHJlbCkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0aWYoc2Vlbltzb3VsXSl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRzZWVuW3NvdWxdID0gcm9vdC5nZXQoc291bCkub24ob24sIHRydWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRmdW5jdGlvbiBvbihwdXQpe1xyXG5cdFx0XHRcdFx0aWYoIXB1dCl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRjYXQucHNldWRvID0gR3VuLkhBTS51bmlvbihjYXQucHNldWRvLCBwdXQpIHx8IGNhdC5wc2V1ZG87XHJcblx0XHRcdFx0XHRjYXQuY2hhbmdlID0gY2F0LmNoYW5nZWQgPSBwdXQ7XHJcblx0XHRcdFx0XHRjYXQucHV0ID0gY2F0LnBzZXVkbztcclxuXHRcdFx0XHRcdHJlc3VtZSh7XHJcblx0XHRcdFx0XHRcdGd1bjogY2F0Lmd1bixcclxuXHRcdFx0XHRcdFx0cHV0OiBjYXQucHNldWRvLFxyXG5cdFx0XHRcdFx0XHRnZXQ6IHNvdWxcclxuXHRcdFx0XHRcdFx0Ly92aWE6IHRoaXMuYXRcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgb2JqID0gR3VuLm9iaiwgb2JqX2hhcyA9IG9iai5oYXM7XHJcblx0XHR9KCkpO1xyXG5cclxuXHR9KShyZXF1aXJlLCAnLi9rZXknKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL2NvcmUnKTtcclxuXHRcdEd1bi5jaGFpbi5wYXRoID0gZnVuY3Rpb24oZmllbGQsIGNiLCBvcHQpe1xyXG5cdFx0XHR2YXIgYmFjayA9IHRoaXMsIGd1biA9IGJhY2ssIHRtcDtcclxuXHRcdFx0b3B0ID0gb3B0IHx8IHt9OyBvcHQucGF0aCA9IHRydWU7XHJcblx0XHRcdGlmKGd1biA9PT0gZ3VuLl8ucm9vdCl7aWYoY2Ipe2NiKHtlcnI6IEd1bi5sb2coXCJDYW4ndCBkbyB0aGF0IG9uIHJvb3QgaW5zdGFuY2UuXCIpfSl9cmV0dXJuIGd1bn1cclxuXHRcdFx0aWYodHlwZW9mIGZpZWxkID09PSAnc3RyaW5nJyl7XHJcblx0XHRcdFx0dG1wID0gZmllbGQuc3BsaXQob3B0LnNwbGl0IHx8ICcuJyk7XHJcblx0XHRcdFx0aWYoMSA9PT0gdG1wLmxlbmd0aCl7XHJcblx0XHRcdFx0XHRndW4gPSBiYWNrLmdldChmaWVsZCwgY2IsIG9wdCk7XHJcblx0XHRcdFx0XHRndW4uXy5vcHQgPSBvcHQ7XHJcblx0XHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRmaWVsZCA9IHRtcDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihmaWVsZCBpbnN0YW5jZW9mIEFycmF5KXtcclxuXHRcdFx0XHRpZihmaWVsZC5sZW5ndGggPiAxKXtcclxuXHRcdFx0XHRcdGd1biA9IGJhY2s7XHJcblx0XHRcdFx0XHR2YXIgaSA9IDAsIGwgPSBmaWVsZC5sZW5ndGg7XHJcblx0XHRcdFx0XHRmb3IoaTsgaSA8IGw7IGkrKyl7XHJcblx0XHRcdFx0XHRcdGd1biA9IGd1bi5nZXQoZmllbGRbaV0sIChpKzEgPT09IGwpPyBjYiA6IG51bGwsIG9wdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvL2d1bi5iYWNrID0gYmFjazsgLy8gVE9ETzogQVBJIGNoYW5nZSFcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Z3VuID0gYmFjay5nZXQoZmllbGRbMF0sIGNiLCBvcHQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRndW4uXy5vcHQgPSBvcHQ7XHJcblx0XHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZighZmllbGQgJiYgMCAhPSBmaWVsZCl7XHJcblx0XHRcdFx0cmV0dXJuIGJhY2s7XHJcblx0XHRcdH1cclxuXHRcdFx0Z3VuID0gYmFjay5nZXQoJycrZmllbGQsIGNiLCBvcHQpO1xyXG5cdFx0XHRndW4uXy5vcHQgPSBvcHQ7XHJcblx0XHRcdHJldHVybiBndW47XHJcblx0XHR9XHJcblx0fSkocmVxdWlyZSwgJy4vcGF0aCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vY29yZScpO1xyXG5cdFx0R3VuLmNoYWluLm9uID0gZnVuY3Rpb24odGFnLCBhcmcsIGVhcywgYXMpe1xyXG5cdFx0XHR2YXIgZ3VuID0gdGhpcywgYXQgPSBndW4uXywgdG1wLCBhY3QsIG9mZjtcclxuXHRcdFx0aWYodHlwZW9mIHRhZyA9PT0gJ3N0cmluZycpe1xyXG5cdFx0XHRcdGlmKCFhcmcpeyByZXR1cm4gYXQub24odGFnKSB9XHJcblx0XHRcdFx0YWN0ID0gYXQub24odGFnLCBhcmcsIGVhcyB8fCBhdCwgYXMpO1xyXG5cdFx0XHRcdGlmKGVhcyAmJiBlYXMuZ3VuKXtcclxuXHRcdFx0XHRcdChlYXMuc3VicyB8fCAoZWFzLnN1YnMgPSBbXSkpLnB1c2goYWN0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0b2ZmID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRpZiAoYWN0ICYmIGFjdC5vZmYpIGFjdC5vZmYoKTtcclxuXHRcdFx0XHRcdG9mZi5vZmYoKTtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdG9mZi5vZmYgPSBndW4ub2ZmLmJpbmQoZ3VuKSB8fCBub29wO1xyXG5cdFx0XHRcdGd1bi5vZmYgPSBvZmY7XHJcblx0XHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgb3B0ID0gYXJnO1xyXG5cdFx0XHRvcHQgPSAodHJ1ZSA9PT0gb3B0KT8ge2NoYW5nZTogdHJ1ZX0gOiBvcHQgfHwge307XHJcblx0XHRcdG9wdC5vayA9IHRhZztcclxuXHRcdFx0b3B0Lmxhc3QgPSB7fTtcclxuXHRcdFx0Z3VuLmdldChvaywgb3B0KTsgLy8gVE9ETzogUEVSRiEgRXZlbnQgbGlzdGVuZXIgbGVhayEhIT8/Pz9cclxuXHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBvayhhdCwgZXYpeyB2YXIgb3B0ID0gdGhpcztcclxuXHRcdFx0dmFyIGd1biA9IGF0Lmd1biwgY2F0ID0gZ3VuLl8sIGRhdGEgPSBjYXQucHV0IHx8IGF0LnB1dCwgdG1wID0gb3B0Lmxhc3QsIGlkID0gY2F0LmlkK2F0LmdldCwgdG1wO1xyXG5cdFx0XHRpZih1ID09PSBkYXRhKXtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoZGF0YSAmJiBkYXRhW3JlbC5fXSAmJiAodG1wID0gcmVsLmlzKGRhdGEpKSl7XHJcblx0XHRcdFx0dG1wID0gKGNhdC5yb290LmdldCh0bXApLl8pO1xyXG5cdFx0XHRcdGlmKHUgPT09IHRtcC5wdXQpe1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRkYXRhID0gdG1wLnB1dDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihvcHQuY2hhbmdlKXsgLy8gVE9ETzogQlVHPyBNb3ZlIGFib3ZlIHRoZSB1bmRlZiBjaGVja3M/XHJcblx0XHRcdFx0ZGF0YSA9IGF0LnB1dDtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBERURVUExJQ0FURSAvLyBUT0RPOiBORUVEUyBXT1JLISBCQUQgUFJPVE9UWVBFXHJcblx0XHRcdGlmKHRtcC5wdXQgPT09IGRhdGEgJiYgdG1wLmdldCA9PT0gaWQgJiYgIUd1bi5ub2RlLnNvdWwoZGF0YSkpeyByZXR1cm4gfVxyXG5cdFx0XHR0bXAucHV0ID0gZGF0YTtcclxuXHRcdFx0dG1wLmdldCA9IGlkO1xyXG5cdFx0XHQvLyBERURVUExJQ0FURSAvLyBUT0RPOiBORUVEUyBXT1JLISBCQUQgUFJPVE9UWVBFXHJcblx0XHRcdGNhdC5sYXN0ID0gZGF0YTtcclxuXHRcdFx0aWYob3B0LmFzKXtcclxuXHRcdFx0XHRvcHQub2suY2FsbChvcHQuYXMsIGF0LCBldik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0b3B0Lm9rLmNhbGwoZ3VuLCBkYXRhLCBhdC5nZXQsIGF0LCBldik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRHdW4uY2hhaW4udmFsID0gZnVuY3Rpb24oY2IsIG9wdCl7XHJcblx0XHRcdHZhciBndW4gPSB0aGlzLCBhdCA9IGd1bi5fLCBkYXRhID0gYXQucHV0O1xyXG5cdFx0XHRpZigwIDwgYXQuYWNrICYmIHUgIT09IGRhdGEpe1xyXG5cdFx0XHRcdChjYiB8fCBub29wKS5jYWxsKGd1biwgZGF0YSwgYXQuZ2V0KTtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNiKXtcclxuXHRcdFx0XHQob3B0ID0gb3B0IHx8IHt9KS5vayA9IGNiO1xyXG5cdFx0XHRcdG9wdC5jYXQgPSBhdDtcclxuXHRcdFx0XHRndW4uZ2V0KHZhbCwge2FzOiBvcHR9KTtcclxuXHRcdFx0XHRvcHQuYXN5bmMgPSB0cnVlOyAvL29wdC5hc3luYyA9IGF0LnN0dW4/IDEgOiB0cnVlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdEd1bi5sb2cub25jZShcInZhbG9uY2VcIiwgXCJDaGFpbmFibGUgdmFsIGlzIGV4cGVyaW1lbnRhbCwgaXRzIGJlaGF2aW9yIGFuZCBBUEkgbWF5IGNoYW5nZSBtb3ZpbmcgZm9yd2FyZC4gUGxlYXNlIHBsYXkgd2l0aCBpdCBhbmQgcmVwb3J0IGJ1Z3MgYW5kIGlkZWFzIG9uIGhvdyB0byBpbXByb3ZlIGl0LlwiKTtcclxuXHRcdFx0XHR2YXIgY2hhaW4gPSBndW4uY2hhaW4oKTtcclxuXHRcdFx0XHRjaGFpbi5fLnZhbCA9IGd1bi52YWwoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdGNoYWluLl8ub24oJ2luJywgZ3VuLl8pO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJldHVybiBjaGFpbjtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHZhbChhdCwgZXYsIHRvKXtcclxuXHRcdFx0dmFyIG9wdCA9IHRoaXMuYXMsIGNhdCA9IG9wdC5jYXQsIGd1biA9IGF0Lmd1biwgY29hdCA9IGd1bi5fLCBkYXRhID0gY29hdC5wdXQgfHwgYXQucHV0LCB0bXA7XHJcblx0XHRcdGlmKHUgPT09IGRhdGEpe1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihkYXRhICYmIGRhdGFbcmVsLl9dICYmICh0bXAgPSByZWwuaXMoZGF0YSkpKXtcclxuXHRcdFx0XHR0bXAgPSAoY2F0LnJvb3QuZ2V0KHRtcCkuXyk7XHJcblx0XHRcdFx0aWYodSA9PT0gdG1wLnB1dCl7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGRhdGEgPSB0bXAucHV0O1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGV2LndhaXQpeyBjbGVhclRpbWVvdXQoZXYud2FpdCkgfVxyXG5cdFx0XHQvL2lmKCF0byAmJiAoISgwIDwgY29hdC5hY2spIHx8ICgodHJ1ZSA9PT0gb3B0LmFzeW5jKSAmJiAwICE9PSBvcHQud2FpdCkpKXtcclxuXHRcdFx0aWYoIW9wdC5hc3luYyl7XHJcblx0XHRcdFx0ZXYud2FpdCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdHZhbC5jYWxsKHthczpvcHR9LCBhdCwgZXYsIGV2LndhaXQgfHwgMSlcclxuXHRcdFx0XHR9LCBvcHQud2FpdCB8fCA5OSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNhdC5maWVsZCB8fCBjYXQuc291bCl7XHJcblx0XHRcdFx0aWYoZXYub2ZmKCkpeyByZXR1cm4gfSAvLyBpZiBpdCBpcyBhbHJlYWR5IG9mZiwgZG9uJ3QgY2FsbCBhZ2FpbiFcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZigob3B0LnNlZW4gPSBvcHQuc2VlbiB8fCB7fSlbY29hdC5pZF0peyByZXR1cm4gfVxyXG5cdFx0XHRcdG9wdC5zZWVuW2NvYXQuaWRdID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRvcHQub2suY2FsbChhdC5ndW4gfHwgb3B0Lmd1biwgZGF0YSwgYXQuZ2V0KTtcclxuXHRcdH1cclxuXHJcblx0XHRHdW4uY2hhaW4ub2ZmID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIGd1biA9IHRoaXMsIGF0ID0gZ3VuLl8sIHRtcDtcclxuXHRcdFx0dmFyIGJhY2sgPSBhdC5iYWNrIHx8IHt9LCBjYXQgPSBiYWNrLl87XHJcblx0XHRcdGlmKCFjYXQpeyByZXR1cm4gfVxyXG5cdFx0XHRpZih0bXAgPSBjYXQubmV4dCl7XHJcblx0XHRcdFx0aWYodG1wW2F0LmdldF0pe1xyXG5cdFx0XHRcdFx0b2JqX2RlbCh0bXAsIGF0LmdldCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdG9ial9tYXAodG1wLCBmdW5jdGlvbihwYXRoLCBrZXkpe1xyXG5cdFx0XHRcdFx0XHRpZihndW4gIT09IHBhdGgpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0XHRvYmpfZGVsKHRtcCwga2V5KTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZigodG1wID0gZ3VuLmJhY2soLTEpKSA9PT0gYmFjayl7XHJcblx0XHRcdFx0b2JqX2RlbCh0bXAuZ3JhcGgsIGF0LmdldCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoYXQub25zICYmICh0bXAgPSBhdC5vbnNbJ0AkJ10pKXtcclxuXHRcdFx0XHRvYmpfbWFwKHRtcC5zLCBmdW5jdGlvbihldil7XHJcblx0XHRcdFx0XHRldi5vZmYoKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0fVxyXG5cdFx0dmFyIG9iaiA9IEd1bi5vYmosIG9ial9oYXMgPSBvYmouaGFzLCBvYmpfZGVsID0gb2JqLmRlbCwgb2JqX3RvID0gb2JqLnRvO1xyXG5cdFx0dmFyIHJlbCA9IEd1bi52YWwucmVsO1xyXG5cdFx0dmFyIGVtcHR5ID0ge30sIG5vb3AgPSBmdW5jdGlvbigpe30sIHU7XHJcblx0fSkocmVxdWlyZSwgJy4vb24nKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL2NvcmUnKSwgdTtcclxuXHRcdEd1bi5jaGFpbi5ub3QgPSBmdW5jdGlvbihjYiwgb3B0LCB0KXtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZ2V0KG91Z2h0LCB7bm90OiBjYn0pO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gb3VnaHQoYXQsIGV2KXsgZXYub2ZmKCk7XHJcblx0XHRcdGlmKGF0LmVyciB8fCAodSAhPT0gYXQucHV0KSl7IHJldHVybiB9XHJcblx0XHRcdGlmKCF0aGlzLm5vdCl7IHJldHVybiB9XHJcblx0XHRcdHRoaXMubm90LmNhbGwoYXQuZ3VuLCBhdC5nZXQsIGZ1bmN0aW9uKCl7IGNvbnNvbGUubG9nKFwiUGxlYXNlIHJlcG9ydCB0aGlzIGJ1ZyBvbiBodHRwczovL2dpdHRlci5pbS9hbWFyay9ndW4gYW5kIGluIHRoZSBpc3N1ZXMuXCIpOyBuZWVkLnRvLmltcGxlbWVudDsgfSk7XHJcblx0XHR9XHJcblx0fSkocmVxdWlyZSwgJy4vbm90Jyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9jb3JlJyk7XHJcblx0XHRHdW4uY2hhaW4ubWFwID0gZnVuY3Rpb24oY2IsIG9wdCwgdCl7XHJcblx0XHRcdHZhciBndW4gPSB0aGlzLCBjYXQgPSBndW4uXywgY2hhaW47XHJcblx0XHRcdGlmKCFjYil7XHJcblx0XHRcdFx0aWYoY2hhaW4gPSBjYXQuZmllbGRzKXsgcmV0dXJuIGNoYWluIH1cclxuXHRcdFx0XHRjaGFpbiA9IGNhdC5maWVsZHMgPSBndW4uY2hhaW4oKTtcclxuXHRcdFx0XHRjaGFpbi5fLnZhbCA9IGd1bi5iYWNrKCd2YWwnKTtcclxuXHRcdFx0XHRndW4ub24oJ2luJywgbWFwLCBjaGFpbi5fKTtcclxuXHRcdFx0XHRyZXR1cm4gY2hhaW47XHJcblx0XHRcdH1cclxuXHRcdFx0R3VuLmxvZy5vbmNlKFwibWFwZm5cIiwgXCJNYXAgZnVuY3Rpb25zIGFyZSBleHBlcmltZW50YWwsIHRoZWlyIGJlaGF2aW9yIGFuZCBBUEkgbWF5IGNoYW5nZSBtb3ZpbmcgZm9yd2FyZC4gUGxlYXNlIHBsYXkgd2l0aCBpdCBhbmQgcmVwb3J0IGJ1Z3MgYW5kIGlkZWFzIG9uIGhvdyB0byBpbXByb3ZlIGl0LlwiKTtcclxuXHRcdFx0Y2hhaW4gPSBndW4uY2hhaW4oKTtcclxuXHRcdFx0Z3VuLm1hcCgpLm9uKGZ1bmN0aW9uKGRhdGEsIGtleSwgYXQsIGV2KXtcclxuXHRcdFx0XHR2YXIgbmV4dCA9IChjYnx8bm9vcCkuY2FsbCh0aGlzLCBkYXRhLCBrZXksIGF0LCBldik7XHJcblx0XHRcdFx0aWYodSA9PT0gbmV4dCl7IHJldHVybiB9XHJcblx0XHRcdFx0aWYoR3VuLmlzKG5leHQpKXtcclxuXHRcdFx0XHRcdGNoYWluLl8ub24oJ2luJywgbmV4dC5fKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2hhaW4uXy5vbignaW4nLCB7Z2V0OiBrZXksIHB1dDogbmV4dCwgZ3VuOiBjaGFpbn0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIGNoYWluO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gbWFwKGF0KXtcclxuXHRcdFx0aWYoIWF0LnB1dCB8fCBHdW4udmFsLmlzKGF0LnB1dCkpeyByZXR1cm4gfVxyXG5cdFx0XHRpZih0aGlzLmFzLnZhbCl7IHRoaXMub2ZmKCkgfSAvLyBUT0RPOiBVZ2x5IGhhY2shXHJcblx0XHRcdG9ial9tYXAoYXQucHV0LCBlYWNoLCB7Y2F0OiB0aGlzLmFzLCBndW46IGF0Lmd1bn0pO1xyXG5cdFx0XHR0aGlzLnRvLm5leHQoYXQpO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gZWFjaCh2LGYpe1xyXG5cdFx0XHRpZihuXyA9PT0gZil7IHJldHVybiB9XHJcblx0XHRcdHZhciBjYXQgPSB0aGlzLmNhdCwgZ3VuID0gdGhpcy5ndW4uZ2V0KGYpLCBhdCA9IChndW4uXyk7XHJcblx0XHRcdChhdC5lY2hvIHx8IChhdC5lY2hvID0ge30pKVtjYXQuaWRdID0gY2F0O1xyXG5cdFx0fVxyXG5cdFx0dmFyIG9ial9tYXAgPSBHdW4ub2JqLm1hcCwgbm9vcCA9IGZ1bmN0aW9uKCl7fSwgZXZlbnQgPSB7c3R1bjogbm9vcCwgb2ZmOiBub29wfSwgbl8gPSBHdW4ubm9kZS5fLCB1O1xyXG5cdH0pKHJlcXVpcmUsICcuL21hcCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vY29yZScpO1xyXG5cdFx0R3VuLmNoYWluLnNldCA9IGZ1bmN0aW9uKGl0ZW0sIGNiLCBvcHQpe1xyXG5cdFx0XHR2YXIgZ3VuID0gdGhpcywgc291bDtcclxuXHRcdFx0Y2IgPSBjYiB8fCBmdW5jdGlvbigpe307XHJcblx0XHRcdGlmKHNvdWwgPSBHdW4ubm9kZS5zb3VsKGl0ZW0pKXsgcmV0dXJuIGd1bi5zZXQoZ3VuLmJhY2soLTEpLmdldChzb3VsKSwgY2IsIG9wdCkgfVxyXG5cdFx0XHRpZighR3VuLmlzKGl0ZW0pKXtcclxuXHRcdFx0XHRpZihHdW4ub2JqLmlzKGl0ZW0pKXsgcmV0dXJuIGd1bi5zZXQoZ3VuLl8ucm9vdC5wdXQoaXRlbSksIGNiLCBvcHQpIH1cclxuXHRcdFx0XHRyZXR1cm4gZ3VuLmdldChHdW4udGV4dC5yYW5kb20oKSkucHV0KGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGl0ZW0uZ2V0KCdfJykuZ2V0KGZ1bmN0aW9uKGF0LCBldil7XHJcblx0XHRcdFx0aWYoIWF0Lmd1biB8fCAhYXQuZ3VuLl8uYmFjayk7XHJcblx0XHRcdFx0ZXYub2ZmKCk7XHJcblx0XHRcdFx0YXQgPSAoYXQuZ3VuLl8uYmFjay5fKTtcclxuXHRcdFx0XHR2YXIgcHV0ID0ge30sIG5vZGUgPSBhdC5wdXQsIHNvdWwgPSBHdW4ubm9kZS5zb3VsKG5vZGUpO1xyXG5cdFx0XHRcdGlmKCFzb3VsKXsgcmV0dXJuIGNiLmNhbGwoZ3VuLCB7ZXJyOiBHdW4ubG9nKCdPbmx5IGEgbm9kZSBjYW4gYmUgbGlua2VkISBOb3QgXCInICsgbm9kZSArICdcIiEnKX0pIH1cclxuXHRcdFx0XHRndW4ucHV0KEd1bi5vYmoucHV0KHB1dCwgc291bCwgR3VuLnZhbC5yZWwuaWZ5KHNvdWwpKSwgY2IsIG9wdCk7XHJcblx0XHRcdH0se3dhaXQ6MH0pO1xyXG5cdFx0XHRyZXR1cm4gaXRlbTtcclxuXHRcdH1cclxuXHR9KShyZXF1aXJlLCAnLi9zZXQnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdGlmKHR5cGVvZiBHdW4gPT09ICd1bmRlZmluZWQnKXsgcmV0dXJuIH0gLy8gVE9ETzogbG9jYWxTdG9yYWdlIGlzIEJyb3dzZXIgb25seS4gQnV0IGl0IHdvdWxkIGJlIG5pY2UgaWYgaXQgY291bGQgc29tZWhvdyBwbHVnaW4gaW50byBOb2RlSlMgY29tcGF0aWJsZSBsb2NhbFN0b3JhZ2UgQVBJcz9cclxuXHJcblx0XHR2YXIgcm9vdCwgbm9vcCA9IGZ1bmN0aW9uKCl7fSwgdTtcclxuXHRcdGlmKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKXsgcm9vdCA9IHdpbmRvdyB9XHJcblx0XHR2YXIgc3RvcmUgPSByb290LmxvY2FsU3RvcmFnZSB8fCB7c2V0SXRlbTogbm9vcCwgcmVtb3ZlSXRlbTogbm9vcCwgZ2V0SXRlbTogbm9vcH07XHJcblxyXG5cdFx0dmFyIGNoZWNrID0ge30sIGRpcnR5ID0ge30sIGFzeW5jID0ge30sIGNvdW50ID0gMCwgbWF4ID0gMTAwMDAsIHdhaXQ7XHJcblx0XHRcclxuXHRcdEd1bi5vbigncHV0JywgZnVuY3Rpb24oYXQpeyB2YXIgZXJyLCBpZCwgb3B0LCByb290ID0gYXQuZ3VuLl8ucm9vdDtcclxuXHRcdFx0dGhpcy50by5uZXh0KGF0KTtcclxuXHRcdFx0KG9wdCA9IHt9KS5wcmVmaXggPSAoYXQub3B0IHx8IG9wdCkucHJlZml4IHx8IGF0Lmd1bi5iYWNrKCdvcHQucHJlZml4JykgfHwgJ2d1bi8nO1xyXG5cdFx0XHR2YXIgZ3JhcGggPSByb290Ll8uZ3JhcGg7XHJcblx0XHRcdFxyXG5cdFx0XHRHdW4ub2JqLm1hcChhdC5wdXQsIGZ1bmN0aW9uKG5vZGUsIHNvdWwpe1xyXG5cdFx0XHRcdGFzeW5jW3NvdWxdID0gZ3JhcGhbc291bF0gfHwgbm9kZTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdGNvdW50ICs9IDE7XHJcblx0XHRcdGNoZWNrW2F0WycjJ11dID0gcm9vdDtcclxuXHRcdFx0ZnVuY3Rpb24gc2F2ZSgpe1xyXG5cdFx0XHRcdGNsZWFyVGltZW91dCh3YWl0KTtcclxuXHRcdFx0XHR2YXIgYWNrID0gY2hlY2s7XHJcblx0XHRcdFx0dmFyIGFsbCA9IGFzeW5jO1xyXG5cdFx0XHRcdGNvdW50ID0gMDtcclxuXHRcdFx0XHR3YWl0ID0gZmFsc2U7XHJcblx0XHRcdFx0Y2hlY2sgPSB7fTtcclxuXHRcdFx0XHRhc3luYyA9IHt9O1xyXG5cdFx0XHRcdEd1bi5vYmoubWFwKGFsbCwgZnVuY3Rpb24obm9kZSwgc291bCl7XHJcblx0XHRcdFx0XHQvLyBTaW5jZSBsb2NhbFN0b3JhZ2Ugb25seSBoYXMgNU1CLCBpdCBpcyBiZXR0ZXIgdGhhdCB3ZSBrZWVwIG9ubHlcclxuXHRcdFx0XHRcdC8vIHRoZSBkYXRhIHRoYXQgdGhlIHVzZXIgaXMgY3VycmVudGx5IGludGVyZXN0ZWQgaW4uXHJcblx0XHRcdFx0XHRub2RlID0gZ3JhcGhbc291bF0gfHwgYWxsW3NvdWxdO1xyXG5cdFx0XHRcdFx0dHJ5e3N0b3JlLnNldEl0ZW0ob3B0LnByZWZpeCArIHNvdWwsIEpTT04uc3RyaW5naWZ5KG5vZGUpKTtcclxuXHRcdFx0XHRcdH1jYXRjaChlKXsgZXJyID0gZSB8fCBcImxvY2FsU3RvcmFnZSBmYWlsdXJlXCIgfVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdGlmKCFHdW4ub2JqLmVtcHR5KGF0Lmd1bi5iYWNrKCdvcHQucGVlcnMnKSkpeyByZXR1cm4gfSAvLyBvbmx5IGFjayBpZiB0aGVyZSBhcmUgbm8gcGVlcnMuXHJcblx0XHRcdFx0R3VuLm9iai5tYXAoYWNrLCBmdW5jdGlvbihyb290LCBpZCl7XHJcblx0XHRcdFx0XHRyb290Lm9uKCdpbicsIHtcclxuXHRcdFx0XHRcdFx0J0AnOiBpZCxcclxuXHRcdFx0XHRcdFx0ZXJyOiBlcnIsXHJcblx0XHRcdFx0XHRcdG9rOiAwIC8vIGxvY2FsU3RvcmFnZSBpc24ndCByZWxpYWJsZSwgc28gbWFrZSBpdHMgYG9rYCBjb2RlIGJlIGEgbG93IG51bWJlci5cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNvdW50ID49IG1heCl7IC8vIGdvYWwgaXMgdG8gZG8gMTBLIGluc2VydHMvc2Vjb25kLlxyXG5cdFx0XHRcdHJldHVybiBzYXZlKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYod2FpdCl7IHJldHVybiB9XHJcblx0XHRcdGNsZWFyVGltZW91dCh3YWl0KTtcclxuXHRcdFx0d2FpdCA9IHNldFRpbWVvdXQoc2F2ZSwgMTAwMCk7XHJcblx0XHR9KTtcclxuXHRcdEd1bi5vbignZ2V0JywgZnVuY3Rpb24oYXQpe1xyXG5cdFx0XHR0aGlzLnRvLm5leHQoYXQpO1xyXG5cdFx0XHR2YXIgZ3VuID0gYXQuZ3VuLCBsZXggPSBhdC5nZXQsIHNvdWwsIGRhdGEsIG9wdCwgdTtcclxuXHRcdFx0Ly9zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdChvcHQgPSBhdC5vcHQgfHwge30pLnByZWZpeCA9IG9wdC5wcmVmaXggfHwgYXQuZ3VuLmJhY2soJ29wdC5wcmVmaXgnKSB8fCAnZ3VuLyc7XHJcblx0XHRcdGlmKCFsZXggfHwgIShzb3VsID0gbGV4W0d1bi5fLnNvdWxdKSl7IHJldHVybiB9XHJcblx0XHRcdC8vaWYoMCA+PSBhdC5jYXApeyByZXR1cm4gfVxyXG5cdFx0XHR2YXIgZmllbGQgPSBsZXhbJy4nXTtcclxuXHJcblx0XHRcdGRhdGEgPSBHdW4ub2JqLmlmeShzdG9yZS5nZXRJdGVtKG9wdC5wcmVmaXggKyBzb3VsKSB8fCBudWxsKSB8fCBhc3luY1tzb3VsXSB8fCB1O1xyXG5cdFx0XHRpZihkYXRhICYmIGZpZWxkKXtcclxuXHRcdFx0XHRkYXRhID0gR3VuLnN0YXRlLmlmeSh1LCBmaWVsZCwgR3VuLnN0YXRlLmlzKGRhdGEsIGZpZWxkKSwgZGF0YVtmaWVsZF0sIHNvdWwpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCFkYXRhICYmICFHdW4ub2JqLmVtcHR5KGd1bi5iYWNrKCdvcHQucGVlcnMnKSkpeyAvLyBpZiBkYXRhIG5vdCBmb3VuZCwgZG9uJ3QgYWNrIGlmIHRoZXJlIGFyZSBwZWVycy5cclxuXHRcdFx0XHRyZXR1cm47IC8vIEhtbSwgd2hhdCBpZiB3ZSBoYXZlIHBlZXJzIGJ1dCB3ZSBhcmUgZGlzY29ubmVjdGVkP1xyXG5cdFx0XHR9XHJcblx0XHRcdGd1bi5vbignaW4nLCB7J0AnOiBhdFsnIyddLCBwdXQ6IEd1bi5ncmFwaC5ub2RlKGRhdGEpLCBob3c6ICdsUyd9KTtcclxuXHRcdFx0Ly99LDExKTtcclxuXHRcdH0pO1xyXG5cdH0pKHJlcXVpcmUsICcuL2FkYXB0ZXJzL2xvY2FsU3RvcmFnZScpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vY29yZScpO1xyXG5cclxuXHRcdGlmICh0eXBlb2YgSlNPTiA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFxyXG5cdFx0XHRcdCdHdW4gZGVwZW5kcyBvbiBKU09OLiBQbGVhc2UgbG9hZCBpdCBmaXJzdDpcXG4nICtcclxuXHRcdFx0XHQnYWpheC5jZG5qcy5jb20vYWpheC9saWJzL2pzb24yLzIwMTEwMjIzL2pzb24yLmpzJ1xyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBXZWJTb2NrZXQ7XHJcblx0XHRpZih0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyl7XHJcblx0XHRcdFdlYlNvY2tldCA9IHdpbmRvdy5XZWJTb2NrZXQgfHwgd2luZG93LndlYmtpdFdlYlNvY2tldCB8fCB3aW5kb3cubW96V2ViU29ja2V0O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0dmFyIG1lc3NhZ2UsIGNvdW50ID0gMCwgbm9vcCA9IGZ1bmN0aW9uKCl7fSwgd2FpdDtcclxuXHJcblx0XHRHdW4ub24oJ291dCcsIGZ1bmN0aW9uKGF0KXtcclxuXHRcdFx0dGhpcy50by5uZXh0KGF0KTtcclxuXHRcdFx0dmFyIGNhdCA9IGF0Lmd1bi5fLnJvb3QuXywgd3NwID0gY2F0LndzcCB8fCAoY2F0LndzcCA9IHt9KTtcclxuXHRcdFx0aWYoYXQud3NwICYmIDEgPT09IHdzcC5jb3VudCl7IHJldHVybiB9IC8vIGlmIHRoZSBtZXNzYWdlIGNhbWUgRlJPTSB0aGUgb25seSBwZWVyIHdlIGFyZSBjb25uZWN0ZWQgdG8sIGRvbid0IGVjaG8gaXQgYmFjay5cclxuXHRcdFx0bWVzc2FnZSA9IEpTT04uc3RyaW5naWZ5KGF0KTtcclxuXHRcdFx0Ly9pZigrK2NvdW50KXsgY29uc29sZS5sb2coXCJtc2cgT1VUOlwiLCBjb3VudCwgR3VuLm9iai5pZnkobWVzc2FnZSkpIH1cclxuXHRcdFx0aWYoY2F0LnVkcmFpbil7XHJcblx0XHRcdFx0Y2F0LnVkcmFpbi5wdXNoKG1lc3NhZ2UpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYXQudWRyYWluID0gW107XHJcblx0XHRcdGNsZWFyVGltZW91dCh3YWl0KTtcclxuXHRcdFx0d2FpdCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRpZighY2F0LnVkcmFpbil7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIHRtcCA9IGNhdC51ZHJhaW47XHJcblx0XHRcdFx0Y2F0LnVkcmFpbiA9IG51bGw7XHJcblx0XHRcdFx0aWYoIHRtcC5sZW5ndGggKSB7XHJcblx0XHRcdFx0XHRtZXNzYWdlID0gSlNPTi5zdHJpbmdpZnkodG1wKTtcclxuXHRcdFx0XHRcdEd1bi5vYmoubWFwKGNhdC5vcHQucGVlcnMsIHNlbmQsIGNhdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LDEpO1xyXG5cdFx0XHR3c3AuY291bnQgPSAwO1xyXG5cdFx0XHRHdW4ub2JqLm1hcChjYXQub3B0LnBlZXJzLCBzZW5kLCBjYXQpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gc2VuZChwZWVyKXtcclxuXHRcdFx0dmFyIG1zZyA9IG1lc3NhZ2UsIGNhdCA9IHRoaXM7XHJcblx0XHRcdHZhciB3aXJlID0gcGVlci53aXJlIHx8IG9wZW4ocGVlciwgY2F0KTtcclxuXHRcdFx0aWYoY2F0LndzcCl7IGNhdC53c3AuY291bnQrKyB9XHJcblx0XHRcdGlmKCF3aXJlKXsgcmV0dXJuIH1cclxuXHRcdFx0aWYod2lyZS5yZWFkeVN0YXRlID09PSB3aXJlLk9QRU4pe1xyXG5cdFx0XHRcdHdpcmUuc2VuZChtc2cpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHQocGVlci5xdWV1ZSA9IHBlZXIucXVldWUgfHwgW10pLnB1c2gobXNnKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiByZWNlaXZlKG1zZywgcGVlciwgY2F0KXtcclxuXHRcdFx0aWYoIWNhdCB8fCAhbXNnKXsgcmV0dXJuIH1cclxuXHRcdFx0dHJ5e21zZyA9IEpTT04ucGFyc2UobXNnLmRhdGEgfHwgbXNnKTtcclxuXHRcdFx0fWNhdGNoKGUpe31cclxuXHRcdFx0aWYobXNnIGluc3RhbmNlb2YgQXJyYXkpe1xyXG5cdFx0XHRcdHZhciBpID0gMCwgbTtcclxuXHRcdFx0XHR3aGlsZShtID0gbXNnW2krK10pe1xyXG5cdFx0XHRcdFx0cmVjZWl2ZShtLCBwZWVyLCBjYXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0Ly9pZigrK2NvdW50KXsgY29uc29sZS5sb2coXCJtc2cgaW46XCIsIGNvdW50LCBtc2cuYm9keSB8fCBtc2cpIH1cclxuXHRcdFx0aWYoY2F0LndzcCAmJiAxID09PSBjYXQud3NwLmNvdW50KXsgKG1zZy5ib2R5IHx8IG1zZykud3NwID0gbm9vcCB9IC8vIElmIHRoZXJlIGlzIG9ubHkgMSBjbGllbnQsIGp1c3QgdXNlIG5vb3Agc2luY2UgaXQgZG9lc24ndCBtYXR0ZXIuXHJcblx0XHRcdGNhdC5ndW4ub24oJ2luJywgbXNnLmJvZHkgfHwgbXNnKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBvcGVuKHBlZXIsIGFzKXtcclxuXHRcdFx0aWYoIXBlZXIgfHwgIXBlZXIudXJsKXsgcmV0dXJuIH1cclxuXHRcdFx0dmFyIHVybCA9IHBlZXIudXJsLnJlcGxhY2UoJ2h0dHAnLCAnd3MnKTtcclxuXHRcdFx0dmFyIHdpcmUgPSBwZWVyLndpcmUgPSBuZXcgV2ViU29ja2V0KHVybCwgYXMub3B0LndzYy5wcm90b2NvbHMsIGFzLm9wdC53c2MgKTtcclxuXHRcdFx0d2lyZS5vbmNsb3NlID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZWNvbm5lY3QocGVlciwgYXMpO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHR3aXJlLm9uZXJyb3IgPSBmdW5jdGlvbihlcnJvcil7XHJcblx0XHRcdFx0cmVjb25uZWN0KHBlZXIsIGFzKTtcclxuXHRcdFx0XHRpZighZXJyb3IpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGlmKGVycm9yLmNvZGUgPT09ICdFQ09OTlJFRlVTRUQnKXtcclxuXHRcdFx0XHRcdC8vcmVjb25uZWN0KHBlZXIsIGFzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdHdpcmUub25vcGVuID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgcXVldWUgPSBwZWVyLnF1ZXVlO1xyXG5cdFx0XHRcdHBlZXIucXVldWUgPSBbXTtcclxuXHRcdFx0XHRHdW4ub2JqLm1hcChxdWV1ZSwgZnVuY3Rpb24obXNnKXtcclxuXHRcdFx0XHRcdG1lc3NhZ2UgPSBtc2c7XHJcblx0XHRcdFx0XHRzZW5kLmNhbGwoYXMsIHBlZXIpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdHdpcmUub25tZXNzYWdlID0gZnVuY3Rpb24obXNnKXtcclxuXHRcdFx0XHRyZWNlaXZlKG1zZywgcGVlciwgYXMpO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHRyZXR1cm4gd2lyZTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiByZWNvbm5lY3QocGVlciwgYXMpe1xyXG5cdFx0XHRjbGVhclRpbWVvdXQocGVlci5kZWZlcik7XHJcblx0XHRcdHBlZXIuZGVmZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0b3BlbihwZWVyLCBhcyk7XHJcblx0XHRcdH0sIDIgKiAxMDAwKTtcclxuXHRcdH1cclxuXHR9KShyZXF1aXJlLCAnLi9wb2x5ZmlsbC9yZXF1ZXN0Jyk7XHJcblxyXG59KCkpO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2d1bi9ndW4uanMiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1vZHVsZSkge1xyXG5cdGlmKCFtb2R1bGUud2VicGFja1BvbHlmaWxsKSB7XHJcblx0XHRtb2R1bGUuZGVwcmVjYXRlID0gZnVuY3Rpb24oKSB7fTtcclxuXHRcdG1vZHVsZS5wYXRocyA9IFtdO1xyXG5cdFx0Ly8gbW9kdWxlLnBhcmVudCA9IHVuZGVmaW5lZCBieSBkZWZhdWx0XHJcblx0XHRtb2R1bGUuY2hpbGRyZW4gPSBbXTtcclxuXHRcdG1vZHVsZS53ZWJwYWNrUG9seWZpbGwgPSAxO1xyXG5cdH1cclxuXHRyZXR1cm4gbW9kdWxlO1xyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAod2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanMiLCJ2YXIgaW5kZXhQYXJ0aWFsID0gcmVxdWlyZShcInJhdy1sb2FkZXIhLi4vLi4vdmlld3MvcGFydGlhbHMvaW5kZXguaHRtbFwiKTtcbmV4cG9ydCBjbGFzcyBJbmRleFBhZ2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSBgXG4gICAgICAgIDxwPiR7aW5kZXhQYXJ0aWFsfTwvcD5cbiAgICAgICAgYDtcbiAgICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJpbmRleC1wYWdlXCIsIEluZGV4UGFnZSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFnZXMvaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+aW5kZXg8L3A+XFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmF3LWxvYWRlciEuL3ZpZXdzL3BhcnRpYWxzL2luZGV4Lmh0bWxcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIHJvYWRtYXBQYXJ0aWFsID0gcmVxdWlyZShcInJhdy1sb2FkZXIhLi4vLi4vdmlld3MvcGFydGlhbHMvcm9hZG1hcC5odG1sXCIpO1xuZXhwb3J0IGNsYXNzIFJvYWRtYXBQYWdlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICAgIGF0dGFjaGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuaW5uZXJIVE1MID0gJzxwPicgKyByb2FkbWFwUGFydGlhbCArICc8L3A+JztcbiAgICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJyb2FkbWFwLXBhZ2VcIiwgUm9hZG1hcFBhZ2UpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhZ2VzL3JvYWRtYXAuanMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPHNwYW4gY2xhc3M9XFxcInJvYWRtYXBcXFwiPlxcbiAgICA8ZGV0YWlscz5cXG4gICAgPHN1bW1hcnk+cm9hZCBtYXA8L3N1bW1hcnk+XFxuICAgIDx1bD5cXG4gICAgICAgIDxsaT48ZGVsPjxhIGhyZWY9XFxcImh0dHBzOi8vZ2l0aHViLmNvbS9jb2xlYWxib24vaG90bGlwcy9jb21taXQvM2I3MDk4MWNiZTRlMTFlMTQwMGFlOGU5NDhhMDZlMzU4MmQ5YzJkMlxcXCI+SW5zdGFsbCBub2RlL2tvYS93ZWJwYWNrPC9hPjwvZGVsPjwvbGk+XFxuICAgICAgICA8bGk+PGRlbD48YSBocmVmPVxcXCJodHRwczovL2dpdGh1Yi5jb20vY29sZWFsYm9uL2hvdGxpcHMvaXNzdWVzLzJcXFwiPkluc3RhbGwgZ3VuZGI8L2E+PC9kZWw+PC9saT5cXG4gICAgICAgIDxsaT48ZGVsPm1ha2UgYSA8YSBocmVmPVxcXCIjL2RlY2tcXFwiPmRlY2s8L2E+IG9mIGNhcmRzPC9kZWw+PC9saT5cXG4gICAgICAgIDxsaT48ZGVsPkFsaWNlIGFuZCBCb2IgPGEgaHJlZj1cXFwiIy9tZXNzYWdlXFxcIj5pZGVudGlmeTwvYT48L2RlbD48L2xpPlxcbiAgICAgICAgPGxpPjxkZWw+QWxpY2UgYW5kIEJvYiA8YSBocmVmPVxcXCIjL2Nvbm5lY3RcXFwiPmNvbm5lY3Q8L2E+PC9kZWw+PC9saT5cXG4gICAgICAgIDxsaT48ZGVsPkFsaWNlIGFuZCBCb2IgPGEgaHJlZj1cXFwiaHR0cHM6Ly9naXRodWIuY29tL2NvbGVhbGJvbi9zdHJlYW1saW5lclxcXCI+ZXhjaGFuZ2Uga2V5czwvYT48L2RlbD88L2xpPlxcbiAgICAgICAgPGxpPkFsaWNlIGFuZCBCb2IgYWdyZWUgb24gYSBjZXJ0YWluIFxcXCI8YSBocmVmPVxcXCIjL2RlY2tcXFwiPmRlY2s8L2E+XFxcIiBvZiBjYXJkcy4gSW4gcHJhY3RpY2UsIHRoaXMgbWVhbnMgdGhleSBhZ3JlZSBvbiBhIHNldCBvZiBudW1iZXJzIG9yIG90aGVyIGRhdGEgc3VjaCB0aGF0IGVhY2ggZWxlbWVudCBvZiB0aGUgc2V0IHJlcHJlc2VudHMgYSBjYXJkLjwvbGk+XFxuICAgICAgICA8bGk+QWxpY2UgcGlja3MgYW4gZW5jcnlwdGlvbiBrZXkgQSBhbmQgdXNlcyB0aGlzIHRvIGVuY3J5cHQgZWFjaCBjYXJkIG9mIHRoZSBkZWNrLjwvbGk+XFxuICAgICAgICA8bGk+QWxpY2UgPGEgaHJlZj1cXFwiaHR0cHM6Ly9ib3N0Lm9ja3Mub3JnL21pa2Uvc2h1ZmZsZS9cXFwiPnNodWZmbGVzPC9hPiB0aGUgY2FyZHMuPC9saT5cXG4gICAgICAgIDxsaT5BbGljZSBwYXNzZXMgdGhlIGVuY3J5cHRlZCBhbmQgc2h1ZmZsZWQgZGVjayB0byBCb2IuIFdpdGggdGhlIGVuY3J5cHRpb24gaW4gcGxhY2UsIEJvYiBjYW5ub3Qga25vdyB3aGljaCBjYXJkIGlzIHdoaWNoLjwvbGk+XFxuICAgICAgICA8bGk+Qm9iIHNodWZmbGVzIHRoZSBkZWNrLjwvbGk+XFxuICAgICAgICA8bGk+Qm9iIHBhc3NlcyB0aGUgZG91YmxlIGVuY3J5cHRlZCBhbmQgc2h1ZmZsZWQgZGVjayBiYWNrIHRvIEFsaWNlLjwvbGk+XFxuICAgICAgICA8bGk+QWxpY2UgZGVjcnlwdHMgZWFjaCBjYXJkIHVzaW5nIGhlciBrZXkgQS4gVGhpcyBzdGlsbCBsZWF2ZXMgQm9iJ3MgZW5jcnlwdGlvbiBpbiBwbGFjZSB0aG91Z2ggc28gc2hlIGNhbm5vdCBrbm93IHdoaWNoIGNhcmQgaXMgd2hpY2guPC9saT5cXG4gICAgICAgIDxsaT5BbGljZSBwaWNrcyBvbmUgZW5jcnlwdGlvbiBrZXkgZm9yIGVhY2ggY2FyZCAoQTEsIEEyLCBldGMuKSBhbmQgZW5jcnlwdHMgdGhlbSBpbmRpdmlkdWFsbHkuPC9saT5cXG4gICAgICAgIDxsaT5BbGljZSBwYXNzZXMgdGhlIGRlY2sgdG8gQm9iLjwvbGk+XFxuICAgICAgICA8bGk+Qm9iIGRlY3J5cHRzIGVhY2ggY2FyZCB1c2luZyBoaXMga2V5IEIuIFRoaXMgc3RpbGwgbGVhdmVzIEFsaWNlJ3MgaW5kaXZpZHVhbCBlbmNyeXB0aW9uIGluIHBsYWNlIHRob3VnaCBzbyBoZSBjYW5ub3Qga25vdyB3aGljaCBjYXJkIGlzIHdoaWNoLjwvbGk+XFxuICAgICAgICA8bGk+Qm9iIHBpY2tzIG9uZSBlbmNyeXB0aW9uIGtleSBmb3IgZWFjaCBjYXJkIChCMSwgQjIsIGV0Yy4pIGFuZCBlbmNyeXB0cyB0aGVtIGluZGl2aWR1YWxseS48L2xpPlxcbiAgICAgICAgPGxpPkJvYiBwYXNzZXMgdGhlIGRlY2sgYmFjayB0byBBbGljZS48L2xpPlxcbiAgICAgICAgPGxpPkFsaWNlIHB1Ymxpc2hlcyB0aGUgZGVjayBmb3IgZXZlcnlvbmUgcGxheWluZyAoaW4gdGhpcyBjYXNlIG9ubHkgQWxpY2UgYW5kIEJvYiwgc2VlIGJlbG93IG9uIGV4cGFuc2lvbiB0aG91Z2gpLjwvbGk+XFxuICAgIDwvdWw+XFxuPC9kZXRhaWxzPlxcbjwvc3Bhbj5cXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yYXctbG9hZGVyIS4vdmlld3MvcGFydGlhbHMvcm9hZG1hcC5odG1sXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImxldCBjb250YWN0UGFydGlhbCA9IHJlcXVpcmUoXCJyYXctbG9hZGVyIS4uLy4uL3ZpZXdzL3BhcnRpYWxzL2NvbnRhY3QuaHRtbFwiKTtcbmV4cG9ydCBjbGFzcyBDb250YWN0UGFnZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLmlubmVySFRNTCA9ICc8cD4nICsgY29udGFjdFBhcnRpYWwgKyAnPC9wPic7XG4gICAgfVxufVxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwiY29udGFjdC1wYWdlXCIsIENvbnRhY3RQYWdlKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYWdlcy9jb250YWN0LmpzIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxzcGFuIGNsYXNzPVxcXCJjb250YWN0XFxcIj5cXG4gICAgQ29sZSBBbGJvbjxicj5cXG4gICAgPGEgaHJlZj1cXFwidGVsOisxNDE1NjcyMTY0OFxcXCI+KDQxNSkgNjcyLTE2NDg8L2E+PGJyPlxcbiAgICA8YSBocmVmPVxcXCJtYWlsdG86Y29sZS5hbGJvbkBnbWFpbC5jb21cXFwiPmNvbGUuYWxib25AZ21haWwuY29tPC9hPjxicj5cXG4gICAgPGEgaHJlZj1cXFwiaHR0cHM6Ly9naXRodWIuY29tL2NvbGVhbGJvblxcXCI+aHR0cHM6Ly9naXRodWIuY29tL2NvbGVhbGJvbjwvYT48YnI+XFxuICAgIDxhIGhyZWY9XFxcImh0dHBzOi8vd3d3LmxpbmtlZGluLmNvbS9pbi9jb2xlLWFsYm9uLTU5MzQ2MzRcXFwiPlxcbiAgICAgICAgPHNwYW4gaWQ9XFxcImxpbmtlZGluYWRkcmVzc1xcXCIgY2xhc3M9XFxcImxpbmtlZGluYWRkcmVzc1xcXCI+aHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL2NvbGUtYWxib24tNTkzNDYzNDwvc3Bhbj5cXG4gICAgPC9hPjxicj5cXG48L3NwYW4+XFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmF3LWxvYWRlciEuL3ZpZXdzL3BhcnRpYWxzL2NvbnRhY3QuaHRtbFxuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGNsaWVudFB1YmtleUZvcm1QYXJ0aWFsID0gcmVxdWlyZShcInJhdy1sb2FkZXIhLi4vLi4vdmlld3MvcGFydGlhbHMvbWVzc2FnZV9mb3JtLmh0bWxcIik7XG5cbmV4cG9ydCBjbGFzcyBNZXNzYWdlUGFnZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLmlubmVySFRNTCA9IGBcbiAgICAgICAgICAgIDxwPiR7Y2xpZW50UHVia2V5Rm9ybVBhcnRpYWx9PC9wPlxuICAgICAgICBgXG4gICAgfVxufVxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwibWVzc2FnZS1wYWdlXCIsIE1lc3NhZ2VQYWdlKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYWdlcy9tZXNzYWdlLmpzIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxmb3JtXFxuICAgIGlkPVxcXCJtZXNzYWdlX2Zvcm1cXFwiXFxuICAgIG9uc3VibWl0PVxcXCJcXG4gICAgIHZhciBndW4gPSBHdW4obG9jYXRpb24ub3JpZ2luICsgJy9ndW4nKTtcXG4gICAgIG9wZW5wZ3AuY29uZmlnLmFlYWRfcHJvdGVjdCA9IHRydWVcXG4gICAgIG9wZW5wZ3AuaW5pdFdvcmtlcih7IHBhdGg6Jy9qcy9vcGVucGdwLndvcmtlci5qcycgfSlcXG4gICAgIGlmICghbWVzc2FnZV90eHQudmFsdWUpIHtcXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXFxuICAgICB9XFxuICAgICB3aW5kb3cuaGFuZGxlUG9zdChtZXNzYWdlX3R4dC52YWx1ZSkob3BlbnBncCkod2luZG93LmxvY2FsU3RvcmFnZSkoJ3JveWFsZScpLnRoZW4ocmVzdWx0ID0+IHtpZiAocmVzdWx0KSB7Y29uc29sZS5sb2cocmVzdWx0KX19KS5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcihlcnIpKTtkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVzc2FnZV90eHQnKS52YWx1ZSA9ICcnOyByZXR1cm4gZmFsc2VcXFwiXFxuICAgIG1ldGhvZD1cXFwicG9zdFxcXCJcXG4gICAgYWN0aW9uPVxcXCIvbWVzc2FnZVxcXCI+XFxuICAgIDxpbnB1dCBpZD1cXFwibWVzc2FnZV9mb3JtX2lucHV0XFxcIlxcbiAgICAgICAgdHlwZT1cXFwic3VibWl0XFxcIlxcbiAgICAgICAgdmFsdWU9XFxcInBvc3QgbWVzc2FnZVxcXCJcXG4gICAgICAgIGZvcm09XFxcIm1lc3NhZ2VfZm9ybVxcXCJcXG4gICAgICAgID5cXG48L2Zvcm0+XFxuPHRleHRhcmVhXFxuICAgIGlkPVxcXCJtZXNzYWdlX3R4dFxcXCJcXG4gICAgbmFtZT1cXFwibWVzc2FnZV90eHRcXFwiXFxuICAgIGZvcm09XFxcIm1lc3NhZ2VfZm9ybVxcXCJcXG4gICAgcm93cz01MVxcbiAgICBjb2xzPTcwXFxuICAgIHBsYWNlaG9sZGVyPVxcXCJwYXN0ZSBwbGFpbnRleHQgbWVzc2FnZSwgcHVibGljIGtleSwgb3IgcHJpdmF0ZSBrZXlcXFwiXFxuICAgIHN0eWxlPVxcXCJmb250LWZhbWlseTpNZW5sbyxDb25zb2xhcyxNb25hY28sTHVjaWRhIENvbnNvbGUsTGliZXJhdGlvbiBNb25vLERlamFWdSBTYW5zIE1vbm8sQml0c3RyZWFtIFZlcmEgU2FucyBNb25vLENvdXJpZXIgTmV3LCBtb25vc3BhY2U7XFxcIlxcbiAgICA+XFxuPC90ZXh0YXJlYT5cXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yYXctbG9hZGVyIS4vdmlld3MvcGFydGlhbHMvbWVzc2FnZV9mb3JtLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBmcmVzaERlY2tQYXJ0aWFsID0gcmVxdWlyZShcInJhdy1sb2FkZXIhLi4vLi4vdmlld3MvcGFydGlhbHMvZnJlc2hkZWNrLmh0bWxcIik7XG5cbmV4cG9ydCBjbGFzcyBEZWNrUGFnZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLmlubmVySFRNTCA9ICc8cD4nICsgZnJlc2hEZWNrUGFydGlhbCArICc8L3A+JztcbiAgICB9XG59XG5cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcImRlY2stcGFnZVwiLCBEZWNrUGFnZSk7XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ3BsYXlpbmctY2FyZCcsIHtcbiAgICBwcm90b3R5cGU6IE9iamVjdC5jcmVhdGUoSFRNTEVsZW1lbnQucHJvdG90eXBlLCB7IGNyZWF0ZWRDYWxsYmFjazoge1xuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgdmFyIHJvb3QgPSB0aGlzLmNyZWF0ZVNoYWRvd1Jvb3QoKTtcbiAgICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgdGhpcy50ZXh0Q29udGVudCB8fCAnI+KWiCcpO1xuICAgICAgICAgICAgICAgICAgdmFyIGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgIHZhciBjb2xvck92ZXJyaWRlID0gKHRoaXMucXVlcnlTZWxlY3Rvcignc3BhbicpKSA/IHRoaXMucXVlcnlTZWxlY3Rvcignc3BhbicpLnN0eWxlLmNvbG9yOiBudWxsO1xuICAgICAgICAgICAgICAgICAgaWYgKGNvbG9yT3ZlcnJpZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICBjbG9uZS5xdWVyeVNlbGVjdG9yKCdzdmcnKS5zdHlsZS5maWxsID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdzcGFuJykuc3R5bGUuY29sb3I7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG59KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYWdlcy9kZWNrLmpzIiwibW9kdWxlLmV4cG9ydHMgPSBcIiAgICA8ZGl2IGlkPVxcXCJkZWNrXFxcIiBjbGFzcz1cXFwiZGVja1xcXCI+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4paIXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTcwLjMxMjUgMzYyLjI1IEw3MC4zMTI1IDExMC4xMDk0IEwyMjQuMjk2OSAxMTAuMTA5NCBMMjI0LjI5NjkgMzYyLjI1IEw3MC4zMTI1IDM2Mi4yNSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaBBXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuNjcxOSAxMTUuNzM0NCBMOTEuODI4MSAxNzUuNzgxMiBMMTI5LjUxNTYgMTc1Ljc4MTIgTDExMC42NzE5IDExNS43MzQ0IFpNOTkuOTg0NCAxMDEuNjcxOSBMMTIxLjY0MDYgMTAxLjY3MTkgTDE2Mi4xNDA2IDIxOS4yMzQ0IEwxNDMuNTc4MSAyMTkuMjM0NCBMMTM0LjAxNTYgMTg4LjU3ODEgTDg3LjYwOTQgMTg4LjU3ODEgTDc4LjA0NjkgMjE5LjIzNDQgTDU5LjQ4NDQgMjE5LjIzNDQgTDk5Ljk4NDQgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgMlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODYuMzQzOCAyMDMuMDYyNSBMMTQ1Ljk2ODggMjAzLjA2MjUgTDE0NS45Njg4IDIxOS4wOTM4IEw2MS44NzUgMjE5LjA5MzggTDYxLjg3NSAyMDMuNjI1IFE2Ni42NTYyIDE5OS4yNjU2IDc1LjUxNTYgMTkxLjM5MDYgUTEyMy44OTA2IDE0OC41IDEyMy44OTA2IDEzNS4yODEyIFExMjMuODkwNiAxMjYgMTE2LjU3ODEgMTIwLjMwNDcgUTEwOS4yNjU2IDExNC42MDk0IDk3LjMxMjUgMTE0LjYwOTQgUTkwIDExNC42MDk0IDgxLjQyMTkgMTE3LjA3MDMgUTcyLjg0MzggMTE5LjUzMTIgNjIuNzE4OCAxMjQuNDUzMSBMNjIuNzE4OCAxMDcuMTU2MiBRNzMuNTQ2OSAxMDMuMjE4OCA4Mi44OTg0IDEwMS4yNSBROTIuMjUgOTkuMjgxMiAxMDAuMjY1NiA5OS4yODEyIFExMjAuNjU2MiA5OS4yODEyIDEzMi44OTA2IDEwOC41NjI1IFExNDUuMTI1IDExNy44NDM4IDE0NS4xMjUgMTMzLjAzMTIgUTE0NS4xMjUgMTUyLjU3ODEgOTguNTc4MSAxOTIuNTE1NiBROTAuNzAzMSAxOTkuMjY1NiA4Ni4zNDM4IDIwMy4wNjI1IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoDNcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEyMS43ODEyIDE1NS41MzEyIFExMzQuNzE4OCAxNTguMDYyNSAxNDEuODIwMyAxNjUuNzI2NiBRMTQ4LjkyMTkgMTczLjM5MDYgMTQ4LjkyMTkgMTg0LjkyMTkgUTE0OC45MjE5IDIwMi4zNTk0IDEzNS41NjI1IDIxMS43ODEyIFExMjIuMjAzMSAyMjEuMjAzMSA5Ny4zMTI1IDIyMS4yMDMxIFE4OS4yOTY5IDIyMS4yMDMxIDgwLjUwNzggMjE5LjcyNjYgUTcxLjcxODggMjE4LjI1IDYxLjg3NSAyMTUuNDM3NSBMNjEuODc1IDE5OC40MjE5IFE2OS4xODc1IDIwMi4yMTg4IDc3LjU1NDcgMjA0LjA0NjkgUTg1LjkyMTkgMjA1Ljg3NSA5NS4zNDM4IDIwNS44NzUgUTExMC42NzE5IDIwNS44NzUgMTE5LjEwOTQgMjAwLjMyMDMgUTEyNy41NDY5IDE5NC43NjU2IDEyNy41NDY5IDE4NC45MjE5IFExMjcuNTQ2OSAxNzQuNTE1NiAxMTkuNzQyMiAxNjkuMTcxOSBRMTExLjkzNzUgMTYzLjgyODEgOTYuNzUgMTYzLjgyODEgTDg0LjY1NjIgMTYzLjgyODEgTDg0LjY1NjIgMTQ4LjY0MDYgTDk3Ljg3NSAxNDguNjQwNiBRMTExLjA5MzggMTQ4LjY0MDYgMTE3LjkxNDEgMTQ0LjIxMDkgUTEyNC43MzQ0IDEzOS43ODEyIDEyNC43MzQ0IDEzMS4zNDM4IFExMjQuNzM0NCAxMjMuMTg3NSAxMTcuNzAzMSAxMTguODk4NCBRMTEwLjY3MTkgMTE0LjYwOTQgOTcuMzEyNSAxMTQuNjA5NCBROTEuNjg3NSAxMTQuNjA5NCA4NC41MTU2IDExNS44NzUgUTc3LjM0MzggMTE3LjE0MDYgNjUuOTUzMSAxMjAuMzc1IEw2NS45NTMxIDEwNC4yMDMxIFE3Ni4yMTg4IDEwMS44MTI1IDg1LjIxODggMTAwLjU0NjkgUTk0LjIxODggOTkuMjgxMiAxMDEuOTUzMSA5OS4yODEyIFExMjIuMjAzMSA5OS4yODEyIDEzNC4wODU5IDEwNy41NzgxIFExNDUuOTY4OCAxMTUuODc1IDE0NS45Njg4IDEyOS43OTY5IFExNDUuOTY4OCAxMzkuNSAxMzkuNjQwNiAxNDYuMjUgUTEzMy4zMTI1IDE1MyAxMjEuNzgxMiAxNTUuNTMxMiBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaA0XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMjAuMDkzOCAxMTguNjg3NSBMNzYuNjQwNiAxNzcuNjA5NCBMMTIwLjA5MzggMTc3LjYwOTQgTDEyMC4wOTM4IDExOC42ODc1IFpNMTE3IDEwMS42NzE5IEwxNDAuMzQzOCAxMDEuNjcxOSBMMTQwLjM0MzggMTc3LjYwOTQgTDE1OS4zMjgxIDE3Ny42MDk0IEwxNTkuMzI4MSAxOTIuOTM3NSBMMTQwLjM0MzggMTkyLjkzNzUgTDE0MC4zNDM4IDIxOS4wOTM4IEwxMjAuMDkzOCAyMTkuMDkzOCBMMTIwLjA5MzggMTkyLjkzNzUgTDYxLjg3NSAxOTIuOTM3NSBMNjEuODc1IDE3NS45MjE5IEwxMTcgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgNVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjcuNSAxMDEuNjcxOSBMMTM5LjIxODggMTAxLjY3MTkgTDEzOS4yMTg4IDExNS4wMzEyIEw4NC4yMzQ0IDExNS4wMzEyIEw4NC4yMzQ0IDE0My43MTg4IFE4OC4xNzE5IDE0Mi40NTMxIDkyLjI1IDE0MS44OTA2IFE5Ni4xODc1IDE0MS4zMjgxIDEwMC4xMjUgMTQxLjMyODEgUTEyMi43NjU2IDE0MS4zMjgxIDEzNS45ODQ0IDE1Mi4xNTYyIFExNDkuMjAzMSAxNjIuODQzOCAxNDkuMjAzMSAxODEuMjY1NiBRMTQ5LjIwMzEgMjAwLjI1IDEzNS41NjI1IDIxMC43OTY5IFExMjIuMDYyNSAyMjEuMjAzMSA5Ny4zMTI1IDIyMS4yMDMxIFE4OC44NzUgMjIxLjIwMzEgODAuMDE1NiAyMTkuOTM3NSBRNzEuMTU2MiAyMTguNjcxOSA2MS44NzUgMjE2LjE0MDYgTDYxLjg3NSAyMDAuMjUgUTY5Ljg5MDYgMjA0LjA0NjkgNzguNjA5NCAyMDYuMDE1NiBRODcuMzI4MSAyMDcuODQzOCA5Ny4wMzEyIDIwNy44NDM4IFExMTIuNjQwNiAyMDcuODQzOCAxMjEuNzgxMiAyMDAuNjcxOSBRMTMwLjkyMTkgMTkzLjUgMTMwLjkyMTkgMTgxLjI2NTYgUTEzMC45MjE5IDE2OS4wMzEyIDEyMS43ODEyIDE2MS44NTk0IFExMTIuNjQwNiAxNTQuNjg3NSA5Ny4wMzEyIDE1NC42ODc1IFE4OS43MTg4IDE1NC42ODc1IDgyLjQwNjIgMTU2LjA5MzggUTc1LjA5MzggMTU3LjUgNjcuNSAxNjAuNDUzMSBMNjcuNSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaA2XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuMTA5NCAxNTMuNzAzMSBROTcuNzM0NCAxNTMuNzAzMSA5MC41NjI1IDE2MS4wMTU2IFE4My4zOTA2IDE2OC40Njg4IDgzLjM5MDYgMTgxLjI2NTYgUTgzLjM5MDYgMTkzLjkyMTkgOTAuNTYyNSAyMDEuMjM0NCBROTcuNzM0NCAyMDguNjg3NSAxMTAuMTA5NCAyMDguNjg3NSBRMTIyLjM0MzggMjA4LjY4NzUgMTI5LjUxNTYgMjAxLjIzNDQgUTEzNi42ODc1IDE5My45MjE5IDEzNi42ODc1IDE4MS4yNjU2IFExMzYuNjg3NSAxNjguNDY4OCAxMjkuNTE1NiAxNjEuMDE1NiBRMTIyLjM0MzggMTUzLjcwMzEgMTEwLjEwOTQgMTUzLjcwMzEgWk0xNDYuMzkwNiAxMDMuOTIxOSBMMTQ2LjM5MDYgMTE4LjQwNjIgUTEzOS41IDExNS41OTM4IDEzMi40Njg4IDExNC4xODc1IFExMjUuNDM3NSAxMTIuNjQwNiAxMTguNTQ2OSAxMTIuNjQwNiBRMTAwLjU0NjkgMTEyLjY0MDYgOTAuOTg0NCAxMjMuMTg3NSBRODEuNDIxOSAxMzMuODc1IDgwLjAxNTYgMTU1LjM5MDYgUTg1LjM1OTQgMTQ4LjUgOTMuMzc1IDE0NC44NDM4IFExMDEuNTMxMiAxNDEuMTg3NSAxMTEuMDkzOCAxNDEuMTg3NSBRMTMxLjQ4NDQgMTQxLjE4NzUgMTQzLjI5NjkgMTUxLjg3NSBRMTU1LjEwOTQgMTYyLjcwMzEgMTU1LjEwOTQgMTgxLjI2NTYgUTE1NS4xMDk0IDE5OS4xMjUgMTQyLjczNDQgMjEwLjIzNDQgUTEzMC41IDIyMS4yMDMxIDExMC4xMDk0IDIyMS4yMDMxIFE4Ni42MjUgMjIxLjIwMzEgNzQuMjUgMjA1LjU5MzggUTYxLjg3NSAxODkuOTg0NCA2MS44NzUgMTYwLjE3MTkgUTYxLjg3NSAxMzIuMzI4MSA3Ny4wNjI1IDExNS44NzUgUTkyLjI1IDk5LjI4MTIgMTE3Ljg0MzggOTkuMjgxMiBRMTI0LjczNDQgOTkuMjgxMiAxMzEuNzY1NiAxMDAuNDA2MiBRMTM4Ljc5NjkgMTAxLjY3MTkgMTQ2LjM5MDYgMTAzLjkyMTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgN1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjEuODc1IDEwMS42NzE5IEwxNDguNjQwNiAxMDEuNjcxOSBMMTQ4LjY0MDYgMTA4LjQyMTkgTDk5LjcwMzEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggTDEyNi43MDMxIDExNS4wMzEyIEw2MS44NzUgMTE1LjAzMTIgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaA4XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMDguMjgxMiAxNjMuMTI1IFE5NS4yMDMxIDE2My4xMjUgODcuNzUgMTY5LjMxMjUgUTgwLjI5NjkgMTc1LjM1OTQgODAuMjk2OSAxODUuOTA2MiBRODAuMjk2OSAxOTYuNTkzOCA4Ny43NSAyMDIuNjQwNiBROTUuMjAzMSAyMDguNjg3NSAxMDguMjgxMiAyMDguNjg3NSBRMTIxLjIxODggMjA4LjY4NzUgMTI4LjgxMjUgMjAyLjUgUTEzNi4yNjU2IDE5Ni40NTMxIDEzNi4yNjU2IDE4NS45MDYyIFExMzYuMjY1NiAxNzUuMzU5NCAxMjguODEyNSAxNjkuMzEyNSBRMTIxLjM1OTQgMTYzLjEyNSAxMDguMjgxMiAxNjMuMTI1IFpNOTAgMTU2LjIzNDQgUTc4LjE4NzUgMTUzLjcwMzEgNzEuNzE4OCAxNDYuODEyNSBRNjUuMTA5NCAxMzkuNzgxMiA2NS4xMDk0IDEyOS42NTYyIFE2NS4xMDk0IDExNS41OTM4IDc2LjY0MDYgMTA3LjQzNzUgUTg4LjE3MTkgOTkuMjgxMiAxMDguMjgxMiA5OS4yODEyIFExMjguMzkwNiA5OS4yODEyIDEzOS45MjE5IDEwNy40Mzc1IFExNTEuMzEyNSAxMTUuNTkzOCAxNTEuMzEyNSAxMjkuNjU2MiBRMTUxLjMxMjUgMTQwLjA2MjUgMTQ0Ljg0MzggMTQ2LjgxMjUgUTEzOC4yMzQ0IDE1My43MDMxIDEyNi41NjI1IDE1Ni4yMzQ0IFExMzkuMjE4OCAxNTguNzY1NiAxNDcuMDkzOCAxNjYuOTIxOSBRMTU0LjU0NjkgMTc0LjY1NjIgMTU0LjU0NjkgMTg1LjkwNjIgUTE1NC41NDY5IDIwMi45MjE5IDE0Mi41OTM4IDIxMi4wNjI1IFExMzAuNSAyMjEuMjAzMSAxMDguMjgxMiAyMjEuMjAzMSBRODUuOTIxOSAyMjEuMjAzMSA3My45Njg4IDIxMi4wNjI1IFE2MS44NzUgMjAyLjkyMTkgNjEuODc1IDE4NS45MDYyIFE2MS44NzUgMTc0LjkzNzUgNjkuMzI4MSAxNjYuOTIxOSBRNzYuOTIxOSAxNTkuMDQ2OSA5MCAxNTYuMjM0NCBaTTgzLjI1IDEzMS4yMDMxIFE4My4yNSAxNDAuMDYyNSA4OS44NTk0IDE0NS40MDYyIFE5Ni4zMjgxIDE1MC42MDk0IDEwOC4yODEyIDE1MC42MDk0IFExMTkuNjcxOSAxNTAuNjA5NCAxMjYuNTYyNSAxNDUuNDA2MiBRMTMzLjMxMjUgMTQwLjM0MzggMTMzLjMxMjUgMTMxLjIwMzEgUTEzMy4zMTI1IDEyMi4zNDM4IDEyNi41NjI1IDExNyBRMTE5Ljk1MzEgMTExLjc5NjkgMTA4LjI4MTIgMTExLjc5NjkgUTk2LjYwOTQgMTExLjc5NjkgODkuODU5NCAxMTcgUTgzLjI1IDEyMi4wNjI1IDgzLjI1IDEzMS4yMDMxIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoDlcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTcwLjU5MzggMjE2LjU2MjUgTDcwLjU5MzggMjAyLjA3ODEgUTc3LjQ4NDQgMjA0Ljg5MDYgODQuNTE1NiAyMDYuNDM3NSBROTEuNTQ2OSAyMDcuODQzOCA5OC4yOTY5IDIwNy44NDM4IFExMTYuNDM3NSAyMDcuODQzOCAxMjYgMTk3LjI5NjkgUTEzNS40MjE5IDE4Ni43NSAxMzYuODI4MSAxNjUuMDkzOCBRMTMxLjkwNjIgMTcxLjcwMzEgMTIzLjQ2ODggMTc1LjUgUTExNS40NTMxIDE3OS4xNTYyIDEwNS43NSAxNzkuMTU2MiBRODUuNSAxNzkuMTU2MiA3My42ODc1IDE2OC40Njg4IFE2MS44NzUgMTU3Ljc4MTIgNjEuODc1IDEzOS4yMTg4IFE2MS44NzUgMTIxLjA3ODEgNzQuMTA5NCAxMTAuMjUgUTg2LjQ4NDQgOTkuMjgxMiAxMDYuODc1IDk5LjI4MTIgUTEzMC4zNTk0IDk5LjI4MTIgMTQyLjU5MzggMTE0Ljg5MDYgUTE1NC45Njg4IDEzMC41IDE1NC45Njg4IDE2MC4zMTI1IFExNTQuOTY4OCAxODguMTU2MiAxMzkuOTIxOSAyMDQuNjA5NCBRMTI0LjczNDQgMjIxLjIwMzEgOTkuMTQwNiAyMjEuMjAzMSBROTIuMjUgMjIxLjIwMzEgODUuMjE4OCAyMjAuMDc4MSBRNzguMTg3NSAyMTguODEyNSA3MC41OTM4IDIxNi41NjI1IFpNMTA2Ljg3NSAxNjYuNzgxMiBRMTE5LjI1IDE2Ni43ODEyIDEyNi40MjE5IDE1OS40Njg4IFExMzMuNTkzOCAxNTIuMTU2MiAxMzMuNTkzOCAxMzkuMjE4OCBRMTMzLjU5MzggMTI2LjU2MjUgMTI2LjQyMTkgMTE5LjI1IFExMTkuMjUgMTExLjc5NjkgMTA2Ljg3NSAxMTEuNzk2OSBROTQuOTIxOSAxMTEuNzk2OSA4Ny40Njg4IDExOS4yNSBRODAuMTU2MiAxMjYuNTYyNSA4MC4xNTYyIDEzOS4yMTg4IFE4MC4xNTYyIDE1Mi4xNTYyIDg3LjQ2ODggMTU5LjQ2ODggUTk0LjY0MDYgMTY2Ljc4MTIgMTA2Ljg3NSAxNjYuNzgxMiBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaAxMFxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTU5LjA0NjkgMTExLjc5NjkgUTE0OS4wNjI1IDExMS43OTY5IDE0Mi4wMzEyIDEyMy44OTA2IFExMzQuODU5NCAxMzUuOTg0NCAxMzQuODU5NCAxNjAuMTcxOSBRMTM0Ljg1OTQgMTg0LjUgMTQyLjAzMTIgMTk2LjU5MzggUTE0OS4wNjI1IDIwOC42ODc1IDE1OS4wNDY5IDIwOC42ODc1IFExNjkuMDMxMiAyMDguNjg3NSAxNzYuMDYyNSAxOTYuNTkzOCBRMTgzLjIzNDQgMTg0LjUgMTgzLjIzNDQgMTYwLjE3MTkgUTE4My4yMzQ0IDEzNS45ODQ0IDE3Ni4wNjI1IDEyMy44OTA2IFExNjkuMDMxMiAxMTEuNzk2OSAxNTkuMDQ2OSAxMTEuNzk2OSBaTTE1OS4wNDY5IDk5LjI4MTIgUTE3Ny40Njg4IDk5LjI4MTIgMTg5LjQyMTkgMTE0Ljg5MDYgUTIwMS4zNzUgMTMwLjUgMjAxLjM3NSAxNjAuMTcxOSBRMjAxLjM3NSAxODkuOTg0NCAxODkuNDIxOSAyMDUuNTkzOCBRMTc3LjQ2ODggMjIxLjIwMzEgMTU5LjA0NjkgMjIxLjIwMzEgUTEzNi4yNjU2IDIyMS4yMDMxIDEyNi40MjE5IDIwNS41OTM4IFExMTYuNTc4MSAxODkuOTg0NCAxMTYuNTc4MSAxNjAuMTcxOSBRMTE2LjU3ODEgMTMwLjUgMTI2LjQyMTkgMTE0Ljg5MDYgUTEzNi4yNjU2IDk5LjI4MTIgMTU5LjA0NjkgOTkuMjgxMiBaTTgwLjU3ODEgMjE5LjA5MzggTDgwLjU3ODEgMTE3LjcwMzEgTDYxLjg3NSAxMjMuNDY4OCBMNjEuODc1IDEwNy4xNTYyIEw4MS41NjI1IDEwMS42NzE5IEwxMDAuODI4MSAxMDEuNjcxOSBMMTAwLjgyODEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgSlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODkuMTU2MiAxMDEuNjcxOSBMMTA3LjAxNTYgMTAxLjY3MTkgTDEwNy4wMTU2IDE3OC43MzQ0IFExMDcuMDE1NiAxOTkuNjg3NSA5Ny44NzUgMjA5LjUzMTIgUTg4Ljg3NSAyMTkuMjM0NCA2OC43NjU2IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAyMDUuNzM0NCBMNjcuNSAyMDUuNzM0NCBRNzkuMzEyNSAyMDUuNzM0NCA4NC4yMzQ0IDE5OS44MjgxIFE4OS4xNTYyIDE5My45MjE5IDg5LjE1NjIgMTc4LjczNDQgTDg5LjE1NjIgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgUVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTA3LjI5NjkgMjIxLjA2MjUgUTEwNi43MzQ0IDIyMS4wNjI1IDEwNS41MzkxIDIyMS4xMzI4IFExMDQuMzQzOCAyMjEuMjAzMSAxMDMuNjQwNiAyMjEuMjAzMSBRODEuNDIxOSAyMjEuMjAzMSA3MC41MjM0IDIwNi4wODU5IFE1OS42MjUgMTkwLjk2ODggNTkuNjI1IDE2MC4zMTI1IFE1OS42MjUgMTI5LjUxNTYgNzAuNTkzOCAxMTQuMzk4NCBRODEuNTYyNSA5OS4yODEyIDEwMy43ODEyIDk5LjI4MTIgUTEyNi4xNDA2IDk5LjI4MTIgMTM3LjEwOTQgMTE0LjM5ODQgUTE0OC4wNzgxIDEyOS41MTU2IDE0OC4wNzgxIDE2MC4zMTI1IFExNDguMDc4MSAxODMuNTE1NiAxNDIuMDMxMiAxOTcuNjQ4NCBRMTM1Ljk4NDQgMjExLjc4MTIgMTIzLjYwOTQgMjE3LjQwNjIgTDE0MS4zMjgxIDIzMi4zMTI1IEwxMjcuOTY4OCAyNDAuMTg3NSBMMTA3LjI5NjkgMjIxLjA2MjUgWk0xMjkuMzc1IDE2MC4zMTI1IFExMjkuMzc1IDEzNC40Mzc1IDEyMy4zOTg0IDEyMy4zMjgxIFExMTcuNDIxOSAxMTIuMjE4OCAxMDMuNzgxMiAxMTIuMjE4OCBROTAuMjgxMiAxMTIuMjE4OCA4NC4zMDQ3IDEyMy4zMjgxIFE3OC4zMjgxIDEzNC40Mzc1IDc4LjMyODEgMTYwLjMxMjUgUTc4LjMyODEgMTg2LjE4NzUgODQuMzA0NyAxOTcuMjk2OSBROTAuMjgxMiAyMDguNDA2MiAxMDMuNzgxMiAyMDguNDA2MiBRMTE3LjQyMTkgMjA4LjQwNjIgMTIzLjM5ODQgMTk3LjI5NjkgUTEyOS4zNzUgMTg2LjE4NzUgMTI5LjM3NSAxNjAuMzEyNSBaTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaBLXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02MS44NzUgMTAxLjY3MTkgTDc5LjczNDQgMTAxLjY3MTkgTDc5LjczNDQgMTUxLjMxMjUgTDEzMC42NDA2IDEwMS42NzE5IEwxNTMuNzAzMSAxMDEuNjcxOSBMOTYuNDY4OCAxNTYuNTE1NiBMMTU4LjM0MzggMjE5LjIzNDQgTDEzNC44NTk0IDIxOS4yMzQ0IEw3OS43MzQ0IDE2Mi41NjI1IEw3OS43MzQ0IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaVBXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuNjcxOSAxMTUuNzM0NCBMOTEuODI4MSAxNzUuNzgxMiBMMTI5LjUxNTYgMTc1Ljc4MTIgTDExMC42NzE5IDExNS43MzQ0IFpNOTkuOTg0NCAxMDEuNjcxOSBMMTIxLjY0MDYgMTAxLjY3MTkgTDE2Mi4xNDA2IDIxOS4yMzQ0IEwxNDMuNTc4MSAyMTkuMjM0NCBMMTM0LjAxNTYgMTg4LjU3ODEgTDg3LjYwOTQgMTg4LjU3ODEgTDc4LjA0NjkgMjE5LjIzNDQgTDU5LjQ4NDQgMjE5LjIzNDQgTDk5Ljk4NDQgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlMlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTg2LjM0MzggMjAzLjA2MjUgTDE0NS45Njg4IDIwMy4wNjI1IEwxNDUuOTY4OCAyMTkuMDkzOCBMNjEuODc1IDIxOS4wOTM4IEw2MS44NzUgMjAzLjYyNSBRNjYuNjU2MiAxOTkuMjY1NiA3NS41MTU2IDE5MS4zOTA2IFExMjMuODkwNiAxNDguNSAxMjMuODkwNiAxMzUuMjgxMiBRMTIzLjg5MDYgMTI2IDExNi41NzgxIDEyMC4zMDQ3IFExMDkuMjY1NiAxMTQuNjA5NCA5Ny4zMTI1IDExNC42MDk0IFE5MCAxMTQuNjA5NCA4MS40MjE5IDExNy4wNzAzIFE3Mi44NDM4IDExOS41MzEyIDYyLjcxODggMTI0LjQ1MzEgTDYyLjcxODggMTA3LjE1NjIgUTczLjU0NjkgMTAzLjIxODggODIuODk4NCAxMDEuMjUgUTkyLjI1IDk5LjI4MTIgMTAwLjI2NTYgOTkuMjgxMiBRMTIwLjY1NjIgOTkuMjgxMiAxMzIuODkwNiAxMDguNTYyNSBRMTQ1LjEyNSAxMTcuODQzOCAxNDUuMTI1IDEzMy4wMzEyIFExNDUuMTI1IDE1Mi41NzgxIDk4LjU3ODEgMTkyLjUxNTYgUTkwLjcwMzEgMTk5LjI2NTYgODYuMzQzOCAyMDMuMDYyNSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaUzXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTIxLjc4MTIgMTU1LjUzMTIgUTEzNC43MTg4IDE1OC4wNjI1IDE0MS44MjAzIDE2NS43MjY2IFExNDguOTIxOSAxNzMuMzkwNiAxNDguOTIxOSAxODQuOTIxOSBRMTQ4LjkyMTkgMjAyLjM1OTQgMTM1LjU2MjUgMjExLjc4MTIgUTEyMi4yMDMxIDIyMS4yMDMxIDk3LjMxMjUgMjIxLjIwMzEgUTg5LjI5NjkgMjIxLjIwMzEgODAuNTA3OCAyMTkuNzI2NiBRNzEuNzE4OCAyMTguMjUgNjEuODc1IDIxNS40Mzc1IEw2MS44NzUgMTk4LjQyMTkgUTY5LjE4NzUgMjAyLjIxODggNzcuNTU0NyAyMDQuMDQ2OSBRODUuOTIxOSAyMDUuODc1IDk1LjM0MzggMjA1Ljg3NSBRMTEwLjY3MTkgMjA1Ljg3NSAxMTkuMTA5NCAyMDAuMzIwMyBRMTI3LjU0NjkgMTk0Ljc2NTYgMTI3LjU0NjkgMTg0LjkyMTkgUTEyNy41NDY5IDE3NC41MTU2IDExOS43NDIyIDE2OS4xNzE5IFExMTEuOTM3NSAxNjMuODI4MSA5Ni43NSAxNjMuODI4MSBMODQuNjU2MiAxNjMuODI4MSBMODQuNjU2MiAxNDguNjQwNiBMOTcuODc1IDE0OC42NDA2IFExMTEuMDkzOCAxNDguNjQwNiAxMTcuOTE0MSAxNDQuMjEwOSBRMTI0LjczNDQgMTM5Ljc4MTIgMTI0LjczNDQgMTMxLjM0MzggUTEyNC43MzQ0IDEyMy4xODc1IDExNy43MDMxIDExOC44OTg0IFExMTAuNjcxOSAxMTQuNjA5NCA5Ny4zMTI1IDExNC42MDk0IFE5MS42ODc1IDExNC42MDk0IDg0LjUxNTYgMTE1Ljg3NSBRNzcuMzQzOCAxMTcuMTQwNiA2NS45NTMxIDEyMC4zNzUgTDY1Ljk1MzEgMTA0LjIwMzEgUTc2LjIxODggMTAxLjgxMjUgODUuMjE4OCAxMDAuNTQ2OSBROTQuMjE4OCA5OS4yODEyIDEwMS45NTMxIDk5LjI4MTIgUTEyMi4yMDMxIDk5LjI4MTIgMTM0LjA4NTkgMTA3LjU3ODEgUTE0NS45Njg4IDExNS44NzUgMTQ1Ljk2ODggMTI5Ljc5NjkgUTE0NS45Njg4IDEzOS41IDEzOS42NDA2IDE0Ni4yNSBRMTMzLjMxMjUgMTUzIDEyMS43ODEyIDE1NS41MzEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpTRcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi42ODc1IDI3My42NTYyIFExNzUuNzgxMiAyNTcuMDYyNSAxODMuNTE1NiAyNDguMzQzOCBRMTkyLjIzNDQgMjM4LjM1OTQgMjA0LjA0NjkgMjM4LjM1OTQgUTIyMy41OTM4IDIzOC4zNTk0IDIzMi4zMTI1IDI1OS4zMTI1IFEyMzQuOTg0NCAyNjUuNjQwNiAyMzQuOTg0NCAyNzMuOTM3NSBRMjM0Ljk4NDQgMjk2LjE1NjIgMjE3LjQwNjIgMzE4LjUxNTYgTDE3Mi45Njg4IDM3NS4wNDY5IEwxMjcuOTY4OCAzMTguNTE1NiBRMTEwLjM5MDYgMjk2LjQzNzUgMTEwLjM5MDYgMjczLjkzNzUgUTExMC4zOTA2IDI2NS42NDA2IDExMy4wNjI1IDI1OS4zMTI1IFExMjEuOTIxOSAyMzguMzU5NCAxNDEuMzI4MSAyMzguMzU5NCBRMTUzLjQyMTkgMjM4LjM1OTQgMTYxLjg1OTQgMjQ4LjM0MzggUTE2OS41OTM4IDI1Ny40ODQ0IDE3Mi42ODc1IDI3My42NTYyIFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMjAuMDkzOCAxMTguNjg3NSBMNzYuNjQwNiAxNzcuNjA5NCBMMTIwLjA5MzggMTc3LjYwOTQgTDEyMC4wOTM4IDExOC42ODc1IFpNMTE3IDEwMS42NzE5IEwxNDAuMzQzOCAxMDEuNjcxOSBMMTQwLjM0MzggMTc3LjYwOTQgTDE1OS4zMjgxIDE3Ny42MDk0IEwxNTkuMzI4MSAxOTIuOTM3NSBMMTQwLjM0MzggMTkyLjkzNzUgTDE0MC4zNDM4IDIxOS4wOTM4IEwxMjAuMDkzOCAyMTkuMDkzOCBMMTIwLjA5MzggMTkyLjkzNzUgTDYxLjg3NSAxOTIuOTM3NSBMNjEuODc1IDE3NS45MjE5IEwxMTcgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlNVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTY3LjUgMTAxLjY3MTkgTDEzOS4yMTg4IDEwMS42NzE5IEwxMzkuMjE4OCAxMTUuMDMxMiBMODQuMjM0NCAxMTUuMDMxMiBMODQuMjM0NCAxNDMuNzE4OCBRODguMTcxOSAxNDIuNDUzMSA5Mi4yNSAxNDEuODkwNiBROTYuMTg3NSAxNDEuMzI4MSAxMDAuMTI1IDE0MS4zMjgxIFExMjIuNzY1NiAxNDEuMzI4MSAxMzUuOTg0NCAxNTIuMTU2MiBRMTQ5LjIwMzEgMTYyLjg0MzggMTQ5LjIwMzEgMTgxLjI2NTYgUTE0OS4yMDMxIDIwMC4yNSAxMzUuNTYyNSAyMTAuNzk2OSBRMTIyLjA2MjUgMjIxLjIwMzEgOTcuMzEyNSAyMjEuMjAzMSBRODguODc1IDIyMS4yMDMxIDgwLjAxNTYgMjE5LjkzNzUgUTcxLjE1NjIgMjE4LjY3MTkgNjEuODc1IDIxNi4xNDA2IEw2MS44NzUgMjAwLjI1IFE2OS44OTA2IDIwNC4wNDY5IDc4LjYwOTQgMjA2LjAxNTYgUTg3LjMyODEgMjA3Ljg0MzggOTcuMDMxMiAyMDcuODQzOCBRMTEyLjY0MDYgMjA3Ljg0MzggMTIxLjc4MTIgMjAwLjY3MTkgUTEzMC45MjE5IDE5My41IDEzMC45MjE5IDE4MS4yNjU2IFExMzAuOTIxOSAxNjkuMDMxMiAxMjEuNzgxMiAxNjEuODU5NCBRMTEyLjY0MDYgMTU0LjY4NzUgOTcuMDMxMiAxNTQuNjg3NSBRODkuNzE4OCAxNTQuNjg3NSA4Mi40MDYyIDE1Ni4wOTM4IFE3NS4wOTM4IDE1Ny41IDY3LjUgMTYwLjQ1MzEgTDY3LjUgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlNlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTExMC4xMDk0IDE1My43MDMxIFE5Ny43MzQ0IDE1My43MDMxIDkwLjU2MjUgMTYxLjAxNTYgUTgzLjM5MDYgMTY4LjQ2ODggODMuMzkwNiAxODEuMjY1NiBRODMuMzkwNiAxOTMuOTIxOSA5MC41NjI1IDIwMS4yMzQ0IFE5Ny43MzQ0IDIwOC42ODc1IDExMC4xMDk0IDIwOC42ODc1IFExMjIuMzQzOCAyMDguNjg3NSAxMjkuNTE1NiAyMDEuMjM0NCBRMTM2LjY4NzUgMTkzLjkyMTkgMTM2LjY4NzUgMTgxLjI2NTYgUTEzNi42ODc1IDE2OC40Njg4IDEyOS41MTU2IDE2MS4wMTU2IFExMjIuMzQzOCAxNTMuNzAzMSAxMTAuMTA5NCAxNTMuNzAzMSBaTTE0Ni4zOTA2IDEwMy45MjE5IEwxNDYuMzkwNiAxMTguNDA2MiBRMTM5LjUgMTE1LjU5MzggMTMyLjQ2ODggMTE0LjE4NzUgUTEyNS40Mzc1IDExMi42NDA2IDExOC41NDY5IDExMi42NDA2IFExMDAuNTQ2OSAxMTIuNjQwNiA5MC45ODQ0IDEyMy4xODc1IFE4MS40MjE5IDEzMy44NzUgODAuMDE1NiAxNTUuMzkwNiBRODUuMzU5NCAxNDguNSA5My4zNzUgMTQ0Ljg0MzggUTEwMS41MzEyIDE0MS4xODc1IDExMS4wOTM4IDE0MS4xODc1IFExMzEuNDg0NCAxNDEuMTg3NSAxNDMuMjk2OSAxNTEuODc1IFExNTUuMTA5NCAxNjIuNzAzMSAxNTUuMTA5NCAxODEuMjY1NiBRMTU1LjEwOTQgMTk5LjEyNSAxNDIuNzM0NCAyMTAuMjM0NCBRMTMwLjUgMjIxLjIwMzEgMTEwLjEwOTQgMjIxLjIwMzEgUTg2LjYyNSAyMjEuMjAzMSA3NC4yNSAyMDUuNTkzOCBRNjEuODc1IDE4OS45ODQ0IDYxLjg3NSAxNjAuMTcxOSBRNjEuODc1IDEzMi4zMjgxIDc3LjA2MjUgMTE1Ljg3NSBROTIuMjUgOTkuMjgxMiAxMTcuODQzOCA5OS4yODEyIFExMjQuNzM0NCA5OS4yODEyIDEzMS43NjU2IDEwMC40MDYyIFExMzguNzk2OSAxMDEuNjcxOSAxNDYuMzkwNiAxMDMuOTIxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaU3XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjEuODc1IDEwMS42NzE5IEwxNDguNjQwNiAxMDEuNjcxOSBMMTQ4LjY0MDYgMTA4LjQyMTkgTDk5LjcwMzEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggTDEyNi43MDMxIDExNS4wMzEyIEw2MS44NzUgMTE1LjAzMTIgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaU4XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTA4LjI4MTIgMTYzLjEyNSBROTUuMjAzMSAxNjMuMTI1IDg3Ljc1IDE2OS4zMTI1IFE4MC4yOTY5IDE3NS4zNTk0IDgwLjI5NjkgMTg1LjkwNjIgUTgwLjI5NjkgMTk2LjU5MzggODcuNzUgMjAyLjY0MDYgUTk1LjIwMzEgMjA4LjY4NzUgMTA4LjI4MTIgMjA4LjY4NzUgUTEyMS4yMTg4IDIwOC42ODc1IDEyOC44MTI1IDIwMi41IFExMzYuMjY1NiAxOTYuNDUzMSAxMzYuMjY1NiAxODUuOTA2MiBRMTM2LjI2NTYgMTc1LjM1OTQgMTI4LjgxMjUgMTY5LjMxMjUgUTEyMS4zNTk0IDE2My4xMjUgMTA4LjI4MTIgMTYzLjEyNSBaTTkwIDE1Ni4yMzQ0IFE3OC4xODc1IDE1My43MDMxIDcxLjcxODggMTQ2LjgxMjUgUTY1LjEwOTQgMTM5Ljc4MTIgNjUuMTA5NCAxMjkuNjU2MiBRNjUuMTA5NCAxMTUuNTkzOCA3Ni42NDA2IDEwNy40Mzc1IFE4OC4xNzE5IDk5LjI4MTIgMTA4LjI4MTIgOTkuMjgxMiBRMTI4LjM5MDYgOTkuMjgxMiAxMzkuOTIxOSAxMDcuNDM3NSBRMTUxLjMxMjUgMTE1LjU5MzggMTUxLjMxMjUgMTI5LjY1NjIgUTE1MS4zMTI1IDE0MC4wNjI1IDE0NC44NDM4IDE0Ni44MTI1IFExMzguMjM0NCAxNTMuNzAzMSAxMjYuNTYyNSAxNTYuMjM0NCBRMTM5LjIxODggMTU4Ljc2NTYgMTQ3LjA5MzggMTY2LjkyMTkgUTE1NC41NDY5IDE3NC42NTYyIDE1NC41NDY5IDE4NS45MDYyIFExNTQuNTQ2OSAyMDIuOTIxOSAxNDIuNTkzOCAyMTIuMDYyNSBRMTMwLjUgMjIxLjIwMzEgMTA4LjI4MTIgMjIxLjIwMzEgUTg1LjkyMTkgMjIxLjIwMzEgNzMuOTY4OCAyMTIuMDYyNSBRNjEuODc1IDIwMi45MjE5IDYxLjg3NSAxODUuOTA2MiBRNjEuODc1IDE3NC45Mzc1IDY5LjMyODEgMTY2LjkyMTkgUTc2LjkyMTkgMTU5LjA0NjkgOTAgMTU2LjIzNDQgWk04My4yNSAxMzEuMjAzMSBRODMuMjUgMTQwLjA2MjUgODkuODU5NCAxNDUuNDA2MiBROTYuMzI4MSAxNTAuNjA5NCAxMDguMjgxMiAxNTAuNjA5NCBRMTE5LjY3MTkgMTUwLjYwOTQgMTI2LjU2MjUgMTQ1LjQwNjIgUTEzMy4zMTI1IDE0MC4zNDM4IDEzMy4zMTI1IDEzMS4yMDMxIFExMzMuMzEyNSAxMjIuMzQzOCAxMjYuNTYyNSAxMTcgUTExOS45NTMxIDExMS43OTY5IDEwOC4yODEyIDExMS43OTY5IFE5Ni42MDk0IDExMS43OTY5IDg5Ljg1OTQgMTE3IFE4My4yNSAxMjIuMDYyNSA4My4yNSAxMzEuMjAzMSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaU5XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNzAuNTkzOCAyMTYuNTYyNSBMNzAuNTkzOCAyMDIuMDc4MSBRNzcuNDg0NCAyMDQuODkwNiA4NC41MTU2IDIwNi40Mzc1IFE5MS41NDY5IDIwNy44NDM4IDk4LjI5NjkgMjA3Ljg0MzggUTExNi40Mzc1IDIwNy44NDM4IDEyNiAxOTcuMjk2OSBRMTM1LjQyMTkgMTg2Ljc1IDEzNi44MjgxIDE2NS4wOTM4IFExMzEuOTA2MiAxNzEuNzAzMSAxMjMuNDY4OCAxNzUuNSBRMTE1LjQ1MzEgMTc5LjE1NjIgMTA1Ljc1IDE3OS4xNTYyIFE4NS41IDE3OS4xNTYyIDczLjY4NzUgMTY4LjQ2ODggUTYxLjg3NSAxNTcuNzgxMiA2MS44NzUgMTM5LjIxODggUTYxLjg3NSAxMjEuMDc4MSA3NC4xMDk0IDExMC4yNSBRODYuNDg0NCA5OS4yODEyIDEwNi44NzUgOTkuMjgxMiBRMTMwLjM1OTQgOTkuMjgxMiAxNDIuNTkzOCAxMTQuODkwNiBRMTU0Ljk2ODggMTMwLjUgMTU0Ljk2ODggMTYwLjMxMjUgUTE1NC45Njg4IDE4OC4xNTYyIDEzOS45MjE5IDIwNC42MDk0IFExMjQuNzM0NCAyMjEuMjAzMSA5OS4xNDA2IDIyMS4yMDMxIFE5Mi4yNSAyMjEuMjAzMSA4NS4yMTg4IDIyMC4wNzgxIFE3OC4xODc1IDIxOC44MTI1IDcwLjU5MzggMjE2LjU2MjUgWk0xMDYuODc1IDE2Ni43ODEyIFExMTkuMjUgMTY2Ljc4MTIgMTI2LjQyMTkgMTU5LjQ2ODggUTEzMy41OTM4IDE1Mi4xNTYyIDEzMy41OTM4IDEzOS4yMTg4IFExMzMuNTkzOCAxMjYuNTYyNSAxMjYuNDIxOSAxMTkuMjUgUTExOS4yNSAxMTEuNzk2OSAxMDYuODc1IDExMS43OTY5IFE5NC45MjE5IDExMS43OTY5IDg3LjQ2ODggMTE5LjI1IFE4MC4xNTYyIDEyNi41NjI1IDgwLjE1NjIgMTM5LjIxODggUTgwLjE1NjIgMTUyLjE1NjIgODcuNDY4OCAxNTkuNDY4OCBROTQuNjQwNiAxNjYuNzgxMiAxMDYuODc1IDE2Ni43ODEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpTEwXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTU5LjA0NjkgMTExLjc5NjkgUTE0OS4wNjI1IDExMS43OTY5IDE0Mi4wMzEyIDEyMy44OTA2IFExMzQuODU5NCAxMzUuOTg0NCAxMzQuODU5NCAxNjAuMTcxOSBRMTM0Ljg1OTQgMTg0LjUgMTQyLjAzMTIgMTk2LjU5MzggUTE0OS4wNjI1IDIwOC42ODc1IDE1OS4wNDY5IDIwOC42ODc1IFExNjkuMDMxMiAyMDguNjg3NSAxNzYuMDYyNSAxOTYuNTkzOCBRMTgzLjIzNDQgMTg0LjUgMTgzLjIzNDQgMTYwLjE3MTkgUTE4My4yMzQ0IDEzNS45ODQ0IDE3Ni4wNjI1IDEyMy44OTA2IFExNjkuMDMxMiAxMTEuNzk2OSAxNTkuMDQ2OSAxMTEuNzk2OSBaTTE1OS4wNDY5IDk5LjI4MTIgUTE3Ny40Njg4IDk5LjI4MTIgMTg5LjQyMTkgMTE0Ljg5MDYgUTIwMS4zNzUgMTMwLjUgMjAxLjM3NSAxNjAuMTcxOSBRMjAxLjM3NSAxODkuOTg0NCAxODkuNDIxOSAyMDUuNTkzOCBRMTc3LjQ2ODggMjIxLjIwMzEgMTU5LjA0NjkgMjIxLjIwMzEgUTEzNi4yNjU2IDIyMS4yMDMxIDEyNi40MjE5IDIwNS41OTM4IFExMTYuNTc4MSAxODkuOTg0NCAxMTYuNTc4MSAxNjAuMTcxOSBRMTE2LjU3ODEgMTMwLjUgMTI2LjQyMTkgMTE0Ljg5MDYgUTEzNi4yNjU2IDk5LjI4MTIgMTU5LjA0NjkgOTkuMjgxMiBaTTgwLjU3ODEgMjE5LjA5MzggTDgwLjU3ODEgMTE3LjcwMzEgTDYxLjg3NSAxMjMuNDY4OCBMNjEuODc1IDEwNy4xNTYyIEw4MS41NjI1IDEwMS42NzE5IEwxMDAuODI4MSAxMDEuNjcxOSBMMTAwLjgyODEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlSlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTg5LjE1NjIgMTAxLjY3MTkgTDEwNy4wMTU2IDEwMS42NzE5IEwxMDcuMDE1NiAxNzguNzM0NCBRMTA3LjAxNTYgMTk5LjY4NzUgOTcuODc1IDIwOS41MzEyIFE4OC44NzUgMjE5LjIzNDQgNjguNzY1NiAyMTkuMjM0NCBMNjEuODc1IDIxOS4yMzQ0IEw2MS44NzUgMjA1LjczNDQgTDY3LjUgMjA1LjczNDQgUTc5LjMxMjUgMjA1LjczNDQgODQuMjM0NCAxOTkuODI4MSBRODkuMTU2MiAxOTMuOTIxOSA4OS4xNTYyIDE3OC43MzQ0IEw4OS4xNTYyIDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpVFcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTEwNy4yOTY5IDIyMS4wNjI1IFExMDYuNzM0NCAyMjEuMDYyNSAxMDUuNTM5MSAyMjEuMTMyOCBRMTA0LjM0MzggMjIxLjIwMzEgMTAzLjY0MDYgMjIxLjIwMzEgUTgxLjQyMTkgMjIxLjIwMzEgNzAuNTIzNCAyMDYuMDg1OSBRNTkuNjI1IDE5MC45Njg4IDU5LjYyNSAxNjAuMzEyNSBRNTkuNjI1IDEyOS41MTU2IDcwLjU5MzggMTE0LjM5ODQgUTgxLjU2MjUgOTkuMjgxMiAxMDMuNzgxMiA5OS4yODEyIFExMjYuMTQwNiA5OS4yODEyIDEzNy4xMDk0IDExNC4zOTg0IFExNDguMDc4MSAxMjkuNTE1NiAxNDguMDc4MSAxNjAuMzEyNSBRMTQ4LjA3ODEgMTgzLjUxNTYgMTQyLjAzMTIgMTk3LjY0ODQgUTEzNS45ODQ0IDIxMS43ODEyIDEyMy42MDk0IDIxNy40MDYyIEwxNDEuMzI4MSAyMzIuMzEyNSBMMTI3Ljk2ODggMjQwLjE4NzUgTDEwNy4yOTY5IDIyMS4wNjI1IFpNMTI5LjM3NSAxNjAuMzEyNSBRMTI5LjM3NSAxMzQuNDM3NSAxMjMuMzk4NCAxMjMuMzI4MSBRMTE3LjQyMTkgMTEyLjIxODggMTAzLjc4MTIgMTEyLjIxODggUTkwLjI4MTIgMTEyLjIxODggODQuMzA0NyAxMjMuMzI4MSBRNzguMzI4MSAxMzQuNDM3NSA3OC4zMjgxIDE2MC4zMTI1IFE3OC4zMjgxIDE4Ni4xODc1IDg0LjMwNDcgMTk3LjI5NjkgUTkwLjI4MTIgMjA4LjQwNjIgMTAzLjc4MTIgMjA4LjQwNjIgUTExNy40MjE5IDIwOC40MDYyIDEyMy4zOTg0IDE5Ny4yOTY5IFExMjkuMzc1IDE4Ni4xODc1IDEyOS4zNzUgMTYwLjMxMjUgWk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTY0LjI2NTYgODQuNzk2OSBRNDcuMzkwNiA4NC43OTY5IDQ3LjM5MDYgMTAxLjY3MTkgTDQ3LjM5MDYgMzcwLjY4NzUgUTQ3LjM5MDYgMzg3LjU2MjUgNjQuMjY1NiAzODcuNTYyNSBMMjM1LjEyNSAzODcuNTYyNSBRMjUyIDM4Ny41NjI1IDI1MiAzNzAuNjg3NSBMMjUyIDEwMS42NzE5IFEyNTIgODQuNzk2OSAyMzUuMTI1IDg0Ljc5NjkgTDY0LjI2NTYgODQuNzk2OSBaTTY0LjI2NTYgNjcuOTIxOSBMMjM1LjEyNSA2Ny45MjE5IFEyNjguODc1IDY3LjkyMTkgMjY4Ljg3NSAxMDEuNjcxOSBMMjY4Ljg3NSAzNzAuNjg3NSBRMjY4Ljg3NSA0MDQuNDM3NSAyMzUuMTI1IDQwNC40Mzc1IEw2NC4yNjU2IDQwNC40Mzc1IFEzMC41MTU2IDQwNC40Mzc1IDMwLjUxNTYgMzcwLjY4NzUgTDMwLjUxNTYgMTAxLjY3MTkgUTMwLjUxNTYgNjcuOTIxOSA2NC4yNjU2IDY3LjkyMTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlS1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTYxLjg3NSAxMDEuNjcxOSBMNzkuNzM0NCAxMDEuNjcxOSBMNzkuNzM0NCAxNTEuMzEyNSBMMTMwLjY0MDYgMTAxLjY3MTkgTDE1My43MDMxIDEwMS42NzE5IEw5Ni40Njg4IDE1Ni41MTU2IEwxNTguMzQzOCAyMTkuMjM0NCBMMTM0Ljg1OTQgMjE5LjIzNDQgTDc5LjczNDQgMTYyLjU2MjUgTDc5LjczNDQgMjE5LjIzNDQgTDYxLjg3NSAyMTkuMjM0NCBMNjEuODc1IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpkFcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuNjcxOSAxMTUuNzM0NCBMOTEuODI4MSAxNzUuNzgxMiBMMTI5LjUxNTYgMTc1Ljc4MTIgTDExMC42NzE5IDExNS43MzQ0IFpNOTkuOTg0NCAxMDEuNjcxOSBMMTIxLjY0MDYgMTAxLjY3MTkgTDE2Mi4xNDA2IDIxOS4yMzQ0IEwxNDMuNTc4MSAyMTkuMjM0NCBMMTM0LjAxNTYgMTg4LjU3ODEgTDg3LjYwOTQgMTg4LjU3ODEgTDc4LjA0NjkgMjE5LjIzNDQgTDU5LjQ4NDQgMjE5LjIzNDQgTDk5Ljk4NDQgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmMlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTg2LjM0MzggMjAzLjA2MjUgTDE0NS45Njg4IDIwMy4wNjI1IEwxNDUuOTY4OCAyMTkuMDkzOCBMNjEuODc1IDIxOS4wOTM4IEw2MS44NzUgMjAzLjYyNSBRNjYuNjU2MiAxOTkuMjY1NiA3NS41MTU2IDE5MS4zOTA2IFExMjMuODkwNiAxNDguNSAxMjMuODkwNiAxMzUuMjgxMiBRMTIzLjg5MDYgMTI2IDExNi41NzgxIDEyMC4zMDQ3IFExMDkuMjY1NiAxMTQuNjA5NCA5Ny4zMTI1IDExNC42MDk0IFE5MCAxMTQuNjA5NCA4MS40MjE5IDExNy4wNzAzIFE3Mi44NDM4IDExOS41MzEyIDYyLjcxODggMTI0LjQ1MzEgTDYyLjcxODggMTA3LjE1NjIgUTczLjU0NjkgMTAzLjIxODggODIuODk4NCAxMDEuMjUgUTkyLjI1IDk5LjI4MTIgMTAwLjI2NTYgOTkuMjgxMiBRMTIwLjY1NjIgOTkuMjgxMiAxMzIuODkwNiAxMDguNTYyNSBRMTQ1LjEyNSAxMTcuODQzOCAxNDUuMTI1IDEzMy4wMzEyIFExNDUuMTI1IDE1Mi41NzgxIDk4LjU3ODEgMTkyLjUxNTYgUTkwLjcwMzEgMTk5LjI2NTYgODYuMzQzOCAyMDMuMDYyNSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaYzXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTIxLjc4MTIgMTU1LjUzMTIgUTEzNC43MTg4IDE1OC4wNjI1IDE0MS44MjAzIDE2NS43MjY2IFExNDguOTIxOSAxNzMuMzkwNiAxNDguOTIxOSAxODQuOTIxOSBRMTQ4LjkyMTkgMjAyLjM1OTQgMTM1LjU2MjUgMjExLjc4MTIgUTEyMi4yMDMxIDIyMS4yMDMxIDk3LjMxMjUgMjIxLjIwMzEgUTg5LjI5NjkgMjIxLjIwMzEgODAuNTA3OCAyMTkuNzI2NiBRNzEuNzE4OCAyMTguMjUgNjEuODc1IDIxNS40Mzc1IEw2MS44NzUgMTk4LjQyMTkgUTY5LjE4NzUgMjAyLjIxODggNzcuNTU0NyAyMDQuMDQ2OSBRODUuOTIxOSAyMDUuODc1IDk1LjM0MzggMjA1Ljg3NSBRMTEwLjY3MTkgMjA1Ljg3NSAxMTkuMTA5NCAyMDAuMzIwMyBRMTI3LjU0NjkgMTk0Ljc2NTYgMTI3LjU0NjkgMTg0LjkyMTkgUTEyNy41NDY5IDE3NC41MTU2IDExOS43NDIyIDE2OS4xNzE5IFExMTEuOTM3NSAxNjMuODI4MSA5Ni43NSAxNjMuODI4MSBMODQuNjU2MiAxNjMuODI4MSBMODQuNjU2MiAxNDguNjQwNiBMOTcuODc1IDE0OC42NDA2IFExMTEuMDkzOCAxNDguNjQwNiAxMTcuOTE0MSAxNDQuMjEwOSBRMTI0LjczNDQgMTM5Ljc4MTIgMTI0LjczNDQgMTMxLjM0MzggUTEyNC43MzQ0IDEyMy4xODc1IDExNy43MDMxIDExOC44OTg0IFExMTAuNjcxOSAxMTQuNjA5NCA5Ny4zMTI1IDExNC42MDk0IFE5MS42ODc1IDExNC42MDk0IDg0LjUxNTYgMTE1Ljg3NSBRNzcuMzQzOCAxMTcuMTQwNiA2NS45NTMxIDEyMC4zNzUgTDY1Ljk1MzEgMTA0LjIwMzEgUTc2LjIxODggMTAxLjgxMjUgODUuMjE4OCAxMDAuNTQ2OSBROTQuMjE4OCA5OS4yODEyIDEwMS45NTMxIDk5LjI4MTIgUTEyMi4yMDMxIDk5LjI4MTIgMTM0LjA4NTkgMTA3LjU3ODEgUTE0NS45Njg4IDExNS44NzUgMTQ1Ljk2ODggMTI5Ljc5NjkgUTE0NS45Njg4IDEzOS41IDEzOS42NDA2IDE0Ni4yNSBRMTMzLjMxMjUgMTUzIDEyMS43ODEyIDE1NS41MzEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpjRcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMjAuMDkzOCAxMTguNjg3NSBMNzYuNjQwNiAxNzcuNjA5NCBMMTIwLjA5MzggMTc3LjYwOTQgTDEyMC4wOTM4IDExOC42ODc1IFpNMTE3IDEwMS42NzE5IEwxNDAuMzQzOCAxMDEuNjcxOSBMMTQwLjM0MzggMTc3LjYwOTQgTDE1OS4zMjgxIDE3Ny42MDk0IEwxNTkuMzI4MSAxOTIuOTM3NSBMMTQwLjM0MzggMTkyLjkzNzUgTDE0MC4zNDM4IDIxOS4wOTM4IEwxMjAuMDkzOCAyMTkuMDkzOCBMMTIwLjA5MzggMTkyLjkzNzUgTDYxLjg3NSAxOTIuOTM3NSBMNjEuODc1IDE3NS45MjE5IEwxMTcgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmNVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTY3LjUgMTAxLjY3MTkgTDEzOS4yMTg4IDEwMS42NzE5IEwxMzkuMjE4OCAxMTUuMDMxMiBMODQuMjM0NCAxMTUuMDMxMiBMODQuMjM0NCAxNDMuNzE4OCBRODguMTcxOSAxNDIuNDUzMSA5Mi4yNSAxNDEuODkwNiBROTYuMTg3NSAxNDEuMzI4MSAxMDAuMTI1IDE0MS4zMjgxIFExMjIuNzY1NiAxNDEuMzI4MSAxMzUuOTg0NCAxNTIuMTU2MiBRMTQ5LjIwMzEgMTYyLjg0MzggMTQ5LjIwMzEgMTgxLjI2NTYgUTE0OS4yMDMxIDIwMC4yNSAxMzUuNTYyNSAyMTAuNzk2OSBRMTIyLjA2MjUgMjIxLjIwMzEgOTcuMzEyNSAyMjEuMjAzMSBRODguODc1IDIyMS4yMDMxIDgwLjAxNTYgMjE5LjkzNzUgUTcxLjE1NjIgMjE4LjY3MTkgNjEuODc1IDIxNi4xNDA2IEw2MS44NzUgMjAwLjI1IFE2OS44OTA2IDIwNC4wNDY5IDc4LjYwOTQgMjA2LjAxNTYgUTg3LjMyODEgMjA3Ljg0MzggOTcuMDMxMiAyMDcuODQzOCBRMTEyLjY0MDYgMjA3Ljg0MzggMTIxLjc4MTIgMjAwLjY3MTkgUTEzMC45MjE5IDE5My41IDEzMC45MjE5IDE4MS4yNjU2IFExMzAuOTIxOSAxNjkuMDMxMiAxMjEuNzgxMiAxNjEuODU5NCBRMTEyLjY0MDYgMTU0LjY4NzUgOTcuMDMxMiAxNTQuNjg3NSBRODkuNzE4OCAxNTQuNjg3NSA4Mi40MDYyIDE1Ni4wOTM4IFE3NS4wOTM4IDE1Ny41IDY3LjUgMTYwLjQ1MzEgTDY3LjUgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmNlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTExMC4xMDk0IDE1My43MDMxIFE5Ny43MzQ0IDE1My43MDMxIDkwLjU2MjUgMTYxLjAxNTYgUTgzLjM5MDYgMTY4LjQ2ODggODMuMzkwNiAxODEuMjY1NiBRODMuMzkwNiAxOTMuOTIxOSA5MC41NjI1IDIwMS4yMzQ0IFE5Ny43MzQ0IDIwOC42ODc1IDExMC4xMDk0IDIwOC42ODc1IFExMjIuMzQzOCAyMDguNjg3NSAxMjkuNTE1NiAyMDEuMjM0NCBRMTM2LjY4NzUgMTkzLjkyMTkgMTM2LjY4NzUgMTgxLjI2NTYgUTEzNi42ODc1IDE2OC40Njg4IDEyOS41MTU2IDE2MS4wMTU2IFExMjIuMzQzOCAxNTMuNzAzMSAxMTAuMTA5NCAxNTMuNzAzMSBaTTE0Ni4zOTA2IDEwMy45MjE5IEwxNDYuMzkwNiAxMTguNDA2MiBRMTM5LjUgMTE1LjU5MzggMTMyLjQ2ODggMTE0LjE4NzUgUTEyNS40Mzc1IDExMi42NDA2IDExOC41NDY5IDExMi42NDA2IFExMDAuNTQ2OSAxMTIuNjQwNiA5MC45ODQ0IDEyMy4xODc1IFE4MS40MjE5IDEzMy44NzUgODAuMDE1NiAxNTUuMzkwNiBRODUuMzU5NCAxNDguNSA5My4zNzUgMTQ0Ljg0MzggUTEwMS41MzEyIDE0MS4xODc1IDExMS4wOTM4IDE0MS4xODc1IFExMzEuNDg0NCAxNDEuMTg3NSAxNDMuMjk2OSAxNTEuODc1IFExNTUuMTA5NCAxNjIuNzAzMSAxNTUuMTA5NCAxODEuMjY1NiBRMTU1LjEwOTQgMTk5LjEyNSAxNDIuNzM0NCAyMTAuMjM0NCBRMTMwLjUgMjIxLjIwMzEgMTEwLjEwOTQgMjIxLjIwMzEgUTg2LjYyNSAyMjEuMjAzMSA3NC4yNSAyMDUuNTkzOCBRNjEuODc1IDE4OS45ODQ0IDYxLjg3NSAxNjAuMTcxOSBRNjEuODc1IDEzMi4zMjgxIDc3LjA2MjUgMTE1Ljg3NSBROTIuMjUgOTkuMjgxMiAxMTcuODQzOCA5OS4yODEyIFExMjQuNzM0NCA5OS4yODEyIDEzMS43NjU2IDEwMC40MDYyIFExMzguNzk2OSAxMDEuNjcxOSAxNDYuMzkwNiAxMDMuOTIxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaY3XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjEuODc1IDEwMS42NzE5IEwxNDguNjQwNiAxMDEuNjcxOSBMMTQ4LjY0MDYgMTA4LjQyMTkgTDk5LjcwMzEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggTDEyNi43MDMxIDExNS4wMzEyIEw2MS44NzUgMTE1LjAzMTIgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaY4XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTA4LjI4MTIgMTYzLjEyNSBROTUuMjAzMSAxNjMuMTI1IDg3Ljc1IDE2OS4zMTI1IFE4MC4yOTY5IDE3NS4zNTk0IDgwLjI5NjkgMTg1LjkwNjIgUTgwLjI5NjkgMTk2LjU5MzggODcuNzUgMjAyLjY0MDYgUTk1LjIwMzEgMjA4LjY4NzUgMTA4LjI4MTIgMjA4LjY4NzUgUTEyMS4yMTg4IDIwOC42ODc1IDEyOC44MTI1IDIwMi41IFExMzYuMjY1NiAxOTYuNDUzMSAxMzYuMjY1NiAxODUuOTA2MiBRMTM2LjI2NTYgMTc1LjM1OTQgMTI4LjgxMjUgMTY5LjMxMjUgUTEyMS4zNTk0IDE2My4xMjUgMTA4LjI4MTIgMTYzLjEyNSBaTTkwIDE1Ni4yMzQ0IFE3OC4xODc1IDE1My43MDMxIDcxLjcxODggMTQ2LjgxMjUgUTY1LjEwOTQgMTM5Ljc4MTIgNjUuMTA5NCAxMjkuNjU2MiBRNjUuMTA5NCAxMTUuNTkzOCA3Ni42NDA2IDEwNy40Mzc1IFE4OC4xNzE5IDk5LjI4MTIgMTA4LjI4MTIgOTkuMjgxMiBRMTI4LjM5MDYgOTkuMjgxMiAxMzkuOTIxOSAxMDcuNDM3NSBRMTUxLjMxMjUgMTE1LjU5MzggMTUxLjMxMjUgMTI5LjY1NjIgUTE1MS4zMTI1IDE0MC4wNjI1IDE0NC44NDM4IDE0Ni44MTI1IFExMzguMjM0NCAxNTMuNzAzMSAxMjYuNTYyNSAxNTYuMjM0NCBRMTM5LjIxODggMTU4Ljc2NTYgMTQ3LjA5MzggMTY2LjkyMTkgUTE1NC41NDY5IDE3NC42NTYyIDE1NC41NDY5IDE4NS45MDYyIFExNTQuNTQ2OSAyMDIuOTIxOSAxNDIuNTkzOCAyMTIuMDYyNSBRMTMwLjUgMjIxLjIwMzEgMTA4LjI4MTIgMjIxLjIwMzEgUTg1LjkyMTkgMjIxLjIwMzEgNzMuOTY4OCAyMTIuMDYyNSBRNjEuODc1IDIwMi45MjE5IDYxLjg3NSAxODUuOTA2MiBRNjEuODc1IDE3NC45Mzc1IDY5LjMyODEgMTY2LjkyMTkgUTc2LjkyMTkgMTU5LjA0NjkgOTAgMTU2LjIzNDQgWk04My4yNSAxMzEuMjAzMSBRODMuMjUgMTQwLjA2MjUgODkuODU5NCAxNDUuNDA2MiBROTYuMzI4MSAxNTAuNjA5NCAxMDguMjgxMiAxNTAuNjA5NCBRMTE5LjY3MTkgMTUwLjYwOTQgMTI2LjU2MjUgMTQ1LjQwNjIgUTEzMy4zMTI1IDE0MC4zNDM4IDEzMy4zMTI1IDEzMS4yMDMxIFExMzMuMzEyNSAxMjIuMzQzOCAxMjYuNTYyNSAxMTcgUTExOS45NTMxIDExMS43OTY5IDEwOC4yODEyIDExMS43OTY5IFE5Ni42MDk0IDExMS43OTY5IDg5Ljg1OTQgMTE3IFE4My4yNSAxMjIuMDYyNSA4My4yNSAxMzEuMjAzMSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaY5XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNzAuNTkzOCAyMTYuNTYyNSBMNzAuNTkzOCAyMDIuMDc4MSBRNzcuNDg0NCAyMDQuODkwNiA4NC41MTU2IDIwNi40Mzc1IFE5MS41NDY5IDIwNy44NDM4IDk4LjI5NjkgMjA3Ljg0MzggUTExNi40Mzc1IDIwNy44NDM4IDEyNiAxOTcuMjk2OSBRMTM1LjQyMTkgMTg2Ljc1IDEzNi44MjgxIDE2NS4wOTM4IFExMzEuOTA2MiAxNzEuNzAzMSAxMjMuNDY4OCAxNzUuNSBRMTE1LjQ1MzEgMTc5LjE1NjIgMTA1Ljc1IDE3OS4xNTYyIFE4NS41IDE3OS4xNTYyIDczLjY4NzUgMTY4LjQ2ODggUTYxLjg3NSAxNTcuNzgxMiA2MS44NzUgMTM5LjIxODggUTYxLjg3NSAxMjEuMDc4MSA3NC4xMDk0IDExMC4yNSBRODYuNDg0NCA5OS4yODEyIDEwNi44NzUgOTkuMjgxMiBRMTMwLjM1OTQgOTkuMjgxMiAxNDIuNTkzOCAxMTQuODkwNiBRMTU0Ljk2ODggMTMwLjUgMTU0Ljk2ODggMTYwLjMxMjUgUTE1NC45Njg4IDE4OC4xNTYyIDEzOS45MjE5IDIwNC42MDk0IFExMjQuNzM0NCAyMjEuMjAzMSA5OS4xNDA2IDIyMS4yMDMxIFE5Mi4yNSAyMjEuMjAzMSA4NS4yMTg4IDIyMC4wNzgxIFE3OC4xODc1IDIxOC44MTI1IDcwLjU5MzggMjE2LjU2MjUgWk0xMDYuODc1IDE2Ni43ODEyIFExMTkuMjUgMTY2Ljc4MTIgMTI2LjQyMTkgMTU5LjQ2ODggUTEzMy41OTM4IDE1Mi4xNTYyIDEzMy41OTM4IDEzOS4yMTg4IFExMzMuNTkzOCAxMjYuNTYyNSAxMjYuNDIxOSAxMTkuMjUgUTExOS4yNSAxMTEuNzk2OSAxMDYuODc1IDExMS43OTY5IFE5NC45MjE5IDExMS43OTY5IDg3LjQ2ODggMTE5LjI1IFE4MC4xNTYyIDEyNi41NjI1IDgwLjE1NjIgMTM5LjIxODggUTgwLjE1NjIgMTUyLjE1NjIgODcuNDY4OCAxNTkuNDY4OCBROTQuNjQwNiAxNjYuNzgxMiAxMDYuODc1IDE2Ni43ODEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpjEwXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTU5LjA0NjkgMTExLjc5NjkgUTE0OS4wNjI1IDExMS43OTY5IDE0Mi4wMzEyIDEyMy44OTA2IFExMzQuODU5NCAxMzUuOTg0NCAxMzQuODU5NCAxNjAuMTcxOSBRMTM0Ljg1OTQgMTg0LjUgMTQyLjAzMTIgMTk2LjU5MzggUTE0OS4wNjI1IDIwOC42ODc1IDE1OS4wNDY5IDIwOC42ODc1IFExNjkuMDMxMiAyMDguNjg3NSAxNzYuMDYyNSAxOTYuNTkzOCBRMTgzLjIzNDQgMTg0LjUgMTgzLjIzNDQgMTYwLjE3MTkgUTE4My4yMzQ0IDEzNS45ODQ0IDE3Ni4wNjI1IDEyMy44OTA2IFExNjkuMDMxMiAxMTEuNzk2OSAxNTkuMDQ2OSAxMTEuNzk2OSBaTTE1OS4wNDY5IDk5LjI4MTIgUTE3Ny40Njg4IDk5LjI4MTIgMTg5LjQyMTkgMTE0Ljg5MDYgUTIwMS4zNzUgMTMwLjUgMjAxLjM3NSAxNjAuMTcxOSBRMjAxLjM3NSAxODkuOTg0NCAxODkuNDIxOSAyMDUuNTkzOCBRMTc3LjQ2ODggMjIxLjIwMzEgMTU5LjA0NjkgMjIxLjIwMzEgUTEzNi4yNjU2IDIyMS4yMDMxIDEyNi40MjE5IDIwNS41OTM4IFExMTYuNTc4MSAxODkuOTg0NCAxMTYuNTc4MSAxNjAuMTcxOSBRMTE2LjU3ODEgMTMwLjUgMTI2LjQyMTkgMTE0Ljg5MDYgUTEzNi4yNjU2IDk5LjI4MTIgMTU5LjA0NjkgOTkuMjgxMiBaTTgwLjU3ODEgMjE5LjA5MzggTDgwLjU3ODEgMTE3LjcwMzEgTDYxLjg3NSAxMjMuNDY4OCBMNjEuODc1IDEwNy4xNTYyIEw4MS41NjI1IDEwMS42NzE5IEwxMDAuODI4MSAxMDEuNjcxOSBMMTAwLjgyODEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmSlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTg5LjE1NjIgMTAxLjY3MTkgTDEwNy4wMTU2IDEwMS42NzE5IEwxMDcuMDE1NiAxNzguNzM0NCBRMTA3LjAxNTYgMTk5LjY4NzUgOTcuODc1IDIwOS41MzEyIFE4OC44NzUgMjE5LjIzNDQgNjguNzY1NiAyMTkuMjM0NCBMNjEuODc1IDIxOS4yMzQ0IEw2MS44NzUgMjA1LjczNDQgTDY3LjUgMjA1LjczNDQgUTc5LjMxMjUgMjA1LjczNDQgODQuMjM0NCAxOTkuODI4MSBRODkuMTU2MiAxOTMuOTIxOSA4OS4xNTYyIDE3OC43MzQ0IEw4OS4xNTYyIDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZplFcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNMTA3LjI5NjkgMjIxLjA2MjUgUTEwNi43MzQ0IDIyMS4wNjI1IDEwNS41MzkxIDIyMS4xMzI4IFExMDQuMzQzOCAyMjEuMjAzMSAxMDMuNjQwNiAyMjEuMjAzMSBRODEuNDIxOSAyMjEuMjAzMSA3MC41MjM0IDIwNi4wODU5IFE1OS42MjUgMTkwLjk2ODggNTkuNjI1IDE2MC4zMTI1IFE1OS42MjUgMTI5LjUxNTYgNzAuNTkzOCAxMTQuMzk4NCBRODEuNTYyNSA5OS4yODEyIDEwMy43ODEyIDk5LjI4MTIgUTEyNi4xNDA2IDk5LjI4MTIgMTM3LjEwOTQgMTE0LjM5ODQgUTE0OC4wNzgxIDEyOS41MTU2IDE0OC4wNzgxIDE2MC4zMTI1IFExNDguMDc4MSAxODMuNTE1NiAxNDIuMDMxMiAxOTcuNjQ4NCBRMTM1Ljk4NDQgMjExLjc4MTIgMTIzLjYwOTQgMjE3LjQwNjIgTDE0MS4zMjgxIDIzMi4zMTI1IEwxMjcuOTY4OCAyNDAuMTg3NSBMMTA3LjI5NjkgMjIxLjA2MjUgWk0xMjkuMzc1IDE2MC4zMTI1IFExMjkuMzc1IDEzNC40Mzc1IDEyMy4zOTg0IDEyMy4zMjgxIFExMTcuNDIxOSAxMTIuMjE4OCAxMDMuNzgxMiAxMTIuMjE4OCBROTAuMjgxMiAxMTIuMjE4OCA4NC4zMDQ3IDEyMy4zMjgxIFE3OC4zMjgxIDEzNC40Mzc1IDc4LjMyODEgMTYwLjMxMjUgUTc4LjMyODEgMTg2LjE4NzUgODQuMzA0NyAxOTcuMjk2OSBROTAuMjgxMiAyMDguNDA2MiAxMDMuNzgxMiAyMDguNDA2MiBRMTE3LjQyMTkgMjA4LjQwNjIgMTIzLjM5ODQgMTk3LjI5NjkgUTEyOS4zNzUgMTg2LjE4NzUgMTI5LjM3NSAxNjAuMzEyNSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpktcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02MS44NzUgMTAxLjY3MTkgTDc5LjczNDQgMTAxLjY3MTkgTDc5LjczNDQgMTUxLjMxMjUgTDEzMC42NDA2IDEwMS42NzE5IEwxNTMuNzAzMSAxMDEuNjcxOSBMOTYuNDY4OCAxNTYuNTE1NiBMMTU4LjM0MzggMjE5LjIzNDQgTDEzNC44NTk0IDIxOS4yMzQ0IEw3OS43MzQ0IDE2Mi41NjI1IEw3OS43MzQ0IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaNBXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuNjcxOSAxMTUuNzM0NCBMOTEuODI4MSAxNzUuNzgxMiBMMTI5LjUxNTYgMTc1Ljc4MTIgTDExMC42NzE5IDExNS43MzQ0IFpNOTkuOTg0NCAxMDEuNjcxOSBMMTIxLjY0MDYgMTAxLjY3MTkgTDE2Mi4xNDA2IDIxOS4yMzQ0IEwxNDMuNTc4MSAyMTkuMjM0NCBMMTM0LjAxNTYgMTg4LjU3ODEgTDg3LjYwOTQgMTg4LjU3ODEgTDc4LjA0NjkgMjE5LjIzNDQgTDU5LjQ4NDQgMjE5LjIzNDQgTDk5Ljk4NDQgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjMlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODYuMzQzOCAyMDMuMDYyNSBMMTQ1Ljk2ODggMjAzLjA2MjUgTDE0NS45Njg4IDIxOS4wOTM4IEw2MS44NzUgMjE5LjA5MzggTDYxLjg3NSAyMDMuNjI1IFE2Ni42NTYyIDE5OS4yNjU2IDc1LjUxNTYgMTkxLjM5MDYgUTEyMy44OTA2IDE0OC41IDEyMy44OTA2IDEzNS4yODEyIFExMjMuODkwNiAxMjYgMTE2LjU3ODEgMTIwLjMwNDcgUTEwOS4yNjU2IDExNC42MDk0IDk3LjMxMjUgMTE0LjYwOTQgUTkwIDExNC42MDk0IDgxLjQyMTkgMTE3LjA3MDMgUTcyLjg0MzggMTE5LjUzMTIgNjIuNzE4OCAxMjQuNDUzMSBMNjIuNzE4OCAxMDcuMTU2MiBRNzMuNTQ2OSAxMDMuMjE4OCA4Mi44OTg0IDEwMS4yNSBROTIuMjUgOTkuMjgxMiAxMDAuMjY1NiA5OS4yODEyIFExMjAuNjU2MiA5OS4yODEyIDEzMi44OTA2IDEwOC41NjI1IFExNDUuMTI1IDExNy44NDM4IDE0NS4xMjUgMTMzLjAzMTIgUTE0NS4xMjUgMTUyLjU3ODEgOTguNTc4MSAxOTIuNTE1NiBROTAuNzAzMSAxOTkuMjY1NiA4Ni4zNDM4IDIwMy4wNjI1IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZozNcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEyMS43ODEyIDE1NS41MzEyIFExMzQuNzE4OCAxNTguMDYyNSAxNDEuODIwMyAxNjUuNzI2NiBRMTQ4LjkyMTkgMTczLjM5MDYgMTQ4LjkyMTkgMTg0LjkyMTkgUTE0OC45MjE5IDIwMi4zNTk0IDEzNS41NjI1IDIxMS43ODEyIFExMjIuMjAzMSAyMjEuMjAzMSA5Ny4zMTI1IDIyMS4yMDMxIFE4OS4yOTY5IDIyMS4yMDMxIDgwLjUwNzggMjE5LjcyNjYgUTcxLjcxODggMjE4LjI1IDYxLjg3NSAyMTUuNDM3NSBMNjEuODc1IDE5OC40MjE5IFE2OS4xODc1IDIwMi4yMTg4IDc3LjU1NDcgMjA0LjA0NjkgUTg1LjkyMTkgMjA1Ljg3NSA5NS4zNDM4IDIwNS44NzUgUTExMC42NzE5IDIwNS44NzUgMTE5LjEwOTQgMjAwLjMyMDMgUTEyNy41NDY5IDE5NC43NjU2IDEyNy41NDY5IDE4NC45MjE5IFExMjcuNTQ2OSAxNzQuNTE1NiAxMTkuNzQyMiAxNjkuMTcxOSBRMTExLjkzNzUgMTYzLjgyODEgOTYuNzUgMTYzLjgyODEgTDg0LjY1NjIgMTYzLjgyODEgTDg0LjY1NjIgMTQ4LjY0MDYgTDk3Ljg3NSAxNDguNjQwNiBRMTExLjA5MzggMTQ4LjY0MDYgMTE3LjkxNDEgMTQ0LjIxMDkgUTEyNC43MzQ0IDEzOS43ODEyIDEyNC43MzQ0IDEzMS4zNDM4IFExMjQuNzM0NCAxMjMuMTg3NSAxMTcuNzAzMSAxMTguODk4NCBRMTEwLjY3MTkgMTE0LjYwOTQgOTcuMzEyNSAxMTQuNjA5NCBROTEuNjg3NSAxMTQuNjA5NCA4NC41MTU2IDExNS44NzUgUTc3LjM0MzggMTE3LjE0MDYgNjUuOTUzMSAxMjAuMzc1IEw2NS45NTMxIDEwNC4yMDMxIFE3Ni4yMTg4IDEwMS44MTI1IDg1LjIxODggMTAwLjU0NjkgUTk0LjIxODggOTkuMjgxMiAxMDEuOTUzMSA5OS4yODEyIFExMjIuMjAzMSA5OS4yODEyIDEzNC4wODU5IDEwNy41NzgxIFExNDUuOTY4OCAxMTUuODc1IDE0NS45Njg4IDEyOS43OTY5IFExNDUuOTY4OCAxMzkuNSAxMzkuNjQwNiAxNDYuMjUgUTEzMy4zMTI1IDE1MyAxMjEuNzgxMiAxNTUuNTMxMiBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaM0XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMjAuMDkzOCAxMTguNjg3NSBMNzYuNjQwNiAxNzcuNjA5NCBMMTIwLjA5MzggMTc3LjYwOTQgTDEyMC4wOTM4IDExOC42ODc1IFpNMTE3IDEwMS42NzE5IEwxNDAuMzQzOCAxMDEuNjcxOSBMMTQwLjM0MzggMTc3LjYwOTQgTDE1OS4zMjgxIDE3Ny42MDk0IEwxNTkuMzI4MSAxOTIuOTM3NSBMMTQwLjM0MzggMTkyLjkzNzUgTDE0MC4zNDM4IDIxOS4wOTM4IEwxMjAuMDkzOCAyMTkuMDkzOCBMMTIwLjA5MzggMTkyLjkzNzUgTDYxLjg3NSAxOTIuOTM3NSBMNjEuODc1IDE3NS45MjE5IEwxMTcgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjNVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjcuNSAxMDEuNjcxOSBMMTM5LjIxODggMTAxLjY3MTkgTDEzOS4yMTg4IDExNS4wMzEyIEw4NC4yMzQ0IDExNS4wMzEyIEw4NC4yMzQ0IDE0My43MTg4IFE4OC4xNzE5IDE0Mi40NTMxIDkyLjI1IDE0MS44OTA2IFE5Ni4xODc1IDE0MS4zMjgxIDEwMC4xMjUgMTQxLjMyODEgUTEyMi43NjU2IDE0MS4zMjgxIDEzNS45ODQ0IDE1Mi4xNTYyIFExNDkuMjAzMSAxNjIuODQzOCAxNDkuMjAzMSAxODEuMjY1NiBRMTQ5LjIwMzEgMjAwLjI1IDEzNS41NjI1IDIxMC43OTY5IFExMjIuMDYyNSAyMjEuMjAzMSA5Ny4zMTI1IDIyMS4yMDMxIFE4OC44NzUgMjIxLjIwMzEgODAuMDE1NiAyMTkuOTM3NSBRNzEuMTU2MiAyMTguNjcxOSA2MS44NzUgMjE2LjE0MDYgTDYxLjg3NSAyMDAuMjUgUTY5Ljg5MDYgMjA0LjA0NjkgNzguNjA5NCAyMDYuMDE1NiBRODcuMzI4MSAyMDcuODQzOCA5Ny4wMzEyIDIwNy44NDM4IFExMTIuNjQwNiAyMDcuODQzOCAxMjEuNzgxMiAyMDAuNjcxOSBRMTMwLjkyMTkgMTkzLjUgMTMwLjkyMTkgMTgxLjI2NTYgUTEzMC45MjE5IDE2OS4wMzEyIDEyMS43ODEyIDE2MS44NTk0IFExMTIuNjQwNiAxNTQuNjg3NSA5Ny4wMzEyIDE1NC42ODc1IFE4OS43MTg4IDE1NC42ODc1IDgyLjQwNjIgMTU2LjA5MzggUTc1LjA5MzggMTU3LjUgNjcuNSAxNjAuNDUzMSBMNjcuNSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaM2XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuMTA5NCAxNTMuNzAzMSBROTcuNzM0NCAxNTMuNzAzMSA5MC41NjI1IDE2MS4wMTU2IFE4My4zOTA2IDE2OC40Njg4IDgzLjM5MDYgMTgxLjI2NTYgUTgzLjM5MDYgMTkzLjkyMTkgOTAuNTYyNSAyMDEuMjM0NCBROTcuNzM0NCAyMDguNjg3NSAxMTAuMTA5NCAyMDguNjg3NSBRMTIyLjM0MzggMjA4LjY4NzUgMTI5LjUxNTYgMjAxLjIzNDQgUTEzNi42ODc1IDE5My45MjE5IDEzNi42ODc1IDE4MS4yNjU2IFExMzYuNjg3NSAxNjguNDY4OCAxMjkuNTE1NiAxNjEuMDE1NiBRMTIyLjM0MzggMTUzLjcwMzEgMTEwLjEwOTQgMTUzLjcwMzEgWk0xNDYuMzkwNiAxMDMuOTIxOSBMMTQ2LjM5MDYgMTE4LjQwNjIgUTEzOS41IDExNS41OTM4IDEzMi40Njg4IDExNC4xODc1IFExMjUuNDM3NSAxMTIuNjQwNiAxMTguNTQ2OSAxMTIuNjQwNiBRMTAwLjU0NjkgMTEyLjY0MDYgOTAuOTg0NCAxMjMuMTg3NSBRODEuNDIxOSAxMzMuODc1IDgwLjAxNTYgMTU1LjM5MDYgUTg1LjM1OTQgMTQ4LjUgOTMuMzc1IDE0NC44NDM4IFExMDEuNTMxMiAxNDEuMTg3NSAxMTEuMDkzOCAxNDEuMTg3NSBRMTMxLjQ4NDQgMTQxLjE4NzUgMTQzLjI5NjkgMTUxLjg3NSBRMTU1LjEwOTQgMTYyLjcwMzEgMTU1LjEwOTQgMTgxLjI2NTYgUTE1NS4xMDk0IDE5OS4xMjUgMTQyLjczNDQgMjEwLjIzNDQgUTEzMC41IDIyMS4yMDMxIDExMC4xMDk0IDIyMS4yMDMxIFE4Ni42MjUgMjIxLjIwMzEgNzQuMjUgMjA1LjU5MzggUTYxLjg3NSAxODkuOTg0NCA2MS44NzUgMTYwLjE3MTkgUTYxLjg3NSAxMzIuMzI4MSA3Ny4wNjI1IDExNS44NzUgUTkyLjI1IDk5LjI4MTIgMTE3Ljg0MzggOTkuMjgxMiBRMTI0LjczNDQgOTkuMjgxMiAxMzEuNzY1NiAxMDAuNDA2MiBRMTM4Ljc5NjkgMTAxLjY3MTkgMTQ2LjM5MDYgMTAzLjkyMTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjN1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjEuODc1IDEwMS42NzE5IEwxNDguNjQwNiAxMDEuNjcxOSBMMTQ4LjY0MDYgMTA4LjQyMTkgTDk5LjcwMzEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggTDEyNi43MDMxIDExNS4wMzEyIEw2MS44NzUgMTE1LjAzMTIgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaM4XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMDguMjgxMiAxNjMuMTI1IFE5NS4yMDMxIDE2My4xMjUgODcuNzUgMTY5LjMxMjUgUTgwLjI5NjkgMTc1LjM1OTQgODAuMjk2OSAxODUuOTA2MiBRODAuMjk2OSAxOTYuNTkzOCA4Ny43NSAyMDIuNjQwNiBROTUuMjAzMSAyMDguNjg3NSAxMDguMjgxMiAyMDguNjg3NSBRMTIxLjIxODggMjA4LjY4NzUgMTI4LjgxMjUgMjAyLjUgUTEzNi4yNjU2IDE5Ni40NTMxIDEzNi4yNjU2IDE4NS45MDYyIFExMzYuMjY1NiAxNzUuMzU5NCAxMjguODEyNSAxNjkuMzEyNSBRMTIxLjM1OTQgMTYzLjEyNSAxMDguMjgxMiAxNjMuMTI1IFpNOTAgMTU2LjIzNDQgUTc4LjE4NzUgMTUzLjcwMzEgNzEuNzE4OCAxNDYuODEyNSBRNjUuMTA5NCAxMzkuNzgxMiA2NS4xMDk0IDEyOS42NTYyIFE2NS4xMDk0IDExNS41OTM4IDc2LjY0MDYgMTA3LjQzNzUgUTg4LjE3MTkgOTkuMjgxMiAxMDguMjgxMiA5OS4yODEyIFExMjguMzkwNiA5OS4yODEyIDEzOS45MjE5IDEwNy40Mzc1IFExNTEuMzEyNSAxMTUuNTkzOCAxNTEuMzEyNSAxMjkuNjU2MiBRMTUxLjMxMjUgMTQwLjA2MjUgMTQ0Ljg0MzggMTQ2LjgxMjUgUTEzOC4yMzQ0IDE1My43MDMxIDEyNi41NjI1IDE1Ni4yMzQ0IFExMzkuMjE4OCAxNTguNzY1NiAxNDcuMDkzOCAxNjYuOTIxOSBRMTU0LjU0NjkgMTc0LjY1NjIgMTU0LjU0NjkgMTg1LjkwNjIgUTE1NC41NDY5IDIwMi45MjE5IDE0Mi41OTM4IDIxMi4wNjI1IFExMzAuNSAyMjEuMjAzMSAxMDguMjgxMiAyMjEuMjAzMSBRODUuOTIxOSAyMjEuMjAzMSA3My45Njg4IDIxMi4wNjI1IFE2MS44NzUgMjAyLjkyMTkgNjEuODc1IDE4NS45MDYyIFE2MS44NzUgMTc0LjkzNzUgNjkuMzI4MSAxNjYuOTIxOSBRNzYuOTIxOSAxNTkuMDQ2OSA5MCAxNTYuMjM0NCBaTTgzLjI1IDEzMS4yMDMxIFE4My4yNSAxNDAuMDYyNSA4OS44NTk0IDE0NS40MDYyIFE5Ni4zMjgxIDE1MC42MDk0IDEwOC4yODEyIDE1MC42MDk0IFExMTkuNjcxOSAxNTAuNjA5NCAxMjYuNTYyNSAxNDUuNDA2MiBRMTMzLjMxMjUgMTQwLjM0MzggMTMzLjMxMjUgMTMxLjIwMzEgUTEzMy4zMTI1IDEyMi4zNDM4IDEyNi41NjI1IDExNyBRMTE5Ljk1MzEgMTExLjc5NjkgMTA4LjI4MTIgMTExLjc5NjkgUTk2LjYwOTQgMTExLjc5NjkgODkuODU5NCAxMTcgUTgzLjI1IDEyMi4wNjI1IDgzLjI1IDEzMS4yMDMxIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZozlcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTcwLjU5MzggMjE2LjU2MjUgTDcwLjU5MzggMjAyLjA3ODEgUTc3LjQ4NDQgMjA0Ljg5MDYgODQuNTE1NiAyMDYuNDM3NSBROTEuNTQ2OSAyMDcuODQzOCA5OC4yOTY5IDIwNy44NDM4IFExMTYuNDM3NSAyMDcuODQzOCAxMjYgMTk3LjI5NjkgUTEzNS40MjE5IDE4Ni43NSAxMzYuODI4MSAxNjUuMDkzOCBRMTMxLjkwNjIgMTcxLjcwMzEgMTIzLjQ2ODggMTc1LjUgUTExNS40NTMxIDE3OS4xNTYyIDEwNS43NSAxNzkuMTU2MiBRODUuNSAxNzkuMTU2MiA3My42ODc1IDE2OC40Njg4IFE2MS44NzUgMTU3Ljc4MTIgNjEuODc1IDEzOS4yMTg4IFE2MS44NzUgMTIxLjA3ODEgNzQuMTA5NCAxMTAuMjUgUTg2LjQ4NDQgOTkuMjgxMiAxMDYuODc1IDk5LjI4MTIgUTEzMC4zNTk0IDk5LjI4MTIgMTQyLjU5MzggMTE0Ljg5MDYgUTE1NC45Njg4IDEzMC41IDE1NC45Njg4IDE2MC4zMTI1IFExNTQuOTY4OCAxODguMTU2MiAxMzkuOTIxOSAyMDQuNjA5NCBRMTI0LjczNDQgMjIxLjIwMzEgOTkuMTQwNiAyMjEuMjAzMSBROTIuMjUgMjIxLjIwMzEgODUuMjE4OCAyMjAuMDc4MSBRNzguMTg3NSAyMTguODEyNSA3MC41OTM4IDIxNi41NjI1IFpNMTA2Ljg3NSAxNjYuNzgxMiBRMTE5LjI1IDE2Ni43ODEyIDEyNi40MjE5IDE1OS40Njg4IFExMzMuNTkzOCAxNTIuMTU2MiAxMzMuNTkzOCAxMzkuMjE4OCBRMTMzLjU5MzggMTI2LjU2MjUgMTI2LjQyMTkgMTE5LjI1IFExMTkuMjUgMTExLjc5NjkgMTA2Ljg3NSAxMTEuNzk2OSBROTQuOTIxOSAxMTEuNzk2OSA4Ny40Njg4IDExOS4yNSBRODAuMTU2MiAxMjYuNTYyNSA4MC4xNTYyIDEzOS4yMTg4IFE4MC4xNTYyIDE1Mi4xNTYyIDg3LjQ2ODggMTU5LjQ2ODggUTk0LjY0MDYgMTY2Ljc4MTIgMTA2Ljg3NSAxNjYuNzgxMiBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaMxMFxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTU5LjA0NjkgMTExLjc5NjkgUTE0OS4wNjI1IDExMS43OTY5IDE0Mi4wMzEyIDEyMy44OTA2IFExMzQuODU5NCAxMzUuOTg0NCAxMzQuODU5NCAxNjAuMTcxOSBRMTM0Ljg1OTQgMTg0LjUgMTQyLjAzMTIgMTk2LjU5MzggUTE0OS4wNjI1IDIwOC42ODc1IDE1OS4wNDY5IDIwOC42ODc1IFExNjkuMDMxMiAyMDguNjg3NSAxNzYuMDYyNSAxOTYuNTkzOCBRMTgzLjIzNDQgMTg0LjUgMTgzLjIzNDQgMTYwLjE3MTkgUTE4My4yMzQ0IDEzNS45ODQ0IDE3Ni4wNjI1IDEyMy44OTA2IFExNjkuMDMxMiAxMTEuNzk2OSAxNTkuMDQ2OSAxMTEuNzk2OSBaTTE1OS4wNDY5IDk5LjI4MTIgUTE3Ny40Njg4IDk5LjI4MTIgMTg5LjQyMTkgMTE0Ljg5MDYgUTIwMS4zNzUgMTMwLjUgMjAxLjM3NSAxNjAuMTcxOSBRMjAxLjM3NSAxODkuOTg0NCAxODkuNDIxOSAyMDUuNTkzOCBRMTc3LjQ2ODggMjIxLjIwMzEgMTU5LjA0NjkgMjIxLjIwMzEgUTEzNi4yNjU2IDIyMS4yMDMxIDEyNi40MjE5IDIwNS41OTM4IFExMTYuNTc4MSAxODkuOTg0NCAxMTYuNTc4MSAxNjAuMTcxOSBRMTE2LjU3ODEgMTMwLjUgMTI2LjQyMTkgMTE0Ljg5MDYgUTEzNi4yNjU2IDk5LjI4MTIgMTU5LjA0NjkgOTkuMjgxMiBaTTgwLjU3ODEgMjE5LjA5MzggTDgwLjU3ODEgMTE3LjcwMzEgTDYxLjg3NSAxMjMuNDY4OCBMNjEuODc1IDEwNy4xNTYyIEw4MS41NjI1IDEwMS42NzE5IEwxMDAuODI4MSAxMDEuNjcxOSBMMTAwLjgyODEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjSlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODkuMTU2MiAxMDEuNjcxOSBMMTA3LjAxNTYgMTAxLjY3MTkgTDEwNy4wMTU2IDE3OC43MzQ0IFExMDcuMDE1NiAxOTkuNjg3NSA5Ny44NzUgMjA5LjUzMTIgUTg4Ljg3NSAyMTkuMjM0NCA2OC43NjU2IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAyMDUuNzM0NCBMNjcuNSAyMDUuNzM0NCBRNzkuMzEyNSAyMDUuNzM0NCA4NC4yMzQ0IDE5OS44MjgxIFE4OS4xNTYyIDE5My45MjE5IDg5LjE1NjIgMTc4LjczNDQgTDg5LjE1NjIgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjUVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTA3LjI5NjkgMjIxLjA2MjUgUTEwNi43MzQ0IDIyMS4wNjI1IDEwNS41MzkxIDIyMS4xMzI4IFExMDQuMzQzOCAyMjEuMjAzMSAxMDMuNjQwNiAyMjEuMjAzMSBRODEuNDIxOSAyMjEuMjAzMSA3MC41MjM0IDIwNi4wODU5IFE1OS42MjUgMTkwLjk2ODggNTkuNjI1IDE2MC4zMTI1IFE1OS42MjUgMTI5LjUxNTYgNzAuNTkzOCAxMTQuMzk4NCBRODEuNTYyNSA5OS4yODEyIDEwMy43ODEyIDk5LjI4MTIgUTEyNi4xNDA2IDk5LjI4MTIgMTM3LjEwOTQgMTE0LjM5ODQgUTE0OC4wNzgxIDEyOS41MTU2IDE0OC4wNzgxIDE2MC4zMTI1IFExNDguMDc4MSAxODMuNTE1NiAxNDIuMDMxMiAxOTcuNjQ4NCBRMTM1Ljk4NDQgMjExLjc4MTIgMTIzLjYwOTQgMjE3LjQwNjIgTDE0MS4zMjgxIDIzMi4zMTI1IEwxMjcuOTY4OCAyNDAuMTg3NSBMMTA3LjI5NjkgMjIxLjA2MjUgWk0xMjkuMzc1IDE2MC4zMTI1IFExMjkuMzc1IDEzNC40Mzc1IDEyMy4zOTg0IDEyMy4zMjgxIFExMTcuNDIxOSAxMTIuMjE4OCAxMDMuNzgxMiAxMTIuMjE4OCBROTAuMjgxMiAxMTIuMjE4OCA4NC4zMDQ3IDEyMy4zMjgxIFE3OC4zMjgxIDEzNC40Mzc1IDc4LjMyODEgMTYwLjMxMjUgUTc4LjMyODEgMTg2LjE4NzUgODQuMzA0NyAxOTcuMjk2OSBROTAuMjgxMiAyMDguNDA2MiAxMDMuNzgxMiAyMDguNDA2MiBRMTE3LjQyMTkgMjA4LjQwNjIgMTIzLjM5ODQgMTk3LjI5NjkgUTEyOS4zNzUgMTg2LjE4NzUgMTI5LjM3NSAxNjAuMzEyNSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaNLXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02MS44NzUgMTAxLjY3MTkgTDc5LjczNDQgMTAxLjY3MTkgTDc5LjczNDQgMTUxLjMxMjUgTDEzMC42NDA2IDEwMS42NzE5IEwxNTMuNzAzMSAxMDEuNjcxOSBMOTYuNDY4OCAxNTYuNTE1NiBMMTU4LjM0MzggMjE5LjIzNDQgTDEzNC44NTk0IDIxOS4yMzQ0IEw3OS43MzQ0IDE2Mi41NjI1IEw3OS43MzQ0IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG5cXG4gICAgPHRhYmxlIHN0eWxlPVxcXCJib3JkZXItd2lkdGg6MXB4XFxcIj5cXG4gICAgICAgIDx0ciB3aWR0aD1cXFwiMTAwJVxcXCIgaGVpZ2h0PVxcXCIxMHB4XFxcIiBzdHlsZT1cXFwidmlzaWJpbGl0eTp2aXNpYmxlXFxcIn0+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibHVlXFxcIj4mYmxvY2s7PC9zcGFuPjwvcGxheWluZy1jYXJkPC90ZD5cXG4gICAgICAgIDwvdHI+XFxuICAgICAgICA8dHIgd2lkdGg9XFxcIjEwMCVcXFwiPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7QTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7Mjwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7Mzwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7NDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7NTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7Njwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7Nzwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7ODwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7OTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7MTA8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQgd2lkdGg9XFxcIjUwcHhcXFwiPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzO0o8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQgd2lkdGg9XFxcIjUwcHhcXFwiPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzO1E8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQgd2lkdGg9XFxcIjUwcHhcXFwiPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzO0s8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgIDwvdHI+XFxuICAgICAgICA8dHI+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0cztBPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czsyPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czszPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs0PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs1PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs2PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs3PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs4PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs5PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czsxMDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZoZWFydHM7Sjwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZoZWFydHM7UTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZoZWFydHM7Szwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgPC90cj5cXG4gICAgICAgIDx0cj5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7QTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczsyPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zOzM8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7NDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczs1PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zOzY8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7Nzwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczs4PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zOzk8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7MTA8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7Sjwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtcztRPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zO0s8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgIDwvdHI+XFxuICAgICAgICA8dHI+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7QTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzI8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczszPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7NDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzU8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczs2PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7Nzwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzg8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczs5PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7MTA8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHVicztKPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7UTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzO0s8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgIDwvdHI+XFxuICAgIDwvdGFibGU+XFxuPC9kaXY+XFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmF3LWxvYWRlciEuL3ZpZXdzL3BhcnRpYWxzL2ZyZXNoZGVjay5odG1sXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJsZXQgY29ubmVjdFBhcnRpYWwgPSByZXF1aXJlKFwicmF3LWxvYWRlciEuLi8uLi92aWV3cy9wYXJ0aWFscy9jb25uZWN0Lmh0bWxcIik7XG5leHBvcnQgY2xhc3MgQ29ubmVjdFBhZ2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSAnPHA+JyArIGNvbm5lY3RQYXJ0aWFsICsgJzwvcD4nO1xuICAgIH1cbn1cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcImNvbm5lY3QtcGFnZVwiLCBDb25uZWN0UGFnZSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFnZXMvY29ubmVjdC5qcyIsIm1vZHVsZS5leHBvcnRzID0gXCI8c3BhbiBjbGFzcz1cXFwiY29ubmVjdFxcXCI+XFxuPHA+VGhpcyBpcyB0aGUgY29ubmVjdCBwYWdlLjwvcD5cXG48dWw+XFxuPGxpPnBlbmRpbmcgaW52aXRhdGlvbnM8Lz5cXG48bGk+bGlzdCBvZiBwbGF5ZXJzPC9saT5cXG48bGk+Y29ubmVjdGVkIHBsYXllcnM8L2xpPlxcblxcbjxoMT5IZWxsbyB3b3JsZCBndW4gYXBwPC9oMT5cXG48cD5PcGVuIHlvdXIgd2ViIGNvbnNvbGU8L3A+XFxuPC9zcGFuPlxcblwiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3Jhdy1sb2FkZXIhLi92aWV3cy9wYXJ0aWFscy9jb25uZWN0Lmh0bWxcbi8vIG1vZHVsZSBpZCA9IDE3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=