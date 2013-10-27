module.exports = subscriptions;

function subscriptions(req, res) {
  switch(req.method) {
    case 'GET':
      return res.redirect('/');
    default:
      return res.error(405);
  }
}
