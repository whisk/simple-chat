'use strict';

let allowed_methods = {
  '/':        'static',
  '/users':   'users',
  '/history': 'history',
  '/post':    'post',
  '/signup':  'signup',
  '/logout':  'logout'
};

exports.route = function(pathname) {
  if (pathname.match(/\.(css|js|html)$/)) {
    return ['chat', 'static'];
  }

  if (allowed_methods[pathname]) {
    return ['chat', allowed_methods[pathname]];
  } else {
    return [];
  }
}