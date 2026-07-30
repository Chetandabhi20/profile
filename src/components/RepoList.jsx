function RepoList({ repos }) {
  return (
    <div className="projects__stack">
      {repos.map((repo, index) => (
        <article
          key={repo.id}
          className="proj proj--animate"
          style={{ animationDelay: `${index * 0.12}s` }}
        >
          {/* terminal-style title bar */}
          <div className="proj__bar">
            <span className="proj__dot" />
            <span className="proj__dot" />
            <span className="proj__dot" />
            <span className="proj__path">~/repos/{repo.name}</span>
          </div>

          <div className="proj__body">
            <div className="proj__meta">
              <span className="proj__index">&#47;&#47; [{String(index).padStart(2, '0')}]</span>
              <h3 className="proj__title">{repo.name}</h3>
              {repo.stargazers_count > 0 && (
                <span className="repo-stars">★ {repo.stargazers_count}</span>
              )}
            </div>

            <p className="proj__desc">
              {repo.description || 'No description provided.'}
            </p>

            {/* language tag */}
            {repo.language && (
              <span className="repo-lang">
                <span className="repo-lang__dot" />{repo.language}
              </span>
            )}

            {/* git clone styled link */}
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="proj__link"
            >
              <span className="proj__link-prompt">$</span> git clone {repo.name}
            </a>
          </div>
        </article>
      ))}
    </div>
  )
}

export default RepoList
