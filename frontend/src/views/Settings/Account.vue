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
      :has-add-btn="true"
      :has-pagination="true"
      v-model:show-modal="showModal"
      v-model:is-edit="isEdit"
    >
      <template v-slot:table_header>
        <div class="grid grid-cols-9 gap-3">
          <div class="col-span-1 flex gap-3 items-center">
            <input type="checkbox" class="input" />
            <p class="table-header">#</p>
          </div>
          <p class="col-span-3 table-header">Account Name</p>
          <p class="col-span-2 table-header">Type</p>
          <p class="col-span-2 table-header">Date Added</p>
          <p class="col-span-1 table-header">Action</p>
        </div>
      </template>
      <template v-slot:table_body>
        <div class="flex flex-col gap-4">
          <AccountRow
            v-for="(account, ndx) in settingsStore.accounts"
            :key="ndx"
            :account="account"
            @open-menu="onSelectRow"
          />
        </div>
      </template>
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
import Event from "@/event";

const top = ref(0);
const toDelete = ref();
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

onMounted(async () => {
  await settingsStore.fetchAllAccounts();
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

const onDeleteRow = (id) => {
  toDelete.value = { id: selectedId.value };
  showDeleteConfirmationModal.value = true;
};
</script>
