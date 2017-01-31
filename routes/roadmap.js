const router = require('koa-router')();

router.get('/', (ctx) => {
    return ctx.render('roadmap')
})

module.exports = router;
