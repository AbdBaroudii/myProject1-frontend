import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTimes } from 'react-icons/fa'

function TaskForm({ onSubmit, editingTask, onCancel, loading }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState('open')

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '')
      setDescription(editingTask.description || '')
      setPriority(editingTask.priority || 'medium')
      setDueDate(editingTask.due_date ? editingTask.due_date.split('T')[0] : '')
      setStatus(editingTask.status || 'open')
    } else {
      setTitle('')
      setDescription('')
      setPriority('medium')
      setDueDate('')
      setStatus('open')
    }
  }, [editingTask])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (title.trim()) {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        priority,
        ...(dueDate && { due_date: dueDate }),
        ...(editingTask && { status }), // Only include status when editing
      }
      
      try {
        await onSubmit(taskData)
        if (!editingTask) {
          setTitle('')
          setDescription('')
          setPriority('medium')
          setDueDate('')
          setStatus('open')
        }
      } catch (err) {
        // Error handling is done in parent component
      }
    }
  }

  return (
    <div className="mb-8 animate-fade-in">
      <form 
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200"
      >
        <div className="flex items-center gap-2 mb-4">
          {editingTask ? (
            <>
              <FaEdit className="text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Edit Task
              </h2>
            </>
          ) : (
            <>
              <FaPlus className="text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Add New Task
              </h2>
            </>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label 
              htmlFor="title" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Title <span className="text-red-500" aria-label="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="Enter task title"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label 
              htmlFor="description" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field resize-none"
              rows="3"
              placeholder="Enter task description"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label 
                htmlFor="priority" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="select-field"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label 
                htmlFor="dueDate" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {editingTask && (
            <div>
              <label 
                htmlFor="status" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="select-field"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingTask ? (
                <>
                  <FaEdit aria-hidden="true" />
                  Update Task
                </>
              ) : (
                <>
                  <FaPlus aria-hidden="true" />
                  Add Task
                </>
              )}
            </button>
            {editingTask && (
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary flex items-center justify-center gap-2 px-6"
                aria-label="Cancel editing"
              >
                <FaTimes aria-hidden="true" />
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default TaskForm

