/* TodoMVC with Durruti
 * API to save tasks in the session
 */

var express = require('express')
var router = express.Router()
var cors = require('cors')

var bodyParser = require('body-parser')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({
  extended: true
}))

function getTask (id, tasks) {
  var foundTask
  tasks.some(function (task) {
    if (task.id === id) {
      foundTask = task
      return true
    }
  })

  return foundTask
}

function updateTask (newTask, tasks) {
  tasks.some(function (task, i) {
    if (task.id === newTask.id) {
      tasks.splice(i, 1, newTask)
      return true
    }
  })
}

function deleteTask (task, tasks) {
  tasks.some(function (t, i) {
    if (t.id === task.id) {
      tasks.splice(i, 1)
      return true
    }
  })
}

function getActiveTasks (tasks) {
  return tasks.filter(function (task) {
    if (task.done === false) {
      return true
    }

    return false
  })
}

function toggleAllDone (tasks, done) {
  tasks.forEach(function (task) {
    task.done = done
  })
}

router.get('/tasks', function (req, res) {
  res.json(req.session.tasks)
})

router.put('/task', function (req, res) {
  var task = req.body
  updateTask(task, req.session.tasks)

  res.json({})
})

router.post('/task', function (req, res) {
  var task = req.body
  task.id = String(Date.now())

  req.session.tasks.push(task)

  res.json({})
})

router.put('/task/all', function (req, res) {
  toggleAllDone(req.session.tasks, req.body.done)

  if (req.is('application/json')) {
    // return the new task
    res.json(req.session.tasks)
  } else {
    // when it's a form request,
    // redirect, js is probably disabled in the browser
    res.redirect('/')
  }
})

router.delete('/task', function (req, res) {
  var task = req.body
  deleteTask(task, req.session.tasks)

  res.json({})
})

router.get('/task/clear', function (req, res) {
  req.session.tasks = getActiveTasks(req.session.tasks)

  if (req.is('application/json')) {
    // return the new tasks
    res.json(req.session.tasks)
  } else {
    // form request
    // redirect, js is probably disabled in the browser
    res.redirect('/')
  }
})

// api methods for non-ajax requests
router.get('/task/:id/done', function (req, res) {
  var task = getTask(req.params.id, req.session.tasks)
  task.done = !task.done
  updateTask(task, req.session.tasks)

  res.redirect('/')
})

router.get('/task/:id/delete', function (req, res) {
  var task = getTask(req.params.id, req.session.tasks)
  deleteTask(task, req.session.tasks)

  res.redirect('/')
})

module.exports = function (app) {
  // default tasks
  app.use(function (req, res, next) {
    if (!req.session.tasks) {
      req.session.tasks = [];
    }

    next()
  })

  // cors support
  app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
  }))

  return router
}
