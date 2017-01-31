const router = require('koa-router')();

router.get('/', async (ctx, next) => {
    return ctx.render('deck')
})

module.exports = router;
