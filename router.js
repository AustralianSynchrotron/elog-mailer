var routes = require('routes')
  , router = new routes.Router();

module.exports = router;

var static = require('./routes/static');
router.addRoute('/css/*?', static);
router.addRoute('/js/*?', static);

router.addRoute('/', require('./routes/index'));
router.addRoute('/subscriptions', require('./routes/subscriptions'));
