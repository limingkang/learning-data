
var app = require('./app');
var request = require('supertest').agent(app.listen());

describe('404', function(){
  describe('when GET /', function(){
    it('should return the 404 page', function(done){
      request
      .get('/')
      .expect(404)
      .expect(/Page/, done);       //只要匹配到这几个字母对的就能通过，你再服务器的打印都会在mocah测试的那个窗口输出，因为你是在测试这个模块
    })
  })
})