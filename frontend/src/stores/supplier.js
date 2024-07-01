import { authenticatedApi } from '@/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useVendorStore = defineStore('supplier', () => {
const suppliers = ref([]);

const selectedSupplier = ref();

const fetchAllSuppliers = async () => {
	const res = await authenticatedApi('suppliers/all');
	if (res.status == 200) {
		suppliers.value = res.data.suppliers;
	}
}

return {
	suppliers,
	selectedSupplier,
	fetchAllSuppliers
}
});
