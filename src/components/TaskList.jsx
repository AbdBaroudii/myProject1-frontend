import { useState } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import TaskItem from './TaskItem'
import { FaSearch, FaFilter } from 'react-icons/fa'

function TaskList({ 
  tasks, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  onOpen,
  filter, 
  onFilterChange,
  searchQuery,
  onSearchChange,
  onDragEnd,
  loading
}) {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <FaSearch 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="input-field pl-10"
              placeholder="Search tasks..."
              aria-label="Search tasks"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center justify-center gap-2 sm:w-auto"
            aria-expanded={showFilters}
            aria-controls="filters"
          >
            <FaFilter aria-hidden="true" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {showFilters && (
          <div 
            id="filters" 
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div>
              <label 
                htmlFor="priority-filter" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Priority
              </label>
              <select
                id="priority-filter"
                value={filter.priority}
                onChange={(e) => onFilterChange({ ...filter, priority: e.target.value })}
                className="select-field"
                aria-label="Filter by priority"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label 
                htmlFor="status-filter" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Status
              </label>
              <select
                id="status-filter"
                value={filter.status}
                onChange={(e) => onFilterChange({ ...filter, status: e.target.value })}
                className="select-field"
                aria-label="Filter by status"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Open/Pending</option>
                <option value="completed">Done/Completed</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Tasks ({tasks.length})
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {searchQuery || filter.priority !== 'all' || filter.status !== 'all'
                ? 'No tasks match your filters.'
                : 'No tasks yet. Add one above!'}
            </p>
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="tasks">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`space-y-3 ${
                    snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2' : ''
                  }`}
                >
                  {tasks.map((task, index) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      index={index}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggleStatus={onToggleStatus}
                      onOpen={onOpen}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  )
}

export default TaskList

