/* task-list-store
 */

var durruti = require('durruti')
var api = require('../../api-client')
var taskListStore = require('./task-list-store')
var TaskListItem = require('./task-list-item')
var routerStore = require('../router-store')

function TaskList () {
  var self = this
  var $container
  var tasks = taskListStore.get()
  self.allDone = checkAllDone()

  // in browser, get the task list from the api,
  // when not cached - for static html.
  if (typeof window !== 'undefined' && !tasks.length) {
    api.listTasks({}, function (err, res) {
      if (err) {
        // TODO handle errors
        return
      }

      taskListStore.set(res)
    })
  }

  self.mount = function (container) {
    $container = container

    $container.querySelector('.toggle-all').addEventListener('change', allDone)

    taskListStore.on('change', taskListChange)
  }

  self.unmount = function () {
    taskListStore.off('change', taskListChange)
  }

  function allDone (e) {
    self.allDone = e.target.checked

    // save in local store
    var allTasks = taskListStore.get()
    allTasks.forEach(function (task) {
      task.done = self.allDone
    })

    taskListStore.set(allTasks)

    // save in api
    api.toggleAllDone({
      done: self.allDone
    })
  }

  function filterTasks (tasks, filter) {
    if (filter === 'all') {
      return tasks
    }

    if (filter === 'completed') {
      return tasks.filter(function (task) {
        if (task.done === true) {
          return true
        }
      })
    }

    if (filter === 'active') {
      return tasks.filter(function (task) {
        if (task.done === false) {
          return true
        }
      })
    }
  }

  function updateTaskList () {
    var route = routerStore.get()
    var visible = 'all'

    if (route === '/completed') {
      visible = 'completed'
    } else if (route === '/active') {
      visible = 'active'
    }

    tasks = filterTasks(taskListStore.get(), visible)
  }

  function taskListChange () {
    updateTaskList()
    durruti.render(self, $container)
  }

  function checkAllDone () {
    return tasks.every(function (task) {
      if (task.done !== true) {
        return false
      }

      return true
    })
  }

  self.render = function () {
    return `
      <section class="main ${taskListStore.get().length ? 'has-tasks' : ''}">
        <input class="toggle-all" type="checkbox" ${self.allDone ? 'checked' : ''}>
        <label for="toggle-all">Mark all as complete</label>
        <ul class="todo-list">
          ${tasks.map(function (task) {
            var taskItem = new TaskListItem()
            taskItem.task = task

            return durruti.render(taskItem)
          }).join('')}
        </ul>
      </section>
    `
  }

  // get and filter the initial task list
  updateTaskList()

}

module.exports = TaskList
