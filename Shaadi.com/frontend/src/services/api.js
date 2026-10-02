const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

// Auth
export const auth = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  me: () => request('/auth/me'),
};

// Profiles
export const profiles = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val) params.append(key, val);
    });
    const qs = params.toString();
    return request(`/profiles${qs ? `?${qs}` : ''}`);
  },
  getById: (id) => request(`/profiles/${id}`),
  createOrUpdate: (data) => request('/profiles', { method: 'POST', body: JSON.stringify(data) }),
  sendInterest: (id) => request(`/profiles/${id}/interest`, { method: 'PUT' }),
  getWishlist: () => request('/profiles/wishlist'),
  toggleWishlist: (id) => request(`/profiles/${id}/wishlist`, { method: 'PUT' }),
  updateMembership: (membership) => request('/profiles/membership', { method: 'PUT', body: JSON.stringify({ membership }) }),
};

// Chat
export const chat = {
  getConversations: () => request('/chat/conversations'),
  getMessages: (conversationId) => request(`/chat/conversations/${conversationId}/messages`),
  sendMessage: (receiverId, text) => request('/chat/send', { method: 'POST', body: JSON.stringify({ receiverId, text }) }),
  getUnreadCount: () => request('/chat/unread-count'),
  getHistory: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.search) qs.append('search', params.search);
    if (params.page) qs.append('page', params.page);
    if (params.limit) qs.append('limit', params.limit);
    return request(`/chat/history${qs.toString() ? `?${qs.toString()}` : ''}`);
  },
  deleteConversation: (conversationId) => request(`/chat/conversations/${conversationId}`, { method: 'DELETE' }),
};

// Content
export const content = {
  getSuccessStories: () => request('/content/success-stories'),
  getPricingPlans: () => request('/content/pricing-plans'),
  getArticles: () => request('/content/articles'),
  getDatingTips: () => request('/content/dating-tips'),
};

export default { auth, profiles, chat, content };
