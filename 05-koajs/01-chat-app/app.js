const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

let resolves = [];

const Router = require('koa-router');

const router = new Router();

router.get('/subscribe', async (ctx, next) => {
  const promise = new Promise((resolve, reject) => {
    resolves.push(resolve);
  });

  const message = await promise;
  ctx.status = 200;
  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;

  if (message === '' || Object.keys(ctx.request.body).length === 0) {
    ctx.status = 204;
    ctx.message = '"No content"';
    return;
  }

  resolves.forEach(resolve => {
    resolve(message);
  });
  resolves = [];
  ctx.status = 201;
});

app.use(router.routes());

module.exports = app;
