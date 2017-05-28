'use strict';
/*eslint-env node, mocha, es6 */

process.env.NODE_ENV = 'test';

const fetch = require('node-fetch');
const cheerio = require('cheerio');
const assert = require('chai').assert;
// const jsdom = require('mocha-jsdom');
// jsdom();

// var Gun = require('gun');
// var gun = Gun({
// 	file: 'guntest.data.json'
// });

// require("babel-core/register")({
//     "presets": [
//         "es2015",
//         "stage-0"
//     ]
// });
// require("babel-polyfill");

// var Gun = require('gun');
// var gun = Gun({
// 	file: 'gun.data.json'
// });

//process.env.NODE_ENV = 'test';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let server = require('../../bin/www');
const http = require('http');
if (!server) server = http.createServer();
//gun.wsp(server);

suite('landing page', function() {
    test('check server pulse response ok', function() {
        return fetch('http://127.0.0.1:3000')
        .then(function(res) {
            assert.equal(res.ok, true);
            return
        })
    });
    test('check app_name = royale', function() {
        return fetch('http://127.0.0.1:3000')
        .then(function(res) {
            return res.text();
        }).then(function(body) {
            const cheers = cheerio.load(body)
            assert.equal(cheers('.app_name').text(), 'royale')
        });
    });
    test('ip_local should exist', function() {
        return fetch('http://127.0.0.1:3000')
        .then(function(res) {
            return res.text();
        }).then(function(body) {
            const cheers = cheerio.load(body)
            assert.notEqual(cheers('.ip_local').text(), '127.0.0.1')
        });
    });
    test('ip_external should exist', function() {
        return fetch('http://127.0.0.1:3000')
        .then(function(res) {
            return res.text();
        }).then(function(body) {
            const cheers = cheerio.load(body)
            assert.notEqual(cheers('.ip_external').text(), '127.0.0.1')
        });
    });
});

// suite('#2 gundb install', function() {
//     test('gun script element should exist', function() {
//         return fetch('http://127.0.0.1:3000')
//         .then(function(res) {
//             return res.text();
//         }).then(function(body) {
//             const cheers = cheerio.load(body)
//             assert.notEqual(cheers('.gun_script').text, '');
//         });
//     });
//     test('gun data element should exist', function() {
//         return fetch('http://127.0.0.1:3000')
//         .then(function(res) {
//             return res.text();
//         }).then(function(body) {
//             const cheers = cheerio.load(body)
//             assert.notEqual(cheers('.gun_data').text(), '');
//         });
//     });
// });
// suite('#9 linkedin address on contact page', function() {
//     test('clinkedin address on contact page', function() {
//         return fetch('http://127.0.0.1:3000/contact')
//         .then(function(res) {
//             return res.text();
//         }).then(function(body) {
//             const cheers = cheerio.load(body)
//             assert.equal(cheers('.linkedinaddress').text(), 'https://www.linkedin.com/in/cole-albon-5934634')
//         });
//     });
// });
// suite('#13 refactor page content to DRY', function() {
//     //lynx only still need eyeball check for javascript version
//     test('roadmap page content exists', function() {
//         return fetch('http://127.0.0.1:3000/roadmap')
//         .then(function(res) {
//             return res.text();
//         }).then(function(body) {
//             const cheers = cheerio.load(body)
//             assert.notEqual(cheers('.roadmap').text(), '')
//         });
//     });
//     test('contact page content exists', function() {
//         return fetch('http://127.0.0.1:3000/contact')
//         .then(function(res) {
//             return res.text();
//         }).then(function(body) {
//             const cheers = cheerio.load(body)
//             assert.notEqual(cheers('.contact').text(), '')
//         });
//     });
//     test('message page content exists', function() {
//         return fetch('http://127.0.0.1:3000/message')
//         .then(function(res) {
//             return res.text();
//         }).then(function(body) {
//             const cheers = cheerio.load(body)
//             assert.notEqual(cheers('.message').text(), '')
//         });
//     });
//     test('deck page content exists', function() {
//         return fetch('http://127.0.0.1:3000/deck')
//         .then(function(res) {
//             return res.text();
//         }).then(function(body) {
//             const cheers = cheerio.load(body)
//             assert.notEqual(cheers('.deck').text(), '')
//         });
//     });
//     test('connect page content exists', function() {
//         return fetch('http://127.0.0.1:3000/connect')
//         .then(function(res) {
//             return res.text();
//         }).then(function(body) {
//             const cheers = cheerio.load(body)
//             assert.notEqual(cheers('.connect').text(), '')
//         });
//     });

//});
