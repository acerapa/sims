<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-col gap-3">
      <CustomInput
        type="text"
        name="address1"
        class="w-full"
        label="Address 1"
        placeholder="Address 1"
        v-model="formModel.address1"
        :disabled="props.disabled"
        :has-label="props.hasLabel"
      />
      <CustomInput
        type="text"
        class="w-full"
        name="address2"
        label="Address 2"
        placeholder="Address 2"
        v-model="formModel.address2"
        :disabled="props.disabled"
        :has-label="props.hasLabel"
      />
    </div>
    <div class="grid grid-cols-3 gap-6 max-lg:grid-cols-1 max-lg:gap-3">
      <CustomInput
        type="text"
        name="city"
        label="City"
        input-class="!min-w-0"
        placeholder="City"
        v-model="formModel.city"
        :disabled="props.disabled"
        :has-label="props.hasLabel"
      />
      <CustomInput
        type="text"
        name="province"
        label="Province"
        input-class="!min-w-0"
        placeholder="Province"
        v-model="formModel.province"
        :disabled="props.disabled"
        :has-label="props.hasLabel"
      />
      <CustomInput
        type="text"
        name="postal"
        label="Zip Code"
        input-class="!min-w-0"
        placeholder="Zip Code"
        v-model="formModel.postal"
        :disabled="props.disabled"
        :has-label="props.hasLabel"
      />
    </div>
  </div>
</template>
<script setup>
import CustomInput from './CustomInput.vue'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  hasLabel: {
    type: Boolean,
    default: false
  }
})

const formModel = defineModel()
</script>
