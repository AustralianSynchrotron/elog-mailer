module.exports = subscriptions;

var formidable = require('formidable');

function subscriptions(req, res) {
  switch(req.method) {
    case 'GET':
      return res.redirect('/');
    case 'POST':
      return createSubscription(req, res);
    default:
      return res.error(405);
  }
}

function createSubscription (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    // TODO: Properly parse all fields
    fields.paused = fields.paused === 'true';
    return req.subscriptions.create(fields, function(err, subscription) {
      res.redirect('/subscriptions/' + subscription.id);
    });
  });
}
