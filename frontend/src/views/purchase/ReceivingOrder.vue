<template>
  <div class="table-wrapper">
    <div class="flex flex-col gap-2" v-if="purchaseOrder">
      <p><b>PO #:</b> {{ purchaseOrder.id }}</p>
      <p>
        <b>Date Ordered #:</b>
        {{ DateHelpers.formatDate(purchaseOrder.date) }}
      </p>
      <p>
        <b>Supplier:</b>
        {{ purchaseOrder.supplier.company_name }}
      </p>
      <div class="flex items-center gap-2">
        <p><b>Delivery Number:</b></p>
        <CustomInput
          type="text"
          class="w-fit"
          :error-has-text="true"
          name="delivery_number"
          :disabled="isCompleted"
          placeholder="Delivery Number"
          v-model="model.order.delivery_number"
          :error="errors.order?.delivery_number"
        />
      </div>
    </div>
    <hr class="-mx-4" />
    <div class="" ref="tableWrapper">
      <MultiSelectTable
        v-model="model.products"
        :has-add-new-item="false"
        :row-event-name="rowEventName"
        :row-component="ReceivingOrderRow"
        :header-component="ReceivingOrderHeader"
        :format="{}"
        :is-disabled="isCompleted"
      >
        <template #>
          <div class="grid grid-cols-9 gap-3 min-w-[1106px]">
            <p class="table-header col-span-2">Item Description</p>
            <p class="table-header col-span-1">Cost</p>
            <p class="table-header col-span-1">Ord Qty</p>
            <p class="table-header col-span-1">Amount</p>
            <p class="table-header col-span-1">Recv Qty</p>
            <p class="table-header col-span-2">Remarks</p>
            <p class="table-header col-span-1">status</p>
          </div>
        </template>
      </MultiSelectTable>
    </div>

    <div class="flex gap-3 mt-5 w-fit ml-auto mr-0">
      <button
        class="btn-outline !border-danger !text-danger w-fit mx-auto"
        @click="onCancel"
        v-if="!isCompleted"
      >
        Cancel
      </button>
      <button class="btn w-fit mx-auto" v-if="!isCompleted" @click="onSubmit">
        Receive Order
      </button>
      <button
        class="btn w-fit mx-auto"
        v-if="isCompleted"
        @click="router.back()"
      >
        Back
      </button>
    </div>
  </div>
</template>

<script setup>
import { EventEnum } from '@/data/event'
import Event from '@/event'
import { PurchaseConst } from '@/const/route.constants'
import { usePurchaseOrderStore } from '@/stores/purchase-order'
import { PurchaseOrderStatus, ReceivePurchaseOrderSchema } from 'shared'
import { DateHelpers } from 'shared/helpers'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ToastTypes } from '@/data/types'
import { useTableScroll } from '@/use/useTableScroll'
import { storeToRefs } from 'pinia'
import { useValidation } from '@/composables/useValidation'

import CustomInput from '@/components/shared/CustomInput.vue'
import ReceivingOrderHeader from '@/components/Inventory/ReceiveOrder/ReceivingOrderHeader.vue'
import ReceivingOrderRow from '@/components/Inventory/ReceiveOrder/ReceivingOrderRow.vue'
import MultiSelectTable from '@/components/shared/MultiSelectTable.vue'

const route = useRoute()
const router = useRouter()
const purchaseOrderStore = usePurchaseOrderStore()
const { purchaseOrder } = storeToRefs(purchaseOrderStore)

const tableWrapper = ref(null)
const rowEventName = 'receiving-order-row'

// composables
useTableScroll(tableWrapper)

const modelDefualtValue = {
  order: {
    status: PurchaseOrderStatus.COMPLETED,
    delivery_number: ''
  },
  products: [
    {
      id: '',
      status: '',
      remarks: '',
      product_id: '',
      quantity_received: ''
    }
  ]
}

const model = ref({ ...modelDefualtValue })

// use validation composable
const { errors, hasErrors, validateData } = useValidation(
  ReceivePurchaseOrderSchema,
  model.value
)

/** ================================================
 * EVENTS
 ** ================================================*/

Event.emit(EventEnum.IS_PAGE_LOADING, true)

/** ================================================
 * COMPUTED
 ** ================================================*/
const isCompleted = computed(
  () =>
    purchaseOrder.value &&
    purchaseOrder.value.status == PurchaseOrderStatus.COMPLETED
)

/** ================================================
 * METHODS
 ** ================================================*/

const onCancel = () => {
  router.back()
}

const onSubmit = async () => {
  validateData()
  if (hasErrors.value) {
    if (errors.value.products) {
      Event.emit(rowEventName, errors.value.products)
    }
    return
  }

  const isSuccess = await purchaseOrderStore.receivePurchaseOrder(
    route.params.id,
    model.value
  )

  if (isSuccess) {
    await purchaseOrderStore.fetchPurchaseOrderById(route.params.id)
    router.push({
      name: PurchaseConst.PURCHASE_ORDER_FORM,
      query: {
        id: route.params.id
      }
    })

    Event.emit(EventEnum.TOAST_MESSAGE, {
      message: 'Purchase order received successfully',
      type: ToastTypes.SUCCESS,
      duration: 2000
    })
  } else {
    Event.emit(EventEnum.TOAST_MESSAGE, {
      message: 'Failed to receive purchase order',
      type: ToastTypes.ERROR,
      duration: 2000
    })
  }
}

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  if (route.params.id) {
    await purchaseOrderStore.fetchPurchaseOrderById(route.params.id)

    model.value.order.delivery_number = purchaseOrder.value.delivery_number
    model.value.order.status = purchaseOrder.value.status

    model.value.products = [
      ...purchaseOrderStore.purchaseOrder.products.map((product) => {
        return {
          id: product.PurchaseOrderProducts.id,
          remarks: product.PurchaseOrderProducts.remarks,
          quantity_received: product.PurchaseOrderProducts.quantity,
          status: product.PurchaseOrderProducts.status
            ? product.PurchaseOrderProducts.status
            : PurchaseOrderProductsedStatus.OPEN,
          product_id: product.id
        }
      })
    ]
  }

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
