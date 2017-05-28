const router = require('koa-router')();

router.get('/', async (ctx) => {
    return ctx.render('contact')
})

module.exports = router;
