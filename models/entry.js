module.exports = Entry;

var dateFormat = require('dateformat')

function Entry(fields) {
  if(!(this instanceof Entry)) return new Entry(fields);
  this.entryId = fields.entryId;
  this.title = fields.title;
  this.author = fields.author;
  this.created = fields.created;
  if(typeof this.text !== 'undefined') {
    var filesSource = new RegExp('(http://sol.synchrotron.org.au)?/userfiles', 'g')
      , filesTarget = 'ftp://physicsread:physicsreadonly@ftp.synchrotron.org.au/sol/userfiles';
    this.text = fields.text.replace(filesSource, filesTarget);
  }
  this.severity = fields.severity;
  this.beamMode = fields.beamMode;
  this.groups = 'groups' in fields
                ? fields.groups.split(',')
                : undefined;
  this.keywords = 'keywords' in fields
                  ? fields.keywords.split(',')
                  : undefined;
}

Entry.prototype.createdString = function() {
  return dateFormat(this.created, 'yyyy-mm-dd HH:MM')
}
