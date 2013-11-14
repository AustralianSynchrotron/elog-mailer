var should = require('should')
  , search = require('../search')
  , config = require('../config')
  , Subscription = require('../models/subscription');

var id = 'id123';
var properties = {
    emails: [ 'mail@example.com' ]
  , groupRules: [
    {condition: 'any', values: ['OHSE']}
  ]
  , paused: false
};

var subscription = new Subscription(id, properties);

describe('search', function() {
  it('should return matching entries', function(next) {
    var startDate = new Date('2013-10-09');
    var endDate = new Date('2013-10-10');
    search(config.elogDb, startDate, endDate, subscription, function(err, entries) {
      should.strictEqual(err, null);
      entries.should.have.length(1);
      entries[0].entryId.should.equal(40305);
      next();
    });
  });
});
