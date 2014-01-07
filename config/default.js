/* jshint node:true */

module.exports = {
  port: 3000,
  couch: {
    host: 'localhost',
    port: 5984,
    db: {
      users: 'accent-users',
      appointments: 'accent-appointments'
    }
  }
};
