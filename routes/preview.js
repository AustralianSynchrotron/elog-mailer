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
  var startDate = new Date('2013-10-09 12:00');
  var endDate = new Date('2013-10-09 16:00');
  search(req.config.elogDb, startDate, endDate, subscription, function(err, entries) {
    return res.template('preview.jade', {entries: entries});
  });
}
