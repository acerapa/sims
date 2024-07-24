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
      v-if="accounts.length /* temporary for now need to add loaders */"
      :has-filter="true"
      :has-add-btn="true"
      :has-pagination="true"
      v-model:show-modal="showModal"
      v-model:is-edit="isEdit"
      :table-header-component="AccountTableHeader"
      :table-row-component="AccountRow"
      :data="accounts"
      :row-prop-init="accountRowEvent"
      @open-menu="onSelectRow"
    >
      <RowMenu
        :top="top"
        class="right-15"
        v-if="showRowMenu"
        @view="onViewRow"
        @delete="onDeleteRow"
      />
    </CustomTable>
  </div>
</template>

<script setup>
import { useSettingsStore } from "@/stores/settings";
import { ref, onMounted } from "vue";
import AccountModal from "@/components/Settings/AccountModal.vue";
import AccountRow from "@/components/Settings/AccountRow.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";
import CustomTable from "@/components/shared/CustomTable.vue";
import RowMenu from "@/components/shared/RowMenu.vue";
import AccountTableHeader from "@/components/Settings/AccountTableHeader.vue";
import Event from "@/event";

const top = ref(0);
const toDelete = ref();
const accounts = ref([]);
const selectedId = ref(0);
const isEdit = ref(false);
const showModal = ref(false);
const showRowMenu = ref(false);
const showDeleteConfirmationModal = ref(false);

const settingsStore = useSettingsStore();

// custom event
Event.on("global-click", function () {
  showRowMenu.value = false;
});

// define account row props
const accountRowEvent = "account-row-init-props";
Event.on(accountRowEvent, function (data) {
  // initize the value of props here
  return { account: data };
});

onMounted(async () => {
  accounts.value = await settingsStore.fetchAllAccounts();
});

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
</script>
