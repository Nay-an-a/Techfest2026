import axios from 'axios';

// Same-origin '/api' (Vite proxy in dev, Netlify proxy in prod) so the sameSite=strict auth cookie is sent
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

export async function getEvents({ signal } = {}) {
  const response = await api.get('/events', { signal });
  // Map _id to id if necessary, the mock used 'id'
  return response.data.map(event => ({
    ...event,
    id: event._id,
    title: event.name,
    // Add dummy image if the backend doesn't provide one
    image: event.image || 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1000'
  }));
}

export async function loginUser(credentials) {
  const response = await api.post('/auth/login', credentials);
  return response.data;
}

export async function registerUser(userData) {
  const response = await api.post('/auth/register', userData);
  return response.data;
}

export async function logoutUser() {
  await api.post('/auth/logout');
}

export async function registerForEvent(eventId) {
  const response = await api.post('/registrations', { eventId });
  return response.data;
}

export async function getMyRegistrations() {
  const response = await api.get('/registrations/my');
  return response.data;
}

export default api;
