import { Link, NavLink, Outlet } from 'react-router-dom';

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-link nav-link-active' : 'nav-link';

export const Layout = () => (
  <div className="app-shell">
    <header className="header">
      <Link to="/" className="brand">
        Chauffeur Classics
      </Link>
      <nav className="nav">
        <NavLink className={navClass} to="/customer">
          Customer
        </NavLink>
        <NavLink className={navClass} to="/manager">
          Manager
        </NavLink>
        <NavLink className={navClass} to="/api-lab">
          API Lab
        </NavLink>
      </nav>
    </header>
    <main className="main-content">
      <Outlet />
    </main>
  </div>
);
