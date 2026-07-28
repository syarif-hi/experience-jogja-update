import axios from 'axios';

const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
const baseURL = isHttps 
  ? '/api' 
  : (typeof window !== 'undefined' ? `http://${window.location.hostname}:3001` : 'http://localhost:3001');

const api = axios.create({
  baseURL,
});

// Mocking Base44 SDK behavior using standard REST API
export const base44 = {
  auth: {
    me: async () => {
      // For local development without a backend, return a mock user
      return {
        id: 'u123',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+6281234567890',
        avatar: '',
        role: 'admin'
      };
    },
    loginWithProvider: async (provider, redirect) => {
      console.log(`Mock login with ${provider}`);
      localStorage.setItem('base44_access_token', 'mock-token-123');
      window.location.href = redirect || '/';
    },
    loginViaEmailPassword: async (email, password) => {
      // Simulate successful login by setting the exact key expected by app-params.js
      localStorage.setItem('base44_access_token', 'mock-token-123');
      try {
        const res = await api.get('/auth_login');
        return res.data;
      } catch (e) {
        return { success: true };
      }
    },
    register: async (data) => {
      localStorage.setItem('base44_access_token', 'mock-token-123');
      return { success: true };
    },
    verifyOtp: async (data) => {
      localStorage.setItem('base44_access_token', 'mock-token-123');
      return { access_token: 'mock-token-123' };
    },
    setToken: (token) => {
      localStorage.setItem('base44_access_token', token);
    },
    resendOtp: async (email) => {
      return { success: true };
    },
    logout: async () => {
      localStorage.removeItem('base44_access_token');
      localStorage.removeItem('token');
      window.location.reload();
    }
  },
  entities: new Proxy({}, {
    get(target, entityName) {
      // Lowercase entity name for standard REST route (e.g. Event -> event)
      const route = `/${entityName.toLowerCase()}`;
      
      return {
        list: async (sort = '', limit = 100) => {
          const params = {};
          if (sort.startsWith('-')) {
            params._sort = `-${sort.substring(1)}`;
          } else if (sort) {
            params._sort = sort;
          }
          if (limit) params._per_page = limit; // v1 uses _per_page
          
          try {
            const res = await api.get(route, { params });
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || res.data);
            return Array.isArray(data) ? data : [];
          } catch (e) {
            console.error(`Error fetching list for ${route}:`, e);
            return [];
          }
        },
        filter: async (filters = {}, sort = '', limit = 100) => {
          const params = { ...filters };
          if (sort.startsWith('-')) {
            params._sort = `-${sort.substring(1)}`;
          } else if (sort) {
            params._sort = sort;
          }
          if (limit) params._per_page = limit;
          
          try {
            const res = await api.get(route, { params });
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || res.data);
            return Array.isArray(data) ? data : [];
          } catch (e) {
            console.error(`Error filtering ${route}:`, e);
            return [];
          }
        },
        create: async (data) => {
          const res = await api.post(route, data);
          return res.data;
        },
        update: async (id, data) => {
          const res = await api.put(`${route}/${id}`, data);
          return res.data;
        },
        delete: async (id) => {
          const res = await api.delete(`${route}/${id}`);
          return res.data;
        },
        get: async (id) => {
          try {
            const res = await api.get(`${route}/${id}`);
            return res.data;
          } catch (e) {
            console.error(`Error getting ${route}/${id}:`, e);
            return null;
          }
        }
      };
    }
  })
};
