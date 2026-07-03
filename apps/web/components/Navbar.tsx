export function Navbar() {
  return (
    <header className="tox-navbar">
      <div className="tox-logo">
        <span className="tox-logo-mark">T</span>
        <span>TOX Studio</span>
      </div>

      <nav className="tox-nav-links">
        <a href="#features">Features</a>
        <a href="#ai">AI</a>
        <a href="#pricing">Pricing</a>
        <a href="#docs">Docs</a>
      </nav>

      <button className="tox-nav-button">Launch App</button>
    </header>
  );
}