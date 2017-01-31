const router = require('koa-router')();

router.get('/', (ctx) => {
    return ctx.render('contact')
})

module.exports = router;
