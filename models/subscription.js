module.exports = Subscription;

var _ = require('underscore');

var Rule = require('./rule');

function Subscription(id, properties, db) {
  if(!(this instanceof Subscription)) return new Subscription(id, properties, db);
  this.id = id;
  this._db = db;
  this.emails = properties.emails || [];
  this.schedule = properties.schedule || {minute: 0, hour: 7};
  this.groupRules = properties.groupRules || [];
  this.paused = properties.paused || false;
}

Object.defineProperties(Subscription.prototype, {
  emails: {
    get: function() { return this._emails },
    set: function(emails) {
      this._emails = emails || []
    }
  },
  schedule: {
    get: function() { return this._schedule },
    set: function(value) {
      this._schedule = value
    }
  },
  groupRules: {
    get: function() { return this._groupRules },
    set: function(value) {
      this._groupRules = value.map(function(p) {
        return Rule(p.condition, p.values);
      });
    }
  },
  paused: {
    get: function() { return this._paused },
    set: function(value) {
      this._paused = value === 'true' || value === true
    }
  },
})

Subscription.prototype.save = function(callback) {
  this._db.put(this.id, this, callback);
}

Subscription.prototype.del = function(callback) {
  this._db.del(this.id, callback);
}

Subscription.prototype.toJSON = function() {
  return {
      id: this.id 
    , emails: this.emails
    , schedule: this.schedule
    , groupRules: this.groupRules
    , paused: this.paused
  };
}

Subscription.prototype.evaluateRules = function(entry) {
  return _.every(this.groupRules, function(rule) { return rule.evaluate(entry.groups); }, this);
}
