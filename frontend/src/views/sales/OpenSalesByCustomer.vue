<template>
  <div ref="tableRef">
    <CustomTable :has-add-btn="false">
      <template #buttons>
        <button class="btn flex gap-3 items-center" @click="onPrint">
          <img class="invert w-5" :src="Printer" />
          <p>Print</p>
        </button>
      </template>
    </CustomTable>
  </div>
</template>

<script setup>
import CustomTable from '@/components/shared/CustomTable.vue'
import { EventEnum } from '@/data/event'
import Event from '@/event'
import { useTableScroll } from '@/use/useTableScroll'
import { onMounted, ref } from 'vue'

// import icon
import Printer from '@/assets/icons/printer.png'

const tableRef = ref(null)

// composables
useTableScroll(tableRef, false)

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)

/** ================================================
 * METHODS
 ** ================================================*/

const onPrint = () => {
  // router.push({
  //   name: ReportConst.PRINT_SALES_BY_CUSTOMER_DETAILED,
  //   query: {
  //     search_text: searchText.value,
  //     ...dateFilter.value
  //   }
  // })
}

onMounted(() => {
  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
