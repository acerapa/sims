import { api, Method } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useServiceStore = defineStore('service', () => {
  const services = ref([])
  const service = ref(null)

  const fetchServices = async () => {
    const res = await api('services')
    if (res.status < 400) {
      services.value = res.data.services
    }
  }

  const fetchService = async (id) => {
    const res = await api(`services/${id}`)
    if (res.status < 400) {
      service.value = res.data.service
    }
  }

  const getServices = async () => {
    if (!services.value.length) {
      await fetchServices()
    }

    return services.value
  }

  const getService = async (id) => {
    if (!service.value || service.value.id != id) {
      await fetchService(id)
    }

    return service.value
  }

  const registerService = async (service) => {
    const res = await api('services/register', Method.POST, service)

    const isSuccess = res.status < 400

    if (isSuccess) {
      if (!services.value.length) {
        await fetchServices()
      } else {
        services.value = [res.data.service, ...services.value]
      }
    }

    return isSuccess
  }

  const updateService = async (id, data) => {
    const res = await api(`services/${id}`, Method.PUT, data)
    const isSuccess = res.status < 400

    if (isSuccess) {
      if (services.value.length) {
        const index = services.value.findIndex((s) => s.id == id)
        const s = [...services.value]
        await fetchService(id)

        if (index > -1 && service.value) {
          s[index] = service.value
          services.value = s
        }
      } else {
        await fetchServices()
      }
    }

    return isSuccess
  }

  const removeService = async (id) => {
    if (!services.value.length) {
      await fetchServices()
    } else {
      services.value = services.value.filter((s) => s.id !== id)
    }
  }

  return {
    service,
    services,

    fetchService,
    fetchServices,
    registerService,

    getService,
    getServices,

    updateService,
    removeService
  }
})
