import { useEffect, useState } from 'react'
import { dashboardAPI } from '../services/api'
import { FaTasks, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'

function StatCard({ icon: Icon, label, value, subtitle, color }) {
  return (
    <div className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className={`flex items-center justify-center h-12 w-12 rounded-full ${color}`}>
        <Icon className="text-xl text-white" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  )
}

function PriorityBar({ label, count, total, color }) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{label}</span>
        <span>
          {count} ({percentage}%)
        </span>
      </div>
      <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}

function RecentTaskItem({ task }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
            {task.description}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-1">
          {task.priority?.toUpperCase()} • {task.status?.replace('_', ' ')}
        </p>
      </div>
      {task.due_date && (
        <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
          Due{' '}
          {new Date(task.due_date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </p>
      )}
    </div>
  )
}

function Dashboard({ refreshKey = 0 }) {
  const [stats, setStats] = useState(null)
  const [priorityStats, setPriorityStats] = useState(null)
  const [recentTasks, setRecentTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const loadDashboard = async () => {
      setLoading(true)
      setError(null)
      try {
        const [statsRes, priorityRes, recentRes] = await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getPriorityStats(),
          dashboardAPI.getRecentTasks(),
        ])

        if (!isMounted) return

        setStats(statsRes.data || statsRes)
        setPriorityStats(priorityRes.data || priorityRes)
        setRecentTasks(recentRes.data || recentRes || [])
      } catch (err) {
        if (!isMounted) return
        setError(err.message || 'Failed to load dashboard data.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadDashboard()

    return () => {
      isMounted = false
    }
  }, [refreshKey])

  // Map backend fields:
  // total, open, inProgress, completed
  const totalTasks = stats?.total ?? stats?.total_tasks ?? 0
  const openTasks = stats?.open ?? stats?.open_tasks ?? 0
  const inProgressTasks =
    stats?.inProgress ?? stats?.in_progress ?? stats?.in_progress_tasks ?? 0
  const completedTasks =
    stats?.completed ?? stats?.completed_tasks ?? stats?.done_tasks ?? 0

  const lowCount = priorityStats?.low ?? 0
  const mediumCount = priorityStats?.medium ?? 0
  const highCount = priorityStats?.high ?? 0

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Dashboard Overview
      </h2>

      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={FaTasks}
              label="Total Tasks"
              value={totalTasks}
              subtitle="All tasks in your workspace"
              color="bg-blue-500"
            />
            <StatCard
              icon={FaClock}
              label="Open"
              value={openTasks}
              subtitle="Tasks not started"
              color="bg-yellow-500"
            />
            <StatCard
              icon={FaExclamationTriangle}
              label="In Progress"
              value={inProgressTasks}
              subtitle="Currently being worked on"
              color="bg-purple-500"
            />
            <StatCard
              icon={FaCheckCircle}
              label="Completed"
              value={completedTasks}
              subtitle="Marked as done"
              color="bg-green-500"
            />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Priority Distribution
              </h3>
              <div className="space-y-4">
                <PriorityBar
                  label="High Priority"
                  count={highCount}
                  total={totalTasks}
                  color="bg-red-500"
                />
                <PriorityBar
                  label="Medium Priority"
                  count={mediumCount}
                  total={totalTasks}
                  color="bg-yellow-400"
                />
                <PriorityBar
                  label="Low Priority"
                  count={lowCount}
                  total={totalTasks}
                  color="bg-green-500"
                />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Recent Tasks
              </h3>
              {recentTasks.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No recent tasks to display.
                </p>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {recentTasks.map((task) => (
                    <RecentTaskItem key={task.id} task={task} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default Dashboard


