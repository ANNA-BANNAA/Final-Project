const API_URL = import.meta.env.VITE_API_URL;

export async function apiClient(endpoint, options = {}) {
  const token = localStorage.getItem('accessToken');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  // თუ სერვერმა დააბრუნა 204 No Content (მაგ: logout-ზე)
  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    // ცენტრალური დამუშავება TOKEN_EXPIRED / UNAUTHORIZED შეცდომების
    if (response.status === 401 && (data.code === 'TOKEN_EXPIRED' || data.code === 'UNAUTHORIZED')) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    
    throw data; // ვაბრუნებთ სერვერის შეცდომის ობიექტს ({ message, code, errors })
  }

  return data;
}