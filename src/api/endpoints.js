// import axios from "axios";
// import { SERVER_URL } from "../constants/constants";


// const BASE_URL = SERVER_URL;

// const api = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true,
// });

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const original_request = error.config;

//     if (error.response?.status === 401 && !original_request._retry) {
//       original_request._retry = true;

//       try {
//         await refresh_token();
//         return api(original_request);
//       } catch (refreshError) {
//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export const get_user_profile_data = async (username) => {
//   const response = await api.get(`/user_data/${username}/`);
//   return response.data;
// };

// const refresh_token = async () => {
//   const response = await api.post("/token/refresh/");
//   return response.data;
// };

// export const login = async (username, password) => {
//   const response = await api.post("/token/", { username, password });
//   return response.data;
// };

// export const register = async (
//   username,
//   email,
//   firstName,
//   lastName,
//   password
// ) => {
//   const response = await api.post("/register/", {
//     username: username,
//     email: email,
//     first_name: firstName,
//     last_name: lastName,
//     password: password,
//   });
//   return response.data;
// };

// export const get_auth = async () => {
//   const response = await api.get(`/authenticated/`);
//   return response.data;
// };

// export const toggleFollow = async (username) => {
//   const response = await api.post("/toggle_follow/", { username: username });
//   return response.data;
// };

// export const get_users_posts = async (username) => {
//   const response = await api.get(`/posts/${username}/`);
//   return response.data;
// };

// export const toggleLike = async (id) => {
//   const response = await api.post("/toggleLike/", { id: id });
//   return response.data;
// };

// // Updated create_post to handle FormData with images and files
// export const create_post = async (formData) => {
//   const response = await api.post("/create_post/", formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });
//   return response.data;
// };

// // Delete post function
// export const delete_post = async (postId) => {
//   const response = await api.delete(`/delete_post/${postId}/`);
//   return response.data;
// };

// export const get_posts = async (num) => {
//   const response = await api.get(`/get_posts/?page=${num}`);
//   return response.data;
// };

// export const search_users = async (search) => {
//   const response = await api.get(`/search/?query=${search}`);
//   return response.data;
// };

// export const logout = async () => {
//   const response = await api.post("/logout/");
//   return response.data;
// };

// export const update_user = async (values) => {
//   const response = await api.patch("/update_user/", values, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return response.data;
// };

// // Comment related endpoints
// export const create_comment = async (postId, text) => {
//   const response = await api.post("/create_comment/", {
//     post_id: postId,
//     text: text,
//   });
//   return response.data;
// };

// export const delete_comment = async (commentId) => {
//   const response = await api.delete(`/delete_comment/${commentId}/`);
//   return response.data;
// };

// export const toggle_comment_like = async (commentId) => {
//   const response = await api.post("/toggle_comment_like/", { id: commentId });
//   return response.data;
// };

// export const get_post_comments = async (postId) => {
//   const response = await api.get(`/post_comments/${postId}/`);
//   return response.data;
// };



import axios from "axios";
import { SERVER_URL } from "../constants/constants";

const BASE_URL = SERVER_URL;

// Create a separate axios instance for token refresh to avoid circular dependencies
const refreshApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original_request = error.config;

    if (error.response?.status === 401 && !original_request._retry) {
      
      if (original_request.url === '/token/refresh/') {
        // If we're already refreshing and get 401, redirect to login
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, add to queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(original_request);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      original_request._retry = true;
      isRefreshing = true;

      try {
        console.log('Attempting token refresh...');
        await refresh_token();
        console.log('Token refresh successful');
        
        processQueue(null);
        return api(original_request);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        processQueue(refreshError, null);
        
        // Clear cookies and redirect to login
        await logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

// Separate refresh function that doesn't use the main api instance
const refresh_token = async () => {
  try {
    const response = await refreshApi.post("/token/refresh/");
    
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error('Token refresh failed');
    }
  } catch (error) {
    console.error('Refresh token error:', error);
    throw error;
  }
};

// Helper function to get cookie value
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Helper function to check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() >= exp;
  } catch (error) {
    console.error('Error checking token expiry:', error);
    return true;
  }
};

// Optional: Add request interceptor to log requests for debugging
api.interceptors.request.use(
  (config) => {
    const accessToken = getCookie('access_token');
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    console.log('Access token present:', !!accessToken);
    
    if (accessToken) {
      console.log('Token expired:', isTokenExpired(accessToken));
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const get_user_profile_data = async (username) => {
  const response = await api.get(`/user_data/${username}/`);
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

export const get_users_posts = async (username) => {
  const response = await api.get(`/posts/${username}/`);
  return response.data;
};

export const toggleLike = async (id) => {
  const response = await api.post("/toggleLike/", { id: id });
  return response.data;
};

export const create_post = async (formData) => {
  const response = await api.post("/create_post/", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const delete_post = async (postId) => {
  const response = await api.delete(`/delete_post/${postId}/`);
  return response.data;
};

export const get_posts = async (num) => {
  const response = await api.get(`/get_posts/?page=${num}`);
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

// Comment related endpoints
export const create_comment = async (postId, text) => {
  const response = await api.post("/create_comment/", {
    post_id: postId,
    text: text,
  });
  return response.data;
};

export const delete_comment = async (commentId) => {
  const response = await api.delete(`/delete_comment/${commentId}/`);
  return response.data;
};

export const toggle_comment_like = async (commentId) => {
  const response = await api.post("/toggle_comment_like/", { id: commentId });
  return response.data;
};

export const get_post_comments = async (postId) => {
  const response = await api.get(`/post_comments/${postId}/`);
  return response.data;
};