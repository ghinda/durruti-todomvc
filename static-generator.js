/* generate static website from isomorphic app
 */

var server = require('./server')
var url = require('url')
var stop = require('stop')

stop.getWebsiteStream('http://localhost:3000/', {
  filter: function (currentURL) {
    return url.parse(currentURL).hostname === 'localhost'
  },
  parallel: 1
})
.syphon(stop.addFavicon())
.syphon(stop.log())
.syphon(stop.checkStatusCodes([200]))
.syphon(stop.writeFileSystem(__dirname + '/static'))
.wait().done(function () {
  server.close()
})
