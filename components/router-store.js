/* router store
 */

var Store = require('durruti/store')
var RouterStore = function () {
  Store.call(this);

  if (typeof window !== 'undefined') {
    // get value from location when in browser
    this.set(window.location.pathname)
  }
}

RouterStore.prototype = Object.create(Store.prototype)

RouterStore.prototype.set = function (url) {
  // remove last / from url
  if (url.length > 1 && url.substr(-1) === '/') {
    url = url.slice(0, -1)
  }

  Store.prototype.set.call(this, url)
}

module.exports = new RouterStore()
