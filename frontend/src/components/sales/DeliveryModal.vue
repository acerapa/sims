<template>
  <ModalWrapper
    title="Update Delivery Status"
    v-model="showModal"
    :save-btn="props.selectedId ? 'Update' : 'Save'"
    @submit="onSubmit"
  >
    <div class="mt-7 flex flex-col gap-10" v-if="delivery">
      <div class="flex gap-3 items-center">
        <CustomInput
          type="text"
          class="flex-1"
          :disabled="true"
          :has-label="true"
          name="order_number"
          label="Order Number"
          placeholder="Order Number"
          v-model="delivery.sales_order_id"
        />
        <div class="flex-1 flex flex-col gap-3" v-if="status">
          <small>Select Status</small>
          <SelectStatusDropdown
            v-model="status"
            :status-map="DeliveryStatusMap"
            :class="
              status == DeliveryStatus.DELIVERED ||
              status == DeliveryStatus.CANCELLED
                ? 'pointer-events-none'
                : ''
            "
          />
        </div>
      </div>
      <div class="flex gap-3">
        <CustomInput
          type="text"
          class="flex-1"
          :has-label="true"
          name="courier"
          label="Courier"
          :disabled="true"
          placeholder="Courier"
          v-model="delivery.courier"
        />
        <CustomInput
          type="date"
          class="flex-1"
          :disabled="true"
          :has-label="true"
          name="delivery-date"
          label="Delivery Date"
          placeholder="Delivery Date"
          v-model="delivery.delivery_date"
        />
      </div>
    </div>
  </ModalWrapper>
</template>

<script setup>
import CustomInput from '../shared/CustomInput.vue'
import ModalWrapper from '../shared/ModalWrapper.vue'
import SelectStatusDropdown from '../stock-transfer/SelectStatusDropdown.vue'

import { useSalesStore } from '@/stores/sales'
import { onMounted, ref } from 'vue'
import { useDeliveryStore } from '@/stores/delivery'
import { DateHelpers, DeliveryStatus, DeliveryStatusMap } from 'shared'
import Event from '@/event'
import { EventEnum } from '@/data/event'
import { ToastTypes } from '@/data/types'

const salesOrderStore = useSalesStore()
const delivertStore = useDeliveryStore()

const delivery = ref(null)
const salesOrder = ref({})
const status = ref('')

const props = defineProps({
  selectedId: {
    type: Number,
    required: false
  }
})

const showModal = defineModel()

const onSubmit = async () => {
  if (status.value != delivery.value.status) {
    const isSuccess = await delivertStore.updateDeliveryStatus(
      props.selectedId,
      { status: status.value }
    )

    if (isSuccess) {
      showModal.value = false
      Event.emit(EventEnum.TOAST_MESSAGE, {
        type: ToastTypes.SUCCESS,
        message: 'Delivery status updated successfully'
      })
    } else {
      Event.emit(EventEnum.TOAST_MESSAGE, {
        type: ToastTypes.ERROR,
        message: 'Failed to update delivery status'
      })
    }
  }
}

onMounted(async () => {
  delivery.value = await delivertStore.getDeliveryById(props.selectedId)
  salesOrder.value = await salesOrderStore.getSalesOrder(
    delivery.value.sales_order_id
  )

  // date patches
  if (delivery.value) {
    delivery.value.delivery_date = DateHelpers.formatDate(
      delivery.value.delivery_date,
      'YYYY-MM-DD'
    )

    // set the previous status
    status.value = delivery.value.status
  }
})
</script>
