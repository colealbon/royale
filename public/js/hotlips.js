/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

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
	//import 'webcomponents.js/webcomponents.js';
	//uncomment line above to double app size and support ios.

	// helper functions


	// Gundb public facing DAG database  (for messages to and from the enemy)


	// pages (most of this should be in views/partials to affect isormorphism)

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.classifyContent = classifyContent;
	exports.encryptClearText = encryptClearText;
	exports.decryptPGPMessageWithKey = decryptPGPMessageWithKey;
	exports.decryptPGPMessage = decryptPGPMessage;
	exports.handlePost = handlePost;
	function classifyContent(content) {
	    // usage: classifyContent(content)(openpgp).then(result => result)
	    return !content ? Promise.reject('Error: missing content') : function (openpgp) {
	        return !openpgp ? Promise.reject('Error: missing openpgp') : new Promise(function (resolve, reject) {
	            var possiblepgpkey = openpgp.key.readArmored(content);
	            if (possiblepgpkey.keys[0]) {
	                resolve(possiblepgpkey.keys[0].toPublic().armor() !== possiblepgpkey.keys[0].armor() ? 'PGPPrivkey' : 'PGPPubkey');
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
	                var PGPkey = openpgp.key.readArmored(PGPkeyArmor);
	                localStorage.setItem(PGPkey.keys[0].users[0].userId.userid, PGPkeyArmor);
	                process.setImmediate(resolve('private pgp key saved <- ' + PGPkey.keys[0].users[0].userId.userid));
	            });
	        };
	    };
	}
	function encryptClearText(openpgp) {
	    //  usage: encryptClearText(openpgp)(publicKeyArmor)(cleartext).then(result => result)
	    return !openpgp ? Promise.reject('Error: missing openpgp') : function (publicKeyArmor) {
	        return !publicKeyArmor ? Promise.reject('Error: missing public key') : function (cleartext) {
	            return !cleartext ? Promise.reject('Error: missing cleartext') : new Promise(function (resolve, reject) {
	                var PGPPubkey = openpgp.key.readArmored(publicKeyArmor);
	                openpgp.encryptMessage(PGPPubkey.keys[0], cleartext).then(function (encryptedtxt) {
	                    resolve(encryptedtxt);
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
	                    var privateKeys = openpgp.key.readArmored(privateKeyArmor);
	                    var privateKey = privateKeys.keys[0];
	                    privateKey.decrypt(password);
	                    var message = openpgp.message.readArmored(PGPMessageArmor);
	                    return !openpgp.decrypt ? openpgp.decryptMessage(privateKey, message).then(function (result) {
	                        return resolve(result);
	                    }).catch() : openpgp.decrypt({ message: message, privateKey: privateKey }).then(function (result) {
	                        return resolve(result.data);
	                    }).catch();
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
	                        return storeArr.filter(function (storeItem) {
	                            return !storeItem ? false : true;
	                        }).map(function (storeItem) {
	                            return classifyContent(storeItem)(openpgp).then(function (contentType) {
	                                if (contentType === 'PGPPrivkey') {
	                                    decryptPGPMessageWithKey(PGPMessageArmor)(openpgp)(storeItem)('hotlips').then(function (decrypted) {
	                                        return resolve(decrypted);
	                                    });
	                                }
	                            });
	                        });
	                    });
	                });
	            };
	        };
	    };
	}
	function handlePost(content) {
	    return !content ? Promise.reject('Error: missing content') : function (openpgp) {
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
	                            return decryptPGPMessage(content)(openpgp)(localStorage)('hotlips').then(function (result) {
	                                return result;
	                            });
	                        }
	                    }).then(function (result) {
	                        return resolve(result);
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

/***/ },
/* 2 */
/***/ function(module, exports) {

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

/***/ },
/* 3 */
/***/ function(module, exports) {

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
	                    (function () {
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
	                    })();
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

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, module) {"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	//console.log("!!!!!!!!!!!!!!!! WARNING THIS IS GUN 0.5 !!!!!!!!!!!!!!!!!!!!!!");
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
			Type.obj.as = function (o, f, v) {
				return o[f] = o[f] || (arguments.length >= 3 ? v : {});
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
							if (this === this.the.last) {
								this.the.last = this.back;
							}
							this.next = onto._.next;
							this.back.to = this.to;
						}),
						to: onto._,
						next: arg,
						the: tag,
						on: this,
						as: as
					};
					(be.back = tag.last || (tag.to = be) && tag).to = be;
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
				return { err: "you have not properly handled recursion through your data or filtered it as JSON" };
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
				var u;
				if (v === u) {
					return false;
				}
				if (v === null) {
					return true;
				} // "deletes", nulling out fields.
				if (v === Infinity) {
					return false;
				} // we want this to be, but JSON does not support it, sad face.
				if (bi_is(v) // by "binary" we mean boolean.
				|| num_is(v) || text_is(v)) {
					// by "text" we mean strings.
					return true; // simple values are valid.
				}
				return Val.rel.is(v) || false; // is the value a soul relation? Then it is valid and return it. If not, everything else remaining is an invalid data type. Custom extensions can be built on top of these primitives to support other types.
			};
			Val.rel = { _: '#' };
			;(function () {
				Val.rel.is = function (v) {
					// this defines whether an object is a soul relation or not, they look like this: {'#': 'UUID'}
					if (v && !v._ && obj_is(v)) {
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
					if (f == _rel && text_is(s)) {
						// the field should be '#' and have a text value.
						o.id = s; // we found the soul!
					} else {
						return o.id = false; // if there exists anything else on the object that isn't the soul, then it is considered invalid.
					}
				}
			})();
			Val.rel.ify = function (t) {
				return obj_put({}, _rel, t);
			}; // convert a soul into a relation and return it.
			var _rel = Val.rel._;
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
				return n && n._ && n._[o || _soul];
			}; // convenience function to check to see if there is a soul on a node and return it.
			Node.soul.ify = function (n, o) {
				// put a soul on an object.
				o = typeof o === 'string' ? { soul: o } : o || {};
				n = n || {}; // make sure it exists.
				n._ = n._ || {}; // make sure meta exists.
				n._[_soul] = o.soul || n._[_soul] || text_random(); // put the soul on it.
				return n;
			};(function () {
				Node.is = function (n, cb, o) {
					var s; // checks to see if an object is a valid node.
					if (!obj_is(n)) {
						return false;
					} // must be an object.
					if (s = Node.soul(n)) {
						// must have a soul on it.
						return !obj_map(n, map, { o: o, cb: cb, s: s, n: n });
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
						this.cb.call(this.o, v, f, this.s, this.n);
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
						obj_map(obj, map, { opt: o, as: as });
					}
					return o.node; // This will only be a valid node if the object wasn't already deep!
				};
				function map(v, f) {
					var o = this.opt,
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
			var _soul = Val.rel._;
			var u;
			module.exports = Node;
		})(require, './node');

		;require(function (module) {
			var Type = require('./type');
			var Node = require('./node');
			function State() {
				var t = time();
				if (last < t) {
					n = 0;
					return last = t;
				}
				return last = t + (N += 1) / D;
			}
			var time = Type.time.is,
			    last = -Infinity,
			    N = 0,
			    D = 1000; // WARNING! In the future, on machines that are D times faster than 2016AD machines, you will want to increase D by another several orders of magnitude so the processing speed never out paces the decimal resolution (increasing an integer effects the state accuracy).
			State._ = '>';
			State.ify = function (n, f, s) {
				// put a field's state on a node.
				if (!n || !n[N_]) {
					return;
				} // reject if it is not node-like.
				var tmp = obj_as(n[N_], State._); // grab the states data.
				if (u !== f && num_is(s)) {
					tmp[f] = s;
				} // add the valid state.
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
					return !obj_map(g, map, { fn: fn, cb: cb, as: as }); // makes sure it wasn't an empty object.
				};
				function nf(fn) {
					// optional callback for each node.
					if (fn) {
						Node.is(nf.n, fn, nf.as);
					} // where we then have an optional callback for each field/value.
				}
				function map(n, s) {
					// we invert this because the way we check for this is via a negation.
					if (!n || s !== Node.soul(n) || !Node.is(n, this.fn)) {
						return true;
					} // it is true that this is an invalid graph.
					if (!fn_is(this.cb)) {
						return;
					}
					nf.n = n;nf.as = this.as;
					this.cb.call(nf.as, n, s, nf);
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
						//console.log("oh boy", v,f,n);
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

			Gun.version = 0.5;

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
					var gun = at.gun.opt(at.opt);
					if (!at.once) {
						at.on('in', input, at);
						at.on('out', output, at);
					}
					at.once = 1;
					return gun;
				};
				function output(at) {
					//console.log("add to.next(at)!"); // TODO: BUG!!!!
					var cat = this.as,
					    gun = cat.gun,
					    tmp;
					// TODO: BUG! Outgoing `get` to read from in memory!!!
					if (at.get && get(at, cat)) {
						return;
					}
					cat.on('in', obj_to(at, { gun: cat.gun })); // TODO: PERF! input now goes to output so it would be nice to reduce the circularity here for perf purposes.
					if (at['#']) {
						cat.dup.track(at['#']);
					}
					if (!at.gun) {
						at = obj_to(at, { gun: gun });
					}
					Gun.on('out', at); // TODO: BUG! PERF? WARNING!!! A in-memory `put` triggers an out with an existing ID which reflows into IN which at the end also goes Gun OUT, and then this scope/function resumes and it triggers OUT again!
				}
				function get(at, cat) {
					var soul = at.get[_soul],
					    node = cat.graph[soul],
					    field = at.get[_field],
					    tmp;
					var next = cat.next || (cat.next = {}),
					    as = (next[soul] || (next[soul] = cat.gun.get(soul)))._;
					if (!node) {
						if (!field) {
							as.ask = -1;
						}
						return;
					}
					if (field) {
						if (!obj_has(node, field)) {
							return;
						}
						tmp = Gun.obj.put(Gun.node.soul.ify({}, soul), field, node[field]);
						node = Gun.state.ify(tmp, field, Gun.state.is(node, field));
					}
					as.on('in', {
						'@': at['#'],
						gun: as.gun,
						put: node // TODO: BUG! Clone node!
					});
					if (0 < (as.ask || 1)) {
						as.ask = -1;
						return;
					}
					return true;
				}
				function input(at) {
					//console.log("add to.next(at)"); // TODO: BUG!!!
					var ev = this,
					    cat = ev.as;
					if (!at.gun) {
						at.gun = cat.gun;
					}
					if (!at['#'] && at['@']) {
						at['#'] = Gun.text.random(); // TODO: Use what is used other places instead.
						if (Gun.on.ack(at['@'], at)) {
							return;
						} // TODO: Consider not returning here, maybe, where this would let the "handshake" on sync occur for Holy Grail?
						cat.dup.track(at['#']);
						cat.on('out', at);
						return;
					}
					if (at['#'] && cat.dup.check(at['#'])) {
						return;
					}
					cat.dup.track(at['#']);
					if (Gun.on.ack(at['@'], at)) {
						return;
					}
					if (at.put) {
						Gun.HAM.synth(at, ev, cat.gun); // TODO: Clean up, just make it part of on('put')!
						Gun.on('put', at);
					}
					if (at.get) {
						Gun.on('get', at);
					}
					Gun.on('out', at);
				}
			})();

			;(function () {
				var ask = Gun.on.ask = function (cb, as) {
					var id = Gun.text.random();
					if (cb) {
						ask.on(id, cb, as);
					}
					return id;
				};
				ask.on = Gun.on;
				Gun.on.ack = function (at, reply) {
					if (!at || !reply || !ask.on) {
						return;
					}
					var id = at['#'] || at;
					if (!ask.tag || !ask.tag[id]) {
						return;
					}
					ask.on(id, reply);
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
							map(url, {});
						});
						if (!obj_is(at.opt.peers)) {
							at.opt.peers = {};
						}
						at.opt.peers = obj_to(tmp, at.opt.peers);
					}
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

			Gun.log.once("migrate", "GUN 0.3 -> 0.4 -> 0.5 Migration Guide:\n`gun.back` -> `gun.back()`;\n`gun.get(key, cb)` -> cb(err, data) -> cb(at) at.err, at.put;\n`gun.map(cb)` -> `gun.map().on(cb)`;\n`gun.init` -> deprecated;\n`gun.put(data, cb)` -> cb(err, ok) -> cb(ack) ack.err, ack.ok;\n`gun.get(key)` global/absolute -> `gun.back(-1).get(key)`;\n`gun.key(key)` -> temporarily broken;\nand don't chain off of `gun.val()`;\nCheers, jump on https://gitter.im/amark/gun for help and StackOverflow 'gun' tag for questions!");
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
					    tmp = { _: { back: gun } };
					while ((tmp = tmp._) && (tmp = tmp.back) && !(yes = n(tmp, opt))) {}
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
							var next = get ? gun.get(get, null, { path: true })._ : cat;
							// TODO: BUG! Handle plural chains by iterating over them.
							if (obj_has(next, 'put')) {
								// potentially incorrect? Maybe?
								//next.tag['in'].last.next(next);
								next.on('in', next);
								return;
							}
							if (obj_has(cat, 'put')) {
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
										'#': Gun.on.ask(Gun.HAM.synth, at.gun),
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
										gun: at.gun,
										via: cat
									});
									return;
								}
							}
							if (cat.soul) {
								if (!at.gun._) {
									return;
								}
								at.gun._.on('out', {
									get: { '#': cat.soul, '.': get },
									'#': Gun.on.ask(Gun.HAM.synth, at.gun),
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
							// TODO: BUG! Handle plural chains by iterating over them.
							if (cat.map) {
								// TODO: map will exist but different than if something in it.
								tmp = false;
								obj_map(cat.map, function (coat) {
									//console.log("CRASH3");
									tmp = true;
									coat.on('in', coat);
									//cat.on('in').last.emit(coat);
								});
								if (tmp) {
									return;
								}
							}
							if (obj_has(cat, 'put')) {
								//cat.gun !== at.gun && console.log("Potential Bug? Is the map not getting called?");// TODO: BUG! If the map is uncached, so the `out` propagates up to the parent, which has a map on it, this will emit to the last subscriber (which may not be an `input`), which if it isn't... won't propagate back down!
								cat.on('in', cat);
								//cat.on('in').last.emit(cat);
								return;
							}
							if (cat.ask) {
								return;
							}
							cat.ask = 1;
							if (cat.soul) {
								cat.on('out', {
									get: { '#': cat.soul },
									'#': Gun.on.ask(Gun.HAM.synth, gun)
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
				    tmp;
				if (cat.field) {
					if (coat.soul && cat.proxy) {
						at = obj_to(at, { get: cat.get, gun: cat.gun }); // broken via?
					}
				}
				if (u === change) {
					ev.to.next(at);
					echo(cat, at, ev);
					if (cat.field || cat.soul) {
						not(cat, at);
					} else {
						Gun.obj.del(coat.echo, cat.id);
						Gun.obj.del(cat.map, coat.id);
					}
					return;
				}
				if (cat.soul) {
					ev.to.next(at);
					obj_map(change, map, { at: at, cat: cat });
					return;
				}
				if (!Gun.val.rel.is(change)) {
					if (Gun.val.is(change)) {
						if (cat.field) {
							not(cat, at);
						} else {
							(coat.echo || (coat.echo = {}))[cat.id] = cat;
							(cat.map || (cat.map = {}))[coat.id] = coat;
							//if(u === coat.put){ return } // Not necessary but improves performance. If we have it but coat does not, that means we got things out of order and coat will get it. Once coat gets it, it will tell us again.
						}
						ev.to.next(at);
						echo(cat, at, ev);
						return;
					}
					if (cat.field) {
						if (coat.soul || coat.field) {
							cat.put = coat.put;
						}
					} else if (coat.field) {
						if (tmp = Gun.node.soul(change)) {
							coat.put = cat.root.get(tmp)._.put;
						} else {
							// TODO: At some point be compatible with non-gun specific data.
						}
					}
					ev.to.next(at);
					echo(cat, at, ev);
					obj_map(change, map, { at: at, cat: cat });
					return;
				}
				if (relate(cat, at, ev)) {
					return;
				} // if return not necessary but improves performance.
				echo(cat, at, ev);
			}
			Gun.chain.chain.input = input;
			function echo(cat, at, ev) {
				if (!cat.echo) {
					return;
				}
				at.event = ev;
				obj_map(cat.echo, function (cat) {
					// TODO: PERF! Cache
					cat.on('in', at);
				});
			}
			function relate(cat, at, ev) {
				var gun = at.gun,
				    put = at.put,
				    coat = gun._,
				    rel = Gun.val.rel.is(put),
				    tmp;
				if (coat !== cat) {
					(coat.echo || (coat.echo = {}))[cat.id] = cat;
					(cat.map || (cat.map = {}))[coat.id] = coat;
					if (coat.proxy && (at === coat.proxy.at || cat.root._.now)) {
						ask(cat, rel);
					}
				}
				if (coat.proxy) {
					if (rel === coat.proxy.rel) {
						tmp = coat.proxy.ref;
						if (obj_has(tmp, 'put')) {
							coat.put = tmp.put;
						}
						//ev.stun();
						ev.to.next(at); // optimize? What about iterating?
						//ask(cat, rel); // PERFORMANCE PROBLEMS! In the use cases so far, it is important that this is commented out and therefore not used! Test 'uncached synchronous map on mutate', so if at any point you are working through the tests and need to uncomment it that suggests there is a point where an already present chain with the same relation hasn't/wasn't able to load the asked for children. Because currently with it commented out (if it weren't) it produces false positive undefineds to children - which if we need to have this uncommented, we might be able to find a logical case where we can detect that those are unnecessary (perhaps by checking the at.put value).
						return;
					}
					not(coat, at);
				}
				coat.proxy = { rel: rel, ref: tmp = coat.root.get(rel)._, at: at };
				coat.proxy.sub = tmp.on('in', input, coat); // TODO: BUG!!! If you have disabled the event system itself handling promise/observable then you might have to do some manual work here. FIXED? With below `put` check. Note: Most everything else in this values function seems to be rock solid.
				/*if(obj_has(tmp, 'put')){
	   	coat.put = tmp.put; // TODO: BUG? We might want to retrigger ourselves to hit maps? I am pretty sure that if this has observable behavior we need to re-trigger. Note: Most everything else in this values function seems to be rock solid.
	   	// consider `gun.get('users').map().path('foo').on(cb)` followed by `gun.put(GRAPH)`?
	   	// fairly confident this needs to re-trigger.
	   }*/
				tmp = coat.put;
				ask(cat, rel);
				//if(tmp !== coat.put){ return true } // Not necessary but improves performance.
				ev.to.next(at);
			}
			function map(data, key) {
				// Map over only the changes on every update.
				if (node_ === key) {
					return;
				}
				var cat = this.cat,
				    next = cat.next || {},
				    via = this.at,
				    gun,
				    chain,
				    at,
				    tmp;
				if (cat.fields) {
					gun = cat.gun.get(key, null, { path: true });
					(gun._.echo || (gun._.echo = {}))[cat.fields._.id] = cat.fields;
				} else if (!(gun = next[key])) {
					return;
				}
				at = gun._;
				if (at.field) {
					at.put = data; // TODO: BUG! Is this only the diff/delta?
					chain = gun;
				} else {
					chain = via.gun.get(key, null, { path: true }); // TODO: path won't be needed with 0.5
				}
				//console.log("-->>", key, data);
				at.on('in', {
					put: data,
					get: key,
					gun: chain,
					via: via
				});
			}
			function not(cat, at) {
				var ask = cat.ask,
				    tmp = cat.proxy;
				cat.proxy = null;
				if (null === tmp && cat.put !== u) {
					return;
				} // TODO: Threw second condition in for a particular test, not sure if a counter example is tested though.
				if (tmp) {
					if (tmp.sub) {
						tmp.sub.off();
					}
					tmp.off = true;
				}
				obj_map(cat.next, function (gun, key) {
					var at = gun._;
					if (obj_has(at, 'put')) {
						at.put = u;
					}
					at.on('in', {
						via: at, // TODO: BUG? mismatching scope?
						get: key,
						gun: gun,
						put: u
					});
				});
			}
			function ask(cat, soul) {
				var tmp;
				if (cat.ask) {
					tmp = cat.root.get(soul)._;
					tmp.on('out', {
						get: { '#': soul },
						'#': Gun.on.ask(Gun.HAM.synth, tmp.gun),
						gun: tmp.gun
					});
					return;
				}
				obj_map(cat.next, function (gun, key) {
					gun._.on('out', {
						get: { '#': soul, '.': key },
						'#': Gun.on.ask(Gun.HAM.synth, gun),
						gun: gun
					});
				});
			}
			var empty = {},
			    u;
			var obj = Gun.obj,
			    obj_has = obj.has,
			    obj_put = obj.put,
			    obj_to = obj.to,
			    obj_map = obj.map;
			var _soul = Gun._.soul,
			    _field = Gun._.field,
			    node_ = Gun.node._;
		})(require, './chain');

		;require(function (module) {
			var Gun = require('./root');
			Gun.chain.get = function (key, cb, as) {
				if (!as || !as.path) {
					var back = this._.root;
				} // TODO: CHANGING API! Remove this line!
				if (typeof key === 'string') {
					var gun,
					    back = back || this,
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
					as.out = as.out || {};
					as.out.get = as.out.get || {};
					at.root._.now = true;
					at.on('in', use, as);
					at.on('out', as.out);
					at.root._.now = false;
					return gun;
				} else if (num_is(key)) {
					return this.get('' + key, cb, as);
				} else {
					(as = back.chain())._.err = { err: Gun.log('Invalid get request!', key) }; // CLEAN UP
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
				    data = cat.put || at.put,
				    tmp;
				if ((tmp = data) && tmp[rel._] && (tmp = rel.is(tmp))) {
					// an uglier but faster way for checking if it is not a relation, but slower if it is.
					if (null !== as.out.get['.']) {
						cat = (gun = cat.root.get(tmp))._;
						if (!obj_has(cat, 'put')) {
							return gun.get(function (at, ev) {
								ev.off();
							}), ev.to.next(at);
						}
						gun._.put = cat.put;
					}
				}
				/*
	   if(cat.put && (tmp = at.put) && tmp[rel._] && rel.is(tmp)){ // an uglier but faster way for checking if it is not a relation, but slower if it is.
	   	return ev.to.next(at); // For a field that has a relation we want to proxy, if we have already received an update via the proxy then we can deduplicate the update from the field.
	   }
	   /*
	   //console.debug.i && console.log("????", cat.put, u === cat.put, at.put);
	   if(u === cat.put && u !== at.put){ // TODO: Use state instead?
	   	return ev.to.next(at); // For a field that has a value, but nothing on its context, then that means we have received the update out of order and we will receive it from the context, so we can deduplicate this one.
	   }*/
				as.use(at, at.event || ev);
				ev.to.next(at);
			}
			var obj = Gun.obj,
			    obj_has = obj.has,
			    obj_to = Gun.obj.to;
			var rel = Gun.val.rel;
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
				    root = gun._.root,
				    tmp;
				as = as || { data: data, as: as, gun: gun };
				if (typeof cb === 'string') {
					as.soul = cb;
				} else {
					as.ack = cb;
				}
				if (root === gun || as.soul) {
					if (!obj_is(as.data)) {
						(opt.any || noop).call(opt.as || gun, as.out = { err: Gun.log("No field to put", _typeof(as.data), '"' + as.data + '" on!') });
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
							Gun.log("Can only save a node, not a property.");return;
						}
						gun.put(Gun.val.rel.ify(s), cb, as);
					});
					return gun;
				}
				as.ref = as.ref || root === (tmp = gun._.back) ? gun : tmp;
				as.ref.get(any, { as: as, out: { get: { '.': null } } });
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
					(as.ack || noop).call(opt.as || as.gun, as.out = { err: Gun.log(env.err) });
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
						gun: as.ref, put: as.out = as.env.graph, opt: as.opt,
						'#': Gun.on.ask(function (ack) {
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
						ref = ref.get(path[i], null, { path: true }); // TODO: API change! We won't need 'path: true' anymore.
					}
					if (as.not || Gun.node.soul(at.obj)) {
						at.soul(Gun.node.soul(at.obj) || ((as.opt || {}).uuid || as.gun.back('opt.uuid') || Gun.text.random)());
						return;
					}
					(as.stun = as.stun || {})[path] = true;
					ref.get(soul, { as: { at: at, as: as }, out: { get: { '.': null } } });
				}, { as: as, at: at });
			}

			function soul(at, ev) {
				var as = this.as,
				    cat = as.at;as = as.as;
				//ev.stun(); // TODO: BUG!?
				ev.off();
				cat.soul(Gun.node.soul(cat.obj) || Gun.node.soul(at.put) || Gun.val.rel.is(at.put) || ((as.opt || {}).uuid || as.gun.back('opt.uuid') || Gun.text.random)()); // TODO: BUG!? Do we really want the soul of the object given to us? Could that be dangerous?
				as.stun[cat.path] = false;
				as.batch();
			}

			function any(at, ev) {
				function implicit(at) {
					// TODO: CLEAN UP!!!!!
					if (!at || !at.get) {
						return;
					} // TODO: CLEAN UP!!!!!
					as.data = obj_put({}, tmp = at.get, as.data); // TODO: CLEAN UP!!!!!
					at = at.via; // TODO: CLEAN UP!!!!!
					if (!at) {
						return;
					} // TODO: CLEAN UP!!!!!
					tmp = at.get; // TODO: CLEAN UP!!!!!
					if (!at.via || !at.via.get) {
						return;
					} // TODO: CLEAN UP!!!!!
					implicit(at); // TODO: CLEAN UP!!!!!
				} // TODO: CLEAN UP!!!!!
				var as = this.as;
				if (at.err) {
					console.log("Please report this as an issue! Put.any.err");
					return;
				}
				var cat = as.ref._,
				    data = at.put,
				    opt = as.opt || {},
				    root,
				    tmp;
				if (u === data) {
					/*if(opt.init || as.gun.back('opt.init')){
	    	return;
	    }*/
					if (!at.get) {
						if (!cat.get) {
							return;
						}
						any.call({ as: as }, {
							put: as.data,
							get: as.not = as.soul = cat.get
						}, ev);
						return;
					}
					/*
	    	TODO: THIS WHOLE SECTION NEEDS TO BE CLEANED UP!
	    	Implicit behavior should be much cleaner. Right now it is hacky.
	    */
					// TODO: BUG!!!!!!! Apparently Gun.node.ify doesn't produce a valid HAM node?
					if (as.ref !== as.gun) {
						// TODO: CLEAN UP!!!!!
						tmp = as.gun._.get; // TODO: CLEAN UP!!!!!
						if (!tmp) {
							return;
						} // TODO: CLEAN UP!!!!!
						as.data = obj_put({}, tmp, as.data);
						tmp = u;
					}
					if (cat.root !== cat.back) {
						implicit(at);
					}
					tmp = tmp || at.get;
					any.call({ as: as }, {
						put: as.data,
						get: as.not = as.soul = tmp
					}, ev);
					return;
				}
				ev.off();
				if (!as.not && !(as.soul = Gun.node.soul(data))) {
					if (as.path && obj_is(as.data)) {
						// Apparently necessary
						as.soul = (opt.uuid || as.gun.back('opt.uuid') || Gun.text.random)();
					} else {
						//as.data = obj_put({}, as.gun._.get, as.data);
						as.soul = at.soul;
					}
				}
				if (as.ref !== as.gun && !as.not) {
					tmp = as.gun._.get;
					if (!tmp) {
						console.log("Please report this as an issue! Put.no.get"); // TODO: BUG!??
						return;
					}
					as.data = obj_put({}, tmp, as.data);
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
						console.log(".!HYPOTHETICAL AMNESIA MACHINE ERR!.", HAM.err); // this error should never happen.
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
						if (obj_has(cat, 'put')) {
							return;
						}
						//if(cat.put !== u){ return }
						cat.on('in', {
							get: cat.get,
							put: cat.put,
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
					// TODO: PERF! Have options to determine if this data should even be in memory on this peer!
					obj_map(put, function (node, soul) {
						var root = this,
						    next = root.next || (root.next = {}),
						    gun = next[soul] || (next[soul] = root.gun.get(soul));
						gun._.put = root.graph[soul]; // TODO: BUG! Clone!
						if (cat.field && !obj_has(node, cat.field)) {
							(at = obj_to(at, {})).put = u;
							Gun.HAM.synth(at, ev, cat.gun);
							return;
						}
						gun._.on('in', {
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
								Gun.node.is(rel, each);
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
							cat = cat.gun.get(tmp['#'])._;
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
				if (u === at.put) {
					return;
				}
				var gun = at.gun,
				    cat = gun._,
				    data = cat.put || at.put,
				    tmp = opt.last,
				    id = cat.id + at.get;
				if (opt.change) {
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
				    value = at.put;
				if (!at.stun && u !== value) {
					cb.call(gun, value, at.get);
					return gun;
				}
				if (cb) {
					(opt = opt || {}).ok = cb;
					opt.cat = at;
					gun.get(val, { as: opt });
					opt.async = at.stun ? 1 : true;
				}
				return gun;
			};

			function val(at, ev, to) {
				var opt = this.as,
				    gun = at.gun,
				    cat = gun._,
				    data = cat.put || at.put;
				if (u === data) {
					return;
				}
				if (ev.wait) {
					clearTimeout(ev.wait);
				}
				if (!to && true === opt.async && 0 !== opt.wait) {
					ev.wait = setTimeout(function () {
						val.call({ as: opt }, at, ev, ev.wait || 1);
					}, opt.wait || 99);
					return;
				}
				ev.off();
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
			var val_rel_is = Gun.val.rel.is;
			var empty = {},
			    u;
		})(require, './on');

		;require(function (module) {
			var Gun = require('./core');
			Gun.chain.not = function (cb, opt, t) {
				var gun = this,
				    at = Gun.obj.to(gun._, { not: { not: cb } });
				gun.get(ought, { as: at });
				return gun;
			};
			function ought(cat, ev) {
				ev.off();var at = this; // TODO: BUG! Is this correct?
				if (cat.err || cat.put) {
					return;
				}
				if (!at.not || !at.not.not) {
					return;
				}
				//ev.stun(); // TODO: BUG? I think this is correct. NOW INCORRECT because as things mutate we might want to retrigger!
				at.not.not.call(at.gun, at.get, function () {
					console.log("Please report this bug on https://gitter.im/amark/gun and in the issues.");need.to.implement;
				});
			}
		})(require, './not');

		;require(function (module) {
			var Gun = require('./core');
			Gun.chain.map = function (cb, opt, t) {
				var gun = this,
				    cat = gun._,
				    chain = cat.map,
				    ons = [],
				    act,
				    _off2;
				//cb = cb || function(){ return this } // TODO: API BREAKING CHANGE! 0.5 Will behave more like other people's usage of `map` where the passed callback is a transform function. By default though, if no callback is specified then it will use a transform function that returns the same thing it received.
				if (!chain) {
					chain = cat.map = gun.chain();
					var list = (cat = chain._).list = cat.list || {};
					(ons[ons.length] = chain.on('in')).map = {};
					/*
	    	Attempted merge with alancnet's `off` support, we'll see if it works.
	    */
					if (opt !== false) {
						ons[ons.length] = gun.on(map, { change: true, as: cat });
					}
				}
				if (cb) {
					ons[ons.length] = chain.on(cb);
				}
				_off2 = function off() {
					while (ons.length) {
						act = ons.pop();
						if (act && act.off) act.off();
					}
					return _off2.off();
				};
				_off2.off = chain.off.bind(chain) || noop;
				chain.off = _off2;
				return chain;
			};
			Gun.chain.map = function (cb, opt, t) {
				var gun = this,
				    cat = gun._,
				    chain = cat.fields,
				    ons = [],
				    act,
				    off;
				//cb = cb || function(){ return this } // TODO: API BREAKING CHANGE! 0.5 Will behave more like other people's usage of `map` where the passed callback is a transform function. By default though, if no callback is specified then it will use a transform function that returns the same thing it received.
				if (chain) {
					return chain;
				}
				cat.map = {};
				chain = cat.fields = gun.chain();
				//chain._.set = {};
				//gun.on('in', map, chain._);
				if (cb) {
					chain.on(cb);
				}
				return chain;
			};
			function map(at, ev) {
				var cat = this,
				    gun = at.gun || this.back,
				    tac = gun._;
				obj_map(at.put, each, { gun: gun, cat: cat, id: tac.id || at.get, at: at });
			}
			function each(v, f) {
				if (n_ === f) {
					return;
				}
				var gun = this.gun,
				    cat = this.cat;
				//console.debug(7, "-- EACH -->", f, v);
				var id = this.id;if (cat.set[id + f]) {
					return;
				}cat.set[id + f] = 1;
				cat.on('in', { gun: gun.get(f, null, { path: true }), get: f, put: v, via: this.at });
			}
			var obj_map = Gun.obj.map,
			    noop = function noop() {},
			    event = { stun: noop, off: noop },
			    n_ = Gun.node._;
		})(require, './map');

		;require(function (module) {
			var Gun = require('./core');
			Gun.chain.init = function () {
				// TODO: DEPRECATE?
				(this._.opt = this._.opt || {}).init = true;
				return this.back(-1).put(Gun.node.ify({}, this._.get), null, this._.get);
			};
		})(require, './init');

		;require(function (module) {
			var Gun = require('./core');
			Gun.chain.set = function (item, cb, opt) {
				var gun = this,
				    soul;
				cb = cb || function () {};
				if (soul = Gun.node.soul(item)) return gun.set(gun.get(soul), cb, opt);
				if (Gun.obj.is(item) && !Gun.is(item)) return gun.set(gun._.root.put(item), cb, opt);
				return item.val(function (node) {
					var put = {},
					    soul = Gun.node.soul(node);
					if (!soul) {
						return cb.call(gun, { err: Gun.log('Only a node can be linked! Not "' + node + '"!') });
					}
					gun.put(Gun.obj.put(put, soul, Gun.val.rel.ify(soul)), cb, opt);
				}, { wait: 0 });
			};
		})(require, './set');

		;require(function (module) {
			if (typeof Gun === 'undefined') {
				return;
			} // TODO: localStorage is Browser only. But it would be nice if it could somehow plugin into NodeJS compatible localStorage APIs?

			var root,
			    noop = function noop() {};
			if (typeof window !== 'undefined') {
				root = window;
			}
			var store = root.localStorage || { setItem: noop, removeItem: noop, getItem: noop };

			function put(at) {
				var err,
				    id,
				    opt,
				    root = at.gun._.root;
				this.to.next(at);
				(opt = {}).prefix = (at.opt || opt).prefix || at.gun.back('opt.prefix') || 'gun/';
				Gun.graph.is(at.put, function (node, soul) {
					//try{store.setItem(opt.prefix + soul, Gun.text.ify(node));
					// TODO: BUG! PERF! Biggest slowdown is because of localStorage stringifying larger and larger nodes!
					try {
						store.setItem(opt.prefix + soul, Gun.text.ify(root._.graph[soul] || node));
					} catch (e) {
						err = e || "localStorage failure";
					}
				});
				//console.log('@@@@@@@@@@local put!');
				if (Gun.obj.empty(at.gun.back('opt.peers'))) {
					Gun.on.ack(at, { err: err, ok: 0 }); // only ack if there are no peers.
				}
			}
			function get(at) {
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
				data = Gun.obj.ify(store.getItem(opt.prefix + soul) || null);
				if (!data) {
					// localStorage isn't trustworthy to say "not found".
					if (Gun.obj.empty(gun.back('opt.peers'))) {
						gun.back(-1).on('in', { '@': at['#'] });
					}
					return;
				}
				if (Gun.obj.has(lex, '.')) {
					var tmp = data[lex['.']];data = { _: data._ };if (u !== tmp) {
						data[lex['.']] = tmp;
					}
				}
				//console.log('@@@@@@@@@@@@local get', data, at);
				gun.back(-1).on('in', { '@': at['#'], put: Gun.graph.node(data) });
				//},11);
			}
			Gun.on('put', put);
			Gun.on('get', get);
		})(require, './adapters/localStorage');

		;require(function (module) {
			var Gun = require('./core');

			// Check for stone-age browsers.
			if (typeof JSON === 'undefined') {
				throw new Error('Gun depends on JSON. Please load it first:\n' + 'ajax.cdnjs.com/ajax/libs/json2/20110223/json2.js');
			}

			function Client(url, options, wscOptions) {
				if (!(this instanceof Client)) {
					return new Client(url, options, wscOptions);
				}

				this.url = Client.formatURL(url);
				this.socket = null;
				this.queue = [];
				this.sid = Gun.text.random(10);

				this.on = Gun.on;

				this.options = options || {};
				this.options.wsc = wscOptions;
				this.resetBackoff();
			}

			Client.prototype = {
				constructor: Client,

				drainQueue: function drainQueue() {
					var queue = this.queue;
					var client = this;

					// Reset the queue.
					this.queue = [];

					// Send each message.
					queue.forEach(function (msg) {
						client.send(msg);
					});

					return queue.length;
				},

				connect: function connect() {
					var client = this;
					var socket = new Client.WebSocket(this.url, this.options.wsc.protocols, this.options.wsc);
					this.socket = socket;

					// Forward messages into the emitter.
					socket.addEventListener('message', function (msg) {
						client.on('message', msg);
					});

					// Reconnect on close events.
					socket.addEventListener('close', function () {
						client.scheduleReconnect();
					});

					// Send the messages in the queue.
					this.ready(function () {
						client.drainQueue();
					});

					return socket;
				},

				resetBackoff: function resetBackoff() {
					var backoff = this.options;

					this.backoff = {
						time: backoff.time || 100,
						max: backoff.max || 2000,
						factor: backoff.factor || 2
					};

					return this.backoff;
				},

				nextBackoff: function nextBackoff() {
					var backoff = this.backoff;
					var next = backoff.time * backoff.factor;
					var max = backoff.max;

					if (next > max) {
						next = max;
					}

					return backoff.time = next;
				},

				// Try to efficiently reconnect.
				scheduleReconnect: function scheduleReconnect() {
					var client = this;
					var time = this.backoff.time;
					this.nextBackoff();

					setTimeout(function () {
						client.connect();

						client.ready(function () {
							client.resetBackoff();
						});
					}, time);
				},

				isClosed: function isClosed() {
					var socket = this.socket;

					if (!socket) {
						return true;
					}

					var state = socket.readyState;

					if (state === socket.CLOSING || state === socket.CLOSED) {
						return true;
					}

					return false;
				},

				ready: function ready(callback) {
					var socket = this.socket;
					var state = socket.readyState;

					if (state === socket.OPEN) {
						callback();
						return;
					}

					if (state === socket.CONNECTING) {
						socket.addEventListener('open', callback);
					}
				},

				send: function send(msg) {
					if (this.isClosed()) {
						this.queue.push(msg);

						// Will send once connected.
						this.connect();
						return false;
					}

					var socket = this.socket;

					// Make sure the socket is open.
					this.ready(function () {
						socket.send(msg);
					});

					return true;
				}
			};

			if (typeof window !== 'undefined') {
				Client.WebSocket = window.WebSocket || window.webkitWebSocket || window.mozWebSocket || null;
			}

			Client.isSupported = !!Client.WebSocket;

			if (!Client.isSupported) {
				return;
			} // TODO: For now, don't do anything in browsers/servers that don't work. Later, use JSONP fallback and merge with server code?

			// Ensure the protocol is correct.
			Client.formatURL = function (url) {
				return url.replace('http', 'ws');
			};

			// Send a message to a group of peers.
			Client.broadcast = function (urls, msg) {
				var pool = Client.pool;
				msg.headers = msg.headers || {};

				Gun.obj.map(urls, function (options, addr) {

					var url = Client.formatURL(addr);

					var peer = pool[url];

					var envelope = {
						headers: Gun.obj.to(msg.headers, {
							'gun-sid': peer.sid
						}),
						body: msg.body
					};

					var serialized = Gun.text.ify(envelope);

					peer.send(serialized);
				});
			};

			// A map of URLs to client instances.
			Client.pool = {};

			// Close all WebSockets when the window closes.
			if (typeof window !== 'undefined') {
				window.addEventListener('unload', function () {
					Gun.obj.map(Client.pool, function (client) {
						if (client.isClosed()) {
							return;
						}

						client.socket.close();
					});
				});
			}

			// Define client instances as gun needs them.
			// Sockets will not be opened until absolutely necessary.
			Gun.on('opt', function (ctx) {
				this.to.next(ctx);

				var gun = ctx.gun;
				var peers = gun.back('opt.peers') || {};

				Gun.obj.map(peers, function (options, addr) {
					var url = Client.formatURL(addr);

					// Ignore clients we've seen before.
					if (Client.pool.hasOwnProperty(url)) {
						return;
					}

					var client = new Client(url, options.backoff, gun.back('opt.wsc') || { protocols: null });

					// Add it to the pool.
					Client.pool[url] = client;

					// Listen to incoming messages.
					client.on('message', function (msg) {
						var data;

						try {
							data = Gun.obj.ify(msg.data);
						} catch (err) {
							// Invalid message, discard it.
							return;
						}

						if (!data || !data.body) {
							return;
						}

						gun.on('in', data.body);
					});
				});
			});

			function request(peers, ctx) {
				if (Client.isSupported) {
					Client.broadcast(peers, ctx);
				}
			}

			// Broadcast the messages.
			Gun.on('out', function (ctx) {
				this.to.next(ctx);
				var gun = ctx.gun;
				var peers = gun.back('opt.peers') || {};
				var headers = gun.back('opt.headers') || {};
				// Validate.
				if (Gun.obj.empty(peers)) {
					return;
				}

				request(peers, { body: ctx, headers: headers });
			});

			request.jsonp = function (opt, cb) {
				request.jsonp.ify(opt, function (url) {
					if (!url) {
						return;
					}
					request.jsonp.send(url, function (err, reply) {
						cb(err, reply);
						request.jsonp.poll(opt, reply);
					}, opt.jsonp);
				});
			};
			request.jsonp.send = function (url, cb, id) {
				var js = document.createElement('script');
				js.src = url;
				js.onerror = function () {
					(window[js.id] || function () {})(null, {
						err: 'JSONP failed!'
					});
				};
				window[js.id = id] = function (res, err) {
					cb(err, res);
					cb.id = js.id;
					js.parentNode.removeChild(js);
					delete window[cb.id];
				};
				js.async = true;
				document.getElementsByTagName('head')[0].appendChild(js);
				return js;
			};
			request.jsonp.poll = function (opt, res) {
				if (!opt || !opt.base || !res || !res.headers || !res.headers.poll) {
					return;
				}
				var polls = request.jsonp.poll.s = request.jsonp.poll.s || {};
				polls[opt.base] = polls[opt.base] || setTimeout(function () {
					var msg = {
						base: opt.base,
						headers: { pull: 1 }
					};

					request.each(opt.headers, function (header, name) {
						msg.headers[name] = header;
					});

					request.jsonp(msg, function (err, reply) {
						delete polls[opt.base];

						var body = reply.body || [];
						while (body.length && body.shift) {
							var res = reply.body.shift();
							if (res && res.body) {
								request.createServer.ing(res, function () {
									request(opt.base, null, null, res);
								});
							}
						}
					});
				}, res.headers.poll);
			};
			request.jsonp.ify = function (opt, cb) {
				var uri = encodeURIComponent,
				    query = '?';
				if (opt.url && opt.url.pathname) {
					query = opt.url.pathname + query;
				}
				query = opt.base + query;
				request.each((opt.url || {}).query, function (value, key) {
					query += uri(key) + '=' + uri(value) + '&';
				});
				if (opt.headers) {
					query += uri('`') + '=' + uri(JSON.stringify(opt.headers)) + '&';
				}
				if (request.jsonp.max < query.length) {
					return cb();
				}
				var random = Math.floor(Math.random() * (0xffff + 1));
				query += uri('jsonp') + '=' + uri(opt.jsonp = 'P' + random);
				if (opt.body) {
					query += '&';
					var w = opt.body,
					    wls = function wls(w, l, s) {
						return uri('%') + '=' + uri(w + '-' + (l || w) + '/' + (s || w)) + '&' + uri('$') + '=';
					};
					if (typeof w != 'string') {
						w = JSON.stringify(w);
						query += uri('^') + '=' + uri('json') + '&';
					}
					w = uri(w);
					var i = 0,
					    l = w.length,
					    s = request.jsonp.max - (query.length + wls(l.toString()).length);
					if (s < 0) {
						return cb();
					}
					while (w) {
						cb(query + wls(i, i += s, l) + w.slice(0, i));
						w = w.slice(i);
					}
				} else {
					cb(query);
				}
			};
			request.jsonp.max = 2000;
			request.each = function (obj, cb, as) {
				if (!obj || !cb) {
					return;
				}
				for (var key in obj) {
					if (obj.hasOwnProperty(key)) {
						cb.call(as, obj[key], key);
					}
				}
			};
			module.exports = Client;
		})(require, './polyfill/request');
	})();
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(5)(module)))

/***/ },
/* 5 */
/***/ function(module, exports) {

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

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

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

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = "<p>index</p>\n"

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

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

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = "<span class=\"roadmap\">\n    <details>\n    <summary>road map</summary>\n    <ul>\n        <li><del><a href=\"https://github.com/colealbon/hotlips/commit/3b70981cbe4e11e1400ae8e948a06e3582d9c2d2\">Install node/koa/webpack</a></del></li>\n        <li><del><a href=\"https://github.com/colealbon/hotlips/issues/2\">Install gundb</a></del></li>\n        <li><del>make a <a href=\"#/deck\">deck</a> of cards</del></li>\n        <li><del>Alice and Bob <a href=\"#/message\">identify</a></del></li>\n        <li><del>Alice and Bob <a href=\"#/connect\">connect</a></del></li>\n        <li><del>Alice and Bob <a href=\"https://github.com/colealbon/streamliner\">exchange keys</a></del?</li>\n        <li>Alice and Bob agree on a certain \"<a href=\"#/deck\">deck</a>\" of cards. In practice, this means they agree on a set of numbers or other data such that each element of the set represents a card.</li>\n        <li>Alice picks an encryption key A and uses this to encrypt each card of the deck.</li>\n        <li>Alice <a href=\"https://bost.ocks.org/mike/shuffle/\">shuffles</a> the cards.</li>\n        <li>Alice passes the encrypted and shuffled deck to Bob. With the encryption in place, Bob cannot know which card is which.</li>\n        <li>Bob shuffles the deck.</li>\n        <li>Bob passes the double encrypted and shuffled deck back to Alice.</li>\n        <li>Alice decrypts each card using her key A. This still leaves Bob's encryption in place though so she cannot know which card is which.</li>\n        <li>Alice picks one encryption key for each card (A1, A2, etc.) and encrypts them individually.</li>\n        <li>Alice passes the deck to Bob.</li>\n        <li>Bob decrypts each card using his key B. This still leaves Alice's individual encryption in place though so he cannot know which card is which.</li>\n        <li>Bob picks one encryption key for each card (B1, B2, etc.) and encrypts them individually.</li>\n        <li>Bob passes the deck back to Alice.</li>\n        <li>Alice publishes the deck for everyone playing (in this case only Alice and Bob, see below on expansion though).</li>\n    </ul>\n</details>\n</span>\n"

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

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

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = "<span class=\"contact\">\n    Cole Albon<br>\n    <a href=\"tel:+14156721648\">(415) 672-1648</a><br>\n    <a href=\"mailto:cole.albon@gmail.com\">cole.albon@gmail.com</a><br>\n    <a href=\"https://github.com/colealbon\">https://github.com/colealbon</a><br>\n    <a href=\"https://www.linkedin.com/in/cole-albon-5934634\">\n        <span id=\"linkedinaddress\" class=\"linkedinaddress\">https://www.linkedin.com/in/cole-albon-5934634</span>\n    </a><br>\n</span>\n"

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

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

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = "<form\n    id=\"message_form\"\n    onsubmit=\"\n     var gun = Gun(location.origin + '/gun');\n     openpgp.config.aead_protect = true\n     openpgp.initWorker({ path:'/js/openpgp.worker.js' })\n     window.handlePost(message_txt.value)(openpgp)(window.localStorage)(gun).then(result => {if (result) {console.log(result)}});document.getElementById('message_txt').value = ''; return false\"\n    method=\"post\"\n    action=\"/message\">\n    <input id=\"message_form_input\"\n        type=\"submit\"\n        value=\"post message\"\n        form=\"message_form\"\n        >\n</form>\n<textarea\n    id=\"message_txt\"\n    name=\"message_txt\"\n    form=\"message_form\"\n    rows=51\n    cols=70\n    placeholder=\"paste plaintext message, public key, or private key\"\n    style=\"font-family:Menlo,Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New, monospace;\"\n    >\n</textarea>\n"

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

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

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = "    <div id=\"deck\" class=\"deck\">\n    <template id=\"█\"><svg viewBox=\"24 62 247 343\"><path d=\"M61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM70.3125 362.25 L70.3125 110.1094 L224.2969 110.1094 L224.2969 362.25 L70.3125 362.25 Z\"/></svg></template>\n    <template id=\"♠A\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.6719 115.7344 L91.8281 175.7812 L129.5156 175.7812 L110.6719 115.7344 ZM99.9844 101.6719 L121.6406 101.6719 L162.1406 219.2344 L143.5781 219.2344 L134.0156 188.5781 L87.6094 188.5781 L78.0469 219.2344 L59.4844 219.2344 L99.9844 101.6719 Z\"/></svg></template>\n    <template id=\"♠2\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM86.3438 203.0625 L145.9688 203.0625 L145.9688 219.0938 L61.875 219.0938 L61.875 203.625 Q66.6562 199.2656 75.5156 191.3906 Q123.8906 148.5 123.8906 135.2812 Q123.8906 126 116.5781 120.3047 Q109.2656 114.6094 97.3125 114.6094 Q90 114.6094 81.4219 117.0703 Q72.8438 119.5312 62.7188 124.4531 L62.7188 107.1562 Q73.5469 103.2188 82.8984 101.25 Q92.25 99.2812 100.2656 99.2812 Q120.6562 99.2812 132.8906 108.5625 Q145.125 117.8438 145.125 133.0312 Q145.125 152.5781 98.5781 192.5156 Q90.7031 199.2656 86.3438 203.0625 Z\"/></svg></template>\n    <template id=\"♠3\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM121.7812 155.5312 Q134.7188 158.0625 141.8203 165.7266 Q148.9219 173.3906 148.9219 184.9219 Q148.9219 202.3594 135.5625 211.7812 Q122.2031 221.2031 97.3125 221.2031 Q89.2969 221.2031 80.5078 219.7266 Q71.7188 218.25 61.875 215.4375 L61.875 198.4219 Q69.1875 202.2188 77.5547 204.0469 Q85.9219 205.875 95.3438 205.875 Q110.6719 205.875 119.1094 200.3203 Q127.5469 194.7656 127.5469 184.9219 Q127.5469 174.5156 119.7422 169.1719 Q111.9375 163.8281 96.75 163.8281 L84.6562 163.8281 L84.6562 148.6406 L97.875 148.6406 Q111.0938 148.6406 117.9141 144.2109 Q124.7344 139.7812 124.7344 131.3438 Q124.7344 123.1875 117.7031 118.8984 Q110.6719 114.6094 97.3125 114.6094 Q91.6875 114.6094 84.5156 115.875 Q77.3438 117.1406 65.9531 120.375 L65.9531 104.2031 Q76.2188 101.8125 85.2188 100.5469 Q94.2188 99.2812 101.9531 99.2812 Q122.2031 99.2812 134.0859 107.5781 Q145.9688 115.875 145.9688 129.7969 Q145.9688 139.5 139.6406 146.25 Q133.3125 153 121.7812 155.5312 Z\"/></svg></template>\n    <template id=\"♠4\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM120.0938 118.6875 L76.6406 177.6094 L120.0938 177.6094 L120.0938 118.6875 ZM117 101.6719 L140.3438 101.6719 L140.3438 177.6094 L159.3281 177.6094 L159.3281 192.9375 L140.3438 192.9375 L140.3438 219.0938 L120.0938 219.0938 L120.0938 192.9375 L61.875 192.9375 L61.875 175.9219 L117 101.6719 Z\"/></svg></template>\n    <template id=\"♠5\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM67.5 101.6719 L139.2188 101.6719 L139.2188 115.0312 L84.2344 115.0312 L84.2344 143.7188 Q88.1719 142.4531 92.25 141.8906 Q96.1875 141.3281 100.125 141.3281 Q122.7656 141.3281 135.9844 152.1562 Q149.2031 162.8438 149.2031 181.2656 Q149.2031 200.25 135.5625 210.7969 Q122.0625 221.2031 97.3125 221.2031 Q88.875 221.2031 80.0156 219.9375 Q71.1562 218.6719 61.875 216.1406 L61.875 200.25 Q69.8906 204.0469 78.6094 206.0156 Q87.3281 207.8438 97.0312 207.8438 Q112.6406 207.8438 121.7812 200.6719 Q130.9219 193.5 130.9219 181.2656 Q130.9219 169.0312 121.7812 161.8594 Q112.6406 154.6875 97.0312 154.6875 Q89.7188 154.6875 82.4062 156.0938 Q75.0938 157.5 67.5 160.4531 L67.5 101.6719 Z\"/></svg></template>\n    <template id=\"♠6\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.1094 153.7031 Q97.7344 153.7031 90.5625 161.0156 Q83.3906 168.4688 83.3906 181.2656 Q83.3906 193.9219 90.5625 201.2344 Q97.7344 208.6875 110.1094 208.6875 Q122.3438 208.6875 129.5156 201.2344 Q136.6875 193.9219 136.6875 181.2656 Q136.6875 168.4688 129.5156 161.0156 Q122.3438 153.7031 110.1094 153.7031 ZM146.3906 103.9219 L146.3906 118.4062 Q139.5 115.5938 132.4688 114.1875 Q125.4375 112.6406 118.5469 112.6406 Q100.5469 112.6406 90.9844 123.1875 Q81.4219 133.875 80.0156 155.3906 Q85.3594 148.5 93.375 144.8438 Q101.5312 141.1875 111.0938 141.1875 Q131.4844 141.1875 143.2969 151.875 Q155.1094 162.7031 155.1094 181.2656 Q155.1094 199.125 142.7344 210.2344 Q130.5 221.2031 110.1094 221.2031 Q86.625 221.2031 74.25 205.5938 Q61.875 189.9844 61.875 160.1719 Q61.875 132.3281 77.0625 115.875 Q92.25 99.2812 117.8438 99.2812 Q124.7344 99.2812 131.7656 100.4062 Q138.7969 101.6719 146.3906 103.9219 Z\"/></svg></template>\n    <template id=\"♠7\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L148.6406 101.6719 L148.6406 108.4219 L99.7031 219.0938 L80.5781 219.0938 L126.7031 115.0312 L61.875 115.0312 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♠8\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM108.2812 163.125 Q95.2031 163.125 87.75 169.3125 Q80.2969 175.3594 80.2969 185.9062 Q80.2969 196.5938 87.75 202.6406 Q95.2031 208.6875 108.2812 208.6875 Q121.2188 208.6875 128.8125 202.5 Q136.2656 196.4531 136.2656 185.9062 Q136.2656 175.3594 128.8125 169.3125 Q121.3594 163.125 108.2812 163.125 ZM90 156.2344 Q78.1875 153.7031 71.7188 146.8125 Q65.1094 139.7812 65.1094 129.6562 Q65.1094 115.5938 76.6406 107.4375 Q88.1719 99.2812 108.2812 99.2812 Q128.3906 99.2812 139.9219 107.4375 Q151.3125 115.5938 151.3125 129.6562 Q151.3125 140.0625 144.8438 146.8125 Q138.2344 153.7031 126.5625 156.2344 Q139.2188 158.7656 147.0938 166.9219 Q154.5469 174.6562 154.5469 185.9062 Q154.5469 202.9219 142.5938 212.0625 Q130.5 221.2031 108.2812 221.2031 Q85.9219 221.2031 73.9688 212.0625 Q61.875 202.9219 61.875 185.9062 Q61.875 174.9375 69.3281 166.9219 Q76.9219 159.0469 90 156.2344 ZM83.25 131.2031 Q83.25 140.0625 89.8594 145.4062 Q96.3281 150.6094 108.2812 150.6094 Q119.6719 150.6094 126.5625 145.4062 Q133.3125 140.3438 133.3125 131.2031 Q133.3125 122.3438 126.5625 117 Q119.9531 111.7969 108.2812 111.7969 Q96.6094 111.7969 89.8594 117 Q83.25 122.0625 83.25 131.2031 Z\"/></svg></template>\n    <template id=\"♠9\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM70.5938 216.5625 L70.5938 202.0781 Q77.4844 204.8906 84.5156 206.4375 Q91.5469 207.8438 98.2969 207.8438 Q116.4375 207.8438 126 197.2969 Q135.4219 186.75 136.8281 165.0938 Q131.9062 171.7031 123.4688 175.5 Q115.4531 179.1562 105.75 179.1562 Q85.5 179.1562 73.6875 168.4688 Q61.875 157.7812 61.875 139.2188 Q61.875 121.0781 74.1094 110.25 Q86.4844 99.2812 106.875 99.2812 Q130.3594 99.2812 142.5938 114.8906 Q154.9688 130.5 154.9688 160.3125 Q154.9688 188.1562 139.9219 204.6094 Q124.7344 221.2031 99.1406 221.2031 Q92.25 221.2031 85.2188 220.0781 Q78.1875 218.8125 70.5938 216.5625 ZM106.875 166.7812 Q119.25 166.7812 126.4219 159.4688 Q133.5938 152.1562 133.5938 139.2188 Q133.5938 126.5625 126.4219 119.25 Q119.25 111.7969 106.875 111.7969 Q94.9219 111.7969 87.4688 119.25 Q80.1562 126.5625 80.1562 139.2188 Q80.1562 152.1562 87.4688 159.4688 Q94.6406 166.7812 106.875 166.7812 Z\"/></svg></template>\n    <template id=\"♠10\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM159.0469 111.7969 Q149.0625 111.7969 142.0312 123.8906 Q134.8594 135.9844 134.8594 160.1719 Q134.8594 184.5 142.0312 196.5938 Q149.0625 208.6875 159.0469 208.6875 Q169.0312 208.6875 176.0625 196.5938 Q183.2344 184.5 183.2344 160.1719 Q183.2344 135.9844 176.0625 123.8906 Q169.0312 111.7969 159.0469 111.7969 ZM159.0469 99.2812 Q177.4688 99.2812 189.4219 114.8906 Q201.375 130.5 201.375 160.1719 Q201.375 189.9844 189.4219 205.5938 Q177.4688 221.2031 159.0469 221.2031 Q136.2656 221.2031 126.4219 205.5938 Q116.5781 189.9844 116.5781 160.1719 Q116.5781 130.5 126.4219 114.8906 Q136.2656 99.2812 159.0469 99.2812 ZM80.5781 219.0938 L80.5781 117.7031 L61.875 123.4688 L61.875 107.1562 L81.5625 101.6719 L100.8281 101.6719 L100.8281 219.0938 L80.5781 219.0938 Z\"/></svg></template>\n    <template id=\"♠J\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM89.1562 101.6719 L107.0156 101.6719 L107.0156 178.7344 Q107.0156 199.6875 97.875 209.5312 Q88.875 219.2344 68.7656 219.2344 L61.875 219.2344 L61.875 205.7344 L67.5 205.7344 Q79.3125 205.7344 84.2344 199.8281 Q89.1562 193.9219 89.1562 178.7344 L89.1562 101.6719 Z\"/></svg></template>\n    <template id=\"♠Q\"><svg viewBox=\"24 62 247 343\"><path d=\"M107.2969 221.0625 Q106.7344 221.0625 105.5391 221.1328 Q104.3438 221.2031 103.6406 221.2031 Q81.4219 221.2031 70.5234 206.0859 Q59.625 190.9688 59.625 160.3125 Q59.625 129.5156 70.5938 114.3984 Q81.5625 99.2812 103.7812 99.2812 Q126.1406 99.2812 137.1094 114.3984 Q148.0781 129.5156 148.0781 160.3125 Q148.0781 183.5156 142.0312 197.6484 Q135.9844 211.7812 123.6094 217.4062 L141.3281 232.3125 L127.9688 240.1875 L107.2969 221.0625 ZM129.375 160.3125 Q129.375 134.4375 123.3984 123.3281 Q117.4219 112.2188 103.7812 112.2188 Q90.2812 112.2188 84.3047 123.3281 Q78.3281 134.4375 78.3281 160.3125 Q78.3281 186.1875 84.3047 197.2969 Q90.2812 208.4062 103.7812 208.4062 Q117.4219 208.4062 123.3984 197.2969 Q129.375 186.1875 129.375 160.3125 ZM174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 Z\"/></svg></template>\n    <template id=\"♠K\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L79.7344 101.6719 L79.7344 151.3125 L130.6406 101.6719 L153.7031 101.6719 L96.4688 156.5156 L158.3438 219.2344 L134.8594 219.2344 L79.7344 162.5625 L79.7344 219.2344 L61.875 219.2344 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♥A\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.6719 115.7344 L91.8281 175.7812 L129.5156 175.7812 L110.6719 115.7344 ZM99.9844 101.6719 L121.6406 101.6719 L162.1406 219.2344 L143.5781 219.2344 L134.0156 188.5781 L87.6094 188.5781 L78.0469 219.2344 L59.4844 219.2344 L99.9844 101.6719 Z\"/></svg></template>\n    <template id=\"♥2\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM86.3438 203.0625 L145.9688 203.0625 L145.9688 219.0938 L61.875 219.0938 L61.875 203.625 Q66.6562 199.2656 75.5156 191.3906 Q123.8906 148.5 123.8906 135.2812 Q123.8906 126 116.5781 120.3047 Q109.2656 114.6094 97.3125 114.6094 Q90 114.6094 81.4219 117.0703 Q72.8438 119.5312 62.7188 124.4531 L62.7188 107.1562 Q73.5469 103.2188 82.8984 101.25 Q92.25 99.2812 100.2656 99.2812 Q120.6562 99.2812 132.8906 108.5625 Q145.125 117.8438 145.125 133.0312 Q145.125 152.5781 98.5781 192.5156 Q90.7031 199.2656 86.3438 203.0625 Z\"/></svg></template>\n    <template id=\"♥3\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM121.7812 155.5312 Q134.7188 158.0625 141.8203 165.7266 Q148.9219 173.3906 148.9219 184.9219 Q148.9219 202.3594 135.5625 211.7812 Q122.2031 221.2031 97.3125 221.2031 Q89.2969 221.2031 80.5078 219.7266 Q71.7188 218.25 61.875 215.4375 L61.875 198.4219 Q69.1875 202.2188 77.5547 204.0469 Q85.9219 205.875 95.3438 205.875 Q110.6719 205.875 119.1094 200.3203 Q127.5469 194.7656 127.5469 184.9219 Q127.5469 174.5156 119.7422 169.1719 Q111.9375 163.8281 96.75 163.8281 L84.6562 163.8281 L84.6562 148.6406 L97.875 148.6406 Q111.0938 148.6406 117.9141 144.2109 Q124.7344 139.7812 124.7344 131.3438 Q124.7344 123.1875 117.7031 118.8984 Q110.6719 114.6094 97.3125 114.6094 Q91.6875 114.6094 84.5156 115.875 Q77.3438 117.1406 65.9531 120.375 L65.9531 104.2031 Q76.2188 101.8125 85.2188 100.5469 Q94.2188 99.2812 101.9531 99.2812 Q122.2031 99.2812 134.0859 107.5781 Q145.9688 115.875 145.9688 129.7969 Q145.9688 139.5 139.6406 146.25 Q133.3125 153 121.7812 155.5312 Z\"/></svg></template>\n    <template id=\"♥4\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM120.0938 118.6875 L76.6406 177.6094 L120.0938 177.6094 L120.0938 118.6875 ZM117 101.6719 L140.3438 101.6719 L140.3438 177.6094 L159.3281 177.6094 L159.3281 192.9375 L140.3438 192.9375 L140.3438 219.0938 L120.0938 219.0938 L120.0938 192.9375 L61.875 192.9375 L61.875 175.9219 L117 101.6719 Z\"/></svg></template>\n    <template id=\"♥5\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM67.5 101.6719 L139.2188 101.6719 L139.2188 115.0312 L84.2344 115.0312 L84.2344 143.7188 Q88.1719 142.4531 92.25 141.8906 Q96.1875 141.3281 100.125 141.3281 Q122.7656 141.3281 135.9844 152.1562 Q149.2031 162.8438 149.2031 181.2656 Q149.2031 200.25 135.5625 210.7969 Q122.0625 221.2031 97.3125 221.2031 Q88.875 221.2031 80.0156 219.9375 Q71.1562 218.6719 61.875 216.1406 L61.875 200.25 Q69.8906 204.0469 78.6094 206.0156 Q87.3281 207.8438 97.0312 207.8438 Q112.6406 207.8438 121.7812 200.6719 Q130.9219 193.5 130.9219 181.2656 Q130.9219 169.0312 121.7812 161.8594 Q112.6406 154.6875 97.0312 154.6875 Q89.7188 154.6875 82.4062 156.0938 Q75.0938 157.5 67.5 160.4531 L67.5 101.6719 Z\"/></svg></template>\n    <template id=\"♥6\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.1094 153.7031 Q97.7344 153.7031 90.5625 161.0156 Q83.3906 168.4688 83.3906 181.2656 Q83.3906 193.9219 90.5625 201.2344 Q97.7344 208.6875 110.1094 208.6875 Q122.3438 208.6875 129.5156 201.2344 Q136.6875 193.9219 136.6875 181.2656 Q136.6875 168.4688 129.5156 161.0156 Q122.3438 153.7031 110.1094 153.7031 ZM146.3906 103.9219 L146.3906 118.4062 Q139.5 115.5938 132.4688 114.1875 Q125.4375 112.6406 118.5469 112.6406 Q100.5469 112.6406 90.9844 123.1875 Q81.4219 133.875 80.0156 155.3906 Q85.3594 148.5 93.375 144.8438 Q101.5312 141.1875 111.0938 141.1875 Q131.4844 141.1875 143.2969 151.875 Q155.1094 162.7031 155.1094 181.2656 Q155.1094 199.125 142.7344 210.2344 Q130.5 221.2031 110.1094 221.2031 Q86.625 221.2031 74.25 205.5938 Q61.875 189.9844 61.875 160.1719 Q61.875 132.3281 77.0625 115.875 Q92.25 99.2812 117.8438 99.2812 Q124.7344 99.2812 131.7656 100.4062 Q138.7969 101.6719 146.3906 103.9219 Z\"/></svg></template>\n    <template id=\"♥7\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L148.6406 101.6719 L148.6406 108.4219 L99.7031 219.0938 L80.5781 219.0938 L126.7031 115.0312 L61.875 115.0312 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♥8\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM108.2812 163.125 Q95.2031 163.125 87.75 169.3125 Q80.2969 175.3594 80.2969 185.9062 Q80.2969 196.5938 87.75 202.6406 Q95.2031 208.6875 108.2812 208.6875 Q121.2188 208.6875 128.8125 202.5 Q136.2656 196.4531 136.2656 185.9062 Q136.2656 175.3594 128.8125 169.3125 Q121.3594 163.125 108.2812 163.125 ZM90 156.2344 Q78.1875 153.7031 71.7188 146.8125 Q65.1094 139.7812 65.1094 129.6562 Q65.1094 115.5938 76.6406 107.4375 Q88.1719 99.2812 108.2812 99.2812 Q128.3906 99.2812 139.9219 107.4375 Q151.3125 115.5938 151.3125 129.6562 Q151.3125 140.0625 144.8438 146.8125 Q138.2344 153.7031 126.5625 156.2344 Q139.2188 158.7656 147.0938 166.9219 Q154.5469 174.6562 154.5469 185.9062 Q154.5469 202.9219 142.5938 212.0625 Q130.5 221.2031 108.2812 221.2031 Q85.9219 221.2031 73.9688 212.0625 Q61.875 202.9219 61.875 185.9062 Q61.875 174.9375 69.3281 166.9219 Q76.9219 159.0469 90 156.2344 ZM83.25 131.2031 Q83.25 140.0625 89.8594 145.4062 Q96.3281 150.6094 108.2812 150.6094 Q119.6719 150.6094 126.5625 145.4062 Q133.3125 140.3438 133.3125 131.2031 Q133.3125 122.3438 126.5625 117 Q119.9531 111.7969 108.2812 111.7969 Q96.6094 111.7969 89.8594 117 Q83.25 122.0625 83.25 131.2031 Z\"/></svg></template>\n    <template id=\"♥9\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM70.5938 216.5625 L70.5938 202.0781 Q77.4844 204.8906 84.5156 206.4375 Q91.5469 207.8438 98.2969 207.8438 Q116.4375 207.8438 126 197.2969 Q135.4219 186.75 136.8281 165.0938 Q131.9062 171.7031 123.4688 175.5 Q115.4531 179.1562 105.75 179.1562 Q85.5 179.1562 73.6875 168.4688 Q61.875 157.7812 61.875 139.2188 Q61.875 121.0781 74.1094 110.25 Q86.4844 99.2812 106.875 99.2812 Q130.3594 99.2812 142.5938 114.8906 Q154.9688 130.5 154.9688 160.3125 Q154.9688 188.1562 139.9219 204.6094 Q124.7344 221.2031 99.1406 221.2031 Q92.25 221.2031 85.2188 220.0781 Q78.1875 218.8125 70.5938 216.5625 ZM106.875 166.7812 Q119.25 166.7812 126.4219 159.4688 Q133.5938 152.1562 133.5938 139.2188 Q133.5938 126.5625 126.4219 119.25 Q119.25 111.7969 106.875 111.7969 Q94.9219 111.7969 87.4688 119.25 Q80.1562 126.5625 80.1562 139.2188 Q80.1562 152.1562 87.4688 159.4688 Q94.6406 166.7812 106.875 166.7812 Z\"/></svg></template>\n    <template id=\"♥10\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM159.0469 111.7969 Q149.0625 111.7969 142.0312 123.8906 Q134.8594 135.9844 134.8594 160.1719 Q134.8594 184.5 142.0312 196.5938 Q149.0625 208.6875 159.0469 208.6875 Q169.0312 208.6875 176.0625 196.5938 Q183.2344 184.5 183.2344 160.1719 Q183.2344 135.9844 176.0625 123.8906 Q169.0312 111.7969 159.0469 111.7969 ZM159.0469 99.2812 Q177.4688 99.2812 189.4219 114.8906 Q201.375 130.5 201.375 160.1719 Q201.375 189.9844 189.4219 205.5938 Q177.4688 221.2031 159.0469 221.2031 Q136.2656 221.2031 126.4219 205.5938 Q116.5781 189.9844 116.5781 160.1719 Q116.5781 130.5 126.4219 114.8906 Q136.2656 99.2812 159.0469 99.2812 ZM80.5781 219.0938 L80.5781 117.7031 L61.875 123.4688 L61.875 107.1562 L81.5625 101.6719 L100.8281 101.6719 L100.8281 219.0938 L80.5781 219.0938 Z\"/></svg></template>\n    <template id=\"♥J\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM89.1562 101.6719 L107.0156 101.6719 L107.0156 178.7344 Q107.0156 199.6875 97.875 209.5312 Q88.875 219.2344 68.7656 219.2344 L61.875 219.2344 L61.875 205.7344 L67.5 205.7344 Q79.3125 205.7344 84.2344 199.8281 Q89.1562 193.9219 89.1562 178.7344 L89.1562 101.6719 Z\"/></svg></template>\n    <template id=\"♥Q\"><svg viewBox=\"24 62 247 343\"><path d=\"M107.2969 221.0625 Q106.7344 221.0625 105.5391 221.1328 Q104.3438 221.2031 103.6406 221.2031 Q81.4219 221.2031 70.5234 206.0859 Q59.625 190.9688 59.625 160.3125 Q59.625 129.5156 70.5938 114.3984 Q81.5625 99.2812 103.7812 99.2812 Q126.1406 99.2812 137.1094 114.3984 Q148.0781 129.5156 148.0781 160.3125 Q148.0781 183.5156 142.0312 197.6484 Q135.9844 211.7812 123.6094 217.4062 L141.3281 232.3125 L127.9688 240.1875 L107.2969 221.0625 ZM129.375 160.3125 Q129.375 134.4375 123.3984 123.3281 Q117.4219 112.2188 103.7812 112.2188 Q90.2812 112.2188 84.3047 123.3281 Q78.3281 134.4375 78.3281 160.3125 Q78.3281 186.1875 84.3047 197.2969 Q90.2812 208.4062 103.7812 208.4062 Q117.4219 208.4062 123.3984 197.2969 Q129.375 186.1875 129.375 160.3125 ZM172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM64.2656 84.7969 Q47.3906 84.7969 47.3906 101.6719 L47.3906 370.6875 Q47.3906 387.5625 64.2656 387.5625 L235.125 387.5625 Q252 387.5625 252 370.6875 L252 101.6719 Q252 84.7969 235.125 84.7969 L64.2656 84.7969 ZM64.2656 67.9219 L235.125 67.9219 Q268.875 67.9219 268.875 101.6719 L268.875 370.6875 Q268.875 404.4375 235.125 404.4375 L64.2656 404.4375 Q30.5156 404.4375 30.5156 370.6875 L30.5156 101.6719 Q30.5156 67.9219 64.2656 67.9219 Z\"/></svg></template>\n    <template id=\"♥K\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L79.7344 101.6719 L79.7344 151.3125 L130.6406 101.6719 L153.7031 101.6719 L96.4688 156.5156 L158.3438 219.2344 L134.8594 219.2344 L79.7344 162.5625 L79.7344 219.2344 L61.875 219.2344 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♦A\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.6719 115.7344 L91.8281 175.7812 L129.5156 175.7812 L110.6719 115.7344 ZM99.9844 101.6719 L121.6406 101.6719 L162.1406 219.2344 L143.5781 219.2344 L134.0156 188.5781 L87.6094 188.5781 L78.0469 219.2344 L59.4844 219.2344 L99.9844 101.6719 Z\"/></svg></template>\n    <template id=\"♦2\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM86.3438 203.0625 L145.9688 203.0625 L145.9688 219.0938 L61.875 219.0938 L61.875 203.625 Q66.6562 199.2656 75.5156 191.3906 Q123.8906 148.5 123.8906 135.2812 Q123.8906 126 116.5781 120.3047 Q109.2656 114.6094 97.3125 114.6094 Q90 114.6094 81.4219 117.0703 Q72.8438 119.5312 62.7188 124.4531 L62.7188 107.1562 Q73.5469 103.2188 82.8984 101.25 Q92.25 99.2812 100.2656 99.2812 Q120.6562 99.2812 132.8906 108.5625 Q145.125 117.8438 145.125 133.0312 Q145.125 152.5781 98.5781 192.5156 Q90.7031 199.2656 86.3438 203.0625 Z\"/></svg></template>\n    <template id=\"♦3\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM121.7812 155.5312 Q134.7188 158.0625 141.8203 165.7266 Q148.9219 173.3906 148.9219 184.9219 Q148.9219 202.3594 135.5625 211.7812 Q122.2031 221.2031 97.3125 221.2031 Q89.2969 221.2031 80.5078 219.7266 Q71.7188 218.25 61.875 215.4375 L61.875 198.4219 Q69.1875 202.2188 77.5547 204.0469 Q85.9219 205.875 95.3438 205.875 Q110.6719 205.875 119.1094 200.3203 Q127.5469 194.7656 127.5469 184.9219 Q127.5469 174.5156 119.7422 169.1719 Q111.9375 163.8281 96.75 163.8281 L84.6562 163.8281 L84.6562 148.6406 L97.875 148.6406 Q111.0938 148.6406 117.9141 144.2109 Q124.7344 139.7812 124.7344 131.3438 Q124.7344 123.1875 117.7031 118.8984 Q110.6719 114.6094 97.3125 114.6094 Q91.6875 114.6094 84.5156 115.875 Q77.3438 117.1406 65.9531 120.375 L65.9531 104.2031 Q76.2188 101.8125 85.2188 100.5469 Q94.2188 99.2812 101.9531 99.2812 Q122.2031 99.2812 134.0859 107.5781 Q145.9688 115.875 145.9688 129.7969 Q145.9688 139.5 139.6406 146.25 Q133.3125 153 121.7812 155.5312 Z\"/></svg></template>\n    <template id=\"♦4\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM120.0938 118.6875 L76.6406 177.6094 L120.0938 177.6094 L120.0938 118.6875 ZM117 101.6719 L140.3438 101.6719 L140.3438 177.6094 L159.3281 177.6094 L159.3281 192.9375 L140.3438 192.9375 L140.3438 219.0938 L120.0938 219.0938 L120.0938 192.9375 L61.875 192.9375 L61.875 175.9219 L117 101.6719 Z\"/></svg></template>\n    <template id=\"♦5\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM67.5 101.6719 L139.2188 101.6719 L139.2188 115.0312 L84.2344 115.0312 L84.2344 143.7188 Q88.1719 142.4531 92.25 141.8906 Q96.1875 141.3281 100.125 141.3281 Q122.7656 141.3281 135.9844 152.1562 Q149.2031 162.8438 149.2031 181.2656 Q149.2031 200.25 135.5625 210.7969 Q122.0625 221.2031 97.3125 221.2031 Q88.875 221.2031 80.0156 219.9375 Q71.1562 218.6719 61.875 216.1406 L61.875 200.25 Q69.8906 204.0469 78.6094 206.0156 Q87.3281 207.8438 97.0312 207.8438 Q112.6406 207.8438 121.7812 200.6719 Q130.9219 193.5 130.9219 181.2656 Q130.9219 169.0312 121.7812 161.8594 Q112.6406 154.6875 97.0312 154.6875 Q89.7188 154.6875 82.4062 156.0938 Q75.0938 157.5 67.5 160.4531 L67.5 101.6719 Z\"/></svg></template>\n    <template id=\"♦6\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.1094 153.7031 Q97.7344 153.7031 90.5625 161.0156 Q83.3906 168.4688 83.3906 181.2656 Q83.3906 193.9219 90.5625 201.2344 Q97.7344 208.6875 110.1094 208.6875 Q122.3438 208.6875 129.5156 201.2344 Q136.6875 193.9219 136.6875 181.2656 Q136.6875 168.4688 129.5156 161.0156 Q122.3438 153.7031 110.1094 153.7031 ZM146.3906 103.9219 L146.3906 118.4062 Q139.5 115.5938 132.4688 114.1875 Q125.4375 112.6406 118.5469 112.6406 Q100.5469 112.6406 90.9844 123.1875 Q81.4219 133.875 80.0156 155.3906 Q85.3594 148.5 93.375 144.8438 Q101.5312 141.1875 111.0938 141.1875 Q131.4844 141.1875 143.2969 151.875 Q155.1094 162.7031 155.1094 181.2656 Q155.1094 199.125 142.7344 210.2344 Q130.5 221.2031 110.1094 221.2031 Q86.625 221.2031 74.25 205.5938 Q61.875 189.9844 61.875 160.1719 Q61.875 132.3281 77.0625 115.875 Q92.25 99.2812 117.8438 99.2812 Q124.7344 99.2812 131.7656 100.4062 Q138.7969 101.6719 146.3906 103.9219 Z\"/></svg></template>\n    <template id=\"♦7\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L148.6406 101.6719 L148.6406 108.4219 L99.7031 219.0938 L80.5781 219.0938 L126.7031 115.0312 L61.875 115.0312 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♦8\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM108.2812 163.125 Q95.2031 163.125 87.75 169.3125 Q80.2969 175.3594 80.2969 185.9062 Q80.2969 196.5938 87.75 202.6406 Q95.2031 208.6875 108.2812 208.6875 Q121.2188 208.6875 128.8125 202.5 Q136.2656 196.4531 136.2656 185.9062 Q136.2656 175.3594 128.8125 169.3125 Q121.3594 163.125 108.2812 163.125 ZM90 156.2344 Q78.1875 153.7031 71.7188 146.8125 Q65.1094 139.7812 65.1094 129.6562 Q65.1094 115.5938 76.6406 107.4375 Q88.1719 99.2812 108.2812 99.2812 Q128.3906 99.2812 139.9219 107.4375 Q151.3125 115.5938 151.3125 129.6562 Q151.3125 140.0625 144.8438 146.8125 Q138.2344 153.7031 126.5625 156.2344 Q139.2188 158.7656 147.0938 166.9219 Q154.5469 174.6562 154.5469 185.9062 Q154.5469 202.9219 142.5938 212.0625 Q130.5 221.2031 108.2812 221.2031 Q85.9219 221.2031 73.9688 212.0625 Q61.875 202.9219 61.875 185.9062 Q61.875 174.9375 69.3281 166.9219 Q76.9219 159.0469 90 156.2344 ZM83.25 131.2031 Q83.25 140.0625 89.8594 145.4062 Q96.3281 150.6094 108.2812 150.6094 Q119.6719 150.6094 126.5625 145.4062 Q133.3125 140.3438 133.3125 131.2031 Q133.3125 122.3438 126.5625 117 Q119.9531 111.7969 108.2812 111.7969 Q96.6094 111.7969 89.8594 117 Q83.25 122.0625 83.25 131.2031 Z\"/></svg></template>\n    <template id=\"♦9\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM70.5938 216.5625 L70.5938 202.0781 Q77.4844 204.8906 84.5156 206.4375 Q91.5469 207.8438 98.2969 207.8438 Q116.4375 207.8438 126 197.2969 Q135.4219 186.75 136.8281 165.0938 Q131.9062 171.7031 123.4688 175.5 Q115.4531 179.1562 105.75 179.1562 Q85.5 179.1562 73.6875 168.4688 Q61.875 157.7812 61.875 139.2188 Q61.875 121.0781 74.1094 110.25 Q86.4844 99.2812 106.875 99.2812 Q130.3594 99.2812 142.5938 114.8906 Q154.9688 130.5 154.9688 160.3125 Q154.9688 188.1562 139.9219 204.6094 Q124.7344 221.2031 99.1406 221.2031 Q92.25 221.2031 85.2188 220.0781 Q78.1875 218.8125 70.5938 216.5625 ZM106.875 166.7812 Q119.25 166.7812 126.4219 159.4688 Q133.5938 152.1562 133.5938 139.2188 Q133.5938 126.5625 126.4219 119.25 Q119.25 111.7969 106.875 111.7969 Q94.9219 111.7969 87.4688 119.25 Q80.1562 126.5625 80.1562 139.2188 Q80.1562 152.1562 87.4688 159.4688 Q94.6406 166.7812 106.875 166.7812 Z\"/></svg></template>\n    <template id=\"♦10\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM159.0469 111.7969 Q149.0625 111.7969 142.0312 123.8906 Q134.8594 135.9844 134.8594 160.1719 Q134.8594 184.5 142.0312 196.5938 Q149.0625 208.6875 159.0469 208.6875 Q169.0312 208.6875 176.0625 196.5938 Q183.2344 184.5 183.2344 160.1719 Q183.2344 135.9844 176.0625 123.8906 Q169.0312 111.7969 159.0469 111.7969 ZM159.0469 99.2812 Q177.4688 99.2812 189.4219 114.8906 Q201.375 130.5 201.375 160.1719 Q201.375 189.9844 189.4219 205.5938 Q177.4688 221.2031 159.0469 221.2031 Q136.2656 221.2031 126.4219 205.5938 Q116.5781 189.9844 116.5781 160.1719 Q116.5781 130.5 126.4219 114.8906 Q136.2656 99.2812 159.0469 99.2812 ZM80.5781 219.0938 L80.5781 117.7031 L61.875 123.4688 L61.875 107.1562 L81.5625 101.6719 L100.8281 101.6719 L100.8281 219.0938 L80.5781 219.0938 Z\"/></svg></template>\n    <template id=\"♦J\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM89.1562 101.6719 L107.0156 101.6719 L107.0156 178.7344 Q107.0156 199.6875 97.875 209.5312 Q88.875 219.2344 68.7656 219.2344 L61.875 219.2344 L61.875 205.7344 L67.5 205.7344 Q79.3125 205.7344 84.2344 199.8281 Q89.1562 193.9219 89.1562 178.7344 L89.1562 101.6719 Z\"/></svg></template>\n    <template id=\"♦Q\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM107.2969 221.0625 Q106.7344 221.0625 105.5391 221.1328 Q104.3438 221.2031 103.6406 221.2031 Q81.4219 221.2031 70.5234 206.0859 Q59.625 190.9688 59.625 160.3125 Q59.625 129.5156 70.5938 114.3984 Q81.5625 99.2812 103.7812 99.2812 Q126.1406 99.2812 137.1094 114.3984 Q148.0781 129.5156 148.0781 160.3125 Q148.0781 183.5156 142.0312 197.6484 Q135.9844 211.7812 123.6094 217.4062 L141.3281 232.3125 L127.9688 240.1875 L107.2969 221.0625 ZM129.375 160.3125 Q129.375 134.4375 123.3984 123.3281 Q117.4219 112.2188 103.7812 112.2188 Q90.2812 112.2188 84.3047 123.3281 Q78.3281 134.4375 78.3281 160.3125 Q78.3281 186.1875 84.3047 197.2969 Q90.2812 208.4062 103.7812 208.4062 Q117.4219 208.4062 123.3984 197.2969 Q129.375 186.1875 129.375 160.3125 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 Z\"/></svg></template>\n    <template id=\"♦K\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L79.7344 101.6719 L79.7344 151.3125 L130.6406 101.6719 L153.7031 101.6719 L96.4688 156.5156 L158.3438 219.2344 L134.8594 219.2344 L79.7344 162.5625 L79.7344 219.2344 L61.875 219.2344 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♣A\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.6719 115.7344 L91.8281 175.7812 L129.5156 175.7812 L110.6719 115.7344 ZM99.9844 101.6719 L121.6406 101.6719 L162.1406 219.2344 L143.5781 219.2344 L134.0156 188.5781 L87.6094 188.5781 L78.0469 219.2344 L59.4844 219.2344 L99.9844 101.6719 Z\"/></svg></template>\n    <template id=\"♣2\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM86.3438 203.0625 L145.9688 203.0625 L145.9688 219.0938 L61.875 219.0938 L61.875 203.625 Q66.6562 199.2656 75.5156 191.3906 Q123.8906 148.5 123.8906 135.2812 Q123.8906 126 116.5781 120.3047 Q109.2656 114.6094 97.3125 114.6094 Q90 114.6094 81.4219 117.0703 Q72.8438 119.5312 62.7188 124.4531 L62.7188 107.1562 Q73.5469 103.2188 82.8984 101.25 Q92.25 99.2812 100.2656 99.2812 Q120.6562 99.2812 132.8906 108.5625 Q145.125 117.8438 145.125 133.0312 Q145.125 152.5781 98.5781 192.5156 Q90.7031 199.2656 86.3438 203.0625 Z\"/></svg></template>\n    <template id=\"♣3\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM121.7812 155.5312 Q134.7188 158.0625 141.8203 165.7266 Q148.9219 173.3906 148.9219 184.9219 Q148.9219 202.3594 135.5625 211.7812 Q122.2031 221.2031 97.3125 221.2031 Q89.2969 221.2031 80.5078 219.7266 Q71.7188 218.25 61.875 215.4375 L61.875 198.4219 Q69.1875 202.2188 77.5547 204.0469 Q85.9219 205.875 95.3438 205.875 Q110.6719 205.875 119.1094 200.3203 Q127.5469 194.7656 127.5469 184.9219 Q127.5469 174.5156 119.7422 169.1719 Q111.9375 163.8281 96.75 163.8281 L84.6562 163.8281 L84.6562 148.6406 L97.875 148.6406 Q111.0938 148.6406 117.9141 144.2109 Q124.7344 139.7812 124.7344 131.3438 Q124.7344 123.1875 117.7031 118.8984 Q110.6719 114.6094 97.3125 114.6094 Q91.6875 114.6094 84.5156 115.875 Q77.3438 117.1406 65.9531 120.375 L65.9531 104.2031 Q76.2188 101.8125 85.2188 100.5469 Q94.2188 99.2812 101.9531 99.2812 Q122.2031 99.2812 134.0859 107.5781 Q145.9688 115.875 145.9688 129.7969 Q145.9688 139.5 139.6406 146.25 Q133.3125 153 121.7812 155.5312 Z\"/></svg></template>\n    <template id=\"♣4\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM120.0938 118.6875 L76.6406 177.6094 L120.0938 177.6094 L120.0938 118.6875 ZM117 101.6719 L140.3438 101.6719 L140.3438 177.6094 L159.3281 177.6094 L159.3281 192.9375 L140.3438 192.9375 L140.3438 219.0938 L120.0938 219.0938 L120.0938 192.9375 L61.875 192.9375 L61.875 175.9219 L117 101.6719 Z\"/></svg></template>\n    <template id=\"♣5\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM67.5 101.6719 L139.2188 101.6719 L139.2188 115.0312 L84.2344 115.0312 L84.2344 143.7188 Q88.1719 142.4531 92.25 141.8906 Q96.1875 141.3281 100.125 141.3281 Q122.7656 141.3281 135.9844 152.1562 Q149.2031 162.8438 149.2031 181.2656 Q149.2031 200.25 135.5625 210.7969 Q122.0625 221.2031 97.3125 221.2031 Q88.875 221.2031 80.0156 219.9375 Q71.1562 218.6719 61.875 216.1406 L61.875 200.25 Q69.8906 204.0469 78.6094 206.0156 Q87.3281 207.8438 97.0312 207.8438 Q112.6406 207.8438 121.7812 200.6719 Q130.9219 193.5 130.9219 181.2656 Q130.9219 169.0312 121.7812 161.8594 Q112.6406 154.6875 97.0312 154.6875 Q89.7188 154.6875 82.4062 156.0938 Q75.0938 157.5 67.5 160.4531 L67.5 101.6719 Z\"/></svg></template>\n    <template id=\"♣6\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.1094 153.7031 Q97.7344 153.7031 90.5625 161.0156 Q83.3906 168.4688 83.3906 181.2656 Q83.3906 193.9219 90.5625 201.2344 Q97.7344 208.6875 110.1094 208.6875 Q122.3438 208.6875 129.5156 201.2344 Q136.6875 193.9219 136.6875 181.2656 Q136.6875 168.4688 129.5156 161.0156 Q122.3438 153.7031 110.1094 153.7031 ZM146.3906 103.9219 L146.3906 118.4062 Q139.5 115.5938 132.4688 114.1875 Q125.4375 112.6406 118.5469 112.6406 Q100.5469 112.6406 90.9844 123.1875 Q81.4219 133.875 80.0156 155.3906 Q85.3594 148.5 93.375 144.8438 Q101.5312 141.1875 111.0938 141.1875 Q131.4844 141.1875 143.2969 151.875 Q155.1094 162.7031 155.1094 181.2656 Q155.1094 199.125 142.7344 210.2344 Q130.5 221.2031 110.1094 221.2031 Q86.625 221.2031 74.25 205.5938 Q61.875 189.9844 61.875 160.1719 Q61.875 132.3281 77.0625 115.875 Q92.25 99.2812 117.8438 99.2812 Q124.7344 99.2812 131.7656 100.4062 Q138.7969 101.6719 146.3906 103.9219 Z\"/></svg></template>\n    <template id=\"♣7\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L148.6406 101.6719 L148.6406 108.4219 L99.7031 219.0938 L80.5781 219.0938 L126.7031 115.0312 L61.875 115.0312 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♣8\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM108.2812 163.125 Q95.2031 163.125 87.75 169.3125 Q80.2969 175.3594 80.2969 185.9062 Q80.2969 196.5938 87.75 202.6406 Q95.2031 208.6875 108.2812 208.6875 Q121.2188 208.6875 128.8125 202.5 Q136.2656 196.4531 136.2656 185.9062 Q136.2656 175.3594 128.8125 169.3125 Q121.3594 163.125 108.2812 163.125 ZM90 156.2344 Q78.1875 153.7031 71.7188 146.8125 Q65.1094 139.7812 65.1094 129.6562 Q65.1094 115.5938 76.6406 107.4375 Q88.1719 99.2812 108.2812 99.2812 Q128.3906 99.2812 139.9219 107.4375 Q151.3125 115.5938 151.3125 129.6562 Q151.3125 140.0625 144.8438 146.8125 Q138.2344 153.7031 126.5625 156.2344 Q139.2188 158.7656 147.0938 166.9219 Q154.5469 174.6562 154.5469 185.9062 Q154.5469 202.9219 142.5938 212.0625 Q130.5 221.2031 108.2812 221.2031 Q85.9219 221.2031 73.9688 212.0625 Q61.875 202.9219 61.875 185.9062 Q61.875 174.9375 69.3281 166.9219 Q76.9219 159.0469 90 156.2344 ZM83.25 131.2031 Q83.25 140.0625 89.8594 145.4062 Q96.3281 150.6094 108.2812 150.6094 Q119.6719 150.6094 126.5625 145.4062 Q133.3125 140.3438 133.3125 131.2031 Q133.3125 122.3438 126.5625 117 Q119.9531 111.7969 108.2812 111.7969 Q96.6094 111.7969 89.8594 117 Q83.25 122.0625 83.25 131.2031 Z\"/></svg></template>\n    <template id=\"♣9\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM70.5938 216.5625 L70.5938 202.0781 Q77.4844 204.8906 84.5156 206.4375 Q91.5469 207.8438 98.2969 207.8438 Q116.4375 207.8438 126 197.2969 Q135.4219 186.75 136.8281 165.0938 Q131.9062 171.7031 123.4688 175.5 Q115.4531 179.1562 105.75 179.1562 Q85.5 179.1562 73.6875 168.4688 Q61.875 157.7812 61.875 139.2188 Q61.875 121.0781 74.1094 110.25 Q86.4844 99.2812 106.875 99.2812 Q130.3594 99.2812 142.5938 114.8906 Q154.9688 130.5 154.9688 160.3125 Q154.9688 188.1562 139.9219 204.6094 Q124.7344 221.2031 99.1406 221.2031 Q92.25 221.2031 85.2188 220.0781 Q78.1875 218.8125 70.5938 216.5625 ZM106.875 166.7812 Q119.25 166.7812 126.4219 159.4688 Q133.5938 152.1562 133.5938 139.2188 Q133.5938 126.5625 126.4219 119.25 Q119.25 111.7969 106.875 111.7969 Q94.9219 111.7969 87.4688 119.25 Q80.1562 126.5625 80.1562 139.2188 Q80.1562 152.1562 87.4688 159.4688 Q94.6406 166.7812 106.875 166.7812 Z\"/></svg></template>\n    <template id=\"♣10\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM159.0469 111.7969 Q149.0625 111.7969 142.0312 123.8906 Q134.8594 135.9844 134.8594 160.1719 Q134.8594 184.5 142.0312 196.5938 Q149.0625 208.6875 159.0469 208.6875 Q169.0312 208.6875 176.0625 196.5938 Q183.2344 184.5 183.2344 160.1719 Q183.2344 135.9844 176.0625 123.8906 Q169.0312 111.7969 159.0469 111.7969 ZM159.0469 99.2812 Q177.4688 99.2812 189.4219 114.8906 Q201.375 130.5 201.375 160.1719 Q201.375 189.9844 189.4219 205.5938 Q177.4688 221.2031 159.0469 221.2031 Q136.2656 221.2031 126.4219 205.5938 Q116.5781 189.9844 116.5781 160.1719 Q116.5781 130.5 126.4219 114.8906 Q136.2656 99.2812 159.0469 99.2812 ZM80.5781 219.0938 L80.5781 117.7031 L61.875 123.4688 L61.875 107.1562 L81.5625 101.6719 L100.8281 101.6719 L100.8281 219.0938 L80.5781 219.0938 Z\"/></svg></template>\n    <template id=\"♣J\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM89.1562 101.6719 L107.0156 101.6719 L107.0156 178.7344 Q107.0156 199.6875 97.875 209.5312 Q88.875 219.2344 68.7656 219.2344 L61.875 219.2344 L61.875 205.7344 L67.5 205.7344 Q79.3125 205.7344 84.2344 199.8281 Q89.1562 193.9219 89.1562 178.7344 L89.1562 101.6719 Z\"/></svg></template>\n    <template id=\"♣Q\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM107.2969 221.0625 Q106.7344 221.0625 105.5391 221.1328 Q104.3438 221.2031 103.6406 221.2031 Q81.4219 221.2031 70.5234 206.0859 Q59.625 190.9688 59.625 160.3125 Q59.625 129.5156 70.5938 114.3984 Q81.5625 99.2812 103.7812 99.2812 Q126.1406 99.2812 137.1094 114.3984 Q148.0781 129.5156 148.0781 160.3125 Q148.0781 183.5156 142.0312 197.6484 Q135.9844 211.7812 123.6094 217.4062 L141.3281 232.3125 L127.9688 240.1875 L107.2969 221.0625 ZM129.375 160.3125 Q129.375 134.4375 123.3984 123.3281 Q117.4219 112.2188 103.7812 112.2188 Q90.2812 112.2188 84.3047 123.3281 Q78.3281 134.4375 78.3281 160.3125 Q78.3281 186.1875 84.3047 197.2969 Q90.2812 208.4062 103.7812 208.4062 Q117.4219 208.4062 123.3984 197.2969 Q129.375 186.1875 129.375 160.3125 Z\"/></svg></template>\n    <template id=\"♣K\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L79.7344 101.6719 L79.7344 151.3125 L130.6406 101.6719 L153.7031 101.6719 L96.4688 156.5156 L158.3438 219.2344 L134.8594 219.2344 L79.7344 162.5625 L79.7344 219.2344 L61.875 219.2344 L61.875 101.6719 Z\"/></svg></template>\n\n    <table style=\"border-width:1px\">\n        <tr width=\"100%\" height=\"10px\" style=\"visibility:visible\"}>\n            <td width=\"50px\"><playing-card><span style=\"color:blue\">&block;</span></playing-card</td>\n        </tr>\n        <tr width=\"100%\">\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;A</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;2</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;3</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;4</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;5</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;6</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;7</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;8</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;9</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;10</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;J</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;Q</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;K</span></playing-card></td>\n        </tr>\n        <tr>\n            <td><playing-card><span style=\"color:red\">&hearts;A</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;2</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;3</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;4</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;5</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;6</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;7</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;8</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;9</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;10</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;J</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;Q</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;K</span></playing-card></td>\n        </tr>\n        <tr>\n            <td><playing-card><span style=\"color:red\">&diams;A</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;2</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;3</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;4</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;5</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;6</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;7</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;8</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;9</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;10</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;J</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;Q</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;K</span></playing-card></td>\n        </tr>\n        <tr>\n            <td><playing-card><span style=\"color:black\">&clubs;A</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;2</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;3</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;4</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;5</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;6</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;7</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;8</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;9</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;10</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;J</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;Q</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;K</span></playing-card></td>\n        </tr>\n    </table>\n</div>\n"

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

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

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = "<span class=\"connect\">\n<p>This is the connect page.</p>\n<ul>\n<li>pending invitations</>\n<li>list of players</li>\n<li>connected players</li>\n\n<h1>Hello world gun app</h1>\n<p>Open your web console</p>\n\n<!-- Loads gun -->\n<script src='http://localhost:8080/gun.js'></script>\n\n<!-- pull gun address from\n<script src='http://localhost:8080/gun.js'></script>\n\n<script>\n(function () {\n\n    // Sync this gun instance with the server.\n    var gun = Gun([\n        'http://localhost:8080/gun',\n    ]);\n\n    // Reads key 'data'.\n    var data = gun.get('data');\n\n    // Exposed so the JS console can see it.\n    window.data = data;\n\n    console.log('Gun reference exposed as %cwindow.data', 'color: red');\n\n    // Writes a value to the key 'data'.\n    data.put({ message: 'Hello world!' });\n\n    // Listen for real-time change events.\n    data.path('message').on(function (message) {\n        console.log('Message:', message);\n    });\n\n}())\n</script>\n</span>\n"

/***/ }
/******/ ]);