const router = require('koa-router')();

router.get('/', async (ctx) => {
    return ctx.render('connect')
})

module.exports = router;
