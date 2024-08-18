import { Method, api } from "@/api";
import { defineStore } from "pinia";
import { ref } from "vue";
import { LocalStorageKeys } from "shared/enums/local-storage";

export const useAuthStore = defineStore("auth", () => {
  const accessToken = ref("");
  const refreshToken = ref("");
  const authUser = ref(null);

  const setAuhtAndTokens = (access, refresh, auth, isPersist = false) => {
    accessToken.value = access;
    refreshToken.value = refresh;
    authUser.value = auth;

    if (isPersist) {
      localStorage.setItem(LocalStorageKeys.ACCESS, accessToken.value);
      localStorage.setItem(LocalStorageKeys.REFRESH, refreshToken.value);
      localStorage.setItem(
        LocalStorageKeys.CURRENT_USER,
        JSON.stringify(authUser.value)
      );
    }
  };

  const getTokens = () => {
    if (!accessToken.value && refreshToken.value) {
      const access = localStorage.getItem(LocalStorageKeys.ACCESS);
      const refresh = localStorage.getItem(LocalStorageKeys.REFRESH);
      if (access && refresh) {
        accessToken.value = access;
        refreshToken.value = refresh;
      }
    }

    return { access: accessToken.value, refresh: refreshToken.value };
  };

  const getAuthUser = () => {
    if (!authUser.value) {
      let user = localStorage.getItem(LocalStorageKeys.CURRENT_USER);
      if (user) {
        authUser.value = JSON.parse(user);
      }
    }

    return authUser.value;
  };

  const authenticate = async (credentials) => {
    const res = await api("auth/login", Method.POST, credentials);
    if (res.status == 200 && res.data) {
      setAuhtAndTokens(res.data.access, res.data.refresh, res.data.user, true);
    }
    return res;
  };

  return {
    getTokens,
    getAuthUser,
    authenticate,
  };
});
