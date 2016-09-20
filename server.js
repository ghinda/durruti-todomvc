/* todomvc with durruti
 */

var express = require('express')
var app = express()

// static
app.use(express.static('public/'))
app.use('/node_modules', express.static('node_modules'));

// session
var session = require('cookie-session')
app.use(session({
  name: 'durruti-todomvc',
  keys: [
    'buenaventura',
    'durruti'
  ]
}))

// api server
var apiServer = require('./api-server')(app)
app.use('/api/', apiServer)

// durruti app
var durruti = require('durruti')
var Router = require('./components/router')
var taskListStore = require('./components/task/task-list-store')
var routerStore = require('./components/router-store')

function defaultRoute (req, res) {
  routerStore.set(req.url)
  taskListStore.set(req.session.tasks)

  res.send(durruti.renderStatic(`
    <!doctype html>
    <html>
    <html lang="en" data-framework="durruti">
      <meta charset="utf-8">
      <title>Durruti • TodoMVC</title>

      <link rel="stylesheet" href="/node_modules/todomvc-common/base.css">
      <link rel="stylesheet" href="/node_modules/todomvc-app-css/index.css">

      <link href="/css/app.css" rel="stylesheet">
    </head>
    <body>
      <div id="app">
        ${durruti.render(Router)}
      </div>

      ${taskListStore.options.state.render()}

      <footer class="info">
        <p>Double-click to edit a todo</p>
        <p>Created by <a href="https://ghinda.net">Ionuț Colceriu</a></p>
        <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
      </footer>

      <script src="/node_modules/todomvc-common/base.js"></script>

      <script src="/client.js"></script>
    </body>
    </html>
  `))
}

var router = express.Router()
router.get('/:route', defaultRoute)
router.get('/', defaultRoute)

app.use('/', router)

module.exports = app.listen(3000)
