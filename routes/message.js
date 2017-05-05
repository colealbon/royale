const router = require('koa-router')();
const config = require(__dirname + '/../config/options.js');
const fs = require('fs');
const memoize = require('memoizee');
const util = require(__dirname + '/../src/lib/util.js');

const openpgp = require('../test/openpgp162/openpgp.js');

const slow_get_server_privkey = function slow_get_server_pubkey() {
    return fs.readFileSync(config.server_privkey_file, "utf8")
};
const get_server_privkey = memoize(slow_get_server_privkey);

// const slow_decrypt_content = async function slow_cleanpubkey_txt( privkeyArmor, cleaned_txt ) {
//     try {
//         var privKeys = await openpgp.key.readArmored(privkeyArmor);
//         var privKey = await privKeys.keys[0];
//         privKey.decrypt();
//         var message = await openpgp.message.readArmored(cleaned_txt);
//         //console.log(privkeyArmor);
//         return openpgp.decryptMessage(privKey, message).then(function(cleartext){
//             //console.log(cleartext)
//             return cleartext;
//         });
//     }
//     catch(err) {
//         //console.log(err);
//         return err;
//     }
// };
// const decrypt_content = memoize(slow_decrypt_content);
//
const slowCleanContent = function slowCleanCcontent( posted_txt ) {
    return posted_txt
        .replace(/\\r\\n/g, '\r\n')
        .replace(/"/g, '');
};
const cleanContent = memoize(slowCleanContent);

// const slow_get_user_from_pubkey = async function slow_get_user_from_pubkey(pubkeyarmor) {
//     //console.log(pubkeyarmor);
//     let publicKey = await openpgp.key.readArmored(pubkeyarmor);
//     let userid = publicKey.keys[0].users[0].userId.userid;
//     console.log(userid);
//     return userid;
// };
// const get_user_from_pubkey = memoize(slow_get_user_from_pubkey);

router.get('/', async (ctx, next) => {
    return ctx.render('message', {
        app_name: config.app_name,
    })
});

router.post('/', async (ctx, next) => {
    //console.log('11111111', ctx.request.body)
    const postedContent = await JSON.stringify(ctx.request.body);
    const msgTxt = await JSON.parse(postedContent).message_txt
    if (msgTxt !== '') {
        const classification = await util.classifyContent(msgTxt)(openpgp);
        console.log(classification);

        // const privkey_txt = await get_server_privkey();
        // const cleaned_privkey = await clean_content(privkey_txt);
        // var decrypted_txt;
        // try {
        //     decrypted_txt = await decrypt_content(cleaned_privkey, cleaned_txt)
        // }
        // catch (err) {
        //     //console.log(err);
        // }
        // console.log(decrypted_txt);
        // const client_userid = await get_user_from_pubkey(decrypted_txt);
    }


    return ctx.render('message', {
        app_name: config.app_name
        //client_userid: client_userid,
        //client_pubkey_txt: decrypted_txt
    })
})
module.exports = router;
