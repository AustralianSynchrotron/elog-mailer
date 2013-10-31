module.exports = index;

function index(req, res) {
  req.subscriptions.find(function(err, subscriptions) {
    return res.template('index.jade', {subscriptions: subscriptions});
  });
}
