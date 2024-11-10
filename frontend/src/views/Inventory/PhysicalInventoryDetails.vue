<template>
  <div class="flex flex-col gap-3" v-if="physicalInventory">
    <div class="cont flex flex-col gap-3" v-if="physicalInventory">
      <div class="flex justify-between">
        <div>
          <p>
            <strong>Physical Inventory date:</strong>
            {{
              DateHelpers.formatDate(
                physicalInventory.date_started,
                'MM/DD/YYYY',
              )
            }}
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
      :is-nested="true"
      :has-filter="true"
      :has-add-btn="false"
      :data="filteredData"
      :has-check-box="false"
      :has-pagination="false"
      class="[&>.table-wrapper]:sticky [&>.table-wrapper]:top-[84px] [&>.table-wrapper]:z-10 [&>.table-wrapper]:py-0"
      v-model:search-text="searchText"
      :row-prop-init="physicalItemInitRow"
      :table-row-component="PhysicalInventoryItemRow"
      :table-header-component="PhysicalInventoryItemHeader"
      @open-menu="onSelectRow"
    >
      <template v-slot:buttons>
        <button
          v-if="physicalInventory.status != PhysicalInventoryStatus.DONE"
          class="btn-outline"
          @click="onContinueLater"
        >
          Continue Later
        </button>
        <button
          class="btn !bg-success"
          @click="onSubmit"
          v-if="physicalInventory.status != PhysicalInventoryStatus.DONE"
        >
          Submit
        </button>
        <button
          class="btn-outline"
          @click="onContinueLater"
          v-if="physicalInventory.status == PhysicalInventoryStatus.DONE"
        >
          Back
        </button>
      </template>
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
      <template v-slot:tables>
        <div class="flex flex-col gap-3 relative z-0" v-if="physicalInventory">
          <CustomTable
            v-for="(items, ndx) in physicalInventory.grouped_items"
            :key="ndx"
            :data="items"
            :has-tools="false"
            :has-add-btn="false"
            :has-filter="true"
            :has-check-box="false"
            :row-prop-init="physicalItemInitRow"
            :table-row-component="PhysicalInventoryItemRow"
            :title="settingStore.getProductCategoryByIdSync(ndx).name"
          ></CustomTable>
        </div>
      </template>
    </CustomTable>
  </div>
</template>

<script setup>
import PhysicalInventoryItemHeader from '@/components/Inventory/PhysicalInventory/PhysicalInventoryItemHeader.vue';
import PhysicalInventoryItemRow from '@/components/Inventory/PhysicalInventory/PhysicalInventoryItemRow.vue';
import BadgeComponent from '@/components/shared/BadgeComponent.vue';
import CustomInput from '@/components/shared/CustomInput.vue';
import CustomTable from '@/components/shared/CustomTable.vue';
import { EventEnum } from '@/data/event';
import Event from '@/event';
import { usePhysicalInventoryStore } from '@/stores/physical-inventory';
import { useProductStore } from '@/stores/product';
import { useSettingsStore } from '@/stores/settings';
import { PhysicalInventoryStatus } from 'shared/enums';
import { DateHelpers } from 'shared/helpers';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const top = ref(0);
const items = ref([]);
const route = useRoute();
const selectedId = ref();
const searchText = ref('');
const router = useRouter();
const showRowMenu = ref(false);
const physicalInventory = ref();
const isItemChecked = ref(false);
const productStore = useProductStore();
const settingStore = useSettingsStore();
const physicalInventoryStore = usePhysicalInventoryStore();

const PhysicalInventoryStatusMap = {
  [PhysicalInventoryStatus.DRAFT]: {
    text: 'Draft',
    class: 'draft',
  },
  [PhysicalInventoryStatus.DONE]: {
    text: 'Done',
    class: 'done',
  },
};

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true);

Event.on(EventEnum.GLOBAL_CLICK, function () {
  showRowMenu.value = false;
});

const physicalItemInitRow = 'physical-item-init-row';
Event.on(physicalItemInitRow, function (data) {
  return { item: data };
});

/** ================================================
 * COMPUTED
 ** ================================================*/
const filteredData = computed(() => {
  return items.value.filter((item) => {
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

const onSubmit = async () => {
  const res = await physicalInventoryStore.update(physicalInventory.value.id, {
    physical_inventory: {
      status: PhysicalInventoryStatus.DONE,
    },
  });

  if (res.status == 200) {
    router.push({
      name: 'physical-inventory',
    });
  }
};

const onContinueLater = () => {
  router.push({
    name: 'physical-inventory',
  });
};

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await productStore.fetchAllProducts();
  await settingStore.fetchAllProductCategories();

  if (route.params.id) {
    physicalInventory.value = await physicalInventoryStore.getGroupedItems(
      route.params.id,
    );
    items.value = physicalInventory.value.items;
  }

  Event.emit(EventEnum.IS_PAGE_LOADING, false);
});
</script>
