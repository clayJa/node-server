var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

var router = {
  '/sample/test': function(filePath,req,res){
    responseFile(filePath,res);
  },
  '/': function(filePath,req,res) {
    responseFile(filePath,res);
    
  },
  'static': function(filePath,req,res){
    responseFile(filePath,res);

  }
}

var server = http.createServer(function(req, res){
  routeStatic(req,res);
});
server.listen(8111);
console.log('visit http://localhost:8111');



function routeStatic (req,res) {
  var urlObj = url.parse(req.url);
  var filePath = path.join(__dirname, urlObj.pathname);  
  var urlPath = path.join(__dirname, urlObj.pathname);  
  if(/[.]/g.test(urlObj.pathname)){
    router['static'](filePath,req,res);
  } else {
    switch(urlObj.pathname) {
      case '/sample/test': 
        router[urlObj.pathname](path.format({
          dir: urlPath,
          ext: '.html'
        }),req,res);
      default:
        router['/'](path.format({
          root: __dirname,
          dir: 'sample',
          base: 'test.html'
        }),req,res);   
    }
  }
}

function responseFile (filePath,res) {
  console.log(filePath);
  fs.readFile(filePath,function(err,buffer){
    if(err) {
      console.log(err);
      res.writeHead(404,'not find');
      return res.end();
    } else {
      res.writeHead(200,'ok');
      res.write(buffer);
      res.end();
    }
  })
}