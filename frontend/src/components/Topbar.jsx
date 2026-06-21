import { useNavigate } from 'react-router-dom';
import { clearAuth, getUser } from '../utils/auth';

function Topbar({ title }) {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="topbar">
      <div>
        <h1>{title}</h1>
        <p style={{ margin: 0, color: '#667795' }}>Berwa HMS — BERWA HOSPITALS demo environment</p>
      </div>
      <div className="actions">
        <div className="search">
          <input type="search" placeholder="Search records..." />
        </div>
        <button className="button-secondary" onClick={handleLogout}>Logout</button>
        <div className="profile">
          <span>{user?.first_name || 'User'}</span>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
