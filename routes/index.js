const router = require('express').Router();
const NodeCache = require('node-cache');
// const axios = require('axios');
const { requiresAuth } = require('express-openid-connect');
const isEmailVerified = require('../middleware/isEmailVerified');
const getManagementToken = require('../lib/getManegementToken');
const updateUserData = require('../lib/updateUserData');
const getUserData = require('../lib/getUserData');

const myCache = new NodeCache();

router.get('/', async (req, res) => {
  res.render('index', {
    title: 'Learn to Earn',
    isAuthenticated: req.oidc.isAuthenticated(),
  });
});

router.get('/profile', [requiresAuth(), isEmailVerified], async (req, res) => {
  let userData = '';
  try {
    const token = await getManagementToken(myCache);
    myCache.set('manageAccessToken', token);

    userData = await getUserData({
      userId: req.oidc.user.sub,
      tokenType: 'Bearer',
      token,
    });

    console.log('idToken', req.oidc.idTokenClaims);
    console.log('idTokenClaims', req.oidc.idTokenClaims);
    console.log('getResult', userData);
    userData.sub = req.oidc.user.sub;
  } catch (error) {
    console.log(error.message);
  }

  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', 0);

  res.render('profile', {
    userData,
    title: 'Profile page',
  });
});

router.put('/users/:id', requiresAuth(), async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  console.log('id', id);

  try {
    const token = await getManagementToken(myCache);
    myCache.set('manageAccessToken', token);

    console.log('type', typeof updateUserData);
    const updateResult = await updateUserData({
      userId: id,
      parameter: { name },
      tokenType: 'Bearer',
      token,
    });

    const userInfo = await req.oidc.fetchUserInfo();

    console.log('user info', userInfo);
    console.log('oidc', req.oidc.user);
    req.oidc.user.name = updateResult.name;
    console.log('updateResult', updateResult);
  } catch (error) {
    console.log(error.message);
  }

  // const userInfo = await req.oidc.fetchUserInfo();

  res.json({ code: 0 });
});

module.exports = router;
