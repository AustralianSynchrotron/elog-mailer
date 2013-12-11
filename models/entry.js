module.exports = Entry;

function Entry(fields) {
  if(!(this instanceof Entry)) return new Entry(fields);
  this.entryId = fields.entryId;
  this.title = fields.title;
  this.author = fields.author;
  this.created = fields.created;
  var filesSource = new RegExp('(http://sol.synchrotron.org.au)?/userfiles', 'g')
    , filesTarget = 'ftp://physicsread:physicsreadonly@ftp.synchrotron.org.au/sol/userfiles';
  this.text = fields.text.replace(filesSource, filesTarget, 'g');
  this.severity = fields.severity;
  this.beamMode = fields.beamMode;
  this.groups = 'groups' in fields
                ? fields.groups.split(',')
                : undefined;
  this.keywords = 'keywords' in fields
                  ? fields.keywords.split(',')
                  : undefined;
}
