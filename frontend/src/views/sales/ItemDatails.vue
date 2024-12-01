<template>
  <div class="flex flex-col gap-6">
    <CustomTable :has-add-btn="false" :is-nested="true">
      <template #table_header>
        <div class="grid grid-cols-12 gap-3">
          <p class="table-header col-span-3 pl-3">Item Description</p>
          <p class="table-header col-span-2">Date</p>
          <p class="table-header col-span-1"># num</p>
          <p class="table-header col-span-2">Name</p>
          <p class="table-header col-span-1">Qty</p>
          <p class="table-header col-span-1">Sale Price</p>
          <p class="table-header col-span-1">Amount</p>
          <p class="table-header col-span-1">Balance</p>
        </div>
      </template>
      <template #tables>
        <div class="mt-5" v-for="sale in sampleData" :key="sale">
          <CustomTable
            :data="sale.sales"
            :has-tools="false"
            :has-add-btn="false"
            :title="sale.category"
            :row-prop-init="rowPropInit"
            :table-row-component="ItemDetailsRow"
          ></CustomTable>
        </div>
      </template>
    </CustomTable>
  </div>
</template>

<script setup>
import CustomTable from '@/components/shared/CustomTable.vue'
import ItemDetailsRow from '@/components/sales/ItemDetailsRow.vue'
import Event from '@/event'

const sampleData = [
  {
    category: 'Test Category 1',
    sales: [
      {
        name: 'Product 1',
        date: new Date(),
        id: 1,
        customer_name: 'Customer 1',
        quantity: 10,
        sale_price: 100,
        amount: 1000,
        balance: 1000
      },
      {
        name: 'Product 2',
        date: new Date(),
        id: 2,
        customer_name: 'Customer 2',
        quantity: 20,
        sale_price: 200,
        amount: 2000,
        balance: 2000
      },
      {
        name: 'Product 3',
        date: new Date(),
        id: 3,
        customer_name: 'Customer 3',
        quantity: 30,
        sale_price: 300,
        amount: 3000,
        balance: 3000
      }
    ]
  },
  {
    category: 'Test Category 2',
    sales: [
      {
        name: 'Product 2',
        date: new Date(),
        id: 2,
        customer_name: 'Customer 2',
        quantity: 20,
        sale_price: 200,
        amount: 2000,
        balance: 2000
      }
    ]
  },
  {
    category: 'Test Category 3',
    sales: [
      {
        name: 'Product 3',
        date: new Date(),
        id: 2,
        customer_name: 'Customer 2',
        quantity: 20,
        sale_price: 200,
        amount: 2000,
        balance: 2000
      }
    ]
  }
]

/** ================================================
 * EVENTS
 ** ================================================*/
const rowPropInit = 'item-details-row'
Event.on(rowPropInit, (data) => {
  return { sale: data }
})
</script>
