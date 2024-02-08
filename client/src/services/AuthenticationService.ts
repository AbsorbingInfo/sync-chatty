import axios, { AxiosError } from 'axios';
import { API_URL } from '../utils/constants';

type User = {
  username: string;
  password: string;
};

const register = async (user: User) => {
  try {
    const response = await axios.post(`${API_URL}/api/user/signup`, user, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      return error.response;
    }
  }
};

const login = async (user: User) => {
  try {
    const response = await axios.post(`${API_URL}/api/user/login`, user, { withCredentials: true });
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response;
    }
  }
};

const isLoggedIn = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/user/isLoggedIn`, { withCredentials: true });
    return response;
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      return error.response;
    }
  }
};

const AuthenticationService = {
  register,
  login,
  isLoggedIn,
};

export default AuthenticationService;
