/* task-add
 */

var taskListStore = require('./task-list-store')
var api = require('../../api-client')

function TaskAdd () {
  var self = this

  function mount ($container) {
    var $form = $container.querySelector('form')
    var $taskName = $container.querySelector('.task-add-name')

    $form.addEventListener('submit', function (e) {
      e.preventDefault()

      if (!$taskName.value) {
        return
      }

      var newTask = {
        name: $taskName.value,
        done: false
      }

      // add to local store instantly
      var tasks = taskListStore.get()
      tasks.push(newTask)

      taskListStore.set(tasks)

      // add to api
      api.addTask(newTask, function (err, res) {
        if (err) {
          // TODO handle errors
          return
        }

        // update task with id from api
        newTask.id = res.id

        // refresh the task list store
        taskListStore.set(tasks)
      })

      // clear input value
      $taskName.value = ''
    })
  }

  function render () {
    return `
      <div>
        <form action="/api/task" method="POST">
          <input class="new-todo task-add-name" name="name" placeholder="What needs to be done?" autofocus>
        </form>
      </div>
    `
  }

  return {
    render: render,
    mount: mount
  }
}

module.exports = TaskAdd
