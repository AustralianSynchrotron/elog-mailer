module.exports = subscriptions;

function subscriptions(req, res) {
  switch(req.method) {
    case 'GET':
      return res.redirect('/');
    case 'POST':
      return req.subscriptions.create({}, function(err, subscription) {
        res.redirect('/subscriptions/' + subscription.id);
      });
    default:
      return res.error(405);
  }
}
