var koa = require('koa');

var app = module.exports = koa();

app.use(function *pageNotFound(next){
  yield next;

  if (404 != this.status) return;

  // we need to explicitly set 404 here
  // so that koa doesn't assign 200 on body=
  this.status = 404;
    console.log(4);
  switch (this.accepts('html', 'json')) {
    case 'html':
    console.log(1);
      this.type = 'html';
      this.body = '<p>Page Not Found</p>';
      break;
    case 'json':
    console.log(2);
      this.body = {
        message: 'Page Not Found'
      };
      break;
    default:
    console.log(3);
      this.type = 'text';
      this.body = 'Page Not Found';
  }
})

if (!module.parent) app.listen(3000);
