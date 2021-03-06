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
    case 'DELETE':
      if(typeof(req.params.id) !== 'undefined') {
        return deleteSubscription(req.params.id, req, res);
      }
      return res.error(405);
    default:
      return res.error(405);
  }
}

function updateSubscription (id, req, res) {
  parseFields(req, res, function(err, fields) {
    req.subscriptions.find(id, function(err, subscription) {

      if(err) return res.error(404);

      ['emails', 'groupRules', 'paused'].forEach(function(field) {
        if(!fields.hasOwnProperty(field)) return;
        subscription[field] = fields[field];
      });

      subscription.save(function(err) {
        req.manager.update(subscription);
        res.redirect('/');
      });

    });
  });
}

function createSubscription (req, res) {
  parseFields(req, res, function(err, fields) {
    return req.subscriptions.create(fields, function(err, subscription) {
      req.manager.add(subscription);
      res.redirect('/');
    });
  });
}

function deleteSubscription (id, req, res) {
  req.manager.delById(id);
  return req.subscriptions.del(id, function(err) {
    res.redirect('/');
  });
}

function parseFields(req, res, callback) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields) {
    // TODO: Properly parse all fields
    if(typeof fields.emails === 'string') {
        fields.emails = [ fields.emails ];
    }
    fields.paused = fields.paused === 'true';

    var re = /^rule\[(\d+)\]condition$/

    var groupRules = [];

    for(var property in fields) {

      var match = re.exec(property);
      if (!match) continue;

      var condition = fields[property]; 
      var values = fields['rule['+match[1]+']values'];
      if(! (values instanceof Array) ) {
        values = [ values ];
      }

      groupRules.push({
          condition: condition
        , values: values
      });

    }

    fields.groupRules = groupRules;

    callback(err, fields);
  });
}
