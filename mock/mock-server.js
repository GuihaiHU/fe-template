var fs = require('fs');
var program = require('commander');
var path = require('path');
var jsonServer = require('json-server');

program.option('-p, --port <string>', 'listen port', parseInt).parse(process.argv);
var port = program.port ? program.port : 8002

var server = jsonServer.create();
var router = jsonServer.router(path.join(__dirname, 'db.json'));
var middlewares = jsonServer.defaults();

server.use(middlewares);
server.post('/sepical/:action', function(req, res){
    var test = router.db.get(req.params.action).val();
    res.jsonp();
})

fs.readFile(path.join(__dirname, 'router.json'), function(error, data){
    var routerMap = JSON.parse(data);
    server.use(server.rewriter(routerMap));
    server.use(router);

    server.listen(port, function(){
	console.log('start running server port '+port)
    })
});
