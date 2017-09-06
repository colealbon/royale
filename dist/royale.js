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
                    (0, _getFromStorage.getFromStorage)(localStorage)().then(function (storeArr) {
                        try {
                            return storeArr.filter(function (storageItem) {
                                return !storageItem ? false : true;
                            }).map(function (storageItem) {
                                return (0, _determineContentType.determineContentType)(storageItem)(openpgp).then(function (contentType) {
                                    if (contentType === PGPPRIVKEY) {
                                        (0, _decryptPGPMessageWithKey.decryptPGPMessageWithKey)(openpgp)(password)(storageItem)(PGPMessageArmor).then(function (decrypted) {
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
                                    console.log(result.data);
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
				    coat,
				    tmp;
				if (!at.gun) {
					at.gun = cat.gun;
				}
				if (!(tmp = at['#'])) {
					tmp = at['#'] = Gun.text.random();
				} // TODO: Use what is used other places instead.
				if (cat.dup.check(tmp)) {
					return;
				}
				cat.dup.track(tmp);
				coat = obj_to(at, { gun: cat.gun });
				if (!cat.ack(at['@'], at)) {
					if (at.get) {
						//Gun.on.GET(coat);
						Gun.on('get', coat);
					}
					if (at.put) {
						//Gun.on.PUT(coat);
						Gun.on('put', coat);
					}
				}
				Gun.on('out', coat);
			}
		})();

		;(function () {
			Gun.on('put', function (at) {
				//Gun.on.PUT = function(at){
				if (!at['#']) {
					return this.to.next(at);
				} // for tests. // TODO: REMOVE THIS!
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
					return;
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
			if (!at['@']) {
				check[at['#']] = root;
			} // only ack non-acks.
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
                return function (gundb) {
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

module.exports = "<form\n    id=\"message_form\"\n    onsubmit=\"\n     var gun = Gun(location.origin + '/gun');\n     openpgp.config.aead_protect = true\n     openpgp.initWorker({ path:'/js/openpgp.worker.js' })\n     if (!message_txt.value) {\n          return false\n     }\n     window.handlePost(message_txt.value)(openpgp)(window.localStorage)('royale')(gun).then(result => {if (result) {console.log(result)}}).catch(err => console.error(err));document.getElementById('message_txt').value = ''; return false\"\n    method=\"post\"\n    action=\"/message\">\n    <input id=\"message_form_input\"\n        type=\"submit\"\n        value=\"post message\"\n        form=\"message_form\"\n        >\n</form>\n<textarea\n    id=\"message_txt\"\n    name=\"message_txt\"\n    form=\"message_form\"\n    rows=51\n    cols=70\n    placeholder=\"paste plaintext message, public key, or private key\"\n    style=\"font-family:Menlo,Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New, monospace;\"\n    >\n</textarea>\n"

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = "<span class=\"roadmap\">\n    <details>\n    <summary>road map</summary>\n    <ul>\n        <li><del><a href=\"https://github.com/colealbon/hotlips/commit/3b70981cbe4e11e1400ae8e948a06e3582d9c2d2\">Install node/koa/webpack</a></del></li>\n        <li><del><a href=\"https://github.com/colealbon/hotlips/issues/2\">Install gundb</a></del></li>\n        <li><del>make a <a href=\"#/deck\">deck</a> of cards</del></li>\n        <li><del>Alice and Bob <a href=\"#/message\">identify</a></del></li>\n        <li><del>Alice and Bob <a href=\"#/connect\">connect</a></del></li>\n        <li><del>Alice and Bob <a href=\"https://github.com/colealbon/streamliner\">exchange keys</a></del?</li>\n        <li>Alice and Bob agree on a certain \"<a href=\"#/deck\">deck</a>\" of cards. In practice, this means they agree on a set of numbers or other data such that each element of the set represents a card.</li>\n        <li>Alice picks an encryption key A and uses this to encrypt each card of the deck.</li>\n        <li>Alice <a href=\"https://bost.ocks.org/mike/shuffle/\">shuffles</a> the cards.</li>\n        <li>Alice passes the encrypted and shuffled deck to Bob. With the encryption in place, Bob cannot know which card is which.</li>\n        <li>Bob shuffles the deck.</li>\n        <li>Bob passes the double encrypted and shuffled deck back to Alice.</li>\n        <li>Alice decrypts each card using her key A. This still leaves Bob's encryption in place though so she cannot know which card is which.</li>\n        <li>Alice picks one encryption key for each card (A1, A2, etc.) and encrypts them individually.</li>\n        <li>Alice passes the deck to Bob.</li>\n        <li>Bob decrypts each card using his key B. This still leaves Alice's individual encryption in place though so he cannot know which card is which.</li>\n        <li>Bob picks one encryption key for each card (B1, B2, etc.) and encrypts them individually.</li>\n        <li>Bob passes the deck back to Alice.</li>\n        <li>Alice publishes the deck for everyone playing (in this case only Alice and Bob, see below on expansion though).</li>\n    </ul>\n</details>\n</span>\n"

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNmZjYzMwNGNlNGZkNzBiMTkzMWMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9kZXRlcm1pbmVDb250ZW50VHlwZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL2dldEZyb21TdG9yYWdlLmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvZGVjcnlwdFBHUE1lc3NhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9kZWNyeXB0UEdQTWVzc2FnZVdpdGhLZXkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9kZXRlcm1pbmVLZXlUeXBlLmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvZW5jcnlwdENsZWFyVGV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL2VuY3J5cHRDbGVhcnRleHRNdWx0aS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL3NhdmVQR1BQcml2a2V5LmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvc2F2ZVBHUFB1YmtleS5qcyIsIndlYnBhY2s6Ly8vLi9+L2d1bi9ndW4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWJlbC1yb3V0ZXIvc3JjL3JlYmVsLXJvdXRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL2hhbmRsZVBvc3QuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2Nvbm5lY3QuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2NvbnRhY3QuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2RlY2suanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9tZXNzYWdlLmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9yb2FkbWFwLmpzIiwid2VicGFjazovLy8uL34vcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL21vZHVsZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vdmlld3MvcGFydGlhbHMvY29ubmVjdC5odG1sIiwid2VicGFjazovLy8uL3ZpZXdzL3BhcnRpYWxzL2NvbnRhY3QuaHRtbCIsIndlYnBhY2s6Ly8vLi92aWV3cy9wYXJ0aWFscy9mcmVzaGRlY2suaHRtbCIsIndlYnBhY2s6Ly8vLi92aWV3cy9wYXJ0aWFscy9pbmRleC5odG1sIiwid2VicGFjazovLy8uL3ZpZXdzL3BhcnRpYWxzL21lc3NhZ2VfZm9ybS5odG1sIiwid2VicGFjazovLy8uL3ZpZXdzL3BhcnRpYWxzL3JvYWRtYXAuaHRtbCJdLCJuYW1lcyI6WyJkZXRlcm1pbmVDb250ZW50VHlwZSIsImNvbnRlbnQiLCJQcm9taXNlIiwicmVzb2x2ZSIsIm9wZW5wZ3AiLCJyZWplY3QiLCJDTEVBUlRFWFQiLCJQR1BNRVNTQUdFIiwicG9zc2libGVwZ3BrZXkiLCJrZXkiLCJyZWFkQXJtb3JlZCIsImtleXMiLCJ0aGVuIiwia2V5VHlwZSIsIm1lc3NhZ2UiLCJlcnIiLCJnZXRGcm9tU3RvcmFnZSIsImxvY2FsU3RvcmFnZSIsImluZGV4S2V5IiwiaSIsImxlbmd0aCIsImtleUFyciIsInB1c2giLCJnZXRJdGVtIiwiZGVjcnlwdFBHUE1lc3NhZ2UiLCJQR1BQUklWS0VZIiwicGFzc3dvcmQiLCJQR1BNZXNzYWdlQXJtb3IiLCJzdG9yZUFyciIsImZpbHRlciIsInN0b3JhZ2VJdGVtIiwibWFwIiwiY29udGVudFR5cGUiLCJkZWNyeXB0ZWQiLCJkZWNyeXB0UEdQTWVzc2FnZVdpdGhLZXkiLCJFcnJvciIsInByaXZhdGVLZXlBcm1vciIsInBhc3NwaHJhc2UiLCJwcml2S2V5T2JqIiwiZGVjcnlwdCIsInByaW1hcnlLZXkiLCJpc0RlY3J5cHRlZCIsImRlY3J5cHRNZXNzYWdlIiwiY2xlYXJ0ZXh0IiwiY2F0Y2giLCJjb25zb2xlIiwibG9nIiwicmVzdWx0IiwiZGF0YSIsImRldGVybWluZUtleVR5cGUiLCJQR1BQVUJLRVkiLCJwcml2YXRlS2V5cyIsInByaXZhdGVLZXkiLCJ0b1B1YmxpYyIsImFybW9yIiwiZXJyb3IiLCJlbmNyeXB0Q2xlYXJUZXh0IiwicHVibGljS2V5QXJtb3IiLCJQR1BQdWJrZXkiLCJlbmNyeXB0TWVzc2FnZSIsImVuY3J5cHRlZHR4dCIsIm9wdGlvbnMiLCJwdWJsaWNLZXlzIiwiZW5jcnlwdCIsImNpcGhlcnRleHQiLCJlbmNyeXB0Q2xlYXJ0ZXh0TXVsdGkiLCJzdG9yYWdlQXJyIiwiZW5jcnlwdGVkTXNncyIsImlkeCIsImVuY3J5cHRlZCIsInNhdmVQR1BQcml2a2V5IiwiUEdQa2V5QXJtb3IiLCJQR1BrZXkiLCJzZXRJdGVtIiwidXNlcnMiLCJ1c2VySWQiLCJ1c2VyaWQiLCJwcm9jZXNzIiwic2V0SW1tZWRpYXRlIiwic2F2ZVBHUFB1YmtleSIsImV4aXN0aW5nS2V5IiwiZXhpc3RpbmdLZXlUeXBlIiwicm9vdCIsIndpbmRvdyIsImdsb2JhbCIsInJlcXVpcmUiLCJhcmciLCJzbGljZSIsIm1vZCIsInBhdGgiLCJleHBvcnRzIiwic3BsaXQiLCJ0b1N0cmluZyIsInJlcGxhY2UiLCJjb21tb24iLCJtb2R1bGUiLCJUeXBlIiwiZm5zIiwiZm4iLCJpcyIsImJpIiwiYiIsIkJvb2xlYW4iLCJudW0iLCJuIiwibGlzdF9pcyIsInBhcnNlRmxvYXQiLCJJbmZpbml0eSIsInRleHQiLCJ0IiwiaWZ5IiwiSlNPTiIsInN0cmluZ2lmeSIsInJhbmRvbSIsImwiLCJjIiwicyIsImNoYXJBdCIsIk1hdGgiLCJmbG9vciIsIm1hdGNoIiwibyIsInIiLCJvYmoiLCJoYXMiLCJ0b0xvd2VyQ2FzZSIsImxpc3QiLCJtIiwiaW5kZXhPZiIsImZ1enp5IiwiZiIsIkFycmF5Iiwic2xpdCIsInByb3RvdHlwZSIsInNvcnQiLCJrIiwiQSIsIkIiLCJfIiwib2JqX21hcCIsImluZGV4IiwiT2JqZWN0IiwiY29uc3RydWN0b3IiLCJjYWxsIiwicHV0IiwidiIsImhhc093blByb3BlcnR5IiwiZGVsIiwiYXMiLCJ1Iiwib2JqX2lzIiwicGFyc2UiLCJlIiwib2JqX2hhcyIsInRvIiwiZnJvbSIsImNvcHkiLCJlbXB0eSIsImFyZ3VtZW50cyIsIngiLCJsbCIsImxsZSIsImZuX2lzIiwiaWkiLCJ0aW1lIiwiRGF0ZSIsImdldFRpbWUiLCJvbnRvIiwidGFnIiwibmV4dCIsIkZ1bmN0aW9uIiwiYmUiLCJvZmYiLCJ0aGUiLCJsYXN0IiwiYmFjayIsIm9uIiwiT24iLCJDaGFpbiIsImNyZWF0ZSIsIm9wdCIsImlkIiwicmlkIiwidXVpZCIsInN0dW4iLCJjaGFpbiIsImV2Iiwic2tpcCIsImNiIiwicmVzIiwicXVldWUiLCJ0bXAiLCJxIiwiYWN0IiwiYXQiLCJjdHgiLCJhc2siLCJzY29wZSIsImFjayIsInJlcGx5Iiwib25zIiwiZXZlbnQiLCJHdW4iLCJpbnB1dCIsImVtaXQiLCJhcHBseSIsImNvbmNhdCIsImd1biIsInNvdWwiLCJzdGF0ZSIsIndhaXRpbmciLCJ3aGVuIiwic29vbmVzdCIsInNldCIsImZ1dHVyZSIsIm5vdyIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJjaGVjayIsImVhY2giLCJ3YWl0IiwiSEFNIiwibWFjaGluZVN0YXRlIiwiaW5jb21pbmdTdGF0ZSIsImN1cnJlbnRTdGF0ZSIsImluY29taW5nVmFsdWUiLCJjdXJyZW50VmFsdWUiLCJkZWZlciIsImhpc3RvcmljYWwiLCJjb252ZXJnZSIsImluY29taW5nIiwiTGV4aWNhbCIsImN1cnJlbnQiLCJ1bmRlZmluZWQiLCJWYWwiLCJ0ZXh0X2lzIiwiYmlfaXMiLCJudW1faXMiLCJyZWwiLCJyZWxfIiwib2JqX3B1dCIsIk5vZGUiLCJzb3VsXyIsInRleHRfcmFuZG9tIiwibm9kZSIsIm9ial9kZWwiLCJTdGF0ZSIsInBlcmYiLCJzdGFydCIsIk4iLCJkcmlmdCIsIkQiLCJwZXJmb3JtYW5jZSIsInRpbWluZyIsIm5hdmlnYXRpb25TdGFydCIsIk5fIiwib2JqX2FzIiwidmFsIiwib2JqX2NvcHkiLCJHcmFwaCIsImciLCJvYmpfZW1wdHkiLCJuZiIsImVudiIsImdyYXBoIiwic2VlbiIsInZhbGlkIiwicHJldiIsImludmFsaWQiLCJqb2luIiwiYXJyIiwiRHVwIiwiY2FjaGUiLCJ0cmFjayIsImdjIiwiZGUiLCJvbGRlc3QiLCJtYXhBZ2UiLCJtaW4iLCJkb25lIiwiZWxhcHNlZCIsIm5leHRHQyIsInZlcnNpb24iLCJ0b0pTT04iLCJkdXAiLCJzY2hlZHVsZSIsImZpZWxkIiwidmFsdWUiLCJvbmNlIiwiY2F0IiwiY29hdCIsIm9ial90byIsImdldCIsIm1hY2hpbmUiLCJ2ZXJpZnkiLCJtZXJnZSIsImRpZmYiLCJ2ZXJ0ZXgiLCJ3YXMiLCJrbm93biIsInJlZiIsIl9zb3VsIiwiX2ZpZWxkIiwiaG93IiwicGVlcnMiLCJ1cmwiLCJ3c2MiLCJwcm90b2NvbHMiLCJyZWxfaXMiLCJkZWJ1ZyIsInciLCJ5ZXMiLCJvdXRwdXQiLCJzeW50aCIsInByb3h5IiwiY2hhbmdlIiwiZWNobyIsIm5vdCIsInJlbGF0ZSIsIm5vZGVfIiwicmV2ZXJiIiwidmlhIiwidXNlIiwib3V0IiwiY2FwIiwibm9vcCIsImFueSIsImJhdGNoIiwibm8iLCJpaWZlIiwibWV0YSIsIl9fIiwidW5pb24iLCJzdGF0ZV9pcyIsImNzIiwiaXYiLCJjdiIsInZhbF9pcyIsInN0YXRlX2lmeSIsImRlbHRhIiwic3ludGhfIiwibm9kZV9zb3VsIiwibm9kZV9pcyIsIm5vZGVfaWZ5IiwiZWFzIiwic3VicyIsImJpbmQiLCJvayIsImFzeW5jIiwib3VnaHQiLCJuZWVkIiwiaW1wbGVtZW50IiwiZmllbGRzIiwibl8iLCJpdGVtIiwic3RvcmUiLCJyZW1vdmVJdGVtIiwiZGlydHkiLCJjb3VudCIsIm1heCIsInByZWZpeCIsInNhdmUiLCJhbGwiLCJsZXgiLCJXZWJTb2NrZXQiLCJ3ZWJraXRXZWJTb2NrZXQiLCJtb3pXZWJTb2NrZXQiLCJ3c3AiLCJ1ZHJhaW4iLCJzZW5kIiwicGVlciIsIm1zZyIsIndpcmUiLCJvcGVuIiwicmVhZHlTdGF0ZSIsIk9QRU4iLCJyZWNlaXZlIiwiYm9keSIsIm9uY2xvc2UiLCJyZWNvbm5lY3QiLCJvbmVycm9yIiwiY29kZSIsIm9ub3BlbiIsIm9ubWVzc2FnZSIsIlJlYmVsUm91dGVyIiwiX3ByZWZpeCIsInByZXZpb3VzUGF0aCIsImJhc2VQYXRoIiwiZ2V0QXR0cmlidXRlIiwiaW5oZXJpdCIsIiRlbGVtZW50IiwicGFyZW50Tm9kZSIsIm5vZGVOYW1lIiwicm91dGUiLCJyb3V0ZXMiLCIkY2hpbGRyZW4iLCJjaGlsZHJlbiIsIiRjaGlsZCIsIiR0ZW1wbGF0ZSIsImlubmVySFRNTCIsInNoYWRvd1Jvb3QiLCJjcmVhdGVTaGFkb3dSb290IiwiYW5pbWF0aW9uIiwiaW5pdEFuaW1hdGlvbiIsInJlbmRlciIsInBhdGhDaGFuZ2UiLCJpc0JhY2siLCJjbGFzc0xpc3QiLCJhZGQiLCJyZW1vdmUiLCJvYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJtdXRhdGlvbnMiLCJhZGRlZE5vZGVzIiwib3RoZXJDaGlsZHJlbiIsImdldE90aGVyQ2hpbGRyZW4iLCJmb3JFYWNoIiwiY2hpbGQiLCJhbmltYXRpb25FbmQiLCJ0YXJnZXQiLCJjbGFzc05hbWUiLCJyZW1vdmVDaGlsZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJvYnNlcnZlIiwiY2hpbGRMaXN0IiwiZ2V0UGF0aEZyb21VcmwiLCJyZWdleFN0cmluZyIsInJlZ2V4IiwiUmVnRXhwIiwidGVzdCIsIl9yb3V0ZVJlc3VsdCIsImNvbXBvbmVudCIsIiRjb21wb25lbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJwYXJhbXMiLCJzZXRBdHRyaWJ1dGUiLCJhcHBlbmRDaGlsZCIsInRlbXBsYXRlIiwiYSIsInJlc3VsdHMiLCJxdWVyeVN0cmluZyIsInN1YnN0ciIsInBhcnQiLCJlcSIsImRlY29kZVVSSUNvbXBvbmVudCIsInN1YnN0cmluZyIsIkNsYXNzIiwibmFtZSIsInZhbGlkRWxlbWVudFRhZyIsIkhUTUxFbGVtZW50IiwiY2xhc3NUb1RhZyIsImlzUmVnaXN0ZXJlZEVsZW1lbnQiLCJyZWdpc3RlckVsZW1lbnQiLCJjYWxsYmFjayIsImNoYW5nZUNhbGxiYWNrcyIsImNoYW5nZUhhbmRsZXIiLCJsb2NhdGlvbiIsImhyZWYiLCJvbGRVUkwiLCJvbmhhc2hjaGFuZ2UiLCJwYXJzZVF1ZXJ5U3RyaW5nIiwicmUiLCJleGVjIiwicmVzdWx0czIiLCJSZWJlbFJvdXRlIiwiUmViZWxEZWZhdWx0IiwiUmViZWxCYWNrQSIsInByZXZlbnREZWZhdWx0IiwiZGlzcGF0Y2hFdmVudCIsIkN1c3RvbUV2ZW50IiwiaGFzaCIsIkhUTUxBbmNob3JFbGVtZW50IiwiZXh0ZW5kcyIsImdldFBhcmFtc0Zyb21VcmwiLCJoYW5kbGVQb3N0IiwiZ3VuZGIiLCJjb25uZWN0UGFydGlhbCIsIkNvbm5lY3RQYWdlIiwiY29udGFjdFBhcnRpYWwiLCJDb250YWN0UGFnZSIsImZyZXNoRGVja1BhcnRpYWwiLCJEZWNrUGFnZSIsImNyZWF0ZWRDYWxsYmFjayIsInF1ZXJ5U2VsZWN0b3IiLCJ0ZXh0Q29udGVudCIsImNsb25lIiwiaW1wb3J0Tm9kZSIsImNvbG9yT3ZlcnJpZGUiLCJzdHlsZSIsImNvbG9yIiwiZmlsbCIsImluZGV4UGFydGlhbCIsIkluZGV4UGFnZSIsImNsaWVudFB1YmtleUZvcm1QYXJ0aWFsIiwiTWVzc2FnZVBhZ2UiLCJyb2FkbWFwUGFydGlhbCIsIlJvYWRtYXBQYWdlIiwiY2FjaGVkU2V0VGltZW91dCIsImNhY2hlZENsZWFyVGltZW91dCIsImRlZmF1bHRTZXRUaW1vdXQiLCJkZWZhdWx0Q2xlYXJUaW1lb3V0IiwicnVuVGltZW91dCIsImZ1biIsInJ1bkNsZWFyVGltZW91dCIsIm1hcmtlciIsImRyYWluaW5nIiwiY3VycmVudFF1ZXVlIiwicXVldWVJbmRleCIsImNsZWFuVXBOZXh0VGljayIsImRyYWluUXVldWUiLCJ0aW1lb3V0IiwibGVuIiwicnVuIiwibmV4dFRpY2siLCJhcmdzIiwiSXRlbSIsImFycmF5IiwidGl0bGUiLCJicm93c2VyIiwiYXJndiIsInZlcnNpb25zIiwiYWRkTGlzdGVuZXIiLCJyZW1vdmVMaXN0ZW5lciIsInJlbW92ZUFsbExpc3RlbmVycyIsInByZXBlbmRMaXN0ZW5lciIsInByZXBlbmRPbmNlTGlzdGVuZXIiLCJsaXN0ZW5lcnMiLCJiaW5kaW5nIiwiY3dkIiwiY2hkaXIiLCJkaXIiLCJ1bWFzayIsImV2YWwiLCJ3ZWJwYWNrUG9seWZpbGwiLCJkZXByZWNhdGUiLCJwYXRocyIsImRlZmluZVByb3BlcnR5IiwiZW51bWVyYWJsZSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7OztBQ2hFQTs7Ozs7UUFJZ0JBLG9CLEdBQUFBLG9COztBQUZoQjs7QUFFTyxTQUFTQSxvQkFBVCxDQUE4QkMsT0FBOUIsRUFBdUM7QUFDMUM7QUFDQSxXQUFRLENBQUNBLE9BQUYsR0FDUEMsUUFBUUMsT0FBUixDQUFnQixFQUFoQixDQURPLEdBRVAsVUFBQ0MsT0FBRCxFQUFhO0FBQ1QsZUFBUSxDQUFDQSxPQUFGLEdBQ1BGLFFBQVFHLE1BQVIsQ0FBZSx3QkFBZixDQURPLEdBRVAsSUFBSUgsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUUsTUFBVixFQUFxQjtBQUM3QixnQkFBTUMsWUFBWSxXQUFsQjtBQUNBLGdCQUFNQyxhQUFhLFlBQW5C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UDs7QUFFQTJCLE9BQU8zRCxpQkFBUDs7QUFFQTJELE9BQU9KLGFBQVA7O0FBRUFJLE9BQU9iLGNBQVA7O0FBRUFhLE9BQU9uRSxjQUFQOztBQUVBbUUsT0FBT2pELHdCQUFQOztBQUVBOzs7QUFHQTs7O0FBR0EsMEU7Ozs7OztBQy9CQSw4Tzs7Ozs7O0FDQUEscWU7Ozs7OztBQ0FBLG0yL0VBQW0yL0Usa0ZBQWtGLHlKQUF5SiwrR0FBK0csK0dBQStHLCtHQUErRywrR0FBK0csK0dBQStHLCtHQUErRywrR0FBK0csK0dBQStHLCtHQUErRyxnSEFBZ0gsK0dBQStHLCtHQUErRywySEFBMkgsOEZBQThGLDhGQUE4Riw4RkFBOEYsOEZBQThGLDhGQUE4Riw4RkFBOEYsOEZBQThGLDhGQUE4Riw4RkFBOEYsK0ZBQStGLDhGQUE4Riw4RkFBOEYsMEhBQTBILDZGQUE2Riw2RkFBNkYsNkZBQTZGLDZGQUE2Riw2RkFBNkYsNkZBQTZGLDZGQUE2Riw2RkFBNkYsNkZBQTZGLDhGQUE4Riw2RkFBNkYsNkZBQTZGLDRIQUE0SCwrRkFBK0YsK0ZBQStGLCtGQUErRiwrRkFBK0YsK0ZBQStGLCtGQUErRiwrRkFBK0YsK0ZBQStGLCtGQUErRixnR0FBZ0csK0ZBQStGLCtGQUErRixvRTs7Ozs7O0FDQS9pcUYsaUM7Ozs7OztBQ0FBLGdIQUFnSCxvRUFBb0UsK0JBQStCLGlDQUFpQyxnQ0FBZ0MseUdBQXlHLGFBQWEscUJBQXFCLG1DQUFtQyxrREFBa0QsMmhCQUEyaEIseUI7Ozs7OztBQ0EvZ0MseW5FIiwiZmlsZSI6InJveWFsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMjEpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDZmY2MzMDRjZTRmZDcwYjE5MzFjIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2RldGVybWluZUtleVR5cGV9IGZyb20gJy4vZGV0ZXJtaW5lS2V5VHlwZS5qcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXRlcm1pbmVDb250ZW50VHlwZShjb250ZW50KSB7XG4gICAgLy8gdXNhZ2U6IGRldGVybWluZUNvbnRlbnRUeXBlKGNvbnRlbnQpKG9wZW5wZ3ApLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbiAgICByZXR1cm4gKCFjb250ZW50KSA/XG4gICAgUHJvbWlzZS5yZXNvbHZlKCcnKTpcbiAgICAob3BlbnBncCkgPT4ge1xuICAgICAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBvcGVucGdwJyk6XG4gICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IENMRUFSVEVYVCA9ICdjbGVhcnRleHQnO1xuICAgICAgICAgICAgY29uc3QgUEdQTUVTU0FHRSA9ICdQR1BNZXNzYWdlJztcbiAgICAgICAgICAgIGxldCBwb3NzaWJsZXBncGtleSA9IG9wZW5wZ3Aua2V5LnJlYWRBcm1vcmVkKGNvbnRlbnQpO1xuICAgICAgICAgICAgaWYgKHBvc3NpYmxlcGdwa2V5LmtleXNbMF0pIHtcbiAgICAgICAgICAgICAgICBkZXRlcm1pbmVLZXlUeXBlKGNvbnRlbnQpKG9wZW5wZ3ApXG4gICAgICAgICAgICAgICAgLnRoZW4oKGtleVR5cGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShrZXlUeXBlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbnBncC5tZXNzYWdlLnJlYWRBcm1vcmVkKGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKFBHUE1FU1NBR0UpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKENMRUFSVEVYVCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvZGV0ZXJtaW5lQ29udGVudFR5cGUuanMiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRGcm9tU3RvcmFnZShsb2NhbFN0b3JhZ2UpIHtcbiAgICAvLyB1c2FnZTogZ2V0RnJvbVN0b3JhZ2UobG9jYWxTdG9yYWdlKShba2V5XSkudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgIHJldHVybiAoIWxvY2FsU3RvcmFnZSkgP1xuICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBsb2NhbFN0b3JhZ2UnKTpcbiAgICAoaW5kZXhLZXkpID0+IHtcbiAgICAgICAgcmV0dXJuICghaW5kZXhLZXkpID9cbiAgICAgICAgLy8gbm8gaW5kZXggLT4gcmV0dXJuIGV2ZXJ5dGhpbmdcbiAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsZXQgaSA9IGxvY2FsU3RvcmFnZS5sZW5ndGhcbiAgICAgICAgICAgICAgICBsZXQga2V5QXJyID0gW11cbiAgICAgICAgICAgICAgICB3aGlsZSAoaSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGkgPSBpIC0gMVxuICAgICAgICAgICAgICAgICAgICBrZXlBcnIucHVzaChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShsb2NhbFN0b3JhZ2Uua2V5KGkpKSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoa2V5QXJyKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pOlxuICAgICAgICAvLyBpbmRleCBwcm92aWRlZCAtPiByZXR1cm4gb25lXG4gICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShpbmRleEtleSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGliL2dldEZyb21TdG9yYWdlLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2dldEZyb21TdG9yYWdlfSBmcm9tICcuL2dldEZyb21TdG9yYWdlJztcbmltcG9ydCB7ZGVjcnlwdFBHUE1lc3NhZ2VXaXRoS2V5fSBmcm9tICcuLi8uLi9zcmMvbGliL2RlY3J5cHRQR1BNZXNzYWdlV2l0aEtleS5qcyc7XG5pbXBvcnQge2RldGVybWluZUNvbnRlbnRUeXBlfSBmcm9tICcuLi8uLi9zcmMvbGliL2RldGVybWluZUNvbnRlbnRUeXBlLmpzJztcblxuY29uc3QgUEdQUFJJVktFWSA9ICdQR1BQcml2a2V5JztcblxuZXhwb3J0IGZ1bmN0aW9uIGRlY3J5cHRQR1BNZXNzYWdlKG9wZW5wZ3ApIHtcbiAgICAvLyAgdXNhZ2U6IGRlY3J5cHRQR1BNZXNzYWdlKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSkocGFzc3dvcmQpKFBHUE1lc3NhZ2VBcm1vcikudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgIHJldHVybiAoIW9wZW5wZ3ApID9cbiAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgIChsb2NhbFN0b3JhZ2UpID0+IHtcbiAgICAgICAgcmV0dXJuICghbG9jYWxTdG9yYWdlKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBsb2NhbFN0b3JhZ2UnKTpcbiAgICAgICAgKHBhc3N3b3JkKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCFwYXNzd29yZCkgP1xuICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QoXCJFcnJvcjogbWlzc2luZyBwYXNzd29yZFwiKTpcbiAgICAgICAgICAgIChQR1BNZXNzYWdlQXJtb3IpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKCFQR1BNZXNzYWdlQXJtb3IpID9cbiAgICAgICAgICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgUEdQTWVzc2FnZUFybW9yJyk6XG4gICAgICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBnZXRGcm9tU3RvcmFnZShsb2NhbFN0b3JhZ2UpKClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oc3RvcmVBcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RvcmVBcnJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKHN0b3JhZ2VJdGVtID0+ICghc3RvcmFnZUl0ZW0pID8gZmFsc2UgOiB0cnVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoc3RvcmFnZUl0ZW0gPT4gZGV0ZXJtaW5lQ29udGVudFR5cGUoc3RvcmFnZUl0ZW0pKG9wZW5wZ3ApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGNvbnRlbnRUeXBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50VHlwZSA9PT0gUEdQUFJJVktFWSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlY3J5cHRQR1BNZXNzYWdlV2l0aEtleShvcGVucGdwKShwYXNzd29yZCkoc3RvcmFnZUl0ZW0pKFBHUE1lc3NhZ2VBcm1vcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihkZWNyeXB0ZWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRlY3J5cHRlZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGliL2RlY3J5cHRQR1BNZXNzYWdlLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgZnVuY3Rpb24gZGVjcnlwdFBHUE1lc3NhZ2VXaXRoS2V5KG9wZW5wZ3ApIHtcbiAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdtaXNzaW5nIG9wZW5wZ3AnKSk6XG4gICAgKHBhc3N3b3JkKSA9PiB7XG4gICAgICAgIHJldHVybiAoIXBhc3N3b3JkKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignbWlzc2luZyBwYXNzd29yZCcpKTpcbiAgICAgICAgKHByaXZhdGVLZXlBcm1vcikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICghcHJpdmF0ZUtleUFybW9yKSA/XG4gICAgICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ21pc3NpbmcgcHJpdmF0ZUtleUFybW9yJykpOlxuICAgICAgICAgICAgKFBHUE1lc3NhZ2VBcm1vcikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAoIVBHUE1lc3NhZ2VBcm1vcikgP1xuICAgICAgICAgICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignbWlzc2luZyBQR1BNZXNzYWdlQXJtb3InKSk6XG4gICAgICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhc3NwaHJhc2UgPSBgJHtwYXNzd29yZH1gOyAvL3doYXQgdGhlIHByaXZLZXkgaXMgZW5jcnlwdGVkIHdpdGhcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcml2S2V5T2JqID0gb3BlbnBncC5rZXkucmVhZEFybW9yZWQoYCR7cHJpdmF0ZUtleUFybW9yfWApLmtleXNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBwcml2S2V5T2JqLmRlY3J5cHQocGFzc3BocmFzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gb3BlbnBncC5tZXNzYWdlLnJlYWRBcm1vcmVkKFBHUE1lc3NhZ2VBcm1vcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXByaXZLZXlPYmoucHJpbWFyeUtleS5pc0RlY3J5cHRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdQcml2YXRlIGtleSBpcyBub3QgZGVjcnlwdGVkJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW9wZW5wZ3AuZGVjcnlwdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVucGdwLmRlY3J5cHRNZXNzYWdlKHByaXZLZXlPYmosIG1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGNsZWFydGV4dCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNsZWFydGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiByZWplY3QoZXJyKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVucGdwLmRlY3J5cHQoeyAnbWVzc2FnZSc6IG1lc3NhZ2UsICdwcml2YXRlS2V5JzogcHJpdktleU9iaiB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0LmRhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdC5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3Jlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdiYWQgcHJpdmF0ZUtleUFybW9yJykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvZGVjcnlwdFBHUE1lc3NhZ2VXaXRoS2V5LmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgZnVuY3Rpb24gZGV0ZXJtaW5lS2V5VHlwZShjb250ZW50KSB7XG4gICAgcmV0dXJuICghY29udGVudCkgP1xuICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBwZ3BLZXknKTpcbiAgICAob3BlbnBncCkgPT4ge1xuICAgICAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBvcGVucGdwJyk6XG4gICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IFBHUFBVQktFWSA9ICdQR1BQdWJrZXknO1xuICAgICAgICAgICAgY29uc3QgUEdQUFJJVktFWSA9ICdQR1BQcml2a2V5JztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbGV0IHByaXZhdGVLZXlzID0gb3BlbnBncC5rZXkucmVhZEFybW9yZWQoY29udGVudClcbiAgICAgICAgICAgICAgICBsZXQgcHJpdmF0ZUtleSA9IHByaXZhdGVLZXlzLmtleXNbMF1cbiAgICAgICAgICAgICAgICBpZiAocHJpdmF0ZUtleS50b1B1YmxpYygpLmFybW9yKCkgIT09IHByaXZhdGVLZXkuYXJtb3IoKSApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShQR1BQUklWS0VZKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKFBHUFBVQktFWSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvZGV0ZXJtaW5lS2V5VHlwZS5qcyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGZ1bmN0aW9uIGVuY3J5cHRDbGVhclRleHQob3BlbnBncCkge1xuICAgIC8vIHVzYWdlOiBlbmNyeXB0Q2xlYXJUZXh0KG9wZW5wZ3ApKHB1YmxpY0tleUFybW9yKShjbGVhcnRleHQpLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbiAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIG9wZW5wZ3AnKTpcbiAgICAocHVibGljS2V5QXJtb3IpID0+IHtcbiAgICAgICAgcmV0dXJuICghcHVibGljS2V5QXJtb3IpID9cbiAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIHB1YmxpYyBrZXknKTpcbiAgICAgICAgKGNsZWFydGV4dCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICghY2xlYXJ0ZXh0KSA/XG4gICAgICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgY2xlYXJ0ZXh0Jyk6XG4gICAgICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IFBHUFB1YmtleSA9IG9wZW5wZ3Aua2V5LnJlYWRBcm1vcmVkKHB1YmxpY0tleUFybW9yKVxuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgdGhlIGxhdGVzdCBvcGVucGdwIDIuNS40IGJyZWFrcyBvbiBvdXIgY29uc29sZSBvbmx5IHRvb2xzLlxuICAgICAgICAgICAgICAgIGJ1dCBpdCdzIDEweCBmYXN0ZXIgb24gYnJvd3NlcnMgc28gVEhFIE5FVyBDT0RFIFNUQVlTIElOLlxuICAgICAgICAgICAgICAgIGJlbG93IHdlIGV4cGxvaXQgZmFsbGJhY2sgdG8gb2xkIHNsb3cgZXJyb3IgZnJlZSBvcGVucGdwIDEuNi4yXG4gICAgICAgICAgICAgICAgYnkgYWRhcHRpbmcgb24gdGhlIGZseSB0byBhIGJyZWFraW5nIGNoYW5nZVxuICAgICAgICAgICAgICAgIChvcGVucGdwIGJ1ZyBeMS42LjIgLT4gMi41LjQgbWFkZSB1cyBkbyBpdClcbiAgICAgICAgICAgICAgICByZWZhY3RvcjogcmVtb3ZlIHRyeSBzZWN0aW9uIG9mIHRyeWNhdGNoIGtlZXAgY2F0Y2ggc2VjdGlvblxuICAgICAgICAgICAgICAgIGJ5IGFsbCBtZWFucyByZWZhY3RvciBpZiBub3QgYnJva2VuIGFmdGVyIG9wZW5wZ3AgMi41LjRcbiAgICAgICAgICAgICAgICBpZiB5b3UgY2hlY2sgb3BlbnBncCBwbGVhc2UgYnVtcCBmYWlsaW5nIHZlcnNpb24gIF5eXl5eXG4gICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAvLyB3b3JrcyBvbmx5IG9uIG9wZW5wZ3AgdmVyc2lvbiAxLjYuMlxuICAgICAgICAgICAgICAgICAgICBvcGVucGdwLmVuY3J5cHRNZXNzYWdlKFBHUFB1YmtleS5rZXlzWzBdLCBjbGVhcnRleHQpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGVuY3J5cHRlZHR4dCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGVuY3J5cHRlZHR4dClcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKClcbiAgICAgICAgICAgICAgICB9IGNhdGNoKGVycikge1xuICAgICAgICAgICAgICAgICAgICAvLyB3b3JrcyBvbiBvcGVucGdwIHZlcnNpb24gMi41LjRcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBjbGVhcnRleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwdWJsaWNLZXlzOiBvcGVucGdwLmtleS5yZWFkQXJtb3JlZChwdWJsaWNLZXlBcm1vcikua2V5cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFybW9yOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIG9wZW5wZ3AuZW5jcnlwdChvcHRpb25zKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoY2lwaGVydGV4dCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjaXBoZXJ0ZXh0LmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xpYi9lbmNyeXB0Q2xlYXJUZXh0LmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2dldEZyb21TdG9yYWdlfSBmcm9tICcuL2dldEZyb21TdG9yYWdlJztcbmltcG9ydCB7ZGV0ZXJtaW5lQ29udGVudFR5cGV9IGZyb20gJy4vZGV0ZXJtaW5lQ29udGVudFR5cGUnO1xuaW1wb3J0IHtlbmNyeXB0Q2xlYXJUZXh0fSBmcm9tICcuL2VuY3J5cHRDbGVhclRleHQnO1xuXG5jb25zdCBQR1BQVUJLRVkgPSAnUEdQUHVia2V5JztcblxuZXhwb3J0IGZ1bmN0aW9uIGVuY3J5cHRDbGVhcnRleHRNdWx0aShjb250ZW50KSB7XG4gICAgLy8gdXNhZ2U6IGVuY3J5cHRDbGVhcnRleHRNdWx0aShjb250ZW50KShvcGVucGdwKShsb2NhbFN0b3JhZ2UpLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbiAgICByZXR1cm4gKCFjb250ZW50KSA/XG4gICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIGNvbnRlbnQnKTpcbiAgICAob3BlbnBncCkgPT4ge1xuICAgICAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBvcGVucGdwJyk6XG4gICAgICAgIChsb2NhbFN0b3JhZ2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoIWxvY2FsU3RvcmFnZSkgP1xuICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIGxvY2FsU3RvcmFnZScpOlxuICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGdldEZyb21TdG9yYWdlKGxvY2FsU3RvcmFnZSkoKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoc3RvcmFnZUFycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9sZXQgcHVibGljS2V5QXJyID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZW5jcnlwdGVkTXNncyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGkgPSBzdG9yYWdlQXJyLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpZHggPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmFnZUFyclxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgoc3RvcmFnZUl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0b3JhZ2VJdGVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoc3RvcmFnZUl0ZW0gPT4gKCFzdG9yYWdlSXRlbSkgPyBmYWxzZSA6IHRydWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKChzdG9yYWdlSXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldGVybWluZUNvbnRlbnRUeXBlKHN0b3JhZ2VJdGVtKShvcGVucGdwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChjb250ZW50VHlwZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudFR5cGUgPT09IFBHUFBVQktFWSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5jcnlwdENsZWFyVGV4dChvcGVucGdwKShzdG9yYWdlSXRlbSkoY29udGVudClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChlbmNyeXB0ZWQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmNyeXB0ZWRNc2dzW2lkeF0gPSBlbmNyeXB0ZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWR4Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShlbmNyeXB0ZWRNc2dzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCAobmV3IEVycm9yIChlcnIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xpYi9lbmNyeXB0Q2xlYXJ0ZXh0TXVsdGkuanMiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlUEdQUHJpdmtleShQR1BrZXlBcm1vcikge1xuICAgIC8vIHNhdmUgcHJpdmF0ZSBrZXkgdG8gc3RvcmFnZSBubyBxdWVzdGlvbnMgYXNrZWRcbiAgICAvLyB1c2FnZTogc2F2ZVBHUFByaXZrZXkoY29udGVudCkob3BlbnBncCkobG9jYWxTdG9yYWdlKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpXG4gICAgcmV0dXJuICghUEdQa2V5QXJtb3IpID9cbiAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgUEdQa2V5QXJtb3InKTpcbiAgICAob3BlbnBncCkgPT4ge1xuICAgICAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBvcGVucGdwJyk6XG4gICAgICAgIChsb2NhbFN0b3JhZ2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoIWxvY2FsU3RvcmFnZSkgP1xuICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIGxvY2FsU3RvcmFnZScpOlxuICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBQR1BrZXkgPSBvcGVucGdwLmtleS5yZWFkQXJtb3JlZChQR1BrZXlBcm1vcik7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFBHUGtleS5rZXlzWzBdLnVzZXJzWzBdLnVzZXJJZC51c2VyaWQsIFBHUGtleUFybW9yKVxuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLnNldEltbWVkaWF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYHByaXZhdGUgcGdwIGtleSBzYXZlZCA8LSAke1BHUGtleS5rZXlzWzBdLnVzZXJzWzBdLnVzZXJJZC51c2VyaWR9YClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGliL3NhdmVQR1BQcml2a2V5LmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2dldEZyb21TdG9yYWdlfSBmcm9tICcuL2dldEZyb21TdG9yYWdlJztcbmltcG9ydCB7ZGV0ZXJtaW5lQ29udGVudFR5cGV9IGZyb20gJy4vZGV0ZXJtaW5lQ29udGVudFR5cGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZVBHUFB1YmtleShQR1BrZXlBcm1vcikge1xuICAgIC8vIHNhdmUgcHVibGljIGtleSB0byBzdG9yYWdlIG9ubHkgaWYgaXQgZG9lc24ndCBvdmVyd3JpdGUgYSBwcml2YXRlIGtleVxuICAgIC8vIHVzYWdlOiBzYXZlUEdQUHVia2V5KGNvbnRlbnQpKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSkudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgIHJldHVybiAoIVBHUGtleUFybW9yKSA/XG4gICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIFBHUGtleUFybW9yJyk6XG4gICAgKG9wZW5wZ3ApID0+IHtcbiAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgICAgICAobG9jYWxTdG9yYWdlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCFsb2NhbFN0b3JhZ2UpID9cbiAgICAgICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBsb2NhbFN0b3JhZ2UnKTpcbiAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgUEdQa2V5ID0gb3BlbnBncC5rZXkucmVhZEFybW9yZWQoUEdQa2V5QXJtb3IpO1xuICAgICAgICAgICAgICAgIGdldEZyb21TdG9yYWdlKGxvY2FsU3RvcmFnZSkoUEdQa2V5LmtleXNbMF0udXNlcnNbMF0udXNlcklkLnVzZXJpZClcbiAgICAgICAgICAgICAgICAudGhlbihleGlzdGluZ0tleSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoIWV4aXN0aW5nS2V5KSA/XG4gICAgICAgICAgICAgICAgICAgIFByb21pc2UucmVzb2x2ZSgnbm9uZScpIDpcbiAgICAgICAgICAgICAgICAgICAgZGV0ZXJtaW5lQ29udGVudFR5cGUoZXhpc3RpbmdLZXkpKG9wZW5wZ3ApO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZXhpc3RpbmdLZXlUeXBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0aW5nS2V5VHlwZSA9PT0gJ1BHUFByaXZrZXknKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoJ3B1YmtleSBpZ25vcmVkIFgtIGF0dGVtcHRlZCBvdmVyd3JpdGUgcHJpdmtleScpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShQR1BrZXkua2V5c1swXS51c2Vyc1swXS51c2VySWQudXNlcmlkLCBQR1BrZXlBcm1vcilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYHB1YmxpYyBwZ3Aga2V5IHNhdmVkIDwtICR7UEdQa2V5LmtleXNbMF0udXNlcnNbMF0udXNlcklkLnVzZXJpZH1gKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gcmVqZWN0KGVycikpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xpYi9zYXZlUEdQUHVia2V5LmpzIiwiOyhmdW5jdGlvbigpe1xyXG5cclxuXHQvKiBVTkJVSUxEICovXHJcblx0dmFyIHJvb3Q7XHJcblx0aWYodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIil7IHJvb3QgPSB3aW5kb3cgfVxyXG5cdGlmKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIpeyByb290ID0gZ2xvYmFsIH1cclxuXHRyb290ID0gcm9vdCB8fCB7fTtcclxuXHR2YXIgY29uc29sZSA9IHJvb3QuY29uc29sZSB8fCB7bG9nOiBmdW5jdGlvbigpe319O1xyXG5cdGZ1bmN0aW9uIHJlcXVpcmUoYXJnKXtcclxuXHRcdHJldHVybiBhcmcuc2xpY2U/IHJlcXVpcmVbcmVzb2x2ZShhcmcpXSA6IGZ1bmN0aW9uKG1vZCwgcGF0aCl7XHJcblx0XHRcdGFyZyhtb2QgPSB7ZXhwb3J0czoge319KTtcclxuXHRcdFx0cmVxdWlyZVtyZXNvbHZlKHBhdGgpXSA9IG1vZC5leHBvcnRzO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gcmVzb2x2ZShwYXRoKXtcclxuXHRcdFx0cmV0dXJuIHBhdGguc3BsaXQoJy8nKS5zbGljZSgtMSkudG9TdHJpbmcoKS5yZXBsYWNlKCcuanMnLCcnKTtcclxuXHRcdH1cclxuXHR9XHJcblx0aWYodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIil7IHZhciBjb21tb24gPSBtb2R1bGUgfVxyXG5cdC8qIFVOQlVJTEQgKi9cclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdC8vIEdlbmVyaWMgamF2YXNjcmlwdCB1dGlsaXRpZXMuXHJcblx0XHR2YXIgVHlwZSA9IHt9O1xyXG5cdFx0Ly9UeXBlLmZucyA9IFR5cGUuZm4gPSB7aXM6IGZ1bmN0aW9uKGZuKXsgcmV0dXJuICghIWZuICYmIGZuIGluc3RhbmNlb2YgRnVuY3Rpb24pIH19XHJcblx0XHRUeXBlLmZucyA9IFR5cGUuZm4gPSB7aXM6IGZ1bmN0aW9uKGZuKXsgcmV0dXJuICghIWZuICYmICdmdW5jdGlvbicgPT0gdHlwZW9mIGZuKSB9fVxyXG5cdFx0VHlwZS5iaSA9IHtpczogZnVuY3Rpb24oYil7IHJldHVybiAoYiBpbnN0YW5jZW9mIEJvb2xlYW4gfHwgdHlwZW9mIGIgPT0gJ2Jvb2xlYW4nKSB9fVxyXG5cdFx0VHlwZS5udW0gPSB7aXM6IGZ1bmN0aW9uKG4peyByZXR1cm4gIWxpc3RfaXMobikgJiYgKChuIC0gcGFyc2VGbG9hdChuKSArIDEpID49IDAgfHwgSW5maW5pdHkgPT09IG4gfHwgLUluZmluaXR5ID09PSBuKSB9fVxyXG5cdFx0VHlwZS50ZXh0ID0ge2lzOiBmdW5jdGlvbih0KXsgcmV0dXJuICh0eXBlb2YgdCA9PSAnc3RyaW5nJykgfX1cclxuXHRcdFR5cGUudGV4dC5pZnkgPSBmdW5jdGlvbih0KXtcclxuXHRcdFx0aWYoVHlwZS50ZXh0LmlzKHQpKXsgcmV0dXJuIHQgfVxyXG5cdFx0XHRpZih0eXBlb2YgSlNPTiAhPT0gXCJ1bmRlZmluZWRcIil7IHJldHVybiBKU09OLnN0cmluZ2lmeSh0KSB9XHJcblx0XHRcdHJldHVybiAodCAmJiB0LnRvU3RyaW5nKT8gdC50b1N0cmluZygpIDogdDtcclxuXHRcdH1cclxuXHRcdFR5cGUudGV4dC5yYW5kb20gPSBmdW5jdGlvbihsLCBjKXtcclxuXHRcdFx0dmFyIHMgPSAnJztcclxuXHRcdFx0bCA9IGwgfHwgMjQ7IC8vIHlvdSBhcmUgbm90IGdvaW5nIHRvIG1ha2UgYSAwIGxlbmd0aCByYW5kb20gbnVtYmVyLCBzbyBubyBuZWVkIHRvIGNoZWNrIHR5cGVcclxuXHRcdFx0YyA9IGMgfHwgJzAxMjM0NTY3ODlBQkNERUZHSElKS0xNTk9QUVJTVFVWV1haYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonO1xyXG5cdFx0XHR3aGlsZShsID4gMCl7IHMgKz0gYy5jaGFyQXQoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYy5sZW5ndGgpKTsgbC0tIH1cclxuXHRcdFx0cmV0dXJuIHM7XHJcblx0XHR9XHJcblx0XHRUeXBlLnRleHQubWF0Y2ggPSBmdW5jdGlvbih0LCBvKXsgdmFyIHIgPSBmYWxzZTtcclxuXHRcdFx0dCA9IHQgfHwgJyc7XHJcblx0XHRcdG8gPSBUeXBlLnRleHQuaXMobyk/IHsnPSc6IG99IDogbyB8fCB7fTsgLy8geyd+JywgJz0nLCAnKicsICc8JywgJz4nLCAnKycsICctJywgJz8nLCAnISd9IC8vIGlnbm9yZSBjYXNlLCBleGFjdGx5IGVxdWFsLCBhbnl0aGluZyBhZnRlciwgbGV4aWNhbGx5IGxhcmdlciwgbGV4aWNhbGx5IGxlc3NlciwgYWRkZWQgaW4sIHN1YnRhY3RlZCBmcm9tLCBxdWVzdGlvbmFibGUgZnV6enkgbWF0Y2gsIGFuZCBlbmRzIHdpdGguXHJcblx0XHRcdGlmKFR5cGUub2JqLmhhcyhvLCd+JykpeyB0ID0gdC50b0xvd2VyQ2FzZSgpOyBvWyc9J10gPSAob1snPSddIHx8IG9bJ34nXSkudG9Mb3dlckNhc2UoKSB9XHJcblx0XHRcdGlmKFR5cGUub2JqLmhhcyhvLCc9JykpeyByZXR1cm4gdCA9PT0gb1snPSddIH1cclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJyonKSl7IGlmKHQuc2xpY2UoMCwgb1snKiddLmxlbmd0aCkgPT09IG9bJyonXSl7IHIgPSB0cnVlOyB0ID0gdC5zbGljZShvWycqJ10ubGVuZ3RoKSB9IGVsc2UgeyByZXR1cm4gZmFsc2UgfX1cclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJyEnKSl7IGlmKHQuc2xpY2UoLW9bJyEnXS5sZW5ndGgpID09PSBvWychJ10peyByID0gdHJ1ZSB9IGVsc2UgeyByZXR1cm4gZmFsc2UgfX1cclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJysnKSl7XHJcblx0XHRcdFx0aWYoVHlwZS5saXN0Lm1hcChUeXBlLmxpc3QuaXMob1snKyddKT8gb1snKyddIDogW29bJysnXV0sIGZ1bmN0aW9uKG0pe1xyXG5cdFx0XHRcdFx0aWYodC5pbmRleE9mKG0pID49IDApeyByID0gdHJ1ZSB9IGVsc2UgeyByZXR1cm4gdHJ1ZSB9XHJcblx0XHRcdFx0fSkpeyByZXR1cm4gZmFsc2UgfVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKFR5cGUub2JqLmhhcyhvLCctJykpe1xyXG5cdFx0XHRcdGlmKFR5cGUubGlzdC5tYXAoVHlwZS5saXN0LmlzKG9bJy0nXSk/IG9bJy0nXSA6IFtvWyctJ11dLCBmdW5jdGlvbihtKXtcclxuXHRcdFx0XHRcdGlmKHQuaW5kZXhPZihtKSA8IDApeyByID0gdHJ1ZSB9IGVsc2UgeyByZXR1cm4gdHJ1ZSB9XHJcblx0XHRcdFx0fSkpeyByZXR1cm4gZmFsc2UgfVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKFR5cGUub2JqLmhhcyhvLCc+JykpeyBpZih0ID4gb1snPiddKXsgciA9IHRydWUgfSBlbHNlIHsgcmV0dXJuIGZhbHNlIH19XHJcblx0XHRcdGlmKFR5cGUub2JqLmhhcyhvLCc8JykpeyBpZih0IDwgb1snPCddKXsgciA9IHRydWUgfSBlbHNlIHsgcmV0dXJuIGZhbHNlIH19XHJcblx0XHRcdGZ1bmN0aW9uIGZ1enp5KHQsZil7IHZhciBuID0gLTEsIGkgPSAwLCBjOyBmb3IoO2MgPSBmW2krK107KXsgaWYoIX4obiA9IHQuaW5kZXhPZihjLCBuKzEpKSl7IHJldHVybiBmYWxzZSB9fSByZXR1cm4gdHJ1ZSB9IC8vIHZpYSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzkyMDYwMTMvamF2YXNjcmlwdC1mdXp6eS1zZWFyY2hcclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJz8nKSl7IGlmKGZ1enp5KHQsIG9bJz8nXSkpeyByID0gdHJ1ZSB9IGVsc2UgeyByZXR1cm4gZmFsc2UgfX0gLy8gY2hhbmdlIG5hbWUhXHJcblx0XHRcdHJldHVybiByO1xyXG5cdFx0fVxyXG5cdFx0VHlwZS5saXN0ID0ge2lzOiBmdW5jdGlvbihsKXsgcmV0dXJuIChsIGluc3RhbmNlb2YgQXJyYXkpIH19XHJcblx0XHRUeXBlLmxpc3Quc2xpdCA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcclxuXHRcdFR5cGUubGlzdC5zb3J0ID0gZnVuY3Rpb24oayl7IC8vIGNyZWF0ZXMgYSBuZXcgc29ydCBmdW5jdGlvbiBiYXNlZCBvZmYgc29tZSBmaWVsZFxyXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oQSxCKXtcclxuXHRcdFx0XHRpZighQSB8fCAhQil7IHJldHVybiAwIH0gQSA9IEFba107IEIgPSBCW2tdO1xyXG5cdFx0XHRcdGlmKEEgPCBCKXsgcmV0dXJuIC0xIH1lbHNlIGlmKEEgPiBCKXsgcmV0dXJuIDEgfVxyXG5cdFx0XHRcdGVsc2UgeyByZXR1cm4gMCB9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFR5cGUubGlzdC5tYXAgPSBmdW5jdGlvbihsLCBjLCBfKXsgcmV0dXJuIG9ial9tYXAobCwgYywgXykgfVxyXG5cdFx0VHlwZS5saXN0LmluZGV4ID0gMTsgLy8gY2hhbmdlIHRoaXMgdG8gMCBpZiB5b3Ugd2FudCBub24tbG9naWNhbCwgbm9uLW1hdGhlbWF0aWNhbCwgbm9uLW1hdHJpeCwgbm9uLWNvbnZlbmllbnQgYXJyYXkgbm90YXRpb25cclxuXHRcdFR5cGUub2JqID0ge2lzOiBmdW5jdGlvbihvKXsgcmV0dXJuIG8/IChvIGluc3RhbmNlb2YgT2JqZWN0ICYmIG8uY29uc3RydWN0b3IgPT09IE9iamVjdCkgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLm1hdGNoKC9eXFxbb2JqZWN0IChcXHcrKVxcXSQvKVsxXSA9PT0gJ09iamVjdCcgOiBmYWxzZSB9fVxyXG5cdFx0VHlwZS5vYmoucHV0ID0gZnVuY3Rpb24obywgZiwgdil7IHJldHVybiAob3x8e30pW2ZdID0gdiwgbyB9XHJcblx0XHRUeXBlLm9iai5oYXMgPSBmdW5jdGlvbihvLCBmKXsgcmV0dXJuIG8gJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIGYpIH1cclxuXHRcdFR5cGUub2JqLmRlbCA9IGZ1bmN0aW9uKG8sIGspe1xyXG5cdFx0XHRpZighbyl7IHJldHVybiB9XHJcblx0XHRcdG9ba10gPSBudWxsO1xyXG5cdFx0XHRkZWxldGUgb1trXTtcclxuXHRcdFx0cmV0dXJuIG87XHJcblx0XHR9XHJcblx0XHRUeXBlLm9iai5hcyA9IGZ1bmN0aW9uKG8sIGYsIHYsIHUpeyByZXR1cm4gb1tmXSA9IG9bZl0gfHwgKHUgPT09IHY/IHt9IDogdikgfVxyXG5cdFx0VHlwZS5vYmouaWZ5ID0gZnVuY3Rpb24obyl7XHJcblx0XHRcdGlmKG9ial9pcyhvKSl7IHJldHVybiBvIH1cclxuXHRcdFx0dHJ5e28gPSBKU09OLnBhcnNlKG8pO1xyXG5cdFx0XHR9Y2F0Y2goZSl7bz17fX07XHJcblx0XHRcdHJldHVybiBvO1xyXG5cdFx0fVxyXG5cdFx0OyhmdW5jdGlvbigpeyB2YXIgdTtcclxuXHRcdFx0ZnVuY3Rpb24gbWFwKHYsZil7XHJcblx0XHRcdFx0aWYob2JqX2hhcyh0aGlzLGYpICYmIHUgIT09IHRoaXNbZl0peyByZXR1cm4gfVxyXG5cdFx0XHRcdHRoaXNbZl0gPSB2O1xyXG5cdFx0XHR9XHJcblx0XHRcdFR5cGUub2JqLnRvID0gZnVuY3Rpb24oZnJvbSwgdG8pe1xyXG5cdFx0XHRcdHRvID0gdG8gfHwge307XHJcblx0XHRcdFx0b2JqX21hcChmcm9tLCBtYXAsIHRvKTtcclxuXHRcdFx0XHRyZXR1cm4gdG87XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblx0XHRUeXBlLm9iai5jb3B5ID0gZnVuY3Rpb24obyl7IC8vIGJlY2F1c2UgaHR0cDovL3dlYi5hcmNoaXZlLm9yZy93ZWIvMjAxNDAzMjgyMjQwMjUvaHR0cDovL2pzcGVyZi5jb20vY2xvbmluZy1hbi1vYmplY3QvMlxyXG5cdFx0XHRyZXR1cm4gIW8/IG8gOiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG8pKTsgLy8gaXMgc2hvY2tpbmdseSBmYXN0ZXIgdGhhbiBhbnl0aGluZyBlbHNlLCBhbmQgb3VyIGRhdGEgaGFzIHRvIGJlIGEgc3Vic2V0IG9mIEpTT04gYW55d2F5cyFcclxuXHRcdH1cclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0ZnVuY3Rpb24gZW1wdHkodixpKXsgdmFyIG4gPSB0aGlzLm47XHJcblx0XHRcdFx0aWYobiAmJiAoaSA9PT0gbiB8fCAob2JqX2lzKG4pICYmIG9ial9oYXMobiwgaSkpKSl7IHJldHVybiB9XHJcblx0XHRcdFx0aWYoaSl7IHJldHVybiB0cnVlIH1cclxuXHRcdFx0fVxyXG5cdFx0XHRUeXBlLm9iai5lbXB0eSA9IGZ1bmN0aW9uKG8sIG4pe1xyXG5cdFx0XHRcdGlmKCFvKXsgcmV0dXJuIHRydWUgfVxyXG5cdFx0XHRcdHJldHVybiBvYmpfbWFwKG8sZW1wdHkse246bn0pPyBmYWxzZSA6IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdGZ1bmN0aW9uIHQoayx2KXtcclxuXHRcdFx0XHRpZigyID09PSBhcmd1bWVudHMubGVuZ3RoKXtcclxuXHRcdFx0XHRcdHQuciA9IHQuciB8fCB7fTtcclxuXHRcdFx0XHRcdHQucltrXSA9IHY7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fSB0LnIgPSB0LnIgfHwgW107XHJcblx0XHRcdFx0dC5yLnB1c2goayk7XHJcblx0XHRcdH07XHJcblx0XHRcdHZhciBrZXlzID0gT2JqZWN0LmtleXM7XHJcblx0XHRcdFR5cGUub2JqLm1hcCA9IGZ1bmN0aW9uKGwsIGMsIF8pe1xyXG5cdFx0XHRcdHZhciB1LCBpID0gMCwgeCwgciwgbGwsIGxsZSwgZiA9IGZuX2lzKGMpO1xyXG5cdFx0XHRcdHQuciA9IG51bGw7XHJcblx0XHRcdFx0aWYoa2V5cyAmJiBvYmpfaXMobCkpe1xyXG5cdFx0XHRcdFx0bGwgPSBPYmplY3Qua2V5cyhsKTsgbGxlID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYobGlzdF9pcyhsKSB8fCBsbCl7XHJcblx0XHRcdFx0XHR4ID0gKGxsIHx8IGwpLmxlbmd0aDtcclxuXHRcdFx0XHRcdGZvcig7aSA8IHg7IGkrKyl7XHJcblx0XHRcdFx0XHRcdHZhciBpaSA9IChpICsgVHlwZS5saXN0LmluZGV4KTtcclxuXHRcdFx0XHRcdFx0aWYoZil7XHJcblx0XHRcdFx0XHRcdFx0ciA9IGxsZT8gYy5jYWxsKF8gfHwgdGhpcywgbFtsbFtpXV0sIGxsW2ldLCB0KSA6IGMuY2FsbChfIHx8IHRoaXMsIGxbaV0sIGlpLCB0KTtcclxuXHRcdFx0XHRcdFx0XHRpZihyICE9PSB1KXsgcmV0dXJuIHIgfVxyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdC8vaWYoVHlwZS50ZXN0LmlzKGMsbFtpXSkpeyByZXR1cm4gaWkgfSAvLyBzaG91bGQgaW1wbGVtZW50IGRlZXAgZXF1YWxpdHkgdGVzdGluZyFcclxuXHRcdFx0XHRcdFx0XHRpZihjID09PSBsW2xsZT8gbGxbaV0gOiBpXSl7IHJldHVybiBsbD8gbGxbaV0gOiBpaSB9IC8vIHVzZSB0aGlzIGZvciBub3dcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRmb3IoaSBpbiBsKXtcclxuXHRcdFx0XHRcdFx0aWYoZil7XHJcblx0XHRcdFx0XHRcdFx0aWYob2JqX2hhcyhsLGkpKXtcclxuXHRcdFx0XHRcdFx0XHRcdHIgPSBfPyBjLmNhbGwoXywgbFtpXSwgaSwgdCkgOiBjKGxbaV0sIGksIHQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYociAhPT0gdSl7IHJldHVybiByIH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Ly9pZihhLnRlc3QuaXMoYyxsW2ldKSl7IHJldHVybiBpIH0gLy8gc2hvdWxkIGltcGxlbWVudCBkZWVwIGVxdWFsaXR5IHRlc3RpbmchXHJcblx0XHRcdFx0XHRcdFx0aWYoYyA9PT0gbFtpXSl7IHJldHVybiBpIH0gLy8gdXNlIHRoaXMgZm9yIG5vd1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBmPyB0LnIgOiBUeXBlLmxpc3QuaW5kZXg/IDAgOiAtMTtcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdFR5cGUudGltZSA9IHt9O1xyXG5cdFx0VHlwZS50aW1lLmlzID0gZnVuY3Rpb24odCl7IHJldHVybiB0PyB0IGluc3RhbmNlb2YgRGF0ZSA6ICgrbmV3IERhdGUoKS5nZXRUaW1lKCkpIH1cclxuXHJcblx0XHR2YXIgZm5faXMgPSBUeXBlLmZuLmlzO1xyXG5cdFx0dmFyIGxpc3RfaXMgPSBUeXBlLmxpc3QuaXM7XHJcblx0XHR2YXIgb2JqID0gVHlwZS5vYmosIG9ial9pcyA9IG9iai5pcywgb2JqX2hhcyA9IG9iai5oYXMsIG9ial9tYXAgPSBvYmoubWFwO1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBUeXBlO1xyXG5cdH0pKHJlcXVpcmUsICcuL3R5cGUnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdC8vIE9uIGV2ZW50IGVtaXR0ZXIgZ2VuZXJpYyBqYXZhc2NyaXB0IHV0aWxpdHkuXHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG9udG8odGFnLCBhcmcsIGFzKXtcclxuXHRcdFx0aWYoIXRhZyl7IHJldHVybiB7dG86IG9udG99IH1cclxuXHRcdFx0dmFyIHRhZyA9ICh0aGlzLnRhZyB8fCAodGhpcy50YWcgPSB7fSkpW3RhZ10gfHxcclxuXHRcdFx0KHRoaXMudGFnW3RhZ10gPSB7dGFnOiB0YWcsIHRvOiBvbnRvLl8gPSB7XHJcblx0XHRcdFx0bmV4dDogZnVuY3Rpb24oKXt9XHJcblx0XHRcdH19KTtcclxuXHRcdFx0aWYoYXJnIGluc3RhbmNlb2YgRnVuY3Rpb24pe1xyXG5cdFx0XHRcdHZhciBiZSA9IHtcclxuXHRcdFx0XHRcdG9mZjogb250by5vZmYgfHwgXHJcblx0XHRcdFx0XHQob250by5vZmYgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0XHRpZih0aGlzLm5leHQgPT09IG9udG8uXy5uZXh0KXsgcmV0dXJuICEwIH1cclxuXHRcdFx0XHRcdFx0aWYodGhpcyA9PT0gdGhpcy50aGUubGFzdCl7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy50aGUubGFzdCA9IHRoaXMuYmFjaztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR0aGlzLnRvLmJhY2sgPSB0aGlzLmJhY2s7XHJcblx0XHRcdFx0XHRcdHRoaXMubmV4dCA9IG9udG8uXy5uZXh0O1xyXG5cdFx0XHRcdFx0XHR0aGlzLmJhY2sudG8gPSB0aGlzLnRvO1xyXG5cdFx0XHRcdFx0fSksXHJcblx0XHRcdFx0XHR0bzogb250by5fLFxyXG5cdFx0XHRcdFx0bmV4dDogYXJnLFxyXG5cdFx0XHRcdFx0dGhlOiB0YWcsXHJcblx0XHRcdFx0XHRvbjogdGhpcyxcclxuXHRcdFx0XHRcdGFzOiBhcyxcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdChiZS5iYWNrID0gdGFnLmxhc3QgfHwgdGFnKS50byA9IGJlO1xyXG5cdFx0XHRcdHJldHVybiB0YWcubGFzdCA9IGJlO1xyXG5cdFx0XHR9XHJcblx0XHRcdCh0YWcgPSB0YWcudG8pLm5leHQoYXJnKTtcclxuXHRcdFx0cmV0dXJuIHRhZztcclxuXHRcdH07XHJcblx0fSkocmVxdWlyZSwgJy4vb250bycpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0Ly8gVE9ETzogTmVlZHMgdG8gYmUgcmVkb25lLlxyXG5cdFx0dmFyIE9uID0gcmVxdWlyZSgnLi9vbnRvJyk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gQ2hhaW4oY3JlYXRlLCBvcHQpe1xyXG5cdFx0XHRvcHQgPSBvcHQgfHwge307XHJcblx0XHRcdG9wdC5pZCA9IG9wdC5pZCB8fCAnIyc7XHJcblx0XHRcdG9wdC5yaWQgPSBvcHQucmlkIHx8ICdAJztcclxuXHRcdFx0b3B0LnV1aWQgPSBvcHQudXVpZCB8fCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHJldHVybiAoK25ldyBEYXRlKCkpICsgTWF0aC5yYW5kb20oKTtcclxuXHRcdFx0fTtcclxuXHRcdFx0dmFyIG9uID0gT247Ly9Pbi5zY29wZSgpO1xyXG5cclxuXHRcdFx0b24uc3R1biA9IGZ1bmN0aW9uKGNoYWluKXtcclxuXHRcdFx0XHR2YXIgc3R1biA9IGZ1bmN0aW9uKGV2KXtcclxuXHRcdFx0XHRcdGlmKHN0dW4ub2ZmICYmIHN0dW4gPT09IHRoaXMuc3R1bil7XHJcblx0XHRcdFx0XHRcdHRoaXMuc3R1biA9IG51bGw7XHJcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmKG9uLnN0dW4uc2tpcCl7XHJcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmKGV2KXtcclxuXHRcdFx0XHRcdFx0ZXYuY2IgPSBldi5mbjtcclxuXHRcdFx0XHRcdFx0ZXYub2ZmKCk7XHJcblx0XHRcdFx0XHRcdHJlcy5xdWV1ZS5wdXNoKGV2KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH0sIHJlcyA9IHN0dW4ucmVzID0gZnVuY3Rpb24odG1wLCBhcyl7XHJcblx0XHRcdFx0XHRpZihzdHVuLm9mZil7IHJldHVybiB9XHJcblx0XHRcdFx0XHRpZih0bXAgaW5zdGFuY2VvZiBGdW5jdGlvbil7XHJcblx0XHRcdFx0XHRcdG9uLnN0dW4uc2tpcCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdHRtcC5jYWxsKGFzKTtcclxuXHRcdFx0XHRcdFx0b24uc3R1bi5za2lwID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHN0dW4ub2ZmID0gdHJ1ZTtcclxuXHRcdFx0XHRcdHZhciBpID0gMCwgcSA9IHJlcy5xdWV1ZSwgbCA9IHEubGVuZ3RoLCBhY3Q7XHJcblx0XHRcdFx0XHRyZXMucXVldWUgPSBbXTtcclxuXHRcdFx0XHRcdGlmKHN0dW4gPT09IGF0LnN0dW4pe1xyXG5cdFx0XHRcdFx0XHRhdC5zdHVuID0gbnVsbDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGZvcihpOyBpIDwgbDsgaSsrKXsgYWN0ID0gcVtpXTtcclxuXHRcdFx0XHRcdFx0YWN0LmZuID0gYWN0LmNiO1xyXG5cdFx0XHRcdFx0XHRhY3QuY2IgPSBudWxsO1xyXG5cdFx0XHRcdFx0XHRvbi5zdHVuLnNraXAgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRhY3QuY3R4Lm9uKGFjdC50YWcsIGFjdC5mbiwgYWN0KTtcclxuXHRcdFx0XHRcdFx0b24uc3R1bi5za2lwID0gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSwgYXQgPSBjaGFpbi5fO1xyXG5cdFx0XHRcdHJlcy5iYWNrID0gYXQuc3R1biB8fCAoYXQuYmFja3x8e186e319KS5fLnN0dW47XHJcblx0XHRcdFx0aWYocmVzLmJhY2spe1xyXG5cdFx0XHRcdFx0cmVzLmJhY2submV4dCA9IHN0dW47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJlcy5xdWV1ZSA9IFtdO1xyXG5cdFx0XHRcdGF0LnN0dW4gPSBzdHVuOyBcclxuXHRcdFx0XHRyZXR1cm4gcmVzO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBvbjtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHRcdHJldHVybjtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR2YXIgYXNrID0gb24uYXNrID0gZnVuY3Rpb24oY2IsIGFzKXtcclxuXHRcdFx0XHRpZighYXNrLm9uKXsgYXNrLm9uID0gT24uc2NvcGUoKSB9XHJcblx0XHRcdFx0dmFyIGlkID0gb3B0LnV1aWQoKTtcclxuXHRcdFx0XHRpZihjYil7IGFzay5vbihpZCwgY2IsIGFzKSB9XHJcblx0XHRcdFx0cmV0dXJuIGlkO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFzay5fID0gb3B0LmlkO1xyXG5cdFx0XHRvbi5hY2sgPSBmdW5jdGlvbihhdCwgcmVwbHkpe1xyXG5cdFx0XHRcdGlmKCFhdCB8fCAhcmVwbHkgfHwgIWFzay5vbil7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIGlkID0gYXRbb3B0LmlkXSB8fCBhdDtcclxuXHRcdFx0XHRpZighYXNrLm9uc1tpZF0peyByZXR1cm4gfVxyXG5cdFx0XHRcdGFzay5vbihpZCwgcmVwbHkpO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdG9uLmFjay5fID0gb3B0LnJpZDtcclxuXHJcblxyXG5cdFx0XHRyZXR1cm4gb247XHJcblx0XHRcdHJldHVybjtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHRcdHJldHVybjtcclxuXHRcdFx0b24ub24oJ2V2ZW50JywgZnVuY3Rpb24gZXZlbnQoYWN0KXtcclxuXHRcdFx0XHR2YXIgbGFzdCA9IGFjdC5vbi5sYXN0LCB0bXA7XHJcblx0XHRcdFx0aWYoJ2luJyA9PT0gYWN0LnRhZyAmJiBHdW4uY2hhaW4uY2hhaW4uaW5wdXQgIT09IGFjdC5mbil7IC8vIFRPRE86IEJVRyEgR3VuIGlzIG5vdCBhdmFpbGFibGUgaW4gdGhpcyBtb2R1bGUuXHJcblx0XHRcdFx0XHRpZigodG1wID0gYWN0LmN0eCkgJiYgdG1wLnN0dW4pe1xyXG5cdFx0XHRcdFx0XHRpZih0bXAuc3R1bihhY3QpKXtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoIWxhc3QpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGlmKGFjdC5vbi5tYXApe1xyXG5cdFx0XHRcdFx0dmFyIG1hcCA9IGFjdC5vbi5tYXAsIHY7XHJcblx0XHRcdFx0XHRmb3IodmFyIGYgaW4gbWFwKXsgdiA9IG1hcFtmXTtcclxuXHRcdFx0XHRcdFx0aWYodil7XHJcblx0XHRcdFx0XHRcdFx0ZW1pdCh2LCBhY3QsIGV2ZW50KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0LypcclxuXHRcdFx0XHRcdEd1bi5vYmoubWFwKGFjdC5vbi5tYXAsIGZ1bmN0aW9uKHYsZil7IC8vIFRPRE86IEJVRyEgR3VuIGlzIG5vdCBhdmFpbGFibGUgaW4gdGhpcyBtb2R1bGUuXHJcblx0XHRcdFx0XHRcdC8vZW1pdCh2WzBdLCBhY3QsIGV2ZW50LCB2WzFdKTsgLy8gYmVsb3cgZW5hYmxlcyBtb3JlIGNvbnRyb2xcclxuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcImJvb29vb29vb1wiLCBmLHYpO1xyXG5cdFx0XHRcdFx0XHRlbWl0KHYsIGFjdCwgZXZlbnQpO1xyXG5cdFx0XHRcdFx0XHQvL2VtaXQodlsxXSwgYWN0LCBldmVudCwgdlsyXSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdCovXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGVtaXQobGFzdCwgYWN0LCBldmVudCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGxhc3QgIT09IGFjdC5vbi5sYXN0KXtcclxuXHRcdFx0XHRcdGV2ZW50KGFjdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0ZnVuY3Rpb24gZW1pdChsYXN0LCBhY3QsIGV2ZW50LCBldil7XHJcblx0XHRcdFx0aWYobGFzdCBpbnN0YW5jZW9mIEFycmF5KXtcclxuXHRcdFx0XHRcdGFjdC5mbi5hcHBseShhY3QuYXMsIGxhc3QuY29uY2F0KGV2fHxhY3QpKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0YWN0LmZuLmNhbGwoYWN0LmFzLCBsYXN0LCBldnx8YWN0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8qb24ub24oJ2VtaXQnLCBmdW5jdGlvbihldil7XHJcblx0XHRcdFx0aWYoZXYub24ubWFwKXtcclxuXHRcdFx0XHRcdHZhciBpZCA9IGV2LmFyZy52aWEuZ3VuLl8uaWQgKyBldi5hcmcuZ2V0O1xyXG5cdFx0XHRcdFx0Ly9cclxuXHRcdFx0XHRcdC8vZXYuaWQgPSBldi5pZCB8fCBHdW4udGV4dC5yYW5kb20oNik7XHJcblx0XHRcdFx0XHQvL2V2Lm9uLm1hcFtldi5pZF0gPSBldi5hcmc7XHJcblx0XHRcdFx0XHQvL2V2LnByb3h5ID0gZXYuYXJnWzFdO1xyXG5cdFx0XHRcdFx0Ly9ldi5hcmcgPSBldi5hcmdbMF07XHJcblx0XHRcdFx0XHQvLyBiZWxvdyBnaXZlcyBtb3JlIGNvbnRyb2wuXHJcblx0XHRcdFx0XHRldi5vbi5tYXBbaWRdID0gZXYuYXJnO1xyXG5cdFx0XHRcdFx0Ly9ldi5wcm94eSA9IGV2LmFyZ1syXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZXYub24ubGFzdCA9IGV2LmFyZztcclxuXHRcdFx0fSk7Ki9cclxuXHJcblx0XHRcdG9uLm9uKCdlbWl0JywgZnVuY3Rpb24oZXYpe1xyXG5cdFx0XHRcdHZhciBndW4gPSBldi5hcmcuZ3VuO1xyXG5cdFx0XHRcdGlmKCdpbicgPT09IGV2LnRhZyAmJiBndW4gJiYgIWd1bi5fLnNvdWwpeyAvLyBUT0RPOiBCVUchIFNvdWwgc2hvdWxkIGJlIGF2YWlsYWJsZS4gQ3VycmVudGx5IG5vdCB1c2luZyBpdCB0aG91Z2gsIGJ1dCBzaG91bGQgZW5hYmxlIGl0IChjaGVjayBmb3Igc2lkZSBlZmZlY3RzIGlmIG1hZGUgYXZhaWxhYmxlKS5cclxuXHRcdFx0XHRcdChldi5vbi5tYXAgPSBldi5vbi5tYXAgfHwge30pW2d1bi5fLmlkIHx8IChndW4uXy5pZCA9IE1hdGgucmFuZG9tKCkpXSA9IGV2LmFyZztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZXYub24ubGFzdCA9IGV2LmFyZztcclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBvbjtcclxuXHRcdH1cclxuXHRcdG1vZHVsZS5leHBvcnRzID0gQ2hhaW47XHJcblx0fSkocmVxdWlyZSwgJy4vb25pZnknKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdC8vIEdlbmVyaWMgamF2YXNjcmlwdCBzY2hlZHVsZXIgdXRpbGl0eS5cclxuXHRcdHZhciBUeXBlID0gcmVxdWlyZSgnLi90eXBlJyk7XHJcblx0XHRmdW5jdGlvbiBzKHN0YXRlLCBjYiwgdGltZSl7IC8vIG1heWJlIHVzZSBscnUtY2FjaGU/XHJcblx0XHRcdHMudGltZSA9IHRpbWU7XHJcblx0XHRcdHMud2FpdGluZy5wdXNoKHt3aGVuOiBzdGF0ZSwgZXZlbnQ6IGNiIHx8IGZ1bmN0aW9uKCl7fX0pO1xyXG5cdFx0XHRpZihzLnNvb25lc3QgPCBzdGF0ZSl7IHJldHVybiB9XHJcblx0XHRcdHMuc2V0KHN0YXRlKTtcclxuXHRcdH1cclxuXHRcdHMud2FpdGluZyA9IFtdO1xyXG5cdFx0cy5zb29uZXN0ID0gSW5maW5pdHk7XHJcblx0XHRzLnNvcnQgPSBUeXBlLmxpc3Quc29ydCgnd2hlbicpO1xyXG5cdFx0cy5zZXQgPSBmdW5jdGlvbihmdXR1cmUpe1xyXG5cdFx0XHRpZihJbmZpbml0eSA8PSAocy5zb29uZXN0ID0gZnV0dXJlKSl7IHJldHVybiB9XHJcblx0XHRcdHZhciBub3cgPSBzLnRpbWUoKTtcclxuXHRcdFx0ZnV0dXJlID0gKGZ1dHVyZSA8PSBub3cpPyAwIDogKGZ1dHVyZSAtIG5vdyk7XHJcblx0XHRcdGNsZWFyVGltZW91dChzLmlkKTtcclxuXHRcdFx0cy5pZCA9IHNldFRpbWVvdXQocy5jaGVjaywgZnV0dXJlKTtcclxuXHRcdH1cclxuXHRcdHMuZWFjaCA9IGZ1bmN0aW9uKHdhaXQsIGksIG1hcCl7XHJcblx0XHRcdHZhciBjdHggPSB0aGlzO1xyXG5cdFx0XHRpZighd2FpdCl7IHJldHVybiB9XHJcblx0XHRcdGlmKHdhaXQud2hlbiA8PSBjdHgubm93KXtcclxuXHRcdFx0XHRpZih3YWl0LmV2ZW50IGluc3RhbmNlb2YgRnVuY3Rpb24pe1xyXG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpeyB3YWl0LmV2ZW50KCkgfSwwKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y3R4LnNvb25lc3QgPSAoY3R4LnNvb25lc3QgPCB3YWl0LndoZW4pPyBjdHguc29vbmVzdCA6IHdhaXQud2hlbjtcclxuXHRcdFx0XHRtYXAod2FpdCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHMuY2hlY2sgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgY3R4ID0ge25vdzogcy50aW1lKCksIHNvb25lc3Q6IEluZmluaXR5fTtcclxuXHRcdFx0cy53YWl0aW5nLnNvcnQocy5zb3J0KTtcclxuXHRcdFx0cy53YWl0aW5nID0gVHlwZS5saXN0Lm1hcChzLndhaXRpbmcsIHMuZWFjaCwgY3R4KSB8fCBbXTtcclxuXHRcdFx0cy5zZXQoY3R4LnNvb25lc3QpO1xyXG5cdFx0fVxyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBzO1xyXG5cdH0pKHJlcXVpcmUsICcuL3NjaGVkdWxlJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHQvKiBCYXNlZCBvbiB0aGUgSHlwb3RoZXRpY2FsIEFtbmVzaWEgTWFjaGluZSB0aG91Z2h0IGV4cGVyaW1lbnQgKi9cclxuXHRcdGZ1bmN0aW9uIEhBTShtYWNoaW5lU3RhdGUsIGluY29taW5nU3RhdGUsIGN1cnJlbnRTdGF0ZSwgaW5jb21pbmdWYWx1ZSwgY3VycmVudFZhbHVlKXtcclxuXHRcdFx0aWYobWFjaGluZVN0YXRlIDwgaW5jb21pbmdTdGF0ZSl7XHJcblx0XHRcdFx0cmV0dXJuIHtkZWZlcjogdHJ1ZX07IC8vIHRoZSBpbmNvbWluZyB2YWx1ZSBpcyBvdXRzaWRlIHRoZSBib3VuZGFyeSBvZiB0aGUgbWFjaGluZSdzIHN0YXRlLCBpdCBtdXN0IGJlIHJlcHJvY2Vzc2VkIGluIGFub3RoZXIgc3RhdGUuXHJcblx0XHRcdH1cclxuXHRcdFx0aWYoaW5jb21pbmdTdGF0ZSA8IGN1cnJlbnRTdGF0ZSl7XHJcblx0XHRcdFx0cmV0dXJuIHtoaXN0b3JpY2FsOiB0cnVlfTsgLy8gdGhlIGluY29taW5nIHZhbHVlIGlzIHdpdGhpbiB0aGUgYm91bmRhcnkgb2YgdGhlIG1hY2hpbmUncyBzdGF0ZSwgYnV0IG5vdCB3aXRoaW4gdGhlIHJhbmdlLlxyXG5cclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjdXJyZW50U3RhdGUgPCBpbmNvbWluZ1N0YXRlKXtcclxuXHRcdFx0XHRyZXR1cm4ge2NvbnZlcmdlOiB0cnVlLCBpbmNvbWluZzogdHJ1ZX07IC8vIHRoZSBpbmNvbWluZyB2YWx1ZSBpcyB3aXRoaW4gYm90aCB0aGUgYm91bmRhcnkgYW5kIHRoZSByYW5nZSBvZiB0aGUgbWFjaGluZSdzIHN0YXRlLlxyXG5cclxuXHRcdFx0fVxyXG5cdFx0XHRpZihpbmNvbWluZ1N0YXRlID09PSBjdXJyZW50U3RhdGUpe1xyXG5cdFx0XHRcdGluY29taW5nVmFsdWUgPSBMZXhpY2FsKGluY29taW5nVmFsdWUpIHx8IFwiXCI7XHJcblx0XHRcdFx0Y3VycmVudFZhbHVlID0gTGV4aWNhbChjdXJyZW50VmFsdWUpIHx8IFwiXCI7XHJcblx0XHRcdFx0aWYoaW5jb21pbmdWYWx1ZSA9PT0gY3VycmVudFZhbHVlKXsgLy8gTm90ZTogd2hpbGUgdGhlc2UgYXJlIHByYWN0aWNhbGx5IHRoZSBzYW1lLCB0aGUgZGVsdGFzIGNvdWxkIGJlIHRlY2huaWNhbGx5IGRpZmZlcmVudFxyXG5cdFx0XHRcdFx0cmV0dXJuIHtzdGF0ZTogdHJ1ZX07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8qXHJcblx0XHRcdFx0XHRUaGUgZm9sbG93aW5nIGlzIGEgbmFpdmUgaW1wbGVtZW50YXRpb24sIGJ1dCB3aWxsIGFsd2F5cyB3b3JrLlxyXG5cdFx0XHRcdFx0TmV2ZXIgY2hhbmdlIGl0IHVubGVzcyB5b3UgaGF2ZSBzcGVjaWZpYyBuZWVkcyB0aGF0IGFic29sdXRlbHkgcmVxdWlyZSBpdC5cclxuXHRcdFx0XHRcdElmIGNoYW5nZWQsIHlvdXIgZGF0YSB3aWxsIGRpdmVyZ2UgdW5sZXNzIHlvdSBndWFyYW50ZWUgZXZlcnkgcGVlcidzIGFsZ29yaXRobSBoYXMgYWxzbyBiZWVuIGNoYW5nZWQgdG8gYmUgdGhlIHNhbWUuXHJcblx0XHRcdFx0XHRBcyBhIHJlc3VsdCwgaXQgaXMgaGlnaGx5IGRpc2NvdXJhZ2VkIHRvIG1vZGlmeSBkZXNwaXRlIHRoZSBmYWN0IHRoYXQgaXQgaXMgbmFpdmUsXHJcblx0XHRcdFx0XHRiZWNhdXNlIGNvbnZlcmdlbmNlIChkYXRhIGludGVncml0eSkgaXMgZ2VuZXJhbGx5IG1vcmUgaW1wb3J0YW50LlxyXG5cdFx0XHRcdFx0QW55IGRpZmZlcmVuY2UgaW4gdGhpcyBhbGdvcml0aG0gbXVzdCBiZSBnaXZlbiBhIG5ldyBhbmQgZGlmZmVyZW50IG5hbWUuXHJcblx0XHRcdFx0Ki9cclxuXHRcdFx0XHRpZihpbmNvbWluZ1ZhbHVlIDwgY3VycmVudFZhbHVlKXsgLy8gTGV4aWNhbCBvbmx5IHdvcmtzIG9uIHNpbXBsZSB2YWx1ZSB0eXBlcyFcclxuXHRcdFx0XHRcdHJldHVybiB7Y29udmVyZ2U6IHRydWUsIGN1cnJlbnQ6IHRydWV9O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihjdXJyZW50VmFsdWUgPCBpbmNvbWluZ1ZhbHVlKXsgLy8gTGV4aWNhbCBvbmx5IHdvcmtzIG9uIHNpbXBsZSB2YWx1ZSB0eXBlcyFcclxuXHRcdFx0XHRcdHJldHVybiB7Y29udmVyZ2U6IHRydWUsIGluY29taW5nOiB0cnVlfTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHtlcnI6IFwiSW52YWxpZCBDUkRUIERhdGE6IFwiKyBpbmNvbWluZ1ZhbHVlICtcIiB0byBcIisgY3VycmVudFZhbHVlICtcIiBhdCBcIisgaW5jb21pbmdTdGF0ZSArXCIgdG8gXCIrIGN1cnJlbnRTdGF0ZSArXCIhXCJ9O1xyXG5cdFx0fVxyXG5cdFx0aWYodHlwZW9mIEpTT04gPT09ICd1bmRlZmluZWQnKXtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFxyXG5cdFx0XHRcdCdKU09OIGlzIG5vdCBpbmNsdWRlZCBpbiB0aGlzIGJyb3dzZXIuIFBsZWFzZSBsb2FkIGl0IGZpcnN0OiAnICtcclxuXHRcdFx0XHQnYWpheC5jZG5qcy5jb20vYWpheC9saWJzL2pzb24yLzIwMTEwMjIzL2pzb24yLmpzJ1xyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIExleGljYWwgPSBKU09OLnN0cmluZ2lmeSwgdW5kZWZpbmVkO1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBIQU07XHJcblx0fSkocmVxdWlyZSwgJy4vSEFNJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgVHlwZSA9IHJlcXVpcmUoJy4vdHlwZScpO1xyXG5cdFx0dmFyIFZhbCA9IHt9O1xyXG5cdFx0VmFsLmlzID0gZnVuY3Rpb24odil7IC8vIFZhbGlkIHZhbHVlcyBhcmUgYSBzdWJzZXQgb2YgSlNPTjogbnVsbCwgYmluYXJ5LCBudW1iZXIgKCFJbmZpbml0eSksIHRleHQsIG9yIGEgc291bCByZWxhdGlvbi4gQXJyYXlzIG5lZWQgc3BlY2lhbCBhbGdvcml0aG1zIHRvIGhhbmRsZSBjb25jdXJyZW5jeSwgc28gdGhleSBhcmUgbm90IHN1cHBvcnRlZCBkaXJlY3RseS4gVXNlIGFuIGV4dGVuc2lvbiB0aGF0IHN1cHBvcnRzIHRoZW0gaWYgbmVlZGVkIGJ1dCByZXNlYXJjaCB0aGVpciBwcm9ibGVtcyBmaXJzdC5cclxuXHRcdFx0aWYodiA9PT0gdSl7IHJldHVybiBmYWxzZSB9XHJcblx0XHRcdGlmKHYgPT09IG51bGwpeyByZXR1cm4gdHJ1ZSB9IC8vIFwiZGVsZXRlc1wiLCBudWxsaW5nIG91dCBmaWVsZHMuXHJcblx0XHRcdGlmKHYgPT09IEluZmluaXR5KXsgcmV0dXJuIGZhbHNlIH0gLy8gd2Ugd2FudCB0aGlzIHRvIGJlLCBidXQgSlNPTiBkb2VzIG5vdCBzdXBwb3J0IGl0LCBzYWQgZmFjZS5cclxuXHRcdFx0aWYodGV4dF9pcyh2KSAvLyBieSBcInRleHRcIiB3ZSBtZWFuIHN0cmluZ3MuXHJcblx0XHRcdHx8IGJpX2lzKHYpIC8vIGJ5IFwiYmluYXJ5XCIgd2UgbWVhbiBib29sZWFuLlxyXG5cdFx0XHR8fCBudW1faXModikpeyAvLyBieSBcIm51bWJlclwiIHdlIG1lYW4gaW50ZWdlcnMgb3IgZGVjaW1hbHMuIFxyXG5cdFx0XHRcdHJldHVybiB0cnVlOyAvLyBzaW1wbGUgdmFsdWVzIGFyZSB2YWxpZC5cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gVmFsLnJlbC5pcyh2KSB8fCBmYWxzZTsgLy8gaXMgdGhlIHZhbHVlIGEgc291bCByZWxhdGlvbj8gVGhlbiBpdCBpcyB2YWxpZCBhbmQgcmV0dXJuIGl0LiBJZiBub3QsIGV2ZXJ5dGhpbmcgZWxzZSByZW1haW5pbmcgaXMgYW4gaW52YWxpZCBkYXRhIHR5cGUuIEN1c3RvbSBleHRlbnNpb25zIGNhbiBiZSBidWlsdCBvbiB0b3Agb2YgdGhlc2UgcHJpbWl0aXZlcyB0byBzdXBwb3J0IG90aGVyIHR5cGVzLlxyXG5cdFx0fVxyXG5cdFx0VmFsLnJlbCA9IHtfOiAnIyd9O1xyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRWYWwucmVsLmlzID0gZnVuY3Rpb24odil7IC8vIHRoaXMgZGVmaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhIHNvdWwgcmVsYXRpb24gb3Igbm90LCB0aGV5IGxvb2sgbGlrZSB0aGlzOiB7JyMnOiAnVVVJRCd9XHJcblx0XHRcdFx0aWYodiAmJiB2W3JlbF9dICYmICF2Ll8gJiYgb2JqX2lzKHYpKXsgLy8gbXVzdCBiZSBhbiBvYmplY3QuXHJcblx0XHRcdFx0XHR2YXIgbyA9IHt9O1xyXG5cdFx0XHRcdFx0b2JqX21hcCh2LCBtYXAsIG8pO1xyXG5cdFx0XHRcdFx0aWYoby5pZCl7IC8vIGEgdmFsaWQgaWQgd2FzIGZvdW5kLlxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gby5pZDsgLy8geWF5ISBSZXR1cm4gaXQuXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZTsgLy8gdGhlIHZhbHVlIHdhcyBub3QgYSB2YWxpZCBzb3VsIHJlbGF0aW9uLlxyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcChzLCBmKXsgdmFyIG8gPSB0aGlzOyAvLyBtYXAgb3ZlciB0aGUgb2JqZWN0Li4uXHJcblx0XHRcdFx0aWYoby5pZCl7IHJldHVybiBvLmlkID0gZmFsc2UgfSAvLyBpZiBJRCBpcyBhbHJlYWR5IGRlZmluZWQgQU5EIHdlJ3JlIHN0aWxsIGxvb3BpbmcgdGhyb3VnaCB0aGUgb2JqZWN0LCBpdCBpcyBjb25zaWRlcmVkIGludmFsaWQuXHJcblx0XHRcdFx0aWYoZiA9PSByZWxfICYmIHRleHRfaXMocykpeyAvLyB0aGUgZmllbGQgc2hvdWxkIGJlICcjJyBhbmQgaGF2ZSBhIHRleHQgdmFsdWUuXHJcblx0XHRcdFx0XHRvLmlkID0gczsgLy8gd2UgZm91bmQgdGhlIHNvdWwhXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiBvLmlkID0gZmFsc2U7IC8vIGlmIHRoZXJlIGV4aXN0cyBhbnl0aGluZyBlbHNlIG9uIHRoZSBvYmplY3QgdGhhdCBpc24ndCB0aGUgc291bCwgdGhlbiBpdCBpcyBjb25zaWRlcmVkIGludmFsaWQuXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0VmFsLnJlbC5pZnkgPSBmdW5jdGlvbih0KXsgcmV0dXJuIG9ial9wdXQoe30sIHJlbF8sIHQpIH0gLy8gY29udmVydCBhIHNvdWwgaW50byBhIHJlbGF0aW9uIGFuZCByZXR1cm4gaXQuXHJcblx0XHR2YXIgcmVsXyA9IFZhbC5yZWwuXywgdTtcclxuXHRcdHZhciBiaV9pcyA9IFR5cGUuYmkuaXM7XHJcblx0XHR2YXIgbnVtX2lzID0gVHlwZS5udW0uaXM7XHJcblx0XHR2YXIgdGV4dF9pcyA9IFR5cGUudGV4dC5pcztcclxuXHRcdHZhciBvYmogPSBUeXBlLm9iaiwgb2JqX2lzID0gb2JqLmlzLCBvYmpfcHV0ID0gb2JqLnB1dCwgb2JqX21hcCA9IG9iai5tYXA7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IFZhbDtcclxuXHR9KShyZXF1aXJlLCAnLi92YWwnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBUeXBlID0gcmVxdWlyZSgnLi90eXBlJyk7XHJcblx0XHR2YXIgVmFsID0gcmVxdWlyZSgnLi92YWwnKTtcclxuXHRcdHZhciBOb2RlID0ge186ICdfJ307XHJcblx0XHROb2RlLnNvdWwgPSBmdW5jdGlvbihuLCBvKXsgcmV0dXJuIChuICYmIG4uXyAmJiBuLl9bbyB8fCBzb3VsX10pIH0gLy8gY29udmVuaWVuY2UgZnVuY3Rpb24gdG8gY2hlY2sgdG8gc2VlIGlmIHRoZXJlIGlzIGEgc291bCBvbiBhIG5vZGUgYW5kIHJldHVybiBpdC5cclxuXHRcdE5vZGUuc291bC5pZnkgPSBmdW5jdGlvbihuLCBvKXsgLy8gcHV0IGEgc291bCBvbiBhbiBvYmplY3QuXHJcblx0XHRcdG8gPSAodHlwZW9mIG8gPT09ICdzdHJpbmcnKT8ge3NvdWw6IG99IDogbyB8fCB7fTtcclxuXHRcdFx0biA9IG4gfHwge307IC8vIG1ha2Ugc3VyZSBpdCBleGlzdHMuXHJcblx0XHRcdG4uXyA9IG4uXyB8fCB7fTsgLy8gbWFrZSBzdXJlIG1ldGEgZXhpc3RzLlxyXG5cdFx0XHRuLl9bc291bF9dID0gby5zb3VsIHx8IG4uX1tzb3VsX10gfHwgdGV4dF9yYW5kb20oKTsgLy8gcHV0IHRoZSBzb3VsIG9uIGl0LlxyXG5cdFx0XHRyZXR1cm4gbjtcclxuXHRcdH1cclxuXHRcdE5vZGUuc291bC5fID0gVmFsLnJlbC5fO1xyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHROb2RlLmlzID0gZnVuY3Rpb24obiwgY2IsIGFzKXsgdmFyIHM7IC8vIGNoZWNrcyB0byBzZWUgaWYgYW4gb2JqZWN0IGlzIGEgdmFsaWQgbm9kZS5cclxuXHRcdFx0XHRpZighb2JqX2lzKG4pKXsgcmV0dXJuIGZhbHNlIH0gLy8gbXVzdCBiZSBhbiBvYmplY3QuXHJcblx0XHRcdFx0aWYocyA9IE5vZGUuc291bChuKSl7IC8vIG11c3QgaGF2ZSBhIHNvdWwgb24gaXQuXHJcblx0XHRcdFx0XHRyZXR1cm4gIW9ial9tYXAobiwgbWFwLCB7YXM6YXMsY2I6Y2IsczpzLG46bn0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7IC8vIG5vcGUhIFRoaXMgd2FzIG5vdCBhIHZhbGlkIG5vZGUuXHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbWFwKHYsIGYpeyAvLyB3ZSBpbnZlcnQgdGhpcyBiZWNhdXNlIHRoZSB3YXkgd2UgY2hlY2sgZm9yIHRoaXMgaXMgdmlhIGEgbmVnYXRpb24uXHJcblx0XHRcdFx0aWYoZiA9PT0gTm9kZS5fKXsgcmV0dXJuIH0gLy8gc2tpcCBvdmVyIHRoZSBtZXRhZGF0YS5cclxuXHRcdFx0XHRpZighVmFsLmlzKHYpKXsgcmV0dXJuIHRydWUgfSAvLyBpdCBpcyB0cnVlIHRoYXQgdGhpcyBpcyBhbiBpbnZhbGlkIG5vZGUuXHJcblx0XHRcdFx0aWYodGhpcy5jYil7IHRoaXMuY2IuY2FsbCh0aGlzLmFzLCB2LCBmLCB0aGlzLm4sIHRoaXMucykgfSAvLyBvcHRpb25hbGx5IGNhbGxiYWNrIGVhY2ggZmllbGQvdmFsdWUuXHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdE5vZGUuaWZ5ID0gZnVuY3Rpb24ob2JqLCBvLCBhcyl7IC8vIHJldHVybnMgYSBub2RlIGZyb20gYSBzaGFsbG93IG9iamVjdC5cclxuXHRcdFx0XHRpZighbyl7IG8gPSB7fSB9XHJcblx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgbyA9PT0gJ3N0cmluZycpeyBvID0ge3NvdWw6IG99IH1cclxuXHRcdFx0XHRlbHNlIGlmKG8gaW5zdGFuY2VvZiBGdW5jdGlvbil7IG8gPSB7bWFwOiBvfSB9XHJcblx0XHRcdFx0aWYoby5tYXApeyBvLm5vZGUgPSBvLm1hcC5jYWxsKGFzLCBvYmosIHUsIG8ubm9kZSB8fCB7fSkgfVxyXG5cdFx0XHRcdGlmKG8ubm9kZSA9IE5vZGUuc291bC5pZnkoby5ub2RlIHx8IHt9LCBvKSl7XHJcblx0XHRcdFx0XHRvYmpfbWFwKG9iaiwgbWFwLCB7bzpvLGFzOmFzfSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBvLm5vZGU7IC8vIFRoaXMgd2lsbCBvbmx5IGJlIGEgdmFsaWQgbm9kZSBpZiB0aGUgb2JqZWN0IHdhc24ndCBhbHJlYWR5IGRlZXAhXHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbWFwKHYsIGYpeyB2YXIgbyA9IHRoaXMubywgdG1wLCB1OyAvLyBpdGVyYXRlIG92ZXIgZWFjaCBmaWVsZC92YWx1ZS5cclxuXHRcdFx0XHRpZihvLm1hcCl7XHJcblx0XHRcdFx0XHR0bXAgPSBvLm1hcC5jYWxsKHRoaXMuYXMsIHYsICcnK2YsIG8ubm9kZSk7XHJcblx0XHRcdFx0XHRpZih1ID09PSB0bXApe1xyXG5cdFx0XHRcdFx0XHRvYmpfZGVsKG8ubm9kZSwgZik7XHJcblx0XHRcdFx0XHR9IGVsc2VcclxuXHRcdFx0XHRcdGlmKG8ubm9kZSl7IG8ubm9kZVtmXSA9IHRtcCB9XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKFZhbC5pcyh2KSl7XHJcblx0XHRcdFx0XHRvLm5vZGVbZl0gPSB2O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdHZhciBvYmogPSBUeXBlLm9iaiwgb2JqX2lzID0gb2JqLmlzLCBvYmpfZGVsID0gb2JqLmRlbCwgb2JqX21hcCA9IG9iai5tYXA7XHJcblx0XHR2YXIgdGV4dCA9IFR5cGUudGV4dCwgdGV4dF9yYW5kb20gPSB0ZXh0LnJhbmRvbTtcclxuXHRcdHZhciBzb3VsXyA9IE5vZGUuc291bC5fO1xyXG5cdFx0dmFyIHU7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IE5vZGU7XHJcblx0fSkocmVxdWlyZSwgJy4vbm9kZScpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIFR5cGUgPSByZXF1aXJlKCcuL3R5cGUnKTtcclxuXHRcdHZhciBOb2RlID0gcmVxdWlyZSgnLi9ub2RlJyk7XHJcblx0XHRmdW5jdGlvbiBTdGF0ZSgpe1xyXG5cdFx0XHR2YXIgdDtcclxuXHRcdFx0aWYocGVyZil7XHJcblx0XHRcdFx0dCA9IHN0YXJ0ICsgcGVyZi5ub3coKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0ID0gdGltZSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGxhc3QgPCB0KXtcclxuXHRcdFx0XHRyZXR1cm4gTiA9IDAsIGxhc3QgPSB0ICsgU3RhdGUuZHJpZnQ7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGxhc3QgPSB0ICsgKChOICs9IDEpIC8gRCkgKyBTdGF0ZS5kcmlmdDtcclxuXHRcdH1cclxuXHRcdHZhciB0aW1lID0gVHlwZS50aW1lLmlzLCBsYXN0ID0gLUluZmluaXR5LCBOID0gMCwgRCA9IDEwMDA7IC8vIFdBUk5JTkchIEluIHRoZSBmdXR1cmUsIG9uIG1hY2hpbmVzIHRoYXQgYXJlIEQgdGltZXMgZmFzdGVyIHRoYW4gMjAxNkFEIG1hY2hpbmVzLCB5b3Ugd2lsbCB3YW50IHRvIGluY3JlYXNlIEQgYnkgYW5vdGhlciBzZXZlcmFsIG9yZGVycyBvZiBtYWduaXR1ZGUgc28gdGhlIHByb2Nlc3Npbmcgc3BlZWQgbmV2ZXIgb3V0IHBhY2VzIHRoZSBkZWNpbWFsIHJlc29sdXRpb24gKGluY3JlYXNpbmcgYW4gaW50ZWdlciBlZmZlY3RzIHRoZSBzdGF0ZSBhY2N1cmFjeSkuXHJcblx0XHR2YXIgcGVyZiA9ICh0eXBlb2YgcGVyZm9ybWFuY2UgIT09ICd1bmRlZmluZWQnKT8gKHBlcmZvcm1hbmNlLnRpbWluZyAmJiBwZXJmb3JtYW5jZSkgOiBmYWxzZSwgc3RhcnQgPSAocGVyZiAmJiBwZXJmLnRpbWluZyAmJiBwZXJmLnRpbWluZy5uYXZpZ2F0aW9uU3RhcnQpIHx8IChwZXJmID0gZmFsc2UpO1xyXG5cdFx0U3RhdGUuXyA9ICc+JztcclxuXHRcdFN0YXRlLmRyaWZ0ID0gMDtcclxuXHRcdFN0YXRlLmlzID0gZnVuY3Rpb24obiwgZiwgbyl7IC8vIGNvbnZlbmllbmNlIGZ1bmN0aW9uIHRvIGdldCB0aGUgc3RhdGUgb24gYSBmaWVsZCBvbiBhIG5vZGUgYW5kIHJldHVybiBpdC5cclxuXHRcdFx0dmFyIHRtcCA9IChmICYmIG4gJiYgbltOX10gJiYgbltOX11bU3RhdGUuX10pIHx8IG87XHJcblx0XHRcdGlmKCF0bXApeyByZXR1cm4gfVxyXG5cdFx0XHRyZXR1cm4gbnVtX2lzKHRtcCA9IHRtcFtmXSk/IHRtcCA6IC1JbmZpbml0eTtcclxuXHRcdH1cclxuXHRcdFN0YXRlLmlmeSA9IGZ1bmN0aW9uKG4sIGYsIHMsIHYsIHNvdWwpeyAvLyBwdXQgYSBmaWVsZCdzIHN0YXRlIG9uIGEgbm9kZS5cclxuXHRcdFx0aWYoIW4gfHwgIW5bTl9dKXsgLy8gcmVqZWN0IGlmIGl0IGlzIG5vdCBub2RlLWxpa2UuXHJcblx0XHRcdFx0aWYoIXNvdWwpeyAvLyB1bmxlc3MgdGhleSBwYXNzZWQgYSBzb3VsXHJcblx0XHRcdFx0XHRyZXR1cm47IFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuID0gTm9kZS5zb3VsLmlmeShuLCBzb3VsKTsgLy8gdGhlbiBtYWtlIGl0IHNvIVxyXG5cdFx0XHR9IFxyXG5cdFx0XHR2YXIgdG1wID0gb2JqX2FzKG5bTl9dLCBTdGF0ZS5fKTsgLy8gZ3JhYiB0aGUgc3RhdGVzIGRhdGEuXHJcblx0XHRcdGlmKHUgIT09IGYgJiYgZiAhPT0gTl8pe1xyXG5cdFx0XHRcdGlmKG51bV9pcyhzKSl7XHJcblx0XHRcdFx0XHR0bXBbZl0gPSBzOyAvLyBhZGQgdGhlIHZhbGlkIHN0YXRlLlxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZih1ICE9PSB2KXsgLy8gTm90ZTogTm90IGl0cyBqb2IgdG8gY2hlY2sgZm9yIHZhbGlkIHZhbHVlcyFcclxuXHRcdFx0XHRcdG5bZl0gPSB2O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gbjtcclxuXHRcdH1cclxuXHRcdFN0YXRlLnRvID0gZnVuY3Rpb24oZnJvbSwgZiwgdG8pe1xyXG5cdFx0XHR2YXIgdmFsID0gZnJvbVtmXTtcclxuXHRcdFx0aWYob2JqX2lzKHZhbCkpe1xyXG5cdFx0XHRcdHZhbCA9IG9ial9jb3B5KHZhbCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIFN0YXRlLmlmeSh0bywgZiwgU3RhdGUuaXMoZnJvbSwgZiksIHZhbCwgTm9kZS5zb3VsKGZyb20pKTtcclxuXHRcdH1cclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0U3RhdGUubWFwID0gZnVuY3Rpb24oY2IsIHMsIGFzKXsgdmFyIHU7IC8vIGZvciB1c2Ugd2l0aCBOb2RlLmlmeVxyXG5cdFx0XHRcdHZhciBvID0gb2JqX2lzKG8gPSBjYiB8fCBzKT8gbyA6IG51bGw7XHJcblx0XHRcdFx0Y2IgPSBmbl9pcyhjYiA9IGNiIHx8IHMpPyBjYiA6IG51bGw7XHJcblx0XHRcdFx0aWYobyAmJiAhY2Ipe1xyXG5cdFx0XHRcdFx0cyA9IG51bV9pcyhzKT8gcyA6IFN0YXRlKCk7XHJcblx0XHRcdFx0XHRvW05fXSA9IG9bTl9dIHx8IHt9O1xyXG5cdFx0XHRcdFx0b2JqX21hcChvLCBtYXAsIHtvOm8sczpzfSk7XHJcblx0XHRcdFx0XHRyZXR1cm4gbztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YXMgPSBhcyB8fCBvYmpfaXMocyk/IHMgOiB1O1xyXG5cdFx0XHRcdHMgPSBudW1faXMocyk/IHMgOiBTdGF0ZSgpO1xyXG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbih2LCBmLCBvLCBvcHQpe1xyXG5cdFx0XHRcdFx0aWYoIWNiKXtcclxuXHRcdFx0XHRcdFx0bWFwLmNhbGwoe286IG8sIHM6IHN9LCB2LGYpO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNiLmNhbGwoYXMgfHwgdGhpcyB8fCB7fSwgdiwgZiwgbywgb3B0KTtcclxuXHRcdFx0XHRcdGlmKG9ial9oYXMobyxmKSAmJiB1ID09PSBvW2ZdKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdG1hcC5jYWxsKHtvOiBvLCBzOiBzfSwgdixmKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbWFwKHYsZil7XHJcblx0XHRcdFx0aWYoTl8gPT09IGYpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFN0YXRlLmlmeSh0aGlzLm8sIGYsIHRoaXMucykgO1xyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0dmFyIG9iaiA9IFR5cGUub2JqLCBvYmpfYXMgPSBvYmouYXMsIG9ial9oYXMgPSBvYmouaGFzLCBvYmpfaXMgPSBvYmouaXMsIG9ial9tYXAgPSBvYmoubWFwLCBvYmpfY29weSA9IG9iai5jb3B5O1xyXG5cdFx0dmFyIG51bSA9IFR5cGUubnVtLCBudW1faXMgPSBudW0uaXM7XHJcblx0XHR2YXIgZm4gPSBUeXBlLmZuLCBmbl9pcyA9IGZuLmlzO1xyXG5cdFx0dmFyIE5fID0gTm9kZS5fLCB1O1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBTdGF0ZTtcclxuXHR9KShyZXF1aXJlLCAnLi9zdGF0ZScpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIFR5cGUgPSByZXF1aXJlKCcuL3R5cGUnKTtcclxuXHRcdHZhciBWYWwgPSByZXF1aXJlKCcuL3ZhbCcpO1xyXG5cdFx0dmFyIE5vZGUgPSByZXF1aXJlKCcuL25vZGUnKTtcclxuXHRcdHZhciBHcmFwaCA9IHt9O1xyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRHcmFwaC5pcyA9IGZ1bmN0aW9uKGcsIGNiLCBmbiwgYXMpeyAvLyBjaGVja3MgdG8gc2VlIGlmIGFuIG9iamVjdCBpcyBhIHZhbGlkIGdyYXBoLlxyXG5cdFx0XHRcdGlmKCFnIHx8ICFvYmpfaXMoZykgfHwgb2JqX2VtcHR5KGcpKXsgcmV0dXJuIGZhbHNlIH0gLy8gbXVzdCBiZSBhbiBvYmplY3QuXHJcblx0XHRcdFx0cmV0dXJuICFvYmpfbWFwKGcsIG1hcCwge2NiOmNiLGZuOmZuLGFzOmFzfSk7IC8vIG1ha2VzIHN1cmUgaXQgd2Fzbid0IGFuIGVtcHR5IG9iamVjdC5cclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBtYXAobiwgcyl7IC8vIHdlIGludmVydCB0aGlzIGJlY2F1c2UgdGhlIHdheSc/IHdlIGNoZWNrIGZvciB0aGlzIGlzIHZpYSBhIG5lZ2F0aW9uLlxyXG5cdFx0XHRcdGlmKCFuIHx8IHMgIT09IE5vZGUuc291bChuKSB8fCAhTm9kZS5pcyhuLCB0aGlzLmZuLCB0aGlzLmFzKSl7IHJldHVybiB0cnVlIH0gLy8gaXQgaXMgdHJ1ZSB0aGF0IHRoaXMgaXMgYW4gaW52YWxpZCBncmFwaC5cclxuXHRcdFx0XHRpZighdGhpcy5jYil7IHJldHVybiB9XHJcblx0XHRcdFx0bmYubiA9IG47IG5mLmFzID0gdGhpcy5hczsgLy8gc2VxdWVudGlhbCByYWNlIGNvbmRpdGlvbnMgYXJlbid0IHJhY2VzLlxyXG5cdFx0XHRcdHRoaXMuY2IuY2FsbChuZi5hcywgbiwgcywgbmYpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG5mKGZuKXsgLy8gb3B0aW9uYWwgY2FsbGJhY2sgZm9yIGVhY2ggbm9kZS5cclxuXHRcdFx0XHRpZihmbil7IE5vZGUuaXMobmYubiwgZm4sIG5mLmFzKSB9IC8vIHdoZXJlIHdlIHRoZW4gaGF2ZSBhbiBvcHRpb25hbCBjYWxsYmFjayBmb3IgZWFjaCBmaWVsZC92YWx1ZS5cclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0R3JhcGguaWZ5ID0gZnVuY3Rpb24ob2JqLCBlbnYsIGFzKXtcclxuXHRcdFx0XHR2YXIgYXQgPSB7cGF0aDogW10sIG9iajogb2JqfTtcclxuXHRcdFx0XHRpZighZW52KXtcclxuXHRcdFx0XHRcdGVudiA9IHt9O1xyXG5cdFx0XHRcdH0gZWxzZVxyXG5cdFx0XHRcdGlmKHR5cGVvZiBlbnYgPT09ICdzdHJpbmcnKXtcclxuXHRcdFx0XHRcdGVudiA9IHtzb3VsOiBlbnZ9O1xyXG5cdFx0XHRcdH0gZWxzZVxyXG5cdFx0XHRcdGlmKGVudiBpbnN0YW5jZW9mIEZ1bmN0aW9uKXtcclxuXHRcdFx0XHRcdGVudi5tYXAgPSBlbnY7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGVudi5zb3VsKXtcclxuXHRcdFx0XHRcdGF0LnJlbCA9IFZhbC5yZWwuaWZ5KGVudi5zb3VsKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZW52LmdyYXBoID0gZW52LmdyYXBoIHx8IHt9O1xyXG5cdFx0XHRcdGVudi5zZWVuID0gZW52LnNlZW4gfHwgW107XHJcblx0XHRcdFx0ZW52LmFzID0gZW52LmFzIHx8IGFzO1xyXG5cdFx0XHRcdG5vZGUoZW52LCBhdCk7XHJcblx0XHRcdFx0ZW52LnJvb3QgPSBhdC5ub2RlO1xyXG5cdFx0XHRcdHJldHVybiBlbnYuZ3JhcGg7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbm9kZShlbnYsIGF0KXsgdmFyIHRtcDtcclxuXHRcdFx0XHRpZih0bXAgPSBzZWVuKGVudiwgYXQpKXsgcmV0dXJuIHRtcCB9XHJcblx0XHRcdFx0YXQuZW52ID0gZW52O1xyXG5cdFx0XHRcdGF0LnNvdWwgPSBzb3VsO1xyXG5cdFx0XHRcdGlmKE5vZGUuaWZ5KGF0Lm9iaiwgbWFwLCBhdCkpe1xyXG5cdFx0XHRcdFx0Ly9hdC5yZWwgPSBhdC5yZWwgfHwgVmFsLnJlbC5pZnkoTm9kZS5zb3VsKGF0Lm5vZGUpKTtcclxuXHRcdFx0XHRcdGVudi5ncmFwaFtWYWwucmVsLmlzKGF0LnJlbCldID0gYXQubm9kZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGF0O1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcCh2LGYsbil7XHJcblx0XHRcdFx0dmFyIGF0ID0gdGhpcywgZW52ID0gYXQuZW52LCBpcywgdG1wO1xyXG5cdFx0XHRcdGlmKE5vZGUuXyA9PT0gZiAmJiBvYmpfaGFzKHYsVmFsLnJlbC5fKSl7XHJcblx0XHRcdFx0XHRyZXR1cm4gbi5fOyAvLyBUT0RPOiBCdWc/XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKCEoaXMgPSB2YWxpZCh2LGYsbiwgYXQsZW52KSkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGlmKCFmKXtcclxuXHRcdFx0XHRcdGF0Lm5vZGUgPSBhdC5ub2RlIHx8IG4gfHwge307XHJcblx0XHRcdFx0XHRpZihvYmpfaGFzKHYsIE5vZGUuXykpe1xyXG5cdFx0XHRcdFx0XHRhdC5ub2RlLl8gPSBvYmpfY29weSh2Ll8pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YXQubm9kZSA9IE5vZGUuc291bC5pZnkoYXQubm9kZSwgVmFsLnJlbC5pcyhhdC5yZWwpKTtcclxuXHRcdFx0XHRcdGF0LnJlbCA9IGF0LnJlbCB8fCBWYWwucmVsLmlmeShOb2RlLnNvdWwoYXQubm9kZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZih0bXAgPSBlbnYubWFwKXtcclxuXHRcdFx0XHRcdHRtcC5jYWxsKGVudi5hcyB8fCB7fSwgdixmLG4sIGF0KTtcclxuXHRcdFx0XHRcdGlmKG9ial9oYXMobixmKSl7XHJcblx0XHRcdFx0XHRcdHYgPSBuW2ZdO1xyXG5cdFx0XHRcdFx0XHRpZih1ID09PSB2KXtcclxuXHRcdFx0XHRcdFx0XHRvYmpfZGVsKG4sIGYpO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZighKGlzID0gdmFsaWQodixmLG4sIGF0LGVudikpKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoIWYpeyByZXR1cm4gYXQubm9kZSB9XHJcblx0XHRcdFx0aWYodHJ1ZSA9PT0gaXMpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHY7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRtcCA9IG5vZGUoZW52LCB7b2JqOiB2LCBwYXRoOiBhdC5wYXRoLmNvbmNhdChmKX0pO1xyXG5cdFx0XHRcdGlmKCF0bXAubm9kZSl7IHJldHVybiB9XHJcblx0XHRcdFx0cmV0dXJuIHRtcC5yZWw7IC8veycjJzogTm9kZS5zb3VsKHRtcC5ub2RlKX07XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gc291bChpZCl7IHZhciBhdCA9IHRoaXM7XHJcblx0XHRcdFx0dmFyIHByZXYgPSBWYWwucmVsLmlzKGF0LnJlbCksIGdyYXBoID0gYXQuZW52LmdyYXBoO1xyXG5cdFx0XHRcdGF0LnJlbCA9IGF0LnJlbCB8fCBWYWwucmVsLmlmeShpZCk7XHJcblx0XHRcdFx0YXQucmVsW1ZhbC5yZWwuX10gPSBpZDtcclxuXHRcdFx0XHRpZihhdC5ub2RlICYmIGF0Lm5vZGVbTm9kZS5fXSl7XHJcblx0XHRcdFx0XHRhdC5ub2RlW05vZGUuX11bVmFsLnJlbC5fXSA9IGlkO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihvYmpfaGFzKGdyYXBoLCBwcmV2KSl7XHJcblx0XHRcdFx0XHRncmFwaFtpZF0gPSBncmFwaFtwcmV2XTtcclxuXHRcdFx0XHRcdG9ial9kZWwoZ3JhcGgsIHByZXYpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiB2YWxpZCh2LGYsbiwgYXQsZW52KXsgdmFyIHRtcDtcclxuXHRcdFx0XHRpZihWYWwuaXModikpeyByZXR1cm4gdHJ1ZSB9XHJcblx0XHRcdFx0aWYob2JqX2lzKHYpKXsgcmV0dXJuIDEgfVxyXG5cdFx0XHRcdGlmKHRtcCA9IGVudi5pbnZhbGlkKXtcclxuXHRcdFx0XHRcdHYgPSB0bXAuY2FsbChlbnYuYXMgfHwge30sIHYsZixuKTtcclxuXHRcdFx0XHRcdHJldHVybiB2YWxpZCh2LGYsbiwgYXQsZW52KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZW52LmVyciA9IFwiSW52YWxpZCB2YWx1ZSBhdCAnXCIgKyBhdC5wYXRoLmNvbmNhdChmKS5qb2luKCcuJykgKyBcIichXCI7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gc2VlbihlbnYsIGF0KXtcclxuXHRcdFx0XHR2YXIgYXJyID0gZW52LnNlZW4sIGkgPSBhcnIubGVuZ3RoLCBoYXM7XHJcblx0XHRcdFx0d2hpbGUoaS0tKXsgaGFzID0gYXJyW2ldO1xyXG5cdFx0XHRcdFx0aWYoYXQub2JqID09PSBoYXMub2JqKXsgcmV0dXJuIGhhcyB9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGFyci5wdXNoKGF0KTtcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdEdyYXBoLm5vZGUgPSBmdW5jdGlvbihub2RlKXtcclxuXHRcdFx0dmFyIHNvdWwgPSBOb2RlLnNvdWwobm9kZSk7XHJcblx0XHRcdGlmKCFzb3VsKXsgcmV0dXJuIH1cclxuXHRcdFx0cmV0dXJuIG9ial9wdXQoe30sIHNvdWwsIG5vZGUpO1xyXG5cdFx0fVxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRHcmFwaC50byA9IGZ1bmN0aW9uKGdyYXBoLCByb290LCBvcHQpe1xyXG5cdFx0XHRcdGlmKCFncmFwaCl7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIG9iaiA9IHt9O1xyXG5cdFx0XHRcdG9wdCA9IG9wdCB8fCB7c2Vlbjoge319O1xyXG5cdFx0XHRcdG9ial9tYXAoZ3JhcGhbcm9vdF0sIG1hcCwge29iajpvYmosIGdyYXBoOiBncmFwaCwgb3B0OiBvcHR9KTtcclxuXHRcdFx0XHRyZXR1cm4gb2JqO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcCh2LGYpeyB2YXIgdG1wLCBvYmo7XHJcblx0XHRcdFx0aWYoTm9kZS5fID09PSBmKXtcclxuXHRcdFx0XHRcdGlmKG9ial9lbXB0eSh2LCBWYWwucmVsLl8pKXtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dGhpcy5vYmpbZl0gPSBvYmpfY29weSh2KTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoISh0bXAgPSBWYWwucmVsLmlzKHYpKSl7XHJcblx0XHRcdFx0XHR0aGlzLm9ialtmXSA9IHY7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKG9iaiA9IHRoaXMub3B0LnNlZW5bdG1wXSl7XHJcblx0XHRcdFx0XHR0aGlzLm9ialtmXSA9IG9iajtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5vYmpbZl0gPSB0aGlzLm9wdC5zZWVuW3RtcF0gPSBHcmFwaC50byh0aGlzLmdyYXBoLCB0bXAsIHRoaXMub3B0KTtcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdHZhciBmbl9pcyA9IFR5cGUuZm4uaXM7XHJcblx0XHR2YXIgb2JqID0gVHlwZS5vYmosIG9ial9pcyA9IG9iai5pcywgb2JqX2RlbCA9IG9iai5kZWwsIG9ial9oYXMgPSBvYmouaGFzLCBvYmpfZW1wdHkgPSBvYmouZW1wdHksIG9ial9wdXQgPSBvYmoucHV0LCBvYmpfbWFwID0gb2JqLm1hcCwgb2JqX2NvcHkgPSBvYmouY29weTtcclxuXHRcdHZhciB1O1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBHcmFwaDtcclxuXHR9KShyZXF1aXJlLCAnLi9ncmFwaCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIFR5cGUgPSByZXF1aXJlKCcuL3R5cGUnKTtcclxuXHRcdGZ1bmN0aW9uIER1cCgpe1xyXG5cdFx0XHR0aGlzLmNhY2hlID0ge307XHJcblx0XHR9XHJcblx0XHREdXAucHJvdG90eXBlLnRyYWNrID0gZnVuY3Rpb24oaWQpe1xyXG5cdFx0XHR0aGlzLmNhY2hlW2lkXSA9IFR5cGUudGltZS5pcygpO1xyXG5cdFx0XHRpZiAoIXRoaXMudG8pIHtcclxuXHRcdFx0XHR0aGlzLmdjKCk7IC8vIEVuZ2FnZSBHQy5cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gaWQ7XHJcblx0XHR9O1xyXG5cdFx0RHVwLnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGlkKXtcclxuXHRcdFx0Ly8gSGF2ZSB3ZSBzZWVuIHRoaXMgSUQgcmVjZW50bHk/XHJcblx0XHRcdHJldHVybiBUeXBlLm9iai5oYXModGhpcy5jYWNoZSwgaWQpPyB0aGlzLnRyYWNrKGlkKSA6IGZhbHNlOyAvLyBJbXBvcnRhbnQsIGJ1bXAgdGhlIElEJ3MgbGl2ZWxpbmVzcyBpZiBpdCBoYXMgYWxyZWFkeSBiZWVuIHNlZW4gYmVmb3JlIC0gdGhpcyBpcyBjcml0aWNhbCB0byBzdG9wcGluZyBicm9hZGNhc3Qgc3Rvcm1zLlxyXG5cdFx0fVxyXG5cdFx0RHVwLnByb3RvdHlwZS5nYyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBkZSA9IHRoaXMsIG5vdyA9IFR5cGUudGltZS5pcygpLCBvbGRlc3QgPSBub3csIG1heEFnZSA9IDUgKiA2MCAqIDEwMDA7XHJcblx0XHRcdC8vIFRPRE86IEd1bi5zY2hlZHVsZXIgYWxyZWFkeSBkb2VzIHRoaXM/IFJldXNlIHRoYXQuXHJcblx0XHRcdFR5cGUub2JqLm1hcChkZS5jYWNoZSwgZnVuY3Rpb24odGltZSwgaWQpe1xyXG5cdFx0XHRcdG9sZGVzdCA9IE1hdGgubWluKG5vdywgdGltZSk7XHJcblx0XHRcdFx0aWYgKChub3cgLSB0aW1lKSA8IG1heEFnZSl7IHJldHVybiB9XHJcblx0XHRcdFx0VHlwZS5vYmouZGVsKGRlLmNhY2hlLCBpZCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHR2YXIgZG9uZSA9IFR5cGUub2JqLmVtcHR5KGRlLmNhY2hlKTtcclxuXHRcdFx0aWYoZG9uZSl7XHJcblx0XHRcdFx0ZGUudG8gPSBudWxsOyAvLyBEaXNlbmdhZ2UgR0MuXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBlbGFwc2VkID0gbm93IC0gb2xkZXN0OyAvLyBKdXN0IGhvdyBvbGQ/XHJcblx0XHRcdHZhciBuZXh0R0MgPSBtYXhBZ2UgLSBlbGFwc2VkOyAvLyBIb3cgbG9uZyBiZWZvcmUgaXQncyB0b28gb2xkP1xyXG5cdFx0XHRkZS50byA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgZGUuZ2MoKSB9LCBuZXh0R0MpOyAvLyBTY2hlZHVsZSB0aGUgbmV4dCBHQyBldmVudC5cclxuXHRcdH1cclxuXHRcdG1vZHVsZS5leHBvcnRzID0gRHVwO1xyXG5cdH0pKHJlcXVpcmUsICcuL2R1cCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cclxuXHRcdGZ1bmN0aW9uIEd1bihvKXtcclxuXHRcdFx0aWYobyBpbnN0YW5jZW9mIEd1bil7IHJldHVybiAodGhpcy5fID0ge2d1bjogdGhpc30pLmd1biB9XHJcblx0XHRcdGlmKCEodGhpcyBpbnN0YW5jZW9mIEd1bikpeyByZXR1cm4gbmV3IEd1bihvKSB9XHJcblx0XHRcdHJldHVybiBHdW4uY3JlYXRlKHRoaXMuXyA9IHtndW46IHRoaXMsIG9wdDogb30pO1xyXG5cdFx0fVxyXG5cclxuXHRcdEd1bi5pcyA9IGZ1bmN0aW9uKGd1bil7IHJldHVybiAoZ3VuIGluc3RhbmNlb2YgR3VuKSB9XHJcblxyXG5cdFx0R3VuLnZlcnNpb24gPSAwLjc7XHJcblxyXG5cdFx0R3VuLmNoYWluID0gR3VuLnByb3RvdHlwZTtcclxuXHRcdEd1bi5jaGFpbi50b0pTT04gPSBmdW5jdGlvbigpe307XHJcblxyXG5cdFx0dmFyIFR5cGUgPSByZXF1aXJlKCcuL3R5cGUnKTtcclxuXHRcdFR5cGUub2JqLnRvKFR5cGUsIEd1bik7XHJcblx0XHRHdW4uSEFNID0gcmVxdWlyZSgnLi9IQU0nKTtcclxuXHRcdEd1bi52YWwgPSByZXF1aXJlKCcuL3ZhbCcpO1xyXG5cdFx0R3VuLm5vZGUgPSByZXF1aXJlKCcuL25vZGUnKTtcclxuXHRcdEd1bi5zdGF0ZSA9IHJlcXVpcmUoJy4vc3RhdGUnKTtcclxuXHRcdEd1bi5ncmFwaCA9IHJlcXVpcmUoJy4vZ3JhcGgnKTtcclxuXHRcdEd1bi5kdXAgPSByZXF1aXJlKCcuL2R1cCcpO1xyXG5cdFx0R3VuLnNjaGVkdWxlID0gcmVxdWlyZSgnLi9zY2hlZHVsZScpO1xyXG5cdFx0R3VuLm9uID0gcmVxdWlyZSgnLi9vbmlmeScpKCk7XHJcblx0XHRcclxuXHRcdEd1bi5fID0geyAvLyBzb21lIHJlc2VydmVkIGtleSB3b3JkcywgdGhlc2UgYXJlIG5vdCB0aGUgb25seSBvbmVzLlxyXG5cdFx0XHRub2RlOiBHdW4ubm9kZS5fIC8vIGFsbCBtZXRhZGF0YSBvZiBhIG5vZGUgaXMgc3RvcmVkIGluIHRoZSBtZXRhIHByb3BlcnR5IG9uIHRoZSBub2RlLlxyXG5cdFx0XHQsc291bDogR3VuLnZhbC5yZWwuXyAvLyBhIHNvdWwgaXMgYSBVVUlEIG9mIGEgbm9kZSBidXQgaXQgYWx3YXlzIHBvaW50cyB0byB0aGUgXCJsYXRlc3RcIiBkYXRhIGtub3duLlxyXG5cdFx0XHQsc3RhdGU6IEd1bi5zdGF0ZS5fIC8vIG90aGVyIHRoYW4gdGhlIHNvdWwsIHdlIHN0b3JlIEhBTSBtZXRhZGF0YS5cclxuXHRcdFx0LGZpZWxkOiAnLicgLy8gYSBmaWVsZCBpcyBhIHByb3BlcnR5IG9uIGEgbm9kZSB3aGljaCBwb2ludHMgdG8gYSB2YWx1ZS5cclxuXHRcdFx0LHZhbHVlOiAnPScgLy8gdGhlIHByaW1pdGl2ZSB2YWx1ZS5cclxuXHRcdH1cclxuXHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdEd1bi5jcmVhdGUgPSBmdW5jdGlvbihhdCl7XHJcblx0XHRcdFx0YXQub24gPSBhdC5vbiB8fCBHdW4ub247XHJcblx0XHRcdFx0YXQucm9vdCA9IGF0LnJvb3QgfHwgYXQuZ3VuO1xyXG5cdFx0XHRcdGF0LmdyYXBoID0gYXQuZ3JhcGggfHwge307XHJcblx0XHRcdFx0YXQuZHVwID0gYXQuZHVwIHx8IG5ldyBHdW4uZHVwO1xyXG5cdFx0XHRcdGF0LmFzayA9IEd1bi5vbi5hc2s7XHJcblx0XHRcdFx0YXQuYWNrID0gR3VuLm9uLmFjaztcclxuXHRcdFx0XHR2YXIgZ3VuID0gYXQuZ3VuLm9wdChhdC5vcHQpO1xyXG5cdFx0XHRcdGlmKCFhdC5vbmNlKXtcclxuXHRcdFx0XHRcdGF0Lm9uKCdpbicsIHJvb3QsIGF0KTtcclxuXHRcdFx0XHRcdGF0Lm9uKCdvdXQnLCByb290LCBhdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGF0Lm9uY2UgPSAxO1xyXG5cdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gcm9vdChhdCl7XHJcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcImFkZCB0by5uZXh0KGF0KVwiKTsgLy8gVE9ETzogQlVHISEhXHJcblx0XHRcdFx0dmFyIGV2ID0gdGhpcywgY2F0ID0gZXYuYXMsIGNvYXQsIHRtcDtcclxuXHRcdFx0XHRpZighYXQuZ3VuKXsgYXQuZ3VuID0gY2F0Lmd1biB9XHJcblx0XHRcdFx0aWYoISh0bXAgPSBhdFsnIyddKSl7IHRtcCA9IGF0WycjJ10gPSBHdW4udGV4dC5yYW5kb20oKSB9IC8vIFRPRE86IFVzZSB3aGF0IGlzIHVzZWQgb3RoZXIgcGxhY2VzIGluc3RlYWQuXHJcblx0XHRcdFx0aWYoY2F0LmR1cC5jaGVjayh0bXApKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRjYXQuZHVwLnRyYWNrKHRtcCk7XHJcblx0XHRcdFx0Y29hdCA9IG9ial90byhhdCwge2d1bjogY2F0Lmd1bn0pO1xyXG5cdFx0XHRcdGlmKCFjYXQuYWNrKGF0WydAJ10sIGF0KSl7XHJcblx0XHRcdFx0XHRpZihhdC5nZXQpe1xyXG5cdFx0XHRcdFx0XHQvL0d1bi5vbi5HRVQoY29hdCk7XHJcblx0XHRcdFx0XHRcdEd1bi5vbignZ2V0JywgY29hdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZihhdC5wdXQpe1xyXG5cdFx0XHRcdFx0XHQvL0d1bi5vbi5QVVQoY29hdCk7XHJcblx0XHRcdFx0XHRcdEd1bi5vbigncHV0JywgY29hdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdEd1bi5vbignb3V0JywgY29hdCk7XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRHdW4ub24oJ3B1dCcsIGZ1bmN0aW9uKGF0KXtcclxuXHRcdFx0Ly9HdW4ub24uUFVUID0gZnVuY3Rpb24oYXQpe1xyXG5cdFx0XHRcdGlmKCFhdFsnIyddKXsgcmV0dXJuIHRoaXMudG8ubmV4dChhdCkgfSAvLyBmb3IgdGVzdHMuIC8vIFRPRE86IFJFTU9WRSBUSElTIVxyXG5cdFx0XHRcdHZhciBldiA9IHRoaXMsIGN0eCA9IHtndW46IGF0Lmd1biwgZ3JhcGg6IGF0Lmd1bi5fLmdyYXBoLCBwdXQ6IHt9LCBtYXA6IHt9LCBtYWNoaW5lOiBHdW4uc3RhdGUoKX07XHJcblx0XHRcdFx0aWYoIUd1bi5ncmFwaC5pcyhhdC5wdXQsIG51bGwsIHZlcmlmeSwgY3R4KSl7IGN0eC5lcnIgPSBcIkVycm9yOiBJbnZhbGlkIGdyYXBoIVwiIH1cclxuXHRcdFx0XHRpZihjdHguZXJyKXsgcmV0dXJuIGN0eC5ndW4ub24oJ2luJywgeydAJzogYXRbJyMnXSwgZXJyOiBHdW4ubG9nKGN0eC5lcnIpIH0pIH1cclxuXHRcdFx0XHRvYmpfbWFwKGN0eC5wdXQsIG1lcmdlLCBjdHgpO1xyXG5cdFx0XHRcdG9ial9tYXAoY3R4Lm1hcCwgbWFwLCBjdHgpO1xyXG5cdFx0XHRcdGlmKHUgIT09IGN0eC5kZWZlcil7XHJcblx0XHRcdFx0XHRHdW4uc2NoZWR1bGUoY3R4LmRlZmVyLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0XHRHdW4ub24oJ3B1dCcsIGF0KTtcclxuXHRcdFx0XHRcdH0sIEd1bi5zdGF0ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKCFjdHguZGlmZil7IHJldHVybiB9XHJcblx0XHRcdFx0ZXYudG8ubmV4dChvYmpfdG8oYXQsIHtwdXQ6IGN0eC5kaWZmfSkpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0ZnVuY3Rpb24gdmVyaWZ5KHZhbCwga2V5LCBub2RlLCBzb3VsKXsgdmFyIGN0eCA9IHRoaXM7XHJcblx0XHRcdFx0dmFyIHN0YXRlID0gR3VuLnN0YXRlLmlzKG5vZGUsIGtleSksIHRtcDtcclxuXHRcdFx0XHRpZighc3RhdGUpeyByZXR1cm4gY3R4LmVyciA9IFwiRXJyb3I6IE5vIHN0YXRlIG9uICdcIitrZXkrXCInIGluIG5vZGUgJ1wiK3NvdWwrXCInIVwiIH1cclxuXHRcdFx0XHR2YXIgdmVydGV4ID0gY3R4LmdyYXBoW3NvdWxdIHx8IGVtcHR5LCB3YXMgPSBHdW4uc3RhdGUuaXModmVydGV4LCBrZXksIHRydWUpLCBrbm93biA9IHZlcnRleFtrZXldO1xyXG5cdFx0XHRcdHZhciBIQU0gPSBHdW4uSEFNKGN0eC5tYWNoaW5lLCBzdGF0ZSwgd2FzLCB2YWwsIGtub3duKTtcclxuXHRcdFx0XHRpZighSEFNLmluY29taW5nKXtcclxuXHRcdFx0XHRcdGlmKEhBTS5kZWZlcil7IC8vIHBpY2sgdGhlIGxvd2VzdFxyXG5cdFx0XHRcdFx0XHRjdHguZGVmZXIgPSAoc3RhdGUgPCAoY3R4LmRlZmVyIHx8IEluZmluaXR5KSk/IHN0YXRlIDogY3R4LmRlZmVyO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjdHgucHV0W3NvdWxdID0gR3VuLnN0YXRlLnRvKG5vZGUsIGtleSwgY3R4LnB1dFtzb3VsXSk7XHJcblx0XHRcdFx0KGN0eC5kaWZmIHx8IChjdHguZGlmZiA9IHt9KSlbc291bF0gPSBHdW4uc3RhdGUudG8obm9kZSwga2V5LCBjdHguZGlmZltzb3VsXSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbWVyZ2Uobm9kZSwgc291bCl7XHJcblx0XHRcdFx0dmFyIHJlZiA9ICgodGhpcy5ndW4uXykubmV4dCB8fCBlbXB0eSlbc291bF07XHJcblx0XHRcdFx0aWYoIXJlZil7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIGF0ID0gdGhpcy5tYXBbc291bF0gPSB7XHJcblx0XHRcdFx0XHRwdXQ6IHRoaXMubm9kZSA9IG5vZGUsXHJcblx0XHRcdFx0XHRnZXQ6IHRoaXMuc291bCA9IHNvdWwsXHJcblx0XHRcdFx0XHRndW46IHRoaXMucmVmID0gcmVmXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRvYmpfbWFwKG5vZGUsIGVhY2gsIHRoaXMpO1xyXG5cdFx0XHRcdEd1bi5vbignbm9kZScsIGF0KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBlYWNoKHZhbCwga2V5KXtcclxuXHRcdFx0XHR2YXIgZ3JhcGggPSB0aGlzLmdyYXBoLCBzb3VsID0gdGhpcy5zb3VsLCBjYXQgPSAodGhpcy5yZWYuXyksIHRtcDtcclxuXHRcdFx0XHRncmFwaFtzb3VsXSA9IEd1bi5zdGF0ZS50byh0aGlzLm5vZGUsIGtleSwgZ3JhcGhbc291bF0pO1xyXG5cdFx0XHRcdChjYXQucHV0IHx8IChjYXQucHV0ID0ge30pKVtrZXldID0gdmFsO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcChhdCwgc291bCl7XHJcblx0XHRcdFx0aWYoIWF0Lmd1bil7IHJldHVybiB9XHJcblx0XHRcdFx0KGF0Lmd1bi5fKS5vbignaW4nLCBhdCk7XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRHdW4ub24oJ2dldCcsIGZ1bmN0aW9uKGF0KXtcclxuXHRcdFx0XHR2YXIgZXYgPSB0aGlzLCBzb3VsID0gYXQuZ2V0W19zb3VsXSwgY2F0ID0gYXQuZ3VuLl8sIG5vZGUgPSBjYXQuZ3JhcGhbc291bF0sIGZpZWxkID0gYXQuZ2V0W19maWVsZF0sIHRtcDtcclxuXHRcdFx0XHR2YXIgbmV4dCA9IGNhdC5uZXh0IHx8IChjYXQubmV4dCA9IHt9KSwgYXMgPSAoKG5leHRbc291bF0gfHwgZW1wdHkpLl8pO1xyXG5cdFx0XHRcdGlmKCFub2RlIHx8ICFhcyl7IHJldHVybiBldi50by5uZXh0KGF0KSB9XHJcblx0XHRcdFx0aWYoZmllbGQpe1xyXG5cdFx0XHRcdFx0aWYoIW9ial9oYXMobm9kZSwgZmllbGQpKXsgcmV0dXJuIGV2LnRvLm5leHQoYXQpIH1cclxuXHRcdFx0XHRcdG5vZGUgPSBHdW4uc3RhdGUudG8obm9kZSwgZmllbGQpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRub2RlID0gR3VuLm9iai5jb3B5KG5vZGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvL2lmKGF0Lmd1biA9PT0gY2F0Lmd1bil7XHJcblx0XHRcdFx0XHRub2RlID0gR3VuLmdyYXBoLm5vZGUobm9kZSk7IC8vIFRPRE86IEJVRyEgQ2xvbmUgbm9kZT9cclxuXHRcdFx0XHQvL30gZWxzZSB7XHJcblx0XHRcdFx0Ly9cdGNhdCA9IChhdC5ndW4uXyk7XHJcblx0XHRcdFx0Ly99XHJcblx0XHRcdFx0dG1wID0gYXMuYWNrO1xyXG5cdFx0XHRcdGNhdC5vbignaW4nLCB7XHJcblx0XHRcdFx0XHQnQCc6IGF0WycjJ10sXHJcblx0XHRcdFx0XHRob3c6ICdtZW0nLFxyXG5cdFx0XHRcdFx0cHV0OiBub2RlLFxyXG5cdFx0XHRcdFx0Z3VuOiBhcy5ndW5cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRpZigwIDwgdG1wKXtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZXYudG8ubmV4dChhdCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSgpKTtcclxuXHRcdFxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRHdW4ub24uYXNrID0gZnVuY3Rpb24oY2IsIGFzKXtcclxuXHRcdFx0XHRpZighdGhpcy5vbil7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIGlkID0gR3VuLnRleHQucmFuZG9tKCk7XHJcblx0XHRcdFx0aWYoY2IpeyB0aGlzLm9uKGlkLCBjYiwgYXMpIH1cclxuXHRcdFx0XHRyZXR1cm4gaWQ7XHJcblx0XHRcdH1cclxuXHRcdFx0R3VuLm9uLmFjayA9IGZ1bmN0aW9uKGF0LCByZXBseSl7XHJcblx0XHRcdFx0aWYoIWF0IHx8ICFyZXBseSB8fCAhdGhpcy5vbil7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIGlkID0gYXRbJyMnXSB8fCBhdDtcclxuXHRcdFx0XHRpZighdGhpcy50YWcgfHwgIXRoaXMudGFnW2lkXSl7IHJldHVybiB9XHJcblx0XHRcdFx0dGhpcy5vbihpZCwgcmVwbHkpO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0R3VuLmNoYWluLm9wdCA9IGZ1bmN0aW9uKG9wdCl7XHJcblx0XHRcdFx0b3B0ID0gb3B0IHx8IHt9O1xyXG5cdFx0XHRcdHZhciBndW4gPSB0aGlzLCBhdCA9IGd1bi5fLCB0bXAgPSBvcHQucGVlcnMgfHwgb3B0O1xyXG5cdFx0XHRcdGlmKCFvYmpfaXMob3B0KSl7IG9wdCA9IHt9IH1cclxuXHRcdFx0XHRpZighb2JqX2lzKGF0Lm9wdCkpeyBhdC5vcHQgPSBvcHQgfVxyXG5cdFx0XHRcdGlmKHRleHRfaXModG1wKSl7IHRtcCA9IFt0bXBdIH1cclxuXHRcdFx0XHRpZihsaXN0X2lzKHRtcCkpe1xyXG5cdFx0XHRcdFx0dG1wID0gb2JqX21hcCh0bXAsIGZ1bmN0aW9uKHVybCwgaSwgbWFwKXtcclxuXHRcdFx0XHRcdFx0bWFwKHVybCwge3VybDogdXJsfSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdGlmKCFvYmpfaXMoYXQub3B0LnBlZXJzKSl7IGF0Lm9wdC5wZWVycyA9IHt9fVxyXG5cdFx0XHRcdFx0YXQub3B0LnBlZXJzID0gb2JqX3RvKHRtcCwgYXQub3B0LnBlZXJzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YXQub3B0LndzYyA9IGF0Lm9wdC53c2MgfHwge3Byb3RvY29sczpbXX0gXHJcblx0XHRcdFx0YXQub3B0LnBlZXJzID0gYXQub3B0LnBlZXJzIHx8IHt9O1xyXG5cdFx0XHRcdG9ial90byhvcHQsIGF0Lm9wdCk7IC8vIGNvcGllcyBvcHRpb25zIG9uIHRvIGBhdC5vcHRgIG9ubHkgaWYgbm90IGFscmVhZHkgdGFrZW4uXHJcblx0XHRcdFx0R3VuLm9uKCdvcHQnLCBhdCk7XHJcblx0XHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHJcblx0XHR2YXIgdGV4dF9pcyA9IEd1bi50ZXh0LmlzO1xyXG5cdFx0dmFyIGxpc3RfaXMgPSBHdW4ubGlzdC5pcztcclxuXHRcdHZhciBvYmogPSBHdW4ub2JqLCBvYmpfaXMgPSBvYmouaXMsIG9ial9oYXMgPSBvYmouaGFzLCBvYmpfdG8gPSBvYmoudG8sIG9ial9tYXAgPSBvYmoubWFwLCBvYmpfY29weSA9IG9iai5jb3B5O1xyXG5cdFx0dmFyIF9zb3VsID0gR3VuLl8uc291bCwgX2ZpZWxkID0gR3VuLl8uZmllbGQsIHJlbF9pcyA9IEd1bi52YWwucmVsLmlzO1xyXG5cdFx0dmFyIGVtcHR5ID0ge30sIHU7XHJcblxyXG5cdFx0Y29uc29sZS5kZWJ1ZyA9IGZ1bmN0aW9uKGksIHMpeyByZXR1cm4gKGNvbnNvbGUuZGVidWcuaSAmJiBpID09PSBjb25zb2xlLmRlYnVnLmkgJiYgY29uc29sZS5kZWJ1Zy5pKyspICYmIChjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpIHx8IHMpIH07XHJcblxyXG5cdFx0R3VuLmxvZyA9IGZ1bmN0aW9uKCl7IHJldHVybiAoIUd1bi5sb2cub2ZmICYmIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cykpLCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykuam9pbignICcpIH1cclxuXHRcdEd1bi5sb2cub25jZSA9IGZ1bmN0aW9uKHcscyxvKXsgcmV0dXJuIChvID0gR3VuLmxvZy5vbmNlKVt3XSA9IG9bd10gfHwgMCwgb1t3XSsrIHx8IEd1bi5sb2cocykgfVxyXG5cclxuXHRcdDtcIlBsZWFzZSBkbyBub3QgcmVtb3ZlIHRoZXNlIG1lc3NhZ2VzIHVubGVzcyB5b3UgYXJlIHBheWluZyBmb3IgYSBtb250aGx5IHNwb25zb3JzaGlwLCB0aGFua3MhXCI7XHJcblx0XHRHdW4ubG9nLm9uY2UoXCJ3ZWxjb21lXCIsIFwiSGVsbG8gd29uZGVyZnVsIHBlcnNvbiEgOikgVGhhbmtzIGZvciB1c2luZyBHVU4sIGZlZWwgZnJlZSB0byBhc2sgZm9yIGhlbHAgb24gaHR0cHM6Ly9naXR0ZXIuaW0vYW1hcmsvZ3VuIGFuZCBhc2sgU3RhY2tPdmVyZmxvdyBxdWVzdGlvbnMgdGFnZ2VkIHdpdGggJ2d1bichXCIpO1xyXG5cdFx0O1wiUGxlYXNlIGRvIG5vdCByZW1vdmUgdGhlc2UgbWVzc2FnZXMgdW5sZXNzIHlvdSBhcmUgcGF5aW5nIGZvciBhIG1vbnRobHkgc3BvbnNvcnNoaXAsIHRoYW5rcyFcIjtcclxuXHRcdFxyXG5cdFx0aWYodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIil7IHdpbmRvdy5HdW4gPSBHdW4gfVxyXG5cdFx0aWYodHlwZW9mIGNvbW1vbiAhPT0gXCJ1bmRlZmluZWRcIil7IGNvbW1vbi5leHBvcnRzID0gR3VuIH1cclxuXHRcdG1vZHVsZS5leHBvcnRzID0gR3VuO1xyXG5cdH0pKHJlcXVpcmUsICcuL3Jvb3QnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL3Jvb3QnKTtcclxuXHRcdEd1bi5jaGFpbi5iYWNrID0gZnVuY3Rpb24obiwgb3B0KXsgdmFyIHRtcDtcclxuXHRcdFx0aWYoLTEgPT09IG4gfHwgSW5maW5pdHkgPT09IG4pe1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLl8ucm9vdDtcclxuXHRcdFx0fSBlbHNlXHJcblx0XHRcdGlmKDEgPT09IG4pe1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLl8uYmFjayB8fCB0aGlzO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBndW4gPSB0aGlzLCBhdCA9IGd1bi5fO1xyXG5cdFx0XHRpZih0eXBlb2YgbiA9PT0gJ3N0cmluZycpe1xyXG5cdFx0XHRcdG4gPSBuLnNwbGl0KCcuJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYobiBpbnN0YW5jZW9mIEFycmF5KXtcclxuXHRcdFx0XHR2YXIgaSA9IDAsIGwgPSBuLmxlbmd0aCwgdG1wID0gYXQ7XHJcblx0XHRcdFx0Zm9yKGk7IGkgPCBsOyBpKyspe1xyXG5cdFx0XHRcdFx0dG1wID0gKHRtcHx8ZW1wdHkpW25baV1dO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZih1ICE9PSB0bXApe1xyXG5cdFx0XHRcdFx0cmV0dXJuIG9wdD8gZ3VuIDogdG1wO1xyXG5cdFx0XHRcdH0gZWxzZVxyXG5cdFx0XHRcdGlmKCh0bXAgPSBhdC5iYWNrKSl7XHJcblx0XHRcdFx0XHRyZXR1cm4gdG1wLmJhY2sobiwgb3B0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKG4gaW5zdGFuY2VvZiBGdW5jdGlvbil7XHJcblx0XHRcdFx0dmFyIHllcywgdG1wID0ge2JhY2s6IGd1bn07XHJcblx0XHRcdFx0d2hpbGUoKHRtcCA9IHRtcC5iYWNrKVxyXG5cdFx0XHRcdCYmICh0bXAgPSB0bXAuXylcclxuXHRcdFx0XHQmJiAhKHllcyA9IG4odG1wLCBvcHQpKSl7fVxyXG5cdFx0XHRcdHJldHVybiB5ZXM7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHZhciBlbXB0eSA9IHt9LCB1O1xyXG5cdH0pKHJlcXVpcmUsICcuL2JhY2snKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL3Jvb3QnKTtcclxuXHRcdEd1bi5jaGFpbi5jaGFpbiA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBhdCA9IHRoaXMuXywgY2hhaW4gPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzKSwgY2F0ID0gY2hhaW4uXztcclxuXHRcdFx0Y2F0LnJvb3QgPSByb290ID0gYXQucm9vdDtcclxuXHRcdFx0Y2F0LmlkID0gKytyb290Ll8ub25jZTtcclxuXHRcdFx0Y2F0LmJhY2sgPSB0aGlzO1xyXG5cdFx0XHRjYXQub24gPSBHdW4ub247XHJcblx0XHRcdEd1bi5vbignY2hhaW4nLCBjYXQpO1xyXG5cdFx0XHRjYXQub24oJ2luJywgaW5wdXQsIGNhdCk7IC8vIEZvciAnaW4nIGlmIEkgYWRkIG15IG93biBsaXN0ZW5lcnMgdG8gZWFjaCB0aGVuIEkgTVVTVCBkbyBpdCBiZWZvcmUgaW4gZ2V0cyBjYWxsZWQuIElmIEkgbGlzdGVuIGdsb2JhbGx5IGZvciBhbGwgaW5jb21pbmcgZGF0YSBpbnN0ZWFkIHRob3VnaCwgcmVnYXJkbGVzcyBvZiBpbmRpdmlkdWFsIGxpc3RlbmVycywgSSBjYW4gdHJhbnNmb3JtIHRoZSBkYXRhIHRoZXJlIGFuZCB0aGVuIGFzIHdlbGwuXHJcblx0XHRcdGNhdC5vbignb3V0Jywgb3V0cHV0LCBjYXQpOyAvLyBIb3dldmVyIGZvciBvdXRwdXQsIHRoZXJlIGlzbid0IHJlYWxseSB0aGUgZ2xvYmFsIG9wdGlvbi4gSSBtdXN0IGxpc3RlbiBieSBhZGRpbmcgbXkgb3duIGxpc3RlbmVyIGluZGl2aWR1YWxseSBCRUZPUkUgdGhpcyBvbmUgaXMgZXZlciBjYWxsZWQuXHJcblx0XHRcdHJldHVybiBjaGFpbjtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIG91dHB1dChhdCl7XHJcblx0XHRcdHZhciBjYXQgPSB0aGlzLmFzLCBndW4gPSBjYXQuZ3VuLCByb290ID0gZ3VuLmJhY2soLTEpLCBwdXQsIGdldCwgbm93LCB0bXA7XHJcblx0XHRcdGlmKCFhdC5ndW4pe1xyXG5cdFx0XHRcdGF0Lmd1biA9IGd1bjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihnZXQgPSBhdC5nZXQpe1xyXG5cdFx0XHRcdGlmKHRtcCA9IGdldFtfc291bF0pe1xyXG5cdFx0XHRcdFx0dG1wID0gKHJvb3QuZ2V0KHRtcCkuXyk7XHJcblx0XHRcdFx0XHRpZihvYmpfaGFzKGdldCwgX2ZpZWxkKSl7XHJcblx0XHRcdFx0XHRcdGlmKG9ial9oYXMocHV0ID0gdG1wLnB1dCwgZ2V0ID0gZ2V0W19maWVsZF0pKXtcclxuXHRcdFx0XHRcdFx0XHR0bXAub24oJ2luJywge2dldDogdG1wLmdldCwgcHV0OiBHdW4uc3RhdGUudG8ocHV0LCBnZXQpLCBndW46IHRtcC5ndW59KTsgLy8gVE9ETzogVWdseSwgY2xlYW4gdXA/IFNpbXBsaWZ5IGFsbCB0aGVzZSBpZiBjb25kaXRpb25zICh3aXRob3V0IHJ1aW5pbmcgdGhlIHdob2xlIGNoYWluaW5nIEFQSSk/XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gZWxzZVxyXG5cdFx0XHRcdFx0aWYob2JqX2hhcyh0bXAsICdwdXQnKSl7XHJcblx0XHRcdFx0XHQvL2lmKHUgIT09IHRtcC5wdXQpe1xyXG5cdFx0XHRcdFx0XHR0bXAub24oJ2luJywgdG1wKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYob2JqX2hhcyhnZXQsIF9maWVsZCkpe1xyXG5cdFx0XHRcdFx0XHRnZXQgPSBnZXRbX2ZpZWxkXTtcclxuXHRcdFx0XHRcdFx0dmFyIG5leHQgPSBnZXQ/IChndW4uZ2V0KGdldCkuXykgOiBjYXQ7XHJcblx0XHRcdFx0XHRcdC8vIFRPRE86IEJVRyEgSGFuZGxlIHBsdXJhbCBjaGFpbnMgYnkgaXRlcmF0aW5nIG92ZXIgdGhlbS5cclxuXHRcdFx0XHRcdFx0Ly9pZihvYmpfaGFzKG5leHQsICdwdXQnKSl7IC8vIHBvdGVudGlhbGx5IGluY29ycmVjdD8gTWF5YmU/XHJcblx0XHRcdFx0XHRcdGlmKHUgIT09IG5leHQucHV0KXsgLy8gcG90ZW50aWFsbHkgaW5jb3JyZWN0PyBNYXliZT9cclxuXHRcdFx0XHRcdFx0XHQvL25leHQudGFnWydpbiddLmxhc3QubmV4dChuZXh0KTtcclxuXHRcdFx0XHRcdFx0XHRuZXh0Lm9uKCdpbicsIG5leHQpO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZihvYmpfaGFzKGNhdCwgJ3B1dCcpKXtcclxuXHRcdFx0XHRcdFx0Ly9pZih1ICE9PSBjYXQucHV0KXtcclxuXHRcdFx0XHRcdFx0XHR2YXIgdmFsID0gY2F0LnB1dCwgcmVsO1xyXG5cdFx0XHRcdFx0XHRcdGlmKHJlbCA9IEd1bi5ub2RlLnNvdWwodmFsKSl7XHJcblx0XHRcdFx0XHRcdFx0XHR2YWwgPSBHdW4udmFsLnJlbC5pZnkocmVsKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0aWYocmVsID0gR3VuLnZhbC5yZWwuaXModmFsKSl7XHJcblx0XHRcdFx0XHRcdFx0XHRpZighYXQuZ3VuLl8peyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0XHRcdFx0KGF0Lmd1bi5fKS5vbignb3V0Jywge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRnZXQ6IHRtcCA9IHsnIyc6IHJlbCwgJy4nOiBnZXQsIGd1bjogYXQuZ3VufSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0JyMnOiByb290Ll8uYXNrKEd1bi5IQU0uc3ludGgsIHRtcCksXHJcblx0XHRcdFx0XHRcdFx0XHRcdGd1bjogYXQuZ3VuXHJcblx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0aWYodSA9PT0gdmFsIHx8IEd1bi52YWwuaXModmFsKSl7XHJcblx0XHRcdFx0XHRcdFx0XHRpZighYXQuZ3VuLl8peyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0XHRcdFx0KGF0Lmd1bi5fKS5vbignaW4nLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGdldDogZ2V0LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRndW46IGF0Lmd1blxyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9IGVsc2VcclxuXHRcdFx0XHRcdFx0aWYoY2F0Lm1hcCl7XHJcblx0XHRcdFx0XHRcdFx0b2JqX21hcChjYXQubWFwLCBmdW5jdGlvbihwcm94eSl7XHJcblx0XHRcdFx0XHRcdFx0XHRwcm94eS5hdC5vbignaW4nLCBwcm94eS5hdCk7XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdGlmKGNhdC5zb3VsKXtcclxuXHRcdFx0XHRcdFx0XHRpZighYXQuZ3VuLl8peyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0XHRcdChhdC5ndW4uXykub24oJ291dCcsIHtcclxuXHRcdFx0XHRcdFx0XHRcdGdldDogdG1wID0geycjJzogY2F0LnNvdWwsICcuJzogZ2V0LCBndW46IGF0Lmd1bn0sXHJcblx0XHRcdFx0XHRcdFx0XHQnIyc6IHJvb3QuXy5hc2soR3VuLkhBTS5zeW50aCwgdG1wKSxcclxuXHRcdFx0XHRcdFx0XHRcdGd1bjogYXQuZ3VuXHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmKGNhdC5nZXQpe1xyXG5cdFx0XHRcdFx0XHRcdGlmKCFjYXQuYmFjay5fKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdFx0XHQoY2F0LmJhY2suXykub24oJ291dCcsIHtcclxuXHRcdFx0XHRcdFx0XHRcdGdldDogb2JqX3B1dCh7fSwgX2ZpZWxkLCBjYXQuZ2V0KSxcclxuXHRcdFx0XHRcdFx0XHRcdGd1bjogZ3VuXHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGF0ID0gb2JqX3RvKGF0LCB7Z2V0OiB7fX0pO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0aWYob2JqX2hhcyhjYXQsICdwdXQnKSl7XHJcblx0XHRcdFx0XHRcdC8vaWYodSAhPT0gY2F0LnB1dCl7XHJcblx0XHRcdFx0XHRcdFx0Y2F0Lm9uKCdpbicsIGNhdCk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZVxyXG5cdFx0XHRcdFx0XHRpZihjYXQubWFwKXtcclxuXHRcdFx0XHRcdFx0XHRvYmpfbWFwKGNhdC5tYXAsIGZ1bmN0aW9uKHByb3h5KXtcclxuXHRcdFx0XHRcdFx0XHRcdHByb3h5LmF0Lm9uKCdpbicsIHByb3h5LmF0KTtcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZihjYXQuYWNrKXtcclxuXHRcdFx0XHRcdFx0XHRpZighb2JqX2hhcyhjYXQsICdwdXQnKSl7IC8vIHUgIT09IGNhdC5wdXQgaW5zdGVhZD9cclxuXHRcdFx0XHRcdFx0XHQvL2lmKHUgIT09IGNhdC5wdXQpe1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRjYXQuYWNrID0gLTE7XHJcblx0XHRcdFx0XHRcdGlmKGNhdC5zb3VsKXtcclxuXHRcdFx0XHRcdFx0XHRjYXQub24oJ291dCcsIHtcclxuXHRcdFx0XHRcdFx0XHRcdGdldDogdG1wID0geycjJzogY2F0LnNvdWwsIGd1bjogY2F0Lmd1bn0sXHJcblx0XHRcdFx0XHRcdFx0XHQnIyc6IHJvb3QuXy5hc2soR3VuLkhBTS5zeW50aCwgdG1wKSxcclxuXHRcdFx0XHRcdFx0XHRcdGd1bjogY2F0Lmd1blxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZihjYXQuZ2V0KXtcclxuXHRcdFx0XHRcdFx0XHRpZighY2F0LmJhY2suXyl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRcdFx0KGNhdC5iYWNrLl8pLm9uKCdvdXQnLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRnZXQ6IG9ial9wdXQoe30sIF9maWVsZCwgY2F0LmdldCksXHJcblx0XHRcdFx0XHRcdFx0XHRndW46IGNhdC5ndW5cclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0KGNhdC5iYWNrLl8pLm9uKCdvdXQnLCBhdCk7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBpbnB1dChhdCl7XHJcblx0XHRcdGF0ID0gYXQuXyB8fCBhdDtcclxuXHRcdFx0dmFyIGV2ID0gdGhpcywgY2F0ID0gdGhpcy5hcywgZ3VuID0gYXQuZ3VuLCBjb2F0ID0gZ3VuLl8sIGNoYW5nZSA9IGF0LnB1dCwgYmFjayA9IGNhdC5iYWNrLl8gfHwgZW1wdHksIHJlbCwgdG1wO1xyXG5cdFx0XHRpZigwID4gY2F0LmFjayAmJiAhYXQuYWNrICYmICFHdW4udmFsLnJlbC5pcyhjaGFuZ2UpKXsgLy8gZm9yIGJldHRlciBiZWhhdmlvcj9cclxuXHRcdFx0XHRjYXQuYWNrID0gMTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjYXQuZ2V0ICYmIGF0LmdldCAhPT0gY2F0LmdldCl7XHJcblx0XHRcdFx0YXQgPSBvYmpfdG8oYXQsIHtnZXQ6IGNhdC5nZXR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjYXQuZmllbGQgJiYgY29hdCAhPT0gY2F0KXtcclxuXHRcdFx0XHRhdCA9IG9ial90byhhdCwge2d1bjogY2F0Lmd1bn0pO1xyXG5cdFx0XHRcdGlmKGNvYXQuYWNrKXtcclxuXHRcdFx0XHRcdGNhdC5hY2sgPSBjYXQuYWNrIHx8IGNvYXQuYWNrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZih1ID09PSBjaGFuZ2Upe1xyXG5cdFx0XHRcdGV2LnRvLm5leHQoYXQpO1xyXG5cdFx0XHRcdGlmKGNhdC5zb3VsKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRlY2hvKGNhdCwgYXQsIGV2KTtcclxuXHRcdFx0XHRpZihjYXQuZmllbGQpe1xyXG5cdFx0XHRcdFx0bm90KGNhdCwgYXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRvYmpfZGVsKGNvYXQuZWNobywgY2F0LmlkKTtcclxuXHRcdFx0XHRvYmpfZGVsKGNhdC5tYXAsIGNvYXQuaWQpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjYXQuc291bCl7XHJcblx0XHRcdFx0aWYoY2F0LnJvb3QuXy5ub3cpeyBhdCA9IG9ial90byhhdCwge3B1dDogY2hhbmdlID0gY29hdC5wdXR9KSB9IC8vIFRPRE86IFVnbHkgaGFjayBmb3IgdW5jYWNoZWQgc3luY2hyb25vdXMgbWFwcy5cclxuXHRcdFx0XHRldi50by5uZXh0KGF0KTtcclxuXHRcdFx0XHRlY2hvKGNhdCwgYXQsIGV2KTtcclxuXHRcdFx0XHRvYmpfbWFwKGNoYW5nZSwgbWFwLCB7YXQ6IGF0LCBjYXQ6IGNhdH0pO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZighKHJlbCA9IEd1bi52YWwucmVsLmlzKGNoYW5nZSkpKXtcclxuXHRcdFx0XHRpZihHdW4udmFsLmlzKGNoYW5nZSkpe1xyXG5cdFx0XHRcdFx0aWYoY2F0LmZpZWxkIHx8IGNhdC5zb3VsKXtcclxuXHRcdFx0XHRcdFx0bm90KGNhdCwgYXQpO1xyXG5cdFx0XHRcdFx0fSBlbHNlXHJcblx0XHRcdFx0XHRpZihjb2F0LmZpZWxkIHx8IGNvYXQuc291bCl7XHJcblx0XHRcdFx0XHRcdChjb2F0LmVjaG8gfHwgKGNvYXQuZWNobyA9IHt9KSlbY2F0LmlkXSA9IGNhdDtcclxuXHRcdFx0XHRcdFx0KGNhdC5tYXAgfHwgKGNhdC5tYXAgPSB7fSkpW2NvYXQuaWRdID0gY2F0Lm1hcFtjb2F0LmlkXSB8fCB7YXQ6IGNvYXR9O1xyXG5cdFx0XHRcdFx0XHQvL2lmKHUgPT09IGNvYXQucHV0KXsgcmV0dXJuIH0gLy8gTm90IG5lY2Vzc2FyeSBidXQgaW1wcm92ZXMgcGVyZm9ybWFuY2UuIElmIHdlIGhhdmUgaXQgYnV0IGNvYXQgZG9lcyBub3QsIHRoYXQgbWVhbnMgd2UgZ290IHRoaW5ncyBvdXQgb2Ygb3JkZXIgYW5kIGNvYXQgd2lsbCBnZXQgaXQuIE9uY2UgY29hdCBnZXRzIGl0LCBpdCB3aWxsIHRlbGwgdXMgYWdhaW4uXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRldi50by5uZXh0KGF0KTtcclxuXHRcdFx0XHRcdGVjaG8oY2F0LCBhdCwgZXYpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihjYXQuZmllbGQgJiYgY29hdCAhPT0gY2F0ICYmIG9ial9oYXMoY29hdCwgJ3B1dCcpKXtcclxuXHRcdFx0XHRcdGNhdC5wdXQgPSBjb2F0LnB1dDtcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGlmKChyZWwgPSBHdW4ubm9kZS5zb3VsKGNoYW5nZSkpICYmIGNvYXQuZmllbGQpe1xyXG5cdFx0XHRcdFx0Y29hdC5wdXQgPSAoY2F0LnJvb3QuZ2V0KHJlbCkuXykucHV0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRldi50by5uZXh0KGF0KTtcclxuXHRcdFx0XHRlY2hvKGNhdCwgYXQsIGV2KTtcclxuXHRcdFx0XHRyZWxhdGUoY2F0LCBhdCwgY29hdCwgcmVsKTtcclxuXHRcdFx0XHRvYmpfbWFwKGNoYW5nZSwgbWFwLCB7YXQ6IGF0LCBjYXQ6IGNhdH0pO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZWxhdGUoY2F0LCBhdCwgY29hdCwgcmVsKTtcclxuXHRcdFx0ZXYudG8ubmV4dChhdCk7XHJcblx0XHRcdGVjaG8oY2F0LCBhdCwgZXYpO1xyXG5cdFx0fVxyXG5cdFx0R3VuLmNoYWluLmNoYWluLmlucHV0ID0gaW5wdXQ7XHJcblx0XHRmdW5jdGlvbiByZWxhdGUoY2F0LCBhdCwgY29hdCwgcmVsKXtcclxuXHRcdFx0aWYoIXJlbCB8fCBub2RlXyA9PT0gY2F0LmdldCl7IHJldHVybiB9XHJcblx0XHRcdHZhciB0bXAgPSAoY2F0LnJvb3QuZ2V0KHJlbCkuXyk7XHJcblx0XHRcdGlmKGNhdC5maWVsZCl7XHJcblx0XHRcdFx0Y29hdCA9IHRtcDtcclxuXHRcdFx0fSBlbHNlIFxyXG5cdFx0XHRpZihjb2F0LmZpZWxkKXtcclxuXHRcdFx0XHRyZWxhdGUoY29hdCwgYXQsIGNvYXQsIHJlbCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY29hdCA9PT0gY2F0KXsgcmV0dXJuIH1cclxuXHRcdFx0KGNvYXQuZWNobyB8fCAoY29hdC5lY2hvID0ge30pKVtjYXQuaWRdID0gY2F0O1xyXG5cdFx0XHRpZihjYXQuZmllbGQgJiYgIShjYXQubWFwfHxlbXB0eSlbY29hdC5pZF0pe1xyXG5cdFx0XHRcdG5vdChjYXQsIGF0KTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0bXAgPSAoY2F0Lm1hcCB8fCAoY2F0Lm1hcCA9IHt9KSlbY29hdC5pZF0gPSBjYXQubWFwW2NvYXQuaWRdIHx8IHthdDogY29hdH07XHJcblx0XHRcdGlmKHJlbCA9PT0gdG1wLnJlbCl7IHJldHVybiB9XHJcblx0XHRcdGFzayhjYXQsIHRtcC5yZWwgPSByZWwpO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gZWNobyhjYXQsIGF0LCBldil7XHJcblx0XHRcdGlmKCFjYXQuZWNobyl7IHJldHVybiB9IC8vIHx8IG5vZGVfID09PSBhdC5nZXQgPz8/P1xyXG5cdFx0XHRpZihjYXQuZmllbGQpeyBhdCA9IG9ial90byhhdCwge2V2ZW50OiBldn0pIH1cclxuXHRcdFx0b2JqX21hcChjYXQuZWNobywgcmV2ZXJiLCBhdCk7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiByZXZlcmIoY2F0KXtcclxuXHRcdFx0Y2F0Lm9uKCdpbicsIHRoaXMpO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gbWFwKGRhdGEsIGtleSl7IC8vIE1hcCBvdmVyIG9ubHkgdGhlIGNoYW5nZXMgb24gZXZlcnkgdXBkYXRlLlxyXG5cdFx0XHR2YXIgY2F0ID0gdGhpcy5jYXQsIG5leHQgPSBjYXQubmV4dCB8fCBlbXB0eSwgdmlhID0gdGhpcy5hdCwgZ3VuLCBjaGFpbiwgYXQsIHRtcDtcclxuXHRcdFx0aWYobm9kZV8gPT09IGtleSAmJiAhbmV4dFtrZXldKXsgcmV0dXJuIH1cclxuXHRcdFx0aWYoIShndW4gPSBuZXh0W2tleV0pKXtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0YXQgPSAoZ3VuLl8pO1xyXG5cdFx0XHQvL2lmKGRhdGEgJiYgZGF0YVtfc291bF0gJiYgKHRtcCA9IEd1bi52YWwucmVsLmlzKGRhdGEpKSAmJiAodG1wID0gKGNhdC5yb290LmdldCh0bXApLl8pKSAmJiBvYmpfaGFzKHRtcCwgJ3B1dCcpKXtcclxuXHRcdFx0Ly9cdGRhdGEgPSB0bXAucHV0O1xyXG5cdFx0XHQvL31cclxuXHRcdFx0aWYoYXQuZmllbGQpe1xyXG5cdFx0XHRcdGlmKCEoZGF0YSAmJiBkYXRhW19zb3VsXSAmJiBHdW4udmFsLnJlbC5pcyhkYXRhKSA9PT0gR3VuLm5vZGUuc291bChhdC5wdXQpKSl7XHJcblx0XHRcdFx0XHRhdC5wdXQgPSBkYXRhO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjaGFpbiA9IGd1bjtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjaGFpbiA9IHZpYS5ndW4uZ2V0KGtleSk7XHJcblx0XHRcdH1cclxuXHRcdFx0YXQub24oJ2luJywge1xyXG5cdFx0XHRcdHB1dDogZGF0YSxcclxuXHRcdFx0XHRnZXQ6IGtleSxcclxuXHRcdFx0XHRndW46IGNoYWluLFxyXG5cdFx0XHRcdHZpYTogdmlhXHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gbm90KGNhdCwgYXQpe1xyXG5cdFx0XHRpZighKGNhdC5maWVsZCB8fCBjYXQuc291bCkpeyByZXR1cm4gfVxyXG5cdFx0XHR2YXIgdG1wID0gY2F0Lm1hcDtcclxuXHRcdFx0Y2F0Lm1hcCA9IG51bGw7XHJcblx0XHRcdGlmKG51bGwgPT09IHRtcCl7IHJldHVybiB9XHJcblx0XHRcdGlmKHUgPT09IHRtcCAmJiBjYXQucHV0ICE9PSB1KXsgcmV0dXJuIH0gLy8gVE9ETzogQnVnPyBUaHJldyBzZWNvbmQgY29uZGl0aW9uIGluIGZvciBhIHBhcnRpY3VsYXIgdGVzdCwgbm90IHN1cmUgaWYgYSBjb3VudGVyIGV4YW1wbGUgaXMgdGVzdGVkIHRob3VnaC5cclxuXHRcdFx0b2JqX21hcCh0bXAsIGZ1bmN0aW9uKHByb3h5KXtcclxuXHRcdFx0XHRpZighKHByb3h5ID0gcHJveHkuYXQpKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRvYmpfZGVsKHByb3h5LmVjaG8sIGNhdC5pZCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRvYmpfbWFwKGNhdC5uZXh0LCBmdW5jdGlvbihndW4sIGtleSl7XHJcblx0XHRcdFx0dmFyIGNvYXQgPSAoZ3VuLl8pO1xyXG5cdFx0XHRcdGNvYXQucHV0ID0gdTtcclxuXHRcdFx0XHRpZihjb2F0LmFjayl7XHJcblx0XHRcdFx0XHRjb2F0LmFjayA9IC0xO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjb2F0Lm9uKCdpbicsIHtcclxuXHRcdFx0XHRcdGdldDoga2V5LFxyXG5cdFx0XHRcdFx0Z3VuOiBndW4sXHJcblx0XHRcdFx0XHRwdXQ6IHVcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBhc2soY2F0LCBzb3VsKXtcclxuXHRcdFx0dmFyIHRtcCA9IChjYXQucm9vdC5nZXQoc291bCkuXyk7XHJcblx0XHRcdGlmKGNhdC5hY2spe1xyXG5cdFx0XHRcdHRtcC5hY2sgPSB0bXAuYWNrIHx8IC0xO1xyXG5cdFx0XHRcdHRtcC5vbignb3V0Jywge1xyXG5cdFx0XHRcdFx0Z2V0OiB0bXAgPSB7JyMnOiBzb3VsLCBndW46IHRtcC5ndW59LFxyXG5cdFx0XHRcdFx0JyMnOiBjYXQucm9vdC5fLmFzayhHdW4uSEFNLnN5bnRoLCB0bXApXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdG9ial9tYXAoY2F0Lm5leHQsIGZ1bmN0aW9uKGd1biwga2V5KXtcclxuXHRcdFx0XHQoZ3VuLl8pLm9uKCdvdXQnLCB7XHJcblx0XHRcdFx0XHRnZXQ6IGd1biA9IHsnIyc6IHNvdWwsICcuJzoga2V5LCBndW46IGd1bn0sXHJcblx0XHRcdFx0XHQnIyc6IGNhdC5yb290Ll8uYXNrKEd1bi5IQU0uc3ludGgsIGd1bilcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHR2YXIgZW1wdHkgPSB7fSwgdTtcclxuXHRcdHZhciBvYmogPSBHdW4ub2JqLCBvYmpfaGFzID0gb2JqLmhhcywgb2JqX3B1dCA9IG9iai5wdXQsIG9ial9kZWwgPSBvYmouZGVsLCBvYmpfdG8gPSBvYmoudG8sIG9ial9tYXAgPSBvYmoubWFwO1xyXG5cdFx0dmFyIF9zb3VsID0gR3VuLl8uc291bCwgX2ZpZWxkID0gR3VuLl8uZmllbGQsIG5vZGVfID0gR3VuLm5vZGUuXztcclxuXHR9KShyZXF1aXJlLCAnLi9jaGFpbicpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vcm9vdCcpO1xyXG5cdFx0R3VuLmNoYWluLmdldCA9IGZ1bmN0aW9uKGtleSwgY2IsIGFzKXtcclxuXHRcdFx0aWYodHlwZW9mIGtleSA9PT0gJ3N0cmluZycpe1xyXG5cdFx0XHRcdHZhciBndW4sIGJhY2sgPSB0aGlzLCBjYXQgPSBiYWNrLl87XHJcblx0XHRcdFx0dmFyIG5leHQgPSBjYXQubmV4dCB8fCBlbXB0eSwgdG1wO1xyXG5cdFx0XHRcdGlmKCEoZ3VuID0gbmV4dFtrZXldKSl7XHJcblx0XHRcdFx0XHRndW4gPSBjYWNoZShrZXksIGJhY2spO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlXHJcblx0XHRcdGlmKGtleSBpbnN0YW5jZW9mIEZ1bmN0aW9uKXtcclxuXHRcdFx0XHR2YXIgZ3VuID0gdGhpcywgYXQgPSBndW4uXztcclxuXHRcdFx0XHRhcyA9IGNiIHx8IHt9O1xyXG5cdFx0XHRcdGFzLnVzZSA9IGtleTtcclxuXHRcdFx0XHRhcy5vdXQgPSBhcy5vdXQgfHwge2NhcDogMX07XHJcblx0XHRcdFx0YXMub3V0LmdldCA9IGFzLm91dC5nZXQgfHwge307XHJcblx0XHRcdFx0J18nICE9IGF0LmdldCAmJiAoKGF0LnJvb3QuXykubm93ID0gdHJ1ZSk7IC8vIHVnbHkgaGFjayBmb3Igbm93LlxyXG5cdFx0XHRcdGF0Lm9uKCdpbicsIHVzZSwgYXMpO1xyXG5cdFx0XHRcdGF0Lm9uKCdvdXQnLCBhcy5vdXQpO1xyXG5cdFx0XHRcdChhdC5yb290Ll8pLm5vdyA9IGZhbHNlO1xyXG5cdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdH0gZWxzZVxyXG5cdFx0XHRpZihudW1faXMoa2V5KSl7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0KCcnK2tleSwgY2IsIGFzKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQoYXMgPSB0aGlzLmNoYWluKCkpLl8uZXJyID0ge2VycjogR3VuLmxvZygnSW52YWxpZCBnZXQgcmVxdWVzdCEnLCBrZXkpfTsgLy8gQ0xFQU4gVVBcclxuXHRcdFx0XHRpZihjYil7IGNiLmNhbGwoYXMsIGFzLl8uZXJyKSB9XHJcblx0XHRcdFx0cmV0dXJuIGFzO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHRtcCA9IGNhdC5zdHVuKXsgLy8gVE9ETzogUmVmYWN0b3I/XHJcblx0XHRcdFx0Z3VuLl8uc3R1biA9IGd1bi5fLnN0dW4gfHwgdG1wO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNiICYmIGNiIGluc3RhbmNlb2YgRnVuY3Rpb24pe1xyXG5cdFx0XHRcdGd1bi5nZXQoY2IsIGFzKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gY2FjaGUoa2V5LCBiYWNrKXtcclxuXHRcdFx0dmFyIGNhdCA9IGJhY2suXywgbmV4dCA9IGNhdC5uZXh0LCBndW4gPSBiYWNrLmNoYWluKCksIGF0ID0gZ3VuLl87XHJcblx0XHRcdGlmKCFuZXh0KXsgbmV4dCA9IGNhdC5uZXh0ID0ge30gfVxyXG5cdFx0XHRuZXh0W2F0LmdldCA9IGtleV0gPSBndW47XHJcblx0XHRcdGlmKGNhdC5yb290ID09PSBiYWNrKXsgYXQuc291bCA9IGtleSB9XHJcblx0XHRcdGVsc2UgaWYoY2F0LnNvdWwgfHwgY2F0LmZpZWxkKXsgYXQuZmllbGQgPSBrZXkgfVxyXG5cdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gdXNlKGF0KXtcclxuXHRcdFx0dmFyIGV2ID0gdGhpcywgYXMgPSBldi5hcywgZ3VuID0gYXQuZ3VuLCBjYXQgPSBndW4uXywgZGF0YSA9IGF0LnB1dCwgdG1wO1xyXG5cdFx0XHRpZih1ID09PSBkYXRhKXtcclxuXHRcdFx0XHRkYXRhID0gY2F0LnB1dDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZigodG1wID0gZGF0YSkgJiYgdG1wW3JlbC5fXSAmJiAodG1wID0gcmVsLmlzKHRtcCkpKXtcclxuXHRcdFx0XHR0bXAgPSAoY2F0LnJvb3QuZ2V0KHRtcCkuXyk7XHJcblx0XHRcdFx0aWYodSAhPT0gdG1wLnB1dCl7XHJcblx0XHRcdFx0XHRhdCA9IG9ial90byhhdCwge3B1dDogdG1wLnB1dH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRhcy51c2UoYXQsIGF0LmV2ZW50IHx8IGV2KTtcclxuXHRcdFx0ZXYudG8ubmV4dChhdCk7XHJcblx0XHR9XHJcblx0XHR2YXIgb2JqID0gR3VuLm9iaiwgb2JqX2hhcyA9IG9iai5oYXMsIG9ial90byA9IEd1bi5vYmoudG87XHJcblx0XHR2YXIgbnVtX2lzID0gR3VuLm51bS5pcztcclxuXHRcdHZhciByZWwgPSBHdW4udmFsLnJlbCwgbm9kZV8gPSBHdW4ubm9kZS5fO1xyXG5cdFx0dmFyIGVtcHR5ID0ge30sIHU7XHJcblx0fSkocmVxdWlyZSwgJy4vZ2V0Jyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9yb290Jyk7XHJcblx0XHRHdW4uY2hhaW4ucHV0ID0gZnVuY3Rpb24oZGF0YSwgY2IsIGFzKXtcclxuXHRcdFx0Ly8gI3NvdWwuZmllbGQ9dmFsdWU+c3RhdGVcclxuXHRcdFx0Ly8gfndobyN3aGVyZS53aGVyZT13aGF0PndoZW5Ad2FzXHJcblx0XHRcdC8vIFRPRE86IEJVRyEgUHV0IHByb2JhYmx5IGNhbm5vdCBoYW5kbGUgcGx1cmFsIGNoYWlucyFcclxuXHRcdFx0dmFyIGd1biA9IHRoaXMsIGF0ID0gKGd1bi5fKSwgcm9vdCA9IGF0LnJvb3QsIHRtcDtcclxuXHRcdFx0YXMgPSBhcyB8fCB7fTtcclxuXHRcdFx0YXMuZGF0YSA9IGRhdGE7XHJcblx0XHRcdGFzLmd1biA9IGFzLmd1biB8fCBndW47XHJcblx0XHRcdGlmKHR5cGVvZiBjYiA9PT0gJ3N0cmluZycpe1xyXG5cdFx0XHRcdGFzLnNvdWwgPSBjYjtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRhcy5hY2sgPSBjYjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihhdC5zb3VsKXtcclxuXHRcdFx0XHRhcy5zb3VsID0gYXQuc291bDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihhcy5zb3VsIHx8IHJvb3QgPT09IGd1bil7XHJcblx0XHRcdFx0aWYoIW9ial9pcyhhcy5kYXRhKSl7XHJcblx0XHRcdFx0XHQoYXMuYWNrfHxub29wKS5jYWxsKGFzLCBhcy5vdXQgPSB7ZXJyOiBHdW4ubG9nKFwiRGF0YSBzYXZlZCB0byB0aGUgcm9vdCBsZXZlbCBvZiB0aGUgZ3JhcGggbXVzdCBiZSBhIG5vZGUgKGFuIG9iamVjdCksIG5vdCBhXCIsICh0eXBlb2YgYXMuZGF0YSksICdvZiBcIicgKyBhcy5kYXRhICsgJ1wiIScpfSk7XHJcblx0XHRcdFx0XHRpZihhcy5yZXMpeyBhcy5yZXMoKSB9XHJcblx0XHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRhcy5ndW4gPSBndW4gPSByb290LmdldChhcy5zb3VsID0gYXMuc291bCB8fCAoYXMubm90ID0gR3VuLm5vZGUuc291bChhcy5kYXRhKSB8fCAoKHJvb3QuXykub3B0LnV1aWQgfHwgR3VuLnRleHQucmFuZG9tKSgpKSk7XHJcblx0XHRcdFx0YXMucmVmID0gYXMuZ3VuO1xyXG5cdFx0XHRcdGlmeShhcyk7XHJcblx0XHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihHdW4uaXMoZGF0YSkpe1xyXG5cdFx0XHRcdGRhdGEuZ2V0KGZ1bmN0aW9uKGF0LGV2KXtldi5vZmYoKTtcclxuXHRcdFx0XHRcdHZhciBzID0gR3VuLm5vZGUuc291bChhdC5wdXQpO1xyXG5cdFx0XHRcdFx0aWYoIXMpe0d1bi5sb2coXCJUaGUgcmVmZXJlbmNlIHlvdSBhcmUgc2F2aW5nIGlzIGFcIiwgdHlwZW9mIGF0LnB1dCwgJ1wiJysgYXMucHV0ICsnXCIsIG5vdCBhIG5vZGUgKG9iamVjdCkhJyk7cmV0dXJufVxyXG5cdFx0XHRcdFx0Z3VuLnB1dChHdW4udmFsLnJlbC5pZnkocyksIGNiLCBhcyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdFx0fVxyXG5cdFx0XHRhcy5yZWYgPSBhcy5yZWYgfHwgKHJvb3QgPT09ICh0bXAgPSBhdC5iYWNrKSk/IGd1biA6IHRtcDtcclxuXHRcdFx0aWYoYXMucmVmLl8uc291bCAmJiBHdW4udmFsLmlzKGFzLmRhdGEpICYmIGF0LmdldCl7XHJcblx0XHRcdFx0YXMuZGF0YSA9IG9ial9wdXQoe30sIGF0LmdldCwgYXMuZGF0YSk7XHJcblx0XHRcdFx0YXMucmVmLnB1dChhcy5kYXRhLCBhcy5zb3VsLCBhcyk7XHJcblx0XHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdFx0fVxyXG5cdFx0XHRhcy5yZWYuZ2V0KCdfJykuZ2V0KGFueSwge2FzOiBhc30pO1xyXG5cdFx0XHRpZighYXMub3V0KXtcclxuXHRcdFx0XHQvLyBUT0RPOiBQZXJmIGlkZWEhIE1ha2UgYSBnbG9iYWwgbG9jaywgdGhhdCBibG9ja3MgZXZlcnl0aGluZyB3aGlsZSBpdCBpcyBvbiwgYnV0IGlmIGl0IGlzIG9uIHRoZSBsb2NrIGl0IGRvZXMgdGhlIGV4cGVuc2l2ZSBsb29rdXAgdG8gc2VlIGlmIGl0IGlzIGEgZGVwZW5kZW50IHdyaXRlIG9yIG5vdCBhbmQgaWYgbm90IHRoZW4gaXQgcHJvY2VlZHMgZnVsbCBzcGVlZC4gTWVoPyBGb3Igd3JpdGUgaGVhdnkgYXN5bmMgYXBwcyB0aGF0IHdvdWxkIGJlIHRlcnJpYmxlLlxyXG5cdFx0XHRcdGFzLnJlcyA9IGFzLnJlcyB8fCBHdW4ub24uc3R1bihhcy5yZWYpO1xyXG5cdFx0XHRcdGFzLmd1bi5fLnN0dW4gPSBhcy5yZWYuXy5zdHVuO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBndW47XHJcblx0XHR9O1xyXG5cclxuXHRcdGZ1bmN0aW9uIGlmeShhcyl7XHJcblx0XHRcdGFzLmJhdGNoID0gYmF0Y2g7XHJcblx0XHRcdHZhciBvcHQgPSBhcy5vcHR8fHt9LCBlbnYgPSBhcy5lbnYgPSBHdW4uc3RhdGUubWFwKG1hcCwgb3B0LnN0YXRlKTtcclxuXHRcdFx0ZW52LnNvdWwgPSBhcy5zb3VsO1xyXG5cdFx0XHRhcy5ncmFwaCA9IEd1bi5ncmFwaC5pZnkoYXMuZGF0YSwgZW52LCBhcyk7XHJcblx0XHRcdGlmKGVudi5lcnIpe1xyXG5cdFx0XHRcdChhcy5hY2t8fG5vb3ApLmNhbGwoYXMsIGFzLm91dCA9IHtlcnI6IEd1bi5sb2coZW52LmVycil9KTtcclxuXHRcdFx0XHRpZihhcy5yZXMpeyBhcy5yZXMoKSB9XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFzLmJhdGNoKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gYmF0Y2goKXsgdmFyIGFzID0gdGhpcztcclxuXHRcdFx0aWYoIWFzLmdyYXBoIHx8IG9ial9tYXAoYXMuc3R1biwgbm8pKXsgcmV0dXJuIH1cclxuXHRcdFx0KGFzLnJlc3x8aWlmZSkoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHQoYXMucmVmLl8pLm9uKCdvdXQnLCB7XHJcblx0XHRcdFx0XHRjYXA6IDMsXHJcblx0XHRcdFx0XHRndW46IGFzLnJlZiwgcHV0OiBhcy5vdXQgPSBhcy5lbnYuZ3JhcGgsIG9wdDogYXMub3B0LFxyXG5cdFx0XHRcdFx0JyMnOiBhcy5ndW4uYmFjaygtMSkuXy5hc2soZnVuY3Rpb24oYWNrKXsgdGhpcy5vZmYoKTsgLy8gT25lIHJlc3BvbnNlIGlzIGdvb2QgZW5vdWdoIGZvciB1cyBjdXJyZW50bHkuIExhdGVyIHdlIG1heSB3YW50IHRvIGFkanVzdCB0aGlzLlxyXG5cdFx0XHRcdFx0XHRpZighYXMuYWNrKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdFx0YXMuYWNrKGFjaywgdGhpcyk7XHJcblx0XHRcdFx0XHR9LCBhcy5vcHQpXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0sIGFzKTtcclxuXHRcdFx0aWYoYXMucmVzKXsgYXMucmVzKCkgfVxyXG5cdFx0fSBmdW5jdGlvbiBubyh2LGYpeyBpZih2KXsgcmV0dXJuIHRydWUgfSB9XHJcblxyXG5cdFx0ZnVuY3Rpb24gbWFwKHYsZixuLCBhdCl7IHZhciBhcyA9IHRoaXM7XHJcblx0XHRcdGlmKGYgfHwgIWF0LnBhdGgubGVuZ3RoKXsgcmV0dXJuIH1cclxuXHRcdFx0KGFzLnJlc3x8aWlmZSkoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgcGF0aCA9IGF0LnBhdGgsIHJlZiA9IGFzLnJlZiwgb3B0ID0gYXMub3B0O1xyXG5cdFx0XHRcdHZhciBpID0gMCwgbCA9IHBhdGgubGVuZ3RoO1xyXG5cdFx0XHRcdGZvcihpOyBpIDwgbDsgaSsrKXtcclxuXHRcdFx0XHRcdHJlZiA9IHJlZi5nZXQocGF0aFtpXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGFzLm5vdCB8fCBHdW4ubm9kZS5zb3VsKGF0Lm9iaikpe1xyXG5cdFx0XHRcdFx0dmFyIGlkID0gR3VuLm5vZGUuc291bChhdC5vYmopIHx8ICgoYXMub3B0fHx7fSkudXVpZCB8fCBhcy5ndW4uYmFjaygnb3B0LnV1aWQnKSB8fCBHdW4udGV4dC5yYW5kb20pKCk7XHJcblx0XHRcdFx0XHRyZWYuYmFjaygtMSkuZ2V0KGlkKTtcclxuXHRcdFx0XHRcdGF0LnNvdWwoaWQpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQoYXMuc3R1biA9IGFzLnN0dW4gfHwge30pW3BhdGhdID0gdHJ1ZTtcclxuXHRcdFx0XHRyZWYuZ2V0KCdfJykuZ2V0KHNvdWwsIHthczoge2F0OiBhdCwgYXM6IGFzfX0pO1xyXG5cdFx0XHR9LCB7YXM6IGFzLCBhdDogYXR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBzb3VsKGF0LCBldil7IHZhciBhcyA9IHRoaXMuYXMsIGNhdCA9IGFzLmF0OyBhcyA9IGFzLmFzO1xyXG5cdFx0XHQvL2V2LnN0dW4oKTsgLy8gVE9ETzogQlVHIT9cclxuXHRcdFx0aWYoIWF0Lmd1biB8fCAhYXQuZ3VuLl8uYmFjayl7IHJldHVybiB9IC8vIFRPRE86IEhhbmRsZVxyXG5cdFx0XHRldi5vZmYoKTtcclxuXHRcdFx0YXQgPSAoYXQuZ3VuLl8uYmFjay5fKTtcclxuXHRcdFx0dmFyIGlkID0gR3VuLm5vZGUuc291bChjYXQub2JqKSB8fCBHdW4ubm9kZS5zb3VsKGF0LnB1dCkgfHwgR3VuLnZhbC5yZWwuaXMoYXQucHV0KSB8fCAoKGFzLm9wdHx8e30pLnV1aWQgfHwgYXMuZ3VuLmJhY2soJ29wdC51dWlkJykgfHwgR3VuLnRleHQucmFuZG9tKSgpOyAvLyBUT0RPOiBCVUchPyBEbyB3ZSByZWFsbHkgd2FudCB0aGUgc291bCBvZiB0aGUgb2JqZWN0IGdpdmVuIHRvIHVzPyBDb3VsZCB0aGF0IGJlIGRhbmdlcm91cz9cclxuXHRcdFx0YXQuZ3VuLmJhY2soLTEpLmdldChpZCk7XHJcblx0XHRcdGNhdC5zb3VsKGlkKTtcclxuXHRcdFx0YXMuc3R1bltjYXQucGF0aF0gPSBmYWxzZTtcclxuXHRcdFx0YXMuYmF0Y2goKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBhbnkoYXQsIGV2KXtcclxuXHRcdFx0dmFyIGFzID0gdGhpcy5hcztcclxuXHRcdFx0aWYoIWF0Lmd1biB8fCAhYXQuZ3VuLl8peyByZXR1cm4gfSAvLyBUT0RPOiBIYW5kbGVcclxuXHRcdFx0aWYoYXQuZXJyKXsgLy8gVE9ETzogSGFuZGxlXHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJQbGVhc2UgcmVwb3J0IHRoaXMgYXMgYW4gaXNzdWUhIFB1dC5hbnkuZXJyXCIpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgY2F0ID0gKGF0Lmd1bi5fLmJhY2suXyksIGRhdGEgPSBjYXQucHV0LCBvcHQgPSBhcy5vcHR8fHt9LCByb290LCB0bXA7XHJcblx0XHRcdGV2Lm9mZigpO1xyXG5cdFx0XHRpZihhcy5yZWYgIT09IGFzLmd1bil7XHJcblx0XHRcdFx0dG1wID0gKGFzLmd1bi5fKS5nZXQgfHwgY2F0LmdldDtcclxuXHRcdFx0XHRpZighdG1wKXsgLy8gVE9ETzogSGFuZGxlXHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIlBsZWFzZSByZXBvcnQgdGhpcyBhcyBhbiBpc3N1ZSEgUHV0Lm5vLmdldFwiKTsgLy8gVE9ETzogQlVHIT8/XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGFzLmRhdGEgPSBvYmpfcHV0KHt9LCB0bXAsIGFzLmRhdGEpO1xyXG5cdFx0XHRcdHRtcCA9IG51bGw7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYodSA9PT0gZGF0YSl7XHJcblx0XHRcdFx0aWYoIWNhdC5nZXQpeyByZXR1cm4gfSAvLyBUT0RPOiBIYW5kbGVcclxuXHRcdFx0XHRpZighY2F0LnNvdWwpe1xyXG5cdFx0XHRcdFx0dG1wID0gY2F0Lmd1bi5iYWNrKGZ1bmN0aW9uKGF0KXtcclxuXHRcdFx0XHRcdFx0aWYoYXQuc291bCl7IHJldHVybiBhdC5zb3VsIH1cclxuXHRcdFx0XHRcdFx0YXMuZGF0YSA9IG9ial9wdXQoe30sIGF0LmdldCwgYXMuZGF0YSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dG1wID0gdG1wIHx8IGNhdC5nZXQ7XHJcblx0XHRcdFx0Y2F0ID0gKGNhdC5yb290LmdldCh0bXApLl8pO1xyXG5cdFx0XHRcdGFzLm5vdCA9IGFzLnNvdWwgPSB0bXA7XHJcblx0XHRcdFx0ZGF0YSA9IGFzLmRhdGE7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoIWFzLm5vdCAmJiAhKGFzLnNvdWwgPSBHdW4ubm9kZS5zb3VsKGRhdGEpKSl7XHJcblx0XHRcdFx0aWYoYXMucGF0aCAmJiBvYmpfaXMoYXMuZGF0YSkpeyAvLyBBcHBhcmVudGx5IG5lY2Vzc2FyeVxyXG5cdFx0XHRcdFx0YXMuc291bCA9IChvcHQudXVpZCB8fCBjYXQucm9vdC5fLm9wdC51dWlkIHx8IEd1bi50ZXh0LnJhbmRvbSkoKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly9hcy5kYXRhID0gb2JqX3B1dCh7fSwgYXMuZ3VuLl8uZ2V0LCBhcy5kYXRhKTtcclxuXHRcdFx0XHRcdGFzLnNvdWwgPSBhdC5zb3VsIHx8IGNhdC5zb3VsIHx8IChvcHQudXVpZCB8fCBjYXQucm9vdC5fLm9wdC51dWlkIHx8IEd1bi50ZXh0LnJhbmRvbSkoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0YXMucmVmLnB1dChhcy5kYXRhLCBhcy5zb3VsLCBhcyk7XHJcblx0XHR9XHJcblx0XHR2YXIgb2JqID0gR3VuLm9iaiwgb2JqX2lzID0gb2JqLmlzLCBvYmpfcHV0ID0gb2JqLnB1dCwgb2JqX21hcCA9IG9iai5tYXA7XHJcblx0XHR2YXIgdSwgZW1wdHkgPSB7fSwgbm9vcCA9IGZ1bmN0aW9uKCl7fSwgaWlmZSA9IGZ1bmN0aW9uKGZuLGFzKXtmbi5jYWxsKGFzfHxlbXB0eSl9O1xyXG5cdH0pKHJlcXVpcmUsICcuL3B1dCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL3Jvb3QnKTtcclxuXHRcdG1vZHVsZS5leHBvcnRzID0gR3VuO1xyXG5cclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0ZnVuY3Rpb24gbWV0YSh2LGYpe1xyXG5cdFx0XHRcdGlmKG9ial9oYXMoR3VuLl9fLl8sIGYpKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRvYmpfcHV0KHRoaXMuXywgZiwgdik7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbWFwKHZhbHVlLCBmaWVsZCl7XHJcblx0XHRcdFx0aWYoR3VuLl8ubm9kZSA9PT0gZmllbGQpeyByZXR1cm4gfVxyXG5cdFx0XHRcdHZhciBub2RlID0gdGhpcy5ub2RlLCB2ZXJ0ZXggPSB0aGlzLnZlcnRleCwgdW5pb24gPSB0aGlzLnVuaW9uLCBtYWNoaW5lID0gdGhpcy5tYWNoaW5lO1xyXG5cdFx0XHRcdHZhciBpcyA9IHN0YXRlX2lzKG5vZGUsIGZpZWxkKSwgY3MgPSBzdGF0ZV9pcyh2ZXJ0ZXgsIGZpZWxkKTtcclxuXHRcdFx0XHRpZih1ID09PSBpcyB8fCB1ID09PSBjcyl7IHJldHVybiB0cnVlIH0gLy8gaXQgaXMgdHJ1ZSB0aGF0IHRoaXMgaXMgYW4gaW52YWxpZCBIQU0gY29tcGFyaXNvbi5cclxuXHRcdFx0XHR2YXIgaXYgPSB2YWx1ZSwgY3YgPSB2ZXJ0ZXhbZmllbGRdO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblx0XHRcdFx0Ly8gVE9ETzogQlVHISBOZWVkIHRvIGNvbXBhcmUgcmVsYXRpb24gdG8gbm90IHJlbGF0aW9uLCBhbmQgY2hvb3NlIHRoZSByZWxhdGlvbiBpZiB0aGVyZSBpcyBhIHN0YXRlIGNvbmZsaWN0LlxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblx0XHRcdFx0aWYoIXZhbF9pcyhpdikgJiYgdSAhPT0gaXYpeyByZXR1cm4gdHJ1ZSB9IC8vIFVuZGVmaW5lZCBpcyBva2F5IHNpbmNlIGEgdmFsdWUgbWlnaHQgbm90IGV4aXN0IG9uIGJvdGggbm9kZXMuIC8vIGl0IGlzIHRydWUgdGhhdCB0aGlzIGlzIGFuIGludmFsaWQgSEFNIGNvbXBhcmlzb24uXHJcblx0XHRcdFx0aWYoIXZhbF9pcyhjdikgJiYgdSAhPT0gY3YpeyByZXR1cm4gdHJ1ZSB9ICAvLyBVbmRlZmluZWQgaXMgb2theSBzaW5jZSBhIHZhbHVlIG1pZ2h0IG5vdCBleGlzdCBvbiBib3RoIG5vZGVzLiAvLyBpdCBpcyB0cnVlIHRoYXQgdGhpcyBpcyBhbiBpbnZhbGlkIEhBTSBjb21wYXJpc29uLlxyXG5cdFx0XHRcdHZhciBIQU0gPSBHdW4uSEFNKG1hY2hpbmUsIGlzLCBjcywgaXYsIGN2KTtcclxuXHRcdFx0XHRpZihIQU0uZXJyKXtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiLiFIWVBPVEhFVElDQUwgQU1ORVNJQSBNQUNISU5FIEVSUiEuXCIsIGZpZWxkLCBIQU0uZXJyKTsgLy8gdGhpcyBlcnJvciBzaG91bGQgbmV2ZXIgaGFwcGVuLlxyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihIQU0uc3RhdGUgfHwgSEFNLmhpc3RvcmljYWwgfHwgSEFNLmN1cnJlbnQpeyAvLyBUT0RPOiBCVUchIE5vdCBpbXBsZW1lbnRlZC5cclxuXHRcdFx0XHRcdC8vb3B0Lmxvd2VyKHZlcnRleCwge2ZpZWxkOiBmaWVsZCwgdmFsdWU6IHZhbHVlLCBzdGF0ZTogaXN9KTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoSEFNLmluY29taW5nKXtcclxuXHRcdFx0XHRcdHVuaW9uW2ZpZWxkXSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0c3RhdGVfaWZ5KHVuaW9uLCBmaWVsZCwgaXMpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihIQU0uZGVmZXIpeyAvLyBUT0RPOiBCVUchIE5vdCBpbXBsZW1lbnRlZC5cclxuXHRcdFx0XHRcdHVuaW9uW2ZpZWxkXSA9IHZhbHVlOyAvLyBXUk9ORyEgQlVHISBOZWVkIHRvIGltcGxlbWVudCBjb3JyZWN0IGFsZ29yaXRobS5cclxuXHRcdFx0XHRcdHN0YXRlX2lmeSh1bmlvbiwgZmllbGQsIGlzKTsgLy8gV1JPTkchIEJVRyEgTmVlZCB0byBpbXBsZW1lbnQgY29ycmVjdCBhbGdvcml0aG0uXHJcblx0XHRcdFx0XHQvLyBmaWxsZXIgYWxnb3JpdGhtIGZvciBub3cuXHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHQvKnVwcGVyLndhaXQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0b3B0LnVwcGVyLmNhbGwoc3RhdGUsIHZlcnRleCwgZmllbGQsIGluY29taW5nLCBjdHguaW5jb21pbmcuc3RhdGUpOyAvLyBzaWduYWxzIHRoYXQgdGhlcmUgYXJlIHN0aWxsIGZ1dHVyZSBtb2RpZmljYXRpb25zLlxyXG5cdFx0XHRcdFx0R3VuLnNjaGVkdWxlKGN0eC5pbmNvbWluZy5zdGF0ZSwgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdFx0dXBkYXRlKGluY29taW5nLCBmaWVsZCk7XHJcblx0XHRcdFx0XHRcdGlmKGN0eC5pbmNvbWluZy5zdGF0ZSA9PT0gdXBwZXIubWF4KXsgKHVwcGVyLmxhc3QgfHwgZnVuY3Rpb24oKXt9KSgpIH1cclxuXHRcdFx0XHRcdH0sIGd1bi5fXy5vcHQuc3RhdGUpOyovXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdEd1bi5IQU0udW5pb24gPSBmdW5jdGlvbih2ZXJ0ZXgsIG5vZGUsIG9wdCl7XHJcblx0XHRcdFx0aWYoIW5vZGUgfHwgIW5vZGUuXyl7IHJldHVybiB9XHJcblx0XHRcdFx0dmVydGV4ID0gdmVydGV4IHx8IEd1bi5ub2RlLnNvdWwuaWZ5KHtfOnsnPic6e319fSwgR3VuLm5vZGUuc291bChub2RlKSk7XHJcblx0XHRcdFx0aWYoIXZlcnRleCB8fCAhdmVydGV4Ll8peyByZXR1cm4gfVxyXG5cdFx0XHRcdG9wdCA9IG51bV9pcyhvcHQpPyB7bWFjaGluZTogb3B0fSA6IHttYWNoaW5lOiBHdW4uc3RhdGUoKX07XHJcblx0XHRcdFx0b3B0LnVuaW9uID0gdmVydGV4IHx8IEd1bi5vYmouY29weSh2ZXJ0ZXgpOyAvLyBUT0RPOiBQRVJGISBUaGlzIHdpbGwgc2xvdyB0aGluZ3MgZG93biFcclxuXHRcdFx0XHQvLyBUT0RPOiBQRVJGISBCaWdnZXN0IHNsb3dkb3duIChhZnRlciAxb2NhbFN0b3JhZ2UpIGlzIHRoZSBhYm92ZSBsaW5lLiBGaXghIEZpeCFcclxuXHRcdFx0XHRvcHQudmVydGV4ID0gdmVydGV4O1xyXG5cdFx0XHRcdG9wdC5ub2RlID0gbm9kZTtcclxuXHRcdFx0XHQvL29ial9tYXAobm9kZS5fLCBtZXRhLCBvcHQudW5pb24pOyAvLyBUT0RPOiBSZXZpZXcgYXQgc29tZSBwb2ludD9cclxuXHRcdFx0XHRpZihvYmpfbWFwKG5vZGUsIG1hcCwgb3B0KSl7IC8vIGlmIHRoaXMgcmV0dXJucyB0cnVlIHRoZW4gc29tZXRoaW5nIHdhcyBpbnZhbGlkLlxyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gb3B0LnVuaW9uO1xyXG5cdFx0XHR9XHJcblx0XHRcdEd1bi5IQU0uZGVsdGEgPSBmdW5jdGlvbih2ZXJ0ZXgsIG5vZGUsIG9wdCl7XHJcblx0XHRcdFx0b3B0ID0gbnVtX2lzKG9wdCk/IHttYWNoaW5lOiBvcHR9IDoge21hY2hpbmU6IEd1bi5zdGF0ZSgpfTtcclxuXHRcdFx0XHRpZighdmVydGV4KXsgcmV0dXJuIEd1bi5vYmouY29weShub2RlKSB9XHJcblx0XHRcdFx0b3B0LnNvdWwgPSBHdW4ubm9kZS5zb3VsKG9wdC52ZXJ0ZXggPSB2ZXJ0ZXgpO1xyXG5cdFx0XHRcdGlmKCFvcHQuc291bCl7IHJldHVybiB9XHJcblx0XHRcdFx0b3B0LmRlbHRhID0gR3VuLm5vZGUuc291bC5pZnkoe30sIG9wdC5zb3VsKTtcclxuXHRcdFx0XHRvYmpfbWFwKG9wdC5ub2RlID0gbm9kZSwgZGlmZiwgb3B0KTtcclxuXHRcdFx0XHRyZXR1cm4gb3B0LmRlbHRhO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIGRpZmYodmFsdWUsIGZpZWxkKXsgdmFyIG9wdCA9IHRoaXM7XHJcblx0XHRcdFx0aWYoR3VuLl8ubm9kZSA9PT0gZmllbGQpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGlmKCF2YWxfaXModmFsdWUpKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgbm9kZSA9IG9wdC5ub2RlLCB2ZXJ0ZXggPSBvcHQudmVydGV4LCBpcyA9IHN0YXRlX2lzKG5vZGUsIGZpZWxkLCB0cnVlKSwgY3MgPSBzdGF0ZV9pcyh2ZXJ0ZXgsIGZpZWxkLCB0cnVlKSwgZGVsdGEgPSBvcHQuZGVsdGE7XHJcblx0XHRcdFx0dmFyIEhBTSA9IEd1bi5IQU0ob3B0Lm1hY2hpbmUsIGlzLCBjcywgdmFsdWUsIHZlcnRleFtmaWVsZF0pO1xyXG5cclxuXHJcblxyXG5cdFx0XHRcdC8vIFRPRE86IEJVRyEhISEgV0hBVCBBQk9VVCBERUZFUlJFRCE/Pz9cclxuXHRcdFx0XHRcclxuXHJcblxyXG5cdFx0XHRcdGlmKEhBTS5pbmNvbWluZyl7XHJcblx0XHRcdFx0XHRkZWx0YVtmaWVsZF0gPSB2YWx1ZTtcclxuXHRcdFx0XHRcdHN0YXRlX2lmeShkZWx0YSwgZmllbGQsIGlzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0R3VuLkhBTS5zeW50aCA9IGZ1bmN0aW9uKGF0LCBldil7XHJcblx0XHRcdFx0dmFyIGFzID0gdGhpcy5hcywgY2F0ID0gYXMuZ3VuLl87XHJcblx0XHRcdFx0aWYoIWF0LnB1dCB8fCAoYXNbJy4nXSAmJiAhb2JqX2hhcyhhdC5wdXRbYXNbJyMnXV0sIGNhdC5nZXQpKSl7XHJcblx0XHRcdFx0XHRpZihjYXQucHV0ICE9PSB1KXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdGNhdC5vbignaW4nLCB7XHJcblx0XHRcdFx0XHRcdGdldDogY2F0LmdldCxcclxuXHRcdFx0XHRcdFx0cHV0OiBjYXQucHV0ID0gdSxcclxuXHRcdFx0XHRcdFx0Z3VuOiBjYXQuZ3VuLFxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YXQuZ3VuID0gY2F0LnJvb3Q7XHJcblx0XHRcdFx0R3VuLm9uKCdwdXQnLCBhdCk7XHJcblx0XHRcdH1cclxuXHRcdFx0R3VuLkhBTS5zeW50aF8gPSBmdW5jdGlvbihhdCwgZXYsIGFzKXsgdmFyIGd1biA9IHRoaXMuYXMgfHwgYXM7XHJcblx0XHRcdFx0dmFyIGNhdCA9IGd1bi5fLCByb290ID0gY2F0LnJvb3QuXywgcHV0ID0ge30sIHRtcDtcclxuXHRcdFx0XHRpZighYXQucHV0KXtcclxuXHRcdFx0XHRcdC8vaWYob2JqX2hhcyhjYXQsICdwdXQnKSl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRpZihjYXQucHV0ICE9PSB1KXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdGNhdC5vbignaW4nLCB7XHJcblx0XHRcdFx0XHQvL3Jvb3QuYWNrKGF0WydAJ10sIHtcclxuXHRcdFx0XHRcdFx0Z2V0OiBjYXQuZ2V0LFxyXG5cdFx0XHRcdFx0XHRwdXQ6IGNhdC5wdXQgPSB1LFxyXG5cdFx0XHRcdFx0XHRndW46IGd1bixcclxuXHRcdFx0XHRcdFx0dmlhOiBhdFxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gVE9ETzogUEVSRiEgSGF2ZSBvcHRpb25zIHRvIGRldGVybWluZSBpZiB0aGlzIGRhdGEgc2hvdWxkIGV2ZW4gYmUgaW4gbWVtb3J5IG9uIHRoaXMgcGVlciFcclxuXHRcdFx0XHRvYmpfbWFwKGF0LnB1dCwgZnVuY3Rpb24obm9kZSwgc291bCl7IHZhciBncmFwaCA9IHRoaXMuZ3JhcGg7XHJcblx0XHRcdFx0XHRwdXRbc291bF0gPSBHdW4uSEFNLmRlbHRhKGdyYXBoW3NvdWxdLCBub2RlLCB7Z3JhcGg6IGdyYXBofSk7IC8vIFRPRE86IFBFUkYhIFNFRSBJRiBXRSBDQU4gT1BUSU1JWkUgVEhJUyBCWSBNRVJHSU5HIFVOSU9OIElOVE8gREVMVEEhXHJcblx0XHRcdFx0XHRncmFwaFtzb3VsXSA9IEd1bi5IQU0udW5pb24oZ3JhcGhbc291bF0sIG5vZGUpIHx8IGdyYXBoW3NvdWxdO1xyXG5cdFx0XHRcdH0sIHJvb3QpO1xyXG5cdFx0XHRcdGlmKGF0Lmd1biAhPT0gcm9vdC5ndW4pe1xyXG5cdFx0XHRcdFx0cHV0ID0gYXQucHV0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBUT0RPOiBQRVJGISBIYXZlIG9wdGlvbnMgdG8gZGV0ZXJtaW5lIGlmIHRoaXMgZGF0YSBzaG91bGQgZXZlbiBiZSBpbiBtZW1vcnkgb24gdGhpcyBwZWVyIVxyXG5cdFx0XHRcdG9ial9tYXAocHV0LCBmdW5jdGlvbihub2RlLCBzb3VsKXtcclxuXHRcdFx0XHRcdHZhciByb290ID0gdGhpcywgbmV4dCA9IHJvb3QubmV4dCB8fCAocm9vdC5uZXh0ID0ge30pLCBndW4gPSBuZXh0W3NvdWxdIHx8IChuZXh0W3NvdWxdID0gcm9vdC5ndW4uZ2V0KHNvdWwpKSwgY29hdCA9IChndW4uXyk7XHJcblx0XHRcdFx0XHRjb2F0LnB1dCA9IHJvb3QuZ3JhcGhbc291bF07IC8vIFRPRE86IEJVRyEgQ2xvbmUhXHJcblx0XHRcdFx0XHRpZihjYXQuZmllbGQgJiYgIW9ial9oYXMobm9kZSwgY2F0LmZpZWxkKSl7XHJcblx0XHRcdFx0XHRcdChhdCA9IG9ial90byhhdCwge30pKS5wdXQgPSB1O1xyXG5cdFx0XHRcdFx0XHRHdW4uSEFNLnN5bnRoKGF0LCBldiwgY2F0Lmd1bik7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNvYXQub24oJ2luJywge1xyXG5cdFx0XHRcdFx0XHRwdXQ6IG5vZGUsXHJcblx0XHRcdFx0XHRcdGdldDogc291bCxcclxuXHRcdFx0XHRcdFx0Z3VuOiBndW4sXHJcblx0XHRcdFx0XHRcdHZpYTogYXRcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0sIHJvb3QpO1xyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cclxuXHRcdHZhciBUeXBlID0gR3VuO1xyXG5cdFx0dmFyIG51bSA9IFR5cGUubnVtLCBudW1faXMgPSBudW0uaXM7XHJcblx0XHR2YXIgb2JqID0gVHlwZS5vYmosIG9ial9oYXMgPSBvYmouaGFzLCBvYmpfcHV0ID0gb2JqLnB1dCwgb2JqX3RvID0gb2JqLnRvLCBvYmpfbWFwID0gb2JqLm1hcDtcclxuXHRcdHZhciBub2RlID0gR3VuLm5vZGUsIG5vZGVfc291bCA9IG5vZGUuc291bCwgbm9kZV9pcyA9IG5vZGUuaXMsIG5vZGVfaWZ5ID0gbm9kZS5pZnk7XHJcblx0XHR2YXIgc3RhdGUgPSBHdW4uc3RhdGUsIHN0YXRlX2lzID0gc3RhdGUuaXMsIHN0YXRlX2lmeSA9IHN0YXRlLmlmeTtcclxuXHRcdHZhciB2YWwgPSBHdW4udmFsLCB2YWxfaXMgPSB2YWwuaXMsIHJlbF9pcyA9IHZhbC5yZWwuaXM7XHJcblx0XHR2YXIgdTtcclxuXHR9KShyZXF1aXJlLCAnLi9pbmRleCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vcm9vdCcpO1xyXG5cdFx0cmVxdWlyZSgnLi9pbmRleCcpOyAvLyBUT0RPOiBDTEVBTiBVUCEgTUVSR0UgSU5UTyBST09UIVxyXG5cdFx0cmVxdWlyZSgnLi9vcHQnKTtcclxuXHRcdHJlcXVpcmUoJy4vY2hhaW4nKTtcclxuXHRcdHJlcXVpcmUoJy4vYmFjaycpO1xyXG5cdFx0cmVxdWlyZSgnLi9wdXQnKTtcclxuXHRcdHJlcXVpcmUoJy4vZ2V0Jyk7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IEd1bjtcclxuXHR9KShyZXF1aXJlLCAnLi9jb3JlJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9jb3JlJyk7XHJcblx0XHRHdW4uY2hhaW4ucGF0aCA9IGZ1bmN0aW9uKGZpZWxkLCBjYiwgb3B0KXtcclxuXHRcdFx0dmFyIGJhY2sgPSB0aGlzLCBndW4gPSBiYWNrLCB0bXA7XHJcblx0XHRcdG9wdCA9IG9wdCB8fCB7fTsgb3B0LnBhdGggPSB0cnVlO1xyXG5cdFx0XHRHdW4ubG9nLm9uY2UoXCJwYXRoaW5nXCIsIFwiV2FybmluZzogYC5wYXRoYCB0byBiZSByZW1vdmVkIGZyb20gY29yZSAoYnV0IGF2YWlsYWJsZSBhcyBhbiBleHRlbnNpb24pLCB1c2UgYC5nZXRgIGNoYWlucyBpbnN0ZWFkLiBJZiB5b3UgYXJlIG9wcG9zZWQgdG8gdGhpcywgcGxlYXNlIHZvaWNlIHlvdXIgb3BpbmlvbiBpbiBodHRwczovL2dpdHRlci5pbS9hbWFyay9ndW4gYW5kIGFzayBvdGhlcnMuXCIpO1xyXG5cdFx0XHRpZihndW4gPT09IGd1bi5fLnJvb3Qpe2lmKGNiKXtjYih7ZXJyOiBHdW4ubG9nKFwiQ2FuJ3QgZG8gdGhhdCBvbiByb290IGluc3RhbmNlLlwiKX0pfXJldHVybiBndW59XHJcblx0XHRcdGlmKHR5cGVvZiBmaWVsZCA9PT0gJ3N0cmluZycpe1xyXG5cdFx0XHRcdHRtcCA9IGZpZWxkLnNwbGl0KG9wdC5zcGxpdCB8fCAnLicpO1xyXG5cdFx0XHRcdGlmKDEgPT09IHRtcC5sZW5ndGgpe1xyXG5cdFx0XHRcdFx0Z3VuID0gYmFjay5nZXQoZmllbGQsIGNiLCBvcHQpO1xyXG5cdFx0XHRcdFx0Z3VuLl8ub3B0ID0gb3B0O1xyXG5cdFx0XHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZmllbGQgPSB0bXA7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoZmllbGQgaW5zdGFuY2VvZiBBcnJheSl7XHJcblx0XHRcdFx0aWYoZmllbGQubGVuZ3RoID4gMSl7XHJcblx0XHRcdFx0XHRndW4gPSBiYWNrO1xyXG5cdFx0XHRcdFx0dmFyIGkgPSAwLCBsID0gZmllbGQubGVuZ3RoO1xyXG5cdFx0XHRcdFx0Zm9yKGk7IGkgPCBsOyBpKyspe1xyXG5cdFx0XHRcdFx0XHRndW4gPSBndW4uZ2V0KGZpZWxkW2ldLCAoaSsxID09PSBsKT8gY2IgOiBudWxsLCBvcHQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly9ndW4uYmFjayA9IGJhY2s7IC8vIFRPRE86IEFQSSBjaGFuZ2UhXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGd1biA9IGJhY2suZ2V0KGZpZWxkWzBdLCBjYiwgb3B0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Z3VuLl8ub3B0ID0gb3B0O1xyXG5cdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoIWZpZWxkICYmIDAgIT0gZmllbGQpe1xyXG5cdFx0XHRcdHJldHVybiBiYWNrO1xyXG5cdFx0XHR9XHJcblx0XHRcdGd1biA9IGJhY2suZ2V0KCcnK2ZpZWxkLCBjYiwgb3B0KTtcclxuXHRcdFx0Z3VuLl8ub3B0ID0gb3B0O1xyXG5cdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0fVxyXG5cdH0pKHJlcXVpcmUsICcuL3BhdGgnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL2NvcmUnKTtcclxuXHRcdEd1bi5jaGFpbi5vbiA9IGZ1bmN0aW9uKHRhZywgYXJnLCBlYXMsIGFzKXtcclxuXHRcdFx0dmFyIGd1biA9IHRoaXMsIGF0ID0gZ3VuLl8sIHRtcCwgYWN0LCBvZmY7XHJcblx0XHRcdGlmKHR5cGVvZiB0YWcgPT09ICdzdHJpbmcnKXtcclxuXHRcdFx0XHRpZighYXJnKXsgcmV0dXJuIGF0Lm9uKHRhZykgfVxyXG5cdFx0XHRcdGFjdCA9IGF0Lm9uKHRhZywgYXJnLCBlYXMgfHwgYXQsIGFzKTtcclxuXHRcdFx0XHRpZihlYXMgJiYgZWFzLmd1bil7XHJcblx0XHRcdFx0XHQoZWFzLnN1YnMgfHwgKGVhcy5zdWJzID0gW10pKS5wdXNoKGFjdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG9mZiA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0aWYgKGFjdCAmJiBhY3Qub2ZmKSBhY3Qub2ZmKCk7XHJcblx0XHRcdFx0XHRvZmYub2ZmKCk7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRvZmYub2ZmID0gZ3VuLm9mZi5iaW5kKGd1bikgfHwgbm9vcDtcclxuXHRcdFx0XHRndW4ub2ZmID0gb2ZmO1xyXG5cdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIG9wdCA9IGFyZztcclxuXHRcdFx0b3B0ID0gKHRydWUgPT09IG9wdCk/IHtjaGFuZ2U6IHRydWV9IDogb3B0IHx8IHt9O1xyXG5cdFx0XHRvcHQub2sgPSB0YWc7XHJcblx0XHRcdG9wdC5sYXN0ID0ge307XHJcblx0XHRcdGd1bi5nZXQob2ssIG9wdCk7IC8vIFRPRE86IFBFUkYhIEV2ZW50IGxpc3RlbmVyIGxlYWshISE/Pz8/XHJcblx0XHRcdHJldHVybiBndW47XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gb2soYXQsIGV2KXsgdmFyIG9wdCA9IHRoaXM7XHJcblx0XHRcdHZhciBndW4gPSBhdC5ndW4sIGNhdCA9IGd1bi5fLCBkYXRhID0gY2F0LnB1dCB8fCBhdC5wdXQsIHRtcCA9IG9wdC5sYXN0LCBpZCA9IGNhdC5pZCthdC5nZXQsIHRtcDtcclxuXHRcdFx0aWYodSA9PT0gZGF0YSl7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGRhdGEgJiYgZGF0YVtyZWwuX10gJiYgKHRtcCA9IHJlbC5pcyhkYXRhKSkpe1xyXG5cdFx0XHRcdHRtcCA9IChjYXQucm9vdC5nZXQodG1wKS5fKTtcclxuXHRcdFx0XHRpZih1ID09PSB0bXAucHV0KXtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZGF0YSA9IHRtcC5wdXQ7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYob3B0LmNoYW5nZSl7IC8vIFRPRE86IEJVRz8gTW92ZSBhYm92ZSB0aGUgdW5kZWYgY2hlY2tzP1xyXG5cdFx0XHRcdGRhdGEgPSBhdC5wdXQ7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gREVEVVBMSUNBVEUgLy8gVE9ETzogTkVFRFMgV09SSyEgQkFEIFBST1RPVFlQRVxyXG5cdFx0XHRpZih0bXAucHV0ID09PSBkYXRhICYmIHRtcC5nZXQgPT09IGlkICYmICFHdW4ubm9kZS5zb3VsKGRhdGEpKXsgcmV0dXJuIH1cclxuXHRcdFx0dG1wLnB1dCA9IGRhdGE7XHJcblx0XHRcdHRtcC5nZXQgPSBpZDtcclxuXHRcdFx0Ly8gREVEVVBMSUNBVEUgLy8gVE9ETzogTkVFRFMgV09SSyEgQkFEIFBST1RPVFlQRVxyXG5cdFx0XHRjYXQubGFzdCA9IGRhdGE7XHJcblx0XHRcdGlmKG9wdC5hcyl7XHJcblx0XHRcdFx0b3B0Lm9rLmNhbGwob3B0LmFzLCBhdCwgZXYpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG9wdC5vay5jYWxsKGd1biwgZGF0YSwgYXQuZ2V0LCBhdCwgZXYpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0R3VuLmNoYWluLnZhbCA9IGZ1bmN0aW9uKGNiLCBvcHQpe1xyXG5cdFx0XHR2YXIgZ3VuID0gdGhpcywgYXQgPSBndW4uXywgZGF0YSA9IGF0LnB1dDtcclxuXHRcdFx0aWYoMCA8IGF0LmFjayAmJiB1ICE9PSBkYXRhKXtcclxuXHRcdFx0XHQoY2IgfHwgbm9vcCkuY2FsbChndW4sIGRhdGEsIGF0LmdldCk7XHJcblx0XHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjYil7XHJcblx0XHRcdFx0KG9wdCA9IG9wdCB8fCB7fSkub2sgPSBjYjtcclxuXHRcdFx0XHRvcHQuY2F0ID0gYXQ7XHJcblx0XHRcdFx0Z3VuLmdldCh2YWwsIHthczogb3B0fSk7XHJcblx0XHRcdFx0b3B0LmFzeW5jID0gdHJ1ZTsgLy9vcHQuYXN5bmMgPSBhdC5zdHVuPyAxIDogdHJ1ZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRHdW4ubG9nLm9uY2UoXCJ2YWxvbmNlXCIsIFwiQ2hhaW5hYmxlIHZhbCBpcyBleHBlcmltZW50YWwsIGl0cyBiZWhhdmlvciBhbmQgQVBJIG1heSBjaGFuZ2UgbW92aW5nIGZvcndhcmQuIFBsZWFzZSBwbGF5IHdpdGggaXQgYW5kIHJlcG9ydCBidWdzIGFuZCBpZGVhcyBvbiBob3cgdG8gaW1wcm92ZSBpdC5cIik7XHJcblx0XHRcdFx0dmFyIGNoYWluID0gZ3VuLmNoYWluKCk7XHJcblx0XHRcdFx0Y2hhaW4uXy52YWwgPSBndW4udmFsKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRjaGFpbi5fLm9uKCdpbicsIGd1bi5fKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRyZXR1cm4gY2hhaW47XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiB2YWwoYXQsIGV2LCB0byl7XHJcblx0XHRcdHZhciBvcHQgPSB0aGlzLmFzLCBjYXQgPSBvcHQuY2F0LCBndW4gPSBhdC5ndW4sIGNvYXQgPSBndW4uXywgZGF0YSA9IGNvYXQucHV0IHx8IGF0LnB1dCwgdG1wO1xyXG5cdFx0XHRpZih1ID09PSBkYXRhKXtcclxuXHRcdFx0XHQvL3JldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihkYXRhICYmIGRhdGFbcmVsLl9dICYmICh0bXAgPSByZWwuaXMoZGF0YSkpKXtcclxuXHRcdFx0XHR0bXAgPSAoY2F0LnJvb3QuZ2V0KHRtcCkuXyk7XHJcblx0XHRcdFx0aWYodSA9PT0gdG1wLnB1dCl7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGRhdGEgPSB0bXAucHV0O1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGV2LndhaXQpeyBjbGVhclRpbWVvdXQoZXYud2FpdCkgfVxyXG5cdFx0XHQvL2lmKCF0byAmJiAoISgwIDwgY29hdC5hY2spIHx8ICgodHJ1ZSA9PT0gb3B0LmFzeW5jKSAmJiAwICE9PSBvcHQud2FpdCkpKXtcclxuXHRcdFx0aWYoIW9wdC5hc3luYyl7XHJcblx0XHRcdFx0ZXYud2FpdCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdHZhbC5jYWxsKHthczpvcHR9LCBhdCwgZXYsIGV2LndhaXQgfHwgMSlcclxuXHRcdFx0XHR9LCBvcHQud2FpdCB8fCA5OSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNhdC5maWVsZCB8fCBjYXQuc291bCl7XHJcblx0XHRcdFx0aWYoZXYub2ZmKCkpeyByZXR1cm4gfSAvLyBpZiBpdCBpcyBhbHJlYWR5IG9mZiwgZG9uJ3QgY2FsbCBhZ2FpbiFcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZigob3B0LnNlZW4gPSBvcHQuc2VlbiB8fCB7fSlbY29hdC5pZF0peyByZXR1cm4gfVxyXG5cdFx0XHRcdG9wdC5zZWVuW2NvYXQuaWRdID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRvcHQub2suY2FsbChhdC5ndW4gfHwgb3B0Lmd1biwgZGF0YSwgYXQuZ2V0KTtcclxuXHRcdH1cclxuXHJcblx0XHRHdW4uY2hhaW4ub2ZmID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIGd1biA9IHRoaXMsIGF0ID0gZ3VuLl8sIHRtcDtcclxuXHRcdFx0dmFyIGJhY2sgPSBhdC5iYWNrIHx8IHt9LCBjYXQgPSBiYWNrLl87XHJcblx0XHRcdGlmKCFjYXQpeyByZXR1cm4gfVxyXG5cdFx0XHRpZih0bXAgPSBjYXQubmV4dCl7XHJcblx0XHRcdFx0aWYodG1wW2F0LmdldF0pe1xyXG5cdFx0XHRcdFx0b2JqX2RlbCh0bXAsIGF0LmdldCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdG9ial9tYXAodG1wLCBmdW5jdGlvbihwYXRoLCBrZXkpe1xyXG5cdFx0XHRcdFx0XHRpZihndW4gIT09IHBhdGgpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0XHRvYmpfZGVsKHRtcCwga2V5KTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZigodG1wID0gZ3VuLmJhY2soLTEpKSA9PT0gYmFjayl7XHJcblx0XHRcdFx0b2JqX2RlbCh0bXAuZ3JhcGgsIGF0LmdldCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoYXQub25zICYmICh0bXAgPSBhdC5vbnNbJ0AkJ10pKXtcclxuXHRcdFx0XHRvYmpfbWFwKHRtcC5zLCBmdW5jdGlvbihldil7XHJcblx0XHRcdFx0XHRldi5vZmYoKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0fVxyXG5cdFx0dmFyIG9iaiA9IEd1bi5vYmosIG9ial9oYXMgPSBvYmouaGFzLCBvYmpfZGVsID0gb2JqLmRlbCwgb2JqX3RvID0gb2JqLnRvO1xyXG5cdFx0dmFyIHJlbCA9IEd1bi52YWwucmVsO1xyXG5cdFx0dmFyIGVtcHR5ID0ge30sIG5vb3AgPSBmdW5jdGlvbigpe30sIHU7XHJcblx0fSkocmVxdWlyZSwgJy4vb24nKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL2NvcmUnKSwgdTtcclxuXHRcdEd1bi5jaGFpbi5ub3QgPSBmdW5jdGlvbihjYiwgb3B0LCB0KXtcclxuXHRcdFx0R3VuLmxvZy5vbmNlKFwibm90dG9iZVwiLCBcIldhcm5pbmc6IGAubm90YCB0byBiZSByZW1vdmVkIGZyb20gY29yZSAoYnV0IGF2YWlsYWJsZSBhcyBhbiBleHRlbnNpb24pLCB1c2UgYC52YWxgIGluc3RlYWQsIHdoaWNoIG5vdyBzdXBwb3J0cyAodjAuNy54KykgJ25vdCBmb3VuZCBkYXRhJyBhcyBgdW5kZWZpbmVkYCBkYXRhIGluIGNhbGxiYWNrcy4gSWYgeW91IGFyZSBvcHBvc2VkIHRvIHRoaXMsIHBsZWFzZSB2b2ljZSB5b3VyIG9waW5pb24gaW4gaHR0cHM6Ly9naXR0ZXIuaW0vYW1hcmsvZ3VuIGFuZCBhc2sgb3RoZXJzLlwiKTtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZ2V0KG91Z2h0LCB7bm90OiBjYn0pO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gb3VnaHQoYXQsIGV2KXsgZXYub2ZmKCk7XHJcblx0XHRcdGlmKGF0LmVyciB8fCAodSAhPT0gYXQucHV0KSl7IHJldHVybiB9XHJcblx0XHRcdGlmKCF0aGlzLm5vdCl7IHJldHVybiB9XHJcblx0XHRcdHRoaXMubm90LmNhbGwoYXQuZ3VuLCBhdC5nZXQsIGZ1bmN0aW9uKCl7IGNvbnNvbGUubG9nKFwiUGxlYXNlIHJlcG9ydCB0aGlzIGJ1ZyBvbiBodHRwczovL2dpdHRlci5pbS9hbWFyay9ndW4gYW5kIGluIHRoZSBpc3N1ZXMuXCIpOyBuZWVkLnRvLmltcGxlbWVudDsgfSk7XHJcblx0XHR9XHJcblx0fSkocmVxdWlyZSwgJy4vbm90Jyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9jb3JlJyk7XHJcblx0XHRHdW4uY2hhaW4ubWFwID0gZnVuY3Rpb24oY2IsIG9wdCwgdCl7XHJcblx0XHRcdHZhciBndW4gPSB0aGlzLCBjYXQgPSBndW4uXywgY2hhaW47XHJcblx0XHRcdGlmKCFjYil7XHJcblx0XHRcdFx0aWYoY2hhaW4gPSBjYXQuZmllbGRzKXsgcmV0dXJuIGNoYWluIH1cclxuXHRcdFx0XHRjaGFpbiA9IGNhdC5maWVsZHMgPSBndW4uY2hhaW4oKTtcclxuXHRcdFx0XHRjaGFpbi5fLnZhbCA9IGd1bi5iYWNrKCd2YWwnKTtcclxuXHRcdFx0XHRndW4ub24oJ2luJywgbWFwLCBjaGFpbi5fKTtcclxuXHRcdFx0XHRyZXR1cm4gY2hhaW47XHJcblx0XHRcdH1cclxuXHRcdFx0R3VuLmxvZy5vbmNlKFwibWFwZm5cIiwgXCJNYXAgZnVuY3Rpb25zIGFyZSBleHBlcmltZW50YWwsIHRoZWlyIGJlaGF2aW9yIGFuZCBBUEkgbWF5IGNoYW5nZSBtb3ZpbmcgZm9yd2FyZC4gUGxlYXNlIHBsYXkgd2l0aCBpdCBhbmQgcmVwb3J0IGJ1Z3MgYW5kIGlkZWFzIG9uIGhvdyB0byBpbXByb3ZlIGl0LlwiKTtcclxuXHRcdFx0Y2hhaW4gPSBndW4uY2hhaW4oKTtcclxuXHRcdFx0Z3VuLm1hcCgpLm9uKGZ1bmN0aW9uKGRhdGEsIGtleSwgYXQsIGV2KXtcclxuXHRcdFx0XHR2YXIgbmV4dCA9IChjYnx8bm9vcCkuY2FsbCh0aGlzLCBkYXRhLCBrZXksIGF0LCBldik7XHJcblx0XHRcdFx0aWYodSA9PT0gbmV4dCl7IHJldHVybiB9XHJcblx0XHRcdFx0aWYoR3VuLmlzKG5leHQpKXtcclxuXHRcdFx0XHRcdGNoYWluLl8ub24oJ2luJywgbmV4dC5fKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2hhaW4uXy5vbignaW4nLCB7Z2V0OiBrZXksIHB1dDogbmV4dCwgZ3VuOiBjaGFpbn0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIGNoYWluO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gbWFwKGF0KXtcclxuXHRcdFx0aWYoIWF0LnB1dCB8fCBHdW4udmFsLmlzKGF0LnB1dCkpeyByZXR1cm4gfVxyXG5cdFx0XHRpZih0aGlzLmFzLnZhbCl7IHRoaXMub2ZmKCkgfSAvLyBUT0RPOiBVZ2x5IGhhY2shXHJcblx0XHRcdG9ial9tYXAoYXQucHV0LCBlYWNoLCB7Y2F0OiB0aGlzLmFzLCBndW46IGF0Lmd1bn0pO1xyXG5cdFx0XHR0aGlzLnRvLm5leHQoYXQpO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gZWFjaCh2LGYpe1xyXG5cdFx0XHRpZihuXyA9PT0gZil7IHJldHVybiB9XHJcblx0XHRcdHZhciBjYXQgPSB0aGlzLmNhdCwgZ3VuID0gdGhpcy5ndW4uZ2V0KGYpLCBhdCA9IChndW4uXyk7XHJcblx0XHRcdChhdC5lY2hvIHx8IChhdC5lY2hvID0ge30pKVtjYXQuaWRdID0gY2F0O1xyXG5cdFx0fVxyXG5cdFx0dmFyIG9ial9tYXAgPSBHdW4ub2JqLm1hcCwgbm9vcCA9IGZ1bmN0aW9uKCl7fSwgZXZlbnQgPSB7c3R1bjogbm9vcCwgb2ZmOiBub29wfSwgbl8gPSBHdW4ubm9kZS5fLCB1O1xyXG5cdH0pKHJlcXVpcmUsICcuL21hcCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vY29yZScpO1xyXG5cdFx0R3VuLmNoYWluLnNldCA9IGZ1bmN0aW9uKGl0ZW0sIGNiLCBvcHQpe1xyXG5cdFx0XHR2YXIgZ3VuID0gdGhpcywgc291bDtcclxuXHRcdFx0Y2IgPSBjYiB8fCBmdW5jdGlvbigpe307XHJcblx0XHRcdGlmKHNvdWwgPSBHdW4ubm9kZS5zb3VsKGl0ZW0pKXsgcmV0dXJuIGd1bi5zZXQoZ3VuLmJhY2soLTEpLmdldChzb3VsKSwgY2IsIG9wdCkgfVxyXG5cdFx0XHRpZighR3VuLmlzKGl0ZW0pKXtcclxuXHRcdFx0XHRpZihHdW4ub2JqLmlzKGl0ZW0pKXsgcmV0dXJuIGd1bi5zZXQoZ3VuLl8ucm9vdC5wdXQoaXRlbSksIGNiLCBvcHQpIH1cclxuXHRcdFx0XHRyZXR1cm4gZ3VuLmdldChHdW4udGV4dC5yYW5kb20oKSkucHV0KGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGl0ZW0uZ2V0KCdfJykuZ2V0KGZ1bmN0aW9uKGF0LCBldil7XHJcblx0XHRcdFx0aWYoIWF0Lmd1biB8fCAhYXQuZ3VuLl8uYmFjayk7XHJcblx0XHRcdFx0ZXYub2ZmKCk7XHJcblx0XHRcdFx0YXQgPSAoYXQuZ3VuLl8uYmFjay5fKTtcclxuXHRcdFx0XHR2YXIgcHV0ID0ge30sIG5vZGUgPSBhdC5wdXQsIHNvdWwgPSBHdW4ubm9kZS5zb3VsKG5vZGUpO1xyXG5cdFx0XHRcdGlmKCFzb3VsKXsgcmV0dXJuIGNiLmNhbGwoZ3VuLCB7ZXJyOiBHdW4ubG9nKCdPbmx5IGEgbm9kZSBjYW4gYmUgbGlua2VkISBOb3QgXCInICsgbm9kZSArICdcIiEnKX0pIH1cclxuXHRcdFx0XHRndW4ucHV0KEd1bi5vYmoucHV0KHB1dCwgc291bCwgR3VuLnZhbC5yZWwuaWZ5KHNvdWwpKSwgY2IsIG9wdCk7XHJcblx0XHRcdH0se3dhaXQ6MH0pO1xyXG5cdFx0XHRyZXR1cm4gaXRlbTtcclxuXHRcdH1cclxuXHR9KShyZXF1aXJlLCAnLi9zZXQnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdGlmKHR5cGVvZiBHdW4gPT09ICd1bmRlZmluZWQnKXsgcmV0dXJuIH0gLy8gVE9ETzogbG9jYWxTdG9yYWdlIGlzIEJyb3dzZXIgb25seS4gQnV0IGl0IHdvdWxkIGJlIG5pY2UgaWYgaXQgY291bGQgc29tZWhvdyBwbHVnaW4gaW50byBOb2RlSlMgY29tcGF0aWJsZSBsb2NhbFN0b3JhZ2UgQVBJcz9cclxuXHJcblx0XHR2YXIgcm9vdCwgbm9vcCA9IGZ1bmN0aW9uKCl7fSwgdTtcclxuXHRcdGlmKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKXsgcm9vdCA9IHdpbmRvdyB9XHJcblx0XHR2YXIgc3RvcmUgPSByb290LmxvY2FsU3RvcmFnZSB8fCB7c2V0SXRlbTogbm9vcCwgcmVtb3ZlSXRlbTogbm9vcCwgZ2V0SXRlbTogbm9vcH07XHJcblxyXG5cdFx0dmFyIGNoZWNrID0ge30sIGRpcnR5ID0ge30sIGFzeW5jID0ge30sIGNvdW50ID0gMCwgbWF4ID0gMTAwMDAsIHdhaXQ7XHJcblx0XHRcclxuXHRcdEd1bi5vbigncHV0JywgZnVuY3Rpb24oYXQpeyB2YXIgZXJyLCBpZCwgb3B0LCByb290ID0gYXQuZ3VuLl8ucm9vdDtcclxuXHRcdFx0dGhpcy50by5uZXh0KGF0KTtcclxuXHRcdFx0KG9wdCA9IHt9KS5wcmVmaXggPSAoYXQub3B0IHx8IG9wdCkucHJlZml4IHx8IGF0Lmd1bi5iYWNrKCdvcHQucHJlZml4JykgfHwgJ2d1bi8nO1xyXG5cdFx0XHR2YXIgZ3JhcGggPSByb290Ll8uZ3JhcGg7XHJcblx0XHRcdEd1bi5vYmoubWFwKGF0LnB1dCwgZnVuY3Rpb24obm9kZSwgc291bCl7XHJcblx0XHRcdFx0YXN5bmNbc291bF0gPSBhc3luY1tzb3VsXSB8fCBncmFwaFtzb3VsXSB8fCBub2RlO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0Y291bnQgKz0gMTtcclxuXHRcdFx0aWYoIWF0WydAJ10peyBjaGVja1thdFsnIyddXSA9IHJvb3Q7IH0gLy8gb25seSBhY2sgbm9uLWFja3MuXHJcblx0XHRcdGZ1bmN0aW9uIHNhdmUoKXtcclxuXHRcdFx0XHRjbGVhclRpbWVvdXQod2FpdCk7XHJcblx0XHRcdFx0dmFyIGFjayA9IGNoZWNrO1xyXG5cdFx0XHRcdHZhciBhbGwgPSBhc3luYztcclxuXHRcdFx0XHRjb3VudCA9IDA7XHJcblx0XHRcdFx0d2FpdCA9IGZhbHNlO1xyXG5cdFx0XHRcdGNoZWNrID0ge307XHJcblx0XHRcdFx0YXN5bmMgPSB7fTtcclxuXHRcdFx0XHRHdW4ub2JqLm1hcChhbGwsIGZ1bmN0aW9uKG5vZGUsIHNvdWwpe1xyXG5cdFx0XHRcdFx0Ly8gU2luY2UgbG9jYWxTdG9yYWdlIG9ubHkgaGFzIDVNQiwgaXQgaXMgYmV0dGVyIHRoYXQgd2Uga2VlcCBvbmx5XHJcblx0XHRcdFx0XHQvLyB0aGUgZGF0YSB0aGF0IHRoZSB1c2VyIGlzIGN1cnJlbnRseSBpbnRlcmVzdGVkIGluLlxyXG5cdFx0XHRcdFx0bm9kZSA9IGdyYXBoW3NvdWxdIHx8IGFsbFtzb3VsXSB8fCBub2RlO1xyXG5cdFx0XHRcdFx0dHJ5e3N0b3JlLnNldEl0ZW0ob3B0LnByZWZpeCArIHNvdWwsIEpTT04uc3RyaW5naWZ5KG5vZGUpKTtcclxuXHRcdFx0XHRcdH1jYXRjaChlKXsgZXJyID0gZSB8fCBcImxvY2FsU3RvcmFnZSBmYWlsdXJlXCIgfVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdGlmKCFHdW4ub2JqLmVtcHR5KGF0Lmd1bi5iYWNrKCdvcHQucGVlcnMnKSkpeyByZXR1cm4gfSAvLyBvbmx5IGFjayBpZiB0aGVyZSBhcmUgbm8gcGVlcnMuXHJcblx0XHRcdFx0R3VuLm9iai5tYXAoYWNrLCBmdW5jdGlvbihyb290LCBpZCl7XHJcblx0XHRcdFx0XHRyb290Lm9uKCdpbicsIHtcclxuXHRcdFx0XHRcdFx0J0AnOiBpZCxcclxuXHRcdFx0XHRcdFx0ZXJyOiBlcnIsXHJcblx0XHRcdFx0XHRcdG9rOiAwIC8vIGxvY2FsU3RvcmFnZSBpc24ndCByZWxpYWJsZSwgc28gbWFrZSBpdHMgYG9rYCBjb2RlIGJlIGEgbG93IG51bWJlci5cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNvdW50ID49IG1heCl7IC8vIGdvYWwgaXMgdG8gZG8gMTBLIGluc2VydHMvc2Vjb25kLlxyXG5cdFx0XHRcdHJldHVybiBzYXZlKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYod2FpdCl7IHJldHVybiB9XHJcblx0XHRcdGNsZWFyVGltZW91dCh3YWl0KTtcclxuXHRcdFx0d2FpdCA9IHNldFRpbWVvdXQoc2F2ZSwgMTAwMCk7XHJcblx0XHR9KTtcclxuXHRcdEd1bi5vbignZ2V0JywgZnVuY3Rpb24oYXQpe1xyXG5cdFx0XHR0aGlzLnRvLm5leHQoYXQpO1xyXG5cdFx0XHR2YXIgZ3VuID0gYXQuZ3VuLCBsZXggPSBhdC5nZXQsIHNvdWwsIGRhdGEsIG9wdCwgdTtcclxuXHRcdFx0Ly9zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdChvcHQgPSBhdC5vcHQgfHwge30pLnByZWZpeCA9IG9wdC5wcmVmaXggfHwgYXQuZ3VuLmJhY2soJ29wdC5wcmVmaXgnKSB8fCAnZ3VuLyc7XHJcblx0XHRcdGlmKCFsZXggfHwgIShzb3VsID0gbGV4W0d1bi5fLnNvdWxdKSl7IHJldHVybiB9XHJcblx0XHRcdC8vaWYoMCA+PSBhdC5jYXApeyByZXR1cm4gfVxyXG5cdFx0XHR2YXIgZmllbGQgPSBsZXhbJy4nXTtcclxuXHRcdFx0ZGF0YSA9IEd1bi5vYmouaWZ5KHN0b3JlLmdldEl0ZW0ob3B0LnByZWZpeCArIHNvdWwpIHx8IG51bGwpIHx8IGFzeW5jW3NvdWxdIHx8IHU7XHJcblx0XHRcdGlmKGRhdGEgJiYgZmllbGQpe1xyXG5cdFx0XHRcdGRhdGEgPSBHdW4uc3RhdGUudG8oZGF0YSwgZmllbGQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCFkYXRhICYmICFHdW4ub2JqLmVtcHR5KGd1bi5iYWNrKCdvcHQucGVlcnMnKSkpeyAvLyBpZiBkYXRhIG5vdCBmb3VuZCwgZG9uJ3QgYWNrIGlmIHRoZXJlIGFyZSBwZWVycy5cclxuXHRcdFx0XHRyZXR1cm47IC8vIEhtbSwgd2hhdCBpZiB3ZSBoYXZlIHBlZXJzIGJ1dCB3ZSBhcmUgZGlzY29ubmVjdGVkP1xyXG5cdFx0XHR9XHJcblx0XHRcdGd1bi5vbignaW4nLCB7J0AnOiBhdFsnIyddLCBwdXQ6IEd1bi5ncmFwaC5ub2RlKGRhdGEpLCBob3c6ICdsUyd9KTtcclxuXHRcdFx0Ly99LDExKTtcclxuXHRcdH0pO1xyXG5cdH0pKHJlcXVpcmUsICcuL2FkYXB0ZXJzL2xvY2FsU3RvcmFnZScpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vY29yZScpO1xyXG5cclxuXHRcdGlmICh0eXBlb2YgSlNPTiA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFxyXG5cdFx0XHRcdCdHdW4gZGVwZW5kcyBvbiBKU09OLiBQbGVhc2UgbG9hZCBpdCBmaXJzdDpcXG4nICtcclxuXHRcdFx0XHQnYWpheC5jZG5qcy5jb20vYWpheC9saWJzL2pzb24yLzIwMTEwMjIzL2pzb24yLmpzJ1xyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBXZWJTb2NrZXQ7XHJcblx0XHRpZih0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyl7XHJcblx0XHRcdFdlYlNvY2tldCA9IHdpbmRvdy5XZWJTb2NrZXQgfHwgd2luZG93LndlYmtpdFdlYlNvY2tldCB8fCB3aW5kb3cubW96V2ViU29ja2V0O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0dmFyIG1lc3NhZ2UsIGNvdW50ID0gMCwgbm9vcCA9IGZ1bmN0aW9uKCl7fSwgd2FpdDtcclxuXHJcblx0XHRHdW4ub24oJ291dCcsIGZ1bmN0aW9uKGF0KXtcclxuXHRcdFx0dGhpcy50by5uZXh0KGF0KTtcclxuXHRcdFx0dmFyIGNhdCA9IGF0Lmd1bi5fLnJvb3QuXywgd3NwID0gY2F0LndzcCB8fCAoY2F0LndzcCA9IHt9KTtcclxuXHRcdFx0aWYoYXQud3NwICYmIDEgPT09IHdzcC5jb3VudCl7IHJldHVybiB9IC8vIGlmIHRoZSBtZXNzYWdlIGNhbWUgRlJPTSB0aGUgb25seSBwZWVyIHdlIGFyZSBjb25uZWN0ZWQgdG8sIGRvbid0IGVjaG8gaXQgYmFjay5cclxuXHRcdFx0bWVzc2FnZSA9IEpTT04uc3RyaW5naWZ5KGF0KTtcclxuXHRcdFx0Ly9pZigrK2NvdW50KXsgY29uc29sZS5sb2coXCJtc2cgT1VUOlwiLCBjb3VudCwgR3VuLm9iai5pZnkobWVzc2FnZSkpIH1cclxuXHRcdFx0aWYoY2F0LnVkcmFpbil7XHJcblx0XHRcdFx0Y2F0LnVkcmFpbi5wdXNoKG1lc3NhZ2UpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRjYXQudWRyYWluID0gW107XHJcblx0XHRcdGNsZWFyVGltZW91dCh3YWl0KTtcclxuXHRcdFx0d2FpdCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRpZighY2F0LnVkcmFpbil7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIHRtcCA9IGNhdC51ZHJhaW47XHJcblx0XHRcdFx0Y2F0LnVkcmFpbiA9IG51bGw7XHJcblx0XHRcdFx0aWYoIHRtcC5sZW5ndGggKSB7XHJcblx0XHRcdFx0XHRtZXNzYWdlID0gSlNPTi5zdHJpbmdpZnkodG1wKTtcclxuXHRcdFx0XHRcdEd1bi5vYmoubWFwKGNhdC5vcHQucGVlcnMsIHNlbmQsIGNhdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LDEpO1xyXG5cdFx0XHR3c3AuY291bnQgPSAwO1xyXG5cdFx0XHRHdW4ub2JqLm1hcChjYXQub3B0LnBlZXJzLCBzZW5kLCBjYXQpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gc2VuZChwZWVyKXtcclxuXHRcdFx0dmFyIG1zZyA9IG1lc3NhZ2UsIGNhdCA9IHRoaXM7XHJcblx0XHRcdHZhciB3aXJlID0gcGVlci53aXJlIHx8IG9wZW4ocGVlciwgY2F0KTtcclxuXHRcdFx0aWYoY2F0LndzcCl7IGNhdC53c3AuY291bnQrKyB9XHJcblx0XHRcdGlmKCF3aXJlKXsgcmV0dXJuIH1cclxuXHRcdFx0aWYod2lyZS5yZWFkeVN0YXRlID09PSB3aXJlLk9QRU4pe1xyXG5cdFx0XHRcdHdpcmUuc2VuZChtc2cpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHQocGVlci5xdWV1ZSA9IHBlZXIucXVldWUgfHwgW10pLnB1c2gobXNnKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiByZWNlaXZlKG1zZywgcGVlciwgY2F0KXtcclxuXHRcdFx0aWYoIWNhdCB8fCAhbXNnKXsgcmV0dXJuIH1cclxuXHRcdFx0dHJ5e21zZyA9IEpTT04ucGFyc2UobXNnLmRhdGEgfHwgbXNnKTtcclxuXHRcdFx0fWNhdGNoKGUpe31cclxuXHRcdFx0aWYobXNnIGluc3RhbmNlb2YgQXJyYXkpe1xyXG5cdFx0XHRcdHZhciBpID0gMCwgbTtcclxuXHRcdFx0XHR3aGlsZShtID0gbXNnW2krK10pe1xyXG5cdFx0XHRcdFx0cmVjZWl2ZShtLCBwZWVyLCBjYXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0Ly9pZigrK2NvdW50KXsgY29uc29sZS5sb2coXCJtc2cgaW46XCIsIGNvdW50LCBtc2cuYm9keSB8fCBtc2cpIH1cclxuXHRcdFx0aWYoY2F0LndzcCAmJiAxID09PSBjYXQud3NwLmNvdW50KXsgKG1zZy5ib2R5IHx8IG1zZykud3NwID0gbm9vcCB9IC8vIElmIHRoZXJlIGlzIG9ubHkgMSBjbGllbnQsIGp1c3QgdXNlIG5vb3Agc2luY2UgaXQgZG9lc24ndCBtYXR0ZXIuXHJcblx0XHRcdGNhdC5ndW4ub24oJ2luJywgbXNnLmJvZHkgfHwgbXNnKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBvcGVuKHBlZXIsIGFzKXtcclxuXHRcdFx0aWYoIXBlZXIgfHwgIXBlZXIudXJsKXsgcmV0dXJuIH1cclxuXHRcdFx0dmFyIHVybCA9IHBlZXIudXJsLnJlcGxhY2UoJ2h0dHAnLCAnd3MnKTtcclxuXHRcdFx0dmFyIHdpcmUgPSBwZWVyLndpcmUgPSBuZXcgV2ViU29ja2V0KHVybCwgYXMub3B0LndzYy5wcm90b2NvbHMsIGFzLm9wdC53c2MgKTtcclxuXHRcdFx0d2lyZS5vbmNsb3NlID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRyZWNvbm5lY3QocGVlciwgYXMpO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHR3aXJlLm9uZXJyb3IgPSBmdW5jdGlvbihlcnJvcil7XHJcblx0XHRcdFx0cmVjb25uZWN0KHBlZXIsIGFzKTtcclxuXHRcdFx0XHRpZighZXJyb3IpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGlmKGVycm9yLmNvZGUgPT09ICdFQ09OTlJFRlVTRUQnKXtcclxuXHRcdFx0XHRcdC8vcmVjb25uZWN0KHBlZXIsIGFzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdHdpcmUub25vcGVuID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgcXVldWUgPSBwZWVyLnF1ZXVlO1xyXG5cdFx0XHRcdHBlZXIucXVldWUgPSBbXTtcclxuXHRcdFx0XHRHdW4ub2JqLm1hcChxdWV1ZSwgZnVuY3Rpb24obXNnKXtcclxuXHRcdFx0XHRcdG1lc3NhZ2UgPSBtc2c7XHJcblx0XHRcdFx0XHRzZW5kLmNhbGwoYXMsIHBlZXIpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdHdpcmUub25tZXNzYWdlID0gZnVuY3Rpb24obXNnKXtcclxuXHRcdFx0XHRyZWNlaXZlKG1zZywgcGVlciwgYXMpO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHRyZXR1cm4gd2lyZTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiByZWNvbm5lY3QocGVlciwgYXMpe1xyXG5cdFx0XHRjbGVhclRpbWVvdXQocGVlci5kZWZlcik7XHJcblx0XHRcdHBlZXIuZGVmZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0b3BlbihwZWVyLCBhcyk7XHJcblx0XHRcdH0sIDIgKiAxMDAwKTtcclxuXHRcdH1cclxuXHR9KShyZXF1aXJlLCAnLi9wb2x5ZmlsbC9yZXF1ZXN0Jyk7XHJcblxyXG59KCkpO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L2d1bi9ndW4uanMiLCIvKipcbiAqIENyZWF0ZWQgYnkgTGVvbiBSZXZpbGwgb24gMTUvMTIvMjAxNS5cbiAqIEJsb2c6IGJsb2cucmV2aWxsd2ViLmNvbVxuICogR2l0SHViOiBodHRwczovL2dpdGh1Yi5jb20vUmV2aWxsV2ViXG4gKiBUd2l0dGVyOiBAUmV2aWxsV2ViXG4gKi9cblxuLyoqXG4gKiBUaGUgbWFpbiByb3V0ZXIgY2xhc3MgYW5kIGVudHJ5IHBvaW50IHRvIHRoZSByb3V0ZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWJlbFJvdXRlciBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxuICAgIC8qKlxuICAgICAqIE1haW4gaW5pdGlhbGlzYXRpb24gcG9pbnQgb2YgcmViZWwtcm91dGVyXG4gICAgICogQHBhcmFtIHByZWZpeCAtIElmIGV4dGVuZGluZyByZWJlbC1yb3V0ZXIgeW91IGNhbiBzcGVjaWZ5IGEgcHJlZml4IHdoZW4gY2FsbGluZyBjcmVhdGVkQ2FsbGJhY2sgaW4gY2FzZSB5b3VyIGVsZW1lbnRzIG5lZWQgdG8gYmUgbmFtZWQgZGlmZmVyZW50bHlcbiAgICAgKi9cbiAgICBjcmVhdGVkQ2FsbGJhY2socHJlZml4KSB7XG5cbiAgICAgICAgY29uc3QgX3ByZWZpeCA9IHByZWZpeCB8fCBcInJlYmVsXCI7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnByZXZpb3VzUGF0aCA9IG51bGw7XG4gICAgICAgIHRoaXMuYmFzZVBhdGggPSBudWxsO1xuXG4gICAgICAgIC8vR2V0IG9wdGlvbnNcbiAgICAgICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgICAgICAgXCJhbmltYXRpb25cIjogKHRoaXMuZ2V0QXR0cmlidXRlKFwiYW5pbWF0aW9uXCIpID09IFwidHJ1ZVwiKSxcbiAgICAgICAgICAgIFwic2hhZG93Um9vdFwiOiAodGhpcy5nZXRBdHRyaWJ1dGUoXCJzaGFkb3dcIikgPT0gXCJ0cnVlXCIpLFxuICAgICAgICAgICAgXCJpbmhlcml0XCI6ICh0aGlzLmdldEF0dHJpYnV0ZShcImluaGVyaXRcIikgIT0gXCJmYWxzZVwiKVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vR2V0IHJvdXRlc1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmluaGVyaXQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIC8vSWYgdGhpcyBpcyBhIG5lc3RlZCByb3V0ZXIgdGhlbiB3ZSBuZWVkIHRvIGdvIGFuZCBnZXQgdGhlIHBhcmVudCBwYXRoXG4gICAgICAgICAgICBsZXQgJGVsZW1lbnQgPSB0aGlzO1xuICAgICAgICAgICAgd2hpbGUgKCRlbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgICAgICAkZWxlbWVudCA9ICRlbGVtZW50LnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgaWYgKCRlbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT0gX3ByZWZpeCArIFwiLXJvdXRlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnQgPSAkZWxlbWVudC5jdXJyZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmFzZVBhdGggPSBjdXJyZW50LnJvdXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yb3V0ZXMgPSB7fTtcbiAgICAgICAgY29uc3QgJGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0ICRjaGlsZCA9ICRjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGxldCBwYXRoID0gJGNoaWxkLmdldEF0dHJpYnV0ZShcInBhdGhcIik7XG4gICAgICAgICAgICBzd2l0Y2ggKCRjaGlsZC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBfcHJlZml4ICsgXCItZGVmYXVsdFwiOlxuICAgICAgICAgICAgICAgICAgICBwYXRoID0gXCIqXCI7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgX3ByZWZpeCArIFwiLXJvdXRlXCI6XG4gICAgICAgICAgICAgICAgICAgIHBhdGggPSAodGhpcy5iYXNlUGF0aCAhPT0gbnVsbCkgPyB0aGlzLmJhc2VQYXRoICsgcGF0aCA6IHBhdGg7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBhdGggIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBsZXQgJHRlbXBsYXRlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBpZiAoJGNoaWxkLmlubmVySFRNTCkge1xuICAgICAgICAgICAgICAgICAgICAkdGVtcGxhdGUgPSBcIjxcIiArIF9wcmVmaXggKyBcIi1yb3V0ZT5cIiArICRjaGlsZC5pbm5lckhUTUwgKyBcIjwvXCIgKyBfcHJlZml4ICsgXCItcm91dGU+XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucm91dGVzW3BhdGhdID0ge1xuICAgICAgICAgICAgICAgICAgICBcImNvbXBvbmVudFwiOiAkY2hpbGQuZ2V0QXR0cmlidXRlKFwiY29tcG9uZW50XCIpLFxuICAgICAgICAgICAgICAgICAgICBcInRlbXBsYXRlXCI6ICR0ZW1wbGF0ZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL0FmdGVyIHdlIGhhdmUgY29sbGVjdGVkIGFsbCBjb25maWd1cmF0aW9uIGNsZWFyIGlubmVySFRNTFxuICAgICAgICB0aGlzLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaGFkb3dSb290ID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVNoYWRvd1Jvb3QoKTtcbiAgICAgICAgICAgIHRoaXMucm9vdCA9IHRoaXMuc2hhZG93Um9vdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucm9vdCA9IHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hbmltYXRpb24gPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdEFuaW1hdGlvbigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgIFJlYmVsUm91dGVyLnBhdGhDaGFuZ2UoKGlzQmFjaykgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hbmltYXRpb24gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNCYWNrID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZChcInJibC1iYWNrXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZShcInJibC1iYWNrXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRnVuY3Rpb24gdXNlZCB0byBpbml0aWFsaXNlIHRoZSBhbmltYXRpb24gbWVjaGFuaWNzIGlmIGFuaW1hdGlvbiBpcyB0dXJuZWQgb25cbiAgICAgKi9cbiAgICBpbml0QW5pbWF0aW9uKCkge1xuICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnMpID0+IHtcbiAgICAgICAgICAgIGxldCBub2RlID0gbXV0YXRpb25zWzBdLmFkZGVkTm9kZXNbMF07XG4gICAgICAgICAgICBpZiAobm9kZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3RoZXJDaGlsZHJlbiA9IHRoaXMuZ2V0T3RoZXJDaGlsZHJlbihub2RlKTtcbiAgICAgICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5hZGQoXCJyZWJlbC1hbmltYXRlXCIpO1xuICAgICAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChcImVudGVyXCIpO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAob3RoZXJDaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdGhlckNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQuY2xhc3NMaXN0LmFkZChcImV4aXRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLmNsYXNzTGlzdC5hZGQoXCJjb21wbGV0ZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAxMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChcImNvbXBsZXRlXCIpO1xuICAgICAgICAgICAgICAgICAgICB9LCAxMCk7XG4gICAgICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICAgICAgICAgIGNvbnN0IGFuaW1hdGlvbkVuZCA9IChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LmNsYXNzTmFtZS5pbmRleE9mKFwiZXhpdFwiKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJvb3QucmVtb3ZlQ2hpbGQoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKFwidHJhbnNpdGlvbmVuZFwiLCBhbmltYXRpb25FbmQpO1xuICAgICAgICAgICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihcImFuaW1hdGlvbmVuZFwiLCBhbmltYXRpb25FbmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLCB7Y2hpbGRMaXN0OiB0cnVlfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWV0aG9kIHVzZWQgdG8gZ2V0IHRoZSBjdXJyZW50IHJvdXRlIG9iamVjdFxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGN1cnJlbnQoKSB7XG4gICAgICAgIGNvbnN0IHBhdGggPSBSZWJlbFJvdXRlci5nZXRQYXRoRnJvbVVybCgpO1xuICAgICAgICBmb3IgKGNvbnN0IHJvdXRlIGluIHRoaXMucm91dGVzKSB7XG4gICAgICAgICAgICBpZiAocm91dGUgIT09IFwiKlwiKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJlZ2V4U3RyaW5nID0gXCJeXCIgKyByb3V0ZS5yZXBsYWNlKC97XFx3K31cXC8/L2csIFwiKFxcXFx3KylcXC8/XCIpO1xuICAgICAgICAgICAgICAgIHJlZ2V4U3RyaW5nICs9IChyZWdleFN0cmluZy5pbmRleE9mKFwiXFxcXC8/XCIpID4gLTEpID8gXCJcIiA6IFwiXFxcXC8/XCIgKyBcIihbPz0mLVxcL1xcXFx3K10rKT8kXCI7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKHJlZ2V4U3RyaW5nKTtcbiAgICAgICAgICAgICAgICBpZiAocmVnZXgudGVzdChwYXRoKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3JvdXRlUmVzdWx0KHRoaXMucm91dGVzW3JvdXRlXSwgcm91dGUsIHJlZ2V4LCBwYXRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICh0aGlzLnJvdXRlc1tcIipcIl0gIT09IHVuZGVmaW5lZCkgPyBfcm91dGVSZXN1bHQodGhpcy5yb3V0ZXNbXCIqXCJdLCBcIipcIiwgbnVsbCwgcGF0aCkgOiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1ldGhvZCBjYWxsZWQgdG8gcmVuZGVyIHRoZSBjdXJyZW50IHZpZXdcbiAgICAgKi9cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuY3VycmVudCgpO1xuICAgICAgICBpZiAocmVzdWx0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0LnBhdGggIT09IHRoaXMucHJldmlvdXNQYXRoIHx8IHRoaXMub3B0aW9ucy5hbmltYXRpb24gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmFuaW1hdGlvbiAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvb3QuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5jb21wb25lbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0ICRjb21wb25lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHJlc3VsdC5jb21wb25lbnQpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gcmVzdWx0LnBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gcmVzdWx0LnBhcmFtc1trZXldO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSBcIk9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBKU09OLnBhcnNlKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDb3VsZG4ndCBwYXJzZSBwYXJhbSB2YWx1ZTpcIiwgZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgJGNvbXBvbmVudC5zZXRBdHRyaWJ1dGUoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb290LmFwcGVuZENoaWxkKCRjb21wb25lbnQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCAkdGVtcGxhdGUgPSByZXN1bHQudGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIC8vVE9ETzogRmluZCBhIGZhc3RlciBhbHRlcm5hdGl2ZVxuICAgICAgICAgICAgICAgICAgICBpZiAoJHRlbXBsYXRlLmluZGV4T2YoXCIke1wiKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGVtcGxhdGUgPSAkdGVtcGxhdGUucmVwbGFjZSgvXFwkeyhbXnt9XSopfS9nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByID0gcmVzdWx0LnBhcmFtc1tiXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiByID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgciA9PT0gJ251bWJlcicgPyByIDogYTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm9vdC5pbm5lckhUTUwgPSAkdGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucHJldmlvdXNQYXRoID0gcmVzdWx0LnBhdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIG5vZGUgLSBVc2VkIHdpdGggdGhlIGFuaW1hdGlvbiBtZWNoYW5pY3MgdG8gZ2V0IGFsbCBvdGhlciB2aWV3IGNoaWxkcmVuIGV4Y2VwdCBpdHNlbGZcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAgICovXG4gICAgZ2V0T3RoZXJDaGlsZHJlbihub2RlKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkcmVuID0gdGhpcy5yb290LmNoaWxkcmVuO1xuICAgICAgICBsZXQgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGlmIChjaGlsZCAhPSBub2RlKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBTdGF0aWMgaGVscGVyIG1ldGhvZCB0byBwYXJzZSB0aGUgcXVlcnkgc3RyaW5nIGZyb20gYSB1cmwgaW50byBhbiBvYmplY3QuXG4gICAgICogQHBhcmFtIHVybFxuICAgICAqIEByZXR1cm5zIHt7fX1cbiAgICAgKi9cbiAgICBzdGF0aWMgcGFyc2VRdWVyeVN0cmluZyh1cmwpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgICBpZiAodXJsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHZhciBxdWVyeVN0cmluZyA9ICh1cmwuaW5kZXhPZihcIj9cIikgPiAtMSkgPyB1cmwuc3Vic3RyKHVybC5pbmRleE9mKFwiP1wiKSArIDEsIHVybC5sZW5ndGgpIDogbnVsbDtcbiAgICAgICAgICAgIGlmIChxdWVyeVN0cmluZyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHF1ZXJ5U3RyaW5nLnNwbGl0KFwiJlwiKS5mb3JFYWNoKGZ1bmN0aW9uIChwYXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcGFydCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICBwYXJ0ID0gcGFydC5yZXBsYWNlKFwiK1wiLCBcIiBcIik7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlcSA9IHBhcnQuaW5kZXhPZihcIj1cIik7XG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXkgPSBlcSA+IC0xID8gcGFydC5zdWJzdHIoMCwgZXEpIDogcGFydDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbCA9IGVxID4gLTEgPyBkZWNvZGVVUklDb21wb25lbnQocGFydC5zdWJzdHIoZXEgKyAxKSkgOiBcIlwiO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZnJvbSA9IGtleS5pbmRleE9mKFwiW1wiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZyb20gPT0gLTEpIHJlc3VsdFtkZWNvZGVVUklDb21wb25lbnQoa2V5KV0gPSB2YWw7XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRvID0ga2V5LmluZGV4T2YoXCJdXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZGVjb2RlVVJJQ29tcG9uZW50KGtleS5zdWJzdHJpbmcoZnJvbSArIDEsIHRvKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXkgPSBkZWNvZGVVUklDb21wb25lbnQoa2V5LnN1YnN0cmluZygwLCBmcm9tKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdFtrZXldKSByZXN1bHRba2V5XSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpbmRleCkgcmVzdWx0W2tleV0ucHVzaCh2YWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSByZXN1bHRba2V5XVtpbmRleF0gPSB2YWw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0YXRpYyBoZWxwZXIgbWV0aG9kIHRvIGNvbnZlcnQgYSBjbGFzcyBuYW1lIHRvIGEgdmFsaWQgZWxlbWVudCBuYW1lLlxuICAgICAqIEBwYXJhbSBDbGFzc1xuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgc3RhdGljIGNsYXNzVG9UYWcoQ2xhc3MpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENsYXNzLm5hbWUgd291bGQgYmUgYmV0dGVyIGJ1dCB0aGlzIGlzbid0IHN1cHBvcnRlZCBpbiBJRSAxMS5cbiAgICAgICAgICovXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgbmFtZSA9IENsYXNzLnRvU3RyaW5nKCkubWF0Y2goL15mdW5jdGlvblxccyooW15cXHMoXSspLylbMV0ucmVwbGFjZSgvXFxXKy9nLCAnLScpLnJlcGxhY2UoLyhbYS16XFxkXSkoW0EtWjAtOV0pL2csICckMS0kMicpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IHBhcnNlIGNsYXNzIG5hbWU6XCIsIGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChSZWJlbFJvdXRlci52YWxpZEVsZW1lbnRUYWcobmFtZSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDbGFzcyBuYW1lIGNvdWxkbid0IGJlIHRyYW5zbGF0ZWQgdG8gdGFnLlwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmFtZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdGF0aWMgaGVscGVyIG1ldGhvZCB1c2VkIHRvIGRldGVybWluZSBpZiBhbiBlbGVtZW50IHdpdGggdGhlIHNwZWNpZmllZCBuYW1lIGhhcyBhbHJlYWR5IGJlZW4gcmVnaXN0ZXJlZC5cbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIHN0YXRpYyBpc1JlZ2lzdGVyZWRFbGVtZW50KG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmFtZSkuY29uc3RydWN0b3IgIT09IEhUTUxFbGVtZW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0YXRpYyBoZWxwZXIgbWV0aG9kIHRvIHRha2UgYSB3ZWIgY29tcG9uZW50IGNsYXNzLCBjcmVhdGUgYW4gZWxlbWVudCBuYW1lIGFuZCByZWdpc3RlciB0aGUgbmV3IGVsZW1lbnQgb24gdGhlIGRvY3VtZW50LlxuICAgICAqIEBwYXJhbSBDbGFzc1xuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgc3RhdGljIGNyZWF0ZUVsZW1lbnQoQ2xhc3MpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IFJlYmVsUm91dGVyLmNsYXNzVG9UYWcoQ2xhc3MpO1xuICAgICAgICBpZiAoUmViZWxSb3V0ZXIuaXNSZWdpc3RlcmVkRWxlbWVudChuYW1lKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIENsYXNzLnByb3RvdHlwZS5uYW1lID0gbmFtZTtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChuYW1lLCBDbGFzcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2ltcGxlIHN0YXRpYyBoZWxwZXIgbWV0aG9kIGNvbnRhaW5pbmcgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gdmFsaWRhdGUgYW4gZWxlbWVudCBuYW1lXG4gICAgICogQHBhcmFtIHRhZ1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIHN0YXRpYyB2YWxpZEVsZW1lbnRUYWcodGFnKSB7XG4gICAgICAgIHJldHVybiAvXlthLXowLTlcXC1dKyQvLnRlc3QodGFnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNZXRob2QgdXNlZCB0byByZWdpc3RlciBhIGNhbGxiYWNrIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBVUkwgcGF0aCBjaGFuZ2VzLlxuICAgICAqIEBwYXJhbSBjYWxsYmFja1xuICAgICAqL1xuICAgIHN0YXRpYyBwYXRoQ2hhbmdlKGNhbGxiYWNrKSB7XG4gICAgICAgIGlmIChSZWJlbFJvdXRlci5jaGFuZ2VDYWxsYmFja3MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgUmViZWxSb3V0ZXIuY2hhbmdlQ2FsbGJhY2tzID0gW107XG4gICAgICAgIH1cbiAgICAgICAgUmViZWxSb3V0ZXIuY2hhbmdlQ2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgICAgICBjb25zdCBjaGFuZ2VIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiAgZXZlbnQub2xkVVJMIGFuZCBldmVudC5uZXdVUkwgd291bGQgYmUgYmV0dGVyIGhlcmUgYnV0IHRoaXMgZG9lc24ndCB3b3JrIGluIElFIDooXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uaHJlZiAhPSBSZWJlbFJvdXRlci5vbGRVUkwpIHtcbiAgICAgICAgICAgICAgICBSZWJlbFJvdXRlci5jaGFuZ2VDYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbihjYWxsYmFjayl7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKFJlYmVsUm91dGVyLmlzQmFjayk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgUmViZWxSb3V0ZXIuaXNCYWNrID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBSZWJlbFJvdXRlci5vbGRVUkwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHdpbmRvdy5vbmhhc2hjaGFuZ2UgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmJsYmFja1wiLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIFJlYmVsUm91dGVyLmlzQmFjayA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cub25oYXNoY2hhbmdlID0gY2hhbmdlSGFuZGxlcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdGF0aWMgaGVscGVyIG1ldGhvZCB1c2VkIHRvIGdldCB0aGUgcGFyYW1ldGVycyBmcm9tIHRoZSBwcm92aWRlZCByb3V0ZS5cbiAgICAgKiBAcGFyYW0gcmVnZXhcbiAgICAgKiBAcGFyYW0gcm91dGVcbiAgICAgKiBAcGFyYW0gcGF0aFxuICAgICAqIEByZXR1cm5zIHt7fX1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0UGFyYW1zRnJvbVVybChyZWdleCwgcm91dGUsIHBhdGgpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFJlYmVsUm91dGVyLnBhcnNlUXVlcnlTdHJpbmcocGF0aCk7XG4gICAgICAgIHZhciByZSA9IC97KFxcdyspfS9nO1xuICAgICAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgICAgICBsZXQgbWF0Y2g7XG4gICAgICAgIHdoaWxlIChtYXRjaCA9IHJlLmV4ZWMocm91dGUpKSB7XG4gICAgICAgICAgICByZXN1bHRzLnB1c2gobWF0Y2hbMV0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWdleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdHMyID0gcmVnZXguZXhlYyhwYXRoKTtcbiAgICAgICAgICAgIHJlc3VsdHMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaWR4KSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W2l0ZW1dID0gcmVzdWx0czJbaWR4ICsgMV07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0YXRpYyBoZWxwZXIgbWV0aG9kIHVzZWQgdG8gZ2V0IHRoZSBwYXRoIGZyb20gdGhlIGN1cnJlbnQgVVJMLlxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRQYXRoRnJvbVVybCgpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLm1hdGNoKC8jKC4qKSQvKTtcbiAgICAgICAgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFsxXTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwicmViZWwtcm91dGVyXCIsIFJlYmVsUm91dGVyKTtcblxuLyoqXG4gKiBDbGFzcyB3aGljaCByZXByZXNlbnRzIHRoZSByZWJlbC1yb3V0ZSBjdXN0b20gZWxlbWVudFxuICovXG5leHBvcnQgY2xhc3MgUmViZWxSb3V0ZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxufVxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwicmViZWwtcm91dGVcIiwgUmViZWxSb3V0ZSk7XG5cbi8qKlxuICogQ2xhc3Mgd2hpY2ggcmVwcmVzZW50cyB0aGUgcmViZWwtZGVmYXVsdCBjdXN0b20gZWxlbWVudFxuICovXG5jbGFzcyBSZWJlbERlZmF1bHQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cbn1cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcInJlYmVsLWRlZmF1bHRcIiwgUmViZWxEZWZhdWx0KTtcblxuXG4vKipcbiAqIFJlcHJlc2VudHMgdGhlIHByb3RvdHlwZSBmb3IgYW4gYW5jaG9yIGVsZW1lbnQgd2hpY2ggYWRkZWQgZnVuY3Rpb25hbGl0eSB0byBwZXJmb3JtIGEgYmFjayB0cmFuc2l0aW9uLlxuICovXG5jbGFzcyBSZWJlbEJhY2tBIGV4dGVuZHMgSFRNTEFuY2hvckVsZW1lbnQge1xuICAgIGF0dGFjaGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGF0aCA9IHRoaXMuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKTtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBpZiAocGF0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdyYmxiYWNrJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBwYXRoO1xuICAgICAgICB9KTtcbiAgICB9XG59XG4vKipcbiAqIFJlZ2lzdGVyIHRoZSBiYWNrIGJ1dHRvbiBjdXN0b20gZWxlbWVudFxuICovXG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJyZWJlbC1iYWNrLWFcIiwge1xuICAgIGV4dGVuZHM6IFwiYVwiLFxuICAgIHByb3RvdHlwZTogUmViZWxCYWNrQS5wcm90b3R5cGVcbn0pO1xuXG4vKipcbiAqIENvbnN0cnVjdHMgYSByb3V0ZSBvYmplY3RcbiAqIEBwYXJhbSBvYmogLSB0aGUgY29tcG9uZW50IG5hbWUgb3IgdGhlIEhUTUwgdGVtcGxhdGVcbiAqIEBwYXJhbSByb3V0ZVxuICogQHBhcmFtIHJlZ2V4XG4gKiBAcGFyYW0gcGF0aFxuICogQHJldHVybnMge3t9fVxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gX3JvdXRlUmVzdWx0KG9iaiwgcm91dGUsIHJlZ2V4LCBwYXRoKSB7XG4gICAgbGV0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICByZXN1bHRba2V5XSA9IG9ialtrZXldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5yb3V0ZSA9IHJvdXRlO1xuICAgIHJlc3VsdC5wYXRoID0gcGF0aDtcbiAgICByZXN1bHQucGFyYW1zID0gUmViZWxSb3V0ZXIuZ2V0UGFyYW1zRnJvbVVybChyZWdleCwgcm91dGUsIHBhdGgpO1xuICAgIHJldHVybiByZXN1bHQ7XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9yZWJlbC1yb3V0ZXIvc3JjL3JlYmVsLXJvdXRlci5qcyIsIid1c2Ugc3RyaWN0JztcblxuLy8gaW1wb3J0IHtoYW5kbGVQR1BQdWJrZXl9IGZyb20gJy4uLy4uL3NyYy9saWIvdXRpbC5qcyc7XG4vLyBpbXBvcnQge2hhbmRsZVBHUFByaXZrZXl9IGZyb20gJy4uLy4uL3NyYy9saWIvdXRpbC5qcyc7XG4vLyBpbXBvcnQge2hhbmRsZVBHUE1lc3NhZ2V9IGZyb20gJy4uLy4uL3NyYy9saWIvdXRpbC5qcyc7XG5cbmltcG9ydCB7ZW5jcnlwdENsZWFydGV4dE11bHRpfSBmcm9tICcuL2VuY3J5cHRDbGVhcnRleHRNdWx0aS5qcyc7XG5pbXBvcnQge2RlY3J5cHRQR1BNZXNzYWdlfSBmcm9tICcuL2RlY3J5cHRQR1BNZXNzYWdlLmpzJztcbmltcG9ydCB7ZGV0ZXJtaW5lQ29udGVudFR5cGV9IGZyb20gJy4vZGV0ZXJtaW5lQ29udGVudFR5cGUuanMnO1xuaW1wb3J0IHtzYXZlUEdQUHVia2V5fSBmcm9tICcuL3NhdmVQR1BQdWJrZXkuanMnO1xuaW1wb3J0IHtzYXZlUEdQUHJpdmtleX0gZnJvbSAnLi9zYXZlUEdQUHJpdmtleS5qcyc7XG4vLyBpbXBvcnQge2dldEZyb21TdG9yYWdlfSBmcm9tICcuL2dldEZyb21TdG9yYWdlJztcblxuY29uc3QgUEdQUFVCS0VZID0gJ1BHUFB1YmtleSc7XG5jb25zdCBDTEVBUlRFWFQgPSAnY2xlYXJ0ZXh0JztcbmNvbnN0IFBHUFBSSVZLRVkgPSAnUEdQUHJpdmtleSc7XG5jb25zdCBQR1BNRVNTQUdFID0gJ1BHUE1lc3NhZ2UnO1xuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlUG9zdChjb250ZW50KSB7XG4gICAgcmV0dXJuICghY29udGVudCkgP1xuICAgIFByb21pc2UucmVzb2x2ZSgnJykgOlxuICAgIChvcGVucGdwKSA9PiB7XG4gICAgICAgIHJldHVybiAoIW9wZW5wZ3ApID9cbiAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIG9wZW5wZ3AnKTpcbiAgICAgICAgKGxvY2FsU3RvcmFnZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChwYXNzd29yZCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAoZ3VuZGIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRldGVybWluZUNvbnRlbnRUeXBlKGNvbnRlbnQpKG9wZW5wZ3ApXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihjb250ZW50VHlwZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRlbnRUeXBlID09PSBDTEVBUlRFWFQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coQ0xFQVJURVhUKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZW5jcnlwdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZW5jcnlwdENsZWFydGV4dE11bHRpKGNvbnRlbnQpKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50VHlwZSA9PT0gUEdQUFJJVktFWSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhQR1BQUklWS0VZKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2F2ZSBhbmQgYnJvYWRjYXN0IGNvbnZlcnRlZCBwdWJsaWMga2V5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzYXZlUEdQUHJpdmtleShjb250ZW50KShvcGVucGdwKShsb2NhbFN0b3JhZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vcmV0dXJuIGJyb2FkY2FzdE1lc3NhZ2UoY29udGVudCkob3BlbnBncCkobG9jYWxTdG9yYWdlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudFR5cGUgPT09IFBHUFBVQktFWSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhQR1BQVUJLRVkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzYXZlIHRvIGxvY2FsU3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2F2ZVBHUFB1YmtleShjb250ZW50KShvcGVucGdwKShsb2NhbFN0b3JhZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiByZXN1bHQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50VHlwZSA9PT0gUEdQTUVTU0FHRSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhQR1BNRVNTQUdFKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IFBHUEtleXMsIGRlY3J5cHQsICBhbmQgcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWNyeXB0UEdQTWVzc2FnZShvcGVucGdwKShsb2NhbFN0b3JhZ2UpKHBhc3N3b3JkKShjb250ZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiByZWplY3QoZXJyKSlcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGliL2hhbmRsZVBvc3QuanMiLCJsZXQgY29ubmVjdFBhcnRpYWwgPSByZXF1aXJlKFwicmF3LWxvYWRlciEuLi8uLi92aWV3cy9wYXJ0aWFscy9jb25uZWN0Lmh0bWxcIik7XG5leHBvcnQgY2xhc3MgQ29ubmVjdFBhZ2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSAnPHA+JyArIGNvbm5lY3RQYXJ0aWFsICsgJzwvcD4nO1xuICAgIH1cbn1cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcImNvbm5lY3QtcGFnZVwiLCBDb25uZWN0UGFnZSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFnZXMvY29ubmVjdC5qcyIsImxldCBjb250YWN0UGFydGlhbCA9IHJlcXVpcmUoXCJyYXctbG9hZGVyIS4uLy4uL3ZpZXdzL3BhcnRpYWxzL2NvbnRhY3QuaHRtbFwiKTtcbmV4cG9ydCBjbGFzcyBDb250YWN0UGFnZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLmlubmVySFRNTCA9ICc8cD4nICsgY29udGFjdFBhcnRpYWwgKyAnPC9wPic7XG4gICAgfVxufVxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwiY29udGFjdC1wYWdlXCIsIENvbnRhY3RQYWdlKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYWdlcy9jb250YWN0LmpzIiwidmFyIGZyZXNoRGVja1BhcnRpYWwgPSByZXF1aXJlKFwicmF3LWxvYWRlciEuLi8uLi92aWV3cy9wYXJ0aWFscy9mcmVzaGRlY2suaHRtbFwiKTtcblxuZXhwb3J0IGNsYXNzIERlY2tQYWdlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICAgIGF0dGFjaGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuaW5uZXJIVE1MID0gJzxwPicgKyBmcmVzaERlY2tQYXJ0aWFsICsgJzwvcD4nO1xuICAgIH1cbn1cblxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwiZGVjay1wYWdlXCIsIERlY2tQYWdlKTtcbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgncGxheWluZy1jYXJkJywge1xuICAgIHByb3RvdHlwZTogT2JqZWN0LmNyZWF0ZShIVE1MRWxlbWVudC5wcm90b3R5cGUsIHsgY3JlYXRlZENhbGxiYWNrOiB7XG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgcm9vdCA9IHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpO1xuICAgICAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyB0aGlzLnRleHRDb250ZW50IHx8ICcj4paIJyk7XG4gICAgICAgICAgICAgICAgICB2YXIgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgdmFyIGNvbG9yT3ZlcnJpZGUgPSAodGhpcy5xdWVyeVNlbGVjdG9yKCdzcGFuJykpID8gdGhpcy5xdWVyeVNlbGVjdG9yKCdzcGFuJykuc3R5bGUuY29sb3I6IG51bGw7XG4gICAgICAgICAgICAgICAgICBpZiAoY29sb3JPdmVycmlkZSkge1xuICAgICAgICAgICAgICAgICAgICAgIGNsb25lLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpLnN0eWxlLmZpbGwgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKS5zdHlsZS5jb2xvcjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcbn0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhZ2VzL2RlY2suanMiLCJ2YXIgaW5kZXhQYXJ0aWFsID0gcmVxdWlyZShcInJhdy1sb2FkZXIhLi4vLi4vdmlld3MvcGFydGlhbHMvaW5kZXguaHRtbFwiKTtcbmV4cG9ydCBjbGFzcyBJbmRleFBhZ2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSBgXG4gICAgICAgIDxwPiR7aW5kZXhQYXJ0aWFsfTwvcD5cbiAgICAgICAgYDtcbiAgICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJpbmRleC1wYWdlXCIsIEluZGV4UGFnZSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFnZXMvaW5kZXguanMiLCJ2YXIgY2xpZW50UHVia2V5Rm9ybVBhcnRpYWwgPSByZXF1aXJlKFwicmF3LWxvYWRlciEuLi8uLi92aWV3cy9wYXJ0aWFscy9tZXNzYWdlX2Zvcm0uaHRtbFwiKTtcblxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VQYWdlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICAgIGF0dGFjaGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuaW5uZXJIVE1MID0gYFxuICAgICAgICAgICAgPHA+JHtjbGllbnRQdWJrZXlGb3JtUGFydGlhbH08L3A+XG4gICAgICAgIGBcbiAgICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJtZXNzYWdlLXBhZ2VcIiwgTWVzc2FnZVBhZ2UpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhZ2VzL21lc3NhZ2UuanMiLCJ2YXIgcm9hZG1hcFBhcnRpYWwgPSByZXF1aXJlKFwicmF3LWxvYWRlciEuLi8uLi92aWV3cy9wYXJ0aWFscy9yb2FkbWFwLmh0bWxcIik7XG5leHBvcnQgY2xhc3MgUm9hZG1hcFBhZ2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSAnPHA+JyArIHJvYWRtYXBQYXJ0aWFsICsgJzwvcD4nO1xuICAgIH1cbn1cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcInJvYWRtYXAtcGFnZVwiLCBSb2FkbWFwUGFnZSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFnZXMvcm9hZG1hcC5qcyIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3Byb2Nlc3MvYnJvd3Nlci5qcyIsInZhciBnO1xyXG5cclxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcclxuZyA9IChmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcztcclxufSkoKTtcclxuXHJcbnRyeSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXHJcblx0ZyA9IGcgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpIHx8ICgxLGV2YWwpKFwidGhpc1wiKTtcclxufSBjYXRjaChlKSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcclxuXHRpZih0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKVxyXG5cdFx0ZyA9IHdpbmRvdztcclxufVxyXG5cclxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxyXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xyXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGc7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAod2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1vZHVsZSkge1xyXG5cdGlmKCFtb2R1bGUud2VicGFja1BvbHlmaWxsKSB7XHJcblx0XHRtb2R1bGUuZGVwcmVjYXRlID0gZnVuY3Rpb24oKSB7fTtcclxuXHRcdG1vZHVsZS5wYXRocyA9IFtdO1xyXG5cdFx0Ly8gbW9kdWxlLnBhcmVudCA9IHVuZGVmaW5lZCBieSBkZWZhdWx0XHJcblx0XHRpZighbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcclxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwibG9hZGVkXCIsIHtcclxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmw7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJpZFwiLCB7XHJcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIG1vZHVsZS5pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdG1vZHVsZS53ZWJwYWNrUG9seWZpbGwgPSAxO1xyXG5cdH1cclxuXHRyZXR1cm4gbW9kdWxlO1xyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gKHdlYnBhY2spL2J1aWxkaW4vbW9kdWxlLmpzIiwiJ3VzZSBzdHJpY3QnO1xuLy9pbXBvcnQgJ3dlYmNvbXBvbmVudHMuanMvd2ViY29tcG9uZW50cy5qcyc7XG4vL3VuY29tbWVudCBsaW5lIGFib3ZlIHRvIGRvdWJsZSBhcHAgc2l6ZSBhbmQgc3VwcG9ydCBpb3MuXG5cbmltcG9ydCB7aGFuZGxlUG9zdH0gZnJvbSAnLi9saWIvaGFuZGxlUG9zdC5qcyc7XG53aW5kb3cuaGFuZGxlUG9zdCA9IGhhbmRsZVBvc3Q7XG5pbXBvcnQge2RldGVybWluZUNvbnRlbnRUeXBlfSBmcm9tICcuL2xpYi9kZXRlcm1pbmVDb250ZW50VHlwZS5qcydcbndpbmRvdy5kZXRlcm1pbmVDb250ZW50VHlwZSA9IGRldGVybWluZUNvbnRlbnRUeXBlO1xuaW1wb3J0IHtkZXRlcm1pbmVLZXlUeXBlfSBmcm9tICcuL2xpYi9kZXRlcm1pbmVLZXlUeXBlLmpzJ1xud2luZG93LmRldGVybWluZUtleVR5cGUgPSBkZXRlcm1pbmVLZXlUeXBlO1xuaW1wb3J0IHtlbmNyeXB0Q2xlYXJ0ZXh0TXVsdGl9IGZyb20gJy4vbGliL2VuY3J5cHRDbGVhcnRleHRNdWx0aS5qcydcbndpbmRvdy5lbmNyeXB0Q2xlYXJ0ZXh0TXVsdGkgPSBlbmNyeXB0Q2xlYXJ0ZXh0TXVsdGk7XG5pbXBvcnQge2VuY3J5cHRDbGVhclRleHR9IGZyb20gJy4vbGliL2VuY3J5cHRDbGVhclRleHQuanMnXG53aW5kb3cuZW5jcnlwdENsZWFyVGV4dCA9IGVuY3J5cHRDbGVhclRleHQ7XG5pbXBvcnQge2RlY3J5cHRQR1BNZXNzYWdlfSBmcm9tICcuL2xpYi9kZWNyeXB0UEdQTWVzc2FnZS5qcydcbndpbmRvdy5kZWNyeXB0UEdQTWVzc2FnZSA9IGRlY3J5cHRQR1BNZXNzYWdlO1xuaW1wb3J0IHtzYXZlUEdQUHVia2V5fSBmcm9tICcuL2xpYi9zYXZlUEdQUHVia2V5LmpzJ1xud2luZG93LnNhdmVQR1BQdWJrZXkgPSBzYXZlUEdQUHVia2V5O1xuaW1wb3J0IHtzYXZlUEdQUHJpdmtleX0gZnJvbSAnLi9saWIvc2F2ZVBHUFByaXZrZXkuanMnXG53aW5kb3cuc2F2ZVBHUFByaXZrZXkgPSBzYXZlUEdQUHJpdmtleTtcbmltcG9ydCB7Z2V0RnJvbVN0b3JhZ2V9IGZyb20gJy4vbGliL2dldEZyb21TdG9yYWdlLmpzJ1xud2luZG93LmdldEZyb21TdG9yYWdlID0gZ2V0RnJvbVN0b3JhZ2U7XG5pbXBvcnQge2RlY3J5cHRQR1BNZXNzYWdlV2l0aEtleX0gZnJvbSAnLi9saWIvZGVjcnlwdFBHUE1lc3NhZ2VXaXRoS2V5LmpzJ1xud2luZG93LmRlY3J5cHRQR1BNZXNzYWdlV2l0aEtleSA9IGRlY3J5cHRQR1BNZXNzYWdlV2l0aEtleTtcblxuLy8gcmViZWwgcm91dGVyXG5pbXBvcnQge1JlYmVsUm91dGVyfSBmcm9tICcuLi9ub2RlX21vZHVsZXMvcmViZWwtcm91dGVyL3NyYy9yZWJlbC1yb3V0ZXIuanMnO1xuXG4vLyBHdW5kYiBwdWJsaWMgZmFjaW5nIERBRyBkYXRhYmFzZSAgKGZvciBtZXNzYWdlcyB0byBhbmQgZnJvbSB0aGUgZW5lbXkpXG5pbXBvcnQge0d1bn0gZnJvbSAnZ3VuL2d1bi5qcyc7XG5cbi8vIHBhZ2VzIChtb3N0IG9mIHRoaXMgc2hvdWxkIGJlIGluIHZpZXdzL3BhcnRpYWxzIHRvIGFmZmVjdCBpc29ybW9ycGhpc20pXG5pbXBvcnQge0luZGV4UGFnZX0gICBmcm9tICcuL3BhZ2VzL2luZGV4LmpzJztcbmltcG9ydCB7Um9hZG1hcFBhZ2V9IGZyb20gJy4vcGFnZXMvcm9hZG1hcC5qcyc7XG5pbXBvcnQge0NvbnRhY3RQYWdlfSBmcm9tICcuL3BhZ2VzL2NvbnRhY3QuanMnO1xuaW1wb3J0IHtNZXNzYWdlUGFnZX0gZnJvbSAnLi9wYWdlcy9tZXNzYWdlLmpzJztcbmltcG9ydCB7RGVja1BhZ2V9ICAgIGZyb20gJy4vcGFnZXMvZGVjay5qcyc7XG5pbXBvcnQge0Nvbm5lY3RQYWdlfSBmcm9tICcuL3BhZ2VzL2Nvbm5lY3QuanMnO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2luZGV4LmpzIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxzcGFuIGNsYXNzPVxcXCJjb25uZWN0XFxcIj5cXG48cD5UaGlzIGlzIHRoZSBjb25uZWN0IHBhZ2UuPC9wPlxcbjx1bD5cXG48bGk+cGVuZGluZyBpbnZpdGF0aW9uczwvPlxcbjxsaT5saXN0IG9mIHBsYXllcnM8L2xpPlxcbjxsaT5jb25uZWN0ZWQgcGxheWVyczwvbGk+XFxuXFxuPGgxPkhlbGxvIHdvcmxkIGd1biBhcHA8L2gxPlxcbjxwPk9wZW4geW91ciB3ZWIgY29uc29sZTwvcD5cXG48L3NwYW4+XFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmF3LWxvYWRlciEuL3ZpZXdzL3BhcnRpYWxzL2Nvbm5lY3QuaHRtbFxuLy8gbW9kdWxlIGlkID0gMjJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxzcGFuIGNsYXNzPVxcXCJjb250YWN0XFxcIj5cXG4gICAgQ29sZSBBbGJvbjxicj5cXG4gICAgPGEgaHJlZj1cXFwidGVsOisxNDE1NjcyMTY0OFxcXCI+KDQxNSkgNjcyLTE2NDg8L2E+PGJyPlxcbiAgICA8YSBocmVmPVxcXCJtYWlsdG86Y29sZS5hbGJvbkBnbWFpbC5jb21cXFwiPmNvbGUuYWxib25AZ21haWwuY29tPC9hPjxicj5cXG4gICAgPGEgaHJlZj1cXFwiaHR0cHM6Ly9naXRodWIuY29tL2NvbGVhbGJvblxcXCI+aHR0cHM6Ly9naXRodWIuY29tL2NvbGVhbGJvbjwvYT48YnI+XFxuICAgIDxhIGhyZWY9XFxcImh0dHBzOi8vd3d3LmxpbmtlZGluLmNvbS9pbi9jb2xlLWFsYm9uLTU5MzQ2MzRcXFwiPlxcbiAgICAgICAgPHNwYW4gaWQ9XFxcImxpbmtlZGluYWRkcmVzc1xcXCIgY2xhc3M9XFxcImxpbmtlZGluYWRkcmVzc1xcXCI+aHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL2NvbGUtYWxib24tNTkzNDYzNDwvc3Bhbj5cXG4gICAgPC9hPjxicj5cXG48L3NwYW4+XFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmF3LWxvYWRlciEuL3ZpZXdzL3BhcnRpYWxzL2NvbnRhY3QuaHRtbFxuLy8gbW9kdWxlIGlkID0gMjNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIiAgICA8ZGl2IGlkPVxcXCJkZWNrXFxcIiBjbGFzcz1cXFwiZGVja1xcXCI+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4paIXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTcwLjMxMjUgMzYyLjI1IEw3MC4zMTI1IDExMC4xMDk0IEwyMjQuMjk2OSAxMTAuMTA5NCBMMjI0LjI5NjkgMzYyLjI1IEw3MC4zMTI1IDM2Mi4yNSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaBBXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuNjcxOSAxMTUuNzM0NCBMOTEuODI4MSAxNzUuNzgxMiBMMTI5LjUxNTYgMTc1Ljc4MTIgTDExMC42NzE5IDExNS43MzQ0IFpNOTkuOTg0NCAxMDEuNjcxOSBMMTIxLjY0MDYgMTAxLjY3MTkgTDE2Mi4xNDA2IDIxOS4yMzQ0IEwxNDMuNTc4MSAyMTkuMjM0NCBMMTM0LjAxNTYgMTg4LjU3ODEgTDg3LjYwOTQgMTg4LjU3ODEgTDc4LjA0NjkgMjE5LjIzNDQgTDU5LjQ4NDQgMjE5LjIzNDQgTDk5Ljk4NDQgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgMlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODYuMzQzOCAyMDMuMDYyNSBMMTQ1Ljk2ODggMjAzLjA2MjUgTDE0NS45Njg4IDIxOS4wOTM4IEw2MS44NzUgMjE5LjA5MzggTDYxLjg3NSAyMDMuNjI1IFE2Ni42NTYyIDE5OS4yNjU2IDc1LjUxNTYgMTkxLjM5MDYgUTEyMy44OTA2IDE0OC41IDEyMy44OTA2IDEzNS4yODEyIFExMjMuODkwNiAxMjYgMTE2LjU3ODEgMTIwLjMwNDcgUTEwOS4yNjU2IDExNC42MDk0IDk3LjMxMjUgMTE0LjYwOTQgUTkwIDExNC42MDk0IDgxLjQyMTkgMTE3LjA3MDMgUTcyLjg0MzggMTE5LjUzMTIgNjIuNzE4OCAxMjQuNDUzMSBMNjIuNzE4OCAxMDcuMTU2MiBRNzMuNTQ2OSAxMDMuMjE4OCA4Mi44OTg0IDEwMS4yNSBROTIuMjUgOTkuMjgxMiAxMDAuMjY1NiA5OS4yODEyIFExMjAuNjU2MiA5OS4yODEyIDEzMi44OTA2IDEwOC41NjI1IFExNDUuMTI1IDExNy44NDM4IDE0NS4xMjUgMTMzLjAzMTIgUTE0NS4xMjUgMTUyLjU3ODEgOTguNTc4MSAxOTIuNTE1NiBROTAuNzAzMSAxOTkuMjY1NiA4Ni4zNDM4IDIwMy4wNjI1IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoDNcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEyMS43ODEyIDE1NS41MzEyIFExMzQuNzE4OCAxNTguMDYyNSAxNDEuODIwMyAxNjUuNzI2NiBRMTQ4LjkyMTkgMTczLjM5MDYgMTQ4LjkyMTkgMTg0LjkyMTkgUTE0OC45MjE5IDIwMi4zNTk0IDEzNS41NjI1IDIxMS43ODEyIFExMjIuMjAzMSAyMjEuMjAzMSA5Ny4zMTI1IDIyMS4yMDMxIFE4OS4yOTY5IDIyMS4yMDMxIDgwLjUwNzggMjE5LjcyNjYgUTcxLjcxODggMjE4LjI1IDYxLjg3NSAyMTUuNDM3NSBMNjEuODc1IDE5OC40MjE5IFE2OS4xODc1IDIwMi4yMTg4IDc3LjU1NDcgMjA0LjA0NjkgUTg1LjkyMTkgMjA1Ljg3NSA5NS4zNDM4IDIwNS44NzUgUTExMC42NzE5IDIwNS44NzUgMTE5LjEwOTQgMjAwLjMyMDMgUTEyNy41NDY5IDE5NC43NjU2IDEyNy41NDY5IDE4NC45MjE5IFExMjcuNTQ2OSAxNzQuNTE1NiAxMTkuNzQyMiAxNjkuMTcxOSBRMTExLjkzNzUgMTYzLjgyODEgOTYuNzUgMTYzLjgyODEgTDg0LjY1NjIgMTYzLjgyODEgTDg0LjY1NjIgMTQ4LjY0MDYgTDk3Ljg3NSAxNDguNjQwNiBRMTExLjA5MzggMTQ4LjY0MDYgMTE3LjkxNDEgMTQ0LjIxMDkgUTEyNC43MzQ0IDEzOS43ODEyIDEyNC43MzQ0IDEzMS4zNDM4IFExMjQuNzM0NCAxMjMuMTg3NSAxMTcuNzAzMSAxMTguODk4NCBRMTEwLjY3MTkgMTE0LjYwOTQgOTcuMzEyNSAxMTQuNjA5NCBROTEuNjg3NSAxMTQuNjA5NCA4NC41MTU2IDExNS44NzUgUTc3LjM0MzggMTE3LjE0MDYgNjUuOTUzMSAxMjAuMzc1IEw2NS45NTMxIDEwNC4yMDMxIFE3Ni4yMTg4IDEwMS44MTI1IDg1LjIxODggMTAwLjU0NjkgUTk0LjIxODggOTkuMjgxMiAxMDEuOTUzMSA5OS4yODEyIFExMjIuMjAzMSA5OS4yODEyIDEzNC4wODU5IDEwNy41NzgxIFExNDUuOTY4OCAxMTUuODc1IDE0NS45Njg4IDEyOS43OTY5IFExNDUuOTY4OCAxMzkuNSAxMzkuNjQwNiAxNDYuMjUgUTEzMy4zMTI1IDE1MyAxMjEuNzgxMiAxNTUuNTMxMiBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaA0XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMjAuMDkzOCAxMTguNjg3NSBMNzYuNjQwNiAxNzcuNjA5NCBMMTIwLjA5MzggMTc3LjYwOTQgTDEyMC4wOTM4IDExOC42ODc1IFpNMTE3IDEwMS42NzE5IEwxNDAuMzQzOCAxMDEuNjcxOSBMMTQwLjM0MzggMTc3LjYwOTQgTDE1OS4zMjgxIDE3Ny42MDk0IEwxNTkuMzI4MSAxOTIuOTM3NSBMMTQwLjM0MzggMTkyLjkzNzUgTDE0MC4zNDM4IDIxOS4wOTM4IEwxMjAuMDkzOCAyMTkuMDkzOCBMMTIwLjA5MzggMTkyLjkzNzUgTDYxLjg3NSAxOTIuOTM3NSBMNjEuODc1IDE3NS45MjE5IEwxMTcgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgNVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjcuNSAxMDEuNjcxOSBMMTM5LjIxODggMTAxLjY3MTkgTDEzOS4yMTg4IDExNS4wMzEyIEw4NC4yMzQ0IDExNS4wMzEyIEw4NC4yMzQ0IDE0My43MTg4IFE4OC4xNzE5IDE0Mi40NTMxIDkyLjI1IDE0MS44OTA2IFE5Ni4xODc1IDE0MS4zMjgxIDEwMC4xMjUgMTQxLjMyODEgUTEyMi43NjU2IDE0MS4zMjgxIDEzNS45ODQ0IDE1Mi4xNTYyIFExNDkuMjAzMSAxNjIuODQzOCAxNDkuMjAzMSAxODEuMjY1NiBRMTQ5LjIwMzEgMjAwLjI1IDEzNS41NjI1IDIxMC43OTY5IFExMjIuMDYyNSAyMjEuMjAzMSA5Ny4zMTI1IDIyMS4yMDMxIFE4OC44NzUgMjIxLjIwMzEgODAuMDE1NiAyMTkuOTM3NSBRNzEuMTU2MiAyMTguNjcxOSA2MS44NzUgMjE2LjE0MDYgTDYxLjg3NSAyMDAuMjUgUTY5Ljg5MDYgMjA0LjA0NjkgNzguNjA5NCAyMDYuMDE1NiBRODcuMzI4MSAyMDcuODQzOCA5Ny4wMzEyIDIwNy44NDM4IFExMTIuNjQwNiAyMDcuODQzOCAxMjEuNzgxMiAyMDAuNjcxOSBRMTMwLjkyMTkgMTkzLjUgMTMwLjkyMTkgMTgxLjI2NTYgUTEzMC45MjE5IDE2OS4wMzEyIDEyMS43ODEyIDE2MS44NTk0IFExMTIuNjQwNiAxNTQuNjg3NSA5Ny4wMzEyIDE1NC42ODc1IFE4OS43MTg4IDE1NC42ODc1IDgyLjQwNjIgMTU2LjA5MzggUTc1LjA5MzggMTU3LjUgNjcuNSAxNjAuNDUzMSBMNjcuNSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaA2XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuMTA5NCAxNTMuNzAzMSBROTcuNzM0NCAxNTMuNzAzMSA5MC41NjI1IDE2MS4wMTU2IFE4My4zOTA2IDE2OC40Njg4IDgzLjM5MDYgMTgxLjI2NTYgUTgzLjM5MDYgMTkzLjkyMTkgOTAuNTYyNSAyMDEuMjM0NCBROTcuNzM0NCAyMDguNjg3NSAxMTAuMTA5NCAyMDguNjg3NSBRMTIyLjM0MzggMjA4LjY4NzUgMTI5LjUxNTYgMjAxLjIzNDQgUTEzNi42ODc1IDE5My45MjE5IDEzNi42ODc1IDE4MS4yNjU2IFExMzYuNjg3NSAxNjguNDY4OCAxMjkuNTE1NiAxNjEuMDE1NiBRMTIyLjM0MzggMTUzLjcwMzEgMTEwLjEwOTQgMTUzLjcwMzEgWk0xNDYuMzkwNiAxMDMuOTIxOSBMMTQ2LjM5MDYgMTE4LjQwNjIgUTEzOS41IDExNS41OTM4IDEzMi40Njg4IDExNC4xODc1IFExMjUuNDM3NSAxMTIuNjQwNiAxMTguNTQ2OSAxMTIuNjQwNiBRMTAwLjU0NjkgMTEyLjY0MDYgOTAuOTg0NCAxMjMuMTg3NSBRODEuNDIxOSAxMzMuODc1IDgwLjAxNTYgMTU1LjM5MDYgUTg1LjM1OTQgMTQ4LjUgOTMuMzc1IDE0NC44NDM4IFExMDEuNTMxMiAxNDEuMTg3NSAxMTEuMDkzOCAxNDEuMTg3NSBRMTMxLjQ4NDQgMTQxLjE4NzUgMTQzLjI5NjkgMTUxLjg3NSBRMTU1LjEwOTQgMTYyLjcwMzEgMTU1LjEwOTQgMTgxLjI2NTYgUTE1NS4xMDk0IDE5OS4xMjUgMTQyLjczNDQgMjEwLjIzNDQgUTEzMC41IDIyMS4yMDMxIDExMC4xMDk0IDIyMS4yMDMxIFE4Ni42MjUgMjIxLjIwMzEgNzQuMjUgMjA1LjU5MzggUTYxLjg3NSAxODkuOTg0NCA2MS44NzUgMTYwLjE3MTkgUTYxLjg3NSAxMzIuMzI4MSA3Ny4wNjI1IDExNS44NzUgUTkyLjI1IDk5LjI4MTIgMTE3Ljg0MzggOTkuMjgxMiBRMTI0LjczNDQgOTkuMjgxMiAxMzEuNzY1NiAxMDAuNDA2MiBRMTM4Ljc5NjkgMTAxLjY3MTkgMTQ2LjM5MDYgMTAzLjkyMTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgN1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjEuODc1IDEwMS42NzE5IEwxNDguNjQwNiAxMDEuNjcxOSBMMTQ4LjY0MDYgMTA4LjQyMTkgTDk5LjcwMzEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggTDEyNi43MDMxIDExNS4wMzEyIEw2MS44NzUgMTE1LjAzMTIgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaA4XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMDguMjgxMiAxNjMuMTI1IFE5NS4yMDMxIDE2My4xMjUgODcuNzUgMTY5LjMxMjUgUTgwLjI5NjkgMTc1LjM1OTQgODAuMjk2OSAxODUuOTA2MiBRODAuMjk2OSAxOTYuNTkzOCA4Ny43NSAyMDIuNjQwNiBROTUuMjAzMSAyMDguNjg3NSAxMDguMjgxMiAyMDguNjg3NSBRMTIxLjIxODggMjA4LjY4NzUgMTI4LjgxMjUgMjAyLjUgUTEzNi4yNjU2IDE5Ni40NTMxIDEzNi4yNjU2IDE4NS45MDYyIFExMzYuMjY1NiAxNzUuMzU5NCAxMjguODEyNSAxNjkuMzEyNSBRMTIxLjM1OTQgMTYzLjEyNSAxMDguMjgxMiAxNjMuMTI1IFpNOTAgMTU2LjIzNDQgUTc4LjE4NzUgMTUzLjcwMzEgNzEuNzE4OCAxNDYuODEyNSBRNjUuMTA5NCAxMzkuNzgxMiA2NS4xMDk0IDEyOS42NTYyIFE2NS4xMDk0IDExNS41OTM4IDc2LjY0MDYgMTA3LjQzNzUgUTg4LjE3MTkgOTkuMjgxMiAxMDguMjgxMiA5OS4yODEyIFExMjguMzkwNiA5OS4yODEyIDEzOS45MjE5IDEwNy40Mzc1IFExNTEuMzEyNSAxMTUuNTkzOCAxNTEuMzEyNSAxMjkuNjU2MiBRMTUxLjMxMjUgMTQwLjA2MjUgMTQ0Ljg0MzggMTQ2LjgxMjUgUTEzOC4yMzQ0IDE1My43MDMxIDEyNi41NjI1IDE1Ni4yMzQ0IFExMzkuMjE4OCAxNTguNzY1NiAxNDcuMDkzOCAxNjYuOTIxOSBRMTU0LjU0NjkgMTc0LjY1NjIgMTU0LjU0NjkgMTg1LjkwNjIgUTE1NC41NDY5IDIwMi45MjE5IDE0Mi41OTM4IDIxMi4wNjI1IFExMzAuNSAyMjEuMjAzMSAxMDguMjgxMiAyMjEuMjAzMSBRODUuOTIxOSAyMjEuMjAzMSA3My45Njg4IDIxMi4wNjI1IFE2MS44NzUgMjAyLjkyMTkgNjEuODc1IDE4NS45MDYyIFE2MS44NzUgMTc0LjkzNzUgNjkuMzI4MSAxNjYuOTIxOSBRNzYuOTIxOSAxNTkuMDQ2OSA5MCAxNTYuMjM0NCBaTTgzLjI1IDEzMS4yMDMxIFE4My4yNSAxNDAuMDYyNSA4OS44NTk0IDE0NS40MDYyIFE5Ni4zMjgxIDE1MC42MDk0IDEwOC4yODEyIDE1MC42MDk0IFExMTkuNjcxOSAxNTAuNjA5NCAxMjYuNTYyNSAxNDUuNDA2MiBRMTMzLjMxMjUgMTQwLjM0MzggMTMzLjMxMjUgMTMxLjIwMzEgUTEzMy4zMTI1IDEyMi4zNDM4IDEyNi41NjI1IDExNyBRMTE5Ljk1MzEgMTExLjc5NjkgMTA4LjI4MTIgMTExLjc5NjkgUTk2LjYwOTQgMTExLjc5NjkgODkuODU5NCAxMTcgUTgzLjI1IDEyMi4wNjI1IDgzLjI1IDEzMS4yMDMxIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoDlcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTcwLjU5MzggMjE2LjU2MjUgTDcwLjU5MzggMjAyLjA3ODEgUTc3LjQ4NDQgMjA0Ljg5MDYgODQuNTE1NiAyMDYuNDM3NSBROTEuNTQ2OSAyMDcuODQzOCA5OC4yOTY5IDIwNy44NDM4IFExMTYuNDM3NSAyMDcuODQzOCAxMjYgMTk3LjI5NjkgUTEzNS40MjE5IDE4Ni43NSAxMzYuODI4MSAxNjUuMDkzOCBRMTMxLjkwNjIgMTcxLjcwMzEgMTIzLjQ2ODggMTc1LjUgUTExNS40NTMxIDE3OS4xNTYyIDEwNS43NSAxNzkuMTU2MiBRODUuNSAxNzkuMTU2MiA3My42ODc1IDE2OC40Njg4IFE2MS44NzUgMTU3Ljc4MTIgNjEuODc1IDEzOS4yMTg4IFE2MS44NzUgMTIxLjA3ODEgNzQuMTA5NCAxMTAuMjUgUTg2LjQ4NDQgOTkuMjgxMiAxMDYuODc1IDk5LjI4MTIgUTEzMC4zNTk0IDk5LjI4MTIgMTQyLjU5MzggMTE0Ljg5MDYgUTE1NC45Njg4IDEzMC41IDE1NC45Njg4IDE2MC4zMTI1IFExNTQuOTY4OCAxODguMTU2MiAxMzkuOTIxOSAyMDQuNjA5NCBRMTI0LjczNDQgMjIxLjIwMzEgOTkuMTQwNiAyMjEuMjAzMSBROTIuMjUgMjIxLjIwMzEgODUuMjE4OCAyMjAuMDc4MSBRNzguMTg3NSAyMTguODEyNSA3MC41OTM4IDIxNi41NjI1IFpNMTA2Ljg3NSAxNjYuNzgxMiBRMTE5LjI1IDE2Ni43ODEyIDEyNi40MjE5IDE1OS40Njg4IFExMzMuNTkzOCAxNTIuMTU2MiAxMzMuNTkzOCAxMzkuMjE4OCBRMTMzLjU5MzggMTI2LjU2MjUgMTI2LjQyMTkgMTE5LjI1IFExMTkuMjUgMTExLjc5NjkgMTA2Ljg3NSAxMTEuNzk2OSBROTQuOTIxOSAxMTEuNzk2OSA4Ny40Njg4IDExOS4yNSBRODAuMTU2MiAxMjYuNTYyNSA4MC4xNTYyIDEzOS4yMTg4IFE4MC4xNTYyIDE1Mi4xNTYyIDg3LjQ2ODggMTU5LjQ2ODggUTk0LjY0MDYgMTY2Ljc4MTIgMTA2Ljg3NSAxNjYuNzgxMiBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaAxMFxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTU5LjA0NjkgMTExLjc5NjkgUTE0OS4wNjI1IDExMS43OTY5IDE0Mi4wMzEyIDEyMy44OTA2IFExMzQuODU5NCAxMzUuOTg0NCAxMzQuODU5NCAxNjAuMTcxOSBRMTM0Ljg1OTQgMTg0LjUgMTQyLjAzMTIgMTk2LjU5MzggUTE0OS4wNjI1IDIwOC42ODc1IDE1OS4wNDY5IDIwOC42ODc1IFExNjkuMDMxMiAyMDguNjg3NSAxNzYuMDYyNSAxOTYuNTkzOCBRMTgzLjIzNDQgMTg0LjUgMTgzLjIzNDQgMTYwLjE3MTkgUTE4My4yMzQ0IDEzNS45ODQ0IDE3Ni4wNjI1IDEyMy44OTA2IFExNjkuMDMxMiAxMTEuNzk2OSAxNTkuMDQ2OSAxMTEuNzk2OSBaTTE1OS4wNDY5IDk5LjI4MTIgUTE3Ny40Njg4IDk5LjI4MTIgMTg5LjQyMTkgMTE0Ljg5MDYgUTIwMS4zNzUgMTMwLjUgMjAxLjM3NSAxNjAuMTcxOSBRMjAxLjM3NSAxODkuOTg0NCAxODkuNDIxOSAyMDUuNTkzOCBRMTc3LjQ2ODggMjIxLjIwMzEgMTU5LjA0NjkgMjIxLjIwMzEgUTEzNi4yNjU2IDIyMS4yMDMxIDEyNi40MjE5IDIwNS41OTM4IFExMTYuNTc4MSAxODkuOTg0NCAxMTYuNTc4MSAxNjAuMTcxOSBRMTE2LjU3ODEgMTMwLjUgMTI2LjQyMTkgMTE0Ljg5MDYgUTEzNi4yNjU2IDk5LjI4MTIgMTU5LjA0NjkgOTkuMjgxMiBaTTgwLjU3ODEgMjE5LjA5MzggTDgwLjU3ODEgMTE3LjcwMzEgTDYxLjg3NSAxMjMuNDY4OCBMNjEuODc1IDEwNy4xNTYyIEw4MS41NjI1IDEwMS42NzE5IEwxMDAuODI4MSAxMDEuNjcxOSBMMTAwLjgyODEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgSlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODkuMTU2MiAxMDEuNjcxOSBMMTA3LjAxNTYgMTAxLjY3MTkgTDEwNy4wMTU2IDE3OC43MzQ0IFExMDcuMDE1NiAxOTkuNjg3NSA5Ny44NzUgMjA5LjUzMTIgUTg4Ljg3NSAyMTkuMjM0NCA2OC43NjU2IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAyMDUuNzM0NCBMNjcuNSAyMDUuNzM0NCBRNzkuMzEyNSAyMDUuNzM0NCA4NC4yMzQ0IDE5OS44MjgxIFE4OS4xNTYyIDE5My45MjE5IDg5LjE1NjIgMTc4LjczNDQgTDg5LjE1NjIgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgUVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTA3LjI5NjkgMjIxLjA2MjUgUTEwNi43MzQ0IDIyMS4wNjI1IDEwNS41MzkxIDIyMS4xMzI4IFExMDQuMzQzOCAyMjEuMjAzMSAxMDMuNjQwNiAyMjEuMjAzMSBRODEuNDIxOSAyMjEuMjAzMSA3MC41MjM0IDIwNi4wODU5IFE1OS42MjUgMTkwLjk2ODggNTkuNjI1IDE2MC4zMTI1IFE1OS42MjUgMTI5LjUxNTYgNzAuNTkzOCAxMTQuMzk4NCBRODEuNTYyNSA5OS4yODEyIDEwMy43ODEyIDk5LjI4MTIgUTEyNi4xNDA2IDk5LjI4MTIgMTM3LjEwOTQgMTE0LjM5ODQgUTE0OC4wNzgxIDEyOS41MTU2IDE0OC4wNzgxIDE2MC4zMTI1IFExNDguMDc4MSAxODMuNTE1NiAxNDIuMDMxMiAxOTcuNjQ4NCBRMTM1Ljk4NDQgMjExLjc4MTIgMTIzLjYwOTQgMjE3LjQwNjIgTDE0MS4zMjgxIDIzMi4zMTI1IEwxMjcuOTY4OCAyNDAuMTg3NSBMMTA3LjI5NjkgMjIxLjA2MjUgWk0xMjkuMzc1IDE2MC4zMTI1IFExMjkuMzc1IDEzNC40Mzc1IDEyMy4zOTg0IDEyMy4zMjgxIFExMTcuNDIxOSAxMTIuMjE4OCAxMDMuNzgxMiAxMTIuMjE4OCBROTAuMjgxMiAxMTIuMjE4OCA4NC4zMDQ3IDEyMy4zMjgxIFE3OC4zMjgxIDEzNC40Mzc1IDc4LjMyODEgMTYwLjMxMjUgUTc4LjMyODEgMTg2LjE4NzUgODQuMzA0NyAxOTcuMjk2OSBROTAuMjgxMiAyMDguNDA2MiAxMDMuNzgxMiAyMDguNDA2MiBRMTE3LjQyMTkgMjA4LjQwNjIgMTIzLjM5ODQgMTk3LjI5NjkgUTEyOS4zNzUgMTg2LjE4NzUgMTI5LjM3NSAxNjAuMzEyNSBaTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaBLXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02MS44NzUgMTAxLjY3MTkgTDc5LjczNDQgMTAxLjY3MTkgTDc5LjczNDQgMTUxLjMxMjUgTDEzMC42NDA2IDEwMS42NzE5IEwxNTMuNzAzMSAxMDEuNjcxOSBMOTYuNDY4OCAxNTYuNTE1NiBMMTU4LjM0MzggMjE5LjIzNDQgTDEzNC44NTk0IDIxOS4yMzQ0IEw3OS43MzQ0IDE2Mi41NjI1IEw3OS43MzQ0IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaVBXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuNjcxOSAxMTUuNzM0NCBMOTEuODI4MSAxNzUuNzgxMiBMMTI5LjUxNTYgMTc1Ljc4MTIgTDExMC42NzE5IDExNS43MzQ0IFpNOTkuOTg0NCAxMDEuNjcxOSBMMTIxLjY0MDYgMTAxLjY3MTkgTDE2Mi4xNDA2IDIxOS4yMzQ0IEwxNDMuNTc4MSAyMTkuMjM0NCBMMTM0LjAxNTYgMTg4LjU3ODEgTDg3LjYwOTQgMTg4LjU3ODEgTDc4LjA0NjkgMjE5LjIzNDQgTDU5LjQ4NDQgMjE5LjIzNDQgTDk5Ljk4NDQgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlMlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTg2LjM0MzggMjAzLjA2MjUgTDE0NS45Njg4IDIwMy4wNjI1IEwxNDUuOTY4OCAyMTkuMDkzOCBMNjEuODc1IDIxOS4wOTM4IEw2MS44NzUgMjAzLjYyNSBRNjYuNjU2MiAxOTkuMjY1NiA3NS41MTU2IDE5MS4zOTA2IFExMjMuODkwNiAxNDguNSAxMjMuODkwNiAxMzUuMjgxMiBRMTIzLjg5MDYgMTI2IDExNi41NzgxIDEyMC4zMDQ3IFExMDkuMjY1NiAxMTQuNjA5NCA5Ny4zMTI1IDExNC42MDk0IFE5MCAxMTQuNjA5NCA4MS40MjE5IDExNy4wNzAzIFE3Mi44NDM4IDExOS41MzEyIDYyLjcxODggMTI0LjQ1MzEgTDYyLjcxODggMTA3LjE1NjIgUTczLjU0NjkgMTAzLjIxODggODIuODk4NCAxMDEuMjUgUTkyLjI1IDk5LjI4MTIgMTAwLjI2NTYgOTkuMjgxMiBRMTIwLjY1NjIgOTkuMjgxMiAxMzIuODkwNiAxMDguNTYyNSBRMTQ1LjEyNSAxMTcuODQzOCAxNDUuMTI1IDEzMy4wMzEyIFExNDUuMTI1IDE1Mi41NzgxIDk4LjU3ODEgMTkyLjUxNTYgUTkwLjcwMzEgMTk5LjI2NTYgODYuMzQzOCAyMDMuMDYyNSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaUzXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTIxLjc4MTIgMTU1LjUzMTIgUTEzNC43MTg4IDE1OC4wNjI1IDE0MS44MjAzIDE2NS43MjY2IFExNDguOTIxOSAxNzMuMzkwNiAxNDguOTIxOSAxODQuOTIxOSBRMTQ4LjkyMTkgMjAyLjM1OTQgMTM1LjU2MjUgMjExLjc4MTIgUTEyMi4yMDMxIDIyMS4yMDMxIDk3LjMxMjUgMjIxLjIwMzEgUTg5LjI5NjkgMjIxLjIwMzEgODAuNTA3OCAyMTkuNzI2NiBRNzEuNzE4OCAyMTguMjUgNjEuODc1IDIxNS40Mzc1IEw2MS44NzUgMTk4LjQyMTkgUTY5LjE4NzUgMjAyLjIxODggNzcuNTU0NyAyMDQuMDQ2OSBRODUuOTIxOSAyMDUuODc1IDk1LjM0MzggMjA1Ljg3NSBRMTEwLjY3MTkgMjA1Ljg3NSAxMTkuMTA5NCAyMDAuMzIwMyBRMTI3LjU0NjkgMTk0Ljc2NTYgMTI3LjU0NjkgMTg0LjkyMTkgUTEyNy41NDY5IDE3NC41MTU2IDExOS43NDIyIDE2OS4xNzE5IFExMTEuOTM3NSAxNjMuODI4MSA5Ni43NSAxNjMuODI4MSBMODQuNjU2MiAxNjMuODI4MSBMODQuNjU2MiAxNDguNjQwNiBMOTcuODc1IDE0OC42NDA2IFExMTEuMDkzOCAxNDguNjQwNiAxMTcuOTE0MSAxNDQuMjEwOSBRMTI0LjczNDQgMTM5Ljc4MTIgMTI0LjczNDQgMTMxLjM0MzggUTEyNC43MzQ0IDEyMy4xODc1IDExNy43MDMxIDExOC44OTg0IFExMTAuNjcxOSAxMTQuNjA5NCA5Ny4zMTI1IDExNC42MDk0IFE5MS42ODc1IDExNC42MDk0IDg0LjUxNTYgMTE1Ljg3NSBRNzcuMzQzOCAxMTcuMTQwNiA2NS45NTMxIDEyMC4zNzUgTDY1Ljk1MzEgMTA0LjIwMzEgUTc2LjIxODggMTAxLjgxMjUgODUuMjE4OCAxMDAuNTQ2OSBROTQuMjE4OCA5OS4yODEyIDEwMS45NTMxIDk5LjI4MTIgUTEyMi4yMDMxIDk5LjI4MTIgMTM0LjA4NTkgMTA3LjU3ODEgUTE0NS45Njg4IDExNS44NzUgMTQ1Ljk2ODggMTI5Ljc5NjkgUTE0NS45Njg4IDEzOS41IDEzOS42NDA2IDE0Ni4yNSBRMTMzLjMxMjUgMTUzIDEyMS43ODEyIDE1NS41MzEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpTRcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi42ODc1IDI3My42NTYyIFExNzUuNzgxMiAyNTcuMDYyNSAxODMuNTE1NiAyNDguMzQzOCBRMTkyLjIzNDQgMjM4LjM1OTQgMjA0LjA0NjkgMjM4LjM1OTQgUTIyMy41OTM4IDIzOC4zNTk0IDIzMi4zMTI1IDI1OS4zMTI1IFEyMzQuOTg0NCAyNjUuNjQwNiAyMzQuOTg0NCAyNzMuOTM3NSBRMjM0Ljk4NDQgMjk2LjE1NjIgMjE3LjQwNjIgMzE4LjUxNTYgTDE3Mi45Njg4IDM3NS4wNDY5IEwxMjcuOTY4OCAzMTguNTE1NiBRMTEwLjM5MDYgMjk2LjQzNzUgMTEwLjM5MDYgMjczLjkzNzUgUTExMC4zOTA2IDI2NS42NDA2IDExMy4wNjI1IDI1OS4zMTI1IFExMjEuOTIxOSAyMzguMzU5NCAxNDEuMzI4MSAyMzguMzU5NCBRMTUzLjQyMTkgMjM4LjM1OTQgMTYxLjg1OTQgMjQ4LjM0MzggUTE2OS41OTM4IDI1Ny40ODQ0IDE3Mi42ODc1IDI3My42NTYyIFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMjAuMDkzOCAxMTguNjg3NSBMNzYuNjQwNiAxNzcuNjA5NCBMMTIwLjA5MzggMTc3LjYwOTQgTDEyMC4wOTM4IDExOC42ODc1IFpNMTE3IDEwMS42NzE5IEwxNDAuMzQzOCAxMDEuNjcxOSBMMTQwLjM0MzggMTc3LjYwOTQgTDE1OS4zMjgxIDE3Ny42MDk0IEwxNTkuMzI4MSAxOTIuOTM3NSBMMTQwLjM0MzggMTkyLjkzNzUgTDE0MC4zNDM4IDIxOS4wOTM4IEwxMjAuMDkzOCAyMTkuMDkzOCBMMTIwLjA5MzggMTkyLjkzNzUgTDYxLjg3NSAxOTIuOTM3NSBMNjEuODc1IDE3NS45MjE5IEwxMTcgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlNVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTY3LjUgMTAxLjY3MTkgTDEzOS4yMTg4IDEwMS42NzE5IEwxMzkuMjE4OCAxMTUuMDMxMiBMODQuMjM0NCAxMTUuMDMxMiBMODQuMjM0NCAxNDMuNzE4OCBRODguMTcxOSAxNDIuNDUzMSA5Mi4yNSAxNDEuODkwNiBROTYuMTg3NSAxNDEuMzI4MSAxMDAuMTI1IDE0MS4zMjgxIFExMjIuNzY1NiAxNDEuMzI4MSAxMzUuOTg0NCAxNTIuMTU2MiBRMTQ5LjIwMzEgMTYyLjg0MzggMTQ5LjIwMzEgMTgxLjI2NTYgUTE0OS4yMDMxIDIwMC4yNSAxMzUuNTYyNSAyMTAuNzk2OSBRMTIyLjA2MjUgMjIxLjIwMzEgOTcuMzEyNSAyMjEuMjAzMSBRODguODc1IDIyMS4yMDMxIDgwLjAxNTYgMjE5LjkzNzUgUTcxLjE1NjIgMjE4LjY3MTkgNjEuODc1IDIxNi4xNDA2IEw2MS44NzUgMjAwLjI1IFE2OS44OTA2IDIwNC4wNDY5IDc4LjYwOTQgMjA2LjAxNTYgUTg3LjMyODEgMjA3Ljg0MzggOTcuMDMxMiAyMDcuODQzOCBRMTEyLjY0MDYgMjA3Ljg0MzggMTIxLjc4MTIgMjAwLjY3MTkgUTEzMC45MjE5IDE5My41IDEzMC45MjE5IDE4MS4yNjU2IFExMzAuOTIxOSAxNjkuMDMxMiAxMjEuNzgxMiAxNjEuODU5NCBRMTEyLjY0MDYgMTU0LjY4NzUgOTcuMDMxMiAxNTQuNjg3NSBRODkuNzE4OCAxNTQuNjg3NSA4Mi40MDYyIDE1Ni4wOTM4IFE3NS4wOTM4IDE1Ny41IDY3LjUgMTYwLjQ1MzEgTDY3LjUgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlNlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTExMC4xMDk0IDE1My43MDMxIFE5Ny43MzQ0IDE1My43MDMxIDkwLjU2MjUgMTYxLjAxNTYgUTgzLjM5MDYgMTY4LjQ2ODggODMuMzkwNiAxODEuMjY1NiBRODMuMzkwNiAxOTMuOTIxOSA5MC41NjI1IDIwMS4yMzQ0IFE5Ny43MzQ0IDIwOC42ODc1IDExMC4xMDk0IDIwOC42ODc1IFExMjIuMzQzOCAyMDguNjg3NSAxMjkuNTE1NiAyMDEuMjM0NCBRMTM2LjY4NzUgMTkzLjkyMTkgMTM2LjY4NzUgMTgxLjI2NTYgUTEzNi42ODc1IDE2OC40Njg4IDEyOS41MTU2IDE2MS4wMTU2IFExMjIuMzQzOCAxNTMuNzAzMSAxMTAuMTA5NCAxNTMuNzAzMSBaTTE0Ni4zOTA2IDEwMy45MjE5IEwxNDYuMzkwNiAxMTguNDA2MiBRMTM5LjUgMTE1LjU5MzggMTMyLjQ2ODggMTE0LjE4NzUgUTEyNS40Mzc1IDExMi42NDA2IDExOC41NDY5IDExMi42NDA2IFExMDAuNTQ2OSAxMTIuNjQwNiA5MC45ODQ0IDEyMy4xODc1IFE4MS40MjE5IDEzMy44NzUgODAuMDE1NiAxNTUuMzkwNiBRODUuMzU5NCAxNDguNSA5My4zNzUgMTQ0Ljg0MzggUTEwMS41MzEyIDE0MS4xODc1IDExMS4wOTM4IDE0MS4xODc1IFExMzEuNDg0NCAxNDEuMTg3NSAxNDMuMjk2OSAxNTEuODc1IFExNTUuMTA5NCAxNjIuNzAzMSAxNTUuMTA5NCAxODEuMjY1NiBRMTU1LjEwOTQgMTk5LjEyNSAxNDIuNzM0NCAyMTAuMjM0NCBRMTMwLjUgMjIxLjIwMzEgMTEwLjEwOTQgMjIxLjIwMzEgUTg2LjYyNSAyMjEuMjAzMSA3NC4yNSAyMDUuNTkzOCBRNjEuODc1IDE4OS45ODQ0IDYxLjg3NSAxNjAuMTcxOSBRNjEuODc1IDEzMi4zMjgxIDc3LjA2MjUgMTE1Ljg3NSBROTIuMjUgOTkuMjgxMiAxMTcuODQzOCA5OS4yODEyIFExMjQuNzM0NCA5OS4yODEyIDEzMS43NjU2IDEwMC40MDYyIFExMzguNzk2OSAxMDEuNjcxOSAxNDYuMzkwNiAxMDMuOTIxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaU3XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjEuODc1IDEwMS42NzE5IEwxNDguNjQwNiAxMDEuNjcxOSBMMTQ4LjY0MDYgMTA4LjQyMTkgTDk5LjcwMzEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggTDEyNi43MDMxIDExNS4wMzEyIEw2MS44NzUgMTE1LjAzMTIgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaU4XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTA4LjI4MTIgMTYzLjEyNSBROTUuMjAzMSAxNjMuMTI1IDg3Ljc1IDE2OS4zMTI1IFE4MC4yOTY5IDE3NS4zNTk0IDgwLjI5NjkgMTg1LjkwNjIgUTgwLjI5NjkgMTk2LjU5MzggODcuNzUgMjAyLjY0MDYgUTk1LjIwMzEgMjA4LjY4NzUgMTA4LjI4MTIgMjA4LjY4NzUgUTEyMS4yMTg4IDIwOC42ODc1IDEyOC44MTI1IDIwMi41IFExMzYuMjY1NiAxOTYuNDUzMSAxMzYuMjY1NiAxODUuOTA2MiBRMTM2LjI2NTYgMTc1LjM1OTQgMTI4LjgxMjUgMTY5LjMxMjUgUTEyMS4zNTk0IDE2My4xMjUgMTA4LjI4MTIgMTYzLjEyNSBaTTkwIDE1Ni4yMzQ0IFE3OC4xODc1IDE1My43MDMxIDcxLjcxODggMTQ2LjgxMjUgUTY1LjEwOTQgMTM5Ljc4MTIgNjUuMTA5NCAxMjkuNjU2MiBRNjUuMTA5NCAxMTUuNTkzOCA3Ni42NDA2IDEwNy40Mzc1IFE4OC4xNzE5IDk5LjI4MTIgMTA4LjI4MTIgOTkuMjgxMiBRMTI4LjM5MDYgOTkuMjgxMiAxMzkuOTIxOSAxMDcuNDM3NSBRMTUxLjMxMjUgMTE1LjU5MzggMTUxLjMxMjUgMTI5LjY1NjIgUTE1MS4zMTI1IDE0MC4wNjI1IDE0NC44NDM4IDE0Ni44MTI1IFExMzguMjM0NCAxNTMuNzAzMSAxMjYuNTYyNSAxNTYuMjM0NCBRMTM5LjIxODggMTU4Ljc2NTYgMTQ3LjA5MzggMTY2LjkyMTkgUTE1NC41NDY5IDE3NC42NTYyIDE1NC41NDY5IDE4NS45MDYyIFExNTQuNTQ2OSAyMDIuOTIxOSAxNDIuNTkzOCAyMTIuMDYyNSBRMTMwLjUgMjIxLjIwMzEgMTA4LjI4MTIgMjIxLjIwMzEgUTg1LjkyMTkgMjIxLjIwMzEgNzMuOTY4OCAyMTIuMDYyNSBRNjEuODc1IDIwMi45MjE5IDYxLjg3NSAxODUuOTA2MiBRNjEuODc1IDE3NC45Mzc1IDY5LjMyODEgMTY2LjkyMTkgUTc2LjkyMTkgMTU5LjA0NjkgOTAgMTU2LjIzNDQgWk04My4yNSAxMzEuMjAzMSBRODMuMjUgMTQwLjA2MjUgODkuODU5NCAxNDUuNDA2MiBROTYuMzI4MSAxNTAuNjA5NCAxMDguMjgxMiAxNTAuNjA5NCBRMTE5LjY3MTkgMTUwLjYwOTQgMTI2LjU2MjUgMTQ1LjQwNjIgUTEzMy4zMTI1IDE0MC4zNDM4IDEzMy4zMTI1IDEzMS4yMDMxIFExMzMuMzEyNSAxMjIuMzQzOCAxMjYuNTYyNSAxMTcgUTExOS45NTMxIDExMS43OTY5IDEwOC4yODEyIDExMS43OTY5IFE5Ni42MDk0IDExMS43OTY5IDg5Ljg1OTQgMTE3IFE4My4yNSAxMjIuMDYyNSA4My4yNSAxMzEuMjAzMSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaU5XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNzAuNTkzOCAyMTYuNTYyNSBMNzAuNTkzOCAyMDIuMDc4MSBRNzcuNDg0NCAyMDQuODkwNiA4NC41MTU2IDIwNi40Mzc1IFE5MS41NDY5IDIwNy44NDM4IDk4LjI5NjkgMjA3Ljg0MzggUTExNi40Mzc1IDIwNy44NDM4IDEyNiAxOTcuMjk2OSBRMTM1LjQyMTkgMTg2Ljc1IDEzNi44MjgxIDE2NS4wOTM4IFExMzEuOTA2MiAxNzEuNzAzMSAxMjMuNDY4OCAxNzUuNSBRMTE1LjQ1MzEgMTc5LjE1NjIgMTA1Ljc1IDE3OS4xNTYyIFE4NS41IDE3OS4xNTYyIDczLjY4NzUgMTY4LjQ2ODggUTYxLjg3NSAxNTcuNzgxMiA2MS44NzUgMTM5LjIxODggUTYxLjg3NSAxMjEuMDc4MSA3NC4xMDk0IDExMC4yNSBRODYuNDg0NCA5OS4yODEyIDEwNi44NzUgOTkuMjgxMiBRMTMwLjM1OTQgOTkuMjgxMiAxNDIuNTkzOCAxMTQuODkwNiBRMTU0Ljk2ODggMTMwLjUgMTU0Ljk2ODggMTYwLjMxMjUgUTE1NC45Njg4IDE4OC4xNTYyIDEzOS45MjE5IDIwNC42MDk0IFExMjQuNzM0NCAyMjEuMjAzMSA5OS4xNDA2IDIyMS4yMDMxIFE5Mi4yNSAyMjEuMjAzMSA4NS4yMTg4IDIyMC4wNzgxIFE3OC4xODc1IDIxOC44MTI1IDcwLjU5MzggMjE2LjU2MjUgWk0xMDYuODc1IDE2Ni43ODEyIFExMTkuMjUgMTY2Ljc4MTIgMTI2LjQyMTkgMTU5LjQ2ODggUTEzMy41OTM4IDE1Mi4xNTYyIDEzMy41OTM4IDEzOS4yMTg4IFExMzMuNTkzOCAxMjYuNTYyNSAxMjYuNDIxOSAxMTkuMjUgUTExOS4yNSAxMTEuNzk2OSAxMDYuODc1IDExMS43OTY5IFE5NC45MjE5IDExMS43OTY5IDg3LjQ2ODggMTE5LjI1IFE4MC4xNTYyIDEyNi41NjI1IDgwLjE1NjIgMTM5LjIxODggUTgwLjE1NjIgMTUyLjE1NjIgODcuNDY4OCAxNTkuNDY4OCBROTQuNjQwNiAxNjYuNzgxMiAxMDYuODc1IDE2Ni43ODEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpTEwXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTU5LjA0NjkgMTExLjc5NjkgUTE0OS4wNjI1IDExMS43OTY5IDE0Mi4wMzEyIDEyMy44OTA2IFExMzQuODU5NCAxMzUuOTg0NCAxMzQuODU5NCAxNjAuMTcxOSBRMTM0Ljg1OTQgMTg0LjUgMTQyLjAzMTIgMTk2LjU5MzggUTE0OS4wNjI1IDIwOC42ODc1IDE1OS4wNDY5IDIwOC42ODc1IFExNjkuMDMxMiAyMDguNjg3NSAxNzYuMDYyNSAxOTYuNTkzOCBRMTgzLjIzNDQgMTg0LjUgMTgzLjIzNDQgMTYwLjE3MTkgUTE4My4yMzQ0IDEzNS45ODQ0IDE3Ni4wNjI1IDEyMy44OTA2IFExNjkuMDMxMiAxMTEuNzk2OSAxNTkuMDQ2OSAxMTEuNzk2OSBaTTE1OS4wNDY5IDk5LjI4MTIgUTE3Ny40Njg4IDk5LjI4MTIgMTg5LjQyMTkgMTE0Ljg5MDYgUTIwMS4zNzUgMTMwLjUgMjAxLjM3NSAxNjAuMTcxOSBRMjAxLjM3NSAxODkuOTg0NCAxODkuNDIxOSAyMDUuNTkzOCBRMTc3LjQ2ODggMjIxLjIwMzEgMTU5LjA0NjkgMjIxLjIwMzEgUTEzNi4yNjU2IDIyMS4yMDMxIDEyNi40MjE5IDIwNS41OTM4IFExMTYuNTc4MSAxODkuOTg0NCAxMTYuNTc4MSAxNjAuMTcxOSBRMTE2LjU3ODEgMTMwLjUgMTI2LjQyMTkgMTE0Ljg5MDYgUTEzNi4yNjU2IDk5LjI4MTIgMTU5LjA0NjkgOTkuMjgxMiBaTTgwLjU3ODEgMjE5LjA5MzggTDgwLjU3ODEgMTE3LjcwMzEgTDYxLjg3NSAxMjMuNDY4OCBMNjEuODc1IDEwNy4xNTYyIEw4MS41NjI1IDEwMS42NzE5IEwxMDAuODI4MSAxMDEuNjcxOSBMMTAwLjgyODEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlSlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTg5LjE1NjIgMTAxLjY3MTkgTDEwNy4wMTU2IDEwMS42NzE5IEwxMDcuMDE1NiAxNzguNzM0NCBRMTA3LjAxNTYgMTk5LjY4NzUgOTcuODc1IDIwOS41MzEyIFE4OC44NzUgMjE5LjIzNDQgNjguNzY1NiAyMTkuMjM0NCBMNjEuODc1IDIxOS4yMzQ0IEw2MS44NzUgMjA1LjczNDQgTDY3LjUgMjA1LjczNDQgUTc5LjMxMjUgMjA1LjczNDQgODQuMjM0NCAxOTkuODI4MSBRODkuMTU2MiAxOTMuOTIxOSA4OS4xNTYyIDE3OC43MzQ0IEw4OS4xNTYyIDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpVFcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTEwNy4yOTY5IDIyMS4wNjI1IFExMDYuNzM0NCAyMjEuMDYyNSAxMDUuNTM5MSAyMjEuMTMyOCBRMTA0LjM0MzggMjIxLjIwMzEgMTAzLjY0MDYgMjIxLjIwMzEgUTgxLjQyMTkgMjIxLjIwMzEgNzAuNTIzNCAyMDYuMDg1OSBRNTkuNjI1IDE5MC45Njg4IDU5LjYyNSAxNjAuMzEyNSBRNTkuNjI1IDEyOS41MTU2IDcwLjU5MzggMTE0LjM5ODQgUTgxLjU2MjUgOTkuMjgxMiAxMDMuNzgxMiA5OS4yODEyIFExMjYuMTQwNiA5OS4yODEyIDEzNy4xMDk0IDExNC4zOTg0IFExNDguMDc4MSAxMjkuNTE1NiAxNDguMDc4MSAxNjAuMzEyNSBRMTQ4LjA3ODEgMTgzLjUxNTYgMTQyLjAzMTIgMTk3LjY0ODQgUTEzNS45ODQ0IDIxMS43ODEyIDEyMy42MDk0IDIxNy40MDYyIEwxNDEuMzI4MSAyMzIuMzEyNSBMMTI3Ljk2ODggMjQwLjE4NzUgTDEwNy4yOTY5IDIyMS4wNjI1IFpNMTI5LjM3NSAxNjAuMzEyNSBRMTI5LjM3NSAxMzQuNDM3NSAxMjMuMzk4NCAxMjMuMzI4MSBRMTE3LjQyMTkgMTEyLjIxODggMTAzLjc4MTIgMTEyLjIxODggUTkwLjI4MTIgMTEyLjIxODggODQuMzA0NyAxMjMuMzI4MSBRNzguMzI4MSAxMzQuNDM3NSA3OC4zMjgxIDE2MC4zMTI1IFE3OC4zMjgxIDE4Ni4xODc1IDg0LjMwNDcgMTk3LjI5NjkgUTkwLjI4MTIgMjA4LjQwNjIgMTAzLjc4MTIgMjA4LjQwNjIgUTExNy40MjE5IDIwOC40MDYyIDEyMy4zOTg0IDE5Ny4yOTY5IFExMjkuMzc1IDE4Ni4xODc1IDEyOS4zNzUgMTYwLjMxMjUgWk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTY0LjI2NTYgODQuNzk2OSBRNDcuMzkwNiA4NC43OTY5IDQ3LjM5MDYgMTAxLjY3MTkgTDQ3LjM5MDYgMzcwLjY4NzUgUTQ3LjM5MDYgMzg3LjU2MjUgNjQuMjY1NiAzODcuNTYyNSBMMjM1LjEyNSAzODcuNTYyNSBRMjUyIDM4Ny41NjI1IDI1MiAzNzAuNjg3NSBMMjUyIDEwMS42NzE5IFEyNTIgODQuNzk2OSAyMzUuMTI1IDg0Ljc5NjkgTDY0LjI2NTYgODQuNzk2OSBaTTY0LjI2NTYgNjcuOTIxOSBMMjM1LjEyNSA2Ny45MjE5IFEyNjguODc1IDY3LjkyMTkgMjY4Ljg3NSAxMDEuNjcxOSBMMjY4Ljg3NSAzNzAuNjg3NSBRMjY4Ljg3NSA0MDQuNDM3NSAyMzUuMTI1IDQwNC40Mzc1IEw2NC4yNjU2IDQwNC40Mzc1IFEzMC41MTU2IDQwNC40Mzc1IDMwLjUxNTYgMzcwLjY4NzUgTDMwLjUxNTYgMTAxLjY3MTkgUTMwLjUxNTYgNjcuOTIxOSA2NC4yNjU2IDY3LjkyMTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlS1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTYxLjg3NSAxMDEuNjcxOSBMNzkuNzM0NCAxMDEuNjcxOSBMNzkuNzM0NCAxNTEuMzEyNSBMMTMwLjY0MDYgMTAxLjY3MTkgTDE1My43MDMxIDEwMS42NzE5IEw5Ni40Njg4IDE1Ni41MTU2IEwxNTguMzQzOCAyMTkuMjM0NCBMMTM0Ljg1OTQgMjE5LjIzNDQgTDc5LjczNDQgMTYyLjU2MjUgTDc5LjczNDQgMjE5LjIzNDQgTDYxLjg3NSAyMTkuMjM0NCBMNjEuODc1IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpkFcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuNjcxOSAxMTUuNzM0NCBMOTEuODI4MSAxNzUuNzgxMiBMMTI5LjUxNTYgMTc1Ljc4MTIgTDExMC42NzE5IDExNS43MzQ0IFpNOTkuOTg0NCAxMDEuNjcxOSBMMTIxLjY0MDYgMTAxLjY3MTkgTDE2Mi4xNDA2IDIxOS4yMzQ0IEwxNDMuNTc4MSAyMTkuMjM0NCBMMTM0LjAxNTYgMTg4LjU3ODEgTDg3LjYwOTQgMTg4LjU3ODEgTDc4LjA0NjkgMjE5LjIzNDQgTDU5LjQ4NDQgMjE5LjIzNDQgTDk5Ljk4NDQgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmMlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTg2LjM0MzggMjAzLjA2MjUgTDE0NS45Njg4IDIwMy4wNjI1IEwxNDUuOTY4OCAyMTkuMDkzOCBMNjEuODc1IDIxOS4wOTM4IEw2MS44NzUgMjAzLjYyNSBRNjYuNjU2MiAxOTkuMjY1NiA3NS41MTU2IDE5MS4zOTA2IFExMjMuODkwNiAxNDguNSAxMjMuODkwNiAxMzUuMjgxMiBRMTIzLjg5MDYgMTI2IDExNi41NzgxIDEyMC4zMDQ3IFExMDkuMjY1NiAxMTQuNjA5NCA5Ny4zMTI1IDExNC42MDk0IFE5MCAxMTQuNjA5NCA4MS40MjE5IDExNy4wNzAzIFE3Mi44NDM4IDExOS41MzEyIDYyLjcxODggMTI0LjQ1MzEgTDYyLjcxODggMTA3LjE1NjIgUTczLjU0NjkgMTAzLjIxODggODIuODk4NCAxMDEuMjUgUTkyLjI1IDk5LjI4MTIgMTAwLjI2NTYgOTkuMjgxMiBRMTIwLjY1NjIgOTkuMjgxMiAxMzIuODkwNiAxMDguNTYyNSBRMTQ1LjEyNSAxMTcuODQzOCAxNDUuMTI1IDEzMy4wMzEyIFExNDUuMTI1IDE1Mi41NzgxIDk4LjU3ODEgMTkyLjUxNTYgUTkwLjcwMzEgMTk5LjI2NTYgODYuMzQzOCAyMDMuMDYyNSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaYzXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTIxLjc4MTIgMTU1LjUzMTIgUTEzNC43MTg4IDE1OC4wNjI1IDE0MS44MjAzIDE2NS43MjY2IFExNDguOTIxOSAxNzMuMzkwNiAxNDguOTIxOSAxODQuOTIxOSBRMTQ4LjkyMTkgMjAyLjM1OTQgMTM1LjU2MjUgMjExLjc4MTIgUTEyMi4yMDMxIDIyMS4yMDMxIDk3LjMxMjUgMjIxLjIwMzEgUTg5LjI5NjkgMjIxLjIwMzEgODAuNTA3OCAyMTkuNzI2NiBRNzEuNzE4OCAyMTguMjUgNjEuODc1IDIxNS40Mzc1IEw2MS44NzUgMTk4LjQyMTkgUTY5LjE4NzUgMjAyLjIxODggNzcuNTU0NyAyMDQuMDQ2OSBRODUuOTIxOSAyMDUuODc1IDk1LjM0MzggMjA1Ljg3NSBRMTEwLjY3MTkgMjA1Ljg3NSAxMTkuMTA5NCAyMDAuMzIwMyBRMTI3LjU0NjkgMTk0Ljc2NTYgMTI3LjU0NjkgMTg0LjkyMTkgUTEyNy41NDY5IDE3NC41MTU2IDExOS43NDIyIDE2OS4xNzE5IFExMTEuOTM3NSAxNjMuODI4MSA5Ni43NSAxNjMuODI4MSBMODQuNjU2MiAxNjMuODI4MSBMODQuNjU2MiAxNDguNjQwNiBMOTcuODc1IDE0OC42NDA2IFExMTEuMDkzOCAxNDguNjQwNiAxMTcuOTE0MSAxNDQuMjEwOSBRMTI0LjczNDQgMTM5Ljc4MTIgMTI0LjczNDQgMTMxLjM0MzggUTEyNC43MzQ0IDEyMy4xODc1IDExNy43MDMxIDExOC44OTg0IFExMTAuNjcxOSAxMTQuNjA5NCA5Ny4zMTI1IDExNC42MDk0IFE5MS42ODc1IDExNC42MDk0IDg0LjUxNTYgMTE1Ljg3NSBRNzcuMzQzOCAxMTcuMTQwNiA2NS45NTMxIDEyMC4zNzUgTDY1Ljk1MzEgMTA0LjIwMzEgUTc2LjIxODggMTAxLjgxMjUgODUuMjE4OCAxMDAuNTQ2OSBROTQuMjE4OCA5OS4yODEyIDEwMS45NTMxIDk5LjI4MTIgUTEyMi4yMDMxIDk5LjI4MTIgMTM0LjA4NTkgMTA3LjU3ODEgUTE0NS45Njg4IDExNS44NzUgMTQ1Ljk2ODggMTI5Ljc5NjkgUTE0NS45Njg4IDEzOS41IDEzOS42NDA2IDE0Ni4yNSBRMTMzLjMxMjUgMTUzIDEyMS43ODEyIDE1NS41MzEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpjRcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMjAuMDkzOCAxMTguNjg3NSBMNzYuNjQwNiAxNzcuNjA5NCBMMTIwLjA5MzggMTc3LjYwOTQgTDEyMC4wOTM4IDExOC42ODc1IFpNMTE3IDEwMS42NzE5IEwxNDAuMzQzOCAxMDEuNjcxOSBMMTQwLjM0MzggMTc3LjYwOTQgTDE1OS4zMjgxIDE3Ny42MDk0IEwxNTkuMzI4MSAxOTIuOTM3NSBMMTQwLjM0MzggMTkyLjkzNzUgTDE0MC4zNDM4IDIxOS4wOTM4IEwxMjAuMDkzOCAyMTkuMDkzOCBMMTIwLjA5MzggMTkyLjkzNzUgTDYxLjg3NSAxOTIuOTM3NSBMNjEuODc1IDE3NS45MjE5IEwxMTcgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmNVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTY3LjUgMTAxLjY3MTkgTDEzOS4yMTg4IDEwMS42NzE5IEwxMzkuMjE4OCAxMTUuMDMxMiBMODQuMjM0NCAxMTUuMDMxMiBMODQuMjM0NCAxNDMuNzE4OCBRODguMTcxOSAxNDIuNDUzMSA5Mi4yNSAxNDEuODkwNiBROTYuMTg3NSAxNDEuMzI4MSAxMDAuMTI1IDE0MS4zMjgxIFExMjIuNzY1NiAxNDEuMzI4MSAxMzUuOTg0NCAxNTIuMTU2MiBRMTQ5LjIwMzEgMTYyLjg0MzggMTQ5LjIwMzEgMTgxLjI2NTYgUTE0OS4yMDMxIDIwMC4yNSAxMzUuNTYyNSAyMTAuNzk2OSBRMTIyLjA2MjUgMjIxLjIwMzEgOTcuMzEyNSAyMjEuMjAzMSBRODguODc1IDIyMS4yMDMxIDgwLjAxNTYgMjE5LjkzNzUgUTcxLjE1NjIgMjE4LjY3MTkgNjEuODc1IDIxNi4xNDA2IEw2MS44NzUgMjAwLjI1IFE2OS44OTA2IDIwNC4wNDY5IDc4LjYwOTQgMjA2LjAxNTYgUTg3LjMyODEgMjA3Ljg0MzggOTcuMDMxMiAyMDcuODQzOCBRMTEyLjY0MDYgMjA3Ljg0MzggMTIxLjc4MTIgMjAwLjY3MTkgUTEzMC45MjE5IDE5My41IDEzMC45MjE5IDE4MS4yNjU2IFExMzAuOTIxOSAxNjkuMDMxMiAxMjEuNzgxMiAxNjEuODU5NCBRMTEyLjY0MDYgMTU0LjY4NzUgOTcuMDMxMiAxNTQuNjg3NSBRODkuNzE4OCAxNTQuNjg3NSA4Mi40MDYyIDE1Ni4wOTM4IFE3NS4wOTM4IDE1Ny41IDY3LjUgMTYwLjQ1MzEgTDY3LjUgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmNlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTExMC4xMDk0IDE1My43MDMxIFE5Ny43MzQ0IDE1My43MDMxIDkwLjU2MjUgMTYxLjAxNTYgUTgzLjM5MDYgMTY4LjQ2ODggODMuMzkwNiAxODEuMjY1NiBRODMuMzkwNiAxOTMuOTIxOSA5MC41NjI1IDIwMS4yMzQ0IFE5Ny43MzQ0IDIwOC42ODc1IDExMC4xMDk0IDIwOC42ODc1IFExMjIuMzQzOCAyMDguNjg3NSAxMjkuNTE1NiAyMDEuMjM0NCBRMTM2LjY4NzUgMTkzLjkyMTkgMTM2LjY4NzUgMTgxLjI2NTYgUTEzNi42ODc1IDE2OC40Njg4IDEyOS41MTU2IDE2MS4wMTU2IFExMjIuMzQzOCAxNTMuNzAzMSAxMTAuMTA5NCAxNTMuNzAzMSBaTTE0Ni4zOTA2IDEwMy45MjE5IEwxNDYuMzkwNiAxMTguNDA2MiBRMTM5LjUgMTE1LjU5MzggMTMyLjQ2ODggMTE0LjE4NzUgUTEyNS40Mzc1IDExMi42NDA2IDExOC41NDY5IDExMi42NDA2IFExMDAuNTQ2OSAxMTIuNjQwNiA5MC45ODQ0IDEyMy4xODc1IFE4MS40MjE5IDEzMy44NzUgODAuMDE1NiAxNTUuMzkwNiBRODUuMzU5NCAxNDguNSA5My4zNzUgMTQ0Ljg0MzggUTEwMS41MzEyIDE0MS4xODc1IDExMS4wOTM4IDE0MS4xODc1IFExMzEuNDg0NCAxNDEuMTg3NSAxNDMuMjk2OSAxNTEuODc1IFExNTUuMTA5NCAxNjIuNzAzMSAxNTUuMTA5NCAxODEuMjY1NiBRMTU1LjEwOTQgMTk5LjEyNSAxNDIuNzM0NCAyMTAuMjM0NCBRMTMwLjUgMjIxLjIwMzEgMTEwLjEwOTQgMjIxLjIwMzEgUTg2LjYyNSAyMjEuMjAzMSA3NC4yNSAyMDUuNTkzOCBRNjEuODc1IDE4OS45ODQ0IDYxLjg3NSAxNjAuMTcxOSBRNjEuODc1IDEzMi4zMjgxIDc3LjA2MjUgMTE1Ljg3NSBROTIuMjUgOTkuMjgxMiAxMTcuODQzOCA5OS4yODEyIFExMjQuNzM0NCA5OS4yODEyIDEzMS43NjU2IDEwMC40MDYyIFExMzguNzk2OSAxMDEuNjcxOSAxNDYuMzkwNiAxMDMuOTIxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaY3XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjEuODc1IDEwMS42NzE5IEwxNDguNjQwNiAxMDEuNjcxOSBMMTQ4LjY0MDYgMTA4LjQyMTkgTDk5LjcwMzEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggTDEyNi43MDMxIDExNS4wMzEyIEw2MS44NzUgMTE1LjAzMTIgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaY4XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTA4LjI4MTIgMTYzLjEyNSBROTUuMjAzMSAxNjMuMTI1IDg3Ljc1IDE2OS4zMTI1IFE4MC4yOTY5IDE3NS4zNTk0IDgwLjI5NjkgMTg1LjkwNjIgUTgwLjI5NjkgMTk2LjU5MzggODcuNzUgMjAyLjY0MDYgUTk1LjIwMzEgMjA4LjY4NzUgMTA4LjI4MTIgMjA4LjY4NzUgUTEyMS4yMTg4IDIwOC42ODc1IDEyOC44MTI1IDIwMi41IFExMzYuMjY1NiAxOTYuNDUzMSAxMzYuMjY1NiAxODUuOTA2MiBRMTM2LjI2NTYgMTc1LjM1OTQgMTI4LjgxMjUgMTY5LjMxMjUgUTEyMS4zNTk0IDE2My4xMjUgMTA4LjI4MTIgMTYzLjEyNSBaTTkwIDE1Ni4yMzQ0IFE3OC4xODc1IDE1My43MDMxIDcxLjcxODggMTQ2LjgxMjUgUTY1LjEwOTQgMTM5Ljc4MTIgNjUuMTA5NCAxMjkuNjU2MiBRNjUuMTA5NCAxMTUuNTkzOCA3Ni42NDA2IDEwNy40Mzc1IFE4OC4xNzE5IDk5LjI4MTIgMTA4LjI4MTIgOTkuMjgxMiBRMTI4LjM5MDYgOTkuMjgxMiAxMzkuOTIxOSAxMDcuNDM3NSBRMTUxLjMxMjUgMTE1LjU5MzggMTUxLjMxMjUgMTI5LjY1NjIgUTE1MS4zMTI1IDE0MC4wNjI1IDE0NC44NDM4IDE0Ni44MTI1IFExMzguMjM0NCAxNTMuNzAzMSAxMjYuNTYyNSAxNTYuMjM0NCBRMTM5LjIxODggMTU4Ljc2NTYgMTQ3LjA5MzggMTY2LjkyMTkgUTE1NC41NDY5IDE3NC42NTYyIDE1NC41NDY5IDE4NS45MDYyIFExNTQuNTQ2OSAyMDIuOTIxOSAxNDIuNTkzOCAyMTIuMDYyNSBRMTMwLjUgMjIxLjIwMzEgMTA4LjI4MTIgMjIxLjIwMzEgUTg1LjkyMTkgMjIxLjIwMzEgNzMuOTY4OCAyMTIuMDYyNSBRNjEuODc1IDIwMi45MjE5IDYxLjg3NSAxODUuOTA2MiBRNjEuODc1IDE3NC45Mzc1IDY5LjMyODEgMTY2LjkyMTkgUTc2LjkyMTkgMTU5LjA0NjkgOTAgMTU2LjIzNDQgWk04My4yNSAxMzEuMjAzMSBRODMuMjUgMTQwLjA2MjUgODkuODU5NCAxNDUuNDA2MiBROTYuMzI4MSAxNTAuNjA5NCAxMDguMjgxMiAxNTAuNjA5NCBRMTE5LjY3MTkgMTUwLjYwOTQgMTI2LjU2MjUgMTQ1LjQwNjIgUTEzMy4zMTI1IDE0MC4zNDM4IDEzMy4zMTI1IDEzMS4yMDMxIFExMzMuMzEyNSAxMjIuMzQzOCAxMjYuNTYyNSAxMTcgUTExOS45NTMxIDExMS43OTY5IDEwOC4yODEyIDExMS43OTY5IFE5Ni42MDk0IDExMS43OTY5IDg5Ljg1OTQgMTE3IFE4My4yNSAxMjIuMDYyNSA4My4yNSAxMzEuMjAzMSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaY5XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNzAuNTkzOCAyMTYuNTYyNSBMNzAuNTkzOCAyMDIuMDc4MSBRNzcuNDg0NCAyMDQuODkwNiA4NC41MTU2IDIwNi40Mzc1IFE5MS41NDY5IDIwNy44NDM4IDk4LjI5NjkgMjA3Ljg0MzggUTExNi40Mzc1IDIwNy44NDM4IDEyNiAxOTcuMjk2OSBRMTM1LjQyMTkgMTg2Ljc1IDEzNi44MjgxIDE2NS4wOTM4IFExMzEuOTA2MiAxNzEuNzAzMSAxMjMuNDY4OCAxNzUuNSBRMTE1LjQ1MzEgMTc5LjE1NjIgMTA1Ljc1IDE3OS4xNTYyIFE4NS41IDE3OS4xNTYyIDczLjY4NzUgMTY4LjQ2ODggUTYxLjg3NSAxNTcuNzgxMiA2MS44NzUgMTM5LjIxODggUTYxLjg3NSAxMjEuMDc4MSA3NC4xMDk0IDExMC4yNSBRODYuNDg0NCA5OS4yODEyIDEwNi44NzUgOTkuMjgxMiBRMTMwLjM1OTQgOTkuMjgxMiAxNDIuNTkzOCAxMTQuODkwNiBRMTU0Ljk2ODggMTMwLjUgMTU0Ljk2ODggMTYwLjMxMjUgUTE1NC45Njg4IDE4OC4xNTYyIDEzOS45MjE5IDIwNC42MDk0IFExMjQuNzM0NCAyMjEuMjAzMSA5OS4xNDA2IDIyMS4yMDMxIFE5Mi4yNSAyMjEuMjAzMSA4NS4yMTg4IDIyMC4wNzgxIFE3OC4xODc1IDIxOC44MTI1IDcwLjU5MzggMjE2LjU2MjUgWk0xMDYuODc1IDE2Ni43ODEyIFExMTkuMjUgMTY2Ljc4MTIgMTI2LjQyMTkgMTU5LjQ2ODggUTEzMy41OTM4IDE1Mi4xNTYyIDEzMy41OTM4IDEzOS4yMTg4IFExMzMuNTkzOCAxMjYuNTYyNSAxMjYuNDIxOSAxMTkuMjUgUTExOS4yNSAxMTEuNzk2OSAxMDYuODc1IDExMS43OTY5IFE5NC45MjE5IDExMS43OTY5IDg3LjQ2ODggMTE5LjI1IFE4MC4xNTYyIDEyNi41NjI1IDgwLjE1NjIgMTM5LjIxODggUTgwLjE1NjIgMTUyLjE1NjIgODcuNDY4OCAxNTkuNDY4OCBROTQuNjQwNiAxNjYuNzgxMiAxMDYuODc1IDE2Ni43ODEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpjEwXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTU5LjA0NjkgMTExLjc5NjkgUTE0OS4wNjI1IDExMS43OTY5IDE0Mi4wMzEyIDEyMy44OTA2IFExMzQuODU5NCAxMzUuOTg0NCAxMzQuODU5NCAxNjAuMTcxOSBRMTM0Ljg1OTQgMTg0LjUgMTQyLjAzMTIgMTk2LjU5MzggUTE0OS4wNjI1IDIwOC42ODc1IDE1OS4wNDY5IDIwOC42ODc1IFExNjkuMDMxMiAyMDguNjg3NSAxNzYuMDYyNSAxOTYuNTkzOCBRMTgzLjIzNDQgMTg0LjUgMTgzLjIzNDQgMTYwLjE3MTkgUTE4My4yMzQ0IDEzNS45ODQ0IDE3Ni4wNjI1IDEyMy44OTA2IFExNjkuMDMxMiAxMTEuNzk2OSAxNTkuMDQ2OSAxMTEuNzk2OSBaTTE1OS4wNDY5IDk5LjI4MTIgUTE3Ny40Njg4IDk5LjI4MTIgMTg5LjQyMTkgMTE0Ljg5MDYgUTIwMS4zNzUgMTMwLjUgMjAxLjM3NSAxNjAuMTcxOSBRMjAxLjM3NSAxODkuOTg0NCAxODkuNDIxOSAyMDUuNTkzOCBRMTc3LjQ2ODggMjIxLjIwMzEgMTU5LjA0NjkgMjIxLjIwMzEgUTEzNi4yNjU2IDIyMS4yMDMxIDEyNi40MjE5IDIwNS41OTM4IFExMTYuNTc4MSAxODkuOTg0NCAxMTYuNTc4MSAxNjAuMTcxOSBRMTE2LjU3ODEgMTMwLjUgMTI2LjQyMTkgMTE0Ljg5MDYgUTEzNi4yNjU2IDk5LjI4MTIgMTU5LjA0NjkgOTkuMjgxMiBaTTgwLjU3ODEgMjE5LjA5MzggTDgwLjU3ODEgMTE3LjcwMzEgTDYxLjg3NSAxMjMuNDY4OCBMNjEuODc1IDEwNy4xNTYyIEw4MS41NjI1IDEwMS42NzE5IEwxMDAuODI4MSAxMDEuNjcxOSBMMTAwLjgyODEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmSlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTg5LjE1NjIgMTAxLjY3MTkgTDEwNy4wMTU2IDEwMS42NzE5IEwxMDcuMDE1NiAxNzguNzM0NCBRMTA3LjAxNTYgMTk5LjY4NzUgOTcuODc1IDIwOS41MzEyIFE4OC44NzUgMjE5LjIzNDQgNjguNzY1NiAyMTkuMjM0NCBMNjEuODc1IDIxOS4yMzQ0IEw2MS44NzUgMjA1LjczNDQgTDY3LjUgMjA1LjczNDQgUTc5LjMxMjUgMjA1LjczNDQgODQuMjM0NCAxOTkuODI4MSBRODkuMTU2MiAxOTMuOTIxOSA4OS4xNTYyIDE3OC43MzQ0IEw4OS4xNTYyIDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZplFcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNMTA3LjI5NjkgMjIxLjA2MjUgUTEwNi43MzQ0IDIyMS4wNjI1IDEwNS41MzkxIDIyMS4xMzI4IFExMDQuMzQzOCAyMjEuMjAzMSAxMDMuNjQwNiAyMjEuMjAzMSBRODEuNDIxOSAyMjEuMjAzMSA3MC41MjM0IDIwNi4wODU5IFE1OS42MjUgMTkwLjk2ODggNTkuNjI1IDE2MC4zMTI1IFE1OS42MjUgMTI5LjUxNTYgNzAuNTkzOCAxMTQuMzk4NCBRODEuNTYyNSA5OS4yODEyIDEwMy43ODEyIDk5LjI4MTIgUTEyNi4xNDA2IDk5LjI4MTIgMTM3LjEwOTQgMTE0LjM5ODQgUTE0OC4wNzgxIDEyOS41MTU2IDE0OC4wNzgxIDE2MC4zMTI1IFExNDguMDc4MSAxODMuNTE1NiAxNDIuMDMxMiAxOTcuNjQ4NCBRMTM1Ljk4NDQgMjExLjc4MTIgMTIzLjYwOTQgMjE3LjQwNjIgTDE0MS4zMjgxIDIzMi4zMTI1IEwxMjcuOTY4OCAyNDAuMTg3NSBMMTA3LjI5NjkgMjIxLjA2MjUgWk0xMjkuMzc1IDE2MC4zMTI1IFExMjkuMzc1IDEzNC40Mzc1IDEyMy4zOTg0IDEyMy4zMjgxIFExMTcuNDIxOSAxMTIuMjE4OCAxMDMuNzgxMiAxMTIuMjE4OCBROTAuMjgxMiAxMTIuMjE4OCA4NC4zMDQ3IDEyMy4zMjgxIFE3OC4zMjgxIDEzNC40Mzc1IDc4LjMyODEgMTYwLjMxMjUgUTc4LjMyODEgMTg2LjE4NzUgODQuMzA0NyAxOTcuMjk2OSBROTAuMjgxMiAyMDguNDA2MiAxMDMuNzgxMiAyMDguNDA2MiBRMTE3LjQyMTkgMjA4LjQwNjIgMTIzLjM5ODQgMTk3LjI5NjkgUTEyOS4zNzUgMTg2LjE4NzUgMTI5LjM3NSAxNjAuMzEyNSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpktcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02MS44NzUgMTAxLjY3MTkgTDc5LjczNDQgMTAxLjY3MTkgTDc5LjczNDQgMTUxLjMxMjUgTDEzMC42NDA2IDEwMS42NzE5IEwxNTMuNzAzMSAxMDEuNjcxOSBMOTYuNDY4OCAxNTYuNTE1NiBMMTU4LjM0MzggMjE5LjIzNDQgTDEzNC44NTk0IDIxOS4yMzQ0IEw3OS43MzQ0IDE2Mi41NjI1IEw3OS43MzQ0IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaNBXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuNjcxOSAxMTUuNzM0NCBMOTEuODI4MSAxNzUuNzgxMiBMMTI5LjUxNTYgMTc1Ljc4MTIgTDExMC42NzE5IDExNS43MzQ0IFpNOTkuOTg0NCAxMDEuNjcxOSBMMTIxLjY0MDYgMTAxLjY3MTkgTDE2Mi4xNDA2IDIxOS4yMzQ0IEwxNDMuNTc4MSAyMTkuMjM0NCBMMTM0LjAxNTYgMTg4LjU3ODEgTDg3LjYwOTQgMTg4LjU3ODEgTDc4LjA0NjkgMjE5LjIzNDQgTDU5LjQ4NDQgMjE5LjIzNDQgTDk5Ljk4NDQgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjMlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODYuMzQzOCAyMDMuMDYyNSBMMTQ1Ljk2ODggMjAzLjA2MjUgTDE0NS45Njg4IDIxOS4wOTM4IEw2MS44NzUgMjE5LjA5MzggTDYxLjg3NSAyMDMuNjI1IFE2Ni42NTYyIDE5OS4yNjU2IDc1LjUxNTYgMTkxLjM5MDYgUTEyMy44OTA2IDE0OC41IDEyMy44OTA2IDEzNS4yODEyIFExMjMuODkwNiAxMjYgMTE2LjU3ODEgMTIwLjMwNDcgUTEwOS4yNjU2IDExNC42MDk0IDk3LjMxMjUgMTE0LjYwOTQgUTkwIDExNC42MDk0IDgxLjQyMTkgMTE3LjA3MDMgUTcyLjg0MzggMTE5LjUzMTIgNjIuNzE4OCAxMjQuNDUzMSBMNjIuNzE4OCAxMDcuMTU2MiBRNzMuNTQ2OSAxMDMuMjE4OCA4Mi44OTg0IDEwMS4yNSBROTIuMjUgOTkuMjgxMiAxMDAuMjY1NiA5OS4yODEyIFExMjAuNjU2MiA5OS4yODEyIDEzMi44OTA2IDEwOC41NjI1IFExNDUuMTI1IDExNy44NDM4IDE0NS4xMjUgMTMzLjAzMTIgUTE0NS4xMjUgMTUyLjU3ODEgOTguNTc4MSAxOTIuNTE1NiBROTAuNzAzMSAxOTkuMjY1NiA4Ni4zNDM4IDIwMy4wNjI1IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZozNcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEyMS43ODEyIDE1NS41MzEyIFExMzQuNzE4OCAxNTguMDYyNSAxNDEuODIwMyAxNjUuNzI2NiBRMTQ4LjkyMTkgMTczLjM5MDYgMTQ4LjkyMTkgMTg0LjkyMTkgUTE0OC45MjE5IDIwMi4zNTk0IDEzNS41NjI1IDIxMS43ODEyIFExMjIuMjAzMSAyMjEuMjAzMSA5Ny4zMTI1IDIyMS4yMDMxIFE4OS4yOTY5IDIyMS4yMDMxIDgwLjUwNzggMjE5LjcyNjYgUTcxLjcxODggMjE4LjI1IDYxLjg3NSAyMTUuNDM3NSBMNjEuODc1IDE5OC40MjE5IFE2OS4xODc1IDIwMi4yMTg4IDc3LjU1NDcgMjA0LjA0NjkgUTg1LjkyMTkgMjA1Ljg3NSA5NS4zNDM4IDIwNS44NzUgUTExMC42NzE5IDIwNS44NzUgMTE5LjEwOTQgMjAwLjMyMDMgUTEyNy41NDY5IDE5NC43NjU2IDEyNy41NDY5IDE4NC45MjE5IFExMjcuNTQ2OSAxNzQuNTE1NiAxMTkuNzQyMiAxNjkuMTcxOSBRMTExLjkzNzUgMTYzLjgyODEgOTYuNzUgMTYzLjgyODEgTDg0LjY1NjIgMTYzLjgyODEgTDg0LjY1NjIgMTQ4LjY0MDYgTDk3Ljg3NSAxNDguNjQwNiBRMTExLjA5MzggMTQ4LjY0MDYgMTE3LjkxNDEgMTQ0LjIxMDkgUTEyNC43MzQ0IDEzOS43ODEyIDEyNC43MzQ0IDEzMS4zNDM4IFExMjQuNzM0NCAxMjMuMTg3NSAxMTcuNzAzMSAxMTguODk4NCBRMTEwLjY3MTkgMTE0LjYwOTQgOTcuMzEyNSAxMTQuNjA5NCBROTEuNjg3NSAxMTQuNjA5NCA4NC41MTU2IDExNS44NzUgUTc3LjM0MzggMTE3LjE0MDYgNjUuOTUzMSAxMjAuMzc1IEw2NS45NTMxIDEwNC4yMDMxIFE3Ni4yMTg4IDEwMS44MTI1IDg1LjIxODggMTAwLjU0NjkgUTk0LjIxODggOTkuMjgxMiAxMDEuOTUzMSA5OS4yODEyIFExMjIuMjAzMSA5OS4yODEyIDEzNC4wODU5IDEwNy41NzgxIFExNDUuOTY4OCAxMTUuODc1IDE0NS45Njg4IDEyOS43OTY5IFExNDUuOTY4OCAxMzkuNSAxMzkuNjQwNiAxNDYuMjUgUTEzMy4zMTI1IDE1MyAxMjEuNzgxMiAxNTUuNTMxMiBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaM0XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMjAuMDkzOCAxMTguNjg3NSBMNzYuNjQwNiAxNzcuNjA5NCBMMTIwLjA5MzggMTc3LjYwOTQgTDEyMC4wOTM4IDExOC42ODc1IFpNMTE3IDEwMS42NzE5IEwxNDAuMzQzOCAxMDEuNjcxOSBMMTQwLjM0MzggMTc3LjYwOTQgTDE1OS4zMjgxIDE3Ny42MDk0IEwxNTkuMzI4MSAxOTIuOTM3NSBMMTQwLjM0MzggMTkyLjkzNzUgTDE0MC4zNDM4IDIxOS4wOTM4IEwxMjAuMDkzOCAyMTkuMDkzOCBMMTIwLjA5MzggMTkyLjkzNzUgTDYxLjg3NSAxOTIuOTM3NSBMNjEuODc1IDE3NS45MjE5IEwxMTcgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjNVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjcuNSAxMDEuNjcxOSBMMTM5LjIxODggMTAxLjY3MTkgTDEzOS4yMTg4IDExNS4wMzEyIEw4NC4yMzQ0IDExNS4wMzEyIEw4NC4yMzQ0IDE0My43MTg4IFE4OC4xNzE5IDE0Mi40NTMxIDkyLjI1IDE0MS44OTA2IFE5Ni4xODc1IDE0MS4zMjgxIDEwMC4xMjUgMTQxLjMyODEgUTEyMi43NjU2IDE0MS4zMjgxIDEzNS45ODQ0IDE1Mi4xNTYyIFExNDkuMjAzMSAxNjIuODQzOCAxNDkuMjAzMSAxODEuMjY1NiBRMTQ5LjIwMzEgMjAwLjI1IDEzNS41NjI1IDIxMC43OTY5IFExMjIuMDYyNSAyMjEuMjAzMSA5Ny4zMTI1IDIyMS4yMDMxIFE4OC44NzUgMjIxLjIwMzEgODAuMDE1NiAyMTkuOTM3NSBRNzEuMTU2MiAyMTguNjcxOSA2MS44NzUgMjE2LjE0MDYgTDYxLjg3NSAyMDAuMjUgUTY5Ljg5MDYgMjA0LjA0NjkgNzguNjA5NCAyMDYuMDE1NiBRODcuMzI4MSAyMDcuODQzOCA5Ny4wMzEyIDIwNy44NDM4IFExMTIuNjQwNiAyMDcuODQzOCAxMjEuNzgxMiAyMDAuNjcxOSBRMTMwLjkyMTkgMTkzLjUgMTMwLjkyMTkgMTgxLjI2NTYgUTEzMC45MjE5IDE2OS4wMzEyIDEyMS43ODEyIDE2MS44NTk0IFExMTIuNjQwNiAxNTQuNjg3NSA5Ny4wMzEyIDE1NC42ODc1IFE4OS43MTg4IDE1NC42ODc1IDgyLjQwNjIgMTU2LjA5MzggUTc1LjA5MzggMTU3LjUgNjcuNSAxNjAuNDUzMSBMNjcuNSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaM2XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuMTA5NCAxNTMuNzAzMSBROTcuNzM0NCAxNTMuNzAzMSA5MC41NjI1IDE2MS4wMTU2IFE4My4zOTA2IDE2OC40Njg4IDgzLjM5MDYgMTgxLjI2NTYgUTgzLjM5MDYgMTkzLjkyMTkgOTAuNTYyNSAyMDEuMjM0NCBROTcuNzM0NCAyMDguNjg3NSAxMTAuMTA5NCAyMDguNjg3NSBRMTIyLjM0MzggMjA4LjY4NzUgMTI5LjUxNTYgMjAxLjIzNDQgUTEzNi42ODc1IDE5My45MjE5IDEzNi42ODc1IDE4MS4yNjU2IFExMzYuNjg3NSAxNjguNDY4OCAxMjkuNTE1NiAxNjEuMDE1NiBRMTIyLjM0MzggMTUzLjcwMzEgMTEwLjEwOTQgMTUzLjcwMzEgWk0xNDYuMzkwNiAxMDMuOTIxOSBMMTQ2LjM5MDYgMTE4LjQwNjIgUTEzOS41IDExNS41OTM4IDEzMi40Njg4IDExNC4xODc1IFExMjUuNDM3NSAxMTIuNjQwNiAxMTguNTQ2OSAxMTIuNjQwNiBRMTAwLjU0NjkgMTEyLjY0MDYgOTAuOTg0NCAxMjMuMTg3NSBRODEuNDIxOSAxMzMuODc1IDgwLjAxNTYgMTU1LjM5MDYgUTg1LjM1OTQgMTQ4LjUgOTMuMzc1IDE0NC44NDM4IFExMDEuNTMxMiAxNDEuMTg3NSAxMTEuMDkzOCAxNDEuMTg3NSBRMTMxLjQ4NDQgMTQxLjE4NzUgMTQzLjI5NjkgMTUxLjg3NSBRMTU1LjEwOTQgMTYyLjcwMzEgMTU1LjEwOTQgMTgxLjI2NTYgUTE1NS4xMDk0IDE5OS4xMjUgMTQyLjczNDQgMjEwLjIzNDQgUTEzMC41IDIyMS4yMDMxIDExMC4xMDk0IDIyMS4yMDMxIFE4Ni42MjUgMjIxLjIwMzEgNzQuMjUgMjA1LjU5MzggUTYxLjg3NSAxODkuOTg0NCA2MS44NzUgMTYwLjE3MTkgUTYxLjg3NSAxMzIuMzI4MSA3Ny4wNjI1IDExNS44NzUgUTkyLjI1IDk5LjI4MTIgMTE3Ljg0MzggOTkuMjgxMiBRMTI0LjczNDQgOTkuMjgxMiAxMzEuNzY1NiAxMDAuNDA2MiBRMTM4Ljc5NjkgMTAxLjY3MTkgMTQ2LjM5MDYgMTAzLjkyMTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjN1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjEuODc1IDEwMS42NzE5IEwxNDguNjQwNiAxMDEuNjcxOSBMMTQ4LjY0MDYgMTA4LjQyMTkgTDk5LjcwMzEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggTDEyNi43MDMxIDExNS4wMzEyIEw2MS44NzUgMTE1LjAzMTIgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaM4XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMDguMjgxMiAxNjMuMTI1IFE5NS4yMDMxIDE2My4xMjUgODcuNzUgMTY5LjMxMjUgUTgwLjI5NjkgMTc1LjM1OTQgODAuMjk2OSAxODUuOTA2MiBRODAuMjk2OSAxOTYuNTkzOCA4Ny43NSAyMDIuNjQwNiBROTUuMjAzMSAyMDguNjg3NSAxMDguMjgxMiAyMDguNjg3NSBRMTIxLjIxODggMjA4LjY4NzUgMTI4LjgxMjUgMjAyLjUgUTEzNi4yNjU2IDE5Ni40NTMxIDEzNi4yNjU2IDE4NS45MDYyIFExMzYuMjY1NiAxNzUuMzU5NCAxMjguODEyNSAxNjkuMzEyNSBRMTIxLjM1OTQgMTYzLjEyNSAxMDguMjgxMiAxNjMuMTI1IFpNOTAgMTU2LjIzNDQgUTc4LjE4NzUgMTUzLjcwMzEgNzEuNzE4OCAxNDYuODEyNSBRNjUuMTA5NCAxMzkuNzgxMiA2NS4xMDk0IDEyOS42NTYyIFE2NS4xMDk0IDExNS41OTM4IDc2LjY0MDYgMTA3LjQzNzUgUTg4LjE3MTkgOTkuMjgxMiAxMDguMjgxMiA5OS4yODEyIFExMjguMzkwNiA5OS4yODEyIDEzOS45MjE5IDEwNy40Mzc1IFExNTEuMzEyNSAxMTUuNTkzOCAxNTEuMzEyNSAxMjkuNjU2MiBRMTUxLjMxMjUgMTQwLjA2MjUgMTQ0Ljg0MzggMTQ2LjgxMjUgUTEzOC4yMzQ0IDE1My43MDMxIDEyNi41NjI1IDE1Ni4yMzQ0IFExMzkuMjE4OCAxNTguNzY1NiAxNDcuMDkzOCAxNjYuOTIxOSBRMTU0LjU0NjkgMTc0LjY1NjIgMTU0LjU0NjkgMTg1LjkwNjIgUTE1NC41NDY5IDIwMi45MjE5IDE0Mi41OTM4IDIxMi4wNjI1IFExMzAuNSAyMjEuMjAzMSAxMDguMjgxMiAyMjEuMjAzMSBRODUuOTIxOSAyMjEuMjAzMSA3My45Njg4IDIxMi4wNjI1IFE2MS44NzUgMjAyLjkyMTkgNjEuODc1IDE4NS45MDYyIFE2MS44NzUgMTc0LjkzNzUgNjkuMzI4MSAxNjYuOTIxOSBRNzYuOTIxOSAxNTkuMDQ2OSA5MCAxNTYuMjM0NCBaTTgzLjI1IDEzMS4yMDMxIFE4My4yNSAxNDAuMDYyNSA4OS44NTk0IDE0NS40MDYyIFE5Ni4zMjgxIDE1MC42MDk0IDEwOC4yODEyIDE1MC42MDk0IFExMTkuNjcxOSAxNTAuNjA5NCAxMjYuNTYyNSAxNDUuNDA2MiBRMTMzLjMxMjUgMTQwLjM0MzggMTMzLjMxMjUgMTMxLjIwMzEgUTEzMy4zMTI1IDEyMi4zNDM4IDEyNi41NjI1IDExNyBRMTE5Ljk1MzEgMTExLjc5NjkgMTA4LjI4MTIgMTExLjc5NjkgUTk2LjYwOTQgMTExLjc5NjkgODkuODU5NCAxMTcgUTgzLjI1IDEyMi4wNjI1IDgzLjI1IDEzMS4yMDMxIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZozlcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTcwLjU5MzggMjE2LjU2MjUgTDcwLjU5MzggMjAyLjA3ODEgUTc3LjQ4NDQgMjA0Ljg5MDYgODQuNTE1NiAyMDYuNDM3NSBROTEuNTQ2OSAyMDcuODQzOCA5OC4yOTY5IDIwNy44NDM4IFExMTYuNDM3NSAyMDcuODQzOCAxMjYgMTk3LjI5NjkgUTEzNS40MjE5IDE4Ni43NSAxMzYuODI4MSAxNjUuMDkzOCBRMTMxLjkwNjIgMTcxLjcwMzEgMTIzLjQ2ODggMTc1LjUgUTExNS40NTMxIDE3OS4xNTYyIDEwNS43NSAxNzkuMTU2MiBRODUuNSAxNzkuMTU2MiA3My42ODc1IDE2OC40Njg4IFE2MS44NzUgMTU3Ljc4MTIgNjEuODc1IDEzOS4yMTg4IFE2MS44NzUgMTIxLjA3ODEgNzQuMTA5NCAxMTAuMjUgUTg2LjQ4NDQgOTkuMjgxMiAxMDYuODc1IDk5LjI4MTIgUTEzMC4zNTk0IDk5LjI4MTIgMTQyLjU5MzggMTE0Ljg5MDYgUTE1NC45Njg4IDEzMC41IDE1NC45Njg4IDE2MC4zMTI1IFExNTQuOTY4OCAxODguMTU2MiAxMzkuOTIxOSAyMDQuNjA5NCBRMTI0LjczNDQgMjIxLjIwMzEgOTkuMTQwNiAyMjEuMjAzMSBROTIuMjUgMjIxLjIwMzEgODUuMjE4OCAyMjAuMDc4MSBRNzguMTg3NSAyMTguODEyNSA3MC41OTM4IDIxNi41NjI1IFpNMTA2Ljg3NSAxNjYuNzgxMiBRMTE5LjI1IDE2Ni43ODEyIDEyNi40MjE5IDE1OS40Njg4IFExMzMuNTkzOCAxNTIuMTU2MiAxMzMuNTkzOCAxMzkuMjE4OCBRMTMzLjU5MzggMTI2LjU2MjUgMTI2LjQyMTkgMTE5LjI1IFExMTkuMjUgMTExLjc5NjkgMTA2Ljg3NSAxMTEuNzk2OSBROTQuOTIxOSAxMTEuNzk2OSA4Ny40Njg4IDExOS4yNSBRODAuMTU2MiAxMjYuNTYyNSA4MC4xNTYyIDEzOS4yMTg4IFE4MC4xNTYyIDE1Mi4xNTYyIDg3LjQ2ODggMTU5LjQ2ODggUTk0LjY0MDYgMTY2Ljc4MTIgMTA2Ljg3NSAxNjYuNzgxMiBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaMxMFxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTU5LjA0NjkgMTExLjc5NjkgUTE0OS4wNjI1IDExMS43OTY5IDE0Mi4wMzEyIDEyMy44OTA2IFExMzQuODU5NCAxMzUuOTg0NCAxMzQuODU5NCAxNjAuMTcxOSBRMTM0Ljg1OTQgMTg0LjUgMTQyLjAzMTIgMTk2LjU5MzggUTE0OS4wNjI1IDIwOC42ODc1IDE1OS4wNDY5IDIwOC42ODc1IFExNjkuMDMxMiAyMDguNjg3NSAxNzYuMDYyNSAxOTYuNTkzOCBRMTgzLjIzNDQgMTg0LjUgMTgzLjIzNDQgMTYwLjE3MTkgUTE4My4yMzQ0IDEzNS45ODQ0IDE3Ni4wNjI1IDEyMy44OTA2IFExNjkuMDMxMiAxMTEuNzk2OSAxNTkuMDQ2OSAxMTEuNzk2OSBaTTE1OS4wNDY5IDk5LjI4MTIgUTE3Ny40Njg4IDk5LjI4MTIgMTg5LjQyMTkgMTE0Ljg5MDYgUTIwMS4zNzUgMTMwLjUgMjAxLjM3NSAxNjAuMTcxOSBRMjAxLjM3NSAxODkuOTg0NCAxODkuNDIxOSAyMDUuNTkzOCBRMTc3LjQ2ODggMjIxLjIwMzEgMTU5LjA0NjkgMjIxLjIwMzEgUTEzNi4yNjU2IDIyMS4yMDMxIDEyNi40MjE5IDIwNS41OTM4IFExMTYuNTc4MSAxODkuOTg0NCAxMTYuNTc4MSAxNjAuMTcxOSBRMTE2LjU3ODEgMTMwLjUgMTI2LjQyMTkgMTE0Ljg5MDYgUTEzNi4yNjU2IDk5LjI4MTIgMTU5LjA0NjkgOTkuMjgxMiBaTTgwLjU3ODEgMjE5LjA5MzggTDgwLjU3ODEgMTE3LjcwMzEgTDYxLjg3NSAxMjMuNDY4OCBMNjEuODc1IDEwNy4xNTYyIEw4MS41NjI1IDEwMS42NzE5IEwxMDAuODI4MSAxMDEuNjcxOSBMMTAwLjgyODEgMjE5LjA5MzggTDgwLjU3ODEgMjE5LjA5MzggWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjSlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODkuMTU2MiAxMDEuNjcxOSBMMTA3LjAxNTYgMTAxLjY3MTkgTDEwNy4wMTU2IDE3OC43MzQ0IFExMDcuMDE1NiAxOTkuNjg3NSA5Ny44NzUgMjA5LjUzMTIgUTg4Ljg3NSAyMTkuMjM0NCA2OC43NjU2IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAyMDUuNzM0NCBMNjcuNSAyMDUuNzM0NCBRNzkuMzEyNSAyMDUuNzM0NCA4NC4yMzQ0IDE5OS44MjgxIFE4OS4xNTYyIDE5My45MjE5IDg5LjE1NjIgMTc4LjczNDQgTDg5LjE1NjIgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjUVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTA3LjI5NjkgMjIxLjA2MjUgUTEwNi43MzQ0IDIyMS4wNjI1IDEwNS41MzkxIDIyMS4xMzI4IFExMDQuMzQzOCAyMjEuMjAzMSAxMDMuNjQwNiAyMjEuMjAzMSBRODEuNDIxOSAyMjEuMjAzMSA3MC41MjM0IDIwNi4wODU5IFE1OS42MjUgMTkwLjk2ODggNTkuNjI1IDE2MC4zMTI1IFE1OS42MjUgMTI5LjUxNTYgNzAuNTkzOCAxMTQuMzk4NCBRODEuNTYyNSA5OS4yODEyIDEwMy43ODEyIDk5LjI4MTIgUTEyNi4xNDA2IDk5LjI4MTIgMTM3LjEwOTQgMTE0LjM5ODQgUTE0OC4wNzgxIDEyOS41MTU2IDE0OC4wNzgxIDE2MC4zMTI1IFExNDguMDc4MSAxODMuNTE1NiAxNDIuMDMxMiAxOTcuNjQ4NCBRMTM1Ljk4NDQgMjExLjc4MTIgMTIzLjYwOTQgMjE3LjQwNjIgTDE0MS4zMjgxIDIzMi4zMTI1IEwxMjcuOTY4OCAyNDAuMTg3NSBMMTA3LjI5NjkgMjIxLjA2MjUgWk0xMjkuMzc1IDE2MC4zMTI1IFExMjkuMzc1IDEzNC40Mzc1IDEyMy4zOTg0IDEyMy4zMjgxIFExMTcuNDIxOSAxMTIuMjE4OCAxMDMuNzgxMiAxMTIuMjE4OCBROTAuMjgxMiAxMTIuMjE4OCA4NC4zMDQ3IDEyMy4zMjgxIFE3OC4zMjgxIDEzNC40Mzc1IDc4LjMyODEgMTYwLjMxMjUgUTc4LjMyODEgMTg2LjE4NzUgODQuMzA0NyAxOTcuMjk2OSBROTAuMjgxMiAyMDguNDA2MiAxMDMuNzgxMiAyMDguNDA2MiBRMTE3LjQyMTkgMjA4LjQwNjIgMTIzLjM5ODQgMTk3LjI5NjkgUTEyOS4zNzUgMTg2LjE4NzUgMTI5LjM3NSAxNjAuMzEyNSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaNLXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02MS44NzUgMTAxLjY3MTkgTDc5LjczNDQgMTAxLjY3MTkgTDc5LjczNDQgMTUxLjMxMjUgTDEzMC42NDA2IDEwMS42NzE5IEwxNTMuNzAzMSAxMDEuNjcxOSBMOTYuNDY4OCAxNTYuNTE1NiBMMTU4LjM0MzggMjE5LjIzNDQgTDEzNC44NTk0IDIxOS4yMzQ0IEw3OS43MzQ0IDE2Mi41NjI1IEw3OS43MzQ0IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG5cXG4gICAgPHRhYmxlIHN0eWxlPVxcXCJib3JkZXItd2lkdGg6MXB4XFxcIj5cXG4gICAgICAgIDx0ciB3aWR0aD1cXFwiMTAwJVxcXCIgaGVpZ2h0PVxcXCIxMHB4XFxcIiBzdHlsZT1cXFwidmlzaWJpbGl0eTp2aXNpYmxlXFxcIn0+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibHVlXFxcIj4mYmxvY2s7PC9zcGFuPjwvcGxheWluZy1jYXJkPC90ZD5cXG4gICAgICAgIDwvdHI+XFxuICAgICAgICA8dHIgd2lkdGg9XFxcIjEwMCVcXFwiPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7QTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7Mjwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7Mzwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7NDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7NTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7Njwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7Nzwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7ODwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7OTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7MTA8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQgd2lkdGg9XFxcIjUwcHhcXFwiPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzO0o8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQgd2lkdGg9XFxcIjUwcHhcXFwiPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzO1E8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQgd2lkdGg9XFxcIjUwcHhcXFwiPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzO0s8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgIDwvdHI+XFxuICAgICAgICA8dHI+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0cztBPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czsyPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czszPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs0PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs1PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs2PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs3PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs4PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czs5PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0czsxMDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZoZWFydHM7Sjwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZoZWFydHM7UTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZoZWFydHM7Szwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgPC90cj5cXG4gICAgICAgIDx0cj5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7QTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczsyPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zOzM8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7NDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczs1PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zOzY8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7Nzwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczs4PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zOzk8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7MTA8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7Sjwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtcztRPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zO0s8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgIDwvdHI+XFxuICAgICAgICA8dHI+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7QTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzI8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczszPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7NDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzU8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczs2PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7Nzwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzg8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczs5PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7MTA8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHVicztKPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7UTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzO0s8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgIDwvdHI+XFxuICAgIDwvdGFibGU+XFxuPC9kaXY+XFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmF3LWxvYWRlciEuL3ZpZXdzL3BhcnRpYWxzL2ZyZXNoZGVjay5odG1sXG4vLyBtb2R1bGUgaWQgPSAyNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPHA+aW5kZXg8L3A+XFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmF3LWxvYWRlciEuL3ZpZXdzL3BhcnRpYWxzL2luZGV4Lmh0bWxcbi8vIG1vZHVsZSBpZCA9IDI1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8Zm9ybVxcbiAgICBpZD1cXFwibWVzc2FnZV9mb3JtXFxcIlxcbiAgICBvbnN1Ym1pdD1cXFwiXFxuICAgICB2YXIgZ3VuID0gR3VuKGxvY2F0aW9uLm9yaWdpbiArICcvZ3VuJyk7XFxuICAgICBvcGVucGdwLmNvbmZpZy5hZWFkX3Byb3RlY3QgPSB0cnVlXFxuICAgICBvcGVucGdwLmluaXRXb3JrZXIoeyBwYXRoOicvanMvb3BlbnBncC53b3JrZXIuanMnIH0pXFxuICAgICBpZiAoIW1lc3NhZ2VfdHh0LnZhbHVlKSB7XFxuICAgICAgICAgIHJldHVybiBmYWxzZVxcbiAgICAgfVxcbiAgICAgd2luZG93LmhhbmRsZVBvc3QobWVzc2FnZV90eHQudmFsdWUpKG9wZW5wZ3ApKHdpbmRvdy5sb2NhbFN0b3JhZ2UpKCdyb3lhbGUnKShndW4pLnRoZW4ocmVzdWx0ID0+IHtpZiAocmVzdWx0KSB7Y29uc29sZS5sb2cocmVzdWx0KX19KS5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcihlcnIpKTtkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVzc2FnZV90eHQnKS52YWx1ZSA9ICcnOyByZXR1cm4gZmFsc2VcXFwiXFxuICAgIG1ldGhvZD1cXFwicG9zdFxcXCJcXG4gICAgYWN0aW9uPVxcXCIvbWVzc2FnZVxcXCI+XFxuICAgIDxpbnB1dCBpZD1cXFwibWVzc2FnZV9mb3JtX2lucHV0XFxcIlxcbiAgICAgICAgdHlwZT1cXFwic3VibWl0XFxcIlxcbiAgICAgICAgdmFsdWU9XFxcInBvc3QgbWVzc2FnZVxcXCJcXG4gICAgICAgIGZvcm09XFxcIm1lc3NhZ2VfZm9ybVxcXCJcXG4gICAgICAgID5cXG48L2Zvcm0+XFxuPHRleHRhcmVhXFxuICAgIGlkPVxcXCJtZXNzYWdlX3R4dFxcXCJcXG4gICAgbmFtZT1cXFwibWVzc2FnZV90eHRcXFwiXFxuICAgIGZvcm09XFxcIm1lc3NhZ2VfZm9ybVxcXCJcXG4gICAgcm93cz01MVxcbiAgICBjb2xzPTcwXFxuICAgIHBsYWNlaG9sZGVyPVxcXCJwYXN0ZSBwbGFpbnRleHQgbWVzc2FnZSwgcHVibGljIGtleSwgb3IgcHJpdmF0ZSBrZXlcXFwiXFxuICAgIHN0eWxlPVxcXCJmb250LWZhbWlseTpNZW5sbyxDb25zb2xhcyxNb25hY28sTHVjaWRhIENvbnNvbGUsTGliZXJhdGlvbiBNb25vLERlamFWdSBTYW5zIE1vbm8sQml0c3RyZWFtIFZlcmEgU2FucyBNb25vLENvdXJpZXIgTmV3LCBtb25vc3BhY2U7XFxcIlxcbiAgICA+XFxuPC90ZXh0YXJlYT5cXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yYXctbG9hZGVyIS4vdmlld3MvcGFydGlhbHMvbWVzc2FnZV9mb3JtLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDI2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8c3BhbiBjbGFzcz1cXFwicm9hZG1hcFxcXCI+XFxuICAgIDxkZXRhaWxzPlxcbiAgICA8c3VtbWFyeT5yb2FkIG1hcDwvc3VtbWFyeT5cXG4gICAgPHVsPlxcbiAgICAgICAgPGxpPjxkZWw+PGEgaHJlZj1cXFwiaHR0cHM6Ly9naXRodWIuY29tL2NvbGVhbGJvbi9ob3RsaXBzL2NvbW1pdC8zYjcwOTgxY2JlNGUxMWUxNDAwYWU4ZTk0OGEwNmUzNTgyZDljMmQyXFxcIj5JbnN0YWxsIG5vZGUva29hL3dlYnBhY2s8L2E+PC9kZWw+PC9saT5cXG4gICAgICAgIDxsaT48ZGVsPjxhIGhyZWY9XFxcImh0dHBzOi8vZ2l0aHViLmNvbS9jb2xlYWxib24vaG90bGlwcy9pc3N1ZXMvMlxcXCI+SW5zdGFsbCBndW5kYjwvYT48L2RlbD48L2xpPlxcbiAgICAgICAgPGxpPjxkZWw+bWFrZSBhIDxhIGhyZWY9XFxcIiMvZGVja1xcXCI+ZGVjazwvYT4gb2YgY2FyZHM8L2RlbD48L2xpPlxcbiAgICAgICAgPGxpPjxkZWw+QWxpY2UgYW5kIEJvYiA8YSBocmVmPVxcXCIjL21lc3NhZ2VcXFwiPmlkZW50aWZ5PC9hPjwvZGVsPjwvbGk+XFxuICAgICAgICA8bGk+PGRlbD5BbGljZSBhbmQgQm9iIDxhIGhyZWY9XFxcIiMvY29ubmVjdFxcXCI+Y29ubmVjdDwvYT48L2RlbD48L2xpPlxcbiAgICAgICAgPGxpPjxkZWw+QWxpY2UgYW5kIEJvYiA8YSBocmVmPVxcXCJodHRwczovL2dpdGh1Yi5jb20vY29sZWFsYm9uL3N0cmVhbWxpbmVyXFxcIj5leGNoYW5nZSBrZXlzPC9hPjwvZGVsPzwvbGk+XFxuICAgICAgICA8bGk+QWxpY2UgYW5kIEJvYiBhZ3JlZSBvbiBhIGNlcnRhaW4gXFxcIjxhIGhyZWY9XFxcIiMvZGVja1xcXCI+ZGVjazwvYT5cXFwiIG9mIGNhcmRzLiBJbiBwcmFjdGljZSwgdGhpcyBtZWFucyB0aGV5IGFncmVlIG9uIGEgc2V0IG9mIG51bWJlcnMgb3Igb3RoZXIgZGF0YSBzdWNoIHRoYXQgZWFjaCBlbGVtZW50IG9mIHRoZSBzZXQgcmVwcmVzZW50cyBhIGNhcmQuPC9saT5cXG4gICAgICAgIDxsaT5BbGljZSBwaWNrcyBhbiBlbmNyeXB0aW9uIGtleSBBIGFuZCB1c2VzIHRoaXMgdG8gZW5jcnlwdCBlYWNoIGNhcmQgb2YgdGhlIGRlY2suPC9saT5cXG4gICAgICAgIDxsaT5BbGljZSA8YSBocmVmPVxcXCJodHRwczovL2Jvc3Qub2Nrcy5vcmcvbWlrZS9zaHVmZmxlL1xcXCI+c2h1ZmZsZXM8L2E+IHRoZSBjYXJkcy48L2xpPlxcbiAgICAgICAgPGxpPkFsaWNlIHBhc3NlcyB0aGUgZW5jcnlwdGVkIGFuZCBzaHVmZmxlZCBkZWNrIHRvIEJvYi4gV2l0aCB0aGUgZW5jcnlwdGlvbiBpbiBwbGFjZSwgQm9iIGNhbm5vdCBrbm93IHdoaWNoIGNhcmQgaXMgd2hpY2guPC9saT5cXG4gICAgICAgIDxsaT5Cb2Igc2h1ZmZsZXMgdGhlIGRlY2suPC9saT5cXG4gICAgICAgIDxsaT5Cb2IgcGFzc2VzIHRoZSBkb3VibGUgZW5jcnlwdGVkIGFuZCBzaHVmZmxlZCBkZWNrIGJhY2sgdG8gQWxpY2UuPC9saT5cXG4gICAgICAgIDxsaT5BbGljZSBkZWNyeXB0cyBlYWNoIGNhcmQgdXNpbmcgaGVyIGtleSBBLiBUaGlzIHN0aWxsIGxlYXZlcyBCb2IncyBlbmNyeXB0aW9uIGluIHBsYWNlIHRob3VnaCBzbyBzaGUgY2Fubm90IGtub3cgd2hpY2ggY2FyZCBpcyB3aGljaC48L2xpPlxcbiAgICAgICAgPGxpPkFsaWNlIHBpY2tzIG9uZSBlbmNyeXB0aW9uIGtleSBmb3IgZWFjaCBjYXJkIChBMSwgQTIsIGV0Yy4pIGFuZCBlbmNyeXB0cyB0aGVtIGluZGl2aWR1YWxseS48L2xpPlxcbiAgICAgICAgPGxpPkFsaWNlIHBhc3NlcyB0aGUgZGVjayB0byBCb2IuPC9saT5cXG4gICAgICAgIDxsaT5Cb2IgZGVjcnlwdHMgZWFjaCBjYXJkIHVzaW5nIGhpcyBrZXkgQi4gVGhpcyBzdGlsbCBsZWF2ZXMgQWxpY2UncyBpbmRpdmlkdWFsIGVuY3J5cHRpb24gaW4gcGxhY2UgdGhvdWdoIHNvIGhlIGNhbm5vdCBrbm93IHdoaWNoIGNhcmQgaXMgd2hpY2guPC9saT5cXG4gICAgICAgIDxsaT5Cb2IgcGlja3Mgb25lIGVuY3J5cHRpb24ga2V5IGZvciBlYWNoIGNhcmQgKEIxLCBCMiwgZXRjLikgYW5kIGVuY3J5cHRzIHRoZW0gaW5kaXZpZHVhbGx5LjwvbGk+XFxuICAgICAgICA8bGk+Qm9iIHBhc3NlcyB0aGUgZGVjayBiYWNrIHRvIEFsaWNlLjwvbGk+XFxuICAgICAgICA8bGk+QWxpY2UgcHVibGlzaGVzIHRoZSBkZWNrIGZvciBldmVyeW9uZSBwbGF5aW5nIChpbiB0aGlzIGNhc2Ugb25seSBBbGljZSBhbmQgQm9iLCBzZWUgYmVsb3cgb24gZXhwYW5zaW9uIHRob3VnaCkuPC9saT5cXG4gICAgPC91bD5cXG48L2RldGFpbHM+XFxuPC9zcGFuPlxcblwiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3Jhdy1sb2FkZXIhLi92aWV3cy9wYXJ0aWFscy9yb2FkbWFwLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDI3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=