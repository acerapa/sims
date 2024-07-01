import { authenticatedApi } from '@/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePurchaseOrderStore = defineStore('purchase-order', () => {
	const purchaseOrders = ref([]);

	const fetchPurchaseOrders = async () => {
		const res = await authenticatedApi('/purchase-order/all');
		if (res.status == 200) {
			purchaseOrders.value = res.data.orders;
		}
	} 

	return {
		purchaseOrders,
		fetchPurchaseOrders
	}
});
