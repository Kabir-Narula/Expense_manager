import axios from "axios";

const CACHE_TTL_MS = 5 * 60 * 1000; 
const CACHE_PREFIX = "api_cache_";

const buildCacheKey = (config = {}) => {
  const method = (config.method || "get").toLowerCase();
  const url = config.url || "";
  const params = config.params ? JSON.stringify(config.params) : "";
  return `${CACHE_PREFIX}${method}:${url}:${params}`;
};

const readCache = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeCache = (key, data) => {
  localStorage.setItem(
    key,
    JSON.stringify({ data, timestamp: Date.now() })
  );
};

export const clearCacheFor = (urlPrefix) => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith(`${CACHE_PREFIX}get:${urlPrefix}`)) {
      localStorage.removeItem(key);
    }
  });
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  const accountId = localStorage.getItem("currentAccountId");
  if (accountId) config.headers["X-Account-Id"] = accountId;

  if ((config.method || "get").toLowerCase() === "get") {
    const cacheKey = buildCacheKey(config);
    const cached = readCache(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      config.adapter = async () => ({
        data: cached.data,
        status: 200,
        statusText: "OK",
        headers: config.headers,
        config,
        request: null,
        cached: true,
      });
    } else if (cached) {
      localStorage.removeItem(cacheKey); // stale cache
    }

    config.cacheKey = cacheKey;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    if ((response.config.method || "get").toLowerCase() === "get") {
      const cacheKey =
        response.config.cacheKey || buildCacheKey(response.config);
      writeCache(cacheKey, response.data);
    }
    return response;
  },
  (error) => {
    const config = error.config;
    if ((config?.method || "get").toLowerCase() === "get") {
      const cacheKey = config.cacheKey || buildCacheKey(config);
      const cached = readCache(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return Promise.resolve({
          data: cached.data,
          status: 200,
          statusText: "OK",
          headers: error.response?.headers || {},
          config,
          request: null,
          cached: true,
        });
      }
    }
    return Promise.reject(error);
  }
);

export default api;