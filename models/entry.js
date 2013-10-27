module.exports = Entry;

function Entry(fields) {
  if(!(this instanceof Entry)) return new Entry(fields);
  this.entryId = fields.entryId;
  this.title = fields.title;
  this.author = fields.author;
  this.created = fields.created;
  this.text = fields.text;
  this.severity = fields.severity;
  this.beamMode = fields.beamMode;
  this.groups = 'groups' in fields
                ? fields.groups.split(',')
                : undefined;
  this.keywords = 'keywords' in fields
                  ? fields.keywords.split(',')
                  : undefined;
}
