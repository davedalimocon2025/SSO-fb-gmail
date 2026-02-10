import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth';

export const loginUser = async (credentials: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    
    // If you plan to use JWT, you would save it here
    // if (response.data.token) localStorage.setItem('token', response.data.token);
    
    return response.data;
  } catch (error: any) {
    // Throw the specific error message from your Express catch block
    throw error.response?.data?.message || 'Login failed';
  }
};