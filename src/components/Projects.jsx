import { useState, useEffect } from 'react'
import Spinner from './Spinner'
import ErrorMessage from './ErrorMessage'
import RepoList from './RepoList'

const API_URL = 'https://api.github.com/users/Chetandabhi20/repos'

function Projects() {
  /* ── Async state management ── */
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  /* ── Fetch logic (reusable for retry) ── */
  const fetchRepos = () => {
    setLoading(true)
    setError(null)

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        return res.json()
      })
      .then((data) => setRepos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  /* ── Trigger fetch on component mount ── */
  useEffect(() => {
    fetchRepos()
  }, [])

  /* ── Filter repos by search term ── */
  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  /* ── Conditional rendering based on async state ── */
  if (loading) return (
    <section id="projects" className="section">
      <h2 className="section__title">Projects</h2>
      <Spinner />
    </section>
  )

  if (error) return (
    <section id="projects" className="section">
      <h2 className="section__title">Projects</h2>
      <ErrorMessage message={error} onRetry={fetchRepos} />
    </section>
  )

  return (
    <section id="projects" className="section">
      <h2 className="section__title">Projects</h2>

      {/* Search / filter input */}
      <div className="repo-search">
        <span className="repo-search__prompt">guest@portfolio:~$</span>
        <span className="repo-search__cmd"> grep -i "</span>
        <input
          type="text"
          className="repo-search__input"
          placeholder="search repos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="repo-search__cmd">" ./repos/*</span>
      </div>

      {/* Results count */}
      <p className="repo-count">
        <span className="repo-count__num">{filteredRepos.length}</span> repositories found
        {searchTerm && <span className="repo-count__filter"> matching "{searchTerm}"</span>}
      </p>

      {/* Repository list */}
      {filteredRepos.length > 0 ? (
        <RepoList repos={filteredRepos} />
      ) : (
        <p className="repo-empty">No repositories match your search.</p>
      )}
    </section>
  )
}

export default Projects
