<template>
  <ModalWrapper :title="title" v-model="showModal">
    <div class="flex mt-7 pb-5">
      <CustomInput
        type="text"
        class="flex-1"
        :has-label="true"
        v-model="model.name"
        name="payment_method"
        :error-has-text="true"
        :error="modelError.name"
        label="Payment Method Name"
        placeholder="Payment Method Name"
      />
    </div>
  </ModalWrapper>
</template>

<script setup>
import CustomInput from '@/components/shared/CustomInput.vue'
import ModalWrapper from '@/components/shared/ModalWrapper.vue'
import { ref } from 'vue'

const props = defineProps({
  selectedId: {
    type: Number,
    required: false
  }
})

const model = ref({ name: '' })
const modelError = ref({})

const title = props.selectedId
  ? 'Update Payment Method'
  : 'Create Payment Method'

const showModal = defineModel()
</script>
