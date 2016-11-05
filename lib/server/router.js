'use strict';

let allowed_methods = ['users', 'history', 'post', 'signup', 'logout'];

exports.route = function(path) {
  path = path.replace(/^\//, '');
  let i = allowed_methods.indexOf(path);
  if (i != -1) {
    return ['chat', allowed_methods[i]];
  } else {
    return [];
  }
}
