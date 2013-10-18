var config = require('./config')
  , mysql = require('mysql');

var connection = mysql.createConnection(config.db);
connection.connect();

var query = 'SELECT title, author, TIMESTAMP(date, time) AS datetime, text, parent_id ' +
            'FROM elog_data ' +
            'NATURAL LEFT JOIN elog_groups '+
            'WHERE group_id = 10 AND TIMESTAMP(date, time) BETWEEN "2013-10-17" AND "2013-10-18" ORDER BY datetime';

connection.query(query, function(err, entries, fields) {
  if (err) throw err;
  entries.forEach(function(entry) {
    console.log(entry.datetime, entry.title, entry.author);
  });
});

connection.end();
