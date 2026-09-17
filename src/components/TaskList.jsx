/**
 * TaskList — Renders terminal-styled task cards with Edit / Delete / Toggle actions.
 * @param {{ tasks: Array, onEdit: (task) => void, onDelete: (id) => void, onToggle: (task) => void }} props
 */
function TaskList({ tasks, onEdit, onDelete, onToggle }) {
  if (tasks.length === 0) {
    return (
      <p className="task-empty">
        No tasks found. Run <span className="task-empty__cmd">$ create-task</span> to get started.
      </p>
    )
  }

  /**  Map priority to a CSS modifier class */
  const priorityClass = (p) =>
    p === 'high' ? 'task-badge--high' : p === 'low' ? 'task-badge--low' : 'task-badge--med'

  return (
    <div className="task-list">
      {tasks.map((task, index) => (
        <article
          key={task._id}
          className={`task-card task-card--animate${task.completed ? ' task-card--done' : ''}`}
          style={{ animationDelay: `${index * 0.08}s` }}
        >
          {/* terminal title bar */}
          <div className="task-card__bar">
            <span className="task-card__dot" />
            <span className="task-card__dot" />
            <span className="task-card__dot" />
            <span className="task-card__path">~/tasks/{task.title.toLowerCase().replace(/\s+/g, '-')}</span>
          </div>

          <div className="task-card__body">
            {/* Header row */}
            <div className="task-card__header">
              <span className="task-card__index">// [{String(index).padStart(2, '0')}]</span>
              <h3 className="task-card__title">{task.title}</h3>
              <span className={`task-badge ${priorityClass(task.priority)}`}>
                {task.priority}
              </span>
            </div>

            {/* Description */}
            {task.description && (
              <p className="task-card__desc">{task.description}</p>
            )}

            {/* Meta row */}
            <div className="task-card__meta">
              <label className="task-card__status">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggle(task)}
                  className="task-card__checkbox"
                />
                <span className={task.completed ? 'task-card__status-text--done' : 'task-card__status-text'}>
                  {task.completed ? 'completed' : 'pending'}
                </span>
              </label>
              <span className="task-card__date">
                {new Date(task.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Actions */}
            <div className="task-card__actions">
              <button
                className="task-card__btn task-card__btn--edit"
                onClick={() => onEdit(task)}
              >
                <span className="task-card__btn-prompt">$</span> vim task
              </button>
              <button
                className="task-card__btn task-card__btn--delete"
                onClick={() => onDelete(task._id)}
              >
                <span className="task-card__btn-prompt">$</span> rm task
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

export default TaskList
