var should = require('should');

var Subscription = require('../../models/subscription');
var Rule = require('../../models/rule');
var Entry = require('../../models/entry');

describe('subscription model', function() {
  var subscription;
  var id = 'id123';
  var properties = {
      email: 'mail@example.com'
    , groupRules: [
        {condition: 'all', values: ['P', 'Q']}
      , {condition: 'any', values: ['R', 'S']}
    ]
    , paused: false
  };
  beforeEach(function() {
    subscription = new Subscription(id, properties);
  });
  it('should create with all properties', function() {
    subscription.email.should.equal('mail@example.com');
    subscription.paused.should.equal(false);
    var rule1 = subscription.groupRules[0];
    rule1.should.be.an.instanceOf(Rule);
    rule1.condition.should.equal('all');
    rule1.values.should.include('P');
    rule1.values.should.include('Q');
    var rule2 = subscription.groupRules[1];
    rule2.should.be.an.instanceOf(Rule);
    rule2.condition.should.equal('any');
    rule2.values.should.include('R');
    rule2.values.should.include('S');
  });
  it('a passing entry should pass', function() {
    var fields = {
      groups: 'P,S,Q'
    };
    var entry = new Entry(fields);
    subscription.evaluateRules(entry).should.be.true;
  });
  it('a failing entry should fail', function() {
    var fields = {
      groups: 'P,S'
    };
    var entry = new Entry(fields);
    subscription.evaluateRules(entry).should.be.false;
  });
});
