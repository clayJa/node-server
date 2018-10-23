/**
 * 引入node相关模块http、url、fs、path
 * http模块负责创建http服务
 * url模块负责处理请求url
 * fs模块负责文件读写
 * path模块负责处理文件路径
 */
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

/**
 * 定义router对象，负责处理不同情况路由，
 * 请求某个url，如果存在对应的html文件返回对应html
 * 请求文件由static对应函数进行处理
 * 错误请求，路由到错误请求输出页面
 */
var router = {
  '/sample/test': function(filePath,req,res){
    responseFile(filePath,res);
  },
  'static': function(filePath,req,res){
    responseFile(filePath,res);
  },
  'error': function(req,res) {
    res.writeHead(200,{'Content-Type': 'text/html;charset=utf-8'});
    res.write('<h1>404 Not Found</h1><h2>sorry, the page you are visited is loss!</h2>');
    res.end();
  }
}

/** 通过调用http模块的createServer模块创建一个服务器，并在8111端口进行监听
 *  当接受到浏览器请求时，调用routeStatic函数进行处理
 */
var server = http.createServer(function(req, res){
  routeStatic(req,res);
});
server.listen(8111);
console.log('visit http://localhost:8111');

/**
 * routeStatic 处理浏览器请求
 * @param {*} req 请求
 * @param {*} res 响应
 * 首先调动url模块的parse函数对请求的url进行处理，得到请求路径pathname，
 * 根据请求路径的不同特征，对应到路由对象的不同属性方法，进行处理
 * 其中通过path模块将浏览器请求url，对应到服务器相对应文件的绝对路径
 * __dirname为代码文件所在绝对路径，join方法可以进行路径拼接
 * format方法针对不同url进行路径转化
 */
function routeStatic (req,res) {
  var urlObj = url.parse(req.url,true);
  var filePath = path.join(__dirname, urlObj.pathname);  
  var urlPath = path.join(__dirname, urlObj.pathname);
  var homePath = path.join(__dirname,'sample');
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
        router['error'](req,res);
    }
  }
}

/**
 * responseFile 读取文件并将文件返回给浏览器
 * @param {*} filePath 文件绝对路径
 * @param {*} res 服务器响应对象
 */
function responseFile (filePath,res) {
  /** 用fs模块的readFile函数，异步读文件，readFile的第一个参数为要读取的文件路径
   * 第二个参数为回调函数，回调函数第一个参数为错误信息，第二个为读到的二进制文件流
   * 读取成功，通过服务器响应对象的writeHead返回状态响应码，通过write返回响应信息，通过end结束
  **/
  fs.readFile(filePath,'binary',function(err,buffer){
    if(err) {
      console.log(err);
      res.writeHead(200,{'Content-Type': 'text/html;charset=utf-8'});
      res.write('<h1>404 Not Found</h1><h2>sorry, the page you are visited is loss!</h2>');
      res.end();
    } else {
      if(/\.md/g.test(filePath)) {
        res.writeHead(200,{'Content-Type': 'text/plain;charset=utf-8'});
      } else {
        res.writeHead(200,{'Content-Type': 'text/html;charset=utf-8'});
      }
      res.write(buffer,'binary');
      res.end();
    }
  })
}