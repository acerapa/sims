<template>
  <div class="flex flex-col gap-4">
    <div class="cont">
      <div class="flex justify-between items-center !py-2 !pb-3">
        <h1 class="text-2xl font-bold">Physical Inventory Adjustment Form</h1>
        <CustomInput
          type="date"
          :has-label="true"
          name="date_started"
          label="Date Started:"
          :error-has-text="true"
          :disabled="true"
          v-model="model.adjustment_information.date_started"
          :error="errors.adjustment_information?.date_started"
          class="[&>div]:gap-3 [&>div]:items-center [&>div]:flex-row w-fit"
        />
      </div>
      <hr />
      <div class="flex gap-5">
        <CustomInput type="select" />
      </div>
    </div>
  </div>
</template>

<script setup>
import CustomInput from '@/components/shared/CustomInput.vue'
import { EventEnum } from '@/data/event'
import Event from '@/event'
import { usePhysicalInventoryStore } from '@/stores/physical-inventory'
import { storeToRefs } from 'pinia'
import { DateHelpers } from 'shared'
import { onMounted, ref } from 'vue'

const physicalInventoryStore = usePhysicalInventoryStore()
const { physicalInventories } = storeToRefs(physicalInventoryStore)

const model = ref({
  adjustment_information: {
    date_started: DateHelpers.formatDate(new Date(), 'YYYY-MM-DD')
  }
})

const errors = ref({}) // Temporary

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)

/** ================================================
 * LIFECYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
