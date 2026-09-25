import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [bannerError, setBannerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBannerError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setIsLoading(false);
      
      if (err.code === 'INVALID_CREDENTIALS' || err.status === 401) {
        setBannerError('არასწორი ელფოსტა ან პაროლი');
      } else {
        setBannerError(err.message || 'შესვლა ვერ მოხერხდა');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>შესვლა</h2>
      
      {bannerError && (
        <div style={{ background: '#ffdddd', color: '#900', padding: '10px', marginBottom: '15px', borderRadius: '4px', fontSize: '14px', textAlign: 'center' }}>
          {bannerError}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <input
            type="email"
            placeholder="ელფოსტა"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
            required
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="პაროლი"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
        >
          {isLoading ? 'იტვირთება...' : 'შესვლა'}
        </button>
      </form>

      <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
        <Link to="/register" style={{marginRight:"10px"}}>რეგისტრაცია</Link>
        <Link to="/forgot-password">პაროლი დამავიწყდა?</Link>
      </div>
    </div>
  );
}