const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-nunjucks-next');
const logger = require('koa-logger');
const path = require('path');
const serve = require('koa-static');
const koaBodyParser = require('koa-bodyparser');

app.use(logger());
const publicFiles = serve(path.join(__dirname, 'public'), { maxage: 60000 } );
publicFiles._name = 'static /public';

app.use(publicFiles);

app.use(views(__dirname + '/views', {
  cache: false,
  extension: 'html',
  map: {html: 'nunjucks' }
}));

const index = require('./routes/index');
router.use('/', index.routes());
const roadmap = require('./routes/roadmap');
router.use('/roadmap', roadmap.routes());
const contact = require('./routes/contact');
router.use('/contact', contact.routes());
const deck = require('./routes/deck');
router.use('/deck', deck.routes());
const message = require('./routes/message');
router.use('/message', message.routes());
const connect = require('./routes/connect');
router.use('/connect', connect.routes());

app.use(koaBodyParser({
    detectJSON: function (ctx) {
        return /\.json$/i.test(ctx.path);
        }
}))
app.use(async function(ctx, next) {
    return next();
})
//.use(router.routes());
.use(router.routes(), router.allowedMethods());


app.on('error', function(err, ctx){
  console.log('server error', err, ctx);
});

module.exports = app;
