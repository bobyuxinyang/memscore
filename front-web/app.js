const Koa = require('koa');
const static = require('koa-static')
const path = require('path')
const app = new Koa();
var Router = require('koa-router');
var router = new Router();

const getScores = require('./mem/lib/memscore')
 
//设置静态资源的路径 
const staticPath = './dist'
 
app.use(static(
  path.join( __dirname,  staticPath)
))

router.get('/api/currentUser', (ctx, next) => {
  ctx.body = {
    name: 'xlp_senior',
  }
});

router.get('/api/getMemscoreList', async (ctx, next) => {
  ctx.body = await getScores()
})

app
  .use(router.routes())
  .use(router.allowedMethods());
 
app.listen(3000, () => {
  console.log('server is starting at port 3000')
})

