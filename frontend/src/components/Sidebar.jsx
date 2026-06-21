import { NavLink } from 'react-router-dom';

const menu = [
  { path: '/', label: 'Dashboard' },
  { path: '/public', label: 'Public Site' },
  { path: '/patients', label: 'Patients' },
  { path: '/patients/new', label: 'Register Patient' },
  { path: '/appointments', label: 'Appointments' },
  { path: '/triage', label: 'Triage' },
  { path: '/consultation', label: 'Consultation' },
  { path: '/labs', label: 'Lab Requests' },
  { path: '/pharmacy', label: 'Pharmacy' },
  { path: '/billing', label: 'Billing' },
  { path: '/reports', label: 'Reports' },
  { path: '/users', label: 'User Management' },
  { path: '/audit', label: 'Audit Logs' },
  { path: '/settings', label: 'Settings' }
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">Berwa HMS</div>
      <nav>
        {menu.map((item) => (
          <NavLink key={item.path} to={item.path} end className={({ isActive }) => (isActive ? 'active' : '')}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
