module.exports = index;

function index(req, res) {
  if(req.method !== 'GET') {
      return res.error(405);
  }

  req.subscriptions.find(function(err, subscriptions) {
    if(req.json) {
      return res.sendJSON(subscriptions);
    }
    return res.template('index.jade');
  });
}
