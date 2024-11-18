import {
  Method,
  api,
  getPersistedTokens,
  getRefreshToken,
  verifyAccessToken
} from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { LocalStorageKeys } from 'shared/enums'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref('')
  const refreshToken = ref('')
  const authUser = ref(null)

  const setAuthAndTokens = (access, refresh, auth, isPersist = false) => {
    accessToken.value = access
    refreshToken.value = refresh
    authUser.value = auth

    if (isPersist) {
      localStorage.setItem(LocalStorageKeys.ACCESS, accessToken.value)
      localStorage.setItem(LocalStorageKeys.REFRESH, refreshToken.value)
      localStorage.setItem(
        LocalStorageKeys.CURRENT_USER,
        JSON.stringify(authUser.value)
      )
    }
  }

  const getTokens = () => {
    if (!accessToken.value && refreshToken.value) {
      const tokens = getPersistedTokens()
      if (access && refresh) {
        accessToken.value = tokens.access
        refreshToken.value = tokens.refresh
      }
    }

    return { access: accessToken.value, refresh: refreshToken.value }
  }

  const getAuthUser = () => {
    if (!authUser.value) {
      let user = localStorage.getItem(LocalStorageKeys.CURRENT_USER)
      if (user) {
        authUser.value = JSON.parse(user)
      }
    }

    return authUser.value
  }

  const authenticate = async (credentials) => {
    const res = await api('auth/login', Method.POST, credentials)
    if (res.status == 200 && res.data) {
      setAuthAndTokens(res.data.access, res.data.refresh, res.data.user, true)
    }
    return res
  }

  const logout = async () => {
    localStorage.removeItem(LocalStorageKeys.ACCESS)
    localStorage.removeItem(LocalStorageKeys.REFRESH)
    localStorage.removeItem(LocalStorageKeys.CURRENT_USER)

    accessToken.value = ''
    refreshToken.value = ''
    authUser.value = null
  }

  return {
    logout,
    getTokens,
    getAuthUser,
    authenticate
  }
})

export const isAuthenticated = async () => {
  let isAuth = false
  const access = localStorage.getItem(LocalStorageKeys.ACCESS)
  const refresh = localStorage.getItem(LocalStorageKeys.REFRESH)

  if (access) {
    isAuth = await verifyAccessToken()
  }

  if (refresh && !isAuth) {
    const res = await getRefreshToken()
    if (res.status == 200) {
      isAuth = true
    } else {
      // discard the current tokens and user in local storage
      // if auth is still false
      localStorage.removeItem(LocalStorageKeys.ACCESS)
      localStorage.removeItem(LocalStorageKeys.REFRESH)
      localStorage.removeItem(LocalStorageKeys.CURRENT_USER)
    }
  }

  return isAuth
}
