<template>
  <div class="flex flex-col gap-3">
    <div class="cont flex flex-col gap-3" v-if="physicalInventory">
      <div class="flex justify-between">
        <div>
          <p>
            <strong>Physical Inventory for date:</strong>
            {{ DateHelpers.formatDate(physicalInventory.date, "MM/DD/YYYY") }}
          </p>
        </div>
        <BadgeComponent
          :text="PhysicalInventoryStatusMap[physicalInventory.status].text"
          :custom-class="
            PhysicalInventoryStatusMap[physicalInventory.status].class
          "
        />
      </div>
    </div>
    <CustomTable
      :has-filter="true"
      :has-add-btn="false"
      :data="filteredData"
      :has-check-box="false"
      :has-pagination="true"
      v-model:search-text="searchText"
      :row-prop-init="physicalItemInitRow"
      :table-row-component="PhysicalInventoryItemRow"
      :table-header-component="PhysicalInventoryItemHeader"
      @open-menu="onSelectRow"
    >
      <template v-slot:filters>
        <CustomInput
          type="select"
          label="Status"
          :has-label="true"
          name="status-filter"
          placeholder="Status"
          :options="[
            { text: 'Checked', value: true },
            { text: 'Unchecked', value: false },
          ]"
          v-model="filters.status"
        />
      </template>
      <RowMenu
        :has-delete="false"
        :has-view="false"
        v-if="showRowMenu"
        :top="top"
      >
        <button
          class="row-menu-item"
          v-if="!isItemChecked"
          @click="onItemUpdate"
        >
          Mark as Done
        </button>
        <button class="row-menu-item" v-else @click="onEditItem">Edit</button>
      </RowMenu>
    </CustomTable>
  </div>
</template>

<script setup>
import Event from "@/event";
import { useRoute } from "vue-router";
import { EventEnum } from "@/data/event";
import { DateHelpers } from "shared/helpers";
import { computed, onMounted, ref } from "vue";
import { useProductStore } from "@/stores/product";
import RowMenu from "@/components/shared/RowMenu.vue";
import CustomTable from "@/components/shared/CustomTable.vue";
import CustomInput from "@/components/shared/CustomInput.vue";
import BadgeComponent from "@/components/shared/BadgeComponent.vue";
import { PhysicalInventoryStatus } from "shared/enums/purchase-order";
import { usePhysicalInventoryStore } from "@/stores/physical-inventory";
import PhysicalInventoryItemRow from "@/components/Inventory/PhysicalInventoryItemRow.vue";
import PhysicalInventoryItemHeader from "@/components/Inventory/PhysicalInventoryItemHeader.vue";

const top = ref(0);
const items = ref([]);
const route = useRoute();
const selectedId = ref();
const searchText = ref("");
const showRowMenu = ref(false);
const physicalInventory = ref();
const isItemChecked = ref(false);
const productStore = useProductStore();
const physicalInventoryStore = usePhysicalInventoryStore();

const filters = ref({
  status: "",
});
const PhysicalInventoryStatusMap = {
  [PhysicalInventoryStatus.DRAFT]: {
    text: "Draft",
    class: "draft",
  },
  [PhysicalInventoryStatus.DONE]: {
    text: "Done",
    class: "done",
  },
};

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true);

Event.on(EventEnum.GLOBAL_CLICK, function () {
  showRowMenu.value = false;
});

const physicalItemInitRow = "physical-item-init-row";
Event.on(physicalItemInitRow, function (data) {
  return { item: data };
});

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
  return items.value
    .filter((item) => {
      const status = filters.value.status;
      return status !== "" ? item.is_done == status : item;
    })
    .filter((item) => {
      return productStore.products
        .filter((product) => {
          const searchCondition =
            `${product.id} ${product.name} ${product.quantity_in_stock} ${product.purchase_description}`.toLowerCase();

          return searchText.value
            ? searchCondition.includes(searchText.value.toLowerCase())
            : product;
        })
        .map((product) => product.id)
        .includes(item.product_id);
    });
});

/** ================================================
 * METHODS
 ** ================================================*/
const onSelectRow = (data) => {
  top.value = event.target.offsetTop;
  selectedId.value = data.id;
  showRowMenu.value = true;
  isItemChecked.value = data.is_done;
};

const onEditItem = async () => {
  Event.emit(`${EventEnum.PI_ITEM_EDIT}-${selectedId.value}`);
};

const onItemUpdate = async () => {
  Event.emit(`${EventEnum.PI_ITEM_UPDATE}-${selectedId.value}`);
};

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  if (route.params.id) {
    await physicalInventoryStore.fetchOne(route.params.id);
    physicalInventory.value = physicalInventoryStore.physicalInventory;
    items.value = physicalInventory.value.items;
  }

  await productStore.fetchAllProducts();

  Event.emit(EventEnum.IS_PAGE_LOADING, false);
});
</script>
