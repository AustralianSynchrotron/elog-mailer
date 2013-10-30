module.exports = subscriptions;

var formidable = require('formidable');

function subscriptions(req, res) {
  switch(req.method) {
    case 'GET':
      if(typeof(req.params.id) !== 'undefined') {
        return req.subscriptions.find(req.params.id, function(err, subscription) {
          if(err) {
            return res.error(404);
          }
          res.sendJSON(subscription);
        });
      }
      return req.subscriptions.find(function(err, subscriptions) {
        res.sendJSON(subscriptions);
      });
    case 'POST':
      if(typeof(req.params.id) !== 'undefined') {
        return updateSubscription(req.params.id, req, res);
      }
      return createSubscription(req, res);
    default:
      return res.error(405);
  }
}

function updateSubscription (id, req, res) {
  parseFields(req, res, function(err, fields) {
    req.subscriptions.find(id, function(err, subscription) {

      if(err) return res.error(404);

      ['email', 'groupRules', 'paused'].forEach(function(field) {
        if(!fields.hasOwnProperty(field)) return;
        subscription[field] = fields[field];
      });

      subscription.save(function(err) {
        res.redirect('/subscriptions/' + id);
      });

    });
  });
}

function createSubscription (req, res) {
  parseFields(req, res, function(err, fields) {
    return req.subscriptions.create(fields, function(err, subscription) {
      res.redirect('/subscriptions/' + subscription.id);
    });
  });
}

function parseFields(req, res, callback) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields) {
    // TODO: Properly parse all fields
    fields.paused = fields.paused === 'true';
    callback(err, fields);
  });
}
