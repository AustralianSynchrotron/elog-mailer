var st = require('st')
  , path = require('path');

var mount = st(path.join(process.cwd(), 'public'));

module.exports = static;

function static(req, res) {
  if (!mount(req, res)) return res.error(404);
}
