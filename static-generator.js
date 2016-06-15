/* generate static website from isomorphic app
 */

var server = require('./server')
var ssg = require('durruti/static')

ssg.render({
  pages: [
    '/',
    '/active',
    '/completed'
  ]
}, function () {
  server.close()
})
