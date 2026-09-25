import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // 1. სანამ აპლიკაცია ამოწმებს ტოკენს (GET /auth/me), ვაჩვენებთ უბრალო ლოადერს, 
  // რომ ლოგინი ერთიანად არ აციმციმოს.
  if (isLoading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>იტვირთება...</div>;
  }

  // 2. თუ მომხმარებელი არ არის შესული, გადავამისამართებთ /login-ზე,
  // თან ვინახავთ საიდან გამოვარდა, რომ წარმატებული ლოგინის შემდეგ უკან დავაბრუნოთ.
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. თუ ყველაფერი რიგზეა, ვუშვებთ დაცულ გვერდზე
  return children;
}