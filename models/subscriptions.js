module.exports = Subscriptions;

var shortId = require('shortid');
var Subscription = require('./subscription');

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

Subscriptions.prototype.del = function(id, callback) {
  this.db.del(id, callback);
}
