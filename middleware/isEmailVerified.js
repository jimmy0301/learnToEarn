const isEmailVerified = (req, res, next) => {
  const { email_verified: emailVerified } = req.oidc.user;
  console.log(req.oidc.user);
  if (emailVerified) {
    next();
  } else {
    res.redirect('/');
  }
};

module.exports = isEmailVerified;
