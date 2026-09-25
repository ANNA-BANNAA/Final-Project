import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/authApi';

export function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: ელფოსტა, 2: კოდი, 3: ახალი პაროლი
  
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // ბიჯი 1: ელფოსტის გაგზავნა
  const handleSendEmail = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authApi.forgotPassword(email);
      setStep(2); // გადავდივართ მეორე ბიჯზე (კოდის შეყვანა)
    } catch (err) {
      setError(err.message || 'შეცდომა მოხდა');
    } finally {
      setIsLoading(false);
    }
  };

  // ბიჯი 2: კოდის გადამოწმება
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await authApi.verifyResetCode(email, code);
      setResetToken(data.resetToken); // ვინახავთ resetToken-ს state-ში
      setStep(3); // გადავდივართ მესამე ბიჯზე (ახალი პაროლი)
    } catch (err) {
      setError(err.code === 'INVALID_RESET_CODE' ? 'კოდი არასწორია ან ვადაგასულია' : err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ბიჯი 3: ახალი პაროლის დაყენება
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authApi.resetPassword(resetToken, newPassword);
      alert('პაროლი წარმატებით შეიცვალა!');
      navigate('/login'); // წარმატების მერე გადავყავთ ლოგინზე
    } catch (err) {
      setError(err.message || 'პაროლის შეცვლა ვერ მოხერხდა');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>პაროლის აღდგენა</h2>

      {error && (
        <div style={{ background: '#ffdddd', color: '#900', padding: '10px', marginBottom: '15px', borderRadius: '4px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {/* ბიჯი 1: ელფოსტის ფორმა */}
      {step === 1 && (
        <form onSubmit={handleSendEmail} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="email"
            placeholder="შეიყვანეთ ელფოსტა"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
            required
          />
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ padding: '10px', background: '#007BFF', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
          >
            {isLoading ? 'იტვირთება...' : 'კოდის გაგზავნა'}
          </button>
        </form>
      )}

      {/* ბიჯი 2: კოდის შემოწმების ფორმა */}
      {step === 2 && (
        <form onSubmit={handleVerifyCode} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <p style={{ fontSize: '14px', color: '#555' }}>ელფოსტაზე გამოგზავნილია 6-ნიშნა კოდი (ტესტირებისას იხილეთ სერვერის კონსოლში/devCode).</p>
          <input
            type="text"
            placeholder="შეიყვანეთ 6-ნიშნა კოდი"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isLoading}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
            required
          />
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ padding: '10px', background: '#007BFF', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
          >
            {isLoading ? 'მოწმდება...' : 'კოდის დადასტურება'}
          </button>
        </form>
      )}

      {/* ბიჯი 3: ახალი პაროლის ფორმა */}
      {step === 3 && (
        <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="password"
            placeholder="ახალი პაროლი (მინ. 8 სიმბოლო)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isLoading}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
            required
          />
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
          >
            {isLoading ? 'ინახება...' : 'პაროლის შეცვლა'}
          </button>
        </form>
      )}

      <p style={{ marginTop: '15px' }}>
        გახსოვს პაროლი? <Link to="/login">შესვლა</Link>
      </p>
    </div>
  );
}