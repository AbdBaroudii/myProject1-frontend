import { FaTimes, FaCalendar, FaTag, FaFlag } from 'react-icons/fa'

function TaskDetailsModal({ task, isOpen, onClose }) {
  if (!isOpen || !task) return null

  const priorityColors = {
    low: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    high: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
  }

  const priorityLabels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  }

  const statusColors = {
    open: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    in_progress: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    done: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  }

  const statusLabels = {
    open: 'Open',
    in_progress: 'In Progress',
    done: 'Done',
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-details-title"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2
            id="task-details-title"
            className="text-2xl font-bold text-gray-900 dark:text-gray-100"
          >
            Task Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <FaTimes className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {task.title}
            </h3>
            {task.description && (
              <p className="text-gray-600 dark:text-gray-300 mt-3">
                {task.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <FaFlag className="text-gray-400 dark:text-gray-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Priority</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                    priorityColors[task.priority] || priorityColors.medium
                  }`}
                >
                  {priorityLabels[task.priority] || 'Medium'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaTag className="text-gray-400 dark:text-gray-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                    statusColors[task.status] || statusColors.open
                  }`}
                >
                  {statusLabels[task.status] || 'Open'}
                </span>
              </div>
            </div>

            {task.due_date && (
              <div className="flex items-center gap-3">
                <FaCalendar className="text-gray-400 dark:text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
                  <p className="text-gray-900 dark:text-gray-100 mt-1">
                    {formatDate(task.due_date)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <FaCalendar className="text-gray-400 dark:text-gray-500" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                <p className="text-gray-900 dark:text-gray-100 mt-1">
                  {formatDate(task.created_at)}
                </p>
              </div>
            </div>
          </div>

          {task.updated_at && task.updated_at !== task.created_at && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {formatDate(task.updated_at)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskDetailsModal

