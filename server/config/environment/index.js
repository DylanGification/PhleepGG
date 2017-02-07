'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'phleep-secret'
  },

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  facebook: {
    clientID:     process.env.FACEBOOK_ID || '1381587428528615',
    clientSecret: process.env.FACEBOOK_SECRET || 'a8b2f3cb40afc42c72c9009940f4c5df',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/facebook/callback'
  },

  twitter: {
    clientID:     process.env.TWITTER_ID || 'hkJEDmOpY7kCsigetckS5yt7c',
    clientSecret: process.env.TWITTER_SECRET || 'VKtZd0YLM4PVDkyjAdAsfMN8TLR7vjSWdaJp7TZWCRJsxrFCxE',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/twitter/callback'
  },

  google: {
    clientID:     process.env.GOOGLE_ID || 'id',
    clientSecret: process.env.GOOGLE_SECRET || 'secret',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/google/callback'
  },

  bnet: {
    clientID:     process.env.BNET_ID || '45nv33tjvbpzgkkuscbaz7y9x7xcxxby  ',
    clientSecret: process.env.BNET_SECRET || 'zXuzGFG3uszsw2BhxV6HCzZSKwpY8NvU',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/bnet/callback'
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});
