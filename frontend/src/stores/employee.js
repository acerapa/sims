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

    return employees.value;
  };

  const employeeOptions = () => {
    return employees.value.map((employee) => {
      return {
        text: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });
  };

  return {
    employees,
    employeeOptions,
    fetchAllEmployees,
  };
});
