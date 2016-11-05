/**
 * @fileOverview Simple module to define routes which 'connects' HTTP backend and controller(s)
 * @module Backend/Router
 */
'use strict'

let allowed_methods = {
  '/':        'static',
  '/users':   'users',
  '/history': 'history',
  '/post':    'post',
  '/signup':  'signup',
  '/logout':  'logout'
}

/**
 * Finds controller and it's method for given path
 * @param  {String} pathname Path component of requested URI
 * @return {Array}           [controller_name, method_name]. Returns empty array if not found
 */
exports.route = function(pathname) {
  if (pathname.match(/\.(css|js|html)$/)) {
    return ['chat', 'static']
  }

  if (allowed_methods[pathname]) {
    return ['chat', allowed_methods[pathname]]
  } else {
    return []
  }
}