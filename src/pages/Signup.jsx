import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { registerUser } from '../services/api.js';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    collegeName: '',
    phone: ''
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
    switch (name) {
      case 'name':
        if (!value.trim() || value.trim().length < 3) errMsg = 'Name must be at least 3 characters.';
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errMsg = 'Enter a valid email address.';
        break;
      case 'password':
        if (value.length < 6) errMsg = 'Password must be at least 6 characters.';
        break;
      case 'collegeName':
        if (!value.trim()) errMsg = 'College name is required.';
        break;
      case 'phone':
        if (!/^[6-9]\d{9}$/.test(value)) errMsg = 'Enter a valid 10-digit phone number.';
        break;
      default:
        break;
    }
    return errMsg;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setTouched(prev => ({ ...prev, [id]: true }));
    
    const errMsg = validateField(id, value);
    setFieldErrors(prev => ({ ...prev, [id]: errMsg }));
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    setTouched(prev => ({ ...prev, [id]: true }));
    const errMsg = validateField(id, value);
    setFieldErrors(prev => ({ ...prev, [id]: errMsg }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Validate all fields before submitting
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      newErrors[key] = validateField(key, formData[key]);
      touched[key] = true;
    });
    setFieldErrors(newErrors);
    setTouched({ ...touched });
    
    if (Object.values(newErrors).some(msg => msg)) {
      return; // Stop submission if errors exist
    }

    setLoading(true);
    try {
      await registerUser(formData);
      navigate(`/login?redirect=${redirectPath}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
          <span className="eyebrow">JOIN US</span>
          <h1>Sign Up.</h1>
          <p>Create an account to participate in events.</p>
        </div>
        <form onSubmit={handleSignup} noValidate>
          {error && <p className="field-error" style={{ marginBottom: '16px' }}>{error}</p>}
          
          <div className={getFieldClass('name')}>
            <label htmlFor="name">Full Name</label>
            <input id="name" type="text" placeholder="Your name" value={formData.name} onChange={handleChange} onBlur={handleBlur} required />
            {touched.name && fieldErrors.name && <small className="field-error">{fieldErrors.name}</small>}
          </div>

          <div className={getFieldClass('email')}>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} onBlur={handleBlur} required />
            {touched.email && fieldErrors.email && <small className="field-error">{fieldErrors.email}</small>}
          </div>

          <div className={getFieldClass('collegeName')}>
            <label htmlFor="collegeName">College / Organization</label>
            <input id="collegeName" type="text" placeholder="Where are you joining from?" value={formData.collegeName} onChange={handleChange} onBlur={handleBlur} required />
            {touched.collegeName && fieldErrors.collegeName && <small className="field-error">{fieldErrors.collegeName}</small>}
          </div>

          <div className={getFieldClass('phone')}>
            <label htmlFor="phone">Phone Number</label>
            <input id="phone" type="tel" placeholder="10-digit number" value={formData.phone} onChange={handleChange} onBlur={handleBlur} required />
            {touched.phone && fieldErrors.phone && <small className="field-error">{fieldErrors.phone}</small>}
          </div>

          <div className={getFieldClass('password')}>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} onBlur={handleBlur} required />
            {touched.password && fieldErrors.password && <small className="field-error">{fieldErrors.password}</small>}
          </div>
          
          <button className="button button-primary button-submit" type="submit" disabled={loading} style={{ width: '100%', marginTop: '16px' }}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
          
          <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
            Already have an account? <Link to={`/login?redirect=${redirectPath}`} className="auth-link">Log in here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
