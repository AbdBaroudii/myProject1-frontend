import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Header from './components/Header'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import TaskDetailsModal from './components/TaskDetailsModal'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import { tasksAPI } from './services/api'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useDebounce } from './hooks/useDebounce'

function TaskTrackerApp() {
  const { user, isAuthenticated, logout } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false)
  const [filter, setFilter] = useState({ priority: 'all', status: 'all' })
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const [editingTask, setEditingTask] = useState(null)
  const [showRegister, setShowRegister] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [dashboardRefreshKey, setDashboardRefreshKey] = useState(0)
  const [activePage, setActivePage] = useState('dashboard') // 'dashboard' | 'tasks'

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Load tasks when authenticated, filter, or search changes
  useEffect(() => {
    if (isAuthenticated) {
      loadTasks()
    } else {
      setTasks([])
    }
  }, [isAuthenticated, filter, debouncedSearchQuery])

  const loadTasks = async () => {
    setLoading(true)
    setError(null)
    try {
      const filters = {
        ...(filter.priority !== 'all' && { priority: filter.priority }),
        ...(filter.status !== 'all' && { status: filter.status }),
        ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
      }
      const response = await tasksAPI.getTasks(filters)
      setTasks(response.data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error loading tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const addTask = async (taskData) => {
    try {
      setError(null)
      const response = await tasksAPI.createTask(taskData)
      const created = response.data || response
      // Append the newly created task to the list
      setTasks(prev => [...prev, created])
      setEditingTask(null)
      setDashboardRefreshKey(prev => prev + 1)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const updateTask = async (id, updatedTask) => {
    try {
      setError(null)
      const response = await tasksAPI.updateTask(id, updatedTask)
      const updated = response.data || response
      // Update the task locally so UI reflects changes immediately
      setTasks(prev =>
        prev.map(task =>
          task.id === id ? { ...task, ...updated } : task
        ),
      )
      setEditingTask(null)
      setDashboardRefreshKey(prev => prev + 1)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const deleteTask = async (id) => {
    try {
      setError(null)
      await tasksAPI.deleteTask(id)
      await loadTasks() // Reload tasks from API
      setDashboardRefreshKey(prev => prev + 1)
    } catch (err) {
      setError(err.message)
    }
  }

  const toggleStatus = async (task) => {
    try {
      setError(null)
      // Toggle between open and done status values expected by backend
      const newStatus = task.status === 'done' ? 'open' : 'done'
      // Send only the status field in the body as required
      const response = await tasksAPI.updateTask(task.id, { status: newStatus })
      const updated = response.data || { ...task, status: newStatus }
      // Update the task locally so UI reflects new status
      setTasks(prev =>
        prev.map(t =>
          t.id === task.id ? { ...t, ...updated } : t
        ),
      )
      setDashboardRefreshKey(prev => prev + 1)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDragEnd = (result) => {
    // Note: Drag and drop reordering is client-side only
    // If you want to persist order, you'd need an order field in the API
    if (!result.destination) return

    const items = Array.from(tasks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setTasks(items)
  }

  // Show login/register if not authenticated
  if (!isAuthenticated) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSwitchToRegister={() => setShowRegister(true)} />
    )
  }

  const completedCount = tasks.filter(t => t.status === 'done').length

  const handleStartEdit = (task) => {
    // Ensure we have the full task object and open the edit modal
    if (!task) return
    setEditingTask(task)
    setIsEditOpen(true)
  }

  const handleCancelEdit = () => {
    setEditingTask(null)
    setIsEditOpen(false)
  }

  const handleOpenTask = (task) => {
    if (!task) return
    setSelectedTask(task)
    setIsOpenModal(true)
  }

  const handleCloseModal = () => {
    setIsOpenModal(false)
    setSelectedTask(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
        taskCount={tasks.length}
        completedCount={completedCount}
        user={user}
        onLogout={logout}
        activePage={activePage}
        onChangePage={setActivePage}
      />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {activePage === 'dashboard' ? (
          <Dashboard refreshKey={dashboardRefreshKey} />
        ) : (
          <>
            {/* Add Task form (always visible) */}
            <TaskForm 
              onSubmit={addTask}
              editingTask={null}
              onCancel={() => {}}
              loading={loading}
            />

            {/* Edit Task modal */}
            {isEditOpen && editingTask && (
              <div
                className="fixed inset-0 z-40 flex items-center justify-center bg-black/40"
                role="dialog"
                aria-modal="true"
              >
                <div className="w-full max-w-xl mx-4">
                  <TaskForm 
                    onSubmit={(taskData) => updateTask(editingTask.id, taskData)}
                    editingTask={editingTask}
                    onCancel={handleCancelEdit}
                    loading={loading}
                  />
                </div>
              </div>
            )}

            <TaskList
              tasks={tasks}
              onEdit={handleStartEdit}
              onDelete={deleteTask}
              onToggleStatus={toggleStatus}
              onOpen={handleOpenTask}
              filter={filter}
              onFilterChange={setFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onDragEnd={handleDragEnd}
              loading={loading}
            />

            {/* Task Details Modal */}
            <TaskDetailsModal
              task={selectedTask}
              isOpen={isOpenModal}
              onClose={handleCloseModal}
            />
          </>
        )}
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <TaskTrackerApp />
    </AuthProvider>
  )
}

export default App

