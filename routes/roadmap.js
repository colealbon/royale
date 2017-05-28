const router = require('koa-router')();

router.get('/', async (ctx) => {
    return ctx.render('roadmap')
})

module.exports = router;
