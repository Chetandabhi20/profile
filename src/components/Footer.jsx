function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <p className="footer__copy">
        &copy; <span className="year">{currentYear}</span> Chetan Dabhi &mdash; All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
