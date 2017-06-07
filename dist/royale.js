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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNWM1YTIzODYwZjc3OTMxY2RiOTEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9kZXRlcm1pbmVDb250ZW50VHlwZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL2dldEZyb21TdG9yYWdlLmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvZGVjcnlwdFBHUE1lc3NhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9kZWNyeXB0UEdQTWVzc2FnZVdpdGhLZXkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9kZXRlcm1pbmVLZXlUeXBlLmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvZW5jcnlwdENsZWFyVGV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL2VuY3J5cHRDbGVhcnRleHRNdWx0aS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL3NhdmVQR1BQcml2a2V5LmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvc2F2ZVBHUFB1YmtleS5qcyIsIndlYnBhY2s6Ly8vLi9+L2d1bi9ndW4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9yZWJlbC1yb3V0ZXIvc3JjL3JlYmVsLXJvdXRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL2hhbmRsZVBvc3QuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2Nvbm5lY3QuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2NvbnRhY3QuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2RlY2suanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9tZXNzYWdlLmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9yb2FkbWFwLmpzIiwid2VicGFjazovLy8uL34vcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL21vZHVsZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vdmlld3MvcGFydGlhbHMvY29ubmVjdC5odG1sIiwid2VicGFjazovLy8uL3ZpZXdzL3BhcnRpYWxzL2NvbnRhY3QuaHRtbCIsIndlYnBhY2s6Ly8vLi92aWV3cy9wYXJ0aWFscy9mcmVzaGRlY2suaHRtbCIsIndlYnBhY2s6Ly8vLi92aWV3cy9wYXJ0aWFscy9pbmRleC5odG1sIiwid2VicGFjazovLy8uL3ZpZXdzL3BhcnRpYWxzL21lc3NhZ2VfZm9ybS5odG1sIiwid2VicGFjazovLy8uL3ZpZXdzL3BhcnRpYWxzL3JvYWRtYXAuaHRtbCJdLCJuYW1lcyI6WyJkZXRlcm1pbmVDb250ZW50VHlwZSIsImNvbnRlbnQiLCJQcm9taXNlIiwicmVzb2x2ZSIsIm9wZW5wZ3AiLCJyZWplY3QiLCJDTEVBUlRFWFQiLCJQR1BNRVNTQUdFIiwicG9zc2libGVwZ3BrZXkiLCJrZXkiLCJyZWFkQXJtb3JlZCIsImtleXMiLCJ0aGVuIiwia2V5VHlwZSIsIm1lc3NhZ2UiLCJlcnIiLCJnZXRGcm9tU3RvcmFnZSIsImxvY2FsU3RvcmFnZSIsImluZGV4S2V5IiwiaSIsImxlbmd0aCIsImtleUFyciIsInB1c2giLCJnZXRJdGVtIiwiZGVjcnlwdFBHUE1lc3NhZ2UiLCJQR1BQUklWS0VZIiwicGFzc3dvcmQiLCJQR1BNZXNzYWdlQXJtb3IiLCJzdG9yZUFyciIsImZpbHRlciIsInN0b3JhZ2VJdGVtIiwibWFwIiwiY29udGVudFR5cGUiLCJkZWNyeXB0ZWQiLCJkZWNyeXB0UEdQTWVzc2FnZVdpdGhLZXkiLCJFcnJvciIsInByaXZhdGVLZXlBcm1vciIsInBhc3NwaHJhc2UiLCJwcml2S2V5T2JqIiwiZGVjcnlwdCIsInByaW1hcnlLZXkiLCJpc0RlY3J5cHRlZCIsImRlY3J5cHRNZXNzYWdlIiwiY2xlYXJ0ZXh0IiwiY2F0Y2giLCJjb25zb2xlIiwibG9nIiwicmVzdWx0IiwiZGF0YSIsImRldGVybWluZUtleVR5cGUiLCJQR1BQVUJLRVkiLCJwcml2YXRlS2V5cyIsInByaXZhdGVLZXkiLCJ0b1B1YmxpYyIsImFybW9yIiwiZXJyb3IiLCJlbmNyeXB0Q2xlYXJUZXh0IiwicHVibGljS2V5QXJtb3IiLCJQR1BQdWJrZXkiLCJlbmNyeXB0TWVzc2FnZSIsImVuY3J5cHRlZHR4dCIsIm9wdGlvbnMiLCJwdWJsaWNLZXlzIiwiZW5jcnlwdCIsImNpcGhlcnRleHQiLCJlbmNyeXB0Q2xlYXJ0ZXh0TXVsdGkiLCJzdG9yYWdlQXJyIiwiZW5jcnlwdGVkTXNncyIsImlkeCIsImVuY3J5cHRlZCIsInNhdmVQR1BQcml2a2V5IiwiUEdQa2V5QXJtb3IiLCJQR1BrZXkiLCJzZXRJdGVtIiwidXNlcnMiLCJ1c2VySWQiLCJ1c2VyaWQiLCJwcm9jZXNzIiwic2V0SW1tZWRpYXRlIiwic2F2ZVBHUFB1YmtleSIsImV4aXN0aW5nS2V5IiwiZXhpc3RpbmdLZXlUeXBlIiwicm9vdCIsIndpbmRvdyIsImdsb2JhbCIsInJlcXVpcmUiLCJhcmciLCJzbGljZSIsIm1vZCIsInBhdGgiLCJleHBvcnRzIiwic3BsaXQiLCJ0b1N0cmluZyIsInJlcGxhY2UiLCJjb21tb24iLCJtb2R1bGUiLCJUeXBlIiwiZm5zIiwiZm4iLCJpcyIsImJpIiwiYiIsIkJvb2xlYW4iLCJudW0iLCJuIiwibGlzdF9pcyIsInBhcnNlRmxvYXQiLCJJbmZpbml0eSIsInRleHQiLCJ0IiwiaWZ5IiwiSlNPTiIsInN0cmluZ2lmeSIsInJhbmRvbSIsImwiLCJjIiwicyIsImNoYXJBdCIsIk1hdGgiLCJmbG9vciIsIm1hdGNoIiwibyIsInIiLCJvYmoiLCJoYXMiLCJ0b0xvd2VyQ2FzZSIsImxpc3QiLCJtIiwiaW5kZXhPZiIsImZ1enp5IiwiZiIsIkFycmF5Iiwic2xpdCIsInByb3RvdHlwZSIsInNvcnQiLCJrIiwiQSIsIkIiLCJfIiwib2JqX21hcCIsImluZGV4IiwiT2JqZWN0IiwiY29uc3RydWN0b3IiLCJjYWxsIiwicHV0IiwidiIsImhhc093blByb3BlcnR5IiwiZGVsIiwiYXMiLCJ1Iiwib2JqX2lzIiwicGFyc2UiLCJlIiwib2JqX2hhcyIsInRvIiwiZnJvbSIsImNvcHkiLCJlbXB0eSIsImFyZ3VtZW50cyIsIngiLCJsbCIsImxsZSIsImZuX2lzIiwiaWkiLCJ0aW1lIiwiRGF0ZSIsImdldFRpbWUiLCJvbnRvIiwidGFnIiwibmV4dCIsIkZ1bmN0aW9uIiwiYmUiLCJvZmYiLCJ0aGUiLCJsYXN0IiwiYmFjayIsIm9uIiwiT24iLCJDaGFpbiIsImNyZWF0ZSIsIm9wdCIsImlkIiwicmlkIiwidXVpZCIsInN0dW4iLCJjaGFpbiIsImV2Iiwic2tpcCIsImNiIiwicmVzIiwicXVldWUiLCJ0bXAiLCJxIiwiYWN0IiwiYXQiLCJjdHgiLCJhc2siLCJzY29wZSIsImFjayIsInJlcGx5Iiwib25zIiwiZXZlbnQiLCJHdW4iLCJpbnB1dCIsImVtaXQiLCJhcHBseSIsImNvbmNhdCIsImd1biIsInNvdWwiLCJzdGF0ZSIsIndhaXRpbmciLCJ3aGVuIiwic29vbmVzdCIsInNldCIsImZ1dHVyZSIsIm5vdyIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJjaGVjayIsImVhY2giLCJ3YWl0IiwiSEFNIiwibWFjaGluZVN0YXRlIiwiaW5jb21pbmdTdGF0ZSIsImN1cnJlbnRTdGF0ZSIsImluY29taW5nVmFsdWUiLCJjdXJyZW50VmFsdWUiLCJkZWZlciIsImhpc3RvcmljYWwiLCJjb252ZXJnZSIsImluY29taW5nIiwiTGV4aWNhbCIsImN1cnJlbnQiLCJ1bmRlZmluZWQiLCJWYWwiLCJ0ZXh0X2lzIiwiYmlfaXMiLCJudW1faXMiLCJyZWwiLCJyZWxfIiwib2JqX3B1dCIsIk5vZGUiLCJzb3VsXyIsInRleHRfcmFuZG9tIiwibm9kZSIsIm9ial9kZWwiLCJTdGF0ZSIsInBlcmYiLCJzdGFydCIsIk4iLCJkcmlmdCIsIkQiLCJwZXJmb3JtYW5jZSIsInRpbWluZyIsIm5hdmlnYXRpb25TdGFydCIsIk5fIiwib2JqX2FzIiwidmFsIiwib2JqX2NvcHkiLCJHcmFwaCIsImciLCJvYmpfZW1wdHkiLCJuZiIsImVudiIsImdyYXBoIiwic2VlbiIsInZhbGlkIiwicHJldiIsImludmFsaWQiLCJqb2luIiwiYXJyIiwiRHVwIiwiY2FjaGUiLCJ0cmFjayIsImdjIiwiZGUiLCJvbGRlc3QiLCJtYXhBZ2UiLCJtaW4iLCJkb25lIiwiZWxhcHNlZCIsIm5leHRHQyIsInZlcnNpb24iLCJ0b0pTT04iLCJkdXAiLCJzY2hlZHVsZSIsImZpZWxkIiwidmFsdWUiLCJvbmNlIiwiY2F0IiwiY29hdCIsIm9ial90byIsImdldCIsIm1hY2hpbmUiLCJ2ZXJpZnkiLCJtZXJnZSIsImRpZmYiLCJ2ZXJ0ZXgiLCJ3YXMiLCJrbm93biIsInJlZiIsIl9zb3VsIiwiX2ZpZWxkIiwiaG93IiwicGVlcnMiLCJ1cmwiLCJ3c2MiLCJwcm90b2NvbHMiLCJyZWxfaXMiLCJkZWJ1ZyIsInciLCJ5ZXMiLCJvdXRwdXQiLCJzeW50aCIsInByb3h5IiwiY2hhbmdlIiwiZWNobyIsIm5vdCIsInJlbGF0ZSIsIm5vZGVfIiwicmV2ZXJiIiwidmlhIiwidXNlIiwib3V0IiwiY2FwIiwibm9vcCIsImFueSIsImJhdGNoIiwibm8iLCJpaWZlIiwibWV0YSIsIl9fIiwidW5pb24iLCJzdGF0ZV9pcyIsImNzIiwiaXYiLCJjdiIsInZhbF9pcyIsInN0YXRlX2lmeSIsImRlbHRhIiwic3ludGhfIiwibm9kZV9zb3VsIiwibm9kZV9pcyIsIm5vZGVfaWZ5IiwiZWFzIiwic3VicyIsImJpbmQiLCJvayIsImFzeW5jIiwib3VnaHQiLCJuZWVkIiwiaW1wbGVtZW50IiwiZmllbGRzIiwibl8iLCJpdGVtIiwic3RvcmUiLCJyZW1vdmVJdGVtIiwiZGlydHkiLCJjb3VudCIsIm1heCIsInByZWZpeCIsInNhdmUiLCJhbGwiLCJsZXgiLCJXZWJTb2NrZXQiLCJ3ZWJraXRXZWJTb2NrZXQiLCJtb3pXZWJTb2NrZXQiLCJ3c3AiLCJ1ZHJhaW4iLCJzZW5kIiwicGVlciIsIm1zZyIsIndpcmUiLCJvcGVuIiwicmVhZHlTdGF0ZSIsIk9QRU4iLCJyZWNlaXZlIiwiYm9keSIsIm9uY2xvc2UiLCJyZWNvbm5lY3QiLCJvbmVycm9yIiwiY29kZSIsIm9ub3BlbiIsIm9ubWVzc2FnZSIsIlJlYmVsUm91dGVyIiwiX3ByZWZpeCIsInByZXZpb3VzUGF0aCIsImJhc2VQYXRoIiwiZ2V0QXR0cmlidXRlIiwiaW5oZXJpdCIsIiRlbGVtZW50IiwicGFyZW50Tm9kZSIsIm5vZGVOYW1lIiwicm91dGUiLCJyb3V0ZXMiLCIkY2hpbGRyZW4iLCJjaGlsZHJlbiIsIiRjaGlsZCIsIiR0ZW1wbGF0ZSIsImlubmVySFRNTCIsInNoYWRvd1Jvb3QiLCJjcmVhdGVTaGFkb3dSb290IiwiYW5pbWF0aW9uIiwiaW5pdEFuaW1hdGlvbiIsInJlbmRlciIsInBhdGhDaGFuZ2UiLCJpc0JhY2siLCJjbGFzc0xpc3QiLCJhZGQiLCJyZW1vdmUiLCJvYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJtdXRhdGlvbnMiLCJhZGRlZE5vZGVzIiwib3RoZXJDaGlsZHJlbiIsImdldE90aGVyQ2hpbGRyZW4iLCJmb3JFYWNoIiwiY2hpbGQiLCJhbmltYXRpb25FbmQiLCJ0YXJnZXQiLCJjbGFzc05hbWUiLCJyZW1vdmVDaGlsZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJvYnNlcnZlIiwiY2hpbGRMaXN0IiwiZ2V0UGF0aEZyb21VcmwiLCJyZWdleFN0cmluZyIsInJlZ2V4IiwiUmVnRXhwIiwidGVzdCIsIl9yb3V0ZVJlc3VsdCIsImNvbXBvbmVudCIsIiRjb21wb25lbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJwYXJhbXMiLCJzZXRBdHRyaWJ1dGUiLCJhcHBlbmRDaGlsZCIsInRlbXBsYXRlIiwiYSIsInJlc3VsdHMiLCJxdWVyeVN0cmluZyIsInN1YnN0ciIsInBhcnQiLCJlcSIsImRlY29kZVVSSUNvbXBvbmVudCIsInN1YnN0cmluZyIsIkNsYXNzIiwibmFtZSIsInZhbGlkRWxlbWVudFRhZyIsIkhUTUxFbGVtZW50IiwiY2xhc3NUb1RhZyIsImlzUmVnaXN0ZXJlZEVsZW1lbnQiLCJyZWdpc3RlckVsZW1lbnQiLCJjYWxsYmFjayIsImNoYW5nZUNhbGxiYWNrcyIsImNoYW5nZUhhbmRsZXIiLCJsb2NhdGlvbiIsImhyZWYiLCJvbGRVUkwiLCJvbmhhc2hjaGFuZ2UiLCJwYXJzZVF1ZXJ5U3RyaW5nIiwicmUiLCJleGVjIiwicmVzdWx0czIiLCJSZWJlbFJvdXRlIiwiUmViZWxEZWZhdWx0IiwiUmViZWxCYWNrQSIsInByZXZlbnREZWZhdWx0IiwiZGlzcGF0Y2hFdmVudCIsIkN1c3RvbUV2ZW50IiwiaGFzaCIsIkhUTUxBbmNob3JFbGVtZW50IiwiZXh0ZW5kcyIsImdldFBhcmFtc0Zyb21VcmwiLCJoYW5kbGVQb3N0IiwiY29ubmVjdFBhcnRpYWwiLCJDb25uZWN0UGFnZSIsImNvbnRhY3RQYXJ0aWFsIiwiQ29udGFjdFBhZ2UiLCJmcmVzaERlY2tQYXJ0aWFsIiwiRGVja1BhZ2UiLCJjcmVhdGVkQ2FsbGJhY2siLCJxdWVyeVNlbGVjdG9yIiwidGV4dENvbnRlbnQiLCJjbG9uZSIsImltcG9ydE5vZGUiLCJjb2xvck92ZXJyaWRlIiwic3R5bGUiLCJjb2xvciIsImZpbGwiLCJpbmRleFBhcnRpYWwiLCJJbmRleFBhZ2UiLCJjbGllbnRQdWJrZXlGb3JtUGFydGlhbCIsIk1lc3NhZ2VQYWdlIiwicm9hZG1hcFBhcnRpYWwiLCJSb2FkbWFwUGFnZSIsImNhY2hlZFNldFRpbWVvdXQiLCJjYWNoZWRDbGVhclRpbWVvdXQiLCJkZWZhdWx0U2V0VGltb3V0IiwiZGVmYXVsdENsZWFyVGltZW91dCIsInJ1blRpbWVvdXQiLCJmdW4iLCJydW5DbGVhclRpbWVvdXQiLCJtYXJrZXIiLCJkcmFpbmluZyIsImN1cnJlbnRRdWV1ZSIsInF1ZXVlSW5kZXgiLCJjbGVhblVwTmV4dFRpY2siLCJkcmFpblF1ZXVlIiwidGltZW91dCIsImxlbiIsInJ1biIsIm5leHRUaWNrIiwiYXJncyIsIkl0ZW0iLCJhcnJheSIsInRpdGxlIiwiYnJvd3NlciIsImFyZ3YiLCJ2ZXJzaW9ucyIsImFkZExpc3RlbmVyIiwicmVtb3ZlTGlzdGVuZXIiLCJyZW1vdmVBbGxMaXN0ZW5lcnMiLCJwcmVwZW5kTGlzdGVuZXIiLCJwcmVwZW5kT25jZUxpc3RlbmVyIiwibGlzdGVuZXJzIiwiYmluZGluZyIsImN3ZCIsImNoZGlyIiwiZGlyIiwidW1hc2siLCJldmFsIiwid2VicGFja1BvbHlmaWxsIiwiZGVwcmVjYXRlIiwicGF0aHMiLCJkZWZpbmVQcm9wZXJ0eSIsImVudW1lcmFibGUiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUNoRUE7Ozs7O1FBSWdCQSxvQixHQUFBQSxvQjs7QUFGaEI7O0FBRU8sU0FBU0Esb0JBQVQsQ0FBOEJDLE9BQTlCLEVBQXVDO0FBQzFDO0FBQ0EsV0FBUSxDQUFDQSxPQUFGLEdBQ1BDLFFBQVFDLE9BQVIsQ0FBZ0IsRUFBaEIsQ0FETyxHQUVQLFVBQUNDLE9BQUQsRUFBYTtBQUNULGVBQVEsQ0FBQ0EsT0FBRixHQUNQRixRQUFRRyxNQUFSLENBQWUsd0JBQWYsQ0FETyxHQUVQLElBQUlILE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVFLE1BQVYsRUFBcUI7QUFDN0IsZ0JBQU1DLFlBQVksV0FBbEI7QUFDQSxnQkFBTUMsYUFBYSxZQUFuQjtBQUNBLGdC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QUNBeFksT0FBT25GLG9CQUFQO0FBQ0FtRixPQUFPbEMsZ0JBQVA7QUFDQWtDLE9BQU9sQixxQkFBUDtBQUNBa0IsT0FBTzNCLGdCQUFQO0FBQ0EyQixPQUFPM0QsaUJBQVA7QUFDQTJELE9BQU9KLGFBQVA7QUFDQUksT0FBT2IsY0FBUDtBQUNBYSxPQUFPbkUsY0FBUDtBQUNBbUUsT0FBT2pELHdCQUFQOztBQUVBOzs7QUFHQTs7O0FBR0EsMEU7Ozs7OztBQ2hDQSw4Tzs7Ozs7O0FDQUEscWU7Ozs7OztBQ0FBLG0yL0VBQW0yL0Usa0ZBQWtGLHlKQUF5SiwrR0FBK0csK0dBQStHLCtHQUErRywrR0FBK0csK0dBQStHLCtHQUErRywrR0FBK0csK0dBQStHLCtHQUErRyxnSEFBZ0gsK0dBQStHLCtHQUErRywySEFBMkgsOEZBQThGLDhGQUE4Riw4RkFBOEYsOEZBQThGLDhGQUE4Riw4RkFBOEYsOEZBQThGLDhGQUE4Riw4RkFBOEYsK0ZBQStGLDhGQUE4Riw4RkFBOEYsMEhBQTBILDZGQUE2Riw2RkFBNkYsNkZBQTZGLDZGQUE2Riw2RkFBNkYsNkZBQTZGLDZGQUE2Riw2RkFBNkYsNkZBQTZGLDhGQUE4Riw2RkFBNkYsNkZBQTZGLDRIQUE0SCwrRkFBK0YsK0ZBQStGLCtGQUErRiwrRkFBK0YsK0ZBQStGLCtGQUErRiwrRkFBK0YsK0ZBQStGLCtGQUErRixnR0FBZ0csK0ZBQStGLCtGQUErRixvRTs7Ozs7O0FDQS9pcUYsaUM7Ozs7OztBQ0FBLGdIQUFnSCxvRUFBb0UsK0JBQStCLGlDQUFpQyxnQ0FBZ0Msb0dBQW9HLGFBQWEscUJBQXFCLG1DQUFtQyxrREFBa0QsMmhCQUEyaEIseUI7Ozs7OztBQ0ExZ0MseW5FIiwiZmlsZSI6InJveWFsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMjEpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDVjNWEyMzg2MGY3NzkzMWNkYjkxIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2RldGVybWluZUtleVR5cGV9IGZyb20gJy4vZGV0ZXJtaW5lS2V5VHlwZS5qcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXRlcm1pbmVDb250ZW50VHlwZShjb250ZW50KSB7XG4gICAgLy8gdXNhZ2U6IGRldGVybWluZUNvbnRlbnRUeXBlKGNvbnRlbnQpKG9wZW5wZ3ApLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbiAgICByZXR1cm4gKCFjb250ZW50KSA/XG4gICAgUHJvbWlzZS5yZXNvbHZlKCcnKTpcbiAgICAob3BlbnBncCkgPT4ge1xuICAgICAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBvcGVucGdwJyk6XG4gICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IENMRUFSVEVYVCA9ICdjbGVhcnRleHQnO1xuICAgICAgICAgICAgY29uc3QgUEdQTUVTU0FHRSA9ICdQR1BNZXNzYWdlJztcbiAgICAgICAgICAgIGxldCBwb3NzaWJsZXBncGtleSA9IG9wZW5wZ3Aua2V5LnJlYWRBcm1vcmVkKGNvbnRlbnQpO1xuICAgICAgICAgICAgaWYgKHBvc3NpYmxlcGdwa2V5LmtleXNbMF0pIHtcbiAgICAgICAgICAgICAgICBkZXRlcm1pbmVLZXlUeXBlKGNvbnRlbnQpKG9wZW5wZ3ApXG4gICAgICAgICAgICAgICAgLnRoZW4oKGtleVR5cGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShrZXlUeXBlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbnBncC5tZXNzYWdlLnJlYWRBcm1vcmVkKGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKFBHUE1FU1NBR0UpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKENMRUFSVEVYVCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvZGV0ZXJtaW5lQ29udGVudFR5cGUuanMiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRGcm9tU3RvcmFnZShsb2NhbFN0b3JhZ2UpIHtcbiAgICAvLyB1c2FnZTogZ2V0RnJvbVN0b3JhZ2UobG9jYWxTdG9yYWdlKShba2V5XSkudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgIHJldHVybiAoIWxvY2FsU3RvcmFnZSkgP1xuICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBsb2NhbFN0b3JhZ2UnKTpcbiAgICAoaW5kZXhLZXkpID0+IHtcbiAgICAgICAgcmV0dXJuICghaW5kZXhLZXkpID9cbiAgICAgICAgLy8gbm8gaW5kZXggLT4gcmV0dXJuIGV2ZXJ5dGhpbmdcbiAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsZXQgaSA9IGxvY2FsU3RvcmFnZS5sZW5ndGhcbiAgICAgICAgICAgICAgICBsZXQga2V5QXJyID0gW11cbiAgICAgICAgICAgICAgICB3aGlsZSAoaSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGkgPSBpIC0gMVxuICAgICAgICAgICAgICAgICAgICBrZXlBcnIucHVzaChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShsb2NhbFN0b3JhZ2Uua2V5KGkpKSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoa2V5QXJyKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pOlxuICAgICAgICAvLyBpbmRleCBwcm92aWRlZCAtPiByZXR1cm4gb25lXG4gICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShpbmRleEtleSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGliL2dldEZyb21TdG9yYWdlLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2dldEZyb21TdG9yYWdlfSBmcm9tICcuL2dldEZyb21TdG9yYWdlJztcbmltcG9ydCB7ZGVjcnlwdFBHUE1lc3NhZ2VXaXRoS2V5fSBmcm9tICcuLi8uLi9zcmMvbGliL2RlY3J5cHRQR1BNZXNzYWdlV2l0aEtleS5qcyc7XG5pbXBvcnQge2RldGVybWluZUNvbnRlbnRUeXBlfSBmcm9tICcuLi8uLi9zcmMvbGliL2RldGVybWluZUNvbnRlbnRUeXBlLmpzJztcblxuY29uc3QgUEdQUFJJVktFWSA9ICdQR1BQcml2a2V5JztcblxuZXhwb3J0IGZ1bmN0aW9uIGRlY3J5cHRQR1BNZXNzYWdlKG9wZW5wZ3ApIHtcbiAgICAvLyAgdXNhZ2U6IGRlY3J5cHRQR1BNZXNzYWdlKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSkocGFzc3dvcmQpKFBHUE1lc3NhZ2VBcm1vcikudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgIHJldHVybiAoIW9wZW5wZ3ApID9cbiAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgIChsb2NhbFN0b3JhZ2UpID0+IHtcbiAgICAgICAgcmV0dXJuICghbG9jYWxTdG9yYWdlKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBsb2NhbFN0b3JhZ2UnKTpcbiAgICAgICAgKHBhc3N3b3JkKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCFwYXNzd29yZCkgP1xuICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QoXCJFcnJvcjogbWlzc2luZyBwYXNzd29yZFwiKTpcbiAgICAgICAgICAgIChQR1BNZXNzYWdlQXJtb3IpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKCFQR1BNZXNzYWdlQXJtb3IpID9cbiAgICAgICAgICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgUEdQTWVzc2FnZUFybW9yJyk6XG4gICAgICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBnZXRGcm9tU3RvcmFnZShsb2NhbFN0b3JhZ2UpKClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oc3RvcmVBcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RvcmVBcnJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKHN0b3JhZ2VJdGVtID0+ICghc3RvcmFnZUl0ZW0pID8gZmFsc2UgOiB0cnVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoc3RvcmFnZUl0ZW0gPT4gZGV0ZXJtaW5lQ29udGVudFR5cGUoc3RvcmFnZUl0ZW0pKG9wZW5wZ3ApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGNvbnRlbnRUeXBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50VHlwZSA9PT0gUEdQUFJJVktFWSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlY3J5cHRQR1BNZXNzYWdlV2l0aEtleShvcGVucGdwKShwYXNzd29yZCkoc3RvcmFnZUl0ZW0pKFBHUE1lc3NhZ2VBcm1vcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihkZWNyeXB0ZWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRlY3J5cHRlZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGliL2RlY3J5cHRQR1BNZXNzYWdlLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgZnVuY3Rpb24gZGVjcnlwdFBHUE1lc3NhZ2VXaXRoS2V5KG9wZW5wZ3ApIHtcbiAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdtaXNzaW5nIG9wZW5wZ3AnKSk6XG4gICAgKHBhc3N3b3JkKSA9PiB7XG4gICAgICAgIHJldHVybiAoIXBhc3N3b3JkKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignbWlzc2luZyBwYXNzd29yZCcpKTpcbiAgICAgICAgKHByaXZhdGVLZXlBcm1vcikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICghcHJpdmF0ZUtleUFybW9yKSA/XG4gICAgICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ21pc3NpbmcgcHJpdmF0ZUtleUFybW9yJykpOlxuICAgICAgICAgICAgKFBHUE1lc3NhZ2VBcm1vcikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAoIVBHUE1lc3NhZ2VBcm1vcikgP1xuICAgICAgICAgICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignbWlzc2luZyBQR1BNZXNzYWdlQXJtb3InKSk6XG4gICAgICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhc3NwaHJhc2UgPSBgJHtwYXNzd29yZH1gOyAvL3doYXQgdGhlIHByaXZLZXkgaXMgZW5jcnlwdGVkIHdpdGhcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcml2S2V5T2JqID0gb3BlbnBncC5rZXkucmVhZEFybW9yZWQoYCR7cHJpdmF0ZUtleUFybW9yfWApLmtleXNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBwcml2S2V5T2JqLmRlY3J5cHQocGFzc3BocmFzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gb3BlbnBncC5tZXNzYWdlLnJlYWRBcm1vcmVkKFBHUE1lc3NhZ2VBcm1vcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXByaXZLZXlPYmoucHJpbWFyeUtleS5pc0RlY3J5cHRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdQcml2YXRlIGtleSBpcyBub3QgZGVjcnlwdGVkJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW9wZW5wZ3AuZGVjcnlwdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVucGdwLmRlY3J5cHRNZXNzYWdlKHByaXZLZXlPYmosIG1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGNsZWFydGV4dCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNsZWFydGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiByZWplY3QoZXJyKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVucGdwLmRlY3J5cHQoeyAnbWVzc2FnZSc6IG1lc3NhZ2UsICdwcml2YXRlS2V5JzogcHJpdktleU9iaiB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0LmRhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdC5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3Jlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdiYWQgcHJpdmF0ZUtleUFybW9yJykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvZGVjcnlwdFBHUE1lc3NhZ2VXaXRoS2V5LmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgZnVuY3Rpb24gZGV0ZXJtaW5lS2V5VHlwZShjb250ZW50KSB7XG4gICAgcmV0dXJuICghY29udGVudCkgP1xuICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBwZ3BLZXknKTpcbiAgICAob3BlbnBncCkgPT4ge1xuICAgICAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBvcGVucGdwJyk6XG4gICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IFBHUFBVQktFWSA9ICdQR1BQdWJrZXknO1xuICAgICAgICAgICAgY29uc3QgUEdQUFJJVktFWSA9ICdQR1BQcml2a2V5JztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbGV0IHByaXZhdGVLZXlzID0gb3BlbnBncC5rZXkucmVhZEFybW9yZWQoY29udGVudClcbiAgICAgICAgICAgICAgICBsZXQgcHJpdmF0ZUtleSA9IHByaXZhdGVLZXlzLmtleXNbMF1cbiAgICAgICAgICAgICAgICBpZiAocHJpdmF0ZUtleS50b1B1YmxpYygpLmFybW9yKCkgIT09IHByaXZhdGVLZXkuYXJtb3IoKSApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShQR1BQUklWS0VZKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKFBHUFBVQktFWSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvZGV0ZXJtaW5lS2V5VHlwZS5qcyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGZ1bmN0aW9uIGVuY3J5cHRDbGVhclRleHQob3BlbnBncCkge1xuICAgIC8vIHVzYWdlOiBlbmNyeXB0Q2xlYXJUZXh0KG9wZW5wZ3ApKHB1YmxpY0tleUFybW9yKShjbGVhcnRleHQpLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbiAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIG9wZW5wZ3AnKTpcbiAgICAocHVibGljS2V5QXJtb3IpID0+IHtcbiAgICAgICAgcmV0dXJuICghcHVibGljS2V5QXJtb3IpID9cbiAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIHB1YmxpYyBrZXknKTpcbiAgICAgICAgKGNsZWFydGV4dCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICghY2xlYXJ0ZXh0KSA/XG4gICAgICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgY2xlYXJ0ZXh0Jyk6XG4gICAgICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IFBHUFB1YmtleSA9IG9wZW5wZ3Aua2V5LnJlYWRBcm1vcmVkKHB1YmxpY0tleUFybW9yKVxuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgdGhlIGxhdGVzdCBvcGVucGdwIDIuNS40IGJyZWFrcyBvbiBvdXIgY29uc29sZSBvbmx5IHRvb2xzLlxuICAgICAgICAgICAgICAgIGJ1dCBpdCdzIDEweCBmYXN0ZXIgb24gYnJvd3NlcnMgc28gVEhFIE5FVyBDT0RFIFNUQVlTIElOLlxuICAgICAgICAgICAgICAgIGJlbG93IHdlIGV4cGxvaXQgZmFsbGJhY2sgdG8gb2xkIHNsb3cgZXJyb3IgZnJlZSBvcGVucGdwIDEuNi4yXG4gICAgICAgICAgICAgICAgYnkgYWRhcHRpbmcgb24gdGhlIGZseSB0byBhIGJyZWFraW5nIGNoYW5nZVxuICAgICAgICAgICAgICAgIChvcGVucGdwIGJ1ZyBeMS42LjIgLT4gMi41LjQgbWFkZSB1cyBkbyBpdClcbiAgICAgICAgICAgICAgICByZWZhY3RvcjogcmVtb3ZlIHRyeSBzZWN0aW9uIG9mIHRyeWNhdGNoIGtlZXAgY2F0Y2ggc2VjdGlvblxuICAgICAgICAgICAgICAgIGJ5IGFsbCBtZWFucyByZWZhY3RvciBpZiBub3QgYnJva2VuIGFmdGVyIG9wZW5wZ3AgMi41LjRcbiAgICAgICAgICAgICAgICBpZiB5b3UgY2hlY2sgb3BlbnBncCBwbGVhc2UgYnVtcCBmYWlsaW5nIHZlcnNpb24gIF5eXl5eXG4gICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAvLyB3b3JrcyBvbmx5IG9uIG9wZW5wZ3AgdmVyc2lvbiAxLjYuMlxuICAgICAgICAgICAgICAgICAgICBvcGVucGdwLmVuY3J5cHRNZXNzYWdlKFBHUFB1YmtleS5rZXlzWzBdLCBjbGVhcnRleHQpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGVuY3J5cHRlZHR4dCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGVuY3J5cHRlZHR4dClcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKClcbiAgICAgICAgICAgICAgICB9IGNhdGNoKGVycikge1xuICAgICAgICAgICAgICAgICAgICAvLyB3b3JrcyBvbiBvcGVucGdwIHZlcnNpb24gMi41LjRcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBjbGVhcnRleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwdWJsaWNLZXlzOiBvcGVucGdwLmtleS5yZWFkQXJtb3JlZChwdWJsaWNLZXlBcm1vcikua2V5cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFybW9yOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIG9wZW5wZ3AuZW5jcnlwdChvcHRpb25zKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoY2lwaGVydGV4dCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjaXBoZXJ0ZXh0LmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xpYi9lbmNyeXB0Q2xlYXJUZXh0LmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2dldEZyb21TdG9yYWdlfSBmcm9tICcuL2dldEZyb21TdG9yYWdlJztcbmltcG9ydCB7ZGV0ZXJtaW5lQ29udGVudFR5cGV9IGZyb20gJy4vZGV0ZXJtaW5lQ29udGVudFR5cGUnO1xuaW1wb3J0IHtlbmNyeXB0Q2xlYXJUZXh0fSBmcm9tICcuL2VuY3J5cHRDbGVhclRleHQnO1xuXG5jb25zdCBQR1BQVUJLRVkgPSAnUEdQUHVia2V5JztcblxuZXhwb3J0IGZ1bmN0aW9uIGVuY3J5cHRDbGVhcnRleHRNdWx0aShjb250ZW50KSB7XG4gICAgLy8gdXNhZ2U6IGVuY3J5cHRDbGVhcnRleHRNdWx0aShjb250ZW50KShvcGVucGdwKShsb2NhbFN0b3JhZ2UpLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbiAgICByZXR1cm4gKCFjb250ZW50KSA/XG4gICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIGNvbnRlbnQnKTpcbiAgICAob3BlbnBncCkgPT4ge1xuICAgICAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBvcGVucGdwJyk6XG4gICAgICAgIChsb2NhbFN0b3JhZ2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoIWxvY2FsU3RvcmFnZSkgP1xuICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIGxvY2FsU3RvcmFnZScpOlxuICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGdldEZyb21TdG9yYWdlKGxvY2FsU3RvcmFnZSkoKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoc3RvcmFnZUFycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9sZXQgcHVibGljS2V5QXJyID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZW5jcnlwdGVkTXNncyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGkgPSBzdG9yYWdlQXJyLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpZHggPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmFnZUFyclxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgoc3RvcmFnZUl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0b3JhZ2VJdGVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoc3RvcmFnZUl0ZW0gPT4gKCFzdG9yYWdlSXRlbSkgPyBmYWxzZSA6IHRydWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKChzdG9yYWdlSXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldGVybWluZUNvbnRlbnRUeXBlKHN0b3JhZ2VJdGVtKShvcGVucGdwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChjb250ZW50VHlwZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudFR5cGUgPT09IFBHUFBVQktFWSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5jcnlwdENsZWFyVGV4dChvcGVucGdwKShzdG9yYWdlSXRlbSkoY29udGVudClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChlbmNyeXB0ZWQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmNyeXB0ZWRNc2dzW2lkeF0gPSBlbmNyeXB0ZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWR4Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShlbmNyeXB0ZWRNc2dzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCAobmV3IEVycm9yIChlcnIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xpYi9lbmNyeXB0Q2xlYXJ0ZXh0TXVsdGkuanMiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlUEdQUHJpdmtleShQR1BrZXlBcm1vcikge1xuICAgIC8vIHNhdmUgcHJpdmF0ZSBrZXkgdG8gc3RvcmFnZSBubyBxdWVzdGlvbnMgYXNrZWRcbiAgICAvLyB1c2FnZTogc2F2ZVBHUFByaXZrZXkoY29udGVudCkob3BlbnBncCkobG9jYWxTdG9yYWdlKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpXG4gICAgcmV0dXJuICghUEdQa2V5QXJtb3IpID9cbiAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgUEdQa2V5QXJtb3InKTpcbiAgICAob3BlbnBncCkgPT4ge1xuICAgICAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBvcGVucGdwJyk6XG4gICAgICAgIChsb2NhbFN0b3JhZ2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoIWxvY2FsU3RvcmFnZSkgP1xuICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIGxvY2FsU3RvcmFnZScpOlxuICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBQR1BrZXkgPSBvcGVucGdwLmtleS5yZWFkQXJtb3JlZChQR1BrZXlBcm1vcik7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFBHUGtleS5rZXlzWzBdLnVzZXJzWzBdLnVzZXJJZC51c2VyaWQsIFBHUGtleUFybW9yKVxuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLnNldEltbWVkaWF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYHByaXZhdGUgcGdwIGtleSBzYXZlZCA8LSAke1BHUGtleS5rZXlzWzBdLnVzZXJzWzBdLnVzZXJJZC51c2VyaWR9YClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGliL3NhdmVQR1BQcml2a2V5LmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2dldEZyb21TdG9yYWdlfSBmcm9tICcuL2dldEZyb21TdG9yYWdlJztcbmltcG9ydCB7ZGV0ZXJtaW5lQ29udGVudFR5cGV9IGZyb20gJy4vZGV0ZXJtaW5lQ29udGVudFR5cGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZVBHUFB1YmtleShQR1BrZXlBcm1vcikge1xuICAgIC8vIHNhdmUgcHVibGljIGtleSB0byBzdG9yYWdlIG9ubHkgaWYgaXQgZG9lc24ndCBvdmVyd3JpdGUgYSBwcml2YXRlIGtleVxuICAgIC8vIHVzYWdlOiBzYXZlUEdQUHVia2V5KGNvbnRlbnQpKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSkudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgIHJldHVybiAoIVBHUGtleUFybW9yKSA/XG4gICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIFBHUGtleUFybW9yJyk6XG4gICAgKG9wZW5wZ3ApID0+IHtcbiAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgICAgICAobG9jYWxTdG9yYWdlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCFsb2NhbFN0b3JhZ2UpID9cbiAgICAgICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBsb2NhbFN0b3JhZ2UnKTpcbiAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgUEdQa2V5ID0gb3BlbnBncC5rZXkucmVhZEFybW9yZWQoUEdQa2V5QXJtb3IpO1xuICAgICAgICAgICAgICAgIGdldEZyb21TdG9yYWdlKGxvY2FsU3RvcmFnZSkoUEdQa2V5LmtleXNbMF0udXNlcnNbMF0udXNlcklkLnVzZXJpZClcbiAgICAgICAgICAgICAgICAudGhlbihleGlzdGluZ0tleSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoIWV4aXN0aW5nS2V5KSA/XG4gICAgICAgICAgICAgICAgICAgIFByb21pc2UucmVzb2x2ZSgnbm9uZScpIDpcbiAgICAgICAgICAgICAgICAgICAgZGV0ZXJtaW5lQ29udGVudFR5cGUoZXhpc3RpbmdLZXkpKG9wZW5wZ3ApO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZXhpc3RpbmdLZXlUeXBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0aW5nS2V5VHlwZSA9PT0gJ1BHUFByaXZrZXknKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoJ3B1YmtleSBpZ25vcmVkIFgtIGF0dGVtcHRlZCBvdmVyd3JpdGUgcHJpdmtleScpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShQR1BrZXkua2V5c1swXS51c2Vyc1swXS51c2VySWQudXNlcmlkLCBQR1BrZXlBcm1vcilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYHB1YmxpYyBwZ3Aga2V5IHNhdmVkIDwtICR7UEdQa2V5LmtleXNbMF0udXNlcnNbMF0udXNlcklkLnVzZXJpZH1gKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gcmVqZWN0KGVycikpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xpYi9zYXZlUEdQUHVia2V5LmpzIiwiOyhmdW5jdGlvbigpe1xyXG5cclxuXHQvKiBVTkJVSUxEICovXHJcblx0dmFyIHJvb3Q7XHJcblx0aWYodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIil7IHJvb3QgPSB3aW5kb3cgfVxyXG5cdGlmKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIpeyByb290ID0gZ2xvYmFsIH1cclxuXHRyb290ID0gcm9vdCB8fCB7fTtcclxuXHR2YXIgY29uc29sZSA9IHJvb3QuY29uc29sZSB8fCB7bG9nOiBmdW5jdGlvbigpe319O1xyXG5cdGZ1bmN0aW9uIHJlcXVpcmUoYXJnKXtcclxuXHRcdHJldHVybiBhcmcuc2xpY2U/IHJlcXVpcmVbcmVzb2x2ZShhcmcpXSA6IGZ1bmN0aW9uKG1vZCwgcGF0aCl7XHJcblx0XHRcdGFyZyhtb2QgPSB7ZXhwb3J0czoge319KTtcclxuXHRcdFx0cmVxdWlyZVtyZXNvbHZlKHBhdGgpXSA9IG1vZC5leHBvcnRzO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gcmVzb2x2ZShwYXRoKXtcclxuXHRcdFx0cmV0dXJuIHBhdGguc3BsaXQoJy8nKS5zbGljZSgtMSkudG9TdHJpbmcoKS5yZXBsYWNlKCcuanMnLCcnKTtcclxuXHRcdH1cclxuXHR9XHJcblx0aWYodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIil7IHZhciBjb21tb24gPSBtb2R1bGUgfVxyXG5cdC8qIFVOQlVJTEQgKi9cclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdC8vIEdlbmVyaWMgamF2YXNjcmlwdCB1dGlsaXRpZXMuXHJcblx0XHR2YXIgVHlwZSA9IHt9O1xyXG5cdFx0Ly9UeXBlLmZucyA9IFR5cGUuZm4gPSB7aXM6IGZ1bmN0aW9uKGZuKXsgcmV0dXJuICghIWZuICYmIGZuIGluc3RhbmNlb2YgRnVuY3Rpb24pIH19XHJcblx0XHRUeXBlLmZucyA9IFR5cGUuZm4gPSB7aXM6IGZ1bmN0aW9uKGZuKXsgcmV0dXJuICghIWZuICYmICdmdW5jdGlvbicgPT0gdHlwZW9mIGZuKSB9fVxyXG5cdFx0VHlwZS5iaSA9IHtpczogZnVuY3Rpb24oYil7IHJldHVybiAoYiBpbnN0YW5jZW9mIEJvb2xlYW4gfHwgdHlwZW9mIGIgPT0gJ2Jvb2xlYW4nKSB9fVxyXG5cdFx0VHlwZS5udW0gPSB7aXM6IGZ1bmN0aW9uKG4peyByZXR1cm4gIWxpc3RfaXMobikgJiYgKChuIC0gcGFyc2VGbG9hdChuKSArIDEpID49IDAgfHwgSW5maW5pdHkgPT09IG4gfHwgLUluZmluaXR5ID09PSBuKSB9fVxyXG5cdFx0VHlwZS50ZXh0ID0ge2lzOiBmdW5jdGlvbih0KXsgcmV0dXJuICh0eXBlb2YgdCA9PSAnc3RyaW5nJykgfX1cclxuXHRcdFR5cGUudGV4dC5pZnkgPSBmdW5jdGlvbih0KXtcclxuXHRcdFx0aWYoVHlwZS50ZXh0LmlzKHQpKXsgcmV0dXJuIHQgfVxyXG5cdFx0XHRpZih0eXBlb2YgSlNPTiAhPT0gXCJ1bmRlZmluZWRcIil7IHJldHVybiBKU09OLnN0cmluZ2lmeSh0KSB9XHJcblx0XHRcdHJldHVybiAodCAmJiB0LnRvU3RyaW5nKT8gdC50b1N0cmluZygpIDogdDtcclxuXHRcdH1cclxuXHRcdFR5cGUudGV4dC5yYW5kb20gPSBmdW5jdGlvbihsLCBjKXtcclxuXHRcdFx0dmFyIHMgPSAnJztcclxuXHRcdFx0bCA9IGwgfHwgMjQ7IC8vIHlvdSBhcmUgbm90IGdvaW5nIHRvIG1ha2UgYSAwIGxlbmd0aCByYW5kb20gbnVtYmVyLCBzbyBubyBuZWVkIHRvIGNoZWNrIHR5cGVcclxuXHRcdFx0YyA9IGMgfHwgJzAxMjM0NTY3ODlBQkNERUZHSElKS0xNTk9QUVJTVFVWV1haYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonO1xyXG5cdFx0XHR3aGlsZShsID4gMCl7IHMgKz0gYy5jaGFyQXQoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYy5sZW5ndGgpKTsgbC0tIH1cclxuXHRcdFx0cmV0dXJuIHM7XHJcblx0XHR9XHJcblx0XHRUeXBlLnRleHQubWF0Y2ggPSBmdW5jdGlvbih0LCBvKXsgdmFyIHIgPSBmYWxzZTtcclxuXHRcdFx0dCA9IHQgfHwgJyc7XHJcblx0XHRcdG8gPSBUeXBlLnRleHQuaXMobyk/IHsnPSc6IG99IDogbyB8fCB7fTsgLy8geyd+JywgJz0nLCAnKicsICc8JywgJz4nLCAnKycsICctJywgJz8nLCAnISd9IC8vIGlnbm9yZSBjYXNlLCBleGFjdGx5IGVxdWFsLCBhbnl0aGluZyBhZnRlciwgbGV4aWNhbGx5IGxhcmdlciwgbGV4aWNhbGx5IGxlc3NlciwgYWRkZWQgaW4sIHN1YnRhY3RlZCBmcm9tLCBxdWVzdGlvbmFibGUgZnV6enkgbWF0Y2gsIGFuZCBlbmRzIHdpdGguXHJcblx0XHRcdGlmKFR5cGUub2JqLmhhcyhvLCd+JykpeyB0ID0gdC50b0xvd2VyQ2FzZSgpOyBvWyc9J10gPSAob1snPSddIHx8IG9bJ34nXSkudG9Mb3dlckNhc2UoKSB9XHJcblx0XHRcdGlmKFR5cGUub2JqLmhhcyhvLCc9JykpeyByZXR1cm4gdCA9PT0gb1snPSddIH1cclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJyonKSl7IGlmKHQuc2xpY2UoMCwgb1snKiddLmxlbmd0aCkgPT09IG9bJyonXSl7IHIgPSB0cnVlOyB0ID0gdC5zbGljZShvWycqJ10ubGVuZ3RoKSB9IGVsc2UgeyByZXR1cm4gZmFsc2UgfX1cclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJyEnKSl7IGlmKHQuc2xpY2UoLW9bJyEnXS5sZW5ndGgpID09PSBvWychJ10peyByID0gdHJ1ZSB9IGVsc2UgeyByZXR1cm4gZmFsc2UgfX1cclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJysnKSl7XHJcblx0XHRcdFx0aWYoVHlwZS5saXN0Lm1hcChUeXBlLmxpc3QuaXMob1snKyddKT8gb1snKyddIDogW29bJysnXV0sIGZ1bmN0aW9uKG0pe1xyXG5cdFx0XHRcdFx0aWYodC5pbmRleE9mKG0pID49IDApeyByID0gdHJ1ZSB9IGVsc2UgeyByZXR1cm4gdHJ1ZSB9XHJcblx0XHRcdFx0fSkpeyByZXR1cm4gZmFsc2UgfVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKFR5cGUub2JqLmhhcyhvLCctJykpe1xyXG5cdFx0XHRcdGlmKFR5cGUubGlzdC5tYXAoVHlwZS5saXN0LmlzKG9bJy0nXSk/IG9bJy0nXSA6IFtvWyctJ11dLCBmdW5jdGlvbihtKXtcclxuXHRcdFx0XHRcdGlmKHQuaW5kZXhPZihtKSA8IDApeyByID0gdHJ1ZSB9IGVsc2UgeyByZXR1cm4gdHJ1ZSB9XHJcblx0XHRcdFx0fSkpeyByZXR1cm4gZmFsc2UgfVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKFR5cGUub2JqLmhhcyhvLCc+JykpeyBpZih0ID4gb1snPiddKXsgciA9IHRydWUgfSBlbHNlIHsgcmV0dXJuIGZhbHNlIH19XHJcblx0XHRcdGlmKFR5cGUub2JqLmhhcyhvLCc8JykpeyBpZih0IDwgb1snPCddKXsgciA9IHRydWUgfSBlbHNlIHsgcmV0dXJuIGZhbHNlIH19XHJcblx0XHRcdGZ1bmN0aW9uIGZ1enp5KHQsZil7IHZhciBuID0gLTEsIGkgPSAwLCBjOyBmb3IoO2MgPSBmW2krK107KXsgaWYoIX4obiA9IHQuaW5kZXhPZihjLCBuKzEpKSl7IHJldHVybiBmYWxzZSB9fSByZXR1cm4gdHJ1ZSB9IC8vIHZpYSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzkyMDYwMTMvamF2YXNjcmlwdC1mdXp6eS1zZWFyY2hcclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJz8nKSl7IGlmKGZ1enp5KHQsIG9bJz8nXSkpeyByID0gdHJ1ZSB9IGVsc2UgeyByZXR1cm4gZmFsc2UgfX0gLy8gY2hhbmdlIG5hbWUhXHJcblx0XHRcdHJldHVybiByO1xyXG5cdFx0fVxyXG5cdFx0VHlwZS5saXN0ID0ge2lzOiBmdW5jdGlvbihsKXsgcmV0dXJuIChsIGluc3RhbmNlb2YgQXJyYXkpIH19XHJcblx0XHRUeXBlLmxpc3Quc2xpdCA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcclxuXHRcdFR5cGUubGlzdC5zb3J0ID0gZnVuY3Rpb24oayl7IC8vIGNyZWF0ZXMgYSBuZXcgc29ydCBmdW5jdGlvbiBiYXNlZCBvZmYgc29tZSBmaWVsZFxyXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oQSxCKXtcclxuXHRcdFx0XHRpZighQSB8fCAhQil7IHJldHVybiAwIH0gQSA9IEFba107IEIgPSBCW2tdO1xyXG5cdFx0XHRcdGlmKEEgPCBCKXsgcmV0dXJuIC0xIH1lbHNlIGlmKEEgPiBCKXsgcmV0dXJuIDEgfVxyXG5cdFx0XHRcdGVsc2UgeyByZXR1cm4gMCB9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFR5cGUubGlzdC5tYXAgPSBmdW5jdGlvbihsLCBjLCBfKXsgcmV0dXJuIG9ial9tYXAobCwgYywgXykgfVxyXG5cdFx0VHlwZS5saXN0LmluZGV4ID0gMTsgLy8gY2hhbmdlIHRoaXMgdG8gMCBpZiB5b3Ugd2FudCBub24tbG9naWNhbCwgbm9uLW1hdGhlbWF0aWNhbCwgbm9uLW1hdHJpeCwgbm9uLWNvbnZlbmllbnQgYXJyYXkgbm90YXRpb25cclxuXHRcdFR5cGUub2JqID0ge2lzOiBmdW5jdGlvbihvKXsgcmV0dXJuIG8/IChvIGluc3RhbmNlb2YgT2JqZWN0ICYmIG8uY29uc3RydWN0b3IgPT09IE9iamVjdCkgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLm1hdGNoKC9eXFxbb2JqZWN0IChcXHcrKVxcXSQvKVsxXSA9PT0gJ09iamVjdCcgOiBmYWxzZSB9fVxyXG5cdFx0VHlwZS5vYmoucHV0ID0gZnVuY3Rpb24obywgZiwgdil7IHJldHVybiAob3x8e30pW2ZdID0gdiwgbyB9XHJcblx0XHRUeXBlLm9iai5oYXMgPSBmdW5jdGlvbihvLCBmKXsgcmV0dXJuIG8gJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIGYpIH1cclxuXHRcdFR5cGUub2JqLmRlbCA9IGZ1bmN0aW9uKG8sIGspe1xyXG5cdFx0XHRpZighbyl7IHJldHVybiB9XHJcblx0XHRcdG9ba10gPSBudWxsO1xyXG5cdFx0XHRkZWxldGUgb1trXTtcclxuXHRcdFx0cmV0dXJuIG87XHJcblx0XHR9XHJcblx0XHRUeXBlLm9iai5hcyA9IGZ1bmN0aW9uKG8sIGYsIHYsIHUpeyByZXR1cm4gb1tmXSA9IG9bZl0gfHwgKHUgPT09IHY/IHt9IDogdikgfVxyXG5cdFx0VHlwZS5vYmouaWZ5ID0gZnVuY3Rpb24obyl7XHJcblx0XHRcdGlmKG9ial9pcyhvKSl7IHJldHVybiBvIH1cclxuXHRcdFx0dHJ5e28gPSBKU09OLnBhcnNlKG8pO1xyXG5cdFx0XHR9Y2F0Y2goZSl7bz17fX07XHJcblx0XHRcdHJldHVybiBvO1xyXG5cdFx0fVxyXG5cdFx0OyhmdW5jdGlvbigpeyB2YXIgdTtcclxuXHRcdFx0ZnVuY3Rpb24gbWFwKHYsZil7XHJcblx0XHRcdFx0aWYob2JqX2hhcyh0aGlzLGYpICYmIHUgIT09IHRoaXNbZl0peyByZXR1cm4gfVxyXG5cdFx0XHRcdHRoaXNbZl0gPSB2O1xyXG5cdFx0XHR9XHJcblx0XHRcdFR5cGUub2JqLnRvID0gZnVuY3Rpb24oZnJvbSwgdG8pe1xyXG5cdFx0XHRcdHRvID0gdG8gfHwge307XHJcblx0XHRcdFx0b2JqX21hcChmcm9tLCBtYXAsIHRvKTtcclxuXHRcdFx0XHRyZXR1cm4gdG87XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblx0XHRUeXBlLm9iai5jb3B5ID0gZnVuY3Rpb24obyl7IC8vIGJlY2F1c2UgaHR0cDovL3dlYi5hcmNoaXZlLm9yZy93ZWIvMjAxNDAzMjgyMjQwMjUvaHR0cDovL2pzcGVyZi5jb20vY2xvbmluZy1hbi1vYmplY3QvMlxyXG5cdFx0XHRyZXR1cm4gIW8/IG8gOiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG8pKTsgLy8gaXMgc2hvY2tpbmdseSBmYXN0ZXIgdGhhbiBhbnl0aGluZyBlbHNlLCBhbmQgb3VyIGRhdGEgaGFzIHRvIGJlIGEgc3Vic2V0IG9mIEpTT04gYW55d2F5cyFcclxuXHRcdH1cclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0ZnVuY3Rpb24gZW1wdHkodixpKXsgdmFyIG4gPSB0aGlzLm47XHJcblx0XHRcdFx0aWYobiAmJiAoaSA9PT0gbiB8fCAob2JqX2lzKG4pICYmIG9ial9oYXMobiwgaSkpKSl7IHJldHVybiB9XHJcblx0XHRcdFx0aWYoaSl7IHJldHVybiB0cnVlIH1cclxuXHRcdFx0fVxyXG5cdFx0XHRUeXBlLm9iai5lbXB0eSA9IGZ1bmN0aW9uKG8sIG4pe1xyXG5cdFx0XHRcdGlmKCFvKXsgcmV0dXJuIHRydWUgfVxyXG5cdFx0XHRcdHJldHVybiBvYmpfbWFwKG8sZW1wdHkse246bn0pPyBmYWxzZSA6IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdGZ1bmN0aW9uIHQoayx2KXtcclxuXHRcdFx0XHRpZigyID09PSBhcmd1bWVudHMubGVuZ3RoKXtcclxuXHRcdFx0XHRcdHQuciA9IHQuciB8fCB7fTtcclxuXHRcdFx0XHRcdHQucltrXSA9IHY7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fSB0LnIgPSB0LnIgfHwgW107XHJcblx0XHRcdFx0dC5yLnB1c2goayk7XHJcblx0XHRcdH07XHJcblx0XHRcdHZhciBrZXlzID0gT2JqZWN0LmtleXM7XHJcblx0XHRcdFR5cGUub2JqLm1hcCA9IGZ1bmN0aW9uKGwsIGMsIF8pe1xyXG5cdFx0XHRcdHZhciB1LCBpID0gMCwgeCwgciwgbGwsIGxsZSwgZiA9IGZuX2lzKGMpO1xyXG5cdFx0XHRcdHQuciA9IG51bGw7XHJcblx0XHRcdFx0aWYoa2V5cyAmJiBvYmpfaXMobCkpe1xyXG5cdFx0XHRcdFx0bGwgPSBPYmplY3Qua2V5cyhsKTsgbGxlID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYobGlzdF9pcyhsKSB8fCBsbCl7XHJcblx0XHRcdFx0XHR4ID0gKGxsIHx8IGwpLmxlbmd0aDtcclxuXHRcdFx0XHRcdGZvcig7aSA8IHg7IGkrKyl7XHJcblx0XHRcdFx0XHRcdHZhciBpaSA9IChpICsgVHlwZS5saXN0LmluZGV4KTtcclxuXHRcdFx0XHRcdFx0aWYoZil7XHJcblx0XHRcdFx0XHRcdFx0ciA9IGxsZT8gYy5jYWxsKF8gfHwgdGhpcywgbFtsbFtpXV0sIGxsW2ldLCB0KSA6IGMuY2FsbChfIHx8IHRoaXMsIGxbaV0sIGlpLCB0KTtcclxuXHRcdFx0XHRcdFx0XHRpZihyICE9PSB1KXsgcmV0dXJuIHIgfVxyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdC8vaWYoVHlwZS50ZXN0LmlzKGMsbFtpXSkpeyByZXR1cm4gaWkgfSAvLyBzaG91bGQgaW1wbGVtZW50IGRlZXAgZXF1YWxpdHkgdGVzdGluZyFcclxuXHRcdFx0XHRcdFx0XHRpZihjID09PSBsW2xsZT8gbGxbaV0gOiBpXSl7IHJldHVybiBsbD8gbGxbaV0gOiBpaSB9IC8vIHVzZSB0aGlzIGZvciBub3dcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRmb3IoaSBpbiBsKXtcclxuXHRcdFx0XHRcdFx0aWYoZil7XHJcblx0XHRcdFx0XHRcdFx0aWYob2JqX2hhcyhsLGkpKXtcclxuXHRcdFx0XHRcdFx0XHRcdHIgPSBfPyBjLmNhbGwoXywgbFtpXSwgaSwgdCkgOiBjKGxbaV0sIGksIHQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYociAhPT0gdSl7IHJldHVybiByIH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Ly9pZihhLnRlc3QuaXMoYyxsW2ldKSl7IHJldHVybiBpIH0gLy8gc2hvdWxkIGltcGxlbWVudCBkZWVwIGVxdWFsaXR5IHRlc3RpbmchXHJcblx0XHRcdFx0XHRcdFx0aWYoYyA9PT0gbFtpXSl7IHJldHVybiBpIH0gLy8gdXNlIHRoaXMgZm9yIG5vd1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBmPyB0LnIgOiBUeXBlLmxpc3QuaW5kZXg/IDAgOiAtMTtcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdFR5cGUudGltZSA9IHt9O1xyXG5cdFx0VHlwZS50aW1lLmlzID0gZnVuY3Rpb24odCl7IHJldHVybiB0PyB0IGluc3RhbmNlb2YgRGF0ZSA6ICgrbmV3IERhdGUoKS5nZXRUaW1lKCkpIH1cclxuXHJcblx0XHR2YXIgZm5faXMgPSBUeXBlLmZuLmlzO1xyXG5cdFx0dmFyIGxpc3RfaXMgPSBUeXBlLmxpc3QuaXM7XHJcblx0XHR2YXIgb2JqID0gVHlwZS5vYmosIG9ial9pcyA9IG9iai5pcywgb2JqX2hhcyA9IG9iai5oYXMsIG9ial9tYXAgPSBvYmoubWFwO1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBUeXBlO1xyXG5cdH0pKHJlcXVpcmUsICcuL3R5cGUnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdC8vIE9uIGV2ZW50IGVtaXR0ZXIgZ2VuZXJpYyBqYXZhc2NyaXB0IHV0aWxpdHkuXHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG9udG8odGFnLCBhcmcsIGFzKXtcclxuXHRcdFx0aWYoIXRhZyl7IHJldHVybiB7dG86IG9udG99IH1cclxuXHRcdFx0dmFyIHRhZyA9ICh0aGlzLnRhZyB8fCAodGhpcy50YWcgPSB7fSkpW3RhZ10gfHxcclxuXHRcdFx0KHRoaXMudGFnW3RhZ10gPSB7dGFnOiB0YWcsIHRvOiBvbnRvLl8gPSB7XHJcblx0XHRcdFx0bmV4dDogZnVuY3Rpb24oKXt9XHJcblx0XHRcdH19KTtcclxuXHRcdFx0aWYoYXJnIGluc3RhbmNlb2YgRnVuY3Rpb24pe1xyXG5cdFx0XHRcdHZhciBiZSA9IHtcclxuXHRcdFx0XHRcdG9mZjogb250by5vZmYgfHwgXHJcblx0XHRcdFx0XHQob250by5vZmYgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0XHRpZih0aGlzLm5leHQgPT09IG9udG8uXy5uZXh0KXsgcmV0dXJuICEwIH1cclxuXHRcdFx0XHRcdFx0aWYodGhpcyA9PT0gdGhpcy50aGUubGFzdCl7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy50aGUubGFzdCA9IHRoaXMuYmFjaztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR0aGlzLnRvLmJhY2sgPSB0aGlzLmJhY2s7XHJcblx0XHRcdFx0XHRcdHRoaXMubmV4dCA9IG9udG8uXy5uZXh0O1xyXG5cdFx0XHRcdFx0XHR0aGlzLmJhY2sudG8gPSB0aGlzLnRvO1xyXG5cdFx0XHRcdFx0fSksXHJcblx0XHRcdFx0XHR0bzogb250by5fLFxyXG5cdFx0XHRcdFx0bmV4dDogYXJnLFxyXG5cdFx0XHRcdFx0dGhlOiB0YWcsXHJcblx0XHRcdFx0XHRvbjogdGhpcyxcclxuXHRcdFx0XHRcdGFzOiBhcyxcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdChiZS5iYWNrID0gdGFnLmxhc3QgfHwgdGFnKS50byA9IGJlO1xyXG5cdFx0XHRcdHJldHVybiB0YWcubGFzdCA9IGJlO1xyXG5cdFx0XHR9XHJcblx0XHRcdCh0YWcgPSB0YWcudG8pLm5leHQoYXJnKTtcclxuXHRcdFx0cmV0dXJuIHRhZztcclxuXHRcdH07XHJcblx0fSkocmVxdWlyZSwgJy4vb250bycpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0Ly8gVE9ETzogTmVlZHMgdG8gYmUgcmVkb25lLlxyXG5cdFx0dmFyIE9uID0gcmVxdWlyZSgnLi9vbnRvJyk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gQ2hhaW4oY3JlYXRlLCBvcHQpe1xyXG5cdFx0XHRvcHQgPSBvcHQgfHwge307XHJcblx0XHRcdG9wdC5pZCA9IG9wdC5pZCB8fCAnIyc7XHJcblx0XHRcdG9wdC5yaWQgPSBvcHQucmlkIHx8ICdAJztcclxuXHRcdFx0b3B0LnV1aWQgPSBvcHQudXVpZCB8fCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHJldHVybiAoK25ldyBEYXRlKCkpICsgTWF0aC5yYW5kb20oKTtcclxuXHRcdFx0fTtcclxuXHRcdFx0dmFyIG9uID0gT247Ly9Pbi5zY29wZSgpO1xyXG5cclxuXHRcdFx0b24uc3R1biA9IGZ1bmN0aW9uKGNoYWluKXtcclxuXHRcdFx0XHR2YXIgc3R1biA9IGZ1bmN0aW9uKGV2KXtcclxuXHRcdFx0XHRcdGlmKHN0dW4ub2ZmICYmIHN0dW4gPT09IHRoaXMuc3R1bil7XHJcblx0XHRcdFx0XHRcdHRoaXMuc3R1biA9IG51bGw7XHJcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmKG9uLnN0dW4uc2tpcCl7XHJcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmKGV2KXtcclxuXHRcdFx0XHRcdFx0ZXYuY2IgPSBldi5mbjtcclxuXHRcdFx0XHRcdFx0ZXYub2ZmKCk7XHJcblx0XHRcdFx0XHRcdHJlcy5xdWV1ZS5wdXNoKGV2KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH0sIHJlcyA9IHN0dW4ucmVzID0gZnVuY3Rpb24odG1wLCBhcyl7XHJcblx0XHRcdFx0XHRpZihzdHVuLm9mZil7IHJldHVybiB9XHJcblx0XHRcdFx0XHRpZih0bXAgaW5zdGFuY2VvZiBGdW5jdGlvbil7XHJcblx0XHRcdFx0XHRcdG9uLnN0dW4uc2tpcCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdHRtcC5jYWxsKGFzKTtcclxuXHRcdFx0XHRcdFx0b24uc3R1bi5za2lwID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHN0dW4ub2ZmID0gdHJ1ZTtcclxuXHRcdFx0XHRcdHZhciBpID0gMCwgcSA9IHJlcy5xdWV1ZSwgbCA9IHEubGVuZ3RoLCBhY3Q7XHJcblx0XHRcdFx0XHRyZXMucXVldWUgPSBbXTtcclxuXHRcdFx0XHRcdGlmKHN0dW4gPT09IGF0LnN0dW4pe1xyXG5cdFx0XHRcdFx0XHRhdC5zdHVuID0gbnVsbDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGZvcihpOyBpIDwgbDsgaSsrKXsgYWN0ID0gcVtpXTtcclxuXHRcdFx0XHRcdFx0YWN0LmZuID0gYWN0LmNiO1xyXG5cdFx0XHRcdFx0XHRhY3QuY2IgPSBudWxsO1xyXG5cdFx0XHRcdFx0XHRvbi5zdHVuLnNraXAgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRhY3QuY3R4Lm9uKGFjdC50YWcsIGFjdC5mbiwgYWN0KTtcclxuXHRcdFx0XHRcdFx0b24uc3R1bi5za2lwID0gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSwgYXQgPSBjaGFpbi5fO1xyXG5cdFx0XHRcdHJlcy5iYWNrID0gYXQuc3R1biB8fCAoYXQuYmFja3x8e186e319KS5fLnN0dW47XHJcblx0XHRcdFx0aWYocmVzLmJhY2spe1xyXG5cdFx0XHRcdFx0cmVzLmJhY2submV4dCA9IHN0dW47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJlcy5xdWV1ZSA9IFtdO1xyXG5cdFx0XHRcdGF0LnN0dW4gPSBzdHVuOyBcclxuXHRcdFx0XHRyZXR1cm4gcmVzO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBvbjtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHRcdHJldHVybjtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR2YXIgYXNrID0gb24uYXNrID0gZnVuY3Rpb24oY2IsIGFzKXtcclxuXHRcdFx0XHRpZighYXNrLm9uKXsgYXNrLm9uID0gT24uc2NvcGUoKSB9XHJcblx0XHRcdFx0dmFyIGlkID0gb3B0LnV1aWQoKTtcclxuXHRcdFx0XHRpZihjYil7IGFzay5vbihpZCwgY2IsIGFzKSB9XHJcblx0XHRcdFx0cmV0dXJuIGlkO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFzay5fID0gb3B0LmlkO1xyXG5cdFx0XHRvbi5hY2sgPSBmdW5jdGlvbihhdCwgcmVwbHkpe1xyXG5cdFx0XHRcdGlmKCFhdCB8fCAhcmVwbHkgfHwgIWFzay5vbil7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIGlkID0gYXRbb3B0LmlkXSB8fCBhdDtcclxuXHRcdFx0XHRpZighYXNrLm9uc1tpZF0peyByZXR1cm4gfVxyXG5cdFx0XHRcdGFzay5vbihpZCwgcmVwbHkpO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdG9uLmFjay5fID0gb3B0LnJpZDtcclxuXHJcblxyXG5cdFx0XHRyZXR1cm4gb247XHJcblx0XHRcdHJldHVybjtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHRcdHJldHVybjtcclxuXHRcdFx0b24ub24oJ2V2ZW50JywgZnVuY3Rpb24gZXZlbnQoYWN0KXtcclxuXHRcdFx0XHR2YXIgbGFzdCA9IGFjdC5vbi5sYXN0LCB0bXA7XHJcblx0XHRcdFx0aWYoJ2luJyA9PT0gYWN0LnRhZyAmJiBHdW4uY2hhaW4uY2hhaW4uaW5wdXQgIT09IGFjdC5mbil7IC8vIFRPRE86IEJVRyEgR3VuIGlzIG5vdCBhdmFpbGFibGUgaW4gdGhpcyBtb2R1bGUuXHJcblx0XHRcdFx0XHRpZigodG1wID0gYWN0LmN0eCkgJiYgdG1wLnN0dW4pe1xyXG5cdFx0XHRcdFx0XHRpZih0bXAuc3R1bihhY3QpKXtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoIWxhc3QpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGlmKGFjdC5vbi5tYXApe1xyXG5cdFx0XHRcdFx0dmFyIG1hcCA9IGFjdC5vbi5tYXAsIHY7XHJcblx0XHRcdFx0XHRmb3IodmFyIGYgaW4gbWFwKXsgdiA9IG1hcFtmXTtcclxuXHRcdFx0XHRcdFx0aWYodil7XHJcblx0XHRcdFx0XHRcdFx0ZW1pdCh2LCBhY3QsIGV2ZW50KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0LypcclxuXHRcdFx0XHRcdEd1bi5vYmoubWFwKGFjdC5vbi5tYXAsIGZ1bmN0aW9uKHYsZil7IC8vIFRPRE86IEJVRyEgR3VuIGlzIG5vdCBhdmFpbGFibGUgaW4gdGhpcyBtb2R1bGUuXHJcblx0XHRcdFx0XHRcdC8vZW1pdCh2WzBdLCBhY3QsIGV2ZW50LCB2WzFdKTsgLy8gYmVsb3cgZW5hYmxlcyBtb3JlIGNvbnRyb2xcclxuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcImJvb29vb29vb1wiLCBmLHYpO1xyXG5cdFx0XHRcdFx0XHRlbWl0KHYsIGFjdCwgZXZlbnQpO1xyXG5cdFx0XHRcdFx0XHQvL2VtaXQodlsxXSwgYWN0LCBldmVudCwgdlsyXSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdCovXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGVtaXQobGFzdCwgYWN0LCBldmVudCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGxhc3QgIT09IGFjdC5vbi5sYXN0KXtcclxuXHRcdFx0XHRcdGV2ZW50KGFjdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0ZnVuY3Rpb24gZW1pdChsYXN0LCBhY3QsIGV2ZW50LCBldil7XHJcblx0XHRcdFx0aWYobGFzdCBpbnN0YW5jZW9mIEFycmF5KXtcclxuXHRcdFx0XHRcdGFjdC5mbi5hcHBseShhY3QuYXMsIGxhc3QuY29uY2F0KGV2fHxhY3QpKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0YWN0LmZuLmNhbGwoYWN0LmFzLCBsYXN0LCBldnx8YWN0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8qb24ub24oJ2VtaXQnLCBmdW5jdGlvbihldil7XHJcblx0XHRcdFx0aWYoZXYub24ubWFwKXtcclxuXHRcdFx0XHRcdHZhciBpZCA9IGV2LmFyZy52aWEuZ3VuLl8uaWQgKyBldi5hcmcuZ2V0O1xyXG5cdFx0XHRcdFx0Ly9cclxuXHRcdFx0XHRcdC8vZXYuaWQgPSBldi5pZCB8fCBHdW4udGV4dC5yYW5kb20oNik7XHJcblx0XHRcdFx0XHQvL2V2Lm9uLm1hcFtldi5pZF0gPSBldi5hcmc7XHJcblx0XHRcdFx0XHQvL2V2LnByb3h5ID0gZXYuYXJnWzFdO1xyXG5cdFx0XHRcdFx0Ly9ldi5hcmcgPSBldi5hcmdbMF07XHJcblx0XHRcdFx0XHQvLyBiZWxvdyBnaXZlcyBtb3JlIGNvbnRyb2wuXHJcblx0XHRcdFx0XHRldi5vbi5tYXBbaWRdID0gZXYuYXJnO1xyXG5cdFx0XHRcdFx0Ly9ldi5wcm94eSA9IGV2LmFyZ1syXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZXYub24ubGFzdCA9IGV2LmFyZztcclxuXHRcdFx0fSk7Ki9cclxuXHJcblx0XHRcdG9uLm9uKCdlbWl0JywgZnVuY3Rpb24oZXYpe1xyXG5cdFx0XHRcdHZhciBndW4gPSBldi5hcmcuZ3VuO1xyXG5cdFx0XHRcdGlmKCdpbicgPT09IGV2LnRhZyAmJiBndW4gJiYgIWd1bi5fLnNvdWwpeyAvLyBUT0RPOiBCVUchIFNvdWwgc2hvdWxkIGJlIGF2YWlsYWJsZS4gQ3VycmVudGx5IG5vdCB1c2luZyBpdCB0aG91Z2gsIGJ1dCBzaG91bGQgZW5hYmxlIGl0IChjaGVjayBmb3Igc2lkZSBlZmZlY3RzIGlmIG1hZGUgYXZhaWxhYmxlKS5cclxuXHRcdFx0XHRcdChldi5vbi5tYXAgPSBldi5vbi5tYXAgfHwge30pW2d1bi5fLmlkIHx8IChndW4uXy5pZCA9IE1hdGgucmFuZG9tKCkpXSA9IGV2LmFyZztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZXYub24ubGFzdCA9IGV2LmFyZztcclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBvbjtcclxuXHRcdH1cclxuXHRcdG1vZHVsZS5leHBvcnRzID0gQ2hhaW47XHJcblx0fSkocmVxdWlyZSwgJy4vb25pZnknKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdC8vIEdlbmVyaWMgamF2YXNjcmlwdCBzY2hlZHVsZXIgdXRpbGl0eS5cclxuXHRcdHZhciBUeXBlID0gcmVxdWlyZSgnLi90eXBlJyk7XHJcblx0XHRmdW5jdGlvbiBzKHN0YXRlLCBjYiwgdGltZSl7IC8vIG1heWJlIHVzZSBscnUtY2FjaGU/XHJcblx0XHRcdHMudGltZSA9IHRpbWU7XHJcblx0XHRcdHMud2FpdGluZy5wdXNoKHt3aGVuOiBzdGF0ZSwgZXZlbnQ6IGNiIHx8IGZ1bmN0aW9uKCl7fX0pO1xyXG5cdFx0XHRpZihzLnNvb25lc3QgPCBzdGF0ZSl7IHJldHVybiB9XHJcblx0XHRcdHMuc2V0KHN0YXRlKTtcclxuXHRcdH1cclxuXHRcdHMud2FpdGluZyA9IFtdO1xyXG5cdFx0cy5zb29uZXN0ID0gSW5maW5pdHk7XHJcblx0XHRzLnNvcnQgPSBUeXBlLmxpc3Quc29ydCgnd2hlbicpO1xyXG5cdFx0cy5zZXQgPSBmdW5jdGlvbihmdXR1cmUpe1xyXG5cdFx0XHRpZihJbmZpbml0eSA8PSAocy5zb29uZXN0ID0gZnV0dXJlKSl7IHJldHVybiB9XHJcblx0XHRcdHZhciBub3cgPSBzLnRpbWUoKTtcclxuXHRcdFx0ZnV0dXJlID0gKGZ1dHVyZSA8PSBub3cpPyAwIDogKGZ1dHVyZSAtIG5vdyk7XHJcblx0XHRcdGNsZWFyVGltZW91dChzLmlkKTtcclxuXHRcdFx0cy5pZCA9IHNldFRpbWVvdXQocy5jaGVjaywgZnV0dXJlKTtcclxuXHRcdH1cclxuXHRcdHMuZWFjaCA9IGZ1bmN0aW9uKHdhaXQsIGksIG1hcCl7XHJcblx0XHRcdHZhciBjdHggPSB0aGlzO1xyXG5cdFx0XHRpZighd2FpdCl7IHJldHVybiB9XHJcblx0XHRcdGlmKHdhaXQud2hlbiA8PSBjdHgubm93KXtcclxuXHRcdFx0XHRpZih3YWl0LmV2ZW50IGluc3RhbmNlb2YgRnVuY3Rpb24pe1xyXG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpeyB3YWl0LmV2ZW50KCkgfSwwKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y3R4LnNvb25lc3QgPSAoY3R4LnNvb25lc3QgPCB3YWl0LndoZW4pPyBjdHguc29vbmVzdCA6IHdhaXQud2hlbjtcclxuXHRcdFx0XHRtYXAod2FpdCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHMuY2hlY2sgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgY3R4ID0ge25vdzogcy50aW1lKCksIHNvb25lc3Q6IEluZmluaXR5fTtcclxuXHRcdFx0cy53YWl0aW5nLnNvcnQocy5zb3J0KTtcclxuXHRcdFx0cy53YWl0aW5nID0gVHlwZS5saXN0Lm1hcChzLndhaXRpbmcsIHMuZWFjaCwgY3R4KSB8fCBbXTtcclxuXHRcdFx0cy5zZXQoY3R4LnNvb25lc3QpO1xyXG5cdFx0fVxyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBzO1xyXG5cdH0pKHJlcXVpcmUsICcuL3NjaGVkdWxlJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHQvKiBCYXNlZCBvbiB0aGUgSHlwb3RoZXRpY2FsIEFtbmVzaWEgTWFjaGluZSB0aG91Z2h0IGV4cGVyaW1lbnQgKi9cclxuXHRcdGZ1bmN0aW9uIEhBTShtYWNoaW5lU3RhdGUsIGluY29taW5nU3RhdGUsIGN1cnJlbnRTdGF0ZSwgaW5jb21pbmdWYWx1ZSwgY3VycmVudFZhbHVlKXtcclxuXHRcdFx0aWYobWFjaGluZVN0YXRlIDwgaW5jb21pbmdTdGF0ZSl7XHJcblx0XHRcdFx0cmV0dXJuIHtkZWZlcjogdHJ1ZX07IC8vIHRoZSBpbmNvbWluZyB2YWx1ZSBpcyBvdXRzaWRlIHRoZSBib3VuZGFyeSBvZiB0aGUgbWFjaGluZSdzIHN0YXRlLCBpdCBtdXN0IGJlIHJlcHJvY2Vzc2VkIGluIGFub3RoZXIgc3RhdGUuXHJcblx0XHRcdH1cclxuXHRcdFx0aWYoaW5jb21pbmdTdGF0ZSA8IGN1cnJlbnRTdGF0ZSl7XHJcblx0XHRcdFx0cmV0dXJuIHtoaXN0b3JpY2FsOiB0cnVlfTsgLy8gdGhlIGluY29taW5nIHZhbHVlIGlzIHdpdGhpbiB0aGUgYm91bmRhcnkgb2YgdGhlIG1hY2hpbmUncyBzdGF0ZSwgYnV0IG5vdCB3aXRoaW4gdGhlIHJhbmdlLlxyXG5cclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjdXJyZW50U3RhdGUgPCBpbmNvbWluZ1N0YXRlKXtcclxuXHRcdFx0XHRyZXR1cm4ge2NvbnZlcmdlOiB0cnVlLCBpbmNvbWluZzogdHJ1ZX07IC8vIHRoZSBpbmNvbWluZyB2YWx1ZSBpcyB3aXRoaW4gYm90aCB0aGUgYm91bmRhcnkgYW5kIHRoZSByYW5nZSBvZiB0aGUgbWFjaGluZSdzIHN0YXRlLlxyXG5cclxuXHRcdFx0fVxyXG5cdFx0XHRpZihpbmNvbWluZ1N0YXRlID09PSBjdXJyZW50U3RhdGUpe1xyXG5cdFx0XHRcdGluY29taW5nVmFsdWUgPSBMZXhpY2FsKGluY29taW5nVmFsdWUpIHx8IFwiXCI7XHJcblx0XHRcdFx0Y3VycmVudFZhbHVlID0gTGV4aWNhbChjdXJyZW50VmFsdWUpIHx8IFwiXCI7XHJcblx0XHRcdFx0aWYoaW5jb21pbmdWYWx1ZSA9PT0gY3VycmVudFZhbHVlKXsgLy8gTm90ZTogd2hpbGUgdGhlc2UgYXJlIHByYWN0aWNhbGx5IHRoZSBzYW1lLCB0aGUgZGVsdGFzIGNvdWxkIGJlIHRlY2huaWNhbGx5IGRpZmZlcmVudFxyXG5cdFx0XHRcdFx0cmV0dXJuIHtzdGF0ZTogdHJ1ZX07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8qXHJcblx0XHRcdFx0XHRUaGUgZm9sbG93aW5nIGlzIGEgbmFpdmUgaW1wbGVtZW50YXRpb24sIGJ1dCB3aWxsIGFsd2F5cyB3b3JrLlxyXG5cdFx0XHRcdFx0TmV2ZXIgY2hhbmdlIGl0IHVubGVzcyB5b3UgaGF2ZSBzcGVjaWZpYyBuZWVkcyB0aGF0IGFic29sdXRlbHkgcmVxdWlyZSBpdC5cclxuXHRcdFx0XHRcdElmIGNoYW5nZWQsIHlvdXIgZGF0YSB3aWxsIGRpdmVyZ2UgdW5sZXNzIHlvdSBndWFyYW50ZWUgZXZlcnkgcGVlcidzIGFsZ29yaXRobSBoYXMgYWxzbyBiZWVuIGNoYW5nZWQgdG8gYmUgdGhlIHNhbWUuXHJcblx0XHRcdFx0XHRBcyBhIHJlc3VsdCwgaXQgaXMgaGlnaGx5IGRpc2NvdXJhZ2VkIHRvIG1vZGlmeSBkZXNwaXRlIHRoZSBmYWN0IHRoYXQgaXQgaXMgbmFpdmUsXHJcblx0XHRcdFx0XHRiZWNhdXNlIGNvbnZlcmdlbmNlIChkYXRhIGludGVncml0eSkgaXMgZ2VuZXJhbGx5IG1vcmUgaW1wb3J0YW50LlxyXG5cdFx0XHRcdFx0QW55IGRpZmZlcmVuY2UgaW4gdGhpcyBhbGdvcml0aG0gbXVzdCBiZSBnaXZlbiBhIG5ldyBhbmQgZGlmZmVyZW50IG5hbWUuXHJcblx0XHRcdFx0Ki9cclxuXHRcdFx0XHRpZihpbmNvbWluZ1ZhbHVlIDwgY3VycmVudFZhbHVlKXsgLy8gTGV4aWNhbCBvbmx5IHdvcmtzIG9uIHNpbXBsZSB2YWx1ZSB0eXBlcyFcclxuXHRcdFx0XHRcdHJldHVybiB7Y29udmVyZ2U6IHRydWUsIGN1cnJlbnQ6IHRydWV9O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihjdXJyZW50VmFsdWUgPCBpbmNvbWluZ1ZhbHVlKXsgLy8gTGV4aWNhbCBvbmx5IHdvcmtzIG9uIHNpbXBsZSB2YWx1ZSB0eXBlcyFcclxuXHRcdFx0XHRcdHJldHVybiB7Y29udmVyZ2U6IHRydWUsIGluY29taW5nOiB0cnVlfTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHtlcnI6IFwiSW52YWxpZCBDUkRUIERhdGE6IFwiKyBpbmNvbWluZ1ZhbHVlICtcIiB0byBcIisgY3VycmVudFZhbHVlICtcIiBhdCBcIisgaW5jb21pbmdTdGF0ZSArXCIgdG8gXCIrIGN1cnJlbnRTdGF0ZSArXCIhXCJ9O1xyXG5cdFx0fVxyXG5cdFx0aWYodHlwZW9mIEpTT04gPT09ICd1bmRlZmluZWQnKXtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFxyXG5cdFx0XHRcdCdKU09OIGlzIG5vdCBpbmNsdWRlZCBpbiB0aGlzIGJyb3dzZXIuIFBsZWFzZSBsb2FkIGl0IGZpcnN0OiAnICtcclxuXHRcdFx0XHQnYWpheC5jZG5qcy5jb20vYWpheC9saWJzL2pzb24yLzIwMTEwMjIzL2pzb24yLmpzJ1xyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIExleGljYWwgPSBKU09OLnN0cmluZ2lmeSwgdW5kZWZpbmVkO1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBIQU07XHJcblx0fSkocmVxdWlyZSwgJy4vSEFNJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgVHlwZSA9IHJlcXVpcmUoJy4vdHlwZScpO1xyXG5cdFx0dmFyIFZhbCA9IHt9O1xyXG5cdFx0VmFsLmlzID0gZnVuY3Rpb24odil7IC8vIFZhbGlkIHZhbHVlcyBhcmUgYSBzdWJzZXQgb2YgSlNPTjogbnVsbCwgYmluYXJ5LCBudW1iZXIgKCFJbmZpbml0eSksIHRleHQsIG9yIGEgc291bCByZWxhdGlvbi4gQXJyYXlzIG5lZWQgc3BlY2lhbCBhbGdvcml0aG1zIHRvIGhhbmRsZSBjb25jdXJyZW5jeSwgc28gdGhleSBhcmUgbm90IHN1cHBvcnRlZCBkaXJlY3RseS4gVXNlIGFuIGV4dGVuc2lvbiB0aGF0IHN1cHBvcnRzIHRoZW0gaWYgbmVlZGVkIGJ1dCByZXNlYXJjaCB0aGVpciBwcm9ibGVtcyBmaXJzdC5cclxuXHRcdFx0aWYodiA9PT0gdSl7IHJldHVybiBmYWxzZSB9XHJcblx0XHRcdGlmKHYgPT09IG51bGwpeyByZXR1cm4gdHJ1ZSB9IC8vIFwiZGVsZXRlc1wiLCBudWxsaW5nIG91dCBmaWVsZHMuXHJcblx0XHRcdGlmKHYgPT09IEluZmluaXR5KXsgcmV0dXJuIGZhbHNlIH0gLy8gd2Ugd2FudCB0aGlzIHRvIGJlLCBidXQgSlNPTiBkb2VzIG5vdCBzdXBwb3J0IGl0LCBzYWQgZmFjZS5cclxuXHRcdFx0aWYodGV4dF9pcyh2KSAvLyBieSBcInRleHRcIiB3ZSBtZWFuIHN0cmluZ3MuXHJcblx0XHRcdHx8IGJpX2lzKHYpIC8vIGJ5IFwiYmluYXJ5XCIgd2UgbWVhbiBib29sZWFuLlxyXG5cdFx0XHR8fCBudW1faXModikpeyAvLyBieSBcIm51bWJlclwiIHdlIG1lYW4gaW50ZWdlcnMgb3IgZGVjaW1hbHMuIFxyXG5cdFx0XHRcdHJldHVybiB0cnVlOyAvLyBzaW1wbGUgdmFsdWVzIGFyZSB2YWxpZC5cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gVmFsLnJlbC5pcyh2KSB8fCBmYWxzZTsgLy8gaXMgdGhlIHZhbHVlIGEgc291bCByZWxhdGlvbj8gVGhlbiBpdCBpcyB2YWxpZCBhbmQgcmV0dXJuIGl0LiBJZiBub3QsIGV2ZXJ5dGhpbmcgZWxzZSByZW1haW5pbmcgaXMgYW4gaW52YWxpZCBkYXRhIHR5cGUuIEN1c3RvbSBleHRlbnNpb25zIGNhbiBiZSBidWlsdCBvbiB0b3Agb2YgdGhlc2UgcHJpbWl0aXZlcyB0byBzdXBwb3J0IG90aGVyIHR5cGVzLlxyXG5cdFx0fVxyXG5cdFx0VmFsLnJlbCA9IHtfOiAnIyd9O1xyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRWYWwucmVsLmlzID0gZnVuY3Rpb24odil7IC8vIHRoaXMgZGVmaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhIHNvdWwgcmVsYXRpb24gb3Igbm90LCB0aGV5IGxvb2sgbGlrZSB0aGlzOiB7JyMnOiAnVVVJRCd9XHJcblx0XHRcdFx0aWYodiAmJiB2W3JlbF9dICYmICF2Ll8gJiYgb2JqX2lzKHYpKXsgLy8gbXVzdCBiZSBhbiBvYmplY3QuXHJcblx0XHRcdFx0XHR2YXIgbyA9IHt9O1xyXG5cdFx0XHRcdFx0b2JqX21hcCh2LCBtYXAsIG8pO1xyXG5cdFx0XHRcdFx0aWYoby5pZCl7IC8vIGEgdmFsaWQgaWQgd2FzIGZvdW5kLlxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gby5pZDsgLy8geWF5ISBSZXR1cm4gaXQuXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZTsgLy8gdGhlIHZhbHVlIHdhcyBub3QgYSB2YWxpZCBzb3VsIHJlbGF0aW9uLlxyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcChzLCBmKXsgdmFyIG8gPSB0aGlzOyAvLyBtYXAgb3ZlciB0aGUgb2JqZWN0Li4uXHJcblx0XHRcdFx0aWYoby5pZCl7IHJldHVybiBvLmlkID0gZmFsc2UgfSAvLyBpZiBJRCBpcyBhbHJlYWR5IGRlZmluZWQgQU5EIHdlJ3JlIHN0aWxsIGxvb3BpbmcgdGhyb3VnaCB0aGUgb2JqZWN0LCBpdCBpcyBjb25zaWRlcmVkIGludmFsaWQuXHJcblx0XHRcdFx0aWYoZiA9PSByZWxfICYmIHRleHRfaXMocykpeyAvLyB0aGUgZmllbGQgc2hvdWxkIGJlICcjJyBhbmQgaGF2ZSBhIHRleHQgdmFsdWUuXHJcblx0XHRcdFx0XHRvLmlkID0gczsgLy8gd2UgZm91bmQgdGhlIHNvdWwhXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiBvLmlkID0gZmFsc2U7IC8vIGlmIHRoZXJlIGV4aXN0cyBhbnl0aGluZyBlbHNlIG9uIHRoZSBvYmplY3QgdGhhdCBpc24ndCB0aGUgc291bCwgdGhlbiBpdCBpcyBjb25zaWRlcmVkIGludmFsaWQuXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0VmFsLnJlbC5pZnkgPSBmdW5jdGlvbih0KXsgcmV0dXJuIG9ial9wdXQoe30sIHJlbF8sIHQpIH0gLy8gY29udmVydCBhIHNvdWwgaW50byBhIHJlbGF0aW9uIGFuZCByZXR1cm4gaXQuXHJcblx0XHR2YXIgcmVsXyA9IFZhbC5yZWwuXywgdTtcclxuXHRcdHZhciBiaV9pcyA9IFR5cGUuYmkuaXM7XHJcblx0XHR2YXIgbnVtX2lzID0gVHlwZS5udW0uaXM7XHJcblx0XHR2YXIgdGV4dF9pcyA9IFR5cGUudGV4dC5pcztcclxuXHRcdHZhciBvYmogPSBUeXBlLm9iaiwgb2JqX2lzID0gb2JqLmlzLCBvYmpfcHV0ID0gb2JqLnB1dCwgb2JqX21hcCA9IG9iai5tYXA7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IFZhbDtcclxuXHR9KShyZXF1aXJlLCAnLi92YWwnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBUeXBlID0gcmVxdWlyZSgnLi90eXBlJyk7XHJcblx0XHR2YXIgVmFsID0gcmVxdWlyZSgnLi92YWwnKTtcclxuXHRcdHZhciBOb2RlID0ge186ICdfJ307XHJcblx0XHROb2RlLnNvdWwgPSBmdW5jdGlvbihuLCBvKXsgcmV0dXJuIChuICYmIG4uXyAmJiBuLl9bbyB8fCBzb3VsX10pIH0gLy8gY29udmVuaWVuY2UgZnVuY3Rpb24gdG8gY2hlY2sgdG8gc2VlIGlmIHRoZXJlIGlzIGEgc291bCBvbiBhIG5vZGUgYW5kIHJldHVybiBpdC5cclxuXHRcdE5vZGUuc291bC5pZnkgPSBmdW5jdGlvbihuLCBvKXsgLy8gcHV0IGEgc291bCBvbiBhbiBvYmplY3QuXHJcblx0XHRcdG8gPSAodHlwZW9mIG8gPT09ICdzdHJpbmcnKT8ge3NvdWw6IG99IDogbyB8fCB7fTtcclxuXHRcdFx0biA9IG4gfHwge307IC8vIG1ha2Ugc3VyZSBpdCBleGlzdHMuXHJcblx0XHRcdG4uXyA9IG4uXyB8fCB7fTsgLy8gbWFrZSBzdXJlIG1ldGEgZXhpc3RzLlxyXG5cdFx0XHRuLl9bc291bF9dID0gby5zb3VsIHx8IG4uX1tzb3VsX10gfHwgdGV4dF9yYW5kb20oKTsgLy8gcHV0IHRoZSBzb3VsIG9uIGl0LlxyXG5cdFx0XHRyZXR1cm4gbjtcclxuXHRcdH1cclxuXHRcdE5vZGUuc291bC5fID0gVmFsLnJlbC5fO1xyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHROb2RlLmlzID0gZnVuY3Rpb24obiwgY2IsIGFzKXsgdmFyIHM7IC8vIGNoZWNrcyB0byBzZWUgaWYgYW4gb2JqZWN0IGlzIGEgdmFsaWQgbm9kZS5cclxuXHRcdFx0XHRpZighb2JqX2lzKG4pKXsgcmV0dXJuIGZhbHNlIH0gLy8gbXVzdCBiZSBhbiBvYmplY3QuXHJcblx0XHRcdFx0aWYocyA9IE5vZGUuc291bChuKSl7IC8vIG11c3QgaGF2ZSBhIHNvdWwgb24gaXQuXHJcblx0XHRcdFx0XHRyZXR1cm4gIW9ial9tYXAobiwgbWFwLCB7YXM6YXMsY2I6Y2IsczpzLG46bn0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7IC8vIG5vcGUhIFRoaXMgd2FzIG5vdCBhIHZhbGlkIG5vZGUuXHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbWFwKHYsIGYpeyAvLyB3ZSBpbnZlcnQgdGhpcyBiZWNhdXNlIHRoZSB3YXkgd2UgY2hlY2sgZm9yIHRoaXMgaXMgdmlhIGEgbmVnYXRpb24uXHJcblx0XHRcdFx0aWYoZiA9PT0gTm9kZS5fKXsgcmV0dXJuIH0gLy8gc2tpcCBvdmVyIHRoZSBtZXRhZGF0YS5cclxuXHRcdFx0XHRpZighVmFsLmlzKHYpKXsgcmV0dXJuIHRydWUgfSAvLyBpdCBpcyB0cnVlIHRoYXQgdGhpcyBpcyBhbiBpbnZhbGlkIG5vZGUuXHJcblx0XHRcdFx0aWYodGhpcy5jYil7IHRoaXMuY2IuY2FsbCh0aGlzLmFzLCB2LCBmLCB0aGlzLm4sIHRoaXMucykgfSAvLyBvcHRpb25hbGx5IGNhbGxiYWNrIGVhY2ggZmllbGQvdmFsdWUuXHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdE5vZGUuaWZ5ID0gZnVuY3Rpb24ob2JqLCBvLCBhcyl7IC8vIHJldHVybnMgYSBub2RlIGZyb20gYSBzaGFsbG93IG9iamVjdC5cclxuXHRcdFx0XHRpZighbyl7IG8gPSB7fSB9XHJcblx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgbyA9PT0gJ3N0cmluZycpeyBvID0ge3NvdWw6IG99IH1cclxuXHRcdFx0XHRlbHNlIGlmKG8gaW5zdGFuY2VvZiBGdW5jdGlvbil7IG8gPSB7bWFwOiBvfSB9XHJcblx0XHRcdFx0aWYoby5tYXApeyBvLm5vZGUgPSBvLm1hcC5jYWxsKGFzLCBvYmosIHUsIG8ubm9kZSB8fCB7fSkgfVxyXG5cdFx0XHRcdGlmKG8ubm9kZSA9IE5vZGUuc291bC5pZnkoby5ub2RlIHx8IHt9LCBvKSl7XHJcblx0XHRcdFx0XHRvYmpfbWFwKG9iaiwgbWFwLCB7bzpvLGFzOmFzfSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBvLm5vZGU7IC8vIFRoaXMgd2lsbCBvbmx5IGJlIGEgdmFsaWQgbm9kZSBpZiB0aGUgb2JqZWN0IHdhc24ndCBhbHJlYWR5IGRlZXAhXHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbWFwKHYsIGYpeyB2YXIgbyA9IHRoaXMubywgdG1wLCB1OyAvLyBpdGVyYXRlIG92ZXIgZWFjaCBmaWVsZC92YWx1ZS5cclxuXHRcdFx0XHRpZihvLm1hcCl7XHJcblx0XHRcdFx0XHR0bXAgPSBvLm1hcC5jYWxsKHRoaXMuYXMsIHYsICcnK2YsIG8ubm9kZSk7XHJcblx0XHRcdFx0XHRpZih1ID09PSB0bXApe1xyXG5cdFx0XHRcdFx0XHRvYmpfZGVsKG8ubm9kZSwgZik7XHJcblx0XHRcdFx0XHR9IGVsc2VcclxuXHRcdFx0XHRcdGlmKG8ubm9kZSl7IG8ubm9kZVtmXSA9IHRtcCB9XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKFZhbC5pcyh2KSl7XHJcblx0XHRcdFx0XHRvLm5vZGVbZl0gPSB2O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdHZhciBvYmogPSBUeXBlLm9iaiwgb2JqX2lzID0gb2JqLmlzLCBvYmpfZGVsID0gb2JqLmRlbCwgb2JqX21hcCA9IG9iai5tYXA7XHJcblx0XHR2YXIgdGV4dCA9IFR5cGUudGV4dCwgdGV4dF9yYW5kb20gPSB0ZXh0LnJhbmRvbTtcclxuXHRcdHZhciBzb3VsXyA9IE5vZGUuc291bC5fO1xyXG5cdFx0dmFyIHU7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IE5vZGU7XHJcblx0fSkocmVxdWlyZSwgJy4vbm9kZScpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIFR5cGUgPSByZXF1aXJlKCcuL3R5cGUnKTtcclxuXHRcdHZhciBOb2RlID0gcmVxdWlyZSgnLi9ub2RlJyk7XHJcblx0XHRmdW5jdGlvbiBTdGF0ZSgpe1xyXG5cdFx0XHR2YXIgdDtcclxuXHRcdFx0aWYocGVyZil7XHJcblx0XHRcdFx0dCA9IHN0YXJ0ICsgcGVyZi5ub3coKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0ID0gdGltZSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGxhc3QgPCB0KXtcclxuXHRcdFx0XHRyZXR1cm4gTiA9IDAsIGxhc3QgPSB0ICsgU3RhdGUuZHJpZnQ7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGxhc3QgPSB0ICsgKChOICs9IDEpIC8gRCkgKyBTdGF0ZS5kcmlmdDtcclxuXHRcdH1cclxuXHRcdHZhciB0aW1lID0gVHlwZS50aW1lLmlzLCBsYXN0ID0gLUluZmluaXR5LCBOID0gMCwgRCA9IDEwMDA7IC8vIFdBUk5JTkchIEluIHRoZSBmdXR1cmUsIG9uIG1hY2hpbmVzIHRoYXQgYXJlIEQgdGltZXMgZmFzdGVyIHRoYW4gMjAxNkFEIG1hY2hpbmVzLCB5b3Ugd2lsbCB3YW50IHRvIGluY3JlYXNlIEQgYnkgYW5vdGhlciBzZXZlcmFsIG9yZGVycyBvZiBtYWduaXR1ZGUgc28gdGhlIHByb2Nlc3Npbmcgc3BlZWQgbmV2ZXIgb3V0IHBhY2VzIHRoZSBkZWNpbWFsIHJlc29sdXRpb24gKGluY3JlYXNpbmcgYW4gaW50ZWdlciBlZmZlY3RzIHRoZSBzdGF0ZSBhY2N1cmFjeSkuXHJcblx0XHR2YXIgcGVyZiA9ICh0eXBlb2YgcGVyZm9ybWFuY2UgIT09ICd1bmRlZmluZWQnKT8gKHBlcmZvcm1hbmNlLnRpbWluZyAmJiBwZXJmb3JtYW5jZSkgOiBmYWxzZSwgc3RhcnQgPSAocGVyZiAmJiBwZXJmLnRpbWluZyAmJiBwZXJmLnRpbWluZy5uYXZpZ2F0aW9uU3RhcnQpIHx8IChwZXJmID0gZmFsc2UpO1xyXG5cdFx0U3RhdGUuXyA9ICc+JztcclxuXHRcdFN0YXRlLmRyaWZ0ID0gMDtcclxuXHRcdFN0YXRlLmlzID0gZnVuY3Rpb24obiwgZiwgbyl7IC8vIGNvbnZlbmllbmNlIGZ1bmN0aW9uIHRvIGdldCB0aGUgc3RhdGUgb24gYSBmaWVsZCBvbiBhIG5vZGUgYW5kIHJldHVybiBpdC5cclxuXHRcdFx0dmFyIHRtcCA9IChmICYmIG4gJiYgbltOX10gJiYgbltOX11bU3RhdGUuX10pIHx8IG87XHJcblx0XHRcdGlmKCF0bXApeyByZXR1cm4gfVxyXG5cdFx0XHRyZXR1cm4gbnVtX2lzKHRtcCA9IHRtcFtmXSk/IHRtcCA6IC1JbmZpbml0eTtcclxuXHRcdH1cclxuXHRcdFN0YXRlLmlmeSA9IGZ1bmN0aW9uKG4sIGYsIHMsIHYsIHNvdWwpeyAvLyBwdXQgYSBmaWVsZCdzIHN0YXRlIG9uIGEgbm9kZS5cclxuXHRcdFx0aWYoIW4gfHwgIW5bTl9dKXsgLy8gcmVqZWN0IGlmIGl0IGlzIG5vdCBub2RlLWxpa2UuXHJcblx0XHRcdFx0aWYoIXNvdWwpeyAvLyB1bmxlc3MgdGhleSBwYXNzZWQgYSBzb3VsXHJcblx0XHRcdFx0XHRyZXR1cm47IFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuID0gTm9kZS5zb3VsLmlmeShuLCBzb3VsKTsgLy8gdGhlbiBtYWtlIGl0IHNvIVxyXG5cdFx0XHR9IFxyXG5cdFx0XHR2YXIgdG1wID0gb2JqX2FzKG5bTl9dLCBTdGF0ZS5fKTsgLy8gZ3JhYiB0aGUgc3RhdGVzIGRhdGEuXHJcblx0XHRcdGlmKHUgIT09IGYgJiYgZiAhPT0gTl8pe1xyXG5cdFx0XHRcdGlmKG51bV9pcyhzKSl7XHJcblx0XHRcdFx0XHR0bXBbZl0gPSBzOyAvLyBhZGQgdGhlIHZhbGlkIHN0YXRlLlxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZih1ICE9PSB2KXsgLy8gTm90ZTogTm90IGl0cyBqb2IgdG8gY2hlY2sgZm9yIHZhbGlkIHZhbHVlcyFcclxuXHRcdFx0XHRcdG5bZl0gPSB2O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gbjtcclxuXHRcdH1cclxuXHRcdFN0YXRlLnRvID0gZnVuY3Rpb24oZnJvbSwgZiwgdG8pe1xyXG5cdFx0XHR2YXIgdmFsID0gZnJvbVtmXTtcclxuXHRcdFx0aWYob2JqX2lzKHZhbCkpe1xyXG5cdFx0XHRcdHZhbCA9IG9ial9jb3B5KHZhbCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIFN0YXRlLmlmeSh0bywgZiwgU3RhdGUuaXMoZnJvbSwgZiksIHZhbCwgTm9kZS5zb3VsKGZyb20pKTtcclxuXHRcdH1cclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0U3RhdGUubWFwID0gZnVuY3Rpb24oY2IsIHMsIGFzKXsgdmFyIHU7IC8vIGZvciB1c2Ugd2l0aCBOb2RlLmlmeVxyXG5cdFx0XHRcdHZhciBvID0gb2JqX2lzKG8gPSBjYiB8fCBzKT8gbyA6IG51bGw7XHJcblx0XHRcdFx0Y2IgPSBmbl9pcyhjYiA9IGNiIHx8IHMpPyBjYiA6IG51bGw7XHJcblx0XHRcdFx0aWYobyAmJiAhY2Ipe1xyXG5cdFx0XHRcdFx0cyA9IG51bV9pcyhzKT8gcyA6IFN0YXRlKCk7XHJcblx0XHRcdFx0XHRvW05fXSA9IG9bTl9dIHx8IHt9O1xyXG5cdFx0XHRcdFx0b2JqX21hcChvLCBtYXAsIHtvOm8sczpzfSk7XHJcblx0XHRcdFx0XHRyZXR1cm4gbztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YXMgPSBhcyB8fCBvYmpfaXMocyk/IHMgOiB1O1xyXG5cdFx0XHRcdHMgPSBudW1faXMocyk/IHMgOiBTdGF0ZSgpO1xyXG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbih2LCBmLCBvLCBvcHQpe1xyXG5cdFx0XHRcdFx0aWYoIWNiKXtcclxuXHRcdFx0XHRcdFx0bWFwLmNhbGwoe286IG8sIHM6IHN9LCB2LGYpO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNiLmNhbGwoYXMgfHwgdGhpcyB8fCB7fSwgdiwgZiwgbywgb3B0KTtcclxuXHRcdFx0XHRcdGlmKG9ial9oYXMobyxmKSAmJiB1ID09PSBvW2ZdKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdG1hcC5jYWxsKHtvOiBvLCBzOiBzfSwgdixmKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbWFwKHYsZil7XHJcblx0XHRcdFx0aWYoTl8gPT09IGYpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFN0YXRlLmlmeSh0aGlzLm8sIGYsIHRoaXMucykgO1xyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0dmFyIG9iaiA9IFR5cGUub2JqLCBvYmpfYXMgPSBvYmouYXMsIG9ial9oYXMgPSBvYmouaGFzLCBvYmpfaXMgPSBvYmouaXMsIG9ial9tYXAgPSBvYmoubWFwLCBvYmpfY29weSA9IG9iai5jb3B5O1xyXG5cdFx0dmFyIG51bSA9IFR5cGUubnVtLCBudW1faXMgPSBudW0uaXM7XHJcblx0XHR2YXIgZm4gPSBUeXBlLmZuLCBmbl9pcyA9IGZuLmlzO1xyXG5cdFx0dmFyIE5fID0gTm9kZS5fLCB1O1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBTdGF0ZTtcclxuXHR9KShyZXF1aXJlLCAnLi9zdGF0ZScpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIFR5cGUgPSByZXF1aXJlKCcuL3R5cGUnKTtcclxuXHRcdHZhciBWYWwgPSByZXF1aXJlKCcuL3ZhbCcpO1xyXG5cdFx0dmFyIE5vZGUgPSByZXF1aXJlKCcuL25vZGUnKTtcclxuXHRcdHZhciBHcmFwaCA9IHt9O1xyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRHcmFwaC5pcyA9IGZ1bmN0aW9uKGcsIGNiLCBmbiwgYXMpeyAvLyBjaGVja3MgdG8gc2VlIGlmIGFuIG9iamVjdCBpcyBhIHZhbGlkIGdyYXBoLlxyXG5cdFx0XHRcdGlmKCFnIHx8ICFvYmpfaXMoZykgfHwgb2JqX2VtcHR5KGcpKXsgcmV0dXJuIGZhbHNlIH0gLy8gbXVzdCBiZSBhbiBvYmplY3QuXHJcblx0XHRcdFx0cmV0dXJuICFvYmpfbWFwKGcsIG1hcCwge2NiOmNiLGZuOmZuLGFzOmFzfSk7IC8vIG1ha2VzIHN1cmUgaXQgd2Fzbid0IGFuIGVtcHR5IG9iamVjdC5cclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBtYXAobiwgcyl7IC8vIHdlIGludmVydCB0aGlzIGJlY2F1c2UgdGhlIHdheSc/IHdlIGNoZWNrIGZvciB0aGlzIGlzIHZpYSBhIG5lZ2F0aW9uLlxyXG5cdFx0XHRcdGlmKCFuIHx8IHMgIT09IE5vZGUuc291bChuKSB8fCAhTm9kZS5pcyhuLCB0aGlzLmZuLCB0aGlzLmFzKSl7IHJldHVybiB0cnVlIH0gLy8gaXQgaXMgdHJ1ZSB0aGF0IHRoaXMgaXMgYW4gaW52YWxpZCBncmFwaC5cclxuXHRcdFx0XHRpZighdGhpcy5jYil7IHJldHVybiB9XHJcblx0XHRcdFx0bmYubiA9IG47IG5mLmFzID0gdGhpcy5hczsgLy8gc2VxdWVudGlhbCByYWNlIGNvbmRpdGlvbnMgYXJlbid0IHJhY2VzLlxyXG5cdFx0XHRcdHRoaXMuY2IuY2FsbChuZi5hcywgbiwgcywgbmYpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG5mKGZuKXsgLy8gb3B0aW9uYWwgY2FsbGJhY2sgZm9yIGVhY2ggbm9kZS5cclxuXHRcdFx0XHRpZihmbil7IE5vZGUuaXMobmYubiwgZm4sIG5mLmFzKSB9IC8vIHdoZXJlIHdlIHRoZW4gaGF2ZSBhbiBvcHRpb25hbCBjYWxsYmFjayBmb3IgZWFjaCBmaWVsZC92YWx1ZS5cclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0R3JhcGguaWZ5ID0gZnVuY3Rpb24ob2JqLCBlbnYsIGFzKXtcclxuXHRcdFx0XHR2YXIgYXQgPSB7cGF0aDogW10sIG9iajogb2JqfTtcclxuXHRcdFx0XHRpZighZW52KXtcclxuXHRcdFx0XHRcdGVudiA9IHt9O1xyXG5cdFx0XHRcdH0gZWxzZVxyXG5cdFx0XHRcdGlmKHR5cGVvZiBlbnYgPT09ICdzdHJpbmcnKXtcclxuXHRcdFx0XHRcdGVudiA9IHtzb3VsOiBlbnZ9O1xyXG5cdFx0XHRcdH0gZWxzZVxyXG5cdFx0XHRcdGlmKGVudiBpbnN0YW5jZW9mIEZ1bmN0aW9uKXtcclxuXHRcdFx0XHRcdGVudi5tYXAgPSBlbnY7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGVudi5zb3VsKXtcclxuXHRcdFx0XHRcdGF0LnJlbCA9IFZhbC5yZWwuaWZ5KGVudi5zb3VsKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZW52LmdyYXBoID0gZW52LmdyYXBoIHx8IHt9O1xyXG5cdFx0XHRcdGVudi5zZWVuID0gZW52LnNlZW4gfHwgW107XHJcblx0XHRcdFx0ZW52LmFzID0gZW52LmFzIHx8IGFzO1xyXG5cdFx0XHRcdG5vZGUoZW52LCBhdCk7XHJcblx0XHRcdFx0ZW52LnJvb3QgPSBhdC5ub2RlO1xyXG5cdFx0XHRcdHJldHVybiBlbnYuZ3JhcGg7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbm9kZShlbnYsIGF0KXsgdmFyIHRtcDtcclxuXHRcdFx0XHRpZih0bXAgPSBzZWVuKGVudiwgYXQpKXsgcmV0dXJuIHRtcCB9XHJcblx0XHRcdFx0YXQuZW52ID0gZW52O1xyXG5cdFx0XHRcdGF0LnNvdWwgPSBzb3VsO1xyXG5cdFx0XHRcdGlmKE5vZGUuaWZ5KGF0Lm9iaiwgbWFwLCBhdCkpe1xyXG5cdFx0XHRcdFx0Ly9hdC5yZWwgPSBhdC5yZWwgfHwgVmFsLnJlbC5pZnkoTm9kZS5zb3VsKGF0Lm5vZGUpKTtcclxuXHRcdFx0XHRcdGVudi5ncmFwaFtWYWwucmVsLmlzKGF0LnJlbCldID0gYXQubm9kZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGF0O1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcCh2LGYsbil7XHJcblx0XHRcdFx0dmFyIGF0ID0gdGhpcywgZW52ID0gYXQuZW52LCBpcywgdG1wO1xyXG5cdFx0XHRcdGlmKE5vZGUuXyA9PT0gZiAmJiBvYmpfaGFzKHYsVmFsLnJlbC5fKSl7XHJcblx0XHRcdFx0XHRyZXR1cm4gbi5fOyAvLyBUT0RPOiBCdWc/XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKCEoaXMgPSB2YWxpZCh2LGYsbiwgYXQsZW52KSkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGlmKCFmKXtcclxuXHRcdFx0XHRcdGF0Lm5vZGUgPSBhdC5ub2RlIHx8IG4gfHwge307XHJcblx0XHRcdFx0XHRpZihvYmpfaGFzKHYsIE5vZGUuXykpe1xyXG5cdFx0XHRcdFx0XHRhdC5ub2RlLl8gPSBvYmpfY29weSh2Ll8pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YXQubm9kZSA9IE5vZGUuc291bC5pZnkoYXQubm9kZSwgVmFsLnJlbC5pcyhhdC5yZWwpKTtcclxuXHRcdFx0XHRcdGF0LnJlbCA9IGF0LnJlbCB8fCBWYWwucmVsLmlmeShOb2RlLnNvdWwoYXQubm9kZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZih0bXAgPSBlbnYubWFwKXtcclxuXHRcdFx0XHRcdHRtcC5jYWxsKGVudi5hcyB8fCB7fSwgdixmLG4sIGF0KTtcclxuXHRcdFx0XHRcdGlmKG9ial9oYXMobixmKSl7XHJcblx0XHRcdFx0XHRcdHYgPSBuW2ZdO1xyXG5cdFx0XHRcdFx0XHRpZih1ID09PSB2KXtcclxuXHRcdFx0XHRcdFx0XHRvYmpfZGVsKG4sIGYpO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZighKGlzID0gdmFsaWQodixmLG4sIGF0LGVudikpKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoIWYpeyByZXR1cm4gYXQubm9kZSB9XHJcblx0XHRcdFx0aWYodHJ1ZSA9PT0gaXMpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHY7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRtcCA9IG5vZGUoZW52LCB7b2JqOiB2LCBwYXRoOiBhdC5wYXRoLmNvbmNhdChmKX0pO1xyXG5cdFx0XHRcdGlmKCF0bXAubm9kZSl7IHJldHVybiB9XHJcblx0XHRcdFx0cmV0dXJuIHRtcC5yZWw7IC8veycjJzogTm9kZS5zb3VsKHRtcC5ub2RlKX07XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gc291bChpZCl7IHZhciBhdCA9IHRoaXM7XHJcblx0XHRcdFx0dmFyIHByZXYgPSBWYWwucmVsLmlzKGF0LnJlbCksIGdyYXBoID0gYXQuZW52LmdyYXBoO1xyXG5cdFx0XHRcdGF0LnJlbCA9IGF0LnJlbCB8fCBWYWwucmVsLmlmeShpZCk7XHJcblx0XHRcdFx0YXQucmVsW1ZhbC5yZWwuX10gPSBpZDtcclxuXHRcdFx0XHRpZihhdC5ub2RlICYmIGF0Lm5vZGVbTm9kZS5fXSl7XHJcblx0XHRcdFx0XHRhdC5ub2RlW05vZGUuX11bVmFsLnJlbC5fXSA9IGlkO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihvYmpfaGFzKGdyYXBoLCBwcmV2KSl7XHJcblx0XHRcdFx0XHRncmFwaFtpZF0gPSBncmFwaFtwcmV2XTtcclxuXHRcdFx0XHRcdG9ial9kZWwoZ3JhcGgsIHByZXYpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiB2YWxpZCh2LGYsbiwgYXQsZW52KXsgdmFyIHRtcDtcclxuXHRcdFx0XHRpZihWYWwuaXModikpeyByZXR1cm4gdHJ1ZSB9XHJcblx0XHRcdFx0aWYob2JqX2lzKHYpKXsgcmV0dXJuIDEgfVxyXG5cdFx0XHRcdGlmKHRtcCA9IGVudi5pbnZhbGlkKXtcclxuXHRcdFx0XHRcdHYgPSB0bXAuY2FsbChlbnYuYXMgfHwge30sIHYsZixuKTtcclxuXHRcdFx0XHRcdHJldHVybiB2YWxpZCh2LGYsbiwgYXQsZW52KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZW52LmVyciA9IFwiSW52YWxpZCB2YWx1ZSBhdCAnXCIgKyBhdC5wYXRoLmNvbmNhdChmKS5qb2luKCcuJykgKyBcIichXCI7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gc2VlbihlbnYsIGF0KXtcclxuXHRcdFx0XHR2YXIgYXJyID0gZW52LnNlZW4sIGkgPSBhcnIubGVuZ3RoLCBoYXM7XHJcblx0XHRcdFx0d2hpbGUoaS0tKXsgaGFzID0gYXJyW2ldO1xyXG5cdFx0XHRcdFx0aWYoYXQub2JqID09PSBoYXMub2JqKXsgcmV0dXJuIGhhcyB9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGFyci5wdXNoKGF0KTtcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdEdyYXBoLm5vZGUgPSBmdW5jdGlvbihub2RlKXtcclxuXHRcdFx0dmFyIHNvdWwgPSBOb2RlLnNvdWwobm9kZSk7XHJcblx0XHRcdGlmKCFzb3VsKXsgcmV0dXJuIH1cclxuXHRcdFx0cmV0dXJuIG9ial9wdXQoe30sIHNvdWwsIG5vZGUpO1xyXG5cdFx0fVxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRHcmFwaC50byA9IGZ1bmN0aW9uKGdyYXBoLCByb290LCBvcHQpe1xyXG5cdFx0XHRcdGlmKCFncmFwaCl7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIG9iaiA9IHt9O1xyXG5cdFx0XHRcdG9wdCA9IG9wdCB8fCB7c2Vlbjoge319O1xyXG5cdFx0XHRcdG9ial9tYXAoZ3JhcGhbcm9vdF0sIG1hcCwge29iajpvYmosIGdyYXBoOiBncmFwaCwgb3B0OiBvcHR9KTtcclxuXHRcdFx0XHRyZXR1cm4gb2JqO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcCh2LGYpeyB2YXIgdG1wLCBvYmo7XHJcblx0XHRcdFx0aWYoTm9kZS5fID09PSBmKXtcclxuXHRcdFx0XHRcdGlmKG9ial9lbXB0eSh2LCBWYWwucmVsLl8pKXtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dGhpcy5vYmpbZl0gPSBvYmpfY29weSh2KTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoISh0bXAgPSBWYWwucmVsLmlzKHYpKSl7XHJcblx0XHRcdFx0XHR0aGlzLm9ialtmXSA9IHY7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKG9iaiA9IHRoaXMub3B0LnNlZW5bdG1wXSl7XHJcblx0XHRcdFx0XHR0aGlzLm9ialtmXSA9IG9iajtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5vYmpbZl0gPSB0aGlzLm9wdC5zZWVuW3RtcF0gPSBHcmFwaC50byh0aGlzLmdyYXBoLCB0bXAsIHRoaXMub3B0KTtcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdHZhciBmbl9pcyA9IFR5cGUuZm4uaXM7XHJcblx0XHR2YXIgb2JqID0gVHlwZS5vYmosIG9ial9pcyA9IG9iai5pcywgb2JqX2RlbCA9IG9iai5kZWwsIG9ial9oYXMgPSBvYmouaGFzLCBvYmpfZW1wdHkgPSBvYmouZW1wdHksIG9ial9wdXQgPSBvYmoucHV0LCBvYmpfbWFwID0gb2JqLm1hcCwgb2JqX2NvcHkgPSBvYmouY29weTtcclxuXHRcdHZhciB1O1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBHcmFwaDtcclxuXHR9KShyZXF1aXJlLCAnLi9ncmFwaCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIFR5cGUgPSByZXF1aXJlKCcuL3R5cGUnKTtcclxuXHRcdGZ1bmN0aW9uIER1cCgpe1xyXG5cdFx0XHR0aGlzLmNhY2hlID0ge307XHJcblx0XHR9XHJcblx0XHREdXAucHJvdG90eXBlLnRyYWNrID0gZnVuY3Rpb24oaWQpe1xyXG5cdFx0XHR0aGlzLmNhY2hlW2lkXSA9IFR5cGUudGltZS5pcygpO1xyXG5cdFx0XHRpZiAoIXRoaXMudG8pIHtcclxuXHRcdFx0XHR0aGlzLmdjKCk7IC8vIEVuZ2FnZSBHQy5cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gaWQ7XHJcblx0XHR9O1xyXG5cdFx0RHVwLnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGlkKXtcclxuXHRcdFx0Ly8gSGF2ZSB3ZSBzZWVuIHRoaXMgSUQgcmVjZW50bHk/XHJcblx0XHRcdHJldHVybiBUeXBlLm9iai5oYXModGhpcy5jYWNoZSwgaWQpPyB0aGlzLnRyYWNrKGlkKSA6IGZhbHNlOyAvLyBJbXBvcnRhbnQsIGJ1bXAgdGhlIElEJ3MgbGl2ZWxpbmVzcyBpZiBpdCBoYXMgYWxyZWFkeSBiZWVuIHNlZW4gYmVmb3JlIC0gdGhpcyBpcyBjcml0aWNhbCB0byBzdG9wcGluZyBicm9hZGNhc3Qgc3Rvcm1zLlxyXG5cdFx0fVxyXG5cdFx0RHVwLnByb3RvdHlwZS5nYyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBkZSA9IHRoaXMsIG5vdyA9IFR5cGUudGltZS5pcygpLCBvbGRlc3QgPSBub3csIG1heEFnZSA9IDUgKiA2MCAqIDEwMDA7XHJcblx0XHRcdC8vIFRPRE86IEd1bi5zY2hlZHVsZXIgYWxyZWFkeSBkb2VzIHRoaXM/IFJldXNlIHRoYXQuXHJcblx0XHRcdFR5cGUub2JqLm1hcChkZS5jYWNoZSwgZnVuY3Rpb24odGltZSwgaWQpe1xyXG5cdFx0XHRcdG9sZGVzdCA9IE1hdGgubWluKG5vdywgdGltZSk7XHJcblx0XHRcdFx0aWYgKChub3cgLSB0aW1lKSA8IG1heEFnZSl7IHJldHVybiB9XHJcblx0XHRcdFx0VHlwZS5vYmouZGVsKGRlLmNhY2hlLCBpZCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHR2YXIgZG9uZSA9IFR5cGUub2JqLmVtcHR5KGRlLmNhY2hlKTtcclxuXHRcdFx0aWYoZG9uZSl7XHJcblx0XHRcdFx0ZGUudG8gPSBudWxsOyAvLyBEaXNlbmdhZ2UgR0MuXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBlbGFwc2VkID0gbm93IC0gb2xkZXN0OyAvLyBKdXN0IGhvdyBvbGQ/XHJcblx0XHRcdHZhciBuZXh0R0MgPSBtYXhBZ2UgLSBlbGFwc2VkOyAvLyBIb3cgbG9uZyBiZWZvcmUgaXQncyB0b28gb2xkP1xyXG5cdFx0XHRkZS50byA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgZGUuZ2MoKSB9LCBuZXh0R0MpOyAvLyBTY2hlZHVsZSB0aGUgbmV4dCBHQyBldmVudC5cclxuXHRcdH1cclxuXHRcdG1vZHVsZS5leHBvcnRzID0gRHVwO1xyXG5cdH0pKHJlcXVpcmUsICcuL2R1cCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cclxuXHRcdGZ1bmN0aW9uIEd1bihvKXtcclxuXHRcdFx0aWYobyBpbnN0YW5jZW9mIEd1bil7IHJldHVybiAodGhpcy5fID0ge2d1bjogdGhpc30pLmd1biB9XHJcblx0XHRcdGlmKCEodGhpcyBpbnN0YW5jZW9mIEd1bikpeyByZXR1cm4gbmV3IEd1bihvKSB9XHJcblx0XHRcdHJldHVybiBHdW4uY3JlYXRlKHRoaXMuXyA9IHtndW46IHRoaXMsIG9wdDogb30pO1xyXG5cdFx0fVxyXG5cclxuXHRcdEd1bi5pcyA9IGZ1bmN0aW9uKGd1bil7IHJldHVybiAoZ3VuIGluc3RhbmNlb2YgR3VuKSB9XHJcblxyXG5cdFx0R3VuLnZlcnNpb24gPSAwLjc7XHJcblxyXG5cdFx0R3VuLmNoYWluID0gR3VuLnByb3RvdHlwZTtcclxuXHRcdEd1bi5jaGFpbi50b0pTT04gPSBmdW5jdGlvbigpe307XHJcblxyXG5cdFx0dmFyIFR5cGUgPSByZXF1aXJlKCcuL3R5cGUnKTtcclxuXHRcdFR5cGUub2JqLnRvKFR5cGUsIEd1bik7XHJcblx0XHRHdW4uSEFNID0gcmVxdWlyZSgnLi9IQU0nKTtcclxuXHRcdEd1bi52YWwgPSByZXF1aXJlKCcuL3ZhbCcpO1xyXG5cdFx0R3VuLm5vZGUgPSByZXF1aXJlKCcuL25vZGUnKTtcclxuXHRcdEd1bi5zdGF0ZSA9IHJlcXVpcmUoJy4vc3RhdGUnKTtcclxuXHRcdEd1bi5ncmFwaCA9IHJlcXVpcmUoJy4vZ3JhcGgnKTtcclxuXHRcdEd1bi5kdXAgPSByZXF1aXJlKCcuL2R1cCcpO1xyXG5cdFx0R3VuLnNjaGVkdWxlID0gcmVxdWlyZSgnLi9zY2hlZHVsZScpO1xyXG5cdFx0R3VuLm9uID0gcmVxdWlyZSgnLi9vbmlmeScpKCk7XHJcblx0XHRcclxuXHRcdEd1bi5fID0geyAvLyBzb21lIHJlc2VydmVkIGtleSB3b3JkcywgdGhlc2UgYXJlIG5vdCB0aGUgb25seSBvbmVzLlxyXG5cdFx0XHRub2RlOiBHdW4ubm9kZS5fIC8vIGFsbCBtZXRhZGF0YSBvZiBhIG5vZGUgaXMgc3RvcmVkIGluIHRoZSBtZXRhIHByb3BlcnR5IG9uIHRoZSBub2RlLlxyXG5cdFx0XHQsc291bDogR3VuLnZhbC5yZWwuXyAvLyBhIHNvdWwgaXMgYSBVVUlEIG9mIGEgbm9kZSBidXQgaXQgYWx3YXlzIHBvaW50cyB0byB0aGUgXCJsYXRlc3RcIiBkYXRhIGtub3duLlxyXG5cdFx0XHQsc3RhdGU6IEd1bi5zdGF0ZS5fIC8vIG90aGVyIHRoYW4gdGhlIHNvdWwsIHdlIHN0b3JlIEhBTSBtZXRhZGF0YS5cclxuXHRcdFx0LGZpZWxkOiAnLicgLy8gYSBmaWVsZCBpcyBhIHByb3BlcnR5IG9uIGEgbm9kZSB3aGljaCBwb2ludHMgdG8gYSB2YWx1ZS5cclxuXHRcdFx0LHZhbHVlOiAnPScgLy8gdGhlIHByaW1pdGl2ZSB2YWx1ZS5cclxuXHRcdH1cclxuXHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdEd1bi5jcmVhdGUgPSBmdW5jdGlvbihhdCl7XHJcblx0XHRcdFx0YXQub24gPSBhdC5vbiB8fCBHdW4ub247XHJcblx0XHRcdFx0YXQucm9vdCA9IGF0LnJvb3QgfHwgYXQuZ3VuO1xyXG5cdFx0XHRcdGF0LmdyYXBoID0gYXQuZ3JhcGggfHwge307XHJcblx0XHRcdFx0YXQuZHVwID0gYXQuZHVwIHx8IG5ldyBHdW4uZHVwO1xyXG5cdFx0XHRcdGF0LmFzayA9IEd1bi5vbi5hc2s7XHJcblx0XHRcdFx0YXQuYWNrID0gR3VuLm9uLmFjaztcclxuXHRcdFx0XHR2YXIgZ3VuID0gYXQuZ3VuLm9wdChhdC5vcHQpO1xyXG5cdFx0XHRcdGlmKCFhdC5vbmNlKXtcclxuXHRcdFx0XHRcdGF0Lm9uKCdpbicsIHJvb3QsIGF0KTtcclxuXHRcdFx0XHRcdGF0Lm9uKCdvdXQnLCByb290LCBhdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGF0Lm9uY2UgPSAxO1xyXG5cdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gcm9vdChhdCl7XHJcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcImFkZCB0by5uZXh0KGF0KVwiKTsgLy8gVE9ETzogQlVHISEhXHJcblx0XHRcdFx0dmFyIGV2ID0gdGhpcywgY2F0ID0gZXYuYXMsIGNvYXQ7XHJcblx0XHRcdFx0aWYoIWF0Lmd1bil7IGF0Lmd1biA9IGNhdC5ndW4gfVxyXG5cdFx0XHRcdGlmKCFhdFsnIyddKXsgYXRbJyMnXSA9IEd1bi50ZXh0LnJhbmRvbSgpIH0gLy8gVE9ETzogVXNlIHdoYXQgaXMgdXNlZCBvdGhlciBwbGFjZXMgaW5zdGVhZC5cclxuXHRcdFx0XHRpZihjYXQuZHVwLmNoZWNrKGF0WycjJ10pKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRpZihhdFsnQCddKXtcclxuXHRcdFx0XHRcdC8vIFRPRE86IEJVRyEgRm9yIG11bHRpLWluc3RhbmNlcywgdGhlIFwiYWNrXCIgc3lzdGVtIGlzIGdsb2JhbGx5IHNoYXJlZCwgYnV0IGl0IHNob3VsZG4ndCBiZS5cclxuXHRcdFx0XHRcdGlmKGNhdC5hY2soYXRbJ0AnXSwgYXQpKXsgcmV0dXJuIH0gLy8gVE9ETzogQ29uc2lkZXIgbm90IHJldHVybmluZyBoZXJlLCBtYXliZSwgd2hlcmUgdGhpcyB3b3VsZCBsZXQgdGhlIFwiaGFuZHNoYWtlXCIgb24gc3luYyBvY2N1ciBmb3IgSG9seSBHcmFpbD9cclxuXHRcdFx0XHRcdGNhdC5kdXAudHJhY2soYXRbJyMnXSk7XHJcblx0XHRcdFx0XHRHdW4ub24oJ291dCcsIG9ial90byhhdCwge2d1bjogY2F0Lmd1bn0pKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2F0LmR1cC50cmFjayhhdFsnIyddKTtcclxuXHRcdFx0XHQvL2lmKGNhdC5hY2soYXRbJ0AnXSwgYXQpKXsgcmV0dXJuIH1cclxuXHRcdFx0XHQvL2NhdC5hY2soYXRbJ0AnXSwgYXQpO1xyXG5cdFx0XHRcdGNvYXQgPSBvYmpfdG8oYXQsIHtndW46IGNhdC5ndW59KTtcclxuXHRcdFx0XHRpZihhdC5nZXQpe1xyXG5cdFx0XHRcdFx0Ly9HdW4ub24uR0VUKGNvYXQpO1xyXG5cdFx0XHRcdFx0R3VuLm9uKCdnZXQnLCBjb2F0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoYXQucHV0KXtcclxuXHRcdFx0XHRcdC8vR3VuLm9uLlBVVChjb2F0KTtcclxuXHRcdFx0XHRcdEd1bi5vbigncHV0JywgY29hdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdEd1bi5vbignb3V0JywgY29hdCk7XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRHdW4ub24oJ3B1dCcsIGZ1bmN0aW9uKGF0KXtcclxuXHRcdFx0Ly9HdW4ub24uUFVUID0gZnVuY3Rpb24oYXQpe1xyXG5cdFx0XHRcdGlmKCFhdFsnIyddKXsgcmV0dXJuIHRoaXMudG8ubmV4dChhdCkgfSAvLyBmb3IgdGVzdHMuXHJcblx0XHRcdFx0dmFyIGV2ID0gdGhpcywgY3R4ID0ge2d1bjogYXQuZ3VuLCBncmFwaDogYXQuZ3VuLl8uZ3JhcGgsIHB1dDoge30sIG1hcDoge30sIG1hY2hpbmU6IEd1bi5zdGF0ZSgpfTtcclxuXHRcdFx0XHRpZighR3VuLmdyYXBoLmlzKGF0LnB1dCwgbnVsbCwgdmVyaWZ5LCBjdHgpKXsgY3R4LmVyciA9IFwiRXJyb3I6IEludmFsaWQgZ3JhcGghXCIgfVxyXG5cdFx0XHRcdGlmKGN0eC5lcnIpeyByZXR1cm4gY3R4Lmd1bi5vbignaW4nLCB7J0AnOiBhdFsnIyddLCBlcnI6IEd1bi5sb2coY3R4LmVycikgfSkgfVxyXG5cdFx0XHRcdG9ial9tYXAoY3R4LnB1dCwgbWVyZ2UsIGN0eCk7XHJcblx0XHRcdFx0b2JqX21hcChjdHgubWFwLCBtYXAsIGN0eCk7XHJcblx0XHRcdFx0aWYodSAhPT0gY3R4LmRlZmVyKXtcclxuXHRcdFx0XHRcdEd1bi5zY2hlZHVsZShjdHguZGVmZXIsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRcdEd1bi5vbigncHV0JywgYXQpO1xyXG5cdFx0XHRcdFx0fSwgR3VuLnN0YXRlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoIWN0eC5kaWZmKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRldi50by5uZXh0KG9ial90byhhdCwge3B1dDogY3R4LmRpZmZ9KSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRmdW5jdGlvbiB2ZXJpZnkodmFsLCBrZXksIG5vZGUsIHNvdWwpeyB2YXIgY3R4ID0gdGhpcztcclxuXHRcdFx0XHR2YXIgc3RhdGUgPSBHdW4uc3RhdGUuaXMobm9kZSwga2V5KSwgdG1wO1xyXG5cdFx0XHRcdGlmKCFzdGF0ZSl7IHJldHVybiBjdHguZXJyID0gXCJFcnJvcjogTm8gc3RhdGUgb24gJ1wiK2tleStcIicgaW4gbm9kZSAnXCIrc291bCtcIichXCIgfVxyXG5cdFx0XHRcdHZhciB2ZXJ0ZXggPSBjdHguZ3JhcGhbc291bF0gfHwgZW1wdHksIHdhcyA9IEd1bi5zdGF0ZS5pcyh2ZXJ0ZXgsIGtleSwgdHJ1ZSksIGtub3duID0gdmVydGV4W2tleV07XHJcblx0XHRcdFx0dmFyIEhBTSA9IEd1bi5IQU0oY3R4Lm1hY2hpbmUsIHN0YXRlLCB3YXMsIHZhbCwga25vd24pO1xyXG5cdFx0XHRcdGlmKCFIQU0uaW5jb21pbmcpe1xyXG5cdFx0XHRcdFx0aWYoSEFNLmRlZmVyKXsgLy8gcGljayB0aGUgbG93ZXN0XHJcblx0XHRcdFx0XHRcdGN0eC5kZWZlciA9IChzdGF0ZSA8IChjdHguZGVmZXIgfHwgSW5maW5pdHkpKT8gc3RhdGUgOiBjdHguZGVmZXI7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGN0eC5wdXRbc291bF0gPSBHdW4uc3RhdGUudG8obm9kZSwga2V5LCBjdHgucHV0W3NvdWxdKTtcclxuXHRcdFx0XHQoY3R4LmRpZmYgfHwgKGN0eC5kaWZmID0ge30pKVtzb3VsXSA9IEd1bi5zdGF0ZS50byhub2RlLCBrZXksIGN0eC5kaWZmW3NvdWxdKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBtZXJnZShub2RlLCBzb3VsKXtcclxuXHRcdFx0XHR2YXIgcmVmID0gKCh0aGlzLmd1bi5fKS5uZXh0IHx8IGVtcHR5KVtzb3VsXTtcclxuXHRcdFx0XHRpZighcmVmKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgYXQgPSB0aGlzLm1hcFtzb3VsXSA9IHtcclxuXHRcdFx0XHRcdHB1dDogdGhpcy5ub2RlID0gbm9kZSxcclxuXHRcdFx0XHRcdGdldDogdGhpcy5zb3VsID0gc291bCxcclxuXHRcdFx0XHRcdGd1bjogdGhpcy5yZWYgPSByZWZcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdG9ial9tYXAobm9kZSwgZWFjaCwgdGhpcyk7XHJcblx0XHRcdFx0R3VuLm9uKCdub2RlJywgYXQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIGVhY2godmFsLCBrZXkpe1xyXG5cdFx0XHRcdHZhciBncmFwaCA9IHRoaXMuZ3JhcGgsIHNvdWwgPSB0aGlzLnNvdWwsIGNhdCA9ICh0aGlzLnJlZi5fKSwgdG1wO1xyXG5cdFx0XHRcdGdyYXBoW3NvdWxdID0gR3VuLnN0YXRlLnRvKHRoaXMubm9kZSwga2V5LCBncmFwaFtzb3VsXSk7XHJcblx0XHRcdFx0KGNhdC5wdXQgfHwgKGNhdC5wdXQgPSB7fSkpW2tleV0gPSB2YWw7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbWFwKGF0LCBzb3VsKXtcclxuXHRcdFx0XHRpZighYXQuZ3VuKXsgcmV0dXJuIH1cclxuXHRcdFx0XHQoYXQuZ3VuLl8pLm9uKCdpbicsIGF0KTtcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdEd1bi5vbignZ2V0JywgZnVuY3Rpb24oYXQpe1xyXG5cdFx0XHRcdHZhciBldiA9IHRoaXMsIHNvdWwgPSBhdC5nZXRbX3NvdWxdLCBjYXQgPSBhdC5ndW4uXywgbm9kZSA9IGNhdC5ncmFwaFtzb3VsXSwgZmllbGQgPSBhdC5nZXRbX2ZpZWxkXSwgdG1wO1xyXG5cdFx0XHRcdHZhciBuZXh0ID0gY2F0Lm5leHQgfHwgKGNhdC5uZXh0ID0ge30pLCBhcyA9ICgobmV4dFtzb3VsXSB8fCBlbXB0eSkuXyk7XHJcblx0XHRcdFx0aWYoIW5vZGUgfHwgIWFzKXsgcmV0dXJuIGV2LnRvLm5leHQoYXQpIH1cclxuXHRcdFx0XHRpZihmaWVsZCl7XHJcblx0XHRcdFx0XHRpZighb2JqX2hhcyhub2RlLCBmaWVsZCkpeyByZXR1cm4gZXYudG8ubmV4dChhdCkgfVxyXG5cdFx0XHRcdFx0bm9kZSA9IEd1bi5zdGF0ZS50byhub2RlLCBmaWVsZCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdG5vZGUgPSBHdW4ub2JqLmNvcHkobm9kZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vaWYoYXQuZ3VuID09PSBjYXQuZ3VuKXtcclxuXHRcdFx0XHRcdG5vZGUgPSBHdW4uZ3JhcGgubm9kZShub2RlKTsgLy8gVE9ETzogQlVHISBDbG9uZSBub2RlP1xyXG5cdFx0XHRcdC8vfSBlbHNlIHtcclxuXHRcdFx0XHQvL1x0Y2F0ID0gKGF0Lmd1bi5fKTtcclxuXHRcdFx0XHQvL31cclxuXHRcdFx0XHR0bXAgPSBhcy5hY2s7XHJcblx0XHRcdFx0Y2F0Lm9uKCdpbicsIHtcclxuXHRcdFx0XHRcdCdAJzogYXRbJyMnXSxcclxuXHRcdFx0XHRcdGhvdzogJ21lbScsXHJcblx0XHRcdFx0XHRwdXQ6IG5vZGUsXHJcblx0XHRcdFx0XHRndW46IGFzLmd1blxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdGlmKDAgPCB0bXApe1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRldi50by5uZXh0KGF0KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KCkpO1xyXG5cdFx0XHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdEd1bi5vbi5hc2sgPSBmdW5jdGlvbihjYiwgYXMpe1xyXG5cdFx0XHRcdGlmKCF0aGlzLm9uKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgaWQgPSBHdW4udGV4dC5yYW5kb20oKTtcclxuXHRcdFx0XHRpZihjYil7IHRoaXMub24oaWQsIGNiLCBhcykgfVxyXG5cdFx0XHRcdHJldHVybiBpZDtcclxuXHRcdFx0fVxyXG5cdFx0XHRHdW4ub24uYWNrID0gZnVuY3Rpb24oYXQsIHJlcGx5KXtcclxuXHRcdFx0XHRpZighYXQgfHwgIXJlcGx5IHx8ICF0aGlzLm9uKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgaWQgPSBhdFsnIyddIHx8IGF0O1xyXG5cdFx0XHRcdGlmKCF0aGlzLnRhZyB8fCAhdGhpcy50YWdbaWRdKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR0aGlzLm9uKGlkLCByZXBseSk7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRHdW4uY2hhaW4ub3B0ID0gZnVuY3Rpb24ob3B0KXtcclxuXHRcdFx0XHRvcHQgPSBvcHQgfHwge307XHJcblx0XHRcdFx0dmFyIGd1biA9IHRoaXMsIGF0ID0gZ3VuLl8sIHRtcCA9IG9wdC5wZWVycyB8fCBvcHQ7XHJcblx0XHRcdFx0aWYoIW9ial9pcyhvcHQpKXsgb3B0ID0ge30gfVxyXG5cdFx0XHRcdGlmKCFvYmpfaXMoYXQub3B0KSl7IGF0Lm9wdCA9IG9wdCB9XHJcblx0XHRcdFx0aWYodGV4dF9pcyh0bXApKXsgdG1wID0gW3RtcF0gfVxyXG5cdFx0XHRcdGlmKGxpc3RfaXModG1wKSl7XHJcblx0XHRcdFx0XHR0bXAgPSBvYmpfbWFwKHRtcCwgZnVuY3Rpb24odXJsLCBpLCBtYXApe1xyXG5cdFx0XHRcdFx0XHRtYXAodXJsLCB7dXJsOiB1cmx9KTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0aWYoIW9ial9pcyhhdC5vcHQucGVlcnMpKXsgYXQub3B0LnBlZXJzID0ge319XHJcblx0XHRcdFx0XHRhdC5vcHQucGVlcnMgPSBvYmpfdG8odG1wLCBhdC5vcHQucGVlcnMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRhdC5vcHQud3NjID0gYXQub3B0LndzYyB8fCB7cHJvdG9jb2xzOm51bGx9IFxyXG5cdFx0XHRcdGF0Lm9wdC5wZWVycyA9IGF0Lm9wdC5wZWVycyB8fCB7fTtcclxuXHRcdFx0XHRvYmpfdG8ob3B0LCBhdC5vcHQpOyAvLyBjb3BpZXMgb3B0aW9ucyBvbiB0byBgYXQub3B0YCBvbmx5IGlmIG5vdCBhbHJlYWR5IHRha2VuLlxyXG5cdFx0XHRcdEd1bi5vbignb3B0JywgYXQpO1xyXG5cdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblxyXG5cdFx0dmFyIHRleHRfaXMgPSBHdW4udGV4dC5pcztcclxuXHRcdHZhciBsaXN0X2lzID0gR3VuLmxpc3QuaXM7XHJcblx0XHR2YXIgb2JqID0gR3VuLm9iaiwgb2JqX2lzID0gb2JqLmlzLCBvYmpfaGFzID0gb2JqLmhhcywgb2JqX3RvID0gb2JqLnRvLCBvYmpfbWFwID0gb2JqLm1hcCwgb2JqX2NvcHkgPSBvYmouY29weTtcclxuXHRcdHZhciBfc291bCA9IEd1bi5fLnNvdWwsIF9maWVsZCA9IEd1bi5fLmZpZWxkLCByZWxfaXMgPSBHdW4udmFsLnJlbC5pcztcclxuXHRcdHZhciBlbXB0eSA9IHt9LCB1O1xyXG5cclxuXHRcdGNvbnNvbGUuZGVidWcgPSBmdW5jdGlvbihpLCBzKXsgcmV0dXJuIChjb25zb2xlLmRlYnVnLmkgJiYgaSA9PT0gY29uc29sZS5kZWJ1Zy5pICYmIGNvbnNvbGUuZGVidWcuaSsrKSAmJiAoY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKSB8fCBzKSB9O1xyXG5cclxuXHRcdEd1bi5sb2cgPSBmdW5jdGlvbigpeyByZXR1cm4gKCFHdW4ubG9nLm9mZiAmJiBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpKSwgW10uc2xpY2UuY2FsbChhcmd1bWVudHMpLmpvaW4oJyAnKSB9XHJcblx0XHRHdW4ubG9nLm9uY2UgPSBmdW5jdGlvbih3LHMsbyl7IHJldHVybiAobyA9IEd1bi5sb2cub25jZSlbd10gPSBvW3ddIHx8IDAsIG9bd10rKyB8fCBHdW4ubG9nKHMpIH1cclxuXHJcblx0XHQ7XCJQbGVhc2UgZG8gbm90IHJlbW92ZSB0aGVzZSBtZXNzYWdlcyB1bmxlc3MgeW91IGFyZSBwYXlpbmcgZm9yIGEgbW9udGhseSBzcG9uc29yc2hpcCwgdGhhbmtzIVwiO1xyXG5cdFx0R3VuLmxvZy5vbmNlKFwid2VsY29tZVwiLCBcIkhlbGxvIHdvbmRlcmZ1bCBwZXJzb24hIDopIFRoYW5rcyBmb3IgdXNpbmcgR1VOLCBmZWVsIGZyZWUgdG8gYXNrIGZvciBoZWxwIG9uIGh0dHBzOi8vZ2l0dGVyLmltL2FtYXJrL2d1biBhbmQgYXNrIFN0YWNrT3ZlcmZsb3cgcXVlc3Rpb25zIHRhZ2dlZCB3aXRoICdndW4nIVwiKTtcclxuXHRcdDtcIlBsZWFzZSBkbyBub3QgcmVtb3ZlIHRoZXNlIG1lc3NhZ2VzIHVubGVzcyB5b3UgYXJlIHBheWluZyBmb3IgYSBtb250aGx5IHNwb25zb3JzaGlwLCB0aGFua3MhXCI7XHJcblx0XHRcclxuXHRcdGlmKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpeyB3aW5kb3cuR3VuID0gR3VuIH1cclxuXHRcdGlmKHR5cGVvZiBjb21tb24gIT09IFwidW5kZWZpbmVkXCIpeyBjb21tb24uZXhwb3J0cyA9IEd1biB9XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IEd1bjtcclxuXHR9KShyZXF1aXJlLCAnLi9yb290Jyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9yb290Jyk7XHJcblx0XHRHdW4uY2hhaW4uYmFjayA9IGZ1bmN0aW9uKG4sIG9wdCl7IHZhciB0bXA7XHJcblx0XHRcdGlmKC0xID09PSBuIHx8IEluZmluaXR5ID09PSBuKXtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5fLnJvb3Q7XHJcblx0XHRcdH0gZWxzZVxyXG5cdFx0XHRpZigxID09PSBuKXtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5fLmJhY2sgfHwgdGhpcztcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgZ3VuID0gdGhpcywgYXQgPSBndW4uXztcclxuXHRcdFx0aWYodHlwZW9mIG4gPT09ICdzdHJpbmcnKXtcclxuXHRcdFx0XHRuID0gbi5zcGxpdCgnLicpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKG4gaW5zdGFuY2VvZiBBcnJheSl7XHJcblx0XHRcdFx0dmFyIGkgPSAwLCBsID0gbi5sZW5ndGgsIHRtcCA9IGF0O1xyXG5cdFx0XHRcdGZvcihpOyBpIDwgbDsgaSsrKXtcclxuXHRcdFx0XHRcdHRtcCA9ICh0bXB8fGVtcHR5KVtuW2ldXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYodSAhPT0gdG1wKXtcclxuXHRcdFx0XHRcdHJldHVybiBvcHQ/IGd1biA6IHRtcDtcclxuXHRcdFx0XHR9IGVsc2VcclxuXHRcdFx0XHRpZigodG1wID0gYXQuYmFjaykpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRtcC5iYWNrKG4sIG9wdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihuIGluc3RhbmNlb2YgRnVuY3Rpb24pe1xyXG5cdFx0XHRcdHZhciB5ZXMsIHRtcCA9IHtiYWNrOiBndW59O1xyXG5cdFx0XHRcdHdoaWxlKCh0bXAgPSB0bXAuYmFjaylcclxuXHRcdFx0XHQmJiAodG1wID0gdG1wLl8pXHJcblx0XHRcdFx0JiYgISh5ZXMgPSBuKHRtcCwgb3B0KSkpe31cclxuXHRcdFx0XHRyZXR1cm4geWVzO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR2YXIgZW1wdHkgPSB7fSwgdTtcclxuXHR9KShyZXF1aXJlLCAnLi9iYWNrJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9yb290Jyk7XHJcblx0XHRHdW4uY2hhaW4uY2hhaW4gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgYXQgPSB0aGlzLl8sIGNoYWluID0gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcyksIGNhdCA9IGNoYWluLl87XHJcblx0XHRcdGNhdC5yb290ID0gcm9vdCA9IGF0LnJvb3Q7XHJcblx0XHRcdGNhdC5pZCA9ICsrcm9vdC5fLm9uY2U7XHJcblx0XHRcdGNhdC5iYWNrID0gdGhpcztcclxuXHRcdFx0Y2F0Lm9uID0gR3VuLm9uO1xyXG5cdFx0XHRHdW4ub24oJ2NoYWluJywgY2F0KTtcclxuXHRcdFx0Y2F0Lm9uKCdpbicsIGlucHV0LCBjYXQpOyAvLyBGb3IgJ2luJyBpZiBJIGFkZCBteSBvd24gbGlzdGVuZXJzIHRvIGVhY2ggdGhlbiBJIE1VU1QgZG8gaXQgYmVmb3JlIGluIGdldHMgY2FsbGVkLiBJZiBJIGxpc3RlbiBnbG9iYWxseSBmb3IgYWxsIGluY29taW5nIGRhdGEgaW5zdGVhZCB0aG91Z2gsIHJlZ2FyZGxlc3Mgb2YgaW5kaXZpZHVhbCBsaXN0ZW5lcnMsIEkgY2FuIHRyYW5zZm9ybSB0aGUgZGF0YSB0aGVyZSBhbmQgdGhlbiBhcyB3ZWxsLlxyXG5cdFx0XHRjYXQub24oJ291dCcsIG91dHB1dCwgY2F0KTsgLy8gSG93ZXZlciBmb3Igb3V0cHV0LCB0aGVyZSBpc24ndCByZWFsbHkgdGhlIGdsb2JhbCBvcHRpb24uIEkgbXVzdCBsaXN0ZW4gYnkgYWRkaW5nIG15IG93biBsaXN0ZW5lciBpbmRpdmlkdWFsbHkgQkVGT1JFIHRoaXMgb25lIGlzIGV2ZXIgY2FsbGVkLlxyXG5cdFx0XHRyZXR1cm4gY2hhaW47XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBvdXRwdXQoYXQpe1xyXG5cdFx0XHR2YXIgY2F0ID0gdGhpcy5hcywgZ3VuID0gY2F0Lmd1biwgcm9vdCA9IGd1bi5iYWNrKC0xKSwgcHV0LCBnZXQsIG5vdywgdG1wO1xyXG5cdFx0XHRpZighYXQuZ3VuKXtcclxuXHRcdFx0XHRhdC5ndW4gPSBndW47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoZ2V0ID0gYXQuZ2V0KXtcclxuXHRcdFx0XHRpZih0bXAgPSBnZXRbX3NvdWxdKXtcclxuXHRcdFx0XHRcdHRtcCA9IChyb290LmdldCh0bXApLl8pO1xyXG5cdFx0XHRcdFx0aWYob2JqX2hhcyhnZXQsIF9maWVsZCkpe1xyXG5cdFx0XHRcdFx0XHRpZihvYmpfaGFzKHB1dCA9IHRtcC5wdXQsIGdldCA9IGdldFtfZmllbGRdKSl7XHJcblx0XHRcdFx0XHRcdFx0dG1wLm9uKCdpbicsIHtnZXQ6IHRtcC5nZXQsIHB1dDogR3VuLnN0YXRlLnRvKHB1dCwgZ2V0KSwgZ3VuOiB0bXAuZ3VufSk7IC8vIFRPRE86IFVnbHksIGNsZWFuIHVwPyBTaW1wbGlmeSBhbGwgdGhlc2UgaWYgY29uZGl0aW9ucyAod2l0aG91dCBydWluaW5nIHRoZSB3aG9sZSBjaGFpbmluZyBBUEkpP1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9IGVsc2VcclxuXHRcdFx0XHRcdGlmKG9ial9oYXModG1wLCAncHV0Jykpe1xyXG5cdFx0XHRcdFx0Ly9pZih1ICE9PSB0bXAucHV0KXtcclxuXHRcdFx0XHRcdFx0dG1wLm9uKCdpbicsIHRtcCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmKG9ial9oYXMoZ2V0LCBfZmllbGQpKXtcclxuXHRcdFx0XHRcdFx0Z2V0ID0gZ2V0W19maWVsZF07XHJcblx0XHRcdFx0XHRcdHZhciBuZXh0ID0gZ2V0PyAoZ3VuLmdldChnZXQpLl8pIDogY2F0O1xyXG5cdFx0XHRcdFx0XHQvLyBUT0RPOiBCVUchIEhhbmRsZSBwbHVyYWwgY2hhaW5zIGJ5IGl0ZXJhdGluZyBvdmVyIHRoZW0uXHJcblx0XHRcdFx0XHRcdC8vaWYob2JqX2hhcyhuZXh0LCAncHV0JykpeyAvLyBwb3RlbnRpYWxseSBpbmNvcnJlY3Q/IE1heWJlP1xyXG5cdFx0XHRcdFx0XHRpZih1ICE9PSBuZXh0LnB1dCl7IC8vIHBvdGVudGlhbGx5IGluY29ycmVjdD8gTWF5YmU/XHJcblx0XHRcdFx0XHRcdFx0Ly9uZXh0LnRhZ1snaW4nXS5sYXN0Lm5leHQobmV4dCk7XHJcblx0XHRcdFx0XHRcdFx0bmV4dC5vbignaW4nLCBuZXh0KTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYob2JqX2hhcyhjYXQsICdwdXQnKSl7XHJcblx0XHRcdFx0XHRcdC8vaWYodSAhPT0gY2F0LnB1dCl7XHJcblx0XHRcdFx0XHRcdFx0dmFyIHZhbCA9IGNhdC5wdXQsIHJlbDtcclxuXHRcdFx0XHRcdFx0XHRpZihyZWwgPSBHdW4ubm9kZS5zb3VsKHZhbCkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFsID0gR3VuLnZhbC5yZWwuaWZ5KHJlbCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGlmKHJlbCA9IEd1bi52YWwucmVsLmlzKHZhbCkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYoIWF0Lmd1bi5fKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdFx0XHRcdChhdC5ndW4uXykub24oJ291dCcsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Z2V0OiB0bXAgPSB7JyMnOiByZWwsICcuJzogZ2V0LCBndW46IGF0Lmd1bn0sXHJcblx0XHRcdFx0XHRcdFx0XHRcdCcjJzogcm9vdC5fLmFzayhHdW4uSEFNLnN5bnRoLCB0bXApLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRndW46IGF0Lmd1blxyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGlmKHUgPT09IHZhbCB8fCBHdW4udmFsLmlzKHZhbCkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYoIWF0Lmd1bi5fKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdFx0XHRcdChhdC5ndW4uXykub24oJ2luJywge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRnZXQ6IGdldCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0Z3VuOiBhdC5ndW5cclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSBlbHNlXHJcblx0XHRcdFx0XHRcdGlmKGNhdC5tYXApe1xyXG5cdFx0XHRcdFx0XHRcdG9ial9tYXAoY2F0Lm1hcCwgZnVuY3Rpb24ocHJveHkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0cHJveHkuYXQub24oJ2luJywgcHJveHkuYXQpO1xyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRpZihjYXQuc291bCl7XHJcblx0XHRcdFx0XHRcdFx0aWYoIWF0Lmd1bi5fKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdFx0XHQoYXQuZ3VuLl8pLm9uKCdvdXQnLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRnZXQ6IHRtcCA9IHsnIyc6IGNhdC5zb3VsLCAnLic6IGdldCwgZ3VuOiBhdC5ndW59LFxyXG5cdFx0XHRcdFx0XHRcdFx0JyMnOiByb290Ll8uYXNrKEd1bi5IQU0uc3ludGgsIHRtcCksXHJcblx0XHRcdFx0XHRcdFx0XHRndW46IGF0Lmd1blxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZihjYXQuZ2V0KXtcclxuXHRcdFx0XHRcdFx0XHRpZighY2F0LmJhY2suXyl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRcdFx0KGNhdC5iYWNrLl8pLm9uKCdvdXQnLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRnZXQ6IG9ial9wdXQoe30sIF9maWVsZCwgY2F0LmdldCksXHJcblx0XHRcdFx0XHRcdFx0XHRndW46IGd1blxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRhdCA9IG9ial90byhhdCwge2dldDoge319KTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGlmKG9ial9oYXMoY2F0LCAncHV0Jykpe1xyXG5cdFx0XHRcdFx0XHQvL2lmKHUgIT09IGNhdC5wdXQpe1xyXG5cdFx0XHRcdFx0XHRcdGNhdC5vbignaW4nLCBjYXQpO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2VcclxuXHRcdFx0XHRcdFx0aWYoY2F0Lm1hcCl7XHJcblx0XHRcdFx0XHRcdFx0b2JqX21hcChjYXQubWFwLCBmdW5jdGlvbihwcm94eSl7XHJcblx0XHRcdFx0XHRcdFx0XHRwcm94eS5hdC5vbignaW4nLCBwcm94eS5hdCk7XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYoY2F0LmFjayl7XHJcblx0XHRcdFx0XHRcdFx0aWYoIW9ial9oYXMoY2F0LCAncHV0JykpeyAvLyB1ICE9PSBjYXQucHV0IGluc3RlYWQ/XHJcblx0XHRcdFx0XHRcdFx0Ly9pZih1ICE9PSBjYXQucHV0KXtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0Y2F0LmFjayA9IC0xO1xyXG5cdFx0XHRcdFx0XHRpZihjYXQuc291bCl7XHJcblx0XHRcdFx0XHRcdFx0Y2F0Lm9uKCdvdXQnLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRnZXQ6IHRtcCA9IHsnIyc6IGNhdC5zb3VsLCBndW46IGNhdC5ndW59LFxyXG5cdFx0XHRcdFx0XHRcdFx0JyMnOiByb290Ll8uYXNrKEd1bi5IQU0uc3ludGgsIHRtcCksXHJcblx0XHRcdFx0XHRcdFx0XHRndW46IGNhdC5ndW5cclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYoY2F0LmdldCl7XHJcblx0XHRcdFx0XHRcdFx0aWYoIWNhdC5iYWNrLl8peyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0XHRcdChjYXQuYmFjay5fKS5vbignb3V0Jywge1xyXG5cdFx0XHRcdFx0XHRcdFx0Z2V0OiBvYmpfcHV0KHt9LCBfZmllbGQsIGNhdC5nZXQpLFxyXG5cdFx0XHRcdFx0XHRcdFx0Z3VuOiBjYXQuZ3VuXHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdChjYXQuYmFjay5fKS5vbignb3V0JywgYXQpO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gaW5wdXQoYXQpe1xyXG5cdFx0XHRhdCA9IGF0Ll8gfHwgYXQ7XHJcblx0XHRcdHZhciBldiA9IHRoaXMsIGNhdCA9IHRoaXMuYXMsIGd1biA9IGF0Lmd1biwgY29hdCA9IGd1bi5fLCBjaGFuZ2UgPSBhdC5wdXQsIGJhY2sgPSBjYXQuYmFjay5fIHx8IGVtcHR5LCByZWwsIHRtcDtcclxuXHRcdFx0aWYoMCA+IGNhdC5hY2sgJiYgIWF0LmFjayAmJiAhR3VuLnZhbC5yZWwuaXMoY2hhbmdlKSl7IC8vIGZvciBiZXR0ZXIgYmVoYXZpb3I/XHJcblx0XHRcdFx0Y2F0LmFjayA9IDE7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY2F0LmdldCAmJiBhdC5nZXQgIT09IGNhdC5nZXQpe1xyXG5cdFx0XHRcdGF0ID0gb2JqX3RvKGF0LCB7Z2V0OiBjYXQuZ2V0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY2F0LmZpZWxkICYmIGNvYXQgIT09IGNhdCl7XHJcblx0XHRcdFx0YXQgPSBvYmpfdG8oYXQsIHtndW46IGNhdC5ndW59KTtcclxuXHRcdFx0XHRpZihjb2F0LmFjayl7XHJcblx0XHRcdFx0XHRjYXQuYWNrID0gY2F0LmFjayB8fCBjb2F0LmFjaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYodSA9PT0gY2hhbmdlKXtcclxuXHRcdFx0XHRldi50by5uZXh0KGF0KTtcclxuXHRcdFx0XHRpZihjYXQuc291bCl7IHJldHVybiB9XHJcblx0XHRcdFx0ZWNobyhjYXQsIGF0LCBldik7XHJcblx0XHRcdFx0aWYoY2F0LmZpZWxkKXtcclxuXHRcdFx0XHRcdG5vdChjYXQsIGF0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0b2JqX2RlbChjb2F0LmVjaG8sIGNhdC5pZCk7XHJcblx0XHRcdFx0b2JqX2RlbChjYXQubWFwLCBjb2F0LmlkKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY2F0LnNvdWwpe1xyXG5cdFx0XHRcdGlmKGNhdC5yb290Ll8ubm93KXsgYXQgPSBvYmpfdG8oYXQsIHtwdXQ6IGNoYW5nZSA9IGNvYXQucHV0fSkgfSAvLyBUT0RPOiBVZ2x5IGhhY2sgZm9yIHVuY2FjaGVkIHN5bmNocm9ub3VzIG1hcHMuXHJcblx0XHRcdFx0ZXYudG8ubmV4dChhdCk7XHJcblx0XHRcdFx0ZWNobyhjYXQsIGF0LCBldik7XHJcblx0XHRcdFx0b2JqX21hcChjaGFuZ2UsIG1hcCwge2F0OiBhdCwgY2F0OiBjYXR9KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoIShyZWwgPSBHdW4udmFsLnJlbC5pcyhjaGFuZ2UpKSl7XHJcblx0XHRcdFx0aWYoR3VuLnZhbC5pcyhjaGFuZ2UpKXtcclxuXHRcdFx0XHRcdGlmKGNhdC5maWVsZCB8fCBjYXQuc291bCl7XHJcblx0XHRcdFx0XHRcdG5vdChjYXQsIGF0KTtcclxuXHRcdFx0XHRcdH0gZWxzZVxyXG5cdFx0XHRcdFx0aWYoY29hdC5maWVsZCB8fCBjb2F0LnNvdWwpe1xyXG5cdFx0XHRcdFx0XHQoY29hdC5lY2hvIHx8IChjb2F0LmVjaG8gPSB7fSkpW2NhdC5pZF0gPSBjYXQ7XHJcblx0XHRcdFx0XHRcdChjYXQubWFwIHx8IChjYXQubWFwID0ge30pKVtjb2F0LmlkXSA9IGNhdC5tYXBbY29hdC5pZF0gfHwge2F0OiBjb2F0fTtcclxuXHRcdFx0XHRcdFx0Ly9pZih1ID09PSBjb2F0LnB1dCl7IHJldHVybiB9IC8vIE5vdCBuZWNlc3NhcnkgYnV0IGltcHJvdmVzIHBlcmZvcm1hbmNlLiBJZiB3ZSBoYXZlIGl0IGJ1dCBjb2F0IGRvZXMgbm90LCB0aGF0IG1lYW5zIHdlIGdvdCB0aGluZ3Mgb3V0IG9mIG9yZGVyIGFuZCBjb2F0IHdpbGwgZ2V0IGl0LiBPbmNlIGNvYXQgZ2V0cyBpdCwgaXQgd2lsbCB0ZWxsIHVzIGFnYWluLlxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZXYudG8ubmV4dChhdCk7XHJcblx0XHRcdFx0XHRlY2hvKGNhdCwgYXQsIGV2KTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoY2F0LmZpZWxkICYmIGNvYXQgIT09IGNhdCAmJiBvYmpfaGFzKGNvYXQsICdwdXQnKSl7XHJcblx0XHRcdFx0XHRjYXQucHV0ID0gY29hdC5wdXQ7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRpZigocmVsID0gR3VuLm5vZGUuc291bChjaGFuZ2UpKSAmJiBjb2F0LmZpZWxkKXtcclxuXHRcdFx0XHRcdGNvYXQucHV0ID0gKGNhdC5yb290LmdldChyZWwpLl8pLnB1dDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZXYudG8ubmV4dChhdCk7XHJcblx0XHRcdFx0ZWNobyhjYXQsIGF0LCBldik7XHJcblx0XHRcdFx0cmVsYXRlKGNhdCwgYXQsIGNvYXQsIHJlbCk7XHJcblx0XHRcdFx0b2JqX21hcChjaGFuZ2UsIG1hcCwge2F0OiBhdCwgY2F0OiBjYXR9KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0cmVsYXRlKGNhdCwgYXQsIGNvYXQsIHJlbCk7XHJcblx0XHRcdGV2LnRvLm5leHQoYXQpO1xyXG5cdFx0XHRlY2hvKGNhdCwgYXQsIGV2KTtcclxuXHRcdH1cclxuXHRcdEd1bi5jaGFpbi5jaGFpbi5pbnB1dCA9IGlucHV0O1xyXG5cdFx0ZnVuY3Rpb24gcmVsYXRlKGNhdCwgYXQsIGNvYXQsIHJlbCl7XHJcblx0XHRcdGlmKCFyZWwgfHwgbm9kZV8gPT09IGNhdC5nZXQpeyByZXR1cm4gfVxyXG5cdFx0XHR2YXIgdG1wID0gKGNhdC5yb290LmdldChyZWwpLl8pO1xyXG5cdFx0XHRpZihjYXQuZmllbGQpe1xyXG5cdFx0XHRcdGNvYXQgPSB0bXA7XHJcblx0XHRcdH0gZWxzZSBcclxuXHRcdFx0aWYoY29hdC5maWVsZCl7XHJcblx0XHRcdFx0cmVsYXRlKGNvYXQsIGF0LCBjb2F0LCByZWwpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNvYXQgPT09IGNhdCl7IHJldHVybiB9XHJcblx0XHRcdChjb2F0LmVjaG8gfHwgKGNvYXQuZWNobyA9IHt9KSlbY2F0LmlkXSA9IGNhdDtcclxuXHRcdFx0aWYoY2F0LmZpZWxkICYmICEoY2F0Lm1hcHx8ZW1wdHkpW2NvYXQuaWRdKXtcclxuXHRcdFx0XHRub3QoY2F0LCBhdCk7XHJcblx0XHRcdH1cclxuXHRcdFx0dG1wID0gKGNhdC5tYXAgfHwgKGNhdC5tYXAgPSB7fSkpW2NvYXQuaWRdID0gY2F0Lm1hcFtjb2F0LmlkXSB8fCB7YXQ6IGNvYXR9O1xyXG5cdFx0XHRpZihyZWwgPT09IHRtcC5yZWwpeyByZXR1cm4gfVxyXG5cdFx0XHRhc2soY2F0LCB0bXAucmVsID0gcmVsKTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIGVjaG8oY2F0LCBhdCwgZXYpe1xyXG5cdFx0XHRpZighY2F0LmVjaG8peyByZXR1cm4gfSAvLyB8fCBub2RlXyA9PT0gYXQuZ2V0ID8/Pz9cclxuXHRcdFx0aWYoY2F0LmZpZWxkKXsgYXQgPSBvYmpfdG8oYXQsIHtldmVudDogZXZ9KSB9XHJcblx0XHRcdG9ial9tYXAoY2F0LmVjaG8sIHJldmVyYiwgYXQpO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gcmV2ZXJiKGNhdCl7XHJcblx0XHRcdGNhdC5vbignaW4nLCB0aGlzKTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIG1hcChkYXRhLCBrZXkpeyAvLyBNYXAgb3ZlciBvbmx5IHRoZSBjaGFuZ2VzIG9uIGV2ZXJ5IHVwZGF0ZS5cclxuXHRcdFx0dmFyIGNhdCA9IHRoaXMuY2F0LCBuZXh0ID0gY2F0Lm5leHQgfHwgZW1wdHksIHZpYSA9IHRoaXMuYXQsIGd1biwgY2hhaW4sIGF0LCB0bXA7XHJcblx0XHRcdGlmKG5vZGVfID09PSBrZXkgJiYgIW5leHRba2V5XSl7IHJldHVybiB9XHJcblx0XHRcdGlmKCEoZ3VuID0gbmV4dFtrZXldKSl7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGF0ID0gKGd1bi5fKTtcclxuXHRcdFx0Ly9pZihkYXRhICYmIGRhdGFbX3NvdWxdICYmICh0bXAgPSBHdW4udmFsLnJlbC5pcyhkYXRhKSkgJiYgKHRtcCA9IChjYXQucm9vdC5nZXQodG1wKS5fKSkgJiYgb2JqX2hhcyh0bXAsICdwdXQnKSl7XHJcblx0XHRcdC8vXHRkYXRhID0gdG1wLnB1dDtcclxuXHRcdFx0Ly99XHJcblx0XHRcdGlmKGF0LmZpZWxkKXtcclxuXHRcdFx0XHRpZighKGRhdGEgJiYgZGF0YVtfc291bF0gJiYgR3VuLnZhbC5yZWwuaXMoZGF0YSkgPT09IEd1bi5ub2RlLnNvdWwoYXQucHV0KSkpe1xyXG5cdFx0XHRcdFx0YXQucHV0ID0gZGF0YTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2hhaW4gPSBndW47XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y2hhaW4gPSB2aWEuZ3VuLmdldChrZXkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGF0Lm9uKCdpbicsIHtcclxuXHRcdFx0XHRwdXQ6IGRhdGEsXHJcblx0XHRcdFx0Z2V0OiBrZXksXHJcblx0XHRcdFx0Z3VuOiBjaGFpbixcclxuXHRcdFx0XHR2aWE6IHZpYVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIG5vdChjYXQsIGF0KXtcclxuXHRcdFx0aWYoIShjYXQuZmllbGQgfHwgY2F0LnNvdWwpKXsgcmV0dXJuIH1cclxuXHRcdFx0dmFyIHRtcCA9IGNhdC5tYXA7XHJcblx0XHRcdGNhdC5tYXAgPSBudWxsO1xyXG5cdFx0XHRpZihudWxsID09PSB0bXApeyByZXR1cm4gfVxyXG5cdFx0XHRpZih1ID09PSB0bXAgJiYgY2F0LnB1dCAhPT0gdSl7IHJldHVybiB9IC8vIFRPRE86IEJ1Zz8gVGhyZXcgc2Vjb25kIGNvbmRpdGlvbiBpbiBmb3IgYSBwYXJ0aWN1bGFyIHRlc3QsIG5vdCBzdXJlIGlmIGEgY291bnRlciBleGFtcGxlIGlzIHRlc3RlZCB0aG91Z2guXHJcblx0XHRcdG9ial9tYXAodG1wLCBmdW5jdGlvbihwcm94eSl7XHJcblx0XHRcdFx0aWYoIShwcm94eSA9IHByb3h5LmF0KSl7IHJldHVybiB9XHJcblx0XHRcdFx0b2JqX2RlbChwcm94eS5lY2hvLCBjYXQuaWQpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0b2JqX21hcChjYXQubmV4dCwgZnVuY3Rpb24oZ3VuLCBrZXkpe1xyXG5cdFx0XHRcdHZhciBjb2F0ID0gKGd1bi5fKTtcclxuXHRcdFx0XHRjb2F0LnB1dCA9IHU7XHJcblx0XHRcdFx0aWYoY29hdC5hY2spe1xyXG5cdFx0XHRcdFx0Y29hdC5hY2sgPSAtMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y29hdC5vbignaW4nLCB7XHJcblx0XHRcdFx0XHRnZXQ6IGtleSxcclxuXHRcdFx0XHRcdGd1bjogZ3VuLFxyXG5cdFx0XHRcdFx0cHV0OiB1XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gYXNrKGNhdCwgc291bCl7XHJcblx0XHRcdHZhciB0bXAgPSAoY2F0LnJvb3QuZ2V0KHNvdWwpLl8pO1xyXG5cdFx0XHRpZihjYXQuYWNrKXtcclxuXHRcdFx0XHR0bXAuYWNrID0gdG1wLmFjayB8fCAtMTtcclxuXHRcdFx0XHR0bXAub24oJ291dCcsIHtcclxuXHRcdFx0XHRcdGdldDogdG1wID0geycjJzogc291bCwgZ3VuOiB0bXAuZ3VufSxcclxuXHRcdFx0XHRcdCcjJzogY2F0LnJvb3QuXy5hc2soR3VuLkhBTS5zeW50aCwgdG1wKVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRvYmpfbWFwKGNhdC5uZXh0LCBmdW5jdGlvbihndW4sIGtleSl7XHJcblx0XHRcdFx0KGd1bi5fKS5vbignb3V0Jywge1xyXG5cdFx0XHRcdFx0Z2V0OiBndW4gPSB7JyMnOiBzb3VsLCAnLic6IGtleSwgZ3VuOiBndW59LFxyXG5cdFx0XHRcdFx0JyMnOiBjYXQucm9vdC5fLmFzayhHdW4uSEFNLnN5bnRoLCBndW4pXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0dmFyIGVtcHR5ID0ge30sIHU7XHJcblx0XHR2YXIgb2JqID0gR3VuLm9iaiwgb2JqX2hhcyA9IG9iai5oYXMsIG9ial9wdXQgPSBvYmoucHV0LCBvYmpfZGVsID0gb2JqLmRlbCwgb2JqX3RvID0gb2JqLnRvLCBvYmpfbWFwID0gb2JqLm1hcDtcclxuXHRcdHZhciBfc291bCA9IEd1bi5fLnNvdWwsIF9maWVsZCA9IEd1bi5fLmZpZWxkLCBub2RlXyA9IEd1bi5ub2RlLl87XHJcblx0fSkocmVxdWlyZSwgJy4vY2hhaW4nKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL3Jvb3QnKTtcclxuXHRcdEd1bi5jaGFpbi5nZXQgPSBmdW5jdGlvbihrZXksIGNiLCBhcyl7XHJcblx0XHRcdGlmKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnKXtcclxuXHRcdFx0XHR2YXIgZ3VuLCBiYWNrID0gdGhpcywgY2F0ID0gYmFjay5fO1xyXG5cdFx0XHRcdHZhciBuZXh0ID0gY2F0Lm5leHQgfHwgZW1wdHksIHRtcDtcclxuXHRcdFx0XHRpZighKGd1biA9IG5leHRba2V5XSkpe1xyXG5cdFx0XHRcdFx0Z3VuID0gY2FjaGUoa2V5LCBiYWNrKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZVxyXG5cdFx0XHRpZihrZXkgaW5zdGFuY2VvZiBGdW5jdGlvbil7XHJcblx0XHRcdFx0dmFyIGd1biA9IHRoaXMsIGF0ID0gZ3VuLl87XHJcblx0XHRcdFx0YXMgPSBjYiB8fCB7fTtcclxuXHRcdFx0XHRhcy51c2UgPSBrZXk7XHJcblx0XHRcdFx0YXMub3V0ID0gYXMub3V0IHx8IHtjYXA6IDF9O1xyXG5cdFx0XHRcdGFzLm91dC5nZXQgPSBhcy5vdXQuZ2V0IHx8IHt9O1xyXG5cdFx0XHRcdCdfJyAhPSBhdC5nZXQgJiYgKChhdC5yb290Ll8pLm5vdyA9IHRydWUpOyAvLyB1Z2x5IGhhY2sgZm9yIG5vdy5cclxuXHRcdFx0XHRhdC5vbignaW4nLCB1c2UsIGFzKTtcclxuXHRcdFx0XHRhdC5vbignb3V0JywgYXMub3V0KTtcclxuXHRcdFx0XHQoYXQucm9vdC5fKS5ub3cgPSBmYWxzZTtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9IGVsc2VcclxuXHRcdFx0aWYobnVtX2lzKGtleSkpe1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmdldCgnJytrZXksIGNiLCBhcyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0KGFzID0gdGhpcy5jaGFpbigpKS5fLmVyciA9IHtlcnI6IEd1bi5sb2coJ0ludmFsaWQgZ2V0IHJlcXVlc3QhJywga2V5KX07IC8vIENMRUFOIFVQXHJcblx0XHRcdFx0aWYoY2IpeyBjYi5jYWxsKGFzLCBhcy5fLmVycikgfVxyXG5cdFx0XHRcdHJldHVybiBhcztcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih0bXAgPSBjYXQuc3R1bil7IC8vIFRPRE86IFJlZmFjdG9yP1xyXG5cdFx0XHRcdGd1bi5fLnN0dW4gPSBndW4uXy5zdHVuIHx8IHRtcDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjYiAmJiBjYiBpbnN0YW5jZW9mIEZ1bmN0aW9uKXtcclxuXHRcdFx0XHRndW4uZ2V0KGNiLCBhcyk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIGNhY2hlKGtleSwgYmFjayl7XHJcblx0XHRcdHZhciBjYXQgPSBiYWNrLl8sIG5leHQgPSBjYXQubmV4dCwgZ3VuID0gYmFjay5jaGFpbigpLCBhdCA9IGd1bi5fO1xyXG5cdFx0XHRpZighbmV4dCl7IG5leHQgPSBjYXQubmV4dCA9IHt9IH1cclxuXHRcdFx0bmV4dFthdC5nZXQgPSBrZXldID0gZ3VuO1xyXG5cdFx0XHRpZihjYXQucm9vdCA9PT0gYmFjayl7IGF0LnNvdWwgPSBrZXkgfVxyXG5cdFx0XHRlbHNlIGlmKGNhdC5zb3VsIHx8IGNhdC5maWVsZCl7IGF0LmZpZWxkID0ga2V5IH1cclxuXHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIHVzZShhdCl7XHJcblx0XHRcdHZhciBldiA9IHRoaXMsIGFzID0gZXYuYXMsIGd1biA9IGF0Lmd1biwgY2F0ID0gZ3VuLl8sIGRhdGEgPSBhdC5wdXQsIHRtcDtcclxuXHRcdFx0aWYodSA9PT0gZGF0YSl7XHJcblx0XHRcdFx0ZGF0YSA9IGNhdC5wdXQ7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoKHRtcCA9IGRhdGEpICYmIHRtcFtyZWwuX10gJiYgKHRtcCA9IHJlbC5pcyh0bXApKSl7XHJcblx0XHRcdFx0dG1wID0gKGNhdC5yb290LmdldCh0bXApLl8pO1xyXG5cdFx0XHRcdGlmKHUgIT09IHRtcC5wdXQpe1xyXG5cdFx0XHRcdFx0YXQgPSBvYmpfdG8oYXQsIHtwdXQ6IHRtcC5wdXR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0YXMudXNlKGF0LCBhdC5ldmVudCB8fCBldik7XHJcblx0XHRcdGV2LnRvLm5leHQoYXQpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIG9iaiA9IEd1bi5vYmosIG9ial9oYXMgPSBvYmouaGFzLCBvYmpfdG8gPSBHdW4ub2JqLnRvO1xyXG5cdFx0dmFyIG51bV9pcyA9IEd1bi5udW0uaXM7XHJcblx0XHR2YXIgcmVsID0gR3VuLnZhbC5yZWwsIG5vZGVfID0gR3VuLm5vZGUuXztcclxuXHRcdHZhciBlbXB0eSA9IHt9LCB1O1xyXG5cdH0pKHJlcXVpcmUsICcuL2dldCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vcm9vdCcpO1xyXG5cdFx0R3VuLmNoYWluLnB1dCA9IGZ1bmN0aW9uKGRhdGEsIGNiLCBhcyl7XHJcblx0XHRcdC8vICNzb3VsLmZpZWxkPXZhbHVlPnN0YXRlXHJcblx0XHRcdC8vIH53aG8jd2hlcmUud2hlcmU9d2hhdD53aGVuQHdhc1xyXG5cdFx0XHQvLyBUT0RPOiBCVUchIFB1dCBwcm9iYWJseSBjYW5ub3QgaGFuZGxlIHBsdXJhbCBjaGFpbnMhXHJcblx0XHRcdHZhciBndW4gPSB0aGlzLCBhdCA9IChndW4uXyksIHJvb3QgPSBhdC5yb290LCB0bXA7XHJcblx0XHRcdGFzID0gYXMgfHwge307XHJcblx0XHRcdGFzLmRhdGEgPSBkYXRhO1xyXG5cdFx0XHRhcy5ndW4gPSBhcy5ndW4gfHwgZ3VuO1xyXG5cdFx0XHRpZih0eXBlb2YgY2IgPT09ICdzdHJpbmcnKXtcclxuXHRcdFx0XHRhcy5zb3VsID0gY2I7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0YXMuYWNrID0gY2I7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoYXQuc291bCl7XHJcblx0XHRcdFx0YXMuc291bCA9IGF0LnNvdWw7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoYXMuc291bCB8fCByb290ID09PSBndW4pe1xyXG5cdFx0XHRcdGlmKCFvYmpfaXMoYXMuZGF0YSkpe1xyXG5cdFx0XHRcdFx0KGFzLmFja3x8bm9vcCkuY2FsbChhcywgYXMub3V0ID0ge2VycjogR3VuLmxvZyhcIkRhdGEgc2F2ZWQgdG8gdGhlIHJvb3QgbGV2ZWwgb2YgdGhlIGdyYXBoIG11c3QgYmUgYSBub2RlIChhbiBvYmplY3QpLCBub3QgYVwiLCAodHlwZW9mIGFzLmRhdGEpLCAnb2YgXCInICsgYXMuZGF0YSArICdcIiEnKX0pO1xyXG5cdFx0XHRcdFx0aWYoYXMucmVzKXsgYXMucmVzKCkgfVxyXG5cdFx0XHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YXMuZ3VuID0gZ3VuID0gcm9vdC5nZXQoYXMuc291bCA9IGFzLnNvdWwgfHwgKGFzLm5vdCA9IEd1bi5ub2RlLnNvdWwoYXMuZGF0YSkgfHwgKChyb290Ll8pLm9wdC51dWlkIHx8IEd1bi50ZXh0LnJhbmRvbSkoKSkpO1xyXG5cdFx0XHRcdGFzLnJlZiA9IGFzLmd1bjtcclxuXHRcdFx0XHRpZnkoYXMpO1xyXG5cdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoR3VuLmlzKGRhdGEpKXtcclxuXHRcdFx0XHRkYXRhLmdldChmdW5jdGlvbihhdCxldil7ZXYub2ZmKCk7XHJcblx0XHRcdFx0XHR2YXIgcyA9IEd1bi5ub2RlLnNvdWwoYXQucHV0KTtcclxuXHRcdFx0XHRcdGlmKCFzKXtHdW4ubG9nKFwiVGhlIHJlZmVyZW5jZSB5b3UgYXJlIHNhdmluZyBpcyBhXCIsIHR5cGVvZiBhdC5wdXQsICdcIicrIGFzLnB1dCArJ1wiLCBub3QgYSBub2RlIChvYmplY3QpIScpO3JldHVybn1cclxuXHRcdFx0XHRcdGd1bi5wdXQoR3VuLnZhbC5yZWwuaWZ5KHMpLCBjYiwgYXMpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdH1cclxuXHRcdFx0YXMucmVmID0gYXMucmVmIHx8IChyb290ID09PSAodG1wID0gYXQuYmFjaykpPyBndW4gOiB0bXA7XHJcblx0XHRcdGlmKGFzLnJlZi5fLnNvdWwgJiYgR3VuLnZhbC5pcyhhcy5kYXRhKSAmJiBhdC5nZXQpe1xyXG5cdFx0XHRcdGFzLmRhdGEgPSBvYmpfcHV0KHt9LCBhdC5nZXQsIGFzLmRhdGEpO1xyXG5cdFx0XHRcdGFzLnJlZi5wdXQoYXMuZGF0YSwgYXMuc291bCwgYXMpO1xyXG5cdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdH1cclxuXHRcdFx0YXMucmVmLmdldCgnXycpLmdldChhbnksIHthczogYXN9KTtcclxuXHRcdFx0aWYoIWFzLm91dCl7XHJcblx0XHRcdFx0Ly8gVE9ETzogUGVyZiBpZGVhISBNYWtlIGEgZ2xvYmFsIGxvY2ssIHRoYXQgYmxvY2tzIGV2ZXJ5dGhpbmcgd2hpbGUgaXQgaXMgb24sIGJ1dCBpZiBpdCBpcyBvbiB0aGUgbG9jayBpdCBkb2VzIHRoZSBleHBlbnNpdmUgbG9va3VwIHRvIHNlZSBpZiBpdCBpcyBhIGRlcGVuZGVudCB3cml0ZSBvciBub3QgYW5kIGlmIG5vdCB0aGVuIGl0IHByb2NlZWRzIGZ1bGwgc3BlZWQuIE1laD8gRm9yIHdyaXRlIGhlYXZ5IGFzeW5jIGFwcHMgdGhhdCB3b3VsZCBiZSB0ZXJyaWJsZS5cclxuXHRcdFx0XHRhcy5yZXMgPSBhcy5yZXMgfHwgR3VuLm9uLnN0dW4oYXMucmVmKTtcclxuXHRcdFx0XHRhcy5ndW4uXy5zdHVuID0gYXMucmVmLl8uc3R1bjtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0fTtcclxuXHJcblx0XHRmdW5jdGlvbiBpZnkoYXMpe1xyXG5cdFx0XHRhcy5iYXRjaCA9IGJhdGNoO1xyXG5cdFx0XHR2YXIgb3B0ID0gYXMub3B0fHx7fSwgZW52ID0gYXMuZW52ID0gR3VuLnN0YXRlLm1hcChtYXAsIG9wdC5zdGF0ZSk7XHJcblx0XHRcdGVudi5zb3VsID0gYXMuc291bDtcclxuXHRcdFx0YXMuZ3JhcGggPSBHdW4uZ3JhcGguaWZ5KGFzLmRhdGEsIGVudiwgYXMpO1xyXG5cdFx0XHRpZihlbnYuZXJyKXtcclxuXHRcdFx0XHQoYXMuYWNrfHxub29wKS5jYWxsKGFzLCBhcy5vdXQgPSB7ZXJyOiBHdW4ubG9nKGVudi5lcnIpfSk7XHJcblx0XHRcdFx0aWYoYXMucmVzKXsgYXMucmVzKCkgfVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRhcy5iYXRjaCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGJhdGNoKCl7IHZhciBhcyA9IHRoaXM7XHJcblx0XHRcdGlmKCFhcy5ncmFwaCB8fCBvYmpfbWFwKGFzLnN0dW4sIG5vKSl7IHJldHVybiB9XHJcblx0XHRcdChhcy5yZXN8fGlpZmUpKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0KGFzLnJlZi5fKS5vbignb3V0Jywge1xyXG5cdFx0XHRcdFx0Y2FwOiAzLFxyXG5cdFx0XHRcdFx0Z3VuOiBhcy5yZWYsIHB1dDogYXMub3V0ID0gYXMuZW52LmdyYXBoLCBvcHQ6IGFzLm9wdCxcclxuXHRcdFx0XHRcdCcjJzogYXMuZ3VuLmJhY2soLTEpLl8uYXNrKGZ1bmN0aW9uKGFjayl7IHRoaXMub2ZmKCk7IC8vIE9uZSByZXNwb25zZSBpcyBnb29kIGVub3VnaCBmb3IgdXMgY3VycmVudGx5LiBMYXRlciB3ZSBtYXkgd2FudCB0byBhZGp1c3QgdGhpcy5cclxuXHRcdFx0XHRcdFx0aWYoIWFzLmFjayl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRcdGFzLmFjayhhY2ssIHRoaXMpO1xyXG5cdFx0XHRcdFx0fSwgYXMub3B0KVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9LCBhcyk7XHJcblx0XHRcdGlmKGFzLnJlcyl7IGFzLnJlcygpIH1cclxuXHRcdH0gZnVuY3Rpb24gbm8odixmKXsgaWYodil7IHJldHVybiB0cnVlIH0gfVxyXG5cclxuXHRcdGZ1bmN0aW9uIG1hcCh2LGYsbiwgYXQpeyB2YXIgYXMgPSB0aGlzO1xyXG5cdFx0XHRpZihmIHx8ICFhdC5wYXRoLmxlbmd0aCl7IHJldHVybiB9XHJcblx0XHRcdChhcy5yZXN8fGlpZmUpKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIHBhdGggPSBhdC5wYXRoLCByZWYgPSBhcy5yZWYsIG9wdCA9IGFzLm9wdDtcclxuXHRcdFx0XHR2YXIgaSA9IDAsIGwgPSBwYXRoLmxlbmd0aDtcclxuXHRcdFx0XHRmb3IoaTsgaSA8IGw7IGkrKyl7XHJcblx0XHRcdFx0XHRyZWYgPSByZWYuZ2V0KHBhdGhbaV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihhcy5ub3QgfHwgR3VuLm5vZGUuc291bChhdC5vYmopKXtcclxuXHRcdFx0XHRcdHZhciBpZCA9IEd1bi5ub2RlLnNvdWwoYXQub2JqKSB8fCAoKGFzLm9wdHx8e30pLnV1aWQgfHwgYXMuZ3VuLmJhY2soJ29wdC51dWlkJykgfHwgR3VuLnRleHQucmFuZG9tKSgpO1xyXG5cdFx0XHRcdFx0cmVmLmJhY2soLTEpLmdldChpZCk7XHJcblx0XHRcdFx0XHRhdC5zb3VsKGlkKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0KGFzLnN0dW4gPSBhcy5zdHVuIHx8IHt9KVtwYXRoXSA9IHRydWU7XHJcblx0XHRcdFx0cmVmLmdldCgnXycpLmdldChzb3VsLCB7YXM6IHthdDogYXQsIGFzOiBhc319KTtcclxuXHRcdFx0fSwge2FzOiBhcywgYXQ6IGF0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gc291bChhdCwgZXYpeyB2YXIgYXMgPSB0aGlzLmFzLCBjYXQgPSBhcy5hdDsgYXMgPSBhcy5hcztcclxuXHRcdFx0Ly9ldi5zdHVuKCk7IC8vIFRPRE86IEJVRyE/XHJcblx0XHRcdGlmKCFhdC5ndW4gfHwgIWF0Lmd1bi5fLmJhY2speyByZXR1cm4gfSAvLyBUT0RPOiBIYW5kbGVcclxuXHRcdFx0ZXYub2ZmKCk7XHJcblx0XHRcdGF0ID0gKGF0Lmd1bi5fLmJhY2suXyk7XHJcblx0XHRcdHZhciBpZCA9IEd1bi5ub2RlLnNvdWwoY2F0Lm9iaikgfHwgR3VuLm5vZGUuc291bChhdC5wdXQpIHx8IEd1bi52YWwucmVsLmlzKGF0LnB1dCkgfHwgKChhcy5vcHR8fHt9KS51dWlkIHx8IGFzLmd1bi5iYWNrKCdvcHQudXVpZCcpIHx8IEd1bi50ZXh0LnJhbmRvbSkoKTsgLy8gVE9ETzogQlVHIT8gRG8gd2UgcmVhbGx5IHdhbnQgdGhlIHNvdWwgb2YgdGhlIG9iamVjdCBnaXZlbiB0byB1cz8gQ291bGQgdGhhdCBiZSBkYW5nZXJvdXM/XHJcblx0XHRcdGF0Lmd1bi5iYWNrKC0xKS5nZXQoaWQpO1xyXG5cdFx0XHRjYXQuc291bChpZCk7XHJcblx0XHRcdGFzLnN0dW5bY2F0LnBhdGhdID0gZmFsc2U7XHJcblx0XHRcdGFzLmJhdGNoKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gYW55KGF0LCBldil7XHJcblx0XHRcdHZhciBhcyA9IHRoaXMuYXM7XHJcblx0XHRcdGlmKCFhdC5ndW4gfHwgIWF0Lmd1bi5fKXsgcmV0dXJuIH0gLy8gVE9ETzogSGFuZGxlXHJcblx0XHRcdGlmKGF0LmVycil7IC8vIFRPRE86IEhhbmRsZVxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiUGxlYXNlIHJlcG9ydCB0aGlzIGFzIGFuIGlzc3VlISBQdXQuYW55LmVyclwiKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIGNhdCA9IChhdC5ndW4uXy5iYWNrLl8pLCBkYXRhID0gY2F0LnB1dCwgb3B0ID0gYXMub3B0fHx7fSwgcm9vdCwgdG1wO1xyXG5cdFx0XHRldi5vZmYoKTtcclxuXHRcdFx0aWYoYXMucmVmICE9PSBhcy5ndW4pe1xyXG5cdFx0XHRcdHRtcCA9IChhcy5ndW4uXykuZ2V0IHx8IGNhdC5nZXQ7XHJcblx0XHRcdFx0aWYoIXRtcCl7IC8vIFRPRE86IEhhbmRsZVxyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJQbGVhc2UgcmVwb3J0IHRoaXMgYXMgYW4gaXNzdWUhIFB1dC5uby5nZXRcIik7IC8vIFRPRE86IEJVRyE/P1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRhcy5kYXRhID0gb2JqX3B1dCh7fSwgdG1wLCBhcy5kYXRhKTtcclxuXHRcdFx0XHR0bXAgPSBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHUgPT09IGRhdGEpe1xyXG5cdFx0XHRcdGlmKCFjYXQuZ2V0KXsgcmV0dXJuIH0gLy8gVE9ETzogSGFuZGxlXHJcblx0XHRcdFx0aWYoIWNhdC5zb3VsKXtcclxuXHRcdFx0XHRcdHRtcCA9IGNhdC5ndW4uYmFjayhmdW5jdGlvbihhdCl7XHJcblx0XHRcdFx0XHRcdGlmKGF0LnNvdWwpeyByZXR1cm4gYXQuc291bCB9XHJcblx0XHRcdFx0XHRcdGFzLmRhdGEgPSBvYmpfcHV0KHt9LCBhdC5nZXQsIGFzLmRhdGEpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRtcCA9IHRtcCB8fCBjYXQuZ2V0O1xyXG5cdFx0XHRcdGNhdCA9IChjYXQucm9vdC5nZXQodG1wKS5fKTtcclxuXHRcdFx0XHRhcy5ub3QgPSBhcy5zb3VsID0gdG1wO1xyXG5cdFx0XHRcdGRhdGEgPSBhcy5kYXRhO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCFhcy5ub3QgJiYgIShhcy5zb3VsID0gR3VuLm5vZGUuc291bChkYXRhKSkpe1xyXG5cdFx0XHRcdGlmKGFzLnBhdGggJiYgb2JqX2lzKGFzLmRhdGEpKXsgLy8gQXBwYXJlbnRseSBuZWNlc3NhcnlcclxuXHRcdFx0XHRcdGFzLnNvdWwgPSAob3B0LnV1aWQgfHwgY2F0LnJvb3QuXy5vcHQudXVpZCB8fCBHdW4udGV4dC5yYW5kb20pKCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vYXMuZGF0YSA9IG9ial9wdXQoe30sIGFzLmd1bi5fLmdldCwgYXMuZGF0YSk7XHJcblx0XHRcdFx0XHRhcy5zb3VsID0gYXQuc291bCB8fCBjYXQuc291bCB8fCAob3B0LnV1aWQgfHwgY2F0LnJvb3QuXy5vcHQudXVpZCB8fCBHdW4udGV4dC5yYW5kb20pKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGFzLnJlZi5wdXQoYXMuZGF0YSwgYXMuc291bCwgYXMpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIG9iaiA9IEd1bi5vYmosIG9ial9pcyA9IG9iai5pcywgb2JqX3B1dCA9IG9iai5wdXQsIG9ial9tYXAgPSBvYmoubWFwO1xyXG5cdFx0dmFyIHUsIGVtcHR5ID0ge30sIG5vb3AgPSBmdW5jdGlvbigpe30sIGlpZmUgPSBmdW5jdGlvbihmbixhcyl7Zm4uY2FsbChhc3x8ZW1wdHkpfTtcclxuXHR9KShyZXF1aXJlLCAnLi9wdXQnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9yb290Jyk7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IEd1bjtcclxuXHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdGZ1bmN0aW9uIG1ldGEodixmKXtcclxuXHRcdFx0XHRpZihvYmpfaGFzKEd1bi5fXy5fLCBmKSl7IHJldHVybiB9XHJcblx0XHRcdFx0b2JqX3B1dCh0aGlzLl8sIGYsIHYpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcCh2YWx1ZSwgZmllbGQpe1xyXG5cdFx0XHRcdGlmKEd1bi5fLm5vZGUgPT09IGZpZWxkKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgbm9kZSA9IHRoaXMubm9kZSwgdmVydGV4ID0gdGhpcy52ZXJ0ZXgsIHVuaW9uID0gdGhpcy51bmlvbiwgbWFjaGluZSA9IHRoaXMubWFjaGluZTtcclxuXHRcdFx0XHR2YXIgaXMgPSBzdGF0ZV9pcyhub2RlLCBmaWVsZCksIGNzID0gc3RhdGVfaXModmVydGV4LCBmaWVsZCk7XHJcblx0XHRcdFx0aWYodSA9PT0gaXMgfHwgdSA9PT0gY3MpeyByZXR1cm4gdHJ1ZSB9IC8vIGl0IGlzIHRydWUgdGhhdCB0aGlzIGlzIGFuIGludmFsaWQgSEFNIGNvbXBhcmlzb24uXHJcblx0XHRcdFx0dmFyIGl2ID0gdmFsdWUsIGN2ID0gdmVydGV4W2ZpZWxkXTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cdFx0XHRcdC8vIFRPRE86IEJVRyEgTmVlZCB0byBjb21wYXJlIHJlbGF0aW9uIHRvIG5vdCByZWxhdGlvbiwgYW5kIGNob29zZSB0aGUgcmVsYXRpb24gaWYgdGhlcmUgaXMgYSBzdGF0ZSBjb25mbGljdC5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cdFx0XHRcdGlmKCF2YWxfaXMoaXYpICYmIHUgIT09IGl2KXsgcmV0dXJuIHRydWUgfSAvLyBVbmRlZmluZWQgaXMgb2theSBzaW5jZSBhIHZhbHVlIG1pZ2h0IG5vdCBleGlzdCBvbiBib3RoIG5vZGVzLiAvLyBpdCBpcyB0cnVlIHRoYXQgdGhpcyBpcyBhbiBpbnZhbGlkIEhBTSBjb21wYXJpc29uLlxyXG5cdFx0XHRcdGlmKCF2YWxfaXMoY3YpICYmIHUgIT09IGN2KXsgcmV0dXJuIHRydWUgfSAgLy8gVW5kZWZpbmVkIGlzIG9rYXkgc2luY2UgYSB2YWx1ZSBtaWdodCBub3QgZXhpc3Qgb24gYm90aCBub2Rlcy4gLy8gaXQgaXMgdHJ1ZSB0aGF0IHRoaXMgaXMgYW4gaW52YWxpZCBIQU0gY29tcGFyaXNvbi5cclxuXHRcdFx0XHR2YXIgSEFNID0gR3VuLkhBTShtYWNoaW5lLCBpcywgY3MsIGl2LCBjdik7XHJcblx0XHRcdFx0aWYoSEFNLmVycil7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIi4hSFlQT1RIRVRJQ0FMIEFNTkVTSUEgTUFDSElORSBFUlIhLlwiLCBmaWVsZCwgSEFNLmVycik7IC8vIHRoaXMgZXJyb3Igc2hvdWxkIG5ldmVyIGhhcHBlbi5cclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoSEFNLnN0YXRlIHx8IEhBTS5oaXN0b3JpY2FsIHx8IEhBTS5jdXJyZW50KXsgLy8gVE9ETzogQlVHISBOb3QgaW1wbGVtZW50ZWQuXHJcblx0XHRcdFx0XHQvL29wdC5sb3dlcih2ZXJ0ZXgsIHtmaWVsZDogZmllbGQsIHZhbHVlOiB2YWx1ZSwgc3RhdGU6IGlzfSk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKEhBTS5pbmNvbWluZyl7XHJcblx0XHRcdFx0XHR1bmlvbltmaWVsZF0gPSB2YWx1ZTtcclxuXHRcdFx0XHRcdHN0YXRlX2lmeSh1bmlvbiwgZmllbGQsIGlzKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoSEFNLmRlZmVyKXsgLy8gVE9ETzogQlVHISBOb3QgaW1wbGVtZW50ZWQuXHJcblx0XHRcdFx0XHR1bmlvbltmaWVsZF0gPSB2YWx1ZTsgLy8gV1JPTkchIEJVRyEgTmVlZCB0byBpbXBsZW1lbnQgY29ycmVjdCBhbGdvcml0aG0uXHJcblx0XHRcdFx0XHRzdGF0ZV9pZnkodW5pb24sIGZpZWxkLCBpcyk7IC8vIFdST05HISBCVUchIE5lZWQgdG8gaW1wbGVtZW50IGNvcnJlY3QgYWxnb3JpdGhtLlxyXG5cdFx0XHRcdFx0Ly8gZmlsbGVyIGFsZ29yaXRobSBmb3Igbm93LlxyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0Lyp1cHBlci53YWl0ID0gdHJ1ZTtcclxuXHRcdFx0XHRcdG9wdC51cHBlci5jYWxsKHN0YXRlLCB2ZXJ0ZXgsIGZpZWxkLCBpbmNvbWluZywgY3R4LmluY29taW5nLnN0YXRlKTsgLy8gc2lnbmFscyB0aGF0IHRoZXJlIGFyZSBzdGlsbCBmdXR1cmUgbW9kaWZpY2F0aW9ucy5cclxuXHRcdFx0XHRcdEd1bi5zY2hlZHVsZShjdHguaW5jb21pbmcuc3RhdGUsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRcdHVwZGF0ZShpbmNvbWluZywgZmllbGQpO1xyXG5cdFx0XHRcdFx0XHRpZihjdHguaW5jb21pbmcuc3RhdGUgPT09IHVwcGVyLm1heCl7ICh1cHBlci5sYXN0IHx8IGZ1bmN0aW9uKCl7fSkoKSB9XHJcblx0XHRcdFx0XHR9LCBndW4uX18ub3B0LnN0YXRlKTsqL1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRHdW4uSEFNLnVuaW9uID0gZnVuY3Rpb24odmVydGV4LCBub2RlLCBvcHQpe1xyXG5cdFx0XHRcdGlmKCFub2RlIHx8ICFub2RlLl8peyByZXR1cm4gfVxyXG5cdFx0XHRcdHZlcnRleCA9IHZlcnRleCB8fCBHdW4ubm9kZS5zb3VsLmlmeSh7Xzp7Jz4nOnt9fX0sIEd1bi5ub2RlLnNvdWwobm9kZSkpO1xyXG5cdFx0XHRcdGlmKCF2ZXJ0ZXggfHwgIXZlcnRleC5fKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRvcHQgPSBudW1faXMob3B0KT8ge21hY2hpbmU6IG9wdH0gOiB7bWFjaGluZTogR3VuLnN0YXRlKCl9O1xyXG5cdFx0XHRcdG9wdC51bmlvbiA9IHZlcnRleCB8fCBHdW4ub2JqLmNvcHkodmVydGV4KTsgLy8gVE9ETzogUEVSRiEgVGhpcyB3aWxsIHNsb3cgdGhpbmdzIGRvd24hXHJcblx0XHRcdFx0Ly8gVE9ETzogUEVSRiEgQmlnZ2VzdCBzbG93ZG93biAoYWZ0ZXIgMW9jYWxTdG9yYWdlKSBpcyB0aGUgYWJvdmUgbGluZS4gRml4ISBGaXghXHJcblx0XHRcdFx0b3B0LnZlcnRleCA9IHZlcnRleDtcclxuXHRcdFx0XHRvcHQubm9kZSA9IG5vZGU7XHJcblx0XHRcdFx0Ly9vYmpfbWFwKG5vZGUuXywgbWV0YSwgb3B0LnVuaW9uKTsgLy8gVE9ETzogUmV2aWV3IGF0IHNvbWUgcG9pbnQ/XHJcblx0XHRcdFx0aWYob2JqX21hcChub2RlLCBtYXAsIG9wdCkpeyAvLyBpZiB0aGlzIHJldHVybnMgdHJ1ZSB0aGVuIHNvbWV0aGluZyB3YXMgaW52YWxpZC5cclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIG9wdC51bmlvbjtcclxuXHRcdFx0fVxyXG5cdFx0XHRHdW4uSEFNLmRlbHRhID0gZnVuY3Rpb24odmVydGV4LCBub2RlLCBvcHQpe1xyXG5cdFx0XHRcdG9wdCA9IG51bV9pcyhvcHQpPyB7bWFjaGluZTogb3B0fSA6IHttYWNoaW5lOiBHdW4uc3RhdGUoKX07XHJcblx0XHRcdFx0aWYoIXZlcnRleCl7IHJldHVybiBHdW4ub2JqLmNvcHkobm9kZSkgfVxyXG5cdFx0XHRcdG9wdC5zb3VsID0gR3VuLm5vZGUuc291bChvcHQudmVydGV4ID0gdmVydGV4KTtcclxuXHRcdFx0XHRpZighb3B0LnNvdWwpeyByZXR1cm4gfVxyXG5cdFx0XHRcdG9wdC5kZWx0YSA9IEd1bi5ub2RlLnNvdWwuaWZ5KHt9LCBvcHQuc291bCk7XHJcblx0XHRcdFx0b2JqX21hcChvcHQubm9kZSA9IG5vZGUsIGRpZmYsIG9wdCk7XHJcblx0XHRcdFx0cmV0dXJuIG9wdC5kZWx0YTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBkaWZmKHZhbHVlLCBmaWVsZCl7IHZhciBvcHQgPSB0aGlzO1xyXG5cdFx0XHRcdGlmKEd1bi5fLm5vZGUgPT09IGZpZWxkKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRpZighdmFsX2lzKHZhbHVlKSl7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIG5vZGUgPSBvcHQubm9kZSwgdmVydGV4ID0gb3B0LnZlcnRleCwgaXMgPSBzdGF0ZV9pcyhub2RlLCBmaWVsZCwgdHJ1ZSksIGNzID0gc3RhdGVfaXModmVydGV4LCBmaWVsZCwgdHJ1ZSksIGRlbHRhID0gb3B0LmRlbHRhO1xyXG5cdFx0XHRcdHZhciBIQU0gPSBHdW4uSEFNKG9wdC5tYWNoaW5lLCBpcywgY3MsIHZhbHVlLCB2ZXJ0ZXhbZmllbGRdKTtcclxuXHJcblxyXG5cclxuXHRcdFx0XHQvLyBUT0RPOiBCVUchISEhIFdIQVQgQUJPVVQgREVGRVJSRUQhPz8/XHJcblx0XHRcdFx0XHJcblxyXG5cclxuXHRcdFx0XHRpZihIQU0uaW5jb21pbmcpe1xyXG5cdFx0XHRcdFx0ZGVsdGFbZmllbGRdID0gdmFsdWU7XHJcblx0XHRcdFx0XHRzdGF0ZV9pZnkoZGVsdGEsIGZpZWxkLCBpcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdEd1bi5IQU0uc3ludGggPSBmdW5jdGlvbihhdCwgZXYpe1xyXG5cdFx0XHRcdHZhciBhcyA9IHRoaXMuYXMsIGNhdCA9IGFzLmd1bi5fO1xyXG5cdFx0XHRcdGlmKCFhdC5wdXQgfHwgKGFzWycuJ10gJiYgIW9ial9oYXMoYXQucHV0W2FzWycjJ11dLCBjYXQuZ2V0KSkpe1xyXG5cdFx0XHRcdFx0aWYoY2F0LnB1dCAhPT0gdSl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRjYXQub24oJ2luJywge1xyXG5cdFx0XHRcdFx0XHRnZXQ6IGNhdC5nZXQsXHJcblx0XHRcdFx0XHRcdHB1dDogY2F0LnB1dCA9IHUsXHJcblx0XHRcdFx0XHRcdGd1bjogY2F0Lmd1bixcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGF0Lmd1biA9IGNhdC5yb290O1xyXG5cdFx0XHRcdEd1bi5vbigncHV0JywgYXQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdEd1bi5IQU0uc3ludGhfID0gZnVuY3Rpb24oYXQsIGV2LCBhcyl7IHZhciBndW4gPSB0aGlzLmFzIHx8IGFzO1xyXG5cdFx0XHRcdHZhciBjYXQgPSBndW4uXywgcm9vdCA9IGNhdC5yb290Ll8sIHB1dCA9IHt9LCB0bXA7XHJcblx0XHRcdFx0aWYoIWF0LnB1dCl7XHJcblx0XHRcdFx0XHQvL2lmKG9ial9oYXMoY2F0LCAncHV0JykpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0aWYoY2F0LnB1dCAhPT0gdSl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRjYXQub24oJ2luJywge1xyXG5cdFx0XHRcdFx0Ly9yb290LmFjayhhdFsnQCddLCB7XHJcblx0XHRcdFx0XHRcdGdldDogY2F0LmdldCxcclxuXHRcdFx0XHRcdFx0cHV0OiBjYXQucHV0ID0gdSxcclxuXHRcdFx0XHRcdFx0Z3VuOiBndW4sXHJcblx0XHRcdFx0XHRcdHZpYTogYXRcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIFRPRE86IFBFUkYhIEhhdmUgb3B0aW9ucyB0byBkZXRlcm1pbmUgaWYgdGhpcyBkYXRhIHNob3VsZCBldmVuIGJlIGluIG1lbW9yeSBvbiB0aGlzIHBlZXIhXHJcblx0XHRcdFx0b2JqX21hcChhdC5wdXQsIGZ1bmN0aW9uKG5vZGUsIHNvdWwpeyB2YXIgZ3JhcGggPSB0aGlzLmdyYXBoO1xyXG5cdFx0XHRcdFx0cHV0W3NvdWxdID0gR3VuLkhBTS5kZWx0YShncmFwaFtzb3VsXSwgbm9kZSwge2dyYXBoOiBncmFwaH0pOyAvLyBUT0RPOiBQRVJGISBTRUUgSUYgV0UgQ0FOIE9QVElNSVpFIFRISVMgQlkgTUVSR0lORyBVTklPTiBJTlRPIERFTFRBIVxyXG5cdFx0XHRcdFx0Z3JhcGhbc291bF0gPSBHdW4uSEFNLnVuaW9uKGdyYXBoW3NvdWxdLCBub2RlKSB8fCBncmFwaFtzb3VsXTtcclxuXHRcdFx0XHR9LCByb290KTtcclxuXHRcdFx0XHRpZihhdC5ndW4gIT09IHJvb3QuZ3VuKXtcclxuXHRcdFx0XHRcdHB1dCA9IGF0LnB1dDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gVE9ETzogUEVSRiEgSGF2ZSBvcHRpb25zIHRvIGRldGVybWluZSBpZiB0aGlzIGRhdGEgc2hvdWxkIGV2ZW4gYmUgaW4gbWVtb3J5IG9uIHRoaXMgcGVlciFcclxuXHRcdFx0XHRvYmpfbWFwKHB1dCwgZnVuY3Rpb24obm9kZSwgc291bCl7XHJcblx0XHRcdFx0XHR2YXIgcm9vdCA9IHRoaXMsIG5leHQgPSByb290Lm5leHQgfHwgKHJvb3QubmV4dCA9IHt9KSwgZ3VuID0gbmV4dFtzb3VsXSB8fCAobmV4dFtzb3VsXSA9IHJvb3QuZ3VuLmdldChzb3VsKSksIGNvYXQgPSAoZ3VuLl8pO1xyXG5cdFx0XHRcdFx0Y29hdC5wdXQgPSByb290LmdyYXBoW3NvdWxdOyAvLyBUT0RPOiBCVUchIENsb25lIVxyXG5cdFx0XHRcdFx0aWYoY2F0LmZpZWxkICYmICFvYmpfaGFzKG5vZGUsIGNhdC5maWVsZCkpe1xyXG5cdFx0XHRcdFx0XHQoYXQgPSBvYmpfdG8oYXQsIHt9KSkucHV0ID0gdTtcclxuXHRcdFx0XHRcdFx0R3VuLkhBTS5zeW50aChhdCwgZXYsIGNhdC5ndW4pO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjb2F0Lm9uKCdpbicsIHtcclxuXHRcdFx0XHRcdFx0cHV0OiBub2RlLFxyXG5cdFx0XHRcdFx0XHRnZXQ6IHNvdWwsXHJcblx0XHRcdFx0XHRcdGd1bjogZ3VuLFxyXG5cdFx0XHRcdFx0XHR2aWE6IGF0XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9LCByb290KTtcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHJcblx0XHR2YXIgVHlwZSA9IEd1bjtcclxuXHRcdHZhciBudW0gPSBUeXBlLm51bSwgbnVtX2lzID0gbnVtLmlzO1xyXG5cdFx0dmFyIG9iaiA9IFR5cGUub2JqLCBvYmpfaGFzID0gb2JqLmhhcywgb2JqX3B1dCA9IG9iai5wdXQsIG9ial90byA9IG9iai50bywgb2JqX21hcCA9IG9iai5tYXA7XHJcblx0XHR2YXIgbm9kZSA9IEd1bi5ub2RlLCBub2RlX3NvdWwgPSBub2RlLnNvdWwsIG5vZGVfaXMgPSBub2RlLmlzLCBub2RlX2lmeSA9IG5vZGUuaWZ5O1xyXG5cdFx0dmFyIHN0YXRlID0gR3VuLnN0YXRlLCBzdGF0ZV9pcyA9IHN0YXRlLmlzLCBzdGF0ZV9pZnkgPSBzdGF0ZS5pZnk7XHJcblx0XHR2YXIgdmFsID0gR3VuLnZhbCwgdmFsX2lzID0gdmFsLmlzLCByZWxfaXMgPSB2YWwucmVsLmlzO1xyXG5cdFx0dmFyIHU7XHJcblx0fSkocmVxdWlyZSwgJy4vaW5kZXgnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL3Jvb3QnKTtcclxuXHRcdHJlcXVpcmUoJy4vaW5kZXgnKTsgLy8gVE9ETzogQ0xFQU4gVVAhIE1FUkdFIElOVE8gUk9PVCFcclxuXHRcdHJlcXVpcmUoJy4vb3B0Jyk7XHJcblx0XHRyZXF1aXJlKCcuL2NoYWluJyk7XHJcblx0XHRyZXF1aXJlKCcuL2JhY2snKTtcclxuXHRcdHJlcXVpcmUoJy4vcHV0Jyk7XHJcblx0XHRyZXF1aXJlKCcuL2dldCcpO1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBHdW47XHJcblx0fSkocmVxdWlyZSwgJy4vY29yZScpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vY29yZScpO1xyXG5cdFx0R3VuLmNoYWluLnBhdGggPSBmdW5jdGlvbihmaWVsZCwgY2IsIG9wdCl7XHJcblx0XHRcdHZhciBiYWNrID0gdGhpcywgZ3VuID0gYmFjaywgdG1wO1xyXG5cdFx0XHRvcHQgPSBvcHQgfHwge307IG9wdC5wYXRoID0gdHJ1ZTtcclxuXHRcdFx0R3VuLmxvZy5vbmNlKFwicGF0aGluZ1wiLCBcIldhcm5pbmc6IGAucGF0aGAgdG8gYmUgcmVtb3ZlZCBmcm9tIGNvcmUgKGJ1dCBhdmFpbGFibGUgYXMgYW4gZXh0ZW5zaW9uKSwgdXNlIGAuZ2V0YCBjaGFpbnMgaW5zdGVhZC4gSWYgeW91IGFyZSBvcHBvc2VkIHRvIHRoaXMsIHBsZWFzZSB2b2ljZSB5b3VyIG9waW5pb24gaW4gaHR0cHM6Ly9naXR0ZXIuaW0vYW1hcmsvZ3VuIGFuZCBhc2sgb3RoZXJzLlwiKTtcclxuXHRcdFx0aWYoZ3VuID09PSBndW4uXy5yb290KXtpZihjYil7Y2Ioe2VycjogR3VuLmxvZyhcIkNhbid0IGRvIHRoYXQgb24gcm9vdCBpbnN0YW5jZS5cIil9KX1yZXR1cm4gZ3VufVxyXG5cdFx0XHRpZih0eXBlb2YgZmllbGQgPT09ICdzdHJpbmcnKXtcclxuXHRcdFx0XHR0bXAgPSBmaWVsZC5zcGxpdChvcHQuc3BsaXQgfHwgJy4nKTtcclxuXHRcdFx0XHRpZigxID09PSB0bXAubGVuZ3RoKXtcclxuXHRcdFx0XHRcdGd1biA9IGJhY2suZ2V0KGZpZWxkLCBjYiwgb3B0KTtcclxuXHRcdFx0XHRcdGd1bi5fLm9wdCA9IG9wdDtcclxuXHRcdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZpZWxkID0gdG1wO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGZpZWxkIGluc3RhbmNlb2YgQXJyYXkpe1xyXG5cdFx0XHRcdGlmKGZpZWxkLmxlbmd0aCA+IDEpe1xyXG5cdFx0XHRcdFx0Z3VuID0gYmFjaztcclxuXHRcdFx0XHRcdHZhciBpID0gMCwgbCA9IGZpZWxkLmxlbmd0aDtcclxuXHRcdFx0XHRcdGZvcihpOyBpIDwgbDsgaSsrKXtcclxuXHRcdFx0XHRcdFx0Z3VuID0gZ3VuLmdldChmaWVsZFtpXSwgKGkrMSA9PT0gbCk/IGNiIDogbnVsbCwgb3B0KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vZ3VuLmJhY2sgPSBiYWNrOyAvLyBUT0RPOiBBUEkgY2hhbmdlIVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRndW4gPSBiYWNrLmdldChmaWVsZFswXSwgY2IsIG9wdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGd1bi5fLm9wdCA9IG9wdDtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCFmaWVsZCAmJiAwICE9IGZpZWxkKXtcclxuXHRcdFx0XHRyZXR1cm4gYmFjaztcclxuXHRcdFx0fVxyXG5cdFx0XHRndW4gPSBiYWNrLmdldCgnJytmaWVsZCwgY2IsIG9wdCk7XHJcblx0XHRcdGd1bi5fLm9wdCA9IG9wdDtcclxuXHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdH1cclxuXHR9KShyZXF1aXJlLCAnLi9wYXRoJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9jb3JlJyk7XHJcblx0XHRHdW4uY2hhaW4ub24gPSBmdW5jdGlvbih0YWcsIGFyZywgZWFzLCBhcyl7XHJcblx0XHRcdHZhciBndW4gPSB0aGlzLCBhdCA9IGd1bi5fLCB0bXAsIGFjdCwgb2ZmO1xyXG5cdFx0XHRpZih0eXBlb2YgdGFnID09PSAnc3RyaW5nJyl7XHJcblx0XHRcdFx0aWYoIWFyZyl7IHJldHVybiBhdC5vbih0YWcpIH1cclxuXHRcdFx0XHRhY3QgPSBhdC5vbih0YWcsIGFyZywgZWFzIHx8IGF0LCBhcyk7XHJcblx0XHRcdFx0aWYoZWFzICYmIGVhcy5ndW4pe1xyXG5cdFx0XHRcdFx0KGVhcy5zdWJzIHx8IChlYXMuc3VicyA9IFtdKSkucHVzaChhY3QpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRvZmYgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGlmIChhY3QgJiYgYWN0Lm9mZikgYWN0Lm9mZigpO1xyXG5cdFx0XHRcdFx0b2ZmLm9mZigpO1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0b2ZmLm9mZiA9IGd1bi5vZmYuYmluZChndW4pIHx8IG5vb3A7XHJcblx0XHRcdFx0Z3VuLm9mZiA9IG9mZjtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBvcHQgPSBhcmc7XHJcblx0XHRcdG9wdCA9ICh0cnVlID09PSBvcHQpPyB7Y2hhbmdlOiB0cnVlfSA6IG9wdCB8fCB7fTtcclxuXHRcdFx0b3B0Lm9rID0gdGFnO1xyXG5cdFx0XHRvcHQubGFzdCA9IHt9O1xyXG5cdFx0XHRndW4uZ2V0KG9rLCBvcHQpOyAvLyBUT0RPOiBQRVJGISBFdmVudCBsaXN0ZW5lciBsZWFrISEhPz8/P1xyXG5cdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIG9rKGF0LCBldil7IHZhciBvcHQgPSB0aGlzO1xyXG5cdFx0XHR2YXIgZ3VuID0gYXQuZ3VuLCBjYXQgPSBndW4uXywgZGF0YSA9IGNhdC5wdXQgfHwgYXQucHV0LCB0bXAgPSBvcHQubGFzdCwgaWQgPSBjYXQuaWQrYXQuZ2V0LCB0bXA7XHJcblx0XHRcdGlmKHUgPT09IGRhdGEpe1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihkYXRhICYmIGRhdGFbcmVsLl9dICYmICh0bXAgPSByZWwuaXMoZGF0YSkpKXtcclxuXHRcdFx0XHR0bXAgPSAoY2F0LnJvb3QuZ2V0KHRtcCkuXyk7XHJcblx0XHRcdFx0aWYodSA9PT0gdG1wLnB1dCl7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGRhdGEgPSB0bXAucHV0O1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKG9wdC5jaGFuZ2UpeyAvLyBUT0RPOiBCVUc/IE1vdmUgYWJvdmUgdGhlIHVuZGVmIGNoZWNrcz9cclxuXHRcdFx0XHRkYXRhID0gYXQucHV0O1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIERFRFVQTElDQVRFIC8vIFRPRE86IE5FRURTIFdPUkshIEJBRCBQUk9UT1RZUEVcclxuXHRcdFx0aWYodG1wLnB1dCA9PT0gZGF0YSAmJiB0bXAuZ2V0ID09PSBpZCAmJiAhR3VuLm5vZGUuc291bChkYXRhKSl7IHJldHVybiB9XHJcblx0XHRcdHRtcC5wdXQgPSBkYXRhO1xyXG5cdFx0XHR0bXAuZ2V0ID0gaWQ7XHJcblx0XHRcdC8vIERFRFVQTElDQVRFIC8vIFRPRE86IE5FRURTIFdPUkshIEJBRCBQUk9UT1RZUEVcclxuXHRcdFx0Y2F0Lmxhc3QgPSBkYXRhO1xyXG5cdFx0XHRpZihvcHQuYXMpe1xyXG5cdFx0XHRcdG9wdC5vay5jYWxsKG9wdC5hcywgYXQsIGV2KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRvcHQub2suY2FsbChndW4sIGRhdGEsIGF0LmdldCwgYXQsIGV2KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdEd1bi5jaGFpbi52YWwgPSBmdW5jdGlvbihjYiwgb3B0KXtcclxuXHRcdFx0dmFyIGd1biA9IHRoaXMsIGF0ID0gZ3VuLl8sIGRhdGEgPSBhdC5wdXQ7XHJcblx0XHRcdGlmKDAgPCBhdC5hY2sgJiYgdSAhPT0gZGF0YSl7XHJcblx0XHRcdFx0KGNiIHx8IG5vb3ApLmNhbGwoZ3VuLCBkYXRhLCBhdC5nZXQpO1xyXG5cdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY2Ipe1xyXG5cdFx0XHRcdChvcHQgPSBvcHQgfHwge30pLm9rID0gY2I7XHJcblx0XHRcdFx0b3B0LmNhdCA9IGF0O1xyXG5cdFx0XHRcdGd1bi5nZXQodmFsLCB7YXM6IG9wdH0pO1xyXG5cdFx0XHRcdG9wdC5hc3luYyA9IHRydWU7IC8vb3B0LmFzeW5jID0gYXQuc3R1bj8gMSA6IHRydWU7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0R3VuLmxvZy5vbmNlKFwidmFsb25jZVwiLCBcIkNoYWluYWJsZSB2YWwgaXMgZXhwZXJpbWVudGFsLCBpdHMgYmVoYXZpb3IgYW5kIEFQSSBtYXkgY2hhbmdlIG1vdmluZyBmb3J3YXJkLiBQbGVhc2UgcGxheSB3aXRoIGl0IGFuZCByZXBvcnQgYnVncyBhbmQgaWRlYXMgb24gaG93IHRvIGltcHJvdmUgaXQuXCIpO1xyXG5cdFx0XHRcdHZhciBjaGFpbiA9IGd1bi5jaGFpbigpO1xyXG5cdFx0XHRcdGNoYWluLl8udmFsID0gZ3VuLnZhbChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0Y2hhaW4uXy5vbignaW4nLCBndW4uXyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0cmV0dXJuIGNoYWluO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBndW47XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gdmFsKGF0LCBldiwgdG8pe1xyXG5cdFx0XHR2YXIgb3B0ID0gdGhpcy5hcywgY2F0ID0gb3B0LmNhdCwgZ3VuID0gYXQuZ3VuLCBjb2F0ID0gZ3VuLl8sIGRhdGEgPSBjb2F0LnB1dCB8fCBhdC5wdXQsIHRtcDtcclxuXHRcdFx0aWYodSA9PT0gZGF0YSl7XHJcblx0XHRcdFx0Ly9yZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoZGF0YSAmJiBkYXRhW3JlbC5fXSAmJiAodG1wID0gcmVsLmlzKGRhdGEpKSl7XHJcblx0XHRcdFx0dG1wID0gKGNhdC5yb290LmdldCh0bXApLl8pO1xyXG5cdFx0XHRcdGlmKHUgPT09IHRtcC5wdXQpe1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRkYXRhID0gdG1wLnB1dDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihldi53YWl0KXsgY2xlYXJUaW1lb3V0KGV2LndhaXQpIH1cclxuXHRcdFx0Ly9pZighdG8gJiYgKCEoMCA8IGNvYXQuYWNrKSB8fCAoKHRydWUgPT09IG9wdC5hc3luYykgJiYgMCAhPT0gb3B0LndhaXQpKSl7XHJcblx0XHRcdGlmKCFvcHQuYXN5bmMpe1xyXG5cdFx0XHRcdGV2LndhaXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHR2YWwuY2FsbCh7YXM6b3B0fSwgYXQsIGV2LCBldi53YWl0IHx8IDEpXHJcblx0XHRcdFx0fSwgb3B0LndhaXQgfHwgOTkpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjYXQuZmllbGQgfHwgY2F0LnNvdWwpe1xyXG5cdFx0XHRcdGlmKGV2Lm9mZigpKXsgcmV0dXJuIH0gLy8gaWYgaXQgaXMgYWxyZWFkeSBvZmYsIGRvbid0IGNhbGwgYWdhaW4hXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYoKG9wdC5zZWVuID0gb3B0LnNlZW4gfHwge30pW2NvYXQuaWRdKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRvcHQuc2Vlbltjb2F0LmlkXSA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0b3B0Lm9rLmNhbGwoYXQuZ3VuIHx8IG9wdC5ndW4sIGRhdGEsIGF0LmdldCk7XHJcblx0XHR9XHJcblxyXG5cdFx0R3VuLmNoYWluLm9mZiA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBndW4gPSB0aGlzLCBhdCA9IGd1bi5fLCB0bXA7XHJcblx0XHRcdHZhciBiYWNrID0gYXQuYmFjayB8fCB7fSwgY2F0ID0gYmFjay5fO1xyXG5cdFx0XHRpZighY2F0KXsgcmV0dXJuIH1cclxuXHRcdFx0aWYodG1wID0gY2F0Lm5leHQpe1xyXG5cdFx0XHRcdGlmKHRtcFthdC5nZXRdKXtcclxuXHRcdFx0XHRcdG9ial9kZWwodG1wLCBhdC5nZXQpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRvYmpfbWFwKHRtcCwgZnVuY3Rpb24ocGF0aCwga2V5KXtcclxuXHRcdFx0XHRcdFx0aWYoZ3VuICE9PSBwYXRoKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdFx0b2JqX2RlbCh0bXAsIGtleSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoKHRtcCA9IGd1bi5iYWNrKC0xKSkgPT09IGJhY2spe1xyXG5cdFx0XHRcdG9ial9kZWwodG1wLmdyYXBoLCBhdC5nZXQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGF0Lm9ucyAmJiAodG1wID0gYXQub25zWydAJCddKSl7XHJcblx0XHRcdFx0b2JqX21hcCh0bXAucywgZnVuY3Rpb24oZXYpe1xyXG5cdFx0XHRcdFx0ZXYub2ZmKCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdH1cclxuXHRcdHZhciBvYmogPSBHdW4ub2JqLCBvYmpfaGFzID0gb2JqLmhhcywgb2JqX2RlbCA9IG9iai5kZWwsIG9ial90byA9IG9iai50bztcclxuXHRcdHZhciByZWwgPSBHdW4udmFsLnJlbDtcclxuXHRcdHZhciBlbXB0eSA9IHt9LCBub29wID0gZnVuY3Rpb24oKXt9LCB1O1xyXG5cdH0pKHJlcXVpcmUsICcuL29uJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9jb3JlJyksIHU7XHJcblx0XHRHdW4uY2hhaW4ubm90ID0gZnVuY3Rpb24oY2IsIG9wdCwgdCl7XHJcblx0XHRcdEd1bi5sb2cub25jZShcIm5vdHRvYmVcIiwgXCJXYXJuaW5nOiBgLm5vdGAgdG8gYmUgcmVtb3ZlZCBmcm9tIGNvcmUgKGJ1dCBhdmFpbGFibGUgYXMgYW4gZXh0ZW5zaW9uKSwgdXNlIGAudmFsYCBpbnN0ZWFkLCB3aGljaCBub3cgc3VwcG9ydHMgKHYwLjcueCspICdub3QgZm91bmQgZGF0YScgYXMgYHVuZGVmaW5lZGAgZGF0YSBpbiBjYWxsYmFja3MuIElmIHlvdSBhcmUgb3Bwb3NlZCB0byB0aGlzLCBwbGVhc2Ugdm9pY2UgeW91ciBvcGluaW9uIGluIGh0dHBzOi8vZ2l0dGVyLmltL2FtYXJrL2d1biBhbmQgYXNrIG90aGVycy5cIik7XHJcblx0XHRcdHJldHVybiB0aGlzLmdldChvdWdodCwge25vdDogY2J9KTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIG91Z2h0KGF0LCBldil7IGV2Lm9mZigpO1xyXG5cdFx0XHRpZihhdC5lcnIgfHwgKHUgIT09IGF0LnB1dCkpeyByZXR1cm4gfVxyXG5cdFx0XHRpZighdGhpcy5ub3QpeyByZXR1cm4gfVxyXG5cdFx0XHR0aGlzLm5vdC5jYWxsKGF0Lmd1biwgYXQuZ2V0LCBmdW5jdGlvbigpeyBjb25zb2xlLmxvZyhcIlBsZWFzZSByZXBvcnQgdGhpcyBidWcgb24gaHR0cHM6Ly9naXR0ZXIuaW0vYW1hcmsvZ3VuIGFuZCBpbiB0aGUgaXNzdWVzLlwiKTsgbmVlZC50by5pbXBsZW1lbnQ7IH0pO1xyXG5cdFx0fVxyXG5cdH0pKHJlcXVpcmUsICcuL25vdCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vY29yZScpO1xyXG5cdFx0R3VuLmNoYWluLm1hcCA9IGZ1bmN0aW9uKGNiLCBvcHQsIHQpe1xyXG5cdFx0XHR2YXIgZ3VuID0gdGhpcywgY2F0ID0gZ3VuLl8sIGNoYWluO1xyXG5cdFx0XHRpZighY2Ipe1xyXG5cdFx0XHRcdGlmKGNoYWluID0gY2F0LmZpZWxkcyl7IHJldHVybiBjaGFpbiB9XHJcblx0XHRcdFx0Y2hhaW4gPSBjYXQuZmllbGRzID0gZ3VuLmNoYWluKCk7XHJcblx0XHRcdFx0Y2hhaW4uXy52YWwgPSBndW4uYmFjaygndmFsJyk7XHJcblx0XHRcdFx0Z3VuLm9uKCdpbicsIG1hcCwgY2hhaW4uXyk7XHJcblx0XHRcdFx0cmV0dXJuIGNoYWluO1xyXG5cdFx0XHR9XHJcblx0XHRcdEd1bi5sb2cub25jZShcIm1hcGZuXCIsIFwiTWFwIGZ1bmN0aW9ucyBhcmUgZXhwZXJpbWVudGFsLCB0aGVpciBiZWhhdmlvciBhbmQgQVBJIG1heSBjaGFuZ2UgbW92aW5nIGZvcndhcmQuIFBsZWFzZSBwbGF5IHdpdGggaXQgYW5kIHJlcG9ydCBidWdzIGFuZCBpZGVhcyBvbiBob3cgdG8gaW1wcm92ZSBpdC5cIik7XHJcblx0XHRcdGNoYWluID0gZ3VuLmNoYWluKCk7XHJcblx0XHRcdGd1bi5tYXAoKS5vbihmdW5jdGlvbihkYXRhLCBrZXksIGF0LCBldil7XHJcblx0XHRcdFx0dmFyIG5leHQgPSAoY2J8fG5vb3ApLmNhbGwodGhpcywgZGF0YSwga2V5LCBhdCwgZXYpO1xyXG5cdFx0XHRcdGlmKHUgPT09IG5leHQpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGlmKEd1bi5pcyhuZXh0KSl7XHJcblx0XHRcdFx0XHRjaGFpbi5fLm9uKCdpbicsIG5leHQuXyk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNoYWluLl8ub24oJ2luJywge2dldDoga2V5LCBwdXQ6IG5leHQsIGd1bjogY2hhaW59KTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBjaGFpbjtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIG1hcChhdCl7XHJcblx0XHRcdGlmKCFhdC5wdXQgfHwgR3VuLnZhbC5pcyhhdC5wdXQpKXsgcmV0dXJuIH1cclxuXHRcdFx0aWYodGhpcy5hcy52YWwpeyB0aGlzLm9mZigpIH0gLy8gVE9ETzogVWdseSBoYWNrIVxyXG5cdFx0XHRvYmpfbWFwKGF0LnB1dCwgZWFjaCwge2NhdDogdGhpcy5hcywgZ3VuOiBhdC5ndW59KTtcclxuXHRcdFx0dGhpcy50by5uZXh0KGF0KTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIGVhY2godixmKXtcclxuXHRcdFx0aWYobl8gPT09IGYpeyByZXR1cm4gfVxyXG5cdFx0XHR2YXIgY2F0ID0gdGhpcy5jYXQsIGd1biA9IHRoaXMuZ3VuLmdldChmKSwgYXQgPSAoZ3VuLl8pO1xyXG5cdFx0XHQoYXQuZWNobyB8fCAoYXQuZWNobyA9IHt9KSlbY2F0LmlkXSA9IGNhdDtcclxuXHRcdH1cclxuXHRcdHZhciBvYmpfbWFwID0gR3VuLm9iai5tYXAsIG5vb3AgPSBmdW5jdGlvbigpe30sIGV2ZW50ID0ge3N0dW46IG5vb3AsIG9mZjogbm9vcH0sIG5fID0gR3VuLm5vZGUuXywgdTtcclxuXHR9KShyZXF1aXJlLCAnLi9tYXAnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL2NvcmUnKTtcclxuXHRcdEd1bi5jaGFpbi5zZXQgPSBmdW5jdGlvbihpdGVtLCBjYiwgb3B0KXtcclxuXHRcdFx0dmFyIGd1biA9IHRoaXMsIHNvdWw7XHJcblx0XHRcdGNiID0gY2IgfHwgZnVuY3Rpb24oKXt9O1xyXG5cdFx0XHRpZihzb3VsID0gR3VuLm5vZGUuc291bChpdGVtKSl7IHJldHVybiBndW4uc2V0KGd1bi5iYWNrKC0xKS5nZXQoc291bCksIGNiLCBvcHQpIH1cclxuXHRcdFx0aWYoIUd1bi5pcyhpdGVtKSl7XHJcblx0XHRcdFx0aWYoR3VuLm9iai5pcyhpdGVtKSl7IHJldHVybiBndW4uc2V0KGd1bi5fLnJvb3QucHV0KGl0ZW0pLCBjYiwgb3B0KSB9XHJcblx0XHRcdFx0cmV0dXJuIGd1bi5nZXQoR3VuLnRleHQucmFuZG9tKCkpLnB1dChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpdGVtLmdldCgnXycpLmdldChmdW5jdGlvbihhdCwgZXYpe1xyXG5cdFx0XHRcdGlmKCFhdC5ndW4gfHwgIWF0Lmd1bi5fLmJhY2spO1xyXG5cdFx0XHRcdGV2Lm9mZigpO1xyXG5cdFx0XHRcdGF0ID0gKGF0Lmd1bi5fLmJhY2suXyk7XHJcblx0XHRcdFx0dmFyIHB1dCA9IHt9LCBub2RlID0gYXQucHV0LCBzb3VsID0gR3VuLm5vZGUuc291bChub2RlKTtcclxuXHRcdFx0XHRpZighc291bCl7IHJldHVybiBjYi5jYWxsKGd1biwge2VycjogR3VuLmxvZygnT25seSBhIG5vZGUgY2FuIGJlIGxpbmtlZCEgTm90IFwiJyArIG5vZGUgKyAnXCIhJyl9KSB9XHJcblx0XHRcdFx0Z3VuLnB1dChHdW4ub2JqLnB1dChwdXQsIHNvdWwsIEd1bi52YWwucmVsLmlmeShzb3VsKSksIGNiLCBvcHQpO1xyXG5cdFx0XHR9LHt3YWl0OjB9KTtcclxuXHRcdFx0cmV0dXJuIGl0ZW07XHJcblx0XHR9XHJcblx0fSkocmVxdWlyZSwgJy4vc2V0Jyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHRpZih0eXBlb2YgR3VuID09PSAndW5kZWZpbmVkJyl7IHJldHVybiB9IC8vIFRPRE86IGxvY2FsU3RvcmFnZSBpcyBCcm93c2VyIG9ubHkuIEJ1dCBpdCB3b3VsZCBiZSBuaWNlIGlmIGl0IGNvdWxkIHNvbWVob3cgcGx1Z2luIGludG8gTm9kZUpTIGNvbXBhdGlibGUgbG9jYWxTdG9yYWdlIEFQSXM/XHJcblxyXG5cdFx0dmFyIHJvb3QsIG5vb3AgPSBmdW5jdGlvbigpe30sIHU7XHJcblx0XHRpZih0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyl7IHJvb3QgPSB3aW5kb3cgfVxyXG5cdFx0dmFyIHN0b3JlID0gcm9vdC5sb2NhbFN0b3JhZ2UgfHwge3NldEl0ZW06IG5vb3AsIHJlbW92ZUl0ZW06IG5vb3AsIGdldEl0ZW06IG5vb3B9O1xyXG5cclxuXHRcdHZhciBjaGVjayA9IHt9LCBkaXJ0eSA9IHt9LCBhc3luYyA9IHt9LCBjb3VudCA9IDAsIG1heCA9IDEwMDAwLCB3YWl0O1xyXG5cdFx0XHJcblx0XHRHdW4ub24oJ3B1dCcsIGZ1bmN0aW9uKGF0KXsgdmFyIGVyciwgaWQsIG9wdCwgcm9vdCA9IGF0Lmd1bi5fLnJvb3Q7XHJcblx0XHRcdHRoaXMudG8ubmV4dChhdCk7XHJcblx0XHRcdChvcHQgPSB7fSkucHJlZml4ID0gKGF0Lm9wdCB8fCBvcHQpLnByZWZpeCB8fCBhdC5ndW4uYmFjaygnb3B0LnByZWZpeCcpIHx8ICdndW4vJztcclxuXHRcdFx0dmFyIGdyYXBoID0gcm9vdC5fLmdyYXBoO1xyXG5cdFx0XHRHdW4ub2JqLm1hcChhdC5wdXQsIGZ1bmN0aW9uKG5vZGUsIHNvdWwpe1xyXG5cdFx0XHRcdGFzeW5jW3NvdWxdID0gYXN5bmNbc291bF0gfHwgZ3JhcGhbc291bF0gfHwgbm9kZTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdGNvdW50ICs9IDE7XHJcblx0XHRcdGNoZWNrW2F0WycjJ11dID0gcm9vdDtcclxuXHRcdFx0ZnVuY3Rpb24gc2F2ZSgpe1xyXG5cdFx0XHRcdGNsZWFyVGltZW91dCh3YWl0KTtcclxuXHRcdFx0XHR2YXIgYWNrID0gY2hlY2s7XHJcblx0XHRcdFx0dmFyIGFsbCA9IGFzeW5jO1xyXG5cdFx0XHRcdGNvdW50ID0gMDtcclxuXHRcdFx0XHR3YWl0ID0gZmFsc2U7XHJcblx0XHRcdFx0Y2hlY2sgPSB7fTtcclxuXHRcdFx0XHRhc3luYyA9IHt9O1xyXG5cdFx0XHRcdEd1bi5vYmoubWFwKGFsbCwgZnVuY3Rpb24obm9kZSwgc291bCl7XHJcblx0XHRcdFx0XHQvLyBTaW5jZSBsb2NhbFN0b3JhZ2Ugb25seSBoYXMgNU1CLCBpdCBpcyBiZXR0ZXIgdGhhdCB3ZSBrZWVwIG9ubHlcclxuXHRcdFx0XHRcdC8vIHRoZSBkYXRhIHRoYXQgdGhlIHVzZXIgaXMgY3VycmVudGx5IGludGVyZXN0ZWQgaW4uXHJcblx0XHRcdFx0XHRub2RlID0gZ3JhcGhbc291bF0gfHwgYWxsW3NvdWxdIHx8IG5vZGU7XHJcblx0XHRcdFx0XHR0cnl7c3RvcmUuc2V0SXRlbShvcHQucHJlZml4ICsgc291bCwgSlNPTi5zdHJpbmdpZnkobm9kZSkpO1xyXG5cdFx0XHRcdFx0fWNhdGNoKGUpeyBlcnIgPSBlIHx8IFwibG9jYWxTdG9yYWdlIGZhaWx1cmVcIiB9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0aWYoIUd1bi5vYmouZW1wdHkoYXQuZ3VuLmJhY2soJ29wdC5wZWVycycpKSl7IHJldHVybiB9IC8vIG9ubHkgYWNrIGlmIHRoZXJlIGFyZSBubyBwZWVycy5cclxuXHRcdFx0XHRHdW4ub2JqLm1hcChhY2ssIGZ1bmN0aW9uKHJvb3QsIGlkKXtcclxuXHRcdFx0XHRcdHJvb3Qub24oJ2luJywge1xyXG5cdFx0XHRcdFx0XHQnQCc6IGlkLFxyXG5cdFx0XHRcdFx0XHRlcnI6IGVycixcclxuXHRcdFx0XHRcdFx0b2s6IDAgLy8gbG9jYWxTdG9yYWdlIGlzbid0IHJlbGlhYmxlLCBzbyBtYWtlIGl0cyBgb2tgIGNvZGUgYmUgYSBsb3cgbnVtYmVyLlxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY291bnQgPj0gbWF4KXsgLy8gZ29hbCBpcyB0byBkbyAxMEsgaW5zZXJ0cy9zZWNvbmQuXHJcblx0XHRcdFx0cmV0dXJuIHNhdmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih3YWl0KXsgcmV0dXJuIH1cclxuXHRcdFx0Y2xlYXJUaW1lb3V0KHdhaXQpO1xyXG5cdFx0XHR3YWl0ID0gc2V0VGltZW91dChzYXZlLCAxMDAwKTtcclxuXHRcdH0pO1xyXG5cdFx0R3VuLm9uKCdnZXQnLCBmdW5jdGlvbihhdCl7XHJcblx0XHRcdHRoaXMudG8ubmV4dChhdCk7XHJcblx0XHRcdHZhciBndW4gPSBhdC5ndW4sIGxleCA9IGF0LmdldCwgc291bCwgZGF0YSwgb3B0LCB1O1xyXG5cdFx0XHQvL3NldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0KG9wdCA9IGF0Lm9wdCB8fCB7fSkucHJlZml4ID0gb3B0LnByZWZpeCB8fCBhdC5ndW4uYmFjaygnb3B0LnByZWZpeCcpIHx8ICdndW4vJztcclxuXHRcdFx0aWYoIWxleCB8fCAhKHNvdWwgPSBsZXhbR3VuLl8uc291bF0pKXsgcmV0dXJuIH1cclxuXHRcdFx0Ly9pZigwID49IGF0LmNhcCl7IHJldHVybiB9XHJcblx0XHRcdHZhciBmaWVsZCA9IGxleFsnLiddO1xyXG5cdFx0XHRkYXRhID0gR3VuLm9iai5pZnkoc3RvcmUuZ2V0SXRlbShvcHQucHJlZml4ICsgc291bCkgfHwgbnVsbCkgfHwgYXN5bmNbc291bF0gfHwgdTtcclxuXHRcdFx0aWYoZGF0YSAmJiBmaWVsZCl7XHJcblx0XHRcdFx0ZGF0YSA9IEd1bi5zdGF0ZS50byhkYXRhLCBmaWVsZCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoIWRhdGEgJiYgIUd1bi5vYmouZW1wdHkoZ3VuLmJhY2soJ29wdC5wZWVycycpKSl7IC8vIGlmIGRhdGEgbm90IGZvdW5kLCBkb24ndCBhY2sgaWYgdGhlcmUgYXJlIHBlZXJzLlxyXG5cdFx0XHRcdHJldHVybjsgLy8gSG1tLCB3aGF0IGlmIHdlIGhhdmUgcGVlcnMgYnV0IHdlIGFyZSBkaXNjb25uZWN0ZWQ/XHJcblx0XHRcdH1cclxuXHRcdFx0Z3VuLm9uKCdpbicsIHsnQCc6IGF0WycjJ10sIHB1dDogR3VuLmdyYXBoLm5vZGUoZGF0YSksIGhvdzogJ2xTJ30pO1xyXG5cdFx0XHQvL30sMTEpO1xyXG5cdFx0fSk7XHJcblx0fSkocmVxdWlyZSwgJy4vYWRhcHRlcnMvbG9jYWxTdG9yYWdlJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9jb3JlJyk7XHJcblxyXG5cdFx0aWYgKHR5cGVvZiBKU09OID09PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXHJcblx0XHRcdFx0J0d1biBkZXBlbmRzIG9uIEpTT04uIFBsZWFzZSBsb2FkIGl0IGZpcnN0OlxcbicgK1xyXG5cdFx0XHRcdCdhamF4LmNkbmpzLmNvbS9hamF4L2xpYnMvanNvbjIvMjAxMTAyMjMvanNvbjIuanMnXHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIFdlYlNvY2tldDtcclxuXHRcdGlmKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKXtcclxuXHRcdFx0V2ViU29ja2V0ID0gd2luZG93LldlYlNvY2tldCB8fCB3aW5kb3cud2Via2l0V2ViU29ja2V0IHx8IHdpbmRvdy5tb3pXZWJTb2NrZXQ7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHR2YXIgbWVzc2FnZSwgY291bnQgPSAwLCBub29wID0gZnVuY3Rpb24oKXt9LCB3YWl0O1xyXG5cclxuXHRcdEd1bi5vbignb3V0JywgZnVuY3Rpb24oYXQpe1xyXG5cdFx0XHR0aGlzLnRvLm5leHQoYXQpO1xyXG5cdFx0XHR2YXIgY2F0ID0gYXQuZ3VuLl8ucm9vdC5fLCB3c3AgPSBjYXQud3NwIHx8IChjYXQud3NwID0ge30pO1xyXG5cdFx0XHRpZihhdC53c3AgJiYgMSA9PT0gd3NwLmNvdW50KXsgcmV0dXJuIH0gLy8gaWYgdGhlIG1lc3NhZ2UgY2FtZSBGUk9NIHRoZSBvbmx5IHBlZXIgd2UgYXJlIGNvbm5lY3RlZCB0bywgZG9uJ3QgZWNobyBpdCBiYWNrLlxyXG5cdFx0XHRtZXNzYWdlID0gSlNPTi5zdHJpbmdpZnkoYXQpO1xyXG5cdFx0XHQvL2lmKCsrY291bnQpeyBjb25zb2xlLmxvZyhcIm1zZyBPVVQ6XCIsIGNvdW50LCBHdW4ub2JqLmlmeShtZXNzYWdlKSkgfVxyXG5cdFx0XHRpZihjYXQudWRyYWluKXtcclxuXHRcdFx0XHRjYXQudWRyYWluLnB1c2gobWVzc2FnZSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhdC51ZHJhaW4gPSBbXTtcclxuXHRcdFx0Y2xlYXJUaW1lb3V0KHdhaXQpO1xyXG5cdFx0XHR3YWl0ID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdGlmKCFjYXQudWRyYWluKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgdG1wID0gY2F0LnVkcmFpbjtcclxuXHRcdFx0XHRjYXQudWRyYWluID0gbnVsbDtcclxuXHRcdFx0XHRpZiggdG1wLmxlbmd0aCApIHtcclxuXHRcdFx0XHRcdG1lc3NhZ2UgPSBKU09OLnN0cmluZ2lmeSh0bXApO1xyXG5cdFx0XHRcdFx0R3VuLm9iai5tYXAoY2F0Lm9wdC5wZWVycywgc2VuZCwgY2F0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sMSk7XHJcblx0XHRcdHdzcC5jb3VudCA9IDA7XHJcblx0XHRcdEd1bi5vYmoubWFwKGNhdC5vcHQucGVlcnMsIHNlbmQsIGNhdCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRmdW5jdGlvbiBzZW5kKHBlZXIpe1xyXG5cdFx0XHR2YXIgbXNnID0gbWVzc2FnZSwgY2F0ID0gdGhpcztcclxuXHRcdFx0dmFyIHdpcmUgPSBwZWVyLndpcmUgfHwgb3BlbihwZWVyLCBjYXQpO1xyXG5cdFx0XHRpZihjYXQud3NwKXsgY2F0LndzcC5jb3VudCsrIH1cclxuXHRcdFx0aWYoIXdpcmUpeyByZXR1cm4gfVxyXG5cdFx0XHRpZih3aXJlLnJlYWR5U3RhdGUgPT09IHdpcmUuT1BFTil7XHJcblx0XHRcdFx0d2lyZS5zZW5kKG1zZyk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdChwZWVyLnF1ZXVlID0gcGVlci5xdWV1ZSB8fCBbXSkucHVzaChtc2cpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHJlY2VpdmUobXNnLCBwZWVyLCBjYXQpe1xyXG5cdFx0XHRpZighY2F0IHx8ICFtc2cpeyByZXR1cm4gfVxyXG5cdFx0XHR0cnl7bXNnID0gSlNPTi5wYXJzZShtc2cuZGF0YSB8fCBtc2cpO1xyXG5cdFx0XHR9Y2F0Y2goZSl7fVxyXG5cdFx0XHRpZihtc2cgaW5zdGFuY2VvZiBBcnJheSl7XHJcblx0XHRcdFx0dmFyIGkgPSAwLCBtO1xyXG5cdFx0XHRcdHdoaWxlKG0gPSBtc2dbaSsrXSl7XHJcblx0XHRcdFx0XHRyZWNlaXZlKG0sIHBlZXIsIGNhdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHQvL2lmKCsrY291bnQpeyBjb25zb2xlLmxvZyhcIm1zZyBpbjpcIiwgY291bnQsIG1zZy5ib2R5IHx8IG1zZykgfVxyXG5cdFx0XHRpZihjYXQud3NwICYmIDEgPT09IGNhdC53c3AuY291bnQpeyAobXNnLmJvZHkgfHwgbXNnKS53c3AgPSBub29wIH0gLy8gSWYgdGhlcmUgaXMgb25seSAxIGNsaWVudCwganVzdCB1c2Ugbm9vcCBzaW5jZSBpdCBkb2Vzbid0IG1hdHRlci5cclxuXHRcdFx0Y2F0Lmd1bi5vbignaW4nLCBtc2cuYm9keSB8fCBtc2cpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIG9wZW4ocGVlciwgYXMpe1xyXG5cdFx0XHRpZighcGVlciB8fCAhcGVlci51cmwpeyByZXR1cm4gfVxyXG5cdFx0XHR2YXIgdXJsID0gcGVlci51cmwucmVwbGFjZSgnaHR0cCcsICd3cycpO1xyXG5cdFx0XHR2YXIgd2lyZSA9IHBlZXIud2lyZSA9IG5ldyBXZWJTb2NrZXQodXJsLCBhcy5vcHQud3NjLnByb3RvY29scywgYXMub3B0LndzYyApO1xyXG5cdFx0XHR3aXJlLm9uY2xvc2UgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHJlY29ubmVjdChwZWVyLCBhcyk7XHJcblx0XHRcdH07XHJcblx0XHRcdHdpcmUub25lcnJvciA9IGZ1bmN0aW9uKGVycm9yKXtcclxuXHRcdFx0XHRyZWNvbm5lY3QocGVlciwgYXMpO1xyXG5cdFx0XHRcdGlmKCFlcnJvcil7IHJldHVybiB9XHJcblx0XHRcdFx0aWYoZXJyb3IuY29kZSA9PT0gJ0VDT05OUkVGVVNFRCcpe1xyXG5cdFx0XHRcdFx0Ly9yZWNvbm5lY3QocGVlciwgYXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0d2lyZS5vbm9wZW4gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciBxdWV1ZSA9IHBlZXIucXVldWU7XHJcblx0XHRcdFx0cGVlci5xdWV1ZSA9IFtdO1xyXG5cdFx0XHRcdEd1bi5vYmoubWFwKHF1ZXVlLCBmdW5jdGlvbihtc2cpe1xyXG5cdFx0XHRcdFx0bWVzc2FnZSA9IG1zZztcclxuXHRcdFx0XHRcdHNlbmQuY2FsbChhcywgcGVlcik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0d2lyZS5vbm1lc3NhZ2UgPSBmdW5jdGlvbihtc2cpe1xyXG5cdFx0XHRcdHJlY2VpdmUobXNnLCBwZWVyLCBhcyk7XHJcblx0XHRcdH07XHJcblx0XHRcdHJldHVybiB3aXJlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHJlY29ubmVjdChwZWVyLCBhcyl7XHJcblx0XHRcdGNsZWFyVGltZW91dChwZWVyLmRlZmVyKTtcclxuXHRcdFx0cGVlci5kZWZlciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRvcGVuKHBlZXIsIGFzKTtcclxuXHRcdFx0fSwgMiAqIDEwMDApO1xyXG5cdFx0fVxyXG5cdH0pKHJlcXVpcmUsICcuL3BvbHlmaWxsL3JlcXVlc3QnKTtcclxuXHJcbn0oKSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9ndW4vZ3VuLmpzIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IExlb24gUmV2aWxsIG9uIDE1LzEyLzIwMTUuXG4gKiBCbG9nOiBibG9nLnJldmlsbHdlYi5jb21cbiAqIEdpdEh1YjogaHR0cHM6Ly9naXRodWIuY29tL1JldmlsbFdlYlxuICogVHdpdHRlcjogQFJldmlsbFdlYlxuICovXG5cbi8qKlxuICogVGhlIG1haW4gcm91dGVyIGNsYXNzIGFuZCBlbnRyeSBwb2ludCB0byB0aGUgcm91dGVyLlxuICovXG5leHBvcnQgY2xhc3MgUmViZWxSb3V0ZXIgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cbiAgICAvKipcbiAgICAgKiBNYWluIGluaXRpYWxpc2F0aW9uIHBvaW50IG9mIHJlYmVsLXJvdXRlclxuICAgICAqIEBwYXJhbSBwcmVmaXggLSBJZiBleHRlbmRpbmcgcmViZWwtcm91dGVyIHlvdSBjYW4gc3BlY2lmeSBhIHByZWZpeCB3aGVuIGNhbGxpbmcgY3JlYXRlZENhbGxiYWNrIGluIGNhc2UgeW91ciBlbGVtZW50cyBuZWVkIHRvIGJlIG5hbWVkIGRpZmZlcmVudGx5XG4gICAgICovXG4gICAgY3JlYXRlZENhbGxiYWNrKHByZWZpeCkge1xuXG4gICAgICAgIGNvbnN0IF9wcmVmaXggPSBwcmVmaXggfHwgXCJyZWJlbFwiO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5wcmV2aW91c1BhdGggPSBudWxsO1xuICAgICAgICB0aGlzLmJhc2VQYXRoID0gbnVsbDtcblxuICAgICAgICAvL0dldCBvcHRpb25zXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgICAgICAgIFwiYW5pbWF0aW9uXCI6ICh0aGlzLmdldEF0dHJpYnV0ZShcImFuaW1hdGlvblwiKSA9PSBcInRydWVcIiksXG4gICAgICAgICAgICBcInNoYWRvd1Jvb3RcIjogKHRoaXMuZ2V0QXR0cmlidXRlKFwic2hhZG93XCIpID09IFwidHJ1ZVwiKSxcbiAgICAgICAgICAgIFwiaW5oZXJpdFwiOiAodGhpcy5nZXRBdHRyaWJ1dGUoXCJpbmhlcml0XCIpICE9IFwiZmFsc2VcIilcbiAgICAgICAgfTtcblxuICAgICAgICAvL0dldCByb3V0ZXNcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5pbmhlcml0ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAvL0lmIHRoaXMgaXMgYSBuZXN0ZWQgcm91dGVyIHRoZW4gd2UgbmVlZCB0byBnbyBhbmQgZ2V0IHRoZSBwYXJlbnQgcGF0aFxuICAgICAgICAgICAgbGV0ICRlbGVtZW50ID0gdGhpcztcbiAgICAgICAgICAgIHdoaWxlICgkZWxlbWVudC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgJGVsZW1lbnQgPSAkZWxlbWVudC5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIGlmICgkZWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09IF9wcmVmaXggKyBcIi1yb3V0ZXJcIikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50ID0gJGVsZW1lbnQuY3VycmVudCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJhc2VQYXRoID0gY3VycmVudC5yb3V0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucm91dGVzID0ge307XG4gICAgICAgIGNvbnN0ICRjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCAkY2hpbGQgPSAkY2hpbGRyZW5baV07XG4gICAgICAgICAgICBsZXQgcGF0aCA9ICRjaGlsZC5nZXRBdHRyaWJ1dGUoXCJwYXRoXCIpO1xuICAgICAgICAgICAgc3dpdGNoICgkY2hpbGQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgX3ByZWZpeCArIFwiLWRlZmF1bHRcIjpcbiAgICAgICAgICAgICAgICAgICAgcGF0aCA9IFwiKlwiO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIF9wcmVmaXggKyBcIi1yb3V0ZVwiOlxuICAgICAgICAgICAgICAgICAgICBwYXRoID0gKHRoaXMuYmFzZVBhdGggIT09IG51bGwpID8gdGhpcy5iYXNlUGF0aCArIHBhdGggOiBwYXRoO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXRoICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbGV0ICR0ZW1wbGF0ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKCRjaGlsZC5pbm5lckhUTUwpIHtcbiAgICAgICAgICAgICAgICAgICAgJHRlbXBsYXRlID0gXCI8XCIgKyBfcHJlZml4ICsgXCItcm91dGU+XCIgKyAkY2hpbGQuaW5uZXJIVE1MICsgXCI8L1wiICsgX3ByZWZpeCArIFwiLXJvdXRlPlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlc1twYXRoXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJjb21wb25lbnRcIjogJGNoaWxkLmdldEF0dHJpYnV0ZShcImNvbXBvbmVudFwiKSxcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiAkdGVtcGxhdGVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9BZnRlciB3ZSBoYXZlIGNvbGxlY3RlZCBhbGwgY29uZmlndXJhdGlvbiBjbGVhciBpbm5lckhUTUxcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hhZG93Um9vdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVTaGFkb3dSb290KCk7XG4gICAgICAgICAgICB0aGlzLnJvb3QgPSB0aGlzLnNoYWRvd1Jvb3Q7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJvb3QgPSB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYW5pbWF0aW9uID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLmluaXRBbmltYXRpb24oKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICBSZWJlbFJvdXRlci5wYXRoQ2hhbmdlKChpc0JhY2spID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYW5pbWF0aW9uID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzQmFjayA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoXCJyYmwtYmFja1wiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoXCJyYmwtYmFja1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZ1bmN0aW9uIHVzZWQgdG8gaW5pdGlhbGlzZSB0aGUgYW5pbWF0aW9uIG1lY2hhbmljcyBpZiBhbmltYXRpb24gaXMgdHVybmVkIG9uXG4gICAgICovXG4gICAgaW5pdEFuaW1hdGlvbigpIHtcbiAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG4gICAgICAgICAgICBsZXQgbm9kZSA9IG11dGF0aW9uc1swXS5hZGRlZE5vZGVzWzBdO1xuICAgICAgICAgICAgaWYgKG5vZGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG90aGVyQ2hpbGRyZW4gPSB0aGlzLmdldE90aGVyQ2hpbGRyZW4obm9kZSk7XG4gICAgICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QuYWRkKFwicmViZWwtYW5pbWF0ZVwiKTtcbiAgICAgICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5hZGQoXCJlbnRlclwiKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG90aGVyQ2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJDaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLmNsYXNzTGlzdC5hZGQoXCJleGl0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZC5jbGFzc0xpc3QuYWRkKFwiY29tcGxldGVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5hZGQoXCJjb21wbGV0ZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgICAgICAgICBjb25zdCBhbmltYXRpb25FbmQgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5jbGFzc05hbWUuaW5kZXhPZihcImV4aXRcIikgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yb290LnJlbW92ZUNoaWxkKGV2ZW50LnRhcmdldCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihcInRyYW5zaXRpb25lbmRcIiwgYW5pbWF0aW9uRW5kKTtcbiAgICAgICAgICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgYW5pbWF0aW9uRW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUodGhpcywge2NoaWxkTGlzdDogdHJ1ZX0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1ldGhvZCB1c2VkIHRvIGdldCB0aGUgY3VycmVudCByb3V0ZSBvYmplY3RcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBjdXJyZW50KCkge1xuICAgICAgICBjb25zdCBwYXRoID0gUmViZWxSb3V0ZXIuZ2V0UGF0aEZyb21VcmwoKTtcbiAgICAgICAgZm9yIChjb25zdCByb3V0ZSBpbiB0aGlzLnJvdXRlcykge1xuICAgICAgICAgICAgaWYgKHJvdXRlICE9PSBcIipcIikge1xuICAgICAgICAgICAgICAgIGxldCByZWdleFN0cmluZyA9IFwiXlwiICsgcm91dGUucmVwbGFjZSgve1xcdyt9XFwvPy9nLCBcIihcXFxcdyspXFwvP1wiKTtcbiAgICAgICAgICAgICAgICByZWdleFN0cmluZyArPSAocmVnZXhTdHJpbmcuaW5kZXhPZihcIlxcXFwvP1wiKSA+IC0xKSA/IFwiXCIgOiBcIlxcXFwvP1wiICsgXCIoWz89Ji1cXC9cXFxcdytdKyk/JFwiO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChyZWdleFN0cmluZyk7XG4gICAgICAgICAgICAgICAgaWYgKHJlZ2V4LnRlc3QocGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9yb3V0ZVJlc3VsdCh0aGlzLnJvdXRlc1tyb3V0ZV0sIHJvdXRlLCByZWdleCwgcGF0aCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAodGhpcy5yb3V0ZXNbXCIqXCJdICE9PSB1bmRlZmluZWQpID8gX3JvdXRlUmVzdWx0KHRoaXMucm91dGVzW1wiKlwiXSwgXCIqXCIsIG51bGwsIHBhdGgpIDogbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNZXRob2QgY2FsbGVkIHRvIHJlbmRlciB0aGUgY3VycmVudCB2aWV3XG4gICAgICovXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmN1cnJlbnQoKTtcbiAgICAgICAgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5wYXRoICE9PSB0aGlzLnByZXZpb3VzUGF0aCB8fCB0aGlzLm9wdGlvbnMuYW5pbWF0aW9uID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hbmltYXRpb24gIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb290LmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuY29tcG9uZW50ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCAkY29tcG9uZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChyZXN1bHQuY29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIHJlc3VsdC5wYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHJlc3VsdC5wYXJhbXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gXCJPYmplY3RcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gSlNPTi5wYXJzZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ291bGRuJ3QgcGFyc2UgcGFyYW0gdmFsdWU6XCIsIGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICRjb21wb25lbnQuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm9vdC5hcHBlbmRDaGlsZCgkY29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgJHRlbXBsYXRlID0gcmVzdWx0LnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICAvL1RPRE86IEZpbmQgYSBmYXN0ZXIgYWx0ZXJuYXRpdmVcbiAgICAgICAgICAgICAgICAgICAgaWYgKCR0ZW1wbGF0ZS5pbmRleE9mKFwiJHtcIikgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHRlbXBsYXRlID0gJHRlbXBsYXRlLnJlcGxhY2UoL1xcJHsoW157fV0qKX0vZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgciA9IHJlc3VsdC5wYXJhbXNbYl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YgciA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHIgPT09ICdudW1iZXInID8gciA6IGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvb3QuaW5uZXJIVE1MID0gJHRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnByZXZpb3VzUGF0aCA9IHJlc3VsdC5wYXRoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBub2RlIC0gVXNlZCB3aXRoIHRoZSBhbmltYXRpb24gbWVjaGFuaWNzIHRvIGdldCBhbGwgb3RoZXIgdmlldyBjaGlsZHJlbiBleGNlcHQgaXRzZWxmXG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqL1xuICAgIGdldE90aGVyQ2hpbGRyZW4obm9kZSkge1xuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IHRoaXMucm9vdC5jaGlsZHJlbjtcbiAgICAgICAgbGV0IHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgICAgICAgICBpZiAoY2hpbGQgIT0gbm9kZSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChjaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogU3RhdGljIGhlbHBlciBtZXRob2QgdG8gcGFyc2UgdGhlIHF1ZXJ5IHN0cmluZyBmcm9tIGEgdXJsIGludG8gYW4gb2JqZWN0LlxuICAgICAqIEBwYXJhbSB1cmxcbiAgICAgKiBAcmV0dXJucyB7e319XG4gICAgICovXG4gICAgc3RhdGljIHBhcnNlUXVlcnlTdHJpbmcodXJsKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgICAgaWYgKHVybCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB2YXIgcXVlcnlTdHJpbmcgPSAodXJsLmluZGV4T2YoXCI/XCIpID4gLTEpID8gdXJsLnN1YnN0cih1cmwuaW5kZXhPZihcIj9cIikgKyAxLCB1cmwubGVuZ3RoKSA6IG51bGw7XG4gICAgICAgICAgICBpZiAocXVlcnlTdHJpbmcgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBxdWVyeVN0cmluZy5zcGxpdChcIiZcIikuZm9yRWFjaChmdW5jdGlvbiAocGFydCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXBhcnQpIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgcGFydCA9IHBhcnQucmVwbGFjZShcIitcIiwgXCIgXCIpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXEgPSBwYXJ0LmluZGV4T2YoXCI9XCIpO1xuICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gZXEgPiAtMSA/IHBhcnQuc3Vic3RyKDAsIGVxKSA6IHBhcnQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWwgPSBlcSA+IC0xID8gZGVjb2RlVVJJQ29tcG9uZW50KHBhcnQuc3Vic3RyKGVxICsgMSkpIDogXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZyb20gPSBrZXkuaW5kZXhPZihcIltcIik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmcm9tID09IC0xKSByZXN1bHRbZGVjb2RlVVJJQ29tcG9uZW50KGtleSldID0gdmFsO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0byA9IGtleS5pbmRleE9mKFwiXVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IGRlY29kZVVSSUNvbXBvbmVudChrZXkuc3Vic3RyaW5nKGZyb20gKyAxLCB0bykpO1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5ID0gZGVjb2RlVVJJQ29tcG9uZW50KGtleS5zdWJzdHJpbmcoMCwgZnJvbSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXN1bHRba2V5XSkgcmVzdWx0W2tleV0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaW5kZXgpIHJlc3VsdFtrZXldLnB1c2godmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgcmVzdWx0W2tleV1baW5kZXhdID0gdmFsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdGF0aWMgaGVscGVyIG1ldGhvZCB0byBjb252ZXJ0IGEgY2xhc3MgbmFtZSB0byBhIHZhbGlkIGVsZW1lbnQgbmFtZS5cbiAgICAgKiBAcGFyYW0gQ2xhc3NcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIHN0YXRpYyBjbGFzc1RvVGFnKENsYXNzKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDbGFzcy5uYW1lIHdvdWxkIGJlIGJldHRlciBidXQgdGhpcyBpc24ndCBzdXBwb3J0ZWQgaW4gSUUgMTEuXG4gICAgICAgICAqL1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIG5hbWUgPSBDbGFzcy50b1N0cmluZygpLm1hdGNoKC9eZnVuY3Rpb25cXHMqKFteXFxzKF0rKS8pWzFdLnJlcGxhY2UoL1xcVysvZywgJy0nKS5yZXBsYWNlKC8oW2EtelxcZF0pKFtBLVowLTldKS9nLCAnJDEtJDInKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBwYXJzZSBjbGFzcyBuYW1lOlwiLCBlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoUmViZWxSb3V0ZXIudmFsaWRFbGVtZW50VGFnKG5hbWUpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2xhc3MgbmFtZSBjb3VsZG4ndCBiZSB0cmFuc2xhdGVkIHRvIHRhZy5cIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RhdGljIGhlbHBlciBtZXRob2QgdXNlZCB0byBkZXRlcm1pbmUgaWYgYW4gZWxlbWVudCB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZSBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQuXG4gICAgICogQHBhcmFtIG5hbWVcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBzdGF0aWMgaXNSZWdpc3RlcmVkRWxlbWVudChuYW1lKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5hbWUpLmNvbnN0cnVjdG9yICE9PSBIVE1MRWxlbWVudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdGF0aWMgaGVscGVyIG1ldGhvZCB0byB0YWtlIGEgd2ViIGNvbXBvbmVudCBjbGFzcywgY3JlYXRlIGFuIGVsZW1lbnQgbmFtZSBhbmQgcmVnaXN0ZXIgdGhlIG5ldyBlbGVtZW50IG9uIHRoZSBkb2N1bWVudC5cbiAgICAgKiBAcGFyYW0gQ2xhc3NcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIHN0YXRpYyBjcmVhdGVFbGVtZW50KENsYXNzKSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBSZWJlbFJvdXRlci5jbGFzc1RvVGFnKENsYXNzKTtcbiAgICAgICAgaWYgKFJlYmVsUm91dGVyLmlzUmVnaXN0ZXJlZEVsZW1lbnQobmFtZSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBDbGFzcy5wcm90b3R5cGUubmFtZSA9IG5hbWU7XG4gICAgICAgICAgICBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQobmFtZSwgQ2xhc3MpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuYW1lO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNpbXBsZSBzdGF0aWMgaGVscGVyIG1ldGhvZCBjb250YWluaW5nIGEgcmVndWxhciBleHByZXNzaW9uIHRvIHZhbGlkYXRlIGFuIGVsZW1lbnQgbmFtZVxuICAgICAqIEBwYXJhbSB0YWdcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBzdGF0aWMgdmFsaWRFbGVtZW50VGFnKHRhZykge1xuICAgICAgICByZXR1cm4gL15bYS16MC05XFwtXSskLy50ZXN0KHRhZyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWV0aG9kIHVzZWQgdG8gcmVnaXN0ZXIgYSBjYWxsYmFjayB0byBiZSBjYWxsZWQgd2hlbiB0aGUgVVJMIHBhdGggY2hhbmdlcy5cbiAgICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICAgKi9cbiAgICBzdGF0aWMgcGF0aENoYW5nZShjYWxsYmFjaykge1xuICAgICAgICBpZiAoUmViZWxSb3V0ZXIuY2hhbmdlQ2FsbGJhY2tzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIFJlYmVsUm91dGVyLmNoYW5nZUNhbGxiYWNrcyA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIFJlYmVsUm91dGVyLmNoYW5nZUNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgY29uc3QgY2hhbmdlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogIGV2ZW50Lm9sZFVSTCBhbmQgZXZlbnQubmV3VVJMIHdvdWxkIGJlIGJldHRlciBoZXJlIGJ1dCB0aGlzIGRvZXNuJ3Qgd29yayBpbiBJRSA6KFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhyZWYgIT0gUmViZWxSb3V0ZXIub2xkVVJMKSB7XG4gICAgICAgICAgICAgICAgUmViZWxSb3V0ZXIuY2hhbmdlQ2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24oY2FsbGJhY2spe1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhSZWJlbFJvdXRlci5pc0JhY2spO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFJlYmVsUm91dGVyLmlzQmFjayA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgUmViZWxSb3V0ZXIub2xkVVJMID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgICAgIH07XG4gICAgICAgIGlmICh3aW5kb3cub25oYXNoY2hhbmdlID09PSBudWxsKSB7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJibGJhY2tcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBSZWJlbFJvdXRlci5pc0JhY2sgPSB0cnVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgd2luZG93Lm9uaGFzaGNoYW5nZSA9IGNoYW5nZUhhbmRsZXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RhdGljIGhlbHBlciBtZXRob2QgdXNlZCB0byBnZXQgdGhlIHBhcmFtZXRlcnMgZnJvbSB0aGUgcHJvdmlkZWQgcm91dGUuXG4gICAgICogQHBhcmFtIHJlZ2V4XG4gICAgICogQHBhcmFtIHJvdXRlXG4gICAgICogQHBhcmFtIHBhdGhcbiAgICAgKiBAcmV0dXJucyB7e319XG4gICAgICovXG4gICAgc3RhdGljIGdldFBhcmFtc0Zyb21VcmwocmVnZXgsIHJvdXRlLCBwYXRoKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBSZWJlbFJvdXRlci5wYXJzZVF1ZXJ5U3RyaW5nKHBhdGgpO1xuICAgICAgICB2YXIgcmUgPSAveyhcXHcrKX0vZztcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgbGV0IG1hdGNoO1xuICAgICAgICB3aGlsZSAobWF0Y2ggPSByZS5leGVjKHJvdXRlKSkge1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKG1hdGNoWzFdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVnZXggIT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHRzMiA9IHJlZ2V4LmV4ZWMocGF0aCk7XG4gICAgICAgICAgICByZXN1bHRzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGlkeCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtpdGVtXSA9IHJlc3VsdHMyW2lkeCArIDFdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdGF0aWMgaGVscGVyIG1ldGhvZCB1c2VkIHRvIGdldCB0aGUgcGF0aCBmcm9tIHRoZSBjdXJyZW50IFVSTC5cbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0UGF0aEZyb21VcmwoKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5tYXRjaCgvIyguKikkLyk7XG4gICAgICAgIGlmIChyZXN1bHQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRbMV07XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcInJlYmVsLXJvdXRlclwiLCBSZWJlbFJvdXRlcik7XG5cbi8qKlxuICogQ2xhc3Mgd2hpY2ggcmVwcmVzZW50cyB0aGUgcmViZWwtcm91dGUgY3VzdG9tIGVsZW1lbnRcbiAqL1xuZXhwb3J0IGNsYXNzIFJlYmVsUm91dGUgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cbn1cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcInJlYmVsLXJvdXRlXCIsIFJlYmVsUm91dGUpO1xuXG4vKipcbiAqIENsYXNzIHdoaWNoIHJlcHJlc2VudHMgdGhlIHJlYmVsLWRlZmF1bHQgY3VzdG9tIGVsZW1lbnRcbiAqL1xuY2xhc3MgUmViZWxEZWZhdWx0IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJyZWJlbC1kZWZhdWx0XCIsIFJlYmVsRGVmYXVsdCk7XG5cblxuLyoqXG4gKiBSZXByZXNlbnRzIHRoZSBwcm90b3R5cGUgZm9yIGFuIGFuY2hvciBlbGVtZW50IHdoaWNoIGFkZGVkIGZ1bmN0aW9uYWxpdHkgdG8gcGVyZm9ybSBhIGJhY2sgdHJhbnNpdGlvbi5cbiAqL1xuY2xhc3MgUmViZWxCYWNrQSBleHRlbmRzIEhUTUxBbmNob3JFbGVtZW50IHtcbiAgICBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmdldEF0dHJpYnV0ZShcImhyZWZcIik7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgaWYgKHBhdGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncmJsYmFjaycpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gcGF0aDtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuLyoqXG4gKiBSZWdpc3RlciB0aGUgYmFjayBidXR0b24gY3VzdG9tIGVsZW1lbnRcbiAqL1xuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwicmViZWwtYmFjay1hXCIsIHtcbiAgICBleHRlbmRzOiBcImFcIixcbiAgICBwcm90b3R5cGU6IFJlYmVsQmFja0EucHJvdG90eXBlXG59KTtcblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGEgcm91dGUgb2JqZWN0XG4gKiBAcGFyYW0gb2JqIC0gdGhlIGNvbXBvbmVudCBuYW1lIG9yIHRoZSBIVE1MIHRlbXBsYXRlXG4gKiBAcGFyYW0gcm91dGVcbiAqIEBwYXJhbSByZWdleFxuICogQHBhcmFtIHBhdGhcbiAqIEByZXR1cm5zIHt7fX1cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIF9yb3V0ZVJlc3VsdChvYmosIHJvdXRlLCByZWdleCwgcGF0aCkge1xuICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBvYmpba2V5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQucm91dGUgPSByb3V0ZTtcbiAgICByZXN1bHQucGF0aCA9IHBhdGg7XG4gICAgcmVzdWx0LnBhcmFtcyA9IFJlYmVsUm91dGVyLmdldFBhcmFtc0Zyb21VcmwocmVnZXgsIHJvdXRlLCBwYXRoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vcmViZWwtcm91dGVyL3NyYy9yZWJlbC1yb3V0ZXIuanMiLCIndXNlIHN0cmljdCc7XG5cbi8vIGltcG9ydCB7aGFuZGxlUEdQUHVia2V5fSBmcm9tICcuLi8uLi9zcmMvbGliL3V0aWwuanMnO1xuLy8gaW1wb3J0IHtoYW5kbGVQR1BQcml2a2V5fSBmcm9tICcuLi8uLi9zcmMvbGliL3V0aWwuanMnO1xuLy8gaW1wb3J0IHtoYW5kbGVQR1BNZXNzYWdlfSBmcm9tICcuLi8uLi9zcmMvbGliL3V0aWwuanMnO1xuXG5pbXBvcnQge2VuY3J5cHRDbGVhcnRleHRNdWx0aX0gZnJvbSAnLi9lbmNyeXB0Q2xlYXJ0ZXh0TXVsdGkuanMnO1xuaW1wb3J0IHtkZWNyeXB0UEdQTWVzc2FnZX0gZnJvbSAnLi9kZWNyeXB0UEdQTWVzc2FnZS5qcyc7XG5pbXBvcnQge2RldGVybWluZUNvbnRlbnRUeXBlfSBmcm9tICcuL2RldGVybWluZUNvbnRlbnRUeXBlLmpzJztcbmltcG9ydCB7c2F2ZVBHUFB1YmtleX0gZnJvbSAnLi9zYXZlUEdQUHVia2V5LmpzJztcbmltcG9ydCB7c2F2ZVBHUFByaXZrZXl9IGZyb20gJy4vc2F2ZVBHUFByaXZrZXkuanMnO1xuLy8gaW1wb3J0IHtnZXRGcm9tU3RvcmFnZX0gZnJvbSAnLi9nZXRGcm9tU3RvcmFnZSc7XG5cbmNvbnN0IFBHUFBVQktFWSA9ICdQR1BQdWJrZXknO1xuY29uc3QgQ0xFQVJURVhUID0gJ2NsZWFydGV4dCc7XG5jb25zdCBQR1BQUklWS0VZID0gJ1BHUFByaXZrZXknO1xuY29uc3QgUEdQTUVTU0FHRSA9ICdQR1BNZXNzYWdlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZVBvc3QoY29udGVudCkge1xuICAgIHJldHVybiAoIWNvbnRlbnQpID9cbiAgICBQcm9taXNlLnJlc29sdmUoJycpIDpcbiAgICAob3BlbnBncCkgPT4ge1xuICAgICAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBvcGVucGdwJyk6XG4gICAgICAgIChsb2NhbFN0b3JhZ2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAocGFzc3dvcmQpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBkZXRlcm1pbmVDb250ZW50VHlwZShjb250ZW50KShvcGVucGdwKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihjb250ZW50VHlwZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudFR5cGUgPT09IENMRUFSVEVYVCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKENMRUFSVEVYVCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZW5jcnlwdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBlbmNyeXB0Q2xlYXJ0ZXh0TXVsdGkoY29udGVudCkob3BlbnBncCkobG9jYWxTdG9yYWdlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiByZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRlbnRUeXBlID09PSBQR1BQUklWS0VZKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coUEdQUFJJVktFWSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2F2ZSBhbmQgYnJvYWRjYXN0IGNvbnZlcnRlZCBwdWJsaWMga2V5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNhdmVQR1BQcml2a2V5KGNvbnRlbnQpKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3JldHVybiBicm9hZGNhc3RNZXNzYWdlKGNvbnRlbnQpKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRlbnRUeXBlID09PSBQR1BQVUJLRVkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhQR1BQVUJLRVkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNhdmUgdG8gbG9jYWxTdG9yYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNhdmVQR1BQdWJrZXkoY29udGVudCkob3BlbnBncCkobG9jYWxTdG9yYWdlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiByZXN1bHQpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudFR5cGUgPT09IFBHUE1FU1NBR0UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhQR1BNRVNTQUdFKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBnZXQgUEdQS2V5cywgZGVjcnlwdCwgIGFuZCByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVjcnlwdFBHUE1lc3NhZ2Uob3BlbnBncCkobG9jYWxTdG9yYWdlKShwYXNzd29yZCkoY29udGVudClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gcmVqZWN0KGVycikpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvaGFuZGxlUG9zdC5qcyIsImxldCBjb25uZWN0UGFydGlhbCA9IHJlcXVpcmUoXCJyYXctbG9hZGVyIS4uLy4uL3ZpZXdzL3BhcnRpYWxzL2Nvbm5lY3QuaHRtbFwiKTtcbmV4cG9ydCBjbGFzcyBDb25uZWN0UGFnZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLmlubmVySFRNTCA9ICc8cD4nICsgY29ubmVjdFBhcnRpYWwgKyAnPC9wPic7XG4gICAgfVxufVxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwiY29ubmVjdC1wYWdlXCIsIENvbm5lY3RQYWdlKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYWdlcy9jb25uZWN0LmpzIiwibGV0IGNvbnRhY3RQYXJ0aWFsID0gcmVxdWlyZShcInJhdy1sb2FkZXIhLi4vLi4vdmlld3MvcGFydGlhbHMvY29udGFjdC5odG1sXCIpO1xuZXhwb3J0IGNsYXNzIENvbnRhY3RQYWdlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICAgIGF0dGFjaGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuaW5uZXJIVE1MID0gJzxwPicgKyBjb250YWN0UGFydGlhbCArICc8L3A+JztcbiAgICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJjb250YWN0LXBhZ2VcIiwgQ29udGFjdFBhZ2UpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhZ2VzL2NvbnRhY3QuanMiLCJ2YXIgZnJlc2hEZWNrUGFydGlhbCA9IHJlcXVpcmUoXCJyYXctbG9hZGVyIS4uLy4uL3ZpZXdzL3BhcnRpYWxzL2ZyZXNoZGVjay5odG1sXCIpO1xuXG5leHBvcnQgY2xhc3MgRGVja1BhZ2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSAnPHA+JyArIGZyZXNoRGVja1BhcnRpYWwgKyAnPC9wPic7XG4gICAgfVxufVxuXG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJkZWNrLXBhZ2VcIiwgRGVja1BhZ2UpO1xuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdwbGF5aW5nLWNhcmQnLCB7XG4gICAgcHJvdG90eXBlOiBPYmplY3QuY3JlYXRlKEhUTUxFbGVtZW50LnByb3RvdHlwZSwgeyBjcmVhdGVkQ2FsbGJhY2s6IHtcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgIHZhciByb290ID0gdGhpcy5jcmVhdGVTaGFkb3dSb290KCk7XG4gICAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIHRoaXMudGV4dENvbnRlbnQgfHwgJyPilognKTtcbiAgICAgICAgICAgICAgICAgIHZhciBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICB2YXIgY29sb3JPdmVycmlkZSA9ICh0aGlzLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKSkgPyB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKS5zdHlsZS5jb2xvcjogbnVsbDtcbiAgICAgICAgICAgICAgICAgIGlmIChjb2xvck92ZXJyaWRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgY2xvbmUucXVlcnlTZWxlY3Rvcignc3ZnJykuc3R5bGUuZmlsbCA9IHRoaXMucXVlcnlTZWxlY3Rvcignc3BhbicpLnN0eWxlLmNvbG9yO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChjbG9uZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KVxufSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFnZXMvZGVjay5qcyIsInZhciBpbmRleFBhcnRpYWwgPSByZXF1aXJlKFwicmF3LWxvYWRlciEuLi8uLi92aWV3cy9wYXJ0aWFscy9pbmRleC5odG1sXCIpO1xuZXhwb3J0IGNsYXNzIEluZGV4UGFnZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLmlubmVySFRNTCA9IGBcbiAgICAgICAgPHA+JHtpbmRleFBhcnRpYWx9PC9wPlxuICAgICAgICBgO1xuICAgIH1cbn1cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcImluZGV4LXBhZ2VcIiwgSW5kZXhQYWdlKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYWdlcy9pbmRleC5qcyIsInZhciBjbGllbnRQdWJrZXlGb3JtUGFydGlhbCA9IHJlcXVpcmUoXCJyYXctbG9hZGVyIS4uLy4uL3ZpZXdzL3BhcnRpYWxzL21lc3NhZ2VfZm9ybS5odG1sXCIpO1xuXG5leHBvcnQgY2xhc3MgTWVzc2FnZVBhZ2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSBgXG4gICAgICAgICAgICA8cD4ke2NsaWVudFB1YmtleUZvcm1QYXJ0aWFsfTwvcD5cbiAgICAgICAgYFxuICAgIH1cbn1cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcIm1lc3NhZ2UtcGFnZVwiLCBNZXNzYWdlUGFnZSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFnZXMvbWVzc2FnZS5qcyIsInZhciByb2FkbWFwUGFydGlhbCA9IHJlcXVpcmUoXCJyYXctbG9hZGVyIS4uLy4uL3ZpZXdzL3BhcnRpYWxzL3JvYWRtYXAuaHRtbFwiKTtcbmV4cG9ydCBjbGFzcyBSb2FkbWFwUGFnZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLmlubmVySFRNTCA9ICc8cD4nICsgcm9hZG1hcFBhcnRpYWwgKyAnPC9wPic7XG4gICAgfVxufVxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwicm9hZG1hcC1wYWdlXCIsIFJvYWRtYXBQYWdlKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYWdlcy9yb2FkbWFwLmpzIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vcHJvY2Vzcy9icm93c2VyLmpzIiwidmFyIGc7XHJcblxyXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxyXG5nID0gKGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzO1xyXG59KSgpO1xyXG5cclxudHJ5IHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcclxuXHRnID0gZyB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCkgfHwgKDEsZXZhbCkoXCJ0aGlzXCIpO1xyXG59IGNhdGNoKGUpIHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxyXG5cdGlmKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpXHJcblx0XHRnID0gd2luZG93O1xyXG59XHJcblxyXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXHJcbi8vIFdlIHJldHVybiB1bmRlZmluZWQsIGluc3RlYWQgb2Ygbm90aGluZyBoZXJlLCBzbyBpdCdzXHJcbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZztcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vICh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obW9kdWxlKSB7XHJcblx0aWYoIW1vZHVsZS53ZWJwYWNrUG9seWZpbGwpIHtcclxuXHRcdG1vZHVsZS5kZXByZWNhdGUgPSBmdW5jdGlvbigpIHt9O1xyXG5cdFx0bW9kdWxlLnBhdGhzID0gW107XHJcblx0XHQvLyBtb2R1bGUucGFyZW50ID0gdW5kZWZpbmVkIGJ5IGRlZmF1bHRcclxuXHRcdGlmKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJsb2FkZWRcIiwge1xyXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBtb2R1bGUubDtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImlkXCIsIHtcclxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0bW9kdWxlLndlYnBhY2tQb2x5ZmlsbCA9IDE7XHJcblx0fVxyXG5cdHJldHVybiBtb2R1bGU7XHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAod2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanMiLCIndXNlIHN0cmljdCc7XG4vL2ltcG9ydCAnd2ViY29tcG9uZW50cy5qcy93ZWJjb21wb25lbnRzLmpzJztcbi8vdW5jb21tZW50IGxpbmUgYWJvdmUgdG8gZG91YmxlIGFwcCBzaXplIGFuZCBzdXBwb3J0IGlvcy5cblxuaW1wb3J0IHtoYW5kbGVQb3N0fSBmcm9tICcuL2xpYi9oYW5kbGVQb3N0LmpzJztcbmltcG9ydCB7ZGV0ZXJtaW5lQ29udGVudFR5cGV9IGZyb20gJy4vbGliL2RldGVybWluZUNvbnRlbnRUeXBlLmpzJ1xuaW1wb3J0IHtkZXRlcm1pbmVLZXlUeXBlfSBmcm9tICcuL2xpYi9kZXRlcm1pbmVLZXlUeXBlLmpzJ1xuaW1wb3J0IHtlbmNyeXB0Q2xlYXJ0ZXh0TXVsdGl9IGZyb20gJy4vbGliL2VuY3J5cHRDbGVhcnRleHRNdWx0aS5qcydcbmltcG9ydCB7ZW5jcnlwdENsZWFyVGV4dH0gZnJvbSAnLi9saWIvZW5jcnlwdENsZWFyVGV4dC5qcydcbmltcG9ydCB7ZGVjcnlwdFBHUE1lc3NhZ2V9IGZyb20gJy4vbGliL2RlY3J5cHRQR1BNZXNzYWdlLmpzJ1xuaW1wb3J0IHtzYXZlUEdQUHVia2V5fSBmcm9tICcuL2xpYi9zYXZlUEdQUHVia2V5LmpzJ1xuaW1wb3J0IHtzYXZlUEdQUHJpdmtleX0gZnJvbSAnLi9saWIvc2F2ZVBHUFByaXZrZXkuanMnXG5pbXBvcnQge2dldEZyb21TdG9yYWdlfSBmcm9tICcuL2xpYi9nZXRGcm9tU3RvcmFnZS5qcydcbmltcG9ydCB7ZGVjcnlwdFBHUE1lc3NhZ2VXaXRoS2V5fSBmcm9tICcuL2xpYi9kZWNyeXB0UEdQTWVzc2FnZVdpdGhLZXkuanMnXG5cbndpbmRvdy5oYW5kbGVQb3N0ID0gaGFuZGxlUG9zdCA7XG53aW5kb3cuZGV0ZXJtaW5lQ29udGVudFR5cGUgPSBkZXRlcm1pbmVDb250ZW50VHlwZTtcbndpbmRvdy5kZXRlcm1pbmVLZXlUeXBlID0gZGV0ZXJtaW5lS2V5VHlwZTtcbndpbmRvdy5lbmNyeXB0Q2xlYXJ0ZXh0TXVsdGkgPSBlbmNyeXB0Q2xlYXJ0ZXh0TXVsdGk7XG53aW5kb3cuZW5jcnlwdENsZWFyVGV4dCA9IGVuY3J5cHRDbGVhclRleHQ7XG53aW5kb3cuZGVjcnlwdFBHUE1lc3NhZ2UgPSBkZWNyeXB0UEdQTWVzc2FnZTtcbndpbmRvdy5zYXZlUEdQUHVia2V5ID0gc2F2ZVBHUFB1YmtleTtcbndpbmRvdy5zYXZlUEdQUHJpdmtleSA9IHNhdmVQR1BQcml2a2V5O1xud2luZG93LmdldEZyb21TdG9yYWdlID0gZ2V0RnJvbVN0b3JhZ2U7XG53aW5kb3cuZGVjcnlwdFBHUE1lc3NhZ2VXaXRoS2V5ID0gZGVjcnlwdFBHUE1lc3NhZ2VXaXRoS2V5O1xuXG4vLyByZWJlbCByb3V0ZXJcbmltcG9ydCB7UmViZWxSb3V0ZXJ9IGZyb20gJy4uL25vZGVfbW9kdWxlcy9yZWJlbC1yb3V0ZXIvc3JjL3JlYmVsLXJvdXRlci5qcyc7XG5cbi8vIEd1bmRiIHB1YmxpYyBmYWNpbmcgREFHIGRhdGFiYXNlICAoZm9yIG1lc3NhZ2VzIHRvIGFuZCBmcm9tIHRoZSBlbmVteSlcbmltcG9ydCB7R3VufSBmcm9tICdndW4vZ3VuLmpzJztcblxuLy8gcGFnZXMgKG1vc3Qgb2YgdGhpcyBzaG91bGQgYmUgaW4gdmlld3MvcGFydGlhbHMgdG8gYWZmZWN0IGlzb3Jtb3JwaGlzbSlcbmltcG9ydCB7SW5kZXhQYWdlfSAgIGZyb20gJy4vcGFnZXMvaW5kZXguanMnO1xuaW1wb3J0IHtSb2FkbWFwUGFnZX0gZnJvbSAnLi9wYWdlcy9yb2FkbWFwLmpzJztcbmltcG9ydCB7Q29udGFjdFBhZ2V9IGZyb20gJy4vcGFnZXMvY29udGFjdC5qcyc7XG5pbXBvcnQge01lc3NhZ2VQYWdlfSBmcm9tICcuL3BhZ2VzL21lc3NhZ2UuanMnO1xuaW1wb3J0IHtEZWNrUGFnZX0gICAgZnJvbSAnLi9wYWdlcy9kZWNrLmpzJztcbmltcG9ydCB7Q29ubmVjdFBhZ2V9IGZyb20gJy4vcGFnZXMvY29ubmVjdC5qcyc7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPHNwYW4gY2xhc3M9XFxcImNvbm5lY3RcXFwiPlxcbjxwPlRoaXMgaXMgdGhlIGNvbm5lY3QgcGFnZS48L3A+XFxuPHVsPlxcbjxsaT5wZW5kaW5nIGludml0YXRpb25zPC8+XFxuPGxpPmxpc3Qgb2YgcGxheWVyczwvbGk+XFxuPGxpPmNvbm5lY3RlZCBwbGF5ZXJzPC9saT5cXG5cXG48aDE+SGVsbG8gd29ybGQgZ3VuIGFwcDwvaDE+XFxuPHA+T3BlbiB5b3VyIHdlYiBjb25zb2xlPC9wPlxcbjwvc3Bhbj5cXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yYXctbG9hZGVyIS4vdmlld3MvcGFydGlhbHMvY29ubmVjdC5odG1sXG4vLyBtb2R1bGUgaWQgPSAyMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPHNwYW4gY2xhc3M9XFxcImNvbnRhY3RcXFwiPlxcbiAgICBDb2xlIEFsYm9uPGJyPlxcbiAgICA8YSBocmVmPVxcXCJ0ZWw6KzE0MTU2NzIxNjQ4XFxcIj4oNDE1KSA2NzItMTY0ODwvYT48YnI+XFxuICAgIDxhIGhyZWY9XFxcIm1haWx0bzpjb2xlLmFsYm9uQGdtYWlsLmNvbVxcXCI+Y29sZS5hbGJvbkBnbWFpbC5jb208L2E+PGJyPlxcbiAgICA8YSBocmVmPVxcXCJodHRwczovL2dpdGh1Yi5jb20vY29sZWFsYm9uXFxcIj5odHRwczovL2dpdGh1Yi5jb20vY29sZWFsYm9uPC9hPjxicj5cXG4gICAgPGEgaHJlZj1cXFwiaHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL2NvbGUtYWxib24tNTkzNDYzNFxcXCI+XFxuICAgICAgICA8c3BhbiBpZD1cXFwibGlua2VkaW5hZGRyZXNzXFxcIiBjbGFzcz1cXFwibGlua2VkaW5hZGRyZXNzXFxcIj5odHRwczovL3d3dy5saW5rZWRpbi5jb20vaW4vY29sZS1hbGJvbi01OTM0NjM0PC9zcGFuPlxcbiAgICA8L2E+PGJyPlxcbjwvc3Bhbj5cXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yYXctbG9hZGVyIS4vdmlld3MvcGFydGlhbHMvY29udGFjdC5odG1sXG4vLyBtb2R1bGUgaWQgPSAyM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiICAgIDxkaXYgaWQ9XFxcImRlY2tcXFwiIGNsYXNzPVxcXCJkZWNrXFxcIj5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLilohcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNzAuMzEyNSAzNjIuMjUgTDcwLjMxMjUgMTEwLjEwOTQgTDIyNC4yOTY5IDExMC4xMDk0IEwyMjQuMjk2OSAzNjIuMjUgTDcwLjMxMjUgMzYyLjI1IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoEFcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTExMC42NzE5IDExNS43MzQ0IEw5MS44MjgxIDE3NS43ODEyIEwxMjkuNTE1NiAxNzUuNzgxMiBMMTEwLjY3MTkgMTE1LjczNDQgWk05OS45ODQ0IDEwMS42NzE5IEwxMjEuNjQwNiAxMDEuNjcxOSBMMTYyLjE0MDYgMjE5LjIzNDQgTDE0My41NzgxIDIxOS4yMzQ0IEwxMzQuMDE1NiAxODguNTc4MSBMODcuNjA5NCAxODguNTc4MSBMNzguMDQ2OSAyMTkuMjM0NCBMNTkuNDg0NCAyMTkuMjM0NCBMOTkuOTg0NCAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaAyXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk04Ni4zNDM4IDIwMy4wNjI1IEwxNDUuOTY4OCAyMDMuMDYyNSBMMTQ1Ljk2ODggMjE5LjA5MzggTDYxLjg3NSAyMTkuMDkzOCBMNjEuODc1IDIwMy42MjUgUTY2LjY1NjIgMTk5LjI2NTYgNzUuNTE1NiAxOTEuMzkwNiBRMTIzLjg5MDYgMTQ4LjUgMTIzLjg5MDYgMTM1LjI4MTIgUTEyMy44OTA2IDEyNiAxMTYuNTc4MSAxMjAuMzA0NyBRMTA5LjI2NTYgMTE0LjYwOTQgOTcuMzEyNSAxMTQuNjA5NCBROTAgMTE0LjYwOTQgODEuNDIxOSAxMTcuMDcwMyBRNzIuODQzOCAxMTkuNTMxMiA2Mi43MTg4IDEyNC40NTMxIEw2Mi43MTg4IDEwNy4xNTYyIFE3My41NDY5IDEwMy4yMTg4IDgyLjg5ODQgMTAxLjI1IFE5Mi4yNSA5OS4yODEyIDEwMC4yNjU2IDk5LjI4MTIgUTEyMC42NTYyIDk5LjI4MTIgMTMyLjg5MDYgMTA4LjU2MjUgUTE0NS4xMjUgMTE3Ljg0MzggMTQ1LjEyNSAxMzMuMDMxMiBRMTQ1LjEyNSAxNTIuNTc4MSA5OC41NzgxIDE5Mi41MTU2IFE5MC43MDMxIDE5OS4yNjU2IDg2LjM0MzggMjAzLjA2MjUgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgM1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTIxLjc4MTIgMTU1LjUzMTIgUTEzNC43MTg4IDE1OC4wNjI1IDE0MS44MjAzIDE2NS43MjY2IFExNDguOTIxOSAxNzMuMzkwNiAxNDguOTIxOSAxODQuOTIxOSBRMTQ4LjkyMTkgMjAyLjM1OTQgMTM1LjU2MjUgMjExLjc4MTIgUTEyMi4yMDMxIDIyMS4yMDMxIDk3LjMxMjUgMjIxLjIwMzEgUTg5LjI5NjkgMjIxLjIwMzEgODAuNTA3OCAyMTkuNzI2NiBRNzEuNzE4OCAyMTguMjUgNjEuODc1IDIxNS40Mzc1IEw2MS44NzUgMTk4LjQyMTkgUTY5LjE4NzUgMjAyLjIxODggNzcuNTU0NyAyMDQuMDQ2OSBRODUuOTIxOSAyMDUuODc1IDk1LjM0MzggMjA1Ljg3NSBRMTEwLjY3MTkgMjA1Ljg3NSAxMTkuMTA5NCAyMDAuMzIwMyBRMTI3LjU0NjkgMTk0Ljc2NTYgMTI3LjU0NjkgMTg0LjkyMTkgUTEyNy41NDY5IDE3NC41MTU2IDExOS43NDIyIDE2OS4xNzE5IFExMTEuOTM3NSAxNjMuODI4MSA5Ni43NSAxNjMuODI4MSBMODQuNjU2MiAxNjMuODI4MSBMODQuNjU2MiAxNDguNjQwNiBMOTcuODc1IDE0OC42NDA2IFExMTEuMDkzOCAxNDguNjQwNiAxMTcuOTE0MSAxNDQuMjEwOSBRMTI0LjczNDQgMTM5Ljc4MTIgMTI0LjczNDQgMTMxLjM0MzggUTEyNC43MzQ0IDEyMy4xODc1IDExNy43MDMxIDExOC44OTg0IFExMTAuNjcxOSAxMTQuNjA5NCA5Ny4zMTI1IDExNC42MDk0IFE5MS42ODc1IDExNC42MDk0IDg0LjUxNTYgMTE1Ljg3NSBRNzcuMzQzOCAxMTcuMTQwNiA2NS45NTMxIDEyMC4zNzUgTDY1Ljk1MzEgMTA0LjIwMzEgUTc2LjIxODggMTAxLjgxMjUgODUuMjE4OCAxMDAuNTQ2OSBROTQuMjE4OCA5OS4yODEyIDEwMS45NTMxIDk5LjI4MTIgUTEyMi4yMDMxIDk5LjI4MTIgMTM0LjA4NTkgMTA3LjU3ODEgUTE0NS45Njg4IDExNS44NzUgMTQ1Ljk2ODggMTI5Ljc5NjkgUTE0NS45Njg4IDEzOS41IDEzOS42NDA2IDE0Ni4yNSBRMTMzLjMxMjUgMTUzIDEyMS43ODEyIDE1NS41MzEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoDRcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEyMC4wOTM4IDExOC42ODc1IEw3Ni42NDA2IDE3Ny42MDk0IEwxMjAuMDkzOCAxNzcuNjA5NCBMMTIwLjA5MzggMTE4LjY4NzUgWk0xMTcgMTAxLjY3MTkgTDE0MC4zNDM4IDEwMS42NzE5IEwxNDAuMzQzOCAxNzcuNjA5NCBMMTU5LjMyODEgMTc3LjYwOTQgTDE1OS4zMjgxIDE5Mi45Mzc1IEwxNDAuMzQzOCAxOTIuOTM3NSBMMTQwLjM0MzggMjE5LjA5MzggTDEyMC4wOTM4IDIxOS4wOTM4IEwxMjAuMDkzOCAxOTIuOTM3NSBMNjEuODc1IDE5Mi45Mzc1IEw2MS44NzUgMTc1LjkyMTkgTDExNyAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaA1XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02Ny41IDEwMS42NzE5IEwxMzkuMjE4OCAxMDEuNjcxOSBMMTM5LjIxODggMTE1LjAzMTIgTDg0LjIzNDQgMTE1LjAzMTIgTDg0LjIzNDQgMTQzLjcxODggUTg4LjE3MTkgMTQyLjQ1MzEgOTIuMjUgMTQxLjg5MDYgUTk2LjE4NzUgMTQxLjMyODEgMTAwLjEyNSAxNDEuMzI4MSBRMTIyLjc2NTYgMTQxLjMyODEgMTM1Ljk4NDQgMTUyLjE1NjIgUTE0OS4yMDMxIDE2Mi44NDM4IDE0OS4yMDMxIDE4MS4yNjU2IFExNDkuMjAzMSAyMDAuMjUgMTM1LjU2MjUgMjEwLjc5NjkgUTEyMi4wNjI1IDIyMS4yMDMxIDk3LjMxMjUgMjIxLjIwMzEgUTg4Ljg3NSAyMjEuMjAzMSA4MC4wMTU2IDIxOS45Mzc1IFE3MS4xNTYyIDIxOC42NzE5IDYxLjg3NSAyMTYuMTQwNiBMNjEuODc1IDIwMC4yNSBRNjkuODkwNiAyMDQuMDQ2OSA3OC42MDk0IDIwNi4wMTU2IFE4Ny4zMjgxIDIwNy44NDM4IDk3LjAzMTIgMjA3Ljg0MzggUTExMi42NDA2IDIwNy44NDM4IDEyMS43ODEyIDIwMC42NzE5IFExMzAuOTIxOSAxOTMuNSAxMzAuOTIxOSAxODEuMjY1NiBRMTMwLjkyMTkgMTY5LjAzMTIgMTIxLjc4MTIgMTYxLjg1OTQgUTExMi42NDA2IDE1NC42ODc1IDk3LjAzMTIgMTU0LjY4NzUgUTg5LjcxODggMTU0LjY4NzUgODIuNDA2MiAxNTYuMDkzOCBRNzUuMDkzOCAxNTcuNSA2Ny41IDE2MC40NTMxIEw2Ny41IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoDZcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTExMC4xMDk0IDE1My43MDMxIFE5Ny43MzQ0IDE1My43MDMxIDkwLjU2MjUgMTYxLjAxNTYgUTgzLjM5MDYgMTY4LjQ2ODggODMuMzkwNiAxODEuMjY1NiBRODMuMzkwNiAxOTMuOTIxOSA5MC41NjI1IDIwMS4yMzQ0IFE5Ny43MzQ0IDIwOC42ODc1IDExMC4xMDk0IDIwOC42ODc1IFExMjIuMzQzOCAyMDguNjg3NSAxMjkuNTE1NiAyMDEuMjM0NCBRMTM2LjY4NzUgMTkzLjkyMTkgMTM2LjY4NzUgMTgxLjI2NTYgUTEzNi42ODc1IDE2OC40Njg4IDEyOS41MTU2IDE2MS4wMTU2IFExMjIuMzQzOCAxNTMuNzAzMSAxMTAuMTA5NCAxNTMuNzAzMSBaTTE0Ni4zOTA2IDEwMy45MjE5IEwxNDYuMzkwNiAxMTguNDA2MiBRMTM5LjUgMTE1LjU5MzggMTMyLjQ2ODggMTE0LjE4NzUgUTEyNS40Mzc1IDExMi42NDA2IDExOC41NDY5IDExMi42NDA2IFExMDAuNTQ2OSAxMTIuNjQwNiA5MC45ODQ0IDEyMy4xODc1IFE4MS40MjE5IDEzMy44NzUgODAuMDE1NiAxNTUuMzkwNiBRODUuMzU5NCAxNDguNSA5My4zNzUgMTQ0Ljg0MzggUTEwMS41MzEyIDE0MS4xODc1IDExMS4wOTM4IDE0MS4xODc1IFExMzEuNDg0NCAxNDEuMTg3NSAxNDMuMjk2OSAxNTEuODc1IFExNTUuMTA5NCAxNjIuNzAzMSAxNTUuMTA5NCAxODEuMjY1NiBRMTU1LjEwOTQgMTk5LjEyNSAxNDIuNzM0NCAyMTAuMjM0NCBRMTMwLjUgMjIxLjIwMzEgMTEwLjEwOTQgMjIxLjIwMzEgUTg2LjYyNSAyMjEuMjAzMSA3NC4yNSAyMDUuNTkzOCBRNjEuODc1IDE4OS45ODQ0IDYxLjg3NSAxNjAuMTcxOSBRNjEuODc1IDEzMi4zMjgxIDc3LjA2MjUgMTE1Ljg3NSBROTIuMjUgOTkuMjgxMiAxMTcuODQzOCA5OS4yODEyIFExMjQuNzM0NCA5OS4yODEyIDEzMS43NjU2IDEwMC40MDYyIFExMzguNzk2OSAxMDEuNjcxOSAxNDYuMzkwNiAxMDMuOTIxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaA3XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02MS44NzUgMTAxLjY3MTkgTDE0OC42NDA2IDEwMS42NzE5IEwxNDguNjQwNiAxMDguNDIxOSBMOTkuNzAzMSAyMTkuMDkzOCBMODAuNTc4MSAyMTkuMDkzOCBMMTI2LjcwMzEgMTE1LjAzMTIgTDYxLjg3NSAxMTUuMDMxMiBMNjEuODc1IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoDhcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEwOC4yODEyIDE2My4xMjUgUTk1LjIwMzEgMTYzLjEyNSA4Ny43NSAxNjkuMzEyNSBRODAuMjk2OSAxNzUuMzU5NCA4MC4yOTY5IDE4NS45MDYyIFE4MC4yOTY5IDE5Ni41OTM4IDg3Ljc1IDIwMi42NDA2IFE5NS4yMDMxIDIwOC42ODc1IDEwOC4yODEyIDIwOC42ODc1IFExMjEuMjE4OCAyMDguNjg3NSAxMjguODEyNSAyMDIuNSBRMTM2LjI2NTYgMTk2LjQ1MzEgMTM2LjI2NTYgMTg1LjkwNjIgUTEzNi4yNjU2IDE3NS4zNTk0IDEyOC44MTI1IDE2OS4zMTI1IFExMjEuMzU5NCAxNjMuMTI1IDEwOC4yODEyIDE2My4xMjUgWk05MCAxNTYuMjM0NCBRNzguMTg3NSAxNTMuNzAzMSA3MS43MTg4IDE0Ni44MTI1IFE2NS4xMDk0IDEzOS43ODEyIDY1LjEwOTQgMTI5LjY1NjIgUTY1LjEwOTQgMTE1LjU5MzggNzYuNjQwNiAxMDcuNDM3NSBRODguMTcxOSA5OS4yODEyIDEwOC4yODEyIDk5LjI4MTIgUTEyOC4zOTA2IDk5LjI4MTIgMTM5LjkyMTkgMTA3LjQzNzUgUTE1MS4zMTI1IDExNS41OTM4IDE1MS4zMTI1IDEyOS42NTYyIFExNTEuMzEyNSAxNDAuMDYyNSAxNDQuODQzOCAxNDYuODEyNSBRMTM4LjIzNDQgMTUzLjcwMzEgMTI2LjU2MjUgMTU2LjIzNDQgUTEzOS4yMTg4IDE1OC43NjU2IDE0Ny4wOTM4IDE2Ni45MjE5IFExNTQuNTQ2OSAxNzQuNjU2MiAxNTQuNTQ2OSAxODUuOTA2MiBRMTU0LjU0NjkgMjAyLjkyMTkgMTQyLjU5MzggMjEyLjA2MjUgUTEzMC41IDIyMS4yMDMxIDEwOC4yODEyIDIyMS4yMDMxIFE4NS45MjE5IDIyMS4yMDMxIDczLjk2ODggMjEyLjA2MjUgUTYxLjg3NSAyMDIuOTIxOSA2MS44NzUgMTg1LjkwNjIgUTYxLjg3NSAxNzQuOTM3NSA2OS4zMjgxIDE2Ni45MjE5IFE3Ni45MjE5IDE1OS4wNDY5IDkwIDE1Ni4yMzQ0IFpNODMuMjUgMTMxLjIwMzEgUTgzLjI1IDE0MC4wNjI1IDg5Ljg1OTQgMTQ1LjQwNjIgUTk2LjMyODEgMTUwLjYwOTQgMTA4LjI4MTIgMTUwLjYwOTQgUTExOS42NzE5IDE1MC42MDk0IDEyNi41NjI1IDE0NS40MDYyIFExMzMuMzEyNSAxNDAuMzQzOCAxMzMuMzEyNSAxMzEuMjAzMSBRMTMzLjMxMjUgMTIyLjM0MzggMTI2LjU2MjUgMTE3IFExMTkuOTUzMSAxMTEuNzk2OSAxMDguMjgxMiAxMTEuNzk2OSBROTYuNjA5NCAxMTEuNzk2OSA4OS44NTk0IDExNyBRODMuMjUgMTIyLjA2MjUgODMuMjUgMTMxLjIwMzEgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgOVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNzAuNTkzOCAyMTYuNTYyNSBMNzAuNTkzOCAyMDIuMDc4MSBRNzcuNDg0NCAyMDQuODkwNiA4NC41MTU2IDIwNi40Mzc1IFE5MS41NDY5IDIwNy44NDM4IDk4LjI5NjkgMjA3Ljg0MzggUTExNi40Mzc1IDIwNy44NDM4IDEyNiAxOTcuMjk2OSBRMTM1LjQyMTkgMTg2Ljc1IDEzNi44MjgxIDE2NS4wOTM4IFExMzEuOTA2MiAxNzEuNzAzMSAxMjMuNDY4OCAxNzUuNSBRMTE1LjQ1MzEgMTc5LjE1NjIgMTA1Ljc1IDE3OS4xNTYyIFE4NS41IDE3OS4xNTYyIDczLjY4NzUgMTY4LjQ2ODggUTYxLjg3NSAxNTcuNzgxMiA2MS44NzUgMTM5LjIxODggUTYxLjg3NSAxMjEuMDc4MSA3NC4xMDk0IDExMC4yNSBRODYuNDg0NCA5OS4yODEyIDEwNi44NzUgOTkuMjgxMiBRMTMwLjM1OTQgOTkuMjgxMiAxNDIuNTkzOCAxMTQuODkwNiBRMTU0Ljk2ODggMTMwLjUgMTU0Ljk2ODggMTYwLjMxMjUgUTE1NC45Njg4IDE4OC4xNTYyIDEzOS45MjE5IDIwNC42MDk0IFExMjQuNzM0NCAyMjEuMjAzMSA5OS4xNDA2IDIyMS4yMDMxIFE5Mi4yNSAyMjEuMjAzMSA4NS4yMTg4IDIyMC4wNzgxIFE3OC4xODc1IDIxOC44MTI1IDcwLjU5MzggMjE2LjU2MjUgWk0xMDYuODc1IDE2Ni43ODEyIFExMTkuMjUgMTY2Ljc4MTIgMTI2LjQyMTkgMTU5LjQ2ODggUTEzMy41OTM4IDE1Mi4xNTYyIDEzMy41OTM4IDEzOS4yMTg4IFExMzMuNTkzOCAxMjYuNTYyNSAxMjYuNDIxOSAxMTkuMjUgUTExOS4yNSAxMTEuNzk2OSAxMDYuODc1IDExMS43OTY5IFE5NC45MjE5IDExMS43OTY5IDg3LjQ2ODggMTE5LjI1IFE4MC4xNTYyIDEyNi41NjI1IDgwLjE1NjIgMTM5LjIxODggUTgwLjE1NjIgMTUyLjE1NjIgODcuNDY4OCAxNTkuNDY4OCBROTQuNjQwNiAxNjYuNzgxMiAxMDYuODc1IDE2Ni43ODEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoDEwXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xNTkuMDQ2OSAxMTEuNzk2OSBRMTQ5LjA2MjUgMTExLjc5NjkgMTQyLjAzMTIgMTIzLjg5MDYgUTEzNC44NTk0IDEzNS45ODQ0IDEzNC44NTk0IDE2MC4xNzE5IFExMzQuODU5NCAxODQuNSAxNDIuMDMxMiAxOTYuNTkzOCBRMTQ5LjA2MjUgMjA4LjY4NzUgMTU5LjA0NjkgMjA4LjY4NzUgUTE2OS4wMzEyIDIwOC42ODc1IDE3Ni4wNjI1IDE5Ni41OTM4IFExODMuMjM0NCAxODQuNSAxODMuMjM0NCAxNjAuMTcxOSBRMTgzLjIzNDQgMTM1Ljk4NDQgMTc2LjA2MjUgMTIzLjg5MDYgUTE2OS4wMzEyIDExMS43OTY5IDE1OS4wNDY5IDExMS43OTY5IFpNMTU5LjA0NjkgOTkuMjgxMiBRMTc3LjQ2ODggOTkuMjgxMiAxODkuNDIxOSAxMTQuODkwNiBRMjAxLjM3NSAxMzAuNSAyMDEuMzc1IDE2MC4xNzE5IFEyMDEuMzc1IDE4OS45ODQ0IDE4OS40MjE5IDIwNS41OTM4IFExNzcuNDY4OCAyMjEuMjAzMSAxNTkuMDQ2OSAyMjEuMjAzMSBRMTM2LjI2NTYgMjIxLjIwMzEgMTI2LjQyMTkgMjA1LjU5MzggUTExNi41NzgxIDE4OS45ODQ0IDExNi41NzgxIDE2MC4xNzE5IFExMTYuNTc4MSAxMzAuNSAxMjYuNDIxOSAxMTQuODkwNiBRMTM2LjI2NTYgOTkuMjgxMiAxNTkuMDQ2OSA5OS4yODEyIFpNODAuNTc4MSAyMTkuMDkzOCBMODAuNTc4MSAxMTcuNzAzMSBMNjEuODc1IDEyMy40Njg4IEw2MS44NzUgMTA3LjE1NjIgTDgxLjU2MjUgMTAxLjY3MTkgTDEwMC44MjgxIDEwMS42NzE5IEwxMDAuODI4MSAyMTkuMDkzOCBMODAuNTc4MSAyMTkuMDkzOCBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaBKXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk04OS4xNTYyIDEwMS42NzE5IEwxMDcuMDE1NiAxMDEuNjcxOSBMMTA3LjAxNTYgMTc4LjczNDQgUTEwNy4wMTU2IDE5OS42ODc1IDk3Ljg3NSAyMDkuNTMxMiBRODguODc1IDIxOS4yMzQ0IDY4Ljc2NTYgMjE5LjIzNDQgTDYxLjg3NSAyMTkuMjM0NCBMNjEuODc1IDIwNS43MzQ0IEw2Ny41IDIwNS43MzQ0IFE3OS4zMTI1IDIwNS43MzQ0IDg0LjIzNDQgMTk5LjgyODEgUTg5LjE1NjIgMTkzLjkyMTkgODkuMTU2MiAxNzguNzM0NCBMODkuMTU2MiAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaBRXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xMDcuMjk2OSAyMjEuMDYyNSBRMTA2LjczNDQgMjIxLjA2MjUgMTA1LjUzOTEgMjIxLjEzMjggUTEwNC4zNDM4IDIyMS4yMDMxIDEwMy42NDA2IDIyMS4yMDMxIFE4MS40MjE5IDIyMS4yMDMxIDcwLjUyMzQgMjA2LjA4NTkgUTU5LjYyNSAxOTAuOTY4OCA1OS42MjUgMTYwLjMxMjUgUTU5LjYyNSAxMjkuNTE1NiA3MC41OTM4IDExNC4zOTg0IFE4MS41NjI1IDk5LjI4MTIgMTAzLjc4MTIgOTkuMjgxMiBRMTI2LjE0MDYgOTkuMjgxMiAxMzcuMTA5NCAxMTQuMzk4NCBRMTQ4LjA3ODEgMTI5LjUxNTYgMTQ4LjA3ODEgMTYwLjMxMjUgUTE0OC4wNzgxIDE4My41MTU2IDE0Mi4wMzEyIDE5Ny42NDg0IFExMzUuOTg0NCAyMTEuNzgxMiAxMjMuNjA5NCAyMTcuNDA2MiBMMTQxLjMyODEgMjMyLjMxMjUgTDEyNy45Njg4IDI0MC4xODc1IEwxMDcuMjk2OSAyMjEuMDYyNSBaTTEyOS4zNzUgMTYwLjMxMjUgUTEyOS4zNzUgMTM0LjQzNzUgMTIzLjM5ODQgMTIzLjMyODEgUTExNy40MjE5IDExMi4yMTg4IDEwMy43ODEyIDExMi4yMTg4IFE5MC4yODEyIDExMi4yMTg4IDg0LjMwNDcgMTIzLjMyODEgUTc4LjMyODEgMTM0LjQzNzUgNzguMzI4MSAxNjAuMzEyNSBRNzguMzI4MSAxODYuMTg3NSA4NC4zMDQ3IDE5Ny4yOTY5IFE5MC4yODEyIDIwOC40MDYyIDEwMy43ODEyIDIwOC40MDYyIFExMTcuNDIxOSAyMDguNDA2MiAxMjMuMzk4NCAxOTcuMjk2OSBRMTI5LjM3NSAxODYuMTg3NSAxMjkuMzc1IDE2MC4zMTI1IFpNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoEtcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTYxLjg3NSAxMDEuNjcxOSBMNzkuNzM0NCAxMDEuNjcxOSBMNzkuNzM0NCAxNTEuMzEyNSBMMTMwLjY0MDYgMTAxLjY3MTkgTDE1My43MDMxIDEwMS42NzE5IEw5Ni40Njg4IDE1Ni41MTU2IEwxNTguMzQzOCAyMTkuMjM0NCBMMTM0Ljg1OTQgMjE5LjIzNDQgTDc5LjczNDQgMTYyLjU2MjUgTDc5LjczNDQgMjE5LjIzNDQgTDYxLjg3NSAyMTkuMjM0NCBMNjEuODc1IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpUFcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTExMC42NzE5IDExNS43MzQ0IEw5MS44MjgxIDE3NS43ODEyIEwxMjkuNTE1NiAxNzUuNzgxMiBMMTEwLjY3MTkgMTE1LjczNDQgWk05OS45ODQ0IDEwMS42NzE5IEwxMjEuNjQwNiAxMDEuNjcxOSBMMTYyLjE0MDYgMjE5LjIzNDQgTDE0My41NzgxIDIxOS4yMzQ0IEwxMzQuMDE1NiAxODguNTc4MSBMODcuNjA5NCAxODguNTc4MSBMNzguMDQ2OSAyMTkuMjM0NCBMNTkuNDg0NCAyMTkuMjM0NCBMOTkuOTg0NCAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaUyXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODYuMzQzOCAyMDMuMDYyNSBMMTQ1Ljk2ODggMjAzLjA2MjUgTDE0NS45Njg4IDIxOS4wOTM4IEw2MS44NzUgMjE5LjA5MzggTDYxLjg3NSAyMDMuNjI1IFE2Ni42NTYyIDE5OS4yNjU2IDc1LjUxNTYgMTkxLjM5MDYgUTEyMy44OTA2IDE0OC41IDEyMy44OTA2IDEzNS4yODEyIFExMjMuODkwNiAxMjYgMTE2LjU3ODEgMTIwLjMwNDcgUTEwOS4yNjU2IDExNC42MDk0IDk3LjMxMjUgMTE0LjYwOTQgUTkwIDExNC42MDk0IDgxLjQyMTkgMTE3LjA3MDMgUTcyLjg0MzggMTE5LjUzMTIgNjIuNzE4OCAxMjQuNDUzMSBMNjIuNzE4OCAxMDcuMTU2MiBRNzMuNTQ2OSAxMDMuMjE4OCA4Mi44OTg0IDEwMS4yNSBROTIuMjUgOTkuMjgxMiAxMDAuMjY1NiA5OS4yODEyIFExMjAuNjU2MiA5OS4yODEyIDEzMi44OTA2IDEwOC41NjI1IFExNDUuMTI1IDExNy44NDM4IDE0NS4xMjUgMTMzLjAzMTIgUTE0NS4xMjUgMTUyLjU3ODEgOTguNTc4MSAxOTIuNTE1NiBROTAuNzAzMSAxOTkuMjY1NiA4Ni4zNDM4IDIwMy4wNjI1IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpTNcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi42ODc1IDI3My42NTYyIFExNzUuNzgxMiAyNTcuMDYyNSAxODMuNTE1NiAyNDguMzQzOCBRMTkyLjIzNDQgMjM4LjM1OTQgMjA0LjA0NjkgMjM4LjM1OTQgUTIyMy41OTM4IDIzOC4zNTk0IDIzMi4zMTI1IDI1OS4zMTI1IFEyMzQuOTg0NCAyNjUuNjQwNiAyMzQuOTg0NCAyNzMuOTM3NSBRMjM0Ljk4NDQgMjk2LjE1NjIgMjE3LjQwNjIgMzE4LjUxNTYgTDE3Mi45Njg4IDM3NS4wNDY5IEwxMjcuOTY4OCAzMTguNTE1NiBRMTEwLjM5MDYgMjk2LjQzNzUgMTEwLjM5MDYgMjczLjkzNzUgUTExMC4zOTA2IDI2NS42NDA2IDExMy4wNjI1IDI1OS4zMTI1IFExMjEuOTIxOSAyMzguMzU5NCAxNDEuMzI4MSAyMzguMzU5NCBRMTUzLjQyMTkgMjM4LjM1OTQgMTYxLjg1OTQgMjQ4LjM0MzggUTE2OS41OTM4IDI1Ny40ODQ0IDE3Mi42ODc1IDI3My42NTYyIFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMjEuNzgxMiAxNTUuNTMxMiBRMTM0LjcxODggMTU4LjA2MjUgMTQxLjgyMDMgMTY1LjcyNjYgUTE0OC45MjE5IDE3My4zOTA2IDE0OC45MjE5IDE4NC45MjE5IFExNDguOTIxOSAyMDIuMzU5NCAxMzUuNTYyNSAyMTEuNzgxMiBRMTIyLjIwMzEgMjIxLjIwMzEgOTcuMzEyNSAyMjEuMjAzMSBRODkuMjk2OSAyMjEuMjAzMSA4MC41MDc4IDIxOS43MjY2IFE3MS43MTg4IDIxOC4yNSA2MS44NzUgMjE1LjQzNzUgTDYxLjg3NSAxOTguNDIxOSBRNjkuMTg3NSAyMDIuMjE4OCA3Ny41NTQ3IDIwNC4wNDY5IFE4NS45MjE5IDIwNS44NzUgOTUuMzQzOCAyMDUuODc1IFExMTAuNjcxOSAyMDUuODc1IDExOS4xMDk0IDIwMC4zMjAzIFExMjcuNTQ2OSAxOTQuNzY1NiAxMjcuNTQ2OSAxODQuOTIxOSBRMTI3LjU0NjkgMTc0LjUxNTYgMTE5Ljc0MjIgMTY5LjE3MTkgUTExMS45Mzc1IDE2My44MjgxIDk2Ljc1IDE2My44MjgxIEw4NC42NTYyIDE2My44MjgxIEw4NC42NTYyIDE0OC42NDA2IEw5Ny44NzUgMTQ4LjY0MDYgUTExMS4wOTM4IDE0OC42NDA2IDExNy45MTQxIDE0NC4yMTA5IFExMjQuNzM0NCAxMzkuNzgxMiAxMjQuNzM0NCAxMzEuMzQzOCBRMTI0LjczNDQgMTIzLjE4NzUgMTE3LjcwMzEgMTE4Ljg5ODQgUTExMC42NzE5IDExNC42MDk0IDk3LjMxMjUgMTE0LjYwOTQgUTkxLjY4NzUgMTE0LjYwOTQgODQuNTE1NiAxMTUuODc1IFE3Ny4zNDM4IDExNy4xNDA2IDY1Ljk1MzEgMTIwLjM3NSBMNjUuOTUzMSAxMDQuMjAzMSBRNzYuMjE4OCAxMDEuODEyNSA4NS4yMTg4IDEwMC41NDY5IFE5NC4yMTg4IDk5LjI4MTIgMTAxLjk1MzEgOTkuMjgxMiBRMTIyLjIwMzEgOTkuMjgxMiAxMzQuMDg1OSAxMDcuNTc4MSBRMTQ1Ljk2ODggMTE1Ljg3NSAxNDUuOTY4OCAxMjkuNzk2OSBRMTQ1Ljk2ODggMTM5LjUgMTM5LjY0MDYgMTQ2LjI1IFExMzMuMzEyNSAxNTMgMTIxLjc4MTIgMTU1LjUzMTIgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlNFxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEyMC4wOTM4IDExOC42ODc1IEw3Ni42NDA2IDE3Ny42MDk0IEwxMjAuMDkzOCAxNzcuNjA5NCBMMTIwLjA5MzggMTE4LjY4NzUgWk0xMTcgMTAxLjY3MTkgTDE0MC4zNDM4IDEwMS42NzE5IEwxNDAuMzQzOCAxNzcuNjA5NCBMMTU5LjMyODEgMTc3LjYwOTQgTDE1OS4zMjgxIDE5Mi45Mzc1IEwxNDAuMzQzOCAxOTIuOTM3NSBMMTQwLjM0MzggMjE5LjA5MzggTDEyMC4wOTM4IDIxOS4wOTM4IEwxMjAuMDkzOCAxOTIuOTM3NSBMNjEuODc1IDE5Mi45Mzc1IEw2MS44NzUgMTc1LjkyMTkgTDExNyAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaU1XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjcuNSAxMDEuNjcxOSBMMTM5LjIxODggMTAxLjY3MTkgTDEzOS4yMTg4IDExNS4wMzEyIEw4NC4yMzQ0IDExNS4wMzEyIEw4NC4yMzQ0IDE0My43MTg4IFE4OC4xNzE5IDE0Mi40NTMxIDkyLjI1IDE0MS44OTA2IFE5Ni4xODc1IDE0MS4zMjgxIDEwMC4xMjUgMTQxLjMyODEgUTEyMi43NjU2IDE0MS4zMjgxIDEzNS45ODQ0IDE1Mi4xNTYyIFExNDkuMjAzMSAxNjIuODQzOCAxNDkuMjAzMSAxODEuMjY1NiBRMTQ5LjIwMzEgMjAwLjI1IDEzNS41NjI1IDIxMC43OTY5IFExMjIuMDYyNSAyMjEuMjAzMSA5Ny4zMTI1IDIyMS4yMDMxIFE4OC44NzUgMjIxLjIwMzEgODAuMDE1NiAyMTkuOTM3NSBRNzEuMTU2MiAyMTguNjcxOSA2MS44NzUgMjE2LjE0MDYgTDYxLjg3NSAyMDAuMjUgUTY5Ljg5MDYgMjA0LjA0NjkgNzguNjA5NCAyMDYuMDE1NiBRODcuMzI4MSAyMDcuODQzOCA5Ny4wMzEyIDIwNy44NDM4IFExMTIuNjQwNiAyMDcuODQzOCAxMjEuNzgxMiAyMDAuNjcxOSBRMTMwLjkyMTkgMTkzLjUgMTMwLjkyMTkgMTgxLjI2NTYgUTEzMC45MjE5IDE2OS4wMzEyIDEyMS43ODEyIDE2MS44NTk0IFExMTIuNjQwNiAxNTQuNjg3NSA5Ny4wMzEyIDE1NC42ODc1IFE4OS43MTg4IDE1NC42ODc1IDgyLjQwNjIgMTU2LjA5MzggUTc1LjA5MzggMTU3LjUgNjcuNSAxNjAuNDUzMSBMNjcuNSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaU2XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTEwLjEwOTQgMTUzLjcwMzEgUTk3LjczNDQgMTUzLjcwMzEgOTAuNTYyNSAxNjEuMDE1NiBRODMuMzkwNiAxNjguNDY4OCA4My4zOTA2IDE4MS4yNjU2IFE4My4zOTA2IDE5My45MjE5IDkwLjU2MjUgMjAxLjIzNDQgUTk3LjczNDQgMjA4LjY4NzUgMTEwLjEwOTQgMjA4LjY4NzUgUTEyMi4zNDM4IDIwOC42ODc1IDEyOS41MTU2IDIwMS4yMzQ0IFExMzYuNjg3NSAxOTMuOTIxOSAxMzYuNjg3NSAxODEuMjY1NiBRMTM2LjY4NzUgMTY4LjQ2ODggMTI5LjUxNTYgMTYxLjAxNTYgUTEyMi4zNDM4IDE1My43MDMxIDExMC4xMDk0IDE1My43MDMxIFpNMTQ2LjM5MDYgMTAzLjkyMTkgTDE0Ni4zOTA2IDExOC40MDYyIFExMzkuNSAxMTUuNTkzOCAxMzIuNDY4OCAxMTQuMTg3NSBRMTI1LjQzNzUgMTEyLjY0MDYgMTE4LjU0NjkgMTEyLjY0MDYgUTEwMC41NDY5IDExMi42NDA2IDkwLjk4NDQgMTIzLjE4NzUgUTgxLjQyMTkgMTMzLjg3NSA4MC4wMTU2IDE1NS4zOTA2IFE4NS4zNTk0IDE0OC41IDkzLjM3NSAxNDQuODQzOCBRMTAxLjUzMTIgMTQxLjE4NzUgMTExLjA5MzggMTQxLjE4NzUgUTEzMS40ODQ0IDE0MS4xODc1IDE0My4yOTY5IDE1MS44NzUgUTE1NS4xMDk0IDE2Mi43MDMxIDE1NS4xMDk0IDE4MS4yNjU2IFExNTUuMTA5NCAxOTkuMTI1IDE0Mi43MzQ0IDIxMC4yMzQ0IFExMzAuNSAyMjEuMjAzMSAxMTAuMTA5NCAyMjEuMjAzMSBRODYuNjI1IDIyMS4yMDMxIDc0LjI1IDIwNS41OTM4IFE2MS44NzUgMTg5Ljk4NDQgNjEuODc1IDE2MC4xNzE5IFE2MS44NzUgMTMyLjMyODEgNzcuMDYyNSAxMTUuODc1IFE5Mi4yNSA5OS4yODEyIDExNy44NDM4IDk5LjI4MTIgUTEyNC43MzQ0IDk5LjI4MTIgMTMxLjc2NTYgMTAwLjQwNjIgUTEzOC43OTY5IDEwMS42NzE5IDE0Ni4zOTA2IDEwMy45MjE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpTdcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi42ODc1IDI3My42NTYyIFExNzUuNzgxMiAyNTcuMDYyNSAxODMuNTE1NiAyNDguMzQzOCBRMTkyLjIzNDQgMjM4LjM1OTQgMjA0LjA0NjkgMjM4LjM1OTQgUTIyMy41OTM4IDIzOC4zNTk0IDIzMi4zMTI1IDI1OS4zMTI1IFEyMzQuOTg0NCAyNjUuNjQwNiAyMzQuOTg0NCAyNzMuOTM3NSBRMjM0Ljk4NDQgMjk2LjE1NjIgMjE3LjQwNjIgMzE4LjUxNTYgTDE3Mi45Njg4IDM3NS4wNDY5IEwxMjcuOTY4OCAzMTguNTE1NiBRMTEwLjM5MDYgMjk2LjQzNzUgMTEwLjM5MDYgMjczLjkzNzUgUTExMC4zOTA2IDI2NS42NDA2IDExMy4wNjI1IDI1OS4zMTI1IFExMjEuOTIxOSAyMzguMzU5NCAxNDEuMzI4MSAyMzguMzU5NCBRMTUzLjQyMTkgMjM4LjM1OTQgMTYxLjg1OTQgMjQ4LjM0MzggUTE2OS41OTM4IDI1Ny40ODQ0IDE3Mi42ODc1IDI3My42NTYyIFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02MS44NzUgMTAxLjY3MTkgTDE0OC42NDA2IDEwMS42NzE5IEwxNDguNjQwNiAxMDguNDIxOSBMOTkuNzAzMSAyMTkuMDkzOCBMODAuNTc4MSAyMTkuMDkzOCBMMTI2LjcwMzEgMTE1LjAzMTIgTDYxLjg3NSAxMTUuMDMxMiBMNjEuODc1IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpThcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi42ODc1IDI3My42NTYyIFExNzUuNzgxMiAyNTcuMDYyNSAxODMuNTE1NiAyNDguMzQzOCBRMTkyLjIzNDQgMjM4LjM1OTQgMjA0LjA0NjkgMjM4LjM1OTQgUTIyMy41OTM4IDIzOC4zNTk0IDIzMi4zMTI1IDI1OS4zMTI1IFEyMzQuOTg0NCAyNjUuNjQwNiAyMzQuOTg0NCAyNzMuOTM3NSBRMjM0Ljk4NDQgMjk2LjE1NjIgMjE3LjQwNjIgMzE4LjUxNTYgTDE3Mi45Njg4IDM3NS4wNDY5IEwxMjcuOTY4OCAzMTguNTE1NiBRMTEwLjM5MDYgMjk2LjQzNzUgMTEwLjM5MDYgMjczLjkzNzUgUTExMC4zOTA2IDI2NS42NDA2IDExMy4wNjI1IDI1OS4zMTI1IFExMjEuOTIxOSAyMzguMzU5NCAxNDEuMzI4MSAyMzguMzU5NCBRMTUzLjQyMTkgMjM4LjM1OTQgMTYxLjg1OTQgMjQ4LjM0MzggUTE2OS41OTM4IDI1Ny40ODQ0IDE3Mi42ODc1IDI3My42NTYyIFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMDguMjgxMiAxNjMuMTI1IFE5NS4yMDMxIDE2My4xMjUgODcuNzUgMTY5LjMxMjUgUTgwLjI5NjkgMTc1LjM1OTQgODAuMjk2OSAxODUuOTA2MiBRODAuMjk2OSAxOTYuNTkzOCA4Ny43NSAyMDIuNjQwNiBROTUuMjAzMSAyMDguNjg3NSAxMDguMjgxMiAyMDguNjg3NSBRMTIxLjIxODggMjA4LjY4NzUgMTI4LjgxMjUgMjAyLjUgUTEzNi4yNjU2IDE5Ni40NTMxIDEzNi4yNjU2IDE4NS45MDYyIFExMzYuMjY1NiAxNzUuMzU5NCAxMjguODEyNSAxNjkuMzEyNSBRMTIxLjM1OTQgMTYzLjEyNSAxMDguMjgxMiAxNjMuMTI1IFpNOTAgMTU2LjIzNDQgUTc4LjE4NzUgMTUzLjcwMzEgNzEuNzE4OCAxNDYuODEyNSBRNjUuMTA5NCAxMzkuNzgxMiA2NS4xMDk0IDEyOS42NTYyIFE2NS4xMDk0IDExNS41OTM4IDc2LjY0MDYgMTA3LjQzNzUgUTg4LjE3MTkgOTkuMjgxMiAxMDguMjgxMiA5OS4yODEyIFExMjguMzkwNiA5OS4yODEyIDEzOS45MjE5IDEwNy40Mzc1IFExNTEuMzEyNSAxMTUuNTkzOCAxNTEuMzEyNSAxMjkuNjU2MiBRMTUxLjMxMjUgMTQwLjA2MjUgMTQ0Ljg0MzggMTQ2LjgxMjUgUTEzOC4yMzQ0IDE1My43MDMxIDEyNi41NjI1IDE1Ni4yMzQ0IFExMzkuMjE4OCAxNTguNzY1NiAxNDcuMDkzOCAxNjYuOTIxOSBRMTU0LjU0NjkgMTc0LjY1NjIgMTU0LjU0NjkgMTg1LjkwNjIgUTE1NC41NDY5IDIwMi45MjE5IDE0Mi41OTM4IDIxMi4wNjI1IFExMzAuNSAyMjEuMjAzMSAxMDguMjgxMiAyMjEuMjAzMSBRODUuOTIxOSAyMjEuMjAzMSA3My45Njg4IDIxMi4wNjI1IFE2MS44NzUgMjAyLjkyMTkgNjEuODc1IDE4NS45MDYyIFE2MS44NzUgMTc0LjkzNzUgNjkuMzI4MSAxNjYuOTIxOSBRNzYuOTIxOSAxNTkuMDQ2OSA5MCAxNTYuMjM0NCBaTTgzLjI1IDEzMS4yMDMxIFE4My4yNSAxNDAuMDYyNSA4OS44NTk0IDE0NS40MDYyIFE5Ni4zMjgxIDE1MC42MDk0IDEwOC4yODEyIDE1MC42MDk0IFExMTkuNjcxOSAxNTAuNjA5NCAxMjYuNTYyNSAxNDUuNDA2MiBRMTMzLjMxMjUgMTQwLjM0MzggMTMzLjMxMjUgMTMxLjIwMzEgUTEzMy4zMTI1IDEyMi4zNDM4IDEyNi41NjI1IDExNyBRMTE5Ljk1MzEgMTExLjc5NjkgMTA4LjI4MTIgMTExLjc5NjkgUTk2LjYwOTQgMTExLjc5NjkgODkuODU5NCAxMTcgUTgzLjI1IDEyMi4wNjI1IDgzLjI1IDEzMS4yMDMxIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpTlcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi42ODc1IDI3My42NTYyIFExNzUuNzgxMiAyNTcuMDYyNSAxODMuNTE1NiAyNDguMzQzOCBRMTkyLjIzNDQgMjM4LjM1OTQgMjA0LjA0NjkgMjM4LjM1OTQgUTIyMy41OTM4IDIzOC4zNTk0IDIzMi4zMTI1IDI1OS4zMTI1IFEyMzQuOTg0NCAyNjUuNjQwNiAyMzQuOTg0NCAyNzMuOTM3NSBRMjM0Ljk4NDQgMjk2LjE1NjIgMjE3LjQwNjIgMzE4LjUxNTYgTDE3Mi45Njg4IDM3NS4wNDY5IEwxMjcuOTY4OCAzMTguNTE1NiBRMTEwLjM5MDYgMjk2LjQzNzUgMTEwLjM5MDYgMjczLjkzNzUgUTExMC4zOTA2IDI2NS42NDA2IDExMy4wNjI1IDI1OS4zMTI1IFExMjEuOTIxOSAyMzguMzU5NCAxNDEuMzI4MSAyMzguMzU5NCBRMTUzLjQyMTkgMjM4LjM1OTQgMTYxLjg1OTQgMjQ4LjM0MzggUTE2OS41OTM4IDI1Ny40ODQ0IDE3Mi42ODc1IDI3My42NTYyIFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk03MC41OTM4IDIxNi41NjI1IEw3MC41OTM4IDIwMi4wNzgxIFE3Ny40ODQ0IDIwNC44OTA2IDg0LjUxNTYgMjA2LjQzNzUgUTkxLjU0NjkgMjA3Ljg0MzggOTguMjk2OSAyMDcuODQzOCBRMTE2LjQzNzUgMjA3Ljg0MzggMTI2IDE5Ny4yOTY5IFExMzUuNDIxOSAxODYuNzUgMTM2LjgyODEgMTY1LjA5MzggUTEzMS45MDYyIDE3MS43MDMxIDEyMy40Njg4IDE3NS41IFExMTUuNDUzMSAxNzkuMTU2MiAxMDUuNzUgMTc5LjE1NjIgUTg1LjUgMTc5LjE1NjIgNzMuNjg3NSAxNjguNDY4OCBRNjEuODc1IDE1Ny43ODEyIDYxLjg3NSAxMzkuMjE4OCBRNjEuODc1IDEyMS4wNzgxIDc0LjEwOTQgMTEwLjI1IFE4Ni40ODQ0IDk5LjI4MTIgMTA2Ljg3NSA5OS4yODEyIFExMzAuMzU5NCA5OS4yODEyIDE0Mi41OTM4IDExNC44OTA2IFExNTQuOTY4OCAxMzAuNSAxNTQuOTY4OCAxNjAuMzEyNSBRMTU0Ljk2ODggMTg4LjE1NjIgMTM5LjkyMTkgMjA0LjYwOTQgUTEyNC43MzQ0IDIyMS4yMDMxIDk5LjE0MDYgMjIxLjIwMzEgUTkyLjI1IDIyMS4yMDMxIDg1LjIxODggMjIwLjA3ODEgUTc4LjE4NzUgMjE4LjgxMjUgNzAuNTkzOCAyMTYuNTYyNSBaTTEwNi44NzUgMTY2Ljc4MTIgUTExOS4yNSAxNjYuNzgxMiAxMjYuNDIxOSAxNTkuNDY4OCBRMTMzLjU5MzggMTUyLjE1NjIgMTMzLjU5MzggMTM5LjIxODggUTEzMy41OTM4IDEyNi41NjI1IDEyNi40MjE5IDExOS4yNSBRMTE5LjI1IDExMS43OTY5IDEwNi44NzUgMTExLjc5NjkgUTk0LjkyMTkgMTExLjc5NjkgODcuNDY4OCAxMTkuMjUgUTgwLjE1NjIgMTI2LjU2MjUgODAuMTU2MiAxMzkuMjE4OCBRODAuMTU2MiAxNTIuMTU2MiA4Ny40Njg4IDE1OS40Njg4IFE5NC42NDA2IDE2Ni43ODEyIDEwNi44NzUgMTY2Ljc4MTIgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlMTBcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi42ODc1IDI3My42NTYyIFExNzUuNzgxMiAyNTcuMDYyNSAxODMuNTE1NiAyNDguMzQzOCBRMTkyLjIzNDQgMjM4LjM1OTQgMjA0LjA0NjkgMjM4LjM1OTQgUTIyMy41OTM4IDIzOC4zNTk0IDIzMi4zMTI1IDI1OS4zMTI1IFEyMzQuOTg0NCAyNjUuNjQwNiAyMzQuOTg0NCAyNzMuOTM3NSBRMjM0Ljk4NDQgMjk2LjE1NjIgMjE3LjQwNjIgMzE4LjUxNTYgTDE3Mi45Njg4IDM3NS4wNDY5IEwxMjcuOTY4OCAzMTguNTE1NiBRMTEwLjM5MDYgMjk2LjQzNzUgMTEwLjM5MDYgMjczLjkzNzUgUTExMC4zOTA2IDI2NS42NDA2IDExMy4wNjI1IDI1OS4zMTI1IFExMjEuOTIxOSAyMzguMzU5NCAxNDEuMzI4MSAyMzguMzU5NCBRMTUzLjQyMTkgMjM4LjM1OTQgMTYxLjg1OTQgMjQ4LjM0MzggUTE2OS41OTM4IDI1Ny40ODQ0IDE3Mi42ODc1IDI3My42NTYyIFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xNTkuMDQ2OSAxMTEuNzk2OSBRMTQ5LjA2MjUgMTExLjc5NjkgMTQyLjAzMTIgMTIzLjg5MDYgUTEzNC44NTk0IDEzNS45ODQ0IDEzNC44NTk0IDE2MC4xNzE5IFExMzQuODU5NCAxODQuNSAxNDIuMDMxMiAxOTYuNTkzOCBRMTQ5LjA2MjUgMjA4LjY4NzUgMTU5LjA0NjkgMjA4LjY4NzUgUTE2OS4wMzEyIDIwOC42ODc1IDE3Ni4wNjI1IDE5Ni41OTM4IFExODMuMjM0NCAxODQuNSAxODMuMjM0NCAxNjAuMTcxOSBRMTgzLjIzNDQgMTM1Ljk4NDQgMTc2LjA2MjUgMTIzLjg5MDYgUTE2OS4wMzEyIDExMS43OTY5IDE1OS4wNDY5IDExMS43OTY5IFpNMTU5LjA0NjkgOTkuMjgxMiBRMTc3LjQ2ODggOTkuMjgxMiAxODkuNDIxOSAxMTQuODkwNiBRMjAxLjM3NSAxMzAuNSAyMDEuMzc1IDE2MC4xNzE5IFEyMDEuMzc1IDE4OS45ODQ0IDE4OS40MjE5IDIwNS41OTM4IFExNzcuNDY4OCAyMjEuMjAzMSAxNTkuMDQ2OSAyMjEuMjAzMSBRMTM2LjI2NTYgMjIxLjIwMzEgMTI2LjQyMTkgMjA1LjU5MzggUTExNi41NzgxIDE4OS45ODQ0IDExNi41NzgxIDE2MC4xNzE5IFExMTYuNTc4MSAxMzAuNSAxMjYuNDIxOSAxMTQuODkwNiBRMTM2LjI2NTYgOTkuMjgxMiAxNTkuMDQ2OSA5OS4yODEyIFpNODAuNTc4MSAyMTkuMDkzOCBMODAuNTc4MSAxMTcuNzAzMSBMNjEuODc1IDEyMy40Njg4IEw2MS44NzUgMTA3LjE1NjIgTDgxLjU2MjUgMTAxLjY3MTkgTDEwMC44MjgxIDEwMS42NzE5IEwxMDAuODI4MSAyMTkuMDkzOCBMODAuNTc4MSAyMTkuMDkzOCBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaVKXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODkuMTU2MiAxMDEuNjcxOSBMMTA3LjAxNTYgMTAxLjY3MTkgTDEwNy4wMTU2IDE3OC43MzQ0IFExMDcuMDE1NiAxOTkuNjg3NSA5Ny44NzUgMjA5LjUzMTIgUTg4Ljg3NSAyMTkuMjM0NCA2OC43NjU2IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAyMDUuNzM0NCBMNjcuNSAyMDUuNzM0NCBRNzkuMzEyNSAyMDUuNzM0NCA4NC4yMzQ0IDE5OS44MjgxIFE4OS4xNTYyIDE5My45MjE5IDg5LjE1NjIgMTc4LjczNDQgTDg5LjE1NjIgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlUVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTA3LjI5NjkgMjIxLjA2MjUgUTEwNi43MzQ0IDIyMS4wNjI1IDEwNS41MzkxIDIyMS4xMzI4IFExMDQuMzQzOCAyMjEuMjAzMSAxMDMuNjQwNiAyMjEuMjAzMSBRODEuNDIxOSAyMjEuMjAzMSA3MC41MjM0IDIwNi4wODU5IFE1OS42MjUgMTkwLjk2ODggNTkuNjI1IDE2MC4zMTI1IFE1OS42MjUgMTI5LjUxNTYgNzAuNTkzOCAxMTQuMzk4NCBRODEuNTYyNSA5OS4yODEyIDEwMy43ODEyIDk5LjI4MTIgUTEyNi4xNDA2IDk5LjI4MTIgMTM3LjEwOTQgMTE0LjM5ODQgUTE0OC4wNzgxIDEyOS41MTU2IDE0OC4wNzgxIDE2MC4zMTI1IFExNDguMDc4MSAxODMuNTE1NiAxNDIuMDMxMiAxOTcuNjQ4NCBRMTM1Ljk4NDQgMjExLjc4MTIgMTIzLjYwOTQgMjE3LjQwNjIgTDE0MS4zMjgxIDIzMi4zMTI1IEwxMjcuOTY4OCAyNDAuMTg3NSBMMTA3LjI5NjkgMjIxLjA2MjUgWk0xMjkuMzc1IDE2MC4zMTI1IFExMjkuMzc1IDEzNC40Mzc1IDEyMy4zOTg0IDEyMy4zMjgxIFExMTcuNDIxOSAxMTIuMjE4OCAxMDMuNzgxMiAxMTIuMjE4OCBROTAuMjgxMiAxMTIuMjE4OCA4NC4zMDQ3IDEyMy4zMjgxIFE3OC4zMjgxIDEzNC40Mzc1IDc4LjMyODEgMTYwLjMxMjUgUTc4LjMyODEgMTg2LjE4NzUgODQuMzA0NyAxOTcuMjk2OSBROTAuMjgxMiAyMDguNDA2MiAxMDMuNzgxMiAyMDguNDA2MiBRMTE3LjQyMTkgMjA4LjQwNjIgMTIzLjM5ODQgMTk3LjI5NjkgUTEyOS4zNzUgMTg2LjE4NzUgMTI5LjM3NSAxNjAuMzEyNSBaTTE3Mi42ODc1IDI3My42NTYyIFExNzUuNzgxMiAyNTcuMDYyNSAxODMuNTE1NiAyNDguMzQzOCBRMTkyLjIzNDQgMjM4LjM1OTQgMjA0LjA0NjkgMjM4LjM1OTQgUTIyMy41OTM4IDIzOC4zNTk0IDIzMi4zMTI1IDI1OS4zMTI1IFEyMzQuOTg0NCAyNjUuNjQwNiAyMzQuOTg0NCAyNzMuOTM3NSBRMjM0Ljk4NDQgMjk2LjE1NjIgMjE3LjQwNjIgMzE4LjUxNTYgTDE3Mi45Njg4IDM3NS4wNDY5IEwxMjcuOTY4OCAzMTguNTE1NiBRMTEwLjM5MDYgMjk2LjQzNzUgMTEwLjM5MDYgMjczLjkzNzUgUTExMC4zOTA2IDI2NS42NDA2IDExMy4wNjI1IDI1OS4zMTI1IFExMjEuOTIxOSAyMzguMzU5NCAxNDEuMzI4MSAyMzguMzU5NCBRMTUzLjQyMTkgMjM4LjM1OTQgMTYxLjg1OTQgMjQ4LjM0MzggUTE2OS41OTM4IDI1Ny40ODQ0IDE3Mi42ODc1IDI3My42NTYyIFpNNjQuMjY1NiA4NC43OTY5IFE0Ny4zOTA2IDg0Ljc5NjkgNDcuMzkwNiAxMDEuNjcxOSBMNDcuMzkwNiAzNzAuNjg3NSBRNDcuMzkwNiAzODcuNTYyNSA2NC4yNjU2IDM4Ny41NjI1IEwyMzUuMTI1IDM4Ny41NjI1IFEyNTIgMzg3LjU2MjUgMjUyIDM3MC42ODc1IEwyNTIgMTAxLjY3MTkgUTI1MiA4NC43OTY5IDIzNS4xMjUgODQuNzk2OSBMNjQuMjY1NiA4NC43OTY5IFpNNjQuMjY1NiA2Ny45MjE5IEwyMzUuMTI1IDY3LjkyMTkgUTI2OC44NzUgNjcuOTIxOSAyNjguODc1IDEwMS42NzE5IEwyNjguODc1IDM3MC42ODc1IFEyNjguODc1IDQwNC40Mzc1IDIzNS4xMjUgNDA0LjQzNzUgTDY0LjI2NTYgNDA0LjQzNzUgUTMwLjUxNTYgNDA0LjQzNzUgMzAuNTE1NiAzNzAuNjg3NSBMMzAuNTE1NiAxMDEuNjcxOSBRMzAuNTE1NiA2Ny45MjE5IDY0LjI2NTYgNjcuOTIxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaVLXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjEuODc1IDEwMS42NzE5IEw3OS43MzQ0IDEwMS42NzE5IEw3OS43MzQ0IDE1MS4zMTI1IEwxMzAuNjQwNiAxMDEuNjcxOSBMMTUzLjcwMzEgMTAxLjY3MTkgTDk2LjQ2ODggMTU2LjUxNTYgTDE1OC4zNDM4IDIxOS4yMzQ0IEwxMzQuODU5NCAyMTkuMjM0NCBMNzkuNzM0NCAxNjIuNTYyNSBMNzkuNzM0NCAyMTkuMjM0NCBMNjEuODc1IDIxOS4yMzQ0IEw2MS44NzUgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmQVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTExMC42NzE5IDExNS43MzQ0IEw5MS44MjgxIDE3NS43ODEyIEwxMjkuNTE1NiAxNzUuNzgxMiBMMTEwLjY3MTkgMTE1LjczNDQgWk05OS45ODQ0IDEwMS42NzE5IEwxMjEuNjQwNiAxMDEuNjcxOSBMMTYyLjE0MDYgMjE5LjIzNDQgTDE0My41NzgxIDIxOS4yMzQ0IEwxMzQuMDE1NiAxODguNTc4MSBMODcuNjA5NCAxODguNTc4MSBMNzguMDQ2OSAyMTkuMjM0NCBMNTkuNDg0NCAyMTkuMjM0NCBMOTkuOTg0NCAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaYyXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODYuMzQzOCAyMDMuMDYyNSBMMTQ1Ljk2ODggMjAzLjA2MjUgTDE0NS45Njg4IDIxOS4wOTM4IEw2MS44NzUgMjE5LjA5MzggTDYxLjg3NSAyMDMuNjI1IFE2Ni42NTYyIDE5OS4yNjU2IDc1LjUxNTYgMTkxLjM5MDYgUTEyMy44OTA2IDE0OC41IDEyMy44OTA2IDEzNS4yODEyIFExMjMuODkwNiAxMjYgMTE2LjU3ODEgMTIwLjMwNDcgUTEwOS4yNjU2IDExNC42MDk0IDk3LjMxMjUgMTE0LjYwOTQgUTkwIDExNC42MDk0IDgxLjQyMTkgMTE3LjA3MDMgUTcyLjg0MzggMTE5LjUzMTIgNjIuNzE4OCAxMjQuNDUzMSBMNjIuNzE4OCAxMDcuMTU2MiBRNzMuNTQ2OSAxMDMuMjE4OCA4Mi44OTg0IDEwMS4yNSBROTIuMjUgOTkuMjgxMiAxMDAuMjY1NiA5OS4yODEyIFExMjAuNjU2MiA5OS4yODEyIDEzMi44OTA2IDEwOC41NjI1IFExNDUuMTI1IDExNy44NDM4IDE0NS4xMjUgMTMzLjAzMTIgUTE0NS4xMjUgMTUyLjU3ODEgOTguNTc4MSAxOTIuNTE1NiBROTAuNzAzMSAxOTkuMjY1NiA4Ni4zNDM4IDIwMy4wNjI1IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpjNcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMjEuNzgxMiAxNTUuNTMxMiBRMTM0LjcxODggMTU4LjA2MjUgMTQxLjgyMDMgMTY1LjcyNjYgUTE0OC45MjE5IDE3My4zOTA2IDE0OC45MjE5IDE4NC45MjE5IFExNDguOTIxOSAyMDIuMzU5NCAxMzUuNTYyNSAyMTEuNzgxMiBRMTIyLjIwMzEgMjIxLjIwMzEgOTcuMzEyNSAyMjEuMjAzMSBRODkuMjk2OSAyMjEuMjAzMSA4MC41MDc4IDIxOS43MjY2IFE3MS43MTg4IDIxOC4yNSA2MS44NzUgMjE1LjQzNzUgTDYxLjg3NSAxOTguNDIxOSBRNjkuMTg3NSAyMDIuMjE4OCA3Ny41NTQ3IDIwNC4wNDY5IFE4NS45MjE5IDIwNS44NzUgOTUuMzQzOCAyMDUuODc1IFExMTAuNjcxOSAyMDUuODc1IDExOS4xMDk0IDIwMC4zMjAzIFExMjcuNTQ2OSAxOTQuNzY1NiAxMjcuNTQ2OSAxODQuOTIxOSBRMTI3LjU0NjkgMTc0LjUxNTYgMTE5Ljc0MjIgMTY5LjE3MTkgUTExMS45Mzc1IDE2My44MjgxIDk2Ljc1IDE2My44MjgxIEw4NC42NTYyIDE2My44MjgxIEw4NC42NTYyIDE0OC42NDA2IEw5Ny44NzUgMTQ4LjY0MDYgUTExMS4wOTM4IDE0OC42NDA2IDExNy45MTQxIDE0NC4yMTA5IFExMjQuNzM0NCAxMzkuNzgxMiAxMjQuNzM0NCAxMzEuMzQzOCBRMTI0LjczNDQgMTIzLjE4NzUgMTE3LjcwMzEgMTE4Ljg5ODQgUTExMC42NzE5IDExNC42MDk0IDk3LjMxMjUgMTE0LjYwOTQgUTkxLjY4NzUgMTE0LjYwOTQgODQuNTE1NiAxMTUuODc1IFE3Ny4zNDM4IDExNy4xNDA2IDY1Ljk1MzEgMTIwLjM3NSBMNjUuOTUzMSAxMDQuMjAzMSBRNzYuMjE4OCAxMDEuODEyNSA4NS4yMTg4IDEwMC41NDY5IFE5NC4yMTg4IDk5LjI4MTIgMTAxLjk1MzEgOTkuMjgxMiBRMTIyLjIwMzEgOTkuMjgxMiAxMzQuMDg1OSAxMDcuNTc4MSBRMTQ1Ljk2ODggMTE1Ljg3NSAxNDUuOTY4OCAxMjkuNzk2OSBRMTQ1Ljk2ODggMTM5LjUgMTM5LjY0MDYgMTQ2LjI1IFExMzMuMzEyNSAxNTMgMTIxLjc4MTIgMTU1LjUzMTIgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmNFxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEyMC4wOTM4IDExOC42ODc1IEw3Ni42NDA2IDE3Ny42MDk0IEwxMjAuMDkzOCAxNzcuNjA5NCBMMTIwLjA5MzggMTE4LjY4NzUgWk0xMTcgMTAxLjY3MTkgTDE0MC4zNDM4IDEwMS42NzE5IEwxNDAuMzQzOCAxNzcuNjA5NCBMMTU5LjMyODEgMTc3LjYwOTQgTDE1OS4zMjgxIDE5Mi45Mzc1IEwxNDAuMzQzOCAxOTIuOTM3NSBMMTQwLjM0MzggMjE5LjA5MzggTDEyMC4wOTM4IDIxOS4wOTM4IEwxMjAuMDkzOCAxOTIuOTM3NSBMNjEuODc1IDE5Mi45Mzc1IEw2MS44NzUgMTc1LjkyMTkgTDExNyAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaY1XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjcuNSAxMDEuNjcxOSBMMTM5LjIxODggMTAxLjY3MTkgTDEzOS4yMTg4IDExNS4wMzEyIEw4NC4yMzQ0IDExNS4wMzEyIEw4NC4yMzQ0IDE0My43MTg4IFE4OC4xNzE5IDE0Mi40NTMxIDkyLjI1IDE0MS44OTA2IFE5Ni4xODc1IDE0MS4zMjgxIDEwMC4xMjUgMTQxLjMyODEgUTEyMi43NjU2IDE0MS4zMjgxIDEzNS45ODQ0IDE1Mi4xNTYyIFExNDkuMjAzMSAxNjIuODQzOCAxNDkuMjAzMSAxODEuMjY1NiBRMTQ5LjIwMzEgMjAwLjI1IDEzNS41NjI1IDIxMC43OTY5IFExMjIuMDYyNSAyMjEuMjAzMSA5Ny4zMTI1IDIyMS4yMDMxIFE4OC44NzUgMjIxLjIwMzEgODAuMDE1NiAyMTkuOTM3NSBRNzEuMTU2MiAyMTguNjcxOSA2MS44NzUgMjE2LjE0MDYgTDYxLjg3NSAyMDAuMjUgUTY5Ljg5MDYgMjA0LjA0NjkgNzguNjA5NCAyMDYuMDE1NiBRODcuMzI4MSAyMDcuODQzOCA5Ny4wMzEyIDIwNy44NDM4IFExMTIuNjQwNiAyMDcuODQzOCAxMjEuNzgxMiAyMDAuNjcxOSBRMTMwLjkyMTkgMTkzLjUgMTMwLjkyMTkgMTgxLjI2NTYgUTEzMC45MjE5IDE2OS4wMzEyIDEyMS43ODEyIDE2MS44NTk0IFExMTIuNjQwNiAxNTQuNjg3NSA5Ny4wMzEyIDE1NC42ODc1IFE4OS43MTg4IDE1NC42ODc1IDgyLjQwNjIgMTU2LjA5MzggUTc1LjA5MzggMTU3LjUgNjcuNSAxNjAuNDUzMSBMNjcuNSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaY2XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTEwLjEwOTQgMTUzLjcwMzEgUTk3LjczNDQgMTUzLjcwMzEgOTAuNTYyNSAxNjEuMDE1NiBRODMuMzkwNiAxNjguNDY4OCA4My4zOTA2IDE4MS4yNjU2IFE4My4zOTA2IDE5My45MjE5IDkwLjU2MjUgMjAxLjIzNDQgUTk3LjczNDQgMjA4LjY4NzUgMTEwLjEwOTQgMjA4LjY4NzUgUTEyMi4zNDM4IDIwOC42ODc1IDEyOS41MTU2IDIwMS4yMzQ0IFExMzYuNjg3NSAxOTMuOTIxOSAxMzYuNjg3NSAxODEuMjY1NiBRMTM2LjY4NzUgMTY4LjQ2ODggMTI5LjUxNTYgMTYxLjAxNTYgUTEyMi4zNDM4IDE1My43MDMxIDExMC4xMDk0IDE1My43MDMxIFpNMTQ2LjM5MDYgMTAzLjkyMTkgTDE0Ni4zOTA2IDExOC40MDYyIFExMzkuNSAxMTUuNTkzOCAxMzIuNDY4OCAxMTQuMTg3NSBRMTI1LjQzNzUgMTEyLjY0MDYgMTE4LjU0NjkgMTEyLjY0MDYgUTEwMC41NDY5IDExMi42NDA2IDkwLjk4NDQgMTIzLjE4NzUgUTgxLjQyMTkgMTMzLjg3NSA4MC4wMTU2IDE1NS4zOTA2IFE4NS4zNTk0IDE0OC41IDkzLjM3NSAxNDQuODQzOCBRMTAxLjUzMTIgMTQxLjE4NzUgMTExLjA5MzggMTQxLjE4NzUgUTEzMS40ODQ0IDE0MS4xODc1IDE0My4yOTY5IDE1MS44NzUgUTE1NS4xMDk0IDE2Mi43MDMxIDE1NS4xMDk0IDE4MS4yNjU2IFExNTUuMTA5NCAxOTkuMTI1IDE0Mi43MzQ0IDIxMC4yMzQ0IFExMzAuNSAyMjEuMjAzMSAxMTAuMTA5NCAyMjEuMjAzMSBRODYuNjI1IDIyMS4yMDMxIDc0LjI1IDIwNS41OTM4IFE2MS44NzUgMTg5Ljk4NDQgNjEuODc1IDE2MC4xNzE5IFE2MS44NzUgMTMyLjMyODEgNzcuMDYyNSAxMTUuODc1IFE5Mi4yNSA5OS4yODEyIDExNy44NDM4IDk5LjI4MTIgUTEyNC43MzQ0IDk5LjI4MTIgMTMxLjc2NTYgMTAwLjQwNjIgUTEzOC43OTY5IDEwMS42NzE5IDE0Ni4zOTA2IDEwMy45MjE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpjdcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02MS44NzUgMTAxLjY3MTkgTDE0OC42NDA2IDEwMS42NzE5IEwxNDguNjQwNiAxMDguNDIxOSBMOTkuNzAzMSAyMTkuMDkzOCBMODAuNTc4MSAyMTkuMDkzOCBMMTI2LjcwMzEgMTE1LjAzMTIgTDYxLjg3NSAxMTUuMDMxMiBMNjEuODc1IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpjhcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMDguMjgxMiAxNjMuMTI1IFE5NS4yMDMxIDE2My4xMjUgODcuNzUgMTY5LjMxMjUgUTgwLjI5NjkgMTc1LjM1OTQgODAuMjk2OSAxODUuOTA2MiBRODAuMjk2OSAxOTYuNTkzOCA4Ny43NSAyMDIuNjQwNiBROTUuMjAzMSAyMDguNjg3NSAxMDguMjgxMiAyMDguNjg3NSBRMTIxLjIxODggMjA4LjY4NzUgMTI4LjgxMjUgMjAyLjUgUTEzNi4yNjU2IDE5Ni40NTMxIDEzNi4yNjU2IDE4NS45MDYyIFExMzYuMjY1NiAxNzUuMzU5NCAxMjguODEyNSAxNjkuMzEyNSBRMTIxLjM1OTQgMTYzLjEyNSAxMDguMjgxMiAxNjMuMTI1IFpNOTAgMTU2LjIzNDQgUTc4LjE4NzUgMTUzLjcwMzEgNzEuNzE4OCAxNDYuODEyNSBRNjUuMTA5NCAxMzkuNzgxMiA2NS4xMDk0IDEyOS42NTYyIFE2NS4xMDk0IDExNS41OTM4IDc2LjY0MDYgMTA3LjQzNzUgUTg4LjE3MTkgOTkuMjgxMiAxMDguMjgxMiA5OS4yODEyIFExMjguMzkwNiA5OS4yODEyIDEzOS45MjE5IDEwNy40Mzc1IFExNTEuMzEyNSAxMTUuNTkzOCAxNTEuMzEyNSAxMjkuNjU2MiBRMTUxLjMxMjUgMTQwLjA2MjUgMTQ0Ljg0MzggMTQ2LjgxMjUgUTEzOC4yMzQ0IDE1My43MDMxIDEyNi41NjI1IDE1Ni4yMzQ0IFExMzkuMjE4OCAxNTguNzY1NiAxNDcuMDkzOCAxNjYuOTIxOSBRMTU0LjU0NjkgMTc0LjY1NjIgMTU0LjU0NjkgMTg1LjkwNjIgUTE1NC41NDY5IDIwMi45MjE5IDE0Mi41OTM4IDIxMi4wNjI1IFExMzAuNSAyMjEuMjAzMSAxMDguMjgxMiAyMjEuMjAzMSBRODUuOTIxOSAyMjEuMjAzMSA3My45Njg4IDIxMi4wNjI1IFE2MS44NzUgMjAyLjkyMTkgNjEuODc1IDE4NS45MDYyIFE2MS44NzUgMTc0LjkzNzUgNjkuMzI4MSAxNjYuOTIxOSBRNzYuOTIxOSAxNTkuMDQ2OSA5MCAxNTYuMjM0NCBaTTgzLjI1IDEzMS4yMDMxIFE4My4yNSAxNDAuMDYyNSA4OS44NTk0IDE0NS40MDYyIFE5Ni4zMjgxIDE1MC42MDk0IDEwOC4yODEyIDE1MC42MDk0IFExMTkuNjcxOSAxNTAuNjA5NCAxMjYuNTYyNSAxNDUuNDA2MiBRMTMzLjMxMjUgMTQwLjM0MzggMTMzLjMxMjUgMTMxLjIwMzEgUTEzMy4zMTI1IDEyMi4zNDM4IDEyNi41NjI1IDExNyBRMTE5Ljk1MzEgMTExLjc5NjkgMTA4LjI4MTIgMTExLjc5NjkgUTk2LjYwOTQgMTExLjc5NjkgODkuODU5NCAxMTcgUTgzLjI1IDEyMi4wNjI1IDgzLjI1IDEzMS4yMDMxIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpjlcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk03MC41OTM4IDIxNi41NjI1IEw3MC41OTM4IDIwMi4wNzgxIFE3Ny40ODQ0IDIwNC44OTA2IDg0LjUxNTYgMjA2LjQzNzUgUTkxLjU0NjkgMjA3Ljg0MzggOTguMjk2OSAyMDcuODQzOCBRMTE2LjQzNzUgMjA3Ljg0MzggMTI2IDE5Ny4yOTY5IFExMzUuNDIxOSAxODYuNzUgMTM2LjgyODEgMTY1LjA5MzggUTEzMS45MDYyIDE3MS43MDMxIDEyMy40Njg4IDE3NS41IFExMTUuNDUzMSAxNzkuMTU2MiAxMDUuNzUgMTc5LjE1NjIgUTg1LjUgMTc5LjE1NjIgNzMuNjg3NSAxNjguNDY4OCBRNjEuODc1IDE1Ny43ODEyIDYxLjg3NSAxMzkuMjE4OCBRNjEuODc1IDEyMS4wNzgxIDc0LjEwOTQgMTEwLjI1IFE4Ni40ODQ0IDk5LjI4MTIgMTA2Ljg3NSA5OS4yODEyIFExMzAuMzU5NCA5OS4yODEyIDE0Mi41OTM4IDExNC44OTA2IFExNTQuOTY4OCAxMzAuNSAxNTQuOTY4OCAxNjAuMzEyNSBRMTU0Ljk2ODggMTg4LjE1NjIgMTM5LjkyMTkgMjA0LjYwOTQgUTEyNC43MzQ0IDIyMS4yMDMxIDk5LjE0MDYgMjIxLjIwMzEgUTkyLjI1IDIyMS4yMDMxIDg1LjIxODggMjIwLjA3ODEgUTc4LjE4NzUgMjE4LjgxMjUgNzAuNTkzOCAyMTYuNTYyNSBaTTEwNi44NzUgMTY2Ljc4MTIgUTExOS4yNSAxNjYuNzgxMiAxMjYuNDIxOSAxNTkuNDY4OCBRMTMzLjU5MzggMTUyLjE1NjIgMTMzLjU5MzggMTM5LjIxODggUTEzMy41OTM4IDEyNi41NjI1IDEyNi40MjE5IDExOS4yNSBRMTE5LjI1IDExMS43OTY5IDEwNi44NzUgMTExLjc5NjkgUTk0LjkyMTkgMTExLjc5NjkgODcuNDY4OCAxMTkuMjUgUTgwLjE1NjIgMTI2LjU2MjUgODAuMTU2MiAxMzkuMjE4OCBRODAuMTU2MiAxNTIuMTU2MiA4Ny40Njg4IDE1OS40Njg4IFE5NC42NDA2IDE2Ni43ODEyIDEwNi44NzUgMTY2Ljc4MTIgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmMTBcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xNTkuMDQ2OSAxMTEuNzk2OSBRMTQ5LjA2MjUgMTExLjc5NjkgMTQyLjAzMTIgMTIzLjg5MDYgUTEzNC44NTk0IDEzNS45ODQ0IDEzNC44NTk0IDE2MC4xNzE5IFExMzQuODU5NCAxODQuNSAxNDIuMDMxMiAxOTYuNTkzOCBRMTQ5LjA2MjUgMjA4LjY4NzUgMTU5LjA0NjkgMjA4LjY4NzUgUTE2OS4wMzEyIDIwOC42ODc1IDE3Ni4wNjI1IDE5Ni41OTM4IFExODMuMjM0NCAxODQuNSAxODMuMjM0NCAxNjAuMTcxOSBRMTgzLjIzNDQgMTM1Ljk4NDQgMTc2LjA2MjUgMTIzLjg5MDYgUTE2OS4wMzEyIDExMS43OTY5IDE1OS4wNDY5IDExMS43OTY5IFpNMTU5LjA0NjkgOTkuMjgxMiBRMTc3LjQ2ODggOTkuMjgxMiAxODkuNDIxOSAxMTQuODkwNiBRMjAxLjM3NSAxMzAuNSAyMDEuMzc1IDE2MC4xNzE5IFEyMDEuMzc1IDE4OS45ODQ0IDE4OS40MjE5IDIwNS41OTM4IFExNzcuNDY4OCAyMjEuMjAzMSAxNTkuMDQ2OSAyMjEuMjAzMSBRMTM2LjI2NTYgMjIxLjIwMzEgMTI2LjQyMTkgMjA1LjU5MzggUTExNi41NzgxIDE4OS45ODQ0IDExNi41NzgxIDE2MC4xNzE5IFExMTYuNTc4MSAxMzAuNSAxMjYuNDIxOSAxMTQuODkwNiBRMTM2LjI2NTYgOTkuMjgxMiAxNTkuMDQ2OSA5OS4yODEyIFpNODAuNTc4MSAyMTkuMDkzOCBMODAuNTc4MSAxMTcuNzAzMSBMNjEuODc1IDEyMy40Njg4IEw2MS44NzUgMTA3LjE1NjIgTDgxLjU2MjUgMTAxLjY3MTkgTDEwMC44MjgxIDEwMS42NzE5IEwxMDAuODI4MSAyMTkuMDkzOCBMODAuNTc4MSAyMTkuMDkzOCBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaZKXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODkuMTU2MiAxMDEuNjcxOSBMMTA3LjAxNTYgMTAxLjY3MTkgTDEwNy4wMTU2IDE3OC43MzQ0IFExMDcuMDE1NiAxOTkuNjg3NSA5Ny44NzUgMjA5LjUzMTIgUTg4Ljg3NSAyMTkuMjM0NCA2OC43NjU2IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAyMDUuNzM0NCBMNjcuNSAyMDUuNzM0NCBRNzkuMzEyNSAyMDUuNzM0NCA4NC4yMzQ0IDE5OS44MjgxIFE4OS4xNTYyIDE5My45MjE5IDg5LjE1NjIgMTc4LjczNDQgTDg5LjE1NjIgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmUVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk0xMDcuMjk2OSAyMjEuMDYyNSBRMTA2LjczNDQgMjIxLjA2MjUgMTA1LjUzOTEgMjIxLjEzMjggUTEwNC4zNDM4IDIyMS4yMDMxIDEwMy42NDA2IDIyMS4yMDMxIFE4MS40MjE5IDIyMS4yMDMxIDcwLjUyMzQgMjA2LjA4NTkgUTU5LjYyNSAxOTAuOTY4OCA1OS42MjUgMTYwLjMxMjUgUTU5LjYyNSAxMjkuNTE1NiA3MC41OTM4IDExNC4zOTg0IFE4MS41NjI1IDk5LjI4MTIgMTAzLjc4MTIgOTkuMjgxMiBRMTI2LjE0MDYgOTkuMjgxMiAxMzcuMTA5NCAxMTQuMzk4NCBRMTQ4LjA3ODEgMTI5LjUxNTYgMTQ4LjA3ODEgMTYwLjMxMjUgUTE0OC4wNzgxIDE4My41MTU2IDE0Mi4wMzEyIDE5Ny42NDg0IFExMzUuOTg0NCAyMTEuNzgxMiAxMjMuNjA5NCAyMTcuNDA2MiBMMTQxLjMyODEgMjMyLjMxMjUgTDEyNy45Njg4IDI0MC4xODc1IEwxMDcuMjk2OSAyMjEuMDYyNSBaTTEyOS4zNzUgMTYwLjMxMjUgUTEyOS4zNzUgMTM0LjQzNzUgMTIzLjM5ODQgMTIzLjMyODEgUTExNy40MjE5IDExMi4yMTg4IDEwMy43ODEyIDExMi4yMTg4IFE5MC4yODEyIDExMi4yMTg4IDg0LjMwNDcgMTIzLjMyODEgUTc4LjMyODEgMTM0LjQzNzUgNzguMzI4MSAxNjAuMzEyNSBRNzguMzI4MSAxODYuMTg3NSA4NC4zMDQ3IDE5Ny4yOTY5IFE5MC4yODEyIDIwOC40MDYyIDEwMy43ODEyIDIwOC40MDYyIFExMTcuNDIxOSAyMDguNDA2MiAxMjMuMzk4NCAxOTcuMjk2OSBRMTI5LjM3NSAxODYuMTg3NSAxMjkuMzc1IDE2MC4zMTI1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmS1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTYxLjg3NSAxMDEuNjcxOSBMNzkuNzM0NCAxMDEuNjcxOSBMNzkuNzM0NCAxNTEuMzEyNSBMMTMwLjY0MDYgMTAxLjY3MTkgTDE1My43MDMxIDEwMS42NzE5IEw5Ni40Njg4IDE1Ni41MTU2IEwxNTguMzQzOCAyMTkuMjM0NCBMMTM0Ljg1OTQgMjE5LjIzNDQgTDc5LjczNDQgMTYyLjU2MjUgTDc5LjczNDQgMjE5LjIzNDQgTDYxLjg3NSAyMTkuMjM0NCBMNjEuODc1IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZo0FcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTExMC42NzE5IDExNS43MzQ0IEw5MS44MjgxIDE3NS43ODEyIEwxMjkuNTE1NiAxNzUuNzgxMiBMMTEwLjY3MTkgMTE1LjczNDQgWk05OS45ODQ0IDEwMS42NzE5IEwxMjEuNjQwNiAxMDEuNjcxOSBMMTYyLjE0MDYgMjE5LjIzNDQgTDE0My41NzgxIDIxOS4yMzQ0IEwxMzQuMDE1NiAxODguNTc4MSBMODcuNjA5NCAxODguNTc4MSBMNzguMDQ2OSAyMTkuMjM0NCBMNTkuNDg0NCAyMTkuMjM0NCBMOTkuOTg0NCAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaMyXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk04Ni4zNDM4IDIwMy4wNjI1IEwxNDUuOTY4OCAyMDMuMDYyNSBMMTQ1Ljk2ODggMjE5LjA5MzggTDYxLjg3NSAyMTkuMDkzOCBMNjEuODc1IDIwMy42MjUgUTY2LjY1NjIgMTk5LjI2NTYgNzUuNTE1NiAxOTEuMzkwNiBRMTIzLjg5MDYgMTQ4LjUgMTIzLjg5MDYgMTM1LjI4MTIgUTEyMy44OTA2IDEyNiAxMTYuNTc4MSAxMjAuMzA0NyBRMTA5LjI2NTYgMTE0LjYwOTQgOTcuMzEyNSAxMTQuNjA5NCBROTAgMTE0LjYwOTQgODEuNDIxOSAxMTcuMDcwMyBRNzIuODQzOCAxMTkuNTMxMiA2Mi43MTg4IDEyNC40NTMxIEw2Mi43MTg4IDEwNy4xNTYyIFE3My41NDY5IDEwMy4yMTg4IDgyLjg5ODQgMTAxLjI1IFE5Mi4yNSA5OS4yODEyIDEwMC4yNjU2IDk5LjI4MTIgUTEyMC42NTYyIDk5LjI4MTIgMTMyLjg5MDYgMTA4LjU2MjUgUTE0NS4xMjUgMTE3Ljg0MzggMTQ1LjEyNSAxMzMuMDMxMiBRMTQ1LjEyNSAxNTIuNTc4MSA5OC41NzgxIDE5Mi41MTU2IFE5MC43MDMxIDE5OS4yNjU2IDg2LjM0MzggMjAzLjA2MjUgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjM1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTIxLjc4MTIgMTU1LjUzMTIgUTEzNC43MTg4IDE1OC4wNjI1IDE0MS44MjAzIDE2NS43MjY2IFExNDguOTIxOSAxNzMuMzkwNiAxNDguOTIxOSAxODQuOTIxOSBRMTQ4LjkyMTkgMjAyLjM1OTQgMTM1LjU2MjUgMjExLjc4MTIgUTEyMi4yMDMxIDIyMS4yMDMxIDk3LjMxMjUgMjIxLjIwMzEgUTg5LjI5NjkgMjIxLjIwMzEgODAuNTA3OCAyMTkuNzI2NiBRNzEuNzE4OCAyMTguMjUgNjEuODc1IDIxNS40Mzc1IEw2MS44NzUgMTk4LjQyMTkgUTY5LjE4NzUgMjAyLjIxODggNzcuNTU0NyAyMDQuMDQ2OSBRODUuOTIxOSAyMDUuODc1IDk1LjM0MzggMjA1Ljg3NSBRMTEwLjY3MTkgMjA1Ljg3NSAxMTkuMTA5NCAyMDAuMzIwMyBRMTI3LjU0NjkgMTk0Ljc2NTYgMTI3LjU0NjkgMTg0LjkyMTkgUTEyNy41NDY5IDE3NC41MTU2IDExOS43NDIyIDE2OS4xNzE5IFExMTEuOTM3NSAxNjMuODI4MSA5Ni43NSAxNjMuODI4MSBMODQuNjU2MiAxNjMuODI4MSBMODQuNjU2MiAxNDguNjQwNiBMOTcuODc1IDE0OC42NDA2IFExMTEuMDkzOCAxNDguNjQwNiAxMTcuOTE0MSAxNDQuMjEwOSBRMTI0LjczNDQgMTM5Ljc4MTIgMTI0LjczNDQgMTMxLjM0MzggUTEyNC43MzQ0IDEyMy4xODc1IDExNy43MDMxIDExOC44OTg0IFExMTAuNjcxOSAxMTQuNjA5NCA5Ny4zMTI1IDExNC42MDk0IFE5MS42ODc1IDExNC42MDk0IDg0LjUxNTYgMTE1Ljg3NSBRNzcuMzQzOCAxMTcuMTQwNiA2NS45NTMxIDEyMC4zNzUgTDY1Ljk1MzEgMTA0LjIwMzEgUTc2LjIxODggMTAxLjgxMjUgODUuMjE4OCAxMDAuNTQ2OSBROTQuMjE4OCA5OS4yODEyIDEwMS45NTMxIDk5LjI4MTIgUTEyMi4yMDMxIDk5LjI4MTIgMTM0LjA4NTkgMTA3LjU3ODEgUTE0NS45Njg4IDExNS44NzUgMTQ1Ljk2ODggMTI5Ljc5NjkgUTE0NS45Njg4IDEzOS41IDEzOS42NDA2IDE0Ni4yNSBRMTMzLjMxMjUgMTUzIDEyMS43ODEyIDE1NS41MzEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZozRcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEyMC4wOTM4IDExOC42ODc1IEw3Ni42NDA2IDE3Ny42MDk0IEwxMjAuMDkzOCAxNzcuNjA5NCBMMTIwLjA5MzggMTE4LjY4NzUgWk0xMTcgMTAxLjY3MTkgTDE0MC4zNDM4IDEwMS42NzE5IEwxNDAuMzQzOCAxNzcuNjA5NCBMMTU5LjMyODEgMTc3LjYwOTQgTDE1OS4zMjgxIDE5Mi45Mzc1IEwxNDAuMzQzOCAxOTIuOTM3NSBMMTQwLjM0MzggMjE5LjA5MzggTDEyMC4wOTM4IDIxOS4wOTM4IEwxMjAuMDkzOCAxOTIuOTM3NSBMNjEuODc1IDE5Mi45Mzc1IEw2MS44NzUgMTc1LjkyMTkgTDExNyAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaM1XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02Ny41IDEwMS42NzE5IEwxMzkuMjE4OCAxMDEuNjcxOSBMMTM5LjIxODggMTE1LjAzMTIgTDg0LjIzNDQgMTE1LjAzMTIgTDg0LjIzNDQgMTQzLjcxODggUTg4LjE3MTkgMTQyLjQ1MzEgOTIuMjUgMTQxLjg5MDYgUTk2LjE4NzUgMTQxLjMyODEgMTAwLjEyNSAxNDEuMzI4MSBRMTIyLjc2NTYgMTQxLjMyODEgMTM1Ljk4NDQgMTUyLjE1NjIgUTE0OS4yMDMxIDE2Mi44NDM4IDE0OS4yMDMxIDE4MS4yNjU2IFExNDkuMjAzMSAyMDAuMjUgMTM1LjU2MjUgMjEwLjc5NjkgUTEyMi4wNjI1IDIyMS4yMDMxIDk3LjMxMjUgMjIxLjIwMzEgUTg4Ljg3NSAyMjEuMjAzMSA4MC4wMTU2IDIxOS45Mzc1IFE3MS4xNTYyIDIxOC42NzE5IDYxLjg3NSAyMTYuMTQwNiBMNjEuODc1IDIwMC4yNSBRNjkuODkwNiAyMDQuMDQ2OSA3OC42MDk0IDIwNi4wMTU2IFE4Ny4zMjgxIDIwNy44NDM4IDk3LjAzMTIgMjA3Ljg0MzggUTExMi42NDA2IDIwNy44NDM4IDEyMS43ODEyIDIwMC42NzE5IFExMzAuOTIxOSAxOTMuNSAxMzAuOTIxOSAxODEuMjY1NiBRMTMwLjkyMTkgMTY5LjAzMTIgMTIxLjc4MTIgMTYxLjg1OTQgUTExMi42NDA2IDE1NC42ODc1IDk3LjAzMTIgMTU0LjY4NzUgUTg5LjcxODggMTU0LjY4NzUgODIuNDA2MiAxNTYuMDkzOCBRNzUuMDkzOCAxNTcuNSA2Ny41IDE2MC40NTMxIEw2Ny41IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZozZcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTExMC4xMDk0IDE1My43MDMxIFE5Ny43MzQ0IDE1My43MDMxIDkwLjU2MjUgMTYxLjAxNTYgUTgzLjM5MDYgMTY4LjQ2ODggODMuMzkwNiAxODEuMjY1NiBRODMuMzkwNiAxOTMuOTIxOSA5MC41NjI1IDIwMS4yMzQ0IFE5Ny43MzQ0IDIwOC42ODc1IDExMC4xMDk0IDIwOC42ODc1IFExMjIuMzQzOCAyMDguNjg3NSAxMjkuNTE1NiAyMDEuMjM0NCBRMTM2LjY4NzUgMTkzLjkyMTkgMTM2LjY4NzUgMTgxLjI2NTYgUTEzNi42ODc1IDE2OC40Njg4IDEyOS41MTU2IDE2MS4wMTU2IFExMjIuMzQzOCAxNTMuNzAzMSAxMTAuMTA5NCAxNTMuNzAzMSBaTTE0Ni4zOTA2IDEwMy45MjE5IEwxNDYuMzkwNiAxMTguNDA2MiBRMTM5LjUgMTE1LjU5MzggMTMyLjQ2ODggMTE0LjE4NzUgUTEyNS40Mzc1IDExMi42NDA2IDExOC41NDY5IDExMi42NDA2IFExMDAuNTQ2OSAxMTIuNjQwNiA5MC45ODQ0IDEyMy4xODc1IFE4MS40MjE5IDEzMy44NzUgODAuMDE1NiAxNTUuMzkwNiBRODUuMzU5NCAxNDguNSA5My4zNzUgMTQ0Ljg0MzggUTEwMS41MzEyIDE0MS4xODc1IDExMS4wOTM4IDE0MS4xODc1IFExMzEuNDg0NCAxNDEuMTg3NSAxNDMuMjk2OSAxNTEuODc1IFExNTUuMTA5NCAxNjIuNzAzMSAxNTUuMTA5NCAxODEuMjY1NiBRMTU1LjEwOTQgMTk5LjEyNSAxNDIuNzM0NCAyMTAuMjM0NCBRMTMwLjUgMjIxLjIwMzEgMTEwLjEwOTQgMjIxLjIwMzEgUTg2LjYyNSAyMjEuMjAzMSA3NC4yNSAyMDUuNTkzOCBRNjEuODc1IDE4OS45ODQ0IDYxLjg3NSAxNjAuMTcxOSBRNjEuODc1IDEzMi4zMjgxIDc3LjA2MjUgMTE1Ljg3NSBROTIuMjUgOTkuMjgxMiAxMTcuODQzOCA5OS4yODEyIFExMjQuNzM0NCA5OS4yODEyIDEzMS43NjU2IDEwMC40MDYyIFExMzguNzk2OSAxMDEuNjcxOSAxNDYuMzkwNiAxMDMuOTIxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaM3XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02MS44NzUgMTAxLjY3MTkgTDE0OC42NDA2IDEwMS42NzE5IEwxNDguNjQwNiAxMDguNDIxOSBMOTkuNzAzMSAyMTkuMDkzOCBMODAuNTc4MSAyMTkuMDkzOCBMMTI2LjcwMzEgMTE1LjAzMTIgTDYxLjg3NSAxMTUuMDMxMiBMNjEuODc1IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZozhcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEwOC4yODEyIDE2My4xMjUgUTk1LjIwMzEgMTYzLjEyNSA4Ny43NSAxNjkuMzEyNSBRODAuMjk2OSAxNzUuMzU5NCA4MC4yOTY5IDE4NS45MDYyIFE4MC4yOTY5IDE5Ni41OTM4IDg3Ljc1IDIwMi42NDA2IFE5NS4yMDMxIDIwOC42ODc1IDEwOC4yODEyIDIwOC42ODc1IFExMjEuMjE4OCAyMDguNjg3NSAxMjguODEyNSAyMDIuNSBRMTM2LjI2NTYgMTk2LjQ1MzEgMTM2LjI2NTYgMTg1LjkwNjIgUTEzNi4yNjU2IDE3NS4zNTk0IDEyOC44MTI1IDE2OS4zMTI1IFExMjEuMzU5NCAxNjMuMTI1IDEwOC4yODEyIDE2My4xMjUgWk05MCAxNTYuMjM0NCBRNzguMTg3NSAxNTMuNzAzMSA3MS43MTg4IDE0Ni44MTI1IFE2NS4xMDk0IDEzOS43ODEyIDY1LjEwOTQgMTI5LjY1NjIgUTY1LjEwOTQgMTE1LjU5MzggNzYuNjQwNiAxMDcuNDM3NSBRODguMTcxOSA5OS4yODEyIDEwOC4yODEyIDk5LjI4MTIgUTEyOC4zOTA2IDk5LjI4MTIgMTM5LjkyMTkgMTA3LjQzNzUgUTE1MS4zMTI1IDExNS41OTM4IDE1MS4zMTI1IDEyOS42NTYyIFExNTEuMzEyNSAxNDAuMDYyNSAxNDQuODQzOCAxNDYuODEyNSBRMTM4LjIzNDQgMTUzLjcwMzEgMTI2LjU2MjUgMTU2LjIzNDQgUTEzOS4yMTg4IDE1OC43NjU2IDE0Ny4wOTM4IDE2Ni45MjE5IFExNTQuNTQ2OSAxNzQuNjU2MiAxNTQuNTQ2OSAxODUuOTA2MiBRMTU0LjU0NjkgMjAyLjkyMTkgMTQyLjU5MzggMjEyLjA2MjUgUTEzMC41IDIyMS4yMDMxIDEwOC4yODEyIDIyMS4yMDMxIFE4NS45MjE5IDIyMS4yMDMxIDczLjk2ODggMjEyLjA2MjUgUTYxLjg3NSAyMDIuOTIxOSA2MS44NzUgMTg1LjkwNjIgUTYxLjg3NSAxNzQuOTM3NSA2OS4zMjgxIDE2Ni45MjE5IFE3Ni45MjE5IDE1OS4wNDY5IDkwIDE1Ni4yMzQ0IFpNODMuMjUgMTMxLjIwMzEgUTgzLjI1IDE0MC4wNjI1IDg5Ljg1OTQgMTQ1LjQwNjIgUTk2LjMyODEgMTUwLjYwOTQgMTA4LjI4MTIgMTUwLjYwOTQgUTExOS42NzE5IDE1MC42MDk0IDEyNi41NjI1IDE0NS40MDYyIFExMzMuMzEyNSAxNDAuMzQzOCAxMzMuMzEyNSAxMzEuMjAzMSBRMTMzLjMxMjUgMTIyLjM0MzggMTI2LjU2MjUgMTE3IFExMTkuOTUzMSAxMTEuNzk2OSAxMDguMjgxMiAxMTEuNzk2OSBROTYuNjA5NCAxMTEuNzk2OSA4OS44NTk0IDExNyBRODMuMjUgMTIyLjA2MjUgODMuMjUgMTMxLjIwMzEgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjOVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNzAuNTkzOCAyMTYuNTYyNSBMNzAuNTkzOCAyMDIuMDc4MSBRNzcuNDg0NCAyMDQuODkwNiA4NC41MTU2IDIwNi40Mzc1IFE5MS41NDY5IDIwNy44NDM4IDk4LjI5NjkgMjA3Ljg0MzggUTExNi40Mzc1IDIwNy44NDM4IDEyNiAxOTcuMjk2OSBRMTM1LjQyMTkgMTg2Ljc1IDEzNi44MjgxIDE2NS4wOTM4IFExMzEuOTA2MiAxNzEuNzAzMSAxMjMuNDY4OCAxNzUuNSBRMTE1LjQ1MzEgMTc5LjE1NjIgMTA1Ljc1IDE3OS4xNTYyIFE4NS41IDE3OS4xNTYyIDczLjY4NzUgMTY4LjQ2ODggUTYxLjg3NSAxNTcuNzgxMiA2MS44NzUgMTM5LjIxODggUTYxLjg3NSAxMjEuMDc4MSA3NC4xMDk0IDExMC4yNSBRODYuNDg0NCA5OS4yODEyIDEwNi44NzUgOTkuMjgxMiBRMTMwLjM1OTQgOTkuMjgxMiAxNDIuNTkzOCAxMTQuODkwNiBRMTU0Ljk2ODggMTMwLjUgMTU0Ljk2ODggMTYwLjMxMjUgUTE1NC45Njg4IDE4OC4xNTYyIDEzOS45MjE5IDIwNC42MDk0IFExMjQuNzM0NCAyMjEuMjAzMSA5OS4xNDA2IDIyMS4yMDMxIFE5Mi4yNSAyMjEuMjAzMSA4NS4yMTg4IDIyMC4wNzgxIFE3OC4xODc1IDIxOC44MTI1IDcwLjU5MzggMjE2LjU2MjUgWk0xMDYuODc1IDE2Ni43ODEyIFExMTkuMjUgMTY2Ljc4MTIgMTI2LjQyMTkgMTU5LjQ2ODggUTEzMy41OTM4IDE1Mi4xNTYyIDEzMy41OTM4IDEzOS4yMTg4IFExMzMuNTkzOCAxMjYuNTYyNSAxMjYuNDIxOSAxMTkuMjUgUTExOS4yNSAxMTEuNzk2OSAxMDYuODc1IDExMS43OTY5IFE5NC45MjE5IDExMS43OTY5IDg3LjQ2ODggMTE5LjI1IFE4MC4xNTYyIDEyNi41NjI1IDgwLjE1NjIgMTM5LjIxODggUTgwLjE1NjIgMTUyLjE1NjIgODcuNDY4OCAxNTkuNDY4OCBROTQuNjQwNiAxNjYuNzgxMiAxMDYuODc1IDE2Ni43ODEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZozEwXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xNTkuMDQ2OSAxMTEuNzk2OSBRMTQ5LjA2MjUgMTExLjc5NjkgMTQyLjAzMTIgMTIzLjg5MDYgUTEzNC44NTk0IDEzNS45ODQ0IDEzNC44NTk0IDE2MC4xNzE5IFExMzQuODU5NCAxODQuNSAxNDIuMDMxMiAxOTYuNTkzOCBRMTQ5LjA2MjUgMjA4LjY4NzUgMTU5LjA0NjkgMjA4LjY4NzUgUTE2OS4wMzEyIDIwOC42ODc1IDE3Ni4wNjI1IDE5Ni41OTM4IFExODMuMjM0NCAxODQuNSAxODMuMjM0NCAxNjAuMTcxOSBRMTgzLjIzNDQgMTM1Ljk4NDQgMTc2LjA2MjUgMTIzLjg5MDYgUTE2OS4wMzEyIDExMS43OTY5IDE1OS4wNDY5IDExMS43OTY5IFpNMTU5LjA0NjkgOTkuMjgxMiBRMTc3LjQ2ODggOTkuMjgxMiAxODkuNDIxOSAxMTQuODkwNiBRMjAxLjM3NSAxMzAuNSAyMDEuMzc1IDE2MC4xNzE5IFEyMDEuMzc1IDE4OS45ODQ0IDE4OS40MjE5IDIwNS41OTM4IFExNzcuNDY4OCAyMjEuMjAzMSAxNTkuMDQ2OSAyMjEuMjAzMSBRMTM2LjI2NTYgMjIxLjIwMzEgMTI2LjQyMTkgMjA1LjU5MzggUTExNi41NzgxIDE4OS45ODQ0IDExNi41NzgxIDE2MC4xNzE5IFExMTYuNTc4MSAxMzAuNSAxMjYuNDIxOSAxMTQuODkwNiBRMTM2LjI2NTYgOTkuMjgxMiAxNTkuMDQ2OSA5OS4yODEyIFpNODAuNTc4MSAyMTkuMDkzOCBMODAuNTc4MSAxMTcuNzAzMSBMNjEuODc1IDEyMy40Njg4IEw2MS44NzUgMTA3LjE1NjIgTDgxLjU2MjUgMTAxLjY3MTkgTDEwMC44MjgxIDEwMS42NzE5IEwxMDAuODI4MSAyMTkuMDkzOCBMODAuNTc4MSAyMTkuMDkzOCBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaNKXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk04OS4xNTYyIDEwMS42NzE5IEwxMDcuMDE1NiAxMDEuNjcxOSBMMTA3LjAxNTYgMTc4LjczNDQgUTEwNy4wMTU2IDE5OS42ODc1IDk3Ljg3NSAyMDkuNTMxMiBRODguODc1IDIxOS4yMzQ0IDY4Ljc2NTYgMjE5LjIzNDQgTDYxLjg3NSAyMTkuMjM0NCBMNjEuODc1IDIwNS43MzQ0IEw2Ny41IDIwNS43MzQ0IFE3OS4zMTI1IDIwNS43MzQ0IDg0LjIzNDQgMTk5LjgyODEgUTg5LjE1NjIgMTkzLjkyMTkgODkuMTU2MiAxNzguNzM0NCBMODkuMTU2MiAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaNRXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMDcuMjk2OSAyMjEuMDYyNSBRMTA2LjczNDQgMjIxLjA2MjUgMTA1LjUzOTEgMjIxLjEzMjggUTEwNC4zNDM4IDIyMS4yMDMxIDEwMy42NDA2IDIyMS4yMDMxIFE4MS40MjE5IDIyMS4yMDMxIDcwLjUyMzQgMjA2LjA4NTkgUTU5LjYyNSAxOTAuOTY4OCA1OS42MjUgMTYwLjMxMjUgUTU5LjYyNSAxMjkuNTE1NiA3MC41OTM4IDExNC4zOTg0IFE4MS41NjI1IDk5LjI4MTIgMTAzLjc4MTIgOTkuMjgxMiBRMTI2LjE0MDYgOTkuMjgxMiAxMzcuMTA5NCAxMTQuMzk4NCBRMTQ4LjA3ODEgMTI5LjUxNTYgMTQ4LjA3ODEgMTYwLjMxMjUgUTE0OC4wNzgxIDE4My41MTU2IDE0Mi4wMzEyIDE5Ny42NDg0IFExMzUuOTg0NCAyMTEuNzgxMiAxMjMuNjA5NCAyMTcuNDA2MiBMMTQxLjMyODEgMjMyLjMxMjUgTDEyNy45Njg4IDI0MC4xODc1IEwxMDcuMjk2OSAyMjEuMDYyNSBaTTEyOS4zNzUgMTYwLjMxMjUgUTEyOS4zNzUgMTM0LjQzNzUgMTIzLjM5ODQgMTIzLjMyODEgUTExNy40MjE5IDExMi4yMTg4IDEwMy43ODEyIDExMi4yMTg4IFE5MC4yODEyIDExMi4yMTg4IDg0LjMwNDcgMTIzLjMyODEgUTc4LjMyODEgMTM0LjQzNzUgNzguMzI4MSAxNjAuMzEyNSBRNzguMzI4MSAxODYuMTg3NSA4NC4zMDQ3IDE5Ny4yOTY5IFE5MC4yODEyIDIwOC40MDYyIDEwMy43ODEyIDIwOC40MDYyIFExMTcuNDIxOSAyMDguNDA2MiAxMjMuMzk4NCAxOTcuMjk2OSBRMTI5LjM3NSAxODYuMTg3NSAxMjkuMzc1IDE2MC4zMTI1IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZo0tcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTYxLjg3NSAxMDEuNjcxOSBMNzkuNzM0NCAxMDEuNjcxOSBMNzkuNzM0NCAxNTEuMzEyNSBMMTMwLjY0MDYgMTAxLjY3MTkgTDE1My43MDMxIDEwMS42NzE5IEw5Ni40Njg4IDE1Ni41MTU2IEwxNTguMzQzOCAyMTkuMjM0NCBMMTM0Ljg1OTQgMjE5LjIzNDQgTDc5LjczNDQgMTYyLjU2MjUgTDc5LjczNDQgMjE5LjIzNDQgTDYxLjg3NSAyMTkuMjM0NCBMNjEuODc1IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcblxcbiAgICA8dGFibGUgc3R5bGU9XFxcImJvcmRlci13aWR0aDoxcHhcXFwiPlxcbiAgICAgICAgPHRyIHdpZHRoPVxcXCIxMDAlXFxcIiBoZWlnaHQ9XFxcIjEwcHhcXFwiIHN0eWxlPVxcXCJ2aXNpYmlsaXR5OnZpc2libGVcXFwifT5cXG4gICAgICAgICAgICA8dGQgd2lkdGg9XFxcIjUwcHhcXFwiPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsdWVcXFwiPiZibG9jazs8L3NwYW4+PC9wbGF5aW5nLWNhcmQ8L3RkPlxcbiAgICAgICAgPC90cj5cXG4gICAgICAgIDx0ciB3aWR0aD1cXFwiMTAwJVxcXCI+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlcztBPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlczsyPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlczszPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlczs0PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlczs1PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlczs2PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlczs3PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlczs4PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlczs5PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlczsxMDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7Sjwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7UTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7Szwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgPC90cj5cXG4gICAgICAgIDx0cj5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzO0E8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzI8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzM8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzQ8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzU8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzY8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzc8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzg8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzk8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzEwPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0cztKPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0cztRPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0cztLPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICA8L3RyPlxcbiAgICAgICAgPHRyPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtcztBPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zOzI8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7Mzwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczs0PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zOzU8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7Njwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczs3PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zOzg8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7OTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczsxMDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtcztKPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zO1E8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7Szwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgPC90cj5cXG4gICAgICAgIDx0cj5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHVicztBPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7Mjwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzM8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczs0PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7NTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzY8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczs3PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7ODwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzk8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczsxMDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzO0o8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHVicztRPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7Szwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgPC90cj5cXG4gICAgPC90YWJsZT5cXG48L2Rpdj5cXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yYXctbG9hZGVyIS4vdmlld3MvcGFydGlhbHMvZnJlc2hkZWNrLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDI0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8cD5pbmRleDwvcD5cXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yYXctbG9hZGVyIS4vdmlld3MvcGFydGlhbHMvaW5kZXguaHRtbFxuLy8gbW9kdWxlIGlkID0gMjVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxmb3JtXFxuICAgIGlkPVxcXCJtZXNzYWdlX2Zvcm1cXFwiXFxuICAgIG9uc3VibWl0PVxcXCJcXG4gICAgIHZhciBndW4gPSBHdW4obG9jYXRpb24ub3JpZ2luICsgJy9ndW4nKTtcXG4gICAgIG9wZW5wZ3AuY29uZmlnLmFlYWRfcHJvdGVjdCA9IHRydWVcXG4gICAgIG9wZW5wZ3AuaW5pdFdvcmtlcih7IHBhdGg6Jy9qcy9vcGVucGdwLndvcmtlci5qcycgfSlcXG4gICAgIGlmICghbWVzc2FnZV90eHQudmFsdWUpIHtcXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXFxuICAgICB9XFxuICAgICB3aW5kb3cuaGFuZGxlUG9zdChtZXNzYWdlX3R4dC52YWx1ZSkob3BlbnBncCkod2luZG93LmxvY2FsU3RvcmFnZSkoJ3JveWFsZScpLnRoZW4ocmVzdWx0ID0+IHtpZiAocmVzdWx0KSB7Y29uc29sZS5sb2cocmVzdWx0KX19KS5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcihlcnIpKTtkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVzc2FnZV90eHQnKS52YWx1ZSA9ICcnOyByZXR1cm4gZmFsc2VcXFwiXFxuICAgIG1ldGhvZD1cXFwicG9zdFxcXCJcXG4gICAgYWN0aW9uPVxcXCIvbWVzc2FnZVxcXCI+XFxuICAgIDxpbnB1dCBpZD1cXFwibWVzc2FnZV9mb3JtX2lucHV0XFxcIlxcbiAgICAgICAgdHlwZT1cXFwic3VibWl0XFxcIlxcbiAgICAgICAgdmFsdWU9XFxcInBvc3QgbWVzc2FnZVxcXCJcXG4gICAgICAgIGZvcm09XFxcIm1lc3NhZ2VfZm9ybVxcXCJcXG4gICAgICAgID5cXG48L2Zvcm0+XFxuPHRleHRhcmVhXFxuICAgIGlkPVxcXCJtZXNzYWdlX3R4dFxcXCJcXG4gICAgbmFtZT1cXFwibWVzc2FnZV90eHRcXFwiXFxuICAgIGZvcm09XFxcIm1lc3NhZ2VfZm9ybVxcXCJcXG4gICAgcm93cz01MVxcbiAgICBjb2xzPTcwXFxuICAgIHBsYWNlaG9sZGVyPVxcXCJwYXN0ZSBwbGFpbnRleHQgbWVzc2FnZSwgcHVibGljIGtleSwgb3IgcHJpdmF0ZSBrZXlcXFwiXFxuICAgIHN0eWxlPVxcXCJmb250LWZhbWlseTpNZW5sbyxDb25zb2xhcyxNb25hY28sTHVjaWRhIENvbnNvbGUsTGliZXJhdGlvbiBNb25vLERlamFWdSBTYW5zIE1vbm8sQml0c3RyZWFtIFZlcmEgU2FucyBNb25vLENvdXJpZXIgTmV3LCBtb25vc3BhY2U7XFxcIlxcbiAgICA+XFxuPC90ZXh0YXJlYT5cXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yYXctbG9hZGVyIS4vdmlld3MvcGFydGlhbHMvbWVzc2FnZV9mb3JtLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDI2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8c3BhbiBjbGFzcz1cXFwicm9hZG1hcFxcXCI+XFxuICAgIDxkZXRhaWxzPlxcbiAgICA8c3VtbWFyeT5yb2FkIG1hcDwvc3VtbWFyeT5cXG4gICAgPHVsPlxcbiAgICAgICAgPGxpPjxkZWw+PGEgaHJlZj1cXFwiaHR0cHM6Ly9naXRodWIuY29tL2NvbGVhbGJvbi9ob3RsaXBzL2NvbW1pdC8zYjcwOTgxY2JlNGUxMWUxNDAwYWU4ZTk0OGEwNmUzNTgyZDljMmQyXFxcIj5JbnN0YWxsIG5vZGUva29hL3dlYnBhY2s8L2E+PC9kZWw+PC9saT5cXG4gICAgICAgIDxsaT48ZGVsPjxhIGhyZWY9XFxcImh0dHBzOi8vZ2l0aHViLmNvbS9jb2xlYWxib24vaG90bGlwcy9pc3N1ZXMvMlxcXCI+SW5zdGFsbCBndW5kYjwvYT48L2RlbD48L2xpPlxcbiAgICAgICAgPGxpPjxkZWw+bWFrZSBhIDxhIGhyZWY9XFxcIiMvZGVja1xcXCI+ZGVjazwvYT4gb2YgY2FyZHM8L2RlbD48L2xpPlxcbiAgICAgICAgPGxpPjxkZWw+QWxpY2UgYW5kIEJvYiA8YSBocmVmPVxcXCIjL21lc3NhZ2VcXFwiPmlkZW50aWZ5PC9hPjwvZGVsPjwvbGk+XFxuICAgICAgICA8bGk+PGRlbD5BbGljZSBhbmQgQm9iIDxhIGhyZWY9XFxcIiMvY29ubmVjdFxcXCI+Y29ubmVjdDwvYT48L2RlbD48L2xpPlxcbiAgICAgICAgPGxpPjxkZWw+QWxpY2UgYW5kIEJvYiA8YSBocmVmPVxcXCJodHRwczovL2dpdGh1Yi5jb20vY29sZWFsYm9uL3N0cmVhbWxpbmVyXFxcIj5leGNoYW5nZSBrZXlzPC9hPjwvZGVsPzwvbGk+XFxuICAgICAgICA8bGk+QWxpY2UgYW5kIEJvYiBhZ3JlZSBvbiBhIGNlcnRhaW4gXFxcIjxhIGhyZWY9XFxcIiMvZGVja1xcXCI+ZGVjazwvYT5cXFwiIG9mIGNhcmRzLiBJbiBwcmFjdGljZSwgdGhpcyBtZWFucyB0aGV5IGFncmVlIG9uIGEgc2V0IG9mIG51bWJlcnMgb3Igb3RoZXIgZGF0YSBzdWNoIHRoYXQgZWFjaCBlbGVtZW50IG9mIHRoZSBzZXQgcmVwcmVzZW50cyBhIGNhcmQuPC9saT5cXG4gICAgICAgIDxsaT5BbGljZSBwaWNrcyBhbiBlbmNyeXB0aW9uIGtleSBBIGFuZCB1c2VzIHRoaXMgdG8gZW5jcnlwdCBlYWNoIGNhcmQgb2YgdGhlIGRlY2suPC9saT5cXG4gICAgICAgIDxsaT5BbGljZSA8YSBocmVmPVxcXCJodHRwczovL2Jvc3Qub2Nrcy5vcmcvbWlrZS9zaHVmZmxlL1xcXCI+c2h1ZmZsZXM8L2E+IHRoZSBjYXJkcy48L2xpPlxcbiAgICAgICAgPGxpPkFsaWNlIHBhc3NlcyB0aGUgZW5jcnlwdGVkIGFuZCBzaHVmZmxlZCBkZWNrIHRvIEJvYi4gV2l0aCB0aGUgZW5jcnlwdGlvbiBpbiBwbGFjZSwgQm9iIGNhbm5vdCBrbm93IHdoaWNoIGNhcmQgaXMgd2hpY2guPC9saT5cXG4gICAgICAgIDxsaT5Cb2Igc2h1ZmZsZXMgdGhlIGRlY2suPC9saT5cXG4gICAgICAgIDxsaT5Cb2IgcGFzc2VzIHRoZSBkb3VibGUgZW5jcnlwdGVkIGFuZCBzaHVmZmxlZCBkZWNrIGJhY2sgdG8gQWxpY2UuPC9saT5cXG4gICAgICAgIDxsaT5BbGljZSBkZWNyeXB0cyBlYWNoIGNhcmQgdXNpbmcgaGVyIGtleSBBLiBUaGlzIHN0aWxsIGxlYXZlcyBCb2IncyBlbmNyeXB0aW9uIGluIHBsYWNlIHRob3VnaCBzbyBzaGUgY2Fubm90IGtub3cgd2hpY2ggY2FyZCBpcyB3aGljaC48L2xpPlxcbiAgICAgICAgPGxpPkFsaWNlIHBpY2tzIG9uZSBlbmNyeXB0aW9uIGtleSBmb3IgZWFjaCBjYXJkIChBMSwgQTIsIGV0Yy4pIGFuZCBlbmNyeXB0cyB0aGVtIGluZGl2aWR1YWxseS48L2xpPlxcbiAgICAgICAgPGxpPkFsaWNlIHBhc3NlcyB0aGUgZGVjayB0byBCb2IuPC9saT5cXG4gICAgICAgIDxsaT5Cb2IgZGVjcnlwdHMgZWFjaCBjYXJkIHVzaW5nIGhpcyBrZXkgQi4gVGhpcyBzdGlsbCBsZWF2ZXMgQWxpY2UncyBpbmRpdmlkdWFsIGVuY3J5cHRpb24gaW4gcGxhY2UgdGhvdWdoIHNvIGhlIGNhbm5vdCBrbm93IHdoaWNoIGNhcmQgaXMgd2hpY2guPC9saT5cXG4gICAgICAgIDxsaT5Cb2IgcGlja3Mgb25lIGVuY3J5cHRpb24ga2V5IGZvciBlYWNoIGNhcmQgKEIxLCBCMiwgZXRjLikgYW5kIGVuY3J5cHRzIHRoZW0gaW5kaXZpZHVhbGx5LjwvbGk+XFxuICAgICAgICA8bGk+Qm9iIHBhc3NlcyB0aGUgZGVjayBiYWNrIHRvIEFsaWNlLjwvbGk+XFxuICAgICAgICA8bGk+QWxpY2UgcHVibGlzaGVzIHRoZSBkZWNrIGZvciBldmVyeW9uZSBwbGF5aW5nIChpbiB0aGlzIGNhc2Ugb25seSBBbGljZSBhbmQgQm9iLCBzZWUgYmVsb3cgb24gZXhwYW5zaW9uIHRob3VnaCkuPC9saT5cXG4gICAgPC91bD5cXG48L2RldGFpbHM+XFxuPC9zcGFuPlxcblwiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3Jhdy1sb2FkZXIhLi92aWV3cy9wYXJ0aWFscy9yb2FkbWFwLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDI3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=