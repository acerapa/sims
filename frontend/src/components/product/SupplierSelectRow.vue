<template>
  <div
    class="grid grid-cols-6 gap-3"
    :class="isPreselected ? 'bg-gray-100' : ''"
  >
    <CustomInput
      name="supplier"
      type="select"
      class="col-span-4"
      :has-add-new="true"
      :error-has-text="false"
      :options="supplierOptions"
      v-model="model.supplier_id"
      placeholder="Select Supplier"
      :error="modelErrors.supplier_id"
      @add-new="showVendorModal = true"
      :input-class="isPreselected ? '!bg-gray-100' : ''"
      :disabled="props.isDisabled || isPreselected"
    />
    <CustomInput
      name="cost"
      type="number"
      class="col-span-1"
      v-model="model.cost"
      :error-has-text="false"
      :error="modelErrors.cost"
      :disabled="props.isDisabled"
    />
    <p
      class="col-span-1 text-sm pl-3 mt-[10px] flex justify-end mr-4"
      :class="[!props.isDisabled && !isPreselected ? '' : 'hidden']"
    >
      <img
        @click="emit('remove')"
        src="@/assets/icons/remove.svg"
        class="cursor-pointer w-5 h-5"
        alt="remove"
      />
    </p>
  </div>
  <VendorModal v-model="showVendorModal" v-if="showVendorModal" />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useVendorStore } from '@/stores/supplier'
import Event from '@/event'

import CustomInput from '../shared/CustomInput.vue'
import VendorModal from '../Vendor/VendorModal.vue'

const showVendorModal = ref(false)
const supplierStore = useVendorStore()

const props = defineProps({
  ndx: {
    type: Number,
    required: false
  },
  eventName: {
    type: String,
    required: false
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  preSelectedSups: {
    type: Array,
    default: []
  }
})

const emit = defineEmits(['remove'])

const model = defineModel()
const modelErrors = ref({})

/** ================================================
 * EVENTS
 ** ================================================*/
Event.on(
  props.eventName,
  (data) => {
    if (data && data[props.ndx]) {
      modelErrors.value = data[props.ndx]
    } else {
      modelErrors.value = {}
    }
  },
  true
)

/** ================================================
 * COMPUTED
 ** ================================================*/
const supplierOptions = computed(() => {
  return supplierStore.suppliers.map((supplier) => {
    return {
      text: supplier.company_name,
      value: supplier.id
    }
  })
})

const isPreselected = computed(() => {
  return props.preSelectedSups.includes(model.value.supplier_id)
})

onMounted(async () => {
  await supplierStore.getSuppliers()
})
</script>
