module.exports = preview;

var search = require('../search')
  , Subscription = require('../models/subscription');

var id = 'id123';
var properties = {
    emails: [ 'mail@example.com' ]
  , groupRules: [
  ]
  , paused: false
};

var subscription = new Subscription(id, properties);

function preview(req, res) {
  var endDate = new Date()
  var startDate = new Date(endDate - 86400000)
  search(req.config.elogDb, startDate, endDate, subscription, function(err, entries) {
    return res.template('preview.jade', {entries: entries});
  });
}
