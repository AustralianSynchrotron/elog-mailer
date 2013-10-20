module.exports = Alerts;

var shortId = require('shortid');

function Alerts(db) {
  if(!(this instanceof Alerts)) return new Alerts(db);
  this.db = db;
}

Alerts.prototype.find = function(id, callback) {
  var db = this.db;
  if (typeof id === 'function') {
    callback = id;
    id = null;
  }
  if (id) {
    db.get(id, function(err, properties) {
      if(err) return callback(err);
      callback(err, Alert(id, properties, db));
    });
  } else {
    var alerts = [];
    db.createReadStream().on('data', function (data) {
      alerts.push(Alert(data.key, data.value, db));
    }).on('error', function (err) {
      callback(err, alerts);
    }).on('end', function () {
      callback(null, alerts);
    });
  }
}

Alerts.prototype.create = function(properties, callback) {
  var id = shortId.generate(); 
  var alert = Alert(id, properties, this.db);
  alert.save(function(err) {
    callback(err, alert);
  });
}

function Alert(id, properties, db) {
  if(!(this instanceof Alert)) return new Alert(id, properties, db);
  this._id = id;
  this._db = db;
  this.email = properties.email;
  this.group = properties.group;
  this.schedule = properties.schedule;
}

Alert.prototype.save = function(callback) {
  var properties = {
    email: this.email,
    group: this.group,
    schedule: this.schedule
  };
  this._db.put(this._id, properties, callback);
}
