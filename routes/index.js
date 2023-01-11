const router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');
const isEmailVerified = require('../middleware/isEmailVerified');

router.get('/', async (req, res) => {
  res.render('index', {
    title: 'Learn to Earn',
    isAuthenticated: req.oidc.isAuthenticated(),
  });
});

router.get('/profile', [requiresAuth(), isEmailVerified], (req, res) => {
  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Profile page',
  });
});

module.exports = router;
