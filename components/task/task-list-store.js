/* task-list-store
 */

var Store = require('durruti/store')
var api = require('../../api-client')

var taskListStore = new Store()

if (typeof window !== 'undefined') {
  taskListStore.set(window['DURRUTI_STATE'].taskListStore)
}

// default value
if (!taskListStore.get()) {
  taskListStore.set([])
}

module.exports = taskListStore
