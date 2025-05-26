<template>
  <div class="flex flex-col gap-4">
    <div class="cont flex flex-col gap-4">
      <div class="flex justify-between items-center !py-2 !pb-3">
        <h1 class="text-2xl font-bold">Physical Inventory Form</h1>
        <CustomInput
          type="date"
          :has-label="true"
          name="date_started"
          label="Date Started:"
          :error-has-text="true"
          :disabled="true"
          v-model="model.date_started"
          :error="errors.date_started"
          class="[&>div]:gap-3 [&>div]:items-center [&>div]:flex-row w-fit"
        />
      </div>
      <hr />
      <div class="flex flex-col gap-4">
        <p class="text-lg font-normal mb-1">Physical Inventory Information</p>
        <div class="flex gap-5">
          <CustomInput
            type="select"
            :options="[]"
            class="flex-1"
            :has-label="true"
            name="manager_id"
            :can-search="true"
            label="Branch Manager"
            :error-has-text="true"
            v-model="model.manager_id"
            placeholder="Select Manager"
          />
          <CustomInput
            type="select"
            :options="[]"
            class="flex-1"
            :has-label="true"
            :can-search="true"
            :error-has-text="true"
            v-model="model.manager_id"
            name="inventory_incharge_id"
            placeholder="Select Inventory In-Charge"
            label="Inventory In-Charge"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import CustomInput from '@/components/shared/CustomInput.vue'
import { EventEnum } from '@/data/event'
import Event from '@/event'
import { useEmployeeStore } from '@/stores/employee'
import { DateHelpers } from 'shared'
import { onMounted, ref } from 'vue'

const employeeStore = useEmployeeStore()

const model = ref({
  date_started: DateHelpers.formatDate(new Date(), 'YYYY-MM-DD')
})

const errors = ref({}) // temporary errors object

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)

/** ================================================
 * COMPUTED
 ** ================================================*/

/** ================================================
 * LIFECYCLE HOOKS
 ** ================================================*/
onMounted(() => {
  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
