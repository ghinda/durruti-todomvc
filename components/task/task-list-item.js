/* task-list-item
 */

var api = require('../../api-client')
var taskListStore = require('./task-list-store')

function TaskListItem () {
  var $container
  var self = this
  self.task = {}

  this.mount = function (container) {
    $container = container
    var $btnCheck = $container.querySelector('.btn-task-list-item-done')
    var $btnDelete = $container.querySelector('.btn-task-list-item-delete')
    var $label = $container.querySelector('label')
    self.$input = $container.querySelector('.edit')

    $btnCheck.addEventListener('click', markTaskDone)
    $btnDelete.addEventListener('click', deleteTask)

    $label.addEventListener('dblclick', toggleTaskEdit)
    self.$input.addEventListener('blur', toggleTaskEdit)
    self.$input.addEventListener('blur', handleBlur)
    self.$input.addEventListener('keyup', handleKeys)
  }

  function markTaskDone (e) {
    e.stopPropagation()
    e.preventDefault()

    self.task.done = !self.task.done

    // update task in task-list store
    var tasks = taskListStore.get()
    tasks.some(function (task, i) {
      if (task.id === self.task.id) {
        tasks.splice(i, 1, self.task)
        return true
      }
    })

    taskListStore.set(tasks)

    // update item in api
    api.updateTask(self.task)
  }

  function deleteTask (e) {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }

    // remove from task-list store
    var tasks = taskListStore.get()
    tasks.some(function (task, i) {
      if (task.id === self.task.id) {
        tasks.splice(i, 1)
        return true
      }
    })

    taskListStore.set(tasks)

    // remove from api
    api.deleteTask(self.task)
  }

  function toggleTaskEdit (e) {
    var editingClassName = 'editing'
    $container.classList.toggle(editingClassName)

    if ($container.classList.contains(editingClassName)) {
      self.$input.focus()

      // place cursor at the end
      self.$input.selectionStart = self.$input.selectionEnd = self.$input.value.length
    }
  }

  function handleKeys (e) {
    var keyPress = e.key || e.keyCode
    var enterKey = (keyPress === 'Enter' || keyPress === 13)
    var escapeKey = (keyPress === 'Escape' || keyPress === 27)

    if (enterKey) {
      // trigger blur to save new name
      self.$input.blur()
    } else if (escapeKey) {
      // restore input value
      self.$input.value = self.task.name
      self.$input.blur()
    }
  }

  function handleBlur (e) {
    saveTask(self.$input.value)
  }

  function saveTask (newName) {
    // delete task if task name is blank
    if (newName === '') {
      deleteTask()
      return
    }

    // task name wasn't changed
    if (self.task.name === newName) {
      return
    }

    self.task.name = newName

    // update in store
    var tasks = taskListStore.get()
    var taskIndex
    tasks.some(function (task, i) {
      if (task.id === self.task.id) {
        taskIndex = i
        return true
      }
    })

    tasks[taskIndex] = self.task
    taskListStore.set(tasks)

    // update in api
    api.updateTask(self.task)
  }

  this.render = function () {
    return `
      <li class="task-list-item ${self.task.done === true ? 'completed' : ''}">
        <div class="view">
          <a href="/api/task/${self.task.id}/done" class="toggle btn-task-list-item-done">
            <span class="icon-label">
              Complete task
            </span>
          </a>

          <label>
            ${self.task.name}
          </label>

          <a href="/api/task/${self.task.id}/delete" class="destroy btn-task-list-item-delete">
            <span class="icon-label">
              Delete task
            </span>
          </a>
        </div>
        <input class="edit" value="${self.task.name}">
      </li>
    `
  }
}

module.exports = TaskListItem
