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
/******/ 	return __webpack_require__(__webpack_require__.s = 21);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.determineContentType = determineContentType;

var _determineKeyType = __webpack_require__(4);

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
/* 1 */
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.decryptPGPMessage = decryptPGPMessage;

var _getFromStorage = __webpack_require__(1);

var _decryptPGPMessageWithKey = __webpack_require__(3);

var _determineContentType = __webpack_require__(0);

var PGPPRIVKEY = 'PGPPrivkey';

function decryptPGPMessage(openpgp) {
    //  usage: decryptPGPMessage(openpgp)(localStorage)(password)(PGPMessageArmor).then(result => result)
    return !openpgp ? Promise.reject('Error: missing openpgp') : function (localStorage) {
        return !localStorage ? Promise.reject('Error: missing localStorage') : function (password) {
            return !password ? Promise.reject("Error: missing password") : function (PGPMessageArmor) {
                return !PGPMessageArmor ? Promise.reject('Error: missing PGPMessageArmor') : new Promise(function (resolve, reject) {
                    console.log(PGPMessageArmor);
                    (0, _getFromStorage.getFromStorage)(localStorage)().then(function (storeArr) {
                        try {
                            return storeArr.filter(function (storageItem) {
                                return !storageItem ? false : true;
                            }).map(function (storageItem) {
                                return (0, _determineContentType.determineContentType)(storageItem)(openpgp).then(function (contentType) {
                                    if (contentType === PGPPRIVKEY) {
                                        (0, _decryptPGPMessageWithKey.decryptPGPMessageWithKey)(openpgp)(password)(storageItem)(PGPMessageArmor).then(function (decrypted) {
                                            console.log('decrypted ' + decrypted);
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

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.decryptPGPMessageWithKey = decryptPGPMessageWithKey;
function decryptPGPMessageWithKey(openpgp) {
    console.log('decryptPGPMessageWithKey');
    //  usage: decryptPGPMessageWithKey(openpgp)(password)(privateKeyArmor)(PGPMessageArmor).then(result => result)
    return !openpgp ? Promise.reject('Error: missing openpgp') : function (password) {
        return !password ? Promise.reject('Error: missing password') : function (privateKeyArmor) {
            console.log('password ' + password);
            console.log('privateKeyArmor ' + privateKeyArmor);
            var privateKeys = openpgp.key.readArmored(privateKeyArmor);
            var privateKey = privateKeys.keys[0];
            return !privateKey ? Promise.reject(new Error('missing privateKeyArmor')) : function (PGPMessageArmor) {
                return !PGPMessageArmor ? Promise.reject(new Error('missing PGPMessageArmor')) : new Promise(function (resolve, reject) {
                    try {
                        var message = openpgp.message.readArmored(PGPMessageArmor);
                        if (!openpgp.decrypt) {
                            console.log('openpgp.decryptMessage');
                            console.log(privateKey.users);
                            openpgp.decryptMessage(privateKey, message).then(function (result) {
                                console.log(result);
                                resolve(result);
                            });
                        } else {
                            console.log('openpgp.decrypt');
                            openpgp.decrypt({ 'message': message, 'privateKey': privateKey }).then(function (result) {
                                console.log(result.data);
                                resolve(result.data);
                            });
                        };
                    } catch (err) {
                        //resolve();
                        reject(err);
                    }
                });
            };
        };
    };
}

/***/ }),
/* 4 */
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
/* 5 */
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

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.encryptCleartextMulti = encryptCleartextMulti;

var _getFromStorage = __webpack_require__(1);

var _determineContentType = __webpack_require__(0);

var _encryptClearText = __webpack_require__(5);

var PGPPUBKEY = 'PGPPubkey';

function encryptCleartextMulti(content) {
    // usage: encryptCleartextMulti(content)(openpgp)(localStorage).then(result => result)
    return !content ? Promise.reject('Error: missing content') : function (openpgp) {
        return !openpgp ? Promise.reject('Error: missing openpgp') : function (localStorage) {
            return !localStorage ? Promise.reject('Error: missing localStorage') : new Promise(function (resolve, reject) {
                try {
                    (0, _getFromStorage.getFromStorage)(localStorage)().then(function (storageArr) {
                        //let publicKeyArr = [];
                        var encryptedMsgs = [];
                        var i = storageArr.length;
                        var idx = 0;
                        storageArr.map(function (storageItem) {
                            i--;
                            return storageItem;
                        }).filter(function (storageItem) {
                            return !storageItem ? false : true;
                        }).map(function (storageItem) {
                            (0, _determineContentType.determineContentType)(storageItem)(openpgp).then(function (contentType) {
                                if (contentType === PGPPUBKEY) {
                                    (0, _encryptClearText.encryptClearText)(openpgp)(storageItem)(content).then(function (encrypted) {
                                        encryptedMsgs[idx] = encrypted;
                                        idx++;
                                        if (i === 0) {
                                            resolve(encryptedMsgs);
                                        }
                                    });
                                }
                            });
                        });
                    });
                } catch (err) {
                    reject(new Error(err));
                }
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.savePGPPubkey = savePGPPubkey;

var _getFromStorage = __webpack_require__(1);

var _determineContentType = __webpack_require__(0);

function savePGPPubkey(PGPkeyArmor) {
    // save public key to storage only if it doesn't overwrite a private key
    // usage: savePGPPubkey(content)(openpgp)(localStorage).then(result => result)
    return !PGPkeyArmor ? Promise.reject('Error: missing PGPkeyArmor') : function (openpgp) {
        return !openpgp ? Promise.reject('Error: missing openpgp') : function (localStorage) {
            return !localStorage ? Promise.reject('Error: missing localStorage') : new Promise(function (resolve, reject) {
                var PGPkey = openpgp.key.readArmored(PGPkeyArmor);
                (0, _getFromStorage.getFromStorage)(localStorage)(PGPkey.keys[0].users[0].userId.userid).then(function (existingKey) {
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
/* 9 */
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19), __webpack_require__(20)(module)))

/***/ }),
/* 10 */
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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// import {handlePGPPubkey} from '../../src/lib/util.js';
// import {handlePGPPrivkey} from '../../src/lib/util.js';
// import {handlePGPMessage} from '../../src/lib/util.js';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.handlePost = handlePost;

var _encryptCleartextMulti = __webpack_require__(6);

var _decryptPGPMessage = __webpack_require__(2);

var _determineContentType = __webpack_require__(0);

var _savePGPPubkey = __webpack_require__(8);

var _savePGPPrivkey = __webpack_require__(7);

// import {getFromStorage} from './getFromStorage';

var PGPPUBKEY = 'PGPPubkey';
var CLEARTEXT = 'cleartext';
var PGPPRIVKEY = 'PGPPrivkey';
var PGPMESSAGE = 'PGPMessage';

function handlePost(content) {
    return !content ? Promise.resolve('') : function (openpgp) {
        return !openpgp ? Promise.reject('Error: missing openpgp') : function (localStorage) {
            return function (password) {
                return new Promise(function (resolve, reject) {
                    (0, _determineContentType.determineContentType)(content)(openpgp).then(function (contentType) {
                        if (contentType === CLEARTEXT) {
                            console.log(CLEARTEXT);
                            // encrypt
                            return (0, _encryptCleartextMulti.encryptCleartextMulti)(content)(openpgp)(localStorage).then(function (result) {
                                return result;
                            });
                        }
                        if (contentType === PGPPRIVKEY) {
                            console.log(PGPPRIVKEY);
                            // save and broadcast converted public key
                            return (0, _savePGPPrivkey.savePGPPrivkey)(content)(openpgp)(localStorage)
                            //return broadcastMessage(content)(openpgp)(localStorage)
                            .then(function (result) {
                                return result;
                            });
                        }
                        if (contentType === PGPPUBKEY) {
                            console.log(PGPPUBKEY);
                            // save to localStorage
                            return (0, _savePGPPubkey.savePGPPubkey)(content)(openpgp)(localStorage).then(function (result) {
                                return result;
                            });
                        }
                        if (contentType === PGPMESSAGE) {
                            console.log(PGPMESSAGE);
                            // get PGPKeys, decrypt,  and return
                            return (0, _decryptPGPMessage.decryptPGPMessage)(openpgp)(localStorage)(password)(content).then(function (result) {
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

var connectPartial = __webpack_require__(22);

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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var contactPartial = __webpack_require__(23);

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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var freshDeckPartial = __webpack_require__(24);

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
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var indexPartial = __webpack_require__(25);

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

var clientPubkeyFormPartial = __webpack_require__(26);

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
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var roadmapPartial = __webpack_require__(27);

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
/* 18 */
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
/* 19 */
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
/* 20 */
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
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//import 'webcomponents.js/webcomponents.js';
//uncomment line above to double app size and support ios.

var _handlePost = __webpack_require__(11);

var _determineContentType = __webpack_require__(0);

var _determineKeyType = __webpack_require__(4);

var _encryptCleartextMulti = __webpack_require__(6);

var _encryptClearText = __webpack_require__(5);

var _decryptPGPMessage = __webpack_require__(2);

var _savePGPPubkey = __webpack_require__(8);

var _savePGPPrivkey = __webpack_require__(7);

var _getFromStorage = __webpack_require__(1);

var _decryptPGPMessageWithKey = __webpack_require__(3);

var _rebelRouter = __webpack_require__(10);

var _gun = __webpack_require__(9);

var _index = __webpack_require__(15);

var _roadmap = __webpack_require__(17);

var _contact = __webpack_require__(13);

var _message = __webpack_require__(16);

var _deck = __webpack_require__(14);

var _connect = __webpack_require__(12);

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

// rebel router


// Gundb public facing DAG database  (for messages to and from the enemy)


// pages (most of this should be in views/partials to affect isormorphism)

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = "<span class=\"connect\">\n<p>This is the connect page.</p>\n<ul>\n<li>pending invitations</>\n<li>list of players</li>\n<li>connected players</li>\n\n<h1>Hello world gun app</h1>\n<p>Open your web console</p>\n</span>\n"

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = "<span class=\"contact\">\n    Cole Albon<br>\n    <a href=\"tel:+14156721648\">(415) 672-1648</a><br>\n    <a href=\"mailto:cole.albon@gmail.com\">cole.albon@gmail.com</a><br>\n    <a href=\"https://github.com/colealbon\">https://github.com/colealbon</a><br>\n    <a href=\"https://www.linkedin.com/in/cole-albon-5934634\">\n        <span id=\"linkedinaddress\" class=\"linkedinaddress\">https://www.linkedin.com/in/cole-albon-5934634</span>\n    </a><br>\n</span>\n"

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = "    <div id=\"deck\" class=\"deck\">\n    <template id=\"█\"><svg viewBox=\"24 62 247 343\"><path d=\"M61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM70.3125 362.25 L70.3125 110.1094 L224.2969 110.1094 L224.2969 362.25 L70.3125 362.25 Z\"/></svg></template>\n    <template id=\"♠A\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.6719 115.7344 L91.8281 175.7812 L129.5156 175.7812 L110.6719 115.7344 ZM99.9844 101.6719 L121.6406 101.6719 L162.1406 219.2344 L143.5781 219.2344 L134.0156 188.5781 L87.6094 188.5781 L78.0469 219.2344 L59.4844 219.2344 L99.9844 101.6719 Z\"/></svg></template>\n    <template id=\"♠2\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM86.3438 203.0625 L145.9688 203.0625 L145.9688 219.0938 L61.875 219.0938 L61.875 203.625 Q66.6562 199.2656 75.5156 191.3906 Q123.8906 148.5 123.8906 135.2812 Q123.8906 126 116.5781 120.3047 Q109.2656 114.6094 97.3125 114.6094 Q90 114.6094 81.4219 117.0703 Q72.8438 119.5312 62.7188 124.4531 L62.7188 107.1562 Q73.5469 103.2188 82.8984 101.25 Q92.25 99.2812 100.2656 99.2812 Q120.6562 99.2812 132.8906 108.5625 Q145.125 117.8438 145.125 133.0312 Q145.125 152.5781 98.5781 192.5156 Q90.7031 199.2656 86.3438 203.0625 Z\"/></svg></template>\n    <template id=\"♠3\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM121.7812 155.5312 Q134.7188 158.0625 141.8203 165.7266 Q148.9219 173.3906 148.9219 184.9219 Q148.9219 202.3594 135.5625 211.7812 Q122.2031 221.2031 97.3125 221.2031 Q89.2969 221.2031 80.5078 219.7266 Q71.7188 218.25 61.875 215.4375 L61.875 198.4219 Q69.1875 202.2188 77.5547 204.0469 Q85.9219 205.875 95.3438 205.875 Q110.6719 205.875 119.1094 200.3203 Q127.5469 194.7656 127.5469 184.9219 Q127.5469 174.5156 119.7422 169.1719 Q111.9375 163.8281 96.75 163.8281 L84.6562 163.8281 L84.6562 148.6406 L97.875 148.6406 Q111.0938 148.6406 117.9141 144.2109 Q124.7344 139.7812 124.7344 131.3438 Q124.7344 123.1875 117.7031 118.8984 Q110.6719 114.6094 97.3125 114.6094 Q91.6875 114.6094 84.5156 115.875 Q77.3438 117.1406 65.9531 120.375 L65.9531 104.2031 Q76.2188 101.8125 85.2188 100.5469 Q94.2188 99.2812 101.9531 99.2812 Q122.2031 99.2812 134.0859 107.5781 Q145.9688 115.875 145.9688 129.7969 Q145.9688 139.5 139.6406 146.25 Q133.3125 153 121.7812 155.5312 Z\"/></svg></template>\n    <template id=\"♠4\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM120.0938 118.6875 L76.6406 177.6094 L120.0938 177.6094 L120.0938 118.6875 ZM117 101.6719 L140.3438 101.6719 L140.3438 177.6094 L159.3281 177.6094 L159.3281 192.9375 L140.3438 192.9375 L140.3438 219.0938 L120.0938 219.0938 L120.0938 192.9375 L61.875 192.9375 L61.875 175.9219 L117 101.6719 Z\"/></svg></template>\n    <template id=\"♠5\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM67.5 101.6719 L139.2188 101.6719 L139.2188 115.0312 L84.2344 115.0312 L84.2344 143.7188 Q88.1719 142.4531 92.25 141.8906 Q96.1875 141.3281 100.125 141.3281 Q122.7656 141.3281 135.9844 152.1562 Q149.2031 162.8438 149.2031 181.2656 Q149.2031 200.25 135.5625 210.7969 Q122.0625 221.2031 97.3125 221.2031 Q88.875 221.2031 80.0156 219.9375 Q71.1562 218.6719 61.875 216.1406 L61.875 200.25 Q69.8906 204.0469 78.6094 206.0156 Q87.3281 207.8438 97.0312 207.8438 Q112.6406 207.8438 121.7812 200.6719 Q130.9219 193.5 130.9219 181.2656 Q130.9219 169.0312 121.7812 161.8594 Q112.6406 154.6875 97.0312 154.6875 Q89.7188 154.6875 82.4062 156.0938 Q75.0938 157.5 67.5 160.4531 L67.5 101.6719 Z\"/></svg></template>\n    <template id=\"♠6\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.1094 153.7031 Q97.7344 153.7031 90.5625 161.0156 Q83.3906 168.4688 83.3906 181.2656 Q83.3906 193.9219 90.5625 201.2344 Q97.7344 208.6875 110.1094 208.6875 Q122.3438 208.6875 129.5156 201.2344 Q136.6875 193.9219 136.6875 181.2656 Q136.6875 168.4688 129.5156 161.0156 Q122.3438 153.7031 110.1094 153.7031 ZM146.3906 103.9219 L146.3906 118.4062 Q139.5 115.5938 132.4688 114.1875 Q125.4375 112.6406 118.5469 112.6406 Q100.5469 112.6406 90.9844 123.1875 Q81.4219 133.875 80.0156 155.3906 Q85.3594 148.5 93.375 144.8438 Q101.5312 141.1875 111.0938 141.1875 Q131.4844 141.1875 143.2969 151.875 Q155.1094 162.7031 155.1094 181.2656 Q155.1094 199.125 142.7344 210.2344 Q130.5 221.2031 110.1094 221.2031 Q86.625 221.2031 74.25 205.5938 Q61.875 189.9844 61.875 160.1719 Q61.875 132.3281 77.0625 115.875 Q92.25 99.2812 117.8438 99.2812 Q124.7344 99.2812 131.7656 100.4062 Q138.7969 101.6719 146.3906 103.9219 Z\"/></svg></template>\n    <template id=\"♠7\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L148.6406 101.6719 L148.6406 108.4219 L99.7031 219.0938 L80.5781 219.0938 L126.7031 115.0312 L61.875 115.0312 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♠8\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM108.2812 163.125 Q95.2031 163.125 87.75 169.3125 Q80.2969 175.3594 80.2969 185.9062 Q80.2969 196.5938 87.75 202.6406 Q95.2031 208.6875 108.2812 208.6875 Q121.2188 208.6875 128.8125 202.5 Q136.2656 196.4531 136.2656 185.9062 Q136.2656 175.3594 128.8125 169.3125 Q121.3594 163.125 108.2812 163.125 ZM90 156.2344 Q78.1875 153.7031 71.7188 146.8125 Q65.1094 139.7812 65.1094 129.6562 Q65.1094 115.5938 76.6406 107.4375 Q88.1719 99.2812 108.2812 99.2812 Q128.3906 99.2812 139.9219 107.4375 Q151.3125 115.5938 151.3125 129.6562 Q151.3125 140.0625 144.8438 146.8125 Q138.2344 153.7031 126.5625 156.2344 Q139.2188 158.7656 147.0938 166.9219 Q154.5469 174.6562 154.5469 185.9062 Q154.5469 202.9219 142.5938 212.0625 Q130.5 221.2031 108.2812 221.2031 Q85.9219 221.2031 73.9688 212.0625 Q61.875 202.9219 61.875 185.9062 Q61.875 174.9375 69.3281 166.9219 Q76.9219 159.0469 90 156.2344 ZM83.25 131.2031 Q83.25 140.0625 89.8594 145.4062 Q96.3281 150.6094 108.2812 150.6094 Q119.6719 150.6094 126.5625 145.4062 Q133.3125 140.3438 133.3125 131.2031 Q133.3125 122.3438 126.5625 117 Q119.9531 111.7969 108.2812 111.7969 Q96.6094 111.7969 89.8594 117 Q83.25 122.0625 83.25 131.2031 Z\"/></svg></template>\n    <template id=\"♠9\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM70.5938 216.5625 L70.5938 202.0781 Q77.4844 204.8906 84.5156 206.4375 Q91.5469 207.8438 98.2969 207.8438 Q116.4375 207.8438 126 197.2969 Q135.4219 186.75 136.8281 165.0938 Q131.9062 171.7031 123.4688 175.5 Q115.4531 179.1562 105.75 179.1562 Q85.5 179.1562 73.6875 168.4688 Q61.875 157.7812 61.875 139.2188 Q61.875 121.0781 74.1094 110.25 Q86.4844 99.2812 106.875 99.2812 Q130.3594 99.2812 142.5938 114.8906 Q154.9688 130.5 154.9688 160.3125 Q154.9688 188.1562 139.9219 204.6094 Q124.7344 221.2031 99.1406 221.2031 Q92.25 221.2031 85.2188 220.0781 Q78.1875 218.8125 70.5938 216.5625 ZM106.875 166.7812 Q119.25 166.7812 126.4219 159.4688 Q133.5938 152.1562 133.5938 139.2188 Q133.5938 126.5625 126.4219 119.25 Q119.25 111.7969 106.875 111.7969 Q94.9219 111.7969 87.4688 119.25 Q80.1562 126.5625 80.1562 139.2188 Q80.1562 152.1562 87.4688 159.4688 Q94.6406 166.7812 106.875 166.7812 Z\"/></svg></template>\n    <template id=\"♠10\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM159.0469 111.7969 Q149.0625 111.7969 142.0312 123.8906 Q134.8594 135.9844 134.8594 160.1719 Q134.8594 184.5 142.0312 196.5938 Q149.0625 208.6875 159.0469 208.6875 Q169.0312 208.6875 176.0625 196.5938 Q183.2344 184.5 183.2344 160.1719 Q183.2344 135.9844 176.0625 123.8906 Q169.0312 111.7969 159.0469 111.7969 ZM159.0469 99.2812 Q177.4688 99.2812 189.4219 114.8906 Q201.375 130.5 201.375 160.1719 Q201.375 189.9844 189.4219 205.5938 Q177.4688 221.2031 159.0469 221.2031 Q136.2656 221.2031 126.4219 205.5938 Q116.5781 189.9844 116.5781 160.1719 Q116.5781 130.5 126.4219 114.8906 Q136.2656 99.2812 159.0469 99.2812 ZM80.5781 219.0938 L80.5781 117.7031 L61.875 123.4688 L61.875 107.1562 L81.5625 101.6719 L100.8281 101.6719 L100.8281 219.0938 L80.5781 219.0938 Z\"/></svg></template>\n    <template id=\"♠J\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM89.1562 101.6719 L107.0156 101.6719 L107.0156 178.7344 Q107.0156 199.6875 97.875 209.5312 Q88.875 219.2344 68.7656 219.2344 L61.875 219.2344 L61.875 205.7344 L67.5 205.7344 Q79.3125 205.7344 84.2344 199.8281 Q89.1562 193.9219 89.1562 178.7344 L89.1562 101.6719 Z\"/></svg></template>\n    <template id=\"♠Q\"><svg viewBox=\"24 62 247 343\"><path d=\"M107.2969 221.0625 Q106.7344 221.0625 105.5391 221.1328 Q104.3438 221.2031 103.6406 221.2031 Q81.4219 221.2031 70.5234 206.0859 Q59.625 190.9688 59.625 160.3125 Q59.625 129.5156 70.5938 114.3984 Q81.5625 99.2812 103.7812 99.2812 Q126.1406 99.2812 137.1094 114.3984 Q148.0781 129.5156 148.0781 160.3125 Q148.0781 183.5156 142.0312 197.6484 Q135.9844 211.7812 123.6094 217.4062 L141.3281 232.3125 L127.9688 240.1875 L107.2969 221.0625 ZM129.375 160.3125 Q129.375 134.4375 123.3984 123.3281 Q117.4219 112.2188 103.7812 112.2188 Q90.2812 112.2188 84.3047 123.3281 Q78.3281 134.4375 78.3281 160.3125 Q78.3281 186.1875 84.3047 197.2969 Q90.2812 208.4062 103.7812 208.4062 Q117.4219 208.4062 123.3984 197.2969 Q129.375 186.1875 129.375 160.3125 ZM174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 Z\"/></svg></template>\n    <template id=\"♠K\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L79.7344 101.6719 L79.7344 151.3125 L130.6406 101.6719 L153.7031 101.6719 L96.4688 156.5156 L158.3438 219.2344 L134.8594 219.2344 L79.7344 162.5625 L79.7344 219.2344 L61.875 219.2344 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♥A\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.6719 115.7344 L91.8281 175.7812 L129.5156 175.7812 L110.6719 115.7344 ZM99.9844 101.6719 L121.6406 101.6719 L162.1406 219.2344 L143.5781 219.2344 L134.0156 188.5781 L87.6094 188.5781 L78.0469 219.2344 L59.4844 219.2344 L99.9844 101.6719 Z\"/></svg></template>\n    <template id=\"♥2\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM86.3438 203.0625 L145.9688 203.0625 L145.9688 219.0938 L61.875 219.0938 L61.875 203.625 Q66.6562 199.2656 75.5156 191.3906 Q123.8906 148.5 123.8906 135.2812 Q123.8906 126 116.5781 120.3047 Q109.2656 114.6094 97.3125 114.6094 Q90 114.6094 81.4219 117.0703 Q72.8438 119.5312 62.7188 124.4531 L62.7188 107.1562 Q73.5469 103.2188 82.8984 101.25 Q92.25 99.2812 100.2656 99.2812 Q120.6562 99.2812 132.8906 108.5625 Q145.125 117.8438 145.125 133.0312 Q145.125 152.5781 98.5781 192.5156 Q90.7031 199.2656 86.3438 203.0625 Z\"/></svg></template>\n    <template id=\"♥3\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM121.7812 155.5312 Q134.7188 158.0625 141.8203 165.7266 Q148.9219 173.3906 148.9219 184.9219 Q148.9219 202.3594 135.5625 211.7812 Q122.2031 221.2031 97.3125 221.2031 Q89.2969 221.2031 80.5078 219.7266 Q71.7188 218.25 61.875 215.4375 L61.875 198.4219 Q69.1875 202.2188 77.5547 204.0469 Q85.9219 205.875 95.3438 205.875 Q110.6719 205.875 119.1094 200.3203 Q127.5469 194.7656 127.5469 184.9219 Q127.5469 174.5156 119.7422 169.1719 Q111.9375 163.8281 96.75 163.8281 L84.6562 163.8281 L84.6562 148.6406 L97.875 148.6406 Q111.0938 148.6406 117.9141 144.2109 Q124.7344 139.7812 124.7344 131.3438 Q124.7344 123.1875 117.7031 118.8984 Q110.6719 114.6094 97.3125 114.6094 Q91.6875 114.6094 84.5156 115.875 Q77.3438 117.1406 65.9531 120.375 L65.9531 104.2031 Q76.2188 101.8125 85.2188 100.5469 Q94.2188 99.2812 101.9531 99.2812 Q122.2031 99.2812 134.0859 107.5781 Q145.9688 115.875 145.9688 129.7969 Q145.9688 139.5 139.6406 146.25 Q133.3125 153 121.7812 155.5312 Z\"/></svg></template>\n    <template id=\"♥4\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM120.0938 118.6875 L76.6406 177.6094 L120.0938 177.6094 L120.0938 118.6875 ZM117 101.6719 L140.3438 101.6719 L140.3438 177.6094 L159.3281 177.6094 L159.3281 192.9375 L140.3438 192.9375 L140.3438 219.0938 L120.0938 219.0938 L120.0938 192.9375 L61.875 192.9375 L61.875 175.9219 L117 101.6719 Z\"/></svg></template>\n    <template id=\"♥5\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM67.5 101.6719 L139.2188 101.6719 L139.2188 115.0312 L84.2344 115.0312 L84.2344 143.7188 Q88.1719 142.4531 92.25 141.8906 Q96.1875 141.3281 100.125 141.3281 Q122.7656 141.3281 135.9844 152.1562 Q149.2031 162.8438 149.2031 181.2656 Q149.2031 200.25 135.5625 210.7969 Q122.0625 221.2031 97.3125 221.2031 Q88.875 221.2031 80.0156 219.9375 Q71.1562 218.6719 61.875 216.1406 L61.875 200.25 Q69.8906 204.0469 78.6094 206.0156 Q87.3281 207.8438 97.0312 207.8438 Q112.6406 207.8438 121.7812 200.6719 Q130.9219 193.5 130.9219 181.2656 Q130.9219 169.0312 121.7812 161.8594 Q112.6406 154.6875 97.0312 154.6875 Q89.7188 154.6875 82.4062 156.0938 Q75.0938 157.5 67.5 160.4531 L67.5 101.6719 Z\"/></svg></template>\n    <template id=\"♥6\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.1094 153.7031 Q97.7344 153.7031 90.5625 161.0156 Q83.3906 168.4688 83.3906 181.2656 Q83.3906 193.9219 90.5625 201.2344 Q97.7344 208.6875 110.1094 208.6875 Q122.3438 208.6875 129.5156 201.2344 Q136.6875 193.9219 136.6875 181.2656 Q136.6875 168.4688 129.5156 161.0156 Q122.3438 153.7031 110.1094 153.7031 ZM146.3906 103.9219 L146.3906 118.4062 Q139.5 115.5938 132.4688 114.1875 Q125.4375 112.6406 118.5469 112.6406 Q100.5469 112.6406 90.9844 123.1875 Q81.4219 133.875 80.0156 155.3906 Q85.3594 148.5 93.375 144.8438 Q101.5312 141.1875 111.0938 141.1875 Q131.4844 141.1875 143.2969 151.875 Q155.1094 162.7031 155.1094 181.2656 Q155.1094 199.125 142.7344 210.2344 Q130.5 221.2031 110.1094 221.2031 Q86.625 221.2031 74.25 205.5938 Q61.875 189.9844 61.875 160.1719 Q61.875 132.3281 77.0625 115.875 Q92.25 99.2812 117.8438 99.2812 Q124.7344 99.2812 131.7656 100.4062 Q138.7969 101.6719 146.3906 103.9219 Z\"/></svg></template>\n    <template id=\"♥7\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L148.6406 101.6719 L148.6406 108.4219 L99.7031 219.0938 L80.5781 219.0938 L126.7031 115.0312 L61.875 115.0312 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♥8\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM108.2812 163.125 Q95.2031 163.125 87.75 169.3125 Q80.2969 175.3594 80.2969 185.9062 Q80.2969 196.5938 87.75 202.6406 Q95.2031 208.6875 108.2812 208.6875 Q121.2188 208.6875 128.8125 202.5 Q136.2656 196.4531 136.2656 185.9062 Q136.2656 175.3594 128.8125 169.3125 Q121.3594 163.125 108.2812 163.125 ZM90 156.2344 Q78.1875 153.7031 71.7188 146.8125 Q65.1094 139.7812 65.1094 129.6562 Q65.1094 115.5938 76.6406 107.4375 Q88.1719 99.2812 108.2812 99.2812 Q128.3906 99.2812 139.9219 107.4375 Q151.3125 115.5938 151.3125 129.6562 Q151.3125 140.0625 144.8438 146.8125 Q138.2344 153.7031 126.5625 156.2344 Q139.2188 158.7656 147.0938 166.9219 Q154.5469 174.6562 154.5469 185.9062 Q154.5469 202.9219 142.5938 212.0625 Q130.5 221.2031 108.2812 221.2031 Q85.9219 221.2031 73.9688 212.0625 Q61.875 202.9219 61.875 185.9062 Q61.875 174.9375 69.3281 166.9219 Q76.9219 159.0469 90 156.2344 ZM83.25 131.2031 Q83.25 140.0625 89.8594 145.4062 Q96.3281 150.6094 108.2812 150.6094 Q119.6719 150.6094 126.5625 145.4062 Q133.3125 140.3438 133.3125 131.2031 Q133.3125 122.3438 126.5625 117 Q119.9531 111.7969 108.2812 111.7969 Q96.6094 111.7969 89.8594 117 Q83.25 122.0625 83.25 131.2031 Z\"/></svg></template>\n    <template id=\"♥9\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM70.5938 216.5625 L70.5938 202.0781 Q77.4844 204.8906 84.5156 206.4375 Q91.5469 207.8438 98.2969 207.8438 Q116.4375 207.8438 126 197.2969 Q135.4219 186.75 136.8281 165.0938 Q131.9062 171.7031 123.4688 175.5 Q115.4531 179.1562 105.75 179.1562 Q85.5 179.1562 73.6875 168.4688 Q61.875 157.7812 61.875 139.2188 Q61.875 121.0781 74.1094 110.25 Q86.4844 99.2812 106.875 99.2812 Q130.3594 99.2812 142.5938 114.8906 Q154.9688 130.5 154.9688 160.3125 Q154.9688 188.1562 139.9219 204.6094 Q124.7344 221.2031 99.1406 221.2031 Q92.25 221.2031 85.2188 220.0781 Q78.1875 218.8125 70.5938 216.5625 ZM106.875 166.7812 Q119.25 166.7812 126.4219 159.4688 Q133.5938 152.1562 133.5938 139.2188 Q133.5938 126.5625 126.4219 119.25 Q119.25 111.7969 106.875 111.7969 Q94.9219 111.7969 87.4688 119.25 Q80.1562 126.5625 80.1562 139.2188 Q80.1562 152.1562 87.4688 159.4688 Q94.6406 166.7812 106.875 166.7812 Z\"/></svg></template>\n    <template id=\"♥10\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM159.0469 111.7969 Q149.0625 111.7969 142.0312 123.8906 Q134.8594 135.9844 134.8594 160.1719 Q134.8594 184.5 142.0312 196.5938 Q149.0625 208.6875 159.0469 208.6875 Q169.0312 208.6875 176.0625 196.5938 Q183.2344 184.5 183.2344 160.1719 Q183.2344 135.9844 176.0625 123.8906 Q169.0312 111.7969 159.0469 111.7969 ZM159.0469 99.2812 Q177.4688 99.2812 189.4219 114.8906 Q201.375 130.5 201.375 160.1719 Q201.375 189.9844 189.4219 205.5938 Q177.4688 221.2031 159.0469 221.2031 Q136.2656 221.2031 126.4219 205.5938 Q116.5781 189.9844 116.5781 160.1719 Q116.5781 130.5 126.4219 114.8906 Q136.2656 99.2812 159.0469 99.2812 ZM80.5781 219.0938 L80.5781 117.7031 L61.875 123.4688 L61.875 107.1562 L81.5625 101.6719 L100.8281 101.6719 L100.8281 219.0938 L80.5781 219.0938 Z\"/></svg></template>\n    <template id=\"♥J\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM89.1562 101.6719 L107.0156 101.6719 L107.0156 178.7344 Q107.0156 199.6875 97.875 209.5312 Q88.875 219.2344 68.7656 219.2344 L61.875 219.2344 L61.875 205.7344 L67.5 205.7344 Q79.3125 205.7344 84.2344 199.8281 Q89.1562 193.9219 89.1562 178.7344 L89.1562 101.6719 Z\"/></svg></template>\n    <template id=\"♥Q\"><svg viewBox=\"24 62 247 343\"><path d=\"M107.2969 221.0625 Q106.7344 221.0625 105.5391 221.1328 Q104.3438 221.2031 103.6406 221.2031 Q81.4219 221.2031 70.5234 206.0859 Q59.625 190.9688 59.625 160.3125 Q59.625 129.5156 70.5938 114.3984 Q81.5625 99.2812 103.7812 99.2812 Q126.1406 99.2812 137.1094 114.3984 Q148.0781 129.5156 148.0781 160.3125 Q148.0781 183.5156 142.0312 197.6484 Q135.9844 211.7812 123.6094 217.4062 L141.3281 232.3125 L127.9688 240.1875 L107.2969 221.0625 ZM129.375 160.3125 Q129.375 134.4375 123.3984 123.3281 Q117.4219 112.2188 103.7812 112.2188 Q90.2812 112.2188 84.3047 123.3281 Q78.3281 134.4375 78.3281 160.3125 Q78.3281 186.1875 84.3047 197.2969 Q90.2812 208.4062 103.7812 208.4062 Q117.4219 208.4062 123.3984 197.2969 Q129.375 186.1875 129.375 160.3125 ZM172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM64.2656 84.7969 Q47.3906 84.7969 47.3906 101.6719 L47.3906 370.6875 Q47.3906 387.5625 64.2656 387.5625 L235.125 387.5625 Q252 387.5625 252 370.6875 L252 101.6719 Q252 84.7969 235.125 84.7969 L64.2656 84.7969 ZM64.2656 67.9219 L235.125 67.9219 Q268.875 67.9219 268.875 101.6719 L268.875 370.6875 Q268.875 404.4375 235.125 404.4375 L64.2656 404.4375 Q30.5156 404.4375 30.5156 370.6875 L30.5156 101.6719 Q30.5156 67.9219 64.2656 67.9219 Z\"/></svg></template>\n    <template id=\"♥K\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L79.7344 101.6719 L79.7344 151.3125 L130.6406 101.6719 L153.7031 101.6719 L96.4688 156.5156 L158.3438 219.2344 L134.8594 219.2344 L79.7344 162.5625 L79.7344 219.2344 L61.875 219.2344 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♦A\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.6719 115.7344 L91.8281 175.7812 L129.5156 175.7812 L110.6719 115.7344 ZM99.9844 101.6719 L121.6406 101.6719 L162.1406 219.2344 L143.5781 219.2344 L134.0156 188.5781 L87.6094 188.5781 L78.0469 219.2344 L59.4844 219.2344 L99.9844 101.6719 Z\"/></svg></template>\n    <template id=\"♦2\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM86.3438 203.0625 L145.9688 203.0625 L145.9688 219.0938 L61.875 219.0938 L61.875 203.625 Q66.6562 199.2656 75.5156 191.3906 Q123.8906 148.5 123.8906 135.2812 Q123.8906 126 116.5781 120.3047 Q109.2656 114.6094 97.3125 114.6094 Q90 114.6094 81.4219 117.0703 Q72.8438 119.5312 62.7188 124.4531 L62.7188 107.1562 Q73.5469 103.2188 82.8984 101.25 Q92.25 99.2812 100.2656 99.2812 Q120.6562 99.2812 132.8906 108.5625 Q145.125 117.8438 145.125 133.0312 Q145.125 152.5781 98.5781 192.5156 Q90.7031 199.2656 86.3438 203.0625 Z\"/></svg></template>\n    <template id=\"♦3\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM121.7812 155.5312 Q134.7188 158.0625 141.8203 165.7266 Q148.9219 173.3906 148.9219 184.9219 Q148.9219 202.3594 135.5625 211.7812 Q122.2031 221.2031 97.3125 221.2031 Q89.2969 221.2031 80.5078 219.7266 Q71.7188 218.25 61.875 215.4375 L61.875 198.4219 Q69.1875 202.2188 77.5547 204.0469 Q85.9219 205.875 95.3438 205.875 Q110.6719 205.875 119.1094 200.3203 Q127.5469 194.7656 127.5469 184.9219 Q127.5469 174.5156 119.7422 169.1719 Q111.9375 163.8281 96.75 163.8281 L84.6562 163.8281 L84.6562 148.6406 L97.875 148.6406 Q111.0938 148.6406 117.9141 144.2109 Q124.7344 139.7812 124.7344 131.3438 Q124.7344 123.1875 117.7031 118.8984 Q110.6719 114.6094 97.3125 114.6094 Q91.6875 114.6094 84.5156 115.875 Q77.3438 117.1406 65.9531 120.375 L65.9531 104.2031 Q76.2188 101.8125 85.2188 100.5469 Q94.2188 99.2812 101.9531 99.2812 Q122.2031 99.2812 134.0859 107.5781 Q145.9688 115.875 145.9688 129.7969 Q145.9688 139.5 139.6406 146.25 Q133.3125 153 121.7812 155.5312 Z\"/></svg></template>\n    <template id=\"♦4\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM120.0938 118.6875 L76.6406 177.6094 L120.0938 177.6094 L120.0938 118.6875 ZM117 101.6719 L140.3438 101.6719 L140.3438 177.6094 L159.3281 177.6094 L159.3281 192.9375 L140.3438 192.9375 L140.3438 219.0938 L120.0938 219.0938 L120.0938 192.9375 L61.875 192.9375 L61.875 175.9219 L117 101.6719 Z\"/></svg></template>\n    <template id=\"♦5\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM67.5 101.6719 L139.2188 101.6719 L139.2188 115.0312 L84.2344 115.0312 L84.2344 143.7188 Q88.1719 142.4531 92.25 141.8906 Q96.1875 141.3281 100.125 141.3281 Q122.7656 141.3281 135.9844 152.1562 Q149.2031 162.8438 149.2031 181.2656 Q149.2031 200.25 135.5625 210.7969 Q122.0625 221.2031 97.3125 221.2031 Q88.875 221.2031 80.0156 219.9375 Q71.1562 218.6719 61.875 216.1406 L61.875 200.25 Q69.8906 204.0469 78.6094 206.0156 Q87.3281 207.8438 97.0312 207.8438 Q112.6406 207.8438 121.7812 200.6719 Q130.9219 193.5 130.9219 181.2656 Q130.9219 169.0312 121.7812 161.8594 Q112.6406 154.6875 97.0312 154.6875 Q89.7188 154.6875 82.4062 156.0938 Q75.0938 157.5 67.5 160.4531 L67.5 101.6719 Z\"/></svg></template>\n    <template id=\"♦6\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.1094 153.7031 Q97.7344 153.7031 90.5625 161.0156 Q83.3906 168.4688 83.3906 181.2656 Q83.3906 193.9219 90.5625 201.2344 Q97.7344 208.6875 110.1094 208.6875 Q122.3438 208.6875 129.5156 201.2344 Q136.6875 193.9219 136.6875 181.2656 Q136.6875 168.4688 129.5156 161.0156 Q122.3438 153.7031 110.1094 153.7031 ZM146.3906 103.9219 L146.3906 118.4062 Q139.5 115.5938 132.4688 114.1875 Q125.4375 112.6406 118.5469 112.6406 Q100.5469 112.6406 90.9844 123.1875 Q81.4219 133.875 80.0156 155.3906 Q85.3594 148.5 93.375 144.8438 Q101.5312 141.1875 111.0938 141.1875 Q131.4844 141.1875 143.2969 151.875 Q155.1094 162.7031 155.1094 181.2656 Q155.1094 199.125 142.7344 210.2344 Q130.5 221.2031 110.1094 221.2031 Q86.625 221.2031 74.25 205.5938 Q61.875 189.9844 61.875 160.1719 Q61.875 132.3281 77.0625 115.875 Q92.25 99.2812 117.8438 99.2812 Q124.7344 99.2812 131.7656 100.4062 Q138.7969 101.6719 146.3906 103.9219 Z\"/></svg></template>\n    <template id=\"♦7\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L148.6406 101.6719 L148.6406 108.4219 L99.7031 219.0938 L80.5781 219.0938 L126.7031 115.0312 L61.875 115.0312 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♦8\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM108.2812 163.125 Q95.2031 163.125 87.75 169.3125 Q80.2969 175.3594 80.2969 185.9062 Q80.2969 196.5938 87.75 202.6406 Q95.2031 208.6875 108.2812 208.6875 Q121.2188 208.6875 128.8125 202.5 Q136.2656 196.4531 136.2656 185.9062 Q136.2656 175.3594 128.8125 169.3125 Q121.3594 163.125 108.2812 163.125 ZM90 156.2344 Q78.1875 153.7031 71.7188 146.8125 Q65.1094 139.7812 65.1094 129.6562 Q65.1094 115.5938 76.6406 107.4375 Q88.1719 99.2812 108.2812 99.2812 Q128.3906 99.2812 139.9219 107.4375 Q151.3125 115.5938 151.3125 129.6562 Q151.3125 140.0625 144.8438 146.8125 Q138.2344 153.7031 126.5625 156.2344 Q139.2188 158.7656 147.0938 166.9219 Q154.5469 174.6562 154.5469 185.9062 Q154.5469 202.9219 142.5938 212.0625 Q130.5 221.2031 108.2812 221.2031 Q85.9219 221.2031 73.9688 212.0625 Q61.875 202.9219 61.875 185.9062 Q61.875 174.9375 69.3281 166.9219 Q76.9219 159.0469 90 156.2344 ZM83.25 131.2031 Q83.25 140.0625 89.8594 145.4062 Q96.3281 150.6094 108.2812 150.6094 Q119.6719 150.6094 126.5625 145.4062 Q133.3125 140.3438 133.3125 131.2031 Q133.3125 122.3438 126.5625 117 Q119.9531 111.7969 108.2812 111.7969 Q96.6094 111.7969 89.8594 117 Q83.25 122.0625 83.25 131.2031 Z\"/></svg></template>\n    <template id=\"♦9\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM70.5938 216.5625 L70.5938 202.0781 Q77.4844 204.8906 84.5156 206.4375 Q91.5469 207.8438 98.2969 207.8438 Q116.4375 207.8438 126 197.2969 Q135.4219 186.75 136.8281 165.0938 Q131.9062 171.7031 123.4688 175.5 Q115.4531 179.1562 105.75 179.1562 Q85.5 179.1562 73.6875 168.4688 Q61.875 157.7812 61.875 139.2188 Q61.875 121.0781 74.1094 110.25 Q86.4844 99.2812 106.875 99.2812 Q130.3594 99.2812 142.5938 114.8906 Q154.9688 130.5 154.9688 160.3125 Q154.9688 188.1562 139.9219 204.6094 Q124.7344 221.2031 99.1406 221.2031 Q92.25 221.2031 85.2188 220.0781 Q78.1875 218.8125 70.5938 216.5625 ZM106.875 166.7812 Q119.25 166.7812 126.4219 159.4688 Q133.5938 152.1562 133.5938 139.2188 Q133.5938 126.5625 126.4219 119.25 Q119.25 111.7969 106.875 111.7969 Q94.9219 111.7969 87.4688 119.25 Q80.1562 126.5625 80.1562 139.2188 Q80.1562 152.1562 87.4688 159.4688 Q94.6406 166.7812 106.875 166.7812 Z\"/></svg></template>\n    <template id=\"♦10\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM159.0469 111.7969 Q149.0625 111.7969 142.0312 123.8906 Q134.8594 135.9844 134.8594 160.1719 Q134.8594 184.5 142.0312 196.5938 Q149.0625 208.6875 159.0469 208.6875 Q169.0312 208.6875 176.0625 196.5938 Q183.2344 184.5 183.2344 160.1719 Q183.2344 135.9844 176.0625 123.8906 Q169.0312 111.7969 159.0469 111.7969 ZM159.0469 99.2812 Q177.4688 99.2812 189.4219 114.8906 Q201.375 130.5 201.375 160.1719 Q201.375 189.9844 189.4219 205.5938 Q177.4688 221.2031 159.0469 221.2031 Q136.2656 221.2031 126.4219 205.5938 Q116.5781 189.9844 116.5781 160.1719 Q116.5781 130.5 126.4219 114.8906 Q136.2656 99.2812 159.0469 99.2812 ZM80.5781 219.0938 L80.5781 117.7031 L61.875 123.4688 L61.875 107.1562 L81.5625 101.6719 L100.8281 101.6719 L100.8281 219.0938 L80.5781 219.0938 Z\"/></svg></template>\n    <template id=\"♦J\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM89.1562 101.6719 L107.0156 101.6719 L107.0156 178.7344 Q107.0156 199.6875 97.875 209.5312 Q88.875 219.2344 68.7656 219.2344 L61.875 219.2344 L61.875 205.7344 L67.5 205.7344 Q79.3125 205.7344 84.2344 199.8281 Q89.1562 193.9219 89.1562 178.7344 L89.1562 101.6719 Z\"/></svg></template>\n    <template id=\"♦Q\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM107.2969 221.0625 Q106.7344 221.0625 105.5391 221.1328 Q104.3438 221.2031 103.6406 221.2031 Q81.4219 221.2031 70.5234 206.0859 Q59.625 190.9688 59.625 160.3125 Q59.625 129.5156 70.5938 114.3984 Q81.5625 99.2812 103.7812 99.2812 Q126.1406 99.2812 137.1094 114.3984 Q148.0781 129.5156 148.0781 160.3125 Q148.0781 183.5156 142.0312 197.6484 Q135.9844 211.7812 123.6094 217.4062 L141.3281 232.3125 L127.9688 240.1875 L107.2969 221.0625 ZM129.375 160.3125 Q129.375 134.4375 123.3984 123.3281 Q117.4219 112.2188 103.7812 112.2188 Q90.2812 112.2188 84.3047 123.3281 Q78.3281 134.4375 78.3281 160.3125 Q78.3281 186.1875 84.3047 197.2969 Q90.2812 208.4062 103.7812 208.4062 Q117.4219 208.4062 123.3984 197.2969 Q129.375 186.1875 129.375 160.3125 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 Z\"/></svg></template>\n    <template id=\"♦K\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L79.7344 101.6719 L79.7344 151.3125 L130.6406 101.6719 L153.7031 101.6719 L96.4688 156.5156 L158.3438 219.2344 L134.8594 219.2344 L79.7344 162.5625 L79.7344 219.2344 L61.875 219.2344 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♣A\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.6719 115.7344 L91.8281 175.7812 L129.5156 175.7812 L110.6719 115.7344 ZM99.9844 101.6719 L121.6406 101.6719 L162.1406 219.2344 L143.5781 219.2344 L134.0156 188.5781 L87.6094 188.5781 L78.0469 219.2344 L59.4844 219.2344 L99.9844 101.6719 Z\"/></svg></template>\n    <template id=\"♣2\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM86.3438 203.0625 L145.9688 203.0625 L145.9688 219.0938 L61.875 219.0938 L61.875 203.625 Q66.6562 199.2656 75.5156 191.3906 Q123.8906 148.5 123.8906 135.2812 Q123.8906 126 116.5781 120.3047 Q109.2656 114.6094 97.3125 114.6094 Q90 114.6094 81.4219 117.0703 Q72.8438 119.5312 62.7188 124.4531 L62.7188 107.1562 Q73.5469 103.2188 82.8984 101.25 Q92.25 99.2812 100.2656 99.2812 Q120.6562 99.2812 132.8906 108.5625 Q145.125 117.8438 145.125 133.0312 Q145.125 152.5781 98.5781 192.5156 Q90.7031 199.2656 86.3438 203.0625 Z\"/></svg></template>\n    <template id=\"♣3\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM121.7812 155.5312 Q134.7188 158.0625 141.8203 165.7266 Q148.9219 173.3906 148.9219 184.9219 Q148.9219 202.3594 135.5625 211.7812 Q122.2031 221.2031 97.3125 221.2031 Q89.2969 221.2031 80.5078 219.7266 Q71.7188 218.25 61.875 215.4375 L61.875 198.4219 Q69.1875 202.2188 77.5547 204.0469 Q85.9219 205.875 95.3438 205.875 Q110.6719 205.875 119.1094 200.3203 Q127.5469 194.7656 127.5469 184.9219 Q127.5469 174.5156 119.7422 169.1719 Q111.9375 163.8281 96.75 163.8281 L84.6562 163.8281 L84.6562 148.6406 L97.875 148.6406 Q111.0938 148.6406 117.9141 144.2109 Q124.7344 139.7812 124.7344 131.3438 Q124.7344 123.1875 117.7031 118.8984 Q110.6719 114.6094 97.3125 114.6094 Q91.6875 114.6094 84.5156 115.875 Q77.3438 117.1406 65.9531 120.375 L65.9531 104.2031 Q76.2188 101.8125 85.2188 100.5469 Q94.2188 99.2812 101.9531 99.2812 Q122.2031 99.2812 134.0859 107.5781 Q145.9688 115.875 145.9688 129.7969 Q145.9688 139.5 139.6406 146.25 Q133.3125 153 121.7812 155.5312 Z\"/></svg></template>\n    <template id=\"♣4\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM120.0938 118.6875 L76.6406 177.6094 L120.0938 177.6094 L120.0938 118.6875 ZM117 101.6719 L140.3438 101.6719 L140.3438 177.6094 L159.3281 177.6094 L159.3281 192.9375 L140.3438 192.9375 L140.3438 219.0938 L120.0938 219.0938 L120.0938 192.9375 L61.875 192.9375 L61.875 175.9219 L117 101.6719 Z\"/></svg></template>\n    <template id=\"♣5\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM67.5 101.6719 L139.2188 101.6719 L139.2188 115.0312 L84.2344 115.0312 L84.2344 143.7188 Q88.1719 142.4531 92.25 141.8906 Q96.1875 141.3281 100.125 141.3281 Q122.7656 141.3281 135.9844 152.1562 Q149.2031 162.8438 149.2031 181.2656 Q149.2031 200.25 135.5625 210.7969 Q122.0625 221.2031 97.3125 221.2031 Q88.875 221.2031 80.0156 219.9375 Q71.1562 218.6719 61.875 216.1406 L61.875 200.25 Q69.8906 204.0469 78.6094 206.0156 Q87.3281 207.8438 97.0312 207.8438 Q112.6406 207.8438 121.7812 200.6719 Q130.9219 193.5 130.9219 181.2656 Q130.9219 169.0312 121.7812 161.8594 Q112.6406 154.6875 97.0312 154.6875 Q89.7188 154.6875 82.4062 156.0938 Q75.0938 157.5 67.5 160.4531 L67.5 101.6719 Z\"/></svg></template>\n    <template id=\"♣6\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.1094 153.7031 Q97.7344 153.7031 90.5625 161.0156 Q83.3906 168.4688 83.3906 181.2656 Q83.3906 193.9219 90.5625 201.2344 Q97.7344 208.6875 110.1094 208.6875 Q122.3438 208.6875 129.5156 201.2344 Q136.6875 193.9219 136.6875 181.2656 Q136.6875 168.4688 129.5156 161.0156 Q122.3438 153.7031 110.1094 153.7031 ZM146.3906 103.9219 L146.3906 118.4062 Q139.5 115.5938 132.4688 114.1875 Q125.4375 112.6406 118.5469 112.6406 Q100.5469 112.6406 90.9844 123.1875 Q81.4219 133.875 80.0156 155.3906 Q85.3594 148.5 93.375 144.8438 Q101.5312 141.1875 111.0938 141.1875 Q131.4844 141.1875 143.2969 151.875 Q155.1094 162.7031 155.1094 181.2656 Q155.1094 199.125 142.7344 210.2344 Q130.5 221.2031 110.1094 221.2031 Q86.625 221.2031 74.25 205.5938 Q61.875 189.9844 61.875 160.1719 Q61.875 132.3281 77.0625 115.875 Q92.25 99.2812 117.8438 99.2812 Q124.7344 99.2812 131.7656 100.4062 Q138.7969 101.6719 146.3906 103.9219 Z\"/></svg></template>\n    <template id=\"♣7\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L148.6406 101.6719 L148.6406 108.4219 L99.7031 219.0938 L80.5781 219.0938 L126.7031 115.0312 L61.875 115.0312 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♣8\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM108.2812 163.125 Q95.2031 163.125 87.75 169.3125 Q80.2969 175.3594 80.2969 185.9062 Q80.2969 196.5938 87.75 202.6406 Q95.2031 208.6875 108.2812 208.6875 Q121.2188 208.6875 128.8125 202.5 Q136.2656 196.4531 136.2656 185.9062 Q136.2656 175.3594 128.8125 169.3125 Q121.3594 163.125 108.2812 163.125 ZM90 156.2344 Q78.1875 153.7031 71.7188 146.8125 Q65.1094 139.7812 65.1094 129.6562 Q65.1094 115.5938 76.6406 107.4375 Q88.1719 99.2812 108.2812 99.2812 Q128.3906 99.2812 139.9219 107.4375 Q151.3125 115.5938 151.3125 129.6562 Q151.3125 140.0625 144.8438 146.8125 Q138.2344 153.7031 126.5625 156.2344 Q139.2188 158.7656 147.0938 166.9219 Q154.5469 174.6562 154.5469 185.9062 Q154.5469 202.9219 142.5938 212.0625 Q130.5 221.2031 108.2812 221.2031 Q85.9219 221.2031 73.9688 212.0625 Q61.875 202.9219 61.875 185.9062 Q61.875 174.9375 69.3281 166.9219 Q76.9219 159.0469 90 156.2344 ZM83.25 131.2031 Q83.25 140.0625 89.8594 145.4062 Q96.3281 150.6094 108.2812 150.6094 Q119.6719 150.6094 126.5625 145.4062 Q133.3125 140.3438 133.3125 131.2031 Q133.3125 122.3438 126.5625 117 Q119.9531 111.7969 108.2812 111.7969 Q96.6094 111.7969 89.8594 117 Q83.25 122.0625 83.25 131.2031 Z\"/></svg></template>\n    <template id=\"♣9\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM70.5938 216.5625 L70.5938 202.0781 Q77.4844 204.8906 84.5156 206.4375 Q91.5469 207.8438 98.2969 207.8438 Q116.4375 207.8438 126 197.2969 Q135.4219 186.75 136.8281 165.0938 Q131.9062 171.7031 123.4688 175.5 Q115.4531 179.1562 105.75 179.1562 Q85.5 179.1562 73.6875 168.4688 Q61.875 157.7812 61.875 139.2188 Q61.875 121.0781 74.1094 110.25 Q86.4844 99.2812 106.875 99.2812 Q130.3594 99.2812 142.5938 114.8906 Q154.9688 130.5 154.9688 160.3125 Q154.9688 188.1562 139.9219 204.6094 Q124.7344 221.2031 99.1406 221.2031 Q92.25 221.2031 85.2188 220.0781 Q78.1875 218.8125 70.5938 216.5625 ZM106.875 166.7812 Q119.25 166.7812 126.4219 159.4688 Q133.5938 152.1562 133.5938 139.2188 Q133.5938 126.5625 126.4219 119.25 Q119.25 111.7969 106.875 111.7969 Q94.9219 111.7969 87.4688 119.25 Q80.1562 126.5625 80.1562 139.2188 Q80.1562 152.1562 87.4688 159.4688 Q94.6406 166.7812 106.875 166.7812 Z\"/></svg></template>\n    <template id=\"♣10\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM159.0469 111.7969 Q149.0625 111.7969 142.0312 123.8906 Q134.8594 135.9844 134.8594 160.1719 Q134.8594 184.5 142.0312 196.5938 Q149.0625 208.6875 159.0469 208.6875 Q169.0312 208.6875 176.0625 196.5938 Q183.2344 184.5 183.2344 160.1719 Q183.2344 135.9844 176.0625 123.8906 Q169.0312 111.7969 159.0469 111.7969 ZM159.0469 99.2812 Q177.4688 99.2812 189.4219 114.8906 Q201.375 130.5 201.375 160.1719 Q201.375 189.9844 189.4219 205.5938 Q177.4688 221.2031 159.0469 221.2031 Q136.2656 221.2031 126.4219 205.5938 Q116.5781 189.9844 116.5781 160.1719 Q116.5781 130.5 126.4219 114.8906 Q136.2656 99.2812 159.0469 99.2812 ZM80.5781 219.0938 L80.5781 117.7031 L61.875 123.4688 L61.875 107.1562 L81.5625 101.6719 L100.8281 101.6719 L100.8281 219.0938 L80.5781 219.0938 Z\"/></svg></template>\n    <template id=\"♣J\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM89.1562 101.6719 L107.0156 101.6719 L107.0156 178.7344 Q107.0156 199.6875 97.875 209.5312 Q88.875 219.2344 68.7656 219.2344 L61.875 219.2344 L61.875 205.7344 L67.5 205.7344 Q79.3125 205.7344 84.2344 199.8281 Q89.1562 193.9219 89.1562 178.7344 L89.1562 101.6719 Z\"/></svg></template>\n    <template id=\"♣Q\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM107.2969 221.0625 Q106.7344 221.0625 105.5391 221.1328 Q104.3438 221.2031 103.6406 221.2031 Q81.4219 221.2031 70.5234 206.0859 Q59.625 190.9688 59.625 160.3125 Q59.625 129.5156 70.5938 114.3984 Q81.5625 99.2812 103.7812 99.2812 Q126.1406 99.2812 137.1094 114.3984 Q148.0781 129.5156 148.0781 160.3125 Q148.0781 183.5156 142.0312 197.6484 Q135.9844 211.7812 123.6094 217.4062 L141.3281 232.3125 L127.9688 240.1875 L107.2969 221.0625 ZM129.375 160.3125 Q129.375 134.4375 123.3984 123.3281 Q117.4219 112.2188 103.7812 112.2188 Q90.2812 112.2188 84.3047 123.3281 Q78.3281 134.4375 78.3281 160.3125 Q78.3281 186.1875 84.3047 197.2969 Q90.2812 208.4062 103.7812 208.4062 Q117.4219 208.4062 123.3984 197.2969 Q129.375 186.1875 129.375 160.3125 Z\"/></svg></template>\n    <template id=\"♣K\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L79.7344 101.6719 L79.7344 151.3125 L130.6406 101.6719 L153.7031 101.6719 L96.4688 156.5156 L158.3438 219.2344 L134.8594 219.2344 L79.7344 162.5625 L79.7344 219.2344 L61.875 219.2344 L61.875 101.6719 Z\"/></svg></template>\n\n    <table style=\"border-width:1px\">\n        <tr width=\"100%\" height=\"10px\" style=\"visibility:visible\"}>\n            <td width=\"50px\"><playing-card><span style=\"color:blue\">&block;</span></playing-card</td>\n        </tr>\n        <tr width=\"100%\">\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;A</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;2</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;3</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;4</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;5</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;6</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;7</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;8</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;9</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;10</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;J</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;Q</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;K</span></playing-card></td>\n        </tr>\n        <tr>\n            <td><playing-card><span style=\"color:red\">&hearts;A</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;2</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;3</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;4</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;5</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;6</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;7</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;8</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;9</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;10</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;J</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;Q</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;K</span></playing-card></td>\n        </tr>\n        <tr>\n            <td><playing-card><span style=\"color:red\">&diams;A</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;2</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;3</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;4</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;5</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;6</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;7</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;8</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;9</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;10</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;J</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;Q</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;K</span></playing-card></td>\n        </tr>\n        <tr>\n            <td><playing-card><span style=\"color:black\">&clubs;A</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;2</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;3</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;4</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;5</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;6</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;7</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;8</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;9</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;10</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;J</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;Q</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;K</span></playing-card></td>\n        </tr>\n    </table>\n</div>\n"

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = "<p>index</p>\n"

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = "<form\n    id=\"message_form\"\n    onsubmit=\"\n     var gun = Gun(location.origin + '/gun');\n     openpgp.config.aead_protect = true\n     openpgp.initWorker({ path:'/js/openpgp.worker.js' })\n     if (!message_txt.value) {\n          return false\n     }\n     window.handlePost(message_txt.value)(openpgp)(window.localStorage)('royale').then(result => {if (result) {console.log(result)}}).catch(err => console.error(err));document.getElementById('message_txt').value = ''; return false\"\n    method=\"post\"\n    action=\"/message\">\n    <input id=\"message_form_input\"\n        type=\"submit\"\n        value=\"post message\"\n        form=\"message_form\"\n        >\n</form>\n<textarea\n    id=\"message_txt\"\n    name=\"message_txt\"\n    form=\"message_form\"\n    rows=51\n    cols=70\n    placeholder=\"paste plaintext message, public key, or private key\"\n    style=\"font-family:Menlo,Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New, monospace;\"\n    >\n</textarea>\n"

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = "<span class=\"roadmap\">\n    <details>\n    <summary>road map</summary>\n    <ul>\n        <li><del><a href=\"https://github.com/colealbon/hotlips/commit/3b70981cbe4e11e1400ae8e948a06e3582d9c2d2\">Install node/koa/webpack</a></del></li>\n        <li><del><a href=\"https://github.com/colealbon/hotlips/issues/2\">Install gundb</a></del></li>\n        <li><del>make a <a href=\"#/deck\">deck</a> of cards</del></li>\n        <li><del>Alice and Bob <a href=\"#/message\">identify</a></del></li>\n        <li><del>Alice and Bob <a href=\"#/connect\">connect</a></del></li>\n        <li><del>Alice and Bob <a href=\"https://github.com/colealbon/streamliner\">exchange keys</a></del?</li>\n        <li>Alice and Bob agree on a certain \"<a href=\"#/deck\">deck</a>\" of cards. In practice, this means they agree on a set of numbers or other data such that each element of the set represents a card.</li>\n        <li>Alice picks an encryption key A and uses this to encrypt each card of the deck.</li>\n        <li>Alice <a href=\"https://bost.ocks.org/mike/shuffle/\">shuffles</a> the cards.</li>\n        <li>Alice passes the encrypted and shuffled deck to Bob. With the encryption in place, Bob cannot know which card is which.</li>\n        <li>Bob shuffles the deck.</li>\n        <li>Bob passes the double encrypted and shuffled deck back to Alice.</li>\n        <li>Alice decrypts each card using her key A. This still leaves Bob's encryption in place though so she cannot know which card is which.</li>\n        <li>Alice picks one encryption key for each card (A1, A2, etc.) and encrypts them individually.</li>\n        <li>Alice passes the deck to Bob.</li>\n        <li>Bob decrypts each card using his key B. This still leaves Alice's individual encryption in place though so he cannot know which card is which.</li>\n        <li>Bob picks one encryption key for each card (B1, B2, etc.) and encrypts them individually.</li>\n        <li>Bob passes the deck back to Alice.</li>\n        <li>Alice publishes the deck for everyone playing (in this case only Alice and Bob, see below on expansion though).</li>\n    </ul>\n</details>\n</span>\n"

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjBiODE2MzQ3OWQ4MmM0M2Y3NTciLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9kZXRlcm1pbmVDb250ZW50VHlwZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL2dldEZyb21TdG9yYWdlLmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvZGVjcnlwdFBHUE1lc3NhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9kZWNyeXB0UEdQTWVzc2FnZVdpdGhLZXkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9kZXRlcm1pbmVLZXlUeXBlLmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvZW5jcnlwdENsZWFyVGV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL2VuY3J5cHRDbGVhcnRleHRNdWx0aS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL3NhdmVQR1BQcml2a2V5LmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvc2F2ZVBHUFB1YmtleS5qcyIsIndlYnBhY2s6Ly8vLi9+L2d1bi9ndW4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWJlbC1yb3V0ZXIvc3JjL3JlYmVsLXJvdXRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL2hhbmRsZVBvc3QuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2Nvbm5lY3QuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2NvbnRhY3QuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2RlY2suanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9tZXNzYWdlLmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9yb2FkbWFwLmpzIiwid2VicGFjazovLy8uL34vcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL21vZHVsZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vdmlld3MvcGFydGlhbHMvY29ubmVjdC5odG1sIiwid2VicGFjazovLy8uL3ZpZXdzL3BhcnRpYWxzL2NvbnRhY3QuaHRtbCIsIndlYnBhY2s6Ly8vLi92aWV3cy9wYXJ0aWFscy9mcmVzaGRlY2suaHRtbCIsIndlYnBhY2s6Ly8vLi92aWV3cy9wYXJ0aWFscy9pbmRleC5odG1sIiwid2VicGFjazovLy8uL3ZpZXdzL3BhcnRpYWxzL21lc3NhZ2VfZm9ybS5odG1sIiwid2VicGFjazovLy8uL3ZpZXdzL3BhcnRpYWxzL3JvYWRtYXAuaHRtbCJdLCJuYW1lcyI6WyJkZXRlcm1pbmVDb250ZW50VHlwZSIsImNvbnRlbnQiLCJQcm9taXNlIiwicmVzb2x2ZSIsIm9wZW5wZ3AiLCJyZWplY3QiLCJDTEVBUlRFWFQiLCJQR1BNRVNTQUdFIiwicG9zc2libGVwZ3BrZXkiLCJrZXkiLCJyZWFkQXJtb3JlZCIsImtleXMiLCJ0aGVuIiwia2V5VHlwZSIsIm1lc3NhZ2UiLCJlcnIiLCJnZXRGcm9tU3RvcmFnZSIsImxvY2FsU3RvcmFnZSIsImluZGV4S2V5IiwiaSIsImxlbmd0aCIsImtleUFyciIsInB1c2giLCJnZXRJdGVtIiwiZGVjcnlwdFBHUE1lc3NhZ2UiLCJQR1BQUklWS0VZIiwicGFzc3dvcmQiLCJQR1BNZXNzYWdlQXJtb3IiLCJjb25zb2xlIiwibG9nIiwic3RvcmVBcnIiLCJmaWx0ZXIiLCJzdG9yYWdlSXRlbSIsIm1hcCIsImNvbnRlbnRUeXBlIiwiZGVjcnlwdGVkIiwiZGVjcnlwdFBHUE1lc3NhZ2VXaXRoS2V5IiwicHJpdmF0ZUtleUFybW9yIiwicHJpdmF0ZUtleXMiLCJwcml2YXRlS2V5IiwiRXJyb3IiLCJkZWNyeXB0IiwidXNlcnMiLCJkZWNyeXB0TWVzc2FnZSIsInJlc3VsdCIsImRhdGEiLCJkZXRlcm1pbmVLZXlUeXBlIiwiUEdQUFVCS0VZIiwidG9QdWJsaWMiLCJhcm1vciIsImVycm9yIiwiZW5jcnlwdENsZWFyVGV4dCIsInB1YmxpY0tleUFybW9yIiwiY2xlYXJ0ZXh0IiwiUEdQUHVia2V5IiwiZW5jcnlwdE1lc3NhZ2UiLCJlbmNyeXB0ZWR0eHQiLCJjYXRjaCIsIm9wdGlvbnMiLCJwdWJsaWNLZXlzIiwiZW5jcnlwdCIsImNpcGhlcnRleHQiLCJlbmNyeXB0Q2xlYXJ0ZXh0TXVsdGkiLCJzdG9yYWdlQXJyIiwiZW5jcnlwdGVkTXNncyIsImlkeCIsImVuY3J5cHRlZCIsInNhdmVQR1BQcml2a2V5IiwiUEdQa2V5QXJtb3IiLCJQR1BrZXkiLCJzZXRJdGVtIiwidXNlcklkIiwidXNlcmlkIiwicHJvY2VzcyIsInNldEltbWVkaWF0ZSIsInNhdmVQR1BQdWJrZXkiLCJleGlzdGluZ0tleSIsImV4aXN0aW5nS2V5VHlwZSIsInJvb3QiLCJ3aW5kb3ciLCJnbG9iYWwiLCJyZXF1aXJlIiwiYXJnIiwic2xpY2UiLCJtb2QiLCJwYXRoIiwiZXhwb3J0cyIsInNwbGl0IiwidG9TdHJpbmciLCJyZXBsYWNlIiwiY29tbW9uIiwibW9kdWxlIiwiVHlwZSIsImZucyIsImZuIiwiaXMiLCJiaSIsImIiLCJCb29sZWFuIiwibnVtIiwibiIsImxpc3RfaXMiLCJwYXJzZUZsb2F0IiwiSW5maW5pdHkiLCJ0ZXh0IiwidCIsImlmeSIsIkpTT04iLCJzdHJpbmdpZnkiLCJyYW5kb20iLCJsIiwiYyIsInMiLCJjaGFyQXQiLCJNYXRoIiwiZmxvb3IiLCJtYXRjaCIsIm8iLCJyIiwib2JqIiwiaGFzIiwidG9Mb3dlckNhc2UiLCJsaXN0IiwibSIsImluZGV4T2YiLCJmdXp6eSIsImYiLCJBcnJheSIsInNsaXQiLCJwcm90b3R5cGUiLCJzb3J0IiwiayIsIkEiLCJCIiwiXyIsIm9ial9tYXAiLCJpbmRleCIsIk9iamVjdCIsImNvbnN0cnVjdG9yIiwiY2FsbCIsInB1dCIsInYiLCJoYXNPd25Qcm9wZXJ0eSIsImRlbCIsImFzIiwidSIsIm9ial9pcyIsInBhcnNlIiwiZSIsIm9ial9oYXMiLCJ0byIsImZyb20iLCJjb3B5IiwiZW1wdHkiLCJhcmd1bWVudHMiLCJ4IiwibGwiLCJsbGUiLCJmbl9pcyIsImlpIiwidGltZSIsIkRhdGUiLCJnZXRUaW1lIiwib250byIsInRhZyIsIm5leHQiLCJGdW5jdGlvbiIsImJlIiwib2ZmIiwidGhlIiwibGFzdCIsImJhY2siLCJvbiIsIk9uIiwiQ2hhaW4iLCJjcmVhdGUiLCJvcHQiLCJpZCIsInJpZCIsInV1aWQiLCJzdHVuIiwiY2hhaW4iLCJldiIsInNraXAiLCJjYiIsInJlcyIsInF1ZXVlIiwidG1wIiwicSIsImFjdCIsImF0IiwiY3R4IiwiYXNrIiwic2NvcGUiLCJhY2siLCJyZXBseSIsIm9ucyIsImV2ZW50IiwiR3VuIiwiaW5wdXQiLCJlbWl0IiwiYXBwbHkiLCJjb25jYXQiLCJndW4iLCJzb3VsIiwic3RhdGUiLCJ3YWl0aW5nIiwid2hlbiIsInNvb25lc3QiLCJzZXQiLCJmdXR1cmUiLCJub3ciLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiY2hlY2siLCJlYWNoIiwid2FpdCIsIkhBTSIsIm1hY2hpbmVTdGF0ZSIsImluY29taW5nU3RhdGUiLCJjdXJyZW50U3RhdGUiLCJpbmNvbWluZ1ZhbHVlIiwiY3VycmVudFZhbHVlIiwiZGVmZXIiLCJoaXN0b3JpY2FsIiwiY29udmVyZ2UiLCJpbmNvbWluZyIsIkxleGljYWwiLCJjdXJyZW50IiwidW5kZWZpbmVkIiwiVmFsIiwidGV4dF9pcyIsImJpX2lzIiwibnVtX2lzIiwicmVsIiwicmVsXyIsIm9ial9wdXQiLCJOb2RlIiwic291bF8iLCJ0ZXh0X3JhbmRvbSIsIm5vZGUiLCJvYmpfZGVsIiwiU3RhdGUiLCJwZXJmIiwic3RhcnQiLCJOIiwiZHJpZnQiLCJEIiwicGVyZm9ybWFuY2UiLCJ0aW1pbmciLCJuYXZpZ2F0aW9uU3RhcnQiLCJOXyIsIm9ial9hcyIsInZhbCIsIm9ial9jb3B5IiwiR3JhcGgiLCJnIiwib2JqX2VtcHR5IiwibmYiLCJlbnYiLCJncmFwaCIsInNlZW4iLCJ2YWxpZCIsInByZXYiLCJpbnZhbGlkIiwiam9pbiIsImFyciIsIkR1cCIsImNhY2hlIiwidHJhY2siLCJnYyIsImRlIiwib2xkZXN0IiwibWF4QWdlIiwibWluIiwiZG9uZSIsImVsYXBzZWQiLCJuZXh0R0MiLCJ2ZXJzaW9uIiwidG9KU09OIiwiZHVwIiwic2NoZWR1bGUiLCJmaWVsZCIsInZhbHVlIiwib25jZSIsImNhdCIsImNvYXQiLCJvYmpfdG8iLCJnZXQiLCJtYWNoaW5lIiwidmVyaWZ5IiwibWVyZ2UiLCJkaWZmIiwidmVydGV4Iiwid2FzIiwia25vd24iLCJyZWYiLCJfc291bCIsIl9maWVsZCIsImhvdyIsInBlZXJzIiwidXJsIiwid3NjIiwicHJvdG9jb2xzIiwicmVsX2lzIiwiZGVidWciLCJ3IiwieWVzIiwib3V0cHV0Iiwic3ludGgiLCJwcm94eSIsImNoYW5nZSIsImVjaG8iLCJub3QiLCJyZWxhdGUiLCJub2RlXyIsInJldmVyYiIsInZpYSIsInVzZSIsIm91dCIsImNhcCIsIm5vb3AiLCJhbnkiLCJiYXRjaCIsIm5vIiwiaWlmZSIsIm1ldGEiLCJfXyIsInVuaW9uIiwic3RhdGVfaXMiLCJjcyIsIml2IiwiY3YiLCJ2YWxfaXMiLCJzdGF0ZV9pZnkiLCJkZWx0YSIsInN5bnRoXyIsIm5vZGVfc291bCIsIm5vZGVfaXMiLCJub2RlX2lmeSIsImVhcyIsInN1YnMiLCJiaW5kIiwib2siLCJhc3luYyIsIm91Z2h0IiwibmVlZCIsImltcGxlbWVudCIsImZpZWxkcyIsIm5fIiwiaXRlbSIsInN0b3JlIiwicmVtb3ZlSXRlbSIsImRpcnR5IiwiY291bnQiLCJtYXgiLCJwcmVmaXgiLCJzYXZlIiwiYWxsIiwibGV4IiwiV2ViU29ja2V0Iiwid2Via2l0V2ViU29ja2V0IiwibW96V2ViU29ja2V0Iiwid3NwIiwidWRyYWluIiwic2VuZCIsInBlZXIiLCJtc2ciLCJ3aXJlIiwib3BlbiIsInJlYWR5U3RhdGUiLCJPUEVOIiwicmVjZWl2ZSIsImJvZHkiLCJvbmNsb3NlIiwicmVjb25uZWN0Iiwib25lcnJvciIsImNvZGUiLCJvbm9wZW4iLCJvbm1lc3NhZ2UiLCJSZWJlbFJvdXRlciIsIl9wcmVmaXgiLCJwcmV2aW91c1BhdGgiLCJiYXNlUGF0aCIsImdldEF0dHJpYnV0ZSIsImluaGVyaXQiLCIkZWxlbWVudCIsInBhcmVudE5vZGUiLCJub2RlTmFtZSIsInJvdXRlIiwicm91dGVzIiwiJGNoaWxkcmVuIiwiY2hpbGRyZW4iLCIkY2hpbGQiLCIkdGVtcGxhdGUiLCJpbm5lckhUTUwiLCJzaGFkb3dSb290IiwiY3JlYXRlU2hhZG93Um9vdCIsImFuaW1hdGlvbiIsImluaXRBbmltYXRpb24iLCJyZW5kZXIiLCJwYXRoQ2hhbmdlIiwiaXNCYWNrIiwiY2xhc3NMaXN0IiwiYWRkIiwicmVtb3ZlIiwib2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwibXV0YXRpb25zIiwiYWRkZWROb2RlcyIsIm90aGVyQ2hpbGRyZW4iLCJnZXRPdGhlckNoaWxkcmVuIiwiZm9yRWFjaCIsImNoaWxkIiwiYW5pbWF0aW9uRW5kIiwidGFyZ2V0IiwiY2xhc3NOYW1lIiwicmVtb3ZlQ2hpbGQiLCJhZGRFdmVudExpc3RlbmVyIiwib2JzZXJ2ZSIsImNoaWxkTGlzdCIsImdldFBhdGhGcm9tVXJsIiwicmVnZXhTdHJpbmciLCJyZWdleCIsIlJlZ0V4cCIsInRlc3QiLCJfcm91dGVSZXN1bHQiLCJjb21wb25lbnQiLCIkY29tcG9uZW50IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwicGFyYW1zIiwic2V0QXR0cmlidXRlIiwiYXBwZW5kQ2hpbGQiLCJ0ZW1wbGF0ZSIsImEiLCJyZXN1bHRzIiwicXVlcnlTdHJpbmciLCJzdWJzdHIiLCJwYXJ0IiwiZXEiLCJkZWNvZGVVUklDb21wb25lbnQiLCJzdWJzdHJpbmciLCJDbGFzcyIsIm5hbWUiLCJ2YWxpZEVsZW1lbnRUYWciLCJIVE1MRWxlbWVudCIsImNsYXNzVG9UYWciLCJpc1JlZ2lzdGVyZWRFbGVtZW50IiwicmVnaXN0ZXJFbGVtZW50IiwiY2FsbGJhY2siLCJjaGFuZ2VDYWxsYmFja3MiLCJjaGFuZ2VIYW5kbGVyIiwibG9jYXRpb24iLCJocmVmIiwib2xkVVJMIiwib25oYXNoY2hhbmdlIiwicGFyc2VRdWVyeVN0cmluZyIsInJlIiwiZXhlYyIsInJlc3VsdHMyIiwiUmViZWxSb3V0ZSIsIlJlYmVsRGVmYXVsdCIsIlJlYmVsQmFja0EiLCJwcmV2ZW50RGVmYXVsdCIsImRpc3BhdGNoRXZlbnQiLCJDdXN0b21FdmVudCIsImhhc2giLCJIVE1MQW5jaG9yRWxlbWVudCIsImV4dGVuZHMiLCJnZXRQYXJhbXNGcm9tVXJsIiwiaGFuZGxlUG9zdCIsImNvbm5lY3RQYXJ0aWFsIiwiQ29ubmVjdFBhZ2UiLCJjb250YWN0UGFydGlhbCIsIkNvbnRhY3RQYWdlIiwiZnJlc2hEZWNrUGFydGlhbCIsIkRlY2tQYWdlIiwiY3JlYXRlZENhbGxiYWNrIiwicXVlcnlTZWxlY3RvciIsInRleHRDb250ZW50IiwiY2xvbmUiLCJpbXBvcnROb2RlIiwiY29sb3JPdmVycmlkZSIsInN0eWxlIiwiY29sb3IiLCJmaWxsIiwiaW5kZXhQYXJ0aWFsIiwiSW5kZXhQYWdlIiwiY2xpZW50UHVia2V5Rm9ybVBhcnRpYWwiLCJNZXNzYWdlUGFnZSIsInJvYWRtYXBQYXJ0aWFsIiwiUm9hZG1hcFBhZ2UiLCJjYWNoZWRTZXRUaW1lb3V0IiwiY2FjaGVkQ2xlYXJUaW1lb3V0IiwiZGVmYXVsdFNldFRpbW91dCIsImRlZmF1bHRDbGVhclRpbWVvdXQiLCJydW5UaW1lb3V0IiwiZnVuIiwicnVuQ2xlYXJUaW1lb3V0IiwibWFya2VyIiwiZHJhaW5pbmciLCJjdXJyZW50UXVldWUiLCJxdWV1ZUluZGV4IiwiY2xlYW5VcE5leHRUaWNrIiwiZHJhaW5RdWV1ZSIsInRpbWVvdXQiLCJsZW4iLCJydW4iLCJuZXh0VGljayIsImFyZ3MiLCJJdGVtIiwiYXJyYXkiLCJ0aXRsZSIsImJyb3dzZXIiLCJhcmd2IiwidmVyc2lvbnMiLCJhZGRMaXN0ZW5lciIsInJlbW92ZUxpc3RlbmVyIiwicmVtb3ZlQWxsTGlzdGVuZXJzIiwicHJlcGVuZExpc3RlbmVyIiwicHJlcGVuZE9uY2VMaXN0ZW5lciIsImxpc3RlbmVycyIsImJpbmRpbmciLCJjd2QiLCJjaGRpciIsImRpciIsInVtYXNrIiwiZXZhbCIsIndlYnBhY2tQb2x5ZmlsbCIsImRlcHJlY2F0ZSIsInBhdGhzIiwiZGVmaW5lUHJvcGVydHkiLCJlbnVtZXJhYmxlIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7O0FDaEVBOzs7OztRQUlnQkEsb0IsR0FBQUEsb0I7O0FBRmhCOztBQUVPLFNBQVNBLG9CQUFULENBQThCQyxPQUE5QixFQUF1QztBQUMxQztBQUNBLFdBQVEsQ0FBQ0EsT0FBRixHQUNQQyxRQUFRQyxPQUFSLENBQWdCLEVBQWhCLENBRE8sR0FFUCxVQUFDQyxPQUFELEVBQWE7QUFDVCxlQUFRLENBQUNBLE9BQUYsR0FDUEYsUUFBUUcsTUFBUixDQUFlLHdCQUFmLENBRE8sR0FFUCxJQUFJSCxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVRSxNQUFWLEVBQXFCO0FBQzdCLGdCQUFNQyxZQUFZLFdBQWxCO0FBQ0EsZ0JBQU1DLGFBQWEsWUFBbkI7QUFDQSxnQkFBSUMsaUJBQWlCSixRQUFRSyxHQUFSLENBQVlDLFdBQVosQ0FBd0JULE9BQXhCLENBQXJCO0FBQ0EsZ0JBQUlPLGVBQWVHLElBQWYsQ0FBb0IsQ0FBcEIsQ0FBSixFQUE0QjtBQUN4Qix3REFBaUJWLE9BQWpCLEVBQTBCRyxPQUExQixFQUNDUSxJQURELENBQ00sVUFBQ0MsT0FBRCxFQUFhO0FBQ2ZWLDRCQUFRVSxPQUFSO0FBQ0gsaUJBSEQ7QUFJSCxhQUxELE1BS087QUFDSCxvQkFBSTtBQUNBVCw0QkFBUVUsT0FBUixDQUFnQkosV0FBaEIsQ0FBNEJULE9BQTVCO0FBQ0FFLDRCQUFRSSxVQUFSO0FBQ0gsaUJBSEQsQ0FHRSxPQUFPUSxHQUFQLEVBQVk7QUFDVlosNEJBQVFHLFNBQVI7QUFDSDtBQUNKO0FBQ0osU0FqQkQsQ0FGQTtBQW9CSCxLQXZCRDtBQXdCSCxDOzs7Ozs7O0FDOUJEOzs7OztRQUVnQlUsYyxHQUFBQSxjO0FBQVQsU0FBU0EsY0FBVCxDQUF3QkMsWUFBeEIsRUFBc0M7QUFDekM7QUFDQSxXQUFRLENBQUNBLFlBQUYsR0FDUGYsUUFBUUcsTUFBUixDQUFlLDZCQUFmLENBRE8sR0FFUCxVQUFDYSxRQUFELEVBQWM7QUFDVixlQUFRLENBQUNBLFFBQUY7QUFDUDtBQUNBLFlBQUloQixPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVRSxNQUFWLEVBQXFCO0FBQzdCLGdCQUFJO0FBQ0Esb0JBQUljLElBQUlGLGFBQWFHLE1BQXJCO0FBQ0Esb0JBQUlDLFNBQVMsRUFBYjtBQUNBLHVCQUFPRixLQUFLLENBQVosRUFBZTtBQUNYQSx3QkFBSUEsSUFBSSxDQUFSO0FBQ0FFLDJCQUFPQyxJQUFQLENBQVlMLGFBQWFNLE9BQWIsQ0FBcUJOLGFBQWFSLEdBQWIsQ0FBaUJVLENBQWpCLENBQXJCLENBQVo7QUFDQSx3QkFBSUEsTUFBTSxDQUFWLEVBQWE7QUFDVGhCLGdDQUFRa0IsTUFBUjtBQUNIO0FBQ0o7QUFDSixhQVZELENBV0EsT0FBT04sR0FBUCxFQUFZO0FBQ1JWLHVCQUFPVSxHQUFQO0FBQ0g7QUFDSixTQWZELENBRk87QUFrQlA7QUFDQSxZQUFJYixPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVRSxNQUFWLEVBQXFCO0FBQzdCLGdCQUFJO0FBQ0FGLHdCQUFRYyxhQUFhTSxPQUFiLENBQXFCTCxRQUFyQixDQUFSO0FBQ0gsYUFGRCxDQUdBLE9BQU9ILEdBQVAsRUFBWTtBQUNSVix1QkFBT1UsR0FBUDtBQUNIO0FBQ0osU0FQRCxDQW5CQTtBQTJCSCxLQTlCRDtBQStCSCxDOzs7Ozs7O0FDbkNEOzs7OztRQVFnQlMsaUIsR0FBQUEsaUI7O0FBTmhCOztBQUNBOztBQUNBOztBQUVBLElBQU1DLGFBQWEsWUFBbkI7O0FBRU8sU0FBU0QsaUJBQVQsQ0FBMkJwQixPQUEzQixFQUFvQztBQUN2QztBQUNBLFdBQVEsQ0FBQ0EsT0FBRixHQUNQRixRQUFRRyxNQUFSLENBQWUsd0JBQWYsQ0FETyxHQUVQLFVBQUNZLFlBQUQsRUFBa0I7QUFDZCxlQUFRLENBQUNBLFlBQUYsR0FDUGYsUUFBUUcsTUFBUixDQUFlLDZCQUFmLENBRE8sR0FFUCxVQUFDcUIsUUFBRCxFQUFjO0FBQ1YsbUJBQVEsQ0FBQ0EsUUFBRixHQUNQeEIsUUFBUUcsTUFBUixDQUFlLHlCQUFmLENBRE8sR0FFUCxVQUFDc0IsZUFBRCxFQUFxQjtBQUNqQix1QkFBUSxDQUFDQSxlQUFGLEdBQ1B6QixRQUFRRyxNQUFSLENBQWUsZ0NBQWYsQ0FETyxHQUVQLElBQUlILE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVFLE1BQVYsRUFBcUI7QUFDN0J1Qiw0QkFBUUMsR0FBUixDQUFZRixlQUFaO0FBQ0Esd0RBQWVWLFlBQWYsSUFDQ0wsSUFERCxDQUNNLG9CQUFZO0FBQ2QsNEJBQUk7QUFDQSxtQ0FBT2tCLFNBQ05DLE1BRE0sQ0FDQztBQUFBLHVDQUFnQixDQUFDQyxXQUFGLEdBQWlCLEtBQWpCLEdBQXlCLElBQXhDO0FBQUEsNkJBREQsRUFFTkMsR0FGTSxDQUVGO0FBQUEsdUNBQWUsZ0RBQXFCRCxXQUFyQixFQUFrQzVCLE9BQWxDLEVBQ2ZRLElBRGUsQ0FDVix1QkFBZTtBQUNqQix3Q0FBSXNCLGdCQUFnQlQsVUFBcEIsRUFBZ0M7QUFDNUIsZ0dBQXlCckIsT0FBekIsRUFBa0NzQixRQUFsQyxFQUE0Q00sV0FBNUMsRUFBeURMLGVBQXpELEVBQ0NmLElBREQsQ0FDTSxxQkFBYTtBQUNmZ0Isb0RBQVFDLEdBQVIsZ0JBQXlCTSxTQUF6QjtBQUNBaEMsb0RBQVFnQyxTQUFSO0FBQ0gseUNBSkQ7QUFLSDtBQUNKLGlDQVRlLENBQWY7QUFBQSw2QkFGRSxDQUFQO0FBYUgseUJBZEQsQ0FjRSxPQUFNcEIsR0FBTixFQUFXO0FBQ1RWLG1DQUFPVSxHQUFQO0FBQ0g7QUFDSixxQkFuQkQ7QUFvQkgsaUJBdEJELENBRkE7QUF5QkgsYUE1QkQ7QUE2QkgsU0FoQ0Q7QUFpQ0gsS0FwQ0Q7QUFxQ0gsQzs7Ozs7OztBQy9DRDs7Ozs7UUFFZ0JxQix3QixHQUFBQSx3QjtBQUFULFNBQVNBLHdCQUFULENBQWtDaEMsT0FBbEMsRUFBMkM7QUFDOUN3QixZQUFRQyxHQUFSLENBQVksMEJBQVo7QUFDQTtBQUNBLFdBQVEsQ0FBQ3pCLE9BQUYsR0FDUEYsUUFBUUcsTUFBUixDQUFlLHdCQUFmLENBRE8sR0FFUCxVQUFDcUIsUUFBRCxFQUFjO0FBQ1YsZUFBUSxDQUFDQSxRQUFGLEdBQ1B4QixRQUFRRyxNQUFSLENBQWUseUJBQWYsQ0FETyxHQUVQLFVBQUNnQyxlQUFELEVBQXFCO0FBQ2pCVCxvQkFBUUMsR0FBUixlQUF3QkgsUUFBeEI7QUFDQUUsb0JBQVFDLEdBQVIsc0JBQStCUSxlQUEvQjtBQUNBLGdCQUFJQyxjQUFjbEMsUUFBUUssR0FBUixDQUFZQyxXQUFaLENBQXdCMkIsZUFBeEIsQ0FBbEI7QUFDQSxnQkFBSUUsYUFBYUQsWUFBWTNCLElBQVosQ0FBaUIsQ0FBakIsQ0FBakI7QUFDQSxtQkFBUSxDQUFDNEIsVUFBRixHQUNQckMsUUFBUUcsTUFBUixDQUFlLElBQUltQyxLQUFKLENBQVUseUJBQVYsQ0FBZixDQURPLEdBRVAsVUFBQ2IsZUFBRCxFQUFxQjtBQUNqQix1QkFBUSxDQUFDQSxlQUFGLEdBQ1B6QixRQUFRRyxNQUFSLENBQWUsSUFBSW1DLEtBQUosQ0FBVSx5QkFBVixDQUFmLENBRE8sR0FFUCxJQUFJdEMsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUUsTUFBVixFQUFxQjtBQUM3Qix3QkFBSTtBQUNBLDRCQUFJUyxVQUFVVixRQUFRVSxPQUFSLENBQWdCSixXQUFoQixDQUE0QmlCLGVBQTVCLENBQWQ7QUFDQSw0QkFBSSxDQUFDdkIsUUFBUXFDLE9BQWIsRUFBc0I7QUFDdEJiLG9DQUFRQyxHQUFSLENBQVksd0JBQVo7QUFDQUQsb0NBQVFDLEdBQVIsQ0FBWVUsV0FBV0csS0FBdkI7QUFDQXRDLG9DQUFRdUMsY0FBUixDQUF1QkosVUFBdkIsRUFBbUN6QixPQUFuQyxFQUNDRixJQURELENBQ00sa0JBQVU7QUFDWmdCLHdDQUFRQyxHQUFSLENBQVllLE1BQVo7QUFDQXpDLHdDQUFReUMsTUFBUjtBQUNDLDZCQUpMO0FBS0UseUJBUkYsTUFRUTtBQUNKaEIsb0NBQVFDLEdBQVIsQ0FBWSxpQkFBWjtBQUNBekIsb0NBQVFxQyxPQUFSLENBQWdCLEVBQUUsV0FBVzNCLE9BQWIsRUFBc0IsY0FBY3lCLFVBQXBDLEVBQWhCLEVBQ0MzQixJQURELENBQ00sa0JBQVU7QUFDWmdCLHdDQUFRQyxHQUFSLENBQVllLE9BQU9DLElBQW5CO0FBQ0ExQyx3Q0FBUXlDLE9BQU9DLElBQWY7QUFDSCw2QkFKRDtBQUtIO0FBQ0oscUJBbEJELENBa0JFLE9BQU05QixHQUFOLEVBQVc7QUFDVDtBQUNBViwrQkFBT1UsR0FBUDtBQUNIO0FBQ0osaUJBdkJELENBRkE7QUEwQkgsYUE3QkQ7QUE4QkgsU0FyQ0Q7QUFzQ0gsS0F6Q0Q7QUEwQ0gsQzs7Ozs7OztBQy9DRDs7Ozs7UUFFZ0IrQixnQixHQUFBQSxnQjtBQUFULFNBQVNBLGdCQUFULENBQTBCN0MsT0FBMUIsRUFBbUM7QUFDdEMsV0FBUSxDQUFDQSxPQUFGLEdBQ1BDLFFBQVFHLE1BQVIsQ0FBZSx1QkFBZixDQURPLEdBRVAsVUFBQ0QsT0FBRCxFQUFhO0FBQ1QsZUFBUSxDQUFDQSxPQUFGLEdBQ1BGLFFBQVFHLE1BQVIsQ0FBZSx3QkFBZixDQURPLEdBRVAsSUFBSUgsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUUsTUFBVixFQUFxQjtBQUM3QixnQkFBTTBDLFlBQVksV0FBbEI7QUFDQSxnQkFBTXRCLGFBQWEsWUFBbkI7QUFDQSxnQkFBSTtBQUNBLG9CQUFJYSxjQUFjbEMsUUFBUUssR0FBUixDQUFZQyxXQUFaLENBQXdCVCxPQUF4QixDQUFsQjtBQUNBLG9CQUFJc0MsYUFBYUQsWUFBWTNCLElBQVosQ0FBaUIsQ0FBakIsQ0FBakI7QUFDQSxvQkFBSTRCLFdBQVdTLFFBQVgsR0FBc0JDLEtBQXRCLE9BQWtDVixXQUFXVSxLQUFYLEVBQXRDLEVBQTJEO0FBQ3ZEOUMsNEJBQVFzQixVQUFSO0FBQ0gsaUJBRkQsTUFFTztBQUNIdEIsNEJBQVE0QyxTQUFSO0FBQ0g7QUFDSixhQVJELENBUUUsT0FBT0csS0FBUCxFQUFjO0FBQ1o3Qyx1QkFBTzZDLEtBQVA7QUFDSDtBQUNKLFNBZEQsQ0FGQTtBQWlCSCxLQXBCRDtBQXFCSCxDOzs7Ozs7O0FDeEJEOzs7OztRQUVnQkMsZ0IsR0FBQUEsZ0I7QUFBVCxTQUFTQSxnQkFBVCxDQUEwQi9DLE9BQTFCLEVBQW1DO0FBQ3RDO0FBQ0EsV0FBUSxDQUFDQSxPQUFGLEdBQ1BGLFFBQVFHLE1BQVIsQ0FBZSx3QkFBZixDQURPLEdBRVAsVUFBQytDLGNBQUQsRUFBb0I7QUFDaEIsZUFBUSxDQUFDQSxjQUFGLEdBQ1BsRCxRQUFRRyxNQUFSLENBQWUsMkJBQWYsQ0FETyxHQUVQLFVBQUNnRCxTQUFELEVBQWU7QUFDWCxtQkFBUSxDQUFDQSxTQUFGLEdBQ1BuRCxRQUFRRyxNQUFSLENBQWUsMEJBQWYsQ0FETyxHQUVQLElBQUlILE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVFLE1BQVYsRUFBcUI7QUFDN0Isb0JBQUlpRCxZQUFZbEQsUUFBUUssR0FBUixDQUFZQyxXQUFaLENBQXdCMEMsY0FBeEIsQ0FBaEI7QUFDQTs7Ozs7Ozs7OztBQVVBLG9CQUFJO0FBQ0E7QUFDQWhELDRCQUFRbUQsY0FBUixDQUF1QkQsVUFBVTNDLElBQVYsQ0FBZSxDQUFmLENBQXZCLEVBQTBDMEMsU0FBMUMsRUFDQ3pDLElBREQsQ0FDTSx3QkFBZ0I7QUFDbEJULGdDQUFRcUQsWUFBUjtBQUNILHFCQUhELEVBSUNDLEtBSkQ7QUFLSCxpQkFQRCxDQU9FLE9BQU0xQyxHQUFOLEVBQVc7QUFDVDtBQUNBLHdCQUFJMkMsVUFBVTtBQUNWYiw4QkFBTVEsU0FESTtBQUVWTSxvQ0FBWXZELFFBQVFLLEdBQVIsQ0FBWUMsV0FBWixDQUF3QjBDLGNBQXhCLEVBQXdDekMsSUFGMUM7QUFHVnNDLCtCQUFPO0FBSEcscUJBQWQ7QUFLQTdDLDRCQUFRd0QsT0FBUixDQUFnQkYsT0FBaEIsRUFDQzlDLElBREQsQ0FDTSxVQUFDaUQsVUFBRCxFQUFnQjtBQUNsQjFELGdDQUFRMEQsV0FBV2hCLElBQW5CO0FBQ0gscUJBSEQ7QUFJSDtBQUNKLGFBL0JELENBRkE7QUFrQ0gsU0FyQ0Q7QUFzQ0gsS0F6Q0Q7QUEwQ0gsQzs7Ozs7OztBQzlDRDs7Ozs7UUFRZ0JpQixxQixHQUFBQSxxQjs7QUFOaEI7O0FBQ0E7O0FBQ0E7O0FBRUEsSUFBTWYsWUFBWSxXQUFsQjs7QUFFTyxTQUFTZSxxQkFBVCxDQUErQjdELE9BQS9CLEVBQXdDO0FBQzNDO0FBQ0EsV0FBUSxDQUFDQSxPQUFGLEdBQ1BDLFFBQVFHLE1BQVIsQ0FBZSx3QkFBZixDQURPLEdBRVAsVUFBQ0QsT0FBRCxFQUFhO0FBQ1QsZUFBUSxDQUFDQSxPQUFGLEdBQ1BGLFFBQVFHLE1BQVIsQ0FBZSx3QkFBZixDQURPLEdBRVAsVUFBQ1ksWUFBRCxFQUFrQjtBQUNkLG1CQUFRLENBQUNBLFlBQUYsR0FDUGYsUUFBUUcsTUFBUixDQUFlLDZCQUFmLENBRE8sR0FFUCxJQUFJSCxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVRSxNQUFWLEVBQXFCO0FBQzdCLG9CQUFJO0FBQ0Esd0RBQWVZLFlBQWYsSUFDQ0wsSUFERCxDQUNNLFVBQUNtRCxVQUFELEVBQWdCO0FBQ2xCO0FBQ0EsNEJBQUlDLGdCQUFnQixFQUFwQjtBQUNBLDRCQUFJN0MsSUFBSTRDLFdBQVczQyxNQUFuQjtBQUNBLDRCQUFJNkMsTUFBTSxDQUFWO0FBQ0FGLG1DQUNDOUIsR0FERCxDQUNLLFVBQUNELFdBQUQsRUFBaUI7QUFDbEJiO0FBQ0EsbUNBQU9hLFdBQVA7QUFDSCx5QkFKRCxFQUtDRCxNQUxELENBS1E7QUFBQSxtQ0FBZ0IsQ0FBQ0MsV0FBRixHQUFpQixLQUFqQixHQUF5QixJQUF4QztBQUFBLHlCQUxSLEVBTUNDLEdBTkQsQ0FNSyxVQUFDRCxXQUFELEVBQWlCO0FBQ2xCLDRFQUFxQkEsV0FBckIsRUFBa0M1QixPQUFsQyxFQUNDUSxJQURELENBQ00sVUFBQ3NCLFdBQUQsRUFBaUI7QUFDbkIsb0NBQUlBLGdCQUFnQmEsU0FBcEIsRUFBK0I7QUFDM0IsNEVBQWlCM0MsT0FBakIsRUFBMEI0QixXQUExQixFQUF1Qy9CLE9BQXZDLEVBQ0NXLElBREQsQ0FDTSxVQUFDc0QsU0FBRCxFQUFlO0FBQ2pCRixzREFBY0MsR0FBZCxJQUFxQkMsU0FBckI7QUFDQUQ7QUFDQSw0Q0FBSTlDLE1BQU0sQ0FBVixFQUFhO0FBQ1RoQixvREFBUTZELGFBQVI7QUFDSDtBQUNKLHFDQVBEO0FBUUg7QUFDSiw2QkFaRDtBQWFILHlCQXBCRDtBQXFCSCxxQkEzQkQ7QUE0QkgsaUJBN0JELENBNkJFLE9BQU9qRCxHQUFQLEVBQVk7QUFDVlYsMkJBQVEsSUFBSW1DLEtBQUosQ0FBV3pCLEdBQVgsQ0FBUjtBQUNIO0FBQ0osYUFqQ0QsQ0FGQTtBQW9DSCxTQXZDRDtBQXdDSCxLQTNDRDtBQTRDSCxDOzs7Ozs7OytDQ3RERDs7Ozs7UUFFZ0JvRCxjLEdBQUFBLGM7QUFBVCxTQUFTQSxjQUFULENBQXdCQyxXQUF4QixFQUFxQztBQUN4QztBQUNBO0FBQ0EsV0FBUSxDQUFDQSxXQUFGLEdBQ1BsRSxRQUFRRyxNQUFSLENBQWUsNEJBQWYsQ0FETyxHQUVQLFVBQUNELE9BQUQsRUFBYTtBQUNULGVBQVEsQ0FBQ0EsT0FBRixHQUNQRixRQUFRRyxNQUFSLENBQWUsd0JBQWYsQ0FETyxHQUVQLFVBQUNZLFlBQUQsRUFBa0I7QUFDZCxtQkFBUSxDQUFDQSxZQUFGLEdBQ1BmLFFBQVFHLE1BQVIsQ0FBZSw2QkFBZixDQURPLEdBRVAsSUFBSUgsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUUsTUFBVixFQUFxQjtBQUM3QixvQkFBSTtBQUNBLHdCQUFJZ0UsU0FBU2pFLFFBQVFLLEdBQVIsQ0FBWUMsV0FBWixDQUF3QjBELFdBQXhCLENBQWI7QUFDQW5ELGlDQUFhcUQsT0FBYixDQUFxQkQsT0FBTzFELElBQVAsQ0FBWSxDQUFaLEVBQWUrQixLQUFmLENBQXFCLENBQXJCLEVBQXdCNkIsTUFBeEIsQ0FBK0JDLE1BQXBELEVBQTRESixXQUE1RDtBQUNBSyw0QkFBUUMsWUFBUixDQUNJdkUsc0NBQW9Da0UsT0FBTzFELElBQVAsQ0FBWSxDQUFaLEVBQWUrQixLQUFmLENBQXFCLENBQXJCLEVBQXdCNkIsTUFBeEIsQ0FBK0JDLE1BQW5FLENBREo7QUFHSCxpQkFORCxDQU1FLE9BQU16RCxHQUFOLEVBQVc7QUFDVFYsMkJBQU9VLEdBQVA7QUFDSDtBQUNKLGFBVkQsQ0FGQTtBQWFILFNBaEJEO0FBaUJILEtBcEJEO0FBcUJILEM7Ozs7Ozs7O0FDMUJEOzs7OztRQUtnQjRELGEsR0FBQUEsYTs7QUFIaEI7O0FBQ0E7O0FBRU8sU0FBU0EsYUFBVCxDQUF1QlAsV0FBdkIsRUFBb0M7QUFDdkM7QUFDQTtBQUNBLFdBQVEsQ0FBQ0EsV0FBRixHQUNQbEUsUUFBUUcsTUFBUixDQUFlLDRCQUFmLENBRE8sR0FFUCxVQUFDRCxPQUFELEVBQWE7QUFDVCxlQUFRLENBQUNBLE9BQUYsR0FDUEYsUUFBUUcsTUFBUixDQUFlLHdCQUFmLENBRE8sR0FFUCxVQUFDWSxZQUFELEVBQWtCO0FBQ2QsbUJBQVEsQ0FBQ0EsWUFBRixHQUNQZixRQUFRRyxNQUFSLENBQWUsNkJBQWYsQ0FETyxHQUVQLElBQUlILE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVFLE1BQVYsRUFBcUI7QUFDN0Isb0JBQUlnRSxTQUFTakUsUUFBUUssR0FBUixDQUFZQyxXQUFaLENBQXdCMEQsV0FBeEIsQ0FBYjtBQUNBLG9EQUFlbkQsWUFBZixFQUE2Qm9ELE9BQU8xRCxJQUFQLENBQVksQ0FBWixFQUFlK0IsS0FBZixDQUFxQixDQUFyQixFQUF3QjZCLE1BQXhCLENBQStCQyxNQUE1RCxFQUNDNUQsSUFERCxDQUNNLHVCQUFlO0FBQ2pCLDJCQUFRLENBQUNnRSxXQUFGLEdBQ1AxRSxRQUFRQyxPQUFSLENBQWdCLE1BQWhCLENBRE8sR0FFUCxnREFBcUJ5RSxXQUFyQixFQUFrQ3hFLE9BQWxDLENBRkE7QUFHSCxpQkFMRCxFQU1DUSxJQU5ELENBTU0sMkJBQW1CO0FBQ3JCLHdCQUFJaUUsb0JBQW9CLFlBQXhCLEVBQXFDO0FBQ2pDMUUsZ0NBQVEsK0NBQVI7QUFDSCxxQkFGRCxNQUVPO0FBQ0hjLHFDQUFhcUQsT0FBYixDQUFxQkQsT0FBTzFELElBQVAsQ0FBWSxDQUFaLEVBQWUrQixLQUFmLENBQXFCLENBQXJCLEVBQXdCNkIsTUFBeEIsQ0FBK0JDLE1BQXBELEVBQTRESixXQUE1RDtBQUNBakUsNkRBQW1Da0UsT0FBTzFELElBQVAsQ0FBWSxDQUFaLEVBQWUrQixLQUFmLENBQXFCLENBQXJCLEVBQXdCNkIsTUFBeEIsQ0FBK0JDLE1BQWxFO0FBQ0g7QUFDSixpQkFiRCxFQWNDZixLQWRELENBY08sVUFBQzFDLEdBQUQ7QUFBQSwyQkFBU1YsT0FBT1UsR0FBUCxDQUFUO0FBQUEsaUJBZFA7QUFlSCxhQWpCRCxDQUZBO0FBb0JILFNBdkJEO0FBd0JILEtBM0JEO0FBNEJILEM7Ozs7Ozs7Ozs7O0FDcENELENBQUUsYUFBVTs7QUFFWDtBQUNBLEtBQUkrRCxJQUFKO0FBQ0EsS0FBRyxPQUFPQyxNQUFQLEtBQWtCLFdBQXJCLEVBQWlDO0FBQUVELFNBQU9DLE1BQVA7QUFBZTtBQUNsRCxLQUFHLE9BQU9DLE1BQVAsS0FBa0IsV0FBckIsRUFBaUM7QUFBRUYsU0FBT0UsTUFBUDtBQUFlO0FBQ2xERixRQUFPQSxRQUFRLEVBQWY7QUFDQSxLQUFJbEQsVUFBVWtELEtBQUtsRCxPQUFMLElBQWdCLEVBQUNDLEtBQUssZUFBVSxDQUFFLENBQWxCLEVBQTlCO0FBQ0EsVUFBU29ELE9BQVQsQ0FBaUJDLEdBQWpCLEVBQXFCO0FBQ3BCLFNBQU9BLElBQUlDLEtBQUosR0FBV0YsUUFBUTlFLFFBQVErRSxHQUFSLENBQVIsQ0FBWCxHQUFtQyxVQUFTRSxHQUFULEVBQWNDLElBQWQsRUFBbUI7QUFDNURILE9BQUlFLE1BQU0sRUFBQ0UsU0FBUyxFQUFWLEVBQVY7QUFDQUwsV0FBUTlFLFFBQVFrRixJQUFSLENBQVIsSUFBeUJELElBQUlFLE9BQTdCO0FBQ0EsR0FIRDtBQUlBLFdBQVNuRixPQUFULENBQWlCa0YsSUFBakIsRUFBc0I7QUFDckIsVUFBT0EsS0FBS0UsS0FBTCxDQUFXLEdBQVgsRUFBZ0JKLEtBQWhCLENBQXNCLENBQUMsQ0FBdkIsRUFBMEJLLFFBQTFCLEdBQXFDQyxPQUFyQyxDQUE2QyxLQUE3QyxFQUFtRCxFQUFuRCxDQUFQO0FBQ0E7QUFDRDtBQUNELEtBQUcsSUFBSCxFQUFpQztBQUFFLE1BQUlDLFNBQVNDLE1BQWI7QUFBcUI7QUFDeEQ7O0FBRUEsRUFBQ1YsUUFBUSxVQUFTVSxNQUFULEVBQWdCO0FBQ3hCO0FBQ0EsTUFBSUMsT0FBTyxFQUFYO0FBQ0E7QUFDQUEsT0FBS0MsR0FBTCxHQUFXRCxLQUFLRSxFQUFMLEdBQVUsRUFBQ0MsSUFBSSxZQUFTRCxFQUFULEVBQVk7QUFBRSxXQUFRLENBQUMsQ0FBQ0EsRUFBRixJQUFRLGNBQWMsT0FBT0EsRUFBckM7QUFBMEMsSUFBN0QsRUFBckI7QUFDQUYsT0FBS0ksRUFBTCxHQUFVLEVBQUNELElBQUksWUFBU0UsQ0FBVCxFQUFXO0FBQUUsV0FBUUEsYUFBYUMsT0FBYixJQUF3QixPQUFPRCxDQUFQLElBQVksU0FBNUM7QUFBd0QsSUFBMUUsRUFBVjtBQUNBTCxPQUFLTyxHQUFMLEdBQVcsRUFBQ0osSUFBSSxZQUFTSyxDQUFULEVBQVc7QUFBRSxXQUFPLENBQUNDLFFBQVFELENBQVIsQ0FBRCxLQUFpQkEsSUFBSUUsV0FBV0YsQ0FBWCxDQUFKLEdBQW9CLENBQXJCLElBQTJCLENBQTNCLElBQWdDRyxhQUFhSCxDQUE3QyxJQUFrRCxDQUFDRyxRQUFELEtBQWNILENBQWhGLENBQVA7QUFBMkYsSUFBN0csRUFBWDtBQUNBUixPQUFLWSxJQUFMLEdBQVksRUFBQ1QsSUFBSSxZQUFTVSxDQUFULEVBQVc7QUFBRSxXQUFRLE9BQU9BLENBQVAsSUFBWSxRQUFwQjtBQUErQixJQUFqRCxFQUFaO0FBQ0FiLE9BQUtZLElBQUwsQ0FBVUUsR0FBVixHQUFnQixVQUFTRCxDQUFULEVBQVc7QUFDMUIsT0FBR2IsS0FBS1ksSUFBTCxDQUFVVCxFQUFWLENBQWFVLENBQWIsQ0FBSCxFQUFtQjtBQUFFLFdBQU9BLENBQVA7QUFBVTtBQUMvQixPQUFHLE9BQU9FLElBQVAsS0FBZ0IsV0FBbkIsRUFBK0I7QUFBRSxXQUFPQSxLQUFLQyxTQUFMLENBQWVILENBQWYsQ0FBUDtBQUEwQjtBQUMzRCxVQUFRQSxLQUFLQSxFQUFFakIsUUFBUixHQUFtQmlCLEVBQUVqQixRQUFGLEVBQW5CLEdBQWtDaUIsQ0FBekM7QUFDQSxHQUpEO0FBS0FiLE9BQUtZLElBQUwsQ0FBVUssTUFBVixHQUFtQixVQUFTQyxDQUFULEVBQVlDLENBQVosRUFBYztBQUNoQyxPQUFJQyxJQUFJLEVBQVI7QUFDQUYsT0FBSUEsS0FBSyxFQUFULENBRmdDLENBRW5CO0FBQ2JDLE9BQUlBLEtBQUssK0RBQVQ7QUFDQSxVQUFNRCxJQUFJLENBQVYsRUFBWTtBQUFFRSxTQUFLRCxFQUFFRSxNQUFGLENBQVNDLEtBQUtDLEtBQUwsQ0FBV0QsS0FBS0wsTUFBTCxLQUFnQkUsRUFBRTNGLE1BQTdCLENBQVQsQ0FBTCxDQUFxRDBGO0FBQUs7QUFDeEUsVUFBT0UsQ0FBUDtBQUNBLEdBTkQ7QUFPQXBCLE9BQUtZLElBQUwsQ0FBVVksS0FBVixHQUFrQixVQUFTWCxDQUFULEVBQVlZLENBQVosRUFBYztBQUFFLE9BQUlDLElBQUksS0FBUjtBQUNqQ2IsT0FBSUEsS0FBSyxFQUFUO0FBQ0FZLE9BQUl6QixLQUFLWSxJQUFMLENBQVVULEVBQVYsQ0FBYXNCLENBQWIsSUFBaUIsRUFBQyxLQUFLQSxDQUFOLEVBQWpCLEdBQTRCQSxLQUFLLEVBQXJDLENBRitCLENBRVU7QUFDekMsT0FBR3pCLEtBQUsyQixHQUFMLENBQVNDLEdBQVQsQ0FBYUgsQ0FBYixFQUFlLEdBQWYsQ0FBSCxFQUF1QjtBQUFFWixRQUFJQSxFQUFFZ0IsV0FBRixFQUFKLENBQXFCSixFQUFFLEdBQUYsSUFBUyxDQUFDQSxFQUFFLEdBQUYsS0FBVUEsRUFBRSxHQUFGLENBQVgsRUFBbUJJLFdBQW5CLEVBQVQ7QUFBMkM7QUFDekYsT0FBRzdCLEtBQUsyQixHQUFMLENBQVNDLEdBQVQsQ0FBYUgsQ0FBYixFQUFlLEdBQWYsQ0FBSCxFQUF1QjtBQUFFLFdBQU9aLE1BQU1ZLEVBQUUsR0FBRixDQUFiO0FBQXFCO0FBQzlDLE9BQUd6QixLQUFLMkIsR0FBTCxDQUFTQyxHQUFULENBQWFILENBQWIsRUFBZSxHQUFmLENBQUgsRUFBdUI7QUFBRSxRQUFHWixFQUFFdEIsS0FBRixDQUFRLENBQVIsRUFBV2tDLEVBQUUsR0FBRixFQUFPakcsTUFBbEIsTUFBOEJpRyxFQUFFLEdBQUYsQ0FBakMsRUFBd0M7QUFBRUMsU0FBSSxJQUFKLENBQVViLElBQUlBLEVBQUV0QixLQUFGLENBQVFrQyxFQUFFLEdBQUYsRUFBT2pHLE1BQWYsQ0FBSjtBQUE0QixLQUFoRixNQUFzRjtBQUFFLFlBQU8sS0FBUDtBQUFjO0FBQUM7QUFDaEksT0FBR3dFLEtBQUsyQixHQUFMLENBQVNDLEdBQVQsQ0FBYUgsQ0FBYixFQUFlLEdBQWYsQ0FBSCxFQUF1QjtBQUFFLFFBQUdaLEVBQUV0QixLQUFGLENBQVEsQ0FBQ2tDLEVBQUUsR0FBRixFQUFPakcsTUFBaEIsTUFBNEJpRyxFQUFFLEdBQUYsQ0FBL0IsRUFBc0M7QUFBRUMsU0FBSSxJQUFKO0FBQVUsS0FBbEQsTUFBd0Q7QUFBRSxZQUFPLEtBQVA7QUFBYztBQUFDO0FBQ2xHLE9BQUcxQixLQUFLMkIsR0FBTCxDQUFTQyxHQUFULENBQWFILENBQWIsRUFBZSxHQUFmLENBQUgsRUFBdUI7QUFDdEIsUUFBR3pCLEtBQUs4QixJQUFMLENBQVV6RixHQUFWLENBQWMyRCxLQUFLOEIsSUFBTCxDQUFVM0IsRUFBVixDQUFhc0IsRUFBRSxHQUFGLENBQWIsSUFBc0JBLEVBQUUsR0FBRixDQUF0QixHQUErQixDQUFDQSxFQUFFLEdBQUYsQ0FBRCxDQUE3QyxFQUF1RCxVQUFTTSxDQUFULEVBQVc7QUFDcEUsU0FBR2xCLEVBQUVtQixPQUFGLENBQVVELENBQVYsS0FBZ0IsQ0FBbkIsRUFBcUI7QUFBRUwsVUFBSSxJQUFKO0FBQVUsTUFBakMsTUFBdUM7QUFBRSxhQUFPLElBQVA7QUFBYTtBQUN0RCxLQUZFLENBQUgsRUFFRztBQUFFLFlBQU8sS0FBUDtBQUFjO0FBQ25CO0FBQ0QsT0FBRzFCLEtBQUsyQixHQUFMLENBQVNDLEdBQVQsQ0FBYUgsQ0FBYixFQUFlLEdBQWYsQ0FBSCxFQUF1QjtBQUN0QixRQUFHekIsS0FBSzhCLElBQUwsQ0FBVXpGLEdBQVYsQ0FBYzJELEtBQUs4QixJQUFMLENBQVUzQixFQUFWLENBQWFzQixFQUFFLEdBQUYsQ0FBYixJQUFzQkEsRUFBRSxHQUFGLENBQXRCLEdBQStCLENBQUNBLEVBQUUsR0FBRixDQUFELENBQTdDLEVBQXVELFVBQVNNLENBQVQsRUFBVztBQUNwRSxTQUFHbEIsRUFBRW1CLE9BQUYsQ0FBVUQsQ0FBVixJQUFlLENBQWxCLEVBQW9CO0FBQUVMLFVBQUksSUFBSjtBQUFVLE1BQWhDLE1BQXNDO0FBQUUsYUFBTyxJQUFQO0FBQWE7QUFDckQsS0FGRSxDQUFILEVBRUc7QUFBRSxZQUFPLEtBQVA7QUFBYztBQUNuQjtBQUNELE9BQUcxQixLQUFLMkIsR0FBTCxDQUFTQyxHQUFULENBQWFILENBQWIsRUFBZSxHQUFmLENBQUgsRUFBdUI7QUFBRSxRQUFHWixJQUFJWSxFQUFFLEdBQUYsQ0FBUCxFQUFjO0FBQUVDLFNBQUksSUFBSjtBQUFVLEtBQTFCLE1BQWdDO0FBQUUsWUFBTyxLQUFQO0FBQWM7QUFBQztBQUMxRSxPQUFHMUIsS0FBSzJCLEdBQUwsQ0FBU0MsR0FBVCxDQUFhSCxDQUFiLEVBQWUsR0FBZixDQUFILEVBQXVCO0FBQUUsUUFBR1osSUFBSVksRUFBRSxHQUFGLENBQVAsRUFBYztBQUFFQyxTQUFJLElBQUo7QUFBVSxLQUExQixNQUFnQztBQUFFLFlBQU8sS0FBUDtBQUFjO0FBQUM7QUFDMUUsWUFBU08sS0FBVCxDQUFlcEIsQ0FBZixFQUFpQnFCLENBQWpCLEVBQW1CO0FBQUUsUUFBSTFCLElBQUksQ0FBQyxDQUFUO0FBQUEsUUFBWWpGLElBQUksQ0FBaEI7QUFBQSxRQUFtQjRGLENBQW5CLENBQXNCLE9BQUtBLElBQUllLEVBQUUzRyxHQUFGLENBQVQsR0FBaUI7QUFBRSxTQUFHLENBQUMsRUFBRWlGLElBQUlLLEVBQUVtQixPQUFGLENBQVViLENBQVYsRUFBYVgsSUFBRSxDQUFmLENBQU4sQ0FBSixFQUE2QjtBQUFFLGFBQU8sS0FBUDtBQUFjO0FBQUMsS0FBQyxPQUFPLElBQVA7QUFBYSxJQW5CM0YsQ0FtQjRGO0FBQzNILE9BQUdSLEtBQUsyQixHQUFMLENBQVNDLEdBQVQsQ0FBYUgsQ0FBYixFQUFlLEdBQWYsQ0FBSCxFQUF1QjtBQUFFLFFBQUdRLE1BQU1wQixDQUFOLEVBQVNZLEVBQUUsR0FBRixDQUFULENBQUgsRUFBb0I7QUFBRUMsU0FBSSxJQUFKO0FBQVUsS0FBaEMsTUFBc0M7QUFBRSxZQUFPLEtBQVA7QUFBYztBQUFDLElBcEJqRCxDQW9Ca0Q7QUFDakYsVUFBT0EsQ0FBUDtBQUNBLEdBdEJEO0FBdUJBMUIsT0FBSzhCLElBQUwsR0FBWSxFQUFDM0IsSUFBSSxZQUFTZSxDQUFULEVBQVc7QUFBRSxXQUFRQSxhQUFhaUIsS0FBckI7QUFBNkIsSUFBL0MsRUFBWjtBQUNBbkMsT0FBSzhCLElBQUwsQ0FBVU0sSUFBVixHQUFpQkQsTUFBTUUsU0FBTixDQUFnQjlDLEtBQWpDO0FBQ0FTLE9BQUs4QixJQUFMLENBQVVRLElBQVYsR0FBaUIsVUFBU0MsQ0FBVCxFQUFXO0FBQUU7QUFDN0IsVUFBTyxVQUFTQyxDQUFULEVBQVdDLENBQVgsRUFBYTtBQUNuQixRQUFHLENBQUNELENBQUQsSUFBTSxDQUFDQyxDQUFWLEVBQVk7QUFBRSxZQUFPLENBQVA7QUFBVSxLQUFDRCxJQUFJQSxFQUFFRCxDQUFGLENBQUosQ0FBVUUsSUFBSUEsRUFBRUYsQ0FBRixDQUFKO0FBQ25DLFFBQUdDLElBQUlDLENBQVAsRUFBUztBQUFFLFlBQU8sQ0FBQyxDQUFSO0FBQVcsS0FBdEIsTUFBMkIsSUFBR0QsSUFBSUMsQ0FBUCxFQUFTO0FBQUUsWUFBTyxDQUFQO0FBQVUsS0FBckIsTUFDdEI7QUFBRSxZQUFPLENBQVA7QUFBVTtBQUNqQixJQUpEO0FBS0EsR0FORDtBQU9BekMsT0FBSzhCLElBQUwsQ0FBVXpGLEdBQVYsR0FBZ0IsVUFBUzZFLENBQVQsRUFBWUMsQ0FBWixFQUFldUIsQ0FBZixFQUFpQjtBQUFFLFVBQU9DLFFBQVF6QixDQUFSLEVBQVdDLENBQVgsRUFBY3VCLENBQWQsQ0FBUDtBQUF5QixHQUE1RDtBQUNBMUMsT0FBSzhCLElBQUwsQ0FBVWMsS0FBVixHQUFrQixDQUFsQixDQXJEd0IsQ0FxREg7QUFDckI1QyxPQUFLMkIsR0FBTCxHQUFXLEVBQUN4QixJQUFJLFlBQVNzQixDQUFULEVBQVc7QUFBRSxXQUFPQSxJQUFJQSxhQUFhb0IsTUFBYixJQUF1QnBCLEVBQUVxQixXQUFGLEtBQWtCRCxNQUExQyxJQUFxREEsT0FBT1IsU0FBUCxDQUFpQnpDLFFBQWpCLENBQTBCbUQsSUFBMUIsQ0FBK0J0QixDQUEvQixFQUFrQ0QsS0FBbEMsQ0FBd0Msb0JBQXhDLEVBQThELENBQTlELE1BQXFFLFFBQTdILEdBQXdJLEtBQS9JO0FBQXNKLElBQXhLLEVBQVg7QUFDQXhCLE9BQUsyQixHQUFMLENBQVNxQixHQUFULEdBQWUsVUFBU3ZCLENBQVQsRUFBWVMsQ0FBWixFQUFlZSxDQUFmLEVBQWlCO0FBQUUsVUFBTyxDQUFDeEIsS0FBRyxFQUFKLEVBQVFTLENBQVIsSUFBYWUsQ0FBYixFQUFnQnhCLENBQXZCO0FBQTBCLEdBQTVEO0FBQ0F6QixPQUFLMkIsR0FBTCxDQUFTQyxHQUFULEdBQWUsVUFBU0gsQ0FBVCxFQUFZUyxDQUFaLEVBQWM7QUFBRSxVQUFPVCxLQUFLb0IsT0FBT1IsU0FBUCxDQUFpQmEsY0FBakIsQ0FBZ0NILElBQWhDLENBQXFDdEIsQ0FBckMsRUFBd0NTLENBQXhDLENBQVo7QUFBd0QsR0FBdkY7QUFDQWxDLE9BQUsyQixHQUFMLENBQVN3QixHQUFULEdBQWUsVUFBUzFCLENBQVQsRUFBWWMsQ0FBWixFQUFjO0FBQzVCLE9BQUcsQ0FBQ2QsQ0FBSixFQUFNO0FBQUU7QUFBUTtBQUNoQkEsS0FBRWMsQ0FBRixJQUFPLElBQVA7QUFDQSxVQUFPZCxFQUFFYyxDQUFGLENBQVA7QUFDQSxVQUFPZCxDQUFQO0FBQ0EsR0FMRDtBQU1BekIsT0FBSzJCLEdBQUwsQ0FBU3lCLEVBQVQsR0FBYyxVQUFTM0IsQ0FBVCxFQUFZUyxDQUFaLEVBQWVlLENBQWYsRUFBa0JJLENBQWxCLEVBQW9CO0FBQUUsVUFBTzVCLEVBQUVTLENBQUYsSUFBT1QsRUFBRVMsQ0FBRixNQUFTbUIsTUFBTUosQ0FBTixHQUFTLEVBQVQsR0FBY0EsQ0FBdkIsQ0FBZDtBQUF5QyxHQUE3RTtBQUNBakQsT0FBSzJCLEdBQUwsQ0FBU2IsR0FBVCxHQUFlLFVBQVNXLENBQVQsRUFBVztBQUN6QixPQUFHNkIsT0FBTzdCLENBQVAsQ0FBSCxFQUFhO0FBQUUsV0FBT0EsQ0FBUDtBQUFVO0FBQ3pCLE9BQUc7QUFBQ0EsUUFBSVYsS0FBS3dDLEtBQUwsQ0FBVzlCLENBQVgsQ0FBSjtBQUNILElBREQsQ0FDQyxPQUFNK0IsQ0FBTixFQUFRO0FBQUMvQixRQUFFLEVBQUY7QUFBSztBQUNmLFVBQU9BLENBQVA7QUFDQSxHQUxELENBTUUsYUFBVTtBQUFFLE9BQUk0QixDQUFKO0FBQ2IsWUFBU2hILEdBQVQsQ0FBYTRHLENBQWIsRUFBZWYsQ0FBZixFQUFpQjtBQUNoQixRQUFHdUIsUUFBUSxJQUFSLEVBQWF2QixDQUFiLEtBQW1CbUIsTUFBTSxLQUFLbkIsQ0FBTCxDQUE1QixFQUFvQztBQUFFO0FBQVE7QUFDOUMsU0FBS0EsQ0FBTCxJQUFVZSxDQUFWO0FBQ0E7QUFDRGpELFFBQUsyQixHQUFMLENBQVMrQixFQUFULEdBQWMsVUFBU0MsSUFBVCxFQUFlRCxFQUFmLEVBQWtCO0FBQy9CQSxTQUFLQSxNQUFNLEVBQVg7QUFDQWYsWUFBUWdCLElBQVIsRUFBY3RILEdBQWQsRUFBbUJxSCxFQUFuQjtBQUNBLFdBQU9BLEVBQVA7QUFDQSxJQUpEO0FBS0EsR0FWQyxHQUFEO0FBV0QxRCxPQUFLMkIsR0FBTCxDQUFTaUMsSUFBVCxHQUFnQixVQUFTbkMsQ0FBVCxFQUFXO0FBQUU7QUFDNUIsVUFBTyxDQUFDQSxDQUFELEdBQUlBLENBQUosR0FBUVYsS0FBS3dDLEtBQUwsQ0FBV3hDLEtBQUtDLFNBQUwsQ0FBZVMsQ0FBZixDQUFYLENBQWYsQ0FEMEIsQ0FDb0I7QUFDOUMsR0FGRCxDQUdFLGFBQVU7QUFDWCxZQUFTb0MsS0FBVCxDQUFlWixDQUFmLEVBQWlCMUgsQ0FBakIsRUFBbUI7QUFBRSxRQUFJaUYsSUFBSSxLQUFLQSxDQUFiO0FBQ3BCLFFBQUdBLE1BQU1qRixNQUFNaUYsQ0FBTixJQUFZOEMsT0FBTzlDLENBQVAsS0FBYWlELFFBQVFqRCxDQUFSLEVBQVdqRixDQUFYLENBQS9CLENBQUgsRUFBa0Q7QUFBRTtBQUFRO0FBQzVELFFBQUdBLENBQUgsRUFBSztBQUFFLFlBQU8sSUFBUDtBQUFhO0FBQ3BCO0FBQ0R5RSxRQUFLMkIsR0FBTCxDQUFTa0MsS0FBVCxHQUFpQixVQUFTcEMsQ0FBVCxFQUFZakIsQ0FBWixFQUFjO0FBQzlCLFFBQUcsQ0FBQ2lCLENBQUosRUFBTTtBQUFFLFlBQU8sSUFBUDtBQUFhO0FBQ3JCLFdBQU9rQixRQUFRbEIsQ0FBUixFQUFVb0MsS0FBVixFQUFnQixFQUFDckQsR0FBRUEsQ0FBSCxFQUFoQixJQUF3QixLQUF4QixHQUFnQyxJQUF2QztBQUNBLElBSEQ7QUFJQSxHQVRDLEdBQUQ7QUFVRCxHQUFFLGFBQVU7QUFDWCxZQUFTSyxDQUFULENBQVcwQixDQUFYLEVBQWFVLENBQWIsRUFBZTtBQUNkLFFBQUcsTUFBTWEsVUFBVXRJLE1BQW5CLEVBQTBCO0FBQ3pCcUYsT0FBRWEsQ0FBRixHQUFNYixFQUFFYSxDQUFGLElBQU8sRUFBYjtBQUNBYixPQUFFYSxDQUFGLENBQUlhLENBQUosSUFBU1UsQ0FBVDtBQUNBO0FBQ0EsS0FBQ3BDLEVBQUVhLENBQUYsR0FBTWIsRUFBRWEsQ0FBRixJQUFPLEVBQWI7QUFDRmIsTUFBRWEsQ0FBRixDQUFJaEcsSUFBSixDQUFTNkcsQ0FBVDtBQUNBO0FBQ0QsT0FBSXhILE9BQU84SCxPQUFPOUgsSUFBbEI7QUFDQWlGLFFBQUsyQixHQUFMLENBQVN0RixHQUFULEdBQWUsVUFBUzZFLENBQVQsRUFBWUMsQ0FBWixFQUFldUIsQ0FBZixFQUFpQjtBQUMvQixRQUFJVyxDQUFKO0FBQUEsUUFBTzlILElBQUksQ0FBWDtBQUFBLFFBQWN3SSxDQUFkO0FBQUEsUUFBaUJyQyxDQUFqQjtBQUFBLFFBQW9Cc0MsRUFBcEI7QUFBQSxRQUF3QkMsR0FBeEI7QUFBQSxRQUE2Qi9CLElBQUlnQyxNQUFNL0MsQ0FBTixDQUFqQztBQUNBTixNQUFFYSxDQUFGLEdBQU0sSUFBTjtBQUNBLFFBQUczRyxRQUFRdUksT0FBT3BDLENBQVAsQ0FBWCxFQUFxQjtBQUNwQjhDLFVBQUtuQixPQUFPOUgsSUFBUCxDQUFZbUcsQ0FBWixDQUFMLENBQXFCK0MsTUFBTSxJQUFOO0FBQ3JCO0FBQ0QsUUFBR3hELFFBQVFTLENBQVIsS0FBYzhDLEVBQWpCLEVBQW9CO0FBQ25CRCxTQUFJLENBQUNDLE1BQU05QyxDQUFQLEVBQVUxRixNQUFkO0FBQ0EsWUFBS0QsSUFBSXdJLENBQVQsRUFBWXhJLEdBQVosRUFBZ0I7QUFDZixVQUFJNEksS0FBTTVJLElBQUl5RSxLQUFLOEIsSUFBTCxDQUFVYyxLQUF4QjtBQUNBLFVBQUdWLENBQUgsRUFBSztBQUNKUixXQUFJdUMsTUFBSzlDLEVBQUU0QixJQUFGLENBQU9MLEtBQUssSUFBWixFQUFrQnhCLEVBQUU4QyxHQUFHekksQ0FBSCxDQUFGLENBQWxCLEVBQTRCeUksR0FBR3pJLENBQUgsQ0FBNUIsRUFBbUNzRixDQUFuQyxDQUFMLEdBQTZDTSxFQUFFNEIsSUFBRixDQUFPTCxLQUFLLElBQVosRUFBa0J4QixFQUFFM0YsQ0FBRixDQUFsQixFQUF3QjRJLEVBQXhCLEVBQTRCdEQsQ0FBNUIsQ0FBakQ7QUFDQSxXQUFHYSxNQUFNMkIsQ0FBVCxFQUFXO0FBQUUsZUFBTzNCLENBQVA7QUFBVTtBQUN2QixPQUhELE1BR087QUFDTjtBQUNBLFdBQUdQLE1BQU1ELEVBQUUrQyxNQUFLRCxHQUFHekksQ0FBSCxDQUFMLEdBQWFBLENBQWYsQ0FBVCxFQUEyQjtBQUFFLGVBQU95SSxLQUFJQSxHQUFHekksQ0FBSCxDQUFKLEdBQVk0SSxFQUFuQjtBQUF1QixRQUY5QyxDQUUrQztBQUNyRDtBQUNEO0FBQ0QsS0FaRCxNQVlPO0FBQ04sVUFBSTVJLENBQUosSUFBUzJGLENBQVQsRUFBVztBQUNWLFVBQUdnQixDQUFILEVBQUs7QUFDSixXQUFHdUIsUUFBUXZDLENBQVIsRUFBVTNGLENBQVYsQ0FBSCxFQUFnQjtBQUNmbUcsWUFBSWdCLElBQUd2QixFQUFFNEIsSUFBRixDQUFPTCxDQUFQLEVBQVV4QixFQUFFM0YsQ0FBRixDQUFWLEVBQWdCQSxDQUFoQixFQUFtQnNGLENBQW5CLENBQUgsR0FBMkJNLEVBQUVELEVBQUUzRixDQUFGLENBQUYsRUFBUUEsQ0FBUixFQUFXc0YsQ0FBWCxDQUEvQjtBQUNBLFlBQUdhLE1BQU0yQixDQUFULEVBQVc7QUFBRSxnQkFBTzNCLENBQVA7QUFBVTtBQUN2QjtBQUNELE9BTEQsTUFLTztBQUNOO0FBQ0EsV0FBR1AsTUFBTUQsRUFBRTNGLENBQUYsQ0FBVCxFQUFjO0FBQUUsZUFBT0EsQ0FBUDtBQUFVLFFBRnBCLENBRXFCO0FBQzNCO0FBQ0Q7QUFDRDtBQUNELFdBQU8yRyxJQUFHckIsRUFBRWEsQ0FBTCxHQUFTMUIsS0FBSzhCLElBQUwsQ0FBVWMsS0FBVixHQUFpQixDQUFqQixHQUFxQixDQUFDLENBQXRDO0FBQ0EsSUFoQ0Q7QUFpQ0EsR0EzQ0MsR0FBRDtBQTRDRDVDLE9BQUtvRSxJQUFMLEdBQVksRUFBWjtBQUNBcEUsT0FBS29FLElBQUwsQ0FBVWpFLEVBQVYsR0FBZSxVQUFTVSxDQUFULEVBQVc7QUFBRSxVQUFPQSxJQUFHQSxhQUFhd0QsSUFBaEIsR0FBd0IsQ0FBQyxJQUFJQSxJQUFKLEdBQVdDLE9BQVgsRUFBaEM7QUFBdUQsR0FBbkY7O0FBRUEsTUFBSUosUUFBUWxFLEtBQUtFLEVBQUwsQ0FBUUMsRUFBcEI7QUFDQSxNQUFJTSxVQUFVVCxLQUFLOEIsSUFBTCxDQUFVM0IsRUFBeEI7QUFDQSxNQUFJd0IsTUFBTTNCLEtBQUsyQixHQUFmO0FBQUEsTUFBb0IyQixTQUFTM0IsSUFBSXhCLEVBQWpDO0FBQUEsTUFBcUNzRCxVQUFVOUIsSUFBSUMsR0FBbkQ7QUFBQSxNQUF3RGUsVUFBVWhCLElBQUl0RixHQUF0RTtBQUNBMEQsU0FBT0wsT0FBUCxHQUFpQk0sSUFBakI7QUFDQSxFQWpKQSxFQWlKRVgsT0FqSkYsRUFpSlcsUUFqSlg7O0FBbUpELEVBQUNBLFFBQVEsVUFBU1UsTUFBVCxFQUFnQjtBQUN4QjtBQUNBQSxTQUFPTCxPQUFQLEdBQWlCLFNBQVM2RSxJQUFULENBQWNDLEdBQWQsRUFBbUJsRixHQUFuQixFQUF3QjhELEVBQXhCLEVBQTJCO0FBQzNDLE9BQUcsQ0FBQ29CLEdBQUosRUFBUTtBQUFFLFdBQU8sRUFBQ2QsSUFBSWEsSUFBTCxFQUFQO0FBQW1CO0FBQzdCLE9BQUlDLE1BQU0sQ0FBQyxLQUFLQSxHQUFMLEtBQWEsS0FBS0EsR0FBTCxHQUFXLEVBQXhCLENBQUQsRUFBOEJBLEdBQTlCLE1BQ1QsS0FBS0EsR0FBTCxDQUFTQSxHQUFULElBQWdCLEVBQUNBLEtBQUtBLEdBQU4sRUFBV2QsSUFBSWEsS0FBSzdCLENBQUwsR0FBUztBQUN4QytCLFdBQU0sZ0JBQVUsQ0FBRTtBQURzQixLQUF4QixFQURQLENBQVY7QUFJQSxPQUFHbkYsZUFBZW9GLFFBQWxCLEVBQTJCO0FBQzFCLFFBQUlDLEtBQUs7QUFDUkMsVUFBS0wsS0FBS0ssR0FBTCxLQUNKTCxLQUFLSyxHQUFMLEdBQVcsWUFBVTtBQUNyQixVQUFHLEtBQUtILElBQUwsS0FBY0YsS0FBSzdCLENBQUwsQ0FBTytCLElBQXhCLEVBQTZCO0FBQUUsY0FBTyxDQUFDLENBQVI7QUFBVztBQUMxQyxVQUFHLFNBQVMsS0FBS0ksR0FBTCxDQUFTQyxJQUFyQixFQUEwQjtBQUN6QixZQUFLRCxHQUFMLENBQVNDLElBQVQsR0FBZ0IsS0FBS0MsSUFBckI7QUFDQTtBQUNELFdBQUtyQixFQUFMLENBQVFxQixJQUFSLEdBQWUsS0FBS0EsSUFBcEI7QUFDQSxXQUFLTixJQUFMLEdBQVlGLEtBQUs3QixDQUFMLENBQU8rQixJQUFuQjtBQUNBLFdBQUtNLElBQUwsQ0FBVXJCLEVBQVYsR0FBZSxLQUFLQSxFQUFwQjtBQUNBLE1BVEksQ0FERztBQVdSQSxTQUFJYSxLQUFLN0IsQ0FYRDtBQVlSK0IsV0FBTW5GLEdBWkU7QUFhUnVGLFVBQUtMLEdBYkc7QUFjUlEsU0FBSSxJQWRJO0FBZVI1QixTQUFJQTtBQWZJLEtBQVQ7QUFpQkEsS0FBQ3VCLEdBQUdJLElBQUgsR0FBVVAsSUFBSU0sSUFBSixJQUFZTixHQUF2QixFQUE0QmQsRUFBNUIsR0FBaUNpQixFQUFqQztBQUNBLFdBQU9ILElBQUlNLElBQUosR0FBV0gsRUFBbEI7QUFDQTtBQUNELElBQUNILE1BQU1BLElBQUlkLEVBQVgsRUFBZWUsSUFBZixDQUFvQm5GLEdBQXBCO0FBQ0EsVUFBT2tGLEdBQVA7QUFDQSxHQTdCRDtBQThCQSxFQWhDQSxFQWdDRW5GLE9BaENGLEVBZ0NXLFFBaENYOztBQWtDRCxFQUFDQSxRQUFRLFVBQVNVLE1BQVQsRUFBZ0I7QUFDeEI7QUFDQSxNQUFJa0YsS0FBSzVGLFFBQVEsUUFBUixDQUFUOztBQUVBLFdBQVM2RixLQUFULENBQWVDLE1BQWYsRUFBdUJDLEdBQXZCLEVBQTJCO0FBQzFCQSxTQUFNQSxPQUFPLEVBQWI7QUFDQUEsT0FBSUMsRUFBSixHQUFTRCxJQUFJQyxFQUFKLElBQVUsR0FBbkI7QUFDQUQsT0FBSUUsR0FBSixHQUFVRixJQUFJRSxHQUFKLElBQVcsR0FBckI7QUFDQUYsT0FBSUcsSUFBSixHQUFXSCxJQUFJRyxJQUFKLElBQVksWUFBVTtBQUNoQyxXQUFRLENBQUMsSUFBSWxCLElBQUosRUFBRixHQUFnQi9DLEtBQUtMLE1BQUwsRUFBdkI7QUFDQSxJQUZEO0FBR0EsT0FBSStELEtBQUtDLEVBQVQsQ0FQMEIsQ0FPZDs7QUFFWkQsTUFBR1EsSUFBSCxHQUFVLFVBQVNDLEtBQVQsRUFBZTtBQUN4QixRQUFJRCxPQUFPLFNBQVBBLElBQU8sQ0FBU0UsRUFBVCxFQUFZO0FBQ3RCLFNBQUdGLEtBQUtaLEdBQUwsSUFBWVksU0FBUyxLQUFLQSxJQUE3QixFQUFrQztBQUNqQyxXQUFLQSxJQUFMLEdBQVksSUFBWjtBQUNBLGFBQU8sS0FBUDtBQUNBO0FBQ0QsU0FBR1IsR0FBR1EsSUFBSCxDQUFRRyxJQUFYLEVBQWdCO0FBQ2YsYUFBTyxLQUFQO0FBQ0E7QUFDRCxTQUFHRCxFQUFILEVBQU07QUFDTEEsU0FBR0UsRUFBSCxHQUFRRixHQUFHeEYsRUFBWDtBQUNBd0YsU0FBR2QsR0FBSDtBQUNBaUIsVUFBSUMsS0FBSixDQUFVcEssSUFBVixDQUFlZ0ssRUFBZjtBQUNBO0FBQ0QsWUFBTyxJQUFQO0FBQ0EsS0FkRDtBQUFBLFFBY0dHLE1BQU1MLEtBQUtLLEdBQUwsR0FBVyxVQUFTRSxHQUFULEVBQWMzQyxFQUFkLEVBQWlCO0FBQ3BDLFNBQUdvQyxLQUFLWixHQUFSLEVBQVk7QUFBRTtBQUFRO0FBQ3RCLFNBQUdtQixlQUFlckIsUUFBbEIsRUFBMkI7QUFDMUJNLFNBQUdRLElBQUgsQ0FBUUcsSUFBUixHQUFlLElBQWY7QUFDQUksVUFBSWhELElBQUosQ0FBU0ssRUFBVDtBQUNBNEIsU0FBR1EsSUFBSCxDQUFRRyxJQUFSLEdBQWUsS0FBZjtBQUNBO0FBQ0E7QUFDREgsVUFBS1osR0FBTCxHQUFXLElBQVg7QUFDQSxTQUFJckosSUFBSSxDQUFSO0FBQUEsU0FBV3lLLElBQUlILElBQUlDLEtBQW5CO0FBQUEsU0FBMEI1RSxJQUFJOEUsRUFBRXhLLE1BQWhDO0FBQUEsU0FBd0N5SyxHQUF4QztBQUNBSixTQUFJQyxLQUFKLEdBQVksRUFBWjtBQUNBLFNBQUdOLFNBQVNVLEdBQUdWLElBQWYsRUFBb0I7QUFDbkJVLFNBQUdWLElBQUgsR0FBVSxJQUFWO0FBQ0E7QUFDRCxVQUFJakssQ0FBSixFQUFPQSxJQUFJMkYsQ0FBWCxFQUFjM0YsR0FBZCxFQUFrQjtBQUFFMEssWUFBTUQsRUFBRXpLLENBQUYsQ0FBTjtBQUNuQjBLLFVBQUkvRixFQUFKLEdBQVMrRixJQUFJTCxFQUFiO0FBQ0FLLFVBQUlMLEVBQUosR0FBUyxJQUFUO0FBQ0FaLFNBQUdRLElBQUgsQ0FBUUcsSUFBUixHQUFlLElBQWY7QUFDQU0sVUFBSUUsR0FBSixDQUFRbkIsRUFBUixDQUFXaUIsSUFBSXpCLEdBQWYsRUFBb0J5QixJQUFJL0YsRUFBeEIsRUFBNEIrRixHQUE1QjtBQUNBakIsU0FBR1EsSUFBSCxDQUFRRyxJQUFSLEdBQWUsS0FBZjtBQUNBO0FBQ0QsS0FuQ0Q7QUFBQSxRQW1DR08sS0FBS1QsTUFBTS9DLENBbkNkO0FBb0NBbUQsUUFBSWQsSUFBSixHQUFXbUIsR0FBR1YsSUFBSCxJQUFXLENBQUNVLEdBQUduQixJQUFILElBQVMsRUFBQ3JDLEdBQUUsRUFBSCxFQUFWLEVBQWtCQSxDQUFsQixDQUFvQjhDLElBQTFDO0FBQ0EsUUFBR0ssSUFBSWQsSUFBUCxFQUFZO0FBQ1hjLFNBQUlkLElBQUosQ0FBU04sSUFBVCxHQUFnQmUsSUFBaEI7QUFDQTtBQUNESyxRQUFJQyxLQUFKLEdBQVksRUFBWjtBQUNBSSxPQUFHVixJQUFILEdBQVVBLElBQVY7QUFDQSxXQUFPSyxHQUFQO0FBQ0EsSUE1Q0Q7QUE2Q0EsVUFBT2IsRUFBUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBSW9CLE1BQU1wQixHQUFHb0IsR0FBSCxHQUFTLFVBQVNSLEVBQVQsRUFBYXhDLEVBQWIsRUFBZ0I7QUFDbEMsUUFBRyxDQUFDZ0QsSUFBSXBCLEVBQVIsRUFBVztBQUFFb0IsU0FBSXBCLEVBQUosR0FBU0MsR0FBR29CLEtBQUgsRUFBVDtBQUFxQjtBQUNsQyxRQUFJaEIsS0FBS0QsSUFBSUcsSUFBSixFQUFUO0FBQ0EsUUFBR0ssRUFBSCxFQUFNO0FBQUVRLFNBQUlwQixFQUFKLENBQU9LLEVBQVAsRUFBV08sRUFBWCxFQUFleEMsRUFBZjtBQUFvQjtBQUM1QixXQUFPaUMsRUFBUDtBQUNBLElBTEQ7QUFNQWUsT0FBSTFELENBQUosR0FBUTBDLElBQUlDLEVBQVo7QUFDQUwsTUFBR3NCLEdBQUgsR0FBUyxVQUFTSixFQUFULEVBQWFLLEtBQWIsRUFBbUI7QUFDM0IsUUFBRyxDQUFDTCxFQUFELElBQU8sQ0FBQ0ssS0FBUixJQUFpQixDQUFDSCxJQUFJcEIsRUFBekIsRUFBNEI7QUFBRTtBQUFRO0FBQ3RDLFFBQUlLLEtBQUthLEdBQUdkLElBQUlDLEVBQVAsS0FBY2EsRUFBdkI7QUFDQSxRQUFHLENBQUNFLElBQUlJLEdBQUosQ0FBUW5CLEVBQVIsQ0FBSixFQUFnQjtBQUFFO0FBQVE7QUFDMUJlLFFBQUlwQixFQUFKLENBQU9LLEVBQVAsRUFBV2tCLEtBQVg7QUFDQSxXQUFPLElBQVA7QUFDQSxJQU5EO0FBT0F2QixNQUFHc0IsR0FBSCxDQUFPNUQsQ0FBUCxHQUFXMEMsSUFBSUUsR0FBZjs7QUFHQSxVQUFPTixFQUFQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQUEsTUFBR0EsRUFBSCxDQUFNLE9BQU4sRUFBZSxTQUFTeUIsS0FBVCxDQUFlUixHQUFmLEVBQW1CO0FBQ2pDLFFBQUluQixPQUFPbUIsSUFBSWpCLEVBQUosQ0FBT0YsSUFBbEI7QUFBQSxRQUF3QmlCLEdBQXhCO0FBQ0EsUUFBRyxTQUFTRSxJQUFJekIsR0FBYixJQUFvQmtDLElBQUlqQixLQUFKLENBQVVBLEtBQVYsQ0FBZ0JrQixLQUFoQixLQUEwQlYsSUFBSS9GLEVBQXJELEVBQXdEO0FBQUU7QUFDekQsU0FBRyxDQUFDNkYsTUFBTUUsSUFBSUUsR0FBWCxLQUFtQkosSUFBSVAsSUFBMUIsRUFBK0I7QUFDOUIsVUFBR08sSUFBSVAsSUFBSixDQUFTUyxHQUFULENBQUgsRUFBaUI7QUFDaEI7QUFDQTtBQUNEO0FBQ0Q7QUFDRCxRQUFHLENBQUNuQixJQUFKLEVBQVM7QUFBRTtBQUFRO0FBQ25CLFFBQUdtQixJQUFJakIsRUFBSixDQUFPM0ksR0FBVixFQUFjO0FBQ2IsU0FBSUEsTUFBTTRKLElBQUlqQixFQUFKLENBQU8zSSxHQUFqQjtBQUFBLFNBQXNCNEcsQ0FBdEI7QUFDQSxVQUFJLElBQUlmLENBQVIsSUFBYTdGLEdBQWIsRUFBaUI7QUFBRTRHLFVBQUk1RyxJQUFJNkYsQ0FBSixDQUFKO0FBQ2xCLFVBQUdlLENBQUgsRUFBSztBQUNKMkQsWUFBSzNELENBQUwsRUFBUWdELEdBQVIsRUFBYVEsS0FBYjtBQUNBO0FBQ0Q7QUFDRDs7Ozs7Ozs7QUFRQSxLQWZELE1BZU87QUFDTkcsVUFBSzlCLElBQUwsRUFBV21CLEdBQVgsRUFBZ0JRLEtBQWhCO0FBQ0E7QUFDRCxRQUFHM0IsU0FBU21CLElBQUlqQixFQUFKLENBQU9GLElBQW5CLEVBQXdCO0FBQ3ZCMkIsV0FBTVIsR0FBTjtBQUNBO0FBQ0QsSUEvQkQ7QUFnQ0EsWUFBU1csSUFBVCxDQUFjOUIsSUFBZCxFQUFvQm1CLEdBQXBCLEVBQXlCUSxLQUF6QixFQUFnQ2YsRUFBaEMsRUFBbUM7QUFDbEMsUUFBR1osZ0JBQWdCM0MsS0FBbkIsRUFBeUI7QUFDeEI4RCxTQUFJL0YsRUFBSixDQUFPMkcsS0FBUCxDQUFhWixJQUFJN0MsRUFBakIsRUFBcUIwQixLQUFLZ0MsTUFBTCxDQUFZcEIsTUFBSU8sR0FBaEIsQ0FBckI7QUFDQSxLQUZELE1BRU87QUFDTkEsU0FBSS9GLEVBQUosQ0FBTzZDLElBQVAsQ0FBWWtELElBQUk3QyxFQUFoQixFQUFvQjBCLElBQXBCLEVBQTBCWSxNQUFJTyxHQUE5QjtBQUNBO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7OztBQWVBakIsTUFBR0EsRUFBSCxDQUFNLE1BQU4sRUFBYyxVQUFTVSxFQUFULEVBQVk7QUFDekIsUUFBSXFCLE1BQU1yQixHQUFHcEcsR0FBSCxDQUFPeUgsR0FBakI7QUFDQSxRQUFHLFNBQVNyQixHQUFHbEIsR0FBWixJQUFtQnVDLEdBQW5CLElBQTBCLENBQUNBLElBQUlyRSxDQUFKLENBQU1zRSxJQUFwQyxFQUF5QztBQUFFO0FBQzFDLE1BQUN0QixHQUFHVixFQUFILENBQU0zSSxHQUFOLEdBQVlxSixHQUFHVixFQUFILENBQU0zSSxHQUFOLElBQWEsRUFBMUIsRUFBOEIwSyxJQUFJckUsQ0FBSixDQUFNMkMsRUFBTixLQUFhMEIsSUFBSXJFLENBQUosQ0FBTTJDLEVBQU4sR0FBVy9ELEtBQUtMLE1BQUwsRUFBeEIsQ0FBOUIsSUFBd0V5RSxHQUFHcEcsR0FBM0U7QUFDQTtBQUNEb0csT0FBR1YsRUFBSCxDQUFNRixJQUFOLEdBQWFZLEdBQUdwRyxHQUFoQjtBQUNBLElBTkQ7QUFPQSxVQUFPMEYsRUFBUDtBQUNBO0FBQ0RqRixTQUFPTCxPQUFQLEdBQWlCd0YsS0FBakI7QUFDQSxFQXRKQSxFQXNKRTdGLE9BdEpGLEVBc0pXLFNBdEpYOztBQXdKRCxFQUFDQSxRQUFRLFVBQVNVLE1BQVQsRUFBZ0I7QUFDeEI7QUFDQSxNQUFJQyxPQUFPWCxRQUFRLFFBQVIsQ0FBWDtBQUNBLFdBQVMrQixDQUFULENBQVc2RixLQUFYLEVBQWtCckIsRUFBbEIsRUFBc0J4QixJQUF0QixFQUEyQjtBQUFFO0FBQzVCaEQsS0FBRWdELElBQUYsR0FBU0EsSUFBVDtBQUNBaEQsS0FBRThGLE9BQUYsQ0FBVXhMLElBQVYsQ0FBZSxFQUFDeUwsTUFBTUYsS0FBUCxFQUFjUixPQUFPYixNQUFNLFlBQVUsQ0FBRSxDQUF2QyxFQUFmO0FBQ0EsT0FBR3hFLEVBQUVnRyxPQUFGLEdBQVlILEtBQWYsRUFBcUI7QUFBRTtBQUFRO0FBQy9CN0YsS0FBRWlHLEdBQUYsQ0FBTUosS0FBTjtBQUNBO0FBQ0Q3RixJQUFFOEYsT0FBRixHQUFZLEVBQVo7QUFDQTlGLElBQUVnRyxPQUFGLEdBQVl6RyxRQUFaO0FBQ0FTLElBQUVrQixJQUFGLEdBQVN0QyxLQUFLOEIsSUFBTCxDQUFVUSxJQUFWLENBQWUsTUFBZixDQUFUO0FBQ0FsQixJQUFFaUcsR0FBRixHQUFRLFVBQVNDLE1BQVQsRUFBZ0I7QUFDdkIsT0FBRzNHLGFBQWFTLEVBQUVnRyxPQUFGLEdBQVlFLE1BQXpCLENBQUgsRUFBb0M7QUFBRTtBQUFRO0FBQzlDLE9BQUlDLE1BQU1uRyxFQUFFZ0QsSUFBRixFQUFWO0FBQ0FrRCxZQUFVQSxVQUFVQyxHQUFYLEdBQWlCLENBQWpCLEdBQXNCRCxTQUFTQyxHQUF4QztBQUNBQyxnQkFBYXBHLEVBQUVpRSxFQUFmO0FBQ0FqRSxLQUFFaUUsRUFBRixHQUFPb0MsV0FBV3JHLEVBQUVzRyxLQUFiLEVBQW9CSixNQUFwQixDQUFQO0FBQ0EsR0FORDtBQU9BbEcsSUFBRXVHLElBQUYsR0FBUyxVQUFTQyxJQUFULEVBQWVyTSxDQUFmLEVBQWtCYyxHQUFsQixFQUFzQjtBQUM5QixPQUFJOEosTUFBTSxJQUFWO0FBQ0EsT0FBRyxDQUFDeUIsSUFBSixFQUFTO0FBQUU7QUFBUTtBQUNuQixPQUFHQSxLQUFLVCxJQUFMLElBQWFoQixJQUFJb0IsR0FBcEIsRUFBd0I7QUFDdkIsUUFBR0ssS0FBS25CLEtBQUwsWUFBc0IvQixRQUF6QixFQUFrQztBQUNqQytDLGdCQUFXLFlBQVU7QUFBRUcsV0FBS25CLEtBQUw7QUFBYyxNQUFyQyxFQUFzQyxDQUF0QztBQUNBO0FBQ0QsSUFKRCxNQUlPO0FBQ05OLFFBQUlpQixPQUFKLEdBQWVqQixJQUFJaUIsT0FBSixHQUFjUSxLQUFLVCxJQUFwQixHQUEyQmhCLElBQUlpQixPQUEvQixHQUF5Q1EsS0FBS1QsSUFBNUQ7QUFDQTlLLFFBQUl1TCxJQUFKO0FBQ0E7QUFDRCxHQVhEO0FBWUF4RyxJQUFFc0csS0FBRixHQUFVLFlBQVU7QUFDbkIsT0FBSXZCLE1BQU0sRUFBQ29CLEtBQUtuRyxFQUFFZ0QsSUFBRixFQUFOLEVBQWdCZ0QsU0FBU3pHLFFBQXpCLEVBQVY7QUFDQVMsS0FBRThGLE9BQUYsQ0FBVTVFLElBQVYsQ0FBZWxCLEVBQUVrQixJQUFqQjtBQUNBbEIsS0FBRThGLE9BQUYsR0FBWWxILEtBQUs4QixJQUFMLENBQVV6RixHQUFWLENBQWMrRSxFQUFFOEYsT0FBaEIsRUFBeUI5RixFQUFFdUcsSUFBM0IsRUFBaUN4QixHQUFqQyxLQUF5QyxFQUFyRDtBQUNBL0UsS0FBRWlHLEdBQUYsQ0FBTWxCLElBQUlpQixPQUFWO0FBQ0EsR0FMRDtBQU1BckgsU0FBT0wsT0FBUCxHQUFpQjBCLENBQWpCO0FBQ0EsRUF0Q0EsRUFzQ0UvQixPQXRDRixFQXNDVyxZQXRDWDs7QUF3Q0QsRUFBQ0EsUUFBUSxVQUFTVSxNQUFULEVBQWdCO0FBQ3hCO0FBQ0EsV0FBUzhILEdBQVQsQ0FBYUMsWUFBYixFQUEyQkMsYUFBM0IsRUFBMENDLFlBQTFDLEVBQXdEQyxhQUF4RCxFQUF1RUMsWUFBdkUsRUFBb0Y7QUFDbkYsT0FBR0osZUFBZUMsYUFBbEIsRUFBZ0M7QUFDL0IsV0FBTyxFQUFDSSxPQUFPLElBQVIsRUFBUCxDQUQrQixDQUNUO0FBQ3RCO0FBQ0QsT0FBR0osZ0JBQWdCQyxZQUFuQixFQUFnQztBQUMvQixXQUFPLEVBQUNJLFlBQVksSUFBYixFQUFQLENBRCtCLENBQ0o7QUFFM0I7QUFDRCxPQUFHSixlQUFlRCxhQUFsQixFQUFnQztBQUMvQixXQUFPLEVBQUNNLFVBQVUsSUFBWCxFQUFpQkMsVUFBVSxJQUEzQixFQUFQLENBRCtCLENBQ1U7QUFFekM7QUFDRCxPQUFHUCxrQkFBa0JDLFlBQXJCLEVBQWtDO0FBQ2pDQyxvQkFBZ0JNLFFBQVFOLGFBQVIsS0FBMEIsRUFBMUM7QUFDQUMsbUJBQWVLLFFBQVFMLFlBQVIsS0FBeUIsRUFBeEM7QUFDQSxRQUFHRCxrQkFBa0JDLFlBQXJCLEVBQWtDO0FBQUU7QUFDbkMsWUFBTyxFQUFDakIsT0FBTyxJQUFSLEVBQVA7QUFDQTtBQUNEOzs7Ozs7OztBQVFBLFFBQUdnQixnQkFBZ0JDLFlBQW5CLEVBQWdDO0FBQUU7QUFDakMsWUFBTyxFQUFDRyxVQUFVLElBQVgsRUFBaUJHLFNBQVMsSUFBMUIsRUFBUDtBQUNBO0FBQ0QsUUFBR04sZUFBZUQsYUFBbEIsRUFBZ0M7QUFBRTtBQUNqQyxZQUFPLEVBQUNJLFVBQVUsSUFBWCxFQUFpQkMsVUFBVSxJQUEzQixFQUFQO0FBQ0E7QUFDRDtBQUNELFVBQU8sRUFBQ25OLEtBQUssd0JBQXVCOE0sYUFBdkIsR0FBc0MsTUFBdEMsR0FBOENDLFlBQTlDLEdBQTRELE1BQTVELEdBQW9FSCxhQUFwRSxHQUFtRixNQUFuRixHQUEyRkMsWUFBM0YsR0FBeUcsR0FBL0csRUFBUDtBQUNBO0FBQ0QsTUFBRyxPQUFPakgsSUFBUCxLQUFnQixXQUFuQixFQUErQjtBQUM5QixTQUFNLElBQUluRSxLQUFKLENBQ0wsaUVBQ0Esa0RBRkssQ0FBTjtBQUlBO0FBQ0QsTUFBSTJMLFVBQVV4SCxLQUFLQyxTQUFuQjtBQUFBLE1BQThCeUgsU0FBOUI7QUFDQTFJLFNBQU9MLE9BQVAsR0FBaUJtSSxHQUFqQjtBQUNBLEVBN0NBLEVBNkNFeEksT0E3Q0YsRUE2Q1csT0E3Q1g7O0FBK0NELEVBQUNBLFFBQVEsVUFBU1UsTUFBVCxFQUFnQjtBQUN4QixNQUFJQyxPQUFPWCxRQUFRLFFBQVIsQ0FBWDtBQUNBLE1BQUlxSixNQUFNLEVBQVY7QUFDQUEsTUFBSXZJLEVBQUosR0FBUyxVQUFTOEMsQ0FBVCxFQUFXO0FBQUU7QUFDckIsT0FBR0EsTUFBTUksQ0FBVCxFQUFXO0FBQUUsV0FBTyxLQUFQO0FBQWM7QUFDM0IsT0FBR0osTUFBTSxJQUFULEVBQWM7QUFBRSxXQUFPLElBQVA7QUFBYSxJQUZWLENBRVc7QUFDOUIsT0FBR0EsTUFBTXRDLFFBQVQsRUFBa0I7QUFBRSxXQUFPLEtBQVA7QUFBYyxJQUhmLENBR2dCO0FBQ25DLE9BQUdnSSxRQUFRMUYsQ0FBUixFQUFXO0FBQVgsTUFDQTJGLE1BQU0zRixDQUFOLENBREEsQ0FDUztBQURULE1BRUE0RixPQUFPNUYsQ0FBUCxDQUZILEVBRWE7QUFBRTtBQUNkLFdBQU8sSUFBUCxDQURZLENBQ0M7QUFDYjtBQUNELFVBQU95RixJQUFJSSxHQUFKLENBQVEzSSxFQUFSLENBQVc4QyxDQUFYLEtBQWlCLEtBQXhCLENBVG1CLENBU1k7QUFDL0IsR0FWRDtBQVdBeUYsTUFBSUksR0FBSixHQUFVLEVBQUNwRyxHQUFHLEdBQUosRUFBVjtBQUNBLEdBQUUsYUFBVTtBQUNYZ0csT0FBSUksR0FBSixDQUFRM0ksRUFBUixHQUFhLFVBQVM4QyxDQUFULEVBQVc7QUFBRTtBQUN6QixRQUFHQSxLQUFLQSxFQUFFOEYsSUFBRixDQUFMLElBQWdCLENBQUM5RixFQUFFUCxDQUFuQixJQUF3QlksT0FBT0wsQ0FBUCxDQUEzQixFQUFxQztBQUFFO0FBQ3RDLFNBQUl4QixJQUFJLEVBQVI7QUFDQWtCLGFBQVFNLENBQVIsRUFBVzVHLEdBQVgsRUFBZ0JvRixDQUFoQjtBQUNBLFNBQUdBLEVBQUU0RCxFQUFMLEVBQVE7QUFBRTtBQUNULGFBQU81RCxFQUFFNEQsRUFBVCxDQURPLENBQ007QUFDYjtBQUNEO0FBQ0QsV0FBTyxLQUFQLENBUnVCLENBUVQ7QUFDZCxJQVREO0FBVUEsWUFBU2hKLEdBQVQsQ0FBYStFLENBQWIsRUFBZ0JjLENBQWhCLEVBQWtCO0FBQUUsUUFBSVQsSUFBSSxJQUFSLENBQUYsQ0FBZ0I7QUFDakMsUUFBR0EsRUFBRTRELEVBQUwsRUFBUTtBQUFFLFlBQU81RCxFQUFFNEQsRUFBRixHQUFPLEtBQWQ7QUFBcUIsS0FEZCxDQUNlO0FBQ2hDLFFBQUduRCxLQUFLNkcsSUFBTCxJQUFhSixRQUFRdkgsQ0FBUixDQUFoQixFQUEyQjtBQUFFO0FBQzVCSyxPQUFFNEQsRUFBRixHQUFPakUsQ0FBUCxDQUQwQixDQUNoQjtBQUNWLEtBRkQsTUFFTztBQUNOLFlBQU9LLEVBQUU0RCxFQUFGLEdBQU8sS0FBZCxDQURNLENBQ2U7QUFDckI7QUFDRDtBQUNELEdBbkJDLEdBQUQ7QUFvQkRxRCxNQUFJSSxHQUFKLENBQVFoSSxHQUFSLEdBQWMsVUFBU0QsQ0FBVCxFQUFXO0FBQUUsVUFBT21JLFFBQVEsRUFBUixFQUFZRCxJQUFaLEVBQWtCbEksQ0FBbEIsQ0FBUDtBQUE2QixHQUF4RCxDQW5Dd0IsQ0FtQ2lDO0FBQ3pELE1BQUlrSSxPQUFPTCxJQUFJSSxHQUFKLENBQVFwRyxDQUFuQjtBQUFBLE1BQXNCVyxDQUF0QjtBQUNBLE1BQUl1RixRQUFRNUksS0FBS0ksRUFBTCxDQUFRRCxFQUFwQjtBQUNBLE1BQUkwSSxTQUFTN0ksS0FBS08sR0FBTCxDQUFTSixFQUF0QjtBQUNBLE1BQUl3SSxVQUFVM0ksS0FBS1ksSUFBTCxDQUFVVCxFQUF4QjtBQUNBLE1BQUl3QixNQUFNM0IsS0FBSzJCLEdBQWY7QUFBQSxNQUFvQjJCLFNBQVMzQixJQUFJeEIsRUFBakM7QUFBQSxNQUFxQzZJLFVBQVVySCxJQUFJcUIsR0FBbkQ7QUFBQSxNQUF3REwsVUFBVWhCLElBQUl0RixHQUF0RTtBQUNBMEQsU0FBT0wsT0FBUCxHQUFpQmdKLEdBQWpCO0FBQ0EsRUExQ0EsRUEwQ0VySixPQTFDRixFQTBDVyxPQTFDWDs7QUE0Q0QsRUFBQ0EsUUFBUSxVQUFTVSxNQUFULEVBQWdCO0FBQ3hCLE1BQUlDLE9BQU9YLFFBQVEsUUFBUixDQUFYO0FBQ0EsTUFBSXFKLE1BQU1ySixRQUFRLE9BQVIsQ0FBVjtBQUNBLE1BQUk0SixPQUFPLEVBQUN2RyxHQUFHLEdBQUosRUFBWDtBQUNBdUcsT0FBS2pDLElBQUwsR0FBWSxVQUFTeEcsQ0FBVCxFQUFZaUIsQ0FBWixFQUFjO0FBQUUsVUFBUWpCLEtBQUtBLEVBQUVrQyxDQUFQLElBQVlsQyxFQUFFa0MsQ0FBRixDQUFJakIsS0FBS3lILEtBQVQsQ0FBcEI7QUFBc0MsR0FBbEUsQ0FKd0IsQ0FJMkM7QUFDbkVELE9BQUtqQyxJQUFMLENBQVVsRyxHQUFWLEdBQWdCLFVBQVNOLENBQVQsRUFBWWlCLENBQVosRUFBYztBQUFFO0FBQy9CQSxPQUFLLE9BQU9BLENBQVAsS0FBYSxRQUFkLEdBQXlCLEVBQUN1RixNQUFNdkYsQ0FBUCxFQUF6QixHQUFxQ0EsS0FBSyxFQUE5QztBQUNBakIsT0FBSUEsS0FBSyxFQUFULENBRjZCLENBRWhCO0FBQ2JBLEtBQUVrQyxDQUFGLEdBQU1sQyxFQUFFa0MsQ0FBRixJQUFPLEVBQWIsQ0FINkIsQ0FHWjtBQUNqQmxDLEtBQUVrQyxDQUFGLENBQUl3RyxLQUFKLElBQWF6SCxFQUFFdUYsSUFBRixJQUFVeEcsRUFBRWtDLENBQUYsQ0FBSXdHLEtBQUosQ0FBVixJQUF3QkMsYUFBckMsQ0FKNkIsQ0FJdUI7QUFDcEQsVUFBTzNJLENBQVA7QUFDQSxHQU5EO0FBT0F5SSxPQUFLakMsSUFBTCxDQUFVdEUsQ0FBVixHQUFjZ0csSUFBSUksR0FBSixDQUFRcEcsQ0FBdEI7QUFDQSxHQUFFLGFBQVU7QUFDWHVHLFFBQUs5SSxFQUFMLEdBQVUsVUFBU0ssQ0FBVCxFQUFZb0YsRUFBWixFQUFnQnhDLEVBQWhCLEVBQW1CO0FBQUUsUUFBSWhDLENBQUosQ0FBRixDQUFTO0FBQ3JDLFFBQUcsQ0FBQ2tDLE9BQU85QyxDQUFQLENBQUosRUFBYztBQUFFLFlBQU8sS0FBUDtBQUFjLEtBREYsQ0FDRztBQUMvQixRQUFHWSxJQUFJNkgsS0FBS2pDLElBQUwsQ0FBVXhHLENBQVYsQ0FBUCxFQUFvQjtBQUFFO0FBQ3JCLFlBQU8sQ0FBQ21DLFFBQVFuQyxDQUFSLEVBQVduRSxHQUFYLEVBQWdCLEVBQUMrRyxJQUFHQSxFQUFKLEVBQU93QyxJQUFHQSxFQUFWLEVBQWF4RSxHQUFFQSxDQUFmLEVBQWlCWixHQUFFQSxDQUFuQixFQUFoQixDQUFSO0FBQ0E7QUFDRCxXQUFPLEtBQVAsQ0FMNEIsQ0FLZDtBQUNkLElBTkQ7QUFPQSxZQUFTbkUsR0FBVCxDQUFhNEcsQ0FBYixFQUFnQmYsQ0FBaEIsRUFBa0I7QUFBRTtBQUNuQixRQUFHQSxNQUFNK0csS0FBS3ZHLENBQWQsRUFBZ0I7QUFBRTtBQUFRLEtBRFQsQ0FDVTtBQUMzQixRQUFHLENBQUNnRyxJQUFJdkksRUFBSixDQUFPOEMsQ0FBUCxDQUFKLEVBQWM7QUFBRSxZQUFPLElBQVA7QUFBYSxLQUZaLENBRWE7QUFDOUIsUUFBRyxLQUFLMkMsRUFBUixFQUFXO0FBQUUsVUFBS0EsRUFBTCxDQUFRN0MsSUFBUixDQUFhLEtBQUtLLEVBQWxCLEVBQXNCSCxDQUF0QixFQUF5QmYsQ0FBekIsRUFBNEIsS0FBSzFCLENBQWpDLEVBQW9DLEtBQUtZLENBQXpDO0FBQTZDLEtBSHpDLENBRzBDO0FBQzNEO0FBQ0QsR0FiQyxHQUFEO0FBY0QsR0FBRSxhQUFVO0FBQ1g2SCxRQUFLbkksR0FBTCxHQUFXLFVBQVNhLEdBQVQsRUFBY0YsQ0FBZCxFQUFpQjJCLEVBQWpCLEVBQW9CO0FBQUU7QUFDaEMsUUFBRyxDQUFDM0IsQ0FBSixFQUFNO0FBQUVBLFNBQUksRUFBSjtBQUFRLEtBQWhCLE1BQ0ssSUFBRyxPQUFPQSxDQUFQLEtBQWEsUUFBaEIsRUFBeUI7QUFBRUEsU0FBSSxFQUFDdUYsTUFBTXZGLENBQVAsRUFBSjtBQUFlLEtBQTFDLE1BQ0EsSUFBR0EsYUFBYWlELFFBQWhCLEVBQXlCO0FBQUVqRCxTQUFJLEVBQUNwRixLQUFLb0YsQ0FBTixFQUFKO0FBQWM7QUFDOUMsUUFBR0EsRUFBRXBGLEdBQUwsRUFBUztBQUFFb0YsT0FBRTJILElBQUYsR0FBUzNILEVBQUVwRixHQUFGLENBQU0wRyxJQUFOLENBQVdLLEVBQVgsRUFBZXpCLEdBQWYsRUFBb0IwQixDQUFwQixFQUF1QjVCLEVBQUUySCxJQUFGLElBQVUsRUFBakMsQ0FBVDtBQUErQztBQUMxRCxRQUFHM0gsRUFBRTJILElBQUYsR0FBU0gsS0FBS2pDLElBQUwsQ0FBVWxHLEdBQVYsQ0FBY1csRUFBRTJILElBQUYsSUFBVSxFQUF4QixFQUE0QjNILENBQTVCLENBQVosRUFBMkM7QUFDMUNrQixhQUFRaEIsR0FBUixFQUFhdEYsR0FBYixFQUFrQixFQUFDb0YsR0FBRUEsQ0FBSCxFQUFLMkIsSUFBR0EsRUFBUixFQUFsQjtBQUNBO0FBQ0QsV0FBTzNCLEVBQUUySCxJQUFULENBUjhCLENBUWY7QUFDZixJQVREO0FBVUEsWUFBUy9NLEdBQVQsQ0FBYTRHLENBQWIsRUFBZ0JmLENBQWhCLEVBQWtCO0FBQUUsUUFBSVQsSUFBSSxLQUFLQSxDQUFiO0FBQUEsUUFBZ0JzRSxHQUFoQjtBQUFBLFFBQXFCMUMsQ0FBckIsQ0FBRixDQUEwQjtBQUMzQyxRQUFHNUIsRUFBRXBGLEdBQUwsRUFBUztBQUNSMEosV0FBTXRFLEVBQUVwRixHQUFGLENBQU0wRyxJQUFOLENBQVcsS0FBS0ssRUFBaEIsRUFBb0JILENBQXBCLEVBQXVCLEtBQUdmLENBQTFCLEVBQTZCVCxFQUFFMkgsSUFBL0IsQ0FBTjtBQUNBLFNBQUcvRixNQUFNMEMsR0FBVCxFQUFhO0FBQ1pzRCxjQUFRNUgsRUFBRTJILElBQVYsRUFBZ0JsSCxDQUFoQjtBQUNBLE1BRkQsTUFHQSxJQUFHVCxFQUFFMkgsSUFBTCxFQUFVO0FBQUUzSCxRQUFFMkgsSUFBRixDQUFPbEgsQ0FBUCxJQUFZNkQsR0FBWjtBQUFpQjtBQUM3QjtBQUNBO0FBQ0QsUUFBRzJDLElBQUl2SSxFQUFKLENBQU84QyxDQUFQLENBQUgsRUFBYTtBQUNaeEIsT0FBRTJILElBQUYsQ0FBT2xILENBQVAsSUFBWWUsQ0FBWjtBQUNBO0FBQ0Q7QUFDRCxHQXhCQyxHQUFEO0FBeUJELE1BQUl0QixNQUFNM0IsS0FBSzJCLEdBQWY7QUFBQSxNQUFvQjJCLFNBQVMzQixJQUFJeEIsRUFBakM7QUFBQSxNQUFxQ2tKLFVBQVUxSCxJQUFJd0IsR0FBbkQ7QUFBQSxNQUF3RFIsVUFBVWhCLElBQUl0RixHQUF0RTtBQUNBLE1BQUl1RSxPQUFPWixLQUFLWSxJQUFoQjtBQUFBLE1BQXNCdUksY0FBY3ZJLEtBQUtLLE1BQXpDO0FBQ0EsTUFBSWlJLFFBQVFELEtBQUtqQyxJQUFMLENBQVV0RSxDQUF0QjtBQUNBLE1BQUlXLENBQUo7QUFDQXRELFNBQU9MLE9BQVAsR0FBaUJ1SixJQUFqQjtBQUNBLEVBekRBLEVBeURFNUosT0F6REYsRUF5RFcsUUF6RFg7O0FBMkRELEVBQUNBLFFBQVEsVUFBU1UsTUFBVCxFQUFnQjtBQUN4QixNQUFJQyxPQUFPWCxRQUFRLFFBQVIsQ0FBWDtBQUNBLE1BQUk0SixPQUFPNUosUUFBUSxRQUFSLENBQVg7QUFDQSxXQUFTaUssS0FBVCxHQUFnQjtBQUNmLE9BQUl6SSxDQUFKO0FBQ0EsT0FBRzBJLElBQUgsRUFBUTtBQUNQMUksUUFBSTJJLFFBQVFELEtBQUtoQyxHQUFMLEVBQVo7QUFDQSxJQUZELE1BRU87QUFDTjFHLFFBQUl1RCxNQUFKO0FBQ0E7QUFDRCxPQUFHVSxPQUFPakUsQ0FBVixFQUFZO0FBQ1gsV0FBTzRJLElBQUksQ0FBSixFQUFPM0UsT0FBT2pFLElBQUl5SSxNQUFNSSxLQUEvQjtBQUNBO0FBQ0QsVUFBTzVFLE9BQU9qRSxJQUFLLENBQUM0SSxLQUFLLENBQU4sSUFBV0UsQ0FBaEIsR0FBcUJMLE1BQU1JLEtBQXpDO0FBQ0E7QUFDRCxNQUFJdEYsT0FBT3BFLEtBQUtvRSxJQUFMLENBQVVqRSxFQUFyQjtBQUFBLE1BQXlCMkUsT0FBTyxDQUFDbkUsUUFBakM7QUFBQSxNQUEyQzhJLElBQUksQ0FBL0M7QUFBQSxNQUFrREUsSUFBSSxJQUF0RCxDQWZ3QixDQWVvQztBQUM1RCxNQUFJSixPQUFRLE9BQU9LLFdBQVAsS0FBdUIsV0FBeEIsR0FBdUNBLFlBQVlDLE1BQVosSUFBc0JELFdBQTdELEdBQTRFLEtBQXZGO0FBQUEsTUFBOEZKLFFBQVNELFFBQVFBLEtBQUtNLE1BQWIsSUFBdUJOLEtBQUtNLE1BQUwsQ0FBWUMsZUFBcEMsS0FBeURQLE9BQU8sS0FBaEUsQ0FBdEc7QUFDQUQsUUFBTTVHLENBQU4sR0FBVSxHQUFWO0FBQ0E0RyxRQUFNSSxLQUFOLEdBQWMsQ0FBZDtBQUNBSixRQUFNbkosRUFBTixHQUFXLFVBQVNLLENBQVQsRUFBWTBCLENBQVosRUFBZVQsQ0FBZixFQUFpQjtBQUFFO0FBQzdCLE9BQUlzRSxNQUFPN0QsS0FBSzFCLENBQUwsSUFBVUEsRUFBRXVKLEVBQUYsQ0FBVixJQUFtQnZKLEVBQUV1SixFQUFGLEVBQU1ULE1BQU01RyxDQUFaLENBQXBCLElBQXVDakIsQ0FBakQ7QUFDQSxPQUFHLENBQUNzRSxHQUFKLEVBQVE7QUFBRTtBQUFRO0FBQ2xCLFVBQU84QyxPQUFPOUMsTUFBTUEsSUFBSTdELENBQUosQ0FBYixJQUFzQjZELEdBQXRCLEdBQTRCLENBQUNwRixRQUFwQztBQUNBLEdBSkQ7QUFLQTJJLFFBQU14SSxHQUFOLEdBQVksVUFBU04sQ0FBVCxFQUFZMEIsQ0FBWixFQUFlZCxDQUFmLEVBQWtCNkIsQ0FBbEIsRUFBcUIrRCxJQUFyQixFQUEwQjtBQUFFO0FBQ3ZDLE9BQUcsQ0FBQ3hHLENBQUQsSUFBTSxDQUFDQSxFQUFFdUosRUFBRixDQUFWLEVBQWdCO0FBQUU7QUFDakIsUUFBRyxDQUFDL0MsSUFBSixFQUFTO0FBQUU7QUFDVjtBQUNBO0FBQ0R4RyxRQUFJeUksS0FBS2pDLElBQUwsQ0FBVWxHLEdBQVYsQ0FBY04sQ0FBZCxFQUFpQndHLElBQWpCLENBQUosQ0FKZSxDQUlhO0FBQzVCO0FBQ0QsT0FBSWpCLE1BQU1pRSxPQUFPeEosRUFBRXVKLEVBQUYsQ0FBUCxFQUFjVCxNQUFNNUcsQ0FBcEIsQ0FBVixDQVBxQyxDQU9IO0FBQ2xDLE9BQUdXLE1BQU1uQixDQUFOLElBQVdBLE1BQU02SCxFQUFwQixFQUF1QjtBQUN0QixRQUFHbEIsT0FBT3pILENBQVAsQ0FBSCxFQUFhO0FBQ1oyRSxTQUFJN0QsQ0FBSixJQUFTZCxDQUFULENBRFksQ0FDQTtBQUNaO0FBQ0QsUUFBR2lDLE1BQU1KLENBQVQsRUFBVztBQUFFO0FBQ1p6QyxPQUFFMEIsQ0FBRixJQUFPZSxDQUFQO0FBQ0E7QUFDRDtBQUNELFVBQU96QyxDQUFQO0FBQ0EsR0FqQkQ7QUFrQkE4SSxRQUFNNUYsRUFBTixHQUFXLFVBQVNDLElBQVQsRUFBZXpCLENBQWYsRUFBa0J3QixFQUFsQixFQUFxQjtBQUMvQixPQUFJdUcsTUFBTXRHLEtBQUt6QixDQUFMLENBQVY7QUFDQSxPQUFHb0IsT0FBTzJHLEdBQVAsQ0FBSCxFQUFlO0FBQ2RBLFVBQU1DLFNBQVNELEdBQVQsQ0FBTjtBQUNBO0FBQ0QsVUFBT1gsTUFBTXhJLEdBQU4sQ0FBVTRDLEVBQVYsRUFBY3hCLENBQWQsRUFBaUJvSCxNQUFNbkosRUFBTixDQUFTd0QsSUFBVCxFQUFlekIsQ0FBZixDQUFqQixFQUFvQytILEdBQXBDLEVBQXlDaEIsS0FBS2pDLElBQUwsQ0FBVXJELElBQVYsQ0FBekMsQ0FBUDtBQUNBLEdBTkQsQ0FPRSxhQUFVO0FBQ1gyRixTQUFNak4sR0FBTixHQUFZLFVBQVN1SixFQUFULEVBQWF4RSxDQUFiLEVBQWdCZ0MsRUFBaEIsRUFBbUI7QUFBRSxRQUFJQyxDQUFKLENBQUYsQ0FBUztBQUN2QyxRQUFJNUIsSUFBSTZCLE9BQU83QixJQUFJbUUsTUFBTXhFLENBQWpCLElBQXFCSyxDQUFyQixHQUF5QixJQUFqQztBQUNBbUUsU0FBSzFCLE1BQU0wQixLQUFLQSxNQUFNeEUsQ0FBakIsSUFBcUJ3RSxFQUFyQixHQUEwQixJQUEvQjtBQUNBLFFBQUduRSxLQUFLLENBQUNtRSxFQUFULEVBQVk7QUFDWHhFLFNBQUl5SCxPQUFPekgsQ0FBUCxJQUFXQSxDQUFYLEdBQWVrSSxPQUFuQjtBQUNBN0gsT0FBRXNJLEVBQUYsSUFBUXRJLEVBQUVzSSxFQUFGLEtBQVMsRUFBakI7QUFDQXBILGFBQVFsQixDQUFSLEVBQVdwRixHQUFYLEVBQWdCLEVBQUNvRixHQUFFQSxDQUFILEVBQUtMLEdBQUVBLENBQVAsRUFBaEI7QUFDQSxZQUFPSyxDQUFQO0FBQ0E7QUFDRDJCLFNBQUtBLE1BQU1FLE9BQU9sQyxDQUFQLENBQU4sR0FBaUJBLENBQWpCLEdBQXFCaUMsQ0FBMUI7QUFDQWpDLFFBQUl5SCxPQUFPekgsQ0FBUCxJQUFXQSxDQUFYLEdBQWVrSSxPQUFuQjtBQUNBLFdBQU8sVUFBU3JHLENBQVQsRUFBWWYsQ0FBWixFQUFlVCxDQUFmLEVBQWtCMkQsR0FBbEIsRUFBc0I7QUFDNUIsU0FBRyxDQUFDUSxFQUFKLEVBQU87QUFDTnZKLFVBQUkwRyxJQUFKLENBQVMsRUFBQ3RCLEdBQUdBLENBQUosRUFBT0wsR0FBR0EsQ0FBVixFQUFULEVBQXVCNkIsQ0FBdkIsRUFBeUJmLENBQXpCO0FBQ0EsYUFBT2UsQ0FBUDtBQUNBO0FBQ0QyQyxRQUFHN0MsSUFBSCxDQUFRSyxNQUFNLElBQU4sSUFBYyxFQUF0QixFQUEwQkgsQ0FBMUIsRUFBNkJmLENBQTdCLEVBQWdDVCxDQUFoQyxFQUFtQzJELEdBQW5DO0FBQ0EsU0FBRzNCLFFBQVFoQyxDQUFSLEVBQVVTLENBQVYsS0FBZ0JtQixNQUFNNUIsRUFBRVMsQ0FBRixDQUF6QixFQUE4QjtBQUFFO0FBQVE7QUFDeEM3RixTQUFJMEcsSUFBSixDQUFTLEVBQUN0QixHQUFHQSxDQUFKLEVBQU9MLEdBQUdBLENBQVYsRUFBVCxFQUF1QjZCLENBQXZCLEVBQXlCZixDQUF6QjtBQUNBLEtBUkQ7QUFTQSxJQXBCRDtBQXFCQSxZQUFTN0YsR0FBVCxDQUFhNEcsQ0FBYixFQUFlZixDQUFmLEVBQWlCO0FBQ2hCLFFBQUc2SCxPQUFPN0gsQ0FBVixFQUFZO0FBQUU7QUFBUTtBQUN0Qm9ILFVBQU14SSxHQUFOLENBQVUsS0FBS1csQ0FBZixFQUFrQlMsQ0FBbEIsRUFBcUIsS0FBS2QsQ0FBMUI7QUFDQTtBQUNELEdBMUJDLEdBQUQ7QUEyQkQsTUFBSU8sTUFBTTNCLEtBQUsyQixHQUFmO0FBQUEsTUFBb0JxSSxTQUFTckksSUFBSXlCLEVBQWpDO0FBQUEsTUFBcUNLLFVBQVU5QixJQUFJQyxHQUFuRDtBQUFBLE1BQXdEMEIsU0FBUzNCLElBQUl4QixFQUFyRTtBQUFBLE1BQXlFd0MsVUFBVWhCLElBQUl0RixHQUF2RjtBQUFBLE1BQTRGNk4sV0FBV3ZJLElBQUlpQyxJQUEzRztBQUNBLE1BQUlyRCxNQUFNUCxLQUFLTyxHQUFmO0FBQUEsTUFBb0JzSSxTQUFTdEksSUFBSUosRUFBakM7QUFDQSxNQUFJRCxLQUFLRixLQUFLRSxFQUFkO0FBQUEsTUFBa0JnRSxRQUFRaEUsR0FBR0MsRUFBN0I7QUFDQSxNQUFJNEosS0FBS2QsS0FBS3ZHLENBQWQ7QUFBQSxNQUFpQlcsQ0FBakI7QUFDQXRELFNBQU9MLE9BQVAsR0FBaUI0SixLQUFqQjtBQUNBLEVBakZBLEVBaUZFakssT0FqRkYsRUFpRlcsU0FqRlg7O0FBbUZELEVBQUNBLFFBQVEsVUFBU1UsTUFBVCxFQUFnQjtBQUN4QixNQUFJQyxPQUFPWCxRQUFRLFFBQVIsQ0FBWDtBQUNBLE1BQUlxSixNQUFNckosUUFBUSxPQUFSLENBQVY7QUFDQSxNQUFJNEosT0FBTzVKLFFBQVEsUUFBUixDQUFYO0FBQ0EsTUFBSThLLFFBQVEsRUFBWjtBQUNBLEdBQUUsYUFBVTtBQUNYQSxTQUFNaEssRUFBTixHQUFXLFVBQVNpSyxDQUFULEVBQVl4RSxFQUFaLEVBQWdCMUYsRUFBaEIsRUFBb0JrRCxFQUFwQixFQUF1QjtBQUFFO0FBQ25DLFFBQUcsQ0FBQ2dILENBQUQsSUFBTSxDQUFDOUcsT0FBTzhHLENBQVAsQ0FBUCxJQUFvQkMsVUFBVUQsQ0FBVixDQUF2QixFQUFvQztBQUFFLFlBQU8sS0FBUDtBQUFjLEtBRG5CLENBQ29CO0FBQ3JELFdBQU8sQ0FBQ3pILFFBQVF5SCxDQUFSLEVBQVcvTixHQUFYLEVBQWdCLEVBQUN1SixJQUFHQSxFQUFKLEVBQU8xRixJQUFHQSxFQUFWLEVBQWFrRCxJQUFHQSxFQUFoQixFQUFoQixDQUFSLENBRmlDLENBRWE7QUFDOUMsSUFIRDtBQUlBLFlBQVMvRyxHQUFULENBQWFtRSxDQUFiLEVBQWdCWSxDQUFoQixFQUFrQjtBQUFFO0FBQ25CLFFBQUcsQ0FBQ1osQ0FBRCxJQUFNWSxNQUFNNkgsS0FBS2pDLElBQUwsQ0FBVXhHLENBQVYsQ0FBWixJQUE0QixDQUFDeUksS0FBSzlJLEVBQUwsQ0FBUUssQ0FBUixFQUFXLEtBQUtOLEVBQWhCLEVBQW9CLEtBQUtrRCxFQUF6QixDQUFoQyxFQUE2RDtBQUFFLFlBQU8sSUFBUDtBQUFhLEtBRDNELENBQzREO0FBQzdFLFFBQUcsQ0FBQyxLQUFLd0MsRUFBVCxFQUFZO0FBQUU7QUFBUTtBQUN0QjBFLE9BQUc5SixDQUFILEdBQU9BLENBQVAsQ0FBVThKLEdBQUdsSCxFQUFILEdBQVEsS0FBS0EsRUFBYixDQUhPLENBR1U7QUFDM0IsU0FBS3dDLEVBQUwsQ0FBUTdDLElBQVIsQ0FBYXVILEdBQUdsSCxFQUFoQixFQUFvQjVDLENBQXBCLEVBQXVCWSxDQUF2QixFQUEwQmtKLEVBQTFCO0FBQ0E7QUFDRCxZQUFTQSxFQUFULENBQVlwSyxFQUFaLEVBQWU7QUFBRTtBQUNoQixRQUFHQSxFQUFILEVBQU07QUFBRStJLFVBQUs5SSxFQUFMLENBQVFtSyxHQUFHOUosQ0FBWCxFQUFjTixFQUFkLEVBQWtCb0ssR0FBR2xILEVBQXJCO0FBQTBCLEtBRHBCLENBQ3FCO0FBQ25DO0FBQ0QsR0FkQyxHQUFEO0FBZUQsR0FBRSxhQUFVO0FBQ1grRyxTQUFNckosR0FBTixHQUFZLFVBQVNhLEdBQVQsRUFBYzRJLEdBQWQsRUFBbUJuSCxFQUFuQixFQUFzQjtBQUNqQyxRQUFJOEMsS0FBSyxFQUFDekcsTUFBTSxFQUFQLEVBQVdrQyxLQUFLQSxHQUFoQixFQUFUO0FBQ0EsUUFBRyxDQUFDNEksR0FBSixFQUFRO0FBQ1BBLFdBQU0sRUFBTjtBQUNBLEtBRkQsTUFHQSxJQUFHLE9BQU9BLEdBQVAsS0FBZSxRQUFsQixFQUEyQjtBQUMxQkEsV0FBTSxFQUFDdkQsTUFBTXVELEdBQVAsRUFBTjtBQUNBLEtBRkQsTUFHQSxJQUFHQSxlQUFlN0YsUUFBbEIsRUFBMkI7QUFDMUI2RixTQUFJbE8sR0FBSixHQUFVa08sR0FBVjtBQUNBO0FBQ0QsUUFBR0EsSUFBSXZELElBQVAsRUFBWTtBQUNYZCxRQUFHNEMsR0FBSCxHQUFTSixJQUFJSSxHQUFKLENBQVFoSSxHQUFSLENBQVl5SixJQUFJdkQsSUFBaEIsQ0FBVDtBQUNBO0FBQ0R1RCxRQUFJQyxLQUFKLEdBQVlELElBQUlDLEtBQUosSUFBYSxFQUF6QjtBQUNBRCxRQUFJRSxJQUFKLEdBQVdGLElBQUlFLElBQUosSUFBWSxFQUF2QjtBQUNBRixRQUFJbkgsRUFBSixHQUFTbUgsSUFBSW5ILEVBQUosSUFBVUEsRUFBbkI7QUFDQWdHLFNBQUttQixHQUFMLEVBQVVyRSxFQUFWO0FBQ0FxRSxRQUFJckwsSUFBSixHQUFXZ0gsR0FBR2tELElBQWQ7QUFDQSxXQUFPbUIsSUFBSUMsS0FBWDtBQUNBLElBcEJEO0FBcUJBLFlBQVNwQixJQUFULENBQWNtQixHQUFkLEVBQW1CckUsRUFBbkIsRUFBc0I7QUFBRSxRQUFJSCxHQUFKO0FBQ3ZCLFFBQUdBLE1BQU0wRSxLQUFLRixHQUFMLEVBQVVyRSxFQUFWLENBQVQsRUFBdUI7QUFBRSxZQUFPSCxHQUFQO0FBQVk7QUFDckNHLE9BQUdxRSxHQUFILEdBQVNBLEdBQVQ7QUFDQXJFLE9BQUdjLElBQUgsR0FBVUEsSUFBVjtBQUNBLFFBQUdpQyxLQUFLbkksR0FBTCxDQUFTb0YsR0FBR3ZFLEdBQVosRUFBaUJ0RixHQUFqQixFQUFzQjZKLEVBQXRCLENBQUgsRUFBNkI7QUFDNUI7QUFDQXFFLFNBQUlDLEtBQUosQ0FBVTlCLElBQUlJLEdBQUosQ0FBUTNJLEVBQVIsQ0FBVytGLEdBQUc0QyxHQUFkLENBQVYsSUFBZ0M1QyxHQUFHa0QsSUFBbkM7QUFDQTtBQUNELFdBQU9sRCxFQUFQO0FBQ0E7QUFDRCxZQUFTN0osR0FBVCxDQUFhNEcsQ0FBYixFQUFlZixDQUFmLEVBQWlCMUIsQ0FBakIsRUFBbUI7QUFDbEIsUUFBSTBGLEtBQUssSUFBVDtBQUFBLFFBQWVxRSxNQUFNckUsR0FBR3FFLEdBQXhCO0FBQUEsUUFBNkJwSyxFQUE3QjtBQUFBLFFBQWlDNEYsR0FBakM7QUFDQSxRQUFHa0QsS0FBS3ZHLENBQUwsS0FBV1IsQ0FBWCxJQUFnQnVCLFFBQVFSLENBQVIsRUFBVXlGLElBQUlJLEdBQUosQ0FBUXBHLENBQWxCLENBQW5CLEVBQXdDO0FBQ3ZDLFlBQU9sQyxFQUFFa0MsQ0FBVCxDQUR1QyxDQUMzQjtBQUNaO0FBQ0QsUUFBRyxFQUFFdkMsS0FBS3VLLE1BQU16SCxDQUFOLEVBQVFmLENBQVIsRUFBVTFCLENBQVYsRUFBYTBGLEVBQWIsRUFBZ0JxRSxHQUFoQixDQUFQLENBQUgsRUFBZ0M7QUFBRTtBQUFRO0FBQzFDLFFBQUcsQ0FBQ3JJLENBQUosRUFBTTtBQUNMZ0UsUUFBR2tELElBQUgsR0FBVWxELEdBQUdrRCxJQUFILElBQVc1SSxDQUFYLElBQWdCLEVBQTFCO0FBQ0EsU0FBR2lELFFBQVFSLENBQVIsRUFBV2dHLEtBQUt2RyxDQUFoQixDQUFILEVBQXNCO0FBQ3JCd0QsU0FBR2tELElBQUgsQ0FBUTFHLENBQVIsR0FBWXdILFNBQVNqSCxFQUFFUCxDQUFYLENBQVo7QUFDQTtBQUNEd0QsUUFBR2tELElBQUgsR0FBVUgsS0FBS2pDLElBQUwsQ0FBVWxHLEdBQVYsQ0FBY29GLEdBQUdrRCxJQUFqQixFQUF1QlYsSUFBSUksR0FBSixDQUFRM0ksRUFBUixDQUFXK0YsR0FBRzRDLEdBQWQsQ0FBdkIsQ0FBVjtBQUNBNUMsUUFBRzRDLEdBQUgsR0FBUzVDLEdBQUc0QyxHQUFILElBQVVKLElBQUlJLEdBQUosQ0FBUWhJLEdBQVIsQ0FBWW1JLEtBQUtqQyxJQUFMLENBQVVkLEdBQUdrRCxJQUFiLENBQVosQ0FBbkI7QUFDQTtBQUNELFFBQUdyRCxNQUFNd0UsSUFBSWxPLEdBQWIsRUFBaUI7QUFDaEIwSixTQUFJaEQsSUFBSixDQUFTd0gsSUFBSW5ILEVBQUosSUFBVSxFQUFuQixFQUF1QkgsQ0FBdkIsRUFBeUJmLENBQXpCLEVBQTJCMUIsQ0FBM0IsRUFBOEIwRixFQUE5QjtBQUNBLFNBQUd6QyxRQUFRakQsQ0FBUixFQUFVMEIsQ0FBVixDQUFILEVBQWdCO0FBQ2ZlLFVBQUl6QyxFQUFFMEIsQ0FBRixDQUFKO0FBQ0EsVUFBR21CLE1BQU1KLENBQVQsRUFBVztBQUNWb0csZUFBUTdJLENBQVIsRUFBVzBCLENBQVg7QUFDQTtBQUNBO0FBQ0QsVUFBRyxFQUFFL0IsS0FBS3VLLE1BQU16SCxDQUFOLEVBQVFmLENBQVIsRUFBVTFCLENBQVYsRUFBYTBGLEVBQWIsRUFBZ0JxRSxHQUFoQixDQUFQLENBQUgsRUFBZ0M7QUFBRTtBQUFRO0FBQzFDO0FBQ0Q7QUFDRCxRQUFHLENBQUNySSxDQUFKLEVBQU07QUFBRSxZQUFPZ0UsR0FBR2tELElBQVY7QUFBZ0I7QUFDeEIsUUFBRyxTQUFTakosRUFBWixFQUFlO0FBQ2QsWUFBTzhDLENBQVA7QUFDQTtBQUNEOEMsVUFBTXFELEtBQUttQixHQUFMLEVBQVUsRUFBQzVJLEtBQUtzQixDQUFOLEVBQVN4RCxNQUFNeUcsR0FBR3pHLElBQUgsQ0FBUXFILE1BQVIsQ0FBZTVFLENBQWYsQ0FBZixFQUFWLENBQU47QUFDQSxRQUFHLENBQUM2RCxJQUFJcUQsSUFBUixFQUFhO0FBQUU7QUFBUTtBQUN2QixXQUFPckQsSUFBSStDLEdBQVgsQ0EvQmtCLENBK0JGO0FBQ2hCO0FBQ0QsWUFBUzlCLElBQVQsQ0FBYzNCLEVBQWQsRUFBaUI7QUFBRSxRQUFJYSxLQUFLLElBQVQ7QUFDbEIsUUFBSXlFLE9BQU9qQyxJQUFJSSxHQUFKLENBQVEzSSxFQUFSLENBQVcrRixHQUFHNEMsR0FBZCxDQUFYO0FBQUEsUUFBK0IwQixRQUFRdEUsR0FBR3FFLEdBQUgsQ0FBT0MsS0FBOUM7QUFDQXRFLE9BQUc0QyxHQUFILEdBQVM1QyxHQUFHNEMsR0FBSCxJQUFVSixJQUFJSSxHQUFKLENBQVFoSSxHQUFSLENBQVl1RSxFQUFaLENBQW5CO0FBQ0FhLE9BQUc0QyxHQUFILENBQU9KLElBQUlJLEdBQUosQ0FBUXBHLENBQWYsSUFBb0IyQyxFQUFwQjtBQUNBLFFBQUdhLEdBQUdrRCxJQUFILElBQVdsRCxHQUFHa0QsSUFBSCxDQUFRSCxLQUFLdkcsQ0FBYixDQUFkLEVBQThCO0FBQzdCd0QsUUFBR2tELElBQUgsQ0FBUUgsS0FBS3ZHLENBQWIsRUFBZ0JnRyxJQUFJSSxHQUFKLENBQVFwRyxDQUF4QixJQUE2QjJDLEVBQTdCO0FBQ0E7QUFDRCxRQUFHNUIsUUFBUStHLEtBQVIsRUFBZUcsSUFBZixDQUFILEVBQXdCO0FBQ3ZCSCxXQUFNbkYsRUFBTixJQUFZbUYsTUFBTUcsSUFBTixDQUFaO0FBQ0F0QixhQUFRbUIsS0FBUixFQUFlRyxJQUFmO0FBQ0E7QUFDRDtBQUNELFlBQVNELEtBQVQsQ0FBZXpILENBQWYsRUFBaUJmLENBQWpCLEVBQW1CMUIsQ0FBbkIsRUFBc0IwRixFQUF0QixFQUF5QnFFLEdBQXpCLEVBQTZCO0FBQUUsUUFBSXhFLEdBQUo7QUFDOUIsUUFBRzJDLElBQUl2SSxFQUFKLENBQU84QyxDQUFQLENBQUgsRUFBYTtBQUFFLFlBQU8sSUFBUDtBQUFhO0FBQzVCLFFBQUdLLE9BQU9MLENBQVAsQ0FBSCxFQUFhO0FBQUUsWUFBTyxDQUFQO0FBQVU7QUFDekIsUUFBRzhDLE1BQU13RSxJQUFJSyxPQUFiLEVBQXFCO0FBQ3BCM0gsU0FBSThDLElBQUloRCxJQUFKLENBQVN3SCxJQUFJbkgsRUFBSixJQUFVLEVBQW5CLEVBQXVCSCxDQUF2QixFQUF5QmYsQ0FBekIsRUFBMkIxQixDQUEzQixDQUFKO0FBQ0EsWUFBT2tLLE1BQU16SCxDQUFOLEVBQVFmLENBQVIsRUFBVTFCLENBQVYsRUFBYTBGLEVBQWIsRUFBZ0JxRSxHQUFoQixDQUFQO0FBQ0E7QUFDREEsUUFBSXBQLEdBQUosR0FBVSx1QkFBdUIrSyxHQUFHekcsSUFBSCxDQUFRcUgsTUFBUixDQUFlNUUsQ0FBZixFQUFrQjJJLElBQWxCLENBQXVCLEdBQXZCLENBQXZCLEdBQXFELElBQS9EO0FBQ0E7QUFDRCxZQUFTSixJQUFULENBQWNGLEdBQWQsRUFBbUJyRSxFQUFuQixFQUFzQjtBQUNyQixRQUFJNEUsTUFBTVAsSUFBSUUsSUFBZDtBQUFBLFFBQW9CbFAsSUFBSXVQLElBQUl0UCxNQUE1QjtBQUFBLFFBQW9Db0csR0FBcEM7QUFDQSxXQUFNckcsR0FBTixFQUFVO0FBQUVxRyxXQUFNa0osSUFBSXZQLENBQUosQ0FBTjtBQUNYLFNBQUcySyxHQUFHdkUsR0FBSCxLQUFXQyxJQUFJRCxHQUFsQixFQUFzQjtBQUFFLGFBQU9DLEdBQVA7QUFBWTtBQUNwQztBQUNEa0osUUFBSXBQLElBQUosQ0FBU3dLLEVBQVQ7QUFDQTtBQUNELEdBN0ZDLEdBQUQ7QUE4RkRpRSxRQUFNZixJQUFOLEdBQWEsVUFBU0EsSUFBVCxFQUFjO0FBQzFCLE9BQUlwQyxPQUFPaUMsS0FBS2pDLElBQUwsQ0FBVW9DLElBQVYsQ0FBWDtBQUNBLE9BQUcsQ0FBQ3BDLElBQUosRUFBUztBQUFFO0FBQVE7QUFDbkIsVUFBT2dDLFFBQVEsRUFBUixFQUFZaEMsSUFBWixFQUFrQm9DLElBQWxCLENBQVA7QUFDQSxHQUpELENBS0UsYUFBVTtBQUNYZSxTQUFNekcsRUFBTixHQUFXLFVBQVM4RyxLQUFULEVBQWdCdEwsSUFBaEIsRUFBc0JrRyxHQUF0QixFQUEwQjtBQUNwQyxRQUFHLENBQUNvRixLQUFKLEVBQVU7QUFBRTtBQUFRO0FBQ3BCLFFBQUk3SSxNQUFNLEVBQVY7QUFDQXlELFVBQU1BLE9BQU8sRUFBQ3FGLE1BQU0sRUFBUCxFQUFiO0FBQ0E5SCxZQUFRNkgsTUFBTXRMLElBQU4sQ0FBUixFQUFxQjdDLEdBQXJCLEVBQTBCLEVBQUNzRixLQUFJQSxHQUFMLEVBQVU2SSxPQUFPQSxLQUFqQixFQUF3QnBGLEtBQUtBLEdBQTdCLEVBQTFCO0FBQ0EsV0FBT3pELEdBQVA7QUFDQSxJQU5EO0FBT0EsWUFBU3RGLEdBQVQsQ0FBYTRHLENBQWIsRUFBZWYsQ0FBZixFQUFpQjtBQUFFLFFBQUk2RCxHQUFKLEVBQVNwRSxHQUFUO0FBQ2xCLFFBQUdzSCxLQUFLdkcsQ0FBTCxLQUFXUixDQUFkLEVBQWdCO0FBQ2YsU0FBR21JLFVBQVVwSCxDQUFWLEVBQWF5RixJQUFJSSxHQUFKLENBQVFwRyxDQUFyQixDQUFILEVBQTJCO0FBQzFCO0FBQ0E7QUFDRCxVQUFLZixHQUFMLENBQVNPLENBQVQsSUFBY2dJLFNBQVNqSCxDQUFULENBQWQ7QUFDQTtBQUNBO0FBQ0QsUUFBRyxFQUFFOEMsTUFBTTJDLElBQUlJLEdBQUosQ0FBUTNJLEVBQVIsQ0FBVzhDLENBQVgsQ0FBUixDQUFILEVBQTBCO0FBQ3pCLFVBQUt0QixHQUFMLENBQVNPLENBQVQsSUFBY2UsQ0FBZDtBQUNBO0FBQ0E7QUFDRCxRQUFHdEIsTUFBTSxLQUFLeUQsR0FBTCxDQUFTcUYsSUFBVCxDQUFjMUUsR0FBZCxDQUFULEVBQTRCO0FBQzNCLFVBQUtwRSxHQUFMLENBQVNPLENBQVQsSUFBY1AsR0FBZDtBQUNBO0FBQ0E7QUFDRCxTQUFLQSxHQUFMLENBQVNPLENBQVQsSUFBYyxLQUFLa0QsR0FBTCxDQUFTcUYsSUFBVCxDQUFjMUUsR0FBZCxJQUFxQm9FLE1BQU16RyxFQUFOLENBQVMsS0FBSzhHLEtBQWQsRUFBcUJ6RSxHQUFyQixFQUEwQixLQUFLWCxHQUEvQixDQUFuQztBQUNBO0FBQ0QsR0ExQkMsR0FBRDtBQTJCRCxNQUFJbEIsUUFBUWxFLEtBQUtFLEVBQUwsQ0FBUUMsRUFBcEI7QUFDQSxNQUFJd0IsTUFBTTNCLEtBQUsyQixHQUFmO0FBQUEsTUFBb0IyQixTQUFTM0IsSUFBSXhCLEVBQWpDO0FBQUEsTUFBcUNrSixVQUFVMUgsSUFBSXdCLEdBQW5EO0FBQUEsTUFBd0RNLFVBQVU5QixJQUFJQyxHQUF0RTtBQUFBLE1BQTJFeUksWUFBWTFJLElBQUlrQyxLQUEzRjtBQUFBLE1BQWtHbUYsVUFBVXJILElBQUlxQixHQUFoSDtBQUFBLE1BQXFITCxVQUFVaEIsSUFBSXRGLEdBQW5JO0FBQUEsTUFBd0k2TixXQUFXdkksSUFBSWlDLElBQXZKO0FBQ0EsTUFBSVAsQ0FBSjtBQUNBdEQsU0FBT0wsT0FBUCxHQUFpQnlLLEtBQWpCO0FBQ0EsRUF0SkEsRUFzSkU5SyxPQXRKRixFQXNKVyxTQXRKWDs7QUF3SkQsRUFBQ0EsUUFBUSxVQUFTVSxNQUFULEVBQWdCO0FBQ3hCLE1BQUlDLE9BQU9YLFFBQVEsUUFBUixDQUFYO0FBQ0EsV0FBUzBMLEdBQVQsR0FBYztBQUNiLFFBQUtDLEtBQUwsR0FBYSxFQUFiO0FBQ0E7QUFDREQsTUFBSTFJLFNBQUosQ0FBYzRJLEtBQWQsR0FBc0IsVUFBUzVGLEVBQVQsRUFBWTtBQUNqQyxRQUFLMkYsS0FBTCxDQUFXM0YsRUFBWCxJQUFpQnJGLEtBQUtvRSxJQUFMLENBQVVqRSxFQUFWLEVBQWpCO0FBQ0EsT0FBSSxDQUFDLEtBQUt1RCxFQUFWLEVBQWM7QUFDYixTQUFLd0gsRUFBTCxHQURhLENBQ0Y7QUFDWDtBQUNELFVBQU83RixFQUFQO0FBQ0EsR0FORDtBQU9BMEYsTUFBSTFJLFNBQUosQ0FBY3FGLEtBQWQsR0FBc0IsVUFBU3JDLEVBQVQsRUFBWTtBQUNqQztBQUNBLFVBQU9yRixLQUFLMkIsR0FBTCxDQUFTQyxHQUFULENBQWEsS0FBS29KLEtBQWxCLEVBQXlCM0YsRUFBekIsSUFBOEIsS0FBSzRGLEtBQUwsQ0FBVzVGLEVBQVgsQ0FBOUIsR0FBK0MsS0FBdEQsQ0FGaUMsQ0FFNEI7QUFDN0QsR0FIRDtBQUlBMEYsTUFBSTFJLFNBQUosQ0FBYzZJLEVBQWQsR0FBbUIsWUFBVTtBQUM1QixPQUFJQyxLQUFLLElBQVQ7QUFBQSxPQUFlNUQsTUFBTXZILEtBQUtvRSxJQUFMLENBQVVqRSxFQUFWLEVBQXJCO0FBQUEsT0FBcUNpTCxTQUFTN0QsR0FBOUM7QUFBQSxPQUFtRDhELFNBQVMsSUFBSSxFQUFKLEdBQVMsSUFBckU7QUFDQTtBQUNBckwsUUFBSzJCLEdBQUwsQ0FBU3RGLEdBQVQsQ0FBYThPLEdBQUdILEtBQWhCLEVBQXVCLFVBQVM1RyxJQUFULEVBQWVpQixFQUFmLEVBQWtCO0FBQ3hDK0YsYUFBUzlKLEtBQUtnSyxHQUFMLENBQVMvRCxHQUFULEVBQWNuRCxJQUFkLENBQVQ7QUFDQSxRQUFLbUQsTUFBTW5ELElBQVAsR0FBZWlILE1BQW5CLEVBQTBCO0FBQUU7QUFBUTtBQUNwQ3JMLFNBQUsyQixHQUFMLENBQVN3QixHQUFULENBQWFnSSxHQUFHSCxLQUFoQixFQUF1QjNGLEVBQXZCO0FBQ0EsSUFKRDtBQUtBLE9BQUlrRyxPQUFPdkwsS0FBSzJCLEdBQUwsQ0FBU2tDLEtBQVQsQ0FBZXNILEdBQUdILEtBQWxCLENBQVg7QUFDQSxPQUFHTyxJQUFILEVBQVE7QUFDUEosT0FBR3pILEVBQUgsR0FBUSxJQUFSLENBRE8sQ0FDTztBQUNkO0FBQ0E7QUFDRCxPQUFJOEgsVUFBVWpFLE1BQU02RCxNQUFwQixDQWI0QixDQWFBO0FBQzVCLE9BQUlLLFNBQVNKLFNBQVNHLE9BQXRCLENBZDRCLENBY0c7QUFDL0JMLE1BQUd6SCxFQUFILEdBQVErRCxXQUFXLFlBQVU7QUFBRTBELE9BQUdELEVBQUg7QUFBUyxJQUFoQyxFQUFrQ08sTUFBbEMsQ0FBUixDQWY0QixDQWV1QjtBQUNuRCxHQWhCRDtBQWlCQTFMLFNBQU9MLE9BQVAsR0FBaUJxTCxHQUFqQjtBQUNBLEVBbENBLEVBa0NFMUwsT0FsQ0YsRUFrQ1csT0FsQ1g7O0FBb0NELEVBQUNBLFFBQVEsVUFBU1UsTUFBVCxFQUFnQjs7QUFFeEIsV0FBUzJHLEdBQVQsQ0FBYWpGLENBQWIsRUFBZTtBQUNkLE9BQUdBLGFBQWFpRixHQUFoQixFQUFvQjtBQUFFLFdBQU8sQ0FBQyxLQUFLaEUsQ0FBTCxHQUFTLEVBQUNxRSxLQUFLLElBQU4sRUFBVixFQUF1QkEsR0FBOUI7QUFBbUM7QUFDekQsT0FBRyxFQUFFLGdCQUFnQkwsR0FBbEIsQ0FBSCxFQUEwQjtBQUFFLFdBQU8sSUFBSUEsR0FBSixDQUFRakYsQ0FBUixDQUFQO0FBQW1CO0FBQy9DLFVBQU9pRixJQUFJdkIsTUFBSixDQUFXLEtBQUt6QyxDQUFMLEdBQVMsRUFBQ3FFLEtBQUssSUFBTixFQUFZM0IsS0FBSzNELENBQWpCLEVBQXBCLENBQVA7QUFDQTs7QUFFRGlGLE1BQUl2RyxFQUFKLEdBQVMsVUFBUzRHLEdBQVQsRUFBYTtBQUFFLFVBQVFBLGVBQWVMLEdBQXZCO0FBQTZCLEdBQXJEOztBQUVBQSxNQUFJZ0YsT0FBSixHQUFjLEdBQWQ7O0FBRUFoRixNQUFJakIsS0FBSixHQUFZaUIsSUFBSXJFLFNBQWhCO0FBQ0FxRSxNQUFJakIsS0FBSixDQUFVa0csTUFBVixHQUFtQixZQUFVLENBQUUsQ0FBL0I7O0FBRUEsTUFBSTNMLE9BQU9YLFFBQVEsUUFBUixDQUFYO0FBQ0FXLE9BQUsyQixHQUFMLENBQVMrQixFQUFULENBQVkxRCxJQUFaLEVBQWtCMEcsR0FBbEI7QUFDQUEsTUFBSW1CLEdBQUosR0FBVXhJLFFBQVEsT0FBUixDQUFWO0FBQ0FxSCxNQUFJdUQsR0FBSixHQUFVNUssUUFBUSxPQUFSLENBQVY7QUFDQXFILE1BQUkwQyxJQUFKLEdBQVcvSixRQUFRLFFBQVIsQ0FBWDtBQUNBcUgsTUFBSU8sS0FBSixHQUFZNUgsUUFBUSxTQUFSLENBQVo7QUFDQXFILE1BQUk4RCxLQUFKLEdBQVluTCxRQUFRLFNBQVIsQ0FBWjtBQUNBcUgsTUFBSWtGLEdBQUosR0FBVXZNLFFBQVEsT0FBUixDQUFWO0FBQ0FxSCxNQUFJbUYsUUFBSixHQUFleE0sUUFBUSxZQUFSLENBQWY7QUFDQXFILE1BQUkxQixFQUFKLEdBQVMzRixRQUFRLFNBQVIsR0FBVDs7QUFFQXFILE1BQUloRSxDQUFKLEdBQVEsRUFBRTtBQUNUMEcsU0FBTTFDLElBQUkwQyxJQUFKLENBQVMxRyxDQURSLENBQ1U7QUFEVixLQUVOc0UsTUFBTU4sSUFBSXVELEdBQUosQ0FBUW5CLEdBQVIsQ0FBWXBHLENBRlosQ0FFYztBQUZkLEtBR051RSxPQUFPUCxJQUFJTyxLQUFKLENBQVV2RSxDQUhYLENBR2E7QUFIYixLQUlOb0osT0FBTyxHQUpELENBSUs7QUFKTCxLQUtOQyxPQUFPLEdBTEQsQ0FLSztBQUxMLEdBQVIsQ0FRRSxhQUFVO0FBQ1hyRixPQUFJdkIsTUFBSixHQUFhLFVBQVNlLEVBQVQsRUFBWTtBQUN4QkEsT0FBR2xCLEVBQUgsR0FBUWtCLEdBQUdsQixFQUFILElBQVMwQixJQUFJMUIsRUFBckI7QUFDQWtCLE9BQUdoSCxJQUFILEdBQVVnSCxHQUFHaEgsSUFBSCxJQUFXZ0gsR0FBR2EsR0FBeEI7QUFDQWIsT0FBR3NFLEtBQUgsR0FBV3RFLEdBQUdzRSxLQUFILElBQVksRUFBdkI7QUFDQXRFLE9BQUcwRixHQUFILEdBQVMxRixHQUFHMEYsR0FBSCxJQUFVLElBQUlsRixJQUFJa0YsR0FBUixFQUFuQjtBQUNBMUYsT0FBR0UsR0FBSCxHQUFTTSxJQUFJMUIsRUFBSixDQUFPb0IsR0FBaEI7QUFDQUYsT0FBR0ksR0FBSCxHQUFTSSxJQUFJMUIsRUFBSixDQUFPc0IsR0FBaEI7QUFDQSxRQUFJUyxNQUFNYixHQUFHYSxHQUFILENBQU8zQixHQUFQLENBQVdjLEdBQUdkLEdBQWQsQ0FBVjtBQUNBLFFBQUcsQ0FBQ2MsR0FBRzhGLElBQVAsRUFBWTtBQUNYOUYsUUFBR2xCLEVBQUgsQ0FBTSxJQUFOLEVBQVk5RixJQUFaLEVBQWtCZ0gsRUFBbEI7QUFDQUEsUUFBR2xCLEVBQUgsQ0FBTSxLQUFOLEVBQWE5RixJQUFiLEVBQW1CZ0gsRUFBbkI7QUFDQTtBQUNEQSxPQUFHOEYsSUFBSCxHQUFVLENBQVY7QUFDQSxXQUFPakYsR0FBUDtBQUNBLElBZEQ7QUFlQSxZQUFTN0gsSUFBVCxDQUFjZ0gsRUFBZCxFQUFpQjtBQUNoQjtBQUNBLFFBQUlSLEtBQUssSUFBVDtBQUFBLFFBQWV1RyxNQUFNdkcsR0FBR3RDLEVBQXhCO0FBQUEsUUFBNEI4SSxJQUE1QjtBQUNBLFFBQUcsQ0FBQ2hHLEdBQUdhLEdBQVAsRUFBVztBQUFFYixRQUFHYSxHQUFILEdBQVNrRixJQUFJbEYsR0FBYjtBQUFrQjtBQUMvQixRQUFHLENBQUNiLEdBQUcsR0FBSCxDQUFKLEVBQVk7QUFBRUEsUUFBRyxHQUFILElBQVVRLElBQUk5RixJQUFKLENBQVNLLE1BQVQsRUFBVjtBQUE2QixLQUozQixDQUk0QjtBQUM1QyxRQUFHZ0wsSUFBSUwsR0FBSixDQUFRbEUsS0FBUixDQUFjeEIsR0FBRyxHQUFILENBQWQsQ0FBSCxFQUEwQjtBQUFFO0FBQVE7QUFDcEMsUUFBR0EsR0FBRyxHQUFILENBQUgsRUFBVztBQUNWO0FBQ0EsU0FBRytGLElBQUkzRixHQUFKLENBQVFKLEdBQUcsR0FBSCxDQUFSLEVBQWlCQSxFQUFqQixDQUFILEVBQXdCO0FBQUU7QUFBUSxNQUZ4QixDQUV5QjtBQUNuQytGLFNBQUlMLEdBQUosQ0FBUVgsS0FBUixDQUFjL0UsR0FBRyxHQUFILENBQWQ7QUFDQVEsU0FBSTFCLEVBQUosQ0FBTyxLQUFQLEVBQWNtSCxPQUFPakcsRUFBUCxFQUFXLEVBQUNhLEtBQUtrRixJQUFJbEYsR0FBVixFQUFYLENBQWQ7QUFDQTtBQUNBO0FBQ0RrRixRQUFJTCxHQUFKLENBQVFYLEtBQVIsQ0FBYy9FLEdBQUcsR0FBSCxDQUFkO0FBQ0E7QUFDQTtBQUNBZ0csV0FBT0MsT0FBT2pHLEVBQVAsRUFBVyxFQUFDYSxLQUFLa0YsSUFBSWxGLEdBQVYsRUFBWCxDQUFQO0FBQ0EsUUFBR2IsR0FBR2tHLEdBQU4sRUFBVTtBQUNUO0FBQ0ExRixTQUFJMUIsRUFBSixDQUFPLEtBQVAsRUFBY2tILElBQWQ7QUFDQTtBQUNELFFBQUdoRyxHQUFHbEQsR0FBTixFQUFVO0FBQ1Q7QUFDQTBELFNBQUkxQixFQUFKLENBQU8sS0FBUCxFQUFja0gsSUFBZDtBQUNBO0FBQ0R4RixRQUFJMUIsRUFBSixDQUFPLEtBQVAsRUFBY2tILElBQWQ7QUFDQTtBQUNELEdBM0NDLEdBQUQ7O0FBNkNELEdBQUUsYUFBVTtBQUNYeEYsT0FBSTFCLEVBQUosQ0FBTyxLQUFQLEVBQWMsVUFBU2tCLEVBQVQsRUFBWTtBQUMxQjtBQUNDLFFBQUcsQ0FBQ0EsR0FBRyxHQUFILENBQUosRUFBWTtBQUFFLFlBQU8sS0FBS3hDLEVBQUwsQ0FBUWUsSUFBUixDQUFheUIsRUFBYixDQUFQO0FBQXlCLEtBRmQsQ0FFZTtBQUN4QyxRQUFJUixLQUFLLElBQVQ7QUFBQSxRQUFlUyxNQUFNLEVBQUNZLEtBQUtiLEdBQUdhLEdBQVQsRUFBY3lELE9BQU90RSxHQUFHYSxHQUFILENBQU9yRSxDQUFQLENBQVM4SCxLQUE5QixFQUFxQ3hILEtBQUssRUFBMUMsRUFBOEMzRyxLQUFLLEVBQW5ELEVBQXVEZ1EsU0FBUzNGLElBQUlPLEtBQUosRUFBaEUsRUFBckI7QUFDQSxRQUFHLENBQUNQLElBQUk4RCxLQUFKLENBQVVySyxFQUFWLENBQWErRixHQUFHbEQsR0FBaEIsRUFBcUIsSUFBckIsRUFBMkJzSixNQUEzQixFQUFtQ25HLEdBQW5DLENBQUosRUFBNEM7QUFBRUEsU0FBSWhMLEdBQUosR0FBVSx1QkFBVjtBQUFtQztBQUNqRixRQUFHZ0wsSUFBSWhMLEdBQVAsRUFBVztBQUFFLFlBQU9nTCxJQUFJWSxHQUFKLENBQVEvQixFQUFSLENBQVcsSUFBWCxFQUFpQixFQUFDLEtBQUtrQixHQUFHLEdBQUgsQ0FBTixFQUFlL0ssS0FBS3VMLElBQUl6SyxHQUFKLENBQVFrSyxJQUFJaEwsR0FBWixDQUFwQixFQUFqQixDQUFQO0FBQWlFO0FBQzlFd0gsWUFBUXdELElBQUluRCxHQUFaLEVBQWlCdUosS0FBakIsRUFBd0JwRyxHQUF4QjtBQUNBeEQsWUFBUXdELElBQUk5SixHQUFaLEVBQWlCQSxHQUFqQixFQUFzQjhKLEdBQXRCO0FBQ0EsUUFBRzlDLE1BQU04QyxJQUFJZ0MsS0FBYixFQUFtQjtBQUNsQnpCLFNBQUltRixRQUFKLENBQWExRixJQUFJZ0MsS0FBakIsRUFBd0IsWUFBVTtBQUNqQ3pCLFVBQUkxQixFQUFKLENBQU8sS0FBUCxFQUFja0IsRUFBZDtBQUNBLE1BRkQsRUFFR1EsSUFBSU8sS0FGUDtBQUdBO0FBQ0QsUUFBRyxDQUFDZCxJQUFJcUcsSUFBUixFQUFhO0FBQUU7QUFBUTtBQUN2QjlHLE9BQUdoQyxFQUFILENBQU1lLElBQU4sQ0FBVzBILE9BQU9qRyxFQUFQLEVBQVcsRUFBQ2xELEtBQUttRCxJQUFJcUcsSUFBVixFQUFYLENBQVg7QUFDQSxJQWZEO0FBZ0JBLFlBQVNGLE1BQVQsQ0FBZ0JyQyxHQUFoQixFQUFxQnBQLEdBQXJCLEVBQTBCdU8sSUFBMUIsRUFBZ0NwQyxJQUFoQyxFQUFxQztBQUFFLFFBQUliLE1BQU0sSUFBVjtBQUN0QyxRQUFJYyxRQUFRUCxJQUFJTyxLQUFKLENBQVU5RyxFQUFWLENBQWFpSixJQUFiLEVBQW1Cdk8sR0FBbkIsQ0FBWjtBQUFBLFFBQXFDa0wsR0FBckM7QUFDQSxRQUFHLENBQUNrQixLQUFKLEVBQVU7QUFBRSxZQUFPZCxJQUFJaEwsR0FBSixHQUFVLHlCQUF1Qk4sR0FBdkIsR0FBMkIsYUFBM0IsR0FBeUNtTSxJQUF6QyxHQUE4QyxJQUEvRDtBQUFxRTtBQUNqRixRQUFJeUYsU0FBU3RHLElBQUlxRSxLQUFKLENBQVV4RCxJQUFWLEtBQW1CbkQsS0FBaEM7QUFBQSxRQUF1QzZJLE1BQU1oRyxJQUFJTyxLQUFKLENBQVU5RyxFQUFWLENBQWFzTSxNQUFiLEVBQXFCNVIsR0FBckIsRUFBMEIsSUFBMUIsQ0FBN0M7QUFBQSxRQUE4RThSLFFBQVFGLE9BQU81UixHQUFQLENBQXRGO0FBQ0EsUUFBSWdOLE1BQU1uQixJQUFJbUIsR0FBSixDQUFRMUIsSUFBSWtHLE9BQVosRUFBcUJwRixLQUFyQixFQUE0QnlGLEdBQTVCLEVBQWlDekMsR0FBakMsRUFBc0MwQyxLQUF0QyxDQUFWO0FBQ0EsUUFBRyxDQUFDOUUsSUFBSVMsUUFBUixFQUFpQjtBQUNoQixTQUFHVCxJQUFJTSxLQUFQLEVBQWE7QUFBRTtBQUNkaEMsVUFBSWdDLEtBQUosR0FBYWxCLFNBQVNkLElBQUlnQyxLQUFKLElBQWF4SCxRQUF0QixDQUFELEdBQW1Dc0csS0FBbkMsR0FBMkNkLElBQUlnQyxLQUEzRDtBQUNBO0FBQ0Q7QUFDRGhDLFFBQUluRCxHQUFKLENBQVFnRSxJQUFSLElBQWdCTixJQUFJTyxLQUFKLENBQVV2RCxFQUFWLENBQWEwRixJQUFiLEVBQW1Cdk8sR0FBbkIsRUFBd0JzTCxJQUFJbkQsR0FBSixDQUFRZ0UsSUFBUixDQUF4QixDQUFoQjtBQUNBLEtBQUNiLElBQUlxRyxJQUFKLEtBQWFyRyxJQUFJcUcsSUFBSixHQUFXLEVBQXhCLENBQUQsRUFBOEJ4RixJQUE5QixJQUFzQ04sSUFBSU8sS0FBSixDQUFVdkQsRUFBVixDQUFhMEYsSUFBYixFQUFtQnZPLEdBQW5CLEVBQXdCc0wsSUFBSXFHLElBQUosQ0FBU3hGLElBQVQsQ0FBeEIsQ0FBdEM7QUFDQTtBQUNELFlBQVN1RixLQUFULENBQWVuRCxJQUFmLEVBQXFCcEMsSUFBckIsRUFBMEI7QUFDekIsUUFBSTRGLE1BQU0sQ0FBRSxLQUFLN0YsR0FBTCxDQUFTckUsQ0FBVixDQUFhK0IsSUFBYixJQUFxQlosS0FBdEIsRUFBNkJtRCxJQUE3QixDQUFWO0FBQ0EsUUFBRyxDQUFDNEYsR0FBSixFQUFRO0FBQUU7QUFBUTtBQUNsQixRQUFJMUcsS0FBSyxLQUFLN0osR0FBTCxDQUFTMkssSUFBVCxJQUFpQjtBQUN6QmhFLFVBQUssS0FBS29HLElBQUwsR0FBWUEsSUFEUTtBQUV6QmdELFVBQUssS0FBS3BGLElBQUwsR0FBWUEsSUFGUTtBQUd6QkQsVUFBSyxLQUFLNkYsR0FBTCxHQUFXQTtBQUhTLEtBQTFCO0FBS0FqSyxZQUFReUcsSUFBUixFQUFjekIsSUFBZCxFQUFvQixJQUFwQjtBQUNBakIsUUFBSTFCLEVBQUosQ0FBTyxNQUFQLEVBQWVrQixFQUFmO0FBQ0E7QUFDRCxZQUFTeUIsSUFBVCxDQUFjc0MsR0FBZCxFQUFtQnBQLEdBQW5CLEVBQXVCO0FBQ3RCLFFBQUkyUCxRQUFRLEtBQUtBLEtBQWpCO0FBQUEsUUFBd0J4RCxPQUFPLEtBQUtBLElBQXBDO0FBQUEsUUFBMENpRixNQUFPLEtBQUtXLEdBQUwsQ0FBU2xLLENBQTFEO0FBQUEsUUFBOERxRCxHQUE5RDtBQUNBeUUsVUFBTXhELElBQU4sSUFBY04sSUFBSU8sS0FBSixDQUFVdkQsRUFBVixDQUFhLEtBQUswRixJQUFsQixFQUF3QnZPLEdBQXhCLEVBQTZCMlAsTUFBTXhELElBQU4sQ0FBN0IsQ0FBZDtBQUNBLEtBQUNpRixJQUFJakosR0FBSixLQUFZaUosSUFBSWpKLEdBQUosR0FBVSxFQUF0QixDQUFELEVBQTRCbkksR0FBNUIsSUFBbUNvUCxHQUFuQztBQUNBO0FBQ0QsWUFBUzVOLEdBQVQsQ0FBYTZKLEVBQWIsRUFBaUJjLElBQWpCLEVBQXNCO0FBQ3JCLFFBQUcsQ0FBQ2QsR0FBR2EsR0FBUCxFQUFXO0FBQUU7QUFBUTtBQUNwQmIsT0FBR2EsR0FBSCxDQUFPckUsQ0FBUixDQUFXc0MsRUFBWCxDQUFjLElBQWQsRUFBb0JrQixFQUFwQjtBQUNBO0FBQ0QsR0FsREMsR0FBRDs7QUFvREQsR0FBRSxhQUFVO0FBQ1hRLE9BQUkxQixFQUFKLENBQU8sS0FBUCxFQUFjLFVBQVNrQixFQUFULEVBQVk7QUFDekIsUUFBSVIsS0FBSyxJQUFUO0FBQUEsUUFBZXNCLE9BQU9kLEdBQUdrRyxHQUFILENBQU9TLEtBQVAsQ0FBdEI7QUFBQSxRQUFxQ1osTUFBTS9GLEdBQUdhLEdBQUgsQ0FBT3JFLENBQWxEO0FBQUEsUUFBcUQwRyxPQUFPNkMsSUFBSXpCLEtBQUosQ0FBVXhELElBQVYsQ0FBNUQ7QUFBQSxRQUE2RThFLFFBQVE1RixHQUFHa0csR0FBSCxDQUFPVSxNQUFQLENBQXJGO0FBQUEsUUFBcUcvRyxHQUFyRztBQUNBLFFBQUl0QixPQUFPd0gsSUFBSXhILElBQUosS0FBYXdILElBQUl4SCxJQUFKLEdBQVcsRUFBeEIsQ0FBWDtBQUFBLFFBQXdDckIsS0FBTSxDQUFDcUIsS0FBS3VDLElBQUwsS0FBY25ELEtBQWYsRUFBc0JuQixDQUFwRTtBQUNBLFFBQUcsQ0FBQzBHLElBQUQsSUFBUyxDQUFDaEcsRUFBYixFQUFnQjtBQUFFLFlBQU9zQyxHQUFHaEMsRUFBSCxDQUFNZSxJQUFOLENBQVd5QixFQUFYLENBQVA7QUFBdUI7QUFDekMsUUFBRzRGLEtBQUgsRUFBUztBQUNSLFNBQUcsQ0FBQ3JJLFFBQVEyRixJQUFSLEVBQWMwQyxLQUFkLENBQUosRUFBeUI7QUFBRSxhQUFPcEcsR0FBR2hDLEVBQUgsQ0FBTWUsSUFBTixDQUFXeUIsRUFBWCxDQUFQO0FBQXVCO0FBQ2xEa0QsWUFBTzFDLElBQUlPLEtBQUosQ0FBVXZELEVBQVYsQ0FBYTBGLElBQWIsRUFBbUIwQyxLQUFuQixDQUFQO0FBQ0EsS0FIRCxNQUdPO0FBQ04xQyxZQUFPMUMsSUFBSS9FLEdBQUosQ0FBUWlDLElBQVIsQ0FBYXdGLElBQWIsQ0FBUDtBQUNBO0FBQ0Q7QUFDQ0EsV0FBTzFDLElBQUk4RCxLQUFKLENBQVVwQixJQUFWLENBQWVBLElBQWYsQ0FBUCxDQVh3QixDQVdLO0FBQzlCO0FBQ0E7QUFDQTtBQUNBckQsVUFBTTNDLEdBQUdrRCxHQUFUO0FBQ0EyRixRQUFJakgsRUFBSixDQUFPLElBQVAsRUFBYTtBQUNaLFVBQUtrQixHQUFHLEdBQUgsQ0FETztBQUVaNkcsVUFBSyxLQUZPO0FBR1ovSixVQUFLb0csSUFITztBQUlackMsVUFBSzNELEdBQUcyRDtBQUpJLEtBQWI7QUFNQSxRQUFHLElBQUloQixHQUFQLEVBQVc7QUFDVjtBQUNBO0FBQ0RMLE9BQUdoQyxFQUFILENBQU1lLElBQU4sQ0FBV3lCLEVBQVg7QUFDQSxJQTFCRDtBQTJCQSxHQTVCQyxHQUFEOztBQThCRCxHQUFFLGFBQVU7QUFDWFEsT0FBSTFCLEVBQUosQ0FBT29CLEdBQVAsR0FBYSxVQUFTUixFQUFULEVBQWF4QyxFQUFiLEVBQWdCO0FBQzVCLFFBQUcsQ0FBQyxLQUFLNEIsRUFBVCxFQUFZO0FBQUU7QUFBUTtBQUN0QixRQUFJSyxLQUFLcUIsSUFBSTlGLElBQUosQ0FBU0ssTUFBVCxFQUFUO0FBQ0EsUUFBRzJFLEVBQUgsRUFBTTtBQUFFLFVBQUtaLEVBQUwsQ0FBUUssRUFBUixFQUFZTyxFQUFaLEVBQWdCeEMsRUFBaEI7QUFBcUI7QUFDN0IsV0FBT2lDLEVBQVA7QUFDQSxJQUxEO0FBTUFxQixPQUFJMUIsRUFBSixDQUFPc0IsR0FBUCxHQUFhLFVBQVNKLEVBQVQsRUFBYUssS0FBYixFQUFtQjtBQUMvQixRQUFHLENBQUNMLEVBQUQsSUFBTyxDQUFDSyxLQUFSLElBQWlCLENBQUMsS0FBS3ZCLEVBQTFCLEVBQTZCO0FBQUU7QUFBUTtBQUN2QyxRQUFJSyxLQUFLYSxHQUFHLEdBQUgsS0FBV0EsRUFBcEI7QUFDQSxRQUFHLENBQUMsS0FBSzFCLEdBQU4sSUFBYSxDQUFDLEtBQUtBLEdBQUwsQ0FBU2EsRUFBVCxDQUFqQixFQUE4QjtBQUFFO0FBQVE7QUFDeEMsU0FBS0wsRUFBTCxDQUFRSyxFQUFSLEVBQVlrQixLQUFaO0FBQ0EsV0FBTyxJQUFQO0FBQ0EsSUFORDtBQU9BLEdBZEMsR0FBRDs7QUFnQkQsR0FBRSxhQUFVO0FBQ1hHLE9BQUlqQixLQUFKLENBQVVMLEdBQVYsR0FBZ0IsVUFBU0EsR0FBVCxFQUFhO0FBQzVCQSxVQUFNQSxPQUFPLEVBQWI7QUFDQSxRQUFJMkIsTUFBTSxJQUFWO0FBQUEsUUFBZ0JiLEtBQUthLElBQUlyRSxDQUF6QjtBQUFBLFFBQTRCcUQsTUFBTVgsSUFBSTRILEtBQUosSUFBYTVILEdBQS9DO0FBQ0EsUUFBRyxDQUFDOUIsT0FBTzhCLEdBQVAsQ0FBSixFQUFnQjtBQUFFQSxXQUFNLEVBQU47QUFBVTtBQUM1QixRQUFHLENBQUM5QixPQUFPNEMsR0FBR2QsR0FBVixDQUFKLEVBQW1CO0FBQUVjLFFBQUdkLEdBQUgsR0FBU0EsR0FBVDtBQUFjO0FBQ25DLFFBQUd1RCxRQUFRNUMsR0FBUixDQUFILEVBQWdCO0FBQUVBLFdBQU0sQ0FBQ0EsR0FBRCxDQUFOO0FBQWE7QUFDL0IsUUFBR3RGLFFBQVFzRixHQUFSLENBQUgsRUFBZ0I7QUFDZkEsV0FBTXBELFFBQVFvRCxHQUFSLEVBQWEsVUFBU2tILEdBQVQsRUFBYzFSLENBQWQsRUFBaUJjLEdBQWpCLEVBQXFCO0FBQ3ZDQSxVQUFJNFEsR0FBSixFQUFTLEVBQUNBLEtBQUtBLEdBQU4sRUFBVDtBQUNBLE1BRkssQ0FBTjtBQUdBLFNBQUcsQ0FBQzNKLE9BQU80QyxHQUFHZCxHQUFILENBQU80SCxLQUFkLENBQUosRUFBeUI7QUFBRTlHLFNBQUdkLEdBQUgsQ0FBTzRILEtBQVAsR0FBZSxFQUFmO0FBQWtCO0FBQzdDOUcsUUFBR2QsR0FBSCxDQUFPNEgsS0FBUCxHQUFlYixPQUFPcEcsR0FBUCxFQUFZRyxHQUFHZCxHQUFILENBQU80SCxLQUFuQixDQUFmO0FBQ0E7QUFDRDlHLE9BQUdkLEdBQUgsQ0FBTzhILEdBQVAsR0FBYWhILEdBQUdkLEdBQUgsQ0FBTzhILEdBQVAsSUFBYyxFQUFDQyxXQUFVLElBQVgsRUFBM0I7QUFDQWpILE9BQUdkLEdBQUgsQ0FBTzRILEtBQVAsR0FBZTlHLEdBQUdkLEdBQUgsQ0FBTzRILEtBQVAsSUFBZ0IsRUFBL0I7QUFDQWIsV0FBTy9HLEdBQVAsRUFBWWMsR0FBR2QsR0FBZixFQWY0QixDQWVQO0FBQ3JCc0IsUUFBSTFCLEVBQUosQ0FBTyxLQUFQLEVBQWNrQixFQUFkO0FBQ0EsV0FBT2EsR0FBUDtBQUNBLElBbEJEO0FBbUJBLEdBcEJDLEdBQUQ7O0FBc0JELE1BQUk0QixVQUFVakMsSUFBSTlGLElBQUosQ0FBU1QsRUFBdkI7QUFDQSxNQUFJTSxVQUFVaUcsSUFBSTVFLElBQUosQ0FBUzNCLEVBQXZCO0FBQ0EsTUFBSXdCLE1BQU0rRSxJQUFJL0UsR0FBZDtBQUFBLE1BQW1CMkIsU0FBUzNCLElBQUl4QixFQUFoQztBQUFBLE1BQW9Dc0QsVUFBVTlCLElBQUlDLEdBQWxEO0FBQUEsTUFBdUR1SyxTQUFTeEssSUFBSStCLEVBQXBFO0FBQUEsTUFBd0VmLFVBQVVoQixJQUFJdEYsR0FBdEY7QUFBQSxNQUEyRjZOLFdBQVd2SSxJQUFJaUMsSUFBMUc7QUFDQSxNQUFJaUosUUFBUW5HLElBQUloRSxDQUFKLENBQU1zRSxJQUFsQjtBQUFBLE1BQXdCOEYsU0FBU3BHLElBQUloRSxDQUFKLENBQU1vSixLQUF2QztBQUFBLE1BQThDc0IsU0FBUzFHLElBQUl1RCxHQUFKLENBQVFuQixHQUFSLENBQVkzSSxFQUFuRTtBQUNBLE1BQUkwRCxRQUFRLEVBQVo7QUFBQSxNQUFnQlIsQ0FBaEI7O0FBRUFySCxVQUFRcVIsS0FBUixHQUFnQixVQUFTOVIsQ0FBVCxFQUFZNkYsQ0FBWixFQUFjO0FBQUUsVUFBUXBGLFFBQVFxUixLQUFSLENBQWM5UixDQUFkLElBQW1CQSxNQUFNUyxRQUFRcVIsS0FBUixDQUFjOVIsQ0FBdkMsSUFBNENTLFFBQVFxUixLQUFSLENBQWM5UixDQUFkLEVBQTdDLEtBQW9FUyxRQUFRQyxHQUFSLENBQVk0SyxLQUFaLENBQWtCN0ssT0FBbEIsRUFBMkI4SCxTQUEzQixLQUF5QzFDLENBQTdHLENBQVA7QUFBd0gsR0FBeEo7O0FBRUFzRixNQUFJekssR0FBSixHQUFVLFlBQVU7QUFBRSxVQUFRLENBQUN5SyxJQUFJekssR0FBSixDQUFRMkksR0FBVCxJQUFnQjVJLFFBQVFDLEdBQVIsQ0FBWTRLLEtBQVosQ0FBa0I3SyxPQUFsQixFQUEyQjhILFNBQTNCLENBQWpCLEVBQXlELEdBQUd2RSxLQUFILENBQVN3RCxJQUFULENBQWNlLFNBQWQsRUFBeUIrRyxJQUF6QixDQUE4QixHQUE5QixDQUFoRTtBQUFvRyxHQUExSDtBQUNBbkUsTUFBSXpLLEdBQUosQ0FBUStQLElBQVIsR0FBZSxVQUFTc0IsQ0FBVCxFQUFXbE0sQ0FBWCxFQUFhSyxDQUFiLEVBQWU7QUFBRSxVQUFPLENBQUNBLElBQUlpRixJQUFJekssR0FBSixDQUFRK1AsSUFBYixFQUFtQnNCLENBQW5CLElBQXdCN0wsRUFBRTZMLENBQUYsS0FBUSxDQUFoQyxFQUFtQzdMLEVBQUU2TCxDQUFGLE9BQVU1RyxJQUFJekssR0FBSixDQUFRbUYsQ0FBUixDQUFwRDtBQUFnRSxHQUFoRyxDQUVDO0FBQ0RzRixNQUFJekssR0FBSixDQUFRK1AsSUFBUixDQUFhLFNBQWIsRUFBd0IsOEpBQXhCO0FBQ0EsR0FBQzs7QUFFRCxNQUFHLE9BQU83TSxNQUFQLEtBQWtCLFdBQXJCLEVBQWlDO0FBQUVBLFVBQU91SCxHQUFQLEdBQWFBLEdBQWI7QUFBa0I7QUFDckQsTUFBRyxPQUFPNUcsTUFBUCxLQUFrQixXQUFyQixFQUFpQztBQUFFQSxVQUFPSixPQUFQLEdBQWlCZ0gsR0FBakI7QUFBc0I7QUFDekQzRyxTQUFPTCxPQUFQLEdBQWlCZ0gsR0FBakI7QUFDQSxFQXpOQSxFQXlORXJILE9Bek5GLEVBeU5XLFFBek5YOztBQTJORCxFQUFDQSxRQUFRLFVBQVNVLE1BQVQsRUFBZ0I7QUFDeEIsTUFBSTJHLE1BQU1ySCxRQUFRLFFBQVIsQ0FBVjtBQUNBcUgsTUFBSWpCLEtBQUosQ0FBVVYsSUFBVixHQUFpQixVQUFTdkUsQ0FBVCxFQUFZNEUsR0FBWixFQUFnQjtBQUFFLE9BQUlXLEdBQUo7QUFDbEMsT0FBRyxDQUFDLENBQUQsS0FBT3ZGLENBQVAsSUFBWUcsYUFBYUgsQ0FBNUIsRUFBOEI7QUFDN0IsV0FBTyxLQUFLa0MsQ0FBTCxDQUFPeEQsSUFBZDtBQUNBLElBRkQsTUFHQSxJQUFHLE1BQU1zQixDQUFULEVBQVc7QUFDVixXQUFPLEtBQUtrQyxDQUFMLENBQU9xQyxJQUFQLElBQWUsSUFBdEI7QUFDQTtBQUNELE9BQUlnQyxNQUFNLElBQVY7QUFBQSxPQUFnQmIsS0FBS2EsSUFBSXJFLENBQXpCO0FBQ0EsT0FBRyxPQUFPbEMsQ0FBUCxLQUFhLFFBQWhCLEVBQXlCO0FBQ3hCQSxRQUFJQSxFQUFFYixLQUFGLENBQVEsR0FBUixDQUFKO0FBQ0E7QUFDRCxPQUFHYSxhQUFhMkIsS0FBaEIsRUFBc0I7QUFDckIsUUFBSTVHLElBQUksQ0FBUjtBQUFBLFFBQVcyRixJQUFJVixFQUFFaEYsTUFBakI7QUFBQSxRQUF5QnVLLE1BQU1HLEVBQS9CO0FBQ0EsU0FBSTNLLENBQUosRUFBT0EsSUFBSTJGLENBQVgsRUFBYzNGLEdBQWQsRUFBa0I7QUFDakJ3SyxXQUFNLENBQUNBLE9BQUtsQyxLQUFOLEVBQWFyRCxFQUFFakYsQ0FBRixDQUFiLENBQU47QUFDQTtBQUNELFFBQUc4SCxNQUFNMEMsR0FBVCxFQUFhO0FBQ1osWUFBT1gsTUFBSzJCLEdBQUwsR0FBV2hCLEdBQWxCO0FBQ0EsS0FGRCxNQUdBLElBQUlBLE1BQU1HLEdBQUduQixJQUFiLEVBQW1CO0FBQ2xCLFlBQU9nQixJQUFJaEIsSUFBSixDQUFTdkUsQ0FBVCxFQUFZNEUsR0FBWixDQUFQO0FBQ0E7QUFDRDtBQUNBO0FBQ0QsT0FBRzVFLGFBQWFrRSxRQUFoQixFQUF5QjtBQUN4QixRQUFJNkksR0FBSjtBQUFBLFFBQVN4SCxNQUFNLEVBQUNoQixNQUFNZ0MsR0FBUCxFQUFmO0FBQ0EsV0FBTSxDQUFDaEIsTUFBTUEsSUFBSWhCLElBQVgsTUFDRmdCLE1BQU1BLElBQUlyRCxDQURSLEtBRUgsRUFBRTZLLE1BQU0vTSxFQUFFdUYsR0FBRixFQUFPWCxHQUFQLENBQVIsQ0FGSCxFQUV3QixDQUFFO0FBQzFCLFdBQU9tSSxHQUFQO0FBQ0E7QUFDRCxHQS9CRDtBQWdDQSxNQUFJMUosUUFBUSxFQUFaO0FBQUEsTUFBZ0JSLENBQWhCO0FBQ0EsRUFuQ0EsRUFtQ0VoRSxPQW5DRixFQW1DVyxRQW5DWDs7QUFxQ0QsRUFBQ0EsUUFBUSxVQUFTVSxNQUFULEVBQWdCO0FBQ3hCLE1BQUkyRyxNQUFNckgsUUFBUSxRQUFSLENBQVY7QUFDQXFILE1BQUlqQixLQUFKLENBQVVBLEtBQVYsR0FBa0IsWUFBVTtBQUMzQixPQUFJUyxLQUFLLEtBQUt4RCxDQUFkO0FBQUEsT0FBaUIrQyxRQUFRLElBQUksS0FBSzNDLFdBQVQsQ0FBcUIsSUFBckIsQ0FBekI7QUFBQSxPQUFxRG1KLE1BQU14RyxNQUFNL0MsQ0FBakU7QUFDQXVKLE9BQUkvTSxJQUFKLEdBQVdBLE9BQU9nSCxHQUFHaEgsSUFBckI7QUFDQStNLE9BQUk1RyxFQUFKLEdBQVMsRUFBRW5HLEtBQUt3RCxDQUFMLENBQU9zSixJQUFsQjtBQUNBQyxPQUFJbEgsSUFBSixHQUFXLElBQVg7QUFDQWtILE9BQUlqSCxFQUFKLEdBQVMwQixJQUFJMUIsRUFBYjtBQUNBMEIsT0FBSTFCLEVBQUosQ0FBTyxPQUFQLEVBQWdCaUgsR0FBaEI7QUFDQUEsT0FBSWpILEVBQUosQ0FBTyxJQUFQLEVBQWEyQixLQUFiLEVBQW9Cc0YsR0FBcEIsRUFQMkIsQ0FPRDtBQUMxQkEsT0FBSWpILEVBQUosQ0FBTyxLQUFQLEVBQWN3SSxNQUFkLEVBQXNCdkIsR0FBdEIsRUFSMkIsQ0FRQztBQUM1QixVQUFPeEcsS0FBUDtBQUNBLEdBVkQ7QUFXQSxXQUFTK0gsTUFBVCxDQUFnQnRILEVBQWhCLEVBQW1CO0FBQ2xCLE9BQUkrRixNQUFNLEtBQUs3SSxFQUFmO0FBQUEsT0FBbUIyRCxNQUFNa0YsSUFBSWxGLEdBQTdCO0FBQUEsT0FBa0M3SCxPQUFPNkgsSUFBSWhDLElBQUosQ0FBUyxDQUFDLENBQVYsQ0FBekM7QUFBQSxPQUF1RC9CLEdBQXZEO0FBQUEsT0FBNERvSixHQUE1RDtBQUFBLE9BQWlFN0UsR0FBakU7QUFBQSxPQUFzRXhCLEdBQXRFO0FBQ0EsT0FBRyxDQUFDRyxHQUFHYSxHQUFQLEVBQVc7QUFDVmIsT0FBR2EsR0FBSCxHQUFTQSxHQUFUO0FBQ0E7QUFDRCxPQUFHcUYsTUFBTWxHLEdBQUdrRyxHQUFaLEVBQWdCO0FBQ2YsUUFBR3JHLE1BQU1xRyxJQUFJUyxLQUFKLENBQVQsRUFBb0I7QUFDbkI5RyxXQUFPN0csS0FBS2tOLEdBQUwsQ0FBU3JHLEdBQVQsRUFBY3JELENBQXJCO0FBQ0EsU0FBR2UsUUFBUTJJLEdBQVIsRUFBYVUsTUFBYixDQUFILEVBQXdCO0FBQ3ZCLFVBQUdySixRQUFRVCxNQUFNK0MsSUFBSS9DLEdBQWxCLEVBQXVCb0osTUFBTUEsSUFBSVUsTUFBSixDQUE3QixDQUFILEVBQTZDO0FBQzVDL0csV0FBSWYsRUFBSixDQUFPLElBQVAsRUFBYSxFQUFDb0gsS0FBS3JHLElBQUlxRyxHQUFWLEVBQWVwSixLQUFLMEQsSUFBSU8sS0FBSixDQUFVdkQsRUFBVixDQUFhVixHQUFiLEVBQWtCb0osR0FBbEIsQ0FBcEIsRUFBNENyRixLQUFLaEIsSUFBSWdCLEdBQXJELEVBQWIsRUFENEMsQ0FDNkI7QUFDekU7QUFDRCxNQUpELE1BS0EsSUFBR3RELFFBQVFzQyxHQUFSLEVBQWEsS0FBYixDQUFILEVBQXVCO0FBQ3ZCO0FBQ0NBLFVBQUlmLEVBQUosQ0FBTyxJQUFQLEVBQWFlLEdBQWI7QUFDQTtBQUNELEtBWEQsTUFXTztBQUNOLFNBQUd0QyxRQUFRMkksR0FBUixFQUFhVSxNQUFiLENBQUgsRUFBd0I7QUFDdkJWLFlBQU1BLElBQUlVLE1BQUosQ0FBTjtBQUNBLFVBQUlySSxPQUFPMkgsTUFBTXJGLElBQUlxRixHQUFKLENBQVFBLEdBQVIsRUFBYTFKLENBQW5CLEdBQXdCdUosR0FBbkM7QUFDQTtBQUNBO0FBQ0EsVUFBRzVJLE1BQU1vQixLQUFLekIsR0FBZCxFQUFrQjtBQUFFO0FBQ25CO0FBQ0F5QixZQUFLTyxFQUFMLENBQVEsSUFBUixFQUFjUCxJQUFkO0FBQ0E7QUFDQTtBQUNELFVBQUdoQixRQUFRd0ksR0FBUixFQUFhLEtBQWIsQ0FBSCxFQUF1QjtBQUN2QjtBQUNDLFdBQUloQyxNQUFNZ0MsSUFBSWpKLEdBQWQ7QUFBQSxXQUFtQjhGLEdBQW5CO0FBQ0EsV0FBR0EsTUFBTXBDLElBQUkwQyxJQUFKLENBQVNwQyxJQUFULENBQWNpRCxHQUFkLENBQVQsRUFBNEI7QUFDM0JBLGNBQU12RCxJQUFJdUQsR0FBSixDQUFRbkIsR0FBUixDQUFZaEksR0FBWixDQUFnQmdJLEdBQWhCLENBQU47QUFDQTtBQUNELFdBQUdBLE1BQU1wQyxJQUFJdUQsR0FBSixDQUFRbkIsR0FBUixDQUFZM0ksRUFBWixDQUFlOEosR0FBZixDQUFULEVBQTZCO0FBQzVCLFlBQUcsQ0FBQy9ELEdBQUdhLEdBQUgsQ0FBT3JFLENBQVgsRUFBYTtBQUFFO0FBQVE7QUFDdEJ3RCxXQUFHYSxHQUFILENBQU9yRSxDQUFSLENBQVdzQyxFQUFYLENBQWMsS0FBZCxFQUFxQjtBQUNwQm9ILGNBQUtyRyxNQUFNLEVBQUMsS0FBSytDLEdBQU4sRUFBVyxLQUFLc0QsR0FBaEIsRUFBcUJyRixLQUFLYixHQUFHYSxHQUE3QixFQURTO0FBRXBCLGNBQUs3SCxLQUFLd0QsQ0FBTCxDQUFPMEQsR0FBUCxDQUFXTSxJQUFJbUIsR0FBSixDQUFRNEYsS0FBbkIsRUFBMEIxSCxHQUExQixDQUZlO0FBR3BCZ0IsY0FBS2IsR0FBR2E7QUFIWSxTQUFyQjtBQUtBO0FBQ0E7QUFDRCxXQUFHMUQsTUFBTTRHLEdBQU4sSUFBYXZELElBQUl1RCxHQUFKLENBQVE5SixFQUFSLENBQVc4SixHQUFYLENBQWhCLEVBQWdDO0FBQy9CLFlBQUcsQ0FBQy9ELEdBQUdhLEdBQUgsQ0FBT3JFLENBQVgsRUFBYTtBQUFFO0FBQVE7QUFDdEJ3RCxXQUFHYSxHQUFILENBQU9yRSxDQUFSLENBQVdzQyxFQUFYLENBQWMsSUFBZCxFQUFvQjtBQUNuQm9ILGNBQUtBLEdBRGM7QUFFbkJyRixjQUFLYixHQUFHYTtBQUZXLFNBQXBCO0FBSUE7QUFDQTtBQUNELE9BdkJELE1Bd0JBLElBQUdrRixJQUFJNVAsR0FBUCxFQUFXO0FBQ1ZzRyxlQUFRc0osSUFBSTVQLEdBQVosRUFBaUIsVUFBU3FSLEtBQVQsRUFBZTtBQUMvQkEsY0FBTXhILEVBQU4sQ0FBU2xCLEVBQVQsQ0FBWSxJQUFaLEVBQWtCMEksTUFBTXhILEVBQXhCO0FBQ0EsUUFGRDtBQUdBO0FBQ0QsVUFBRytGLElBQUlqRixJQUFQLEVBQVk7QUFDWCxXQUFHLENBQUNkLEdBQUdhLEdBQUgsQ0FBT3JFLENBQVgsRUFBYTtBQUFFO0FBQVE7QUFDdEJ3RCxVQUFHYSxHQUFILENBQU9yRSxDQUFSLENBQVdzQyxFQUFYLENBQWMsS0FBZCxFQUFxQjtBQUNwQm9ILGFBQUtyRyxNQUFNLEVBQUMsS0FBS2tHLElBQUlqRixJQUFWLEVBQWdCLEtBQUtvRixHQUFyQixFQUEwQnJGLEtBQUtiLEdBQUdhLEdBQWxDLEVBRFM7QUFFcEIsYUFBSzdILEtBQUt3RCxDQUFMLENBQU8wRCxHQUFQLENBQVdNLElBQUltQixHQUFKLENBQVE0RixLQUFuQixFQUEwQjFILEdBQTFCLENBRmU7QUFHcEJnQixhQUFLYixHQUFHYTtBQUhZLFFBQXJCO0FBS0E7QUFDQTtBQUNELFVBQUdrRixJQUFJRyxHQUFQLEVBQVc7QUFDVixXQUFHLENBQUNILElBQUlsSCxJQUFKLENBQVNyQyxDQUFiLEVBQWU7QUFBRTtBQUFRO0FBQ3hCdUosV0FBSWxILElBQUosQ0FBU3JDLENBQVYsQ0FBYXNDLEVBQWIsQ0FBZ0IsS0FBaEIsRUFBdUI7QUFDdEJvSCxhQUFLcEQsUUFBUSxFQUFSLEVBQVk4RCxNQUFaLEVBQW9CYixJQUFJRyxHQUF4QixDQURpQjtBQUV0QnJGLGFBQUtBO0FBRmlCLFFBQXZCO0FBSUE7QUFDQTtBQUNEYixXQUFLaUcsT0FBT2pHLEVBQVAsRUFBVyxFQUFDa0csS0FBSyxFQUFOLEVBQVgsQ0FBTDtBQUNBLE1BekRELE1BeURPO0FBQ04sVUFBRzNJLFFBQVF3SSxHQUFSLEVBQWEsS0FBYixDQUFILEVBQXVCO0FBQ3ZCO0FBQ0NBLFdBQUlqSCxFQUFKLENBQU8sSUFBUCxFQUFhaUgsR0FBYjtBQUNBLE9BSEQsTUFJQSxJQUFHQSxJQUFJNVAsR0FBUCxFQUFXO0FBQ1ZzRyxlQUFRc0osSUFBSTVQLEdBQVosRUFBaUIsVUFBU3FSLEtBQVQsRUFBZTtBQUMvQkEsY0FBTXhILEVBQU4sQ0FBU2xCLEVBQVQsQ0FBWSxJQUFaLEVBQWtCMEksTUFBTXhILEVBQXhCO0FBQ0EsUUFGRDtBQUdBO0FBQ0QsVUFBRytGLElBQUkzRixHQUFQLEVBQVc7QUFDVixXQUFHLENBQUM3QyxRQUFRd0ksR0FBUixFQUFhLEtBQWIsQ0FBSixFQUF3QjtBQUFFO0FBQzFCO0FBQ0M7QUFDQTtBQUNEO0FBQ0RBLFVBQUkzRixHQUFKLEdBQVUsQ0FBQyxDQUFYO0FBQ0EsVUFBRzJGLElBQUlqRixJQUFQLEVBQVk7QUFDWGlGLFdBQUlqSCxFQUFKLENBQU8sS0FBUCxFQUFjO0FBQ2JvSCxhQUFLckcsTUFBTSxFQUFDLEtBQUtrRyxJQUFJakYsSUFBVixFQUFnQkQsS0FBS2tGLElBQUlsRixHQUF6QixFQURFO0FBRWIsYUFBSzdILEtBQUt3RCxDQUFMLENBQU8wRCxHQUFQLENBQVdNLElBQUltQixHQUFKLENBQVE0RixLQUFuQixFQUEwQjFILEdBQTFCLENBRlE7QUFHYmdCLGFBQUtrRixJQUFJbEY7QUFISSxRQUFkO0FBS0E7QUFDQTtBQUNELFVBQUdrRixJQUFJRyxHQUFQLEVBQVc7QUFDVixXQUFHLENBQUNILElBQUlsSCxJQUFKLENBQVNyQyxDQUFiLEVBQWU7QUFBRTtBQUFRO0FBQ3hCdUosV0FBSWxILElBQUosQ0FBU3JDLENBQVYsQ0FBYXNDLEVBQWIsQ0FBZ0IsS0FBaEIsRUFBdUI7QUFDdEJvSCxhQUFLcEQsUUFBUSxFQUFSLEVBQVk4RCxNQUFaLEVBQW9CYixJQUFJRyxHQUF4QixDQURpQjtBQUV0QnJGLGFBQUtrRixJQUFJbEY7QUFGYSxRQUF2QjtBQUlBO0FBQ0E7QUFDRDtBQUNEO0FBQ0Q7QUFDQWtGLE9BQUlsSCxJQUFKLENBQVNyQyxDQUFWLENBQWFzQyxFQUFiLENBQWdCLEtBQWhCLEVBQXVCa0IsRUFBdkI7QUFDQTtBQUNELFdBQVNTLEtBQVQsQ0FBZVQsRUFBZixFQUFrQjtBQUNqQkEsUUFBS0EsR0FBR3hELENBQUgsSUFBUXdELEVBQWI7QUFDQSxPQUFJUixLQUFLLElBQVQ7QUFBQSxPQUFldUcsTUFBTSxLQUFLN0ksRUFBMUI7QUFBQSxPQUE4QjJELE1BQU1iLEdBQUdhLEdBQXZDO0FBQUEsT0FBNENtRixPQUFPbkYsSUFBSXJFLENBQXZEO0FBQUEsT0FBMERpTCxTQUFTekgsR0FBR2xELEdBQXRFO0FBQUEsT0FBMkUrQixPQUFPa0gsSUFBSWxILElBQUosQ0FBU3JDLENBQVQsSUFBY21CLEtBQWhHO0FBQUEsT0FBdUdpRixHQUF2RztBQUFBLE9BQTRHL0MsR0FBNUc7QUFDQSxPQUFHLElBQUlrRyxJQUFJM0YsR0FBUixJQUFlLENBQUNKLEdBQUdJLEdBQW5CLElBQTBCLENBQUNJLElBQUl1RCxHQUFKLENBQVFuQixHQUFSLENBQVkzSSxFQUFaLENBQWV3TixNQUFmLENBQTlCLEVBQXFEO0FBQUU7QUFDdEQxQixRQUFJM0YsR0FBSixHQUFVLENBQVY7QUFDQTtBQUNELE9BQUcyRixJQUFJRyxHQUFKLElBQVdsRyxHQUFHa0csR0FBSCxLQUFXSCxJQUFJRyxHQUE3QixFQUFpQztBQUNoQ2xHLFNBQUtpRyxPQUFPakcsRUFBUCxFQUFXLEVBQUNrRyxLQUFLSCxJQUFJRyxHQUFWLEVBQVgsQ0FBTDtBQUNBO0FBQ0QsT0FBR0gsSUFBSUgsS0FBSixJQUFhSSxTQUFTRCxHQUF6QixFQUE2QjtBQUM1Qi9GLFNBQUtpRyxPQUFPakcsRUFBUCxFQUFXLEVBQUNhLEtBQUtrRixJQUFJbEYsR0FBVixFQUFYLENBQUw7QUFDQSxRQUFHbUYsS0FBSzVGLEdBQVIsRUFBWTtBQUNYMkYsU0FBSTNGLEdBQUosR0FBVTJGLElBQUkzRixHQUFKLElBQVc0RixLQUFLNUYsR0FBMUI7QUFDQTtBQUNEO0FBQ0QsT0FBR2pELE1BQU1zSyxNQUFULEVBQWdCO0FBQ2ZqSSxPQUFHaEMsRUFBSCxDQUFNZSxJQUFOLENBQVd5QixFQUFYO0FBQ0EsUUFBRytGLElBQUlqRixJQUFQLEVBQVk7QUFBRTtBQUFRO0FBQ3RCNEcsU0FBSzNCLEdBQUwsRUFBVS9GLEVBQVYsRUFBY1IsRUFBZDtBQUNBLFFBQUd1RyxJQUFJSCxLQUFQLEVBQWE7QUFDWitCLFNBQUk1QixHQUFKLEVBQVMvRixFQUFUO0FBQ0E7QUFDRG1ELFlBQVE2QyxLQUFLMEIsSUFBYixFQUFtQjNCLElBQUk1RyxFQUF2QjtBQUNBZ0UsWUFBUTRDLElBQUk1UCxHQUFaLEVBQWlCNlAsS0FBSzdHLEVBQXRCO0FBQ0E7QUFDQTtBQUNELE9BQUc0RyxJQUFJakYsSUFBUCxFQUFZO0FBQ1gsUUFBR2lGLElBQUkvTSxJQUFKLENBQVN3RCxDQUFULENBQVc2RSxHQUFkLEVBQWtCO0FBQUVyQixVQUFLaUcsT0FBT2pHLEVBQVAsRUFBVyxFQUFDbEQsS0FBSzJLLFNBQVN6QixLQUFLbEosR0FBcEIsRUFBWCxDQUFMO0FBQTJDLEtBRHBELENBQ3FEO0FBQ2hFMEMsT0FBR2hDLEVBQUgsQ0FBTWUsSUFBTixDQUFXeUIsRUFBWDtBQUNBMEgsU0FBSzNCLEdBQUwsRUFBVS9GLEVBQVYsRUFBY1IsRUFBZDtBQUNBL0MsWUFBUWdMLE1BQVIsRUFBZ0J0UixHQUFoQixFQUFxQixFQUFDNkosSUFBSUEsRUFBTCxFQUFTK0YsS0FBS0EsR0FBZCxFQUFyQjtBQUNBO0FBQ0E7QUFDRCxPQUFHLEVBQUVuRCxNQUFNcEMsSUFBSXVELEdBQUosQ0FBUW5CLEdBQVIsQ0FBWTNJLEVBQVosQ0FBZXdOLE1BQWYsQ0FBUixDQUFILEVBQW1DO0FBQ2xDLFFBQUdqSCxJQUFJdUQsR0FBSixDQUFROUosRUFBUixDQUFXd04sTUFBWCxDQUFILEVBQXNCO0FBQ3JCLFNBQUcxQixJQUFJSCxLQUFKLElBQWFHLElBQUlqRixJQUFwQixFQUF5QjtBQUN4QjZHLFVBQUk1QixHQUFKLEVBQVMvRixFQUFUO0FBQ0EsTUFGRCxNQUdBLElBQUdnRyxLQUFLSixLQUFMLElBQWNJLEtBQUtsRixJQUF0QixFQUEyQjtBQUMxQixPQUFDa0YsS0FBSzBCLElBQUwsS0FBYzFCLEtBQUswQixJQUFMLEdBQVksRUFBMUIsQ0FBRCxFQUFnQzNCLElBQUk1RyxFQUFwQyxJQUEwQzRHLEdBQTFDO0FBQ0EsT0FBQ0EsSUFBSTVQLEdBQUosS0FBWTRQLElBQUk1UCxHQUFKLEdBQVUsRUFBdEIsQ0FBRCxFQUE0QjZQLEtBQUs3RyxFQUFqQyxJQUF1QzRHLElBQUk1UCxHQUFKLENBQVE2UCxLQUFLN0csRUFBYixLQUFvQixFQUFDYSxJQUFJZ0csSUFBTCxFQUEzRDtBQUNBO0FBQ0E7QUFDRHhHLFFBQUdoQyxFQUFILENBQU1lLElBQU4sQ0FBV3lCLEVBQVg7QUFDQTBILFVBQUszQixHQUFMLEVBQVUvRixFQUFWLEVBQWNSLEVBQWQ7QUFDQTtBQUNBO0FBQ0QsUUFBR3VHLElBQUlILEtBQUosSUFBYUksU0FBU0QsR0FBdEIsSUFBNkJ4SSxRQUFReUksSUFBUixFQUFjLEtBQWQsQ0FBaEMsRUFBcUQ7QUFDcERELFNBQUlqSixHQUFKLEdBQVVrSixLQUFLbEosR0FBZjtBQUNBO0FBQ0QsUUFBRyxDQUFDOEYsTUFBTXBDLElBQUkwQyxJQUFKLENBQVNwQyxJQUFULENBQWMyRyxNQUFkLENBQVAsS0FBaUN6QixLQUFLSixLQUF6QyxFQUErQztBQUM5Q0ksVUFBS2xKLEdBQUwsR0FBWWlKLElBQUkvTSxJQUFKLENBQVNrTixHQUFULENBQWF0RCxHQUFiLEVBQWtCcEcsQ0FBbkIsQ0FBc0JNLEdBQWpDO0FBQ0E7QUFDRDBDLE9BQUdoQyxFQUFILENBQU1lLElBQU4sQ0FBV3lCLEVBQVg7QUFDQTBILFNBQUszQixHQUFMLEVBQVUvRixFQUFWLEVBQWNSLEVBQWQ7QUFDQW9JLFdBQU83QixHQUFQLEVBQVkvRixFQUFaLEVBQWdCZ0csSUFBaEIsRUFBc0JwRCxHQUF0QjtBQUNBbkcsWUFBUWdMLE1BQVIsRUFBZ0J0UixHQUFoQixFQUFxQixFQUFDNkosSUFBSUEsRUFBTCxFQUFTK0YsS0FBS0EsR0FBZCxFQUFyQjtBQUNBO0FBQ0E7QUFDRDZCLFVBQU83QixHQUFQLEVBQVkvRixFQUFaLEVBQWdCZ0csSUFBaEIsRUFBc0JwRCxHQUF0QjtBQUNBcEQsTUFBR2hDLEVBQUgsQ0FBTWUsSUFBTixDQUFXeUIsRUFBWDtBQUNBMEgsUUFBSzNCLEdBQUwsRUFBVS9GLEVBQVYsRUFBY1IsRUFBZDtBQUNBO0FBQ0RnQixNQUFJakIsS0FBSixDQUFVQSxLQUFWLENBQWdCa0IsS0FBaEIsR0FBd0JBLEtBQXhCO0FBQ0EsV0FBU21ILE1BQVQsQ0FBZ0I3QixHQUFoQixFQUFxQi9GLEVBQXJCLEVBQXlCZ0csSUFBekIsRUFBK0JwRCxHQUEvQixFQUFtQztBQUNsQyxPQUFHLENBQUNBLEdBQUQsSUFBUWlGLFVBQVU5QixJQUFJRyxHQUF6QixFQUE2QjtBQUFFO0FBQVE7QUFDdkMsT0FBSXJHLE1BQU9rRyxJQUFJL00sSUFBSixDQUFTa04sR0FBVCxDQUFhdEQsR0FBYixFQUFrQnBHLENBQTdCO0FBQ0EsT0FBR3VKLElBQUlILEtBQVAsRUFBYTtBQUNaSSxXQUFPbkcsR0FBUDtBQUNBLElBRkQsTUFHQSxJQUFHbUcsS0FBS0osS0FBUixFQUFjO0FBQ2JnQyxXQUFPNUIsSUFBUCxFQUFhaEcsRUFBYixFQUFpQmdHLElBQWpCLEVBQXVCcEQsR0FBdkI7QUFDQTtBQUNELE9BQUdvRCxTQUFTRCxHQUFaLEVBQWdCO0FBQUU7QUFBUTtBQUMxQixJQUFDQyxLQUFLMEIsSUFBTCxLQUFjMUIsS0FBSzBCLElBQUwsR0FBWSxFQUExQixDQUFELEVBQWdDM0IsSUFBSTVHLEVBQXBDLElBQTBDNEcsR0FBMUM7QUFDQSxPQUFHQSxJQUFJSCxLQUFKLElBQWEsQ0FBQyxDQUFDRyxJQUFJNVAsR0FBSixJQUFTd0gsS0FBVixFQUFpQnFJLEtBQUs3RyxFQUF0QixDQUFqQixFQUEyQztBQUMxQ3dJLFFBQUk1QixHQUFKLEVBQVMvRixFQUFUO0FBQ0E7QUFDREgsU0FBTSxDQUFDa0csSUFBSTVQLEdBQUosS0FBWTRQLElBQUk1UCxHQUFKLEdBQVUsRUFBdEIsQ0FBRCxFQUE0QjZQLEtBQUs3RyxFQUFqQyxJQUF1QzRHLElBQUk1UCxHQUFKLENBQVE2UCxLQUFLN0csRUFBYixLQUFvQixFQUFDYSxJQUFJZ0csSUFBTCxFQUFqRTtBQUNBLE9BQUdwRCxRQUFRL0MsSUFBSStDLEdBQWYsRUFBbUI7QUFBRTtBQUFRO0FBQzdCMUMsT0FBSTZGLEdBQUosRUFBU2xHLElBQUkrQyxHQUFKLEdBQVVBLEdBQW5CO0FBQ0E7QUFDRCxXQUFTOEUsSUFBVCxDQUFjM0IsR0FBZCxFQUFtQi9GLEVBQW5CLEVBQXVCUixFQUF2QixFQUEwQjtBQUN6QixPQUFHLENBQUN1RyxJQUFJMkIsSUFBUixFQUFhO0FBQUU7QUFBUSxJQURFLENBQ0Q7QUFDeEIsT0FBRzNCLElBQUlILEtBQVAsRUFBYTtBQUFFNUYsU0FBS2lHLE9BQU9qRyxFQUFQLEVBQVcsRUFBQ08sT0FBT2YsRUFBUixFQUFYLENBQUw7QUFBOEI7QUFDN0MvQyxXQUFRc0osSUFBSTJCLElBQVosRUFBa0JJLE1BQWxCLEVBQTBCOUgsRUFBMUI7QUFDQTtBQUNELFdBQVM4SCxNQUFULENBQWdCL0IsR0FBaEIsRUFBb0I7QUFDbkJBLE9BQUlqSCxFQUFKLENBQU8sSUFBUCxFQUFhLElBQWI7QUFDQTtBQUNELFdBQVMzSSxHQUFULENBQWFZLElBQWIsRUFBbUJwQyxHQUFuQixFQUF1QjtBQUFFO0FBQ3hCLE9BQUlvUixNQUFNLEtBQUtBLEdBQWY7QUFBQSxPQUFvQnhILE9BQU93SCxJQUFJeEgsSUFBSixJQUFZWixLQUF2QztBQUFBLE9BQThDb0ssTUFBTSxLQUFLL0gsRUFBekQ7QUFBQSxPQUE2RGEsR0FBN0Q7QUFBQSxPQUFrRXRCLEtBQWxFO0FBQUEsT0FBeUVTLEVBQXpFO0FBQUEsT0FBNkVILEdBQTdFO0FBQ0EsT0FBR2dJLFVBQVVsVCxHQUFWLElBQWlCLENBQUM0SixLQUFLNUosR0FBTCxDQUFyQixFQUErQjtBQUFFO0FBQVE7QUFDekMsT0FBRyxFQUFFa00sTUFBTXRDLEtBQUs1SixHQUFMLENBQVIsQ0FBSCxFQUFzQjtBQUNyQjtBQUNBO0FBQ0RxTCxRQUFNYSxJQUFJckUsQ0FBVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQUd3RCxHQUFHNEYsS0FBTixFQUFZO0FBQ1gsUUFBRyxFQUFFN08sUUFBUUEsS0FBSzRQLEtBQUwsQ0FBUixJQUF1Qm5HLElBQUl1RCxHQUFKLENBQVFuQixHQUFSLENBQVkzSSxFQUFaLENBQWVsRCxJQUFmLE1BQXlCeUosSUFBSTBDLElBQUosQ0FBU3BDLElBQVQsQ0FBY2QsR0FBR2xELEdBQWpCLENBQWxELENBQUgsRUFBNEU7QUFDM0VrRCxRQUFHbEQsR0FBSCxHQUFTL0YsSUFBVDtBQUNBO0FBQ0R3SSxZQUFRc0IsR0FBUjtBQUNBLElBTEQsTUFLTztBQUNOdEIsWUFBUXdJLElBQUlsSCxHQUFKLENBQVFxRixHQUFSLENBQVl2UixHQUFaLENBQVI7QUFDQTtBQUNEcUwsTUFBR2xCLEVBQUgsQ0FBTSxJQUFOLEVBQVk7QUFDWGhDLFNBQUsvRixJQURNO0FBRVhtUCxTQUFLdlIsR0FGTTtBQUdYa00sU0FBS3RCLEtBSE07QUFJWHdJLFNBQUtBO0FBSk0sSUFBWjtBQU1BO0FBQ0QsV0FBU0osR0FBVCxDQUFhNUIsR0FBYixFQUFrQi9GLEVBQWxCLEVBQXFCO0FBQ3BCLE9BQUcsRUFBRStGLElBQUlILEtBQUosSUFBYUcsSUFBSWpGLElBQW5CLENBQUgsRUFBNEI7QUFBRTtBQUFRO0FBQ3RDLE9BQUlqQixNQUFNa0csSUFBSTVQLEdBQWQ7QUFDQTRQLE9BQUk1UCxHQUFKLEdBQVUsSUFBVjtBQUNBLE9BQUcsU0FBUzBKLEdBQVosRUFBZ0I7QUFBRTtBQUFRO0FBQzFCLE9BQUcxQyxNQUFNMEMsR0FBTixJQUFha0csSUFBSWpKLEdBQUosS0FBWUssQ0FBNUIsRUFBOEI7QUFBRTtBQUFRLElBTHBCLENBS3FCO0FBQ3pDVixXQUFRb0QsR0FBUixFQUFhLFVBQVMySCxLQUFULEVBQWU7QUFDM0IsUUFBRyxFQUFFQSxRQUFRQSxNQUFNeEgsRUFBaEIsQ0FBSCxFQUF1QjtBQUFFO0FBQVE7QUFDakNtRCxZQUFRcUUsTUFBTUUsSUFBZCxFQUFvQjNCLElBQUk1RyxFQUF4QjtBQUNBLElBSEQ7QUFJQTFDLFdBQVFzSixJQUFJeEgsSUFBWixFQUFrQixVQUFTc0MsR0FBVCxFQUFjbE0sR0FBZCxFQUFrQjtBQUNuQyxRQUFJcVIsT0FBUW5GLElBQUlyRSxDQUFoQjtBQUNBd0osU0FBS2xKLEdBQUwsR0FBV0ssQ0FBWDtBQUNBLFFBQUc2SSxLQUFLNUYsR0FBUixFQUFZO0FBQ1g0RixVQUFLNUYsR0FBTCxHQUFXLENBQUMsQ0FBWjtBQUNBO0FBQ0Q0RixTQUFLbEgsRUFBTCxDQUFRLElBQVIsRUFBYztBQUNib0gsVUFBS3ZSLEdBRFE7QUFFYmtNLFVBQUtBLEdBRlE7QUFHYi9ELFVBQUtLO0FBSFEsS0FBZDtBQUtBLElBWEQ7QUFZQTtBQUNELFdBQVMrQyxHQUFULENBQWE2RixHQUFiLEVBQWtCakYsSUFBbEIsRUFBdUI7QUFDdEIsT0FBSWpCLE1BQU9rRyxJQUFJL00sSUFBSixDQUFTa04sR0FBVCxDQUFhcEYsSUFBYixFQUFtQnRFLENBQTlCO0FBQ0EsT0FBR3VKLElBQUkzRixHQUFQLEVBQVc7QUFDVlAsUUFBSU8sR0FBSixHQUFVUCxJQUFJTyxHQUFKLElBQVcsQ0FBQyxDQUF0QjtBQUNBUCxRQUFJZixFQUFKLENBQU8sS0FBUCxFQUFjO0FBQ2JvSCxVQUFLckcsTUFBTSxFQUFDLEtBQUtpQixJQUFOLEVBQVlELEtBQUtoQixJQUFJZ0IsR0FBckIsRUFERTtBQUViLFVBQUtrRixJQUFJL00sSUFBSixDQUFTd0QsQ0FBVCxDQUFXMEQsR0FBWCxDQUFlTSxJQUFJbUIsR0FBSixDQUFRNEYsS0FBdkIsRUFBOEIxSCxHQUE5QjtBQUZRLEtBQWQ7QUFJQTtBQUNBO0FBQ0RwRCxXQUFRc0osSUFBSXhILElBQVosRUFBa0IsVUFBU3NDLEdBQVQsRUFBY2xNLEdBQWQsRUFBa0I7QUFDbENrTSxRQUFJckUsQ0FBTCxDQUFRc0MsRUFBUixDQUFXLEtBQVgsRUFBa0I7QUFDakJvSCxVQUFLckYsTUFBTSxFQUFDLEtBQUtDLElBQU4sRUFBWSxLQUFLbk0sR0FBakIsRUFBc0JrTSxLQUFLQSxHQUEzQixFQURNO0FBRWpCLFVBQUtrRixJQUFJL00sSUFBSixDQUFTd0QsQ0FBVCxDQUFXMEQsR0FBWCxDQUFlTSxJQUFJbUIsR0FBSixDQUFRNEYsS0FBdkIsRUFBOEIxRyxHQUE5QjtBQUZZLEtBQWxCO0FBSUEsSUFMRDtBQU1BO0FBQ0QsTUFBSWxELFFBQVEsRUFBWjtBQUFBLE1BQWdCUixDQUFoQjtBQUNBLE1BQUkxQixNQUFNK0UsSUFBSS9FLEdBQWQ7QUFBQSxNQUFtQjhCLFVBQVU5QixJQUFJQyxHQUFqQztBQUFBLE1BQXNDb0gsVUFBVXJILElBQUlxQixHQUFwRDtBQUFBLE1BQXlEcUcsVUFBVTFILElBQUl3QixHQUF2RTtBQUFBLE1BQTRFZ0osU0FBU3hLLElBQUkrQixFQUF6RjtBQUFBLE1BQTZGZixVQUFVaEIsSUFBSXRGLEdBQTNHO0FBQ0EsTUFBSXdRLFFBQVFuRyxJQUFJaEUsQ0FBSixDQUFNc0UsSUFBbEI7QUFBQSxNQUF3QjhGLFNBQVNwRyxJQUFJaEUsQ0FBSixDQUFNb0osS0FBdkM7QUFBQSxNQUE4Q2lDLFFBQVFySCxJQUFJMEMsSUFBSixDQUFTMUcsQ0FBL0Q7QUFDQSxFQTVSQSxFQTRSRXJELE9BNVJGLEVBNFJXLFNBNVJYOztBQThSRCxFQUFDQSxRQUFRLFVBQVNVLE1BQVQsRUFBZ0I7QUFDeEIsTUFBSTJHLE1BQU1ySCxRQUFRLFFBQVIsQ0FBVjtBQUNBcUgsTUFBSWpCLEtBQUosQ0FBVTJHLEdBQVYsR0FBZ0IsVUFBU3ZSLEdBQVQsRUFBYytLLEVBQWQsRUFBa0J4QyxFQUFsQixFQUFxQjtBQUNwQyxPQUFHLE9BQU92SSxHQUFQLEtBQWUsUUFBbEIsRUFBMkI7QUFDMUIsUUFBSWtNLEdBQUo7QUFBQSxRQUFTaEMsT0FBTyxJQUFoQjtBQUFBLFFBQXNCa0gsTUFBTWxILEtBQUtyQyxDQUFqQztBQUNBLFFBQUkrQixPQUFPd0gsSUFBSXhILElBQUosSUFBWVosS0FBdkI7QUFBQSxRQUE4QmtDLEdBQTlCO0FBQ0EsUUFBRyxFQUFFZ0IsTUFBTXRDLEtBQUs1SixHQUFMLENBQVIsQ0FBSCxFQUFzQjtBQUNyQmtNLFdBQU1pRSxNQUFNblEsR0FBTixFQUFXa0ssSUFBWCxDQUFOO0FBQ0E7QUFDRCxJQU5ELE1BT0EsSUFBR2xLLGVBQWU2SixRQUFsQixFQUEyQjtBQUMxQixRQUFJcUMsTUFBTSxJQUFWO0FBQUEsUUFBZ0JiLEtBQUthLElBQUlyRSxDQUF6QjtBQUNBVSxTQUFLd0MsTUFBTSxFQUFYO0FBQ0F4QyxPQUFHOEssR0FBSCxHQUFTclQsR0FBVDtBQUNBdUksT0FBRytLLEdBQUgsR0FBUy9LLEdBQUcrSyxHQUFILElBQVUsRUFBQ0MsS0FBSyxDQUFOLEVBQW5CO0FBQ0FoTCxPQUFHK0ssR0FBSCxDQUFPL0IsR0FBUCxHQUFhaEosR0FBRytLLEdBQUgsQ0FBTy9CLEdBQVAsSUFBYyxFQUEzQjtBQUNBLFdBQU9sRyxHQUFHa0csR0FBVixLQUFtQmxHLEdBQUdoSCxJQUFILENBQVF3RCxDQUFULENBQVk2RSxHQUFaLEdBQWtCLElBQXBDLEVBTjBCLENBTWlCO0FBQzNDckIsT0FBR2xCLEVBQUgsQ0FBTSxJQUFOLEVBQVlrSixHQUFaLEVBQWlCOUssRUFBakI7QUFDQThDLE9BQUdsQixFQUFILENBQU0sS0FBTixFQUFhNUIsR0FBRytLLEdBQWhCO0FBQ0NqSSxPQUFHaEgsSUFBSCxDQUFRd0QsQ0FBVCxDQUFZNkUsR0FBWixHQUFrQixLQUFsQjtBQUNBLFdBQU9SLEdBQVA7QUFDQSxJQVhELE1BWUEsSUFBRzhCLE9BQU9oTyxHQUFQLENBQUgsRUFBZTtBQUNkLFdBQU8sS0FBS3VSLEdBQUwsQ0FBUyxLQUFHdlIsR0FBWixFQUFpQitLLEVBQWpCLEVBQXFCeEMsRUFBckIsQ0FBUDtBQUNBLElBRkQsTUFFTztBQUNOLEtBQUNBLEtBQUssS0FBS3FDLEtBQUwsRUFBTixFQUFvQi9DLENBQXBCLENBQXNCdkgsR0FBdEIsR0FBNEIsRUFBQ0EsS0FBS3VMLElBQUl6SyxHQUFKLENBQVEsc0JBQVIsRUFBZ0NwQixHQUFoQyxDQUFOLEVBQTVCLENBRE0sQ0FDbUU7QUFDekUsUUFBRytLLEVBQUgsRUFBTTtBQUFFQSxRQUFHN0MsSUFBSCxDQUFRSyxFQUFSLEVBQVlBLEdBQUdWLENBQUgsQ0FBS3ZILEdBQWpCO0FBQXVCO0FBQy9CLFdBQU9pSSxFQUFQO0FBQ0E7QUFDRCxPQUFHMkMsTUFBTWtHLElBQUl6RyxJQUFiLEVBQWtCO0FBQUU7QUFDbkJ1QixRQUFJckUsQ0FBSixDQUFNOEMsSUFBTixHQUFhdUIsSUFBSXJFLENBQUosQ0FBTThDLElBQU4sSUFBY08sR0FBM0I7QUFDQTtBQUNELE9BQUdILE1BQU1BLGNBQWNsQixRQUF2QixFQUFnQztBQUMvQnFDLFFBQUlxRixHQUFKLENBQVF4RyxFQUFSLEVBQVl4QyxFQUFaO0FBQ0E7QUFDRCxVQUFPMkQsR0FBUDtBQUNBLEdBbENEO0FBbUNBLFdBQVNpRSxLQUFULENBQWVuUSxHQUFmLEVBQW9Ca0ssSUFBcEIsRUFBeUI7QUFDeEIsT0FBSWtILE1BQU1sSCxLQUFLckMsQ0FBZjtBQUFBLE9BQWtCK0IsT0FBT3dILElBQUl4SCxJQUE3QjtBQUFBLE9BQW1Dc0MsTUFBTWhDLEtBQUtVLEtBQUwsRUFBekM7QUFBQSxPQUF1RFMsS0FBS2EsSUFBSXJFLENBQWhFO0FBQ0EsT0FBRyxDQUFDK0IsSUFBSixFQUFTO0FBQUVBLFdBQU93SCxJQUFJeEgsSUFBSixHQUFXLEVBQWxCO0FBQXNCO0FBQ2pDQSxRQUFLeUIsR0FBR2tHLEdBQUgsR0FBU3ZSLEdBQWQsSUFBcUJrTSxHQUFyQjtBQUNBLE9BQUdrRixJQUFJL00sSUFBSixLQUFhNkYsSUFBaEIsRUFBcUI7QUFBRW1CLE9BQUdjLElBQUgsR0FBVW5NLEdBQVY7QUFBZSxJQUF0QyxNQUNLLElBQUdvUixJQUFJakYsSUFBSixJQUFZaUYsSUFBSUgsS0FBbkIsRUFBeUI7QUFBRTVGLE9BQUc0RixLQUFILEdBQVdqUixHQUFYO0FBQWdCO0FBQ2hELFVBQU9rTSxHQUFQO0FBQ0E7QUFDRCxXQUFTbUgsR0FBVCxDQUFhaEksRUFBYixFQUFnQjtBQUNmLE9BQUlSLEtBQUssSUFBVDtBQUFBLE9BQWV0QyxLQUFLc0MsR0FBR3RDLEVBQXZCO0FBQUEsT0FBMkIyRCxNQUFNYixHQUFHYSxHQUFwQztBQUFBLE9BQXlDa0YsTUFBTWxGLElBQUlyRSxDQUFuRDtBQUFBLE9BQXNEekYsT0FBT2lKLEdBQUdsRCxHQUFoRTtBQUFBLE9BQXFFK0MsR0FBckU7QUFDQSxPQUFHMUMsTUFBTXBHLElBQVQsRUFBYztBQUNiQSxXQUFPZ1AsSUFBSWpKLEdBQVg7QUFDQTtBQUNELE9BQUcsQ0FBQytDLE1BQU05SSxJQUFQLEtBQWdCOEksSUFBSStDLElBQUlwRyxDQUFSLENBQWhCLEtBQStCcUQsTUFBTStDLElBQUkzSSxFQUFKLENBQU80RixHQUFQLENBQXJDLENBQUgsRUFBcUQ7QUFDcERBLFVBQU9rRyxJQUFJL00sSUFBSixDQUFTa04sR0FBVCxDQUFhckcsR0FBYixFQUFrQnJELENBQXpCO0FBQ0EsUUFBR1csTUFBTTBDLElBQUkvQyxHQUFiLEVBQWlCO0FBQ2hCa0QsVUFBS2lHLE9BQU9qRyxFQUFQLEVBQVcsRUFBQ2xELEtBQUsrQyxJQUFJL0MsR0FBVixFQUFYLENBQUw7QUFDQTtBQUNEO0FBQ0RJLE1BQUc4SyxHQUFILENBQU9oSSxFQUFQLEVBQVdBLEdBQUdPLEtBQUgsSUFBWWYsRUFBdkI7QUFDQUEsTUFBR2hDLEVBQUgsQ0FBTWUsSUFBTixDQUFXeUIsRUFBWDtBQUNBO0FBQ0QsTUFBSXZFLE1BQU0rRSxJQUFJL0UsR0FBZDtBQUFBLE1BQW1COEIsVUFBVTlCLElBQUlDLEdBQWpDO0FBQUEsTUFBc0N1SyxTQUFTekYsSUFBSS9FLEdBQUosQ0FBUStCLEVBQXZEO0FBQ0EsTUFBSW1GLFNBQVNuQyxJQUFJbkcsR0FBSixDQUFRSixFQUFyQjtBQUNBLE1BQUkySSxNQUFNcEMsSUFBSXVELEdBQUosQ0FBUW5CLEdBQWxCO0FBQUEsTUFBdUJpRixRQUFRckgsSUFBSTBDLElBQUosQ0FBUzFHLENBQXhDO0FBQ0EsTUFBSW1CLFFBQVEsRUFBWjtBQUFBLE1BQWdCUixDQUFoQjtBQUNBLEVBL0RBLEVBK0RFaEUsT0EvREYsRUErRFcsT0EvRFg7O0FBaUVELEVBQUNBLFFBQVEsVUFBU1UsTUFBVCxFQUFnQjtBQUN4QixNQUFJMkcsTUFBTXJILFFBQVEsUUFBUixDQUFWO0FBQ0FxSCxNQUFJakIsS0FBSixDQUFVekMsR0FBVixHQUFnQixVQUFTL0YsSUFBVCxFQUFlMkksRUFBZixFQUFtQnhDLEVBQW5CLEVBQXNCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBLE9BQUkyRCxNQUFNLElBQVY7QUFBQSxPQUFnQmIsS0FBTWEsSUFBSXJFLENBQTFCO0FBQUEsT0FBOEJ4RCxPQUFPZ0gsR0FBR2hILElBQXhDO0FBQUEsT0FBOEM2RyxHQUE5QztBQUNBM0MsUUFBS0EsTUFBTSxFQUFYO0FBQ0FBLE1BQUduRyxJQUFILEdBQVVBLElBQVY7QUFDQW1HLE1BQUcyRCxHQUFILEdBQVMzRCxHQUFHMkQsR0FBSCxJQUFVQSxHQUFuQjtBQUNBLE9BQUcsT0FBT25CLEVBQVAsS0FBYyxRQUFqQixFQUEwQjtBQUN6QnhDLE9BQUc0RCxJQUFILEdBQVVwQixFQUFWO0FBQ0EsSUFGRCxNQUVPO0FBQ054QyxPQUFHa0QsR0FBSCxHQUFTVixFQUFUO0FBQ0E7QUFDRCxPQUFHTSxHQUFHYyxJQUFOLEVBQVc7QUFDVjVELE9BQUc0RCxJQUFILEdBQVVkLEdBQUdjLElBQWI7QUFDQTtBQUNELE9BQUc1RCxHQUFHNEQsSUFBSCxJQUFXOUgsU0FBUzZILEdBQXZCLEVBQTJCO0FBQzFCLFFBQUcsQ0FBQ3pELE9BQU9GLEdBQUduRyxJQUFWLENBQUosRUFBb0I7QUFDbkIsTUFBQ21HLEdBQUdrRCxHQUFILElBQVErSCxJQUFULEVBQWV0TCxJQUFmLENBQW9CSyxFQUFwQixFQUF3QkEsR0FBRytLLEdBQUgsR0FBUyxFQUFDaFQsS0FBS3VMLElBQUl6SyxHQUFKLENBQVEsNkVBQVIsVUFBK0ZtSCxHQUFHbkcsSUFBbEcsR0FBeUcsU0FBU21HLEdBQUduRyxJQUFaLEdBQW1CLElBQTVILENBQU4sRUFBakM7QUFDQSxTQUFHbUcsR0FBR3lDLEdBQU4sRUFBVTtBQUFFekMsU0FBR3lDLEdBQUg7QUFBVTtBQUN0QixZQUFPa0IsR0FBUDtBQUNBO0FBQ0QzRCxPQUFHMkQsR0FBSCxHQUFTQSxNQUFNN0gsS0FBS2tOLEdBQUwsQ0FBU2hKLEdBQUc0RCxJQUFILEdBQVU1RCxHQUFHNEQsSUFBSCxLQUFZNUQsR0FBR3lLLEdBQUgsR0FBU25ILElBQUkwQyxJQUFKLENBQVNwQyxJQUFULENBQWM1RCxHQUFHbkcsSUFBakIsS0FBMEIsQ0FBRWlDLEtBQUt3RCxDQUFOLENBQVMwQyxHQUFULENBQWFHLElBQWIsSUFBcUJtQixJQUFJOUYsSUFBSixDQUFTSyxNQUEvQixHQUEvQyxDQUFuQixDQUFmO0FBQ0FtQyxPQUFHd0osR0FBSCxHQUFTeEosR0FBRzJELEdBQVo7QUFDQWpHLFFBQUlzQyxFQUFKO0FBQ0EsV0FBTzJELEdBQVA7QUFDQTtBQUNELE9BQUdMLElBQUl2RyxFQUFKLENBQU9sRCxJQUFQLENBQUgsRUFBZ0I7QUFDZkEsU0FBS21QLEdBQUwsQ0FBUyxVQUFTbEcsRUFBVCxFQUFZUixFQUFaLEVBQWU7QUFBQ0EsUUFBR2QsR0FBSDtBQUN4QixTQUFJeEQsSUFBSXNGLElBQUkwQyxJQUFKLENBQVNwQyxJQUFULENBQWNkLEdBQUdsRCxHQUFqQixDQUFSO0FBQ0EsU0FBRyxDQUFDNUIsQ0FBSixFQUFNO0FBQUNzRixVQUFJekssR0FBSixDQUFRLG1DQUFSLFVBQW9EaUssR0FBR2xELEdBQXZELEdBQTRELE1BQUtJLEdBQUdKLEdBQVIsR0FBYSx5QkFBekUsRUFBb0c7QUFBTztBQUNsSCtELFNBQUkvRCxHQUFKLENBQVEwRCxJQUFJdUQsR0FBSixDQUFRbkIsR0FBUixDQUFZaEksR0FBWixDQUFnQk0sQ0FBaEIsQ0FBUixFQUE0QndFLEVBQTVCLEVBQWdDeEMsRUFBaEM7QUFDQSxLQUpEO0FBS0EsV0FBTzJELEdBQVA7QUFDQTtBQUNEM0QsTUFBR3dKLEdBQUgsR0FBU3hKLEdBQUd3SixHQUFILElBQVcxTixVQUFVNkcsTUFBTUcsR0FBR25CLElBQW5CLENBQVgsR0FBc0NnQyxHQUF0QyxHQUE0Q2hCLEdBQXJEO0FBQ0EsT0FBRzNDLEdBQUd3SixHQUFILENBQU9sSyxDQUFQLENBQVNzRSxJQUFULElBQWlCTixJQUFJdUQsR0FBSixDQUFROUosRUFBUixDQUFXaUQsR0FBR25HLElBQWQsQ0FBakIsSUFBd0NpSixHQUFHa0csR0FBOUMsRUFBa0Q7QUFDakRoSixPQUFHbkcsSUFBSCxHQUFVK0wsUUFBUSxFQUFSLEVBQVk5QyxHQUFHa0csR0FBZixFQUFvQmhKLEdBQUduRyxJQUF2QixDQUFWO0FBQ0FtRyxPQUFHd0osR0FBSCxDQUFPNUosR0FBUCxDQUFXSSxHQUFHbkcsSUFBZCxFQUFvQm1HLEdBQUc0RCxJQUF2QixFQUE2QjVELEVBQTdCO0FBQ0EsV0FBTzJELEdBQVA7QUFDQTtBQUNEM0QsTUFBR3dKLEdBQUgsQ0FBT1IsR0FBUCxDQUFXLEdBQVgsRUFBZ0JBLEdBQWhCLENBQW9Ca0MsR0FBcEIsRUFBeUIsRUFBQ2xMLElBQUlBLEVBQUwsRUFBekI7QUFDQSxPQUFHLENBQUNBLEdBQUcrSyxHQUFQLEVBQVc7QUFDVjtBQUNBL0ssT0FBR3lDLEdBQUgsR0FBU3pDLEdBQUd5QyxHQUFILElBQVVhLElBQUkxQixFQUFKLENBQU9RLElBQVAsQ0FBWXBDLEdBQUd3SixHQUFmLENBQW5CO0FBQ0F4SixPQUFHMkQsR0FBSCxDQUFPckUsQ0FBUCxDQUFTOEMsSUFBVCxHQUFnQnBDLEdBQUd3SixHQUFILENBQU9sSyxDQUFQLENBQVM4QyxJQUF6QjtBQUNBO0FBQ0QsVUFBT3VCLEdBQVA7QUFDQSxHQWhERDs7QUFrREEsV0FBU2pHLEdBQVQsQ0FBYXNDLEVBQWIsRUFBZ0I7QUFDZkEsTUFBR21MLEtBQUgsR0FBV0EsS0FBWDtBQUNBLE9BQUluSixNQUFNaEMsR0FBR2dDLEdBQUgsSUFBUSxFQUFsQjtBQUFBLE9BQXNCbUYsTUFBTW5ILEdBQUdtSCxHQUFILEdBQVM3RCxJQUFJTyxLQUFKLENBQVU1SyxHQUFWLENBQWNBLEdBQWQsRUFBbUIrSSxJQUFJNkIsS0FBdkIsQ0FBckM7QUFDQXNELE9BQUl2RCxJQUFKLEdBQVc1RCxHQUFHNEQsSUFBZDtBQUNBNUQsTUFBR29ILEtBQUgsR0FBVzlELElBQUk4RCxLQUFKLENBQVUxSixHQUFWLENBQWNzQyxHQUFHbkcsSUFBakIsRUFBdUJzTixHQUF2QixFQUE0Qm5ILEVBQTVCLENBQVg7QUFDQSxPQUFHbUgsSUFBSXBQLEdBQVAsRUFBVztBQUNWLEtBQUNpSSxHQUFHa0QsR0FBSCxJQUFRK0gsSUFBVCxFQUFldEwsSUFBZixDQUFvQkssRUFBcEIsRUFBd0JBLEdBQUcrSyxHQUFILEdBQVMsRUFBQ2hULEtBQUt1TCxJQUFJekssR0FBSixDQUFRc08sSUFBSXBQLEdBQVosQ0FBTixFQUFqQztBQUNBLFFBQUdpSSxHQUFHeUMsR0FBTixFQUFVO0FBQUV6QyxRQUFHeUMsR0FBSDtBQUFVO0FBQ3RCO0FBQ0E7QUFDRHpDLE1BQUdtTCxLQUFIO0FBQ0E7O0FBRUQsV0FBU0EsS0FBVCxHQUFnQjtBQUFFLE9BQUluTCxLQUFLLElBQVQ7QUFDakIsT0FBRyxDQUFDQSxHQUFHb0gsS0FBSixJQUFhN0gsUUFBUVMsR0FBR29DLElBQVgsRUFBaUJnSixFQUFqQixDQUFoQixFQUFxQztBQUFFO0FBQVE7QUFDL0MsSUFBQ3BMLEdBQUd5QyxHQUFILElBQVE0SSxJQUFULEVBQWUsWUFBVTtBQUN2QnJMLE9BQUd3SixHQUFILENBQU9sSyxDQUFSLENBQVdzQyxFQUFYLENBQWMsS0FBZCxFQUFxQjtBQUNwQm9KLFVBQUssQ0FEZTtBQUVwQnJILFVBQUszRCxHQUFHd0osR0FGWSxFQUVQNUosS0FBS0ksR0FBRytLLEdBQUgsR0FBUy9LLEdBQUdtSCxHQUFILENBQU9DLEtBRmQsRUFFcUJwRixLQUFLaEMsR0FBR2dDLEdBRjdCO0FBR3BCLFVBQUtoQyxHQUFHMkQsR0FBSCxDQUFPaEMsSUFBUCxDQUFZLENBQUMsQ0FBYixFQUFnQnJDLENBQWhCLENBQWtCMEQsR0FBbEIsQ0FBc0IsVUFBU0UsR0FBVCxFQUFhO0FBQUUsV0FBSzFCLEdBQUwsR0FBRixDQUFjO0FBQ3JELFVBQUcsQ0FBQ3hCLEdBQUdrRCxHQUFQLEVBQVc7QUFBRTtBQUFRO0FBQ3JCbEQsU0FBR2tELEdBQUgsQ0FBT0EsR0FBUCxFQUFZLElBQVo7QUFDQSxNQUhJLEVBR0ZsRCxHQUFHZ0MsR0FIRDtBQUhlLEtBQXJCO0FBUUEsSUFURCxFQVNHaEMsRUFUSDtBQVVBLE9BQUdBLEdBQUd5QyxHQUFOLEVBQVU7QUFBRXpDLE9BQUd5QyxHQUFIO0FBQVU7QUFDdEIsR0FBQyxTQUFTMkksRUFBVCxDQUFZdkwsQ0FBWixFQUFjZixDQUFkLEVBQWdCO0FBQUUsT0FBR2UsQ0FBSCxFQUFLO0FBQUUsV0FBTyxJQUFQO0FBQWE7QUFBRTs7QUFFMUMsV0FBUzVHLEdBQVQsQ0FBYTRHLENBQWIsRUFBZWYsQ0FBZixFQUFpQjFCLENBQWpCLEVBQW9CMEYsRUFBcEIsRUFBdUI7QUFBRSxPQUFJOUMsS0FBSyxJQUFUO0FBQ3hCLE9BQUdsQixLQUFLLENBQUNnRSxHQUFHekcsSUFBSCxDQUFRakUsTUFBakIsRUFBd0I7QUFBRTtBQUFRO0FBQ2xDLElBQUM0SCxHQUFHeUMsR0FBSCxJQUFRNEksSUFBVCxFQUFlLFlBQVU7QUFDeEIsUUFBSWhQLE9BQU95RyxHQUFHekcsSUFBZDtBQUFBLFFBQW9CbU4sTUFBTXhKLEdBQUd3SixHQUE3QjtBQUFBLFFBQWtDeEgsTUFBTWhDLEdBQUdnQyxHQUEzQztBQUNBLFFBQUk3SixJQUFJLENBQVI7QUFBQSxRQUFXMkYsSUFBSXpCLEtBQUtqRSxNQUFwQjtBQUNBLFNBQUlELENBQUosRUFBT0EsSUFBSTJGLENBQVgsRUFBYzNGLEdBQWQsRUFBa0I7QUFDakJxUixXQUFNQSxJQUFJUixHQUFKLENBQVEzTSxLQUFLbEUsQ0FBTCxDQUFSLENBQU47QUFDQTtBQUNELFFBQUc2SCxHQUFHeUssR0FBSCxJQUFVbkgsSUFBSTBDLElBQUosQ0FBU3BDLElBQVQsQ0FBY2QsR0FBR3ZFLEdBQWpCLENBQWIsRUFBbUM7QUFDbEMsU0FBSTBELEtBQUtxQixJQUFJMEMsSUFBSixDQUFTcEMsSUFBVCxDQUFjZCxHQUFHdkUsR0FBakIsS0FBeUIsQ0FBQyxDQUFDeUIsR0FBR2dDLEdBQUgsSUFBUSxFQUFULEVBQWFHLElBQWIsSUFBcUJuQyxHQUFHMkQsR0FBSCxDQUFPaEMsSUFBUCxDQUFZLFVBQVosQ0FBckIsSUFBZ0QyQixJQUFJOUYsSUFBSixDQUFTSyxNQUExRCxHQUFsQztBQUNBMkwsU0FBSTdILElBQUosQ0FBUyxDQUFDLENBQVYsRUFBYXFILEdBQWIsQ0FBaUIvRyxFQUFqQjtBQUNBYSxRQUFHYyxJQUFILENBQVEzQixFQUFSO0FBQ0E7QUFDQTtBQUNELEtBQUNqQyxHQUFHb0MsSUFBSCxHQUFVcEMsR0FBR29DLElBQUgsSUFBVyxFQUF0QixFQUEwQi9GLElBQTFCLElBQWtDLElBQWxDO0FBQ0FtTixRQUFJUixHQUFKLENBQVEsR0FBUixFQUFhQSxHQUFiLENBQWlCcEYsSUFBakIsRUFBdUIsRUFBQzVELElBQUksRUFBQzhDLElBQUlBLEVBQUwsRUFBUzlDLElBQUlBLEVBQWIsRUFBTCxFQUF2QjtBQUNBLElBZEQsRUFjRyxFQUFDQSxJQUFJQSxFQUFMLEVBQVM4QyxJQUFJQSxFQUFiLEVBZEg7QUFlQTs7QUFFRCxXQUFTYyxJQUFULENBQWNkLEVBQWQsRUFBa0JSLEVBQWxCLEVBQXFCO0FBQUUsT0FBSXRDLEtBQUssS0FBS0EsRUFBZDtBQUFBLE9BQWtCNkksTUFBTTdJLEdBQUc4QyxFQUEzQixDQUErQjlDLEtBQUtBLEdBQUdBLEVBQVI7QUFDckQ7QUFDQSxPQUFHLENBQUM4QyxHQUFHYSxHQUFKLElBQVcsQ0FBQ2IsR0FBR2EsR0FBSCxDQUFPckUsQ0FBUCxDQUFTcUMsSUFBeEIsRUFBNkI7QUFBRTtBQUFRLElBRm5CLENBRW9CO0FBQ3hDVyxNQUFHZCxHQUFIO0FBQ0FzQixRQUFNQSxHQUFHYSxHQUFILENBQU9yRSxDQUFQLENBQVNxQyxJQUFULENBQWNyQyxDQUFwQjtBQUNBLE9BQUkyQyxLQUFLcUIsSUFBSTBDLElBQUosQ0FBU3BDLElBQVQsQ0FBY2lGLElBQUl0SyxHQUFsQixLQUEwQitFLElBQUkwQyxJQUFKLENBQVNwQyxJQUFULENBQWNkLEdBQUdsRCxHQUFqQixDQUExQixJQUFtRDBELElBQUl1RCxHQUFKLENBQVFuQixHQUFSLENBQVkzSSxFQUFaLENBQWUrRixHQUFHbEQsR0FBbEIsQ0FBbkQsSUFBNkUsQ0FBQyxDQUFDSSxHQUFHZ0MsR0FBSCxJQUFRLEVBQVQsRUFBYUcsSUFBYixJQUFxQm5DLEdBQUcyRCxHQUFILENBQU9oQyxJQUFQLENBQVksVUFBWixDQUFyQixJQUFnRDJCLElBQUk5RixJQUFKLENBQVNLLE1BQTFELEdBQXRGLENBTG9CLENBS3VJO0FBQzNKaUYsTUFBR2EsR0FBSCxDQUFPaEMsSUFBUCxDQUFZLENBQUMsQ0FBYixFQUFnQnFILEdBQWhCLENBQW9CL0csRUFBcEI7QUFDQTRHLE9BQUlqRixJQUFKLENBQVMzQixFQUFUO0FBQ0FqQyxNQUFHb0MsSUFBSCxDQUFReUcsSUFBSXhNLElBQVosSUFBb0IsS0FBcEI7QUFDQTJELE1BQUdtTCxLQUFIO0FBQ0E7O0FBRUQsV0FBU0QsR0FBVCxDQUFhcEksRUFBYixFQUFpQlIsRUFBakIsRUFBb0I7QUFDbkIsT0FBSXRDLEtBQUssS0FBS0EsRUFBZDtBQUNBLE9BQUcsQ0FBQzhDLEdBQUdhLEdBQUosSUFBVyxDQUFDYixHQUFHYSxHQUFILENBQU9yRSxDQUF0QixFQUF3QjtBQUFFO0FBQVEsSUFGZixDQUVnQjtBQUNuQyxPQUFHd0QsR0FBRy9LLEdBQU4sRUFBVTtBQUFFO0FBQ1hhLFlBQVFDLEdBQVIsQ0FBWSw2Q0FBWjtBQUNBO0FBQ0E7QUFDRCxPQUFJZ1EsTUFBTy9GLEdBQUdhLEdBQUgsQ0FBT3JFLENBQVAsQ0FBU3FDLElBQVQsQ0FBY3JDLENBQXpCO0FBQUEsT0FBNkJ6RixPQUFPZ1AsSUFBSWpKLEdBQXhDO0FBQUEsT0FBNkNvQyxNQUFNaEMsR0FBR2dDLEdBQUgsSUFBUSxFQUEzRDtBQUFBLE9BQStEbEcsSUFBL0Q7QUFBQSxPQUFxRTZHLEdBQXJFO0FBQ0FMLE1BQUdkLEdBQUg7QUFDQSxPQUFHeEIsR0FBR3dKLEdBQUgsS0FBV3hKLEdBQUcyRCxHQUFqQixFQUFxQjtBQUNwQmhCLFVBQU8zQyxHQUFHMkQsR0FBSCxDQUFPckUsQ0FBUixDQUFXMEosR0FBWCxJQUFrQkgsSUFBSUcsR0FBNUI7QUFDQSxRQUFHLENBQUNyRyxHQUFKLEVBQVE7QUFBRTtBQUNUL0osYUFBUUMsR0FBUixDQUFZLDRDQUFaLEVBRE8sQ0FDb0Q7QUFDM0Q7QUFDQTtBQUNEbUgsT0FBR25HLElBQUgsR0FBVStMLFFBQVEsRUFBUixFQUFZakQsR0FBWixFQUFpQjNDLEdBQUduRyxJQUFwQixDQUFWO0FBQ0E4SSxVQUFNLElBQU47QUFDQTtBQUNELE9BQUcxQyxNQUFNcEcsSUFBVCxFQUFjO0FBQ2IsUUFBRyxDQUFDZ1AsSUFBSUcsR0FBUixFQUFZO0FBQUU7QUFBUSxLQURULENBQ1U7QUFDdkIsUUFBRyxDQUFDSCxJQUFJakYsSUFBUixFQUFhO0FBQ1pqQixXQUFNa0csSUFBSWxGLEdBQUosQ0FBUWhDLElBQVIsQ0FBYSxVQUFTbUIsRUFBVCxFQUFZO0FBQzlCLFVBQUdBLEdBQUdjLElBQU4sRUFBVztBQUFFLGNBQU9kLEdBQUdjLElBQVY7QUFBZ0I7QUFDN0I1RCxTQUFHbkcsSUFBSCxHQUFVK0wsUUFBUSxFQUFSLEVBQVk5QyxHQUFHa0csR0FBZixFQUFvQmhKLEdBQUduRyxJQUF2QixDQUFWO0FBQ0EsTUFISyxDQUFOO0FBSUE7QUFDRDhJLFVBQU1BLE9BQU9rRyxJQUFJRyxHQUFqQjtBQUNBSCxVQUFPQSxJQUFJL00sSUFBSixDQUFTa04sR0FBVCxDQUFhckcsR0FBYixFQUFrQnJELENBQXpCO0FBQ0FVLE9BQUd5SyxHQUFILEdBQVN6SyxHQUFHNEQsSUFBSCxHQUFVakIsR0FBbkI7QUFDQTlJLFdBQU9tRyxHQUFHbkcsSUFBVjtBQUNBO0FBQ0QsT0FBRyxDQUFDbUcsR0FBR3lLLEdBQUosSUFBVyxFQUFFekssR0FBRzRELElBQUgsR0FBVU4sSUFBSTBDLElBQUosQ0FBU3BDLElBQVQsQ0FBYy9KLElBQWQsQ0FBWixDQUFkLEVBQStDO0FBQzlDLFFBQUdtRyxHQUFHM0QsSUFBSCxJQUFXNkQsT0FBT0YsR0FBR25HLElBQVYsQ0FBZCxFQUE4QjtBQUFFO0FBQy9CbUcsUUFBRzRELElBQUgsR0FBVSxDQUFDNUIsSUFBSUcsSUFBSixJQUFZMEcsSUFBSS9NLElBQUosQ0FBU3dELENBQVQsQ0FBVzBDLEdBQVgsQ0FBZUcsSUFBM0IsSUFBbUNtQixJQUFJOUYsSUFBSixDQUFTSyxNQUE3QyxHQUFWO0FBQ0EsS0FGRCxNQUVPO0FBQ047QUFDQW1DLFFBQUc0RCxJQUFILEdBQVVkLEdBQUdjLElBQUgsSUFBV2lGLElBQUlqRixJQUFmLElBQXVCLENBQUM1QixJQUFJRyxJQUFKLElBQVkwRyxJQUFJL00sSUFBSixDQUFTd0QsQ0FBVCxDQUFXMEMsR0FBWCxDQUFlRyxJQUEzQixJQUFtQ21CLElBQUk5RixJQUFKLENBQVNLLE1BQTdDLEdBQWpDO0FBQ0E7QUFDRDtBQUNEbUMsTUFBR3dKLEdBQUgsQ0FBTzVKLEdBQVAsQ0FBV0ksR0FBR25HLElBQWQsRUFBb0JtRyxHQUFHNEQsSUFBdkIsRUFBNkI1RCxFQUE3QjtBQUNBO0FBQ0QsTUFBSXpCLE1BQU0rRSxJQUFJL0UsR0FBZDtBQUFBLE1BQW1CMkIsU0FBUzNCLElBQUl4QixFQUFoQztBQUFBLE1BQW9DNkksVUFBVXJILElBQUlxQixHQUFsRDtBQUFBLE1BQXVETCxVQUFVaEIsSUFBSXRGLEdBQXJFO0FBQ0EsTUFBSWdILENBQUo7QUFBQSxNQUFPUSxRQUFRLEVBQWY7QUFBQSxNQUFtQndLLE9BQU8sU0FBUEEsSUFBTyxHQUFVLENBQUUsQ0FBdEM7QUFBQSxNQUF3Q0ksT0FBTyxTQUFQQSxJQUFPLENBQVN2TyxFQUFULEVBQVlrRCxFQUFaLEVBQWU7QUFBQ2xELE1BQUc2QyxJQUFILENBQVFLLE1BQUlTLEtBQVo7QUFBbUIsR0FBbEY7QUFDQSxFQTFKQSxFQTBKRXhFLE9BMUpGLEVBMEpXLE9BMUpYOztBQTRKRCxFQUFDQSxRQUFRLFVBQVNVLE1BQVQsRUFBZ0I7O0FBRXhCLE1BQUkyRyxNQUFNckgsUUFBUSxRQUFSLENBQVY7QUFDQVUsU0FBT0wsT0FBUCxHQUFpQmdILEdBQWpCOztBQUVBLEdBQUUsYUFBVTtBQUNYLFlBQVNnSSxJQUFULENBQWN6TCxDQUFkLEVBQWdCZixDQUFoQixFQUFrQjtBQUNqQixRQUFHdUIsUUFBUWlELElBQUlpSSxFQUFKLENBQU9qTSxDQUFmLEVBQWtCUixDQUFsQixDQUFILEVBQXdCO0FBQUU7QUFBUTtBQUNsQzhHLFlBQVEsS0FBS3RHLENBQWIsRUFBZ0JSLENBQWhCLEVBQW1CZSxDQUFuQjtBQUNBO0FBQ0QsWUFBUzVHLEdBQVQsQ0FBYTBQLEtBQWIsRUFBb0JELEtBQXBCLEVBQTBCO0FBQ3pCLFFBQUdwRixJQUFJaEUsQ0FBSixDQUFNMEcsSUFBTixLQUFlMEMsS0FBbEIsRUFBd0I7QUFBRTtBQUFRO0FBQ2xDLFFBQUkxQyxPQUFPLEtBQUtBLElBQWhCO0FBQUEsUUFBc0JxRCxTQUFTLEtBQUtBLE1BQXBDO0FBQUEsUUFBNENtQyxRQUFRLEtBQUtBLEtBQXpEO0FBQUEsUUFBZ0V2QyxVQUFVLEtBQUtBLE9BQS9FO0FBQ0EsUUFBSWxNLEtBQUswTyxTQUFTekYsSUFBVCxFQUFlMEMsS0FBZixDQUFUO0FBQUEsUUFBZ0NnRCxLQUFLRCxTQUFTcEMsTUFBVCxFQUFpQlgsS0FBakIsQ0FBckM7QUFDQSxRQUFHekksTUFBTWxELEVBQU4sSUFBWWtELE1BQU15TCxFQUFyQixFQUF3QjtBQUFFLFlBQU8sSUFBUDtBQUFhLEtBSmQsQ0FJZTtBQUN4QyxRQUFJQyxLQUFLaEQsS0FBVDtBQUFBLFFBQWdCaUQsS0FBS3ZDLE9BQU9YLEtBQVAsQ0FBckI7O0FBU0E7OztBQVNBLFFBQUcsQ0FBQ21ELE9BQU9GLEVBQVAsQ0FBRCxJQUFlMUwsTUFBTTBMLEVBQXhCLEVBQTJCO0FBQUUsWUFBTyxJQUFQO0FBQWEsS0F2QmpCLENBdUJrQjtBQUMzQyxRQUFHLENBQUNFLE9BQU9ELEVBQVAsQ0FBRCxJQUFlM0wsTUFBTTJMLEVBQXhCLEVBQTJCO0FBQUUsWUFBTyxJQUFQO0FBQWEsS0F4QmpCLENBd0JtQjtBQUM1QyxRQUFJbkgsTUFBTW5CLElBQUltQixHQUFKLENBQVF3RSxPQUFSLEVBQWlCbE0sRUFBakIsRUFBcUIyTyxFQUFyQixFQUF5QkMsRUFBekIsRUFBNkJDLEVBQTdCLENBQVY7QUFDQSxRQUFHbkgsSUFBSTFNLEdBQVAsRUFBVztBQUNWYSxhQUFRQyxHQUFSLENBQVksc0NBQVosRUFBb0Q2UCxLQUFwRCxFQUEyRGpFLElBQUkxTSxHQUEvRCxFQURVLENBQzJEO0FBQ3JFO0FBQ0E7QUFDRCxRQUFHME0sSUFBSVosS0FBSixJQUFhWSxJQUFJTyxVQUFqQixJQUErQlAsSUFBSVcsT0FBdEMsRUFBOEM7QUFBRTtBQUMvQztBQUNBO0FBQ0E7QUFDRCxRQUFHWCxJQUFJUyxRQUFQLEVBQWdCO0FBQ2ZzRyxXQUFNOUMsS0FBTixJQUFlQyxLQUFmO0FBQ0FtRCxlQUFVTixLQUFWLEVBQWlCOUMsS0FBakIsRUFBd0IzTCxFQUF4QjtBQUNBO0FBQ0E7QUFDRCxRQUFHMEgsSUFBSU0sS0FBUCxFQUFhO0FBQUU7QUFDZHlHLFdBQU05QyxLQUFOLElBQWVDLEtBQWYsQ0FEWSxDQUNVO0FBQ3RCbUQsZUFBVU4sS0FBVixFQUFpQjlDLEtBQWpCLEVBQXdCM0wsRUFBeEIsRUFGWSxDQUVpQjtBQUM3QjtBQUNBO0FBQ0E7Ozs7OztBQU1BO0FBQ0Q7QUFDRHVHLE9BQUltQixHQUFKLENBQVErRyxLQUFSLEdBQWdCLFVBQVNuQyxNQUFULEVBQWlCckQsSUFBakIsRUFBdUJoRSxHQUF2QixFQUEyQjtBQUMxQyxRQUFHLENBQUNnRSxJQUFELElBQVMsQ0FBQ0EsS0FBSzFHLENBQWxCLEVBQW9CO0FBQUU7QUFBUTtBQUM5QitKLGFBQVNBLFVBQVUvRixJQUFJMEMsSUFBSixDQUFTcEMsSUFBVCxDQUFjbEcsR0FBZCxDQUFrQixFQUFDNEIsR0FBRSxFQUFDLEtBQUksRUFBTCxFQUFILEVBQWxCLEVBQWdDZ0UsSUFBSTBDLElBQUosQ0FBU3BDLElBQVQsQ0FBY29DLElBQWQsQ0FBaEMsQ0FBbkI7QUFDQSxRQUFHLENBQUNxRCxNQUFELElBQVcsQ0FBQ0EsT0FBTy9KLENBQXRCLEVBQXdCO0FBQUU7QUFBUTtBQUNsQzBDLFVBQU15RCxPQUFPekQsR0FBUCxJQUFhLEVBQUNpSCxTQUFTakgsR0FBVixFQUFiLEdBQThCLEVBQUNpSCxTQUFTM0YsSUFBSU8sS0FBSixFQUFWLEVBQXBDO0FBQ0E3QixRQUFJd0osS0FBSixHQUFZbkMsVUFBVS9GLElBQUkvRSxHQUFKLENBQVFpQyxJQUFSLENBQWE2SSxNQUFiLENBQXRCLENBTDBDLENBS0U7QUFDNUM7QUFDQXJILFFBQUlxSCxNQUFKLEdBQWFBLE1BQWI7QUFDQXJILFFBQUlnRSxJQUFKLEdBQVdBLElBQVg7QUFDQTtBQUNBLFFBQUd6RyxRQUFReUcsSUFBUixFQUFjL00sR0FBZCxFQUFtQitJLEdBQW5CLENBQUgsRUFBMkI7QUFBRTtBQUM1QjtBQUNBO0FBQ0QsV0FBT0EsSUFBSXdKLEtBQVg7QUFDQSxJQWREO0FBZUFsSSxPQUFJbUIsR0FBSixDQUFRc0gsS0FBUixHQUFnQixVQUFTMUMsTUFBVCxFQUFpQnJELElBQWpCLEVBQXVCaEUsR0FBdkIsRUFBMkI7QUFDMUNBLFVBQU15RCxPQUFPekQsR0FBUCxJQUFhLEVBQUNpSCxTQUFTakgsR0FBVixFQUFiLEdBQThCLEVBQUNpSCxTQUFTM0YsSUFBSU8sS0FBSixFQUFWLEVBQXBDO0FBQ0EsUUFBRyxDQUFDd0YsTUFBSixFQUFXO0FBQUUsWUFBTy9GLElBQUkvRSxHQUFKLENBQVFpQyxJQUFSLENBQWF3RixJQUFiLENBQVA7QUFBMkI7QUFDeENoRSxRQUFJNEIsSUFBSixHQUFXTixJQUFJMEMsSUFBSixDQUFTcEMsSUFBVCxDQUFjNUIsSUFBSXFILE1BQUosR0FBYUEsTUFBM0IsQ0FBWDtBQUNBLFFBQUcsQ0FBQ3JILElBQUk0QixJQUFSLEVBQWE7QUFBRTtBQUFRO0FBQ3ZCNUIsUUFBSStKLEtBQUosR0FBWXpJLElBQUkwQyxJQUFKLENBQVNwQyxJQUFULENBQWNsRyxHQUFkLENBQWtCLEVBQWxCLEVBQXNCc0UsSUFBSTRCLElBQTFCLENBQVo7QUFDQXJFLFlBQVF5QyxJQUFJZ0UsSUFBSixHQUFXQSxJQUFuQixFQUF5Qm9ELElBQXpCLEVBQStCcEgsR0FBL0I7QUFDQSxXQUFPQSxJQUFJK0osS0FBWDtBQUNBLElBUkQ7QUFTQSxZQUFTM0MsSUFBVCxDQUFjVCxLQUFkLEVBQXFCRCxLQUFyQixFQUEyQjtBQUFFLFFBQUkxRyxNQUFNLElBQVY7QUFDNUIsUUFBR3NCLElBQUloRSxDQUFKLENBQU0wRyxJQUFOLEtBQWUwQyxLQUFsQixFQUF3QjtBQUFFO0FBQVE7QUFDbEMsUUFBRyxDQUFDbUQsT0FBT2xELEtBQVAsQ0FBSixFQUFrQjtBQUFFO0FBQVE7QUFDNUIsUUFBSTNDLE9BQU9oRSxJQUFJZ0UsSUFBZjtBQUFBLFFBQXFCcUQsU0FBU3JILElBQUlxSCxNQUFsQztBQUFBLFFBQTBDdE0sS0FBSzBPLFNBQVN6RixJQUFULEVBQWUwQyxLQUFmLEVBQXNCLElBQXRCLENBQS9DO0FBQUEsUUFBNEVnRCxLQUFLRCxTQUFTcEMsTUFBVCxFQUFpQlgsS0FBakIsRUFBd0IsSUFBeEIsQ0FBakY7QUFBQSxRQUFnSHFELFFBQVEvSixJQUFJK0osS0FBNUg7QUFDQSxRQUFJdEgsTUFBTW5CLElBQUltQixHQUFKLENBQVF6QyxJQUFJaUgsT0FBWixFQUFxQmxNLEVBQXJCLEVBQXlCMk8sRUFBekIsRUFBNkIvQyxLQUE3QixFQUFvQ1UsT0FBT1gsS0FBUCxDQUFwQyxDQUFWOztBQUlBOzs7QUFJQSxRQUFHakUsSUFBSVMsUUFBUCxFQUFnQjtBQUNmNkcsV0FBTXJELEtBQU4sSUFBZUMsS0FBZjtBQUNBbUQsZUFBVUMsS0FBVixFQUFpQnJELEtBQWpCLEVBQXdCM0wsRUFBeEI7QUFDQTtBQUNEO0FBQ0R1RyxPQUFJbUIsR0FBSixDQUFRNEYsS0FBUixHQUFnQixVQUFTdkgsRUFBVCxFQUFhUixFQUFiLEVBQWdCO0FBQy9CLFFBQUl0QyxLQUFLLEtBQUtBLEVBQWQ7QUFBQSxRQUFrQjZJLE1BQU03SSxHQUFHMkQsR0FBSCxDQUFPckUsQ0FBL0I7QUFDQSxRQUFHLENBQUN3RCxHQUFHbEQsR0FBSixJQUFZSSxHQUFHLEdBQUgsS0FBVyxDQUFDSyxRQUFReUMsR0FBR2xELEdBQUgsQ0FBT0ksR0FBRyxHQUFILENBQVAsQ0FBUixFQUF5QjZJLElBQUlHLEdBQTdCLENBQTNCLEVBQThEO0FBQzdELFNBQUdILElBQUlqSixHQUFKLEtBQVlLLENBQWYsRUFBaUI7QUFBRTtBQUFRO0FBQzNCNEksU0FBSWpILEVBQUosQ0FBTyxJQUFQLEVBQWE7QUFDWm9ILFdBQUtILElBQUlHLEdBREc7QUFFWnBKLFdBQUtpSixJQUFJakosR0FBSixHQUFVSyxDQUZIO0FBR1owRCxXQUFLa0YsSUFBSWxGO0FBSEcsTUFBYjtBQUtBO0FBQ0E7QUFDRGIsT0FBR2EsR0FBSCxHQUFTa0YsSUFBSS9NLElBQWI7QUFDQXdILFFBQUkxQixFQUFKLENBQU8sS0FBUCxFQUFja0IsRUFBZDtBQUNBLElBYkQ7QUFjQVEsT0FBSW1CLEdBQUosQ0FBUXVILE1BQVIsR0FBaUIsVUFBU2xKLEVBQVQsRUFBYVIsRUFBYixFQUFpQnRDLEVBQWpCLEVBQW9CO0FBQUUsUUFBSTJELE1BQU0sS0FBSzNELEVBQUwsSUFBV0EsRUFBckI7QUFDdEMsUUFBSTZJLE1BQU1sRixJQUFJckUsQ0FBZDtBQUFBLFFBQWlCeEQsT0FBTytNLElBQUkvTSxJQUFKLENBQVN3RCxDQUFqQztBQUFBLFFBQW9DTSxNQUFNLEVBQTFDO0FBQUEsUUFBOEMrQyxHQUE5QztBQUNBLFFBQUcsQ0FBQ0csR0FBR2xELEdBQVAsRUFBVztBQUNWO0FBQ0EsU0FBR2lKLElBQUlqSixHQUFKLEtBQVlLLENBQWYsRUFBaUI7QUFBRTtBQUFRO0FBQzNCNEksU0FBSWpILEVBQUosQ0FBTyxJQUFQLEVBQWE7QUFDYjtBQUNDb0gsV0FBS0gsSUFBSUcsR0FGRztBQUdacEosV0FBS2lKLElBQUlqSixHQUFKLEdBQVVLLENBSEg7QUFJWjBELFdBQUtBLEdBSk87QUFLWmtILFdBQUsvSDtBQUxPLE1BQWI7QUFPQTtBQUNBO0FBQ0Q7QUFDQXZELFlBQVF1RCxHQUFHbEQsR0FBWCxFQUFnQixVQUFTb0csSUFBVCxFQUFlcEMsSUFBZixFQUFvQjtBQUFFLFNBQUl3RCxRQUFRLEtBQUtBLEtBQWpCO0FBQ3JDeEgsU0FBSWdFLElBQUosSUFBWU4sSUFBSW1CLEdBQUosQ0FBUXNILEtBQVIsQ0FBYzNFLE1BQU14RCxJQUFOLENBQWQsRUFBMkJvQyxJQUEzQixFQUFpQyxFQUFDb0IsT0FBT0EsS0FBUixFQUFqQyxDQUFaLENBRG1DLENBQzJCO0FBQzlEQSxXQUFNeEQsSUFBTixJQUFjTixJQUFJbUIsR0FBSixDQUFRK0csS0FBUixDQUFjcEUsTUFBTXhELElBQU4sQ0FBZCxFQUEyQm9DLElBQTNCLEtBQW9Db0IsTUFBTXhELElBQU4sQ0FBbEQ7QUFDQSxLQUhELEVBR0c5SCxJQUhIO0FBSUEsUUFBR2dILEdBQUdhLEdBQUgsS0FBVzdILEtBQUs2SCxHQUFuQixFQUF1QjtBQUN0Qi9ELFdBQU1rRCxHQUFHbEQsR0FBVDtBQUNBO0FBQ0Q7QUFDQUwsWUFBUUssR0FBUixFQUFhLFVBQVNvRyxJQUFULEVBQWVwQyxJQUFmLEVBQW9CO0FBQ2hDLFNBQUk5SCxPQUFPLElBQVg7QUFBQSxTQUFpQnVGLE9BQU92RixLQUFLdUYsSUFBTCxLQUFjdkYsS0FBS3VGLElBQUwsR0FBWSxFQUExQixDQUF4QjtBQUFBLFNBQXVEc0MsTUFBTXRDLEtBQUt1QyxJQUFMLE1BQWV2QyxLQUFLdUMsSUFBTCxJQUFhOUgsS0FBSzZILEdBQUwsQ0FBU3FGLEdBQVQsQ0FBYXBGLElBQWIsQ0FBNUIsQ0FBN0Q7QUFBQSxTQUE4R2tGLE9BQVFuRixJQUFJckUsQ0FBMUg7QUFDQXdKLFVBQUtsSixHQUFMLEdBQVc5RCxLQUFLc0wsS0FBTCxDQUFXeEQsSUFBWCxDQUFYLENBRmdDLENBRUg7QUFDN0IsU0FBR2lGLElBQUlILEtBQUosSUFBYSxDQUFDckksUUFBUTJGLElBQVIsRUFBYzZDLElBQUlILEtBQWxCLENBQWpCLEVBQTBDO0FBQ3pDLE9BQUM1RixLQUFLaUcsT0FBT2pHLEVBQVAsRUFBVyxFQUFYLENBQU4sRUFBc0JsRCxHQUF0QixHQUE0QkssQ0FBNUI7QUFDQXFELFVBQUltQixHQUFKLENBQVE0RixLQUFSLENBQWN2SCxFQUFkLEVBQWtCUixFQUFsQixFQUFzQnVHLElBQUlsRixHQUExQjtBQUNBO0FBQ0E7QUFDRG1GLFVBQUtsSCxFQUFMLENBQVEsSUFBUixFQUFjO0FBQ2JoQyxXQUFLb0csSUFEUTtBQUViZ0QsV0FBS3BGLElBRlE7QUFHYkQsV0FBS0EsR0FIUTtBQUlia0gsV0FBSy9IO0FBSlEsTUFBZDtBQU1BLEtBZEQsRUFjR2hILElBZEg7QUFlQSxJQXRDRDtBQXVDQSxHQXZKQyxHQUFEOztBQXlKRCxNQUFJYyxPQUFPMEcsR0FBWDtBQUNBLE1BQUluRyxNQUFNUCxLQUFLTyxHQUFmO0FBQUEsTUFBb0JzSSxTQUFTdEksSUFBSUosRUFBakM7QUFDQSxNQUFJd0IsTUFBTTNCLEtBQUsyQixHQUFmO0FBQUEsTUFBb0I4QixVQUFVOUIsSUFBSUMsR0FBbEM7QUFBQSxNQUF1Q29ILFVBQVVySCxJQUFJcUIsR0FBckQ7QUFBQSxNQUEwRG1KLFNBQVN4SyxJQUFJK0IsRUFBdkU7QUFBQSxNQUEyRWYsVUFBVWhCLElBQUl0RixHQUF6RjtBQUNBLE1BQUkrTSxPQUFPMUMsSUFBSTBDLElBQWY7QUFBQSxNQUFxQmlHLFlBQVlqRyxLQUFLcEMsSUFBdEM7QUFBQSxNQUE0Q3NJLFVBQVVsRyxLQUFLakosRUFBM0Q7QUFBQSxNQUErRG9QLFdBQVduRyxLQUFLdEksR0FBL0U7QUFDQSxNQUFJbUcsUUFBUVAsSUFBSU8sS0FBaEI7QUFBQSxNQUF1QjRILFdBQVc1SCxNQUFNOUcsRUFBeEM7QUFBQSxNQUE0QytPLFlBQVlqSSxNQUFNbkcsR0FBOUQ7QUFDQSxNQUFJbUosTUFBTXZELElBQUl1RCxHQUFkO0FBQUEsTUFBbUJnRixTQUFTaEYsSUFBSTlKLEVBQWhDO0FBQUEsTUFBb0NpTixTQUFTbkQsSUFBSW5CLEdBQUosQ0FBUTNJLEVBQXJEO0FBQ0EsTUFBSWtELENBQUo7QUFDQSxFQXJLQSxFQXFLRWhFLE9BcktGLEVBcUtXLFNBcktYOztBQXVLRCxFQUFDQSxRQUFRLFVBQVNVLE1BQVQsRUFBZ0I7QUFDeEIsTUFBSTJHLE1BQU1ySCxRQUFRLFFBQVIsQ0FBVjtBQUNBQSxVQUFRLFNBQVIsRUFGd0IsQ0FFSjtBQUNwQkEsVUFBUSxPQUFSO0FBQ0FBLFVBQVEsU0FBUjtBQUNBQSxVQUFRLFFBQVI7QUFDQUEsVUFBUSxPQUFSO0FBQ0FBLFVBQVEsT0FBUjtBQUNBVSxTQUFPTCxPQUFQLEdBQWlCZ0gsR0FBakI7QUFDQSxFQVRBLEVBU0VySCxPQVRGLEVBU1csUUFUWDs7QUFXRCxFQUFDQSxRQUFRLFVBQVNVLE1BQVQsRUFBZ0I7QUFDeEIsTUFBSTJHLE1BQU1ySCxRQUFRLFFBQVIsQ0FBVjtBQUNBcUgsTUFBSWpCLEtBQUosQ0FBVWhHLElBQVYsR0FBaUIsVUFBU3FNLEtBQVQsRUFBZ0JsRyxFQUFoQixFQUFvQlIsR0FBcEIsRUFBd0I7QUFDeEMsT0FBSUwsT0FBTyxJQUFYO0FBQUEsT0FBaUJnQyxNQUFNaEMsSUFBdkI7QUFBQSxPQUE2QmdCLEdBQTdCO0FBQ0FYLFNBQU1BLE9BQU8sRUFBYixDQUFpQkEsSUFBSTNGLElBQUosR0FBVyxJQUFYO0FBQ2pCaUgsT0FBSXpLLEdBQUosQ0FBUStQLElBQVIsQ0FBYSxTQUFiLEVBQXdCLDJNQUF4QjtBQUNBLE9BQUdqRixRQUFRQSxJQUFJckUsQ0FBSixDQUFNeEQsSUFBakIsRUFBc0I7QUFBQyxRQUFHMEcsRUFBSCxFQUFNO0FBQUNBLFFBQUcsRUFBQ3pLLEtBQUt1TCxJQUFJekssR0FBSixDQUFRLGlDQUFSLENBQU4sRUFBSDtBQUFzRCxZQUFPOEssR0FBUDtBQUFXO0FBQy9GLE9BQUcsT0FBTytFLEtBQVAsS0FBaUIsUUFBcEIsRUFBNkI7QUFDNUIvRixVQUFNK0YsTUFBTW5NLEtBQU4sQ0FBWXlGLElBQUl6RixLQUFKLElBQWEsR0FBekIsQ0FBTjtBQUNBLFFBQUcsTUFBTW9HLElBQUl2SyxNQUFiLEVBQW9CO0FBQ25CdUwsV0FBTWhDLEtBQUtxSCxHQUFMLENBQVNOLEtBQVQsRUFBZ0JsRyxFQUFoQixFQUFvQlIsR0FBcEIsQ0FBTjtBQUNBMkIsU0FBSXJFLENBQUosQ0FBTTBDLEdBQU4sR0FBWUEsR0FBWjtBQUNBLFlBQU8yQixHQUFQO0FBQ0E7QUFDRCtFLFlBQVEvRixHQUFSO0FBQ0E7QUFDRCxPQUFHK0YsaUJBQWlCM0osS0FBcEIsRUFBMEI7QUFDekIsUUFBRzJKLE1BQU10USxNQUFOLEdBQWUsQ0FBbEIsRUFBb0I7QUFDbkJ1TCxXQUFNaEMsSUFBTjtBQUNBLFNBQUl4SixJQUFJLENBQVI7QUFBQSxTQUFXMkYsSUFBSTRLLE1BQU10USxNQUFyQjtBQUNBLFVBQUlELENBQUosRUFBT0EsSUFBSTJGLENBQVgsRUFBYzNGLEdBQWQsRUFBa0I7QUFDakJ3TCxZQUFNQSxJQUFJcUYsR0FBSixDQUFRTixNQUFNdlEsQ0FBTixDQUFSLEVBQW1CQSxJQUFFLENBQUYsS0FBUTJGLENBQVQsR0FBYTBFLEVBQWIsR0FBa0IsSUFBcEMsRUFBMENSLEdBQTFDLENBQU47QUFDQTtBQUNEO0FBQ0EsS0FQRCxNQU9PO0FBQ04yQixXQUFNaEMsS0FBS3FILEdBQUwsQ0FBU04sTUFBTSxDQUFOLENBQVQsRUFBbUJsRyxFQUFuQixFQUF1QlIsR0FBdkIsQ0FBTjtBQUNBO0FBQ0QyQixRQUFJckUsQ0FBSixDQUFNMEMsR0FBTixHQUFZQSxHQUFaO0FBQ0EsV0FBTzJCLEdBQVA7QUFDQTtBQUNELE9BQUcsQ0FBQytFLEtBQUQsSUFBVSxLQUFLQSxLQUFsQixFQUF3QjtBQUN2QixXQUFPL0csSUFBUDtBQUNBO0FBQ0RnQyxTQUFNaEMsS0FBS3FILEdBQUwsQ0FBUyxLQUFHTixLQUFaLEVBQW1CbEcsRUFBbkIsRUFBdUJSLEdBQXZCLENBQU47QUFDQTJCLE9BQUlyRSxDQUFKLENBQU0wQyxHQUFOLEdBQVlBLEdBQVo7QUFDQSxVQUFPMkIsR0FBUDtBQUNBLEdBbENEO0FBbUNBLEVBckNBLEVBcUNFMUgsT0FyQ0YsRUFxQ1csUUFyQ1g7O0FBdUNELEVBQUNBLFFBQVEsVUFBU1UsTUFBVCxFQUFnQjtBQUN4QixNQUFJMkcsTUFBTXJILFFBQVEsUUFBUixDQUFWO0FBQ0FxSCxNQUFJakIsS0FBSixDQUFVVCxFQUFWLEdBQWUsVUFBU1IsR0FBVCxFQUFjbEYsR0FBZCxFQUFtQmtRLEdBQW5CLEVBQXdCcE0sRUFBeEIsRUFBMkI7QUFDekMsT0FBSTJELE1BQU0sSUFBVjtBQUFBLE9BQWdCYixLQUFLYSxJQUFJckUsQ0FBekI7QUFBQSxPQUE0QnFELEdBQTVCO0FBQUEsT0FBaUNFLEdBQWpDO0FBQUEsT0FBc0NyQixJQUF0QztBQUNBLE9BQUcsT0FBT0osR0FBUCxLQUFlLFFBQWxCLEVBQTJCO0FBQzFCLFFBQUcsQ0FBQ2xGLEdBQUosRUFBUTtBQUFFLFlBQU80RyxHQUFHbEIsRUFBSCxDQUFNUixHQUFOLENBQVA7QUFBbUI7QUFDN0J5QixVQUFNQyxHQUFHbEIsRUFBSCxDQUFNUixHQUFOLEVBQVdsRixHQUFYLEVBQWdCa1EsT0FBT3RKLEVBQXZCLEVBQTJCOUMsRUFBM0IsQ0FBTjtBQUNBLFFBQUdvTSxPQUFPQSxJQUFJekksR0FBZCxFQUFrQjtBQUNqQixNQUFDeUksSUFBSUMsSUFBSixLQUFhRCxJQUFJQyxJQUFKLEdBQVcsRUFBeEIsQ0FBRCxFQUE4Qi9ULElBQTlCLENBQW1DdUssR0FBbkM7QUFDQTtBQUNEckIsV0FBTSxlQUFXO0FBQ2hCLFNBQUlxQixPQUFPQSxJQUFJckIsR0FBZixFQUFvQnFCLElBQUlyQixHQUFKO0FBQ3BCQSxVQUFJQSxHQUFKO0FBQ0EsS0FIRDtBQUlBQSxTQUFJQSxHQUFKLEdBQVVtQyxJQUFJbkMsR0FBSixDQUFROEssSUFBUixDQUFhM0ksR0FBYixLQUFxQnNILElBQS9CO0FBQ0F0SCxRQUFJbkMsR0FBSixHQUFVQSxJQUFWO0FBQ0EsV0FBT21DLEdBQVA7QUFDQTtBQUNELE9BQUkzQixNQUFNOUYsR0FBVjtBQUNBOEYsU0FBTyxTQUFTQSxHQUFWLEdBQWdCLEVBQUN1SSxRQUFRLElBQVQsRUFBaEIsR0FBaUN2SSxPQUFPLEVBQTlDO0FBQ0FBLE9BQUl1SyxFQUFKLEdBQVNuTCxHQUFUO0FBQ0FZLE9BQUlOLElBQUosR0FBVyxFQUFYO0FBQ0FpQyxPQUFJcUYsR0FBSixDQUFRdUQsRUFBUixFQUFZdkssR0FBWixFQXBCeUMsQ0FvQnZCO0FBQ2xCLFVBQU8yQixHQUFQO0FBQ0EsR0F0QkQ7O0FBd0JBLFdBQVM0SSxFQUFULENBQVl6SixFQUFaLEVBQWdCUixFQUFoQixFQUFtQjtBQUFFLE9BQUlOLE1BQU0sSUFBVjtBQUNwQixPQUFJMkIsTUFBTWIsR0FBR2EsR0FBYjtBQUFBLE9BQWtCa0YsTUFBTWxGLElBQUlyRSxDQUE1QjtBQUFBLE9BQStCekYsT0FBT2dQLElBQUlqSixHQUFKLElBQVdrRCxHQUFHbEQsR0FBcEQ7QUFBQSxPQUF5RCtDLE1BQU1YLElBQUlOLElBQW5FO0FBQUEsT0FBeUVPLEtBQUs0RyxJQUFJNUcsRUFBSixHQUFPYSxHQUFHa0csR0FBeEY7QUFBQSxPQUE2RnJHLEdBQTdGO0FBQ0EsT0FBRzFDLE1BQU1wRyxJQUFULEVBQWM7QUFDYjtBQUNBO0FBQ0QsT0FBR0EsUUFBUUEsS0FBSzZMLElBQUlwRyxDQUFULENBQVIsS0FBd0JxRCxNQUFNK0MsSUFBSTNJLEVBQUosQ0FBT2xELElBQVAsQ0FBOUIsQ0FBSCxFQUErQztBQUM5QzhJLFVBQU9rRyxJQUFJL00sSUFBSixDQUFTa04sR0FBVCxDQUFhckcsR0FBYixFQUFrQnJELENBQXpCO0FBQ0EsUUFBR1csTUFBTTBDLElBQUkvQyxHQUFiLEVBQWlCO0FBQ2hCO0FBQ0E7QUFDRC9GLFdBQU84SSxJQUFJL0MsR0FBWDtBQUNBO0FBQ0QsT0FBR29DLElBQUl1SSxNQUFQLEVBQWM7QUFBRTtBQUNmMVEsV0FBT2lKLEdBQUdsRCxHQUFWO0FBQ0E7QUFDRDtBQUNBLE9BQUcrQyxJQUFJL0MsR0FBSixLQUFZL0YsSUFBWixJQUFvQjhJLElBQUlxRyxHQUFKLEtBQVkvRyxFQUFoQyxJQUFzQyxDQUFDcUIsSUFBSTBDLElBQUosQ0FBU3BDLElBQVQsQ0FBYy9KLElBQWQsQ0FBMUMsRUFBOEQ7QUFBRTtBQUFRO0FBQ3hFOEksT0FBSS9DLEdBQUosR0FBVS9GLElBQVY7QUFDQThJLE9BQUlxRyxHQUFKLEdBQVUvRyxFQUFWO0FBQ0E7QUFDQTRHLE9BQUluSCxJQUFKLEdBQVc3SCxJQUFYO0FBQ0EsT0FBR21JLElBQUloQyxFQUFQLEVBQVU7QUFDVGdDLFFBQUl1SyxFQUFKLENBQU81TSxJQUFQLENBQVlxQyxJQUFJaEMsRUFBaEIsRUFBb0I4QyxFQUFwQixFQUF3QlIsRUFBeEI7QUFDQSxJQUZELE1BRU87QUFDTk4sUUFBSXVLLEVBQUosQ0FBTzVNLElBQVAsQ0FBWWdFLEdBQVosRUFBaUI5SixJQUFqQixFQUF1QmlKLEdBQUdrRyxHQUExQixFQUErQmxHLEVBQS9CLEVBQW1DUixFQUFuQztBQUNBO0FBQ0Q7O0FBRURnQixNQUFJakIsS0FBSixDQUFVd0UsR0FBVixHQUFnQixVQUFTckUsRUFBVCxFQUFhUixHQUFiLEVBQWlCO0FBQ2hDLE9BQUkyQixNQUFNLElBQVY7QUFBQSxPQUFnQmIsS0FBS2EsSUFBSXJFLENBQXpCO0FBQUEsT0FBNEJ6RixPQUFPaUosR0FBR2xELEdBQXRDO0FBQ0EsT0FBRyxJQUFJa0QsR0FBR0ksR0FBUCxJQUFjakQsTUFBTXBHLElBQXZCLEVBQTRCO0FBQzNCLEtBQUMySSxNQUFNeUksSUFBUCxFQUFhdEwsSUFBYixDQUFrQmdFLEdBQWxCLEVBQXVCOUosSUFBdkIsRUFBNkJpSixHQUFHa0csR0FBaEM7QUFDQSxXQUFPckYsR0FBUDtBQUNBO0FBQ0QsT0FBR25CLEVBQUgsRUFBTTtBQUNMLEtBQUNSLE1BQU1BLE9BQU8sRUFBZCxFQUFrQnVLLEVBQWxCLEdBQXVCL0osRUFBdkI7QUFDQVIsUUFBSTZHLEdBQUosR0FBVS9GLEVBQVY7QUFDQWEsUUFBSXFGLEdBQUosQ0FBUW5DLEdBQVIsRUFBYSxFQUFDN0csSUFBSWdDLEdBQUwsRUFBYjtBQUNBQSxRQUFJd0ssS0FBSixHQUFZLElBQVosQ0FKSyxDQUlhO0FBQ2xCLElBTEQsTUFLTztBQUNObEosUUFBSXpLLEdBQUosQ0FBUStQLElBQVIsQ0FBYSxTQUFiLEVBQXdCLG9KQUF4QjtBQUNBLFFBQUl2RyxRQUFRc0IsSUFBSXRCLEtBQUosRUFBWjtBQUNBQSxVQUFNL0MsQ0FBTixDQUFRdUgsR0FBUixHQUFjbEQsSUFBSWtELEdBQUosQ0FBUSxZQUFVO0FBQy9CeEUsV0FBTS9DLENBQU4sQ0FBUXNDLEVBQVIsQ0FBVyxJQUFYLEVBQWlCK0IsSUFBSXJFLENBQXJCO0FBQ0EsS0FGYSxDQUFkO0FBR0EsV0FBTytDLEtBQVA7QUFDQTtBQUNELFVBQU9zQixHQUFQO0FBQ0EsR0FwQkQ7O0FBc0JBLFdBQVNrRCxHQUFULENBQWEvRCxFQUFiLEVBQWlCUixFQUFqQixFQUFxQmhDLEVBQXJCLEVBQXdCO0FBQ3ZCLE9BQUkwQixNQUFNLEtBQUtoQyxFQUFmO0FBQUEsT0FBbUI2SSxNQUFNN0csSUFBSTZHLEdBQTdCO0FBQUEsT0FBa0NsRixNQUFNYixHQUFHYSxHQUEzQztBQUFBLE9BQWdEbUYsT0FBT25GLElBQUlyRSxDQUEzRDtBQUFBLE9BQThEekYsT0FBT2lQLEtBQUtsSixHQUFMLElBQVlrRCxHQUFHbEQsR0FBcEY7QUFBQSxPQUF5RitDLEdBQXpGO0FBQ0EsT0FBRzFDLE1BQU1wRyxJQUFULEVBQWM7QUFDYjtBQUNBO0FBQ0QsT0FBR0EsUUFBUUEsS0FBSzZMLElBQUlwRyxDQUFULENBQVIsS0FBd0JxRCxNQUFNK0MsSUFBSTNJLEVBQUosQ0FBT2xELElBQVAsQ0FBOUIsQ0FBSCxFQUErQztBQUM5QzhJLFVBQU9rRyxJQUFJL00sSUFBSixDQUFTa04sR0FBVCxDQUFhckcsR0FBYixFQUFrQnJELENBQXpCO0FBQ0EsUUFBR1csTUFBTTBDLElBQUkvQyxHQUFiLEVBQWlCO0FBQ2hCO0FBQ0E7QUFDRC9GLFdBQU84SSxJQUFJL0MsR0FBWDtBQUNBO0FBQ0QsT0FBRzBDLEdBQUdrQyxJQUFOLEVBQVc7QUFBRUosaUJBQWE5QixHQUFHa0MsSUFBaEI7QUFBdUI7QUFDcEM7QUFDQSxPQUFHLENBQUN4QyxJQUFJd0ssS0FBUixFQUFjO0FBQ2JsSyxPQUFHa0MsSUFBSCxHQUFVSCxXQUFXLFlBQVU7QUFDOUJ3QyxTQUFJbEgsSUFBSixDQUFTLEVBQUNLLElBQUdnQyxHQUFKLEVBQVQsRUFBbUJjLEVBQW5CLEVBQXVCUixFQUF2QixFQUEyQkEsR0FBR2tDLElBQUgsSUFBVyxDQUF0QztBQUNBLEtBRlMsRUFFUHhDLElBQUl3QyxJQUFKLElBQVksRUFGTCxDQUFWO0FBR0E7QUFDQTtBQUNELE9BQUdxRSxJQUFJSCxLQUFKLElBQWFHLElBQUlqRixJQUFwQixFQUF5QjtBQUN4QixRQUFHdEIsR0FBR2QsR0FBSCxFQUFILEVBQVk7QUFBRTtBQUFRLEtBREUsQ0FDRDtBQUN2QixJQUZELE1BRU87QUFDTixRQUFHLENBQUNRLElBQUlxRixJQUFKLEdBQVdyRixJQUFJcUYsSUFBSixJQUFZLEVBQXhCLEVBQTRCeUIsS0FBSzdHLEVBQWpDLENBQUgsRUFBd0M7QUFBRTtBQUFRO0FBQ2xERCxRQUFJcUYsSUFBSixDQUFTeUIsS0FBSzdHLEVBQWQsSUFBb0IsSUFBcEI7QUFDQTtBQUNERCxPQUFJdUssRUFBSixDQUFPNU0sSUFBUCxDQUFZbUQsR0FBR2EsR0FBSCxJQUFVM0IsSUFBSTJCLEdBQTFCLEVBQStCOUosSUFBL0IsRUFBcUNpSixHQUFHa0csR0FBeEM7QUFDQTs7QUFFRDFGLE1BQUlqQixLQUFKLENBQVViLEdBQVYsR0FBZ0IsWUFBVTtBQUN6QixPQUFJbUMsTUFBTSxJQUFWO0FBQUEsT0FBZ0JiLEtBQUthLElBQUlyRSxDQUF6QjtBQUFBLE9BQTRCcUQsR0FBNUI7QUFDQSxPQUFJaEIsT0FBT21CLEdBQUduQixJQUFILElBQVcsRUFBdEI7QUFBQSxPQUEwQmtILE1BQU1sSCxLQUFLckMsQ0FBckM7QUFDQSxPQUFHLENBQUN1SixHQUFKLEVBQVE7QUFBRTtBQUFRO0FBQ2xCLE9BQUdsRyxNQUFNa0csSUFBSXhILElBQWIsRUFBa0I7QUFDakIsUUFBR3NCLElBQUlHLEdBQUdrRyxHQUFQLENBQUgsRUFBZTtBQUNkL0MsYUFBUXRELEdBQVIsRUFBYUcsR0FBR2tHLEdBQWhCO0FBQ0EsS0FGRCxNQUVPO0FBQ056SixhQUFRb0QsR0FBUixFQUFhLFVBQVN0RyxJQUFULEVBQWU1RSxHQUFmLEVBQW1CO0FBQy9CLFVBQUdrTSxRQUFRdEgsSUFBWCxFQUFnQjtBQUFFO0FBQVE7QUFDMUI0SixjQUFRdEQsR0FBUixFQUFhbEwsR0FBYjtBQUNBLE1BSEQ7QUFJQTtBQUNEO0FBQ0QsT0FBRyxDQUFDa0wsTUFBTWdCLElBQUloQyxJQUFKLENBQVMsQ0FBQyxDQUFWLENBQVAsTUFBeUJBLElBQTVCLEVBQWlDO0FBQ2hDc0UsWUFBUXRELElBQUl5RSxLQUFaLEVBQW1CdEUsR0FBR2tHLEdBQXRCO0FBQ0E7QUFDRCxPQUFHbEcsR0FBR00sR0FBSCxLQUFXVCxNQUFNRyxHQUFHTSxHQUFILENBQU8sSUFBUCxDQUFqQixDQUFILEVBQWtDO0FBQ2pDN0QsWUFBUW9ELElBQUkzRSxDQUFaLEVBQWUsVUFBU3NFLEVBQVQsRUFBWTtBQUMxQkEsUUFBR2QsR0FBSDtBQUNBLEtBRkQ7QUFHQTtBQUNELFVBQU9tQyxHQUFQO0FBQ0EsR0F2QkQ7QUF3QkEsTUFBSXBGLE1BQU0rRSxJQUFJL0UsR0FBZDtBQUFBLE1BQW1COEIsVUFBVTlCLElBQUlDLEdBQWpDO0FBQUEsTUFBc0N5SCxVQUFVMUgsSUFBSXdCLEdBQXBEO0FBQUEsTUFBeURnSixTQUFTeEssSUFBSStCLEVBQXRFO0FBQ0EsTUFBSW9GLE1BQU1wQyxJQUFJdUQsR0FBSixDQUFRbkIsR0FBbEI7QUFDQSxNQUFJakYsUUFBUSxFQUFaO0FBQUEsTUFBZ0J3SyxPQUFPLFNBQVBBLElBQU8sR0FBVSxDQUFFLENBQW5DO0FBQUEsTUFBcUNoTCxDQUFyQztBQUNBLEVBcElBLEVBb0lFaEUsT0FwSUYsRUFvSVcsTUFwSVg7O0FBc0lELEVBQUNBLFFBQVEsVUFBU1UsTUFBVCxFQUFnQjtBQUN4QixNQUFJMkcsTUFBTXJILFFBQVEsUUFBUixDQUFWO0FBQUEsTUFBNkJnRSxDQUE3QjtBQUNBcUQsTUFBSWpCLEtBQUosQ0FBVW9JLEdBQVYsR0FBZ0IsVUFBU2pJLEVBQVQsRUFBYVIsR0FBYixFQUFrQnZFLENBQWxCLEVBQW9CO0FBQ25DNkYsT0FBSXpLLEdBQUosQ0FBUStQLElBQVIsQ0FBYSxTQUFiLEVBQXdCLG1SQUF4QjtBQUNBLFVBQU8sS0FBS0ksR0FBTCxDQUFTeUQsS0FBVCxFQUFnQixFQUFDaEMsS0FBS2pJLEVBQU4sRUFBaEIsQ0FBUDtBQUNBLEdBSEQ7QUFJQSxXQUFTaUssS0FBVCxDQUFlM0osRUFBZixFQUFtQlIsRUFBbkIsRUFBc0I7QUFBRUEsTUFBR2QsR0FBSDtBQUN2QixPQUFHc0IsR0FBRy9LLEdBQUgsSUFBV2tJLE1BQU02QyxHQUFHbEQsR0FBdkIsRUFBNEI7QUFBRTtBQUFRO0FBQ3RDLE9BQUcsQ0FBQyxLQUFLNkssR0FBVCxFQUFhO0FBQUU7QUFBUTtBQUN2QixRQUFLQSxHQUFMLENBQVM5SyxJQUFULENBQWNtRCxHQUFHYSxHQUFqQixFQUFzQmIsR0FBR2tHLEdBQXpCLEVBQThCLFlBQVU7QUFBRXBRLFlBQVFDLEdBQVIsQ0FBWSwwRUFBWixFQUF5RjZULEtBQUtwTSxFQUFMLENBQVFxTSxTQUFSO0FBQW9CLElBQXZKO0FBQ0E7QUFDRCxFQVhBLEVBV0UxUSxPQVhGLEVBV1csT0FYWDs7QUFhRCxFQUFDQSxRQUFRLFVBQVNVLE1BQVQsRUFBZ0I7QUFDeEIsTUFBSTJHLE1BQU1ySCxRQUFRLFFBQVIsQ0FBVjtBQUNBcUgsTUFBSWpCLEtBQUosQ0FBVXBKLEdBQVYsR0FBZ0IsVUFBU3VKLEVBQVQsRUFBYVIsR0FBYixFQUFrQnZFLENBQWxCLEVBQW9CO0FBQ25DLE9BQUlrRyxNQUFNLElBQVY7QUFBQSxPQUFnQmtGLE1BQU1sRixJQUFJckUsQ0FBMUI7QUFBQSxPQUE2QitDLEtBQTdCO0FBQ0EsT0FBRyxDQUFDRyxFQUFKLEVBQU87QUFDTixRQUFHSCxRQUFRd0csSUFBSStELE1BQWYsRUFBc0I7QUFBRSxZQUFPdkssS0FBUDtBQUFjO0FBQ3RDQSxZQUFRd0csSUFBSStELE1BQUosR0FBYWpKLElBQUl0QixLQUFKLEVBQXJCO0FBQ0FBLFVBQU0vQyxDQUFOLENBQVF1SCxHQUFSLEdBQWNsRCxJQUFJaEMsSUFBSixDQUFTLEtBQVQsQ0FBZDtBQUNBZ0MsUUFBSS9CLEVBQUosQ0FBTyxJQUFQLEVBQWEzSSxHQUFiLEVBQWtCb0osTUFBTS9DLENBQXhCO0FBQ0EsV0FBTytDLEtBQVA7QUFDQTtBQUNEaUIsT0FBSXpLLEdBQUosQ0FBUStQLElBQVIsQ0FBYSxPQUFiLEVBQXNCLHVKQUF0QjtBQUNBdkcsV0FBUXNCLElBQUl0QixLQUFKLEVBQVI7QUFDQXNCLE9BQUkxSyxHQUFKLEdBQVUySSxFQUFWLENBQWEsVUFBUy9ILElBQVQsRUFBZXBDLEdBQWYsRUFBb0JxTCxFQUFwQixFQUF3QlIsRUFBeEIsRUFBMkI7QUFDdkMsUUFBSWpCLE9BQU8sQ0FBQ21CLE1BQUl5SSxJQUFMLEVBQVd0TCxJQUFYLENBQWdCLElBQWhCLEVBQXNCOUYsSUFBdEIsRUFBNEJwQyxHQUE1QixFQUFpQ3FMLEVBQWpDLEVBQXFDUixFQUFyQyxDQUFYO0FBQ0EsUUFBR3JDLE1BQU1vQixJQUFULEVBQWM7QUFBRTtBQUFRO0FBQ3hCLFFBQUdpQyxJQUFJdkcsRUFBSixDQUFPc0UsSUFBUCxDQUFILEVBQWdCO0FBQ2ZnQixXQUFNL0MsQ0FBTixDQUFRc0MsRUFBUixDQUFXLElBQVgsRUFBaUJQLEtBQUsvQixDQUF0QjtBQUNBO0FBQ0E7QUFDRCtDLFVBQU0vQyxDQUFOLENBQVFzQyxFQUFSLENBQVcsSUFBWCxFQUFpQixFQUFDb0gsS0FBS3ZSLEdBQU4sRUFBV21JLEtBQUt5QixJQUFoQixFQUFzQnNDLEtBQUt0QixLQUEzQixFQUFqQjtBQUNBLElBUkQ7QUFTQSxVQUFPQSxLQUFQO0FBQ0EsR0FyQkQ7QUFzQkEsV0FBU3BKLEdBQVQsQ0FBYTZKLEVBQWIsRUFBZ0I7QUFDZixPQUFHLENBQUNBLEdBQUdsRCxHQUFKLElBQVcwRCxJQUFJdUQsR0FBSixDQUFROUosRUFBUixDQUFXK0YsR0FBR2xELEdBQWQsQ0FBZCxFQUFpQztBQUFFO0FBQVE7QUFDM0MsT0FBRyxLQUFLSSxFQUFMLENBQVE2RyxHQUFYLEVBQWU7QUFBRSxTQUFLckYsR0FBTDtBQUFZLElBRmQsQ0FFZTtBQUM5QmpDLFdBQVF1RCxHQUFHbEQsR0FBWCxFQUFnQjJFLElBQWhCLEVBQXNCLEVBQUNzRSxLQUFLLEtBQUs3SSxFQUFYLEVBQWUyRCxLQUFLYixHQUFHYSxHQUF2QixFQUF0QjtBQUNBLFFBQUtyRCxFQUFMLENBQVFlLElBQVIsQ0FBYXlCLEVBQWI7QUFDQTtBQUNELFdBQVN5QixJQUFULENBQWMxRSxDQUFkLEVBQWdCZixDQUFoQixFQUFrQjtBQUNqQixPQUFHK04sT0FBTy9OLENBQVYsRUFBWTtBQUFFO0FBQVE7QUFDdEIsT0FBSStKLE1BQU0sS0FBS0EsR0FBZjtBQUFBLE9BQW9CbEYsTUFBTSxLQUFLQSxHQUFMLENBQVNxRixHQUFULENBQWFsSyxDQUFiLENBQTFCO0FBQUEsT0FBMkNnRSxLQUFNYSxJQUFJckUsQ0FBckQ7QUFDQSxJQUFDd0QsR0FBRzBILElBQUgsS0FBWTFILEdBQUcwSCxJQUFILEdBQVUsRUFBdEIsQ0FBRCxFQUE0QjNCLElBQUk1RyxFQUFoQyxJQUFzQzRHLEdBQXRDO0FBQ0E7QUFDRCxNQUFJdEosVUFBVStELElBQUkvRSxHQUFKLENBQVF0RixHQUF0QjtBQUFBLE1BQTJCZ1MsT0FBTyxTQUFQQSxJQUFPLEdBQVUsQ0FBRSxDQUE5QztBQUFBLE1BQWdENUgsUUFBUSxFQUFDakIsTUFBTTZJLElBQVAsRUFBYXpKLEtBQUt5SixJQUFsQixFQUF4RDtBQUFBLE1BQWlGNEIsS0FBS3ZKLElBQUkwQyxJQUFKLENBQVMxRyxDQUEvRjtBQUFBLE1BQWtHVyxDQUFsRztBQUNBLEVBcENBLEVBb0NFaEUsT0FwQ0YsRUFvQ1csT0FwQ1g7O0FBc0NELEVBQUNBLFFBQVEsVUFBU1UsTUFBVCxFQUFnQjtBQUN4QixNQUFJMkcsTUFBTXJILFFBQVEsUUFBUixDQUFWO0FBQ0FxSCxNQUFJakIsS0FBSixDQUFVNEIsR0FBVixHQUFnQixVQUFTNkksSUFBVCxFQUFldEssRUFBZixFQUFtQlIsR0FBbkIsRUFBdUI7QUFDdEMsT0FBSTJCLE1BQU0sSUFBVjtBQUFBLE9BQWdCQyxJQUFoQjtBQUNBcEIsUUFBS0EsTUFBTSxZQUFVLENBQUUsQ0FBdkI7QUFDQSxPQUFHb0IsT0FBT04sSUFBSTBDLElBQUosQ0FBU3BDLElBQVQsQ0FBY2tKLElBQWQsQ0FBVixFQUE4QjtBQUFFLFdBQU9uSixJQUFJTSxHQUFKLENBQVFOLElBQUloQyxJQUFKLENBQVMsQ0FBQyxDQUFWLEVBQWFxSCxHQUFiLENBQWlCcEYsSUFBakIsQ0FBUixFQUFnQ3BCLEVBQWhDLEVBQW9DUixHQUFwQyxDQUFQO0FBQWlEO0FBQ2pGLE9BQUcsQ0FBQ3NCLElBQUl2RyxFQUFKLENBQU8rUCxJQUFQLENBQUosRUFBaUI7QUFDaEIsUUFBR3hKLElBQUkvRSxHQUFKLENBQVF4QixFQUFSLENBQVcrUCxJQUFYLENBQUgsRUFBb0I7QUFBRSxZQUFPbkosSUFBSU0sR0FBSixDQUFRTixJQUFJckUsQ0FBSixDQUFNeEQsSUFBTixDQUFXOEQsR0FBWCxDQUFla04sSUFBZixDQUFSLEVBQThCdEssRUFBOUIsRUFBa0NSLEdBQWxDLENBQVA7QUFBK0M7QUFDckUsV0FBTzJCLElBQUlxRixHQUFKLENBQVExRixJQUFJOUYsSUFBSixDQUFTSyxNQUFULEVBQVIsRUFBMkIrQixHQUEzQixDQUErQmtOLElBQS9CLENBQVA7QUFDQTtBQUNEQSxRQUFLOUQsR0FBTCxDQUFTLEdBQVQsRUFBY0EsR0FBZCxDQUFrQixVQUFTbEcsRUFBVCxFQUFhUixFQUFiLEVBQWdCO0FBQ2pDLFFBQUcsQ0FBQ1EsR0FBR2EsR0FBSixJQUFXLENBQUNiLEdBQUdhLEdBQUgsQ0FBT3JFLENBQVAsQ0FBU3FDLElBQXhCLEVBQTZCO0FBQzdCVyxPQUFHZCxHQUFIO0FBQ0FzQixTQUFNQSxHQUFHYSxHQUFILENBQU9yRSxDQUFQLENBQVNxQyxJQUFULENBQWNyQyxDQUFwQjtBQUNBLFFBQUlNLE1BQU0sRUFBVjtBQUFBLFFBQWNvRyxPQUFPbEQsR0FBR2xELEdBQXhCO0FBQUEsUUFBNkJnRSxPQUFPTixJQUFJMEMsSUFBSixDQUFTcEMsSUFBVCxDQUFjb0MsSUFBZCxDQUFwQztBQUNBLFFBQUcsQ0FBQ3BDLElBQUosRUFBUztBQUFFLFlBQU9wQixHQUFHN0MsSUFBSCxDQUFRZ0UsR0FBUixFQUFhLEVBQUM1TCxLQUFLdUwsSUFBSXpLLEdBQUosQ0FBUSxxQ0FBcUNtTixJQUFyQyxHQUE0QyxJQUFwRCxDQUFOLEVBQWIsQ0FBUDtBQUF1RjtBQUNsR3JDLFFBQUkvRCxHQUFKLENBQVEwRCxJQUFJL0UsR0FBSixDQUFRcUIsR0FBUixDQUFZQSxHQUFaLEVBQWlCZ0UsSUFBakIsRUFBdUJOLElBQUl1RCxHQUFKLENBQVFuQixHQUFSLENBQVloSSxHQUFaLENBQWdCa0csSUFBaEIsQ0FBdkIsQ0FBUixFQUF1RHBCLEVBQXZELEVBQTJEUixHQUEzRDtBQUNBLElBUEQsRUFPRSxFQUFDd0MsTUFBSyxDQUFOLEVBUEY7QUFRQSxVQUFPc0ksSUFBUDtBQUNBLEdBakJEO0FBa0JBLEVBcEJBLEVBb0JFN1EsT0FwQkYsRUFvQlcsT0FwQlg7O0FBc0JELEVBQUNBLFFBQVEsVUFBU1UsTUFBVCxFQUFnQjtBQUN4QixNQUFHLE9BQU8yRyxHQUFQLEtBQWUsV0FBbEIsRUFBOEI7QUFBRTtBQUFRLEdBRGhCLENBQ2lCOztBQUV6QyxNQUFJeEgsSUFBSjtBQUFBLE1BQVVtUCxPQUFPLFNBQVBBLElBQU8sR0FBVSxDQUFFLENBQTdCO0FBQUEsTUFBK0JoTCxDQUEvQjtBQUNBLE1BQUcsT0FBT2xFLE1BQVAsS0FBa0IsV0FBckIsRUFBaUM7QUFBRUQsVUFBT0MsTUFBUDtBQUFlO0FBQ2xELE1BQUlnUixRQUFRalIsS0FBSzdELFlBQUwsSUFBcUIsRUFBQ3FELFNBQVMyUCxJQUFWLEVBQWdCK0IsWUFBWS9CLElBQTVCLEVBQWtDMVMsU0FBUzBTLElBQTNDLEVBQWpDOztBQUVBLE1BQUkzRyxRQUFRLEVBQVo7QUFBQSxNQUFnQjJJLFFBQVEsRUFBeEI7QUFBQSxNQUE0QlQsUUFBUSxFQUFwQztBQUFBLE1BQXdDVSxRQUFRLENBQWhEO0FBQUEsTUFBbURDLE1BQU0sS0FBekQ7QUFBQSxNQUFnRTNJLElBQWhFOztBQUVBbEIsTUFBSTFCLEVBQUosQ0FBTyxLQUFQLEVBQWMsVUFBU2tCLEVBQVQsRUFBWTtBQUFFLE9BQUkvSyxHQUFKO0FBQUEsT0FBU2tLLEVBQVQ7QUFBQSxPQUFhRCxHQUFiO0FBQUEsT0FBa0JsRyxPQUFPZ0gsR0FBR2EsR0FBSCxDQUFPckUsQ0FBUCxDQUFTeEQsSUFBbEM7QUFDM0IsUUFBS3dFLEVBQUwsQ0FBUWUsSUFBUixDQUFheUIsRUFBYjtBQUNBLElBQUNkLE1BQU0sRUFBUCxFQUFXb0wsTUFBWCxHQUFvQixDQUFDdEssR0FBR2QsR0FBSCxJQUFVQSxHQUFYLEVBQWdCb0wsTUFBaEIsSUFBMEJ0SyxHQUFHYSxHQUFILENBQU9oQyxJQUFQLENBQVksWUFBWixDQUExQixJQUF1RCxNQUEzRTtBQUNBLE9BQUl5RixRQUFRdEwsS0FBS3dELENBQUwsQ0FBTzhILEtBQW5CO0FBQ0E5RCxPQUFJL0UsR0FBSixDQUFRdEYsR0FBUixDQUFZNkosR0FBR2xELEdBQWYsRUFBb0IsVUFBU29HLElBQVQsRUFBZXBDLElBQWYsRUFBb0I7QUFDdkM0SSxVQUFNNUksSUFBTixJQUFjNEksTUFBTTVJLElBQU4sS0FBZXdELE1BQU14RCxJQUFOLENBQWYsSUFBOEJvQyxJQUE1QztBQUNBLElBRkQ7QUFHQWtILFlBQVMsQ0FBVDtBQUNBNUksU0FBTXhCLEdBQUcsR0FBSCxDQUFOLElBQWlCaEgsSUFBakI7QUFDQSxZQUFTdVIsSUFBVCxHQUFlO0FBQ2RqSixpQkFBYUksSUFBYjtBQUNBLFFBQUl0QixNQUFNb0IsS0FBVjtBQUNBLFFBQUlnSixNQUFNZCxLQUFWO0FBQ0FVLFlBQVEsQ0FBUjtBQUNBMUksV0FBTyxLQUFQO0FBQ0FGLFlBQVEsRUFBUjtBQUNBa0ksWUFBUSxFQUFSO0FBQ0FsSixRQUFJL0UsR0FBSixDQUFRdEYsR0FBUixDQUFZcVUsR0FBWixFQUFpQixVQUFTdEgsSUFBVCxFQUFlcEMsSUFBZixFQUFvQjtBQUNwQztBQUNBO0FBQ0FvQyxZQUFPb0IsTUFBTXhELElBQU4sS0FBZTBKLElBQUkxSixJQUFKLENBQWYsSUFBNEJvQyxJQUFuQztBQUNBLFNBQUc7QUFBQytHLFlBQU16UixPQUFOLENBQWMwRyxJQUFJb0wsTUFBSixHQUFheEosSUFBM0IsRUFBaUNqRyxLQUFLQyxTQUFMLENBQWVvSSxJQUFmLENBQWpDO0FBQ0gsTUFERCxDQUNDLE9BQU01RixDQUFOLEVBQVE7QUFBRXJJLFlBQU1xSSxLQUFLLHNCQUFYO0FBQW1DO0FBQzlDLEtBTkQ7QUFPQSxRQUFHLENBQUNrRCxJQUFJL0UsR0FBSixDQUFRa0MsS0FBUixDQUFjcUMsR0FBR2EsR0FBSCxDQUFPaEMsSUFBUCxDQUFZLFdBQVosQ0FBZCxDQUFKLEVBQTRDO0FBQUU7QUFBUSxLQWZ4QyxDQWV5QztBQUN2RDJCLFFBQUkvRSxHQUFKLENBQVF0RixHQUFSLENBQVlpSyxHQUFaLEVBQWlCLFVBQVNwSCxJQUFULEVBQWVtRyxFQUFmLEVBQWtCO0FBQ2xDbkcsVUFBSzhGLEVBQUwsQ0FBUSxJQUFSLEVBQWM7QUFDYixXQUFLSyxFQURRO0FBRWJsSyxXQUFLQSxHQUZRO0FBR2J3VSxVQUFJLENBSFMsQ0FHUDtBQUhPLE1BQWQ7QUFLQSxLQU5EO0FBT0E7QUFDRCxPQUFHVyxTQUFTQyxHQUFaLEVBQWdCO0FBQUU7QUFDakIsV0FBT0UsTUFBUDtBQUNBO0FBQ0QsT0FBRzdJLElBQUgsRUFBUTtBQUFFO0FBQVE7QUFDbEJKLGdCQUFhSSxJQUFiO0FBQ0FBLFVBQU9ILFdBQVdnSixJQUFYLEVBQWlCLElBQWpCLENBQVA7QUFDQSxHQXZDRDtBQXdDQS9KLE1BQUkxQixFQUFKLENBQU8sS0FBUCxFQUFjLFVBQVNrQixFQUFULEVBQVk7QUFDekIsUUFBS3hDLEVBQUwsQ0FBUWUsSUFBUixDQUFheUIsRUFBYjtBQUNBLE9BQUlhLE1BQU1iLEdBQUdhLEdBQWI7QUFBQSxPQUFrQjRKLE1BQU16SyxHQUFHa0csR0FBM0I7QUFBQSxPQUFnQ3BGLElBQWhDO0FBQUEsT0FBc0MvSixJQUF0QztBQUFBLE9BQTRDbUksR0FBNUM7QUFBQSxPQUFpRC9CLENBQWpEO0FBQ0E7QUFDQSxJQUFDK0IsTUFBTWMsR0FBR2QsR0FBSCxJQUFVLEVBQWpCLEVBQXFCb0wsTUFBckIsR0FBOEJwTCxJQUFJb0wsTUFBSixJQUFjdEssR0FBR2EsR0FBSCxDQUFPaEMsSUFBUCxDQUFZLFlBQVosQ0FBZCxJQUEyQyxNQUF6RTtBQUNBLE9BQUcsQ0FBQzRMLEdBQUQsSUFBUSxFQUFFM0osT0FBTzJKLElBQUlqSyxJQUFJaEUsQ0FBSixDQUFNc0UsSUFBVixDQUFULENBQVgsRUFBcUM7QUFBRTtBQUFRO0FBQy9DO0FBQ0EsT0FBSThFLFFBQVE2RSxJQUFJLEdBQUosQ0FBWjtBQUNBMVQsVUFBT3lKLElBQUkvRSxHQUFKLENBQVFiLEdBQVIsQ0FBWXFQLE1BQU14VSxPQUFOLENBQWN5SixJQUFJb0wsTUFBSixHQUFheEosSUFBM0IsS0FBb0MsSUFBaEQsS0FBeUQ0SSxNQUFNNUksSUFBTixDQUF6RCxJQUF3RTNELENBQS9FO0FBQ0EsT0FBR3BHLFFBQVE2TyxLQUFYLEVBQWlCO0FBQ2hCN08sV0FBT3lKLElBQUlPLEtBQUosQ0FBVXZELEVBQVYsQ0FBYXpHLElBQWIsRUFBbUI2TyxLQUFuQixDQUFQO0FBQ0E7QUFDRCxPQUFHLENBQUM3TyxJQUFELElBQVMsQ0FBQ3lKLElBQUkvRSxHQUFKLENBQVFrQyxLQUFSLENBQWNrRCxJQUFJaEMsSUFBSixDQUFTLFdBQVQsQ0FBZCxDQUFiLEVBQWtEO0FBQUU7QUFDbkQsV0FEaUQsQ0FDekM7QUFDUjtBQUNEZ0MsT0FBSS9CLEVBQUosQ0FBTyxJQUFQLEVBQWEsRUFBQyxLQUFLa0IsR0FBRyxHQUFILENBQU4sRUFBZWxELEtBQUswRCxJQUFJOEQsS0FBSixDQUFVcEIsSUFBVixDQUFlbk0sSUFBZixDQUFwQixFQUEwQzhQLEtBQUssSUFBL0MsRUFBYjtBQUNBO0FBQ0EsR0FqQkQ7QUFrQkEsRUFuRUEsRUFtRUUxTixPQW5FRixFQW1FVyx5QkFuRVg7O0FBcUVELEVBQUNBLFFBQVEsVUFBU1UsTUFBVCxFQUFnQjtBQUN4QixNQUFJMkcsTUFBTXJILFFBQVEsUUFBUixDQUFWOztBQUVBLE1BQUksT0FBTzBCLElBQVAsS0FBZ0IsV0FBcEIsRUFBaUM7QUFDaEMsU0FBTSxJQUFJbkUsS0FBSixDQUNMLGlEQUNBLGtEQUZLLENBQU47QUFJQTs7QUFFRCxNQUFJZ1UsU0FBSjtBQUNBLE1BQUcsT0FBT3pSLE1BQVAsS0FBa0IsV0FBckIsRUFBaUM7QUFDaEN5UixlQUFZelIsT0FBT3lSLFNBQVAsSUFBb0J6UixPQUFPMFIsZUFBM0IsSUFBOEMxUixPQUFPMlIsWUFBakU7QUFDQSxHQUZELE1BRU87QUFDTjtBQUNBO0FBQ0QsTUFBSTVWLE9BQUo7QUFBQSxNQUFhb1YsUUFBUSxDQUFyQjtBQUFBLE1BQXdCakMsT0FBTyxTQUFQQSxJQUFPLEdBQVUsQ0FBRSxDQUEzQztBQUFBLE1BQTZDekcsSUFBN0M7O0FBRUFsQixNQUFJMUIsRUFBSixDQUFPLEtBQVAsRUFBYyxVQUFTa0IsRUFBVCxFQUFZO0FBQ3pCLFFBQUt4QyxFQUFMLENBQVFlLElBQVIsQ0FBYXlCLEVBQWI7QUFDQSxPQUFJK0YsTUFBTS9GLEdBQUdhLEdBQUgsQ0FBT3JFLENBQVAsQ0FBU3hELElBQVQsQ0FBY3dELENBQXhCO0FBQUEsT0FBMkJxTyxNQUFNOUUsSUFBSThFLEdBQUosS0FBWTlFLElBQUk4RSxHQUFKLEdBQVUsRUFBdEIsQ0FBakM7QUFDQSxPQUFHN0ssR0FBRzZLLEdBQUgsSUFBVSxNQUFNQSxJQUFJVCxLQUF2QixFQUE2QjtBQUFFO0FBQVEsSUFIZCxDQUdlO0FBQ3hDcFYsYUFBVTZGLEtBQUtDLFNBQUwsQ0FBZWtGLEVBQWYsQ0FBVjtBQUNBO0FBQ0EsT0FBRytGLElBQUkrRSxNQUFQLEVBQWM7QUFDYi9FLFFBQUkrRSxNQUFKLENBQVd0VixJQUFYLENBQWdCUixPQUFoQjtBQUNBO0FBQ0E7QUFDRCtRLE9BQUkrRSxNQUFKLEdBQWEsRUFBYjtBQUNBeEosZ0JBQWFJLElBQWI7QUFDQUEsVUFBT0gsV0FBVyxZQUFVO0FBQzNCLFFBQUcsQ0FBQ3dFLElBQUkrRSxNQUFSLEVBQWU7QUFBRTtBQUFRO0FBQ3pCLFFBQUlqTCxNQUFNa0csSUFBSStFLE1BQWQ7QUFDQS9FLFFBQUkrRSxNQUFKLEdBQWEsSUFBYjtBQUNBLFFBQUlqTCxJQUFJdkssTUFBUixFQUFpQjtBQUNoQk4sZUFBVTZGLEtBQUtDLFNBQUwsQ0FBZStFLEdBQWYsQ0FBVjtBQUNBVyxTQUFJL0UsR0FBSixDQUFRdEYsR0FBUixDQUFZNFAsSUFBSTdHLEdBQUosQ0FBUTRILEtBQXBCLEVBQTJCaUUsSUFBM0IsRUFBaUNoRixHQUFqQztBQUNBO0FBQ0QsSUFSTSxFQVFMLENBUkssQ0FBUDtBQVNBOEUsT0FBSVQsS0FBSixHQUFZLENBQVo7QUFDQTVKLE9BQUkvRSxHQUFKLENBQVF0RixHQUFSLENBQVk0UCxJQUFJN0csR0FBSixDQUFRNEgsS0FBcEIsRUFBMkJpRSxJQUEzQixFQUFpQ2hGLEdBQWpDO0FBQ0EsR0F2QkQ7O0FBeUJBLFdBQVNnRixJQUFULENBQWNDLElBQWQsRUFBbUI7QUFDbEIsT0FBSUMsTUFBTWpXLE9BQVY7QUFBQSxPQUFtQitRLE1BQU0sSUFBekI7QUFDQSxPQUFJbUYsT0FBT0YsS0FBS0UsSUFBTCxJQUFhQyxLQUFLSCxJQUFMLEVBQVdqRixHQUFYLENBQXhCO0FBQ0EsT0FBR0EsSUFBSThFLEdBQVAsRUFBVztBQUFFOUUsUUFBSThFLEdBQUosQ0FBUVQsS0FBUjtBQUFpQjtBQUM5QixPQUFHLENBQUNjLElBQUosRUFBUztBQUFFO0FBQVE7QUFDbkIsT0FBR0EsS0FBS0UsVUFBTCxLQUFvQkYsS0FBS0csSUFBNUIsRUFBaUM7QUFDaENILFNBQUtILElBQUwsQ0FBVUUsR0FBVjtBQUNBO0FBQ0E7QUFDRCxJQUFDRCxLQUFLcEwsS0FBTCxHQUFhb0wsS0FBS3BMLEtBQUwsSUFBYyxFQUE1QixFQUFnQ3BLLElBQWhDLENBQXFDeVYsR0FBckM7QUFDQTs7QUFFRCxXQUFTSyxPQUFULENBQWlCTCxHQUFqQixFQUFzQkQsSUFBdEIsRUFBNEJqRixHQUE1QixFQUFnQztBQUMvQixPQUFHLENBQUNBLEdBQUQsSUFBUSxDQUFDa0YsR0FBWixFQUFnQjtBQUFFO0FBQVE7QUFDMUIsT0FBRztBQUFDQSxVQUFNcFEsS0FBS3dDLEtBQUwsQ0FBVzROLElBQUlsVSxJQUFKLElBQVlrVSxHQUF2QixDQUFOO0FBQ0gsSUFERCxDQUNDLE9BQU0zTixDQUFOLEVBQVEsQ0FBRTtBQUNYLE9BQUcyTixlQUFlaFAsS0FBbEIsRUFBd0I7QUFDdkIsUUFBSTVHLElBQUksQ0FBUjtBQUFBLFFBQVd3RyxDQUFYO0FBQ0EsV0FBTUEsSUFBSW9QLElBQUk1VixHQUFKLENBQVYsRUFBbUI7QUFDbEJpVyxhQUFRelAsQ0FBUixFQUFXbVAsSUFBWCxFQUFpQmpGLEdBQWpCO0FBQ0E7QUFDRDtBQUNBO0FBQ0Q7QUFDQSxPQUFHQSxJQUFJOEUsR0FBSixJQUFXLE1BQU05RSxJQUFJOEUsR0FBSixDQUFRVCxLQUE1QixFQUFrQztBQUFFLEtBQUNhLElBQUlNLElBQUosSUFBWU4sR0FBYixFQUFrQkosR0FBbEIsR0FBd0IxQyxJQUF4QjtBQUE4QixJQVpuQyxDQVlvQztBQUNuRXBDLE9BQUlsRixHQUFKLENBQVEvQixFQUFSLENBQVcsSUFBWCxFQUFpQm1NLElBQUlNLElBQUosSUFBWU4sR0FBN0I7QUFDQTs7QUFFRCxXQUFTRSxJQUFULENBQWNILElBQWQsRUFBb0I5TixFQUFwQixFQUF1QjtBQUN0QixPQUFHLENBQUM4TixJQUFELElBQVMsQ0FBQ0EsS0FBS2pFLEdBQWxCLEVBQXNCO0FBQUU7QUFBUTtBQUNoQyxPQUFJQSxNQUFNaUUsS0FBS2pFLEdBQUwsQ0FBU3BOLE9BQVQsQ0FBaUIsTUFBakIsRUFBeUIsSUFBekIsQ0FBVjtBQUNBLE9BQUl1UixPQUFPRixLQUFLRSxJQUFMLEdBQVksSUFBSVIsU0FBSixDQUFjM0QsR0FBZCxFQUFtQjdKLEdBQUdnQyxHQUFILENBQU84SCxHQUFQLENBQVdDLFNBQTlCLEVBQXlDL0osR0FBR2dDLEdBQUgsQ0FBTzhILEdBQWhELENBQXZCO0FBQ0FrRSxRQUFLTSxPQUFMLEdBQWUsWUFBVTtBQUN4QkMsY0FBVVQsSUFBVixFQUFnQjlOLEVBQWhCO0FBQ0EsSUFGRDtBQUdBZ08sUUFBS1EsT0FBTCxHQUFlLFVBQVN0VSxLQUFULEVBQWU7QUFDN0JxVSxjQUFVVCxJQUFWLEVBQWdCOU4sRUFBaEI7QUFDQSxRQUFHLENBQUM5RixLQUFKLEVBQVU7QUFBRTtBQUFRO0FBQ3BCLFFBQUdBLE1BQU11VSxJQUFOLEtBQWUsY0FBbEIsRUFBaUM7QUFDaEM7QUFDQTtBQUNELElBTkQ7QUFPQVQsUUFBS1UsTUFBTCxHQUFjLFlBQVU7QUFDdkIsUUFBSWhNLFFBQVFvTCxLQUFLcEwsS0FBakI7QUFDQW9MLFNBQUtwTCxLQUFMLEdBQWEsRUFBYjtBQUNBWSxRQUFJL0UsR0FBSixDQUFRdEYsR0FBUixDQUFZeUosS0FBWixFQUFtQixVQUFTcUwsR0FBVCxFQUFhO0FBQy9CalcsZUFBVWlXLEdBQVY7QUFDQUYsVUFBS2xPLElBQUwsQ0FBVUssRUFBVixFQUFjOE4sSUFBZDtBQUNBLEtBSEQ7QUFJQSxJQVBEO0FBUUFFLFFBQUtXLFNBQUwsR0FBaUIsVUFBU1osR0FBVCxFQUFhO0FBQzdCSyxZQUFRTCxHQUFSLEVBQWFELElBQWIsRUFBbUI5TixFQUFuQjtBQUNBLElBRkQ7QUFHQSxVQUFPZ08sSUFBUDtBQUNBOztBQUVELFdBQVNPLFNBQVQsQ0FBbUJULElBQW5CLEVBQXlCOU4sRUFBekIsRUFBNEI7QUFDM0JvRSxnQkFBYTBKLEtBQUsvSSxLQUFsQjtBQUNBK0ksUUFBSy9JLEtBQUwsR0FBYVYsV0FBVyxZQUFVO0FBQ2pDNEosU0FBS0gsSUFBTCxFQUFXOU4sRUFBWDtBQUNBLElBRlksRUFFVixJQUFJLElBRk0sQ0FBYjtBQUdBO0FBQ0QsRUF6R0EsRUF5R0UvRCxPQXpHRixFQXlHVyxvQkF6R1g7QUEyR0QsQ0Fqb0VDLEdBQUQsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FEOzs7Ozs7O0FBT0E7OztJQUdhMlMsVyxXQUFBQSxXOzs7Ozs7Ozs7Ozs7O0FBRVQ7Ozs7d0NBSWdCeEIsTSxFQUFRO0FBQUE7O0FBRXBCLGdCQUFNeUIsVUFBVXpCLFVBQVUsT0FBMUI7O0FBRUEsaUJBQUswQixZQUFMLEdBQW9CLElBQXBCO0FBQ0EsaUJBQUtDLFFBQUwsR0FBZ0IsSUFBaEI7O0FBRUE7QUFDQSxpQkFBS3JVLE9BQUwsR0FBZTtBQUNYLDZCQUFjLEtBQUtzVSxZQUFMLENBQWtCLFdBQWxCLEtBQWtDLE1BRHJDO0FBRVgsOEJBQWUsS0FBS0EsWUFBTCxDQUFrQixRQUFsQixLQUErQixNQUZuQztBQUdYLDJCQUFZLEtBQUtBLFlBQUwsQ0FBa0IsU0FBbEIsS0FBZ0M7QUFIakMsYUFBZjs7QUFNQTtBQUNBLGdCQUFJLEtBQUt0VSxPQUFMLENBQWF1VSxPQUFiLEtBQXlCLElBQTdCLEVBQW1DO0FBQy9CO0FBQ0Esb0JBQUlDLFdBQVcsSUFBZjtBQUNBLHVCQUFPQSxTQUFTQyxVQUFoQixFQUE0QjtBQUN4QkQsK0JBQVdBLFNBQVNDLFVBQXBCO0FBQ0Esd0JBQUlELFNBQVNFLFFBQVQsQ0FBa0IzUSxXQUFsQixNQUFtQ29RLFVBQVUsU0FBakQsRUFBNEQ7QUFDeEQsNEJBQU16SixVQUFVOEosU0FBUzlKLE9BQVQsRUFBaEI7QUFDQSw2QkFBSzJKLFFBQUwsR0FBZ0IzSixRQUFRaUssS0FBeEI7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNELGlCQUFLQyxNQUFMLEdBQWMsRUFBZDtBQUNBLGdCQUFNQyxZQUFZLEtBQUtDLFFBQXZCO0FBQ0EsaUJBQUssSUFBSXJYLElBQUksQ0FBYixFQUFnQkEsSUFBSW9YLFVBQVVuWCxNQUE5QixFQUFzQ0QsR0FBdEMsRUFBMkM7QUFDdkMsb0JBQU1zWCxTQUFTRixVQUFVcFgsQ0FBVixDQUFmO0FBQ0Esb0JBQUlrRSxPQUFPb1QsT0FBT1QsWUFBUCxDQUFvQixNQUFwQixDQUFYO0FBQ0Esd0JBQVFTLE9BQU9MLFFBQVAsQ0FBZ0IzUSxXQUFoQixFQUFSO0FBQ0kseUJBQUtvUSxVQUFVLFVBQWY7QUFDSXhTLCtCQUFPLEdBQVA7QUFDQTtBQUNKLHlCQUFLd1MsVUFBVSxRQUFmO0FBQ0l4UywrQkFBUSxLQUFLMFMsUUFBTCxLQUFrQixJQUFuQixHQUEyQixLQUFLQSxRQUFMLEdBQWdCMVMsSUFBM0MsR0FBa0RBLElBQXpEO0FBQ0E7QUFOUjtBQVFBLG9CQUFJQSxTQUFTLElBQWIsRUFBbUI7QUFDZix3QkFBSXFULFlBQVksSUFBaEI7QUFDQSx3QkFBSUQsT0FBT0UsU0FBWCxFQUFzQjtBQUNsQkQsb0NBQVksTUFBTWIsT0FBTixHQUFnQixTQUFoQixHQUE0QlksT0FBT0UsU0FBbkMsR0FBK0MsSUFBL0MsR0FBc0RkLE9BQXRELEdBQWdFLFNBQTVFO0FBQ0g7QUFDRCx5QkFBS1MsTUFBTCxDQUFZalQsSUFBWixJQUFvQjtBQUNoQixxQ0FBYW9ULE9BQU9ULFlBQVAsQ0FBb0IsV0FBcEIsQ0FERztBQUVoQixvQ0FBWVU7QUFGSSxxQkFBcEI7QUFJSDtBQUNKOztBQUVEO0FBQ0EsaUJBQUtDLFNBQUwsR0FBaUIsRUFBakI7O0FBRUEsZ0JBQUksS0FBS2pWLE9BQUwsQ0FBYWtWLFVBQWIsS0FBNEIsSUFBaEMsRUFBc0M7QUFDbEMscUJBQUtDLGdCQUFMO0FBQ0EscUJBQUsvVCxJQUFMLEdBQVksS0FBSzhULFVBQWpCO0FBQ0gsYUFIRCxNQUdPO0FBQ0gscUJBQUs5VCxJQUFMLEdBQVksSUFBWjtBQUNIO0FBQ0QsZ0JBQUksS0FBS3BCLE9BQUwsQ0FBYW9WLFNBQWIsS0FBMkIsSUFBL0IsRUFBcUM7QUFDakMscUJBQUtDLGFBQUw7QUFDSDtBQUNELGlCQUFLQyxNQUFMO0FBQ0FwQix3QkFBWXFCLFVBQVosQ0FBdUIsVUFBQ0MsTUFBRCxFQUFZO0FBQy9CLG9CQUFJLE9BQUt4VixPQUFMLENBQWFvVixTQUFiLEtBQTJCLElBQS9CLEVBQXFDO0FBQ2pDLHdCQUFJSSxXQUFXLElBQWYsRUFBcUI7QUFDakIsK0JBQUtDLFNBQUwsQ0FBZUMsR0FBZixDQUFtQixVQUFuQjtBQUNILHFCQUZELE1BRU87QUFDSCwrQkFBS0QsU0FBTCxDQUFlRSxNQUFmLENBQXNCLFVBQXRCO0FBQ0g7QUFDSjtBQUNELHVCQUFLTCxNQUFMO0FBQ0gsYUFURDtBQVdIOztBQUVEOzs7Ozs7d0NBR2dCO0FBQUE7O0FBQ1osZ0JBQU1NLFdBQVcsSUFBSUMsZ0JBQUosQ0FBcUIsVUFBQ0MsU0FBRCxFQUFlO0FBQ2pELG9CQUFJeEssT0FBT3dLLFVBQVUsQ0FBVixFQUFhQyxVQUFiLENBQXdCLENBQXhCLENBQVg7QUFDQSxvQkFBSXpLLFNBQVNYLFNBQWIsRUFBd0I7QUFDcEIsd0JBQU1xTCxnQkFBZ0IsT0FBS0MsZ0JBQUwsQ0FBc0IzSyxJQUF0QixDQUF0QjtBQUNBQSx5QkFBS21LLFNBQUwsQ0FBZUMsR0FBZixDQUFtQixlQUFuQjtBQUNBcEsseUJBQUttSyxTQUFMLENBQWVDLEdBQWYsQ0FBbUIsT0FBbkI7QUFDQS9MLCtCQUFXLFlBQU07QUFDYiw0QkFBSXFNLGNBQWN0WSxNQUFkLEdBQXVCLENBQTNCLEVBQThCO0FBQzFCc1ksMENBQWNFLE9BQWQsQ0FBc0IsVUFBQ0MsS0FBRCxFQUFXO0FBQzdCQSxzQ0FBTVYsU0FBTixDQUFnQkMsR0FBaEIsQ0FBb0IsTUFBcEI7QUFDQS9MLDJDQUFXLFlBQU07QUFDYndNLDBDQUFNVixTQUFOLENBQWdCQyxHQUFoQixDQUFvQixVQUFwQjtBQUNILGlDQUZELEVBRUcsRUFGSDtBQUdILDZCQUxEO0FBTUg7QUFDRC9MLG1DQUFXLFlBQU07QUFDYjJCLGlDQUFLbUssU0FBTCxDQUFlQyxHQUFmLENBQW1CLFVBQW5CO0FBQ0gseUJBRkQsRUFFRyxFQUZIO0FBR0gscUJBWkQsRUFZRyxFQVpIO0FBYUEsd0JBQU1VLGVBQWUsU0FBZkEsWUFBZSxDQUFDek4sS0FBRCxFQUFXO0FBQzVCLDRCQUFJQSxNQUFNME4sTUFBTixDQUFhQyxTQUFiLENBQXVCcFMsT0FBdkIsQ0FBK0IsTUFBL0IsSUFBeUMsQ0FBQyxDQUE5QyxFQUFpRDtBQUM3QyxtQ0FBSzlDLElBQUwsQ0FBVW1WLFdBQVYsQ0FBc0I1TixNQUFNME4sTUFBNUI7QUFDSDtBQUNKLHFCQUpEO0FBS0EvSyx5QkFBS2tMLGdCQUFMLENBQXNCLGVBQXRCLEVBQXVDSixZQUF2QztBQUNBOUsseUJBQUtrTCxnQkFBTCxDQUFzQixjQUF0QixFQUFzQ0osWUFBdEM7QUFDSDtBQUNKLGFBM0JnQixDQUFqQjtBQTRCQVIscUJBQVNhLE9BQVQsQ0FBaUIsSUFBakIsRUFBdUIsRUFBQ0MsV0FBVyxJQUFaLEVBQXZCO0FBQ0g7O0FBRUQ7Ozs7Ozs7a0NBSVU7QUFDTixnQkFBTS9VLE9BQU91UyxZQUFZeUMsY0FBWixFQUFiO0FBQ0EsaUJBQUssSUFBTWhDLEtBQVgsSUFBb0IsS0FBS0MsTUFBekIsRUFBaUM7QUFDN0Isb0JBQUlELFVBQVUsR0FBZCxFQUFtQjtBQUNmLHdCQUFJaUMsY0FBYyxNQUFNakMsTUFBTTVTLE9BQU4sQ0FBYyxXQUFkLEVBQTJCLFdBQTNCLENBQXhCO0FBQ0E2VSxtQ0FBZ0JBLFlBQVkxUyxPQUFaLENBQW9CLE1BQXBCLElBQThCLENBQUMsQ0FBaEMsR0FBcUMsRUFBckMsR0FBMEMsU0FBUyxtQkFBbEU7QUFDQSx3QkFBTTJTLFFBQVEsSUFBSUMsTUFBSixDQUFXRixXQUFYLENBQWQ7QUFDQSx3QkFBSUMsTUFBTUUsSUFBTixDQUFXcFYsSUFBWCxDQUFKLEVBQXNCO0FBQ2xCLCtCQUFPcVYsYUFBYSxLQUFLcEMsTUFBTCxDQUFZRCxLQUFaLENBQWIsRUFBaUNBLEtBQWpDLEVBQXdDa0MsS0FBeEMsRUFBK0NsVixJQUEvQyxDQUFQO0FBQ0g7QUFDSjtBQUNKO0FBQ0QsbUJBQVEsS0FBS2lULE1BQUwsQ0FBWSxHQUFaLE1BQXFCakssU0FBdEIsR0FBbUNxTSxhQUFhLEtBQUtwQyxNQUFMLENBQVksR0FBWixDQUFiLEVBQStCLEdBQS9CLEVBQW9DLElBQXBDLEVBQTBDalQsSUFBMUMsQ0FBbkMsR0FBcUYsSUFBNUY7QUFDSDs7QUFFRDs7Ozs7O2lDQUdTO0FBQ0wsZ0JBQU16QyxTQUFTLEtBQUt3TCxPQUFMLEVBQWY7QUFDQSxnQkFBSXhMLFdBQVcsSUFBZixFQUFxQjtBQUNqQixvQkFBSUEsT0FBT3lDLElBQVAsS0FBZ0IsS0FBS3lTLFlBQXJCLElBQXFDLEtBQUtwVSxPQUFMLENBQWFvVixTQUFiLEtBQTJCLElBQXBFLEVBQTBFO0FBQ3RFLHdCQUFJLEtBQUtwVixPQUFMLENBQWFvVixTQUFiLEtBQTJCLElBQS9CLEVBQXFDO0FBQ2pDLDZCQUFLaFUsSUFBTCxDQUFVNlQsU0FBVixHQUFzQixFQUF0QjtBQUNIO0FBQ0Qsd0JBQUkvVixPQUFPK1gsU0FBUCxLQUFxQixJQUF6QixFQUErQjtBQUMzQiw0QkFBSUMsYUFBYUMsU0FBU0MsYUFBVCxDQUF1QmxZLE9BQU8rWCxTQUE5QixDQUFqQjtBQUNBLDZCQUFLLElBQUlsYSxHQUFULElBQWdCbUMsT0FBT21ZLE1BQXZCLEVBQStCO0FBQzNCLGdDQUFJcEosUUFBUS9PLE9BQU9tWSxNQUFQLENBQWN0YSxHQUFkLENBQVo7QUFDQSxnQ0FBSSxPQUFPa1IsS0FBUCxJQUFnQixRQUFwQixFQUE4QjtBQUMxQixvQ0FBSTtBQUNBQSw0Q0FBUWhMLEtBQUt3QyxLQUFMLENBQVd3SSxLQUFYLENBQVI7QUFDSCxpQ0FGRCxDQUVFLE9BQU92SSxDQUFQLEVBQVU7QUFDUnhILDRDQUFRc0IsS0FBUixDQUFjLDZCQUFkLEVBQTZDa0csQ0FBN0M7QUFDSDtBQUNKO0FBQ0R3Uix1Q0FBV0ksWUFBWCxDQUF3QnZhLEdBQXhCLEVBQTZCa1IsS0FBN0I7QUFDSDtBQUNELDZCQUFLN00sSUFBTCxDQUFVbVcsV0FBVixDQUFzQkwsVUFBdEI7QUFDSCxxQkFkRCxNQWNPO0FBQ0gsNEJBQUlsQyxZQUFZOVYsT0FBT3NZLFFBQXZCO0FBQ0E7QUFDQSw0QkFBSXhDLFVBQVU5USxPQUFWLENBQWtCLElBQWxCLElBQTBCLENBQUMsQ0FBL0IsRUFBa0M7QUFDOUI4USx3Q0FBWUEsVUFBVWpULE9BQVYsQ0FBa0IsZUFBbEIsRUFDUixVQUFVMFYsQ0FBVixFQUFhbFYsQ0FBYixFQUFnQjtBQUNaLG9DQUFJcUIsSUFBSTFFLE9BQU9tWSxNQUFQLENBQWM5VSxDQUFkLENBQVI7QUFDQSx1Q0FBTyxPQUFPcUIsQ0FBUCxLQUFhLFFBQWIsSUFBeUIsT0FBT0EsQ0FBUCxLQUFhLFFBQXRDLEdBQWlEQSxDQUFqRCxHQUFxRDZULENBQTVEO0FBQ0gsNkJBSk8sQ0FBWjtBQU1IO0FBQ0QsNkJBQUtyVyxJQUFMLENBQVU2VCxTQUFWLEdBQXNCRCxTQUF0QjtBQUNIO0FBQ0QseUJBQUtaLFlBQUwsR0FBb0JsVixPQUFPeUMsSUFBM0I7QUFDSDtBQUNKO0FBQ0o7O0FBR0Q7Ozs7Ozs7O3lDQUtpQjJKLEksRUFBTTtBQUNuQixnQkFBTXdKLFdBQVcsS0FBSzFULElBQUwsQ0FBVTBULFFBQTNCO0FBQ0EsZ0JBQUk0QyxVQUFVLEVBQWQ7QUFDQSxpQkFBSyxJQUFJamEsSUFBSSxDQUFiLEVBQWdCQSxJQUFJcVgsU0FBU3BYLE1BQTdCLEVBQXFDRCxHQUFyQyxFQUEwQztBQUN0QyxvQkFBSTBZLFFBQVFyQixTQUFTclgsQ0FBVCxDQUFaO0FBQ0Esb0JBQUkwWSxTQUFTN0ssSUFBYixFQUFtQjtBQUNmb00sNEJBQVE5WixJQUFSLENBQWF1WSxLQUFiO0FBQ0g7QUFDSjtBQUNELG1CQUFPdUIsT0FBUDtBQUNIOzs7OztBQUdEOzs7Ozt5Q0FLd0J2SSxHLEVBQUs7QUFDekIsZ0JBQUlqUSxTQUFTLEVBQWI7QUFDQSxnQkFBSWlRLFFBQVF4RSxTQUFaLEVBQXVCO0FBQ25CLG9CQUFJZ04sY0FBZXhJLElBQUlqTCxPQUFKLENBQVksR0FBWixJQUFtQixDQUFDLENBQXJCLEdBQTBCaUwsSUFBSXlJLE1BQUosQ0FBV3pJLElBQUlqTCxPQUFKLENBQVksR0FBWixJQUFtQixDQUE5QixFQUFpQ2lMLElBQUl6UixNQUFyQyxDQUExQixHQUF5RSxJQUEzRjtBQUNBLG9CQUFJaWEsZ0JBQWdCLElBQXBCLEVBQTBCO0FBQ3RCQSxnQ0FBWTlWLEtBQVosQ0FBa0IsR0FBbEIsRUFBdUJxVSxPQUF2QixDQUErQixVQUFVMkIsSUFBVixFQUFnQjtBQUMzQyw0QkFBSSxDQUFDQSxJQUFMLEVBQVc7QUFDWEEsK0JBQU9BLEtBQUs5VixPQUFMLENBQWEsR0FBYixFQUFrQixHQUFsQixDQUFQO0FBQ0EsNEJBQUkrVixLQUFLRCxLQUFLM1QsT0FBTCxDQUFhLEdBQWIsQ0FBVDtBQUNBLDRCQUFJbkgsTUFBTSthLEtBQUssQ0FBQyxDQUFOLEdBQVVELEtBQUtELE1BQUwsQ0FBWSxDQUFaLEVBQWVFLEVBQWYsQ0FBVixHQUErQkQsSUFBekM7QUFDQSw0QkFBSTFMLE1BQU0yTCxLQUFLLENBQUMsQ0FBTixHQUFVQyxtQkFBbUJGLEtBQUtELE1BQUwsQ0FBWUUsS0FBSyxDQUFqQixDQUFuQixDQUFWLEdBQW9ELEVBQTlEO0FBQ0EsNEJBQUlqUyxPQUFPOUksSUFBSW1ILE9BQUosQ0FBWSxHQUFaLENBQVg7QUFDQSw0QkFBSTJCLFFBQVEsQ0FBQyxDQUFiLEVBQWdCM0csT0FBTzZZLG1CQUFtQmhiLEdBQW5CLENBQVAsSUFBa0NvUCxHQUFsQyxDQUFoQixLQUNLO0FBQ0QsZ0NBQUl2RyxLQUFLN0ksSUFBSW1ILE9BQUosQ0FBWSxHQUFaLENBQVQ7QUFDQSxnQ0FBSVksUUFBUWlULG1CQUFtQmhiLElBQUlpYixTQUFKLENBQWNuUyxPQUFPLENBQXJCLEVBQXdCRCxFQUF4QixDQUFuQixDQUFaO0FBQ0E3SSxrQ0FBTWdiLG1CQUFtQmhiLElBQUlpYixTQUFKLENBQWMsQ0FBZCxFQUFpQm5TLElBQWpCLENBQW5CLENBQU47QUFDQSxnQ0FBSSxDQUFDM0csT0FBT25DLEdBQVAsQ0FBTCxFQUFrQm1DLE9BQU9uQyxHQUFQLElBQWMsRUFBZDtBQUNsQixnQ0FBSSxDQUFDK0gsS0FBTCxFQUFZNUYsT0FBT25DLEdBQVAsRUFBWWEsSUFBWixDQUFpQnVPLEdBQWpCLEVBQVosS0FDS2pOLE9BQU9uQyxHQUFQLEVBQVkrSCxLQUFaLElBQXFCcUgsR0FBckI7QUFDUjtBQUNKLHFCQWhCRDtBQWlCSDtBQUNKO0FBQ0QsbUJBQU9qTixNQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7O21DQUtrQitZLEssRUFBTztBQUNyQjs7O0FBR0EsZ0JBQUk7QUFDQSxvQkFBSUMsT0FBT0QsTUFBTW5XLFFBQU4sR0FBaUI0QixLQUFqQixDQUF1Qix1QkFBdkIsRUFBZ0QsQ0FBaEQsRUFBbUQzQixPQUFuRCxDQUEyRCxNQUEzRCxFQUFtRSxHQUFuRSxFQUF3RUEsT0FBeEUsQ0FBZ0Ysc0JBQWhGLEVBQXdHLE9BQXhHLEVBQWlIZ0MsV0FBakgsRUFBWDtBQUNILGFBRkQsQ0FFRSxPQUFPMkIsQ0FBUCxFQUFVO0FBQ1Isc0JBQU0sSUFBSTVHLEtBQUosQ0FBVSw0QkFBVixFQUF3QzRHLENBQXhDLENBQU47QUFDSDtBQUNELGdCQUFJd08sWUFBWWlFLGVBQVosQ0FBNEJELElBQTVCLE1BQXNDLEtBQTFDLEVBQWlEO0FBQzdDLHNCQUFNLElBQUlwWixLQUFKLENBQVUsMkNBQVYsQ0FBTjtBQUNIO0FBQ0QsbUJBQU9vWixJQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7OzRDQUsyQkEsSSxFQUFNO0FBQzdCLG1CQUFPZixTQUFTQyxhQUFULENBQXVCYyxJQUF2QixFQUE2QmxULFdBQTdCLEtBQTZDb1QsV0FBcEQ7QUFDSDs7QUFFRDs7Ozs7Ozs7c0NBS3FCSCxLLEVBQU87QUFDeEIsZ0JBQU1DLE9BQU9oRSxZQUFZbUUsVUFBWixDQUF1QkosS0FBdkIsQ0FBYjtBQUNBLGdCQUFJL0QsWUFBWW9FLG1CQUFaLENBQWdDSixJQUFoQyxNQUEwQyxLQUE5QyxFQUFxRDtBQUNqREQsc0JBQU0xVCxTQUFOLENBQWdCMlQsSUFBaEIsR0FBdUJBLElBQXZCO0FBQ0FmLHlCQUFTb0IsZUFBVCxDQUF5QkwsSUFBekIsRUFBK0JELEtBQS9CO0FBQ0g7QUFDRCxtQkFBT0MsSUFBUDtBQUNIOztBQUVEOzs7Ozs7Ozt3Q0FLdUJ4UixHLEVBQUs7QUFDeEIsbUJBQU8saUJBQWdCcVEsSUFBaEIsQ0FBcUJyUSxHQUFyQjtBQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7bUNBSWtCOFIsUSxFQUFVO0FBQ3hCLGdCQUFJdEUsWUFBWXVFLGVBQVosS0FBZ0M5TixTQUFwQyxFQUErQztBQUMzQ3VKLDRCQUFZdUUsZUFBWixHQUE4QixFQUE5QjtBQUNIO0FBQ0R2RSx3QkFBWXVFLGVBQVosQ0FBNEI3YSxJQUE1QixDQUFpQzRhLFFBQWpDO0FBQ0EsZ0JBQU1FLGdCQUFnQixTQUFoQkEsYUFBZ0IsR0FBTTtBQUN4Qjs7O0FBR0Esb0JBQUlyWCxPQUFPc1gsUUFBUCxDQUFnQkMsSUFBaEIsSUFBd0IxRSxZQUFZMkUsTUFBeEMsRUFBZ0Q7QUFDNUMzRSxnQ0FBWXVFLGVBQVosQ0FBNEJ2QyxPQUE1QixDQUFvQyxVQUFTc0MsUUFBVCxFQUFrQjtBQUNsREEsaUNBQVN0RSxZQUFZc0IsTUFBckI7QUFDSCxxQkFGRDtBQUdBdEIsZ0NBQVlzQixNQUFaLEdBQXFCLEtBQXJCO0FBQ0g7QUFDRHRCLDRCQUFZMkUsTUFBWixHQUFxQnhYLE9BQU9zWCxRQUFQLENBQWdCQyxJQUFyQztBQUNILGFBWEQ7QUFZQSxnQkFBSXZYLE9BQU95WCxZQUFQLEtBQXdCLElBQTVCLEVBQWtDO0FBQzlCelgsdUJBQU9tVixnQkFBUCxDQUF3QixTQUF4QixFQUFtQyxZQUFVO0FBQ3pDdEMsZ0NBQVlzQixNQUFaLEdBQXFCLElBQXJCO0FBQ0gsaUJBRkQ7QUFHSDtBQUNEblUsbUJBQU95WCxZQUFQLEdBQXNCSixhQUF0QjtBQUNIOztBQUVEOzs7Ozs7Ozs7O3lDQU93QjdCLEssRUFBT2xDLEssRUFBT2hULEksRUFBTTtBQUN4QyxnQkFBSXpDLFNBQVNnVixZQUFZNkUsZ0JBQVosQ0FBNkJwWCxJQUE3QixDQUFiO0FBQ0EsZ0JBQUlxWCxLQUFLLFVBQVQ7QUFDQSxnQkFBSXRCLFVBQVUsRUFBZDtBQUNBLGdCQUFJaFUsY0FBSjtBQUNBLG1CQUFPQSxRQUFRc1YsR0FBR0MsSUFBSCxDQUFRdEUsS0FBUixDQUFmLEVBQStCO0FBQzNCK0Msd0JBQVE5WixJQUFSLENBQWE4RixNQUFNLENBQU4sQ0FBYjtBQUNIO0FBQ0QsZ0JBQUltVCxVQUFVLElBQWQsRUFBb0I7QUFDaEIsb0JBQUlxQyxXQUFXckMsTUFBTW9DLElBQU4sQ0FBV3RYLElBQVgsQ0FBZjtBQUNBK1Ysd0JBQVF4QixPQUFSLENBQWdCLFVBQVU5RCxJQUFWLEVBQWdCN1IsR0FBaEIsRUFBcUI7QUFDakNyQiwyQkFBT2tULElBQVAsSUFBZThHLFNBQVMzWSxNQUFNLENBQWYsQ0FBZjtBQUNILGlCQUZEO0FBR0g7QUFDRCxtQkFBT3JCLE1BQVA7QUFDSDs7QUFFRDs7Ozs7Ozt5Q0FJd0I7QUFDcEIsZ0JBQUlBLFNBQVNtQyxPQUFPc1gsUUFBUCxDQUFnQkMsSUFBaEIsQ0FBcUJsVixLQUFyQixDQUEyQixRQUEzQixDQUFiO0FBQ0EsZ0JBQUl4RSxXQUFXLElBQWYsRUFBcUI7QUFDakIsdUJBQU9BLE9BQU8sQ0FBUCxDQUFQO0FBQ0g7QUFDSjs7OztFQXpWNEJrWixXOztBQTRWakNqQixTQUFTb0IsZUFBVCxDQUF5QixjQUF6QixFQUF5Q3JFLFdBQXpDOztBQUVBOzs7O0lBR2FpRixVLFdBQUFBLFU7Ozs7Ozs7Ozs7RUFBbUJmLFc7O0FBR2hDakIsU0FBU29CLGVBQVQsQ0FBeUIsYUFBekIsRUFBd0NZLFVBQXhDOztBQUVBOzs7O0lBR01DLFk7Ozs7Ozs7Ozs7RUFBcUJoQixXOztBQUczQmpCLFNBQVNvQixlQUFULENBQXlCLGVBQXpCLEVBQTBDYSxZQUExQzs7QUFHQTs7OztJQUdNQyxVOzs7Ozs7Ozs7OzsyQ0FDaUI7QUFBQTs7QUFDZixpQkFBSzdDLGdCQUFMLENBQXNCLE9BQXRCLEVBQStCLFVBQUM3TixLQUFELEVBQVc7QUFDdEMsb0JBQU1oSCxPQUFPLE9BQUsyUyxZQUFMLENBQWtCLE1BQWxCLENBQWI7QUFDQTNMLHNCQUFNMlEsY0FBTjtBQUNBLG9CQUFJM1gsU0FBU2dKLFNBQWIsRUFBd0I7QUFDcEJ0SiwyQkFBT2tZLGFBQVAsQ0FBcUIsSUFBSUMsV0FBSixDQUFnQixTQUFoQixDQUFyQjtBQUNIO0FBQ0RuWSx1QkFBT3NYLFFBQVAsQ0FBZ0JjLElBQWhCLEdBQXVCOVgsSUFBdkI7QUFDSCxhQVBEO0FBUUg7Ozs7RUFWb0IrWCxpQjtBQVl6Qjs7Ozs7QUFHQXZDLFNBQVNvQixlQUFULENBQXlCLGNBQXpCLEVBQXlDO0FBQ3JDb0IsYUFBUyxHQUQ0QjtBQUVyQ3BWLGVBQVc4VSxXQUFXOVU7QUFGZSxDQUF6Qzs7QUFLQTs7Ozs7Ozs7O0FBU0EsU0FBU3lTLFlBQVQsQ0FBc0JuVCxHQUF0QixFQUEyQjhRLEtBQTNCLEVBQWtDa0MsS0FBbEMsRUFBeUNsVixJQUF6QyxFQUErQztBQUMzQyxRQUFJekMsU0FBUyxFQUFiO0FBQ0EsU0FBSyxJQUFJbkMsR0FBVCxJQUFnQjhHLEdBQWhCLEVBQXFCO0FBQ2pCLFlBQUlBLElBQUl1QixjQUFKLENBQW1CckksR0FBbkIsQ0FBSixFQUE2QjtBQUN6Qm1DLG1CQUFPbkMsR0FBUCxJQUFjOEcsSUFBSTlHLEdBQUosQ0FBZDtBQUNIO0FBQ0o7QUFDRG1DLFdBQU95VixLQUFQLEdBQWVBLEtBQWY7QUFDQXpWLFdBQU95QyxJQUFQLEdBQWNBLElBQWQ7QUFDQXpDLFdBQU9tWSxNQUFQLEdBQWdCbkQsWUFBWTBGLGdCQUFaLENBQTZCL0MsS0FBN0IsRUFBb0NsQyxLQUFwQyxFQUEyQ2hULElBQTNDLENBQWhCO0FBQ0EsV0FBT3pDLE1BQVA7QUFDSCxDOzs7Ozs7O0FDcGFEOztBQUVBO0FBQ0E7QUFDQTs7Ozs7UUFjZ0IyYSxVLEdBQUFBLFU7O0FBWmhCOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBLElBQU14YSxZQUFZLFdBQWxCO0FBQ0EsSUFBTXpDLFlBQVksV0FBbEI7QUFDQSxJQUFNbUIsYUFBYSxZQUFuQjtBQUNBLElBQU1sQixhQUFhLFlBQW5COztBQUVPLFNBQVNnZCxVQUFULENBQW9CdGQsT0FBcEIsRUFBNkI7QUFDaEMsV0FBUSxDQUFDQSxPQUFGLEdBQ1BDLFFBQVFDLE9BQVIsQ0FBZ0IsRUFBaEIsQ0FETyxHQUVQLFVBQUNDLE9BQUQsRUFBYTtBQUNULGVBQVEsQ0FBQ0EsT0FBRixHQUNQRixRQUFRRyxNQUFSLENBQWUsd0JBQWYsQ0FETyxHQUVQLFVBQUNZLFlBQUQsRUFBa0I7QUFDZCxtQkFBTyxVQUFDUyxRQUFELEVBQWM7QUFDakIsdUJBQU8sSUFBSXhCLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVFLE1BQVYsRUFBcUI7QUFDcEMsb0VBQXFCSixPQUFyQixFQUE4QkcsT0FBOUIsRUFDQ1EsSUFERCxDQUNNLHVCQUFlO0FBQ2pCLDRCQUFJc0IsZ0JBQWdCNUIsU0FBcEIsRUFBK0I7QUFDM0JzQixvQ0FBUUMsR0FBUixDQUFZdkIsU0FBWjtBQUNBO0FBQ0EsbUNBQU8sa0RBQXNCTCxPQUF0QixFQUErQkcsT0FBL0IsRUFBd0NhLFlBQXhDLEVBQ05MLElBRE0sQ0FDRDtBQUFBLHVDQUFVZ0MsTUFBVjtBQUFBLDZCQURDLENBQVA7QUFFSDtBQUNELDRCQUFJVixnQkFBZ0JULFVBQXBCLEVBQWdDO0FBQzVCRyxvQ0FBUUMsR0FBUixDQUFZSixVQUFaO0FBQ0E7QUFDQSxtQ0FBTyxvQ0FBZXhCLE9BQWYsRUFBd0JHLE9BQXhCLEVBQWlDYSxZQUFqQztBQUNQO0FBRE8sNkJBRU5MLElBRk0sQ0FFRDtBQUFBLHVDQUFVZ0MsTUFBVjtBQUFBLDZCQUZDLENBQVA7QUFHSDtBQUNELDRCQUFJVixnQkFBZ0JhLFNBQXBCLEVBQStCO0FBQzNCbkIsb0NBQVFDLEdBQVIsQ0FBWWtCLFNBQVo7QUFDQTtBQUNBLG1DQUFPLGtDQUFjOUMsT0FBZCxFQUF1QkcsT0FBdkIsRUFBZ0NhLFlBQWhDLEVBQ05MLElBRE0sQ0FDRDtBQUFBLHVDQUFVZ0MsTUFBVjtBQUFBLDZCQURDLENBQVA7QUFFSDtBQUNELDRCQUFJVixnQkFBZ0IzQixVQUFwQixFQUFnQztBQUM1QnFCLG9DQUFRQyxHQUFSLENBQVl0QixVQUFaO0FBQ0E7QUFDQSxtQ0FBTywwQ0FBa0JILE9BQWxCLEVBQTJCYSxZQUEzQixFQUF5Q1MsUUFBekMsRUFBbUR6QixPQUFuRCxFQUNOVyxJQURNLENBQ0Qsa0JBQVU7QUFDWix1Q0FBT2dDLE1BQVA7QUFDSCw2QkFITSxDQUFQO0FBSUg7QUFDSixxQkE3QkQsRUE4QkNoQyxJQTlCRCxDQThCTSxrQkFBVTtBQUNaVCxnQ0FBUXlDLE1BQVI7QUFDSCxxQkFoQ0QsRUFpQ0NhLEtBakNELENBaUNPLFVBQUMxQyxHQUFEO0FBQUEsK0JBQVNWLE9BQU9VLEdBQVAsQ0FBVDtBQUFBLHFCQWpDUDtBQWtDSCxpQkFuQ00sQ0FBUDtBQW9DSCxhQXJDRDtBQXNDSCxTQXpDRDtBQTBDSCxLQTdDRDtBQThDSCxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqRUQsSUFBSXljLGlCQUFpQixtQkFBQXZZLENBQVEsRUFBUixDQUFyQjs7SUFDYXdZLFcsV0FBQUEsVzs7Ozs7Ozs7Ozs7MkNBQ1U7QUFDZixpQkFBSzlFLFNBQUwsR0FBaUIsUUFBUTZFLGNBQVIsR0FBeUIsTUFBMUM7QUFDSDs7OztFQUg0QjFCLFc7O0FBS2pDakIsU0FBU29CLGVBQVQsQ0FBeUIsY0FBekIsRUFBeUN3QixXQUF6QyxFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOQSxJQUFJQyxpQkFBaUIsbUJBQUF6WSxDQUFRLEVBQVIsQ0FBckI7O0lBQ2EwWSxXLFdBQUFBLFc7Ozs7Ozs7Ozs7OzJDQUNVO0FBQ2YsaUJBQUtoRixTQUFMLEdBQWlCLFFBQVErRSxjQUFSLEdBQXlCLE1BQTFDO0FBQ0g7Ozs7RUFINEI1QixXOztBQUtqQ2pCLFNBQVNvQixlQUFULENBQXlCLGNBQXpCLEVBQXlDMEIsV0FBekMsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTkEsSUFBSUMsbUJBQW1CLG1CQUFBM1ksQ0FBUSxFQUFSLENBQXZCOztJQUVhNFksUSxXQUFBQSxROzs7Ozs7Ozs7OzsyQ0FDVTtBQUNmLGlCQUFLbEYsU0FBTCxHQUFpQixRQUFRaUYsZ0JBQVIsR0FBMkIsTUFBNUM7QUFDSDs7OztFQUh5QjlCLFc7O0FBTTlCakIsU0FBU29CLGVBQVQsQ0FBeUIsV0FBekIsRUFBc0M0QixRQUF0QztBQUNBaEQsU0FBU29CLGVBQVQsQ0FBeUIsY0FBekIsRUFBeUM7QUFDckNoVSxlQUFXUSxPQUFPc0MsTUFBUCxDQUFjK1EsWUFBWTdULFNBQTFCLEVBQXFDLEVBQUU2VixpQkFBaUI7QUFDM0RuTSxtQkFBTyxpQkFBVztBQUNaLG9CQUFJN00sT0FBTyxLQUFLK1QsZ0JBQUwsRUFBWDtBQUNBLG9CQUFJcUMsV0FBV0wsU0FBU2tELGFBQVQsQ0FBdUIsTUFBTSxLQUFLQyxXQUFYLElBQTBCLElBQWpELENBQWY7QUFDQSxvQkFBSUMsUUFBUXBELFNBQVNxRCxVQUFULENBQW9CaEQsU0FBU2piLE9BQTdCLEVBQXNDLElBQXRDLENBQVo7QUFDQSxvQkFBSWtlLGdCQUFpQixLQUFLSixhQUFMLENBQW1CLE1BQW5CLENBQUQsR0FBK0IsS0FBS0EsYUFBTCxDQUFtQixNQUFuQixFQUEyQkssS0FBM0IsQ0FBaUNDLEtBQWhFLEdBQXVFLElBQTNGO0FBQ0Esb0JBQUlGLGFBQUosRUFBbUI7QUFDZkYsMEJBQU1GLGFBQU4sQ0FBb0IsS0FBcEIsRUFBMkJLLEtBQTNCLENBQWlDRSxJQUFqQyxHQUF3QyxLQUFLUCxhQUFMLENBQW1CLE1BQW5CLEVBQTJCSyxLQUEzQixDQUFpQ0MsS0FBekU7QUFDSDtBQUNEdloscUJBQUttVyxXQUFMLENBQWlCZ0QsS0FBakI7QUFDTDtBQVYwRDtBQUFuQixLQUFyQztBQUQwQixDQUF6QyxFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNUQSxJQUFJTSxlQUFlLG1CQUFBdFosQ0FBUSxFQUFSLENBQW5COztJQUNhdVosUyxXQUFBQSxTOzs7Ozs7Ozs7OzsyQ0FDVTtBQUNmLGlCQUFLN0YsU0FBTCxxQkFDSzRGLFlBREw7QUFHSDs7OztFQUwwQnpDLFc7O0FBTy9CakIsU0FBU29CLGVBQVQsQ0FBeUIsWUFBekIsRUFBdUN1QyxTQUF2QyxFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNSQSxJQUFJQywwQkFBMEIsbUJBQUF4WixDQUFRLEVBQVIsQ0FBOUI7O0lBRWF5WixXLFdBQUFBLFc7Ozs7Ozs7Ozs7OzJDQUNVO0FBQ2YsaUJBQUsvRixTQUFMLHlCQUNTOEYsdUJBRFQ7QUFHSDs7OztFQUw0QjNDLFc7O0FBT2pDakIsU0FBU29CLGVBQVQsQ0FBeUIsY0FBekIsRUFBeUN5QyxXQUF6QyxFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNUQSxJQUFJQyxpQkFBaUIsbUJBQUExWixDQUFRLEVBQVIsQ0FBckI7O0lBQ2EyWixXLFdBQUFBLFc7Ozs7Ozs7Ozs7OzJDQUNVO0FBQ2YsaUJBQUtqRyxTQUFMLEdBQWlCLFFBQVFnRyxjQUFSLEdBQXlCLE1BQTFDO0FBQ0g7Ozs7RUFINEI3QyxXOztBQUtqQ2pCLFNBQVNvQixlQUFULENBQXlCLGNBQXpCLEVBQXlDMkMsV0FBekMsRTs7Ozs7Ozs7O0FDTkE7QUFDQSxJQUFJbmEsVUFBVWtCLE9BQU9MLE9BQVAsR0FBaUIsRUFBL0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSXVaLGdCQUFKO0FBQ0EsSUFBSUMsa0JBQUo7O0FBRUEsU0FBU0MsZ0JBQVQsR0FBNEI7QUFDeEIsVUFBTSxJQUFJdmMsS0FBSixDQUFVLGlDQUFWLENBQU47QUFDSDtBQUNELFNBQVN3YyxtQkFBVCxHQUFnQztBQUM1QixVQUFNLElBQUl4YyxLQUFKLENBQVUsbUNBQVYsQ0FBTjtBQUNIO0FBQ0EsYUFBWTtBQUNULFFBQUk7QUFDQSxZQUFJLE9BQU82SyxVQUFQLEtBQXNCLFVBQTFCLEVBQXNDO0FBQ2xDd1IsK0JBQW1CeFIsVUFBbkI7QUFDSCxTQUZELE1BRU87QUFDSHdSLCtCQUFtQkUsZ0JBQW5CO0FBQ0g7QUFDSixLQU5ELENBTUUsT0FBTzNWLENBQVAsRUFBVTtBQUNSeVYsMkJBQW1CRSxnQkFBbkI7QUFDSDtBQUNELFFBQUk7QUFDQSxZQUFJLE9BQU8zUixZQUFQLEtBQXdCLFVBQTVCLEVBQXdDO0FBQ3BDMFIsaUNBQXFCMVIsWUFBckI7QUFDSCxTQUZELE1BRU87QUFDSDBSLGlDQUFxQkUsbUJBQXJCO0FBQ0g7QUFDSixLQU5ELENBTUUsT0FBTzVWLENBQVAsRUFBVTtBQUNSMFYsNkJBQXFCRSxtQkFBckI7QUFDSDtBQUNKLENBbkJBLEdBQUQ7QUFvQkEsU0FBU0MsVUFBVCxDQUFvQkMsR0FBcEIsRUFBeUI7QUFDckIsUUFBSUwscUJBQXFCeFIsVUFBekIsRUFBcUM7QUFDakM7QUFDQSxlQUFPQSxXQUFXNlIsR0FBWCxFQUFnQixDQUFoQixDQUFQO0FBQ0g7QUFDRDtBQUNBLFFBQUksQ0FBQ0wscUJBQXFCRSxnQkFBckIsSUFBeUMsQ0FBQ0YsZ0JBQTNDLEtBQWdFeFIsVUFBcEUsRUFBZ0Y7QUFDNUV3UiwyQkFBbUJ4UixVQUFuQjtBQUNBLGVBQU9BLFdBQVc2UixHQUFYLEVBQWdCLENBQWhCLENBQVA7QUFDSDtBQUNELFFBQUk7QUFDQTtBQUNBLGVBQU9MLGlCQUFpQkssR0FBakIsRUFBc0IsQ0FBdEIsQ0FBUDtBQUNILEtBSEQsQ0FHRSxPQUFNOVYsQ0FBTixFQUFRO0FBQ04sWUFBSTtBQUNBO0FBQ0EsbUJBQU95VixpQkFBaUJsVyxJQUFqQixDQUFzQixJQUF0QixFQUE0QnVXLEdBQTVCLEVBQWlDLENBQWpDLENBQVA7QUFDSCxTQUhELENBR0UsT0FBTTlWLENBQU4sRUFBUTtBQUNOO0FBQ0EsbUJBQU95VixpQkFBaUJsVyxJQUFqQixDQUFzQixJQUF0QixFQUE0QnVXLEdBQTVCLEVBQWlDLENBQWpDLENBQVA7QUFDSDtBQUNKO0FBR0o7QUFDRCxTQUFTQyxlQUFULENBQXlCQyxNQUF6QixFQUFpQztBQUM3QixRQUFJTix1QkFBdUIxUixZQUEzQixFQUF5QztBQUNyQztBQUNBLGVBQU9BLGFBQWFnUyxNQUFiLENBQVA7QUFDSDtBQUNEO0FBQ0EsUUFBSSxDQUFDTix1QkFBdUJFLG1CQUF2QixJQUE4QyxDQUFDRixrQkFBaEQsS0FBdUUxUixZQUEzRSxFQUF5RjtBQUNyRjBSLDZCQUFxQjFSLFlBQXJCO0FBQ0EsZUFBT0EsYUFBYWdTLE1BQWIsQ0FBUDtBQUNIO0FBQ0QsUUFBSTtBQUNBO0FBQ0EsZUFBT04sbUJBQW1CTSxNQUFuQixDQUFQO0FBQ0gsS0FIRCxDQUdFLE9BQU9oVyxDQUFQLEVBQVM7QUFDUCxZQUFJO0FBQ0E7QUFDQSxtQkFBTzBWLG1CQUFtQm5XLElBQW5CLENBQXdCLElBQXhCLEVBQThCeVcsTUFBOUIsQ0FBUDtBQUNILFNBSEQsQ0FHRSxPQUFPaFcsQ0FBUCxFQUFTO0FBQ1A7QUFDQTtBQUNBLG1CQUFPMFYsbUJBQW1CblcsSUFBbkIsQ0FBd0IsSUFBeEIsRUFBOEJ5VyxNQUE5QixDQUFQO0FBQ0g7QUFDSjtBQUlKO0FBQ0QsSUFBSTFULFFBQVEsRUFBWjtBQUNBLElBQUkyVCxXQUFXLEtBQWY7QUFDQSxJQUFJQyxZQUFKO0FBQ0EsSUFBSUMsYUFBYSxDQUFDLENBQWxCOztBQUVBLFNBQVNDLGVBQVQsR0FBMkI7QUFDdkIsUUFBSSxDQUFDSCxRQUFELElBQWEsQ0FBQ0MsWUFBbEIsRUFBZ0M7QUFDNUI7QUFDSDtBQUNERCxlQUFXLEtBQVg7QUFDQSxRQUFJQyxhQUFhbGUsTUFBakIsRUFBeUI7QUFDckJzSyxnQkFBUTRULGFBQWE1UyxNQUFiLENBQW9CaEIsS0FBcEIsQ0FBUjtBQUNILEtBRkQsTUFFTztBQUNINlQscUJBQWEsQ0FBQyxDQUFkO0FBQ0g7QUFDRCxRQUFJN1QsTUFBTXRLLE1BQVYsRUFBa0I7QUFDZHFlO0FBQ0g7QUFDSjs7QUFFRCxTQUFTQSxVQUFULEdBQXNCO0FBQ2xCLFFBQUlKLFFBQUosRUFBYztBQUNWO0FBQ0g7QUFDRCxRQUFJSyxVQUFVVCxXQUFXTyxlQUFYLENBQWQ7QUFDQUgsZUFBVyxJQUFYOztBQUVBLFFBQUlNLE1BQU1qVSxNQUFNdEssTUFBaEI7QUFDQSxXQUFNdWUsR0FBTixFQUFXO0FBQ1BMLHVCQUFlNVQsS0FBZjtBQUNBQSxnQkFBUSxFQUFSO0FBQ0EsZUFBTyxFQUFFNlQsVUFBRixHQUFlSSxHQUF0QixFQUEyQjtBQUN2QixnQkFBSUwsWUFBSixFQUFrQjtBQUNkQSw2QkFBYUMsVUFBYixFQUF5QkssR0FBekI7QUFDSDtBQUNKO0FBQ0RMLHFCQUFhLENBQUMsQ0FBZDtBQUNBSSxjQUFNalUsTUFBTXRLLE1BQVo7QUFDSDtBQUNEa2UsbUJBQWUsSUFBZjtBQUNBRCxlQUFXLEtBQVg7QUFDQUYsb0JBQWdCTyxPQUFoQjtBQUNIOztBQUVEamIsUUFBUW9iLFFBQVIsR0FBbUIsVUFBVVgsR0FBVixFQUFlO0FBQzlCLFFBQUlZLE9BQU8sSUFBSS9YLEtBQUosQ0FBVTJCLFVBQVV0SSxNQUFWLEdBQW1CLENBQTdCLENBQVg7QUFDQSxRQUFJc0ksVUFBVXRJLE1BQVYsR0FBbUIsQ0FBdkIsRUFBMEI7QUFDdEIsYUFBSyxJQUFJRCxJQUFJLENBQWIsRUFBZ0JBLElBQUl1SSxVQUFVdEksTUFBOUIsRUFBc0NELEdBQXRDLEVBQTJDO0FBQ3ZDMmUsaUJBQUszZSxJQUFJLENBQVQsSUFBY3VJLFVBQVV2SSxDQUFWLENBQWQ7QUFDSDtBQUNKO0FBQ0R1SyxVQUFNcEssSUFBTixDQUFXLElBQUl5ZSxJQUFKLENBQVNiLEdBQVQsRUFBY1ksSUFBZCxDQUFYO0FBQ0EsUUFBSXBVLE1BQU10SyxNQUFOLEtBQWlCLENBQWpCLElBQXNCLENBQUNpZSxRQUEzQixFQUFxQztBQUNqQ0osbUJBQVdRLFVBQVg7QUFDSDtBQUNKLENBWEQ7O0FBYUE7QUFDQSxTQUFTTSxJQUFULENBQWNiLEdBQWQsRUFBbUJjLEtBQW5CLEVBQTBCO0FBQ3RCLFNBQUtkLEdBQUwsR0FBV0EsR0FBWDtBQUNBLFNBQUtjLEtBQUwsR0FBYUEsS0FBYjtBQUNIO0FBQ0RELEtBQUs5WCxTQUFMLENBQWUyWCxHQUFmLEdBQXFCLFlBQVk7QUFDN0IsU0FBS1YsR0FBTCxDQUFTelMsS0FBVCxDQUFlLElBQWYsRUFBcUIsS0FBS3VULEtBQTFCO0FBQ0gsQ0FGRDtBQUdBdmIsUUFBUXdiLEtBQVIsR0FBZ0IsU0FBaEI7QUFDQXhiLFFBQVF5YixPQUFSLEdBQWtCLElBQWxCO0FBQ0F6YixRQUFRMEwsR0FBUixHQUFjLEVBQWQ7QUFDQTFMLFFBQVEwYixJQUFSLEdBQWUsRUFBZjtBQUNBMWIsUUFBUTZNLE9BQVIsR0FBa0IsRUFBbEIsQyxDQUFzQjtBQUN0QjdNLFFBQVEyYixRQUFSLEdBQW1CLEVBQW5COztBQUVBLFNBQVNuTSxJQUFULEdBQWdCLENBQUU7O0FBRWxCeFAsUUFBUW1HLEVBQVIsR0FBYXFKLElBQWI7QUFDQXhQLFFBQVE0YixXQUFSLEdBQXNCcE0sSUFBdEI7QUFDQXhQLFFBQVFtTixJQUFSLEdBQWVxQyxJQUFmO0FBQ0F4UCxRQUFRK0YsR0FBUixHQUFjeUosSUFBZDtBQUNBeFAsUUFBUTZiLGNBQVIsR0FBeUJyTSxJQUF6QjtBQUNBeFAsUUFBUThiLGtCQUFSLEdBQTZCdE0sSUFBN0I7QUFDQXhQLFFBQVErSCxJQUFSLEdBQWV5SCxJQUFmO0FBQ0F4UCxRQUFRK2IsZUFBUixHQUEwQnZNLElBQTFCO0FBQ0F4UCxRQUFRZ2MsbUJBQVIsR0FBOEJ4TSxJQUE5Qjs7QUFFQXhQLFFBQVFpYyxTQUFSLEdBQW9CLFVBQVU5RSxJQUFWLEVBQWdCO0FBQUUsV0FBTyxFQUFQO0FBQVcsQ0FBakQ7O0FBRUFuWCxRQUFRa2MsT0FBUixHQUFrQixVQUFVL0UsSUFBVixFQUFnQjtBQUM5QixVQUFNLElBQUlwWixLQUFKLENBQVUsa0NBQVYsQ0FBTjtBQUNILENBRkQ7O0FBSUFpQyxRQUFRbWMsR0FBUixHQUFjLFlBQVk7QUFBRSxXQUFPLEdBQVA7QUFBWSxDQUF4QztBQUNBbmMsUUFBUW9jLEtBQVIsR0FBZ0IsVUFBVUMsR0FBVixFQUFlO0FBQzNCLFVBQU0sSUFBSXRlLEtBQUosQ0FBVSxnQ0FBVixDQUFOO0FBQ0gsQ0FGRDtBQUdBaUMsUUFBUXNjLEtBQVIsR0FBZ0IsWUFBVztBQUFFLFdBQU8sQ0FBUDtBQUFXLENBQXhDLEM7Ozs7Ozs7Ozs7O0FDdkxBLElBQUkvUSxDQUFKOztBQUVBO0FBQ0FBLElBQUssWUFBVztBQUNmLFFBQU8sSUFBUDtBQUNBLENBRkcsRUFBSjs7QUFJQSxJQUFJO0FBQ0g7QUFDQUEsS0FBSUEsS0FBSzFGLFNBQVMsYUFBVCxHQUFMLElBQWtDLENBQUMsR0FBRTBXLElBQUgsRUFBUyxNQUFULENBQXRDO0FBQ0EsQ0FIRCxDQUdFLE9BQU01WCxDQUFOLEVBQVM7QUFDVjtBQUNBLEtBQUcsUUFBT3JFLE1BQVAseUNBQU9BLE1BQVAsT0FBa0IsUUFBckIsRUFDQ2lMLElBQUlqTCxNQUFKO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBOztBQUVBWSxPQUFPTCxPQUFQLEdBQWlCMEssQ0FBakIsQzs7Ozs7Ozs7O0FDcEJBckssT0FBT0wsT0FBUCxHQUFpQixVQUFTSyxNQUFULEVBQWlCO0FBQ2pDLEtBQUcsQ0FBQ0EsT0FBT3NiLGVBQVgsRUFBNEI7QUFDM0J0YixTQUFPdWIsU0FBUCxHQUFtQixZQUFXLENBQUUsQ0FBaEM7QUFDQXZiLFNBQU93YixLQUFQLEdBQWUsRUFBZjtBQUNBO0FBQ0EsTUFBRyxDQUFDeGIsT0FBTzZTLFFBQVgsRUFBcUI3UyxPQUFPNlMsUUFBUCxHQUFrQixFQUFsQjtBQUNyQi9QLFNBQU8yWSxjQUFQLENBQXNCemIsTUFBdEIsRUFBOEIsUUFBOUIsRUFBd0M7QUFDdkMwYixlQUFZLElBRDJCO0FBRXZDclAsUUFBSyxlQUFXO0FBQ2YsV0FBT3JNLE9BQU9tQixDQUFkO0FBQ0E7QUFKc0MsR0FBeEM7QUFNQTJCLFNBQU8yWSxjQUFQLENBQXNCemIsTUFBdEIsRUFBOEIsSUFBOUIsRUFBb0M7QUFDbkMwYixlQUFZLElBRHVCO0FBRW5DclAsUUFBSyxlQUFXO0FBQ2YsV0FBT3JNLE9BQU94RSxDQUFkO0FBQ0E7QUFKa0MsR0FBcEM7QUFNQXdFLFNBQU9zYixlQUFQLEdBQXlCLENBQXpCO0FBQ0E7QUFDRCxRQUFPdGIsTUFBUDtBQUNBLENBckJELEM7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBY0E7O0FBR0E7O0FBR0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBdkJBWixPQUFPd1ksVUFBUDtBQUNBeFksT0FBTy9FLG9CQUFQO0FBQ0ErRSxPQUFPakMsZ0JBQVA7QUFDQWlDLE9BQU9qQixxQkFBUDtBQUNBaUIsT0FBTzVCLGdCQUFQO0FBQ0E0QixPQUFPdkQsaUJBQVA7QUFDQXVELE9BQU9KLGFBQVA7QUFDQUksT0FBT1osY0FBUDtBQUNBWSxPQUFPL0QsY0FBUDtBQUNBK0QsT0FBTzNDLHdCQUFQOztBQUVBOzs7QUFHQTs7O0FBR0EsMEU7Ozs7OztBQ2hDQSw4Tzs7Ozs7O0FDQUEscWU7Ozs7OztBQ0FBLG0yL0VBQW0yL0Usa0ZBQWtGLHlKQUF5SiwrR0FBK0csK0dBQStHLCtHQUErRywrR0FBK0csK0dBQStHLCtHQUErRywrR0FBK0csK0dBQStHLCtHQUErRyxnSEFBZ0gsK0dBQStHLCtHQUErRywySEFBMkgsOEZBQThGLDhGQUE4Riw4RkFBOEYsOEZBQThGLDhGQUE4Riw4RkFBOEYsOEZBQThGLDhGQUE4Riw4RkFBOEYsK0ZBQStGLDhGQUE4Riw4RkFBOEYsMEhBQTBILDZGQUE2Riw2RkFBNkYsNkZBQTZGLDZGQUE2Riw2RkFBNkYsNkZBQTZGLDZGQUE2Riw2RkFBNkYsNkZBQTZGLDhGQUE4Riw2RkFBNkYsNkZBQTZGLDRIQUE0SCwrRkFBK0YsK0ZBQStGLCtGQUErRiwrRkFBK0YsK0ZBQStGLCtGQUErRiwrRkFBK0YsK0ZBQStGLCtGQUErRixnR0FBZ0csK0ZBQStGLCtGQUErRixvRTs7Ozs7O0FDQS9pcUYsaUM7Ozs7OztBQ0FBLGdIQUFnSCxvRUFBb0UsK0JBQStCLGlDQUFpQyxnQ0FBZ0Msb0dBQW9HLGFBQWEscUJBQXFCLG1DQUFtQyxrREFBa0QsMmhCQUEyaEIseUI7Ozs7OztBQ0ExZ0MseW5FIiwiZmlsZSI6InJveWFsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMjEpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDYwYjgxNjM0NzlkODJjNDNmNzU3IiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2RldGVybWluZUtleVR5cGV9IGZyb20gJy4vZGV0ZXJtaW5lS2V5VHlwZS5qcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXRlcm1pbmVDb250ZW50VHlwZShjb250ZW50KSB7XG4gICAgLy8gdXNhZ2U6IGRldGVybWluZUNvbnRlbnRUeXBlKGNvbnRlbnQpKG9wZW5wZ3ApLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbiAgICByZXR1cm4gKCFjb250ZW50KSA/XG4gICAgUHJvbWlzZS5yZXNvbHZlKCcnKTpcbiAgICAob3BlbnBncCkgPT4ge1xuICAgICAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBvcGVucGdwJyk6XG4gICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IENMRUFSVEVYVCA9ICdjbGVhcnRleHQnO1xuICAgICAgICAgICAgY29uc3QgUEdQTUVTU0FHRSA9ICdQR1BNZXNzYWdlJztcbiAgICAgICAgICAgIGxldCBwb3NzaWJsZXBncGtleSA9IG9wZW5wZ3Aua2V5LnJlYWRBcm1vcmVkKGNvbnRlbnQpO1xuICAgICAgICAgICAgaWYgKHBvc3NpYmxlcGdwa2V5LmtleXNbMF0pIHtcbiAgICAgICAgICAgICAgICBkZXRlcm1pbmVLZXlUeXBlKGNvbnRlbnQpKG9wZW5wZ3ApXG4gICAgICAgICAgICAgICAgLnRoZW4oKGtleVR5cGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShrZXlUeXBlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbnBncC5tZXNzYWdlLnJlYWRBcm1vcmVkKGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKFBHUE1FU1NBR0UpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKENMRUFSVEVYVCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvZGV0ZXJtaW5lQ29udGVudFR5cGUuanMiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRGcm9tU3RvcmFnZShsb2NhbFN0b3JhZ2UpIHtcbiAgICAvLyB1c2FnZTogZ2V0RnJvbVN0b3JhZ2UobG9jYWxTdG9yYWdlKShba2V5XSkudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgIHJldHVybiAoIWxvY2FsU3RvcmFnZSkgP1xuICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBsb2NhbFN0b3JhZ2UnKTpcbiAgICAoaW5kZXhLZXkpID0+IHtcbiAgICAgICAgcmV0dXJuICghaW5kZXhLZXkpID9cbiAgICAgICAgLy8gbm8gaW5kZXggLT4gcmV0dXJuIGV2ZXJ5dGhpbmdcbiAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsZXQgaSA9IGxvY2FsU3RvcmFnZS5sZW5ndGhcbiAgICAgICAgICAgICAgICBsZXQga2V5QXJyID0gW11cbiAgICAgICAgICAgICAgICB3aGlsZSAoaSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGkgPSBpIC0gMVxuICAgICAgICAgICAgICAgICAgICBrZXlBcnIucHVzaChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShsb2NhbFN0b3JhZ2Uua2V5KGkpKSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoa2V5QXJyKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pOlxuICAgICAgICAvLyBpbmRleCBwcm92aWRlZCAtPiByZXR1cm4gb25lXG4gICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShpbmRleEtleSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGliL2dldEZyb21TdG9yYWdlLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2dldEZyb21TdG9yYWdlfSBmcm9tICcuL2dldEZyb21TdG9yYWdlJztcbmltcG9ydCB7ZGVjcnlwdFBHUE1lc3NhZ2VXaXRoS2V5fSBmcm9tICcuLi8uLi9zcmMvbGliL2RlY3J5cHRQR1BNZXNzYWdlV2l0aEtleS5qcyc7XG5pbXBvcnQge2RldGVybWluZUNvbnRlbnRUeXBlfSBmcm9tICcuLi8uLi9zcmMvbGliL2RldGVybWluZUNvbnRlbnRUeXBlLmpzJztcblxuY29uc3QgUEdQUFJJVktFWSA9ICdQR1BQcml2a2V5JztcblxuZXhwb3J0IGZ1bmN0aW9uIGRlY3J5cHRQR1BNZXNzYWdlKG9wZW5wZ3ApIHtcbiAgICAvLyAgdXNhZ2U6IGRlY3J5cHRQR1BNZXNzYWdlKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSkocGFzc3dvcmQpKFBHUE1lc3NhZ2VBcm1vcikudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgIHJldHVybiAoIW9wZW5wZ3ApID9cbiAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgIChsb2NhbFN0b3JhZ2UpID0+IHtcbiAgICAgICAgcmV0dXJuICghbG9jYWxTdG9yYWdlKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBsb2NhbFN0b3JhZ2UnKTpcbiAgICAgICAgKHBhc3N3b3JkKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCFwYXNzd29yZCkgP1xuICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QoXCJFcnJvcjogbWlzc2luZyBwYXNzd29yZFwiKTpcbiAgICAgICAgICAgIChQR1BNZXNzYWdlQXJtb3IpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKCFQR1BNZXNzYWdlQXJtb3IpID9cbiAgICAgICAgICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgUEdQTWVzc2FnZUFybW9yJyk6XG4gICAgICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhQR1BNZXNzYWdlQXJtb3IpO1xuICAgICAgICAgICAgICAgICAgICBnZXRGcm9tU3RvcmFnZShsb2NhbFN0b3JhZ2UpKClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oc3RvcmVBcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RvcmVBcnJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKHN0b3JhZ2VJdGVtID0+ICghc3RvcmFnZUl0ZW0pID8gZmFsc2UgOiB0cnVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoc3RvcmFnZUl0ZW0gPT4gZGV0ZXJtaW5lQ29udGVudFR5cGUoc3RvcmFnZUl0ZW0pKG9wZW5wZ3ApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGNvbnRlbnRUeXBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50VHlwZSA9PT0gUEdQUFJJVktFWSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlY3J5cHRQR1BNZXNzYWdlV2l0aEtleShvcGVucGdwKShwYXNzd29yZCkoc3RvcmFnZUl0ZW0pKFBHUE1lc3NhZ2VBcm1vcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihkZWNyeXB0ZWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgZGVjcnlwdGVkICR7ZGVjcnlwdGVkfWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRlY3J5cHRlZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGliL2RlY3J5cHRQR1BNZXNzYWdlLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgZnVuY3Rpb24gZGVjcnlwdFBHUE1lc3NhZ2VXaXRoS2V5KG9wZW5wZ3ApIHtcbiAgICBjb25zb2xlLmxvZygnZGVjcnlwdFBHUE1lc3NhZ2VXaXRoS2V5Jyk7XG4gICAgLy8gIHVzYWdlOiBkZWNyeXB0UEdQTWVzc2FnZVdpdGhLZXkob3BlbnBncCkocGFzc3dvcmQpKHByaXZhdGVLZXlBcm1vcikoUEdQTWVzc2FnZUFybW9yKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpXG4gICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBvcGVucGdwJyk6XG4gICAgKHBhc3N3b3JkKSA9PiB7XG4gICAgICAgIHJldHVybiAoIXBhc3N3b3JkKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBwYXNzd29yZCcpOlxuICAgICAgICAocHJpdmF0ZUtleUFybW9yKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgcGFzc3dvcmQgJHtwYXNzd29yZH1gKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBwcml2YXRlS2V5QXJtb3IgJHtwcml2YXRlS2V5QXJtb3J9YCk7XG4gICAgICAgICAgICBsZXQgcHJpdmF0ZUtleXMgPSBvcGVucGdwLmtleS5yZWFkQXJtb3JlZChwcml2YXRlS2V5QXJtb3IpO1xuICAgICAgICAgICAgbGV0IHByaXZhdGVLZXkgPSBwcml2YXRlS2V5cy5rZXlzWzBdO1xuICAgICAgICAgICAgcmV0dXJuICghcHJpdmF0ZUtleSkgP1xuICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdtaXNzaW5nIHByaXZhdGVLZXlBcm1vcicpKTpcbiAgICAgICAgICAgIChQR1BNZXNzYWdlQXJtb3IpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKCFQR1BNZXNzYWdlQXJtb3IpID9cbiAgICAgICAgICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ21pc3NpbmcgUEdQTWVzc2FnZUFybW9yJykpOlxuICAgICAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtZXNzYWdlID0gb3BlbnBncC5tZXNzYWdlLnJlYWRBcm1vcmVkKFBHUE1lc3NhZ2VBcm1vcilcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghb3BlbnBncC5kZWNyeXB0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnb3BlbnBncC5kZWNyeXB0TWVzc2FnZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocHJpdmF0ZUtleS51c2VycylcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5wZ3AuZGVjcnlwdE1lc3NhZ2UocHJpdmF0ZUtleSwgbWVzc2FnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKX0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ29wZW5wZ3AuZGVjcnlwdCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5wZ3AuZGVjcnlwdCh7ICdtZXNzYWdlJzogbWVzc2FnZSwgJ3ByaXZhdGVLZXknOiBwcml2YXRlS2V5IH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0LmRhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0LmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9yZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGliL2RlY3J5cHRQR1BNZXNzYWdlV2l0aEtleS5qcyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGZ1bmN0aW9uIGRldGVybWluZUtleVR5cGUoY29udGVudCkge1xuICAgIHJldHVybiAoIWNvbnRlbnQpID9cbiAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgcGdwS2V5Jyk6XG4gICAgKG9wZW5wZ3ApID0+IHtcbiAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBQR1BQVUJLRVkgPSAnUEdQUHVia2V5JztcbiAgICAgICAgICAgIGNvbnN0IFBHUFBSSVZLRVkgPSAnUEdQUHJpdmtleSc7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxldCBwcml2YXRlS2V5cyA9IG9wZW5wZ3Aua2V5LnJlYWRBcm1vcmVkKGNvbnRlbnQpXG4gICAgICAgICAgICAgICAgbGV0IHByaXZhdGVLZXkgPSBwcml2YXRlS2V5cy5rZXlzWzBdXG4gICAgICAgICAgICAgICAgaWYgKHByaXZhdGVLZXkudG9QdWJsaWMoKS5hcm1vcigpICE9PSBwcml2YXRlS2V5LmFybW9yKCkgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoUEdQUFJJVktFWSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShQR1BQVUJLRVkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGliL2RldGVybWluZUtleVR5cGUuanMiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBlbmNyeXB0Q2xlYXJUZXh0KG9wZW5wZ3ApIHtcbiAgICAvLyB1c2FnZTogZW5jcnlwdENsZWFyVGV4dChvcGVucGdwKShwdWJsaWNLZXlBcm1vcikoY2xlYXJ0ZXh0KS50aGVuKHJlc3VsdCA9PiByZXN1bHQpXG4gICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBvcGVucGdwJyk6XG4gICAgKHB1YmxpY0tleUFybW9yKSA9PiB7XG4gICAgICAgIHJldHVybiAoIXB1YmxpY0tleUFybW9yKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBwdWJsaWMga2V5Jyk6XG4gICAgICAgIChjbGVhcnRleHQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoIWNsZWFydGV4dCkgP1xuICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIGNsZWFydGV4dCcpOlxuICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBQR1BQdWJrZXkgPSBvcGVucGdwLmtleS5yZWFkQXJtb3JlZChwdWJsaWNLZXlBcm1vcilcbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgIHRoZSBsYXRlc3Qgb3BlbnBncCAyLjUuNCBicmVha3Mgb24gb3VyIGNvbnNvbGUgb25seSB0b29scy5cbiAgICAgICAgICAgICAgICBidXQgaXQncyAxMHggZmFzdGVyIG9uIGJyb3dzZXJzIHNvIFRIRSBORVcgQ09ERSBTVEFZUyBJTi5cbiAgICAgICAgICAgICAgICBiZWxvdyB3ZSBleHBsb2l0IGZhbGxiYWNrIHRvIG9sZCBzbG93IGVycm9yIGZyZWUgb3BlbnBncCAxLjYuMlxuICAgICAgICAgICAgICAgIGJ5IGFkYXB0aW5nIG9uIHRoZSBmbHkgdG8gYSBicmVha2luZyBjaGFuZ2VcbiAgICAgICAgICAgICAgICAob3BlbnBncCBidWcgXjEuNi4yIC0+IDIuNS40IG1hZGUgdXMgZG8gaXQpXG4gICAgICAgICAgICAgICAgcmVmYWN0b3I6IHJlbW92ZSB0cnkgc2VjdGlvbiBvZiB0cnljYXRjaCBrZWVwIGNhdGNoIHNlY3Rpb25cbiAgICAgICAgICAgICAgICBieSBhbGwgbWVhbnMgcmVmYWN0b3IgaWYgbm90IGJyb2tlbiBhZnRlciBvcGVucGdwIDIuNS40XG4gICAgICAgICAgICAgICAgaWYgeW91IGNoZWNrIG9wZW5wZ3AgcGxlYXNlIGJ1bXAgZmFpbGluZyB2ZXJzaW9uICBeXl5eXlxuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gd29ya3Mgb25seSBvbiBvcGVucGdwIHZlcnNpb24gMS42LjJcbiAgICAgICAgICAgICAgICAgICAgb3BlbnBncC5lbmNyeXB0TWVzc2FnZShQR1BQdWJrZXkua2V5c1swXSwgY2xlYXJ0ZXh0KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihlbmNyeXB0ZWR0eHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShlbmNyeXB0ZWR0eHQpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgpXG4gICAgICAgICAgICAgICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gd29ya3Mgb24gb3BlbnBncCB2ZXJzaW9uIDIuNS40XG4gICAgICAgICAgICAgICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogY2xlYXJ0ZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcHVibGljS2V5czogb3BlbnBncC5rZXkucmVhZEFybW9yZWQocHVibGljS2V5QXJtb3IpLmtleXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcm1vcjogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBvcGVucGdwLmVuY3J5cHQob3B0aW9ucylcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGNpcGhlcnRleHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY2lwaGVydGV4dC5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvZW5jcnlwdENsZWFyVGV4dC5qcyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtnZXRGcm9tU3RvcmFnZX0gZnJvbSAnLi9nZXRGcm9tU3RvcmFnZSc7XG5pbXBvcnQge2RldGVybWluZUNvbnRlbnRUeXBlfSBmcm9tICcuL2RldGVybWluZUNvbnRlbnRUeXBlJztcbmltcG9ydCB7ZW5jcnlwdENsZWFyVGV4dH0gZnJvbSAnLi9lbmNyeXB0Q2xlYXJUZXh0JztcblxuY29uc3QgUEdQUFVCS0VZID0gJ1BHUFB1YmtleSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBlbmNyeXB0Q2xlYXJ0ZXh0TXVsdGkoY29udGVudCkge1xuICAgIC8vIHVzYWdlOiBlbmNyeXB0Q2xlYXJ0ZXh0TXVsdGkoY29udGVudCkob3BlbnBncCkobG9jYWxTdG9yYWdlKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpXG4gICAgcmV0dXJuICghY29udGVudCkgP1xuICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBjb250ZW50Jyk6XG4gICAgKG9wZW5wZ3ApID0+IHtcbiAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgICAgICAobG9jYWxTdG9yYWdlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCFsb2NhbFN0b3JhZ2UpID9cbiAgICAgICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBsb2NhbFN0b3JhZ2UnKTpcbiAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBnZXRGcm9tU3RvcmFnZShsb2NhbFN0b3JhZ2UpKClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHN0b3JhZ2VBcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vbGV0IHB1YmxpY0tleUFyciA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGVuY3J5cHRlZE1zZ3MgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpID0gc3RvcmFnZUFyci5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaWR4ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JhZ2VBcnJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKHN0b3JhZ2VJdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaS0tO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdG9yYWdlSXRlbTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKHN0b3JhZ2VJdGVtID0+ICghc3RvcmFnZUl0ZW0pID8gZmFsc2UgOiB0cnVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgoc3RvcmFnZUl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXRlcm1pbmVDb250ZW50VHlwZShzdG9yYWdlSXRlbSkob3BlbnBncClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoY29udGVudFR5cGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRlbnRUeXBlID09PSBQR1BQVUJLRVkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuY3J5cHRDbGVhclRleHQob3BlbnBncCkoc3RvcmFnZUl0ZW0pKGNvbnRlbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoZW5jcnlwdGVkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5jcnlwdGVkTXNnc1tpZHhdID0gZW5jcnlwdGVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkeCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZW5jcnlwdGVkTXNncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QgKG5ldyBFcnJvciAoZXJyKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvZW5jcnlwdENsZWFydGV4dE11bHRpLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZVBHUFByaXZrZXkoUEdQa2V5QXJtb3IpIHtcbiAgICAvLyBzYXZlIHByaXZhdGUga2V5IHRvIHN0b3JhZ2Ugbm8gcXVlc3Rpb25zIGFza2VkXG4gICAgLy8gdXNhZ2U6IHNhdmVQR1BQcml2a2V5KGNvbnRlbnQpKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSkudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgIHJldHVybiAoIVBHUGtleUFybW9yKSA/XG4gICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIFBHUGtleUFybW9yJyk6XG4gICAgKG9wZW5wZ3ApID0+IHtcbiAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgICAgICAobG9jYWxTdG9yYWdlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCFsb2NhbFN0b3JhZ2UpID9cbiAgICAgICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBsb2NhbFN0b3JhZ2UnKTpcbiAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgUEdQa2V5ID0gb3BlbnBncC5rZXkucmVhZEFybW9yZWQoUEdQa2V5QXJtb3IpO1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShQR1BrZXkua2V5c1swXS51c2Vyc1swXS51c2VySWQudXNlcmlkLCBQR1BrZXlBcm1vcilcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5zZXRJbW1lZGlhdGUoXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGBwcml2YXRlIHBncCBrZXkgc2F2ZWQgPC0gJHtQR1BrZXkua2V5c1swXS51c2Vyc1swXS51c2VySWQudXNlcmlkfWApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB9IGNhdGNoKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xpYi9zYXZlUEdQUHJpdmtleS5qcyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtnZXRGcm9tU3RvcmFnZX0gZnJvbSAnLi9nZXRGcm9tU3RvcmFnZSc7XG5pbXBvcnQge2RldGVybWluZUNvbnRlbnRUeXBlfSBmcm9tICcuL2RldGVybWluZUNvbnRlbnRUeXBlJztcblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVQR1BQdWJrZXkoUEdQa2V5QXJtb3IpIHtcbiAgICAvLyBzYXZlIHB1YmxpYyBrZXkgdG8gc3RvcmFnZSBvbmx5IGlmIGl0IGRvZXNuJ3Qgb3ZlcndyaXRlIGEgcHJpdmF0ZSBrZXlcbiAgICAvLyB1c2FnZTogc2F2ZVBHUFB1YmtleShjb250ZW50KShvcGVucGdwKShsb2NhbFN0b3JhZ2UpLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbiAgICByZXR1cm4gKCFQR1BrZXlBcm1vcikgP1xuICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBQR1BrZXlBcm1vcicpOlxuICAgIChvcGVucGdwKSA9PiB7XG4gICAgICAgIHJldHVybiAoIW9wZW5wZ3ApID9cbiAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIG9wZW5wZ3AnKTpcbiAgICAgICAgKGxvY2FsU3RvcmFnZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICghbG9jYWxTdG9yYWdlKSA/XG4gICAgICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgbG9jYWxTdG9yYWdlJyk6XG4gICAgICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IFBHUGtleSA9IG9wZW5wZ3Aua2V5LnJlYWRBcm1vcmVkKFBHUGtleUFybW9yKTtcbiAgICAgICAgICAgICAgICBnZXRGcm9tU3RvcmFnZShsb2NhbFN0b3JhZ2UpKFBHUGtleS5rZXlzWzBdLnVzZXJzWzBdLnVzZXJJZC51c2VyaWQpXG4gICAgICAgICAgICAgICAgLnRoZW4oZXhpc3RpbmdLZXkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCFleGlzdGluZ0tleSkgP1xuICAgICAgICAgICAgICAgICAgICBQcm9taXNlLnJlc29sdmUoJ25vbmUnKSA6XG4gICAgICAgICAgICAgICAgICAgIGRldGVybWluZUNvbnRlbnRUeXBlKGV4aXN0aW5nS2V5KShvcGVucGdwKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKGV4aXN0aW5nS2V5VHlwZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleGlzdGluZ0tleVR5cGUgPT09ICdQR1BQcml2a2V5Jyl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCdwdWJrZXkgaWdub3JlZCBYLSBhdHRlbXB0ZWQgb3ZlcndyaXRlIHByaXZrZXknKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oUEdQa2V5LmtleXNbMF0udXNlcnNbMF0udXNlcklkLnVzZXJpZCwgUEdQa2V5QXJtb3IpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGBwdWJsaWMgcGdwIGtleSBzYXZlZCA8LSAke1BHUGtleS5rZXlzWzBdLnVzZXJzWzBdLnVzZXJJZC51c2VyaWR9YClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlamVjdChlcnIpKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvc2F2ZVBHUFB1YmtleS5qcyIsIjsoZnVuY3Rpb24oKXtcclxuXHJcblx0LyogVU5CVUlMRCAqL1xyXG5cdHZhciByb290O1xyXG5cdGlmKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpeyByb290ID0gd2luZG93IH1cclxuXHRpZih0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiKXsgcm9vdCA9IGdsb2JhbCB9XHJcblx0cm9vdCA9IHJvb3QgfHwge307XHJcblx0dmFyIGNvbnNvbGUgPSByb290LmNvbnNvbGUgfHwge2xvZzogZnVuY3Rpb24oKXt9fTtcclxuXHRmdW5jdGlvbiByZXF1aXJlKGFyZyl7XHJcblx0XHRyZXR1cm4gYXJnLnNsaWNlPyByZXF1aXJlW3Jlc29sdmUoYXJnKV0gOiBmdW5jdGlvbihtb2QsIHBhdGgpe1xyXG5cdFx0XHRhcmcobW9kID0ge2V4cG9ydHM6IHt9fSk7XHJcblx0XHRcdHJlcXVpcmVbcmVzb2x2ZShwYXRoKV0gPSBtb2QuZXhwb3J0cztcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIHJlc29sdmUocGF0aCl7XHJcblx0XHRcdHJldHVybiBwYXRoLnNwbGl0KCcvJykuc2xpY2UoLTEpLnRvU3RyaW5nKCkucmVwbGFjZSgnLmpzJywnJyk7XHJcblx0XHR9XHJcblx0fVxyXG5cdGlmKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIpeyB2YXIgY29tbW9uID0gbW9kdWxlIH1cclxuXHQvKiBVTkJVSUxEICovXHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHQvLyBHZW5lcmljIGphdmFzY3JpcHQgdXRpbGl0aWVzLlxyXG5cdFx0dmFyIFR5cGUgPSB7fTtcclxuXHRcdC8vVHlwZS5mbnMgPSBUeXBlLmZuID0ge2lzOiBmdW5jdGlvbihmbil7IHJldHVybiAoISFmbiAmJiBmbiBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB9fVxyXG5cdFx0VHlwZS5mbnMgPSBUeXBlLmZuID0ge2lzOiBmdW5jdGlvbihmbil7IHJldHVybiAoISFmbiAmJiAnZnVuY3Rpb24nID09IHR5cGVvZiBmbikgfX1cclxuXHRcdFR5cGUuYmkgPSB7aXM6IGZ1bmN0aW9uKGIpeyByZXR1cm4gKGIgaW5zdGFuY2VvZiBCb29sZWFuIHx8IHR5cGVvZiBiID09ICdib29sZWFuJykgfX1cclxuXHRcdFR5cGUubnVtID0ge2lzOiBmdW5jdGlvbihuKXsgcmV0dXJuICFsaXN0X2lzKG4pICYmICgobiAtIHBhcnNlRmxvYXQobikgKyAxKSA+PSAwIHx8IEluZmluaXR5ID09PSBuIHx8IC1JbmZpbml0eSA9PT0gbikgfX1cclxuXHRcdFR5cGUudGV4dCA9IHtpczogZnVuY3Rpb24odCl7IHJldHVybiAodHlwZW9mIHQgPT0gJ3N0cmluZycpIH19XHJcblx0XHRUeXBlLnRleHQuaWZ5ID0gZnVuY3Rpb24odCl7XHJcblx0XHRcdGlmKFR5cGUudGV4dC5pcyh0KSl7IHJldHVybiB0IH1cclxuXHRcdFx0aWYodHlwZW9mIEpTT04gIT09IFwidW5kZWZpbmVkXCIpeyByZXR1cm4gSlNPTi5zdHJpbmdpZnkodCkgfVxyXG5cdFx0XHRyZXR1cm4gKHQgJiYgdC50b1N0cmluZyk/IHQudG9TdHJpbmcoKSA6IHQ7XHJcblx0XHR9XHJcblx0XHRUeXBlLnRleHQucmFuZG9tID0gZnVuY3Rpb24obCwgYyl7XHJcblx0XHRcdHZhciBzID0gJyc7XHJcblx0XHRcdGwgPSBsIHx8IDI0OyAvLyB5b3UgYXJlIG5vdCBnb2luZyB0byBtYWtlIGEgMCBsZW5ndGggcmFuZG9tIG51bWJlciwgc28gbm8gbmVlZCB0byBjaGVjayB0eXBlXHJcblx0XHRcdGMgPSBjIHx8ICcwMTIzNDU2Nzg5QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6JztcclxuXHRcdFx0d2hpbGUobCA+IDApeyBzICs9IGMuY2hhckF0KE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGMubGVuZ3RoKSk7IGwtLSB9XHJcblx0XHRcdHJldHVybiBzO1xyXG5cdFx0fVxyXG5cdFx0VHlwZS50ZXh0Lm1hdGNoID0gZnVuY3Rpb24odCwgbyl7IHZhciByID0gZmFsc2U7XHJcblx0XHRcdHQgPSB0IHx8ICcnO1xyXG5cdFx0XHRvID0gVHlwZS50ZXh0LmlzKG8pPyB7Jz0nOiBvfSA6IG8gfHwge307IC8vIHsnficsICc9JywgJyonLCAnPCcsICc+JywgJysnLCAnLScsICc/JywgJyEnfSAvLyBpZ25vcmUgY2FzZSwgZXhhY3RseSBlcXVhbCwgYW55dGhpbmcgYWZ0ZXIsIGxleGljYWxseSBsYXJnZXIsIGxleGljYWxseSBsZXNzZXIsIGFkZGVkIGluLCBzdWJ0YWN0ZWQgZnJvbSwgcXVlc3Rpb25hYmxlIGZ1enp5IG1hdGNoLCBhbmQgZW5kcyB3aXRoLlxyXG5cdFx0XHRpZihUeXBlLm9iai5oYXMobywnficpKXsgdCA9IHQudG9Mb3dlckNhc2UoKTsgb1snPSddID0gKG9bJz0nXSB8fCBvWyd+J10pLnRvTG93ZXJDYXNlKCkgfVxyXG5cdFx0XHRpZihUeXBlLm9iai5oYXMobywnPScpKXsgcmV0dXJuIHQgPT09IG9bJz0nXSB9XHJcblx0XHRcdGlmKFR5cGUub2JqLmhhcyhvLCcqJykpeyBpZih0LnNsaWNlKDAsIG9bJyonXS5sZW5ndGgpID09PSBvWycqJ10peyByID0gdHJ1ZTsgdCA9IHQuc2xpY2Uob1snKiddLmxlbmd0aCkgfSBlbHNlIHsgcmV0dXJuIGZhbHNlIH19XHJcblx0XHRcdGlmKFR5cGUub2JqLmhhcyhvLCchJykpeyBpZih0LnNsaWNlKC1vWychJ10ubGVuZ3RoKSA9PT0gb1snISddKXsgciA9IHRydWUgfSBlbHNlIHsgcmV0dXJuIGZhbHNlIH19XHJcblx0XHRcdGlmKFR5cGUub2JqLmhhcyhvLCcrJykpe1xyXG5cdFx0XHRcdGlmKFR5cGUubGlzdC5tYXAoVHlwZS5saXN0LmlzKG9bJysnXSk/IG9bJysnXSA6IFtvWycrJ11dLCBmdW5jdGlvbihtKXtcclxuXHRcdFx0XHRcdGlmKHQuaW5kZXhPZihtKSA+PSAwKXsgciA9IHRydWUgfSBlbHNlIHsgcmV0dXJuIHRydWUgfVxyXG5cdFx0XHRcdH0pKXsgcmV0dXJuIGZhbHNlIH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZihUeXBlLm9iai5oYXMobywnLScpKXtcclxuXHRcdFx0XHRpZihUeXBlLmxpc3QubWFwKFR5cGUubGlzdC5pcyhvWyctJ10pPyBvWyctJ10gOiBbb1snLSddXSwgZnVuY3Rpb24obSl7XHJcblx0XHRcdFx0XHRpZih0LmluZGV4T2YobSkgPCAwKXsgciA9IHRydWUgfSBlbHNlIHsgcmV0dXJuIHRydWUgfVxyXG5cdFx0XHRcdH0pKXsgcmV0dXJuIGZhbHNlIH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZihUeXBlLm9iai5oYXMobywnPicpKXsgaWYodCA+IG9bJz4nXSl7IHIgPSB0cnVlIH0gZWxzZSB7IHJldHVybiBmYWxzZSB9fVxyXG5cdFx0XHRpZihUeXBlLm9iai5oYXMobywnPCcpKXsgaWYodCA8IG9bJzwnXSl7IHIgPSB0cnVlIH0gZWxzZSB7IHJldHVybiBmYWxzZSB9fVxyXG5cdFx0XHRmdW5jdGlvbiBmdXp6eSh0LGYpeyB2YXIgbiA9IC0xLCBpID0gMCwgYzsgZm9yKDtjID0gZltpKytdOyl7IGlmKCF+KG4gPSB0LmluZGV4T2YoYywgbisxKSkpeyByZXR1cm4gZmFsc2UgfX0gcmV0dXJuIHRydWUgfSAvLyB2aWEgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy85MjA2MDEzL2phdmFzY3JpcHQtZnV6enktc2VhcmNoXHJcblx0XHRcdGlmKFR5cGUub2JqLmhhcyhvLCc/JykpeyBpZihmdXp6eSh0LCBvWyc/J10pKXsgciA9IHRydWUgfSBlbHNlIHsgcmV0dXJuIGZhbHNlIH19IC8vIGNoYW5nZSBuYW1lIVxyXG5cdFx0XHRyZXR1cm4gcjtcclxuXHRcdH1cclxuXHRcdFR5cGUubGlzdCA9IHtpczogZnVuY3Rpb24obCl7IHJldHVybiAobCBpbnN0YW5jZW9mIEFycmF5KSB9fVxyXG5cdFx0VHlwZS5saXN0LnNsaXQgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XHJcblx0XHRUeXBlLmxpc3Quc29ydCA9IGZ1bmN0aW9uKGspeyAvLyBjcmVhdGVzIGEgbmV3IHNvcnQgZnVuY3Rpb24gYmFzZWQgb2ZmIHNvbWUgZmllbGRcclxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKEEsQil7XHJcblx0XHRcdFx0aWYoIUEgfHwgIUIpeyByZXR1cm4gMCB9IEEgPSBBW2tdOyBCID0gQltrXTtcclxuXHRcdFx0XHRpZihBIDwgQil7IHJldHVybiAtMSB9ZWxzZSBpZihBID4gQil7IHJldHVybiAxIH1cclxuXHRcdFx0XHRlbHNlIHsgcmV0dXJuIDAgfVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRUeXBlLmxpc3QubWFwID0gZnVuY3Rpb24obCwgYywgXyl7IHJldHVybiBvYmpfbWFwKGwsIGMsIF8pIH1cclxuXHRcdFR5cGUubGlzdC5pbmRleCA9IDE7IC8vIGNoYW5nZSB0aGlzIHRvIDAgaWYgeW91IHdhbnQgbm9uLWxvZ2ljYWwsIG5vbi1tYXRoZW1hdGljYWwsIG5vbi1tYXRyaXgsIG5vbi1jb252ZW5pZW50IGFycmF5IG5vdGF0aW9uXHJcblx0XHRUeXBlLm9iaiA9IHtpczogZnVuY3Rpb24obyl7IHJldHVybiBvPyAobyBpbnN0YW5jZW9mIE9iamVjdCAmJiBvLmNvbnN0cnVjdG9yID09PSBPYmplY3QpIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5tYXRjaCgvXlxcW29iamVjdCAoXFx3KylcXF0kLylbMV0gPT09ICdPYmplY3QnIDogZmFsc2UgfX1cclxuXHRcdFR5cGUub2JqLnB1dCA9IGZ1bmN0aW9uKG8sIGYsIHYpeyByZXR1cm4gKG98fHt9KVtmXSA9IHYsIG8gfVxyXG5cdFx0VHlwZS5vYmouaGFzID0gZnVuY3Rpb24obywgZil7IHJldHVybiBvICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBmKSB9XHJcblx0XHRUeXBlLm9iai5kZWwgPSBmdW5jdGlvbihvLCBrKXtcclxuXHRcdFx0aWYoIW8peyByZXR1cm4gfVxyXG5cdFx0XHRvW2tdID0gbnVsbDtcclxuXHRcdFx0ZGVsZXRlIG9ba107XHJcblx0XHRcdHJldHVybiBvO1xyXG5cdFx0fVxyXG5cdFx0VHlwZS5vYmouYXMgPSBmdW5jdGlvbihvLCBmLCB2LCB1KXsgcmV0dXJuIG9bZl0gPSBvW2ZdIHx8ICh1ID09PSB2PyB7fSA6IHYpIH1cclxuXHRcdFR5cGUub2JqLmlmeSA9IGZ1bmN0aW9uKG8pe1xyXG5cdFx0XHRpZihvYmpfaXMobykpeyByZXR1cm4gbyB9XHJcblx0XHRcdHRyeXtvID0gSlNPTi5wYXJzZShvKTtcclxuXHRcdFx0fWNhdGNoKGUpe289e319O1xyXG5cdFx0XHRyZXR1cm4gbztcclxuXHRcdH1cclxuXHRcdDsoZnVuY3Rpb24oKXsgdmFyIHU7XHJcblx0XHRcdGZ1bmN0aW9uIG1hcCh2LGYpe1xyXG5cdFx0XHRcdGlmKG9ial9oYXModGhpcyxmKSAmJiB1ICE9PSB0aGlzW2ZdKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR0aGlzW2ZdID0gdjtcclxuXHRcdFx0fVxyXG5cdFx0XHRUeXBlLm9iai50byA9IGZ1bmN0aW9uKGZyb20sIHRvKXtcclxuXHRcdFx0XHR0byA9IHRvIHx8IHt9O1xyXG5cdFx0XHRcdG9ial9tYXAoZnJvbSwgbWFwLCB0byk7XHJcblx0XHRcdFx0cmV0dXJuIHRvO1xyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0VHlwZS5vYmouY29weSA9IGZ1bmN0aW9uKG8peyAvLyBiZWNhdXNlIGh0dHA6Ly93ZWIuYXJjaGl2ZS5vcmcvd2ViLzIwMTQwMzI4MjI0MDI1L2h0dHA6Ly9qc3BlcmYuY29tL2Nsb25pbmctYW4tb2JqZWN0LzJcclxuXHRcdFx0cmV0dXJuICFvPyBvIDogSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvKSk7IC8vIGlzIHNob2NraW5nbHkgZmFzdGVyIHRoYW4gYW55dGhpbmcgZWxzZSwgYW5kIG91ciBkYXRhIGhhcyB0byBiZSBhIHN1YnNldCBvZiBKU09OIGFueXdheXMhXHJcblx0XHR9XHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdGZ1bmN0aW9uIGVtcHR5KHYsaSl7IHZhciBuID0gdGhpcy5uO1xyXG5cdFx0XHRcdGlmKG4gJiYgKGkgPT09IG4gfHwgKG9ial9pcyhuKSAmJiBvYmpfaGFzKG4sIGkpKSkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGlmKGkpeyByZXR1cm4gdHJ1ZSB9XHJcblx0XHRcdH1cclxuXHRcdFx0VHlwZS5vYmouZW1wdHkgPSBmdW5jdGlvbihvLCBuKXtcclxuXHRcdFx0XHRpZighbyl7IHJldHVybiB0cnVlIH1cclxuXHRcdFx0XHRyZXR1cm4gb2JqX21hcChvLGVtcHR5LHtuOm59KT8gZmFsc2UgOiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRmdW5jdGlvbiB0KGssdil7XHJcblx0XHRcdFx0aWYoMiA9PT0gYXJndW1lbnRzLmxlbmd0aCl7XHJcblx0XHRcdFx0XHR0LnIgPSB0LnIgfHwge307XHJcblx0XHRcdFx0XHR0LnJba10gPSB2O1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH0gdC5yID0gdC5yIHx8IFtdO1xyXG5cdFx0XHRcdHQuci5wdXNoKGspO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHR2YXIga2V5cyA9IE9iamVjdC5rZXlzO1xyXG5cdFx0XHRUeXBlLm9iai5tYXAgPSBmdW5jdGlvbihsLCBjLCBfKXtcclxuXHRcdFx0XHR2YXIgdSwgaSA9IDAsIHgsIHIsIGxsLCBsbGUsIGYgPSBmbl9pcyhjKTtcclxuXHRcdFx0XHR0LnIgPSBudWxsO1xyXG5cdFx0XHRcdGlmKGtleXMgJiYgb2JqX2lzKGwpKXtcclxuXHRcdFx0XHRcdGxsID0gT2JqZWN0LmtleXMobCk7IGxsZSA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGxpc3RfaXMobCkgfHwgbGwpe1xyXG5cdFx0XHRcdFx0eCA9IChsbCB8fCBsKS5sZW5ndGg7XHJcblx0XHRcdFx0XHRmb3IoO2kgPCB4OyBpKyspe1xyXG5cdFx0XHRcdFx0XHR2YXIgaWkgPSAoaSArIFR5cGUubGlzdC5pbmRleCk7XHJcblx0XHRcdFx0XHRcdGlmKGYpe1xyXG5cdFx0XHRcdFx0XHRcdHIgPSBsbGU/IGMuY2FsbChfIHx8IHRoaXMsIGxbbGxbaV1dLCBsbFtpXSwgdCkgOiBjLmNhbGwoXyB8fCB0aGlzLCBsW2ldLCBpaSwgdCk7XHJcblx0XHRcdFx0XHRcdFx0aWYociAhPT0gdSl7IHJldHVybiByIH1cclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHQvL2lmKFR5cGUudGVzdC5pcyhjLGxbaV0pKXsgcmV0dXJuIGlpIH0gLy8gc2hvdWxkIGltcGxlbWVudCBkZWVwIGVxdWFsaXR5IHRlc3RpbmchXHJcblx0XHRcdFx0XHRcdFx0aWYoYyA9PT0gbFtsbGU/IGxsW2ldIDogaV0peyByZXR1cm4gbGw/IGxsW2ldIDogaWkgfSAvLyB1c2UgdGhpcyBmb3Igbm93XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Zm9yKGkgaW4gbCl7XHJcblx0XHRcdFx0XHRcdGlmKGYpe1xyXG5cdFx0XHRcdFx0XHRcdGlmKG9ial9oYXMobCxpKSl7XHJcblx0XHRcdFx0XHRcdFx0XHRyID0gXz8gYy5jYWxsKF8sIGxbaV0sIGksIHQpIDogYyhsW2ldLCBpLCB0KTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmKHIgIT09IHUpeyByZXR1cm4gciB9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdC8vaWYoYS50ZXN0LmlzKGMsbFtpXSkpeyByZXR1cm4gaSB9IC8vIHNob3VsZCBpbXBsZW1lbnQgZGVlcCBlcXVhbGl0eSB0ZXN0aW5nIVxyXG5cdFx0XHRcdFx0XHRcdGlmKGMgPT09IGxbaV0peyByZXR1cm4gaSB9IC8vIHVzZSB0aGlzIGZvciBub3dcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gZj8gdC5yIDogVHlwZS5saXN0LmluZGV4PyAwIDogLTE7XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblx0XHRUeXBlLnRpbWUgPSB7fTtcclxuXHRcdFR5cGUudGltZS5pcyA9IGZ1bmN0aW9uKHQpeyByZXR1cm4gdD8gdCBpbnN0YW5jZW9mIERhdGUgOiAoK25ldyBEYXRlKCkuZ2V0VGltZSgpKSB9XHJcblxyXG5cdFx0dmFyIGZuX2lzID0gVHlwZS5mbi5pcztcclxuXHRcdHZhciBsaXN0X2lzID0gVHlwZS5saXN0LmlzO1xyXG5cdFx0dmFyIG9iaiA9IFR5cGUub2JqLCBvYmpfaXMgPSBvYmouaXMsIG9ial9oYXMgPSBvYmouaGFzLCBvYmpfbWFwID0gb2JqLm1hcDtcclxuXHRcdG1vZHVsZS5leHBvcnRzID0gVHlwZTtcclxuXHR9KShyZXF1aXJlLCAnLi90eXBlJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHQvLyBPbiBldmVudCBlbWl0dGVyIGdlbmVyaWMgamF2YXNjcmlwdCB1dGlsaXR5LlxyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBvbnRvKHRhZywgYXJnLCBhcyl7XHJcblx0XHRcdGlmKCF0YWcpeyByZXR1cm4ge3RvOiBvbnRvfSB9XHJcblx0XHRcdHZhciB0YWcgPSAodGhpcy50YWcgfHwgKHRoaXMudGFnID0ge30pKVt0YWddIHx8XHJcblx0XHRcdCh0aGlzLnRhZ1t0YWddID0ge3RhZzogdGFnLCB0bzogb250by5fID0ge1xyXG5cdFx0XHRcdG5leHQ6IGZ1bmN0aW9uKCl7fVxyXG5cdFx0XHR9fSk7XHJcblx0XHRcdGlmKGFyZyBpbnN0YW5jZW9mIEZ1bmN0aW9uKXtcclxuXHRcdFx0XHR2YXIgYmUgPSB7XHJcblx0XHRcdFx0XHRvZmY6IG9udG8ub2ZmIHx8IFxyXG5cdFx0XHRcdFx0KG9udG8ub2ZmID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdFx0aWYodGhpcy5uZXh0ID09PSBvbnRvLl8ubmV4dCl7IHJldHVybiAhMCB9XHJcblx0XHRcdFx0XHRcdGlmKHRoaXMgPT09IHRoaXMudGhlLmxhc3Qpe1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMudGhlLmxhc3QgPSB0aGlzLmJhY2s7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0dGhpcy50by5iYWNrID0gdGhpcy5iYWNrO1xyXG5cdFx0XHRcdFx0XHR0aGlzLm5leHQgPSBvbnRvLl8ubmV4dDtcclxuXHRcdFx0XHRcdFx0dGhpcy5iYWNrLnRvID0gdGhpcy50bztcclxuXHRcdFx0XHRcdH0pLFxyXG5cdFx0XHRcdFx0dG86IG9udG8uXyxcclxuXHRcdFx0XHRcdG5leHQ6IGFyZyxcclxuXHRcdFx0XHRcdHRoZTogdGFnLFxyXG5cdFx0XHRcdFx0b246IHRoaXMsXHJcblx0XHRcdFx0XHRhczogYXMsXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHQoYmUuYmFjayA9IHRhZy5sYXN0IHx8IHRhZykudG8gPSBiZTtcclxuXHRcdFx0XHRyZXR1cm4gdGFnLmxhc3QgPSBiZTtcclxuXHRcdFx0fVxyXG5cdFx0XHQodGFnID0gdGFnLnRvKS5uZXh0KGFyZyk7XHJcblx0XHRcdHJldHVybiB0YWc7XHJcblx0XHR9O1xyXG5cdH0pKHJlcXVpcmUsICcuL29udG8nKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdC8vIFRPRE86IE5lZWRzIHRvIGJlIHJlZG9uZS5cclxuXHRcdHZhciBPbiA9IHJlcXVpcmUoJy4vb250bycpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIENoYWluKGNyZWF0ZSwgb3B0KXtcclxuXHRcdFx0b3B0ID0gb3B0IHx8IHt9O1xyXG5cdFx0XHRvcHQuaWQgPSBvcHQuaWQgfHwgJyMnO1xyXG5cdFx0XHRvcHQucmlkID0gb3B0LnJpZCB8fCAnQCc7XHJcblx0XHRcdG9wdC51dWlkID0gb3B0LnV1aWQgfHwgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZXR1cm4gKCtuZXcgRGF0ZSgpKSArIE1hdGgucmFuZG9tKCk7XHJcblx0XHRcdH07XHJcblx0XHRcdHZhciBvbiA9IE9uOy8vT24uc2NvcGUoKTtcclxuXHJcblx0XHRcdG9uLnN0dW4gPSBmdW5jdGlvbihjaGFpbil7XHJcblx0XHRcdFx0dmFyIHN0dW4gPSBmdW5jdGlvbihldil7XHJcblx0XHRcdFx0XHRpZihzdHVuLm9mZiAmJiBzdHVuID09PSB0aGlzLnN0dW4pe1xyXG5cdFx0XHRcdFx0XHR0aGlzLnN0dW4gPSBudWxsO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZihvbi5zdHVuLnNraXApe1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZihldil7XHJcblx0XHRcdFx0XHRcdGV2LmNiID0gZXYuZm47XHJcblx0XHRcdFx0XHRcdGV2Lm9mZigpO1xyXG5cdFx0XHRcdFx0XHRyZXMucXVldWUucHVzaChldik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9LCByZXMgPSBzdHVuLnJlcyA9IGZ1bmN0aW9uKHRtcCwgYXMpe1xyXG5cdFx0XHRcdFx0aWYoc3R1bi5vZmYpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0aWYodG1wIGluc3RhbmNlb2YgRnVuY3Rpb24pe1xyXG5cdFx0XHRcdFx0XHRvbi5zdHVuLnNraXAgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHR0bXAuY2FsbChhcyk7XHJcblx0XHRcdFx0XHRcdG9uLnN0dW4uc2tpcCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRzdHVuLm9mZiA9IHRydWU7XHJcblx0XHRcdFx0XHR2YXIgaSA9IDAsIHEgPSByZXMucXVldWUsIGwgPSBxLmxlbmd0aCwgYWN0O1xyXG5cdFx0XHRcdFx0cmVzLnF1ZXVlID0gW107XHJcblx0XHRcdFx0XHRpZihzdHVuID09PSBhdC5zdHVuKXtcclxuXHRcdFx0XHRcdFx0YXQuc3R1biA9IG51bGw7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRmb3IoaTsgaSA8IGw7IGkrKyl7IGFjdCA9IHFbaV07XHJcblx0XHRcdFx0XHRcdGFjdC5mbiA9IGFjdC5jYjtcclxuXHRcdFx0XHRcdFx0YWN0LmNiID0gbnVsbDtcclxuXHRcdFx0XHRcdFx0b24uc3R1bi5za2lwID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0YWN0LmN0eC5vbihhY3QudGFnLCBhY3QuZm4sIGFjdCk7XHJcblx0XHRcdFx0XHRcdG9uLnN0dW4uc2tpcCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sIGF0ID0gY2hhaW4uXztcclxuXHRcdFx0XHRyZXMuYmFjayA9IGF0LnN0dW4gfHwgKGF0LmJhY2t8fHtfOnt9fSkuXy5zdHVuO1xyXG5cdFx0XHRcdGlmKHJlcy5iYWNrKXtcclxuXHRcdFx0XHRcdHJlcy5iYWNrLm5leHQgPSBzdHVuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXMucXVldWUgPSBbXTtcclxuXHRcdFx0XHRhdC5zdHVuID0gc3R1bjsgXHJcblx0XHRcdFx0cmV0dXJuIHJlcztcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gb247XHJcblx0XHRcdHJldHVybjtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHRcdHJldHVybjtcclxuXHRcdFx0dmFyIGFzayA9IG9uLmFzayA9IGZ1bmN0aW9uKGNiLCBhcyl7XHJcblx0XHRcdFx0aWYoIWFzay5vbil7IGFzay5vbiA9IE9uLnNjb3BlKCkgfVxyXG5cdFx0XHRcdHZhciBpZCA9IG9wdC51dWlkKCk7XHJcblx0XHRcdFx0aWYoY2IpeyBhc2sub24oaWQsIGNiLCBhcykgfVxyXG5cdFx0XHRcdHJldHVybiBpZDtcclxuXHRcdFx0fVxyXG5cdFx0XHRhc2suXyA9IG9wdC5pZDtcclxuXHRcdFx0b24uYWNrID0gZnVuY3Rpb24oYXQsIHJlcGx5KXtcclxuXHRcdFx0XHRpZighYXQgfHwgIXJlcGx5IHx8ICFhc2sub24peyByZXR1cm4gfVxyXG5cdFx0XHRcdHZhciBpZCA9IGF0W29wdC5pZF0gfHwgYXQ7XHJcblx0XHRcdFx0aWYoIWFzay5vbnNbaWRdKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRhc2sub24oaWQsIHJlcGx5KTtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRvbi5hY2suXyA9IG9wdC5yaWQ7XHJcblxyXG5cclxuXHRcdFx0cmV0dXJuIG9uO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHRcdHJldHVybjtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHRcdG9uLm9uKCdldmVudCcsIGZ1bmN0aW9uIGV2ZW50KGFjdCl7XHJcblx0XHRcdFx0dmFyIGxhc3QgPSBhY3Qub24ubGFzdCwgdG1wO1xyXG5cdFx0XHRcdGlmKCdpbicgPT09IGFjdC50YWcgJiYgR3VuLmNoYWluLmNoYWluLmlucHV0ICE9PSBhY3QuZm4peyAvLyBUT0RPOiBCVUchIEd1biBpcyBub3QgYXZhaWxhYmxlIGluIHRoaXMgbW9kdWxlLlxyXG5cdFx0XHRcdFx0aWYoKHRtcCA9IGFjdC5jdHgpICYmIHRtcC5zdHVuKXtcclxuXHRcdFx0XHRcdFx0aWYodG1wLnN0dW4oYWN0KSl7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKCFsYXN0KXsgcmV0dXJuIH1cclxuXHRcdFx0XHRpZihhY3Qub24ubWFwKXtcclxuXHRcdFx0XHRcdHZhciBtYXAgPSBhY3Qub24ubWFwLCB2O1xyXG5cdFx0XHRcdFx0Zm9yKHZhciBmIGluIG1hcCl7IHYgPSBtYXBbZl07XHJcblx0XHRcdFx0XHRcdGlmKHYpe1xyXG5cdFx0XHRcdFx0XHRcdGVtaXQodiwgYWN0LCBldmVudCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8qXHJcblx0XHRcdFx0XHRHdW4ub2JqLm1hcChhY3Qub24ubWFwLCBmdW5jdGlvbih2LGYpeyAvLyBUT0RPOiBCVUchIEd1biBpcyBub3QgYXZhaWxhYmxlIGluIHRoaXMgbW9kdWxlLlxyXG5cdFx0XHRcdFx0XHQvL2VtaXQodlswXSwgYWN0LCBldmVudCwgdlsxXSk7IC8vIGJlbG93IGVuYWJsZXMgbW9yZSBjb250cm9sXHJcblx0XHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCJib29vb29vb29cIiwgZix2KTtcclxuXHRcdFx0XHRcdFx0ZW1pdCh2LCBhY3QsIGV2ZW50KTtcclxuXHRcdFx0XHRcdFx0Ly9lbWl0KHZbMV0sIGFjdCwgZXZlbnQsIHZbMl0pO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHQqL1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRlbWl0KGxhc3QsIGFjdCwgZXZlbnQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihsYXN0ICE9PSBhY3Qub24ubGFzdCl7XHJcblx0XHRcdFx0XHRldmVudChhY3QpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdGZ1bmN0aW9uIGVtaXQobGFzdCwgYWN0LCBldmVudCwgZXYpe1xyXG5cdFx0XHRcdGlmKGxhc3QgaW5zdGFuY2VvZiBBcnJheSl7XHJcblx0XHRcdFx0XHRhY3QuZm4uYXBwbHkoYWN0LmFzLCBsYXN0LmNvbmNhdChldnx8YWN0KSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGFjdC5mbi5jYWxsKGFjdC5hcywgbGFzdCwgZXZ8fGFjdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvKm9uLm9uKCdlbWl0JywgZnVuY3Rpb24oZXYpe1xyXG5cdFx0XHRcdGlmKGV2Lm9uLm1hcCl7XHJcblx0XHRcdFx0XHR2YXIgaWQgPSBldi5hcmcudmlhLmd1bi5fLmlkICsgZXYuYXJnLmdldDtcclxuXHRcdFx0XHRcdC8vXHJcblx0XHRcdFx0XHQvL2V2LmlkID0gZXYuaWQgfHwgR3VuLnRleHQucmFuZG9tKDYpO1xyXG5cdFx0XHRcdFx0Ly9ldi5vbi5tYXBbZXYuaWRdID0gZXYuYXJnO1xyXG5cdFx0XHRcdFx0Ly9ldi5wcm94eSA9IGV2LmFyZ1sxXTtcclxuXHRcdFx0XHRcdC8vZXYuYXJnID0gZXYuYXJnWzBdO1xyXG5cdFx0XHRcdFx0Ly8gYmVsb3cgZ2l2ZXMgbW9yZSBjb250cm9sLlxyXG5cdFx0XHRcdFx0ZXYub24ubWFwW2lkXSA9IGV2LmFyZztcclxuXHRcdFx0XHRcdC8vZXYucHJveHkgPSBldi5hcmdbMl07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGV2Lm9uLmxhc3QgPSBldi5hcmc7XHJcblx0XHRcdH0pOyovXHJcblxyXG5cdFx0XHRvbi5vbignZW1pdCcsIGZ1bmN0aW9uKGV2KXtcclxuXHRcdFx0XHR2YXIgZ3VuID0gZXYuYXJnLmd1bjtcclxuXHRcdFx0XHRpZignaW4nID09PSBldi50YWcgJiYgZ3VuICYmICFndW4uXy5zb3VsKXsgLy8gVE9ETzogQlVHISBTb3VsIHNob3VsZCBiZSBhdmFpbGFibGUuIEN1cnJlbnRseSBub3QgdXNpbmcgaXQgdGhvdWdoLCBidXQgc2hvdWxkIGVuYWJsZSBpdCAoY2hlY2sgZm9yIHNpZGUgZWZmZWN0cyBpZiBtYWRlIGF2YWlsYWJsZSkuXHJcblx0XHRcdFx0XHQoZXYub24ubWFwID0gZXYub24ubWFwIHx8IHt9KVtndW4uXy5pZCB8fCAoZ3VuLl8uaWQgPSBNYXRoLnJhbmRvbSgpKV0gPSBldi5hcmc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGV2Lm9uLmxhc3QgPSBldi5hcmc7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gb247XHJcblx0XHR9XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IENoYWluO1xyXG5cdH0pKHJlcXVpcmUsICcuL29uaWZ5Jyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHQvLyBHZW5lcmljIGphdmFzY3JpcHQgc2NoZWR1bGVyIHV0aWxpdHkuXHJcblx0XHR2YXIgVHlwZSA9IHJlcXVpcmUoJy4vdHlwZScpO1xyXG5cdFx0ZnVuY3Rpb24gcyhzdGF0ZSwgY2IsIHRpbWUpeyAvLyBtYXliZSB1c2UgbHJ1LWNhY2hlP1xyXG5cdFx0XHRzLnRpbWUgPSB0aW1lO1xyXG5cdFx0XHRzLndhaXRpbmcucHVzaCh7d2hlbjogc3RhdGUsIGV2ZW50OiBjYiB8fCBmdW5jdGlvbigpe319KTtcclxuXHRcdFx0aWYocy5zb29uZXN0IDwgc3RhdGUpeyByZXR1cm4gfVxyXG5cdFx0XHRzLnNldChzdGF0ZSk7XHJcblx0XHR9XHJcblx0XHRzLndhaXRpbmcgPSBbXTtcclxuXHRcdHMuc29vbmVzdCA9IEluZmluaXR5O1xyXG5cdFx0cy5zb3J0ID0gVHlwZS5saXN0LnNvcnQoJ3doZW4nKTtcclxuXHRcdHMuc2V0ID0gZnVuY3Rpb24oZnV0dXJlKXtcclxuXHRcdFx0aWYoSW5maW5pdHkgPD0gKHMuc29vbmVzdCA9IGZ1dHVyZSkpeyByZXR1cm4gfVxyXG5cdFx0XHR2YXIgbm93ID0gcy50aW1lKCk7XHJcblx0XHRcdGZ1dHVyZSA9IChmdXR1cmUgPD0gbm93KT8gMCA6IChmdXR1cmUgLSBub3cpO1xyXG5cdFx0XHRjbGVhclRpbWVvdXQocy5pZCk7XHJcblx0XHRcdHMuaWQgPSBzZXRUaW1lb3V0KHMuY2hlY2ssIGZ1dHVyZSk7XHJcblx0XHR9XHJcblx0XHRzLmVhY2ggPSBmdW5jdGlvbih3YWl0LCBpLCBtYXApe1xyXG5cdFx0XHR2YXIgY3R4ID0gdGhpcztcclxuXHRcdFx0aWYoIXdhaXQpeyByZXR1cm4gfVxyXG5cdFx0XHRpZih3YWl0LndoZW4gPD0gY3R4Lm5vdyl7XHJcblx0XHRcdFx0aWYod2FpdC5ldmVudCBpbnN0YW5jZW9mIEZ1bmN0aW9uKXtcclxuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgd2FpdC5ldmVudCgpIH0sMCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGN0eC5zb29uZXN0ID0gKGN0eC5zb29uZXN0IDwgd2FpdC53aGVuKT8gY3R4LnNvb25lc3QgOiB3YWl0LndoZW47XHJcblx0XHRcdFx0bWFwKHdhaXQpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRzLmNoZWNrID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIGN0eCA9IHtub3c6IHMudGltZSgpLCBzb29uZXN0OiBJbmZpbml0eX07XHJcblx0XHRcdHMud2FpdGluZy5zb3J0KHMuc29ydCk7XHJcblx0XHRcdHMud2FpdGluZyA9IFR5cGUubGlzdC5tYXAocy53YWl0aW5nLCBzLmVhY2gsIGN0eCkgfHwgW107XHJcblx0XHRcdHMuc2V0KGN0eC5zb29uZXN0KTtcclxuXHRcdH1cclxuXHRcdG1vZHVsZS5leHBvcnRzID0gcztcclxuXHR9KShyZXF1aXJlLCAnLi9zY2hlZHVsZScpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0LyogQmFzZWQgb24gdGhlIEh5cG90aGV0aWNhbCBBbW5lc2lhIE1hY2hpbmUgdGhvdWdodCBleHBlcmltZW50ICovXHJcblx0XHRmdW5jdGlvbiBIQU0obWFjaGluZVN0YXRlLCBpbmNvbWluZ1N0YXRlLCBjdXJyZW50U3RhdGUsIGluY29taW5nVmFsdWUsIGN1cnJlbnRWYWx1ZSl7XHJcblx0XHRcdGlmKG1hY2hpbmVTdGF0ZSA8IGluY29taW5nU3RhdGUpe1xyXG5cdFx0XHRcdHJldHVybiB7ZGVmZXI6IHRydWV9OyAvLyB0aGUgaW5jb21pbmcgdmFsdWUgaXMgb3V0c2lkZSB0aGUgYm91bmRhcnkgb2YgdGhlIG1hY2hpbmUncyBzdGF0ZSwgaXQgbXVzdCBiZSByZXByb2Nlc3NlZCBpbiBhbm90aGVyIHN0YXRlLlxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGluY29taW5nU3RhdGUgPCBjdXJyZW50U3RhdGUpe1xyXG5cdFx0XHRcdHJldHVybiB7aGlzdG9yaWNhbDogdHJ1ZX07IC8vIHRoZSBpbmNvbWluZyB2YWx1ZSBpcyB3aXRoaW4gdGhlIGJvdW5kYXJ5IG9mIHRoZSBtYWNoaW5lJ3Mgc3RhdGUsIGJ1dCBub3Qgd2l0aGluIHRoZSByYW5nZS5cclxuXHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY3VycmVudFN0YXRlIDwgaW5jb21pbmdTdGF0ZSl7XHJcblx0XHRcdFx0cmV0dXJuIHtjb252ZXJnZTogdHJ1ZSwgaW5jb21pbmc6IHRydWV9OyAvLyB0aGUgaW5jb21pbmcgdmFsdWUgaXMgd2l0aGluIGJvdGggdGhlIGJvdW5kYXJ5IGFuZCB0aGUgcmFuZ2Ugb2YgdGhlIG1hY2hpbmUncyBzdGF0ZS5cclxuXHJcblx0XHRcdH1cclxuXHRcdFx0aWYoaW5jb21pbmdTdGF0ZSA9PT0gY3VycmVudFN0YXRlKXtcclxuXHRcdFx0XHRpbmNvbWluZ1ZhbHVlID0gTGV4aWNhbChpbmNvbWluZ1ZhbHVlKSB8fCBcIlwiO1xyXG5cdFx0XHRcdGN1cnJlbnRWYWx1ZSA9IExleGljYWwoY3VycmVudFZhbHVlKSB8fCBcIlwiO1xyXG5cdFx0XHRcdGlmKGluY29taW5nVmFsdWUgPT09IGN1cnJlbnRWYWx1ZSl7IC8vIE5vdGU6IHdoaWxlIHRoZXNlIGFyZSBwcmFjdGljYWxseSB0aGUgc2FtZSwgdGhlIGRlbHRhcyBjb3VsZCBiZSB0ZWNobmljYWxseSBkaWZmZXJlbnRcclxuXHRcdFx0XHRcdHJldHVybiB7c3RhdGU6IHRydWV9O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvKlxyXG5cdFx0XHRcdFx0VGhlIGZvbGxvd2luZyBpcyBhIG5haXZlIGltcGxlbWVudGF0aW9uLCBidXQgd2lsbCBhbHdheXMgd29yay5cclxuXHRcdFx0XHRcdE5ldmVyIGNoYW5nZSBpdCB1bmxlc3MgeW91IGhhdmUgc3BlY2lmaWMgbmVlZHMgdGhhdCBhYnNvbHV0ZWx5IHJlcXVpcmUgaXQuXHJcblx0XHRcdFx0XHRJZiBjaGFuZ2VkLCB5b3VyIGRhdGEgd2lsbCBkaXZlcmdlIHVubGVzcyB5b3UgZ3VhcmFudGVlIGV2ZXJ5IHBlZXIncyBhbGdvcml0aG0gaGFzIGFsc28gYmVlbiBjaGFuZ2VkIHRvIGJlIHRoZSBzYW1lLlxyXG5cdFx0XHRcdFx0QXMgYSByZXN1bHQsIGl0IGlzIGhpZ2hseSBkaXNjb3VyYWdlZCB0byBtb2RpZnkgZGVzcGl0ZSB0aGUgZmFjdCB0aGF0IGl0IGlzIG5haXZlLFxyXG5cdFx0XHRcdFx0YmVjYXVzZSBjb252ZXJnZW5jZSAoZGF0YSBpbnRlZ3JpdHkpIGlzIGdlbmVyYWxseSBtb3JlIGltcG9ydGFudC5cclxuXHRcdFx0XHRcdEFueSBkaWZmZXJlbmNlIGluIHRoaXMgYWxnb3JpdGhtIG11c3QgYmUgZ2l2ZW4gYSBuZXcgYW5kIGRpZmZlcmVudCBuYW1lLlxyXG5cdFx0XHRcdCovXHJcblx0XHRcdFx0aWYoaW5jb21pbmdWYWx1ZSA8IGN1cnJlbnRWYWx1ZSl7IC8vIExleGljYWwgb25seSB3b3JrcyBvbiBzaW1wbGUgdmFsdWUgdHlwZXMhXHJcblx0XHRcdFx0XHRyZXR1cm4ge2NvbnZlcmdlOiB0cnVlLCBjdXJyZW50OiB0cnVlfTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoY3VycmVudFZhbHVlIDwgaW5jb21pbmdWYWx1ZSl7IC8vIExleGljYWwgb25seSB3b3JrcyBvbiBzaW1wbGUgdmFsdWUgdHlwZXMhXHJcblx0XHRcdFx0XHRyZXR1cm4ge2NvbnZlcmdlOiB0cnVlLCBpbmNvbWluZzogdHJ1ZX07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB7ZXJyOiBcIkludmFsaWQgQ1JEVCBEYXRhOiBcIisgaW5jb21pbmdWYWx1ZSArXCIgdG8gXCIrIGN1cnJlbnRWYWx1ZSArXCIgYXQgXCIrIGluY29taW5nU3RhdGUgK1wiIHRvIFwiKyBjdXJyZW50U3RhdGUgK1wiIVwifTtcclxuXHRcdH1cclxuXHRcdGlmKHR5cGVvZiBKU09OID09PSAndW5kZWZpbmVkJyl7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcclxuXHRcdFx0XHQnSlNPTiBpcyBub3QgaW5jbHVkZWQgaW4gdGhpcyBicm93c2VyLiBQbGVhc2UgbG9hZCBpdCBmaXJzdDogJyArXHJcblx0XHRcdFx0J2FqYXguY2RuanMuY29tL2FqYXgvbGlicy9qc29uMi8yMDExMDIyMy9qc29uMi5qcydcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHRcdHZhciBMZXhpY2FsID0gSlNPTi5zdHJpbmdpZnksIHVuZGVmaW5lZDtcclxuXHRcdG1vZHVsZS5leHBvcnRzID0gSEFNO1xyXG5cdH0pKHJlcXVpcmUsICcuL0hBTScpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIFR5cGUgPSByZXF1aXJlKCcuL3R5cGUnKTtcclxuXHRcdHZhciBWYWwgPSB7fTtcclxuXHRcdFZhbC5pcyA9IGZ1bmN0aW9uKHYpeyAvLyBWYWxpZCB2YWx1ZXMgYXJlIGEgc3Vic2V0IG9mIEpTT046IG51bGwsIGJpbmFyeSwgbnVtYmVyICghSW5maW5pdHkpLCB0ZXh0LCBvciBhIHNvdWwgcmVsYXRpb24uIEFycmF5cyBuZWVkIHNwZWNpYWwgYWxnb3JpdGhtcyB0byBoYW5kbGUgY29uY3VycmVuY3ksIHNvIHRoZXkgYXJlIG5vdCBzdXBwb3J0ZWQgZGlyZWN0bHkuIFVzZSBhbiBleHRlbnNpb24gdGhhdCBzdXBwb3J0cyB0aGVtIGlmIG5lZWRlZCBidXQgcmVzZWFyY2ggdGhlaXIgcHJvYmxlbXMgZmlyc3QuXHJcblx0XHRcdGlmKHYgPT09IHUpeyByZXR1cm4gZmFsc2UgfVxyXG5cdFx0XHRpZih2ID09PSBudWxsKXsgcmV0dXJuIHRydWUgfSAvLyBcImRlbGV0ZXNcIiwgbnVsbGluZyBvdXQgZmllbGRzLlxyXG5cdFx0XHRpZih2ID09PSBJbmZpbml0eSl7IHJldHVybiBmYWxzZSB9IC8vIHdlIHdhbnQgdGhpcyB0byBiZSwgYnV0IEpTT04gZG9lcyBub3Qgc3VwcG9ydCBpdCwgc2FkIGZhY2UuXHJcblx0XHRcdGlmKHRleHRfaXModikgLy8gYnkgXCJ0ZXh0XCIgd2UgbWVhbiBzdHJpbmdzLlxyXG5cdFx0XHR8fCBiaV9pcyh2KSAvLyBieSBcImJpbmFyeVwiIHdlIG1lYW4gYm9vbGVhbi5cclxuXHRcdFx0fHwgbnVtX2lzKHYpKXsgLy8gYnkgXCJudW1iZXJcIiB3ZSBtZWFuIGludGVnZXJzIG9yIGRlY2ltYWxzLiBcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTsgLy8gc2ltcGxlIHZhbHVlcyBhcmUgdmFsaWQuXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIFZhbC5yZWwuaXModikgfHwgZmFsc2U7IC8vIGlzIHRoZSB2YWx1ZSBhIHNvdWwgcmVsYXRpb24/IFRoZW4gaXQgaXMgdmFsaWQgYW5kIHJldHVybiBpdC4gSWYgbm90LCBldmVyeXRoaW5nIGVsc2UgcmVtYWluaW5nIGlzIGFuIGludmFsaWQgZGF0YSB0eXBlLiBDdXN0b20gZXh0ZW5zaW9ucyBjYW4gYmUgYnVpbHQgb24gdG9wIG9mIHRoZXNlIHByaW1pdGl2ZXMgdG8gc3VwcG9ydCBvdGhlciB0eXBlcy5cclxuXHRcdH1cclxuXHRcdFZhbC5yZWwgPSB7XzogJyMnfTtcclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0VmFsLnJlbC5pcyA9IGZ1bmN0aW9uKHYpeyAvLyB0aGlzIGRlZmluZXMgd2hldGhlciBhbiBvYmplY3QgaXMgYSBzb3VsIHJlbGF0aW9uIG9yIG5vdCwgdGhleSBsb29rIGxpa2UgdGhpczogeycjJzogJ1VVSUQnfVxyXG5cdFx0XHRcdGlmKHYgJiYgdltyZWxfXSAmJiAhdi5fICYmIG9ial9pcyh2KSl7IC8vIG11c3QgYmUgYW4gb2JqZWN0LlxyXG5cdFx0XHRcdFx0dmFyIG8gPSB7fTtcclxuXHRcdFx0XHRcdG9ial9tYXAodiwgbWFwLCBvKTtcclxuXHRcdFx0XHRcdGlmKG8uaWQpeyAvLyBhIHZhbGlkIGlkIHdhcyBmb3VuZC5cclxuXHRcdFx0XHRcdFx0cmV0dXJuIG8uaWQ7IC8vIHlheSEgUmV0dXJuIGl0LlxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7IC8vIHRoZSB2YWx1ZSB3YXMgbm90IGEgdmFsaWQgc291bCByZWxhdGlvbi5cclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBtYXAocywgZil7IHZhciBvID0gdGhpczsgLy8gbWFwIG92ZXIgdGhlIG9iamVjdC4uLlxyXG5cdFx0XHRcdGlmKG8uaWQpeyByZXR1cm4gby5pZCA9IGZhbHNlIH0gLy8gaWYgSUQgaXMgYWxyZWFkeSBkZWZpbmVkIEFORCB3ZSdyZSBzdGlsbCBsb29waW5nIHRocm91Z2ggdGhlIG9iamVjdCwgaXQgaXMgY29uc2lkZXJlZCBpbnZhbGlkLlxyXG5cdFx0XHRcdGlmKGYgPT0gcmVsXyAmJiB0ZXh0X2lzKHMpKXsgLy8gdGhlIGZpZWxkIHNob3VsZCBiZSAnIycgYW5kIGhhdmUgYSB0ZXh0IHZhbHVlLlxyXG5cdFx0XHRcdFx0by5pZCA9IHM7IC8vIHdlIGZvdW5kIHRoZSBzb3VsIVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gby5pZCA9IGZhbHNlOyAvLyBpZiB0aGVyZSBleGlzdHMgYW55dGhpbmcgZWxzZSBvbiB0aGUgb2JqZWN0IHRoYXQgaXNuJ3QgdGhlIHNvdWwsIHRoZW4gaXQgaXMgY29uc2lkZXJlZCBpbnZhbGlkLlxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdFZhbC5yZWwuaWZ5ID0gZnVuY3Rpb24odCl7IHJldHVybiBvYmpfcHV0KHt9LCByZWxfLCB0KSB9IC8vIGNvbnZlcnQgYSBzb3VsIGludG8gYSByZWxhdGlvbiBhbmQgcmV0dXJuIGl0LlxyXG5cdFx0dmFyIHJlbF8gPSBWYWwucmVsLl8sIHU7XHJcblx0XHR2YXIgYmlfaXMgPSBUeXBlLmJpLmlzO1xyXG5cdFx0dmFyIG51bV9pcyA9IFR5cGUubnVtLmlzO1xyXG5cdFx0dmFyIHRleHRfaXMgPSBUeXBlLnRleHQuaXM7XHJcblx0XHR2YXIgb2JqID0gVHlwZS5vYmosIG9ial9pcyA9IG9iai5pcywgb2JqX3B1dCA9IG9iai5wdXQsIG9ial9tYXAgPSBvYmoubWFwO1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBWYWw7XHJcblx0fSkocmVxdWlyZSwgJy4vdmFsJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgVHlwZSA9IHJlcXVpcmUoJy4vdHlwZScpO1xyXG5cdFx0dmFyIFZhbCA9IHJlcXVpcmUoJy4vdmFsJyk7XHJcblx0XHR2YXIgTm9kZSA9IHtfOiAnXyd9O1xyXG5cdFx0Tm9kZS5zb3VsID0gZnVuY3Rpb24obiwgbyl7IHJldHVybiAobiAmJiBuLl8gJiYgbi5fW28gfHwgc291bF9dKSB9IC8vIGNvbnZlbmllbmNlIGZ1bmN0aW9uIHRvIGNoZWNrIHRvIHNlZSBpZiB0aGVyZSBpcyBhIHNvdWwgb24gYSBub2RlIGFuZCByZXR1cm4gaXQuXHJcblx0XHROb2RlLnNvdWwuaWZ5ID0gZnVuY3Rpb24obiwgbyl7IC8vIHB1dCBhIHNvdWwgb24gYW4gb2JqZWN0LlxyXG5cdFx0XHRvID0gKHR5cGVvZiBvID09PSAnc3RyaW5nJyk/IHtzb3VsOiBvfSA6IG8gfHwge307XHJcblx0XHRcdG4gPSBuIHx8IHt9OyAvLyBtYWtlIHN1cmUgaXQgZXhpc3RzLlxyXG5cdFx0XHRuLl8gPSBuLl8gfHwge307IC8vIG1ha2Ugc3VyZSBtZXRhIGV4aXN0cy5cclxuXHRcdFx0bi5fW3NvdWxfXSA9IG8uc291bCB8fCBuLl9bc291bF9dIHx8IHRleHRfcmFuZG9tKCk7IC8vIHB1dCB0aGUgc291bCBvbiBpdC5cclxuXHRcdFx0cmV0dXJuIG47XHJcblx0XHR9XHJcblx0XHROb2RlLnNvdWwuXyA9IFZhbC5yZWwuXztcclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0Tm9kZS5pcyA9IGZ1bmN0aW9uKG4sIGNiLCBhcyl7IHZhciBzOyAvLyBjaGVja3MgdG8gc2VlIGlmIGFuIG9iamVjdCBpcyBhIHZhbGlkIG5vZGUuXHJcblx0XHRcdFx0aWYoIW9ial9pcyhuKSl7IHJldHVybiBmYWxzZSB9IC8vIG11c3QgYmUgYW4gb2JqZWN0LlxyXG5cdFx0XHRcdGlmKHMgPSBOb2RlLnNvdWwobikpeyAvLyBtdXN0IGhhdmUgYSBzb3VsIG9uIGl0LlxyXG5cdFx0XHRcdFx0cmV0dXJuICFvYmpfbWFwKG4sIG1hcCwge2FzOmFzLGNiOmNiLHM6cyxuOm59KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlOyAvLyBub3BlISBUaGlzIHdhcyBub3QgYSB2YWxpZCBub2RlLlxyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcCh2LCBmKXsgLy8gd2UgaW52ZXJ0IHRoaXMgYmVjYXVzZSB0aGUgd2F5IHdlIGNoZWNrIGZvciB0aGlzIGlzIHZpYSBhIG5lZ2F0aW9uLlxyXG5cdFx0XHRcdGlmKGYgPT09IE5vZGUuXyl7IHJldHVybiB9IC8vIHNraXAgb3ZlciB0aGUgbWV0YWRhdGEuXHJcblx0XHRcdFx0aWYoIVZhbC5pcyh2KSl7IHJldHVybiB0cnVlIH0gLy8gaXQgaXMgdHJ1ZSB0aGF0IHRoaXMgaXMgYW4gaW52YWxpZCBub2RlLlxyXG5cdFx0XHRcdGlmKHRoaXMuY2IpeyB0aGlzLmNiLmNhbGwodGhpcy5hcywgdiwgZiwgdGhpcy5uLCB0aGlzLnMpIH0gLy8gb3B0aW9uYWxseSBjYWxsYmFjayBlYWNoIGZpZWxkL3ZhbHVlLlxyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHROb2RlLmlmeSA9IGZ1bmN0aW9uKG9iaiwgbywgYXMpeyAvLyByZXR1cm5zIGEgbm9kZSBmcm9tIGEgc2hhbGxvdyBvYmplY3QuXHJcblx0XHRcdFx0aWYoIW8peyBvID0ge30gfVxyXG5cdFx0XHRcdGVsc2UgaWYodHlwZW9mIG8gPT09ICdzdHJpbmcnKXsgbyA9IHtzb3VsOiBvfSB9XHJcblx0XHRcdFx0ZWxzZSBpZihvIGluc3RhbmNlb2YgRnVuY3Rpb24peyBvID0ge21hcDogb30gfVxyXG5cdFx0XHRcdGlmKG8ubWFwKXsgby5ub2RlID0gby5tYXAuY2FsbChhcywgb2JqLCB1LCBvLm5vZGUgfHwge30pIH1cclxuXHRcdFx0XHRpZihvLm5vZGUgPSBOb2RlLnNvdWwuaWZ5KG8ubm9kZSB8fCB7fSwgbykpe1xyXG5cdFx0XHRcdFx0b2JqX21hcChvYmosIG1hcCwge286byxhczphc30pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gby5ub2RlOyAvLyBUaGlzIHdpbGwgb25seSBiZSBhIHZhbGlkIG5vZGUgaWYgdGhlIG9iamVjdCB3YXNuJ3QgYWxyZWFkeSBkZWVwIVxyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcCh2LCBmKXsgdmFyIG8gPSB0aGlzLm8sIHRtcCwgdTsgLy8gaXRlcmF0ZSBvdmVyIGVhY2ggZmllbGQvdmFsdWUuXHJcblx0XHRcdFx0aWYoby5tYXApe1xyXG5cdFx0XHRcdFx0dG1wID0gby5tYXAuY2FsbCh0aGlzLmFzLCB2LCAnJytmLCBvLm5vZGUpO1xyXG5cdFx0XHRcdFx0aWYodSA9PT0gdG1wKXtcclxuXHRcdFx0XHRcdFx0b2JqX2RlbChvLm5vZGUsIGYpO1xyXG5cdFx0XHRcdFx0fSBlbHNlXHJcblx0XHRcdFx0XHRpZihvLm5vZGUpeyBvLm5vZGVbZl0gPSB0bXAgfVxyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihWYWwuaXModikpe1xyXG5cdFx0XHRcdFx0by5ub2RlW2ZdID0gdjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblx0XHR2YXIgb2JqID0gVHlwZS5vYmosIG9ial9pcyA9IG9iai5pcywgb2JqX2RlbCA9IG9iai5kZWwsIG9ial9tYXAgPSBvYmoubWFwO1xyXG5cdFx0dmFyIHRleHQgPSBUeXBlLnRleHQsIHRleHRfcmFuZG9tID0gdGV4dC5yYW5kb207XHJcblx0XHR2YXIgc291bF8gPSBOb2RlLnNvdWwuXztcclxuXHRcdHZhciB1O1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBOb2RlO1xyXG5cdH0pKHJlcXVpcmUsICcuL25vZGUnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBUeXBlID0gcmVxdWlyZSgnLi90eXBlJyk7XHJcblx0XHR2YXIgTm9kZSA9IHJlcXVpcmUoJy4vbm9kZScpO1xyXG5cdFx0ZnVuY3Rpb24gU3RhdGUoKXtcclxuXHRcdFx0dmFyIHQ7XHJcblx0XHRcdGlmKHBlcmYpe1xyXG5cdFx0XHRcdHQgPSBzdGFydCArIHBlcmYubm93KCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dCA9IHRpbWUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihsYXN0IDwgdCl7XHJcblx0XHRcdFx0cmV0dXJuIE4gPSAwLCBsYXN0ID0gdCArIFN0YXRlLmRyaWZ0O1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBsYXN0ID0gdCArICgoTiArPSAxKSAvIEQpICsgU3RhdGUuZHJpZnQ7XHJcblx0XHR9XHJcblx0XHR2YXIgdGltZSA9IFR5cGUudGltZS5pcywgbGFzdCA9IC1JbmZpbml0eSwgTiA9IDAsIEQgPSAxMDAwOyAvLyBXQVJOSU5HISBJbiB0aGUgZnV0dXJlLCBvbiBtYWNoaW5lcyB0aGF0IGFyZSBEIHRpbWVzIGZhc3RlciB0aGFuIDIwMTZBRCBtYWNoaW5lcywgeW91IHdpbGwgd2FudCB0byBpbmNyZWFzZSBEIGJ5IGFub3RoZXIgc2V2ZXJhbCBvcmRlcnMgb2YgbWFnbml0dWRlIHNvIHRoZSBwcm9jZXNzaW5nIHNwZWVkIG5ldmVyIG91dCBwYWNlcyB0aGUgZGVjaW1hbCByZXNvbHV0aW9uIChpbmNyZWFzaW5nIGFuIGludGVnZXIgZWZmZWN0cyB0aGUgc3RhdGUgYWNjdXJhY3kpLlxyXG5cdFx0dmFyIHBlcmYgPSAodHlwZW9mIHBlcmZvcm1hbmNlICE9PSAndW5kZWZpbmVkJyk/IChwZXJmb3JtYW5jZS50aW1pbmcgJiYgcGVyZm9ybWFuY2UpIDogZmFsc2UsIHN0YXJ0ID0gKHBlcmYgJiYgcGVyZi50aW1pbmcgJiYgcGVyZi50aW1pbmcubmF2aWdhdGlvblN0YXJ0KSB8fCAocGVyZiA9IGZhbHNlKTtcclxuXHRcdFN0YXRlLl8gPSAnPic7XHJcblx0XHRTdGF0ZS5kcmlmdCA9IDA7XHJcblx0XHRTdGF0ZS5pcyA9IGZ1bmN0aW9uKG4sIGYsIG8peyAvLyBjb252ZW5pZW5jZSBmdW5jdGlvbiB0byBnZXQgdGhlIHN0YXRlIG9uIGEgZmllbGQgb24gYSBub2RlIGFuZCByZXR1cm4gaXQuXHJcblx0XHRcdHZhciB0bXAgPSAoZiAmJiBuICYmIG5bTl9dICYmIG5bTl9dW1N0YXRlLl9dKSB8fCBvO1xyXG5cdFx0XHRpZighdG1wKXsgcmV0dXJuIH1cclxuXHRcdFx0cmV0dXJuIG51bV9pcyh0bXAgPSB0bXBbZl0pPyB0bXAgOiAtSW5maW5pdHk7XHJcblx0XHR9XHJcblx0XHRTdGF0ZS5pZnkgPSBmdW5jdGlvbihuLCBmLCBzLCB2LCBzb3VsKXsgLy8gcHV0IGEgZmllbGQncyBzdGF0ZSBvbiBhIG5vZGUuXHJcblx0XHRcdGlmKCFuIHx8ICFuW05fXSl7IC8vIHJlamVjdCBpZiBpdCBpcyBub3Qgbm9kZS1saWtlLlxyXG5cdFx0XHRcdGlmKCFzb3VsKXsgLy8gdW5sZXNzIHRoZXkgcGFzc2VkIGEgc291bFxyXG5cdFx0XHRcdFx0cmV0dXJuOyBcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0biA9IE5vZGUuc291bC5pZnkobiwgc291bCk7IC8vIHRoZW4gbWFrZSBpdCBzbyFcclxuXHRcdFx0fSBcclxuXHRcdFx0dmFyIHRtcCA9IG9ial9hcyhuW05fXSwgU3RhdGUuXyk7IC8vIGdyYWIgdGhlIHN0YXRlcyBkYXRhLlxyXG5cdFx0XHRpZih1ICE9PSBmICYmIGYgIT09IE5fKXtcclxuXHRcdFx0XHRpZihudW1faXMocykpe1xyXG5cdFx0XHRcdFx0dG1wW2ZdID0gczsgLy8gYWRkIHRoZSB2YWxpZCBzdGF0ZS5cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYodSAhPT0gdil7IC8vIE5vdGU6IE5vdCBpdHMgam9iIHRvIGNoZWNrIGZvciB2YWxpZCB2YWx1ZXMhXHJcblx0XHRcdFx0XHRuW2ZdID0gdjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIG47XHJcblx0XHR9XHJcblx0XHRTdGF0ZS50byA9IGZ1bmN0aW9uKGZyb20sIGYsIHRvKXtcclxuXHRcdFx0dmFyIHZhbCA9IGZyb21bZl07XHJcblx0XHRcdGlmKG9ial9pcyh2YWwpKXtcclxuXHRcdFx0XHR2YWwgPSBvYmpfY29weSh2YWwpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBTdGF0ZS5pZnkodG8sIGYsIFN0YXRlLmlzKGZyb20sIGYpLCB2YWwsIE5vZGUuc291bChmcm9tKSk7XHJcblx0XHR9XHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFN0YXRlLm1hcCA9IGZ1bmN0aW9uKGNiLCBzLCBhcyl7IHZhciB1OyAvLyBmb3IgdXNlIHdpdGggTm9kZS5pZnlcclxuXHRcdFx0XHR2YXIgbyA9IG9ial9pcyhvID0gY2IgfHwgcyk/IG8gOiBudWxsO1xyXG5cdFx0XHRcdGNiID0gZm5faXMoY2IgPSBjYiB8fCBzKT8gY2IgOiBudWxsO1xyXG5cdFx0XHRcdGlmKG8gJiYgIWNiKXtcclxuXHRcdFx0XHRcdHMgPSBudW1faXMocyk/IHMgOiBTdGF0ZSgpO1xyXG5cdFx0XHRcdFx0b1tOX10gPSBvW05fXSB8fCB7fTtcclxuXHRcdFx0XHRcdG9ial9tYXAobywgbWFwLCB7bzpvLHM6c30pO1xyXG5cdFx0XHRcdFx0cmV0dXJuIG87XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGFzID0gYXMgfHwgb2JqX2lzKHMpPyBzIDogdTtcclxuXHRcdFx0XHRzID0gbnVtX2lzKHMpPyBzIDogU3RhdGUoKTtcclxuXHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24odiwgZiwgbywgb3B0KXtcclxuXHRcdFx0XHRcdGlmKCFjYil7XHJcblx0XHRcdFx0XHRcdG1hcC5jYWxsKHtvOiBvLCBzOiBzfSwgdixmKTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHY7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjYi5jYWxsKGFzIHx8IHRoaXMgfHwge30sIHYsIGYsIG8sIG9wdCk7XHJcblx0XHRcdFx0XHRpZihvYmpfaGFzKG8sZikgJiYgdSA9PT0gb1tmXSl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRtYXAuY2FsbCh7bzogbywgczogc30sIHYsZik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcCh2LGYpe1xyXG5cdFx0XHRcdGlmKE5fID09PSBmKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRTdGF0ZS5pZnkodGhpcy5vLCBmLCB0aGlzLnMpIDtcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdHZhciBvYmogPSBUeXBlLm9iaiwgb2JqX2FzID0gb2JqLmFzLCBvYmpfaGFzID0gb2JqLmhhcywgb2JqX2lzID0gb2JqLmlzLCBvYmpfbWFwID0gb2JqLm1hcCwgb2JqX2NvcHkgPSBvYmouY29weTtcclxuXHRcdHZhciBudW0gPSBUeXBlLm51bSwgbnVtX2lzID0gbnVtLmlzO1xyXG5cdFx0dmFyIGZuID0gVHlwZS5mbiwgZm5faXMgPSBmbi5pcztcclxuXHRcdHZhciBOXyA9IE5vZGUuXywgdTtcclxuXHRcdG1vZHVsZS5leHBvcnRzID0gU3RhdGU7XHJcblx0fSkocmVxdWlyZSwgJy4vc3RhdGUnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBUeXBlID0gcmVxdWlyZSgnLi90eXBlJyk7XHJcblx0XHR2YXIgVmFsID0gcmVxdWlyZSgnLi92YWwnKTtcclxuXHRcdHZhciBOb2RlID0gcmVxdWlyZSgnLi9ub2RlJyk7XHJcblx0XHR2YXIgR3JhcGggPSB7fTtcclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0R3JhcGguaXMgPSBmdW5jdGlvbihnLCBjYiwgZm4sIGFzKXsgLy8gY2hlY2tzIHRvIHNlZSBpZiBhbiBvYmplY3QgaXMgYSB2YWxpZCBncmFwaC5cclxuXHRcdFx0XHRpZighZyB8fCAhb2JqX2lzKGcpIHx8IG9ial9lbXB0eShnKSl7IHJldHVybiBmYWxzZSB9IC8vIG11c3QgYmUgYW4gb2JqZWN0LlxyXG5cdFx0XHRcdHJldHVybiAhb2JqX21hcChnLCBtYXAsIHtjYjpjYixmbjpmbixhczphc30pOyAvLyBtYWtlcyBzdXJlIGl0IHdhc24ndCBhbiBlbXB0eSBvYmplY3QuXHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbWFwKG4sIHMpeyAvLyB3ZSBpbnZlcnQgdGhpcyBiZWNhdXNlIHRoZSB3YXknPyB3ZSBjaGVjayBmb3IgdGhpcyBpcyB2aWEgYSBuZWdhdGlvbi5cclxuXHRcdFx0XHRpZighbiB8fCBzICE9PSBOb2RlLnNvdWwobikgfHwgIU5vZGUuaXMobiwgdGhpcy5mbiwgdGhpcy5hcykpeyByZXR1cm4gdHJ1ZSB9IC8vIGl0IGlzIHRydWUgdGhhdCB0aGlzIGlzIGFuIGludmFsaWQgZ3JhcGguXHJcblx0XHRcdFx0aWYoIXRoaXMuY2IpeyByZXR1cm4gfVxyXG5cdFx0XHRcdG5mLm4gPSBuOyBuZi5hcyA9IHRoaXMuYXM7IC8vIHNlcXVlbnRpYWwgcmFjZSBjb25kaXRpb25zIGFyZW4ndCByYWNlcy5cclxuXHRcdFx0XHR0aGlzLmNiLmNhbGwobmYuYXMsIG4sIHMsIG5mKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBuZihmbil7IC8vIG9wdGlvbmFsIGNhbGxiYWNrIGZvciBlYWNoIG5vZGUuXHJcblx0XHRcdFx0aWYoZm4peyBOb2RlLmlzKG5mLm4sIGZuLCBuZi5hcykgfSAvLyB3aGVyZSB3ZSB0aGVuIGhhdmUgYW4gb3B0aW9uYWwgY2FsbGJhY2sgZm9yIGVhY2ggZmllbGQvdmFsdWUuXHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdEdyYXBoLmlmeSA9IGZ1bmN0aW9uKG9iaiwgZW52LCBhcyl7XHJcblx0XHRcdFx0dmFyIGF0ID0ge3BhdGg6IFtdLCBvYmo6IG9ian07XHJcblx0XHRcdFx0aWYoIWVudil7XHJcblx0XHRcdFx0XHRlbnYgPSB7fTtcclxuXHRcdFx0XHR9IGVsc2VcclxuXHRcdFx0XHRpZih0eXBlb2YgZW52ID09PSAnc3RyaW5nJyl7XHJcblx0XHRcdFx0XHRlbnYgPSB7c291bDogZW52fTtcclxuXHRcdFx0XHR9IGVsc2VcclxuXHRcdFx0XHRpZihlbnYgaW5zdGFuY2VvZiBGdW5jdGlvbil7XHJcblx0XHRcdFx0XHRlbnYubWFwID0gZW52O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihlbnYuc291bCl7XHJcblx0XHRcdFx0XHRhdC5yZWwgPSBWYWwucmVsLmlmeShlbnYuc291bCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVudi5ncmFwaCA9IGVudi5ncmFwaCB8fCB7fTtcclxuXHRcdFx0XHRlbnYuc2VlbiA9IGVudi5zZWVuIHx8IFtdO1xyXG5cdFx0XHRcdGVudi5hcyA9IGVudi5hcyB8fCBhcztcclxuXHRcdFx0XHRub2RlKGVudiwgYXQpO1xyXG5cdFx0XHRcdGVudi5yb290ID0gYXQubm9kZTtcclxuXHRcdFx0XHRyZXR1cm4gZW52LmdyYXBoO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG5vZGUoZW52LCBhdCl7IHZhciB0bXA7XHJcblx0XHRcdFx0aWYodG1wID0gc2VlbihlbnYsIGF0KSl7IHJldHVybiB0bXAgfVxyXG5cdFx0XHRcdGF0LmVudiA9IGVudjtcclxuXHRcdFx0XHRhdC5zb3VsID0gc291bDtcclxuXHRcdFx0XHRpZihOb2RlLmlmeShhdC5vYmosIG1hcCwgYXQpKXtcclxuXHRcdFx0XHRcdC8vYXQucmVsID0gYXQucmVsIHx8IFZhbC5yZWwuaWZ5KE5vZGUuc291bChhdC5ub2RlKSk7XHJcblx0XHRcdFx0XHRlbnYuZ3JhcGhbVmFsLnJlbC5pcyhhdC5yZWwpXSA9IGF0Lm5vZGU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBhdDtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBtYXAodixmLG4pe1xyXG5cdFx0XHRcdHZhciBhdCA9IHRoaXMsIGVudiA9IGF0LmVudiwgaXMsIHRtcDtcclxuXHRcdFx0XHRpZihOb2RlLl8gPT09IGYgJiYgb2JqX2hhcyh2LFZhbC5yZWwuXykpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIG4uXzsgLy8gVE9ETzogQnVnP1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZighKGlzID0gdmFsaWQodixmLG4sIGF0LGVudikpKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRpZighZil7XHJcblx0XHRcdFx0XHRhdC5ub2RlID0gYXQubm9kZSB8fCBuIHx8IHt9O1xyXG5cdFx0XHRcdFx0aWYob2JqX2hhcyh2LCBOb2RlLl8pKXtcclxuXHRcdFx0XHRcdFx0YXQubm9kZS5fID0gb2JqX2NvcHkodi5fKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGF0Lm5vZGUgPSBOb2RlLnNvdWwuaWZ5KGF0Lm5vZGUsIFZhbC5yZWwuaXMoYXQucmVsKSk7XHJcblx0XHRcdFx0XHRhdC5yZWwgPSBhdC5yZWwgfHwgVmFsLnJlbC5pZnkoTm9kZS5zb3VsKGF0Lm5vZGUpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYodG1wID0gZW52Lm1hcCl7XHJcblx0XHRcdFx0XHR0bXAuY2FsbChlbnYuYXMgfHwge30sIHYsZixuLCBhdCk7XHJcblx0XHRcdFx0XHRpZihvYmpfaGFzKG4sZikpe1xyXG5cdFx0XHRcdFx0XHR2ID0gbltmXTtcclxuXHRcdFx0XHRcdFx0aWYodSA9PT0gdil7XHJcblx0XHRcdFx0XHRcdFx0b2JqX2RlbChuLCBmKTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYoIShpcyA9IHZhbGlkKHYsZixuLCBhdCxlbnYpKSl7IHJldHVybiB9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKCFmKXsgcmV0dXJuIGF0Lm5vZGUgfVxyXG5cdFx0XHRcdGlmKHRydWUgPT09IGlzKXtcclxuXHRcdFx0XHRcdHJldHVybiB2O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0bXAgPSBub2RlKGVudiwge29iajogdiwgcGF0aDogYXQucGF0aC5jb25jYXQoZil9KTtcclxuXHRcdFx0XHRpZighdG1wLm5vZGUpeyByZXR1cm4gfVxyXG5cdFx0XHRcdHJldHVybiB0bXAucmVsOyAvL3snIyc6IE5vZGUuc291bCh0bXAubm9kZSl9O1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIHNvdWwoaWQpeyB2YXIgYXQgPSB0aGlzO1xyXG5cdFx0XHRcdHZhciBwcmV2ID0gVmFsLnJlbC5pcyhhdC5yZWwpLCBncmFwaCA9IGF0LmVudi5ncmFwaDtcclxuXHRcdFx0XHRhdC5yZWwgPSBhdC5yZWwgfHwgVmFsLnJlbC5pZnkoaWQpO1xyXG5cdFx0XHRcdGF0LnJlbFtWYWwucmVsLl9dID0gaWQ7XHJcblx0XHRcdFx0aWYoYXQubm9kZSAmJiBhdC5ub2RlW05vZGUuX10pe1xyXG5cdFx0XHRcdFx0YXQubm9kZVtOb2RlLl9dW1ZhbC5yZWwuX10gPSBpZDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYob2JqX2hhcyhncmFwaCwgcHJldikpe1xyXG5cdFx0XHRcdFx0Z3JhcGhbaWRdID0gZ3JhcGhbcHJldl07XHJcblx0XHRcdFx0XHRvYmpfZGVsKGdyYXBoLCBwcmV2KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gdmFsaWQodixmLG4sIGF0LGVudil7IHZhciB0bXA7XHJcblx0XHRcdFx0aWYoVmFsLmlzKHYpKXsgcmV0dXJuIHRydWUgfVxyXG5cdFx0XHRcdGlmKG9ial9pcyh2KSl7IHJldHVybiAxIH1cclxuXHRcdFx0XHRpZih0bXAgPSBlbnYuaW52YWxpZCl7XHJcblx0XHRcdFx0XHR2ID0gdG1wLmNhbGwoZW52LmFzIHx8IHt9LCB2LGYsbik7XHJcblx0XHRcdFx0XHRyZXR1cm4gdmFsaWQodixmLG4sIGF0LGVudik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVudi5lcnIgPSBcIkludmFsaWQgdmFsdWUgYXQgJ1wiICsgYXQucGF0aC5jb25jYXQoZikuam9pbignLicpICsgXCInIVwiO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIHNlZW4oZW52LCBhdCl7XHJcblx0XHRcdFx0dmFyIGFyciA9IGVudi5zZWVuLCBpID0gYXJyLmxlbmd0aCwgaGFzO1xyXG5cdFx0XHRcdHdoaWxlKGktLSl7IGhhcyA9IGFycltpXTtcclxuXHRcdFx0XHRcdGlmKGF0Lm9iaiA9PT0gaGFzLm9iail7IHJldHVybiBoYXMgfVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRhcnIucHVzaChhdCk7XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblx0XHRHcmFwaC5ub2RlID0gZnVuY3Rpb24obm9kZSl7XHJcblx0XHRcdHZhciBzb3VsID0gTm9kZS5zb3VsKG5vZGUpO1xyXG5cdFx0XHRpZighc291bCl7IHJldHVybiB9XHJcblx0XHRcdHJldHVybiBvYmpfcHV0KHt9LCBzb3VsLCBub2RlKTtcclxuXHRcdH1cclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0R3JhcGgudG8gPSBmdW5jdGlvbihncmFwaCwgcm9vdCwgb3B0KXtcclxuXHRcdFx0XHRpZighZ3JhcGgpeyByZXR1cm4gfVxyXG5cdFx0XHRcdHZhciBvYmogPSB7fTtcclxuXHRcdFx0XHRvcHQgPSBvcHQgfHwge3NlZW46IHt9fTtcclxuXHRcdFx0XHRvYmpfbWFwKGdyYXBoW3Jvb3RdLCBtYXAsIHtvYmo6b2JqLCBncmFwaDogZ3JhcGgsIG9wdDogb3B0fSk7XHJcblx0XHRcdFx0cmV0dXJuIG9iajtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBtYXAodixmKXsgdmFyIHRtcCwgb2JqO1xyXG5cdFx0XHRcdGlmKE5vZGUuXyA9PT0gZil7XHJcblx0XHRcdFx0XHRpZihvYmpfZW1wdHkodiwgVmFsLnJlbC5fKSl7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHRoaXMub2JqW2ZdID0gb2JqX2NvcHkodik7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKCEodG1wID0gVmFsLnJlbC5pcyh2KSkpe1xyXG5cdFx0XHRcdFx0dGhpcy5vYmpbZl0gPSB2O1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihvYmogPSB0aGlzLm9wdC5zZWVuW3RtcF0pe1xyXG5cdFx0XHRcdFx0dGhpcy5vYmpbZl0gPSBvYmo7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMub2JqW2ZdID0gdGhpcy5vcHQuc2Vlblt0bXBdID0gR3JhcGgudG8odGhpcy5ncmFwaCwgdG1wLCB0aGlzLm9wdCk7XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblx0XHR2YXIgZm5faXMgPSBUeXBlLmZuLmlzO1xyXG5cdFx0dmFyIG9iaiA9IFR5cGUub2JqLCBvYmpfaXMgPSBvYmouaXMsIG9ial9kZWwgPSBvYmouZGVsLCBvYmpfaGFzID0gb2JqLmhhcywgb2JqX2VtcHR5ID0gb2JqLmVtcHR5LCBvYmpfcHV0ID0gb2JqLnB1dCwgb2JqX21hcCA9IG9iai5tYXAsIG9ial9jb3B5ID0gb2JqLmNvcHk7XHJcblx0XHR2YXIgdTtcclxuXHRcdG1vZHVsZS5leHBvcnRzID0gR3JhcGg7XHJcblx0fSkocmVxdWlyZSwgJy4vZ3JhcGgnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBUeXBlID0gcmVxdWlyZSgnLi90eXBlJyk7XHJcblx0XHRmdW5jdGlvbiBEdXAoKXtcclxuXHRcdFx0dGhpcy5jYWNoZSA9IHt9O1xyXG5cdFx0fVxyXG5cdFx0RHVwLnByb3RvdHlwZS50cmFjayA9IGZ1bmN0aW9uKGlkKXtcclxuXHRcdFx0dGhpcy5jYWNoZVtpZF0gPSBUeXBlLnRpbWUuaXMoKTtcclxuXHRcdFx0aWYgKCF0aGlzLnRvKSB7XHJcblx0XHRcdFx0dGhpcy5nYygpOyAvLyBFbmdhZ2UgR0MuXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGlkO1xyXG5cdFx0fTtcclxuXHRcdER1cC5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbihpZCl7XHJcblx0XHRcdC8vIEhhdmUgd2Ugc2VlbiB0aGlzIElEIHJlY2VudGx5P1xyXG5cdFx0XHRyZXR1cm4gVHlwZS5vYmouaGFzKHRoaXMuY2FjaGUsIGlkKT8gdGhpcy50cmFjayhpZCkgOiBmYWxzZTsgLy8gSW1wb3J0YW50LCBidW1wIHRoZSBJRCdzIGxpdmVsaW5lc3MgaWYgaXQgaGFzIGFscmVhZHkgYmVlbiBzZWVuIGJlZm9yZSAtIHRoaXMgaXMgY3JpdGljYWwgdG8gc3RvcHBpbmcgYnJvYWRjYXN0IHN0b3Jtcy5cclxuXHRcdH1cclxuXHRcdER1cC5wcm90b3R5cGUuZ2MgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgZGUgPSB0aGlzLCBub3cgPSBUeXBlLnRpbWUuaXMoKSwgb2xkZXN0ID0gbm93LCBtYXhBZ2UgPSA1ICogNjAgKiAxMDAwO1xyXG5cdFx0XHQvLyBUT0RPOiBHdW4uc2NoZWR1bGVyIGFscmVhZHkgZG9lcyB0aGlzPyBSZXVzZSB0aGF0LlxyXG5cdFx0XHRUeXBlLm9iai5tYXAoZGUuY2FjaGUsIGZ1bmN0aW9uKHRpbWUsIGlkKXtcclxuXHRcdFx0XHRvbGRlc3QgPSBNYXRoLm1pbihub3csIHRpbWUpO1xyXG5cdFx0XHRcdGlmICgobm93IC0gdGltZSkgPCBtYXhBZ2UpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFR5cGUub2JqLmRlbChkZS5jYWNoZSwgaWQpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0dmFyIGRvbmUgPSBUeXBlLm9iai5lbXB0eShkZS5jYWNoZSk7XHJcblx0XHRcdGlmKGRvbmUpe1xyXG5cdFx0XHRcdGRlLnRvID0gbnVsbDsgLy8gRGlzZW5nYWdlIEdDLlxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgZWxhcHNlZCA9IG5vdyAtIG9sZGVzdDsgLy8gSnVzdCBob3cgb2xkP1xyXG5cdFx0XHR2YXIgbmV4dEdDID0gbWF4QWdlIC0gZWxhcHNlZDsgLy8gSG93IGxvbmcgYmVmb3JlIGl0J3MgdG9vIG9sZD9cclxuXHRcdFx0ZGUudG8gPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IGRlLmdjKCkgfSwgbmV4dEdDKTsgLy8gU2NoZWR1bGUgdGhlIG5leHQgR0MgZXZlbnQuXHJcblx0XHR9XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IER1cDtcclxuXHR9KShyZXF1aXJlLCAnLi9kdXAnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHJcblx0XHRmdW5jdGlvbiBHdW4obyl7XHJcblx0XHRcdGlmKG8gaW5zdGFuY2VvZiBHdW4peyByZXR1cm4gKHRoaXMuXyA9IHtndW46IHRoaXN9KS5ndW4gfVxyXG5cdFx0XHRpZighKHRoaXMgaW5zdGFuY2VvZiBHdW4pKXsgcmV0dXJuIG5ldyBHdW4obykgfVxyXG5cdFx0XHRyZXR1cm4gR3VuLmNyZWF0ZSh0aGlzLl8gPSB7Z3VuOiB0aGlzLCBvcHQ6IG99KTtcclxuXHRcdH1cclxuXHJcblx0XHRHdW4uaXMgPSBmdW5jdGlvbihndW4peyByZXR1cm4gKGd1biBpbnN0YW5jZW9mIEd1bikgfVxyXG5cclxuXHRcdEd1bi52ZXJzaW9uID0gMC43O1xyXG5cclxuXHRcdEd1bi5jaGFpbiA9IEd1bi5wcm90b3R5cGU7XHJcblx0XHRHdW4uY2hhaW4udG9KU09OID0gZnVuY3Rpb24oKXt9O1xyXG5cclxuXHRcdHZhciBUeXBlID0gcmVxdWlyZSgnLi90eXBlJyk7XHJcblx0XHRUeXBlLm9iai50byhUeXBlLCBHdW4pO1xyXG5cdFx0R3VuLkhBTSA9IHJlcXVpcmUoJy4vSEFNJyk7XHJcblx0XHRHdW4udmFsID0gcmVxdWlyZSgnLi92YWwnKTtcclxuXHRcdEd1bi5ub2RlID0gcmVxdWlyZSgnLi9ub2RlJyk7XHJcblx0XHRHdW4uc3RhdGUgPSByZXF1aXJlKCcuL3N0YXRlJyk7XHJcblx0XHRHdW4uZ3JhcGggPSByZXF1aXJlKCcuL2dyYXBoJyk7XHJcblx0XHRHdW4uZHVwID0gcmVxdWlyZSgnLi9kdXAnKTtcclxuXHRcdEd1bi5zY2hlZHVsZSA9IHJlcXVpcmUoJy4vc2NoZWR1bGUnKTtcclxuXHRcdEd1bi5vbiA9IHJlcXVpcmUoJy4vb25pZnknKSgpO1xyXG5cdFx0XHJcblx0XHRHdW4uXyA9IHsgLy8gc29tZSByZXNlcnZlZCBrZXkgd29yZHMsIHRoZXNlIGFyZSBub3QgdGhlIG9ubHkgb25lcy5cclxuXHRcdFx0bm9kZTogR3VuLm5vZGUuXyAvLyBhbGwgbWV0YWRhdGEgb2YgYSBub2RlIGlzIHN0b3JlZCBpbiB0aGUgbWV0YSBwcm9wZXJ0eSBvbiB0aGUgbm9kZS5cclxuXHRcdFx0LHNvdWw6IEd1bi52YWwucmVsLl8gLy8gYSBzb3VsIGlzIGEgVVVJRCBvZiBhIG5vZGUgYnV0IGl0IGFsd2F5cyBwb2ludHMgdG8gdGhlIFwibGF0ZXN0XCIgZGF0YSBrbm93bi5cclxuXHRcdFx0LHN0YXRlOiBHdW4uc3RhdGUuXyAvLyBvdGhlciB0aGFuIHRoZSBzb3VsLCB3ZSBzdG9yZSBIQU0gbWV0YWRhdGEuXHJcblx0XHRcdCxmaWVsZDogJy4nIC8vIGEgZmllbGQgaXMgYSBwcm9wZXJ0eSBvbiBhIG5vZGUgd2hpY2ggcG9pbnRzIHRvIGEgdmFsdWUuXHJcblx0XHRcdCx2YWx1ZTogJz0nIC8vIHRoZSBwcmltaXRpdmUgdmFsdWUuXHJcblx0XHR9XHJcblxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRHdW4uY3JlYXRlID0gZnVuY3Rpb24oYXQpe1xyXG5cdFx0XHRcdGF0Lm9uID0gYXQub24gfHwgR3VuLm9uO1xyXG5cdFx0XHRcdGF0LnJvb3QgPSBhdC5yb290IHx8IGF0Lmd1bjtcclxuXHRcdFx0XHRhdC5ncmFwaCA9IGF0LmdyYXBoIHx8IHt9O1xyXG5cdFx0XHRcdGF0LmR1cCA9IGF0LmR1cCB8fCBuZXcgR3VuLmR1cDtcclxuXHRcdFx0XHRhdC5hc2sgPSBHdW4ub24uYXNrO1xyXG5cdFx0XHRcdGF0LmFjayA9IEd1bi5vbi5hY2s7XHJcblx0XHRcdFx0dmFyIGd1biA9IGF0Lmd1bi5vcHQoYXQub3B0KTtcclxuXHRcdFx0XHRpZighYXQub25jZSl7XHJcblx0XHRcdFx0XHRhdC5vbignaW4nLCByb290LCBhdCk7XHJcblx0XHRcdFx0XHRhdC5vbignb3V0Jywgcm9vdCwgYXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRhdC5vbmNlID0gMTtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIHJvb3QoYXQpe1xyXG5cdFx0XHRcdC8vY29uc29sZS5sb2coXCJhZGQgdG8ubmV4dChhdClcIik7IC8vIFRPRE86IEJVRyEhIVxyXG5cdFx0XHRcdHZhciBldiA9IHRoaXMsIGNhdCA9IGV2LmFzLCBjb2F0O1xyXG5cdFx0XHRcdGlmKCFhdC5ndW4peyBhdC5ndW4gPSBjYXQuZ3VuIH1cclxuXHRcdFx0XHRpZighYXRbJyMnXSl7IGF0WycjJ10gPSBHdW4udGV4dC5yYW5kb20oKSB9IC8vIFRPRE86IFVzZSB3aGF0IGlzIHVzZWQgb3RoZXIgcGxhY2VzIGluc3RlYWQuXHJcblx0XHRcdFx0aWYoY2F0LmR1cC5jaGVjayhhdFsnIyddKSl7IHJldHVybiB9XHJcblx0XHRcdFx0aWYoYXRbJ0AnXSl7XHJcblx0XHRcdFx0XHQvLyBUT0RPOiBCVUchIEZvciBtdWx0aS1pbnN0YW5jZXMsIHRoZSBcImFja1wiIHN5c3RlbSBpcyBnbG9iYWxseSBzaGFyZWQsIGJ1dCBpdCBzaG91bGRuJ3QgYmUuXHJcblx0XHRcdFx0XHRpZihjYXQuYWNrKGF0WydAJ10sIGF0KSl7IHJldHVybiB9IC8vIFRPRE86IENvbnNpZGVyIG5vdCByZXR1cm5pbmcgaGVyZSwgbWF5YmUsIHdoZXJlIHRoaXMgd291bGQgbGV0IHRoZSBcImhhbmRzaGFrZVwiIG9uIHN5bmMgb2NjdXIgZm9yIEhvbHkgR3JhaWw/XHJcblx0XHRcdFx0XHRjYXQuZHVwLnRyYWNrKGF0WycjJ10pO1xyXG5cdFx0XHRcdFx0R3VuLm9uKCdvdXQnLCBvYmpfdG8oYXQsIHtndW46IGNhdC5ndW59KSk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhdC5kdXAudHJhY2soYXRbJyMnXSk7XHJcblx0XHRcdFx0Ly9pZihjYXQuYWNrKGF0WydAJ10sIGF0KSl7IHJldHVybiB9XHJcblx0XHRcdFx0Ly9jYXQuYWNrKGF0WydAJ10sIGF0KTtcclxuXHRcdFx0XHRjb2F0ID0gb2JqX3RvKGF0LCB7Z3VuOiBjYXQuZ3VufSk7XHJcblx0XHRcdFx0aWYoYXQuZ2V0KXtcclxuXHRcdFx0XHRcdC8vR3VuLm9uLkdFVChjb2F0KTtcclxuXHRcdFx0XHRcdEd1bi5vbignZ2V0JywgY29hdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGF0LnB1dCl7XHJcblx0XHRcdFx0XHQvL0d1bi5vbi5QVVQoY29hdCk7XHJcblx0XHRcdFx0XHRHdW4ub24oJ3B1dCcsIGNvYXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRHdW4ub24oJ291dCcsIGNvYXQpO1xyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0R3VuLm9uKCdwdXQnLCBmdW5jdGlvbihhdCl7XHJcblx0XHRcdC8vR3VuLm9uLlBVVCA9IGZ1bmN0aW9uKGF0KXtcclxuXHRcdFx0XHRpZighYXRbJyMnXSl7IHJldHVybiB0aGlzLnRvLm5leHQoYXQpIH0gLy8gZm9yIHRlc3RzLlxyXG5cdFx0XHRcdHZhciBldiA9IHRoaXMsIGN0eCA9IHtndW46IGF0Lmd1biwgZ3JhcGg6IGF0Lmd1bi5fLmdyYXBoLCBwdXQ6IHt9LCBtYXA6IHt9LCBtYWNoaW5lOiBHdW4uc3RhdGUoKX07XHJcblx0XHRcdFx0aWYoIUd1bi5ncmFwaC5pcyhhdC5wdXQsIG51bGwsIHZlcmlmeSwgY3R4KSl7IGN0eC5lcnIgPSBcIkVycm9yOiBJbnZhbGlkIGdyYXBoIVwiIH1cclxuXHRcdFx0XHRpZihjdHguZXJyKXsgcmV0dXJuIGN0eC5ndW4ub24oJ2luJywgeydAJzogYXRbJyMnXSwgZXJyOiBHdW4ubG9nKGN0eC5lcnIpIH0pIH1cclxuXHRcdFx0XHRvYmpfbWFwKGN0eC5wdXQsIG1lcmdlLCBjdHgpO1xyXG5cdFx0XHRcdG9ial9tYXAoY3R4Lm1hcCwgbWFwLCBjdHgpO1xyXG5cdFx0XHRcdGlmKHUgIT09IGN0eC5kZWZlcil7XHJcblx0XHRcdFx0XHRHdW4uc2NoZWR1bGUoY3R4LmRlZmVyLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0XHRHdW4ub24oJ3B1dCcsIGF0KTtcclxuXHRcdFx0XHRcdH0sIEd1bi5zdGF0ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKCFjdHguZGlmZil7IHJldHVybiB9XHJcblx0XHRcdFx0ZXYudG8ubmV4dChvYmpfdG8oYXQsIHtwdXQ6IGN0eC5kaWZmfSkpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0ZnVuY3Rpb24gdmVyaWZ5KHZhbCwga2V5LCBub2RlLCBzb3VsKXsgdmFyIGN0eCA9IHRoaXM7XHJcblx0XHRcdFx0dmFyIHN0YXRlID0gR3VuLnN0YXRlLmlzKG5vZGUsIGtleSksIHRtcDtcclxuXHRcdFx0XHRpZighc3RhdGUpeyByZXR1cm4gY3R4LmVyciA9IFwiRXJyb3I6IE5vIHN0YXRlIG9uICdcIitrZXkrXCInIGluIG5vZGUgJ1wiK3NvdWwrXCInIVwiIH1cclxuXHRcdFx0XHR2YXIgdmVydGV4ID0gY3R4LmdyYXBoW3NvdWxdIHx8IGVtcHR5LCB3YXMgPSBHdW4uc3RhdGUuaXModmVydGV4LCBrZXksIHRydWUpLCBrbm93biA9IHZlcnRleFtrZXldO1xyXG5cdFx0XHRcdHZhciBIQU0gPSBHdW4uSEFNKGN0eC5tYWNoaW5lLCBzdGF0ZSwgd2FzLCB2YWwsIGtub3duKTtcclxuXHRcdFx0XHRpZighSEFNLmluY29taW5nKXtcclxuXHRcdFx0XHRcdGlmKEhBTS5kZWZlcil7IC8vIHBpY2sgdGhlIGxvd2VzdFxyXG5cdFx0XHRcdFx0XHRjdHguZGVmZXIgPSAoc3RhdGUgPCAoY3R4LmRlZmVyIHx8IEluZmluaXR5KSk/IHN0YXRlIDogY3R4LmRlZmVyO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjdHgucHV0W3NvdWxdID0gR3VuLnN0YXRlLnRvKG5vZGUsIGtleSwgY3R4LnB1dFtzb3VsXSk7XHJcblx0XHRcdFx0KGN0eC5kaWZmIHx8IChjdHguZGlmZiA9IHt9KSlbc291bF0gPSBHdW4uc3RhdGUudG8obm9kZSwga2V5LCBjdHguZGlmZltzb3VsXSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbWVyZ2Uobm9kZSwgc291bCl7XHJcblx0XHRcdFx0dmFyIHJlZiA9ICgodGhpcy5ndW4uXykubmV4dCB8fCBlbXB0eSlbc291bF07XHJcblx0XHRcdFx0aWYoIXJlZil7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIGF0ID0gdGhpcy5tYXBbc291bF0gPSB7XHJcblx0XHRcdFx0XHRwdXQ6IHRoaXMubm9kZSA9IG5vZGUsXHJcblx0XHRcdFx0XHRnZXQ6IHRoaXMuc291bCA9IHNvdWwsXHJcblx0XHRcdFx0XHRndW46IHRoaXMucmVmID0gcmVmXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRvYmpfbWFwKG5vZGUsIGVhY2gsIHRoaXMpO1xyXG5cdFx0XHRcdEd1bi5vbignbm9kZScsIGF0KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBlYWNoKHZhbCwga2V5KXtcclxuXHRcdFx0XHR2YXIgZ3JhcGggPSB0aGlzLmdyYXBoLCBzb3VsID0gdGhpcy5zb3VsLCBjYXQgPSAodGhpcy5yZWYuXyksIHRtcDtcclxuXHRcdFx0XHRncmFwaFtzb3VsXSA9IEd1bi5zdGF0ZS50byh0aGlzLm5vZGUsIGtleSwgZ3JhcGhbc291bF0pO1xyXG5cdFx0XHRcdChjYXQucHV0IHx8IChjYXQucHV0ID0ge30pKVtrZXldID0gdmFsO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcChhdCwgc291bCl7XHJcblx0XHRcdFx0aWYoIWF0Lmd1bil7IHJldHVybiB9XHJcblx0XHRcdFx0KGF0Lmd1bi5fKS5vbignaW4nLCBhdCk7XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRHdW4ub24oJ2dldCcsIGZ1bmN0aW9uKGF0KXtcclxuXHRcdFx0XHR2YXIgZXYgPSB0aGlzLCBzb3VsID0gYXQuZ2V0W19zb3VsXSwgY2F0ID0gYXQuZ3VuLl8sIG5vZGUgPSBjYXQuZ3JhcGhbc291bF0sIGZpZWxkID0gYXQuZ2V0W19maWVsZF0sIHRtcDtcclxuXHRcdFx0XHR2YXIgbmV4dCA9IGNhdC5uZXh0IHx8IChjYXQubmV4dCA9IHt9KSwgYXMgPSAoKG5leHRbc291bF0gfHwgZW1wdHkpLl8pO1xyXG5cdFx0XHRcdGlmKCFub2RlIHx8ICFhcyl7IHJldHVybiBldi50by5uZXh0KGF0KSB9XHJcblx0XHRcdFx0aWYoZmllbGQpe1xyXG5cdFx0XHRcdFx0aWYoIW9ial9oYXMobm9kZSwgZmllbGQpKXsgcmV0dXJuIGV2LnRvLm5leHQoYXQpIH1cclxuXHRcdFx0XHRcdG5vZGUgPSBHdW4uc3RhdGUudG8obm9kZSwgZmllbGQpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRub2RlID0gR3VuLm9iai5jb3B5KG5vZGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvL2lmKGF0Lmd1biA9PT0gY2F0Lmd1bil7XHJcblx0XHRcdFx0XHRub2RlID0gR3VuLmdyYXBoLm5vZGUobm9kZSk7IC8vIFRPRE86IEJVRyEgQ2xvbmUgbm9kZT9cclxuXHRcdFx0XHQvL30gZWxzZSB7XHJcblx0XHRcdFx0Ly9cdGNhdCA9IChhdC5ndW4uXyk7XHJcblx0XHRcdFx0Ly99XHJcblx0XHRcdFx0dG1wID0gYXMuYWNrO1xyXG5cdFx0XHRcdGNhdC5vbignaW4nLCB7XHJcblx0XHRcdFx0XHQnQCc6IGF0WycjJ10sXHJcblx0XHRcdFx0XHRob3c6ICdtZW0nLFxyXG5cdFx0XHRcdFx0cHV0OiBub2RlLFxyXG5cdFx0XHRcdFx0Z3VuOiBhcy5ndW5cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRpZigwIDwgdG1wKXtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZXYudG8ubmV4dChhdCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSgpKTtcclxuXHRcdFxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRHdW4ub24uYXNrID0gZnVuY3Rpb24oY2IsIGFzKXtcclxuXHRcdFx0XHRpZighdGhpcy5vbil7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIGlkID0gR3VuLnRleHQucmFuZG9tKCk7XHJcblx0XHRcdFx0aWYoY2IpeyB0aGlzLm9uKGlkLCBjYiwgYXMpIH1cclxuXHRcdFx0XHRyZXR1cm4gaWQ7XHJcblx0XHRcdH1cclxuXHRcdFx0R3VuLm9uLmFjayA9IGZ1bmN0aW9uKGF0LCByZXBseSl7XHJcblx0XHRcdFx0aWYoIWF0IHx8ICFyZXBseSB8fCAhdGhpcy5vbil7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIGlkID0gYXRbJyMnXSB8fCBhdDtcclxuXHRcdFx0XHRpZighdGhpcy50YWcgfHwgIXRoaXMudGFnW2lkXSl7IHJldHVybiB9XHJcblx0XHRcdFx0dGhpcy5vbihpZCwgcmVwbHkpO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0R3VuLmNoYWluLm9wdCA9IGZ1bmN0aW9uKG9wdCl7XHJcblx0XHRcdFx0b3B0ID0gb3B0IHx8IHt9O1xyXG5cdFx0XHRcdHZhciBndW4gPSB0aGlzLCBhdCA9IGd1bi5fLCB0bXAgPSBvcHQucGVlcnMgfHwgb3B0O1xyXG5cdFx0XHRcdGlmKCFvYmpfaXMob3B0KSl7IG9wdCA9IHt9IH1cclxuXHRcdFx0XHRpZighb2JqX2lzKGF0Lm9wdCkpeyBhdC5vcHQgPSBvcHQgfVxyXG5cdFx0XHRcdGlmKHRleHRfaXModG1wKSl7IHRtcCA9IFt0bXBdIH1cclxuXHRcdFx0XHRpZihsaXN0X2lzKHRtcCkpe1xyXG5cdFx0XHRcdFx0dG1wID0gb2JqX21hcCh0bXAsIGZ1bmN0aW9uKHVybCwgaSwgbWFwKXtcclxuXHRcdFx0XHRcdFx0bWFwKHVybCwge3VybDogdXJsfSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdGlmKCFvYmpfaXMoYXQub3B0LnBlZXJzKSl7IGF0Lm9wdC5wZWVycyA9IHt9fVxyXG5cdFx0XHRcdFx0YXQub3B0LnBlZXJzID0gb2JqX3RvKHRtcCwgYXQub3B0LnBlZXJzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YXQub3B0LndzYyA9IGF0Lm9wdC53c2MgfHwge3Byb3RvY29sczpudWxsfSBcclxuXHRcdFx0XHRhdC5vcHQucGVlcnMgPSBhdC5vcHQucGVlcnMgfHwge307XHJcblx0XHRcdFx0b2JqX3RvKG9wdCwgYXQub3B0KTsgLy8gY29waWVzIG9wdGlvbnMgb24gdG8gYGF0Lm9wdGAgb25seSBpZiBub3QgYWxyZWFkeSB0YWtlbi5cclxuXHRcdFx0XHRHdW4ub24oJ29wdCcsIGF0KTtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cclxuXHRcdHZhciB0ZXh0X2lzID0gR3VuLnRleHQuaXM7XHJcblx0XHR2YXIgbGlzdF9pcyA9IEd1bi5saXN0LmlzO1xyXG5cdFx0dmFyIG9iaiA9IEd1bi5vYmosIG9ial9pcyA9IG9iai5pcywgb2JqX2hhcyA9IG9iai5oYXMsIG9ial90byA9IG9iai50bywgb2JqX21hcCA9IG9iai5tYXAsIG9ial9jb3B5ID0gb2JqLmNvcHk7XHJcblx0XHR2YXIgX3NvdWwgPSBHdW4uXy5zb3VsLCBfZmllbGQgPSBHdW4uXy5maWVsZCwgcmVsX2lzID0gR3VuLnZhbC5yZWwuaXM7XHJcblx0XHR2YXIgZW1wdHkgPSB7fSwgdTtcclxuXHJcblx0XHRjb25zb2xlLmRlYnVnID0gZnVuY3Rpb24oaSwgcyl7IHJldHVybiAoY29uc29sZS5kZWJ1Zy5pICYmIGkgPT09IGNvbnNvbGUuZGVidWcuaSAmJiBjb25zb2xlLmRlYnVnLmkrKykgJiYgKGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cykgfHwgcykgfTtcclxuXHJcblx0XHRHdW4ubG9nID0gZnVuY3Rpb24oKXsgcmV0dXJuICghR3VuLmxvZy5vZmYgJiYgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKSksIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5qb2luKCcgJykgfVxyXG5cdFx0R3VuLmxvZy5vbmNlID0gZnVuY3Rpb24odyxzLG8peyByZXR1cm4gKG8gPSBHdW4ubG9nLm9uY2UpW3ddID0gb1t3XSB8fCAwLCBvW3ddKysgfHwgR3VuLmxvZyhzKSB9XHJcblxyXG5cdFx0O1wiUGxlYXNlIGRvIG5vdCByZW1vdmUgdGhlc2UgbWVzc2FnZXMgdW5sZXNzIHlvdSBhcmUgcGF5aW5nIGZvciBhIG1vbnRobHkgc3BvbnNvcnNoaXAsIHRoYW5rcyFcIjtcclxuXHRcdEd1bi5sb2cub25jZShcIndlbGNvbWVcIiwgXCJIZWxsbyB3b25kZXJmdWwgcGVyc29uISA6KSBUaGFua3MgZm9yIHVzaW5nIEdVTiwgZmVlbCBmcmVlIHRvIGFzayBmb3IgaGVscCBvbiBodHRwczovL2dpdHRlci5pbS9hbWFyay9ndW4gYW5kIGFzayBTdGFja092ZXJmbG93IHF1ZXN0aW9ucyB0YWdnZWQgd2l0aCAnZ3VuJyFcIik7XHJcblx0XHQ7XCJQbGVhc2UgZG8gbm90IHJlbW92ZSB0aGVzZSBtZXNzYWdlcyB1bmxlc3MgeW91IGFyZSBwYXlpbmcgZm9yIGEgbW9udGhseSBzcG9uc29yc2hpcCwgdGhhbmtzIVwiO1xyXG5cdFx0XHJcblx0XHRpZih0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKXsgd2luZG93Lkd1biA9IEd1biB9XHJcblx0XHRpZih0eXBlb2YgY29tbW9uICE9PSBcInVuZGVmaW5lZFwiKXsgY29tbW9uLmV4cG9ydHMgPSBHdW4gfVxyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBHdW47XHJcblx0fSkocmVxdWlyZSwgJy4vcm9vdCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vcm9vdCcpO1xyXG5cdFx0R3VuLmNoYWluLmJhY2sgPSBmdW5jdGlvbihuLCBvcHQpeyB2YXIgdG1wO1xyXG5cdFx0XHRpZigtMSA9PT0gbiB8fCBJbmZpbml0eSA9PT0gbil7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuXy5yb290O1xyXG5cdFx0XHR9IGVsc2VcclxuXHRcdFx0aWYoMSA9PT0gbil7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuXy5iYWNrIHx8IHRoaXM7XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIGd1biA9IHRoaXMsIGF0ID0gZ3VuLl87XHJcblx0XHRcdGlmKHR5cGVvZiBuID09PSAnc3RyaW5nJyl7XHJcblx0XHRcdFx0biA9IG4uc3BsaXQoJy4nKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihuIGluc3RhbmNlb2YgQXJyYXkpe1xyXG5cdFx0XHRcdHZhciBpID0gMCwgbCA9IG4ubGVuZ3RoLCB0bXAgPSBhdDtcclxuXHRcdFx0XHRmb3IoaTsgaSA8IGw7IGkrKyl7XHJcblx0XHRcdFx0XHR0bXAgPSAodG1wfHxlbXB0eSlbbltpXV07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKHUgIT09IHRtcCl7XHJcblx0XHRcdFx0XHRyZXR1cm4gb3B0PyBndW4gOiB0bXA7XHJcblx0XHRcdFx0fSBlbHNlXHJcblx0XHRcdFx0aWYoKHRtcCA9IGF0LmJhY2spKXtcclxuXHRcdFx0XHRcdHJldHVybiB0bXAuYmFjayhuLCBvcHQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYobiBpbnN0YW5jZW9mIEZ1bmN0aW9uKXtcclxuXHRcdFx0XHR2YXIgeWVzLCB0bXAgPSB7YmFjazogZ3VufTtcclxuXHRcdFx0XHR3aGlsZSgodG1wID0gdG1wLmJhY2spXHJcblx0XHRcdFx0JiYgKHRtcCA9IHRtcC5fKVxyXG5cdFx0XHRcdCYmICEoeWVzID0gbih0bXAsIG9wdCkpKXt9XHJcblx0XHRcdFx0cmV0dXJuIHllcztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0dmFyIGVtcHR5ID0ge30sIHU7XHJcblx0fSkocmVxdWlyZSwgJy4vYmFjaycpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vcm9vdCcpO1xyXG5cdFx0R3VuLmNoYWluLmNoYWluID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIGF0ID0gdGhpcy5fLCBjaGFpbiA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMpLCBjYXQgPSBjaGFpbi5fO1xyXG5cdFx0XHRjYXQucm9vdCA9IHJvb3QgPSBhdC5yb290O1xyXG5cdFx0XHRjYXQuaWQgPSArK3Jvb3QuXy5vbmNlO1xyXG5cdFx0XHRjYXQuYmFjayA9IHRoaXM7XHJcblx0XHRcdGNhdC5vbiA9IEd1bi5vbjtcclxuXHRcdFx0R3VuLm9uKCdjaGFpbicsIGNhdCk7XHJcblx0XHRcdGNhdC5vbignaW4nLCBpbnB1dCwgY2F0KTsgLy8gRm9yICdpbicgaWYgSSBhZGQgbXkgb3duIGxpc3RlbmVycyB0byBlYWNoIHRoZW4gSSBNVVNUIGRvIGl0IGJlZm9yZSBpbiBnZXRzIGNhbGxlZC4gSWYgSSBsaXN0ZW4gZ2xvYmFsbHkgZm9yIGFsbCBpbmNvbWluZyBkYXRhIGluc3RlYWQgdGhvdWdoLCByZWdhcmRsZXNzIG9mIGluZGl2aWR1YWwgbGlzdGVuZXJzLCBJIGNhbiB0cmFuc2Zvcm0gdGhlIGRhdGEgdGhlcmUgYW5kIHRoZW4gYXMgd2VsbC5cclxuXHRcdFx0Y2F0Lm9uKCdvdXQnLCBvdXRwdXQsIGNhdCk7IC8vIEhvd2V2ZXIgZm9yIG91dHB1dCwgdGhlcmUgaXNuJ3QgcmVhbGx5IHRoZSBnbG9iYWwgb3B0aW9uLiBJIG11c3QgbGlzdGVuIGJ5IGFkZGluZyBteSBvd24gbGlzdGVuZXIgaW5kaXZpZHVhbGx5IEJFRk9SRSB0aGlzIG9uZSBpcyBldmVyIGNhbGxlZC5cclxuXHRcdFx0cmV0dXJuIGNoYWluO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gb3V0cHV0KGF0KXtcclxuXHRcdFx0dmFyIGNhdCA9IHRoaXMuYXMsIGd1biA9IGNhdC5ndW4sIHJvb3QgPSBndW4uYmFjaygtMSksIHB1dCwgZ2V0LCBub3csIHRtcDtcclxuXHRcdFx0aWYoIWF0Lmd1bil7XHJcblx0XHRcdFx0YXQuZ3VuID0gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGdldCA9IGF0LmdldCl7XHJcblx0XHRcdFx0aWYodG1wID0gZ2V0W19zb3VsXSl7XHJcblx0XHRcdFx0XHR0bXAgPSAocm9vdC5nZXQodG1wKS5fKTtcclxuXHRcdFx0XHRcdGlmKG9ial9oYXMoZ2V0LCBfZmllbGQpKXtcclxuXHRcdFx0XHRcdFx0aWYob2JqX2hhcyhwdXQgPSB0bXAucHV0LCBnZXQgPSBnZXRbX2ZpZWxkXSkpe1xyXG5cdFx0XHRcdFx0XHRcdHRtcC5vbignaW4nLCB7Z2V0OiB0bXAuZ2V0LCBwdXQ6IEd1bi5zdGF0ZS50byhwdXQsIGdldCksIGd1bjogdG1wLmd1bn0pOyAvLyBUT0RPOiBVZ2x5LCBjbGVhbiB1cD8gU2ltcGxpZnkgYWxsIHRoZXNlIGlmIGNvbmRpdGlvbnMgKHdpdGhvdXQgcnVpbmluZyB0aGUgd2hvbGUgY2hhaW5pbmcgQVBJKT9cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSBlbHNlXHJcblx0XHRcdFx0XHRpZihvYmpfaGFzKHRtcCwgJ3B1dCcpKXtcclxuXHRcdFx0XHRcdC8vaWYodSAhPT0gdG1wLnB1dCl7XHJcblx0XHRcdFx0XHRcdHRtcC5vbignaW4nLCB0bXApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRpZihvYmpfaGFzKGdldCwgX2ZpZWxkKSl7XHJcblx0XHRcdFx0XHRcdGdldCA9IGdldFtfZmllbGRdO1xyXG5cdFx0XHRcdFx0XHR2YXIgbmV4dCA9IGdldD8gKGd1bi5nZXQoZ2V0KS5fKSA6IGNhdDtcclxuXHRcdFx0XHRcdFx0Ly8gVE9ETzogQlVHISBIYW5kbGUgcGx1cmFsIGNoYWlucyBieSBpdGVyYXRpbmcgb3ZlciB0aGVtLlxyXG5cdFx0XHRcdFx0XHQvL2lmKG9ial9oYXMobmV4dCwgJ3B1dCcpKXsgLy8gcG90ZW50aWFsbHkgaW5jb3JyZWN0PyBNYXliZT9cclxuXHRcdFx0XHRcdFx0aWYodSAhPT0gbmV4dC5wdXQpeyAvLyBwb3RlbnRpYWxseSBpbmNvcnJlY3Q/IE1heWJlP1xyXG5cdFx0XHRcdFx0XHRcdC8vbmV4dC50YWdbJ2luJ10ubGFzdC5uZXh0KG5leHQpO1xyXG5cdFx0XHRcdFx0XHRcdG5leHQub24oJ2luJywgbmV4dCk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmKG9ial9oYXMoY2F0LCAncHV0Jykpe1xyXG5cdFx0XHRcdFx0XHQvL2lmKHUgIT09IGNhdC5wdXQpe1xyXG5cdFx0XHRcdFx0XHRcdHZhciB2YWwgPSBjYXQucHV0LCByZWw7XHJcblx0XHRcdFx0XHRcdFx0aWYocmVsID0gR3VuLm5vZGUuc291bCh2YWwpKXtcclxuXHRcdFx0XHRcdFx0XHRcdHZhbCA9IEd1bi52YWwucmVsLmlmeShyZWwpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRpZihyZWwgPSBHdW4udmFsLnJlbC5pcyh2YWwpKXtcclxuXHRcdFx0XHRcdFx0XHRcdGlmKCFhdC5ndW4uXyl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRcdFx0XHQoYXQuZ3VuLl8pLm9uKCdvdXQnLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGdldDogdG1wID0geycjJzogcmVsLCAnLic6IGdldCwgZ3VuOiBhdC5ndW59LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHQnIyc6IHJvb3QuXy5hc2soR3VuLkhBTS5zeW50aCwgdG1wKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0Z3VuOiBhdC5ndW5cclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRpZih1ID09PSB2YWwgfHwgR3VuLnZhbC5pcyh2YWwpKXtcclxuXHRcdFx0XHRcdFx0XHRcdGlmKCFhdC5ndW4uXyl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRcdFx0XHQoYXQuZ3VuLl8pLm9uKCdpbicsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Z2V0OiBnZXQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGd1bjogYXQuZ3VuXHJcblx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0gZWxzZVxyXG5cdFx0XHRcdFx0XHRpZihjYXQubWFwKXtcclxuXHRcdFx0XHRcdFx0XHRvYmpfbWFwKGNhdC5tYXAsIGZ1bmN0aW9uKHByb3h5KXtcclxuXHRcdFx0XHRcdFx0XHRcdHByb3h5LmF0Lm9uKCdpbicsIHByb3h5LmF0KTtcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdFx0aWYoY2F0LnNvdWwpe1xyXG5cdFx0XHRcdFx0XHRcdGlmKCFhdC5ndW4uXyl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRcdFx0KGF0Lmd1bi5fKS5vbignb3V0Jywge1xyXG5cdFx0XHRcdFx0XHRcdFx0Z2V0OiB0bXAgPSB7JyMnOiBjYXQuc291bCwgJy4nOiBnZXQsIGd1bjogYXQuZ3VufSxcclxuXHRcdFx0XHRcdFx0XHRcdCcjJzogcm9vdC5fLmFzayhHdW4uSEFNLnN5bnRoLCB0bXApLFxyXG5cdFx0XHRcdFx0XHRcdFx0Z3VuOiBhdC5ndW5cclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYoY2F0LmdldCl7XHJcblx0XHRcdFx0XHRcdFx0aWYoIWNhdC5iYWNrLl8peyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0XHRcdChjYXQuYmFjay5fKS5vbignb3V0Jywge1xyXG5cdFx0XHRcdFx0XHRcdFx0Z2V0OiBvYmpfcHV0KHt9LCBfZmllbGQsIGNhdC5nZXQpLFxyXG5cdFx0XHRcdFx0XHRcdFx0Z3VuOiBndW5cclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YXQgPSBvYmpfdG8oYXQsIHtnZXQ6IHt9fSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZihvYmpfaGFzKGNhdCwgJ3B1dCcpKXtcclxuXHRcdFx0XHRcdFx0Ly9pZih1ICE9PSBjYXQucHV0KXtcclxuXHRcdFx0XHRcdFx0XHRjYXQub24oJ2luJywgY2F0KTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlXHJcblx0XHRcdFx0XHRcdGlmKGNhdC5tYXApe1xyXG5cdFx0XHRcdFx0XHRcdG9ial9tYXAoY2F0Lm1hcCwgZnVuY3Rpb24ocHJveHkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0cHJveHkuYXQub24oJ2luJywgcHJveHkuYXQpO1xyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmKGNhdC5hY2spe1xyXG5cdFx0XHRcdFx0XHRcdGlmKCFvYmpfaGFzKGNhdCwgJ3B1dCcpKXsgLy8gdSAhPT0gY2F0LnB1dCBpbnN0ZWFkP1xyXG5cdFx0XHRcdFx0XHRcdC8vaWYodSAhPT0gY2F0LnB1dCl7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGNhdC5hY2sgPSAtMTtcclxuXHRcdFx0XHRcdFx0aWYoY2F0LnNvdWwpe1xyXG5cdFx0XHRcdFx0XHRcdGNhdC5vbignb3V0Jywge1xyXG5cdFx0XHRcdFx0XHRcdFx0Z2V0OiB0bXAgPSB7JyMnOiBjYXQuc291bCwgZ3VuOiBjYXQuZ3VufSxcclxuXHRcdFx0XHRcdFx0XHRcdCcjJzogcm9vdC5fLmFzayhHdW4uSEFNLnN5bnRoLCB0bXApLFxyXG5cdFx0XHRcdFx0XHRcdFx0Z3VuOiBjYXQuZ3VuXHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmKGNhdC5nZXQpe1xyXG5cdFx0XHRcdFx0XHRcdGlmKCFjYXQuYmFjay5fKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdFx0XHQoY2F0LmJhY2suXykub24oJ291dCcsIHtcclxuXHRcdFx0XHRcdFx0XHRcdGdldDogb2JqX3B1dCh7fSwgX2ZpZWxkLCBjYXQuZ2V0KSxcclxuXHRcdFx0XHRcdFx0XHRcdGd1bjogY2F0Lmd1blxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQoY2F0LmJhY2suXykub24oJ291dCcsIGF0KTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIGlucHV0KGF0KXtcclxuXHRcdFx0YXQgPSBhdC5fIHx8IGF0O1xyXG5cdFx0XHR2YXIgZXYgPSB0aGlzLCBjYXQgPSB0aGlzLmFzLCBndW4gPSBhdC5ndW4sIGNvYXQgPSBndW4uXywgY2hhbmdlID0gYXQucHV0LCBiYWNrID0gY2F0LmJhY2suXyB8fCBlbXB0eSwgcmVsLCB0bXA7XHJcblx0XHRcdGlmKDAgPiBjYXQuYWNrICYmICFhdC5hY2sgJiYgIUd1bi52YWwucmVsLmlzKGNoYW5nZSkpeyAvLyBmb3IgYmV0dGVyIGJlaGF2aW9yP1xyXG5cdFx0XHRcdGNhdC5hY2sgPSAxO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNhdC5nZXQgJiYgYXQuZ2V0ICE9PSBjYXQuZ2V0KXtcclxuXHRcdFx0XHRhdCA9IG9ial90byhhdCwge2dldDogY2F0LmdldH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNhdC5maWVsZCAmJiBjb2F0ICE9PSBjYXQpe1xyXG5cdFx0XHRcdGF0ID0gb2JqX3RvKGF0LCB7Z3VuOiBjYXQuZ3VufSk7XHJcblx0XHRcdFx0aWYoY29hdC5hY2spe1xyXG5cdFx0XHRcdFx0Y2F0LmFjayA9IGNhdC5hY2sgfHwgY29hdC5hY2s7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHUgPT09IGNoYW5nZSl7XHJcblx0XHRcdFx0ZXYudG8ubmV4dChhdCk7XHJcblx0XHRcdFx0aWYoY2F0LnNvdWwpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGVjaG8oY2F0LCBhdCwgZXYpO1xyXG5cdFx0XHRcdGlmKGNhdC5maWVsZCl7XHJcblx0XHRcdFx0XHRub3QoY2F0LCBhdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG9ial9kZWwoY29hdC5lY2hvLCBjYXQuaWQpO1xyXG5cdFx0XHRcdG9ial9kZWwoY2F0Lm1hcCwgY29hdC5pZCk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNhdC5zb3VsKXtcclxuXHRcdFx0XHRpZihjYXQucm9vdC5fLm5vdyl7IGF0ID0gb2JqX3RvKGF0LCB7cHV0OiBjaGFuZ2UgPSBjb2F0LnB1dH0pIH0gLy8gVE9ETzogVWdseSBoYWNrIGZvciB1bmNhY2hlZCBzeW5jaHJvbm91cyBtYXBzLlxyXG5cdFx0XHRcdGV2LnRvLm5leHQoYXQpO1xyXG5cdFx0XHRcdGVjaG8oY2F0LCBhdCwgZXYpO1xyXG5cdFx0XHRcdG9ial9tYXAoY2hhbmdlLCBtYXAsIHthdDogYXQsIGNhdDogY2F0fSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCEocmVsID0gR3VuLnZhbC5yZWwuaXMoY2hhbmdlKSkpe1xyXG5cdFx0XHRcdGlmKEd1bi52YWwuaXMoY2hhbmdlKSl7XHJcblx0XHRcdFx0XHRpZihjYXQuZmllbGQgfHwgY2F0LnNvdWwpe1xyXG5cdFx0XHRcdFx0XHRub3QoY2F0LCBhdCk7XHJcblx0XHRcdFx0XHR9IGVsc2VcclxuXHRcdFx0XHRcdGlmKGNvYXQuZmllbGQgfHwgY29hdC5zb3VsKXtcclxuXHRcdFx0XHRcdFx0KGNvYXQuZWNobyB8fCAoY29hdC5lY2hvID0ge30pKVtjYXQuaWRdID0gY2F0O1xyXG5cdFx0XHRcdFx0XHQoY2F0Lm1hcCB8fCAoY2F0Lm1hcCA9IHt9KSlbY29hdC5pZF0gPSBjYXQubWFwW2NvYXQuaWRdIHx8IHthdDogY29hdH07XHJcblx0XHRcdFx0XHRcdC8vaWYodSA9PT0gY29hdC5wdXQpeyByZXR1cm4gfSAvLyBOb3QgbmVjZXNzYXJ5IGJ1dCBpbXByb3ZlcyBwZXJmb3JtYW5jZS4gSWYgd2UgaGF2ZSBpdCBidXQgY29hdCBkb2VzIG5vdCwgdGhhdCBtZWFucyB3ZSBnb3QgdGhpbmdzIG91dCBvZiBvcmRlciBhbmQgY29hdCB3aWxsIGdldCBpdC4gT25jZSBjb2F0IGdldHMgaXQsIGl0IHdpbGwgdGVsbCB1cyBhZ2Fpbi5cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGV2LnRvLm5leHQoYXQpO1xyXG5cdFx0XHRcdFx0ZWNobyhjYXQsIGF0LCBldik7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGNhdC5maWVsZCAmJiBjb2F0ICE9PSBjYXQgJiYgb2JqX2hhcyhjb2F0LCAncHV0Jykpe1xyXG5cdFx0XHRcdFx0Y2F0LnB1dCA9IGNvYXQucHV0O1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0aWYoKHJlbCA9IEd1bi5ub2RlLnNvdWwoY2hhbmdlKSkgJiYgY29hdC5maWVsZCl7XHJcblx0XHRcdFx0XHRjb2F0LnB1dCA9IChjYXQucm9vdC5nZXQocmVsKS5fKS5wdXQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGV2LnRvLm5leHQoYXQpO1xyXG5cdFx0XHRcdGVjaG8oY2F0LCBhdCwgZXYpO1xyXG5cdFx0XHRcdHJlbGF0ZShjYXQsIGF0LCBjb2F0LCByZWwpO1xyXG5cdFx0XHRcdG9ial9tYXAoY2hhbmdlLCBtYXAsIHthdDogYXQsIGNhdDogY2F0fSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJlbGF0ZShjYXQsIGF0LCBjb2F0LCByZWwpO1xyXG5cdFx0XHRldi50by5uZXh0KGF0KTtcclxuXHRcdFx0ZWNobyhjYXQsIGF0LCBldik7XHJcblx0XHR9XHJcblx0XHRHdW4uY2hhaW4uY2hhaW4uaW5wdXQgPSBpbnB1dDtcclxuXHRcdGZ1bmN0aW9uIHJlbGF0ZShjYXQsIGF0LCBjb2F0LCByZWwpe1xyXG5cdFx0XHRpZighcmVsIHx8IG5vZGVfID09PSBjYXQuZ2V0KXsgcmV0dXJuIH1cclxuXHRcdFx0dmFyIHRtcCA9IChjYXQucm9vdC5nZXQocmVsKS5fKTtcclxuXHRcdFx0aWYoY2F0LmZpZWxkKXtcclxuXHRcdFx0XHRjb2F0ID0gdG1wO1xyXG5cdFx0XHR9IGVsc2UgXHJcblx0XHRcdGlmKGNvYXQuZmllbGQpe1xyXG5cdFx0XHRcdHJlbGF0ZShjb2F0LCBhdCwgY29hdCwgcmVsKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjb2F0ID09PSBjYXQpeyByZXR1cm4gfVxyXG5cdFx0XHQoY29hdC5lY2hvIHx8IChjb2F0LmVjaG8gPSB7fSkpW2NhdC5pZF0gPSBjYXQ7XHJcblx0XHRcdGlmKGNhdC5maWVsZCAmJiAhKGNhdC5tYXB8fGVtcHR5KVtjb2F0LmlkXSl7XHJcblx0XHRcdFx0bm90KGNhdCwgYXQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRtcCA9IChjYXQubWFwIHx8IChjYXQubWFwID0ge30pKVtjb2F0LmlkXSA9IGNhdC5tYXBbY29hdC5pZF0gfHwge2F0OiBjb2F0fTtcclxuXHRcdFx0aWYocmVsID09PSB0bXAucmVsKXsgcmV0dXJuIH1cclxuXHRcdFx0YXNrKGNhdCwgdG1wLnJlbCA9IHJlbCk7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBlY2hvKGNhdCwgYXQsIGV2KXtcclxuXHRcdFx0aWYoIWNhdC5lY2hvKXsgcmV0dXJuIH0gLy8gfHwgbm9kZV8gPT09IGF0LmdldCA/Pz8/XHJcblx0XHRcdGlmKGNhdC5maWVsZCl7IGF0ID0gb2JqX3RvKGF0LCB7ZXZlbnQ6IGV2fSkgfVxyXG5cdFx0XHRvYmpfbWFwKGNhdC5lY2hvLCByZXZlcmIsIGF0KTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIHJldmVyYihjYXQpe1xyXG5cdFx0XHRjYXQub24oJ2luJywgdGhpcyk7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBtYXAoZGF0YSwga2V5KXsgLy8gTWFwIG92ZXIgb25seSB0aGUgY2hhbmdlcyBvbiBldmVyeSB1cGRhdGUuXHJcblx0XHRcdHZhciBjYXQgPSB0aGlzLmNhdCwgbmV4dCA9IGNhdC5uZXh0IHx8IGVtcHR5LCB2aWEgPSB0aGlzLmF0LCBndW4sIGNoYWluLCBhdCwgdG1wO1xyXG5cdFx0XHRpZihub2RlXyA9PT0ga2V5ICYmICFuZXh0W2tleV0peyByZXR1cm4gfVxyXG5cdFx0XHRpZighKGd1biA9IG5leHRba2V5XSkpe1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRhdCA9IChndW4uXyk7XHJcblx0XHRcdC8vaWYoZGF0YSAmJiBkYXRhW19zb3VsXSAmJiAodG1wID0gR3VuLnZhbC5yZWwuaXMoZGF0YSkpICYmICh0bXAgPSAoY2F0LnJvb3QuZ2V0KHRtcCkuXykpICYmIG9ial9oYXModG1wLCAncHV0Jykpe1xyXG5cdFx0XHQvL1x0ZGF0YSA9IHRtcC5wdXQ7XHJcblx0XHRcdC8vfVxyXG5cdFx0XHRpZihhdC5maWVsZCl7XHJcblx0XHRcdFx0aWYoIShkYXRhICYmIGRhdGFbX3NvdWxdICYmIEd1bi52YWwucmVsLmlzKGRhdGEpID09PSBHdW4ubm9kZS5zb3VsKGF0LnB1dCkpKXtcclxuXHRcdFx0XHRcdGF0LnB1dCA9IGRhdGE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNoYWluID0gZ3VuO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNoYWluID0gdmlhLmd1bi5nZXQoa2V5KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhdC5vbignaW4nLCB7XHJcblx0XHRcdFx0cHV0OiBkYXRhLFxyXG5cdFx0XHRcdGdldDoga2V5LFxyXG5cdFx0XHRcdGd1bjogY2hhaW4sXHJcblx0XHRcdFx0dmlhOiB2aWFcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBub3QoY2F0LCBhdCl7XHJcblx0XHRcdGlmKCEoY2F0LmZpZWxkIHx8IGNhdC5zb3VsKSl7IHJldHVybiB9XHJcblx0XHRcdHZhciB0bXAgPSBjYXQubWFwO1xyXG5cdFx0XHRjYXQubWFwID0gbnVsbDtcclxuXHRcdFx0aWYobnVsbCA9PT0gdG1wKXsgcmV0dXJuIH1cclxuXHRcdFx0aWYodSA9PT0gdG1wICYmIGNhdC5wdXQgIT09IHUpeyByZXR1cm4gfSAvLyBUT0RPOiBCdWc/IFRocmV3IHNlY29uZCBjb25kaXRpb24gaW4gZm9yIGEgcGFydGljdWxhciB0ZXN0LCBub3Qgc3VyZSBpZiBhIGNvdW50ZXIgZXhhbXBsZSBpcyB0ZXN0ZWQgdGhvdWdoLlxyXG5cdFx0XHRvYmpfbWFwKHRtcCwgZnVuY3Rpb24ocHJveHkpe1xyXG5cdFx0XHRcdGlmKCEocHJveHkgPSBwcm94eS5hdCkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdG9ial9kZWwocHJveHkuZWNobywgY2F0LmlkKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdG9ial9tYXAoY2F0Lm5leHQsIGZ1bmN0aW9uKGd1biwga2V5KXtcclxuXHRcdFx0XHR2YXIgY29hdCA9IChndW4uXyk7XHJcblx0XHRcdFx0Y29hdC5wdXQgPSB1O1xyXG5cdFx0XHRcdGlmKGNvYXQuYWNrKXtcclxuXHRcdFx0XHRcdGNvYXQuYWNrID0gLTE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNvYXQub24oJ2luJywge1xyXG5cdFx0XHRcdFx0Z2V0OiBrZXksXHJcblx0XHRcdFx0XHRndW46IGd1bixcclxuXHRcdFx0XHRcdHB1dDogdVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIGFzayhjYXQsIHNvdWwpe1xyXG5cdFx0XHR2YXIgdG1wID0gKGNhdC5yb290LmdldChzb3VsKS5fKTtcclxuXHRcdFx0aWYoY2F0LmFjayl7XHJcblx0XHRcdFx0dG1wLmFjayA9IHRtcC5hY2sgfHwgLTE7XHJcblx0XHRcdFx0dG1wLm9uKCdvdXQnLCB7XHJcblx0XHRcdFx0XHRnZXQ6IHRtcCA9IHsnIyc6IHNvdWwsIGd1bjogdG1wLmd1bn0sXHJcblx0XHRcdFx0XHQnIyc6IGNhdC5yb290Ll8uYXNrKEd1bi5IQU0uc3ludGgsIHRtcClcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0b2JqX21hcChjYXQubmV4dCwgZnVuY3Rpb24oZ3VuLCBrZXkpe1xyXG5cdFx0XHRcdChndW4uXykub24oJ291dCcsIHtcclxuXHRcdFx0XHRcdGdldDogZ3VuID0geycjJzogc291bCwgJy4nOiBrZXksIGd1bjogZ3VufSxcclxuXHRcdFx0XHRcdCcjJzogY2F0LnJvb3QuXy5hc2soR3VuLkhBTS5zeW50aCwgZ3VuKVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdHZhciBlbXB0eSA9IHt9LCB1O1xyXG5cdFx0dmFyIG9iaiA9IEd1bi5vYmosIG9ial9oYXMgPSBvYmouaGFzLCBvYmpfcHV0ID0gb2JqLnB1dCwgb2JqX2RlbCA9IG9iai5kZWwsIG9ial90byA9IG9iai50bywgb2JqX21hcCA9IG9iai5tYXA7XHJcblx0XHR2YXIgX3NvdWwgPSBHdW4uXy5zb3VsLCBfZmllbGQgPSBHdW4uXy5maWVsZCwgbm9kZV8gPSBHdW4ubm9kZS5fO1xyXG5cdH0pKHJlcXVpcmUsICcuL2NoYWluJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9yb290Jyk7XHJcblx0XHRHdW4uY2hhaW4uZ2V0ID0gZnVuY3Rpb24oa2V5LCBjYiwgYXMpe1xyXG5cdFx0XHRpZih0eXBlb2Yga2V5ID09PSAnc3RyaW5nJyl7XHJcblx0XHRcdFx0dmFyIGd1biwgYmFjayA9IHRoaXMsIGNhdCA9IGJhY2suXztcclxuXHRcdFx0XHR2YXIgbmV4dCA9IGNhdC5uZXh0IHx8IGVtcHR5LCB0bXA7XHJcblx0XHRcdFx0aWYoIShndW4gPSBuZXh0W2tleV0pKXtcclxuXHRcdFx0XHRcdGd1biA9IGNhY2hlKGtleSwgYmFjayk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2VcclxuXHRcdFx0aWYoa2V5IGluc3RhbmNlb2YgRnVuY3Rpb24pe1xyXG5cdFx0XHRcdHZhciBndW4gPSB0aGlzLCBhdCA9IGd1bi5fO1xyXG5cdFx0XHRcdGFzID0gY2IgfHwge307XHJcblx0XHRcdFx0YXMudXNlID0ga2V5O1xyXG5cdFx0XHRcdGFzLm91dCA9IGFzLm91dCB8fCB7Y2FwOiAxfTtcclxuXHRcdFx0XHRhcy5vdXQuZ2V0ID0gYXMub3V0LmdldCB8fCB7fTtcclxuXHRcdFx0XHQnXycgIT0gYXQuZ2V0ICYmICgoYXQucm9vdC5fKS5ub3cgPSB0cnVlKTsgLy8gdWdseSBoYWNrIGZvciBub3cuXHJcblx0XHRcdFx0YXQub24oJ2luJywgdXNlLCBhcyk7XHJcblx0XHRcdFx0YXQub24oJ291dCcsIGFzLm91dCk7XHJcblx0XHRcdFx0KGF0LnJvb3QuXykubm93ID0gZmFsc2U7XHJcblx0XHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdFx0fSBlbHNlXHJcblx0XHRcdGlmKG51bV9pcyhrZXkpKXtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5nZXQoJycra2V5LCBjYiwgYXMpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdChhcyA9IHRoaXMuY2hhaW4oKSkuXy5lcnIgPSB7ZXJyOiBHdW4ubG9nKCdJbnZhbGlkIGdldCByZXF1ZXN0IScsIGtleSl9OyAvLyBDTEVBTiBVUFxyXG5cdFx0XHRcdGlmKGNiKXsgY2IuY2FsbChhcywgYXMuXy5lcnIpIH1cclxuXHRcdFx0XHRyZXR1cm4gYXM7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYodG1wID0gY2F0LnN0dW4peyAvLyBUT0RPOiBSZWZhY3Rvcj9cclxuXHRcdFx0XHRndW4uXy5zdHVuID0gZ3VuLl8uc3R1biB8fCB0bXA7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY2IgJiYgY2IgaW5zdGFuY2VvZiBGdW5jdGlvbil7XHJcblx0XHRcdFx0Z3VuLmdldChjYiwgYXMpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBndW47XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBjYWNoZShrZXksIGJhY2spe1xyXG5cdFx0XHR2YXIgY2F0ID0gYmFjay5fLCBuZXh0ID0gY2F0Lm5leHQsIGd1biA9IGJhY2suY2hhaW4oKSwgYXQgPSBndW4uXztcclxuXHRcdFx0aWYoIW5leHQpeyBuZXh0ID0gY2F0Lm5leHQgPSB7fSB9XHJcblx0XHRcdG5leHRbYXQuZ2V0ID0ga2V5XSA9IGd1bjtcclxuXHRcdFx0aWYoY2F0LnJvb3QgPT09IGJhY2speyBhdC5zb3VsID0ga2V5IH1cclxuXHRcdFx0ZWxzZSBpZihjYXQuc291bCB8fCBjYXQuZmllbGQpeyBhdC5maWVsZCA9IGtleSB9XHJcblx0XHRcdHJldHVybiBndW47XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiB1c2UoYXQpe1xyXG5cdFx0XHR2YXIgZXYgPSB0aGlzLCBhcyA9IGV2LmFzLCBndW4gPSBhdC5ndW4sIGNhdCA9IGd1bi5fLCBkYXRhID0gYXQucHV0LCB0bXA7XHJcblx0XHRcdGlmKHUgPT09IGRhdGEpe1xyXG5cdFx0XHRcdGRhdGEgPSBjYXQucHV0O1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCh0bXAgPSBkYXRhKSAmJiB0bXBbcmVsLl9dICYmICh0bXAgPSByZWwuaXModG1wKSkpe1xyXG5cdFx0XHRcdHRtcCA9IChjYXQucm9vdC5nZXQodG1wKS5fKTtcclxuXHRcdFx0XHRpZih1ICE9PSB0bXAucHV0KXtcclxuXHRcdFx0XHRcdGF0ID0gb2JqX3RvKGF0LCB7cHV0OiB0bXAucHV0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGFzLnVzZShhdCwgYXQuZXZlbnQgfHwgZXYpO1xyXG5cdFx0XHRldi50by5uZXh0KGF0KTtcclxuXHRcdH1cclxuXHRcdHZhciBvYmogPSBHdW4ub2JqLCBvYmpfaGFzID0gb2JqLmhhcywgb2JqX3RvID0gR3VuLm9iai50bztcclxuXHRcdHZhciBudW1faXMgPSBHdW4ubnVtLmlzO1xyXG5cdFx0dmFyIHJlbCA9IEd1bi52YWwucmVsLCBub2RlXyA9IEd1bi5ub2RlLl87XHJcblx0XHR2YXIgZW1wdHkgPSB7fSwgdTtcclxuXHR9KShyZXF1aXJlLCAnLi9nZXQnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL3Jvb3QnKTtcclxuXHRcdEd1bi5jaGFpbi5wdXQgPSBmdW5jdGlvbihkYXRhLCBjYiwgYXMpe1xyXG5cdFx0XHQvLyAjc291bC5maWVsZD12YWx1ZT5zdGF0ZVxyXG5cdFx0XHQvLyB+d2hvI3doZXJlLndoZXJlPXdoYXQ+d2hlbkB3YXNcclxuXHRcdFx0Ly8gVE9ETzogQlVHISBQdXQgcHJvYmFibHkgY2Fubm90IGhhbmRsZSBwbHVyYWwgY2hhaW5zIVxyXG5cdFx0XHR2YXIgZ3VuID0gdGhpcywgYXQgPSAoZ3VuLl8pLCByb290ID0gYXQucm9vdCwgdG1wO1xyXG5cdFx0XHRhcyA9IGFzIHx8IHt9O1xyXG5cdFx0XHRhcy5kYXRhID0gZGF0YTtcclxuXHRcdFx0YXMuZ3VuID0gYXMuZ3VuIHx8IGd1bjtcclxuXHRcdFx0aWYodHlwZW9mIGNiID09PSAnc3RyaW5nJyl7XHJcblx0XHRcdFx0YXMuc291bCA9IGNiO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGFzLmFjayA9IGNiO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGF0LnNvdWwpe1xyXG5cdFx0XHRcdGFzLnNvdWwgPSBhdC5zb3VsO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGFzLnNvdWwgfHwgcm9vdCA9PT0gZ3VuKXtcclxuXHRcdFx0XHRpZighb2JqX2lzKGFzLmRhdGEpKXtcclxuXHRcdFx0XHRcdChhcy5hY2t8fG5vb3ApLmNhbGwoYXMsIGFzLm91dCA9IHtlcnI6IEd1bi5sb2coXCJEYXRhIHNhdmVkIHRvIHRoZSByb290IGxldmVsIG9mIHRoZSBncmFwaCBtdXN0IGJlIGEgbm9kZSAoYW4gb2JqZWN0KSwgbm90IGFcIiwgKHR5cGVvZiBhcy5kYXRhKSwgJ29mIFwiJyArIGFzLmRhdGEgKyAnXCIhJyl9KTtcclxuXHRcdFx0XHRcdGlmKGFzLnJlcyl7IGFzLnJlcygpIH1cclxuXHRcdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGFzLmd1biA9IGd1biA9IHJvb3QuZ2V0KGFzLnNvdWwgPSBhcy5zb3VsIHx8IChhcy5ub3QgPSBHdW4ubm9kZS5zb3VsKGFzLmRhdGEpIHx8ICgocm9vdC5fKS5vcHQudXVpZCB8fCBHdW4udGV4dC5yYW5kb20pKCkpKTtcclxuXHRcdFx0XHRhcy5yZWYgPSBhcy5ndW47XHJcblx0XHRcdFx0aWZ5KGFzKTtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKEd1bi5pcyhkYXRhKSl7XHJcblx0XHRcdFx0ZGF0YS5nZXQoZnVuY3Rpb24oYXQsZXYpe2V2Lm9mZigpO1xyXG5cdFx0XHRcdFx0dmFyIHMgPSBHdW4ubm9kZS5zb3VsKGF0LnB1dCk7XHJcblx0XHRcdFx0XHRpZighcyl7R3VuLmxvZyhcIlRoZSByZWZlcmVuY2UgeW91IGFyZSBzYXZpbmcgaXMgYVwiLCB0eXBlb2YgYXQucHV0LCAnXCInKyBhcy5wdXQgKydcIiwgbm90IGEgbm9kZSAob2JqZWN0KSEnKTtyZXR1cm59XHJcblx0XHRcdFx0XHRndW4ucHV0KEd1bi52YWwucmVsLmlmeShzKSwgY2IsIGFzKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFzLnJlZiA9IGFzLnJlZiB8fCAocm9vdCA9PT0gKHRtcCA9IGF0LmJhY2spKT8gZ3VuIDogdG1wO1xyXG5cdFx0XHRpZihhcy5yZWYuXy5zb3VsICYmIEd1bi52YWwuaXMoYXMuZGF0YSkgJiYgYXQuZ2V0KXtcclxuXHRcdFx0XHRhcy5kYXRhID0gb2JqX3B1dCh7fSwgYXQuZ2V0LCBhcy5kYXRhKTtcclxuXHRcdFx0XHRhcy5yZWYucHV0KGFzLmRhdGEsIGFzLnNvdWwsIGFzKTtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFzLnJlZi5nZXQoJ18nKS5nZXQoYW55LCB7YXM6IGFzfSk7XHJcblx0XHRcdGlmKCFhcy5vdXQpe1xyXG5cdFx0XHRcdC8vIFRPRE86IFBlcmYgaWRlYSEgTWFrZSBhIGdsb2JhbCBsb2NrLCB0aGF0IGJsb2NrcyBldmVyeXRoaW5nIHdoaWxlIGl0IGlzIG9uLCBidXQgaWYgaXQgaXMgb24gdGhlIGxvY2sgaXQgZG9lcyB0aGUgZXhwZW5zaXZlIGxvb2t1cCB0byBzZWUgaWYgaXQgaXMgYSBkZXBlbmRlbnQgd3JpdGUgb3Igbm90IGFuZCBpZiBub3QgdGhlbiBpdCBwcm9jZWVkcyBmdWxsIHNwZWVkLiBNZWg/IEZvciB3cml0ZSBoZWF2eSBhc3luYyBhcHBzIHRoYXQgd291bGQgYmUgdGVycmlibGUuXHJcblx0XHRcdFx0YXMucmVzID0gYXMucmVzIHx8IEd1bi5vbi5zdHVuKGFzLnJlZik7XHJcblx0XHRcdFx0YXMuZ3VuLl8uc3R1biA9IGFzLnJlZi5fLnN0dW47XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdH07XHJcblxyXG5cdFx0ZnVuY3Rpb24gaWZ5KGFzKXtcclxuXHRcdFx0YXMuYmF0Y2ggPSBiYXRjaDtcclxuXHRcdFx0dmFyIG9wdCA9IGFzLm9wdHx8e30sIGVudiA9IGFzLmVudiA9IEd1bi5zdGF0ZS5tYXAobWFwLCBvcHQuc3RhdGUpO1xyXG5cdFx0XHRlbnYuc291bCA9IGFzLnNvdWw7XHJcblx0XHRcdGFzLmdyYXBoID0gR3VuLmdyYXBoLmlmeShhcy5kYXRhLCBlbnYsIGFzKTtcclxuXHRcdFx0aWYoZW52LmVycil7XHJcblx0XHRcdFx0KGFzLmFja3x8bm9vcCkuY2FsbChhcywgYXMub3V0ID0ge2VycjogR3VuLmxvZyhlbnYuZXJyKX0pO1xyXG5cdFx0XHRcdGlmKGFzLnJlcyl7IGFzLnJlcygpIH1cclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0YXMuYmF0Y2goKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBiYXRjaCgpeyB2YXIgYXMgPSB0aGlzO1xyXG5cdFx0XHRpZighYXMuZ3JhcGggfHwgb2JqX21hcChhcy5zdHVuLCBubykpeyByZXR1cm4gfVxyXG5cdFx0XHQoYXMucmVzfHxpaWZlKShmdW5jdGlvbigpe1xyXG5cdFx0XHRcdChhcy5yZWYuXykub24oJ291dCcsIHtcclxuXHRcdFx0XHRcdGNhcDogMyxcclxuXHRcdFx0XHRcdGd1bjogYXMucmVmLCBwdXQ6IGFzLm91dCA9IGFzLmVudi5ncmFwaCwgb3B0OiBhcy5vcHQsXHJcblx0XHRcdFx0XHQnIyc6IGFzLmd1bi5iYWNrKC0xKS5fLmFzayhmdW5jdGlvbihhY2speyB0aGlzLm9mZigpOyAvLyBPbmUgcmVzcG9uc2UgaXMgZ29vZCBlbm91Z2ggZm9yIHVzIGN1cnJlbnRseS4gTGF0ZXIgd2UgbWF5IHdhbnQgdG8gYWRqdXN0IHRoaXMuXHJcblx0XHRcdFx0XHRcdGlmKCFhcy5hY2speyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0XHRhcy5hY2soYWNrLCB0aGlzKTtcclxuXHRcdFx0XHRcdH0sIGFzLm9wdClcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSwgYXMpO1xyXG5cdFx0XHRpZihhcy5yZXMpeyBhcy5yZXMoKSB9XHJcblx0XHR9IGZ1bmN0aW9uIG5vKHYsZil7IGlmKHYpeyByZXR1cm4gdHJ1ZSB9IH1cclxuXHJcblx0XHRmdW5jdGlvbiBtYXAodixmLG4sIGF0KXsgdmFyIGFzID0gdGhpcztcclxuXHRcdFx0aWYoZiB8fCAhYXQucGF0aC5sZW5ndGgpeyByZXR1cm4gfVxyXG5cdFx0XHQoYXMucmVzfHxpaWZlKShmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciBwYXRoID0gYXQucGF0aCwgcmVmID0gYXMucmVmLCBvcHQgPSBhcy5vcHQ7XHJcblx0XHRcdFx0dmFyIGkgPSAwLCBsID0gcGF0aC5sZW5ndGg7XHJcblx0XHRcdFx0Zm9yKGk7IGkgPCBsOyBpKyspe1xyXG5cdFx0XHRcdFx0cmVmID0gcmVmLmdldChwYXRoW2ldKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoYXMubm90IHx8IEd1bi5ub2RlLnNvdWwoYXQub2JqKSl7XHJcblx0XHRcdFx0XHR2YXIgaWQgPSBHdW4ubm9kZS5zb3VsKGF0Lm9iaikgfHwgKChhcy5vcHR8fHt9KS51dWlkIHx8IGFzLmd1bi5iYWNrKCdvcHQudXVpZCcpIHx8IEd1bi50ZXh0LnJhbmRvbSkoKTtcclxuXHRcdFx0XHRcdHJlZi5iYWNrKC0xKS5nZXQoaWQpO1xyXG5cdFx0XHRcdFx0YXQuc291bChpZCk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdChhcy5zdHVuID0gYXMuc3R1biB8fCB7fSlbcGF0aF0gPSB0cnVlO1xyXG5cdFx0XHRcdHJlZi5nZXQoJ18nKS5nZXQoc291bCwge2FzOiB7YXQ6IGF0LCBhczogYXN9fSk7XHJcblx0XHRcdH0sIHthczogYXMsIGF0OiBhdH0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHNvdWwoYXQsIGV2KXsgdmFyIGFzID0gdGhpcy5hcywgY2F0ID0gYXMuYXQ7IGFzID0gYXMuYXM7XHJcblx0XHRcdC8vZXYuc3R1bigpOyAvLyBUT0RPOiBCVUchP1xyXG5cdFx0XHRpZighYXQuZ3VuIHx8ICFhdC5ndW4uXy5iYWNrKXsgcmV0dXJuIH0gLy8gVE9ETzogSGFuZGxlXHJcblx0XHRcdGV2Lm9mZigpO1xyXG5cdFx0XHRhdCA9IChhdC5ndW4uXy5iYWNrLl8pO1xyXG5cdFx0XHR2YXIgaWQgPSBHdW4ubm9kZS5zb3VsKGNhdC5vYmopIHx8IEd1bi5ub2RlLnNvdWwoYXQucHV0KSB8fCBHdW4udmFsLnJlbC5pcyhhdC5wdXQpIHx8ICgoYXMub3B0fHx7fSkudXVpZCB8fCBhcy5ndW4uYmFjaygnb3B0LnV1aWQnKSB8fCBHdW4udGV4dC5yYW5kb20pKCk7IC8vIFRPRE86IEJVRyE/IERvIHdlIHJlYWxseSB3YW50IHRoZSBzb3VsIG9mIHRoZSBvYmplY3QgZ2l2ZW4gdG8gdXM/IENvdWxkIHRoYXQgYmUgZGFuZ2Vyb3VzP1xyXG5cdFx0XHRhdC5ndW4uYmFjaygtMSkuZ2V0KGlkKTtcclxuXHRcdFx0Y2F0LnNvdWwoaWQpO1xyXG5cdFx0XHRhcy5zdHVuW2NhdC5wYXRoXSA9IGZhbHNlO1xyXG5cdFx0XHRhcy5iYXRjaCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGFueShhdCwgZXYpe1xyXG5cdFx0XHR2YXIgYXMgPSB0aGlzLmFzO1xyXG5cdFx0XHRpZighYXQuZ3VuIHx8ICFhdC5ndW4uXyl7IHJldHVybiB9IC8vIFRPRE86IEhhbmRsZVxyXG5cdFx0XHRpZihhdC5lcnIpeyAvLyBUT0RPOiBIYW5kbGVcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIlBsZWFzZSByZXBvcnQgdGhpcyBhcyBhbiBpc3N1ZSEgUHV0LmFueS5lcnJcIik7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBjYXQgPSAoYXQuZ3VuLl8uYmFjay5fKSwgZGF0YSA9IGNhdC5wdXQsIG9wdCA9IGFzLm9wdHx8e30sIHJvb3QsIHRtcDtcclxuXHRcdFx0ZXYub2ZmKCk7XHJcblx0XHRcdGlmKGFzLnJlZiAhPT0gYXMuZ3VuKXtcclxuXHRcdFx0XHR0bXAgPSAoYXMuZ3VuLl8pLmdldCB8fCBjYXQuZ2V0O1xyXG5cdFx0XHRcdGlmKCF0bXApeyAvLyBUT0RPOiBIYW5kbGVcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiUGxlYXNlIHJlcG9ydCB0aGlzIGFzIGFuIGlzc3VlISBQdXQubm8uZ2V0XCIpOyAvLyBUT0RPOiBCVUchPz9cclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YXMuZGF0YSA9IG9ial9wdXQoe30sIHRtcCwgYXMuZGF0YSk7XHJcblx0XHRcdFx0dG1wID0gbnVsbDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih1ID09PSBkYXRhKXtcclxuXHRcdFx0XHRpZighY2F0LmdldCl7IHJldHVybiB9IC8vIFRPRE86IEhhbmRsZVxyXG5cdFx0XHRcdGlmKCFjYXQuc291bCl7XHJcblx0XHRcdFx0XHR0bXAgPSBjYXQuZ3VuLmJhY2soZnVuY3Rpb24oYXQpe1xyXG5cdFx0XHRcdFx0XHRpZihhdC5zb3VsKXsgcmV0dXJuIGF0LnNvdWwgfVxyXG5cdFx0XHRcdFx0XHRhcy5kYXRhID0gb2JqX3B1dCh7fSwgYXQuZ2V0LCBhcy5kYXRhKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0bXAgPSB0bXAgfHwgY2F0LmdldDtcclxuXHRcdFx0XHRjYXQgPSAoY2F0LnJvb3QuZ2V0KHRtcCkuXyk7XHJcblx0XHRcdFx0YXMubm90ID0gYXMuc291bCA9IHRtcDtcclxuXHRcdFx0XHRkYXRhID0gYXMuZGF0YTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZighYXMubm90ICYmICEoYXMuc291bCA9IEd1bi5ub2RlLnNvdWwoZGF0YSkpKXtcclxuXHRcdFx0XHRpZihhcy5wYXRoICYmIG9ial9pcyhhcy5kYXRhKSl7IC8vIEFwcGFyZW50bHkgbmVjZXNzYXJ5XHJcblx0XHRcdFx0XHRhcy5zb3VsID0gKG9wdC51dWlkIHx8IGNhdC5yb290Ll8ub3B0LnV1aWQgfHwgR3VuLnRleHQucmFuZG9tKSgpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvL2FzLmRhdGEgPSBvYmpfcHV0KHt9LCBhcy5ndW4uXy5nZXQsIGFzLmRhdGEpO1xyXG5cdFx0XHRcdFx0YXMuc291bCA9IGF0LnNvdWwgfHwgY2F0LnNvdWwgfHwgKG9wdC51dWlkIHx8IGNhdC5yb290Ll8ub3B0LnV1aWQgfHwgR3VuLnRleHQucmFuZG9tKSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRhcy5yZWYucHV0KGFzLmRhdGEsIGFzLnNvdWwsIGFzKTtcclxuXHRcdH1cclxuXHRcdHZhciBvYmogPSBHdW4ub2JqLCBvYmpfaXMgPSBvYmouaXMsIG9ial9wdXQgPSBvYmoucHV0LCBvYmpfbWFwID0gb2JqLm1hcDtcclxuXHRcdHZhciB1LCBlbXB0eSA9IHt9LCBub29wID0gZnVuY3Rpb24oKXt9LCBpaWZlID0gZnVuY3Rpb24oZm4sYXMpe2ZuLmNhbGwoYXN8fGVtcHR5KX07XHJcblx0fSkocmVxdWlyZSwgJy4vcHV0Jyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblxyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vcm9vdCcpO1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBHdW47XHJcblxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRmdW5jdGlvbiBtZXRhKHYsZil7XHJcblx0XHRcdFx0aWYob2JqX2hhcyhHdW4uX18uXywgZikpeyByZXR1cm4gfVxyXG5cdFx0XHRcdG9ial9wdXQodGhpcy5fLCBmLCB2KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBtYXAodmFsdWUsIGZpZWxkKXtcclxuXHRcdFx0XHRpZihHdW4uXy5ub2RlID09PSBmaWVsZCl7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIG5vZGUgPSB0aGlzLm5vZGUsIHZlcnRleCA9IHRoaXMudmVydGV4LCB1bmlvbiA9IHRoaXMudW5pb24sIG1hY2hpbmUgPSB0aGlzLm1hY2hpbmU7XHJcblx0XHRcdFx0dmFyIGlzID0gc3RhdGVfaXMobm9kZSwgZmllbGQpLCBjcyA9IHN0YXRlX2lzKHZlcnRleCwgZmllbGQpO1xyXG5cdFx0XHRcdGlmKHUgPT09IGlzIHx8IHUgPT09IGNzKXsgcmV0dXJuIHRydWUgfSAvLyBpdCBpcyB0cnVlIHRoYXQgdGhpcyBpcyBhbiBpbnZhbGlkIEhBTSBjb21wYXJpc29uLlxyXG5cdFx0XHRcdHZhciBpdiA9IHZhbHVlLCBjdiA9IHZlcnRleFtmaWVsZF07XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHRcdFx0XHQvLyBUT0RPOiBCVUchIE5lZWQgdG8gY29tcGFyZSByZWxhdGlvbiB0byBub3QgcmVsYXRpb24sIGFuZCBjaG9vc2UgdGhlIHJlbGF0aW9uIGlmIHRoZXJlIGlzIGEgc3RhdGUgY29uZmxpY3QuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHRcdFx0XHRpZighdmFsX2lzKGl2KSAmJiB1ICE9PSBpdil7IHJldHVybiB0cnVlIH0gLy8gVW5kZWZpbmVkIGlzIG9rYXkgc2luY2UgYSB2YWx1ZSBtaWdodCBub3QgZXhpc3Qgb24gYm90aCBub2Rlcy4gLy8gaXQgaXMgdHJ1ZSB0aGF0IHRoaXMgaXMgYW4gaW52YWxpZCBIQU0gY29tcGFyaXNvbi5cclxuXHRcdFx0XHRpZighdmFsX2lzKGN2KSAmJiB1ICE9PSBjdil7IHJldHVybiB0cnVlIH0gIC8vIFVuZGVmaW5lZCBpcyBva2F5IHNpbmNlIGEgdmFsdWUgbWlnaHQgbm90IGV4aXN0IG9uIGJvdGggbm9kZXMuIC8vIGl0IGlzIHRydWUgdGhhdCB0aGlzIGlzIGFuIGludmFsaWQgSEFNIGNvbXBhcmlzb24uXHJcblx0XHRcdFx0dmFyIEhBTSA9IEd1bi5IQU0obWFjaGluZSwgaXMsIGNzLCBpdiwgY3YpO1xyXG5cdFx0XHRcdGlmKEhBTS5lcnIpe1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCIuIUhZUE9USEVUSUNBTCBBTU5FU0lBIE1BQ0hJTkUgRVJSIS5cIiwgZmllbGQsIEhBTS5lcnIpOyAvLyB0aGlzIGVycm9yIHNob3VsZCBuZXZlciBoYXBwZW4uXHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKEhBTS5zdGF0ZSB8fCBIQU0uaGlzdG9yaWNhbCB8fCBIQU0uY3VycmVudCl7IC8vIFRPRE86IEJVRyEgTm90IGltcGxlbWVudGVkLlxyXG5cdFx0XHRcdFx0Ly9vcHQubG93ZXIodmVydGV4LCB7ZmllbGQ6IGZpZWxkLCB2YWx1ZTogdmFsdWUsIHN0YXRlOiBpc30pO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihIQU0uaW5jb21pbmcpe1xyXG5cdFx0XHRcdFx0dW5pb25bZmllbGRdID0gdmFsdWU7XHJcblx0XHRcdFx0XHRzdGF0ZV9pZnkodW5pb24sIGZpZWxkLCBpcyk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKEhBTS5kZWZlcil7IC8vIFRPRE86IEJVRyEgTm90IGltcGxlbWVudGVkLlxyXG5cdFx0XHRcdFx0dW5pb25bZmllbGRdID0gdmFsdWU7IC8vIFdST05HISBCVUchIE5lZWQgdG8gaW1wbGVtZW50IGNvcnJlY3QgYWxnb3JpdGhtLlxyXG5cdFx0XHRcdFx0c3RhdGVfaWZ5KHVuaW9uLCBmaWVsZCwgaXMpOyAvLyBXUk9ORyEgQlVHISBOZWVkIHRvIGltcGxlbWVudCBjb3JyZWN0IGFsZ29yaXRobS5cclxuXHRcdFx0XHRcdC8vIGZpbGxlciBhbGdvcml0aG0gZm9yIG5vdy5cclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdC8qdXBwZXIud2FpdCA9IHRydWU7XHJcblx0XHRcdFx0XHRvcHQudXBwZXIuY2FsbChzdGF0ZSwgdmVydGV4LCBmaWVsZCwgaW5jb21pbmcsIGN0eC5pbmNvbWluZy5zdGF0ZSk7IC8vIHNpZ25hbHMgdGhhdCB0aGVyZSBhcmUgc3RpbGwgZnV0dXJlIG1vZGlmaWNhdGlvbnMuXHJcblx0XHRcdFx0XHRHdW4uc2NoZWR1bGUoY3R4LmluY29taW5nLnN0YXRlLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0XHR1cGRhdGUoaW5jb21pbmcsIGZpZWxkKTtcclxuXHRcdFx0XHRcdFx0aWYoY3R4LmluY29taW5nLnN0YXRlID09PSB1cHBlci5tYXgpeyAodXBwZXIubGFzdCB8fCBmdW5jdGlvbigpe30pKCkgfVxyXG5cdFx0XHRcdFx0fSwgZ3VuLl9fLm9wdC5zdGF0ZSk7Ki9cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0R3VuLkhBTS51bmlvbiA9IGZ1bmN0aW9uKHZlcnRleCwgbm9kZSwgb3B0KXtcclxuXHRcdFx0XHRpZighbm9kZSB8fCAhbm9kZS5fKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2ZXJ0ZXggPSB2ZXJ0ZXggfHwgR3VuLm5vZGUuc291bC5pZnkoe186eyc+Jzp7fX19LCBHdW4ubm9kZS5zb3VsKG5vZGUpKTtcclxuXHRcdFx0XHRpZighdmVydGV4IHx8ICF2ZXJ0ZXguXyl7IHJldHVybiB9XHJcblx0XHRcdFx0b3B0ID0gbnVtX2lzKG9wdCk/IHttYWNoaW5lOiBvcHR9IDoge21hY2hpbmU6IEd1bi5zdGF0ZSgpfTtcclxuXHRcdFx0XHRvcHQudW5pb24gPSB2ZXJ0ZXggfHwgR3VuLm9iai5jb3B5KHZlcnRleCk7IC8vIFRPRE86IFBFUkYhIFRoaXMgd2lsbCBzbG93IHRoaW5ncyBkb3duIVxyXG5cdFx0XHRcdC8vIFRPRE86IFBFUkYhIEJpZ2dlc3Qgc2xvd2Rvd24gKGFmdGVyIDFvY2FsU3RvcmFnZSkgaXMgdGhlIGFib3ZlIGxpbmUuIEZpeCEgRml4IVxyXG5cdFx0XHRcdG9wdC52ZXJ0ZXggPSB2ZXJ0ZXg7XHJcblx0XHRcdFx0b3B0Lm5vZGUgPSBub2RlO1xyXG5cdFx0XHRcdC8vb2JqX21hcChub2RlLl8sIG1ldGEsIG9wdC51bmlvbik7IC8vIFRPRE86IFJldmlldyBhdCBzb21lIHBvaW50P1xyXG5cdFx0XHRcdGlmKG9ial9tYXAobm9kZSwgbWFwLCBvcHQpKXsgLy8gaWYgdGhpcyByZXR1cm5zIHRydWUgdGhlbiBzb21ldGhpbmcgd2FzIGludmFsaWQuXHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBvcHQudW5pb247XHJcblx0XHRcdH1cclxuXHRcdFx0R3VuLkhBTS5kZWx0YSA9IGZ1bmN0aW9uKHZlcnRleCwgbm9kZSwgb3B0KXtcclxuXHRcdFx0XHRvcHQgPSBudW1faXMob3B0KT8ge21hY2hpbmU6IG9wdH0gOiB7bWFjaGluZTogR3VuLnN0YXRlKCl9O1xyXG5cdFx0XHRcdGlmKCF2ZXJ0ZXgpeyByZXR1cm4gR3VuLm9iai5jb3B5KG5vZGUpIH1cclxuXHRcdFx0XHRvcHQuc291bCA9IEd1bi5ub2RlLnNvdWwob3B0LnZlcnRleCA9IHZlcnRleCk7XHJcblx0XHRcdFx0aWYoIW9wdC5zb3VsKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRvcHQuZGVsdGEgPSBHdW4ubm9kZS5zb3VsLmlmeSh7fSwgb3B0LnNvdWwpO1xyXG5cdFx0XHRcdG9ial9tYXAob3B0Lm5vZGUgPSBub2RlLCBkaWZmLCBvcHQpO1xyXG5cdFx0XHRcdHJldHVybiBvcHQuZGVsdGE7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gZGlmZih2YWx1ZSwgZmllbGQpeyB2YXIgb3B0ID0gdGhpcztcclxuXHRcdFx0XHRpZihHdW4uXy5ub2RlID09PSBmaWVsZCl7IHJldHVybiB9XHJcblx0XHRcdFx0aWYoIXZhbF9pcyh2YWx1ZSkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdHZhciBub2RlID0gb3B0Lm5vZGUsIHZlcnRleCA9IG9wdC52ZXJ0ZXgsIGlzID0gc3RhdGVfaXMobm9kZSwgZmllbGQsIHRydWUpLCBjcyA9IHN0YXRlX2lzKHZlcnRleCwgZmllbGQsIHRydWUpLCBkZWx0YSA9IG9wdC5kZWx0YTtcclxuXHRcdFx0XHR2YXIgSEFNID0gR3VuLkhBTShvcHQubWFjaGluZSwgaXMsIGNzLCB2YWx1ZSwgdmVydGV4W2ZpZWxkXSk7XHJcblxyXG5cclxuXHJcblx0XHRcdFx0Ly8gVE9ETzogQlVHISEhISBXSEFUIEFCT1VUIERFRkVSUkVEIT8/P1xyXG5cdFx0XHRcdFxyXG5cclxuXHJcblx0XHRcdFx0aWYoSEFNLmluY29taW5nKXtcclxuXHRcdFx0XHRcdGRlbHRhW2ZpZWxkXSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0c3RhdGVfaWZ5KGRlbHRhLCBmaWVsZCwgaXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRHdW4uSEFNLnN5bnRoID0gZnVuY3Rpb24oYXQsIGV2KXtcclxuXHRcdFx0XHR2YXIgYXMgPSB0aGlzLmFzLCBjYXQgPSBhcy5ndW4uXztcclxuXHRcdFx0XHRpZighYXQucHV0IHx8IChhc1snLiddICYmICFvYmpfaGFzKGF0LnB1dFthc1snIyddXSwgY2F0LmdldCkpKXtcclxuXHRcdFx0XHRcdGlmKGNhdC5wdXQgIT09IHUpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0Y2F0Lm9uKCdpbicsIHtcclxuXHRcdFx0XHRcdFx0Z2V0OiBjYXQuZ2V0LFxyXG5cdFx0XHRcdFx0XHRwdXQ6IGNhdC5wdXQgPSB1LFxyXG5cdFx0XHRcdFx0XHRndW46IGNhdC5ndW4sXHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRhdC5ndW4gPSBjYXQucm9vdDtcclxuXHRcdFx0XHRHdW4ub24oJ3B1dCcsIGF0KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRHdW4uSEFNLnN5bnRoXyA9IGZ1bmN0aW9uKGF0LCBldiwgYXMpeyB2YXIgZ3VuID0gdGhpcy5hcyB8fCBhcztcclxuXHRcdFx0XHR2YXIgY2F0ID0gZ3VuLl8sIHJvb3QgPSBjYXQucm9vdC5fLCBwdXQgPSB7fSwgdG1wO1xyXG5cdFx0XHRcdGlmKCFhdC5wdXQpe1xyXG5cdFx0XHRcdFx0Ly9pZihvYmpfaGFzKGNhdCwgJ3B1dCcpKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdGlmKGNhdC5wdXQgIT09IHUpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0Y2F0Lm9uKCdpbicsIHtcclxuXHRcdFx0XHRcdC8vcm9vdC5hY2soYXRbJ0AnXSwge1xyXG5cdFx0XHRcdFx0XHRnZXQ6IGNhdC5nZXQsXHJcblx0XHRcdFx0XHRcdHB1dDogY2F0LnB1dCA9IHUsXHJcblx0XHRcdFx0XHRcdGd1bjogZ3VuLFxyXG5cdFx0XHRcdFx0XHR2aWE6IGF0XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBUT0RPOiBQRVJGISBIYXZlIG9wdGlvbnMgdG8gZGV0ZXJtaW5lIGlmIHRoaXMgZGF0YSBzaG91bGQgZXZlbiBiZSBpbiBtZW1vcnkgb24gdGhpcyBwZWVyIVxyXG5cdFx0XHRcdG9ial9tYXAoYXQucHV0LCBmdW5jdGlvbihub2RlLCBzb3VsKXsgdmFyIGdyYXBoID0gdGhpcy5ncmFwaDtcclxuXHRcdFx0XHRcdHB1dFtzb3VsXSA9IEd1bi5IQU0uZGVsdGEoZ3JhcGhbc291bF0sIG5vZGUsIHtncmFwaDogZ3JhcGh9KTsgLy8gVE9ETzogUEVSRiEgU0VFIElGIFdFIENBTiBPUFRJTUlaRSBUSElTIEJZIE1FUkdJTkcgVU5JT04gSU5UTyBERUxUQSFcclxuXHRcdFx0XHRcdGdyYXBoW3NvdWxdID0gR3VuLkhBTS51bmlvbihncmFwaFtzb3VsXSwgbm9kZSkgfHwgZ3JhcGhbc291bF07XHJcblx0XHRcdFx0fSwgcm9vdCk7XHJcblx0XHRcdFx0aWYoYXQuZ3VuICE9PSByb290Lmd1bil7XHJcblx0XHRcdFx0XHRwdXQgPSBhdC5wdXQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIFRPRE86IFBFUkYhIEhhdmUgb3B0aW9ucyB0byBkZXRlcm1pbmUgaWYgdGhpcyBkYXRhIHNob3VsZCBldmVuIGJlIGluIG1lbW9yeSBvbiB0aGlzIHBlZXIhXHJcblx0XHRcdFx0b2JqX21hcChwdXQsIGZ1bmN0aW9uKG5vZGUsIHNvdWwpe1xyXG5cdFx0XHRcdFx0dmFyIHJvb3QgPSB0aGlzLCBuZXh0ID0gcm9vdC5uZXh0IHx8IChyb290Lm5leHQgPSB7fSksIGd1biA9IG5leHRbc291bF0gfHwgKG5leHRbc291bF0gPSByb290Lmd1bi5nZXQoc291bCkpLCBjb2F0ID0gKGd1bi5fKTtcclxuXHRcdFx0XHRcdGNvYXQucHV0ID0gcm9vdC5ncmFwaFtzb3VsXTsgLy8gVE9ETzogQlVHISBDbG9uZSFcclxuXHRcdFx0XHRcdGlmKGNhdC5maWVsZCAmJiAhb2JqX2hhcyhub2RlLCBjYXQuZmllbGQpKXtcclxuXHRcdFx0XHRcdFx0KGF0ID0gb2JqX3RvKGF0LCB7fSkpLnB1dCA9IHU7XHJcblx0XHRcdFx0XHRcdEd1bi5IQU0uc3ludGgoYXQsIGV2LCBjYXQuZ3VuKTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y29hdC5vbignaW4nLCB7XHJcblx0XHRcdFx0XHRcdHB1dDogbm9kZSxcclxuXHRcdFx0XHRcdFx0Z2V0OiBzb3VsLFxyXG5cdFx0XHRcdFx0XHRndW46IGd1bixcclxuXHRcdFx0XHRcdFx0dmlhOiBhdFxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSwgcm9vdCk7XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblxyXG5cdFx0dmFyIFR5cGUgPSBHdW47XHJcblx0XHR2YXIgbnVtID0gVHlwZS5udW0sIG51bV9pcyA9IG51bS5pcztcclxuXHRcdHZhciBvYmogPSBUeXBlLm9iaiwgb2JqX2hhcyA9IG9iai5oYXMsIG9ial9wdXQgPSBvYmoucHV0LCBvYmpfdG8gPSBvYmoudG8sIG9ial9tYXAgPSBvYmoubWFwO1xyXG5cdFx0dmFyIG5vZGUgPSBHdW4ubm9kZSwgbm9kZV9zb3VsID0gbm9kZS5zb3VsLCBub2RlX2lzID0gbm9kZS5pcywgbm9kZV9pZnkgPSBub2RlLmlmeTtcclxuXHRcdHZhciBzdGF0ZSA9IEd1bi5zdGF0ZSwgc3RhdGVfaXMgPSBzdGF0ZS5pcywgc3RhdGVfaWZ5ID0gc3RhdGUuaWZ5O1xyXG5cdFx0dmFyIHZhbCA9IEd1bi52YWwsIHZhbF9pcyA9IHZhbC5pcywgcmVsX2lzID0gdmFsLnJlbC5pcztcclxuXHRcdHZhciB1O1xyXG5cdH0pKHJlcXVpcmUsICcuL2luZGV4Jyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9yb290Jyk7XHJcblx0XHRyZXF1aXJlKCcuL2luZGV4Jyk7IC8vIFRPRE86IENMRUFOIFVQISBNRVJHRSBJTlRPIFJPT1QhXHJcblx0XHRyZXF1aXJlKCcuL29wdCcpO1xyXG5cdFx0cmVxdWlyZSgnLi9jaGFpbicpO1xyXG5cdFx0cmVxdWlyZSgnLi9iYWNrJyk7XHJcblx0XHRyZXF1aXJlKCcuL3B1dCcpO1xyXG5cdFx0cmVxdWlyZSgnLi9nZXQnKTtcclxuXHRcdG1vZHVsZS5leHBvcnRzID0gR3VuO1xyXG5cdH0pKHJlcXVpcmUsICcuL2NvcmUnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL2NvcmUnKTtcclxuXHRcdEd1bi5jaGFpbi5wYXRoID0gZnVuY3Rpb24oZmllbGQsIGNiLCBvcHQpe1xyXG5cdFx0XHR2YXIgYmFjayA9IHRoaXMsIGd1biA9IGJhY2ssIHRtcDtcclxuXHRcdFx0b3B0ID0gb3B0IHx8IHt9OyBvcHQucGF0aCA9IHRydWU7XHJcblx0XHRcdEd1bi5sb2cub25jZShcInBhdGhpbmdcIiwgXCJXYXJuaW5nOiBgLnBhdGhgIHRvIGJlIHJlbW92ZWQgZnJvbSBjb3JlIChidXQgYXZhaWxhYmxlIGFzIGFuIGV4dGVuc2lvbiksIHVzZSBgLmdldGAgY2hhaW5zIGluc3RlYWQuIElmIHlvdSBhcmUgb3Bwb3NlZCB0byB0aGlzLCBwbGVhc2Ugdm9pY2UgeW91ciBvcGluaW9uIGluIGh0dHBzOi8vZ2l0dGVyLmltL2FtYXJrL2d1biBhbmQgYXNrIG90aGVycy5cIik7XHJcblx0XHRcdGlmKGd1biA9PT0gZ3VuLl8ucm9vdCl7aWYoY2Ipe2NiKHtlcnI6IEd1bi5sb2coXCJDYW4ndCBkbyB0aGF0IG9uIHJvb3QgaW5zdGFuY2UuXCIpfSl9cmV0dXJuIGd1bn1cclxuXHRcdFx0aWYodHlwZW9mIGZpZWxkID09PSAnc3RyaW5nJyl7XHJcblx0XHRcdFx0dG1wID0gZmllbGQuc3BsaXQob3B0LnNwbGl0IHx8ICcuJyk7XHJcblx0XHRcdFx0aWYoMSA9PT0gdG1wLmxlbmd0aCl7XHJcblx0XHRcdFx0XHRndW4gPSBiYWNrLmdldChmaWVsZCwgY2IsIG9wdCk7XHJcblx0XHRcdFx0XHRndW4uXy5vcHQgPSBvcHQ7XHJcblx0XHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRmaWVsZCA9IHRtcDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihmaWVsZCBpbnN0YW5jZW9mIEFycmF5KXtcclxuXHRcdFx0XHRpZihmaWVsZC5sZW5ndGggPiAxKXtcclxuXHRcdFx0XHRcdGd1biA9IGJhY2s7XHJcblx0XHRcdFx0XHR2YXIgaSA9IDAsIGwgPSBmaWVsZC5sZW5ndGg7XHJcblx0XHRcdFx0XHRmb3IoaTsgaSA8IGw7IGkrKyl7XHJcblx0XHRcdFx0XHRcdGd1biA9IGd1bi5nZXQoZmllbGRbaV0sIChpKzEgPT09IGwpPyBjYiA6IG51bGwsIG9wdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvL2d1bi5iYWNrID0gYmFjazsgLy8gVE9ETzogQVBJIGNoYW5nZSFcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Z3VuID0gYmFjay5nZXQoZmllbGRbMF0sIGNiLCBvcHQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRndW4uXy5vcHQgPSBvcHQ7XHJcblx0XHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZighZmllbGQgJiYgMCAhPSBmaWVsZCl7XHJcblx0XHRcdFx0cmV0dXJuIGJhY2s7XHJcblx0XHRcdH1cclxuXHRcdFx0Z3VuID0gYmFjay5nZXQoJycrZmllbGQsIGNiLCBvcHQpO1xyXG5cdFx0XHRndW4uXy5vcHQgPSBvcHQ7XHJcblx0XHRcdHJldHVybiBndW47XHJcblx0XHR9XHJcblx0fSkocmVxdWlyZSwgJy4vcGF0aCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vY29yZScpO1xyXG5cdFx0R3VuLmNoYWluLm9uID0gZnVuY3Rpb24odGFnLCBhcmcsIGVhcywgYXMpe1xyXG5cdFx0XHR2YXIgZ3VuID0gdGhpcywgYXQgPSBndW4uXywgdG1wLCBhY3QsIG9mZjtcclxuXHRcdFx0aWYodHlwZW9mIHRhZyA9PT0gJ3N0cmluZycpe1xyXG5cdFx0XHRcdGlmKCFhcmcpeyByZXR1cm4gYXQub24odGFnKSB9XHJcblx0XHRcdFx0YWN0ID0gYXQub24odGFnLCBhcmcsIGVhcyB8fCBhdCwgYXMpO1xyXG5cdFx0XHRcdGlmKGVhcyAmJiBlYXMuZ3VuKXtcclxuXHRcdFx0XHRcdChlYXMuc3VicyB8fCAoZWFzLnN1YnMgPSBbXSkpLnB1c2goYWN0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0b2ZmID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRpZiAoYWN0ICYmIGFjdC5vZmYpIGFjdC5vZmYoKTtcclxuXHRcdFx0XHRcdG9mZi5vZmYoKTtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdG9mZi5vZmYgPSBndW4ub2ZmLmJpbmQoZ3VuKSB8fCBub29wO1xyXG5cdFx0XHRcdGd1bi5vZmYgPSBvZmY7XHJcblx0XHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgb3B0ID0gYXJnO1xyXG5cdFx0XHRvcHQgPSAodHJ1ZSA9PT0gb3B0KT8ge2NoYW5nZTogdHJ1ZX0gOiBvcHQgfHwge307XHJcblx0XHRcdG9wdC5vayA9IHRhZztcclxuXHRcdFx0b3B0Lmxhc3QgPSB7fTtcclxuXHRcdFx0Z3VuLmdldChvaywgb3B0KTsgLy8gVE9ETzogUEVSRiEgRXZlbnQgbGlzdGVuZXIgbGVhayEhIT8/Pz9cclxuXHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBvayhhdCwgZXYpeyB2YXIgb3B0ID0gdGhpcztcclxuXHRcdFx0dmFyIGd1biA9IGF0Lmd1biwgY2F0ID0gZ3VuLl8sIGRhdGEgPSBjYXQucHV0IHx8IGF0LnB1dCwgdG1wID0gb3B0Lmxhc3QsIGlkID0gY2F0LmlkK2F0LmdldCwgdG1wO1xyXG5cdFx0XHRpZih1ID09PSBkYXRhKXtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoZGF0YSAmJiBkYXRhW3JlbC5fXSAmJiAodG1wID0gcmVsLmlzKGRhdGEpKSl7XHJcblx0XHRcdFx0dG1wID0gKGNhdC5yb290LmdldCh0bXApLl8pO1xyXG5cdFx0XHRcdGlmKHUgPT09IHRtcC5wdXQpe1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRkYXRhID0gdG1wLnB1dDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihvcHQuY2hhbmdlKXsgLy8gVE9ETzogQlVHPyBNb3ZlIGFib3ZlIHRoZSB1bmRlZiBjaGVja3M/XHJcblx0XHRcdFx0ZGF0YSA9IGF0LnB1dDtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBERURVUExJQ0FURSAvLyBUT0RPOiBORUVEUyBXT1JLISBCQUQgUFJPVE9UWVBFXHJcblx0XHRcdGlmKHRtcC5wdXQgPT09IGRhdGEgJiYgdG1wLmdldCA9PT0gaWQgJiYgIUd1bi5ub2RlLnNvdWwoZGF0YSkpeyByZXR1cm4gfVxyXG5cdFx0XHR0bXAucHV0ID0gZGF0YTtcclxuXHRcdFx0dG1wLmdldCA9IGlkO1xyXG5cdFx0XHQvLyBERURVUExJQ0FURSAvLyBUT0RPOiBORUVEUyBXT1JLISBCQUQgUFJPVE9UWVBFXHJcblx0XHRcdGNhdC5sYXN0ID0gZGF0YTtcclxuXHRcdFx0aWYob3B0LmFzKXtcclxuXHRcdFx0XHRvcHQub2suY2FsbChvcHQuYXMsIGF0LCBldik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0b3B0Lm9rLmNhbGwoZ3VuLCBkYXRhLCBhdC5nZXQsIGF0LCBldik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRHdW4uY2hhaW4udmFsID0gZnVuY3Rpb24oY2IsIG9wdCl7XHJcblx0XHRcdHZhciBndW4gPSB0aGlzLCBhdCA9IGd1bi5fLCBkYXRhID0gYXQucHV0O1xyXG5cdFx0XHRpZigwIDwgYXQuYWNrICYmIHUgIT09IGRhdGEpe1xyXG5cdFx0XHRcdChjYiB8fCBub29wKS5jYWxsKGd1biwgZGF0YSwgYXQuZ2V0KTtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNiKXtcclxuXHRcdFx0XHQob3B0ID0gb3B0IHx8IHt9KS5vayA9IGNiO1xyXG5cdFx0XHRcdG9wdC5jYXQgPSBhdDtcclxuXHRcdFx0XHRndW4uZ2V0KHZhbCwge2FzOiBvcHR9KTtcclxuXHRcdFx0XHRvcHQuYXN5bmMgPSB0cnVlOyAvL29wdC5hc3luYyA9IGF0LnN0dW4/IDEgOiB0cnVlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdEd1bi5sb2cub25jZShcInZhbG9uY2VcIiwgXCJDaGFpbmFibGUgdmFsIGlzIGV4cGVyaW1lbnRhbCwgaXRzIGJlaGF2aW9yIGFuZCBBUEkgbWF5IGNoYW5nZSBtb3ZpbmcgZm9yd2FyZC4gUGxlYXNlIHBsYXkgd2l0aCBpdCBhbmQgcmVwb3J0IGJ1Z3MgYW5kIGlkZWFzIG9uIGhvdyB0byBpbXByb3ZlIGl0LlwiKTtcclxuXHRcdFx0XHR2YXIgY2hhaW4gPSBndW4uY2hhaW4oKTtcclxuXHRcdFx0XHRjaGFpbi5fLnZhbCA9IGd1bi52YWwoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdGNoYWluLl8ub24oJ2luJywgZ3VuLl8pO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJldHVybiBjaGFpbjtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHZhbChhdCwgZXYsIHRvKXtcclxuXHRcdFx0dmFyIG9wdCA9IHRoaXMuYXMsIGNhdCA9IG9wdC5jYXQsIGd1biA9IGF0Lmd1biwgY29hdCA9IGd1bi5fLCBkYXRhID0gY29hdC5wdXQgfHwgYXQucHV0LCB0bXA7XHJcblx0XHRcdGlmKHUgPT09IGRhdGEpe1xyXG5cdFx0XHRcdC8vcmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGRhdGEgJiYgZGF0YVtyZWwuX10gJiYgKHRtcCA9IHJlbC5pcyhkYXRhKSkpe1xyXG5cdFx0XHRcdHRtcCA9IChjYXQucm9vdC5nZXQodG1wKS5fKTtcclxuXHRcdFx0XHRpZih1ID09PSB0bXAucHV0KXtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZGF0YSA9IHRtcC5wdXQ7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoZXYud2FpdCl7IGNsZWFyVGltZW91dChldi53YWl0KSB9XHJcblx0XHRcdC8vaWYoIXRvICYmICghKDAgPCBjb2F0LmFjaykgfHwgKCh0cnVlID09PSBvcHQuYXN5bmMpICYmIDAgIT09IG9wdC53YWl0KSkpe1xyXG5cdFx0XHRpZighb3B0LmFzeW5jKXtcclxuXHRcdFx0XHRldi53YWl0ID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0dmFsLmNhbGwoe2FzOm9wdH0sIGF0LCBldiwgZXYud2FpdCB8fCAxKVxyXG5cdFx0XHRcdH0sIG9wdC53YWl0IHx8IDk5KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY2F0LmZpZWxkIHx8IGNhdC5zb3VsKXtcclxuXHRcdFx0XHRpZihldi5vZmYoKSl7IHJldHVybiB9IC8vIGlmIGl0IGlzIGFscmVhZHkgb2ZmLCBkb24ndCBjYWxsIGFnYWluIVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmKChvcHQuc2VlbiA9IG9wdC5zZWVuIHx8IHt9KVtjb2F0LmlkXSl7IHJldHVybiB9XHJcblx0XHRcdFx0b3B0LnNlZW5bY29hdC5pZF0gPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdG9wdC5vay5jYWxsKGF0Lmd1biB8fCBvcHQuZ3VuLCBkYXRhLCBhdC5nZXQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdEd1bi5jaGFpbi5vZmYgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgZ3VuID0gdGhpcywgYXQgPSBndW4uXywgdG1wO1xyXG5cdFx0XHR2YXIgYmFjayA9IGF0LmJhY2sgfHwge30sIGNhdCA9IGJhY2suXztcclxuXHRcdFx0aWYoIWNhdCl7IHJldHVybiB9XHJcblx0XHRcdGlmKHRtcCA9IGNhdC5uZXh0KXtcclxuXHRcdFx0XHRpZih0bXBbYXQuZ2V0XSl7XHJcblx0XHRcdFx0XHRvYmpfZGVsKHRtcCwgYXQuZ2V0KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0b2JqX21hcCh0bXAsIGZ1bmN0aW9uKHBhdGgsIGtleSl7XHJcblx0XHRcdFx0XHRcdGlmKGd1biAhPT0gcGF0aCl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRcdG9ial9kZWwodG1wLCBrZXkpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCh0bXAgPSBndW4uYmFjaygtMSkpID09PSBiYWNrKXtcclxuXHRcdFx0XHRvYmpfZGVsKHRtcC5ncmFwaCwgYXQuZ2V0KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihhdC5vbnMgJiYgKHRtcCA9IGF0Lm9uc1snQCQnXSkpe1xyXG5cdFx0XHRcdG9ial9tYXAodG1wLnMsIGZ1bmN0aW9uKGV2KXtcclxuXHRcdFx0XHRcdGV2Lm9mZigpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBndW47XHJcblx0XHR9XHJcblx0XHR2YXIgb2JqID0gR3VuLm9iaiwgb2JqX2hhcyA9IG9iai5oYXMsIG9ial9kZWwgPSBvYmouZGVsLCBvYmpfdG8gPSBvYmoudG87XHJcblx0XHR2YXIgcmVsID0gR3VuLnZhbC5yZWw7XHJcblx0XHR2YXIgZW1wdHkgPSB7fSwgbm9vcCA9IGZ1bmN0aW9uKCl7fSwgdTtcclxuXHR9KShyZXF1aXJlLCAnLi9vbicpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vY29yZScpLCB1O1xyXG5cdFx0R3VuLmNoYWluLm5vdCA9IGZ1bmN0aW9uKGNiLCBvcHQsIHQpe1xyXG5cdFx0XHRHdW4ubG9nLm9uY2UoXCJub3R0b2JlXCIsIFwiV2FybmluZzogYC5ub3RgIHRvIGJlIHJlbW92ZWQgZnJvbSBjb3JlIChidXQgYXZhaWxhYmxlIGFzIGFuIGV4dGVuc2lvbiksIHVzZSBgLnZhbGAgaW5zdGVhZCwgd2hpY2ggbm93IHN1cHBvcnRzICh2MC43LngrKSAnbm90IGZvdW5kIGRhdGEnIGFzIGB1bmRlZmluZWRgIGRhdGEgaW4gY2FsbGJhY2tzLiBJZiB5b3UgYXJlIG9wcG9zZWQgdG8gdGhpcywgcGxlYXNlIHZvaWNlIHlvdXIgb3BpbmlvbiBpbiBodHRwczovL2dpdHRlci5pbS9hbWFyay9ndW4gYW5kIGFzayBvdGhlcnMuXCIpO1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5nZXQob3VnaHQsIHtub3Q6IGNifSk7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBvdWdodChhdCwgZXYpeyBldi5vZmYoKTtcclxuXHRcdFx0aWYoYXQuZXJyIHx8ICh1ICE9PSBhdC5wdXQpKXsgcmV0dXJuIH1cclxuXHRcdFx0aWYoIXRoaXMubm90KXsgcmV0dXJuIH1cclxuXHRcdFx0dGhpcy5ub3QuY2FsbChhdC5ndW4sIGF0LmdldCwgZnVuY3Rpb24oKXsgY29uc29sZS5sb2coXCJQbGVhc2UgcmVwb3J0IHRoaXMgYnVnIG9uIGh0dHBzOi8vZ2l0dGVyLmltL2FtYXJrL2d1biBhbmQgaW4gdGhlIGlzc3Vlcy5cIik7IG5lZWQudG8uaW1wbGVtZW50OyB9KTtcclxuXHRcdH1cclxuXHR9KShyZXF1aXJlLCAnLi9ub3QnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL2NvcmUnKTtcclxuXHRcdEd1bi5jaGFpbi5tYXAgPSBmdW5jdGlvbihjYiwgb3B0LCB0KXtcclxuXHRcdFx0dmFyIGd1biA9IHRoaXMsIGNhdCA9IGd1bi5fLCBjaGFpbjtcclxuXHRcdFx0aWYoIWNiKXtcclxuXHRcdFx0XHRpZihjaGFpbiA9IGNhdC5maWVsZHMpeyByZXR1cm4gY2hhaW4gfVxyXG5cdFx0XHRcdGNoYWluID0gY2F0LmZpZWxkcyA9IGd1bi5jaGFpbigpO1xyXG5cdFx0XHRcdGNoYWluLl8udmFsID0gZ3VuLmJhY2soJ3ZhbCcpO1xyXG5cdFx0XHRcdGd1bi5vbignaW4nLCBtYXAsIGNoYWluLl8pO1xyXG5cdFx0XHRcdHJldHVybiBjaGFpbjtcclxuXHRcdFx0fVxyXG5cdFx0XHRHdW4ubG9nLm9uY2UoXCJtYXBmblwiLCBcIk1hcCBmdW5jdGlvbnMgYXJlIGV4cGVyaW1lbnRhbCwgdGhlaXIgYmVoYXZpb3IgYW5kIEFQSSBtYXkgY2hhbmdlIG1vdmluZyBmb3J3YXJkLiBQbGVhc2UgcGxheSB3aXRoIGl0IGFuZCByZXBvcnQgYnVncyBhbmQgaWRlYXMgb24gaG93IHRvIGltcHJvdmUgaXQuXCIpO1xyXG5cdFx0XHRjaGFpbiA9IGd1bi5jaGFpbigpO1xyXG5cdFx0XHRndW4ubWFwKCkub24oZnVuY3Rpb24oZGF0YSwga2V5LCBhdCwgZXYpe1xyXG5cdFx0XHRcdHZhciBuZXh0ID0gKGNifHxub29wKS5jYWxsKHRoaXMsIGRhdGEsIGtleSwgYXQsIGV2KTtcclxuXHRcdFx0XHRpZih1ID09PSBuZXh0KXsgcmV0dXJuIH1cclxuXHRcdFx0XHRpZihHdW4uaXMobmV4dCkpe1xyXG5cdFx0XHRcdFx0Y2hhaW4uXy5vbignaW4nLCBuZXh0Ll8pO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjaGFpbi5fLm9uKCdpbicsIHtnZXQ6IGtleSwgcHV0OiBuZXh0LCBndW46IGNoYWlufSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gY2hhaW47XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBtYXAoYXQpe1xyXG5cdFx0XHRpZighYXQucHV0IHx8IEd1bi52YWwuaXMoYXQucHV0KSl7IHJldHVybiB9XHJcblx0XHRcdGlmKHRoaXMuYXMudmFsKXsgdGhpcy5vZmYoKSB9IC8vIFRPRE86IFVnbHkgaGFjayFcclxuXHRcdFx0b2JqX21hcChhdC5wdXQsIGVhY2gsIHtjYXQ6IHRoaXMuYXMsIGd1bjogYXQuZ3VufSk7XHJcblx0XHRcdHRoaXMudG8ubmV4dChhdCk7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBlYWNoKHYsZil7XHJcblx0XHRcdGlmKG5fID09PSBmKXsgcmV0dXJuIH1cclxuXHRcdFx0dmFyIGNhdCA9IHRoaXMuY2F0LCBndW4gPSB0aGlzLmd1bi5nZXQoZiksIGF0ID0gKGd1bi5fKTtcclxuXHRcdFx0KGF0LmVjaG8gfHwgKGF0LmVjaG8gPSB7fSkpW2NhdC5pZF0gPSBjYXQ7XHJcblx0XHR9XHJcblx0XHR2YXIgb2JqX21hcCA9IEd1bi5vYmoubWFwLCBub29wID0gZnVuY3Rpb24oKXt9LCBldmVudCA9IHtzdHVuOiBub29wLCBvZmY6IG5vb3B9LCBuXyA9IEd1bi5ub2RlLl8sIHU7XHJcblx0fSkocmVxdWlyZSwgJy4vbWFwJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9jb3JlJyk7XHJcblx0XHRHdW4uY2hhaW4uc2V0ID0gZnVuY3Rpb24oaXRlbSwgY2IsIG9wdCl7XHJcblx0XHRcdHZhciBndW4gPSB0aGlzLCBzb3VsO1xyXG5cdFx0XHRjYiA9IGNiIHx8IGZ1bmN0aW9uKCl7fTtcclxuXHRcdFx0aWYoc291bCA9IEd1bi5ub2RlLnNvdWwoaXRlbSkpeyByZXR1cm4gZ3VuLnNldChndW4uYmFjaygtMSkuZ2V0KHNvdWwpLCBjYiwgb3B0KSB9XHJcblx0XHRcdGlmKCFHdW4uaXMoaXRlbSkpe1xyXG5cdFx0XHRcdGlmKEd1bi5vYmouaXMoaXRlbSkpeyByZXR1cm4gZ3VuLnNldChndW4uXy5yb290LnB1dChpdGVtKSwgY2IsIG9wdCkgfVxyXG5cdFx0XHRcdHJldHVybiBndW4uZ2V0KEd1bi50ZXh0LnJhbmRvbSgpKS5wdXQoaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aXRlbS5nZXQoJ18nKS5nZXQoZnVuY3Rpb24oYXQsIGV2KXtcclxuXHRcdFx0XHRpZighYXQuZ3VuIHx8ICFhdC5ndW4uXy5iYWNrKTtcclxuXHRcdFx0XHRldi5vZmYoKTtcclxuXHRcdFx0XHRhdCA9IChhdC5ndW4uXy5iYWNrLl8pO1xyXG5cdFx0XHRcdHZhciBwdXQgPSB7fSwgbm9kZSA9IGF0LnB1dCwgc291bCA9IEd1bi5ub2RlLnNvdWwobm9kZSk7XHJcblx0XHRcdFx0aWYoIXNvdWwpeyByZXR1cm4gY2IuY2FsbChndW4sIHtlcnI6IEd1bi5sb2coJ09ubHkgYSBub2RlIGNhbiBiZSBsaW5rZWQhIE5vdCBcIicgKyBub2RlICsgJ1wiIScpfSkgfVxyXG5cdFx0XHRcdGd1bi5wdXQoR3VuLm9iai5wdXQocHV0LCBzb3VsLCBHdW4udmFsLnJlbC5pZnkoc291bCkpLCBjYiwgb3B0KTtcclxuXHRcdFx0fSx7d2FpdDowfSk7XHJcblx0XHRcdHJldHVybiBpdGVtO1xyXG5cdFx0fVxyXG5cdH0pKHJlcXVpcmUsICcuL3NldCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0aWYodHlwZW9mIEd1biA9PT0gJ3VuZGVmaW5lZCcpeyByZXR1cm4gfSAvLyBUT0RPOiBsb2NhbFN0b3JhZ2UgaXMgQnJvd3NlciBvbmx5LiBCdXQgaXQgd291bGQgYmUgbmljZSBpZiBpdCBjb3VsZCBzb21laG93IHBsdWdpbiBpbnRvIE5vZGVKUyBjb21wYXRpYmxlIGxvY2FsU3RvcmFnZSBBUElzP1xyXG5cclxuXHRcdHZhciByb290LCBub29wID0gZnVuY3Rpb24oKXt9LCB1O1xyXG5cdFx0aWYodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpeyByb290ID0gd2luZG93IH1cclxuXHRcdHZhciBzdG9yZSA9IHJvb3QubG9jYWxTdG9yYWdlIHx8IHtzZXRJdGVtOiBub29wLCByZW1vdmVJdGVtOiBub29wLCBnZXRJdGVtOiBub29wfTtcclxuXHJcblx0XHR2YXIgY2hlY2sgPSB7fSwgZGlydHkgPSB7fSwgYXN5bmMgPSB7fSwgY291bnQgPSAwLCBtYXggPSAxMDAwMCwgd2FpdDtcclxuXHRcdFxyXG5cdFx0R3VuLm9uKCdwdXQnLCBmdW5jdGlvbihhdCl7IHZhciBlcnIsIGlkLCBvcHQsIHJvb3QgPSBhdC5ndW4uXy5yb290O1xyXG5cdFx0XHR0aGlzLnRvLm5leHQoYXQpO1xyXG5cdFx0XHQob3B0ID0ge30pLnByZWZpeCA9IChhdC5vcHQgfHwgb3B0KS5wcmVmaXggfHwgYXQuZ3VuLmJhY2soJ29wdC5wcmVmaXgnKSB8fCAnZ3VuLyc7XHJcblx0XHRcdHZhciBncmFwaCA9IHJvb3QuXy5ncmFwaDtcclxuXHRcdFx0R3VuLm9iai5tYXAoYXQucHV0LCBmdW5jdGlvbihub2RlLCBzb3VsKXtcclxuXHRcdFx0XHRhc3luY1tzb3VsXSA9IGFzeW5jW3NvdWxdIHx8IGdyYXBoW3NvdWxdIHx8IG5vZGU7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRjb3VudCArPSAxO1xyXG5cdFx0XHRjaGVja1thdFsnIyddXSA9IHJvb3Q7XHJcblx0XHRcdGZ1bmN0aW9uIHNhdmUoKXtcclxuXHRcdFx0XHRjbGVhclRpbWVvdXQod2FpdCk7XHJcblx0XHRcdFx0dmFyIGFjayA9IGNoZWNrO1xyXG5cdFx0XHRcdHZhciBhbGwgPSBhc3luYztcclxuXHRcdFx0XHRjb3VudCA9IDA7XHJcblx0XHRcdFx0d2FpdCA9IGZhbHNlO1xyXG5cdFx0XHRcdGNoZWNrID0ge307XHJcblx0XHRcdFx0YXN5bmMgPSB7fTtcclxuXHRcdFx0XHRHdW4ub2JqLm1hcChhbGwsIGZ1bmN0aW9uKG5vZGUsIHNvdWwpe1xyXG5cdFx0XHRcdFx0Ly8gU2luY2UgbG9jYWxTdG9yYWdlIG9ubHkgaGFzIDVNQiwgaXQgaXMgYmV0dGVyIHRoYXQgd2Uga2VlcCBvbmx5XHJcblx0XHRcdFx0XHQvLyB0aGUgZGF0YSB0aGF0IHRoZSB1c2VyIGlzIGN1cnJlbnRseSBpbnRlcmVzdGVkIGluLlxyXG5cdFx0XHRcdFx0bm9kZSA9IGdyYXBoW3NvdWxdIHx8IGFsbFtzb3VsXSB8fCBub2RlO1xyXG5cdFx0XHRcdFx0dHJ5e3N0b3JlLnNldEl0ZW0ob3B0LnByZWZpeCArIHNvdWwsIEpTT04uc3RyaW5naWZ5KG5vZGUpKTtcclxuXHRcdFx0XHRcdH1jYXRjaChlKXsgZXJyID0gZSB8fCBcImxvY2FsU3RvcmFnZSBmYWlsdXJlXCIgfVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdGlmKCFHdW4ub2JqLmVtcHR5KGF0Lmd1bi5iYWNrKCdvcHQucGVlcnMnKSkpeyByZXR1cm4gfSAvLyBvbmx5IGFjayBpZiB0aGVyZSBhcmUgbm8gcGVlcnMuXHJcblx0XHRcdFx0R3VuLm9iai5tYXAoYWNrLCBmdW5jdGlvbihyb290LCBpZCl7XHJcblx0XHRcdFx0XHRyb290Lm9uKCdpbicsIHtcclxuXHRcdFx0XHRcdFx0J0AnOiBpZCxcclxuXHRcdFx0XHRcdFx0ZXJyOiBlcnIsXHJcblx0XHRcdFx0XHRcdG9rOiAwIC8vIGxvY2FsU3RvcmFnZSBpc24ndCByZWxpYWJsZSwgc28gbWFrZSBpdHMgYG9rYCBjb2RlIGJlIGEgbG93IG51bWJlci5cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNvdW50ID49IG1heCl7IC8vIGdvYWwgaXMgdG8gZG8gMTBLIGluc2VydHMvc2Vjb25kLlxyXG5cdFx0XHRcdHJldHVybiBzYXZlKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYod2FpdCl7IHJldHVybiB9XHJcblx0XHRcdGNsZWFyVGltZW91dCh3YWl0KTtcclxuXHRcdFx0d2FpdCA9IHNldFRpbWVvdXQoc2F2ZSwgMTAwMCk7XHJcblx0XHR9KTtcclxuXHRcdEd1bi5vbignZ2V0JywgZnVuY3Rpb24oYXQpe1xyXG5cdFx0XHR0aGlzLnRvLm5leHQoYXQpO1xyXG5cdFx0XHR2YXIgZ3VuID0gYXQuZ3VuLCBsZXggPSBhdC5nZXQsIHNvdWwsIGRhdGEsIG9wdCwgdTtcclxuXHRcdFx0Ly9zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdChvcHQgPSBhdC5vcHQgfHwge30pLnByZWZpeCA9IG9wdC5wcmVmaXggfHwgYXQuZ3VuLmJhY2soJ29wdC5wcmVmaXgnKSB8fCAnZ3VuLyc7XHJcblx0XHRcdGlmKCFsZXggfHwgIShzb3VsID0gbGV4W0d1bi5fLnNvdWxdKSl7IHJldHVybiB9XHJcblx0XHRcdC8vaWYoMCA+PSBhdC5jYXApeyByZXR1cm4gfVxyXG5cdFx0XHR2YXIgZmllbGQgPSBsZXhbJy4nXTtcclxuXHRcdFx0ZGF0YSA9IEd1bi5vYmouaWZ5KHN0b3JlLmdldEl0ZW0ob3B0LnByZWZpeCArIHNvdWwpIHx8IG51bGwpIHx8IGFzeW5jW3NvdWxdIHx8IHU7XHJcblx0XHRcdGlmKGRhdGEgJiYgZmllbGQpe1xyXG5cdFx0XHRcdGRhdGEgPSBHdW4uc3RhdGUudG8oZGF0YSwgZmllbGQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCFkYXRhICYmICFHdW4ub2JqLmVtcHR5KGd1bi5iYWNrKCdvcHQucGVlcnMnKSkpeyAvLyBpZiBkYXRhIG5vdCBmb3VuZCwgZG9uJ3QgYWNrIGlmIHRoZXJlIGFyZSBwZWVycy5cclxuXHRcdFx0XHRyZXR1cm47IC8vIEhtbSwgd2hhdCBpZiB3ZSBoYXZlIHBlZXJzIGJ1dCB3ZSBhcmUgZGlzY29ubmVjdGVkP1xyXG5cdFx0XHR9XHJcblx0XHRcdGd1bi5vbignaW4nLCB7J0AnOiBhdFsnIyddLCBwdXQ6IEd1bi5ncmFwaC5ub2RlKGRhdGEpLCBob3c6ICdsUyd9KTtcclxuXHRcdFx0Ly99LDExKTtcclxuXHRcdH0pO1xyXG5cdH0pKHJlcXVpcmUsICcuL2FkYXB0ZXJzL2xvY2FsU3RvcmFnZScpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vY29yZScpO1xyXG5cclxuXHRcdGlmICh0eXBlb2YgSlNPTiA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFxyXG5cdFx0XHRcdCdHdW4gZGVwZW5kcyBvbiBKU09OLiBQbGVhc2UgbG9hZCBpdCBmaXJzdDpcXG4nICtcclxuXHRcdFx0XHQnYWpheC5jZG5qcy5jb20vYWpheC9saWJzL2pzb24yLzIwMTEwMjIzL2pzb24yLmpzJ1xyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBXZWJTb2NrZXQ7XHJcblx0XHRpZih0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyl7XHJcblx0XHRcdFdlYlNvY2tldCA9IHdpbmRvdy5XZWJTb2NrZXQgfHwgd2luZG93LndlYmtpdFdlYlNvY2tldCB8fCB3aW5kb3cubW96V2ViU29ja2V0O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0dmFyIG1lc3NhZ2UsIGNvdW50ID0gMCwgbm9vcCA9IGZ1bmN0aW9uKCl7fSwgd2FpdDtcclxuXHJcblx0XHRHdW4ub24oJ291dCcsIGZ1bmN0aW9uKGF0KXtcclxuXHRcdFx0dGhpcy50by5uZXh0KGF0KTtcclxuXHRcdFx0dmFyIGNhdCA9IGF0Lmd1bi5fLnJvb3QuXywgd3NwID0gY2F0LndzcCB8fCAoY2F0LndzcCA9IHt9KTtcclxuXHRcdFx0aWYoYXQud3NwICYmIDEgPT09IHdzcC5jb3VudCl7IHJldHVybiB9IC8vIGlmIHRoZSBtZXNzYWdlIGNhbWUgRlJPTSB0aGUgb25seSBwZWVyIHdlIGFyZSBjb25uZWN0ZWQgdG8sIGRvbid0IGVjaG8gaXQgYmFjay5cclxuXHRcdFx0bWVzc2FnZSA9IEpTT04uc3RyaW5naWZ5KGF0KTtcclxuXHRcdFx0Ly9pZigrK2NvdW50KXsgY29uc29sZS5sb2coXCJtc2cgT1VUOlwiLCBjb3VudCwgR3VuLm9iai5pZnkobWVzc2FnZSkpIH1cclxuXHRcdFx0aWYoY2F0LnVkcmFpbil7XHJcblx0XHRcdFx0Y2F0LnVkcmFpbi5wdXNoKG1lc3NhZ2UpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYXQudWRyYWluID0gW107XHJcblx0XHRcdGNsZWFyVGltZW91dCh3YWl0KTtcclxuXHRcdFx0d2FpdCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRpZighY2F0LnVkcmFpbil7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIHRtcCA9IGNhdC51ZHJhaW47XHJcblx0XHRcdFx0Y2F0LnVkcmFpbiA9IG51bGw7XHJcblx0XHRcdFx0aWYoIHRtcC5sZW5ndGggKSB7XHJcblx0XHRcdFx0XHRtZXNzYWdlID0gSlNPTi5zdHJpbmdpZnkodG1wKTtcclxuXHRcdFx0XHRcdEd1bi5vYmoubWFwKGNhdC5vcHQucGVlcnMsIHNlbmQsIGNhdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LDEpO1xyXG5cdFx0XHR3c3AuY291bnQgPSAwO1xyXG5cdFx0XHRHdW4ub2JqLm1hcChjYXQub3B0LnBlZXJzLCBzZW5kLCBjYXQpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gc2VuZChwZWVyKXtcclxuXHRcdFx0dmFyIG1zZyA9IG1lc3NhZ2UsIGNhdCA9IHRoaXM7XHJcblx0XHRcdHZhciB3aXJlID0gcGVlci53aXJlIHx8IG9wZW4ocGVlciwgY2F0KTtcclxuXHRcdFx0aWYoY2F0LndzcCl7IGNhdC53c3AuY291bnQrKyB9XHJcblx0XHRcdGlmKCF3aXJlKXsgcmV0dXJuIH1cclxuXHRcdFx0aWYod2lyZS5yZWFkeVN0YXRlID09PSB3aXJlLk9QRU4pe1xyXG5cdFx0XHRcdHdpcmUuc2VuZChtc2cpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHQocGVlci5xdWV1ZSA9IHBlZXIucXVldWUgfHwgW10pLnB1c2gobXNnKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiByZWNlaXZlKG1zZywgcGVlciwgY2F0KXtcclxuXHRcdFx0aWYoIWNhdCB8fCAhbXNnKXsgcmV0dXJuIH1cclxuXHRcdFx0dHJ5e21zZyA9IEpTT04ucGFyc2UobXNnLmRhdGEgfHwgbXNnKTtcclxuXHRcdFx0fWNhdGNoKGUpe31cclxuXHRcdFx0aWYobXNnIGluc3RhbmNlb2YgQXJyYXkpe1xyXG5cdFx0XHRcdHZhciBpID0gMCwgbTtcclxuXHRcdFx0XHR3aGlsZShtID0gbXNnW2krK10pe1xyXG5cdFx0XHRcdFx0cmVjZWl2ZShtLCBwZWVyLCBjYXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0Ly9pZigrK2NvdW50KXsgY29uc29sZS5sb2coXCJtc2cgaW46XCIsIGNvdW50LCBtc2cuYm9keSB8fCBtc2cpIH1cclxuXHRcdFx0aWYoY2F0LndzcCAmJiAxID09PSBjYXQud3NwLmNvdW50KXsgKG1zZy5ib2R5IHx8IG1zZykud3NwID0gbm9vcCB9IC8vIElmIHRoZXJlIGlzIG9ubHkgMSBjbGllbnQsIGp1c3QgdXNlIG5vb3Agc2luY2UgaXQgZG9lc24ndCBtYXR0ZXIuXHJcblx0XHRcdGNhdC5ndW4ub24oJ2luJywgbXNnLmJvZHkgfHwgbXNnKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBvcGVuKHBlZXIsIGFzKXtcclxuXHRcdFx0aWYoIXBlZXIgfHwgIXBlZXIudXJsKXsgcmV0dXJuIH1cclxuXHRcdFx0dmFyIHVybCA9IHBlZXIudXJsLnJlcGxhY2UoJ2h0dHAnLCAnd3MnKTtcclxuXHRcdFx0dmFyIHdpcmUgPSBwZWVyLndpcmUgPSBuZXcgV2ViU29ja2V0KHVybCwgYXMub3B0LndzYy5wcm90b2NvbHMsIGFzLm9wdC53c2MgKTtcclxuXHRcdFx0d2lyZS5vbmNsb3NlID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZWNvbm5lY3QocGVlciwgYXMpO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHR3aXJlLm9uZXJyb3IgPSBmdW5jdGlvbihlcnJvcil7XHJcblx0XHRcdFx0cmVjb25uZWN0KHBlZXIsIGFzKTtcclxuXHRcdFx0XHRpZighZXJyb3IpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGlmKGVycm9yLmNvZGUgPT09ICdFQ09OTlJFRlVTRUQnKXtcclxuXHRcdFx0XHRcdC8vcmVjb25uZWN0KHBlZXIsIGFzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdHdpcmUub25vcGVuID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgcXVldWUgPSBwZWVyLnF1ZXVlO1xyXG5cdFx0XHRcdHBlZXIucXVldWUgPSBbXTtcclxuXHRcdFx0XHRHdW4ub2JqLm1hcChxdWV1ZSwgZnVuY3Rpb24obXNnKXtcclxuXHRcdFx0XHRcdG1lc3NhZ2UgPSBtc2c7XHJcblx0XHRcdFx0XHRzZW5kLmNhbGwoYXMsIHBlZXIpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdHdpcmUub25tZXNzYWdlID0gZnVuY3Rpb24obXNnKXtcclxuXHRcdFx0XHRyZWNlaXZlKG1zZywgcGVlciwgYXMpO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHRyZXR1cm4gd2lyZTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiByZWNvbm5lY3QocGVlciwgYXMpe1xyXG5cdFx0XHRjbGVhclRpbWVvdXQocGVlci5kZWZlcik7XHJcblx0XHRcdHBlZXIuZGVmZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0b3BlbihwZWVyLCBhcyk7XHJcblx0XHRcdH0sIDIgKiAxMDAwKTtcclxuXHRcdH1cclxuXHR9KShyZXF1aXJlLCAnLi9wb2x5ZmlsbC9yZXF1ZXN0Jyk7XHJcblxyXG59KCkpO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vZ3VuL2d1bi5qcyIsIi8qKlxuICogQ3JlYXRlZCBieSBMZW9uIFJldmlsbCBvbiAxNS8xMi8yMDE1LlxuICogQmxvZzogYmxvZy5yZXZpbGx3ZWIuY29tXG4gKiBHaXRIdWI6IGh0dHBzOi8vZ2l0aHViLmNvbS9SZXZpbGxXZWJcbiAqIFR3aXR0ZXI6IEBSZXZpbGxXZWJcbiAqL1xuXG4vKipcbiAqIFRoZSBtYWluIHJvdXRlciBjbGFzcyBhbmQgZW50cnkgcG9pbnQgdG8gdGhlIHJvdXRlci5cbiAqL1xuZXhwb3J0IGNsYXNzIFJlYmVsUm91dGVyIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG4gICAgLyoqXG4gICAgICogTWFpbiBpbml0aWFsaXNhdGlvbiBwb2ludCBvZiByZWJlbC1yb3V0ZXJcbiAgICAgKiBAcGFyYW0gcHJlZml4IC0gSWYgZXh0ZW5kaW5nIHJlYmVsLXJvdXRlciB5b3UgY2FuIHNwZWNpZnkgYSBwcmVmaXggd2hlbiBjYWxsaW5nIGNyZWF0ZWRDYWxsYmFjayBpbiBjYXNlIHlvdXIgZWxlbWVudHMgbmVlZCB0byBiZSBuYW1lZCBkaWZmZXJlbnRseVxuICAgICAqL1xuICAgIGNyZWF0ZWRDYWxsYmFjayhwcmVmaXgpIHtcblxuICAgICAgICBjb25zdCBfcHJlZml4ID0gcHJlZml4IHx8IFwicmViZWxcIjtcbiAgICAgICAgXG4gICAgICAgIHRoaXMucHJldmlvdXNQYXRoID0gbnVsbDtcbiAgICAgICAgdGhpcy5iYXNlUGF0aCA9IG51bGw7XG5cbiAgICAgICAgLy9HZXQgb3B0aW9uc1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAgICAgICBcImFuaW1hdGlvblwiOiAodGhpcy5nZXRBdHRyaWJ1dGUoXCJhbmltYXRpb25cIikgPT0gXCJ0cnVlXCIpLFxuICAgICAgICAgICAgXCJzaGFkb3dSb290XCI6ICh0aGlzLmdldEF0dHJpYnV0ZShcInNoYWRvd1wiKSA9PSBcInRydWVcIiksXG4gICAgICAgICAgICBcImluaGVyaXRcIjogKHRoaXMuZ2V0QXR0cmlidXRlKFwiaW5oZXJpdFwiKSAhPSBcImZhbHNlXCIpXG4gICAgICAgIH07XG5cbiAgICAgICAgLy9HZXQgcm91dGVzXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaW5oZXJpdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgLy9JZiB0aGlzIGlzIGEgbmVzdGVkIHJvdXRlciB0aGVuIHdlIG5lZWQgdG8gZ28gYW5kIGdldCB0aGUgcGFyZW50IHBhdGhcbiAgICAgICAgICAgIGxldCAkZWxlbWVudCA9IHRoaXM7XG4gICAgICAgICAgICB3aGlsZSAoJGVsZW1lbnQucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICRlbGVtZW50ID0gJGVsZW1lbnQucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICBpZiAoJGVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PSBfcHJlZml4ICsgXCItcm91dGVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudCA9ICRlbGVtZW50LmN1cnJlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iYXNlUGF0aCA9IGN1cnJlbnQucm91dGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJvdXRlcyA9IHt9O1xuICAgICAgICBjb25zdCAkY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8ICRjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgJGNoaWxkID0gJGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgbGV0IHBhdGggPSAkY2hpbGQuZ2V0QXR0cmlidXRlKFwicGF0aFwiKTtcbiAgICAgICAgICAgIHN3aXRjaCAoJGNoaWxkLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlIF9wcmVmaXggKyBcIi1kZWZhdWx0XCI6XG4gICAgICAgICAgICAgICAgICAgIHBhdGggPSBcIipcIjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBfcHJlZml4ICsgXCItcm91dGVcIjpcbiAgICAgICAgICAgICAgICAgICAgcGF0aCA9ICh0aGlzLmJhc2VQYXRoICE9PSBudWxsKSA/IHRoaXMuYmFzZVBhdGggKyBwYXRoIDogcGF0aDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGF0aCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGxldCAkdGVtcGxhdGUgPSBudWxsO1xuICAgICAgICAgICAgICAgIGlmICgkY2hpbGQuaW5uZXJIVE1MKSB7XG4gICAgICAgICAgICAgICAgICAgICR0ZW1wbGF0ZSA9IFwiPFwiICsgX3ByZWZpeCArIFwiLXJvdXRlPlwiICsgJGNoaWxkLmlubmVySFRNTCArIFwiPC9cIiArIF9wcmVmaXggKyBcIi1yb3V0ZT5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXNbcGF0aF0gPSB7XG4gICAgICAgICAgICAgICAgICAgIFwiY29tcG9uZW50XCI6ICRjaGlsZC5nZXRBdHRyaWJ1dGUoXCJjb21wb25lbnRcIiksXG4gICAgICAgICAgICAgICAgICAgIFwidGVtcGxhdGVcIjogJHRlbXBsYXRlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vQWZ0ZXIgd2UgaGF2ZSBjb2xsZWN0ZWQgYWxsIGNvbmZpZ3VyYXRpb24gY2xlYXIgaW5uZXJIVE1MXG4gICAgICAgIHRoaXMuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNoYWRvd1Jvb3QgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpO1xuICAgICAgICAgICAgdGhpcy5yb290ID0gdGhpcy5zaGFkb3dSb290O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yb290ID0gdGhpcztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmFuaW1hdGlvbiA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5pbml0QW5pbWF0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgUmViZWxSb3V0ZXIucGF0aENoYW5nZSgoaXNCYWNrKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmFuaW1hdGlvbiA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChpc0JhY2sgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKFwicmJsLWJhY2tcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKFwicmJsLWJhY2tcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGdW5jdGlvbiB1c2VkIHRvIGluaXRpYWxpc2UgdGhlIGFuaW1hdGlvbiBtZWNoYW5pY3MgaWYgYW5pbWF0aW9uIGlzIHR1cm5lZCBvblxuICAgICAqL1xuICAgIGluaXRBbmltYXRpb24oKSB7XG4gICAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xuICAgICAgICAgICAgbGV0IG5vZGUgPSBtdXRhdGlvbnNbMF0uYWRkZWROb2Rlc1swXTtcbiAgICAgICAgICAgIGlmIChub2RlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvdGhlckNoaWxkcmVuID0gdGhpcy5nZXRPdGhlckNoaWxkcmVuKG5vZGUpO1xuICAgICAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChcInJlYmVsLWFuaW1hdGVcIik7XG4gICAgICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QuYWRkKFwiZW50ZXJcIik7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvdGhlckNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyQ2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZC5jbGFzc0xpc3QuYWRkKFwiZXhpdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQuY2xhc3NMaXN0LmFkZChcImNvbXBsZXRlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QuYWRkKFwiY29tcGxldGVcIik7XG4gICAgICAgICAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgICAgICAgICB9LCAxMCk7XG4gICAgICAgICAgICAgICAgY29uc3QgYW5pbWF0aW9uRW5kID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQuY2xhc3NOYW1lLmluZGV4T2YoXCJleGl0XCIpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucm9vdC5yZW1vdmVDaGlsZChldmVudC50YXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoXCJ0cmFuc2l0aW9uZW5kXCIsIGFuaW1hdGlvbkVuZCk7XG4gICAgICAgICAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsIGFuaW1hdGlvbkVuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKHRoaXMsIHtjaGlsZExpc3Q6IHRydWV9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNZXRob2QgdXNlZCB0byBnZXQgdGhlIGN1cnJlbnQgcm91dGUgb2JqZWN0XG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgY3VycmVudCgpIHtcbiAgICAgICAgY29uc3QgcGF0aCA9IFJlYmVsUm91dGVyLmdldFBhdGhGcm9tVXJsKCk7XG4gICAgICAgIGZvciAoY29uc3Qgcm91dGUgaW4gdGhpcy5yb3V0ZXMpIHtcbiAgICAgICAgICAgIGlmIChyb3V0ZSAhPT0gXCIqXCIpIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVnZXhTdHJpbmcgPSBcIl5cIiArIHJvdXRlLnJlcGxhY2UoL3tcXHcrfVxcLz8vZywgXCIoXFxcXHcrKVxcLz9cIik7XG4gICAgICAgICAgICAgICAgcmVnZXhTdHJpbmcgKz0gKHJlZ2V4U3RyaW5nLmluZGV4T2YoXCJcXFxcLz9cIikgPiAtMSkgPyBcIlwiIDogXCJcXFxcLz9cIiArIFwiKFs/PSYtXFwvXFxcXHcrXSspPyRcIjtcbiAgICAgICAgICAgICAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAocmVnZXhTdHJpbmcpO1xuICAgICAgICAgICAgICAgIGlmIChyZWdleC50ZXN0KHBhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfcm91dGVSZXN1bHQodGhpcy5yb3V0ZXNbcm91dGVdLCByb3V0ZSwgcmVnZXgsIHBhdGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKHRoaXMucm91dGVzW1wiKlwiXSAhPT0gdW5kZWZpbmVkKSA/IF9yb3V0ZVJlc3VsdCh0aGlzLnJvdXRlc1tcIipcIl0sIFwiKlwiLCBudWxsLCBwYXRoKSA6IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWV0aG9kIGNhbGxlZCB0byByZW5kZXIgdGhlIGN1cnJlbnQgdmlld1xuICAgICAqL1xuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5jdXJyZW50KCk7XG4gICAgICAgIGlmIChyZXN1bHQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQucGF0aCAhPT0gdGhpcy5wcmV2aW91c1BhdGggfHwgdGhpcy5vcHRpb25zLmFuaW1hdGlvbiA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYW5pbWF0aW9uICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm9vdC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmNvbXBvbmVudCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgJGNvbXBvbmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQocmVzdWx0LmNvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiByZXN1bHQucGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSByZXN1bHQucGFyYW1zW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09IFwiT2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IEpTT04ucGFyc2UodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkNvdWxkbid0IHBhcnNlIHBhcmFtIHZhbHVlOlwiLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAkY29tcG9uZW50LnNldEF0dHJpYnV0ZShrZXksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvb3QuYXBwZW5kQ2hpbGQoJGNvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0ICR0ZW1wbGF0ZSA9IHJlc3VsdC50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgLy9UT0RPOiBGaW5kIGEgZmFzdGVyIGFsdGVybmF0aXZlXG4gICAgICAgICAgICAgICAgICAgIGlmICgkdGVtcGxhdGUuaW5kZXhPZihcIiR7XCIpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICR0ZW1wbGF0ZSA9ICR0ZW1wbGF0ZS5yZXBsYWNlKC9cXCR7KFtee31dKil9L2csXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHIgPSByZXN1bHQucGFyYW1zW2JdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mIHIgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiByID09PSAnbnVtYmVyJyA/IHIgOiBhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb290LmlubmVySFRNTCA9ICR0ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5wcmV2aW91c1BhdGggPSByZXN1bHQucGF0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbm9kZSAtIFVzZWQgd2l0aCB0aGUgYW5pbWF0aW9uIG1lY2hhbmljcyB0byBnZXQgYWxsIG90aGVyIHZpZXcgY2hpbGRyZW4gZXhjZXB0IGl0c2VsZlxuICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgKi9cbiAgICBnZXRPdGhlckNoaWxkcmVuKG5vZGUpIHtcbiAgICAgICAgY29uc3QgY2hpbGRyZW4gPSB0aGlzLnJvb3QuY2hpbGRyZW47XG4gICAgICAgIGxldCByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgaWYgKGNoaWxkICE9IG5vZGUpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIFN0YXRpYyBoZWxwZXIgbWV0aG9kIHRvIHBhcnNlIHRoZSBxdWVyeSBzdHJpbmcgZnJvbSBhIHVybCBpbnRvIGFuIG9iamVjdC5cbiAgICAgKiBAcGFyYW0gdXJsXG4gICAgICogQHJldHVybnMge3t9fVxuICAgICAqL1xuICAgIHN0YXRpYyBwYXJzZVF1ZXJ5U3RyaW5nKHVybCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICAgIGlmICh1cmwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdmFyIHF1ZXJ5U3RyaW5nID0gKHVybC5pbmRleE9mKFwiP1wiKSA+IC0xKSA/IHVybC5zdWJzdHIodXJsLmluZGV4T2YoXCI/XCIpICsgMSwgdXJsLmxlbmd0aCkgOiBudWxsO1xuICAgICAgICAgICAgaWYgKHF1ZXJ5U3RyaW5nICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcXVlcnlTdHJpbmcuc3BsaXQoXCImXCIpLmZvckVhY2goZnVuY3Rpb24gKHBhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwYXJ0KSByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIHBhcnQgPSBwYXJ0LnJlcGxhY2UoXCIrXCIsIFwiIFwiKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVxID0gcGFydC5pbmRleE9mKFwiPVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9IGVxID4gLTEgPyBwYXJ0LnN1YnN0cigwLCBlcSkgOiBwYXJ0O1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsID0gZXEgPiAtMSA/IGRlY29kZVVSSUNvbXBvbmVudChwYXJ0LnN1YnN0cihlcSArIDEpKSA6IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmcm9tID0ga2V5LmluZGV4T2YoXCJbXCIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZnJvbSA9PSAtMSkgcmVzdWx0W2RlY29kZVVSSUNvbXBvbmVudChrZXkpXSA9IHZhbDtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdG8gPSBrZXkuaW5kZXhPZihcIl1cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBkZWNvZGVVUklDb21wb25lbnQoa2V5LnN1YnN0cmluZyhmcm9tICsgMSwgdG8pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IGRlY29kZVVSSUNvbXBvbmVudChrZXkuc3Vic3RyaW5nKDAsIGZyb20pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcmVzdWx0W2tleV0pIHJlc3VsdFtrZXldID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWluZGV4KSByZXN1bHRba2V5XS5wdXNoKHZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHJlc3VsdFtrZXldW2luZGV4XSA9IHZhbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RhdGljIGhlbHBlciBtZXRob2QgdG8gY29udmVydCBhIGNsYXNzIG5hbWUgdG8gYSB2YWxpZCBlbGVtZW50IG5hbWUuXG4gICAgICogQHBhcmFtIENsYXNzXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBzdGF0aWMgY2xhc3NUb1RhZyhDbGFzcykge1xuICAgICAgICAvKipcbiAgICAgICAgICogQ2xhc3MubmFtZSB3b3VsZCBiZSBiZXR0ZXIgYnV0IHRoaXMgaXNuJ3Qgc3VwcG9ydGVkIGluIElFIDExLlxuICAgICAgICAgKi9cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBuYW1lID0gQ2xhc3MudG9TdHJpbmcoKS5tYXRjaCgvXmZ1bmN0aW9uXFxzKihbXlxccyhdKykvKVsxXS5yZXBsYWNlKC9cXFcrL2csICctJykucmVwbGFjZSgvKFthLXpcXGRdKShbQS1aMC05XSkvZywgJyQxLSQyJykudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgcGFyc2UgY2xhc3MgbmFtZTpcIiwgZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFJlYmVsUm91dGVyLnZhbGlkRWxlbWVudFRhZyhuYW1lKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNsYXNzIG5hbWUgY291bGRuJ3QgYmUgdHJhbnNsYXRlZCB0byB0YWcuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuYW1lO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0YXRpYyBoZWxwZXIgbWV0aG9kIHVzZWQgdG8gZGV0ZXJtaW5lIGlmIGFuIGVsZW1lbnQgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUgaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkLlxuICAgICAqIEBwYXJhbSBuYW1lXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgc3RhdGljIGlzUmVnaXN0ZXJlZEVsZW1lbnQobmFtZSkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lKS5jb25zdHJ1Y3RvciAhPT0gSFRNTEVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RhdGljIGhlbHBlciBtZXRob2QgdG8gdGFrZSBhIHdlYiBjb21wb25lbnQgY2xhc3MsIGNyZWF0ZSBhbiBlbGVtZW50IG5hbWUgYW5kIHJlZ2lzdGVyIHRoZSBuZXcgZWxlbWVudCBvbiB0aGUgZG9jdW1lbnQuXG4gICAgICogQHBhcmFtIENsYXNzXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBzdGF0aWMgY3JlYXRlRWxlbWVudChDbGFzcykge1xuICAgICAgICBjb25zdCBuYW1lID0gUmViZWxSb3V0ZXIuY2xhc3NUb1RhZyhDbGFzcyk7XG4gICAgICAgIGlmIChSZWJlbFJvdXRlci5pc1JlZ2lzdGVyZWRFbGVtZW50KG5hbWUpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgQ2xhc3MucHJvdG90eXBlLm5hbWUgPSBuYW1lO1xuICAgICAgICAgICAgZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KG5hbWUsIENsYXNzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmFtZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaW1wbGUgc3RhdGljIGhlbHBlciBtZXRob2QgY29udGFpbmluZyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byB2YWxpZGF0ZSBhbiBlbGVtZW50IG5hbWVcbiAgICAgKiBAcGFyYW0gdGFnXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgc3RhdGljIHZhbGlkRWxlbWVudFRhZyh0YWcpIHtcbiAgICAgICAgcmV0dXJuIC9eW2EtejAtOVxcLV0rJC8udGVzdCh0YWcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1ldGhvZCB1c2VkIHRvIHJlZ2lzdGVyIGEgY2FsbGJhY2sgdG8gYmUgY2FsbGVkIHdoZW4gdGhlIFVSTCBwYXRoIGNoYW5nZXMuXG4gICAgICogQHBhcmFtIGNhbGxiYWNrXG4gICAgICovXG4gICAgc3RhdGljIHBhdGhDaGFuZ2UoY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKFJlYmVsUm91dGVyLmNoYW5nZUNhbGxiYWNrcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBSZWJlbFJvdXRlci5jaGFuZ2VDYWxsYmFja3MgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBSZWJlbFJvdXRlci5jaGFuZ2VDYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgICAgIGNvbnN0IGNoYW5nZUhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICBldmVudC5vbGRVUkwgYW5kIGV2ZW50Lm5ld1VSTCB3b3VsZCBiZSBiZXR0ZXIgaGVyZSBidXQgdGhpcyBkb2Vzbid0IHdvcmsgaW4gSUUgOihcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5ocmVmICE9IFJlYmVsUm91dGVyLm9sZFVSTCkge1xuICAgICAgICAgICAgICAgIFJlYmVsUm91dGVyLmNoYW5nZUNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKGNhbGxiYWNrKXtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soUmViZWxSb3V0ZXIuaXNCYWNrKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBSZWJlbFJvdXRlci5pc0JhY2sgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFJlYmVsUm91dGVyLm9sZFVSTCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgICAgICB9O1xuICAgICAgICBpZiAod2luZG93Lm9uaGFzaGNoYW5nZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyYmxiYWNrXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgUmViZWxSb3V0ZXIuaXNCYWNrID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHdpbmRvdy5vbmhhc2hjaGFuZ2UgPSBjaGFuZ2VIYW5kbGVyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0YXRpYyBoZWxwZXIgbWV0aG9kIHVzZWQgdG8gZ2V0IHRoZSBwYXJhbWV0ZXJzIGZyb20gdGhlIHByb3ZpZGVkIHJvdXRlLlxuICAgICAqIEBwYXJhbSByZWdleFxuICAgICAqIEBwYXJhbSByb3V0ZVxuICAgICAqIEBwYXJhbSBwYXRoXG4gICAgICogQHJldHVybnMge3t9fVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRQYXJhbXNGcm9tVXJsKHJlZ2V4LCByb3V0ZSwgcGF0aCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gUmViZWxSb3V0ZXIucGFyc2VRdWVyeVN0cmluZyhwYXRoKTtcbiAgICAgICAgdmFyIHJlID0gL3soXFx3Kyl9L2c7XG4gICAgICAgIHZhciByZXN1bHRzID0gW107XG4gICAgICAgIGxldCBtYXRjaDtcbiAgICAgICAgd2hpbGUgKG1hdGNoID0gcmUuZXhlYyhyb3V0ZSkpIHtcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChtYXRjaFsxXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlZ2V4ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0czIgPSByZWdleC5leGVjKHBhdGgpO1xuICAgICAgICAgICAgcmVzdWx0cy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpZHgpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbaXRlbV0gPSByZXN1bHRzMltpZHggKyAxXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RhdGljIGhlbHBlciBtZXRob2QgdXNlZCB0byBnZXQgdGhlIHBhdGggZnJvbSB0aGUgY3VycmVudCBVUkwuXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgc3RhdGljIGdldFBhdGhGcm9tVXJsKCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gd2luZG93LmxvY2F0aW9uLmhyZWYubWF0Y2goLyMoLiopJC8pO1xuICAgICAgICBpZiAocmVzdWx0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0WzFdO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJyZWJlbC1yb3V0ZXJcIiwgUmViZWxSb3V0ZXIpO1xuXG4vKipcbiAqIENsYXNzIHdoaWNoIHJlcHJlc2VudHMgdGhlIHJlYmVsLXJvdXRlIGN1c3RvbSBlbGVtZW50XG4gKi9cbmV4cG9ydCBjbGFzcyBSZWJlbFJvdXRlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJyZWJlbC1yb3V0ZVwiLCBSZWJlbFJvdXRlKTtcblxuLyoqXG4gKiBDbGFzcyB3aGljaCByZXByZXNlbnRzIHRoZSByZWJlbC1kZWZhdWx0IGN1c3RvbSBlbGVtZW50XG4gKi9cbmNsYXNzIFJlYmVsRGVmYXVsdCBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxufVxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwicmViZWwtZGVmYXVsdFwiLCBSZWJlbERlZmF1bHQpO1xuXG5cbi8qKlxuICogUmVwcmVzZW50cyB0aGUgcHJvdG90eXBlIGZvciBhbiBhbmNob3IgZWxlbWVudCB3aGljaCBhZGRlZCBmdW5jdGlvbmFsaXR5IHRvIHBlcmZvcm0gYSBiYWNrIHRyYW5zaXRpb24uXG4gKi9cbmNsYXNzIFJlYmVsQmFja0EgZXh0ZW5kcyBIVE1MQW5jaG9yRWxlbWVudCB7XG4gICAgYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpO1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGlmIChwYXRoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3JibGJhY2snKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IHBhdGg7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbi8qKlxuICogUmVnaXN0ZXIgdGhlIGJhY2sgYnV0dG9uIGN1c3RvbSBlbGVtZW50XG4gKi9cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcInJlYmVsLWJhY2stYVwiLCB7XG4gICAgZXh0ZW5kczogXCJhXCIsXG4gICAgcHJvdG90eXBlOiBSZWJlbEJhY2tBLnByb3RvdHlwZVxufSk7XG5cbi8qKlxuICogQ29uc3RydWN0cyBhIHJvdXRlIG9iamVjdFxuICogQHBhcmFtIG9iaiAtIHRoZSBjb21wb25lbnQgbmFtZSBvciB0aGUgSFRNTCB0ZW1wbGF0ZVxuICogQHBhcmFtIHJvdXRlXG4gKiBAcGFyYW0gcmVnZXhcbiAqIEBwYXJhbSBwYXRoXG4gKiBAcmV0dXJucyB7e319XG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBfcm91dGVSZXN1bHQob2JqLCByb3V0ZSwgcmVnZXgsIHBhdGgpIHtcbiAgICBsZXQgcmVzdWx0ID0ge307XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gb2JqW2tleV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0LnJvdXRlID0gcm91dGU7XG4gICAgcmVzdWx0LnBhdGggPSBwYXRoO1xuICAgIHJlc3VsdC5wYXJhbXMgPSBSZWJlbFJvdXRlci5nZXRQYXJhbXNGcm9tVXJsKHJlZ2V4LCByb3V0ZSwgcGF0aCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3JlYmVsLXJvdXRlci9zcmMvcmViZWwtcm91dGVyLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBpbXBvcnQge2hhbmRsZVBHUFB1YmtleX0gZnJvbSAnLi4vLi4vc3JjL2xpYi91dGlsLmpzJztcbi8vIGltcG9ydCB7aGFuZGxlUEdQUHJpdmtleX0gZnJvbSAnLi4vLi4vc3JjL2xpYi91dGlsLmpzJztcbi8vIGltcG9ydCB7aGFuZGxlUEdQTWVzc2FnZX0gZnJvbSAnLi4vLi4vc3JjL2xpYi91dGlsLmpzJztcblxuaW1wb3J0IHtlbmNyeXB0Q2xlYXJ0ZXh0TXVsdGl9IGZyb20gJy4vZW5jcnlwdENsZWFydGV4dE11bHRpLmpzJztcbmltcG9ydCB7ZGVjcnlwdFBHUE1lc3NhZ2V9IGZyb20gJy4vZGVjcnlwdFBHUE1lc3NhZ2UuanMnO1xuaW1wb3J0IHtkZXRlcm1pbmVDb250ZW50VHlwZX0gZnJvbSAnLi9kZXRlcm1pbmVDb250ZW50VHlwZS5qcyc7XG5pbXBvcnQge3NhdmVQR1BQdWJrZXl9IGZyb20gJy4vc2F2ZVBHUFB1YmtleS5qcyc7XG5pbXBvcnQge3NhdmVQR1BQcml2a2V5fSBmcm9tICcuL3NhdmVQR1BQcml2a2V5LmpzJztcbi8vIGltcG9ydCB7Z2V0RnJvbVN0b3JhZ2V9IGZyb20gJy4vZ2V0RnJvbVN0b3JhZ2UnO1xuXG5jb25zdCBQR1BQVUJLRVkgPSAnUEdQUHVia2V5JztcbmNvbnN0IENMRUFSVEVYVCA9ICdjbGVhcnRleHQnO1xuY29uc3QgUEdQUFJJVktFWSA9ICdQR1BQcml2a2V5JztcbmNvbnN0IFBHUE1FU1NBR0UgPSAnUEdQTWVzc2FnZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVQb3N0KGNvbnRlbnQpIHtcbiAgICByZXR1cm4gKCFjb250ZW50KSA/XG4gICAgUHJvbWlzZS5yZXNvbHZlKCcnKSA6XG4gICAgKG9wZW5wZ3ApID0+IHtcbiAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgICAgICAobG9jYWxTdG9yYWdlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKHBhc3N3b3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZGV0ZXJtaW5lQ29udGVudFR5cGUoY29udGVudCkob3BlbnBncClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oY29udGVudFR5cGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRlbnRUeXBlID09PSBDTEVBUlRFWFQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhDTEVBUlRFWFQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVuY3J5cHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZW5jcnlwdENsZWFydGV4dE11bHRpKGNvbnRlbnQpKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4gcmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50VHlwZSA9PT0gUEdQUFJJVktFWSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFBHUFBSSVZLRVkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNhdmUgYW5kIGJyb2FkY2FzdCBjb252ZXJ0ZWQgcHVibGljIGtleVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzYXZlUEdQUHJpdmtleShjb250ZW50KShvcGVucGdwKShsb2NhbFN0b3JhZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9yZXR1cm4gYnJvYWRjYXN0TWVzc2FnZShjb250ZW50KShvcGVucGdwKShsb2NhbFN0b3JhZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50VHlwZSA9PT0gUEdQUFVCS0VZKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coUEdQUFVCS0VZKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzYXZlIHRvIGxvY2FsU3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzYXZlUEdQUHVia2V5KGNvbnRlbnQpKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRlbnRUeXBlID09PSBQR1BNRVNTQUdFKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coUEdQTUVTU0FHRSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IFBHUEtleXMsIGRlY3J5cHQsICBhbmQgcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlY3J5cHRQR1BNZXNzYWdlKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSkocGFzc3dvcmQpKGNvbnRlbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdClcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlamVjdChlcnIpKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGliL2hhbmRsZVBvc3QuanMiLCJsZXQgY29ubmVjdFBhcnRpYWwgPSByZXF1aXJlKFwicmF3LWxvYWRlciEuLi8uLi92aWV3cy9wYXJ0aWFscy9jb25uZWN0Lmh0bWxcIik7XG5leHBvcnQgY2xhc3MgQ29ubmVjdFBhZ2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSAnPHA+JyArIGNvbm5lY3RQYXJ0aWFsICsgJzwvcD4nO1xuICAgIH1cbn1cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcImNvbm5lY3QtcGFnZVwiLCBDb25uZWN0UGFnZSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFnZXMvY29ubmVjdC5qcyIsImxldCBjb250YWN0UGFydGlhbCA9IHJlcXVpcmUoXCJyYXctbG9hZGVyIS4uLy4uL3ZpZXdzL3BhcnRpYWxzL2NvbnRhY3QuaHRtbFwiKTtcbmV4cG9ydCBjbGFzcyBDb250YWN0UGFnZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLmlubmVySFRNTCA9ICc8cD4nICsgY29udGFjdFBhcnRpYWwgKyAnPC9wPic7XG4gICAgfVxufVxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwiY29udGFjdC1wYWdlXCIsIENvbnRhY3RQYWdlKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYWdlcy9jb250YWN0LmpzIiwidmFyIGZyZXNoRGVja1BhcnRpYWwgPSByZXF1aXJlKFwicmF3LWxvYWRlciEuLi8uLi92aWV3cy9wYXJ0aWFscy9mcmVzaGRlY2suaHRtbFwiKTtcblxuZXhwb3J0IGNsYXNzIERlY2tQYWdlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICAgIGF0dGFjaGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuaW5uZXJIVE1MID0gJzxwPicgKyBmcmVzaERlY2tQYXJ0aWFsICsgJzwvcD4nO1xuICAgIH1cbn1cblxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwiZGVjay1wYWdlXCIsIERlY2tQYWdlKTtcbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgncGxheWluZy1jYXJkJywge1xuICAgIHByb3RvdHlwZTogT2JqZWN0LmNyZWF0ZShIVE1MRWxlbWVudC5wcm90b3R5cGUsIHsgY3JlYXRlZENhbGxiYWNrOiB7XG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgcm9vdCA9IHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpO1xuICAgICAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyB0aGlzLnRleHRDb250ZW50IHx8ICcj4paIJyk7XG4gICAgICAgICAgICAgICAgICB2YXIgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgdmFyIGNvbG9yT3ZlcnJpZGUgPSAodGhpcy5xdWVyeVNlbGVjdG9yKCdzcGFuJykpID8gdGhpcy5xdWVyeVNlbGVjdG9yKCdzcGFuJykuc3R5bGUuY29sb3I6IG51bGw7XG4gICAgICAgICAgICAgICAgICBpZiAoY29sb3JPdmVycmlkZSkge1xuICAgICAgICAgICAgICAgICAgICAgIGNsb25lLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpLnN0eWxlLmZpbGwgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKS5zdHlsZS5jb2xvcjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcbn0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhZ2VzL2RlY2suanMiLCJ2YXIgaW5kZXhQYXJ0aWFsID0gcmVxdWlyZShcInJhdy1sb2FkZXIhLi4vLi4vdmlld3MvcGFydGlhbHMvaW5kZXguaHRtbFwiKTtcbmV4cG9ydCBjbGFzcyBJbmRleFBhZ2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSBgXG4gICAgICAgIDxwPiR7aW5kZXhQYXJ0aWFsfTwvcD5cbiAgICAgICAgYDtcbiAgICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJpbmRleC1wYWdlXCIsIEluZGV4UGFnZSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFnZXMvaW5kZXguanMiLCJ2YXIgY2xpZW50UHVia2V5Rm9ybVBhcnRpYWwgPSByZXF1aXJlKFwicmF3LWxvYWRlciEuLi8uLi92aWV3cy9wYXJ0aWFscy9tZXNzYWdlX2Zvcm0uaHRtbFwiKTtcblxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VQYWdlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICAgIGF0dGFjaGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuaW5uZXJIVE1MID0gYFxuICAgICAgICAgICAgPHA+JHtjbGllbnRQdWJrZXlGb3JtUGFydGlhbH08L3A+XG4gICAgICAgIGBcbiAgICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJtZXNzYWdlLXBhZ2VcIiwgTWVzc2FnZVBhZ2UpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhZ2VzL21lc3NhZ2UuanMiLCJ2YXIgcm9hZG1hcFBhcnRpYWwgPSByZXF1aXJlKFwicmF3LWxvYWRlciEuLi8uLi92aWV3cy9wYXJ0aWFscy9yb2FkbWFwLmh0bWxcIik7XG5leHBvcnQgY2xhc3MgUm9hZG1hcFBhZ2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSAnPHA+JyArIHJvYWRtYXBQYXJ0aWFsICsgJzwvcD4nO1xuICAgIH1cbn1cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcInJvYWRtYXAtcGFnZVwiLCBSb2FkbWFwUGFnZSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFnZXMvcm9hZG1hcC5qcyIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3Byb2Nlc3MvYnJvd3Nlci5qcyIsInZhciBnO1xyXG5cclxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcclxuZyA9IChmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcztcclxufSkoKTtcclxuXHJcbnRyeSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXHJcblx0ZyA9IGcgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpIHx8ICgxLGV2YWwpKFwidGhpc1wiKTtcclxufSBjYXRjaChlKSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcclxuXHRpZih0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKVxyXG5cdFx0ZyA9IHdpbmRvdztcclxufVxyXG5cclxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxyXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xyXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGc7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAod2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1vZHVsZSkge1xyXG5cdGlmKCFtb2R1bGUud2VicGFja1BvbHlmaWxsKSB7XHJcblx0XHRtb2R1bGUuZGVwcmVjYXRlID0gZnVuY3Rpb24oKSB7fTtcclxuXHRcdG1vZHVsZS5wYXRocyA9IFtdO1xyXG5cdFx0Ly8gbW9kdWxlLnBhcmVudCA9IHVuZGVmaW5lZCBieSBkZWZhdWx0XHJcblx0XHRpZighbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcclxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwibG9hZGVkXCIsIHtcclxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmw7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJpZFwiLCB7XHJcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIG1vZHVsZS5pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdG1vZHVsZS53ZWJwYWNrUG9seWZpbGwgPSAxO1xyXG5cdH1cclxuXHRyZXR1cm4gbW9kdWxlO1xyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gKHdlYnBhY2spL2J1aWxkaW4vbW9kdWxlLmpzIiwiJ3VzZSBzdHJpY3QnO1xuLy9pbXBvcnQgJ3dlYmNvbXBvbmVudHMuanMvd2ViY29tcG9uZW50cy5qcyc7XG4vL3VuY29tbWVudCBsaW5lIGFib3ZlIHRvIGRvdWJsZSBhcHAgc2l6ZSBhbmQgc3VwcG9ydCBpb3MuXG5cbmltcG9ydCB7aGFuZGxlUG9zdH0gZnJvbSAnLi9saWIvaGFuZGxlUG9zdC5qcyc7XG5pbXBvcnQge2RldGVybWluZUNvbnRlbnRUeXBlfSBmcm9tICcuL2xpYi9kZXRlcm1pbmVDb250ZW50VHlwZS5qcydcbmltcG9ydCB7ZGV0ZXJtaW5lS2V5VHlwZX0gZnJvbSAnLi9saWIvZGV0ZXJtaW5lS2V5VHlwZS5qcydcbmltcG9ydCB7ZW5jcnlwdENsZWFydGV4dE11bHRpfSBmcm9tICcuL2xpYi9lbmNyeXB0Q2xlYXJ0ZXh0TXVsdGkuanMnXG5pbXBvcnQge2VuY3J5cHRDbGVhclRleHR9IGZyb20gJy4vbGliL2VuY3J5cHRDbGVhclRleHQuanMnXG5pbXBvcnQge2RlY3J5cHRQR1BNZXNzYWdlfSBmcm9tICcuL2xpYi9kZWNyeXB0UEdQTWVzc2FnZS5qcydcbmltcG9ydCB7c2F2ZVBHUFB1YmtleX0gZnJvbSAnLi9saWIvc2F2ZVBHUFB1YmtleS5qcydcbmltcG9ydCB7c2F2ZVBHUFByaXZrZXl9IGZyb20gJy4vbGliL3NhdmVQR1BQcml2a2V5LmpzJ1xuaW1wb3J0IHtnZXRGcm9tU3RvcmFnZX0gZnJvbSAnLi9saWIvZ2V0RnJvbVN0b3JhZ2UuanMnXG5pbXBvcnQge2RlY3J5cHRQR1BNZXNzYWdlV2l0aEtleX0gZnJvbSAnLi9saWIvZGVjcnlwdFBHUE1lc3NhZ2VXaXRoS2V5LmpzJ1xuXG53aW5kb3cuaGFuZGxlUG9zdCA9IGhhbmRsZVBvc3QgO1xud2luZG93LmRldGVybWluZUNvbnRlbnRUeXBlID0gZGV0ZXJtaW5lQ29udGVudFR5cGU7XG53aW5kb3cuZGV0ZXJtaW5lS2V5VHlwZSA9IGRldGVybWluZUtleVR5cGU7XG53aW5kb3cuZW5jcnlwdENsZWFydGV4dE11bHRpID0gZW5jcnlwdENsZWFydGV4dE11bHRpO1xud2luZG93LmVuY3J5cHRDbGVhclRleHQgPSBlbmNyeXB0Q2xlYXJUZXh0O1xud2luZG93LmRlY3J5cHRQR1BNZXNzYWdlID0gZGVjcnlwdFBHUE1lc3NhZ2U7XG53aW5kb3cuc2F2ZVBHUFB1YmtleSA9IHNhdmVQR1BQdWJrZXk7XG53aW5kb3cuc2F2ZVBHUFByaXZrZXkgPSBzYXZlUEdQUHJpdmtleTtcbndpbmRvdy5nZXRGcm9tU3RvcmFnZSA9IGdldEZyb21TdG9yYWdlO1xud2luZG93LmRlY3J5cHRQR1BNZXNzYWdlV2l0aEtleSA9IGRlY3J5cHRQR1BNZXNzYWdlV2l0aEtleTtcblxuLy8gcmViZWwgcm91dGVyXG5pbXBvcnQge1JlYmVsUm91dGVyfSBmcm9tICcuLi9ub2RlX21vZHVsZXMvcmViZWwtcm91dGVyL3NyYy9yZWJlbC1yb3V0ZXIuanMnO1xuXG4vLyBHdW5kYiBwdWJsaWMgZmFjaW5nIERBRyBkYXRhYmFzZSAgKGZvciBtZXNzYWdlcyB0byBhbmQgZnJvbSB0aGUgZW5lbXkpXG5pbXBvcnQge0d1bn0gZnJvbSAnZ3VuL2d1bi5qcyc7XG5cbi8vIHBhZ2VzIChtb3N0IG9mIHRoaXMgc2hvdWxkIGJlIGluIHZpZXdzL3BhcnRpYWxzIHRvIGFmZmVjdCBpc29ybW9ycGhpc20pXG5pbXBvcnQge0luZGV4UGFnZX0gICBmcm9tICcuL3BhZ2VzL2luZGV4LmpzJztcbmltcG9ydCB7Um9hZG1hcFBhZ2V9IGZyb20gJy4vcGFnZXMvcm9hZG1hcC5qcyc7XG5pbXBvcnQge0NvbnRhY3RQYWdlfSBmcm9tICcuL3BhZ2VzL2NvbnRhY3QuanMnO1xuaW1wb3J0IHtNZXNzYWdlUGFnZX0gZnJvbSAnLi9wYWdlcy9tZXNzYWdlLmpzJztcbmltcG9ydCB7RGVja1BhZ2V9ICAgIGZyb20gJy4vcGFnZXMvZGVjay5qcyc7XG5pbXBvcnQge0Nvbm5lY3RQYWdlfSBmcm9tICcuL3BhZ2VzL2Nvbm5lY3QuanMnO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxzcGFuIGNsYXNzPVxcXCJjb25uZWN0XFxcIj5cXG48cD5UaGlzIGlzIHRoZSBjb25uZWN0IHBhZ2UuPC9wPlxcbjx1bD5cXG48bGk+cGVuZGluZyBpbnZpdGF0aW9uczwvPlxcbjxsaT5saXN0IG9mIHBsYXllcnM8L2xpPlxcbjxsaT5jb25uZWN0ZWQgcGxheWVyczwvbGk+XFxuXFxuPGgxPkhlbGxvIHdvcmxkIGd1biBhcHA8L2gxPlxcbjxwPk9wZW4geW91ciB3ZWIgY29uc29sZTwvcD5cXG48L3NwYW4+XFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmF3LWxvYWRlciEuL3ZpZXdzL3BhcnRpYWxzL2Nvbm5lY3QuaHRtbFxuLy8gbW9kdWxlIGlkID0gMjJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxzcGFuIGNsYXNzPVxcXCJjb250YWN0XFxcIj5cXG4gICAgQ29sZSBBbGJvbjxicj5cXG4gICAgPGEgaHJlZj1cXFwidGVsOisxNDE1NjcyMTY0OFxcXCI+KDQxNSkgNjcyLTE2NDg8L2E+PGJyPlxcbiAgICA8YSBocmVmPVxcXCJtYWlsdG86Y29sZS5hbGJvbkBnbWFpbC5jb21cXFwiPmNvbGUuYWxib25AZ21haWwuY29tPC9hPjxicj5cXG4gICAgPGEgaHJlZj1cXFwiaHR0cHM6Ly9naXRodWIuY29tL2NvbGVhbGJvblxcXCI+aHR0cHM6Ly9naXRodWIuY29tL2NvbGVhbGJvbjwvYT48YnI+XFxuICAgIDxhIGhyZWY9XFxcImh0dHBzOi8vd3d3LmxpbmtlZGluLmNvbS9pbi9jb2xlLWFsYm9uLTU5MzQ2MzRcXFwiPlxcbiAgICAgICAgPHNwYW4gaWQ9XFxcImxpbmtlZGluYWRkcmVzc1xcXCIgY2xhc3M9XFxcImxpbmtlZGluYWRkcmVzc1xcXCI+aHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL2NvbGUtYWxib24tNTkzNDYzNDwvc3Bhbj5cXG4gICAgPC9hPjxicj5cXG48L3NwYW4+XFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmF3LWxvYWRlciEuL3ZpZXdzL3BhcnRpYWxzL2NvbnRhY3QuaHRtbFxuLy8gbW9kdWxlIGlkID0gMjNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIiAgICA8ZGl2IGlkPVxcXCJkZWNrXFxcIiBjbGFzcz1cXFwiZGVja1xcXCI+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4paIXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTcwLjMxMjUgMzYyLjI1IEw3MC4zMTI1IDExMC4xMDk0IEwyMjQuMjk2OSAxMTAuMTA5NCBMMjI0LjI5NjkgMzYyLjI1IEw3MC4zMTI1IDM2Mi4yNSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaBBXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuNjcxOSAxMTUuNzM0NCBMOTEuODI4MSAxNzUuNzgxMiBMMTI5LjUxNTYgMTc1Ljc4MTIgTDExMC42NzE5IDExNS43MzQ0IFpNOTkuOTg0NCAxMDEuNjcxOSBMMTIxLjY0MDYgMTAxLjY3MTkgTDE2Mi4xNDA2IDIxOS4yMzQ0IEwxNDMuNTc4MSAyMTkuMjM0NCBMMTM0LjAxNTYgMTg4LjU3ODEgTDg3LjYwOTQgMTg4LjU3ODEgTDc4LjA0NjkgMjE5LjIzNDQgTDU5LjQ4NDQgMjE5LjIzNDQgTDk5Ljk4NDQgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgMlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODYuMzQzOCAyMDMuMDYyNSBMMTQ1Ljk2ODggMjAzLjA2MjUgTDE0NS45Njg4IDIxOS4wOTM4IEw2MS44NzUgMjE5LjA5MzggTDYxLjg3NSAyMDMuNjI1IFE2Ni42NTYyIDE5OS4yNjU2IDc1LjUxNTYgMTkxLjM5MDYgUTEyMy44OTA2IDE0OC41IDEyMy44OTA2IDEzNS4yODEyIFExMjMuODkwNiAxMjYgMTE2LjU3ODEgMTIwLjMwNDcgUTEwOS4yNjU2IDExNC42MDk0IDk3LjMxMjUgMTE0LjYwOTQgUTkwIDExNC42MDk0IDgxLjQyMTkgMTE3LjA3MDMgUTcyLjg0MzggMTE5LjUzMTIgNjIuNzE4OCAxMjQuNDUzMSBMNjIuNzE4OCAxMDcuMTU2MiBRNzMuNTQ2OSAxMDMuMjE4OCA4Mi44OTg0IDEwMS4yNSBROTIuMjUgOTkuMjgxMiAxMDAuMjY1NiA5OS4yODEyIFExMjAuNjU2MiA5OS4yODEyIDEzMi44OTA2IDEwOC41NjI1IFExNDUuMTI1IDExNy44NDM4IDE0NS4xMjUgMTMzLjAzMTIgUTE0NS4xMjUgMTUyLjU3ODEgOTguNTc4MSAxOTIuNTE1NiBROTAuNzAzMSAxOTkuMjY1NiA4Ni4zNDM4IDIwMy4wNjI1IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoDNcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEyMS43ODEyIDE1NS41MzEyIFExMzQuNzE4OCAxNTguMDYyNSAxNDEuODIwMyAxNjUuNzI2NiBRMTQ4LjkyMTkgMTczLjM5MDYgMTQ4LjkyMTkgMTg0LjkyMTkgUTE0OC45MjE5IDIwMi4zNTk0IDEzNS41NjI1IDIxMS43ODEyIFExMjIuMjAzMSAyMjEuMjAzMSA5Ny4zMTI1IDIyMS4yMDMxIFE4OS4yOTY5IDIyMS4yMDMxIDgwLjUwNzggMjE5LjcyNjYgUTcxLjcxODggMjE4LjI1IDYxLjg3NSAyMTUuNDM3NSBMNjEuODc1IDE5OC40MjE5IFE2OS4xODc1IDIwMi4yMTg4IDc3LjU1NDcgMjA0LjA0NjkgUTg1LjkyMTkgMjA1Ljg3NSA5NS4zNDM4IDIwNS44NzUgUTExMC42NzE5IDIwNS44NzUgMTE5LjEwOTQgMjAwLjMyMDMgUTEyNy41NDY5IDE5NC43NjU2IDEyNy41NDY5IDE4NC45MjE5IFExMjcuNTQ2OSAxNzQuNTE1NiAxMTkuNzQyMiAxNjkuMTcxOSBRMTExLjkzNzUgMTYzLjgyODEgOTYuNzUgMTYzLjgyODEgTDg0LjY1NjIgMTYzLjgyODEgTDg0LjY1NjIgMTQ4LjY0MDYgTDk3Ljg3NSAxNDguNjQwNiBRMTExLjA5MzggMTQ4LjY0MDYgMTE3LjkxNDEgMTQ0LjIxMDkgUTEyNC43MzQ0IDEzOS43ODEyIDEyNC43MzQ0IDEzMS4zNDM4IFExMjQuNzM0NCAxMjMuMTg3NSAxMTcuNzAzMSAxMTguODk4NCBRMTEwLjY3MTkgMTE0LjYwOTQgOTcuMzEyNSAxMTQuNjA5NCBROTEuNjg3NSAxMTQuNjA5NCA4NC41MTU2IDExNS44NzUgUTc3LjM0MzggMTE3LjE0MDYgNjUuOTUzMSAxMjAuMzc1IEw2NS45NTMxIDEwNC4yMDMxIFE3Ni4yMTg4IDEwMS44MTI1IDg1LjIxODggMTAwLjU0NjkgUTk0LjIxODggOTkuMjgxMiAxMDEuOTUzMSA5OS4yODEyIFExMjIuMjAzMSA5OS4yODEyIDEzNC4wODU5IDEwNy41NzgxIFExNDUuOTY4OCAxMTUuODc1IDE0NS45Njg4IDEyOS43OTY5IFExNDUuOTY4OCAxMzkuNSAxMzkuNjQwNiAxNDYuMjUgUTEzMy4zMTI1IDE1MyAxMjEuNzgxMiAxNTUuNTMxMiBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaA0XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMjAuMDkzOCAxMTguNjg3NSBMNzYuNjQwNiAxNzcuNjA5NCBMMTIwLjA5MzggMTc3LjYwOTQgTDEyMC4wOTM4IDExOC42ODc1IFpNMTE3IDEwMS42NzE5IEwxNDAuMzQzOCAxMDEuNjcxOSBMMTQwLjM0MzggMTc3LjYwOTQgTDE1OS4zMjgxIDE3Ny42MDk0IEwxNTkuMzI4MSAxOTIuOTM3NSBMMTQwLjM0MzggMTkyLjkzNzUgTDE0MC4zNDM4IDIxOS4wOTM4IEwxMjAuMDkzOCAyMTkuMDkzOCBMMTIwLjA5MzggMTkyLjkzNzUgTDYxLjg3NSAxOTIuOTM3NSBMNjEuODc1IDE3NS45MjE5IEwxMTcgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgNVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjcuNSAxMDEuNjcxOSBMMTM5LjIxODggMTAxLjY3MTkgTDEzOS4yMTg4IDExNS4wMzEyIEw4NC4yMzQ0IDExNS4wMzEyIEw4NC4yMzQ0IDE0My43MTg4IFE4OC4xNzE5IDE0Mi40NTMxIDkyLjI1IDE0MS44OTA2IFE5Ni4xODc1IDE0MS4zMjgxIDEwMC4xMjUgMTQxLjMyODEgUTEyMi43NjU2IDE0MS4zMjgxIDEzNS45ODQ0IDE1Mi4xNTYyIFExNDkuMjAzMSAxNjIuODQzOCAxNDkuMjAzMSAxODEuMjY1NiBRMTQ5LjIwMzEgMjAwLjI1IDEzNS41NjI1IDIxMC43OTY5IFExMjIuMDYyNSAyMjEuMjAzMSA5Ny4zMTI1IDIyMS4yMDMxIFE4OC44NzUgMjIxLjIwMzEgODAuMDE1NiAyMTkuOTM3NSBRNzEuMTU2MiAyMTguNjcxOSA2MS44NzUgMjE2LjE0MDYgTDYxLjg3NSAyMDAuMjUgUTY5Ljg5MDYgMjA0LjA0NjkgNzguNjA5NCAyMDYuMDE1NiBRODcuMzI4MSAyMDcuODQzOCA5Ny4wMzEyIDIwNy44NDM4IFExMTIuNjQwNiAyMDcuODQzOCAxMjEuNzgxMiAyMDAuNjcxOSBRMTMwLjkyMTkgMTkzLjUgMTMwLjkyMTkgMTgxLjI2NTYgUTEzMC45MjE5IDE2OS4wMzEyIDEyMS43ODEyIDE2MS44NTk0IFExMTIuNjQwNiAxNTQuNjg3NSA5Ny4wMzEyIDE1NC42ODc1IFE4OS43MTg4IDE1NC42ODc1IDgyLjQwNjIgMTU2LjA5MzggUTc1LjA5MzggMTU3LjUgNjcuNSAxNjAuNDUzMSBMNjcuNSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaA2XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuMTA5NCAxNTMuNzAzMSBROTcuNzM0NCAxNTMuNzAzMSA5MC41NjI1IDE2MS4wMTU2IFE4My4zOTA2IDE2OC40Njg4IDgzLjM5MDYgMTgxLjI2NTYgUTgzLjM5MDYgMTkzLjkyMTkgOTAuNTYyNSAyMDEuMjM0NCBROTcuNzM0NCAyMDguNjg3NSAxMTAuMTA5NCAyMDguNjg3NSBRMTIyLjM0MzggMjA4LjY4NzUgMTI5LjUxNTYgMjAxLjIzNDQgUTEzNi42ODc1IDE5My45MjE5IDEzNi42ODc1IDE4MS4yNjU2IFExMzYuNjg3NSAxNjguNDY4OCAxMjkuNTE1NiAxNjEuMDE1NiBRMTIyLjM0MzggMTUzLjcwMzEgMTEwLjEwOTQgMTUzLjcwMzEgWk0xNDYuMzkwNiAxMDMuOTIxOSBMMTQ2LjM5MDYgMTE4LjQwNjIgUTEzOS41IDExNS41OTM4IDEzMi40Njg4IDExNC4xODc1IFExMjUuNDM3NSAxMTIuNjQwNiAxMTguNTQ2OSAxMTIuNjQwNiBRMTAwLjU0NjkgMTEyLjY0MDYgOTAuOTg0NCAxMjMuMTg3NSBRODEuNDIxOSAxMzMuODc1IDgwLjAxNTYgMTU1LjM5MDYgUTg1LjM1OTQgMTQ4LjUgOTMuMzc1IDE0NC44NDM4IFExMDEuNTMxMiAxNDEuMTg3NSAxMTEuMDkzOCAxNDEuMTg3NSBRMTMxLjQ4NDQgMTQxLjE4NzUgMTQzLjI5NjkgMTUxLjg3NSBRMTU1LjEwOTQgMTYyLjcwMzEgMTU1LjEwOTQgMTgxLjI2NTYgUTE1NS4xMDk0IDE5OS4xMjUgMTQyLjczNDQgMjEwLjIzNDQgUTEzMC41IDIyMS4yMDMxIDExMC4xMDk0IDIyMS4yMDMxIFE4Ni42MjUgMjIxLjIwMzEgNzQuMjUgMjA1LjU5MzggUTYxLjg3NSAxODkuOTg0NCA2MS44NzUgMTYwLjE3MTkgUTYxLjg3NSAxMzIuMzI4MSA3Ny4wNjI1IDExNS44NzUgUTkyLjI1IDk5LjI4MTIgMTE3Ljg0MzggOTkuMjgxMiBRMTI0LjczNDQgOTkuMjgxMiAxMzEuNzY1NiAxMDAuNDA2MiBRMTM4Ljc5NjkgMTAxLjY3MTkgMTQ2LjM5MDYgMTAzLjkyMTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgN1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjEuODc1IDEwMS42NzE5IEwxNDguNjQwNiAxMDEuNjcxOSBMMTQ4LjY0MDYgMTA4LjQyMTkgTDk5LjcwMzEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggTDEyNi43MDMxIDExNS4wMzEyIEw2MS44NzUgMTE1LjAzMTIgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaA4XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMDguMjgxMiAxNjMuMTI1IFE5NS4yMDMxIDE2My4xMjUgODcuNzUgMTY5LjMxMjUgUTgwLjI5NjkgMTc1LjM1OTQgODAuMjk2OSAxODUuOTA2MiBRODAuMjk2OSAxOTYuNTkzOCA4Ny43NSAyMDIuNjQwNiBROTUuMjAzMSAyMDguNjg3NSAxMDguMjgxMiAyMDguNjg3NSBRMTIxLjIxODggMjA4LjY4NzUgMTI4LjgxMjUgMjAyLjUgUTEzNi4yNjU2IDE5Ni40NTMxIDEzNi4yNjU2IDE4NS45MDYyIFExMzYuMjY1NiAxNzUuMzU5NCAxMjguODEyNSAxNjkuMzEyNSBRMTIxLjM1OTQgMTYzLjEyNSAxMDguMjgxMiAxNjMuMTI1IFpNOTAgMTU2LjIzNDQgUTc4LjE4NzUgMTUzLjcwMzEgNzEuNzE4OCAxNDYuODEyNSBRNjUuMTA5NCAxMzkuNzgxMiA2NS4xMDk0IDEyOS42NTYyIFE2NS4xMDk0IDExNS41OTM4IDc2LjY0MDYgMTA3LjQzNzUgUTg4LjE3MTkgOTkuMjgxMiAxMDguMjgxMiA5OS4yODEyIFExMjguMzkwNiA5OS4yODEyIDEzOS45MjE5IDEwNy40Mzc1IFExNTEuMzEyNSAxMTUuNTkzOCAxNTEuMzEyNSAxMjkuNjU2MiBRMTUxLjMxMjUgMTQwLjA2MjUgMTQ0Ljg0MzggMTQ2LjgxMjUgUTEzOC4yMzQ0IDE1My43MDMxIDEyNi41NjI1IDE1Ni4yMzQ0IFExMzkuMjE4OCAxNTguNzY1NiAxNDcuMDkzOCAxNjYuOTIxOSBRMTU0LjU0NjkgMTc0LjY1NjIgMTU0LjU0NjkgMTg1LjkwNjIgUTE1NC41NDY5IDIwMi45MjE5IDE0Mi41OTM4IDIxMi4wNjI1IFExMzAuNSAyMjEuMjAzMSAxMDguMjgxMiAyMjEuMjAzMSBRODUuOTIxOSAyMjEuMjAzMSA3My45Njg4IDIxMi4wNjI1IFE2MS44NzUgMjAyLjkyMTkgNjEuODc1IDE4NS45MDYyIFE2MS44NzUgMTc0LjkzNzUgNjkuMzI4MSAxNjYuOTIxOSBRNzYuOTIxOSAxNTkuMDQ2OSA5MCAxNTYuMjM0NCBaTTgzLjI1IDEzMS4yMDMxIFE4My4yNSAxNDAuMDYyNSA4OS44NTk0IDE0NS40MDYyIFE5Ni4zMjgxIDE1MC42MDk0IDEwOC4yODEyIDE1MC42MDk0IFExMTkuNjcxOSAxNTAuNjA5NCAxMjYuNTYyNSAxNDUuNDA2MiBRMTMzLjMxMjUgMTQwLjM0MzggMTMzLjMxMjUgMTMxLjIwMzEgUTEzMy4zMTI1IDEyMi4zNDM4IDEyNi41NjI1IDExNyBRMTE5Ljk1MzEgMTExLjc5NjkgMTA4LjI4MTIgMTExLjc5NjkgUTk2LjYwOTQgMTExLjc5NjkgODkuODU5NCAxMTcgUTgzLjI1IDEyMi4wNjI1IDgzLjI1IDEzMS4yMDMxIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoDlcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTcwLjU5MzggMjE2LjU2MjUgTDcwLjU5MzggMjAyLjA3ODEgUTc3LjQ4NDQgMjA0Ljg5MDYgODQuNTE1NiAyMDYuNDM3NSBROTEuNTQ2OSAyMDcuODQzOCA5OC4yOTY5IDIwNy44NDM4IFExMTYuNDM3NSAyMDcuODQzOCAxMjYgMTk3LjI5NjkgUTEzNS40MjE5IDE4Ni43NSAxMzYuODI4MSAxNjUuMDkzOCBRMTMxLjkwNjIgMTcxLjcwMzEgMTIzLjQ2ODggMTc1LjUgUTExNS40NTMxIDE3OS4xNTYyIDEwNS43NSAxNzkuMTU2MiBRODUuNSAxNzkuMTU2MiA3My42ODc1IDE2OC40Njg4IFE2MS44NzUgMTU3Ljc4MTIgNjEuODc1IDEzOS4yMTg4IFE2MS44NzUgMTIxLjA3ODEgNzQuMTA5NCAxMTAuMjUgUTg2LjQ4NDQgOTkuMjgxMiAxMDYuODc1IDk5LjI4MTIgUTEzMC4zNTk0IDk5LjI4MTIgMTQyLjU5MzggMTE0Ljg5MDYgUTE1NC45Njg4IDEzMC41IDE1NC45Njg4IDE2MC4zMTI1IFExNTQuOTY4OCAxODguMTU2MiAxMzkuOTIxOSAyMDQuNjA5NCBRMTI0LjczNDQgMjIxLjIwMzEgOTkuMTQwNiAyMjEuMjAzMSBROTIuMjUgMjIxLjIwMzEgODUuMjE4OCAyMjAuMDc4MSBRNzguMTg3NSAyMTguODEyNSA3MC41OTM4IDIxNi41NjI1IFpNMTA2Ljg3NSAxNjYuNzgxMiBRMTE5LjI1IDE2Ni43ODEyIDEyNi40MjE5IDE1OS40Njg4IFExMzMuNTkzOCAxNTIuMTU2MiAxMzMuNTkzOCAxMzkuMjE4OCBRMTMzLjU5MzggMTI2LjU2MjUgMTI2LjQyMTkgMTE5LjI1IFExMTkuMjUgMTExLjc5NjkgMTA2Ljg3NSAxMTEuNzk2OSBROTQuOTIxOSAxMTEuNzk2OSA4Ny40Njg4IDExOS4yNSBRODAuMTU2MiAxMjYuNTYyNSA4MC4xNTYyIDEzOS4yMTg4IFE4MC4xNTYyIDE1Mi4xNTYyIDg3LjQ2ODggMTU5LjQ2ODggUTk0LjY0MDYgMTY2Ljc4MTIgMTA2Ljg3NSAxNjYuNzgxMiBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaAxMFxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTU5LjA0NjkgMTExLjc5NjkgUTE0OS4wNjI1IDExMS43OTY5IDE0Mi4wMzEyIDEyMy44OTA2IFExMzQuODU5NCAxMzUuOTg0NCAxMzQuODU5NCAxNjAuMTcxOSBRMTM0Ljg1OTQgMTg0LjUgMTQyLjAzMTIgMTk2LjU5MzggUTE0OS4wNjI1IDIwOC42ODc1IDE1OS4wNDY5IDIwOC42ODc1IFExNjkuMDMxMiAyMDguNjg3NSAxNzYuMDYyNSAxOTYuNTkzOCBRMTgzLjIzNDQgMTg0LjUgMTgzLjIzNDQgMTYwLjE3MTkgUTE4My4yMzQ0IDEzNS45ODQ0IDE3Ni4wNjI1IDEyMy44OTA2IFExNjkuMDMxMiAxMTEuNzk2OSAxNTkuMDQ2OSAxMTEuNzk2OSBaTTE1OS4wNDY5IDk5LjI4MTIgUTE3Ny40Njg4IDk5LjI4MTIgMTg5LjQyMTkgMTE0Ljg5MDYgUTIwMS4zNzUgMTMwLjUgMjAxLjM3NSAxNjAuMTcxOSBRMjAxLjM3NSAxODkuOTg0NCAxODkuNDIxOSAyMDUuNTkzOCBRMTc3LjQ2ODggMjIxLjIwMzEgMTU5LjA0NjkgMjIxLjIwMzEgUTEzNi4yNjU2IDIyMS4yMDMxIDEyNi40MjE5IDIwNS41OTM4IFExMTYuNTc4MSAxODkuOTg0NCAxMTYuNTc4MSAxNjAuMTcxOSBRMTE2LjU3ODEgMTMwLjUgMTI2LjQyMTkgMTE0Ljg5MDYgUTEzNi4yNjU2IDk5LjI4MTIgMTU5LjA0NjkgOTkuMjgxMiBaTTgwLjU3ODEgMjE5LjA5MzggTDgwLjU3ODEgMTE3LjcwMzEgTDYxLjg3NSAxMjMuNDY4OCBMNjEuODc1IDEwNy4xNTYyIEw4MS41NjI1IDEwMS42NzE5IEwxMDAuODI4MSAxMDEuNjcxOSBMMTAwLjgyODEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgSlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODkuMTU2MiAxMDEuNjcxOSBMMTA3LjAxNTYgMTAxLjY3MTkgTDEwNy4wMTU2IDE3OC43MzQ0IFExMDcuMDE1NiAxOTkuNjg3NSA5Ny44NzUgMjA5LjUzMTIgUTg4Ljg3NSAyMTkuMjM0NCA2OC43NjU2IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAyMDUuNzM0NCBMNjcuNSAyMDUuNzM0NCBRNzkuMzEyNSAyMDUuNzM0NCA4NC4yMzQ0IDE5OS44MjgxIFE4OS4xNTYyIDE5My45MjE5IDg5LjE1NjIgMTc4LjczNDQgTDg5LjE1NjIgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgUVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTA3LjI5NjkgMjIxLjA2MjUgUTEwNi43MzQ0IDIyMS4wNjI1IDEwNS41MzkxIDIyMS4xMzI4IFExMDQuMzQzOCAyMjEuMjAzMSAxMDMuNjQwNiAyMjEuMjAzMSBRODEuNDIxOSAyMjEuMjAzMSA3MC41MjM0IDIwNi4wODU5IFE1OS42MjUgMTkwLjk2ODggNTkuNjI1IDE2MC4zMTI1IFE1OS42MjUgMTI5LjUxNTYgNzAuNTkzOCAxMTQuMzk4NCBRODEuNTYyNSA5OS4yODEyIDEwMy43ODEyIDk5LjI4MTIgUTEyNi4xNDA2IDk5LjI4MTIgMTM3LjEwOTQgMTE0LjM5ODQgUTE0OC4wNzgxIDEyOS41MTU2IDE0OC4wNzgxIDE2MC4zMTI1IFExNDguMDc4MSAxODMuNTE1NiAxNDIuMDMxMiAxOTcuNjQ4NCBRMTM1Ljk4NDQgMjExLjc4MTIgMTIzLjYwOTQgMjE3LjQwNjIgTDE0MS4zMjgxIDIzMi4zMTI1IEwxMjcuOTY4OCAyNDAuMTg3NSBMMTA3LjI5NjkgMjIxLjA2MjUgWk0xMjkuMzc1IDE2MC4zMTI1IFExMjkuMzc1IDEzNC40Mzc1IDEyMy4zOTg0IDEyMy4zMjgxIFExMTcuNDIxOSAxMTIuMjE4OCAxMDMuNzgxMiAxMTIuMjE4OCBROTAuMjgxMiAxMTIuMjE4OCA4NC4zMDQ3IDEyMy4zMjgxIFE3OC4zMjgxIDEzNC40Mzc1IDc4LjMyODEgMTYwLjMxMjUgUTc4LjMyODEgMTg2LjE4NzUgODQuMzA0NyAxOTcuMjk2OSBROTAuMjgxMiAyMDguNDA2MiAxMDMuNzgxMiAyMDguNDA2MiBRMTE3LjQyMTkgMjA4LjQwNjIgMTIzLjM5ODQgMTk3LjI5NjkgUTEyOS4zNzUgMTg2LjE4NzUgMTI5LjM3NSAxNjAuMzEyNSBaTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaBLXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02MS44NzUgMTAxLjY3MTkgTDc5LjczNDQgMTAxLjY3MTkgTDc5LjczNDQgMTUxLjMxMjUgTDEzMC42NDA2IDEwMS42NzE5IEwxNTMuNzAzMSAxMDEuNjcxOSBMOTYuNDY4OCAxNTYuNTE1NiBMMTU4LjM0MzggMjE5LjIzNDQgTDEzNC44NTk0IDIxOS4yMzQ0IEw3OS43MzQ0IDE2Mi41NjI1IEw3OS43MzQ0IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaVBXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuNjcxOSAxMTUuNzM0NCBMOTEuODI4MSAxNzUuNzgxMiBMMTI5LjUxNTYgMTc1Ljc4MTIgTDExMC42NzE5IDExNS43MzQ0IFpNOTkuOTg0NCAxMDEuNjcxOSBMMTIxLjY0MDYgMTAxLjY3MTkgTDE2Mi4xNDA2IDIxOS4yMzQ0IEwxNDMuNTc4MSAyMTkuMjM0NCBMMTM0LjAxNTYgMTg4LjU3ODEgTDg3LjYwOTQgMTg4LjU3ODEgTDc4LjA0NjkgMjE5LjIzNDQgTDU5LjQ4NDQgMjE5LjIzNDQgTDk5Ljk4NDQgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlMlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTg2LjM0MzggMjAzLjA2MjUgTDE0NS45Njg4IDIwMy4wNjI1IEwxNDUuOTY4OCAyMTkuMDkzOCBMNjEuODc1IDIxOS4wOTM4IEw2MS44NzUgMjAzLjYyNSBRNjYuNjU2MiAxOTkuMjY1NiA3NS41MTU2IDE5MS4zOTA2IFExMjMuODkwNiAxNDguNSAxMjMuODkwNiAxMzUuMjgxMiBRMTIzLjg5MDYgMTI2IDExNi41NzgxIDEyMC4zMDQ3IFExMDkuMjY1NiAxMTQuNjA5NCA5Ny4zMTI1IDExNC42MDk0IFE5MCAxMTQuNjA5NCA4MS40MjE5IDExNy4wNzAzIFE3Mi44NDM4IDExOS41MzEyIDYyLjcxODggMTI0LjQ1MzEgTDYyLjcxODggMTA3LjE1NjIgUTczLjU0NjkgMTAzLjIxODggODIuODk4NCAxMDEuMjUgUTkyLjI1IDk5LjI4MTIgMTAwLjI2NTYgOTkuMjgxMiBRMTIwLjY1NjIgOTkuMjgxMiAxMzIuODkwNiAxMDguNTYyNSBRMTQ1LjEyNSAxMTcuODQzOCAxNDUuMTI1IDEzMy4wMzEyIFExNDUuMTI1IDE1Mi41NzgxIDk4LjU3ODEgMTkyLjUxNTYgUTkwLjcwMzEgMTk5LjI2NTYgODYuMzQzOCAyMDMuMDYyNSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaUzXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTIxLjc4MTIgMTU1LjUzMTIgUTEzNC43MTg4IDE1OC4wNjI1IDE0MS44MjAzIDE2NS43MjY2IFExNDguOTIxOSAxNzMuMzkwNiAxNDguOTIxOSAxODQuOTIxOSBRMTQ4LjkyMTkgMjAyLjM1OTQgMTM1LjU2MjUgMjExLjc4MTIgUTEyMi4yMDMxIDIyMS4yMDMxIDk3LjMxMjUgMjIxLjIwMzEgUTg5LjI5NjkgMjIxLjIwMzEgODAuNTA3OCAyMTkuNzI2NiBRNzEuNzE4OCAyMTguMjUgNjEuODc1IDIxNS40Mzc1IEw2MS44NzUgMTk4LjQyMTkgUTY5LjE4NzUgMjAyLjIxODggNzcuNTU0NyAyMDQuMDQ2OSBRODUuOTIxOSAyMDUuODc1IDk1LjM0MzggMjA1Ljg3NSBRMTEwLjY3MTkgMjA1Ljg3NSAxMTkuMTA5NCAyMDAuMzIwMyBRMTI3LjU0NjkgMTk0Ljc2NTYgMTI3LjU0NjkgMTg0LjkyMTkgUTEyNy41NDY5IDE3NC41MTU2IDExOS43NDIyIDE2OS4xNzE5IFExMTEuOTM3NSAxNjMuODI4MSA5Ni43NSAxNjMuODI4MSBMODQuNjU2MiAxNjMuODI4MSBMODQuNjU2MiAxNDguNjQwNiBMOTcuODc1IDE0OC42NDA2IFExMTEuMDkzOCAxNDguNjQwNiAxMTcuOTE0MSAxNDQuMjEwOSBRMTI0LjczNDQgMTM5Ljc4MTIgMTI0LjczNDQgMTMxLjM0MzggUTEyNC43MzQ0IDEyMy4xODc1IDExNy43MDMxIDExOC44OTg0IFExMTAuNjcxOSAxMTQuNjA5NCA5Ny4zMTI1IDExNC42MDk0IFE5MS42ODc1IDExNC42MDk0IDg0LjUxNTYgMTE1Ljg3NSBRNzcuMzQzOCAxMTcuMTQwNiA2NS45NTMxIDEyMC4zNzUgTDY1Ljk1MzEgMTA0LjIwMzEgUTc2LjIxODggMTAxLjgxMjUgODUuMjE4OCAxMDAuNTQ2OSBROTQuMjE4OCA5OS4yODEyIDEwMS45NTMxIDk5LjI4MTIgUTEyMi4yMDMxIDk5LjI4MTIgMTM0LjA4NTkgMTA3LjU3ODEgUTE0NS45Njg4IDExNS44NzUgMTQ1Ljk2ODggMTI5Ljc5NjkgUTE0NS45Njg4IDEzOS41IDEzOS42NDA2IDE0Ni4yNSBRMTMzLjMxMjUgMTUzIDEyMS43ODEyIDE1NS41MzEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpTRcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi42ODc1IDI3My42NTYyIFExNzUuNzgxMiAyNTcuMDYyNSAxODMuNTE1NiAyNDguMzQzOCBRMTkyLjIzNDQgMjM4LjM1OTQgMjA0LjA0NjkgMjM4LjM1OTQgUTIyMy41OTM4IDIzOC4zNTk0IDIzMi4zMTI1IDI1OS4zMTI1IFEyMzQuOTg0NCAyNjUuNjQwNiAyMzQuOTg0NCAyNzMuOTM3NSBRMjM0Ljk4NDQgMjk2LjE1NjIgMjE3LjQwNjIgMzE4LjUxNTYgTDE3Mi45Njg4IDM3NS4wNDY5IEwxMjcuOTY4OCAzMTguNTE1NiBRMTEwLjM5MDYgMjk2LjQzNzUgMTEwLjM5MDYgMjczLjkzNzUgUTExMC4zOTA2IDI2NS42NDA2IDExMy4wNjI1IDI1OS4zMTI1IFExMjEuOTIxOSAyMzguMzU5NCAxNDEuMzI4MSAyMzguMzU5NCBRMTUzLjQyMTkgMjM4LjM1OTQgMTYxLjg1OTQgMjQ4LjM0MzggUTE2OS41OTM4IDI1Ny40ODQ0IDE3Mi42ODc1IDI3My42NTYyIFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMjAuMDkzOCAxMTguNjg3NSBMNzYuNjQwNiAxNzcuNjA5NCBMMTIwLjA5MzggMTc3LjYwOTQgTDEyMC4wOTM4IDExOC42ODc1IFpNMTE3IDEwMS42NzE5IEwxNDAuMzQzOCAxMDEuNjcxOSBMMTQwLjM0MzggMTc3LjYwOTQgTDE1OS4zMjgxIDE3Ny42MDk0IEwxNTkuMzI4MSAxOTIuOTM3NSBMMTQwLjM0MzggMTkyLjkzNzUgTDE0MC4zNDM4IDIxOS4wOTM4IEwxMjAuMDkzOCAyMTkuMDkzOCBMMTIwLjA5MzggMTkyLjkzNzUgTDYxLjg3NSAxOTIuOTM3NSBMNjEuODc1IDE3NS45MjE5IEwxMTcgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlNVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTY3LjUgMTAxLjY3MTkgTDEzOS4yMTg4IDEwMS42NzE5IEwxMzkuMjE4OCAxMTUuMDMxMiBMODQuMjM0NCAxMTUuMDMxMiBMODQuMjM0NCAxNDMuNzE4OCBRODguMTcxOSAxNDIuNDUzMSA5Mi4yNSAxNDEuODkwNiBROTYuMTg3NSAxNDEuMzI4MSAxMDAuMTI1IDE0MS4zMjgxIFExMjIuNzY1NiAxNDEuMzI4MSAxMzUuOTg0NCAxNTIuMTU2MiBRMTQ5LjIwMzEgMTYyLjg0MzggMTQ5LjIwMzEgMTgxLjI2NTYgUTE0OS4yMDMxIDIwMC4yNSAxMzUuNTYyNSAyMTAuNzk2OSBRMTIyLjA2MjUgMjIxLjIwMzEgOTcuMzEyNSAyMjEuMjAzMSBRODguODc1IDIyMS4yMDMxIDgwLjAxNTYgMjE5LjkzNzUgUTcxLjE1NjIgMjE4LjY3MTkgNjEuODc1IDIxNi4xNDA2IEw2MS44NzUgMjAwLjI1IFE2OS44OTA2IDIwNC4wNDY5IDc4LjYwOTQgMjA2LjAxNTYgUTg3LjMyODEgMjA3Ljg0MzggOTcuMDMxMiAyMDcuODQzOCBRMTEyLjY0MDYgMjA3Ljg0MzggMTIxLjc4MTIgMjAwLjY3MTkgUTEzMC45MjE5IDE5My41IDEzMC45MjE5IDE4MS4yNjU2IFExMzAuOTIxOSAxNjkuMDMxMiAxMjEuNzgxMiAxNjEuODU5NCBRMTEyLjY0MDYgMTU0LjY4NzUgOTcuMDMxMiAxNTQuNjg3NSBRODkuNzE4OCAxNTQuNjg3NSA4Mi40MDYyIDE1Ni4wOTM4IFE3NS4wOTM4IDE1Ny41IDY3LjUgMTYwLjQ1MzEgTDY3LjUgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlNlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTExMC4xMDk0IDE1My43MDMxIFE5Ny43MzQ0IDE1My43MDMxIDkwLjU2MjUgMTYxLjAxNTYgUTgzLjM5MDYgMTY4LjQ2ODggODMuMzkwNiAxODEuMjY1NiBRODMuMzkwNiAxOTMuOTIxOSA5MC41NjI1IDIwMS4yMzQ0IFE5Ny43MzQ0IDIwOC42ODc1IDExMC4xMDk0IDIwOC42ODc1IFExMjIuMzQzOCAyMDguNjg3NSAxMjkuNTE1NiAyMDEuMjM0NCBRMTM2LjY4NzUgMTkzLjkyMTkgMTM2LjY4NzUgMTgxLjI2NTYgUTEzNi42ODc1IDE2OC40Njg4IDEyOS41MTU2IDE2MS4wMTU2IFExMjIuMzQzOCAxNTMuNzAzMSAxMTAuMTA5NCAxNTMuNzAzMSBaTTE0Ni4zOTA2IDEwMy45MjE5IEwxNDYuMzkwNiAxMTguNDA2MiBRMTM5LjUgMTE1LjU5MzggMTMyLjQ2ODggMTE0LjE4NzUgUTEyNS40Mzc1IDExMi42NDA2IDExOC41NDY5IDExMi42NDA2IFExMDAuNTQ2OSAxMTIuNjQwNiA5MC45ODQ0IDEyMy4xODc1IFE4MS40MjE5IDEzMy44NzUgODAuMDE1NiAxNTUuMzkwNiBRODUuMzU5NCAxNDguNSA5My4zNzUgMTQ0Ljg0MzggUTEwMS41MzEyIDE0MS4xODc1IDExMS4wOTM4IDE0MS4xODc1IFExMzEuNDg0NCAxNDEuMTg3NSAxNDMuMjk2OSAxNTEuODc1IFExNTUuMTA5NCAxNjIuNzAzMSAxNTUuMTA5NCAxODEuMjY1NiBRMTU1LjEwOTQgMTk5LjEyNSAxNDIuNzM0NCAyMTAuMjM0NCBRMTMwLjUgMjIxLjIwMzEgMTEwLjEwOTQgMjIxLjIwMzEgUTg2LjYyNSAyMjEuMjAzMSA3NC4yNSAyMDUuNTkzOCBRNjEuODc1IDE4OS45ODQ0IDYxLjg3NSAxNjAuMTcxOSBRNjEuODc1IDEzMi4zMjgxIDc3LjA2MjUgMTE1Ljg3NSBROTIuMjUgOTkuMjgxMiAxMTcuODQzOCA5OS4yODEyIFExMjQuNzM0NCA5OS4yODEyIDEzMS43NjU2IDEwMC40MDYyIFExMzguNzk2OSAxMDEuNjcxOSAxNDYuMzkwNiAxMDMuOTIxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaU3XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjEuODc1IDEwMS42NzE5IEwxNDguNjQwNiAxMDEuNjcxOSBMMTQ4LjY0MDYgMTA4LjQyMTkgTDk5LjcwMzEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggTDEyNi43MDMxIDExNS4wMzEyIEw2MS44NzUgMTE1LjAzMTIgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaU4XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTA4LjI4MTIgMTYzLjEyNSBROTUuMjAzMSAxNjMuMTI1IDg3Ljc1IDE2OS4zMTI1IFE4MC4yOTY5IDE3NS4zNTk0IDgwLjI5NjkgMTg1LjkwNjIgUTgwLjI5NjkgMTk2LjU5MzggODcuNzUgMjAyLjY0MDYgUTk1LjIwMzEgMjA4LjY4NzUgMTA4LjI4MTIgMjA4LjY4NzUgUTEyMS4yMTg4IDIwOC42ODc1IDEyOC44MTI1IDIwMi41IFExMzYuMjY1NiAxOTYuNDUzMSAxMzYuMjY1NiAxODUuOTA2MiBRMTM2LjI2NTYgMTc1LjM1OTQgMTI4LjgxMjUgMTY5LjMxMjUgUTEyMS4zNTk0IDE2My4xMjUgMTA4LjI4MTIgMTYzLjEyNSBaTTkwIDE1Ni4yMzQ0IFE3OC4xODc1IDE1My43MDMxIDcxLjcxODggMTQ2LjgxMjUgUTY1LjEwOTQgMTM5Ljc4MTIgNjUuMTA5NCAxMjkuNjU2MiBRNjUuMTA5NCAxMTUuNTkzOCA3Ni42NDA2IDEwNy40Mzc1IFE4OC4xNzE5IDk5LjI4MTIgMTA4LjI4MTIgOTkuMjgxMiBRMTI4LjM5MDYgOTkuMjgxMiAxMzkuOTIxOSAxMDcuNDM3NSBRMTUxLjMxMjUgMTE1LjU5MzggMTUxLjMxMjUgMTI5LjY1NjIgUTE1MS4zMTI1IDE0MC4wNjI1IDE0NC44NDM4IDE0Ni44MTI1IFExMzguMjM0NCAxNTMuNzAzMSAxMjYuNTYyNSAxNTYuMjM0NCBRMTM5LjIxODggMTU4Ljc2NTYgMTQ3LjA5MzggMTY2LjkyMTkgUTE1NC41NDY5IDE3NC42NTYyIDE1NC41NDY5IDE4NS45MDYyIFExNTQuNTQ2OSAyMDIuOTIxOSAxNDIuNTkzOCAyMTIuMDYyNSBRMTMwLjUgMjIxLjIwMzEgMTA4LjI4MTIgMjIxLjIwMzEgUTg1LjkyMTkgMjIxLjIwMzEgNzMuOTY4OCAyMTIuMDYyNSBRNjEuODc1IDIwMi45MjE5IDYxLjg3NSAxODUuOTA2MiBRNjEuODc1IDE3NC45Mzc1IDY5LjMyODEgMTY2LjkyMTkgUTc2LjkyMTkgMTU5LjA0NjkgOTAgMTU2LjIzNDQgWk04My4yNSAxMzEuMjAzMSBRODMuMjUgMTQwLjA2MjUgODkuODU5NCAxNDUuNDA2MiBROTYuMzI4MSAxNTAuNjA5NCAxMDguMjgxMiAxNTAuNjA5NCBRMTE5LjY3MTkgMTUwLjYwOTQgMTI2LjU2MjUgMTQ1LjQwNjIgUTEzMy4zMTI1IDE0MC4zNDM4IDEzMy4zMTI1IDEzMS4yMDMxIFExMzMuMzEyNSAxMjIuMzQzOCAxMjYuNTYyNSAxMTcgUTExOS45NTMxIDExMS43OTY5IDEwOC4yODEyIDExMS43OTY5IFE5Ni42MDk0IDExMS43OTY5IDg5Ljg1OTQgMTE3IFE4My4yNSAxMjIuMDYyNSA4My4yNSAxMzEuMjAzMSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaU5XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNzAuNTkzOCAyMTYuNTYyNSBMNzAuNTkzOCAyMDIuMDc4MSBRNzcuNDg0NCAyMDQuODkwNiA4NC41MTU2IDIwNi40Mzc1IFE5MS41NDY5IDIwNy44NDM4IDk4LjI5NjkgMjA3Ljg0MzggUTExNi40Mzc1IDIwNy44NDM4IDEyNiAxOTcuMjk2OSBRMTM1LjQyMTkgMTg2Ljc1IDEzNi44MjgxIDE2NS4wOTM4IFExMzEuOTA2MiAxNzEuNzAzMSAxMjMuNDY4OCAxNzUuNSBRMTE1LjQ1MzEgMTc5LjE1NjIgMTA1Ljc1IDE3OS4xNTYyIFE4NS41IDE3OS4xNTYyIDczLjY4NzUgMTY4LjQ2ODggUTYxLjg3NSAxNTcuNzgxMiA2MS44NzUgMTM5LjIxODggUTYxLjg3NSAxMjEuMDc4MSA3NC4xMDk0IDExMC4yNSBRODYuNDg0NCA5OS4yODEyIDEwNi44NzUgOTkuMjgxMiBRMTMwLjM1OTQgOTkuMjgxMiAxNDIuNTkzOCAxMTQuODkwNiBRMTU0Ljk2ODggMTMwLjUgMTU0Ljk2ODggMTYwLjMxMjUgUTE1NC45Njg4IDE4OC4xNTYyIDEzOS45MjE5IDIwNC42MDk0IFExMjQuNzM0NCAyMjEuMjAzMSA5OS4xNDA2IDIyMS4yMDMxIFE5Mi4yNSAyMjEuMjAzMSA4NS4yMTg4IDIyMC4wNzgxIFE3OC4xODc1IDIxOC44MTI1IDcwLjU5MzggMjE2LjU2MjUgWk0xMDYuODc1IDE2Ni43ODEyIFExMTkuMjUgMTY2Ljc4MTIgMTI2LjQyMTkgMTU5LjQ2ODggUTEzMy41OTM4IDE1Mi4xNTYyIDEzMy41OTM4IDEzOS4yMTg4IFExMzMuNTkzOCAxMjYuNTYyNSAxMjYuNDIxOSAxMTkuMjUgUTExOS4yNSAxMTEuNzk2OSAxMDYuODc1IDExMS43OTY5IFE5NC45MjE5IDExMS43OTY5IDg3LjQ2ODggMTE5LjI1IFE4MC4xNTYyIDEyNi41NjI1IDgwLjE1NjIgMTM5LjIxODggUTgwLjE1NjIgMTUyLjE1NjIgODcuNDY4OCAxNTkuNDY4OCBROTQuNjQwNiAxNjYuNzgxMiAxMDYuODc1IDE2Ni43ODEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpTEwXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTU5LjA0NjkgMTExLjc5NjkgUTE0OS4wNjI1IDExMS43OTY5IDE0Mi4wMzEyIDEyMy44OTA2IFExMzQuODU5NCAxMzUuOTg0NCAxMzQuODU5NCAxNjAuMTcxOSBRMTM0Ljg1OTQgMTg0LjUgMTQyLjAzMTIgMTk2LjU5MzggUTE0OS4wNjI1IDIwOC42ODc1IDE1OS4wNDY5IDIwOC42ODc1IFExNjkuMDMxMiAyMDguNjg3NSAxNzYuMDYyNSAxOTYuNTkzOCBRMTgzLjIzNDQgMTg0LjUgMTgzLjIzNDQgMTYwLjE3MTkgUTE4My4yMzQ0IDEzNS45ODQ0IDE3Ni4wNjI1IDEyMy44OTA2IFExNjkuMDMxMiAxMTEuNzk2OSAxNTkuMDQ2OSAxMTEuNzk2OSBaTTE1OS4wNDY5IDk5LjI4MTIgUTE3Ny40Njg4IDk5LjI4MTIgMTg5LjQyMTkgMTE0Ljg5MDYgUTIwMS4zNzUgMTMwLjUgMjAxLjM3NSAxNjAuMTcxOSBRMjAxLjM3NSAxODkuOTg0NCAxODkuNDIxOSAyMDUuNTkzOCBRMTc3LjQ2ODggMjIxLjIwMzEgMTU5LjA0NjkgMjIxLjIwMzEgUTEzNi4yNjU2IDIyMS4yMDMxIDEyNi40MjE5IDIwNS41OTM4IFExMTYuNTc4MSAxODkuOTg0NCAxMTYuNTc4MSAxNjAuMTcxOSBRMTE2LjU3ODEgMTMwLjUgMTI2LjQyMTkgMTE0Ljg5MDYgUTEzNi4yNjU2IDk5LjI4MTIgMTU5LjA0NjkgOTkuMjgxMiBaTTgwLjU3ODEgMjE5LjA5MzggTDgwLjU3ODEgMTE3LjcwMzEgTDYxLjg3NSAxMjMuNDY4OCBMNjEuODc1IDEwNy4xNTYyIEw4MS41NjI1IDEwMS42NzE5IEwxMDAuODI4MSAxMDEuNjcxOSBMMTAwLjgyODEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlSlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTg5LjE1NjIgMTAxLjY3MTkgTDEwNy4wMTU2IDEwMS42NzE5IEwxMDcuMDE1NiAxNzguNzM0NCBRMTA3LjAxNTYgMTk5LjY4NzUgOTcuODc1IDIwOS41MzEyIFE4OC44NzUgMjE5LjIzNDQgNjguNzY1NiAyMTkuMjM0NCBMNjEuODc1IDIxOS4yMzQ0IEw2MS44NzUgMjA1LjczNDQgTDY3LjUgMjA1LjczNDQgUTc5LjMxMjUgMjA1LjczNDQgODQuMjM0NCAxOTkuODI4MSBRODkuMTU2MiAxOTMuOTIxOSA4OS4xNTYyIDE3OC43MzQ0IEw4OS4xNTYyIDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpVFcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTEwNy4yOTY5IDIyMS4wNjI1IFExMDYuNzM0NCAyMjEuMDYyNSAxMDUuNTM5MSAyMjEuMTMyOCBRMTA0LjM0MzggMjIxLjIwMzEgMTAzLjY0MDYgMjIxLjIwMzEgUTgxLjQyMTkgMjIxLjIwMzEgNzAuNTIzNCAyMDYuMDg1OSBRNTkuNjI1IDE5MC45Njg4IDU5LjYyNSAxNjAuMzEyNSBRNTkuNjI1IDEyOS41MTU2IDcwLjU5MzggMTE0LjM5ODQgUTgxLjU2MjUgOTkuMjgxMiAxMDMuNzgxMiA5OS4yODEyIFExMjYuMTQwNiA5OS4yODEyIDEzNy4xMDk0IDExNC4zOTg0IFExNDguMDc4MSAxMjkuNTE1NiAxNDguMDc4MSAxNjAuMzEyNSBRMTQ4LjA3ODEgMTgzLjUxNTYgMTQyLjAzMTIgMTk3LjY0ODQgUTEzNS45ODQ0IDIxMS43ODEyIDEyMy42MDk0IDIxNy40MDYyIEwxNDEuMzI4MSAyMzIuMzEyNSBMMTI3Ljk2ODggMjQwLjE4NzUgTDEwNy4yOTY5IDIyMS4wNjI1IFpNMTI5LjM3NSAxNjAuMzEyNSBRMTI5LjM3NSAxMzQuNDM3NSAxMjMuMzk4NCAxMjMuMzI4MSBRMTE3LjQyMTkgMTEyLjIxODggMTAzLjc4MTIgMTEyLjIxODggUTkwLjI4MTIgMTEyLjIxODggODQuMzA0NyAxMjMuMzI4MSBRNzguMzI4MSAxMzQuNDM3NSA3OC4zMjgxIDE2MC4zMTI1IFE3OC4zMjgxIDE4Ni4xODc1IDg0LjMwNDcgMTk3LjI5NjkgUTkwLjI4MTIgMjA4LjQwNjIgMTAzLjc4MTIgMjA4LjQwNjIgUTExNy40MjE5IDIwOC40MDYyIDEyMy4zOTg0IDE5Ny4yOTY5IFExMjkuMzc1IDE4Ni4xODc1IDEyOS4zNzUgMTYwLjMxMjUgWk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTY0LjI2NTYgODQuNzk2OSBRNDcuMzkwNiA4NC43OTY5IDQ3LjM5MDYgMTAxLjY3MTkgTDQ3LjM5MDYgMzcwLjY4NzUgUTQ3LjM5MDYgMzg3LjU2MjUgNjQuMjY1NiAzODcuNTYyNSBMMjM1LjEyNSAzODcuNTYyNSBRMjUyIDM4Ny41NjI1IDI1MiAzNzAuNjg3NSBMMjUyIDEwMS42NzE5IFEyNTIgODQuNzk2OSAyMzUuMTI1IDg0Ljc5NjkgTDY0LjI2NTYgODQuNzk2OSBaTTY0LjI2NTYgNjcuOTIxOSBMMjM1LjEyNSA2Ny45MjE5IFEyNjguODc1IDY3LjkyMTkgMjY4Ljg3NSAxMDEuNjcxOSBMMjY4Ljg3NSAzNzAuNjg3NSBRMjY4Ljg3NSA0MDQuNDM3NSAyMzUuMTI1IDQwNC40Mzc1IEw2NC4yNjU2IDQwNC40Mzc1IFEzMC41MTU2IDQwNC40Mzc1IDMwLjUxNTYgMzcwLjY4NzUgTDMwLjUxNTYgMTAxLjY3MTkgUTMwLjUxNTYgNjcuOTIxOSA2NC4yNjU2IDY3LjkyMTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlS1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTYxLjg3NSAxMDEuNjcxOSBMNzkuNzM0NCAxMDEuNjcxOSBMNzkuNzM0NCAxNTEuMzEyNSBMMTMwLjY0MDYgMTAxLjY3MTkgTDE1My43MDMxIDEwMS42NzE5IEw5Ni40Njg4IDE1Ni41MTU2IEwxNTguMzQzOCAyMTkuMjM0NCBMMTM0Ljg1OTQgMjE5LjIzNDQgTDc5LjczNDQgMTYyLjU2MjUgTDc5LjczNDQgMjE5LjIzNDQgTDYxLjg3NSAyMTkuMjM0NCBMNjEuODc1IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpkFcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuNjcxOSAxMTUuNzM0NCBMOTEuODI4MSAxNzUuNzgxMiBMMTI5LjUxNTYgMTc1Ljc4MTIgTDExMC42NzE5IDExNS43MzQ0IFpNOTkuOTg0NCAxMDEuNjcxOSBMMTIxLjY0MDYgMTAxLjY3MTkgTDE2Mi4xNDA2IDIxOS4yMzQ0IEwxNDMuNTc4MSAyMTkuMjM0NCBMMTM0LjAxNTYgMTg4LjU3ODEgTDg3LjYwOTQgMTg4LjU3ODEgTDc4LjA0NjkgMjE5LjIzNDQgTDU5LjQ4NDQgMjE5LjIzNDQgTDk5Ljk4NDQgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmMlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTg2LjM0MzggMjAzLjA2MjUgTDE0NS45Njg4IDIwMy4wNjI1IEwxNDUuOTY4OCAyMTkuMDkzOCBMNjEuODc1IDIxOS4wOTM4IEw2MS44NzUgMjAzLjYyNSBRNjYuNjU2MiAxOTkuMjY1NiA3NS41MTU2IDE5MS4zOTA2IFExMjMuODkwNiAxNDguNSAxMjMuODkwNiAxMzUuMjgxMiBRMTIzLjg5MDYgMTI2IDExNi41NzgxIDEyMC4zMDQ3IFExMDkuMjY1NiAxMTQuNjA5NCA5Ny4zMTI1IDExNC42MDk0IFE5MCAxMTQuNjA5NCA4MS40MjE5IDExNy4wNzAzIFE3Mi44NDM4IDExOS41MzEyIDYyLjcxODggMTI0LjQ1MzEgTDYyLjcxODggMTA3LjE1NjIgUTczLjU0NjkgMTAzLjIxODggODIuODk4NCAxMDEuMjUgUTkyLjI1IDk5LjI4MTIgMTAwLjI2NTYgOTkuMjgxMiBRMTIwLjY1NjIgOTkuMjgxMiAxMzIuODkwNiAxMDguNTYyNSBRMTQ1LjEyNSAxMTcuODQzOCAxNDUuMTI1IDEzMy4wMzEyIFExNDUuMTI1IDE1Mi41NzgxIDk4LjU3ODEgMTkyLjUxNTYgUTkwLjcwMzEgMTk5LjI2NTYgODYuMzQzOCAyMDMuMDYyNSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaYzXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTIxLjc4MTIgMTU1LjUzMTIgUTEzNC43MTg4IDE1OC4wNjI1IDE0MS44MjAzIDE2NS43MjY2IFExNDguOTIxOSAxNzMuMzkwNiAxNDguOTIxOSAxODQuOTIxOSBRMTQ4LjkyMTkgMjAyLjM1OTQgMTM1LjU2MjUgMjExLjc4MTIgUTEyMi4yMDMxIDIyMS4yMDMxIDk3LjMxMjUgMjIxLjIwMzEgUTg5LjI5NjkgMjIxLjIwMzEgODAuNTA3OCAyMTkuNzI2NiBRNzEuNzE4OCAyMTguMjUgNjEuODc1IDIxNS40Mzc1IEw2MS44NzUgMTk4LjQyMTkgUTY5LjE4NzUgMjAyLjIxODggNzcuNTU0NyAyMDQuMDQ2OSBRODUuOTIxOSAyMDUuODc1IDk1LjM0MzggMjA1Ljg3NSBRMTEwLjY3MTkgMjA1Ljg3NSAxMTkuMTA5NCAyMDAuMzIwMyBRMTI3LjU0NjkgMTk0Ljc2NTYgMTI3LjU0NjkgMTg0LjkyMTkgUTEyNy41NDY5IDE3NC41MTU2IDExOS43NDIyIDE2OS4xNzE5IFExMTEuOTM3NSAxNjMuODI4MSA5Ni43NSAxNjMuODI4MSBMODQuNjU2MiAxNjMuODI4MSBMODQuNjU2MiAxNDguNjQwNiBMOTcuODc1IDE0OC42NDA2IFExMTEuMDkzOCAxNDguNjQwNiAxMTcuOTE0MSAxNDQuMjEwOSBRMTI0LjczNDQgMTM5Ljc4MTIgMTI0LjczNDQgMTMxLjM0MzggUTEyNC43MzQ0IDEyMy4xODc1IDExNy43MDMxIDExOC44OTg0IFExMTAuNjcxOSAxMTQuNjA5NCA5Ny4zMTI1IDExNC42MDk0IFE5MS42ODc1IDExNC42MDk0IDg0LjUxNTYgMTE1Ljg3NSBRNzcuMzQzOCAxMTcuMTQwNiA2NS45NTMxIDEyMC4zNzUgTDY1Ljk1MzEgMTA0LjIwMzEgUTc2LjIxODggMTAxLjgxMjUgODUuMjE4OCAxMDAuNTQ2OSBROTQuMjE4OCA5OS4yODEyIDEwMS45NTMxIDk5LjI4MTIgUTEyMi4yMDMxIDk5LjI4MTIgMTM0LjA4NTkgMTA3LjU3ODEgUTE0NS45Njg4IDExNS44NzUgMTQ1Ljk2ODggMTI5Ljc5NjkgUTE0NS45Njg4IDEzOS41IDEzOS42NDA2IDE0Ni4yNSBRMTMzLjMxMjUgMTUzIDEyMS43ODEyIDE1NS41MzEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpjRcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMjAuMDkzOCAxMTguNjg3NSBMNzYuNjQwNiAxNzcuNjA5NCBMMTIwLjA5MzggMTc3LjYwOTQgTDEyMC4wOTM4IDExOC42ODc1IFpNMTE3IDEwMS42NzE5IEwxNDAuMzQzOCAxMDEuNjcxOSBMMTQwLjM0MzggMTc3LjYwOTQgTDE1OS4zMjgxIDE3Ny42MDk0IEwxNTkuMzI4MSAxOTIuOTM3NSBMMTQwLjM0MzggMTkyLjkzNzUgTDE0MC4zNDM4IDIxOS4wOTM4IEwxMjAuMDkzOCAyMTkuMDkzOCBMMTIwLjA5MzggMTkyLjkzNzUgTDYxLjg3NSAxOTIuOTM3NSBMNjEuODc1IDE3NS45MjE5IEwxMTcgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmNVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTY3LjUgMTAxLjY3MTkgTDEzOS4yMTg4IDEwMS42NzE5IEwxMzkuMjE4OCAxMTUuMDMxMiBMODQuMjM0NCAxMTUuMDMxMiBMODQuMjM0NCAxNDMuNzE4OCBRODguMTcxOSAxNDIuNDUzMSA5Mi4yNSAxNDEuODkwNiBROTYuMTg3NSAxNDEuMzI4MSAxMDAuMTI1IDE0MS4zMjgxIFExMjIuNzY1NiAxNDEuMzI4MSAxMzUuOTg0NCAxNTIuMTU2MiBRMTQ5LjIwMzEgMTYyLjg0MzggMTQ5LjIwMzEgMTgxLjI2NTYgUTE0OS4yMDMxIDIwMC4yNSAxMzUuNTYyNSAyMTAuNzk2OSBRMTIyLjA2MjUgMjIxLjIwMzEgOTcuMzEyNSAyMjEuMjAzMSBRODguODc1IDIyMS4yMDMxIDgwLjAxNTYgMjE5LjkzNzUgUTcxLjE1NjIgMjE4LjY3MTkgNjEuODc1IDIxNi4xNDA2IEw2MS44NzUgMjAwLjI1IFE2OS44OTA2IDIwNC4wNDY5IDc4LjYwOTQgMjA2LjAxNTYgUTg3LjMyODEgMjA3Ljg0MzggOTcuMDMxMiAyMDcuODQzOCBRMTEyLjY0MDYgMjA3Ljg0MzggMTIxLjc4MTIgMjAwLjY3MTkgUTEzMC45MjE5IDE5My41IDEzMC45MjE5IDE4MS4yNjU2IFExMzAuOTIxOSAxNjkuMDMxMiAxMjEuNzgxMiAxNjEuODU5NCBRMTEyLjY0MDYgMTU0LjY4NzUgOTcuMDMxMiAxNTQuNjg3NSBRODkuNzE4OCAxNTQuNjg3NSA4Mi40MDYyIDE1Ni4wOTM4IFE3NS4wOTM4IDE1Ny41IDY3LjUgMTYwLjQ1MzEgTDY3LjUgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmNlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTExMC4xMDk0IDE1My43MDMxIFE5Ny43MzQ0IDE1My43MDMxIDkwLjU2MjUgMTYxLjAxNTYgUTgzLjM5MDYgMTY4LjQ2ODggODMuMzkwNiAxODEuMjY1NiBRODMuMzkwNiAxOTMuOTIxOSA5MC41NjI1IDIwMS4yMzQ0IFE5Ny43MzQ0IDIwOC42ODc1IDExMC4xMDk0IDIwOC42ODc1IFExMjIuMzQzOCAyMDguNjg3NSAxMjkuNTE1NiAyMDEuMjM0NCBRMTM2LjY4NzUgMTkzLjkyMTkgMTM2LjY4NzUgMTgxLjI2NTYgUTEzNi42ODc1IDE2OC40Njg4IDEyOS41MTU2IDE2MS4wMTU2IFExMjIuMzQzOCAxNTMuNzAzMSAxMTAuMTA5NCAxNTMuNzAzMSBaTTE0Ni4zOTA2IDEwMy45MjE5IEwxNDYuMzkwNiAxMTguNDA2MiBRMTM5LjUgMTE1LjU5MzggMTMyLjQ2ODggMTE0LjE4NzUgUTEyNS40Mzc1IDExMi42NDA2IDExOC41NDY5IDExMi42NDA2IFExMDAuNTQ2OSAxMTIuNjQwNiA5MC45ODQ0IDEyMy4xODc1IFE4MS40MjE5IDEzMy44NzUgODAuMDE1NiAxNTUuMzkwNiBRODUuMzU5NCAxNDguNSA5My4zNzUgMTQ0Ljg0MzggUTEwMS41MzEyIDE0MS4xODc1IDExMS4wOTM4IDE0MS4xODc1IFExMzEuNDg0NCAxNDEuMTg3NSAxNDMuMjk2OSAxNTEuODc1IFExNTUuMTA5NCAxNjIuNzAzMSAxNTUuMTA5NCAxODEuMjY1NiBRMTU1LjEwOTQgMTk5LjEyNSAxNDIuNzM0NCAyMTAuMjM0NCBRMTMwLjUgMjIxLjIwMzEgMTEwLjEwOTQgMjIxLjIwMzEgUTg2LjYyNSAyMjEuMjAzMSA3NC4yNSAyMDUuNTkzOCBRNjEuODc1IDE4OS45ODQ0IDYxLjg3NSAxNjAuMTcxOSBRNjEuODc1IDEzMi4zMjgxIDc3LjA2MjUgMTE1Ljg3NSBROTIuMjUgOTkuMjgxMiAxMTcuODQzOCA5OS4yODEyIFExMjQuNzM0NCA5OS4yODEyIDEzMS43NjU2IDEwMC40MDYyIFExMzguNzk2OSAxMDEuNjcxOSAxNDYuMzkwNiAxMDMuOTIxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaY3XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjEuODc1IDEwMS42NzE5IEwxNDguNjQwNiAxMDEuNjcxOSBMMTQ4LjY0MDYgMTA4LjQyMTkgTDk5LjcwMzEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggTDEyNi43MDMxIDExNS4wMzEyIEw2MS44NzUgMTE1LjAzMTIgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaY4XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTA4LjI4MTIgMTYzLjEyNSBROTUuMjAzMSAxNjMuMTI1IDg3Ljc1IDE2OS4zMTI1IFE4MC4yOTY5IDE3NS4zNTk0IDgwLjI5NjkgMTg1LjkwNjIgUTgwLjI5NjkgMTk2LjU5MzggODcuNzUgMjAyLjY0MDYgUTk1LjIwMzEgMjA4LjY4NzUgMTA4LjI4MTIgMjA4LjY4NzUgUTEyMS4yMTg4IDIwOC42ODc1IDEyOC44MTI1IDIwMi41IFExMzYuMjY1NiAxOTYuNDUzMSAxMzYuMjY1NiAxODUuOTA2MiBRMTM2LjI2NTYgMTc1LjM1OTQgMTI4LjgxMjUgMTY5LjMxMjUgUTEyMS4zNTk0IDE2My4xMjUgMTA4LjI4MTIgMTYzLjEyNSBaTTkwIDE1Ni4yMzQ0IFE3OC4xODc1IDE1My43MDMxIDcxLjcxODggMTQ2LjgxMjUgUTY1LjEwOTQgMTM5Ljc4MTIgNjUuMTA5NCAxMjkuNjU2MiBRNjUuMTA5NCAxMTUuNTkzOCA3Ni42NDA2IDEwNy40Mzc1IFE4OC4xNzE5IDk5LjI4MTIgMTA4LjI4MTIgOTkuMjgxMiBRMTI4LjM5MDYgOTkuMjgxMiAxMzkuOTIxOSAxMDcuNDM3NSBRMTUxLjMxMjUgMTE1LjU5MzggMTUxLjMxMjUgMTI5LjY1NjIgUTE1MS4zMTI1IDE0MC4wNjI1IDE0NC44NDM4IDE0Ni44MTI1IFExMzguMjM0NCAxNTMuNzAzMSAxMjYuNTYyNSAxNTYuMjM0NCBRMTM5LjIxODggMTU4Ljc2NTYgMTQ3LjA5MzggMTY2LjkyMTkgUTE1NC41NDY5IDE3NC42NTYyIDE1NC41NDY5IDE4NS45MDYyIFExNTQuNTQ2OSAyMDIuOTIxOSAxNDIuNTkzOCAyMTIuMDYyNSBRMTMwLjUgMjIxLjIwMzEgMTA4LjI4MTIgMjIxLjIwMzEgUTg1LjkyMTkgMjIxLjIwMzEgNzMuOTY4OCAyMTIuMDYyNSBRNjEuODc1IDIwMi45MjE5IDYxLjg3NSAxODUuOTA2MiBRNjEuODc1IDE3NC45Mzc1IDY5LjMyODEgMTY2LjkyMTkgUTc2LjkyMTkgMTU5LjA0NjkgOTAgMTU2LjIzNDQgWk04My4yNSAxMzEuMjAzMSBRODMuMjUgMTQwLjA2MjUgODkuODU5NCAxNDUuNDA2MiBROTYuMzI4MSAxNTAuNjA5NCAxMDguMjgxMiAxNTAuNjA5NCBRMTE5LjY3MTkgMTUwLjYwOTQgMTI2LjU2MjUgMTQ1LjQwNjIgUTEzMy4zMTI1IDE0MC4zNDM4IDEzMy4zMTI1IDEzMS4yMDMxIFExMzMuMzEyNSAxMjIuMzQzOCAxMjYuNTYyNSAxMTcgUTExOS45NTMxIDExMS43OTY5IDEwOC4yODEyIDExMS43OTY5IFE5Ni42MDk0IDExMS43OTY5IDg5Ljg1OTQgMTE3IFE4My4yNSAxMjIuMDYyNSA4My4yNSAxMzEuMjAzMSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaY5XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNzAuNTkzOCAyMTYuNTYyNSBMNzAuNTkzOCAyMDIuMDc4MSBRNzcuNDg0NCAyMDQuODkwNiA4NC41MTU2IDIwNi40Mzc1IFE5MS41NDY5IDIwNy44NDM4IDk4LjI5NjkgMjA3Ljg0MzggUTExNi40Mzc1IDIwNy44NDM4IDEyNiAxOTcuMjk2OSBRMTM1LjQyMTkgMTg2Ljc1IDEzNi44MjgxIDE2NS4wOTM4IFExMzEuOTA2MiAxNzEuNzAzMSAxMjMuNDY4OCAxNzUuNSBRMTE1LjQ1MzEgMTc5LjE1NjIgMTA1Ljc1IDE3OS4xNTYyIFE4NS41IDE3OS4xNTYyIDczLjY4NzUgMTY4LjQ2ODggUTYxLjg3NSAxNTcuNzgxMiA2MS44NzUgMTM5LjIxODggUTYxLjg3NSAxMjEuMDc4MSA3NC4xMDk0IDExMC4yNSBRODYuNDg0NCA5OS4yODEyIDEwNi44NzUgOTkuMjgxMiBRMTMwLjM1OTQgOTkuMjgxMiAxNDIuNTkzOCAxMTQuODkwNiBRMTU0Ljk2ODggMTMwLjUgMTU0Ljk2ODggMTYwLjMxMjUgUTE1NC45Njg4IDE4OC4xNTYyIDEzOS45MjE5IDIwNC42MDk0IFExMjQuNzM0NCAyMjEuMjAzMSA5OS4xNDA2IDIyMS4yMDMxIFE5Mi4yNSAyMjEuMjAzMSA4NS4yMTg4IDIyMC4wNzgxIFE3OC4xODc1IDIxOC44MTI1IDcwLjU5MzggMjE2LjU2MjUgWk0xMDYuODc1IDE2Ni43ODEyIFExMTkuMjUgMTY2Ljc4MTIgMTI2LjQyMTkgMTU5LjQ2ODggUTEzMy41OTM4IDE1Mi4xNTYyIDEzMy41OTM4IDEzOS4yMTg4IFExMzMuNTkzOCAxMjYuNTYyNSAxMjYuNDIxOSAxMTkuMjUgUTExOS4yNSAxMTEuNzk2OSAxMDYuODc1IDExMS43OTY5IFE5NC45MjE5IDExMS43OTY5IDg3LjQ2ODggMTE5LjI1IFE4MC4xNTYyIDEyNi41NjI1IDgwLjE1NjIgMTM5LjIxODggUTgwLjE1NjIgMTUyLjE1NjIgODcuNDY4OCAxNTkuNDY4OCBROTQuNjQwNiAxNjYuNzgxMiAxMDYuODc1IDE2Ni43ODEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpjEwXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTU5LjA0NjkgMTExLjc5NjkgUTE0OS4wNjI1IDExMS43OTY5IDE0Mi4wMzEyIDEyMy44OTA2IFExMzQuODU5NCAxMzUuOTg0NCAxMzQuODU5NCAxNjAuMTcxOSBRMTM0Ljg1OTQgMTg0LjUgMTQyLjAzMTIgMTk2LjU5MzggUTE0OS4wNjI1IDIwOC42ODc1IDE1OS4wNDY5IDIwOC42ODc1IFExNjkuMDMxMiAyMDguNjg3NSAxNzYuMDYyNSAxOTYuNTkzOCBRMTgzLjIzNDQgMTg0LjUgMTgzLjIzNDQgMTYwLjE3MTkgUTE4My4yMzQ0IDEzNS45ODQ0IDE3Ni4wNjI1IDEyMy44OTA2IFExNjkuMDMxMiAxMTEuNzk2OSAxNTkuMDQ2OSAxMTEuNzk2OSBaTTE1OS4wNDY5IDk5LjI4MTIgUTE3Ny40Njg4IDk5LjI4MTIgMTg5LjQyMTkgMTE0Ljg5MDYgUTIwMS4zNzUgMTMwLjUgMjAxLjM3NSAxNjAuMTcxOSBRMjAxLjM3NSAxODkuOTg0NCAxODkuNDIxOSAyMDUuNTkzOCBRMTc3LjQ2ODggMjIxLjIwMzEgMTU5LjA0NjkgMjIxLjIwMzEgUTEzNi4yNjU2IDIyMS4yMDMxIDEyNi40MjE5IDIwNS41OTM4IFExMTYuNTc4MSAxODkuOTg0NCAxMTYuNTc4MSAxNjAuMTcxOSBRMTE2LjU3ODEgMTMwLjUgMTI2LjQyMTkgMTE0Ljg5MDYgUTEzNi4yNjU2IDk5LjI4MTIgMTU5LjA0NjkgOTkuMjgxMiBaTTgwLjU3ODEgMjE5LjA5MzggTDgwLjU3ODEgMTE3LjcwMzEgTDYxLjg3NSAxMjMuNDY4OCBMNjEuODc1IDEwNy4xNTYyIEw4MS41NjI1IDEwMS42NzE5IEwxMDAuODI4MSAxMDEuNjcxOSBMMTAwLjgyODEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmSlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTg5LjE1NjIgMTAxLjY3MTkgTDEwNy4wMTU2IDEwMS42NzE5IEwxMDcuMDE1NiAxNzguNzM0NCBRMTA3LjAxNTYgMTk5LjY4NzUgOTcuODc1IDIwOS41MzEyIFE4OC44NzUgMjE5LjIzNDQgNjguNzY1NiAyMTkuMjM0NCBMNjEuODc1IDIxOS4yMzQ0IEw2MS44NzUgMjA1LjczNDQgTDY3LjUgMjA1LjczNDQgUTc5LjMxMjUgMjA1LjczNDQgODQuMjM0NCAxOTkuODI4MSBRODkuMTU2MiAxOTMuOTIxOSA4OS4xNTYyIDE3OC43MzQ0IEw4OS4xNTYyIDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZplFcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNMTA3LjI5NjkgMjIxLjA2MjUgUTEwNi43MzQ0IDIyMS4wNjI1IDEwNS41MzkxIDIyMS4xMzI4IFExMDQuMzQzOCAyMjEuMjAzMSAxMDMuNjQwNiAyMjEuMjAzMSBRODEuNDIxOSAyMjEuMjAzMSA3MC41MjM0IDIwNi4wODU5IFE1OS42MjUgMTkwLjk2ODggNTkuNjI1IDE2MC4zMTI1IFE1OS42MjUgMTI5LjUxNTYgNzAuNTkzOCAxMTQuMzk4NCBRODEuNTYyNSA5OS4yODEyIDEwMy43ODEyIDk5LjI4MTIgUTEyNi4xNDA2IDk5LjI4MTIgMTM3LjEwOTQgMTE0LjM5ODQgUTE0OC4wNzgxIDEyOS41MTU2IDE0OC4wNzgxIDE2MC4zMTI1IFExNDguMDc4MSAxODMuNTE1NiAxNDIuMDMxMiAxOTcuNjQ4NCBRMTM1Ljk4NDQgMjExLjc4MTIgMTIzLjYwOTQgMjE3LjQwNjIgTDE0MS4zMjgxIDIzMi4zMTI1IEwxMjcuOTY4OCAyNDAuMTg3NSBMMTA3LjI5NjkgMjIxLjA2MjUgWk0xMjkuMzc1IDE2MC4zMTI1IFExMjkuMzc1IDEzNC40Mzc1IDEyMy4zOTg0IDEyMy4zMjgxIFExMTcuNDIxOSAxMTIuMjE4OCAxMDMuNzgxMiAxMTIuMjE4OCBROTAuMjgxMiAxMTIuMjE4OCA4NC4zMDQ3IDEyMy4zMjgxIFE3OC4zMjgxIDEzNC40Mzc1IDc4LjMyODEgMTYwLjMxMjUgUTc4LjMyODEgMTg2LjE4NzUgODQuMzA0NyAxOTcuMjk2OSBROTAuMjgxMiAyMDguNDA2MiAxMDMuNzgxMiAyMDguNDA2MiBRMTE3LjQyMTkgMjA4LjQwNjIgMTIzLjM5ODQgMTk3LjI5NjkgUTEyOS4zNzUgMTg2LjE4NzUgMTI5LjM3NSAxNjAuMzEyNSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpktcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02MS44NzUgMTAxLjY3MTkgTDc5LjczNDQgMTAxLjY3MTkgTDc5LjczNDQgMTUxLjMxMjUgTDEzMC42NDA2IDEwMS42NzE5IEwxNTMuNzAzMSAxMDEuNjcxOSBMOTYuNDY4OCAxNTYuNTE1NiBMMTU4LjM0MzggMjE5LjIzNDQgTDEzNC44NTk0IDIxOS4yMzQ0IEw3OS43MzQ0IDE2Mi41NjI1IEw3OS43MzQ0IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaNBXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuNjcxOSAxMTUuNzM0NCBMOTEuODI4MSAxNzUuNzgxMiBMMTI5LjUxNTYgMTc1Ljc4MTIgTDExMC42NzE5IDExNS43MzQ0IFpNOTkuOTg0NCAxMDEuNjcxOSBMMTIxLjY0MDYgMTAxLjY3MTkgTDE2Mi4xNDA2IDIxOS4yMzQ0IEwxNDMuNTc4MSAyMTkuMjM0NCBMMTM0LjAxNTYgMTg4LjU3ODEgTDg3LjYwOTQgMTg4LjU3ODEgTDc4LjA0NjkgMjE5LjIzNDQgTDU5LjQ4NDQgMjE5LjIzNDQgTDk5Ljk4NDQgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjMlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODYuMzQzOCAyMDMuMDYyNSBMMTQ1Ljk2ODggMjAzLjA2MjUgTDE0NS45Njg4IDIxOS4wOTM4IEw2MS44NzUgMjE5LjA5MzggTDYxLjg3NSAyMDMuNjI1IFE2Ni42NTYyIDE5OS4yNjU2IDc1LjUxNTYgMTkxLjM5MDYgUTEyMy44OTA2IDE0OC41IDEyMy44OTA2IDEzNS4yODEyIFExMjMuODkwNiAxMjYgMTE2LjU3ODEgMTIwLjMwNDcgUTEwOS4yNjU2IDExNC42MDk0IDk3LjMxMjUgMTE0LjYwOTQgUTkwIDExNC42MDk0IDgxLjQyMTkgMTE3LjA3MDMgUTcyLjg0MzggMTE5LjUzMTIgNjIuNzE4OCAxMjQuNDUzMSBMNjIuNzE4OCAxMDcuMTU2MiBRNzMuNTQ2OSAxMDMuMjE4OCA4Mi44OTg0IDEwMS4yNSBROTIuMjUgOTkuMjgxMiAxMDAuMjY1NiA5OS4yODEyIFExMjAuNjU2MiA5OS4yODEyIDEzMi44OTA2IDEwOC41NjI1IFExNDUuMTI1IDExNy44NDM4IDE0NS4xMjUgMTMzLjAzMTIgUTE0NS4xMjUgMTUyLjU3ODEgOTguNTc4MSAxOTIuNTE1NiBROTAuNzAzMSAxOTkuMjY1NiA4Ni4zNDM4IDIwMy4wNjI1IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZozNcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEyMS43ODEyIDE1NS41MzEyIFExMzQuNzE4OCAxNTguMDYyNSAxNDEuODIwMyAxNjUuNzI2NiBRMTQ4LjkyMTkgMTczLjM5MDYgMTQ4LjkyMTkgMTg0LjkyMTkgUTE0OC45MjE5IDIwMi4zNTk0IDEzNS41NjI1IDIxMS43ODEyIFExMjIuMjAzMSAyMjEuMjAzMSA5Ny4zMTI1IDIyMS4yMDMxIFE4OS4yOTY5IDIyMS4yMDMxIDgwLjUwNzggMjE5LjcyNjYgUTcxLjcxODggMjE4LjI1IDYxLjg3NSAyMTUuNDM3NSBMNjEuODc1IDE5OC40MjE5IFE2OS4xODc1IDIwMi4yMTg4IDc3LjU1NDcgMjA0LjA0NjkgUTg1LjkyMTkgMjA1Ljg3NSA5NS4zNDM4IDIwNS44NzUgUTExMC42NzE5IDIwNS44NzUgMTE5LjEwOTQgMjAwLjMyMDMgUTEyNy41NDY5IDE5NC43NjU2IDEyNy41NDY5IDE4NC45MjE5IFExMjcuNTQ2OSAxNzQuNTE1NiAxMTkuNzQyMiAxNjkuMTcxOSBRMTExLjkzNzUgMTYzLjgyODEgOTYuNzUgMTYzLjgyODEgTDg0LjY1NjIgMTYzLjgyODEgTDg0LjY1NjIgMTQ4LjY0MDYgTDk3Ljg3NSAxNDguNjQwNiBRMTExLjA5MzggMTQ4LjY0MDYgMTE3LjkxNDEgMTQ0LjIxMDkgUTEyNC43MzQ0IDEzOS43ODEyIDEyNC43MzQ0IDEzMS4zNDM4IFExMjQuNzM0NCAxMjMuMTg3NSAxMTcuNzAzMSAxMTguODk4NCBRMTEwLjY3MTkgMTE0LjYwOTQgOTcuMzEyNSAxMTQuNjA5NCBROTEuNjg3NSAxMTQuNjA5NCA4NC41MTU2IDExNS44NzUgUTc3LjM0MzggMTE3LjE0MDYgNjUuOTUzMSAxMjAuMzc1IEw2NS45NTMxIDEwNC4yMDMxIFE3Ni4yMTg4IDEwMS44MTI1IDg1LjIxODggMTAwLjU0NjkgUTk0LjIxODggOTkuMjgxMiAxMDEuOTUzMSA5OS4yODEyIFExMjIuMjAzMSA5OS4yODEyIDEzNC4wODU5IDEwNy41NzgxIFExNDUuOTY4OCAxMTUuODc1IDE0NS45Njg4IDEyOS43OTY5IFExNDUuOTY4OCAxMzkuNSAxMzkuNjQwNiAxNDYuMjUgUTEzMy4zMTI1IDE1MyAxMjEuNzgxMiAxNTUuNTMxMiBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaM0XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMjAuMDkzOCAxMTguNjg3NSBMNzYuNjQwNiAxNzcuNjA5NCBMMTIwLjA5MzggMTc3LjYwOTQgTDEyMC4wOTM4IDExOC42ODc1IFpNMTE3IDEwMS42NzE5IEwxNDAuMzQzOCAxMDEuNjcxOSBMMTQwLjM0MzggMTc3LjYwOTQgTDE1OS4zMjgxIDE3Ny42MDk0IEwxNTkuMzI4MSAxOTIuOTM3NSBMMTQwLjM0MzggMTkyLjkzNzUgTDE0MC4zNDM4IDIxOS4wOTM4IEwxMjAuMDkzOCAyMTkuMDkzOCBMMTIwLjA5MzggMTkyLjkzNzUgTDYxLjg3NSAxOTIuOTM3NSBMNjEuODc1IDE3NS45MjE5IEwxMTcgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjNVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjcuNSAxMDEuNjcxOSBMMTM5LjIxODggMTAxLjY3MTkgTDEzOS4yMTg4IDExNS4wMzEyIEw4NC4yMzQ0IDExNS4wMzEyIEw4NC4yMzQ0IDE0My43MTg4IFE4OC4xNzE5IDE0Mi40NTMxIDkyLjI1IDE0MS44OTA2IFE5Ni4xODc1IDE0MS4zMjgxIDEwMC4xMjUgMTQxLjMyODEgUTEyMi43NjU2IDE0MS4zMjgxIDEzNS45ODQ0IDE1Mi4xNTYyIFExNDkuMjAzMSAxNjIuODQzOCAxNDkuMjAzMSAxODEuMjY1NiBRMTQ5LjIwMzEgMjAwLjI1IDEzNS41NjI1IDIxMC43OTY5IFExMjIuMDYyNSAyMjEuMjAzMSA5Ny4zMTI1IDIyMS4yMDMxIFE4OC44NzUgMjIxLjIwMzEgODAuMDE1NiAyMTkuOTM3NSBRNzEuMTU2MiAyMTguNjcxOSA2MS44NzUgMjE2LjE0MDYgTDYxLjg3NSAyMDAuMjUgUTY5Ljg5MDYgMjA0LjA0NjkgNzguNjA5NCAyMDYuMDE1NiBRODcuMzI4MSAyMDcuODQzOCA5Ny4wMzEyIDIwNy44NDM4IFExMTIuNjQwNiAyMDcuODQzOCAxMjEuNzgxMiAyMDAuNjcxOSBRMTMwLjkyMTkgMTkzLjUgMTMwLjkyMTkgMTgxLjI2NTYgUTEzMC45MjE5IDE2OS4wMzEyIDEyMS43ODEyIDE2MS44NTk0IFExMTIuNjQwNiAxNTQuNjg3NSA5Ny4wMzEyIDE1NC42ODc1IFE4OS43MTg4IDE1NC42ODc1IDgyLjQwNjIgMTU2LjA5MzggUTc1LjA5MzggMTU3LjUgNjcuNSAxNjAuNDUzMSBMNjcuNSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaM2XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuMTA5NCAxNTMuNzAzMSBROTcuNzM0NCAxNTMuNzAzMSA5MC41NjI1IDE2MS4wMTU2IFE4My4zOTA2IDE2OC40Njg4IDgzLjM5MDYgMTgxLjI2NTYgUTgzLjM5MDYgMTkzLjkyMTkgOTAuNTYyNSAyMDEuMjM0NCBROTcuNzM0NCAyMDguNjg3NSAxMTAuMTA5NCAyMDguNjg3NSBRMTIyLjM0MzggMjA4LjY4NzUgMTI5LjUxNTYgMjAxLjIzNDQgUTEzNi42ODc1IDE5My45MjE5IDEzNi42ODc1IDE4MS4yNjU2IFExMzYuNjg3NSAxNjguNDY4OCAxMjkuNTE1NiAxNjEuMDE1NiBRMTIyLjM0MzggMTUzLjcwMzEgMTEwLjEwOTQgMTUzLjcwMzEgWk0xNDYuMzkwNiAxMDMuOTIxOSBMMTQ2LjM5MDYgMTE4LjQwNjIgUTEzOS41IDExNS41OTM4IDEzMi40Njg4IDExNC4xODc1IFExMjUuNDM3NSAxMTIuNjQwNiAxMTguNTQ2OSAxMTIuNjQwNiBRMTAwLjU0NjkgMTEyLjY0MDYgOTAuOTg0NCAxMjMuMTg3NSBRODEuNDIxOSAxMzMuODc1IDgwLjAxNTYgMTU1LjM5MDYgUTg1LjM1OTQgMTQ4LjUgOTMuMzc1IDE0NC44NDM4IFExMDEuNTMxMiAxNDEuMTg3NSAxMTEuMDkzOCAxNDEuMTg3NSBRMTMxLjQ4NDQgMTQxLjE4NzUgMTQzLjI5NjkgMTUxLjg3NSBRMTU1LjEwOTQgMTYyLjcwMzEgMTU1LjEwOTQgMTgxLjI2NTYgUTE1NS4xMDk0IDE5OS4xMjUgMTQyLjczNDQgMjEwLjIzNDQgUTEzMC41IDIyMS4yMDMxIDExMC4xMDk0IDIyMS4yMDMxIFE4Ni42MjUgMjIxLjIwMzEgNzQuMjUgMjA1LjU5MzggUTYxLjg3NSAxODkuOTg0NCA2MS44NzUgMTYwLjE3MTkgUTYxLjg3NSAxMzIuMzI4MSA3Ny4wNjI1IDExNS44NzUgUTkyLjI1IDk5LjI4MTIgMTE3Ljg0MzggOTkuMjgxMiBRMTI0LjczNDQgOTkuMjgxMiAxMzEuNzY1NiAxMDAuNDA2MiBRMTM4Ljc5NjkgMTAxLjY3MTkgMTQ2LjM5MDYgMTAzLjkyMTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjN1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjEuODc1IDEwMS42NzE5IEwxNDguNjQwNiAxMDEuNjcxOSBMMTQ4LjY0MDYgMTA4LjQyMTkgTDk5LjcwMzEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggTDEyNi43MDMxIDExNS4wMzEyIEw2MS44NzUgMTE1LjAzMTIgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaM4XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMDguMjgxMiAxNjMuMTI1IFE5NS4yMDMxIDE2My4xMjUgODcuNzUgMTY5LjMxMjUgUTgwLjI5NjkgMTc1LjM1OTQgODAuMjk2OSAxODUuOTA2MiBRODAuMjk2OSAxOTYuNTkzOCA4Ny43NSAyMDIuNjQwNiBROTUuMjAzMSAyMDguNjg3NSAxMDguMjgxMiAyMDguNjg3NSBRMTIxLjIxODggMjA4LjY4NzUgMTI4LjgxMjUgMjAyLjUgUTEzNi4yNjU2IDE5Ni40NTMxIDEzNi4yNjU2IDE4NS45MDYyIFExMzYuMjY1NiAxNzUuMzU5NCAxMjguODEyNSAxNjkuMzEyNSBRMTIxLjM1OTQgMTYzLjEyNSAxMDguMjgxMiAxNjMuMTI1IFpNOTAgMTU2LjIzNDQgUTc4LjE4NzUgMTUzLjcwMzEgNzEuNzE4OCAxNDYuODEyNSBRNjUuMTA5NCAxMzkuNzgxMiA2NS4xMDk0IDEyOS42NTYyIFE2NS4xMDk0IDExNS41OTM4IDc2LjY0MDYgMTA3LjQzNzUgUTg4LjE3MTkgOTkuMjgxMiAxMDguMjgxMiA5OS4yODEyIFExMjguMzkwNiA5OS4yODEyIDEzOS45MjE5IDEwNy40Mzc1IFExNTEuMzEyNSAxMTUuNTkzOCAxNTEuMzEyNSAxMjkuNjU2MiBRMTUxLjMxMjUgMTQwLjA2MjUgMTQ0Ljg0MzggMTQ2LjgxMjUgUTEzOC4yMzQ0IDE1My43MDMxIDEyNi41NjI1IDE1Ni4yMzQ0IFExMzkuMjE4OCAxNTguNzY1NiAxNDcuMDkzOCAxNjYuOTIxOSBRMTU0LjU0NjkgMTc0LjY1NjIgMTU0LjU0NjkgMTg1LjkwNjIgUTE1NC41NDY5IDIwMi45MjE5IDE0Mi41OTM4IDIxMi4wNjI1IFExMzAuNSAyMjEuMjAzMSAxMDguMjgxMiAyMjEuMjAzMSBRODUuOTIxOSAyMjEuMjAzMSA3My45Njg4IDIxMi4wNjI1IFE2MS44NzUgMjAyLjkyMTkgNjEuODc1IDE4NS45MDYyIFE2MS44NzUgMTc0LjkzNzUgNjkuMzI4MSAxNjYuOTIxOSBRNzYuOTIxOSAxNTkuMDQ2OSA5MCAxNTYuMjM0NCBaTTgzLjI1IDEzMS4yMDMxIFE4My4yNSAxNDAuMDYyNSA4OS44NTk0IDE0NS40MDYyIFE5Ni4zMjgxIDE1MC42MDk0IDEwOC4yODEyIDE1MC42MDk0IFExMTkuNjcxOSAxNTAuNjA5NCAxMjYuNTYyNSAxNDUuNDA2MiBRMTMzLjMxMjUgMTQwLjM0MzggMTMzLjMxMjUgMTMxLjIwMzEgUTEzMy4zMTI1IDEyMi4zNDM4IDEyNi41NjI1IDExNyBRMTE5Ljk1MzEgMTExLjc5NjkgMTA4LjI4MTIgMTExLjc5NjkgUTk2LjYwOTQgMTExLjc5NjkgODkuODU5NCAxMTcgUTgzLjI1IDEyMi4wNjI1IDgzLjI1IDEzMS4yMDMxIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZozlcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTcwLjU5MzggMjE2LjU2MjUgTDcwLjU5MzggMjAyLjA3ODEgUTc3LjQ4NDQgMjA0Ljg5MDYgODQuNTE1NiAyMDYuNDM3NSBROTEuNTQ2OSAyMDcuODQzOCA5OC4yOTY5IDIwNy44NDM4IFExMTYuNDM3NSAyMDcuODQzOCAxMjYgMTk3LjI5NjkgUTEzNS40MjE5IDE4Ni43NSAxMzYuODI4MSAxNjUuMDkzOCBRMTMxLjkwNjIgMTcxLjcwMzEgMTIzLjQ2ODggMTc1LjUgUTExNS40NTMxIDE3OS4xNTYyIDEwNS43NSAxNzkuMTU2MiBRODUuNSAxNzkuMTU2MiA3My42ODc1IDE2OC40Njg4IFE2MS44NzUgMTU3Ljc4MTIgNjEuODc1IDEzOS4yMTg4IFE2MS44NzUgMTIxLjA3ODEgNzQuMTA5NCAxMTAuMjUgUTg2LjQ4NDQgOTkuMjgxMiAxMDYuODc1IDk5LjI4MTIgUTEzMC4zNTk0IDk5LjI4MTIgMTQyLjU5MzggMTE0Ljg5MDYgUTE1NC45Njg4IDEzMC41IDE1NC45Njg4IDE2MC4zMTI1IFExNTQuOTY4OCAxODguMTU2MiAxMzkuOTIxOSAyMDQuNjA5NCBRMTI0LjczNDQgMjIxLjIwMzEgOTkuMTQwNiAyMjEuMjAzMSBROTIuMjUgMjIxLjIwMzEgODUuMjE4OCAyMjAuMDc4MSBRNzguMTg3NSAyMTguODEyNSA3MC41OTM4IDIxNi41NjI1IFpNMTA2Ljg3NSAxNjYuNzgxMiBRMTE5LjI1IDE2Ni43ODEyIDEyNi40MjE5IDE1OS40Njg4IFExMzMuNTkzOCAxNTIuMTU2MiAxMzMuNTkzOCAxMzkuMjE4OCBRMTMzLjU5MzggMTI2LjU2MjUgMTI2LjQyMTkgMTE5LjI1IFExMTkuMjUgMTExLjc5NjkgMTA2Ljg3NSAxMTEuNzk2OSBROTQuOTIxOSAxMTEuNzk2OSA4Ny40Njg4IDExOS4yNSBRODAuMTU2MiAxMjYuNTYyNSA4MC4xNTYyIDEzOS4yMTg4IFE4MC4xNTYyIDE1Mi4xNTYyIDg3LjQ2ODggMTU5LjQ2ODggUTk0LjY0MDYgMTY2Ljc4MTIgMTA2Ljg3NSAxNjYuNzgxMiBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaMxMFxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTU5LjA0NjkgMTExLjc5NjkgUTE0OS4wNjI1IDExMS43OTY5IDE0Mi4wMzEyIDEyMy44OTA2IFExMzQuODU5NCAxMzUuOTg0NCAxMzQuODU5NCAxNjAuMTcxOSBRMTM0Ljg1OTQgMTg0LjUgMTQyLjAzMTIgMTk2LjU5MzggUTE0OS4wNjI1IDIwOC42ODc1IDE1OS4wNDY5IDIwOC42ODc1IFExNjkuMDMxMiAyMDguNjg3NSAxNzYuMDYyNSAxOTYuNTkzOCBRMTgzLjIzNDQgMTg0LjUgMTgzLjIzNDQgMTYwLjE3MTkgUTE4My4yMzQ0IDEzNS45ODQ0IDE3Ni4wNjI1IDEyMy44OTA2IFExNjkuMDMxMiAxMTEuNzk2OSAxNTkuMDQ2OSAxMTEuNzk2OSBaTTE1OS4wNDY5IDk5LjI4MTIgUTE3Ny40Njg4IDk5LjI4MTIgMTg5LjQyMTkgMTE0Ljg5MDYgUTIwMS4zNzUgMTMwLjUgMjAxLjM3NSAxNjAuMTcxOSBRMjAxLjM3NSAxODkuOTg0NCAxODkuNDIxOSAyMDUuNTkzOCBRMTc3LjQ2ODggMjIxLjIwMzEgMTU5LjA0NjkgMjIxLjIwMzEgUTEzNi4yNjU2IDIyMS4yMDMxIDEyNi40MjE5IDIwNS41OTM4IFExMTYuNTc4MSAxODkuOTg0NCAxMTYuNTc4MSAxNjAuMTcxOSBRMTE2LjU3ODEgMTMwLjUgMTI2LjQyMTkgMTE0Ljg5MDYgUTEzNi4yNjU2IDk5LjI4MTIgMTU5LjA0NjkgOTkuMjgxMiBaTTgwLjU3ODEgMjE5LjA5MzggTDgwLjU3ODEgMTE3LjcwMzEgTDYxLjg3NSAxMjMuNDY4OCBMNjEuODc1IDEwNy4xNTYyIEw4MS41NjI1IDEwMS42NzE5IEwxMDAuODI4MSAxMDEuNjcxOSBMMTAwLjgyODEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjSlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODkuMTU2MiAxMDEuNjcxOSBMMTA3LjAxNTYgMTAxLjY3MTkgTDEwNy4wMTU2IDE3OC43MzQ0IFExMDcuMDE1NiAxOTkuNjg3NSA5Ny44NzUgMjA5LjUzMTIgUTg4Ljg3NSAyMTkuMjM0NCA2OC43NjU2IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAyMDUuNzM0NCBMNjcuNSAyMDUuNzM0NCBRNzkuMzEyNSAyMDUuNzM0NCA4NC4yMzQ0IDE5OS44MjgxIFE4OS4xNTYyIDE5My45MjE5IDg5LjE1NjIgMTc4LjczNDQgTDg5LjE1NjIgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjUVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTA3LjI5NjkgMjIxLjA2MjUgUTEwNi43MzQ0IDIyMS4wNjI1IDEwNS41MzkxIDIyMS4xMzI4IFExMDQuMzQzOCAyMjEuMjAzMSAxMDMuNjQwNiAyMjEuMjAzMSBRODEuNDIxOSAyMjEuMjAzMSA3MC41MjM0IDIwNi4wODU5IFE1OS42MjUgMTkwLjk2ODggNTkuNjI1IDE2MC4zMTI1IFE1OS42MjUgMTI5LjUxNTYgNzAuNTkzOCAxMTQuMzk4NCBRODEuNTYyNSA5OS4yODEyIDEwMy43ODEyIDk5LjI4MTIgUTEyNi4xNDA2IDk5LjI4MTIgMTM3LjEwOTQgMTE0LjM5ODQgUTE0OC4wNzgxIDEyOS41MTU2IDE0OC4wNzgxIDE2MC4zMTI1IFExNDguMDc4MSAxODMuNTE1NiAxNDIuMDMxMiAxOTcuNjQ4NCBRMTM1Ljk4NDQgMjExLjc4MTIgMTIzLjYwOTQgMjE3LjQwNjIgTDE0MS4zMjgxIDIzMi4zMTI1IEwxMjcuOTY4OCAyNDAuMTg3NSBMMTA3LjI5NjkgMjIxLjA2MjUgWk0xMjkuMzc1IDE2MC4zMTI1IFExMjkuMzc1IDEzNC40Mzc1IDEyMy4zOTg0IDEyMy4zMjgxIFExMTcuNDIxOSAxMTIuMjE4OCAxMDMuNzgxMiAxMTIuMjE4OCBROTAuMjgxMiAxMTIuMjE4OCA4NC4zMDQ3IDEyMy4zMjgxIFE3OC4zMjgxIDEzNC40Mzc1IDc4LjMyODEgMTYwLjMxMjUgUTc4LjMyODEgMTg2LjE4NzUgODQuMzA0NyAxOTcuMjk2OSBROTAuMjgxMiAyMDguNDA2MiAxMDMuNzgxMiAyMDguNDA2MiBRMTE3LjQyMTkgMjA4LjQwNjIgMTIzLjM5ODQgMTk3LjI5NjkgUTEyOS4zNzUgMTg2LjE4NzUgMTI5LjM3NSAxNjAuMzEyNSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaNLXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02MS44NzUgMTAxLjY3MTkgTDc5LjczNDQgMTAxLjY3MTkgTDc5LjczNDQgMTUxLjMxMjUgTDEzMC42NDA2IDEwMS42NzE5IEwxNTMuNzAzMSAxMDEuNjcxOSBMOTYuNDY4OCAxNTYuNTE1NiBMMTU4LjM0MzggMjE5LjIzNDQgTDEzNC44NTk0IDIxOS4yMzQ0IEw3OS43MzQ0IDE2Mi41NjI1IEw3OS43MzQ0IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG5cXG4gICAgPHRhYmxlIHN0eWxlPVxcXCJib3JkZXItd2lkdGg6MXB4XFxcIj5cXG4gICAgICAgIDx0ciB3aWR0aD1cXFwiMTAwJVxcXCIgaGVpZ2h0PVxcXCIxMHB4XFxcIiBzdHlsZT1cXFwidmlzaWJpbGl0eTp2aXNpYmxlXFxcIn0+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibHVlXFxcIj4mYmxvY2s7PC9zcGFuPjwvcGxheWluZy1jYXJkPC90ZD5cXG4gICAgICAgIDwvdHI+XFxuICAgICAgICA8dHIgd2lkdGg9XFxcIjEwMCVcXFwiPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7QTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7Mjwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7Mzwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7NDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7NTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7Njwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7Nzwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7ODwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7OTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7MTA8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQgd2lkdGg9XFxcIjUwcHhcXFwiPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzO0o8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQgd2lkdGg9XFxcIjUwcHhcXFwiPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzO1E8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQgd2lkdGg9XFxcIjUwcHhcXFwiPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzO0s8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgIDwvdHI+XFxuICAgICAgICA8dHI+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0cztBPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czsyPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czszPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs0PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs1PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs2PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs3PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs4PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs5PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czsxMDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZoZWFydHM7Sjwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZoZWFydHM7UTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZoZWFydHM7Szwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgPC90cj5cXG4gICAgICAgIDx0cj5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7QTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczsyPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zOzM8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7NDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczs1PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zOzY8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7Nzwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczs4PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zOzk8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7MTA8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7Sjwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtcztRPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zO0s8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgIDwvdHI+XFxuICAgICAgICA8dHI+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7QTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzI8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczszPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7NDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzU8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczs2PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7Nzwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzg8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczs5PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7MTA8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHVicztKPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7UTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzO0s8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgIDwvdHI+XFxuICAgIDwvdGFibGU+XFxuPC9kaXY+XFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmF3LWxvYWRlciEuL3ZpZXdzL3BhcnRpYWxzL2ZyZXNoZGVjay5odG1sXG4vLyBtb2R1bGUgaWQgPSAyNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+aW5kZXg8L3A+XFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmF3LWxvYWRlciEuL3ZpZXdzL3BhcnRpYWxzL2luZGV4Lmh0bWxcbi8vIG1vZHVsZSBpZCA9IDI1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8Zm9ybVxcbiAgICBpZD1cXFwibWVzc2FnZV9mb3JtXFxcIlxcbiAgICBvbnN1Ym1pdD1cXFwiXFxuICAgICB2YXIgZ3VuID0gR3VuKGxvY2F0aW9uLm9yaWdpbiArICcvZ3VuJyk7XFxuICAgICBvcGVucGdwLmNvbmZpZy5hZWFkX3Byb3RlY3QgPSB0cnVlXFxuICAgICBvcGVucGdwLmluaXRXb3JrZXIoeyBwYXRoOicvanMvb3BlbnBncC53b3JrZXIuanMnIH0pXFxuICAgICBpZiAoIW1lc3NhZ2VfdHh0LnZhbHVlKSB7XFxuICAgICAgICAgIHJldHVybiBmYWxzZVxcbiAgICAgfVxcbiAgICAgd2luZG93LmhhbmRsZVBvc3QobWVzc2FnZV90eHQudmFsdWUpKG9wZW5wZ3ApKHdpbmRvdy5sb2NhbFN0b3JhZ2UpKCdyb3lhbGUnKS50aGVuKHJlc3VsdCA9PiB7aWYgKHJlc3VsdCkge2NvbnNvbGUubG9nKHJlc3VsdCl9fSkuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoZXJyKSk7ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lc3NhZ2VfdHh0JykudmFsdWUgPSAnJzsgcmV0dXJuIGZhbHNlXFxcIlxcbiAgICBtZXRob2Q9XFxcInBvc3RcXFwiXFxuICAgIGFjdGlvbj1cXFwiL21lc3NhZ2VcXFwiPlxcbiAgICA8aW5wdXQgaWQ9XFxcIm1lc3NhZ2VfZm9ybV9pbnB1dFxcXCJcXG4gICAgICAgIHR5cGU9XFxcInN1Ym1pdFxcXCJcXG4gICAgICAgIHZhbHVlPVxcXCJwb3N0IG1lc3NhZ2VcXFwiXFxuICAgICAgICBmb3JtPVxcXCJtZXNzYWdlX2Zvcm1cXFwiXFxuICAgICAgICA+XFxuPC9mb3JtPlxcbjx0ZXh0YXJlYVxcbiAgICBpZD1cXFwibWVzc2FnZV90eHRcXFwiXFxuICAgIG5hbWU9XFxcIm1lc3NhZ2VfdHh0XFxcIlxcbiAgICBmb3JtPVxcXCJtZXNzYWdlX2Zvcm1cXFwiXFxuICAgIHJvd3M9NTFcXG4gICAgY29scz03MFxcbiAgICBwbGFjZWhvbGRlcj1cXFwicGFzdGUgcGxhaW50ZXh0IG1lc3NhZ2UsIHB1YmxpYyBrZXksIG9yIHByaXZhdGUga2V5XFxcIlxcbiAgICBzdHlsZT1cXFwiZm9udC1mYW1pbHk6TWVubG8sQ29uc29sYXMsTW9uYWNvLEx1Y2lkYSBDb25zb2xlLExpYmVyYXRpb24gTW9ubyxEZWphVnUgU2FucyBNb25vLEJpdHN0cmVhbSBWZXJhIFNhbnMgTW9ubyxDb3VyaWVyIE5ldywgbW9ub3NwYWNlO1xcXCJcXG4gICAgPlxcbjwvdGV4dGFyZWE+XFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmF3LWxvYWRlciEuL3ZpZXdzL3BhcnRpYWxzL21lc3NhZ2VfZm9ybS5odG1sXG4vLyBtb2R1bGUgaWQgPSAyNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPHNwYW4gY2xhc3M9XFxcInJvYWRtYXBcXFwiPlxcbiAgICA8ZGV0YWlscz5cXG4gICAgPHN1bW1hcnk+cm9hZCBtYXA8L3N1bW1hcnk+XFxuICAgIDx1bD5cXG4gICAgICAgIDxsaT48ZGVsPjxhIGhyZWY9XFxcImh0dHBzOi8vZ2l0aHViLmNvbS9jb2xlYWxib24vaG90bGlwcy9jb21taXQvM2I3MDk4MWNiZTRlMTFlMTQwMGFlOGU5NDhhMDZlMzU4MmQ5YzJkMlxcXCI+SW5zdGFsbCBub2RlL2tvYS93ZWJwYWNrPC9hPjwvZGVsPjwvbGk+XFxuICAgICAgICA8bGk+PGRlbD48YSBocmVmPVxcXCJodHRwczovL2dpdGh1Yi5jb20vY29sZWFsYm9uL2hvdGxpcHMvaXNzdWVzLzJcXFwiPkluc3RhbGwgZ3VuZGI8L2E+PC9kZWw+PC9saT5cXG4gICAgICAgIDxsaT48ZGVsPm1ha2UgYSA8YSBocmVmPVxcXCIjL2RlY2tcXFwiPmRlY2s8L2E+IG9mIGNhcmRzPC9kZWw+PC9saT5cXG4gICAgICAgIDxsaT48ZGVsPkFsaWNlIGFuZCBCb2IgPGEgaHJlZj1cXFwiIy9tZXNzYWdlXFxcIj5pZGVudGlmeTwvYT48L2RlbD48L2xpPlxcbiAgICAgICAgPGxpPjxkZWw+QWxpY2UgYW5kIEJvYiA8YSBocmVmPVxcXCIjL2Nvbm5lY3RcXFwiPmNvbm5lY3Q8L2E+PC9kZWw+PC9saT5cXG4gICAgICAgIDxsaT48ZGVsPkFsaWNlIGFuZCBCb2IgPGEgaHJlZj1cXFwiaHR0cHM6Ly9naXRodWIuY29tL2NvbGVhbGJvbi9zdHJlYW1saW5lclxcXCI+ZXhjaGFuZ2Uga2V5czwvYT48L2RlbD88L2xpPlxcbiAgICAgICAgPGxpPkFsaWNlIGFuZCBCb2IgYWdyZWUgb24gYSBjZXJ0YWluIFxcXCI8YSBocmVmPVxcXCIjL2RlY2tcXFwiPmRlY2s8L2E+XFxcIiBvZiBjYXJkcy4gSW4gcHJhY3RpY2UsIHRoaXMgbWVhbnMgdGhleSBhZ3JlZSBvbiBhIHNldCBvZiBudW1iZXJzIG9yIG90aGVyIGRhdGEgc3VjaCB0aGF0IGVhY2ggZWxlbWVudCBvZiB0aGUgc2V0IHJlcHJlc2VudHMgYSBjYXJkLjwvbGk+XFxuICAgICAgICA8bGk+QWxpY2UgcGlja3MgYW4gZW5jcnlwdGlvbiBrZXkgQSBhbmQgdXNlcyB0aGlzIHRvIGVuY3J5cHQgZWFjaCBjYXJkIG9mIHRoZSBkZWNrLjwvbGk+XFxuICAgICAgICA8bGk+QWxpY2UgPGEgaHJlZj1cXFwiaHR0cHM6Ly9ib3N0Lm9ja3Mub3JnL21pa2Uvc2h1ZmZsZS9cXFwiPnNodWZmbGVzPC9hPiB0aGUgY2FyZHMuPC9saT5cXG4gICAgICAgIDxsaT5BbGljZSBwYXNzZXMgdGhlIGVuY3J5cHRlZCBhbmQgc2h1ZmZsZWQgZGVjayB0byBCb2IuIFdpdGggdGhlIGVuY3J5cHRpb24gaW4gcGxhY2UsIEJvYiBjYW5ub3Qga25vdyB3aGljaCBjYXJkIGlzIHdoaWNoLjwvbGk+XFxuICAgICAgICA8bGk+Qm9iIHNodWZmbGVzIHRoZSBkZWNrLjwvbGk+XFxuICAgICAgICA8bGk+Qm9iIHBhc3NlcyB0aGUgZG91YmxlIGVuY3J5cHRlZCBhbmQgc2h1ZmZsZWQgZGVjayBiYWNrIHRvIEFsaWNlLjwvbGk+XFxuICAgICAgICA8bGk+QWxpY2UgZGVjcnlwdHMgZWFjaCBjYXJkIHVzaW5nIGhlciBrZXkgQS4gVGhpcyBzdGlsbCBsZWF2ZXMgQm9iJ3MgZW5jcnlwdGlvbiBpbiBwbGFjZSB0aG91Z2ggc28gc2hlIGNhbm5vdCBrbm93IHdoaWNoIGNhcmQgaXMgd2hpY2guPC9saT5cXG4gICAgICAgIDxsaT5BbGljZSBwaWNrcyBvbmUgZW5jcnlwdGlvbiBrZXkgZm9yIGVhY2ggY2FyZCAoQTEsIEEyLCBldGMuKSBhbmQgZW5jcnlwdHMgdGhlbSBpbmRpdmlkdWFsbHkuPC9saT5cXG4gICAgICAgIDxsaT5BbGljZSBwYXNzZXMgdGhlIGRlY2sgdG8gQm9iLjwvbGk+XFxuICAgICAgICA8bGk+Qm9iIGRlY3J5cHRzIGVhY2ggY2FyZCB1c2luZyBoaXMga2V5IEIuIFRoaXMgc3RpbGwgbGVhdmVzIEFsaWNlJ3MgaW5kaXZpZHVhbCBlbmNyeXB0aW9uIGluIHBsYWNlIHRob3VnaCBzbyBoZSBjYW5ub3Qga25vdyB3aGljaCBjYXJkIGlzIHdoaWNoLjwvbGk+XFxuICAgICAgICA8bGk+Qm9iIHBpY2tzIG9uZSBlbmNyeXB0aW9uIGtleSBmb3IgZWFjaCBjYXJkIChCMSwgQjIsIGV0Yy4pIGFuZCBlbmNyeXB0cyB0aGVtIGluZGl2aWR1YWxseS48L2xpPlxcbiAgICAgICAgPGxpPkJvYiBwYXNzZXMgdGhlIGRlY2sgYmFjayB0byBBbGljZS48L2xpPlxcbiAgICAgICAgPGxpPkFsaWNlIHB1Ymxpc2hlcyB0aGUgZGVjayBmb3IgZXZlcnlvbmUgcGxheWluZyAoaW4gdGhpcyBjYXNlIG9ubHkgQWxpY2UgYW5kIEJvYiwgc2VlIGJlbG93IG9uIGV4cGFuc2lvbiB0aG91Z2gpLjwvbGk+XFxuICAgIDwvdWw+XFxuPC9kZXRhaWxzPlxcbjwvc3Bhbj5cXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yYXctbG9hZGVyIS4vdmlld3MvcGFydGlhbHMvcm9hZG1hcC5odG1sXG4vLyBtb2R1bGUgaWQgPSAyN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9