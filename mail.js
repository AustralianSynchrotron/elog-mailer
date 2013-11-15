module.exports = mail;

var nodemailer = require('nodemailer')
  , jade = require('jade');

var transport = nodemailer.createTransport('Sendmail');

function mail(entries, recipients, subject, callback) {
  jade.renderFile('./views/mail.jade', {entries: entries}, function(err, html) {
    if(err) return callback(err);
    var message = {
        from: 'sol@synchrotron.org.au'
      , to: recipients
      , subject: subject
      , html: html
      , forceEmbeddedImages: true
    };
    transport.sendMail(message, callback);
  });
}
