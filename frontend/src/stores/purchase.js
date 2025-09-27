import { api } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePurchaseStore = defineStore('purchase', () => {
	const purchaseByVendor = ref([])

	const fetchPurchaseByVendor = async (from, to) => {
		const res = await api(`reports/purchase-by-vendor?from=${from}&to=${to}`)

		const isSuccess = res.status < 400

		if (isSuccess) {
			purchaseByVendor.value = res.data.purchase_by_vendor
		}
	}

	return {
		purchaseByVendor,

		fetchPurchaseByVendor
	}
})
