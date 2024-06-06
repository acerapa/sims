import { authenticatedApi } from '@/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSettingsStore = defineStore('settings', () => {
	const productCategories = ref([]);

	const fetchAllProductCategories = async () => {
		const res = await authenticatedApi('product-category/all');
		if (res.status == 200) {
			productCategories.value = res.data.categories;
		}
	};

	return {
		productCategories,
		fetchAllProductCategories
	}
});
