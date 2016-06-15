/* api service
 */

var util = require('./util')

function ApiService () {
  apiUrl = '/api'

  if (typeof window !== 'undefined') {
    if (window.location.host.indexOf('8080') !== -1) {
      // static site uses
      apiUrl = '//localhost:3000/api'
    }
  }

  var listTasks = function (params, callback) {
    util.fetch(`${apiUrl}/tasks`, {
      data: params
    }, callback)
  }

  var addTask = function (params, callback) {
    util.fetch(`${apiUrl}/task`, {
      type: 'POST',
      data: params
    }, callback)
  }

  var updateTask = function (params, callback) {
    util.fetch(`${apiUrl}/task`, {
      type: 'PUT',
      data: params
    }, callback)
  }

  var deleteTask = function (params, callback) {
    util.fetch(`${apiUrl}/task`, {
      type: 'DELETE',
      data: params
    }, callback)
  }

  function clearCompletedTasks (params, callback) {
    util.fetch(`${apiUrl}/task/clear`, {
      data: params
    }, callback)
  }

  function toggleAllDone (params, callback) {
    util.fetch(`${apiUrl}/task/all`, {
      type: 'PUT',
      data: params
    }, callback)
  }

  return {
    listTasks: listTasks,
    addTask: addTask,
    updateTask: updateTask,
    deleteTask: deleteTask,

    clearCompletedTasks: clearCompletedTasks,
    toggleAllDone: toggleAllDone
  }
}

module.exports = ApiService()
