import axios from 'axios';

const api = axios.create({
  // Use json-server mock backend URL
  baseURL: 'http://localhost:3001',
});

// Mocking Base44 SDK behavior using standard REST API
export const base44 = {
  auth: {
    me: async () => {
      try {
        const res = await api.get('/auth_me');
        return res.data;
      } catch (e) {
        throw new Error('Not logged in');
      }
    },
    loginWithProvider: async (provider, redirect) => {
      console.log(`Mock login with ${provider}`);
      window.location.href = redirect || '/';
    },
    loginViaEmailPassword: async (email, password) => {
      const res = await api.get('/auth_login');
      return res.data;
    },
    register: async (data) => {
      return { success: true };
    },
    verifyOtp: async (data) => {
      return { access_token: 'mock-token-123' };
    },
    setToken: (token) => {
      localStorage.setItem('mock_token', token);
    },
    resendOtp: async (email) => {
      return { success: true };
    },
    logout: async () => {
      localStorage.removeItem('mock_token');
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
          
          const res = await api.get(route, { params });
          return Array.isArray(res.data) ? res.data : (res.data.data || res.data);
        },
        filter: async (filters = {}, sort = '', limit = 100) => {
          const params = { ...filters };
          if (sort.startsWith('-')) {
            params._sort = `-${sort.substring(1)}`;
          } else if (sort) {
            params._sort = sort;
          }
          if (limit) params._per_page = limit;
          
          const res = await api.get(route, { params });
          return Array.isArray(res.data) ? res.data : (res.data.data || res.data);
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
          const res = await api.get(`${route}/${id}`);
          return res.data;
        }
      };
    }
  })
};
