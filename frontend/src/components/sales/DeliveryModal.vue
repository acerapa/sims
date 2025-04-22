<template>
  <ModalWrapper
    title="Delivery Details"
    v-model="showModal"
    :save-btn="props.selectedId ? 'Update' : 'Save'"
  >
    <div class="mt-7">
      <CustomInput
        type="text"
        class="flex-1"
        name="order_number"
        placeholder="Order Number"
        :has-label="true"
        label="Order Number"
      />
    </div>
  </ModalWrapper>
</template>

<script setup>
import CustomInput from '../shared/CustomInput.vue'
import ModalWrapper from '../shared/ModalWrapper.vue'

const props = defineProps({
  selectedId: {
    type: Number,
    required: false
  }
})

const showModal = defineModel()
</script>
