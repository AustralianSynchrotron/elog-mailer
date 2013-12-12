module.exports = Manager;

var schedule = require('node-schedule')
  , search = require('./search')
  , mail = require('./mail')

function Manager(db, subscriptions) {
  if(!(this instanceof Manager)) return new Manager(db, subscriptions);
  this._db = db;
  this._subscriptions = subscriptions;
  this._jobs = {};
}

Manager.prototype.initialise = function initialise(callback) {
  var self = this;
  self._subscriptions.find(function(err, subscriptions) {
    subscriptions.forEach(function(subscription) {
      self.add(subscription);
    });
    callback(err);
  });
}

Manager.prototype.add = function add(subscription) {
  var self = this;
  self._jobs[subscription.id] = schedule.scheduleJob(subscription.schedule, function() {
    self.process(subscription);
  });
}

Manager.prototype.del = function del(subscription) {
  this.delById(subscription.id);
}

Manager.prototype.delById = function delById(id) {
  this._jobs[id].cancel();
  delete this._jobs[id];
}

Manager.prototype.update = function update(subscription) {
  this.del(subscription);
  this.add(subscription);
}

Manager.prototype.process = function process(subscription) {

  var endDate = new Date()
  var startDate = new Date(endDate - 86400000)

  search(this._db, startDate, endDate, subscription, function(err, entries) {

    console.log('Found ' + entries.length + ' entries for ' + subscription.emails + '.')

    if(entries.length === 0) return

    mail(entries, subscription.emails, 'eLog Summary', function(err) {
      if(err) console.error(err)
    })

  })

}

