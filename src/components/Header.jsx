import { FaTasks, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { BsSun, BsMoon } from 'react-icons/bs'

function Header({
  darkMode,
  toggleDarkMode,
  taskCount,
  completedCount,
  user,
  onLogout,
  activePage,
  onChangePage,
}) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md transition-colors duration-200">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <FaTasks className="text-3xl text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Task Tracker
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {completedCount} of {taskCount} tasks completed
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {user && (
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <FaUser className="text-gray-500 dark:text-gray-400" aria-hidden="true" />
                  <span className="hidden sm:inline">{user.name || user.email}</span>
                </div>
              )}
              
              <button
                onClick={toggleDarkMode}
                className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? (
                  <BsSun className="text-2xl text-yellow-500" aria-hidden="true" />
                ) : (
                  <BsMoon className="text-2xl text-gray-700" aria-hidden="true" />
                )}
              </button>
              
              <button
                onClick={onLogout}
                className="btn-secondary flex items-center gap-2 text-sm py-2 px-4"
                aria-label="Logout"
              >
                <FaSignOutAlt aria-hidden="true" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          <nav
            className="flex items-center gap-2 text-sm bg-gray-100 dark:bg-gray-900/40 rounded-lg p-1"
            aria-label="Main navigation"
          >
            <button
              type="button"
              onClick={() => onChangePage?.('dashboard')}
              className={`flex-1 px-3 py-2 rounded-md text-center transition-colors ${
                activePage === 'dashboard'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => onChangePage?.('tasks')}
              className={`flex-1 px-3 py-2 rounded-md text-center transition-colors ${
                activePage === 'tasks'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Tasks
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

