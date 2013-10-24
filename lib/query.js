var config = require('../config')
  , mysql = require('mysql')

var query = 'SELECT eg.entry_id, eg.title, eg.author, eg.created, eg.text, eg.severity_title, eg.beam_mode_title, eg.groups, GROUP_CONCAT(kd.keyword_title) AS keywords '+
            'FROM '+
              '('+
                'SELECT e.*, sd.severity_title, bmd.beam_mode_title, GROUP_CONCAT(gd.group_title) AS groups '+
                'FROM elog_data e '+
                  'NATURAL LEFT JOIN elog_severity_data sd '+
                  'NATURAL LEFT JOIN elog_beam_mode_data bmd '+
                  'NATURAL LEFT JOIN elog_groups g '+
                  'NATURAL LEFT JOIN elog_group_data gd '+
                'WHERE e.created BETWEEN ? AND ? '+
                'GROUP BY e.entry_id'+
              ') eg '+
              'NATURAL LEFT JOIN elog_keywords k '+
              'NATURAL LEFT JOIN elog_keyword_data kd '+
            'GROUP BY eg.entry_id';

var startDate = new Date('2013-10-01');
var endDate = new Date('2013-10-02');

var connection = mysql.createConnection(config.db);
connection.connect();

connection.query(query, [startDate, endDate], function(err, entries, fields) {
  if (err) throw err;
  entries.forEach(function(entry) {
    console.log(entry);
  });
});

connection.end();
