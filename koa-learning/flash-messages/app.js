/**
 * A very simple flash example.
 * Only uses JSON for simplicity.
 项目中通常使用body-parser进行post参数的解析，最常用的是其中的json和urlencoded的parser，
 可分别对以JSON格式的post参数和urlencoeded的post参数进行解析，均可获得一个JSON化的req.body，如：
 {
     "username": "user",
     "password": "pass"
 }
 body-parser还有一个raw parser，可以获取一个buffer对象的req.body
 */

var koa = require('koa');
var rawBody = require('raw-body');
var session = require('koa-session');

var app = module.exports = koa();

// required for signed cookie sessions
app.keys = ['key1', 'key2'];
app.use(session(app));

app.use(function *(next){
  if (this.method !== 'GET' || this.path !== '/messages') return yield next;

  // get any messages saved in the session
  var messages = this.session.messages || [];
  this.body = messages;

  // delete the messages as they've been deliverd
  delete this.session.messages;
})

app.use(function *(next){
  if (this.method !== 'POST' || this.path !== '/messages') return yield next;

  // the request string is the flash message
  var message = yield rawBody(this.req, {
    encoding: 'utf8'
  });

  // push the message to the session
  this.session.messages = this.session.messages || [];
  this.session.messages.push(message);

  // tell the client everything went okay
  this.status = 204;
})

if (!module.parent) app.listen(3000);
