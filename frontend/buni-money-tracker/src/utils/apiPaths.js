const BASE_URL = "http://localhost:8000/api";

export const API_PATHS = {
  // Auth endpoints
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/auth/register`,
  ME: `${BASE_URL}/auth/me`,
  UPDATE_PROFILE: `${BASE_URL}/auth/profile`,
  CHANGE_PASSWORD: `${BASE_URL}/auth/change-password`,

  // Transaction endpoints
  TRANSACTIONS: `${BASE_URL}/transactions`,
  TRANSACTION_STATS: `${BASE_URL}/transactions/stats`,
  TRANSACTION_CATEGORIES: `${BASE_URL}/transactions/categories/list`,

  // User endpoints
  USER_PROFILE: `${BASE_URL}/users/profile`,
  DELETE_ACCOUNT: `${BASE_URL}/users/account`,
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};