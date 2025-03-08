<template>
  <ModalWrapper :title="title" v-model="showModal" @submit="onSubmit">
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
import { EventEnum } from '@/data/event'
import { ToastTypes } from '@/data/types'
import Event from '@/event'
import { usePaymentMethodStore } from '@/stores/payment-method'
import { PaymentMethodSchema } from 'shared'
import { onMounted, ref } from 'vue'

const props = defineProps({
  selectedId: {
    type: Number,
    required: false
  }
})

const paymentMethodStore = usePaymentMethodStore()

const model = ref({ name: '' })
const modelError = ref({})

const title = props.selectedId
  ? 'Update Payment Method'
  : 'Create Payment Method'

const showModal = defineModel()

/** ================================================
 * METHODS
 ** ================================================*/
const onSubmit = async () => {
  // validate
  const { error } = PaymentMethodSchema.validate(model.value, {
    abortEarly: false
  })

  if (error) {
    if (error) {
      error.details.forEach((err) => {
        modelError.value[err.context.key] = err.message
      })
      return
    }
  }
  // submit
  let isSuccess = false
  if (props.selectedId) {
    isSuccess = await paymentMethodStore.updatePaymentMethod(
      props.selectedId,
      model.value
    )
  } else {
    isSuccess = await paymentMethodStore.registerPaymentMethod(model.value)
  }

  if (isSuccess) {
    showModal.value = false
    Event.emit(EventEnum.TOAST_MESSAGE, {
      message: `Successfully ${
        props.selectedId ? 'updated' : 'created'
      } payment method!`,
      type: ToastTypes.SUCCESS
    })
  } else {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      message: `Failed to ${
        props.selectedId ? 'update' : 'create'
      } payment method!`,
      type: ToastTypes.ERROR
    })
  }
}

/** ================================================
 * LIFECYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  if (props.selectedId) {
    const paymentMethod = await paymentMethodStore.getPaymentMethod(
      props.selectedId
    )

    model.value.name = paymentMethod.name
  }
})
</script>
