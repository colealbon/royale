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
/******/ 	return __webpack_require__(__webpack_require__.s = 22);
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

var _determineKeyType = __webpack_require__(5);

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
exports.default = notEmpty;

var _notUndefined = __webpack_require__(26);

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
exports.decryptPGPMessage = decryptPGPMessage;

var _getFromStorage = __webpack_require__(2);

var _decryptPGPMessageWithKey = __webpack_require__(4);

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
/* 4 */
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
/* 5 */
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
/* 6 */
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.encryptCleartextMulti = encryptCleartextMulti;

var _getFromStorage = __webpack_require__(2);

var _determineContentType = __webpack_require__(0);

var _encryptClearText = __webpack_require__(6);

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
/* 8 */
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.savePGPPubkey = savePGPPubkey;

var _getFromStorage = __webpack_require__(2);

var _determineContentType = __webpack_require__(0);

var _notEmpty = __webpack_require__(1);

var _notEmpty2 = _interopRequireDefault(_notEmpty);

var _notCleartext = __webpack_require__(10);

var _notCleartext2 = _interopRequireDefault(_notCleartext);

var _notPGPPrivkey = __webpack_require__(25);

var _notPGPPrivkey2 = _interopRequireDefault(_notPGPPrivkey);

var _notPGPMessage = __webpack_require__(24);

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
                    return (0, _notPGPMessage2.default)(PGPkeyArmor)(openpgp
                    // fixme? throws Cannot read property \'users\' of undefined instead of "not PGPMessage content"
                    );
                }).then(function () {
                    return (0, _getFromStorage.getFromStorage)(localStorage)(PGPkey.keys[0].users[0].userId.userid).then(function (existingKey) {
                        return !existingKey ? Promise.resolve('none') : (0, _determineContentType.determineContentType)(existingKey)(openpgp);
                    }).then(function (existingKeyType) {
                        if (existingKeyType === 'PGPPrivkey') {
                            resolve('pubkey ignored X- attempted overwrite privkey');
                        } else {
                            localStorage.setItem(PGPkey.keys[0].users[0].userId.userid, PGPkeyArmor);
                            resolve('public pgp key saved <- ' + PGPkey.keys[0].users[0].userId.userid);
                        }
                    });
                }).catch(function (err) {
                    return reject(err);
                });
            });
        };
    };
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = notCleartext;

var _notEmpty = __webpack_require__(1);

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
/* 11 */
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(20), __webpack_require__(21)(module)))

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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// import {handlePGPPubkey} from '../../src/lib/util.js';
// import {handlePGPPrivkey} from '../../src/lib/util.js';
// import {handlePGPMessage} from '../../src/lib/util.js';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.handlePost = handlePost;

var _encryptCleartextMulti = __webpack_require__(7);

var _decryptPGPMessage = __webpack_require__(3);

var _determineContentType = __webpack_require__(0);

var _savePGPPubkey = __webpack_require__(9);

var _savePGPPrivkey = __webpack_require__(8);

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
                                return (0, _savePGPPrivkey.savePGPPrivkey)(content)(openpgp)(localStorage
                                //return broadcastMessage(content)(openpgp)(localStorage)
                                ).then(function (result) {
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

var contactPartial = __webpack_require__(27);

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

var freshDeckPartial = __webpack_require__(28);

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

var indexPartial = __webpack_require__(29);

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

var clientPubkeyFormPartial = __webpack_require__(30);

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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var roadmapPartial = __webpack_require__(31);

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
/* 19 */
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
/* 20 */
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
/* 21 */
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
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//import 'webcomponents.js/webcomponents.js';
//uncomment line above to double app size and support ios.

var _handlePost = __webpack_require__(13);

var _determineContentType = __webpack_require__(0);

var _determineKeyType = __webpack_require__(5);

var _encryptCleartextMulti = __webpack_require__(7);

var _encryptClearText = __webpack_require__(6);

var _decryptPGPMessage = __webpack_require__(3);

var _savePGPPubkey = __webpack_require__(9);

var _savePGPPrivkey = __webpack_require__(8);

var _getFromStorage = __webpack_require__(2);

var _decryptPGPMessageWithKey = __webpack_require__(4);

var _rebelRouter = __webpack_require__(12);

var _gun = __webpack_require__(11);

var _index = __webpack_require__(16);

var _roadmap = __webpack_require__(18);

var _contact = __webpack_require__(14);

var _message = __webpack_require__(17);

var _deck = __webpack_require__(15);

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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = notPGPKey;

var _notEmpty = __webpack_require__(1);

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
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = notPGPMessage;

var _notEmpty = __webpack_require__(1);

var _notEmpty2 = _interopRequireDefault(_notEmpty);

var _notCleartext = __webpack_require__(10);

var _notCleartext2 = _interopRequireDefault(_notCleartext);

var _notPGPKey = __webpack_require__(23);

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
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = notPGPPubkey;

var _notEmpty = __webpack_require__(1);

var _notEmpty2 = _interopRequireDefault(_notEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function notPGPPubkey(content) {
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
/* 26 */
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
/* 27 */
/***/ (function(module, exports) {

module.exports = "<span class=\"contact\">\n    Cole Albon<br>\n    <a href=\"tel:+14156721648\">(415) 672-1648</a><br>\n    <a href=\"mailto:cole.albon@gmail.com\">cole.albon@gmail.com</a><br>\n    <a href=\"https://github.com/colealbon\">https://github.com/colealbon</a><br>\n    <a href=\"https://www.linkedin.com/in/cole-albon-5934634\">\n        <span id=\"linkedinaddress\" class=\"linkedinaddress\">https://www.linkedin.com/in/cole-albon-5934634</span>\n    </a><br>\n</span>\n"

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = "    <div id=\"deck\" class=\"deck\">\n    <template id=\"█\"><svg viewBox=\"24 62 247 343\"><path d=\"M61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM70.3125 362.25 L70.3125 110.1094 L224.2969 110.1094 L224.2969 362.25 L70.3125 362.25 Z\"/></svg></template>\n    <template id=\"♠A\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.6719 115.7344 L91.8281 175.7812 L129.5156 175.7812 L110.6719 115.7344 ZM99.9844 101.6719 L121.6406 101.6719 L162.1406 219.2344 L143.5781 219.2344 L134.0156 188.5781 L87.6094 188.5781 L78.0469 219.2344 L59.4844 219.2344 L99.9844 101.6719 Z\"/></svg></template>\n    <template id=\"♠2\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM86.3438 203.0625 L145.9688 203.0625 L145.9688 219.0938 L61.875 219.0938 L61.875 203.625 Q66.6562 199.2656 75.5156 191.3906 Q123.8906 148.5 123.8906 135.2812 Q123.8906 126 116.5781 120.3047 Q109.2656 114.6094 97.3125 114.6094 Q90 114.6094 81.4219 117.0703 Q72.8438 119.5312 62.7188 124.4531 L62.7188 107.1562 Q73.5469 103.2188 82.8984 101.25 Q92.25 99.2812 100.2656 99.2812 Q120.6562 99.2812 132.8906 108.5625 Q145.125 117.8438 145.125 133.0312 Q145.125 152.5781 98.5781 192.5156 Q90.7031 199.2656 86.3438 203.0625 Z\"/></svg></template>\n    <template id=\"♠3\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM121.7812 155.5312 Q134.7188 158.0625 141.8203 165.7266 Q148.9219 173.3906 148.9219 184.9219 Q148.9219 202.3594 135.5625 211.7812 Q122.2031 221.2031 97.3125 221.2031 Q89.2969 221.2031 80.5078 219.7266 Q71.7188 218.25 61.875 215.4375 L61.875 198.4219 Q69.1875 202.2188 77.5547 204.0469 Q85.9219 205.875 95.3438 205.875 Q110.6719 205.875 119.1094 200.3203 Q127.5469 194.7656 127.5469 184.9219 Q127.5469 174.5156 119.7422 169.1719 Q111.9375 163.8281 96.75 163.8281 L84.6562 163.8281 L84.6562 148.6406 L97.875 148.6406 Q111.0938 148.6406 117.9141 144.2109 Q124.7344 139.7812 124.7344 131.3438 Q124.7344 123.1875 117.7031 118.8984 Q110.6719 114.6094 97.3125 114.6094 Q91.6875 114.6094 84.5156 115.875 Q77.3438 117.1406 65.9531 120.375 L65.9531 104.2031 Q76.2188 101.8125 85.2188 100.5469 Q94.2188 99.2812 101.9531 99.2812 Q122.2031 99.2812 134.0859 107.5781 Q145.9688 115.875 145.9688 129.7969 Q145.9688 139.5 139.6406 146.25 Q133.3125 153 121.7812 155.5312 Z\"/></svg></template>\n    <template id=\"♠4\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM120.0938 118.6875 L76.6406 177.6094 L120.0938 177.6094 L120.0938 118.6875 ZM117 101.6719 L140.3438 101.6719 L140.3438 177.6094 L159.3281 177.6094 L159.3281 192.9375 L140.3438 192.9375 L140.3438 219.0938 L120.0938 219.0938 L120.0938 192.9375 L61.875 192.9375 L61.875 175.9219 L117 101.6719 Z\"/></svg></template>\n    <template id=\"♠5\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM67.5 101.6719 L139.2188 101.6719 L139.2188 115.0312 L84.2344 115.0312 L84.2344 143.7188 Q88.1719 142.4531 92.25 141.8906 Q96.1875 141.3281 100.125 141.3281 Q122.7656 141.3281 135.9844 152.1562 Q149.2031 162.8438 149.2031 181.2656 Q149.2031 200.25 135.5625 210.7969 Q122.0625 221.2031 97.3125 221.2031 Q88.875 221.2031 80.0156 219.9375 Q71.1562 218.6719 61.875 216.1406 L61.875 200.25 Q69.8906 204.0469 78.6094 206.0156 Q87.3281 207.8438 97.0312 207.8438 Q112.6406 207.8438 121.7812 200.6719 Q130.9219 193.5 130.9219 181.2656 Q130.9219 169.0312 121.7812 161.8594 Q112.6406 154.6875 97.0312 154.6875 Q89.7188 154.6875 82.4062 156.0938 Q75.0938 157.5 67.5 160.4531 L67.5 101.6719 Z\"/></svg></template>\n    <template id=\"♠6\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.1094 153.7031 Q97.7344 153.7031 90.5625 161.0156 Q83.3906 168.4688 83.3906 181.2656 Q83.3906 193.9219 90.5625 201.2344 Q97.7344 208.6875 110.1094 208.6875 Q122.3438 208.6875 129.5156 201.2344 Q136.6875 193.9219 136.6875 181.2656 Q136.6875 168.4688 129.5156 161.0156 Q122.3438 153.7031 110.1094 153.7031 ZM146.3906 103.9219 L146.3906 118.4062 Q139.5 115.5938 132.4688 114.1875 Q125.4375 112.6406 118.5469 112.6406 Q100.5469 112.6406 90.9844 123.1875 Q81.4219 133.875 80.0156 155.3906 Q85.3594 148.5 93.375 144.8438 Q101.5312 141.1875 111.0938 141.1875 Q131.4844 141.1875 143.2969 151.875 Q155.1094 162.7031 155.1094 181.2656 Q155.1094 199.125 142.7344 210.2344 Q130.5 221.2031 110.1094 221.2031 Q86.625 221.2031 74.25 205.5938 Q61.875 189.9844 61.875 160.1719 Q61.875 132.3281 77.0625 115.875 Q92.25 99.2812 117.8438 99.2812 Q124.7344 99.2812 131.7656 100.4062 Q138.7969 101.6719 146.3906 103.9219 Z\"/></svg></template>\n    <template id=\"♠7\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L148.6406 101.6719 L148.6406 108.4219 L99.7031 219.0938 L80.5781 219.0938 L126.7031 115.0312 L61.875 115.0312 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♠8\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM108.2812 163.125 Q95.2031 163.125 87.75 169.3125 Q80.2969 175.3594 80.2969 185.9062 Q80.2969 196.5938 87.75 202.6406 Q95.2031 208.6875 108.2812 208.6875 Q121.2188 208.6875 128.8125 202.5 Q136.2656 196.4531 136.2656 185.9062 Q136.2656 175.3594 128.8125 169.3125 Q121.3594 163.125 108.2812 163.125 ZM90 156.2344 Q78.1875 153.7031 71.7188 146.8125 Q65.1094 139.7812 65.1094 129.6562 Q65.1094 115.5938 76.6406 107.4375 Q88.1719 99.2812 108.2812 99.2812 Q128.3906 99.2812 139.9219 107.4375 Q151.3125 115.5938 151.3125 129.6562 Q151.3125 140.0625 144.8438 146.8125 Q138.2344 153.7031 126.5625 156.2344 Q139.2188 158.7656 147.0938 166.9219 Q154.5469 174.6562 154.5469 185.9062 Q154.5469 202.9219 142.5938 212.0625 Q130.5 221.2031 108.2812 221.2031 Q85.9219 221.2031 73.9688 212.0625 Q61.875 202.9219 61.875 185.9062 Q61.875 174.9375 69.3281 166.9219 Q76.9219 159.0469 90 156.2344 ZM83.25 131.2031 Q83.25 140.0625 89.8594 145.4062 Q96.3281 150.6094 108.2812 150.6094 Q119.6719 150.6094 126.5625 145.4062 Q133.3125 140.3438 133.3125 131.2031 Q133.3125 122.3438 126.5625 117 Q119.9531 111.7969 108.2812 111.7969 Q96.6094 111.7969 89.8594 117 Q83.25 122.0625 83.25 131.2031 Z\"/></svg></template>\n    <template id=\"♠9\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM70.5938 216.5625 L70.5938 202.0781 Q77.4844 204.8906 84.5156 206.4375 Q91.5469 207.8438 98.2969 207.8438 Q116.4375 207.8438 126 197.2969 Q135.4219 186.75 136.8281 165.0938 Q131.9062 171.7031 123.4688 175.5 Q115.4531 179.1562 105.75 179.1562 Q85.5 179.1562 73.6875 168.4688 Q61.875 157.7812 61.875 139.2188 Q61.875 121.0781 74.1094 110.25 Q86.4844 99.2812 106.875 99.2812 Q130.3594 99.2812 142.5938 114.8906 Q154.9688 130.5 154.9688 160.3125 Q154.9688 188.1562 139.9219 204.6094 Q124.7344 221.2031 99.1406 221.2031 Q92.25 221.2031 85.2188 220.0781 Q78.1875 218.8125 70.5938 216.5625 ZM106.875 166.7812 Q119.25 166.7812 126.4219 159.4688 Q133.5938 152.1562 133.5938 139.2188 Q133.5938 126.5625 126.4219 119.25 Q119.25 111.7969 106.875 111.7969 Q94.9219 111.7969 87.4688 119.25 Q80.1562 126.5625 80.1562 139.2188 Q80.1562 152.1562 87.4688 159.4688 Q94.6406 166.7812 106.875 166.7812 Z\"/></svg></template>\n    <template id=\"♠10\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM159.0469 111.7969 Q149.0625 111.7969 142.0312 123.8906 Q134.8594 135.9844 134.8594 160.1719 Q134.8594 184.5 142.0312 196.5938 Q149.0625 208.6875 159.0469 208.6875 Q169.0312 208.6875 176.0625 196.5938 Q183.2344 184.5 183.2344 160.1719 Q183.2344 135.9844 176.0625 123.8906 Q169.0312 111.7969 159.0469 111.7969 ZM159.0469 99.2812 Q177.4688 99.2812 189.4219 114.8906 Q201.375 130.5 201.375 160.1719 Q201.375 189.9844 189.4219 205.5938 Q177.4688 221.2031 159.0469 221.2031 Q136.2656 221.2031 126.4219 205.5938 Q116.5781 189.9844 116.5781 160.1719 Q116.5781 130.5 126.4219 114.8906 Q136.2656 99.2812 159.0469 99.2812 ZM80.5781 219.0938 L80.5781 117.7031 L61.875 123.4688 L61.875 107.1562 L81.5625 101.6719 L100.8281 101.6719 L100.8281 219.0938 L80.5781 219.0938 Z\"/></svg></template>\n    <template id=\"♠J\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM89.1562 101.6719 L107.0156 101.6719 L107.0156 178.7344 Q107.0156 199.6875 97.875 209.5312 Q88.875 219.2344 68.7656 219.2344 L61.875 219.2344 L61.875 205.7344 L67.5 205.7344 Q79.3125 205.7344 84.2344 199.8281 Q89.1562 193.9219 89.1562 178.7344 L89.1562 101.6719 Z\"/></svg></template>\n    <template id=\"♠Q\"><svg viewBox=\"24 62 247 343\"><path d=\"M107.2969 221.0625 Q106.7344 221.0625 105.5391 221.1328 Q104.3438 221.2031 103.6406 221.2031 Q81.4219 221.2031 70.5234 206.0859 Q59.625 190.9688 59.625 160.3125 Q59.625 129.5156 70.5938 114.3984 Q81.5625 99.2812 103.7812 99.2812 Q126.1406 99.2812 137.1094 114.3984 Q148.0781 129.5156 148.0781 160.3125 Q148.0781 183.5156 142.0312 197.6484 Q135.9844 211.7812 123.6094 217.4062 L141.3281 232.3125 L127.9688 240.1875 L107.2969 221.0625 ZM129.375 160.3125 Q129.375 134.4375 123.3984 123.3281 Q117.4219 112.2188 103.7812 112.2188 Q90.2812 112.2188 84.3047 123.3281 Q78.3281 134.4375 78.3281 160.3125 Q78.3281 186.1875 84.3047 197.2969 Q90.2812 208.4062 103.7812 208.4062 Q117.4219 208.4062 123.3984 197.2969 Q129.375 186.1875 129.375 160.3125 ZM174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 Z\"/></svg></template>\n    <template id=\"♠K\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L79.7344 101.6719 L79.7344 151.3125 L130.6406 101.6719 L153.7031 101.6719 L96.4688 156.5156 L158.3438 219.2344 L134.8594 219.2344 L79.7344 162.5625 L79.7344 219.2344 L61.875 219.2344 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♥A\"><svg viewBox=\"24 62 247 343\"><path d=\"M174.2344 223.875 Q183.375 240.8906 205.5234 268.0312 Q227.6719 295.1719 228.9375 300.5156 Q232.7344 305.7188 232.7344 316.6875 Q232.7344 348.75 205.3125 348.75 Q190.125 348.75 180.8438 326.9531 L176.625 326.9531 Q176.625 355.6406 184.9219 370.6875 L163.5469 370.6875 Q171.8438 355.6406 171.8438 326.9531 L167.625 326.9531 Q158.3438 348.75 143.1562 348.75 Q115.7344 348.75 115.7344 316.6875 Q115.7344 305.7188 119.5312 300.5156 Q120.7969 295.1719 142.9453 268.0312 Q165.0938 240.8906 174.2344 223.875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.6719 115.7344 L91.8281 175.7812 L129.5156 175.7812 L110.6719 115.7344 ZM99.9844 101.6719 L121.6406 101.6719 L162.1406 219.2344 L143.5781 219.2344 L134.0156 188.5781 L87.6094 188.5781 L78.0469 219.2344 L59.4844 219.2344 L99.9844 101.6719 Z\"/></svg></template>\n    <template id=\"♥2\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM86.3438 203.0625 L145.9688 203.0625 L145.9688 219.0938 L61.875 219.0938 L61.875 203.625 Q66.6562 199.2656 75.5156 191.3906 Q123.8906 148.5 123.8906 135.2812 Q123.8906 126 116.5781 120.3047 Q109.2656 114.6094 97.3125 114.6094 Q90 114.6094 81.4219 117.0703 Q72.8438 119.5312 62.7188 124.4531 L62.7188 107.1562 Q73.5469 103.2188 82.8984 101.25 Q92.25 99.2812 100.2656 99.2812 Q120.6562 99.2812 132.8906 108.5625 Q145.125 117.8438 145.125 133.0312 Q145.125 152.5781 98.5781 192.5156 Q90.7031 199.2656 86.3438 203.0625 Z\"/></svg></template>\n    <template id=\"♥3\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM121.7812 155.5312 Q134.7188 158.0625 141.8203 165.7266 Q148.9219 173.3906 148.9219 184.9219 Q148.9219 202.3594 135.5625 211.7812 Q122.2031 221.2031 97.3125 221.2031 Q89.2969 221.2031 80.5078 219.7266 Q71.7188 218.25 61.875 215.4375 L61.875 198.4219 Q69.1875 202.2188 77.5547 204.0469 Q85.9219 205.875 95.3438 205.875 Q110.6719 205.875 119.1094 200.3203 Q127.5469 194.7656 127.5469 184.9219 Q127.5469 174.5156 119.7422 169.1719 Q111.9375 163.8281 96.75 163.8281 L84.6562 163.8281 L84.6562 148.6406 L97.875 148.6406 Q111.0938 148.6406 117.9141 144.2109 Q124.7344 139.7812 124.7344 131.3438 Q124.7344 123.1875 117.7031 118.8984 Q110.6719 114.6094 97.3125 114.6094 Q91.6875 114.6094 84.5156 115.875 Q77.3438 117.1406 65.9531 120.375 L65.9531 104.2031 Q76.2188 101.8125 85.2188 100.5469 Q94.2188 99.2812 101.9531 99.2812 Q122.2031 99.2812 134.0859 107.5781 Q145.9688 115.875 145.9688 129.7969 Q145.9688 139.5 139.6406 146.25 Q133.3125 153 121.7812 155.5312 Z\"/></svg></template>\n    <template id=\"♥4\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM120.0938 118.6875 L76.6406 177.6094 L120.0938 177.6094 L120.0938 118.6875 ZM117 101.6719 L140.3438 101.6719 L140.3438 177.6094 L159.3281 177.6094 L159.3281 192.9375 L140.3438 192.9375 L140.3438 219.0938 L120.0938 219.0938 L120.0938 192.9375 L61.875 192.9375 L61.875 175.9219 L117 101.6719 Z\"/></svg></template>\n    <template id=\"♥5\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM67.5 101.6719 L139.2188 101.6719 L139.2188 115.0312 L84.2344 115.0312 L84.2344 143.7188 Q88.1719 142.4531 92.25 141.8906 Q96.1875 141.3281 100.125 141.3281 Q122.7656 141.3281 135.9844 152.1562 Q149.2031 162.8438 149.2031 181.2656 Q149.2031 200.25 135.5625 210.7969 Q122.0625 221.2031 97.3125 221.2031 Q88.875 221.2031 80.0156 219.9375 Q71.1562 218.6719 61.875 216.1406 L61.875 200.25 Q69.8906 204.0469 78.6094 206.0156 Q87.3281 207.8438 97.0312 207.8438 Q112.6406 207.8438 121.7812 200.6719 Q130.9219 193.5 130.9219 181.2656 Q130.9219 169.0312 121.7812 161.8594 Q112.6406 154.6875 97.0312 154.6875 Q89.7188 154.6875 82.4062 156.0938 Q75.0938 157.5 67.5 160.4531 L67.5 101.6719 Z\"/></svg></template>\n    <template id=\"♥6\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.1094 153.7031 Q97.7344 153.7031 90.5625 161.0156 Q83.3906 168.4688 83.3906 181.2656 Q83.3906 193.9219 90.5625 201.2344 Q97.7344 208.6875 110.1094 208.6875 Q122.3438 208.6875 129.5156 201.2344 Q136.6875 193.9219 136.6875 181.2656 Q136.6875 168.4688 129.5156 161.0156 Q122.3438 153.7031 110.1094 153.7031 ZM146.3906 103.9219 L146.3906 118.4062 Q139.5 115.5938 132.4688 114.1875 Q125.4375 112.6406 118.5469 112.6406 Q100.5469 112.6406 90.9844 123.1875 Q81.4219 133.875 80.0156 155.3906 Q85.3594 148.5 93.375 144.8438 Q101.5312 141.1875 111.0938 141.1875 Q131.4844 141.1875 143.2969 151.875 Q155.1094 162.7031 155.1094 181.2656 Q155.1094 199.125 142.7344 210.2344 Q130.5 221.2031 110.1094 221.2031 Q86.625 221.2031 74.25 205.5938 Q61.875 189.9844 61.875 160.1719 Q61.875 132.3281 77.0625 115.875 Q92.25 99.2812 117.8438 99.2812 Q124.7344 99.2812 131.7656 100.4062 Q138.7969 101.6719 146.3906 103.9219 Z\"/></svg></template>\n    <template id=\"♥7\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L148.6406 101.6719 L148.6406 108.4219 L99.7031 219.0938 L80.5781 219.0938 L126.7031 115.0312 L61.875 115.0312 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♥8\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM108.2812 163.125 Q95.2031 163.125 87.75 169.3125 Q80.2969 175.3594 80.2969 185.9062 Q80.2969 196.5938 87.75 202.6406 Q95.2031 208.6875 108.2812 208.6875 Q121.2188 208.6875 128.8125 202.5 Q136.2656 196.4531 136.2656 185.9062 Q136.2656 175.3594 128.8125 169.3125 Q121.3594 163.125 108.2812 163.125 ZM90 156.2344 Q78.1875 153.7031 71.7188 146.8125 Q65.1094 139.7812 65.1094 129.6562 Q65.1094 115.5938 76.6406 107.4375 Q88.1719 99.2812 108.2812 99.2812 Q128.3906 99.2812 139.9219 107.4375 Q151.3125 115.5938 151.3125 129.6562 Q151.3125 140.0625 144.8438 146.8125 Q138.2344 153.7031 126.5625 156.2344 Q139.2188 158.7656 147.0938 166.9219 Q154.5469 174.6562 154.5469 185.9062 Q154.5469 202.9219 142.5938 212.0625 Q130.5 221.2031 108.2812 221.2031 Q85.9219 221.2031 73.9688 212.0625 Q61.875 202.9219 61.875 185.9062 Q61.875 174.9375 69.3281 166.9219 Q76.9219 159.0469 90 156.2344 ZM83.25 131.2031 Q83.25 140.0625 89.8594 145.4062 Q96.3281 150.6094 108.2812 150.6094 Q119.6719 150.6094 126.5625 145.4062 Q133.3125 140.3438 133.3125 131.2031 Q133.3125 122.3438 126.5625 117 Q119.9531 111.7969 108.2812 111.7969 Q96.6094 111.7969 89.8594 117 Q83.25 122.0625 83.25 131.2031 Z\"/></svg></template>\n    <template id=\"♥9\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM70.5938 216.5625 L70.5938 202.0781 Q77.4844 204.8906 84.5156 206.4375 Q91.5469 207.8438 98.2969 207.8438 Q116.4375 207.8438 126 197.2969 Q135.4219 186.75 136.8281 165.0938 Q131.9062 171.7031 123.4688 175.5 Q115.4531 179.1562 105.75 179.1562 Q85.5 179.1562 73.6875 168.4688 Q61.875 157.7812 61.875 139.2188 Q61.875 121.0781 74.1094 110.25 Q86.4844 99.2812 106.875 99.2812 Q130.3594 99.2812 142.5938 114.8906 Q154.9688 130.5 154.9688 160.3125 Q154.9688 188.1562 139.9219 204.6094 Q124.7344 221.2031 99.1406 221.2031 Q92.25 221.2031 85.2188 220.0781 Q78.1875 218.8125 70.5938 216.5625 ZM106.875 166.7812 Q119.25 166.7812 126.4219 159.4688 Q133.5938 152.1562 133.5938 139.2188 Q133.5938 126.5625 126.4219 119.25 Q119.25 111.7969 106.875 111.7969 Q94.9219 111.7969 87.4688 119.25 Q80.1562 126.5625 80.1562 139.2188 Q80.1562 152.1562 87.4688 159.4688 Q94.6406 166.7812 106.875 166.7812 Z\"/></svg></template>\n    <template id=\"♥10\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM159.0469 111.7969 Q149.0625 111.7969 142.0312 123.8906 Q134.8594 135.9844 134.8594 160.1719 Q134.8594 184.5 142.0312 196.5938 Q149.0625 208.6875 159.0469 208.6875 Q169.0312 208.6875 176.0625 196.5938 Q183.2344 184.5 183.2344 160.1719 Q183.2344 135.9844 176.0625 123.8906 Q169.0312 111.7969 159.0469 111.7969 ZM159.0469 99.2812 Q177.4688 99.2812 189.4219 114.8906 Q201.375 130.5 201.375 160.1719 Q201.375 189.9844 189.4219 205.5938 Q177.4688 221.2031 159.0469 221.2031 Q136.2656 221.2031 126.4219 205.5938 Q116.5781 189.9844 116.5781 160.1719 Q116.5781 130.5 126.4219 114.8906 Q136.2656 99.2812 159.0469 99.2812 ZM80.5781 219.0938 L80.5781 117.7031 L61.875 123.4688 L61.875 107.1562 L81.5625 101.6719 L100.8281 101.6719 L100.8281 219.0938 L80.5781 219.0938 Z\"/></svg></template>\n    <template id=\"♥J\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM89.1562 101.6719 L107.0156 101.6719 L107.0156 178.7344 Q107.0156 199.6875 97.875 209.5312 Q88.875 219.2344 68.7656 219.2344 L61.875 219.2344 L61.875 205.7344 L67.5 205.7344 Q79.3125 205.7344 84.2344 199.8281 Q89.1562 193.9219 89.1562 178.7344 L89.1562 101.6719 Z\"/></svg></template>\n    <template id=\"♥Q\"><svg viewBox=\"24 62 247 343\"><path d=\"M107.2969 221.0625 Q106.7344 221.0625 105.5391 221.1328 Q104.3438 221.2031 103.6406 221.2031 Q81.4219 221.2031 70.5234 206.0859 Q59.625 190.9688 59.625 160.3125 Q59.625 129.5156 70.5938 114.3984 Q81.5625 99.2812 103.7812 99.2812 Q126.1406 99.2812 137.1094 114.3984 Q148.0781 129.5156 148.0781 160.3125 Q148.0781 183.5156 142.0312 197.6484 Q135.9844 211.7812 123.6094 217.4062 L141.3281 232.3125 L127.9688 240.1875 L107.2969 221.0625 ZM129.375 160.3125 Q129.375 134.4375 123.3984 123.3281 Q117.4219 112.2188 103.7812 112.2188 Q90.2812 112.2188 84.3047 123.3281 Q78.3281 134.4375 78.3281 160.3125 Q78.3281 186.1875 84.3047 197.2969 Q90.2812 208.4062 103.7812 208.4062 Q117.4219 208.4062 123.3984 197.2969 Q129.375 186.1875 129.375 160.3125 ZM172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM64.2656 84.7969 Q47.3906 84.7969 47.3906 101.6719 L47.3906 370.6875 Q47.3906 387.5625 64.2656 387.5625 L235.125 387.5625 Q252 387.5625 252 370.6875 L252 101.6719 Q252 84.7969 235.125 84.7969 L64.2656 84.7969 ZM64.2656 67.9219 L235.125 67.9219 Q268.875 67.9219 268.875 101.6719 L268.875 370.6875 Q268.875 404.4375 235.125 404.4375 L64.2656 404.4375 Q30.5156 404.4375 30.5156 370.6875 L30.5156 101.6719 Q30.5156 67.9219 64.2656 67.9219 Z\"/></svg></template>\n    <template id=\"♥K\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.6875 273.6562 Q175.7812 257.0625 183.5156 248.3438 Q192.2344 238.3594 204.0469 238.3594 Q223.5938 238.3594 232.3125 259.3125 Q234.9844 265.6406 234.9844 273.9375 Q234.9844 296.1562 217.4062 318.5156 L172.9688 375.0469 L127.9688 318.5156 Q110.3906 296.4375 110.3906 273.9375 Q110.3906 265.6406 113.0625 259.3125 Q121.9219 238.3594 141.3281 238.3594 Q153.4219 238.3594 161.8594 248.3438 Q169.5938 257.4844 172.6875 273.6562 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L79.7344 101.6719 L79.7344 151.3125 L130.6406 101.6719 L153.7031 101.6719 L96.4688 156.5156 L158.3438 219.2344 L134.8594 219.2344 L79.7344 162.5625 L79.7344 219.2344 L61.875 219.2344 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♦A\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.6719 115.7344 L91.8281 175.7812 L129.5156 175.7812 L110.6719 115.7344 ZM99.9844 101.6719 L121.6406 101.6719 L162.1406 219.2344 L143.5781 219.2344 L134.0156 188.5781 L87.6094 188.5781 L78.0469 219.2344 L59.4844 219.2344 L99.9844 101.6719 Z\"/></svg></template>\n    <template id=\"♦2\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM86.3438 203.0625 L145.9688 203.0625 L145.9688 219.0938 L61.875 219.0938 L61.875 203.625 Q66.6562 199.2656 75.5156 191.3906 Q123.8906 148.5 123.8906 135.2812 Q123.8906 126 116.5781 120.3047 Q109.2656 114.6094 97.3125 114.6094 Q90 114.6094 81.4219 117.0703 Q72.8438 119.5312 62.7188 124.4531 L62.7188 107.1562 Q73.5469 103.2188 82.8984 101.25 Q92.25 99.2812 100.2656 99.2812 Q120.6562 99.2812 132.8906 108.5625 Q145.125 117.8438 145.125 133.0312 Q145.125 152.5781 98.5781 192.5156 Q90.7031 199.2656 86.3438 203.0625 Z\"/></svg></template>\n    <template id=\"♦3\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM121.7812 155.5312 Q134.7188 158.0625 141.8203 165.7266 Q148.9219 173.3906 148.9219 184.9219 Q148.9219 202.3594 135.5625 211.7812 Q122.2031 221.2031 97.3125 221.2031 Q89.2969 221.2031 80.5078 219.7266 Q71.7188 218.25 61.875 215.4375 L61.875 198.4219 Q69.1875 202.2188 77.5547 204.0469 Q85.9219 205.875 95.3438 205.875 Q110.6719 205.875 119.1094 200.3203 Q127.5469 194.7656 127.5469 184.9219 Q127.5469 174.5156 119.7422 169.1719 Q111.9375 163.8281 96.75 163.8281 L84.6562 163.8281 L84.6562 148.6406 L97.875 148.6406 Q111.0938 148.6406 117.9141 144.2109 Q124.7344 139.7812 124.7344 131.3438 Q124.7344 123.1875 117.7031 118.8984 Q110.6719 114.6094 97.3125 114.6094 Q91.6875 114.6094 84.5156 115.875 Q77.3438 117.1406 65.9531 120.375 L65.9531 104.2031 Q76.2188 101.8125 85.2188 100.5469 Q94.2188 99.2812 101.9531 99.2812 Q122.2031 99.2812 134.0859 107.5781 Q145.9688 115.875 145.9688 129.7969 Q145.9688 139.5 139.6406 146.25 Q133.3125 153 121.7812 155.5312 Z\"/></svg></template>\n    <template id=\"♦4\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM120.0938 118.6875 L76.6406 177.6094 L120.0938 177.6094 L120.0938 118.6875 ZM117 101.6719 L140.3438 101.6719 L140.3438 177.6094 L159.3281 177.6094 L159.3281 192.9375 L140.3438 192.9375 L140.3438 219.0938 L120.0938 219.0938 L120.0938 192.9375 L61.875 192.9375 L61.875 175.9219 L117 101.6719 Z\"/></svg></template>\n    <template id=\"♦5\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM67.5 101.6719 L139.2188 101.6719 L139.2188 115.0312 L84.2344 115.0312 L84.2344 143.7188 Q88.1719 142.4531 92.25 141.8906 Q96.1875 141.3281 100.125 141.3281 Q122.7656 141.3281 135.9844 152.1562 Q149.2031 162.8438 149.2031 181.2656 Q149.2031 200.25 135.5625 210.7969 Q122.0625 221.2031 97.3125 221.2031 Q88.875 221.2031 80.0156 219.9375 Q71.1562 218.6719 61.875 216.1406 L61.875 200.25 Q69.8906 204.0469 78.6094 206.0156 Q87.3281 207.8438 97.0312 207.8438 Q112.6406 207.8438 121.7812 200.6719 Q130.9219 193.5 130.9219 181.2656 Q130.9219 169.0312 121.7812 161.8594 Q112.6406 154.6875 97.0312 154.6875 Q89.7188 154.6875 82.4062 156.0938 Q75.0938 157.5 67.5 160.4531 L67.5 101.6719 Z\"/></svg></template>\n    <template id=\"♦6\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.1094 153.7031 Q97.7344 153.7031 90.5625 161.0156 Q83.3906 168.4688 83.3906 181.2656 Q83.3906 193.9219 90.5625 201.2344 Q97.7344 208.6875 110.1094 208.6875 Q122.3438 208.6875 129.5156 201.2344 Q136.6875 193.9219 136.6875 181.2656 Q136.6875 168.4688 129.5156 161.0156 Q122.3438 153.7031 110.1094 153.7031 ZM146.3906 103.9219 L146.3906 118.4062 Q139.5 115.5938 132.4688 114.1875 Q125.4375 112.6406 118.5469 112.6406 Q100.5469 112.6406 90.9844 123.1875 Q81.4219 133.875 80.0156 155.3906 Q85.3594 148.5 93.375 144.8438 Q101.5312 141.1875 111.0938 141.1875 Q131.4844 141.1875 143.2969 151.875 Q155.1094 162.7031 155.1094 181.2656 Q155.1094 199.125 142.7344 210.2344 Q130.5 221.2031 110.1094 221.2031 Q86.625 221.2031 74.25 205.5938 Q61.875 189.9844 61.875 160.1719 Q61.875 132.3281 77.0625 115.875 Q92.25 99.2812 117.8438 99.2812 Q124.7344 99.2812 131.7656 100.4062 Q138.7969 101.6719 146.3906 103.9219 Z\"/></svg></template>\n    <template id=\"♦7\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L148.6406 101.6719 L148.6406 108.4219 L99.7031 219.0938 L80.5781 219.0938 L126.7031 115.0312 L61.875 115.0312 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♦8\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM108.2812 163.125 Q95.2031 163.125 87.75 169.3125 Q80.2969 175.3594 80.2969 185.9062 Q80.2969 196.5938 87.75 202.6406 Q95.2031 208.6875 108.2812 208.6875 Q121.2188 208.6875 128.8125 202.5 Q136.2656 196.4531 136.2656 185.9062 Q136.2656 175.3594 128.8125 169.3125 Q121.3594 163.125 108.2812 163.125 ZM90 156.2344 Q78.1875 153.7031 71.7188 146.8125 Q65.1094 139.7812 65.1094 129.6562 Q65.1094 115.5938 76.6406 107.4375 Q88.1719 99.2812 108.2812 99.2812 Q128.3906 99.2812 139.9219 107.4375 Q151.3125 115.5938 151.3125 129.6562 Q151.3125 140.0625 144.8438 146.8125 Q138.2344 153.7031 126.5625 156.2344 Q139.2188 158.7656 147.0938 166.9219 Q154.5469 174.6562 154.5469 185.9062 Q154.5469 202.9219 142.5938 212.0625 Q130.5 221.2031 108.2812 221.2031 Q85.9219 221.2031 73.9688 212.0625 Q61.875 202.9219 61.875 185.9062 Q61.875 174.9375 69.3281 166.9219 Q76.9219 159.0469 90 156.2344 ZM83.25 131.2031 Q83.25 140.0625 89.8594 145.4062 Q96.3281 150.6094 108.2812 150.6094 Q119.6719 150.6094 126.5625 145.4062 Q133.3125 140.3438 133.3125 131.2031 Q133.3125 122.3438 126.5625 117 Q119.9531 111.7969 108.2812 111.7969 Q96.6094 111.7969 89.8594 117 Q83.25 122.0625 83.25 131.2031 Z\"/></svg></template>\n    <template id=\"♦9\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM70.5938 216.5625 L70.5938 202.0781 Q77.4844 204.8906 84.5156 206.4375 Q91.5469 207.8438 98.2969 207.8438 Q116.4375 207.8438 126 197.2969 Q135.4219 186.75 136.8281 165.0938 Q131.9062 171.7031 123.4688 175.5 Q115.4531 179.1562 105.75 179.1562 Q85.5 179.1562 73.6875 168.4688 Q61.875 157.7812 61.875 139.2188 Q61.875 121.0781 74.1094 110.25 Q86.4844 99.2812 106.875 99.2812 Q130.3594 99.2812 142.5938 114.8906 Q154.9688 130.5 154.9688 160.3125 Q154.9688 188.1562 139.9219 204.6094 Q124.7344 221.2031 99.1406 221.2031 Q92.25 221.2031 85.2188 220.0781 Q78.1875 218.8125 70.5938 216.5625 ZM106.875 166.7812 Q119.25 166.7812 126.4219 159.4688 Q133.5938 152.1562 133.5938 139.2188 Q133.5938 126.5625 126.4219 119.25 Q119.25 111.7969 106.875 111.7969 Q94.9219 111.7969 87.4688 119.25 Q80.1562 126.5625 80.1562 139.2188 Q80.1562 152.1562 87.4688 159.4688 Q94.6406 166.7812 106.875 166.7812 Z\"/></svg></template>\n    <template id=\"♦10\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM159.0469 111.7969 Q149.0625 111.7969 142.0312 123.8906 Q134.8594 135.9844 134.8594 160.1719 Q134.8594 184.5 142.0312 196.5938 Q149.0625 208.6875 159.0469 208.6875 Q169.0312 208.6875 176.0625 196.5938 Q183.2344 184.5 183.2344 160.1719 Q183.2344 135.9844 176.0625 123.8906 Q169.0312 111.7969 159.0469 111.7969 ZM159.0469 99.2812 Q177.4688 99.2812 189.4219 114.8906 Q201.375 130.5 201.375 160.1719 Q201.375 189.9844 189.4219 205.5938 Q177.4688 221.2031 159.0469 221.2031 Q136.2656 221.2031 126.4219 205.5938 Q116.5781 189.9844 116.5781 160.1719 Q116.5781 130.5 126.4219 114.8906 Q136.2656 99.2812 159.0469 99.2812 ZM80.5781 219.0938 L80.5781 117.7031 L61.875 123.4688 L61.875 107.1562 L81.5625 101.6719 L100.8281 101.6719 L100.8281 219.0938 L80.5781 219.0938 Z\"/></svg></template>\n    <template id=\"♦J\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM89.1562 101.6719 L107.0156 101.6719 L107.0156 178.7344 Q107.0156 199.6875 97.875 209.5312 Q88.875 219.2344 68.7656 219.2344 L61.875 219.2344 L61.875 205.7344 L67.5 205.7344 Q79.3125 205.7344 84.2344 199.8281 Q89.1562 193.9219 89.1562 178.7344 L89.1562 101.6719 Z\"/></svg></template>\n    <template id=\"♦Q\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM107.2969 221.0625 Q106.7344 221.0625 105.5391 221.1328 Q104.3438 221.2031 103.6406 221.2031 Q81.4219 221.2031 70.5234 206.0859 Q59.625 190.9688 59.625 160.3125 Q59.625 129.5156 70.5938 114.3984 Q81.5625 99.2812 103.7812 99.2812 Q126.1406 99.2812 137.1094 114.3984 Q148.0781 129.5156 148.0781 160.3125 Q148.0781 183.5156 142.0312 197.6484 Q135.9844 211.7812 123.6094 217.4062 L141.3281 232.3125 L127.9688 240.1875 L107.2969 221.0625 ZM129.375 160.3125 Q129.375 134.4375 123.3984 123.3281 Q117.4219 112.2188 103.7812 112.2188 Q90.2812 112.2188 84.3047 123.3281 Q78.3281 134.4375 78.3281 160.3125 Q78.3281 186.1875 84.3047 197.2969 Q90.2812 208.4062 103.7812 208.4062 Q117.4219 208.4062 123.3984 197.2969 Q129.375 186.1875 129.375 160.3125 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 Z\"/></svg></template>\n    <template id=\"♦K\"><svg viewBox=\"24 62 247 343\"><path d=\"M172.4062 228.2344 Q172.4062 228.2344 229.7812 302.2031 L172.4062 375.0469 Q172.4062 375.0469 114.75 302.2031 Q114.75 302.2031 172.4062 228.2344 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L79.7344 101.6719 L79.7344 151.3125 L130.6406 101.6719 L153.7031 101.6719 L96.4688 156.5156 L158.3438 219.2344 L134.8594 219.2344 L79.7344 162.5625 L79.7344 219.2344 L61.875 219.2344 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♣A\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.6719 115.7344 L91.8281 175.7812 L129.5156 175.7812 L110.6719 115.7344 ZM99.9844 101.6719 L121.6406 101.6719 L162.1406 219.2344 L143.5781 219.2344 L134.0156 188.5781 L87.6094 188.5781 L78.0469 219.2344 L59.4844 219.2344 L99.9844 101.6719 Z\"/></svg></template>\n    <template id=\"♣2\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM86.3438 203.0625 L145.9688 203.0625 L145.9688 219.0938 L61.875 219.0938 L61.875 203.625 Q66.6562 199.2656 75.5156 191.3906 Q123.8906 148.5 123.8906 135.2812 Q123.8906 126 116.5781 120.3047 Q109.2656 114.6094 97.3125 114.6094 Q90 114.6094 81.4219 117.0703 Q72.8438 119.5312 62.7188 124.4531 L62.7188 107.1562 Q73.5469 103.2188 82.8984 101.25 Q92.25 99.2812 100.2656 99.2812 Q120.6562 99.2812 132.8906 108.5625 Q145.125 117.8438 145.125 133.0312 Q145.125 152.5781 98.5781 192.5156 Q90.7031 199.2656 86.3438 203.0625 Z\"/></svg></template>\n    <template id=\"♣3\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM121.7812 155.5312 Q134.7188 158.0625 141.8203 165.7266 Q148.9219 173.3906 148.9219 184.9219 Q148.9219 202.3594 135.5625 211.7812 Q122.2031 221.2031 97.3125 221.2031 Q89.2969 221.2031 80.5078 219.7266 Q71.7188 218.25 61.875 215.4375 L61.875 198.4219 Q69.1875 202.2188 77.5547 204.0469 Q85.9219 205.875 95.3438 205.875 Q110.6719 205.875 119.1094 200.3203 Q127.5469 194.7656 127.5469 184.9219 Q127.5469 174.5156 119.7422 169.1719 Q111.9375 163.8281 96.75 163.8281 L84.6562 163.8281 L84.6562 148.6406 L97.875 148.6406 Q111.0938 148.6406 117.9141 144.2109 Q124.7344 139.7812 124.7344 131.3438 Q124.7344 123.1875 117.7031 118.8984 Q110.6719 114.6094 97.3125 114.6094 Q91.6875 114.6094 84.5156 115.875 Q77.3438 117.1406 65.9531 120.375 L65.9531 104.2031 Q76.2188 101.8125 85.2188 100.5469 Q94.2188 99.2812 101.9531 99.2812 Q122.2031 99.2812 134.0859 107.5781 Q145.9688 115.875 145.9688 129.7969 Q145.9688 139.5 139.6406 146.25 Q133.3125 153 121.7812 155.5312 Z\"/></svg></template>\n    <template id=\"♣4\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM120.0938 118.6875 L76.6406 177.6094 L120.0938 177.6094 L120.0938 118.6875 ZM117 101.6719 L140.3438 101.6719 L140.3438 177.6094 L159.3281 177.6094 L159.3281 192.9375 L140.3438 192.9375 L140.3438 219.0938 L120.0938 219.0938 L120.0938 192.9375 L61.875 192.9375 L61.875 175.9219 L117 101.6719 Z\"/></svg></template>\n    <template id=\"♣5\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM67.5 101.6719 L139.2188 101.6719 L139.2188 115.0312 L84.2344 115.0312 L84.2344 143.7188 Q88.1719 142.4531 92.25 141.8906 Q96.1875 141.3281 100.125 141.3281 Q122.7656 141.3281 135.9844 152.1562 Q149.2031 162.8438 149.2031 181.2656 Q149.2031 200.25 135.5625 210.7969 Q122.0625 221.2031 97.3125 221.2031 Q88.875 221.2031 80.0156 219.9375 Q71.1562 218.6719 61.875 216.1406 L61.875 200.25 Q69.8906 204.0469 78.6094 206.0156 Q87.3281 207.8438 97.0312 207.8438 Q112.6406 207.8438 121.7812 200.6719 Q130.9219 193.5 130.9219 181.2656 Q130.9219 169.0312 121.7812 161.8594 Q112.6406 154.6875 97.0312 154.6875 Q89.7188 154.6875 82.4062 156.0938 Q75.0938 157.5 67.5 160.4531 L67.5 101.6719 Z\"/></svg></template>\n    <template id=\"♣6\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM110.1094 153.7031 Q97.7344 153.7031 90.5625 161.0156 Q83.3906 168.4688 83.3906 181.2656 Q83.3906 193.9219 90.5625 201.2344 Q97.7344 208.6875 110.1094 208.6875 Q122.3438 208.6875 129.5156 201.2344 Q136.6875 193.9219 136.6875 181.2656 Q136.6875 168.4688 129.5156 161.0156 Q122.3438 153.7031 110.1094 153.7031 ZM146.3906 103.9219 L146.3906 118.4062 Q139.5 115.5938 132.4688 114.1875 Q125.4375 112.6406 118.5469 112.6406 Q100.5469 112.6406 90.9844 123.1875 Q81.4219 133.875 80.0156 155.3906 Q85.3594 148.5 93.375 144.8438 Q101.5312 141.1875 111.0938 141.1875 Q131.4844 141.1875 143.2969 151.875 Q155.1094 162.7031 155.1094 181.2656 Q155.1094 199.125 142.7344 210.2344 Q130.5 221.2031 110.1094 221.2031 Q86.625 221.2031 74.25 205.5938 Q61.875 189.9844 61.875 160.1719 Q61.875 132.3281 77.0625 115.875 Q92.25 99.2812 117.8438 99.2812 Q124.7344 99.2812 131.7656 100.4062 Q138.7969 101.6719 146.3906 103.9219 Z\"/></svg></template>\n    <template id=\"♣7\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L148.6406 101.6719 L148.6406 108.4219 L99.7031 219.0938 L80.5781 219.0938 L126.7031 115.0312 L61.875 115.0312 L61.875 101.6719 Z\"/></svg></template>\n    <template id=\"♣8\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM108.2812 163.125 Q95.2031 163.125 87.75 169.3125 Q80.2969 175.3594 80.2969 185.9062 Q80.2969 196.5938 87.75 202.6406 Q95.2031 208.6875 108.2812 208.6875 Q121.2188 208.6875 128.8125 202.5 Q136.2656 196.4531 136.2656 185.9062 Q136.2656 175.3594 128.8125 169.3125 Q121.3594 163.125 108.2812 163.125 ZM90 156.2344 Q78.1875 153.7031 71.7188 146.8125 Q65.1094 139.7812 65.1094 129.6562 Q65.1094 115.5938 76.6406 107.4375 Q88.1719 99.2812 108.2812 99.2812 Q128.3906 99.2812 139.9219 107.4375 Q151.3125 115.5938 151.3125 129.6562 Q151.3125 140.0625 144.8438 146.8125 Q138.2344 153.7031 126.5625 156.2344 Q139.2188 158.7656 147.0938 166.9219 Q154.5469 174.6562 154.5469 185.9062 Q154.5469 202.9219 142.5938 212.0625 Q130.5 221.2031 108.2812 221.2031 Q85.9219 221.2031 73.9688 212.0625 Q61.875 202.9219 61.875 185.9062 Q61.875 174.9375 69.3281 166.9219 Q76.9219 159.0469 90 156.2344 ZM83.25 131.2031 Q83.25 140.0625 89.8594 145.4062 Q96.3281 150.6094 108.2812 150.6094 Q119.6719 150.6094 126.5625 145.4062 Q133.3125 140.3438 133.3125 131.2031 Q133.3125 122.3438 126.5625 117 Q119.9531 111.7969 108.2812 111.7969 Q96.6094 111.7969 89.8594 117 Q83.25 122.0625 83.25 131.2031 Z\"/></svg></template>\n    <template id=\"♣9\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM70.5938 216.5625 L70.5938 202.0781 Q77.4844 204.8906 84.5156 206.4375 Q91.5469 207.8438 98.2969 207.8438 Q116.4375 207.8438 126 197.2969 Q135.4219 186.75 136.8281 165.0938 Q131.9062 171.7031 123.4688 175.5 Q115.4531 179.1562 105.75 179.1562 Q85.5 179.1562 73.6875 168.4688 Q61.875 157.7812 61.875 139.2188 Q61.875 121.0781 74.1094 110.25 Q86.4844 99.2812 106.875 99.2812 Q130.3594 99.2812 142.5938 114.8906 Q154.9688 130.5 154.9688 160.3125 Q154.9688 188.1562 139.9219 204.6094 Q124.7344 221.2031 99.1406 221.2031 Q92.25 221.2031 85.2188 220.0781 Q78.1875 218.8125 70.5938 216.5625 ZM106.875 166.7812 Q119.25 166.7812 126.4219 159.4688 Q133.5938 152.1562 133.5938 139.2188 Q133.5938 126.5625 126.4219 119.25 Q119.25 111.7969 106.875 111.7969 Q94.9219 111.7969 87.4688 119.25 Q80.1562 126.5625 80.1562 139.2188 Q80.1562 152.1562 87.4688 159.4688 Q94.6406 166.7812 106.875 166.7812 Z\"/></svg></template>\n    <template id=\"♣10\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM159.0469 111.7969 Q149.0625 111.7969 142.0312 123.8906 Q134.8594 135.9844 134.8594 160.1719 Q134.8594 184.5 142.0312 196.5938 Q149.0625 208.6875 159.0469 208.6875 Q169.0312 208.6875 176.0625 196.5938 Q183.2344 184.5 183.2344 160.1719 Q183.2344 135.9844 176.0625 123.8906 Q169.0312 111.7969 159.0469 111.7969 ZM159.0469 99.2812 Q177.4688 99.2812 189.4219 114.8906 Q201.375 130.5 201.375 160.1719 Q201.375 189.9844 189.4219 205.5938 Q177.4688 221.2031 159.0469 221.2031 Q136.2656 221.2031 126.4219 205.5938 Q116.5781 189.9844 116.5781 160.1719 Q116.5781 130.5 126.4219 114.8906 Q136.2656 99.2812 159.0469 99.2812 ZM80.5781 219.0938 L80.5781 117.7031 L61.875 123.4688 L61.875 107.1562 L81.5625 101.6719 L100.8281 101.6719 L100.8281 219.0938 L80.5781 219.0938 Z\"/></svg></template>\n    <template id=\"♣J\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM89.1562 101.6719 L107.0156 101.6719 L107.0156 178.7344 Q107.0156 199.6875 97.875 209.5312 Q88.875 219.2344 68.7656 219.2344 L61.875 219.2344 L61.875 205.7344 L67.5 205.7344 Q79.3125 205.7344 84.2344 199.8281 Q89.1562 193.9219 89.1562 178.7344 L89.1562 101.6719 Z\"/></svg></template>\n    <template id=\"♣Q\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM107.2969 221.0625 Q106.7344 221.0625 105.5391 221.1328 Q104.3438 221.2031 103.6406 221.2031 Q81.4219 221.2031 70.5234 206.0859 Q59.625 190.9688 59.625 160.3125 Q59.625 129.5156 70.5938 114.3984 Q81.5625 99.2812 103.7812 99.2812 Q126.1406 99.2812 137.1094 114.3984 Q148.0781 129.5156 148.0781 160.3125 Q148.0781 183.5156 142.0312 197.6484 Q135.9844 211.7812 123.6094 217.4062 L141.3281 232.3125 L127.9688 240.1875 L107.2969 221.0625 ZM129.375 160.3125 Q129.375 134.4375 123.3984 123.3281 Q117.4219 112.2188 103.7812 112.2188 Q90.2812 112.2188 84.3047 123.3281 Q78.3281 134.4375 78.3281 160.3125 Q78.3281 186.1875 84.3047 197.2969 Q90.2812 208.4062 103.7812 208.4062 Q117.4219 208.4062 123.3984 197.2969 Q129.375 186.1875 129.375 160.3125 Z\"/></svg></template>\n    <template id=\"♣K\"><svg viewBox=\"24 62 247 343\"><path d=\"M155.9531 370.6875 Q163.9688 360 163.9688 324.7031 Q153.8438 352.125 129.9375 351.7031 Q122.4844 351.5625 118.9688 349.875 Q98.4375 340.4531 98.4375 319.5 Q98.4375 312.1875 100.6875 307.125 Q109.5469 287.2969 133.5938 287.2969 Q144.1406 287.2969 151.0312 289.9688 Q133.5938 271.6875 133.5938 256.7812 Q133.5938 223.875 166.7812 223.875 Q199.9688 223.875 199.9688 256.7812 Q199.9688 271.6875 182.5312 289.9688 Q189.4219 287.2969 199.9688 287.2969 Q224.0156 287.2969 232.875 307.125 Q235.125 312.1875 235.125 319.5 Q235.125 340.0312 214.5938 349.875 Q211.0781 351.5625 203.625 351.7031 Q179.8594 352.4062 169.5938 324.7031 Q169.5938 360 177.6094 370.6875 L155.9531 370.6875 ZM61.875 84.7969 Q45 84.7969 45 101.6719 L45 370.6875 Q45 387.5625 61.875 387.5625 L232.7344 387.5625 Q249.6094 387.5625 249.6094 370.6875 L249.6094 101.6719 Q249.6094 84.7969 232.7344 84.7969 L61.875 84.7969 ZM61.875 67.9219 L232.7344 67.9219 Q266.4844 67.9219 266.4844 101.6719 L266.4844 370.6875 Q266.4844 404.4375 232.7344 404.4375 L61.875 404.4375 Q28.125 404.4375 28.125 370.6875 L28.125 101.6719 Q28.125 67.9219 61.875 67.9219 ZM61.875 101.6719 L79.7344 101.6719 L79.7344 151.3125 L130.6406 101.6719 L153.7031 101.6719 L96.4688 156.5156 L158.3438 219.2344 L134.8594 219.2344 L79.7344 162.5625 L79.7344 219.2344 L61.875 219.2344 L61.875 101.6719 Z\"/></svg></template>\n\n    <table style=\"border-width:1px\">\n        <tr width=\"100%\" height=\"10px\" style=\"visibility:visible\"}>\n            <td width=\"50px\"><playing-card><span style=\"color:blue\">&block;</span></playing-card</td>\n        </tr>\n        <tr width=\"100%\">\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;A</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;2</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;3</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;4</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;5</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;6</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;7</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;8</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;9</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;10</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;J</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;Q</span></playing-card></td>\n            <td width=\"50px\"><playing-card><span style=\"color:black\">&spades;K</span></playing-card></td>\n        </tr>\n        <tr>\n            <td><playing-card><span style=\"color:red\">&hearts;A</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;2</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;3</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;4</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;5</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;6</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;7</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;8</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;9</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;10</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;J</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;Q</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&hearts;K</span></playing-card></td>\n        </tr>\n        <tr>\n            <td><playing-card><span style=\"color:red\">&diams;A</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;2</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;3</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;4</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;5</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;6</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;7</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;8</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;9</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;10</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;J</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;Q</span></playing-card></td>\n            <td><playing-card><span style=\"color:red\">&diams;K</span></playing-card></td>\n        </tr>\n        <tr>\n            <td><playing-card><span style=\"color:black\">&clubs;A</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;2</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;3</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;4</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;5</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;6</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;7</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;8</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;9</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;10</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;J</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;Q</span></playing-card></td>\n            <td><playing-card><span style=\"color:black\">&clubs;K</span></playing-card></td>\n        </tr>\n    </table>\n</div>\n"

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = "<p>index</p>\n"

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = "<form\n    id=\"message_form\"\n    onsubmit=\"\n     var gun = Gun(location.origin + '/gun');\n     openpgp.config.aead_protect = true\n     openpgp.initWorker({ path:'/js/openpgp.worker.js' })\n     if (!message_txt.value) {\n          return false\n     }\n     window.handlePost(message_txt.value)(openpgp)(window.localStorage)('royale')(gun).then(result => {if (result) {console.log(result)}}).catch(err => console.error(err));document.getElementById('message_txt').value = ''; return false\"\n    method=\"post\"\n    action=\"/message\">\n    <input id=\"message_form_input\"\n        type=\"submit\"\n        value=\"post message\"\n        form=\"message_form\"\n        >\n</form>\n<textarea\n    id=\"message_txt\"\n    name=\"message_txt\"\n    form=\"message_form\"\n    rows=51\n    cols=70\n    placeholder=\"paste plaintext message, public key, or private key\"\n    style=\"font-family:Menlo,Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New, monospace;\"\n    >\n</textarea>\n"

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = "<span class=\"roadmap\">\n    <details>\n    <summary>road map</summary>\n    <ul>\n        <li><del><a href=\"https://github.com/colealbon/hotlips/commit/3b70981cbe4e11e1400ae8e948a06e3582d9c2d2\">Install node/koa/webpack</a></del></li>\n        <li><del><a href=\"https://github.com/colealbon/hotlips/issues/2\">Install gundb</a></del></li>\n        <li><del>make a <a href=\"#/deck\">deck</a> of cards</del></li>\n        <li><del>Alice and Bob <a href=\"#/message\">identify</a></del></li>\n        <li><del>Alice and Bob <a href=\"#/connect\">connect</a></del></li>\n        <li><del>Alice and Bob <a href=\"https://github.com/colealbon/streamliner\">exchange keys</a></del?</li>\n        <li>Alice and Bob agree on a certain \"<a href=\"#/deck\">deck</a>\" of cards. In practice, this means they agree on a set of numbers or other data such that each element of the set represents a card.</li>\n        <li>Alice picks an encryption key A and uses this to encrypt each card of the deck.</li>\n        <li>Alice <a href=\"https://bost.ocks.org/mike/shuffle/\">shuffles</a> the cards.</li>\n        <li>Alice passes the encrypted and shuffled deck to Bob. With the encryption in place, Bob cannot know which card is which.</li>\n        <li>Bob shuffles the deck.</li>\n        <li>Bob passes the double encrypted and shuffled deck back to Alice.</li>\n        <li>Alice decrypts each card using her key A. This still leaves Bob's encryption in place though so she cannot know which card is which.</li>\n        <li>Alice picks one encryption key for each card (A1, A2, etc.) and encrypts them individually.</li>\n        <li>Alice passes the deck to Bob.</li>\n        <li>Bob decrypts each card using his key B. This still leaves Alice's individual encryption in place though so he cannot know which card is which.</li>\n        <li>Bob picks one encryption key for each card (B1, B2, etc.) and encrypts them individually.</li>\n        <li>Bob passes the deck back to Alice.</li>\n        <li>Alice publishes the deck for everyone playing (in this case only Alice and Bob, see below on expansion though).</li>\n    </ul>\n</details>\n</span>\n"

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMThhNTEzM2Q4OGE3ZTA3YTQ5ODMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9kZXRlcm1pbmVDb250ZW50VHlwZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL25vdEVtcHR5LmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvZ2V0RnJvbVN0b3JhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9kZWNyeXB0UEdQTWVzc2FnZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL2RlY3J5cHRQR1BNZXNzYWdlV2l0aEtleS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL2RldGVybWluZUtleVR5cGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9lbmNyeXB0Q2xlYXJUZXh0LmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvZW5jcnlwdENsZWFydGV4dE11bHRpLmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvc2F2ZVBHUFByaXZrZXkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9zYXZlUEdQUHVia2V5LmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvbm90Q2xlYXJ0ZXh0LmpzIiwid2VicGFjazovLy8uL34vZ3VuL2d1bi5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlYmVsLXJvdXRlci9zcmMvcmViZWwtcm91dGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvaGFuZGxlUG9zdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvY29udGFjdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvZGVjay5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL21lc3NhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL3JvYWRtYXAuanMiLCJ3ZWJwYWNrOi8vLy4vfi9wcm9jZXNzL2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vbW9kdWxlLmpzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL25vdFBHUEtleS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL25vdFBHUE1lc3NhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9ub3RQR1BQcml2a2V5LmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvbm90VW5kZWZpbmVkLmpzIiwid2VicGFjazovLy8uL3ZpZXdzL3BhcnRpYWxzL2NvbnRhY3QuaHRtbCIsIndlYnBhY2s6Ly8vLi92aWV3cy9wYXJ0aWFscy9mcmVzaGRlY2suaHRtbCIsIndlYnBhY2s6Ly8vLi92aWV3cy9wYXJ0aWFscy9pbmRleC5odG1sIiwid2VicGFjazovLy8uL3ZpZXdzL3BhcnRpYWxzL21lc3NhZ2VfZm9ybS5odG1sIiwid2VicGFjazovLy8uL3ZpZXdzL3BhcnRpYWxzL3JvYWRtYXAuaHRtbCJdLCJuYW1lcyI6WyJkZXRlcm1pbmVDb250ZW50VHlwZSIsImNvbnRlbnQiLCJQcm9taXNlIiwicmVzb2x2ZSIsIm9wZW5wZ3AiLCJyZWplY3QiLCJDTEVBUlRFWFQiLCJQR1BNRVNTQUdFIiwicG9zc2libGVwZ3BrZXkiLCJrZXkiLCJyZWFkQXJtb3JlZCIsImtleXMiLCJ0aGVuIiwia2V5VHlwZSIsIm1lc3NhZ2UiLCJlcnIiLCJub3RFbXB0eSIsIkVycm9yIiwiZ2V0RnJvbVN0b3JhZ2UiLCJsb2NhbFN0b3JhZ2UiLCJpbmRleEtleSIsImkiLCJsZW5ndGgiLCJrZXlBcnIiLCJwdXNoIiwiZ2V0SXRlbSIsImRlY3J5cHRQR1BNZXNzYWdlIiwiUEdQUFJJVktFWSIsInBhc3N3b3JkIiwiUEdQTWVzc2FnZUFybW9yIiwic3RvcmVBcnIiLCJmaWx0ZXIiLCJzdG9yYWdlSXRlbSIsIm1hcCIsImNvbnRlbnRUeXBlIiwiZGVjcnlwdGVkIiwiZGVjcnlwdFBHUE1lc3NhZ2VXaXRoS2V5IiwicHJpdmF0ZUtleUFybW9yIiwicGFzc3BocmFzZSIsInByaXZLZXlPYmoiLCJkZWNyeXB0IiwicHJpbWFyeUtleSIsImlzRGVjcnlwdGVkIiwiZGVjcnlwdE1lc3NhZ2UiLCJjbGVhcnRleHQiLCJjYXRjaCIsImNvbnNvbGUiLCJsb2ciLCJyZXN1bHQiLCJkYXRhIiwiZGV0ZXJtaW5lS2V5VHlwZSIsIlBHUFBVQktFWSIsInByaXZhdGVLZXlzIiwicHJpdmF0ZUtleSIsInRvUHVibGljIiwiYXJtb3IiLCJlcnJvciIsImVuY3J5cHRDbGVhclRleHQiLCJwdWJsaWNLZXlBcm1vciIsIlBHUFB1YmtleSIsImVuY3J5cHRNZXNzYWdlIiwiZW5jcnlwdGVkdHh0Iiwib3B0aW9ucyIsInB1YmxpY0tleXMiLCJlbmNyeXB0IiwiY2lwaGVydGV4dCIsImVuY3J5cHRDbGVhcnRleHRNdWx0aSIsInN0b3JhZ2VBcnIiLCJlbmNyeXB0ZWRNc2dzIiwiaWR4IiwiZW5jcnlwdGVkIiwic2F2ZVBHUFByaXZrZXkiLCJQR1BrZXlBcm1vciIsIlBHUGtleSIsInNldEl0ZW0iLCJ1c2VycyIsInVzZXJJZCIsInVzZXJpZCIsInByb2Nlc3MiLCJzZXRJbW1lZGlhdGUiLCJzYXZlUEdQUHVia2V5IiwiZXhpc3RpbmdLZXkiLCJleGlzdGluZ0tleVR5cGUiLCJub3RDbGVhcnRleHQiLCJyb290Iiwid2luZG93IiwiZ2xvYmFsIiwicmVxdWlyZSIsImFyZyIsInNsaWNlIiwibW9kIiwicGF0aCIsImV4cG9ydHMiLCJzcGxpdCIsInRvU3RyaW5nIiwicmVwbGFjZSIsImNvbW1vbiIsIm1vZHVsZSIsIlR5cGUiLCJmbnMiLCJmbiIsImlzIiwiYmkiLCJiIiwiQm9vbGVhbiIsIm51bSIsIm4iLCJsaXN0X2lzIiwicGFyc2VGbG9hdCIsIkluZmluaXR5IiwidGV4dCIsInQiLCJpZnkiLCJKU09OIiwic3RyaW5naWZ5IiwicmFuZG9tIiwibCIsImMiLCJzIiwiY2hhckF0IiwiTWF0aCIsImZsb29yIiwibWF0Y2giLCJvIiwiciIsIm9iaiIsImhhcyIsInRvTG93ZXJDYXNlIiwibGlzdCIsIm0iLCJpbmRleE9mIiwiZnV6enkiLCJmIiwiQXJyYXkiLCJzbGl0IiwicHJvdG90eXBlIiwic29ydCIsImsiLCJBIiwiQiIsIl8iLCJvYmpfbWFwIiwiaW5kZXgiLCJPYmplY3QiLCJjb25zdHJ1Y3RvciIsImNhbGwiLCJwdXQiLCJ2IiwiaGFzT3duUHJvcGVydHkiLCJkZWwiLCJhcyIsInUiLCJvYmpfaXMiLCJwYXJzZSIsImUiLCJvYmpfaGFzIiwidG8iLCJmcm9tIiwiY29weSIsImVtcHR5IiwiYXJndW1lbnRzIiwieCIsImxsIiwibGxlIiwiZm5faXMiLCJpaSIsInRpbWUiLCJEYXRlIiwiZ2V0VGltZSIsIm9udG8iLCJ0YWciLCJuZXh0IiwiRnVuY3Rpb24iLCJiZSIsIm9mZiIsInRoZSIsImxhc3QiLCJiYWNrIiwib24iLCJPbiIsIkNoYWluIiwiY3JlYXRlIiwib3B0IiwiaWQiLCJyaWQiLCJ1dWlkIiwic3R1biIsImNoYWluIiwiZXYiLCJza2lwIiwiY2IiLCJyZXMiLCJxdWV1ZSIsInRtcCIsInEiLCJhY3QiLCJhdCIsImN0eCIsImFzayIsInNjb3BlIiwiYWNrIiwicmVwbHkiLCJvbnMiLCJldmVudCIsIkd1biIsImlucHV0IiwiZW1pdCIsImFwcGx5IiwiY29uY2F0IiwiZ3VuIiwic291bCIsInN0YXRlIiwid2FpdGluZyIsIndoZW4iLCJzb29uZXN0Iiwic2V0IiwiZnV0dXJlIiwibm93IiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsImNoZWNrIiwiZWFjaCIsIndhaXQiLCJIQU0iLCJtYWNoaW5lU3RhdGUiLCJpbmNvbWluZ1N0YXRlIiwiY3VycmVudFN0YXRlIiwiaW5jb21pbmdWYWx1ZSIsImN1cnJlbnRWYWx1ZSIsImRlZmVyIiwiaGlzdG9yaWNhbCIsImNvbnZlcmdlIiwiaW5jb21pbmciLCJMZXhpY2FsIiwiY3VycmVudCIsInVuZGVmaW5lZCIsIlZhbCIsInRleHRfaXMiLCJiaV9pcyIsIm51bV9pcyIsInJlbCIsInJlbF8iLCJvYmpfcHV0IiwiTm9kZSIsInNvdWxfIiwidGV4dF9yYW5kb20iLCJub2RlIiwib2JqX2RlbCIsIlN0YXRlIiwicGVyZiIsInN0YXJ0IiwiTiIsImRyaWZ0IiwiRCIsInBlcmZvcm1hbmNlIiwidGltaW5nIiwibmF2aWdhdGlvblN0YXJ0IiwiTl8iLCJvYmpfYXMiLCJ2YWwiLCJvYmpfY29weSIsIkdyYXBoIiwiZyIsIm9ial9lbXB0eSIsIm5mIiwiZW52IiwiZ3JhcGgiLCJzZWVuIiwidmFsaWQiLCJwcmV2IiwiaW52YWxpZCIsImpvaW4iLCJhcnIiLCJEdXAiLCJjYWNoZSIsInRyYWNrIiwiZ2MiLCJkZSIsIm9sZGVzdCIsIm1heEFnZSIsIm1pbiIsImRvbmUiLCJlbGFwc2VkIiwibmV4dEdDIiwidmVyc2lvbiIsInRvSlNPTiIsImR1cCIsInNjaGVkdWxlIiwiZmllbGQiLCJ2YWx1ZSIsIm9uY2UiLCJjYXQiLCJjb2F0Iiwib2JqX3RvIiwiZ2V0IiwibWFjaGluZSIsInZlcmlmeSIsIm1lcmdlIiwiZGlmZiIsInZlcnRleCIsIndhcyIsImtub3duIiwicmVmIiwiX3NvdWwiLCJfZmllbGQiLCJob3ciLCJwZWVycyIsInVybCIsIndzYyIsInByb3RvY29scyIsInJlbF9pcyIsImRlYnVnIiwidyIsInllcyIsIm91dHB1dCIsInN5bnRoIiwicHJveHkiLCJjaGFuZ2UiLCJlY2hvIiwibm90IiwicmVsYXRlIiwibm9kZV8iLCJyZXZlcmIiLCJ2aWEiLCJ1c2UiLCJvdXQiLCJjYXAiLCJub29wIiwiYW55IiwiYmF0Y2giLCJubyIsImlpZmUiLCJtZXRhIiwiX18iLCJ1bmlvbiIsInN0YXRlX2lzIiwiY3MiLCJpdiIsImN2IiwidmFsX2lzIiwic3RhdGVfaWZ5IiwiZGVsdGEiLCJzeW50aF8iLCJub2RlX3NvdWwiLCJub2RlX2lzIiwibm9kZV9pZnkiLCJlYXMiLCJzdWJzIiwiYmluZCIsIm9rIiwiYXN5bmMiLCJvdWdodCIsIm5lZWQiLCJpbXBsZW1lbnQiLCJmaWVsZHMiLCJuXyIsIml0ZW0iLCJzdG9yZSIsInJlbW92ZUl0ZW0iLCJkaXJ0eSIsImNvdW50IiwibWF4IiwicHJlZml4Iiwic2F2ZSIsImFsbCIsImxleCIsIldlYlNvY2tldCIsIndlYmtpdFdlYlNvY2tldCIsIm1veldlYlNvY2tldCIsIndzcCIsInVkcmFpbiIsInNlbmQiLCJwZWVyIiwibXNnIiwid2lyZSIsIm9wZW4iLCJyZWFkeVN0YXRlIiwiT1BFTiIsInJlY2VpdmUiLCJib2R5Iiwib25jbG9zZSIsInJlY29ubmVjdCIsIm9uZXJyb3IiLCJjb2RlIiwib25vcGVuIiwib25tZXNzYWdlIiwiUmViZWxSb3V0ZXIiLCJfcHJlZml4IiwicHJldmlvdXNQYXRoIiwiYmFzZVBhdGgiLCJnZXRBdHRyaWJ1dGUiLCJpbmhlcml0IiwiJGVsZW1lbnQiLCJwYXJlbnROb2RlIiwibm9kZU5hbWUiLCJyb3V0ZSIsInJvdXRlcyIsIiRjaGlsZHJlbiIsImNoaWxkcmVuIiwiJGNoaWxkIiwiJHRlbXBsYXRlIiwiaW5uZXJIVE1MIiwic2hhZG93Um9vdCIsImNyZWF0ZVNoYWRvd1Jvb3QiLCJhbmltYXRpb24iLCJpbml0QW5pbWF0aW9uIiwicmVuZGVyIiwicGF0aENoYW5nZSIsImlzQmFjayIsImNsYXNzTGlzdCIsImFkZCIsInJlbW92ZSIsIm9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsImFkZGVkTm9kZXMiLCJvdGhlckNoaWxkcmVuIiwiZ2V0T3RoZXJDaGlsZHJlbiIsImZvckVhY2giLCJjaGlsZCIsImFuaW1hdGlvbkVuZCIsInRhcmdldCIsImNsYXNzTmFtZSIsInJlbW92ZUNoaWxkIiwiYWRkRXZlbnRMaXN0ZW5lciIsIm9ic2VydmUiLCJjaGlsZExpc3QiLCJnZXRQYXRoRnJvbVVybCIsInJlZ2V4U3RyaW5nIiwicmVnZXgiLCJSZWdFeHAiLCJ0ZXN0IiwiX3JvdXRlUmVzdWx0IiwiY29tcG9uZW50IiwiJGNvbXBvbmVudCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInBhcmFtcyIsInNldEF0dHJpYnV0ZSIsImFwcGVuZENoaWxkIiwidGVtcGxhdGUiLCJhIiwicmVzdWx0cyIsInF1ZXJ5U3RyaW5nIiwic3Vic3RyIiwicGFydCIsImVxIiwiZGVjb2RlVVJJQ29tcG9uZW50Iiwic3Vic3RyaW5nIiwiQ2xhc3MiLCJuYW1lIiwidmFsaWRFbGVtZW50VGFnIiwiSFRNTEVsZW1lbnQiLCJjbGFzc1RvVGFnIiwiaXNSZWdpc3RlcmVkRWxlbWVudCIsInJlZ2lzdGVyRWxlbWVudCIsImNhbGxiYWNrIiwiY2hhbmdlQ2FsbGJhY2tzIiwiY2hhbmdlSGFuZGxlciIsImxvY2F0aW9uIiwiaHJlZiIsIm9sZFVSTCIsIm9uaGFzaGNoYW5nZSIsInBhcnNlUXVlcnlTdHJpbmciLCJyZSIsImV4ZWMiLCJyZXN1bHRzMiIsIlJlYmVsUm91dGUiLCJSZWJlbERlZmF1bHQiLCJSZWJlbEJhY2tBIiwicHJldmVudERlZmF1bHQiLCJkaXNwYXRjaEV2ZW50IiwiQ3VzdG9tRXZlbnQiLCJoYXNoIiwiSFRNTEFuY2hvckVsZW1lbnQiLCJleHRlbmRzIiwiZ2V0UGFyYW1zRnJvbVVybCIsImhhbmRsZVBvc3QiLCJndW5kYiIsImNvbnRhY3RQYXJ0aWFsIiwiQ29udGFjdFBhZ2UiLCJmcmVzaERlY2tQYXJ0aWFsIiwiRGVja1BhZ2UiLCJjcmVhdGVkQ2FsbGJhY2siLCJxdWVyeVNlbGVjdG9yIiwidGV4dENvbnRlbnQiLCJjbG9uZSIsImltcG9ydE5vZGUiLCJjb2xvck92ZXJyaWRlIiwic3R5bGUiLCJjb2xvciIsImZpbGwiLCJpbmRleFBhcnRpYWwiLCJJbmRleFBhZ2UiLCJjbGllbnRQdWJrZXlGb3JtUGFydGlhbCIsIk1lc3NhZ2VQYWdlIiwicm9hZG1hcFBhcnRpYWwiLCJSb2FkbWFwUGFnZSIsImNhY2hlZFNldFRpbWVvdXQiLCJjYWNoZWRDbGVhclRpbWVvdXQiLCJkZWZhdWx0U2V0VGltb3V0IiwiZGVmYXVsdENsZWFyVGltZW91dCIsInJ1blRpbWVvdXQiLCJmdW4iLCJydW5DbGVhclRpbWVvdXQiLCJtYXJrZXIiLCJkcmFpbmluZyIsImN1cnJlbnRRdWV1ZSIsInF1ZXVlSW5kZXgiLCJjbGVhblVwTmV4dFRpY2siLCJkcmFpblF1ZXVlIiwidGltZW91dCIsImxlbiIsInJ1biIsIm5leHRUaWNrIiwiYXJncyIsIkl0ZW0iLCJhcnJheSIsInRpdGxlIiwiYnJvd3NlciIsImFyZ3YiLCJ2ZXJzaW9ucyIsImFkZExpc3RlbmVyIiwicmVtb3ZlTGlzdGVuZXIiLCJyZW1vdmVBbGxMaXN0ZW5lcnMiLCJwcmVwZW5kTGlzdGVuZXIiLCJwcmVwZW5kT25jZUxpc3RlbmVyIiwibGlzdGVuZXJzIiwiYmluZGluZyIsImN3ZCIsImNoZGlyIiwiZGlyIiwidW1hc2siLCJldmFsIiwid2VicGFja1BvbHlmaWxsIiwiZGVwcmVjYXRlIiwicGF0aHMiLCJkZWZpbmVQcm9wZXJ0eSIsImVudW1lcmFibGUiLCJub3RQR1BLZXkiLCJub3RQR1BNZXNzYWdlIiwibm90UEdQUHVia2V5IiwicGdwS2V5Iiwibm90VW5kZWZpbmVkIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7O0FDaEVBOzs7OztRQUlnQkEsb0IsR0FBQUEsb0I7O0FBRmhCOztBQUVPLFNBQVNBLG9CQUFULENBQThCQyxPQUE5QixFQUF1QztBQUMxQztBQUNBLFdBQVEsQ0FB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QUFKLENBQVUsbUJBQVYsQ0FBUDtBQUNIO0FBQ0osS0FUTSxDQUFQO0FBVUgsRTs7Ozs7O0FDYkQscWU7Ozs7OztBQ0FBLG0yL0VBQW0yL0Usa0ZBQWtGLHlKQUF5SiwrR0FBK0csK0dBQStHLCtHQUErRywrR0FBK0csK0dBQStHLCtHQUErRywrR0FBK0csK0dBQStHLCtHQUErRyxnSEFBZ0gsK0dBQStHLCtHQUErRywySEFBMkgsOEZBQThGLDhGQUE4Riw4RkFBOEYsOEZBQThGLDhGQUE4Riw4RkFBOEYsOEZBQThGLDhGQUE4Riw4RkFBOEYsK0ZBQStGLDhGQUE4Riw4RkFBOEYsMEhBQTBILDZGQUE2Riw2RkFBNkYsNkZBQTZGLDZGQUE2Riw2RkFBNkYsNkZBQTZGLDZGQUE2Riw2RkFBNkYsNkZBQTZGLDhGQUE4Riw2RkFBNkYsNkZBQTZGLDRIQUE0SCwrRkFBK0YsK0ZBQStGLCtGQUErRiwrRkFBK0YsK0ZBQStGLCtGQUErRiwrRkFBK0YsK0ZBQStGLCtGQUErRixnR0FBZ0csK0ZBQStGLCtGQUErRixvRTs7Ozs7O0FDQS9pcUYsaUM7Ozs7OztBQ0FBLGdIQUFnSCxvRUFBb0UsK0JBQStCLGlDQUFpQyxnQ0FBZ0MseUdBQXlHLGFBQWEscUJBQXFCLG1DQUFtQyxrREFBa0QsMmhCQUEyaEIseUI7Ozs7OztBQ0EvZ0MseW5FIiwiZmlsZSI6InJveWFsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMjIpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDE4YTUxMzNkODhhN2UwN2E0OTgzIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2RldGVybWluZUtleVR5cGV9IGZyb20gJy4vZGV0ZXJtaW5lS2V5VHlwZS5qcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXRlcm1pbmVDb250ZW50VHlwZShjb250ZW50KSB7XG4gICAgLy8gdXNhZ2U6IGRldGVybWluZUNvbnRlbnRUeXBlKGNvbnRlbnQpKG9wZW5wZ3ApLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbiAgICByZXR1cm4gKCFjb250ZW50KSA/XG4gICAgUHJvbWlzZS5yZXNvbHZlKCcnKTpcbiAgICAob3BlbnBncCkgPT4ge1xuICAgICAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBvcGVucGdwJyk6XG4gICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IENMRUFSVEVYVCA9ICdjbGVhcnRleHQnO1xuICAgICAgICAgICAgY29uc3QgUEdQTUVTU0FHRSA9ICdQR1BNZXNzYWdlJztcbiAgICAgICAgICAgIGxldCBwb3NzaWJsZXBncGtleSA9IG9wZW5wZ3Aua2V5LnJlYWRBcm1vcmVkKGNvbnRlbnQpO1xuICAgICAgICAgICAgaWYgKHBvc3NpYmxlcGdwa2V5LmtleXNbMF0pIHtcbiAgICAgICAgICAgICAgICBkZXRlcm1pbmVLZXlUeXBlKGNvbnRlbnQpKG9wZW5wZ3ApXG4gICAgICAgICAgICAgICAgLnRoZW4oKGtleVR5cGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShrZXlUeXBlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbnBncC5tZXNzYWdlLnJlYWRBcm1vcmVkKGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKFBHUE1FU1NBR0UpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKENMRUFSVEVYVCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvZGV0ZXJtaW5lQ29udGVudFR5cGUuanMiLCIndXNlIHN0cmljdCc7XG5pbXBvcnQgbm90VW5kZWZpbmVkIGZyb20gJy4uLy4uL3NyYy9saWIvbm90VW5kZWZpbmVkLmpzJztcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG5vdEVtcHR5KGNvbnRlbnQpIHtcbiAgICByZXR1cm4gbm90VW5kZWZpbmVkKGNvbnRlbnQpXG4gICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZihjb250ZW50ICE9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ2VtcHR5IGNvbnRlbnQnKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSk7XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xpYi9ub3RFbXB0eS5qcyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZyb21TdG9yYWdlKGxvY2FsU3RvcmFnZSkge1xuICAgIC8vIHVzYWdlOiBnZXRGcm9tU3RvcmFnZShsb2NhbFN0b3JhZ2UpKFtrZXldKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpXG4gICAgcmV0dXJuICghbG9jYWxTdG9yYWdlKSA/XG4gICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIGxvY2FsU3RvcmFnZScpOlxuICAgIChpbmRleEtleSkgPT4ge1xuICAgICAgICByZXR1cm4gKCFpbmRleEtleSkgP1xuICAgICAgICAvLyBubyBpbmRleCAtPiByZXR1cm4gZXZlcnl0aGluZ1xuICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxldCBpID0gbG9jYWxTdG9yYWdlLmxlbmd0aFxuICAgICAgICAgICAgICAgIGxldCBrZXlBcnIgPSBbXVxuICAgICAgICAgICAgICAgIHdoaWxlIChpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaSA9IGkgLSAxXG4gICAgICAgICAgICAgICAgICAgIGtleUFyci5wdXNoKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGxvY2FsU3RvcmFnZS5rZXkoaSkpKVxuICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShrZXlBcnIpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk6XG4gICAgICAgIC8vIGluZGV4IHByb3ZpZGVkIC0+IHJldHVybiBvbmVcbiAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGluZGV4S2V5KSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvZ2V0RnJvbVN0b3JhZ2UuanMiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7Z2V0RnJvbVN0b3JhZ2V9IGZyb20gJy4vZ2V0RnJvbVN0b3JhZ2UnO1xuaW1wb3J0IHtkZWNyeXB0UEdQTWVzc2FnZVdpdGhLZXl9IGZyb20gJy4uLy4uL3NyYy9saWIvZGVjcnlwdFBHUE1lc3NhZ2VXaXRoS2V5LmpzJztcbmltcG9ydCB7ZGV0ZXJtaW5lQ29udGVudFR5cGV9IGZyb20gJy4uLy4uL3NyYy9saWIvZGV0ZXJtaW5lQ29udGVudFR5cGUuanMnO1xuXG5jb25zdCBQR1BQUklWS0VZID0gJ1BHUFByaXZrZXknO1xuXG5leHBvcnQgZnVuY3Rpb24gZGVjcnlwdFBHUE1lc3NhZ2Uob3BlbnBncCkge1xuICAgIC8vICB1c2FnZTogZGVjcnlwdFBHUE1lc3NhZ2Uob3BlbnBncCkobG9jYWxTdG9yYWdlKShwYXNzd29yZCkoUEdQTWVzc2FnZUFybW9yKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpXG4gICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBvcGVucGdwJyk6XG4gICAgKGxvY2FsU3RvcmFnZSkgPT4ge1xuICAgICAgICByZXR1cm4gKCFsb2NhbFN0b3JhZ2UpID9cbiAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIGxvY2FsU3RvcmFnZScpOlxuICAgICAgICAocGFzc3dvcmQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoIXBhc3N3b3JkKSA/XG4gICAgICAgICAgICBQcm9taXNlLnJlamVjdChcIkVycm9yOiBtaXNzaW5nIHBhc3N3b3JkXCIpOlxuICAgICAgICAgICAgKFBHUE1lc3NhZ2VBcm1vcikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAoIVBHUE1lc3NhZ2VBcm1vcikgP1xuICAgICAgICAgICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBQR1BNZXNzYWdlQXJtb3InKTpcbiAgICAgICAgICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGdldEZyb21TdG9yYWdlKGxvY2FsU3RvcmFnZSkoKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihzdG9yZUFyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdG9yZUFyclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoc3RvcmFnZUl0ZW0gPT4gKCFzdG9yYWdlSXRlbSkgPyBmYWxzZSA6IHRydWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChzdG9yYWdlSXRlbSA9PiBkZXRlcm1pbmVDb250ZW50VHlwZShzdG9yYWdlSXRlbSkob3BlbnBncClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oY29udGVudFR5cGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRlbnRUeXBlID09PSBQR1BQUklWS0VZKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVjcnlwdFBHUE1lc3NhZ2VXaXRoS2V5KG9wZW5wZ3ApKHBhc3N3b3JkKShzdG9yYWdlSXRlbSkoUEdQTWVzc2FnZUFybW9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGRlY3J5cHRlZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGVjcnlwdGVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvZGVjcnlwdFBHUE1lc3NhZ2UuanMiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWNyeXB0UEdQTWVzc2FnZVdpdGhLZXkob3BlbnBncCkge1xuICAgIHJldHVybiAoIW9wZW5wZ3ApID9cbiAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ21pc3Npbmcgb3BlbnBncCcpKTpcbiAgICAocGFzc3dvcmQpID0+IHtcbiAgICAgICAgcmV0dXJuICghcGFzc3dvcmQpID9cbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdtaXNzaW5nIHBhc3N3b3JkJykpOlxuICAgICAgICAocHJpdmF0ZUtleUFybW9yKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCFwcml2YXRlS2V5QXJtb3IpID9cbiAgICAgICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignbWlzc2luZyBwcml2YXRlS2V5QXJtb3InKSk6XG4gICAgICAgICAgICAoUEdQTWVzc2FnZUFybW9yKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICghUEdQTWVzc2FnZUFybW9yKSA/XG4gICAgICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdtaXNzaW5nIFBHUE1lc3NhZ2VBcm1vcicpKTpcbiAgICAgICAgICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFzc3BocmFzZSA9IGAke3Bhc3N3b3JkfWA7IC8vd2hhdCB0aGUgcHJpdktleSBpcyBlbmNyeXB0ZWQgd2l0aFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByaXZLZXlPYmogPSBvcGVucGdwLmtleS5yZWFkQXJtb3JlZChgJHtwcml2YXRlS2V5QXJtb3J9YCkua2V5c1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaXZLZXlPYmouZGVjcnlwdChwYXNzcGhyYXNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSBvcGVucGdwLm1lc3NhZ2UucmVhZEFybW9yZWQoUEdQTWVzc2FnZUFybW9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcHJpdktleU9iai5wcmltYXJ5S2V5LmlzRGVjcnlwdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ1ByaXZhdGUga2V5IGlzIG5vdCBkZWNyeXB0ZWQnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghb3BlbnBncC5kZWNyeXB0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5wZ3AuZGVjcnlwdE1lc3NhZ2UocHJpdktleU9iaiwgbWVzc2FnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oY2xlYXJ0ZXh0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY2xlYXJ0ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlamVjdChlcnIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5wZ3AuZGVjcnlwdCh7ICdtZXNzYWdlJzogbWVzc2FnZSwgJ3ByaXZhdGVLZXknOiBwcml2S2V5T2JqIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQuZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0LmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ2JhZCBwcml2YXRlS2V5QXJtb3InKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xpYi9kZWNyeXB0UEdQTWVzc2FnZVdpdGhLZXkuanMiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXRlcm1pbmVLZXlUeXBlKGNvbnRlbnQpIHtcbiAgICByZXR1cm4gKCFjb250ZW50KSA/XG4gICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIHBncEtleScpOlxuICAgIChvcGVucGdwKSA9PiB7XG4gICAgICAgIHJldHVybiAoIW9wZW5wZ3ApID9cbiAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIG9wZW5wZ3AnKTpcbiAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgUEdQUFVCS0VZID0gJ1BHUFB1YmtleSc7XG4gICAgICAgICAgICBjb25zdCBQR1BQUklWS0VZID0gJ1BHUFByaXZrZXknO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsZXQgcHJpdmF0ZUtleXMgPSBvcGVucGdwLmtleS5yZWFkQXJtb3JlZChjb250ZW50KVxuICAgICAgICAgICAgICAgIGxldCBwcml2YXRlS2V5ID0gcHJpdmF0ZUtleXMua2V5c1swXVxuICAgICAgICAgICAgICAgIGlmIChwcml2YXRlS2V5LnRvUHVibGljKCkuYXJtb3IoKSAhPT0gcHJpdmF0ZUtleS5hcm1vcigpICkge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKFBHUFBSSVZLRVkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoUEdQUFVCS0VZKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xpYi9kZXRlcm1pbmVLZXlUeXBlLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgZnVuY3Rpb24gZW5jcnlwdENsZWFyVGV4dChvcGVucGdwKSB7XG4gICAgLy8gdXNhZ2U6IGVuY3J5cHRDbGVhclRleHQob3BlbnBncCkocHVibGljS2V5QXJtb3IpKGNsZWFydGV4dCkudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgIHJldHVybiAoIW9wZW5wZ3ApID9cbiAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgIChwdWJsaWNLZXlBcm1vcikgPT4ge1xuICAgICAgICByZXR1cm4gKCFwdWJsaWNLZXlBcm1vcikgP1xuICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgcHVibGljIGtleScpOlxuICAgICAgICAoY2xlYXJ0ZXh0KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCFjbGVhcnRleHQpID9cbiAgICAgICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBjbGVhcnRleHQnKTpcbiAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgUEdQUHVia2V5ID0gb3BlbnBncC5rZXkucmVhZEFybW9yZWQocHVibGljS2V5QXJtb3IpXG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICB0aGUgbGF0ZXN0IG9wZW5wZ3AgMi41LjQgYnJlYWtzIG9uIG91ciBjb25zb2xlIG9ubHkgdG9vbHMuXG4gICAgICAgICAgICAgICAgYnV0IGl0J3MgMTB4IGZhc3RlciBvbiBicm93c2VycyBzbyBUSEUgTkVXIENPREUgU1RBWVMgSU4uXG4gICAgICAgICAgICAgICAgYmVsb3cgd2UgZXhwbG9pdCBmYWxsYmFjayB0byBvbGQgc2xvdyBlcnJvciBmcmVlIG9wZW5wZ3AgMS42LjJcbiAgICAgICAgICAgICAgICBieSBhZGFwdGluZyBvbiB0aGUgZmx5IHRvIGEgYnJlYWtpbmcgY2hhbmdlXG4gICAgICAgICAgICAgICAgKG9wZW5wZ3AgYnVnIF4xLjYuMiAtPiAyLjUuNCBtYWRlIHVzIGRvIGl0KVxuICAgICAgICAgICAgICAgIHJlZmFjdG9yOiByZW1vdmUgdHJ5IHNlY3Rpb24gb2YgdHJ5Y2F0Y2gga2VlcCBjYXRjaCBzZWN0aW9uXG4gICAgICAgICAgICAgICAgYnkgYWxsIG1lYW5zIHJlZmFjdG9yIGlmIG5vdCBicm9rZW4gYWZ0ZXIgb3BlbnBncCAyLjUuNFxuICAgICAgICAgICAgICAgIGlmIHlvdSBjaGVjayBvcGVucGdwIHBsZWFzZSBidW1wIGZhaWxpbmcgdmVyc2lvbiAgXl5eXl5cbiAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHdvcmtzIG9ubHkgb24gb3BlbnBncCB2ZXJzaW9uIDEuNi4yXG4gICAgICAgICAgICAgICAgICAgIG9wZW5wZ3AuZW5jcnlwdE1lc3NhZ2UoUEdQUHVia2V5LmtleXNbMF0sIGNsZWFydGV4dClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZW5jcnlwdGVkdHh0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZW5jcnlwdGVkdHh0KVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKVxuICAgICAgICAgICAgICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHdvcmtzIG9uIG9wZW5wZ3AgdmVyc2lvbiAyLjUuNFxuICAgICAgICAgICAgICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGNsZWFydGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1YmxpY0tleXM6IG9wZW5wZ3Aua2V5LnJlYWRBcm1vcmVkKHB1YmxpY0tleUFybW9yKS5rZXlzLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJtb3I6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgb3BlbnBncC5lbmNyeXB0KG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChjaXBoZXJ0ZXh0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNpcGhlcnRleHQuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGliL2VuY3J5cHRDbGVhclRleHQuanMiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7Z2V0RnJvbVN0b3JhZ2V9IGZyb20gJy4vZ2V0RnJvbVN0b3JhZ2UnO1xuaW1wb3J0IHtkZXRlcm1pbmVDb250ZW50VHlwZX0gZnJvbSAnLi9kZXRlcm1pbmVDb250ZW50VHlwZSc7XG5pbXBvcnQge2VuY3J5cHRDbGVhclRleHR9IGZyb20gJy4vZW5jcnlwdENsZWFyVGV4dCc7XG5cbmNvbnN0IFBHUFBVQktFWSA9ICdQR1BQdWJrZXknO1xuXG5leHBvcnQgZnVuY3Rpb24gZW5jcnlwdENsZWFydGV4dE11bHRpKGNvbnRlbnQpIHtcbiAgICAvLyB1c2FnZTogZW5jcnlwdENsZWFydGV4dE11bHRpKGNvbnRlbnQpKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSkudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgIHJldHVybiAoIWNvbnRlbnQpID9cbiAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgY29udGVudCcpOlxuICAgIChvcGVucGdwKSA9PiB7XG4gICAgICAgIHJldHVybiAoIW9wZW5wZ3ApID9cbiAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIG9wZW5wZ3AnKTpcbiAgICAgICAgKGxvY2FsU3RvcmFnZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICghbG9jYWxTdG9yYWdlKSA/XG4gICAgICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgbG9jYWxTdG9yYWdlJyk6XG4gICAgICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0RnJvbVN0b3JhZ2UobG9jYWxTdG9yYWdlKSgpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChzdG9yYWdlQXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2xldCBwdWJsaWNLZXlBcnIgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBlbmNyeXB0ZWRNc2dzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaSA9IHN0b3JhZ2VBcnIubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGlkeCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9yYWdlQXJyXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKChzdG9yYWdlSXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RvcmFnZUl0ZW07XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihzdG9yYWdlSXRlbSA9PiAoIXN0b3JhZ2VJdGVtKSA/IGZhbHNlIDogdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKHN0b3JhZ2VJdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV0ZXJtaW5lQ29udGVudFR5cGUoc3RvcmFnZUl0ZW0pKG9wZW5wZ3ApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGNvbnRlbnRUeXBlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50VHlwZSA9PT0gUEdQUFVCS0VZKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmNyeXB0Q2xlYXJUZXh0KG9wZW5wZ3ApKHN0b3JhZ2VJdGVtKShjb250ZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGVuY3J5cHRlZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuY3J5cHRlZE1zZ3NbaWR4XSA9IGVuY3J5cHRlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZHgrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGVuY3J5cHRlZE1zZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0IChuZXcgRXJyb3IgKGVycikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGliL2VuY3J5cHRDbGVhcnRleHRNdWx0aS5qcyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVQR1BQcml2a2V5KFBHUGtleUFybW9yKSB7XG4gICAgLy8gc2F2ZSBwcml2YXRlIGtleSB0byBzdG9yYWdlIG5vIHF1ZXN0aW9ucyBhc2tlZFxuICAgIC8vIHVzYWdlOiBzYXZlUEdQUHJpdmtleShjb250ZW50KShvcGVucGdwKShsb2NhbFN0b3JhZ2UpLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbiAgICByZXR1cm4gKCFQR1BrZXlBcm1vcikgP1xuICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBQR1BrZXlBcm1vcicpOlxuICAgIChvcGVucGdwKSA9PiB7XG4gICAgICAgIHJldHVybiAoIW9wZW5wZ3ApID9cbiAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIG9wZW5wZ3AnKTpcbiAgICAgICAgKGxvY2FsU3RvcmFnZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICghbG9jYWxTdG9yYWdlKSA/XG4gICAgICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgbG9jYWxTdG9yYWdlJyk6XG4gICAgICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IFBHUGtleSA9IG9wZW5wZ3Aua2V5LnJlYWRBcm1vcmVkKFBHUGtleUFybW9yKTtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oUEdQa2V5LmtleXNbMF0udXNlcnNbMF0udXNlcklkLnVzZXJpZCwgUEdQa2V5QXJtb3IpXG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3Muc2V0SW1tZWRpYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShgcHJpdmF0ZSBwZ3Aga2V5IHNhdmVkIDwtICR7UEdQa2V5LmtleXNbMF0udXNlcnNbMF0udXNlcklkLnVzZXJpZH1gKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvc2F2ZVBHUFByaXZrZXkuanMiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7Z2V0RnJvbVN0b3JhZ2V9IGZyb20gJy4vZ2V0RnJvbVN0b3JhZ2UnO1xuaW1wb3J0IHtkZXRlcm1pbmVDb250ZW50VHlwZX0gZnJvbSAnLi9kZXRlcm1pbmVDb250ZW50VHlwZSc7XG5pbXBvcnQgbm90RW1wdHkgZnJvbSAnLi4vLi4vc3JjL2xpYi9ub3RFbXB0eS5qcyc7XG5pbXBvcnQgbm90Q2xlYXJ0ZXh0IGZyb20gJy4uLy4uL3NyYy9saWIvbm90Q2xlYXJ0ZXh0LmpzJztcbmltcG9ydCBub3RQR1BQcml2a2V5IGZyb20gJy4uLy4uL3NyYy9saWIvbm90UEdQUHJpdmtleS5qcyc7XG5pbXBvcnQgbm90UEdQTWVzc2FnZSBmcm9tICcuLi8uLi9zcmMvbGliL25vdFBHUE1lc3NhZ2UuanMnO1xuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZVBHUFB1YmtleShQR1BrZXlBcm1vcikge1xuICAgIC8vIHNhdmUgcHVibGljIGtleSB0byBzdG9yYWdlIG9ubHkgaWYgaXQgZG9lc24ndCBvdmVyd3JpdGUgYSBwcml2YXRlIGtleVxuICAgIC8vIHVzYWdlOiBzYXZlUEdQUHVia2V5KGNvbnRlbnQpKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSkudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgIHJldHVybiAoIVBHUGtleUFybW9yKSA/XG4gICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIFBHUGtleUFybW9yJyk6XG4gICAgKG9wZW5wZ3ApID0+IHtcbiAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgICAgICAobG9jYWxTdG9yYWdlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCFsb2NhbFN0b3JhZ2UpID9cbiAgICAgICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBsb2NhbFN0b3JhZ2UnKTpcbiAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgUEdQa2V5ID0gb3BlbnBncC5rZXkucmVhZEFybW9yZWQoUEdQa2V5QXJtb3IpO1xuICAgICAgICAgICAgICAgIG5vdEVtcHR5KFBHUGtleUFybW9yKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vdENsZWFydGV4dChQR1BrZXlBcm1vcikob3BlbnBncClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vdFBHUFByaXZrZXkoUEdQa2V5QXJtb3IpKG9wZW5wZ3ApXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBub3RQR1BNZXNzYWdlKFBHUGtleUFybW9yKShvcGVucGdwKVxuICAgICAgICAgICAgICAgICAgICAvLyBmaXhtZT8gdGhyb3dzIENhbm5vdCByZWFkIHByb3BlcnR5IFxcJ3VzZXJzXFwnIG9mIHVuZGVmaW5lZCBpbnN0ZWFkIG9mIFwibm90IFBHUE1lc3NhZ2UgY29udGVudFwiXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXRGcm9tU3RvcmFnZShsb2NhbFN0b3JhZ2UpKFBHUGtleS5rZXlzWzBdLnVzZXJzWzBdLnVzZXJJZC51c2VyaWQpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGV4aXN0aW5nS2V5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoIWV4aXN0aW5nS2V5KSA/XG4gICAgICAgICAgICAgICAgICAgICAgICBQcm9taXNlLnJlc29sdmUoJ25vbmUnKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXRlcm1pbmVDb250ZW50VHlwZShleGlzdGluZ0tleSkob3BlbnBncCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGV4aXN0aW5nS2V5VHlwZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RpbmdLZXlUeXBlID09PSAnUEdQUHJpdmtleScpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoJ3B1YmtleSBpZ25vcmVkIFgtIGF0dGVtcHRlZCBvdmVyd3JpdGUgcHJpdmtleScpXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFBHUGtleS5rZXlzWzBdLnVzZXJzWzBdLnVzZXJJZC51c2VyaWQsIFBHUGtleUFybW9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYHB1YmxpYyBwZ3Aga2V5IHNhdmVkIDwtICR7UEdQa2V5LmtleXNbMF0udXNlcnNbMF0udXNlcklkLnVzZXJpZH1gKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlamVjdChlcnIpKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvc2F2ZVBHUFB1YmtleS5qcyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IG5vdEVtcHR5IGZyb20gJy4uLy4uL3NyYy9saWIvbm90RW1wdHkuanMnO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbm90Q2xlYXJ0ZXh0KGNvbnRlbnQpIHtcbiAgICByZXR1cm4gKCFjb250ZW50KSA/XG4gICAgKCkgPT4gbm90RW1wdHkoY29udGVudCk6XG4gICAgKG9wZW5wZ3ApID0+IHtcbiAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ21pc3Npbmcgb3BlbnBncCcpKTpcbiAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgbGV0IHBvc3NpYmxlcGdwa2V5ID0gb3BlbnBncC5rZXkucmVhZEFybW9yZWQoY29udGVudCk7XG4gICAgICAgICAgICBpZiAocG9zc2libGVwZ3BrZXkua2V5c1swXSkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoY29udGVudClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbnBncC5tZXNzYWdlLnJlYWRBcm1vcmVkKGNvbnRlbnQpXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY29udGVudCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoJ2NsZWFydGV4dCBjb250ZW50JykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xpYi9ub3RDbGVhcnRleHQuanMiLCI7KGZ1bmN0aW9uKCl7XHJcblxyXG5cdC8qIFVOQlVJTEQgKi9cclxuXHR2YXIgcm9vdDtcclxuXHRpZih0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKXsgcm9vdCA9IHdpbmRvdyB9XHJcblx0aWYodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIil7IHJvb3QgPSBnbG9iYWwgfVxyXG5cdHJvb3QgPSByb290IHx8IHt9O1xyXG5cdHZhciBjb25zb2xlID0gcm9vdC5jb25zb2xlIHx8IHtsb2c6IGZ1bmN0aW9uKCl7fX07XHJcblx0ZnVuY3Rpb24gcmVxdWlyZShhcmcpe1xyXG5cdFx0cmV0dXJuIGFyZy5zbGljZT8gcmVxdWlyZVtyZXNvbHZlKGFyZyldIDogZnVuY3Rpb24obW9kLCBwYXRoKXtcclxuXHRcdFx0YXJnKG1vZCA9IHtleHBvcnRzOiB7fX0pO1xyXG5cdFx0XHRyZXF1aXJlW3Jlc29sdmUocGF0aCldID0gbW9kLmV4cG9ydHM7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiByZXNvbHZlKHBhdGgpe1xyXG5cdFx0XHRyZXR1cm4gcGF0aC5zcGxpdCgnLycpLnNsaWNlKC0xKS50b1N0cmluZygpLnJlcGxhY2UoJy5qcycsJycpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRpZih0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiKXsgdmFyIGNvbW1vbiA9IG1vZHVsZSB9XHJcblx0LyogVU5CVUlMRCAqL1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0Ly8gR2VuZXJpYyBqYXZhc2NyaXB0IHV0aWxpdGllcy5cclxuXHRcdHZhciBUeXBlID0ge307XHJcblx0XHQvL1R5cGUuZm5zID0gVHlwZS5mbiA9IHtpczogZnVuY3Rpb24oZm4peyByZXR1cm4gKCEhZm4gJiYgZm4gaW5zdGFuY2VvZiBGdW5jdGlvbikgfX1cclxuXHRcdFR5cGUuZm5zID0gVHlwZS5mbiA9IHtpczogZnVuY3Rpb24oZm4peyByZXR1cm4gKCEhZm4gJiYgJ2Z1bmN0aW9uJyA9PSB0eXBlb2YgZm4pIH19XHJcblx0XHRUeXBlLmJpID0ge2lzOiBmdW5jdGlvbihiKXsgcmV0dXJuIChiIGluc3RhbmNlb2YgQm9vbGVhbiB8fCB0eXBlb2YgYiA9PSAnYm9vbGVhbicpIH19XHJcblx0XHRUeXBlLm51bSA9IHtpczogZnVuY3Rpb24obil7IHJldHVybiAhbGlzdF9pcyhuKSAmJiAoKG4gLSBwYXJzZUZsb2F0KG4pICsgMSkgPj0gMCB8fCBJbmZpbml0eSA9PT0gbiB8fCAtSW5maW5pdHkgPT09IG4pIH19XHJcblx0XHRUeXBlLnRleHQgPSB7aXM6IGZ1bmN0aW9uKHQpeyByZXR1cm4gKHR5cGVvZiB0ID09ICdzdHJpbmcnKSB9fVxyXG5cdFx0VHlwZS50ZXh0LmlmeSA9IGZ1bmN0aW9uKHQpe1xyXG5cdFx0XHRpZihUeXBlLnRleHQuaXModCkpeyByZXR1cm4gdCB9XHJcblx0XHRcdGlmKHR5cGVvZiBKU09OICE9PSBcInVuZGVmaW5lZFwiKXsgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHQpIH1cclxuXHRcdFx0cmV0dXJuICh0ICYmIHQudG9TdHJpbmcpPyB0LnRvU3RyaW5nKCkgOiB0O1xyXG5cdFx0fVxyXG5cdFx0VHlwZS50ZXh0LnJhbmRvbSA9IGZ1bmN0aW9uKGwsIGMpe1xyXG5cdFx0XHR2YXIgcyA9ICcnO1xyXG5cdFx0XHRsID0gbCB8fCAyNDsgLy8geW91IGFyZSBub3QgZ29pbmcgdG8gbWFrZSBhIDAgbGVuZ3RoIHJhbmRvbSBudW1iZXIsIHNvIG5vIG5lZWQgdG8gY2hlY2sgdHlwZVxyXG5cdFx0XHRjID0gYyB8fCAnMDEyMzQ1Njc4OUFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eic7XHJcblx0XHRcdHdoaWxlKGwgPiAwKXsgcyArPSBjLmNoYXJBdChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjLmxlbmd0aCkpOyBsLS0gfVxyXG5cdFx0XHRyZXR1cm4gcztcclxuXHRcdH1cclxuXHRcdFR5cGUudGV4dC5tYXRjaCA9IGZ1bmN0aW9uKHQsIG8peyB2YXIgciA9IGZhbHNlO1xyXG5cdFx0XHR0ID0gdCB8fCAnJztcclxuXHRcdFx0byA9IFR5cGUudGV4dC5pcyhvKT8geyc9Jzogb30gOiBvIHx8IHt9OyAvLyB7J34nLCAnPScsICcqJywgJzwnLCAnPicsICcrJywgJy0nLCAnPycsICchJ30gLy8gaWdub3JlIGNhc2UsIGV4YWN0bHkgZXF1YWwsIGFueXRoaW5nIGFmdGVyLCBsZXhpY2FsbHkgbGFyZ2VyLCBsZXhpY2FsbHkgbGVzc2VyLCBhZGRlZCBpbiwgc3VidGFjdGVkIGZyb20sIHF1ZXN0aW9uYWJsZSBmdXp6eSBtYXRjaCwgYW5kIGVuZHMgd2l0aC5cclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJ34nKSl7IHQgPSB0LnRvTG93ZXJDYXNlKCk7IG9bJz0nXSA9IChvWyc9J10gfHwgb1snfiddKS50b0xvd2VyQ2FzZSgpIH1cclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJz0nKSl7IHJldHVybiB0ID09PSBvWyc9J10gfVxyXG5cdFx0XHRpZihUeXBlLm9iai5oYXMobywnKicpKXsgaWYodC5zbGljZSgwLCBvWycqJ10ubGVuZ3RoKSA9PT0gb1snKiddKXsgciA9IHRydWU7IHQgPSB0LnNsaWNlKG9bJyonXS5sZW5ndGgpIH0gZWxzZSB7IHJldHVybiBmYWxzZSB9fVxyXG5cdFx0XHRpZihUeXBlLm9iai5oYXMobywnIScpKXsgaWYodC5zbGljZSgtb1snISddLmxlbmd0aCkgPT09IG9bJyEnXSl7IHIgPSB0cnVlIH0gZWxzZSB7IHJldHVybiBmYWxzZSB9fVxyXG5cdFx0XHRpZihUeXBlLm9iai5oYXMobywnKycpKXtcclxuXHRcdFx0XHRpZihUeXBlLmxpc3QubWFwKFR5cGUubGlzdC5pcyhvWycrJ10pPyBvWycrJ10gOiBbb1snKyddXSwgZnVuY3Rpb24obSl7XHJcblx0XHRcdFx0XHRpZih0LmluZGV4T2YobSkgPj0gMCl7IHIgPSB0cnVlIH0gZWxzZSB7IHJldHVybiB0cnVlIH1cclxuXHRcdFx0XHR9KSl7IHJldHVybiBmYWxzZSB9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJy0nKSl7XHJcblx0XHRcdFx0aWYoVHlwZS5saXN0Lm1hcChUeXBlLmxpc3QuaXMob1snLSddKT8gb1snLSddIDogW29bJy0nXV0sIGZ1bmN0aW9uKG0pe1xyXG5cdFx0XHRcdFx0aWYodC5pbmRleE9mKG0pIDwgMCl7IHIgPSB0cnVlIH0gZWxzZSB7IHJldHVybiB0cnVlIH1cclxuXHRcdFx0XHR9KSl7IHJldHVybiBmYWxzZSB9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJz4nKSl7IGlmKHQgPiBvWyc+J10peyByID0gdHJ1ZSB9IGVsc2UgeyByZXR1cm4gZmFsc2UgfX1cclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJzwnKSl7IGlmKHQgPCBvWyc8J10peyByID0gdHJ1ZSB9IGVsc2UgeyByZXR1cm4gZmFsc2UgfX1cclxuXHRcdFx0ZnVuY3Rpb24gZnV6enkodCxmKXsgdmFyIG4gPSAtMSwgaSA9IDAsIGM7IGZvcig7YyA9IGZbaSsrXTspeyBpZighfihuID0gdC5pbmRleE9mKGMsIG4rMSkpKXsgcmV0dXJuIGZhbHNlIH19IHJldHVybiB0cnVlIH0gLy8gdmlhIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvOTIwNjAxMy9qYXZhc2NyaXB0LWZ1enp5LXNlYXJjaFxyXG5cdFx0XHRpZihUeXBlLm9iai5oYXMobywnPycpKXsgaWYoZnV6enkodCwgb1snPyddKSl7IHIgPSB0cnVlIH0gZWxzZSB7IHJldHVybiBmYWxzZSB9fSAvLyBjaGFuZ2UgbmFtZSFcclxuXHRcdFx0cmV0dXJuIHI7XHJcblx0XHR9XHJcblx0XHRUeXBlLmxpc3QgPSB7aXM6IGZ1bmN0aW9uKGwpeyByZXR1cm4gKGwgaW5zdGFuY2VvZiBBcnJheSkgfX1cclxuXHRcdFR5cGUubGlzdC5zbGl0ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xyXG5cdFx0VHlwZS5saXN0LnNvcnQgPSBmdW5jdGlvbihrKXsgLy8gY3JlYXRlcyBhIG5ldyBzb3J0IGZ1bmN0aW9uIGJhc2VkIG9mZiBzb21lIGZpZWxkXHJcblx0XHRcdHJldHVybiBmdW5jdGlvbihBLEIpe1xyXG5cdFx0XHRcdGlmKCFBIHx8ICFCKXsgcmV0dXJuIDAgfSBBID0gQVtrXTsgQiA9IEJba107XHJcblx0XHRcdFx0aWYoQSA8IEIpeyByZXR1cm4gLTEgfWVsc2UgaWYoQSA+IEIpeyByZXR1cm4gMSB9XHJcblx0XHRcdFx0ZWxzZSB7IHJldHVybiAwIH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0VHlwZS5saXN0Lm1hcCA9IGZ1bmN0aW9uKGwsIGMsIF8peyByZXR1cm4gb2JqX21hcChsLCBjLCBfKSB9XHJcblx0XHRUeXBlLmxpc3QuaW5kZXggPSAxOyAvLyBjaGFuZ2UgdGhpcyB0byAwIGlmIHlvdSB3YW50IG5vbi1sb2dpY2FsLCBub24tbWF0aGVtYXRpY2FsLCBub24tbWF0cml4LCBub24tY29udmVuaWVudCBhcnJheSBub3RhdGlvblxyXG5cdFx0VHlwZS5vYmogPSB7aXM6IGZ1bmN0aW9uKG8peyByZXR1cm4gbz8gKG8gaW5zdGFuY2VvZiBPYmplY3QgJiYgby5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykubWF0Y2goL15cXFtvYmplY3QgKFxcdyspXFxdJC8pWzFdID09PSAnT2JqZWN0JyA6IGZhbHNlIH19XHJcblx0XHRUeXBlLm9iai5wdXQgPSBmdW5jdGlvbihvLCBmLCB2KXsgcmV0dXJuIChvfHx7fSlbZl0gPSB2LCBvIH1cclxuXHRcdFR5cGUub2JqLmhhcyA9IGZ1bmN0aW9uKG8sIGYpeyByZXR1cm4gbyAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgZikgfVxyXG5cdFx0VHlwZS5vYmouZGVsID0gZnVuY3Rpb24obywgayl7XHJcblx0XHRcdGlmKCFvKXsgcmV0dXJuIH1cclxuXHRcdFx0b1trXSA9IG51bGw7XHJcblx0XHRcdGRlbGV0ZSBvW2tdO1xyXG5cdFx0XHRyZXR1cm4gbztcclxuXHRcdH1cclxuXHRcdFR5cGUub2JqLmFzID0gZnVuY3Rpb24obywgZiwgdiwgdSl7IHJldHVybiBvW2ZdID0gb1tmXSB8fCAodSA9PT0gdj8ge30gOiB2KSB9XHJcblx0XHRUeXBlLm9iai5pZnkgPSBmdW5jdGlvbihvKXtcclxuXHRcdFx0aWYob2JqX2lzKG8pKXsgcmV0dXJuIG8gfVxyXG5cdFx0XHR0cnl7byA9IEpTT04ucGFyc2Uobyk7XHJcblx0XHRcdH1jYXRjaChlKXtvPXt9fTtcclxuXHRcdFx0cmV0dXJuIG87XHJcblx0XHR9XHJcblx0XHQ7KGZ1bmN0aW9uKCl7IHZhciB1O1xyXG5cdFx0XHRmdW5jdGlvbiBtYXAodixmKXtcclxuXHRcdFx0XHRpZihvYmpfaGFzKHRoaXMsZikgJiYgdSAhPT0gdGhpc1tmXSl7IHJldHVybiB9XHJcblx0XHRcdFx0dGhpc1tmXSA9IHY7XHJcblx0XHRcdH1cclxuXHRcdFx0VHlwZS5vYmoudG8gPSBmdW5jdGlvbihmcm9tLCB0byl7XHJcblx0XHRcdFx0dG8gPSB0byB8fCB7fTtcclxuXHRcdFx0XHRvYmpfbWFwKGZyb20sIG1hcCwgdG8pO1xyXG5cdFx0XHRcdHJldHVybiB0bztcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdFR5cGUub2JqLmNvcHkgPSBmdW5jdGlvbihvKXsgLy8gYmVjYXVzZSBodHRwOi8vd2ViLmFyY2hpdmUub3JnL3dlYi8yMDE0MDMyODIyNDAyNS9odHRwOi8vanNwZXJmLmNvbS9jbG9uaW5nLWFuLW9iamVjdC8yXHJcblx0XHRcdHJldHVybiAhbz8gbyA6IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkobykpOyAvLyBpcyBzaG9ja2luZ2x5IGZhc3RlciB0aGFuIGFueXRoaW5nIGVsc2UsIGFuZCBvdXIgZGF0YSBoYXMgdG8gYmUgYSBzdWJzZXQgb2YgSlNPTiBhbnl3YXlzIVxyXG5cdFx0fVxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRmdW5jdGlvbiBlbXB0eSh2LGkpeyB2YXIgbiA9IHRoaXMubjtcclxuXHRcdFx0XHRpZihuICYmIChpID09PSBuIHx8IChvYmpfaXMobikgJiYgb2JqX2hhcyhuLCBpKSkpKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRpZihpKXsgcmV0dXJuIHRydWUgfVxyXG5cdFx0XHR9XHJcblx0XHRcdFR5cGUub2JqLmVtcHR5ID0gZnVuY3Rpb24obywgbil7XHJcblx0XHRcdFx0aWYoIW8peyByZXR1cm4gdHJ1ZSB9XHJcblx0XHRcdFx0cmV0dXJuIG9ial9tYXAobyxlbXB0eSx7bjpufSk/IGZhbHNlIDogdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0ZnVuY3Rpb24gdChrLHYpe1xyXG5cdFx0XHRcdGlmKDIgPT09IGFyZ3VtZW50cy5sZW5ndGgpe1xyXG5cdFx0XHRcdFx0dC5yID0gdC5yIHx8IHt9O1xyXG5cdFx0XHRcdFx0dC5yW2tdID0gdjtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9IHQuciA9IHQuciB8fCBbXTtcclxuXHRcdFx0XHR0LnIucHVzaChrKTtcclxuXHRcdFx0fTtcclxuXHRcdFx0dmFyIGtleXMgPSBPYmplY3Qua2V5cztcclxuXHRcdFx0VHlwZS5vYmoubWFwID0gZnVuY3Rpb24obCwgYywgXyl7XHJcblx0XHRcdFx0dmFyIHUsIGkgPSAwLCB4LCByLCBsbCwgbGxlLCBmID0gZm5faXMoYyk7XHJcblx0XHRcdFx0dC5yID0gbnVsbDtcclxuXHRcdFx0XHRpZihrZXlzICYmIG9ial9pcyhsKSl7XHJcblx0XHRcdFx0XHRsbCA9IE9iamVjdC5rZXlzKGwpOyBsbGUgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihsaXN0X2lzKGwpIHx8IGxsKXtcclxuXHRcdFx0XHRcdHggPSAobGwgfHwgbCkubGVuZ3RoO1xyXG5cdFx0XHRcdFx0Zm9yKDtpIDwgeDsgaSsrKXtcclxuXHRcdFx0XHRcdFx0dmFyIGlpID0gKGkgKyBUeXBlLmxpc3QuaW5kZXgpO1xyXG5cdFx0XHRcdFx0XHRpZihmKXtcclxuXHRcdFx0XHRcdFx0XHRyID0gbGxlPyBjLmNhbGwoXyB8fCB0aGlzLCBsW2xsW2ldXSwgbGxbaV0sIHQpIDogYy5jYWxsKF8gfHwgdGhpcywgbFtpXSwgaWksIHQpO1xyXG5cdFx0XHRcdFx0XHRcdGlmKHIgIT09IHUpeyByZXR1cm4gciB9XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Ly9pZihUeXBlLnRlc3QuaXMoYyxsW2ldKSl7IHJldHVybiBpaSB9IC8vIHNob3VsZCBpbXBsZW1lbnQgZGVlcCBlcXVhbGl0eSB0ZXN0aW5nIVxyXG5cdFx0XHRcdFx0XHRcdGlmKGMgPT09IGxbbGxlPyBsbFtpXSA6IGldKXsgcmV0dXJuIGxsPyBsbFtpXSA6IGlpIH0gLy8gdXNlIHRoaXMgZm9yIG5vd1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGZvcihpIGluIGwpe1xyXG5cdFx0XHRcdFx0XHRpZihmKXtcclxuXHRcdFx0XHRcdFx0XHRpZihvYmpfaGFzKGwsaSkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0ciA9IF8/IGMuY2FsbChfLCBsW2ldLCBpLCB0KSA6IGMobFtpXSwgaSwgdCk7XHJcblx0XHRcdFx0XHRcdFx0XHRpZihyICE9PSB1KXsgcmV0dXJuIHIgfVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHQvL2lmKGEudGVzdC5pcyhjLGxbaV0pKXsgcmV0dXJuIGkgfSAvLyBzaG91bGQgaW1wbGVtZW50IGRlZXAgZXF1YWxpdHkgdGVzdGluZyFcclxuXHRcdFx0XHRcdFx0XHRpZihjID09PSBsW2ldKXsgcmV0dXJuIGkgfSAvLyB1c2UgdGhpcyBmb3Igbm93XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGY/IHQuciA6IFR5cGUubGlzdC5pbmRleD8gMCA6IC0xO1xyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0VHlwZS50aW1lID0ge307XHJcblx0XHRUeXBlLnRpbWUuaXMgPSBmdW5jdGlvbih0KXsgcmV0dXJuIHQ/IHQgaW5zdGFuY2VvZiBEYXRlIDogKCtuZXcgRGF0ZSgpLmdldFRpbWUoKSkgfVxyXG5cclxuXHRcdHZhciBmbl9pcyA9IFR5cGUuZm4uaXM7XHJcblx0XHR2YXIgbGlzdF9pcyA9IFR5cGUubGlzdC5pcztcclxuXHRcdHZhciBvYmogPSBUeXBlLm9iaiwgb2JqX2lzID0gb2JqLmlzLCBvYmpfaGFzID0gb2JqLmhhcywgb2JqX21hcCA9IG9iai5tYXA7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IFR5cGU7XHJcblx0fSkocmVxdWlyZSwgJy4vdHlwZScpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0Ly8gT24gZXZlbnQgZW1pdHRlciBnZW5lcmljIGphdmFzY3JpcHQgdXRpbGl0eS5cclxuXHRcdG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gb250byh0YWcsIGFyZywgYXMpe1xyXG5cdFx0XHRpZighdGFnKXsgcmV0dXJuIHt0bzogb250b30gfVxyXG5cdFx0XHR2YXIgdGFnID0gKHRoaXMudGFnIHx8ICh0aGlzLnRhZyA9IHt9KSlbdGFnXSB8fFxyXG5cdFx0XHQodGhpcy50YWdbdGFnXSA9IHt0YWc6IHRhZywgdG86IG9udG8uXyA9IHtcclxuXHRcdFx0XHRuZXh0OiBmdW5jdGlvbigpe31cclxuXHRcdFx0fX0pO1xyXG5cdFx0XHRpZihhcmcgaW5zdGFuY2VvZiBGdW5jdGlvbil7XHJcblx0XHRcdFx0dmFyIGJlID0ge1xyXG5cdFx0XHRcdFx0b2ZmOiBvbnRvLm9mZiB8fCBcclxuXHRcdFx0XHRcdChvbnRvLm9mZiA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRcdGlmKHRoaXMubmV4dCA9PT0gb250by5fLm5leHQpeyByZXR1cm4gITAgfVxyXG5cdFx0XHRcdFx0XHRpZih0aGlzID09PSB0aGlzLnRoZS5sYXN0KXtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnRoZS5sYXN0ID0gdGhpcy5iYWNrO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHRoaXMudG8uYmFjayA9IHRoaXMuYmFjaztcclxuXHRcdFx0XHRcdFx0dGhpcy5uZXh0ID0gb250by5fLm5leHQ7XHJcblx0XHRcdFx0XHRcdHRoaXMuYmFjay50byA9IHRoaXMudG87XHJcblx0XHRcdFx0XHR9KSxcclxuXHRcdFx0XHRcdHRvOiBvbnRvLl8sXHJcblx0XHRcdFx0XHRuZXh0OiBhcmcsXHJcblx0XHRcdFx0XHR0aGU6IHRhZyxcclxuXHRcdFx0XHRcdG9uOiB0aGlzLFxyXG5cdFx0XHRcdFx0YXM6IGFzLFxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0KGJlLmJhY2sgPSB0YWcubGFzdCB8fCB0YWcpLnRvID0gYmU7XHJcblx0XHRcdFx0cmV0dXJuIHRhZy5sYXN0ID0gYmU7XHJcblx0XHRcdH1cclxuXHRcdFx0KHRhZyA9IHRhZy50bykubmV4dChhcmcpO1xyXG5cdFx0XHRyZXR1cm4gdGFnO1xyXG5cdFx0fTtcclxuXHR9KShyZXF1aXJlLCAnLi9vbnRvJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHQvLyBUT0RPOiBOZWVkcyB0byBiZSByZWRvbmUuXHJcblx0XHR2YXIgT24gPSByZXF1aXJlKCcuL29udG8nKTtcclxuXHJcblx0XHRmdW5jdGlvbiBDaGFpbihjcmVhdGUsIG9wdCl7XHJcblx0XHRcdG9wdCA9IG9wdCB8fCB7fTtcclxuXHRcdFx0b3B0LmlkID0gb3B0LmlkIHx8ICcjJztcclxuXHRcdFx0b3B0LnJpZCA9IG9wdC5yaWQgfHwgJ0AnO1xyXG5cdFx0XHRvcHQudXVpZCA9IG9wdC51dWlkIHx8IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0cmV0dXJuICgrbmV3IERhdGUoKSkgKyBNYXRoLnJhbmRvbSgpO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHR2YXIgb24gPSBPbjsvL09uLnNjb3BlKCk7XHJcblxyXG5cdFx0XHRvbi5zdHVuID0gZnVuY3Rpb24oY2hhaW4pe1xyXG5cdFx0XHRcdHZhciBzdHVuID0gZnVuY3Rpb24oZXYpe1xyXG5cdFx0XHRcdFx0aWYoc3R1bi5vZmYgJiYgc3R1biA9PT0gdGhpcy5zdHVuKXtcclxuXHRcdFx0XHRcdFx0dGhpcy5zdHVuID0gbnVsbDtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYob24uc3R1bi5za2lwKXtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYoZXYpe1xyXG5cdFx0XHRcdFx0XHRldi5jYiA9IGV2LmZuO1xyXG5cdFx0XHRcdFx0XHRldi5vZmYoKTtcclxuXHRcdFx0XHRcdFx0cmVzLnF1ZXVlLnB1c2goZXYpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fSwgcmVzID0gc3R1bi5yZXMgPSBmdW5jdGlvbih0bXAsIGFzKXtcclxuXHRcdFx0XHRcdGlmKHN0dW4ub2ZmKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdGlmKHRtcCBpbnN0YW5jZW9mIEZ1bmN0aW9uKXtcclxuXHRcdFx0XHRcdFx0b24uc3R1bi5za2lwID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0dG1wLmNhbGwoYXMpO1xyXG5cdFx0XHRcdFx0XHRvbi5zdHVuLnNraXAgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0c3R1bi5vZmYgPSB0cnVlO1xyXG5cdFx0XHRcdFx0dmFyIGkgPSAwLCBxID0gcmVzLnF1ZXVlLCBsID0gcS5sZW5ndGgsIGFjdDtcclxuXHRcdFx0XHRcdHJlcy5xdWV1ZSA9IFtdO1xyXG5cdFx0XHRcdFx0aWYoc3R1biA9PT0gYXQuc3R1bil7XHJcblx0XHRcdFx0XHRcdGF0LnN0dW4gPSBudWxsO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Zm9yKGk7IGkgPCBsOyBpKyspeyBhY3QgPSBxW2ldO1xyXG5cdFx0XHRcdFx0XHRhY3QuZm4gPSBhY3QuY2I7XHJcblx0XHRcdFx0XHRcdGFjdC5jYiA9IG51bGw7XHJcblx0XHRcdFx0XHRcdG9uLnN0dW4uc2tpcCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdGFjdC5jdHgub24oYWN0LnRhZywgYWN0LmZuLCBhY3QpO1xyXG5cdFx0XHRcdFx0XHRvbi5zdHVuLnNraXAgPSBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LCBhdCA9IGNoYWluLl87XHJcblx0XHRcdFx0cmVzLmJhY2sgPSBhdC5zdHVuIHx8IChhdC5iYWNrfHx7Xzp7fX0pLl8uc3R1bjtcclxuXHRcdFx0XHRpZihyZXMuYmFjayl7XHJcblx0XHRcdFx0XHRyZXMuYmFjay5uZXh0ID0gc3R1bjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmVzLnF1ZXVlID0gW107XHJcblx0XHRcdFx0YXQuc3R1biA9IHN0dW47IFxyXG5cdFx0XHRcdHJldHVybiByZXM7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIG9uO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHRcdHJldHVybjtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHRcdHZhciBhc2sgPSBvbi5hc2sgPSBmdW5jdGlvbihjYiwgYXMpe1xyXG5cdFx0XHRcdGlmKCFhc2sub24peyBhc2sub24gPSBPbi5zY29wZSgpIH1cclxuXHRcdFx0XHR2YXIgaWQgPSBvcHQudXVpZCgpO1xyXG5cdFx0XHRcdGlmKGNiKXsgYXNrLm9uKGlkLCBjYiwgYXMpIH1cclxuXHRcdFx0XHRyZXR1cm4gaWQ7XHJcblx0XHRcdH1cclxuXHRcdFx0YXNrLl8gPSBvcHQuaWQ7XHJcblx0XHRcdG9uLmFjayA9IGZ1bmN0aW9uKGF0LCByZXBseSl7XHJcblx0XHRcdFx0aWYoIWF0IHx8ICFyZXBseSB8fCAhYXNrLm9uKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgaWQgPSBhdFtvcHQuaWRdIHx8IGF0O1xyXG5cdFx0XHRcdGlmKCFhc2sub25zW2lkXSl7IHJldHVybiB9XHJcblx0XHRcdFx0YXNrLm9uKGlkLCByZXBseSk7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0b24uYWNrLl8gPSBvcHQucmlkO1xyXG5cclxuXHJcblx0XHRcdHJldHVybiBvbjtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHRcdHJldHVybjtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRvbi5vbignZXZlbnQnLCBmdW5jdGlvbiBldmVudChhY3Qpe1xyXG5cdFx0XHRcdHZhciBsYXN0ID0gYWN0Lm9uLmxhc3QsIHRtcDtcclxuXHRcdFx0XHRpZignaW4nID09PSBhY3QudGFnICYmIEd1bi5jaGFpbi5jaGFpbi5pbnB1dCAhPT0gYWN0LmZuKXsgLy8gVE9ETzogQlVHISBHdW4gaXMgbm90IGF2YWlsYWJsZSBpbiB0aGlzIG1vZHVsZS5cclxuXHRcdFx0XHRcdGlmKCh0bXAgPSBhY3QuY3R4KSAmJiB0bXAuc3R1bil7XHJcblx0XHRcdFx0XHRcdGlmKHRtcC5zdHVuKGFjdCkpe1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZighbGFzdCl7IHJldHVybiB9XHJcblx0XHRcdFx0aWYoYWN0Lm9uLm1hcCl7XHJcblx0XHRcdFx0XHR2YXIgbWFwID0gYWN0Lm9uLm1hcCwgdjtcclxuXHRcdFx0XHRcdGZvcih2YXIgZiBpbiBtYXApeyB2ID0gbWFwW2ZdO1xyXG5cdFx0XHRcdFx0XHRpZih2KXtcclxuXHRcdFx0XHRcdFx0XHRlbWl0KHYsIGFjdCwgZXZlbnQpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvKlxyXG5cdFx0XHRcdFx0R3VuLm9iai5tYXAoYWN0Lm9uLm1hcCwgZnVuY3Rpb24odixmKXsgLy8gVE9ETzogQlVHISBHdW4gaXMgbm90IGF2YWlsYWJsZSBpbiB0aGlzIG1vZHVsZS5cclxuXHRcdFx0XHRcdFx0Ly9lbWl0KHZbMF0sIGFjdCwgZXZlbnQsIHZbMV0pOyAvLyBiZWxvdyBlbmFibGVzIG1vcmUgY29udHJvbFxyXG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiYm9vb29vb29vXCIsIGYsdik7XHJcblx0XHRcdFx0XHRcdGVtaXQodiwgYWN0LCBldmVudCk7XHJcblx0XHRcdFx0XHRcdC8vZW1pdCh2WzFdLCBhY3QsIGV2ZW50LCB2WzJdKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0Ki9cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0ZW1pdChsYXN0LCBhY3QsIGV2ZW50KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYobGFzdCAhPT0gYWN0Lm9uLmxhc3Qpe1xyXG5cdFx0XHRcdFx0ZXZlbnQoYWN0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRmdW5jdGlvbiBlbWl0KGxhc3QsIGFjdCwgZXZlbnQsIGV2KXtcclxuXHRcdFx0XHRpZihsYXN0IGluc3RhbmNlb2YgQXJyYXkpe1xyXG5cdFx0XHRcdFx0YWN0LmZuLmFwcGx5KGFjdC5hcywgbGFzdC5jb25jYXQoZXZ8fGFjdCkpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRhY3QuZm4uY2FsbChhY3QuYXMsIGxhc3QsIGV2fHxhY3QpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Lypvbi5vbignZW1pdCcsIGZ1bmN0aW9uKGV2KXtcclxuXHRcdFx0XHRpZihldi5vbi5tYXApe1xyXG5cdFx0XHRcdFx0dmFyIGlkID0gZXYuYXJnLnZpYS5ndW4uXy5pZCArIGV2LmFyZy5nZXQ7XHJcblx0XHRcdFx0XHQvL1xyXG5cdFx0XHRcdFx0Ly9ldi5pZCA9IGV2LmlkIHx8IEd1bi50ZXh0LnJhbmRvbSg2KTtcclxuXHRcdFx0XHRcdC8vZXYub24ubWFwW2V2LmlkXSA9IGV2LmFyZztcclxuXHRcdFx0XHRcdC8vZXYucHJveHkgPSBldi5hcmdbMV07XHJcblx0XHRcdFx0XHQvL2V2LmFyZyA9IGV2LmFyZ1swXTtcclxuXHRcdFx0XHRcdC8vIGJlbG93IGdpdmVzIG1vcmUgY29udHJvbC5cclxuXHRcdFx0XHRcdGV2Lm9uLm1hcFtpZF0gPSBldi5hcmc7XHJcblx0XHRcdFx0XHQvL2V2LnByb3h5ID0gZXYuYXJnWzJdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRldi5vbi5sYXN0ID0gZXYuYXJnO1xyXG5cdFx0XHR9KTsqL1xyXG5cclxuXHRcdFx0b24ub24oJ2VtaXQnLCBmdW5jdGlvbihldil7XHJcblx0XHRcdFx0dmFyIGd1biA9IGV2LmFyZy5ndW47XHJcblx0XHRcdFx0aWYoJ2luJyA9PT0gZXYudGFnICYmIGd1biAmJiAhZ3VuLl8uc291bCl7IC8vIFRPRE86IEJVRyEgU291bCBzaG91bGQgYmUgYXZhaWxhYmxlLiBDdXJyZW50bHkgbm90IHVzaW5nIGl0IHRob3VnaCwgYnV0IHNob3VsZCBlbmFibGUgaXQgKGNoZWNrIGZvciBzaWRlIGVmZmVjdHMgaWYgbWFkZSBhdmFpbGFibGUpLlxyXG5cdFx0XHRcdFx0KGV2Lm9uLm1hcCA9IGV2Lm9uLm1hcCB8fCB7fSlbZ3VuLl8uaWQgfHwgKGd1bi5fLmlkID0gTWF0aC5yYW5kb20oKSldID0gZXYuYXJnO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRldi5vbi5sYXN0ID0gZXYuYXJnO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG9uO1xyXG5cdFx0fVxyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBDaGFpbjtcclxuXHR9KShyZXF1aXJlLCAnLi9vbmlmeScpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0Ly8gR2VuZXJpYyBqYXZhc2NyaXB0IHNjaGVkdWxlciB1dGlsaXR5LlxyXG5cdFx0dmFyIFR5cGUgPSByZXF1aXJlKCcuL3R5cGUnKTtcclxuXHRcdGZ1bmN0aW9uIHMoc3RhdGUsIGNiLCB0aW1lKXsgLy8gbWF5YmUgdXNlIGxydS1jYWNoZT9cclxuXHRcdFx0cy50aW1lID0gdGltZTtcclxuXHRcdFx0cy53YWl0aW5nLnB1c2goe3doZW46IHN0YXRlLCBldmVudDogY2IgfHwgZnVuY3Rpb24oKXt9fSk7XHJcblx0XHRcdGlmKHMuc29vbmVzdCA8IHN0YXRlKXsgcmV0dXJuIH1cclxuXHRcdFx0cy5zZXQoc3RhdGUpO1xyXG5cdFx0fVxyXG5cdFx0cy53YWl0aW5nID0gW107XHJcblx0XHRzLnNvb25lc3QgPSBJbmZpbml0eTtcclxuXHRcdHMuc29ydCA9IFR5cGUubGlzdC5zb3J0KCd3aGVuJyk7XHJcblx0XHRzLnNldCA9IGZ1bmN0aW9uKGZ1dHVyZSl7XHJcblx0XHRcdGlmKEluZmluaXR5IDw9IChzLnNvb25lc3QgPSBmdXR1cmUpKXsgcmV0dXJuIH1cclxuXHRcdFx0dmFyIG5vdyA9IHMudGltZSgpO1xyXG5cdFx0XHRmdXR1cmUgPSAoZnV0dXJlIDw9IG5vdyk/IDAgOiAoZnV0dXJlIC0gbm93KTtcclxuXHRcdFx0Y2xlYXJUaW1lb3V0KHMuaWQpO1xyXG5cdFx0XHRzLmlkID0gc2V0VGltZW91dChzLmNoZWNrLCBmdXR1cmUpO1xyXG5cdFx0fVxyXG5cdFx0cy5lYWNoID0gZnVuY3Rpb24od2FpdCwgaSwgbWFwKXtcclxuXHRcdFx0dmFyIGN0eCA9IHRoaXM7XHJcblx0XHRcdGlmKCF3YWl0KXsgcmV0dXJuIH1cclxuXHRcdFx0aWYod2FpdC53aGVuIDw9IGN0eC5ub3cpe1xyXG5cdFx0XHRcdGlmKHdhaXQuZXZlbnQgaW5zdGFuY2VvZiBGdW5jdGlvbil7XHJcblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IHdhaXQuZXZlbnQoKSB9LDApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjdHguc29vbmVzdCA9IChjdHguc29vbmVzdCA8IHdhaXQud2hlbik/IGN0eC5zb29uZXN0IDogd2FpdC53aGVuO1xyXG5cdFx0XHRcdG1hcCh3YWl0KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cy5jaGVjayA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBjdHggPSB7bm93OiBzLnRpbWUoKSwgc29vbmVzdDogSW5maW5pdHl9O1xyXG5cdFx0XHRzLndhaXRpbmcuc29ydChzLnNvcnQpO1xyXG5cdFx0XHRzLndhaXRpbmcgPSBUeXBlLmxpc3QubWFwKHMud2FpdGluZywgcy5lYWNoLCBjdHgpIHx8IFtdO1xyXG5cdFx0XHRzLnNldChjdHguc29vbmVzdCk7XHJcblx0XHR9XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IHM7XHJcblx0fSkocmVxdWlyZSwgJy4vc2NoZWR1bGUnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdC8qIEJhc2VkIG9uIHRoZSBIeXBvdGhldGljYWwgQW1uZXNpYSBNYWNoaW5lIHRob3VnaHQgZXhwZXJpbWVudCAqL1xyXG5cdFx0ZnVuY3Rpb24gSEFNKG1hY2hpbmVTdGF0ZSwgaW5jb21pbmdTdGF0ZSwgY3VycmVudFN0YXRlLCBpbmNvbWluZ1ZhbHVlLCBjdXJyZW50VmFsdWUpe1xyXG5cdFx0XHRpZihtYWNoaW5lU3RhdGUgPCBpbmNvbWluZ1N0YXRlKXtcclxuXHRcdFx0XHRyZXR1cm4ge2RlZmVyOiB0cnVlfTsgLy8gdGhlIGluY29taW5nIHZhbHVlIGlzIG91dHNpZGUgdGhlIGJvdW5kYXJ5IG9mIHRoZSBtYWNoaW5lJ3Mgc3RhdGUsIGl0IG11c3QgYmUgcmVwcm9jZXNzZWQgaW4gYW5vdGhlciBzdGF0ZS5cclxuXHRcdFx0fVxyXG5cdFx0XHRpZihpbmNvbWluZ1N0YXRlIDwgY3VycmVudFN0YXRlKXtcclxuXHRcdFx0XHRyZXR1cm4ge2hpc3RvcmljYWw6IHRydWV9OyAvLyB0aGUgaW5jb21pbmcgdmFsdWUgaXMgd2l0aGluIHRoZSBib3VuZGFyeSBvZiB0aGUgbWFjaGluZSdzIHN0YXRlLCBidXQgbm90IHdpdGhpbiB0aGUgcmFuZ2UuXHJcblxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGN1cnJlbnRTdGF0ZSA8IGluY29taW5nU3RhdGUpe1xyXG5cdFx0XHRcdHJldHVybiB7Y29udmVyZ2U6IHRydWUsIGluY29taW5nOiB0cnVlfTsgLy8gdGhlIGluY29taW5nIHZhbHVlIGlzIHdpdGhpbiBib3RoIHRoZSBib3VuZGFyeSBhbmQgdGhlIHJhbmdlIG9mIHRoZSBtYWNoaW5lJ3Mgc3RhdGUuXHJcblxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGluY29taW5nU3RhdGUgPT09IGN1cnJlbnRTdGF0ZSl7XHJcblx0XHRcdFx0aW5jb21pbmdWYWx1ZSA9IExleGljYWwoaW5jb21pbmdWYWx1ZSkgfHwgXCJcIjtcclxuXHRcdFx0XHRjdXJyZW50VmFsdWUgPSBMZXhpY2FsKGN1cnJlbnRWYWx1ZSkgfHwgXCJcIjtcclxuXHRcdFx0XHRpZihpbmNvbWluZ1ZhbHVlID09PSBjdXJyZW50VmFsdWUpeyAvLyBOb3RlOiB3aGlsZSB0aGVzZSBhcmUgcHJhY3RpY2FsbHkgdGhlIHNhbWUsIHRoZSBkZWx0YXMgY291bGQgYmUgdGVjaG5pY2FsbHkgZGlmZmVyZW50XHJcblx0XHRcdFx0XHRyZXR1cm4ge3N0YXRlOiB0cnVlfTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0LypcclxuXHRcdFx0XHRcdFRoZSBmb2xsb3dpbmcgaXMgYSBuYWl2ZSBpbXBsZW1lbnRhdGlvbiwgYnV0IHdpbGwgYWx3YXlzIHdvcmsuXHJcblx0XHRcdFx0XHROZXZlciBjaGFuZ2UgaXQgdW5sZXNzIHlvdSBoYXZlIHNwZWNpZmljIG5lZWRzIHRoYXQgYWJzb2x1dGVseSByZXF1aXJlIGl0LlxyXG5cdFx0XHRcdFx0SWYgY2hhbmdlZCwgeW91ciBkYXRhIHdpbGwgZGl2ZXJnZSB1bmxlc3MgeW91IGd1YXJhbnRlZSBldmVyeSBwZWVyJ3MgYWxnb3JpdGhtIGhhcyBhbHNvIGJlZW4gY2hhbmdlZCB0byBiZSB0aGUgc2FtZS5cclxuXHRcdFx0XHRcdEFzIGEgcmVzdWx0LCBpdCBpcyBoaWdobHkgZGlzY291cmFnZWQgdG8gbW9kaWZ5IGRlc3BpdGUgdGhlIGZhY3QgdGhhdCBpdCBpcyBuYWl2ZSxcclxuXHRcdFx0XHRcdGJlY2F1c2UgY29udmVyZ2VuY2UgKGRhdGEgaW50ZWdyaXR5KSBpcyBnZW5lcmFsbHkgbW9yZSBpbXBvcnRhbnQuXHJcblx0XHRcdFx0XHRBbnkgZGlmZmVyZW5jZSBpbiB0aGlzIGFsZ29yaXRobSBtdXN0IGJlIGdpdmVuIGEgbmV3IGFuZCBkaWZmZXJlbnQgbmFtZS5cclxuXHRcdFx0XHQqL1xyXG5cdFx0XHRcdGlmKGluY29taW5nVmFsdWUgPCBjdXJyZW50VmFsdWUpeyAvLyBMZXhpY2FsIG9ubHkgd29ya3Mgb24gc2ltcGxlIHZhbHVlIHR5cGVzIVxyXG5cdFx0XHRcdFx0cmV0dXJuIHtjb252ZXJnZTogdHJ1ZSwgY3VycmVudDogdHJ1ZX07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGN1cnJlbnRWYWx1ZSA8IGluY29taW5nVmFsdWUpeyAvLyBMZXhpY2FsIG9ubHkgd29ya3Mgb24gc2ltcGxlIHZhbHVlIHR5cGVzIVxyXG5cdFx0XHRcdFx0cmV0dXJuIHtjb252ZXJnZTogdHJ1ZSwgaW5jb21pbmc6IHRydWV9O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4ge2VycjogXCJJbnZhbGlkIENSRFQgRGF0YTogXCIrIGluY29taW5nVmFsdWUgK1wiIHRvIFwiKyBjdXJyZW50VmFsdWUgK1wiIGF0IFwiKyBpbmNvbWluZ1N0YXRlICtcIiB0byBcIisgY3VycmVudFN0YXRlICtcIiFcIn07XHJcblx0XHR9XHJcblx0XHRpZih0eXBlb2YgSlNPTiA9PT0gJ3VuZGVmaW5lZCcpe1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXHJcblx0XHRcdFx0J0pTT04gaXMgbm90IGluY2x1ZGVkIGluIHRoaXMgYnJvd3Nlci4gUGxlYXNlIGxvYWQgaXQgZmlyc3Q6ICcgK1xyXG5cdFx0XHRcdCdhamF4LmNkbmpzLmNvbS9hamF4L2xpYnMvanNvbjIvMjAxMTAyMjMvanNvbjIuanMnXHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblx0XHR2YXIgTGV4aWNhbCA9IEpTT04uc3RyaW5naWZ5LCB1bmRlZmluZWQ7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IEhBTTtcclxuXHR9KShyZXF1aXJlLCAnLi9IQU0nKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBUeXBlID0gcmVxdWlyZSgnLi90eXBlJyk7XHJcblx0XHR2YXIgVmFsID0ge307XHJcblx0XHRWYWwuaXMgPSBmdW5jdGlvbih2KXsgLy8gVmFsaWQgdmFsdWVzIGFyZSBhIHN1YnNldCBvZiBKU09OOiBudWxsLCBiaW5hcnksIG51bWJlciAoIUluZmluaXR5KSwgdGV4dCwgb3IgYSBzb3VsIHJlbGF0aW9uLiBBcnJheXMgbmVlZCBzcGVjaWFsIGFsZ29yaXRobXMgdG8gaGFuZGxlIGNvbmN1cnJlbmN5LCBzbyB0aGV5IGFyZSBub3Qgc3VwcG9ydGVkIGRpcmVjdGx5LiBVc2UgYW4gZXh0ZW5zaW9uIHRoYXQgc3VwcG9ydHMgdGhlbSBpZiBuZWVkZWQgYnV0IHJlc2VhcmNoIHRoZWlyIHByb2JsZW1zIGZpcnN0LlxyXG5cdFx0XHRpZih2ID09PSB1KXsgcmV0dXJuIGZhbHNlIH1cclxuXHRcdFx0aWYodiA9PT0gbnVsbCl7IHJldHVybiB0cnVlIH0gLy8gXCJkZWxldGVzXCIsIG51bGxpbmcgb3V0IGZpZWxkcy5cclxuXHRcdFx0aWYodiA9PT0gSW5maW5pdHkpeyByZXR1cm4gZmFsc2UgfSAvLyB3ZSB3YW50IHRoaXMgdG8gYmUsIGJ1dCBKU09OIGRvZXMgbm90IHN1cHBvcnQgaXQsIHNhZCBmYWNlLlxyXG5cdFx0XHRpZih0ZXh0X2lzKHYpIC8vIGJ5IFwidGV4dFwiIHdlIG1lYW4gc3RyaW5ncy5cclxuXHRcdFx0fHwgYmlfaXModikgLy8gYnkgXCJiaW5hcnlcIiB3ZSBtZWFuIGJvb2xlYW4uXHJcblx0XHRcdHx8IG51bV9pcyh2KSl7IC8vIGJ5IFwibnVtYmVyXCIgd2UgbWVhbiBpbnRlZ2VycyBvciBkZWNpbWFscy4gXHJcblx0XHRcdFx0cmV0dXJuIHRydWU7IC8vIHNpbXBsZSB2YWx1ZXMgYXJlIHZhbGlkLlxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBWYWwucmVsLmlzKHYpIHx8IGZhbHNlOyAvLyBpcyB0aGUgdmFsdWUgYSBzb3VsIHJlbGF0aW9uPyBUaGVuIGl0IGlzIHZhbGlkIGFuZCByZXR1cm4gaXQuIElmIG5vdCwgZXZlcnl0aGluZyBlbHNlIHJlbWFpbmluZyBpcyBhbiBpbnZhbGlkIGRhdGEgdHlwZS4gQ3VzdG9tIGV4dGVuc2lvbnMgY2FuIGJlIGJ1aWx0IG9uIHRvcCBvZiB0aGVzZSBwcmltaXRpdmVzIHRvIHN1cHBvcnQgb3RoZXIgdHlwZXMuXHJcblx0XHR9XHJcblx0XHRWYWwucmVsID0ge186ICcjJ307XHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFZhbC5yZWwuaXMgPSBmdW5jdGlvbih2KXsgLy8gdGhpcyBkZWZpbmVzIHdoZXRoZXIgYW4gb2JqZWN0IGlzIGEgc291bCByZWxhdGlvbiBvciBub3QsIHRoZXkgbG9vayBsaWtlIHRoaXM6IHsnIyc6ICdVVUlEJ31cclxuXHRcdFx0XHRpZih2ICYmIHZbcmVsX10gJiYgIXYuXyAmJiBvYmpfaXModikpeyAvLyBtdXN0IGJlIGFuIG9iamVjdC5cclxuXHRcdFx0XHRcdHZhciBvID0ge307XHJcblx0XHRcdFx0XHRvYmpfbWFwKHYsIG1hcCwgbyk7XHJcblx0XHRcdFx0XHRpZihvLmlkKXsgLy8gYSB2YWxpZCBpZCB3YXMgZm91bmQuXHJcblx0XHRcdFx0XHRcdHJldHVybiBvLmlkOyAvLyB5YXkhIFJldHVybiBpdC5cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlOyAvLyB0aGUgdmFsdWUgd2FzIG5vdCBhIHZhbGlkIHNvdWwgcmVsYXRpb24uXHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbWFwKHMsIGYpeyB2YXIgbyA9IHRoaXM7IC8vIG1hcCBvdmVyIHRoZSBvYmplY3QuLi5cclxuXHRcdFx0XHRpZihvLmlkKXsgcmV0dXJuIG8uaWQgPSBmYWxzZSB9IC8vIGlmIElEIGlzIGFscmVhZHkgZGVmaW5lZCBBTkQgd2UncmUgc3RpbGwgbG9vcGluZyB0aHJvdWdoIHRoZSBvYmplY3QsIGl0IGlzIGNvbnNpZGVyZWQgaW52YWxpZC5cclxuXHRcdFx0XHRpZihmID09IHJlbF8gJiYgdGV4dF9pcyhzKSl7IC8vIHRoZSBmaWVsZCBzaG91bGQgYmUgJyMnIGFuZCBoYXZlIGEgdGV4dCB2YWx1ZS5cclxuXHRcdFx0XHRcdG8uaWQgPSBzOyAvLyB3ZSBmb3VuZCB0aGUgc291bCFcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuIG8uaWQgPSBmYWxzZTsgLy8gaWYgdGhlcmUgZXhpc3RzIGFueXRoaW5nIGVsc2Ugb24gdGhlIG9iamVjdCB0aGF0IGlzbid0IHRoZSBzb3VsLCB0aGVuIGl0IGlzIGNvbnNpZGVyZWQgaW52YWxpZC5cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblx0XHRWYWwucmVsLmlmeSA9IGZ1bmN0aW9uKHQpeyByZXR1cm4gb2JqX3B1dCh7fSwgcmVsXywgdCkgfSAvLyBjb252ZXJ0IGEgc291bCBpbnRvIGEgcmVsYXRpb24gYW5kIHJldHVybiBpdC5cclxuXHRcdHZhciByZWxfID0gVmFsLnJlbC5fLCB1O1xyXG5cdFx0dmFyIGJpX2lzID0gVHlwZS5iaS5pcztcclxuXHRcdHZhciBudW1faXMgPSBUeXBlLm51bS5pcztcclxuXHRcdHZhciB0ZXh0X2lzID0gVHlwZS50ZXh0LmlzO1xyXG5cdFx0dmFyIG9iaiA9IFR5cGUub2JqLCBvYmpfaXMgPSBvYmouaXMsIG9ial9wdXQgPSBvYmoucHV0LCBvYmpfbWFwID0gb2JqLm1hcDtcclxuXHRcdG1vZHVsZS5leHBvcnRzID0gVmFsO1xyXG5cdH0pKHJlcXVpcmUsICcuL3ZhbCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIFR5cGUgPSByZXF1aXJlKCcuL3R5cGUnKTtcclxuXHRcdHZhciBWYWwgPSByZXF1aXJlKCcuL3ZhbCcpO1xyXG5cdFx0dmFyIE5vZGUgPSB7XzogJ18nfTtcclxuXHRcdE5vZGUuc291bCA9IGZ1bmN0aW9uKG4sIG8peyByZXR1cm4gKG4gJiYgbi5fICYmIG4uX1tvIHx8IHNvdWxfXSkgfSAvLyBjb252ZW5pZW5jZSBmdW5jdGlvbiB0byBjaGVjayB0byBzZWUgaWYgdGhlcmUgaXMgYSBzb3VsIG9uIGEgbm9kZSBhbmQgcmV0dXJuIGl0LlxyXG5cdFx0Tm9kZS5zb3VsLmlmeSA9IGZ1bmN0aW9uKG4sIG8peyAvLyBwdXQgYSBzb3VsIG9uIGFuIG9iamVjdC5cclxuXHRcdFx0byA9ICh0eXBlb2YgbyA9PT0gJ3N0cmluZycpPyB7c291bDogb30gOiBvIHx8IHt9O1xyXG5cdFx0XHRuID0gbiB8fCB7fTsgLy8gbWFrZSBzdXJlIGl0IGV4aXN0cy5cclxuXHRcdFx0bi5fID0gbi5fIHx8IHt9OyAvLyBtYWtlIHN1cmUgbWV0YSBleGlzdHMuXHJcblx0XHRcdG4uX1tzb3VsX10gPSBvLnNvdWwgfHwgbi5fW3NvdWxfXSB8fCB0ZXh0X3JhbmRvbSgpOyAvLyBwdXQgdGhlIHNvdWwgb24gaXQuXHJcblx0XHRcdHJldHVybiBuO1xyXG5cdFx0fVxyXG5cdFx0Tm9kZS5zb3VsLl8gPSBWYWwucmVsLl87XHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdE5vZGUuaXMgPSBmdW5jdGlvbihuLCBjYiwgYXMpeyB2YXIgczsgLy8gY2hlY2tzIHRvIHNlZSBpZiBhbiBvYmplY3QgaXMgYSB2YWxpZCBub2RlLlxyXG5cdFx0XHRcdGlmKCFvYmpfaXMobikpeyByZXR1cm4gZmFsc2UgfSAvLyBtdXN0IGJlIGFuIG9iamVjdC5cclxuXHRcdFx0XHRpZihzID0gTm9kZS5zb3VsKG4pKXsgLy8gbXVzdCBoYXZlIGEgc291bCBvbiBpdC5cclxuXHRcdFx0XHRcdHJldHVybiAhb2JqX21hcChuLCBtYXAsIHthczphcyxjYjpjYixzOnMsbjpufSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZTsgLy8gbm9wZSEgVGhpcyB3YXMgbm90IGEgdmFsaWQgbm9kZS5cclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBtYXAodiwgZil7IC8vIHdlIGludmVydCB0aGlzIGJlY2F1c2UgdGhlIHdheSB3ZSBjaGVjayBmb3IgdGhpcyBpcyB2aWEgYSBuZWdhdGlvbi5cclxuXHRcdFx0XHRpZihmID09PSBOb2RlLl8peyByZXR1cm4gfSAvLyBza2lwIG92ZXIgdGhlIG1ldGFkYXRhLlxyXG5cdFx0XHRcdGlmKCFWYWwuaXModikpeyByZXR1cm4gdHJ1ZSB9IC8vIGl0IGlzIHRydWUgdGhhdCB0aGlzIGlzIGFuIGludmFsaWQgbm9kZS5cclxuXHRcdFx0XHRpZih0aGlzLmNiKXsgdGhpcy5jYi5jYWxsKHRoaXMuYXMsIHYsIGYsIHRoaXMubiwgdGhpcy5zKSB9IC8vIG9wdGlvbmFsbHkgY2FsbGJhY2sgZWFjaCBmaWVsZC92YWx1ZS5cclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0Tm9kZS5pZnkgPSBmdW5jdGlvbihvYmosIG8sIGFzKXsgLy8gcmV0dXJucyBhIG5vZGUgZnJvbSBhIHNoYWxsb3cgb2JqZWN0LlxyXG5cdFx0XHRcdGlmKCFvKXsgbyA9IHt9IH1cclxuXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBvID09PSAnc3RyaW5nJyl7IG8gPSB7c291bDogb30gfVxyXG5cdFx0XHRcdGVsc2UgaWYobyBpbnN0YW5jZW9mIEZ1bmN0aW9uKXsgbyA9IHttYXA6IG99IH1cclxuXHRcdFx0XHRpZihvLm1hcCl7IG8ubm9kZSA9IG8ubWFwLmNhbGwoYXMsIG9iaiwgdSwgby5ub2RlIHx8IHt9KSB9XHJcblx0XHRcdFx0aWYoby5ub2RlID0gTm9kZS5zb3VsLmlmeShvLm5vZGUgfHwge30sIG8pKXtcclxuXHRcdFx0XHRcdG9ial9tYXAob2JqLCBtYXAsIHtvOm8sYXM6YXN9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIG8ubm9kZTsgLy8gVGhpcyB3aWxsIG9ubHkgYmUgYSB2YWxpZCBub2RlIGlmIHRoZSBvYmplY3Qgd2Fzbid0IGFscmVhZHkgZGVlcCFcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBtYXAodiwgZil7IHZhciBvID0gdGhpcy5vLCB0bXAsIHU7IC8vIGl0ZXJhdGUgb3ZlciBlYWNoIGZpZWxkL3ZhbHVlLlxyXG5cdFx0XHRcdGlmKG8ubWFwKXtcclxuXHRcdFx0XHRcdHRtcCA9IG8ubWFwLmNhbGwodGhpcy5hcywgdiwgJycrZiwgby5ub2RlKTtcclxuXHRcdFx0XHRcdGlmKHUgPT09IHRtcCl7XHJcblx0XHRcdFx0XHRcdG9ial9kZWwoby5ub2RlLCBmKTtcclxuXHRcdFx0XHRcdH0gZWxzZVxyXG5cdFx0XHRcdFx0aWYoby5ub2RlKXsgby5ub2RlW2ZdID0gdG1wIH1cclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoVmFsLmlzKHYpKXtcclxuXHRcdFx0XHRcdG8ubm9kZVtmXSA9IHY7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0dmFyIG9iaiA9IFR5cGUub2JqLCBvYmpfaXMgPSBvYmouaXMsIG9ial9kZWwgPSBvYmouZGVsLCBvYmpfbWFwID0gb2JqLm1hcDtcclxuXHRcdHZhciB0ZXh0ID0gVHlwZS50ZXh0LCB0ZXh0X3JhbmRvbSA9IHRleHQucmFuZG9tO1xyXG5cdFx0dmFyIHNvdWxfID0gTm9kZS5zb3VsLl87XHJcblx0XHR2YXIgdTtcclxuXHRcdG1vZHVsZS5leHBvcnRzID0gTm9kZTtcclxuXHR9KShyZXF1aXJlLCAnLi9ub2RlJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgVHlwZSA9IHJlcXVpcmUoJy4vdHlwZScpO1xyXG5cdFx0dmFyIE5vZGUgPSByZXF1aXJlKCcuL25vZGUnKTtcclxuXHRcdGZ1bmN0aW9uIFN0YXRlKCl7XHJcblx0XHRcdHZhciB0O1xyXG5cdFx0XHRpZihwZXJmKXtcclxuXHRcdFx0XHR0ID0gc3RhcnQgKyBwZXJmLm5vdygpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHQgPSB0aW1lKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYobGFzdCA8IHQpe1xyXG5cdFx0XHRcdHJldHVybiBOID0gMCwgbGFzdCA9IHQgKyBTdGF0ZS5kcmlmdDtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gbGFzdCA9IHQgKyAoKE4gKz0gMSkgLyBEKSArIFN0YXRlLmRyaWZ0O1xyXG5cdFx0fVxyXG5cdFx0dmFyIHRpbWUgPSBUeXBlLnRpbWUuaXMsIGxhc3QgPSAtSW5maW5pdHksIE4gPSAwLCBEID0gMTAwMDsgLy8gV0FSTklORyEgSW4gdGhlIGZ1dHVyZSwgb24gbWFjaGluZXMgdGhhdCBhcmUgRCB0aW1lcyBmYXN0ZXIgdGhhbiAyMDE2QUQgbWFjaGluZXMsIHlvdSB3aWxsIHdhbnQgdG8gaW5jcmVhc2UgRCBieSBhbm90aGVyIHNldmVyYWwgb3JkZXJzIG9mIG1hZ25pdHVkZSBzbyB0aGUgcHJvY2Vzc2luZyBzcGVlZCBuZXZlciBvdXQgcGFjZXMgdGhlIGRlY2ltYWwgcmVzb2x1dGlvbiAoaW5jcmVhc2luZyBhbiBpbnRlZ2VyIGVmZmVjdHMgdGhlIHN0YXRlIGFjY3VyYWN5KS5cclxuXHRcdHZhciBwZXJmID0gKHR5cGVvZiBwZXJmb3JtYW5jZSAhPT0gJ3VuZGVmaW5lZCcpPyAocGVyZm9ybWFuY2UudGltaW5nICYmIHBlcmZvcm1hbmNlKSA6IGZhbHNlLCBzdGFydCA9IChwZXJmICYmIHBlcmYudGltaW5nICYmIHBlcmYudGltaW5nLm5hdmlnYXRpb25TdGFydCkgfHwgKHBlcmYgPSBmYWxzZSk7XHJcblx0XHRTdGF0ZS5fID0gJz4nO1xyXG5cdFx0U3RhdGUuZHJpZnQgPSAwO1xyXG5cdFx0U3RhdGUuaXMgPSBmdW5jdGlvbihuLCBmLCBvKXsgLy8gY29udmVuaWVuY2UgZnVuY3Rpb24gdG8gZ2V0IHRoZSBzdGF0ZSBvbiBhIGZpZWxkIG9uIGEgbm9kZSBhbmQgcmV0dXJuIGl0LlxyXG5cdFx0XHR2YXIgdG1wID0gKGYgJiYgbiAmJiBuW05fXSAmJiBuW05fXVtTdGF0ZS5fXSkgfHwgbztcclxuXHRcdFx0aWYoIXRtcCl7IHJldHVybiB9XHJcblx0XHRcdHJldHVybiBudW1faXModG1wID0gdG1wW2ZdKT8gdG1wIDogLUluZmluaXR5O1xyXG5cdFx0fVxyXG5cdFx0U3RhdGUuaWZ5ID0gZnVuY3Rpb24obiwgZiwgcywgdiwgc291bCl7IC8vIHB1dCBhIGZpZWxkJ3Mgc3RhdGUgb24gYSBub2RlLlxyXG5cdFx0XHRpZighbiB8fCAhbltOX10peyAvLyByZWplY3QgaWYgaXQgaXMgbm90IG5vZGUtbGlrZS5cclxuXHRcdFx0XHRpZighc291bCl7IC8vIHVubGVzcyB0aGV5IHBhc3NlZCBhIHNvdWxcclxuXHRcdFx0XHRcdHJldHVybjsgXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG4gPSBOb2RlLnNvdWwuaWZ5KG4sIHNvdWwpOyAvLyB0aGVuIG1ha2UgaXQgc28hXHJcblx0XHRcdH0gXHJcblx0XHRcdHZhciB0bXAgPSBvYmpfYXMobltOX10sIFN0YXRlLl8pOyAvLyBncmFiIHRoZSBzdGF0ZXMgZGF0YS5cclxuXHRcdFx0aWYodSAhPT0gZiAmJiBmICE9PSBOXyl7XHJcblx0XHRcdFx0aWYobnVtX2lzKHMpKXtcclxuXHRcdFx0XHRcdHRtcFtmXSA9IHM7IC8vIGFkZCB0aGUgdmFsaWQgc3RhdGUuXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKHUgIT09IHYpeyAvLyBOb3RlOiBOb3QgaXRzIGpvYiB0byBjaGVjayBmb3IgdmFsaWQgdmFsdWVzIVxyXG5cdFx0XHRcdFx0bltmXSA9IHY7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBuO1xyXG5cdFx0fVxyXG5cdFx0U3RhdGUudG8gPSBmdW5jdGlvbihmcm9tLCBmLCB0byl7XHJcblx0XHRcdHZhciB2YWwgPSBmcm9tW2ZdO1xyXG5cdFx0XHRpZihvYmpfaXModmFsKSl7XHJcblx0XHRcdFx0dmFsID0gb2JqX2NvcHkodmFsKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gU3RhdGUuaWZ5KHRvLCBmLCBTdGF0ZS5pcyhmcm9tLCBmKSwgdmFsLCBOb2RlLnNvdWwoZnJvbSkpO1xyXG5cdFx0fVxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRTdGF0ZS5tYXAgPSBmdW5jdGlvbihjYiwgcywgYXMpeyB2YXIgdTsgLy8gZm9yIHVzZSB3aXRoIE5vZGUuaWZ5XHJcblx0XHRcdFx0dmFyIG8gPSBvYmpfaXMobyA9IGNiIHx8IHMpPyBvIDogbnVsbDtcclxuXHRcdFx0XHRjYiA9IGZuX2lzKGNiID0gY2IgfHwgcyk/IGNiIDogbnVsbDtcclxuXHRcdFx0XHRpZihvICYmICFjYil7XHJcblx0XHRcdFx0XHRzID0gbnVtX2lzKHMpPyBzIDogU3RhdGUoKTtcclxuXHRcdFx0XHRcdG9bTl9dID0gb1tOX10gfHwge307XHJcblx0XHRcdFx0XHRvYmpfbWFwKG8sIG1hcCwge286byxzOnN9KTtcclxuXHRcdFx0XHRcdHJldHVybiBvO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRhcyA9IGFzIHx8IG9ial9pcyhzKT8gcyA6IHU7XHJcblx0XHRcdFx0cyA9IG51bV9pcyhzKT8gcyA6IFN0YXRlKCk7XHJcblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKHYsIGYsIG8sIG9wdCl7XHJcblx0XHRcdFx0XHRpZighY2Ipe1xyXG5cdFx0XHRcdFx0XHRtYXAuY2FsbCh7bzogbywgczogc30sIHYsZik7XHJcblx0XHRcdFx0XHRcdHJldHVybiB2O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y2IuY2FsbChhcyB8fCB0aGlzIHx8IHt9LCB2LCBmLCBvLCBvcHQpO1xyXG5cdFx0XHRcdFx0aWYob2JqX2hhcyhvLGYpICYmIHUgPT09IG9bZl0peyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0bWFwLmNhbGwoe286IG8sIHM6IHN9LCB2LGYpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBtYXAodixmKXtcclxuXHRcdFx0XHRpZihOXyA9PT0gZil7IHJldHVybiB9XHJcblx0XHRcdFx0U3RhdGUuaWZ5KHRoaXMubywgZiwgdGhpcy5zKSA7XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblx0XHR2YXIgb2JqID0gVHlwZS5vYmosIG9ial9hcyA9IG9iai5hcywgb2JqX2hhcyA9IG9iai5oYXMsIG9ial9pcyA9IG9iai5pcywgb2JqX21hcCA9IG9iai5tYXAsIG9ial9jb3B5ID0gb2JqLmNvcHk7XHJcblx0XHR2YXIgbnVtID0gVHlwZS5udW0sIG51bV9pcyA9IG51bS5pcztcclxuXHRcdHZhciBmbiA9IFR5cGUuZm4sIGZuX2lzID0gZm4uaXM7XHJcblx0XHR2YXIgTl8gPSBOb2RlLl8sIHU7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IFN0YXRlO1xyXG5cdH0pKHJlcXVpcmUsICcuL3N0YXRlJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgVHlwZSA9IHJlcXVpcmUoJy4vdHlwZScpO1xyXG5cdFx0dmFyIFZhbCA9IHJlcXVpcmUoJy4vdmFsJyk7XHJcblx0XHR2YXIgTm9kZSA9IHJlcXVpcmUoJy4vbm9kZScpO1xyXG5cdFx0dmFyIEdyYXBoID0ge307XHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdEdyYXBoLmlzID0gZnVuY3Rpb24oZywgY2IsIGZuLCBhcyl7IC8vIGNoZWNrcyB0byBzZWUgaWYgYW4gb2JqZWN0IGlzIGEgdmFsaWQgZ3JhcGguXHJcblx0XHRcdFx0aWYoIWcgfHwgIW9ial9pcyhnKSB8fCBvYmpfZW1wdHkoZykpeyByZXR1cm4gZmFsc2UgfSAvLyBtdXN0IGJlIGFuIG9iamVjdC5cclxuXHRcdFx0XHRyZXR1cm4gIW9ial9tYXAoZywgbWFwLCB7Y2I6Y2IsZm46Zm4sYXM6YXN9KTsgLy8gbWFrZXMgc3VyZSBpdCB3YXNuJ3QgYW4gZW1wdHkgb2JqZWN0LlxyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcChuLCBzKXsgLy8gd2UgaW52ZXJ0IHRoaXMgYmVjYXVzZSB0aGUgd2F5Jz8gd2UgY2hlY2sgZm9yIHRoaXMgaXMgdmlhIGEgbmVnYXRpb24uXHJcblx0XHRcdFx0aWYoIW4gfHwgcyAhPT0gTm9kZS5zb3VsKG4pIHx8ICFOb2RlLmlzKG4sIHRoaXMuZm4sIHRoaXMuYXMpKXsgcmV0dXJuIHRydWUgfSAvLyBpdCBpcyB0cnVlIHRoYXQgdGhpcyBpcyBhbiBpbnZhbGlkIGdyYXBoLlxyXG5cdFx0XHRcdGlmKCF0aGlzLmNiKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRuZi5uID0gbjsgbmYuYXMgPSB0aGlzLmFzOyAvLyBzZXF1ZW50aWFsIHJhY2UgY29uZGl0aW9ucyBhcmVuJ3QgcmFjZXMuXHJcblx0XHRcdFx0dGhpcy5jYi5jYWxsKG5mLmFzLCBuLCBzLCBuZik7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbmYoZm4peyAvLyBvcHRpb25hbCBjYWxsYmFjayBmb3IgZWFjaCBub2RlLlxyXG5cdFx0XHRcdGlmKGZuKXsgTm9kZS5pcyhuZi5uLCBmbiwgbmYuYXMpIH0gLy8gd2hlcmUgd2UgdGhlbiBoYXZlIGFuIG9wdGlvbmFsIGNhbGxiYWNrIGZvciBlYWNoIGZpZWxkL3ZhbHVlLlxyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRHcmFwaC5pZnkgPSBmdW5jdGlvbihvYmosIGVudiwgYXMpe1xyXG5cdFx0XHRcdHZhciBhdCA9IHtwYXRoOiBbXSwgb2JqOiBvYmp9O1xyXG5cdFx0XHRcdGlmKCFlbnYpe1xyXG5cdFx0XHRcdFx0ZW52ID0ge307XHJcblx0XHRcdFx0fSBlbHNlXHJcblx0XHRcdFx0aWYodHlwZW9mIGVudiA9PT0gJ3N0cmluZycpe1xyXG5cdFx0XHRcdFx0ZW52ID0ge3NvdWw6IGVudn07XHJcblx0XHRcdFx0fSBlbHNlXHJcblx0XHRcdFx0aWYoZW52IGluc3RhbmNlb2YgRnVuY3Rpb24pe1xyXG5cdFx0XHRcdFx0ZW52Lm1hcCA9IGVudjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoZW52LnNvdWwpe1xyXG5cdFx0XHRcdFx0YXQucmVsID0gVmFsLnJlbC5pZnkoZW52LnNvdWwpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbnYuZ3JhcGggPSBlbnYuZ3JhcGggfHwge307XHJcblx0XHRcdFx0ZW52LnNlZW4gPSBlbnYuc2VlbiB8fCBbXTtcclxuXHRcdFx0XHRlbnYuYXMgPSBlbnYuYXMgfHwgYXM7XHJcblx0XHRcdFx0bm9kZShlbnYsIGF0KTtcclxuXHRcdFx0XHRlbnYucm9vdCA9IGF0Lm5vZGU7XHJcblx0XHRcdFx0cmV0dXJuIGVudi5ncmFwaDtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBub2RlKGVudiwgYXQpeyB2YXIgdG1wO1xyXG5cdFx0XHRcdGlmKHRtcCA9IHNlZW4oZW52LCBhdCkpeyByZXR1cm4gdG1wIH1cclxuXHRcdFx0XHRhdC5lbnYgPSBlbnY7XHJcblx0XHRcdFx0YXQuc291bCA9IHNvdWw7XHJcblx0XHRcdFx0aWYoTm9kZS5pZnkoYXQub2JqLCBtYXAsIGF0KSl7XHJcblx0XHRcdFx0XHQvL2F0LnJlbCA9IGF0LnJlbCB8fCBWYWwucmVsLmlmeShOb2RlLnNvdWwoYXQubm9kZSkpO1xyXG5cdFx0XHRcdFx0ZW52LmdyYXBoW1ZhbC5yZWwuaXMoYXQucmVsKV0gPSBhdC5ub2RlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gYXQ7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbWFwKHYsZixuKXtcclxuXHRcdFx0XHR2YXIgYXQgPSB0aGlzLCBlbnYgPSBhdC5lbnYsIGlzLCB0bXA7XHJcblx0XHRcdFx0aWYoTm9kZS5fID09PSBmICYmIG9ial9oYXModixWYWwucmVsLl8pKXtcclxuXHRcdFx0XHRcdHJldHVybiBuLl87IC8vIFRPRE86IEJ1Zz9cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoIShpcyA9IHZhbGlkKHYsZixuLCBhdCxlbnYpKSl7IHJldHVybiB9XHJcblx0XHRcdFx0aWYoIWYpe1xyXG5cdFx0XHRcdFx0YXQubm9kZSA9IGF0Lm5vZGUgfHwgbiB8fCB7fTtcclxuXHRcdFx0XHRcdGlmKG9ial9oYXModiwgTm9kZS5fKSl7XHJcblx0XHRcdFx0XHRcdGF0Lm5vZGUuXyA9IG9ial9jb3B5KHYuXyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRhdC5ub2RlID0gTm9kZS5zb3VsLmlmeShhdC5ub2RlLCBWYWwucmVsLmlzKGF0LnJlbCkpO1xyXG5cdFx0XHRcdFx0YXQucmVsID0gYXQucmVsIHx8IFZhbC5yZWwuaWZ5KE5vZGUuc291bChhdC5ub2RlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKHRtcCA9IGVudi5tYXApe1xyXG5cdFx0XHRcdFx0dG1wLmNhbGwoZW52LmFzIHx8IHt9LCB2LGYsbiwgYXQpO1xyXG5cdFx0XHRcdFx0aWYob2JqX2hhcyhuLGYpKXtcclxuXHRcdFx0XHRcdFx0diA9IG5bZl07XHJcblx0XHRcdFx0XHRcdGlmKHUgPT09IHYpe1xyXG5cdFx0XHRcdFx0XHRcdG9ial9kZWwobiwgZik7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmKCEoaXMgPSB2YWxpZCh2LGYsbiwgYXQsZW52KSkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZighZil7IHJldHVybiBhdC5ub2RlIH1cclxuXHRcdFx0XHRpZih0cnVlID09PSBpcyl7XHJcblx0XHRcdFx0XHRyZXR1cm4gdjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dG1wID0gbm9kZShlbnYsIHtvYmo6IHYsIHBhdGg6IGF0LnBhdGguY29uY2F0KGYpfSk7XHJcblx0XHRcdFx0aWYoIXRtcC5ub2RlKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRyZXR1cm4gdG1wLnJlbDsgLy97JyMnOiBOb2RlLnNvdWwodG1wLm5vZGUpfTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBzb3VsKGlkKXsgdmFyIGF0ID0gdGhpcztcclxuXHRcdFx0XHR2YXIgcHJldiA9IFZhbC5yZWwuaXMoYXQucmVsKSwgZ3JhcGggPSBhdC5lbnYuZ3JhcGg7XHJcblx0XHRcdFx0YXQucmVsID0gYXQucmVsIHx8IFZhbC5yZWwuaWZ5KGlkKTtcclxuXHRcdFx0XHRhdC5yZWxbVmFsLnJlbC5fXSA9IGlkO1xyXG5cdFx0XHRcdGlmKGF0Lm5vZGUgJiYgYXQubm9kZVtOb2RlLl9dKXtcclxuXHRcdFx0XHRcdGF0Lm5vZGVbTm9kZS5fXVtWYWwucmVsLl9dID0gaWQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKG9ial9oYXMoZ3JhcGgsIHByZXYpKXtcclxuXHRcdFx0XHRcdGdyYXBoW2lkXSA9IGdyYXBoW3ByZXZdO1xyXG5cdFx0XHRcdFx0b2JqX2RlbChncmFwaCwgcHJldik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIHZhbGlkKHYsZixuLCBhdCxlbnYpeyB2YXIgdG1wO1xyXG5cdFx0XHRcdGlmKFZhbC5pcyh2KSl7IHJldHVybiB0cnVlIH1cclxuXHRcdFx0XHRpZihvYmpfaXModikpeyByZXR1cm4gMSB9XHJcblx0XHRcdFx0aWYodG1wID0gZW52LmludmFsaWQpe1xyXG5cdFx0XHRcdFx0diA9IHRtcC5jYWxsKGVudi5hcyB8fCB7fSwgdixmLG4pO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHZhbGlkKHYsZixuLCBhdCxlbnYpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbnYuZXJyID0gXCJJbnZhbGlkIHZhbHVlIGF0ICdcIiArIGF0LnBhdGguY29uY2F0KGYpLmpvaW4oJy4nKSArIFwiJyFcIjtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBzZWVuKGVudiwgYXQpe1xyXG5cdFx0XHRcdHZhciBhcnIgPSBlbnYuc2VlbiwgaSA9IGFyci5sZW5ndGgsIGhhcztcclxuXHRcdFx0XHR3aGlsZShpLS0peyBoYXMgPSBhcnJbaV07XHJcblx0XHRcdFx0XHRpZihhdC5vYmogPT09IGhhcy5vYmopeyByZXR1cm4gaGFzIH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YXJyLnB1c2goYXQpO1xyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0R3JhcGgubm9kZSA9IGZ1bmN0aW9uKG5vZGUpe1xyXG5cdFx0XHR2YXIgc291bCA9IE5vZGUuc291bChub2RlKTtcclxuXHRcdFx0aWYoIXNvdWwpeyByZXR1cm4gfVxyXG5cdFx0XHRyZXR1cm4gb2JqX3B1dCh7fSwgc291bCwgbm9kZSk7XHJcblx0XHR9XHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdEdyYXBoLnRvID0gZnVuY3Rpb24oZ3JhcGgsIHJvb3QsIG9wdCl7XHJcblx0XHRcdFx0aWYoIWdyYXBoKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgb2JqID0ge307XHJcblx0XHRcdFx0b3B0ID0gb3B0IHx8IHtzZWVuOiB7fX07XHJcblx0XHRcdFx0b2JqX21hcChncmFwaFtyb290XSwgbWFwLCB7b2JqOm9iaiwgZ3JhcGg6IGdyYXBoLCBvcHQ6IG9wdH0pO1xyXG5cdFx0XHRcdHJldHVybiBvYmo7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbWFwKHYsZil7IHZhciB0bXAsIG9iajtcclxuXHRcdFx0XHRpZihOb2RlLl8gPT09IGYpe1xyXG5cdFx0XHRcdFx0aWYob2JqX2VtcHR5KHYsIFZhbC5yZWwuXykpe1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR0aGlzLm9ialtmXSA9IG9ial9jb3B5KHYpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZighKHRtcCA9IFZhbC5yZWwuaXModikpKXtcclxuXHRcdFx0XHRcdHRoaXMub2JqW2ZdID0gdjtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYob2JqID0gdGhpcy5vcHQuc2Vlblt0bXBdKXtcclxuXHRcdFx0XHRcdHRoaXMub2JqW2ZdID0gb2JqO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLm9ialtmXSA9IHRoaXMub3B0LnNlZW5bdG1wXSA9IEdyYXBoLnRvKHRoaXMuZ3JhcGgsIHRtcCwgdGhpcy5vcHQpO1xyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0dmFyIGZuX2lzID0gVHlwZS5mbi5pcztcclxuXHRcdHZhciBvYmogPSBUeXBlLm9iaiwgb2JqX2lzID0gb2JqLmlzLCBvYmpfZGVsID0gb2JqLmRlbCwgb2JqX2hhcyA9IG9iai5oYXMsIG9ial9lbXB0eSA9IG9iai5lbXB0eSwgb2JqX3B1dCA9IG9iai5wdXQsIG9ial9tYXAgPSBvYmoubWFwLCBvYmpfY29weSA9IG9iai5jb3B5O1xyXG5cdFx0dmFyIHU7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IEdyYXBoO1xyXG5cdH0pKHJlcXVpcmUsICcuL2dyYXBoJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgVHlwZSA9IHJlcXVpcmUoJy4vdHlwZScpO1xyXG5cdFx0ZnVuY3Rpb24gRHVwKCl7XHJcblx0XHRcdHRoaXMuY2FjaGUgPSB7fTtcclxuXHRcdH1cclxuXHRcdER1cC5wcm90b3R5cGUudHJhY2sgPSBmdW5jdGlvbihpZCl7XHJcblx0XHRcdHRoaXMuY2FjaGVbaWRdID0gVHlwZS50aW1lLmlzKCk7XHJcblx0XHRcdGlmICghdGhpcy50bykge1xyXG5cdFx0XHRcdHRoaXMuZ2MoKTsgLy8gRW5nYWdlIEdDLlxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBpZDtcclxuXHRcdH07XHJcblx0XHREdXAucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oaWQpe1xyXG5cdFx0XHQvLyBIYXZlIHdlIHNlZW4gdGhpcyBJRCByZWNlbnRseT9cclxuXHRcdFx0cmV0dXJuIFR5cGUub2JqLmhhcyh0aGlzLmNhY2hlLCBpZCk/IHRoaXMudHJhY2soaWQpIDogZmFsc2U7IC8vIEltcG9ydGFudCwgYnVtcCB0aGUgSUQncyBsaXZlbGluZXNzIGlmIGl0IGhhcyBhbHJlYWR5IGJlZW4gc2VlbiBiZWZvcmUgLSB0aGlzIGlzIGNyaXRpY2FsIHRvIHN0b3BwaW5nIGJyb2FkY2FzdCBzdG9ybXMuXHJcblx0XHR9XHJcblx0XHREdXAucHJvdG90eXBlLmdjID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIGRlID0gdGhpcywgbm93ID0gVHlwZS50aW1lLmlzKCksIG9sZGVzdCA9IG5vdywgbWF4QWdlID0gNSAqIDYwICogMTAwMDtcclxuXHRcdFx0Ly8gVE9ETzogR3VuLnNjaGVkdWxlciBhbHJlYWR5IGRvZXMgdGhpcz8gUmV1c2UgdGhhdC5cclxuXHRcdFx0VHlwZS5vYmoubWFwKGRlLmNhY2hlLCBmdW5jdGlvbih0aW1lLCBpZCl7XHJcblx0XHRcdFx0b2xkZXN0ID0gTWF0aC5taW4obm93LCB0aW1lKTtcclxuXHRcdFx0XHRpZiAoKG5vdyAtIHRpbWUpIDwgbWF4QWdlKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRUeXBlLm9iai5kZWwoZGUuY2FjaGUsIGlkKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHZhciBkb25lID0gVHlwZS5vYmouZW1wdHkoZGUuY2FjaGUpO1xyXG5cdFx0XHRpZihkb25lKXtcclxuXHRcdFx0XHRkZS50byA9IG51bGw7IC8vIERpc2VuZ2FnZSBHQy5cclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIGVsYXBzZWQgPSBub3cgLSBvbGRlc3Q7IC8vIEp1c3QgaG93IG9sZD9cclxuXHRcdFx0dmFyIG5leHRHQyA9IG1heEFnZSAtIGVsYXBzZWQ7IC8vIEhvdyBsb25nIGJlZm9yZSBpdCdzIHRvbyBvbGQ/XHJcblx0XHRcdGRlLnRvID0gc2V0VGltZW91dChmdW5jdGlvbigpeyBkZS5nYygpIH0sIG5leHRHQyk7IC8vIFNjaGVkdWxlIHRoZSBuZXh0IEdDIGV2ZW50LlxyXG5cdFx0fVxyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBEdXA7XHJcblx0fSkocmVxdWlyZSwgJy4vZHVwJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblxyXG5cdFx0ZnVuY3Rpb24gR3VuKG8pe1xyXG5cdFx0XHRpZihvIGluc3RhbmNlb2YgR3VuKXsgcmV0dXJuICh0aGlzLl8gPSB7Z3VuOiB0aGlzfSkuZ3VuIH1cclxuXHRcdFx0aWYoISh0aGlzIGluc3RhbmNlb2YgR3VuKSl7IHJldHVybiBuZXcgR3VuKG8pIH1cclxuXHRcdFx0cmV0dXJuIEd1bi5jcmVhdGUodGhpcy5fID0ge2d1bjogdGhpcywgb3B0OiBvfSk7XHJcblx0XHR9XHJcblxyXG5cdFx0R3VuLmlzID0gZnVuY3Rpb24oZ3VuKXsgcmV0dXJuIChndW4gaW5zdGFuY2VvZiBHdW4pIH1cclxuXHJcblx0XHRHdW4udmVyc2lvbiA9IDAuNztcclxuXHJcblx0XHRHdW4uY2hhaW4gPSBHdW4ucHJvdG90eXBlO1xyXG5cdFx0R3VuLmNoYWluLnRvSlNPTiA9IGZ1bmN0aW9uKCl7fTtcclxuXHJcblx0XHR2YXIgVHlwZSA9IHJlcXVpcmUoJy4vdHlwZScpO1xyXG5cdFx0VHlwZS5vYmoudG8oVHlwZSwgR3VuKTtcclxuXHRcdEd1bi5IQU0gPSByZXF1aXJlKCcuL0hBTScpO1xyXG5cdFx0R3VuLnZhbCA9IHJlcXVpcmUoJy4vdmFsJyk7XHJcblx0XHRHdW4ubm9kZSA9IHJlcXVpcmUoJy4vbm9kZScpO1xyXG5cdFx0R3VuLnN0YXRlID0gcmVxdWlyZSgnLi9zdGF0ZScpO1xyXG5cdFx0R3VuLmdyYXBoID0gcmVxdWlyZSgnLi9ncmFwaCcpO1xyXG5cdFx0R3VuLmR1cCA9IHJlcXVpcmUoJy4vZHVwJyk7XHJcblx0XHRHdW4uc2NoZWR1bGUgPSByZXF1aXJlKCcuL3NjaGVkdWxlJyk7XHJcblx0XHRHdW4ub24gPSByZXF1aXJlKCcuL29uaWZ5JykoKTtcclxuXHRcdFxyXG5cdFx0R3VuLl8gPSB7IC8vIHNvbWUgcmVzZXJ2ZWQga2V5IHdvcmRzLCB0aGVzZSBhcmUgbm90IHRoZSBvbmx5IG9uZXMuXHJcblx0XHRcdG5vZGU6IEd1bi5ub2RlLl8gLy8gYWxsIG1ldGFkYXRhIG9mIGEgbm9kZSBpcyBzdG9yZWQgaW4gdGhlIG1ldGEgcHJvcGVydHkgb24gdGhlIG5vZGUuXHJcblx0XHRcdCxzb3VsOiBHdW4udmFsLnJlbC5fIC8vIGEgc291bCBpcyBhIFVVSUQgb2YgYSBub2RlIGJ1dCBpdCBhbHdheXMgcG9pbnRzIHRvIHRoZSBcImxhdGVzdFwiIGRhdGEga25vd24uXHJcblx0XHRcdCxzdGF0ZTogR3VuLnN0YXRlLl8gLy8gb3RoZXIgdGhhbiB0aGUgc291bCwgd2Ugc3RvcmUgSEFNIG1ldGFkYXRhLlxyXG5cdFx0XHQsZmllbGQ6ICcuJyAvLyBhIGZpZWxkIGlzIGEgcHJvcGVydHkgb24gYSBub2RlIHdoaWNoIHBvaW50cyB0byBhIHZhbHVlLlxyXG5cdFx0XHQsdmFsdWU6ICc9JyAvLyB0aGUgcHJpbWl0aXZlIHZhbHVlLlxyXG5cdFx0fVxyXG5cclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0R3VuLmNyZWF0ZSA9IGZ1bmN0aW9uKGF0KXtcclxuXHRcdFx0XHRhdC5vbiA9IGF0Lm9uIHx8IEd1bi5vbjtcclxuXHRcdFx0XHRhdC5yb290ID0gYXQucm9vdCB8fCBhdC5ndW47XHJcblx0XHRcdFx0YXQuZ3JhcGggPSBhdC5ncmFwaCB8fCB7fTtcclxuXHRcdFx0XHRhdC5kdXAgPSBhdC5kdXAgfHwgbmV3IEd1bi5kdXA7XHJcblx0XHRcdFx0YXQuYXNrID0gR3VuLm9uLmFzaztcclxuXHRcdFx0XHRhdC5hY2sgPSBHdW4ub24uYWNrO1xyXG5cdFx0XHRcdHZhciBndW4gPSBhdC5ndW4ub3B0KGF0Lm9wdCk7XHJcblx0XHRcdFx0aWYoIWF0Lm9uY2Upe1xyXG5cdFx0XHRcdFx0YXQub24oJ2luJywgcm9vdCwgYXQpO1xyXG5cdFx0XHRcdFx0YXQub24oJ291dCcsIHJvb3QsIGF0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YXQub25jZSA9IDE7XHJcblx0XHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiByb290KGF0KXtcclxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiYWRkIHRvLm5leHQoYXQpXCIpOyAvLyBUT0RPOiBCVUchISFcclxuXHRcdFx0XHR2YXIgZXYgPSB0aGlzLCBjYXQgPSBldi5hcywgY29hdDtcclxuXHRcdFx0XHRpZighYXQuZ3VuKXsgYXQuZ3VuID0gY2F0Lmd1biB9XHJcblx0XHRcdFx0aWYoIWF0WycjJ10peyBhdFsnIyddID0gR3VuLnRleHQucmFuZG9tKCkgfSAvLyBUT0RPOiBVc2Ugd2hhdCBpcyB1c2VkIG90aGVyIHBsYWNlcyBpbnN0ZWFkLlxyXG5cdFx0XHRcdGlmKGNhdC5kdXAuY2hlY2soYXRbJyMnXSkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGlmKGF0WydAJ10pe1xyXG5cdFx0XHRcdFx0Ly8gVE9ETzogQlVHISBGb3IgbXVsdGktaW5zdGFuY2VzLCB0aGUgXCJhY2tcIiBzeXN0ZW0gaXMgZ2xvYmFsbHkgc2hhcmVkLCBidXQgaXQgc2hvdWxkbid0IGJlLlxyXG5cdFx0XHRcdFx0aWYoY2F0LmFjayhhdFsnQCddLCBhdCkpeyByZXR1cm4gfSAvLyBUT0RPOiBDb25zaWRlciBub3QgcmV0dXJuaW5nIGhlcmUsIG1heWJlLCB3aGVyZSB0aGlzIHdvdWxkIGxldCB0aGUgXCJoYW5kc2hha2VcIiBvbiBzeW5jIG9jY3VyIGZvciBIb2x5IEdyYWlsP1xyXG5cdFx0XHRcdFx0Y2F0LmR1cC50cmFjayhhdFsnIyddKTtcclxuXHRcdFx0XHRcdEd1bi5vbignb3V0Jywgb2JqX3RvKGF0LCB7Z3VuOiBjYXQuZ3VufSkpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXQuZHVwLnRyYWNrKGF0WycjJ10pO1xyXG5cdFx0XHRcdC8vaWYoY2F0LmFjayhhdFsnQCddLCBhdCkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdC8vY2F0LmFjayhhdFsnQCddLCBhdCk7XHJcblx0XHRcdFx0Y29hdCA9IG9ial90byhhdCwge2d1bjogY2F0Lmd1bn0pO1xyXG5cdFx0XHRcdGlmKGF0LmdldCl7XHJcblx0XHRcdFx0XHQvL0d1bi5vbi5HRVQoY29hdCk7XHJcblx0XHRcdFx0XHRHdW4ub24oJ2dldCcsIGNvYXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihhdC5wdXQpe1xyXG5cdFx0XHRcdFx0Ly9HdW4ub24uUFVUKGNvYXQpO1xyXG5cdFx0XHRcdFx0R3VuLm9uKCdwdXQnLCBjb2F0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0R3VuLm9uKCdvdXQnLCBjb2F0KTtcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdEd1bi5vbigncHV0JywgZnVuY3Rpb24oYXQpe1xyXG5cdFx0XHQvL0d1bi5vbi5QVVQgPSBmdW5jdGlvbihhdCl7XHJcblx0XHRcdFx0aWYoIWF0WycjJ10peyByZXR1cm4gdGhpcy50by5uZXh0KGF0KSB9IC8vIGZvciB0ZXN0cy5cclxuXHRcdFx0XHR2YXIgZXYgPSB0aGlzLCBjdHggPSB7Z3VuOiBhdC5ndW4sIGdyYXBoOiBhdC5ndW4uXy5ncmFwaCwgcHV0OiB7fSwgbWFwOiB7fSwgbWFjaGluZTogR3VuLnN0YXRlKCl9O1xyXG5cdFx0XHRcdGlmKCFHdW4uZ3JhcGguaXMoYXQucHV0LCBudWxsLCB2ZXJpZnksIGN0eCkpeyBjdHguZXJyID0gXCJFcnJvcjogSW52YWxpZCBncmFwaCFcIiB9XHJcblx0XHRcdFx0aWYoY3R4LmVycil7IHJldHVybiBjdHguZ3VuLm9uKCdpbicsIHsnQCc6IGF0WycjJ10sIGVycjogR3VuLmxvZyhjdHguZXJyKSB9KSB9XHJcblx0XHRcdFx0b2JqX21hcChjdHgucHV0LCBtZXJnZSwgY3R4KTtcclxuXHRcdFx0XHRvYmpfbWFwKGN0eC5tYXAsIG1hcCwgY3R4KTtcclxuXHRcdFx0XHRpZih1ICE9PSBjdHguZGVmZXIpe1xyXG5cdFx0XHRcdFx0R3VuLnNjaGVkdWxlKGN0eC5kZWZlciwgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdFx0R3VuLm9uKCdwdXQnLCBhdCk7XHJcblx0XHRcdFx0XHR9LCBHdW4uc3RhdGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZighY3R4LmRpZmYpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGV2LnRvLm5leHQob2JqX3RvKGF0LCB7cHV0OiBjdHguZGlmZn0pKTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdGZ1bmN0aW9uIHZlcmlmeSh2YWwsIGtleSwgbm9kZSwgc291bCl7IHZhciBjdHggPSB0aGlzO1xyXG5cdFx0XHRcdHZhciBzdGF0ZSA9IEd1bi5zdGF0ZS5pcyhub2RlLCBrZXkpLCB0bXA7XHJcblx0XHRcdFx0aWYoIXN0YXRlKXsgcmV0dXJuIGN0eC5lcnIgPSBcIkVycm9yOiBObyBzdGF0ZSBvbiAnXCIra2V5K1wiJyBpbiBub2RlICdcIitzb3VsK1wiJyFcIiB9XHJcblx0XHRcdFx0dmFyIHZlcnRleCA9IGN0eC5ncmFwaFtzb3VsXSB8fCBlbXB0eSwgd2FzID0gR3VuLnN0YXRlLmlzKHZlcnRleCwga2V5LCB0cnVlKSwga25vd24gPSB2ZXJ0ZXhba2V5XTtcclxuXHRcdFx0XHR2YXIgSEFNID0gR3VuLkhBTShjdHgubWFjaGluZSwgc3RhdGUsIHdhcywgdmFsLCBrbm93bik7XHJcblx0XHRcdFx0aWYoIUhBTS5pbmNvbWluZyl7XHJcblx0XHRcdFx0XHRpZihIQU0uZGVmZXIpeyAvLyBwaWNrIHRoZSBsb3dlc3RcclxuXHRcdFx0XHRcdFx0Y3R4LmRlZmVyID0gKHN0YXRlIDwgKGN0eC5kZWZlciB8fCBJbmZpbml0eSkpPyBzdGF0ZSA6IGN0eC5kZWZlcjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y3R4LnB1dFtzb3VsXSA9IEd1bi5zdGF0ZS50byhub2RlLCBrZXksIGN0eC5wdXRbc291bF0pO1xyXG5cdFx0XHRcdChjdHguZGlmZiB8fCAoY3R4LmRpZmYgPSB7fSkpW3NvdWxdID0gR3VuLnN0YXRlLnRvKG5vZGUsIGtleSwgY3R4LmRpZmZbc291bF0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1lcmdlKG5vZGUsIHNvdWwpe1xyXG5cdFx0XHRcdHZhciByZWYgPSAoKHRoaXMuZ3VuLl8pLm5leHQgfHwgZW1wdHkpW3NvdWxdO1xyXG5cdFx0XHRcdGlmKCFyZWYpeyByZXR1cm4gfVxyXG5cdFx0XHRcdHZhciBhdCA9IHRoaXMubWFwW3NvdWxdID0ge1xyXG5cdFx0XHRcdFx0cHV0OiB0aGlzLm5vZGUgPSBub2RlLFxyXG5cdFx0XHRcdFx0Z2V0OiB0aGlzLnNvdWwgPSBzb3VsLFxyXG5cdFx0XHRcdFx0Z3VuOiB0aGlzLnJlZiA9IHJlZlxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0b2JqX21hcChub2RlLCBlYWNoLCB0aGlzKTtcclxuXHRcdFx0XHRHdW4ub24oJ25vZGUnLCBhdCk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gZWFjaCh2YWwsIGtleSl7XHJcblx0XHRcdFx0dmFyIGdyYXBoID0gdGhpcy5ncmFwaCwgc291bCA9IHRoaXMuc291bCwgY2F0ID0gKHRoaXMucmVmLl8pLCB0bXA7XHJcblx0XHRcdFx0Z3JhcGhbc291bF0gPSBHdW4uc3RhdGUudG8odGhpcy5ub2RlLCBrZXksIGdyYXBoW3NvdWxdKTtcclxuXHRcdFx0XHQoY2F0LnB1dCB8fCAoY2F0LnB1dCA9IHt9KSlba2V5XSA9IHZhbDtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBtYXAoYXQsIHNvdWwpe1xyXG5cdFx0XHRcdGlmKCFhdC5ndW4peyByZXR1cm4gfVxyXG5cdFx0XHRcdChhdC5ndW4uXykub24oJ2luJywgYXQpO1xyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0R3VuLm9uKCdnZXQnLCBmdW5jdGlvbihhdCl7XHJcblx0XHRcdFx0dmFyIGV2ID0gdGhpcywgc291bCA9IGF0LmdldFtfc291bF0sIGNhdCA9IGF0Lmd1bi5fLCBub2RlID0gY2F0LmdyYXBoW3NvdWxdLCBmaWVsZCA9IGF0LmdldFtfZmllbGRdLCB0bXA7XHJcblx0XHRcdFx0dmFyIG5leHQgPSBjYXQubmV4dCB8fCAoY2F0Lm5leHQgPSB7fSksIGFzID0gKChuZXh0W3NvdWxdIHx8IGVtcHR5KS5fKTtcclxuXHRcdFx0XHRpZighbm9kZSB8fCAhYXMpeyByZXR1cm4gZXYudG8ubmV4dChhdCkgfVxyXG5cdFx0XHRcdGlmKGZpZWxkKXtcclxuXHRcdFx0XHRcdGlmKCFvYmpfaGFzKG5vZGUsIGZpZWxkKSl7IHJldHVybiBldi50by5uZXh0KGF0KSB9XHJcblx0XHRcdFx0XHRub2RlID0gR3VuLnN0YXRlLnRvKG5vZGUsIGZpZWxkKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0bm9kZSA9IEd1bi5vYmouY29weShub2RlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly9pZihhdC5ndW4gPT09IGNhdC5ndW4pe1xyXG5cdFx0XHRcdFx0bm9kZSA9IEd1bi5ncmFwaC5ub2RlKG5vZGUpOyAvLyBUT0RPOiBCVUchIENsb25lIG5vZGU/XHJcblx0XHRcdFx0Ly99IGVsc2Uge1xyXG5cdFx0XHRcdC8vXHRjYXQgPSAoYXQuZ3VuLl8pO1xyXG5cdFx0XHRcdC8vfVxyXG5cdFx0XHRcdHRtcCA9IGFzLmFjaztcclxuXHRcdFx0XHRjYXQub24oJ2luJywge1xyXG5cdFx0XHRcdFx0J0AnOiBhdFsnIyddLFxyXG5cdFx0XHRcdFx0aG93OiAnbWVtJyxcclxuXHRcdFx0XHRcdHB1dDogbm9kZSxcclxuXHRcdFx0XHRcdGd1bjogYXMuZ3VuXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0aWYoMCA8IHRtcCl7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGV2LnRvLm5leHQoYXQpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0oKSk7XHJcblx0XHRcclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0R3VuLm9uLmFzayA9IGZ1bmN0aW9uKGNiLCBhcyl7XHJcblx0XHRcdFx0aWYoIXRoaXMub24peyByZXR1cm4gfVxyXG5cdFx0XHRcdHZhciBpZCA9IEd1bi50ZXh0LnJhbmRvbSgpO1xyXG5cdFx0XHRcdGlmKGNiKXsgdGhpcy5vbihpZCwgY2IsIGFzKSB9XHJcblx0XHRcdFx0cmV0dXJuIGlkO1xyXG5cdFx0XHR9XHJcblx0XHRcdEd1bi5vbi5hY2sgPSBmdW5jdGlvbihhdCwgcmVwbHkpe1xyXG5cdFx0XHRcdGlmKCFhdCB8fCAhcmVwbHkgfHwgIXRoaXMub24peyByZXR1cm4gfVxyXG5cdFx0XHRcdHZhciBpZCA9IGF0WycjJ10gfHwgYXQ7XHJcblx0XHRcdFx0aWYoIXRoaXMudGFnIHx8ICF0aGlzLnRhZ1tpZF0peyByZXR1cm4gfVxyXG5cdFx0XHRcdHRoaXMub24oaWQsIHJlcGx5KTtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdEd1bi5jaGFpbi5vcHQgPSBmdW5jdGlvbihvcHQpe1xyXG5cdFx0XHRcdG9wdCA9IG9wdCB8fCB7fTtcclxuXHRcdFx0XHR2YXIgZ3VuID0gdGhpcywgYXQgPSBndW4uXywgdG1wID0gb3B0LnBlZXJzIHx8IG9wdDtcclxuXHRcdFx0XHRpZighb2JqX2lzKG9wdCkpeyBvcHQgPSB7fSB9XHJcblx0XHRcdFx0aWYoIW9ial9pcyhhdC5vcHQpKXsgYXQub3B0ID0gb3B0IH1cclxuXHRcdFx0XHRpZih0ZXh0X2lzKHRtcCkpeyB0bXAgPSBbdG1wXSB9XHJcblx0XHRcdFx0aWYobGlzdF9pcyh0bXApKXtcclxuXHRcdFx0XHRcdHRtcCA9IG9ial9tYXAodG1wLCBmdW5jdGlvbih1cmwsIGksIG1hcCl7XHJcblx0XHRcdFx0XHRcdG1hcCh1cmwsIHt1cmw6IHVybH0pO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRpZighb2JqX2lzKGF0Lm9wdC5wZWVycykpeyBhdC5vcHQucGVlcnMgPSB7fX1cclxuXHRcdFx0XHRcdGF0Lm9wdC5wZWVycyA9IG9ial90byh0bXAsIGF0Lm9wdC5wZWVycyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGF0Lm9wdC53c2MgPSBhdC5vcHQud3NjIHx8IHtwcm90b2NvbHM6W119IFxyXG5cdFx0XHRcdGF0Lm9wdC5wZWVycyA9IGF0Lm9wdC5wZWVycyB8fCB7fTtcclxuXHRcdFx0XHRvYmpfdG8ob3B0LCBhdC5vcHQpOyAvLyBjb3BpZXMgb3B0aW9ucyBvbiB0byBgYXQub3B0YCBvbmx5IGlmIG5vdCBhbHJlYWR5IHRha2VuLlxyXG5cdFx0XHRcdEd1bi5vbignb3B0JywgYXQpO1xyXG5cdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblxyXG5cdFx0dmFyIHRleHRfaXMgPSBHdW4udGV4dC5pcztcclxuXHRcdHZhciBsaXN0X2lzID0gR3VuLmxpc3QuaXM7XHJcblx0XHR2YXIgb2JqID0gR3VuLm9iaiwgb2JqX2lzID0gb2JqLmlzLCBvYmpfaGFzID0gb2JqLmhhcywgb2JqX3RvID0gb2JqLnRvLCBvYmpfbWFwID0gb2JqLm1hcCwgb2JqX2NvcHkgPSBvYmouY29weTtcclxuXHRcdHZhciBfc291bCA9IEd1bi5fLnNvdWwsIF9maWVsZCA9IEd1bi5fLmZpZWxkLCByZWxfaXMgPSBHdW4udmFsLnJlbC5pcztcclxuXHRcdHZhciBlbXB0eSA9IHt9LCB1O1xyXG5cclxuXHRcdGNvbnNvbGUuZGVidWcgPSBmdW5jdGlvbihpLCBzKXsgcmV0dXJuIChjb25zb2xlLmRlYnVnLmkgJiYgaSA9PT0gY29uc29sZS5kZWJ1Zy5pICYmIGNvbnNvbGUuZGVidWcuaSsrKSAmJiAoY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKSB8fCBzKSB9O1xyXG5cclxuXHRcdEd1bi5sb2cgPSBmdW5jdGlvbigpeyByZXR1cm4gKCFHdW4ubG9nLm9mZiAmJiBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpKSwgW10uc2xpY2UuY2FsbChhcmd1bWVudHMpLmpvaW4oJyAnKSB9XHJcblx0XHRHdW4ubG9nLm9uY2UgPSBmdW5jdGlvbih3LHMsbyl7IHJldHVybiAobyA9IEd1bi5sb2cub25jZSlbd10gPSBvW3ddIHx8IDAsIG9bd10rKyB8fCBHdW4ubG9nKHMpIH1cclxuXHJcblx0XHQ7XCJQbGVhc2UgZG8gbm90IHJlbW92ZSB0aGVzZSBtZXNzYWdlcyB1bmxlc3MgeW91IGFyZSBwYXlpbmcgZm9yIGEgbW9udGhseSBzcG9uc29yc2hpcCwgdGhhbmtzIVwiO1xyXG5cdFx0R3VuLmxvZy5vbmNlKFwid2VsY29tZVwiLCBcIkhlbGxvIHdvbmRlcmZ1bCBwZXJzb24hIDopIFRoYW5rcyBmb3IgdXNpbmcgR1VOLCBmZWVsIGZyZWUgdG8gYXNrIGZvciBoZWxwIG9uIGh0dHBzOi8vZ2l0dGVyLmltL2FtYXJrL2d1biBhbmQgYXNrIFN0YWNrT3ZlcmZsb3cgcXVlc3Rpb25zIHRhZ2dlZCB3aXRoICdndW4nIVwiKTtcclxuXHRcdDtcIlBsZWFzZSBkbyBub3QgcmVtb3ZlIHRoZXNlIG1lc3NhZ2VzIHVubGVzcyB5b3UgYXJlIHBheWluZyBmb3IgYSBtb250aGx5IHNwb25zb3JzaGlwLCB0aGFua3MhXCI7XHJcblx0XHRcclxuXHRcdGlmKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpeyB3aW5kb3cuR3VuID0gR3VuIH1cclxuXHRcdGlmKHR5cGVvZiBjb21tb24gIT09IFwidW5kZWZpbmVkXCIpeyBjb21tb24uZXhwb3J0cyA9IEd1biB9XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IEd1bjtcclxuXHR9KShyZXF1aXJlLCAnLi9yb290Jyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9yb290Jyk7XHJcblx0XHRHdW4uY2hhaW4uYmFjayA9IGZ1bmN0aW9uKG4sIG9wdCl7IHZhciB0bXA7XHJcblx0XHRcdGlmKC0xID09PSBuIHx8IEluZmluaXR5ID09PSBuKXtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5fLnJvb3Q7XHJcblx0XHRcdH0gZWxzZVxyXG5cdFx0XHRpZigxID09PSBuKXtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5fLmJhY2sgfHwgdGhpcztcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgZ3VuID0gdGhpcywgYXQgPSBndW4uXztcclxuXHRcdFx0aWYodHlwZW9mIG4gPT09ICdzdHJpbmcnKXtcclxuXHRcdFx0XHRuID0gbi5zcGxpdCgnLicpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKG4gaW5zdGFuY2VvZiBBcnJheSl7XHJcblx0XHRcdFx0dmFyIGkgPSAwLCBsID0gbi5sZW5ndGgsIHRtcCA9IGF0O1xyXG5cdFx0XHRcdGZvcihpOyBpIDwgbDsgaSsrKXtcclxuXHRcdFx0XHRcdHRtcCA9ICh0bXB8fGVtcHR5KVtuW2ldXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYodSAhPT0gdG1wKXtcclxuXHRcdFx0XHRcdHJldHVybiBvcHQ/IGd1biA6IHRtcDtcclxuXHRcdFx0XHR9IGVsc2VcclxuXHRcdFx0XHRpZigodG1wID0gYXQuYmFjaykpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRtcC5iYWNrKG4sIG9wdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihuIGluc3RhbmNlb2YgRnVuY3Rpb24pe1xyXG5cdFx0XHRcdHZhciB5ZXMsIHRtcCA9IHtiYWNrOiBndW59O1xyXG5cdFx0XHRcdHdoaWxlKCh0bXAgPSB0bXAuYmFjaylcclxuXHRcdFx0XHQmJiAodG1wID0gdG1wLl8pXHJcblx0XHRcdFx0JiYgISh5ZXMgPSBuKHRtcCwgb3B0KSkpe31cclxuXHRcdFx0XHRyZXR1cm4geWVzO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR2YXIgZW1wdHkgPSB7fSwgdTtcclxuXHR9KShyZXF1aXJlLCAnLi9iYWNrJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9yb290Jyk7XHJcblx0XHRHdW4uY2hhaW4uY2hhaW4gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgYXQgPSB0aGlzLl8sIGNoYWluID0gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcyksIGNhdCA9IGNoYWluLl87XHJcblx0XHRcdGNhdC5yb290ID0gcm9vdCA9IGF0LnJvb3Q7XHJcblx0XHRcdGNhdC5pZCA9ICsrcm9vdC5fLm9uY2U7XHJcblx0XHRcdGNhdC5iYWNrID0gdGhpcztcclxuXHRcdFx0Y2F0Lm9uID0gR3VuLm9uO1xyXG5cdFx0XHRHdW4ub24oJ2NoYWluJywgY2F0KTtcclxuXHRcdFx0Y2F0Lm9uKCdpbicsIGlucHV0LCBjYXQpOyAvLyBGb3IgJ2luJyBpZiBJIGFkZCBteSBvd24gbGlzdGVuZXJzIHRvIGVhY2ggdGhlbiBJIE1VU1QgZG8gaXQgYmVmb3JlIGluIGdldHMgY2FsbGVkLiBJZiBJIGxpc3RlbiBnbG9iYWxseSBmb3IgYWxsIGluY29taW5nIGRhdGEgaW5zdGVhZCB0aG91Z2gsIHJlZ2FyZGxlc3Mgb2YgaW5kaXZpZHVhbCBsaXN0ZW5lcnMsIEkgY2FuIHRyYW5zZm9ybSB0aGUgZGF0YSB0aGVyZSBhbmQgdGhlbiBhcyB3ZWxsLlxyXG5cdFx0XHRjYXQub24oJ291dCcsIG91dHB1dCwgY2F0KTsgLy8gSG93ZXZlciBmb3Igb3V0cHV0LCB0aGVyZSBpc24ndCByZWFsbHkgdGhlIGdsb2JhbCBvcHRpb24uIEkgbXVzdCBsaXN0ZW4gYnkgYWRkaW5nIG15IG93biBsaXN0ZW5lciBpbmRpdmlkdWFsbHkgQkVGT1JFIHRoaXMgb25lIGlzIGV2ZXIgY2FsbGVkLlxyXG5cdFx0XHRyZXR1cm4gY2hhaW47XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBvdXRwdXQoYXQpe1xyXG5cdFx0XHR2YXIgY2F0ID0gdGhpcy5hcywgZ3VuID0gY2F0Lmd1biwgcm9vdCA9IGd1bi5iYWNrKC0xKSwgcHV0LCBnZXQsIG5vdywgdG1wO1xyXG5cdFx0XHRpZighYXQuZ3VuKXtcclxuXHRcdFx0XHRhdC5ndW4gPSBndW47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoZ2V0ID0gYXQuZ2V0KXtcclxuXHRcdFx0XHRpZih0bXAgPSBnZXRbX3NvdWxdKXtcclxuXHRcdFx0XHRcdHRtcCA9IChyb290LmdldCh0bXApLl8pO1xyXG5cdFx0XHRcdFx0aWYob2JqX2hhcyhnZXQsIF9maWVsZCkpe1xyXG5cdFx0XHRcdFx0XHRpZihvYmpfaGFzKHB1dCA9IHRtcC5wdXQsIGdldCA9IGdldFtfZmllbGRdKSl7XHJcblx0XHRcdFx0XHRcdFx0dG1wLm9uKCdpbicsIHtnZXQ6IHRtcC5nZXQsIHB1dDogR3VuLnN0YXRlLnRvKHB1dCwgZ2V0KSwgZ3VuOiB0bXAuZ3VufSk7IC8vIFRPRE86IFVnbHksIGNsZWFuIHVwPyBTaW1wbGlmeSBhbGwgdGhlc2UgaWYgY29uZGl0aW9ucyAod2l0aG91dCBydWluaW5nIHRoZSB3aG9sZSBjaGFpbmluZyBBUEkpP1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9IGVsc2VcclxuXHRcdFx0XHRcdGlmKG9ial9oYXModG1wLCAncHV0Jykpe1xyXG5cdFx0XHRcdFx0Ly9pZih1ICE9PSB0bXAucHV0KXtcclxuXHRcdFx0XHRcdFx0dG1wLm9uKCdpbicsIHRtcCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmKG9ial9oYXMoZ2V0LCBfZmllbGQpKXtcclxuXHRcdFx0XHRcdFx0Z2V0ID0gZ2V0W19maWVsZF07XHJcblx0XHRcdFx0XHRcdHZhciBuZXh0ID0gZ2V0PyAoZ3VuLmdldChnZXQpLl8pIDogY2F0O1xyXG5cdFx0XHRcdFx0XHQvLyBUT0RPOiBCVUchIEhhbmRsZSBwbHVyYWwgY2hhaW5zIGJ5IGl0ZXJhdGluZyBvdmVyIHRoZW0uXHJcblx0XHRcdFx0XHRcdC8vaWYob2JqX2hhcyhuZXh0LCAncHV0JykpeyAvLyBwb3RlbnRpYWxseSBpbmNvcnJlY3Q/IE1heWJlP1xyXG5cdFx0XHRcdFx0XHRpZih1ICE9PSBuZXh0LnB1dCl7IC8vIHBvdGVudGlhbGx5IGluY29ycmVjdD8gTWF5YmU/XHJcblx0XHRcdFx0XHRcdFx0Ly9uZXh0LnRhZ1snaW4nXS5sYXN0Lm5leHQobmV4dCk7XHJcblx0XHRcdFx0XHRcdFx0bmV4dC5vbignaW4nLCBuZXh0KTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYob2JqX2hhcyhjYXQsICdwdXQnKSl7XHJcblx0XHRcdFx0XHRcdC8vaWYodSAhPT0gY2F0LnB1dCl7XHJcblx0XHRcdFx0XHRcdFx0dmFyIHZhbCA9IGNhdC5wdXQsIHJlbDtcclxuXHRcdFx0XHRcdFx0XHRpZihyZWwgPSBHdW4ubm9kZS5zb3VsKHZhbCkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFsID0gR3VuLnZhbC5yZWwuaWZ5KHJlbCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGlmKHJlbCA9IEd1bi52YWwucmVsLmlzKHZhbCkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYoIWF0Lmd1bi5fKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdFx0XHRcdChhdC5ndW4uXykub24oJ291dCcsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Z2V0OiB0bXAgPSB7JyMnOiByZWwsICcuJzogZ2V0LCBndW46IGF0Lmd1bn0sXHJcblx0XHRcdFx0XHRcdFx0XHRcdCcjJzogcm9vdC5fLmFzayhHdW4uSEFNLnN5bnRoLCB0bXApLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRndW46IGF0Lmd1blxyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGlmKHUgPT09IHZhbCB8fCBHdW4udmFsLmlzKHZhbCkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYoIWF0Lmd1bi5fKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdFx0XHRcdChhdC5ndW4uXykub24oJ2luJywge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRnZXQ6IGdldCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0Z3VuOiBhdC5ndW5cclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSBlbHNlXHJcblx0XHRcdFx0XHRcdGlmKGNhdC5tYXApe1xyXG5cdFx0XHRcdFx0XHRcdG9ial9tYXAoY2F0Lm1hcCwgZnVuY3Rpb24ocHJveHkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0cHJveHkuYXQub24oJ2luJywgcHJveHkuYXQpO1xyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRpZihjYXQuc291bCl7XHJcblx0XHRcdFx0XHRcdFx0aWYoIWF0Lmd1bi5fKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdFx0XHQoYXQuZ3VuLl8pLm9uKCdvdXQnLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRnZXQ6IHRtcCA9IHsnIyc6IGNhdC5zb3VsLCAnLic6IGdldCwgZ3VuOiBhdC5ndW59LFxyXG5cdFx0XHRcdFx0XHRcdFx0JyMnOiByb290Ll8uYXNrKEd1bi5IQU0uc3ludGgsIHRtcCksXHJcblx0XHRcdFx0XHRcdFx0XHRndW46IGF0Lmd1blxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZihjYXQuZ2V0KXtcclxuXHRcdFx0XHRcdFx0XHRpZighY2F0LmJhY2suXyl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRcdFx0KGNhdC5iYWNrLl8pLm9uKCdvdXQnLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRnZXQ6IG9ial9wdXQoe30sIF9maWVsZCwgY2F0LmdldCksXHJcblx0XHRcdFx0XHRcdFx0XHRndW46IGd1blxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRhdCA9IG9ial90byhhdCwge2dldDoge319KTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGlmKG9ial9oYXMoY2F0LCAncHV0Jykpe1xyXG5cdFx0XHRcdFx0XHQvL2lmKHUgIT09IGNhdC5wdXQpe1xyXG5cdFx0XHRcdFx0XHRcdGNhdC5vbignaW4nLCBjYXQpO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2VcclxuXHRcdFx0XHRcdFx0aWYoY2F0Lm1hcCl7XHJcblx0XHRcdFx0XHRcdFx0b2JqX21hcChjYXQubWFwLCBmdW5jdGlvbihwcm94eSl7XHJcblx0XHRcdFx0XHRcdFx0XHRwcm94eS5hdC5vbignaW4nLCBwcm94eS5hdCk7XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYoY2F0LmFjayl7XHJcblx0XHRcdFx0XHRcdFx0aWYoIW9ial9oYXMoY2F0LCAncHV0JykpeyAvLyB1ICE9PSBjYXQucHV0IGluc3RlYWQ/XHJcblx0XHRcdFx0XHRcdFx0Ly9pZih1ICE9PSBjYXQucHV0KXtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0Y2F0LmFjayA9IC0xO1xyXG5cdFx0XHRcdFx0XHRpZihjYXQuc291bCl7XHJcblx0XHRcdFx0XHRcdFx0Y2F0Lm9uKCdvdXQnLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRnZXQ6IHRtcCA9IHsnIyc6IGNhdC5zb3VsLCBndW46IGNhdC5ndW59LFxyXG5cdFx0XHRcdFx0XHRcdFx0JyMnOiByb290Ll8uYXNrKEd1bi5IQU0uc3ludGgsIHRtcCksXHJcblx0XHRcdFx0XHRcdFx0XHRndW46IGNhdC5ndW5cclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYoY2F0LmdldCl7XHJcblx0XHRcdFx0XHRcdFx0aWYoIWNhdC5iYWNrLl8peyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0XHRcdChjYXQuYmFjay5fKS5vbignb3V0Jywge1xyXG5cdFx0XHRcdFx0XHRcdFx0Z2V0OiBvYmpfcHV0KHt9LCBfZmllbGQsIGNhdC5nZXQpLFxyXG5cdFx0XHRcdFx0XHRcdFx0Z3VuOiBjYXQuZ3VuXHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdChjYXQuYmFjay5fKS5vbignb3V0JywgYXQpO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gaW5wdXQoYXQpe1xyXG5cdFx0XHRhdCA9IGF0Ll8gfHwgYXQ7XHJcblx0XHRcdHZhciBldiA9IHRoaXMsIGNhdCA9IHRoaXMuYXMsIGd1biA9IGF0Lmd1biwgY29hdCA9IGd1bi5fLCBjaGFuZ2UgPSBhdC5wdXQsIGJhY2sgPSBjYXQuYmFjay5fIHx8IGVtcHR5LCByZWwsIHRtcDtcclxuXHRcdFx0aWYoMCA+IGNhdC5hY2sgJiYgIWF0LmFjayAmJiAhR3VuLnZhbC5yZWwuaXMoY2hhbmdlKSl7IC8vIGZvciBiZXR0ZXIgYmVoYXZpb3I/XHJcblx0XHRcdFx0Y2F0LmFjayA9IDE7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY2F0LmdldCAmJiBhdC5nZXQgIT09IGNhdC5nZXQpe1xyXG5cdFx0XHRcdGF0ID0gb2JqX3RvKGF0LCB7Z2V0OiBjYXQuZ2V0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY2F0LmZpZWxkICYmIGNvYXQgIT09IGNhdCl7XHJcblx0XHRcdFx0YXQgPSBvYmpfdG8oYXQsIHtndW46IGNhdC5ndW59KTtcclxuXHRcdFx0XHRpZihjb2F0LmFjayl7XHJcblx0XHRcdFx0XHRjYXQuYWNrID0gY2F0LmFjayB8fCBjb2F0LmFjaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYodSA9PT0gY2hhbmdlKXtcclxuXHRcdFx0XHRldi50by5uZXh0KGF0KTtcclxuXHRcdFx0XHRpZihjYXQuc291bCl7IHJldHVybiB9XHJcblx0XHRcdFx0ZWNobyhjYXQsIGF0LCBldik7XHJcblx0XHRcdFx0aWYoY2F0LmZpZWxkKXtcclxuXHRcdFx0XHRcdG5vdChjYXQsIGF0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0b2JqX2RlbChjb2F0LmVjaG8sIGNhdC5pZCk7XHJcblx0XHRcdFx0b2JqX2RlbChjYXQubWFwLCBjb2F0LmlkKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY2F0LnNvdWwpe1xyXG5cdFx0XHRcdGlmKGNhdC5yb290Ll8ubm93KXsgYXQgPSBvYmpfdG8oYXQsIHtwdXQ6IGNoYW5nZSA9IGNvYXQucHV0fSkgfSAvLyBUT0RPOiBVZ2x5IGhhY2sgZm9yIHVuY2FjaGVkIHN5bmNocm9ub3VzIG1hcHMuXHJcblx0XHRcdFx0ZXYudG8ubmV4dChhdCk7XHJcblx0XHRcdFx0ZWNobyhjYXQsIGF0LCBldik7XHJcblx0XHRcdFx0b2JqX21hcChjaGFuZ2UsIG1hcCwge2F0OiBhdCwgY2F0OiBjYXR9KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoIShyZWwgPSBHdW4udmFsLnJlbC5pcyhjaGFuZ2UpKSl7XHJcblx0XHRcdFx0aWYoR3VuLnZhbC5pcyhjaGFuZ2UpKXtcclxuXHRcdFx0XHRcdGlmKGNhdC5maWVsZCB8fCBjYXQuc291bCl7XHJcblx0XHRcdFx0XHRcdG5vdChjYXQsIGF0KTtcclxuXHRcdFx0XHRcdH0gZWxzZVxyXG5cdFx0XHRcdFx0aWYoY29hdC5maWVsZCB8fCBjb2F0LnNvdWwpe1xyXG5cdFx0XHRcdFx0XHQoY29hdC5lY2hvIHx8IChjb2F0LmVjaG8gPSB7fSkpW2NhdC5pZF0gPSBjYXQ7XHJcblx0XHRcdFx0XHRcdChjYXQubWFwIHx8IChjYXQubWFwID0ge30pKVtjb2F0LmlkXSA9IGNhdC5tYXBbY29hdC5pZF0gfHwge2F0OiBjb2F0fTtcclxuXHRcdFx0XHRcdFx0Ly9pZih1ID09PSBjb2F0LnB1dCl7IHJldHVybiB9IC8vIE5vdCBuZWNlc3NhcnkgYnV0IGltcHJvdmVzIHBlcmZvcm1hbmNlLiBJZiB3ZSBoYXZlIGl0IGJ1dCBjb2F0IGRvZXMgbm90LCB0aGF0IG1lYW5zIHdlIGdvdCB0aGluZ3Mgb3V0IG9mIG9yZGVyIGFuZCBjb2F0IHdpbGwgZ2V0IGl0LiBPbmNlIGNvYXQgZ2V0cyBpdCwgaXQgd2lsbCB0ZWxsIHVzIGFnYWluLlxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZXYudG8ubmV4dChhdCk7XHJcblx0XHRcdFx0XHRlY2hvKGNhdCwgYXQsIGV2KTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoY2F0LmZpZWxkICYmIGNvYXQgIT09IGNhdCAmJiBvYmpfaGFzKGNvYXQsICdwdXQnKSl7XHJcblx0XHRcdFx0XHRjYXQucHV0ID0gY29hdC5wdXQ7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRpZigocmVsID0gR3VuLm5vZGUuc291bChjaGFuZ2UpKSAmJiBjb2F0LmZpZWxkKXtcclxuXHRcdFx0XHRcdGNvYXQucHV0ID0gKGNhdC5yb290LmdldChyZWwpLl8pLnB1dDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZXYudG8ubmV4dChhdCk7XHJcblx0XHRcdFx0ZWNobyhjYXQsIGF0LCBldik7XHJcblx0XHRcdFx0cmVsYXRlKGNhdCwgYXQsIGNvYXQsIHJlbCk7XHJcblx0XHRcdFx0b2JqX21hcChjaGFuZ2UsIG1hcCwge2F0OiBhdCwgY2F0OiBjYXR9KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0cmVsYXRlKGNhdCwgYXQsIGNvYXQsIHJlbCk7XHJcblx0XHRcdGV2LnRvLm5leHQoYXQpO1xyXG5cdFx0XHRlY2hvKGNhdCwgYXQsIGV2KTtcclxuXHRcdH1cclxuXHRcdEd1bi5jaGFpbi5jaGFpbi5pbnB1dCA9IGlucHV0O1xyXG5cdFx0ZnVuY3Rpb24gcmVsYXRlKGNhdCwgYXQsIGNvYXQsIHJlbCl7XHJcblx0XHRcdGlmKCFyZWwgfHwgbm9kZV8gPT09IGNhdC5nZXQpeyByZXR1cm4gfVxyXG5cdFx0XHR2YXIgdG1wID0gKGNhdC5yb290LmdldChyZWwpLl8pO1xyXG5cdFx0XHRpZihjYXQuZmllbGQpe1xyXG5cdFx0XHRcdGNvYXQgPSB0bXA7XHJcblx0XHRcdH0gZWxzZSBcclxuXHRcdFx0aWYoY29hdC5maWVsZCl7XHJcblx0XHRcdFx0cmVsYXRlKGNvYXQsIGF0LCBjb2F0LCByZWwpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNvYXQgPT09IGNhdCl7IHJldHVybiB9XHJcblx0XHRcdChjb2F0LmVjaG8gfHwgKGNvYXQuZWNobyA9IHt9KSlbY2F0LmlkXSA9IGNhdDtcclxuXHRcdFx0aWYoY2F0LmZpZWxkICYmICEoY2F0Lm1hcHx8ZW1wdHkpW2NvYXQuaWRdKXtcclxuXHRcdFx0XHRub3QoY2F0LCBhdCk7XHJcblx0XHRcdH1cclxuXHRcdFx0dG1wID0gKGNhdC5tYXAgfHwgKGNhdC5tYXAgPSB7fSkpW2NvYXQuaWRdID0gY2F0Lm1hcFtjb2F0LmlkXSB8fCB7YXQ6IGNvYXR9O1xyXG5cdFx0XHRpZihyZWwgPT09IHRtcC5yZWwpeyByZXR1cm4gfVxyXG5cdFx0XHRhc2soY2F0LCB0bXAucmVsID0gcmVsKTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIGVjaG8oY2F0LCBhdCwgZXYpe1xyXG5cdFx0XHRpZighY2F0LmVjaG8peyByZXR1cm4gfSAvLyB8fCBub2RlXyA9PT0gYXQuZ2V0ID8/Pz9cclxuXHRcdFx0aWYoY2F0LmZpZWxkKXsgYXQgPSBvYmpfdG8oYXQsIHtldmVudDogZXZ9KSB9XHJcblx0XHRcdG9ial9tYXAoY2F0LmVjaG8sIHJldmVyYiwgYXQpO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gcmV2ZXJiKGNhdCl7XHJcblx0XHRcdGNhdC5vbignaW4nLCB0aGlzKTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIG1hcChkYXRhLCBrZXkpeyAvLyBNYXAgb3ZlciBvbmx5IHRoZSBjaGFuZ2VzIG9uIGV2ZXJ5IHVwZGF0ZS5cclxuXHRcdFx0dmFyIGNhdCA9IHRoaXMuY2F0LCBuZXh0ID0gY2F0Lm5leHQgfHwgZW1wdHksIHZpYSA9IHRoaXMuYXQsIGd1biwgY2hhaW4sIGF0LCB0bXA7XHJcblx0XHRcdGlmKG5vZGVfID09PSBrZXkgJiYgIW5leHRba2V5XSl7IHJldHVybiB9XHJcblx0XHRcdGlmKCEoZ3VuID0gbmV4dFtrZXldKSl7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGF0ID0gKGd1bi5fKTtcclxuXHRcdFx0Ly9pZihkYXRhICYmIGRhdGFbX3NvdWxdICYmICh0bXAgPSBHdW4udmFsLnJlbC5pcyhkYXRhKSkgJiYgKHRtcCA9IChjYXQucm9vdC5nZXQodG1wKS5fKSkgJiYgb2JqX2hhcyh0bXAsICdwdXQnKSl7XHJcblx0XHRcdC8vXHRkYXRhID0gdG1wLnB1dDtcclxuXHRcdFx0Ly99XHJcblx0XHRcdGlmKGF0LmZpZWxkKXtcclxuXHRcdFx0XHRpZighKGRhdGEgJiYgZGF0YVtfc291bF0gJiYgR3VuLnZhbC5yZWwuaXMoZGF0YSkgPT09IEd1bi5ub2RlLnNvdWwoYXQucHV0KSkpe1xyXG5cdFx0XHRcdFx0YXQucHV0ID0gZGF0YTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2hhaW4gPSBndW47XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y2hhaW4gPSB2aWEuZ3VuLmdldChrZXkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGF0Lm9uKCdpbicsIHtcclxuXHRcdFx0XHRwdXQ6IGRhdGEsXHJcblx0XHRcdFx0Z2V0OiBrZXksXHJcblx0XHRcdFx0Z3VuOiBjaGFpbixcclxuXHRcdFx0XHR2aWE6IHZpYVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIG5vdChjYXQsIGF0KXtcclxuXHRcdFx0aWYoIShjYXQuZmllbGQgfHwgY2F0LnNvdWwpKXsgcmV0dXJuIH1cclxuXHRcdFx0dmFyIHRtcCA9IGNhdC5tYXA7XHJcblx0XHRcdGNhdC5tYXAgPSBudWxsO1xyXG5cdFx0XHRpZihudWxsID09PSB0bXApeyByZXR1cm4gfVxyXG5cdFx0XHRpZih1ID09PSB0bXAgJiYgY2F0LnB1dCAhPT0gdSl7IHJldHVybiB9IC8vIFRPRE86IEJ1Zz8gVGhyZXcgc2Vjb25kIGNvbmRpdGlvbiBpbiBmb3IgYSBwYXJ0aWN1bGFyIHRlc3QsIG5vdCBzdXJlIGlmIGEgY291bnRlciBleGFtcGxlIGlzIHRlc3RlZCB0aG91Z2guXHJcblx0XHRcdG9ial9tYXAodG1wLCBmdW5jdGlvbihwcm94eSl7XHJcblx0XHRcdFx0aWYoIShwcm94eSA9IHByb3h5LmF0KSl7IHJldHVybiB9XHJcblx0XHRcdFx0b2JqX2RlbChwcm94eS5lY2hvLCBjYXQuaWQpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0b2JqX21hcChjYXQubmV4dCwgZnVuY3Rpb24oZ3VuLCBrZXkpe1xyXG5cdFx0XHRcdHZhciBjb2F0ID0gKGd1bi5fKTtcclxuXHRcdFx0XHRjb2F0LnB1dCA9IHU7XHJcblx0XHRcdFx0aWYoY29hdC5hY2spe1xyXG5cdFx0XHRcdFx0Y29hdC5hY2sgPSAtMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y29hdC5vbignaW4nLCB7XHJcblx0XHRcdFx0XHRnZXQ6IGtleSxcclxuXHRcdFx0XHRcdGd1bjogZ3VuLFxyXG5cdFx0XHRcdFx0cHV0OiB1XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gYXNrKGNhdCwgc291bCl7XHJcblx0XHRcdHZhciB0bXAgPSAoY2F0LnJvb3QuZ2V0KHNvdWwpLl8pO1xyXG5cdFx0XHRpZihjYXQuYWNrKXtcclxuXHRcdFx0XHR0bXAuYWNrID0gdG1wLmFjayB8fCAtMTtcclxuXHRcdFx0XHR0bXAub24oJ291dCcsIHtcclxuXHRcdFx0XHRcdGdldDogdG1wID0geycjJzogc291bCwgZ3VuOiB0bXAuZ3VufSxcclxuXHRcdFx0XHRcdCcjJzogY2F0LnJvb3QuXy5hc2soR3VuLkhBTS5zeW50aCwgdG1wKVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRvYmpfbWFwKGNhdC5uZXh0LCBmdW5jdGlvbihndW4sIGtleSl7XHJcblx0XHRcdFx0KGd1bi5fKS5vbignb3V0Jywge1xyXG5cdFx0XHRcdFx0Z2V0OiBndW4gPSB7JyMnOiBzb3VsLCAnLic6IGtleSwgZ3VuOiBndW59LFxyXG5cdFx0XHRcdFx0JyMnOiBjYXQucm9vdC5fLmFzayhHdW4uSEFNLnN5bnRoLCBndW4pXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0dmFyIGVtcHR5ID0ge30sIHU7XHJcblx0XHR2YXIgb2JqID0gR3VuLm9iaiwgb2JqX2hhcyA9IG9iai5oYXMsIG9ial9wdXQgPSBvYmoucHV0LCBvYmpfZGVsID0gb2JqLmRlbCwgb2JqX3RvID0gb2JqLnRvLCBvYmpfbWFwID0gb2JqLm1hcDtcclxuXHRcdHZhciBfc291bCA9IEd1bi5fLnNvdWwsIF9maWVsZCA9IEd1bi5fLmZpZWxkLCBub2RlXyA9IEd1bi5ub2RlLl87XHJcblx0fSkocmVxdWlyZSwgJy4vY2hhaW4nKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL3Jvb3QnKTtcclxuXHRcdEd1bi5jaGFpbi5nZXQgPSBmdW5jdGlvbihrZXksIGNiLCBhcyl7XHJcblx0XHRcdGlmKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnKXtcclxuXHRcdFx0XHR2YXIgZ3VuLCBiYWNrID0gdGhpcywgY2F0ID0gYmFjay5fO1xyXG5cdFx0XHRcdHZhciBuZXh0ID0gY2F0Lm5leHQgfHwgZW1wdHksIHRtcDtcclxuXHRcdFx0XHRpZighKGd1biA9IG5leHRba2V5XSkpe1xyXG5cdFx0XHRcdFx0Z3VuID0gY2FjaGUoa2V5LCBiYWNrKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZVxyXG5cdFx0XHRpZihrZXkgaW5zdGFuY2VvZiBGdW5jdGlvbil7XHJcblx0XHRcdFx0dmFyIGd1biA9IHRoaXMsIGF0ID0gZ3VuLl87XHJcblx0XHRcdFx0YXMgPSBjYiB8fCB7fTtcclxuXHRcdFx0XHRhcy51c2UgPSBrZXk7XHJcblx0XHRcdFx0YXMub3V0ID0gYXMub3V0IHx8IHtjYXA6IDF9O1xyXG5cdFx0XHRcdGFzLm91dC5nZXQgPSBhcy5vdXQuZ2V0IHx8IHt9O1xyXG5cdFx0XHRcdCdfJyAhPSBhdC5nZXQgJiYgKChhdC5yb290Ll8pLm5vdyA9IHRydWUpOyAvLyB1Z2x5IGhhY2sgZm9yIG5vdy5cclxuXHRcdFx0XHRhdC5vbignaW4nLCB1c2UsIGFzKTtcclxuXHRcdFx0XHRhdC5vbignb3V0JywgYXMub3V0KTtcclxuXHRcdFx0XHQoYXQucm9vdC5fKS5ub3cgPSBmYWxzZTtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9IGVsc2VcclxuXHRcdFx0aWYobnVtX2lzKGtleSkpe1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmdldCgnJytrZXksIGNiLCBhcyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0KGFzID0gdGhpcy5jaGFpbigpKS5fLmVyciA9IHtlcnI6IEd1bi5sb2coJ0ludmFsaWQgZ2V0IHJlcXVlc3QhJywga2V5KX07IC8vIENMRUFOIFVQXHJcblx0XHRcdFx0aWYoY2IpeyBjYi5jYWxsKGFzLCBhcy5fLmVycikgfVxyXG5cdFx0XHRcdHJldHVybiBhcztcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih0bXAgPSBjYXQuc3R1bil7IC8vIFRPRE86IFJlZmFjdG9yP1xyXG5cdFx0XHRcdGd1bi5fLnN0dW4gPSBndW4uXy5zdHVuIHx8IHRtcDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjYiAmJiBjYiBpbnN0YW5jZW9mIEZ1bmN0aW9uKXtcclxuXHRcdFx0XHRndW4uZ2V0KGNiLCBhcyk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIGNhY2hlKGtleSwgYmFjayl7XHJcblx0XHRcdHZhciBjYXQgPSBiYWNrLl8sIG5leHQgPSBjYXQubmV4dCwgZ3VuID0gYmFjay5jaGFpbigpLCBhdCA9IGd1bi5fO1xyXG5cdFx0XHRpZighbmV4dCl7IG5leHQgPSBjYXQubmV4dCA9IHt9IH1cclxuXHRcdFx0bmV4dFthdC5nZXQgPSBrZXldID0gZ3VuO1xyXG5cdFx0XHRpZihjYXQucm9vdCA9PT0gYmFjayl7IGF0LnNvdWwgPSBrZXkgfVxyXG5cdFx0XHRlbHNlIGlmKGNhdC5zb3VsIHx8IGNhdC5maWVsZCl7IGF0LmZpZWxkID0ga2V5IH1cclxuXHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIHVzZShhdCl7XHJcblx0XHRcdHZhciBldiA9IHRoaXMsIGFzID0gZXYuYXMsIGd1biA9IGF0Lmd1biwgY2F0ID0gZ3VuLl8sIGRhdGEgPSBhdC5wdXQsIHRtcDtcclxuXHRcdFx0aWYodSA9PT0gZGF0YSl7XHJcblx0XHRcdFx0ZGF0YSA9IGNhdC5wdXQ7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoKHRtcCA9IGRhdGEpICYmIHRtcFtyZWwuX10gJiYgKHRtcCA9IHJlbC5pcyh0bXApKSl7XHJcblx0XHRcdFx0dG1wID0gKGNhdC5yb290LmdldCh0bXApLl8pO1xyXG5cdFx0XHRcdGlmKHUgIT09IHRtcC5wdXQpe1xyXG5cdFx0XHRcdFx0YXQgPSBvYmpfdG8oYXQsIHtwdXQ6IHRtcC5wdXR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0YXMudXNlKGF0LCBhdC5ldmVudCB8fCBldik7XHJcblx0XHRcdGV2LnRvLm5leHQoYXQpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIG9iaiA9IEd1bi5vYmosIG9ial9oYXMgPSBvYmouaGFzLCBvYmpfdG8gPSBHdW4ub2JqLnRvO1xyXG5cdFx0dmFyIG51bV9pcyA9IEd1bi5udW0uaXM7XHJcblx0XHR2YXIgcmVsID0gR3VuLnZhbC5yZWwsIG5vZGVfID0gR3VuLm5vZGUuXztcclxuXHRcdHZhciBlbXB0eSA9IHt9LCB1O1xyXG5cdH0pKHJlcXVpcmUsICcuL2dldCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vcm9vdCcpO1xyXG5cdFx0R3VuLmNoYWluLnB1dCA9IGZ1bmN0aW9uKGRhdGEsIGNiLCBhcyl7XHJcblx0XHRcdC8vICNzb3VsLmZpZWxkPXZhbHVlPnN0YXRlXHJcblx0XHRcdC8vIH53aG8jd2hlcmUud2hlcmU9d2hhdD53aGVuQHdhc1xyXG5cdFx0XHQvLyBUT0RPOiBCVUchIFB1dCBwcm9iYWJseSBjYW5ub3QgaGFuZGxlIHBsdXJhbCBjaGFpbnMhXHJcblx0XHRcdHZhciBndW4gPSB0aGlzLCBhdCA9IChndW4uXyksIHJvb3QgPSBhdC5yb290LCB0bXA7XHJcblx0XHRcdGFzID0gYXMgfHwge307XHJcblx0XHRcdGFzLmRhdGEgPSBkYXRhO1xyXG5cdFx0XHRhcy5ndW4gPSBhcy5ndW4gfHwgZ3VuO1xyXG5cdFx0XHRpZih0eXBlb2YgY2IgPT09ICdzdHJpbmcnKXtcclxuXHRcdFx0XHRhcy5zb3VsID0gY2I7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0YXMuYWNrID0gY2I7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoYXQuc291bCl7XHJcblx0XHRcdFx0YXMuc291bCA9IGF0LnNvdWw7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoYXMuc291bCB8fCByb290ID09PSBndW4pe1xyXG5cdFx0XHRcdGlmKCFvYmpfaXMoYXMuZGF0YSkpe1xyXG5cdFx0XHRcdFx0KGFzLmFja3x8bm9vcCkuY2FsbChhcywgYXMub3V0ID0ge2VycjogR3VuLmxvZyhcIkRhdGEgc2F2ZWQgdG8gdGhlIHJvb3QgbGV2ZWwgb2YgdGhlIGdyYXBoIG11c3QgYmUgYSBub2RlIChhbiBvYmplY3QpLCBub3QgYVwiLCAodHlwZW9mIGFzLmRhdGEpLCAnb2YgXCInICsgYXMuZGF0YSArICdcIiEnKX0pO1xyXG5cdFx0XHRcdFx0aWYoYXMucmVzKXsgYXMucmVzKCkgfVxyXG5cdFx0XHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YXMuZ3VuID0gZ3VuID0gcm9vdC5nZXQoYXMuc291bCA9IGFzLnNvdWwgfHwgKGFzLm5vdCA9IEd1bi5ub2RlLnNvdWwoYXMuZGF0YSkgfHwgKChyb290Ll8pLm9wdC51dWlkIHx8IEd1bi50ZXh0LnJhbmRvbSkoKSkpO1xyXG5cdFx0XHRcdGFzLnJlZiA9IGFzLmd1bjtcclxuXHRcdFx0XHRpZnkoYXMpO1xyXG5cdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoR3VuLmlzKGRhdGEpKXtcclxuXHRcdFx0XHRkYXRhLmdldChmdW5jdGlvbihhdCxldil7ZXYub2ZmKCk7XHJcblx0XHRcdFx0XHR2YXIgcyA9IEd1bi5ub2RlLnNvdWwoYXQucHV0KTtcclxuXHRcdFx0XHRcdGlmKCFzKXtHdW4ubG9nKFwiVGhlIHJlZmVyZW5jZSB5b3UgYXJlIHNhdmluZyBpcyBhXCIsIHR5cGVvZiBhdC5wdXQsICdcIicrIGFzLnB1dCArJ1wiLCBub3QgYSBub2RlIChvYmplY3QpIScpO3JldHVybn1cclxuXHRcdFx0XHRcdGd1bi5wdXQoR3VuLnZhbC5yZWwuaWZ5KHMpLCBjYiwgYXMpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdH1cclxuXHRcdFx0YXMucmVmID0gYXMucmVmIHx8IChyb290ID09PSAodG1wID0gYXQuYmFjaykpPyBndW4gOiB0bXA7XHJcblx0XHRcdGlmKGFzLnJlZi5fLnNvdWwgJiYgR3VuLnZhbC5pcyhhcy5kYXRhKSAmJiBhdC5nZXQpe1xyXG5cdFx0XHRcdGFzLmRhdGEgPSBvYmpfcHV0KHt9LCBhdC5nZXQsIGFzLmRhdGEpO1xyXG5cdFx0XHRcdGFzLnJlZi5wdXQoYXMuZGF0YSwgYXMuc291bCwgYXMpO1xyXG5cdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdH1cclxuXHRcdFx0YXMucmVmLmdldCgnXycpLmdldChhbnksIHthczogYXN9KTtcclxuXHRcdFx0aWYoIWFzLm91dCl7XHJcblx0XHRcdFx0Ly8gVE9ETzogUGVyZiBpZGVhISBNYWtlIGEgZ2xvYmFsIGxvY2ssIHRoYXQgYmxvY2tzIGV2ZXJ5dGhpbmcgd2hpbGUgaXQgaXMgb24sIGJ1dCBpZiBpdCBpcyBvbiB0aGUgbG9jayBpdCBkb2VzIHRoZSBleHBlbnNpdmUgbG9va3VwIHRvIHNlZSBpZiBpdCBpcyBhIGRlcGVuZGVudCB3cml0ZSBvciBub3QgYW5kIGlmIG5vdCB0aGVuIGl0IHByb2NlZWRzIGZ1bGwgc3BlZWQuIE1laD8gRm9yIHdyaXRlIGhlYXZ5IGFzeW5jIGFwcHMgdGhhdCB3b3VsZCBiZSB0ZXJyaWJsZS5cclxuXHRcdFx0XHRhcy5yZXMgPSBhcy5yZXMgfHwgR3VuLm9uLnN0dW4oYXMucmVmKTtcclxuXHRcdFx0XHRhcy5ndW4uXy5zdHVuID0gYXMucmVmLl8uc3R1bjtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0fTtcclxuXHJcblx0XHRmdW5jdGlvbiBpZnkoYXMpe1xyXG5cdFx0XHRhcy5iYXRjaCA9IGJhdGNoO1xyXG5cdFx0XHR2YXIgb3B0ID0gYXMub3B0fHx7fSwgZW52ID0gYXMuZW52ID0gR3VuLnN0YXRlLm1hcChtYXAsIG9wdC5zdGF0ZSk7XHJcblx0XHRcdGVudi5zb3VsID0gYXMuc291bDtcclxuXHRcdFx0YXMuZ3JhcGggPSBHdW4uZ3JhcGguaWZ5KGFzLmRhdGEsIGVudiwgYXMpO1xyXG5cdFx0XHRpZihlbnYuZXJyKXtcclxuXHRcdFx0XHQoYXMuYWNrfHxub29wKS5jYWxsKGFzLCBhcy5vdXQgPSB7ZXJyOiBHdW4ubG9nKGVudi5lcnIpfSk7XHJcblx0XHRcdFx0aWYoYXMucmVzKXsgYXMucmVzKCkgfVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRhcy5iYXRjaCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGJhdGNoKCl7IHZhciBhcyA9IHRoaXM7XHJcblx0XHRcdGlmKCFhcy5ncmFwaCB8fCBvYmpfbWFwKGFzLnN0dW4sIG5vKSl7IHJldHVybiB9XHJcblx0XHRcdChhcy5yZXN8fGlpZmUpKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0KGFzLnJlZi5fKS5vbignb3V0Jywge1xyXG5cdFx0XHRcdFx0Y2FwOiAzLFxyXG5cdFx0XHRcdFx0Z3VuOiBhcy5yZWYsIHB1dDogYXMub3V0ID0gYXMuZW52LmdyYXBoLCBvcHQ6IGFzLm9wdCxcclxuXHRcdFx0XHRcdCcjJzogYXMuZ3VuLmJhY2soLTEpLl8uYXNrKGZ1bmN0aW9uKGFjayl7IHRoaXMub2ZmKCk7IC8vIE9uZSByZXNwb25zZSBpcyBnb29kIGVub3VnaCBmb3IgdXMgY3VycmVudGx5LiBMYXRlciB3ZSBtYXkgd2FudCB0byBhZGp1c3QgdGhpcy5cclxuXHRcdFx0XHRcdFx0aWYoIWFzLmFjayl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRcdGFzLmFjayhhY2ssIHRoaXMpO1xyXG5cdFx0XHRcdFx0fSwgYXMub3B0KVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9LCBhcyk7XHJcblx0XHRcdGlmKGFzLnJlcyl7IGFzLnJlcygpIH1cclxuXHRcdH0gZnVuY3Rpb24gbm8odixmKXsgaWYodil7IHJldHVybiB0cnVlIH0gfVxyXG5cclxuXHRcdGZ1bmN0aW9uIG1hcCh2LGYsbiwgYXQpeyB2YXIgYXMgPSB0aGlzO1xyXG5cdFx0XHRpZihmIHx8ICFhdC5wYXRoLmxlbmd0aCl7IHJldHVybiB9XHJcblx0XHRcdChhcy5yZXN8fGlpZmUpKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIHBhdGggPSBhdC5wYXRoLCByZWYgPSBhcy5yZWYsIG9wdCA9IGFzLm9wdDtcclxuXHRcdFx0XHR2YXIgaSA9IDAsIGwgPSBwYXRoLmxlbmd0aDtcclxuXHRcdFx0XHRmb3IoaTsgaSA8IGw7IGkrKyl7XHJcblx0XHRcdFx0XHRyZWYgPSByZWYuZ2V0KHBhdGhbaV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihhcy5ub3QgfHwgR3VuLm5vZGUuc291bChhdC5vYmopKXtcclxuXHRcdFx0XHRcdHZhciBpZCA9IEd1bi5ub2RlLnNvdWwoYXQub2JqKSB8fCAoKGFzLm9wdHx8e30pLnV1aWQgfHwgYXMuZ3VuLmJhY2soJ29wdC51dWlkJykgfHwgR3VuLnRleHQucmFuZG9tKSgpO1xyXG5cdFx0XHRcdFx0cmVmLmJhY2soLTEpLmdldChpZCk7XHJcblx0XHRcdFx0XHRhdC5zb3VsKGlkKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0KGFzLnN0dW4gPSBhcy5zdHVuIHx8IHt9KVtwYXRoXSA9IHRydWU7XHJcblx0XHRcdFx0cmVmLmdldCgnXycpLmdldChzb3VsLCB7YXM6IHthdDogYXQsIGFzOiBhc319KTtcclxuXHRcdFx0fSwge2FzOiBhcywgYXQ6IGF0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gc291bChhdCwgZXYpeyB2YXIgYXMgPSB0aGlzLmFzLCBjYXQgPSBhcy5hdDsgYXMgPSBhcy5hcztcclxuXHRcdFx0Ly9ldi5zdHVuKCk7IC8vIFRPRE86IEJVRyE/XHJcblx0XHRcdGlmKCFhdC5ndW4gfHwgIWF0Lmd1bi5fLmJhY2speyByZXR1cm4gfSAvLyBUT0RPOiBIYW5kbGVcclxuXHRcdFx0ZXYub2ZmKCk7XHJcblx0XHRcdGF0ID0gKGF0Lmd1bi5fLmJhY2suXyk7XHJcblx0XHRcdHZhciBpZCA9IEd1bi5ub2RlLnNvdWwoY2F0Lm9iaikgfHwgR3VuLm5vZGUuc291bChhdC5wdXQpIHx8IEd1bi52YWwucmVsLmlzKGF0LnB1dCkgfHwgKChhcy5vcHR8fHt9KS51dWlkIHx8IGFzLmd1bi5iYWNrKCdvcHQudXVpZCcpIHx8IEd1bi50ZXh0LnJhbmRvbSkoKTsgLy8gVE9ETzogQlVHIT8gRG8gd2UgcmVhbGx5IHdhbnQgdGhlIHNvdWwgb2YgdGhlIG9iamVjdCBnaXZlbiB0byB1cz8gQ291bGQgdGhhdCBiZSBkYW5nZXJvdXM/XHJcblx0XHRcdGF0Lmd1bi5iYWNrKC0xKS5nZXQoaWQpO1xyXG5cdFx0XHRjYXQuc291bChpZCk7XHJcblx0XHRcdGFzLnN0dW5bY2F0LnBhdGhdID0gZmFsc2U7XHJcblx0XHRcdGFzLmJhdGNoKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gYW55KGF0LCBldil7XHJcblx0XHRcdHZhciBhcyA9IHRoaXMuYXM7XHJcblx0XHRcdGlmKCFhdC5ndW4gfHwgIWF0Lmd1bi5fKXsgcmV0dXJuIH0gLy8gVE9ETzogSGFuZGxlXHJcblx0XHRcdGlmKGF0LmVycil7IC8vIFRPRE86IEhhbmRsZVxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiUGxlYXNlIHJlcG9ydCB0aGlzIGFzIGFuIGlzc3VlISBQdXQuYW55LmVyclwiKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIGNhdCA9IChhdC5ndW4uXy5iYWNrLl8pLCBkYXRhID0gY2F0LnB1dCwgb3B0ID0gYXMub3B0fHx7fSwgcm9vdCwgdG1wO1xyXG5cdFx0XHRldi5vZmYoKTtcclxuXHRcdFx0aWYoYXMucmVmICE9PSBhcy5ndW4pe1xyXG5cdFx0XHRcdHRtcCA9IChhcy5ndW4uXykuZ2V0IHx8IGNhdC5nZXQ7XHJcblx0XHRcdFx0aWYoIXRtcCl7IC8vIFRPRE86IEhhbmRsZVxyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJQbGVhc2UgcmVwb3J0IHRoaXMgYXMgYW4gaXNzdWUhIFB1dC5uby5nZXRcIik7IC8vIFRPRE86IEJVRyE/P1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRhcy5kYXRhID0gb2JqX3B1dCh7fSwgdG1wLCBhcy5kYXRhKTtcclxuXHRcdFx0XHR0bXAgPSBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHUgPT09IGRhdGEpe1xyXG5cdFx0XHRcdGlmKCFjYXQuZ2V0KXsgcmV0dXJuIH0gLy8gVE9ETzogSGFuZGxlXHJcblx0XHRcdFx0aWYoIWNhdC5zb3VsKXtcclxuXHRcdFx0XHRcdHRtcCA9IGNhdC5ndW4uYmFjayhmdW5jdGlvbihhdCl7XHJcblx0XHRcdFx0XHRcdGlmKGF0LnNvdWwpeyByZXR1cm4gYXQuc291bCB9XHJcblx0XHRcdFx0XHRcdGFzLmRhdGEgPSBvYmpfcHV0KHt9LCBhdC5nZXQsIGFzLmRhdGEpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRtcCA9IHRtcCB8fCBjYXQuZ2V0O1xyXG5cdFx0XHRcdGNhdCA9IChjYXQucm9vdC5nZXQodG1wKS5fKTtcclxuXHRcdFx0XHRhcy5ub3QgPSBhcy5zb3VsID0gdG1wO1xyXG5cdFx0XHRcdGRhdGEgPSBhcy5kYXRhO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCFhcy5ub3QgJiYgIShhcy5zb3VsID0gR3VuLm5vZGUuc291bChkYXRhKSkpe1xyXG5cdFx0XHRcdGlmKGFzLnBhdGggJiYgb2JqX2lzKGFzLmRhdGEpKXsgLy8gQXBwYXJlbnRseSBuZWNlc3NhcnlcclxuXHRcdFx0XHRcdGFzLnNvdWwgPSAob3B0LnV1aWQgfHwgY2F0LnJvb3QuXy5vcHQudXVpZCB8fCBHdW4udGV4dC5yYW5kb20pKCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vYXMuZGF0YSA9IG9ial9wdXQoe30sIGFzLmd1bi5fLmdldCwgYXMuZGF0YSk7XHJcblx0XHRcdFx0XHRhcy5zb3VsID0gYXQuc291bCB8fCBjYXQuc291bCB8fCAob3B0LnV1aWQgfHwgY2F0LnJvb3QuXy5vcHQudXVpZCB8fCBHdW4udGV4dC5yYW5kb20pKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGFzLnJlZi5wdXQoYXMuZGF0YSwgYXMuc291bCwgYXMpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIG9iaiA9IEd1bi5vYmosIG9ial9pcyA9IG9iai5pcywgb2JqX3B1dCA9IG9iai5wdXQsIG9ial9tYXAgPSBvYmoubWFwO1xyXG5cdFx0dmFyIHUsIGVtcHR5ID0ge30sIG5vb3AgPSBmdW5jdGlvbigpe30sIGlpZmUgPSBmdW5jdGlvbihmbixhcyl7Zm4uY2FsbChhc3x8ZW1wdHkpfTtcclxuXHR9KShyZXF1aXJlLCAnLi9wdXQnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9yb290Jyk7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IEd1bjtcclxuXHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdGZ1bmN0aW9uIG1ldGEodixmKXtcclxuXHRcdFx0XHRpZihvYmpfaGFzKEd1bi5fXy5fLCBmKSl7IHJldHVybiB9XHJcblx0XHRcdFx0b2JqX3B1dCh0aGlzLl8sIGYsIHYpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcCh2YWx1ZSwgZmllbGQpe1xyXG5cdFx0XHRcdGlmKEd1bi5fLm5vZGUgPT09IGZpZWxkKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgbm9kZSA9IHRoaXMubm9kZSwgdmVydGV4ID0gdGhpcy52ZXJ0ZXgsIHVuaW9uID0gdGhpcy51bmlvbiwgbWFjaGluZSA9IHRoaXMubWFjaGluZTtcclxuXHRcdFx0XHR2YXIgaXMgPSBzdGF0ZV9pcyhub2RlLCBmaWVsZCksIGNzID0gc3RhdGVfaXModmVydGV4LCBmaWVsZCk7XHJcblx0XHRcdFx0aWYodSA9PT0gaXMgfHwgdSA9PT0gY3MpeyByZXR1cm4gdHJ1ZSB9IC8vIGl0IGlzIHRydWUgdGhhdCB0aGlzIGlzIGFuIGludmFsaWQgSEFNIGNvbXBhcmlzb24uXHJcblx0XHRcdFx0dmFyIGl2ID0gdmFsdWUsIGN2ID0gdmVydGV4W2ZpZWxkXTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cdFx0XHRcdC8vIFRPRE86IEJVRyEgTmVlZCB0byBjb21wYXJlIHJlbGF0aW9uIHRvIG5vdCByZWxhdGlvbiwgYW5kIGNob29zZSB0aGUgcmVsYXRpb24gaWYgdGhlcmUgaXMgYSBzdGF0ZSBjb25mbGljdC5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cdFx0XHRcdGlmKCF2YWxfaXMoaXYpICYmIHUgIT09IGl2KXsgcmV0dXJuIHRydWUgfSAvLyBVbmRlZmluZWQgaXMgb2theSBzaW5jZSBhIHZhbHVlIG1pZ2h0IG5vdCBleGlzdCBvbiBib3RoIG5vZGVzLiAvLyBpdCBpcyB0cnVlIHRoYXQgdGhpcyBpcyBhbiBpbnZhbGlkIEhBTSBjb21wYXJpc29uLlxyXG5cdFx0XHRcdGlmKCF2YWxfaXMoY3YpICYmIHUgIT09IGN2KXsgcmV0dXJuIHRydWUgfSAgLy8gVW5kZWZpbmVkIGlzIG9rYXkgc2luY2UgYSB2YWx1ZSBtaWdodCBub3QgZXhpc3Qgb24gYm90aCBub2Rlcy4gLy8gaXQgaXMgdHJ1ZSB0aGF0IHRoaXMgaXMgYW4gaW52YWxpZCBIQU0gY29tcGFyaXNvbi5cclxuXHRcdFx0XHR2YXIgSEFNID0gR3VuLkhBTShtYWNoaW5lLCBpcywgY3MsIGl2LCBjdik7XHJcblx0XHRcdFx0aWYoSEFNLmVycil7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIi4hSFlQT1RIRVRJQ0FMIEFNTkVTSUEgTUFDSElORSBFUlIhLlwiLCBmaWVsZCwgSEFNLmVycik7IC8vIHRoaXMgZXJyb3Igc2hvdWxkIG5ldmVyIGhhcHBlbi5cclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoSEFNLnN0YXRlIHx8IEhBTS5oaXN0b3JpY2FsIHx8IEhBTS5jdXJyZW50KXsgLy8gVE9ETzogQlVHISBOb3QgaW1wbGVtZW50ZWQuXHJcblx0XHRcdFx0XHQvL29wdC5sb3dlcih2ZXJ0ZXgsIHtmaWVsZDogZmllbGQsIHZhbHVlOiB2YWx1ZSwgc3RhdGU6IGlzfSk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKEhBTS5pbmNvbWluZyl7XHJcblx0XHRcdFx0XHR1bmlvbltmaWVsZF0gPSB2YWx1ZTtcclxuXHRcdFx0XHRcdHN0YXRlX2lmeSh1bmlvbiwgZmllbGQsIGlzKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoSEFNLmRlZmVyKXsgLy8gVE9ETzogQlVHISBOb3QgaW1wbGVtZW50ZWQuXHJcblx0XHRcdFx0XHR1bmlvbltmaWVsZF0gPSB2YWx1ZTsgLy8gV1JPTkchIEJVRyEgTmVlZCB0byBpbXBsZW1lbnQgY29ycmVjdCBhbGdvcml0aG0uXHJcblx0XHRcdFx0XHRzdGF0ZV9pZnkodW5pb24sIGZpZWxkLCBpcyk7IC8vIFdST05HISBCVUchIE5lZWQgdG8gaW1wbGVtZW50IGNvcnJlY3QgYWxnb3JpdGhtLlxyXG5cdFx0XHRcdFx0Ly8gZmlsbGVyIGFsZ29yaXRobSBmb3Igbm93LlxyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0Lyp1cHBlci53YWl0ID0gdHJ1ZTtcclxuXHRcdFx0XHRcdG9wdC51cHBlci5jYWxsKHN0YXRlLCB2ZXJ0ZXgsIGZpZWxkLCBpbmNvbWluZywgY3R4LmluY29taW5nLnN0YXRlKTsgLy8gc2lnbmFscyB0aGF0IHRoZXJlIGFyZSBzdGlsbCBmdXR1cmUgbW9kaWZpY2F0aW9ucy5cclxuXHRcdFx0XHRcdEd1bi5zY2hlZHVsZShjdHguaW5jb21pbmcuc3RhdGUsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRcdHVwZGF0ZShpbmNvbWluZywgZmllbGQpO1xyXG5cdFx0XHRcdFx0XHRpZihjdHguaW5jb21pbmcuc3RhdGUgPT09IHVwcGVyLm1heCl7ICh1cHBlci5sYXN0IHx8IGZ1bmN0aW9uKCl7fSkoKSB9XHJcblx0XHRcdFx0XHR9LCBndW4uX18ub3B0LnN0YXRlKTsqL1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRHdW4uSEFNLnVuaW9uID0gZnVuY3Rpb24odmVydGV4LCBub2RlLCBvcHQpe1xyXG5cdFx0XHRcdGlmKCFub2RlIHx8ICFub2RlLl8peyByZXR1cm4gfVxyXG5cdFx0XHRcdHZlcnRleCA9IHZlcnRleCB8fCBHdW4ubm9kZS5zb3VsLmlmeSh7Xzp7Jz4nOnt9fX0sIEd1bi5ub2RlLnNvdWwobm9kZSkpO1xyXG5cdFx0XHRcdGlmKCF2ZXJ0ZXggfHwgIXZlcnRleC5fKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRvcHQgPSBudW1faXMob3B0KT8ge21hY2hpbmU6IG9wdH0gOiB7bWFjaGluZTogR3VuLnN0YXRlKCl9O1xyXG5cdFx0XHRcdG9wdC51bmlvbiA9IHZlcnRleCB8fCBHdW4ub2JqLmNvcHkodmVydGV4KTsgLy8gVE9ETzogUEVSRiEgVGhpcyB3aWxsIHNsb3cgdGhpbmdzIGRvd24hXHJcblx0XHRcdFx0Ly8gVE9ETzogUEVSRiEgQmlnZ2VzdCBzbG93ZG93biAoYWZ0ZXIgMW9jYWxTdG9yYWdlKSBpcyB0aGUgYWJvdmUgbGluZS4gRml4ISBGaXghXHJcblx0XHRcdFx0b3B0LnZlcnRleCA9IHZlcnRleDtcclxuXHRcdFx0XHRvcHQubm9kZSA9IG5vZGU7XHJcblx0XHRcdFx0Ly9vYmpfbWFwKG5vZGUuXywgbWV0YSwgb3B0LnVuaW9uKTsgLy8gVE9ETzogUmV2aWV3IGF0IHNvbWUgcG9pbnQ/XHJcblx0XHRcdFx0aWYob2JqX21hcChub2RlLCBtYXAsIG9wdCkpeyAvLyBpZiB0aGlzIHJldHVybnMgdHJ1ZSB0aGVuIHNvbWV0aGluZyB3YXMgaW52YWxpZC5cclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIG9wdC51bmlvbjtcclxuXHRcdFx0fVxyXG5cdFx0XHRHdW4uSEFNLmRlbHRhID0gZnVuY3Rpb24odmVydGV4LCBub2RlLCBvcHQpe1xyXG5cdFx0XHRcdG9wdCA9IG51bV9pcyhvcHQpPyB7bWFjaGluZTogb3B0fSA6IHttYWNoaW5lOiBHdW4uc3RhdGUoKX07XHJcblx0XHRcdFx0aWYoIXZlcnRleCl7IHJldHVybiBHdW4ub2JqLmNvcHkobm9kZSkgfVxyXG5cdFx0XHRcdG9wdC5zb3VsID0gR3VuLm5vZGUuc291bChvcHQudmVydGV4ID0gdmVydGV4KTtcclxuXHRcdFx0XHRpZighb3B0LnNvdWwpeyByZXR1cm4gfVxyXG5cdFx0XHRcdG9wdC5kZWx0YSA9IEd1bi5ub2RlLnNvdWwuaWZ5KHt9LCBvcHQuc291bCk7XHJcblx0XHRcdFx0b2JqX21hcChvcHQubm9kZSA9IG5vZGUsIGRpZmYsIG9wdCk7XHJcblx0XHRcdFx0cmV0dXJuIG9wdC5kZWx0YTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBkaWZmKHZhbHVlLCBmaWVsZCl7IHZhciBvcHQgPSB0aGlzO1xyXG5cdFx0XHRcdGlmKEd1bi5fLm5vZGUgPT09IGZpZWxkKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRpZighdmFsX2lzKHZhbHVlKSl7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIG5vZGUgPSBvcHQubm9kZSwgdmVydGV4ID0gb3B0LnZlcnRleCwgaXMgPSBzdGF0ZV9pcyhub2RlLCBmaWVsZCwgdHJ1ZSksIGNzID0gc3RhdGVfaXModmVydGV4LCBmaWVsZCwgdHJ1ZSksIGRlbHRhID0gb3B0LmRlbHRhO1xyXG5cdFx0XHRcdHZhciBIQU0gPSBHdW4uSEFNKG9wdC5tYWNoaW5lLCBpcywgY3MsIHZhbHVlLCB2ZXJ0ZXhbZmllbGRdKTtcclxuXHJcblxyXG5cclxuXHRcdFx0XHQvLyBUT0RPOiBCVUchISEhIFdIQVQgQUJPVVQgREVGRVJSRUQhPz8/XHJcblx0XHRcdFx0XHJcblxyXG5cclxuXHRcdFx0XHRpZihIQU0uaW5jb21pbmcpe1xyXG5cdFx0XHRcdFx0ZGVsdGFbZmllbGRdID0gdmFsdWU7XHJcblx0XHRcdFx0XHRzdGF0ZV9pZnkoZGVsdGEsIGZpZWxkLCBpcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdEd1bi5IQU0uc3ludGggPSBmdW5jdGlvbihhdCwgZXYpe1xyXG5cdFx0XHRcdHZhciBhcyA9IHRoaXMuYXMsIGNhdCA9IGFzLmd1bi5fO1xyXG5cdFx0XHRcdGlmKCFhdC5wdXQgfHwgKGFzWycuJ10gJiYgIW9ial9oYXMoYXQucHV0W2FzWycjJ11dLCBjYXQuZ2V0KSkpe1xyXG5cdFx0XHRcdFx0aWYoY2F0LnB1dCAhPT0gdSl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRjYXQub24oJ2luJywge1xyXG5cdFx0XHRcdFx0XHRnZXQ6IGNhdC5nZXQsXHJcblx0XHRcdFx0XHRcdHB1dDogY2F0LnB1dCA9IHUsXHJcblx0XHRcdFx0XHRcdGd1bjogY2F0Lmd1bixcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGF0Lmd1biA9IGNhdC5yb290O1xyXG5cdFx0XHRcdEd1bi5vbigncHV0JywgYXQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdEd1bi5IQU0uc3ludGhfID0gZnVuY3Rpb24oYXQsIGV2LCBhcyl7IHZhciBndW4gPSB0aGlzLmFzIHx8IGFzO1xyXG5cdFx0XHRcdHZhciBjYXQgPSBndW4uXywgcm9vdCA9IGNhdC5yb290Ll8sIHB1dCA9IHt9LCB0bXA7XHJcblx0XHRcdFx0aWYoIWF0LnB1dCl7XHJcblx0XHRcdFx0XHQvL2lmKG9ial9oYXMoY2F0LCAncHV0JykpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0aWYoY2F0LnB1dCAhPT0gdSl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRjYXQub24oJ2luJywge1xyXG5cdFx0XHRcdFx0Ly9yb290LmFjayhhdFsnQCddLCB7XHJcblx0XHRcdFx0XHRcdGdldDogY2F0LmdldCxcclxuXHRcdFx0XHRcdFx0cHV0OiBjYXQucHV0ID0gdSxcclxuXHRcdFx0XHRcdFx0Z3VuOiBndW4sXHJcblx0XHRcdFx0XHRcdHZpYTogYXRcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIFRPRE86IFBFUkYhIEhhdmUgb3B0aW9ucyB0byBkZXRlcm1pbmUgaWYgdGhpcyBkYXRhIHNob3VsZCBldmVuIGJlIGluIG1lbW9yeSBvbiB0aGlzIHBlZXIhXHJcblx0XHRcdFx0b2JqX21hcChhdC5wdXQsIGZ1bmN0aW9uKG5vZGUsIHNvdWwpeyB2YXIgZ3JhcGggPSB0aGlzLmdyYXBoO1xyXG5cdFx0XHRcdFx0cHV0W3NvdWxdID0gR3VuLkhBTS5kZWx0YShncmFwaFtzb3VsXSwgbm9kZSwge2dyYXBoOiBncmFwaH0pOyAvLyBUT0RPOiBQRVJGISBTRUUgSUYgV0UgQ0FOIE9QVElNSVpFIFRISVMgQlkgTUVSR0lORyBVTklPTiBJTlRPIERFTFRBIVxyXG5cdFx0XHRcdFx0Z3JhcGhbc291bF0gPSBHdW4uSEFNLnVuaW9uKGdyYXBoW3NvdWxdLCBub2RlKSB8fCBncmFwaFtzb3VsXTtcclxuXHRcdFx0XHR9LCByb290KTtcclxuXHRcdFx0XHRpZihhdC5ndW4gIT09IHJvb3QuZ3VuKXtcclxuXHRcdFx0XHRcdHB1dCA9IGF0LnB1dDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gVE9ETzogUEVSRiEgSGF2ZSBvcHRpb25zIHRvIGRldGVybWluZSBpZiB0aGlzIGRhdGEgc2hvdWxkIGV2ZW4gYmUgaW4gbWVtb3J5IG9uIHRoaXMgcGVlciFcclxuXHRcdFx0XHRvYmpfbWFwKHB1dCwgZnVuY3Rpb24obm9kZSwgc291bCl7XHJcblx0XHRcdFx0XHR2YXIgcm9vdCA9IHRoaXMsIG5leHQgPSByb290Lm5leHQgfHwgKHJvb3QubmV4dCA9IHt9KSwgZ3VuID0gbmV4dFtzb3VsXSB8fCAobmV4dFtzb3VsXSA9IHJvb3QuZ3VuLmdldChzb3VsKSksIGNvYXQgPSAoZ3VuLl8pO1xyXG5cdFx0XHRcdFx0Y29hdC5wdXQgPSByb290LmdyYXBoW3NvdWxdOyAvLyBUT0RPOiBCVUchIENsb25lIVxyXG5cdFx0XHRcdFx0aWYoY2F0LmZpZWxkICYmICFvYmpfaGFzKG5vZGUsIGNhdC5maWVsZCkpe1xyXG5cdFx0XHRcdFx0XHQoYXQgPSBvYmpfdG8oYXQsIHt9KSkucHV0ID0gdTtcclxuXHRcdFx0XHRcdFx0R3VuLkhBTS5zeW50aChhdCwgZXYsIGNhdC5ndW4pO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjb2F0Lm9uKCdpbicsIHtcclxuXHRcdFx0XHRcdFx0cHV0OiBub2RlLFxyXG5cdFx0XHRcdFx0XHRnZXQ6IHNvdWwsXHJcblx0XHRcdFx0XHRcdGd1bjogZ3VuLFxyXG5cdFx0XHRcdFx0XHR2aWE6IGF0XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9LCByb290KTtcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHJcblx0XHR2YXIgVHlwZSA9IEd1bjtcclxuXHRcdHZhciBudW0gPSBUeXBlLm51bSwgbnVtX2lzID0gbnVtLmlzO1xyXG5cdFx0dmFyIG9iaiA9IFR5cGUub2JqLCBvYmpfaGFzID0gb2JqLmhhcywgb2JqX3B1dCA9IG9iai5wdXQsIG9ial90byA9IG9iai50bywgb2JqX21hcCA9IG9iai5tYXA7XHJcblx0XHR2YXIgbm9kZSA9IEd1bi5ub2RlLCBub2RlX3NvdWwgPSBub2RlLnNvdWwsIG5vZGVfaXMgPSBub2RlLmlzLCBub2RlX2lmeSA9IG5vZGUuaWZ5O1xyXG5cdFx0dmFyIHN0YXRlID0gR3VuLnN0YXRlLCBzdGF0ZV9pcyA9IHN0YXRlLmlzLCBzdGF0ZV9pZnkgPSBzdGF0ZS5pZnk7XHJcblx0XHR2YXIgdmFsID0gR3VuLnZhbCwgdmFsX2lzID0gdmFsLmlzLCByZWxfaXMgPSB2YWwucmVsLmlzO1xyXG5cdFx0dmFyIHU7XHJcblx0fSkocmVxdWlyZSwgJy4vaW5kZXgnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL3Jvb3QnKTtcclxuXHRcdHJlcXVpcmUoJy4vaW5kZXgnKTsgLy8gVE9ETzogQ0xFQU4gVVAhIE1FUkdFIElOVE8gUk9PVCFcclxuXHRcdHJlcXVpcmUoJy4vb3B0Jyk7XHJcblx0XHRyZXF1aXJlKCcuL2NoYWluJyk7XHJcblx0XHRyZXF1aXJlKCcuL2JhY2snKTtcclxuXHRcdHJlcXVpcmUoJy4vcHV0Jyk7XHJcblx0XHRyZXF1aXJlKCcuL2dldCcpO1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBHdW47XHJcblx0fSkocmVxdWlyZSwgJy4vY29yZScpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vY29yZScpO1xyXG5cdFx0R3VuLmNoYWluLnBhdGggPSBmdW5jdGlvbihmaWVsZCwgY2IsIG9wdCl7XHJcblx0XHRcdHZhciBiYWNrID0gdGhpcywgZ3VuID0gYmFjaywgdG1wO1xyXG5cdFx0XHRvcHQgPSBvcHQgfHwge307IG9wdC5wYXRoID0gdHJ1ZTtcclxuXHRcdFx0R3VuLmxvZy5vbmNlKFwicGF0aGluZ1wiLCBcIldhcm5pbmc6IGAucGF0aGAgdG8gYmUgcmVtb3ZlZCBmcm9tIGNvcmUgKGJ1dCBhdmFpbGFibGUgYXMgYW4gZXh0ZW5zaW9uKSwgdXNlIGAuZ2V0YCBjaGFpbnMgaW5zdGVhZC4gSWYgeW91IGFyZSBvcHBvc2VkIHRvIHRoaXMsIHBsZWFzZSB2b2ljZSB5b3VyIG9waW5pb24gaW4gaHR0cHM6Ly9naXR0ZXIuaW0vYW1hcmsvZ3VuIGFuZCBhc2sgb3RoZXJzLlwiKTtcclxuXHRcdFx0aWYoZ3VuID09PSBndW4uXy5yb290KXtpZihjYil7Y2Ioe2VycjogR3VuLmxvZyhcIkNhbid0IGRvIHRoYXQgb24gcm9vdCBpbnN0YW5jZS5cIil9KX1yZXR1cm4gZ3VufVxyXG5cdFx0XHRpZih0eXBlb2YgZmllbGQgPT09ICdzdHJpbmcnKXtcclxuXHRcdFx0XHR0bXAgPSBmaWVsZC5zcGxpdChvcHQuc3BsaXQgfHwgJy4nKTtcclxuXHRcdFx0XHRpZigxID09PSB0bXAubGVuZ3RoKXtcclxuXHRcdFx0XHRcdGd1biA9IGJhY2suZ2V0KGZpZWxkLCBjYiwgb3B0KTtcclxuXHRcdFx0XHRcdGd1bi5fLm9wdCA9IG9wdDtcclxuXHRcdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZpZWxkID0gdG1wO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGZpZWxkIGluc3RhbmNlb2YgQXJyYXkpe1xyXG5cdFx0XHRcdGlmKGZpZWxkLmxlbmd0aCA+IDEpe1xyXG5cdFx0XHRcdFx0Z3VuID0gYmFjaztcclxuXHRcdFx0XHRcdHZhciBpID0gMCwgbCA9IGZpZWxkLmxlbmd0aDtcclxuXHRcdFx0XHRcdGZvcihpOyBpIDwgbDsgaSsrKXtcclxuXHRcdFx0XHRcdFx0Z3VuID0gZ3VuLmdldChmaWVsZFtpXSwgKGkrMSA9PT0gbCk/IGNiIDogbnVsbCwgb3B0KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vZ3VuLmJhY2sgPSBiYWNrOyAvLyBUT0RPOiBBUEkgY2hhbmdlIVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRndW4gPSBiYWNrLmdldChmaWVsZFswXSwgY2IsIG9wdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGd1bi5fLm9wdCA9IG9wdDtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCFmaWVsZCAmJiAwICE9IGZpZWxkKXtcclxuXHRcdFx0XHRyZXR1cm4gYmFjaztcclxuXHRcdFx0fVxyXG5cdFx0XHRndW4gPSBiYWNrLmdldCgnJytmaWVsZCwgY2IsIG9wdCk7XHJcblx0XHRcdGd1bi5fLm9wdCA9IG9wdDtcclxuXHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdH1cclxuXHR9KShyZXF1aXJlLCAnLi9wYXRoJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9jb3JlJyk7XHJcblx0XHRHdW4uY2hhaW4ub24gPSBmdW5jdGlvbih0YWcsIGFyZywgZWFzLCBhcyl7XHJcblx0XHRcdHZhciBndW4gPSB0aGlzLCBhdCA9IGd1bi5fLCB0bXAsIGFjdCwgb2ZmO1xyXG5cdFx0XHRpZih0eXBlb2YgdGFnID09PSAnc3RyaW5nJyl7XHJcblx0XHRcdFx0aWYoIWFyZyl7IHJldHVybiBhdC5vbih0YWcpIH1cclxuXHRcdFx0XHRhY3QgPSBhdC5vbih0YWcsIGFyZywgZWFzIHx8IGF0LCBhcyk7XHJcblx0XHRcdFx0aWYoZWFzICYmIGVhcy5ndW4pe1xyXG5cdFx0XHRcdFx0KGVhcy5zdWJzIHx8IChlYXMuc3VicyA9IFtdKSkucHVzaChhY3QpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRvZmYgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGlmIChhY3QgJiYgYWN0Lm9mZikgYWN0Lm9mZigpO1xyXG5cdFx0XHRcdFx0b2ZmLm9mZigpO1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0b2ZmLm9mZiA9IGd1bi5vZmYuYmluZChndW4pIHx8IG5vb3A7XHJcblx0XHRcdFx0Z3VuLm9mZiA9IG9mZjtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBvcHQgPSBhcmc7XHJcblx0XHRcdG9wdCA9ICh0cnVlID09PSBvcHQpPyB7Y2hhbmdlOiB0cnVlfSA6IG9wdCB8fCB7fTtcclxuXHRcdFx0b3B0Lm9rID0gdGFnO1xyXG5cdFx0XHRvcHQubGFzdCA9IHt9O1xyXG5cdFx0XHRndW4uZ2V0KG9rLCBvcHQpOyAvLyBUT0RPOiBQRVJGISBFdmVudCBsaXN0ZW5lciBsZWFrISEhPz8/P1xyXG5cdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIG9rKGF0LCBldil7IHZhciBvcHQgPSB0aGlzO1xyXG5cdFx0XHR2YXIgZ3VuID0gYXQuZ3VuLCBjYXQgPSBndW4uXywgZGF0YSA9IGNhdC5wdXQgfHwgYXQucHV0LCB0bXAgPSBvcHQubGFzdCwgaWQgPSBjYXQuaWQrYXQuZ2V0LCB0bXA7XHJcblx0XHRcdGlmKHUgPT09IGRhdGEpe1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihkYXRhICYmIGRhdGFbcmVsLl9dICYmICh0bXAgPSByZWwuaXMoZGF0YSkpKXtcclxuXHRcdFx0XHR0bXAgPSAoY2F0LnJvb3QuZ2V0KHRtcCkuXyk7XHJcblx0XHRcdFx0aWYodSA9PT0gdG1wLnB1dCl7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGRhdGEgPSB0bXAucHV0O1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKG9wdC5jaGFuZ2UpeyAvLyBUT0RPOiBCVUc/IE1vdmUgYWJvdmUgdGhlIHVuZGVmIGNoZWNrcz9cclxuXHRcdFx0XHRkYXRhID0gYXQucHV0O1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIERFRFVQTElDQVRFIC8vIFRPRE86IE5FRURTIFdPUkshIEJBRCBQUk9UT1RZUEVcclxuXHRcdFx0aWYodG1wLnB1dCA9PT0gZGF0YSAmJiB0bXAuZ2V0ID09PSBpZCAmJiAhR3VuLm5vZGUuc291bChkYXRhKSl7IHJldHVybiB9XHJcblx0XHRcdHRtcC5wdXQgPSBkYXRhO1xyXG5cdFx0XHR0bXAuZ2V0ID0gaWQ7XHJcblx0XHRcdC8vIERFRFVQTElDQVRFIC8vIFRPRE86IE5FRURTIFdPUkshIEJBRCBQUk9UT1RZUEVcclxuXHRcdFx0Y2F0Lmxhc3QgPSBkYXRhO1xyXG5cdFx0XHRpZihvcHQuYXMpe1xyXG5cdFx0XHRcdG9wdC5vay5jYWxsKG9wdC5hcywgYXQsIGV2KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRvcHQub2suY2FsbChndW4sIGRhdGEsIGF0LmdldCwgYXQsIGV2KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdEd1bi5jaGFpbi52YWwgPSBmdW5jdGlvbihjYiwgb3B0KXtcclxuXHRcdFx0dmFyIGd1biA9IHRoaXMsIGF0ID0gZ3VuLl8sIGRhdGEgPSBhdC5wdXQ7XHJcblx0XHRcdGlmKDAgPCBhdC5hY2sgJiYgdSAhPT0gZGF0YSl7XHJcblx0XHRcdFx0KGNiIHx8IG5vb3ApLmNhbGwoZ3VuLCBkYXRhLCBhdC5nZXQpO1xyXG5cdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY2Ipe1xyXG5cdFx0XHRcdChvcHQgPSBvcHQgfHwge30pLm9rID0gY2I7XHJcblx0XHRcdFx0b3B0LmNhdCA9IGF0O1xyXG5cdFx0XHRcdGd1bi5nZXQodmFsLCB7YXM6IG9wdH0pO1xyXG5cdFx0XHRcdG9wdC5hc3luYyA9IHRydWU7IC8vb3B0LmFzeW5jID0gYXQuc3R1bj8gMSA6IHRydWU7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0R3VuLmxvZy5vbmNlKFwidmFsb25jZVwiLCBcIkNoYWluYWJsZSB2YWwgaXMgZXhwZXJpbWVudGFsLCBpdHMgYmVoYXZpb3IgYW5kIEFQSSBtYXkgY2hhbmdlIG1vdmluZyBmb3J3YXJkLiBQbGVhc2UgcGxheSB3aXRoIGl0IGFuZCByZXBvcnQgYnVncyBhbmQgaWRlYXMgb24gaG93IHRvIGltcHJvdmUgaXQuXCIpO1xyXG5cdFx0XHRcdHZhciBjaGFpbiA9IGd1bi5jaGFpbigpO1xyXG5cdFx0XHRcdGNoYWluLl8udmFsID0gZ3VuLnZhbChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0Y2hhaW4uXy5vbignaW4nLCBndW4uXyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0cmV0dXJuIGNoYWluO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBndW47XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gdmFsKGF0LCBldiwgdG8pe1xyXG5cdFx0XHR2YXIgb3B0ID0gdGhpcy5hcywgY2F0ID0gb3B0LmNhdCwgZ3VuID0gYXQuZ3VuLCBjb2F0ID0gZ3VuLl8sIGRhdGEgPSBjb2F0LnB1dCB8fCBhdC5wdXQsIHRtcDtcclxuXHRcdFx0aWYodSA9PT0gZGF0YSl7XHJcblx0XHRcdFx0Ly9yZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoZGF0YSAmJiBkYXRhW3JlbC5fXSAmJiAodG1wID0gcmVsLmlzKGRhdGEpKSl7XHJcblx0XHRcdFx0dG1wID0gKGNhdC5yb290LmdldCh0bXApLl8pO1xyXG5cdFx0XHRcdGlmKHUgPT09IHRtcC5wdXQpe1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRkYXRhID0gdG1wLnB1dDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihldi53YWl0KXsgY2xlYXJUaW1lb3V0KGV2LndhaXQpIH1cclxuXHRcdFx0Ly9pZighdG8gJiYgKCEoMCA8IGNvYXQuYWNrKSB8fCAoKHRydWUgPT09IG9wdC5hc3luYykgJiYgMCAhPT0gb3B0LndhaXQpKSl7XHJcblx0XHRcdGlmKCFvcHQuYXN5bmMpe1xyXG5cdFx0XHRcdGV2LndhaXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHR2YWwuY2FsbCh7YXM6b3B0fSwgYXQsIGV2LCBldi53YWl0IHx8IDEpXHJcblx0XHRcdFx0fSwgb3B0LndhaXQgfHwgOTkpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjYXQuZmllbGQgfHwgY2F0LnNvdWwpe1xyXG5cdFx0XHRcdGlmKGV2Lm9mZigpKXsgcmV0dXJuIH0gLy8gaWYgaXQgaXMgYWxyZWFkeSBvZmYsIGRvbid0IGNhbGwgYWdhaW4hXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYoKG9wdC5zZWVuID0gb3B0LnNlZW4gfHwge30pW2NvYXQuaWRdKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRvcHQuc2Vlbltjb2F0LmlkXSA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0b3B0Lm9rLmNhbGwoYXQuZ3VuIHx8IG9wdC5ndW4sIGRhdGEsIGF0LmdldCk7XHJcblx0XHR9XHJcblxyXG5cdFx0R3VuLmNoYWluLm9mZiA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBndW4gPSB0aGlzLCBhdCA9IGd1bi5fLCB0bXA7XHJcblx0XHRcdHZhciBiYWNrID0gYXQuYmFjayB8fCB7fSwgY2F0ID0gYmFjay5fO1xyXG5cdFx0XHRpZighY2F0KXsgcmV0dXJuIH1cclxuXHRcdFx0aWYodG1wID0gY2F0Lm5leHQpe1xyXG5cdFx0XHRcdGlmKHRtcFthdC5nZXRdKXtcclxuXHRcdFx0XHRcdG9ial9kZWwodG1wLCBhdC5nZXQpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRvYmpfbWFwKHRtcCwgZnVuY3Rpb24ocGF0aCwga2V5KXtcclxuXHRcdFx0XHRcdFx0aWYoZ3VuICE9PSBwYXRoKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdFx0b2JqX2RlbCh0bXAsIGtleSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoKHRtcCA9IGd1bi5iYWNrKC0xKSkgPT09IGJhY2spe1xyXG5cdFx0XHRcdG9ial9kZWwodG1wLmdyYXBoLCBhdC5nZXQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGF0Lm9ucyAmJiAodG1wID0gYXQub25zWydAJCddKSl7XHJcblx0XHRcdFx0b2JqX21hcCh0bXAucywgZnVuY3Rpb24oZXYpe1xyXG5cdFx0XHRcdFx0ZXYub2ZmKCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdH1cclxuXHRcdHZhciBvYmogPSBHdW4ub2JqLCBvYmpfaGFzID0gb2JqLmhhcywgb2JqX2RlbCA9IG9iai5kZWwsIG9ial90byA9IG9iai50bztcclxuXHRcdHZhciByZWwgPSBHdW4udmFsLnJlbDtcclxuXHRcdHZhciBlbXB0eSA9IHt9LCBub29wID0gZnVuY3Rpb24oKXt9LCB1O1xyXG5cdH0pKHJlcXVpcmUsICcuL29uJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9jb3JlJyksIHU7XHJcblx0XHRHdW4uY2hhaW4ubm90ID0gZnVuY3Rpb24oY2IsIG9wdCwgdCl7XHJcblx0XHRcdEd1bi5sb2cub25jZShcIm5vdHRvYmVcIiwgXCJXYXJuaW5nOiBgLm5vdGAgdG8gYmUgcmVtb3ZlZCBmcm9tIGNvcmUgKGJ1dCBhdmFpbGFibGUgYXMgYW4gZXh0ZW5zaW9uKSwgdXNlIGAudmFsYCBpbnN0ZWFkLCB3aGljaCBub3cgc3VwcG9ydHMgKHYwLjcueCspICdub3QgZm91bmQgZGF0YScgYXMgYHVuZGVmaW5lZGAgZGF0YSBpbiBjYWxsYmFja3MuIElmIHlvdSBhcmUgb3Bwb3NlZCB0byB0aGlzLCBwbGVhc2Ugdm9pY2UgeW91ciBvcGluaW9uIGluIGh0dHBzOi8vZ2l0dGVyLmltL2FtYXJrL2d1biBhbmQgYXNrIG90aGVycy5cIik7XHJcblx0XHRcdHJldHVybiB0aGlzLmdldChvdWdodCwge25vdDogY2J9KTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIG91Z2h0KGF0LCBldil7IGV2Lm9mZigpO1xyXG5cdFx0XHRpZihhdC5lcnIgfHwgKHUgIT09IGF0LnB1dCkpeyByZXR1cm4gfVxyXG5cdFx0XHRpZighdGhpcy5ub3QpeyByZXR1cm4gfVxyXG5cdFx0XHR0aGlzLm5vdC5jYWxsKGF0Lmd1biwgYXQuZ2V0LCBmdW5jdGlvbigpeyBjb25zb2xlLmxvZyhcIlBsZWFzZSByZXBvcnQgdGhpcyBidWcgb24gaHR0cHM6Ly9naXR0ZXIuaW0vYW1hcmsvZ3VuIGFuZCBpbiB0aGUgaXNzdWVzLlwiKTsgbmVlZC50by5pbXBsZW1lbnQ7IH0pO1xyXG5cdFx0fVxyXG5cdH0pKHJlcXVpcmUsICcuL25vdCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vY29yZScpO1xyXG5cdFx0R3VuLmNoYWluLm1hcCA9IGZ1bmN0aW9uKGNiLCBvcHQsIHQpe1xyXG5cdFx0XHR2YXIgZ3VuID0gdGhpcywgY2F0ID0gZ3VuLl8sIGNoYWluO1xyXG5cdFx0XHRpZighY2Ipe1xyXG5cdFx0XHRcdGlmKGNoYWluID0gY2F0LmZpZWxkcyl7IHJldHVybiBjaGFpbiB9XHJcblx0XHRcdFx0Y2hhaW4gPSBjYXQuZmllbGRzID0gZ3VuLmNoYWluKCk7XHJcblx0XHRcdFx0Y2hhaW4uXy52YWwgPSBndW4uYmFjaygndmFsJyk7XHJcblx0XHRcdFx0Z3VuLm9uKCdpbicsIG1hcCwgY2hhaW4uXyk7XHJcblx0XHRcdFx0cmV0dXJuIGNoYWluO1xyXG5cdFx0XHR9XHJcblx0XHRcdEd1bi5sb2cub25jZShcIm1hcGZuXCIsIFwiTWFwIGZ1bmN0aW9ucyBhcmUgZXhwZXJpbWVudGFsLCB0aGVpciBiZWhhdmlvciBhbmQgQVBJIG1heSBjaGFuZ2UgbW92aW5nIGZvcndhcmQuIFBsZWFzZSBwbGF5IHdpdGggaXQgYW5kIHJlcG9ydCBidWdzIGFuZCBpZGVhcyBvbiBob3cgdG8gaW1wcm92ZSBpdC5cIik7XHJcblx0XHRcdGNoYWluID0gZ3VuLmNoYWluKCk7XHJcblx0XHRcdGd1bi5tYXAoKS5vbihmdW5jdGlvbihkYXRhLCBrZXksIGF0LCBldil7XHJcblx0XHRcdFx0dmFyIG5leHQgPSAoY2J8fG5vb3ApLmNhbGwodGhpcywgZGF0YSwga2V5LCBhdCwgZXYpO1xyXG5cdFx0XHRcdGlmKHUgPT09IG5leHQpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGlmKEd1bi5pcyhuZXh0KSl7XHJcblx0XHRcdFx0XHRjaGFpbi5fLm9uKCdpbicsIG5leHQuXyk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNoYWluLl8ub24oJ2luJywge2dldDoga2V5LCBwdXQ6IG5leHQsIGd1bjogY2hhaW59KTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBjaGFpbjtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIG1hcChhdCl7XHJcblx0XHRcdGlmKCFhdC5wdXQgfHwgR3VuLnZhbC5pcyhhdC5wdXQpKXsgcmV0dXJuIH1cclxuXHRcdFx0aWYodGhpcy5hcy52YWwpeyB0aGlzLm9mZigpIH0gLy8gVE9ETzogVWdseSBoYWNrIVxyXG5cdFx0XHRvYmpfbWFwKGF0LnB1dCwgZWFjaCwge2NhdDogdGhpcy5hcywgZ3VuOiBhdC5ndW59KTtcclxuXHRcdFx0dGhpcy50by5uZXh0KGF0KTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIGVhY2godixmKXtcclxuXHRcdFx0aWYobl8gPT09IGYpeyByZXR1cm4gfVxyXG5cdFx0XHR2YXIgY2F0ID0gdGhpcy5jYXQsIGd1biA9IHRoaXMuZ3VuLmdldChmKSwgYXQgPSAoZ3VuLl8pO1xyXG5cdFx0XHQoYXQuZWNobyB8fCAoYXQuZWNobyA9IHt9KSlbY2F0LmlkXSA9IGNhdDtcclxuXHRcdH1cclxuXHRcdHZhciBvYmpfbWFwID0gR3VuLm9iai5tYXAsIG5vb3AgPSBmdW5jdGlvbigpe30sIGV2ZW50ID0ge3N0dW46IG5vb3AsIG9mZjogbm9vcH0sIG5fID0gR3VuLm5vZGUuXywgdTtcclxuXHR9KShyZXF1aXJlLCAnLi9tYXAnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL2NvcmUnKTtcclxuXHRcdEd1bi5jaGFpbi5zZXQgPSBmdW5jdGlvbihpdGVtLCBjYiwgb3B0KXtcclxuXHRcdFx0dmFyIGd1biA9IHRoaXMsIHNvdWw7XHJcblx0XHRcdGNiID0gY2IgfHwgZnVuY3Rpb24oKXt9O1xyXG5cdFx0XHRpZihzb3VsID0gR3VuLm5vZGUuc291bChpdGVtKSl7IHJldHVybiBndW4uc2V0KGd1bi5iYWNrKC0xKS5nZXQoc291bCksIGNiLCBvcHQpIH1cclxuXHRcdFx0aWYoIUd1bi5pcyhpdGVtKSl7XHJcblx0XHRcdFx0aWYoR3VuLm9iai5pcyhpdGVtKSl7IHJldHVybiBndW4uc2V0KGd1bi5fLnJvb3QucHV0KGl0ZW0pLCBjYiwgb3B0KSB9XHJcblx0XHRcdFx0cmV0dXJuIGd1bi5nZXQoR3VuLnRleHQucmFuZG9tKCkpLnB1dChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpdGVtLmdldCgnXycpLmdldChmdW5jdGlvbihhdCwgZXYpe1xyXG5cdFx0XHRcdGlmKCFhdC5ndW4gfHwgIWF0Lmd1bi5fLmJhY2spO1xyXG5cdFx0XHRcdGV2Lm9mZigpO1xyXG5cdFx0XHRcdGF0ID0gKGF0Lmd1bi5fLmJhY2suXyk7XHJcblx0XHRcdFx0dmFyIHB1dCA9IHt9LCBub2RlID0gYXQucHV0LCBzb3VsID0gR3VuLm5vZGUuc291bChub2RlKTtcclxuXHRcdFx0XHRpZighc291bCl7IHJldHVybiBjYi5jYWxsKGd1biwge2VycjogR3VuLmxvZygnT25seSBhIG5vZGUgY2FuIGJlIGxpbmtlZCEgTm90IFwiJyArIG5vZGUgKyAnXCIhJyl9KSB9XHJcblx0XHRcdFx0Z3VuLnB1dChHdW4ub2JqLnB1dChwdXQsIHNvdWwsIEd1bi52YWwucmVsLmlmeShzb3VsKSksIGNiLCBvcHQpO1xyXG5cdFx0XHR9LHt3YWl0OjB9KTtcclxuXHRcdFx0cmV0dXJuIGl0ZW07XHJcblx0XHR9XHJcblx0fSkocmVxdWlyZSwgJy4vc2V0Jyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHRpZih0eXBlb2YgR3VuID09PSAndW5kZWZpbmVkJyl7IHJldHVybiB9IC8vIFRPRE86IGxvY2FsU3RvcmFnZSBpcyBCcm93c2VyIG9ubHkuIEJ1dCBpdCB3b3VsZCBiZSBuaWNlIGlmIGl0IGNvdWxkIHNvbWVob3cgcGx1Z2luIGludG8gTm9kZUpTIGNvbXBhdGlibGUgbG9jYWxTdG9yYWdlIEFQSXM/XHJcblxyXG5cdFx0dmFyIHJvb3QsIG5vb3AgPSBmdW5jdGlvbigpe30sIHU7XHJcblx0XHRpZih0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyl7IHJvb3QgPSB3aW5kb3cgfVxyXG5cdFx0dmFyIHN0b3JlID0gcm9vdC5sb2NhbFN0b3JhZ2UgfHwge3NldEl0ZW06IG5vb3AsIHJlbW92ZUl0ZW06IG5vb3AsIGdldEl0ZW06IG5vb3B9O1xyXG5cclxuXHRcdHZhciBjaGVjayA9IHt9LCBkaXJ0eSA9IHt9LCBhc3luYyA9IHt9LCBjb3VudCA9IDAsIG1heCA9IDEwMDAwLCB3YWl0O1xyXG5cdFx0XHJcblx0XHRHdW4ub24oJ3B1dCcsIGZ1bmN0aW9uKGF0KXsgdmFyIGVyciwgaWQsIG9wdCwgcm9vdCA9IGF0Lmd1bi5fLnJvb3Q7XHJcblx0XHRcdHRoaXMudG8ubmV4dChhdCk7XHJcblx0XHRcdChvcHQgPSB7fSkucHJlZml4ID0gKGF0Lm9wdCB8fCBvcHQpLnByZWZpeCB8fCBhdC5ndW4uYmFjaygnb3B0LnByZWZpeCcpIHx8ICdndW4vJztcclxuXHRcdFx0dmFyIGdyYXBoID0gcm9vdC5fLmdyYXBoO1xyXG5cdFx0XHRHdW4ub2JqLm1hcChhdC5wdXQsIGZ1bmN0aW9uKG5vZGUsIHNvdWwpe1xyXG5cdFx0XHRcdGFzeW5jW3NvdWxdID0gYXN5bmNbc291bF0gfHwgZ3JhcGhbc291bF0gfHwgbm9kZTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdGNvdW50ICs9IDE7XHJcblx0XHRcdGNoZWNrW2F0WycjJ11dID0gcm9vdDtcclxuXHRcdFx0ZnVuY3Rpb24gc2F2ZSgpe1xyXG5cdFx0XHRcdGNsZWFyVGltZW91dCh3YWl0KTtcclxuXHRcdFx0XHR2YXIgYWNrID0gY2hlY2s7XHJcblx0XHRcdFx0dmFyIGFsbCA9IGFzeW5jO1xyXG5cdFx0XHRcdGNvdW50ID0gMDtcclxuXHRcdFx0XHR3YWl0ID0gZmFsc2U7XHJcblx0XHRcdFx0Y2hlY2sgPSB7fTtcclxuXHRcdFx0XHRhc3luYyA9IHt9O1xyXG5cdFx0XHRcdEd1bi5vYmoubWFwKGFsbCwgZnVuY3Rpb24obm9kZSwgc291bCl7XHJcblx0XHRcdFx0XHQvLyBTaW5jZSBsb2NhbFN0b3JhZ2Ugb25seSBoYXMgNU1CLCBpdCBpcyBiZXR0ZXIgdGhhdCB3ZSBrZWVwIG9ubHlcclxuXHRcdFx0XHRcdC8vIHRoZSBkYXRhIHRoYXQgdGhlIHVzZXIgaXMgY3VycmVudGx5IGludGVyZXN0ZWQgaW4uXHJcblx0XHRcdFx0XHRub2RlID0gZ3JhcGhbc291bF0gfHwgYWxsW3NvdWxdIHx8IG5vZGU7XHJcblx0XHRcdFx0XHR0cnl7c3RvcmUuc2V0SXRlbShvcHQucHJlZml4ICsgc291bCwgSlNPTi5zdHJpbmdpZnkobm9kZSkpO1xyXG5cdFx0XHRcdFx0fWNhdGNoKGUpeyBlcnIgPSBlIHx8IFwibG9jYWxTdG9yYWdlIGZhaWx1cmVcIiB9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0aWYoIUd1bi5vYmouZW1wdHkoYXQuZ3VuLmJhY2soJ29wdC5wZWVycycpKSl7IHJldHVybiB9IC8vIG9ubHkgYWNrIGlmIHRoZXJlIGFyZSBubyBwZWVycy5cclxuXHRcdFx0XHRHdW4ub2JqLm1hcChhY2ssIGZ1bmN0aW9uKHJvb3QsIGlkKXtcclxuXHRcdFx0XHRcdHJvb3Qub24oJ2luJywge1xyXG5cdFx0XHRcdFx0XHQnQCc6IGlkLFxyXG5cdFx0XHRcdFx0XHRlcnI6IGVycixcclxuXHRcdFx0XHRcdFx0b2s6IDAgLy8gbG9jYWxTdG9yYWdlIGlzbid0IHJlbGlhYmxlLCBzbyBtYWtlIGl0cyBgb2tgIGNvZGUgYmUgYSBsb3cgbnVtYmVyLlxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY291bnQgPj0gbWF4KXsgLy8gZ29hbCBpcyB0byBkbyAxMEsgaW5zZXJ0cy9zZWNvbmQuXHJcblx0XHRcdFx0cmV0dXJuIHNhdmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih3YWl0KXsgcmV0dXJuIH1cclxuXHRcdFx0Y2xlYXJUaW1lb3V0KHdhaXQpO1xyXG5cdFx0XHR3YWl0ID0gc2V0VGltZW91dChzYXZlLCAxMDAwKTtcclxuXHRcdH0pO1xyXG5cdFx0R3VuLm9uKCdnZXQnLCBmdW5jdGlvbihhdCl7XHJcblx0XHRcdHRoaXMudG8ubmV4dChhdCk7XHJcblx0XHRcdHZhciBndW4gPSBhdC5ndW4sIGxleCA9IGF0LmdldCwgc291bCwgZGF0YSwgb3B0LCB1O1xyXG5cdFx0XHQvL3NldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0KG9wdCA9IGF0Lm9wdCB8fCB7fSkucHJlZml4ID0gb3B0LnByZWZpeCB8fCBhdC5ndW4uYmFjaygnb3B0LnByZWZpeCcpIHx8ICdndW4vJztcclxuXHRcdFx0aWYoIWxleCB8fCAhKHNvdWwgPSBsZXhbR3VuLl8uc291bF0pKXsgcmV0dXJuIH1cclxuXHRcdFx0Ly9pZigwID49IGF0LmNhcCl7IHJldHVybiB9XHJcblx0XHRcdHZhciBmaWVsZCA9IGxleFsnLiddO1xyXG5cdFx0XHRkYXRhID0gR3VuLm9iai5pZnkoc3RvcmUuZ2V0SXRlbShvcHQucHJlZml4ICsgc291bCkgfHwgbnVsbCkgfHwgYXN5bmNbc291bF0gfHwgdTtcclxuXHRcdFx0aWYoZGF0YSAmJiBmaWVsZCl7XHJcblx0XHRcdFx0ZGF0YSA9IEd1bi5zdGF0ZS50byhkYXRhLCBmaWVsZCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoIWRhdGEgJiYgIUd1bi5vYmouZW1wdHkoZ3VuLmJhY2soJ29wdC5wZWVycycpKSl7IC8vIGlmIGRhdGEgbm90IGZvdW5kLCBkb24ndCBhY2sgaWYgdGhlcmUgYXJlIHBlZXJzLlxyXG5cdFx0XHRcdHJldHVybjsgLy8gSG1tLCB3aGF0IGlmIHdlIGhhdmUgcGVlcnMgYnV0IHdlIGFyZSBkaXNjb25uZWN0ZWQ/XHJcblx0XHRcdH1cclxuXHRcdFx0Z3VuLm9uKCdpbicsIHsnQCc6IGF0WycjJ10sIHB1dDogR3VuLmdyYXBoLm5vZGUoZGF0YSksIGhvdzogJ2xTJ30pO1xyXG5cdFx0XHQvL30sMTEpO1xyXG5cdFx0fSk7XHJcblx0fSkocmVxdWlyZSwgJy4vYWRhcHRlcnMvbG9jYWxTdG9yYWdlJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9jb3JlJyk7XHJcblxyXG5cdFx0aWYgKHR5cGVvZiBKU09OID09PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXHJcblx0XHRcdFx0J0d1biBkZXBlbmRzIG9uIEpTT04uIFBsZWFzZSBsb2FkIGl0IGZpcnN0OlxcbicgK1xyXG5cdFx0XHRcdCdhamF4LmNkbmpzLmNvbS9hamF4L2xpYnMvanNvbjIvMjAxMTAyMjMvanNvbjIuanMnXHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIFdlYlNvY2tldDtcclxuXHRcdGlmKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKXtcclxuXHRcdFx0V2ViU29ja2V0ID0gd2luZG93LldlYlNvY2tldCB8fCB3aW5kb3cud2Via2l0V2ViU29ja2V0IHx8IHdpbmRvdy5tb3pXZWJTb2NrZXQ7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHR2YXIgbWVzc2FnZSwgY291bnQgPSAwLCBub29wID0gZnVuY3Rpb24oKXt9LCB3YWl0O1xyXG5cclxuXHRcdEd1bi5vbignb3V0JywgZnVuY3Rpb24oYXQpe1xyXG5cdFx0XHR0aGlzLnRvLm5leHQoYXQpO1xyXG5cdFx0XHR2YXIgY2F0ID0gYXQuZ3VuLl8ucm9vdC5fLCB3c3AgPSBjYXQud3NwIHx8IChjYXQud3NwID0ge30pO1xyXG5cdFx0XHRpZihhdC53c3AgJiYgMSA9PT0gd3NwLmNvdW50KXsgcmV0dXJuIH0gLy8gaWYgdGhlIG1lc3NhZ2UgY2FtZSBGUk9NIHRoZSBvbmx5IHBlZXIgd2UgYXJlIGNvbm5lY3RlZCB0bywgZG9uJ3QgZWNobyBpdCBiYWNrLlxyXG5cdFx0XHRtZXNzYWdlID0gSlNPTi5zdHJpbmdpZnkoYXQpO1xyXG5cdFx0XHQvL2lmKCsrY291bnQpeyBjb25zb2xlLmxvZyhcIm1zZyBPVVQ6XCIsIGNvdW50LCBHdW4ub2JqLmlmeShtZXNzYWdlKSkgfVxyXG5cdFx0XHRpZihjYXQudWRyYWluKXtcclxuXHRcdFx0XHRjYXQudWRyYWluLnB1c2gobWVzc2FnZSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhdC51ZHJhaW4gPSBbXTtcclxuXHRcdFx0Y2xlYXJUaW1lb3V0KHdhaXQpO1xyXG5cdFx0XHR3YWl0ID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdGlmKCFjYXQudWRyYWluKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgdG1wID0gY2F0LnVkcmFpbjtcclxuXHRcdFx0XHRjYXQudWRyYWluID0gbnVsbDtcclxuXHRcdFx0XHRpZiggdG1wLmxlbmd0aCApIHtcclxuXHRcdFx0XHRcdG1lc3NhZ2UgPSBKU09OLnN0cmluZ2lmeSh0bXApO1xyXG5cdFx0XHRcdFx0R3VuLm9iai5tYXAoY2F0Lm9wdC5wZWVycywgc2VuZCwgY2F0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sMSk7XHJcblx0XHRcdHdzcC5jb3VudCA9IDA7XHJcblx0XHRcdEd1bi5vYmoubWFwKGNhdC5vcHQucGVlcnMsIHNlbmQsIGNhdCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRmdW5jdGlvbiBzZW5kKHBlZXIpe1xyXG5cdFx0XHR2YXIgbXNnID0gbWVzc2FnZSwgY2F0ID0gdGhpcztcclxuXHRcdFx0dmFyIHdpcmUgPSBwZWVyLndpcmUgfHwgb3BlbihwZWVyLCBjYXQpO1xyXG5cdFx0XHRpZihjYXQud3NwKXsgY2F0LndzcC5jb3VudCsrIH1cclxuXHRcdFx0aWYoIXdpcmUpeyByZXR1cm4gfVxyXG5cdFx0XHRpZih3aXJlLnJlYWR5U3RhdGUgPT09IHdpcmUuT1BFTil7XHJcblx0XHRcdFx0d2lyZS5zZW5kKG1zZyk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdChwZWVyLnF1ZXVlID0gcGVlci5xdWV1ZSB8fCBbXSkucHVzaChtc2cpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHJlY2VpdmUobXNnLCBwZWVyLCBjYXQpe1xyXG5cdFx0XHRpZighY2F0IHx8ICFtc2cpeyByZXR1cm4gfVxyXG5cdFx0XHR0cnl7bXNnID0gSlNPTi5wYXJzZShtc2cuZGF0YSB8fCBtc2cpO1xyXG5cdFx0XHR9Y2F0Y2goZSl7fVxyXG5cdFx0XHRpZihtc2cgaW5zdGFuY2VvZiBBcnJheSl7XHJcblx0XHRcdFx0dmFyIGkgPSAwLCBtO1xyXG5cdFx0XHRcdHdoaWxlKG0gPSBtc2dbaSsrXSl7XHJcblx0XHRcdFx0XHRyZWNlaXZlKG0sIHBlZXIsIGNhdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHQvL2lmKCsrY291bnQpeyBjb25zb2xlLmxvZyhcIm1zZyBpbjpcIiwgY291bnQsIG1zZy5ib2R5IHx8IG1zZykgfVxyXG5cdFx0XHRpZihjYXQud3NwICYmIDEgPT09IGNhdC53c3AuY291bnQpeyAobXNnLmJvZHkgfHwgbXNnKS53c3AgPSBub29wIH0gLy8gSWYgdGhlcmUgaXMgb25seSAxIGNsaWVudCwganVzdCB1c2Ugbm9vcCBzaW5jZSBpdCBkb2Vzbid0IG1hdHRlci5cclxuXHRcdFx0Y2F0Lmd1bi5vbignaW4nLCBtc2cuYm9keSB8fCBtc2cpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIG9wZW4ocGVlciwgYXMpe1xyXG5cdFx0XHRpZighcGVlciB8fCAhcGVlci51cmwpeyByZXR1cm4gfVxyXG5cdFx0XHR2YXIgdXJsID0gcGVlci51cmwucmVwbGFjZSgnaHR0cCcsICd3cycpO1xyXG5cdFx0XHR2YXIgd2lyZSA9IHBlZXIud2lyZSA9IG5ldyBXZWJTb2NrZXQodXJsLCBhcy5vcHQud3NjLnByb3RvY29scywgYXMub3B0LndzYyApO1xyXG5cdFx0XHR3aXJlLm9uY2xvc2UgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHJlY29ubmVjdChwZWVyLCBhcyk7XHJcblx0XHRcdH07XHJcblx0XHRcdHdpcmUub25lcnJvciA9IGZ1bmN0aW9uKGVycm9yKXtcclxuXHRcdFx0XHRyZWNvbm5lY3QocGVlciwgYXMpO1xyXG5cdFx0XHRcdGlmKCFlcnJvcil7IHJldHVybiB9XHJcblx0XHRcdFx0aWYoZXJyb3IuY29kZSA9PT0gJ0VDT05OUkVGVVNFRCcpe1xyXG5cdFx0XHRcdFx0Ly9yZWNvbm5lY3QocGVlciwgYXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0d2lyZS5vbm9wZW4gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciBxdWV1ZSA9IHBlZXIucXVldWU7XHJcblx0XHRcdFx0cGVlci5xdWV1ZSA9IFtdO1xyXG5cdFx0XHRcdEd1bi5vYmoubWFwKHF1ZXVlLCBmdW5jdGlvbihtc2cpe1xyXG5cdFx0XHRcdFx0bWVzc2FnZSA9IG1zZztcclxuXHRcdFx0XHRcdHNlbmQuY2FsbChhcywgcGVlcik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0d2lyZS5vbm1lc3NhZ2UgPSBmdW5jdGlvbihtc2cpe1xyXG5cdFx0XHRcdHJlY2VpdmUobXNnLCBwZWVyLCBhcyk7XHJcblx0XHRcdH07XHJcblx0XHRcdHJldHVybiB3aXJlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHJlY29ubmVjdChwZWVyLCBhcyl7XHJcblx0XHRcdGNsZWFyVGltZW91dChwZWVyLmRlZmVyKTtcclxuXHRcdFx0cGVlci5kZWZlciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRvcGVuKHBlZXIsIGFzKTtcclxuXHRcdFx0fSwgMiAqIDEwMDApO1xyXG5cdFx0fVxyXG5cdH0pKHJlcXVpcmUsICcuL3BvbHlmaWxsL3JlcXVlc3QnKTtcclxuXHJcbn0oKSk7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vZ3VuL2d1bi5qcyIsIi8qKlxuICogQ3JlYXRlZCBieSBMZW9uIFJldmlsbCBvbiAxNS8xMi8yMDE1LlxuICogQmxvZzogYmxvZy5yZXZpbGx3ZWIuY29tXG4gKiBHaXRIdWI6IGh0dHBzOi8vZ2l0aHViLmNvbS9SZXZpbGxXZWJcbiAqIFR3aXR0ZXI6IEBSZXZpbGxXZWJcbiAqL1xuXG4vKipcbiAqIFRoZSBtYWluIHJvdXRlciBjbGFzcyBhbmQgZW50cnkgcG9pbnQgdG8gdGhlIHJvdXRlci5cbiAqL1xuZXhwb3J0IGNsYXNzIFJlYmVsUm91dGVyIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG4gICAgLyoqXG4gICAgICogTWFpbiBpbml0aWFsaXNhdGlvbiBwb2ludCBvZiByZWJlbC1yb3V0ZXJcbiAgICAgKiBAcGFyYW0gcHJlZml4IC0gSWYgZXh0ZW5kaW5nIHJlYmVsLXJvdXRlciB5b3UgY2FuIHNwZWNpZnkgYSBwcmVmaXggd2hlbiBjYWxsaW5nIGNyZWF0ZWRDYWxsYmFjayBpbiBjYXNlIHlvdXIgZWxlbWVudHMgbmVlZCB0byBiZSBuYW1lZCBkaWZmZXJlbnRseVxuICAgICAqL1xuICAgIGNyZWF0ZWRDYWxsYmFjayhwcmVmaXgpIHtcblxuICAgICAgICBjb25zdCBfcHJlZml4ID0gcHJlZml4IHx8IFwicmViZWxcIjtcbiAgICAgICAgXG4gICAgICAgIHRoaXMucHJldmlvdXNQYXRoID0gbnVsbDtcbiAgICAgICAgdGhpcy5iYXNlUGF0aCA9IG51bGw7XG5cbiAgICAgICAgLy9HZXQgb3B0aW9uc1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAgICAgICBcImFuaW1hdGlvblwiOiAodGhpcy5nZXRBdHRyaWJ1dGUoXCJhbmltYXRpb25cIikgPT0gXCJ0cnVlXCIpLFxuICAgICAgICAgICAgXCJzaGFkb3dSb290XCI6ICh0aGlzLmdldEF0dHJpYnV0ZShcInNoYWRvd1wiKSA9PSBcInRydWVcIiksXG4gICAgICAgICAgICBcImluaGVyaXRcIjogKHRoaXMuZ2V0QXR0cmlidXRlKFwiaW5oZXJpdFwiKSAhPSBcImZhbHNlXCIpXG4gICAgICAgIH07XG5cbiAgICAgICAgLy9HZXQgcm91dGVzXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaW5oZXJpdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgLy9JZiB0aGlzIGlzIGEgbmVzdGVkIHJvdXRlciB0aGVuIHdlIG5lZWQgdG8gZ28gYW5kIGdldCB0aGUgcGFyZW50IHBhdGhcbiAgICAgICAgICAgIGxldCAkZWxlbWVudCA9IHRoaXM7XG4gICAgICAgICAgICB3aGlsZSAoJGVsZW1lbnQucGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgICRlbGVtZW50ID0gJGVsZW1lbnQucGFyZW50Tm9kZTtcbiAgICAgICAgICAgICAgICBpZiAoJGVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PSBfcHJlZml4ICsgXCItcm91dGVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudCA9ICRlbGVtZW50LmN1cnJlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iYXNlUGF0aCA9IGN1cnJlbnQucm91dGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJvdXRlcyA9IHt9O1xuICAgICAgICBjb25zdCAkY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8ICRjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgJGNoaWxkID0gJGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgbGV0IHBhdGggPSAkY2hpbGQuZ2V0QXR0cmlidXRlKFwicGF0aFwiKTtcbiAgICAgICAgICAgIHN3aXRjaCAoJGNoaWxkLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlIF9wcmVmaXggKyBcIi1kZWZhdWx0XCI6XG4gICAgICAgICAgICAgICAgICAgIHBhdGggPSBcIipcIjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBfcHJlZml4ICsgXCItcm91dGVcIjpcbiAgICAgICAgICAgICAgICAgICAgcGF0aCA9ICh0aGlzLmJhc2VQYXRoICE9PSBudWxsKSA/IHRoaXMuYmFzZVBhdGggKyBwYXRoIDogcGF0aDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGF0aCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGxldCAkdGVtcGxhdGUgPSBudWxsO1xuICAgICAgICAgICAgICAgIGlmICgkY2hpbGQuaW5uZXJIVE1MKSB7XG4gICAgICAgICAgICAgICAgICAgICR0ZW1wbGF0ZSA9IFwiPFwiICsgX3ByZWZpeCArIFwiLXJvdXRlPlwiICsgJGNoaWxkLmlubmVySFRNTCArIFwiPC9cIiArIF9wcmVmaXggKyBcIi1yb3V0ZT5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXNbcGF0aF0gPSB7XG4gICAgICAgICAgICAgICAgICAgIFwiY29tcG9uZW50XCI6ICRjaGlsZC5nZXRBdHRyaWJ1dGUoXCJjb21wb25lbnRcIiksXG4gICAgICAgICAgICAgICAgICAgIFwidGVtcGxhdGVcIjogJHRlbXBsYXRlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vQWZ0ZXIgd2UgaGF2ZSBjb2xsZWN0ZWQgYWxsIGNvbmZpZ3VyYXRpb24gY2xlYXIgaW5uZXJIVE1MXG4gICAgICAgIHRoaXMuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNoYWRvd1Jvb3QgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpO1xuICAgICAgICAgICAgdGhpcy5yb290ID0gdGhpcy5zaGFkb3dSb290O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yb290ID0gdGhpcztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmFuaW1hdGlvbiA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5pbml0QW5pbWF0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgUmViZWxSb3V0ZXIucGF0aENoYW5nZSgoaXNCYWNrKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmFuaW1hdGlvbiA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChpc0JhY2sgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKFwicmJsLWJhY2tcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKFwicmJsLWJhY2tcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGdW5jdGlvbiB1c2VkIHRvIGluaXRpYWxpc2UgdGhlIGFuaW1hdGlvbiBtZWNoYW5pY3MgaWYgYW5pbWF0aW9uIGlzIHR1cm5lZCBvblxuICAgICAqL1xuICAgIGluaXRBbmltYXRpb24oKSB7XG4gICAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xuICAgICAgICAgICAgbGV0IG5vZGUgPSBtdXRhdGlvbnNbMF0uYWRkZWROb2Rlc1swXTtcbiAgICAgICAgICAgIGlmIChub2RlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvdGhlckNoaWxkcmVuID0gdGhpcy5nZXRPdGhlckNoaWxkcmVuKG5vZGUpO1xuICAgICAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmFkZChcInJlYmVsLWFuaW1hdGVcIik7XG4gICAgICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QuYWRkKFwiZW50ZXJcIik7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvdGhlckNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyQ2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZC5jbGFzc0xpc3QuYWRkKFwiZXhpdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQuY2xhc3NMaXN0LmFkZChcImNvbXBsZXRlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QuYWRkKFwiY29tcGxldGVcIik7XG4gICAgICAgICAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgICAgICAgICB9LCAxMCk7XG4gICAgICAgICAgICAgICAgY29uc3QgYW5pbWF0aW9uRW5kID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQuY2xhc3NOYW1lLmluZGV4T2YoXCJleGl0XCIpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucm9vdC5yZW1vdmVDaGlsZChldmVudC50YXJnZXQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoXCJ0cmFuc2l0aW9uZW5kXCIsIGFuaW1hdGlvbkVuZCk7XG4gICAgICAgICAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKFwiYW5pbWF0aW9uZW5kXCIsIGFuaW1hdGlvbkVuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKHRoaXMsIHtjaGlsZExpc3Q6IHRydWV9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNZXRob2QgdXNlZCB0byBnZXQgdGhlIGN1cnJlbnQgcm91dGUgb2JqZWN0XG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgY3VycmVudCgpIHtcbiAgICAgICAgY29uc3QgcGF0aCA9IFJlYmVsUm91dGVyLmdldFBhdGhGcm9tVXJsKCk7XG4gICAgICAgIGZvciAoY29uc3Qgcm91dGUgaW4gdGhpcy5yb3V0ZXMpIHtcbiAgICAgICAgICAgIGlmIChyb3V0ZSAhPT0gXCIqXCIpIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVnZXhTdHJpbmcgPSBcIl5cIiArIHJvdXRlLnJlcGxhY2UoL3tcXHcrfVxcLz8vZywgXCIoXFxcXHcrKVxcLz9cIik7XG4gICAgICAgICAgICAgICAgcmVnZXhTdHJpbmcgKz0gKHJlZ2V4U3RyaW5nLmluZGV4T2YoXCJcXFxcLz9cIikgPiAtMSkgPyBcIlwiIDogXCJcXFxcLz9cIiArIFwiKFs/PSYtXFwvXFxcXHcrXSspPyRcIjtcbiAgICAgICAgICAgICAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAocmVnZXhTdHJpbmcpO1xuICAgICAgICAgICAgICAgIGlmIChyZWdleC50ZXN0KHBhdGgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfcm91dGVSZXN1bHQodGhpcy5yb3V0ZXNbcm91dGVdLCByb3V0ZSwgcmVnZXgsIHBhdGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKHRoaXMucm91dGVzW1wiKlwiXSAhPT0gdW5kZWZpbmVkKSA/IF9yb3V0ZVJlc3VsdCh0aGlzLnJvdXRlc1tcIipcIl0sIFwiKlwiLCBudWxsLCBwYXRoKSA6IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWV0aG9kIGNhbGxlZCB0byByZW5kZXIgdGhlIGN1cnJlbnQgdmlld1xuICAgICAqL1xuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5jdXJyZW50KCk7XG4gICAgICAgIGlmIChyZXN1bHQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQucGF0aCAhPT0gdGhpcy5wcmV2aW91c1BhdGggfHwgdGhpcy5vcHRpb25zLmFuaW1hdGlvbiA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYW5pbWF0aW9uICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm9vdC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmNvbXBvbmVudCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgJGNvbXBvbmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQocmVzdWx0LmNvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiByZXN1bHQucGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSByZXN1bHQucGFyYW1zW2tleV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09IFwiT2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IEpTT04ucGFyc2UodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkNvdWxkbid0IHBhcnNlIHBhcmFtIHZhbHVlOlwiLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAkY29tcG9uZW50LnNldEF0dHJpYnV0ZShrZXksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvb3QuYXBwZW5kQ2hpbGQoJGNvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0ICR0ZW1wbGF0ZSA9IHJlc3VsdC50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgLy9UT0RPOiBGaW5kIGEgZmFzdGVyIGFsdGVybmF0aXZlXG4gICAgICAgICAgICAgICAgICAgIGlmICgkdGVtcGxhdGUuaW5kZXhPZihcIiR7XCIpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICR0ZW1wbGF0ZSA9ICR0ZW1wbGF0ZS5yZXBsYWNlKC9cXCR7KFtee31dKil9L2csXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHIgPSByZXN1bHQucGFyYW1zW2JdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mIHIgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiByID09PSAnbnVtYmVyJyA/IHIgOiBhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb290LmlubmVySFRNTCA9ICR0ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5wcmV2aW91c1BhdGggPSByZXN1bHQucGF0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbm9kZSAtIFVzZWQgd2l0aCB0aGUgYW5pbWF0aW9uIG1lY2hhbmljcyB0byBnZXQgYWxsIG90aGVyIHZpZXcgY2hpbGRyZW4gZXhjZXB0IGl0c2VsZlxuICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgKi9cbiAgICBnZXRPdGhlckNoaWxkcmVuKG5vZGUpIHtcbiAgICAgICAgY29uc3QgY2hpbGRyZW4gPSB0aGlzLnJvb3QuY2hpbGRyZW47XG4gICAgICAgIGxldCByZXN1bHRzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgaWYgKGNoaWxkICE9IG5vZGUpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIFN0YXRpYyBoZWxwZXIgbWV0aG9kIHRvIHBhcnNlIHRoZSBxdWVyeSBzdHJpbmcgZnJvbSBhIHVybCBpbnRvIGFuIG9iamVjdC5cbiAgICAgKiBAcGFyYW0gdXJsXG4gICAgICogQHJldHVybnMge3t9fVxuICAgICAqL1xuICAgIHN0YXRpYyBwYXJzZVF1ZXJ5U3RyaW5nKHVybCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICAgIGlmICh1cmwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdmFyIHF1ZXJ5U3RyaW5nID0gKHVybC5pbmRleE9mKFwiP1wiKSA+IC0xKSA/IHVybC5zdWJzdHIodXJsLmluZGV4T2YoXCI/XCIpICsgMSwgdXJsLmxlbmd0aCkgOiBudWxsO1xuICAgICAgICAgICAgaWYgKHF1ZXJ5U3RyaW5nICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcXVlcnlTdHJpbmcuc3BsaXQoXCImXCIpLmZvckVhY2goZnVuY3Rpb24gKHBhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwYXJ0KSByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIHBhcnQgPSBwYXJ0LnJlcGxhY2UoXCIrXCIsIFwiIFwiKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVxID0gcGFydC5pbmRleE9mKFwiPVwiKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9IGVxID4gLTEgPyBwYXJ0LnN1YnN0cigwLCBlcSkgOiBwYXJ0O1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsID0gZXEgPiAtMSA/IGRlY29kZVVSSUNvbXBvbmVudChwYXJ0LnN1YnN0cihlcSArIDEpKSA6IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmcm9tID0ga2V5LmluZGV4T2YoXCJbXCIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZnJvbSA9PSAtMSkgcmVzdWx0W2RlY29kZVVSSUNvbXBvbmVudChrZXkpXSA9IHZhbDtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdG8gPSBrZXkuaW5kZXhPZihcIl1cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBkZWNvZGVVUklDb21wb25lbnQoa2V5LnN1YnN0cmluZyhmcm9tICsgMSwgdG8pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IGRlY29kZVVSSUNvbXBvbmVudChrZXkuc3Vic3RyaW5nKDAsIGZyb20pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcmVzdWx0W2tleV0pIHJlc3VsdFtrZXldID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWluZGV4KSByZXN1bHRba2V5XS5wdXNoKHZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHJlc3VsdFtrZXldW2luZGV4XSA9IHZhbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RhdGljIGhlbHBlciBtZXRob2QgdG8gY29udmVydCBhIGNsYXNzIG5hbWUgdG8gYSB2YWxpZCBlbGVtZW50IG5hbWUuXG4gICAgICogQHBhcmFtIENsYXNzXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBzdGF0aWMgY2xhc3NUb1RhZyhDbGFzcykge1xuICAgICAgICAvKipcbiAgICAgICAgICogQ2xhc3MubmFtZSB3b3VsZCBiZSBiZXR0ZXIgYnV0IHRoaXMgaXNuJ3Qgc3VwcG9ydGVkIGluIElFIDExLlxuICAgICAgICAgKi9cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBuYW1lID0gQ2xhc3MudG9TdHJpbmcoKS5tYXRjaCgvXmZ1bmN0aW9uXFxzKihbXlxccyhdKykvKVsxXS5yZXBsYWNlKC9cXFcrL2csICctJykucmVwbGFjZSgvKFthLXpcXGRdKShbQS1aMC05XSkvZywgJyQxLSQyJykudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgcGFyc2UgY2xhc3MgbmFtZTpcIiwgZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFJlYmVsUm91dGVyLnZhbGlkRWxlbWVudFRhZyhuYW1lKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNsYXNzIG5hbWUgY291bGRuJ3QgYmUgdHJhbnNsYXRlZCB0byB0YWcuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuYW1lO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0YXRpYyBoZWxwZXIgbWV0aG9kIHVzZWQgdG8gZGV0ZXJtaW5lIGlmIGFuIGVsZW1lbnQgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUgaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkLlxuICAgICAqIEBwYXJhbSBuYW1lXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgc3RhdGljIGlzUmVnaXN0ZXJlZEVsZW1lbnQobmFtZSkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lKS5jb25zdHJ1Y3RvciAhPT0gSFRNTEVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RhdGljIGhlbHBlciBtZXRob2QgdG8gdGFrZSBhIHdlYiBjb21wb25lbnQgY2xhc3MsIGNyZWF0ZSBhbiBlbGVtZW50IG5hbWUgYW5kIHJlZ2lzdGVyIHRoZSBuZXcgZWxlbWVudCBvbiB0aGUgZG9jdW1lbnQuXG4gICAgICogQHBhcmFtIENsYXNzXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBzdGF0aWMgY3JlYXRlRWxlbWVudChDbGFzcykge1xuICAgICAgICBjb25zdCBuYW1lID0gUmViZWxSb3V0ZXIuY2xhc3NUb1RhZyhDbGFzcyk7XG4gICAgICAgIGlmIChSZWJlbFJvdXRlci5pc1JlZ2lzdGVyZWRFbGVtZW50KG5hbWUpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgQ2xhc3MucHJvdG90eXBlLm5hbWUgPSBuYW1lO1xuICAgICAgICAgICAgZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KG5hbWUsIENsYXNzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmFtZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaW1wbGUgc3RhdGljIGhlbHBlciBtZXRob2QgY29udGFpbmluZyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byB2YWxpZGF0ZSBhbiBlbGVtZW50IG5hbWVcbiAgICAgKiBAcGFyYW0gdGFnXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgc3RhdGljIHZhbGlkRWxlbWVudFRhZyh0YWcpIHtcbiAgICAgICAgcmV0dXJuIC9eW2EtejAtOVxcLV0rJC8udGVzdCh0YWcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1ldGhvZCB1c2VkIHRvIHJlZ2lzdGVyIGEgY2FsbGJhY2sgdG8gYmUgY2FsbGVkIHdoZW4gdGhlIFVSTCBwYXRoIGNoYW5nZXMuXG4gICAgICogQHBhcmFtIGNhbGxiYWNrXG4gICAgICovXG4gICAgc3RhdGljIHBhdGhDaGFuZ2UoY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKFJlYmVsUm91dGVyLmNoYW5nZUNhbGxiYWNrcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBSZWJlbFJvdXRlci5jaGFuZ2VDYWxsYmFja3MgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBSZWJlbFJvdXRlci5jaGFuZ2VDYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgICAgIGNvbnN0IGNoYW5nZUhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICBldmVudC5vbGRVUkwgYW5kIGV2ZW50Lm5ld1VSTCB3b3VsZCBiZSBiZXR0ZXIgaGVyZSBidXQgdGhpcyBkb2Vzbid0IHdvcmsgaW4gSUUgOihcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5ocmVmICE9IFJlYmVsUm91dGVyLm9sZFVSTCkge1xuICAgICAgICAgICAgICAgIFJlYmVsUm91dGVyLmNoYW5nZUNhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uKGNhbGxiYWNrKXtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soUmViZWxSb3V0ZXIuaXNCYWNrKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBSZWJlbFJvdXRlci5pc0JhY2sgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFJlYmVsUm91dGVyLm9sZFVSTCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgICAgICB9O1xuICAgICAgICBpZiAod2luZG93Lm9uaGFzaGNoYW5nZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyYmxiYWNrXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgUmViZWxSb3V0ZXIuaXNCYWNrID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHdpbmRvdy5vbmhhc2hjaGFuZ2UgPSBjaGFuZ2VIYW5kbGVyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0YXRpYyBoZWxwZXIgbWV0aG9kIHVzZWQgdG8gZ2V0IHRoZSBwYXJhbWV0ZXJzIGZyb20gdGhlIHByb3ZpZGVkIHJvdXRlLlxuICAgICAqIEBwYXJhbSByZWdleFxuICAgICAqIEBwYXJhbSByb3V0ZVxuICAgICAqIEBwYXJhbSBwYXRoXG4gICAgICogQHJldHVybnMge3t9fVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRQYXJhbXNGcm9tVXJsKHJlZ2V4LCByb3V0ZSwgcGF0aCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gUmViZWxSb3V0ZXIucGFyc2VRdWVyeVN0cmluZyhwYXRoKTtcbiAgICAgICAgdmFyIHJlID0gL3soXFx3Kyl9L2c7XG4gICAgICAgIHZhciByZXN1bHRzID0gW107XG4gICAgICAgIGxldCBtYXRjaDtcbiAgICAgICAgd2hpbGUgKG1hdGNoID0gcmUuZXhlYyhyb3V0ZSkpIHtcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChtYXRjaFsxXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlZ2V4ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0czIgPSByZWdleC5leGVjKHBhdGgpO1xuICAgICAgICAgICAgcmVzdWx0cy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpZHgpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbaXRlbV0gPSByZXN1bHRzMltpZHggKyAxXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RhdGljIGhlbHBlciBtZXRob2QgdXNlZCB0byBnZXQgdGhlIHBhdGggZnJvbSB0aGUgY3VycmVudCBVUkwuXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgc3RhdGljIGdldFBhdGhGcm9tVXJsKCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gd2luZG93LmxvY2F0aW9uLmhyZWYubWF0Y2goLyMoLiopJC8pO1xuICAgICAgICBpZiAocmVzdWx0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0WzFdO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJyZWJlbC1yb3V0ZXJcIiwgUmViZWxSb3V0ZXIpO1xuXG4vKipcbiAqIENsYXNzIHdoaWNoIHJlcHJlc2VudHMgdGhlIHJlYmVsLXJvdXRlIGN1c3RvbSBlbGVtZW50XG4gKi9cbmV4cG9ydCBjbGFzcyBSZWJlbFJvdXRlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJyZWJlbC1yb3V0ZVwiLCBSZWJlbFJvdXRlKTtcblxuLyoqXG4gKiBDbGFzcyB3aGljaCByZXByZXNlbnRzIHRoZSByZWJlbC1kZWZhdWx0IGN1c3RvbSBlbGVtZW50XG4gKi9cbmNsYXNzIFJlYmVsRGVmYXVsdCBleHRlbmRzIEhUTUxFbGVtZW50IHtcblxufVxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwicmViZWwtZGVmYXVsdFwiLCBSZWJlbERlZmF1bHQpO1xuXG5cbi8qKlxuICogUmVwcmVzZW50cyB0aGUgcHJvdG90eXBlIGZvciBhbiBhbmNob3IgZWxlbWVudCB3aGljaCBhZGRlZCBmdW5jdGlvbmFsaXR5IHRvIHBlcmZvcm0gYSBiYWNrIHRyYW5zaXRpb24uXG4gKi9cbmNsYXNzIFJlYmVsQmFja0EgZXh0ZW5kcyBIVE1MQW5jaG9yRWxlbWVudCB7XG4gICAgYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwYXRoID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpO1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGlmIChwYXRoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3JibGJhY2snKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IHBhdGg7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbi8qKlxuICogUmVnaXN0ZXIgdGhlIGJhY2sgYnV0dG9uIGN1c3RvbSBlbGVtZW50XG4gKi9cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcInJlYmVsLWJhY2stYVwiLCB7XG4gICAgZXh0ZW5kczogXCJhXCIsXG4gICAgcHJvdG90eXBlOiBSZWJlbEJhY2tBLnByb3RvdHlwZVxufSk7XG5cbi8qKlxuICogQ29uc3RydWN0cyBhIHJvdXRlIG9iamVjdFxuICogQHBhcmFtIG9iaiAtIHRoZSBjb21wb25lbnQgbmFtZSBvciB0aGUgSFRNTCB0ZW1wbGF0ZVxuICogQHBhcmFtIHJvdXRlXG4gKiBAcGFyYW0gcmVnZXhcbiAqIEBwYXJhbSBwYXRoXG4gKiBAcmV0dXJucyB7e319XG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBfcm91dGVSZXN1bHQob2JqLCByb3V0ZSwgcmVnZXgsIHBhdGgpIHtcbiAgICBsZXQgcmVzdWx0ID0ge307XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gb2JqW2tleV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0LnJvdXRlID0gcm91dGU7XG4gICAgcmVzdWx0LnBhdGggPSBwYXRoO1xuICAgIHJlc3VsdC5wYXJhbXMgPSBSZWJlbFJvdXRlci5nZXRQYXJhbXNGcm9tVXJsKHJlZ2V4LCByb3V0ZSwgcGF0aCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3JlYmVsLXJvdXRlci9zcmMvcmViZWwtcm91dGVyLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBpbXBvcnQge2hhbmRsZVBHUFB1YmtleX0gZnJvbSAnLi4vLi4vc3JjL2xpYi91dGlsLmpzJztcbi8vIGltcG9ydCB7aGFuZGxlUEdQUHJpdmtleX0gZnJvbSAnLi4vLi4vc3JjL2xpYi91dGlsLmpzJztcbi8vIGltcG9ydCB7aGFuZGxlUEdQTWVzc2FnZX0gZnJvbSAnLi4vLi4vc3JjL2xpYi91dGlsLmpzJztcblxuaW1wb3J0IHtlbmNyeXB0Q2xlYXJ0ZXh0TXVsdGl9IGZyb20gJy4vZW5jcnlwdENsZWFydGV4dE11bHRpLmpzJztcbmltcG9ydCB7ZGVjcnlwdFBHUE1lc3NhZ2V9IGZyb20gJy4vZGVjcnlwdFBHUE1lc3NhZ2UuanMnO1xuaW1wb3J0IHtkZXRlcm1pbmVDb250ZW50VHlwZX0gZnJvbSAnLi9kZXRlcm1pbmVDb250ZW50VHlwZS5qcyc7XG5pbXBvcnQge3NhdmVQR1BQdWJrZXl9IGZyb20gJy4vc2F2ZVBHUFB1YmtleS5qcyc7XG5pbXBvcnQge3NhdmVQR1BQcml2a2V5fSBmcm9tICcuL3NhdmVQR1BQcml2a2V5LmpzJztcbi8vIGltcG9ydCB7Z2V0RnJvbVN0b3JhZ2V9IGZyb20gJy4vZ2V0RnJvbVN0b3JhZ2UnO1xuXG5jb25zdCBQR1BQVUJLRVkgPSAnUEdQUHVia2V5JztcbmNvbnN0IENMRUFSVEVYVCA9ICdjbGVhcnRleHQnO1xuY29uc3QgUEdQUFJJVktFWSA9ICdQR1BQcml2a2V5JztcbmNvbnN0IFBHUE1FU1NBR0UgPSAnUEdQTWVzc2FnZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVQb3N0KGNvbnRlbnQpIHtcbiAgICByZXR1cm4gKCFjb250ZW50KSA/XG4gICAgUHJvbWlzZS5yZXNvbHZlKCcnKSA6XG4gICAgKG9wZW5wZ3ApID0+IHtcbiAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgICAgICAobG9jYWxTdG9yYWdlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKHBhc3N3b3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChndW5kYikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGV0ZXJtaW5lQ29udGVudFR5cGUoY29udGVudCkob3BlbnBncClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGNvbnRlbnRUeXBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudFR5cGUgPT09IENMRUFSVEVYVCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhDTEVBUlRFWFQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlbmNyeXB0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBlbmNyeXB0Q2xlYXJ0ZXh0TXVsdGkoY29udGVudCkob3BlbnBncCkobG9jYWxTdG9yYWdlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4gcmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRlbnRUeXBlID09PSBQR1BQUklWS0VZKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFBHUFBSSVZLRVkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzYXZlIGFuZCBicm9hZGNhc3QgY29udmVydGVkIHB1YmxpYyBrZXlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNhdmVQR1BQcml2a2V5KGNvbnRlbnQpKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9yZXR1cm4gYnJvYWRjYXN0TWVzc2FnZShjb250ZW50KShvcGVucGdwKShsb2NhbFN0b3JhZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiByZXN1bHQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50VHlwZSA9PT0gUEdQUFVCS0VZKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFBHUFBVQktFWSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNhdmUgdG8gbG9jYWxTdG9yYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzYXZlUEdQUHVia2V5KGNvbnRlbnQpKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRlbnRUeXBlID09PSBQR1BNRVNTQUdFKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFBHUE1FU1NBR0UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBnZXQgUEdQS2V5cywgZGVjcnlwdCwgIGFuZCByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlY3J5cHRQR1BNZXNzYWdlKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSkocGFzc3dvcmQpKGNvbnRlbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHJlamVjdChlcnIpKVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvaGFuZGxlUG9zdC5qcyIsImxldCBjb250YWN0UGFydGlhbCA9IHJlcXVpcmUoXCJyYXctbG9hZGVyIS4uLy4uL3ZpZXdzL3BhcnRpYWxzL2NvbnRhY3QuaHRtbFwiKTtcbmV4cG9ydCBjbGFzcyBDb250YWN0UGFnZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLmlubmVySFRNTCA9ICc8cD4nICsgY29udGFjdFBhcnRpYWwgKyAnPC9wPic7XG4gICAgfVxufVxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwiY29udGFjdC1wYWdlXCIsIENvbnRhY3RQYWdlKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYWdlcy9jb250YWN0LmpzIiwidmFyIGZyZXNoRGVja1BhcnRpYWwgPSByZXF1aXJlKFwicmF3LWxvYWRlciEuLi8uLi92aWV3cy9wYXJ0aWFscy9mcmVzaGRlY2suaHRtbFwiKTtcblxuZXhwb3J0IGNsYXNzIERlY2tQYWdlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICAgIGF0dGFjaGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuaW5uZXJIVE1MID0gJzxwPicgKyBmcmVzaERlY2tQYXJ0aWFsICsgJzwvcD4nO1xuICAgIH1cbn1cblxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwiZGVjay1wYWdlXCIsIERlY2tQYWdlKTtcbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgncGxheWluZy1jYXJkJywge1xuICAgIHByb3RvdHlwZTogT2JqZWN0LmNyZWF0ZShIVE1MRWxlbWVudC5wcm90b3R5cGUsIHsgY3JlYXRlZENhbGxiYWNrOiB7XG4gICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgcm9vdCA9IHRoaXMuY3JlYXRlU2hhZG93Um9vdCgpO1xuICAgICAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignIycgKyB0aGlzLnRleHRDb250ZW50IHx8ICcj4paIJyk7XG4gICAgICAgICAgICAgICAgICB2YXIgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgdmFyIGNvbG9yT3ZlcnJpZGUgPSAodGhpcy5xdWVyeVNlbGVjdG9yKCdzcGFuJykpID8gdGhpcy5xdWVyeVNlbGVjdG9yKCdzcGFuJykuc3R5bGUuY29sb3I6IG51bGw7XG4gICAgICAgICAgICAgICAgICBpZiAoY29sb3JPdmVycmlkZSkge1xuICAgICAgICAgICAgICAgICAgICAgIGNsb25lLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpLnN0eWxlLmZpbGwgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKS5zdHlsZS5jb2xvcjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY2xvbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcbn0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhZ2VzL2RlY2suanMiLCJ2YXIgaW5kZXhQYXJ0aWFsID0gcmVxdWlyZShcInJhdy1sb2FkZXIhLi4vLi4vdmlld3MvcGFydGlhbHMvaW5kZXguaHRtbFwiKTtcbmV4cG9ydCBjbGFzcyBJbmRleFBhZ2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSBgXG4gICAgICAgIDxwPiR7aW5kZXhQYXJ0aWFsfTwvcD5cbiAgICAgICAgYDtcbiAgICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJpbmRleC1wYWdlXCIsIEluZGV4UGFnZSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFnZXMvaW5kZXguanMiLCJ2YXIgY2xpZW50UHVia2V5Rm9ybVBhcnRpYWwgPSByZXF1aXJlKFwicmF3LWxvYWRlciEuLi8uLi92aWV3cy9wYXJ0aWFscy9tZXNzYWdlX2Zvcm0uaHRtbFwiKTtcblxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VQYWdlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICAgIGF0dGFjaGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuaW5uZXJIVE1MID0gYFxuICAgICAgICAgICAgPHA+JHtjbGllbnRQdWJrZXlGb3JtUGFydGlhbH08L3A+XG4gICAgICAgIGBcbiAgICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJtZXNzYWdlLXBhZ2VcIiwgTWVzc2FnZVBhZ2UpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhZ2VzL21lc3NhZ2UuanMiLCJ2YXIgcm9hZG1hcFBhcnRpYWwgPSByZXF1aXJlKFwicmF3LWxvYWRlciEuLi8uLi92aWV3cy9wYXJ0aWFscy9yb2FkbWFwLmh0bWxcIik7XG5leHBvcnQgY2xhc3MgUm9hZG1hcFBhZ2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSAnPHA+JyArIHJvYWRtYXBQYXJ0aWFsICsgJzwvcD4nO1xuICAgIH1cbn1cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcInJvYWRtYXAtcGFnZVwiLCBSb2FkbWFwUGFnZSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFnZXMvcm9hZG1hcC5qcyIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3Byb2Nlc3MvYnJvd3Nlci5qcyIsInZhciBnO1xyXG5cclxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcclxuZyA9IChmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcztcclxufSkoKTtcclxuXHJcbnRyeSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXHJcblx0ZyA9IGcgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpIHx8ICgxLGV2YWwpKFwidGhpc1wiKTtcclxufSBjYXRjaChlKSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcclxuXHRpZih0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKVxyXG5cdFx0ZyA9IHdpbmRvdztcclxufVxyXG5cclxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxyXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xyXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGc7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAod2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1vZHVsZSkge1xyXG5cdGlmKCFtb2R1bGUud2VicGFja1BvbHlmaWxsKSB7XHJcblx0XHRtb2R1bGUuZGVwcmVjYXRlID0gZnVuY3Rpb24oKSB7fTtcclxuXHRcdG1vZHVsZS5wYXRocyA9IFtdO1xyXG5cdFx0Ly8gbW9kdWxlLnBhcmVudCA9IHVuZGVmaW5lZCBieSBkZWZhdWx0XHJcblx0XHRpZighbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcclxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwibG9hZGVkXCIsIHtcclxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmw7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJpZFwiLCB7XHJcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIG1vZHVsZS5pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdG1vZHVsZS53ZWJwYWNrUG9seWZpbGwgPSAxO1xyXG5cdH1cclxuXHRyZXR1cm4gbW9kdWxlO1xyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gKHdlYnBhY2spL2J1aWxkaW4vbW9kdWxlLmpzIiwiJ3VzZSBzdHJpY3QnO1xuLy9pbXBvcnQgJ3dlYmNvbXBvbmVudHMuanMvd2ViY29tcG9uZW50cy5qcyc7XG4vL3VuY29tbWVudCBsaW5lIGFib3ZlIHRvIGRvdWJsZSBhcHAgc2l6ZSBhbmQgc3VwcG9ydCBpb3MuXG5cbmltcG9ydCB7aGFuZGxlUG9zdH0gZnJvbSAnLi9saWIvaGFuZGxlUG9zdC5qcyc7XG53aW5kb3cuaGFuZGxlUG9zdCA9IGhhbmRsZVBvc3Q7XG5pbXBvcnQge2RldGVybWluZUNvbnRlbnRUeXBlfSBmcm9tICcuL2xpYi9kZXRlcm1pbmVDb250ZW50VHlwZS5qcydcbndpbmRvdy5kZXRlcm1pbmVDb250ZW50VHlwZSA9IGRldGVybWluZUNvbnRlbnRUeXBlO1xuaW1wb3J0IHtkZXRlcm1pbmVLZXlUeXBlfSBmcm9tICcuL2xpYi9kZXRlcm1pbmVLZXlUeXBlLmpzJ1xud2luZG93LmRldGVybWluZUtleVR5cGUgPSBkZXRlcm1pbmVLZXlUeXBlO1xuaW1wb3J0IHtlbmNyeXB0Q2xlYXJ0ZXh0TXVsdGl9IGZyb20gJy4vbGliL2VuY3J5cHRDbGVhcnRleHRNdWx0aS5qcydcbndpbmRvdy5lbmNyeXB0Q2xlYXJ0ZXh0TXVsdGkgPSBlbmNyeXB0Q2xlYXJ0ZXh0TXVsdGk7XG5pbXBvcnQge2VuY3J5cHRDbGVhclRleHR9IGZyb20gJy4vbGliL2VuY3J5cHRDbGVhclRleHQuanMnXG53aW5kb3cuZW5jcnlwdENsZWFyVGV4dCA9IGVuY3J5cHRDbGVhclRleHQ7XG5pbXBvcnQge2RlY3J5cHRQR1BNZXNzYWdlfSBmcm9tICcuL2xpYi9kZWNyeXB0UEdQTWVzc2FnZS5qcydcbndpbmRvdy5kZWNyeXB0UEdQTWVzc2FnZSA9IGRlY3J5cHRQR1BNZXNzYWdlO1xuaW1wb3J0IHtzYXZlUEdQUHVia2V5fSBmcm9tICcuL2xpYi9zYXZlUEdQUHVia2V5LmpzJ1xud2luZG93LnNhdmVQR1BQdWJrZXkgPSBzYXZlUEdQUHVia2V5O1xuaW1wb3J0IHtzYXZlUEdQUHJpdmtleX0gZnJvbSAnLi9saWIvc2F2ZVBHUFByaXZrZXkuanMnXG53aW5kb3cuc2F2ZVBHUFByaXZrZXkgPSBzYXZlUEdQUHJpdmtleTtcbmltcG9ydCB7Z2V0RnJvbVN0b3JhZ2V9IGZyb20gJy4vbGliL2dldEZyb21TdG9yYWdlLmpzJ1xud2luZG93LmdldEZyb21TdG9yYWdlID0gZ2V0RnJvbVN0b3JhZ2U7XG5pbXBvcnQge2RlY3J5cHRQR1BNZXNzYWdlV2l0aEtleX0gZnJvbSAnLi9saWIvZGVjcnlwdFBHUE1lc3NhZ2VXaXRoS2V5LmpzJ1xud2luZG93LmRlY3J5cHRQR1BNZXNzYWdlV2l0aEtleSA9IGRlY3J5cHRQR1BNZXNzYWdlV2l0aEtleTtcblxuLy8gcmViZWwgcm91dGVyXG5pbXBvcnQge1JlYmVsUm91dGVyfSBmcm9tICcuLi9ub2RlX21vZHVsZXMvcmViZWwtcm91dGVyL3NyYy9yZWJlbC1yb3V0ZXIuanMnO1xuXG4vLyBHdW5kYiBwdWJsaWMgZmFjaW5nIERBRyBkYXRhYmFzZSAgKGZvciBtZXNzYWdlcyB0byBhbmQgZnJvbSB0aGUgZW5lbXkpXG5pbXBvcnQge0d1bn0gZnJvbSAnZ3VuL2d1bi5qcyc7XG5cbi8vIHBhZ2VzIChtb3N0IG9mIHRoaXMgc2hvdWxkIGJlIGluIHZpZXdzL3BhcnRpYWxzIHRvIGFmZmVjdCBpc29ybW9ycGhpc20pXG5pbXBvcnQge0luZGV4UGFnZX0gICBmcm9tICcuL3BhZ2VzL2luZGV4LmpzJztcbmltcG9ydCB7Um9hZG1hcFBhZ2V9IGZyb20gJy4vcGFnZXMvcm9hZG1hcC5qcyc7XG5pbXBvcnQge0NvbnRhY3RQYWdlfSBmcm9tICcuL3BhZ2VzL2NvbnRhY3QuanMnO1xuaW1wb3J0IHtNZXNzYWdlUGFnZX0gZnJvbSAnLi9wYWdlcy9tZXNzYWdlLmpzJztcbmltcG9ydCB7RGVja1BhZ2V9ICAgIGZyb20gJy4vcGFnZXMvZGVjay5qcyc7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCBub3RFbXB0eSBmcm9tICcuLi8uLi9zcmMvbGliL25vdEVtcHR5LmpzJztcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG5vdFBHUEtleShjb250ZW50KSB7XG4gICAgcmV0dXJuICghY29udGVudCkgP1xuICAgICgpID0+IG5vdEVtcHR5KGNvbnRlbnQpOlxuICAgIChvcGVucGdwKSA9PiB7XG4gICAgICAgIHJldHVybiAoIW9wZW5wZ3ApID9cbiAgICAgICAgUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdtaXNzaW5nIG9wZW5wZ3AnKSk6XG4gICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGxldCBwb3NzaWJsZXBncGtleSA9IG9wZW5wZ3Aua2V5LnJlYWRBcm1vcmVkKGNvbnRlbnQpO1xuICAgICAgICAgICAgaWYgKHBvc3NpYmxlcGdwa2V5LmtleXNbMF0pIHtcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCdQR1Aga2V5JykpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGNvbnRlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGliL25vdFBHUEtleS5qcyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IG5vdEVtcHR5IGZyb20gJy4uLy4uL3NyYy9saWIvbm90RW1wdHkuanMnO1xuaW1wb3J0IG5vdENsZWFydGV4dCBmcm9tICcuLi8uLi9zcmMvbGliL25vdENsZWFydGV4dC5qcyc7XG5pbXBvcnQgbm90UEdQS2V5IGZyb20gJy4uLy4uL3NyYy9saWIvbm90UEdQS2V5LmpzJztcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG5vdFBHUE1lc3NhZ2UoY29udGVudCkge1xuICAgIHJldHVybiAoIWNvbnRlbnQpID9cbiAgICAoKSA9PiBub3RFbXB0eShjb250ZW50KTpcbiAgICAob3BlbnBncCkgPT4ge1xuICAgICAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcignbWlzc2luZyBvcGVucGdwJykpOlxuICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG5vdENsZWFydGV4dChjb250ZW50KShvcGVucGdwKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5vdFBHUEtleShjb250ZW50KShvcGVucGdwKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNvbnRlbnQpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY29udGVudClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvciAoJ1BHUE1lc3NhZ2UgY29udGVudCcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvbm90UEdQTWVzc2FnZS5qcyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IG5vdEVtcHR5IGZyb20gJy4uLy4uL3NyYy9saWIvbm90RW1wdHkuanMnO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbm90UEdQUHVia2V5KGNvbnRlbnQpIHtcbiAgICByZXR1cm4gKCFjb250ZW50KSA/XG4gICAgKCkgPT4gbm90RW1wdHkoY29udGVudCk6XG4gICAgKG9wZW5wZ3ApID0+IHtcbiAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgICAgICBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ21pc3Npbmcgb3BlbnBncCcpKTpcbiAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsZXQgcGdwS2V5ID0gb3BlbnBncC5rZXkucmVhZEFybW9yZWQoY29udGVudCkua2V5c1swXTtcbiAgICAgICAgICAgICAgICBpZiAocGdwS2V5LnRvUHVibGljKCkuYXJtb3IoKSAhPT0gcGdwS2V5LmFybW9yKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignUEdQIFByaXZrZXkgY29udGVudCcpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoY29udGVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGliL25vdFBHUFByaXZrZXkuanMiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG5vdFVuZGVmaW5lZChjb250ZW50KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmKHR5cGVvZihjb250ZW50KS50b1N0cmluZygpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoY29udGVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2goZXJyKSB7XG4gICAgICAgICAgICByZWplY3QobmV3IEVycm9yKCd1bmRlZmluZWQgY29udGVudCcpKTtcbiAgICAgICAgfVxuICAgIH0pXG59O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xpYi9ub3RVbmRlZmluZWQuanMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPHNwYW4gY2xhc3M9XFxcImNvbnRhY3RcXFwiPlxcbiAgICBDb2xlIEFsYm9uPGJyPlxcbiAgICA8YSBocmVmPVxcXCJ0ZWw6KzE0MTU2NzIxNjQ4XFxcIj4oNDE1KSA2NzItMTY0ODwvYT48YnI+XFxuICAgIDxhIGhyZWY9XFxcIm1haWx0bzpjb2xlLmFsYm9uQGdtYWlsLmNvbVxcXCI+Y29sZS5hbGJvbkBnbWFpbC5jb208L2E+PGJyPlxcbiAgICA8YSBocmVmPVxcXCJodHRwczovL2dpdGh1Yi5jb20vY29sZWFsYm9uXFxcIj5odHRwczovL2dpdGh1Yi5jb20vY29sZWFsYm9uPC9hPjxicj5cXG4gICAgPGEgaHJlZj1cXFwiaHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL2NvbGUtYWxib24tNTkzNDYzNFxcXCI+XFxuICAgICAgICA8c3BhbiBpZD1cXFwibGlua2VkaW5hZGRyZXNzXFxcIiBjbGFzcz1cXFwibGlua2VkaW5hZGRyZXNzXFxcIj5odHRwczovL3d3dy5saW5rZWRpbi5jb20vaW4vY29sZS1hbGJvbi01OTM0NjM0PC9zcGFuPlxcbiAgICA8L2E+PGJyPlxcbjwvc3Bhbj5cXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yYXctbG9hZGVyIS4vdmlld3MvcGFydGlhbHMvY29udGFjdC5odG1sXG4vLyBtb2R1bGUgaWQgPSAyN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiICAgIDxkaXYgaWQ9XFxcImRlY2tcXFwiIGNsYXNzPVxcXCJkZWNrXFxcIj5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLilohcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNzAuMzEyNSAzNjIuMjUgTDcwLjMxMjUgMTEwLjEwOTQgTDIyNC4yOTY5IDExMC4xMDk0IEwyMjQuMjk2OSAzNjIuMjUgTDcwLjMxMjUgMzYyLjI1IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoEFcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTExMC42NzE5IDExNS43MzQ0IEw5MS44MjgxIDE3NS43ODEyIEwxMjkuNTE1NiAxNzUuNzgxMiBMMTEwLjY3MTkgMTE1LjczNDQgWk05OS45ODQ0IDEwMS42NzE5IEwxMjEuNjQwNiAxMDEuNjcxOSBMMTYyLjE0MDYgMjE5LjIzNDQgTDE0My41NzgxIDIxOS4yMzQ0IEwxMzQuMDE1NiAxODguNTc4MSBMODcuNjA5NCAxODguNTc4MSBMNzguMDQ2OSAyMTkuMjM0NCBMNTkuNDg0NCAyMTkuMjM0NCBMOTkuOTg0NCAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaAyXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk04Ni4zNDM4IDIwMy4wNjI1IEwxNDUuOTY4OCAyMDMuMDYyNSBMMTQ1Ljk2ODggMjE5LjA5MzggTDYxLjg3NSAyMTkuMDkzOCBMNjEuODc1IDIwMy42MjUgUTY2LjY1NjIgMTk5LjI2NTYgNzUuNTE1NiAxOTEuMzkwNiBRMTIzLjg5MDYgMTQ4LjUgMTIzLjg5MDYgMTM1LjI4MTIgUTEyMy44OTA2IDEyNiAxMTYuNTc4MSAxMjAuMzA0NyBRMTA5LjI2NTYgMTE0LjYwOTQgOTcuMzEyNSAxMTQuNjA5NCBROTAgMTE0LjYwOTQgODEuNDIxOSAxMTcuMDcwMyBRNzIuODQzOCAxMTkuNTMxMiA2Mi43MTg4IDEyNC40NTMxIEw2Mi43MTg4IDEwNy4xNTYyIFE3My41NDY5IDEwMy4yMTg4IDgyLjg5ODQgMTAxLjI1IFE5Mi4yNSA5OS4yODEyIDEwMC4yNjU2IDk5LjI4MTIgUTEyMC42NTYyIDk5LjI4MTIgMTMyLjg5MDYgMTA4LjU2MjUgUTE0NS4xMjUgMTE3Ljg0MzggMTQ1LjEyNSAxMzMuMDMxMiBRMTQ1LjEyNSAxNTIuNTc4MSA5OC41NzgxIDE5Mi41MTU2IFE5MC43MDMxIDE5OS4yNjU2IDg2LjM0MzggMjAzLjA2MjUgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgM1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTIxLjc4MTIgMTU1LjUzMTIgUTEzNC43MTg4IDE1OC4wNjI1IDE0MS44MjAzIDE2NS43MjY2IFExNDguOTIxOSAxNzMuMzkwNiAxNDguOTIxOSAxODQuOTIxOSBRMTQ4LjkyMTkgMjAyLjM1OTQgMTM1LjU2MjUgMjExLjc4MTIgUTEyMi4yMDMxIDIyMS4yMDMxIDk3LjMxMjUgMjIxLjIwMzEgUTg5LjI5NjkgMjIxLjIwMzEgODAuNTA3OCAyMTkuNzI2NiBRNzEuNzE4OCAyMTguMjUgNjEuODc1IDIxNS40Mzc1IEw2MS44NzUgMTk4LjQyMTkgUTY5LjE4NzUgMjAyLjIxODggNzcuNTU0NyAyMDQuMDQ2OSBRODUuOTIxOSAyMDUuODc1IDk1LjM0MzggMjA1Ljg3NSBRMTEwLjY3MTkgMjA1Ljg3NSAxMTkuMTA5NCAyMDAuMzIwMyBRMTI3LjU0NjkgMTk0Ljc2NTYgMTI3LjU0NjkgMTg0LjkyMTkgUTEyNy41NDY5IDE3NC41MTU2IDExOS43NDIyIDE2OS4xNzE5IFExMTEuOTM3NSAxNjMuODI4MSA5Ni43NSAxNjMuODI4MSBMODQuNjU2MiAxNjMuODI4MSBMODQuNjU2MiAxNDguNjQwNiBMOTcuODc1IDE0OC42NDA2IFExMTEuMDkzOCAxNDguNjQwNiAxMTcuOTE0MSAxNDQuMjEwOSBRMTI0LjczNDQgMTM5Ljc4MTIgMTI0LjczNDQgMTMxLjM0MzggUTEyNC43MzQ0IDEyMy4xODc1IDExNy43MDMxIDExOC44OTg0IFExMTAuNjcxOSAxMTQuNjA5NCA5Ny4zMTI1IDExNC42MDk0IFE5MS42ODc1IDExNC42MDk0IDg0LjUxNTYgMTE1Ljg3NSBRNzcuMzQzOCAxMTcuMTQwNiA2NS45NTMxIDEyMC4zNzUgTDY1Ljk1MzEgMTA0LjIwMzEgUTc2LjIxODggMTAxLjgxMjUgODUuMjE4OCAxMDAuNTQ2OSBROTQuMjE4OCA5OS4yODEyIDEwMS45NTMxIDk5LjI4MTIgUTEyMi4yMDMxIDk5LjI4MTIgMTM0LjA4NTkgMTA3LjU3ODEgUTE0NS45Njg4IDExNS44NzUgMTQ1Ljk2ODggMTI5Ljc5NjkgUTE0NS45Njg4IDEzOS41IDEzOS42NDA2IDE0Ni4yNSBRMTMzLjMxMjUgMTUzIDEyMS43ODEyIDE1NS41MzEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoDRcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEyMC4wOTM4IDExOC42ODc1IEw3Ni42NDA2IDE3Ny42MDk0IEwxMjAuMDkzOCAxNzcuNjA5NCBMMTIwLjA5MzggMTE4LjY4NzUgWk0xMTcgMTAxLjY3MTkgTDE0MC4zNDM4IDEwMS42NzE5IEwxNDAuMzQzOCAxNzcuNjA5NCBMMTU5LjMyODEgMTc3LjYwOTQgTDE1OS4zMjgxIDE5Mi45Mzc1IEwxNDAuMzQzOCAxOTIuOTM3NSBMMTQwLjM0MzggMjE5LjA5MzggTDEyMC4wOTM4IDIxOS4wOTM4IEwxMjAuMDkzOCAxOTIuOTM3NSBMNjEuODc1IDE5Mi45Mzc1IEw2MS44NzUgMTc1LjkyMTkgTDExNyAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaA1XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02Ny41IDEwMS42NzE5IEwxMzkuMjE4OCAxMDEuNjcxOSBMMTM5LjIxODggMTE1LjAzMTIgTDg0LjIzNDQgMTE1LjAzMTIgTDg0LjIzNDQgMTQzLjcxODggUTg4LjE3MTkgMTQyLjQ1MzEgOTIuMjUgMTQxLjg5MDYgUTk2LjE4NzUgMTQxLjMyODEgMTAwLjEyNSAxNDEuMzI4MSBRMTIyLjc2NTYgMTQxLjMyODEgMTM1Ljk4NDQgMTUyLjE1NjIgUTE0OS4yMDMxIDE2Mi44NDM4IDE0OS4yMDMxIDE4MS4yNjU2IFExNDkuMjAzMSAyMDAuMjUgMTM1LjU2MjUgMjEwLjc5NjkgUTEyMi4wNjI1IDIyMS4yMDMxIDk3LjMxMjUgMjIxLjIwMzEgUTg4Ljg3NSAyMjEuMjAzMSA4MC4wMTU2IDIxOS45Mzc1IFE3MS4xNTYyIDIxOC42NzE5IDYxLjg3NSAyMTYuMTQwNiBMNjEuODc1IDIwMC4yNSBRNjkuODkwNiAyMDQuMDQ2OSA3OC42MDk0IDIwNi4wMTU2IFE4Ny4zMjgxIDIwNy44NDM4IDk3LjAzMTIgMjA3Ljg0MzggUTExMi42NDA2IDIwNy44NDM4IDEyMS43ODEyIDIwMC42NzE5IFExMzAuOTIxOSAxOTMuNSAxMzAuOTIxOSAxODEuMjY1NiBRMTMwLjkyMTkgMTY5LjAzMTIgMTIxLjc4MTIgMTYxLjg1OTQgUTExMi42NDA2IDE1NC42ODc1IDk3LjAzMTIgMTU0LjY4NzUgUTg5LjcxODggMTU0LjY4NzUgODIuNDA2MiAxNTYuMDkzOCBRNzUuMDkzOCAxNTcuNSA2Ny41IDE2MC40NTMxIEw2Ny41IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoDZcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTExMC4xMDk0IDE1My43MDMxIFE5Ny43MzQ0IDE1My43MDMxIDkwLjU2MjUgMTYxLjAxNTYgUTgzLjM5MDYgMTY4LjQ2ODggODMuMzkwNiAxODEuMjY1NiBRODMuMzkwNiAxOTMuOTIxOSA5MC41NjI1IDIwMS4yMzQ0IFE5Ny43MzQ0IDIwOC42ODc1IDExMC4xMDk0IDIwOC42ODc1IFExMjIuMzQzOCAyMDguNjg3NSAxMjkuNTE1NiAyMDEuMjM0NCBRMTM2LjY4NzUgMTkzLjkyMTkgMTM2LjY4NzUgMTgxLjI2NTYgUTEzNi42ODc1IDE2OC40Njg4IDEyOS41MTU2IDE2MS4wMTU2IFExMjIuMzQzOCAxNTMuNzAzMSAxMTAuMTA5NCAxNTMuNzAzMSBaTTE0Ni4zOTA2IDEwMy45MjE5IEwxNDYuMzkwNiAxMTguNDA2MiBRMTM5LjUgMTE1LjU5MzggMTMyLjQ2ODggMTE0LjE4NzUgUTEyNS40Mzc1IDExMi42NDA2IDExOC41NDY5IDExMi42NDA2IFExMDAuNTQ2OSAxMTIuNjQwNiA5MC45ODQ0IDEyMy4xODc1IFE4MS40MjE5IDEzMy44NzUgODAuMDE1NiAxNTUuMzkwNiBRODUuMzU5NCAxNDguNSA5My4zNzUgMTQ0Ljg0MzggUTEwMS41MzEyIDE0MS4xODc1IDExMS4wOTM4IDE0MS4xODc1IFExMzEuNDg0NCAxNDEuMTg3NSAxNDMuMjk2OSAxNTEuODc1IFExNTUuMTA5NCAxNjIuNzAzMSAxNTUuMTA5NCAxODEuMjY1NiBRMTU1LjEwOTQgMTk5LjEyNSAxNDIuNzM0NCAyMTAuMjM0NCBRMTMwLjUgMjIxLjIwMzEgMTEwLjEwOTQgMjIxLjIwMzEgUTg2LjYyNSAyMjEuMjAzMSA3NC4yNSAyMDUuNTkzOCBRNjEuODc1IDE4OS45ODQ0IDYxLjg3NSAxNjAuMTcxOSBRNjEuODc1IDEzMi4zMjgxIDc3LjA2MjUgMTE1Ljg3NSBROTIuMjUgOTkuMjgxMiAxMTcuODQzOCA5OS4yODEyIFExMjQuNzM0NCA5OS4yODEyIDEzMS43NjU2IDEwMC40MDYyIFExMzguNzk2OSAxMDEuNjcxOSAxNDYuMzkwNiAxMDMuOTIxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaA3XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02MS44NzUgMTAxLjY3MTkgTDE0OC42NDA2IDEwMS42NzE5IEwxNDguNjQwNiAxMDguNDIxOSBMOTkuNzAzMSAyMTkuMDkzOCBMODAuNTc4MSAyMTkuMDkzOCBMMTI2LjcwMzEgMTE1LjAzMTIgTDYxLjg3NSAxMTUuMDMxMiBMNjEuODc1IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoDhcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEwOC4yODEyIDE2My4xMjUgUTk1LjIwMzEgMTYzLjEyNSA4Ny43NSAxNjkuMzEyNSBRODAuMjk2OSAxNzUuMzU5NCA4MC4yOTY5IDE4NS45MDYyIFE4MC4yOTY5IDE5Ni41OTM4IDg3Ljc1IDIwMi42NDA2IFE5NS4yMDMxIDIwOC42ODc1IDEwOC4yODEyIDIwOC42ODc1IFExMjEuMjE4OCAyMDguNjg3NSAxMjguODEyNSAyMDIuNSBRMTM2LjI2NTYgMTk2LjQ1MzEgMTM2LjI2NTYgMTg1LjkwNjIgUTEzNi4yNjU2IDE3NS4zNTk0IDEyOC44MTI1IDE2OS4zMTI1IFExMjEuMzU5NCAxNjMuMTI1IDEwOC4yODEyIDE2My4xMjUgWk05MCAxNTYuMjM0NCBRNzguMTg3NSAxNTMuNzAzMSA3MS43MTg4IDE0Ni44MTI1IFE2NS4xMDk0IDEzOS43ODEyIDY1LjEwOTQgMTI5LjY1NjIgUTY1LjEwOTQgMTE1LjU5MzggNzYuNjQwNiAxMDcuNDM3NSBRODguMTcxOSA5OS4yODEyIDEwOC4yODEyIDk5LjI4MTIgUTEyOC4zOTA2IDk5LjI4MTIgMTM5LjkyMTkgMTA3LjQzNzUgUTE1MS4zMTI1IDExNS41OTM4IDE1MS4zMTI1IDEyOS42NTYyIFExNTEuMzEyNSAxNDAuMDYyNSAxNDQuODQzOCAxNDYuODEyNSBRMTM4LjIzNDQgMTUzLjcwMzEgMTI2LjU2MjUgMTU2LjIzNDQgUTEzOS4yMTg4IDE1OC43NjU2IDE0Ny4wOTM4IDE2Ni45MjE5IFExNTQuNTQ2OSAxNzQuNjU2MiAxNTQuNTQ2OSAxODUuOTA2MiBRMTU0LjU0NjkgMjAyLjkyMTkgMTQyLjU5MzggMjEyLjA2MjUgUTEzMC41IDIyMS4yMDMxIDEwOC4yODEyIDIyMS4yMDMxIFE4NS45MjE5IDIyMS4yMDMxIDczLjk2ODggMjEyLjA2MjUgUTYxLjg3NSAyMDIuOTIxOSA2MS44NzUgMTg1LjkwNjIgUTYxLjg3NSAxNzQuOTM3NSA2OS4zMjgxIDE2Ni45MjE5IFE3Ni45MjE5IDE1OS4wNDY5IDkwIDE1Ni4yMzQ0IFpNODMuMjUgMTMxLjIwMzEgUTgzLjI1IDE0MC4wNjI1IDg5Ljg1OTQgMTQ1LjQwNjIgUTk2LjMyODEgMTUwLjYwOTQgMTA4LjI4MTIgMTUwLjYwOTQgUTExOS42NzE5IDE1MC42MDk0IDEyNi41NjI1IDE0NS40MDYyIFExMzMuMzEyNSAxNDAuMzQzOCAxMzMuMzEyNSAxMzEuMjAzMSBRMTMzLjMxMjUgMTIyLjM0MzggMTI2LjU2MjUgMTE3IFExMTkuOTUzMSAxMTEuNzk2OSAxMDguMjgxMiAxMTEuNzk2OSBROTYuNjA5NCAxMTEuNzk2OSA4OS44NTk0IDExNyBRODMuMjUgMTIyLjA2MjUgODMuMjUgMTMxLjIwMzEgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgOVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNzAuNTkzOCAyMTYuNTYyNSBMNzAuNTkzOCAyMDIuMDc4MSBRNzcuNDg0NCAyMDQuODkwNiA4NC41MTU2IDIwNi40Mzc1IFE5MS41NDY5IDIwNy44NDM4IDk4LjI5NjkgMjA3Ljg0MzggUTExNi40Mzc1IDIwNy44NDM4IDEyNiAxOTcuMjk2OSBRMTM1LjQyMTkgMTg2Ljc1IDEzNi44MjgxIDE2NS4wOTM4IFExMzEuOTA2MiAxNzEuNzAzMSAxMjMuNDY4OCAxNzUuNSBRMTE1LjQ1MzEgMTc5LjE1NjIgMTA1Ljc1IDE3OS4xNTYyIFE4NS41IDE3OS4xNTYyIDczLjY4NzUgMTY4LjQ2ODggUTYxLjg3NSAxNTcuNzgxMiA2MS44NzUgMTM5LjIxODggUTYxLjg3NSAxMjEuMDc4MSA3NC4xMDk0IDExMC4yNSBRODYuNDg0NCA5OS4yODEyIDEwNi44NzUgOTkuMjgxMiBRMTMwLjM1OTQgOTkuMjgxMiAxNDIuNTkzOCAxMTQuODkwNiBRMTU0Ljk2ODggMTMwLjUgMTU0Ljk2ODggMTYwLjMxMjUgUTE1NC45Njg4IDE4OC4xNTYyIDEzOS45MjE5IDIwNC42MDk0IFExMjQuNzM0NCAyMjEuMjAzMSA5OS4xNDA2IDIyMS4yMDMxIFE5Mi4yNSAyMjEuMjAzMSA4NS4yMTg4IDIyMC4wNzgxIFE3OC4xODc1IDIxOC44MTI1IDcwLjU5MzggMjE2LjU2MjUgWk0xMDYuODc1IDE2Ni43ODEyIFExMTkuMjUgMTY2Ljc4MTIgMTI2LjQyMTkgMTU5LjQ2ODggUTEzMy41OTM4IDE1Mi4xNTYyIDEzMy41OTM4IDEzOS4yMTg4IFExMzMuNTkzOCAxMjYuNTYyNSAxMjYuNDIxOSAxMTkuMjUgUTExOS4yNSAxMTEuNzk2OSAxMDYuODc1IDExMS43OTY5IFE5NC45MjE5IDExMS43OTY5IDg3LjQ2ODggMTE5LjI1IFE4MC4xNTYyIDEyNi41NjI1IDgwLjE1NjIgMTM5LjIxODggUTgwLjE1NjIgMTUyLjE1NjIgODcuNDY4OCAxNTkuNDY4OCBROTQuNjQwNiAxNjYuNzgxMiAxMDYuODc1IDE2Ni43ODEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoDEwXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xNTkuMDQ2OSAxMTEuNzk2OSBRMTQ5LjA2MjUgMTExLjc5NjkgMTQyLjAzMTIgMTIzLjg5MDYgUTEzNC44NTk0IDEzNS45ODQ0IDEzNC44NTk0IDE2MC4xNzE5IFExMzQuODU5NCAxODQuNSAxNDIuMDMxMiAxOTYuNTkzOCBRMTQ5LjA2MjUgMjA4LjY4NzUgMTU5LjA0NjkgMjA4LjY4NzUgUTE2OS4wMzEyIDIwOC42ODc1IDE3Ni4wNjI1IDE5Ni41OTM4IFExODMuMjM0NCAxODQuNSAxODMuMjM0NCAxNjAuMTcxOSBRMTgzLjIzNDQgMTM1Ljk4NDQgMTc2LjA2MjUgMTIzLjg5MDYgUTE2OS4wMzEyIDExMS43OTY5IDE1OS4wNDY5IDExMS43OTY5IFpNMTU5LjA0NjkgOTkuMjgxMiBRMTc3LjQ2ODggOTkuMjgxMiAxODkuNDIxOSAxMTQuODkwNiBRMjAxLjM3NSAxMzAuNSAyMDEuMzc1IDE2MC4xNzE5IFEyMDEuMzc1IDE4OS45ODQ0IDE4OS40MjE5IDIwNS41OTM4IFExNzcuNDY4OCAyMjEuMjAzMSAxNTkuMDQ2OSAyMjEuMjAzMSBRMTM2LjI2NTYgMjIxLjIwMzEgMTI2LjQyMTkgMjA1LjU5MzggUTExNi41NzgxIDE4OS45ODQ0IDExNi41NzgxIDE2MC4xNzE5IFExMTYuNTc4MSAxMzAuNSAxMjYuNDIxOSAxMTQuODkwNiBRMTM2LjI2NTYgOTkuMjgxMiAxNTkuMDQ2OSA5OS4yODEyIFpNODAuNTc4MSAyMTkuMDkzOCBMODAuNTc4MSAxMTcuNzAzMSBMNjEuODc1IDEyMy40Njg4IEw2MS44NzUgMTA3LjE1NjIgTDgxLjU2MjUgMTAxLjY3MTkgTDEwMC44MjgxIDEwMS42NzE5IEwxMDAuODI4MSAyMTkuMDkzOCBMODAuNTc4MSAyMTkuMDkzOCBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaBKXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk04OS4xNTYyIDEwMS42NzE5IEwxMDcuMDE1NiAxMDEuNjcxOSBMMTA3LjAxNTYgMTc4LjczNDQgUTEwNy4wMTU2IDE5OS42ODc1IDk3Ljg3NSAyMDkuNTMxMiBRODguODc1IDIxOS4yMzQ0IDY4Ljc2NTYgMjE5LjIzNDQgTDYxLjg3NSAyMTkuMjM0NCBMNjEuODc1IDIwNS43MzQ0IEw2Ny41IDIwNS43MzQ0IFE3OS4zMTI1IDIwNS43MzQ0IDg0LjIzNDQgMTk5LjgyODEgUTg5LjE1NjIgMTkzLjkyMTkgODkuMTU2MiAxNzguNzM0NCBMODkuMTU2MiAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaBRXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xMDcuMjk2OSAyMjEuMDYyNSBRMTA2LjczNDQgMjIxLjA2MjUgMTA1LjUzOTEgMjIxLjEzMjggUTEwNC4zNDM4IDIyMS4yMDMxIDEwMy42NDA2IDIyMS4yMDMxIFE4MS40MjE5IDIyMS4yMDMxIDcwLjUyMzQgMjA2LjA4NTkgUTU5LjYyNSAxOTAuOTY4OCA1OS42MjUgMTYwLjMxMjUgUTU5LjYyNSAxMjkuNTE1NiA3MC41OTM4IDExNC4zOTg0IFE4MS41NjI1IDk5LjI4MTIgMTAzLjc4MTIgOTkuMjgxMiBRMTI2LjE0MDYgOTkuMjgxMiAxMzcuMTA5NCAxMTQuMzk4NCBRMTQ4LjA3ODEgMTI5LjUxNTYgMTQ4LjA3ODEgMTYwLjMxMjUgUTE0OC4wNzgxIDE4My41MTU2IDE0Mi4wMzEyIDE5Ny42NDg0IFExMzUuOTg0NCAyMTEuNzgxMiAxMjMuNjA5NCAyMTcuNDA2MiBMMTQxLjMyODEgMjMyLjMxMjUgTDEyNy45Njg4IDI0MC4xODc1IEwxMDcuMjk2OSAyMjEuMDYyNSBaTTEyOS4zNzUgMTYwLjMxMjUgUTEyOS4zNzUgMTM0LjQzNzUgMTIzLjM5ODQgMTIzLjMyODEgUTExNy40MjE5IDExMi4yMTg4IDEwMy43ODEyIDExMi4yMTg4IFE5MC4yODEyIDExMi4yMTg4IDg0LjMwNDcgMTIzLjMyODEgUTc4LjMyODEgMTM0LjQzNzUgNzguMzI4MSAxNjAuMzEyNSBRNzguMzI4MSAxODYuMTg3NSA4NC4zMDQ3IDE5Ny4yOTY5IFE5MC4yODEyIDIwOC40MDYyIDEwMy43ODEyIDIwOC40MDYyIFExMTcuNDIxOSAyMDguNDA2MiAxMjMuMzk4NCAxOTcuMjk2OSBRMTI5LjM3NSAxODYuMTg3NSAxMjkuMzc1IDE2MC4zMTI1IFpNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoEtcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTYxLjg3NSAxMDEuNjcxOSBMNzkuNzM0NCAxMDEuNjcxOSBMNzkuNzM0NCAxNTEuMzEyNSBMMTMwLjY0MDYgMTAxLjY3MTkgTDE1My43MDMxIDEwMS42NzE5IEw5Ni40Njg4IDE1Ni41MTU2IEwxNTguMzQzOCAyMTkuMjM0NCBMMTM0Ljg1OTQgMjE5LjIzNDQgTDc5LjczNDQgMTYyLjU2MjUgTDc5LjczNDQgMjE5LjIzNDQgTDYxLjg3NSAyMTkuMjM0NCBMNjEuODc1IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpUFcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTExMC42NzE5IDExNS43MzQ0IEw5MS44MjgxIDE3NS43ODEyIEwxMjkuNTE1NiAxNzUuNzgxMiBMMTEwLjY3MTkgMTE1LjczNDQgWk05OS45ODQ0IDEwMS42NzE5IEwxMjEuNjQwNiAxMDEuNjcxOSBMMTYyLjE0MDYgMjE5LjIzNDQgTDE0My41NzgxIDIxOS4yMzQ0IEwxMzQuMDE1NiAxODguNTc4MSBMODcuNjA5NCAxODguNTc4MSBMNzguMDQ2OSAyMTkuMjM0NCBMNTkuNDg0NCAyMTkuMjM0NCBMOTkuOTg0NCAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaUyXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODYuMzQzOCAyMDMuMDYyNSBMMTQ1Ljk2ODggMjAzLjA2MjUgTDE0NS45Njg4IDIxOS4wOTM4IEw2MS44NzUgMjE5LjA5MzggTDYxLjg3NSAyMDMuNjI1IFE2Ni42NTYyIDE5OS4yNjU2IDc1LjUxNTYgMTkxLjM5MDYgUTEyMy44OTA2IDE0OC41IDEyMy44OTA2IDEzNS4yODEyIFExMjMuODkwNiAxMjYgMTE2LjU3ODEgMTIwLjMwNDcgUTEwOS4yNjU2IDExNC42MDk0IDk3LjMxMjUgMTE0LjYwOTQgUTkwIDExNC42MDk0IDgxLjQyMTkgMTE3LjA3MDMgUTcyLjg0MzggMTE5LjUzMTIgNjIuNzE4OCAxMjQuNDUzMSBMNjIuNzE4OCAxMDcuMTU2MiBRNzMuNTQ2OSAxMDMuMjE4OCA4Mi44OTg0IDEwMS4yNSBROTIuMjUgOTkuMjgxMiAxMDAuMjY1NiA5OS4yODEyIFExMjAuNjU2MiA5OS4yODEyIDEzMi44OTA2IDEwOC41NjI1IFExNDUuMTI1IDExNy44NDM4IDE0NS4xMjUgMTMzLjAzMTIgUTE0NS4xMjUgMTUyLjU3ODEgOTguNTc4MSAxOTIuNTE1NiBROTAuNzAzMSAxOTkuMjY1NiA4Ni4zNDM4IDIwMy4wNjI1IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpTNcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi42ODc1IDI3My42NTYyIFExNzUuNzgxMiAyNTcuMDYyNSAxODMuNTE1NiAyNDguMzQzOCBRMTkyLjIzNDQgMjM4LjM1OTQgMjA0LjA0NjkgMjM4LjM1OTQgUTIyMy41OTM4IDIzOC4zNTk0IDIzMi4zMTI1IDI1OS4zMTI1IFEyMzQuOTg0NCAyNjUuNjQwNiAyMzQuOTg0NCAyNzMuOTM3NSBRMjM0Ljk4NDQgMjk2LjE1NjIgMjE3LjQwNjIgMzE4LjUxNTYgTDE3Mi45Njg4IDM3NS4wNDY5IEwxMjcuOTY4OCAzMTguNTE1NiBRMTEwLjM5MDYgMjk2LjQzNzUgMTEwLjM5MDYgMjczLjkzNzUgUTExMC4zOTA2IDI2NS42NDA2IDExMy4wNjI1IDI1OS4zMTI1IFExMjEuOTIxOSAyMzguMzU5NCAxNDEuMzI4MSAyMzguMzU5NCBRMTUzLjQyMTkgMjM4LjM1OTQgMTYxLjg1OTQgMjQ4LjM0MzggUTE2OS41OTM4IDI1Ny40ODQ0IDE3Mi42ODc1IDI3My42NTYyIFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMjEuNzgxMiAxNTUuNTMxMiBRMTM0LjcxODggMTU4LjA2MjUgMTQxLjgyMDMgMTY1LjcyNjYgUTE0OC45MjE5IDE3My4zOTA2IDE0OC45MjE5IDE4NC45MjE5IFExNDguOTIxOSAyMDIuMzU5NCAxMzUuNTYyNSAyMTEuNzgxMiBRMTIyLjIwMzEgMjIxLjIwMzEgOTcuMzEyNSAyMjEuMjAzMSBRODkuMjk2OSAyMjEuMjAzMSA4MC41MDc4IDIxOS43MjY2IFE3MS43MTg4IDIxOC4yNSA2MS44NzUgMjE1LjQzNzUgTDYxLjg3NSAxOTguNDIxOSBRNjkuMTg3NSAyMDIuMjE4OCA3Ny41NTQ3IDIwNC4wNDY5IFE4NS45MjE5IDIwNS44NzUgOTUuMzQzOCAyMDUuODc1IFExMTAuNjcxOSAyMDUuODc1IDExOS4xMDk0IDIwMC4zMjAzIFExMjcuNTQ2OSAxOTQuNzY1NiAxMjcuNTQ2OSAxODQuOTIxOSBRMTI3LjU0NjkgMTc0LjUxNTYgMTE5Ljc0MjIgMTY5LjE3MTkgUTExMS45Mzc1IDE2My44MjgxIDk2Ljc1IDE2My44MjgxIEw4NC42NTYyIDE2My44MjgxIEw4NC42NTYyIDE0OC42NDA2IEw5Ny44NzUgMTQ4LjY0MDYgUTExMS4wOTM4IDE0OC42NDA2IDExNy45MTQxIDE0NC4yMTA5IFExMjQuNzM0NCAxMzkuNzgxMiAxMjQuNzM0NCAxMzEuMzQzOCBRMTI0LjczNDQgMTIzLjE4NzUgMTE3LjcwMzEgMTE4Ljg5ODQgUTExMC42NzE5IDExNC42MDk0IDk3LjMxMjUgMTE0LjYwOTQgUTkxLjY4NzUgMTE0LjYwOTQgODQuNTE1NiAxMTUuODc1IFE3Ny4zNDM4IDExNy4xNDA2IDY1Ljk1MzEgMTIwLjM3NSBMNjUuOTUzMSAxMDQuMjAzMSBRNzYuMjE4OCAxMDEuODEyNSA4NS4yMTg4IDEwMC41NDY5IFE5NC4yMTg4IDk5LjI4MTIgMTAxLjk1MzEgOTkuMjgxMiBRMTIyLjIwMzEgOTkuMjgxMiAxMzQuMDg1OSAxMDcuNTc4MSBRMTQ1Ljk2ODggMTE1Ljg3NSAxNDUuOTY4OCAxMjkuNzk2OSBRMTQ1Ljk2ODggMTM5LjUgMTM5LjY0MDYgMTQ2LjI1IFExMzMuMzEyNSAxNTMgMTIxLjc4MTIgMTU1LjUzMTIgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlNFxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEyMC4wOTM4IDExOC42ODc1IEw3Ni42NDA2IDE3Ny42MDk0IEwxMjAuMDkzOCAxNzcuNjA5NCBMMTIwLjA5MzggMTE4LjY4NzUgWk0xMTcgMTAxLjY3MTkgTDE0MC4zNDM4IDEwMS42NzE5IEwxNDAuMzQzOCAxNzcuNjA5NCBMMTU5LjMyODEgMTc3LjYwOTQgTDE1OS4zMjgxIDE5Mi45Mzc1IEwxNDAuMzQzOCAxOTIuOTM3NSBMMTQwLjM0MzggMjE5LjA5MzggTDEyMC4wOTM4IDIxOS4wOTM4IEwxMjAuMDkzOCAxOTIuOTM3NSBMNjEuODc1IDE5Mi45Mzc1IEw2MS44NzUgMTc1LjkyMTkgTDExNyAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaU1XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjcuNSAxMDEuNjcxOSBMMTM5LjIxODggMTAxLjY3MTkgTDEzOS4yMTg4IDExNS4wMzEyIEw4NC4yMzQ0IDExNS4wMzEyIEw4NC4yMzQ0IDE0My43MTg4IFE4OC4xNzE5IDE0Mi40NTMxIDkyLjI1IDE0MS44OTA2IFE5Ni4xODc1IDE0MS4zMjgxIDEwMC4xMjUgMTQxLjMyODEgUTEyMi43NjU2IDE0MS4zMjgxIDEzNS45ODQ0IDE1Mi4xNTYyIFExNDkuMjAzMSAxNjIuODQzOCAxNDkuMjAzMSAxODEuMjY1NiBRMTQ5LjIwMzEgMjAwLjI1IDEzNS41NjI1IDIxMC43OTY5IFExMjIuMDYyNSAyMjEuMjAzMSA5Ny4zMTI1IDIyMS4yMDMxIFE4OC44NzUgMjIxLjIwMzEgODAuMDE1NiAyMTkuOTM3NSBRNzEuMTU2MiAyMTguNjcxOSA2MS44NzUgMjE2LjE0MDYgTDYxLjg3NSAyMDAuMjUgUTY5Ljg5MDYgMjA0LjA0NjkgNzguNjA5NCAyMDYuMDE1NiBRODcuMzI4MSAyMDcuODQzOCA5Ny4wMzEyIDIwNy44NDM4IFExMTIuNjQwNiAyMDcuODQzOCAxMjEuNzgxMiAyMDAuNjcxOSBRMTMwLjkyMTkgMTkzLjUgMTMwLjkyMTkgMTgxLjI2NTYgUTEzMC45MjE5IDE2OS4wMzEyIDEyMS43ODEyIDE2MS44NTk0IFExMTIuNjQwNiAxNTQuNjg3NSA5Ny4wMzEyIDE1NC42ODc1IFE4OS43MTg4IDE1NC42ODc1IDgyLjQwNjIgMTU2LjA5MzggUTc1LjA5MzggMTU3LjUgNjcuNSAxNjAuNDUzMSBMNjcuNSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaU2XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTEwLjEwOTQgMTUzLjcwMzEgUTk3LjczNDQgMTUzLjcwMzEgOTAuNTYyNSAxNjEuMDE1NiBRODMuMzkwNiAxNjguNDY4OCA4My4zOTA2IDE4MS4yNjU2IFE4My4zOTA2IDE5My45MjE5IDkwLjU2MjUgMjAxLjIzNDQgUTk3LjczNDQgMjA4LjY4NzUgMTEwLjEwOTQgMjA4LjY4NzUgUTEyMi4zNDM4IDIwOC42ODc1IDEyOS41MTU2IDIwMS4yMzQ0IFExMzYuNjg3NSAxOTMuOTIxOSAxMzYuNjg3NSAxODEuMjY1NiBRMTM2LjY4NzUgMTY4LjQ2ODggMTI5LjUxNTYgMTYxLjAxNTYgUTEyMi4zNDM4IDE1My43MDMxIDExMC4xMDk0IDE1My43MDMxIFpNMTQ2LjM5MDYgMTAzLjkyMTkgTDE0Ni4zOTA2IDExOC40MDYyIFExMzkuNSAxMTUuNTkzOCAxMzIuNDY4OCAxMTQuMTg3NSBRMTI1LjQzNzUgMTEyLjY0MDYgMTE4LjU0NjkgMTEyLjY0MDYgUTEwMC41NDY5IDExMi42NDA2IDkwLjk4NDQgMTIzLjE4NzUgUTgxLjQyMTkgMTMzLjg3NSA4MC4wMTU2IDE1NS4zOTA2IFE4NS4zNTk0IDE0OC41IDkzLjM3NSAxNDQuODQzOCBRMTAxLjUzMTIgMTQxLjE4NzUgMTExLjA5MzggMTQxLjE4NzUgUTEzMS40ODQ0IDE0MS4xODc1IDE0My4yOTY5IDE1MS44NzUgUTE1NS4xMDk0IDE2Mi43MDMxIDE1NS4xMDk0IDE4MS4yNjU2IFExNTUuMTA5NCAxOTkuMTI1IDE0Mi43MzQ0IDIxMC4yMzQ0IFExMzAuNSAyMjEuMjAzMSAxMTAuMTA5NCAyMjEuMjAzMSBRODYuNjI1IDIyMS4yMDMxIDc0LjI1IDIwNS41OTM4IFE2MS44NzUgMTg5Ljk4NDQgNjEuODc1IDE2MC4xNzE5IFE2MS44NzUgMTMyLjMyODEgNzcuMDYyNSAxMTUuODc1IFE5Mi4yNSA5OS4yODEyIDExNy44NDM4IDk5LjI4MTIgUTEyNC43MzQ0IDk5LjI4MTIgMTMxLjc2NTYgMTAwLjQwNjIgUTEzOC43OTY5IDEwMS42NzE5IDE0Ni4zOTA2IDEwMy45MjE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpTdcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi42ODc1IDI3My42NTYyIFExNzUuNzgxMiAyNTcuMDYyNSAxODMuNTE1NiAyNDguMzQzOCBRMTkyLjIzNDQgMjM4LjM1OTQgMjA0LjA0NjkgMjM4LjM1OTQgUTIyMy41OTM4IDIzOC4zNTk0IDIzMi4zMTI1IDI1OS4zMTI1IFEyMzQuOTg0NCAyNjUuNjQwNiAyMzQuOTg0NCAyNzMuOTM3NSBRMjM0Ljk4NDQgMjk2LjE1NjIgMjE3LjQwNjIgMzE4LjUxNTYgTDE3Mi45Njg4IDM3NS4wNDY5IEwxMjcuOTY4OCAzMTguNTE1NiBRMTEwLjM5MDYgMjk2LjQzNzUgMTEwLjM5MDYgMjczLjkzNzUgUTExMC4zOTA2IDI2NS42NDA2IDExMy4wNjI1IDI1OS4zMTI1IFExMjEuOTIxOSAyMzguMzU5NCAxNDEuMzI4MSAyMzguMzU5NCBRMTUzLjQyMTkgMjM4LjM1OTQgMTYxLjg1OTQgMjQ4LjM0MzggUTE2OS41OTM4IDI1Ny40ODQ0IDE3Mi42ODc1IDI3My42NTYyIFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02MS44NzUgMTAxLjY3MTkgTDE0OC42NDA2IDEwMS42NzE5IEwxNDguNjQwNiAxMDguNDIxOSBMOTkuNzAzMSAyMTkuMDkzOCBMODAuNTc4MSAyMTkuMDkzOCBMMTI2LjcwMzEgMTE1LjAzMTIgTDYxLjg3NSAxMTUuMDMxMiBMNjEuODc1IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpThcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi42ODc1IDI3My42NTYyIFExNzUuNzgxMiAyNTcuMDYyNSAxODMuNTE1NiAyNDguMzQzOCBRMTkyLjIzNDQgMjM4LjM1OTQgMjA0LjA0NjkgMjM4LjM1OTQgUTIyMy41OTM4IDIzOC4zNTk0IDIzMi4zMTI1IDI1OS4zMTI1IFEyMzQuOTg0NCAyNjUuNjQwNiAyMzQuOTg0NCAyNzMuOTM3NSBRMjM0Ljk4NDQgMjk2LjE1NjIgMjE3LjQwNjIgMzE4LjUxNTYgTDE3Mi45Njg4IDM3NS4wNDY5IEwxMjcuOTY4OCAzMTguNTE1NiBRMTEwLjM5MDYgMjk2LjQzNzUgMTEwLjM5MDYgMjczLjkzNzUgUTExMC4zOTA2IDI2NS42NDA2IDExMy4wNjI1IDI1OS4zMTI1IFExMjEuOTIxOSAyMzguMzU5NCAxNDEuMzI4MSAyMzguMzU5NCBRMTUzLjQyMTkgMjM4LjM1OTQgMTYxLjg1OTQgMjQ4LjM0MzggUTE2OS41OTM4IDI1Ny40ODQ0IDE3Mi42ODc1IDI3My42NTYyIFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMDguMjgxMiAxNjMuMTI1IFE5NS4yMDMxIDE2My4xMjUgODcuNzUgMTY5LjMxMjUgUTgwLjI5NjkgMTc1LjM1OTQgODAuMjk2OSAxODUuOTA2MiBRODAuMjk2OSAxOTYuNTkzOCA4Ny43NSAyMDIuNjQwNiBROTUuMjAzMSAyMDguNjg3NSAxMDguMjgxMiAyMDguNjg3NSBRMTIxLjIxODggMjA4LjY4NzUgMTI4LjgxMjUgMjAyLjUgUTEzNi4yNjU2IDE5Ni40NTMxIDEzNi4yNjU2IDE4NS45MDYyIFExMzYuMjY1NiAxNzUuMzU5NCAxMjguODEyNSAxNjkuMzEyNSBRMTIxLjM1OTQgMTYzLjEyNSAxMDguMjgxMiAxNjMuMTI1IFpNOTAgMTU2LjIzNDQgUTc4LjE4NzUgMTUzLjcwMzEgNzEuNzE4OCAxNDYuODEyNSBRNjUuMTA5NCAxMzkuNzgxMiA2NS4xMDk0IDEyOS42NTYyIFE2NS4xMDk0IDExNS41OTM4IDc2LjY0MDYgMTA3LjQzNzUgUTg4LjE3MTkgOTkuMjgxMiAxMDguMjgxMiA5OS4yODEyIFExMjguMzkwNiA5OS4yODEyIDEzOS45MjE5IDEwNy40Mzc1IFExNTEuMzEyNSAxMTUuNTkzOCAxNTEuMzEyNSAxMjkuNjU2MiBRMTUxLjMxMjUgMTQwLjA2MjUgMTQ0Ljg0MzggMTQ2LjgxMjUgUTEzOC4yMzQ0IDE1My43MDMxIDEyNi41NjI1IDE1Ni4yMzQ0IFExMzkuMjE4OCAxNTguNzY1NiAxNDcuMDkzOCAxNjYuOTIxOSBRMTU0LjU0NjkgMTc0LjY1NjIgMTU0LjU0NjkgMTg1LjkwNjIgUTE1NC41NDY5IDIwMi45MjE5IDE0Mi41OTM4IDIxMi4wNjI1IFExMzAuNSAyMjEuMjAzMSAxMDguMjgxMiAyMjEuMjAzMSBRODUuOTIxOSAyMjEuMjAzMSA3My45Njg4IDIxMi4wNjI1IFE2MS44NzUgMjAyLjkyMTkgNjEuODc1IDE4NS45MDYyIFE2MS44NzUgMTc0LjkzNzUgNjkuMzI4MSAxNjYuOTIxOSBRNzYuOTIxOSAxNTkuMDQ2OSA5MCAxNTYuMjM0NCBaTTgzLjI1IDEzMS4yMDMxIFE4My4yNSAxNDAuMDYyNSA4OS44NTk0IDE0NS40MDYyIFE5Ni4zMjgxIDE1MC42MDk0IDEwOC4yODEyIDE1MC42MDk0IFExMTkuNjcxOSAxNTAuNjA5NCAxMjYuNTYyNSAxNDUuNDA2MiBRMTMzLjMxMjUgMTQwLjM0MzggMTMzLjMxMjUgMTMxLjIwMzEgUTEzMy4zMTI1IDEyMi4zNDM4IDEyNi41NjI1IDExNyBRMTE5Ljk1MzEgMTExLjc5NjkgMTA4LjI4MTIgMTExLjc5NjkgUTk2LjYwOTQgMTExLjc5NjkgODkuODU5NCAxMTcgUTgzLjI1IDEyMi4wNjI1IDgzLjI1IDEzMS4yMDMxIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpTlcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi42ODc1IDI3My42NTYyIFExNzUuNzgxMiAyNTcuMDYyNSAxODMuNTE1NiAyNDguMzQzOCBRMTkyLjIzNDQgMjM4LjM1OTQgMjA0LjA0NjkgMjM4LjM1OTQgUTIyMy41OTM4IDIzOC4zNTk0IDIzMi4zMTI1IDI1OS4zMTI1IFEyMzQuOTg0NCAyNjUuNjQwNiAyMzQuOTg0NCAyNzMuOTM3NSBRMjM0Ljk4NDQgMjk2LjE1NjIgMjE3LjQwNjIgMzE4LjUxNTYgTDE3Mi45Njg4IDM3NS4wNDY5IEwxMjcuOTY4OCAzMTguNTE1NiBRMTEwLjM5MDYgMjk2LjQzNzUgMTEwLjM5MDYgMjczLjkzNzUgUTExMC4zOTA2IDI2NS42NDA2IDExMy4wNjI1IDI1OS4zMTI1IFExMjEuOTIxOSAyMzguMzU5NCAxNDEuMzI4MSAyMzguMzU5NCBRMTUzLjQyMTkgMjM4LjM1OTQgMTYxLjg1OTQgMjQ4LjM0MzggUTE2OS41OTM4IDI1Ny40ODQ0IDE3Mi42ODc1IDI3My42NTYyIFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk03MC41OTM4IDIxNi41NjI1IEw3MC41OTM4IDIwMi4wNzgxIFE3Ny40ODQ0IDIwNC44OTA2IDg0LjUxNTYgMjA2LjQzNzUgUTkxLjU0NjkgMjA3Ljg0MzggOTguMjk2OSAyMDcuODQzOCBRMTE2LjQzNzUgMjA3Ljg0MzggMTI2IDE5Ny4yOTY5IFExMzUuNDIxOSAxODYuNzUgMTM2LjgyODEgMTY1LjA5MzggUTEzMS45MDYyIDE3MS43MDMxIDEyMy40Njg4IDE3NS41IFExMTUuNDUzMSAxNzkuMTU2MiAxMDUuNzUgMTc5LjE1NjIgUTg1LjUgMTc5LjE1NjIgNzMuNjg3NSAxNjguNDY4OCBRNjEuODc1IDE1Ny43ODEyIDYxLjg3NSAxMzkuMjE4OCBRNjEuODc1IDEyMS4wNzgxIDc0LjEwOTQgMTEwLjI1IFE4Ni40ODQ0IDk5LjI4MTIgMTA2Ljg3NSA5OS4yODEyIFExMzAuMzU5NCA5OS4yODEyIDE0Mi41OTM4IDExNC44OTA2IFExNTQuOTY4OCAxMzAuNSAxNTQuOTY4OCAxNjAuMzEyNSBRMTU0Ljk2ODggMTg4LjE1NjIgMTM5LjkyMTkgMjA0LjYwOTQgUTEyNC43MzQ0IDIyMS4yMDMxIDk5LjE0MDYgMjIxLjIwMzEgUTkyLjI1IDIyMS4yMDMxIDg1LjIxODggMjIwLjA3ODEgUTc4LjE4NzUgMjE4LjgxMjUgNzAuNTkzOCAyMTYuNTYyNSBaTTEwNi44NzUgMTY2Ljc4MTIgUTExOS4yNSAxNjYuNzgxMiAxMjYuNDIxOSAxNTkuNDY4OCBRMTMzLjU5MzggMTUyLjE1NjIgMTMzLjU5MzggMTM5LjIxODggUTEzMy41OTM4IDEyNi41NjI1IDEyNi40MjE5IDExOS4yNSBRMTE5LjI1IDExMS43OTY5IDEwNi44NzUgMTExLjc5NjkgUTk0LjkyMTkgMTExLjc5NjkgODcuNDY4OCAxMTkuMjUgUTgwLjE1NjIgMTI2LjU2MjUgODAuMTU2MiAxMzkuMjE4OCBRODAuMTU2MiAxNTIuMTU2MiA4Ny40Njg4IDE1OS40Njg4IFE5NC42NDA2IDE2Ni43ODEyIDEwNi44NzUgMTY2Ljc4MTIgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlMTBcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi42ODc1IDI3My42NTYyIFExNzUuNzgxMiAyNTcuMDYyNSAxODMuNTE1NiAyNDguMzQzOCBRMTkyLjIzNDQgMjM4LjM1OTQgMjA0LjA0NjkgMjM4LjM1OTQgUTIyMy41OTM4IDIzOC4zNTk0IDIzMi4zMTI1IDI1OS4zMTI1IFEyMzQuOTg0NCAyNjUuNjQwNiAyMzQuOTg0NCAyNzMuOTM3NSBRMjM0Ljk4NDQgMjk2LjE1NjIgMjE3LjQwNjIgMzE4LjUxNTYgTDE3Mi45Njg4IDM3NS4wNDY5IEwxMjcuOTY4OCAzMTguNTE1NiBRMTEwLjM5MDYgMjk2LjQzNzUgMTEwLjM5MDYgMjczLjkzNzUgUTExMC4zOTA2IDI2NS42NDA2IDExMy4wNjI1IDI1OS4zMTI1IFExMjEuOTIxOSAyMzguMzU5NCAxNDEuMzI4MSAyMzguMzU5NCBRMTUzLjQyMTkgMjM4LjM1OTQgMTYxLjg1OTQgMjQ4LjM0MzggUTE2OS41OTM4IDI1Ny40ODQ0IDE3Mi42ODc1IDI3My42NTYyIFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xNTkuMDQ2OSAxMTEuNzk2OSBRMTQ5LjA2MjUgMTExLjc5NjkgMTQyLjAzMTIgMTIzLjg5MDYgUTEzNC44NTk0IDEzNS45ODQ0IDEzNC44NTk0IDE2MC4xNzE5IFExMzQuODU5NCAxODQuNSAxNDIuMDMxMiAxOTYuNTkzOCBRMTQ5LjA2MjUgMjA4LjY4NzUgMTU5LjA0NjkgMjA4LjY4NzUgUTE2OS4wMzEyIDIwOC42ODc1IDE3Ni4wNjI1IDE5Ni41OTM4IFExODMuMjM0NCAxODQuNSAxODMuMjM0NCAxNjAuMTcxOSBRMTgzLjIzNDQgMTM1Ljk4NDQgMTc2LjA2MjUgMTIzLjg5MDYgUTE2OS4wMzEyIDExMS43OTY5IDE1OS4wNDY5IDExMS43OTY5IFpNMTU5LjA0NjkgOTkuMjgxMiBRMTc3LjQ2ODggOTkuMjgxMiAxODkuNDIxOSAxMTQuODkwNiBRMjAxLjM3NSAxMzAuNSAyMDEuMzc1IDE2MC4xNzE5IFEyMDEuMzc1IDE4OS45ODQ0IDE4OS40MjE5IDIwNS41OTM4IFExNzcuNDY4OCAyMjEuMjAzMSAxNTkuMDQ2OSAyMjEuMjAzMSBRMTM2LjI2NTYgMjIxLjIwMzEgMTI2LjQyMTkgMjA1LjU5MzggUTExNi41NzgxIDE4OS45ODQ0IDExNi41NzgxIDE2MC4xNzE5IFExMTYuNTc4MSAxMzAuNSAxMjYuNDIxOSAxMTQuODkwNiBRMTM2LjI2NTYgOTkuMjgxMiAxNTkuMDQ2OSA5OS4yODEyIFpNODAuNTc4MSAyMTkuMDkzOCBMODAuNTc4MSAxMTcuNzAzMSBMNjEuODc1IDEyMy40Njg4IEw2MS44NzUgMTA3LjE1NjIgTDgxLjU2MjUgMTAxLjY3MTkgTDEwMC44MjgxIDEwMS42NzE5IEwxMDAuODI4MSAyMTkuMDkzOCBMODAuNTc4MSAyMTkuMDkzOCBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaVKXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODkuMTU2MiAxMDEuNjcxOSBMMTA3LjAxNTYgMTAxLjY3MTkgTDEwNy4wMTU2IDE3OC43MzQ0IFExMDcuMDE1NiAxOTkuNjg3NSA5Ny44NzUgMjA5LjUzMTIgUTg4Ljg3NSAyMTkuMjM0NCA2OC43NjU2IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAyMDUuNzM0NCBMNjcuNSAyMDUuNzM0NCBRNzkuMzEyNSAyMDUuNzM0NCA4NC4yMzQ0IDE5OS44MjgxIFE4OS4xNTYyIDE5My45MjE5IDg5LjE1NjIgMTc4LjczNDQgTDg5LjE1NjIgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlUVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTA3LjI5NjkgMjIxLjA2MjUgUTEwNi43MzQ0IDIyMS4wNjI1IDEwNS41MzkxIDIyMS4xMzI4IFExMDQuMzQzOCAyMjEuMjAzMSAxMDMuNjQwNiAyMjEuMjAzMSBRODEuNDIxOSAyMjEuMjAzMSA3MC41MjM0IDIwNi4wODU5IFE1OS42MjUgMTkwLjk2ODggNTkuNjI1IDE2MC4zMTI1IFE1OS42MjUgMTI5LjUxNTYgNzAuNTkzOCAxMTQuMzk4NCBRODEuNTYyNSA5OS4yODEyIDEwMy43ODEyIDk5LjI4MTIgUTEyNi4xNDA2IDk5LjI4MTIgMTM3LjEwOTQgMTE0LjM5ODQgUTE0OC4wNzgxIDEyOS41MTU2IDE0OC4wNzgxIDE2MC4zMTI1IFExNDguMDc4MSAxODMuNTE1NiAxNDIuMDMxMiAxOTcuNjQ4NCBRMTM1Ljk4NDQgMjExLjc4MTIgMTIzLjYwOTQgMjE3LjQwNjIgTDE0MS4zMjgxIDIzMi4zMTI1IEwxMjcuOTY4OCAyNDAuMTg3NSBMMTA3LjI5NjkgMjIxLjA2MjUgWk0xMjkuMzc1IDE2MC4zMTI1IFExMjkuMzc1IDEzNC40Mzc1IDEyMy4zOTg0IDEyMy4zMjgxIFExMTcuNDIxOSAxMTIuMjE4OCAxMDMuNzgxMiAxMTIuMjE4OCBROTAuMjgxMiAxMTIuMjE4OCA4NC4zMDQ3IDEyMy4zMjgxIFE3OC4zMjgxIDEzNC40Mzc1IDc4LjMyODEgMTYwLjMxMjUgUTc4LjMyODEgMTg2LjE4NzUgODQuMzA0NyAxOTcuMjk2OSBROTAuMjgxMiAyMDguNDA2MiAxMDMuNzgxMiAyMDguNDA2MiBRMTE3LjQyMTkgMjA4LjQwNjIgMTIzLjM5ODQgMTk3LjI5NjkgUTEyOS4zNzUgMTg2LjE4NzUgMTI5LjM3NSAxNjAuMzEyNSBaTTE3Mi42ODc1IDI3My42NTYyIFExNzUuNzgxMiAyNTcuMDYyNSAxODMuNTE1NiAyNDguMzQzOCBRMTkyLjIzNDQgMjM4LjM1OTQgMjA0LjA0NjkgMjM4LjM1OTQgUTIyMy41OTM4IDIzOC4zNTk0IDIzMi4zMTI1IDI1OS4zMTI1IFEyMzQuOTg0NCAyNjUuNjQwNiAyMzQuOTg0NCAyNzMuOTM3NSBRMjM0Ljk4NDQgMjk2LjE1NjIgMjE3LjQwNjIgMzE4LjUxNTYgTDE3Mi45Njg4IDM3NS4wNDY5IEwxMjcuOTY4OCAzMTguNTE1NiBRMTEwLjM5MDYgMjk2LjQzNzUgMTEwLjM5MDYgMjczLjkzNzUgUTExMC4zOTA2IDI2NS42NDA2IDExMy4wNjI1IDI1OS4zMTI1IFExMjEuOTIxOSAyMzguMzU5NCAxNDEuMzI4MSAyMzguMzU5NCBRMTUzLjQyMTkgMjM4LjM1OTQgMTYxLjg1OTQgMjQ4LjM0MzggUTE2OS41OTM4IDI1Ny40ODQ0IDE3Mi42ODc1IDI3My42NTYyIFpNNjQuMjY1NiA4NC43OTY5IFE0Ny4zOTA2IDg0Ljc5NjkgNDcuMzkwNiAxMDEuNjcxOSBMNDcuMzkwNiAzNzAuNjg3NSBRNDcuMzkwNiAzODcuNTYyNSA2NC4yNjU2IDM4Ny41NjI1IEwyMzUuMTI1IDM4Ny41NjI1IFEyNTIgMzg3LjU2MjUgMjUyIDM3MC42ODc1IEwyNTIgMTAxLjY3MTkgUTI1MiA4NC43OTY5IDIzNS4xMjUgODQuNzk2OSBMNjQuMjY1NiA4NC43OTY5IFpNNjQuMjY1NiA2Ny45MjE5IEwyMzUuMTI1IDY3LjkyMTkgUTI2OC44NzUgNjcuOTIxOSAyNjguODc1IDEwMS42NzE5IEwyNjguODc1IDM3MC42ODc1IFEyNjguODc1IDQwNC40Mzc1IDIzNS4xMjUgNDA0LjQzNzUgTDY0LjI2NTYgNDA0LjQzNzUgUTMwLjUxNTYgNDA0LjQzNzUgMzAuNTE1NiAzNzAuNjg3NSBMMzAuNTE1NiAxMDEuNjcxOSBRMzAuNTE1NiA2Ny45MjE5IDY0LjI2NTYgNjcuOTIxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaVLXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjEuODc1IDEwMS42NzE5IEw3OS43MzQ0IDEwMS42NzE5IEw3OS43MzQ0IDE1MS4zMTI1IEwxMzAuNjQwNiAxMDEuNjcxOSBMMTUzLjcwMzEgMTAxLjY3MTkgTDk2LjQ2ODggMTU2LjUxNTYgTDE1OC4zNDM4IDIxOS4yMzQ0IEwxMzQuODU5NCAyMTkuMjM0NCBMNzkuNzM0NCAxNjIuNTYyNSBMNzkuNzM0NCAyMTkuMjM0NCBMNjEuODc1IDIxOS4yMzQ0IEw2MS44NzUgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmQVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTExMC42NzE5IDExNS43MzQ0IEw5MS44MjgxIDE3NS43ODEyIEwxMjkuNTE1NiAxNzUuNzgxMiBMMTEwLjY3MTkgMTE1LjczNDQgWk05OS45ODQ0IDEwMS42NzE5IEwxMjEuNjQwNiAxMDEuNjcxOSBMMTYyLjE0MDYgMjE5LjIzNDQgTDE0My41NzgxIDIxOS4yMzQ0IEwxMzQuMDE1NiAxODguNTc4MSBMODcuNjA5NCAxODguNTc4MSBMNzguMDQ2OSAyMTkuMjM0NCBMNTkuNDg0NCAyMTkuMjM0NCBMOTkuOTg0NCAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaYyXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODYuMzQzOCAyMDMuMDYyNSBMMTQ1Ljk2ODggMjAzLjA2MjUgTDE0NS45Njg4IDIxOS4wOTM4IEw2MS44NzUgMjE5LjA5MzggTDYxLjg3NSAyMDMuNjI1IFE2Ni42NTYyIDE5OS4yNjU2IDc1LjUxNTYgMTkxLjM5MDYgUTEyMy44OTA2IDE0OC41IDEyMy44OTA2IDEzNS4yODEyIFExMjMuODkwNiAxMjYgMTE2LjU3ODEgMTIwLjMwNDcgUTEwOS4yNjU2IDExNC42MDk0IDk3LjMxMjUgMTE0LjYwOTQgUTkwIDExNC42MDk0IDgxLjQyMTkgMTE3LjA3MDMgUTcyLjg0MzggMTE5LjUzMTIgNjIuNzE4OCAxMjQuNDUzMSBMNjIuNzE4OCAxMDcuMTU2MiBRNzMuNTQ2OSAxMDMuMjE4OCA4Mi44OTg0IDEwMS4yNSBROTIuMjUgOTkuMjgxMiAxMDAuMjY1NiA5OS4yODEyIFExMjAuNjU2MiA5OS4yODEyIDEzMi44OTA2IDEwOC41NjI1IFExNDUuMTI1IDExNy44NDM4IDE0NS4xMjUgMTMzLjAzMTIgUTE0NS4xMjUgMTUyLjU3ODEgOTguNTc4MSAxOTIuNTE1NiBROTAuNzAzMSAxOTkuMjY1NiA4Ni4zNDM4IDIwMy4wNjI1IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpjNcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMjEuNzgxMiAxNTUuNTMxMiBRMTM0LjcxODggMTU4LjA2MjUgMTQxLjgyMDMgMTY1LjcyNjYgUTE0OC45MjE5IDE3My4zOTA2IDE0OC45MjE5IDE4NC45MjE5IFExNDguOTIxOSAyMDIuMzU5NCAxMzUuNTYyNSAyMTEuNzgxMiBRMTIyLjIwMzEgMjIxLjIwMzEgOTcuMzEyNSAyMjEuMjAzMSBRODkuMjk2OSAyMjEuMjAzMSA4MC41MDc4IDIxOS43MjY2IFE3MS43MTg4IDIxOC4yNSA2MS44NzUgMjE1LjQzNzUgTDYxLjg3NSAxOTguNDIxOSBRNjkuMTg3NSAyMDIuMjE4OCA3Ny41NTQ3IDIwNC4wNDY5IFE4NS45MjE5IDIwNS44NzUgOTUuMzQzOCAyMDUuODc1IFExMTAuNjcxOSAyMDUuODc1IDExOS4xMDk0IDIwMC4zMjAzIFExMjcuNTQ2OSAxOTQuNzY1NiAxMjcuNTQ2OSAxODQuOTIxOSBRMTI3LjU0NjkgMTc0LjUxNTYgMTE5Ljc0MjIgMTY5LjE3MTkgUTExMS45Mzc1IDE2My44MjgxIDk2Ljc1IDE2My44MjgxIEw4NC42NTYyIDE2My44MjgxIEw4NC42NTYyIDE0OC42NDA2IEw5Ny44NzUgMTQ4LjY0MDYgUTExMS4wOTM4IDE0OC42NDA2IDExNy45MTQxIDE0NC4yMTA5IFExMjQuNzM0NCAxMzkuNzgxMiAxMjQuNzM0NCAxMzEuMzQzOCBRMTI0LjczNDQgMTIzLjE4NzUgMTE3LjcwMzEgMTE4Ljg5ODQgUTExMC42NzE5IDExNC42MDk0IDk3LjMxMjUgMTE0LjYwOTQgUTkxLjY4NzUgMTE0LjYwOTQgODQuNTE1NiAxMTUuODc1IFE3Ny4zNDM4IDExNy4xNDA2IDY1Ljk1MzEgMTIwLjM3NSBMNjUuOTUzMSAxMDQuMjAzMSBRNzYuMjE4OCAxMDEuODEyNSA4NS4yMTg4IDEwMC41NDY5IFE5NC4yMTg4IDk5LjI4MTIgMTAxLjk1MzEgOTkuMjgxMiBRMTIyLjIwMzEgOTkuMjgxMiAxMzQuMDg1OSAxMDcuNTc4MSBRMTQ1Ljk2ODggMTE1Ljg3NSAxNDUuOTY4OCAxMjkuNzk2OSBRMTQ1Ljk2ODggMTM5LjUgMTM5LjY0MDYgMTQ2LjI1IFExMzMuMzEyNSAxNTMgMTIxLjc4MTIgMTU1LjUzMTIgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmNFxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEyMC4wOTM4IDExOC42ODc1IEw3Ni42NDA2IDE3Ny42MDk0IEwxMjAuMDkzOCAxNzcuNjA5NCBMMTIwLjA5MzggMTE4LjY4NzUgWk0xMTcgMTAxLjY3MTkgTDE0MC4zNDM4IDEwMS42NzE5IEwxNDAuMzQzOCAxNzcuNjA5NCBMMTU5LjMyODEgMTc3LjYwOTQgTDE1OS4zMjgxIDE5Mi45Mzc1IEwxNDAuMzQzOCAxOTIuOTM3NSBMMTQwLjM0MzggMjE5LjA5MzggTDEyMC4wOTM4IDIxOS4wOTM4IEwxMjAuMDkzOCAxOTIuOTM3NSBMNjEuODc1IDE5Mi45Mzc1IEw2MS44NzUgMTc1LjkyMTkgTDExNyAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaY1XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjcuNSAxMDEuNjcxOSBMMTM5LjIxODggMTAxLjY3MTkgTDEzOS4yMTg4IDExNS4wMzEyIEw4NC4yMzQ0IDExNS4wMzEyIEw4NC4yMzQ0IDE0My43MTg4IFE4OC4xNzE5IDE0Mi40NTMxIDkyLjI1IDE0MS44OTA2IFE5Ni4xODc1IDE0MS4zMjgxIDEwMC4xMjUgMTQxLjMyODEgUTEyMi43NjU2IDE0MS4zMjgxIDEzNS45ODQ0IDE1Mi4xNTYyIFExNDkuMjAzMSAxNjIuODQzOCAxNDkuMjAzMSAxODEuMjY1NiBRMTQ5LjIwMzEgMjAwLjI1IDEzNS41NjI1IDIxMC43OTY5IFExMjIuMDYyNSAyMjEuMjAzMSA5Ny4zMTI1IDIyMS4yMDMxIFE4OC44NzUgMjIxLjIwMzEgODAuMDE1NiAyMTkuOTM3NSBRNzEuMTU2MiAyMTguNjcxOSA2MS44NzUgMjE2LjE0MDYgTDYxLjg3NSAyMDAuMjUgUTY5Ljg5MDYgMjA0LjA0NjkgNzguNjA5NCAyMDYuMDE1NiBRODcuMzI4MSAyMDcuODQzOCA5Ny4wMzEyIDIwNy44NDM4IFExMTIuNjQwNiAyMDcuODQzOCAxMjEuNzgxMiAyMDAuNjcxOSBRMTMwLjkyMTkgMTkzLjUgMTMwLjkyMTkgMTgxLjI2NTYgUTEzMC45MjE5IDE2OS4wMzEyIDEyMS43ODEyIDE2MS44NTk0IFExMTIuNjQwNiAxNTQuNjg3NSA5Ny4wMzEyIDE1NC42ODc1IFE4OS43MTg4IDE1NC42ODc1IDgyLjQwNjIgMTU2LjA5MzggUTc1LjA5MzggMTU3LjUgNjcuNSAxNjAuNDUzMSBMNjcuNSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaY2XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTEwLjEwOTQgMTUzLjcwMzEgUTk3LjczNDQgMTUzLjcwMzEgOTAuNTYyNSAxNjEuMDE1NiBRODMuMzkwNiAxNjguNDY4OCA4My4zOTA2IDE4MS4yNjU2IFE4My4zOTA2IDE5My45MjE5IDkwLjU2MjUgMjAxLjIzNDQgUTk3LjczNDQgMjA4LjY4NzUgMTEwLjEwOTQgMjA4LjY4NzUgUTEyMi4zNDM4IDIwOC42ODc1IDEyOS41MTU2IDIwMS4yMzQ0IFExMzYuNjg3NSAxOTMuOTIxOSAxMzYuNjg3NSAxODEuMjY1NiBRMTM2LjY4NzUgMTY4LjQ2ODggMTI5LjUxNTYgMTYxLjAxNTYgUTEyMi4zNDM4IDE1My43MDMxIDExMC4xMDk0IDE1My43MDMxIFpNMTQ2LjM5MDYgMTAzLjkyMTkgTDE0Ni4zOTA2IDExOC40MDYyIFExMzkuNSAxMTUuNTkzOCAxMzIuNDY4OCAxMTQuMTg3NSBRMTI1LjQzNzUgMTEyLjY0MDYgMTE4LjU0NjkgMTEyLjY0MDYgUTEwMC41NDY5IDExMi42NDA2IDkwLjk4NDQgMTIzLjE4NzUgUTgxLjQyMTkgMTMzLjg3NSA4MC4wMTU2IDE1NS4zOTA2IFE4NS4zNTk0IDE0OC41IDkzLjM3NSAxNDQuODQzOCBRMTAxLjUzMTIgMTQxLjE4NzUgMTExLjA5MzggMTQxLjE4NzUgUTEzMS40ODQ0IDE0MS4xODc1IDE0My4yOTY5IDE1MS44NzUgUTE1NS4xMDk0IDE2Mi43MDMxIDE1NS4xMDk0IDE4MS4yNjU2IFExNTUuMTA5NCAxOTkuMTI1IDE0Mi43MzQ0IDIxMC4yMzQ0IFExMzAuNSAyMjEuMjAzMSAxMTAuMTA5NCAyMjEuMjAzMSBRODYuNjI1IDIyMS4yMDMxIDc0LjI1IDIwNS41OTM4IFE2MS44NzUgMTg5Ljk4NDQgNjEuODc1IDE2MC4xNzE5IFE2MS44NzUgMTMyLjMyODEgNzcuMDYyNSAxMTUuODc1IFE5Mi4yNSA5OS4yODEyIDExNy44NDM4IDk5LjI4MTIgUTEyNC43MzQ0IDk5LjI4MTIgMTMxLjc2NTYgMTAwLjQwNjIgUTEzOC43OTY5IDEwMS42NzE5IDE0Ni4zOTA2IDEwMy45MjE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpjdcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02MS44NzUgMTAxLjY3MTkgTDE0OC42NDA2IDEwMS42NzE5IEwxNDguNjQwNiAxMDguNDIxOSBMOTkuNzAzMSAyMTkuMDkzOCBMODAuNTc4MSAyMTkuMDkzOCBMMTI2LjcwMzEgMTE1LjAzMTIgTDYxLjg3NSAxMTUuMDMxMiBMNjEuODc1IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpjhcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMDguMjgxMiAxNjMuMTI1IFE5NS4yMDMxIDE2My4xMjUgODcuNzUgMTY5LjMxMjUgUTgwLjI5NjkgMTc1LjM1OTQgODAuMjk2OSAxODUuOTA2MiBRODAuMjk2OSAxOTYuNTkzOCA4Ny43NSAyMDIuNjQwNiBROTUuMjAzMSAyMDguNjg3NSAxMDguMjgxMiAyMDguNjg3NSBRMTIxLjIxODggMjA4LjY4NzUgMTI4LjgxMjUgMjAyLjUgUTEzNi4yNjU2IDE5Ni40NTMxIDEzNi4yNjU2IDE4NS45MDYyIFExMzYuMjY1NiAxNzUuMzU5NCAxMjguODEyNSAxNjkuMzEyNSBRMTIxLjM1OTQgMTYzLjEyNSAxMDguMjgxMiAxNjMuMTI1IFpNOTAgMTU2LjIzNDQgUTc4LjE4NzUgMTUzLjcwMzEgNzEuNzE4OCAxNDYuODEyNSBRNjUuMTA5NCAxMzkuNzgxMiA2NS4xMDk0IDEyOS42NTYyIFE2NS4xMDk0IDExNS41OTM4IDc2LjY0MDYgMTA3LjQzNzUgUTg4LjE3MTkgOTkuMjgxMiAxMDguMjgxMiA5OS4yODEyIFExMjguMzkwNiA5OS4yODEyIDEzOS45MjE5IDEwNy40Mzc1IFExNTEuMzEyNSAxMTUuNTkzOCAxNTEuMzEyNSAxMjkuNjU2MiBRMTUxLjMxMjUgMTQwLjA2MjUgMTQ0Ljg0MzggMTQ2LjgxMjUgUTEzOC4yMzQ0IDE1My43MDMxIDEyNi41NjI1IDE1Ni4yMzQ0IFExMzkuMjE4OCAxNTguNzY1NiAxNDcuMDkzOCAxNjYuOTIxOSBRMTU0LjU0NjkgMTc0LjY1NjIgMTU0LjU0NjkgMTg1LjkwNjIgUTE1NC41NDY5IDIwMi45MjE5IDE0Mi41OTM4IDIxMi4wNjI1IFExMzAuNSAyMjEuMjAzMSAxMDguMjgxMiAyMjEuMjAzMSBRODUuOTIxOSAyMjEuMjAzMSA3My45Njg4IDIxMi4wNjI1IFE2MS44NzUgMjAyLjkyMTkgNjEuODc1IDE4NS45MDYyIFE2MS44NzUgMTc0LjkzNzUgNjkuMzI4MSAxNjYuOTIxOSBRNzYuOTIxOSAxNTkuMDQ2OSA5MCAxNTYuMjM0NCBaTTgzLjI1IDEzMS4yMDMxIFE4My4yNSAxNDAuMDYyNSA4OS44NTk0IDE0NS40MDYyIFE5Ni4zMjgxIDE1MC42MDk0IDEwOC4yODEyIDE1MC42MDk0IFExMTkuNjcxOSAxNTAuNjA5NCAxMjYuNTYyNSAxNDUuNDA2MiBRMTMzLjMxMjUgMTQwLjM0MzggMTMzLjMxMjUgMTMxLjIwMzEgUTEzMy4zMTI1IDEyMi4zNDM4IDEyNi41NjI1IDExNyBRMTE5Ljk1MzEgMTExLjc5NjkgMTA4LjI4MTIgMTExLjc5NjkgUTk2LjYwOTQgMTExLjc5NjkgODkuODU5NCAxMTcgUTgzLjI1IDEyMi4wNjI1IDgzLjI1IDEzMS4yMDMxIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpjlcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk03MC41OTM4IDIxNi41NjI1IEw3MC41OTM4IDIwMi4wNzgxIFE3Ny40ODQ0IDIwNC44OTA2IDg0LjUxNTYgMjA2LjQzNzUgUTkxLjU0NjkgMjA3Ljg0MzggOTguMjk2OSAyMDcuODQzOCBRMTE2LjQzNzUgMjA3Ljg0MzggMTI2IDE5Ny4yOTY5IFExMzUuNDIxOSAxODYuNzUgMTM2LjgyODEgMTY1LjA5MzggUTEzMS45MDYyIDE3MS43MDMxIDEyMy40Njg4IDE3NS41IFExMTUuNDUzMSAxNzkuMTU2MiAxMDUuNzUgMTc5LjE1NjIgUTg1LjUgMTc5LjE1NjIgNzMuNjg3NSAxNjguNDY4OCBRNjEuODc1IDE1Ny43ODEyIDYxLjg3NSAxMzkuMjE4OCBRNjEuODc1IDEyMS4wNzgxIDc0LjEwOTQgMTEwLjI1IFE4Ni40ODQ0IDk5LjI4MTIgMTA2Ljg3NSA5OS4yODEyIFExMzAuMzU5NCA5OS4yODEyIDE0Mi41OTM4IDExNC44OTA2IFExNTQuOTY4OCAxMzAuNSAxNTQuOTY4OCAxNjAuMzEyNSBRMTU0Ljk2ODggMTg4LjE1NjIgMTM5LjkyMTkgMjA0LjYwOTQgUTEyNC43MzQ0IDIyMS4yMDMxIDk5LjE0MDYgMjIxLjIwMzEgUTkyLjI1IDIyMS4yMDMxIDg1LjIxODggMjIwLjA3ODEgUTc4LjE4NzUgMjE4LjgxMjUgNzAuNTkzOCAyMTYuNTYyNSBaTTEwNi44NzUgMTY2Ljc4MTIgUTExOS4yNSAxNjYuNzgxMiAxMjYuNDIxOSAxNTkuNDY4OCBRMTMzLjU5MzggMTUyLjE1NjIgMTMzLjU5MzggMTM5LjIxODggUTEzMy41OTM4IDEyNi41NjI1IDEyNi40MjE5IDExOS4yNSBRMTE5LjI1IDExMS43OTY5IDEwNi44NzUgMTExLjc5NjkgUTk0LjkyMTkgMTExLjc5NjkgODcuNDY4OCAxMTkuMjUgUTgwLjE1NjIgMTI2LjU2MjUgODAuMTU2MiAxMzkuMjE4OCBRODAuMTU2MiAxNTIuMTU2MiA4Ny40Njg4IDE1OS40Njg4IFE5NC42NDA2IDE2Ni43ODEyIDEwNi44NzUgMTY2Ljc4MTIgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmMTBcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xNTkuMDQ2OSAxMTEuNzk2OSBRMTQ5LjA2MjUgMTExLjc5NjkgMTQyLjAzMTIgMTIzLjg5MDYgUTEzNC44NTk0IDEzNS45ODQ0IDEzNC44NTk0IDE2MC4xNzE5IFExMzQuODU5NCAxODQuNSAxNDIuMDMxMiAxOTYuNTkzOCBRMTQ5LjA2MjUgMjA4LjY4NzUgMTU5LjA0NjkgMjA4LjY4NzUgUTE2OS4wMzEyIDIwOC42ODc1IDE3Ni4wNjI1IDE5Ni41OTM4IFExODMuMjM0NCAxODQuNSAxODMuMjM0NCAxNjAuMTcxOSBRMTgzLjIzNDQgMTM1Ljk4NDQgMTc2LjA2MjUgMTIzLjg5MDYgUTE2OS4wMzEyIDExMS43OTY5IDE1OS4wNDY5IDExMS43OTY5IFpNMTU5LjA0NjkgOTkuMjgxMiBRMTc3LjQ2ODggOTkuMjgxMiAxODkuNDIxOSAxMTQuODkwNiBRMjAxLjM3NSAxMzAuNSAyMDEuMzc1IDE2MC4xNzE5IFEyMDEuMzc1IDE4OS45ODQ0IDE4OS40MjE5IDIwNS41OTM4IFExNzcuNDY4OCAyMjEuMjAzMSAxNTkuMDQ2OSAyMjEuMjAzMSBRMTM2LjI2NTYgMjIxLjIwMzEgMTI2LjQyMTkgMjA1LjU5MzggUTExNi41NzgxIDE4OS45ODQ0IDExNi41NzgxIDE2MC4xNzE5IFExMTYuNTc4MSAxMzAuNSAxMjYuNDIxOSAxMTQuODkwNiBRMTM2LjI2NTYgOTkuMjgxMiAxNTkuMDQ2OSA5OS4yODEyIFpNODAuNTc4MSAyMTkuMDkzOCBMODAuNTc4MSAxMTcuNzAzMSBMNjEuODc1IDEyMy40Njg4IEw2MS44NzUgMTA3LjE1NjIgTDgxLjU2MjUgMTAxLjY3MTkgTDEwMC44MjgxIDEwMS42NzE5IEwxMDAuODI4MSAyMTkuMDkzOCBMODAuNTc4MSAyMTkuMDkzOCBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaZKXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNODkuMTU2MiAxMDEuNjcxOSBMMTA3LjAxNTYgMTAxLjY3MTkgTDEwNy4wMTU2IDE3OC43MzQ0IFExMDcuMDE1NiAxOTkuNjg3NSA5Ny44NzUgMjA5LjUzMTIgUTg4Ljg3NSAyMTkuMjM0NCA2OC43NjU2IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAyMDUuNzM0NCBMNjcuNSAyMDUuNzM0NCBRNzkuMzEyNSAyMDUuNzM0NCA4NC4yMzQ0IDE5OS44MjgxIFE4OS4xNTYyIDE5My45MjE5IDg5LjE1NjIgMTc4LjczNDQgTDg5LjE1NjIgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmUVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk0xMDcuMjk2OSAyMjEuMDYyNSBRMTA2LjczNDQgMjIxLjA2MjUgMTA1LjUzOTEgMjIxLjEzMjggUTEwNC4zNDM4IDIyMS4yMDMxIDEwMy42NDA2IDIyMS4yMDMxIFE4MS40MjE5IDIyMS4yMDMxIDcwLjUyMzQgMjA2LjA4NTkgUTU5LjYyNSAxOTAuOTY4OCA1OS42MjUgMTYwLjMxMjUgUTU5LjYyNSAxMjkuNTE1NiA3MC41OTM4IDExNC4zOTg0IFE4MS41NjI1IDk5LjI4MTIgMTAzLjc4MTIgOTkuMjgxMiBRMTI2LjE0MDYgOTkuMjgxMiAxMzcuMTA5NCAxMTQuMzk4NCBRMTQ4LjA3ODEgMTI5LjUxNTYgMTQ4LjA3ODEgMTYwLjMxMjUgUTE0OC4wNzgxIDE4My41MTU2IDE0Mi4wMzEyIDE5Ny42NDg0IFExMzUuOTg0NCAyMTEuNzgxMiAxMjMuNjA5NCAyMTcuNDA2MiBMMTQxLjMyODEgMjMyLjMxMjUgTDEyNy45Njg4IDI0MC4xODc1IEwxMDcuMjk2OSAyMjEuMDYyNSBaTTEyOS4zNzUgMTYwLjMxMjUgUTEyOS4zNzUgMTM0LjQzNzUgMTIzLjM5ODQgMTIzLjMyODEgUTExNy40MjE5IDExMi4yMTg4IDEwMy43ODEyIDExMi4yMTg4IFE5MC4yODEyIDExMi4yMTg4IDg0LjMwNDcgMTIzLjMyODEgUTc4LjMyODEgMTM0LjQzNzUgNzguMzI4MSAxNjAuMzEyNSBRNzguMzI4MSAxODYuMTg3NSA4NC4zMDQ3IDE5Ny4yOTY5IFE5MC4yODEyIDIwOC40MDYyIDEwMy43ODEyIDIwOC40MDYyIFExMTcuNDIxOSAyMDguNDA2MiAxMjMuMzk4NCAxOTcuMjk2OSBRMTI5LjM3NSAxODYuMTg3NSAxMjkuMzc1IDE2MC4zMTI1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmS1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTYxLjg3NSAxMDEuNjcxOSBMNzkuNzM0NCAxMDEuNjcxOSBMNzkuNzM0NCAxNTEuMzEyNSBMMTMwLjY0MDYgMTAxLjY3MTkgTDE1My43MDMxIDEwMS42NzE5IEw5Ni40Njg4IDE1Ni41MTU2IEwxNTguMzQzOCAyMTkuMjM0NCBMMTM0Ljg1OTQgMjE5LjIzNDQgTDc5LjczNDQgMTYyLjU2MjUgTDc5LjczNDQgMjE5LjIzNDQgTDYxLjg3NSAyMTkuMjM0NCBMNjEuODc1IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZo0FcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTExMC42NzE5IDExNS43MzQ0IEw5MS44MjgxIDE3NS43ODEyIEwxMjkuNTE1NiAxNzUuNzgxMiBMMTEwLjY3MTkgMTE1LjczNDQgWk05OS45ODQ0IDEwMS42NzE5IEwxMjEuNjQwNiAxMDEuNjcxOSBMMTYyLjE0MDYgMjE5LjIzNDQgTDE0My41NzgxIDIxOS4yMzQ0IEwxMzQuMDE1NiAxODguNTc4MSBMODcuNjA5NCAxODguNTc4MSBMNzguMDQ2OSAyMTkuMjM0NCBMNTkuNDg0NCAyMTkuMjM0NCBMOTkuOTg0NCAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaMyXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk04Ni4zNDM4IDIwMy4wNjI1IEwxNDUuOTY4OCAyMDMuMDYyNSBMMTQ1Ljk2ODggMjE5LjA5MzggTDYxLjg3NSAyMTkuMDkzOCBMNjEuODc1IDIwMy42MjUgUTY2LjY1NjIgMTk5LjI2NTYgNzUuNTE1NiAxOTEuMzkwNiBRMTIzLjg5MDYgMTQ4LjUgMTIzLjg5MDYgMTM1LjI4MTIgUTEyMy44OTA2IDEyNiAxMTYuNTc4MSAxMjAuMzA0NyBRMTA5LjI2NTYgMTE0LjYwOTQgOTcuMzEyNSAxMTQuNjA5NCBROTAgMTE0LjYwOTQgODEuNDIxOSAxMTcuMDcwMyBRNzIuODQzOCAxMTkuNTMxMiA2Mi43MTg4IDEyNC40NTMxIEw2Mi43MTg4IDEwNy4xNTYyIFE3My41NDY5IDEwMy4yMTg4IDgyLjg5ODQgMTAxLjI1IFE5Mi4yNSA5OS4yODEyIDEwMC4yNjU2IDk5LjI4MTIgUTEyMC42NTYyIDk5LjI4MTIgMTMyLjg5MDYgMTA4LjU2MjUgUTE0NS4xMjUgMTE3Ljg0MzggMTQ1LjEyNSAxMzMuMDMxMiBRMTQ1LjEyNSAxNTIuNTc4MSA5OC41NzgxIDE5Mi41MTU2IFE5MC43MDMxIDE5OS4yNjU2IDg2LjM0MzggMjAzLjA2MjUgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjM1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTIxLjc4MTIgMTU1LjUzMTIgUTEzNC43MTg4IDE1OC4wNjI1IDE0MS44MjAzIDE2NS43MjY2IFExNDguOTIxOSAxNzMuMzkwNiAxNDguOTIxOSAxODQuOTIxOSBRMTQ4LjkyMTkgMjAyLjM1OTQgMTM1LjU2MjUgMjExLjc4MTIgUTEyMi4yMDMxIDIyMS4yMDMxIDk3LjMxMjUgMjIxLjIwMzEgUTg5LjI5NjkgMjIxLjIwMzEgODAuNTA3OCAyMTkuNzI2NiBRNzEuNzE4OCAyMTguMjUgNjEuODc1IDIxNS40Mzc1IEw2MS44NzUgMTk4LjQyMTkgUTY5LjE4NzUgMjAyLjIxODggNzcuNTU0NyAyMDQuMDQ2OSBRODUuOTIxOSAyMDUuODc1IDk1LjM0MzggMjA1Ljg3NSBRMTEwLjY3MTkgMjA1Ljg3NSAxMTkuMTA5NCAyMDAuMzIwMyBRMTI3LjU0NjkgMTk0Ljc2NTYgMTI3LjU0NjkgMTg0LjkyMTkgUTEyNy41NDY5IDE3NC41MTU2IDExOS43NDIyIDE2OS4xNzE5IFExMTEuOTM3NSAxNjMuODI4MSA5Ni43NSAxNjMuODI4MSBMODQuNjU2MiAxNjMuODI4MSBMODQuNjU2MiAxNDguNjQwNiBMOTcuODc1IDE0OC42NDA2IFExMTEuMDkzOCAxNDguNjQwNiAxMTcuOTE0MSAxNDQuMjEwOSBRMTI0LjczNDQgMTM5Ljc4MTIgMTI0LjczNDQgMTMxLjM0MzggUTEyNC43MzQ0IDEyMy4xODc1IDExNy43MDMxIDExOC44OTg0IFExMTAuNjcxOSAxMTQuNjA5NCA5Ny4zMTI1IDExNC42MDk0IFE5MS42ODc1IDExNC42MDk0IDg0LjUxNTYgMTE1Ljg3NSBRNzcuMzQzOCAxMTcuMTQwNiA2NS45NTMxIDEyMC4zNzUgTDY1Ljk1MzEgMTA0LjIwMzEgUTc2LjIxODggMTAxLjgxMjUgODUuMjE4OCAxMDAuNTQ2OSBROTQuMjE4OCA5OS4yODEyIDEwMS45NTMxIDk5LjI4MTIgUTEyMi4yMDMxIDk5LjI4MTIgMTM0LjA4NTkgMTA3LjU3ODEgUTE0NS45Njg4IDExNS44NzUgMTQ1Ljk2ODggMTI5Ljc5NjkgUTE0NS45Njg4IDEzOS41IDEzOS42NDA2IDE0Ni4yNSBRMTMzLjMxMjUgMTUzIDEyMS43ODEyIDE1NS41MzEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZozRcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEyMC4wOTM4IDExOC42ODc1IEw3Ni42NDA2IDE3Ny42MDk0IEwxMjAuMDkzOCAxNzcuNjA5NCBMMTIwLjA5MzggMTE4LjY4NzUgWk0xMTcgMTAxLjY3MTkgTDE0MC4zNDM4IDEwMS42NzE5IEwxNDAuMzQzOCAxNzcuNjA5NCBMMTU5LjMyODEgMTc3LjYwOTQgTDE1OS4zMjgxIDE5Mi45Mzc1IEwxNDAuMzQzOCAxOTIuOTM3NSBMMTQwLjM0MzggMjE5LjA5MzggTDEyMC4wOTM4IDIxOS4wOTM4IEwxMjAuMDkzOCAxOTIuOTM3NSBMNjEuODc1IDE5Mi45Mzc1IEw2MS44NzUgMTc1LjkyMTkgTDExNyAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaM1XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02Ny41IDEwMS42NzE5IEwxMzkuMjE4OCAxMDEuNjcxOSBMMTM5LjIxODggMTE1LjAzMTIgTDg0LjIzNDQgMTE1LjAzMTIgTDg0LjIzNDQgMTQzLjcxODggUTg4LjE3MTkgMTQyLjQ1MzEgOTIuMjUgMTQxLjg5MDYgUTk2LjE4NzUgMTQxLjMyODEgMTAwLjEyNSAxNDEuMzI4MSBRMTIyLjc2NTYgMTQxLjMyODEgMTM1Ljk4NDQgMTUyLjE1NjIgUTE0OS4yMDMxIDE2Mi44NDM4IDE0OS4yMDMxIDE4MS4yNjU2IFExNDkuMjAzMSAyMDAuMjUgMTM1LjU2MjUgMjEwLjc5NjkgUTEyMi4wNjI1IDIyMS4yMDMxIDk3LjMxMjUgMjIxLjIwMzEgUTg4Ljg3NSAyMjEuMjAzMSA4MC4wMTU2IDIxOS45Mzc1IFE3MS4xNTYyIDIxOC42NzE5IDYxLjg3NSAyMTYuMTQwNiBMNjEuODc1IDIwMC4yNSBRNjkuODkwNiAyMDQuMDQ2OSA3OC42MDk0IDIwNi4wMTU2IFE4Ny4zMjgxIDIwNy44NDM4IDk3LjAzMTIgMjA3Ljg0MzggUTExMi42NDA2IDIwNy44NDM4IDEyMS43ODEyIDIwMC42NzE5IFExMzAuOTIxOSAxOTMuNSAxMzAuOTIxOSAxODEuMjY1NiBRMTMwLjkyMTkgMTY5LjAzMTIgMTIxLjc4MTIgMTYxLjg1OTQgUTExMi42NDA2IDE1NC42ODc1IDk3LjAzMTIgMTU0LjY4NzUgUTg5LjcxODggMTU0LjY4NzUgODIuNDA2MiAxNTYuMDkzOCBRNzUuMDkzOCAxNTcuNSA2Ny41IDE2MC40NTMxIEw2Ny41IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZozZcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTExMC4xMDk0IDE1My43MDMxIFE5Ny43MzQ0IDE1My43MDMxIDkwLjU2MjUgMTYxLjAxNTYgUTgzLjM5MDYgMTY4LjQ2ODggODMuMzkwNiAxODEuMjY1NiBRODMuMzkwNiAxOTMuOTIxOSA5MC41NjI1IDIwMS4yMzQ0IFE5Ny43MzQ0IDIwOC42ODc1IDExMC4xMDk0IDIwOC42ODc1IFExMjIuMzQzOCAyMDguNjg3NSAxMjkuNTE1NiAyMDEuMjM0NCBRMTM2LjY4NzUgMTkzLjkyMTkgMTM2LjY4NzUgMTgxLjI2NTYgUTEzNi42ODc1IDE2OC40Njg4IDEyOS41MTU2IDE2MS4wMTU2IFExMjIuMzQzOCAxNTMuNzAzMSAxMTAuMTA5NCAxNTMuNzAzMSBaTTE0Ni4zOTA2IDEwMy45MjE5IEwxNDYuMzkwNiAxMTguNDA2MiBRMTM5LjUgMTE1LjU5MzggMTMyLjQ2ODggMTE0LjE4NzUgUTEyNS40Mzc1IDExMi42NDA2IDExOC41NDY5IDExMi42NDA2IFExMDAuNTQ2OSAxMTIuNjQwNiA5MC45ODQ0IDEyMy4xODc1IFE4MS40MjE5IDEzMy44NzUgODAuMDE1NiAxNTUuMzkwNiBRODUuMzU5NCAxNDguNSA5My4zNzUgMTQ0Ljg0MzggUTEwMS41MzEyIDE0MS4xODc1IDExMS4wOTM4IDE0MS4xODc1IFExMzEuNDg0NCAxNDEuMTg3NSAxNDMuMjk2OSAxNTEuODc1IFExNTUuMTA5NCAxNjIuNzAzMSAxNTUuMTA5NCAxODEuMjY1NiBRMTU1LjEwOTQgMTk5LjEyNSAxNDIuNzM0NCAyMTAuMjM0NCBRMTMwLjUgMjIxLjIwMzEgMTEwLjEwOTQgMjIxLjIwMzEgUTg2LjYyNSAyMjEuMjAzMSA3NC4yNSAyMDUuNTkzOCBRNjEuODc1IDE4OS45ODQ0IDYxLjg3NSAxNjAuMTcxOSBRNjEuODc1IDEzMi4zMjgxIDc3LjA2MjUgMTE1Ljg3NSBROTIuMjUgOTkuMjgxMiAxMTcuODQzOCA5OS4yODEyIFExMjQuNzM0NCA5OS4yODEyIDEzMS43NjU2IDEwMC40MDYyIFExMzguNzk2OSAxMDEuNjcxOSAxNDYuMzkwNiAxMDMuOTIxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaM3XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02MS44NzUgMTAxLjY3MTkgTDE0OC42NDA2IDEwMS42NzE5IEwxNDguNjQwNiAxMDguNDIxOSBMOTkuNzAzMSAyMTkuMDkzOCBMODAuNTc4MSAyMTkuMDkzOCBMMTI2LjcwMzEgMTE1LjAzMTIgTDYxLjg3NSAxMTUuMDMxMiBMNjEuODc1IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZozhcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEwOC4yODEyIDE2My4xMjUgUTk1LjIwMzEgMTYzLjEyNSA4Ny43NSAxNjkuMzEyNSBRODAuMjk2OSAxNzUuMzU5NCA4MC4yOTY5IDE4NS45MDYyIFE4MC4yOTY5IDE5Ni41OTM4IDg3Ljc1IDIwMi42NDA2IFE5NS4yMDMxIDIwOC42ODc1IDEwOC4yODEyIDIwOC42ODc1IFExMjEuMjE4OCAyMDguNjg3NSAxMjguODEyNSAyMDIuNSBRMTM2LjI2NTYgMTk2LjQ1MzEgMTM2LjI2NTYgMTg1LjkwNjIgUTEzNi4yNjU2IDE3NS4zNTk0IDEyOC44MTI1IDE2OS4zMTI1IFExMjEuMzU5NCAxNjMuMTI1IDEwOC4yODEyIDE2My4xMjUgWk05MCAxNTYuMjM0NCBRNzguMTg3NSAxNTMuNzAzMSA3MS43MTg4IDE0Ni44MTI1IFE2NS4xMDk0IDEzOS43ODEyIDY1LjEwOTQgMTI5LjY1NjIgUTY1LjEwOTQgMTE1LjU5MzggNzYuNjQwNiAxMDcuNDM3NSBRODguMTcxOSA5OS4yODEyIDEwOC4yODEyIDk5LjI4MTIgUTEyOC4zOTA2IDk5LjI4MTIgMTM5LjkyMTkgMTA3LjQzNzUgUTE1MS4zMTI1IDExNS41OTM4IDE1MS4zMTI1IDEyOS42NTYyIFExNTEuMzEyNSAxNDAuMDYyNSAxNDQuODQzOCAxNDYuODEyNSBRMTM4LjIzNDQgMTUzLjcwMzEgMTI2LjU2MjUgMTU2LjIzNDQgUTEzOS4yMTg4IDE1OC43NjU2IDE0Ny4wOTM4IDE2Ni45MjE5IFExNTQuNTQ2OSAxNzQuNjU2MiAxNTQuNTQ2OSAxODUuOTA2MiBRMTU0LjU0NjkgMjAyLjkyMTkgMTQyLjU5MzggMjEyLjA2MjUgUTEzMC41IDIyMS4yMDMxIDEwOC4yODEyIDIyMS4yMDMxIFE4NS45MjE5IDIyMS4yMDMxIDczLjk2ODggMjEyLjA2MjUgUTYxLjg3NSAyMDIuOTIxOSA2MS44NzUgMTg1LjkwNjIgUTYxLjg3NSAxNzQuOTM3NSA2OS4zMjgxIDE2Ni45MjE5IFE3Ni45MjE5IDE1OS4wNDY5IDkwIDE1Ni4yMzQ0IFpNODMuMjUgMTMxLjIwMzEgUTgzLjI1IDE0MC4wNjI1IDg5Ljg1OTQgMTQ1LjQwNjIgUTk2LjMyODEgMTUwLjYwOTQgMTA4LjI4MTIgMTUwLjYwOTQgUTExOS42NzE5IDE1MC42MDk0IDEyNi41NjI1IDE0NS40MDYyIFExMzMuMzEyNSAxNDAuMzQzOCAxMzMuMzEyNSAxMzEuMjAzMSBRMTMzLjMxMjUgMTIyLjM0MzggMTI2LjU2MjUgMTE3IFExMTkuOTUzMSAxMTEuNzk2OSAxMDguMjgxMiAxMTEuNzk2OSBROTYuNjA5NCAxMTEuNzk2OSA4OS44NTk0IDExNyBRODMuMjUgMTIyLjA2MjUgODMuMjUgMTMxLjIwMzEgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjOVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNzAuNTkzOCAyMTYuNTYyNSBMNzAuNTkzOCAyMDIuMDc4MSBRNzcuNDg0NCAyMDQuODkwNiA4NC41MTU2IDIwNi40Mzc1IFE5MS41NDY5IDIwNy44NDM4IDk4LjI5NjkgMjA3Ljg0MzggUTExNi40Mzc1IDIwNy44NDM4IDEyNiAxOTcuMjk2OSBRMTM1LjQyMTkgMTg2Ljc1IDEzNi44MjgxIDE2NS4wOTM4IFExMzEuOTA2MiAxNzEuNzAzMSAxMjMuNDY4OCAxNzUuNSBRMTE1LjQ1MzEgMTc5LjE1NjIgMTA1Ljc1IDE3OS4xNTYyIFE4NS41IDE3OS4xNTYyIDczLjY4NzUgMTY4LjQ2ODggUTYxLjg3NSAxNTcuNzgxMiA2MS44NzUgMTM5LjIxODggUTYxLjg3NSAxMjEuMDc4MSA3NC4xMDk0IDExMC4yNSBRODYuNDg0NCA5OS4yODEyIDEwNi44NzUgOTkuMjgxMiBRMTMwLjM1OTQgOTkuMjgxMiAxNDIuNTkzOCAxMTQuODkwNiBRMTU0Ljk2ODggMTMwLjUgMTU0Ljk2ODggMTYwLjMxMjUgUTE1NC45Njg4IDE4OC4xNTYyIDEzOS45MjE5IDIwNC42MDk0IFExMjQuNzM0NCAyMjEuMjAzMSA5OS4xNDA2IDIyMS4yMDMxIFE5Mi4yNSAyMjEuMjAzMSA4NS4yMTg4IDIyMC4wNzgxIFE3OC4xODc1IDIxOC44MTI1IDcwLjU5MzggMjE2LjU2MjUgWk0xMDYuODc1IDE2Ni43ODEyIFExMTkuMjUgMTY2Ljc4MTIgMTI2LjQyMTkgMTU5LjQ2ODggUTEzMy41OTM4IDE1Mi4xNTYyIDEzMy41OTM4IDEzOS4yMTg4IFExMzMuNTkzOCAxMjYuNTYyNSAxMjYuNDIxOSAxMTkuMjUgUTExOS4yNSAxMTEuNzk2OSAxMDYuODc1IDExMS43OTY5IFE5NC45MjE5IDExMS43OTY5IDg3LjQ2ODggMTE5LjI1IFE4MC4xNTYyIDEyNi41NjI1IDgwLjE1NjIgMTM5LjIxODggUTgwLjE1NjIgMTUyLjE1NjIgODcuNDY4OCAxNTkuNDY4OCBROTQuNjQwNiAxNjYuNzgxMiAxMDYuODc1IDE2Ni43ODEyIFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZozEwXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xNTkuMDQ2OSAxMTEuNzk2OSBRMTQ5LjA2MjUgMTExLjc5NjkgMTQyLjAzMTIgMTIzLjg5MDYgUTEzNC44NTk0IDEzNS45ODQ0IDEzNC44NTk0IDE2MC4xNzE5IFExMzQuODU5NCAxODQuNSAxNDIuMDMxMiAxOTYuNTkzOCBRMTQ5LjA2MjUgMjA4LjY4NzUgMTU5LjA0NjkgMjA4LjY4NzUgUTE2OS4wMzEyIDIwOC42ODc1IDE3Ni4wNjI1IDE5Ni41OTM4IFExODMuMjM0NCAxODQuNSAxODMuMjM0NCAxNjAuMTcxOSBRMTgzLjIzNDQgMTM1Ljk4NDQgMTc2LjA2MjUgMTIzLjg5MDYgUTE2OS4wMzEyIDExMS43OTY5IDE1OS4wNDY5IDExMS43OTY5IFpNMTU5LjA0NjkgOTkuMjgxMiBRMTc3LjQ2ODggOTkuMjgxMiAxODkuNDIxOSAxMTQuODkwNiBRMjAxLjM3NSAxMzAuNSAyMDEuMzc1IDE2MC4xNzE5IFEyMDEuMzc1IDE4OS45ODQ0IDE4OS40MjE5IDIwNS41OTM4IFExNzcuNDY4OCAyMjEuMjAzMSAxNTkuMDQ2OSAyMjEuMjAzMSBRMTM2LjI2NTYgMjIxLjIwMzEgMTI2LjQyMTkgMjA1LjU5MzggUTExNi41NzgxIDE4OS45ODQ0IDExNi41NzgxIDE2MC4xNzE5IFExMTYuNTc4MSAxMzAuNSAxMjYuNDIxOSAxMTQuODkwNiBRMTM2LjI2NTYgOTkuMjgxMiAxNTkuMDQ2OSA5OS4yODEyIFpNODAuNTc4MSAyMTkuMDkzOCBMODAuNTc4MSAxMTcuNzAzMSBMNjEuODc1IDEyMy40Njg4IEw2MS44NzUgMTA3LjE1NjIgTDgxLjU2MjUgMTAxLjY3MTkgTDEwMC44MjgxIDEwMS42NzE5IEwxMDAuODI4MSAyMTkuMDkzOCBMODAuNTc4MSAyMTkuMDkzOCBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaNKXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk04OS4xNTYyIDEwMS42NzE5IEwxMDcuMDE1NiAxMDEuNjcxOSBMMTA3LjAxNTYgMTc4LjczNDQgUTEwNy4wMTU2IDE5OS42ODc1IDk3Ljg3NSAyMDkuNTMxMiBRODguODc1IDIxOS4yMzQ0IDY4Ljc2NTYgMjE5LjIzNDQgTDYxLjg3NSAyMTkuMjM0NCBMNjEuODc1IDIwNS43MzQ0IEw2Ny41IDIwNS43MzQ0IFE3OS4zMTI1IDIwNS43MzQ0IDg0LjIzNDQgMTk5LjgyODEgUTg5LjE1NjIgMTkzLjkyMTkgODkuMTU2MiAxNzguNzM0NCBMODkuMTU2MiAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaNRXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMDcuMjk2OSAyMjEuMDYyNSBRMTA2LjczNDQgMjIxLjA2MjUgMTA1LjUzOTEgMjIxLjEzMjggUTEwNC4zNDM4IDIyMS4yMDMxIDEwMy42NDA2IDIyMS4yMDMxIFE4MS40MjE5IDIyMS4yMDMxIDcwLjUyMzQgMjA2LjA4NTkgUTU5LjYyNSAxOTAuOTY4OCA1OS42MjUgMTYwLjMxMjUgUTU5LjYyNSAxMjkuNTE1NiA3MC41OTM4IDExNC4zOTg0IFE4MS41NjI1IDk5LjI4MTIgMTAzLjc4MTIgOTkuMjgxMiBRMTI2LjE0MDYgOTkuMjgxMiAxMzcuMTA5NCAxMTQuMzk4NCBRMTQ4LjA3ODEgMTI5LjUxNTYgMTQ4LjA3ODEgMTYwLjMxMjUgUTE0OC4wNzgxIDE4My41MTU2IDE0Mi4wMzEyIDE5Ny42NDg0IFExMzUuOTg0NCAyMTEuNzgxMiAxMjMuNjA5NCAyMTcuNDA2MiBMMTQxLjMyODEgMjMyLjMxMjUgTDEyNy45Njg4IDI0MC4xODc1IEwxMDcuMjk2OSAyMjEuMDYyNSBaTTEyOS4zNzUgMTYwLjMxMjUgUTEyOS4zNzUgMTM0LjQzNzUgMTIzLjM5ODQgMTIzLjMyODEgUTExNy40MjE5IDExMi4yMTg4IDEwMy43ODEyIDExMi4yMTg4IFE5MC4yODEyIDExMi4yMTg4IDg0LjMwNDcgMTIzLjMyODEgUTc4LjMyODEgMTM0LjQzNzUgNzguMzI4MSAxNjAuMzEyNSBRNzguMzI4MSAxODYuMTg3NSA4NC4zMDQ3IDE5Ny4yOTY5IFE5MC4yODEyIDIwOC40MDYyIDEwMy43ODEyIDIwOC40MDYyIFExMTcuNDIxOSAyMDguNDA2MiAxMjMuMzk4NCAxOTcuMjk2OSBRMTI5LjM3NSAxODYuMTg3NSAxMjkuMzc1IDE2MC4zMTI1IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZo0tcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTYxLjg3NSAxMDEuNjcxOSBMNzkuNzM0NCAxMDEuNjcxOSBMNzkuNzM0NCAxNTEuMzEyNSBMMTMwLjY0MDYgMTAxLjY3MTkgTDE1My43MDMxIDEwMS42NzE5IEw5Ni40Njg4IDE1Ni41MTU2IEwxNTguMzQzOCAyMTkuMjM0NCBMMTM0Ljg1OTQgMjE5LjIzNDQgTDc5LjczNDQgMTYyLjU2MjUgTDc5LjczNDQgMjE5LjIzNDQgTDYxLjg3NSAyMTkuMjM0NCBMNjEuODc1IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcblxcbiAgICA8dGFibGUgc3R5bGU9XFxcImJvcmRlci13aWR0aDoxcHhcXFwiPlxcbiAgICAgICAgPHRyIHdpZHRoPVxcXCIxMDAlXFxcIiBoZWlnaHQ9XFxcIjEwcHhcXFwiIHN0eWxlPVxcXCJ2aXNpYmlsaXR5OnZpc2libGVcXFwifT5cXG4gICAgICAgICAgICA8dGQgd2lkdGg9XFxcIjUwcHhcXFwiPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsdWVcXFwiPiZibG9jazs8L3NwYW4+PC9wbGF5aW5nLWNhcmQ8L3RkPlxcbiAgICAgICAgPC90cj5cXG4gICAgICAgIDx0ciB3aWR0aD1cXFwiMTAwJVxcXCI+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlcztBPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlczsyPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlczszPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlczs0PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlczs1PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlczs2PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlczs3PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlczs4PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlczs5PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlczsxMDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7Sjwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7UTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZzcGFkZXM7Szwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgPC90cj5cXG4gICAgICAgIDx0cj5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzO0E8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzI8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzM8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzQ8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzU8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzY8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzc8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzg8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzk8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzOzEwPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0cztKPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0cztRPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmhlYXJ0cztLPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICA8L3RyPlxcbiAgICAgICAgPHRyPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtcztBPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zOzI8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7Mzwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczs0PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zOzU8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7Njwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczs3PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zOzg8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7OTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczsxMDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtcztKPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zO1E8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7Szwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgPC90cj5cXG4gICAgICAgIDx0cj5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHVicztBPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7Mjwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzM8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczs0PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7NTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzY8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczs3PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7ODwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzk8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczsxMDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzO0o8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHVicztRPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7Szwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgPC90cj5cXG4gICAgPC90YWJsZT5cXG48L2Rpdj5cXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yYXctbG9hZGVyIS4vdmlld3MvcGFydGlhbHMvZnJlc2hkZWNrLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDI4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8cD5pbmRleDwvcD5cXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yYXctbG9hZGVyIS4vdmlld3MvcGFydGlhbHMvaW5kZXguaHRtbFxuLy8gbW9kdWxlIGlkID0gMjlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxmb3JtXFxuICAgIGlkPVxcXCJtZXNzYWdlX2Zvcm1cXFwiXFxuICAgIG9uc3VibWl0PVxcXCJcXG4gICAgIHZhciBndW4gPSBHdW4obG9jYXRpb24ub3JpZ2luICsgJy9ndW4nKTtcXG4gICAgIG9wZW5wZ3AuY29uZmlnLmFlYWRfcHJvdGVjdCA9IHRydWVcXG4gICAgIG9wZW5wZ3AuaW5pdFdvcmtlcih7IHBhdGg6Jy9qcy9vcGVucGdwLndvcmtlci5qcycgfSlcXG4gICAgIGlmICghbWVzc2FnZV90eHQudmFsdWUpIHtcXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXFxuICAgICB9XFxuICAgICB3aW5kb3cuaGFuZGxlUG9zdChtZXNzYWdlX3R4dC52YWx1ZSkob3BlbnBncCkod2luZG93LmxvY2FsU3RvcmFnZSkoJ3JveWFsZScpKGd1bikudGhlbihyZXN1bHQgPT4ge2lmIChyZXN1bHQpIHtjb25zb2xlLmxvZyhyZXN1bHQpfX0pLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKGVycikpO2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZXNzYWdlX3R4dCcpLnZhbHVlID0gJyc7IHJldHVybiBmYWxzZVxcXCJcXG4gICAgbWV0aG9kPVxcXCJwb3N0XFxcIlxcbiAgICBhY3Rpb249XFxcIi9tZXNzYWdlXFxcIj5cXG4gICAgPGlucHV0IGlkPVxcXCJtZXNzYWdlX2Zvcm1faW5wdXRcXFwiXFxuICAgICAgICB0eXBlPVxcXCJzdWJtaXRcXFwiXFxuICAgICAgICB2YWx1ZT1cXFwicG9zdCBtZXNzYWdlXFxcIlxcbiAgICAgICAgZm9ybT1cXFwibWVzc2FnZV9mb3JtXFxcIlxcbiAgICAgICAgPlxcbjwvZm9ybT5cXG48dGV4dGFyZWFcXG4gICAgaWQ9XFxcIm1lc3NhZ2VfdHh0XFxcIlxcbiAgICBuYW1lPVxcXCJtZXNzYWdlX3R4dFxcXCJcXG4gICAgZm9ybT1cXFwibWVzc2FnZV9mb3JtXFxcIlxcbiAgICByb3dzPTUxXFxuICAgIGNvbHM9NzBcXG4gICAgcGxhY2Vob2xkZXI9XFxcInBhc3RlIHBsYWludGV4dCBtZXNzYWdlLCBwdWJsaWMga2V5LCBvciBwcml2YXRlIGtleVxcXCJcXG4gICAgc3R5bGU9XFxcImZvbnQtZmFtaWx5Ok1lbmxvLENvbnNvbGFzLE1vbmFjbyxMdWNpZGEgQ29uc29sZSxMaWJlcmF0aW9uIE1vbm8sRGVqYVZ1IFNhbnMgTW9ubyxCaXRzdHJlYW0gVmVyYSBTYW5zIE1vbm8sQ291cmllciBOZXcsIG1vbm9zcGFjZTtcXFwiXFxuICAgID5cXG48L3RleHRhcmVhPlxcblwiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3Jhdy1sb2FkZXIhLi92aWV3cy9wYXJ0aWFscy9tZXNzYWdlX2Zvcm0uaHRtbFxuLy8gbW9kdWxlIGlkID0gMzBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxzcGFuIGNsYXNzPVxcXCJyb2FkbWFwXFxcIj5cXG4gICAgPGRldGFpbHM+XFxuICAgIDxzdW1tYXJ5PnJvYWQgbWFwPC9zdW1tYXJ5PlxcbiAgICA8dWw+XFxuICAgICAgICA8bGk+PGRlbD48YSBocmVmPVxcXCJodHRwczovL2dpdGh1Yi5jb20vY29sZWFsYm9uL2hvdGxpcHMvY29tbWl0LzNiNzA5ODFjYmU0ZTExZTE0MDBhZThlOTQ4YTA2ZTM1ODJkOWMyZDJcXFwiPkluc3RhbGwgbm9kZS9rb2Evd2VicGFjazwvYT48L2RlbD48L2xpPlxcbiAgICAgICAgPGxpPjxkZWw+PGEgaHJlZj1cXFwiaHR0cHM6Ly9naXRodWIuY29tL2NvbGVhbGJvbi9ob3RsaXBzL2lzc3Vlcy8yXFxcIj5JbnN0YWxsIGd1bmRiPC9hPjwvZGVsPjwvbGk+XFxuICAgICAgICA8bGk+PGRlbD5tYWtlIGEgPGEgaHJlZj1cXFwiIy9kZWNrXFxcIj5kZWNrPC9hPiBvZiBjYXJkczwvZGVsPjwvbGk+XFxuICAgICAgICA8bGk+PGRlbD5BbGljZSBhbmQgQm9iIDxhIGhyZWY9XFxcIiMvbWVzc2FnZVxcXCI+aWRlbnRpZnk8L2E+PC9kZWw+PC9saT5cXG4gICAgICAgIDxsaT48ZGVsPkFsaWNlIGFuZCBCb2IgPGEgaHJlZj1cXFwiIy9jb25uZWN0XFxcIj5jb25uZWN0PC9hPjwvZGVsPjwvbGk+XFxuICAgICAgICA8bGk+PGRlbD5BbGljZSBhbmQgQm9iIDxhIGhyZWY9XFxcImh0dHBzOi8vZ2l0aHViLmNvbS9jb2xlYWxib24vc3RyZWFtbGluZXJcXFwiPmV4Y2hhbmdlIGtleXM8L2E+PC9kZWw/PC9saT5cXG4gICAgICAgIDxsaT5BbGljZSBhbmQgQm9iIGFncmVlIG9uIGEgY2VydGFpbiBcXFwiPGEgaHJlZj1cXFwiIy9kZWNrXFxcIj5kZWNrPC9hPlxcXCIgb2YgY2FyZHMuIEluIHByYWN0aWNlLCB0aGlzIG1lYW5zIHRoZXkgYWdyZWUgb24gYSBzZXQgb2YgbnVtYmVycyBvciBvdGhlciBkYXRhIHN1Y2ggdGhhdCBlYWNoIGVsZW1lbnQgb2YgdGhlIHNldCByZXByZXNlbnRzIGEgY2FyZC48L2xpPlxcbiAgICAgICAgPGxpPkFsaWNlIHBpY2tzIGFuIGVuY3J5cHRpb24ga2V5IEEgYW5kIHVzZXMgdGhpcyB0byBlbmNyeXB0IGVhY2ggY2FyZCBvZiB0aGUgZGVjay48L2xpPlxcbiAgICAgICAgPGxpPkFsaWNlIDxhIGhyZWY9XFxcImh0dHBzOi8vYm9zdC5vY2tzLm9yZy9taWtlL3NodWZmbGUvXFxcIj5zaHVmZmxlczwvYT4gdGhlIGNhcmRzLjwvbGk+XFxuICAgICAgICA8bGk+QWxpY2UgcGFzc2VzIHRoZSBlbmNyeXB0ZWQgYW5kIHNodWZmbGVkIGRlY2sgdG8gQm9iLiBXaXRoIHRoZSBlbmNyeXB0aW9uIGluIHBsYWNlLCBCb2IgY2Fubm90IGtub3cgd2hpY2ggY2FyZCBpcyB3aGljaC48L2xpPlxcbiAgICAgICAgPGxpPkJvYiBzaHVmZmxlcyB0aGUgZGVjay48L2xpPlxcbiAgICAgICAgPGxpPkJvYiBwYXNzZXMgdGhlIGRvdWJsZSBlbmNyeXB0ZWQgYW5kIHNodWZmbGVkIGRlY2sgYmFjayB0byBBbGljZS48L2xpPlxcbiAgICAgICAgPGxpPkFsaWNlIGRlY3J5cHRzIGVhY2ggY2FyZCB1c2luZyBoZXIga2V5IEEuIFRoaXMgc3RpbGwgbGVhdmVzIEJvYidzIGVuY3J5cHRpb24gaW4gcGxhY2UgdGhvdWdoIHNvIHNoZSBjYW5ub3Qga25vdyB3aGljaCBjYXJkIGlzIHdoaWNoLjwvbGk+XFxuICAgICAgICA8bGk+QWxpY2UgcGlja3Mgb25lIGVuY3J5cHRpb24ga2V5IGZvciBlYWNoIGNhcmQgKEExLCBBMiwgZXRjLikgYW5kIGVuY3J5cHRzIHRoZW0gaW5kaXZpZHVhbGx5LjwvbGk+XFxuICAgICAgICA8bGk+QWxpY2UgcGFzc2VzIHRoZSBkZWNrIHRvIEJvYi48L2xpPlxcbiAgICAgICAgPGxpPkJvYiBkZWNyeXB0cyBlYWNoIGNhcmQgdXNpbmcgaGlzIGtleSBCLiBUaGlzIHN0aWxsIGxlYXZlcyBBbGljZSdzIGluZGl2aWR1YWwgZW5jcnlwdGlvbiBpbiBwbGFjZSB0aG91Z2ggc28gaGUgY2Fubm90IGtub3cgd2hpY2ggY2FyZCBpcyB3aGljaC48L2xpPlxcbiAgICAgICAgPGxpPkJvYiBwaWNrcyBvbmUgZW5jcnlwdGlvbiBrZXkgZm9yIGVhY2ggY2FyZCAoQjEsIEIyLCBldGMuKSBhbmQgZW5jcnlwdHMgdGhlbSBpbmRpdmlkdWFsbHkuPC9saT5cXG4gICAgICAgIDxsaT5Cb2IgcGFzc2VzIHRoZSBkZWNrIGJhY2sgdG8gQWxpY2UuPC9saT5cXG4gICAgICAgIDxsaT5BbGljZSBwdWJsaXNoZXMgdGhlIGRlY2sgZm9yIGV2ZXJ5b25lIHBsYXlpbmcgKGluIHRoaXMgY2FzZSBvbmx5IEFsaWNlIGFuZCBCb2IsIHNlZSBiZWxvdyBvbiBleHBhbnNpb24gdGhvdWdoKS48L2xpPlxcbiAgICA8L3VsPlxcbjwvZGV0YWlscz5cXG48L3NwYW4+XFxuXCJcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vcmF3LWxvYWRlciEuL3ZpZXdzL3BhcnRpYWxzL3JvYWRtYXAuaHRtbFxuLy8gbW9kdWxlIGlkID0gMzFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==