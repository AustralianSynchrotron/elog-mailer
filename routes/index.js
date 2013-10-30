module.exports = index;

function index(req, res) {
  if(req.method !== 'GET') {
      return res.error(405);
  }

  req.subscriptions.find(function(err, subscriptions) {
    return res.template('index.jade', {subscriptions: subscriptions});
  });
}
