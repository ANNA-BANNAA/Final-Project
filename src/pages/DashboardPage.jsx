import { useAuth } from '../context/AuthContext';

// დროებითი მთავარი (Dashboard) გვერდი, სადაც მომხმარებლის მონაცემები გამოჩნდება
function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>მთავარი გვერდი (Dashboard)</h2>
      {user && (
        <div style={{ background: '#f4f4f4', padding: '15px', borderRadius: '5px', margin: '20px 0' }}>
          <p><strong>სახელი:</strong> {user.name}</p>
          <p><strong>ელფოსტა:</strong> {user.email}</p>
        </div>
      )}
      <button 
        onClick={logout}
        style={{ padding: '8px 15px', background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
      >
        გამოსვლა (Logout)
      </button>
    </div>
  );
}
export default DashboardPage;