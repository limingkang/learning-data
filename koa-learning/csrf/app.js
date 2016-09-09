var koa = require('koa');
var parse = require('co-body');
var session = require('koa-session');
var csrf = require('koa-csrf');
var route = require('koa-route');

var app = module.exports = koa();

/**
 * csrf need session，请求一旦过来直接根据秘钥设置sessionid
 */

app.keys = ['session key', 'csrf example'];
app.use(session(app));

/**
 * maybe a bodyparser
 */

app.use(function *(next) {
  if (this.is('application/json')) {
    this.request.body = yield parse(this);
  }
  yield* next;
});

/**
 * csrf middleware,会验证x-csrf-token这个的值是否正确
 */

app.use(csrf());


/**
 * route
 */

app.use(route.get('/token', token));
app.use(route.post('/post', post));

function* token () {
  this.body = this.csrf;
}

function* post() {
  this.body = {ok: true};
}

if (!module.parent) app.listen(3000);
