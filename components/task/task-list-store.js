/* task-list-store
 */

var Store = require('durruti/store')
var api = require('../../api-client')

var taskListStore = new Store('taskListStore')

// default value
if (!taskListStore.get()) {
  taskListStore.set([])
}

module.exports = taskListStore
