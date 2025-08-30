import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export interface User {
  id: string;
  fullName: string;
  role: 'user' | 'admin';
  participating: boolean;
}

export interface Friend {
  id: string;
  fullName: string;
}

export interface WishlistItem {
  title: string;
  description?: string;
  link?: string;
}

export interface SystemStatus {
  isLocked: boolean;
  isAssignmentDone: boolean;
  participantCount: number;
  participants: Array<{
    id: string;
    fullName: string;
    assignedFriend: Friend | null;
  }>;
}

// Auth API
export const auth = {
  register: async (data: { fullName: string; password: string }) => {
    const response = await api.post<{ user: User }>('/auth/register', data);
    return response.data;
  },

  login: async (data: { fullName: string; password: string }) => {
    const response = await api.post<{ user: User }>('/auth/login', data);
    return response.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
  },

  me: async () => {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data;
  },
};

// Secret Friend API
export const secret = {
  register: async () => {
    const response = await api.post<{ user: User }>('/secret/register');
    return response.data;
  },

  getAssignedFriend: async () => {
    const response = await api.get<{ friend: Friend | null }>('/secret/me');
    return response.data;
  },
};

// Admin API
export const admin = {
  getStatus: async () => {
    const response = await api.get<{ status: string; data: SystemStatus }>('/admin/status');
    return response.data;
  },

  startAssignment: async () => {
    const response = await api.post<{ 
      status: string; 
      data: { assignments: Array<{ from: string; to: string }> }
    }>('/admin/start');
    return response.data;
  },

  resetSystem: async () => {
    const response = await api.post<{ status: string; message: string }>('/admin/reset');
    return response.data;
  },

  deleteParticipant: async (userId: string) => {
    const response = await api.delete<{ status: string; message: string }>(
      `/admin/participants/${userId}`
    );
    return response.data;
  },
};

// Wishlist API
export const wishlist = {
  getMine: async () => {
    const response = await api.get<{ status: string; data: { items: WishlistItem[] } }>('/wishlist/me');
    return response.data;
  },

  updateMine: async (items: WishlistItem[]) => {
    const response = await api.put<{ status: string; data: { items: WishlistItem[] } }>(
      '/wishlist/me',
      { items }
    );
    return response.data;
  },

  getFriend: async () => {
    const response = await api.get<{ status: string; data: { items: WishlistItem[] } }>('/wishlist/friend');
    return response.data;
  },
};