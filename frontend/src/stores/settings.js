import { authenticatedApi } from '@/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSettingsStore = defineStore('settings', () => {
	const productCategories = ref([]);
	const accounts = ref([]);

	const fetchAllProductCategories = async () => {
		const res = await authenticatedApi('product-category/all');
		if (res.status == 200) {
			productCategories.value = res.data.categories;
		}
	};

	const fetchAllAccounts = async () => {
		const res = await authenticatedApi('settings/accounts/all');
		if (res.status == 200) {
			accounts.value = res.data.accounts;
		}
	}

	return {
		accounts,
		productCategories,
		fetchAllAccounts,
		fetchAllProductCategories
	}
});
