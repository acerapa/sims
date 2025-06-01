import { api, Method } from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEmployeeStore = defineStore('employee', () => {
  const employee = ref(null)
  const employees = ref([])

  const fetchAllEmployees = async () => {
    const res = await api('users/all')
    if (res.status == 200) {
      employees.value = res.data.users
    }

    return employees.value
  }

  const fetchEmployee = async (id) => {
    const res = await api(`users/${id}`)
    if (res.status == 200) {
      employee.value = res.data.user
    }
  }

  const registerEmployee = async (employee) => {
    const res = await api('users/register', Method.POST, employee)
    const isSuccess = res.status < 400
    if (isSuccess) {
      if (employees.value.length) {
        employees.value.unshift(res.data.user)
      } else {
        await fetchAllEmployees()
      }
    }
    return isSuccess
  }

  const updateEmployee = async (id, data) => {
    const res = await api(`users/${id}/update`, Method.PUT, data)

    const isSuccess = res.status < 400

    if (isSuccess) {
      if (employees.value.length) {
        await fetchEmployee(id)
        const index = employees.value.findIndex((emp) => emp.id === id)
        if (index > -1) {
          employees.value[index] = employee.value

          employee.value = null
        }
      } else {
        await fetchAllEmployees()
      }
    }

    return isSuccess
  }

  const removeEmployee = async (id) => {
    if (employees.value.length) {
      const index = employees.value.findIndex((emp) => emp.id === id)
      if (index > -1) {
        employees.value.splice(index, 1)
      }
    } else {
      await fetchAllEmployees()
    }
  }

  // getters
  const employeeOptions = () => {
    return employees.value.map((employee) => {
      return {
        text: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
      }
    })
  }

  const getEmployees = async () => {
    if (!employees.value.length) {
      await fetchAllEmployees()
    }

    return employees.value
  }

  return {
    employees,
    removeEmployee,
    updateEmployee,
    employeeOptions,
    registerEmployee,
    fetchAllEmployees,

    getEmployees
  }
})
