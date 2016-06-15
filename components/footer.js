/* footer component
 */

var durruti = require('durruti')
var api = require('../api-client')
var TaskAdd = require('./task/task-add')
var TaskList = require('./task/task-list')
var taskListStore = require('./task/task-list-store')
var routerStore = require('./router-store')

function Footer () {
  var $container
  var self = this
  var route = routerStore.get()

  this.mount = function (container) {
    $container = container

    var $btnClear = $container.querySelector('.btn-task-list-clear')

    if ($btnClear) {
      $btnClear.addEventListener('click', function (e) {
        e.stopPropagation()
        e.preventDefault()

        // local store
        taskListStore.set(getTasksByStatus(false))

        // in api
        api.clearCompletedTasks()
      })
    }

    taskListStore.on('change', taskListChange)
  }

  this.unmount = function () {
    taskListStore.off('change', taskListChange)
  }

  function taskListChange () {
    durruti.render(Footer, $container)
  }

  function getTasksByStatus (status) {
    return taskListStore.get().filter(function (task) {
      if (task.done === status) {
        return true
      }

      return false
    })
  }

  this.render = function () {
    return `
      <footer class="footer ${taskListStore.get().length ? 'has-tasks' : ''}">
        <!-- This should be '0 items left' by default -->
        <span class="todo-count">
          <strong>${getTasksByStatus(false).length}</strong> items left
        </span>
        <ul class="filters">
          <li>
            <a href="/" class="${route === '/' ? 'selected' : ''}">All</a>
          </li>
          <li>
            <a href="/active" class="${route === '/active' ? 'selected' : ''}">Active</a>
          </li>
          <li>
            <a href="/completed" class="${route === '/completed' ? 'selected' : ''}">Completed</a>
          </li>
        </ul>

        <!-- Hidden if no completed items are left ↓ -->
        ${getTasksByStatus(true).length
          ? `<a href="/api/task/clear" class="btn-task-list-clear clear-completed">
            Clear completed
          </a>`
          : ''
        }
      </footer>
    `
  }
}

module.exports = Footer
