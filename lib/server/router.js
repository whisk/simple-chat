'use strict';

let allowed_methods = {
  '/':        'index',
  '/users':   'users',
  '/history': 'history',
  '/post':    'post',
  '/signup':  'signup',
  '/logout':  'logout'
};

exports.route = function(path) {
  if (allowed_methods[path]) {
    return ['chat', allowed_methods[path]];
  } else {
    return [];
  }
}