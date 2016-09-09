var app = require('./app');
var request = require('supertest').agent(app.listen());
var chai=require('chai');       //这里需要引入断言库chai,否则should方法无用
var should=chai.should();

describe('Errors', function () {
  it('should catch the error', function(done){
    request
    .get('/')
    .expect(500)
    .expect('Content-Type', /text\/html/, done);
  })

  it('should emit the error on app', function(done){
    app.once('error', function (err, ctx) {
      err.message.should.equal('boom boom');
      ctx.should.be.ok;
      done();
    })

    request
    .get('/')
    .end(function(){});
  })
})