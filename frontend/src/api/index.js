import { LocalStorageKeys } from "shared/enums";
import { FunctionCooldownManager } from "shared/helpers/fn-cooldown-manager";

const apiConfig = {
  serverUrls: {
    development: import.meta.env.VITE_DEV_SERVER,
    production: import.meta.env.VITE_PROD_SERVER,
    test: import.meta.env.VITE_TEST_SERVER,
  },
  defaultHeaders: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

const BASE_PATH = apiConfig.serverUrls[import.meta.env.MODE];

export const Method = Object.freeze({
  GET: "GET",
  PUT: "PUT",
  POST: "POST",
  PATCH: "PATCH",
  DELETE: "DELETE",
});

export const api = async (
  url,
  method = Method.GET,
  payload = null,
  hdrs = {}
) => {
  const headers = { ...apiConfig.defaultHeaders, ...hdrs };
  const requestInit = { method, headers };

  // if method is GET no need for body
  if (method != Method.GET) {
    requestInit.body = JSON.stringify(payload ? payload : {});
  }

  const request = new Request(`${BASE_PATH}${url}`, requestInit);

  const response = await fetch(request);

  const contentType = response.headers.get("Content-Type");
  let responseData;

  if (contentType) {
    if (contentType.includes("application/json")) {
      responseData = await response.json();
    } else if (contentType.includes("text/")) {
      responseData = await response.text();
    } else if (
      contentType.includes("image/") ||
      contentType.includes("audio/") ||
      contentType.includes("video/") ||
      contentType.includes("application/octet-stream")
    ) {
      responseData = await response.blob();
    } else {
      responseData = await response.text(); // Fallback for other content types
    }
  }

  return responseData;
};

export const authenticatedApi = async (
  url,
  method = Method.GET,
  payload = null,
  hdrs = {}
) => {
  const verifyToken = await verifyAccessToken();
  if (!verifyToken) {
    await getRefreshToken();
  }

  const token = getPersistedTokens().access;

  hdrs = { ...hdrs, Authorization: `Bearer ${token}` };
  return await api(url, method, payload, hdrs);
};

export const verifyAccessToken = async () => {
  let isValid = false;

  const manager = new FunctionCooldownManager("verifyAccessToken", 10000);
  isValid = await manager.executeAsync(async () => {
    let iV = false;
    const tokens = getPersistedTokens();
    if (Object.keys(tokens).length) {
      const res = await api("auth/token/verify", Method.POST, {
        token: tokens.access,
      });
      if (res.status == 200 && res.data) iV = res.data.isValid;
    }
    return iV;
  });

  return isValid;
};

export const getRefreshToken = async () => {
  const res = await api("auth/token/refresh", Method.POST, {
    refresh: getPersistedTokens().refresh,
  });

  const resCopy = { ...res };

  if ((res.status = 200 && res.data)) {
    // manually set tokens to localstorage
    localStorage.setItem(LocalStorageKeys.ACCESS, res.data.access);
    localStorage.setItem(LocalStorageKeys.REFRESH, res.data.refresh);
    localStorage.setItem(
      LocalStorageKeys.CURRENT_USER,
      JSON.stringify(res.data.user)
    );
  }

  return resCopy;
};

export const getPersistedTokens = () => {
  const access = localStorage.getItem(LocalStorageKeys.ACCESS);
  const refresh = localStorage.getItem(LocalStorageKeys.REFRESH);

  const token = {};
  if (access) token.access = access;
  if (refresh) token.refresh = refresh;

  return token;
};
