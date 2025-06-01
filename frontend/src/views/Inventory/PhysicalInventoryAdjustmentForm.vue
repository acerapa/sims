<template>
  <div class="flex flex-col gap-4">
    <div class="cont flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold">Adjustment Form</h1>
        <RouterLink
          :to="{
            name: InventoryConst.PHYSICAL_INVENTORY_FORM,
            query: {
              id: 1
            }
          }"
        >
          For Physical Inventory #{{ 1 }}
        </RouterLink>
      </div>
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
    <div class="cont" ref="tableRef">Test</div>
  </div>
</template>

<script setup>
import Event from '@/event'
import { storeToRefs } from 'pinia'
import { DateHelpers } from 'shared'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { EventEnum } from '@/data/event'
import { InventoryConst } from '@/const/route.constants'
import CustomInput from '@/components/shared/CustomInput.vue'
import { usePhysicalInventoryStore } from '@/stores/physical-inventory'

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
