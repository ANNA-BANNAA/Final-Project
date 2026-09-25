import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { z } from 'zod';

// Zod სქემა რეგისტრაციის ფორმისთვის
const registerSchema = z.object({
  name: z.string().min(2, 'სახელი უნდა შედგებოდეს მინიმუმ 2 სიმბოლოსგან'),
  email: z.string().email('გთხოვთ შეიყვანოთ სწორი ელფოსტა'),
  password: z.string().min(6, 'პაროლი უნდა შედგებოდეს მინიმუმ 6 სიმბოლოსგან'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'პაროლები არ ემთხვევა ერთმანეთს',
  path: ['confirmPassword'], // შეცდომა მიეკუთვნება confirmPassword ველს
});

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');

    // Zod-ით ვალიდაცია სერვერზე გაგზავნამდე
    const result = registerSchema.safeParse({ name, email, password, confirmPassword });

    if (!result.success) {
      // ზოდის შეცდომების გადაყვანა ობიექტში, რომ თითოეულ ველს თავისი შეცდომა ჰქონდეს
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        const fieldName = err.path[0];
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      await register({ name, email, password }, navigate);
    } catch (err) {
      setIsLoading(false);
      
      if (err.code === 'VALIDATION_ERROR' && err.errors) {
        setErrors(err.errors);
      } else if (err.code === 'EMAIL_TAKEN') {
        setErrors({ email: 'ეს ელფოსტა უკვე რეგისტრირებულია' });
      } else {
        setGeneralError(err.message || 'რეგისტრაცია ვერ მოხერხდა');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>რეგისტრაცია</h2>
      
      {generalError && (
        <div style={{ background: '#ffdddd', color: '#900', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <input
            type="text"
            placeholder="სახელი"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '10px', 
              boxSizing: 'border-box',
              borderColor: errors.name ? 'red' : '#ccc' 
            }}
          />
          {errors.name && <span style={{ color: 'red', fontSize: '12px' }}>{errors.name}</span>}
        </div>

        <div>
          <input
            type="email"
            placeholder="ელფოსტა"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '10px', 
              boxSizing: 'border-box',
              borderColor: errors.email ? 'red' : '#ccc' 
            }}
          />
          {errors.email && <span style={{ color: 'red', fontSize: '12px' }}>{errors.email}</span>}
        </div>

        <div>
          <input
            type="password"
            placeholder="პაროლი (მინ. 6 სიმბოლო)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '10px', 
              boxSizing: 'border-box',
              borderColor: errors.password ? 'red' : '#ccc' 
            }}
          />
          {errors.password && <span style={{ color: 'red', fontSize: '12px' }}>{errors.password}</span>}
        </div>

        <div>
          <input
            type="password"
            placeholder="გაიმეორეთ პაროლი"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '10px', 
              boxSizing: 'border-box',
              borderColor: errors.confirmPassword ? 'red' : '#ccc' 
            }}
          />
          {errors.confirmPassword && <span style={{ color: 'red', fontSize: '12px' }}>{errors.confirmPassword}</span>}
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          style={{ padding: '10px', background: '#007BFF', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
        >
          {isLoading ? 'იტვირთება...' : 'რეგისტრაცია'}
        </button>
      </form>

      <p style={{ marginTop: '15px' }}>
        უკვე გაქვს ანგარიში? <Link to="/login">შესვლა</Link>
      </p>
    </div>
  );
}