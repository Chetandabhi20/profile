function Header({ name, themeColor }) {
  return (
    <header className="header">
      <h1 className="header__title" style={{ color: themeColor }}>
        {name}
      </h1>
      <p className="header__subtitle">[ student &middot; developer &middot; security researcher ]</p>
    </header>
  )
}

export default Header
