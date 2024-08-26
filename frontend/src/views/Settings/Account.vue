<template>
  <div>
    <AccountModal
      v-model="showModal"
      :is-edit="isEdit"
      :selected-id="selectedId"
      v-if="showModal"
    />
    <DeleteConfirmModal
      v-if="showDeleteConfirmationModal"
      v-model="showDeleteConfirmationModal"
      href="settings/accounts/delete"
      :data="toDelete"
      @after-delete="
        settingsStore.fetchAllAccounts();
        showDeleteConfirmationModal = false;
      "
    />
    <CustomTable
      :has-filter="true"
      :has-add-btn="true"
      :data="filteredData"
      :has-pagination="true"
      v-model:is-edit="isEdit"
      v-model:show-modal="showModal"
      :row-prop-init="accountRowEvent"
      v-model:search-text="searchText"
      :table-row-component="AccountRow"
      :table-header-component="AccountTableHeader"
      @open-menu="onSelectRow"
    >
      <RowMenu
        :top="top"
        class="right-15"
        v-if="showRowMenu"
        @view="onViewRow"
        @delete="onDeleteRow"
      />
      <template v-slot:filters>
        <CustomSelectInput
          placeholder="Account type"
          v-model="filter.type"
          :options="[
            {
              value: 'income',
              text: 'Income',
            },
            {
              value: 'expense',
              text: 'Expense',
            },
          ]"
        />
      </template>
    </CustomTable>
  </div>
</template>

<script setup>
import { useSettingsStore } from "@/stores/settings";
import { ref, onMounted, computed } from "vue";
import AccountModal from "@/components/Settings/AccountModal.vue";
import AccountRow from "@/components/Settings/AccountRow.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";
import CustomTable from "@/components/shared/CustomTable.vue";
import RowMenu from "@/components/shared/RowMenu.vue";
import AccountTableHeader from "@/components/Settings/AccountTableHeader.vue";
import CustomSelectInput from "@/components/shared/CustomSelectInput.vue";
import Event from "@/event";
import { EventEnum } from "@/data/event";

const top = ref(0);
const toDelete = ref();
const selectedId = ref(0);
const isEdit = ref(false);
const showModal = ref(false);
const showRowMenu = ref(false);
const showDeleteConfirmationModal = ref(false);

const settingsStore = useSettingsStore();

const filter = ref({
  type: "",
});

const searchText = ref();

/** ================================================
 * EVENTS
 ** ================================================*/

// Is page loading
Event.emit(EventEnum.IS_PAGE_LOADING, true);

// custom event
Event.on(EventEnum.GLOBAL_CLICK, function () {
  showRowMenu.value = false;
});

// define account row props
const accountRowEvent = "account-row-init-props";
Event.on(accountRowEvent, function (data) {
  // initize the value of props here
  return { account: data };
});

/** ================================================
 * COMPUTED
 ** ================================================*/

const filteredData = computed(() => {
  return settingsStore.accounts
    .filter((account) =>
      filter.value.type ? account.type == filter.value.type : account
    )
    .filter((account) => {
      const searchCondition =
        `${account.id} ${account.type} ${account.name}`.toLowerCase();
      return searchText.value
        ? searchCondition.includes(searchText.value.toLowerCase())
        : account;
    });
});

/** ================================================
 * METHODS
 ** ================================================*/

const onSelectRow = (id) => {
  selectedId.value = id;
  top.value = event.target.offsetTop;
  showRowMenu.value = true;
};

const onViewRow = () => {
  isEdit.value = true;
  showModal.value = true;
};

const onDeleteRow = () => {
  toDelete.value = { id: selectedId.value };
  showDeleteConfirmationModal.value = true;
};

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/

onMounted(async () => {
  await settingsStore.fetchAllAccounts();
  Event.emit(EventEnum.IS_PAGE_LOADING, false);
});
</script>
