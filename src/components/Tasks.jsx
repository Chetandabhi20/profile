import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTasks, createTask, updateTask, deleteTask } from '../services/api'
import Spinner from './Spinner'
import ErrorMessage from './ErrorMessage'
import TaskForm from './TaskForm'
import TaskList from './TaskList'
import Toast from './Toast'

/**
 * Tasks — Main task management page (orchestrator).
 * Handles all CRUD state management, loading/error states,
 * and toast notifications for every operation.
 * (Practical 7: Redirects to /login on 401 Unauthorized)
 */
function Tasks() {
  const navigate = useNavigate()

  /* ── State ── */
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [toasts, setToasts] = useState([])

  /* ── Toast helper ── */
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  /* ── Supplementary Problem #2: Redirect to login on 401 ── */
  useEffect(() => {
    const onExpired = () => {
      navigate('/login')
    }
    window.addEventListener('auth:expired', onExpired)
    return () => window.removeEventListener('auth:expired', onExpired)
  }, [navigate])

  /* ── Fetch all tasks (used on mount + after every write) ── */
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getTasks()
      setTasks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  /* ── Create / Update handler ── */
  const handleSubmit = async (taskData) => {
    try {
      setSubmitting(true)
      if (editingTask) {
        await updateTask(editingTask._id, taskData)
        addToast('Task updated successfully')
        setEditingTask(null)
      } else {
        await createTask(taskData)
        addToast('Task created successfully')
      }
      await fetchTasks() // re-fetch to sync with DB
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  /* ── Delete handler (with confirmation dialog) ── */
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this task? This action cannot be undone.'
    )
    if (!confirmed) return

    try {
      setSubmitting(true)
      await deleteTask(id)
      addToast('Task deleted successfully')
      await fetchTasks()
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  /* ── Toggle completed handler ── */
  const handleToggle = async (task) => {
    try {
      await updateTask(task._id, { completed: !task.completed })
      addToast(
        task.completed ? 'Task marked as pending' : 'Task marked as completed'
      )
      await fetchTasks()
    } catch (err) {
      addToast(err.message, 'error')
    }
  }

  /* ── Edit handler ── */
  const handleEdit = (task) => {
    setEditingTask(task)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* ── Cancel editing ── */
  const handleCancel = () => setEditingTask(null)

  /* ── Render ── */
  return (
    <section id="tasks" className="section">
      <h2 className="section__title">Task Manager</h2>

      {/* Toast notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>

      {/* Task creation / edit form */}
      <TaskForm
        editingTask={editingTask}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitting={submitting}
      />

      {/* Task list — loading / error / data */}
      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchTasks} />
      ) : (
        <TaskList
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggle={handleToggle}
        />
      )}
    </section>
  )
}

export default Tasks
