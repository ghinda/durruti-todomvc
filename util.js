/* util
 */

function clone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

// one-level object extend
function extend (obj, defaults) {
  if (obj === null) {
    obj = {}
  }

  // clone object
  var extended = clone(obj)

  // copy default keys where undefined
  Object.keys(defaults).forEach(function (key) {
    if (typeof extended[key] !== 'undefined') {
      extended[key] = obj[key]
    } else {
      extended[key] = defaults[key]
    }
  })

  return extended
}

function fetch (path, options, callback) {
  // options not specified
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  options = extend(options, {
    type: 'GET',
    data: {}
  })

  callback = callback || function () {}

  var request = new window.XMLHttpRequest()
  request.open(options.type, path)
  request.withCredentials = true
  request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')

  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      // success
      var data = JSON.parse(request.responseText)

      callback(null, data)
    } else {
      // error
      callback(request)
    }
  }

  request.onerror = function () {
    // error
    callback(request)
  }

  request.send(JSON.stringify(options.data))
}

module.exports = {
  extend: extend,
  fetch: fetch
}
