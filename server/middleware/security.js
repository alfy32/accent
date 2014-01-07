/* jshint node:true */
'use strict';

module.exports = function (app) {
  app.mw.loggedIn = loggedIn;
  app.mw.hasACL = hasACL;
};

function loggedIn(req, res, next) {
  if (req.session.user) return next();

  res.send({
    success: false,
    err: 'Not Logged In'
  });
}

function hasACL(permission) {
  return function (req, res, next) {
    var user = req.session.user;
    if (user && user.acl) {
      for(var i in user.acl) {
        if(user.acl[i] == permission)
          return next();
      }
    }

    res.send({
      success: false,
      err: 'Insufficient Privileges'
    });
  };
}