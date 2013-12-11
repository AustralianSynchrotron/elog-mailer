module.exports = search;

var mysql = require('mysql')
  , _ = require('underscore')
  , Entry = require('./models/entry');

function search(db, startDate, endDate, subscription, callback) {

  var query = 'SELECT eg.entry_id AS entryId'+
                   ', eg.title'+
                   ', eg.author'+
                   ', eg.created'+
                   ', eg.text'+
                   ', eg.severity_title AS severity'+
                   ', eg.beam_mode_title AS beamMode'+
                   ', eg.groups'+
                   ', GROUP_CONCAT(kd.keyword_title) AS keywords '+
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

  var connection = mysql.createConnection(db);
  connection.connect(function(err) {
    if(err) return callback(err);
    connection.query(query, [startDate, endDate], function(err, entries, fields) {
      if(err) return callback(err);
      entries = _.filter(_.map(entries, Entry), subscription.evaluateRules, subscription);
      entries = _.sortBy(entries, function(entry) { return entry.created})
      callback(err, entries);
      connection.destroy();
    });
  });

}
