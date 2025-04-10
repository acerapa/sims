<template>
  <div class="table-wrapper">
    <div class="flex flex-col gap-0" v-if="purchaseOrderStore.purchaseOrder">
      <p><b>PO #:</b> {{ purchaseOrderStore.purchaseOrder.id }}</p>
      <p>
        <b>Date Ordered #:</b>
        {{ DateHelpers.formatDate(purchaseOrderStore.purchaseOrder.date) }}
      </p>
      <p>
        <b>Supplier:</b>
        {{ purchaseOrderStore.purchaseOrder.supplier.company_name }}
      </p>
    </div>
    <hr class="-mx-4" />
    <div class="" ref="tableWrapper">
      <MultiSelectTable
        v-model="model.products"
        :has-add-new-item="false"
        :row-component="ReceivingOrderRow"
        :header-component="ReceivingOrderHeader"
        :format="{}"
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
      >
        Cancel
      </button>
      <button class="btn w-fit mx-auto" @click="onReceiveOrder">
        Receive Order
      </button>
    </div>
  </div>
</template>

<script setup>
import { EventEnum } from '@/data/event'
import Event from '@/event'
import { getCost } from '@/helper'
import { PurchaseConst } from '@/const/route.constants'
import { usePurchaseOrderStore } from '@/stores/purchase-order'
import {
  ProductOrderedStatus,
  PurchaseOrderStatus,
  PurchaseOrderType
} from 'shared'
import { DateHelpers, ObjectHelpers } from 'shared/helpers'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ToastTypes } from '@/data/types'
import { useTableScroll } from '@/use/useTableScroll'

import ReceivingOrderHeader from '@/components/Inventory/ReceiveOrder/ReceivingOrderHeader.vue'
import ReceivingOrderRow from '@/components/Inventory/ReceiveOrder/ReceivingOrderRow.vue'
import MultiSelectTable from '@/components/shared/MultiSelectTable.vue'

const route = useRoute()
const router = useRouter()
const purchaseOrderStore = usePurchaseOrderStore()

const tableWrapper = ref(null)

// composables
useTableScroll(tableWrapper)

const products = ref([])

const modelDefualtValue = {
  order: {
    supplier_id: '',
    ref_no: '',
    date: DateHelpers.formatDate(new Date(), 'YYYY-MM-DD'),
    bill_due: '',
    type: PurchaseOrderType.COD,
    memo: '',
    amount: 0
  },
  address: {
    address1: '',
    address2: '',
    city: '',
    postal: ''
  },
  products: [
    {
      product_id: '',
      name: '',
      description: '',
      quantity: '',
      cost: '',
      amount: '',
      remarks: '',
      status: '',
      quantity_received: ''
    }
  ]
}

const model = ref({ ...modelDefualtValue })

/** ================================================
 * EVENTS
 ** ================================================*/

Event.emit(EventEnum.IS_PAGE_LOADING, true)

/** ================================================
 * METHODS
 ** ================================================*/

const onCancel = () => {
  router.back()
}

const onReceiveOrder = async () => {
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

    // check order status
    if (
      purchaseOrderStore.purchaseOrder.status === PurchaseOrderStatus.COMPLETED
    ) {
      Event.emit(EventEnum.TOAST_MESSAGE, {
        message: 'Purchase order already received!',
        type: ToastTypes.INFO,
        duration: 2000
      })

      setTimeout(() => {
        router.back()
      }, 1000)

      return
    }

    model.value.order = ObjectHelpers.assignSameFields(
      model.value.order,
      purchaseOrderStore.purchaseOrder
    )

    // few modification
    model.value.order.bill_due = DateHelpers.formatDate(
      model.value.order.bill_due,
      'YYYY-MM-DD'
    )
    model.value.order.date = DateHelpers.formatDate(
      model.value.order.date,
      'YYYY-MM-DD'
    )

    model.value.address = ObjectHelpers.assignSameFields(
      model.value.address,
      purchaseOrderStore.purchaseOrder.address
    )

    model.value.order.status = PurchaseOrderStatus.COMPLETED

    model.value.products = [
      ...purchaseOrderStore.purchaseOrder.products.map((product) => {
        return {
          product_id: product.id,
          name: product.product_details.purchase_description,
          remarks: product.PurchaseOrderProducts.remarks,
          description: product.PurchaseOrderProducts.description
            ? product.PurchaseOrderProducts.description
            : product.purchase_description,
          quantity: product.PurchaseOrderProducts.quantity,
          quantity_received: product.PurchaseOrderProducts.quantity,
          status: product.PurchaseOrderProducts.status
            ? product.PurchaseOrderProducts.status
            : PurchaseOrderProductsedStatus.OPEN,
          cost: getCost(
            product.PurchaseOrderProducts.cost,
            product,
            purchaseOrderStore.purchaseOrder.supplier_id
          ),
          amount: product.PurchaseOrderProducts.amount
        }
      })
    ]
  }

  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
