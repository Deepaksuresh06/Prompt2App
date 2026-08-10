import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

// We don't have JWT based on the backend, just local storage ID
// but we can add an interceptor if needed later.

export default api;
