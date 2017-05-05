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
	exports.classifyContent = classifyContent;
	exports.encryptClearText = encryptClearText;
	exports.decryptPGPMessageWithKey = decryptPGPMessageWithKey;
	exports.decryptPGPMessage = decryptPGPMessage;
	exports.handlePost = handlePost;
	var classifyKeyType = function classifyKeyType(content) {
	    return !content ? Promise.reject('Error: mising pgpKey') : function (openpgp) {
	        return !openpgp ? Promise.reject('Error: missing openpgp') : new Promise(function (resolve, reject) {
	            try {
	                var privateKeys = openpgp.key.readArmored(content);
	                var privateKey = privateKeys.keys[0];
	                if (privateKey.toPublic().armor() !== privateKey.armor()) {
	                    resolve('PGPPrivkey');
	                } else {
	                    resolve('PGPPubkey');
	                }
	            } catch (error) {
	                reject(error);
	            }
	        });
	    };
	};
	// export function processCleartext(content) {
	//     // usage: classifyContent(content)(openpgp).then(result => result)
	//     return (!content) ?
	//     Promise.resolve(''):
	//     (openpgp) => {
	//         return (!openpgp) ?
	//         Promise.reject('Error: missing openpgp'):
	//         new Promise((resolve, reject) => {
	//             let possiblepgpkey = openpgp.key.readArmored(content);
	//             if (possiblepgpkey.keys[0]) {
	//                 return classifyKeyType(possiblepgpkey)(openpgp)();
	//             } else {
	//                 try {
	//                     openpgp.message.readArmored(content);
	//                     resolve('PGPMessage');
	//                 } catch (err) {
	//                     resolve('cleartext');
	//                 }
	//             }
	//         })
	//     }
	// }
	
	function classifyContent(content) {
	    // usage: classifyContent(content)(openpgp).then(result => result)
	    return !content ? Promise.resolve('') : function (openpgp) {
	        return !openpgp ? Promise.reject('Error: missing openpgp') : new Promise(function (resolve, reject) {
	            var possiblepgpkey = openpgp.key.readArmored(content);
	            if (possiblepgpkey.keys[0]) {
	                classifyKeyType(content)(openpgp).then(function (keyType) {
	                    resolve(keyType);
	                });
	            } else {
	                try {
	                    openpgp.message.readArmored(content);
	                    resolve('PGPMessage');
	                } catch (err) {
	                    resolve('cleartext');
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
	                    return !existingKey ? Promise.resolve('none') : classifyContent(existingKey)(openpgp);
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
	                openpgp.encryptMessage(PGPPubkey.keys[0], cleartext).then(function (encryptedtxt) {
	                    resolve(encryptedtxt);
	                }).catch(function (err) {
	                    return reject(err);
	                });
	            });
	        };
	    };
	}
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
	                            return storeArr.filter(function (storeItem) {
	                                return !storeItem ? false : true;
	                            }).map(function (storeItem) {
	                                return classifyContent(storeItem)(openpgp).then(function (contentType) {
	                                    if (contentType === 'PGPPrivkey') {
	                                        decryptPGPMessageWithKey(PGPMessageArmor)(openpgp)(storeItem)('hotlips').then(function (decrypted) {
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
	function handlePost(content) {
	    //console.log(`handlePost <- ${content}`);
	    return !content ? Promise.resolve('') : function (openpgp) {
	        return !openpgp ? Promise.reject('Error: missing openpgp') : function (localStorage) {
	            return function (password) {
	                return new Promise(function (resolve, reject) {
	                    classifyContent(content)(openpgp).then(function (contentType) {
	                        if (contentType === 'cleartext') {
	                            // encrypt and broadcast
	                            return content;
	                        }
	                        if (contentType === 'PGPPrivkey') {
	                            // save and broadcast converted public key
	                            return savePGPPrivkey(content)(openpgp)(localStorage)
	                            //return broadcastMessage(content)(openpgp)(localStorage)
	                            .then(function (result) {
	                                return result;
	                            });
	                        }
	                        if (contentType === 'PGPPubkey') {
	                            // save to localStorage
	                            return savePGPPubkey(content)(openpgp)(localStorage).then(function (result) {
	                                return result;
	                            });
	                        }
	                        if (contentType === 'PGPMessage') {
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
	//     var gunaddress = '{{ip_local}}:{{port}}'
	//     var gun = Gun(`http://${gunaddress}/gun`);
	//     var gundata = gun.get('data');
	//     gundata.put({ message:`client listening to http://${gunaddress}/gun` });
	//     gundata.path('message').on(function (message) {
	//         handleIncomingMessage(message)
	//     });
	// </script>
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

	module.exports = "<span class=\"connect\">\n<p>This is the connect page.</p>\n<ul>\n<li>pending invitations</>\n<li>list of players</li>\n<li>connected players</li>\n\n<h1>Hello world gun app</h1>\n<p>Open your web console</p>\n\n<!-- Loads gun -->\n<script src='http://localhost:8080/gun.js'></script>\n\n<!-- pull gun address from\n<script src='http://localhost:8080/gun.js'></script>\n\n<script>\n(function () {\n\n    // Sync this gun instance with the server.\n    var gun = Gun([\n        'http://localhost:8080/gun',\n    ]);\n\n    // Reads key 'data'.\n    var data = gun.get('data');\n\n    // Exposed so the JS console can see it.\n    window.data = data;\n\n    console.log('Gun reference exposed as %cwindow.data', 'color: red');\n\n    // Writes a value to the key 'data'.\n    data.put({ message: 'Hello world!' });\n\n    // Listen for real-time change events.\n    data.path('message').on(function (message) {\n        console.log('Message:', message);\n    });\n\n}())\n</script>\n</span>\n"

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODc1MDI5ZWFkNjllOTc1OTkyMGEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvdXRpbC5qcyIsIndlYnBhY2s6Ly8vLi9+L3Byb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlYmVsLXJvdXRlci9zcmMvcmViZWwtcm91dGVyLmpzIiwid2VicGFjazovLy8uL34vZ3VuL2d1bi5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vbW9kdWxlLmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi92aWV3cy9wYXJ0aWFscy9pbmRleC5odG1sIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9yb2FkbWFwLmpzIiwid2VicGFjazovLy8uL3ZpZXdzL3BhcnRpYWxzL3JvYWRtYXAuaHRtbCIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvY29udGFjdC5qcyIsIndlYnBhY2s6Ly8vLi92aWV3cy9wYXJ0aWFscy9jb250YWN0Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL21lc3NhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vdmlld3MvcGFydGlhbHMvbWVzc2FnZV9mb3JtLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2RlY2suanMiLCJ3ZWJwYWNrOi8vLy4vdmlld3MvcGFydGlhbHMvZnJlc2hkZWNrLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2Nvbm5lY3QuanMiLCJ3ZWJwYWNrOi8vLy4vdmlld3MvcGFydGlhbHMvY29ubmVjdC5odG1sIl0sIm5hbWVzIjpbInV0aWwiLCJ3aW5kb3ciLCJoYW5kbGVQb3N0IiwiY2xhc3NpZnlDb250ZW50IiwiZW5jcnlwdENsZWFyVGV4dCIsImRlY3J5cHRQR1BNZXNzYWdlV2l0aEtleSIsImRlY3J5cHRQR1BNZXNzYWdlIiwiY2xhc3NpZnlLZXlUeXBlIiwiY29udGVudCIsIlByb21pc2UiLCJyZWplY3QiLCJvcGVucGdwIiwicmVzb2x2ZSIsInByaXZhdGVLZXlzIiwia2V5IiwicmVhZEFybW9yZWQiLCJwcml2YXRlS2V5Iiwia2V5cyIsInRvUHVibGljIiwiYXJtb3IiLCJlcnJvciIsInBvc3NpYmxlcGdwa2V5IiwidGhlbiIsImtleVR5cGUiLCJtZXNzYWdlIiwiZXJyIiwiZ2V0RnJvbVN0b3JhZ2UiLCJsb2NhbFN0b3JhZ2UiLCJpbmRleEtleSIsImkiLCJsZW5ndGgiLCJrZXlBcnIiLCJwdXNoIiwiZ2V0SXRlbSIsInNhdmVQR1BQdWJrZXkiLCJQR1BrZXlBcm1vciIsIlBHUGtleSIsInVzZXJzIiwidXNlcklkIiwidXNlcmlkIiwiZXhpc3RpbmdLZXkiLCJleGlzdGluZ0tleVR5cGUiLCJzZXRJdGVtIiwiY2F0Y2giLCJzYXZlUEdQUHJpdmtleSIsInByb2Nlc3MiLCJzZXRJbW1lZGlhdGUiLCJwdWJsaWNLZXlBcm1vciIsImNsZWFydGV4dCIsIlBHUFB1YmtleSIsImVuY3J5cHRNZXNzYWdlIiwiZW5jcnlwdGVkdHh0IiwiUEdQTWVzc2FnZUFybW9yIiwicHJpdmF0ZUtleUFybW9yIiwicGFzc3dvcmQiLCJkZWNyeXB0IiwiZGVjcnlwdE1lc3NhZ2UiLCJyZXN1bHQiLCJkYXRhIiwic3RvcmVBcnIiLCJmaWx0ZXIiLCJzdG9yZUl0ZW0iLCJtYXAiLCJjb250ZW50VHlwZSIsImRlY3J5cHRlZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJjYWNoZWRTZXRUaW1lb3V0IiwiY2FjaGVkQ2xlYXJUaW1lb3V0IiwiZGVmYXVsdFNldFRpbW91dCIsIkVycm9yIiwiZGVmYXVsdENsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJlIiwiY2xlYXJUaW1lb3V0IiwicnVuVGltZW91dCIsImZ1biIsImNhbGwiLCJydW5DbGVhclRpbWVvdXQiLCJtYXJrZXIiLCJxdWV1ZSIsImRyYWluaW5nIiwiY3VycmVudFF1ZXVlIiwicXVldWVJbmRleCIsImNsZWFuVXBOZXh0VGljayIsImNvbmNhdCIsImRyYWluUXVldWUiLCJ0aW1lb3V0IiwibGVuIiwicnVuIiwibmV4dFRpY2siLCJhcmdzIiwiQXJyYXkiLCJhcmd1bWVudHMiLCJJdGVtIiwiYXJyYXkiLCJwcm90b3R5cGUiLCJhcHBseSIsInRpdGxlIiwiYnJvd3NlciIsImVudiIsImFyZ3YiLCJ2ZXJzaW9uIiwidmVyc2lvbnMiLCJub29wIiwib24iLCJhZGRMaXN0ZW5lciIsIm9uY2UiLCJvZmYiLCJyZW1vdmVMaXN0ZW5lciIsInJlbW92ZUFsbExpc3RlbmVycyIsImVtaXQiLCJwcmVwZW5kTGlzdGVuZXIiLCJwcmVwZW5kT25jZUxpc3RlbmVyIiwibGlzdGVuZXJzIiwibmFtZSIsImJpbmRpbmciLCJjd2QiLCJjaGRpciIsImRpciIsInVtYXNrIiwiUmViZWxSb3V0ZXIiLCJwcmVmaXgiLCJfcHJlZml4IiwicHJldmlvdXNQYXRoIiwiYmFzZVBhdGgiLCJvcHRpb25zIiwiZ2V0QXR0cmlidXRlIiwiaW5oZXJpdCIsIiRlbGVtZW50IiwicGFyZW50Tm9kZSIsIm5vZGVOYW1lIiwidG9Mb3dlckNhc2UiLCJjdXJyZW50Iiwicm91dGUiLCJyb3V0ZXMiLCIkY2hpbGRyZW4iLCJjaGlsZHJlbiIsIiRjaGlsZCIsInBhdGgiLCIkdGVtcGxhdGUiLCJpbm5lckhUTUwiLCJzaGFkb3dSb290IiwiY3JlYXRlU2hhZG93Um9vdCIsInJvb3QiLCJhbmltYXRpb24iLCJpbml0QW5pbWF0aW9uIiwicmVuZGVyIiwicGF0aENoYW5nZSIsImlzQmFjayIsImNsYXNzTGlzdCIsImFkZCIsInJlbW92ZSIsIm9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsIm5vZGUiLCJhZGRlZE5vZGVzIiwidW5kZWZpbmVkIiwib3RoZXJDaGlsZHJlbiIsImdldE90aGVyQ2hpbGRyZW4iLCJmb3JFYWNoIiwiY2hpbGQiLCJhbmltYXRpb25FbmQiLCJldmVudCIsInRhcmdldCIsImNsYXNzTmFtZSIsImluZGV4T2YiLCJyZW1vdmVDaGlsZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJvYnNlcnZlIiwiY2hpbGRMaXN0IiwiZ2V0UGF0aEZyb21VcmwiLCJyZWdleFN0cmluZyIsInJlcGxhY2UiLCJyZWdleCIsIlJlZ0V4cCIsInRlc3QiLCJfcm91dGVSZXN1bHQiLCJjb21wb25lbnQiLCIkY29tcG9uZW50IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwicGFyYW1zIiwidmFsdWUiLCJKU09OIiwicGFyc2UiLCJjb25zb2xlIiwic2V0QXR0cmlidXRlIiwiYXBwZW5kQ2hpbGQiLCJ0ZW1wbGF0ZSIsImEiLCJiIiwiciIsInJlc3VsdHMiLCJ1cmwiLCJxdWVyeVN0cmluZyIsInN1YnN0ciIsInNwbGl0IiwicGFydCIsImVxIiwidmFsIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwiZnJvbSIsInRvIiwiaW5kZXgiLCJzdWJzdHJpbmciLCJDbGFzcyIsInRvU3RyaW5nIiwibWF0Y2giLCJ2YWxpZEVsZW1lbnRUYWciLCJjb25zdHJ1Y3RvciIsIkhUTUxFbGVtZW50IiwiY2xhc3NUb1RhZyIsImlzUmVnaXN0ZXJlZEVsZW1lbnQiLCJyZWdpc3RlckVsZW1lbnQiLCJ0YWciLCJjYWxsYmFjayIsImNoYW5nZUNhbGxiYWNrcyIsImNoYW5nZUhhbmRsZXIiLCJsb2NhdGlvbiIsImhyZWYiLCJvbGRVUkwiLCJvbmhhc2hjaGFuZ2UiLCJwYXJzZVF1ZXJ5U3RyaW5nIiwicmUiLCJleGVjIiwicmVzdWx0czIiLCJpdGVtIiwiaWR4IiwiUmViZWxSb3V0ZSIsIlJlYmVsRGVmYXVsdCIsIlJlYmVsQmFja0EiLCJwcmV2ZW50RGVmYXVsdCIsImRpc3BhdGNoRXZlbnQiLCJDdXN0b21FdmVudCIsImhhc2giLCJIVE1MQW5jaG9yRWxlbWVudCIsImV4dGVuZHMiLCJvYmoiLCJoYXNPd25Qcm9wZXJ0eSIsImdldFBhcmFtc0Zyb21VcmwiLCJnbG9iYWwiLCJsb2ciLCJyZXF1aXJlIiwiYXJnIiwic2xpY2UiLCJtb2QiLCJjb21tb24iLCJUeXBlIiwiZm5zIiwiZm4iLCJpcyIsImJpIiwiQm9vbGVhbiIsIm51bSIsIm4iLCJsaXN0X2lzIiwicGFyc2VGbG9hdCIsIkluZmluaXR5IiwidGV4dCIsInQiLCJpZnkiLCJzdHJpbmdpZnkiLCJyYW5kb20iLCJsIiwiYyIsInMiLCJjaGFyQXQiLCJNYXRoIiwiZmxvb3IiLCJvIiwiaGFzIiwibGlzdCIsIm0iLCJmdXp6eSIsImYiLCJzbGl0Iiwic29ydCIsImsiLCJBIiwiQiIsIl8iLCJvYmpfbWFwIiwiT2JqZWN0IiwicHV0IiwidiIsImRlbCIsImFzIiwidSIsIm9ial9pcyIsIm9ial9oYXMiLCJjb3B5IiwiZW1wdHkiLCJ4IiwibGwiLCJsbGUiLCJmbl9pcyIsImlpIiwidGltZSIsIkRhdGUiLCJnZXRUaW1lIiwib250byIsIm5leHQiLCJGdW5jdGlvbiIsImJlIiwidGhlIiwibGFzdCIsImJhY2siLCJPbiIsIkNoYWluIiwiY3JlYXRlIiwib3B0IiwiaWQiLCJyaWQiLCJ1dWlkIiwic3R1biIsImNoYWluIiwiZXYiLCJza2lwIiwiY2IiLCJyZXMiLCJ0bXAiLCJxIiwiYWN0IiwiYXQiLCJjdHgiLCJhc2siLCJzY29wZSIsImFjayIsInJlcGx5Iiwib25zIiwiR3VuIiwiaW5wdXQiLCJndW4iLCJzb3VsIiwic3RhdGUiLCJ3YWl0aW5nIiwid2hlbiIsInNvb25lc3QiLCJzZXQiLCJmdXR1cmUiLCJub3ciLCJjaGVjayIsImVhY2giLCJ3YWl0IiwiSEFNIiwibWFjaGluZVN0YXRlIiwiaW5jb21pbmdTdGF0ZSIsImN1cnJlbnRTdGF0ZSIsImluY29taW5nVmFsdWUiLCJjdXJyZW50VmFsdWUiLCJkZWZlciIsImhpc3RvcmljYWwiLCJjb252ZXJnZSIsImluY29taW5nIiwiTGV4aWNhbCIsIlZhbCIsInRleHRfaXMiLCJiaV9pcyIsIm51bV9pcyIsInJlbCIsInJlbF8iLCJvYmpfcHV0IiwiTm9kZSIsInNvdWxfIiwidGV4dF9yYW5kb20iLCJvYmpfZGVsIiwiU3RhdGUiLCJwZXJmIiwic3RhcnQiLCJOIiwiZHJpZnQiLCJEIiwicGVyZm9ybWFuY2UiLCJ0aW1pbmciLCJuYXZpZ2F0aW9uU3RhcnQiLCJOXyIsIm9ial9hcyIsIkdyYXBoIiwiZyIsIm9ial9lbXB0eSIsIm5mIiwiZ3JhcGgiLCJzZWVuIiwidmFsaWQiLCJvYmpfY29weSIsInByZXYiLCJpbnZhbGlkIiwiam9pbiIsImFyciIsIkR1cCIsImNhY2hlIiwidHJhY2siLCJnYyIsImRlIiwib2xkZXN0IiwibWF4QWdlIiwibWluIiwiZG9uZSIsImVsYXBzZWQiLCJuZXh0R0MiLCJ0b0pTT04iLCJkdXAiLCJmaWVsZCIsImNhdCIsImNvYXQiLCJvYmpfdG8iLCJnZXQiLCJzeW50aCIsIl9zb3VsIiwiX2ZpZWxkIiwiaG93IiwicGVlcnMiLCJ3c2MiLCJwcm90b2NvbHMiLCJkZWJ1ZyIsInciLCIkIiwib3V0cHV0Iiwib3V0IiwiY2FwIiwiYXBwIiwiZm9vIiwiYmFyIiwicmFiIiwiYXNkZiIsImJheiIsImZkc2EiLCJ5ZXMiLCJwcm94eSIsImNoYW5nZSIsImVjaG8iLCJub3QiLCJyZWxhdGUiLCJub2RlXyIsInJldmVyYiIsInZpYSIsInVzZSIsInJlZiIsImFueSIsImJhdGNoIiwibm8iLCJpaWZlIiwibWV0YSIsIl9fIiwidmVydGV4IiwidW5pb24iLCJtYWNoaW5lIiwic3RhdGVfaXMiLCJjcyIsIml2IiwiY3YiLCJ2YWxfaXMiLCJzdGF0ZV9pZnkiLCJkZWx0YSIsImRpZmYiLCJub2RlX3NvdWwiLCJub2RlX2lzIiwibm9kZV9pZnkiLCJyZWxfaXMiLCJrZXllZCIsImlmZmUiLCJwc2V1ZG8iLCJub3JtYWxpemUiLCJzZWFyY2giLCJ0cmllZCIsImxleCIsImNoYW5nZWQiLCJyZXN1bWUiLCJlYXMiLCJzdWJzIiwiYmluZCIsIm9rIiwiYXN5bmMiLCJvdWdodCIsIm5lZWQiLCJpbXBsZW1lbnQiLCJmaWVsZHMiLCJuXyIsInN0b3JlIiwicmVtb3ZlSXRlbSIsImRpcnR5IiwiY291bnQiLCJtYXgiLCJzYXZlIiwiYWxsIiwiV2ViU29ja2V0Iiwid2Via2l0V2ViU29ja2V0IiwibW96V2ViU29ja2V0Iiwid3NwIiwidWRyYWluIiwic2VuZCIsInBlZXIiLCJtc2ciLCJ3aXJlIiwib3BlbiIsInJlYWR5U3RhdGUiLCJPUEVOIiwicmVjZWl2ZSIsImJvZHkiLCJvbmNsb3NlIiwicmVjb25uZWN0Iiwib25lcnJvciIsImNvZGUiLCJvbm9wZW4iLCJvbm1lc3NhZ2UiLCJ3ZWJwYWNrUG9seWZpbGwiLCJkZXByZWNhdGUiLCJwYXRocyIsImluZGV4UGFydGlhbCIsIkluZGV4UGFnZSIsInJvYWRtYXBQYXJ0aWFsIiwiUm9hZG1hcFBhZ2UiLCJjb250YWN0UGFydGlhbCIsIkNvbnRhY3RQYWdlIiwiY2xpZW50UHVia2V5Rm9ybVBhcnRpYWwiLCJNZXNzYWdlUGFnZSIsImZyZXNoRGVja1BhcnRpYWwiLCJEZWNrUGFnZSIsImNyZWF0ZWRDYWxsYmFjayIsInF1ZXJ5U2VsZWN0b3IiLCJ0ZXh0Q29udGVudCIsImNsb25lIiwiaW1wb3J0Tm9kZSIsImNvbG9yT3ZlcnJpZGUiLCJzdHlsZSIsImNvbG9yIiwiZmlsbCIsImNvbm5lY3RQYXJ0aWFsIiwiQ29ubmVjdFBhZ2UiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDdENBO0FBQ0E7QUFDQTs7QUFFQTs7QUFDQTs7S0FBWUEsSTs7QUFRWjs7QUFHQTs7QUFHQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQWxCQUMsUUFBT0MsVUFBUCxHQUFvQkYsS0FBS0UsVUFBekI7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7QUFHQTs7O0FBR0EsMkU7Ozs7OztBQ2xCQTs7Ozs7U0E4Q2dCQyxlLEdBQUFBLGU7U0FxSEFDLGdCLEdB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LDhGQUE4Riw2RkFBNkYsNkZBQTZGLDRIQUE0SCwrRkFBK0YsK0ZBQStGLCtGQUErRiwrRkFBK0YsK0ZBQStGLCtGQUErRiwrRkFBK0YsK0ZBQStGLCtGQUErRixnR0FBZ0csK0ZBQStGLCtGQUErRixvRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBL2lxRixLQUFJTSxpQkFBaUIsbUJBQUE3UixDQUFRLEVBQVIsQ0FBckI7O0tBQ2E4UixXLFdBQUFBLFc7Ozs7Ozs7Ozs7OzRDQUNVO0FBQ2Ysa0JBQUtyWSxTQUFMLEdBQWlCLFFBQVFvWSxjQUFSLEdBQXlCLE1BQTFDO0FBQ0g7Ozs7R0FINEI3VCxXOztBQUtqQy9CLFVBQVNrQyxlQUFULENBQXlCLGNBQXpCLEVBQXlDMlQsV0FBekMsRTs7Ozs7O0FDTkEsK1pBQThaLHNIQUFzSCw2REFBNkQseUVBQXlFLDRFQUE0RSw0REFBNEQsMEJBQTBCLEVBQUUsZ0dBQWdHLDJDQUEyQyxPQUFPLEVBQUUsS0FBSywwQiIsImZpbGUiOiJyb3lhbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA4NzUwMjllYWQ2OWU5NzU5OTIwYSIsIid1c2Ugc3RyaWN0Jztcbi8vaW1wb3J0ICd3ZWJjb21wb25lbnRzLmpzL3dlYmNvbXBvbmVudHMuanMnO1xuLy91bmNvbW1lbnQgbGluZSBhYm92ZSB0byBkb3VibGUgYXBwIHNpemUgYW5kIHN1cHBvcnQgaW9zLlxuXG4vLyBoZWxwZXIgZnVuY3Rpb25zXG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4vbGliL3V0aWwnO1xud2luZG93LmhhbmRsZVBvc3QgPSB1dGlsLmhhbmRsZVBvc3Q7XG5cbi8vIHdpbmRvdy5oYW5kbGVDb250ZW50ID0gdXRpbC5oYW5kbGVDb250ZW50O1xuLy8gd2luZG93LmlzUEdQUHVia2V5ICAgPSB1dGlsLmlzUEdQUHVia2V5O1xuLy8gd2luZG93LmlzUEdQUHJpdmtleSAgPSB1dGlsLmlzUEdQUHJpdmtleTtcblxuLy8gcmViZWwgcm91dGVyXG5pbXBvcnQge1JlYmVsUm91dGVyfSBmcm9tICcuLi9ub2RlX21vZHVsZXMvcmViZWwtcm91dGVyL3NyYy9yZWJlbC1yb3V0ZXIuanMnO1xuXG4vLyBHdW5kYiBwdWJsaWMgZmFjaW5nIERBRyBkYXRhYmFzZSAgKGZvciBtZXNzYWdlcyB0byBhbmQgZnJvbSB0aGUgZW5lbXkpXG5pbXBvcnQge0d1bn0gZnJvbSAnZ3VuL2d1bi5qcyc7XG5cbi8vIHBhZ2VzIChtb3N0IG9mIHRoaXMgc2hvdWxkIGJlIGluIHZpZXdzL3BhcnRpYWxzIHRvIGFmZmVjdCBpc29ybW9ycGhpc20pXG5pbXBvcnQge0luZGV4UGFnZX0gICBmcm9tICcuL3BhZ2VzL2luZGV4LmpzJztcbmltcG9ydCB7Um9hZG1hcFBhZ2V9IGZyb20gJy4vcGFnZXMvcm9hZG1hcC5qcyc7XG5pbXBvcnQge0NvbnRhY3RQYWdlfSBmcm9tICcuL3BhZ2VzL2NvbnRhY3QuanMnO1xuaW1wb3J0IHtNZXNzYWdlUGFnZX0gZnJvbSAnLi9wYWdlcy9tZXNzYWdlLmpzJztcbmltcG9ydCB7RGVja1BhZ2V9ICAgIGZyb20gJy4vcGFnZXMvZGVjay5qcyc7XG5pbXBvcnQge0Nvbm5lY3RQYWdlfSBmcm9tICcuL3BhZ2VzL2Nvbm5lY3QuanMnO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBjbGFzc2lmeUtleVR5cGUgPSAoY29udGVudCkgPT4ge1xuICAgIHJldHVybiAoIWNvbnRlbnQpID9cbiAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc2luZyBwZ3BLZXknKTpcbiAgICAob3BlbnBncCkgPT4ge1xuICAgICAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBvcGVucGdwJyk6XG4gICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbGV0IHByaXZhdGVLZXlzID0gb3BlbnBncC5rZXkucmVhZEFybW9yZWQoY29udGVudClcbiAgICAgICAgICAgICAgICBsZXQgcHJpdmF0ZUtleSA9IHByaXZhdGVLZXlzLmtleXNbMF1cbiAgICAgICAgICAgICAgICBpZiAocHJpdmF0ZUtleS50b1B1YmxpYygpLmFybW9yKCkgIT09IHByaXZhdGVLZXkuYXJtb3IoKSApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgnUEdQUHJpdmtleScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoJ1BHUFB1YmtleScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG59XG4vLyBleHBvcnQgZnVuY3Rpb24gcHJvY2Vzc0NsZWFydGV4dChjb250ZW50KSB7XG4vLyAgICAgLy8gdXNhZ2U6IGNsYXNzaWZ5Q29udGVudChjb250ZW50KShvcGVucGdwKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpXG4vLyAgICAgcmV0dXJuICghY29udGVudCkgP1xuLy8gICAgIFByb21pc2UucmVzb2x2ZSgnJyk6XG4vLyAgICAgKG9wZW5wZ3ApID0+IHtcbi8vICAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuLy8gICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuLy8gICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4vLyAgICAgICAgICAgICBsZXQgcG9zc2libGVwZ3BrZXkgPSBvcGVucGdwLmtleS5yZWFkQXJtb3JlZChjb250ZW50KTtcbi8vICAgICAgICAgICAgIGlmIChwb3NzaWJsZXBncGtleS5rZXlzWzBdKSB7XG4vLyAgICAgICAgICAgICAgICAgcmV0dXJuIGNsYXNzaWZ5S2V5VHlwZShwb3NzaWJsZXBncGtleSkob3BlbnBncCkoKTtcbi8vICAgICAgICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgICAgICAgICAgdHJ5IHtcbi8vICAgICAgICAgICAgICAgICAgICAgb3BlbnBncC5tZXNzYWdlLnJlYWRBcm1vcmVkKGNvbnRlbnQpO1xuLy8gICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCdQR1BNZXNzYWdlJyk7XG4vLyAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoJ2NsZWFydGV4dCcpO1xuLy8gICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgIH1cbi8vICAgICAgICAgfSlcbi8vICAgICB9XG4vLyB9XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGFzc2lmeUNvbnRlbnQoY29udGVudCkge1xuICAgIC8vIHVzYWdlOiBjbGFzc2lmeUNvbnRlbnQoY29udGVudCkob3BlbnBncCkudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgIHJldHVybiAoIWNvbnRlbnQpID9cbiAgICBQcm9taXNlLnJlc29sdmUoJycpOlxuICAgIChvcGVucGdwKSA9PiB7XG4gICAgICAgIHJldHVybiAoIW9wZW5wZ3ApID9cbiAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIG9wZW5wZ3AnKTpcbiAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgbGV0IHBvc3NpYmxlcGdwa2V5ID0gb3BlbnBncC5rZXkucmVhZEFybW9yZWQoY29udGVudCk7XG4gICAgICAgICAgICBpZiAocG9zc2libGVwZ3BrZXkua2V5c1swXSkge1xuICAgICAgICAgICAgICAgIGNsYXNzaWZ5S2V5VHlwZShjb250ZW50KShvcGVucGdwKVxuICAgICAgICAgICAgICAgIC50aGVuKChrZXlUeXBlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoa2V5VHlwZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIG9wZW5wZ3AubWVzc2FnZS5yZWFkQXJtb3JlZChjb250ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgnUEdQTWVzc2FnZScpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCdjbGVhcnRleHQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRGcm9tU3RvcmFnZShsb2NhbFN0b3JhZ2UpIHtcbiAgICAvLyB1c2FnZTogc2F2ZVBHUGtleShjb250ZW50KShvcGVucGdwKShsb2NhbFN0b3JhZ2UpLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbiAgICByZXR1cm4gKCFsb2NhbFN0b3JhZ2UpID9cbiAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgbG9jYWxTdG9yYWdlJyk6XG4gICAgKGluZGV4S2V5KSA9PiB7XG4gICAgICAgIHJldHVybiAoIWluZGV4S2V5KSA/XG4gICAgICAgIC8vIG5vIGluZGV4IC0+IHJldHVybiBldmVyeXRoaW5nXG4gICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbGV0IGkgPSBsb2NhbFN0b3JhZ2UubGVuZ3RoXG4gICAgICAgICAgICAgICAgbGV0IGtleUFyciA9IFtdXG4gICAgICAgICAgICAgICAgd2hpbGUgKGkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICBpID0gaSAtIDFcbiAgICAgICAgICAgICAgICAgICAga2V5QXJyLnB1c2gobG9jYWxTdG9yYWdlLmdldEl0ZW0obG9jYWxTdG9yYWdlLmtleShpKSkpXG4gICAgICAgICAgICAgICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGtleUFycilcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTpcbiAgICAgICAgLy8gaW5kZXggcHJvdmlkZWQgLT4gcmV0dXJuIG9uZVxuICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUobG9jYWxTdG9yYWdlLmdldEl0ZW0oaW5kZXhLZXkpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxufVxuZnVuY3Rpb24gc2F2ZVBHUFB1YmtleShQR1BrZXlBcm1vcikge1xuICAgIC8vIHNhdmUgcHVibGljIGtleSB0byBzdG9yYWdlIG9ubHkgaWYgaXQgZG9lc24ndCBvdmVyd3JpdGUgYSBwcml2YXRlIGtleVxuICAgIC8vIHVzYWdlOiBzYXZlUEdQUHVia2V5KGNvbnRlbnQpKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSkudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgIHJldHVybiAoIVBHUGtleUFybW9yKSA/XG4gICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIFBHUGtleUFybW9yJyk6XG4gICAgKG9wZW5wZ3ApID0+IHtcbiAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgICAgICAobG9jYWxTdG9yYWdlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCFsb2NhbFN0b3JhZ2UpID9cbiAgICAgICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBsb2NhbFN0b3JhZ2UnKTpcbiAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgUEdQa2V5ID0gb3BlbnBncC5rZXkucmVhZEFybW9yZWQoUEdQa2V5QXJtb3IpO1xuICAgICAgICAgICAgICAgIGdldEZyb21TdG9yYWdlKGxvY2FsU3RvcmFnZSkoUEdQa2V5LmtleXNbMF0udXNlcnNbMF0udXNlcklkLnVzZXJpZClcbiAgICAgICAgICAgICAgICAudGhlbihleGlzdGluZ0tleSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoIWV4aXN0aW5nS2V5KSA/XG4gICAgICAgICAgICAgICAgICAgIFByb21pc2UucmVzb2x2ZSgnbm9uZScpIDpcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NpZnlDb250ZW50KGV4aXN0aW5nS2V5KShvcGVucGdwKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKGV4aXN0aW5nS2V5VHlwZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleGlzdGluZ0tleVR5cGUgPT09ICdQR1BQcml2a2V5Jyl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCdwdWJrZXkgaWdub3JlZCBYLSBhdHRlbXB0ZWQgb3ZlcndyaXRlIHByaXZrZXknKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oUEdQa2V5LmtleXNbMF0udXNlcnNbMF0udXNlcklkLnVzZXJpZCwgUEdQa2V5QXJtb3IpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGBwdWJsaWMgcGdwIGtleSBzYXZlZCA8LSAke1BHUGtleS5rZXlzWzBdLnVzZXJzWzBdLnVzZXJJZC51c2VyaWR9YClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlamVjdChlcnIpKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIHNhdmVQR1BQcml2a2V5KFBHUGtleUFybW9yKSB7XG4gICAgLy8gc2F2ZSBwcml2YXRlIGtleSB0byBzdG9yYWdlIG5vIHF1ZXN0aW9ucyBhc2tlZFxuICAgIC8vIHVzYWdlOiBzYXZlUEdQUHJpdmtleShjb250ZW50KShvcGVucGdwKShsb2NhbFN0b3JhZ2UpLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbiAgICByZXR1cm4gKCFQR1BrZXlBcm1vcikgP1xuICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBQR1BrZXlBcm1vcicpOlxuICAgIChvcGVucGdwKSA9PiB7XG4gICAgICAgIHJldHVybiAoIW9wZW5wZ3ApID9cbiAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIG9wZW5wZ3AnKTpcbiAgICAgICAgKGxvY2FsU3RvcmFnZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICghbG9jYWxTdG9yYWdlKSA/XG4gICAgICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgbG9jYWxTdG9yYWdlJyk6XG4gICAgICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IFBHUGtleSA9IG9wZW5wZ3Aua2V5LnJlYWRBcm1vcmVkKFBHUGtleUFybW9yKTtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oUEdQa2V5LmtleXNbMF0udXNlcnNbMF0udXNlcklkLnVzZXJpZCwgUEdQa2V5QXJtb3IpXG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3Muc2V0SW1tZWRpYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShgcHJpdmF0ZSBwZ3Aga2V5IHNhdmVkIDwtICR7UEdQa2V5LmtleXNbMF0udXNlcnNbMF0udXNlcklkLnVzZXJpZH1gKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBlbmNyeXB0Q2xlYXJUZXh0KG9wZW5wZ3ApIHtcbi8vIHVzYWdlOiBlbmNyeXB0Q2xlYXJUZXh0KG9wZW5wZ3ApKHB1YmxpY0tleUFybW9yKShjbGVhcnRleHQpLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbiAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIG9wZW5wZ3AnKTpcbiAgICAocHVibGljS2V5QXJtb3IpID0+IHtcbiAgICAgICAgcmV0dXJuICghcHVibGljS2V5QXJtb3IpID9cbiAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIHB1YmxpYyBrZXknKTpcbiAgICAgICAgKGNsZWFydGV4dCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICghY2xlYXJ0ZXh0KSA/XG4gICAgICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgY2xlYXJ0ZXh0Jyk6XG4gICAgICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IFBHUFB1YmtleSA9IG9wZW5wZ3Aua2V5LnJlYWRBcm1vcmVkKHB1YmxpY0tleUFybW9yKVxuICAgICAgICAgICAgICAgIG9wZW5wZ3AuZW5jcnlwdE1lc3NhZ2UoUEdQUHVia2V5LmtleXNbMF0sIGNsZWFydGV4dClcbiAgICAgICAgICAgICAgICAudGhlbihlbmNyeXB0ZWR0eHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGVuY3J5cHRlZHR4dClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiByZWplY3QoZXJyKSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gZGVjcnlwdFBHUE1lc3NhZ2VXaXRoS2V5KFBHUE1lc3NhZ2VBcm1vcikge1xuLy8gIHVzYWdlOiBkZWNyeXB0UEdQTWVzc2FnZVdpdGhLZXkoY29udGVudCkob3BlbnBncCkocHJpdmF0ZUtleUFybW9yKShwYXNzd29yZCkudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgIHJldHVybiAoIVBHUE1lc3NhZ2VBcm1vcikgP1xuICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBQR1BNZXNzYWdlJyk6XG4gICAgKG9wZW5wZ3ApID0+IHtcbiAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgICAgICAocHJpdmF0ZUtleUFybW9yKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCFwcml2YXRlS2V5QXJtb3IpID9cbiAgICAgICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBwcml2YXRlS2V5QXJtb3InKTpcbiAgICAgICAgICAgIChwYXNzd29yZCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAoIXBhc3N3b3JkKSA/XG4gICAgICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIHBhc3N3b3JkJyk6XG4gICAgICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHByaXZhdGVLZXlzID0gb3BlbnBncC5rZXkucmVhZEFybW9yZWQocHJpdmF0ZUtleUFybW9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHByaXZhdGVLZXkgPSBwcml2YXRlS2V5cy5rZXlzWzBdXG4gICAgICAgICAgICAgICAgICAgICAgICBwcml2YXRlS2V5LmRlY3J5cHQocGFzc3dvcmQpXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbWVzc2FnZSA9IG9wZW5wZ3AubWVzc2FnZS5yZWFkQXJtb3JlZChQR1BNZXNzYWdlQXJtb3IpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCFvcGVucGdwLmRlY3J5cHQpID9cbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5wZ3AuZGVjcnlwdE1lc3NhZ2UocHJpdmF0ZUtleSwgbWVzc2FnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICk6XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVucGdwLmRlY3J5cHQoeyAnbWVzc2FnZSc6IG1lc3NhZ2UsICdwcml2YXRlS2V5JzogcHJpdmF0ZUtleSB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdC5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9yZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gZGVjcnlwdFBHUE1lc3NhZ2UoUEdQTWVzc2FnZUFybW9yKSB7XG4vLyAgdXNhZ2U6IGRlY3J5cHRQR1BNZXNzYWdlKGNvbnRlbnQpKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSkocGFzc3dvcmQpLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbiAgICByZXR1cm4gKCFQR1BNZXNzYWdlQXJtb3IpID9cbiAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgUEdQTWVzc2FnZScpOlxuICAgIChvcGVucGdwKSA9PiB7XG4gICAgICAgIHJldHVybiAoIW9wZW5wZ3ApID9cbiAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIG9wZW5wZ3AnKTpcbiAgICAgICAgKGxvY2FsU3RvcmFnZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICghbG9jYWxTdG9yYWdlKSA/XG4gICAgICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgbG9jYWxTdG9yYWdlJyk6XG4gICAgICAgICAgICAocGFzc3dvcmQpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKCFwYXNzd29yZCkgP1xuICAgICAgICAgICAgICAgIFByb21pc2UucmVqZWN0KFwiRXJyb3I6IG1pc3NpbmcgcGFzc3dvcmRcIik6XG4gICAgICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBnZXRGcm9tU3RvcmFnZShsb2NhbFN0b3JhZ2UpKCkudGhlbihzdG9yZUFyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdG9yZUFyclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoc3RvcmVJdGVtID0+ICghc3RvcmVJdGVtKSA/IGZhbHNlIDogdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKHN0b3JlSXRlbSA9PiBjbGFzc2lmeUNvbnRlbnQoc3RvcmVJdGVtKShvcGVucGdwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihjb250ZW50VHlwZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudFR5cGUgPT09ICdQR1BQcml2a2V5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlY3J5cHRQR1BNZXNzYWdlV2l0aEtleShQR1BNZXNzYWdlQXJtb3IpKG9wZW5wZ3ApKHN0b3JlSXRlbSkoJ2hvdGxpcHMnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGRlY3J5cHRlZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGVjcnlwdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVQb3N0KGNvbnRlbnQpIHtcbiAgICAvL2NvbnNvbGUubG9nKGBoYW5kbGVQb3N0IDwtICR7Y29udGVudH1gKTtcbiAgICByZXR1cm4gKCFjb250ZW50KSA/XG4gICAgUHJvbWlzZS5yZXNvbHZlKCcnKSA6XG4gICAgKG9wZW5wZ3ApID0+IHtcbiAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgICAgICAobG9jYWxTdG9yYWdlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKHBhc3N3b3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NpZnlDb250ZW50KGNvbnRlbnQpKG9wZW5wZ3ApXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGNvbnRlbnRUeXBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50VHlwZSA9PT0gJ2NsZWFydGV4dCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlbmNyeXB0IGFuZCBicm9hZGNhc3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50VHlwZSA9PT0gJ1BHUFByaXZrZXknKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2F2ZSBhbmQgYnJvYWRjYXN0IGNvbnZlcnRlZCBwdWJsaWMga2V5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNhdmVQR1BQcml2a2V5KGNvbnRlbnQpKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3JldHVybiBicm9hZGNhc3RNZXNzYWdlKGNvbnRlbnQpKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRlbnRUeXBlID09PSAnUEdQUHVia2V5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNhdmUgdG8gbG9jYWxTdG9yYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNhdmVQR1BQdWJrZXkoY29udGVudCkob3BlbnBncCkobG9jYWxTdG9yYWdlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiByZXN1bHQpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudFR5cGUgPT09ICdQR1BNZXNzYWdlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdldCBQR1BLZXlzLCBkZWNyeXB0LCAgYW5kIHJldHVyblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWNyeXB0UEdQTWVzc2FnZShjb250ZW50KShvcGVucGdwKShsb2NhbFN0b3JhZ2UpKHBhc3N3b3JkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiByZWplY3QoZXJyKSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuLy8gICAgIHZhciBndW5hZGRyZXNzID0gJ3t7aXBfbG9jYWx9fTp7e3BvcnR9fSdcbi8vICAgICB2YXIgZ3VuID0gR3VuKGBodHRwOi8vJHtndW5hZGRyZXNzfS9ndW5gKTtcbi8vICAgICB2YXIgZ3VuZGF0YSA9IGd1bi5nZXQoJ2RhdGEnKTtcbi8vICAgICBndW5kYXRhLnB1dCh7IG1lc3NhZ2U6YGNsaWVudCBsaXN0ZW5pbmcgdG8gaHR0cDovLyR7Z3VuYWRkcmVzc30vZ3VuYCB9KTtcbi8vICAgICBndW5kYXRhLnBhdGgoJ21lc3NhZ2UnKS5vbihmdW5jdGlvbiAobWVzc2FnZSkge1xuLy8gICAgICAgICBoYW5kbGVJbmNvbWluZ01lc3NhZ2UobWVzc2FnZSlcbi8vICAgICB9KTtcbi8vIDwvc2NyaXB0PlxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xpYi91dGlsLmpzIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vcHJvY2Vzcy9icm93c2VyLmpzIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IExlb24gUmV2aWxsIG9uIDE1LzEyLzIwMTUuXG4gKiBCbG9nOiBibG9nLnJldmlsbHdlYi5jb21cbiAqIEdpdEh1YjogaHR0cHM6Ly9naXRodWIuY29tL1JldmlsbFdlYlxuICogVHdpdHRlcjogQFJldmlsbFdlYlxuICovXG5cbi8qKlxuICogVGhlIG1haW4gcm91dGVyIGNsYXNzIGFuZCBlbnRyeSBwb2ludCB0byB0aGUgcm91dGVyLlxuICovXG5leHBvcnQgY2xhc3MgUmViZWxSb3V0ZXIgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cbiAgICAvKipcbiAgICAgKiBNYWluIGluaXRpYWxpc2F0aW9uIHBvaW50IG9mIHJlYmVsLXJvdXRlclxuICAgICAqIEBwYXJhbSBwcmVmaXggLSBJZiBleHRlbmRpbmcgcmViZWwtcm91dGVyIHlvdSBjYW4gc3BlY2lmeSBhIHByZWZpeCB3aGVuIGNhbGxpbmcgY3JlYXRlZENhbGxiYWNrIGluIGNhc2UgeW91ciBlbGVtZW50cyBuZWVkIHRvIGJlIG5hbWVkIGRpZmZlcmVudGx5XG4gICAgICovXG4gICAgY3JlYXRlZENhbGxiYWNrKHByZWZpeCkge1xuXG4gICAgICAgIGNvbnN0IF9wcmVmaXggPSBwcmVmaXggfHwgXCJyZWJlbFwiO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5wcmV2aW91c1BhdGggPSBudWxsO1xuICAgICAgICB0aGlzLmJhc2VQYXRoID0gbnVsbDtcblxuICAgICAgICAvL0dldCBvcHRpb25zXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgICAgICAgIFwiYW5pbWF0aW9uXCI6ICh0aGlzLmdldEF0dHJpYnV0ZShcImFuaW1hdGlvblwiKSA9PSBcInRydWVcIiksXG4gICAgICAgICAgICBcInNoYWRvd1Jvb3RcIjogKHRoaXMuZ2V0QXR0cmlidXRlKFwic2hhZG93XCIpID09IFwidHJ1ZVwiKSxcbiAgICAgICAgICAgIFwiaW5oZXJpdFwiOiAodGhpcy5nZXRBdHRyaWJ1dGUoXCJpbmhlcml0XCIpICE9IFwiZmFsc2VcIilcbiAgICAgICAgfTtcblxuICAgICAgICAvL0dldCByb3V0ZXNcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5pbmhlcml0ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAvL0lmIHRoaXMgaXMgYSBuZXN0ZWQgcm91dGVyIHRoZW4gd2UgbmVlZCB0byBnbyBhbmQgZ2V0IHRoZSBwYXJlbnQgcGF0aFxuICAgICAgICAgICAgbGV0ICRlbGVtZW50ID0gdGhpcztcbiAgICAgICAgICAgIHdoaWxlICgkZWxlbWVudC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgJGVsZW1lbnQgPSAkZWxlbWVudC5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIGlmICgkZWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09IF9wcmVmaXggKyBcIi1yb3V0ZXJcIikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50ID0gJGVsZW1lbnQuY3VycmVudCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJhc2VQYXRoID0gY3VycmVudC5yb3V0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucm91dGVzID0ge307XG4gICAgICAgIGNvbnN0ICRjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCAkY2hpbGQgPSAkY2hpbGRyZW5baV07XG4gICAgICAgICAgICBsZXQgcGF0aCA9ICRjaGlsZC5nZXRBdHRyaWJ1dGUoXCJwYXRoXCIpO1xuICAgICAgICAgICAgc3dpdGNoICgkY2hpbGQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgX3ByZWZpeCArIFwiLWRlZmF1bHRcIjpcbiAgICAgICAgICAgICAgICAgICAgcGF0aCA9IFwiKlwiO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIF9wcmVmaXggKyBcIi1yb3V0ZVwiOlxuICAgICAgICAgICAgICAgICAgICBwYXRoID0gKHRoaXMuYmFzZVBhdGggIT09IG51bGwpID8gdGhpcy5iYXNlUGF0aCArIHBhdGggOiBwYXRoO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXRoICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbGV0ICR0ZW1wbGF0ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKCRjaGlsZC5pbm5lckhUTUwpIHtcbiAgICAgICAgICAgICAgICAgICAgJHRlbXBsYXRlID0gXCI8XCIgKyBfcHJlZml4ICsgXCItcm91dGU+XCIgKyAkY2hpbGQuaW5uZXJIVE1MICsgXCI8L1wiICsgX3ByZWZpeCArIFwiLXJvdXRlPlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlc1twYXRoXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJjb21wb25lbnRcIjogJGNoaWxkLmdldEF0dHJpYnV0ZShcImNvbXBvbmVudFwiKSxcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiAkdGVtcGxhdGVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9BZnRlciB3ZSBoYXZlIGNvbGxlY3RlZCBhbGwgY29uZmlndXJhdGlvbiBjbGVhciBpbm5lckhUTUxcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hhZG93Um9vdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVTaGFkb3dSb290KCk7XG4gICAgICAgICAgICB0aGlzLnJvb3QgPSB0aGlzLnNoYWRvd1Jvb3Q7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJvb3QgPSB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYW5pbWF0aW9uID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLmluaXRBbmltYXRpb24oKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICBSZWJlbFJvdXRlci5wYXRoQ2hhbmdlKChpc0JhY2spID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYW5pbWF0aW9uID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzQmFjayA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoXCJyYmwtYmFja1wiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoXCJyYmwtYmFja1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZ1bmN0aW9uIHVzZWQgdG8gaW5pdGlhbGlzZSB0aGUgYW5pbWF0aW9uIG1lY2hhbmljcyBpZiBhbmltYXRpb24gaXMgdHVybmVkIG9uXG4gICAgICovXG4gICAgaW5pdEFuaW1hdGlvbigpIHtcbiAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG4gICAgICAgICAgICBsZXQgbm9kZSA9IG11dGF0aW9uc1swXS5hZGRlZE5vZGVzWzBdO1xuICAgICAgICAgICAgaWYgKG5vZGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG90aGVyQ2hpbGRyZW4gPSB0aGlzLmdldE90aGVyQ2hpbGRyZW4obm9kZSk7XG4gICAgICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QuYWRkKFwicmViZWwtYW5pbWF0ZVwiKTtcbiAgICAgICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5hZGQoXCJlbnRlclwiKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG90aGVyQ2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJDaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLmNsYXNzTGlzdC5hZGQoXCJleGl0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZC5jbGFzc0xpc3QuYWRkKFwiY29tcGxldGVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5hZGQoXCJjb21wbGV0ZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgICAgICAgICBjb25zdCBhbmltYXRpb25FbmQgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5jbGFzc05hbWUuaW5kZXhPZihcImV4aXRcIikgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yb290LnJlbW92ZUNoaWxkKGV2ZW50LnRhcmdldCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihcInRyYW5zaXRpb25lbmRcIiwgYW5pbWF0aW9uRW5kKTtcbiAgICAgICAgICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgYW5pbWF0aW9uRW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUodGhpcywge2NoaWxkTGlzdDogdHJ1ZX0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1ldGhvZCB1c2VkIHRvIGdldCB0aGUgY3VycmVudCByb3V0ZSBvYmplY3RcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBjdXJyZW50KCkge1xuICAgICAgICBjb25zdCBwYXRoID0gUmViZWxSb3V0ZXIuZ2V0UGF0aEZyb21VcmwoKTtcbiAgICAgICAgZm9yIChjb25zdCByb3V0ZSBpbiB0aGlzLnJvdXRlcykge1xuICAgICAgICAgICAgaWYgKHJvdXRlICE9PSBcIipcIikge1xuICAgICAgICAgICAgICAgIGxldCByZWdleFN0cmluZyA9IFwiXlwiICsgcm91dGUucmVwbGFjZSgve1xcdyt9XFwvPy9nLCBcIihcXFxcdyspXFwvP1wiKTtcbiAgICAgICAgICAgICAgICByZWdleFN0cmluZyArPSAocmVnZXhTdHJpbmcuaW5kZXhPZihcIlxcXFwvP1wiKSA+IC0xKSA/IFwiXCIgOiBcIlxcXFwvP1wiICsgXCIoWz89Ji1cXC9cXFxcdytdKyk/JFwiO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChyZWdleFN0cmluZyk7XG4gICAgICAgICAgICAgICAgaWYgKHJlZ2V4LnRlc3QocGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9yb3V0ZVJlc3VsdCh0aGlzLnJvdXRlc1tyb3V0ZV0sIHJvdXRlLCByZWdleCwgcGF0aCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAodGhpcy5yb3V0ZXNbXCIqXCJdICE9PSB1bmRlZmluZWQpID8gX3JvdXRlUmVzdWx0KHRoaXMucm91dGVzW1wiKlwiXSwgXCIqXCIsIG51bGwsIHBhdGgpIDogbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNZXRob2QgY2FsbGVkIHRvIHJlbmRlciB0aGUgY3VycmVudCB2aWV3XG4gICAgICovXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmN1cnJlbnQoKTtcbiAgICAgICAgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5wYXRoICE9PSB0aGlzLnByZXZpb3VzUGF0aCB8fCB0aGlzLm9wdGlvbnMuYW5pbWF0aW9uID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hbmltYXRpb24gIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb290LmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuY29tcG9uZW50ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCAkY29tcG9uZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChyZXN1bHQuY29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIHJlc3VsdC5wYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHJlc3VsdC5wYXJhbXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gXCJPYmplY3RcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gSlNPTi5wYXJzZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ291bGRuJ3QgcGFyc2UgcGFyYW0gdmFsdWU6XCIsIGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICRjb21wb25lbnQuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm9vdC5hcHBlbmRDaGlsZCgkY29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgJHRlbXBsYXRlID0gcmVzdWx0LnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICAvL1RPRE86IEZpbmQgYSBmYXN0ZXIgYWx0ZXJuYXRpdmVcbiAgICAgICAgICAgICAgICAgICAgaWYgKCR0ZW1wbGF0ZS5pbmRleE9mKFwiJHtcIikgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHRlbXBsYXRlID0gJHRlbXBsYXRlLnJlcGxhY2UoL1xcJHsoW157fV0qKX0vZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgciA9IHJlc3VsdC5wYXJhbXNbYl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YgciA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHIgPT09ICdudW1iZXInID8gciA6IGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvb3QuaW5uZXJIVE1MID0gJHRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnByZXZpb3VzUGF0aCA9IHJlc3VsdC5wYXRoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBub2RlIC0gVXNlZCB3aXRoIHRoZSBhbmltYXRpb24gbWVjaGFuaWNzIHRvIGdldCBhbGwgb3RoZXIgdmlldyBjaGlsZHJlbiBleGNlcHQgaXRzZWxmXG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqL1xuICAgIGdldE90aGVyQ2hpbGRyZW4obm9kZSkge1xuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IHRoaXMucm9vdC5jaGlsZHJlbjtcbiAgICAgICAgbGV0IHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgICAgICAgICBpZiAoY2hpbGQgIT0gbm9kZSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChjaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogU3RhdGljIGhlbHBlciBtZXRob2QgdG8gcGFyc2UgdGhlIHF1ZXJ5IHN0cmluZyBmcm9tIGEgdXJsIGludG8gYW4gb2JqZWN0LlxuICAgICAqIEBwYXJhbSB1cmxcbiAgICAgKiBAcmV0dXJucyB7e319XG4gICAgICovXG4gICAgc3RhdGljIHBhcnNlUXVlcnlTdHJpbmcodXJsKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgICAgaWYgKHVybCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB2YXIgcXVlcnlTdHJpbmcgPSAodXJsLmluZGV4T2YoXCI/XCIpID4gLTEpID8gdXJsLnN1YnN0cih1cmwuaW5kZXhPZihcIj9cIikgKyAxLCB1cmwubGVuZ3RoKSA6IG51bGw7XG4gICAgICAgICAgICBpZiAocXVlcnlTdHJpbmcgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBxdWVyeVN0cmluZy5zcGxpdChcIiZcIikuZm9yRWFjaChmdW5jdGlvbiAocGFydCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXBhcnQpIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgcGFydCA9IHBhcnQucmVwbGFjZShcIitcIiwgXCIgXCIpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXEgPSBwYXJ0LmluZGV4T2YoXCI9XCIpO1xuICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gZXEgPiAtMSA/IHBhcnQuc3Vic3RyKDAsIGVxKSA6IHBhcnQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWwgPSBlcSA+IC0xID8gZGVjb2RlVVJJQ29tcG9uZW50KHBhcnQuc3Vic3RyKGVxICsgMSkpIDogXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZyb20gPSBrZXkuaW5kZXhPZihcIltcIik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmcm9tID09IC0xKSByZXN1bHRbZGVjb2RlVVJJQ29tcG9uZW50KGtleSldID0gdmFsO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0byA9IGtleS5pbmRleE9mKFwiXVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IGRlY29kZVVSSUNvbXBvbmVudChrZXkuc3Vic3RyaW5nKGZyb20gKyAxLCB0bykpO1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5ID0gZGVjb2RlVVJJQ29tcG9uZW50KGtleS5zdWJzdHJpbmcoMCwgZnJvbSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXN1bHRba2V5XSkgcmVzdWx0W2tleV0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaW5kZXgpIHJlc3VsdFtrZXldLnB1c2godmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgcmVzdWx0W2tleV1baW5kZXhdID0gdmFsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdGF0aWMgaGVscGVyIG1ldGhvZCB0byBjb252ZXJ0IGEgY2xhc3MgbmFtZSB0byBhIHZhbGlkIGVsZW1lbnQgbmFtZS5cbiAgICAgKiBAcGFyYW0gQ2xhc3NcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIHN0YXRpYyBjbGFzc1RvVGFnKENsYXNzKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDbGFzcy5uYW1lIHdvdWxkIGJlIGJldHRlciBidXQgdGhpcyBpc24ndCBzdXBwb3J0ZWQgaW4gSUUgMTEuXG4gICAgICAgICAqL1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIG5hbWUgPSBDbGFzcy50b1N0cmluZygpLm1hdGNoKC9eZnVuY3Rpb25cXHMqKFteXFxzKF0rKS8pWzFdLnJlcGxhY2UoL1xcVysvZywgJy0nKS5yZXBsYWNlKC8oW2EtelxcZF0pKFtBLVowLTldKS9nLCAnJDEtJDInKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBwYXJzZSBjbGFzcyBuYW1lOlwiLCBlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoUmViZWxSb3V0ZXIudmFsaWRFbGVtZW50VGFnKG5hbWUpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2xhc3MgbmFtZSBjb3VsZG4ndCBiZSB0cmFuc2xhdGVkIHRvIHRhZy5cIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RhdGljIGhlbHBlciBtZXRob2QgdXNlZCB0byBkZXRlcm1pbmUgaWYgYW4gZWxlbWVudCB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZSBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQuXG4gICAgICogQHBhcmFtIG5hbWVcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBzdGF0aWMgaXNSZWdpc3RlcmVkRWxlbWVudChuYW1lKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5hbWUpLmNvbnN0cnVjdG9yICE9PSBIVE1MRWxlbWVudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdGF0aWMgaGVscGVyIG1ldGhvZCB0byB0YWtlIGEgd2ViIGNvbXBvbmVudCBjbGFzcywgY3JlYXRlIGFuIGVsZW1lbnQgbmFtZSBhbmQgcmVnaXN0ZXIgdGhlIG5ldyBlbGVtZW50IG9uIHRoZSBkb2N1bWVudC5cbiAgICAgKiBAcGFyYW0gQ2xhc3NcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIHN0YXRpYyBjcmVhdGVFbGVtZW50KENsYXNzKSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBSZWJlbFJvdXRlci5jbGFzc1RvVGFnKENsYXNzKTtcbiAgICAgICAgaWYgKFJlYmVsUm91dGVyLmlzUmVnaXN0ZXJlZEVsZW1lbnQobmFtZSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBDbGFzcy5wcm90b3R5cGUubmFtZSA9IG5hbWU7XG4gICAgICAgICAgICBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQobmFtZSwgQ2xhc3MpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuYW1lO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNpbXBsZSBzdGF0aWMgaGVscGVyIG1ldGhvZCBjb250YWluaW5nIGEgcmVndWxhciBleHByZXNzaW9uIHRvIHZhbGlkYXRlIGFuIGVsZW1lbnQgbmFtZVxuICAgICAqIEBwYXJhbSB0YWdcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBzdGF0aWMgdmFsaWRFbGVtZW50VGFnKHRhZykge1xuICAgICAgICByZXR1cm4gL15bYS16MC05XFwtXSskLy50ZXN0KHRhZyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWV0aG9kIHVzZWQgdG8gcmVnaXN0ZXIgYSBjYWxsYmFjayB0byBiZSBjYWxsZWQgd2hlbiB0aGUgVVJMIHBhdGggY2hhbmdlcy5cbiAgICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICAgKi9cbiAgICBzdGF0aWMgcGF0aENoYW5nZShjYWxsYmFjaykge1xuICAgICAgICBpZiAoUmViZWxSb3V0ZXIuY2hhbmdlQ2FsbGJhY2tzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIFJlYmVsUm91dGVyLmNoYW5nZUNhbGxiYWNrcyA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIFJlYmVsUm91dGVyLmNoYW5nZUNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgY29uc3QgY2hhbmdlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogIGV2ZW50Lm9sZFVSTCBhbmQgZXZlbnQubmV3VVJMIHdvdWxkIGJlIGJldHRlciBoZXJlIGJ1dCB0aGlzIGRvZXNuJ3Qgd29yayBpbiBJRSA6KFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhyZWYgIT0gUmViZWxSb3V0ZXIub2xkVVJMKSB7XG4gICAgICAgICAgICAgICAgUmViZWxSb3V0ZXIuY2hhbmdlQ2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24oY2FsbGJhY2spe1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhSZWJlbFJvdXRlci5pc0JhY2spO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFJlYmVsUm91dGVyLmlzQmFjayA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgUmViZWxSb3V0ZXIub2xkVVJMID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgICAgIH07XG4gICAgICAgIGlmICh3aW5kb3cub25oYXNoY2hhbmdlID09PSBudWxsKSB7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJibGJhY2tcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBSZWJlbFJvdXRlci5pc0JhY2sgPSB0cnVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgd2luZG93Lm9uaGFzaGNoYW5nZSA9IGNoYW5nZUhhbmRsZXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RhdGljIGhlbHBlciBtZXRob2QgdXNlZCB0byBnZXQgdGhlIHBhcmFtZXRlcnMgZnJvbSB0aGUgcHJvdmlkZWQgcm91dGUuXG4gICAgICogQHBhcmFtIHJlZ2V4XG4gICAgICogQHBhcmFtIHJvdXRlXG4gICAgICogQHBhcmFtIHBhdGhcbiAgICAgKiBAcmV0dXJucyB7e319XG4gICAgICovXG4gICAgc3RhdGljIGdldFBhcmFtc0Zyb21VcmwocmVnZXgsIHJvdXRlLCBwYXRoKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBSZWJlbFJvdXRlci5wYXJzZVF1ZXJ5U3RyaW5nKHBhdGgpO1xuICAgICAgICB2YXIgcmUgPSAveyhcXHcrKX0vZztcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgbGV0IG1hdGNoO1xuICAgICAgICB3aGlsZSAobWF0Y2ggPSByZS5leGVjKHJvdXRlKSkge1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKG1hdGNoWzFdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVnZXggIT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHRzMiA9IHJlZ2V4LmV4ZWMocGF0aCk7XG4gICAgICAgICAgICByZXN1bHRzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGlkeCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtpdGVtXSA9IHJlc3VsdHMyW2lkeCArIDFdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdGF0aWMgaGVscGVyIG1ldGhvZCB1c2VkIHRvIGdldCB0aGUgcGF0aCBmcm9tIHRoZSBjdXJyZW50IFVSTC5cbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0UGF0aEZyb21VcmwoKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5tYXRjaCgvIyguKikkLyk7XG4gICAgICAgIGlmIChyZXN1bHQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRbMV07XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcInJlYmVsLXJvdXRlclwiLCBSZWJlbFJvdXRlcik7XG5cbi8qKlxuICogQ2xhc3Mgd2hpY2ggcmVwcmVzZW50cyB0aGUgcmViZWwtcm91dGUgY3VzdG9tIGVsZW1lbnRcbiAqL1xuZXhwb3J0IGNsYXNzIFJlYmVsUm91dGUgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cbn1cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcInJlYmVsLXJvdXRlXCIsIFJlYmVsUm91dGUpO1xuXG4vKipcbiAqIENsYXNzIHdoaWNoIHJlcHJlc2VudHMgdGhlIHJlYmVsLWRlZmF1bHQgY3VzdG9tIGVsZW1lbnRcbiAqL1xuY2xhc3MgUmViZWxEZWZhdWx0IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJyZWJlbC1kZWZhdWx0XCIsIFJlYmVsRGVmYXVsdCk7XG5cblxuLyoqXG4gKiBSZXByZXNlbnRzIHRoZSBwcm90b3R5cGUgZm9yIGFuIGFuY2hvciBlbGVtZW50IHdoaWNoIGFkZGVkIGZ1bmN0aW9uYWxpdHkgdG8gcGVyZm9ybSBhIGJhY2sgdHJhbnNpdGlvbi5cbiAqL1xuY2xhc3MgUmViZWxCYWNrQSBleHRlbmRzIEhUTUxBbmNob3JFbGVtZW50IHtcbiAgICBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmdldEF0dHJpYnV0ZShcImhyZWZcIik7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgaWYgKHBhdGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncmJsYmFjaycpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gcGF0aDtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuLyoqXG4gKiBSZWdpc3RlciB0aGUgYmFjayBidXR0b24gY3VzdG9tIGVsZW1lbnRcbiAqL1xuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwicmViZWwtYmFjay1hXCIsIHtcbiAgICBleHRlbmRzOiBcImFcIixcbiAgICBwcm90b3R5cGU6IFJlYmVsQmFja0EucHJvdG90eXBlXG59KTtcblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGEgcm91dGUgb2JqZWN0XG4gKiBAcGFyYW0gb2JqIC0gdGhlIGNvbXBvbmVudCBuYW1lIG9yIHRoZSBIVE1MIHRlbXBsYXRlXG4gKiBAcGFyYW0gcm91dGVcbiAqIEBwYXJhbSByZWdleFxuICogQHBhcmFtIHBhdGhcbiAqIEByZXR1cm5zIHt7fX1cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIF9yb3V0ZVJlc3VsdChvYmosIHJvdXRlLCByZWdleCwgcGF0aCkge1xuICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBvYmpba2V5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQucm91dGUgPSByb3V0ZTtcbiAgICByZXN1bHQucGF0aCA9IHBhdGg7XG4gICAgcmVzdWx0LnBhcmFtcyA9IFJlYmVsUm91dGVyLmdldFBhcmFtc0Zyb21VcmwocmVnZXgsIHJvdXRlLCBwYXRoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vcmViZWwtcm91dGVyL3NyYy9yZWJlbC1yb3V0ZXIuanMiLCI7KGZ1bmN0aW9uKCl7XHJcblxyXG5cdC8qIFVOQlVJTEQgKi9cclxuXHR2YXIgcm9vdDtcclxuXHRpZih0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKXsgcm9vdCA9IHdpbmRvdyB9XHJcblx0aWYodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIil7IHJvb3QgPSBnbG9iYWwgfVxyXG5cdHJvb3QgPSByb290IHx8IHt9O1xyXG5cdHZhciBjb25zb2xlID0gcm9vdC5jb25zb2xlIHx8IHtsb2c6IGZ1bmN0aW9uKCl7fX07XHJcblx0ZnVuY3Rpb24gcmVxdWlyZShhcmcpe1xyXG5cdFx0cmV0dXJuIGFyZy5zbGljZT8gcmVxdWlyZVtyZXNvbHZlKGFyZyldIDogZnVuY3Rpb24obW9kLCBwYXRoKXtcclxuXHRcdFx0YXJnKG1vZCA9IHtleHBvcnRzOiB7fX0pO1xyXG5cdFx0XHRyZXF1aXJlW3Jlc29sdmUocGF0aCldID0gbW9kLmV4cG9ydHM7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiByZXNvbHZlKHBhdGgpe1xyXG5cdFx0XHRyZXR1cm4gcGF0aC5zcGxpdCgnLycpLnNsaWNlKC0xKS50b1N0cmluZygpLnJlcGxhY2UoJy5qcycsJycpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRpZih0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiKXsgdmFyIGNvbW1vbiA9IG1vZHVsZSB9XHJcblx0LyogVU5CVUlMRCAqL1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0Ly8gR2VuZXJpYyBqYXZhc2NyaXB0IHV0aWxpdGllcy5cclxuXHRcdHZhciBUeXBlID0ge307XHJcblx0XHQvL1R5cGUuZm5zID0gVHlwZS5mbiA9IHtpczogZnVuY3Rpb24oZm4peyByZXR1cm4gKCEhZm4gJiYgZm4gaW5zdGFuY2VvZiBGdW5jdGlvbikgfX1cclxuXHRcdFR5cGUuZm5zID0gVHlwZS5mbiA9IHtpczogZnVuY3Rpb24oZm4peyByZXR1cm4gKCEhZm4gJiYgJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZm4pIH19XHJcblx0XHRUeXBlLmJpID0ge2lzOiBmdW5jdGlvbihiKXsgcmV0dXJuIChiIGluc3RhbmNlb2YgQm9vbGVhbiB8fCB0eXBlb2YgYiA9PSAnYm9vbGVhbicpIH19XHJcblx0XHRUeXBlLm51bSA9IHtpczogZnVuY3Rpb24obil7IHJldHVybiAhbGlzdF9pcyhuKSAmJiAoKG4gLSBwYXJzZUZsb2F0KG4pICsgMSkgPj0gMCB8fCBJbmZpbml0eSA9PT0gbiB8fCAtSW5maW5pdHkgPT09IG4pIH19XHJcblx0XHRUeXBlLnRleHQgPSB7aXM6IGZ1bmN0aW9uKHQpeyByZXR1cm4gKHR5cGVvZiB0ID09ICdzdHJpbmcnKSB9fVxyXG5cdFx0VHlwZS50ZXh0LmlmeSA9IGZ1bmN0aW9uKHQpe1xyXG5cdFx0XHRpZihUeXBlLnRleHQuaXModCkpeyByZXR1cm4gdCB9XHJcblx0XHRcdGlmKHR5cGVvZiBKU09OICE9PSBcInVuZGVmaW5lZFwiKXsgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHQpIH1cclxuXHRcdFx0cmV0dXJuICh0ICYmIHQudG9TdHJpbmcpPyB0LnRvU3RyaW5nKCkgOiB0O1xyXG5cdFx0fVxyXG5cdFx0VHlwZS50ZXh0LnJhbmRvbSA9IGZ1bmN0aW9uKGwsIGMpe1xyXG5cdFx0XHR2YXIgcyA9ICcnO1xyXG5cdFx0XHRsID0gbCB8fCAyNDsgLy8geW91IGFyZSBub3QgZ29pbmcgdG8gbWFrZSBhIDAgbGVuZ3RoIHJhbmRvbSBudW1iZXIsIHNvIG5vIG5lZWQgdG8gY2hlY2sgdHlwZVxyXG5cdFx0XHRjID0gYyB8fCAnMDEyMzQ1Njc4OUFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eic7XHJcblx0XHRcdHdoaWxlKGwgPiAwKXsgcyArPSBjLmNoYXJBdChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjLmxlbmd0aCkpOyBsLS0gfVxyXG5cdFx0XHRyZXR1cm4gcztcclxuXHRcdH1cclxuXHRcdFR5cGUudGV4dC5tYXRjaCA9IGZ1bmN0aW9uKHQsIG8peyB2YXIgciA9IGZhbHNlO1xyXG5cdFx0XHR0ID0gdCB8fCAnJztcclxuXHRcdFx0byA9IFR5cGUudGV4dC5pcyhvKT8geyc9Jzogb30gOiBvIHx8IHt9OyAvLyB7J34nLCAnPScsICcqJywgJzwnLCAnPicsICcrJywgJy0nLCAnPycsICchJ30gLy8gaWdub3JlIGNhc2UsIGV4YWN0bHkgZXF1YWwsIGFueXRoaW5nIGFmdGVyLCBsZXhpY2FsbHkgbGFyZ2VyLCBsZXhpY2FsbHkgbGVzc2VyLCBhZGRlZCBpbiwgc3VidGFjdGVkIGZyb20sIHF1ZXN0aW9uYWJsZSBmdXp6eSBtYXRjaCwgYW5kIGVuZHMgd2l0aC5cclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJ34nKSl7IHQgPSB0LnRvTG93ZXJDYXNlKCk7IG9bJz0nXSA9IChvWyc9J10gfHwgb1snfiddKS50b0xvd2VyQ2FzZSgpIH1cclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJz0nKSl7IHJldHVybiB0ID09PSBvWyc9J10gfVxyXG5cdFx0XHRpZihUeXBlLm9iai5oYXMobywnKicpKXsgaWYodC5zbGljZSgwLCBvWycqJ10ubGVuZ3RoKSA9PT0gb1snKiddKXsgciA9IHRydWU7IHQgPSB0LnNsaWNlKG9bJyonXS5sZW5ndGgpIH0gZWxzZSB7IHJldHVybiBmYWxzZSB9fVxyXG5cdFx0XHRpZihUeXBlLm9iai5oYXMobywnIScpKXsgaWYodC5zbGljZSgtb1snISddLmxlbmd0aCkgPT09IG9bJyEnXSl7IHIgPSB0cnVlIH0gZWxzZSB7IHJldHVybiBmYWxzZSB9fVxyXG5cdFx0XHRpZihUeXBlLm9iai5oYXMobywnKycpKXtcclxuXHRcdFx0XHRpZihUeXBlLmxpc3QubWFwKFR5cGUubGlzdC5pcyhvWycrJ10pPyBvWycrJ10gOiBbb1snKyddXSwgZnVuY3Rpb24obSl7XHJcblx0XHRcdFx0XHRpZih0LmluZGV4T2YobSkgPj0gMCl7IHIgPSB0cnVlIH0gZWxzZSB7IHJldHVybiB0cnVlIH1cclxuXHRcdFx0XHR9KSl7IHJldHVybiBmYWxzZSB9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJy0nKSl7XHJcblx0XHRcdFx0aWYoVHlwZS5saXN0Lm1hcChUeXBlLmxpc3QuaXMob1snLSddKT8gb1snLSddIDogW29bJy0nXV0sIGZ1bmN0aW9uKG0pe1xyXG5cdFx0XHRcdFx0aWYodC5pbmRleE9mKG0pIDwgMCl7IHIgPSB0cnVlIH0gZWxzZSB7IHJldHVybiB0cnVlIH1cclxuXHRcdFx0XHR9KSl7IHJldHVybiBmYWxzZSB9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJz4nKSl7IGlmKHQgPiBvWyc+J10peyByID0gdHJ1ZSB9IGVsc2UgeyByZXR1cm4gZmFsc2UgfX1cclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJzwnKSl7IGlmKHQgPCBvWyc8J10peyByID0gdHJ1ZSB9IGVsc2UgeyByZXR1cm4gZmFsc2UgfX1cclxuXHRcdFx0ZnVuY3Rpb24gZnV6enkodCxmKXsgdmFyIG4gPSAtMSwgaSA9IDAsIGM7IGZvcig7YyA9IGZbaSsrXTspeyBpZighfihuID0gdC5pbmRleE9mKGMsIG4rMSkpKXsgcmV0dXJuIGZhbHNlIH19IHJldHVybiB0cnVlIH0gLy8gdmlhIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvOTIwNjAxMy9qYXZhc2NyaXB0LWZ1enp5LXNlYXJjaFxyXG5cdFx0XHRpZihUeXBlLm9iai5oYXMobywnPycpKXsgaWYoZnV6enkodCwgb1snPyddKSl7IHIgPSB0cnVlIH0gZWxzZSB7IHJldHVybiBmYWxzZSB9fSAvLyBjaGFuZ2UgbmFtZSFcclxuXHRcdFx0cmV0dXJuIHI7XHJcblx0XHR9XHJcblx0XHRUeXBlLmxpc3QgPSB7aXM6IGZ1bmN0aW9uKGwpeyByZXR1cm4gKGwgaW5zdGFuY2VvZiBBcnJheSkgfX1cclxuXHRcdFR5cGUubGlzdC5zbGl0ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xyXG5cdFx0VHlwZS5saXN0LnNvcnQgPSBmdW5jdGlvbihrKXsgLy8gY3JlYXRlcyBhIG5ldyBzb3J0IGZ1bmN0aW9uIGJhc2VkIG9mZiBzb21lIGZpZWxkXHJcblx0XHRcdHJldHVybiBmdW5jdGlvbihBLEIpe1xyXG5cdFx0XHRcdGlmKCFBIHx8ICFCKXsgcmV0dXJuIDAgfSBBID0gQVtrXTsgQiA9IEJba107XHJcblx0XHRcdFx0aWYoQSA8IEIpeyByZXR1cm4gLTEgfWVsc2UgaWYoQSA+IEIpeyByZXR1cm4gMSB9XHJcblx0XHRcdFx0ZWxzZSB7IHJldHVybiAwIH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0VHlwZS5saXN0Lm1hcCA9IGZ1bmN0aW9uKGwsIGMsIF8peyByZXR1cm4gb2JqX21hcChsLCBjLCBfKSB9XHJcblx0XHRUeXBlLmxpc3QuaW5kZXggPSAxOyAvLyBjaGFuZ2UgdGhpcyB0byAwIGlmIHlvdSB3YW50IG5vbi1sb2dpY2FsLCBub24tbWF0aGVtYXRpY2FsLCBub24tbWF0cml4LCBub24tY29udmVuaWVudCBhcnJheSBub3RhdGlvblxyXG5cdFx0VHlwZS5vYmogPSB7aXM6IGZ1bmN0aW9uKG8peyByZXR1cm4gbz8gKG8gaW5zdGFuY2VvZiBPYmplY3QgJiYgby5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykubWF0Y2goL15cXFtvYmplY3QgKFxcdyspXFxdJC8pWzFdID09PSAnT2JqZWN0JyA6IGZhbHNlIH19XHJcblx0XHRUeXBlLm9iai5wdXQgPSBmdW5jdGlvbihvLCBmLCB2KXsgcmV0dXJuIChvfHx7fSlbZl0gPSB2LCBvIH1cclxuXHRcdFR5cGUub2JqLmhhcyA9IGZ1bmN0aW9uKG8sIGYpeyByZXR1cm4gbyAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgZikgfVxyXG5cdFx0VHlwZS5vYmouZGVsID0gZnVuY3Rpb24obywgayl7XHJcblx0XHRcdGlmKCFvKXsgcmV0dXJuIH1cclxuXHRcdFx0b1trXSA9IG51bGw7XHJcblx0XHRcdGRlbGV0ZSBvW2tdO1xyXG5cdFx0XHRyZXR1cm4gbztcclxuXHRcdH1cclxuXHRcdFR5cGUub2JqLmFzID0gZnVuY3Rpb24obywgZiwgdiwgdSl7IHJldHVybiBvW2ZdID0gb1tmXSB8fCAodSA9PT0gdj8ge30gOiB2KSB9XHJcblx0XHRUeXBlLm9iai5pZnkgPSBmdW5jdGlvbihvKXtcclxuXHRcdFx0aWYob2JqX2lzKG8pKXsgcmV0dXJuIG8gfVxyXG5cdFx0XHR0cnl7byA9IEpTT04ucGFyc2Uobyk7XHJcblx0XHRcdH1jYXRjaChlKXtvPXt9fTtcclxuXHRcdFx0cmV0dXJuIG87XHJcblx0XHR9XHJcblx0XHQ7KGZ1bmN0aW9uKCl7IHZhciB1O1xyXG5cdFx0XHRmdW5jdGlvbiBtYXAodixmKXtcclxuXHRcdFx0XHRpZihvYmpfaGFzKHRoaXMsZikgJiYgdSAhPT0gdGhpc1tmXSl7IHJldHVybiB9XHJcblx0XHRcdFx0dGhpc1tmXSA9IHY7XHJcblx0XHRcdH1cclxuXHRcdFx0VHlwZS5vYmoudG8gPSBmdW5jdGlvbihmcm9tLCB0byl7XHJcblx0XHRcdFx0dG8gPSB0byB8fCB7fTtcclxuXHRcdFx0XHRvYmpfbWFwKGZyb20sIG1hcCwgdG8pO1xyXG5cdFx0XHRcdHJldHVybiB0bztcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdFR5cGUub2JqLmNvcHkgPSBmdW5jdGlvbihvKXsgLy8gYmVjYXVzZSBodHRwOi8vd2ViLmFyY2hpdmUub3JnL3dlYi8yMDE0MDMyODIyNDAyNS9odHRwOi8vanNwZXJmLmNvbS9jbG9uaW5nLWFuLW9iamVjdC8yXHJcblx0XHRcdHJldHVybiAhbz8gbyA6IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobykpOyAvLyBpcyBzaG9ja2luZ2x5IGZhc3RlciB0aGFuIGFueXRoaW5nIGVsc2UsIGFuZCBvdXIgZGF0YSBoYXMgdG8gYmUgYSBzdWJzZXQgb2YgSlNPTiBhbnl3YXlzIVxyXG5cdFx0fVxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRmdW5jdGlvbiBlbXB0eSh2LGkpeyB2YXIgbiA9IHRoaXMubjtcclxuXHRcdFx0XHRpZihuICYmIChpID09PSBuIHx8IChvYmpfaXMobikgJiYgb2JqX2hhcyhuLCBpKSkpKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRpZihpKXsgcmV0dXJuIHRydWUgfVxyXG5cdFx0XHR9XHJcblx0XHRcdFR5cGUub2JqLmVtcHR5ID0gZnVuY3Rpb24obywgbil7XHJcblx0XHRcdFx0aWYoIW8peyByZXR1cm4gdHJ1ZSB9XHJcblx0XHRcdFx0cmV0dXJuIG9ial9tYXAobyxlbXB0eSx7bjpufSk/IGZhbHNlIDogdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0ZnVuY3Rpb24gdChrLHYpe1xyXG5cdFx0XHRcdGlmKDIgPT09IGFyZ3VtZW50cy5sZW5ndGgpe1xyXG5cdFx0XHRcdFx0dC5yID0gdC5yIHx8IHt9O1xyXG5cdFx0XHRcdFx0dC5yW2tdID0gdjtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9IHQuciA9IHQuciB8fCBbXTtcclxuXHRcdFx0XHR0LnIucHVzaChrKTtcclxuXHRcdFx0fTtcclxuXHRcdFx0dmFyIGtleXMgPSBPYmplY3Qua2V5cztcclxuXHRcdFx0VHlwZS5vYmoubWFwID0gZnVuY3Rpb24obCwgYywgXyl7XHJcblx0XHRcdFx0dmFyIHUsIGkgPSAwLCB4LCByLCBsbCwgbGxlLCBmID0gZm5faXMoYyk7XHJcblx0XHRcdFx0dC5yID0gbnVsbDtcclxuXHRcdFx0XHRpZihrZXlzICYmIG9ial9pcyhsKSl7XHJcblx0XHRcdFx0XHRsbCA9IE9iamVjdC5rZXlzKGwpOyBsbGUgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihsaXN0X2lzKGwpIHx8IGxsKXtcclxuXHRcdFx0XHRcdHggPSAobGwgfHwgbCkubGVuZ3RoO1xyXG5cdFx0XHRcdFx0Zm9yKDtpIDwgeDsgaSsrKXtcclxuXHRcdFx0XHRcdFx0dmFyIGlpID0gKGkgKyBUeXBlLmxpc3QuaW5kZXgpO1xyXG5cdFx0XHRcdFx0XHRpZihmKXtcclxuXHRcdFx0XHRcdFx0XHRyID0gbGxlPyBjLmNhbGwoXyB8fCB0aGlzLCBsW2xsW2ldXSwgbGxbaV0sIHQpIDogYy5jYWxsKF8gfHwgdGhpcywgbFtpXSwgaWksIHQpO1xyXG5cdFx0XHRcdFx0XHRcdGlmKHIgIT09IHUpeyByZXR1cm4gciB9XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Ly9pZihUeXBlLnRlc3QuaXMoYyxsW2ldKSl7IHJldHVybiBpaSB9IC8vIHNob3VsZCBpbXBsZW1lbnQgZGVlcCBlcXVhbGl0eSB0ZXN0aW5nIVxyXG5cdFx0XHRcdFx0XHRcdGlmKGMgPT09IGxbbGxlPyBsbFtpXSA6IGldKXsgcmV0dXJuIGxsPyBsbFtpXSA6IGlpIH0gLy8gdXNlIHRoaXMgZm9yIG5vd1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGZvcihpIGluIGwpe1xyXG5cdFx0XHRcdFx0XHRpZihmKXtcclxuXHRcdFx0XHRcdFx0XHRpZihvYmpfaGFzKGwsaSkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0ciA9IF8/IGMuY2FsbChfLCBsW2ldLCBpLCB0KSA6IGMobFtpXSwgaSwgdCk7XHJcblx0XHRcdFx0XHRcdFx0XHRpZihyICE9PSB1KXsgcmV0dXJuIHIgfVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHQvL2lmKGEudGVzdC5pcyhjLGxbaV0pKXsgcmV0dXJuIGkgfSAvLyBzaG91bGQgaW1wbGVtZW50IGRlZXAgZXF1YWxpdHkgdGVzdGluZyFcclxuXHRcdFx0XHRcdFx0XHRpZihjID09PSBsW2ldKXsgcmV0dXJuIGkgfSAvLyB1c2UgdGhpcyBmb3Igbm93XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGY/IHQuciA6IFR5cGUubGlzdC5pbmRleD8gMCA6IC0xO1xyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0VHlwZS50aW1lID0ge307XHJcblx0XHRUeXBlLnRpbWUuaXMgPSBmdW5jdGlvbih0KXsgcmV0dXJuIHQ/IHQgaW5zdGFuY2VvZiBEYXRlIDogKCtuZXcgRGF0ZSgpLmdldFRpbWUoKSkgfVxyXG5cclxuXHRcdHZhciBmbl9pcyA9IFR5cGUuZm4uaXM7XHJcblx0XHR2YXIgbGlzdF9pcyA9IFR5cGUubGlzdC5pcztcclxuXHRcdHZhciBvYmogPSBUeXBlLm9iaiwgb2JqX2lzID0gb2JqLmlzLCBvYmpfaGFzID0gb2JqLmhhcywgb2JqX21hcCA9IG9iai5tYXA7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IFR5cGU7XHJcblx0fSkocmVxdWlyZSwgJy4vdHlwZScpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0Ly8gT24gZXZlbnQgZW1pdHRlciBnZW5lcmljIGphdmFzY3JpcHQgdXRpbGl0eS5cclxuXHRcdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gb250byh0YWcsIGFyZywgYXMpe1xyXG5cdFx0XHRpZighdGFnKXsgcmV0dXJuIHt0bzogb250b30gfVxyXG5cdFx0XHR2YXIgdGFnID0gKHRoaXMudGFnIHx8ICh0aGlzLnRhZyA9IHt9KSlbdGFnXSB8fFxyXG5cdFx0XHQodGhpcy50YWdbdGFnXSA9IHt0YWc6IHRhZywgdG86IG9udG8uXyA9IHtcclxuXHRcdFx0XHRuZXh0OiBmdW5jdGlvbigpe31cclxuXHRcdFx0fX0pO1xyXG5cdFx0XHRpZihhcmcgaW5zdGFuY2VvZiBGdW5jdGlvbil7XHJcblx0XHRcdFx0dmFyIGJlID0ge1xyXG5cdFx0XHRcdFx0b2ZmOiBvbnRvLm9mZiB8fCBcclxuXHRcdFx0XHRcdChvbnRvLm9mZiA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRcdGlmKHRoaXMubmV4dCA9PT0gb250by5fLm5leHQpeyByZXR1cm4gITAgfVxyXG5cdFx0XHRcdFx0XHRpZih0aGlzID09PSB0aGlzLnRoZS5sYXN0KXtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnRoZS5sYXN0ID0gdGhpcy5iYWNrO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHRoaXMudG8uYmFjayA9IHRoaXMuYmFjaztcclxuXHRcdFx0XHRcdFx0dGhpcy5uZXh0ID0gb250by5fLm5leHQ7XHJcblx0XHRcdFx0XHRcdHRoaXMuYmFjay50byA9IHRoaXMudG87XHJcblx0XHRcdFx0XHR9KSxcclxuXHRcdFx0XHRcdHRvOiBvbnRvLl8sXHJcblx0XHRcdFx0XHRuZXh0OiBhcmcsXHJcblx0XHRcdFx0XHR0aGU6IHRhZyxcclxuXHRcdFx0XHRcdG9uOiB0aGlzLFxyXG5cdFx0XHRcdFx0YXM6IGFzLFxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0KGJlLmJhY2sgPSB0YWcubGFzdCB8fCB0YWcpLnRvID0gYmU7XHJcblx0XHRcdFx0cmV0dXJuIHRhZy5sYXN0ID0gYmU7XHJcblx0XHRcdH1cclxuXHRcdFx0KHRhZyA9IHRhZy50bykubmV4dChhcmcpO1xyXG5cdFx0XHRyZXR1cm4gdGFnO1xyXG5cdFx0fTtcclxuXHR9KShyZXF1aXJlLCAnLi9vbnRvJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHQvLyBUT0RPOiBOZWVkcyB0byBiZSByZWRvbmUuXHJcblx0XHR2YXIgT24gPSByZXF1aXJlKCcuL29udG8nKTtcclxuXHJcblx0XHRmdW5jdGlvbiBDaGFpbihjcmVhdGUsIG9wdCl7XHJcblx0XHRcdG9wdCA9IG9wdCB8fCB7fTtcclxuXHRcdFx0b3B0LmlkID0gb3B0LmlkIHx8ICcjJztcclxuXHRcdFx0b3B0LnJpZCA9IG9wdC5yaWQgfHwgJ0AnO1xyXG5cdFx0XHRvcHQudXVpZCA9IG9wdC51dWlkIHx8IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0cmV0dXJuICgrbmV3IERhdGUoKSkgKyBNYXRoLnJhbmRvbSgpO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHR2YXIgb24gPSBPbjsvL09uLnNjb3BlKCk7XHJcblxyXG5cdFx0XHRvbi5zdHVuID0gZnVuY3Rpb24oY2hhaW4pe1xyXG5cdFx0XHRcdHZhciBzdHVuID0gZnVuY3Rpb24oZXYpe1xyXG5cdFx0XHRcdFx0aWYoc3R1bi5vZmYgJiYgc3R1biA9PT0gdGhpcy5zdHVuKXtcclxuXHRcdFx0XHRcdFx0dGhpcy5zdHVuID0gbnVsbDtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYob24uc3R1bi5za2lwKXtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYoZXYpe1xyXG5cdFx0XHRcdFx0XHRldi5jYiA9IGV2LmZuO1xyXG5cdFx0XHRcdFx0XHRldi5vZmYoKTtcclxuXHRcdFx0XHRcdFx0cmVzLnF1ZXVlLnB1c2goZXYpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fSwgcmVzID0gc3R1bi5yZXMgPSBmdW5jdGlvbih0bXAsIGFzKXtcclxuXHRcdFx0XHRcdGlmKHN0dW4ub2ZmKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdGlmKHRtcCBpbnN0YW5jZW9mIEZ1bmN0aW9uKXtcclxuXHRcdFx0XHRcdFx0b24uc3R1bi5za2lwID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0dG1wLmNhbGwoYXMpO1xyXG5cdFx0XHRcdFx0XHRvbi5zdHVuLnNraXAgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0c3R1bi5vZmYgPSB0cnVlO1xyXG5cdFx0XHRcdFx0dmFyIGkgPSAwLCBxID0gcmVzLnF1ZXVlLCBsID0gcS5sZW5ndGgsIGFjdDtcclxuXHRcdFx0XHRcdHJlcy5xdWV1ZSA9IFtdO1xyXG5cdFx0XHRcdFx0aWYoc3R1biA9PT0gYXQuc3R1bil7XHJcblx0XHRcdFx0XHRcdGF0LnN0dW4gPSBudWxsO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Zm9yKGk7IGkgPCBsOyBpKyspeyBhY3QgPSBxW2ldO1xyXG5cdFx0XHRcdFx0XHRhY3QuZm4gPSBhY3QuY2I7XHJcblx0XHRcdFx0XHRcdGFjdC5jYiA9IG51bGw7XHJcblx0XHRcdFx0XHRcdG9uLnN0dW4uc2tpcCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdGFjdC5jdHgub24oYWN0LnRhZywgYWN0LmZuLCBhY3QpO1xyXG5cdFx0XHRcdFx0XHRvbi5zdHVuLnNraXAgPSBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LCBhdCA9IGNoYWluLl87XHJcblx0XHRcdFx0cmVzLmJhY2sgPSBhdC5zdHVuIHx8IChhdC5iYWNrfHx7Xzp7fX0pLl8uc3R1bjtcclxuXHRcdFx0XHRpZihyZXMuYmFjayl7XHJcblx0XHRcdFx0XHRyZXMuYmFjay5uZXh0ID0gc3R1bjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmVzLnF1ZXVlID0gW107XHJcblx0XHRcdFx0YXQuc3R1biA9IHN0dW47IFxyXG5cdFx0XHRcdHJldHVybiByZXM7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIG9uO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHRcdHJldHVybjtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHRcdHZhciBhc2sgPSBvbi5hc2sgPSBmdW5jdGlvbihjYiwgYXMpe1xyXG5cdFx0XHRcdGlmKCFhc2sub24peyBhc2sub24gPSBPbi5zY29wZSgpIH1cclxuXHRcdFx0XHR2YXIgaWQgPSBvcHQudXVpZCgpO1xyXG5cdFx0XHRcdGlmKGNiKXsgYXNrLm9uKGlkLCBjYiwgYXMpIH1cclxuXHRcdFx0XHRyZXR1cm4gaWQ7XHJcblx0XHRcdH1cclxuXHRcdFx0YXNrLl8gPSBvcHQuaWQ7XHJcblx0XHRcdG9uLmFjayA9IGZ1bmN0aW9uKGF0LCByZXBseSl7XHJcblx0XHRcdFx0aWYoIWF0IHx8ICFyZXBseSB8fCAhYXNrLm9uKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgaWQgPSBhdFtvcHQuaWRdIHx8IGF0O1xyXG5cdFx0XHRcdGlmKCFhc2sub25zW2lkXSl7IHJldHVybiB9XHJcblx0XHRcdFx0YXNrLm9uKGlkLCByZXBseSk7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0b24uYWNrLl8gPSBvcHQucmlkO1xyXG5cclxuXHJcblx0XHRcdHJldHVybiBvbjtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHRcdHJldHVybjtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRvbi5vbignZXZlbnQnLCBmdW5jdGlvbiBldmVudChhY3Qpe1xyXG5cdFx0XHRcdHZhciBsYXN0ID0gYWN0Lm9uLmxhc3QsIHRtcDtcclxuXHRcdFx0XHRpZignaW4nID09PSBhY3QudGFnICYmIEd1bi5jaGFpbi5jaGFpbi5pbnB1dCAhPT0gYWN0LmZuKXsgLy8gVE9ETzogQlVHISBHdW4gaXMgbm90IGF2YWlsYWJsZSBpbiB0aGlzIG1vZHVsZS5cclxuXHRcdFx0XHRcdGlmKCh0bXAgPSBhY3QuY3R4KSAmJiB0bXAuc3R1bil7XHJcblx0XHRcdFx0XHRcdGlmKHRtcC5zdHVuKGFjdCkpe1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZighbGFzdCl7IHJldHVybiB9XHJcblx0XHRcdFx0aWYoYWN0Lm9uLm1hcCl7XHJcblx0XHRcdFx0XHR2YXIgbWFwID0gYWN0Lm9uLm1hcCwgdjtcclxuXHRcdFx0XHRcdGZvcih2YXIgZiBpbiBtYXApeyB2ID0gbWFwW2ZdO1xyXG5cdFx0XHRcdFx0XHRpZih2KXtcclxuXHRcdFx0XHRcdFx0XHRlbWl0KHYsIGFjdCwgZXZlbnQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvKlxyXG5cdFx0XHRcdFx0R3VuLm9iai5tYXAoYWN0Lm9uLm1hcCwgZnVuY3Rpb24odixmKXsgLy8gVE9ETzogQlVHISBHdW4gaXMgbm90IGF2YWlsYWJsZSBpbiB0aGlzIG1vZHVsZS5cclxuXHRcdFx0XHRcdFx0Ly9lbWl0KHZbMF0sIGFjdCwgZXZlbnQsIHZbMV0pOyAvLyBiZWxvdyBlbmFibGVzIG1vcmUgY29udHJvbFxyXG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiYm9vb29vb29vXCIsIGYsdik7XHJcblx0XHRcdFx0XHRcdGVtaXQodiwgYWN0LCBldmVudCk7XHJcblx0XHRcdFx0XHRcdC8vZW1pdCh2WzFdLCBhY3QsIGV2ZW50LCB2WzJdKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0Ki9cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0ZW1pdChsYXN0LCBhY3QsIGV2ZW50KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYobGFzdCAhPT0gYWN0Lm9uLmxhc3Qpe1xyXG5cdFx0XHRcdFx0ZXZlbnQoYWN0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRmdW5jdGlvbiBlbWl0KGxhc3QsIGFjdCwgZXZlbnQsIGV2KXtcclxuXHRcdFx0XHRpZihsYXN0IGluc3RhbmNlb2YgQXJyYXkpe1xyXG5cdFx0XHRcdFx0YWN0LmZuLmFwcGx5KGFjdC5hcywgbGFzdC5jb25jYXQoZXZ8fGFjdCkpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRhY3QuZm4uY2FsbChhY3QuYXMsIGxhc3QsIGV2fHxhY3QpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Lypvbi5vbignZW1pdCcsIGZ1bmN0aW9uKGV2KXtcclxuXHRcdFx0XHRpZihldi5vbi5tYXApe1xyXG5cdFx0XHRcdFx0dmFyIGlkID0gZXYuYXJnLnZpYS5ndW4uXy5pZCArIGV2LmFyZy5nZXQ7XHJcblx0XHRcdFx0XHQvL1xyXG5cdFx0XHRcdFx0Ly9ldi5pZCA9IGV2LmlkIHx8IEd1bi50ZXh0LnJhbmRvbSg2KTtcclxuXHRcdFx0XHRcdC8vZXYub24ubWFwW2V2LmlkXSA9IGV2LmFyZztcclxuXHRcdFx0XHRcdC8vZXYucHJveHkgPSBldi5hcmdbMV07XHJcblx0XHRcdFx0XHQvL2V2LmFyZyA9IGV2LmFyZ1swXTtcclxuXHRcdFx0XHRcdC8vIGJlbG93IGdpdmVzIG1vcmUgY29udHJvbC5cclxuXHRcdFx0XHRcdGV2Lm9uLm1hcFtpZF0gPSBldi5hcmc7XHJcblx0XHRcdFx0XHQvL2V2LnByb3h5ID0gZXYuYXJnWzJdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRldi5vbi5sYXN0ID0gZXYuYXJnO1xyXG5cdFx0XHR9KTsqL1xyXG5cclxuXHRcdFx0b24ub24oJ2VtaXQnLCBmdW5jdGlvbihldil7XHJcblx0XHRcdFx0dmFyIGd1biA9IGV2LmFyZy5ndW47XHJcblx0XHRcdFx0aWYoJ2luJyA9PT0gZXYudGFnICYmIGd1biAmJiAhZ3VuLl8uc291bCl7IC8vIFRPRE86IEJVRyEgU291bCBzaG91bGQgYmUgYXZhaWxhYmxlLiBDdXJyZW50bHkgbm90IHVzaW5nIGl0IHRob3VnaCwgYnV0IHNob3VsZCBlbmFibGUgaXQgKGNoZWNrIGZvciBzaWRlIGVmZmVjdHMgaWYgbWFkZSBhdmFpbGFibGUpLlxyXG5cdFx0XHRcdFx0KGV2Lm9uLm1hcCA9IGV2Lm9uLm1hcCB8fCB7fSlbZ3VuLl8uaWQgfHwgKGd1bi5fLmlkID0gTWF0aC5yYW5kb20oKSldID0gZXYuYXJnO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRldi5vbi5sYXN0ID0gZXYuYXJnO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG9uO1xyXG5cdFx0fVxyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBDaGFpbjtcclxuXHR9KShyZXF1aXJlLCAnLi9vbmlmeScpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0Ly8gR2VuZXJpYyBqYXZhc2NyaXB0IHNjaGVkdWxlciB1dGlsaXR5LlxyXG5cdFx0dmFyIFR5cGUgPSByZXF1aXJlKCcuL3R5cGUnKTtcclxuXHRcdGZ1bmN0aW9uIHMoc3RhdGUsIGNiLCB0aW1lKXsgLy8gbWF5YmUgdXNlIGxydS1jYWNoZT9cclxuXHRcdFx0cy50aW1lID0gdGltZSB8fCBHdW4udGltZS5pcztcclxuXHRcdFx0cy53YWl0aW5nLnB1c2goe3doZW46IHN0YXRlLCBldmVudDogY2IgfHwgZnVuY3Rpb24oKXt9fSk7XHJcblx0XHRcdGlmKHMuc29vbmVzdCA8IHN0YXRlKXsgcmV0dXJuIH1cclxuXHRcdFx0cy5zZXQoc3RhdGUpO1xyXG5cdFx0fVxyXG5cdFx0cy53YWl0aW5nID0gW107XHJcblx0XHRzLnNvb25lc3QgPSBJbmZpbml0eTtcclxuXHRcdHMuc29ydCA9IFR5cGUubGlzdC5zb3J0KCd3aGVuJyk7XHJcblx0XHRzLnNldCA9IGZ1bmN0aW9uKGZ1dHVyZSl7XHJcblx0XHRcdGlmKEluZmluaXR5IDw9IChzLnNvb25lc3QgPSBmdXR1cmUpKXsgcmV0dXJuIH1cclxuXHRcdFx0dmFyIG5vdyA9IHMudGltZSgpO1xyXG5cdFx0XHRmdXR1cmUgPSAoZnV0dXJlIDw9IG5vdyk/IDAgOiAoZnV0dXJlIC0gbm93KTtcclxuXHRcdFx0Y2xlYXJUaW1lb3V0KHMuaWQpO1xyXG5cdFx0XHRzLmlkID0gc2V0VGltZW91dChzLmNoZWNrLCBmdXR1cmUpO1xyXG5cdFx0fVxyXG5cdFx0cy5lYWNoID0gZnVuY3Rpb24od2FpdCwgaSwgbWFwKXtcclxuXHRcdFx0dmFyIGN0eCA9IHRoaXM7XHJcblx0XHRcdGlmKCF3YWl0KXsgcmV0dXJuIH1cclxuXHRcdFx0aWYod2FpdC53aGVuIDw9IGN0eC5ub3cpe1xyXG5cdFx0XHRcdGlmKHdhaXQuZXZlbnQgaW5zdGFuY2VvZiBGdW5jdGlvbil7XHJcblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IHdhaXQuZXZlbnQoKSB9LDApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjdHguc29vbmVzdCA9IChjdHguc29vbmVzdCA8IHdhaXQud2hlbik/IGN0eC5zb29uZXN0IDogd2FpdC53aGVuO1xyXG5cdFx0XHRcdG1hcCh3YWl0KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cy5jaGVjayA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBjdHggPSB7bm93OiBzLnRpbWUoKSwgc29vbmVzdDogSW5maW5pdHl9O1xyXG5cdFx0XHRzLndhaXRpbmcuc29ydChzLnNvcnQpO1xyXG5cdFx0XHRzLndhaXRpbmcgPSBUeXBlLmxpc3QubWFwKHMud2FpdGluZywgcy5lYWNoLCBjdHgpIHx8IFtdO1xyXG5cdFx0XHRzLnNldChjdHguc29vbmVzdCk7XHJcblx0XHR9XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IHM7XHJcblx0fSkocmVxdWlyZSwgJy4vc2NoZWR1bGUnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdC8qIEJhc2VkIG9uIHRoZSBIeXBvdGhldGljYWwgQW1uZXNpYSBNYWNoaW5lIHRob3VnaHQgZXhwZXJpbWVudCAqL1xyXG5cdFx0ZnVuY3Rpb24gSEFNKG1hY2hpbmVTdGF0ZSwgaW5jb21pbmdTdGF0ZSwgY3VycmVudFN0YXRlLCBpbmNvbWluZ1ZhbHVlLCBjdXJyZW50VmFsdWUpe1xyXG5cdFx0XHRpZihtYWNoaW5lU3RhdGUgPCBpbmNvbWluZ1N0YXRlKXtcclxuXHRcdFx0XHRyZXR1cm4ge2RlZmVyOiB0cnVlfTsgLy8gdGhlIGluY29taW5nIHZhbHVlIGlzIG91dHNpZGUgdGhlIGJvdW5kYXJ5IG9mIHRoZSBtYWNoaW5lJ3Mgc3RhdGUsIGl0IG11c3QgYmUgcmVwcm9jZXNzZWQgaW4gYW5vdGhlciBzdGF0ZS5cclxuXHRcdFx0fVxyXG5cdFx0XHRpZihpbmNvbWluZ1N0YXRlIDwgY3VycmVudFN0YXRlKXtcclxuXHRcdFx0XHRyZXR1cm4ge2hpc3RvcmljYWw6IHRydWV9OyAvLyB0aGUgaW5jb21pbmcgdmFsdWUgaXMgd2l0aGluIHRoZSBib3VuZGFyeSBvZiB0aGUgbWFjaGluZSdzIHN0YXRlLCBidXQgbm90IHdpdGhpbiB0aGUgcmFuZ2UuXHJcblxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGN1cnJlbnRTdGF0ZSA8IGluY29taW5nU3RhdGUpe1xyXG5cdFx0XHRcdHJldHVybiB7Y29udmVyZ2U6IHRydWUsIGluY29taW5nOiB0cnVlfTsgLy8gdGhlIGluY29taW5nIHZhbHVlIGlzIHdpdGhpbiBib3RoIHRoZSBib3VuZGFyeSBhbmQgdGhlIHJhbmdlIG9mIHRoZSBtYWNoaW5lJ3Mgc3RhdGUuXHJcblxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGluY29taW5nU3RhdGUgPT09IGN1cnJlbnRTdGF0ZSl7XHJcblx0XHRcdFx0aWYoTGV4aWNhbChpbmNvbWluZ1ZhbHVlKSA9PT0gTGV4aWNhbChjdXJyZW50VmFsdWUpKXsgLy8gTm90ZTogd2hpbGUgdGhlc2UgYXJlIHByYWN0aWNhbGx5IHRoZSBzYW1lLCB0aGUgZGVsdGFzIGNvdWxkIGJlIHRlY2huaWNhbGx5IGRpZmZlcmVudFxyXG5cdFx0XHRcdFx0cmV0dXJuIHtzdGF0ZTogdHJ1ZX07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8qXHJcblx0XHRcdFx0XHRUaGUgZm9sbG93aW5nIGlzIGEgbmFpdmUgaW1wbGVtZW50YXRpb24sIGJ1dCB3aWxsIGFsd2F5cyB3b3JrLlxyXG5cdFx0XHRcdFx0TmV2ZXIgY2hhbmdlIGl0IHVubGVzcyB5b3UgaGF2ZSBzcGVjaWZpYyBuZWVkcyB0aGF0IGFic29sdXRlbHkgcmVxdWlyZSBpdC5cclxuXHRcdFx0XHRcdElmIGNoYW5nZWQsIHlvdXIgZGF0YSB3aWxsIGRpdmVyZ2UgdW5sZXNzIHlvdSBndWFyYW50ZWUgZXZlcnkgcGVlcidzIGFsZ29yaXRobSBoYXMgYWxzbyBiZWVuIGNoYW5nZWQgdG8gYmUgdGhlIHNhbWUuXHJcblx0XHRcdFx0XHRBcyBhIHJlc3VsdCwgaXQgaXMgaGlnaGx5IGRpc2NvdXJhZ2VkIHRvIG1vZGlmeSBkZXNwaXRlIHRoZSBmYWN0IHRoYXQgaXQgaXMgbmFpdmUsXHJcblx0XHRcdFx0XHRiZWNhdXNlIGNvbnZlcmdlbmNlIChkYXRhIGludGVncml0eSkgaXMgZ2VuZXJhbGx5IG1vcmUgaW1wb3J0YW50LlxyXG5cdFx0XHRcdFx0QW55IGRpZmZlcmVuY2UgaW4gdGhpcyBhbGdvcml0aG0gbXVzdCBiZSBnaXZlbiBhIG5ldyBhbmQgZGlmZmVyZW50IG5hbWUuXHJcblx0XHRcdFx0Ki9cclxuXHRcdFx0XHRpZihMZXhpY2FsKGluY29taW5nVmFsdWUpIDwgTGV4aWNhbChjdXJyZW50VmFsdWUpKXsgLy8gTGV4aWNhbCBvbmx5IHdvcmtzIG9uIHNpbXBsZSB2YWx1ZSB0eXBlcyFcclxuXHRcdFx0XHRcdHJldHVybiB7Y29udmVyZ2U6IHRydWUsIGN1cnJlbnQ6IHRydWV9O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihMZXhpY2FsKGN1cnJlbnRWYWx1ZSkgPCBMZXhpY2FsKGluY29taW5nVmFsdWUpKXsgLy8gTGV4aWNhbCBvbmx5IHdvcmtzIG9uIHNpbXBsZSB2YWx1ZSB0eXBlcyFcclxuXHRcdFx0XHRcdHJldHVybiB7Y29udmVyZ2U6IHRydWUsIGluY29taW5nOiB0cnVlfTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHtlcnI6IFwiSW52YWxpZCBDUkRUIERhdGE6IFwiKyBpbmNvbWluZ1ZhbHVlICtcIiB0byBcIisgY3VycmVudFZhbHVlICtcIiBhdCBcIisgaW5jb21pbmdTdGF0ZSArXCIgdG8gXCIrIGN1cnJlbnRTdGF0ZSArXCIhXCJ9O1xyXG5cdFx0fVxyXG5cdFx0aWYodHlwZW9mIEpTT04gPT09ICd1bmRlZmluZWQnKXtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFxyXG5cdFx0XHRcdCdKU09OIGlzIG5vdCBpbmNsdWRlZCBpbiB0aGlzIGJyb3dzZXIuIFBsZWFzZSBsb2FkIGl0IGZpcnN0OiAnICtcclxuXHRcdFx0XHQnYWpheC5jZG5qcy5jb20vYWpheC9saWJzL2pzb24yLzIwMTEwMjIzL2pzb24yLmpzJ1xyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIExleGljYWwgPSBKU09OLnN0cmluZ2lmeSwgdW5kZWZpbmVkO1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBIQU07XHJcblx0fSkocmVxdWlyZSwgJy4vSEFNJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgVHlwZSA9IHJlcXVpcmUoJy4vdHlwZScpO1xyXG5cdFx0dmFyIFZhbCA9IHt9O1xyXG5cdFx0VmFsLmlzID0gZnVuY3Rpb24odil7IC8vIFZhbGlkIHZhbHVlcyBhcmUgYSBzdWJzZXQgb2YgSlNPTjogbnVsbCwgYmluYXJ5LCBudW1iZXIgKCFJbmZpbml0eSksIHRleHQsIG9yIGEgc291bCByZWxhdGlvbi4gQXJyYXlzIG5lZWQgc3BlY2lhbCBhbGdvcml0aG1zIHRvIGhhbmRsZSBjb25jdXJyZW5jeSwgc28gdGhleSBhcmUgbm90IHN1cHBvcnRlZCBkaXJlY3RseS4gVXNlIGFuIGV4dGVuc2lvbiB0aGF0IHN1cHBvcnRzIHRoZW0gaWYgbmVlZGVkIGJ1dCByZXNlYXJjaCB0aGVpciBwcm9ibGVtcyBmaXJzdC5cclxuXHRcdFx0aWYodiA9PT0gdSl7IHJldHVybiBmYWxzZSB9XHJcblx0XHRcdGlmKHYgPT09IG51bGwpeyByZXR1cm4gdHJ1ZSB9IC8vIFwiZGVsZXRlc1wiLCBudWxsaW5nIG91dCBmaWVsZHMuXHJcblx0XHRcdGlmKHYgPT09IEluZmluaXR5KXsgcmV0dXJuIGZhbHNlIH0gLy8gd2Ugd2FudCB0aGlzIHRvIGJlLCBidXQgSlNPTiBkb2VzIG5vdCBzdXBwb3J0IGl0LCBzYWQgZmFjZS5cclxuXHRcdFx0aWYodGV4dF9pcyh2KSAvLyBieSBcInRleHRcIiB3ZSBtZWFuIHN0cmluZ3MuXHJcblx0XHRcdHx8IGJpX2lzKHYpIC8vIGJ5IFwiYmluYXJ5XCIgd2UgbWVhbiBib29sZWFuLlxyXG5cdFx0XHR8fCBudW1faXModikpeyAvLyBieSBcIm51bWJlclwiIHdlIG1lYW4gaW50ZWdlcnMgb3IgZGVjaW1hbHMuIFxyXG5cdFx0XHRcdHJldHVybiB0cnVlOyAvLyBzaW1wbGUgdmFsdWVzIGFyZSB2YWxpZC5cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gVmFsLnJlbC5pcyh2KSB8fCBmYWxzZTsgLy8gaXMgdGhlIHZhbHVlIGEgc291bCByZWxhdGlvbj8gVGhlbiBpdCBpcyB2YWxpZCBhbmQgcmV0dXJuIGl0LiBJZiBub3QsIGV2ZXJ5dGhpbmcgZWxzZSByZW1haW5pbmcgaXMgYW4gaW52YWxpZCBkYXRhIHR5cGUuIEN1c3RvbSBleHRlbnNpb25zIGNhbiBiZSBidWlsdCBvbiB0b3Agb2YgdGhlc2UgcHJpbWl0aXZlcyB0byBzdXBwb3J0IG90aGVyIHR5cGVzLlxyXG5cdFx0fVxyXG5cdFx0VmFsLnJlbCA9IHtfOiAnIyd9O1xyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRWYWwucmVsLmlzID0gZnVuY3Rpb24odil7IC8vIHRoaXMgZGVmaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhIHNvdWwgcmVsYXRpb24gb3Igbm90LCB0aGV5IGxvb2sgbGlrZSB0aGlzOiB7JyMnOiAnVVVJRCd9XHJcblx0XHRcdFx0aWYodiAmJiB2W3JlbF9dICYmICF2Ll8gJiYgb2JqX2lzKHYpKXsgLy8gbXVzdCBiZSBhbiBvYmplY3QuXHJcblx0XHRcdFx0XHR2YXIgbyA9IHt9O1xyXG5cdFx0XHRcdFx0b2JqX21hcCh2LCBtYXAsIG8pO1xyXG5cdFx0XHRcdFx0aWYoby5pZCl7IC8vIGEgdmFsaWQgaWQgd2FzIGZvdW5kLlxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gby5pZDsgLy8geWF5ISBSZXR1cm4gaXQuXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZTsgLy8gdGhlIHZhbHVlIHdhcyBub3QgYSB2YWxpZCBzb3VsIHJlbGF0aW9uLlxyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcChzLCBmKXsgdmFyIG8gPSB0aGlzOyAvLyBtYXAgb3ZlciB0aGUgb2JqZWN0Li4uXHJcblx0XHRcdFx0aWYoby5pZCl7IHJldHVybiBvLmlkID0gZmFsc2UgfSAvLyBpZiBJRCBpcyBhbHJlYWR5IGRlZmluZWQgQU5EIHdlJ3JlIHN0aWxsIGxvb3BpbmcgdGhyb3VnaCB0aGUgb2JqZWN0LCBpdCBpcyBjb25zaWRlcmVkIGludmFsaWQuXHJcblx0XHRcdFx0aWYoZiA9PSByZWxfICYmIHRleHRfaXMocykpeyAvLyB0aGUgZmllbGQgc2hvdWxkIGJlICcjJyBhbmQgaGF2ZSBhIHRleHQgdmFsdWUuXHJcblx0XHRcdFx0XHRvLmlkID0gczsgLy8gd2UgZm91bmQgdGhlIHNvdWwhXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiBvLmlkID0gZmFsc2U7IC8vIGlmIHRoZXJlIGV4aXN0cyBhbnl0aGluZyBlbHNlIG9uIHRoZSBvYmplY3QgdGhhdCBpc24ndCB0aGUgc291bCwgdGhlbiBpdCBpcyBjb25zaWRlcmVkIGludmFsaWQuXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0VmFsLnJlbC5pZnkgPSBmdW5jdGlvbih0KXsgcmV0dXJuIG9ial9wdXQoe30sIHJlbF8sIHQpIH0gLy8gY29udmVydCBhIHNvdWwgaW50byBhIHJlbGF0aW9uIGFuZCByZXR1cm4gaXQuXHJcblx0XHR2YXIgcmVsXyA9IFZhbC5yZWwuXywgdTtcclxuXHRcdHZhciBiaV9pcyA9IFR5cGUuYmkuaXM7XHJcblx0XHR2YXIgbnVtX2lzID0gVHlwZS5udW0uaXM7XHJcblx0XHR2YXIgdGV4dF9pcyA9IFR5cGUudGV4dC5pcztcclxuXHRcdHZhciBvYmogPSBUeXBlLm9iaiwgb2JqX2lzID0gb2JqLmlzLCBvYmpfcHV0ID0gb2JqLnB1dCwgb2JqX21hcCA9IG9iai5tYXA7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IFZhbDtcclxuXHR9KShyZXF1aXJlLCAnLi92YWwnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBUeXBlID0gcmVxdWlyZSgnLi90eXBlJyk7XHJcblx0XHR2YXIgVmFsID0gcmVxdWlyZSgnLi92YWwnKTtcclxuXHRcdHZhciBOb2RlID0ge186ICdfJ307XHJcblx0XHROb2RlLnNvdWwgPSBmdW5jdGlvbihuLCBvKXsgcmV0dXJuIChuICYmIG4uXyAmJiBuLl9bbyB8fCBzb3VsX10pIH0gLy8gY29udmVuaWVuY2UgZnVuY3Rpb24gdG8gY2hlY2sgdG8gc2VlIGlmIHRoZXJlIGlzIGEgc291bCBvbiBhIG5vZGUgYW5kIHJldHVybiBpdC5cclxuXHRcdE5vZGUuc291bC5pZnkgPSBmdW5jdGlvbihuLCBvKXsgLy8gcHV0IGEgc291bCBvbiBhbiBvYmplY3QuXHJcblx0XHRcdG8gPSAodHlwZW9mIG8gPT09ICdzdHJpbmcnKT8ge3NvdWw6IG99IDogbyB8fCB7fTtcclxuXHRcdFx0biA9IG4gfHwge307IC8vIG1ha2Ugc3VyZSBpdCBleGlzdHMuXHJcblx0XHRcdG4uXyA9IG4uXyB8fCB7fTsgLy8gbWFrZSBzdXJlIG1ldGEgZXhpc3RzLlxyXG5cdFx0XHRuLl9bc291bF9dID0gby5zb3VsIHx8IG4uX1tzb3VsX10gfHwgdGV4dF9yYW5kb20oKTsgLy8gcHV0IHRoZSBzb3VsIG9uIGl0LlxyXG5cdFx0XHRyZXR1cm4gbjtcclxuXHRcdH1cclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0Tm9kZS5pcyA9IGZ1bmN0aW9uKG4sIGNiLCBhcyl7IHZhciBzOyAvLyBjaGVja3MgdG8gc2VlIGlmIGFuIG9iamVjdCBpcyBhIHZhbGlkIG5vZGUuXHJcblx0XHRcdFx0aWYoIW9ial9pcyhuKSl7IHJldHVybiBmYWxzZSB9IC8vIG11c3QgYmUgYW4gb2JqZWN0LlxyXG5cdFx0XHRcdGlmKHMgPSBOb2RlLnNvdWwobikpeyAvLyBtdXN0IGhhdmUgYSBzb3VsIG9uIGl0LlxyXG5cdFx0XHRcdFx0cmV0dXJuICFvYmpfbWFwKG4sIG1hcCwge2FzOmFzLGNiOmNiLHM6cyxuOm59KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlOyAvLyBub3BlISBUaGlzIHdhcyBub3QgYSB2YWxpZCBub2RlLlxyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcCh2LCBmKXsgLy8gd2UgaW52ZXJ0IHRoaXMgYmVjYXVzZSB0aGUgd2F5IHdlIGNoZWNrIGZvciB0aGlzIGlzIHZpYSBhIG5lZ2F0aW9uLlxyXG5cdFx0XHRcdGlmKGYgPT09IE5vZGUuXyl7IHJldHVybiB9IC8vIHNraXAgb3ZlciB0aGUgbWV0YWRhdGEuXHJcblx0XHRcdFx0aWYoIVZhbC5pcyh2KSl7IHJldHVybiB0cnVlIH0gLy8gaXQgaXMgdHJ1ZSB0aGF0IHRoaXMgaXMgYW4gaW52YWxpZCBub2RlLlxyXG5cdFx0XHRcdGlmKHRoaXMuY2IpeyB0aGlzLmNiLmNhbGwodGhpcy5hcywgdiwgZiwgdGhpcy5uLCB0aGlzLnMpIH0gLy8gb3B0aW9uYWxseSBjYWxsYmFjayBlYWNoIGZpZWxkL3ZhbHVlLlxyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHROb2RlLmlmeSA9IGZ1bmN0aW9uKG9iaiwgbywgYXMpeyAvLyByZXR1cm5zIGEgbm9kZSBmcm9tIGEgc2hhbGxvdyBvYmplY3QuXHJcblx0XHRcdFx0aWYoIW8peyBvID0ge30gfVxyXG5cdFx0XHRcdGVsc2UgaWYodHlwZW9mIG8gPT09ICdzdHJpbmcnKXsgbyA9IHtzb3VsOiBvfSB9XHJcblx0XHRcdFx0ZWxzZSBpZihvIGluc3RhbmNlb2YgRnVuY3Rpb24peyBvID0ge21hcDogb30gfVxyXG5cdFx0XHRcdGlmKG8ubWFwKXsgby5ub2RlID0gby5tYXAuY2FsbChhcywgb2JqLCB1LCBvLm5vZGUgfHwge30pIH1cclxuXHRcdFx0XHRpZihvLm5vZGUgPSBOb2RlLnNvdWwuaWZ5KG8ubm9kZSB8fCB7fSwgbykpe1xyXG5cdFx0XHRcdFx0b2JqX21hcChvYmosIG1hcCwge286byxhczphc30pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gby5ub2RlOyAvLyBUaGlzIHdpbGwgb25seSBiZSBhIHZhbGlkIG5vZGUgaWYgdGhlIG9iamVjdCB3YXNuJ3QgYWxyZWFkeSBkZWVwIVxyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcCh2LCBmKXsgdmFyIG8gPSB0aGlzLm8sIHRtcCwgdTsgLy8gaXRlcmF0ZSBvdmVyIGVhY2ggZmllbGQvdmFsdWUuXHJcblx0XHRcdFx0aWYoby5tYXApe1xyXG5cdFx0XHRcdFx0dG1wID0gby5tYXAuY2FsbCh0aGlzLmFzLCB2LCAnJytmLCBvLm5vZGUpO1xyXG5cdFx0XHRcdFx0aWYodSA9PT0gdG1wKXtcclxuXHRcdFx0XHRcdFx0b2JqX2RlbChvLm5vZGUsIGYpO1xyXG5cdFx0XHRcdFx0fSBlbHNlXHJcblx0XHRcdFx0XHRpZihvLm5vZGUpeyBvLm5vZGVbZl0gPSB0bXAgfVxyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihWYWwuaXModikpe1xyXG5cdFx0XHRcdFx0by5ub2RlW2ZdID0gdjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblx0XHR2YXIgb2JqID0gVHlwZS5vYmosIG9ial9pcyA9IG9iai5pcywgb2JqX2RlbCA9IG9iai5kZWwsIG9ial9tYXAgPSBvYmoubWFwO1xyXG5cdFx0dmFyIHRleHQgPSBUeXBlLnRleHQsIHRleHRfcmFuZG9tID0gdGV4dC5yYW5kb207XHJcblx0XHR2YXIgc291bF8gPSBWYWwucmVsLl87XHJcblx0XHR2YXIgdTtcclxuXHRcdG1vZHVsZS5leHBvcnRzID0gTm9kZTtcclxuXHR9KShyZXF1aXJlLCAnLi9ub2RlJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgVHlwZSA9IHJlcXVpcmUoJy4vdHlwZScpO1xyXG5cdFx0dmFyIE5vZGUgPSByZXF1aXJlKCcuL25vZGUnKTtcclxuXHRcdGZ1bmN0aW9uIFN0YXRlKCl7XHJcblx0XHRcdHZhciB0O1xyXG5cdFx0XHRpZihwZXJmKXtcclxuXHRcdFx0XHR0ID0gc3RhcnQgKyBwZXJmLm5vdygpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHQgPSB0aW1lKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYobGFzdCA8IHQpe1xyXG5cdFx0XHRcdHJldHVybiBOID0gMCwgbGFzdCA9IHQgKyBTdGF0ZS5kcmlmdDtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gbGFzdCA9IHQgKyAoKE4gKz0gMSkgLyBEKSArIFN0YXRlLmRyaWZ0O1xyXG5cdFx0fVxyXG5cdFx0dmFyIHRpbWUgPSBUeXBlLnRpbWUuaXMsIGxhc3QgPSAtSW5maW5pdHksIE4gPSAwLCBEID0gMTAwMDsgLy8gV0FSTklORyEgSW4gdGhlIGZ1dHVyZSwgb24gbWFjaGluZXMgdGhhdCBhcmUgRCB0aW1lcyBmYXN0ZXIgdGhhbiAyMDE2QUQgbWFjaGluZXMsIHlvdSB3aWxsIHdhbnQgdG8gaW5jcmVhc2UgRCBieSBhbm90aGVyIHNldmVyYWwgb3JkZXJzIG9mIG1hZ25pdHVkZSBzbyB0aGUgcHJvY2Vzc2luZyBzcGVlZCBuZXZlciBvdXQgcGFjZXMgdGhlIGRlY2ltYWwgcmVzb2x1dGlvbiAoaW5jcmVhc2luZyBhbiBpbnRlZ2VyIGVmZmVjdHMgdGhlIHN0YXRlIGFjY3VyYWN5KS5cclxuXHRcdHZhciBwZXJmID0gKHR5cGVvZiBwZXJmb3JtYW5jZSAhPT0gJ3VuZGVmaW5lZCcpPyAocGVyZm9ybWFuY2UudGltaW5nICYmIHBlcmZvcm1hbmNlKSA6IGZhbHNlLCBzdGFydCA9IChwZXJmICYmIHBlcmYudGltaW5nICYmIHBlcmYudGltaW5nLm5hdmlnYXRpb25TdGFydCkgfHwgKHBlcmYgPSBmYWxzZSk7XHJcblx0XHRTdGF0ZS5fID0gJz4nO1xyXG5cdFx0U3RhdGUuZHJpZnQgPSAwO1xyXG5cdFx0U3RhdGUuaWZ5ID0gZnVuY3Rpb24obiwgZiwgcywgdiwgc291bCl7IC8vIHB1dCBhIGZpZWxkJ3Mgc3RhdGUgb24gYSBub2RlLlxyXG5cdFx0XHRpZighbiB8fCAhbltOX10peyAvLyByZWplY3QgaWYgaXQgaXMgbm90IG5vZGUtbGlrZS5cclxuXHRcdFx0XHRpZighc291bCl7IC8vIHVubGVzcyB0aGV5IHBhc3NlZCBhIHNvdWxcclxuXHRcdFx0XHRcdHJldHVybjsgXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG4gPSBOb2RlLnNvdWwuaWZ5KG4sIHNvdWwpOyAvLyB0aGVuIG1ha2UgaXQgc28hXHJcblx0XHRcdH0gXHJcblx0XHRcdHZhciB0bXAgPSBvYmpfYXMobltOX10sIFN0YXRlLl8pOyAvLyBncmFiIHRoZSBzdGF0ZXMgZGF0YS5cclxuXHRcdFx0aWYodSAhPT0gZiAmJiBmICE9PSBOXyl7XHJcblx0XHRcdFx0aWYobnVtX2lzKHMpKXtcclxuXHRcdFx0XHRcdHRtcFtmXSA9IHM7IC8vIGFkZCB0aGUgdmFsaWQgc3RhdGUuXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKHUgIT09IHYpeyAvLyBOb3RlOiBOb3QgaXRzIGpvYiB0byBjaGVjayBmb3IgdmFsaWQgdmFsdWVzIVxyXG5cdFx0XHRcdFx0bltmXSA9IHY7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBuO1xyXG5cdFx0fVxyXG5cdFx0U3RhdGUuaXMgPSBmdW5jdGlvbihuLCBmLCBvKXsgLy8gY29udmVuaWVuY2UgZnVuY3Rpb24gdG8gZ2V0IHRoZSBzdGF0ZSBvbiBhIGZpZWxkIG9uIGEgbm9kZSBhbmQgcmV0dXJuIGl0LlxyXG5cdFx0XHR2YXIgdG1wID0gKGYgJiYgbiAmJiBuW05fXSAmJiBuW05fXVtTdGF0ZS5fXSkgfHwgbztcclxuXHRcdFx0aWYoIXRtcCl7IHJldHVybiB9XHJcblx0XHRcdHJldHVybiBudW1faXModG1wW2ZdKT8gdG1wW2ZdIDogLUluZmluaXR5O1xyXG5cdFx0fVxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRTdGF0ZS5tYXAgPSBmdW5jdGlvbihjYiwgcywgYXMpeyB2YXIgdTsgLy8gZm9yIHVzZSB3aXRoIE5vZGUuaWZ5XHJcblx0XHRcdFx0dmFyIG8gPSBvYmpfaXMobyA9IGNiIHx8IHMpPyBvIDogbnVsbDtcclxuXHRcdFx0XHRjYiA9IGZuX2lzKGNiID0gY2IgfHwgcyk/IGNiIDogbnVsbDtcclxuXHRcdFx0XHRpZihvICYmICFjYil7XHJcblx0XHRcdFx0XHRzID0gbnVtX2lzKHMpPyBzIDogU3RhdGUoKTtcclxuXHRcdFx0XHRcdG9bTl9dID0gb1tOX10gfHwge307XHJcblx0XHRcdFx0XHRvYmpfbWFwKG8sIG1hcCwge286byxzOnN9KTtcclxuXHRcdFx0XHRcdHJldHVybiBvO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRhcyA9IGFzIHx8IG9ial9pcyhzKT8gcyA6IHU7XHJcblx0XHRcdFx0cyA9IG51bV9pcyhzKT8gcyA6IFN0YXRlKCk7XHJcblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKHYsIGYsIG8sIG9wdCl7XHJcblx0XHRcdFx0XHRpZighY2Ipe1xyXG5cdFx0XHRcdFx0XHRtYXAuY2FsbCh7bzogbywgczogc30sIHYsZik7XHJcblx0XHRcdFx0XHRcdHJldHVybiB2O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y2IuY2FsbChhcyB8fCB0aGlzIHx8IHt9LCB2LCBmLCBvLCBvcHQpO1xyXG5cdFx0XHRcdFx0aWYob2JqX2hhcyhvLGYpICYmIHUgPT09IG9bZl0peyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0bWFwLmNhbGwoe286IG8sIHM6IHN9LCB2LGYpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBtYXAodixmKXtcclxuXHRcdFx0XHRpZihOXyA9PT0gZil7IHJldHVybiB9XHJcblx0XHRcdFx0U3RhdGUuaWZ5KHRoaXMubywgZiwgdGhpcy5zKSA7XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblx0XHR2YXIgb2JqID0gVHlwZS5vYmosIG9ial9hcyA9IG9iai5hcywgb2JqX2hhcyA9IG9iai5oYXMsIG9ial9pcyA9IG9iai5pcywgb2JqX21hcCA9IG9iai5tYXA7XHJcblx0XHR2YXIgbnVtID0gVHlwZS5udW0sIG51bV9pcyA9IG51bS5pcztcclxuXHRcdHZhciBmbiA9IFR5cGUuZm4sIGZuX2lzID0gZm4uaXM7XHJcblx0XHR2YXIgTl8gPSBOb2RlLl8sIHU7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IFN0YXRlO1xyXG5cdH0pKHJlcXVpcmUsICcuL3N0YXRlJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgVHlwZSA9IHJlcXVpcmUoJy4vdHlwZScpO1xyXG5cdFx0dmFyIFZhbCA9IHJlcXVpcmUoJy4vdmFsJyk7XHJcblx0XHR2YXIgTm9kZSA9IHJlcXVpcmUoJy4vbm9kZScpO1xyXG5cdFx0dmFyIEdyYXBoID0ge307XHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdEdyYXBoLmlzID0gZnVuY3Rpb24oZywgY2IsIGZuLCBhcyl7IC8vIGNoZWNrcyB0byBzZWUgaWYgYW4gb2JqZWN0IGlzIGEgdmFsaWQgZ3JhcGguXHJcblx0XHRcdFx0aWYoIWcgfHwgIW9ial9pcyhnKSB8fCBvYmpfZW1wdHkoZykpeyByZXR1cm4gZmFsc2UgfSAvLyBtdXN0IGJlIGFuIG9iamVjdC5cclxuXHRcdFx0XHRyZXR1cm4gIW9ial9tYXAoZywgbWFwLCB7Y2I6Y2IsZm46Zm4sYXM6YXN9KTsgLy8gbWFrZXMgc3VyZSBpdCB3YXNuJ3QgYW4gZW1wdHkgb2JqZWN0LlxyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcChuLCBzKXsgLy8gd2UgaW52ZXJ0IHRoaXMgYmVjYXVzZSB0aGUgd2F5IHdlIGNoZWNrIGZvciB0aGlzIGlzIHZpYSBhIG5lZ2F0aW9uLlxyXG5cdFx0XHRcdGlmKCFuIHx8IHMgIT09IE5vZGUuc291bChuKSB8fCAhTm9kZS5pcyhuLCB0aGlzLmZuKSl7IHJldHVybiB0cnVlIH0gLy8gaXQgaXMgdHJ1ZSB0aGF0IHRoaXMgaXMgYW4gaW52YWxpZCBncmFwaC5cclxuXHRcdFx0XHRpZighdGhpcy5jYil7IHJldHVybiB9XHJcblx0XHRcdFx0bmYubiA9IG47IG5mLmFzID0gdGhpcy5hczsgLy8gc2VxdWVudGlhbCByYWNlIGNvbmRpdGlvbnMgYXJlbid0IHJhY2VzLlxyXG5cdFx0XHRcdHRoaXMuY2IuY2FsbChuZi5hcywgbiwgcywgbmYpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG5mKGZuKXsgLy8gb3B0aW9uYWwgY2FsbGJhY2sgZm9yIGVhY2ggbm9kZS5cclxuXHRcdFx0XHRpZihmbil7IE5vZGUuaXMobmYubiwgZm4sIG5mLmFzKSB9IC8vIHdoZXJlIHdlIHRoZW4gaGF2ZSBhbiBvcHRpb25hbCBjYWxsYmFjayBmb3IgZWFjaCBmaWVsZC92YWx1ZS5cclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0R3JhcGguaWZ5ID0gZnVuY3Rpb24ob2JqLCBlbnYsIGFzKXtcclxuXHRcdFx0XHR2YXIgYXQgPSB7cGF0aDogW10sIG9iajogb2JqfTtcclxuXHRcdFx0XHRpZighZW52KXtcclxuXHRcdFx0XHRcdGVudiA9IHt9O1xyXG5cdFx0XHRcdH0gZWxzZVxyXG5cdFx0XHRcdGlmKHR5cGVvZiBlbnYgPT09ICdzdHJpbmcnKXtcclxuXHRcdFx0XHRcdGVudiA9IHtzb3VsOiBlbnZ9O1xyXG5cdFx0XHRcdH0gZWxzZVxyXG5cdFx0XHRcdGlmKGVudiBpbnN0YW5jZW9mIEZ1bmN0aW9uKXtcclxuXHRcdFx0XHRcdGVudi5tYXAgPSBlbnY7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGVudi5zb3VsKXtcclxuXHRcdFx0XHRcdGF0LnJlbCA9IFZhbC5yZWwuaWZ5KGVudi5zb3VsKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZW52LmdyYXBoID0gZW52LmdyYXBoIHx8IHt9O1xyXG5cdFx0XHRcdGVudi5zZWVuID0gZW52LnNlZW4gfHwgW107XHJcblx0XHRcdFx0ZW52LmFzID0gZW52LmFzIHx8IGFzO1xyXG5cdFx0XHRcdG5vZGUoZW52LCBhdCk7XHJcblx0XHRcdFx0ZW52LnJvb3QgPSBhdC5ub2RlO1xyXG5cdFx0XHRcdHJldHVybiBlbnYuZ3JhcGg7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbm9kZShlbnYsIGF0KXsgdmFyIHRtcDtcclxuXHRcdFx0XHRpZih0bXAgPSBzZWVuKGVudiwgYXQpKXsgcmV0dXJuIHRtcCB9XHJcblx0XHRcdFx0YXQuZW52ID0gZW52O1xyXG5cdFx0XHRcdGF0LnNvdWwgPSBzb3VsO1xyXG5cdFx0XHRcdGlmKE5vZGUuaWZ5KGF0Lm9iaiwgbWFwLCBhdCkpe1xyXG5cdFx0XHRcdFx0Ly9hdC5yZWwgPSBhdC5yZWwgfHwgVmFsLnJlbC5pZnkoTm9kZS5zb3VsKGF0Lm5vZGUpKTtcclxuXHRcdFx0XHRcdGVudi5ncmFwaFtWYWwucmVsLmlzKGF0LnJlbCldID0gYXQubm9kZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGF0O1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcCh2LGYsbil7XHJcblx0XHRcdFx0dmFyIGF0ID0gdGhpcywgZW52ID0gYXQuZW52LCBpcywgdG1wO1xyXG5cdFx0XHRcdGlmKE5vZGUuXyA9PT0gZiAmJiBvYmpfaGFzKHYsVmFsLnJlbC5fKSl7XHJcblx0XHRcdFx0XHRyZXR1cm4gbi5fOyAvLyBUT0RPOiBCdWc/XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKCEoaXMgPSB2YWxpZCh2LGYsbiwgYXQsZW52KSkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGlmKCFmKXtcclxuXHRcdFx0XHRcdGF0Lm5vZGUgPSBhdC5ub2RlIHx8IG4gfHwge307XHJcblx0XHRcdFx0XHRpZihvYmpfaGFzKHYsIE5vZGUuXykgJiYgIUd1bi5pcyh2KSl7XHJcblx0XHRcdFx0XHRcdGF0Lm5vZGUuXyA9IG9ial9jb3B5KHYuXyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRhdC5ub2RlID0gTm9kZS5zb3VsLmlmeShhdC5ub2RlLCBWYWwucmVsLmlzKGF0LnJlbCkpO1xyXG5cdFx0XHRcdFx0YXQucmVsID0gYXQucmVsIHx8IFZhbC5yZWwuaWZ5KE5vZGUuc291bChhdC5ub2RlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKHRtcCA9IGVudi5tYXApe1xyXG5cdFx0XHRcdFx0dG1wLmNhbGwoZW52LmFzIHx8IHt9LCB2LGYsbiwgYXQpO1xyXG5cdFx0XHRcdFx0aWYob2JqX2hhcyhuLGYpKXtcclxuXHRcdFx0XHRcdFx0diA9IG5bZl07XHJcblx0XHRcdFx0XHRcdGlmKHUgPT09IHYpe1xyXG5cdFx0XHRcdFx0XHRcdG9ial9kZWwobiwgZik7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmKCEoaXMgPSB2YWxpZCh2LGYsbiwgYXQsZW52KSkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZighZil7IHJldHVybiBhdC5ub2RlIH1cclxuXHRcdFx0XHRpZih0cnVlID09PSBpcyl7XHJcblx0XHRcdFx0XHRyZXR1cm4gdjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dG1wID0gbm9kZShlbnYsIHtvYmo6IHYsIHBhdGg6IGF0LnBhdGguY29uY2F0KGYpfSk7XHJcblx0XHRcdFx0aWYoIXRtcC5ub2RlKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRyZXR1cm4gdG1wLnJlbDsgLy97JyMnOiBOb2RlLnNvdWwodG1wLm5vZGUpfTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBzb3VsKGlkKXsgdmFyIGF0ID0gdGhpcztcclxuXHRcdFx0XHR2YXIgcHJldiA9IFZhbC5yZWwuaXMoYXQucmVsKSwgZ3JhcGggPSBhdC5lbnYuZ3JhcGg7XHJcblx0XHRcdFx0YXQucmVsID0gYXQucmVsIHx8IFZhbC5yZWwuaWZ5KGlkKTtcclxuXHRcdFx0XHRhdC5yZWxbVmFsLnJlbC5fXSA9IGlkO1xyXG5cdFx0XHRcdGlmKGF0Lm5vZGUgJiYgYXQubm9kZVtOb2RlLl9dKXtcclxuXHRcdFx0XHRcdGF0Lm5vZGVbTm9kZS5fXVtWYWwucmVsLl9dID0gaWQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKG9ial9oYXMoZ3JhcGgsIHByZXYpKXtcclxuXHRcdFx0XHRcdGdyYXBoW2lkXSA9IGdyYXBoW3ByZXZdO1xyXG5cdFx0XHRcdFx0b2JqX2RlbChncmFwaCwgcHJldik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIHZhbGlkKHYsZixuLCBhdCxlbnYpeyB2YXIgdG1wO1xyXG5cdFx0XHRcdGlmKFZhbC5pcyh2KSl7IHJldHVybiB0cnVlIH1cclxuXHRcdFx0XHRpZihvYmpfaXModikpeyByZXR1cm4gMSB9XHJcblx0XHRcdFx0aWYodG1wID0gZW52LmludmFsaWQpe1xyXG5cdFx0XHRcdFx0diA9IHRtcC5jYWxsKGVudi5hcyB8fCB7fSwgdixmLG4pO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHZhbGlkKHYsZixuLCBhdCxlbnYpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbnYuZXJyID0gXCJJbnZhbGlkIHZhbHVlIGF0ICdcIiArIGF0LnBhdGguY29uY2F0KGYpLmpvaW4oJy4nKSArIFwiJyFcIjtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBzZWVuKGVudiwgYXQpe1xyXG5cdFx0XHRcdHZhciBhcnIgPSBlbnYuc2VlbiwgaSA9IGFyci5sZW5ndGgsIGhhcztcclxuXHRcdFx0XHR3aGlsZShpLS0peyBoYXMgPSBhcnJbaV07XHJcblx0XHRcdFx0XHRpZihhdC5vYmogPT09IGhhcy5vYmopeyByZXR1cm4gaGFzIH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YXJyLnB1c2goYXQpO1xyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0R3JhcGgubm9kZSA9IGZ1bmN0aW9uKG5vZGUpe1xyXG5cdFx0XHR2YXIgc291bCA9IE5vZGUuc291bChub2RlKTtcclxuXHRcdFx0aWYoIXNvdWwpeyByZXR1cm4gfVxyXG5cdFx0XHRyZXR1cm4gb2JqX3B1dCh7fSwgc291bCwgbm9kZSk7XHJcblx0XHR9XHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdEdyYXBoLnRvID0gZnVuY3Rpb24oZ3JhcGgsIHJvb3QsIG9wdCl7XHJcblx0XHRcdFx0aWYoIWdyYXBoKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgb2JqID0ge307XHJcblx0XHRcdFx0b3B0ID0gb3B0IHx8IHtzZWVuOiB7fX07XHJcblx0XHRcdFx0b2JqX21hcChncmFwaFtyb290XSwgbWFwLCB7b2JqOm9iaiwgZ3JhcGg6IGdyYXBoLCBvcHQ6IG9wdH0pO1xyXG5cdFx0XHRcdHJldHVybiBvYmo7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbWFwKHYsZil7IHZhciB0bXAsIG9iajtcclxuXHRcdFx0XHRpZihOb2RlLl8gPT09IGYpe1xyXG5cdFx0XHRcdFx0aWYob2JqX2VtcHR5KHYsIFZhbC5yZWwuXykpe1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR0aGlzLm9ialtmXSA9IG9ial9jb3B5KHYpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZighKHRtcCA9IFZhbC5yZWwuaXModikpKXtcclxuXHRcdFx0XHRcdHRoaXMub2JqW2ZdID0gdjtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYob2JqID0gdGhpcy5vcHQuc2Vlblt0bXBdKXtcclxuXHRcdFx0XHRcdHRoaXMub2JqW2ZdID0gb2JqO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLm9ialtmXSA9IHRoaXMub3B0LnNlZW5bdG1wXSA9IEdyYXBoLnRvKHRoaXMuZ3JhcGgsIHRtcCwgdGhpcy5vcHQpO1xyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0dmFyIGZuX2lzID0gVHlwZS5mbi5pcztcclxuXHRcdHZhciBvYmogPSBUeXBlLm9iaiwgb2JqX2lzID0gb2JqLmlzLCBvYmpfZGVsID0gb2JqLmRlbCwgb2JqX2hhcyA9IG9iai5oYXMsIG9ial9lbXB0eSA9IG9iai5lbXB0eSwgb2JqX3B1dCA9IG9iai5wdXQsIG9ial9tYXAgPSBvYmoubWFwLCBvYmpfY29weSA9IG9iai5jb3B5O1xyXG5cdFx0dmFyIHU7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IEdyYXBoO1xyXG5cdH0pKHJlcXVpcmUsICcuL2dyYXBoJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgVHlwZSA9IHJlcXVpcmUoJy4vdHlwZScpO1xyXG5cdFx0ZnVuY3Rpb24gRHVwKCl7XHJcblx0XHRcdHRoaXMuY2FjaGUgPSB7fTtcclxuXHRcdH1cclxuXHRcdER1cC5wcm90b3R5cGUudHJhY2sgPSBmdW5jdGlvbihpZCl7XHJcblx0XHRcdHRoaXMuY2FjaGVbaWRdID0gVHlwZS50aW1lLmlzKCk7XHJcblx0XHRcdGlmICghdGhpcy50bykge1xyXG5cdFx0XHRcdHRoaXMuZ2MoKTsgLy8gRW5nYWdlIEdDLlxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBpZDtcclxuXHRcdH07XHJcblx0XHREdXAucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oaWQpe1xyXG5cdFx0XHQvLyBIYXZlIHdlIHNlZW4gdGhpcyBJRCByZWNlbnRseT9cclxuXHRcdFx0cmV0dXJuIFR5cGUub2JqLmhhcyh0aGlzLmNhY2hlLCBpZCk/IHRoaXMudHJhY2soaWQpIDogZmFsc2U7IC8vIEltcG9ydGFudCwgYnVtcCB0aGUgSUQncyBsaXZlbGluZXNzIGlmIGl0IGhhcyBhbHJlYWR5IGJlZW4gc2VlbiBiZWZvcmUgLSB0aGlzIGlzIGNyaXRpY2FsIHRvIHN0b3BwaW5nIGJyb2FkY2FzdCBzdG9ybXMuXHJcblx0XHR9XHJcblx0XHREdXAucHJvdG90eXBlLmdjID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIGRlID0gdGhpcywgbm93ID0gVHlwZS50aW1lLmlzKCksIG9sZGVzdCA9IG5vdywgbWF4QWdlID0gNSAqIDYwICogMTAwMDtcclxuXHRcdFx0Ly8gVE9ETzogR3VuLnNjaGVkdWxlciBhbHJlYWR5IGRvZXMgdGhpcz8gUmV1c2UgdGhhdC5cclxuXHRcdFx0VHlwZS5vYmoubWFwKGRlLmNhY2hlLCBmdW5jdGlvbih0aW1lLCBpZCl7XHJcblx0XHRcdFx0b2xkZXN0ID0gTWF0aC5taW4obm93LCB0aW1lKTtcclxuXHRcdFx0XHRpZiAoKG5vdyAtIHRpbWUpIDwgbWF4QWdlKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRUeXBlLm9iai5kZWwoZGUuY2FjaGUsIGlkKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHZhciBkb25lID0gVHlwZS5vYmouZW1wdHkoZGUuY2FjaGUpO1xyXG5cdFx0XHRpZihkb25lKXtcclxuXHRcdFx0XHRkZS50byA9IG51bGw7IC8vIERpc2VuZ2FnZSBHQy5cclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIGVsYXBzZWQgPSBub3cgLSBvbGRlc3Q7IC8vIEp1c3QgaG93IG9sZD9cclxuXHRcdFx0dmFyIG5leHRHQyA9IG1heEFnZSAtIGVsYXBzZWQ7IC8vIEhvdyBsb25nIGJlZm9yZSBpdCdzIHRvbyBvbGQ/XHJcblx0XHRcdGRlLnRvID0gc2V0VGltZW91dChmdW5jdGlvbigpeyBkZS5nYygpIH0sIG5leHRHQyk7IC8vIFNjaGVkdWxlIHRoZSBuZXh0IEdDIGV2ZW50LlxyXG5cdFx0fVxyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBEdXA7XHJcblx0fSkocmVxdWlyZSwgJy4vZHVwJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblxyXG5cdFx0ZnVuY3Rpb24gR3VuKG8pe1xyXG5cdFx0XHRpZihvIGluc3RhbmNlb2YgR3VuKXsgcmV0dXJuICh0aGlzLl8gPSB7Z3VuOiB0aGlzfSkuZ3VuIH1cclxuXHRcdFx0aWYoISh0aGlzIGluc3RhbmNlb2YgR3VuKSl7IHJldHVybiBuZXcgR3VuKG8pIH1cclxuXHRcdFx0cmV0dXJuIEd1bi5jcmVhdGUodGhpcy5fID0ge2d1bjogdGhpcywgb3B0OiBvfSk7XHJcblx0XHR9XHJcblxyXG5cdFx0R3VuLmlzID0gZnVuY3Rpb24oZ3VuKXsgcmV0dXJuIChndW4gaW5zdGFuY2VvZiBHdW4pIH1cclxuXHJcblx0XHRHdW4udmVyc2lvbiA9IDAuNjtcclxuXHJcblx0XHRHdW4uY2hhaW4gPSBHdW4ucHJvdG90eXBlO1xyXG5cdFx0R3VuLmNoYWluLnRvSlNPTiA9IGZ1bmN0aW9uKCl7fTtcclxuXHJcblx0XHR2YXIgVHlwZSA9IHJlcXVpcmUoJy4vdHlwZScpO1xyXG5cdFx0VHlwZS5vYmoudG8oVHlwZSwgR3VuKTtcclxuXHRcdEd1bi5IQU0gPSByZXF1aXJlKCcuL0hBTScpO1xyXG5cdFx0R3VuLnZhbCA9IHJlcXVpcmUoJy4vdmFsJyk7XHJcblx0XHRHdW4ubm9kZSA9IHJlcXVpcmUoJy4vbm9kZScpO1xyXG5cdFx0R3VuLnN0YXRlID0gcmVxdWlyZSgnLi9zdGF0ZScpO1xyXG5cdFx0R3VuLmdyYXBoID0gcmVxdWlyZSgnLi9ncmFwaCcpO1xyXG5cdFx0R3VuLmR1cCA9IHJlcXVpcmUoJy4vZHVwJyk7XHJcblx0XHRHdW4ub24gPSByZXF1aXJlKCcuL29uaWZ5JykoKTtcclxuXHRcdFxyXG5cdFx0R3VuLl8gPSB7IC8vIHNvbWUgcmVzZXJ2ZWQga2V5IHdvcmRzLCB0aGVzZSBhcmUgbm90IHRoZSBvbmx5IG9uZXMuXHJcblx0XHRcdG5vZGU6IEd1bi5ub2RlLl8gLy8gYWxsIG1ldGFkYXRhIG9mIGEgbm9kZSBpcyBzdG9yZWQgaW4gdGhlIG1ldGEgcHJvcGVydHkgb24gdGhlIG5vZGUuXHJcblx0XHRcdCxzb3VsOiBHdW4udmFsLnJlbC5fIC8vIGEgc291bCBpcyBhIFVVSUQgb2YgYSBub2RlIGJ1dCBpdCBhbHdheXMgcG9pbnRzIHRvIHRoZSBcImxhdGVzdFwiIGRhdGEga25vd24uXHJcblx0XHRcdCxzdGF0ZTogR3VuLnN0YXRlLl8gLy8gb3RoZXIgdGhhbiB0aGUgc291bCwgd2Ugc3RvcmUgSEFNIG1ldGFkYXRhLlxyXG5cdFx0XHQsZmllbGQ6ICcuJyAvLyBhIGZpZWxkIGlzIGEgcHJvcGVydHkgb24gYSBub2RlIHdoaWNoIHBvaW50cyB0byBhIHZhbHVlLlxyXG5cdFx0XHQsdmFsdWU6ICc9JyAvLyB0aGUgcHJpbWl0aXZlIHZhbHVlLlxyXG5cdFx0fVxyXG5cclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0R3VuLmNyZWF0ZSA9IGZ1bmN0aW9uKGF0KXtcclxuXHRcdFx0XHRhdC5vbiA9IGF0Lm9uIHx8IEd1bi5vbjtcclxuXHRcdFx0XHRhdC5yb290ID0gYXQucm9vdCB8fCBhdC5ndW47XHJcblx0XHRcdFx0YXQuZ3JhcGggPSBhdC5ncmFwaCB8fCB7fTtcclxuXHRcdFx0XHRhdC5kdXAgPSBhdC5kdXAgfHwgbmV3IEd1bi5kdXA7XHJcblx0XHRcdFx0YXQuYXNrID0gR3VuLm9uLmFzaztcclxuXHRcdFx0XHRhdC5hY2sgPSBHdW4ub24uYWNrO1xyXG5cdFx0XHRcdHZhciBndW4gPSBhdC5ndW4ub3B0KGF0Lm9wdCk7XHJcblx0XHRcdFx0aWYoIWF0Lm9uY2Upe1xyXG5cdFx0XHRcdFx0YXQub24oJ2luJywgcm9vdCwgYXQpO1xyXG5cdFx0XHRcdFx0YXQub24oJ291dCcsIHJvb3QsIGF0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YXQub25jZSA9IDE7XHJcblx0XHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiByb290KGF0KXtcclxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiYWRkIHRvLm5leHQoYXQpXCIpOyAvLyBUT0RPOiBCVUchISFcclxuXHRcdFx0XHR2YXIgZXYgPSB0aGlzLCBjYXQgPSBldi5hcywgY29hdDtcclxuXHRcdFx0XHRpZighYXQuZ3VuKXsgYXQuZ3VuID0gY2F0Lmd1biB9XHJcblx0XHRcdFx0aWYoIWF0WycjJ10gJiYgYXRbJ0AnXSl7XHJcblx0XHRcdFx0XHRhdFsnIyddID0gR3VuLnRleHQucmFuZG9tKCk7IC8vIFRPRE86IFVzZSB3aGF0IGlzIHVzZWQgb3RoZXIgcGxhY2VzIGluc3RlYWQuXHJcblx0XHRcdFx0XHQvLyBUT0RPOiBCVUchIEZvciBtdWx0aS1pbnN0YW5jZXMsIHRoZSBcImFja1wiIHN5c3RlbSBpcyBnbG9iYWxseSBzaGFyZWQsIGJ1dCBpdCBzaG91bGRuJ3QgYmUuIFxyXG5cdFx0XHRcdFx0aWYoY2F0LmFjayhhdFsnQCddLCBhdCkpeyByZXR1cm4gfSAvLyBUT0RPOiBDb25zaWRlciBub3QgcmV0dXJuaW5nIGhlcmUsIG1heWJlLCB3aGVyZSB0aGlzIHdvdWxkIGxldCB0aGUgXCJoYW5kc2hha2VcIiBvbiBzeW5jIG9jY3VyIGZvciBIb2x5IEdyYWlsP1xyXG5cdFx0XHRcdFx0Y2F0LmR1cC50cmFjayhhdFsnIyddKTtcclxuXHRcdFx0XHRcdEd1bi5vbignb3V0Jywgb2JqX3RvKGF0LCB7Z3VuOiBjYXQuZ3VufSkpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihhdFsnIyddICYmIGNhdC5kdXAuY2hlY2soYXRbJyMnXSkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGNhdC5kdXAudHJhY2soYXRbJyMnXSk7XHJcblx0XHRcdFx0aWYoY2F0LmFjayhhdFsnQCddLCBhdCkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdC8vY2F0LmFjayhhdFsnQCddLCBhdCk7XHJcblx0XHRcdFx0Y29hdCA9IG9ial90byhhdCwge2d1bjogY2F0Lmd1bn0pO1xyXG5cdFx0XHRcdGlmKGF0LmdldCl7XHJcblx0XHRcdFx0XHRpZighZ2V0KGF0LCBjYXQpKXtcclxuXHRcdFx0XHRcdFx0R3VuLm9uKCdnZXQnLCBjb2F0KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoYXQucHV0KXtcclxuXHRcdFx0XHRcdEd1bi5IQU0uc3ludGgoYXQsIGV2LCBjYXQuZ3VuKTsgLy8gVE9ETzogQ2xlYW4gdXAsIGp1c3QgbWFrZSBpdCBwYXJ0IG9mIG9uKCdwdXQnKSFcclxuXHRcdFx0XHRcdEd1bi5vbigncHV0JywgY29hdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdEd1bi5vbignb3V0JywgY29hdCk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gZ2V0KGF0LCBjYXQpe1xyXG5cdFx0XHRcdHZhciBzb3VsID0gYXQuZ2V0W19zb3VsXSwgbm9kZSA9IGNhdC5ncmFwaFtzb3VsXSwgZmllbGQgPSBhdC5nZXRbX2ZpZWxkXSwgdG1wO1xyXG5cdFx0XHRcdHZhciBuZXh0ID0gY2F0Lm5leHQgfHwgKGNhdC5uZXh0ID0ge30pLCBhcyA9IC8qKGF0Lmd1bnx8ZW1wdHkpLl8gfHwqLyAobmV4dFtzb3VsXSB8fCAobmV4dFtzb3VsXSA9IGNhdC5ndW4uZ2V0KHNvdWwpKSkuXztcclxuXHRcdFx0XHRpZighbm9kZSl7IHJldHVybiB9XHJcblx0XHRcdFx0aWYoZmllbGQpe1xyXG5cdFx0XHRcdFx0aWYoIW9ial9oYXMobm9kZSwgZmllbGQpKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdHRtcCA9IEd1bi5vYmoucHV0KEd1bi5ub2RlLnNvdWwuaWZ5KHt9LCBzb3VsKSwgZmllbGQsIG5vZGVbZmllbGRdKTtcclxuXHRcdFx0XHRcdG5vZGUgPSBHdW4uc3RhdGUuaWZ5KHRtcCwgZmllbGQsIEd1bi5zdGF0ZS5pcyhub2RlLCBmaWVsZCkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvL2lmKGF0Lmd1biA9PT0gY2F0Lmd1bil7XHJcblx0XHRcdFx0XHRub2RlID0gR3VuLmdyYXBoLm5vZGUobm9kZSk7IC8vIFRPRE86IEJVRyEgQ2xvbmUgbm9kZT9cclxuXHRcdFx0XHQvL30gZWxzZSB7XHJcblx0XHRcdFx0Ly9cdGNhdCA9IChhdC5ndW4uXyk7XHJcblx0XHRcdFx0Ly99XHJcblx0XHRcdFx0dG1wID0gYXMuYWNrO1xyXG5cdFx0XHRcdGNhdC5vbignaW4nLCB7XHJcblx0XHRcdFx0XHQnQCc6IGF0WycjJ10sXHJcblx0XHRcdFx0XHRob3c6ICdtZW0nLFxyXG5cdFx0XHRcdFx0cHV0OiBub2RlLFxyXG5cdFx0XHRcdFx0Z3VuOiBhcy5ndW5cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRpZigwIDwgdG1wKXtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdFxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRHdW4ub24uYXNrID0gZnVuY3Rpb24oY2IsIGFzKXtcclxuXHRcdFx0XHRpZighdGhpcy5vbil7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIGlkID0gR3VuLnRleHQucmFuZG9tKCk7XHJcblx0XHRcdFx0aWYoY2IpeyB0aGlzLm9uKGlkLCBjYiwgYXMpIH1cclxuXHRcdFx0XHRyZXR1cm4gaWQ7XHJcblx0XHRcdH1cclxuXHRcdFx0R3VuLm9uLmFjayA9IGZ1bmN0aW9uKGF0LCByZXBseSl7XHJcblx0XHRcdFx0aWYoIWF0IHx8ICFyZXBseSB8fCAhdGhpcy5vbil7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIGlkID0gYXRbJyMnXSB8fCBhdDtcclxuXHRcdFx0XHRpZighdGhpcy50YWcgfHwgIXRoaXMudGFnW2lkXSl7IHJldHVybiB9XHJcblx0XHRcdFx0dGhpcy5vbihpZCwgcmVwbHkpO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0R3VuLmNoYWluLm9wdCA9IGZ1bmN0aW9uKG9wdCl7XHJcblx0XHRcdFx0b3B0ID0gb3B0IHx8IHt9O1xyXG5cdFx0XHRcdHZhciBndW4gPSB0aGlzLCBhdCA9IGd1bi5fLCB0bXAgPSBvcHQucGVlcnMgfHwgb3B0O1xyXG5cdFx0XHRcdGlmKCFvYmpfaXMob3B0KSl7IG9wdCA9IHt9IH1cclxuXHRcdFx0XHRpZighb2JqX2lzKGF0Lm9wdCkpeyBhdC5vcHQgPSBvcHQgfVxyXG5cdFx0XHRcdGlmKHRleHRfaXModG1wKSl7IHRtcCA9IFt0bXBdIH1cclxuXHRcdFx0XHRpZihsaXN0X2lzKHRtcCkpe1xyXG5cdFx0XHRcdFx0dG1wID0gb2JqX21hcCh0bXAsIGZ1bmN0aW9uKHVybCwgaSwgbWFwKXtcclxuXHRcdFx0XHRcdFx0bWFwKHVybCwge3VybDogdXJsfSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdGlmKCFvYmpfaXMoYXQub3B0LnBlZXJzKSl7IGF0Lm9wdC5wZWVycyA9IHt9fVxyXG5cdFx0XHRcdFx0YXQub3B0LnBlZXJzID0gb2JqX3RvKHRtcCwgYXQub3B0LnBlZXJzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YXQub3B0LndzYyA9IGF0Lm9wdC53c2MgfHwge3Byb3RvY29sczpudWxsfSBcclxuXHRcdFx0XHRhdC5vcHQucGVlcnMgPSBhdC5vcHQucGVlcnMgfHwge307XHJcblx0XHRcdFx0b2JqX3RvKG9wdCwgYXQub3B0KTsgLy8gY29waWVzIG9wdGlvbnMgb24gdG8gYGF0Lm9wdGAgb25seSBpZiBub3QgYWxyZWFkeSB0YWtlbi5cclxuXHRcdFx0XHRHdW4ub24oJ29wdCcsIGF0KTtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cclxuXHRcdHZhciB0ZXh0X2lzID0gR3VuLnRleHQuaXM7XHJcblx0XHR2YXIgbGlzdF9pcyA9IEd1bi5saXN0LmlzO1xyXG5cdFx0dmFyIG9iaiA9IEd1bi5vYmosIG9ial9pcyA9IG9iai5pcywgb2JqX2hhcyA9IG9iai5oYXMsIG9ial90byA9IG9iai50bywgb2JqX21hcCA9IG9iai5tYXA7XHJcblx0XHR2YXIgX3NvdWwgPSBHdW4uXy5zb3VsLCBfZmllbGQgPSBHdW4uXy5maWVsZDtcclxuXHRcdC8vdmFyIHU7XHJcblxyXG5cdFx0Y29uc29sZS5kZWJ1ZyA9IGZ1bmN0aW9uKGksIHMpeyByZXR1cm4gKGNvbnNvbGUuZGVidWcuaSAmJiBpID09PSBjb25zb2xlLmRlYnVnLmkgJiYgY29uc29sZS5kZWJ1Zy5pKyspICYmIChjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpIHx8IHMpIH07XHJcblxyXG5cdFx0R3VuLmxvZyA9IGZ1bmN0aW9uKCl7IHJldHVybiAoIUd1bi5sb2cub2ZmICYmIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cykpLCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykuam9pbignICcpIH1cclxuXHRcdEd1bi5sb2cub25jZSA9IGZ1bmN0aW9uKHcscyxvKXsgcmV0dXJuIChvID0gR3VuLmxvZy5vbmNlKVt3XSA9IG9bd10gfHwgMCwgb1t3XSsrIHx8IEd1bi5sb2cocykgfVxyXG5cclxuXHRcdC8qIFBsZWFzZSBkbyBub3QgcmVtb3ZlIHRoZXNlIG1lc3NhZ2VzIHVubGVzcyB5b3UgYXJlIHBheWluZyBmb3IgYSBtb250aGx5IHNwb25zb3JzaGlwLCB0aGFua3MhICovXHJcblx0XHRHdW4ubG9nLm9uY2UoXCJ3ZWxjb21lXCIsIFwiSGVsbG8gd29uZGVyZnVsIHBlcnNvbiEgOikgVGhhbmtzIGZvciB1c2luZyBHVU4sIGZlZWwgZnJlZSB0byBhc2sgZm9yIGhlbHAgb24gaHR0cHM6Ly9naXR0ZXIuaW0vYW1hcmsvZ3VuIGFuZCBhc2sgU3RhY2tPdmVyZmxvdyBxdWVzdGlvbnMgdGFnZ2VkIHdpdGggJ2d1bichXCIpO1xyXG5cdFx0LyogUGxlYXNlIGRvIG5vdCByZW1vdmUgdGhlc2UgbWVzc2FnZXMgdW5sZXNzIHlvdSBhcmUgcGF5aW5nIGZvciBhIG1vbnRobHkgc3BvbnNvcnNoaXAsIHRoYW5rcyEgKi9cclxuXHRcdFxyXG5cdFx0aWYodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIil7IHdpbmRvdy5HdW4gPSBHdW4gfVxyXG5cdFx0aWYodHlwZW9mIGNvbW1vbiAhPT0gXCJ1bmRlZmluZWRcIil7IGNvbW1vbi5leHBvcnRzID0gR3VuIH1cclxuXHRcdG1vZHVsZS5leHBvcnRzID0gR3VuO1xyXG5cdH0pKHJlcXVpcmUsICcuL3Jvb3QnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHJldHVybjtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL3Jvb3QnKTtcclxuXHRcdHZhciBvbnRvID0gcmVxdWlyZSgnLi9vbnRvJyk7XHJcblx0XHRmdW5jdGlvbiBDaGFpbihiYWNrKXtcclxuXHRcdFx0dmFyIGF0ID0gdGhpcy5fID0ge2JhY2s6IGJhY2ssIG9uOiBvbnRvLCAkOiB0aGlzLCBuZXh0OiB7fX07XHJcblx0XHRcdGF0LnJvb3QgPSBiYWNrPyBiYWNrLnJvb3QgOiBhdDtcclxuXHRcdFx0YXQub24oJ2luJywgaW5wdXQsIGF0KTtcclxuXHRcdFx0YXQub24oJ291dCcsIG91dHB1dCwgYXQpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIGNoYWluID0gQ2hhaW4ucHJvdG90eXBlO1xyXG5cdFx0Y2hhaW4uYmFjayA9IGZ1bmN0aW9uKGFyZyl7IHZhciB0bXA7XHJcblx0XHRcdGlmKHRtcCA9IHRoaXMuXy5iYWNrKXtcclxuXHRcdFx0XHRyZXR1cm4gdG1wLiQ7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGNoYWluLm5leHQgPSBmdW5jdGlvbihhcmcpe1xyXG5cdFx0XHR2YXIgYXQgPSB0aGlzLl8sIGNhdDtcclxuXHRcdFx0aWYoY2F0ID0gYXQubmV4dFthcmddKXtcclxuXHRcdFx0XHRyZXR1cm4gY2F0LiQ7XHJcblx0XHRcdH1cclxuXHRcdFx0Y2F0ID0gKG5ldyBDaGFpbihhdCkuXyk7XHJcblx0XHRcdGF0Lm5leHRbYXJnXSA9IGNhdDtcclxuXHRcdFx0Y2F0LmtleSA9IGFyZztcclxuXHRcdFx0cmV0dXJuIGNhdC4kO1xyXG5cdFx0fVxyXG5cdFx0Y2hhaW4uZ2V0ID0gZnVuY3Rpb24oYXJnKXtcclxuXHRcdFx0aWYodHlwZW9mIGFyZyA9PSAnc3RyaW5nJyl7XHJcblx0XHRcdFx0dmFyIGF0ID0gdGhpcy5fLCBjYXQ7XHJcblx0XHRcdFx0aWYoY2F0ID0gYXQubmV4dFthcmddKXtcclxuXHRcdFx0XHRcdHJldHVybiBjYXQuJDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2F0ID0gKHRoaXMubmV4dChhcmcpLl8pO1xyXG5cdFx0XHRcdGlmKGF0LmdldCB8fCBhdCA9PT0gYXQucm9vdCl7XHJcblx0XHRcdFx0XHRjYXQuZ2V0ID0gYXJnO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gY2F0LiQ7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFyIGF0ID0gdGhpcy5fO1xyXG5cdFx0XHRcdHZhciBvdXQgPSB7JyMnOiBHdW4udGV4dC5yYW5kb20oKSwgZ2V0OiB7fSwgY2FwOiAxfTtcclxuXHRcdFx0XHR2YXIgdG8gPSBhdC5yb290Lm9uKG91dFsnIyddLCBnZXQsIHtuZXh0OiBhcmd9KVxyXG5cdFx0XHRcdGF0Lm9uKCdpbicsIGdldCwgdG8pO1xyXG5cdFx0XHRcdGF0Lm9uKCdvdXQnLCBvdXQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gZ2V0KGVudil7XHJcblx0XHRcdHZhciBhcyA9IHRoaXMuYXM7XHJcblx0XHRcdGlmKGFzLm5leHQpe1xyXG5cdFx0XHRcdGFzLm5leHQoZW52LCB0aGlzKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Y2hhaW4ubWFwID0gZnVuY3Rpb24oY2Ipe1xyXG5cdFx0XHR2YXIgYXQgPSB0aGlzLl87XHJcblx0XHRcdHZhciBjaGFpbiA9IG5ldyBDaGFpbihhdCk7XHJcblx0XHRcdHZhciBjYXQgPSBjaGFpbi5fO1xyXG5cdFx0XHR2YXIgdTtcclxuXHRcdFx0YXQub24oJ2luJywgZnVuY3Rpb24oZW52KXsgdmFyIHRtcDtcclxuXHRcdFx0XHRpZighZW52KXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgY2F0ID0gdGhpcy5hcztcclxuXHRcdFx0XHR2YXIgdG8gPSB0aGlzLnRvO1xyXG5cdFx0XHRcdGlmKHRtcCA9IGVudi5wdXQpe1xyXG5cdFx0XHRcdFx0dG8ubmV4dChlbnYpO1xyXG5cdFx0XHRcdFx0R3VuLm9iai5tYXAodG1wLCBmdW5jdGlvbihkYXRhLCBrZXkpe1xyXG5cdFx0XHRcdFx0XHRpZignXycgPT0ga2V5KXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdFx0aWYoY2Ipe1xyXG5cdFx0XHRcdFx0XHRcdGRhdGEgPSBjYihkYXRhLCBrZXkpO1xyXG5cdFx0XHRcdFx0XHRcdGlmKHUgPT09IGRhdGEpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGNhdC5vbignaW4nLCBHdW4ub2JqLnRvKGVudiwge3B1dDogZGF0YX0pKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgY2F0KTtcclxuXHRcdFx0cmV0dXJuIGNoYWluO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gaW5wdXQoZW52KXsgdmFyIHRtcDtcclxuXHRcdFx0aWYoIWVudil7IHJldHVybiB9XHJcblx0XHRcdHZhciBjYXQgPSB0aGlzLmFzO1xyXG5cdFx0XHR2YXIgdG8gPSB0aGlzLnRvO1xyXG5cdFx0XHRpZih0bXAgPSBlbnYucHV0KXtcclxuXHRcdFx0XHRpZih0bXAgJiYgdG1wWycjJ10gJiYgKHRtcCA9IEd1bi52YWwucmVsLmlzKHRtcCkpKXtcclxuXHRcdFx0XHRcdC8vaW5wdXQuY2FsbCh0aGlzLCBHdW4ub2JqLnRvKGVudiwge3B1dDogY2F0LnJvb3QucHV0W3RtcF19KSk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhdC5wdXQgPSB0bXA7XHJcblx0XHRcdFx0dG8ubmV4dChlbnYpO1xyXG5cdFx0XHRcdHZhciBuZXh0ID0gY2F0Lm5leHQ7XHJcblx0XHRcdFx0R3VuLm9iai5tYXAodG1wLCBmdW5jdGlvbihkYXRhLCBrZXkpe1xyXG5cdFx0XHRcdFx0aWYoIShrZXkgPSBuZXh0W2tleV0pKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdGtleS5vbignaW4nLCBHdW4ub2JqLnRvKGVudiwge3B1dDogZGF0YX0pKVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBvdXRwdXQoZW52KXsgdmFyIHRtcDtcclxuXHRcdFx0dmFyIHU7XHJcblx0XHRcdGlmKCFlbnYpeyByZXR1cm4gfVxyXG5cdFx0XHR2YXIgY2F0ID0gdGhpcy5hcztcclxuXHRcdFx0dmFyIHRvID0gdGhpcztcclxuXHRcdFx0aWYoIWNhdC5iYWNrKXtcclxuXHRcdFx0XHRlbnYudGVzdCA9IHRydWU7XHJcblx0XHRcdFx0ZW52Lmd1biA9IGNhdC5yb290LiQ7XHJcblx0XHRcdFx0R3VuLm9uKCdvdXQnLCBlbnYpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih0bXAgPSBlbnYuZ2V0KXtcclxuXHRcdFx0XHRpZihjYXQuZ2V0KXtcclxuXHRcdFx0XHRcdGVudiA9IEd1bi5vYmoudG8oZW52LCB7Z2V0OiB7JyMnOiBjYXQuZ2V0LCAnLic6IHRtcH19KTtcclxuXHRcdFx0XHR9IGVsc2VcclxuXHRcdFx0XHRpZihjYXQua2V5KXtcclxuXHRcdFx0XHRcdGVudiA9IEd1bi5vYmoudG8oZW52LCB7Z2V0OiBHdW4ub2JqLnB1dCh7fSwgY2F0LmtleSwgdG1wKX0pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRlbnYgPSBHdW4ub2JqLnRvKGVudiwge2dldDogeycqJzogdG1wfX0pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGNhdC5iYWNrLm9uKCdvdXQnLCBlbnYpO1xyXG5cdFx0fVxyXG5cdFx0Y2hhaW4udmFsID0gZnVuY3Rpb24oY2IsIG9wdCl7XHJcblx0XHRcdHZhciBhdCA9IHRoaXMuXztcclxuXHRcdFx0aWYoY2Ipe1xyXG5cdFx0XHRcdGlmKG9wdCl7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmKGF0LnZhbCl7XHJcblx0XHRcdFx0XHRcdGNiKGF0LnB1dCwgYXQuZ2V0LCBhdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMuZ2V0KGZ1bmN0aW9uKGVudiwgZXYpe1xyXG5cdFx0XHRcdFx0Y2IoZW52LnB1dCwgZW52LmdldCwgZW52KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHJcblxyXG5cclxuXHRcdHZhciBncmFwaCA9IHtcclxuXHRcdFx0XHRhcHA6IHtfOnsnIyc6J2FwcCd9LFxyXG5cdFx0XHRcdFx0Zm9vOiB7Xzp7JyMnOidmb28nfSxcclxuXHRcdFx0XHRcdFx0YmFyOiB7JyMnOiAnYXNkZid9LFxyXG5cdFx0XHRcdFx0XHRyYWI6IHsnIyc6ICdmZHNhJ31cclxuXHRcdFx0XHRcdH0vKixcclxuXHRcdFx0XHRcdG9vZjoge186eycjJzonb29mJ30sXHJcblx0XHRcdFx0XHRcdGJhcjoge2JhdDogXCJyZWFsbHlcIn0sXHJcblx0XHRcdFx0XHRcdHJhYjoge2JhdDogXCJuaWNlIVwifVxyXG5cdFx0XHRcdFx0fSovXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRhc2RmOiB7Xzp7JyMnOiAnYXNkZid9LCBiYXo6IFwiaGVsbG8gd29ybGQhXCJ9LFxyXG5cdFx0XHRcdGZkc2E6IHtfOnsnIyc6ICdmZHNhJ30sIGJhejogXCJ3b3JsZCBoZWxsbyFcIn1cclxuXHRcdFx0fVxyXG5cdFx0R3VuLm9uKCdvdXQnLCBmdW5jdGlvbihlbnYpe1xyXG5cdFx0XHRpZighZW52LnRlc3QpeyByZXR1cm4gfVxyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJyZXBseVwiLCBlbnYuZ2V0KTtcclxuXHRcdFx0XHRlbnYuZ3VuLl8ub24oJ2luJywgeydAJzogZW52WycjJ10sXHJcblx0XHRcdFx0XHRwdXQ6IEd1bi5ncmFwaC5ub2RlKGdyYXBoW2Vudi5nZXRbJyMnXV0pXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdGVudi5ndW4uXy5vbignaW4nLCB7cHV0OiBncmFwaCwgJ0AnOiBlbnZbJyMnXX0pO1xyXG5cdFx0XHR9LDEwMCk7XHJcblx0XHR9KTtcclxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHJcblx0XHRcdC8vdmFyIGMgPSBuZXcgQ2hhaW4oKSwgdTtcclxuXHRcdFx0Ly9jLmdldCgnYXBwJykubWFwKCkubWFwKHggPT4geC5iYXQ/IHtiYXo6IHguYmF0fSA6IHUpLmdldCgnYmF6JykudmFsKGZ1bmN0aW9uKGRhdGEsIGtleSwgZW52KXtcclxuXHRcdFx0Ly9cdGNvbnNvbGUubG9nKFwiZW52ZWxvcGVcIiwgZW52KTtcclxuXHRcdFx0Ly99KTtcclxuXHJcblx0XHR9LDEwMDApO1xyXG5cclxuXHR9KShyZXF1aXJlLCAnLi9leHBlcmltZW50Jyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9yb290Jyk7XHJcblx0XHRHdW4uY2hhaW4uYmFjayA9IGZ1bmN0aW9uKG4sIG9wdCl7IHZhciB0bXA7XHJcblx0XHRcdGlmKC0xID09PSBuIHx8IEluZmluaXR5ID09PSBuKXtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5fLnJvb3Q7XHJcblx0XHRcdH0gZWxzZVxyXG5cdFx0XHRpZigxID09PSBuKXtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5fLmJhY2sgfHwgdGhpcztcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgZ3VuID0gdGhpcywgYXQgPSBndW4uXztcclxuXHRcdFx0aWYodHlwZW9mIG4gPT09ICdzdHJpbmcnKXtcclxuXHRcdFx0XHRuID0gbi5zcGxpdCgnLicpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKG4gaW5zdGFuY2VvZiBBcnJheSl7XHJcblx0XHRcdFx0dmFyIGkgPSAwLCBsID0gbi5sZW5ndGgsIHRtcCA9IGF0O1xyXG5cdFx0XHRcdGZvcihpOyBpIDwgbDsgaSsrKXtcclxuXHRcdFx0XHRcdHRtcCA9ICh0bXB8fGVtcHR5KVtuW2ldXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYodSAhPT0gdG1wKXtcclxuXHRcdFx0XHRcdHJldHVybiBvcHQ/IGd1biA6IHRtcDtcclxuXHRcdFx0XHR9IGVsc2VcclxuXHRcdFx0XHRpZigodG1wID0gYXQuYmFjaykpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRtcC5iYWNrKG4sIG9wdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihuIGluc3RhbmNlb2YgRnVuY3Rpb24pe1xyXG5cdFx0XHRcdHZhciB5ZXMsIHRtcCA9IHtiYWNrOiBndW59O1xyXG5cdFx0XHRcdHdoaWxlKCh0bXAgPSB0bXAuYmFjaylcclxuXHRcdFx0XHQmJiAodG1wID0gdG1wLl8pXHJcblx0XHRcdFx0JiYgISh5ZXMgPSBuKHRtcCwgb3B0KSkpe31cclxuXHRcdFx0XHRyZXR1cm4geWVzO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR2YXIgZW1wdHkgPSB7fSwgdTtcclxuXHR9KShyZXF1aXJlLCAnLi9iYWNrJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9yb290Jyk7XHJcblx0XHRHdW4uY2hhaW4uY2hhaW4gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgYXQgPSB0aGlzLl8sIGNoYWluID0gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcyksIGNhdCA9IGNoYWluLl87XHJcblx0XHRcdGNhdC5yb290ID0gcm9vdCA9IGF0LnJvb3Q7XHJcblx0XHRcdGNhdC5pZCA9ICsrcm9vdC5fLm9uY2U7XHJcblx0XHRcdGNhdC5iYWNrID0gdGhpcztcclxuXHRcdFx0Y2F0Lm9uID0gR3VuLm9uO1xyXG5cdFx0XHRHdW4ub24oJ2NoYWluJywgY2F0KTtcclxuXHRcdFx0Y2F0Lm9uKCdpbicsIGlucHV0LCBjYXQpOyAvLyBGb3IgJ2luJyBpZiBJIGFkZCBteSBvd24gbGlzdGVuZXJzIHRvIGVhY2ggdGhlbiBJIE1VU1QgZG8gaXQgYmVmb3JlIGluIGdldHMgY2FsbGVkLiBJZiBJIGxpc3RlbiBnbG9iYWxseSBmb3IgYWxsIGluY29taW5nIGRhdGEgaW5zdGVhZCB0aG91Z2gsIHJlZ2FyZGxlc3Mgb2YgaW5kaXZpZHVhbCBsaXN0ZW5lcnMsIEkgY2FuIHRyYW5zZm9ybSB0aGUgZGF0YSB0aGVyZSBhbmQgdGhlbiBhcyB3ZWxsLlxyXG5cdFx0XHRjYXQub24oJ291dCcsIG91dHB1dCwgY2F0KTsgLy8gSG93ZXZlciBmb3Igb3V0cHV0LCB0aGVyZSBpc24ndCByZWFsbHkgdGhlIGdsb2JhbCBvcHRpb24uIEkgbXVzdCBsaXN0ZW4gYnkgYWRkaW5nIG15IG93biBsaXN0ZW5lciBpbmRpdmlkdWFsbHkgQkVGT1JFIHRoaXMgb25lIGlzIGV2ZXIgY2FsbGVkLlxyXG5cdFx0XHRyZXR1cm4gY2hhaW47XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBvdXRwdXQoYXQpe1xyXG5cdFx0XHR2YXIgY2F0ID0gdGhpcy5hcywgZ3VuID0gY2F0Lmd1biwgcm9vdCA9IGd1bi5iYWNrKC0xKSwgcHV0LCBnZXQsIG5vdywgdG1wO1xyXG5cdFx0XHRpZighYXQuZ3VuKXtcclxuXHRcdFx0XHRhdC5ndW4gPSBndW47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoZ2V0ID0gYXQuZ2V0KXtcclxuXHRcdFx0XHRpZighZ2V0W19zb3VsXSl7XHJcblx0XHRcdFx0XHRpZihvYmpfaGFzKGdldCwgX2ZpZWxkKSl7XHJcblx0XHRcdFx0XHRcdGdldCA9IGdldFtfZmllbGRdO1xyXG5cdFx0XHRcdFx0XHR2YXIgbmV4dCA9IGdldD8gKGd1bi5nZXQoZ2V0KS5fKSA6IGNhdDtcclxuXHRcdFx0XHRcdFx0Ly8gVE9ETzogQlVHISBIYW5kbGUgcGx1cmFsIGNoYWlucyBieSBpdGVyYXRpbmcgb3ZlciB0aGVtLlxyXG5cdFx0XHRcdFx0XHRpZihvYmpfaGFzKG5leHQsICdwdXQnKSl7IC8vIHBvdGVudGlhbGx5IGluY29ycmVjdD8gTWF5YmU/XHJcblx0XHRcdFx0XHRcdC8vaWYodSAhPT0gbmV4dC5wdXQpeyAvLyBwb3RlbnRpYWxseSBpbmNvcnJlY3Q/IE1heWJlP1xyXG5cdFx0XHRcdFx0XHRcdC8vbmV4dC50YWdbJ2luJ10ubGFzdC5uZXh0KG5leHQpO1xyXG5cdFx0XHRcdFx0XHRcdG5leHQub24oJ2luJywgbmV4dCk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmKG9ial9oYXMoY2F0LCAncHV0Jykpe1xyXG5cdFx0XHRcdFx0XHQvL2lmKHUgIT09IGNhdC5wdXQpe1xyXG5cdFx0XHRcdFx0XHRcdHZhciB2YWwgPSBjYXQucHV0LCByZWw7XHJcblx0XHRcdFx0XHRcdFx0aWYocmVsID0gR3VuLm5vZGUuc291bCh2YWwpKXtcclxuXHRcdFx0XHRcdFx0XHRcdHZhbCA9IEd1bi52YWwucmVsLmlmeShyZWwpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRpZihyZWwgPSBHdW4udmFsLnJlbC5pcyh2YWwpKXtcclxuXHRcdFx0XHRcdFx0XHRcdGlmKCFhdC5ndW4uXyl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRcdFx0XHQoYXQuZ3VuLl8pLm9uKCdvdXQnLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGdldDogeycjJzogcmVsLCAnLic6IGdldH0sXHJcblx0XHRcdFx0XHRcdFx0XHRcdCcjJzogcm9vdC5fLmFzayhHdW4uSEFNLnN5bnRoLCBhdC5ndW4pLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRndW46IGF0Lmd1blxyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGlmKHUgPT09IHZhbCB8fCBHdW4udmFsLmlzKHZhbCkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYoIWF0Lmd1bi5fKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdFx0XHRcdChhdC5ndW4uXykub24oJ2luJywge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRnZXQ6IGdldCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0Z3VuOiBhdC5ndW5cclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSBlbHNlXHJcblx0XHRcdFx0XHRcdGlmKGNhdC5tYXApe1xyXG5cdFx0XHRcdFx0XHRcdG9ial9tYXAoY2F0Lm1hcCwgZnVuY3Rpb24ocHJveHkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0cHJveHkuYXQub24oJ2luJywgcHJveHkuYXQpO1xyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmKGNhdC5zb3VsKXtcclxuXHRcdFx0XHRcdFx0XHRpZighYXQuZ3VuLl8peyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0XHRcdChhdC5ndW4uXykub24oJ291dCcsIHtcclxuXHRcdFx0XHRcdFx0XHRcdGdldDogeycjJzogY2F0LnNvdWwsICcuJzogZ2V0fSxcclxuXHRcdFx0XHRcdFx0XHRcdCcjJzogcm9vdC5fLmFzayhHdW4uSEFNLnN5bnRoLCBhdC5ndW4pLFxyXG5cdFx0XHRcdFx0XHRcdFx0Z3VuOiBhdC5ndW5cclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYoY2F0LmdldCl7XHJcblx0XHRcdFx0XHRcdFx0aWYoIWNhdC5iYWNrLl8peyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0XHRcdChjYXQuYmFjay5fKS5vbignb3V0Jywge1xyXG5cdFx0XHRcdFx0XHRcdFx0Z2V0OiBvYmpfcHV0KHt9LCBfZmllbGQsIGNhdC5nZXQpLFxyXG5cdFx0XHRcdFx0XHRcdFx0Z3VuOiBndW5cclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YXQgPSBvYmpfdG8oYXQsIHtnZXQ6IHt9fSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZihvYmpfaGFzKGNhdCwgJ3B1dCcpKXtcclxuXHRcdFx0XHRcdFx0Ly9pZih1ICE9PSBjYXQucHV0KXtcclxuXHRcdFx0XHRcdFx0XHRjYXQub24oJ2luJywgY2F0KTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlXHJcblx0XHRcdFx0XHRcdGlmKGNhdC5tYXApe1xyXG5cdFx0XHRcdFx0XHRcdG9ial9tYXAoY2F0Lm1hcCwgZnVuY3Rpb24ocHJveHkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0cHJveHkuYXQub24oJ2luJywgcHJveHkuYXQpO1xyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmKGNhdC5hY2spe1xyXG5cdFx0XHRcdFx0XHRcdGlmKCFvYmpfaGFzKGNhdCwgJ3B1dCcpKXsgLy8gdSAhPT0gY2F0LnB1dCBpbnN0ZWFkP1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRjYXQuYWNrID0gLTE7XHJcblx0XHRcdFx0XHRcdGlmKGNhdC5zb3VsKXtcclxuXHRcdFx0XHRcdFx0XHRjYXQub24oJ291dCcsIHtcclxuXHRcdFx0XHRcdFx0XHRcdGdldDogeycjJzogY2F0LnNvdWx9LFxyXG5cdFx0XHRcdFx0XHRcdFx0JyMnOiByb290Ll8uYXNrKEd1bi5IQU0uc3ludGgsIGNhdC5ndW4pLFxyXG5cdFx0XHRcdFx0XHRcdFx0Z3VuOiBjYXQuZ3VuXHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmKGNhdC5nZXQpe1xyXG5cdFx0XHRcdFx0XHRcdGlmKCFjYXQuYmFjay5fKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdFx0XHQoY2F0LmJhY2suXykub24oJ291dCcsIHtcclxuXHRcdFx0XHRcdFx0XHRcdGdldDogb2JqX3B1dCh7fSwgX2ZpZWxkLCBjYXQuZ2V0KSxcclxuXHRcdFx0XHRcdFx0XHRcdGd1bjogY2F0Lmd1blxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQoY2F0LmJhY2suXykub24oJ291dCcsIGF0KTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIGlucHV0KGF0KXtcclxuXHRcdFx0YXQgPSBhdC5fIHx8IGF0O1xyXG5cdFx0XHR2YXIgZXYgPSB0aGlzLCBjYXQgPSB0aGlzLmFzLCBndW4gPSBhdC5ndW4sIGNvYXQgPSBndW4uXywgY2hhbmdlID0gYXQucHV0LCBiYWNrID0gY2F0LmJhY2suXyB8fCBlbXB0eSwgcmVsLCB0bXA7XHJcblx0XHRcdGlmKDAgPiBjYXQuYWNrICYmICFHdW4udmFsLnJlbC5pcyhjaGFuZ2UpKXsgLy8gZm9yIGJldHRlciBiZWhhdmlvcj9cclxuXHRcdFx0XHRjYXQuYWNrID0gMTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjYXQuZ2V0ICYmIGF0LmdldCAhPT0gY2F0LmdldCl7XHJcblx0XHRcdFx0YXQgPSBvYmpfdG8oYXQsIHtnZXQ6IGNhdC5nZXR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjYXQuZmllbGQgJiYgY29hdCAhPT0gY2F0KXtcclxuXHRcdFx0XHRhdCA9IG9ial90byhhdCwge2d1bjogY2F0Lmd1bn0pO1xyXG5cdFx0XHRcdGlmKGNvYXQuYWNrKXtcclxuXHRcdFx0XHRcdGNhdC5hY2sgPSBjYXQuYWNrIHx8IGNvYXQuYWNrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZih1ID09PSBjaGFuZ2Upe1xyXG5cdFx0XHRcdGV2LnRvLm5leHQoYXQpO1xyXG5cdFx0XHRcdGlmKGNhdC5zb3VsKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRlY2hvKGNhdCwgYXQsIGV2KTtcclxuXHRcdFx0XHRpZihjYXQuZmllbGQpe1xyXG5cdFx0XHRcdFx0bm90KGNhdCwgYXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRvYmpfZGVsKGNvYXQuZWNobywgY2F0LmlkKTtcclxuXHRcdFx0XHRvYmpfZGVsKGNhdC5tYXAsIGNvYXQuaWQpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjYXQuc291bCl7XHJcblx0XHRcdFx0aWYoY2F0LnJvb3QuXy5ub3cpeyBhdCA9IG9ial90byhhdCwge3B1dDogY2hhbmdlID0gY29hdC5wdXR9KSB9IC8vIFRPRE86IFVnbHkgaGFjayBmb3IgdW5jYWNoZWQgc3luY2hyb25vdXMgbWFwcy5cclxuXHRcdFx0XHRldi50by5uZXh0KGF0KTtcclxuXHRcdFx0XHRlY2hvKGNhdCwgYXQsIGV2KTtcclxuXHRcdFx0XHRvYmpfbWFwKGNoYW5nZSwgbWFwLCB7YXQ6IGF0LCBjYXQ6IGNhdH0pO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZighKHJlbCA9IEd1bi52YWwucmVsLmlzKGNoYW5nZSkpKXtcclxuXHRcdFx0XHRpZihHdW4udmFsLmlzKGNoYW5nZSkpe1xyXG5cdFx0XHRcdFx0aWYoY2F0LmZpZWxkIHx8IGNhdC5zb3VsKXtcclxuXHRcdFx0XHRcdFx0bm90KGNhdCwgYXQpO1xyXG5cdFx0XHRcdFx0fSBlbHNlXHJcblx0XHRcdFx0XHRpZihjb2F0LmZpZWxkIHx8IGNvYXQuc291bCl7XHJcblx0XHRcdFx0XHRcdChjb2F0LmVjaG8gfHwgKGNvYXQuZWNobyA9IHt9KSlbY2F0LmlkXSA9IGNhdDtcclxuXHRcdFx0XHRcdFx0KGNhdC5tYXAgfHwgKGNhdC5tYXAgPSB7fSkpW2NvYXQuaWRdID0gY2F0Lm1hcFtjb2F0LmlkXSB8fCB7YXQ6IGNvYXR9O1xyXG5cdFx0XHRcdFx0XHQvL2lmKHUgPT09IGNvYXQucHV0KXsgcmV0dXJuIH0gLy8gTm90IG5lY2Vzc2FyeSBidXQgaW1wcm92ZXMgcGVyZm9ybWFuY2UuIElmIHdlIGhhdmUgaXQgYnV0IGNvYXQgZG9lcyBub3QsIHRoYXQgbWVhbnMgd2UgZ290IHRoaW5ncyBvdXQgb2Ygb3JkZXIgYW5kIGNvYXQgd2lsbCBnZXQgaXQuIE9uY2UgY29hdCBnZXRzIGl0LCBpdCB3aWxsIHRlbGwgdXMgYWdhaW4uXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRldi50by5uZXh0KGF0KTtcclxuXHRcdFx0XHRcdGVjaG8oY2F0LCBhdCwgZXYpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihjYXQuZmllbGQgJiYgY29hdCAhPT0gY2F0ICYmIG9ial9oYXMoY29hdCwgJ3B1dCcpKXtcclxuXHRcdFx0XHRcdGNhdC5wdXQgPSBjb2F0LnB1dDtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGlmKChyZWwgPSBHdW4ubm9kZS5zb3VsKGNoYW5nZSkpICYmIGNvYXQuZmllbGQpe1xyXG5cdFx0XHRcdFx0Y29hdC5wdXQgPSAoY2F0LnJvb3QuZ2V0KHJlbCkuXykucHV0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRldi50by5uZXh0KGF0KTtcclxuXHRcdFx0XHRlY2hvKGNhdCwgYXQsIGV2KTtcclxuXHRcdFx0XHRyZWxhdGUoY2F0LCBhdCwgY29hdCwgcmVsKTtcclxuXHRcdFx0XHRvYmpfbWFwKGNoYW5nZSwgbWFwLCB7YXQ6IGF0LCBjYXQ6IGNhdH0pO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZWxhdGUoY2F0LCBhdCwgY29hdCwgcmVsKTtcclxuXHRcdFx0ZXYudG8ubmV4dChhdCk7XHJcblx0XHRcdGVjaG8oY2F0LCBhdCwgZXYpO1xyXG5cdFx0fVxyXG5cdFx0R3VuLmNoYWluLmNoYWluLmlucHV0ID0gaW5wdXQ7XHJcblx0XHRmdW5jdGlvbiByZWxhdGUoY2F0LCBhdCwgY29hdCwgcmVsKXtcclxuXHRcdFx0aWYoIXJlbCB8fCBub2RlXyA9PT0gY2F0LmdldCl7IHJldHVybiB9XHJcblx0XHRcdHZhciB0bXAgPSAoY2F0LnJvb3QuZ2V0KHJlbCkuXyk7XHJcblx0XHRcdGlmKGNhdC5maWVsZCl7XHJcblx0XHRcdFx0Y29hdCA9IHRtcDtcclxuXHRcdFx0fSBlbHNlIFxyXG5cdFx0XHRpZihjb2F0LmZpZWxkKXtcclxuXHRcdFx0XHRyZWxhdGUoY29hdCwgYXQsIGNvYXQsIHJlbCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY29hdCA9PT0gY2F0KXsgcmV0dXJuIH1cclxuXHRcdFx0KGNvYXQuZWNobyB8fCAoY29hdC5lY2hvID0ge30pKVtjYXQuaWRdID0gY2F0O1xyXG5cdFx0XHRpZihjYXQuZmllbGQgJiYgIShjYXQubWFwfHxlbXB0eSlbY29hdC5pZF0pe1xyXG5cdFx0XHRcdG5vdChjYXQsIGF0KTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0bXAgPSAoY2F0Lm1hcCB8fCAoY2F0Lm1hcCA9IHt9KSlbY29hdC5pZF0gPSBjYXQubWFwW2NvYXQuaWRdIHx8IHthdDogY29hdH07XHJcblx0XHRcdGlmKHJlbCAhPT0gdG1wLnJlbCl7XHJcblx0XHRcdFx0YXNrKGNhdCwgdG1wLnJlbCA9IHJlbCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIGVjaG8oY2F0LCBhdCwgZXYpe1xyXG5cdFx0XHRpZighY2F0LmVjaG8peyByZXR1cm4gfSAvLyB8fCBub2RlXyA9PT0gYXQuZ2V0ID8/Pz9cclxuXHRcdFx0aWYoY2F0LmZpZWxkKXsgYXQgPSBvYmpfdG8oYXQsIHtldmVudDogZXZ9KSB9XHJcblx0XHRcdG9ial9tYXAoY2F0LmVjaG8sIHJldmVyYiwgYXQpO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gcmV2ZXJiKGNhdCl7XHJcblx0XHRcdGNhdC5vbignaW4nLCB0aGlzKTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIG1hcChkYXRhLCBrZXkpeyAvLyBNYXAgb3ZlciBvbmx5IHRoZSBjaGFuZ2VzIG9uIGV2ZXJ5IHVwZGF0ZS5cclxuXHRcdFx0dmFyIGNhdCA9IHRoaXMuY2F0LCBuZXh0ID0gY2F0Lm5leHQgfHwgZW1wdHksIHZpYSA9IHRoaXMuYXQsIGd1biwgY2hhaW4sIGF0LCB0bXA7XHJcblx0XHRcdGlmKG5vZGVfID09PSBrZXkgJiYgIW5leHRba2V5XSl7IHJldHVybiB9XHJcblx0XHRcdGlmKCEoZ3VuID0gbmV4dFtrZXldKSl7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGF0ID0gKGd1bi5fKTtcclxuXHRcdFx0Ly9pZihkYXRhICYmIGRhdGFbX3NvdWxdICYmICh0bXAgPSBHdW4udmFsLnJlbC5pcyhkYXRhKSkgJiYgKHRtcCA9IChjYXQucm9vdC5nZXQodG1wKS5fKSkgJiYgb2JqX2hhcyh0bXAsICdwdXQnKSl7XHJcblx0XHRcdC8vXHRkYXRhID0gdG1wLnB1dDtcclxuXHRcdFx0Ly99XHJcblx0XHRcdGlmKGF0LmZpZWxkKXtcclxuXHRcdFx0XHRpZighKGRhdGEgJiYgZGF0YVtfc291bF0gJiYgR3VuLnZhbC5yZWwuaXMoZGF0YSkgPT09IEd1bi5ub2RlLnNvdWwoYXQucHV0KSkpe1xyXG5cdFx0XHRcdFx0YXQucHV0ID0gZGF0YTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2hhaW4gPSBndW47XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y2hhaW4gPSB2aWEuZ3VuLmdldChrZXkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGF0Lm9uKCdpbicsIHtcclxuXHRcdFx0XHRwdXQ6IGRhdGEsXHJcblx0XHRcdFx0Z2V0OiBrZXksXHJcblx0XHRcdFx0Z3VuOiBjaGFpbixcclxuXHRcdFx0XHR2aWE6IHZpYVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIG5vdChjYXQsIGF0KXtcclxuXHRcdFx0aWYoIShjYXQuZmllbGQgfHwgY2F0LnNvdWwpKXsgcmV0dXJuIH1cclxuXHRcdFx0dmFyIHRtcCA9IGNhdC5tYXA7XHJcblx0XHRcdGNhdC5tYXAgPSBudWxsO1xyXG5cdFx0XHRpZihudWxsID09PSB0bXApeyByZXR1cm4gfVxyXG5cdFx0XHRpZih1ID09PSB0bXAgJiYgY2F0LnB1dCAhPT0gdSl7IHJldHVybiB9IC8vIFRPRE86IEJ1Zz8gVGhyZXcgc2Vjb25kIGNvbmRpdGlvbiBpbiBmb3IgYSBwYXJ0aWN1bGFyIHRlc3QsIG5vdCBzdXJlIGlmIGEgY291bnRlciBleGFtcGxlIGlzIHRlc3RlZCB0aG91Z2guXHJcblx0XHRcdG9ial9tYXAodG1wLCBmdW5jdGlvbihwcm94eSl7XHJcblx0XHRcdFx0aWYoIShwcm94eSA9IHByb3h5LmF0KSl7IHJldHVybiB9XHJcblx0XHRcdFx0b2JqX2RlbChwcm94eS5lY2hvLCBjYXQuaWQpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0b2JqX21hcChjYXQubmV4dCwgZnVuY3Rpb24oZ3VuLCBrZXkpe1xyXG5cdFx0XHRcdHZhciBjb2F0ID0gKGd1bi5fKTtcclxuXHRcdFx0XHRjb2F0LnB1dCA9IHU7XHJcblx0XHRcdFx0aWYoY29hdC5hY2spe1xyXG5cdFx0XHRcdFx0Y29hdC5hY2sgPSAtMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y29hdC5vbignaW4nLCB7XHJcblx0XHRcdFx0XHRnZXQ6IGtleSxcclxuXHRcdFx0XHRcdGd1bjogZ3VuLFxyXG5cdFx0XHRcdFx0cHV0OiB1XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gYXNrKGNhdCwgc291bCl7XHJcblx0XHRcdHZhciB0bXAgPSAoY2F0LnJvb3QuZ2V0KHNvdWwpLl8pO1xyXG5cdFx0XHRpZihjYXQuYWNrKXtcclxuXHRcdFx0XHR0bXAuYWNrID0gdG1wLmFjayB8fCAtMTtcclxuXHRcdFx0XHR0bXAub24oJ291dCcsIHtcclxuXHRcdFx0XHRcdGdldDogeycjJzogc291bH0sXHJcblx0XHRcdFx0XHQnIyc6IGNhdC5yb290Ll8uYXNrKEd1bi5IQU0uc3ludGgsIHRtcC5ndW4pLFxyXG5cdFx0XHRcdFx0Z3VuOiB0bXAuZ3VuXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdG9ial9tYXAoY2F0Lm5leHQsIGZ1bmN0aW9uKGd1biwga2V5KXtcclxuXHRcdFx0XHQoZ3VuLl8pLm9uKCdvdXQnLCB7XHJcblx0XHRcdFx0XHRnZXQ6IHsnIyc6IHNvdWwsICcuJzoga2V5fSxcclxuXHRcdFx0XHRcdCcjJzogY2F0LnJvb3QuXy5hc2soR3VuLkhBTS5zeW50aCwgdG1wLmd1biksXHJcblx0XHRcdFx0XHRndW46IGd1blxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdHZhciBlbXB0eSA9IHt9LCB1O1xyXG5cdFx0dmFyIG9iaiA9IEd1bi5vYmosIG9ial9oYXMgPSBvYmouaGFzLCBvYmpfcHV0ID0gb2JqLnB1dCwgb2JqX2RlbCA9IG9iai5kZWwsIG9ial90byA9IG9iai50bywgb2JqX21hcCA9IG9iai5tYXA7XHJcblx0XHR2YXIgX3NvdWwgPSBHdW4uXy5zb3VsLCBfZmllbGQgPSBHdW4uXy5maWVsZCwgbm9kZV8gPSBHdW4ubm9kZS5fO1xyXG5cdH0pKHJlcXVpcmUsICcuL2NoYWluJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9yb290Jyk7XHJcblx0XHRHdW4uY2hhaW4uZ2V0ID0gZnVuY3Rpb24oa2V5LCBjYiwgYXMpe1xyXG5cdFx0XHRpZih0eXBlb2Yga2V5ID09PSAnc3RyaW5nJyl7XHJcblx0XHRcdFx0dmFyIGd1biwgYmFjayA9IHRoaXMsIGNhdCA9IGJhY2suXztcclxuXHRcdFx0XHR2YXIgbmV4dCA9IGNhdC5uZXh0IHx8IGVtcHR5LCB0bXA7XHJcblx0XHRcdFx0aWYoIShndW4gPSBuZXh0W2tleV0pKXtcclxuXHRcdFx0XHRcdGd1biA9IGNhY2hlKGtleSwgYmFjayk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2VcclxuXHRcdFx0aWYoa2V5IGluc3RhbmNlb2YgRnVuY3Rpb24pe1xyXG5cdFx0XHRcdHZhciBndW4gPSB0aGlzLCBhdCA9IGd1bi5fO1xyXG5cdFx0XHRcdGFzID0gY2IgfHwge307XHJcblx0XHRcdFx0YXMudXNlID0ga2V5O1xyXG5cdFx0XHRcdGFzLm91dCA9IGFzLm91dCB8fCB7Y2FwOiAxfTtcclxuXHRcdFx0XHRhcy5vdXQuZ2V0ID0gYXMub3V0LmdldCB8fCB7fTtcclxuXHRcdFx0XHQnXycgIT0gYXQuZ2V0ICYmICgoYXQucm9vdC5fKS5ub3cgPSB0cnVlKTsgLy8gdWdseSBoYWNrIGZvciBub3cuXHJcblx0XHRcdFx0YXQub24oJ2luJywgdXNlLCBhcyk7XHJcblx0XHRcdFx0YXQub24oJ291dCcsIGFzLm91dCk7XHJcblx0XHRcdFx0KGF0LnJvb3QuXykubm93ID0gZmFsc2U7XHJcblx0XHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdFx0fSBlbHNlXHJcblx0XHRcdGlmKG51bV9pcyhrZXkpKXtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5nZXQoJycra2V5LCBjYiwgYXMpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdChhcyA9IHRoaXMuY2hhaW4oKSkuXy5lcnIgPSB7ZXJyOiBHdW4ubG9nKCdJbnZhbGlkIGdldCByZXF1ZXN0IScsIGtleSl9OyAvLyBDTEVBTiBVUFxyXG5cdFx0XHRcdGlmKGNiKXsgY2IuY2FsbChhcywgYXMuXy5lcnIpIH1cclxuXHRcdFx0XHRyZXR1cm4gYXM7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYodG1wID0gY2F0LnN0dW4peyAvLyBUT0RPOiBSZWZhY3Rvcj9cclxuXHRcdFx0XHRndW4uXy5zdHVuID0gZ3VuLl8uc3R1biB8fCB0bXA7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY2IgJiYgY2IgaW5zdGFuY2VvZiBGdW5jdGlvbil7XHJcblx0XHRcdFx0Z3VuLmdldChjYiwgYXMpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBndW47XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBjYWNoZShrZXksIGJhY2spe1xyXG5cdFx0XHR2YXIgY2F0ID0gYmFjay5fLCBuZXh0ID0gY2F0Lm5leHQsIGd1biA9IGJhY2suY2hhaW4oKSwgYXQgPSBndW4uXztcclxuXHRcdFx0aWYoIW5leHQpeyBuZXh0ID0gY2F0Lm5leHQgPSB7fSB9XHJcblx0XHRcdG5leHRbYXQuZ2V0ID0ga2V5XSA9IGd1bjtcclxuXHRcdFx0aWYoY2F0LnJvb3QgPT09IGJhY2speyBhdC5zb3VsID0ga2V5IH1cclxuXHRcdFx0ZWxzZSBpZihjYXQuc291bCB8fCBjYXQuZmllbGQpeyBhdC5maWVsZCA9IGtleSB9XHJcblx0XHRcdHJldHVybiBndW47XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiB1c2UoYXQpe1xyXG5cdFx0XHR2YXIgZXYgPSB0aGlzLCBhcyA9IGV2LmFzLCBndW4gPSBhdC5ndW4sIGNhdCA9IGd1bi5fLCBkYXRhID0gYXQucHV0LCB0bXA7XHJcblx0XHRcdGlmKHUgPT09IGRhdGEpe1xyXG5cdFx0XHRcdGRhdGEgPSBjYXQucHV0O1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCh0bXAgPSBkYXRhKSAmJiB0bXBbcmVsLl9dICYmICh0bXAgPSByZWwuaXModG1wKSkpe1xyXG5cdFx0XHRcdHRtcCA9IChjYXQucm9vdC5nZXQodG1wKS5fKTtcclxuXHRcdFx0XHRpZih1ICE9PSB0bXAucHV0KXtcclxuXHRcdFx0XHRcdGF0ID0gb2JqX3RvKGF0LCB7cHV0OiB0bXAucHV0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGFzLnVzZShhdCwgYXQuZXZlbnQgfHwgZXYpO1xyXG5cdFx0XHRldi50by5uZXh0KGF0KTtcclxuXHRcdH1cclxuXHRcdHZhciBvYmogPSBHdW4ub2JqLCBvYmpfaGFzID0gb2JqLmhhcywgb2JqX3RvID0gR3VuLm9iai50bztcclxuXHRcdHZhciBudW1faXMgPSBHdW4ubnVtLmlzO1xyXG5cdFx0dmFyIHJlbCA9IEd1bi52YWwucmVsLCBub2RlXyA9IEd1bi5ub2RlLl87XHJcblx0XHR2YXIgZW1wdHkgPSB7fSwgdTtcclxuXHR9KShyZXF1aXJlLCAnLi9nZXQnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL3Jvb3QnKTtcclxuXHRcdEd1bi5jaGFpbi5wdXQgPSBmdW5jdGlvbihkYXRhLCBjYiwgYXMpe1xyXG5cdFx0XHQvLyAjc291bC5maWVsZD12YWx1ZT5zdGF0ZVxyXG5cdFx0XHQvLyB+d2hvI3doZXJlLndoZXJlPXdoYXQ+d2hlbkB3YXNcclxuXHRcdFx0Ly8gVE9ETzogQlVHISBQdXQgcHJvYmFibHkgY2Fubm90IGhhbmRsZSBwbHVyYWwgY2hhaW5zIVxyXG5cdFx0XHR2YXIgZ3VuID0gdGhpcywgYXQgPSAoZ3VuLl8pLCByb290ID0gYXQucm9vdCwgdG1wO1xyXG5cdFx0XHRhcyA9IGFzIHx8IHt9O1xyXG5cdFx0XHRhcy5kYXRhID0gZGF0YTtcclxuXHRcdFx0YXMuZ3VuID0gYXMuZ3VuIHx8IGd1bjtcclxuXHRcdFx0aWYodHlwZW9mIGNiID09PSAnc3RyaW5nJyl7XHJcblx0XHRcdFx0YXMuc291bCA9IGNiO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGFzLmFjayA9IGNiO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGF0LnNvdWwpe1xyXG5cdFx0XHRcdGFzLnNvdWwgPSBhdC5zb3VsO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGFzLnNvdWwgfHwgcm9vdCA9PT0gZ3VuKXtcclxuXHRcdFx0XHRpZighb2JqX2lzKGFzLmRhdGEpKXtcclxuXHRcdFx0XHRcdChhcy5hY2t8fG5vb3ApLmNhbGwoYXMsIGFzLm91dCA9IHtlcnI6IEd1bi5sb2coXCJEYXRhIHNhdmVkIHRvIHRoZSByb290IGxldmVsIG9mIHRoZSBncmFwaCBtdXN0IGJlIGEgbm9kZSAoYW4gb2JqZWN0KSwgbm90IGFcIiwgKHR5cGVvZiBhcy5kYXRhKSwgJ29mIFwiJyArIGFzLmRhdGEgKyAnXCIhJyl9KTtcclxuXHRcdFx0XHRcdGlmKGFzLnJlcyl7IGFzLnJlcygpIH1cclxuXHRcdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGFzLmd1biA9IGd1biA9IHJvb3QuZ2V0KGFzLnNvdWwgPSBhcy5zb3VsIHx8IChhcy5ub3QgPSBHdW4ubm9kZS5zb3VsKGFzLmRhdGEpIHx8ICgocm9vdC5fKS5vcHQudXVpZCB8fCBHdW4udGV4dC5yYW5kb20pKCkpKTtcclxuXHRcdFx0XHRhcy5yZWYgPSBhcy5ndW47XHJcblx0XHRcdFx0aWZ5KGFzKTtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKEd1bi5pcyhkYXRhKSl7XHJcblx0XHRcdFx0ZGF0YS5nZXQoZnVuY3Rpb24oYXQsZXYpe2V2Lm9mZigpO1xyXG5cdFx0XHRcdFx0dmFyIHMgPSBHdW4ubm9kZS5zb3VsKGF0LnB1dCk7XHJcblx0XHRcdFx0XHRpZighcyl7R3VuLmxvZyhcIlRoZSByZWZlcmVuY2UgeW91IGFyZSBzYXZpbmcgaXMgYVwiLCB0eXBlb2YgYXQucHV0LCAnXCInKyBhcy5wdXQgKydcIiwgbm90IGEgbm9kZSAob2JqZWN0KSEnKTtyZXR1cm59XHJcblx0XHRcdFx0XHRndW4ucHV0KEd1bi52YWwucmVsLmlmeShzKSwgY2IsIGFzKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFzLnJlZiA9IGFzLnJlZiB8fCAocm9vdCA9PT0gKHRtcCA9IGF0LmJhY2spKT8gZ3VuIDogdG1wO1xyXG5cdFx0XHRpZihhcy5yZWYuXy5zb3VsICYmIEd1bi52YWwuaXMoYXMuZGF0YSkgJiYgYXQuZ2V0KXtcclxuXHRcdFx0XHRhcy5kYXRhID0gb2JqX3B1dCh7fSwgYXQuZ2V0LCBhcy5kYXRhKTtcclxuXHRcdFx0XHRhcy5yZWYucHV0KGFzLmRhdGEsIGFzLnNvdWwsIGFzKTtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFzLnJlZi5nZXQoJ18nKS5nZXQoYW55LCB7YXM6IGFzfSk7XHJcblx0XHRcdGlmKCFhcy5vdXQpe1xyXG5cdFx0XHRcdC8vIFRPRE86IFBlcmYgaWRlYSEgTWFrZSBhIGdsb2JhbCBsb2NrLCB0aGF0IGJsb2NrcyBldmVyeXRoaW5nIHdoaWxlIGl0IGlzIG9uLCBidXQgaWYgaXQgaXMgb24gdGhlIGxvY2sgaXQgZG9lcyB0aGUgZXhwZW5zaXZlIGxvb2t1cCB0byBzZWUgaWYgaXQgaXMgYSBkZXBlbmRlbnQgd3JpdGUgb3Igbm90IGFuZCBpZiBub3QgdGhlbiBpdCBwcm9jZWVkcyBmdWxsIHNwZWVkLiBNZWg/IEZvciB3cml0ZSBoZWF2eSBhc3luYyBhcHBzIHRoYXQgd291bGQgYmUgdGVycmlibGUuXHJcblx0XHRcdFx0YXMucmVzID0gYXMucmVzIHx8IEd1bi5vbi5zdHVuKGFzLnJlZik7XHJcblx0XHRcdFx0YXMuZ3VuLl8uc3R1biA9IGFzLnJlZi5fLnN0dW47XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdH07XHJcblxyXG5cdFx0ZnVuY3Rpb24gaWZ5KGFzKXtcclxuXHRcdFx0YXMuYmF0Y2ggPSBiYXRjaDtcclxuXHRcdFx0dmFyIG9wdCA9IGFzLm9wdHx8e30sIGVudiA9IGFzLmVudiA9IEd1bi5zdGF0ZS5tYXAobWFwLCBvcHQuc3RhdGUpO1xyXG5cdFx0XHRlbnYuc291bCA9IGFzLnNvdWw7XHJcblx0XHRcdGFzLmdyYXBoID0gR3VuLmdyYXBoLmlmeShhcy5kYXRhLCBlbnYsIGFzKTtcclxuXHRcdFx0aWYoZW52LmVycil7XHJcblx0XHRcdFx0KGFzLmFja3x8bm9vcCkuY2FsbChhcywgYXMub3V0ID0ge2VycjogR3VuLmxvZyhlbnYuZXJyKX0pO1xyXG5cdFx0XHRcdGlmKGFzLnJlcyl7IGFzLnJlcygpIH1cclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0YXMuYmF0Y2goKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBiYXRjaCgpeyB2YXIgYXMgPSB0aGlzO1xyXG5cdFx0XHRpZighYXMuZ3JhcGggfHwgb2JqX21hcChhcy5zdHVuLCBubykpeyByZXR1cm4gfVxyXG5cdFx0XHQoYXMucmVzfHxpaWZlKShmdW5jdGlvbigpe1xyXG5cdFx0XHRcdChhcy5yZWYuXykub24oJ291dCcsIHtcclxuXHRcdFx0XHRcdGNhcDogMyxcclxuXHRcdFx0XHRcdGd1bjogYXMucmVmLCBwdXQ6IGFzLm91dCA9IGFzLmVudi5ncmFwaCwgb3B0OiBhcy5vcHQsXHJcblx0XHRcdFx0XHQnIyc6IGFzLmd1bi5iYWNrKC0xKS5fLmFzayhmdW5jdGlvbihhY2speyB0aGlzLm9mZigpOyAvLyBPbmUgcmVzcG9uc2UgaXMgZ29vZCBlbm91Z2ggZm9yIHVzIGN1cnJlbnRseS4gTGF0ZXIgd2UgbWF5IHdhbnQgdG8gYWRqdXN0IHRoaXMuXHJcblx0XHRcdFx0XHRcdGlmKCFhcy5hY2speyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0XHRhcy5hY2soYWNrLCB0aGlzKTtcclxuXHRcdFx0XHRcdH0sIGFzLm9wdClcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSwgYXMpO1xyXG5cdFx0XHRpZihhcy5yZXMpeyBhcy5yZXMoKSB9XHJcblx0XHR9IGZ1bmN0aW9uIG5vKHYsZil7IGlmKHYpeyByZXR1cm4gdHJ1ZSB9IH1cclxuXHJcblx0XHRmdW5jdGlvbiBtYXAodixmLG4sIGF0KXsgdmFyIGFzID0gdGhpcztcclxuXHRcdFx0aWYoZiB8fCAhYXQucGF0aC5sZW5ndGgpeyByZXR1cm4gfVxyXG5cdFx0XHQoYXMucmVzfHxpaWZlKShmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciBwYXRoID0gYXQucGF0aCwgcmVmID0gYXMucmVmLCBvcHQgPSBhcy5vcHQ7XHJcblx0XHRcdFx0dmFyIGkgPSAwLCBsID0gcGF0aC5sZW5ndGg7XHJcblx0XHRcdFx0Zm9yKGk7IGkgPCBsOyBpKyspe1xyXG5cdFx0XHRcdFx0cmVmID0gcmVmLmdldChwYXRoW2ldKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoYXMubm90IHx8IEd1bi5ub2RlLnNvdWwoYXQub2JqKSl7XHJcblx0XHRcdFx0XHRhdC5zb3VsKEd1bi5ub2RlLnNvdWwoYXQub2JqKSB8fCAoKGFzLm9wdHx8e30pLnV1aWQgfHwgYXMuZ3VuLmJhY2soJ29wdC51dWlkJykgfHwgR3VuLnRleHQucmFuZG9tKSgpKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0KGFzLnN0dW4gPSBhcy5zdHVuIHx8IHt9KVtwYXRoXSA9IHRydWU7XHJcblx0XHRcdFx0cmVmLmdldCgnXycpLmdldChzb3VsLCB7YXM6IHthdDogYXQsIGFzOiBhc319KTtcclxuXHRcdFx0fSwge2FzOiBhcywgYXQ6IGF0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gc291bChhdCwgZXYpeyB2YXIgYXMgPSB0aGlzLmFzLCBjYXQgPSBhcy5hdDsgYXMgPSBhcy5hcztcclxuXHRcdFx0Ly9ldi5zdHVuKCk7IC8vIFRPRE86IEJVRyE/XHJcblx0XHRcdGlmKCFhdC5ndW4gfHwgIWF0Lmd1bi5fLmJhY2speyByZXR1cm4gfSAvLyBUT0RPOiBIYW5kbGVcclxuXHRcdFx0ZXYub2ZmKCk7XHJcblx0XHRcdGF0ID0gKGF0Lmd1bi5fLmJhY2suXyk7XHJcblx0XHRcdGNhdC5zb3VsKEd1bi5ub2RlLnNvdWwoY2F0Lm9iaikgfHwgR3VuLm5vZGUuc291bChhdC5wdXQpIHx8IEd1bi52YWwucmVsLmlzKGF0LnB1dCkgfHwgKChhcy5vcHR8fHt9KS51dWlkIHx8IGFzLmd1bi5iYWNrKCdvcHQudXVpZCcpIHx8IEd1bi50ZXh0LnJhbmRvbSkoKSk7IC8vIFRPRE86IEJVRyE/IERvIHdlIHJlYWxseSB3YW50IHRoZSBzb3VsIG9mIHRoZSBvYmplY3QgZ2l2ZW4gdG8gdXM/IENvdWxkIHRoYXQgYmUgZGFuZ2Vyb3VzP1xyXG5cdFx0XHRhcy5zdHVuW2NhdC5wYXRoXSA9IGZhbHNlO1xyXG5cdFx0XHRhcy5iYXRjaCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGFueShhdCwgZXYpe1xyXG5cdFx0XHR2YXIgYXMgPSB0aGlzLmFzO1xyXG5cdFx0XHRpZighYXQuZ3VuIHx8ICFhdC5ndW4uXyl7IHJldHVybiB9IC8vIFRPRE86IEhhbmRsZVxyXG5cdFx0XHRpZihhdC5lcnIpeyAvLyBUT0RPOiBIYW5kbGVcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIlBsZWFzZSByZXBvcnQgdGhpcyBhcyBhbiBpc3N1ZSEgUHV0LmFueS5lcnJcIik7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBjYXQgPSAoYXQuZ3VuLl8uYmFjay5fKSwgZGF0YSA9IGNhdC5wdXQsIG9wdCA9IGFzLm9wdHx8e30sIHJvb3QsIHRtcDtcclxuXHRcdFx0ZXYub2ZmKCk7XHJcblx0XHRcdGlmKGFzLnJlZiAhPT0gYXMuZ3VuKXtcclxuXHRcdFx0XHR0bXAgPSAoYXMuZ3VuLl8pLmdldCB8fCBjYXQuZ2V0O1xyXG5cdFx0XHRcdGlmKCF0bXApeyAvLyBUT0RPOiBIYW5kbGVcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiUGxlYXNlIHJlcG9ydCB0aGlzIGFzIGFuIGlzc3VlISBQdXQubm8uZ2V0XCIpOyAvLyBUT0RPOiBCVUchPz9cclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YXMuZGF0YSA9IG9ial9wdXQoe30sIHRtcCwgYXMuZGF0YSk7XHJcblx0XHRcdFx0dG1wID0gbnVsbDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih1ID09PSBkYXRhKXtcclxuXHRcdFx0XHRpZighY2F0LmdldCl7IHJldHVybiB9IC8vIFRPRE86IEhhbmRsZVxyXG5cdFx0XHRcdGlmKCFjYXQuc291bCl7XHJcblx0XHRcdFx0XHR0bXAgPSBjYXQuZ3VuLmJhY2soZnVuY3Rpb24oYXQpe1xyXG5cdFx0XHRcdFx0XHRpZihhdC5zb3VsKXsgcmV0dXJuIGF0LnNvdWwgfVxyXG5cdFx0XHRcdFx0XHRhcy5kYXRhID0gb2JqX3B1dCh7fSwgYXQuZ2V0LCBhcy5kYXRhKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0bXAgPSB0bXAgfHwgY2F0LmdldDtcclxuXHRcdFx0XHRjYXQgPSAoY2F0LnJvb3QuZ2V0KHRtcCkuXyk7XHJcblx0XHRcdFx0YXMubm90ID0gYXMuc291bCA9IHRtcDtcclxuXHRcdFx0XHRkYXRhID0gYXMuZGF0YTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZighYXMubm90ICYmICEoYXMuc291bCA9IEd1bi5ub2RlLnNvdWwoZGF0YSkpKXtcclxuXHRcdFx0XHRpZihhcy5wYXRoICYmIG9ial9pcyhhcy5kYXRhKSl7IC8vIEFwcGFyZW50bHkgbmVjZXNzYXJ5XHJcblx0XHRcdFx0XHRhcy5zb3VsID0gKG9wdC51dWlkIHx8IGNhdC5yb290Ll8ub3B0LnV1aWQgfHwgR3VuLnRleHQucmFuZG9tKSgpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvL2FzLmRhdGEgPSBvYmpfcHV0KHt9LCBhcy5ndW4uXy5nZXQsIGFzLmRhdGEpO1xyXG5cdFx0XHRcdFx0YXMuc291bCA9IGF0LnNvdWwgfHwgY2F0LnNvdWwgfHwgKG9wdC51dWlkIHx8IGNhdC5yb290Ll8ub3B0LnV1aWQgfHwgR3VuLnRleHQucmFuZG9tKSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRhcy5yZWYucHV0KGFzLmRhdGEsIGFzLnNvdWwsIGFzKTtcclxuXHRcdH1cclxuXHRcdHZhciBvYmogPSBHdW4ub2JqLCBvYmpfaXMgPSBvYmouaXMsIG9ial9wdXQgPSBvYmoucHV0LCBvYmpfbWFwID0gb2JqLm1hcDtcclxuXHRcdHZhciB1LCBlbXB0eSA9IHt9LCBub29wID0gZnVuY3Rpb24oKXt9LCBpaWZlID0gZnVuY3Rpb24oZm4sYXMpe2ZuLmNhbGwoYXN8fGVtcHR5KX07XHJcblx0fSkocmVxdWlyZSwgJy4vcHV0Jyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblxyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vcm9vdCcpO1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBHdW47XHJcblxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRmdW5jdGlvbiBtZXRhKHYsZil7XHJcblx0XHRcdFx0aWYob2JqX2hhcyhHdW4uX18uXywgZikpeyByZXR1cm4gfVxyXG5cdFx0XHRcdG9ial9wdXQodGhpcy5fLCBmLCB2KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBtYXAodmFsdWUsIGZpZWxkKXtcclxuXHRcdFx0XHRpZihHdW4uXy5ub2RlID09PSBmaWVsZCl7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIG5vZGUgPSB0aGlzLm5vZGUsIHZlcnRleCA9IHRoaXMudmVydGV4LCB1bmlvbiA9IHRoaXMudW5pb24sIG1hY2hpbmUgPSB0aGlzLm1hY2hpbmU7XHJcblx0XHRcdFx0dmFyIGlzID0gc3RhdGVfaXMobm9kZSwgZmllbGQpLCBjcyA9IHN0YXRlX2lzKHZlcnRleCwgZmllbGQpO1xyXG5cdFx0XHRcdGlmKHUgPT09IGlzIHx8IHUgPT09IGNzKXsgcmV0dXJuIHRydWUgfSAvLyBpdCBpcyB0cnVlIHRoYXQgdGhpcyBpcyBhbiBpbnZhbGlkIEhBTSBjb21wYXJpc29uLlxyXG5cdFx0XHRcdHZhciBpdiA9IHZhbHVlLCBjdiA9IHZlcnRleFtmaWVsZF07XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHRcdFx0XHQvLyBUT0RPOiBCVUchIE5lZWQgdG8gY29tcGFyZSByZWxhdGlvbiB0byBub3QgcmVsYXRpb24sIGFuZCBjaG9vc2UgdGhlIHJlbGF0aW9uIGlmIHRoZXJlIGlzIGEgc3RhdGUgY29uZmxpY3QuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHRcdFx0XHRpZighdmFsX2lzKGl2KSAmJiB1ICE9PSBpdil7IHJldHVybiB0cnVlIH0gLy8gVW5kZWZpbmVkIGlzIG9rYXkgc2luY2UgYSB2YWx1ZSBtaWdodCBub3QgZXhpc3Qgb24gYm90aCBub2Rlcy4gLy8gaXQgaXMgdHJ1ZSB0aGF0IHRoaXMgaXMgYW4gaW52YWxpZCBIQU0gY29tcGFyaXNvbi5cclxuXHRcdFx0XHRpZighdmFsX2lzKGN2KSAmJiB1ICE9PSBjdil7IHJldHVybiB0cnVlIH0gIC8vIFVuZGVmaW5lZCBpcyBva2F5IHNpbmNlIGEgdmFsdWUgbWlnaHQgbm90IGV4aXN0IG9uIGJvdGggbm9kZXMuIC8vIGl0IGlzIHRydWUgdGhhdCB0aGlzIGlzIGFuIGludmFsaWQgSEFNIGNvbXBhcmlzb24uXHJcblx0XHRcdFx0dmFyIEhBTSA9IEd1bi5IQU0obWFjaGluZSwgaXMsIGNzLCBpdiwgY3YpO1xyXG5cdFx0XHRcdGlmKEhBTS5lcnIpe1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCIuIUhZUE9USEVUSUNBTCBBTU5FU0lBIE1BQ0hJTkUgRVJSIS5cIiwgZmllbGQsIEhBTS5lcnIpOyAvLyB0aGlzIGVycm9yIHNob3VsZCBuZXZlciBoYXBwZW4uXHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKEhBTS5zdGF0ZSB8fCBIQU0uaGlzdG9yaWNhbCB8fCBIQU0uY3VycmVudCl7IC8vIFRPRE86IEJVRyEgTm90IGltcGxlbWVudGVkLlxyXG5cdFx0XHRcdFx0Ly9vcHQubG93ZXIodmVydGV4LCB7ZmllbGQ6IGZpZWxkLCB2YWx1ZTogdmFsdWUsIHN0YXRlOiBpc30pO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihIQU0uaW5jb21pbmcpe1xyXG5cdFx0XHRcdFx0dW5pb25bZmllbGRdID0gdmFsdWU7XHJcblx0XHRcdFx0XHRzdGF0ZV9pZnkodW5pb24sIGZpZWxkLCBpcyk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKEhBTS5kZWZlcil7IC8vIFRPRE86IEJVRyEgTm90IGltcGxlbWVudGVkLlxyXG5cdFx0XHRcdFx0dW5pb25bZmllbGRdID0gdmFsdWU7IC8vIFdST05HISBCVUchIE5lZWQgdG8gaW1wbGVtZW50IGNvcnJlY3QgYWxnb3JpdGhtLlxyXG5cdFx0XHRcdFx0c3RhdGVfaWZ5KHVuaW9uLCBmaWVsZCwgaXMpOyAvLyBXUk9ORyEgQlVHISBOZWVkIHRvIGltcGxlbWVudCBjb3JyZWN0IGFsZ29yaXRobS5cclxuXHRcdFx0XHRcdC8vIGZpbGxlciBhbGdvcml0aG0gZm9yIG5vdy5cclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdC8qdXBwZXIud2FpdCA9IHRydWU7XHJcblx0XHRcdFx0XHRvcHQudXBwZXIuY2FsbChzdGF0ZSwgdmVydGV4LCBmaWVsZCwgaW5jb21pbmcsIGN0eC5pbmNvbWluZy5zdGF0ZSk7IC8vIHNpZ25hbHMgdGhhdCB0aGVyZSBhcmUgc3RpbGwgZnV0dXJlIG1vZGlmaWNhdGlvbnMuXHJcblx0XHRcdFx0XHRHdW4uc2NoZWR1bGUoY3R4LmluY29taW5nLnN0YXRlLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0XHR1cGRhdGUoaW5jb21pbmcsIGZpZWxkKTtcclxuXHRcdFx0XHRcdFx0aWYoY3R4LmluY29taW5nLnN0YXRlID09PSB1cHBlci5tYXgpeyAodXBwZXIubGFzdCB8fCBmdW5jdGlvbigpe30pKCkgfVxyXG5cdFx0XHRcdFx0fSwgZ3VuLl9fLm9wdC5zdGF0ZSk7Ki9cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0R3VuLkhBTS51bmlvbiA9IGZ1bmN0aW9uKHZlcnRleCwgbm9kZSwgb3B0KXtcclxuXHRcdFx0XHRpZighbm9kZSB8fCAhbm9kZS5fKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2ZXJ0ZXggPSB2ZXJ0ZXggfHwgR3VuLm5vZGUuc291bC5pZnkoe186eyc+Jzp7fX19LCBHdW4ubm9kZS5zb3VsKG5vZGUpKTtcclxuXHRcdFx0XHRpZighdmVydGV4IHx8ICF2ZXJ0ZXguXyl7IHJldHVybiB9XHJcblx0XHRcdFx0b3B0ID0gbnVtX2lzKG9wdCk/IHttYWNoaW5lOiBvcHR9IDoge21hY2hpbmU6IEd1bi5zdGF0ZSgpfTtcclxuXHRcdFx0XHRvcHQudW5pb24gPSB2ZXJ0ZXggfHwgR3VuLm9iai5jb3B5KHZlcnRleCk7IC8vIFRPRE86IFBFUkYhIFRoaXMgd2lsbCBzbG93IHRoaW5ncyBkb3duIVxyXG5cdFx0XHRcdC8vIFRPRE86IFBFUkYhIEJpZ2dlc3Qgc2xvd2Rvd24gKGFmdGVyIDFvY2FsU3RvcmFnZSkgaXMgdGhlIGFib3ZlIGxpbmUuIEZpeCEgRml4IVxyXG5cdFx0XHRcdG9wdC52ZXJ0ZXggPSB2ZXJ0ZXg7XHJcblx0XHRcdFx0b3B0Lm5vZGUgPSBub2RlO1xyXG5cdFx0XHRcdC8vb2JqX21hcChub2RlLl8sIG1ldGEsIG9wdC51bmlvbik7IC8vIFRPRE86IFJldmlldyBhdCBzb21lIHBvaW50P1xyXG5cdFx0XHRcdGlmKG9ial9tYXAobm9kZSwgbWFwLCBvcHQpKXsgLy8gaWYgdGhpcyByZXR1cm5zIHRydWUgdGhlbiBzb21ldGhpbmcgd2FzIGludmFsaWQuXHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBvcHQudW5pb247XHJcblx0XHRcdH1cclxuXHRcdFx0R3VuLkhBTS5kZWx0YSA9IGZ1bmN0aW9uKHZlcnRleCwgbm9kZSwgb3B0KXtcclxuXHRcdFx0XHRvcHQgPSBudW1faXMob3B0KT8ge21hY2hpbmU6IG9wdH0gOiB7bWFjaGluZTogR3VuLnN0YXRlKCl9O1xyXG5cdFx0XHRcdGlmKCF2ZXJ0ZXgpeyByZXR1cm4gR3VuLm9iai5jb3B5KG5vZGUpIH1cclxuXHRcdFx0XHRvcHQuc291bCA9IEd1bi5ub2RlLnNvdWwob3B0LnZlcnRleCA9IHZlcnRleCk7XHJcblx0XHRcdFx0aWYoIW9wdC5zb3VsKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRvcHQuZGVsdGEgPSBHdW4ubm9kZS5zb3VsLmlmeSh7fSwgb3B0LnNvdWwpO1xyXG5cdFx0XHRcdG9ial9tYXAob3B0Lm5vZGUgPSBub2RlLCBkaWZmLCBvcHQpO1xyXG5cdFx0XHRcdHJldHVybiBvcHQuZGVsdGE7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gZGlmZih2YWx1ZSwgZmllbGQpeyB2YXIgb3B0ID0gdGhpcztcclxuXHRcdFx0XHRpZihHdW4uXy5ub2RlID09PSBmaWVsZCl7IHJldHVybiB9XHJcblx0XHRcdFx0aWYoIXZhbF9pcyh2YWx1ZSkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdHZhciBub2RlID0gb3B0Lm5vZGUsIHZlcnRleCA9IG9wdC52ZXJ0ZXgsIGlzID0gc3RhdGVfaXMobm9kZSwgZmllbGQsIHRydWUpLCBjcyA9IHN0YXRlX2lzKHZlcnRleCwgZmllbGQsIHRydWUpLCBkZWx0YSA9IG9wdC5kZWx0YTtcclxuXHRcdFx0XHR2YXIgSEFNID0gR3VuLkhBTShvcHQubWFjaGluZSwgaXMsIGNzLCB2YWx1ZSwgdmVydGV4W2ZpZWxkXSk7XHJcblxyXG5cclxuXHJcblx0XHRcdFx0Ly8gVE9ETzogQlVHISEhISBXSEFUIEFCT1VUIERFRkVSUkVEIT8/P1xyXG5cdFx0XHRcdFxyXG5cclxuXHJcblx0XHRcdFx0aWYoSEFNLmluY29taW5nKXtcclxuXHRcdFx0XHRcdGRlbHRhW2ZpZWxkXSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0c3RhdGVfaWZ5KGRlbHRhLCBmaWVsZCwgaXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRHdW4uSEFNLnN5bnRoID0gZnVuY3Rpb24oYXQsIGV2LCBhcyl7IHZhciBndW4gPSB0aGlzLmFzIHx8IGFzO1xyXG5cdFx0XHRcdHZhciBjYXQgPSBndW4uXywgcm9vdCA9IGNhdC5yb290Ll8sIHB1dCA9IHt9LCB0bXA7XHJcblx0XHRcdFx0aWYoIWF0LnB1dCl7XHJcblx0XHRcdFx0XHQvL2lmKG9ial9oYXMoY2F0LCAncHV0JykpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0aWYoY2F0LnB1dCAhPT0gdSl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRjYXQub24oJ2luJywge1xyXG5cdFx0XHRcdFx0Ly9yb290LmFjayhhdFsnQCddLCB7XHJcblx0XHRcdFx0XHRcdGdldDogY2F0LmdldCxcclxuXHRcdFx0XHRcdFx0cHV0OiBjYXQucHV0ID0gdSxcclxuXHRcdFx0XHRcdFx0Z3VuOiBndW4sXHJcblx0XHRcdFx0XHRcdHZpYTogYXRcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIFRPRE86IFBFUkYhIEhhdmUgb3B0aW9ucyB0byBkZXRlcm1pbmUgaWYgdGhpcyBkYXRhIHNob3VsZCBldmVuIGJlIGluIG1lbW9yeSBvbiB0aGlzIHBlZXIhXHJcblx0XHRcdFx0b2JqX21hcChhdC5wdXQsIGZ1bmN0aW9uKG5vZGUsIHNvdWwpeyB2YXIgZ3JhcGggPSB0aGlzLmdyYXBoO1xyXG5cdFx0XHRcdFx0cHV0W3NvdWxdID0gR3VuLkhBTS5kZWx0YShncmFwaFtzb3VsXSwgbm9kZSwge2dyYXBoOiBncmFwaH0pOyAvLyBUT0RPOiBQRVJGISBTRUUgSUYgV0UgQ0FOIE9QVElNSVpFIFRISVMgQlkgTUVSR0lORyBVTklPTiBJTlRPIERFTFRBIVxyXG5cdFx0XHRcdFx0Z3JhcGhbc291bF0gPSBHdW4uSEFNLnVuaW9uKGdyYXBoW3NvdWxdLCBub2RlKSB8fCBncmFwaFtzb3VsXTtcclxuXHRcdFx0XHR9LCByb290KTtcclxuXHRcdFx0XHRpZihhdC5ndW4gIT09IHJvb3QuZ3VuKXtcclxuXHRcdFx0XHRcdHB1dCA9IGF0LnB1dDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gVE9ETzogUEVSRiEgSGF2ZSBvcHRpb25zIHRvIGRldGVybWluZSBpZiB0aGlzIGRhdGEgc2hvdWxkIGV2ZW4gYmUgaW4gbWVtb3J5IG9uIHRoaXMgcGVlciFcclxuXHRcdFx0XHRvYmpfbWFwKHB1dCwgZnVuY3Rpb24obm9kZSwgc291bCl7XHJcblx0XHRcdFx0XHR2YXIgcm9vdCA9IHRoaXMsIG5leHQgPSByb290Lm5leHQgfHwgKHJvb3QubmV4dCA9IHt9KSwgZ3VuID0gbmV4dFtzb3VsXSB8fCAobmV4dFtzb3VsXSA9IHJvb3QuZ3VuLmdldChzb3VsKSksIGNvYXQgPSAoZ3VuLl8pO1xyXG5cdFx0XHRcdFx0Y29hdC5wdXQgPSByb290LmdyYXBoW3NvdWxdOyAvLyBUT0RPOiBCVUchIENsb25lIVxyXG5cdFx0XHRcdFx0aWYoY2F0LmZpZWxkICYmICFvYmpfaGFzKG5vZGUsIGNhdC5maWVsZCkpe1xyXG5cdFx0XHRcdFx0XHQoYXQgPSBvYmpfdG8oYXQsIHt9KSkucHV0ID0gdTtcclxuXHRcdFx0XHRcdFx0R3VuLkhBTS5zeW50aChhdCwgZXYsIGNhdC5ndW4pO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjb2F0Lm9uKCdpbicsIHtcclxuXHRcdFx0XHRcdFx0cHV0OiBub2RlLFxyXG5cdFx0XHRcdFx0XHRnZXQ6IHNvdWwsXHJcblx0XHRcdFx0XHRcdGd1bjogZ3VuLFxyXG5cdFx0XHRcdFx0XHR2aWE6IGF0XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9LCByb290KTtcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHJcblx0XHR2YXIgVHlwZSA9IEd1bjtcclxuXHRcdHZhciBudW0gPSBUeXBlLm51bSwgbnVtX2lzID0gbnVtLmlzO1xyXG5cdFx0dmFyIG9iaiA9IFR5cGUub2JqLCBvYmpfaGFzID0gb2JqLmhhcywgb2JqX3B1dCA9IG9iai5wdXQsIG9ial90byA9IG9iai50bywgb2JqX21hcCA9IG9iai5tYXA7XHJcblx0XHR2YXIgbm9kZSA9IEd1bi5ub2RlLCBub2RlX3NvdWwgPSBub2RlLnNvdWwsIG5vZGVfaXMgPSBub2RlLmlzLCBub2RlX2lmeSA9IG5vZGUuaWZ5O1xyXG5cdFx0dmFyIHN0YXRlID0gR3VuLnN0YXRlLCBzdGF0ZV9pcyA9IHN0YXRlLmlzLCBzdGF0ZV9pZnkgPSBzdGF0ZS5pZnk7XHJcblx0XHR2YXIgdmFsID0gR3VuLnZhbCwgdmFsX2lzID0gdmFsLmlzLCByZWxfaXMgPSB2YWwucmVsLmlzO1xyXG5cdFx0dmFyIHU7XHJcblx0fSkocmVxdWlyZSwgJy4vaW5kZXgnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL3Jvb3QnKTtcclxuXHRcdHJlcXVpcmUoJy4vaW5kZXgnKTsgLy8gVE9ETzogQ0xFQU4gVVAhIE1FUkdFIElOVE8gUk9PVCFcclxuXHRcdHJlcXVpcmUoJy4vb3B0Jyk7XHJcblx0XHRyZXF1aXJlKCcuL2NoYWluJyk7XHJcblx0XHRyZXF1aXJlKCcuL2JhY2snKTtcclxuXHRcdHJlcXVpcmUoJy4vcHV0Jyk7XHJcblx0XHRyZXF1aXJlKCcuL2dldCcpO1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBHdW47XHJcblx0fSkocmVxdWlyZSwgJy4vY29yZScpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vY29yZScpO1xyXG5cdFx0dmFyIG9iaiA9IEd1bi5vYmosIG9ial9pcyA9IG9iai5pcywgb2JqX3B1dCA9IG9iai5wdXQsIG9ial9tYXAgPSBvYmoubWFwLCBvYmpfZW1wdHkgPSBvYmouZW1wdHk7XHJcblx0XHR2YXIgbnVtID0gR3VuLm51bSwgbnVtX2lzID0gbnVtLmlzO1xyXG5cdFx0dmFyIF9zb3VsID0gR3VuLnZhbC5yZWwuXywgX2ZpZWxkID0gJy4nO1xyXG5cclxuXHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdEd1bi5jaGFpbi5rZXkgPSBmdW5jdGlvbihpbmRleCwgY2IsIG9wdCl7XHJcblx0XHRcdFx0aWYoIWluZGV4KXtcclxuXHRcdFx0XHRcdGlmKGNiKXtcclxuXHRcdFx0XHRcdFx0Y2IuY2FsbCh0aGlzLCB7ZXJyOiBHdW4ubG9nKCdObyBrZXkhJyl9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR2YXIgZ3VuID0gdGhpcztcclxuXHRcdFx0XHRpZih0eXBlb2Ygb3B0ID09PSAnc3RyaW5nJyl7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIlBsZWFzZSByZXBvcnQgdGhpcyBhcyBhbiBpc3N1ZSEga2V5Lm9wdC5zdHJpbmdcIik7XHJcblx0XHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihndW4gPT09IGd1bi5fLnJvb3Qpe2lmKGNiKXtjYih7ZXJyOiBHdW4ubG9nKFwiQ2FuJ3QgZG8gdGhhdCBvbiByb290IGluc3RhbmNlLlwiKX0pfTtyZXR1cm4gZ3VufVxyXG5cdFx0XHRcdG9wdCA9IG9wdCB8fCB7fTtcclxuXHRcdFx0XHRvcHQua2V5ID0gaW5kZXg7XHJcblx0XHRcdFx0b3B0LmFueSA9IGNiIHx8IGZ1bmN0aW9uKCl7fTtcclxuXHRcdFx0XHRvcHQucmVmID0gZ3VuLmJhY2soLTEpLmdldChvcHQua2V5KTtcclxuXHRcdFx0XHRvcHQuZ3VuID0gb3B0Lmd1biB8fCBndW47XHJcblx0XHRcdFx0Z3VuLm9uKGtleSwge2FzOiBvcHR9KTtcclxuXHRcdFx0XHRpZighb3B0LmRhdGEpe1xyXG5cdFx0XHRcdFx0b3B0LnJlcyA9IEd1bi5vbi5zdHVuKG9wdC5yZWYpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIGtleShhdCwgZXYpeyB2YXIgb3B0ID0gdGhpcztcclxuXHRcdFx0XHRldi5vZmYoKTtcclxuXHRcdFx0XHRvcHQuc291bCA9IEd1bi5ub2RlLnNvdWwoYXQucHV0KTtcclxuXHRcdFx0XHRpZighb3B0LnNvdWwgfHwgb3B0LmtleSA9PT0gb3B0LnNvdWwpeyByZXR1cm4gb3B0LmRhdGEgPSB7fSB9XHJcblx0XHRcdFx0b3B0LmRhdGEgPSBvYmpfcHV0KHt9LCBrZXllZC5fLCBHdW4ubm9kZS5pZnkob2JqX3B1dCh7fSwgb3B0LnNvdWwsIEd1bi52YWwucmVsLmlmeShvcHQuc291bCkpLCAnIycrb3B0LmtleSsnIycpKTtcclxuXHRcdFx0XHQob3B0LnJlc3x8aWZmZSkoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdG9wdC5yZWYucHV0KG9wdC5kYXRhLCBvcHQuYW55LCB7c291bDogb3B0LmtleSwga2V5OiBvcHQua2V5fSk7XHRcdFx0XHRcclxuXHRcdFx0XHR9LG9wdCk7XHJcblx0XHRcdFx0aWYob3B0LnJlcyl7XHJcblx0XHRcdFx0XHRvcHQucmVzKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIGlmZmUoZm4sYXMpe2ZuLmNhbGwoYXN8fHt9KX1cclxuXHRcdFx0ZnVuY3Rpb24ga2V5ZWQoZil7XHJcblx0XHRcdFx0aWYoIWYgfHwgISgnIycgPT09IGZbMF0gJiYgJyMnID09PSBmW2YubGVuZ3RoLTFdKSl7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIHMgPSBmLnNsaWNlKDEsLTEpO1xyXG5cdFx0XHRcdGlmKCFzKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRyZXR1cm4gcztcclxuXHRcdFx0fVxyXG5cdFx0XHRrZXllZC5fID0gJyMjJztcclxuXHRcdFx0R3VuLm9uKCduZXh0JywgZnVuY3Rpb24oYXQpe1xyXG5cdFx0XHRcdHZhciBndW4gPSBhdC5ndW47XHJcblx0XHRcdFx0aWYoZ3VuLmJhY2soLTEpICE9PSBhdC5iYWNrKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRndW4ub24oJ2luJywgcHNldWRvLCBndW4uXyk7XHJcblx0XHRcdFx0Z3VuLm9uKCdvdXQnLCBub3JtYWxpemUsIGd1bi5fKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdGZ1bmN0aW9uIG5vcm1hbGl6ZShhdCl7IHZhciBjYXQgPSB0aGlzO1xyXG5cdFx0XHRcdGlmKCFhdC5wdXQpe1xyXG5cdFx0XHRcdFx0aWYoYXQuZ2V0KXtcclxuXHRcdFx0XHRcdFx0c2VhcmNoLmNhbGwoYXQuZ3VuPyBhdC5ndW4uXyA6IGNhdCwgYXQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihhdC5vcHQgJiYgYXQub3B0LmtleSl7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIHB1dCA9IGF0LnB1dCwgZ3JhcGggPSBjYXQuZ3VuLmJhY2soLTEpLl8uZ3JhcGg7XHJcblx0XHRcdFx0R3VuLmdyYXBoLmlzKHB1dCwgZnVuY3Rpb24obm9kZSwgc291bCl7XHJcblx0XHRcdFx0XHRpZighR3VuLm5vZGUuaXMoZ3JhcGhbJyMnK3NvdWwrJyMnXSwgZnVuY3Rpb24gZWFjaChyZWwsaWQpe1xyXG5cdFx0XHRcdFx0XHRpZihpZCAhPT0gR3VuLnZhbC5yZWwuaXMocmVsKSl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRcdGlmKHJlbCA9IGdyYXBoWycjJytpZCsnIyddKXtcclxuXHRcdFx0XHRcdFx0XHRHdW4ubm9kZS5pcyhyZWwsIGVhY2gpOyAvLyBjb3JyZWN0IHBhcmFtcz9cclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0R3VuLm5vZGUuc291bC5pZnkocmVsID0gcHV0W2lkXSA9IEd1bi5vYmouY29weShub2RlKSwgaWQpO1xyXG5cdFx0XHRcdFx0fSkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0R3VuLm9iai5kZWwocHV0LCBzb3VsKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBzZWFyY2goYXQpeyB2YXIgY2F0ID0gdGhpcztcclxuXHRcdFx0XHR2YXIgdG1wO1xyXG5cdFx0XHRcdGlmKCFHdW4ub2JqLmlzKHRtcCA9IGF0LmdldCkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGlmKCFHdW4ub2JqLmhhcyh0bXAsICcjJykpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGlmKCh0bXAgPSBhdC5nZXQpICYmIChudWxsID09PSB0bXBbJy4nXSkpe1xyXG5cdFx0XHRcdFx0dG1wWycuJ10gPSAnIyMnO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZigodG1wID0gYXQuZ2V0KSAmJiBHdW4ub2JqLmhhcyh0bXAsICcuJykpe1xyXG5cdFx0XHRcdFx0aWYodG1wWycjJ10pe1xyXG5cdFx0XHRcdFx0XHRjYXQgPSBjYXQucm9vdC5ndW4uZ2V0KHRtcFsnIyddKS5fO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dG1wID0gYXRbJyMnXTtcclxuXHRcdFx0XHRcdGF0WycjJ10gPSBHdW4ub24uYXNrKHByb3h5KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dmFyIHRyaWVkID0ge307XHJcblx0XHRcdFx0ZnVuY3Rpb24gcHJveHkoYWNrLCBldil7XHJcblx0XHRcdFx0XHR2YXIgcHV0ID0gYWNrLnB1dCwgbGV4ID0gYXQuZ2V0O1xyXG5cdFx0XHRcdFx0aWYoIWNhdC5wc2V1ZG8gfHwgYWNrLnZpYSl7IC8vIFRPRE86IEJVRyEgTUVNT1JZIFBFUkYhIFdoYXQgYWJvdXQgdW5zdWJzY3JpYmluZz9cclxuXHRcdFx0XHRcdFx0Ly9ldi5vZmYoKTtcclxuXHRcdFx0XHRcdFx0Ly9hY2sudmlhID0gYWNrLnZpYSB8fCB7fTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIEd1bi5vbi5hY2sodG1wLCBhY2spO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYoYWNrLnB1dCl7XHJcblx0XHRcdFx0XHRcdGlmKCFsZXhbJy4nXSl7XHJcblx0XHRcdFx0XHRcdFx0ZXYub2ZmKCk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIEd1bi5vbi5hY2sodG1wLCBhY2spO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmKG9ial9oYXMoYWNrLnB1dFtsZXhbJyMnXV0sIGxleFsnLiddKSl7XHJcblx0XHRcdFx0XHRcdFx0ZXYub2ZmKCk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIEd1bi5vbi5hY2sodG1wLCBhY2spO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRHdW4ub2JqLm1hcChjYXQuc2VlbiwgZnVuY3Rpb24ocmVmLGlkKXsgLy8gVE9ETzogQlVHISBJbi1tZW1vcnkgdmVyc3VzIGZ1dHVyZT9cclxuXHRcdFx0XHRcdFx0aWYodHJpZWRbaWRdKXtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gR3VuLm9uLmFjayh0bXAsIGFjayk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0dHJpZWRbaWRdID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0cmVmLm9uKCdvdXQnLCB7XHJcblx0XHRcdFx0XHRcdFx0Z3VuOiByZWYsXHJcblx0XHRcdFx0XHRcdFx0Z2V0OiBpZCA9IHsnIyc6IGlkLCAnLic6IGF0LmdldFsnLiddfSxcclxuXHRcdFx0XHRcdFx0XHQnIyc6IEd1bi5vbi5hc2socHJveHkpXHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIHBzZXVkbyhhdCwgZXYpeyB2YXIgY2F0ID0gdGhpcztcclxuXHRcdFx0XHQvLyBUT0RPOiBCVUchIFBzZXVkbyBjYW4ndCBoYW5kbGUgcGx1cmFscyE/XHJcblx0XHRcdFx0aWYoY2F0LnBzZXVkbyl7XHJcblx0XHRcdFx0XHQvL2V2LnN0dW4oKTtyZXR1cm47XHJcblx0XHRcdFx0XHRpZihjYXQucHNldWRvID09PSBhdC5wdXQpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0ZXYuc3R1bigpO1xyXG5cdFx0XHRcdFx0Y2F0LmNoYW5nZSA9IGNhdC5jaGFuZ2VkIHx8IGNhdC5wc2V1ZG87XHJcblx0XHRcdFx0XHRjYXQub24oJ2luJywgR3VuLm9iai50byhhdCwge3B1dDogY2F0LnB1dCA9IGNhdC5wc2V1ZG99KSk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKCFhdC5wdXQpeyByZXR1cm4gfVxyXG5cdFx0XHRcdHZhciByZWwgPSBHdW4udmFsLnJlbC5pcyhhdC5wdXRba2V5ZWQuX10pO1xyXG5cdFx0XHRcdGlmKCFyZWwpeyByZXR1cm4gfVxyXG5cdFx0XHRcdHZhciBzb3VsID0gR3VuLm5vZGUuc291bChhdC5wdXQpLCByZXN1bWUgPSBldi5zdHVuKHJlc3VtZSksIHJvb3QgPSBjYXQuZ3VuLmJhY2soLTEpLCBzZWVuID0gY2F0LnNlZW4gPSB7fTtcclxuXHRcdFx0XHRjYXQucHNldWRvID0gY2F0LnB1dCA9IEd1bi5zdGF0ZS5pZnkoR3VuLm5vZGUuaWZ5KHt9LCBzb3VsKSk7XHJcblx0XHRcdFx0cm9vdC5nZXQocmVsKS5vbihlYWNoLCB7Y2hhbmdlOiB0cnVlfSk7XHJcblx0XHRcdFx0ZnVuY3Rpb24gZWFjaChjaGFuZ2Upe1xyXG5cdFx0XHRcdFx0R3VuLm5vZGUuaXMoY2hhbmdlLCBtYXApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRmdW5jdGlvbiBtYXAocmVsLCBzb3VsKXtcclxuXHRcdFx0XHRcdGlmKHNvdWwgIT09IEd1bi52YWwucmVsLmlzKHJlbCkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0aWYoc2Vlbltzb3VsXSl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRzZWVuW3NvdWxdID0gcm9vdC5nZXQoc291bCkub24ob24sIHRydWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRmdW5jdGlvbiBvbihwdXQpe1xyXG5cdFx0XHRcdFx0aWYoIXB1dCl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRjYXQucHNldWRvID0gR3VuLkhBTS51bmlvbihjYXQucHNldWRvLCBwdXQpIHx8IGNhdC5wc2V1ZG87XHJcblx0XHRcdFx0XHRjYXQuY2hhbmdlID0gY2F0LmNoYW5nZWQgPSBwdXQ7XHJcblx0XHRcdFx0XHRjYXQucHV0ID0gY2F0LnBzZXVkbztcclxuXHRcdFx0XHRcdHJlc3VtZSh7XHJcblx0XHRcdFx0XHRcdGd1bjogY2F0Lmd1bixcclxuXHRcdFx0XHRcdFx0cHV0OiBjYXQucHNldWRvLFxyXG5cdFx0XHRcdFx0XHRnZXQ6IHNvdWxcclxuXHRcdFx0XHRcdFx0Ly92aWE6IHRoaXMuYXRcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgb2JqID0gR3VuLm9iaiwgb2JqX2hhcyA9IG9iai5oYXM7XHJcblx0XHR9KCkpO1xyXG5cclxuXHR9KShyZXF1aXJlLCAnLi9rZXknKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL2NvcmUnKTtcclxuXHRcdEd1bi5jaGFpbi5wYXRoID0gZnVuY3Rpb24oZmllbGQsIGNiLCBvcHQpe1xyXG5cdFx0XHR2YXIgYmFjayA9IHRoaXMsIGd1biA9IGJhY2ssIHRtcDtcclxuXHRcdFx0b3B0ID0gb3B0IHx8IHt9OyBvcHQucGF0aCA9IHRydWU7XHJcblx0XHRcdGlmKGd1biA9PT0gZ3VuLl8ucm9vdCl7aWYoY2Ipe2NiKHtlcnI6IEd1bi5sb2coXCJDYW4ndCBkbyB0aGF0IG9uIHJvb3QgaW5zdGFuY2UuXCIpfSl9cmV0dXJuIGd1bn1cclxuXHRcdFx0aWYodHlwZW9mIGZpZWxkID09PSAnc3RyaW5nJyl7XHJcblx0XHRcdFx0dG1wID0gZmllbGQuc3BsaXQob3B0LnNwbGl0IHx8ICcuJyk7XHJcblx0XHRcdFx0aWYoMSA9PT0gdG1wLmxlbmd0aCl7XHJcblx0XHRcdFx0XHRndW4gPSBiYWNrLmdldChmaWVsZCwgY2IsIG9wdCk7XHJcblx0XHRcdFx0XHRndW4uXy5vcHQgPSBvcHQ7XHJcblx0XHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRmaWVsZCA9IHRtcDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihmaWVsZCBpbnN0YW5jZW9mIEFycmF5KXtcclxuXHRcdFx0XHRpZihmaWVsZC5sZW5ndGggPiAxKXtcclxuXHRcdFx0XHRcdGd1biA9IGJhY2s7XHJcblx0XHRcdFx0XHR2YXIgaSA9IDAsIGwgPSBmaWVsZC5sZW5ndGg7XHJcblx0XHRcdFx0XHRmb3IoaTsgaSA8IGw7IGkrKyl7XHJcblx0XHRcdFx0XHRcdGd1biA9IGd1bi5nZXQoZmllbGRbaV0sIChpKzEgPT09IGwpPyBjYiA6IG51bGwsIG9wdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvL2d1bi5iYWNrID0gYmFjazsgLy8gVE9ETzogQVBJIGNoYW5nZSFcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Z3VuID0gYmFjay5nZXQoZmllbGRbMF0sIGNiLCBvcHQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRndW4uXy5vcHQgPSBvcHQ7XHJcblx0XHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZighZmllbGQgJiYgMCAhPSBmaWVsZCl7XHJcblx0XHRcdFx0cmV0dXJuIGJhY2s7XHJcblx0XHRcdH1cclxuXHRcdFx0Z3VuID0gYmFjay5nZXQoJycrZmllbGQsIGNiLCBvcHQpO1xyXG5cdFx0XHRndW4uXy5vcHQgPSBvcHQ7XHJcblx0XHRcdHJldHVybiBndW47XHJcblx0XHR9XHJcblx0fSkocmVxdWlyZSwgJy4vcGF0aCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vY29yZScpO1xyXG5cdFx0R3VuLmNoYWluLm9uID0gZnVuY3Rpb24odGFnLCBhcmcsIGVhcywgYXMpe1xyXG5cdFx0XHR2YXIgZ3VuID0gdGhpcywgYXQgPSBndW4uXywgdG1wLCBhY3QsIG9mZjtcclxuXHRcdFx0aWYodHlwZW9mIHRhZyA9PT0gJ3N0cmluZycpe1xyXG5cdFx0XHRcdGlmKCFhcmcpeyByZXR1cm4gYXQub24odGFnKSB9XHJcblx0XHRcdFx0YWN0ID0gYXQub24odGFnLCBhcmcsIGVhcyB8fCBhdCwgYXMpO1xyXG5cdFx0XHRcdGlmKGVhcyAmJiBlYXMuZ3VuKXtcclxuXHRcdFx0XHRcdChlYXMuc3VicyB8fCAoZWFzLnN1YnMgPSBbXSkpLnB1c2goYWN0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0b2ZmID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRpZiAoYWN0ICYmIGFjdC5vZmYpIGFjdC5vZmYoKTtcclxuXHRcdFx0XHRcdG9mZi5vZmYoKTtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdG9mZi5vZmYgPSBndW4ub2ZmLmJpbmQoZ3VuKSB8fCBub29wO1xyXG5cdFx0XHRcdGd1bi5vZmYgPSBvZmY7XHJcblx0XHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgb3B0ID0gYXJnO1xyXG5cdFx0XHRvcHQgPSAodHJ1ZSA9PT0gb3B0KT8ge2NoYW5nZTogdHJ1ZX0gOiBvcHQgfHwge307XHJcblx0XHRcdG9wdC5vayA9IHRhZztcclxuXHRcdFx0b3B0Lmxhc3QgPSB7fTtcclxuXHRcdFx0Z3VuLmdldChvaywgb3B0KTsgLy8gVE9ETzogUEVSRiEgRXZlbnQgbGlzdGVuZXIgbGVhayEhIT8/Pz9cclxuXHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBvayhhdCwgZXYpeyB2YXIgb3B0ID0gdGhpcztcclxuXHRcdFx0dmFyIGd1biA9IGF0Lmd1biwgY2F0ID0gZ3VuLl8sIGRhdGEgPSBjYXQucHV0IHx8IGF0LnB1dCwgdG1wID0gb3B0Lmxhc3QsIGlkID0gY2F0LmlkK2F0LmdldCwgdG1wO1xyXG5cdFx0XHRpZih1ID09PSBkYXRhKXtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoZGF0YSAmJiBkYXRhW3JlbC5fXSAmJiAodG1wID0gcmVsLmlzKGRhdGEpKSl7XHJcblx0XHRcdFx0dG1wID0gKGNhdC5yb290LmdldCh0bXApLl8pO1xyXG5cdFx0XHRcdGlmKHUgPT09IHRtcC5wdXQpe1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRkYXRhID0gdG1wLnB1dDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihvcHQuY2hhbmdlKXsgLy8gVE9ETzogQlVHPyBNb3ZlIGFib3ZlIHRoZSB1bmRlZiBjaGVja3M/XHJcblx0XHRcdFx0ZGF0YSA9IGF0LnB1dDtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBERURVUExJQ0FURSAvLyBUT0RPOiBORUVEUyBXT1JLISBCQUQgUFJPVE9UWVBFXHJcblx0XHRcdGlmKHRtcC5wdXQgPT09IGRhdGEgJiYgdG1wLmdldCA9PT0gaWQgJiYgIUd1bi5ub2RlLnNvdWwoZGF0YSkpeyByZXR1cm4gfVxyXG5cdFx0XHR0bXAucHV0ID0gZGF0YTtcclxuXHRcdFx0dG1wLmdldCA9IGlkO1xyXG5cdFx0XHQvLyBERURVUExJQ0FURSAvLyBUT0RPOiBORUVEUyBXT1JLISBCQUQgUFJPVE9UWVBFXHJcblx0XHRcdGNhdC5sYXN0ID0gZGF0YTtcclxuXHRcdFx0aWYob3B0LmFzKXtcclxuXHRcdFx0XHRvcHQub2suY2FsbChvcHQuYXMsIGF0LCBldik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0b3B0Lm9rLmNhbGwoZ3VuLCBkYXRhLCBhdC5nZXQsIGF0LCBldik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRHdW4uY2hhaW4udmFsID0gZnVuY3Rpb24oY2IsIG9wdCl7XHJcblx0XHRcdHZhciBndW4gPSB0aGlzLCBhdCA9IGd1bi5fLCBkYXRhID0gYXQucHV0O1xyXG5cdFx0XHRpZigwIDwgYXQuYWNrICYmIHUgIT09IGRhdGEpe1xyXG5cdFx0XHRcdChjYiB8fCBub29wKS5jYWxsKGd1biwgZGF0YSwgYXQuZ2V0KTtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNiKXtcclxuXHRcdFx0XHQob3B0ID0gb3B0IHx8IHt9KS5vayA9IGNiO1xyXG5cdFx0XHRcdG9wdC5jYXQgPSBhdDtcclxuXHRcdFx0XHRndW4uZ2V0KHZhbCwge2FzOiBvcHR9KTtcclxuXHRcdFx0XHRvcHQuYXN5bmMgPSB0cnVlOyAvL29wdC5hc3luYyA9IGF0LnN0dW4/IDEgOiB0cnVlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdEd1bi5sb2cub25jZShcInZhbG9uY2VcIiwgXCJDaGFpbmFibGUgdmFsIGlzIGV4cGVyaW1lbnRhbCwgaXRzIGJlaGF2aW9yIGFuZCBBUEkgbWF5IGNoYW5nZSBtb3ZpbmcgZm9yd2FyZC4gUGxlYXNlIHBsYXkgd2l0aCBpdCBhbmQgcmVwb3J0IGJ1Z3MgYW5kIGlkZWFzIG9uIGhvdyB0byBpbXByb3ZlIGl0LlwiKTtcclxuXHRcdFx0XHR2YXIgY2hhaW4gPSBndW4uY2hhaW4oKTtcclxuXHRcdFx0XHRjaGFpbi5fLnZhbCA9IGd1bi52YWwoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdGNoYWluLl8ub24oJ2luJywgZ3VuLl8pO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJldHVybiBjaGFpbjtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHZhbChhdCwgZXYsIHRvKXtcclxuXHRcdFx0dmFyIG9wdCA9IHRoaXMuYXMsIGNhdCA9IG9wdC5jYXQsIGd1biA9IGF0Lmd1biwgY29hdCA9IGd1bi5fLCBkYXRhID0gY29hdC5wdXQgfHwgYXQucHV0LCB0bXA7XHJcblx0XHRcdGlmKHUgPT09IGRhdGEpe1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihkYXRhICYmIGRhdGFbcmVsLl9dICYmICh0bXAgPSByZWwuaXMoZGF0YSkpKXtcclxuXHRcdFx0XHR0bXAgPSAoY2F0LnJvb3QuZ2V0KHRtcCkuXyk7XHJcblx0XHRcdFx0aWYodSA9PT0gdG1wLnB1dCl7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGRhdGEgPSB0bXAucHV0O1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGV2LndhaXQpeyBjbGVhclRpbWVvdXQoZXYud2FpdCkgfVxyXG5cdFx0XHQvL2lmKCF0byAmJiAoISgwIDwgY29hdC5hY2spIHx8ICgodHJ1ZSA9PT0gb3B0LmFzeW5jKSAmJiAwICE9PSBvcHQud2FpdCkpKXtcclxuXHRcdFx0aWYoIW9wdC5hc3luYyl7XHJcblx0XHRcdFx0ZXYud2FpdCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdHZhbC5jYWxsKHthczpvcHR9LCBhdCwgZXYsIGV2LndhaXQgfHwgMSlcclxuXHRcdFx0XHR9LCBvcHQud2FpdCB8fCA5OSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNhdC5maWVsZCB8fCBjYXQuc291bCl7XHJcblx0XHRcdFx0aWYoZXYub2ZmKCkpeyByZXR1cm4gfSAvLyBpZiBpdCBpcyBhbHJlYWR5IG9mZiwgZG9uJ3QgY2FsbCBhZ2FpbiFcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZigob3B0LnNlZW4gPSBvcHQuc2VlbiB8fCB7fSlbY29hdC5pZF0peyByZXR1cm4gfVxyXG5cdFx0XHRcdG9wdC5zZWVuW2NvYXQuaWRdID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRvcHQub2suY2FsbChhdC5ndW4gfHwgb3B0Lmd1biwgZGF0YSwgYXQuZ2V0KTtcclxuXHRcdH1cclxuXHJcblx0XHRHdW4uY2hhaW4ub2ZmID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIGd1biA9IHRoaXMsIGF0ID0gZ3VuLl8sIHRtcDtcclxuXHRcdFx0dmFyIGJhY2sgPSBhdC5iYWNrIHx8IHt9LCBjYXQgPSBiYWNrLl87XHJcblx0XHRcdGlmKCFjYXQpeyByZXR1cm4gfVxyXG5cdFx0XHRpZih0bXAgPSBjYXQubmV4dCl7XHJcblx0XHRcdFx0aWYodG1wW2F0LmdldF0pe1xyXG5cdFx0XHRcdFx0b2JqX2RlbCh0bXAsIGF0LmdldCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdG9ial9tYXAodG1wLCBmdW5jdGlvbihwYXRoLCBrZXkpe1xyXG5cdFx0XHRcdFx0XHRpZihndW4gIT09IHBhdGgpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0XHRvYmpfZGVsKHRtcCwga2V5KTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZigodG1wID0gZ3VuLmJhY2soLTEpKSA9PT0gYmFjayl7XHJcblx0XHRcdFx0b2JqX2RlbCh0bXAuZ3JhcGgsIGF0LmdldCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoYXQub25zICYmICh0bXAgPSBhdC5vbnNbJ0AkJ10pKXtcclxuXHRcdFx0XHRvYmpfbWFwKHRtcC5zLCBmdW5jdGlvbihldil7XHJcblx0XHRcdFx0XHRldi5vZmYoKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0fVxyXG5cdFx0dmFyIG9iaiA9IEd1bi5vYmosIG9ial9oYXMgPSBvYmouaGFzLCBvYmpfZGVsID0gb2JqLmRlbCwgb2JqX3RvID0gb2JqLnRvO1xyXG5cdFx0dmFyIHJlbCA9IEd1bi52YWwucmVsO1xyXG5cdFx0dmFyIGVtcHR5ID0ge30sIG5vb3AgPSBmdW5jdGlvbigpe30sIHU7XHJcblx0fSkocmVxdWlyZSwgJy4vb24nKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL2NvcmUnKSwgdTtcclxuXHRcdEd1bi5jaGFpbi5ub3QgPSBmdW5jdGlvbihjYiwgb3B0LCB0KXtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZ2V0KG91Z2h0LCB7bm90OiBjYn0pO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gb3VnaHQoYXQsIGV2KXsgZXYub2ZmKCk7XHJcblx0XHRcdGlmKGF0LmVyciB8fCAodSAhPT0gYXQucHV0KSl7IHJldHVybiB9XHJcblx0XHRcdGlmKCF0aGlzLm5vdCl7IHJldHVybiB9XHJcblx0XHRcdHRoaXMubm90LmNhbGwoYXQuZ3VuLCBhdC5nZXQsIGZ1bmN0aW9uKCl7IGNvbnNvbGUubG9nKFwiUGxlYXNlIHJlcG9ydCB0aGlzIGJ1ZyBvbiBodHRwczovL2dpdHRlci5pbS9hbWFyay9ndW4gYW5kIGluIHRoZSBpc3N1ZXMuXCIpOyBuZWVkLnRvLmltcGxlbWVudDsgfSk7XHJcblx0XHR9XHJcblx0fSkocmVxdWlyZSwgJy4vbm90Jyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9jb3JlJyk7XHJcblx0XHRHdW4uY2hhaW4ubWFwID0gZnVuY3Rpb24oY2IsIG9wdCwgdCl7XHJcblx0XHRcdHZhciBndW4gPSB0aGlzLCBjYXQgPSBndW4uXywgY2hhaW47XHJcblx0XHRcdGlmKCFjYil7XHJcblx0XHRcdFx0aWYoY2hhaW4gPSBjYXQuZmllbGRzKXsgcmV0dXJuIGNoYWluIH1cclxuXHRcdFx0XHRjaGFpbiA9IGNhdC5maWVsZHMgPSBndW4uY2hhaW4oKTtcclxuXHRcdFx0XHRjaGFpbi5fLnZhbCA9IGd1bi5iYWNrKCd2YWwnKTtcclxuXHRcdFx0XHRndW4ub24oJ2luJywgbWFwLCBjaGFpbi5fKTtcclxuXHRcdFx0XHRyZXR1cm4gY2hhaW47XHJcblx0XHRcdH1cclxuXHRcdFx0R3VuLmxvZy5vbmNlKFwibWFwZm5cIiwgXCJNYXAgZnVuY3Rpb25zIGFyZSBleHBlcmltZW50YWwsIHRoZWlyIGJlaGF2aW9yIGFuZCBBUEkgbWF5IGNoYW5nZSBtb3ZpbmcgZm9yd2FyZC4gUGxlYXNlIHBsYXkgd2l0aCBpdCBhbmQgcmVwb3J0IGJ1Z3MgYW5kIGlkZWFzIG9uIGhvdyB0byBpbXByb3ZlIGl0LlwiKTtcclxuXHRcdFx0Y2hhaW4gPSBndW4uY2hhaW4oKTtcclxuXHRcdFx0Z3VuLm1hcCgpLm9uKGZ1bmN0aW9uKGRhdGEsIGtleSwgYXQsIGV2KXtcclxuXHRcdFx0XHR2YXIgbmV4dCA9IChjYnx8bm9vcCkuY2FsbCh0aGlzLCBkYXRhLCBrZXksIGF0LCBldik7XHJcblx0XHRcdFx0aWYodSA9PT0gbmV4dCl7IHJldHVybiB9XHJcblx0XHRcdFx0aWYoR3VuLmlzKG5leHQpKXtcclxuXHRcdFx0XHRcdGNoYWluLl8ub24oJ2luJywgbmV4dC5fKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2hhaW4uXy5vbignaW4nLCB7Z2V0OiBrZXksIHB1dDogbmV4dCwgZ3VuOiBjaGFpbn0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIGNoYWluO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gbWFwKGF0KXtcclxuXHRcdFx0aWYoIWF0LnB1dCB8fCBHdW4udmFsLmlzKGF0LnB1dCkpeyByZXR1cm4gfVxyXG5cdFx0XHRpZih0aGlzLmFzLnZhbCl7IHRoaXMub2ZmKCkgfSAvLyBUT0RPOiBVZ2x5IGhhY2shXHJcblx0XHRcdG9ial9tYXAoYXQucHV0LCBlYWNoLCB7Y2F0OiB0aGlzLmFzLCBndW46IGF0Lmd1bn0pO1xyXG5cdFx0XHR0aGlzLnRvLm5leHQoYXQpO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gZWFjaCh2LGYpe1xyXG5cdFx0XHRpZihuXyA9PT0gZil7IHJldHVybiB9XHJcblx0XHRcdHZhciBjYXQgPSB0aGlzLmNhdCwgZ3VuID0gdGhpcy5ndW4uZ2V0KGYpLCBhdCA9IChndW4uXyk7XHJcblx0XHRcdChhdC5lY2hvIHx8IChhdC5lY2hvID0ge30pKVtjYXQuaWRdID0gY2F0O1xyXG5cdFx0fVxyXG5cdFx0dmFyIG9ial9tYXAgPSBHdW4ub2JqLm1hcCwgbm9vcCA9IGZ1bmN0aW9uKCl7fSwgZXZlbnQgPSB7c3R1bjogbm9vcCwgb2ZmOiBub29wfSwgbl8gPSBHdW4ubm9kZS5fLCB1O1xyXG5cdH0pKHJlcXVpcmUsICcuL21hcCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vY29yZScpO1xyXG5cdFx0R3VuLmNoYWluLnNldCA9IGZ1bmN0aW9uKGl0ZW0sIGNiLCBvcHQpe1xyXG5cdFx0XHR2YXIgZ3VuID0gdGhpcywgc291bDtcclxuXHRcdFx0Y2IgPSBjYiB8fCBmdW5jdGlvbigpe307XHJcblx0XHRcdGlmKHNvdWwgPSBHdW4ubm9kZS5zb3VsKGl0ZW0pKXsgcmV0dXJuIGd1bi5zZXQoZ3VuLmJhY2soLTEpLmdldChzb3VsKSwgY2IsIG9wdCkgfVxyXG5cdFx0XHRpZighR3VuLmlzKGl0ZW0pKXtcclxuXHRcdFx0XHRpZihHdW4ub2JqLmlzKGl0ZW0pKXsgcmV0dXJuIGd1bi5zZXQoZ3VuLl8ucm9vdC5wdXQoaXRlbSksIGNiLCBvcHQpIH1cclxuXHRcdFx0XHRyZXR1cm4gZ3VuLmdldChHdW4udGV4dC5yYW5kb20oKSkucHV0KGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGl0ZW0uZ2V0KCdfJykuZ2V0KGZ1bmN0aW9uKGF0LCBldil7XHJcblx0XHRcdFx0aWYoIWF0Lmd1biB8fCAhYXQuZ3VuLl8uYmFjayk7XHJcblx0XHRcdFx0ZXYub2ZmKCk7XHJcblx0XHRcdFx0YXQgPSAoYXQuZ3VuLl8uYmFjay5fKTtcclxuXHRcdFx0XHR2YXIgcHV0ID0ge30sIG5vZGUgPSBhdC5wdXQsIHNvdWwgPSBHdW4ubm9kZS5zb3VsKG5vZGUpO1xyXG5cdFx0XHRcdGlmKCFzb3VsKXsgcmV0dXJuIGNiLmNhbGwoZ3VuLCB7ZXJyOiBHdW4ubG9nKCdPbmx5IGEgbm9kZSBjYW4gYmUgbGlua2VkISBOb3QgXCInICsgbm9kZSArICdcIiEnKX0pIH1cclxuXHRcdFx0XHRndW4ucHV0KEd1bi5vYmoucHV0KHB1dCwgc291bCwgR3VuLnZhbC5yZWwuaWZ5KHNvdWwpKSwgY2IsIG9wdCk7XHJcblx0XHRcdH0se3dhaXQ6MH0pO1xyXG5cdFx0XHRyZXR1cm4gaXRlbTtcclxuXHRcdH1cclxuXHR9KShyZXF1aXJlLCAnLi9zZXQnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdGlmKHR5cGVvZiBHdW4gPT09ICd1bmRlZmluZWQnKXsgcmV0dXJuIH0gLy8gVE9ETzogbG9jYWxTdG9yYWdlIGlzIEJyb3dzZXIgb25seS4gQnV0IGl0IHdvdWxkIGJlIG5pY2UgaWYgaXQgY291bGQgc29tZWhvdyBwbHVnaW4gaW50byBOb2RlSlMgY29tcGF0aWJsZSBsb2NhbFN0b3JhZ2UgQVBJcz9cclxuXHJcblx0XHR2YXIgcm9vdCwgbm9vcCA9IGZ1bmN0aW9uKCl7fSwgdTtcclxuXHRcdGlmKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKXsgcm9vdCA9IHdpbmRvdyB9XHJcblx0XHR2YXIgc3RvcmUgPSByb290LmxvY2FsU3RvcmFnZSB8fCB7c2V0SXRlbTogbm9vcCwgcmVtb3ZlSXRlbTogbm9vcCwgZ2V0SXRlbTogbm9vcH07XHJcblxyXG5cdFx0dmFyIGNoZWNrID0ge30sIGRpcnR5ID0ge30sIGFzeW5jID0ge30sIGNvdW50ID0gMCwgbWF4ID0gMTAwMDAsIHdhaXQ7XHJcblx0XHRcclxuXHRcdEd1bi5vbigncHV0JywgZnVuY3Rpb24oYXQpeyB2YXIgZXJyLCBpZCwgb3B0LCByb290ID0gYXQuZ3VuLl8ucm9vdDtcclxuXHRcdFx0dGhpcy50by5uZXh0KGF0KTtcclxuXHRcdFx0KG9wdCA9IHt9KS5wcmVmaXggPSAoYXQub3B0IHx8IG9wdCkucHJlZml4IHx8IGF0Lmd1bi5iYWNrKCdvcHQucHJlZml4JykgfHwgJ2d1bi8nO1xyXG5cdFx0XHR2YXIgZ3JhcGggPSByb290Ll8uZ3JhcGg7XHJcblx0XHRcdFxyXG5cdFx0XHRHdW4ub2JqLm1hcChhdC5wdXQsIGZ1bmN0aW9uKG5vZGUsIHNvdWwpe1xyXG5cdFx0XHRcdGFzeW5jW3NvdWxdID0gZ3JhcGhbc291bF0gfHwgbm9kZTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdGNvdW50ICs9IDE7XHJcblx0XHRcdGNoZWNrW2F0WycjJ11dID0gcm9vdDtcclxuXHRcdFx0ZnVuY3Rpb24gc2F2ZSgpe1xyXG5cdFx0XHRcdGNsZWFyVGltZW91dCh3YWl0KTtcclxuXHRcdFx0XHR2YXIgYWNrID0gY2hlY2s7XHJcblx0XHRcdFx0dmFyIGFsbCA9IGFzeW5jO1xyXG5cdFx0XHRcdGNvdW50ID0gMDtcclxuXHRcdFx0XHR3YWl0ID0gZmFsc2U7XHJcblx0XHRcdFx0Y2hlY2sgPSB7fTtcclxuXHRcdFx0XHRhc3luYyA9IHt9O1xyXG5cdFx0XHRcdEd1bi5vYmoubWFwKGFsbCwgZnVuY3Rpb24obm9kZSwgc291bCl7XHJcblx0XHRcdFx0XHQvLyBTaW5jZSBsb2NhbFN0b3JhZ2Ugb25seSBoYXMgNU1CLCBpdCBpcyBiZXR0ZXIgdGhhdCB3ZSBrZWVwIG9ubHlcclxuXHRcdFx0XHRcdC8vIHRoZSBkYXRhIHRoYXQgdGhlIHVzZXIgaXMgY3VycmVudGx5IGludGVyZXN0ZWQgaW4uXHJcblx0XHRcdFx0XHRub2RlID0gZ3JhcGhbc291bF0gfHwgYWxsW3NvdWxdO1xyXG5cdFx0XHRcdFx0dHJ5e3N0b3JlLnNldEl0ZW0ob3B0LnByZWZpeCArIHNvdWwsIEpTT04uc3RyaW5naWZ5KG5vZGUpKTtcclxuXHRcdFx0XHRcdH1jYXRjaChlKXsgZXJyID0gZSB8fCBcImxvY2FsU3RvcmFnZSBmYWlsdXJlXCIgfVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdGlmKCFHdW4ub2JqLmVtcHR5KGF0Lmd1bi5iYWNrKCdvcHQucGVlcnMnKSkpeyByZXR1cm4gfSAvLyBvbmx5IGFjayBpZiB0aGVyZSBhcmUgbm8gcGVlcnMuXHJcblx0XHRcdFx0R3VuLm9iai5tYXAoYWNrLCBmdW5jdGlvbihyb290LCBpZCl7XHJcblx0XHRcdFx0XHRyb290Lm9uKCdpbicsIHtcclxuXHRcdFx0XHRcdFx0J0AnOiBpZCxcclxuXHRcdFx0XHRcdFx0ZXJyOiBlcnIsXHJcblx0XHRcdFx0XHRcdG9rOiAwIC8vIGxvY2FsU3RvcmFnZSBpc24ndCByZWxpYWJsZSwgc28gbWFrZSBpdHMgYG9rYCBjb2RlIGJlIGEgbG93IG51bWJlci5cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNvdW50ID49IG1heCl7IC8vIGdvYWwgaXMgdG8gZG8gMTBLIGluc2VydHMvc2Vjb25kLlxyXG5cdFx0XHRcdHJldHVybiBzYXZlKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYod2FpdCl7IHJldHVybiB9XHJcblx0XHRcdGNsZWFyVGltZW91dCh3YWl0KTtcclxuXHRcdFx0d2FpdCA9IHNldFRpbWVvdXQoc2F2ZSwgMTAwMCk7XHJcblx0XHR9KTtcclxuXHRcdEd1bi5vbignZ2V0JywgZnVuY3Rpb24oYXQpe1xyXG5cdFx0XHR0aGlzLnRvLm5leHQoYXQpO1xyXG5cdFx0XHR2YXIgZ3VuID0gYXQuZ3VuLCBsZXggPSBhdC5nZXQsIHNvdWwsIGRhdGEsIG9wdCwgdTtcclxuXHRcdFx0Ly9zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdChvcHQgPSBhdC5vcHQgfHwge30pLnByZWZpeCA9IG9wdC5wcmVmaXggfHwgYXQuZ3VuLmJhY2soJ29wdC5wcmVmaXgnKSB8fCAnZ3VuLyc7XHJcblx0XHRcdGlmKCFsZXggfHwgIShzb3VsID0gbGV4W0d1bi5fLnNvdWxdKSl7IHJldHVybiB9XHJcblx0XHRcdC8vaWYoMCA+PSBhdC5jYXApeyByZXR1cm4gfVxyXG5cdFx0XHR2YXIgZmllbGQgPSBsZXhbJy4nXTtcclxuXHJcblx0XHRcdGRhdGEgPSBHdW4ub2JqLmlmeShzdG9yZS5nZXRJdGVtKG9wdC5wcmVmaXggKyBzb3VsKSB8fCBudWxsKSB8fCBhc3luY1tzb3VsXSB8fCB1O1xyXG5cdFx0XHRpZihkYXRhICYmIGZpZWxkKXtcclxuXHRcdFx0XHRkYXRhID0gR3VuLnN0YXRlLmlmeSh1LCBmaWVsZCwgR3VuLnN0YXRlLmlzKGRhdGEsIGZpZWxkKSwgZGF0YVtmaWVsZF0sIHNvdWwpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCFkYXRhICYmICFHdW4ub2JqLmVtcHR5KGd1bi5iYWNrKCdvcHQucGVlcnMnKSkpeyAvLyBpZiBkYXRhIG5vdCBmb3VuZCwgZG9uJ3QgYWNrIGlmIHRoZXJlIGFyZSBwZWVycy5cclxuXHRcdFx0XHRyZXR1cm47IC8vIEhtbSwgd2hhdCBpZiB3ZSBoYXZlIHBlZXJzIGJ1dCB3ZSBhcmUgZGlzY29ubmVjdGVkP1xyXG5cdFx0XHR9XHJcblx0XHRcdGd1bi5vbignaW4nLCB7J0AnOiBhdFsnIyddLCBwdXQ6IEd1bi5ncmFwaC5ub2RlKGRhdGEpLCBob3c6ICdsUyd9KTtcclxuXHRcdFx0Ly99LDExKTtcclxuXHRcdH0pO1xyXG5cdH0pKHJlcXVpcmUsICcuL2FkYXB0ZXJzL2xvY2FsU3RvcmFnZScpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vY29yZScpO1xyXG5cclxuXHRcdGlmICh0eXBlb2YgSlNPTiA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFxyXG5cdFx0XHRcdCdHdW4gZGVwZW5kcyBvbiBKU09OLiBQbGVhc2UgbG9hZCBpdCBmaXJzdDpcXG4nICtcclxuXHRcdFx0XHQnYWpheC5jZG5qcy5jb20vYWpheC9saWJzL2pzb24yLzIwMTEwMjIzL2pzb24yLmpzJ1xyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBXZWJTb2NrZXQ7XHJcblx0XHRpZih0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyl7XHJcblx0XHRcdFdlYlNvY2tldCA9IHdpbmRvdy5XZWJTb2NrZXQgfHwgd2luZG93LndlYmtpdFdlYlNvY2tldCB8fCB3aW5kb3cubW96V2ViU29ja2V0O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0dmFyIG1lc3NhZ2UsIGNvdW50ID0gMCwgbm9vcCA9IGZ1bmN0aW9uKCl7fSwgd2FpdDtcclxuXHJcblx0XHRHdW4ub24oJ291dCcsIGZ1bmN0aW9uKGF0KXtcclxuXHRcdFx0dGhpcy50by5uZXh0KGF0KTtcclxuXHRcdFx0dmFyIGNhdCA9IGF0Lmd1bi5fLnJvb3QuXywgd3NwID0gY2F0LndzcCB8fCAoY2F0LndzcCA9IHt9KTtcclxuXHRcdFx0aWYoYXQud3NwICYmIDEgPT09IHdzcC5jb3VudCl7IHJldHVybiB9IC8vIGlmIHRoZSBtZXNzYWdlIGNhbWUgRlJPTSB0aGUgb25seSBwZWVyIHdlIGFyZSBjb25uZWN0ZWQgdG8sIGRvbid0IGVjaG8gaXQgYmFjay5cclxuXHRcdFx0bWVzc2FnZSA9IEpTT04uc3RyaW5naWZ5KGF0KTtcclxuXHRcdFx0Ly9pZigrK2NvdW50KXsgY29uc29sZS5sb2coXCJtc2cgT1VUOlwiLCBjb3VudCwgR3VuLm9iai5pZnkobWVzc2FnZSkpIH1cclxuXHRcdFx0aWYoY2F0LnVkcmFpbil7XHJcblx0XHRcdFx0Y2F0LnVkcmFpbi5wdXNoKG1lc3NhZ2UpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYXQudWRyYWluID0gW107XHJcblx0XHRcdGNsZWFyVGltZW91dCh3YWl0KTtcclxuXHRcdFx0d2FpdCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRpZighY2F0LnVkcmFpbil7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIHRtcCA9IGNhdC51ZHJhaW47XHJcblx0XHRcdFx0Y2F0LnVkcmFpbiA9IG51bGw7XHJcblx0XHRcdFx0aWYoIHRtcC5sZW5ndGggKSB7XHJcblx0XHRcdFx0XHRtZXNzYWdlID0gSlNPTi5zdHJpbmdpZnkodG1wKTtcclxuXHRcdFx0XHRcdEd1bi5vYmoubWFwKGNhdC5vcHQucGVlcnMsIHNlbmQsIGNhdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LDEpO1xyXG5cdFx0XHR3c3AuY291bnQgPSAwO1xyXG5cdFx0XHRHdW4ub2JqLm1hcChjYXQub3B0LnBlZXJzLCBzZW5kLCBjYXQpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gc2VuZChwZWVyKXtcclxuXHRcdFx0dmFyIG1zZyA9IG1lc3NhZ2UsIGNhdCA9IHRoaXM7XHJcblx0XHRcdHZhciB3aXJlID0gcGVlci53aXJlIHx8IG9wZW4ocGVlciwgY2F0KTtcclxuXHRcdFx0aWYoY2F0LndzcCl7IGNhdC53c3AuY291bnQrKyB9XHJcblx0XHRcdGlmKCF3aXJlKXsgcmV0dXJuIH1cclxuXHRcdFx0aWYod2lyZS5yZWFkeVN0YXRlID09PSB3aXJlLk9QRU4pe1xyXG5cdFx0XHRcdHdpcmUuc2VuZChtc2cpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHQocGVlci5xdWV1ZSA9IHBlZXIucXVldWUgfHwgW10pLnB1c2gobXNnKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiByZWNlaXZlKG1zZywgcGVlciwgY2F0KXtcclxuXHRcdFx0aWYoIWNhdCB8fCAhbXNnKXsgcmV0dXJuIH1cclxuXHRcdFx0dHJ5e21zZyA9IEpTT04ucGFyc2UobXNnLmRhdGEgfHwgbXNnKTtcclxuXHRcdFx0fWNhdGNoKGUpe31cclxuXHRcdFx0aWYobXNnIGluc3RhbmNlb2YgQXJyYXkpe1xyXG5cdFx0XHRcdHZhciBpID0gMCwgbTtcclxuXHRcdFx0XHR3aGlsZShtID0gbXNnW2krK10pe1xyXG5cdFx0XHRcdFx0cmVjZWl2ZShtLCBwZWVyLCBjYXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0Ly9pZigrK2NvdW50KXsgY29uc29sZS5sb2coXCJtc2cgaW46XCIsIGNvdW50LCBtc2cuYm9keSB8fCBtc2cpIH1cclxuXHRcdFx0aWYoY2F0LndzcCAmJiAxID09PSBjYXQud3NwLmNvdW50KXsgKG1zZy5ib2R5IHx8IG1zZykud3NwID0gbm9vcCB9IC8vIElmIHRoZXJlIGlzIG9ubHkgMSBjbGllbnQsIGp1c3QgdXNlIG5vb3Agc2luY2UgaXQgZG9lc24ndCBtYXR0ZXIuXHJcblx0XHRcdGNhdC5ndW4ub24oJ2luJywgbXNnLmJvZHkgfHwgbXNnKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBvcGVuKHBlZXIsIGFzKXtcclxuXHRcdFx0aWYoIXBlZXIgfHwgIXBlZXIudXJsKXsgcmV0dXJuIH1cclxuXHRcdFx0dmFyIHVybCA9IHBlZXIudXJsLnJlcGxhY2UoJ2h0dHAnLCAnd3MnKTtcclxuXHRcdFx0dmFyIHdpcmUgPSBwZWVyLndpcmUgPSBuZXcgV2ViU29ja2V0KHVybCwgYXMub3B0LndzYy5wcm90b2NvbHMsIGFzLm9wdC53c2MgKTtcclxuXHRcdFx0d2lyZS5vbmNsb3NlID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZWNvbm5lY3QocGVlciwgYXMpO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHR3aXJlLm9uZXJyb3IgPSBmdW5jdGlvbihlcnJvcil7XHJcblx0XHRcdFx0cmVjb25uZWN0KHBlZXIsIGFzKTtcclxuXHRcdFx0XHRpZighZXJyb3IpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGlmKGVycm9yLmNvZGUgPT09ICdFQ09OTlJFRlVTRUQnKXtcclxuXHRcdFx0XHRcdC8vcmVjb25uZWN0KHBlZXIsIGFzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdHdpcmUub25vcGVuID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgcXVldWUgPSBwZWVyLnF1ZXVlO1xyXG5cdFx0XHRcdHBlZXIucXVldWUgPSBbXTtcclxuXHRcdFx0XHRHdW4ub2JqLm1hcChxdWV1ZSwgZnVuY3Rpb24obXNnKXtcclxuXHRcdFx0XHRcdG1lc3NhZ2UgPSBtc2c7XHJcblx0XHRcdFx0XHRzZW5kLmNhbGwoYXMsIHBlZXIpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdHdpcmUub25tZXNzYWdlID0gZnVuY3Rpb24obXNnKXtcclxuXHRcdFx0XHRyZWNlaXZlKG1zZywgcGVlciwgYXMpO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHRyZXR1cm4gd2lyZTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiByZWNvbm5lY3QocGVlciwgYXMpe1xyXG5cdFx0XHRjbGVhclRpbWVvdXQocGVlci5kZWZlcik7XHJcblx0XHRcdHBlZXIuZGVmZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0b3BlbihwZWVyLCBhcyk7XHJcblx0XHRcdH0sIDIgKiAxMDAwKTtcclxuXHRcdH1cclxuXHR9KShyZXF1aXJlLCAnLi9wb2x5ZmlsbC9yZXF1ZXN0Jyk7XHJcblxyXG59KCkpO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2d1bi9ndW4uanMiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1vZHVsZSkge1xyXG5cdGlmKCFtb2R1bGUud2VicGFja1BvbHlmaWxsKSB7XHJcblx0XHRtb2R1bGUuZGVwcmVjYXRlID0gZnVuY3Rpb24oKSB7fTtcclxuXHRcdG1vZHVsZS5wYXRocyA9IFtdO1xyXG5cdFx0Ly8gbW9kdWxlLnBhcmVudCA9IHVuZGVmaW5lZCBieSBkZWZhdWx0XHJcblx0XHRtb2R1bGUuY2hpbGRyZW4gPSBbXTtcclxuXHRcdG1vZHVsZS53ZWJwYWNrUG9seWZpbGwgPSAxO1xyXG5cdH1cclxuXHRyZXR1cm4gbW9kdWxlO1xyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAod2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanMiLCJ2YXIgaW5kZXhQYXJ0aWFsID0gcmVxdWlyZShcInJhdy1sb2FkZXIhLi4vLi4vdmlld3MvcGFydGlhbHMvaW5kZXguaHRtbFwiKTtcbmV4cG9ydCBjbGFzcyBJbmRleFBhZ2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSBgXG4gICAgICAgIDxwPiR7aW5kZXhQYXJ0aWFsfTwvcD5cbiAgICAgICAgYDtcbiAgICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJpbmRleC1wYWdlXCIsIEluZGV4UGFnZSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFnZXMvaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+aW5kZXg8L3A+XFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmF3LWxvYWRlciEuL3ZpZXdzL3BhcnRpYWxzL2luZGV4Lmh0bWxcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIHJvYWRtYXBQYXJ0aWFsID0gcmVxdWlyZShcInJhdy1sb2FkZXIhLi4vLi4vdmlld3MvcGFydGlhbHMvcm9hZG1hcC5odG1sXCIpO1xuZXhwb3J0IGNsYXNzIFJvYWRtYXBQYWdlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICAgIGF0dGFjaGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuaW5uZXJIVE1MID0gJzxwPicgKyByb2FkbWFwUGFydGlhbCArICc8L3A+JztcbiAgICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJyb2FkbWFwLXBhZ2VcIiwgUm9hZG1hcFBhZ2UpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhZ2VzL3JvYWRtYXAuanMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPHNwYW4gY2xhc3M9XFxcInJvYWRtYXBcXFwiPlxcbiAgICA8ZGV0YWlscz5cXG4gICAgPHN1bW1hcnk+cm9hZCBtYXA8L3N1bW1hcnk+XFxuICAgIDx1bD5cXG4gICAgICAgIDxsaT48ZGVsPjxhIGhyZWY9XFxcImh0dHBzOi8vZ2l0aHViLmNvbS9jb2xlYWxib24vaG90bGlwcy9jb21taXQvM2I3MDk4MWNiZTRlMTFlMTQwMGFlOGU5NDhhMDZlMzU4MmQ5YzJkMlxcXCI+SW5zdGFsbCBub2RlL2tvYS93ZWJwYWNrPC9hPjwvZGVsPjwvbGk+XFxuICAgICAgICA8bGk+PGRlbD48YSBocmVmPVxcXCJodHRwczovL2dpdGh1Yi5jb20vY29sZWFsYm9uL2hvdGxpcHMvaXNzdWVzLzJcXFwiPkluc3RhbGwgZ3VuZGI8L2E+PC9kZWw+PC9saT5cXG4gICAgICAgIDxsaT48ZGVsPm1ha2UgYSA8YSBocmVmPVxcXCIjL2RlY2tcXFwiPmRlY2s8L2E+IG9mIGNhcmRzPC9kZWw+PC9saT5cXG4gICAgICAgIDxsaT48ZGVsPkFsaWNlIGFuZCBCb2IgPGEgaHJlZj1cXFwiIy9tZXNzYWdlXFxcIj5pZGVudGlmeTwvYT48L2RlbD48L2xpPlxcbiAgICAgICAgPGxpPjxkZWw+QWxpY2UgYW5kIEJvYiA8YSBocmVmPVxcXCIjL2Nvbm5lY3RcXFwiPmNvbm5lY3Q8L2E+PC9kZWw+PC9saT5cXG4gICAgICAgIDxsaT48ZGVsPkFsaWNlIGFuZCBCb2IgPGEgaHJlZj1cXFwiaHR0cHM6Ly9naXRodWIuY29tL2NvbGVhbGJvbi9zdHJlYW1saW5lclxcXCI+ZXhjaGFuZ2Uga2V5czwvYT48L2RlbD88L2xpPlxcbiAgICAgICAgPGxpPkFsaWNlIGFuZCBCb2IgYWdyZWUgb24gYSBjZXJ0YWluIFxcXCI8YSBocmVmPVxcXCIjL2RlY2tcXFwiPmRlY2s8L2E+XFxcIiBvZiBjYXJkcy4gSW4gcHJhY3RpY2UsIHRoaXMgbWVhbnMgdGhleSBhZ3JlZSBvbiBhIHNldCBvZiBudW1iZXJzIG9yIG90aGVyIGRhdGEgc3VjaCB0aGF0IGVhY2ggZWxlbWVudCBvZiB0aGUgc2V0IHJlcHJlc2VudHMgYSBjYXJkLjwvbGk+XFxuICAgICAgICA8bGk+QWxpY2UgcGlja3MgYW4gZW5jcnlwdGlvbiBrZXkgQSBhbmQgdXNlcyB0aGlzIHRvIGVuY3J5cHQgZWFjaCBjYXJkIG9mIHRoZSBkZWNrLjwvbGk+XFxuICAgICAgICA8bGk+QWxpY2UgPGEgaHJlZj1cXFwiaHR0cHM6Ly9ib3N0Lm9ja3Mub3JnL21pa2Uvc2h1ZmZsZS9cXFwiPnNodWZmbGVzPC9hPiB0aGUgY2FyZHMuPC9saT5cXG4gICAgICAgIDxsaT5BbGljZSBwYXNzZXMgdGhlIGVuY3J5cHRlZCBhbmQgc2h1ZmZsZWQgZGVjayB0byBCb2IuIFdpdGggdGhlIGVuY3J5cHRpb24gaW4gcGxhY2UsIEJvYiBjYW5ub3Qga25vdyB3aGljaCBjYXJkIGlzIHdoaWNoLjwvbGk+XFxuICAgICAgICA8bGk+Qm9iIHNodWZmbGVzIHRoZSBkZWNrLjwvbGk+XFxuICAgICAgICA8bGk+Qm9iIHBhc3NlcyB0aGUgZG91YmxlIGVuY3J5cHRlZCBhbmQgc2h1ZmZsZWQgZGVjayBiYWNrIHRvIEFsaWNlLjwvbGk+XFxuICAgICAgICA8bGk+QWxpY2UgZGVjcnlwdHMgZWFjaCBjYXJkIHVzaW5nIGhlciBrZXkgQS4gVGhpcyBzdGlsbCBsZWF2ZXMgQm9iJ3MgZW5jcnlwdGlvbiBpbiBwbGFjZSB0aG91Z2ggc28gc2hlIGNhbm5vdCBrbm93IHdoaWNoIGNhcmQgaXMgd2hpY2guPC9saT5cXG4gICAgICAgIDxsaT5BbGljZSBwaWNrcyBvbmUgZW5jcnlwdGlvbiBrZXkgZm9yIGVhY2ggY2FyZCAoQTEsIEEyLCBldGMuKSBhbmQgZW5jcnlwdHMgdGhlbSBpbmRpdmlkdWFsbHkuPC9saT5cXG4gICAgICAgIDxsaT5BbGljZSBwYXNzZXMgdGhlIGRlY2sgdG8gQm9iLjwvbGk+XFxuICAgICAgICA8bGk+Qm9iIGRlY3J5cHRzIGVhY2ggY2FyZCB1c2luZyBoaXMga2V5IEIuIFRoaXMgc3RpbGwgbGVhdmVzIEFsaWNlJ3MgaW5kaXZpZHVhbCBlbmNyeXB0aW9uIGluIHBsYWNlIHRob3VnaCBzbyBoZSBjYW5ub3Qga25vdyB3aGljaCBjYXJkIGlzIHdoaWNoLjwvbGk+XFxuICAgICAgICA8bGk+Qm9iIHBpY2tzIG9uZSBlbmNyeXB0aW9uIGtleSBmb3IgZWFjaCBjYXJkIChCMSwgQjIsIGV0Yy4pIGFuZCBlbmNyeXB0cyB0aGVtIGluZGl2aWR1YWxseS48L2xpPlxcbiAgICAgICAgPGxpPkJvYiBwYXNzZXMgdGhlIGRlY2sgYmFjayB0byBBbGljZS48L2xpPlxcbiAgICAgICAgPGxpPkFsaWNlIHB1Ymxpc2hlcyB0aGUgZGVjayBmb3IgZXZlcnlvbmUgcGxheWluZyAoaW4gdGhpcyBjYXNlIG9ubHkgQWxpY2UgYW5kIEJvYiwgc2VlIGJlbG93IG9uIGV4cGFuc2lvbiB0aG91Z2gpLjwvbGk+XFxuICAgIDwvdWw+XFxuPC9kZXRhaWxzPlxcbjwvc3Bhbj5cXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yYXctbG9hZGVyIS4vdmlld3MvcGFydGlhbHMvcm9hZG1hcC5odG1sXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImxldCBjb250YWN0UGFydGlhbCA9IHJlcXVpcmUoXCJyYXctbG9hZGVyIS4uLy4uL3ZpZXdzL3BhcnRpYWxzL2NvbnRhY3QuaHRtbFwiKTtcbmV4cG9ydCBjbGFzcyBDb250YWN0UGFnZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLmlubmVySFRNTCA9ICc8cD4nICsgY29udGFjdFBhcnRpYWwgKyAnPC9wPic7XG4gICAgfVxufVxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwiY29udGFjdC1wYWdlXCIsIENvbnRhY3RQYWdlKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYWdlcy9jb250YWN0LmpzIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxzcGFuIGNsYXNzPVxcXCJjb250YWN0XFxcIj5cXG4gICAgQ29sZSBBbGJvbjxicj5cXG4gICAgPGEgaHJlZj1cXFwidGVsOisxNDE1NjcyMTY0OFxcXCI+KDQxNSkgNjcyLTE2NDg8L2E+PGJyPlxcbiAgICA8YSBocmVmPVxcXCJtYWlsdG86Y29sZS5hbGJvbkBnbWFpbC5jb21cXFwiPmNvbGUuYWxib25AZ21haWwuY29tPC9hPjxicj5cXG4gICAgPGEgaHJlZj1cXFwiaHR0cHM6Ly9naXRodWIuY29tL2NvbGVhbGJvblxcXCI+aHR0cHM6Ly9naXRodWIuY29tL2NvbGVhbGJvbjwvYT48YnI+XFxuICAgIDxhIGhyZWY9XFxcImh0dHBzOi8vd3d3LmxpbmtlZGluLmNvbS9pbi9jb2xlLWFsYm9uLTU5MzQ2MzRcXFwiPlxcbiAgICAgICAgPHNwYW4gaWQ9XFxcImxpbmtlZGluYWRkcmVzc1xcXCIgY2xhc3M9XFxcImxpbmtlZGluYWRkcmVzc1xcXCI+aHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL2NvbGUtYWxib24tNTkzNDYzNDwvc3Bhbj5cXG4gICAgPC9hPjxicj5cXG48L3NwYW4+XFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmF3LWxvYWRlciEuL3ZpZXdzL3BhcnRpYWxzL2NvbnRhY3QuaHRtbFxuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGNsaWVudFB1YmtleUZvcm1QYXJ0aWFsID0gcmVxdWlyZShcInJhdy1sb2FkZXIhLi4vLi4vdmlld3MvcGFydGlhbHMvbWVzc2FnZV9mb3JtLmh0bWxcIik7XG5cbmV4cG9ydCBjbGFzcyBNZXNzYWdlUGFnZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLmlubmVySFRNTCA9IGBcbiAgICAgICAgICAgIDxwPiR7Y2xpZW50UHVia2V5Rm9ybVBhcnRpYWx9PC9wPlxuICAgICAgICBgXG4gICAgfVxufVxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwibWVzc2FnZS1wYWdlXCIsIE1lc3NhZ2VQYWdlKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYWdlcy9tZXNzYWdlLmpzIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxmb3JtXFxuICAgIGlkPVxcXCJtZXNzYWdlX2Zvcm1cXFwiXFxuICAgIG9uc3VibWl0PVxcXCJcXG4gICAgIHZhciBndW4gPSBHdW4obG9jYXRpb24ub3JpZ2luICsgJy9ndW4nKTtcXG4gICAgIG9wZW5wZ3AuY29uZmlnLmFlYWRfcHJvdGVjdCA9IHRydWVcXG4gICAgIG9wZW5wZ3AuaW5pdFdvcmtlcih7IHBhdGg6Jy9qcy9vcGVucGdwLndvcmtlci5qcycgfSlcXG4gICAgIGlmICghbWVzc2FnZV90eHQudmFsdWUpIHtcXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXFxuICAgICB9XFxuICAgICB3aW5kb3cuaGFuZGxlUG9zdChtZXNzYWdlX3R4dC52YWx1ZSkob3BlbnBncCkod2luZG93LmxvY2FsU3RvcmFnZSkoJ3JveWFsZScpLnRoZW4ocmVzdWx0ID0+IHtpZiAocmVzdWx0KSB7Y29uc29sZS5sb2cocmVzdWx0KX19KS5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcihlcnIpKTtkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVzc2FnZV90eHQnKS52YWx1ZSA9ICcnOyByZXR1cm4gZmFsc2VcXFwiXFxuICAgIG1ldGhvZD1cXFwicG9zdFxcXCJcXG4gICAgYWN0aW9uPVxcXCIvbWVzc2FnZVxcXCI+XFxuICAgIDxpbnB1dCBpZD1cXFwibWVzc2FnZV9mb3JtX2lucHV0XFxcIlxcbiAgICAgICAgdHlwZT1cXFwic3VibWl0XFxcIlxcbiAgICAgICAgdmFsdWU9XFxcInBvc3QgbWVzc2FnZVxcXCJcXG4gICAgICAgIGZvcm09XFxcIm1lc3NhZ2VfZm9ybVxcXCJcXG4gICAgICAgID5cXG48L2Zvcm0+XFxuPHRleHRhcmVhXFxuICAgIGlkPVxcXCJtZXNzYWdlX3R4dFxcXCJcXG4gICAgbmFtZT1cXFwibWVzc2FnZV90eHRcXFwiXFxuICAgIGZvcm09XFxcIm1lc3NhZ2VfZm9ybVxcXCJcXG4gICAgcm93cz01MVxcbiAgICBjb2xzPTcwXFxuICAgIHBsYWNlaG9sZGVyPVxcXCJwYXN0ZSBwbGFpbnRleHQgbWVzc2FnZSwgcHVibGljIGtleSwgb3IgcHJpdmF0ZSBrZXlcXFwiXFxuICAgIHN0eWxlPVxcXCJmb250LWZhbWlseTpNZW5sbyxDb25zb2xhcyxNb25hY28sTHVjaWRhIENvbnNvbGUsTGliZXJhdGlvbiBNb25vLERlamFWdSBTYW5zIE1vbm8sQml0c3RyZWFtIFZlcmEgU2FucyBNb25vLENvdXJpZXIgTmV3LCBtb25vc3BhY2U7XFxcIlxcbiAgICA+XFxuPC90ZXh0YXJlYT5cXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yYXctbG9hZGVyIS4vdmlld3MvcGFydGlhbHMvbWVzc2FnZV9mb3JtLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBmcmVzaERlY2tQYXJ0aWFsID0gcmVxdWlyZShcInJhdy1sb2FkZXIhLi4vLi4vdmlld3MvcGFydGlhbHMvZnJlc2hkZWNrLmh0bWxcIik7XG5cbmV4cG9ydCBjbGFzcyBEZWNrUGFnZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLmlubmVySFRNTCA9ICc8cD4nICsgZnJlc2hEZWNrUGFydGlhbCArICc8L3A+JztcbiAgICB9XG59XG5cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcImRlY2stcGFnZVwiLCBEZWNrUGFnZSk7XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ3BsYXlpbmctY2FyZCcsIHtcbiAgICBwcm90b3R5cGU6IE9iamVjdC5jcmVhdGUoSFRNTEVsZW1lbnQucHJvdG90eXBlLCB7IGNyZWF0ZWRDYWxsYmFjazoge1xuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgdmFyIHJvb3QgPSB0aGlzLmNyZWF0ZVNoYWRvd1Jvb3QoKTtcbiAgICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgdGhpcy50ZXh0Q29udGVudCB8fCAnI+KWiCcpO1xuICAgICAgICAgICAgICAgICAgdmFyIGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgIHZhciBjb2xvck92ZXJyaWRlID0gKHRoaXMucXVlcnlTZWxlY3Rvcignc3BhbicpKSA/IHRoaXMucXVlcnlTZWxlY3Rvcignc3BhbicpLnN0eWxlLmNvbG9yOiBudWxsO1xuICAgICAgICAgICAgICAgICAgaWYgKGNvbG9yT3ZlcnJpZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICBjbG9uZS5xdWVyeVNlbGVjdG9yKCdzdmcnKS5zdHlsZS5maWxsID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdzcGFuJykuc3R5bGUuY29sb3I7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG59KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYWdlcy9kZWNrLmpzIiwibW9kdWxlLmV4cG9ydHMgPSBcIiAgICA8ZGl2IGlkPVxcXCJkZWNrXFxcIiBjbGFzcz1cXFwiZGVja1xcXCI+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4paIXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTcwLjMxMjUgMzYyLjI1IEw3MC4zMTI1IDExMC4xMDk0IEwyMjQuMjk2OSAxMTAuMTA5NCBMMjI0LjI5NjkgMzYyLjI1IEw3MC4zMTI1IDM2Mi4yNSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaBBXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuNjcxOSAxMTUuNzM0NCBMOTEuODI4MSAxNzUuNzgxMiBMMTI5LjUxNTYgMTc1Ljc4MTIgTDExMC42NzE5IDExNS43MzQ0IFpNOTkuOTg0NCAxMDEuNjcxOSBMMTIxLjY0MDYgMTAxLjY3MTkgTDE2Mi4xNDA2IDIxOS4yMzQ0IEwxNDMuNTc4MSAyMTkuMjM0NCBMMTM0LjAxNTYgMTg4LjU3ODEgTDg3LjYwOTQgMTg4LjU3ODEgTDc4LjA0NjkgMjE5LjIzNDQgTDU5LjQ4NDQgMjE5LjIzNDQgTDk5Ljk4NDQgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgMlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODYuMzQzOCAyMDMuMDYyNSBMMTQ1Ljk2ODggMjAzLjA2MjUgTDE0NS45Njg4IDIxOS4wOTM4IEw2MS44NzUgMjE5LjA5MzggTDYxLjg3NSAyMDMuNjI1IFE2Ni42NTYyIDE5OS4yNjU2IDc1LjUxNTYgMTkxLjM5MDYgUTEyMy44OTA2IDE0OC41IDEyMy44OTA2IDEzNS4yODEyIFExMjMuODkwNiAxMjYgMTE2LjU3ODEgMTIwLjMwNDcgUTEwOS4yNjU2IDExNC42MDk0IDk3LjMxMjUgMTE0LjYwOTQgUTkwIDExNC42MDk0IDgxLjQyMTkgMTE3LjA3MDMgUTcyLjg0MzggMTE5LjUzMTIgNjIuNzE4OCAxMjQuNDUzMSBMNjIuNzE4OCAxMDcuMTU2MiBRNzMuNTQ2OSAxMDMuMjE4OCA4Mi44OTg0IDEwMS4yNSBROTIuMjUgOTkuMjgxMiAxMDAuMjY1NiA5OS4yODEyIFExMjAuNjU2MiA5OS4yODEyIDEzMi44OTA2IDEwOC41NjI1IFExNDUuMTI1IDExNy44NDM4IDE0NS4xMjUgMTMzLjAzMTIgUTE0NS4xMjUgMTUyLjU3ODEgOTguNTc4MSAxOTIuNTE1NiBROTAuNzAzMSAxOTkuMjY1NiA4Ni4zNDM4IDIwMy4wNjI1IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoDNcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEyMS43ODEyIDE1NS41MzEyIFExMzQuNzE4OCAxNTguMDYyNSAxNDEuODIwMyAxNjUuNzI2NiBRMTQ4LjkyMTkgMTczLjM5MDYgMTQ4LjkyMTkgMTg0LjkyMTkgUTE0OC45MjE5IDIwMi4zNTk0IDEzNS41NjI1IDIxMS43ODEyIFExMjIuMjAzMSAyMjEuMjAzMSA5Ny4zMTI1IDIyMS4yMDMxIFE4OS4yOTY5IDIyMS4yMDMxIDgwLjUwNzggMjE5LjcyNjYgUTcxLjcxODggMjE4LjI1IDYxLjg3NSAyMTUuNDM3NSBMNjEuODc1IDE5OC40MjE5IFE2OS4xODc1IDIwMi4yMTg4IDc3LjU1NDcgMjA0LjA0NjkgUTg1LjkyMTkgMjA1Ljg3NSA5NS4zNDM4IDIwNS44NzUgUTExMC42NzE5IDIwNS44NzUgMTE5LjEwOTQgMjAwLjMyMDMgUTEyNy41NDY5IDE5NC43NjU2IDEyNy41NDY5IDE4NC45MjE5IFExMjcuNTQ2OSAxNzQuNTE1NiAxMTkuNzQyMiAxNjkuMTcxOSBRMTExLjkzNzUgMTYzLjgyODEgOTYuNzUgMTYzLjgyODEgTDg0LjY1NjIgMTYzLjgyODEgTDg0LjY1NjIgMTQ4LjY0MDYgTDk3Ljg3NSAxNDguNjQwNiBRMTExLjA5MzggMTQ4LjY0MDYgMTE3LjkxNDEgMTQ0LjIxMDkgUTEyNC43MzQ0IDEzOS43ODEyIDEyNC43MzQ0IDEzMS4zNDM4IFExMjQuNzM0NCAxMjMuMTg3NSAxMTcuNzAzMSAxMTguODk4NCBRMTEwLjY3MTkgMTE0LjYwOTQgOTcuMzEyNSAxMTQuNjA5NCBROTEuNjg3NSAxMTQuNjA5NCA4NC41MTU2IDExNS44NzUgUTc3LjM0MzggMTE3LjE0MDYgNjUuOTUzMSAxMjAuMzc1IEw2NS45NTMxIDEwNC4yMDMxIFE3Ni4yMTg4IDEwMS44MTI1IDg1LjIxODggMTAwLjU0NjkgUTk0LjIxODggOTkuMjgxMiAxMDEuOTUzMSA5OS4yODEyIFExMjIuMjAzMSA5OS4yODEyIDEzNC4wODU5IDEwNy41NzgxIFExNDUuOTY4OCAxMTUuODc1IDE0NS45Njg4IDEyOS43OTY5IFExNDUuOTY4OCAxMzkuNSAxMzkuNjQwNiAxNDYuMjUgUTEzMy4zMTI1IDE1MyAxMjEuNzgxMiAxNTUuNTMxMiBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaA0XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMjAuMDkzOCAxMTguNjg3NSBMNzYuNjQwNiAxNzcuNjA5NCBMMTIwLjA5MzggMTc3LjYwOTQgTDEyMC4wOTM4IDExOC42ODc1IFpNMTE3IDEwMS42NzE5IEwxNDAuMzQzOCAxMDEuNjcxOSBMMTQwLjM0MzggMTc3LjYwOTQgTDE1OS4zMjgxIDE3Ny42MDk0IEwxNTkuMzI4MSAxOTIuOTM3NSBMMTQwLjM0MzggMTkyLjkzNzUgTDE0MC4zNDM4IDIxOS4wOTM4IEwxMjAuMDkzOCAyMTkuMDkzOCBMMTIwLjA5MzggMTkyLjkzNzUgTDYxLjg3NSAxOTIuOTM3NSBMNjEuODc1IDE3NS45MjE5IEwxMTcgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgNVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjcuNSAxMDEuNjcxOSBMMTM5LjIxODggMTAxLjY3MTkgTDEzOS4yMTg4IDExNS4wMzEyIEw4NC4yMzQ0IDExNS4wMzEyIEw4NC4yMzQ0IDE0My43MTg4IFE4OC4xNzE5IDE0Mi40NTMxIDkyLjI1IDE0MS44OTA2IFE5Ni4xODc1IDE0MS4zMjgxIDEwMC4xMjUgMTQxLjMyODEgUTEyMi43NjU2IDE0MS4zMjgxIDEzNS45ODQ0IDE1Mi4xNTYyIFExNDkuMjAzMSAxNjIuODQzOCAxNDkuMjAzMSAxODEuMjY1NiBRMTQ5LjIwMzEgMjAwLjI1IDEzNS41NjI1IDIxMC43OTY5IFExMjIuMDYyNSAyMjEuMjAzMSA5Ny4zMTI1IDIyMS4yMDMxIFE4OC44NzUgMjIxLjIwMzEgODAuMDE1NiAyMTkuOTM3NSBRNzEuMTU2MiAyMTguNjcxOSA2MS44NzUgMjE2LjE0MDYgTDYxLjg3NSAyMDAuMjUgUTY5Ljg5MDYgMjA0LjA0NjkgNzguNjA5NCAyMDYuMDE1NiBRODcuMzI4MSAyMDcuODQzOCA5Ny4wMzEyIDIwNy44NDM4IFExMTIuNjQwNiAyMDcuODQzOCAxMjEuNzgxMiAyMDAuNjcxOSBRMTMwLjkyMTkgMTkzLjUgMTMwLjkyMTkgMTgxLjI2NTYgUTEzMC45MjE5IDE2OS4wMzEyIDEyMS43ODEyIDE2MS44NTk0IFExMTIuNjQwNiAxNTQuNjg3NSA5Ny4wMzEyIDE1NC42ODc1IFE4OS43MTg4IDE1NC42ODc1IDgyLjQwNjIgMTU2LjA5MzggUTc1LjA5MzggMTU3LjUgNjcuNSAxNjAuNDUzMSBMNjcuNSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaA2XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuMTA5NCAxNTMuNzAzMSBROTcuNzM0NCAxNTMuNzAzMSA5MC41NjI1IDE2MS4wMTU2IFE4My4zOTA2IDE2OC40Njg4IDgzLjM5MDYgMTgxLjI2NTYgUTgzLjM5MDYgMTkzLjkyMTkgOTAuNTYyNSAyMDEuMjM0NCBROTcuNzM0NCAyMDguNjg3NSAxMTAuMTA5NCAyMDguNjg3NSBRMTIyLjM0MzggMjA4LjY4NzUgMTI5LjUxNTYgMjAxLjIzNDQgUTEzNi42ODc1IDE5My45MjE5IDEzNi42ODc1IDE4MS4yNjU2IFExMzYuNjg3NSAxNjguNDY4OCAxMjkuNTE1NiAxNjEuMDE1NiBRMTIyLjM0MzggMTUzLjcwMzEgMTEwLjEwOTQgMTUzLjcwMzEgWk0xNDYuMzkwNiAxMDMuOTIxOSBMMTQ2LjM5MDYgMTE4LjQwNjIgUTEzOS41IDExNS41OTM4IDEzMi40Njg4IDExNC4xODc1IFExMjUuNDM3NSAxMTIuNjQwNiAxMTguNTQ2OSAxMTIuNjQwNiBRMTAwLjU0NjkgMTEyLjY0MDYgOTAuOTg0NCAxMjMuMTg3NSBRODEuNDIxOSAxMzMuODc1IDgwLjAxNTYgMTU1LjM5MDYgUTg1LjM1OTQgMTQ4LjUgOTMuMzc1IDE0NC44NDM4IFExMDEuNTMxMiAxNDEuMTg3NSAxMTEuMDkzOCAxNDEuMTg3NSBRMTMxLjQ4NDQgMTQxLjE4NzUgMTQzLjI5NjkgMTUxLjg3NSBRMTU1LjEwOTQgMTYyLjcwMzEgMTU1LjEwOTQgMTgxLjI2NTYgUTE1NS4xMDk0IDE5OS4xMjUgMTQyLjczNDQgMjEwLjIzNDQgUTEzMC41IDIyMS4yMDMxIDExMC4xMDk0IDIyMS4yMDMxIFE4Ni42MjUgMjIxLjIwMzEgNzQuMjUgMjA1LjU5MzggUTYxLjg3NSAxODkuOTg0NCA2MS44NzUgMTYwLjE3MTkgUTYxLjg3NSAxMzIuMzI4MSA3Ny4wNjI1IDExNS44NzUgUTkyLjI1IDk5LjI4MTIgMTE3Ljg0MzggOTkuMjgxMiBRMTI0LjczNDQgOTkuMjgxMiAxMzEuNzY1NiAxMDAuNDA2MiBRMTM4Ljc5NjkgMTAxLjY3MTkgMTQ2LjM5MDYgMTAzLjkyMTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgN1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjEuODc1IDEwMS42NzE5IEwxNDguNjQwNiAxMDEuNjcxOSBMMTQ4LjY0MDYgMTA4LjQyMTkgTDk5LjcwMzEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggTDEyNi43MDMxIDExNS4wMzEyIEw2MS44NzUgMTE1LjAzMTIgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaA4XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMDguMjgxMiAxNjMuMTI1IFE5NS4yMDMxIDE2My4xMjUgODcuNzUgMTY5LjMxMjUgUTgwLjI5NjkgMTc1LjM1OTQgODAuMjk2OSAxODUuOTA2MiBRODAuMjk2OSAxOTYuNTkzOCA4Ny43NSAyMDIuNjQwNiBROTUuMjAzMSAyMDguNjg3NSAxMDguMjgxMiAyMDguNjg3NSBRMTIxLjIxODggMjA4LjY4NzUgMTI4LjgxMjUgMjAyLjUgUTEzNi4yNjU2IDE5Ni40NTMxIDEzNi4yNjU2IDE4NS45MDYyIFExMzYuMjY1NiAxNzUuMzU5NCAxMjguODEyNSAxNjkuMzEyNSBRMTIxLjM1OTQgMTYzLjEyNSAxMDguMjgxMiAxNjMuMTI1IFpNOTAgMTU2LjIzNDQgUTc4LjE4NzUgMTUzLjcwMzEgNzEuNzE4OCAxNDYuODEyNSBRNjUuMTA5NCAxMzkuNzgxMiA2NS4xMDk0IDEyOS42NTYyIFE2NS4xMDk0IDExNS41OTM4IDc2LjY0MDYgMTA3LjQzNzUgUTg4LjE3MTkgOTkuMjgxMiAxMDguMjgxMiA5OS4yODEyIFExMjguMzkwNiA5OS4yODEyIDEzOS45MjE5IDEwNy40Mzc1IFExNTEuMzEyNSAxMTUuNTkzOCAxNTEuMzEyNSAxMjkuNjU2MiBRMTUxLjMxMjUgMTQwLjA2MjUgMTQ0Ljg0MzggMTQ2LjgxMjUgUTEzOC4yMzQ0IDE1My43MDMxIDEyNi41NjI1IDE1Ni4yMzQ0IFExMzkuMjE4OCAxNTguNzY1NiAxNDcuMDkzOCAxNjYuOTIxOSBRMTU0LjU0NjkgMTc0LjY1NjIgMTU0LjU0NjkgMTg1LjkwNjIgUTE1NC41NDY5IDIwMi45MjE5IDE0Mi41OTM4IDIxMi4wNjI1IFExMzAuNSAyMjEuMjAzMSAxMDguMjgxMiAyMjEuMjAzMSBRODUuOTIxOSAyMjEuMjAzMSA3My45Njg4IDIxMi4wNjI1IFE2MS44NzUgMjAyLjkyMTkgNjEuODc1IDE4NS45MDYyIFE2MS44NzUgMTc0LjkzNzUgNjkuMzI4MSAxNjYuOTIxOSBRNzYuOTIxOSAxNTkuMDQ2OSA5MCAxNTYuMjM0NCBaTTgzLjI1IDEzMS4yMDMxIFE4My4yNSAxNDAuMDYyNSA4OS44NTk0IDE0NS40MDYyIFE5Ni4zMjgxIDE1MC42MDk0IDEwOC4yODEyIDE1MC42MDk0IFExMTkuNjcxOSAxNTAuNjA5NCAxMjYuNTYyNSAxNDUuNDA2MiBRMTMzLjMxMjUgMTQwLjM0MzggMTMzLjMxMjUgMTMxLjIwMzEgUTEzMy4zMTI1IDEyMi4zNDM4IDEyNi41NjI1IDExNyBRMTE5Ljk1MzEgMTExLjc5NjkgMTA4LjI4MTIgMTExLjc5NjkgUTk2LjYwOTQgMTExLjc5NjkgODkuODU5NCAxMTcgUTgzLjI1IDEyMi4wNjI1IDgzLjI1IDEzMS4yMDMxIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoDlcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTcwLjU5MzggMjE2LjU2MjUgTDcwLjU5MzggMjAyLjA3ODEgUTc3LjQ4NDQgMjA0Ljg5MDYgODQuNTE1NiAyMDYuNDM3NSBROTEuNTQ2OSAyMDcuODQzOCA5OC4yOTY5IDIwNy44NDM4IFExMTYuNDM3NSAyMDcuODQzOCAxMjYgMTk3LjI5NjkgUTEzNS40MjE5IDE4Ni43NSAxMzYuODI4MSAxNjUuMDkzOCBRMTMxLjkwNjIgMTcxLjcwMzEgMTIzLjQ2ODggMTc1LjUgUTExNS40NTMxIDE3OS4xNTYyIDEwNS43NSAxNzkuMTU2MiBRODUuNSAxNzkuMTU2MiA3My42ODc1IDE2OC40Njg4IFE2MS44NzUgMTU3Ljc4MTIgNjEuODc1IDEzOS4yMTg4IFE2MS44NzUgMTIxLjA3ODEgNzQuMTA5NCAxMTAuMjUgUTg2LjQ4NDQgOTkuMjgxMiAxMDYuODc1IDk5LjI4MTIgUTEzMC4zNTk0IDk5LjI4MTIgMTQyLjU5MzggMTE0Ljg5MDYgUTE1NC45Njg4IDEzMC41IDE1NC45Njg4IDE2MC4zMTI1IFExNTQuOTY4OCAxODguMTU2MiAxMzkuOTIxOSAyMDQuNjA5NCBRMTI0LjczNDQgMjIxLjIwMzEgOTkuMTQwNiAyMjEuMjAzMSBROTIuMjUgMjIxLjIwMzEgODUuMjE4OCAyMjAuMDc4MSBRNzguMTg3NSAyMTguODEyNSA3MC41OTM4IDIxNi41NjI1IFpNMTA2Ljg3NSAxNjYuNzgxMiBRMTE5LjI1IDE2Ni43ODEyIDEyNi40MjE5IDE1OS40Njg4IFExMzMuNTkzOCAxNTIuMTU2MiAxMzMuNTkzOCAxMzkuMjE4OCBRMTMzLjU5MzggMTI2LjU2MjUgMTI2LjQyMTkgMTE5LjI1IFExMTkuMjUgMTExLjc5NjkgMTA2Ljg3NSAxMTEuNzk2OSBROTQuOTIxOSAxMTEuNzk2OSA4Ny40Njg4IDExOS4yNSBRODAuMTU2MiAxMjYuNTYyNSA4MC4xNTYyIDEzOS4yMTg4IFE4MC4xNTYyIDE1Mi4xNTYyIDg3LjQ2ODggMTU5LjQ2ODggUTk0LjY0MDYgMTY2Ljc4MTIgMTA2Ljg3NSAxNjYuNzgxMiBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaAxMFxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTU5LjA0NjkgMTExLjc5NjkgUTE0OS4wNjI1IDExMS43OTY5IDE0Mi4wMzEyIDEyMy44OTA2IFExMzQuODU5NCAxMzUuOTg0NCAxMzQuODU5NCAxNjAuMTcxOSBRMTM0Ljg1OTQgMTg0LjUgMTQyLjAzMTIgMTk2LjU5MzggUTE0OS4wNjI1IDIwOC42ODc1IDE1OS4wNDY5IDIwOC42ODc1IFExNjkuMDMxMiAyMDguNjg3NSAxNzYuMDYyNSAxOTYuNTkzOCBRMTgzLjIzNDQgMTg0LjUgMTgzLjIzNDQgMTYwLjE3MTkgUTE4My4yMzQ0IDEzNS45ODQ0IDE3Ni4wNjI1IDEyMy44OTA2IFExNjkuMDMxMiAxMTEuNzk2OSAxNTkuMDQ2OSAxMTEuNzk2OSBaTTE1OS4wNDY5IDk5LjI4MTIgUTE3Ny40Njg4IDk5LjI4MTIgMTg5LjQyMTkgMTE0Ljg5MDYgUTIwMS4zNzUgMTMwLjUgMjAxLjM3NSAxNjAuMTcxOSBRMjAxLjM3NSAxODkuOTg0NCAxODkuNDIxOSAyMDUuNTkzOCBRMTc3LjQ2ODggMjIxLjIwMzEgMTU5LjA0NjkgMjIxLjIwMzEgUTEzNi4yNjU2IDIyMS4yMDMxIDEyNi40MjE5IDIwNS41OTM4IFExMTYuNTc4MSAxODkuOTg0NCAxMTYuNTc4MSAxNjAuMTcxOSBRMTE2LjU3ODEgMTMwLjUgMTI2LjQyMTkgMTE0Ljg5MDYgUTEzNi4yNjU2IDk5LjI4MTIgMTU5LjA0NjkgOTkuMjgxMiBaTTgwLjU3ODEgMjE5LjA5MzggTDgwLjU3ODEgMTE3LjcwMzEgTDYxLjg3NSAxMjMuNDY4OCBMNjEuODc1IDEwNy4xNTYyIEw4MS41NjI1IDEwMS42NzE5IEwxMDAuODI4MSAxMDEuNjcxOSBMMTAwLjgyODEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgSlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODkuMTU2MiAxMDEuNjcxOSBMMTA3LjAxNTYgMTAxLjY3MTkgTDEwNy4wMTU2IDE3OC43MzQ0IFExMDcuMDE1NiAxOTkuNjg3NSA5Ny44NzUgMjA5LjUzMTIgUTg4Ljg3NSAyMTkuMjM0NCA2OC43NjU2IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAyMDUuNzM0NCBMNjcuNSAyMDUuNzM0NCBRNzkuMzEyNSAyMDUuNzM0NCA4NC4yMzQ0IDE5OS44MjgxIFE4OS4xNTYyIDE5My45MjE5IDg5LjE1NjIgMTc4LjczNDQgTDg5LjE1NjIgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgUVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTA3LjI5NjkgMjIxLjA2MjUgUTEwNi43MzQ0IDIyMS4wNjI1IDEwNS41MzkxIDIyMS4xMzI4IFExMDQuMzQzOCAyMjEuMjAzMSAxMDMuNjQwNiAyMjEuMjAzMSBRODEuNDIxOSAyMjEuMjAzMSA3MC41MjM0IDIwNi4wODU5IFE1OS42MjUgMTkwLjk2ODggNTkuNjI1IDE2MC4zMTI1IFE1OS42MjUgMTI5LjUxNTYgNzAuNTkzOCAxMTQuMzk4NCBRODEuNTYyNSA5OS4yODEyIDEwMy43ODEyIDk5LjI4MTIgUTEyNi4xNDA2IDk5LjI4MTIgMTM3LjEwOTQgMTE0LjM5ODQgUTE0OC4wNzgxIDEyOS41MTU2IDE0OC4wNzgxIDE2MC4zMTI1IFExNDguMDc4MSAxODMuNTE1NiAxNDIuMDMxMiAxOTcuNjQ4NCBRMTM1Ljk4NDQgMjExLjc4MTIgMTIzLjYwOTQgMjE3LjQwNjIgTDE0MS4zMjgxIDIzMi4zMTI1IEwxMjcuOTY4OCAyNDAuMTg3NSBMMTA3LjI5NjkgMjIxLjA2MjUgWk0xMjkuMzc1IDE2MC4zMTI1IFExMjkuMzc1IDEzNC40Mzc1IDEyMy4zOTg0IDEyMy4zMjgxIFExMTcuNDIxOSAxMTIuMjE4OCAxMDMuNzgxMiAxMTIuMjE4OCBROTAuMjgxMiAxMTIuMjE4OCA4NC4zMDQ3IDEyMy4zMjgxIFE3OC4zMjgxIDEzNC40Mzc1IDc4LjMyODEgMTYwLjMxMjUgUTc4LjMyODEgMTg2LjE4NzUgODQuMzA0NyAxOTcuMjk2OSBROTAuMjgxMiAyMDguNDA2MiAxMDMuNzgxMiAyMDguNDA2MiBRMTE3LjQyMTkgMjA4LjQwNjIgMTIzLjM5ODQgMTk3LjI5NjkgUTEyOS4zNzUgMTg2LjE4NzUgMTI5LjM3NSAxNjAuMzEyNSBaTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaBLXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02MS44NzUgMTAxLjY3MTkgTDc5LjczNDQgMTAxLjY3MTkgTDc5LjczNDQgMTUxLjMxMjUgTDEzMC42NDA2IDEwMS42NzE5IEwxNTMuNzAzMSAxMDEuNjcxOSBMOTYuNDY4OCAxNTYuNTE1NiBMMTU4LjM0MzggMjE5LjIzNDQgTDEzNC44NTk0IDIxOS4yMzQ0IEw3OS43MzQ0IDE2Mi41NjI1IEw3OS43MzQ0IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaVBXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuNjcxOSAxMTUuNzM0NCBMOTEuODI4MSAxNzUuNzgxMiBMMTI5LjUxNTYgMTc1Ljc4MTIgTDExMC42NzE5IDExNS43MzQ0IFpNOTkuOTg0NCAxMDEuNjcxOSBMMTIxLjY0MDYgMTAxLjY3MTkgTDE2Mi4xNDA2IDIxOS4yMzQ0IEwxNDMuNTc4MSAyMTkuMjM0NCBMMTM0LjAxNTYgMTg4LjU3ODEgTDg3LjYwOTQgMTg4LjU3ODEgTDc4LjA0NjkgMjE5LjIzNDQgTDU5LjQ4NDQgMjE5LjIzNDQgTDk5Ljk4NDQgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlMlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTg2LjM0MzggMjAzLjA2MjUgTDE0NS45Njg4IDIwMy4wNjI1IEwxNDUuOTY4OCAyMTkuMDkzOCBMNjEuODc1IDIxOS4wOTM4IEw2MS44NzUgMjAzLjYyNSBRNjYuNjU2MiAxOTkuMjY1NiA3NS41MTU2IDE5MS4zOTA2IFExMjMuODkwNiAxNDguNSAxMjMuODkwNiAxMzUuMjgxMiBRMTIzLjg5MDYgMTI2IDExNi41NzgxIDEyMC4zMDQ3IFExMDkuMjY1NiAxMTQuNjA5NCA5Ny4zMTI1IDExNC42MDk0IFE5MCAxMTQuNjA5NCA4MS40MjE5IDExNy4wNzAzIFE3Mi44NDM4IDExOS41MzEyIDYyLjcxODggMTI0LjQ1MzEgTDYyLjcxODggMTA3LjE1NjIgUTczLjU0NjkgMTAzLjIxODggODIuODk4NCAxMDEuMjUgUTkyLjI1IDk5LjI4MTIgMTAwLjI2NTYgOTkuMjgxMiBRMTIwLjY1NjIgOTkuMjgxMiAxMzIuODkwNiAxMDguNTYyNSBRMTQ1LjEyNSAxMTcuODQzOCAxNDUuMTI1IDEzMy4wMzEyIFExNDUuMTI1IDE1Mi41NzgxIDk4LjU3ODEgMTkyLjUxNTYgUTkwLjcwMzEgMTk5LjI2NTYgODYuMzQzOCAyMDMuMDYyNSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaUzXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTIxLjc4MTIgMTU1LjUzMTIgUTEzNC43MTg4IDE1OC4wNjI1IDE0MS44MjAzIDE2NS43MjY2IFExNDguOTIxOSAxNzMuMzkwNiAxNDguOTIxOSAxODQuOTIxOSBRMTQ4LjkyMTkgMjAyLjM1OTQgMTM1LjU2MjUgMjExLjc4MTIgUTEyMi4yMDMxIDIyMS4yMDMxIDk3LjMxMjUgMjIxLjIwMzEgUTg5LjI5NjkgMjIxLjIwMzEgODAuNTA3OCAyMTkuNzI2NiBRNzEuNzE4OCAyMTguMjUgNjEuODc1IDIxNS40Mzc1IEw2MS44NzUgMTk4LjQyMTkgUTY5LjE4NzUgMjAyLjIxODggNzcuNTU0NyAyMDQuMDQ2OSBRODUuOTIxOSAyMDUuODc1IDk1LjM0MzggMjA1Ljg3NSBRMTEwLjY3MTkgMjA1Ljg3NSAxMTkuMTA5NCAyMDAuMzIwMyBRMTI3LjU0NjkgMTk0Ljc2NTYgMTI3LjU0NjkgMTg0LjkyMTkgUTEyNy41NDY5IDE3NC41MTU2IDExOS43NDIyIDE2OS4xNzE5IFExMTEuOTM3NSAxNjMuODI4MSA5Ni43NSAxNjMuODI4MSBMODQuNjU2MiAxNjMuODI4MSBMODQuNjU2MiAxNDguNjQwNiBMOTcuODc1IDE0OC42NDA2IFExMTEuMDkzOCAxNDguNjQwNiAxMTcuOTE0MSAxNDQuMjEwOSBRMTI0LjczNDQgMTM5Ljc4MTIgMTI0LjczNDQgMTMxLjM0MzggUTEyNC43MzQ0IDEyMy4xODc1IDExNy43MDMxIDExOC44OTg0IFExMTAuNjcxOSAxMTQuNjA5NCA5Ny4zMTI1IDExNC42MDk0IFE5MS42ODc1IDExNC42MDk0IDg0LjUxNTYgMTE1Ljg3NSBRNzcuMzQzOCAxMTcuMTQwNiA2NS45NTMxIDEyMC4zNzUgTDY1Ljk1MzEgMTA0LjIwMzEgUTc2LjIxODggMTAxLjgxMjUgODUuMjE4OCAxMDAuNTQ2OSBROTQuMjE4OCA5OS4yODEyIDEwMS45NTMxIDk5LjI4MTIgUTEyMi4yMDMxIDk5LjI4MTIgMTM0LjA4NTkgMTA3LjU3ODEgUTE0NS45Njg4IDExNS44NzUgMTQ1Ljk2ODggMTI5Ljc5NjkgUTE0NS45Njg4IDEzOS41IDEzOS42NDA2IDE0Ni4yNSBRMTMzLjMxMjUgMTUzIDEyMS43ODEyIDE1NS41MzEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpTRcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi42ODc1IDI3My42NTYyIFExNzUuNzgxMiAyNTcuMDYyNSAxODMuNTE1NiAyNDguMzQzOCBRMTkyLjIzNDQgMjM4LjM1OTQgMjA0LjA0NjkgMjM4LjM1OTQgUTIyMy41OTM4IDIzOC4zNTk0IDIzMi4zMTI1IDI1OS4zMTI1IFEyMzQuOTg0NCAyNjUuNjQwNiAyMzQuOTg0NCAyNzMuOTM3NSBRMjM0Ljk4NDQgMjk2LjE1NjIgMjE3LjQwNjIgMzE4LjUxNTYgTDE3Mi45Njg4IDM3NS4wNDY5IEwxMjcuOTY4OCAzMTguNTE1NiBRMTEwLjM5MDYgMjk2LjQzNzUgMTEwLjM5MDYgMjczLjkzNzUgUTExMC4zOTA2IDI2NS42NDA2IDExMy4wNjI1IDI1OS4zMTI1IFExMjEuOTIxOSAyMzguMzU5NCAxNDEuMzI4MSAyMzguMzU5NCBRMTUzLjQyMTkgMjM4LjM1OTQgMTYxLjg1OTQgMjQ4LjM0MzggUTE2OS41OTM4IDI1Ny40ODQ0IDE3Mi42ODc1IDI3My42NTYyIFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMjAuMDkzOCAxMTguNjg3NSBMNzYuNjQwNiAxNzcuNjA5NCBMMTIwLjA5MzggMTc3LjYwOTQgTDEyMC4wOTM4IDExOC42ODc1IFpNMTE3IDEwMS42NzE5IEwxNDAuMzQzOCAxMDEuNjcxOSBMMTQwLjM0MzggMTc3LjYwOTQgTDE1OS4zMjgxIDE3Ny42MDk0IEwxNTkuMzI4MSAxOTIuOTM3NSBMMTQwLjM0MzggMTkyLjkzNzUgTDE0MC4zNDM4IDIxOS4wOTM4IEwxMjAuMDkzOCAyMTkuMDkzOCBMMTIwLjA5MzggMTkyLjkzNzUgTDYxLjg3NSAxOTIuOTM3NSBMNjEuODc1IDE3NS45MjE5IEwxMTcgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlNVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTY3LjUgMTAxLjY3MTkgTDEzOS4yMTg4IDEwMS42NzE5IEwxMzkuMjE4OCAxMTUuMDMxMiBMODQuMjM0NCAxMTUuMDMxMiBMODQuMjM0NCAxNDMuNzE4OCBRODguMTcxOSAxNDIuNDUzMSA5Mi4yNSAxNDEuODkwNiBROTYuMTg3NSAxNDEuMzI4MSAxMDAuMTI1IDE0MS4zMjgxIFExMjIuNzY1NiAxNDEuMzI4MSAxMzUuOTg0NCAxNTIuMTU2MiBRMTQ5LjIwMzEgMTYyLjg0MzggMTQ5LjIwMzEgMTgxLjI2NTYgUTE0OS4yMDMxIDIwMC4yNSAxMzUuNTYyNSAyMTAuNzk2OSBRMTIyLjA2MjUgMjIxLjIwMzEgOTcuMzEyNSAyMjEuMjAzMSBRODguODc1IDIyMS4yMDMxIDgwLjAxNTYgMjE5LjkzNzUgUTcxLjE1NjIgMjE4LjY3MTkgNjEuODc1IDIxNi4xNDA2IEw2MS44NzUgMjAwLjI1IFE2OS44OTA2IDIwNC4wNDY5IDc4LjYwOTQgMjA2LjAxNTYgUTg3LjMyODEgMjA3Ljg0MzggOTcuMDMxMiAyMDcuODQzOCBRMTEyLjY0MDYgMjA3Ljg0MzggMTIxLjc4MTIgMjAwLjY3MTkgUTEzMC45MjE5IDE5My41IDEzMC45MjE5IDE4MS4yNjU2IFExMzAuOTIxOSAxNjkuMDMxMiAxMjEuNzgxMiAxNjEuODU5NCBRMTEyLjY0MDYgMTU0LjY4NzUgOTcuMDMxMiAxNTQuNjg3NSBRODkuNzE4OCAxNTQuNjg3NSA4Mi40MDYyIDE1Ni4wOTM4IFE3NS4wOTM4IDE1Ny41IDY3LjUgMTYwLjQ1MzEgTDY3LjUgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlNlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTExMC4xMDk0IDE1My43MDMxIFE5Ny43MzQ0IDE1My43MDMxIDkwLjU2MjUgMTYxLjAxNTYgUTgzLjM5MDYgMTY4LjQ2ODggODMuMzkwNiAxODEuMjY1NiBRODMuMzkwNiAxOTMuOTIxOSA5MC41NjI1IDIwMS4yMzQ0IFE5Ny43MzQ0IDIwOC42ODc1IDExMC4xMDk0IDIwOC42ODc1IFExMjIuMzQzOCAyMDguNjg3NSAxMjkuNTE1NiAyMDEuMjM0NCBRMTM2LjY4NzUgMTkzLjkyMTkgMTM2LjY4NzUgMTgxLjI2NTYgUTEzNi42ODc1IDE2OC40Njg4IDEyOS41MTU2IDE2MS4wMTU2IFExMjIuMzQzOCAxNTMuNzAzMSAxMTAuMTA5NCAxNTMuNzAzMSBaTTE0Ni4zOTA2IDEwMy45MjE5IEwxNDYuMzkwNiAxMTguNDA2MiBRMTM5LjUgMTE1LjU5MzggMTMyLjQ2ODggMTE0LjE4NzUgUTEyNS40Mzc1IDExMi42NDA2IDExOC41NDY5IDExMi42NDA2IFExMDAuNTQ2OSAxMTIuNjQwNiA5MC45ODQ0IDEyMy4xODc1IFE4MS40MjE5IDEzMy44NzUgODAuMDE1NiAxNTUuMzkwNiBRODUuMzU5NCAxNDguNSA5My4zNzUgMTQ0Ljg0MzggUTEwMS41MzEyIDE0MS4xODc1IDExMS4wOTM4IDE0MS4xODc1IFExMzEuNDg0NCAxNDEuMTg3NSAxNDMuMjk2OSAxNTEuODc1IFExNTUuMTA5NCAxNjIuNzAzMSAxNTUuMTA5NCAxODEuMjY1NiBRMTU1LjEwOTQgMTk5LjEyNSAxNDIuNzM0NCAyMTAuMjM0NCBRMTMwLjUgMjIxLjIwMzEgMTEwLjEwOTQgMjIxLjIwMzEgUTg2LjYyNSAyMjEuMjAzMSA3NC4yNSAyMDUuNTkzOCBRNjEuODc1IDE4OS45ODQ0IDYxLjg3NSAxNjAuMTcxOSBRNjEuODc1IDEzMi4zMjgxIDc3LjA2MjUgMTE1Ljg3NSBROTIuMjUgOTkuMjgxMiAxMTcuODQzOCA5OS4yODEyIFExMjQuNzM0NCA5OS4yODEyIDEzMS43NjU2IDEwMC40MDYyIFExMzguNzk2OSAxMDEuNjcxOSAxNDYuMzkwNiAxMDMuOTIxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaU3XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjEuODc1IDEwMS42NzE5IEwxNDguNjQwNiAxMDEuNjcxOSBMMTQ4LjY0MDYgMTA4LjQyMTkgTDk5LjcwMzEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggTDEyNi43MDMxIDExNS4wMzEyIEw2MS44NzUgMTE1LjAzMTIgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaU4XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTA4LjI4MTIgMTYzLjEyNSBROTUuMjAzMSAxNjMuMTI1IDg3Ljc1IDE2OS4zMTI1IFE4MC4yOTY5IDE3NS4zNTk0IDgwLjI5NjkgMTg1LjkwNjIgUTgwLjI5NjkgMTk2LjU5MzggODcuNzUgMjAyLjY0MDYgUTk1LjIwMzEgMjA4LjY4NzUgMTA4LjI4MTIgMjA4LjY4NzUgUTEyMS4yMTg4IDIwOC42ODc1IDEyOC44MTI1IDIwMi41IFExMzYuMjY1NiAxOTYuNDUzMSAxMzYuMjY1NiAxODUuOTA2MiBRMTM2LjI2NTYgMTc1LjM1OTQgMTI4LjgxMjUgMTY5LjMxMjUgUTEyMS4zNTk0IDE2My4xMjUgMTA4LjI4MTIgMTYzLjEyNSBaTTkwIDE1Ni4yMzQ0IFE3OC4xODc1IDE1My43MDMxIDcxLjcxODggMTQ2LjgxMjUgUTY1LjEwOTQgMTM5Ljc4MTIgNjUuMTA5NCAxMjkuNjU2MiBRNjUuMTA5NCAxMTUuNTkzOCA3Ni42NDA2IDEwNy40Mzc1IFE4OC4xNzE5IDk5LjI4MTIgMTA4LjI4MTIgOTkuMjgxMiBRMTI4LjM5MDYgOTkuMjgxMiAxMzkuOTIxOSAxMDcuNDM3NSBRMTUxLjMxMjUgMTE1LjU5MzggMTUxLjMxMjUgMTI5LjY1NjIgUTE1MS4zMTI1IDE0MC4wNjI1IDE0NC44NDM4IDE0Ni44MTI1IFExMzguMjM0NCAxNTMuNzAzMSAxMjYuNTYyNSAxNTYuMjM0NCBRMTM5LjIxODggMTU4Ljc2NTYgMTQ3LjA5MzggMTY2LjkyMTkgUTE1NC41NDY5IDE3NC42NTYyIDE1NC41NDY5IDE4NS45MDYyIFExNTQuNTQ2OSAyMDIuOTIxOSAxNDIuNTkzOCAyMTIuMDYyNSBRMTMwLjUgMjIxLjIwMzEgMTA4LjI4MTIgMjIxLjIwMzEgUTg1LjkyMTkgMjIxLjIwMzEgNzMuOTY4OCAyMTIuMDYyNSBRNjEuODc1IDIwMi45MjE5IDYxLjg3NSAxODUuOTA2MiBRNjEuODc1IDE3NC45Mzc1IDY5LjMyODEgMTY2LjkyMTkgUTc2LjkyMTkgMTU5LjA0NjkgOTAgMTU2LjIzNDQgWk04My4yNSAxMzEuMjAzMSBRODMuMjUgMTQwLjA2MjUgODkuODU5NCAxNDUuNDA2MiBROTYuMzI4MSAxNTAuNjA5NCAxMDguMjgxMiAxNTAuNjA5NCBRMTE5LjY3MTkgMTUwLjYwOTQgMTI2LjU2MjUgMTQ1LjQwNjIgUTEzMy4zMTI1IDE0MC4zNDM4IDEzMy4zMTI1IDEzMS4yMDMxIFExMzMuMzEyNSAxMjIuMzQzOCAxMjYuNTYyNSAxMTcgUTExOS45NTMxIDExMS43OTY5IDEwOC4yODEyIDExMS43OTY5IFE5Ni42MDk0IDExMS43OTY5IDg5Ljg1OTQgMTE3IFE4My4yNSAxMjIuMDYyNSA4My4yNSAxMzEuMjAzMSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaU5XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNzAuNTkzOCAyMTYuNTYyNSBMNzAuNTkzOCAyMDIuMDc4MSBRNzcuNDg0NCAyMDQuODkwNiA4NC41MTU2IDIwNi40Mzc1IFE5MS41NDY5IDIwNy44NDM4IDk4LjI5NjkgMjA3Ljg0MzggUTExNi40Mzc1IDIwNy44NDM4IDEyNiAxOTcuMjk2OSBRMTM1LjQyMTkgMTg2Ljc1IDEzNi44MjgxIDE2NS4wOTM4IFExMzEuOTA2MiAxNzEuNzAzMSAxMjMuNDY4OCAxNzUuNSBRMTE1LjQ1MzEgMTc5LjE1NjIgMTA1Ljc1IDE3OS4xNTYyIFE4NS41IDE3OS4xNTYyIDczLjY4NzUgMTY4LjQ2ODggUTYxLjg3NSAxNTcuNzgxMiA2MS44NzUgMTM5LjIxODggUTYxLjg3NSAxMjEuMDc4MSA3NC4xMDk0IDExMC4yNSBRODYuNDg0NCA5OS4yODEyIDEwNi44NzUgOTkuMjgxMiBRMTMwLjM1OTQgOTkuMjgxMiAxNDIuNTkzOCAxMTQuODkwNiBRMTU0Ljk2ODggMTMwLjUgMTU0Ljk2ODggMTYwLjMxMjUgUTE1NC45Njg4IDE4OC4xNTYyIDEzOS45MjE5IDIwNC42MDk0IFExMjQuNzM0NCAyMjEuMjAzMSA5OS4xNDA2IDIyMS4yMDMxIFE5Mi4yNSAyMjEuMjAzMSA4NS4yMTg4IDIyMC4wNzgxIFE3OC4xODc1IDIxOC44MTI1IDcwLjU5MzggMjE2LjU2MjUgWk0xMDYuODc1IDE2Ni43ODEyIFExMTkuMjUgMTY2Ljc4MTIgMTI2LjQyMTkgMTU5LjQ2ODggUTEzMy41OTM4IDE1Mi4xNTYyIDEzMy41OTM4IDEzOS4yMTg4IFExMzMuNTkzOCAxMjYuNTYyNSAxMjYuNDIxOSAxMTkuMjUgUTExOS4yNSAxMTEuNzk2OSAxMDYuODc1IDExMS43OTY5IFE5NC45MjE5IDExMS43OTY5IDg3LjQ2ODggMTE5LjI1IFE4MC4xNTYyIDEyNi41NjI1IDgwLjE1NjIgMTM5LjIxODggUTgwLjE1NjIgMTUyLjE1NjIgODcuNDY4OCAxNTkuNDY4OCBROTQuNjQwNiAxNjYuNzgxMiAxMDYuODc1IDE2Ni43ODEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpTEwXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTU5LjA0NjkgMTExLjc5NjkgUTE0OS4wNjI1IDExMS43OTY5IDE0Mi4wMzEyIDEyMy44OTA2IFExMzQuODU5NCAxMzUuOTg0NCAxMzQuODU5NCAxNjAuMTcxOSBRMTM0Ljg1OTQgMTg0LjUgMTQyLjAzMTIgMTk2LjU5MzggUTE0OS4wNjI1IDIwOC42ODc1IDE1OS4wNDY5IDIwOC42ODc1IFExNjkuMDMxMiAyMDguNjg3NSAxNzYuMDYyNSAxOTYuNTkzOCBRMTgzLjIzNDQgMTg0LjUgMTgzLjIzNDQgMTYwLjE3MTkgUTE4My4yMzQ0IDEzNS45ODQ0IDE3Ni4wNjI1IDEyMy44OTA2IFExNjkuMDMxMiAxMTEuNzk2OSAxNTkuMDQ2OSAxMTEuNzk2OSBaTTE1OS4wNDY5IDk5LjI4MTIgUTE3Ny40Njg4IDk5LjI4MTIgMTg5LjQyMTkgMTE0Ljg5MDYgUTIwMS4zNzUgMTMwLjUgMjAxLjM3NSAxNjAuMTcxOSBRMjAxLjM3NSAxODkuOTg0NCAxODkuNDIxOSAyMDUuNTkzOCBRMTc3LjQ2ODggMjIxLjIwMzEgMTU5LjA0NjkgMjIxLjIwMzEgUTEzNi4yNjU2IDIyMS4yMDMxIDEyNi40MjE5IDIwNS41OTM4IFExMTYuNTc4MSAxODkuOTg0NCAxMTYuNTc4MSAxNjAuMTcxOSBRMTE2LjU3ODEgMTMwLjUgMTI2LjQyMTkgMTE0Ljg5MDYgUTEzNi4yNjU2IDk5LjI4MTIgMTU5LjA0NjkgOTkuMjgxMiBaTTgwLjU3ODEgMjE5LjA5MzggTDgwLjU3ODEgMTE3LjcwMzEgTDYxLjg3NSAxMjMuNDY4OCBMNjEuODc1IDEwNy4xNTYyIEw4MS41NjI1IDEwMS42NzE5IEwxMDAuODI4MSAxMDEuNjcxOSBMMTAwLjgyODEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlSlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTg5LjE1NjIgMTAxLjY3MTkgTDEwNy4wMTU2IDEwMS42NzE5IEwxMDcuMDE1NiAxNzguNzM0NCBRMTA3LjAxNTYgMTk5LjY4NzUgOTcuODc1IDIwOS41MzEyIFE4OC44NzUgMjE5LjIzNDQgNjguNzY1NiAyMTkuMjM0NCBMNjEuODc1IDIxOS4yMzQ0IEw2MS44NzUgMjA1LjczNDQgTDY3LjUgMjA1LjczNDQgUTc5LjMxMjUgMjA1LjczNDQgODQuMjM0NCAxOTkuODI4MSBRODkuMTU2MiAxOTMuOTIxOSA4OS4xNTYyIDE3OC43MzQ0IEw4OS4xNTYyIDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpVFcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTEwNy4yOTY5IDIyMS4wNjI1IFExMDYuNzM0NCAyMjEuMDYyNSAxMDUuNTM5MSAyMjEuMTMyOCBRMTA0LjM0MzggMjIxLjIwMzEgMTAzLjY0MDYgMjIxLjIwMzEgUTgxLjQyMTkgMjIxLjIwMzEgNzAuNTIzNCAyMDYuMDg1OSBRNTkuNjI1IDE5MC45Njg4IDU5LjYyNSAxNjAuMzEyNSBRNTkuNjI1IDEyOS41MTU2IDcwLjU5MzggMTE0LjM5ODQgUTgxLjU2MjUgOTkuMjgxMiAxMDMuNzgxMiA5OS4yODEyIFExMjYuMTQwNiA5OS4yODEyIDEzNy4xMDk0IDExNC4zOTg0IFExNDguMDc4MSAxMjkuNTE1NiAxNDguMDc4MSAxNjAuMzEyNSBRMTQ4LjA3ODEgMTgzLjUxNTYgMTQyLjAzMTIgMTk3LjY0ODQgUTEzNS45ODQ0IDIxMS43ODEyIDEyMy42MDk0IDIxNy40MDYyIEwxNDEuMzI4MSAyMzIuMzEyNSBMMTI3Ljk2ODggMjQwLjE4NzUgTDEwNy4yOTY5IDIyMS4wNjI1IFpNMTI5LjM3NSAxNjAuMzEyNSBRMTI5LjM3NSAxMzQuNDM3NSAxMjMuMzk4NCAxMjMuMzI4MSBRMTE3LjQyMTkgMTEyLjIxODggMTAzLjc4MTIgMTEyLjIxODggUTkwLjI4MTIgMTEyLjIxODggODQuMzA0NyAxMjMuMzI4MSBRNzguMzI4MSAxMzQuNDM3NSA3OC4zMjgxIDE2MC4zMTI1IFE3OC4zMjgxIDE4Ni4xODc1IDg0LjMwNDcgMTk3LjI5NjkgUTkwLjI4MTIgMjA4LjQwNjIgMTAzLjc4MTIgMjA4LjQwNjIgUTExNy40MjE5IDIwOC40MDYyIDEyMy4zOTg0IDE5Ny4yOTY5IFExMjkuMzc1IDE4Ni4xODc1IDEyOS4zNzUgMTYwLjMxMjUgWk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTY0LjI2NTYgODQuNzk2OSBRNDcuMzkwNiA4NC43OTY5IDQ3LjM5MDYgMTAxLjY3MTkgTDQ3LjM5MDYgMzcwLjY4NzUgUTQ3LjM5MDYgMzg3LjU2MjUgNjQuMjY1NiAzODcuNTYyNSBMMjM1LjEyNSAzODcuNTYyNSBRMjUyIDM4Ny41NjI1IDI1MiAzNzAuNjg3NSBMMjUyIDEwMS42NzE5IFEyNTIgODQuNzk2OSAyMzUuMTI1IDg0Ljc5NjkgTDY0LjI2NTYgODQuNzk2OSBaTTY0LjI2NTYgNjcuOTIxOSBMMjM1LjEyNSA2Ny45MjE5IFEyNjguODc1IDY3LjkyMTkgMjY4Ljg3NSAxMDEuNjcxOSBMMjY4Ljg3NSAzNzAuNjg3NSBRMjY4Ljg3NSA0MDQuNDM3NSAyMzUuMTI1IDQwNC40Mzc1IEw2NC4yNjU2IDQwNC40Mzc1IFEzMC41MTU2IDQwNC40Mzc1IDMwLjUxNTYgMzcwLjY4NzUgTDMwLjUxNTYgMTAxLjY3MTkgUTMwLjUxNTYgNjcuOTIxOSA2NC4yNjU2IDY3LjkyMTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlS1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTYxLjg3NSAxMDEuNjcxOSBMNzkuNzM0NCAxMDEuNjcxOSBMNzkuNzM0NCAxNTEuMzEyNSBMMTMwLjY0MDYgMTAxLjY3MTkgTDE1My43MDMxIDEwMS42NzE5IEw5Ni40Njg4IDE1Ni41MTU2IEwxNTguMzQzOCAyMTkuMjM0NCBMMTM0Ljg1OTQgMjE5LjIzNDQgTDc5LjczNDQgMTYyLjU2MjUgTDc5LjczNDQgMjE5LjIzNDQgTDYxLjg3NSAyMTkuMjM0NCBMNjEuODc1IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpkFcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuNjcxOSAxMTUuNzM0NCBMOTEuODI4MSAxNzUuNzgxMiBMMTI5LjUxNTYgMTc1Ljc4MTIgTDExMC42NzE5IDExNS43MzQ0IFpNOTkuOTg0NCAxMDEuNjcxOSBMMTIxLjY0MDYgMTAxLjY3MTkgTDE2Mi4xNDA2IDIxOS4yMzQ0IEwxNDMuNTc4MSAyMTkuMjM0NCBMMTM0LjAxNTYgMTg4LjU3ODEgTDg3LjYwOTQgMTg4LjU3ODEgTDc4LjA0NjkgMjE5LjIzNDQgTDU5LjQ4NDQgMjE5LjIzNDQgTDk5Ljk4NDQgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmMlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTg2LjM0MzggMjAzLjA2MjUgTDE0NS45Njg4IDIwMy4wNjI1IEwxNDUuOTY4OCAyMTkuMDkzOCBMNjEuODc1IDIxOS4wOTM4IEw2MS44NzUgMjAzLjYyNSBRNjYuNjU2MiAxOTkuMjY1NiA3NS41MTU2IDE5MS4zOTA2IFExMjMuODkwNiAxNDguNSAxMjMuODkwNiAxMzUuMjgxMiBRMTIzLjg5MDYgMTI2IDExNi41NzgxIDEyMC4zMDQ3IFExMDkuMjY1NiAxMTQuNjA5NCA5Ny4zMTI1IDExNC42MDk0IFE5MCAxMTQuNjA5NCA4MS40MjE5IDExNy4wNzAzIFE3Mi44NDM4IDExOS41MzEyIDYyLjcxODggMTI0LjQ1MzEgTDYyLjcxODggMTA3LjE1NjIgUTczLjU0NjkgMTAzLjIxODggODIuODk4NCAxMDEuMjUgUTkyLjI1IDk5LjI4MTIgMTAwLjI2NTYgOTkuMjgxMiBRMTIwLjY1NjIgOTkuMjgxMiAxMzIuODkwNiAxMDguNTYyNSBRMTQ1LjEyNSAxMTcuODQzOCAxNDUuMTI1IDEzMy4wMzEyIFExNDUuMTI1IDE1Mi41NzgxIDk4LjU3ODEgMTkyLjUxNTYgUTkwLjcwMzEgMTk5LjI2NTYgODYuMzQzOCAyMDMuMDYyNSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaYzXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTIxLjc4MTIgMTU1LjUzMTIgUTEzNC43MTg4IDE1OC4wNjI1IDE0MS44MjAzIDE2NS43MjY2IFExNDguOTIxOSAxNzMuMzkwNiAxNDguOTIxOSAxODQuOTIxOSBRMTQ4LjkyMTkgMjAyLjM1OTQgMTM1LjU2MjUgMjExLjc4MTIgUTEyMi4yMDMxIDIyMS4yMDMxIDk3LjMxMjUgMjIxLjIwMzEgUTg5LjI5NjkgMjIxLjIwMzEgODAuNTA3OCAyMTkuNzI2NiBRNzEuNzE4OCAyMTguMjUgNjEuODc1IDIxNS40Mzc1IEw2MS44NzUgMTk4LjQyMTkgUTY5LjE4NzUgMjAyLjIxODggNzcuNTU0NyAyMDQuMDQ2OSBRODUuOTIxOSAyMDUuODc1IDk1LjM0MzggMjA1Ljg3NSBRMTEwLjY3MTkgMjA1Ljg3NSAxMTkuMTA5NCAyMDAuMzIwMyBRMTI3LjU0NjkgMTk0Ljc2NTYgMTI3LjU0NjkgMTg0LjkyMTkgUTEyNy41NDY5IDE3NC41MTU2IDExOS43NDIyIDE2OS4xNzE5IFExMTEuOTM3NSAxNjMuODI4MSA5Ni43NSAxNjMuODI4MSBMODQuNjU2MiAxNjMuODI4MSBMODQuNjU2MiAxNDguNjQwNiBMOTcuODc1IDE0OC42NDA2IFExMTEuMDkzOCAxNDguNjQwNiAxMTcuOTE0MSAxNDQuMjEwOSBRMTI0LjczNDQgMTM5Ljc4MTIgMTI0LjczNDQgMTMxLjM0MzggUTEyNC43MzQ0IDEyMy4xODc1IDExNy43MDMxIDExOC44OTg0IFExMTAuNjcxOSAxMTQuNjA5NCA5Ny4zMTI1IDExNC42MDk0IFE5MS42ODc1IDExNC42MDk0IDg0LjUxNTYgMTE1Ljg3NSBRNzcuMzQzOCAxMTcuMTQwNiA2NS45NTMxIDEyMC4zNzUgTDY1Ljk1MzEgMTA0LjIwMzEgUTc2LjIxODggMTAxLjgxMjUgODUuMjE4OCAxMDAuNTQ2OSBROTQuMjE4OCA5OS4yODEyIDEwMS45NTMxIDk5LjI4MTIgUTEyMi4yMDMxIDk5LjI4MTIgMTM0LjA4NTkgMTA3LjU3ODEgUTE0NS45Njg4IDExNS44NzUgMTQ1Ljk2ODggMTI5Ljc5NjkgUTE0NS45Njg4IDEzOS41IDEzOS42NDA2IDE0Ni4yNSBRMTMzLjMxMjUgMTUzIDEyMS43ODEyIDE1NS41MzEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpjRcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMjAuMDkzOCAxMTguNjg3NSBMNzYuNjQwNiAxNzcuNjA5NCBMMTIwLjA5MzggMTc3LjYwOTQgTDEyMC4wOTM4IDExOC42ODc1IFpNMTE3IDEwMS42NzE5IEwxNDAuMzQzOCAxMDEuNjcxOSBMMTQwLjM0MzggMTc3LjYwOTQgTDE1OS4zMjgxIDE3Ny42MDk0IEwxNTkuMzI4MSAxOTIuOTM3NSBMMTQwLjM0MzggMTkyLjkzNzUgTDE0MC4zNDM4IDIxOS4wOTM4IEwxMjAuMDkzOCAyMTkuMDkzOCBMMTIwLjA5MzggMTkyLjkzNzUgTDYxLjg3NSAxOTIuOTM3NSBMNjEuODc1IDE3NS45MjE5IEwxMTcgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmNVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTY3LjUgMTAxLjY3MTkgTDEzOS4yMTg4IDEwMS42NzE5IEwxMzkuMjE4OCAxMTUuMDMxMiBMODQuMjM0NCAxMTUuMDMxMiBMODQuMjM0NCAxNDMuNzE4OCBRODguMTcxOSAxNDIuNDUzMSA5Mi4yNSAxNDEuODkwNiBROTYuMTg3NSAxNDEuMzI4MSAxMDAuMTI1IDE0MS4zMjgxIFExMjIuNzY1NiAxNDEuMzI4MSAxMzUuOTg0NCAxNTIuMTU2MiBRMTQ5LjIwMzEgMTYyLjg0MzggMTQ5LjIwMzEgMTgxLjI2NTYgUTE0OS4yMDMxIDIwMC4yNSAxMzUuNTYyNSAyMTAuNzk2OSBRMTIyLjA2MjUgMjIxLjIwMzEgOTcuMzEyNSAyMjEuMjAzMSBRODguODc1IDIyMS4yMDMxIDgwLjAxNTYgMjE5LjkzNzUgUTcxLjE1NjIgMjE4LjY3MTkgNjEuODc1IDIxNi4xNDA2IEw2MS44NzUgMjAwLjI1IFE2OS44OTA2IDIwNC4wNDY5IDc4LjYwOTQgMjA2LjAxNTYgUTg3LjMyODEgMjA3Ljg0MzggOTcuMDMxMiAyMDcuODQzOCBRMTEyLjY0MDYgMjA3Ljg0MzggMTIxLjc4MTIgMjAwLjY3MTkgUTEzMC45MjE5IDE5My41IDEzMC45MjE5IDE4MS4yNjU2IFExMzAuOTIxOSAxNjkuMDMxMiAxMjEuNzgxMiAxNjEuODU5NCBRMTEyLjY0MDYgMTU0LjY4NzUgOTcuMDMxMiAxNTQuNjg3NSBRODkuNzE4OCAxNTQuNjg3NSA4Mi40MDYyIDE1Ni4wOTM4IFE3NS4wOTM4IDE1Ny41IDY3LjUgMTYwLjQ1MzEgTDY3LjUgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmNlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTExMC4xMDk0IDE1My43MDMxIFE5Ny43MzQ0IDE1My43MDMxIDkwLjU2MjUgMTYxLjAxNTYgUTgzLjM5MDYgMTY4LjQ2ODggODMuMzkwNiAxODEuMjY1NiBRODMuMzkwNiAxOTMuOTIxOSA5MC41NjI1IDIwMS4yMzQ0IFE5Ny43MzQ0IDIwOC42ODc1IDExMC4xMDk0IDIwOC42ODc1IFExMjIuMzQzOCAyMDguNjg3NSAxMjkuNTE1NiAyMDEuMjM0NCBRMTM2LjY4NzUgMTkzLjkyMTkgMTM2LjY4NzUgMTgxLjI2NTYgUTEzNi42ODc1IDE2OC40Njg4IDEyOS41MTU2IDE2MS4wMTU2IFExMjIuMzQzOCAxNTMuNzAzMSAxMTAuMTA5NCAxNTMuNzAzMSBaTTE0Ni4zOTA2IDEwMy45MjE5IEwxNDYuMzkwNiAxMTguNDA2MiBRMTM5LjUgMTE1LjU5MzggMTMyLjQ2ODggMTE0LjE4NzUgUTEyNS40Mzc1IDExMi42NDA2IDExOC41NDY5IDExMi42NDA2IFExMDAuNTQ2OSAxMTIuNjQwNiA5MC45ODQ0IDEyMy4xODc1IFE4MS40MjE5IDEzMy44NzUgODAuMDE1NiAxNTUuMzkwNiBRODUuMzU5NCAxNDguNSA5My4zNzUgMTQ0Ljg0MzggUTEwMS41MzEyIDE0MS4xODc1IDExMS4wOTM4IDE0MS4xODc1IFExMzEuNDg0NCAxNDEuMTg3NSAxNDMuMjk2OSAxNTEuODc1IFExNTUuMTA5NCAxNjIuNzAzMSAxNTUuMTA5NCAxODEuMjY1NiBRMTU1LjEwOTQgMTk5LjEyNSAxNDIuNzM0NCAyMTAuMjM0NCBRMTMwLjUgMjIxLjIwMzEgMTEwLjEwOTQgMjIxLjIwMzEgUTg2LjYyNSAyMjEuMjAzMSA3NC4yNSAyMDUuNTkzOCBRNjEuODc1IDE4OS45ODQ0IDYxLjg3NSAxNjAuMTcxOSBRNjEuODc1IDEzMi4zMjgxIDc3LjA2MjUgMTE1Ljg3NSBROTIuMjUgOTkuMjgxMiAxMTcuODQzOCA5OS4yODEyIFExMjQuNzM0NCA5OS4yODEyIDEzMS43NjU2IDEwMC40MDYyIFExMzguNzk2OSAxMDEuNjcxOSAxNDYuMzkwNiAxMDMuOTIxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaY3XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjEuODc1IDEwMS42NzE5IEwxNDguNjQwNiAxMDEuNjcxOSBMMTQ4LjY0MDYgMTA4LjQyMTkgTDk5LjcwMzEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggTDEyNi43MDMxIDExNS4wMzEyIEw2MS44NzUgMTE1LjAzMTIgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaY4XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTA4LjI4MTIgMTYzLjEyNSBROTUuMjAzMSAxNjMuMTI1IDg3Ljc1IDE2OS4zMTI1IFE4MC4yOTY5IDE3NS4zNTk0IDgwLjI5NjkgMTg1LjkwNjIgUTgwLjI5NjkgMTk2LjU5MzggODcuNzUgMjAyLjY0MDYgUTk1LjIwMzEgMjA4LjY4NzUgMTA4LjI4MTIgMjA4LjY4NzUgUTEyMS4yMTg4IDIwOC42ODc1IDEyOC44MTI1IDIwMi41IFExMzYuMjY1NiAxOTYuNDUzMSAxMzYuMjY1NiAxODUuOTA2MiBRMTM2LjI2NTYgMTc1LjM1OTQgMTI4LjgxMjUgMTY5LjMxMjUgUTEyMS4zNTk0IDE2My4xMjUgMTA4LjI4MTIgMTYzLjEyNSBaTTkwIDE1Ni4yMzQ0IFE3OC4xODc1IDE1My43MDMxIDcxLjcxODggMTQ2LjgxMjUgUTY1LjEwOTQgMTM5Ljc4MTIgNjUuMTA5NCAxMjkuNjU2MiBRNjUuMTA5NCAxMTUuNTkzOCA3Ni42NDA2IDEwNy40Mzc1IFE4OC4xNzE5IDk5LjI4MTIgMTA4LjI4MTIgOTkuMjgxMiBRMTI4LjM5MDYgOTkuMjgxMiAxMzkuOTIxOSAxMDcuNDM3NSBRMTUxLjMxMjUgMTE1LjU5MzggMTUxLjMxMjUgMTI5LjY1NjIgUTE1MS4zMTI1IDE0MC4wNjI1IDE0NC44NDM4IDE0Ni44MTI1IFExMzguMjM0NCAxNTMuNzAzMSAxMjYuNTYyNSAxNTYuMjM0NCBRMTM5LjIxODggMTU4Ljc2NTYgMTQ3LjA5MzggMTY2LjkyMTkgUTE1NC41NDY5IDE3NC42NTYyIDE1NC41NDY5IDE4NS45MDYyIFExNTQuNTQ2OSAyMDIuOTIxOSAxNDIuNTkzOCAyMTIuMDYyNSBRMTMwLjUgMjIxLjIwMzEgMTA4LjI4MTIgMjIxLjIwMzEgUTg1LjkyMTkgMjIxLjIwMzEgNzMuOTY4OCAyMTIuMDYyNSBRNjEuODc1IDIwMi45MjE5IDYxLjg3NSAxODUuOTA2MiBRNjEuODc1IDE3NC45Mzc1IDY5LjMyODEgMTY2LjkyMTkgUTc2LjkyMTkgMTU5LjA0NjkgOTAgMTU2LjIzNDQgWk04My4yNSAxMzEuMjAzMSBRODMuMjUgMTQwLjA2MjUgODkuODU5NCAxNDUuNDA2MiBROTYuMzI4MSAxNTAuNjA5NCAxMDguMjgxMiAxNTAuNjA5NCBRMTE5LjY3MTkgMTUwLjYwOTQgMTI2LjU2MjUgMTQ1LjQwNjIgUTEzMy4zMTI1IDE0MC4zNDM4IDEzMy4zMTI1IDEzMS4yMDMxIFExMzMuMzEyNSAxMjIuMzQzOCAxMjYuNTYyNSAxMTcgUTExOS45NTMxIDExMS43OTY5IDEwOC4yODEyIDExMS43OTY5IFE5Ni42MDk0IDExMS43OTY5IDg5Ljg1OTQgMTE3IFE4My4yNSAxMjIuMDYyNSA4My4yNSAxMzEuMjAzMSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaY5XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNzAuNTkzOCAyMTYuNTYyNSBMNzAuNTkzOCAyMDIuMDc4MSBRNzcuNDg0NCAyMDQuODkwNiA4NC41MTU2IDIwNi40Mzc1IFE5MS41NDY5IDIwNy44NDM4IDk4LjI5NjkgMjA3Ljg0MzggUTExNi40Mzc1IDIwNy44NDM4IDEyNiAxOTcuMjk2OSBRMTM1LjQyMTkgMTg2Ljc1IDEzNi44MjgxIDE2NS4wOTM4IFExMzEuOTA2MiAxNzEuNzAzMSAxMjMuNDY4OCAxNzUuNSBRMTE1LjQ1MzEgMTc5LjE1NjIgMTA1Ljc1IDE3OS4xNTYyIFE4NS41IDE3OS4xNTYyIDczLjY4NzUgMTY4LjQ2ODggUTYxLjg3NSAxNTcuNzgxMiA2MS44NzUgMTM5LjIxODggUTYxLjg3NSAxMjEuMDc4MSA3NC4xMDk0IDExMC4yNSBRODYuNDg0NCA5OS4yODEyIDEwNi44NzUgOTkuMjgxMiBRMTMwLjM1OTQgOTkuMjgxMiAxNDIuNTkzOCAxMTQuODkwNiBRMTU0Ljk2ODggMTMwLjUgMTU0Ljk2ODggMTYwLjMxMjUgUTE1NC45Njg4IDE4OC4xNTYyIDEzOS45MjE5IDIwNC42MDk0IFExMjQuNzM0NCAyMjEuMjAzMSA5OS4xNDA2IDIyMS4yMDMxIFE5Mi4yNSAyMjEuMjAzMSA4NS4yMTg4IDIyMC4wNzgxIFE3OC4xODc1IDIxOC44MTI1IDcwLjU5MzggMjE2LjU2MjUgWk0xMDYuODc1IDE2Ni43ODEyIFExMTkuMjUgMTY2Ljc4MTIgMTI2LjQyMTkgMTU5LjQ2ODggUTEzMy41OTM4IDE1Mi4xNTYyIDEzMy41OTM4IDEzOS4yMTg4IFExMzMuNTkzOCAxMjYuNTYyNSAxMjYuNDIxOSAxMTkuMjUgUTExOS4yNSAxMTEuNzk2OSAxMDYuODc1IDExMS43OTY5IFE5NC45MjE5IDExMS43OTY5IDg3LjQ2ODggMTE5LjI1IFE4MC4xNTYyIDEyNi41NjI1IDgwLjE1NjIgMTM5LjIxODggUTgwLjE1NjIgMTUyLjE1NjIgODcuNDY4OCAxNTkuNDY4OCBROTQuNjQwNiAxNjYuNzgxMiAxMDYuODc1IDE2Ni43ODEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpjEwXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTU5LjA0NjkgMTExLjc5NjkgUTE0OS4wNjI1IDExMS43OTY5IDE0Mi4wMzEyIDEyMy44OTA2IFExMzQuODU5NCAxMzUuOTg0NCAxMzQuODU5NCAxNjAuMTcxOSBRMTM0Ljg1OTQgMTg0LjUgMTQyLjAzMTIgMTk2LjU5MzggUTE0OS4wNjI1IDIwOC42ODc1IDE1OS4wNDY5IDIwOC42ODc1IFExNjkuMDMxMiAyMDguNjg3NSAxNzYuMDYyNSAxOTYuNTkzOCBRMTgzLjIzNDQgMTg0LjUgMTgzLjIzNDQgMTYwLjE3MTkgUTE4My4yMzQ0IDEzNS45ODQ0IDE3Ni4wNjI1IDEyMy44OTA2IFExNjkuMDMxMiAxMTEuNzk2OSAxNTkuMDQ2OSAxMTEuNzk2OSBaTTE1OS4wNDY5IDk5LjI4MTIgUTE3Ny40Njg4IDk5LjI4MTIgMTg5LjQyMTkgMTE0Ljg5MDYgUTIwMS4zNzUgMTMwLjUgMjAxLjM3NSAxNjAuMTcxOSBRMjAxLjM3NSAxODkuOTg0NCAxODkuNDIxOSAyMDUuNTkzOCBRMTc3LjQ2ODggMjIxLjIwMzEgMTU5LjA0NjkgMjIxLjIwMzEgUTEzNi4yNjU2IDIyMS4yMDMxIDEyNi40MjE5IDIwNS41OTM4IFExMTYuNTc4MSAxODkuOTg0NCAxMTYuNTc4MSAxNjAuMTcxOSBRMTE2LjU3ODEgMTMwLjUgMTI2LjQyMTkgMTE0Ljg5MDYgUTEzNi4yNjU2IDk5LjI4MTIgMTU5LjA0NjkgOTkuMjgxMiBaTTgwLjU3ODEgMjE5LjA5MzggTDgwLjU3ODEgMTE3LjcwMzEgTDYxLjg3NSAxMjMuNDY4OCBMNjEuODc1IDEwNy4xNTYyIEw4MS41NjI1IDEwMS42NzE5IEwxMDAuODI4MSAxMDEuNjcxOSBMMTAwLjgyODEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmSlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTg5LjE1NjIgMTAxLjY3MTkgTDEwNy4wMTU2IDEwMS42NzE5IEwxMDcuMDE1NiAxNzguNzM0NCBRMTA3LjAxNTYgMTk5LjY4NzUgOTcuODc1IDIwOS41MzEyIFE4OC44NzUgMjE5LjIzNDQgNjguNzY1NiAyMTkuMjM0NCBMNjEuODc1IDIxOS4yMzQ0IEw2MS44NzUgMjA1LjczNDQgTDY3LjUgMjA1LjczNDQgUTc5LjMxMjUgMjA1LjczNDQgODQuMjM0NCAxOTkuODI4MSBRODkuMTU2MiAxOTMuOTIxOSA4OS4xNTYyIDE3OC43MzQ0IEw4OS4xNTYyIDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZplFcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNMTA3LjI5NjkgMjIxLjA2MjUgUTEwNi43MzQ0IDIyMS4wNjI1IDEwNS41MzkxIDIyMS4xMzI4IFExMDQuMzQzOCAyMjEuMjAzMSAxMDMuNjQwNiAyMjEuMjAzMSBRODEuNDIxOSAyMjEuMjAzMSA3MC41MjM0IDIwNi4wODU5IFE1OS42MjUgMTkwLjk2ODggNTkuNjI1IDE2MC4zMTI1IFE1OS42MjUgMTI5LjUxNTYgNzAuNTkzOCAxMTQuMzk4NCBRODEuNTYyNSA5OS4yODEyIDEwMy43ODEyIDk5LjI4MTIgUTEyNi4xNDA2IDk5LjI4MTIgMTM3LjEwOTQgMTE0LjM5ODQgUTE0OC4wNzgxIDEyOS41MTU2IDE0OC4wNzgxIDE2MC4zMTI1IFExNDguMDc4MSAxODMuNTE1NiAxNDIuMDMxMiAxOTcuNjQ4NCBRMTM1Ljk4NDQgMjExLjc4MTIgMTIzLjYwOTQgMjE3LjQwNjIgTDE0MS4zMjgxIDIzMi4zMTI1IEwxMjcuOTY4OCAyNDAuMTg3NSBMMTA3LjI5NjkgMjIxLjA2MjUgWk0xMjkuMzc1IDE2MC4zMTI1IFExMjkuMzc1IDEzNC40Mzc1IDEyMy4zOTg0IDEyMy4zMjgxIFExMTcuNDIxOSAxMTIuMjE4OCAxMDMuNzgxMiAxMTIuMjE4OCBROTAuMjgxMiAxMTIuMjE4OCA4NC4zMDQ3IDEyMy4zMjgxIFE3OC4zMjgxIDEzNC40Mzc1IDc4LjMyODEgMTYwLjMxMjUgUTc4LjMyODEgMTg2LjE4NzUgODQuMzA0NyAxOTcuMjk2OSBROTAuMjgxMiAyMDguNDA2MiAxMDMuNzgxMiAyMDguNDA2MiBRMTE3LjQyMTkgMjA4LjQwNjIgMTIzLjM5ODQgMTk3LjI5NjkgUTEyOS4zNzUgMTg2LjE4NzUgMTI5LjM3NSAxNjAuMzEyNSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpktcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02MS44NzUgMTAxLjY3MTkgTDc5LjczNDQgMTAxLjY3MTkgTDc5LjczNDQgMTUxLjMxMjUgTDEzMC42NDA2IDEwMS42NzE5IEwxNTMuNzAzMSAxMDEuNjcxOSBMOTYuNDY4OCAxNTYuNTE1NiBMMTU4LjM0MzggMjE5LjIzNDQgTDEzNC44NTk0IDIxOS4yMzQ0IEw3OS43MzQ0IDE2Mi41NjI1IEw3OS43MzQ0IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaNBXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuNjcxOSAxMTUuNzM0NCBMOTEuODI4MSAxNzUuNzgxMiBMMTI5LjUxNTYgMTc1Ljc4MTIgTDExMC42NzE5IDExNS43MzQ0IFpNOTkuOTg0NCAxMDEuNjcxOSBMMTIxLjY0MDYgMTAxLjY3MTkgTDE2Mi4xNDA2IDIxOS4yMzQ0IEwxNDMuNTc4MSAyMTkuMjM0NCBMMTM0LjAxNTYgMTg4LjU3ODEgTDg3LjYwOTQgMTg4LjU3ODEgTDc4LjA0NjkgMjE5LjIzNDQgTDU5LjQ4NDQgMjE5LjIzNDQgTDk5Ljk4NDQgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjMlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODYuMzQzOCAyMDMuMDYyNSBMMTQ1Ljk2ODggMjAzLjA2MjUgTDE0NS45Njg4IDIxOS4wOTM4IEw2MS44NzUgMjE5LjA5MzggTDYxLjg3NSAyMDMuNjI1IFE2Ni42NTYyIDE5OS4yNjU2IDc1LjUxNTYgMTkxLjM5MDYgUTEyMy44OTA2IDE0OC41IDEyMy44OTA2IDEzNS4yODEyIFExMjMuODkwNiAxMjYgMTE2LjU3ODEgMTIwLjMwNDcgUTEwOS4yNjU2IDExNC42MDk0IDk3LjMxMjUgMTE0LjYwOTQgUTkwIDExNC42MDk0IDgxLjQyMTkgMTE3LjA3MDMgUTcyLjg0MzggMTE5LjUzMTIgNjIuNzE4OCAxMjQuNDUzMSBMNjIuNzE4OCAxMDcuMTU2MiBRNzMuNTQ2OSAxMDMuMjE4OCA4Mi44OTg0IDEwMS4yNSBROTIuMjUgOTkuMjgxMiAxMDAuMjY1NiA5OS4yODEyIFExMjAuNjU2MiA5OS4yODEyIDEzMi44OTA2IDEwOC41NjI1IFExNDUuMTI1IDExNy44NDM4IDE0NS4xMjUgMTMzLjAzMTIgUTE0NS4xMjUgMTUyLjU3ODEgOTguNTc4MSAxOTIuNTE1NiBROTAuNzAzMSAxOTkuMjY1NiA4Ni4zNDM4IDIwMy4wNjI1IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZozNcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEyMS43ODEyIDE1NS41MzEyIFExMzQuNzE4OCAxNTguMDYyNSAxNDEuODIwMyAxNjUuNzI2NiBRMTQ4LjkyMTkgMTczLjM5MDYgMTQ4LjkyMTkgMTg0LjkyMTkgUTE0OC45MjE5IDIwMi4zNTk0IDEzNS41NjI1IDIxMS43ODEyIFExMjIuMjAzMSAyMjEuMjAzMSA5Ny4zMTI1IDIyMS4yMDMxIFE4OS4yOTY5IDIyMS4yMDMxIDgwLjUwNzggMjE5LjcyNjYgUTcxLjcxODggMjE4LjI1IDYxLjg3NSAyMTUuNDM3NSBMNjEuODc1IDE5OC40MjE5IFE2OS4xODc1IDIwMi4yMTg4IDc3LjU1NDcgMjA0LjA0NjkgUTg1LjkyMTkgMjA1Ljg3NSA5NS4zNDM4IDIwNS44NzUgUTExMC42NzE5IDIwNS44NzUgMTE5LjEwOTQgMjAwLjMyMDMgUTEyNy41NDY5IDE5NC43NjU2IDEyNy41NDY5IDE4NC45MjE5IFExMjcuNTQ2OSAxNzQuNTE1NiAxMTkuNzQyMiAxNjkuMTcxOSBRMTExLjkzNzUgMTYzLjgyODEgOTYuNzUgMTYzLjgyODEgTDg0LjY1NjIgMTYzLjgyODEgTDg0LjY1NjIgMTQ4LjY0MDYgTDk3Ljg3NSAxNDguNjQwNiBRMTExLjA5MzggMTQ4LjY0MDYgMTE3LjkxNDEgMTQ0LjIxMDkgUTEyNC43MzQ0IDEzOS43ODEyIDEyNC43MzQ0IDEzMS4zNDM4IFExMjQuNzM0NCAxMjMuMTg3NSAxMTcuNzAzMSAxMTguODk4NCBRMTEwLjY3MTkgMTE0LjYwOTQgOTcuMzEyNSAxMTQuNjA5NCBROTEuNjg3NSAxMTQuNjA5NCA4NC41MTU2IDExNS44NzUgUTc3LjM0MzggMTE3LjE0MDYgNjUuOTUzMSAxMjAuMzc1IEw2NS45NTMxIDEwNC4yMDMxIFE3Ni4yMTg4IDEwMS44MTI1IDg1LjIxODggMTAwLjU0NjkgUTk0LjIxODggOTkuMjgxMiAxMDEuOTUzMSA5OS4yODEyIFExMjIuMjAzMSA5OS4yODEyIDEzNC4wODU5IDEwNy41NzgxIFExNDUuOTY4OCAxMTUuODc1IDE0NS45Njg4IDEyOS43OTY5IFExNDUuOTY4OCAxMzkuNSAxMzkuNjQwNiAxNDYuMjUgUTEzMy4zMTI1IDE1MyAxMjEuNzgxMiAxNTUuNTMxMiBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaM0XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMjAuMDkzOCAxMTguNjg3NSBMNzYuNjQwNiAxNzcuNjA5NCBMMTIwLjA5MzggMTc3LjYwOTQgTDEyMC4wOTM4IDExOC42ODc1IFpNMTE3IDEwMS42NzE5IEwxNDAuMzQzOCAxMDEuNjcxOSBMMTQwLjM0MzggMTc3LjYwOTQgTDE1OS4zMjgxIDE3Ny42MDk0IEwxNTkuMzI4MSAxOTIuOTM3NSBMMTQwLjM0MzggMTkyLjkzNzUgTDE0MC4zNDM4IDIxOS4wOTM4IEwxMjAuMDkzOCAyMTkuMDkzOCBMMTIwLjA5MzggMTkyLjkzNzUgTDYxLjg3NSAxOTIuOTM3NSBMNjEuODc1IDE3NS45MjE5IEwxMTcgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjNVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjcuNSAxMDEuNjcxOSBMMTM5LjIxODggMTAxLjY3MTkgTDEzOS4yMTg4IDExNS4wMzEyIEw4NC4yMzQ0IDExNS4wMzEyIEw4NC4yMzQ0IDE0My43MTg4IFE4OC4xNzE5IDE0Mi40NTMxIDkyLjI1IDE0MS44OTA2IFE5Ni4xODc1IDE0MS4zMjgxIDEwMC4xMjUgMTQxLjMyODEgUTEyMi43NjU2IDE0MS4zMjgxIDEzNS45ODQ0IDE1Mi4xNTYyIFExNDkuMjAzMSAxNjIuODQzOCAxNDkuMjAzMSAxODEuMjY1NiBRMTQ5LjIwMzEgMjAwLjI1IDEzNS41NjI1IDIxMC43OTY5IFExMjIuMDYyNSAyMjEuMjAzMSA5Ny4zMTI1IDIyMS4yMDMxIFE4OC44NzUgMjIxLjIwMzEgODAuMDE1NiAyMTkuOTM3NSBRNzEuMTU2MiAyMTguNjcxOSA2MS44NzUgMjE2LjE0MDYgTDYxLjg3NSAyMDAuMjUgUTY5Ljg5MDYgMjA0LjA0NjkgNzguNjA5NCAyMDYuMDE1NiBRODcuMzI4MSAyMDcuODQzOCA5Ny4wMzEyIDIwNy44NDM4IFExMTIuNjQwNiAyMDcuODQzOCAxMjEuNzgxMiAyMDAuNjcxOSBRMTMwLjkyMTkgMTkzLjUgMTMwLjkyMTkgMTgxLjI2NTYgUTEzMC45MjE5IDE2OS4wMzEyIDEyMS43ODEyIDE2MS44NTk0IFExMTIuNjQwNiAxNTQuNjg3NSA5Ny4wMzEyIDE1NC42ODc1IFE4OS43MTg4IDE1NC42ODc1IDgyLjQwNjIgMTU2LjA5MzggUTc1LjA5MzggMTU3LjUgNjcuNSAxNjAuNDUzMSBMNjcuNSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaM2XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuMTA5NCAxNTMuNzAzMSBROTcuNzM0NCAxNTMuNzAzMSA5MC41NjI1IDE2MS4wMTU2IFE4My4zOTA2IDE2OC40Njg4IDgzLjM5MDYgMTgxLjI2NTYgUTgzLjM5MDYgMTkzLjkyMTkgOTAuNTYyNSAyMDEuMjM0NCBROTcuNzM0NCAyMDguNjg3NSAxMTAuMTA5NCAyMDguNjg3NSBRMTIyLjM0MzggMjA4LjY4NzUgMTI5LjUxNTYgMjAxLjIzNDQgUTEzNi42ODc1IDE5My45MjE5IDEzNi42ODc1IDE4MS4yNjU2IFExMzYuNjg3NSAxNjguNDY4OCAxMjkuNTE1NiAxNjEuMDE1NiBRMTIyLjM0MzggMTUzLjcwMzEgMTEwLjEwOTQgMTUzLjcwMzEgWk0xNDYuMzkwNiAxMDMuOTIxOSBMMTQ2LjM5MDYgMTE4LjQwNjIgUTEzOS41IDExNS41OTM4IDEzMi40Njg4IDExNC4xODc1IFExMjUuNDM3NSAxMTIuNjQwNiAxMTguNTQ2OSAxMTIuNjQwNiBRMTAwLjU0NjkgMTEyLjY0MDYgOTAuOTg0NCAxMjMuMTg3NSBRODEuNDIxOSAxMzMuODc1IDgwLjAxNTYgMTU1LjM5MDYgUTg1LjM1OTQgMTQ4LjUgOTMuMzc1IDE0NC44NDM4IFExMDEuNTMxMiAxNDEuMTg3NSAxMTEuMDkzOCAxNDEuMTg3NSBRMTMxLjQ4NDQgMTQxLjE4NzUgMTQzLjI5NjkgMTUxLjg3NSBRMTU1LjEwOTQgMTYyLjcwMzEgMTU1LjEwOTQgMTgxLjI2NTYgUTE1NS4xMDk0IDE5OS4xMjUgMTQyLjczNDQgMjEwLjIzNDQgUTEzMC41IDIyMS4yMDMxIDExMC4xMDk0IDIyMS4yMDMxIFE4Ni42MjUgMjIxLjIwMzEgNzQuMjUgMjA1LjU5MzggUTYxLjg3NSAxODkuOTg0NCA2MS44NzUgMTYwLjE3MTkgUTYxLjg3NSAxMzIuMzI4MSA3Ny4wNjI1IDExNS44NzUgUTkyLjI1IDk5LjI4MTIgMTE3Ljg0MzggOTkuMjgxMiBRMTI0LjczNDQgOTkuMjgxMiAxMzEuNzY1NiAxMDAuNDA2MiBRMTM4Ljc5NjkgMTAxLjY3MTkgMTQ2LjM5MDYgMTAzLjkyMTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjN1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjEuODc1IDEwMS42NzE5IEwxNDguNjQwNiAxMDEuNjcxOSBMMTQ4LjY0MDYgMTA4LjQyMTkgTDk5LjcwMzEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggTDEyNi43MDMxIDExNS4wMzEyIEw2MS44NzUgMTE1LjAzMTIgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaM4XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMDguMjgxMiAxNjMuMTI1IFE5NS4yMDMxIDE2My4xMjUgODcuNzUgMTY5LjMxMjUgUTgwLjI5NjkgMTc1LjM1OTQgODAuMjk2OSAxODUuOTA2MiBRODAuMjk2OSAxOTYuNTkzOCA4Ny43NSAyMDIuNjQwNiBROTUuMjAzMSAyMDguNjg3NSAxMDguMjgxMiAyMDguNjg3NSBRMTIxLjIxODggMjA4LjY4NzUgMTI4LjgxMjUgMjAyLjUgUTEzNi4yNjU2IDE5Ni40NTMxIDEzNi4yNjU2IDE4NS45MDYyIFExMzYuMjY1NiAxNzUuMzU5NCAxMjguODEyNSAxNjkuMzEyNSBRMTIxLjM1OTQgMTYzLjEyNSAxMDguMjgxMiAxNjMuMTI1IFpNOTAgMTU2LjIzNDQgUTc4LjE4NzUgMTUzLjcwMzEgNzEuNzE4OCAxNDYuODEyNSBRNjUuMTA5NCAxMzkuNzgxMiA2NS4xMDk0IDEyOS42NTYyIFE2NS4xMDk0IDExNS41OTM4IDc2LjY0MDYgMTA3LjQzNzUgUTg4LjE3MTkgOTkuMjgxMiAxMDguMjgxMiA5OS4yODEyIFExMjguMzkwNiA5OS4yODEyIDEzOS45MjE5IDEwNy40Mzc1IFExNTEuMzEyNSAxMTUuNTkzOCAxNTEuMzEyNSAxMjkuNjU2MiBRMTUxLjMxMjUgMTQwLjA2MjUgMTQ0Ljg0MzggMTQ2LjgxMjUgUTEzOC4yMzQ0IDE1My43MDMxIDEyNi41NjI1IDE1Ni4yMzQ0IFExMzkuMjE4OCAxNTguNzY1NiAxNDcuMDkzOCAxNjYuOTIxOSBRMTU0LjU0NjkgMTc0LjY1NjIgMTU0LjU0NjkgMTg1LjkwNjIgUTE1NC41NDY5IDIwMi45MjE5IDE0Mi41OTM4IDIxMi4wNjI1IFExMzAuNSAyMjEuMjAzMSAxMDguMjgxMiAyMjEuMjAzMSBRODUuOTIxOSAyMjEuMjAzMSA3My45Njg4IDIxMi4wNjI1IFE2MS44NzUgMjAyLjkyMTkgNjEuODc1IDE4NS45MDYyIFE2MS44NzUgMTc0LjkzNzUgNjkuMzI4MSAxNjYuOTIxOSBRNzYuOTIxOSAxNTkuMDQ2OSA5MCAxNTYuMjM0NCBaTTgzLjI1IDEzMS4yMDMxIFE4My4yNSAxNDAuMDYyNSA4OS44NTk0IDE0NS40MDYyIFE5Ni4zMjgxIDE1MC42MDk0IDEwOC4yODEyIDE1MC42MDk0IFExMTkuNjcxOSAxNTAuNjA5NCAxMjYuNTYyNSAxNDUuNDA2MiBRMTMzLjMxMjUgMTQwLjM0MzggMTMzLjMxMjUgMTMxLjIwMzEgUTEzMy4zMTI1IDEyMi4zNDM4IDEyNi41NjI1IDExNyBRMTE5Ljk1MzEgMTExLjc5NjkgMTA4LjI4MTIgMTExLjc5NjkgUTk2LjYwOTQgMTExLjc5NjkgODkuODU5NCAxMTcgUTgzLjI1IDEyMi4wNjI1IDgzLjI1IDEzMS4yMDMxIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZozlcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTcwLjU5MzggMjE2LjU2MjUgTDcwLjU5MzggMjAyLjA3ODEgUTc3LjQ4NDQgMjA0Ljg5MDYgODQuNTE1NiAyMDYuNDM3NSBROTEuNTQ2OSAyMDcuODQzOCA5OC4yOTY5IDIwNy44NDM4IFExMTYuNDM3NSAyMDcuODQzOCAxMjYgMTk3LjI5NjkgUTEzNS40MjE5IDE4Ni43NSAxMzYuODI4MSAxNjUuMDkzOCBRMTMxLjkwNjIgMTcxLjcwMzEgMTIzLjQ2ODggMTc1LjUgUTExNS40NTMxIDE3OS4xNTYyIDEwNS43NSAxNzkuMTU2MiBRODUuNSAxNzkuMTU2MiA3My42ODc1IDE2OC40Njg4IFE2MS44NzUgMTU3Ljc4MTIgNjEuODc1IDEzOS4yMTg4IFE2MS44NzUgMTIxLjA3ODEgNzQuMTA5NCAxMTAuMjUgUTg2LjQ4NDQgOTkuMjgxMiAxMDYuODc1IDk5LjI4MTIgUTEzMC4zNTk0IDk5LjI4MTIgMTQyLjU5MzggMTE0Ljg5MDYgUTE1NC45Njg4IDEzMC41IDE1NC45Njg4IDE2MC4zMTI1IFExNTQuOTY4OCAxODguMTU2MiAxMzkuOTIxOSAyMDQuNjA5NCBRMTI0LjczNDQgMjIxLjIwMzEgOTkuMTQwNiAyMjEuMjAzMSBROTIuMjUgMjIxLjIwMzEgODUuMjE4OCAyMjAuMDc4MSBRNzguMTg3NSAyMTguODEyNSA3MC41OTM4IDIxNi41NjI1IFpNMTA2Ljg3NSAxNjYuNzgxMiBRMTE5LjI1IDE2Ni43ODEyIDEyNi40MjE5IDE1OS40Njg4IFExMzMuNTkzOCAxNTIuMTU2MiAxMzMuNTkzOCAxMzkuMjE4OCBRMTMzLjU5MzggMTI2LjU2MjUgMTI2LjQyMTkgMTE5LjI1IFExMTkuMjUgMTExLjc5NjkgMTA2Ljg3NSAxMTEuNzk2OSBROTQuOTIxOSAxMTEuNzk2OSA4Ny40Njg4IDExOS4yNSBRODAuMTU2MiAxMjYuNTYyNSA4MC4xNTYyIDEzOS4yMTg4IFE4MC4xNTYyIDE1Mi4xNTYyIDg3LjQ2ODggMTU5LjQ2ODggUTk0LjY0MDYgMTY2Ljc4MTIgMTA2Ljg3NSAxNjYuNzgxMiBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaMxMFxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTU5LjA0NjkgMTExLjc5NjkgUTE0OS4wNjI1IDExMS43OTY5IDE0Mi4wMzEyIDEyMy44OTA2IFExMzQuODU5NCAxMzUuOTg0NCAxMzQuODU5NCAxNjAuMTcxOSBRMTM0Ljg1OTQgMTg0LjUgMTQyLjAzMTIgMTk2LjU5MzggUTE0OS4wNjI1IDIwOC42ODc1IDE1OS4wNDY5IDIwOC42ODc1IFExNjkuMDMxMiAyMDguNjg3NSAxNzYuMDYyNSAxOTYuNTkzOCBRMTgzLjIzNDQgMTg0LjUgMTgzLjIzNDQgMTYwLjE3MTkgUTE4My4yMzQ0IDEzNS45ODQ0IDE3Ni4wNjI1IDEyMy44OTA2IFExNjkuMDMxMiAxMTEuNzk2OSAxNTkuMDQ2OSAxMTEuNzk2OSBaTTE1OS4wNDY5IDk5LjI4MTIgUTE3Ny40Njg4IDk5LjI4MTIgMTg5LjQyMTkgMTE0Ljg5MDYgUTIwMS4zNzUgMTMwLjUgMjAxLjM3NSAxNjAuMTcxOSBRMjAxLjM3NSAxODkuOTg0NCAxODkuNDIxOSAyMDUuNTkzOCBRMTc3LjQ2ODggMjIxLjIwMzEgMTU5LjA0NjkgMjIxLjIwMzEgUTEzNi4yNjU2IDIyMS4yMDMxIDEyNi40MjE5IDIwNS41OTM4IFExMTYuNTc4MSAxODkuOTg0NCAxMTYuNTc4MSAxNjAuMTcxOSBRMTE2LjU3ODEgMTMwLjUgMTI2LjQyMTkgMTE0Ljg5MDYgUTEzNi4yNjU2IDk5LjI4MTIgMTU5LjA0NjkgOTkuMjgxMiBaTTgwLjU3ODEgMjE5LjA5MzggTDgwLjU3ODEgMTE3LjcwMzEgTDYxLjg3NSAxMjMuNDY4OCBMNjEuODc1IDEwNy4xNTYyIEw4MS41NjI1IDEwMS42NzE5IEwxMDAuODI4MSAxMDEuNjcxOSBMMTAwLjgyODEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjSlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODkuMTU2MiAxMDEuNjcxOSBMMTA3LjAxNTYgMTAxLjY3MTkgTDEwNy4wMTU2IDE3OC43MzQ0IFExMDcuMDE1NiAxOTkuNjg3NSA5Ny44NzUgMjA5LjUzMTIgUTg4Ljg3NSAyMTkuMjM0NCA2OC43NjU2IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAyMDUuNzM0NCBMNjcuNSAyMDUuNzM0NCBRNzkuMzEyNSAyMDUuNzM0NCA4NC4yMzQ0IDE5OS44MjgxIFE4OS4xNTYyIDE5My45MjE5IDg5LjE1NjIgMTc4LjczNDQgTDg5LjE1NjIgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjUVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTA3LjI5NjkgMjIxLjA2MjUgUTEwNi43MzQ0IDIyMS4wNjI1IDEwNS41MzkxIDIyMS4xMzI4IFExMDQuMzQzOCAyMjEuMjAzMSAxMDMuNjQwNiAyMjEuMjAzMSBRODEuNDIxOSAyMjEuMjAzMSA3MC41MjM0IDIwNi4wODU5IFE1OS42MjUgMTkwLjk2ODggNTkuNjI1IDE2MC4zMTI1IFE1OS42MjUgMTI5LjUxNTYgNzAuNTkzOCAxMTQuMzk4NCBRODEuNTYyNSA5OS4yODEyIDEwMy43ODEyIDk5LjI4MTIgUTEyNi4xNDA2IDk5LjI4MTIgMTM3LjEwOTQgMTE0LjM5ODQgUTE0OC4wNzgxIDEyOS41MTU2IDE0OC4wNzgxIDE2MC4zMTI1IFExNDguMDc4MSAxODMuNTE1NiAxNDIuMDMxMiAxOTcuNjQ4NCBRMTM1Ljk4NDQgMjExLjc4MTIgMTIzLjYwOTQgMjE3LjQwNjIgTDE0MS4zMjgxIDIzMi4zMTI1IEwxMjcuOTY4OCAyNDAuMTg3NSBMMTA3LjI5NjkgMjIxLjA2MjUgWk0xMjkuMzc1IDE2MC4zMTI1IFExMjkuMzc1IDEzNC40Mzc1IDEyMy4zOTg0IDEyMy4zMjgxIFExMTcuNDIxOSAxMTIuMjE4OCAxMDMuNzgxMiAxMTIuMjE4OCBROTAuMjgxMiAxMTIuMjE4OCA4NC4zMDQ3IDEyMy4zMjgxIFE3OC4zMjgxIDEzNC40Mzc1IDc4LjMyODEgMTYwLjMxMjUgUTc4LjMyODEgMTg2LjE4NzUgODQuMzA0NyAxOTcuMjk2OSBROTAuMjgxMiAyMDguNDA2MiAxMDMuNzgxMiAyMDguNDA2MiBRMTE3LjQyMTkgMjA4LjQwNjIgMTIzLjM5ODQgMTk3LjI5NjkgUTEyOS4zNzUgMTg2LjE4NzUgMTI5LjM3NSAxNjAuMzEyNSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaNLXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02MS44NzUgMTAxLjY3MTkgTDc5LjczNDQgMTAxLjY3MTkgTDc5LjczNDQgMTUxLjMxMjUgTDEzMC42NDA2IDEwMS42NzE5IEwxNTMuNzAzMSAxMDEuNjcxOSBMOTYuNDY4OCAxNTYuNTE1NiBMMTU4LjM0MzggMjE5LjIzNDQgTDEzNC44NTk0IDIxOS4yMzQ0IEw3OS43MzQ0IDE2Mi41NjI1IEw3OS43MzQ0IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG5cXG4gICAgPHRhYmxlIHN0eWxlPVxcXCJib3JkZXItd2lkdGg6MXB4XFxcIj5cXG4gICAgICAgIDx0ciB3aWR0aD1cXFwiMTAwJVxcXCIgaGVpZ2h0PVxcXCIxMHB4XFxcIiBzdHlsZT1cXFwidmlzaWJpbGl0eTp2aXNpYmxlXFxcIn0+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibHVlXFxcIj4mYmxvY2s7PC9zcGFuPjwvcGxheWluZy1jYXJkPC90ZD5cXG4gICAgICAgIDwvdHI+XFxuICAgICAgICA8dHIgd2lkdGg9XFxcIjEwMCVcXFwiPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7QTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7Mjwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7Mzwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7NDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7NTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7Njwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7Nzwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7ODwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7OTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7MTA8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQgd2lkdGg9XFxcIjUwcHhcXFwiPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzO0o8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQgd2lkdGg9XFxcIjUwcHhcXFwiPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzO1E8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQgd2lkdGg9XFxcIjUwcHhcXFwiPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzO0s8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgIDwvdHI+XFxuICAgICAgICA8dHI+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0cztBPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czsyPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czszPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs0PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs1PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs2PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs3PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs4PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs5PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czsxMDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZoZWFydHM7Sjwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZoZWFydHM7UTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZoZWFydHM7Szwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgPC90cj5cXG4gICAgICAgIDx0cj5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7QTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczsyPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zOzM8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7NDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczs1PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zOzY8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7Nzwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczs4PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zOzk8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7MTA8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7Sjwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtcztRPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zO0s8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgIDwvdHI+XFxuICAgICAgICA8dHI+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7QTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzI8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczszPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7NDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzU8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczs2PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7Nzwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzg8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczs5PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7MTA8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHVicztKPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7UTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzO0s8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgIDwvdHI+XFxuICAgIDwvdGFibGU+XFxuPC9kaXY+XFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmF3LWxvYWRlciEuL3ZpZXdzL3BhcnRpYWxzL2ZyZXNoZGVjay5odG1sXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJsZXQgY29ubmVjdFBhcnRpYWwgPSByZXF1aXJlKFwicmF3LWxvYWRlciEuLi8uLi92aWV3cy9wYXJ0aWFscy9jb25uZWN0Lmh0bWxcIik7XG5leHBvcnQgY2xhc3MgQ29ubmVjdFBhZ2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSAnPHA+JyArIGNvbm5lY3RQYXJ0aWFsICsgJzwvcD4nO1xuICAgIH1cbn1cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcImNvbm5lY3QtcGFnZVwiLCBDb25uZWN0UGFnZSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFnZXMvY29ubmVjdC5qcyIsIm1vZHVsZS5leHBvcnRzID0gXCI8c3BhbiBjbGFzcz1cXFwiY29ubmVjdFxcXCI+XFxuPHA+VGhpcyBpcyB0aGUgY29ubmVjdCBwYWdlLjwvcD5cXG48dWw+XFxuPGxpPnBlbmRpbmcgaW52aXRhdGlvbnM8Lz5cXG48bGk+bGlzdCBvZiBwbGF5ZXJzPC9saT5cXG48bGk+Y29ubmVjdGVkIHBsYXllcnM8L2xpPlxcblxcbjxoMT5IZWxsbyB3b3JsZCBndW4gYXBwPC9oMT5cXG48cD5PcGVuIHlvdXIgd2ViIGNvbnNvbGU8L3A+XFxuXFxuPCEtLSBMb2FkcyBndW4gLS0+XFxuPHNjcmlwdCBzcmM9J2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9ndW4uanMnPjwvc2NyaXB0PlxcblxcbjwhLS0gcHVsbCBndW4gYWRkcmVzcyBmcm9tXFxuPHNjcmlwdCBzcmM9J2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9ndW4uanMnPjwvc2NyaXB0PlxcblxcbjxzY3JpcHQ+XFxuKGZ1bmN0aW9uICgpIHtcXG5cXG4gICAgLy8gU3luYyB0aGlzIGd1biBpbnN0YW5jZSB3aXRoIHRoZSBzZXJ2ZXIuXFxuICAgIHZhciBndW4gPSBHdW4oW1xcbiAgICAgICAgJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9ndW4nLFxcbiAgICBdKTtcXG5cXG4gICAgLy8gUmVhZHMga2V5ICdkYXRhJy5cXG4gICAgdmFyIGRhdGEgPSBndW4uZ2V0KCdkYXRhJyk7XFxuXFxuICAgIC8vIEV4cG9zZWQgc28gdGhlIEpTIGNvbnNvbGUgY2FuIHNlZSBpdC5cXG4gICAgd2luZG93LmRhdGEgPSBkYXRhO1xcblxcbiAgICBjb25zb2xlLmxvZygnR3VuIHJlZmVyZW5jZSBleHBvc2VkIGFzICVjd2luZG93LmRhdGEnLCAnY29sb3I6IHJlZCcpO1xcblxcbiAgICAvLyBXcml0ZXMgYSB2YWx1ZSB0byB0aGUga2V5ICdkYXRhJy5cXG4gICAgZGF0YS5wdXQoeyBtZXNzYWdlOiAnSGVsbG8gd29ybGQhJyB9KTtcXG5cXG4gICAgLy8gTGlzdGVuIGZvciByZWFsLXRpbWUgY2hhbmdlIGV2ZW50cy5cXG4gICAgZGF0YS5wYXRoKCdtZXNzYWdlJykub24oZnVuY3Rpb24gKG1lc3NhZ2UpIHtcXG4gICAgICAgIGNvbnNvbGUubG9nKCdNZXNzYWdlOicsIG1lc3NhZ2UpO1xcbiAgICB9KTtcXG5cXG59KCkpXFxuPC9zY3JpcHQ+XFxuPC9zcGFuPlxcblwiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3Jhdy1sb2FkZXIhLi92aWV3cy9wYXJ0aWFscy9jb25uZWN0Lmh0bWxcbi8vIG1vZHVsZSBpZCA9IDE3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=