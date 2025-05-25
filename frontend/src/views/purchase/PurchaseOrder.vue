<template>
  <DeleteConfirmModal
    v-model="showDeleteConfirmation"
    v-if="showDeleteConfirmation"
    :data="toDelete"
    :href="'purchase-order/delete'"
  />
  <CancelConfirmation
    v-model="showCancelModal"
    v-if="showCancelModal"
    :href="`purchase-order/${selectedId}/update`"
    :data="toUpdate"
    @after-update="purchaseOrderStore.fetchPurchaseOrders()"
  />
  <div class="flex flex-col gap-6" ref="tableRef">
    <CustomTable
      :has-filter="true"
      :data="filteredData"
      :has-pagination="true"
      v-model:search-text="searchText"
      btn-custom-text="New purchase order"
      :row-prop-init="purchaseOrderRowEvent"
      :table-row-component="PurchaseOrderRow"
      @add-new-record="onNewPurchaseOrder"
      @view="onView"
    >
      <template #table_header>
        <div class="grid grid-cols-11 gap-3 min-w-[935px]">
          <div class="col-span-1 flex gap-3 items-center">
            <input type="checkbox" class="input" />
            <p class="table-header">#</p>
          </div>
          <p class="col-span-2 table-header">Ref. No.</p>
          <p class="col-span-2 table-header">Supplier</p>
          <p class="col-span-1 table-header">Total</p>
          <p class="col-span-2 table-header">Date</p>
          <p class="col-span-2 table-header">Bill Due</p>
          <p class="col-span-1 table-header">Status</p>
        </div>
      </template>

      <template v-slot:filters>
        <div class="flex flex-col gap-3">
          <div>
            <small>Suppliers</small>
            <CustomInput
              type="select"
              v-if="supplierStore.supplierOptions.length"
              :options="supplierStore.supplierOptions"
              v-model="filters.supplier_id"
              placeholder="Select Supplier"
            />
          </div>
          <div>
            <small><b>Dates</b></small>
            <div class="flex gap-3 mt-1">
              <div class="flex flex-col">
                <small>from</small>
                <CustomInput
                  type="date"
                  name="from"
                  @reset="filters.date_from = ''"
                  v-model="filters.date_from"
                />
              </div>
              <div class="flex flex-col">
                <small>to</small>
                <CustomInput
                  type="date"
                  name="to"
                  @reset="filters.date_to = ''"
                  v-model="filters.date_to"
                />
              </div>
            </div>
          </div>
          <div>
            <small><b>Bill due dates</b></small>
            <div class="flex gap-3 mt-1">
              <div class="flex flex-col">
                <small>from</small>
                <CustomInput
                  type="date"
                  name="from"
                  @reset="filters.bill_date_from = ''"
                  v-model="filters.bill_date_from"
                />
              </div>
              <div class="flex flex-col">
                <small>to</small>
                <CustomInput
                  type="date"
                  name="to"
                  @reset="filters.bill_date_to = ''"
                  v-model="filters.bill_date_to"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </CustomTable>
  </div>
</template>

<script setup>
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue'
import CancelConfirmation from '@/components/Inventory/CancelConfirmation.vue'
import PurchaseOrderRow from '@/components/Inventory/PurchaseOrder/PurchaseOrderRow.vue'
import CustomInput from '@/components/shared/CustomInput.vue'
import CustomTable from '@/components/shared/CustomTable.vue'
import { EventEnum } from '@/data/event'
import Event from '@/event'
import { PurchaseConst } from '@/const/route.constants'
import { usePurchaseOrderStore } from '@/stores/purchase-order'
import { useVendorStore } from '@/stores/supplier'
import { DateHelpers } from 'shared'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTableScroll } from '@/use/useTableScroll'

const toDelete = ref()
const toUpdate = ref()
const filters = ref({
  supplier_id: '',
  date_from: '',
  date_to: '',
  bill_date_to: '',
  bill_date_from: ''
})
const selectedId = ref(0)
const searchText = ref('')
const showRowMenu = ref(false)
const showCancelModal = ref(false)
const showDeleteConfirmation = ref(false)
const tableRef = ref(null)

const router = useRouter()
const supplierStore = useVendorStore()

useTableScroll(tableRef, false)

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true)

// custom event
Event.on(EventEnum.GLOBAL_CLICK, function () {
  showRowMenu.value = false
})

// define purchase order props init
const purchaseOrderRowEvent = 'purchase-order-row-props-init'
Event.on(purchaseOrderRowEvent, function (data) {
  return { order: data }
})

/** ================================================
 * COMPUTED
 ** ================================================*/

const filteredData = computed(() => {
  return purchaseOrderStore.purchaseOrders
    .filter((purchaseOrder) =>
      DateHelpers.getRangeDates(
        filters.value.date_from,
        filters.value.date_to,
        purchaseOrder.date
      )
    )
    .filter((purchaseOrder) =>
      DateHelpers.getRangeDates(
        filters.value.bill_date_from,
        filters.value.bill_date_to,
        purchaseOrder.bill_due
      )
    )
    .filter((purchaseOrder) => {
      return filters.value.supplier_id
        ? purchaseOrder.supplier.id == filters.value.supplier_id
        : purchaseOrder
    })
    .filter((purchaseOrder) => {
      const searchCondition =
        `${purchaseOrder.id} ${purchaseOrder.ref_no} ${purchaseOrder.supplier.company_name} ${purchaseOrder.amount} ${DateHelpers.formatDate(purchaseOrder.date, 'M/D/YYYY')} ${DateHelpers.formatDate(purchaseOrder.bill_due, 'M/D/YYYY')}`.toLowerCase()

      return searchText.value
        ? searchCondition.includes(searchText.value.toLowerCase())
        : purchaseOrder
    })
})

/** ================================================
 * METHODS
 ** ================================================*/
const onNewPurchaseOrder = () => {
  router.push({
    name: PurchaseConst.PURCHASE_ORDER_FORM
  })
}

const onView = (id) => {
  router.push({
    name: PurchaseConst.PURCHASE_ORDER_FORM,
    query: {
      id: id ? id : selectedId.value
    }
  })
}

const purchaseOrderStore = usePurchaseOrderStore()

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/

onMounted(async () => {
  await supplierStore.getSuppliers()
  await purchaseOrderStore.getPurchaseOrders()
  Event.emit(EventEnum.IS_PAGE_LOADING, false)
})
</script>
