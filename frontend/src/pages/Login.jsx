import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../services/api';
import { saveAuth } from '../utils/auth';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      const response = await loginRequest({ email, password });
      saveAuth(response.data.token, response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to login');
    }
  };

  return (
    <div className="login-shell">
      <div className="login-box">
        <h2>Berwa HMS Login</h2>
        <p>Sign in with your hospital user account to continue.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p style={{ color: '#ac2f2f' }}>{error}</p>}
          <button type="submit" className="button-primary">Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
