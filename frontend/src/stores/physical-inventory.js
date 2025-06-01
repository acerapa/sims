import { api, Method } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePhysicalInventoryStore = defineStore(
  'physical-inventory',
  () => {
    const physicalInventories = ref([])
    const physicalInventory = ref(null)

    const fetchAllPhysicalInventories = async () => {
      const res = await api(`physical-inventory/all`)

      if (res.status == 200) {
        physicalInventories.value = res.data.physical_inventories
      }

      return physicalInventories.value
    }

    const fetchOne = async (id) => {
      const res = await api(`physical-inventory/${id}`)
      if (res.status == 200) {
        physicalInventory.value = res.data.physical_inventory
      }

      return physicalInventory.value
    }

    const register = async (model) => {
      return await api(`physical-inventory/register`, Method.POST, model)
    }

    const update = async (id, model) => {
      const res = await api(
        `physical-inventory/update/${id}`,
        Method.PUT,
        model
      )

      const isSuccess = res.status < 300
      // TODO: Update the current physical inventory list
      // This is to avoid re-fetching all the physical inventory list again
      return isSuccess
    }

    const updateItem = async (id, model) => {
      const res = await api(`physical-inventory/item/${id}`, Method.POST, model)

      return res
    }

    const getGroupedItems = async (id) => {
      if (!physicalInventory.value || physicalInventory.value.id == id) {
        await fetchOne(id)
      }

      const physicalInventoryCopy = { ...physicalInventory.value }

      physicalInventoryCopy.grouped_items = Object.groupBy(
        physicalInventory.value.items,
        ({ product }) => product.category_id
      )

      return physicalInventoryCopy
    }

    const getPhysicalInventory = async (id) => {
      if (!physicalInventory.value || physicalInventory.value.id != id) {
        await fetchOne(id)
      }

      return physicalInventory.value
    }

    return {
      physicalInventory,
      physicalInventories,
      update,
      fetchOne,
      register,
      updateItem,
      getGroupedItems,
      getPhysicalInventory,
      fetchAllPhysicalInventories
    }
  }
)
