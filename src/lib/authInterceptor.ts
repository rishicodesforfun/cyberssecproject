// This file has been removed - JWT operations are now handled by the backend API
// Use src/services/authService.ts for all authentication operations

export const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return false;

  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = decoded.exp * 1000;
    return Date.now() < expiryTime;
  } catch {
    return false;
  }
};

export const getCurrentUserFromToken = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return {
      id: decoded.userId,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role
    };
  } catch {
    return null;
  }
};