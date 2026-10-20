import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/departments', label: 'Departments' },
  { to: '/employees', label: 'Employees' },
  { to: '/concepts', label: 'Concepts' },
  { to: '/payrolls', label: 'Payrolls' },
  { to: '/loans', label: 'Loans' }
];

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">PayRoll</div>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            {l.label}
          </NavLink>
        ))}
        <div className="sidebar-footer">
          <div className="user-chip">
            {user?.first_name || user?.user_na || user?.email}
          </div>
          <button type="button" className="secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
