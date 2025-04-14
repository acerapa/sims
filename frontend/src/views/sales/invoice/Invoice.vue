<template>
  <CustomTable @add-new-record="onAddNew" class="w-[calc(100vw_-_328px)]">
    <template #table_header>
      <div class="grid gap-3 grid-cols-7 min-w-[985px]">
        <div class="col-span-1 flex gap-3 items-center">
          <input type="checkbox" class="input" />
          <p class="table-header">#</p>
        </div>
        <p class="col-span-2 table-header">Customer</p>
        <p class="col-span-1 table-header">Issue Date</p>
        <p class="col-span-1 table-header">Due Date</p>
        <p class="col-span-1 table-header">Payment Method</p>
        <p class="col-span-1 table-header">Total</p>
      </div>
    </template>
  </CustomTable>
</template>

<script setup>
import CustomTable from '@/components/shared/CustomTable.vue'
import { SalesConst } from '@/const/route.constants'
import { useRouter } from 'vue-router'

const router = useRouter()

/** ================================================
 * METHODS
 ** ================================================*/
const onAddNew = () => {
  router.push({
    name: SalesConst.INVOICE_FORM
  })
}
</script>
