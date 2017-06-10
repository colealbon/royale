const router = require('koa-router')();
const config = require(__dirname + '/../config/options.js');
const fs = require('fs');
const OS = require('os');
const fetch = require('node-fetch');
const memoize = require('memoizee');

var openpgp = require('../test/openpgp162/openpgp.js');

const slow_get_user_from_pubkey = function slow_get_user_from_pubkey(pubkeyarmor) {
    let publicKey = openpgp.key.readArmored(pubkeyarmor);
    return publicKey.keys[0].users[0].userId.userid;
};
const get_user_from_pubkey = memoize(slow_get_user_from_pubkey);

const slow_localip = function slow_localip() {
    var net = OS.networkInterfaces();
    for (var ifc in net) {
        var addrs = net[ifc];
        for (var a in addrs) {
            if (addrs[a].family == "IPv4" && addrs[a].address != "127.0.0.1") {
                return addrs[a].address;
            }
        }
    }
}
const localip = memoize(slow_localip);

const slow_externalip = function slow_externalip() {
    return fetch('http://ifconfig.co/json', {redirect: 'follow'})
        .then(res => res.json())
        .then(body => body.ip)
        .catch(err => err.message)
}
const externalip = memoize(slow_externalip);

const slow_server_pubkey_txt = function slow_server_pubkey_txt() {
    return fs.readFileSync(config.server_pubkey,  "utf8")
};
const get_server_pubkey_txt = memoize(slow_server_pubkey_txt);

router.get('/', async (ctx, next) => {
    const time_stamp = await new Date().getTime();
    const ip_local = await localip();
    const ip_external = await externalip();
    const server_pubkey_txt = await get_server_pubkey_txt()
    const server_userid = await get_user_from_pubkey(server_pubkey_txt);
    return ctx.render('index', {
        time_stamp: time_stamp,
        app_name: config.app_name,
        ip_local: ip_local || "127.0.0.1",
        ip_external: ip_external,
        server_pubkey_url: config.server_pubkey_url,
        port: process.env.PORT || config.port,
        recipient_userid: server_userid,
        recipient_pubkey_txt: server_pubkey_txt
    })
})

module.exports = router;
