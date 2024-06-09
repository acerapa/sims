<template>
  <div>
    <AccountModal
      v-model="showModal"
      :is-edit="isEdit"
      :selected-id="idToEdit"
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
    <div class="table-wrapper">
      <div class="flex justify-between items-center">
        <input
          type="search"
          class="input w-full max-w-72"
          placeholder="Search"
        />
        <button
          class="bg-primary p-2 rounded"
          @click="
            showModal = true;
            isEdit = false;
          "
        >
          <img src="@/assets/icons/plus.svg" alt="Plus" />
        </button>
      </div>
      <hr class="bg-gray-50 -mx-4" />
      <div class="flex flex-col gap-7 overflow-x-auto pb-5">
        <!-- table heades -->
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

        <!-- Datas -->
        <div class="flex flex-col gap-4">
          <AccountRow
            v-for="(account, ndx) in settingsStore.accounts"
            :key="ndx"
            :account="account"
            @open-menu="onSelectRow"
            :current-open-menu="selectedMenuRow"
            @view="onViewRow"
            @delete="onDeleteRow"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from "@/stores/settings";
import { ref, onMounted } from "vue";
import AccountModal from "@/components/Settings/AccountModal.vue";
import AccountRow from "@/components/Settings/AccountRow.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";

const settingsStore = useSettingsStore();
const showModal = ref(false);
const isEdit = ref(false);
const idToEdit = ref();
const toDelete = ref();
const selectedMenuRow = ref(-1);
const showDeleteConfirmationModal = ref(false);

onMounted(async () => {
  await settingsStore.fetchAllAccounts();
});

const onSelectRow = (data) => {
  selectedMenuRow.value = data;
};

const onViewRow = (account_id) => {
  isEdit.value = true;
  showModal.value = true;
  idToEdit.value = account_id;
};

const onDeleteRow = (id) => {
  toDelete.value = { id };
  showDeleteConfirmationModal.value = true;
};
</script>
