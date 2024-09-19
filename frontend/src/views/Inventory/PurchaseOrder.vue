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
  <div class="flex flex-col gap-6">
    <RouterLink
      :to="{ name: 'purchase-order-create' }"
      class="btn w-fit"
      @click="
        showModal = true;
        isEdit = false;
      "
    >
      New Purchase Order
    </RouterLink>
    <CustomTable
      class="relative"
      :has-filter="true"
      :data="filteredData"
      :has-add-btn="false"
      :has-pagination="true"
      v-model:is-edit="isEdit"
      v-model:show-modal="showModal"
      v-model:search-text="searchText"
      :row-prop-init="purchaseOrderRowEvent"
      :table-row-component="PurchaseOrderRow"
      :table-header-component="PurchaseOrderTableHeader"
      @open-menu="onSelectRow"
    >
      <RowMenu
        :top="top"
        v-if="showRowMenu"
        :has-delete="showDeleteAndConfirmPO"
        @view="onView"
        @delete="onDelete"
      >
        <button class="row-menu-item" @click="onCancelPO" v-if="showCancelPO">
          Cancel PO
        </button>
        <button
          class="row-menu-item"
          @click="onConfirmPO"
          v-if="showDeleteAndConfirmPO"
        >
          Confirm PO
        </button>
        <button class="row-menu-item" @click="onReceivePO" v-if="showReceivePO">
          Receive PO
        </button>
      </RowMenu>
      <template v-slot:filters>
        <div class="flex flex-col gap-3">
          <div>
            <small>Suppliers</small>
            <CustomSelectInput
              v-if="supplierOptions"
              :options="supplierOptions"
              v-model="filters.supplier_id"
              placeholder="Select Supplier"
            />
          </div>
          <div>
            <small><b>Dates</b></small>
            <div class="flex gap-3 mt-1">
              <div class="flex flex-col">
                <small>from</small>
                <input
                  type="date"
                  name="from"
                  class="input"
                  @reset="filters.date_from = ''"
                  v-model="filters.date_from"
                />
              </div>
              <div class="flex flex-col">
                <small>to</small>
                <input
                  type="date"
                  name="to"
                  class="input"
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
                <input
                  type="date"
                  name="from"
                  class="input"
                  @reset="filters.bill_date_from = ''"
                  v-model="filters.bill_date_from"
                />
              </div>
              <div class="flex flex-col">
                <small>to</small>
                <input
                  type="date"
                  name="to"
                  class="input"
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
import { usePurchaseOrderStore } from "@/stores/purchase-order";
import { onMounted, ref } from "vue";
import PurchaseOrderRow from "@/components/Inventory/PurchaseOrderRow.vue";
import CustomTable from "@/components/shared/CustomTable.vue";
import CustomSelectInput from "@/components/shared/CustomSelectInput.vue";
import RowMenu from "@/components/shared/RowMenu.vue";
import Event from "@/event";
import { useRouter } from "vue-router";
import CancelConfirmation from "@/components/Inventory/CancelConfirmation.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";
import PurchaseOrderTableHeader from "@/components/Inventory/PurchaseOrderTableHeader.vue";
import { PurchaseOrderStatus } from "shared/enums/purchase-order";
import { computed } from "vue";
import { authenticatedApi, Method } from "@/api";
import { EventEnum } from "@/data/event";
import { DateHelpers } from "shared/helpers/date";
import { useVendorStore } from "@/stores/supplier";

const top = ref(0);
const toDelete = ref();
const toUpdate = ref();
const filters = ref({
  supplier_id: "",
  date_from: "",
  date_to: "",
  bill_date_to: "",
  bill_date_from: "",
});
const selectedId = ref(0);
const selectedRow = ref();
const isEdit = ref(false);
const searchText = ref("");
const showModal = ref(false);
const showRowMenu = ref(false);
const supplierOptions = ref([]);
const showCancelModal = ref(false);
const showDeleteConfirmation = ref(false);

const router = useRouter();
const supplierStore = useVendorStore();

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true);

// custom event
Event.on(EventEnum.GLOBAL_CLICK, function () {
  showRowMenu.value = false;
});

// define purchase order props init
const purchaseOrderRowEvent = "purchase-order-row-props-init";
Event.on(purchaseOrderRowEvent, function (data) {
  return { order: data };
});

/** ================================================
 * COMPUTED
 ** ================================================*/

// computed
const showCancelPO = computed(() => {
  return (
    selectedRow.value.status != PurchaseOrderStatus.CANCELLED &&
    selectedRow.value.status != PurchaseOrderStatus.COMPLETED &&
    selectedRow.value.status != PurchaseOrderStatus.CONFIRMED &&
    selectedRow.value.status == PurchaseOrderStatus.OPEN
  );
});

const showReceivePO = computed(() => {
  return (
    selectedRow.value.status != PurchaseOrderStatus.CANCELLED &&
    selectedRow.value.status != PurchaseOrderStatus.COMPLETED &&
    selectedRow.value.status != PurchaseOrderStatus.OPEN &&
    selectedRow.value.status == PurchaseOrderStatus.CONFIRMED
  );
});

const showDeleteAndConfirmPO = computed(() => {
  return selectedRow.value.status == PurchaseOrderStatus.OPEN;
});

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
        : purchaseOrder;
    })
    .filter((purchaseOrder) => {
      const searchCondition =
        `${purchaseOrder.id} ${purchaseOrder.ref_no} ${purchaseOrder.supplier.company_name} ${purchaseOrder.amount} ${DateHelpers.formatDate(purchaseOrder.date, "M/D/YYYY")} ${DateHelpers.formatDate(purchaseOrder.bill_due, "M/D/YYYY")}`.toLowerCase();

      return searchText.value
        ? searchCondition.includes(searchText.value.toLowerCase())
        : purchaseOrder;
    });
});

/** ================================================
 * METHODS
 ** ================================================*/

const onSelectRow = (id) => {
  selectedId.value = id;
  selectedRow.value = purchaseOrderStore.purchaseOrders.find(
    (order) => order.id == id
  );

  top.value = event.target.offsetTop;
  showRowMenu.value = true;
};

const onView = () => {
  router.push({
    name: "purchase-order-create",
    query: {
      id: selectedId.value,
    },
  });
};

const onDelete = () => {
  toDelete.value = {
    order_id: selectedId.value,
  };
  showDeleteConfirmation.value = true;
};

const onCancelPO = () => {
  toUpdate.value = { order: { status: PurchaseOrderStatus.CANCELLED } };
  showCancelModal.value = true;
};

const onConfirmPO = async () => {
  const res = await authenticatedApi(
    `purchase-order/${selectedId.value}/update`,
    Method.POST,
    {
      order: {
        status: PurchaseOrderStatus.CONFIRMED,
      },
    }
  );

  if (res.status == 200) {
    await purchaseOrderStore.fetchPurchaseOrders();
  }
};

const onReceivePO = () => {
  router.push({
    name: "purchase-receive-order",
    params: {
      id: selectedId.value,
    },
  });
};
const purchaseOrderStore = usePurchaseOrderStore();

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/

onMounted(async () => {
  supplierOptions.value = await supplierStore.getSupplierOptions();
  await purchaseOrderStore.fetchPurchaseOrders();
  Event.emit(EventEnum.IS_PAGE_LOADING, false);
});
</script>
