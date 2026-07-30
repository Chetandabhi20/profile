function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-panel">
      {/* terminal title bar */}
      <div className="error-panel__bar">
        <span className="error-panel__dot error-panel__dot--red" />
        <span className="error-panel__dot error-panel__dot--yellow" />
        <span className="error-panel__dot error-panel__dot--green" />
        <span className="error-panel__bar-title">~/error-log</span>
      </div>

      <div className="error-panel__body">
        <div className="error-panel__line">
          <span className="error-panel__prompt">guest@portfolio:~$</span>
          <span className="error-panel__cmd"> fetch --repos</span>
        </div>
        <div className="error-panel__line">
          <span className="error-panel__label">[ERROR]</span>
          <span className="error-panel__msg"> {message}</span>
        </div>
        <div className="error-panel__line">
          <span className="error-panel__hint">Process exited with code 1. Run retry to attempt reconnection.</span>
        </div>
      </div>

      <div className="error-panel__actions">
        <button className="error-panel__retry" onClick={onRetry}>
          <span className="error-panel__retry-prompt">$</span> retry --fetch
        </button>
      </div>
    </div>
  )
}

export default ErrorMessage
