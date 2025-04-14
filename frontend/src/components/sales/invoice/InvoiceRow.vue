<template>
  <div class="grid gap-3 grid-cols-9 min-w-[985px]">
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="text-sm">{{ props.invoice.id }}</p>
    </div>
    <p class="col-span-2 text-sm">{{ customerName }}</p>
    <p class="col-span-2 text-sm">{{ employeeName }}</p>
    <p class="col-span-1 text-sm">
      {{
        new Date(props.invoice.issue_date).toLocaleString('default', {
          month: 'short',
          day: '2-digit',
          year: 'numeric'
        })
      }}
    </p>
    <p class="col-span-1 text-sm">
      {{
        new Date(props.invoice.due_date).toLocaleString('default', {
          month: 'short',
          day: '2-digit',
          year: 'numeric'
        })
      }}
    </p>
    <div class="col-span-1 text-sm">
      <BadgeComponent
        :text="InvoiceStatusMap[props.invoice.status].text"
        :custom-class="InvoiceStatusMap[props.invoice.status].class"
      />
    </div>
    <p class="col-span-1 text-sm">₱ {{ props.invoice.total }}</p>
  </div>
</template>

<script setup>
import { useCustomerStore } from '@/stores/customer'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { InvoiceStatusMap } from 'shared'

import BadgeComponent from '@/components/shared/BadgeComponent.vue'
import { useEmployeeStore } from '@/stores/employee'

const customerStore = useCustomerStore()
const { customers } = storeToRefs(customerStore)
const employeeStore = useEmployeeStore()
const { employees } = storeToRefs(employeeStore)

const props = defineProps({
  invoice: {
    type: Object,
    default: () => ({})
  }
})

/** ================================================
 * COMPUTED
 ** ================================================*/
const customerName = computed(() => {
  const customer = customers.value.find(
    (c) => c.id == props.invoice.customer_id
  )

  return customer ? `${customer.first_name} ${customer.last_name}` : ''
})

const employeeName = computed(() => {
  const employee = employees.value.find(
    (e) => e.id == props.invoice.employee_id
  )

  return employee ? `${employee.first_name} ${employee.last_name}` : ''
})
</script>
