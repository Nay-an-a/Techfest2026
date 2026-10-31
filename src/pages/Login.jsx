import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { loginUser } from '../services/api.js';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const validateField = (name, value) => {
    let errMsg = '';
    if (name === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errMsg = 'Enter a valid email address.';
    } else if (name === 'password') {
      if (!value) errMsg = 'Password is required.';
    }
    return errMsg;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setTouched(prev => ({ ...prev, [id]: true }));
    setFieldErrors(prev => ({ ...prev, [id]: validateField(id, value) }));
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    setTouched(prev => ({ ...prev, [id]: true }));
    setFieldErrors(prev => ({ ...prev, [id]: validateField(id, value) }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    
    const newErrors = {
      email: validateField('email', formData.email),
      password: validateField('password', formData.password)
    };
    setFieldErrors(newErrors);
    setTouched({ email: true, password: true });
    
    if (newErrors.email || newErrors.password) {
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(formData);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userRole', data.role);
      window.dispatchEvent(new Event('storage'));
      navigate(redirectPath);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const getFieldClass = (id) => {
    return `form-field ${touched[id] && fieldErrors[id] ? 'has-error' : ''}`;
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="eyebrow">WELCOME BACK</span>
          <h1>Log In.</h1>
          <p>Enter your details to access your account.</p>
        </div>
        <form onSubmit={handleLogin} noValidate>
          {error && <p className="field-error" style={{ marginBottom: '16px' }}>{error}</p>}
          
          <div className={getFieldClass('email')}>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} onBlur={handleBlur} required />
            {touched.email && fieldErrors.email && <small className="field-error">{fieldErrors.email}</small>}
          </div>
          
          <div className={getFieldClass('password')}>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} onBlur={handleBlur} required />
            {touched.password && fieldErrors.password && <small className="field-error">{fieldErrors.password}</small>}
          </div>
          
          <button className="button button-primary button-submit" type="submit" disabled={loading} style={{ width: '100%', marginTop: '16px' }}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
          
          <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
            Don't have an account? <Link to={`/signup?redirect=${redirectPath}`} className="auth-link">Sign up here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
