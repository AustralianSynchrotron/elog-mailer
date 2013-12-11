module.exports = decorate;

var ErrorPage = require('error-page')
  , Templar = require('templar')
  , jade = require('jade')
  , path = require('path')
  , url = require('url')
  , templateFolder = path.resolve(__dirname, 'views')
  , templateOptions = { engine: jade, folder: templateFolder };

function decorate (req, res, config) {
  req.config = config;
  req.subscriptions = config.subscriptions;
  req.manager = config.manager;

  res.error = ErrorPage(req, res);
  res.template = Templar(req, res, templateOptions);

  res.redirect = function (target, code) {
    res.statusCode = code || 302
    // strip out \n etc.
    target = url.format(target)
    res.setHeader('location', target)
    var avail = ['text/html', 'application/json']
    res.sendHTML( '<html><body><h1>Moved'
            + (code === 302 ? ' Permanently' : '') + '</h1>'
            + '<a href="' + target + '">' + target + '</a>')
  }

  res.send = function (data, status, headers) {
    res.statusCode = res.statusCode || status
    if (headers) Object.keys(headers).forEach(function (h) {
      res.setHeader(h, headers[h])
    })
    if (!Buffer.isBuffer(data)) data = new Buffer(data)
    res.setHeader('content-length', data.length)
    res.end(data)
  }

  res.sendJSON = function (obj, status) {
    res.send(JSON.stringify(obj), status, {'content-type':'application/json'})
  }

  res.sendHTML = function (data, status) {
    res.send(data, status, {'content-type':'text/html'})
  }
}
