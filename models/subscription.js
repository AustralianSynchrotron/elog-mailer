module.exports = Subscriptions;

var shortId = require('shortid');
var Rule = require('./rule');

function Subscriptions(db) {
  if(!(this instanceof Subscriptions)) return new Subscriptions(db);
  this.db = db;
}

Subscriptions.prototype.find = function(id, callback) {
  var db = this.db;
  if (typeof id === 'function') {
    callback = id;
    id = null;
  }
  if (id) {
    db.get(id, function(err, properties) {
      if(err) return callback(err);
      callback(err, Subscription(id, properties, db));
    });
  } else {
    var subscriptions = [];
    db.createReadStream().on('data', function (data) {
      subscriptions.push(Subscription(data.key, data.value, db));
    }).on('error', function (err) {
      callback(err, subscriptions);
    }).on('end', function () {
      callback(null, subscriptions);
    });
  }
}

Subscriptions.prototype.create = function(properties, callback) {
  var id = shortId.generate(); 
  var subscription = Subscription(id, properties, this.db);
  subscription.save(function(err) {
    callback(err, subscription);
  });
}

function Subscription(id, properties, db) {
  if(!(this instanceof Subscription)) return new Subscription(id, properties, db);
  // TODO: Validate
  this._id = id;
  this._db = db;
  this.email = properties.email;
  this.groupRules = properties.groupRules.map(Rule);
  this.paused = properties.paused;
}

Subscription.prototype.save = function(callback) {
  var properties = {
      email: this.email
    , groupRules: this.groupRules
    , paused: this.paused
  };
  this._db.put(this._id, properties, callback);
}

