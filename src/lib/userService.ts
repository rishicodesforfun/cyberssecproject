import { User } from './auth';

// API Base URL
const API_BASE_URL = 'http://localhost:3001/api';

// User service for frontend - makes API calls to backend
export const userService = {
  // Get current user profile
  getCurrentUser: async (): Promise<User | null> => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get user');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Update user profile
  updateProfile: async (updates: Partial<User>): Promise<User | null> => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Update profile error:', error);
      return null;
    }
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<boolean> => {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      return response.ok;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
  }
};

// Legacy functions for backward compatibility (these now make API calls)
export const findUserByUsername = async (username: string): Promise<User | null> => {
  // This should be handled by the backend
  console.warn('findUserByUsername is deprecated - use backend API directly');
  return null;
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  // This should be handled by the backend
  console.warn('findUserByEmail is deprecated - use backend API directly');
  return null;
};

export const findUserById = async (id: string): Promise<User | null> => {
  // This should be handled by the backend
  console.warn('findUserById is deprecated - use backend API directly');
  return null;
};

export const createUser = async (userData: any): Promise<User> => {
  // This should be handled by the backend
  console.warn('createUser is deprecated - use backend API directly');
  throw new Error('Use authService.register() instead');
};

export const updateUser = async (id: string, updates: Partial<User>): Promise<User | null> => {
  // This should be handled by the backend
  console.warn('updateUser is deprecated - use backend API directly');
  return null;
};