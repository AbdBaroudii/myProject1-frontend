import { Draggable } from 'react-beautiful-dnd'
import { FaEdit, FaTrash, FaGripVertical, FaCalendar, FaEye } from 'react-icons/fa'
import { BsCheckCircle, BsCircle } from 'react-icons/bs'

function TaskItem({ task, index, onEdit, onDelete, onToggleStatus, onOpen }) {
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

  const isCompleted = task.status === 'done'

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`task-item ${
            snapshot.isDragging ? 'shadow-xl scale-105' : ''
          } ${isCompleted ? 'opacity-75' : ''} animate-slide-in`}
        >
          <div className="flex items-start gap-4">
            <div
              {...provided.dragHandleProps}
              className="mt-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing"
              aria-label="Drag to reorder"
            >
              <FaGripVertical aria-hidden="true" />
            </div>

            <button
              onClick={() => onToggleStatus(task)}
              className="mt-1 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label={isCompleted ? 'Mark as open' : 'Mark as done'}
            >
              {isCompleted ? (
                <BsCheckCircle className="text-2xl text-green-600 dark:text-green-400" aria-hidden="true" />
              ) : (
                <BsCircle className="text-2xl text-gray-400 dark:text-gray-500" aria-hidden="true" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3
                  className={`text-lg font-semibold ${
                    isCompleted
                      ? 'line-through text-gray-500 dark:text-gray-400'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {task.title}
                </h3>
                <div className="flex gap-2 flex-shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      priorityColors[task.priority] || priorityColors.medium
                    }`}
                  >
                    {priorityLabels[task.priority] || 'Medium'}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[task.status] || statusColors.open
                    }`}
                  >
                    {statusLabels[task.status] || 'Open'}
                  </span>
                </div>
              </div>

              {task.description && (
                <p
                  className={`text-sm mb-2 ${
                    isCompleted
                      ? 'text-gray-400 dark:text-gray-500 line-through'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {task.description}
                </p>
              )}

              {task.due_date && (
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <FaCalendar aria-hidden="true" />
                  <span>Due: {formatDate(task.due_date)}</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => onOpen?.(task)}
                  className="btn-primary text-sm py-1.5 px-3 flex items-center gap-2"
                  aria-label={`Open task details: ${task.title}`}
                >
                  <FaEye aria-hidden="true" />
                  <span className="hidden sm:inline">Open</span>
                </button>
                <button
                  onClick={() => onEdit(task)}
                  className="btn-secondary text-sm py-1.5 px-3 flex items-center gap-2"
                  aria-label={`Edit task: ${task.title}`}
                >
                  <FaEdit aria-hidden="true" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="btn-danger text-sm py-1.5 px-3 flex items-center gap-2"
                  aria-label={`Delete task: ${task.title}`}
                >
                  <FaTrash aria-hidden="true" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}

export default TaskItem

