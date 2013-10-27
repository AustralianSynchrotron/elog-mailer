var should = require('should');

var Rule = require('../../models/rule');

describe('rule model', function() {
  describe('with condition all', function() {
    var rule;
    var properties = {
        condition: 'all'
      , values: ['MX1', 'XFM', 'Operations']
    };

    beforeEach(function() {
      rule = new Rule(properties);
    });

    it('should create with all properties', function() {
      rule.condition.should.equal('all');
      rule.values.should.include('MX1');
      rule.values.should.include('XFM');
      rule.values.should.include('Operations');
    });

    it('should evaluate true if all values are given', function() {
      rule.evaluate(['XFM', 'MX1', 'Operations']).should.be.true;
    });

    it('should evaluate false if all values are not given', function() {
      rule.evaluate(['MX1', 'Operations']).should.be.false;
    });
  });
  describe('with condition any', function() {
    var rule;
    var properties = {
        condition: 'any'
      , values: ['MX1', 'XFM', 'Operations']
    };

    beforeEach(function() {
      rule = new Rule(properties);
    });

    it('should create with all properties', function() {
      rule.condition.should.equal('any');
      rule.values.should.include('MX1');
      rule.values.should.include('XFM');
      rule.values.should.include('Operations');
    });

    it('should evaluate true if any values are given', function() {
      rule.evaluate(['PD', 'MX1']).should.be.true;
    });

    it('should evaluate false if all values are not given', function() {
      rule.evaluate(['PD', 'ODB']).should.be.false;
    });
  });
});
