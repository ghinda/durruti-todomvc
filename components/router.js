/* router component
 */

var durruti = require('durruti')
var TaskAdd = require('./task/task-add')
var TaskList = require('./task/task-list')
var Footer = require('./footer')
var routerStore = require('./router-store')

function Router () {
  var $container

  function click (e) {
    if (e.target.tagName.toLowerCase() !== 'a') {
      return
    }

    e.preventDefault()

    window.history.pushState({}, '', e.target.href)
    routerStore.set(window.location.pathname)

    // for performance, you could re-render individual components
    // when the store changes, instead of re-rendering everything.
    durruti.render(Router, $container)
  }

  this.mount = function (container) {
    $container = container

    $container.addEventListener('click', click)
  }

  this.render = function () {
    return `
      <section class="todoapp">
        <header class="header">
          <h1>todos</h1>
          ${durruti.render(TaskAdd)}
        </header>

        ${durruti.render(TaskList)}

        ${durruti.render(Footer)}
      </section>
    `
  }
}

module.exports = Router
