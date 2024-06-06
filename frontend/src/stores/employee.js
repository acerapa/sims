import { authenticatedApi } from '@/api';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useEmployeeStore = defineStore('employee', () => {
	const employees = ref([]);


	const fetchAllEmployees = async () => {
		const res = await authenticatedApi('users/all');
		if (res.status == 200) {
			employees.value = res.data.users;
		}
	}

	return {
		employees,
		fetchAllEmployees
	}
});
