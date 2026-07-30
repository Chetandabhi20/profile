function Skills({ skillList }) {
  return (
    <section id="skills" className="section">
      <h2 className="section__title">Skills</h2>
      <ul className="skills__list">
        {skillList.map((skill) => (
          <li key={skill} className="skills__item">
            {skill}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Skills
