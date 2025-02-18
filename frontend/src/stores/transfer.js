import { authenticatedApi, Method } from '@/api'
import { defineStore } from 'pinia'
import { TransferType } from 'shared/enums'
import { computed, ref } from 'vue'

export const useTransferStore = defineStore('tranfer', function () {
  const transfers = ref([])
  const transfer = ref(null)

  const ibrrs = computed(() => {
    return transfers.value.filter((t) => t.type === TransferType.IBRR)
  })

  const strs = computed(() => {
    return transfers.value.filter((t) => t.type === TransferType.STR)
  })

  const rmas = computed(() => {
    return transfers.value.filter((t) => t.type === TransferType.RMA)
  })

  const fix = computed(() => {
    return transfers.value.filter((t) => t.type === TransferType.FIX)
  })

  const fetchTransfers = async () => {
    const res = await authenticatedApi(`stock-transfer`)

    if (res.status == 200) {
      transfers.value = res.data.transfers
    }
  }

  const getTransfers = async () => {
    if (!transfers.value.length) {
      await fetchTransfers()
    }

    return transfers.value
  }

  const createTransfer = async (model) => {
    const res = await authenticatedApi(
      `stock-transfer/register`,
      Method.POST,
      model
    )
    const isSuccess = res.status < 400

    if (isSuccess) {
      if (transfers.value.length) {
        transfers.value.unshift(res.data.transfer)
      } else {
        await fetchTransfers()
      }
    }

    return isSuccess
  }

  const updateTransfer = async (model, id) => {
    const res = await authenticatedApi(
      `stock-transfer/${id}`,
      Method.PUT,
      model
    )
    const isSuccess = res.status < 400

    if (isSuccess) {
      if (transfer.value) {
        if (id == transfer.value.id) {
          transfer.value = res.data.transfer
        }
      }

      if (transfers.value.length) {
        const index = transfers.value.findIndex((t) => t.id == id)
        if (index > -1) {
          transfers.value[index] = res.data.transfer
        }
      } else {
        await fetchTransfers()
      }
    }

    return isSuccess
  }

  const fetchById = async (id) => {
    const res = await authenticatedApi(`stock-transfer/${id}`)

    if (res.status == 200) {
      transfer.value = res.data.transfer
    }

    return transfer.value
  }

  const getById = async (id) => {
    if (!transfer.value || transfer.value.id != id) {
      await fetchById(id)
    } else {
      const t = transfers.value.find((t) => t.id == id)
      if (t) {
        transfer.value = t
      }
    }

    return transfer.value
  }

  const removeTransfer = async (id) => {
    if (transfers.value.length) {
      transfers.value = transfers.value.filter((t) => t.id != id)
    } else {
      // assuming the transfer is already deleted
      await fetchTransfers()
    }
  }

  return {
    fix,
    rmas,
    strs,
    ibrrs,
    transfer,
    transfers,

    getById,
    getTransfers,
    fetchTransfers,
    updateTransfer,
    removeTransfer,
    createTransfer
  }
})
