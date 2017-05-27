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
            // const PGPPUBKEY = 'PGPPubkey';
            var CLEARTEXT = 'cleartext';
            // const PGPPRIVKEY = 'PGPPrivkey';
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
                                        (0, _decryptPGPMessageWithKey.decryptPGPMessageWithKey)(openpgp)(storageItem)(password)(PGPMessageArmor).then(function (decrypted) {
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
    //  usage: decryptPGPMessageWithKey(openpgp)(privateKeyArmor)(password)(GPMessageArmor).then(result => result)
    return !openpgp ? Promise.reject('Error: missing openpgp') : function (privateKeyArmor) {
        return !privateKeyArmor ? Promise.reject('Error: missing privateKeyArmor') : function (password) {
            return !password ? Promise.reject('Error: missing password') : function (PGPMessageArmor) {
                return !PGPMessageArmor ? Promise.reject('Error: missing PGPMessageArmor') : new Promise(function (resolve, reject) {
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
exports.encryptCleartextMulti = encryptCleartextMulti;

var _getFromStorage = __webpack_require__(1);

var _determineContentType = __webpack_require__(0);

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
                                    encryptClearText(openpgp)(storageItem)(content).then(function (encrypted) {
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
/* 6 */
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
/* 7 */
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
/* 8 */
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
/* 9 */
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

var _encryptCleartextMulti = __webpack_require__(5);

var _decryptPGPMessage = __webpack_require__(2);

var _determineContentType = __webpack_require__(0);

var _savePGPPubkey = __webpack_require__(7);

var _savePGPPrivkey = __webpack_require__(6);

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

var _encryptCleartextMulti = __webpack_require__(5);

var _encryptClearText = __webpack_require__(10);

var _decryptPGPMessage = __webpack_require__(2);

var _savePGPPubkey = __webpack_require__(7);

var _savePGPPrivkey = __webpack_require__(6);

var _getFromStorage = __webpack_require__(1);

var _decryptPGPMessageWithKey = __webpack_require__(3);

var _rebelRouter = __webpack_require__(9);

var _gun = __webpack_require__(8);

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

module.exports = "<form\n    id=\"message_form\"\n    onsubmit=\"\n     var gun = Gun(location.origin + '/gun');\n     openpgp.config.aead_protect = true\n     openpgp.initWorker({ path:'/js/openpgp.worker.js' })\n     if (!message_txt.value) {\n          return false\n     }\n     window.handlePost(message_txt.value)(openpgp)(window.localStorage)('hotlips').then(result => {if (result) {console.log(result)}}).catch(err => console.error(err));document.getElementById('message_txt').value = ''; return false\"\n    method=\"post\"\n    action=\"/message\">\n    <input id=\"message_form_input\"\n        type=\"submit\"\n        value=\"post message\"\n        form=\"message_form\"\n        >\n</form>\n<textarea\n    id=\"message_txt\"\n    name=\"message_txt\"\n    form=\"message_form\"\n    rows=51\n    cols=70\n    placeholder=\"paste plaintext message, public key, or private key\"\n    style=\"font-family:Menlo,Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New, monospace;\"\n    >\n</textarea>\n"

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = "<span class=\"roadmap\">\n    <details>\n    <summary>road map</summary>\n    <ul>\n        <li><del><a href=\"https://github.com/colealbon/hotlips/commit/3b70981cbe4e11e1400ae8e948a06e3582d9c2d2\">Install node/koa/webpack</a></del></li>\n        <li><del><a href=\"https://github.com/colealbon/hotlips/issues/2\">Install gundb</a></del></li>\n        <li><del>make a <a href=\"#/deck\">deck</a> of cards</del></li>\n        <li><del>Alice and Bob <a href=\"#/message\">identify</a></del></li>\n        <li><del>Alice and Bob <a href=\"#/connect\">connect</a></del></li>\n        <li><del>Alice and Bob <a href=\"https://github.com/colealbon/streamliner\">exchange keys</a></del?</li>\n        <li>Alice and Bob agree on a certain \"<a href=\"#/deck\">deck</a>\" of cards. In practice, this means they agree on a set of numbers or other data such that each element of the set represents a card.</li>\n        <li>Alice picks an encryption key A and uses this to encrypt each card of the deck.</li>\n        <li>Alice <a href=\"https://bost.ocks.org/mike/shuffle/\">shuffles</a> the cards.</li>\n        <li>Alice passes the encrypted and shuffled deck to Bob. With the encryption in place, Bob cannot know which card is which.</li>\n        <li>Bob shuffles the deck.</li>\n        <li>Bob passes the double encrypted and shuffled deck back to Alice.</li>\n        <li>Alice decrypts each card using her key A. This still leaves Bob's encryption in place though so she cannot know which card is which.</li>\n        <li>Alice picks one encryption key for each card (A1, A2, etc.) and encrypts them individually.</li>\n        <li>Alice passes the deck to Bob.</li>\n        <li>Bob decrypts each card using his key B. This still leaves Alice's individual encryption in place though so he cannot know which card is which.</li>\n        <li>Bob picks one encryption key for each card (B1, B2, etc.) and encrypts them individually.</li>\n        <li>Bob passes the deck back to Alice.</li>\n        <li>Alice publishes the deck for everyone playing (in this case only Alice and Bob, see below on expansion though).</li>\n    </ul>\n</details>\n</span>\n"

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYmZhNTA0MWYwYzA1ZWU1MzNiOWMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9kZXRlcm1pbmVDb250ZW50VHlwZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL2dldEZyb21TdG9yYWdlLmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvZGVjcnlwdFBHUE1lc3NhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9kZWNyeXB0UEdQTWVzc2FnZVdpdGhLZXkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9kZXRlcm1pbmVLZXlUeXBlLmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvZW5jcnlwdENsZWFydGV4dE11bHRpLmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvc2F2ZVBHUFByaXZrZXkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9zYXZlUEdQUHVia2V5LmpzIiwid2VicGFjazovLy8uL34vZ3VuL2d1bi5qcyIsIndlYnBhY2s6Ly8vLi9+L3JlYmVsLXJvdXRlci9zcmMvcmViZWwtcm91dGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvZW5jcnlwdENsZWFyVGV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL2hhbmRsZVBvc3QuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2Nvbm5lY3QuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2NvbnRhY3QuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2RlY2suanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhZ2VzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9tZXNzYWdlLmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlcy9yb2FkbWFwLmpzIiwid2VicGFjazovLy8uL34vcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL21vZHVsZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vdmlld3MvcGFydGlhbHMvY29ubmVjdC5odG1sIiwid2VicGFjazovLy8uL3ZpZXdzL3BhcnRpYWxzL2NvbnRhY3QuaHRtbCIsIndlYnBhY2s6Ly8vLi92aWV3cy9wYXJ0aWFscy9mcmVzaGRlY2suaHRtbCIsIndlYnBhY2s6Ly8vLi92aWV3cy9wYXJ0aWFscy9pbmRleC5odG1sIiwid2VicGFjazovLy8uL3ZpZXdzL3BhcnRpYWxzL21lc3NhZ2VfZm9ybS5odG1sIiwid2VicGFjazovLy8uL3ZpZXdzL3BhcnRpYWxzL3JvYWRtYXAuaHRtbCJdLCJuYW1lcyI6WyJkZXRlcm1pbmVDb250ZW50VHlwZSIsImNvbnRlbnQiLCJQcm9taXNlIiwicmVzb2x2ZSIsIm9wZW5wZ3AiLCJyZWplY3QiLCJDTEVBUlRFWFQiLCJQR1BNRVNTQUdFIiwicG9zc2libGVwZ3BrZXkiLCJrZXkiLCJyZWFkQXJtb3JlZCIsImtleXMiLCJ0aGVuIiwia2V5VHlwZSIsIm1lc3NhZ2UiLCJlcnIiLCJnZXRGcm9tU3RvcmFnZSIsImxvY2FsU3RvcmFnZSIsImluZGV4S2V5IiwiaSIsImxlbmd0aCIsImtleUFyciIsInB1c2giLCJnZXRJdGVtIiwiZGVjcnlwdFBHUE1lc3NhZ2UiLCJQR1BQUklWS0VZIiwicGFzc3dvcmQiLCJQR1BNZXNzYWdlQXJtb3IiLCJzdG9yZUFyciIsImZpbHRlciIsInN0b3JhZ2VJdGVtIiwibWFwIiwiY29udGVudFR5cGUiLCJkZWNyeXB0ZWQiLCJkZWNyeXB0UEdQTWVzc2FnZVdpdGhLZXkiLCJwcml2YXRlS2V5QXJtb3IiLCJwcml2YXRlS2V5cyIsInByaXZhdGVLZXkiLCJkZWNyeXB0IiwiZGVjcnlwdE1lc3NhZ2UiLCJyZXN1bHQiLCJkYXRhIiwiZGV0ZXJtaW5lS2V5VHlwZSIsIlBHUFBVQktFWSIsInRvUHVibGljIiwiYXJtb3IiLCJlcnJvciIsImVuY3J5cHRDbGVhcnRleHRNdWx0aSIsInN0b3JhZ2VBcnIiLCJlbmNyeXB0ZWRNc2dzIiwiaWR4IiwiZW5jcnlwdENsZWFyVGV4dCIsImVuY3J5cHRlZCIsIkVycm9yIiwic2F2ZVBHUFByaXZrZXkiLCJQR1BrZXlBcm1vciIsIlBHUGtleSIsInNldEl0ZW0iLCJ1c2VycyIsInVzZXJJZCIsInVzZXJpZCIsInByb2Nlc3MiLCJzZXRJbW1lZGlhdGUiLCJzYXZlUEdQUHVia2V5IiwiZXhpc3RpbmdLZXkiLCJleGlzdGluZ0tleVR5cGUiLCJjYXRjaCIsInJvb3QiLCJ3aW5kb3ciLCJnbG9iYWwiLCJjb25zb2xlIiwibG9nIiwicmVxdWlyZSIsImFyZyIsInNsaWNlIiwibW9kIiwicGF0aCIsImV4cG9ydHMiLCJzcGxpdCIsInRvU3RyaW5nIiwicmVwbGFjZSIsImNvbW1vbiIsIm1vZHVsZSIsIlR5cGUiLCJmbnMiLCJmbiIsImlzIiwiYmkiLCJiIiwiQm9vbGVhbiIsIm51bSIsIm4iLCJsaXN0X2lzIiwicGFyc2VGbG9hdCIsIkluZmluaXR5IiwidGV4dCIsInQiLCJpZnkiLCJKU09OIiwic3RyaW5naWZ5IiwicmFuZG9tIiwibCIsImMiLCJzIiwiY2hhckF0IiwiTWF0aCIsImZsb29yIiwibWF0Y2giLCJvIiwiciIsIm9iaiIsImhhcyIsInRvTG93ZXJDYXNlIiwibGlzdCIsIm0iLCJpbmRleE9mIiwiZnV6enkiLCJmIiwiQXJyYXkiLCJzbGl0IiwicHJvdG90eXBlIiwic29ydCIsImsiLCJBIiwiQiIsIl8iLCJvYmpfbWFwIiwiaW5kZXgiLCJPYmplY3QiLCJjb25zdHJ1Y3RvciIsImNhbGwiLCJwdXQiLCJ2IiwiaGFzT3duUHJvcGVydHkiLCJkZWwiLCJhcyIsInUiLCJvYmpfaXMiLCJwYXJzZSIsImUiLCJvYmpfaGFzIiwidG8iLCJmcm9tIiwiY29weSIsImVtcHR5IiwiYXJndW1lbnRzIiwieCIsImxsIiwibGxlIiwiZm5faXMiLCJpaSIsInRpbWUiLCJEYXRlIiwiZ2V0VGltZSIsIm9udG8iLCJ0YWciLCJuZXh0IiwiRnVuY3Rpb24iLCJiZSIsIm9mZiIsInRoZSIsImxhc3QiLCJiYWNrIiwib24iLCJPbiIsIkNoYWluIiwiY3JlYXRlIiwib3B0IiwiaWQiLCJyaWQiLCJ1dWlkIiwic3R1biIsImNoYWluIiwiZXYiLCJza2lwIiwiY2IiLCJyZXMiLCJxdWV1ZSIsInRtcCIsInEiLCJhY3QiLCJhdCIsImN0eCIsImFzayIsInNjb3BlIiwiYWNrIiwicmVwbHkiLCJvbnMiLCJldmVudCIsIkd1biIsImlucHV0IiwiZW1pdCIsImFwcGx5IiwiY29uY2F0IiwiZ3VuIiwic291bCIsInN0YXRlIiwid2FpdGluZyIsIndoZW4iLCJzb29uZXN0Iiwic2V0IiwiZnV0dXJlIiwibm93IiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsImNoZWNrIiwiZWFjaCIsIndhaXQiLCJIQU0iLCJtYWNoaW5lU3RhdGUiLCJpbmNvbWluZ1N0YXRlIiwiY3VycmVudFN0YXRlIiwiaW5jb21pbmdWYWx1ZSIsImN1cnJlbnRWYWx1ZSIsImRlZmVyIiwiaGlzdG9yaWNhbCIsImNvbnZlcmdlIiwiaW5jb21pbmciLCJMZXhpY2FsIiwiY3VycmVudCIsInVuZGVmaW5lZCIsIlZhbCIsInRleHRfaXMiLCJiaV9pcyIsIm51bV9pcyIsInJlbCIsInJlbF8iLCJvYmpfcHV0IiwiTm9kZSIsInNvdWxfIiwidGV4dF9yYW5kb20iLCJub2RlIiwib2JqX2RlbCIsIlN0YXRlIiwicGVyZiIsInN0YXJ0IiwiTiIsImRyaWZ0IiwiRCIsInBlcmZvcm1hbmNlIiwidGltaW5nIiwibmF2aWdhdGlvblN0YXJ0IiwiTl8iLCJvYmpfYXMiLCJ2YWwiLCJvYmpfY29weSIsIkdyYXBoIiwiZyIsIm9ial9lbXB0eSIsIm5mIiwiZW52IiwiZ3JhcGgiLCJzZWVuIiwidmFsaWQiLCJwcmV2IiwiaW52YWxpZCIsImpvaW4iLCJhcnIiLCJEdXAiLCJjYWNoZSIsInRyYWNrIiwiZ2MiLCJkZSIsIm9sZGVzdCIsIm1heEFnZSIsIm1pbiIsImRvbmUiLCJlbGFwc2VkIiwibmV4dEdDIiwidmVyc2lvbiIsInRvSlNPTiIsImR1cCIsInNjaGVkdWxlIiwiZmllbGQiLCJ2YWx1ZSIsIm9uY2UiLCJjYXQiLCJjb2F0Iiwib2JqX3RvIiwiZ2V0IiwibWFjaGluZSIsInZlcmlmeSIsIm1lcmdlIiwiZGlmZiIsInZlcnRleCIsIndhcyIsImtub3duIiwicmVmIiwiX3NvdWwiLCJfZmllbGQiLCJob3ciLCJwZWVycyIsInVybCIsIndzYyIsInByb3RvY29scyIsInJlbF9pcyIsImRlYnVnIiwidyIsInllcyIsIm91dHB1dCIsInN5bnRoIiwicHJveHkiLCJjaGFuZ2UiLCJlY2hvIiwibm90IiwicmVsYXRlIiwibm9kZV8iLCJyZXZlcmIiLCJ2aWEiLCJ1c2UiLCJvdXQiLCJjYXAiLCJub29wIiwiYW55IiwiYmF0Y2giLCJubyIsImlpZmUiLCJtZXRhIiwiX18iLCJ1bmlvbiIsInN0YXRlX2lzIiwiY3MiLCJpdiIsImN2IiwidmFsX2lzIiwic3RhdGVfaWZ5IiwiZGVsdGEiLCJzeW50aF8iLCJub2RlX3NvdWwiLCJub2RlX2lzIiwibm9kZV9pZnkiLCJlYXMiLCJzdWJzIiwiYmluZCIsIm9rIiwiYXN5bmMiLCJvdWdodCIsIm5lZWQiLCJpbXBsZW1lbnQiLCJmaWVsZHMiLCJuXyIsIml0ZW0iLCJzdG9yZSIsInJlbW92ZUl0ZW0iLCJkaXJ0eSIsImNvdW50IiwibWF4IiwicHJlZml4Iiwic2F2ZSIsImFsbCIsImxleCIsIldlYlNvY2tldCIsIndlYmtpdFdlYlNvY2tldCIsIm1veldlYlNvY2tldCIsIndzcCIsInVkcmFpbiIsInNlbmQiLCJwZWVyIiwibXNnIiwid2lyZSIsIm9wZW4iLCJyZWFkeVN0YXRlIiwiT1BFTiIsInJlY2VpdmUiLCJib2R5Iiwib25jbG9zZSIsInJlY29ubmVjdCIsIm9uZXJyb3IiLCJjb2RlIiwib25vcGVuIiwib25tZXNzYWdlIiwiUmViZWxSb3V0ZXIiLCJfcHJlZml4IiwicHJldmlvdXNQYXRoIiwiYmFzZVBhdGgiLCJvcHRpb25zIiwiZ2V0QXR0cmlidXRlIiwiaW5oZXJpdCIsIiRlbGVtZW50IiwicGFyZW50Tm9kZSIsIm5vZGVOYW1lIiwicm91dGUiLCJyb3V0ZXMiLCIkY2hpbGRyZW4iLCJjaGlsZHJlbiIsIiRjaGlsZCIsIiR0ZW1wbGF0ZSIsImlubmVySFRNTCIsInNoYWRvd1Jvb3QiLCJjcmVhdGVTaGFkb3dSb290IiwiYW5pbWF0aW9uIiwiaW5pdEFuaW1hdGlvbiIsInJlbmRlciIsInBhdGhDaGFuZ2UiLCJpc0JhY2siLCJjbGFzc0xpc3QiLCJhZGQiLCJyZW1vdmUiLCJvYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJtdXRhdGlvbnMiLCJhZGRlZE5vZGVzIiwib3RoZXJDaGlsZHJlbiIsImdldE90aGVyQ2hpbGRyZW4iLCJmb3JFYWNoIiwiY2hpbGQiLCJhbmltYXRpb25FbmQiLCJ0YXJnZXQiLCJjbGFzc05hbWUiLCJyZW1vdmVDaGlsZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJvYnNlcnZlIiwiY2hpbGRMaXN0IiwiZ2V0UGF0aEZyb21VcmwiLCJyZWdleFN0cmluZyIsInJlZ2V4IiwiUmVnRXhwIiwidGVzdCIsIl9yb3V0ZVJlc3VsdCIsImNvbXBvbmVudCIsIiRjb21wb25lbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJwYXJhbXMiLCJzZXRBdHRyaWJ1dGUiLCJhcHBlbmRDaGlsZCIsInRlbXBsYXRlIiwiYSIsInJlc3VsdHMiLCJxdWVyeVN0cmluZyIsInN1YnN0ciIsInBhcnQiLCJlcSIsImRlY29kZVVSSUNvbXBvbmVudCIsInN1YnN0cmluZyIsIkNsYXNzIiwibmFtZSIsInZhbGlkRWxlbWVudFRhZyIsIkhUTUxFbGVtZW50IiwiY2xhc3NUb1RhZyIsImlzUmVnaXN0ZXJlZEVsZW1lbnQiLCJyZWdpc3RlckVsZW1lbnQiLCJjYWxsYmFjayIsImNoYW5nZUNhbGxiYWNrcyIsImNoYW5nZUhhbmRsZXIiLCJsb2NhdGlvbiIsImhyZWYiLCJvbGRVUkwiLCJvbmhhc2hjaGFuZ2UiLCJwYXJzZVF1ZXJ5U3RyaW5nIiwicmUiLCJleGVjIiwicmVzdWx0czIiLCJSZWJlbFJvdXRlIiwiUmViZWxEZWZhdWx0IiwiUmViZWxCYWNrQSIsInByZXZlbnREZWZhdWx0IiwiZGlzcGF0Y2hFdmVudCIsIkN1c3RvbUV2ZW50IiwiaGFzaCIsIkhUTUxBbmNob3JFbGVtZW50IiwiZXh0ZW5kcyIsImdldFBhcmFtc0Zyb21VcmwiLCJwdWJsaWNLZXlBcm1vciIsImNsZWFydGV4dCIsIlBHUFB1YmtleSIsImVuY3J5cHRNZXNzYWdlIiwiZW5jcnlwdGVkdHh0IiwicHVibGljS2V5cyIsImVuY3J5cHQiLCJjaXBoZXJ0ZXh0IiwiaGFuZGxlUG9zdCIsImNvbm5lY3RQYXJ0aWFsIiwiQ29ubmVjdFBhZ2UiLCJjb250YWN0UGFydGlhbCIsIkNvbnRhY3RQYWdlIiwiZnJlc2hEZWNrUGFydGlhbCIsIkRlY2tQYWdlIiwiY3JlYXRlZENhbGxiYWNrIiwicXVlcnlTZWxlY3RvciIsInRleHRDb250ZW50IiwiY2xvbmUiLCJpbXBvcnROb2RlIiwiY29sb3JPdmVycmlkZSIsInN0eWxlIiwiY29sb3IiLCJmaWxsIiwiaW5kZXhQYXJ0aWFsIiwiSW5kZXhQYWdlIiwiY2xpZW50UHVia2V5Rm9ybVBhcnRpYWwiLCJNZXNzYWdlUGFnZSIsInJvYWRtYXBQYXJ0aWFsIiwiUm9hZG1hcFBhZ2UiLCJjYWNoZWRTZXRUaW1lb3V0IiwiY2FjaGVkQ2xlYXJUaW1lb3V0IiwiZGVmYXVsdFNldFRpbW91dCIsImRlZmF1bHRDbGVhclRpbWVvdXQiLCJydW5UaW1lb3V0IiwiZnVuIiwicnVuQ2xlYXJUaW1lb3V0IiwibWFya2VyIiwiZHJhaW5pbmciLCJjdXJyZW50UXVldWUiLCJxdWV1ZUluZGV4IiwiY2xlYW5VcE5leHRUaWNrIiwiZHJhaW5RdWV1ZSIsInRpbWVvdXQiLCJsZW4iLCJydW4iLCJuZXh0VGljayIsImFyZ3MiLCJJdGVtIiwiYXJyYXkiLCJ0aXRsZSIsImJyb3dzZXIiLCJhcmd2IiwidmVyc2lvbnMiLCJhZGRMaXN0ZW5lciIsInJlbW92ZUxpc3RlbmVyIiwicmVtb3ZlQWxsTGlzdGVuZXJzIiwicHJlcGVuZExpc3RlbmVyIiwicHJlcGVuZE9uY2VMaXN0ZW5lciIsImxpc3RlbmVycyIsImJpbmRpbmciLCJjd2QiLCJjaGRpciIsImRpciIsInVtYXNrIiwiZXZhbCIsIndlYnBhY2tQb2x5ZmlsbCIsImRlcHJlY2F0ZSIsInBhdGhzIiwiZGVmaW5lUHJvcGVydHkiLCJlbnVtZXJhYmxlIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7O0FDaEVBOzs7OztRQUlnQkEsb0IsR0FBQUEsb0I7O0FBRmhCOztBQUVPLFNBQVNBLG9CQUFULENBQThCQyxPQUE5QixFQUF1QztBQUMxQztBQUNBLFdBQVEsQ0FBQ0EsT0FBRixHQUNQQyxRQUFRQyxPQUFSLENBQWdCLEVBQWhCLENBRE8sR0FFUCxVQUFDQyxPQUFELEVBQWE7QUFDVCxlQUFRLENBQUNBLE9BQUYsR0FDUEYsUUFBUUcsTUFBUixDQUFlLHdCQUFmLENBRE8sR0FFUCxJQUFJSCxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVRSxNQUFWLEVBQXFCO0FBQzdCO0FBQ0EsZ0JBQU1DLFlBQVksV0FBbEI7QUFDQTtBQUNBLGdCQUFNQyxhQUFhLFlBQW5CO0FBQ0EsZ0JBQUlDLGlCQUFpQkosUUFBUUssR0FBUixDQUFZQyxXQUFaLENBQXdCVCxP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NkZBQTZGLDZGQUE2Riw2RkFBNkYsNkZBQTZGLDhGQUE4Riw2RkFBNkYsNkZBQTZGLDRIQUE0SCwrRkFBK0YsK0ZBQStGLCtGQUErRiwrRkFBK0YsK0ZBQStGLCtGQUErRiwrRkFBK0YsK0ZBQStGLCtGQUErRixnR0FBZ0csK0ZBQStGLCtGQUErRixvRTs7Ozs7O0FDQS9pcUYsaUM7Ozs7OztBQ0FBLGdIQUFnSCxvRUFBb0UsK0JBQStCLGlDQUFpQyxnQ0FBZ0MscUdBQXFHLGFBQWEscUJBQXFCLG1DQUFtQyxrREFBa0QsMmhCQUEyaEIseUI7Ozs7OztBQ0EzZ0MseW5FIiwiZmlsZSI6InJveWFsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMjEpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGJmYTUwNDFmMGMwNWVlNTMzYjljIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2RldGVybWluZUtleVR5cGV9IGZyb20gJy4vZGV0ZXJtaW5lS2V5VHlwZS5qcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXRlcm1pbmVDb250ZW50VHlwZShjb250ZW50KSB7XG4gICAgLy8gdXNhZ2U6IGRldGVybWluZUNvbnRlbnRUeXBlKGNvbnRlbnQpKG9wZW5wZ3ApLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbiAgICByZXR1cm4gKCFjb250ZW50KSA/XG4gICAgUHJvbWlzZS5yZXNvbHZlKCcnKTpcbiAgICAob3BlbnBncCkgPT4ge1xuICAgICAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBvcGVucGdwJyk6XG4gICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIC8vIGNvbnN0IFBHUFBVQktFWSA9ICdQR1BQdWJrZXknO1xuICAgICAgICAgICAgY29uc3QgQ0xFQVJURVhUID0gJ2NsZWFydGV4dCc7XG4gICAgICAgICAgICAvLyBjb25zdCBQR1BQUklWS0VZID0gJ1BHUFByaXZrZXknO1xuICAgICAgICAgICAgY29uc3QgUEdQTUVTU0FHRSA9ICdQR1BNZXNzYWdlJztcbiAgICAgICAgICAgIGxldCBwb3NzaWJsZXBncGtleSA9IG9wZW5wZ3Aua2V5LnJlYWRBcm1vcmVkKGNvbnRlbnQpO1xuICAgICAgICAgICAgaWYgKHBvc3NpYmxlcGdwa2V5LmtleXNbMF0pIHtcbiAgICAgICAgICAgICAgICBkZXRlcm1pbmVLZXlUeXBlKGNvbnRlbnQpKG9wZW5wZ3ApXG4gICAgICAgICAgICAgICAgLnRoZW4oKGtleVR5cGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShrZXlUeXBlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgb3BlbnBncC5tZXNzYWdlLnJlYWRBcm1vcmVkKGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKFBHUE1FU1NBR0UpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKENMRUFSVEVYVCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvZGV0ZXJtaW5lQ29udGVudFR5cGUuanMiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRGcm9tU3RvcmFnZShsb2NhbFN0b3JhZ2UpIHtcbiAgICAvLyB1c2FnZTogZ2V0RnJvbVN0b3JhZ2UobG9jYWxTdG9yYWdlKShba2V5XSkudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgIHJldHVybiAoIWxvY2FsU3RvcmFnZSkgP1xuICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBsb2NhbFN0b3JhZ2UnKTpcbiAgICAoaW5kZXhLZXkpID0+IHtcbiAgICAgICAgcmV0dXJuICghaW5kZXhLZXkpID9cbiAgICAgICAgLy8gbm8gaW5kZXggLT4gcmV0dXJuIGV2ZXJ5dGhpbmdcbiAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsZXQgaSA9IGxvY2FsU3RvcmFnZS5sZW5ndGhcbiAgICAgICAgICAgICAgICBsZXQga2V5QXJyID0gW11cbiAgICAgICAgICAgICAgICB3aGlsZSAoaSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGkgPSBpIC0gMVxuICAgICAgICAgICAgICAgICAgICBrZXlBcnIucHVzaChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShsb2NhbFN0b3JhZ2Uua2V5KGkpKSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoa2V5QXJyKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pOlxuICAgICAgICAvLyBpbmRleCBwcm92aWRlZCAtPiByZXR1cm4gb25lXG4gICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShpbmRleEtleSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGliL2dldEZyb21TdG9yYWdlLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2dldEZyb21TdG9yYWdlfSBmcm9tICcuL2dldEZyb21TdG9yYWdlJztcbmltcG9ydCB7ZGVjcnlwdFBHUE1lc3NhZ2VXaXRoS2V5fSBmcm9tICcuLi8uLi9zcmMvbGliL2RlY3J5cHRQR1BNZXNzYWdlV2l0aEtleS5qcyc7XG5pbXBvcnQge2RldGVybWluZUNvbnRlbnRUeXBlfSBmcm9tICcuLi8uLi9zcmMvbGliL2RldGVybWluZUNvbnRlbnRUeXBlLmpzJztcblxuY29uc3QgUEdQUFJJVktFWSA9ICdQR1BQcml2a2V5JztcblxuZXhwb3J0IGZ1bmN0aW9uIGRlY3J5cHRQR1BNZXNzYWdlKG9wZW5wZ3ApIHtcbiAgICAvLyAgdXNhZ2U6IGRlY3J5cHRQR1BNZXNzYWdlKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSkocGFzc3dvcmQpKFBHUE1lc3NhZ2VBcm1vcikudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgIHJldHVybiAoIW9wZW5wZ3ApID9cbiAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgIChsb2NhbFN0b3JhZ2UpID0+IHtcbiAgICAgICAgcmV0dXJuICghbG9jYWxTdG9yYWdlKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBsb2NhbFN0b3JhZ2UnKTpcbiAgICAgICAgKHBhc3N3b3JkKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCFwYXNzd29yZCkgP1xuICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QoXCJFcnJvcjogbWlzc2luZyBwYXNzd29yZFwiKTpcbiAgICAgICAgICAgIChQR1BNZXNzYWdlQXJtb3IpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKCFQR1BNZXNzYWdlQXJtb3IpID9cbiAgICAgICAgICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgUEdQTWVzc2FnZUFybW9yJyk6XG4gICAgICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBnZXRGcm9tU3RvcmFnZShsb2NhbFN0b3JhZ2UpKClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oc3RvcmVBcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RvcmVBcnJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKHN0b3JhZ2VJdGVtID0+ICghc3RvcmFnZUl0ZW0pID8gZmFsc2UgOiB0cnVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoc3RvcmFnZUl0ZW0gPT4gZGV0ZXJtaW5lQ29udGVudFR5cGUoc3RvcmFnZUl0ZW0pKG9wZW5wZ3ApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGNvbnRlbnRUeXBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50VHlwZSA9PT0gUEdQUFJJVktFWSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlY3J5cHRQR1BNZXNzYWdlV2l0aEtleShvcGVucGdwKShzdG9yYWdlSXRlbSkocGFzc3dvcmQpKFBHUE1lc3NhZ2VBcm1vcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihkZWNyeXB0ZWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRlY3J5cHRlZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGliL2RlY3J5cHRQR1BNZXNzYWdlLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgZnVuY3Rpb24gZGVjcnlwdFBHUE1lc3NhZ2VXaXRoS2V5KG9wZW5wZ3ApIHtcbiAgICAvLyAgdXNhZ2U6IGRlY3J5cHRQR1BNZXNzYWdlV2l0aEtleShvcGVucGdwKShwcml2YXRlS2V5QXJtb3IpKHBhc3N3b3JkKShHUE1lc3NhZ2VBcm1vcikudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgIHJldHVybiAoIW9wZW5wZ3ApID9cbiAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgIChwcml2YXRlS2V5QXJtb3IpID0+IHtcbiAgICAgICAgcmV0dXJuICghcHJpdmF0ZUtleUFybW9yKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBwcml2YXRlS2V5QXJtb3InKTpcbiAgICAgICAgKHBhc3N3b3JkKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCFwYXNzd29yZCkgP1xuICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIHBhc3N3b3JkJyk6XG4gICAgICAgICAgICAoUEdQTWVzc2FnZUFybW9yKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICghUEdQTWVzc2FnZUFybW9yKSA/XG4gICAgICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIFBHUE1lc3NhZ2VBcm1vcicpOlxuICAgICAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwcml2YXRlS2V5cyA9IG9wZW5wZ3Aua2V5LnJlYWRBcm1vcmVkKHByaXZhdGVLZXlBcm1vcilcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwcml2YXRlS2V5ID0gcHJpdmF0ZUtleXMua2V5c1swXVxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpdmF0ZUtleS5kZWNyeXB0KHBhc3N3b3JkKVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1lc3NhZ2UgPSBvcGVucGdwLm1lc3NhZ2UucmVhZEFybW9yZWQoUEdQTWVzc2FnZUFybW9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICghb3BlbnBncC5kZWNyeXB0KSA/XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVucGdwLmRlY3J5cHRNZXNzYWdlKHByaXZhdGVLZXksIG1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApOlxuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbnBncC5kZWNyeXB0KHsgJ21lc3NhZ2UnOiBtZXNzYWdlLCAncHJpdmF0ZUtleSc6IHByaXZhdGVLZXkgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xpYi9kZWNyeXB0UEdQTWVzc2FnZVdpdGhLZXkuanMiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXRlcm1pbmVLZXlUeXBlKGNvbnRlbnQpIHtcbiAgICByZXR1cm4gKCFjb250ZW50KSA/XG4gICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIHBncEtleScpOlxuICAgIChvcGVucGdwKSA9PiB7XG4gICAgICAgIHJldHVybiAoIW9wZW5wZ3ApID9cbiAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIG9wZW5wZ3AnKTpcbiAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgUEdQUFVCS0VZID0gJ1BHUFB1YmtleSc7XG4gICAgICAgICAgICBjb25zdCBQR1BQUklWS0VZID0gJ1BHUFByaXZrZXknO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsZXQgcHJpdmF0ZUtleXMgPSBvcGVucGdwLmtleS5yZWFkQXJtb3JlZChjb250ZW50KVxuICAgICAgICAgICAgICAgIGxldCBwcml2YXRlS2V5ID0gcHJpdmF0ZUtleXMua2V5c1swXVxuICAgICAgICAgICAgICAgIGlmIChwcml2YXRlS2V5LnRvUHVibGljKCkuYXJtb3IoKSAhPT0gcHJpdmF0ZUtleS5hcm1vcigpICkge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKFBHUFBSSVZLRVkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoUEdQUFVCS0VZKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xpYi9kZXRlcm1pbmVLZXlUeXBlLmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2dldEZyb21TdG9yYWdlfSBmcm9tICcuL2dldEZyb21TdG9yYWdlJztcbmltcG9ydCB7ZGV0ZXJtaW5lQ29udGVudFR5cGV9IGZyb20gJy4vZGV0ZXJtaW5lQ29udGVudFR5cGUnO1xuXG5jb25zdCBQR1BQVUJLRVkgPSAnUEdQUHVia2V5JztcblxuZXhwb3J0IGZ1bmN0aW9uIGVuY3J5cHRDbGVhcnRleHRNdWx0aShjb250ZW50KSB7XG4gICAgLy8gdXNhZ2U6IGVuY3J5cHRDbGVhcnRleHRNdWx0aShjb250ZW50KShvcGVucGdwKShsb2NhbFN0b3JhZ2UpLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbiAgICByZXR1cm4gKCFjb250ZW50KSA/XG4gICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIGNvbnRlbnQnKTpcbiAgICAob3BlbnBncCkgPT4ge1xuICAgICAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBvcGVucGdwJyk6XG4gICAgICAgIChsb2NhbFN0b3JhZ2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoIWxvY2FsU3RvcmFnZSkgP1xuICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIGxvY2FsU3RvcmFnZScpOlxuICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGdldEZyb21TdG9yYWdlKGxvY2FsU3RvcmFnZSkoKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoc3RvcmFnZUFycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9sZXQgcHVibGljS2V5QXJyID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZW5jcnlwdGVkTXNncyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGkgPSBzdG9yYWdlQXJyLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpZHggPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmFnZUFyclxuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgoc3RvcmFnZUl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpLS07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0b3JhZ2VJdGVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoc3RvcmFnZUl0ZW0gPT4gKCFzdG9yYWdlSXRlbSkgPyBmYWxzZSA6IHRydWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKChzdG9yYWdlSXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldGVybWluZUNvbnRlbnRUeXBlKHN0b3JhZ2VJdGVtKShvcGVucGdwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChjb250ZW50VHlwZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudFR5cGUgPT09IFBHUFBVQktFWSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5jcnlwdENsZWFyVGV4dChvcGVucGdwKShzdG9yYWdlSXRlbSkoY29udGVudClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChlbmNyeXB0ZWQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmNyeXB0ZWRNc2dzW2lkeF0gPSBlbmNyeXB0ZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWR4Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShlbmNyeXB0ZWRNc2dzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCAobmV3IEVycm9yIChlcnIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xpYi9lbmNyeXB0Q2xlYXJ0ZXh0TXVsdGkuanMiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlUEdQUHJpdmtleShQR1BrZXlBcm1vcikge1xuICAgIC8vIHNhdmUgcHJpdmF0ZSBrZXkgdG8gc3RvcmFnZSBubyBxdWVzdGlvbnMgYXNrZWRcbiAgICAvLyB1c2FnZTogc2F2ZVBHUFByaXZrZXkoY29udGVudCkob3BlbnBncCkobG9jYWxTdG9yYWdlKS50aGVuKHJlc3VsdCA9PiByZXN1bHQpXG4gICAgcmV0dXJuICghUEdQa2V5QXJtb3IpID9cbiAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3NpbmcgUEdQa2V5QXJtb3InKTpcbiAgICAob3BlbnBncCkgPT4ge1xuICAgICAgICByZXR1cm4gKCFvcGVucGdwKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBvcGVucGdwJyk6XG4gICAgICAgIChsb2NhbFN0b3JhZ2UpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoIWxvY2FsU3RvcmFnZSkgP1xuICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIGxvY2FsU3RvcmFnZScpOlxuICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBQR1BrZXkgPSBvcGVucGdwLmtleS5yZWFkQXJtb3JlZChQR1BrZXlBcm1vcik7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFBHUGtleS5rZXlzWzBdLnVzZXJzWzBdLnVzZXJJZC51c2VyaWQsIFBHUGtleUFybW9yKVxuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLnNldEltbWVkaWF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYHByaXZhdGUgcGdwIGtleSBzYXZlZCA8LSAke1BHUGtleS5rZXlzWzBdLnVzZXJzWzBdLnVzZXJJZC51c2VyaWR9YClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGliL3NhdmVQR1BQcml2a2V5LmpzIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2dldEZyb21TdG9yYWdlfSBmcm9tICcuL2dldEZyb21TdG9yYWdlJztcbmltcG9ydCB7ZGV0ZXJtaW5lQ29udGVudFR5cGV9IGZyb20gJy4vZGV0ZXJtaW5lQ29udGVudFR5cGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZVBHUFB1YmtleShQR1BrZXlBcm1vcikge1xuICAgIC8vIHNhdmUgcHVibGljIGtleSB0byBzdG9yYWdlIG9ubHkgaWYgaXQgZG9lc24ndCBvdmVyd3JpdGUgYSBwcml2YXRlIGtleVxuICAgIC8vIHVzYWdlOiBzYXZlUEdQUHVia2V5KGNvbnRlbnQpKG9wZW5wZ3ApKGxvY2FsU3RvcmFnZSkudGhlbihyZXN1bHQgPT4gcmVzdWx0KVxuICAgIHJldHVybiAoIVBHUGtleUFybW9yKSA/XG4gICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIFBHUGtleUFybW9yJyk6XG4gICAgKG9wZW5wZ3ApID0+IHtcbiAgICAgICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgICAgICBQcm9taXNlLnJlamVjdCgnRXJyb3I6IG1pc3Npbmcgb3BlbnBncCcpOlxuICAgICAgICAobG9jYWxTdG9yYWdlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKCFsb2NhbFN0b3JhZ2UpID9cbiAgICAgICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBsb2NhbFN0b3JhZ2UnKTpcbiAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgUEdQa2V5ID0gb3BlbnBncC5rZXkucmVhZEFybW9yZWQoUEdQa2V5QXJtb3IpO1xuICAgICAgICAgICAgICAgIGdldEZyb21TdG9yYWdlKGxvY2FsU3RvcmFnZSkoUEdQa2V5LmtleXNbMF0udXNlcnNbMF0udXNlcklkLnVzZXJpZClcbiAgICAgICAgICAgICAgICAudGhlbihleGlzdGluZ0tleSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoIWV4aXN0aW5nS2V5KSA/XG4gICAgICAgICAgICAgICAgICAgIFByb21pc2UucmVzb2x2ZSgnbm9uZScpIDpcbiAgICAgICAgICAgICAgICAgICAgZGV0ZXJtaW5lQ29udGVudFR5cGUoZXhpc3RpbmdLZXkpKG9wZW5wZ3ApO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZXhpc3RpbmdLZXlUeXBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXN0aW5nS2V5VHlwZSA9PT0gJ1BHUFByaXZrZXknKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoJ3B1YmtleSBpZ25vcmVkIFgtIGF0dGVtcHRlZCBvdmVyd3JpdGUgcHJpdmtleScpXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShQR1BrZXkua2V5c1swXS51c2Vyc1swXS51c2VySWQudXNlcmlkLCBQR1BrZXlBcm1vcilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYHB1YmxpYyBwZ3Aga2V5IHNhdmVkIDwtICR7UEdQa2V5LmtleXNbMF0udXNlcnNbMF0udXNlcklkLnVzZXJpZH1gKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gcmVqZWN0KGVycikpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xpYi9zYXZlUEdQUHVia2V5LmpzIiwiOyhmdW5jdGlvbigpe1xyXG5cclxuXHQvKiBVTkJVSUxEICovXHJcblx0dmFyIHJvb3Q7XHJcblx0aWYodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIil7IHJvb3QgPSB3aW5kb3cgfVxyXG5cdGlmKHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIpeyByb290ID0gZ2xvYmFsIH1cclxuXHRyb290ID0gcm9vdCB8fCB7fTtcclxuXHR2YXIgY29uc29sZSA9IHJvb3QuY29uc29sZSB8fCB7bG9nOiBmdW5jdGlvbigpe319O1xyXG5cdGZ1bmN0aW9uIHJlcXVpcmUoYXJnKXtcclxuXHRcdHJldHVybiBhcmcuc2xpY2U/IHJlcXVpcmVbcmVzb2x2ZShhcmcpXSA6IGZ1bmN0aW9uKG1vZCwgcGF0aCl7XHJcblx0XHRcdGFyZyhtb2QgPSB7ZXhwb3J0czoge319KTtcclxuXHRcdFx0cmVxdWlyZVtyZXNvbHZlKHBhdGgpXSA9IG1vZC5leHBvcnRzO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gcmVzb2x2ZShwYXRoKXtcclxuXHRcdFx0cmV0dXJuIHBhdGguc3BsaXQoJy8nKS5zbGljZSgtMSkudG9TdHJpbmcoKS5yZXBsYWNlKCcuanMnLCcnKTtcclxuXHRcdH1cclxuXHR9XHJcblx0aWYodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIil7IHZhciBjb21tb24gPSBtb2R1bGUgfVxyXG5cdC8qIFVOQlVJTEQgKi9cclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdC8vIEdlbmVyaWMgamF2YXNjcmlwdCB1dGlsaXRpZXMuXHJcblx0XHR2YXIgVHlwZSA9IHt9O1xyXG5cdFx0Ly9UeXBlLmZucyA9IFR5cGUuZm4gPSB7aXM6IGZ1bmN0aW9uKGZuKXsgcmV0dXJuICghIWZuICYmIGZuIGluc3RhbmNlb2YgRnVuY3Rpb24pIH19XHJcblx0XHRUeXBlLmZucyA9IFR5cGUuZm4gPSB7aXM6IGZ1bmN0aW9uKGZuKXsgcmV0dXJuICghIWZuICYmICdmdW5jdGlvbicgPT0gdHlwZW9mIGZuKSB9fVxyXG5cdFx0VHlwZS5iaSA9IHtpczogZnVuY3Rpb24oYil7IHJldHVybiAoYiBpbnN0YW5jZW9mIEJvb2xlYW4gfHwgdHlwZW9mIGIgPT0gJ2Jvb2xlYW4nKSB9fVxyXG5cdFx0VHlwZS5udW0gPSB7aXM6IGZ1bmN0aW9uKG4peyByZXR1cm4gIWxpc3RfaXMobikgJiYgKChuIC0gcGFyc2VGbG9hdChuKSArIDEpID49IDAgfHwgSW5maW5pdHkgPT09IG4gfHwgLUluZmluaXR5ID09PSBuKSB9fVxyXG5cdFx0VHlwZS50ZXh0ID0ge2lzOiBmdW5jdGlvbih0KXsgcmV0dXJuICh0eXBlb2YgdCA9PSAnc3RyaW5nJykgfX1cclxuXHRcdFR5cGUudGV4dC5pZnkgPSBmdW5jdGlvbih0KXtcclxuXHRcdFx0aWYoVHlwZS50ZXh0LmlzKHQpKXsgcmV0dXJuIHQgfVxyXG5cdFx0XHRpZih0eXBlb2YgSlNPTiAhPT0gXCJ1bmRlZmluZWRcIil7IHJldHVybiBKU09OLnN0cmluZ2lmeSh0KSB9XHJcblx0XHRcdHJldHVybiAodCAmJiB0LnRvU3RyaW5nKT8gdC50b1N0cmluZygpIDogdDtcclxuXHRcdH1cclxuXHRcdFR5cGUudGV4dC5yYW5kb20gPSBmdW5jdGlvbihsLCBjKXtcclxuXHRcdFx0dmFyIHMgPSAnJztcclxuXHRcdFx0bCA9IGwgfHwgMjQ7IC8vIHlvdSBhcmUgbm90IGdvaW5nIHRvIG1ha2UgYSAwIGxlbmd0aCByYW5kb20gbnVtYmVyLCBzbyBubyBuZWVkIHRvIGNoZWNrIHR5cGVcclxuXHRcdFx0YyA9IGMgfHwgJzAxMjM0NTY3ODlBQkNERUZHSElKS0xNTk9QUVJTVFVWV1haYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonO1xyXG5cdFx0XHR3aGlsZShsID4gMCl7IHMgKz0gYy5jaGFyQXQoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYy5sZW5ndGgpKTsgbC0tIH1cclxuXHRcdFx0cmV0dXJuIHM7XHJcblx0XHR9XHJcblx0XHRUeXBlLnRleHQubWF0Y2ggPSBmdW5jdGlvbih0LCBvKXsgdmFyIHIgPSBmYWxzZTtcclxuXHRcdFx0dCA9IHQgfHwgJyc7XHJcblx0XHRcdG8gPSBUeXBlLnRleHQuaXMobyk/IHsnPSc6IG99IDogbyB8fCB7fTsgLy8geyd+JywgJz0nLCAnKicsICc8JywgJz4nLCAnKycsICctJywgJz8nLCAnISd9IC8vIGlnbm9yZSBjYXNlLCBleGFjdGx5IGVxdWFsLCBhbnl0aGluZyBhZnRlciwgbGV4aWNhbGx5IGxhcmdlciwgbGV4aWNhbGx5IGxlc3NlciwgYWRkZWQgaW4sIHN1YnRhY3RlZCBmcm9tLCBxdWVzdGlvbmFibGUgZnV6enkgbWF0Y2gsIGFuZCBlbmRzIHdpdGguXHJcblx0XHRcdGlmKFR5cGUub2JqLmhhcyhvLCd+JykpeyB0ID0gdC50b0xvd2VyQ2FzZSgpOyBvWyc9J10gPSAob1snPSddIHx8IG9bJ34nXSkudG9Mb3dlckNhc2UoKSB9XHJcblx0XHRcdGlmKFR5cGUub2JqLmhhcyhvLCc9JykpeyByZXR1cm4gdCA9PT0gb1snPSddIH1cclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJyonKSl7IGlmKHQuc2xpY2UoMCwgb1snKiddLmxlbmd0aCkgPT09IG9bJyonXSl7IHIgPSB0cnVlOyB0ID0gdC5zbGljZShvWycqJ10ubGVuZ3RoKSB9IGVsc2UgeyByZXR1cm4gZmFsc2UgfX1cclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJyEnKSl7IGlmKHQuc2xpY2UoLW9bJyEnXS5sZW5ndGgpID09PSBvWychJ10peyByID0gdHJ1ZSB9IGVsc2UgeyByZXR1cm4gZmFsc2UgfX1cclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJysnKSl7XHJcblx0XHRcdFx0aWYoVHlwZS5saXN0Lm1hcChUeXBlLmxpc3QuaXMob1snKyddKT8gb1snKyddIDogW29bJysnXV0sIGZ1bmN0aW9uKG0pe1xyXG5cdFx0XHRcdFx0aWYodC5pbmRleE9mKG0pID49IDApeyByID0gdHJ1ZSB9IGVsc2UgeyByZXR1cm4gdHJ1ZSB9XHJcblx0XHRcdFx0fSkpeyByZXR1cm4gZmFsc2UgfVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKFR5cGUub2JqLmhhcyhvLCctJykpe1xyXG5cdFx0XHRcdGlmKFR5cGUubGlzdC5tYXAoVHlwZS5saXN0LmlzKG9bJy0nXSk/IG9bJy0nXSA6IFtvWyctJ11dLCBmdW5jdGlvbihtKXtcclxuXHRcdFx0XHRcdGlmKHQuaW5kZXhPZihtKSA8IDApeyByID0gdHJ1ZSB9IGVsc2UgeyByZXR1cm4gdHJ1ZSB9XHJcblx0XHRcdFx0fSkpeyByZXR1cm4gZmFsc2UgfVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKFR5cGUub2JqLmhhcyhvLCc+JykpeyBpZih0ID4gb1snPiddKXsgciA9IHRydWUgfSBlbHNlIHsgcmV0dXJuIGZhbHNlIH19XHJcblx0XHRcdGlmKFR5cGUub2JqLmhhcyhvLCc8JykpeyBpZih0IDwgb1snPCddKXsgciA9IHRydWUgfSBlbHNlIHsgcmV0dXJuIGZhbHNlIH19XHJcblx0XHRcdGZ1bmN0aW9uIGZ1enp5KHQsZil7IHZhciBuID0gLTEsIGkgPSAwLCBjOyBmb3IoO2MgPSBmW2krK107KXsgaWYoIX4obiA9IHQuaW5kZXhPZihjLCBuKzEpKSl7IHJldHVybiBmYWxzZSB9fSByZXR1cm4gdHJ1ZSB9IC8vIHZpYSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzkyMDYwMTMvamF2YXNjcmlwdC1mdXp6eS1zZWFyY2hcclxuXHRcdFx0aWYoVHlwZS5vYmouaGFzKG8sJz8nKSl7IGlmKGZ1enp5KHQsIG9bJz8nXSkpeyByID0gdHJ1ZSB9IGVsc2UgeyByZXR1cm4gZmFsc2UgfX0gLy8gY2hhbmdlIG5hbWUhXHJcblx0XHRcdHJldHVybiByO1xyXG5cdFx0fVxyXG5cdFx0VHlwZS5saXN0ID0ge2lzOiBmdW5jdGlvbihsKXsgcmV0dXJuIChsIGluc3RhbmNlb2YgQXJyYXkpIH19XHJcblx0XHRUeXBlLmxpc3Quc2xpdCA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcclxuXHRcdFR5cGUubGlzdC5zb3J0ID0gZnVuY3Rpb24oayl7IC8vIGNyZWF0ZXMgYSBuZXcgc29ydCBmdW5jdGlvbiBiYXNlZCBvZmYgc29tZSBmaWVsZFxyXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oQSxCKXtcclxuXHRcdFx0XHRpZighQSB8fCAhQil7IHJldHVybiAwIH0gQSA9IEFba107IEIgPSBCW2tdO1xyXG5cdFx0XHRcdGlmKEEgPCBCKXsgcmV0dXJuIC0xIH1lbHNlIGlmKEEgPiBCKXsgcmV0dXJuIDEgfVxyXG5cdFx0XHRcdGVsc2UgeyByZXR1cm4gMCB9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFR5cGUubGlzdC5tYXAgPSBmdW5jdGlvbihsLCBjLCBfKXsgcmV0dXJuIG9ial9tYXAobCwgYywgXykgfVxyXG5cdFx0VHlwZS5saXN0LmluZGV4ID0gMTsgLy8gY2hhbmdlIHRoaXMgdG8gMCBpZiB5b3Ugd2FudCBub24tbG9naWNhbCwgbm9uLW1hdGhlbWF0aWNhbCwgbm9uLW1hdHJpeCwgbm9uLWNvbnZlbmllbnQgYXJyYXkgbm90YXRpb25cclxuXHRcdFR5cGUub2JqID0ge2lzOiBmdW5jdGlvbihvKXsgcmV0dXJuIG8/IChvIGluc3RhbmNlb2YgT2JqZWN0ICYmIG8uY29uc3RydWN0b3IgPT09IE9iamVjdCkgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLm1hdGNoKC9eXFxbb2JqZWN0IChcXHcrKVxcXSQvKVsxXSA9PT0gJ09iamVjdCcgOiBmYWxzZSB9fVxyXG5cdFx0VHlwZS5vYmoucHV0ID0gZnVuY3Rpb24obywgZiwgdil7IHJldHVybiAob3x8e30pW2ZdID0gdiwgbyB9XHJcblx0XHRUeXBlLm9iai5oYXMgPSBmdW5jdGlvbihvLCBmKXsgcmV0dXJuIG8gJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIGYpIH1cclxuXHRcdFR5cGUub2JqLmRlbCA9IGZ1bmN0aW9uKG8sIGspe1xyXG5cdFx0XHRpZighbyl7IHJldHVybiB9XHJcblx0XHRcdG9ba10gPSBudWxsO1xyXG5cdFx0XHRkZWxldGUgb1trXTtcclxuXHRcdFx0cmV0dXJuIG87XHJcblx0XHR9XHJcblx0XHRUeXBlLm9iai5hcyA9IGZ1bmN0aW9uKG8sIGYsIHYsIHUpeyByZXR1cm4gb1tmXSA9IG9bZl0gfHwgKHUgPT09IHY/IHt9IDogdikgfVxyXG5cdFx0VHlwZS5vYmouaWZ5ID0gZnVuY3Rpb24obyl7XHJcblx0XHRcdGlmKG9ial9pcyhvKSl7IHJldHVybiBvIH1cclxuXHRcdFx0dHJ5e28gPSBKU09OLnBhcnNlKG8pO1xyXG5cdFx0XHR9Y2F0Y2goZSl7bz17fX07XHJcblx0XHRcdHJldHVybiBvO1xyXG5cdFx0fVxyXG5cdFx0OyhmdW5jdGlvbigpeyB2YXIgdTtcclxuXHRcdFx0ZnVuY3Rpb24gbWFwKHYsZil7XHJcblx0XHRcdFx0aWYob2JqX2hhcyh0aGlzLGYpICYmIHUgIT09IHRoaXNbZl0peyByZXR1cm4gfVxyXG5cdFx0XHRcdHRoaXNbZl0gPSB2O1xyXG5cdFx0XHR9XHJcblx0XHRcdFR5cGUub2JqLnRvID0gZnVuY3Rpb24oZnJvbSwgdG8pe1xyXG5cdFx0XHRcdHRvID0gdG8gfHwge307XHJcblx0XHRcdFx0b2JqX21hcChmcm9tLCBtYXAsIHRvKTtcclxuXHRcdFx0XHRyZXR1cm4gdG87XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblx0XHRUeXBlLm9iai5jb3B5ID0gZnVuY3Rpb24obyl7IC8vIGJlY2F1c2UgaHR0cDovL3dlYi5hcmNoaXZlLm9yZy93ZWIvMjAxNDAzMjgyMjQwMjUvaHR0cDovL2pzcGVyZi5jb20vY2xvbmluZy1hbi1vYmplY3QvMlxyXG5cdFx0XHRyZXR1cm4gIW8/IG8gOiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG8pKTsgLy8gaXMgc2hvY2tpbmdseSBmYXN0ZXIgdGhhbiBhbnl0aGluZyBlbHNlLCBhbmQgb3VyIGRhdGEgaGFzIHRvIGJlIGEgc3Vic2V0IG9mIEpTT04gYW55d2F5cyFcclxuXHRcdH1cclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0ZnVuY3Rpb24gZW1wdHkodixpKXsgdmFyIG4gPSB0aGlzLm47XHJcblx0XHRcdFx0aWYobiAmJiAoaSA9PT0gbiB8fCAob2JqX2lzKG4pICYmIG9ial9oYXMobiwgaSkpKSl7IHJldHVybiB9XHJcblx0XHRcdFx0aWYoaSl7IHJldHVybiB0cnVlIH1cclxuXHRcdFx0fVxyXG5cdFx0XHRUeXBlLm9iai5lbXB0eSA9IGZ1bmN0aW9uKG8sIG4pe1xyXG5cdFx0XHRcdGlmKCFvKXsgcmV0dXJuIHRydWUgfVxyXG5cdFx0XHRcdHJldHVybiBvYmpfbWFwKG8sZW1wdHkse246bn0pPyBmYWxzZSA6IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdGZ1bmN0aW9uIHQoayx2KXtcclxuXHRcdFx0XHRpZigyID09PSBhcmd1bWVudHMubGVuZ3RoKXtcclxuXHRcdFx0XHRcdHQuciA9IHQuciB8fCB7fTtcclxuXHRcdFx0XHRcdHQucltrXSA9IHY7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fSB0LnIgPSB0LnIgfHwgW107XHJcblx0XHRcdFx0dC5yLnB1c2goayk7XHJcblx0XHRcdH07XHJcblx0XHRcdHZhciBrZXlzID0gT2JqZWN0LmtleXM7XHJcblx0XHRcdFR5cGUub2JqLm1hcCA9IGZ1bmN0aW9uKGwsIGMsIF8pe1xyXG5cdFx0XHRcdHZhciB1LCBpID0gMCwgeCwgciwgbGwsIGxsZSwgZiA9IGZuX2lzKGMpO1xyXG5cdFx0XHRcdHQuciA9IG51bGw7XHJcblx0XHRcdFx0aWYoa2V5cyAmJiBvYmpfaXMobCkpe1xyXG5cdFx0XHRcdFx0bGwgPSBPYmplY3Qua2V5cyhsKTsgbGxlID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYobGlzdF9pcyhsKSB8fCBsbCl7XHJcblx0XHRcdFx0XHR4ID0gKGxsIHx8IGwpLmxlbmd0aDtcclxuXHRcdFx0XHRcdGZvcig7aSA8IHg7IGkrKyl7XHJcblx0XHRcdFx0XHRcdHZhciBpaSA9IChpICsgVHlwZS5saXN0LmluZGV4KTtcclxuXHRcdFx0XHRcdFx0aWYoZil7XHJcblx0XHRcdFx0XHRcdFx0ciA9IGxsZT8gYy5jYWxsKF8gfHwgdGhpcywgbFtsbFtpXV0sIGxsW2ldLCB0KSA6IGMuY2FsbChfIHx8IHRoaXMsIGxbaV0sIGlpLCB0KTtcclxuXHRcdFx0XHRcdFx0XHRpZihyICE9PSB1KXsgcmV0dXJuIHIgfVxyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdC8vaWYoVHlwZS50ZXN0LmlzKGMsbFtpXSkpeyByZXR1cm4gaWkgfSAvLyBzaG91bGQgaW1wbGVtZW50IGRlZXAgZXF1YWxpdHkgdGVzdGluZyFcclxuXHRcdFx0XHRcdFx0XHRpZihjID09PSBsW2xsZT8gbGxbaV0gOiBpXSl7IHJldHVybiBsbD8gbGxbaV0gOiBpaSB9IC8vIHVzZSB0aGlzIGZvciBub3dcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRmb3IoaSBpbiBsKXtcclxuXHRcdFx0XHRcdFx0aWYoZil7XHJcblx0XHRcdFx0XHRcdFx0aWYob2JqX2hhcyhsLGkpKXtcclxuXHRcdFx0XHRcdFx0XHRcdHIgPSBfPyBjLmNhbGwoXywgbFtpXSwgaSwgdCkgOiBjKGxbaV0sIGksIHQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYociAhPT0gdSl7IHJldHVybiByIH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Ly9pZihhLnRlc3QuaXMoYyxsW2ldKSl7IHJldHVybiBpIH0gLy8gc2hvdWxkIGltcGxlbWVudCBkZWVwIGVxdWFsaXR5IHRlc3RpbmchXHJcblx0XHRcdFx0XHRcdFx0aWYoYyA9PT0gbFtpXSl7IHJldHVybiBpIH0gLy8gdXNlIHRoaXMgZm9yIG5vd1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBmPyB0LnIgOiBUeXBlLmxpc3QuaW5kZXg/IDAgOiAtMTtcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdFR5cGUudGltZSA9IHt9O1xyXG5cdFx0VHlwZS50aW1lLmlzID0gZnVuY3Rpb24odCl7IHJldHVybiB0PyB0IGluc3RhbmNlb2YgRGF0ZSA6ICgrbmV3IERhdGUoKS5nZXRUaW1lKCkpIH1cclxuXHJcblx0XHR2YXIgZm5faXMgPSBUeXBlLmZuLmlzO1xyXG5cdFx0dmFyIGxpc3RfaXMgPSBUeXBlLmxpc3QuaXM7XHJcblx0XHR2YXIgb2JqID0gVHlwZS5vYmosIG9ial9pcyA9IG9iai5pcywgb2JqX2hhcyA9IG9iai5oYXMsIG9ial9tYXAgPSBvYmoubWFwO1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBUeXBlO1xyXG5cdH0pKHJlcXVpcmUsICcuL3R5cGUnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdC8vIE9uIGV2ZW50IGVtaXR0ZXIgZ2VuZXJpYyBqYXZhc2NyaXB0IHV0aWxpdHkuXHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG9udG8odGFnLCBhcmcsIGFzKXtcclxuXHRcdFx0aWYoIXRhZyl7IHJldHVybiB7dG86IG9udG99IH1cclxuXHRcdFx0dmFyIHRhZyA9ICh0aGlzLnRhZyB8fCAodGhpcy50YWcgPSB7fSkpW3RhZ10gfHxcclxuXHRcdFx0KHRoaXMudGFnW3RhZ10gPSB7dGFnOiB0YWcsIHRvOiBvbnRvLl8gPSB7XHJcblx0XHRcdFx0bmV4dDogZnVuY3Rpb24oKXt9XHJcblx0XHRcdH19KTtcclxuXHRcdFx0aWYoYXJnIGluc3RhbmNlb2YgRnVuY3Rpb24pe1xyXG5cdFx0XHRcdHZhciBiZSA9IHtcclxuXHRcdFx0XHRcdG9mZjogb250by5vZmYgfHwgXHJcblx0XHRcdFx0XHQob250by5vZmYgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0XHRpZih0aGlzLm5leHQgPT09IG9udG8uXy5uZXh0KXsgcmV0dXJuICEwIH1cclxuXHRcdFx0XHRcdFx0aWYodGhpcyA9PT0gdGhpcy50aGUubGFzdCl7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy50aGUubGFzdCA9IHRoaXMuYmFjaztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR0aGlzLnRvLmJhY2sgPSB0aGlzLmJhY2s7XHJcblx0XHRcdFx0XHRcdHRoaXMubmV4dCA9IG9udG8uXy5uZXh0O1xyXG5cdFx0XHRcdFx0XHR0aGlzLmJhY2sudG8gPSB0aGlzLnRvO1xyXG5cdFx0XHRcdFx0fSksXHJcblx0XHRcdFx0XHR0bzogb250by5fLFxyXG5cdFx0XHRcdFx0bmV4dDogYXJnLFxyXG5cdFx0XHRcdFx0dGhlOiB0YWcsXHJcblx0XHRcdFx0XHRvbjogdGhpcyxcclxuXHRcdFx0XHRcdGFzOiBhcyxcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdChiZS5iYWNrID0gdGFnLmxhc3QgfHwgdGFnKS50byA9IGJlO1xyXG5cdFx0XHRcdHJldHVybiB0YWcubGFzdCA9IGJlO1xyXG5cdFx0XHR9XHJcblx0XHRcdCh0YWcgPSB0YWcudG8pLm5leHQoYXJnKTtcclxuXHRcdFx0cmV0dXJuIHRhZztcclxuXHRcdH07XHJcblx0fSkocmVxdWlyZSwgJy4vb250bycpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0Ly8gVE9ETzogTmVlZHMgdG8gYmUgcmVkb25lLlxyXG5cdFx0dmFyIE9uID0gcmVxdWlyZSgnLi9vbnRvJyk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gQ2hhaW4oY3JlYXRlLCBvcHQpe1xyXG5cdFx0XHRvcHQgPSBvcHQgfHwge307XHJcblx0XHRcdG9wdC5pZCA9IG9wdC5pZCB8fCAnIyc7XHJcblx0XHRcdG9wdC5yaWQgPSBvcHQucmlkIHx8ICdAJztcclxuXHRcdFx0b3B0LnV1aWQgPSBvcHQudXVpZCB8fCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHJldHVybiAoK25ldyBEYXRlKCkpICsgTWF0aC5yYW5kb20oKTtcclxuXHRcdFx0fTtcclxuXHRcdFx0dmFyIG9uID0gT247Ly9Pbi5zY29wZSgpO1xyXG5cclxuXHRcdFx0b24uc3R1biA9IGZ1bmN0aW9uKGNoYWluKXtcclxuXHRcdFx0XHR2YXIgc3R1biA9IGZ1bmN0aW9uKGV2KXtcclxuXHRcdFx0XHRcdGlmKHN0dW4ub2ZmICYmIHN0dW4gPT09IHRoaXMuc3R1bil7XHJcblx0XHRcdFx0XHRcdHRoaXMuc3R1biA9IG51bGw7XHJcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmKG9uLnN0dW4uc2tpcCl7XHJcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmKGV2KXtcclxuXHRcdFx0XHRcdFx0ZXYuY2IgPSBldi5mbjtcclxuXHRcdFx0XHRcdFx0ZXYub2ZmKCk7XHJcblx0XHRcdFx0XHRcdHJlcy5xdWV1ZS5wdXNoKGV2KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH0sIHJlcyA9IHN0dW4ucmVzID0gZnVuY3Rpb24odG1wLCBhcyl7XHJcblx0XHRcdFx0XHRpZihzdHVuLm9mZil7IHJldHVybiB9XHJcblx0XHRcdFx0XHRpZih0bXAgaW5zdGFuY2VvZiBGdW5jdGlvbil7XHJcblx0XHRcdFx0XHRcdG9uLnN0dW4uc2tpcCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdHRtcC5jYWxsKGFzKTtcclxuXHRcdFx0XHRcdFx0b24uc3R1bi5za2lwID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHN0dW4ub2ZmID0gdHJ1ZTtcclxuXHRcdFx0XHRcdHZhciBpID0gMCwgcSA9IHJlcy5xdWV1ZSwgbCA9IHEubGVuZ3RoLCBhY3Q7XHJcblx0XHRcdFx0XHRyZXMucXVldWUgPSBbXTtcclxuXHRcdFx0XHRcdGlmKHN0dW4gPT09IGF0LnN0dW4pe1xyXG5cdFx0XHRcdFx0XHRhdC5zdHVuID0gbnVsbDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGZvcihpOyBpIDwgbDsgaSsrKXsgYWN0ID0gcVtpXTtcclxuXHRcdFx0XHRcdFx0YWN0LmZuID0gYWN0LmNiO1xyXG5cdFx0XHRcdFx0XHRhY3QuY2IgPSBudWxsO1xyXG5cdFx0XHRcdFx0XHRvbi5zdHVuLnNraXAgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRhY3QuY3R4Lm9uKGFjdC50YWcsIGFjdC5mbiwgYWN0KTtcclxuXHRcdFx0XHRcdFx0b24uc3R1bi5za2lwID0gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSwgYXQgPSBjaGFpbi5fO1xyXG5cdFx0XHRcdHJlcy5iYWNrID0gYXQuc3R1biB8fCAoYXQuYmFja3x8e186e319KS5fLnN0dW47XHJcblx0XHRcdFx0aWYocmVzLmJhY2spe1xyXG5cdFx0XHRcdFx0cmVzLmJhY2submV4dCA9IHN0dW47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJlcy5xdWV1ZSA9IFtdO1xyXG5cdFx0XHRcdGF0LnN0dW4gPSBzdHVuOyBcclxuXHRcdFx0XHRyZXR1cm4gcmVzO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBvbjtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHRcdHJldHVybjtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR2YXIgYXNrID0gb24uYXNrID0gZnVuY3Rpb24oY2IsIGFzKXtcclxuXHRcdFx0XHRpZighYXNrLm9uKXsgYXNrLm9uID0gT24uc2NvcGUoKSB9XHJcblx0XHRcdFx0dmFyIGlkID0gb3B0LnV1aWQoKTtcclxuXHRcdFx0XHRpZihjYil7IGFzay5vbihpZCwgY2IsIGFzKSB9XHJcblx0XHRcdFx0cmV0dXJuIGlkO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFzay5fID0gb3B0LmlkO1xyXG5cdFx0XHRvbi5hY2sgPSBmdW5jdGlvbihhdCwgcmVwbHkpe1xyXG5cdFx0XHRcdGlmKCFhdCB8fCAhcmVwbHkgfHwgIWFzay5vbil7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIGlkID0gYXRbb3B0LmlkXSB8fCBhdDtcclxuXHRcdFx0XHRpZighYXNrLm9uc1tpZF0peyByZXR1cm4gfVxyXG5cdFx0XHRcdGFzay5vbihpZCwgcmVwbHkpO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdG9uLmFjay5fID0gb3B0LnJpZDtcclxuXHJcblxyXG5cdFx0XHRyZXR1cm4gb247XHJcblx0XHRcdHJldHVybjtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHRcdHJldHVybjtcclxuXHRcdFx0b24ub24oJ2V2ZW50JywgZnVuY3Rpb24gZXZlbnQoYWN0KXtcclxuXHRcdFx0XHR2YXIgbGFzdCA9IGFjdC5vbi5sYXN0LCB0bXA7XHJcblx0XHRcdFx0aWYoJ2luJyA9PT0gYWN0LnRhZyAmJiBHdW4uY2hhaW4uY2hhaW4uaW5wdXQgIT09IGFjdC5mbil7IC8vIFRPRE86IEJVRyEgR3VuIGlzIG5vdCBhdmFpbGFibGUgaW4gdGhpcyBtb2R1bGUuXHJcblx0XHRcdFx0XHRpZigodG1wID0gYWN0LmN0eCkgJiYgdG1wLnN0dW4pe1xyXG5cdFx0XHRcdFx0XHRpZih0bXAuc3R1bihhY3QpKXtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoIWxhc3QpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGlmKGFjdC5vbi5tYXApe1xyXG5cdFx0XHRcdFx0dmFyIG1hcCA9IGFjdC5vbi5tYXAsIHY7XHJcblx0XHRcdFx0XHRmb3IodmFyIGYgaW4gbWFwKXsgdiA9IG1hcFtmXTtcclxuXHRcdFx0XHRcdFx0aWYodil7XHJcblx0XHRcdFx0XHRcdFx0ZW1pdCh2LCBhY3QsIGV2ZW50KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0LypcclxuXHRcdFx0XHRcdEd1bi5vYmoubWFwKGFjdC5vbi5tYXAsIGZ1bmN0aW9uKHYsZil7IC8vIFRPRE86IEJVRyEgR3VuIGlzIG5vdCBhdmFpbGFibGUgaW4gdGhpcyBtb2R1bGUuXHJcblx0XHRcdFx0XHRcdC8vZW1pdCh2WzBdLCBhY3QsIGV2ZW50LCB2WzFdKTsgLy8gYmVsb3cgZW5hYmxlcyBtb3JlIGNvbnRyb2xcclxuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcImJvb29vb29vb1wiLCBmLHYpO1xyXG5cdFx0XHRcdFx0XHRlbWl0KHYsIGFjdCwgZXZlbnQpO1xyXG5cdFx0XHRcdFx0XHQvL2VtaXQodlsxXSwgYWN0LCBldmVudCwgdlsyXSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdCovXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGVtaXQobGFzdCwgYWN0LCBldmVudCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGxhc3QgIT09IGFjdC5vbi5sYXN0KXtcclxuXHRcdFx0XHRcdGV2ZW50KGFjdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0ZnVuY3Rpb24gZW1pdChsYXN0LCBhY3QsIGV2ZW50LCBldil7XHJcblx0XHRcdFx0aWYobGFzdCBpbnN0YW5jZW9mIEFycmF5KXtcclxuXHRcdFx0XHRcdGFjdC5mbi5hcHBseShhY3QuYXMsIGxhc3QuY29uY2F0KGV2fHxhY3QpKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0YWN0LmZuLmNhbGwoYWN0LmFzLCBsYXN0LCBldnx8YWN0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8qb24ub24oJ2VtaXQnLCBmdW5jdGlvbihldil7XHJcblx0XHRcdFx0aWYoZXYub24ubWFwKXtcclxuXHRcdFx0XHRcdHZhciBpZCA9IGV2LmFyZy52aWEuZ3VuLl8uaWQgKyBldi5hcmcuZ2V0O1xyXG5cdFx0XHRcdFx0Ly9cclxuXHRcdFx0XHRcdC8vZXYuaWQgPSBldi5pZCB8fCBHdW4udGV4dC5yYW5kb20oNik7XHJcblx0XHRcdFx0XHQvL2V2Lm9uLm1hcFtldi5pZF0gPSBldi5hcmc7XHJcblx0XHRcdFx0XHQvL2V2LnByb3h5ID0gZXYuYXJnWzFdO1xyXG5cdFx0XHRcdFx0Ly9ldi5hcmcgPSBldi5hcmdbMF07XHJcblx0XHRcdFx0XHQvLyBiZWxvdyBnaXZlcyBtb3JlIGNvbnRyb2wuXHJcblx0XHRcdFx0XHRldi5vbi5tYXBbaWRdID0gZXYuYXJnO1xyXG5cdFx0XHRcdFx0Ly9ldi5wcm94eSA9IGV2LmFyZ1syXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZXYub24ubGFzdCA9IGV2LmFyZztcclxuXHRcdFx0fSk7Ki9cclxuXHJcblx0XHRcdG9uLm9uKCdlbWl0JywgZnVuY3Rpb24oZXYpe1xyXG5cdFx0XHRcdHZhciBndW4gPSBldi5hcmcuZ3VuO1xyXG5cdFx0XHRcdGlmKCdpbicgPT09IGV2LnRhZyAmJiBndW4gJiYgIWd1bi5fLnNvdWwpeyAvLyBUT0RPOiBCVUchIFNvdWwgc2hvdWxkIGJlIGF2YWlsYWJsZS4gQ3VycmVudGx5IG5vdCB1c2luZyBpdCB0aG91Z2gsIGJ1dCBzaG91bGQgZW5hYmxlIGl0IChjaGVjayBmb3Igc2lkZSBlZmZlY3RzIGlmIG1hZGUgYXZhaWxhYmxlKS5cclxuXHRcdFx0XHRcdChldi5vbi5tYXAgPSBldi5vbi5tYXAgfHwge30pW2d1bi5fLmlkIHx8IChndW4uXy5pZCA9IE1hdGgucmFuZG9tKCkpXSA9IGV2LmFyZztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZXYub24ubGFzdCA9IGV2LmFyZztcclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBvbjtcclxuXHRcdH1cclxuXHRcdG1vZHVsZS5leHBvcnRzID0gQ2hhaW47XHJcblx0fSkocmVxdWlyZSwgJy4vb25pZnknKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdC8vIEdlbmVyaWMgamF2YXNjcmlwdCBzY2hlZHVsZXIgdXRpbGl0eS5cclxuXHRcdHZhciBUeXBlID0gcmVxdWlyZSgnLi90eXBlJyk7XHJcblx0XHRmdW5jdGlvbiBzKHN0YXRlLCBjYiwgdGltZSl7IC8vIG1heWJlIHVzZSBscnUtY2FjaGU/XHJcblx0XHRcdHMudGltZSA9IHRpbWU7XHJcblx0XHRcdHMud2FpdGluZy5wdXNoKHt3aGVuOiBzdGF0ZSwgZXZlbnQ6IGNiIHx8IGZ1bmN0aW9uKCl7fX0pO1xyXG5cdFx0XHRpZihzLnNvb25lc3QgPCBzdGF0ZSl7IHJldHVybiB9XHJcblx0XHRcdHMuc2V0KHN0YXRlKTtcclxuXHRcdH1cclxuXHRcdHMud2FpdGluZyA9IFtdO1xyXG5cdFx0cy5zb29uZXN0ID0gSW5maW5pdHk7XHJcblx0XHRzLnNvcnQgPSBUeXBlLmxpc3Quc29ydCgnd2hlbicpO1xyXG5cdFx0cy5zZXQgPSBmdW5jdGlvbihmdXR1cmUpe1xyXG5cdFx0XHRpZihJbmZpbml0eSA8PSAocy5zb29uZXN0ID0gZnV0dXJlKSl7IHJldHVybiB9XHJcblx0XHRcdHZhciBub3cgPSBzLnRpbWUoKTtcclxuXHRcdFx0ZnV0dXJlID0gKGZ1dHVyZSA8PSBub3cpPyAwIDogKGZ1dHVyZSAtIG5vdyk7XHJcblx0XHRcdGNsZWFyVGltZW91dChzLmlkKTtcclxuXHRcdFx0cy5pZCA9IHNldFRpbWVvdXQocy5jaGVjaywgZnV0dXJlKTtcclxuXHRcdH1cclxuXHRcdHMuZWFjaCA9IGZ1bmN0aW9uKHdhaXQsIGksIG1hcCl7XHJcblx0XHRcdHZhciBjdHggPSB0aGlzO1xyXG5cdFx0XHRpZighd2FpdCl7IHJldHVybiB9XHJcblx0XHRcdGlmKHdhaXQud2hlbiA8PSBjdHgubm93KXtcclxuXHRcdFx0XHRpZih3YWl0LmV2ZW50IGluc3RhbmNlb2YgRnVuY3Rpb24pe1xyXG5cdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpeyB3YWl0LmV2ZW50KCkgfSwwKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y3R4LnNvb25lc3QgPSAoY3R4LnNvb25lc3QgPCB3YWl0LndoZW4pPyBjdHguc29vbmVzdCA6IHdhaXQud2hlbjtcclxuXHRcdFx0XHRtYXAod2FpdCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHMuY2hlY2sgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgY3R4ID0ge25vdzogcy50aW1lKCksIHNvb25lc3Q6IEluZmluaXR5fTtcclxuXHRcdFx0cy53YWl0aW5nLnNvcnQocy5zb3J0KTtcclxuXHRcdFx0cy53YWl0aW5nID0gVHlwZS5saXN0Lm1hcChzLndhaXRpbmcsIHMuZWFjaCwgY3R4KSB8fCBbXTtcclxuXHRcdFx0cy5zZXQoY3R4LnNvb25lc3QpO1xyXG5cdFx0fVxyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBzO1xyXG5cdH0pKHJlcXVpcmUsICcuL3NjaGVkdWxlJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHQvKiBCYXNlZCBvbiB0aGUgSHlwb3RoZXRpY2FsIEFtbmVzaWEgTWFjaGluZSB0aG91Z2h0IGV4cGVyaW1lbnQgKi9cclxuXHRcdGZ1bmN0aW9uIEhBTShtYWNoaW5lU3RhdGUsIGluY29taW5nU3RhdGUsIGN1cnJlbnRTdGF0ZSwgaW5jb21pbmdWYWx1ZSwgY3VycmVudFZhbHVlKXtcclxuXHRcdFx0aWYobWFjaGluZVN0YXRlIDwgaW5jb21pbmdTdGF0ZSl7XHJcblx0XHRcdFx0cmV0dXJuIHtkZWZlcjogdHJ1ZX07IC8vIHRoZSBpbmNvbWluZyB2YWx1ZSBpcyBvdXRzaWRlIHRoZSBib3VuZGFyeSBvZiB0aGUgbWFjaGluZSdzIHN0YXRlLCBpdCBtdXN0IGJlIHJlcHJvY2Vzc2VkIGluIGFub3RoZXIgc3RhdGUuXHJcblx0XHRcdH1cclxuXHRcdFx0aWYoaW5jb21pbmdTdGF0ZSA8IGN1cnJlbnRTdGF0ZSl7XHJcblx0XHRcdFx0cmV0dXJuIHtoaXN0b3JpY2FsOiB0cnVlfTsgLy8gdGhlIGluY29taW5nIHZhbHVlIGlzIHdpdGhpbiB0aGUgYm91bmRhcnkgb2YgdGhlIG1hY2hpbmUncyBzdGF0ZSwgYnV0IG5vdCB3aXRoaW4gdGhlIHJhbmdlLlxyXG5cclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjdXJyZW50U3RhdGUgPCBpbmNvbWluZ1N0YXRlKXtcclxuXHRcdFx0XHRyZXR1cm4ge2NvbnZlcmdlOiB0cnVlLCBpbmNvbWluZzogdHJ1ZX07IC8vIHRoZSBpbmNvbWluZyB2YWx1ZSBpcyB3aXRoaW4gYm90aCB0aGUgYm91bmRhcnkgYW5kIHRoZSByYW5nZSBvZiB0aGUgbWFjaGluZSdzIHN0YXRlLlxyXG5cclxuXHRcdFx0fVxyXG5cdFx0XHRpZihpbmNvbWluZ1N0YXRlID09PSBjdXJyZW50U3RhdGUpe1xyXG5cdFx0XHRcdGluY29taW5nVmFsdWUgPSBMZXhpY2FsKGluY29taW5nVmFsdWUpIHx8IFwiXCI7XHJcblx0XHRcdFx0Y3VycmVudFZhbHVlID0gTGV4aWNhbChjdXJyZW50VmFsdWUpIHx8IFwiXCI7XHJcblx0XHRcdFx0aWYoaW5jb21pbmdWYWx1ZSA9PT0gY3VycmVudFZhbHVlKXsgLy8gTm90ZTogd2hpbGUgdGhlc2UgYXJlIHByYWN0aWNhbGx5IHRoZSBzYW1lLCB0aGUgZGVsdGFzIGNvdWxkIGJlIHRlY2huaWNhbGx5IGRpZmZlcmVudFxyXG5cdFx0XHRcdFx0cmV0dXJuIHtzdGF0ZTogdHJ1ZX07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8qXHJcblx0XHRcdFx0XHRUaGUgZm9sbG93aW5nIGlzIGEgbmFpdmUgaW1wbGVtZW50YXRpb24sIGJ1dCB3aWxsIGFsd2F5cyB3b3JrLlxyXG5cdFx0XHRcdFx0TmV2ZXIgY2hhbmdlIGl0IHVubGVzcyB5b3UgaGF2ZSBzcGVjaWZpYyBuZWVkcyB0aGF0IGFic29sdXRlbHkgcmVxdWlyZSBpdC5cclxuXHRcdFx0XHRcdElmIGNoYW5nZWQsIHlvdXIgZGF0YSB3aWxsIGRpdmVyZ2UgdW5sZXNzIHlvdSBndWFyYW50ZWUgZXZlcnkgcGVlcidzIGFsZ29yaXRobSBoYXMgYWxzbyBiZWVuIGNoYW5nZWQgdG8gYmUgdGhlIHNhbWUuXHJcblx0XHRcdFx0XHRBcyBhIHJlc3VsdCwgaXQgaXMgaGlnaGx5IGRpc2NvdXJhZ2VkIHRvIG1vZGlmeSBkZXNwaXRlIHRoZSBmYWN0IHRoYXQgaXQgaXMgbmFpdmUsXHJcblx0XHRcdFx0XHRiZWNhdXNlIGNvbnZlcmdlbmNlIChkYXRhIGludGVncml0eSkgaXMgZ2VuZXJhbGx5IG1vcmUgaW1wb3J0YW50LlxyXG5cdFx0XHRcdFx0QW55IGRpZmZlcmVuY2UgaW4gdGhpcyBhbGdvcml0aG0gbXVzdCBiZSBnaXZlbiBhIG5ldyBhbmQgZGlmZmVyZW50IG5hbWUuXHJcblx0XHRcdFx0Ki9cclxuXHRcdFx0XHRpZihpbmNvbWluZ1ZhbHVlIDwgY3VycmVudFZhbHVlKXsgLy8gTGV4aWNhbCBvbmx5IHdvcmtzIG9uIHNpbXBsZSB2YWx1ZSB0eXBlcyFcclxuXHRcdFx0XHRcdHJldHVybiB7Y29udmVyZ2U6IHRydWUsIGN1cnJlbnQ6IHRydWV9O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihjdXJyZW50VmFsdWUgPCBpbmNvbWluZ1ZhbHVlKXsgLy8gTGV4aWNhbCBvbmx5IHdvcmtzIG9uIHNpbXBsZSB2YWx1ZSB0eXBlcyFcclxuXHRcdFx0XHRcdHJldHVybiB7Y29udmVyZ2U6IHRydWUsIGluY29taW5nOiB0cnVlfTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHtlcnI6IFwiSW52YWxpZCBDUkRUIERhdGE6IFwiKyBpbmNvbWluZ1ZhbHVlICtcIiB0byBcIisgY3VycmVudFZhbHVlICtcIiBhdCBcIisgaW5jb21pbmdTdGF0ZSArXCIgdG8gXCIrIGN1cnJlbnRTdGF0ZSArXCIhXCJ9O1xyXG5cdFx0fVxyXG5cdFx0aWYodHlwZW9mIEpTT04gPT09ICd1bmRlZmluZWQnKXtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFxyXG5cdFx0XHRcdCdKU09OIGlzIG5vdCBpbmNsdWRlZCBpbiB0aGlzIGJyb3dzZXIuIFBsZWFzZSBsb2FkIGl0IGZpcnN0OiAnICtcclxuXHRcdFx0XHQnYWpheC5jZG5qcy5jb20vYWpheC9saWJzL2pzb24yLzIwMTEwMjIzL2pzb24yLmpzJ1xyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIExleGljYWwgPSBKU09OLnN0cmluZ2lmeSwgdW5kZWZpbmVkO1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBIQU07XHJcblx0fSkocmVxdWlyZSwgJy4vSEFNJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgVHlwZSA9IHJlcXVpcmUoJy4vdHlwZScpO1xyXG5cdFx0dmFyIFZhbCA9IHt9O1xyXG5cdFx0VmFsLmlzID0gZnVuY3Rpb24odil7IC8vIFZhbGlkIHZhbHVlcyBhcmUgYSBzdWJzZXQgb2YgSlNPTjogbnVsbCwgYmluYXJ5LCBudW1iZXIgKCFJbmZpbml0eSksIHRleHQsIG9yIGEgc291bCByZWxhdGlvbi4gQXJyYXlzIG5lZWQgc3BlY2lhbCBhbGdvcml0aG1zIHRvIGhhbmRsZSBjb25jdXJyZW5jeSwgc28gdGhleSBhcmUgbm90IHN1cHBvcnRlZCBkaXJlY3RseS4gVXNlIGFuIGV4dGVuc2lvbiB0aGF0IHN1cHBvcnRzIHRoZW0gaWYgbmVlZGVkIGJ1dCByZXNlYXJjaCB0aGVpciBwcm9ibGVtcyBmaXJzdC5cclxuXHRcdFx0aWYodiA9PT0gdSl7IHJldHVybiBmYWxzZSB9XHJcblx0XHRcdGlmKHYgPT09IG51bGwpeyByZXR1cm4gdHJ1ZSB9IC8vIFwiZGVsZXRlc1wiLCBudWxsaW5nIG91dCBmaWVsZHMuXHJcblx0XHRcdGlmKHYgPT09IEluZmluaXR5KXsgcmV0dXJuIGZhbHNlIH0gLy8gd2Ugd2FudCB0aGlzIHRvIGJlLCBidXQgSlNPTiBkb2VzIG5vdCBzdXBwb3J0IGl0LCBzYWQgZmFjZS5cclxuXHRcdFx0aWYodGV4dF9pcyh2KSAvLyBieSBcInRleHRcIiB3ZSBtZWFuIHN0cmluZ3MuXHJcblx0XHRcdHx8IGJpX2lzKHYpIC8vIGJ5IFwiYmluYXJ5XCIgd2UgbWVhbiBib29sZWFuLlxyXG5cdFx0XHR8fCBudW1faXModikpeyAvLyBieSBcIm51bWJlclwiIHdlIG1lYW4gaW50ZWdlcnMgb3IgZGVjaW1hbHMuIFxyXG5cdFx0XHRcdHJldHVybiB0cnVlOyAvLyBzaW1wbGUgdmFsdWVzIGFyZSB2YWxpZC5cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gVmFsLnJlbC5pcyh2KSB8fCBmYWxzZTsgLy8gaXMgdGhlIHZhbHVlIGEgc291bCByZWxhdGlvbj8gVGhlbiBpdCBpcyB2YWxpZCBhbmQgcmV0dXJuIGl0LiBJZiBub3QsIGV2ZXJ5dGhpbmcgZWxzZSByZW1haW5pbmcgaXMgYW4gaW52YWxpZCBkYXRhIHR5cGUuIEN1c3RvbSBleHRlbnNpb25zIGNhbiBiZSBidWlsdCBvbiB0b3Agb2YgdGhlc2UgcHJpbWl0aXZlcyB0byBzdXBwb3J0IG90aGVyIHR5cGVzLlxyXG5cdFx0fVxyXG5cdFx0VmFsLnJlbCA9IHtfOiAnIyd9O1xyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRWYWwucmVsLmlzID0gZnVuY3Rpb24odil7IC8vIHRoaXMgZGVmaW5lcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhIHNvdWwgcmVsYXRpb24gb3Igbm90LCB0aGV5IGxvb2sgbGlrZSB0aGlzOiB7JyMnOiAnVVVJRCd9XHJcblx0XHRcdFx0aWYodiAmJiB2W3JlbF9dICYmICF2Ll8gJiYgb2JqX2lzKHYpKXsgLy8gbXVzdCBiZSBhbiBvYmplY3QuXHJcblx0XHRcdFx0XHR2YXIgbyA9IHt9O1xyXG5cdFx0XHRcdFx0b2JqX21hcCh2LCBtYXAsIG8pO1xyXG5cdFx0XHRcdFx0aWYoby5pZCl7IC8vIGEgdmFsaWQgaWQgd2FzIGZvdW5kLlxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gby5pZDsgLy8geWF5ISBSZXR1cm4gaXQuXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZTsgLy8gdGhlIHZhbHVlIHdhcyBub3QgYSB2YWxpZCBzb3VsIHJlbGF0aW9uLlxyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcChzLCBmKXsgdmFyIG8gPSB0aGlzOyAvLyBtYXAgb3ZlciB0aGUgb2JqZWN0Li4uXHJcblx0XHRcdFx0aWYoby5pZCl7IHJldHVybiBvLmlkID0gZmFsc2UgfSAvLyBpZiBJRCBpcyBhbHJlYWR5IGRlZmluZWQgQU5EIHdlJ3JlIHN0aWxsIGxvb3BpbmcgdGhyb3VnaCB0aGUgb2JqZWN0LCBpdCBpcyBjb25zaWRlcmVkIGludmFsaWQuXHJcblx0XHRcdFx0aWYoZiA9PSByZWxfICYmIHRleHRfaXMocykpeyAvLyB0aGUgZmllbGQgc2hvdWxkIGJlICcjJyBhbmQgaGF2ZSBhIHRleHQgdmFsdWUuXHJcblx0XHRcdFx0XHRvLmlkID0gczsgLy8gd2UgZm91bmQgdGhlIHNvdWwhXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiBvLmlkID0gZmFsc2U7IC8vIGlmIHRoZXJlIGV4aXN0cyBhbnl0aGluZyBlbHNlIG9uIHRoZSBvYmplY3QgdGhhdCBpc24ndCB0aGUgc291bCwgdGhlbiBpdCBpcyBjb25zaWRlcmVkIGludmFsaWQuXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0VmFsLnJlbC5pZnkgPSBmdW5jdGlvbih0KXsgcmV0dXJuIG9ial9wdXQoe30sIHJlbF8sIHQpIH0gLy8gY29udmVydCBhIHNvdWwgaW50byBhIHJlbGF0aW9uIGFuZCByZXR1cm4gaXQuXHJcblx0XHR2YXIgcmVsXyA9IFZhbC5yZWwuXywgdTtcclxuXHRcdHZhciBiaV9pcyA9IFR5cGUuYmkuaXM7XHJcblx0XHR2YXIgbnVtX2lzID0gVHlwZS5udW0uaXM7XHJcblx0XHR2YXIgdGV4dF9pcyA9IFR5cGUudGV4dC5pcztcclxuXHRcdHZhciBvYmogPSBUeXBlLm9iaiwgb2JqX2lzID0gb2JqLmlzLCBvYmpfcHV0ID0gb2JqLnB1dCwgb2JqX21hcCA9IG9iai5tYXA7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IFZhbDtcclxuXHR9KShyZXF1aXJlLCAnLi92YWwnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBUeXBlID0gcmVxdWlyZSgnLi90eXBlJyk7XHJcblx0XHR2YXIgVmFsID0gcmVxdWlyZSgnLi92YWwnKTtcclxuXHRcdHZhciBOb2RlID0ge186ICdfJ307XHJcblx0XHROb2RlLnNvdWwgPSBmdW5jdGlvbihuLCBvKXsgcmV0dXJuIChuICYmIG4uXyAmJiBuLl9bbyB8fCBzb3VsX10pIH0gLy8gY29udmVuaWVuY2UgZnVuY3Rpb24gdG8gY2hlY2sgdG8gc2VlIGlmIHRoZXJlIGlzIGEgc291bCBvbiBhIG5vZGUgYW5kIHJldHVybiBpdC5cclxuXHRcdE5vZGUuc291bC5pZnkgPSBmdW5jdGlvbihuLCBvKXsgLy8gcHV0IGEgc291bCBvbiBhbiBvYmplY3QuXHJcblx0XHRcdG8gPSAodHlwZW9mIG8gPT09ICdzdHJpbmcnKT8ge3NvdWw6IG99IDogbyB8fCB7fTtcclxuXHRcdFx0biA9IG4gfHwge307IC8vIG1ha2Ugc3VyZSBpdCBleGlzdHMuXHJcblx0XHRcdG4uXyA9IG4uXyB8fCB7fTsgLy8gbWFrZSBzdXJlIG1ldGEgZXhpc3RzLlxyXG5cdFx0XHRuLl9bc291bF9dID0gby5zb3VsIHx8IG4uX1tzb3VsX10gfHwgdGV4dF9yYW5kb20oKTsgLy8gcHV0IHRoZSBzb3VsIG9uIGl0LlxyXG5cdFx0XHRyZXR1cm4gbjtcclxuXHRcdH1cclxuXHRcdE5vZGUuc291bC5fID0gVmFsLnJlbC5fO1xyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHROb2RlLmlzID0gZnVuY3Rpb24obiwgY2IsIGFzKXsgdmFyIHM7IC8vIGNoZWNrcyB0byBzZWUgaWYgYW4gb2JqZWN0IGlzIGEgdmFsaWQgbm9kZS5cclxuXHRcdFx0XHRpZighb2JqX2lzKG4pKXsgcmV0dXJuIGZhbHNlIH0gLy8gbXVzdCBiZSBhbiBvYmplY3QuXHJcblx0XHRcdFx0aWYocyA9IE5vZGUuc291bChuKSl7IC8vIG11c3QgaGF2ZSBhIHNvdWwgb24gaXQuXHJcblx0XHRcdFx0XHRyZXR1cm4gIW9ial9tYXAobiwgbWFwLCB7YXM6YXMsY2I6Y2IsczpzLG46bn0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7IC8vIG5vcGUhIFRoaXMgd2FzIG5vdCBhIHZhbGlkIG5vZGUuXHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbWFwKHYsIGYpeyAvLyB3ZSBpbnZlcnQgdGhpcyBiZWNhdXNlIHRoZSB3YXkgd2UgY2hlY2sgZm9yIHRoaXMgaXMgdmlhIGEgbmVnYXRpb24uXHJcblx0XHRcdFx0aWYoZiA9PT0gTm9kZS5fKXsgcmV0dXJuIH0gLy8gc2tpcCBvdmVyIHRoZSBtZXRhZGF0YS5cclxuXHRcdFx0XHRpZighVmFsLmlzKHYpKXsgcmV0dXJuIHRydWUgfSAvLyBpdCBpcyB0cnVlIHRoYXQgdGhpcyBpcyBhbiBpbnZhbGlkIG5vZGUuXHJcblx0XHRcdFx0aWYodGhpcy5jYil7IHRoaXMuY2IuY2FsbCh0aGlzLmFzLCB2LCBmLCB0aGlzLm4sIHRoaXMucykgfSAvLyBvcHRpb25hbGx5IGNhbGxiYWNrIGVhY2ggZmllbGQvdmFsdWUuXHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdE5vZGUuaWZ5ID0gZnVuY3Rpb24ob2JqLCBvLCBhcyl7IC8vIHJldHVybnMgYSBub2RlIGZyb20gYSBzaGFsbG93IG9iamVjdC5cclxuXHRcdFx0XHRpZighbyl7IG8gPSB7fSB9XHJcblx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgbyA9PT0gJ3N0cmluZycpeyBvID0ge3NvdWw6IG99IH1cclxuXHRcdFx0XHRlbHNlIGlmKG8gaW5zdGFuY2VvZiBGdW5jdGlvbil7IG8gPSB7bWFwOiBvfSB9XHJcblx0XHRcdFx0aWYoby5tYXApeyBvLm5vZGUgPSBvLm1hcC5jYWxsKGFzLCBvYmosIHUsIG8ubm9kZSB8fCB7fSkgfVxyXG5cdFx0XHRcdGlmKG8ubm9kZSA9IE5vZGUuc291bC5pZnkoby5ub2RlIHx8IHt9LCBvKSl7XHJcblx0XHRcdFx0XHRvYmpfbWFwKG9iaiwgbWFwLCB7bzpvLGFzOmFzfSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBvLm5vZGU7IC8vIFRoaXMgd2lsbCBvbmx5IGJlIGEgdmFsaWQgbm9kZSBpZiB0aGUgb2JqZWN0IHdhc24ndCBhbHJlYWR5IGRlZXAhXHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbWFwKHYsIGYpeyB2YXIgbyA9IHRoaXMubywgdG1wLCB1OyAvLyBpdGVyYXRlIG92ZXIgZWFjaCBmaWVsZC92YWx1ZS5cclxuXHRcdFx0XHRpZihvLm1hcCl7XHJcblx0XHRcdFx0XHR0bXAgPSBvLm1hcC5jYWxsKHRoaXMuYXMsIHYsICcnK2YsIG8ubm9kZSk7XHJcblx0XHRcdFx0XHRpZih1ID09PSB0bXApe1xyXG5cdFx0XHRcdFx0XHRvYmpfZGVsKG8ubm9kZSwgZik7XHJcblx0XHRcdFx0XHR9IGVsc2VcclxuXHRcdFx0XHRcdGlmKG8ubm9kZSl7IG8ubm9kZVtmXSA9IHRtcCB9XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKFZhbC5pcyh2KSl7XHJcblx0XHRcdFx0XHRvLm5vZGVbZl0gPSB2O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdHZhciBvYmogPSBUeXBlLm9iaiwgb2JqX2lzID0gb2JqLmlzLCBvYmpfZGVsID0gb2JqLmRlbCwgb2JqX21hcCA9IG9iai5tYXA7XHJcblx0XHR2YXIgdGV4dCA9IFR5cGUudGV4dCwgdGV4dF9yYW5kb20gPSB0ZXh0LnJhbmRvbTtcclxuXHRcdHZhciBzb3VsXyA9IE5vZGUuc291bC5fO1xyXG5cdFx0dmFyIHU7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IE5vZGU7XHJcblx0fSkocmVxdWlyZSwgJy4vbm9kZScpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIFR5cGUgPSByZXF1aXJlKCcuL3R5cGUnKTtcclxuXHRcdHZhciBOb2RlID0gcmVxdWlyZSgnLi9ub2RlJyk7XHJcblx0XHRmdW5jdGlvbiBTdGF0ZSgpe1xyXG5cdFx0XHR2YXIgdDtcclxuXHRcdFx0aWYocGVyZil7XHJcblx0XHRcdFx0dCA9IHN0YXJ0ICsgcGVyZi5ub3coKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0ID0gdGltZSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGxhc3QgPCB0KXtcclxuXHRcdFx0XHRyZXR1cm4gTiA9IDAsIGxhc3QgPSB0ICsgU3RhdGUuZHJpZnQ7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGxhc3QgPSB0ICsgKChOICs9IDEpIC8gRCkgKyBTdGF0ZS5kcmlmdDtcclxuXHRcdH1cclxuXHRcdHZhciB0aW1lID0gVHlwZS50aW1lLmlzLCBsYXN0ID0gLUluZmluaXR5LCBOID0gMCwgRCA9IDEwMDA7IC8vIFdBUk5JTkchIEluIHRoZSBmdXR1cmUsIG9uIG1hY2hpbmVzIHRoYXQgYXJlIEQgdGltZXMgZmFzdGVyIHRoYW4gMjAxNkFEIG1hY2hpbmVzLCB5b3Ugd2lsbCB3YW50IHRvIGluY3JlYXNlIEQgYnkgYW5vdGhlciBzZXZlcmFsIG9yZGVycyBvZiBtYWduaXR1ZGUgc28gdGhlIHByb2Nlc3Npbmcgc3BlZWQgbmV2ZXIgb3V0IHBhY2VzIHRoZSBkZWNpbWFsIHJlc29sdXRpb24gKGluY3JlYXNpbmcgYW4gaW50ZWdlciBlZmZlY3RzIHRoZSBzdGF0ZSBhY2N1cmFjeSkuXHJcblx0XHR2YXIgcGVyZiA9ICh0eXBlb2YgcGVyZm9ybWFuY2UgIT09ICd1bmRlZmluZWQnKT8gKHBlcmZvcm1hbmNlLnRpbWluZyAmJiBwZXJmb3JtYW5jZSkgOiBmYWxzZSwgc3RhcnQgPSAocGVyZiAmJiBwZXJmLnRpbWluZyAmJiBwZXJmLnRpbWluZy5uYXZpZ2F0aW9uU3RhcnQpIHx8IChwZXJmID0gZmFsc2UpO1xyXG5cdFx0U3RhdGUuXyA9ICc+JztcclxuXHRcdFN0YXRlLmRyaWZ0ID0gMDtcclxuXHRcdFN0YXRlLmlzID0gZnVuY3Rpb24obiwgZiwgbyl7IC8vIGNvbnZlbmllbmNlIGZ1bmN0aW9uIHRvIGdldCB0aGUgc3RhdGUgb24gYSBmaWVsZCBvbiBhIG5vZGUgYW5kIHJldHVybiBpdC5cclxuXHRcdFx0dmFyIHRtcCA9IChmICYmIG4gJiYgbltOX10gJiYgbltOX11bU3RhdGUuX10pIHx8IG87XHJcblx0XHRcdGlmKCF0bXApeyByZXR1cm4gfVxyXG5cdFx0XHRyZXR1cm4gbnVtX2lzKHRtcCA9IHRtcFtmXSk/IHRtcCA6IC1JbmZpbml0eTtcclxuXHRcdH1cclxuXHRcdFN0YXRlLmlmeSA9IGZ1bmN0aW9uKG4sIGYsIHMsIHYsIHNvdWwpeyAvLyBwdXQgYSBmaWVsZCdzIHN0YXRlIG9uIGEgbm9kZS5cclxuXHRcdFx0aWYoIW4gfHwgIW5bTl9dKXsgLy8gcmVqZWN0IGlmIGl0IGlzIG5vdCBub2RlLWxpa2UuXHJcblx0XHRcdFx0aWYoIXNvdWwpeyAvLyB1bmxlc3MgdGhleSBwYXNzZWQgYSBzb3VsXHJcblx0XHRcdFx0XHRyZXR1cm47IFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuID0gTm9kZS5zb3VsLmlmeShuLCBzb3VsKTsgLy8gdGhlbiBtYWtlIGl0IHNvIVxyXG5cdFx0XHR9IFxyXG5cdFx0XHR2YXIgdG1wID0gb2JqX2FzKG5bTl9dLCBTdGF0ZS5fKTsgLy8gZ3JhYiB0aGUgc3RhdGVzIGRhdGEuXHJcblx0XHRcdGlmKHUgIT09IGYgJiYgZiAhPT0gTl8pe1xyXG5cdFx0XHRcdGlmKG51bV9pcyhzKSl7XHJcblx0XHRcdFx0XHR0bXBbZl0gPSBzOyAvLyBhZGQgdGhlIHZhbGlkIHN0YXRlLlxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZih1ICE9PSB2KXsgLy8gTm90ZTogTm90IGl0cyBqb2IgdG8gY2hlY2sgZm9yIHZhbGlkIHZhbHVlcyFcclxuXHRcdFx0XHRcdG5bZl0gPSB2O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gbjtcclxuXHRcdH1cclxuXHRcdFN0YXRlLnRvID0gZnVuY3Rpb24oZnJvbSwgZiwgdG8pe1xyXG5cdFx0XHR2YXIgdmFsID0gZnJvbVtmXTtcclxuXHRcdFx0aWYob2JqX2lzKHZhbCkpe1xyXG5cdFx0XHRcdHZhbCA9IG9ial9jb3B5KHZhbCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIFN0YXRlLmlmeSh0bywgZiwgU3RhdGUuaXMoZnJvbSwgZiksIHZhbCwgTm9kZS5zb3VsKGZyb20pKTtcclxuXHRcdH1cclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0U3RhdGUubWFwID0gZnVuY3Rpb24oY2IsIHMsIGFzKXsgdmFyIHU7IC8vIGZvciB1c2Ugd2l0aCBOb2RlLmlmeVxyXG5cdFx0XHRcdHZhciBvID0gb2JqX2lzKG8gPSBjYiB8fCBzKT8gbyA6IG51bGw7XHJcblx0XHRcdFx0Y2IgPSBmbl9pcyhjYiA9IGNiIHx8IHMpPyBjYiA6IG51bGw7XHJcblx0XHRcdFx0aWYobyAmJiAhY2Ipe1xyXG5cdFx0XHRcdFx0cyA9IG51bV9pcyhzKT8gcyA6IFN0YXRlKCk7XHJcblx0XHRcdFx0XHRvW05fXSA9IG9bTl9dIHx8IHt9O1xyXG5cdFx0XHRcdFx0b2JqX21hcChvLCBtYXAsIHtvOm8sczpzfSk7XHJcblx0XHRcdFx0XHRyZXR1cm4gbztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YXMgPSBhcyB8fCBvYmpfaXMocyk/IHMgOiB1O1xyXG5cdFx0XHRcdHMgPSBudW1faXMocyk/IHMgOiBTdGF0ZSgpO1xyXG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbih2LCBmLCBvLCBvcHQpe1xyXG5cdFx0XHRcdFx0aWYoIWNiKXtcclxuXHRcdFx0XHRcdFx0bWFwLmNhbGwoe286IG8sIHM6IHN9LCB2LGYpO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNiLmNhbGwoYXMgfHwgdGhpcyB8fCB7fSwgdiwgZiwgbywgb3B0KTtcclxuXHRcdFx0XHRcdGlmKG9ial9oYXMobyxmKSAmJiB1ID09PSBvW2ZdKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdG1hcC5jYWxsKHtvOiBvLCBzOiBzfSwgdixmKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbWFwKHYsZil7XHJcblx0XHRcdFx0aWYoTl8gPT09IGYpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFN0YXRlLmlmeSh0aGlzLm8sIGYsIHRoaXMucykgO1xyXG5cdFx0XHR9XHJcblx0XHR9KCkpO1xyXG5cdFx0dmFyIG9iaiA9IFR5cGUub2JqLCBvYmpfYXMgPSBvYmouYXMsIG9ial9oYXMgPSBvYmouaGFzLCBvYmpfaXMgPSBvYmouaXMsIG9ial9tYXAgPSBvYmoubWFwLCBvYmpfY29weSA9IG9iai5jb3B5O1xyXG5cdFx0dmFyIG51bSA9IFR5cGUubnVtLCBudW1faXMgPSBudW0uaXM7XHJcblx0XHR2YXIgZm4gPSBUeXBlLmZuLCBmbl9pcyA9IGZuLmlzO1xyXG5cdFx0dmFyIE5fID0gTm9kZS5fLCB1O1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBTdGF0ZTtcclxuXHR9KShyZXF1aXJlLCAnLi9zdGF0ZScpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIFR5cGUgPSByZXF1aXJlKCcuL3R5cGUnKTtcclxuXHRcdHZhciBWYWwgPSByZXF1aXJlKCcuL3ZhbCcpO1xyXG5cdFx0dmFyIE5vZGUgPSByZXF1aXJlKCcuL25vZGUnKTtcclxuXHRcdHZhciBHcmFwaCA9IHt9O1xyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRHcmFwaC5pcyA9IGZ1bmN0aW9uKGcsIGNiLCBmbiwgYXMpeyAvLyBjaGVja3MgdG8gc2VlIGlmIGFuIG9iamVjdCBpcyBhIHZhbGlkIGdyYXBoLlxyXG5cdFx0XHRcdGlmKCFnIHx8ICFvYmpfaXMoZykgfHwgb2JqX2VtcHR5KGcpKXsgcmV0dXJuIGZhbHNlIH0gLy8gbXVzdCBiZSBhbiBvYmplY3QuXHJcblx0XHRcdFx0cmV0dXJuICFvYmpfbWFwKGcsIG1hcCwge2NiOmNiLGZuOmZuLGFzOmFzfSk7IC8vIG1ha2VzIHN1cmUgaXQgd2Fzbid0IGFuIGVtcHR5IG9iamVjdC5cclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBtYXAobiwgcyl7IC8vIHdlIGludmVydCB0aGlzIGJlY2F1c2UgdGhlIHdheSc/IHdlIGNoZWNrIGZvciB0aGlzIGlzIHZpYSBhIG5lZ2F0aW9uLlxyXG5cdFx0XHRcdGlmKCFuIHx8IHMgIT09IE5vZGUuc291bChuKSB8fCAhTm9kZS5pcyhuLCB0aGlzLmZuLCB0aGlzLmFzKSl7IHJldHVybiB0cnVlIH0gLy8gaXQgaXMgdHJ1ZSB0aGF0IHRoaXMgaXMgYW4gaW52YWxpZCBncmFwaC5cclxuXHRcdFx0XHRpZighdGhpcy5jYil7IHJldHVybiB9XHJcblx0XHRcdFx0bmYubiA9IG47IG5mLmFzID0gdGhpcy5hczsgLy8gc2VxdWVudGlhbCByYWNlIGNvbmRpdGlvbnMgYXJlbid0IHJhY2VzLlxyXG5cdFx0XHRcdHRoaXMuY2IuY2FsbChuZi5hcywgbiwgcywgbmYpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG5mKGZuKXsgLy8gb3B0aW9uYWwgY2FsbGJhY2sgZm9yIGVhY2ggbm9kZS5cclxuXHRcdFx0XHRpZihmbil7IE5vZGUuaXMobmYubiwgZm4sIG5mLmFzKSB9IC8vIHdoZXJlIHdlIHRoZW4gaGF2ZSBhbiBvcHRpb25hbCBjYWxsYmFjayBmb3IgZWFjaCBmaWVsZC92YWx1ZS5cclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdDsoZnVuY3Rpb24oKXtcclxuXHRcdFx0R3JhcGguaWZ5ID0gZnVuY3Rpb24ob2JqLCBlbnYsIGFzKXtcclxuXHRcdFx0XHR2YXIgYXQgPSB7cGF0aDogW10sIG9iajogb2JqfTtcclxuXHRcdFx0XHRpZighZW52KXtcclxuXHRcdFx0XHRcdGVudiA9IHt9O1xyXG5cdFx0XHRcdH0gZWxzZVxyXG5cdFx0XHRcdGlmKHR5cGVvZiBlbnYgPT09ICdzdHJpbmcnKXtcclxuXHRcdFx0XHRcdGVudiA9IHtzb3VsOiBlbnZ9O1xyXG5cdFx0XHRcdH0gZWxzZVxyXG5cdFx0XHRcdGlmKGVudiBpbnN0YW5jZW9mIEZ1bmN0aW9uKXtcclxuXHRcdFx0XHRcdGVudi5tYXAgPSBlbnY7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGVudi5zb3VsKXtcclxuXHRcdFx0XHRcdGF0LnJlbCA9IFZhbC5yZWwuaWZ5KGVudi5zb3VsKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZW52LmdyYXBoID0gZW52LmdyYXBoIHx8IHt9O1xyXG5cdFx0XHRcdGVudi5zZWVuID0gZW52LnNlZW4gfHwgW107XHJcblx0XHRcdFx0ZW52LmFzID0gZW52LmFzIHx8IGFzO1xyXG5cdFx0XHRcdG5vZGUoZW52LCBhdCk7XHJcblx0XHRcdFx0ZW52LnJvb3QgPSBhdC5ub2RlO1xyXG5cdFx0XHRcdHJldHVybiBlbnYuZ3JhcGg7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbm9kZShlbnYsIGF0KXsgdmFyIHRtcDtcclxuXHRcdFx0XHRpZih0bXAgPSBzZWVuKGVudiwgYXQpKXsgcmV0dXJuIHRtcCB9XHJcblx0XHRcdFx0YXQuZW52ID0gZW52O1xyXG5cdFx0XHRcdGF0LnNvdWwgPSBzb3VsO1xyXG5cdFx0XHRcdGlmKE5vZGUuaWZ5KGF0Lm9iaiwgbWFwLCBhdCkpe1xyXG5cdFx0XHRcdFx0Ly9hdC5yZWwgPSBhdC5yZWwgfHwgVmFsLnJlbC5pZnkoTm9kZS5zb3VsKGF0Lm5vZGUpKTtcclxuXHRcdFx0XHRcdGVudi5ncmFwaFtWYWwucmVsLmlzKGF0LnJlbCldID0gYXQubm9kZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGF0O1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcCh2LGYsbil7XHJcblx0XHRcdFx0dmFyIGF0ID0gdGhpcywgZW52ID0gYXQuZW52LCBpcywgdG1wO1xyXG5cdFx0XHRcdGlmKE5vZGUuXyA9PT0gZiAmJiBvYmpfaGFzKHYsVmFsLnJlbC5fKSl7XHJcblx0XHRcdFx0XHRyZXR1cm4gbi5fOyAvLyBUT0RPOiBCdWc/XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKCEoaXMgPSB2YWxpZCh2LGYsbiwgYXQsZW52KSkpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGlmKCFmKXtcclxuXHRcdFx0XHRcdGF0Lm5vZGUgPSBhdC5ub2RlIHx8IG4gfHwge307XHJcblx0XHRcdFx0XHRpZihvYmpfaGFzKHYsIE5vZGUuXykpe1xyXG5cdFx0XHRcdFx0XHRhdC5ub2RlLl8gPSBvYmpfY29weSh2Ll8pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YXQubm9kZSA9IE5vZGUuc291bC5pZnkoYXQubm9kZSwgVmFsLnJlbC5pcyhhdC5yZWwpKTtcclxuXHRcdFx0XHRcdGF0LnJlbCA9IGF0LnJlbCB8fCBWYWwucmVsLmlmeShOb2RlLnNvdWwoYXQubm9kZSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZih0bXAgPSBlbnYubWFwKXtcclxuXHRcdFx0XHRcdHRtcC5jYWxsKGVudi5hcyB8fCB7fSwgdixmLG4sIGF0KTtcclxuXHRcdFx0XHRcdGlmKG9ial9oYXMobixmKSl7XHJcblx0XHRcdFx0XHRcdHYgPSBuW2ZdO1xyXG5cdFx0XHRcdFx0XHRpZih1ID09PSB2KXtcclxuXHRcdFx0XHRcdFx0XHRvYmpfZGVsKG4sIGYpO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZighKGlzID0gdmFsaWQodixmLG4sIGF0LGVudikpKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoIWYpeyByZXR1cm4gYXQubm9kZSB9XHJcblx0XHRcdFx0aWYodHJ1ZSA9PT0gaXMpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHY7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRtcCA9IG5vZGUoZW52LCB7b2JqOiB2LCBwYXRoOiBhdC5wYXRoLmNvbmNhdChmKX0pO1xyXG5cdFx0XHRcdGlmKCF0bXAubm9kZSl7IHJldHVybiB9XHJcblx0XHRcdFx0cmV0dXJuIHRtcC5yZWw7IC8veycjJzogTm9kZS5zb3VsKHRtcC5ub2RlKX07XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gc291bChpZCl7IHZhciBhdCA9IHRoaXM7XHJcblx0XHRcdFx0dmFyIHByZXYgPSBWYWwucmVsLmlzKGF0LnJlbCksIGdyYXBoID0gYXQuZW52LmdyYXBoO1xyXG5cdFx0XHRcdGF0LnJlbCA9IGF0LnJlbCB8fCBWYWwucmVsLmlmeShpZCk7XHJcblx0XHRcdFx0YXQucmVsW1ZhbC5yZWwuX10gPSBpZDtcclxuXHRcdFx0XHRpZihhdC5ub2RlICYmIGF0Lm5vZGVbTm9kZS5fXSl7XHJcblx0XHRcdFx0XHRhdC5ub2RlW05vZGUuX11bVmFsLnJlbC5fXSA9IGlkO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihvYmpfaGFzKGdyYXBoLCBwcmV2KSl7XHJcblx0XHRcdFx0XHRncmFwaFtpZF0gPSBncmFwaFtwcmV2XTtcclxuXHRcdFx0XHRcdG9ial9kZWwoZ3JhcGgsIHByZXYpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiB2YWxpZCh2LGYsbiwgYXQsZW52KXsgdmFyIHRtcDtcclxuXHRcdFx0XHRpZihWYWwuaXModikpeyByZXR1cm4gdHJ1ZSB9XHJcblx0XHRcdFx0aWYob2JqX2lzKHYpKXsgcmV0dXJuIDEgfVxyXG5cdFx0XHRcdGlmKHRtcCA9IGVudi5pbnZhbGlkKXtcclxuXHRcdFx0XHRcdHYgPSB0bXAuY2FsbChlbnYuYXMgfHwge30sIHYsZixuKTtcclxuXHRcdFx0XHRcdHJldHVybiB2YWxpZCh2LGYsbiwgYXQsZW52KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZW52LmVyciA9IFwiSW52YWxpZCB2YWx1ZSBhdCAnXCIgKyBhdC5wYXRoLmNvbmNhdChmKS5qb2luKCcuJykgKyBcIichXCI7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gc2VlbihlbnYsIGF0KXtcclxuXHRcdFx0XHR2YXIgYXJyID0gZW52LnNlZW4sIGkgPSBhcnIubGVuZ3RoLCBoYXM7XHJcblx0XHRcdFx0d2hpbGUoaS0tKXsgaGFzID0gYXJyW2ldO1xyXG5cdFx0XHRcdFx0aWYoYXQub2JqID09PSBoYXMub2JqKXsgcmV0dXJuIGhhcyB9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGFyci5wdXNoKGF0KTtcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdEdyYXBoLm5vZGUgPSBmdW5jdGlvbihub2RlKXtcclxuXHRcdFx0dmFyIHNvdWwgPSBOb2RlLnNvdWwobm9kZSk7XHJcblx0XHRcdGlmKCFzb3VsKXsgcmV0dXJuIH1cclxuXHRcdFx0cmV0dXJuIG9ial9wdXQoe30sIHNvdWwsIG5vZGUpO1xyXG5cdFx0fVxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRHcmFwaC50byA9IGZ1bmN0aW9uKGdyYXBoLCByb290LCBvcHQpe1xyXG5cdFx0XHRcdGlmKCFncmFwaCl7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIG9iaiA9IHt9O1xyXG5cdFx0XHRcdG9wdCA9IG9wdCB8fCB7c2Vlbjoge319O1xyXG5cdFx0XHRcdG9ial9tYXAoZ3JhcGhbcm9vdF0sIG1hcCwge29iajpvYmosIGdyYXBoOiBncmFwaCwgb3B0OiBvcHR9KTtcclxuXHRcdFx0XHRyZXR1cm4gb2JqO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcCh2LGYpeyB2YXIgdG1wLCBvYmo7XHJcblx0XHRcdFx0aWYoTm9kZS5fID09PSBmKXtcclxuXHRcdFx0XHRcdGlmKG9ial9lbXB0eSh2LCBWYWwucmVsLl8pKXtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dGhpcy5vYmpbZl0gPSBvYmpfY29weSh2KTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoISh0bXAgPSBWYWwucmVsLmlzKHYpKSl7XHJcblx0XHRcdFx0XHR0aGlzLm9ialtmXSA9IHY7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKG9iaiA9IHRoaXMub3B0LnNlZW5bdG1wXSl7XHJcblx0XHRcdFx0XHR0aGlzLm9ialtmXSA9IG9iajtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5vYmpbZl0gPSB0aGlzLm9wdC5zZWVuW3RtcF0gPSBHcmFwaC50byh0aGlzLmdyYXBoLCB0bXAsIHRoaXMub3B0KTtcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHRcdHZhciBmbl9pcyA9IFR5cGUuZm4uaXM7XHJcblx0XHR2YXIgb2JqID0gVHlwZS5vYmosIG9ial9pcyA9IG9iai5pcywgb2JqX2RlbCA9IG9iai5kZWwsIG9ial9oYXMgPSBvYmouaGFzLCBvYmpfZW1wdHkgPSBvYmouZW1wdHksIG9ial9wdXQgPSBvYmoucHV0LCBvYmpfbWFwID0gb2JqLm1hcCwgb2JqX2NvcHkgPSBvYmouY29weTtcclxuXHRcdHZhciB1O1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBHcmFwaDtcclxuXHR9KShyZXF1aXJlLCAnLi9ncmFwaCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIFR5cGUgPSByZXF1aXJlKCcuL3R5cGUnKTtcclxuXHRcdGZ1bmN0aW9uIER1cCgpe1xyXG5cdFx0XHR0aGlzLmNhY2hlID0ge307XHJcblx0XHR9XHJcblx0XHREdXAucHJvdG90eXBlLnRyYWNrID0gZnVuY3Rpb24oaWQpe1xyXG5cdFx0XHR0aGlzLmNhY2hlW2lkXSA9IFR5cGUudGltZS5pcygpO1xyXG5cdFx0XHRpZiAoIXRoaXMudG8pIHtcclxuXHRcdFx0XHR0aGlzLmdjKCk7IC8vIEVuZ2FnZSBHQy5cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gaWQ7XHJcblx0XHR9O1xyXG5cdFx0RHVwLnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGlkKXtcclxuXHRcdFx0Ly8gSGF2ZSB3ZSBzZWVuIHRoaXMgSUQgcmVjZW50bHk/XHJcblx0XHRcdHJldHVybiBUeXBlLm9iai5oYXModGhpcy5jYWNoZSwgaWQpPyB0aGlzLnRyYWNrKGlkKSA6IGZhbHNlOyAvLyBJbXBvcnRhbnQsIGJ1bXAgdGhlIElEJ3MgbGl2ZWxpbmVzcyBpZiBpdCBoYXMgYWxyZWFkeSBiZWVuIHNlZW4gYmVmb3JlIC0gdGhpcyBpcyBjcml0aWNhbCB0byBzdG9wcGluZyBicm9hZGNhc3Qgc3Rvcm1zLlxyXG5cdFx0fVxyXG5cdFx0RHVwLnByb3RvdHlwZS5nYyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBkZSA9IHRoaXMsIG5vdyA9IFR5cGUudGltZS5pcygpLCBvbGRlc3QgPSBub3csIG1heEFnZSA9IDUgKiA2MCAqIDEwMDA7XHJcblx0XHRcdC8vIFRPRE86IEd1bi5zY2hlZHVsZXIgYWxyZWFkeSBkb2VzIHRoaXM/IFJldXNlIHRoYXQuXHJcblx0XHRcdFR5cGUub2JqLm1hcChkZS5jYWNoZSwgZnVuY3Rpb24odGltZSwgaWQpe1xyXG5cdFx0XHRcdG9sZGVzdCA9IE1hdGgubWluKG5vdywgdGltZSk7XHJcblx0XHRcdFx0aWYgKChub3cgLSB0aW1lKSA8IG1heEFnZSl7IHJldHVybiB9XHJcblx0XHRcdFx0VHlwZS5vYmouZGVsKGRlLmNhY2hlLCBpZCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHR2YXIgZG9uZSA9IFR5cGUub2JqLmVtcHR5KGRlLmNhY2hlKTtcclxuXHRcdFx0aWYoZG9uZSl7XHJcblx0XHRcdFx0ZGUudG8gPSBudWxsOyAvLyBEaXNlbmdhZ2UgR0MuXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBlbGFwc2VkID0gbm93IC0gb2xkZXN0OyAvLyBKdXN0IGhvdyBvbGQ/XHJcblx0XHRcdHZhciBuZXh0R0MgPSBtYXhBZ2UgLSBlbGFwc2VkOyAvLyBIb3cgbG9uZyBiZWZvcmUgaXQncyB0b28gb2xkP1xyXG5cdFx0XHRkZS50byA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgZGUuZ2MoKSB9LCBuZXh0R0MpOyAvLyBTY2hlZHVsZSB0aGUgbmV4dCBHQyBldmVudC5cclxuXHRcdH1cclxuXHRcdG1vZHVsZS5leHBvcnRzID0gRHVwO1xyXG5cdH0pKHJlcXVpcmUsICcuL2R1cCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cclxuXHRcdGZ1bmN0aW9uIEd1bihvKXtcclxuXHRcdFx0aWYobyBpbnN0YW5jZW9mIEd1bil7IHJldHVybiAodGhpcy5fID0ge2d1bjogdGhpc30pLmd1biB9XHJcblx0XHRcdGlmKCEodGhpcyBpbnN0YW5jZW9mIEd1bikpeyByZXR1cm4gbmV3IEd1bihvKSB9XHJcblx0XHRcdHJldHVybiBHdW4uY3JlYXRlKHRoaXMuXyA9IHtndW46IHRoaXMsIG9wdDogb30pO1xyXG5cdFx0fVxyXG5cclxuXHRcdEd1bi5pcyA9IGZ1bmN0aW9uKGd1bil7IHJldHVybiAoZ3VuIGluc3RhbmNlb2YgR3VuKSB9XHJcblxyXG5cdFx0R3VuLnZlcnNpb24gPSAwLjc7XHJcblxyXG5cdFx0R3VuLmNoYWluID0gR3VuLnByb3RvdHlwZTtcclxuXHRcdEd1bi5jaGFpbi50b0pTT04gPSBmdW5jdGlvbigpe307XHJcblxyXG5cdFx0dmFyIFR5cGUgPSByZXF1aXJlKCcuL3R5cGUnKTtcclxuXHRcdFR5cGUub2JqLnRvKFR5cGUsIEd1bik7XHJcblx0XHRHdW4uSEFNID0gcmVxdWlyZSgnLi9IQU0nKTtcclxuXHRcdEd1bi52YWwgPSByZXF1aXJlKCcuL3ZhbCcpO1xyXG5cdFx0R3VuLm5vZGUgPSByZXF1aXJlKCcuL25vZGUnKTtcclxuXHRcdEd1bi5zdGF0ZSA9IHJlcXVpcmUoJy4vc3RhdGUnKTtcclxuXHRcdEd1bi5ncmFwaCA9IHJlcXVpcmUoJy4vZ3JhcGgnKTtcclxuXHRcdEd1bi5kdXAgPSByZXF1aXJlKCcuL2R1cCcpO1xyXG5cdFx0R3VuLnNjaGVkdWxlID0gcmVxdWlyZSgnLi9zY2hlZHVsZScpO1xyXG5cdFx0R3VuLm9uID0gcmVxdWlyZSgnLi9vbmlmeScpKCk7XHJcblx0XHRcclxuXHRcdEd1bi5fID0geyAvLyBzb21lIHJlc2VydmVkIGtleSB3b3JkcywgdGhlc2UgYXJlIG5vdCB0aGUgb25seSBvbmVzLlxyXG5cdFx0XHRub2RlOiBHdW4ubm9kZS5fIC8vIGFsbCBtZXRhZGF0YSBvZiBhIG5vZGUgaXMgc3RvcmVkIGluIHRoZSBtZXRhIHByb3BlcnR5IG9uIHRoZSBub2RlLlxyXG5cdFx0XHQsc291bDogR3VuLnZhbC5yZWwuXyAvLyBhIHNvdWwgaXMgYSBVVUlEIG9mIGEgbm9kZSBidXQgaXQgYWx3YXlzIHBvaW50cyB0byB0aGUgXCJsYXRlc3RcIiBkYXRhIGtub3duLlxyXG5cdFx0XHQsc3RhdGU6IEd1bi5zdGF0ZS5fIC8vIG90aGVyIHRoYW4gdGhlIHNvdWwsIHdlIHN0b3JlIEhBTSBtZXRhZGF0YS5cclxuXHRcdFx0LGZpZWxkOiAnLicgLy8gYSBmaWVsZCBpcyBhIHByb3BlcnR5IG9uIGEgbm9kZSB3aGljaCBwb2ludHMgdG8gYSB2YWx1ZS5cclxuXHRcdFx0LHZhbHVlOiAnPScgLy8gdGhlIHByaW1pdGl2ZSB2YWx1ZS5cclxuXHRcdH1cclxuXHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdEd1bi5jcmVhdGUgPSBmdW5jdGlvbihhdCl7XHJcblx0XHRcdFx0YXQub24gPSBhdC5vbiB8fCBHdW4ub247XHJcblx0XHRcdFx0YXQucm9vdCA9IGF0LnJvb3QgfHwgYXQuZ3VuO1xyXG5cdFx0XHRcdGF0LmdyYXBoID0gYXQuZ3JhcGggfHwge307XHJcblx0XHRcdFx0YXQuZHVwID0gYXQuZHVwIHx8IG5ldyBHdW4uZHVwO1xyXG5cdFx0XHRcdGF0LmFzayA9IEd1bi5vbi5hc2s7XHJcblx0XHRcdFx0YXQuYWNrID0gR3VuLm9uLmFjaztcclxuXHRcdFx0XHR2YXIgZ3VuID0gYXQuZ3VuLm9wdChhdC5vcHQpO1xyXG5cdFx0XHRcdGlmKCFhdC5vbmNlKXtcclxuXHRcdFx0XHRcdGF0Lm9uKCdpbicsIHJvb3QsIGF0KTtcclxuXHRcdFx0XHRcdGF0Lm9uKCdvdXQnLCByb290LCBhdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGF0Lm9uY2UgPSAxO1xyXG5cdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gcm9vdChhdCl7XHJcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcImFkZCB0by5uZXh0KGF0KVwiKTsgLy8gVE9ETzogQlVHISEhXHJcblx0XHRcdFx0dmFyIGV2ID0gdGhpcywgY2F0ID0gZXYuYXMsIGNvYXQ7XHJcblx0XHRcdFx0aWYoIWF0Lmd1bil7IGF0Lmd1biA9IGNhdC5ndW4gfVxyXG5cdFx0XHRcdGlmKCFhdFsnIyddKXsgYXRbJyMnXSA9IEd1bi50ZXh0LnJhbmRvbSgpIH0gLy8gVE9ETzogVXNlIHdoYXQgaXMgdXNlZCBvdGhlciBwbGFjZXMgaW5zdGVhZC5cclxuXHRcdFx0XHRpZihjYXQuZHVwLmNoZWNrKGF0WycjJ10pKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRpZihhdFsnQCddKXtcclxuXHRcdFx0XHRcdC8vIFRPRE86IEJVRyEgRm9yIG11bHRpLWluc3RhbmNlcywgdGhlIFwiYWNrXCIgc3lzdGVtIGlzIGdsb2JhbGx5IHNoYXJlZCwgYnV0IGl0IHNob3VsZG4ndCBiZS5cclxuXHRcdFx0XHRcdGlmKGNhdC5hY2soYXRbJ0AnXSwgYXQpKXsgcmV0dXJuIH0gLy8gVE9ETzogQ29uc2lkZXIgbm90IHJldHVybmluZyBoZXJlLCBtYXliZSwgd2hlcmUgdGhpcyB3b3VsZCBsZXQgdGhlIFwiaGFuZHNoYWtlXCIgb24gc3luYyBvY2N1ciBmb3IgSG9seSBHcmFpbD9cclxuXHRcdFx0XHRcdGNhdC5kdXAudHJhY2soYXRbJyMnXSk7XHJcblx0XHRcdFx0XHRHdW4ub24oJ291dCcsIG9ial90byhhdCwge2d1bjogY2F0Lmd1bn0pKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2F0LmR1cC50cmFjayhhdFsnIyddKTtcclxuXHRcdFx0XHQvL2lmKGNhdC5hY2soYXRbJ0AnXSwgYXQpKXsgcmV0dXJuIH1cclxuXHRcdFx0XHQvL2NhdC5hY2soYXRbJ0AnXSwgYXQpO1xyXG5cdFx0XHRcdGNvYXQgPSBvYmpfdG8oYXQsIHtndW46IGNhdC5ndW59KTtcclxuXHRcdFx0XHRpZihhdC5nZXQpe1xyXG5cdFx0XHRcdFx0Ly9HdW4ub24uR0VUKGNvYXQpO1xyXG5cdFx0XHRcdFx0R3VuLm9uKCdnZXQnLCBjb2F0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoYXQucHV0KXtcclxuXHRcdFx0XHRcdC8vR3VuLm9uLlBVVChjb2F0KTtcclxuXHRcdFx0XHRcdEd1bi5vbigncHV0JywgY29hdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdEd1bi5vbignb3V0JywgY29hdCk7XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRHdW4ub24oJ3B1dCcsIGZ1bmN0aW9uKGF0KXtcclxuXHRcdFx0Ly9HdW4ub24uUFVUID0gZnVuY3Rpb24oYXQpe1xyXG5cdFx0XHRcdGlmKCFhdFsnIyddKXsgcmV0dXJuIHRoaXMudG8ubmV4dChhdCkgfSAvLyBmb3IgdGVzdHMuXHJcblx0XHRcdFx0dmFyIGV2ID0gdGhpcywgY3R4ID0ge2d1bjogYXQuZ3VuLCBncmFwaDogYXQuZ3VuLl8uZ3JhcGgsIHB1dDoge30sIG1hcDoge30sIG1hY2hpbmU6IEd1bi5zdGF0ZSgpfTtcclxuXHRcdFx0XHRpZighR3VuLmdyYXBoLmlzKGF0LnB1dCwgbnVsbCwgdmVyaWZ5LCBjdHgpKXsgY3R4LmVyciA9IFwiRXJyb3I6IEludmFsaWQgZ3JhcGghXCIgfVxyXG5cdFx0XHRcdGlmKGN0eC5lcnIpeyByZXR1cm4gY3R4Lmd1bi5vbignaW4nLCB7J0AnOiBhdFsnIyddLCBlcnI6IEd1bi5sb2coY3R4LmVycikgfSkgfVxyXG5cdFx0XHRcdG9ial9tYXAoY3R4LnB1dCwgbWVyZ2UsIGN0eCk7XHJcblx0XHRcdFx0b2JqX21hcChjdHgubWFwLCBtYXAsIGN0eCk7XHJcblx0XHRcdFx0aWYodSAhPT0gY3R4LmRlZmVyKXtcclxuXHRcdFx0XHRcdEd1bi5zY2hlZHVsZShjdHguZGVmZXIsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRcdEd1bi5vbigncHV0JywgYXQpO1xyXG5cdFx0XHRcdFx0fSwgR3VuLnN0YXRlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoIWN0eC5kaWZmKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRldi50by5uZXh0KG9ial90byhhdCwge3B1dDogY3R4LmRpZmZ9KSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRmdW5jdGlvbiB2ZXJpZnkodmFsLCBrZXksIG5vZGUsIHNvdWwpeyB2YXIgY3R4ID0gdGhpcztcclxuXHRcdFx0XHR2YXIgc3RhdGUgPSBHdW4uc3RhdGUuaXMobm9kZSwga2V5KSwgdG1wO1xyXG5cdFx0XHRcdGlmKCFzdGF0ZSl7IHJldHVybiBjdHguZXJyID0gXCJFcnJvcjogTm8gc3RhdGUgb24gJ1wiK2tleStcIicgaW4gbm9kZSAnXCIrc291bCtcIichXCIgfVxyXG5cdFx0XHRcdHZhciB2ZXJ0ZXggPSBjdHguZ3JhcGhbc291bF0gfHwgZW1wdHksIHdhcyA9IEd1bi5zdGF0ZS5pcyh2ZXJ0ZXgsIGtleSwgdHJ1ZSksIGtub3duID0gdmVydGV4W2tleV07XHJcblx0XHRcdFx0dmFyIEhBTSA9IEd1bi5IQU0oY3R4Lm1hY2hpbmUsIHN0YXRlLCB3YXMsIHZhbCwga25vd24pO1xyXG5cdFx0XHRcdGlmKCFIQU0uaW5jb21pbmcpe1xyXG5cdFx0XHRcdFx0aWYoSEFNLmRlZmVyKXsgLy8gcGljayB0aGUgbG93ZXN0XHJcblx0XHRcdFx0XHRcdGN0eC5kZWZlciA9IChzdGF0ZSA8IChjdHguZGVmZXIgfHwgSW5maW5pdHkpKT8gc3RhdGUgOiBjdHguZGVmZXI7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGN0eC5wdXRbc291bF0gPSBHdW4uc3RhdGUudG8obm9kZSwga2V5LCBjdHgucHV0W3NvdWxdKTtcclxuXHRcdFx0XHQoY3R4LmRpZmYgfHwgKGN0eC5kaWZmID0ge30pKVtzb3VsXSA9IEd1bi5zdGF0ZS50byhub2RlLCBrZXksIGN0eC5kaWZmW3NvdWxdKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBtZXJnZShub2RlLCBzb3VsKXtcclxuXHRcdFx0XHR2YXIgcmVmID0gKCh0aGlzLmd1bi5fKS5uZXh0IHx8IGVtcHR5KVtzb3VsXTtcclxuXHRcdFx0XHRpZighcmVmKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgYXQgPSB0aGlzLm1hcFtzb3VsXSA9IHtcclxuXHRcdFx0XHRcdHB1dDogdGhpcy5ub2RlID0gbm9kZSxcclxuXHRcdFx0XHRcdGdldDogdGhpcy5zb3VsID0gc291bCxcclxuXHRcdFx0XHRcdGd1bjogdGhpcy5yZWYgPSByZWZcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdG9ial9tYXAobm9kZSwgZWFjaCwgdGhpcyk7XHJcblx0XHRcdFx0R3VuLm9uKCdub2RlJywgYXQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIGVhY2godmFsLCBrZXkpe1xyXG5cdFx0XHRcdHZhciBncmFwaCA9IHRoaXMuZ3JhcGgsIHNvdWwgPSB0aGlzLnNvdWwsIGNhdCA9ICh0aGlzLnJlZi5fKSwgdG1wO1xyXG5cdFx0XHRcdGdyYXBoW3NvdWxdID0gR3VuLnN0YXRlLnRvKHRoaXMubm9kZSwga2V5LCBncmFwaFtzb3VsXSk7XHJcblx0XHRcdFx0KGNhdC5wdXQgfHwgKGNhdC5wdXQgPSB7fSkpW2tleV0gPSB2YWw7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gbWFwKGF0LCBzb3VsKXtcclxuXHRcdFx0XHRpZighYXQuZ3VuKXsgcmV0dXJuIH1cclxuXHRcdFx0XHQoYXQuZ3VuLl8pLm9uKCdpbicsIGF0KTtcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdEd1bi5vbignZ2V0JywgZnVuY3Rpb24oYXQpe1xyXG5cdFx0XHRcdHZhciBldiA9IHRoaXMsIHNvdWwgPSBhdC5nZXRbX3NvdWxdLCBjYXQgPSBhdC5ndW4uXywgbm9kZSA9IGNhdC5ncmFwaFtzb3VsXSwgZmllbGQgPSBhdC5nZXRbX2ZpZWxkXSwgdG1wO1xyXG5cdFx0XHRcdHZhciBuZXh0ID0gY2F0Lm5leHQgfHwgKGNhdC5uZXh0ID0ge30pLCBhcyA9ICgobmV4dFtzb3VsXSB8fCBlbXB0eSkuXyk7XHJcblx0XHRcdFx0aWYoIW5vZGUgfHwgIWFzKXsgcmV0dXJuIGV2LnRvLm5leHQoYXQpIH1cclxuXHRcdFx0XHRpZihmaWVsZCl7XHJcblx0XHRcdFx0XHRpZighb2JqX2hhcyhub2RlLCBmaWVsZCkpeyByZXR1cm4gZXYudG8ubmV4dChhdCkgfVxyXG5cdFx0XHRcdFx0bm9kZSA9IEd1bi5zdGF0ZS50byhub2RlLCBmaWVsZCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdG5vZGUgPSBHdW4ub2JqLmNvcHkobm9kZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vaWYoYXQuZ3VuID09PSBjYXQuZ3VuKXtcclxuXHRcdFx0XHRcdG5vZGUgPSBHdW4uZ3JhcGgubm9kZShub2RlKTsgLy8gVE9ETzogQlVHISBDbG9uZSBub2RlP1xyXG5cdFx0XHRcdC8vfSBlbHNlIHtcclxuXHRcdFx0XHQvL1x0Y2F0ID0gKGF0Lmd1bi5fKTtcclxuXHRcdFx0XHQvL31cclxuXHRcdFx0XHR0bXAgPSBhcy5hY2s7XHJcblx0XHRcdFx0Y2F0Lm9uKCdpbicsIHtcclxuXHRcdFx0XHRcdCdAJzogYXRbJyMnXSxcclxuXHRcdFx0XHRcdGhvdzogJ21lbScsXHJcblx0XHRcdFx0XHRwdXQ6IG5vZGUsXHJcblx0XHRcdFx0XHRndW46IGFzLmd1blxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdGlmKDAgPCB0bXApe1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRldi50by5uZXh0KGF0KTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KCkpO1xyXG5cdFx0XHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdEd1bi5vbi5hc2sgPSBmdW5jdGlvbihjYiwgYXMpe1xyXG5cdFx0XHRcdGlmKCF0aGlzLm9uKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgaWQgPSBHdW4udGV4dC5yYW5kb20oKTtcclxuXHRcdFx0XHRpZihjYil7IHRoaXMub24oaWQsIGNiLCBhcykgfVxyXG5cdFx0XHRcdHJldHVybiBpZDtcclxuXHRcdFx0fVxyXG5cdFx0XHRHdW4ub24uYWNrID0gZnVuY3Rpb24oYXQsIHJlcGx5KXtcclxuXHRcdFx0XHRpZighYXQgfHwgIXJlcGx5IHx8ICF0aGlzLm9uKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgaWQgPSBhdFsnIyddIHx8IGF0O1xyXG5cdFx0XHRcdGlmKCF0aGlzLnRhZyB8fCAhdGhpcy50YWdbaWRdKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR0aGlzLm9uKGlkLCByZXBseSk7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblxyXG5cdFx0OyhmdW5jdGlvbigpe1xyXG5cdFx0XHRHdW4uY2hhaW4ub3B0ID0gZnVuY3Rpb24ob3B0KXtcclxuXHRcdFx0XHRvcHQgPSBvcHQgfHwge307XHJcblx0XHRcdFx0dmFyIGd1biA9IHRoaXMsIGF0ID0gZ3VuLl8sIHRtcCA9IG9wdC5wZWVycyB8fCBvcHQ7XHJcblx0XHRcdFx0aWYoIW9ial9pcyhvcHQpKXsgb3B0ID0ge30gfVxyXG5cdFx0XHRcdGlmKCFvYmpfaXMoYXQub3B0KSl7IGF0Lm9wdCA9IG9wdCB9XHJcblx0XHRcdFx0aWYodGV4dF9pcyh0bXApKXsgdG1wID0gW3RtcF0gfVxyXG5cdFx0XHRcdGlmKGxpc3RfaXModG1wKSl7XHJcblx0XHRcdFx0XHR0bXAgPSBvYmpfbWFwKHRtcCwgZnVuY3Rpb24odXJsLCBpLCBtYXApe1xyXG5cdFx0XHRcdFx0XHRtYXAodXJsLCB7dXJsOiB1cmx9KTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0aWYoIW9ial9pcyhhdC5vcHQucGVlcnMpKXsgYXQub3B0LnBlZXJzID0ge319XHJcblx0XHRcdFx0XHRhdC5vcHQucGVlcnMgPSBvYmpfdG8odG1wLCBhdC5vcHQucGVlcnMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRhdC5vcHQud3NjID0gYXQub3B0LndzYyB8fCB7cHJvdG9jb2xzOm51bGx9IFxyXG5cdFx0XHRcdGF0Lm9wdC5wZWVycyA9IGF0Lm9wdC5wZWVycyB8fCB7fTtcclxuXHRcdFx0XHRvYmpfdG8ob3B0LCBhdC5vcHQpOyAvLyBjb3BpZXMgb3B0aW9ucyBvbiB0byBgYXQub3B0YCBvbmx5IGlmIG5vdCBhbHJlYWR5IHRha2VuLlxyXG5cdFx0XHRcdEd1bi5vbignb3B0JywgYXQpO1xyXG5cdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdH1cclxuXHRcdH0oKSk7XHJcblxyXG5cdFx0dmFyIHRleHRfaXMgPSBHdW4udGV4dC5pcztcclxuXHRcdHZhciBsaXN0X2lzID0gR3VuLmxpc3QuaXM7XHJcblx0XHR2YXIgb2JqID0gR3VuLm9iaiwgb2JqX2lzID0gb2JqLmlzLCBvYmpfaGFzID0gb2JqLmhhcywgb2JqX3RvID0gb2JqLnRvLCBvYmpfbWFwID0gb2JqLm1hcCwgb2JqX2NvcHkgPSBvYmouY29weTtcclxuXHRcdHZhciBfc291bCA9IEd1bi5fLnNvdWwsIF9maWVsZCA9IEd1bi5fLmZpZWxkLCByZWxfaXMgPSBHdW4udmFsLnJlbC5pcztcclxuXHRcdHZhciBlbXB0eSA9IHt9LCB1O1xyXG5cclxuXHRcdGNvbnNvbGUuZGVidWcgPSBmdW5jdGlvbihpLCBzKXsgcmV0dXJuIChjb25zb2xlLmRlYnVnLmkgJiYgaSA9PT0gY29uc29sZS5kZWJ1Zy5pICYmIGNvbnNvbGUuZGVidWcuaSsrKSAmJiAoY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKSB8fCBzKSB9O1xyXG5cclxuXHRcdEd1bi5sb2cgPSBmdW5jdGlvbigpeyByZXR1cm4gKCFHdW4ubG9nLm9mZiAmJiBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpKSwgW10uc2xpY2UuY2FsbChhcmd1bWVudHMpLmpvaW4oJyAnKSB9XHJcblx0XHRHdW4ubG9nLm9uY2UgPSBmdW5jdGlvbih3LHMsbyl7IHJldHVybiAobyA9IEd1bi5sb2cub25jZSlbd10gPSBvW3ddIHx8IDAsIG9bd10rKyB8fCBHdW4ubG9nKHMpIH1cclxuXHJcblx0XHQ7XCJQbGVhc2UgZG8gbm90IHJlbW92ZSB0aGVzZSBtZXNzYWdlcyB1bmxlc3MgeW91IGFyZSBwYXlpbmcgZm9yIGEgbW9udGhseSBzcG9uc29yc2hpcCwgdGhhbmtzIVwiO1xyXG5cdFx0R3VuLmxvZy5vbmNlKFwid2VsY29tZVwiLCBcIkhlbGxvIHdvbmRlcmZ1bCBwZXJzb24hIDopIFRoYW5rcyBmb3IgdXNpbmcgR1VOLCBmZWVsIGZyZWUgdG8gYXNrIGZvciBoZWxwIG9uIGh0dHBzOi8vZ2l0dGVyLmltL2FtYXJrL2d1biBhbmQgYXNrIFN0YWNrT3ZlcmZsb3cgcXVlc3Rpb25zIHRhZ2dlZCB3aXRoICdndW4nIVwiKTtcclxuXHRcdDtcIlBsZWFzZSBkbyBub3QgcmVtb3ZlIHRoZXNlIG1lc3NhZ2VzIHVubGVzcyB5b3UgYXJlIHBheWluZyBmb3IgYSBtb250aGx5IHNwb25zb3JzaGlwLCB0aGFua3MhXCI7XHJcblx0XHRcclxuXHRcdGlmKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpeyB3aW5kb3cuR3VuID0gR3VuIH1cclxuXHRcdGlmKHR5cGVvZiBjb21tb24gIT09IFwidW5kZWZpbmVkXCIpeyBjb21tb24uZXhwb3J0cyA9IEd1biB9XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IEd1bjtcclxuXHR9KShyZXF1aXJlLCAnLi9yb290Jyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9yb290Jyk7XHJcblx0XHRHdW4uY2hhaW4uYmFjayA9IGZ1bmN0aW9uKG4sIG9wdCl7IHZhciB0bXA7XHJcblx0XHRcdGlmKC0xID09PSBuIHx8IEluZmluaXR5ID09PSBuKXtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5fLnJvb3Q7XHJcblx0XHRcdH0gZWxzZVxyXG5cdFx0XHRpZigxID09PSBuKXtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5fLmJhY2sgfHwgdGhpcztcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgZ3VuID0gdGhpcywgYXQgPSBndW4uXztcclxuXHRcdFx0aWYodHlwZW9mIG4gPT09ICdzdHJpbmcnKXtcclxuXHRcdFx0XHRuID0gbi5zcGxpdCgnLicpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKG4gaW5zdGFuY2VvZiBBcnJheSl7XHJcblx0XHRcdFx0dmFyIGkgPSAwLCBsID0gbi5sZW5ndGgsIHRtcCA9IGF0O1xyXG5cdFx0XHRcdGZvcihpOyBpIDwgbDsgaSsrKXtcclxuXHRcdFx0XHRcdHRtcCA9ICh0bXB8fGVtcHR5KVtuW2ldXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYodSAhPT0gdG1wKXtcclxuXHRcdFx0XHRcdHJldHVybiBvcHQ/IGd1biA6IHRtcDtcclxuXHRcdFx0XHR9IGVsc2VcclxuXHRcdFx0XHRpZigodG1wID0gYXQuYmFjaykpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRtcC5iYWNrKG4sIG9wdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihuIGluc3RhbmNlb2YgRnVuY3Rpb24pe1xyXG5cdFx0XHRcdHZhciB5ZXMsIHRtcCA9IHtiYWNrOiBndW59O1xyXG5cdFx0XHRcdHdoaWxlKCh0bXAgPSB0bXAuYmFjaylcclxuXHRcdFx0XHQmJiAodG1wID0gdG1wLl8pXHJcblx0XHRcdFx0JiYgISh5ZXMgPSBuKHRtcCwgb3B0KSkpe31cclxuXHRcdFx0XHRyZXR1cm4geWVzO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR2YXIgZW1wdHkgPSB7fSwgdTtcclxuXHR9KShyZXF1aXJlLCAnLi9iYWNrJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9yb290Jyk7XHJcblx0XHRHdW4uY2hhaW4uY2hhaW4gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgYXQgPSB0aGlzLl8sIGNoYWluID0gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcyksIGNhdCA9IGNoYWluLl87XHJcblx0XHRcdGNhdC5yb290ID0gcm9vdCA9IGF0LnJvb3Q7XHJcblx0XHRcdGNhdC5pZCA9ICsrcm9vdC5fLm9uY2U7XHJcblx0XHRcdGNhdC5iYWNrID0gdGhpcztcclxuXHRcdFx0Y2F0Lm9uID0gR3VuLm9uO1xyXG5cdFx0XHRHdW4ub24oJ2NoYWluJywgY2F0KTtcclxuXHRcdFx0Y2F0Lm9uKCdpbicsIGlucHV0LCBjYXQpOyAvLyBGb3IgJ2luJyBpZiBJIGFkZCBteSBvd24gbGlzdGVuZXJzIHRvIGVhY2ggdGhlbiBJIE1VU1QgZG8gaXQgYmVmb3JlIGluIGdldHMgY2FsbGVkLiBJZiBJIGxpc3RlbiBnbG9iYWxseSBmb3IgYWxsIGluY29taW5nIGRhdGEgaW5zdGVhZCB0aG91Z2gsIHJlZ2FyZGxlc3Mgb2YgaW5kaXZpZHVhbCBsaXN0ZW5lcnMsIEkgY2FuIHRyYW5zZm9ybSB0aGUgZGF0YSB0aGVyZSBhbmQgdGhlbiBhcyB3ZWxsLlxyXG5cdFx0XHRjYXQub24oJ291dCcsIG91dHB1dCwgY2F0KTsgLy8gSG93ZXZlciBmb3Igb3V0cHV0LCB0aGVyZSBpc24ndCByZWFsbHkgdGhlIGdsb2JhbCBvcHRpb24uIEkgbXVzdCBsaXN0ZW4gYnkgYWRkaW5nIG15IG93biBsaXN0ZW5lciBpbmRpdmlkdWFsbHkgQkVGT1JFIHRoaXMgb25lIGlzIGV2ZXIgY2FsbGVkLlxyXG5cdFx0XHRyZXR1cm4gY2hhaW47XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBvdXRwdXQoYXQpe1xyXG5cdFx0XHR2YXIgY2F0ID0gdGhpcy5hcywgZ3VuID0gY2F0Lmd1biwgcm9vdCA9IGd1bi5iYWNrKC0xKSwgcHV0LCBnZXQsIG5vdywgdG1wO1xyXG5cdFx0XHRpZighYXQuZ3VuKXtcclxuXHRcdFx0XHRhdC5ndW4gPSBndW47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoZ2V0ID0gYXQuZ2V0KXtcclxuXHRcdFx0XHRpZih0bXAgPSBnZXRbX3NvdWxdKXtcclxuXHRcdFx0XHRcdHRtcCA9IChyb290LmdldCh0bXApLl8pO1xyXG5cdFx0XHRcdFx0aWYob2JqX2hhcyhnZXQsIF9maWVsZCkpe1xyXG5cdFx0XHRcdFx0XHRpZihvYmpfaGFzKHB1dCA9IHRtcC5wdXQsIGdldCA9IGdldFtfZmllbGRdKSl7XHJcblx0XHRcdFx0XHRcdFx0dG1wLm9uKCdpbicsIHtnZXQ6IHRtcC5nZXQsIHB1dDogR3VuLnN0YXRlLnRvKHB1dCwgZ2V0KSwgZ3VuOiB0bXAuZ3VufSk7IC8vIFRPRE86IFVnbHksIGNsZWFuIHVwPyBTaW1wbGlmeSBhbGwgdGhlc2UgaWYgY29uZGl0aW9ucyAod2l0aG91dCBydWluaW5nIHRoZSB3aG9sZSBjaGFpbmluZyBBUEkpP1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9IGVsc2VcclxuXHRcdFx0XHRcdGlmKG9ial9oYXModG1wLCAncHV0Jykpe1xyXG5cdFx0XHRcdFx0Ly9pZih1ICE9PSB0bXAucHV0KXtcclxuXHRcdFx0XHRcdFx0dG1wLm9uKCdpbicsIHRtcCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmKG9ial9oYXMoZ2V0LCBfZmllbGQpKXtcclxuXHRcdFx0XHRcdFx0Z2V0ID0gZ2V0W19maWVsZF07XHJcblx0XHRcdFx0XHRcdHZhciBuZXh0ID0gZ2V0PyAoZ3VuLmdldChnZXQpLl8pIDogY2F0O1xyXG5cdFx0XHRcdFx0XHQvLyBUT0RPOiBCVUchIEhhbmRsZSBwbHVyYWwgY2hhaW5zIGJ5IGl0ZXJhdGluZyBvdmVyIHRoZW0uXHJcblx0XHRcdFx0XHRcdC8vaWYob2JqX2hhcyhuZXh0LCAncHV0JykpeyAvLyBwb3RlbnRpYWxseSBpbmNvcnJlY3Q/IE1heWJlP1xyXG5cdFx0XHRcdFx0XHRpZih1ICE9PSBuZXh0LnB1dCl7IC8vIHBvdGVudGlhbGx5IGluY29ycmVjdD8gTWF5YmU/XHJcblx0XHRcdFx0XHRcdFx0Ly9uZXh0LnRhZ1snaW4nXS5sYXN0Lm5leHQobmV4dCk7XHJcblx0XHRcdFx0XHRcdFx0bmV4dC5vbignaW4nLCBuZXh0KTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYob2JqX2hhcyhjYXQsICdwdXQnKSl7XHJcblx0XHRcdFx0XHRcdC8vaWYodSAhPT0gY2F0LnB1dCl7XHJcblx0XHRcdFx0XHRcdFx0dmFyIHZhbCA9IGNhdC5wdXQsIHJlbDtcclxuXHRcdFx0XHRcdFx0XHRpZihyZWwgPSBHdW4ubm9kZS5zb3VsKHZhbCkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFsID0gR3VuLnZhbC5yZWwuaWZ5KHJlbCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGlmKHJlbCA9IEd1bi52YWwucmVsLmlzKHZhbCkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYoIWF0Lmd1bi5fKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdFx0XHRcdChhdC5ndW4uXykub24oJ291dCcsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Z2V0OiB0bXAgPSB7JyMnOiByZWwsICcuJzogZ2V0LCBndW46IGF0Lmd1bn0sXHJcblx0XHRcdFx0XHRcdFx0XHRcdCcjJzogcm9vdC5fLmFzayhHdW4uSEFNLnN5bnRoLCB0bXApLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRndW46IGF0Lmd1blxyXG5cdFx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdGlmKHUgPT09IHZhbCB8fCBHdW4udmFsLmlzKHZhbCkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYoIWF0Lmd1bi5fKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdFx0XHRcdChhdC5ndW4uXykub24oJ2luJywge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRnZXQ6IGdldCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0Z3VuOiBhdC5ndW5cclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSBlbHNlXHJcblx0XHRcdFx0XHRcdGlmKGNhdC5tYXApe1xyXG5cdFx0XHRcdFx0XHRcdG9ial9tYXAoY2F0Lm1hcCwgZnVuY3Rpb24ocHJveHkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0cHJveHkuYXQub24oJ2luJywgcHJveHkuYXQpO1xyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHRpZihjYXQuc291bCl7XHJcblx0XHRcdFx0XHRcdFx0aWYoIWF0Lmd1bi5fKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdFx0XHQoYXQuZ3VuLl8pLm9uKCdvdXQnLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRnZXQ6IHRtcCA9IHsnIyc6IGNhdC5zb3VsLCAnLic6IGdldCwgZ3VuOiBhdC5ndW59LFxyXG5cdFx0XHRcdFx0XHRcdFx0JyMnOiByb290Ll8uYXNrKEd1bi5IQU0uc3ludGgsIHRtcCksXHJcblx0XHRcdFx0XHRcdFx0XHRndW46IGF0Lmd1blxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZihjYXQuZ2V0KXtcclxuXHRcdFx0XHRcdFx0XHRpZighY2F0LmJhY2suXyl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRcdFx0KGNhdC5iYWNrLl8pLm9uKCdvdXQnLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRnZXQ6IG9ial9wdXQoe30sIF9maWVsZCwgY2F0LmdldCksXHJcblx0XHRcdFx0XHRcdFx0XHRndW46IGd1blxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRhdCA9IG9ial90byhhdCwge2dldDoge319KTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGlmKG9ial9oYXMoY2F0LCAncHV0Jykpe1xyXG5cdFx0XHRcdFx0XHQvL2lmKHUgIT09IGNhdC5wdXQpe1xyXG5cdFx0XHRcdFx0XHRcdGNhdC5vbignaW4nLCBjYXQpO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2VcclxuXHRcdFx0XHRcdFx0aWYoY2F0Lm1hcCl7XHJcblx0XHRcdFx0XHRcdFx0b2JqX21hcChjYXQubWFwLCBmdW5jdGlvbihwcm94eSl7XHJcblx0XHRcdFx0XHRcdFx0XHRwcm94eS5hdC5vbignaW4nLCBwcm94eS5hdCk7XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYoY2F0LmFjayl7XHJcblx0XHRcdFx0XHRcdFx0aWYoIW9ial9oYXMoY2F0LCAncHV0JykpeyAvLyB1ICE9PSBjYXQucHV0IGluc3RlYWQ/XHJcblx0XHRcdFx0XHRcdFx0Ly9pZih1ICE9PSBjYXQucHV0KXtcclxuXHRcdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0Y2F0LmFjayA9IC0xO1xyXG5cdFx0XHRcdFx0XHRpZihjYXQuc291bCl7XHJcblx0XHRcdFx0XHRcdFx0Y2F0Lm9uKCdvdXQnLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRnZXQ6IHRtcCA9IHsnIyc6IGNhdC5zb3VsLCBndW46IGNhdC5ndW59LFxyXG5cdFx0XHRcdFx0XHRcdFx0JyMnOiByb290Ll8uYXNrKEd1bi5IQU0uc3ludGgsIHRtcCksXHJcblx0XHRcdFx0XHRcdFx0XHRndW46IGNhdC5ndW5cclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYoY2F0LmdldCl7XHJcblx0XHRcdFx0XHRcdFx0aWYoIWNhdC5iYWNrLl8peyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0XHRcdChjYXQuYmFjay5fKS5vbignb3V0Jywge1xyXG5cdFx0XHRcdFx0XHRcdFx0Z2V0OiBvYmpfcHV0KHt9LCBfZmllbGQsIGNhdC5nZXQpLFxyXG5cdFx0XHRcdFx0XHRcdFx0Z3VuOiBjYXQuZ3VuXHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdChjYXQuYmFjay5fKS5vbignb3V0JywgYXQpO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gaW5wdXQoYXQpe1xyXG5cdFx0XHRhdCA9IGF0Ll8gfHwgYXQ7XHJcblx0XHRcdHZhciBldiA9IHRoaXMsIGNhdCA9IHRoaXMuYXMsIGd1biA9IGF0Lmd1biwgY29hdCA9IGd1bi5fLCBjaGFuZ2UgPSBhdC5wdXQsIGJhY2sgPSBjYXQuYmFjay5fIHx8IGVtcHR5LCByZWwsIHRtcDtcclxuXHRcdFx0aWYoMCA+IGNhdC5hY2sgJiYgIWF0LmFjayAmJiAhR3VuLnZhbC5yZWwuaXMoY2hhbmdlKSl7IC8vIGZvciBiZXR0ZXIgYmVoYXZpb3I/XHJcblx0XHRcdFx0Y2F0LmFjayA9IDE7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY2F0LmdldCAmJiBhdC5nZXQgIT09IGNhdC5nZXQpe1xyXG5cdFx0XHRcdGF0ID0gb2JqX3RvKGF0LCB7Z2V0OiBjYXQuZ2V0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY2F0LmZpZWxkICYmIGNvYXQgIT09IGNhdCl7XHJcblx0XHRcdFx0YXQgPSBvYmpfdG8oYXQsIHtndW46IGNhdC5ndW59KTtcclxuXHRcdFx0XHRpZihjb2F0LmFjayl7XHJcblx0XHRcdFx0XHRjYXQuYWNrID0gY2F0LmFjayB8fCBjb2F0LmFjaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYodSA9PT0gY2hhbmdlKXtcclxuXHRcdFx0XHRldi50by5uZXh0KGF0KTtcclxuXHRcdFx0XHRpZihjYXQuc291bCl7IHJldHVybiB9XHJcblx0XHRcdFx0ZWNobyhjYXQsIGF0LCBldik7XHJcblx0XHRcdFx0aWYoY2F0LmZpZWxkKXtcclxuXHRcdFx0XHRcdG5vdChjYXQsIGF0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0b2JqX2RlbChjb2F0LmVjaG8sIGNhdC5pZCk7XHJcblx0XHRcdFx0b2JqX2RlbChjYXQubWFwLCBjb2F0LmlkKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY2F0LnNvdWwpe1xyXG5cdFx0XHRcdGlmKGNhdC5yb290Ll8ubm93KXsgYXQgPSBvYmpfdG8oYXQsIHtwdXQ6IGNoYW5nZSA9IGNvYXQucHV0fSkgfSAvLyBUT0RPOiBVZ2x5IGhhY2sgZm9yIHVuY2FjaGVkIHN5bmNocm9ub3VzIG1hcHMuXHJcblx0XHRcdFx0ZXYudG8ubmV4dChhdCk7XHJcblx0XHRcdFx0ZWNobyhjYXQsIGF0LCBldik7XHJcblx0XHRcdFx0b2JqX21hcChjaGFuZ2UsIG1hcCwge2F0OiBhdCwgY2F0OiBjYXR9KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoIShyZWwgPSBHdW4udmFsLnJlbC5pcyhjaGFuZ2UpKSl7XHJcblx0XHRcdFx0aWYoR3VuLnZhbC5pcyhjaGFuZ2UpKXtcclxuXHRcdFx0XHRcdGlmKGNhdC5maWVsZCB8fCBjYXQuc291bCl7XHJcblx0XHRcdFx0XHRcdG5vdChjYXQsIGF0KTtcclxuXHRcdFx0XHRcdH0gZWxzZVxyXG5cdFx0XHRcdFx0aWYoY29hdC5maWVsZCB8fCBjb2F0LnNvdWwpe1xyXG5cdFx0XHRcdFx0XHQoY29hdC5lY2hvIHx8IChjb2F0LmVjaG8gPSB7fSkpW2NhdC5pZF0gPSBjYXQ7XHJcblx0XHRcdFx0XHRcdChjYXQubWFwIHx8IChjYXQubWFwID0ge30pKVtjb2F0LmlkXSA9IGNhdC5tYXBbY29hdC5pZF0gfHwge2F0OiBjb2F0fTtcclxuXHRcdFx0XHRcdFx0Ly9pZih1ID09PSBjb2F0LnB1dCl7IHJldHVybiB9IC8vIE5vdCBuZWNlc3NhcnkgYnV0IGltcHJvdmVzIHBlcmZvcm1hbmNlLiBJZiB3ZSBoYXZlIGl0IGJ1dCBjb2F0IGRvZXMgbm90LCB0aGF0IG1lYW5zIHdlIGdvdCB0aGluZ3Mgb3V0IG9mIG9yZGVyIGFuZCBjb2F0IHdpbGwgZ2V0IGl0LiBPbmNlIGNvYXQgZ2V0cyBpdCwgaXQgd2lsbCB0ZWxsIHVzIGFnYWluLlxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZXYudG8ubmV4dChhdCk7XHJcblx0XHRcdFx0XHRlY2hvKGNhdCwgYXQsIGV2KTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoY2F0LmZpZWxkICYmIGNvYXQgIT09IGNhdCAmJiBvYmpfaGFzKGNvYXQsICdwdXQnKSl7XHJcblx0XHRcdFx0XHRjYXQucHV0ID0gY29hdC5wdXQ7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRpZigocmVsID0gR3VuLm5vZGUuc291bChjaGFuZ2UpKSAmJiBjb2F0LmZpZWxkKXtcclxuXHRcdFx0XHRcdGNvYXQucHV0ID0gKGNhdC5yb290LmdldChyZWwpLl8pLnB1dDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZXYudG8ubmV4dChhdCk7XHJcblx0XHRcdFx0ZWNobyhjYXQsIGF0LCBldik7XHJcblx0XHRcdFx0cmVsYXRlKGNhdCwgYXQsIGNvYXQsIHJlbCk7XHJcblx0XHRcdFx0b2JqX21hcChjaGFuZ2UsIG1hcCwge2F0OiBhdCwgY2F0OiBjYXR9KTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0cmVsYXRlKGNhdCwgYXQsIGNvYXQsIHJlbCk7XHJcblx0XHRcdGV2LnRvLm5leHQoYXQpO1xyXG5cdFx0XHRlY2hvKGNhdCwgYXQsIGV2KTtcclxuXHRcdH1cclxuXHRcdEd1bi5jaGFpbi5jaGFpbi5pbnB1dCA9IGlucHV0O1xyXG5cdFx0ZnVuY3Rpb24gcmVsYXRlKGNhdCwgYXQsIGNvYXQsIHJlbCl7XHJcblx0XHRcdGlmKCFyZWwgfHwgbm9kZV8gPT09IGNhdC5nZXQpeyByZXR1cm4gfVxyXG5cdFx0XHR2YXIgdG1wID0gKGNhdC5yb290LmdldChyZWwpLl8pO1xyXG5cdFx0XHRpZihjYXQuZmllbGQpe1xyXG5cdFx0XHRcdGNvYXQgPSB0bXA7XHJcblx0XHRcdH0gZWxzZSBcclxuXHRcdFx0aWYoY29hdC5maWVsZCl7XHJcblx0XHRcdFx0cmVsYXRlKGNvYXQsIGF0LCBjb2F0LCByZWwpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNvYXQgPT09IGNhdCl7IHJldHVybiB9XHJcblx0XHRcdChjb2F0LmVjaG8gfHwgKGNvYXQuZWNobyA9IHt9KSlbY2F0LmlkXSA9IGNhdDtcclxuXHRcdFx0aWYoY2F0LmZpZWxkICYmICEoY2F0Lm1hcHx8ZW1wdHkpW2NvYXQuaWRdKXtcclxuXHRcdFx0XHRub3QoY2F0LCBhdCk7XHJcblx0XHRcdH1cclxuXHRcdFx0dG1wID0gKGNhdC5tYXAgfHwgKGNhdC5tYXAgPSB7fSkpW2NvYXQuaWRdID0gY2F0Lm1hcFtjb2F0LmlkXSB8fCB7YXQ6IGNvYXR9O1xyXG5cdFx0XHRpZihyZWwgPT09IHRtcC5yZWwpeyByZXR1cm4gfVxyXG5cdFx0XHRhc2soY2F0LCB0bXAucmVsID0gcmVsKTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIGVjaG8oY2F0LCBhdCwgZXYpe1xyXG5cdFx0XHRpZighY2F0LmVjaG8peyByZXR1cm4gfSAvLyB8fCBub2RlXyA9PT0gYXQuZ2V0ID8/Pz9cclxuXHRcdFx0aWYoY2F0LmZpZWxkKXsgYXQgPSBvYmpfdG8oYXQsIHtldmVudDogZXZ9KSB9XHJcblx0XHRcdG9ial9tYXAoY2F0LmVjaG8sIHJldmVyYiwgYXQpO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gcmV2ZXJiKGNhdCl7XHJcblx0XHRcdGNhdC5vbignaW4nLCB0aGlzKTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIG1hcChkYXRhLCBrZXkpeyAvLyBNYXAgb3ZlciBvbmx5IHRoZSBjaGFuZ2VzIG9uIGV2ZXJ5IHVwZGF0ZS5cclxuXHRcdFx0dmFyIGNhdCA9IHRoaXMuY2F0LCBuZXh0ID0gY2F0Lm5leHQgfHwgZW1wdHksIHZpYSA9IHRoaXMuYXQsIGd1biwgY2hhaW4sIGF0LCB0bXA7XHJcblx0XHRcdGlmKG5vZGVfID09PSBrZXkgJiYgIW5leHRba2V5XSl7IHJldHVybiB9XHJcblx0XHRcdGlmKCEoZ3VuID0gbmV4dFtrZXldKSl7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGF0ID0gKGd1bi5fKTtcclxuXHRcdFx0Ly9pZihkYXRhICYmIGRhdGFbX3NvdWxdICYmICh0bXAgPSBHdW4udmFsLnJlbC5pcyhkYXRhKSkgJiYgKHRtcCA9IChjYXQucm9vdC5nZXQodG1wKS5fKSkgJiYgb2JqX2hhcyh0bXAsICdwdXQnKSl7XHJcblx0XHRcdC8vXHRkYXRhID0gdG1wLnB1dDtcclxuXHRcdFx0Ly99XHJcblx0XHRcdGlmKGF0LmZpZWxkKXtcclxuXHRcdFx0XHRpZighKGRhdGEgJiYgZGF0YVtfc291bF0gJiYgR3VuLnZhbC5yZWwuaXMoZGF0YSkgPT09IEd1bi5ub2RlLnNvdWwoYXQucHV0KSkpe1xyXG5cdFx0XHRcdFx0YXQucHV0ID0gZGF0YTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2hhaW4gPSBndW47XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y2hhaW4gPSB2aWEuZ3VuLmdldChrZXkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGF0Lm9uKCdpbicsIHtcclxuXHRcdFx0XHRwdXQ6IGRhdGEsXHJcblx0XHRcdFx0Z2V0OiBrZXksXHJcblx0XHRcdFx0Z3VuOiBjaGFpbixcclxuXHRcdFx0XHR2aWE6IHZpYVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIG5vdChjYXQsIGF0KXtcclxuXHRcdFx0aWYoIShjYXQuZmllbGQgfHwgY2F0LnNvdWwpKXsgcmV0dXJuIH1cclxuXHRcdFx0dmFyIHRtcCA9IGNhdC5tYXA7XHJcblx0XHRcdGNhdC5tYXAgPSBudWxsO1xyXG5cdFx0XHRpZihudWxsID09PSB0bXApeyByZXR1cm4gfVxyXG5cdFx0XHRpZih1ID09PSB0bXAgJiYgY2F0LnB1dCAhPT0gdSl7IHJldHVybiB9IC8vIFRPRE86IEJ1Zz8gVGhyZXcgc2Vjb25kIGNvbmRpdGlvbiBpbiBmb3IgYSBwYXJ0aWN1bGFyIHRlc3QsIG5vdCBzdXJlIGlmIGEgY291bnRlciBleGFtcGxlIGlzIHRlc3RlZCB0aG91Z2guXHJcblx0XHRcdG9ial9tYXAodG1wLCBmdW5jdGlvbihwcm94eSl7XHJcblx0XHRcdFx0aWYoIShwcm94eSA9IHByb3h5LmF0KSl7IHJldHVybiB9XHJcblx0XHRcdFx0b2JqX2RlbChwcm94eS5lY2hvLCBjYXQuaWQpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0b2JqX21hcChjYXQubmV4dCwgZnVuY3Rpb24oZ3VuLCBrZXkpe1xyXG5cdFx0XHRcdHZhciBjb2F0ID0gKGd1bi5fKTtcclxuXHRcdFx0XHRjb2F0LnB1dCA9IHU7XHJcblx0XHRcdFx0aWYoY29hdC5hY2spe1xyXG5cdFx0XHRcdFx0Y29hdC5hY2sgPSAtMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y29hdC5vbignaW4nLCB7XHJcblx0XHRcdFx0XHRnZXQ6IGtleSxcclxuXHRcdFx0XHRcdGd1bjogZ3VuLFxyXG5cdFx0XHRcdFx0cHV0OiB1XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gYXNrKGNhdCwgc291bCl7XHJcblx0XHRcdHZhciB0bXAgPSAoY2F0LnJvb3QuZ2V0KHNvdWwpLl8pO1xyXG5cdFx0XHRpZihjYXQuYWNrKXtcclxuXHRcdFx0XHR0bXAuYWNrID0gdG1wLmFjayB8fCAtMTtcclxuXHRcdFx0XHR0bXAub24oJ291dCcsIHtcclxuXHRcdFx0XHRcdGdldDogdG1wID0geycjJzogc291bCwgZ3VuOiB0bXAuZ3VufSxcclxuXHRcdFx0XHRcdCcjJzogY2F0LnJvb3QuXy5hc2soR3VuLkhBTS5zeW50aCwgdG1wKVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRvYmpfbWFwKGNhdC5uZXh0LCBmdW5jdGlvbihndW4sIGtleSl7XHJcblx0XHRcdFx0KGd1bi5fKS5vbignb3V0Jywge1xyXG5cdFx0XHRcdFx0Z2V0OiBndW4gPSB7JyMnOiBzb3VsLCAnLic6IGtleSwgZ3VuOiBndW59LFxyXG5cdFx0XHRcdFx0JyMnOiBjYXQucm9vdC5fLmFzayhHdW4uSEFNLnN5bnRoLCBndW4pXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0dmFyIGVtcHR5ID0ge30sIHU7XHJcblx0XHR2YXIgb2JqID0gR3VuLm9iaiwgb2JqX2hhcyA9IG9iai5oYXMsIG9ial9wdXQgPSBvYmoucHV0LCBvYmpfZGVsID0gb2JqLmRlbCwgb2JqX3RvID0gb2JqLnRvLCBvYmpfbWFwID0gb2JqLm1hcDtcclxuXHRcdHZhciBfc291bCA9IEd1bi5fLnNvdWwsIF9maWVsZCA9IEd1bi5fLmZpZWxkLCBub2RlXyA9IEd1bi5ub2RlLl87XHJcblx0fSkocmVxdWlyZSwgJy4vY2hhaW4nKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL3Jvb3QnKTtcclxuXHRcdEd1bi5jaGFpbi5nZXQgPSBmdW5jdGlvbihrZXksIGNiLCBhcyl7XHJcblx0XHRcdGlmKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnKXtcclxuXHRcdFx0XHR2YXIgZ3VuLCBiYWNrID0gdGhpcywgY2F0ID0gYmFjay5fO1xyXG5cdFx0XHRcdHZhciBuZXh0ID0gY2F0Lm5leHQgfHwgZW1wdHksIHRtcDtcclxuXHRcdFx0XHRpZighKGd1biA9IG5leHRba2V5XSkpe1xyXG5cdFx0XHRcdFx0Z3VuID0gY2FjaGUoa2V5LCBiYWNrKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZVxyXG5cdFx0XHRpZihrZXkgaW5zdGFuY2VvZiBGdW5jdGlvbil7XHJcblx0XHRcdFx0dmFyIGd1biA9IHRoaXMsIGF0ID0gZ3VuLl87XHJcblx0XHRcdFx0YXMgPSBjYiB8fCB7fTtcclxuXHRcdFx0XHRhcy51c2UgPSBrZXk7XHJcblx0XHRcdFx0YXMub3V0ID0gYXMub3V0IHx8IHtjYXA6IDF9O1xyXG5cdFx0XHRcdGFzLm91dC5nZXQgPSBhcy5vdXQuZ2V0IHx8IHt9O1xyXG5cdFx0XHRcdCdfJyAhPSBhdC5nZXQgJiYgKChhdC5yb290Ll8pLm5vdyA9IHRydWUpOyAvLyB1Z2x5IGhhY2sgZm9yIG5vdy5cclxuXHRcdFx0XHRhdC5vbignaW4nLCB1c2UsIGFzKTtcclxuXHRcdFx0XHRhdC5vbignb3V0JywgYXMub3V0KTtcclxuXHRcdFx0XHQoYXQucm9vdC5fKS5ub3cgPSBmYWxzZTtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9IGVsc2VcclxuXHRcdFx0aWYobnVtX2lzKGtleSkpe1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmdldCgnJytrZXksIGNiLCBhcyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0KGFzID0gdGhpcy5jaGFpbigpKS5fLmVyciA9IHtlcnI6IEd1bi5sb2coJ0ludmFsaWQgZ2V0IHJlcXVlc3QhJywga2V5KX07IC8vIENMRUFOIFVQXHJcblx0XHRcdFx0aWYoY2IpeyBjYi5jYWxsKGFzLCBhcy5fLmVycikgfVxyXG5cdFx0XHRcdHJldHVybiBhcztcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih0bXAgPSBjYXQuc3R1bil7IC8vIFRPRE86IFJlZmFjdG9yP1xyXG5cdFx0XHRcdGd1bi5fLnN0dW4gPSBndW4uXy5zdHVuIHx8IHRtcDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjYiAmJiBjYiBpbnN0YW5jZW9mIEZ1bmN0aW9uKXtcclxuXHRcdFx0XHRndW4uZ2V0KGNiLCBhcyk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIGNhY2hlKGtleSwgYmFjayl7XHJcblx0XHRcdHZhciBjYXQgPSBiYWNrLl8sIG5leHQgPSBjYXQubmV4dCwgZ3VuID0gYmFjay5jaGFpbigpLCBhdCA9IGd1bi5fO1xyXG5cdFx0XHRpZighbmV4dCl7IG5leHQgPSBjYXQubmV4dCA9IHt9IH1cclxuXHRcdFx0bmV4dFthdC5nZXQgPSBrZXldID0gZ3VuO1xyXG5cdFx0XHRpZihjYXQucm9vdCA9PT0gYmFjayl7IGF0LnNvdWwgPSBrZXkgfVxyXG5cdFx0XHRlbHNlIGlmKGNhdC5zb3VsIHx8IGNhdC5maWVsZCl7IGF0LmZpZWxkID0ga2V5IH1cclxuXHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIHVzZShhdCl7XHJcblx0XHRcdHZhciBldiA9IHRoaXMsIGFzID0gZXYuYXMsIGd1biA9IGF0Lmd1biwgY2F0ID0gZ3VuLl8sIGRhdGEgPSBhdC5wdXQsIHRtcDtcclxuXHRcdFx0aWYodSA9PT0gZGF0YSl7XHJcblx0XHRcdFx0ZGF0YSA9IGNhdC5wdXQ7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoKHRtcCA9IGRhdGEpICYmIHRtcFtyZWwuX10gJiYgKHRtcCA9IHJlbC5pcyh0bXApKSl7XHJcblx0XHRcdFx0dG1wID0gKGNhdC5yb290LmdldCh0bXApLl8pO1xyXG5cdFx0XHRcdGlmKHUgIT09IHRtcC5wdXQpe1xyXG5cdFx0XHRcdFx0YXQgPSBvYmpfdG8oYXQsIHtwdXQ6IHRtcC5wdXR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0YXMudXNlKGF0LCBhdC5ldmVudCB8fCBldik7XHJcblx0XHRcdGV2LnRvLm5leHQoYXQpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIG9iaiA9IEd1bi5vYmosIG9ial9oYXMgPSBvYmouaGFzLCBvYmpfdG8gPSBHdW4ub2JqLnRvO1xyXG5cdFx0dmFyIG51bV9pcyA9IEd1bi5udW0uaXM7XHJcblx0XHR2YXIgcmVsID0gR3VuLnZhbC5yZWwsIG5vZGVfID0gR3VuLm5vZGUuXztcclxuXHRcdHZhciBlbXB0eSA9IHt9LCB1O1xyXG5cdH0pKHJlcXVpcmUsICcuL2dldCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vcm9vdCcpO1xyXG5cdFx0R3VuLmNoYWluLnB1dCA9IGZ1bmN0aW9uKGRhdGEsIGNiLCBhcyl7XHJcblx0XHRcdC8vICNzb3VsLmZpZWxkPXZhbHVlPnN0YXRlXHJcblx0XHRcdC8vIH53aG8jd2hlcmUud2hlcmU9d2hhdD53aGVuQHdhc1xyXG5cdFx0XHQvLyBUT0RPOiBCVUchIFB1dCBwcm9iYWJseSBjYW5ub3QgaGFuZGxlIHBsdXJhbCBjaGFpbnMhXHJcblx0XHRcdHZhciBndW4gPSB0aGlzLCBhdCA9IChndW4uXyksIHJvb3QgPSBhdC5yb290LCB0bXA7XHJcblx0XHRcdGFzID0gYXMgfHwge307XHJcblx0XHRcdGFzLmRhdGEgPSBkYXRhO1xyXG5cdFx0XHRhcy5ndW4gPSBhcy5ndW4gfHwgZ3VuO1xyXG5cdFx0XHRpZih0eXBlb2YgY2IgPT09ICdzdHJpbmcnKXtcclxuXHRcdFx0XHRhcy5zb3VsID0gY2I7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0YXMuYWNrID0gY2I7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoYXQuc291bCl7XHJcblx0XHRcdFx0YXMuc291bCA9IGF0LnNvdWw7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoYXMuc291bCB8fCByb290ID09PSBndW4pe1xyXG5cdFx0XHRcdGlmKCFvYmpfaXMoYXMuZGF0YSkpe1xyXG5cdFx0XHRcdFx0KGFzLmFja3x8bm9vcCkuY2FsbChhcywgYXMub3V0ID0ge2VycjogR3VuLmxvZyhcIkRhdGEgc2F2ZWQgdG8gdGhlIHJvb3QgbGV2ZWwgb2YgdGhlIGdyYXBoIG11c3QgYmUgYSBub2RlIChhbiBvYmplY3QpLCBub3QgYVwiLCAodHlwZW9mIGFzLmRhdGEpLCAnb2YgXCInICsgYXMuZGF0YSArICdcIiEnKX0pO1xyXG5cdFx0XHRcdFx0aWYoYXMucmVzKXsgYXMucmVzKCkgfVxyXG5cdFx0XHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YXMuZ3VuID0gZ3VuID0gcm9vdC5nZXQoYXMuc291bCA9IGFzLnNvdWwgfHwgKGFzLm5vdCA9IEd1bi5ub2RlLnNvdWwoYXMuZGF0YSkgfHwgKChyb290Ll8pLm9wdC51dWlkIHx8IEd1bi50ZXh0LnJhbmRvbSkoKSkpO1xyXG5cdFx0XHRcdGFzLnJlZiA9IGFzLmd1bjtcclxuXHRcdFx0XHRpZnkoYXMpO1xyXG5cdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoR3VuLmlzKGRhdGEpKXtcclxuXHRcdFx0XHRkYXRhLmdldChmdW5jdGlvbihhdCxldil7ZXYub2ZmKCk7XHJcblx0XHRcdFx0XHR2YXIgcyA9IEd1bi5ub2RlLnNvdWwoYXQucHV0KTtcclxuXHRcdFx0XHRcdGlmKCFzKXtHdW4ubG9nKFwiVGhlIHJlZmVyZW5jZSB5b3UgYXJlIHNhdmluZyBpcyBhXCIsIHR5cGVvZiBhdC5wdXQsICdcIicrIGFzLnB1dCArJ1wiLCBub3QgYSBub2RlIChvYmplY3QpIScpO3JldHVybn1cclxuXHRcdFx0XHRcdGd1bi5wdXQoR3VuLnZhbC5yZWwuaWZ5KHMpLCBjYiwgYXMpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdH1cclxuXHRcdFx0YXMucmVmID0gYXMucmVmIHx8IChyb290ID09PSAodG1wID0gYXQuYmFjaykpPyBndW4gOiB0bXA7XHJcblx0XHRcdGlmKGFzLnJlZi5fLnNvdWwgJiYgR3VuLnZhbC5pcyhhcy5kYXRhKSAmJiBhdC5nZXQpe1xyXG5cdFx0XHRcdGFzLmRhdGEgPSBvYmpfcHV0KHt9LCBhdC5nZXQsIGFzLmRhdGEpO1xyXG5cdFx0XHRcdGFzLnJlZi5wdXQoYXMuZGF0YSwgYXMuc291bCwgYXMpO1xyXG5cdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdH1cclxuXHRcdFx0YXMucmVmLmdldCgnXycpLmdldChhbnksIHthczogYXN9KTtcclxuXHRcdFx0aWYoIWFzLm91dCl7XHJcblx0XHRcdFx0Ly8gVE9ETzogUGVyZiBpZGVhISBNYWtlIGEgZ2xvYmFsIGxvY2ssIHRoYXQgYmxvY2tzIGV2ZXJ5dGhpbmcgd2hpbGUgaXQgaXMgb24sIGJ1dCBpZiBpdCBpcyBvbiB0aGUgbG9jayBpdCBkb2VzIHRoZSBleHBlbnNpdmUgbG9va3VwIHRvIHNlZSBpZiBpdCBpcyBhIGRlcGVuZGVudCB3cml0ZSBvciBub3QgYW5kIGlmIG5vdCB0aGVuIGl0IHByb2NlZWRzIGZ1bGwgc3BlZWQuIE1laD8gRm9yIHdyaXRlIGhlYXZ5IGFzeW5jIGFwcHMgdGhhdCB3b3VsZCBiZSB0ZXJyaWJsZS5cclxuXHRcdFx0XHRhcy5yZXMgPSBhcy5yZXMgfHwgR3VuLm9uLnN0dW4oYXMucmVmKTtcclxuXHRcdFx0XHRhcy5ndW4uXy5zdHVuID0gYXMucmVmLl8uc3R1bjtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0fTtcclxuXHJcblx0XHRmdW5jdGlvbiBpZnkoYXMpe1xyXG5cdFx0XHRhcy5iYXRjaCA9IGJhdGNoO1xyXG5cdFx0XHR2YXIgb3B0ID0gYXMub3B0fHx7fSwgZW52ID0gYXMuZW52ID0gR3VuLnN0YXRlLm1hcChtYXAsIG9wdC5zdGF0ZSk7XHJcblx0XHRcdGVudi5zb3VsID0gYXMuc291bDtcclxuXHRcdFx0YXMuZ3JhcGggPSBHdW4uZ3JhcGguaWZ5KGFzLmRhdGEsIGVudiwgYXMpO1xyXG5cdFx0XHRpZihlbnYuZXJyKXtcclxuXHRcdFx0XHQoYXMuYWNrfHxub29wKS5jYWxsKGFzLCBhcy5vdXQgPSB7ZXJyOiBHdW4ubG9nKGVudi5lcnIpfSk7XHJcblx0XHRcdFx0aWYoYXMucmVzKXsgYXMucmVzKCkgfVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRhcy5iYXRjaCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGJhdGNoKCl7IHZhciBhcyA9IHRoaXM7XHJcblx0XHRcdGlmKCFhcy5ncmFwaCB8fCBvYmpfbWFwKGFzLnN0dW4sIG5vKSl7IHJldHVybiB9XHJcblx0XHRcdChhcy5yZXN8fGlpZmUpKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0KGFzLnJlZi5fKS5vbignb3V0Jywge1xyXG5cdFx0XHRcdFx0Y2FwOiAzLFxyXG5cdFx0XHRcdFx0Z3VuOiBhcy5yZWYsIHB1dDogYXMub3V0ID0gYXMuZW52LmdyYXBoLCBvcHQ6IGFzLm9wdCxcclxuXHRcdFx0XHRcdCcjJzogYXMuZ3VuLmJhY2soLTEpLl8uYXNrKGZ1bmN0aW9uKGFjayl7IHRoaXMub2ZmKCk7IC8vIE9uZSByZXNwb25zZSBpcyBnb29kIGVub3VnaCBmb3IgdXMgY3VycmVudGx5LiBMYXRlciB3ZSBtYXkgd2FudCB0byBhZGp1c3QgdGhpcy5cclxuXHRcdFx0XHRcdFx0aWYoIWFzLmFjayl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRcdGFzLmFjayhhY2ssIHRoaXMpO1xyXG5cdFx0XHRcdFx0fSwgYXMub3B0KVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9LCBhcyk7XHJcblx0XHRcdGlmKGFzLnJlcyl7IGFzLnJlcygpIH1cclxuXHRcdH0gZnVuY3Rpb24gbm8odixmKXsgaWYodil7IHJldHVybiB0cnVlIH0gfVxyXG5cclxuXHRcdGZ1bmN0aW9uIG1hcCh2LGYsbiwgYXQpeyB2YXIgYXMgPSB0aGlzO1xyXG5cdFx0XHRpZihmIHx8ICFhdC5wYXRoLmxlbmd0aCl7IHJldHVybiB9XHJcblx0XHRcdChhcy5yZXN8fGlpZmUpKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIHBhdGggPSBhdC5wYXRoLCByZWYgPSBhcy5yZWYsIG9wdCA9IGFzLm9wdDtcclxuXHRcdFx0XHR2YXIgaSA9IDAsIGwgPSBwYXRoLmxlbmd0aDtcclxuXHRcdFx0XHRmb3IoaTsgaSA8IGw7IGkrKyl7XHJcblx0XHRcdFx0XHRyZWYgPSByZWYuZ2V0KHBhdGhbaV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihhcy5ub3QgfHwgR3VuLm5vZGUuc291bChhdC5vYmopKXtcclxuXHRcdFx0XHRcdHZhciBpZCA9IEd1bi5ub2RlLnNvdWwoYXQub2JqKSB8fCAoKGFzLm9wdHx8e30pLnV1aWQgfHwgYXMuZ3VuLmJhY2soJ29wdC51dWlkJykgfHwgR3VuLnRleHQucmFuZG9tKSgpO1xyXG5cdFx0XHRcdFx0cmVmLmJhY2soLTEpLmdldChpZCk7XHJcblx0XHRcdFx0XHRhdC5zb3VsKGlkKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0KGFzLnN0dW4gPSBhcy5zdHVuIHx8IHt9KVtwYXRoXSA9IHRydWU7XHJcblx0XHRcdFx0cmVmLmdldCgnXycpLmdldChzb3VsLCB7YXM6IHthdDogYXQsIGFzOiBhc319KTtcclxuXHRcdFx0fSwge2FzOiBhcywgYXQ6IGF0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gc291bChhdCwgZXYpeyB2YXIgYXMgPSB0aGlzLmFzLCBjYXQgPSBhcy5hdDsgYXMgPSBhcy5hcztcclxuXHRcdFx0Ly9ldi5zdHVuKCk7IC8vIFRPRE86IEJVRyE/XHJcblx0XHRcdGlmKCFhdC5ndW4gfHwgIWF0Lmd1bi5fLmJhY2speyByZXR1cm4gfSAvLyBUT0RPOiBIYW5kbGVcclxuXHRcdFx0ZXYub2ZmKCk7XHJcblx0XHRcdGF0ID0gKGF0Lmd1bi5fLmJhY2suXyk7XHJcblx0XHRcdHZhciBpZCA9IEd1bi5ub2RlLnNvdWwoY2F0Lm9iaikgfHwgR3VuLm5vZGUuc291bChhdC5wdXQpIHx8IEd1bi52YWwucmVsLmlzKGF0LnB1dCkgfHwgKChhcy5vcHR8fHt9KS51dWlkIHx8IGFzLmd1bi5iYWNrKCdvcHQudXVpZCcpIHx8IEd1bi50ZXh0LnJhbmRvbSkoKTsgLy8gVE9ETzogQlVHIT8gRG8gd2UgcmVhbGx5IHdhbnQgdGhlIHNvdWwgb2YgdGhlIG9iamVjdCBnaXZlbiB0byB1cz8gQ291bGQgdGhhdCBiZSBkYW5nZXJvdXM/XHJcblx0XHRcdGF0Lmd1bi5iYWNrKC0xKS5nZXQoaWQpO1xyXG5cdFx0XHRjYXQuc291bChpZCk7XHJcblx0XHRcdGFzLnN0dW5bY2F0LnBhdGhdID0gZmFsc2U7XHJcblx0XHRcdGFzLmJhdGNoKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gYW55KGF0LCBldil7XHJcblx0XHRcdHZhciBhcyA9IHRoaXMuYXM7XHJcblx0XHRcdGlmKCFhdC5ndW4gfHwgIWF0Lmd1bi5fKXsgcmV0dXJuIH0gLy8gVE9ETzogSGFuZGxlXHJcblx0XHRcdGlmKGF0LmVycil7IC8vIFRPRE86IEhhbmRsZVxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiUGxlYXNlIHJlcG9ydCB0aGlzIGFzIGFuIGlzc3VlISBQdXQuYW55LmVyclwiKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIGNhdCA9IChhdC5ndW4uXy5iYWNrLl8pLCBkYXRhID0gY2F0LnB1dCwgb3B0ID0gYXMub3B0fHx7fSwgcm9vdCwgdG1wO1xyXG5cdFx0XHRldi5vZmYoKTtcclxuXHRcdFx0aWYoYXMucmVmICE9PSBhcy5ndW4pe1xyXG5cdFx0XHRcdHRtcCA9IChhcy5ndW4uXykuZ2V0IHx8IGNhdC5nZXQ7XHJcblx0XHRcdFx0aWYoIXRtcCl7IC8vIFRPRE86IEhhbmRsZVxyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJQbGVhc2UgcmVwb3J0IHRoaXMgYXMgYW4gaXNzdWUhIFB1dC5uby5nZXRcIik7IC8vIFRPRE86IEJVRyE/P1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRhcy5kYXRhID0gb2JqX3B1dCh7fSwgdG1wLCBhcy5kYXRhKTtcclxuXHRcdFx0XHR0bXAgPSBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHUgPT09IGRhdGEpe1xyXG5cdFx0XHRcdGlmKCFjYXQuZ2V0KXsgcmV0dXJuIH0gLy8gVE9ETzogSGFuZGxlXHJcblx0XHRcdFx0aWYoIWNhdC5zb3VsKXtcclxuXHRcdFx0XHRcdHRtcCA9IGNhdC5ndW4uYmFjayhmdW5jdGlvbihhdCl7XHJcblx0XHRcdFx0XHRcdGlmKGF0LnNvdWwpeyByZXR1cm4gYXQuc291bCB9XHJcblx0XHRcdFx0XHRcdGFzLmRhdGEgPSBvYmpfcHV0KHt9LCBhdC5nZXQsIGFzLmRhdGEpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRtcCA9IHRtcCB8fCBjYXQuZ2V0O1xyXG5cdFx0XHRcdGNhdCA9IChjYXQucm9vdC5nZXQodG1wKS5fKTtcclxuXHRcdFx0XHRhcy5ub3QgPSBhcy5zb3VsID0gdG1wO1xyXG5cdFx0XHRcdGRhdGEgPSBhcy5kYXRhO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCFhcy5ub3QgJiYgIShhcy5zb3VsID0gR3VuLm5vZGUuc291bChkYXRhKSkpe1xyXG5cdFx0XHRcdGlmKGFzLnBhdGggJiYgb2JqX2lzKGFzLmRhdGEpKXsgLy8gQXBwYXJlbnRseSBuZWNlc3NhcnlcclxuXHRcdFx0XHRcdGFzLnNvdWwgPSAob3B0LnV1aWQgfHwgY2F0LnJvb3QuXy5vcHQudXVpZCB8fCBHdW4udGV4dC5yYW5kb20pKCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vYXMuZGF0YSA9IG9ial9wdXQoe30sIGFzLmd1bi5fLmdldCwgYXMuZGF0YSk7XHJcblx0XHRcdFx0XHRhcy5zb3VsID0gYXQuc291bCB8fCBjYXQuc291bCB8fCAob3B0LnV1aWQgfHwgY2F0LnJvb3QuXy5vcHQudXVpZCB8fCBHdW4udGV4dC5yYW5kb20pKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGFzLnJlZi5wdXQoYXMuZGF0YSwgYXMuc291bCwgYXMpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIG9iaiA9IEd1bi5vYmosIG9ial9pcyA9IG9iai5pcywgb2JqX3B1dCA9IG9iai5wdXQsIG9ial9tYXAgPSBvYmoubWFwO1xyXG5cdFx0dmFyIHUsIGVtcHR5ID0ge30sIG5vb3AgPSBmdW5jdGlvbigpe30sIGlpZmUgPSBmdW5jdGlvbihmbixhcyl7Zm4uY2FsbChhc3x8ZW1wdHkpfTtcclxuXHR9KShyZXF1aXJlLCAnLi9wdXQnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9yb290Jyk7XHJcblx0XHRtb2R1bGUuZXhwb3J0cyA9IEd1bjtcclxuXHJcblx0XHQ7KGZ1bmN0aW9uKCl7XHJcblx0XHRcdGZ1bmN0aW9uIG1ldGEodixmKXtcclxuXHRcdFx0XHRpZihvYmpfaGFzKEd1bi5fXy5fLCBmKSl7IHJldHVybiB9XHJcblx0XHRcdFx0b2JqX3B1dCh0aGlzLl8sIGYsIHYpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIG1hcCh2YWx1ZSwgZmllbGQpe1xyXG5cdFx0XHRcdGlmKEd1bi5fLm5vZGUgPT09IGZpZWxkKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgbm9kZSA9IHRoaXMubm9kZSwgdmVydGV4ID0gdGhpcy52ZXJ0ZXgsIHVuaW9uID0gdGhpcy51bmlvbiwgbWFjaGluZSA9IHRoaXMubWFjaGluZTtcclxuXHRcdFx0XHR2YXIgaXMgPSBzdGF0ZV9pcyhub2RlLCBmaWVsZCksIGNzID0gc3RhdGVfaXModmVydGV4LCBmaWVsZCk7XHJcblx0XHRcdFx0aWYodSA9PT0gaXMgfHwgdSA9PT0gY3MpeyByZXR1cm4gdHJ1ZSB9IC8vIGl0IGlzIHRydWUgdGhhdCB0aGlzIGlzIGFuIGludmFsaWQgSEFNIGNvbXBhcmlzb24uXHJcblx0XHRcdFx0dmFyIGl2ID0gdmFsdWUsIGN2ID0gdmVydGV4W2ZpZWxkXTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cdFx0XHRcdC8vIFRPRE86IEJVRyEgTmVlZCB0byBjb21wYXJlIHJlbGF0aW9uIHRvIG5vdCByZWxhdGlvbiwgYW5kIGNob29zZSB0aGUgcmVsYXRpb24gaWYgdGhlcmUgaXMgYSBzdGF0ZSBjb25mbGljdC5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cdFx0XHRcdGlmKCF2YWxfaXMoaXYpICYmIHUgIT09IGl2KXsgcmV0dXJuIHRydWUgfSAvLyBVbmRlZmluZWQgaXMgb2theSBzaW5jZSBhIHZhbHVlIG1pZ2h0IG5vdCBleGlzdCBvbiBib3RoIG5vZGVzLiAvLyBpdCBpcyB0cnVlIHRoYXQgdGhpcyBpcyBhbiBpbnZhbGlkIEhBTSBjb21wYXJpc29uLlxyXG5cdFx0XHRcdGlmKCF2YWxfaXMoY3YpICYmIHUgIT09IGN2KXsgcmV0dXJuIHRydWUgfSAgLy8gVW5kZWZpbmVkIGlzIG9rYXkgc2luY2UgYSB2YWx1ZSBtaWdodCBub3QgZXhpc3Qgb24gYm90aCBub2Rlcy4gLy8gaXQgaXMgdHJ1ZSB0aGF0IHRoaXMgaXMgYW4gaW52YWxpZCBIQU0gY29tcGFyaXNvbi5cclxuXHRcdFx0XHR2YXIgSEFNID0gR3VuLkhBTShtYWNoaW5lLCBpcywgY3MsIGl2LCBjdik7XHJcblx0XHRcdFx0aWYoSEFNLmVycil7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIi4hSFlQT1RIRVRJQ0FMIEFNTkVTSUEgTUFDSElORSBFUlIhLlwiLCBmaWVsZCwgSEFNLmVycik7IC8vIHRoaXMgZXJyb3Igc2hvdWxkIG5ldmVyIGhhcHBlbi5cclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoSEFNLnN0YXRlIHx8IEhBTS5oaXN0b3JpY2FsIHx8IEhBTS5jdXJyZW50KXsgLy8gVE9ETzogQlVHISBOb3QgaW1wbGVtZW50ZWQuXHJcblx0XHRcdFx0XHQvL29wdC5sb3dlcih2ZXJ0ZXgsIHtmaWVsZDogZmllbGQsIHZhbHVlOiB2YWx1ZSwgc3RhdGU6IGlzfSk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKEhBTS5pbmNvbWluZyl7XHJcblx0XHRcdFx0XHR1bmlvbltmaWVsZF0gPSB2YWx1ZTtcclxuXHRcdFx0XHRcdHN0YXRlX2lmeSh1bmlvbiwgZmllbGQsIGlzKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoSEFNLmRlZmVyKXsgLy8gVE9ETzogQlVHISBOb3QgaW1wbGVtZW50ZWQuXHJcblx0XHRcdFx0XHR1bmlvbltmaWVsZF0gPSB2YWx1ZTsgLy8gV1JPTkchIEJVRyEgTmVlZCB0byBpbXBsZW1lbnQgY29ycmVjdCBhbGdvcml0aG0uXHJcblx0XHRcdFx0XHRzdGF0ZV9pZnkodW5pb24sIGZpZWxkLCBpcyk7IC8vIFdST05HISBCVUchIE5lZWQgdG8gaW1wbGVtZW50IGNvcnJlY3QgYWxnb3JpdGhtLlxyXG5cdFx0XHRcdFx0Ly8gZmlsbGVyIGFsZ29yaXRobSBmb3Igbm93LlxyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0Lyp1cHBlci53YWl0ID0gdHJ1ZTtcclxuXHRcdFx0XHRcdG9wdC51cHBlci5jYWxsKHN0YXRlLCB2ZXJ0ZXgsIGZpZWxkLCBpbmNvbWluZywgY3R4LmluY29taW5nLnN0YXRlKTsgLy8gc2lnbmFscyB0aGF0IHRoZXJlIGFyZSBzdGlsbCBmdXR1cmUgbW9kaWZpY2F0aW9ucy5cclxuXHRcdFx0XHRcdEd1bi5zY2hlZHVsZShjdHguaW5jb21pbmcuc3RhdGUsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRcdHVwZGF0ZShpbmNvbWluZywgZmllbGQpO1xyXG5cdFx0XHRcdFx0XHRpZihjdHguaW5jb21pbmcuc3RhdGUgPT09IHVwcGVyLm1heCl7ICh1cHBlci5sYXN0IHx8IGZ1bmN0aW9uKCl7fSkoKSB9XHJcblx0XHRcdFx0XHR9LCBndW4uX18ub3B0LnN0YXRlKTsqL1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRHdW4uSEFNLnVuaW9uID0gZnVuY3Rpb24odmVydGV4LCBub2RlLCBvcHQpe1xyXG5cdFx0XHRcdGlmKCFub2RlIHx8ICFub2RlLl8peyByZXR1cm4gfVxyXG5cdFx0XHRcdHZlcnRleCA9IHZlcnRleCB8fCBHdW4ubm9kZS5zb3VsLmlmeSh7Xzp7Jz4nOnt9fX0sIEd1bi5ub2RlLnNvdWwobm9kZSkpO1xyXG5cdFx0XHRcdGlmKCF2ZXJ0ZXggfHwgIXZlcnRleC5fKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRvcHQgPSBudW1faXMob3B0KT8ge21hY2hpbmU6IG9wdH0gOiB7bWFjaGluZTogR3VuLnN0YXRlKCl9O1xyXG5cdFx0XHRcdG9wdC51bmlvbiA9IHZlcnRleCB8fCBHdW4ub2JqLmNvcHkodmVydGV4KTsgLy8gVE9ETzogUEVSRiEgVGhpcyB3aWxsIHNsb3cgdGhpbmdzIGRvd24hXHJcblx0XHRcdFx0Ly8gVE9ETzogUEVSRiEgQmlnZ2VzdCBzbG93ZG93biAoYWZ0ZXIgMW9jYWxTdG9yYWdlKSBpcyB0aGUgYWJvdmUgbGluZS4gRml4ISBGaXghXHJcblx0XHRcdFx0b3B0LnZlcnRleCA9IHZlcnRleDtcclxuXHRcdFx0XHRvcHQubm9kZSA9IG5vZGU7XHJcblx0XHRcdFx0Ly9vYmpfbWFwKG5vZGUuXywgbWV0YSwgb3B0LnVuaW9uKTsgLy8gVE9ETzogUmV2aWV3IGF0IHNvbWUgcG9pbnQ/XHJcblx0XHRcdFx0aWYob2JqX21hcChub2RlLCBtYXAsIG9wdCkpeyAvLyBpZiB0aGlzIHJldHVybnMgdHJ1ZSB0aGVuIHNvbWV0aGluZyB3YXMgaW52YWxpZC5cclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIG9wdC51bmlvbjtcclxuXHRcdFx0fVxyXG5cdFx0XHRHdW4uSEFNLmRlbHRhID0gZnVuY3Rpb24odmVydGV4LCBub2RlLCBvcHQpe1xyXG5cdFx0XHRcdG9wdCA9IG51bV9pcyhvcHQpPyB7bWFjaGluZTogb3B0fSA6IHttYWNoaW5lOiBHdW4uc3RhdGUoKX07XHJcblx0XHRcdFx0aWYoIXZlcnRleCl7IHJldHVybiBHdW4ub2JqLmNvcHkobm9kZSkgfVxyXG5cdFx0XHRcdG9wdC5zb3VsID0gR3VuLm5vZGUuc291bChvcHQudmVydGV4ID0gdmVydGV4KTtcclxuXHRcdFx0XHRpZighb3B0LnNvdWwpeyByZXR1cm4gfVxyXG5cdFx0XHRcdG9wdC5kZWx0YSA9IEd1bi5ub2RlLnNvdWwuaWZ5KHt9LCBvcHQuc291bCk7XHJcblx0XHRcdFx0b2JqX21hcChvcHQubm9kZSA9IG5vZGUsIGRpZmYsIG9wdCk7XHJcblx0XHRcdFx0cmV0dXJuIG9wdC5kZWx0YTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBkaWZmKHZhbHVlLCBmaWVsZCl7IHZhciBvcHQgPSB0aGlzO1xyXG5cdFx0XHRcdGlmKEd1bi5fLm5vZGUgPT09IGZpZWxkKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRpZighdmFsX2lzKHZhbHVlKSl7IHJldHVybiB9XHJcblx0XHRcdFx0dmFyIG5vZGUgPSBvcHQubm9kZSwgdmVydGV4ID0gb3B0LnZlcnRleCwgaXMgPSBzdGF0ZV9pcyhub2RlLCBmaWVsZCwgdHJ1ZSksIGNzID0gc3RhdGVfaXModmVydGV4LCBmaWVsZCwgdHJ1ZSksIGRlbHRhID0gb3B0LmRlbHRhO1xyXG5cdFx0XHRcdHZhciBIQU0gPSBHdW4uSEFNKG9wdC5tYWNoaW5lLCBpcywgY3MsIHZhbHVlLCB2ZXJ0ZXhbZmllbGRdKTtcclxuXHJcblxyXG5cclxuXHRcdFx0XHQvLyBUT0RPOiBCVUchISEhIFdIQVQgQUJPVVQgREVGRVJSRUQhPz8/XHJcblx0XHRcdFx0XHJcblxyXG5cclxuXHRcdFx0XHRpZihIQU0uaW5jb21pbmcpe1xyXG5cdFx0XHRcdFx0ZGVsdGFbZmllbGRdID0gdmFsdWU7XHJcblx0XHRcdFx0XHRzdGF0ZV9pZnkoZGVsdGEsIGZpZWxkLCBpcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdEd1bi5IQU0uc3ludGggPSBmdW5jdGlvbihhdCwgZXYpe1xyXG5cdFx0XHRcdHZhciBhcyA9IHRoaXMuYXMsIGNhdCA9IGFzLmd1bi5fO1xyXG5cdFx0XHRcdGlmKCFhdC5wdXQgfHwgKGFzWycuJ10gJiYgIW9ial9oYXMoYXQucHV0W2FzWycjJ11dLCBjYXQuZ2V0KSkpe1xyXG5cdFx0XHRcdFx0aWYoY2F0LnB1dCAhPT0gdSl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRjYXQub24oJ2luJywge1xyXG5cdFx0XHRcdFx0XHRnZXQ6IGNhdC5nZXQsXHJcblx0XHRcdFx0XHRcdHB1dDogY2F0LnB1dCA9IHUsXHJcblx0XHRcdFx0XHRcdGd1bjogY2F0Lmd1bixcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGF0Lmd1biA9IGNhdC5yb290O1xyXG5cdFx0XHRcdEd1bi5vbigncHV0JywgYXQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdEd1bi5IQU0uc3ludGhfID0gZnVuY3Rpb24oYXQsIGV2LCBhcyl7IHZhciBndW4gPSB0aGlzLmFzIHx8IGFzO1xyXG5cdFx0XHRcdHZhciBjYXQgPSBndW4uXywgcm9vdCA9IGNhdC5yb290Ll8sIHB1dCA9IHt9LCB0bXA7XHJcblx0XHRcdFx0aWYoIWF0LnB1dCl7XHJcblx0XHRcdFx0XHQvL2lmKG9ial9oYXMoY2F0LCAncHV0JykpeyByZXR1cm4gfVxyXG5cdFx0XHRcdFx0aWYoY2F0LnB1dCAhPT0gdSl7IHJldHVybiB9XHJcblx0XHRcdFx0XHRjYXQub24oJ2luJywge1xyXG5cdFx0XHRcdFx0Ly9yb290LmFjayhhdFsnQCddLCB7XHJcblx0XHRcdFx0XHRcdGdldDogY2F0LmdldCxcclxuXHRcdFx0XHRcdFx0cHV0OiBjYXQucHV0ID0gdSxcclxuXHRcdFx0XHRcdFx0Z3VuOiBndW4sXHJcblx0XHRcdFx0XHRcdHZpYTogYXRcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIFRPRE86IFBFUkYhIEhhdmUgb3B0aW9ucyB0byBkZXRlcm1pbmUgaWYgdGhpcyBkYXRhIHNob3VsZCBldmVuIGJlIGluIG1lbW9yeSBvbiB0aGlzIHBlZXIhXHJcblx0XHRcdFx0b2JqX21hcChhdC5wdXQsIGZ1bmN0aW9uKG5vZGUsIHNvdWwpeyB2YXIgZ3JhcGggPSB0aGlzLmdyYXBoO1xyXG5cdFx0XHRcdFx0cHV0W3NvdWxdID0gR3VuLkhBTS5kZWx0YShncmFwaFtzb3VsXSwgbm9kZSwge2dyYXBoOiBncmFwaH0pOyAvLyBUT0RPOiBQRVJGISBTRUUgSUYgV0UgQ0FOIE9QVElNSVpFIFRISVMgQlkgTUVSR0lORyBVTklPTiBJTlRPIERFTFRBIVxyXG5cdFx0XHRcdFx0Z3JhcGhbc291bF0gPSBHdW4uSEFNLnVuaW9uKGdyYXBoW3NvdWxdLCBub2RlKSB8fCBncmFwaFtzb3VsXTtcclxuXHRcdFx0XHR9LCByb290KTtcclxuXHRcdFx0XHRpZihhdC5ndW4gIT09IHJvb3QuZ3VuKXtcclxuXHRcdFx0XHRcdHB1dCA9IGF0LnB1dDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gVE9ETzogUEVSRiEgSGF2ZSBvcHRpb25zIHRvIGRldGVybWluZSBpZiB0aGlzIGRhdGEgc2hvdWxkIGV2ZW4gYmUgaW4gbWVtb3J5IG9uIHRoaXMgcGVlciFcclxuXHRcdFx0XHRvYmpfbWFwKHB1dCwgZnVuY3Rpb24obm9kZSwgc291bCl7XHJcblx0XHRcdFx0XHR2YXIgcm9vdCA9IHRoaXMsIG5leHQgPSByb290Lm5leHQgfHwgKHJvb3QubmV4dCA9IHt9KSwgZ3VuID0gbmV4dFtzb3VsXSB8fCAobmV4dFtzb3VsXSA9IHJvb3QuZ3VuLmdldChzb3VsKSksIGNvYXQgPSAoZ3VuLl8pO1xyXG5cdFx0XHRcdFx0Y29hdC5wdXQgPSByb290LmdyYXBoW3NvdWxdOyAvLyBUT0RPOiBCVUchIENsb25lIVxyXG5cdFx0XHRcdFx0aWYoY2F0LmZpZWxkICYmICFvYmpfaGFzKG5vZGUsIGNhdC5maWVsZCkpe1xyXG5cdFx0XHRcdFx0XHQoYXQgPSBvYmpfdG8oYXQsIHt9KSkucHV0ID0gdTtcclxuXHRcdFx0XHRcdFx0R3VuLkhBTS5zeW50aChhdCwgZXYsIGNhdC5ndW4pO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjb2F0Lm9uKCdpbicsIHtcclxuXHRcdFx0XHRcdFx0cHV0OiBub2RlLFxyXG5cdFx0XHRcdFx0XHRnZXQ6IHNvdWwsXHJcblx0XHRcdFx0XHRcdGd1bjogZ3VuLFxyXG5cdFx0XHRcdFx0XHR2aWE6IGF0XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9LCByb290KTtcclxuXHRcdFx0fVxyXG5cdFx0fSgpKTtcclxuXHJcblx0XHR2YXIgVHlwZSA9IEd1bjtcclxuXHRcdHZhciBudW0gPSBUeXBlLm51bSwgbnVtX2lzID0gbnVtLmlzO1xyXG5cdFx0dmFyIG9iaiA9IFR5cGUub2JqLCBvYmpfaGFzID0gb2JqLmhhcywgb2JqX3B1dCA9IG9iai5wdXQsIG9ial90byA9IG9iai50bywgb2JqX21hcCA9IG9iai5tYXA7XHJcblx0XHR2YXIgbm9kZSA9IEd1bi5ub2RlLCBub2RlX3NvdWwgPSBub2RlLnNvdWwsIG5vZGVfaXMgPSBub2RlLmlzLCBub2RlX2lmeSA9IG5vZGUuaWZ5O1xyXG5cdFx0dmFyIHN0YXRlID0gR3VuLnN0YXRlLCBzdGF0ZV9pcyA9IHN0YXRlLmlzLCBzdGF0ZV9pZnkgPSBzdGF0ZS5pZnk7XHJcblx0XHR2YXIgdmFsID0gR3VuLnZhbCwgdmFsX2lzID0gdmFsLmlzLCByZWxfaXMgPSB2YWwucmVsLmlzO1xyXG5cdFx0dmFyIHU7XHJcblx0fSkocmVxdWlyZSwgJy4vaW5kZXgnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL3Jvb3QnKTtcclxuXHRcdHJlcXVpcmUoJy4vaW5kZXgnKTsgLy8gVE9ETzogQ0xFQU4gVVAhIE1FUkdFIElOVE8gUk9PVCFcclxuXHRcdHJlcXVpcmUoJy4vb3B0Jyk7XHJcblx0XHRyZXF1aXJlKCcuL2NoYWluJyk7XHJcblx0XHRyZXF1aXJlKCcuL2JhY2snKTtcclxuXHRcdHJlcXVpcmUoJy4vcHV0Jyk7XHJcblx0XHRyZXF1aXJlKCcuL2dldCcpO1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBHdW47XHJcblx0fSkocmVxdWlyZSwgJy4vY29yZScpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vY29yZScpO1xyXG5cdFx0R3VuLmNoYWluLnBhdGggPSBmdW5jdGlvbihmaWVsZCwgY2IsIG9wdCl7XHJcblx0XHRcdHZhciBiYWNrID0gdGhpcywgZ3VuID0gYmFjaywgdG1wO1xyXG5cdFx0XHRvcHQgPSBvcHQgfHwge307IG9wdC5wYXRoID0gdHJ1ZTtcclxuXHRcdFx0R3VuLmxvZy5vbmNlKFwicGF0aGluZ1wiLCBcIldhcm5pbmc6IGAucGF0aGAgdG8gYmUgcmVtb3ZlZCBmcm9tIGNvcmUgKGJ1dCBhdmFpbGFibGUgYXMgYW4gZXh0ZW5zaW9uKSwgdXNlIGAuZ2V0YCBjaGFpbnMgaW5zdGVhZC4gSWYgeW91IGFyZSBvcHBvc2VkIHRvIHRoaXMsIHBsZWFzZSB2b2ljZSB5b3VyIG9waW5pb24gaW4gaHR0cHM6Ly9naXR0ZXIuaW0vYW1hcmsvZ3VuIGFuZCBhc2sgb3RoZXJzLlwiKTtcclxuXHRcdFx0aWYoZ3VuID09PSBndW4uXy5yb290KXtpZihjYil7Y2Ioe2VycjogR3VuLmxvZyhcIkNhbid0IGRvIHRoYXQgb24gcm9vdCBpbnN0YW5jZS5cIil9KX1yZXR1cm4gZ3VufVxyXG5cdFx0XHRpZih0eXBlb2YgZmllbGQgPT09ICdzdHJpbmcnKXtcclxuXHRcdFx0XHR0bXAgPSBmaWVsZC5zcGxpdChvcHQuc3BsaXQgfHwgJy4nKTtcclxuXHRcdFx0XHRpZigxID09PSB0bXAubGVuZ3RoKXtcclxuXHRcdFx0XHRcdGd1biA9IGJhY2suZ2V0KGZpZWxkLCBjYiwgb3B0KTtcclxuXHRcdFx0XHRcdGd1bi5fLm9wdCA9IG9wdDtcclxuXHRcdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZpZWxkID0gdG1wO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGZpZWxkIGluc3RhbmNlb2YgQXJyYXkpe1xyXG5cdFx0XHRcdGlmKGZpZWxkLmxlbmd0aCA+IDEpe1xyXG5cdFx0XHRcdFx0Z3VuID0gYmFjaztcclxuXHRcdFx0XHRcdHZhciBpID0gMCwgbCA9IGZpZWxkLmxlbmd0aDtcclxuXHRcdFx0XHRcdGZvcihpOyBpIDwgbDsgaSsrKXtcclxuXHRcdFx0XHRcdFx0Z3VuID0gZ3VuLmdldChmaWVsZFtpXSwgKGkrMSA9PT0gbCk/IGNiIDogbnVsbCwgb3B0KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vZ3VuLmJhY2sgPSBiYWNrOyAvLyBUT0RPOiBBUEkgY2hhbmdlIVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRndW4gPSBiYWNrLmdldChmaWVsZFswXSwgY2IsIG9wdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGd1bi5fLm9wdCA9IG9wdDtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCFmaWVsZCAmJiAwICE9IGZpZWxkKXtcclxuXHRcdFx0XHRyZXR1cm4gYmFjaztcclxuXHRcdFx0fVxyXG5cdFx0XHRndW4gPSBiYWNrLmdldCgnJytmaWVsZCwgY2IsIG9wdCk7XHJcblx0XHRcdGd1bi5fLm9wdCA9IG9wdDtcclxuXHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdH1cclxuXHR9KShyZXF1aXJlLCAnLi9wYXRoJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9jb3JlJyk7XHJcblx0XHRHdW4uY2hhaW4ub24gPSBmdW5jdGlvbih0YWcsIGFyZywgZWFzLCBhcyl7XHJcblx0XHRcdHZhciBndW4gPSB0aGlzLCBhdCA9IGd1bi5fLCB0bXAsIGFjdCwgb2ZmO1xyXG5cdFx0XHRpZih0eXBlb2YgdGFnID09PSAnc3RyaW5nJyl7XHJcblx0XHRcdFx0aWYoIWFyZyl7IHJldHVybiBhdC5vbih0YWcpIH1cclxuXHRcdFx0XHRhY3QgPSBhdC5vbih0YWcsIGFyZywgZWFzIHx8IGF0LCBhcyk7XHJcblx0XHRcdFx0aWYoZWFzICYmIGVhcy5ndW4pe1xyXG5cdFx0XHRcdFx0KGVhcy5zdWJzIHx8IChlYXMuc3VicyA9IFtdKSkucHVzaChhY3QpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRvZmYgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGlmIChhY3QgJiYgYWN0Lm9mZikgYWN0Lm9mZigpO1xyXG5cdFx0XHRcdFx0b2ZmLm9mZigpO1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0b2ZmLm9mZiA9IGd1bi5vZmYuYmluZChndW4pIHx8IG5vb3A7XHJcblx0XHRcdFx0Z3VuLm9mZiA9IG9mZjtcclxuXHRcdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBvcHQgPSBhcmc7XHJcblx0XHRcdG9wdCA9ICh0cnVlID09PSBvcHQpPyB7Y2hhbmdlOiB0cnVlfSA6IG9wdCB8fCB7fTtcclxuXHRcdFx0b3B0Lm9rID0gdGFnO1xyXG5cdFx0XHRvcHQubGFzdCA9IHt9O1xyXG5cdFx0XHRndW4uZ2V0KG9rLCBvcHQpOyAvLyBUT0RPOiBQRVJGISBFdmVudCBsaXN0ZW5lciBsZWFrISEhPz8/P1xyXG5cdFx0XHRyZXR1cm4gZ3VuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIG9rKGF0LCBldil7IHZhciBvcHQgPSB0aGlzO1xyXG5cdFx0XHR2YXIgZ3VuID0gYXQuZ3VuLCBjYXQgPSBndW4uXywgZGF0YSA9IGNhdC5wdXQgfHwgYXQucHV0LCB0bXAgPSBvcHQubGFzdCwgaWQgPSBjYXQuaWQrYXQuZ2V0LCB0bXA7XHJcblx0XHRcdGlmKHUgPT09IGRhdGEpe1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihkYXRhICYmIGRhdGFbcmVsLl9dICYmICh0bXAgPSByZWwuaXMoZGF0YSkpKXtcclxuXHRcdFx0XHR0bXAgPSAoY2F0LnJvb3QuZ2V0KHRtcCkuXyk7XHJcblx0XHRcdFx0aWYodSA9PT0gdG1wLnB1dCl7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGRhdGEgPSB0bXAucHV0O1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKG9wdC5jaGFuZ2UpeyAvLyBUT0RPOiBCVUc/IE1vdmUgYWJvdmUgdGhlIHVuZGVmIGNoZWNrcz9cclxuXHRcdFx0XHRkYXRhID0gYXQucHV0O1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIERFRFVQTElDQVRFIC8vIFRPRE86IE5FRURTIFdPUkshIEJBRCBQUk9UT1RZUEVcclxuXHRcdFx0aWYodG1wLnB1dCA9PT0gZGF0YSAmJiB0bXAuZ2V0ID09PSBpZCAmJiAhR3VuLm5vZGUuc291bChkYXRhKSl7IHJldHVybiB9XHJcblx0XHRcdHRtcC5wdXQgPSBkYXRhO1xyXG5cdFx0XHR0bXAuZ2V0ID0gaWQ7XHJcblx0XHRcdC8vIERFRFVQTElDQVRFIC8vIFRPRE86IE5FRURTIFdPUkshIEJBRCBQUk9UT1RZUEVcclxuXHRcdFx0Y2F0Lmxhc3QgPSBkYXRhO1xyXG5cdFx0XHRpZihvcHQuYXMpe1xyXG5cdFx0XHRcdG9wdC5vay5jYWxsKG9wdC5hcywgYXQsIGV2KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRvcHQub2suY2FsbChndW4sIGRhdGEsIGF0LmdldCwgYXQsIGV2KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdEd1bi5jaGFpbi52YWwgPSBmdW5jdGlvbihjYiwgb3B0KXtcclxuXHRcdFx0dmFyIGd1biA9IHRoaXMsIGF0ID0gZ3VuLl8sIGRhdGEgPSBhdC5wdXQ7XHJcblx0XHRcdGlmKDAgPCBhdC5hY2sgJiYgdSAhPT0gZGF0YSl7XHJcblx0XHRcdFx0KGNiIHx8IG5vb3ApLmNhbGwoZ3VuLCBkYXRhLCBhdC5nZXQpO1xyXG5cdFx0XHRcdHJldHVybiBndW47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY2Ipe1xyXG5cdFx0XHRcdChvcHQgPSBvcHQgfHwge30pLm9rID0gY2I7XHJcblx0XHRcdFx0b3B0LmNhdCA9IGF0O1xyXG5cdFx0XHRcdGd1bi5nZXQodmFsLCB7YXM6IG9wdH0pO1xyXG5cdFx0XHRcdG9wdC5hc3luYyA9IHRydWU7IC8vb3B0LmFzeW5jID0gYXQuc3R1bj8gMSA6IHRydWU7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0R3VuLmxvZy5vbmNlKFwidmFsb25jZVwiLCBcIkNoYWluYWJsZSB2YWwgaXMgZXhwZXJpbWVudGFsLCBpdHMgYmVoYXZpb3IgYW5kIEFQSSBtYXkgY2hhbmdlIG1vdmluZyBmb3J3YXJkLiBQbGVhc2UgcGxheSB3aXRoIGl0IGFuZCByZXBvcnQgYnVncyBhbmQgaWRlYXMgb24gaG93IHRvIGltcHJvdmUgaXQuXCIpO1xyXG5cdFx0XHRcdHZhciBjaGFpbiA9IGd1bi5jaGFpbigpO1xyXG5cdFx0XHRcdGNoYWluLl8udmFsID0gZ3VuLnZhbChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0Y2hhaW4uXy5vbignaW4nLCBndW4uXyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0cmV0dXJuIGNoYWluO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBndW47XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gdmFsKGF0LCBldiwgdG8pe1xyXG5cdFx0XHR2YXIgb3B0ID0gdGhpcy5hcywgY2F0ID0gb3B0LmNhdCwgZ3VuID0gYXQuZ3VuLCBjb2F0ID0gZ3VuLl8sIGRhdGEgPSBjb2F0LnB1dCB8fCBhdC5wdXQsIHRtcDtcclxuXHRcdFx0aWYodSA9PT0gZGF0YSl7XHJcblx0XHRcdFx0Ly9yZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoZGF0YSAmJiBkYXRhW3JlbC5fXSAmJiAodG1wID0gcmVsLmlzKGRhdGEpKSl7XHJcblx0XHRcdFx0dG1wID0gKGNhdC5yb290LmdldCh0bXApLl8pO1xyXG5cdFx0XHRcdGlmKHUgPT09IHRtcC5wdXQpe1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRkYXRhID0gdG1wLnB1dDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihldi53YWl0KXsgY2xlYXJUaW1lb3V0KGV2LndhaXQpIH1cclxuXHRcdFx0Ly9pZighdG8gJiYgKCEoMCA8IGNvYXQuYWNrKSB8fCAoKHRydWUgPT09IG9wdC5hc3luYykgJiYgMCAhPT0gb3B0LndhaXQpKSl7XHJcblx0XHRcdGlmKCFvcHQuYXN5bmMpe1xyXG5cdFx0XHRcdGV2LndhaXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHR2YWwuY2FsbCh7YXM6b3B0fSwgYXQsIGV2LCBldi53YWl0IHx8IDEpXHJcblx0XHRcdFx0fSwgb3B0LndhaXQgfHwgOTkpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihjYXQuZmllbGQgfHwgY2F0LnNvdWwpe1xyXG5cdFx0XHRcdGlmKGV2Lm9mZigpKXsgcmV0dXJuIH0gLy8gaWYgaXQgaXMgYWxyZWFkeSBvZmYsIGRvbid0IGNhbGwgYWdhaW4hXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYoKG9wdC5zZWVuID0gb3B0LnNlZW4gfHwge30pW2NvYXQuaWRdKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRvcHQuc2Vlbltjb2F0LmlkXSA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0b3B0Lm9rLmNhbGwoYXQuZ3VuIHx8IG9wdC5ndW4sIGRhdGEsIGF0LmdldCk7XHJcblx0XHR9XHJcblxyXG5cdFx0R3VuLmNoYWluLm9mZiA9IGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBndW4gPSB0aGlzLCBhdCA9IGd1bi5fLCB0bXA7XHJcblx0XHRcdHZhciBiYWNrID0gYXQuYmFjayB8fCB7fSwgY2F0ID0gYmFjay5fO1xyXG5cdFx0XHRpZighY2F0KXsgcmV0dXJuIH1cclxuXHRcdFx0aWYodG1wID0gY2F0Lm5leHQpe1xyXG5cdFx0XHRcdGlmKHRtcFthdC5nZXRdKXtcclxuXHRcdFx0XHRcdG9ial9kZWwodG1wLCBhdC5nZXQpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRvYmpfbWFwKHRtcCwgZnVuY3Rpb24ocGF0aCwga2V5KXtcclxuXHRcdFx0XHRcdFx0aWYoZ3VuICE9PSBwYXRoKXsgcmV0dXJuIH1cclxuXHRcdFx0XHRcdFx0b2JqX2RlbCh0bXAsIGtleSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoKHRtcCA9IGd1bi5iYWNrKC0xKSkgPT09IGJhY2spe1xyXG5cdFx0XHRcdG9ial9kZWwodG1wLmdyYXBoLCBhdC5nZXQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGF0Lm9ucyAmJiAodG1wID0gYXQub25zWydAJCddKSl7XHJcblx0XHRcdFx0b2JqX21hcCh0bXAucywgZnVuY3Rpb24oZXYpe1xyXG5cdFx0XHRcdFx0ZXYub2ZmKCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGd1bjtcclxuXHRcdH1cclxuXHRcdHZhciBvYmogPSBHdW4ub2JqLCBvYmpfaGFzID0gb2JqLmhhcywgb2JqX2RlbCA9IG9iai5kZWwsIG9ial90byA9IG9iai50bztcclxuXHRcdHZhciByZWwgPSBHdW4udmFsLnJlbDtcclxuXHRcdHZhciBlbXB0eSA9IHt9LCBub29wID0gZnVuY3Rpb24oKXt9LCB1O1xyXG5cdH0pKHJlcXVpcmUsICcuL29uJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9jb3JlJyksIHU7XHJcblx0XHRHdW4uY2hhaW4ubm90ID0gZnVuY3Rpb24oY2IsIG9wdCwgdCl7XHJcblx0XHRcdEd1bi5sb2cub25jZShcIm5vdHRvYmVcIiwgXCJXYXJuaW5nOiBgLm5vdGAgdG8gYmUgcmVtb3ZlZCBmcm9tIGNvcmUgKGJ1dCBhdmFpbGFibGUgYXMgYW4gZXh0ZW5zaW9uKSwgdXNlIGAudmFsYCBpbnN0ZWFkLCB3aGljaCBub3cgc3VwcG9ydHMgKHYwLjcueCspICdub3QgZm91bmQgZGF0YScgYXMgYHVuZGVmaW5lZGAgZGF0YSBpbiBjYWxsYmFja3MuIElmIHlvdSBhcmUgb3Bwb3NlZCB0byB0aGlzLCBwbGVhc2Ugdm9pY2UgeW91ciBvcGluaW9uIGluIGh0dHBzOi8vZ2l0dGVyLmltL2FtYXJrL2d1biBhbmQgYXNrIG90aGVycy5cIik7XHJcblx0XHRcdHJldHVybiB0aGlzLmdldChvdWdodCwge25vdDogY2J9KTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIG91Z2h0KGF0LCBldil7IGV2Lm9mZigpO1xyXG5cdFx0XHRpZihhdC5lcnIgfHwgKHUgIT09IGF0LnB1dCkpeyByZXR1cm4gfVxyXG5cdFx0XHRpZighdGhpcy5ub3QpeyByZXR1cm4gfVxyXG5cdFx0XHR0aGlzLm5vdC5jYWxsKGF0Lmd1biwgYXQuZ2V0LCBmdW5jdGlvbigpeyBjb25zb2xlLmxvZyhcIlBsZWFzZSByZXBvcnQgdGhpcyBidWcgb24gaHR0cHM6Ly9naXR0ZXIuaW0vYW1hcmsvZ3VuIGFuZCBpbiB0aGUgaXNzdWVzLlwiKTsgbmVlZC50by5pbXBsZW1lbnQ7IH0pO1xyXG5cdFx0fVxyXG5cdH0pKHJlcXVpcmUsICcuL25vdCcpO1xyXG5cclxuXHQ7cmVxdWlyZShmdW5jdGlvbihtb2R1bGUpe1xyXG5cdFx0dmFyIEd1biA9IHJlcXVpcmUoJy4vY29yZScpO1xyXG5cdFx0R3VuLmNoYWluLm1hcCA9IGZ1bmN0aW9uKGNiLCBvcHQsIHQpe1xyXG5cdFx0XHR2YXIgZ3VuID0gdGhpcywgY2F0ID0gZ3VuLl8sIGNoYWluO1xyXG5cdFx0XHRpZighY2Ipe1xyXG5cdFx0XHRcdGlmKGNoYWluID0gY2F0LmZpZWxkcyl7IHJldHVybiBjaGFpbiB9XHJcblx0XHRcdFx0Y2hhaW4gPSBjYXQuZmllbGRzID0gZ3VuLmNoYWluKCk7XHJcblx0XHRcdFx0Y2hhaW4uXy52YWwgPSBndW4uYmFjaygndmFsJyk7XHJcblx0XHRcdFx0Z3VuLm9uKCdpbicsIG1hcCwgY2hhaW4uXyk7XHJcblx0XHRcdFx0cmV0dXJuIGNoYWluO1xyXG5cdFx0XHR9XHJcblx0XHRcdEd1bi5sb2cub25jZShcIm1hcGZuXCIsIFwiTWFwIGZ1bmN0aW9ucyBhcmUgZXhwZXJpbWVudGFsLCB0aGVpciBiZWhhdmlvciBhbmQgQVBJIG1heSBjaGFuZ2UgbW92aW5nIGZvcndhcmQuIFBsZWFzZSBwbGF5IHdpdGggaXQgYW5kIHJlcG9ydCBidWdzIGFuZCBpZGVhcyBvbiBob3cgdG8gaW1wcm92ZSBpdC5cIik7XHJcblx0XHRcdGNoYWluID0gZ3VuLmNoYWluKCk7XHJcblx0XHRcdGd1bi5tYXAoKS5vbihmdW5jdGlvbihkYXRhLCBrZXksIGF0LCBldil7XHJcblx0XHRcdFx0dmFyIG5leHQgPSAoY2J8fG5vb3ApLmNhbGwodGhpcywgZGF0YSwga2V5LCBhdCwgZXYpO1xyXG5cdFx0XHRcdGlmKHUgPT09IG5leHQpeyByZXR1cm4gfVxyXG5cdFx0XHRcdGlmKEd1bi5pcyhuZXh0KSl7XHJcblx0XHRcdFx0XHRjaGFpbi5fLm9uKCdpbicsIG5leHQuXyk7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNoYWluLl8ub24oJ2luJywge2dldDoga2V5LCBwdXQ6IG5leHQsIGd1bjogY2hhaW59KTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBjaGFpbjtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIG1hcChhdCl7XHJcblx0XHRcdGlmKCFhdC5wdXQgfHwgR3VuLnZhbC5pcyhhdC5wdXQpKXsgcmV0dXJuIH1cclxuXHRcdFx0aWYodGhpcy5hcy52YWwpeyB0aGlzLm9mZigpIH0gLy8gVE9ETzogVWdseSBoYWNrIVxyXG5cdFx0XHRvYmpfbWFwKGF0LnB1dCwgZWFjaCwge2NhdDogdGhpcy5hcywgZ3VuOiBhdC5ndW59KTtcclxuXHRcdFx0dGhpcy50by5uZXh0KGF0KTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIGVhY2godixmKXtcclxuXHRcdFx0aWYobl8gPT09IGYpeyByZXR1cm4gfVxyXG5cdFx0XHR2YXIgY2F0ID0gdGhpcy5jYXQsIGd1biA9IHRoaXMuZ3VuLmdldChmKSwgYXQgPSAoZ3VuLl8pO1xyXG5cdFx0XHQoYXQuZWNobyB8fCAoYXQuZWNobyA9IHt9KSlbY2F0LmlkXSA9IGNhdDtcclxuXHRcdH1cclxuXHRcdHZhciBvYmpfbWFwID0gR3VuLm9iai5tYXAsIG5vb3AgPSBmdW5jdGlvbigpe30sIGV2ZW50ID0ge3N0dW46IG5vb3AsIG9mZjogbm9vcH0sIG5fID0gR3VuLm5vZGUuXywgdTtcclxuXHR9KShyZXF1aXJlLCAnLi9tYXAnKTtcclxuXHJcblx0O3JlcXVpcmUoZnVuY3Rpb24obW9kdWxlKXtcclxuXHRcdHZhciBHdW4gPSByZXF1aXJlKCcuL2NvcmUnKTtcclxuXHRcdEd1bi5jaGFpbi5zZXQgPSBmdW5jdGlvbihpdGVtLCBjYiwgb3B0KXtcclxuXHRcdFx0dmFyIGd1biA9IHRoaXMsIHNvdWw7XHJcblx0XHRcdGNiID0gY2IgfHwgZnVuY3Rpb24oKXt9O1xyXG5cdFx0XHRpZihzb3VsID0gR3VuLm5vZGUuc291bChpdGVtKSl7IHJldHVybiBndW4uc2V0KGd1bi5iYWNrKC0xKS5nZXQoc291bCksIGNiLCBvcHQpIH1cclxuXHRcdFx0aWYoIUd1bi5pcyhpdGVtKSl7XHJcblx0XHRcdFx0aWYoR3VuLm9iai5pcyhpdGVtKSl7IHJldHVybiBndW4uc2V0KGd1bi5fLnJvb3QucHV0KGl0ZW0pLCBjYiwgb3B0KSB9XHJcblx0XHRcdFx0cmV0dXJuIGd1bi5nZXQoR3VuLnRleHQucmFuZG9tKCkpLnB1dChpdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpdGVtLmdldCgnXycpLmdldChmdW5jdGlvbihhdCwgZXYpe1xyXG5cdFx0XHRcdGlmKCFhdC5ndW4gfHwgIWF0Lmd1bi5fLmJhY2spO1xyXG5cdFx0XHRcdGV2Lm9mZigpO1xyXG5cdFx0XHRcdGF0ID0gKGF0Lmd1bi5fLmJhY2suXyk7XHJcblx0XHRcdFx0dmFyIHB1dCA9IHt9LCBub2RlID0gYXQucHV0LCBzb3VsID0gR3VuLm5vZGUuc291bChub2RlKTtcclxuXHRcdFx0XHRpZighc291bCl7IHJldHVybiBjYi5jYWxsKGd1biwge2VycjogR3VuLmxvZygnT25seSBhIG5vZGUgY2FuIGJlIGxpbmtlZCEgTm90IFwiJyArIG5vZGUgKyAnXCIhJyl9KSB9XHJcblx0XHRcdFx0Z3VuLnB1dChHdW4ub2JqLnB1dChwdXQsIHNvdWwsIEd1bi52YWwucmVsLmlmeShzb3VsKSksIGNiLCBvcHQpO1xyXG5cdFx0XHR9LHt3YWl0OjB9KTtcclxuXHRcdFx0cmV0dXJuIGl0ZW07XHJcblx0XHR9XHJcblx0fSkocmVxdWlyZSwgJy4vc2V0Jyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHRpZih0eXBlb2YgR3VuID09PSAndW5kZWZpbmVkJyl7IHJldHVybiB9IC8vIFRPRE86IGxvY2FsU3RvcmFnZSBpcyBCcm93c2VyIG9ubHkuIEJ1dCBpdCB3b3VsZCBiZSBuaWNlIGlmIGl0IGNvdWxkIHNvbWVob3cgcGx1Z2luIGludG8gTm9kZUpTIGNvbXBhdGlibGUgbG9jYWxTdG9yYWdlIEFQSXM/XHJcblxyXG5cdFx0dmFyIHJvb3QsIG5vb3AgPSBmdW5jdGlvbigpe30sIHU7XHJcblx0XHRpZih0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyl7IHJvb3QgPSB3aW5kb3cgfVxyXG5cdFx0dmFyIHN0b3JlID0gcm9vdC5sb2NhbFN0b3JhZ2UgfHwge3NldEl0ZW06IG5vb3AsIHJlbW92ZUl0ZW06IG5vb3AsIGdldEl0ZW06IG5vb3B9O1xyXG5cclxuXHRcdHZhciBjaGVjayA9IHt9LCBkaXJ0eSA9IHt9LCBhc3luYyA9IHt9LCBjb3VudCA9IDAsIG1heCA9IDEwMDAwLCB3YWl0O1xyXG5cdFx0XHJcblx0XHRHdW4ub24oJ3B1dCcsIGZ1bmN0aW9uKGF0KXsgdmFyIGVyciwgaWQsIG9wdCwgcm9vdCA9IGF0Lmd1bi5fLnJvb3Q7XHJcblx0XHRcdHRoaXMudG8ubmV4dChhdCk7XHJcblx0XHRcdChvcHQgPSB7fSkucHJlZml4ID0gKGF0Lm9wdCB8fCBvcHQpLnByZWZpeCB8fCBhdC5ndW4uYmFjaygnb3B0LnByZWZpeCcpIHx8ICdndW4vJztcclxuXHRcdFx0dmFyIGdyYXBoID0gcm9vdC5fLmdyYXBoO1xyXG5cdFx0XHRHdW4ub2JqLm1hcChhdC5wdXQsIGZ1bmN0aW9uKG5vZGUsIHNvdWwpe1xyXG5cdFx0XHRcdGFzeW5jW3NvdWxdID0gYXN5bmNbc291bF0gfHwgZ3JhcGhbc291bF0gfHwgbm9kZTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdGNvdW50ICs9IDE7XHJcblx0XHRcdGNoZWNrW2F0WycjJ11dID0gcm9vdDtcclxuXHRcdFx0ZnVuY3Rpb24gc2F2ZSgpe1xyXG5cdFx0XHRcdGNsZWFyVGltZW91dCh3YWl0KTtcclxuXHRcdFx0XHR2YXIgYWNrID0gY2hlY2s7XHJcblx0XHRcdFx0dmFyIGFsbCA9IGFzeW5jO1xyXG5cdFx0XHRcdGNvdW50ID0gMDtcclxuXHRcdFx0XHR3YWl0ID0gZmFsc2U7XHJcblx0XHRcdFx0Y2hlY2sgPSB7fTtcclxuXHRcdFx0XHRhc3luYyA9IHt9O1xyXG5cdFx0XHRcdEd1bi5vYmoubWFwKGFsbCwgZnVuY3Rpb24obm9kZSwgc291bCl7XHJcblx0XHRcdFx0XHQvLyBTaW5jZSBsb2NhbFN0b3JhZ2Ugb25seSBoYXMgNU1CLCBpdCBpcyBiZXR0ZXIgdGhhdCB3ZSBrZWVwIG9ubHlcclxuXHRcdFx0XHRcdC8vIHRoZSBkYXRhIHRoYXQgdGhlIHVzZXIgaXMgY3VycmVudGx5IGludGVyZXN0ZWQgaW4uXHJcblx0XHRcdFx0XHRub2RlID0gZ3JhcGhbc291bF0gfHwgYWxsW3NvdWxdIHx8IG5vZGU7XHJcblx0XHRcdFx0XHR0cnl7c3RvcmUuc2V0SXRlbShvcHQucHJlZml4ICsgc291bCwgSlNPTi5zdHJpbmdpZnkobm9kZSkpO1xyXG5cdFx0XHRcdFx0fWNhdGNoKGUpeyBlcnIgPSBlIHx8IFwibG9jYWxTdG9yYWdlIGZhaWx1cmVcIiB9XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0aWYoIUd1bi5vYmouZW1wdHkoYXQuZ3VuLmJhY2soJ29wdC5wZWVycycpKSl7IHJldHVybiB9IC8vIG9ubHkgYWNrIGlmIHRoZXJlIGFyZSBubyBwZWVycy5cclxuXHRcdFx0XHRHdW4ub2JqLm1hcChhY2ssIGZ1bmN0aW9uKHJvb3QsIGlkKXtcclxuXHRcdFx0XHRcdHJvb3Qub24oJ2luJywge1xyXG5cdFx0XHRcdFx0XHQnQCc6IGlkLFxyXG5cdFx0XHRcdFx0XHRlcnI6IGVycixcclxuXHRcdFx0XHRcdFx0b2s6IDAgLy8gbG9jYWxTdG9yYWdlIGlzbid0IHJlbGlhYmxlLCBzbyBtYWtlIGl0cyBgb2tgIGNvZGUgYmUgYSBsb3cgbnVtYmVyLlxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoY291bnQgPj0gbWF4KXsgLy8gZ29hbCBpcyB0byBkbyAxMEsgaW5zZXJ0cy9zZWNvbmQuXHJcblx0XHRcdFx0cmV0dXJuIHNhdmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih3YWl0KXsgcmV0dXJuIH1cclxuXHRcdFx0Y2xlYXJUaW1lb3V0KHdhaXQpO1xyXG5cdFx0XHR3YWl0ID0gc2V0VGltZW91dChzYXZlLCAxMDAwKTtcclxuXHRcdH0pO1xyXG5cdFx0R3VuLm9uKCdnZXQnLCBmdW5jdGlvbihhdCl7XHJcblx0XHRcdHRoaXMudG8ubmV4dChhdCk7XHJcblx0XHRcdHZhciBndW4gPSBhdC5ndW4sIGxleCA9IGF0LmdldCwgc291bCwgZGF0YSwgb3B0LCB1O1xyXG5cdFx0XHQvL3NldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0KG9wdCA9IGF0Lm9wdCB8fCB7fSkucHJlZml4ID0gb3B0LnByZWZpeCB8fCBhdC5ndW4uYmFjaygnb3B0LnByZWZpeCcpIHx8ICdndW4vJztcclxuXHRcdFx0aWYoIWxleCB8fCAhKHNvdWwgPSBsZXhbR3VuLl8uc291bF0pKXsgcmV0dXJuIH1cclxuXHRcdFx0Ly9pZigwID49IGF0LmNhcCl7IHJldHVybiB9XHJcblx0XHRcdHZhciBmaWVsZCA9IGxleFsnLiddO1xyXG5cdFx0XHRkYXRhID0gR3VuLm9iai5pZnkoc3RvcmUuZ2V0SXRlbShvcHQucHJlZml4ICsgc291bCkgfHwgbnVsbCkgfHwgYXN5bmNbc291bF0gfHwgdTtcclxuXHRcdFx0aWYoZGF0YSAmJiBmaWVsZCl7XHJcblx0XHRcdFx0ZGF0YSA9IEd1bi5zdGF0ZS50byhkYXRhLCBmaWVsZCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoIWRhdGEgJiYgIUd1bi5vYmouZW1wdHkoZ3VuLmJhY2soJ29wdC5wZWVycycpKSl7IC8vIGlmIGRhdGEgbm90IGZvdW5kLCBkb24ndCBhY2sgaWYgdGhlcmUgYXJlIHBlZXJzLlxyXG5cdFx0XHRcdHJldHVybjsgLy8gSG1tLCB3aGF0IGlmIHdlIGhhdmUgcGVlcnMgYnV0IHdlIGFyZSBkaXNjb25uZWN0ZWQ/XHJcblx0XHRcdH1cclxuXHRcdFx0Z3VuLm9uKCdpbicsIHsnQCc6IGF0WycjJ10sIHB1dDogR3VuLmdyYXBoLm5vZGUoZGF0YSksIGhvdzogJ2xTJ30pO1xyXG5cdFx0XHQvL30sMTEpO1xyXG5cdFx0fSk7XHJcblx0fSkocmVxdWlyZSwgJy4vYWRhcHRlcnMvbG9jYWxTdG9yYWdlJyk7XHJcblxyXG5cdDtyZXF1aXJlKGZ1bmN0aW9uKG1vZHVsZSl7XHJcblx0XHR2YXIgR3VuID0gcmVxdWlyZSgnLi9jb3JlJyk7XHJcblxyXG5cdFx0aWYgKHR5cGVvZiBKU09OID09PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXHJcblx0XHRcdFx0J0d1biBkZXBlbmRzIG9uIEpTT04uIFBsZWFzZSBsb2FkIGl0IGZpcnN0OlxcbicgK1xyXG5cdFx0XHRcdCdhamF4LmNkbmpzLmNvbS9hamF4L2xpYnMvanNvbjIvMjAxMTAyMjMvanNvbjIuanMnXHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIFdlYlNvY2tldDtcclxuXHRcdGlmKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKXtcclxuXHRcdFx0V2ViU29ja2V0ID0gd2luZG93LldlYlNvY2tldCB8fCB3aW5kb3cud2Via2l0V2ViU29ja2V0IHx8IHdpbmRvdy5tb3pXZWJTb2NrZXQ7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHR2YXIgbWVzc2FnZSwgY291bnQgPSAwLCBub29wID0gZnVuY3Rpb24oKXt9LCB3YWl0O1xyXG5cclxuXHRcdEd1bi5vbignb3V0JywgZnVuY3Rpb24oYXQpe1xyXG5cdFx0XHR0aGlzLnRvLm5leHQoYXQpO1xyXG5cdFx0XHR2YXIgY2F0ID0gYXQuZ3VuLl8ucm9vdC5fLCB3c3AgPSBjYXQud3NwIHx8IChjYXQud3NwID0ge30pO1xyXG5cdFx0XHRpZihhdC53c3AgJiYgMSA9PT0gd3NwLmNvdW50KXsgcmV0dXJuIH0gLy8gaWYgdGhlIG1lc3NhZ2UgY2FtZSBGUk9NIHRoZSBvbmx5IHBlZXIgd2UgYXJlIGNvbm5lY3RlZCB0bywgZG9uJ3QgZWNobyBpdCBiYWNrLlxyXG5cdFx0XHRtZXNzYWdlID0gSlNPTi5zdHJpbmdpZnkoYXQpO1xyXG5cdFx0XHQvL2lmKCsrY291bnQpeyBjb25zb2xlLmxvZyhcIm1zZyBPVVQ6XCIsIGNvdW50LCBHdW4ub2JqLmlmeShtZXNzYWdlKSkgfVxyXG5cdFx0XHRpZihjYXQudWRyYWluKXtcclxuXHRcdFx0XHRjYXQudWRyYWluLnB1c2gobWVzc2FnZSk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNhdC51ZHJhaW4gPSBbXTtcclxuXHRcdFx0Y2xlYXJUaW1lb3V0KHdhaXQpO1xyXG5cdFx0XHR3YWl0ID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdGlmKCFjYXQudWRyYWluKXsgcmV0dXJuIH1cclxuXHRcdFx0XHR2YXIgdG1wID0gY2F0LnVkcmFpbjtcclxuXHRcdFx0XHRjYXQudWRyYWluID0gbnVsbDtcclxuXHRcdFx0XHRpZiggdG1wLmxlbmd0aCApIHtcclxuXHRcdFx0XHRcdG1lc3NhZ2UgPSBKU09OLnN0cmluZ2lmeSh0bXApO1xyXG5cdFx0XHRcdFx0R3VuLm9iai5tYXAoY2F0Lm9wdC5wZWVycywgc2VuZCwgY2F0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sMSk7XHJcblx0XHRcdHdzcC5jb3VudCA9IDA7XHJcblx0XHRcdEd1bi5vYmoubWFwKGNhdC5vcHQucGVlcnMsIHNlbmQsIGNhdCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRmdW5jdGlvbiBzZW5kKHBlZXIpe1xyXG5cdFx0XHR2YXIgbXNnID0gbWVzc2FnZSwgY2F0ID0gdGhpcztcclxuXHRcdFx0dmFyIHdpcmUgPSBwZWVyLndpcmUgfHwgb3BlbihwZWVyLCBjYXQpO1xyXG5cdFx0XHRpZihjYXQud3NwKXsgY2F0LndzcC5jb3VudCsrIH1cclxuXHRcdFx0aWYoIXdpcmUpeyByZXR1cm4gfVxyXG5cdFx0XHRpZih3aXJlLnJlYWR5U3RhdGUgPT09IHdpcmUuT1BFTil7XHJcblx0XHRcdFx0d2lyZS5zZW5kKG1zZyk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdChwZWVyLnF1ZXVlID0gcGVlci5xdWV1ZSB8fCBbXSkucHVzaChtc2cpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHJlY2VpdmUobXNnLCBwZWVyLCBjYXQpe1xyXG5cdFx0XHRpZighY2F0IHx8ICFtc2cpeyByZXR1cm4gfVxyXG5cdFx0XHR0cnl7bXNnID0gSlNPTi5wYXJzZShtc2cuZGF0YSB8fCBtc2cpO1xyXG5cdFx0XHR9Y2F0Y2goZSl7fVxyXG5cdFx0XHRpZihtc2cgaW5zdGFuY2VvZiBBcnJheSl7XHJcblx0XHRcdFx0dmFyIGkgPSAwLCBtO1xyXG5cdFx0XHRcdHdoaWxlKG0gPSBtc2dbaSsrXSl7XHJcblx0XHRcdFx0XHRyZWNlaXZlKG0sIHBlZXIsIGNhdCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHQvL2lmKCsrY291bnQpeyBjb25zb2xlLmxvZyhcIm1zZyBpbjpcIiwgY291bnQsIG1zZy5ib2R5IHx8IG1zZykgfVxyXG5cdFx0XHRpZihjYXQud3NwICYmIDEgPT09IGNhdC53c3AuY291bnQpeyAobXNnLmJvZHkgfHwgbXNnKS53c3AgPSBub29wIH0gLy8gSWYgdGhlcmUgaXMgb25seSAxIGNsaWVudCwganVzdCB1c2Ugbm9vcCBzaW5jZSBpdCBkb2Vzbid0IG1hdHRlci5cclxuXHRcdFx0Y2F0Lmd1bi5vbignaW4nLCBtc2cuYm9keSB8fCBtc2cpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIG9wZW4ocGVlciwgYXMpe1xyXG5cdFx0XHRpZighcGVlciB8fCAhcGVlci51cmwpeyByZXR1cm4gfVxyXG5cdFx0XHR2YXIgdXJsID0gcGVlci51cmwucmVwbGFjZSgnaHR0cCcsICd3cycpO1xyXG5cdFx0XHR2YXIgd2lyZSA9IHBlZXIud2lyZSA9IG5ldyBXZWJTb2NrZXQodXJsLCBhcy5vcHQud3NjLnByb3RvY29scywgYXMub3B0LndzYyApO1xyXG5cdFx0XHR3aXJlLm9uY2xvc2UgPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHJlY29ubmVjdChwZWVyLCBhcyk7XHJcblx0XHRcdH07XHJcblx0XHRcdHdpcmUub25lcnJvciA9IGZ1bmN0aW9uKGVycm9yKXtcclxuXHRcdFx0XHRyZWNvbm5lY3QocGVlciwgYXMpO1xyXG5cdFx0XHRcdGlmKCFlcnJvcil7IHJldHVybiB9XHJcblx0XHRcdFx0aWYoZXJyb3IuY29kZSA9PT0gJ0VDT05OUkVGVVNFRCcpe1xyXG5cdFx0XHRcdFx0Ly9yZWNvbm5lY3QocGVlciwgYXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0d2lyZS5vbm9wZW4gPSBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciBxdWV1ZSA9IHBlZXIucXVldWU7XHJcblx0XHRcdFx0cGVlci5xdWV1ZSA9IFtdO1xyXG5cdFx0XHRcdEd1bi5vYmoubWFwKHF1ZXVlLCBmdW5jdGlvbihtc2cpe1xyXG5cdFx0XHRcdFx0bWVzc2FnZSA9IG1zZztcclxuXHRcdFx0XHRcdHNlbmQuY2FsbChhcywgcGVlcik7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0d2lyZS5vbm1lc3NhZ2UgPSBmdW5jdGlvbihtc2cpe1xyXG5cdFx0XHRcdHJlY2VpdmUobXNnLCBwZWVyLCBhcyk7XHJcblx0XHRcdH07XHJcblx0XHRcdHJldHVybiB3aXJlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHJlY29ubmVjdChwZWVyLCBhcyl7XHJcblx0XHRcdGNsZWFyVGltZW91dChwZWVyLmRlZmVyKTtcclxuXHRcdFx0cGVlci5kZWZlciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRvcGVuKHBlZXIsIGFzKTtcclxuXHRcdFx0fSwgMiAqIDEwMDApO1xyXG5cdFx0fVxyXG5cdH0pKHJlcXVpcmUsICcuL3BvbHlmaWxsL3JlcXVlc3QnKTtcclxuXHJcbn0oKSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9ndW4vZ3VuLmpzIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IExlb24gUmV2aWxsIG9uIDE1LzEyLzIwMTUuXG4gKiBCbG9nOiBibG9nLnJldmlsbHdlYi5jb21cbiAqIEdpdEh1YjogaHR0cHM6Ly9naXRodWIuY29tL1JldmlsbFdlYlxuICogVHdpdHRlcjogQFJldmlsbFdlYlxuICovXG5cbi8qKlxuICogVGhlIG1haW4gcm91dGVyIGNsYXNzIGFuZCBlbnRyeSBwb2ludCB0byB0aGUgcm91dGVyLlxuICovXG5leHBvcnQgY2xhc3MgUmViZWxSb3V0ZXIgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cbiAgICAvKipcbiAgICAgKiBNYWluIGluaXRpYWxpc2F0aW9uIHBvaW50IG9mIHJlYmVsLXJvdXRlclxuICAgICAqIEBwYXJhbSBwcmVmaXggLSBJZiBleHRlbmRpbmcgcmViZWwtcm91dGVyIHlvdSBjYW4gc3BlY2lmeSBhIHByZWZpeCB3aGVuIGNhbGxpbmcgY3JlYXRlZENhbGxiYWNrIGluIGNhc2UgeW91ciBlbGVtZW50cyBuZWVkIHRvIGJlIG5hbWVkIGRpZmZlcmVudGx5XG4gICAgICovXG4gICAgY3JlYXRlZENhbGxiYWNrKHByZWZpeCkge1xuXG4gICAgICAgIGNvbnN0IF9wcmVmaXggPSBwcmVmaXggfHwgXCJyZWJlbFwiO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5wcmV2aW91c1BhdGggPSBudWxsO1xuICAgICAgICB0aGlzLmJhc2VQYXRoID0gbnVsbDtcblxuICAgICAgICAvL0dldCBvcHRpb25zXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgICAgICAgIFwiYW5pbWF0aW9uXCI6ICh0aGlzLmdldEF0dHJpYnV0ZShcImFuaW1hdGlvblwiKSA9PSBcInRydWVcIiksXG4gICAgICAgICAgICBcInNoYWRvd1Jvb3RcIjogKHRoaXMuZ2V0QXR0cmlidXRlKFwic2hhZG93XCIpID09IFwidHJ1ZVwiKSxcbiAgICAgICAgICAgIFwiaW5oZXJpdFwiOiAodGhpcy5nZXRBdHRyaWJ1dGUoXCJpbmhlcml0XCIpICE9IFwiZmFsc2VcIilcbiAgICAgICAgfTtcblxuICAgICAgICAvL0dldCByb3V0ZXNcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5pbmhlcml0ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAvL0lmIHRoaXMgaXMgYSBuZXN0ZWQgcm91dGVyIHRoZW4gd2UgbmVlZCB0byBnbyBhbmQgZ2V0IHRoZSBwYXJlbnQgcGF0aFxuICAgICAgICAgICAgbGV0ICRlbGVtZW50ID0gdGhpcztcbiAgICAgICAgICAgIHdoaWxlICgkZWxlbWVudC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgJGVsZW1lbnQgPSAkZWxlbWVudC5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIGlmICgkZWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09IF9wcmVmaXggKyBcIi1yb3V0ZXJcIikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50ID0gJGVsZW1lbnQuY3VycmVudCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJhc2VQYXRoID0gY3VycmVudC5yb3V0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucm91dGVzID0ge307XG4gICAgICAgIGNvbnN0ICRjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW47XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCAkY2hpbGQgPSAkY2hpbGRyZW5baV07XG4gICAgICAgICAgICBsZXQgcGF0aCA9ICRjaGlsZC5nZXRBdHRyaWJ1dGUoXCJwYXRoXCIpO1xuICAgICAgICAgICAgc3dpdGNoICgkY2hpbGQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgX3ByZWZpeCArIFwiLWRlZmF1bHRcIjpcbiAgICAgICAgICAgICAgICAgICAgcGF0aCA9IFwiKlwiO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIF9wcmVmaXggKyBcIi1yb3V0ZVwiOlxuICAgICAgICAgICAgICAgICAgICBwYXRoID0gKHRoaXMuYmFzZVBhdGggIT09IG51bGwpID8gdGhpcy5iYXNlUGF0aCArIHBhdGggOiBwYXRoO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXRoICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbGV0ICR0ZW1wbGF0ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKCRjaGlsZC5pbm5lckhUTUwpIHtcbiAgICAgICAgICAgICAgICAgICAgJHRlbXBsYXRlID0gXCI8XCIgKyBfcHJlZml4ICsgXCItcm91dGU+XCIgKyAkY2hpbGQuaW5uZXJIVE1MICsgXCI8L1wiICsgX3ByZWZpeCArIFwiLXJvdXRlPlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJvdXRlc1twYXRoXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJjb21wb25lbnRcIjogJGNoaWxkLmdldEF0dHJpYnV0ZShcImNvbXBvbmVudFwiKSxcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZW1wbGF0ZVwiOiAkdGVtcGxhdGVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9BZnRlciB3ZSBoYXZlIGNvbGxlY3RlZCBhbGwgY29uZmlndXJhdGlvbiBjbGVhciBpbm5lckhUTUxcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hhZG93Um9vdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVTaGFkb3dSb290KCk7XG4gICAgICAgICAgICB0aGlzLnJvb3QgPSB0aGlzLnNoYWRvd1Jvb3Q7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJvb3QgPSB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYW5pbWF0aW9uID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLmluaXRBbmltYXRpb24oKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICBSZWJlbFJvdXRlci5wYXRoQ2hhbmdlKChpc0JhY2spID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYW5pbWF0aW9uID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzQmFjayA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoXCJyYmwtYmFja1wiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoXCJyYmwtYmFja1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZ1bmN0aW9uIHVzZWQgdG8gaW5pdGlhbGlzZSB0aGUgYW5pbWF0aW9uIG1lY2hhbmljcyBpZiBhbmltYXRpb24gaXMgdHVybmVkIG9uXG4gICAgICovXG4gICAgaW5pdEFuaW1hdGlvbigpIHtcbiAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG4gICAgICAgICAgICBsZXQgbm9kZSA9IG11dGF0aW9uc1swXS5hZGRlZE5vZGVzWzBdO1xuICAgICAgICAgICAgaWYgKG5vZGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG90aGVyQ2hpbGRyZW4gPSB0aGlzLmdldE90aGVyQ2hpbGRyZW4obm9kZSk7XG4gICAgICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QuYWRkKFwicmViZWwtYW5pbWF0ZVwiKTtcbiAgICAgICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5hZGQoXCJlbnRlclwiKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG90aGVyQ2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJDaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkLmNsYXNzTGlzdC5hZGQoXCJleGl0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZC5jbGFzc0xpc3QuYWRkKFwiY29tcGxldGVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5hZGQoXCJjb21wbGV0ZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgICAgICAgICBjb25zdCBhbmltYXRpb25FbmQgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5jbGFzc05hbWUuaW5kZXhPZihcImV4aXRcIikgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yb290LnJlbW92ZUNoaWxkKGV2ZW50LnRhcmdldCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihcInRyYW5zaXRpb25lbmRcIiwgYW5pbWF0aW9uRW5kKTtcbiAgICAgICAgICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoXCJhbmltYXRpb25lbmRcIiwgYW5pbWF0aW9uRW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUodGhpcywge2NoaWxkTGlzdDogdHJ1ZX0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1ldGhvZCB1c2VkIHRvIGdldCB0aGUgY3VycmVudCByb3V0ZSBvYmplY3RcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBjdXJyZW50KCkge1xuICAgICAgICBjb25zdCBwYXRoID0gUmViZWxSb3V0ZXIuZ2V0UGF0aEZyb21VcmwoKTtcbiAgICAgICAgZm9yIChjb25zdCByb3V0ZSBpbiB0aGlzLnJvdXRlcykge1xuICAgICAgICAgICAgaWYgKHJvdXRlICE9PSBcIipcIikge1xuICAgICAgICAgICAgICAgIGxldCByZWdleFN0cmluZyA9IFwiXlwiICsgcm91dGUucmVwbGFjZSgve1xcdyt9XFwvPy9nLCBcIihcXFxcdyspXFwvP1wiKTtcbiAgICAgICAgICAgICAgICByZWdleFN0cmluZyArPSAocmVnZXhTdHJpbmcuaW5kZXhPZihcIlxcXFwvP1wiKSA+IC0xKSA/IFwiXCIgOiBcIlxcXFwvP1wiICsgXCIoWz89Ji1cXC9cXFxcdytdKyk/JFwiO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlZ2V4ID0gbmV3IFJlZ0V4cChyZWdleFN0cmluZyk7XG4gICAgICAgICAgICAgICAgaWYgKHJlZ2V4LnRlc3QocGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9yb3V0ZVJlc3VsdCh0aGlzLnJvdXRlc1tyb3V0ZV0sIHJvdXRlLCByZWdleCwgcGF0aCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAodGhpcy5yb3V0ZXNbXCIqXCJdICE9PSB1bmRlZmluZWQpID8gX3JvdXRlUmVzdWx0KHRoaXMucm91dGVzW1wiKlwiXSwgXCIqXCIsIG51bGwsIHBhdGgpIDogbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNZXRob2QgY2FsbGVkIHRvIHJlbmRlciB0aGUgY3VycmVudCB2aWV3XG4gICAgICovXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmN1cnJlbnQoKTtcbiAgICAgICAgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5wYXRoICE9PSB0aGlzLnByZXZpb3VzUGF0aCB8fCB0aGlzLm9wdGlvbnMuYW5pbWF0aW9uID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hbmltYXRpb24gIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb290LmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuY29tcG9uZW50ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCAkY29tcG9uZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChyZXN1bHQuY29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIHJlc3VsdC5wYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHJlc3VsdC5wYXJhbXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gXCJPYmplY3RcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlID0gSlNPTi5wYXJzZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ291bGRuJ3QgcGFyc2UgcGFyYW0gdmFsdWU6XCIsIGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICRjb21wb25lbnQuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm9vdC5hcHBlbmRDaGlsZCgkY29tcG9uZW50KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgJHRlbXBsYXRlID0gcmVzdWx0LnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICAvL1RPRE86IEZpbmQgYSBmYXN0ZXIgYWx0ZXJuYXRpdmVcbiAgICAgICAgICAgICAgICAgICAgaWYgKCR0ZW1wbGF0ZS5pbmRleE9mKFwiJHtcIikgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHRlbXBsYXRlID0gJHRlbXBsYXRlLnJlcGxhY2UoL1xcJHsoW157fV0qKX0vZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgciA9IHJlc3VsdC5wYXJhbXNbYl07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YgciA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHIgPT09ICdudW1iZXInID8gciA6IGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvb3QuaW5uZXJIVE1MID0gJHRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnByZXZpb3VzUGF0aCA9IHJlc3VsdC5wYXRoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSBub2RlIC0gVXNlZCB3aXRoIHRoZSBhbmltYXRpb24gbWVjaGFuaWNzIHRvIGdldCBhbGwgb3RoZXIgdmlldyBjaGlsZHJlbiBleGNlcHQgaXRzZWxmXG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqL1xuICAgIGdldE90aGVyQ2hpbGRyZW4obm9kZSkge1xuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IHRoaXMucm9vdC5jaGlsZHJlbjtcbiAgICAgICAgbGV0IHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgICAgICAgICBpZiAoY2hpbGQgIT0gbm9kZSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChjaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogU3RhdGljIGhlbHBlciBtZXRob2QgdG8gcGFyc2UgdGhlIHF1ZXJ5IHN0cmluZyBmcm9tIGEgdXJsIGludG8gYW4gb2JqZWN0LlxuICAgICAqIEBwYXJhbSB1cmxcbiAgICAgKiBAcmV0dXJucyB7e319XG4gICAgICovXG4gICAgc3RhdGljIHBhcnNlUXVlcnlTdHJpbmcodXJsKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgICAgaWYgKHVybCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB2YXIgcXVlcnlTdHJpbmcgPSAodXJsLmluZGV4T2YoXCI/XCIpID4gLTEpID8gdXJsLnN1YnN0cih1cmwuaW5kZXhPZihcIj9cIikgKyAxLCB1cmwubGVuZ3RoKSA6IG51bGw7XG4gICAgICAgICAgICBpZiAocXVlcnlTdHJpbmcgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBxdWVyeVN0cmluZy5zcGxpdChcIiZcIikuZm9yRWFjaChmdW5jdGlvbiAocGFydCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXBhcnQpIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgcGFydCA9IHBhcnQucmVwbGFjZShcIitcIiwgXCIgXCIpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXEgPSBwYXJ0LmluZGV4T2YoXCI9XCIpO1xuICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gZXEgPiAtMSA/IHBhcnQuc3Vic3RyKDAsIGVxKSA6IHBhcnQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWwgPSBlcSA+IC0xID8gZGVjb2RlVVJJQ29tcG9uZW50KHBhcnQuc3Vic3RyKGVxICsgMSkpIDogXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZyb20gPSBrZXkuaW5kZXhPZihcIltcIik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmcm9tID09IC0xKSByZXN1bHRbZGVjb2RlVVJJQ29tcG9uZW50KGtleSldID0gdmFsO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0byA9IGtleS5pbmRleE9mKFwiXVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IGRlY29kZVVSSUNvbXBvbmVudChrZXkuc3Vic3RyaW5nKGZyb20gKyAxLCB0bykpO1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5ID0gZGVjb2RlVVJJQ29tcG9uZW50KGtleS5zdWJzdHJpbmcoMCwgZnJvbSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXN1bHRba2V5XSkgcmVzdWx0W2tleV0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaW5kZXgpIHJlc3VsdFtrZXldLnB1c2godmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgcmVzdWx0W2tleV1baW5kZXhdID0gdmFsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdGF0aWMgaGVscGVyIG1ldGhvZCB0byBjb252ZXJ0IGEgY2xhc3MgbmFtZSB0byBhIHZhbGlkIGVsZW1lbnQgbmFtZS5cbiAgICAgKiBAcGFyYW0gQ2xhc3NcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIHN0YXRpYyBjbGFzc1RvVGFnKENsYXNzKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDbGFzcy5uYW1lIHdvdWxkIGJlIGJldHRlciBidXQgdGhpcyBpc24ndCBzdXBwb3J0ZWQgaW4gSUUgMTEuXG4gICAgICAgICAqL1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIG5hbWUgPSBDbGFzcy50b1N0cmluZygpLm1hdGNoKC9eZnVuY3Rpb25cXHMqKFteXFxzKF0rKS8pWzFdLnJlcGxhY2UoL1xcVysvZywgJy0nKS5yZXBsYWNlKC8oW2EtelxcZF0pKFtBLVowLTldKS9nLCAnJDEtJDInKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBwYXJzZSBjbGFzcyBuYW1lOlwiLCBlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoUmViZWxSb3V0ZXIudmFsaWRFbGVtZW50VGFnKG5hbWUpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2xhc3MgbmFtZSBjb3VsZG4ndCBiZSB0cmFuc2xhdGVkIHRvIHRhZy5cIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RhdGljIGhlbHBlciBtZXRob2QgdXNlZCB0byBkZXRlcm1pbmUgaWYgYW4gZWxlbWVudCB3aXRoIHRoZSBzcGVjaWZpZWQgbmFtZSBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQuXG4gICAgICogQHBhcmFtIG5hbWVcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBzdGF0aWMgaXNSZWdpc3RlcmVkRWxlbWVudChuYW1lKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5hbWUpLmNvbnN0cnVjdG9yICE9PSBIVE1MRWxlbWVudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdGF0aWMgaGVscGVyIG1ldGhvZCB0byB0YWtlIGEgd2ViIGNvbXBvbmVudCBjbGFzcywgY3JlYXRlIGFuIGVsZW1lbnQgbmFtZSBhbmQgcmVnaXN0ZXIgdGhlIG5ldyBlbGVtZW50IG9uIHRoZSBkb2N1bWVudC5cbiAgICAgKiBAcGFyYW0gQ2xhc3NcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIHN0YXRpYyBjcmVhdGVFbGVtZW50KENsYXNzKSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBSZWJlbFJvdXRlci5jbGFzc1RvVGFnKENsYXNzKTtcbiAgICAgICAgaWYgKFJlYmVsUm91dGVyLmlzUmVnaXN0ZXJlZEVsZW1lbnQobmFtZSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBDbGFzcy5wcm90b3R5cGUubmFtZSA9IG5hbWU7XG4gICAgICAgICAgICBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQobmFtZSwgQ2xhc3MpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuYW1lO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNpbXBsZSBzdGF0aWMgaGVscGVyIG1ldGhvZCBjb250YWluaW5nIGEgcmVndWxhciBleHByZXNzaW9uIHRvIHZhbGlkYXRlIGFuIGVsZW1lbnQgbmFtZVxuICAgICAqIEBwYXJhbSB0YWdcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBzdGF0aWMgdmFsaWRFbGVtZW50VGFnKHRhZykge1xuICAgICAgICByZXR1cm4gL15bYS16MC05XFwtXSskLy50ZXN0KHRhZyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWV0aG9kIHVzZWQgdG8gcmVnaXN0ZXIgYSBjYWxsYmFjayB0byBiZSBjYWxsZWQgd2hlbiB0aGUgVVJMIHBhdGggY2hhbmdlcy5cbiAgICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICAgKi9cbiAgICBzdGF0aWMgcGF0aENoYW5nZShjYWxsYmFjaykge1xuICAgICAgICBpZiAoUmViZWxSb3V0ZXIuY2hhbmdlQ2FsbGJhY2tzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIFJlYmVsUm91dGVyLmNoYW5nZUNhbGxiYWNrcyA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIFJlYmVsUm91dGVyLmNoYW5nZUNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgY29uc3QgY2hhbmdlSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogIGV2ZW50Lm9sZFVSTCBhbmQgZXZlbnQubmV3VVJMIHdvdWxkIGJlIGJldHRlciBoZXJlIGJ1dCB0aGlzIGRvZXNuJ3Qgd29yayBpbiBJRSA6KFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhyZWYgIT0gUmViZWxSb3V0ZXIub2xkVVJMKSB7XG4gICAgICAgICAgICAgICAgUmViZWxSb3V0ZXIuY2hhbmdlQ2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24oY2FsbGJhY2spe1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhSZWJlbFJvdXRlci5pc0JhY2spO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFJlYmVsUm91dGVyLmlzQmFjayA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgUmViZWxSb3V0ZXIub2xkVVJMID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgICAgIH07XG4gICAgICAgIGlmICh3aW5kb3cub25oYXNoY2hhbmdlID09PSBudWxsKSB7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJibGJhY2tcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBSZWJlbFJvdXRlci5pc0JhY2sgPSB0cnVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgd2luZG93Lm9uaGFzaGNoYW5nZSA9IGNoYW5nZUhhbmRsZXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RhdGljIGhlbHBlciBtZXRob2QgdXNlZCB0byBnZXQgdGhlIHBhcmFtZXRlcnMgZnJvbSB0aGUgcHJvdmlkZWQgcm91dGUuXG4gICAgICogQHBhcmFtIHJlZ2V4XG4gICAgICogQHBhcmFtIHJvdXRlXG4gICAgICogQHBhcmFtIHBhdGhcbiAgICAgKiBAcmV0dXJucyB7e319XG4gICAgICovXG4gICAgc3RhdGljIGdldFBhcmFtc0Zyb21VcmwocmVnZXgsIHJvdXRlLCBwYXRoKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBSZWJlbFJvdXRlci5wYXJzZVF1ZXJ5U3RyaW5nKHBhdGgpO1xuICAgICAgICB2YXIgcmUgPSAveyhcXHcrKX0vZztcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgbGV0IG1hdGNoO1xuICAgICAgICB3aGlsZSAobWF0Y2ggPSByZS5leGVjKHJvdXRlKSkge1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKG1hdGNoWzFdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVnZXggIT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHRzMiA9IHJlZ2V4LmV4ZWMocGF0aCk7XG4gICAgICAgICAgICByZXN1bHRzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGlkeCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtpdGVtXSA9IHJlc3VsdHMyW2lkeCArIDFdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdGF0aWMgaGVscGVyIG1ldGhvZCB1c2VkIHRvIGdldCB0aGUgcGF0aCBmcm9tIHRoZSBjdXJyZW50IFVSTC5cbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0UGF0aEZyb21VcmwoKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5tYXRjaCgvIyguKikkLyk7XG4gICAgICAgIGlmIChyZXN1bHQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRbMV07XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcInJlYmVsLXJvdXRlclwiLCBSZWJlbFJvdXRlcik7XG5cbi8qKlxuICogQ2xhc3Mgd2hpY2ggcmVwcmVzZW50cyB0aGUgcmViZWwtcm91dGUgY3VzdG9tIGVsZW1lbnRcbiAqL1xuZXhwb3J0IGNsYXNzIFJlYmVsUm91dGUgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cbn1cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcInJlYmVsLXJvdXRlXCIsIFJlYmVsUm91dGUpO1xuXG4vKipcbiAqIENsYXNzIHdoaWNoIHJlcHJlc2VudHMgdGhlIHJlYmVsLWRlZmF1bHQgY3VzdG9tIGVsZW1lbnRcbiAqL1xuY2xhc3MgUmViZWxEZWZhdWx0IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJyZWJlbC1kZWZhdWx0XCIsIFJlYmVsRGVmYXVsdCk7XG5cblxuLyoqXG4gKiBSZXByZXNlbnRzIHRoZSBwcm90b3R5cGUgZm9yIGFuIGFuY2hvciBlbGVtZW50IHdoaWNoIGFkZGVkIGZ1bmN0aW9uYWxpdHkgdG8gcGVyZm9ybSBhIGJhY2sgdHJhbnNpdGlvbi5cbiAqL1xuY2xhc3MgUmViZWxCYWNrQSBleHRlbmRzIEhUTUxBbmNob3JFbGVtZW50IHtcbiAgICBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSB0aGlzLmdldEF0dHJpYnV0ZShcImhyZWZcIik7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgaWYgKHBhdGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncmJsYmFjaycpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gcGF0aDtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuLyoqXG4gKiBSZWdpc3RlciB0aGUgYmFjayBidXR0b24gY3VzdG9tIGVsZW1lbnRcbiAqL1xuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwicmViZWwtYmFjay1hXCIsIHtcbiAgICBleHRlbmRzOiBcImFcIixcbiAgICBwcm90b3R5cGU6IFJlYmVsQmFja0EucHJvdG90eXBlXG59KTtcblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGEgcm91dGUgb2JqZWN0XG4gKiBAcGFyYW0gb2JqIC0gdGhlIGNvbXBvbmVudCBuYW1lIG9yIHRoZSBIVE1MIHRlbXBsYXRlXG4gKiBAcGFyYW0gcm91dGVcbiAqIEBwYXJhbSByZWdleFxuICogQHBhcmFtIHBhdGhcbiAqIEByZXR1cm5zIHt7fX1cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIF9yb3V0ZVJlc3VsdChvYmosIHJvdXRlLCByZWdleCwgcGF0aCkge1xuICAgIGxldCByZXN1bHQgPSB7fTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBvYmpba2V5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQucm91dGUgPSByb3V0ZTtcbiAgICByZXN1bHQucGF0aCA9IHBhdGg7XG4gICAgcmVzdWx0LnBhcmFtcyA9IFJlYmVsUm91dGVyLmdldFBhcmFtc0Zyb21VcmwocmVnZXgsIHJvdXRlLCBwYXRoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vcmViZWwtcm91dGVyL3NyYy9yZWJlbC1yb3V0ZXIuanMiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBlbmNyeXB0Q2xlYXJUZXh0KG9wZW5wZ3ApIHtcbiAgICAvLyB1c2FnZTogZW5jcnlwdENsZWFyVGV4dChvcGVucGdwKShwdWJsaWNLZXlBcm1vcikoY2xlYXJ0ZXh0KS50aGVuKHJlc3VsdCA9PiByZXN1bHQpXG4gICAgcmV0dXJuICghb3BlbnBncCkgP1xuICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBvcGVucGdwJyk6XG4gICAgKHB1YmxpY0tleUFybW9yKSA9PiB7XG4gICAgICAgIHJldHVybiAoIXB1YmxpY0tleUFybW9yKSA/XG4gICAgICAgIFByb21pc2UucmVqZWN0KCdFcnJvcjogbWlzc2luZyBwdWJsaWMga2V5Jyk6XG4gICAgICAgIChjbGVhcnRleHQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoIWNsZWFydGV4dCkgP1xuICAgICAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIGNsZWFydGV4dCcpOlxuICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBQR1BQdWJrZXkgPSBvcGVucGdwLmtleS5yZWFkQXJtb3JlZChwdWJsaWNLZXlBcm1vcilcbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgIHRoZSBsYXRlc3Qgb3BlbnBncCAyLjUuNCBicmVha3Mgb24gb3VyIGNvbnNvbGUgb25seSB0b29scy5cbiAgICAgICAgICAgICAgICBidXQgaXQncyAxMHggZmFzdGVyIG9uIGJyb3dzZXJzIHNvIFRIRSBORVcgQ09ERSBTVEFZUyBJTi5cbiAgICAgICAgICAgICAgICBiZWxvdyB3ZSBleHBsb2l0IGZhbGxiYWNrIHRvIG9sZCBzbG93IGVycm9yIGZyZWUgb3BlbnBncCAxLjYuMlxuICAgICAgICAgICAgICAgIGJ5IGFkYXB0aW5nIG9uIHRoZSBmbHkgdG8gYSBicmVha2luZyBjaGFuZ2VcbiAgICAgICAgICAgICAgICAob3BlbnBncCBidWcgXjEuNi4yIC0+IDIuNS40IG1hZGUgdXMgZG8gaXQpXG4gICAgICAgICAgICAgICAgcmVmYWN0b3I6IHJlbW92ZSB0cnkgc2VjdGlvbiBvZiB0cnljYXRjaCBrZWVwIGNhdGNoIHNlY3Rpb25cbiAgICAgICAgICAgICAgICBieSBhbGwgbWVhbnMgcmVmYWN0b3IgaWYgbm90IGJyb2tlbiBhZnRlciBvcGVucGdwIDIuNS40XG4gICAgICAgICAgICAgICAgaWYgeW91IGNoZWNrIG9wZW5wZ3AgcGxlYXNlIGJ1bXAgZmFpbGluZyB2ZXJzaW9uICBeXl5eXlxuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gd29ya3Mgb25seSBvbiBvcGVucGdwIHZlcnNpb24gMS42LjJcbiAgICAgICAgICAgICAgICAgICAgb3BlbnBncC5lbmNyeXB0TWVzc2FnZShQR1BQdWJrZXkua2V5c1swXSwgY2xlYXJ0ZXh0KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihlbmNyeXB0ZWR0eHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShlbmNyeXB0ZWR0eHQpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgpXG4gICAgICAgICAgICAgICAgfSBjYXRjaChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gd29ya3Mgb24gb3BlbnBncCB2ZXJzaW9uIDIuNS40XG4gICAgICAgICAgICAgICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogY2xlYXJ0ZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcHVibGljS2V5czogb3BlbnBncC5rZXkucmVhZEFybW9yZWQocHVibGljS2V5QXJtb3IpLmtleXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcm1vcjogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBvcGVucGdwLmVuY3J5cHQob3B0aW9ucylcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGNpcGhlcnRleHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY2lwaGVydGV4dC5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvZW5jcnlwdENsZWFyVGV4dC5qcyIsIid1c2Ugc3RyaWN0JztcblxuLy8gaW1wb3J0IHtoYW5kbGVQR1BQdWJrZXl9IGZyb20gJy4uLy4uL3NyYy9saWIvdXRpbC5qcyc7XG4vLyBpbXBvcnQge2hhbmRsZVBHUFByaXZrZXl9IGZyb20gJy4uLy4uL3NyYy9saWIvdXRpbC5qcyc7XG4vLyBpbXBvcnQge2hhbmRsZVBHUE1lc3NhZ2V9IGZyb20gJy4uLy4uL3NyYy9saWIvdXRpbC5qcyc7XG5cbmltcG9ydCB7ZW5jcnlwdENsZWFydGV4dE11bHRpfSBmcm9tICcuL2VuY3J5cHRDbGVhcnRleHRNdWx0aS5qcyc7XG5pbXBvcnQge2RlY3J5cHRQR1BNZXNzYWdlfSBmcm9tICcuL2RlY3J5cHRQR1BNZXNzYWdlLmpzJztcbmltcG9ydCB7ZGV0ZXJtaW5lQ29udGVudFR5cGV9IGZyb20gJy4vZGV0ZXJtaW5lQ29udGVudFR5cGUuanMnO1xuaW1wb3J0IHtzYXZlUEdQUHVia2V5fSBmcm9tICcuL3NhdmVQR1BQdWJrZXkuanMnO1xuaW1wb3J0IHtzYXZlUEdQUHJpdmtleX0gZnJvbSAnLi9zYXZlUEdQUHJpdmtleS5qcyc7XG4vLyBpbXBvcnQge2dldEZyb21TdG9yYWdlfSBmcm9tICcuL2dldEZyb21TdG9yYWdlJztcblxuY29uc3QgUEdQUFVCS0VZID0gJ1BHUFB1YmtleSc7XG5jb25zdCBDTEVBUlRFWFQgPSAnY2xlYXJ0ZXh0JztcbmNvbnN0IFBHUFBSSVZLRVkgPSAnUEdQUHJpdmtleSc7XG5jb25zdCBQR1BNRVNTQUdFID0gJ1BHUE1lc3NhZ2UnO1xuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlUG9zdChjb250ZW50KSB7XG4gICAgcmV0dXJuICghY29udGVudCkgP1xuICAgIFByb21pc2UucmVzb2x2ZSgnJykgOlxuICAgIChvcGVucGdwKSA9PiB7XG4gICAgICAgIHJldHVybiAoIW9wZW5wZ3ApID9cbiAgICAgICAgUHJvbWlzZS5yZWplY3QoJ0Vycm9yOiBtaXNzaW5nIG9wZW5wZ3AnKTpcbiAgICAgICAgKGxvY2FsU3RvcmFnZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChwYXNzd29yZCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGRldGVybWluZUNvbnRlbnRUeXBlKGNvbnRlbnQpKG9wZW5wZ3ApXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGNvbnRlbnRUeXBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50VHlwZSA9PT0gQ0xFQVJURVhUKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coQ0xFQVJURVhUKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlbmNyeXB0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVuY3J5cHRDbGVhcnRleHRNdWx0aShjb250ZW50KShvcGVucGdwKShsb2NhbFN0b3JhZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudFR5cGUgPT09IFBHUFBSSVZLRVkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhQR1BQUklWS0VZKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzYXZlIGFuZCBicm9hZGNhc3QgY29udmVydGVkIHB1YmxpYyBrZXlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2F2ZVBHUFByaXZrZXkoY29udGVudCkob3BlbnBncCkobG9jYWxTdG9yYWdlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vcmV0dXJuIGJyb2FkY2FzdE1lc3NhZ2UoY29udGVudCkob3BlbnBncCkobG9jYWxTdG9yYWdlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiByZXN1bHQpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGVudFR5cGUgPT09IFBHUFBVQktFWSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFBHUFBVQktFWSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2F2ZSB0byBsb2NhbFN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2F2ZVBHUFB1YmtleShjb250ZW50KShvcGVucGdwKShsb2NhbFN0b3JhZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250ZW50VHlwZSA9PT0gUEdQTUVTU0FHRSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFBHUE1FU1NBR0UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdldCBQR1BLZXlzLCBkZWNyeXB0LCAgYW5kIHJldHVyblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkZWNyeXB0UEdQTWVzc2FnZShvcGVucGdwKShsb2NhbFN0b3JhZ2UpKHBhc3N3b3JkKShjb250ZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXN1bHQpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiByZWplY3QoZXJyKSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xpYi9oYW5kbGVQb3N0LmpzIiwibGV0IGNvbm5lY3RQYXJ0aWFsID0gcmVxdWlyZShcInJhdy1sb2FkZXIhLi4vLi4vdmlld3MvcGFydGlhbHMvY29ubmVjdC5odG1sXCIpO1xuZXhwb3J0IGNsYXNzIENvbm5lY3RQYWdlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICAgIGF0dGFjaGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuaW5uZXJIVE1MID0gJzxwPicgKyBjb25uZWN0UGFydGlhbCArICc8L3A+JztcbiAgICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJjb25uZWN0LXBhZ2VcIiwgQ29ubmVjdFBhZ2UpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhZ2VzL2Nvbm5lY3QuanMiLCJsZXQgY29udGFjdFBhcnRpYWwgPSByZXF1aXJlKFwicmF3LWxvYWRlciEuLi8uLi92aWV3cy9wYXJ0aWFscy9jb250YWN0Lmh0bWxcIik7XG5leHBvcnQgY2xhc3MgQ29udGFjdFBhZ2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gICAgYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5pbm5lckhUTUwgPSAnPHA+JyArIGNvbnRhY3RQYXJ0aWFsICsgJzwvcD4nO1xuICAgIH1cbn1cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcImNvbnRhY3QtcGFnZVwiLCBDb250YWN0UGFnZSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFnZXMvY29udGFjdC5qcyIsInZhciBmcmVzaERlY2tQYXJ0aWFsID0gcmVxdWlyZShcInJhdy1sb2FkZXIhLi4vLi4vdmlld3MvcGFydGlhbHMvZnJlc2hkZWNrLmh0bWxcIik7XG5cbmV4cG9ydCBjbGFzcyBEZWNrUGFnZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLmlubmVySFRNTCA9ICc8cD4nICsgZnJlc2hEZWNrUGFydGlhbCArICc8L3A+JztcbiAgICB9XG59XG5cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcImRlY2stcGFnZVwiLCBEZWNrUGFnZSk7XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ3BsYXlpbmctY2FyZCcsIHtcbiAgICBwcm90b3R5cGU6IE9iamVjdC5jcmVhdGUoSFRNTEVsZW1lbnQucHJvdG90eXBlLCB7IGNyZWF0ZWRDYWxsYmFjazoge1xuICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgdmFyIHJvb3QgPSB0aGlzLmNyZWF0ZVNoYWRvd1Jvb3QoKTtcbiAgICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgdGhpcy50ZXh0Q29udGVudCB8fCAnI+KWiCcpO1xuICAgICAgICAgICAgICAgICAgdmFyIGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgIHZhciBjb2xvck92ZXJyaWRlID0gKHRoaXMucXVlcnlTZWxlY3Rvcignc3BhbicpKSA/IHRoaXMucXVlcnlTZWxlY3Rvcignc3BhbicpLnN0eWxlLmNvbG9yOiBudWxsO1xuICAgICAgICAgICAgICAgICAgaWYgKGNvbG9yT3ZlcnJpZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICBjbG9uZS5xdWVyeVNlbGVjdG9yKCdzdmcnKS5zdHlsZS5maWxsID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdzcGFuJykuc3R5bGUuY29sb3I7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICByb290LmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG59KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYWdlcy9kZWNrLmpzIiwidmFyIGluZGV4UGFydGlhbCA9IHJlcXVpcmUoXCJyYXctbG9hZGVyIS4uLy4uL3ZpZXdzL3BhcnRpYWxzL2luZGV4Lmh0bWxcIik7XG5leHBvcnQgY2xhc3MgSW5kZXhQYWdlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICAgIGF0dGFjaGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuaW5uZXJIVE1MID0gYFxuICAgICAgICA8cD4ke2luZGV4UGFydGlhbH08L3A+XG4gICAgICAgIGA7XG4gICAgfVxufVxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwiaW5kZXgtcGFnZVwiLCBJbmRleFBhZ2UpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhZ2VzL2luZGV4LmpzIiwidmFyIGNsaWVudFB1YmtleUZvcm1QYXJ0aWFsID0gcmVxdWlyZShcInJhdy1sb2FkZXIhLi4vLi4vdmlld3MvcGFydGlhbHMvbWVzc2FnZV9mb3JtLmh0bWxcIik7XG5cbmV4cG9ydCBjbGFzcyBNZXNzYWdlUGFnZSBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLmlubmVySFRNTCA9IGBcbiAgICAgICAgICAgIDxwPiR7Y2xpZW50UHVia2V5Rm9ybVBhcnRpYWx9PC9wPlxuICAgICAgICBgXG4gICAgfVxufVxuZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwibWVzc2FnZS1wYWdlXCIsIE1lc3NhZ2VQYWdlKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYWdlcy9tZXNzYWdlLmpzIiwidmFyIHJvYWRtYXBQYXJ0aWFsID0gcmVxdWlyZShcInJhdy1sb2FkZXIhLi4vLi4vdmlld3MvcGFydGlhbHMvcm9hZG1hcC5odG1sXCIpO1xuZXhwb3J0IGNsYXNzIFJvYWRtYXBQYWdlIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICAgIGF0dGFjaGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuaW5uZXJIVE1MID0gJzxwPicgKyByb2FkbWFwUGFydGlhbCArICc8L3A+JztcbiAgICB9XG59XG5kb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJyb2FkbWFwLXBhZ2VcIiwgUm9hZG1hcFBhZ2UpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhZ2VzL3JvYWRtYXAuanMiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi9wcm9jZXNzL2Jyb3dzZXIuanMiLCJ2YXIgZztcclxuXHJcbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXHJcbmcgPSAoZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn0pKCk7XHJcblxyXG50cnkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxyXG5cdGcgPSBnIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKSB8fCAoMSxldmFsKShcInRoaXNcIik7XHJcbn0gY2F0Y2goZSkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXHJcblx0aWYodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIilcclxuXHRcdGcgPSB3aW5kb3c7XHJcbn1cclxuXHJcbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cclxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3NcclxuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtb2R1bGUpIHtcclxuXHRpZighbW9kdWxlLndlYnBhY2tQb2x5ZmlsbCkge1xyXG5cdFx0bW9kdWxlLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKCkge307XHJcblx0XHRtb2R1bGUucGF0aHMgPSBbXTtcclxuXHRcdC8vIG1vZHVsZS5wYXJlbnQgPSB1bmRlZmluZWQgYnkgZGVmYXVsdFxyXG5cdFx0aWYoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XHJcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImxvYWRlZFwiLCB7XHJcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIG1vZHVsZS5sO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwiaWRcIiwge1xyXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBtb2R1bGUuaTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRtb2R1bGUud2VicGFja1BvbHlmaWxsID0gMTtcclxuXHR9XHJcblx0cmV0dXJuIG1vZHVsZTtcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vICh3ZWJwYWNrKS9idWlsZGluL21vZHVsZS5qcyIsIid1c2Ugc3RyaWN0Jztcbi8vaW1wb3J0ICd3ZWJjb21wb25lbnRzLmpzL3dlYmNvbXBvbmVudHMuanMnO1xuLy91bmNvbW1lbnQgbGluZSBhYm92ZSB0byBkb3VibGUgYXBwIHNpemUgYW5kIHN1cHBvcnQgaW9zLlxuXG5pbXBvcnQge2hhbmRsZVBvc3R9IGZyb20gJy4vbGliL2hhbmRsZVBvc3QuanMnO1xuaW1wb3J0IHtkZXRlcm1pbmVDb250ZW50VHlwZX0gZnJvbSAnLi9saWIvZGV0ZXJtaW5lQ29udGVudFR5cGUuanMnXG5pbXBvcnQge2RldGVybWluZUtleVR5cGV9IGZyb20gJy4vbGliL2RldGVybWluZUtleVR5cGUuanMnXG5pbXBvcnQge2VuY3J5cHRDbGVhcnRleHRNdWx0aX0gZnJvbSAnLi9saWIvZW5jcnlwdENsZWFydGV4dE11bHRpLmpzJ1xuaW1wb3J0IHtlbmNyeXB0Q2xlYXJUZXh0fSBmcm9tICcuL2xpYi9lbmNyeXB0Q2xlYXJUZXh0LmpzJ1xuaW1wb3J0IHtkZWNyeXB0UEdQTWVzc2FnZX0gZnJvbSAnLi9saWIvZGVjcnlwdFBHUE1lc3NhZ2UuanMnXG5pbXBvcnQge3NhdmVQR1BQdWJrZXl9IGZyb20gJy4vbGliL3NhdmVQR1BQdWJrZXkuanMnXG5pbXBvcnQge3NhdmVQR1BQcml2a2V5fSBmcm9tICcuL2xpYi9zYXZlUEdQUHJpdmtleS5qcydcbmltcG9ydCB7Z2V0RnJvbVN0b3JhZ2V9IGZyb20gJy4vbGliL2dldEZyb21TdG9yYWdlLmpzJ1xuaW1wb3J0IHtkZWNyeXB0UEdQTWVzc2FnZVdpdGhLZXl9IGZyb20gJy4vbGliL2RlY3J5cHRQR1BNZXNzYWdlV2l0aEtleS5qcydcblxud2luZG93LmhhbmRsZVBvc3QgPSBoYW5kbGVQb3N0IDtcbndpbmRvdy5kZXRlcm1pbmVDb250ZW50VHlwZSA9IGRldGVybWluZUNvbnRlbnRUeXBlO1xud2luZG93LmRldGVybWluZUtleVR5cGUgPSBkZXRlcm1pbmVLZXlUeXBlO1xud2luZG93LmVuY3J5cHRDbGVhcnRleHRNdWx0aSA9IGVuY3J5cHRDbGVhcnRleHRNdWx0aTtcbndpbmRvdy5lbmNyeXB0Q2xlYXJUZXh0ID0gZW5jcnlwdENsZWFyVGV4dDtcbndpbmRvdy5kZWNyeXB0UEdQTWVzc2FnZSA9IGRlY3J5cHRQR1BNZXNzYWdlO1xud2luZG93LnNhdmVQR1BQdWJrZXkgPSBzYXZlUEdQUHVia2V5O1xud2luZG93LnNhdmVQR1BQcml2a2V5ID0gc2F2ZVBHUFByaXZrZXk7XG53aW5kb3cuZ2V0RnJvbVN0b3JhZ2UgPSBnZXRGcm9tU3RvcmFnZTtcbndpbmRvdy5kZWNyeXB0UEdQTWVzc2FnZVdpdGhLZXkgPSBkZWNyeXB0UEdQTWVzc2FnZVdpdGhLZXk7XG5cbi8vIHJlYmVsIHJvdXRlclxuaW1wb3J0IHtSZWJlbFJvdXRlcn0gZnJvbSAnLi4vbm9kZV9tb2R1bGVzL3JlYmVsLXJvdXRlci9zcmMvcmViZWwtcm91dGVyLmpzJztcblxuLy8gR3VuZGIgcHVibGljIGZhY2luZyBEQUcgZGF0YWJhc2UgIChmb3IgbWVzc2FnZXMgdG8gYW5kIGZyb20gdGhlIGVuZW15KVxuaW1wb3J0IHtHdW59IGZyb20gJ2d1bi9ndW4uanMnO1xuXG4vLyBwYWdlcyAobW9zdCBvZiB0aGlzIHNob3VsZCBiZSBpbiB2aWV3cy9wYXJ0aWFscyB0byBhZmZlY3QgaXNvcm1vcnBoaXNtKVxuaW1wb3J0IHtJbmRleFBhZ2V9ICAgZnJvbSAnLi9wYWdlcy9pbmRleC5qcyc7XG5pbXBvcnQge1JvYWRtYXBQYWdlfSBmcm9tICcuL3BhZ2VzL3JvYWRtYXAuanMnO1xuaW1wb3J0IHtDb250YWN0UGFnZX0gZnJvbSAnLi9wYWdlcy9jb250YWN0LmpzJztcbmltcG9ydCB7TWVzc2FnZVBhZ2V9IGZyb20gJy4vcGFnZXMvbWVzc2FnZS5qcyc7XG5pbXBvcnQge0RlY2tQYWdlfSAgICBmcm9tICcuL3BhZ2VzL2RlY2suanMnO1xuaW1wb3J0IHtDb25uZWN0UGFnZX0gZnJvbSAnLi9wYWdlcy9jb25uZWN0LmpzJztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyIsIm1vZHVsZS5leHBvcnRzID0gXCI8c3BhbiBjbGFzcz1cXFwiY29ubmVjdFxcXCI+XFxuPHA+VGhpcyBpcyB0aGUgY29ubmVjdCBwYWdlLjwvcD5cXG48dWw+XFxuPGxpPnBlbmRpbmcgaW52aXRhdGlvbnM8Lz5cXG48bGk+bGlzdCBvZiBwbGF5ZXJzPC9saT5cXG48bGk+Y29ubmVjdGVkIHBsYXllcnM8L2xpPlxcblxcbjxoMT5IZWxsbyB3b3JsZCBndW4gYXBwPC9oMT5cXG48cD5PcGVuIHlvdXIgd2ViIGNvbnNvbGU8L3A+XFxuPC9zcGFuPlxcblwiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3Jhdy1sb2FkZXIhLi92aWV3cy9wYXJ0aWFscy9jb25uZWN0Lmh0bWxcbi8vIG1vZHVsZSBpZCA9IDIyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8c3BhbiBjbGFzcz1cXFwiY29udGFjdFxcXCI+XFxuICAgIENvbGUgQWxib248YnI+XFxuICAgIDxhIGhyZWY9XFxcInRlbDorMTQxNTY3MjE2NDhcXFwiPig0MTUpIDY3Mi0xNjQ4PC9hPjxicj5cXG4gICAgPGEgaHJlZj1cXFwibWFpbHRvOmNvbGUuYWxib25AZ21haWwuY29tXFxcIj5jb2xlLmFsYm9uQGdtYWlsLmNvbTwvYT48YnI+XFxuICAgIDxhIGhyZWY9XFxcImh0dHBzOi8vZ2l0aHViLmNvbS9jb2xlYWxib25cXFwiPmh0dHBzOi8vZ2l0aHViLmNvbS9jb2xlYWxib248L2E+PGJyPlxcbiAgICA8YSBocmVmPVxcXCJodHRwczovL3d3dy5saW5rZWRpbi5jb20vaW4vY29sZS1hbGJvbi01OTM0NjM0XFxcIj5cXG4gICAgICAgIDxzcGFuIGlkPVxcXCJsaW5rZWRpbmFkZHJlc3NcXFwiIGNsYXNzPVxcXCJsaW5rZWRpbmFkZHJlc3NcXFwiPmh0dHBzOi8vd3d3LmxpbmtlZGluLmNvbS9pbi9jb2xlLWFsYm9uLTU5MzQ2MzQ8L3NwYW4+XFxuICAgIDwvYT48YnI+XFxuPC9zcGFuPlxcblwiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3Jhdy1sb2FkZXIhLi92aWV3cy9wYXJ0aWFscy9jb250YWN0Lmh0bWxcbi8vIG1vZHVsZSBpZCA9IDIzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCIgICAgPGRpdiBpZD1cXFwiZGVja1xcXCIgY2xhc3M9XFxcImRlY2tcXFwiPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKWiFxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk03MC4zMTI1IDM2Mi4yNSBMNzAuMzEyNSAxMTAuMTA5NCBMMjI0LjI5NjkgMTEwLjEwOTQgTDIyNC4yOTY5IDM2Mi4yNSBMNzAuMzEyNSAzNjIuMjUgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgQVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTEwLjY3MTkgMTE1LjczNDQgTDkxLjgyODEgMTc1Ljc4MTIgTDEyOS41MTU2IDE3NS43ODEyIEwxMTAuNjcxOSAxMTUuNzM0NCBaTTk5Ljk4NDQgMTAxLjY3MTkgTDEyMS42NDA2IDEwMS42NzE5IEwxNjIuMTQwNiAyMTkuMjM0NCBMMTQzLjU3ODEgMjE5LjIzNDQgTDEzNC4wMTU2IDE4OC41NzgxIEw4Ny42MDk0IDE4OC41NzgxIEw3OC4wNDY5IDIxOS4yMzQ0IEw1OS40ODQ0IDIxOS4yMzQ0IEw5OS45ODQ0IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoDJcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTg2LjM0MzggMjAzLjA2MjUgTDE0NS45Njg4IDIwMy4wNjI1IEwxNDUuOTY4OCAyMTkuMDkzOCBMNjEuODc1IDIxOS4wOTM4IEw2MS44NzUgMjAzLjYyNSBRNjYuNjU2MiAxOTkuMjY1NiA3NS41MTU2IDE5MS4zOTA2IFExMjMuODkwNiAxNDguNSAxMjMuODkwNiAxMzUuMjgxMiBRMTIzLjg5MDYgMTI2IDExNi41NzgxIDEyMC4zMDQ3IFExMDkuMjY1NiAxMTQuNjA5NCA5Ny4zMTI1IDExNC42MDk0IFE5MCAxMTQuNjA5NCA4MS40MjE5IDExNy4wNzAzIFE3Mi44NDM4IDExOS41MzEyIDYyLjcxODggMTI0LjQ1MzEgTDYyLjcxODggMTA3LjE1NjIgUTczLjU0NjkgMTAzLjIxODggODIuODk4NCAxMDEuMjUgUTkyLjI1IDk5LjI4MTIgMTAwLjI2NTYgOTkuMjgxMiBRMTIwLjY1NjIgOTkuMjgxMiAxMzIuODkwNiAxMDguNTYyNSBRMTQ1LjEyNSAxMTcuODQzOCAxNDUuMTI1IDEzMy4wMzEyIFExNDUuMTI1IDE1Mi41NzgxIDk4LjU3ODEgMTkyLjUxNTYgUTkwLjcwMzEgMTk5LjI2NTYgODYuMzQzOCAyMDMuMDYyNSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaAzXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMjEuNzgxMiAxNTUuNTMxMiBRMTM0LjcxODggMTU4LjA2MjUgMTQxLjgyMDMgMTY1LjcyNjYgUTE0OC45MjE5IDE3My4zOTA2IDE0OC45MjE5IDE4NC45MjE5IFExNDguOTIxOSAyMDIuMzU5NCAxMzUuNTYyNSAyMTEuNzgxMiBRMTIyLjIwMzEgMjIxLjIwMzEgOTcuMzEyNSAyMjEuMjAzMSBRODkuMjk2OSAyMjEuMjAzMSA4MC41MDc4IDIxOS43MjY2IFE3MS43MTg4IDIxOC4yNSA2MS44NzUgMjE1LjQzNzUgTDYxLjg3NSAxOTguNDIxOSBRNjkuMTg3NSAyMDIuMjE4OCA3Ny41NTQ3IDIwNC4wNDY5IFE4NS45MjE5IDIwNS44NzUgOTUuMzQzOCAyMDUuODc1IFExMTAuNjcxOSAyMDUuODc1IDExOS4xMDk0IDIwMC4zMjAzIFExMjcuNTQ2OSAxOTQuNzY1NiAxMjcuNTQ2OSAxODQuOTIxOSBRMTI3LjU0NjkgMTc0LjUxNTYgMTE5Ljc0MjIgMTY5LjE3MTkgUTExMS45Mzc1IDE2My44MjgxIDk2Ljc1IDE2My44MjgxIEw4NC42NTYyIDE2My44MjgxIEw4NC42NTYyIDE0OC42NDA2IEw5Ny44NzUgMTQ4LjY0MDYgUTExMS4wOTM4IDE0OC42NDA2IDExNy45MTQxIDE0NC4yMTA5IFExMjQuNzM0NCAxMzkuNzgxMiAxMjQuNzM0NCAxMzEuMzQzOCBRMTI0LjczNDQgMTIzLjE4NzUgMTE3LjcwMzEgMTE4Ljg5ODQgUTExMC42NzE5IDExNC42MDk0IDk3LjMxMjUgMTE0LjYwOTQgUTkxLjY4NzUgMTE0LjYwOTQgODQuNTE1NiAxMTUuODc1IFE3Ny4zNDM4IDExNy4xNDA2IDY1Ljk1MzEgMTIwLjM3NSBMNjUuOTUzMSAxMDQuMjAzMSBRNzYuMjE4OCAxMDEuODEyNSA4NS4yMTg4IDEwMC41NDY5IFE5NC4yMTg4IDk5LjI4MTIgMTAxLjk1MzEgOTkuMjgxMiBRMTIyLjIwMzEgOTkuMjgxMiAxMzQuMDg1OSAxMDcuNTc4MSBRMTQ1Ljk2ODggMTE1Ljg3NSAxNDUuOTY4OCAxMjkuNzk2OSBRMTQ1Ljk2ODggMTM5LjUgMTM5LjY0MDYgMTQ2LjI1IFExMzMuMzEyNSAxNTMgMTIxLjc4MTIgMTU1LjUzMTIgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgNFxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTIwLjA5MzggMTE4LjY4NzUgTDc2LjY0MDYgMTc3LjYwOTQgTDEyMC4wOTM4IDE3Ny42MDk0IEwxMjAuMDkzOCAxMTguNjg3NSBaTTExNyAxMDEuNjcxOSBMMTQwLjM0MzggMTAxLjY3MTkgTDE0MC4zNDM4IDE3Ny42MDk0IEwxNTkuMzI4MSAxNzcuNjA5NCBMMTU5LjMyODEgMTkyLjkzNzUgTDE0MC4zNDM4IDE5Mi45Mzc1IEwxNDAuMzQzOCAyMTkuMDkzOCBMMTIwLjA5MzggMjE5LjA5MzggTDEyMC4wOTM4IDE5Mi45Mzc1IEw2MS44NzUgMTkyLjkzNzUgTDYxLjg3NSAxNzUuOTIxOSBMMTE3IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoDVcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTY3LjUgMTAxLjY3MTkgTDEzOS4yMTg4IDEwMS42NzE5IEwxMzkuMjE4OCAxMTUuMDMxMiBMODQuMjM0NCAxMTUuMDMxMiBMODQuMjM0NCAxNDMuNzE4OCBRODguMTcxOSAxNDIuNDUzMSA5Mi4yNSAxNDEuODkwNiBROTYuMTg3NSAxNDEuMzI4MSAxMDAuMTI1IDE0MS4zMjgxIFExMjIuNzY1NiAxNDEuMzI4MSAxMzUuOTg0NCAxNTIuMTU2MiBRMTQ5LjIwMzEgMTYyLjg0MzggMTQ5LjIwMzEgMTgxLjI2NTYgUTE0OS4yMDMxIDIwMC4yNSAxMzUuNTYyNSAyMTAuNzk2OSBRMTIyLjA2MjUgMjIxLjIwMzEgOTcuMzEyNSAyMjEuMjAzMSBRODguODc1IDIyMS4yMDMxIDgwLjAxNTYgMjE5LjkzNzUgUTcxLjE1NjIgMjE4LjY3MTkgNjEuODc1IDIxNi4xNDA2IEw2MS44NzUgMjAwLjI1IFE2OS44OTA2IDIwNC4wNDY5IDc4LjYwOTQgMjA2LjAxNTYgUTg3LjMyODEgMjA3Ljg0MzggOTcuMDMxMiAyMDcuODQzOCBRMTEyLjY0MDYgMjA3Ljg0MzggMTIxLjc4MTIgMjAwLjY3MTkgUTEzMC45MjE5IDE5My41IDEzMC45MjE5IDE4MS4yNjU2IFExMzAuOTIxOSAxNjkuMDMxMiAxMjEuNzgxMiAxNjEuODU5NCBRMTEyLjY0MDYgMTU0LjY4NzUgOTcuMDMxMiAxNTQuNjg3NSBRODkuNzE4OCAxNTQuNjg3NSA4Mi40MDYyIDE1Ni4wOTM4IFE3NS4wOTM4IDE1Ny41IDY3LjUgMTYwLjQ1MzEgTDY3LjUgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgNlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTEwLjEwOTQgMTUzLjcwMzEgUTk3LjczNDQgMTUzLjcwMzEgOTAuNTYyNSAxNjEuMDE1NiBRODMuMzkwNiAxNjguNDY4OCA4My4zOTA2IDE4MS4yNjU2IFE4My4zOTA2IDE5My45MjE5IDkwLjU2MjUgMjAxLjIzNDQgUTk3LjczNDQgMjA4LjY4NzUgMTEwLjEwOTQgMjA4LjY4NzUgUTEyMi4zNDM4IDIwOC42ODc1IDEyOS41MTU2IDIwMS4yMzQ0IFExMzYuNjg3NSAxOTMuOTIxOSAxMzYuNjg3NSAxODEuMjY1NiBRMTM2LjY4NzUgMTY4LjQ2ODggMTI5LjUxNTYgMTYxLjAxNTYgUTEyMi4zNDM4IDE1My43MDMxIDExMC4xMDk0IDE1My43MDMxIFpNMTQ2LjM5MDYgMTAzLjkyMTkgTDE0Ni4zOTA2IDExOC40MDYyIFExMzkuNSAxMTUuNTkzOCAxMzIuNDY4OCAxMTQuMTg3NSBRMTI1LjQzNzUgMTEyLjY0MDYgMTE4LjU0NjkgMTEyLjY0MDYgUTEwMC41NDY5IDExMi42NDA2IDkwLjk4NDQgMTIzLjE4NzUgUTgxLjQyMTkgMTMzLjg3NSA4MC4wMTU2IDE1NS4zOTA2IFE4NS4zNTk0IDE0OC41IDkzLjM3NSAxNDQuODQzOCBRMTAxLjUzMTIgMTQxLjE4NzUgMTExLjA5MzggMTQxLjE4NzUgUTEzMS40ODQ0IDE0MS4xODc1IDE0My4yOTY5IDE1MS44NzUgUTE1NS4xMDk0IDE2Mi43MDMxIDE1NS4xMDk0IDE4MS4yNjU2IFExNTUuMTA5NCAxOTkuMTI1IDE0Mi43MzQ0IDIxMC4yMzQ0IFExMzAuNSAyMjEuMjAzMSAxMTAuMTA5NCAyMjEuMjAzMSBRODYuNjI1IDIyMS4yMDMxIDc0LjI1IDIwNS41OTM4IFE2MS44NzUgMTg5Ljk4NDQgNjEuODc1IDE2MC4xNzE5IFE2MS44NzUgMTMyLjMyODEgNzcuMDYyNSAxMTUuODc1IFE5Mi4yNSA5OS4yODEyIDExNy44NDM4IDk5LjI4MTIgUTEyNC43MzQ0IDk5LjI4MTIgMTMxLjc2NTYgMTAwLjQwNjIgUTEzOC43OTY5IDEwMS42NzE5IDE0Ni4zOTA2IDEwMy45MjE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoDdcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTYxLjg3NSAxMDEuNjcxOSBMMTQ4LjY0MDYgMTAxLjY3MTkgTDE0OC42NDA2IDEwOC40MjE5IEw5OS43MDMxIDIxOS4wOTM4IEw4MC41NzgxIDIxOS4wOTM4IEwxMjYuNzAzMSAxMTUuMDMxMiBMNjEuODc1IDExNS4wMzEyIEw2MS44NzUgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgOFxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTA4LjI4MTIgMTYzLjEyNSBROTUuMjAzMSAxNjMuMTI1IDg3Ljc1IDE2OS4zMTI1IFE4MC4yOTY5IDE3NS4zNTk0IDgwLjI5NjkgMTg1LjkwNjIgUTgwLjI5NjkgMTk2LjU5MzggODcuNzUgMjAyLjY0MDYgUTk1LjIwMzEgMjA4LjY4NzUgMTA4LjI4MTIgMjA4LjY4NzUgUTEyMS4yMTg4IDIwOC42ODc1IDEyOC44MTI1IDIwMi41IFExMzYuMjY1NiAxOTYuNDUzMSAxMzYuMjY1NiAxODUuOTA2MiBRMTM2LjI2NTYgMTc1LjM1OTQgMTI4LjgxMjUgMTY5LjMxMjUgUTEyMS4zNTk0IDE2My4xMjUgMTA4LjI4MTIgMTYzLjEyNSBaTTkwIDE1Ni4yMzQ0IFE3OC4xODc1IDE1My43MDMxIDcxLjcxODggMTQ2LjgxMjUgUTY1LjEwOTQgMTM5Ljc4MTIgNjUuMTA5NCAxMjkuNjU2MiBRNjUuMTA5NCAxMTUuNTkzOCA3Ni42NDA2IDEwNy40Mzc1IFE4OC4xNzE5IDk5LjI4MTIgMTA4LjI4MTIgOTkuMjgxMiBRMTI4LjM5MDYgOTkuMjgxMiAxMzkuOTIxOSAxMDcuNDM3NSBRMTUxLjMxMjUgMTE1LjU5MzggMTUxLjMxMjUgMTI5LjY1NjIgUTE1MS4zMTI1IDE0MC4wNjI1IDE0NC44NDM4IDE0Ni44MTI1IFExMzguMjM0NCAxNTMuNzAzMSAxMjYuNTYyNSAxNTYuMjM0NCBRMTM5LjIxODggMTU4Ljc2NTYgMTQ3LjA5MzggMTY2LjkyMTkgUTE1NC41NDY5IDE3NC42NTYyIDE1NC41NDY5IDE4NS45MDYyIFExNTQuNTQ2OSAyMDIuOTIxOSAxNDIuNTkzOCAyMTIuMDYyNSBRMTMwLjUgMjIxLjIwMzEgMTA4LjI4MTIgMjIxLjIwMzEgUTg1LjkyMTkgMjIxLjIwMzEgNzMuOTY4OCAyMTIuMDYyNSBRNjEuODc1IDIwMi45MjE5IDYxLjg3NSAxODUuOTA2MiBRNjEuODc1IDE3NC45Mzc1IDY5LjMyODEgMTY2LjkyMTkgUTc2LjkyMTkgMTU5LjA0NjkgOTAgMTU2LjIzNDQgWk04My4yNSAxMzEuMjAzMSBRODMuMjUgMTQwLjA2MjUgODkuODU5NCAxNDUuNDA2MiBROTYuMzI4MSAxNTAuNjA5NCAxMDguMjgxMiAxNTAuNjA5NCBRMTE5LjY3MTkgMTUwLjYwOTQgMTI2LjU2MjUgMTQ1LjQwNjIgUTEzMy4zMTI1IDE0MC4zNDM4IDEzMy4zMTI1IDEzMS4yMDMxIFExMzMuMzEyNSAxMjIuMzQzOCAxMjYuNTYyNSAxMTcgUTExOS45NTMxIDExMS43OTY5IDEwOC4yODEyIDExMS43OTY5IFE5Ni42MDk0IDExMS43OTY5IDg5Ljg1OTQgMTE3IFE4My4yNSAxMjIuMDYyNSA4My4yNSAxMzEuMjAzMSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaA5XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk03MC41OTM4IDIxNi41NjI1IEw3MC41OTM4IDIwMi4wNzgxIFE3Ny40ODQ0IDIwNC44OTA2IDg0LjUxNTYgMjA2LjQzNzUgUTkxLjU0NjkgMjA3Ljg0MzggOTguMjk2OSAyMDcuODQzOCBRMTE2LjQzNzUgMjA3Ljg0MzggMTI2IDE5Ny4yOTY5IFExMzUuNDIxOSAxODYuNzUgMTM2LjgyODEgMTY1LjA5MzggUTEzMS45MDYyIDE3MS43MDMxIDEyMy40Njg4IDE3NS41IFExMTUuNDUzMSAxNzkuMTU2MiAxMDUuNzUgMTc5LjE1NjIgUTg1LjUgMTc5LjE1NjIgNzMuNjg3NSAxNjguNDY4OCBRNjEuODc1IDE1Ny43ODEyIDYxLjg3NSAxMzkuMjE4OCBRNjEuODc1IDEyMS4wNzgxIDc0LjEwOTQgMTEwLjI1IFE4Ni40ODQ0IDk5LjI4MTIgMTA2Ljg3NSA5OS4yODEyIFExMzAuMzU5NCA5OS4yODEyIDE0Mi41OTM4IDExNC44OTA2IFExNTQuOTY4OCAxMzAuNSAxNTQuOTY4OCAxNjAuMzEyNSBRMTU0Ljk2ODggMTg4LjE1NjIgMTM5LjkyMTkgMjA0LjYwOTQgUTEyNC43MzQ0IDIyMS4yMDMxIDk5LjE0MDYgMjIxLjIwMzEgUTkyLjI1IDIyMS4yMDMxIDg1LjIxODggMjIwLjA3ODEgUTc4LjE4NzUgMjE4LjgxMjUgNzAuNTkzOCAyMTYuNTYyNSBaTTEwNi44NzUgMTY2Ljc4MTIgUTExOS4yNSAxNjYuNzgxMiAxMjYuNDIxOSAxNTkuNDY4OCBRMTMzLjU5MzggMTUyLjE1NjIgMTMzLjU5MzggMTM5LjIxODggUTEzMy41OTM4IDEyNi41NjI1IDEyNi40MjE5IDExOS4yNSBRMTE5LjI1IDExMS43OTY5IDEwNi44NzUgMTExLjc5NjkgUTk0LjkyMTkgMTExLjc5NjkgODcuNDY4OCAxMTkuMjUgUTgwLjE1NjIgMTI2LjU2MjUgODAuMTU2MiAxMzkuMjE4OCBRODAuMTU2MiAxNTIuMTU2MiA4Ny40Njg4IDE1OS40Njg4IFE5NC42NDA2IDE2Ni43ODEyIDEwNi44NzUgMTY2Ljc4MTIgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgMTBcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTE1OS4wNDY5IDExMS43OTY5IFExNDkuMDYyNSAxMTEuNzk2OSAxNDIuMDMxMiAxMjMuODkwNiBRMTM0Ljg1OTQgMTM1Ljk4NDQgMTM0Ljg1OTQgMTYwLjE3MTkgUTEzNC44NTk0IDE4NC41IDE0Mi4wMzEyIDE5Ni41OTM4IFExNDkuMDYyNSAyMDguNjg3NSAxNTkuMDQ2OSAyMDguNjg3NSBRMTY5LjAzMTIgMjA4LjY4NzUgMTc2LjA2MjUgMTk2LjU5MzggUTE4My4yMzQ0IDE4NC41IDE4My4yMzQ0IDE2MC4xNzE5IFExODMuMjM0NCAxMzUuOTg0NCAxNzYuMDYyNSAxMjMuODkwNiBRMTY5LjAzMTIgMTExLjc5NjkgMTU5LjA0NjkgMTExLjc5NjkgWk0xNTkuMDQ2OSA5OS4yODEyIFExNzcuNDY4OCA5OS4yODEyIDE4OS40MjE5IDExNC44OTA2IFEyMDEuMzc1IDEzMC41IDIwMS4zNzUgMTYwLjE3MTkgUTIwMS4zNzUgMTg5Ljk4NDQgMTg5LjQyMTkgMjA1LjU5MzggUTE3Ny40Njg4IDIyMS4yMDMxIDE1OS4wNDY5IDIyMS4yMDMxIFExMzYuMjY1NiAyMjEuMjAzMSAxMjYuNDIxOSAyMDUuNTkzOCBRMTE2LjU3ODEgMTg5Ljk4NDQgMTE2LjU3ODEgMTYwLjE3MTkgUTExNi41NzgxIDEzMC41IDEyNi40MjE5IDExNC44OTA2IFExMzYuMjY1NiA5OS4yODEyIDE1OS4wNDY5IDk5LjI4MTIgWk04MC41NzgxIDIxOS4wOTM4IEw4MC41NzgxIDExNy43MDMxIEw2MS44NzUgMTIzLjQ2ODggTDYxLjg3NSAxMDcuMTU2MiBMODEuNTYyNSAxMDEuNjcxOSBMMTAwLjgyODEgMTAxLjY3MTkgTDEwMC44MjgxIDIxOS4wOTM4IEw4MC41NzgxIDIxOS4wOTM4IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoEpcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3NC4yMzQ0IDIyMy44NzUgUTE4My4zNzUgMjQwLjg5MDYgMjA1LjUyMzQgMjY4LjAzMTIgUTIyNy42NzE5IDI5NS4xNzE5IDIyOC45Mzc1IDMwMC41MTU2IFEyMzIuNzM0NCAzMDUuNzE4OCAyMzIuNzM0NCAzMTYuNjg3NSBRMjMyLjczNDQgMzQ4Ljc1IDIwNS4zMTI1IDM0OC43NSBRMTkwLjEyNSAzNDguNzUgMTgwLjg0MzggMzI2Ljk1MzEgTDE3Ni42MjUgMzI2Ljk1MzEgUTE3Ni42MjUgMzU1LjY0MDYgMTg0LjkyMTkgMzcwLjY4NzUgTDE2My41NDY5IDM3MC42ODc1IFExNzEuODQzOCAzNTUuNjQwNiAxNzEuODQzOCAzMjYuOTUzMSBMMTY3LjYyNSAzMjYuOTUzMSBRMTU4LjM0MzggMzQ4Ljc1IDE0My4xNTYyIDM0OC43NSBRMTE1LjczNDQgMzQ4Ljc1IDExNS43MzQ0IDMxNi42ODc1IFExMTUuNzM0NCAzMDUuNzE4OCAxMTkuNTMxMiAzMDAuNTE1NiBRMTIwLjc5NjkgMjk1LjE3MTkgMTQyLjk0NTMgMjY4LjAzMTIgUTE2NS4wOTM4IDI0MC44OTA2IDE3NC4yMzQ0IDIyMy44NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTg5LjE1NjIgMTAxLjY3MTkgTDEwNy4wMTU2IDEwMS42NzE5IEwxMDcuMDE1NiAxNzguNzM0NCBRMTA3LjAxNTYgMTk5LjY4NzUgOTcuODc1IDIwOS41MzEyIFE4OC44NzUgMjE5LjIzNDQgNjguNzY1NiAyMTkuMjM0NCBMNjEuODc1IDIxOS4yMzQ0IEw2MS44NzUgMjA1LjczNDQgTDY3LjUgMjA1LjczNDQgUTc5LjMxMjUgMjA1LjczNDQgODQuMjM0NCAxOTkuODI4MSBRODkuMTU2MiAxOTMuOTIxOSA4OS4xNTYyIDE3OC43MzQ0IEw4OS4xNTYyIDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZoFFcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTEwNy4yOTY5IDIyMS4wNjI1IFExMDYuNzM0NCAyMjEuMDYyNSAxMDUuNTM5MSAyMjEuMTMyOCBRMTA0LjM0MzggMjIxLjIwMzEgMTAzLjY0MDYgMjIxLjIwMzEgUTgxLjQyMTkgMjIxLjIwMzEgNzAuNTIzNCAyMDYuMDg1OSBRNTkuNjI1IDE5MC45Njg4IDU5LjYyNSAxNjAuMzEyNSBRNTkuNjI1IDEyOS41MTU2IDcwLjU5MzggMTE0LjM5ODQgUTgxLjU2MjUgOTkuMjgxMiAxMDMuNzgxMiA5OS4yODEyIFExMjYuMTQwNiA5OS4yODEyIDEzNy4xMDk0IDExNC4zOTg0IFExNDguMDc4MSAxMjkuNTE1NiAxNDguMDc4MSAxNjAuMzEyNSBRMTQ4LjA3ODEgMTgzLjUxNTYgMTQyLjAzMTIgMTk3LjY0ODQgUTEzNS45ODQ0IDIxMS43ODEyIDEyMy42MDk0IDIxNy40MDYyIEwxNDEuMzI4MSAyMzIuMzEyNSBMMTI3Ljk2ODggMjQwLjE4NzUgTDEwNy4yOTY5IDIyMS4wNjI1IFpNMTI5LjM3NSAxNjAuMzEyNSBRMTI5LjM3NSAxMzQuNDM3NSAxMjMuMzk4NCAxMjMuMzI4MSBRMTE3LjQyMTkgMTEyLjIxODggMTAzLjc4MTIgMTEyLjIxODggUTkwLjI4MTIgMTEyLjIxODggODQuMzA0NyAxMjMuMzI4MSBRNzguMzI4MSAxMzQuNDM3NSA3OC4zMjgxIDE2MC4zMTI1IFE3OC4zMjgxIDE4Ni4xODc1IDg0LjMwNDcgMTk3LjI5NjkgUTkwLjI4MTIgMjA4LjQwNjIgMTAzLjc4MTIgMjA4LjQwNjIgUTExNy40MjE5IDIwOC40MDYyIDEyMy4zOTg0IDE5Ny4yOTY5IFExMjkuMzc1IDE4Ni4xODc1IDEyOS4zNzUgMTYwLjMxMjUgWk0xNzQuMjM0NCAyMjMuODc1IFExODMuMzc1IDI0MC44OTA2IDIwNS41MjM0IDI2OC4wMzEyIFEyMjcuNjcxOSAyOTUuMTcxOSAyMjguOTM3NSAzMDAuNTE1NiBRMjMyLjczNDQgMzA1LjcxODggMjMyLjczNDQgMzE2LjY4NzUgUTIzMi43MzQ0IDM0OC43NSAyMDUuMzEyNSAzNDguNzUgUTE5MC4xMjUgMzQ4Ljc1IDE4MC44NDM4IDMyNi45NTMxIEwxNzYuNjI1IDMyNi45NTMxIFExNzYuNjI1IDM1NS42NDA2IDE4NC45MjE5IDM3MC42ODc1IEwxNjMuNTQ2OSAzNzAuNjg3NSBRMTcxLjg0MzggMzU1LjY0MDYgMTcxLjg0MzggMzI2Ljk1MzEgTDE2Ny42MjUgMzI2Ljk1MzEgUTE1OC4zNDM4IDM0OC43NSAxNDMuMTU2MiAzNDguNzUgUTExNS43MzQ0IDM0OC43NSAxMTUuNzM0NCAzMTYuNjg3NSBRMTE1LjczNDQgMzA1LjcxODggMTE5LjUzMTIgMzAwLjUxNTYgUTEyMC43OTY5IDI5NS4xNzE5IDE0Mi45NDUzIDI2OC4wMzEyIFExNjUuMDkzOCAyNDAuODkwNiAxNzQuMjM0NCAyMjMuODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmgS1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjEuODc1IDEwMS42NzE5IEw3OS43MzQ0IDEwMS42NzE5IEw3OS43MzQ0IDE1MS4zMTI1IEwxMzAuNjQwNiAxMDEuNjcxOSBMMTUzLjcwMzEgMTAxLjY3MTkgTDk2LjQ2ODggMTU2LjUxNTYgTDE1OC4zNDM4IDIxOS4yMzQ0IEwxMzQuODU5NCAyMTkuMjM0NCBMNzkuNzM0NCAxNjIuNTYyNSBMNzkuNzM0NCAyMTkuMjM0NCBMNjEuODc1IDIxOS4yMzQ0IEw2MS44NzUgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlQVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTc0LjIzNDQgMjIzLjg3NSBRMTgzLjM3NSAyNDAuODkwNiAyMDUuNTIzNCAyNjguMDMxMiBRMjI3LjY3MTkgMjk1LjE3MTkgMjI4LjkzNzUgMzAwLjUxNTYgUTIzMi43MzQ0IDMwNS43MTg4IDIzMi43MzQ0IDMxNi42ODc1IFEyMzIuNzM0NCAzNDguNzUgMjA1LjMxMjUgMzQ4Ljc1IFExOTAuMTI1IDM0OC43NSAxODAuODQzOCAzMjYuOTUzMSBMMTc2LjYyNSAzMjYuOTUzMSBRMTc2LjYyNSAzNTUuNjQwNiAxODQuOTIxOSAzNzAuNjg3NSBMMTYzLjU0NjkgMzcwLjY4NzUgUTE3MS44NDM4IDM1NS42NDA2IDE3MS44NDM4IDMyNi45NTMxIEwxNjcuNjI1IDMyNi45NTMxIFExNTguMzQzOCAzNDguNzUgMTQzLjE1NjIgMzQ4Ljc1IFExMTUuNzM0NCAzNDguNzUgMTE1LjczNDQgMzE2LjY4NzUgUTExNS43MzQ0IDMwNS43MTg4IDExOS41MzEyIDMwMC41MTU2IFExMjAuNzk2OSAyOTUuMTcxOSAxNDIuOTQ1MyAyNjguMDMxMiBRMTY1LjA5MzggMjQwLjg5MDYgMTc0LjIzNDQgMjIzLjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTEwLjY3MTkgMTE1LjczNDQgTDkxLjgyODEgMTc1Ljc4MTIgTDEyOS41MTU2IDE3NS43ODEyIEwxMTAuNjcxOSAxMTUuNzM0NCBaTTk5Ljk4NDQgMTAxLjY3MTkgTDEyMS42NDA2IDEwMS42NzE5IEwxNjIuMTQwNiAyMTkuMjM0NCBMMTQzLjU3ODEgMjE5LjIzNDQgTDEzNC4wMTU2IDE4OC41NzgxIEw4Ny42MDk0IDE4OC41NzgxIEw3OC4wNDY5IDIxOS4yMzQ0IEw1OS40ODQ0IDIxOS4yMzQ0IEw5OS45ODQ0IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpTJcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi42ODc1IDI3My42NTYyIFExNzUuNzgxMiAyNTcuMDYyNSAxODMuNTE1NiAyNDguMzQzOCBRMTkyLjIzNDQgMjM4LjM1OTQgMjA0LjA0NjkgMjM4LjM1OTQgUTIyMy41OTM4IDIzOC4zNTk0IDIzMi4zMTI1IDI1OS4zMTI1IFEyMzQuOTg0NCAyNjUuNjQwNiAyMzQuOTg0NCAyNzMuOTM3NSBRMjM0Ljk4NDQgMjk2LjE1NjIgMjE3LjQwNjIgMzE4LjUxNTYgTDE3Mi45Njg4IDM3NS4wNDY5IEwxMjcuOTY4OCAzMTguNTE1NiBRMTEwLjM5MDYgMjk2LjQzNzUgMTEwLjM5MDYgMjczLjkzNzUgUTExMC4zOTA2IDI2NS42NDA2IDExMy4wNjI1IDI1OS4zMTI1IFExMjEuOTIxOSAyMzguMzU5NCAxNDEuMzI4MSAyMzguMzU5NCBRMTUzLjQyMTkgMjM4LjM1OTQgMTYxLjg1OTQgMjQ4LjM0MzggUTE2OS41OTM4IDI1Ny40ODQ0IDE3Mi42ODc1IDI3My42NTYyIFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk04Ni4zNDM4IDIwMy4wNjI1IEwxNDUuOTY4OCAyMDMuMDYyNSBMMTQ1Ljk2ODggMjE5LjA5MzggTDYxLjg3NSAyMTkuMDkzOCBMNjEuODc1IDIwMy42MjUgUTY2LjY1NjIgMTk5LjI2NTYgNzUuNTE1NiAxOTEuMzkwNiBRMTIzLjg5MDYgMTQ4LjUgMTIzLjg5MDYgMTM1LjI4MTIgUTEyMy44OTA2IDEyNiAxMTYuNTc4MSAxMjAuMzA0NyBRMTA5LjI2NTYgMTE0LjYwOTQgOTcuMzEyNSAxMTQuNjA5NCBROTAgMTE0LjYwOTQgODEuNDIxOSAxMTcuMDcwMyBRNzIuODQzOCAxMTkuNTMxMiA2Mi43MTg4IDEyNC40NTMxIEw2Mi43MTg4IDEwNy4xNTYyIFE3My41NDY5IDEwMy4yMTg4IDgyLjg5ODQgMTAxLjI1IFE5Mi4yNSA5OS4yODEyIDEwMC4yNjU2IDk5LjI4MTIgUTEyMC42NTYyIDk5LjI4MTIgMTMyLjg5MDYgMTA4LjU2MjUgUTE0NS4xMjUgMTE3Ljg0MzggMTQ1LjEyNSAxMzMuMDMxMiBRMTQ1LjEyNSAxNTIuNTc4MSA5OC41NzgxIDE5Mi41MTU2IFE5MC43MDMxIDE5OS4yNjU2IDg2LjM0MzggMjAzLjA2MjUgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlM1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEyMS43ODEyIDE1NS41MzEyIFExMzQuNzE4OCAxNTguMDYyNSAxNDEuODIwMyAxNjUuNzI2NiBRMTQ4LjkyMTkgMTczLjM5MDYgMTQ4LjkyMTkgMTg0LjkyMTkgUTE0OC45MjE5IDIwMi4zNTk0IDEzNS41NjI1IDIxMS43ODEyIFExMjIuMjAzMSAyMjEuMjAzMSA5Ny4zMTI1IDIyMS4yMDMxIFE4OS4yOTY5IDIyMS4yMDMxIDgwLjUwNzggMjE5LjcyNjYgUTcxLjcxODggMjE4LjI1IDYxLjg3NSAyMTUuNDM3NSBMNjEuODc1IDE5OC40MjE5IFE2OS4xODc1IDIwMi4yMTg4IDc3LjU1NDcgMjA0LjA0NjkgUTg1LjkyMTkgMjA1Ljg3NSA5NS4zNDM4IDIwNS44NzUgUTExMC42NzE5IDIwNS44NzUgMTE5LjEwOTQgMjAwLjMyMDMgUTEyNy41NDY5IDE5NC43NjU2IDEyNy41NDY5IDE4NC45MjE5IFExMjcuNTQ2OSAxNzQuNTE1NiAxMTkuNzQyMiAxNjkuMTcxOSBRMTExLjkzNzUgMTYzLjgyODEgOTYuNzUgMTYzLjgyODEgTDg0LjY1NjIgMTYzLjgyODEgTDg0LjY1NjIgMTQ4LjY0MDYgTDk3Ljg3NSAxNDguNjQwNiBRMTExLjA5MzggMTQ4LjY0MDYgMTE3LjkxNDEgMTQ0LjIxMDkgUTEyNC43MzQ0IDEzOS43ODEyIDEyNC43MzQ0IDEzMS4zNDM4IFExMjQuNzM0NCAxMjMuMTg3NSAxMTcuNzAzMSAxMTguODk4NCBRMTEwLjY3MTkgMTE0LjYwOTQgOTcuMzEyNSAxMTQuNjA5NCBROTEuNjg3NSAxMTQuNjA5NCA4NC41MTU2IDExNS44NzUgUTc3LjM0MzggMTE3LjE0MDYgNjUuOTUzMSAxMjAuMzc1IEw2NS45NTMxIDEwNC4yMDMxIFE3Ni4yMTg4IDEwMS44MTI1IDg1LjIxODggMTAwLjU0NjkgUTk0LjIxODggOTkuMjgxMiAxMDEuOTUzMSA5OS4yODEyIFExMjIuMjAzMSA5OS4yODEyIDEzNC4wODU5IDEwNy41NzgxIFExNDUuOTY4OCAxMTUuODc1IDE0NS45Njg4IDEyOS43OTY5IFExNDUuOTY4OCAxMzkuNSAxMzkuNjQwNiAxNDYuMjUgUTEzMy4zMTI1IDE1MyAxMjEuNzgxMiAxNTUuNTMxMiBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaU0XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNjg3NSAyNzMuNjU2MiBRMTc1Ljc4MTIgMjU3LjA2MjUgMTgzLjUxNTYgMjQ4LjM0MzggUTE5Mi4yMzQ0IDIzOC4zNTk0IDIwNC4wNDY5IDIzOC4zNTk0IFEyMjMuNTkzOCAyMzguMzU5NCAyMzIuMzEyNSAyNTkuMzEyNSBRMjM0Ljk4NDQgMjY1LjY0MDYgMjM0Ljk4NDQgMjczLjkzNzUgUTIzNC45ODQ0IDI5Ni4xNTYyIDIxNy40MDYyIDMxOC41MTU2IEwxNzIuOTY4OCAzNzUuMDQ2OSBMMTI3Ljk2ODggMzE4LjUxNTYgUTExMC4zOTA2IDI5Ni40Mzc1IDExMC4zOTA2IDI3My45Mzc1IFExMTAuMzkwNiAyNjUuNjQwNiAxMTMuMDYyNSAyNTkuMzEyNSBRMTIxLjkyMTkgMjM4LjM1OTQgMTQxLjMyODEgMjM4LjM1OTQgUTE1My40MjE5IDIzOC4zNTk0IDE2MS44NTk0IDI0OC4zNDM4IFExNjkuNTkzOCAyNTcuNDg0NCAxNzIuNjg3NSAyNzMuNjU2MiBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTIwLjA5MzggMTE4LjY4NzUgTDc2LjY0MDYgMTc3LjYwOTQgTDEyMC4wOTM4IDE3Ny42MDk0IEwxMjAuMDkzOCAxMTguNjg3NSBaTTExNyAxMDEuNjcxOSBMMTQwLjM0MzggMTAxLjY3MTkgTDE0MC4zNDM4IDE3Ny42MDk0IEwxNTkuMzI4MSAxNzcuNjA5NCBMMTU5LjMyODEgMTkyLjkzNzUgTDE0MC4zNDM4IDE5Mi45Mzc1IEwxNDAuMzQzOCAyMTkuMDkzOCBMMTIwLjA5MzggMjE5LjA5MzggTDEyMC4wOTM4IDE5Mi45Mzc1IEw2MS44NzUgMTkyLjkzNzUgTDYxLjg3NSAxNzUuOTIxOSBMMTE3IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpTVcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi42ODc1IDI3My42NTYyIFExNzUuNzgxMiAyNTcuMDYyNSAxODMuNTE1NiAyNDguMzQzOCBRMTkyLjIzNDQgMjM4LjM1OTQgMjA0LjA0NjkgMjM4LjM1OTQgUTIyMy41OTM4IDIzOC4zNTk0IDIzMi4zMTI1IDI1OS4zMTI1IFEyMzQuOTg0NCAyNjUuNjQwNiAyMzQuOTg0NCAyNzMuOTM3NSBRMjM0Ljk4NDQgMjk2LjE1NjIgMjE3LjQwNjIgMzE4LjUxNTYgTDE3Mi45Njg4IDM3NS4wNDY5IEwxMjcuOTY4OCAzMTguNTE1NiBRMTEwLjM5MDYgMjk2LjQzNzUgMTEwLjM5MDYgMjczLjkzNzUgUTExMC4zOTA2IDI2NS42NDA2IDExMy4wNjI1IDI1OS4zMTI1IFExMjEuOTIxOSAyMzguMzU5NCAxNDEuMzI4MSAyMzguMzU5NCBRMTUzLjQyMTkgMjM4LjM1OTQgMTYxLjg1OTQgMjQ4LjM0MzggUTE2OS41OTM4IDI1Ny40ODQ0IDE3Mi42ODc1IDI3My42NTYyIFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02Ny41IDEwMS42NzE5IEwxMzkuMjE4OCAxMDEuNjcxOSBMMTM5LjIxODggMTE1LjAzMTIgTDg0LjIzNDQgMTE1LjAzMTIgTDg0LjIzNDQgMTQzLjcxODggUTg4LjE3MTkgMTQyLjQ1MzEgOTIuMjUgMTQxLjg5MDYgUTk2LjE4NzUgMTQxLjMyODEgMTAwLjEyNSAxNDEuMzI4MSBRMTIyLjc2NTYgMTQxLjMyODEgMTM1Ljk4NDQgMTUyLjE1NjIgUTE0OS4yMDMxIDE2Mi44NDM4IDE0OS4yMDMxIDE4MS4yNjU2IFExNDkuMjAzMSAyMDAuMjUgMTM1LjU2MjUgMjEwLjc5NjkgUTEyMi4wNjI1IDIyMS4yMDMxIDk3LjMxMjUgMjIxLjIwMzEgUTg4Ljg3NSAyMjEuMjAzMSA4MC4wMTU2IDIxOS45Mzc1IFE3MS4xNTYyIDIxOC42NzE5IDYxLjg3NSAyMTYuMTQwNiBMNjEuODc1IDIwMC4yNSBRNjkuODkwNiAyMDQuMDQ2OSA3OC42MDk0IDIwNi4wMTU2IFE4Ny4zMjgxIDIwNy44NDM4IDk3LjAzMTIgMjA3Ljg0MzggUTExMi42NDA2IDIwNy44NDM4IDEyMS43ODEyIDIwMC42NzE5IFExMzAuOTIxOSAxOTMuNSAxMzAuOTIxOSAxODEuMjY1NiBRMTMwLjkyMTkgMTY5LjAzMTIgMTIxLjc4MTIgMTYxLjg1OTQgUTExMi42NDA2IDE1NC42ODc1IDk3LjAzMTIgMTU0LjY4NzUgUTg5LjcxODggMTU0LjY4NzUgODIuNDA2MiAxNTYuMDkzOCBRNzUuMDkzOCAxNTcuNSA2Ny41IDE2MC40NTMxIEw2Ny41IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpTZcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi42ODc1IDI3My42NTYyIFExNzUuNzgxMiAyNTcuMDYyNSAxODMuNTE1NiAyNDguMzQzOCBRMTkyLjIzNDQgMjM4LjM1OTQgMjA0LjA0NjkgMjM4LjM1OTQgUTIyMy41OTM4IDIzOC4zNTk0IDIzMi4zMTI1IDI1OS4zMTI1IFEyMzQuOTg0NCAyNjUuNjQwNiAyMzQuOTg0NCAyNzMuOTM3NSBRMjM0Ljk4NDQgMjk2LjE1NjIgMjE3LjQwNjIgMzE4LjUxNTYgTDE3Mi45Njg4IDM3NS4wNDY5IEwxMjcuOTY4OCAzMTguNTE1NiBRMTEwLjM5MDYgMjk2LjQzNzUgMTEwLjM5MDYgMjczLjkzNzUgUTExMC4zOTA2IDI2NS42NDA2IDExMy4wNjI1IDI1OS4zMTI1IFExMjEuOTIxOSAyMzguMzU5NCAxNDEuMzI4MSAyMzguMzU5NCBRMTUzLjQyMTkgMjM4LjM1OTQgMTYxLjg1OTQgMjQ4LjM0MzggUTE2OS41OTM4IDI1Ny40ODQ0IDE3Mi42ODc1IDI3My42NTYyIFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuMTA5NCAxNTMuNzAzMSBROTcuNzM0NCAxNTMuNzAzMSA5MC41NjI1IDE2MS4wMTU2IFE4My4zOTA2IDE2OC40Njg4IDgzLjM5MDYgMTgxLjI2NTYgUTgzLjM5MDYgMTkzLjkyMTkgOTAuNTYyNSAyMDEuMjM0NCBROTcuNzM0NCAyMDguNjg3NSAxMTAuMTA5NCAyMDguNjg3NSBRMTIyLjM0MzggMjA4LjY4NzUgMTI5LjUxNTYgMjAxLjIzNDQgUTEzNi42ODc1IDE5My45MjE5IDEzNi42ODc1IDE4MS4yNjU2IFExMzYuNjg3NSAxNjguNDY4OCAxMjkuNTE1NiAxNjEuMDE1NiBRMTIyLjM0MzggMTUzLjcwMzEgMTEwLjEwOTQgMTUzLjcwMzEgWk0xNDYuMzkwNiAxMDMuOTIxOSBMMTQ2LjM5MDYgMTE4LjQwNjIgUTEzOS41IDExNS41OTM4IDEzMi40Njg4IDExNC4xODc1IFExMjUuNDM3NSAxMTIuNjQwNiAxMTguNTQ2OSAxMTIuNjQwNiBRMTAwLjU0NjkgMTEyLjY0MDYgOTAuOTg0NCAxMjMuMTg3NSBRODEuNDIxOSAxMzMuODc1IDgwLjAxNTYgMTU1LjM5MDYgUTg1LjM1OTQgMTQ4LjUgOTMuMzc1IDE0NC44NDM4IFExMDEuNTMxMiAxNDEuMTg3NSAxMTEuMDkzOCAxNDEuMTg3NSBRMTMxLjQ4NDQgMTQxLjE4NzUgMTQzLjI5NjkgMTUxLjg3NSBRMTU1LjEwOTQgMTYyLjcwMzEgMTU1LjEwOTQgMTgxLjI2NTYgUTE1NS4xMDk0IDE5OS4xMjUgMTQyLjczNDQgMjEwLjIzNDQgUTEzMC41IDIyMS4yMDMxIDExMC4xMDk0IDIyMS4yMDMxIFE4Ni42MjUgMjIxLjIwMzEgNzQuMjUgMjA1LjU5MzggUTYxLjg3NSAxODkuOTg0NCA2MS44NzUgMTYwLjE3MTkgUTYxLjg3NSAxMzIuMzI4MSA3Ny4wNjI1IDExNS44NzUgUTkyLjI1IDk5LjI4MTIgMTE3Ljg0MzggOTkuMjgxMiBRMTI0LjczNDQgOTkuMjgxMiAxMzEuNzY1NiAxMDAuNDA2MiBRMTM4Ljc5NjkgMTAxLjY3MTkgMTQ2LjM5MDYgMTAzLjkyMTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlN1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTYxLjg3NSAxMDEuNjcxOSBMMTQ4LjY0MDYgMTAxLjY3MTkgTDE0OC42NDA2IDEwOC40MjE5IEw5OS43MDMxIDIxOS4wOTM4IEw4MC41NzgxIDIxOS4wOTM4IEwxMjYuNzAzMSAxMTUuMDMxMiBMNjEuODc1IDExNS4wMzEyIEw2MS44NzUgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlOFxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEwOC4yODEyIDE2My4xMjUgUTk1LjIwMzEgMTYzLjEyNSA4Ny43NSAxNjkuMzEyNSBRODAuMjk2OSAxNzUuMzU5NCA4MC4yOTY5IDE4NS45MDYyIFE4MC4yOTY5IDE5Ni41OTM4IDg3Ljc1IDIwMi42NDA2IFE5NS4yMDMxIDIwOC42ODc1IDEwOC4yODEyIDIwOC42ODc1IFExMjEuMjE4OCAyMDguNjg3NSAxMjguODEyNSAyMDIuNSBRMTM2LjI2NTYgMTk2LjQ1MzEgMTM2LjI2NTYgMTg1LjkwNjIgUTEzNi4yNjU2IDE3NS4zNTk0IDEyOC44MTI1IDE2OS4zMTI1IFExMjEuMzU5NCAxNjMuMTI1IDEwOC4yODEyIDE2My4xMjUgWk05MCAxNTYuMjM0NCBRNzguMTg3NSAxNTMuNzAzMSA3MS43MTg4IDE0Ni44MTI1IFE2NS4xMDk0IDEzOS43ODEyIDY1LjEwOTQgMTI5LjY1NjIgUTY1LjEwOTQgMTE1LjU5MzggNzYuNjQwNiAxMDcuNDM3NSBRODguMTcxOSA5OS4yODEyIDEwOC4yODEyIDk5LjI4MTIgUTEyOC4zOTA2IDk5LjI4MTIgMTM5LjkyMTkgMTA3LjQzNzUgUTE1MS4zMTI1IDExNS41OTM4IDE1MS4zMTI1IDEyOS42NTYyIFExNTEuMzEyNSAxNDAuMDYyNSAxNDQuODQzOCAxNDYuODEyNSBRMTM4LjIzNDQgMTUzLjcwMzEgMTI2LjU2MjUgMTU2LjIzNDQgUTEzOS4yMTg4IDE1OC43NjU2IDE0Ny4wOTM4IDE2Ni45MjE5IFExNTQuNTQ2OSAxNzQuNjU2MiAxNTQuNTQ2OSAxODUuOTA2MiBRMTU0LjU0NjkgMjAyLjkyMTkgMTQyLjU5MzggMjEyLjA2MjUgUTEzMC41IDIyMS4yMDMxIDEwOC4yODEyIDIyMS4yMDMxIFE4NS45MjE5IDIyMS4yMDMxIDczLjk2ODggMjEyLjA2MjUgUTYxLjg3NSAyMDIuOTIxOSA2MS44NzUgMTg1LjkwNjIgUTYxLjg3NSAxNzQuOTM3NSA2OS4zMjgxIDE2Ni45MjE5IFE3Ni45MjE5IDE1OS4wNDY5IDkwIDE1Ni4yMzQ0IFpNODMuMjUgMTMxLjIwMzEgUTgzLjI1IDE0MC4wNjI1IDg5Ljg1OTQgMTQ1LjQwNjIgUTk2LjMyODEgMTUwLjYwOTQgMTA4LjI4MTIgMTUwLjYwOTQgUTExOS42NzE5IDE1MC42MDk0IDEyNi41NjI1IDE0NS40MDYyIFExMzMuMzEyNSAxNDAuMzQzOCAxMzMuMzEyNSAxMzEuMjAzMSBRMTMzLjMxMjUgMTIyLjM0MzggMTI2LjU2MjUgMTE3IFExMTkuOTUzMSAxMTEuNzk2OSAxMDguMjgxMiAxMTEuNzk2OSBROTYuNjA5NCAxMTEuNzk2OSA4OS44NTk0IDExNyBRODMuMjUgMTIyLjA2MjUgODMuMjUgMTMxLjIwMzEgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmlOVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTcwLjU5MzggMjE2LjU2MjUgTDcwLjU5MzggMjAyLjA3ODEgUTc3LjQ4NDQgMjA0Ljg5MDYgODQuNTE1NiAyMDYuNDM3NSBROTEuNTQ2OSAyMDcuODQzOCA5OC4yOTY5IDIwNy44NDM4IFExMTYuNDM3NSAyMDcuODQzOCAxMjYgMTk3LjI5NjkgUTEzNS40MjE5IDE4Ni43NSAxMzYuODI4MSAxNjUuMDkzOCBRMTMxLjkwNjIgMTcxLjcwMzEgMTIzLjQ2ODggMTc1LjUgUTExNS40NTMxIDE3OS4xNTYyIDEwNS43NSAxNzkuMTU2MiBRODUuNSAxNzkuMTU2MiA3My42ODc1IDE2OC40Njg4IFE2MS44NzUgMTU3Ljc4MTIgNjEuODc1IDEzOS4yMTg4IFE2MS44NzUgMTIxLjA3ODEgNzQuMTA5NCAxMTAuMjUgUTg2LjQ4NDQgOTkuMjgxMiAxMDYuODc1IDk5LjI4MTIgUTEzMC4zNTk0IDk5LjI4MTIgMTQyLjU5MzggMTE0Ljg5MDYgUTE1NC45Njg4IDEzMC41IDE1NC45Njg4IDE2MC4zMTI1IFExNTQuOTY4OCAxODguMTU2MiAxMzkuOTIxOSAyMDQuNjA5NCBRMTI0LjczNDQgMjIxLjIwMzEgOTkuMTQwNiAyMjEuMjAzMSBROTIuMjUgMjIxLjIwMzEgODUuMjE4OCAyMjAuMDc4MSBRNzguMTg3NSAyMTguODEyNSA3MC41OTM4IDIxNi41NjI1IFpNMTA2Ljg3NSAxNjYuNzgxMiBRMTE5LjI1IDE2Ni43ODEyIDEyNi40MjE5IDE1OS40Njg4IFExMzMuNTkzOCAxNTIuMTU2MiAxMzMuNTkzOCAxMzkuMjE4OCBRMTMzLjU5MzggMTI2LjU2MjUgMTI2LjQyMTkgMTE5LjI1IFExMTkuMjUgMTExLjc5NjkgMTA2Ljg3NSAxMTEuNzk2OSBROTQuOTIxOSAxMTEuNzk2OSA4Ny40Njg4IDExOS4yNSBRODAuMTU2MiAxMjYuNTYyNSA4MC4xNTYyIDEzOS4yMTg4IFE4MC4xNTYyIDE1Mi4xNTYyIDg3LjQ2ODggMTU5LjQ2ODggUTk0LjY0MDYgMTY2Ljc4MTIgMTA2Ljg3NSAxNjYuNzgxMiBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaUxMFxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTE1OS4wNDY5IDExMS43OTY5IFExNDkuMDYyNSAxMTEuNzk2OSAxNDIuMDMxMiAxMjMuODkwNiBRMTM0Ljg1OTQgMTM1Ljk4NDQgMTM0Ljg1OTQgMTYwLjE3MTkgUTEzNC44NTk0IDE4NC41IDE0Mi4wMzEyIDE5Ni41OTM4IFExNDkuMDYyNSAyMDguNjg3NSAxNTkuMDQ2OSAyMDguNjg3NSBRMTY5LjAzMTIgMjA4LjY4NzUgMTc2LjA2MjUgMTk2LjU5MzggUTE4My4yMzQ0IDE4NC41IDE4My4yMzQ0IDE2MC4xNzE5IFExODMuMjM0NCAxMzUuOTg0NCAxNzYuMDYyNSAxMjMuODkwNiBRMTY5LjAzMTIgMTExLjc5NjkgMTU5LjA0NjkgMTExLjc5NjkgWk0xNTkuMDQ2OSA5OS4yODEyIFExNzcuNDY4OCA5OS4yODEyIDE4OS40MjE5IDExNC44OTA2IFEyMDEuMzc1IDEzMC41IDIwMS4zNzUgMTYwLjE3MTkgUTIwMS4zNzUgMTg5Ljk4NDQgMTg5LjQyMTkgMjA1LjU5MzggUTE3Ny40Njg4IDIyMS4yMDMxIDE1OS4wNDY5IDIyMS4yMDMxIFExMzYuMjY1NiAyMjEuMjAzMSAxMjYuNDIxOSAyMDUuNTkzOCBRMTE2LjU3ODEgMTg5Ljk4NDQgMTE2LjU3ODEgMTYwLjE3MTkgUTExNi41NzgxIDEzMC41IDEyNi40MjE5IDExNC44OTA2IFExMzYuMjY1NiA5OS4yODEyIDE1OS4wNDY5IDk5LjI4MTIgWk04MC41NzgxIDIxOS4wOTM4IEw4MC41NzgxIDExNy43MDMxIEw2MS44NzUgMTIzLjQ2ODggTDYxLjg3NSAxMDcuMTU2MiBMODEuNTYyNSAxMDEuNjcxOSBMMTAwLjgyODEgMTAxLjY3MTkgTDEwMC44MjgxIDIxOS4wOTM4IEw4MC41NzgxIDIxOS4wOTM4IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpUpcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi42ODc1IDI3My42NTYyIFExNzUuNzgxMiAyNTcuMDYyNSAxODMuNTE1NiAyNDguMzQzOCBRMTkyLjIzNDQgMjM4LjM1OTQgMjA0LjA0NjkgMjM4LjM1OTQgUTIyMy41OTM4IDIzOC4zNTk0IDIzMi4zMTI1IDI1OS4zMTI1IFEyMzQuOTg0NCAyNjUuNjQwNiAyMzQuOTg0NCAyNzMuOTM3NSBRMjM0Ljk4NDQgMjk2LjE1NjIgMjE3LjQwNjIgMzE4LjUxNTYgTDE3Mi45Njg4IDM3NS4wNDY5IEwxMjcuOTY4OCAzMTguNTE1NiBRMTEwLjM5MDYgMjk2LjQzNzUgMTEwLjM5MDYgMjczLjkzNzUgUTExMC4zOTA2IDI2NS42NDA2IDExMy4wNjI1IDI1OS4zMTI1IFExMjEuOTIxOSAyMzguMzU5NCAxNDEuMzI4MSAyMzguMzU5NCBRMTUzLjQyMTkgMjM4LjM1OTQgMTYxLjg1OTQgMjQ4LjM0MzggUTE2OS41OTM4IDI1Ny40ODQ0IDE3Mi42ODc1IDI3My42NTYyIFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk04OS4xNTYyIDEwMS42NzE5IEwxMDcuMDE1NiAxMDEuNjcxOSBMMTA3LjAxNTYgMTc4LjczNDQgUTEwNy4wMTU2IDE5OS42ODc1IDk3Ljg3NSAyMDkuNTMxMiBRODguODc1IDIxOS4yMzQ0IDY4Ljc2NTYgMjE5LjIzNDQgTDYxLjg3NSAyMTkuMjM0NCBMNjEuODc1IDIwNS43MzQ0IEw2Ny41IDIwNS43MzQ0IFE3OS4zMTI1IDIwNS43MzQ0IDg0LjIzNDQgMTk5LjgyODEgUTg5LjE1NjIgMTkzLjkyMTkgODkuMTU2MiAxNzguNzM0NCBMODkuMTU2MiAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaVRXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xMDcuMjk2OSAyMjEuMDYyNSBRMTA2LjczNDQgMjIxLjA2MjUgMTA1LjUzOTEgMjIxLjEzMjggUTEwNC4zNDM4IDIyMS4yMDMxIDEwMy42NDA2IDIyMS4yMDMxIFE4MS40MjE5IDIyMS4yMDMxIDcwLjUyMzQgMjA2LjA4NTkgUTU5LjYyNSAxOTAuOTY4OCA1OS42MjUgMTYwLjMxMjUgUTU5LjYyNSAxMjkuNTE1NiA3MC41OTM4IDExNC4zOTg0IFE4MS41NjI1IDk5LjI4MTIgMTAzLjc4MTIgOTkuMjgxMiBRMTI2LjE0MDYgOTkuMjgxMiAxMzcuMTA5NCAxMTQuMzk4NCBRMTQ4LjA3ODEgMTI5LjUxNTYgMTQ4LjA3ODEgMTYwLjMxMjUgUTE0OC4wNzgxIDE4My41MTU2IDE0Mi4wMzEyIDE5Ny42NDg0IFExMzUuOTg0NCAyMTEuNzgxMiAxMjMuNjA5NCAyMTcuNDA2MiBMMTQxLjMyODEgMjMyLjMxMjUgTDEyNy45Njg4IDI0MC4xODc1IEwxMDcuMjk2OSAyMjEuMDYyNSBaTTEyOS4zNzUgMTYwLjMxMjUgUTEyOS4zNzUgMTM0LjQzNzUgMTIzLjM5ODQgMTIzLjMyODEgUTExNy40MjE5IDExMi4yMTg4IDEwMy43ODEyIDExMi4yMTg4IFE5MC4yODEyIDExMi4yMTg4IDg0LjMwNDcgMTIzLjMyODEgUTc4LjMyODEgMTM0LjQzNzUgNzguMzI4MSAxNjAuMzEyNSBRNzguMzI4MSAxODYuMTg3NSA4NC4zMDQ3IDE5Ny4yOTY5IFE5MC4yODEyIDIwOC40MDYyIDEwMy43ODEyIDIwOC40MDYyIFExMTcuNDIxOSAyMDguNDA2MiAxMjMuMzk4NCAxOTcuMjk2OSBRMTI5LjM3NSAxODYuMTg3NSAxMjkuMzc1IDE2MC4zMTI1IFpNMTcyLjY4NzUgMjczLjY1NjIgUTE3NS43ODEyIDI1Ny4wNjI1IDE4My41MTU2IDI0OC4zNDM4IFExOTIuMjM0NCAyMzguMzU5NCAyMDQuMDQ2OSAyMzguMzU5NCBRMjIzLjU5MzggMjM4LjM1OTQgMjMyLjMxMjUgMjU5LjMxMjUgUTIzNC45ODQ0IDI2NS42NDA2IDIzNC45ODQ0IDI3My45Mzc1IFEyMzQuOTg0NCAyOTYuMTU2MiAyMTcuNDA2MiAzMTguNTE1NiBMMTcyLjk2ODggMzc1LjA0NjkgTDEyNy45Njg4IDMxOC41MTU2IFExMTAuMzkwNiAyOTYuNDM3NSAxMTAuMzkwNiAyNzMuOTM3NSBRMTEwLjM5MDYgMjY1LjY0MDYgMTEzLjA2MjUgMjU5LjMxMjUgUTEyMS45MjE5IDIzOC4zNTk0IDE0MS4zMjgxIDIzOC4zNTk0IFExNTMuNDIxOSAyMzguMzU5NCAxNjEuODU5NCAyNDguMzQzOCBRMTY5LjU5MzggMjU3LjQ4NDQgMTcyLjY4NzUgMjczLjY1NjIgWk02NC4yNjU2IDg0Ljc5NjkgUTQ3LjM5MDYgODQuNzk2OSA0Ny4zOTA2IDEwMS42NzE5IEw0Ny4zOTA2IDM3MC42ODc1IFE0Ny4zOTA2IDM4Ny41NjI1IDY0LjI2NTYgMzg3LjU2MjUgTDIzNS4xMjUgMzg3LjU2MjUgUTI1MiAzODcuNTYyNSAyNTIgMzcwLjY4NzUgTDI1MiAxMDEuNjcxOSBRMjUyIDg0Ljc5NjkgMjM1LjEyNSA4NC43OTY5IEw2NC4yNjU2IDg0Ljc5NjkgWk02NC4yNjU2IDY3LjkyMTkgTDIzNS4xMjUgNjcuOTIxOSBRMjY4Ljg3NSA2Ny45MjE5IDI2OC44NzUgMTAxLjY3MTkgTDI2OC44NzUgMzcwLjY4NzUgUTI2OC44NzUgNDA0LjQzNzUgMjM1LjEyNSA0MDQuNDM3NSBMNjQuMjY1NiA0MDQuNDM3NSBRMzAuNTE1NiA0MDQuNDM3NSAzMC41MTU2IDM3MC42ODc1IEwzMC41MTU2IDEwMS42NzE5IFEzMC41MTU2IDY3LjkyMTkgNjQuMjY1NiA2Ny45MjE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpUtcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi42ODc1IDI3My42NTYyIFExNzUuNzgxMiAyNTcuMDYyNSAxODMuNTE1NiAyNDguMzQzOCBRMTkyLjIzNDQgMjM4LjM1OTQgMjA0LjA0NjkgMjM4LjM1OTQgUTIyMy41OTM4IDIzOC4zNTk0IDIzMi4zMTI1IDI1OS4zMTI1IFEyMzQuOTg0NCAyNjUuNjQwNiAyMzQuOTg0NCAyNzMuOTM3NSBRMjM0Ljk4NDQgMjk2LjE1NjIgMjE3LjQwNjIgMzE4LjUxNTYgTDE3Mi45Njg4IDM3NS4wNDY5IEwxMjcuOTY4OCAzMTguNTE1NiBRMTEwLjM5MDYgMjk2LjQzNzUgMTEwLjM5MDYgMjczLjkzNzUgUTExMC4zOTA2IDI2NS42NDA2IDExMy4wNjI1IDI1OS4zMTI1IFExMjEuOTIxOSAyMzguMzU5NCAxNDEuMzI4MSAyMzguMzU5NCBRMTUzLjQyMTkgMjM4LjM1OTQgMTYxLjg1OTQgMjQ4LjM0MzggUTE2OS41OTM4IDI1Ny40ODQ0IDE3Mi42ODc1IDI3My42NTYyIFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02MS44NzUgMTAxLjY3MTkgTDc5LjczNDQgMTAxLjY3MTkgTDc5LjczNDQgMTUxLjMxMjUgTDEzMC42NDA2IDEwMS42NzE5IEwxNTMuNzAzMSAxMDEuNjcxOSBMOTYuNDY4OCAxNTYuNTE1NiBMMTU4LjM0MzggMjE5LjIzNDQgTDEzNC44NTk0IDIxOS4yMzQ0IEw3OS43MzQ0IDE2Mi41NjI1IEw3OS43MzQ0IDIxOS4yMzQ0IEw2MS44NzUgMjE5LjIzNDQgTDYxLjg3NSAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaZBXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTEwLjY3MTkgMTE1LjczNDQgTDkxLjgyODEgMTc1Ljc4MTIgTDEyOS41MTU2IDE3NS43ODEyIEwxMTAuNjcxOSAxMTUuNzM0NCBaTTk5Ljk4NDQgMTAxLjY3MTkgTDEyMS42NDA2IDEwMS42NzE5IEwxNjIuMTQwNiAyMTkuMjM0NCBMMTQzLjU3ODEgMjE5LjIzNDQgTDEzNC4wMTU2IDE4OC41NzgxIEw4Ny42MDk0IDE4OC41NzgxIEw3OC4wNDY5IDIxOS4yMzQ0IEw1OS40ODQ0IDIxOS4yMzQ0IEw5OS45ODQ0IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpjJcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk04Ni4zNDM4IDIwMy4wNjI1IEwxNDUuOTY4OCAyMDMuMDYyNSBMMTQ1Ljk2ODggMjE5LjA5MzggTDYxLjg3NSAyMTkuMDkzOCBMNjEuODc1IDIwMy42MjUgUTY2LjY1NjIgMTk5LjI2NTYgNzUuNTE1NiAxOTEuMzkwNiBRMTIzLjg5MDYgMTQ4LjUgMTIzLjg5MDYgMTM1LjI4MTIgUTEyMy44OTA2IDEyNiAxMTYuNTc4MSAxMjAuMzA0NyBRMTA5LjI2NTYgMTE0LjYwOTQgOTcuMzEyNSAxMTQuNjA5NCBROTAgMTE0LjYwOTQgODEuNDIxOSAxMTcuMDcwMyBRNzIuODQzOCAxMTkuNTMxMiA2Mi43MTg4IDEyNC40NTMxIEw2Mi43MTg4IDEwNy4xNTYyIFE3My41NDY5IDEwMy4yMTg4IDgyLjg5ODQgMTAxLjI1IFE5Mi4yNSA5OS4yODEyIDEwMC4yNjU2IDk5LjI4MTIgUTEyMC42NTYyIDk5LjI4MTIgMTMyLjg5MDYgMTA4LjU2MjUgUTE0NS4xMjUgMTE3Ljg0MzggMTQ1LjEyNSAxMzMuMDMxMiBRMTQ1LjEyNSAxNTIuNTc4MSA5OC41NzgxIDE5Mi41MTU2IFE5MC43MDMxIDE5OS4yNjU2IDg2LjM0MzggMjAzLjA2MjUgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmM1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEyMS43ODEyIDE1NS41MzEyIFExMzQuNzE4OCAxNTguMDYyNSAxNDEuODIwMyAxNjUuNzI2NiBRMTQ4LjkyMTkgMTczLjM5MDYgMTQ4LjkyMTkgMTg0LjkyMTkgUTE0OC45MjE5IDIwMi4zNTk0IDEzNS41NjI1IDIxMS43ODEyIFExMjIuMjAzMSAyMjEuMjAzMSA5Ny4zMTI1IDIyMS4yMDMxIFE4OS4yOTY5IDIyMS4yMDMxIDgwLjUwNzggMjE5LjcyNjYgUTcxLjcxODggMjE4LjI1IDYxLjg3NSAyMTUuNDM3NSBMNjEuODc1IDE5OC40MjE5IFE2OS4xODc1IDIwMi4yMTg4IDc3LjU1NDcgMjA0LjA0NjkgUTg1LjkyMTkgMjA1Ljg3NSA5NS4zNDM4IDIwNS44NzUgUTExMC42NzE5IDIwNS44NzUgMTE5LjEwOTQgMjAwLjMyMDMgUTEyNy41NDY5IDE5NC43NjU2IDEyNy41NDY5IDE4NC45MjE5IFExMjcuNTQ2OSAxNzQuNTE1NiAxMTkuNzQyMiAxNjkuMTcxOSBRMTExLjkzNzUgMTYzLjgyODEgOTYuNzUgMTYzLjgyODEgTDg0LjY1NjIgMTYzLjgyODEgTDg0LjY1NjIgMTQ4LjY0MDYgTDk3Ljg3NSAxNDguNjQwNiBRMTExLjA5MzggMTQ4LjY0MDYgMTE3LjkxNDEgMTQ0LjIxMDkgUTEyNC43MzQ0IDEzOS43ODEyIDEyNC43MzQ0IDEzMS4zNDM4IFExMjQuNzM0NCAxMjMuMTg3NSAxMTcuNzAzMSAxMTguODk4NCBRMTEwLjY3MTkgMTE0LjYwOTQgOTcuMzEyNSAxMTQuNjA5NCBROTEuNjg3NSAxMTQuNjA5NCA4NC41MTU2IDExNS44NzUgUTc3LjM0MzggMTE3LjE0MDYgNjUuOTUzMSAxMjAuMzc1IEw2NS45NTMxIDEwNC4yMDMxIFE3Ni4yMTg4IDEwMS44MTI1IDg1LjIxODggMTAwLjU0NjkgUTk0LjIxODggOTkuMjgxMiAxMDEuOTUzMSA5OS4yODEyIFExMjIuMjAzMSA5OS4yODEyIDEzNC4wODU5IDEwNy41NzgxIFExNDUuOTY4OCAxMTUuODc1IDE0NS45Njg4IDEyOS43OTY5IFExNDUuOTY4OCAxMzkuNSAxMzkuNjQwNiAxNDYuMjUgUTEzMy4zMTI1IDE1MyAxMjEuNzgxMiAxNTUuNTMxMiBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaY0XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTIwLjA5MzggMTE4LjY4NzUgTDc2LjY0MDYgMTc3LjYwOTQgTDEyMC4wOTM4IDE3Ny42MDk0IEwxMjAuMDkzOCAxMTguNjg3NSBaTTExNyAxMDEuNjcxOSBMMTQwLjM0MzggMTAxLjY3MTkgTDE0MC4zNDM4IDE3Ny42MDk0IEwxNTkuMzI4MSAxNzcuNjA5NCBMMTU5LjMyODEgMTkyLjkzNzUgTDE0MC4zNDM4IDE5Mi45Mzc1IEwxNDAuMzQzOCAyMTkuMDkzOCBMMTIwLjA5MzggMjE5LjA5MzggTDEyMC4wOTM4IDE5Mi45Mzc1IEw2MS44NzUgMTkyLjkzNzUgTDYxLjg3NSAxNzUuOTIxOSBMMTE3IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpjVcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk02Ny41IDEwMS42NzE5IEwxMzkuMjE4OCAxMDEuNjcxOSBMMTM5LjIxODggMTE1LjAzMTIgTDg0LjIzNDQgMTE1LjAzMTIgTDg0LjIzNDQgMTQzLjcxODggUTg4LjE3MTkgMTQyLjQ1MzEgOTIuMjUgMTQxLjg5MDYgUTk2LjE4NzUgMTQxLjMyODEgMTAwLjEyNSAxNDEuMzI4MSBRMTIyLjc2NTYgMTQxLjMyODEgMTM1Ljk4NDQgMTUyLjE1NjIgUTE0OS4yMDMxIDE2Mi44NDM4IDE0OS4yMDMxIDE4MS4yNjU2IFExNDkuMjAzMSAyMDAuMjUgMTM1LjU2MjUgMjEwLjc5NjkgUTEyMi4wNjI1IDIyMS4yMDMxIDk3LjMxMjUgMjIxLjIwMzEgUTg4Ljg3NSAyMjEuMjAzMSA4MC4wMTU2IDIxOS45Mzc1IFE3MS4xNTYyIDIxOC42NzE5IDYxLjg3NSAyMTYuMTQwNiBMNjEuODc1IDIwMC4yNSBRNjkuODkwNiAyMDQuMDQ2OSA3OC42MDk0IDIwNi4wMTU2IFE4Ny4zMjgxIDIwNy44NDM4IDk3LjAzMTIgMjA3Ljg0MzggUTExMi42NDA2IDIwNy44NDM4IDEyMS43ODEyIDIwMC42NzE5IFExMzAuOTIxOSAxOTMuNSAxMzAuOTIxOSAxODEuMjY1NiBRMTMwLjkyMTkgMTY5LjAzMTIgMTIxLjc4MTIgMTYxLjg1OTQgUTExMi42NDA2IDE1NC42ODc1IDk3LjAzMTIgMTU0LjY4NzUgUTg5LjcxODggMTU0LjY4NzUgODIuNDA2MiAxNTYuMDkzOCBRNzUuMDkzOCAxNTcuNSA2Ny41IDE2MC40NTMxIEw2Ny41IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpjZcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMTAuMTA5NCAxNTMuNzAzMSBROTcuNzM0NCAxNTMuNzAzMSA5MC41NjI1IDE2MS4wMTU2IFE4My4zOTA2IDE2OC40Njg4IDgzLjM5MDYgMTgxLjI2NTYgUTgzLjM5MDYgMTkzLjkyMTkgOTAuNTYyNSAyMDEuMjM0NCBROTcuNzM0NCAyMDguNjg3NSAxMTAuMTA5NCAyMDguNjg3NSBRMTIyLjM0MzggMjA4LjY4NzUgMTI5LjUxNTYgMjAxLjIzNDQgUTEzNi42ODc1IDE5My45MjE5IDEzNi42ODc1IDE4MS4yNjU2IFExMzYuNjg3NSAxNjguNDY4OCAxMjkuNTE1NiAxNjEuMDE1NiBRMTIyLjM0MzggMTUzLjcwMzEgMTEwLjEwOTQgMTUzLjcwMzEgWk0xNDYuMzkwNiAxMDMuOTIxOSBMMTQ2LjM5MDYgMTE4LjQwNjIgUTEzOS41IDExNS41OTM4IDEzMi40Njg4IDExNC4xODc1IFExMjUuNDM3NSAxMTIuNjQwNiAxMTguNTQ2OSAxMTIuNjQwNiBRMTAwLjU0NjkgMTEyLjY0MDYgOTAuOTg0NCAxMjMuMTg3NSBRODEuNDIxOSAxMzMuODc1IDgwLjAxNTYgMTU1LjM5MDYgUTg1LjM1OTQgMTQ4LjUgOTMuMzc1IDE0NC44NDM4IFExMDEuNTMxMiAxNDEuMTg3NSAxMTEuMDkzOCAxNDEuMTg3NSBRMTMxLjQ4NDQgMTQxLjE4NzUgMTQzLjI5NjkgMTUxLjg3NSBRMTU1LjEwOTQgMTYyLjcwMzEgMTU1LjEwOTQgMTgxLjI2NTYgUTE1NS4xMDk0IDE5OS4xMjUgMTQyLjczNDQgMjEwLjIzNDQgUTEzMC41IDIyMS4yMDMxIDExMC4xMDk0IDIyMS4yMDMxIFE4Ni42MjUgMjIxLjIwMzEgNzQuMjUgMjA1LjU5MzggUTYxLjg3NSAxODkuOTg0NCA2MS44NzUgMTYwLjE3MTkgUTYxLjg3NSAxMzIuMzI4MSA3Ny4wNjI1IDExNS44NzUgUTkyLjI1IDk5LjI4MTIgMTE3Ljg0MzggOTkuMjgxMiBRMTI0LjczNDQgOTkuMjgxMiAxMzEuNzY1NiAxMDAuNDA2MiBRMTM4Ljc5NjkgMTAxLjY3MTkgMTQ2LjM5MDYgMTAzLjkyMTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmN1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTYxLjg3NSAxMDEuNjcxOSBMMTQ4LjY0MDYgMTAxLjY3MTkgTDE0OC42NDA2IDEwOC40MjE5IEw5OS43MDMxIDIxOS4wOTM4IEw4MC41NzgxIDIxOS4wOTM4IEwxMjYuNzAzMSAxMTUuMDMxMiBMNjEuODc1IDExNS4wMzEyIEw2MS44NzUgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmOFxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEwOC4yODEyIDE2My4xMjUgUTk1LjIwMzEgMTYzLjEyNSA4Ny43NSAxNjkuMzEyNSBRODAuMjk2OSAxNzUuMzU5NCA4MC4yOTY5IDE4NS45MDYyIFE4MC4yOTY5IDE5Ni41OTM4IDg3Ljc1IDIwMi42NDA2IFE5NS4yMDMxIDIwOC42ODc1IDEwOC4yODEyIDIwOC42ODc1IFExMjEuMjE4OCAyMDguNjg3NSAxMjguODEyNSAyMDIuNSBRMTM2LjI2NTYgMTk2LjQ1MzEgMTM2LjI2NTYgMTg1LjkwNjIgUTEzNi4yNjU2IDE3NS4zNTk0IDEyOC44MTI1IDE2OS4zMTI1IFExMjEuMzU5NCAxNjMuMTI1IDEwOC4yODEyIDE2My4xMjUgWk05MCAxNTYuMjM0NCBRNzguMTg3NSAxNTMuNzAzMSA3MS43MTg4IDE0Ni44MTI1IFE2NS4xMDk0IDEzOS43ODEyIDY1LjEwOTQgMTI5LjY1NjIgUTY1LjEwOTQgMTE1LjU5MzggNzYuNjQwNiAxMDcuNDM3NSBRODguMTcxOSA5OS4yODEyIDEwOC4yODEyIDk5LjI4MTIgUTEyOC4zOTA2IDk5LjI4MTIgMTM5LjkyMTkgMTA3LjQzNzUgUTE1MS4zMTI1IDExNS41OTM4IDE1MS4zMTI1IDEyOS42NTYyIFExNTEuMzEyNSAxNDAuMDYyNSAxNDQuODQzOCAxNDYuODEyNSBRMTM4LjIzNDQgMTUzLjcwMzEgMTI2LjU2MjUgMTU2LjIzNDQgUTEzOS4yMTg4IDE1OC43NjU2IDE0Ny4wOTM4IDE2Ni45MjE5IFExNTQuNTQ2OSAxNzQuNjU2MiAxNTQuNTQ2OSAxODUuOTA2MiBRMTU0LjU0NjkgMjAyLjkyMTkgMTQyLjU5MzggMjEyLjA2MjUgUTEzMC41IDIyMS4yMDMxIDEwOC4yODEyIDIyMS4yMDMxIFE4NS45MjE5IDIyMS4yMDMxIDczLjk2ODggMjEyLjA2MjUgUTYxLjg3NSAyMDIuOTIxOSA2MS44NzUgMTg1LjkwNjIgUTYxLjg3NSAxNzQuOTM3NSA2OS4zMjgxIDE2Ni45MjE5IFE3Ni45MjE5IDE1OS4wNDY5IDkwIDE1Ni4yMzQ0IFpNODMuMjUgMTMxLjIwMzEgUTgzLjI1IDE0MC4wNjI1IDg5Ljg1OTQgMTQ1LjQwNjIgUTk2LjMyODEgMTUwLjYwOTQgMTA4LjI4MTIgMTUwLjYwOTQgUTExOS42NzE5IDE1MC42MDk0IDEyNi41NjI1IDE0NS40MDYyIFExMzMuMzEyNSAxNDAuMzQzOCAxMzMuMzEyNSAxMzEuMjAzMSBRMTMzLjMxMjUgMTIyLjM0MzggMTI2LjU2MjUgMTE3IFExMTkuOTUzMSAxMTEuNzk2OSAxMDguMjgxMiAxMTEuNzk2OSBROTYuNjA5NCAxMTEuNzk2OSA4OS44NTk0IDExNyBRODMuMjUgMTIyLjA2MjUgODMuMjUgMTMxLjIwMzEgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmmOVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTcwLjU5MzggMjE2LjU2MjUgTDcwLjU5MzggMjAyLjA3ODEgUTc3LjQ4NDQgMjA0Ljg5MDYgODQuNTE1NiAyMDYuNDM3NSBROTEuNTQ2OSAyMDcuODQzOCA5OC4yOTY5IDIwNy44NDM4IFExMTYuNDM3NSAyMDcuODQzOCAxMjYgMTk3LjI5NjkgUTEzNS40MjE5IDE4Ni43NSAxMzYuODI4MSAxNjUuMDkzOCBRMTMxLjkwNjIgMTcxLjcwMzEgMTIzLjQ2ODggMTc1LjUgUTExNS40NTMxIDE3OS4xNTYyIDEwNS43NSAxNzkuMTU2MiBRODUuNSAxNzkuMTU2MiA3My42ODc1IDE2OC40Njg4IFE2MS44NzUgMTU3Ljc4MTIgNjEuODc1IDEzOS4yMTg4IFE2MS44NzUgMTIxLjA3ODEgNzQuMTA5NCAxMTAuMjUgUTg2LjQ4NDQgOTkuMjgxMiAxMDYuODc1IDk5LjI4MTIgUTEzMC4zNTk0IDk5LjI4MTIgMTQyLjU5MzggMTE0Ljg5MDYgUTE1NC45Njg4IDEzMC41IDE1NC45Njg4IDE2MC4zMTI1IFExNTQuOTY4OCAxODguMTU2MiAxMzkuOTIxOSAyMDQuNjA5NCBRMTI0LjczNDQgMjIxLjIwMzEgOTkuMTQwNiAyMjEuMjAzMSBROTIuMjUgMjIxLjIwMzEgODUuMjE4OCAyMjAuMDc4MSBRNzguMTg3NSAyMTguODEyNSA3MC41OTM4IDIxNi41NjI1IFpNMTA2Ljg3NSAxNjYuNzgxMiBRMTE5LjI1IDE2Ni43ODEyIDEyNi40MjE5IDE1OS40Njg4IFExMzMuNTkzOCAxNTIuMTU2MiAxMzMuNTkzOCAxMzkuMjE4OCBRMTMzLjU5MzggMTI2LjU2MjUgMTI2LjQyMTkgMTE5LjI1IFExMTkuMjUgMTExLjc5NjkgMTA2Ljg3NSAxMTEuNzk2OSBROTQuOTIxOSAxMTEuNzk2OSA4Ny40Njg4IDExOS4yNSBRODAuMTU2MiAxMjYuNTYyNSA4MC4xNTYyIDEzOS4yMTg4IFE4MC4xNTYyIDE1Mi4xNTYyIDg3LjQ2ODggMTU5LjQ2ODggUTk0LjY0MDYgMTY2Ljc4MTIgMTA2Ljg3NSAxNjYuNzgxMiBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaYxMFxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTcyLjQwNjIgMjI4LjIzNDQgUTE3Mi40MDYyIDIyOC4yMzQ0IDIyOS43ODEyIDMwMi4yMDMxIEwxNzIuNDA2MiAzNzUuMDQ2OSBRMTcyLjQwNjIgMzc1LjA0NjkgMTE0Ljc1IDMwMi4yMDMxIFExMTQuNzUgMzAyLjIwMzEgMTcyLjQwNjIgMjI4LjIzNDQgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTE1OS4wNDY5IDExMS43OTY5IFExNDkuMDYyNSAxMTEuNzk2OSAxNDIuMDMxMiAxMjMuODkwNiBRMTM0Ljg1OTQgMTM1Ljk4NDQgMTM0Ljg1OTQgMTYwLjE3MTkgUTEzNC44NTk0IDE4NC41IDE0Mi4wMzEyIDE5Ni41OTM4IFExNDkuMDYyNSAyMDguNjg3NSAxNTkuMDQ2OSAyMDguNjg3NSBRMTY5LjAzMTIgMjA4LjY4NzUgMTc2LjA2MjUgMTk2LjU5MzggUTE4My4yMzQ0IDE4NC41IDE4My4yMzQ0IDE2MC4xNzE5IFExODMuMjM0NCAxMzUuOTg0NCAxNzYuMDYyNSAxMjMuODkwNiBRMTY5LjAzMTIgMTExLjc5NjkgMTU5LjA0NjkgMTExLjc5NjkgWk0xNTkuMDQ2OSA5OS4yODEyIFExNzcuNDY4OCA5OS4yODEyIDE4OS40MjE5IDExNC44OTA2IFEyMDEuMzc1IDEzMC41IDIwMS4zNzUgMTYwLjE3MTkgUTIwMS4zNzUgMTg5Ljk4NDQgMTg5LjQyMTkgMjA1LjU5MzggUTE3Ny40Njg4IDIyMS4yMDMxIDE1OS4wNDY5IDIyMS4yMDMxIFExMzYuMjY1NiAyMjEuMjAzMSAxMjYuNDIxOSAyMDUuNTkzOCBRMTE2LjU3ODEgMTg5Ljk4NDQgMTE2LjU3ODEgMTYwLjE3MTkgUTExNi41NzgxIDEzMC41IDEyNi40MjE5IDExNC44OTA2IFExMzYuMjY1NiA5OS4yODEyIDE1OS4wNDY5IDk5LjI4MTIgWk04MC41NzgxIDIxOS4wOTM4IEw4MC41NzgxIDExNy43MDMxIEw2MS44NzUgMTIzLjQ2ODggTDYxLjg3NSAxMDcuMTU2MiBMODEuNTYyNSAxMDEuNjcxOSBMMTAwLjgyODEgMTAxLjY3MTkgTDEwMC44MjgxIDIxOS4wOTM4IEw4MC41NzgxIDIxOS4wOTM4IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZpkpcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE3Mi40MDYyIDIyOC4yMzQ0IFExNzIuNDA2MiAyMjguMjM0NCAyMjkuNzgxMiAzMDIuMjAzMSBMMTcyLjQwNjIgMzc1LjA0NjkgUTE3Mi40MDYyIDM3NS4wNDY5IDExNC43NSAzMDIuMjAzMSBRMTE0Ljc1IDMwMi4yMDMxIDE3Mi40MDYyIDIyOC4yMzQ0IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk04OS4xNTYyIDEwMS42NzE5IEwxMDcuMDE1NiAxMDEuNjcxOSBMMTA3LjAxNTYgMTc4LjczNDQgUTEwNy4wMTU2IDE5OS42ODc1IDk3Ljg3NSAyMDkuNTMxMiBRODguODc1IDIxOS4yMzQ0IDY4Ljc2NTYgMjE5LjIzNDQgTDYxLjg3NSAyMTkuMjM0NCBMNjEuODc1IDIwNS43MzQ0IEw2Ny41IDIwNS43MzQ0IFE3OS4zMTI1IDIwNS43MzQ0IDg0LjIzNDQgMTk5LjgyODEgUTg5LjE1NjIgMTkzLjkyMTkgODkuMTU2MiAxNzguNzM0NCBMODkuMTU2MiAxMDEuNjcxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaZRXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTEwNy4yOTY5IDIyMS4wNjI1IFExMDYuNzM0NCAyMjEuMDYyNSAxMDUuNTM5MSAyMjEuMTMyOCBRMTA0LjM0MzggMjIxLjIwMzEgMTAzLjY0MDYgMjIxLjIwMzEgUTgxLjQyMTkgMjIxLjIwMzEgNzAuNTIzNCAyMDYuMDg1OSBRNTkuNjI1IDE5MC45Njg4IDU5LjYyNSAxNjAuMzEyNSBRNTkuNjI1IDEyOS41MTU2IDcwLjU5MzggMTE0LjM5ODQgUTgxLjU2MjUgOTkuMjgxMiAxMDMuNzgxMiA5OS4yODEyIFExMjYuMTQwNiA5OS4yODEyIDEzNy4xMDk0IDExNC4zOTg0IFExNDguMDc4MSAxMjkuNTE1NiAxNDguMDc4MSAxNjAuMzEyNSBRMTQ4LjA3ODEgMTgzLjUxNTYgMTQyLjAzMTIgMTk3LjY0ODQgUTEzNS45ODQ0IDIxMS43ODEyIDEyMy42MDk0IDIxNy40MDYyIEwxNDEuMzI4MSAyMzIuMzEyNSBMMTI3Ljk2ODggMjQwLjE4NzUgTDEwNy4yOTY5IDIyMS4wNjI1IFpNMTI5LjM3NSAxNjAuMzEyNSBRMTI5LjM3NSAxMzQuNDM3NSAxMjMuMzk4NCAxMjMuMzI4MSBRMTE3LjQyMTkgMTEyLjIxODggMTAzLjc4MTIgMTEyLjIxODggUTkwLjI4MTIgMTEyLjIxODggODQuMzA0NyAxMjMuMzI4MSBRNzguMzI4MSAxMzQuNDM3NSA3OC4zMjgxIDE2MC4zMTI1IFE3OC4zMjgxIDE4Ni4xODc1IDg0LjMwNDcgMTk3LjI5NjkgUTkwLjI4MTIgMjA4LjQwNjIgMTAzLjc4MTIgMjA4LjQwNjIgUTExNy40MjE5IDIwOC40MDYyIDEyMy4zOTg0IDE5Ny4yOTY5IFExMjkuMzc1IDE4Ni4xODc1IDEyOS4zNzUgMTYwLjMxMjUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaZLXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNzIuNDA2MiAyMjguMjM0NCBRMTcyLjQwNjIgMjI4LjIzNDQgMjI5Ljc4MTIgMzAyLjIwMzEgTDE3Mi40MDYyIDM3NS4wNDY5IFExNzIuNDA2MiAzNzUuMDQ2OSAxMTQuNzUgMzAyLjIwMzEgUTExNC43NSAzMDIuMjAzMSAxNzIuNDA2MiAyMjguMjM0NCBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjEuODc1IDEwMS42NzE5IEw3OS43MzQ0IDEwMS42NzE5IEw3OS43MzQ0IDE1MS4zMTI1IEwxMzAuNjQwNiAxMDEuNjcxOSBMMTUzLjcwMzEgMTAxLjY3MTkgTDk2LjQ2ODggMTU2LjUxNTYgTDE1OC4zNDM4IDIxOS4yMzQ0IEwxMzQuODU5NCAyMTkuMjM0NCBMNzkuNzM0NCAxNjIuNTYyNSBMNzkuNzM0NCAyMTkuMjM0NCBMNjEuODc1IDIxOS4yMzQ0IEw2MS44NzUgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjQVxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTEwLjY3MTkgMTE1LjczNDQgTDkxLjgyODEgMTc1Ljc4MTIgTDEyOS41MTU2IDE3NS43ODEyIEwxMTAuNjcxOSAxMTUuNzM0NCBaTTk5Ljk4NDQgMTAxLjY3MTkgTDEyMS42NDA2IDEwMS42NzE5IEwxNjIuMTQwNiAyMTkuMjM0NCBMMTQzLjU3ODEgMjE5LjIzNDQgTDEzNC4wMTU2IDE4OC41NzgxIEw4Ny42MDk0IDE4OC41NzgxIEw3OC4wNDY5IDIxOS4yMzQ0IEw1OS40ODQ0IDIxOS4yMzQ0IEw5OS45ODQ0IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZozJcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTg2LjM0MzggMjAzLjA2MjUgTDE0NS45Njg4IDIwMy4wNjI1IEwxNDUuOTY4OCAyMTkuMDkzOCBMNjEuODc1IDIxOS4wOTM4IEw2MS44NzUgMjAzLjYyNSBRNjYuNjU2MiAxOTkuMjY1NiA3NS41MTU2IDE5MS4zOTA2IFExMjMuODkwNiAxNDguNSAxMjMuODkwNiAxMzUuMjgxMiBRMTIzLjg5MDYgMTI2IDExNi41NzgxIDEyMC4zMDQ3IFExMDkuMjY1NiAxMTQuNjA5NCA5Ny4zMTI1IDExNC42MDk0IFE5MCAxMTQuNjA5NCA4MS40MjE5IDExNy4wNzAzIFE3Mi44NDM4IDExOS41MzEyIDYyLjcxODggMTI0LjQ1MzEgTDYyLjcxODggMTA3LjE1NjIgUTczLjU0NjkgMTAzLjIxODggODIuODk4NCAxMDEuMjUgUTkyLjI1IDk5LjI4MTIgMTAwLjI2NTYgOTkuMjgxMiBRMTIwLjY1NjIgOTkuMjgxMiAxMzIuODkwNiAxMDguNTYyNSBRMTQ1LjEyNSAxMTcuODQzOCAxNDUuMTI1IDEzMy4wMzEyIFExNDUuMTI1IDE1Mi41NzgxIDk4LjU3ODEgMTkyLjUxNTYgUTkwLjcwMzEgMTk5LjI2NTYgODYuMzQzOCAyMDMuMDYyNSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaMzXFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk0xMjEuNzgxMiAxNTUuNTMxMiBRMTM0LjcxODggMTU4LjA2MjUgMTQxLjgyMDMgMTY1LjcyNjYgUTE0OC45MjE5IDE3My4zOTA2IDE0OC45MjE5IDE4NC45MjE5IFExNDguOTIxOSAyMDIuMzU5NCAxMzUuNTYyNSAyMTEuNzgxMiBRMTIyLjIwMzEgMjIxLjIwMzEgOTcuMzEyNSAyMjEuMjAzMSBRODkuMjk2OSAyMjEuMjAzMSA4MC41MDc4IDIxOS43MjY2IFE3MS43MTg4IDIxOC4yNSA2MS44NzUgMjE1LjQzNzUgTDYxLjg3NSAxOTguNDIxOSBRNjkuMTg3NSAyMDIuMjE4OCA3Ny41NTQ3IDIwNC4wNDY5IFE4NS45MjE5IDIwNS44NzUgOTUuMzQzOCAyMDUuODc1IFExMTAuNjcxOSAyMDUuODc1IDExOS4xMDk0IDIwMC4zMjAzIFExMjcuNTQ2OSAxOTQuNzY1NiAxMjcuNTQ2OSAxODQuOTIxOSBRMTI3LjU0NjkgMTc0LjUxNTYgMTE5Ljc0MjIgMTY5LjE3MTkgUTExMS45Mzc1IDE2My44MjgxIDk2Ljc1IDE2My44MjgxIEw4NC42NTYyIDE2My44MjgxIEw4NC42NTYyIDE0OC42NDA2IEw5Ny44NzUgMTQ4LjY0MDYgUTExMS4wOTM4IDE0OC42NDA2IDExNy45MTQxIDE0NC4yMTA5IFExMjQuNzM0NCAxMzkuNzgxMiAxMjQuNzM0NCAxMzEuMzQzOCBRMTI0LjczNDQgMTIzLjE4NzUgMTE3LjcwMzEgMTE4Ljg5ODQgUTExMC42NzE5IDExNC42MDk0IDk3LjMxMjUgMTE0LjYwOTQgUTkxLjY4NzUgMTE0LjYwOTQgODQuNTE1NiAxMTUuODc1IFE3Ny4zNDM4IDExNy4xNDA2IDY1Ljk1MzEgMTIwLjM3NSBMNjUuOTUzMSAxMDQuMjAzMSBRNzYuMjE4OCAxMDEuODEyNSA4NS4yMTg4IDEwMC41NDY5IFE5NC4yMTg4IDk5LjI4MTIgMTAxLjk1MzEgOTkuMjgxMiBRMTIyLjIwMzEgOTkuMjgxMiAxMzQuMDg1OSAxMDcuNTc4MSBRMTQ1Ljk2ODggMTE1Ljg3NSAxNDUuOTY4OCAxMjkuNzk2OSBRMTQ1Ljk2ODggMTM5LjUgMTM5LjY0MDYgMTQ2LjI1IFExMzMuMzEyNSAxNTMgMTIxLjc4MTIgMTU1LjUzMTIgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjNFxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTIwLjA5MzggMTE4LjY4NzUgTDc2LjY0MDYgMTc3LjYwOTQgTDEyMC4wOTM4IDE3Ny42MDk0IEwxMjAuMDkzOCAxMTguNjg3NSBaTTExNyAxMDEuNjcxOSBMMTQwLjM0MzggMTAxLjY3MTkgTDE0MC4zNDM4IDE3Ny42MDk0IEwxNTkuMzI4MSAxNzcuNjA5NCBMMTU5LjMyODEgMTkyLjkzNzUgTDE0MC4zNDM4IDE5Mi45Mzc1IEwxNDAuMzQzOCAyMTkuMDkzOCBMMTIwLjA5MzggMjE5LjA5MzggTDEyMC4wOTM4IDE5Mi45Mzc1IEw2MS44NzUgMTkyLjkzNzUgTDYxLjg3NSAxNzUuOTIxOSBMMTE3IDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZozVcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTY3LjUgMTAxLjY3MTkgTDEzOS4yMTg4IDEwMS42NzE5IEwxMzkuMjE4OCAxMTUuMDMxMiBMODQuMjM0NCAxMTUuMDMxMiBMODQuMjM0NCAxNDMuNzE4OCBRODguMTcxOSAxNDIuNDUzMSA5Mi4yNSAxNDEuODkwNiBROTYuMTg3NSAxNDEuMzI4MSAxMDAuMTI1IDE0MS4zMjgxIFExMjIuNzY1NiAxNDEuMzI4MSAxMzUuOTg0NCAxNTIuMTU2MiBRMTQ5LjIwMzEgMTYyLjg0MzggMTQ5LjIwMzEgMTgxLjI2NTYgUTE0OS4yMDMxIDIwMC4yNSAxMzUuNTYyNSAyMTAuNzk2OSBRMTIyLjA2MjUgMjIxLjIwMzEgOTcuMzEyNSAyMjEuMjAzMSBRODguODc1IDIyMS4yMDMxIDgwLjAxNTYgMjE5LjkzNzUgUTcxLjE1NjIgMjE4LjY3MTkgNjEuODc1IDIxNi4xNDA2IEw2MS44NzUgMjAwLjI1IFE2OS44OTA2IDIwNC4wNDY5IDc4LjYwOTQgMjA2LjAxNTYgUTg3LjMyODEgMjA3Ljg0MzggOTcuMDMxMiAyMDcuODQzOCBRMTEyLjY0MDYgMjA3Ljg0MzggMTIxLjc4MTIgMjAwLjY3MTkgUTEzMC45MjE5IDE5My41IDEzMC45MjE5IDE4MS4yNjU2IFExMzAuOTIxOSAxNjkuMDMxMiAxMjEuNzgxMiAxNjEuODU5NCBRMTEyLjY0MDYgMTU0LjY4NzUgOTcuMDMxMiAxNTQuNjg3NSBRODkuNzE4OCAxNTQuNjg3NSA4Mi40MDYyIDE1Ni4wOTM4IFE3NS4wOTM4IDE1Ny41IDY3LjUgMTYwLjQ1MzEgTDY3LjUgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjNlxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTEwLjEwOTQgMTUzLjcwMzEgUTk3LjczNDQgMTUzLjcwMzEgOTAuNTYyNSAxNjEuMDE1NiBRODMuMzkwNiAxNjguNDY4OCA4My4zOTA2IDE4MS4yNjU2IFE4My4zOTA2IDE5My45MjE5IDkwLjU2MjUgMjAxLjIzNDQgUTk3LjczNDQgMjA4LjY4NzUgMTEwLjEwOTQgMjA4LjY4NzUgUTEyMi4zNDM4IDIwOC42ODc1IDEyOS41MTU2IDIwMS4yMzQ0IFExMzYuNjg3NSAxOTMuOTIxOSAxMzYuNjg3NSAxODEuMjY1NiBRMTM2LjY4NzUgMTY4LjQ2ODggMTI5LjUxNTYgMTYxLjAxNTYgUTEyMi4zNDM4IDE1My43MDMxIDExMC4xMDk0IDE1My43MDMxIFpNMTQ2LjM5MDYgMTAzLjkyMTkgTDE0Ni4zOTA2IDExOC40MDYyIFExMzkuNSAxMTUuNTkzOCAxMzIuNDY4OCAxMTQuMTg3NSBRMTI1LjQzNzUgMTEyLjY0MDYgMTE4LjU0NjkgMTEyLjY0MDYgUTEwMC41NDY5IDExMi42NDA2IDkwLjk4NDQgMTIzLjE4NzUgUTgxLjQyMTkgMTMzLjg3NSA4MC4wMTU2IDE1NS4zOTA2IFE4NS4zNTk0IDE0OC41IDkzLjM3NSAxNDQuODQzOCBRMTAxLjUzMTIgMTQxLjE4NzUgMTExLjA5MzggMTQxLjE4NzUgUTEzMS40ODQ0IDE0MS4xODc1IDE0My4yOTY5IDE1MS44NzUgUTE1NS4xMDk0IDE2Mi43MDMxIDE1NS4xMDk0IDE4MS4yNjU2IFExNTUuMTA5NCAxOTkuMTI1IDE0Mi43MzQ0IDIxMC4yMzQ0IFExMzAuNSAyMjEuMjAzMSAxMTAuMTA5NCAyMjEuMjAzMSBRODYuNjI1IDIyMS4yMDMxIDc0LjI1IDIwNS41OTM4IFE2MS44NzUgMTg5Ljk4NDQgNjEuODc1IDE2MC4xNzE5IFE2MS44NzUgMTMyLjMyODEgNzcuMDYyNSAxMTUuODc1IFE5Mi4yNSA5OS4yODEyIDExNy44NDM4IDk5LjI4MTIgUTEyNC43MzQ0IDk5LjI4MTIgMTMxLjc2NTYgMTAwLjQwNjIgUTEzOC43OTY5IDEwMS42NzE5IDE0Ni4zOTA2IDEwMy45MjE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZozdcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTYxLjg3NSAxMDEuNjcxOSBMMTQ4LjY0MDYgMTAxLjY3MTkgTDE0OC42NDA2IDEwOC40MjE5IEw5OS43MDMxIDIxOS4wOTM4IEw4MC41NzgxIDIxOS4wOTM4IEwxMjYuNzAzMSAxMTUuMDMxMiBMNjEuODc1IDExNS4wMzEyIEw2MS44NzUgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjOFxcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNMTA4LjI4MTIgMTYzLjEyNSBROTUuMjAzMSAxNjMuMTI1IDg3Ljc1IDE2OS4zMTI1IFE4MC4yOTY5IDE3NS4zNTk0IDgwLjI5NjkgMTg1LjkwNjIgUTgwLjI5NjkgMTk2LjU5MzggODcuNzUgMjAyLjY0MDYgUTk1LjIwMzEgMjA4LjY4NzUgMTA4LjI4MTIgMjA4LjY4NzUgUTEyMS4yMTg4IDIwOC42ODc1IDEyOC44MTI1IDIwMi41IFExMzYuMjY1NiAxOTYuNDUzMSAxMzYuMjY1NiAxODUuOTA2MiBRMTM2LjI2NTYgMTc1LjM1OTQgMTI4LjgxMjUgMTY5LjMxMjUgUTEyMS4zNTk0IDE2My4xMjUgMTA4LjI4MTIgMTYzLjEyNSBaTTkwIDE1Ni4yMzQ0IFE3OC4xODc1IDE1My43MDMxIDcxLjcxODggMTQ2LjgxMjUgUTY1LjEwOTQgMTM5Ljc4MTIgNjUuMTA5NCAxMjkuNjU2MiBRNjUuMTA5NCAxMTUuNTkzOCA3Ni42NDA2IDEwNy40Mzc1IFE4OC4xNzE5IDk5LjI4MTIgMTA4LjI4MTIgOTkuMjgxMiBRMTI4LjM5MDYgOTkuMjgxMiAxMzkuOTIxOSAxMDcuNDM3NSBRMTUxLjMxMjUgMTE1LjU5MzggMTUxLjMxMjUgMTI5LjY1NjIgUTE1MS4zMTI1IDE0MC4wNjI1IDE0NC44NDM4IDE0Ni44MTI1IFExMzguMjM0NCAxNTMuNzAzMSAxMjYuNTYyNSAxNTYuMjM0NCBRMTM5LjIxODggMTU4Ljc2NTYgMTQ3LjA5MzggMTY2LjkyMTkgUTE1NC41NDY5IDE3NC42NTYyIDE1NC41NDY5IDE4NS45MDYyIFExNTQuNTQ2OSAyMDIuOTIxOSAxNDIuNTkzOCAyMTIuMDYyNSBRMTMwLjUgMjIxLjIwMzEgMTA4LjI4MTIgMjIxLjIwMzEgUTg1LjkyMTkgMjIxLjIwMzEgNzMuOTY4OCAyMTIuMDYyNSBRNjEuODc1IDIwMi45MjE5IDYxLjg3NSAxODUuOTA2MiBRNjEuODc1IDE3NC45Mzc1IDY5LjMyODEgMTY2LjkyMTkgUTc2LjkyMTkgMTU5LjA0NjkgOTAgMTU2LjIzNDQgWk04My4yNSAxMzEuMjAzMSBRODMuMjUgMTQwLjA2MjUgODkuODU5NCAxNDUuNDA2MiBROTYuMzI4MSAxNTAuNjA5NCAxMDguMjgxMiAxNTAuNjA5NCBRMTE5LjY3MTkgMTUwLjYwOTQgMTI2LjU2MjUgMTQ1LjQwNjIgUTEzMy4zMTI1IDE0MC4zNDM4IDEzMy4zMTI1IDEzMS4yMDMxIFExMzMuMzEyNSAxMjIuMzQzOCAxMjYuNTYyNSAxMTcgUTExOS45NTMxIDExMS43OTY5IDEwOC4yODEyIDExMS43OTY5IFE5Ni42MDk0IDExMS43OTY5IDg5Ljg1OTQgMTE3IFE4My4yNSAxMjIuMDYyNSA4My4yNSAxMzEuMjAzMSBaXFxcIi8+PC9zdmc+PC90ZW1wbGF0ZT5cXG4gICAgPHRlbXBsYXRlIGlkPVxcXCLimaM5XFxcIj48c3ZnIHZpZXdCb3g9XFxcIjI0IDYyIDI0NyAzNDNcXFwiPjxwYXRoIGQ9XFxcIk0xNTUuOTUzMSAzNzAuNjg3NSBRMTYzLjk2ODggMzYwIDE2My45Njg4IDMyNC43MDMxIFExNTMuODQzOCAzNTIuMTI1IDEyOS45Mzc1IDM1MS43MDMxIFExMjIuNDg0NCAzNTEuNTYyNSAxMTguOTY4OCAzNDkuODc1IFE5OC40Mzc1IDM0MC40NTMxIDk4LjQzNzUgMzE5LjUgUTk4LjQzNzUgMzEyLjE4NzUgMTAwLjY4NzUgMzA3LjEyNSBRMTA5LjU0NjkgMjg3LjI5NjkgMTMzLjU5MzggMjg3LjI5NjkgUTE0NC4xNDA2IDI4Ny4yOTY5IDE1MS4wMzEyIDI4OS45Njg4IFExMzMuNTkzOCAyNzEuNjg3NSAxMzMuNTkzOCAyNTYuNzgxMiBRMTMzLjU5MzggMjIzLjg3NSAxNjYuNzgxMiAyMjMuODc1IFExOTkuOTY4OCAyMjMuODc1IDE5OS45Njg4IDI1Ni43ODEyIFExOTkuOTY4OCAyNzEuNjg3NSAxODIuNTMxMiAyODkuOTY4OCBRMTg5LjQyMTkgMjg3LjI5NjkgMTk5Ljk2ODggMjg3LjI5NjkgUTIyNC4wMTU2IDI4Ny4yOTY5IDIzMi44NzUgMzA3LjEyNSBRMjM1LjEyNSAzMTIuMTg3NSAyMzUuMTI1IDMxOS41IFEyMzUuMTI1IDM0MC4wMzEyIDIxNC41OTM4IDM0OS44NzUgUTIxMS4wNzgxIDM1MS41NjI1IDIwMy42MjUgMzUxLjcwMzEgUTE3OS44NTk0IDM1Mi40MDYyIDE2OS41OTM4IDMyNC43MDMxIFExNjkuNTkzOCAzNjAgMTc3LjYwOTQgMzcwLjY4NzUgTDE1NS45NTMxIDM3MC42ODc1IFpNNjEuODc1IDg0Ljc5NjkgUTQ1IDg0Ljc5NjkgNDUgMTAxLjY3MTkgTDQ1IDM3MC42ODc1IFE0NSAzODcuNTYyNSA2MS44NzUgMzg3LjU2MjUgTDIzMi43MzQ0IDM4Ny41NjI1IFEyNDkuNjA5NCAzODcuNTYyNSAyNDkuNjA5NCAzNzAuNjg3NSBMMjQ5LjYwOTQgMTAxLjY3MTkgUTI0OS42MDk0IDg0Ljc5NjkgMjMyLjczNDQgODQuNzk2OSBMNjEuODc1IDg0Ljc5NjkgWk02MS44NzUgNjcuOTIxOSBMMjMyLjczNDQgNjcuOTIxOSBRMjY2LjQ4NDQgNjcuOTIxOSAyNjYuNDg0NCAxMDEuNjcxOSBMMjY2LjQ4NDQgMzcwLjY4NzUgUTI2Ni40ODQ0IDQwNC40Mzc1IDIzMi43MzQ0IDQwNC40Mzc1IEw2MS44NzUgNDA0LjQzNzUgUTI4LjEyNSA0MDQuNDM3NSAyOC4xMjUgMzcwLjY4NzUgTDI4LjEyNSAxMDEuNjcxOSBRMjguMTI1IDY3LjkyMTkgNjEuODc1IDY3LjkyMTkgWk03MC41OTM4IDIxNi41NjI1IEw3MC41OTM4IDIwMi4wNzgxIFE3Ny40ODQ0IDIwNC44OTA2IDg0LjUxNTYgMjA2LjQzNzUgUTkxLjU0NjkgMjA3Ljg0MzggOTguMjk2OSAyMDcuODQzOCBRMTE2LjQzNzUgMjA3Ljg0MzggMTI2IDE5Ny4yOTY5IFExMzUuNDIxOSAxODYuNzUgMTM2LjgyODEgMTY1LjA5MzggUTEzMS45MDYyIDE3MS43MDMxIDEyMy40Njg4IDE3NS41IFExMTUuNDUzMSAxNzkuMTU2MiAxMDUuNzUgMTc5LjE1NjIgUTg1LjUgMTc5LjE1NjIgNzMuNjg3NSAxNjguNDY4OCBRNjEuODc1IDE1Ny43ODEyIDYxLjg3NSAxMzkuMjE4OCBRNjEuODc1IDEyMS4wNzgxIDc0LjEwOTQgMTEwLjI1IFE4Ni40ODQ0IDk5LjI4MTIgMTA2Ljg3NSA5OS4yODEyIFExMzAuMzU5NCA5OS4yODEyIDE0Mi41OTM4IDExNC44OTA2IFExNTQuOTY4OCAxMzAuNSAxNTQuOTY4OCAxNjAuMzEyNSBRMTU0Ljk2ODggMTg4LjE1NjIgMTM5LjkyMTkgMjA0LjYwOTQgUTEyNC43MzQ0IDIyMS4yMDMxIDk5LjE0MDYgMjIxLjIwMzEgUTkyLjI1IDIyMS4yMDMxIDg1LjIxODggMjIwLjA3ODEgUTc4LjE4NzUgMjE4LjgxMjUgNzAuNTkzOCAyMTYuNTYyNSBaTTEwNi44NzUgMTY2Ljc4MTIgUTExOS4yNSAxNjYuNzgxMiAxMjYuNDIxOSAxNTkuNDY4OCBRMTMzLjU5MzggMTUyLjE1NjIgMTMzLjU5MzggMTM5LjIxODggUTEzMy41OTM4IDEyNi41NjI1IDEyNi40MjE5IDExOS4yNSBRMTE5LjI1IDExMS43OTY5IDEwNi44NzUgMTExLjc5NjkgUTk0LjkyMTkgMTExLjc5NjkgODcuNDY4OCAxMTkuMjUgUTgwLjE1NjIgMTI2LjU2MjUgODAuMTU2MiAxMzkuMjE4OCBRODAuMTU2MiAxNTIuMTU2MiA4Ny40Njg4IDE1OS40Njg4IFE5NC42NDA2IDE2Ni43ODEyIDEwNi44NzUgMTY2Ljc4MTIgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjMTBcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTE1OS4wNDY5IDExMS43OTY5IFExNDkuMDYyNSAxMTEuNzk2OSAxNDIuMDMxMiAxMjMuODkwNiBRMTM0Ljg1OTQgMTM1Ljk4NDQgMTM0Ljg1OTQgMTYwLjE3MTkgUTEzNC44NTk0IDE4NC41IDE0Mi4wMzEyIDE5Ni41OTM4IFExNDkuMDYyNSAyMDguNjg3NSAxNTkuMDQ2OSAyMDguNjg3NSBRMTY5LjAzMTIgMjA4LjY4NzUgMTc2LjA2MjUgMTk2LjU5MzggUTE4My4yMzQ0IDE4NC41IDE4My4yMzQ0IDE2MC4xNzE5IFExODMuMjM0NCAxMzUuOTg0NCAxNzYuMDYyNSAxMjMuODkwNiBRMTY5LjAzMTIgMTExLjc5NjkgMTU5LjA0NjkgMTExLjc5NjkgWk0xNTkuMDQ2OSA5OS4yODEyIFExNzcuNDY4OCA5OS4yODEyIDE4OS40MjE5IDExNC44OTA2IFEyMDEuMzc1IDEzMC41IDIwMS4zNzUgMTYwLjE3MTkgUTIwMS4zNzUgMTg5Ljk4NDQgMTg5LjQyMTkgMjA1LjU5MzggUTE3Ny40Njg4IDIyMS4yMDMxIDE1OS4wNDY5IDIyMS4yMDMxIFExMzYuMjY1NiAyMjEuMjAzMSAxMjYuNDIxOSAyMDUuNTkzOCBRMTE2LjU3ODEgMTg5Ljk4NDQgMTE2LjU3ODEgMTYwLjE3MTkgUTExNi41NzgxIDEzMC41IDEyNi40MjE5IDExNC44OTA2IFExMzYuMjY1NiA5OS4yODEyIDE1OS4wNDY5IDk5LjI4MTIgWk04MC41NzgxIDIxOS4wOTM4IEw4MC41NzgxIDExNy43MDMxIEw2MS44NzUgMTIzLjQ2ODggTDYxLjg3NSAxMDcuMTU2MiBMODEuNTYyNSAxMDEuNjcxOSBMMTAwLjgyODEgMTAxLjY3MTkgTDEwMC44MjgxIDIxOS4wOTM4IEw4MC41NzgxIDIxOS4wOTM4IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZo0pcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTg5LjE1NjIgMTAxLjY3MTkgTDEwNy4wMTU2IDEwMS42NzE5IEwxMDcuMDE1NiAxNzguNzM0NCBRMTA3LjAxNTYgMTk5LjY4NzUgOTcuODc1IDIwOS41MzEyIFE4OC44NzUgMjE5LjIzNDQgNjguNzY1NiAyMTkuMjM0NCBMNjEuODc1IDIxOS4yMzQ0IEw2MS44NzUgMjA1LjczNDQgTDY3LjUgMjA1LjczNDQgUTc5LjMxMjUgMjA1LjczNDQgODQuMjM0NCAxOTkuODI4MSBRODkuMTU2MiAxOTMuOTIxOSA4OS4xNTYyIDE3OC43MzQ0IEw4OS4xNTYyIDEwMS42NzE5IFpcXFwiLz48L3N2Zz48L3RlbXBsYXRlPlxcbiAgICA8dGVtcGxhdGUgaWQ9XFxcIuKZo1FcXFwiPjxzdmcgdmlld0JveD1cXFwiMjQgNjIgMjQ3IDM0M1xcXCI+PHBhdGggZD1cXFwiTTE1NS45NTMxIDM3MC42ODc1IFExNjMuOTY4OCAzNjAgMTYzLjk2ODggMzI0LjcwMzEgUTE1My44NDM4IDM1Mi4xMjUgMTI5LjkzNzUgMzUxLjcwMzEgUTEyMi40ODQ0IDM1MS41NjI1IDExOC45Njg4IDM0OS44NzUgUTk4LjQzNzUgMzQwLjQ1MzEgOTguNDM3NSAzMTkuNSBROTguNDM3NSAzMTIuMTg3NSAxMDAuNjg3NSAzMDcuMTI1IFExMDkuNTQ2OSAyODcuMjk2OSAxMzMuNTkzOCAyODcuMjk2OSBRMTQ0LjE0MDYgMjg3LjI5NjkgMTUxLjAzMTIgMjg5Ljk2ODggUTEzMy41OTM4IDI3MS42ODc1IDEzMy41OTM4IDI1Ni43ODEyIFExMzMuNTkzOCAyMjMuODc1IDE2Ni43ODEyIDIyMy44NzUgUTE5OS45Njg4IDIyMy44NzUgMTk5Ljk2ODggMjU2Ljc4MTIgUTE5OS45Njg4IDI3MS42ODc1IDE4Mi41MzEyIDI4OS45Njg4IFExODkuNDIxOSAyODcuMjk2OSAxOTkuOTY4OCAyODcuMjk2OSBRMjI0LjAxNTYgMjg3LjI5NjkgMjMyLjg3NSAzMDcuMTI1IFEyMzUuMTI1IDMxMi4xODc1IDIzNS4xMjUgMzE5LjUgUTIzNS4xMjUgMzQwLjAzMTIgMjE0LjU5MzggMzQ5Ljg3NSBRMjExLjA3ODEgMzUxLjU2MjUgMjAzLjYyNSAzNTEuNzAzMSBRMTc5Ljg1OTQgMzUyLjQwNjIgMTY5LjU5MzggMzI0LjcwMzEgUTE2OS41OTM4IDM2MCAxNzcuNjA5NCAzNzAuNjg3NSBMMTU1Ljk1MzEgMzcwLjY4NzUgWk02MS44NzUgODQuNzk2OSBRNDUgODQuNzk2OSA0NSAxMDEuNjcxOSBMNDUgMzcwLjY4NzUgUTQ1IDM4Ny41NjI1IDYxLjg3NSAzODcuNTYyNSBMMjMyLjczNDQgMzg3LjU2MjUgUTI0OS42MDk0IDM4Ny41NjI1IDI0OS42MDk0IDM3MC42ODc1IEwyNDkuNjA5NCAxMDEuNjcxOSBRMjQ5LjYwOTQgODQuNzk2OSAyMzIuNzM0NCA4NC43OTY5IEw2MS44NzUgODQuNzk2OSBaTTYxLjg3NSA2Ny45MjE5IEwyMzIuNzM0NCA2Ny45MjE5IFEyNjYuNDg0NCA2Ny45MjE5IDI2Ni40ODQ0IDEwMS42NzE5IEwyNjYuNDg0NCAzNzAuNjg3NSBRMjY2LjQ4NDQgNDA0LjQzNzUgMjMyLjczNDQgNDA0LjQzNzUgTDYxLjg3NSA0MDQuNDM3NSBRMjguMTI1IDQwNC40Mzc1IDI4LjEyNSAzNzAuNjg3NSBMMjguMTI1IDEwMS42NzE5IFEyOC4xMjUgNjcuOTIxOSA2MS44NzUgNjcuOTIxOSBaTTEwNy4yOTY5IDIyMS4wNjI1IFExMDYuNzM0NCAyMjEuMDYyNSAxMDUuNTM5MSAyMjEuMTMyOCBRMTA0LjM0MzggMjIxLjIwMzEgMTAzLjY0MDYgMjIxLjIwMzEgUTgxLjQyMTkgMjIxLjIwMzEgNzAuNTIzNCAyMDYuMDg1OSBRNTkuNjI1IDE5MC45Njg4IDU5LjYyNSAxNjAuMzEyNSBRNTkuNjI1IDEyOS41MTU2IDcwLjU5MzggMTE0LjM5ODQgUTgxLjU2MjUgOTkuMjgxMiAxMDMuNzgxMiA5OS4yODEyIFExMjYuMTQwNiA5OS4yODEyIDEzNy4xMDk0IDExNC4zOTg0IFExNDguMDc4MSAxMjkuNTE1NiAxNDguMDc4MSAxNjAuMzEyNSBRMTQ4LjA3ODEgMTgzLjUxNTYgMTQyLjAzMTIgMTk3LjY0ODQgUTEzNS45ODQ0IDIxMS43ODEyIDEyMy42MDk0IDIxNy40MDYyIEwxNDEuMzI4MSAyMzIuMzEyNSBMMTI3Ljk2ODggMjQwLjE4NzUgTDEwNy4yOTY5IDIyMS4wNjI1IFpNMTI5LjM3NSAxNjAuMzEyNSBRMTI5LjM3NSAxMzQuNDM3NSAxMjMuMzk4NCAxMjMuMzI4MSBRMTE3LjQyMTkgMTEyLjIxODggMTAzLjc4MTIgMTEyLjIxODggUTkwLjI4MTIgMTEyLjIxODggODQuMzA0NyAxMjMuMzI4MSBRNzguMzI4MSAxMzQuNDM3NSA3OC4zMjgxIDE2MC4zMTI1IFE3OC4zMjgxIDE4Ni4xODc1IDg0LjMwNDcgMTk3LjI5NjkgUTkwLjI4MTIgMjA4LjQwNjIgMTAzLjc4MTIgMjA4LjQwNjIgUTExNy40MjE5IDIwOC40MDYyIDEyMy4zOTg0IDE5Ny4yOTY5IFExMjkuMzc1IDE4Ni4xODc1IDEyOS4zNzUgMTYwLjMxMjUgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuICAgIDx0ZW1wbGF0ZSBpZD1cXFwi4pmjS1xcXCI+PHN2ZyB2aWV3Qm94PVxcXCIyNCA2MiAyNDcgMzQzXFxcIj48cGF0aCBkPVxcXCJNMTU1Ljk1MzEgMzcwLjY4NzUgUTE2My45Njg4IDM2MCAxNjMuOTY4OCAzMjQuNzAzMSBRMTUzLjg0MzggMzUyLjEyNSAxMjkuOTM3NSAzNTEuNzAzMSBRMTIyLjQ4NDQgMzUxLjU2MjUgMTE4Ljk2ODggMzQ5Ljg3NSBROTguNDM3NSAzNDAuNDUzMSA5OC40Mzc1IDMxOS41IFE5OC40Mzc1IDMxMi4xODc1IDEwMC42ODc1IDMwNy4xMjUgUTEwOS41NDY5IDI4Ny4yOTY5IDEzMy41OTM4IDI4Ny4yOTY5IFExNDQuMTQwNiAyODcuMjk2OSAxNTEuMDMxMiAyODkuOTY4OCBRMTMzLjU5MzggMjcxLjY4NzUgMTMzLjU5MzggMjU2Ljc4MTIgUTEzMy41OTM4IDIyMy44NzUgMTY2Ljc4MTIgMjIzLjg3NSBRMTk5Ljk2ODggMjIzLjg3NSAxOTkuOTY4OCAyNTYuNzgxMiBRMTk5Ljk2ODggMjcxLjY4NzUgMTgyLjUzMTIgMjg5Ljk2ODggUTE4OS40MjE5IDI4Ny4yOTY5IDE5OS45Njg4IDI4Ny4yOTY5IFEyMjQuMDE1NiAyODcuMjk2OSAyMzIuODc1IDMwNy4xMjUgUTIzNS4xMjUgMzEyLjE4NzUgMjM1LjEyNSAzMTkuNSBRMjM1LjEyNSAzNDAuMDMxMiAyMTQuNTkzOCAzNDkuODc1IFEyMTEuMDc4MSAzNTEuNTYyNSAyMDMuNjI1IDM1MS43MDMxIFExNzkuODU5NCAzNTIuNDA2MiAxNjkuNTkzOCAzMjQuNzAzMSBRMTY5LjU5MzggMzYwIDE3Ny42MDk0IDM3MC42ODc1IEwxNTUuOTUzMSAzNzAuNjg3NSBaTTYxLjg3NSA4NC43OTY5IFE0NSA4NC43OTY5IDQ1IDEwMS42NzE5IEw0NSAzNzAuNjg3NSBRNDUgMzg3LjU2MjUgNjEuODc1IDM4Ny41NjI1IEwyMzIuNzM0NCAzODcuNTYyNSBRMjQ5LjYwOTQgMzg3LjU2MjUgMjQ5LjYwOTQgMzcwLjY4NzUgTDI0OS42MDk0IDEwMS42NzE5IFEyNDkuNjA5NCA4NC43OTY5IDIzMi43MzQ0IDg0Ljc5NjkgTDYxLjg3NSA4NC43OTY5IFpNNjEuODc1IDY3LjkyMTkgTDIzMi43MzQ0IDY3LjkyMTkgUTI2Ni40ODQ0IDY3LjkyMTkgMjY2LjQ4NDQgMTAxLjY3MTkgTDI2Ni40ODQ0IDM3MC42ODc1IFEyNjYuNDg0NCA0MDQuNDM3NSAyMzIuNzM0NCA0MDQuNDM3NSBMNjEuODc1IDQwNC40Mzc1IFEyOC4xMjUgNDA0LjQzNzUgMjguMTI1IDM3MC42ODc1IEwyOC4xMjUgMTAxLjY3MTkgUTI4LjEyNSA2Ny45MjE5IDYxLjg3NSA2Ny45MjE5IFpNNjEuODc1IDEwMS42NzE5IEw3OS43MzQ0IDEwMS42NzE5IEw3OS43MzQ0IDE1MS4zMTI1IEwxMzAuNjQwNiAxMDEuNjcxOSBMMTUzLjcwMzEgMTAxLjY3MTkgTDk2LjQ2ODggMTU2LjUxNTYgTDE1OC4zNDM4IDIxOS4yMzQ0IEwxMzQuODU5NCAyMTkuMjM0NCBMNzkuNzM0NCAxNjIuNTYyNSBMNzkuNzM0NCAyMTkuMjM0NCBMNjEuODc1IDIxOS4yMzQ0IEw2MS44NzUgMTAxLjY3MTkgWlxcXCIvPjwvc3ZnPjwvdGVtcGxhdGU+XFxuXFxuICAgIDx0YWJsZSBzdHlsZT1cXFwiYm9yZGVyLXdpZHRoOjFweFxcXCI+XFxuICAgICAgICA8dHIgd2lkdGg9XFxcIjEwMCVcXFwiIGhlaWdodD1cXFwiMTBweFxcXCIgc3R5bGU9XFxcInZpc2liaWxpdHk6dmlzaWJsZVxcXCJ9PlxcbiAgICAgICAgICAgIDx0ZCB3aWR0aD1cXFwiNTBweFxcXCI+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6Ymx1ZVxcXCI+JmJsb2NrOzwvc3Bhbj48L3BsYXlpbmctY2FyZDwvdGQ+XFxuICAgICAgICA8L3RyPlxcbiAgICAgICAgPHRyIHdpZHRoPVxcXCIxMDAlXFxcIj5cXG4gICAgICAgICAgICA8dGQgd2lkdGg9XFxcIjUwcHhcXFwiPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzO0E8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQgd2lkdGg9XFxcIjUwcHhcXFwiPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzOzI8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQgd2lkdGg9XFxcIjUwcHhcXFwiPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzOzM8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQgd2lkdGg9XFxcIjUwcHhcXFwiPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzOzQ8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQgd2lkdGg9XFxcIjUwcHhcXFwiPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzOzU8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQgd2lkdGg9XFxcIjUwcHhcXFwiPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzOzY8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQgd2lkdGg9XFxcIjUwcHhcXFwiPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzOzc8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQgd2lkdGg9XFxcIjUwcHhcXFwiPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzOzg8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQgd2lkdGg9XFxcIjUwcHhcXFwiPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzOzk8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQgd2lkdGg9XFxcIjUwcHhcXFwiPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mc3BhZGVzOzEwPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlcztKPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlcztRPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkIHdpZHRoPVxcXCI1MHB4XFxcIj48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JnNwYWRlcztLPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICA8L3RyPlxcbiAgICAgICAgPHRyPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZoZWFydHM7QTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZoZWFydHM7Mjwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZoZWFydHM7Mzwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZoZWFydHM7NDwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZoZWFydHM7NTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZoZWFydHM7Njwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZoZWFydHM7Nzwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZoZWFydHM7ODwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZoZWFydHM7OTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZoZWFydHM7MTA8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzO0o8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzO1E8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4maGVhcnRzO0s8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgIDwvdHI+XFxuICAgICAgICA8dHI+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zO0E8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7Mjwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczszPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zOzQ8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7NTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczs2PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zOzc8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7ODwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtczs5PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zOzEwPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOnJlZFxcXCI+JmRpYW1zO0o8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6cmVkXFxcIj4mZGlhbXM7UTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpyZWRcXFwiPiZkaWFtcztLPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICA8L3RyPlxcbiAgICAgICAgPHRyPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzO0E8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczsyPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7Mzwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzQ8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczs1PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7Njwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzc8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHViczs4PC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7OTwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzOzEwPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPjxwbGF5aW5nLWNhcmQ+PHNwYW4gc3R5bGU9XFxcImNvbG9yOmJsYWNrXFxcIj4mY2x1YnM7Sjwvc3Bhbj48L3BsYXlpbmctY2FyZD48L3RkPlxcbiAgICAgICAgICAgIDx0ZD48cGxheWluZy1jYXJkPjxzcGFuIHN0eWxlPVxcXCJjb2xvcjpibGFja1xcXCI+JmNsdWJzO1E8L3NwYW4+PC9wbGF5aW5nLWNhcmQ+PC90ZD5cXG4gICAgICAgICAgICA8dGQ+PHBsYXlpbmctY2FyZD48c3BhbiBzdHlsZT1cXFwiY29sb3I6YmxhY2tcXFwiPiZjbHVicztLPC9zcGFuPjwvcGxheWluZy1jYXJkPjwvdGQ+XFxuICAgICAgICA8L3RyPlxcbiAgICA8L3RhYmxlPlxcbjwvZGl2PlxcblwiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3Jhdy1sb2FkZXIhLi92aWV3cy9wYXJ0aWFscy9mcmVzaGRlY2suaHRtbFxuLy8gbW9kdWxlIGlkID0gMjRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxwPmluZGV4PC9wPlxcblwiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3Jhdy1sb2FkZXIhLi92aWV3cy9wYXJ0aWFscy9pbmRleC5odG1sXG4vLyBtb2R1bGUgaWQgPSAyNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGZvcm1cXG4gICAgaWQ9XFxcIm1lc3NhZ2VfZm9ybVxcXCJcXG4gICAgb25zdWJtaXQ9XFxcIlxcbiAgICAgdmFyIGd1biA9IEd1bihsb2NhdGlvbi5vcmlnaW4gKyAnL2d1bicpO1xcbiAgICAgb3BlbnBncC5jb25maWcuYWVhZF9wcm90ZWN0ID0gdHJ1ZVxcbiAgICAgb3BlbnBncC5pbml0V29ya2VyKHsgcGF0aDonL2pzL29wZW5wZ3Aud29ya2VyLmpzJyB9KVxcbiAgICAgaWYgKCFtZXNzYWdlX3R4dC52YWx1ZSkge1xcbiAgICAgICAgICByZXR1cm4gZmFsc2VcXG4gICAgIH1cXG4gICAgIHdpbmRvdy5oYW5kbGVQb3N0KG1lc3NhZ2VfdHh0LnZhbHVlKShvcGVucGdwKSh3aW5kb3cubG9jYWxTdG9yYWdlKSgnaG90bGlwcycpLnRoZW4ocmVzdWx0ID0+IHtpZiAocmVzdWx0KSB7Y29uc29sZS5sb2cocmVzdWx0KX19KS5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcihlcnIpKTtkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVzc2FnZV90eHQnKS52YWx1ZSA9ICcnOyByZXR1cm4gZmFsc2VcXFwiXFxuICAgIG1ldGhvZD1cXFwicG9zdFxcXCJcXG4gICAgYWN0aW9uPVxcXCIvbWVzc2FnZVxcXCI+XFxuICAgIDxpbnB1dCBpZD1cXFwibWVzc2FnZV9mb3JtX2lucHV0XFxcIlxcbiAgICAgICAgdHlwZT1cXFwic3VibWl0XFxcIlxcbiAgICAgICAgdmFsdWU9XFxcInBvc3QgbWVzc2FnZVxcXCJcXG4gICAgICAgIGZvcm09XFxcIm1lc3NhZ2VfZm9ybVxcXCJcXG4gICAgICAgID5cXG48L2Zvcm0+XFxuPHRleHRhcmVhXFxuICAgIGlkPVxcXCJtZXNzYWdlX3R4dFxcXCJcXG4gICAgbmFtZT1cXFwibWVzc2FnZV90eHRcXFwiXFxuICAgIGZvcm09XFxcIm1lc3NhZ2VfZm9ybVxcXCJcXG4gICAgcm93cz01MVxcbiAgICBjb2xzPTcwXFxuICAgIHBsYWNlaG9sZGVyPVxcXCJwYXN0ZSBwbGFpbnRleHQgbWVzc2FnZSwgcHVibGljIGtleSwgb3IgcHJpdmF0ZSBrZXlcXFwiXFxuICAgIHN0eWxlPVxcXCJmb250LWZhbWlseTpNZW5sbyxDb25zb2xhcyxNb25hY28sTHVjaWRhIENvbnNvbGUsTGliZXJhdGlvbiBNb25vLERlamFWdSBTYW5zIE1vbm8sQml0c3RyZWFtIFZlcmEgU2FucyBNb25vLENvdXJpZXIgTmV3LCBtb25vc3BhY2U7XFxcIlxcbiAgICA+XFxuPC90ZXh0YXJlYT5cXG5cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9yYXctbG9hZGVyIS4vdmlld3MvcGFydGlhbHMvbWVzc2FnZV9mb3JtLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDI2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gXCI8c3BhbiBjbGFzcz1cXFwicm9hZG1hcFxcXCI+XFxuICAgIDxkZXRhaWxzPlxcbiAgICA8c3VtbWFyeT5yb2FkIG1hcDwvc3VtbWFyeT5cXG4gICAgPHVsPlxcbiAgICAgICAgPGxpPjxkZWw+PGEgaHJlZj1cXFwiaHR0cHM6Ly9naXRodWIuY29tL2NvbGVhbGJvbi9ob3RsaXBzL2NvbW1pdC8zYjcwOTgxY2JlNGUxMWUxNDAwYWU4ZTk0OGEwNmUzNTgyZDljMmQyXFxcIj5JbnN0YWxsIG5vZGUva29hL3dlYnBhY2s8L2E+PC9kZWw+PC9saT5cXG4gICAgICAgIDxsaT48ZGVsPjxhIGhyZWY9XFxcImh0dHBzOi8vZ2l0aHViLmNvbS9jb2xlYWxib24vaG90bGlwcy9pc3N1ZXMvMlxcXCI+SW5zdGFsbCBndW5kYjwvYT48L2RlbD48L2xpPlxcbiAgICAgICAgPGxpPjxkZWw+bWFrZSBhIDxhIGhyZWY9XFxcIiMvZGVja1xcXCI+ZGVjazwvYT4gb2YgY2FyZHM8L2RlbD48L2xpPlxcbiAgICAgICAgPGxpPjxkZWw+QWxpY2UgYW5kIEJvYiA8YSBocmVmPVxcXCIjL21lc3NhZ2VcXFwiPmlkZW50aWZ5PC9hPjwvZGVsPjwvbGk+XFxuICAgICAgICA8bGk+PGRlbD5BbGljZSBhbmQgQm9iIDxhIGhyZWY9XFxcIiMvY29ubmVjdFxcXCI+Y29ubmVjdDwvYT48L2RlbD48L2xpPlxcbiAgICAgICAgPGxpPjxkZWw+QWxpY2UgYW5kIEJvYiA8YSBocmVmPVxcXCJodHRwczovL2dpdGh1Yi5jb20vY29sZWFsYm9uL3N0cmVhbWxpbmVyXFxcIj5leGNoYW5nZSBrZXlzPC9hPjwvZGVsPzwvbGk+XFxuICAgICAgICA8bGk+QWxpY2UgYW5kIEJvYiBhZ3JlZSBvbiBhIGNlcnRhaW4gXFxcIjxhIGhyZWY9XFxcIiMvZGVja1xcXCI+ZGVjazwvYT5cXFwiIG9mIGNhcmRzLiBJbiBwcmFjdGljZSwgdGhpcyBtZWFucyB0aGV5IGFncmVlIG9uIGEgc2V0IG9mIG51bWJlcnMgb3Igb3RoZXIgZGF0YSBzdWNoIHRoYXQgZWFjaCBlbGVtZW50IG9mIHRoZSBzZXQgcmVwcmVzZW50cyBhIGNhcmQuPC9saT5cXG4gICAgICAgIDxsaT5BbGljZSBwaWNrcyBhbiBlbmNyeXB0aW9uIGtleSBBIGFuZCB1c2VzIHRoaXMgdG8gZW5jcnlwdCBlYWNoIGNhcmQgb2YgdGhlIGRlY2suPC9saT5cXG4gICAgICAgIDxsaT5BbGljZSA8YSBocmVmPVxcXCJodHRwczovL2Jvc3Qub2Nrcy5vcmcvbWlrZS9zaHVmZmxlL1xcXCI+c2h1ZmZsZXM8L2E+IHRoZSBjYXJkcy48L2xpPlxcbiAgICAgICAgPGxpPkFsaWNlIHBhc3NlcyB0aGUgZW5jcnlwdGVkIGFuZCBzaHVmZmxlZCBkZWNrIHRvIEJvYi4gV2l0aCB0aGUgZW5jcnlwdGlvbiBpbiBwbGFjZSwgQm9iIGNhbm5vdCBrbm93IHdoaWNoIGNhcmQgaXMgd2hpY2guPC9saT5cXG4gICAgICAgIDxsaT5Cb2Igc2h1ZmZsZXMgdGhlIGRlY2suPC9saT5cXG4gICAgICAgIDxsaT5Cb2IgcGFzc2VzIHRoZSBkb3VibGUgZW5jcnlwdGVkIGFuZCBzaHVmZmxlZCBkZWNrIGJhY2sgdG8gQWxpY2UuPC9saT5cXG4gICAgICAgIDxsaT5BbGljZSBkZWNyeXB0cyBlYWNoIGNhcmQgdXNpbmcgaGVyIGtleSBBLiBUaGlzIHN0aWxsIGxlYXZlcyBCb2IncyBlbmNyeXB0aW9uIGluIHBsYWNlIHRob3VnaCBzbyBzaGUgY2Fubm90IGtub3cgd2hpY2ggY2FyZCBpcyB3aGljaC48L2xpPlxcbiAgICAgICAgPGxpPkFsaWNlIHBpY2tzIG9uZSBlbmNyeXB0aW9uIGtleSBmb3IgZWFjaCBjYXJkIChBMSwgQTIsIGV0Yy4pIGFuZCBlbmNyeXB0cyB0aGVtIGluZGl2aWR1YWxseS48L2xpPlxcbiAgICAgICAgPGxpPkFsaWNlIHBhc3NlcyB0aGUgZGVjayB0byBCb2IuPC9saT5cXG4gICAgICAgIDxsaT5Cb2IgZGVjcnlwdHMgZWFjaCBjYXJkIHVzaW5nIGhpcyBrZXkgQi4gVGhpcyBzdGlsbCBsZWF2ZXMgQWxpY2UncyBpbmRpdmlkdWFsIGVuY3J5cHRpb24gaW4gcGxhY2UgdGhvdWdoIHNvIGhlIGNhbm5vdCBrbm93IHdoaWNoIGNhcmQgaXMgd2hpY2guPC9saT5cXG4gICAgICAgIDxsaT5Cb2IgcGlja3Mgb25lIGVuY3J5cHRpb24ga2V5IGZvciBlYWNoIGNhcmQgKEIxLCBCMiwgZXRjLikgYW5kIGVuY3J5cHRzIHRoZW0gaW5kaXZpZHVhbGx5LjwvbGk+XFxuICAgICAgICA8bGk+Qm9iIHBhc3NlcyB0aGUgZGVjayBiYWNrIHRvIEFsaWNlLjwvbGk+XFxuICAgICAgICA8bGk+QWxpY2UgcHVibGlzaGVzIHRoZSBkZWNrIGZvciBldmVyeW9uZSBwbGF5aW5nIChpbiB0aGlzIGNhc2Ugb25seSBBbGljZSBhbmQgQm9iLCBzZWUgYmVsb3cgb24gZXhwYW5zaW9uIHRob3VnaCkuPC9saT5cXG4gICAgPC91bD5cXG48L2RldGFpbHM+XFxuPC9zcGFuPlxcblwiXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3Jhdy1sb2FkZXIhLi92aWV3cy9wYXJ0aWFscy9yb2FkbWFwLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDI3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=