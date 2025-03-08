<template>
  <div>
    <CustomTable
      class="!w-auto"
      :data="filteredData"
      title="Payment Method list"
      :table-row-component="PaymentMethodRow"
      @add-new-record="onNewRecord"
    >
      <template #table_header>
        <div class="grid gap-3 grid-cols-8">
          <div class="col-span-1 flex gap-3 items-center">
            <input type="checkbox" class="input" />
            <p class="table-header">#</p>
          </div>
          <p class="col-span-7 table-header">Name</p>
        </div>
      </template>
    </CustomTable>
  </div>
  <PaymentMethodModal v-model="showModal" v-if="showModal" />
</template>

<script setup>
import CustomTable from '@/components/shared/CustomTable.vue'
import { usePaymentMethodStore } from '@/stores/payment-method'
import PaymentMethodRow from '@/components/sales/payment-method/PaymentMethodRow.vue'
import PaymentMethodModal from '@/components/sales/payment-method/PaymentMethodModal.vue'
import { computed, onMounted, ref } from 'vue'

const paymentMethodStore = usePaymentMethodStore()

const showModal = ref(false)

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
  return paymentMethodStore.paymentMethods
})

/** ================================================
 * METHODS
 ** ================================================*/
const onNewRecord = () => {
  showModal.value = true
}

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await paymentMethodStore.getPaymentMethods()
})
</script>
