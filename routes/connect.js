const router = require('koa-router')();

router.get('/', (ctx) => {
    return ctx.render('connect')
})

module.exports = router;
