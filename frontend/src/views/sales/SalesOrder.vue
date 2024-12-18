<template>
  <CustomTable
    title="Sales Order List"
    :data="[]"
    :row-prop-init="rowPropInit"
    @add-new-record="onAddNewRecord"
  ></CustomTable>
</template>

<script setup>
import CustomTable from '@/components/shared/CustomTable.vue'
import { EventEnum } from '@/data/event'
import Event from '@/event'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)

const rowPropInit = 'sales-order-row-prop-init'

/** ================================================
 * METHODS
 ** ================================================*/
const onAddNewRecord = () => {
  router.push({
    name: 'sales-order-form'
  })
}

onMounted(() => {
  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
