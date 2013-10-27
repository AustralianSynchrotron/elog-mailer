module.exports = Subscription;

var _ = require('underscore');

var Rule = require('./rule');

function Subscription(id, properties, db) {
  if(!(this instanceof Subscription)) return new Subscription(id, properties, db);
  this.id = id;
  this._db = db;
  this.email = properties.email || '';
  this.groupRules = (properties.groupRules || []).map(function(p) {
    return Rule(p.condition, p.values);
  });
  this.paused = properties.paused || false;
}

Subscription.prototype.save = function(callback) {
  this._db.put(this.id, this, callback);
}

Subscription.prototype.toJSON = function() {
  return {
      id: this.id 
    , email: this.email
    , groupRules: this.groupRules
    , paused: this.paused
  };
}

Subscription.prototype.evaluateRules = function(entry) {
  return _.every(this.groupRules, function(rule) { return rule.evaluate(entry.groups); });
}
