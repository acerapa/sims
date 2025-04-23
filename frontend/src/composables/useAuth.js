import { api, Method } from '@/api'
import { ref } from 'vue'

const cachedAuthUser = ref(null)
export function useAuth() {
  const getAuthUser = async () => {
    if (!cachedAuthUser.value) {
      const res = await api('auth/me')
      cachedAuthUser.value = res.data.user
    }

    return cachedAuthUser.value
  }

  const signOut = async () => {
    await api('auth/logout', Method.POST)
    cachedAuthUser.value = null
  }

  const signIn = async (credentials) => {
    return await api('auth/login', Method.POST, credentials)
  }

  return {
    signIn,
    signOut,
    getAuthUser
  }
}
