var http = require('http')
  , url = require('url')
  , levelup = require('levelup')
  , config = require('./config')
  , router = require('./router')
  , decorate = require('./decorate');

config.db = levelup('./store/subscriptions', {valueEncoding: 'json'});

http.createServer(function(req, res) {
  decorate(req, res, config);

  var parsed = url.parse(req.url);
  var route = router.match(parsed.path);

  if(!route) return res.error(404);

  req.params = route.params;
  req.json = req.headers.accept === 'application/json';

  route.fn(req, res);

}).listen(config.http.port, function() {
  console.log('Listening on ', config.http.port);
});
