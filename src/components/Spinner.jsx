function Spinner() {
  return (
    <div className="spinner">
      <div className="spinner__terminal">
        {/* terminal title bar */}
        <div className="spinner__bar">
          <span className="spinner__dot" />
          <span className="spinner__dot" />
          <span className="spinner__dot" />
          <span className="spinner__bar-title">~/fetching-data</span>
        </div>

        <div className="spinner__body">
          <div className="spinner__line">
            <span className="spinner__prompt">guest@portfolio:~$</span>
            <span className="spinner__cmd"> curl api.github.com</span>
          </div>
          <div className="spinner__line spinner__line--loading">
            <span className="spinner__text">Establishing connection</span>
            <span className="spinner__dots" />
          </div>
          <div className="spinner__line spinner__line--loading">
            <span className="spinner__text">Fetching repositories</span>
            <span className="spinner__dots" />
          </div>
          <div className="spinner__line">
            <span className="spinner__prompt">▌</span>
          </div>
        </div>

        {/* scanning bar animation */}
        <div className="spinner__scanline" />
      </div>
    </div>
  )
}

export default Spinner
