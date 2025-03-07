import { io } from 'socket.io-client'
import { onMounted, onUnmounted, ref } from 'vue'

export const useNotificationSocket = () => {
  const socket = ref(null)

  onMounted(() => {
    socket.value = io(`${import.meta.env.VITE_SOCKET_SERVER}/notification`)
  })

  onUnmounted(() => {
    if (socket.value) socket.value.disconnect()
  })

  return {
    socket
  }
}
