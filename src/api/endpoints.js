import axios from "axios";
import { SERVER_URL } from "../constants/constants";

const BASE_URL = SERVER_URL;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original_request = error.config;

    if (error.response?.status === 401 && !original_request._retry) {
      original_request._retry = true;

      try {
        await refresh_token();
        return api(original_request);
      } catch (refreshError) {
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const get_user_profile_data = async (username) => {
  const response = await api.get(`/user_data/${username}/`);
  return response.data;
};

const refresh_token = async () => {
  const response = await api.post("/token/refresh/");
  return response.data;
};

export const login = async (username, password) => {
  const response = await api.post("/token/", { username, password });
  return response.data;
};

export const register = async (
  username,
  email,
  firstName,
  lastName,
  password
) => {
  const response = await api.post("/register/", {
    username: username,
    email: email,
    first_name: firstName,
    last_name: lastName,
    password: password,
  });
  return response.data;
};

export const get_auth = async () => {
  const response = await api.get(`/authenticated/`);
  return response.data;
};

export const toggleFollow = async (username) => {
  const response = await api.post("/toggle_follow/", { username: username });
  return response.data;
};



export const toggleLike = async (id) => {
  const response = await api.post("/toggleLike/", { id: id });
  return response.data;
};

export const create_post = async (description) => {
  const response = await api.post("/create_post/", {
    description: description,
  });
  return response.data;
};


export const search_users = async (search) => {
  const response = await api.get(`/search/?query=${search}`);
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/logout/");
  return response.data;
};

export const update_user = async (values) => {
  const response = await api.patch("/update_user/", values, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};


// endpoints.js - Enhanced with better error handling
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        // Unauthorized - redirect to login
        window.location.href = "/login";
        throw new Error('Please login again');
      case 404:
        throw new Error('Resource not found');
      case 500:
        throw new Error('Server error. Please try again later.');
      default:
        throw new Error(data.error || 'Something went wrong');
    }
  } else if (error.request) {
    // Network error
    throw new Error('Network error. Please check your connection.');
  } else {
    // Other errors
    throw new Error('An unexpected error occurred');
  }
};

export const get_posts = async (num = 1) => {
  try {
    const response = await api.get(`/get_posts/?page=${num}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const get_users_posts = async (username) => {
  try {
    const response = await api.get(`/posts/${username}/`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


// api/endpoints.js - Add new endpoints
export const create_comment = async (post_id, text) => {
  const response = await api.post("/create_comment/", {
    post_id: post_id,
    text: text,
  });
  return response.data;
};

export const get_comments = async (post_id) => {
  const response = await api.get(`/comments/${post_id}/`);
  return response.data;
};

export const delete_comment = async (comment_id) => {
  const response = await api.delete(`/delete_comment/${comment_id}/`);
  return response.data;
};

export const delete_post = async (post_id) => {
  const response = await api.delete(`/delete_post/${post_id}/`);
  return response.data;
};