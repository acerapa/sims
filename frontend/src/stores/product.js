import { authenticatedApi } from '@/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProductStore = defineStore('product', () => {
	const products = ref([]);

	const fetchAllProducts = async () => {
		const res = await authenticatedApi('products/all');
		if (res.status == 200) {
			products.value = res.data.products;
		}
	}

	return {
		products,
		fetchAllProducts
	}
});
