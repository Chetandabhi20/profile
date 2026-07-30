import About from './About'
import Skills from './Skills'

function Home({ skillsList }) {
  return (
    <div className="home-route">
      <About />
      <Skills skillList={skillsList} />
    </div>
  )
}

export default Home
