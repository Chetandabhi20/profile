import { useState, useEffect } from 'react'

/**
 * TaskForm — Terminal-styled create / edit form.
 * @param {{ editingTask: object|null, onSubmit: (data) => Promise, onCancel: () => void, submitting: boolean }} props
 */
function TaskForm({ editingTask, onSubmit, onCancel, submitting }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')

  /* Pre-fill when editing */
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '')
      setDescription(editingTask.description || '')
      setPriority(editingTask.priority || 'medium')
    } else {
      setTitle('')
      setDescription('')
      setPriority('medium')
    }
  }, [editingTask])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({ title: title.trim(), description: description.trim(), priority })
  }

  const isEditing = !!editingTask

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      {/* terminal title bar */}
      <div className="task-form__bar">
        <span className="task-form__dot" />
        <span className="task-form__dot" />
        <span className="task-form__dot" />
        <span className="task-form__bar-title">
          ~/{isEditing ? 'edit-task' : 'new-task'}
        </span>
      </div>

      <div className="task-form__body">
        {/* Title */}
        <div className="task-form__field">
          <label className="task-form__label" htmlFor="task-title">
            <span className="task-form__prompt">$</span> title
            <span className="task-form__required">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            className="task-form__input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title..."
            required
            autoFocus
          />
        </div>

        {/* Description */}
        <div className="task-form__field">
          <label className="task-form__label" htmlFor="task-desc">
            <span className="task-form__prompt">$</span> description
          </label>
          <textarea
            id="task-desc"
            className="task-form__input task-form__textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description (optional)..."
            rows={3}
          />
        </div>

        {/* Priority */}
        <div className="task-form__field">
          <label className="task-form__label" htmlFor="task-priority">
            <span className="task-form__prompt">$</span> priority
          </label>
          <select
            id="task-priority"
            className="task-form__input task-form__select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
        </div>

        {/* Actions */}
        <div className="task-form__actions">
          <button
            type="submit"
            className="task-form__btn task-form__btn--submit"
            disabled={submitting || !title.trim()}
          >
            <span className="task-form__btn-prompt">$</span>
            {submitting
              ? 'processing...'
              : isEditing
                ? 'git commit --amend'
                : 'git commit -m "new task"'}
          </button>

          {isEditing && (
            <button
              type="button"
              className="task-form__btn task-form__btn--cancel"
              onClick={onCancel}
              disabled={submitting}
            >
              <span className="task-form__btn-prompt">$</span> git reset
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

export default TaskForm
