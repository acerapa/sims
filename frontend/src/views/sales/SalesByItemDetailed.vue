<template>
  <div ref="tableRef">
    <CustomTable :data="[]">
      <template #table_header>
        <div class="grid grid-cols-15 gap-3">
          <p class="col-span-3 table-header">Type</p>
          <p class="col-span-2 table-header">Date</p>
          <p class="col-span-1 table-header"># Item</p>
          <p class="col-span-3 table-header">Memo</p>
          <p class="col-span-3 table-header">Name</p>
          <p class="col-span-1 table-header">Qty</p>
          <p class="col-span-1 table-header">Price</p>
          <p class="col-span-1 table-header">Amount</p>
        </div>
      </template>
    </CustomTable>
  </div>
</template>

<script setup>
import CustomTable from '@/components/shared/CustomTable.vue'
</script>
