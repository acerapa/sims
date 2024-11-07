<template>
  <BranchModal
    v-model="showModal"
    v-if="showModal"
    :selected-id="selectedId"
    :is-edit="isEdit"
  />
  <DeleteConfirmModal
    v-model="showConfirmModal"
    v-if="showConfirmModal"
    :href="`branch/delete/${selectedId}`"
    @after-delete="onAfterDelete"
  />
  <div class="flex flex-col gap-4">
    <CustomTable
      class="relative"
      title="Branch List"
      :data="filterData"
      :has-pagination="true"
      :row-prop-init="rowPropInit"
      v-model:showModal="showModal"
      v-model:search-text="searchText"
      :table-row-component="BranchRow"
      :table-header-component="BranchHeader"
      @open-menu="onSelectRow"
    >
      <RowMenu
        :top="top"
        v-if="showRowMenu"
        @view="viewRow"
        @delete="deleteRow"
      >
        <button class="row-menu-item" @click="onSetCurrentBranch">
          Set as current
        </button>
      </RowMenu>
    </CustomTable>
  </div>
</template>

<script setup>
import BranchHeader from "@/components/Settings/BranchHeader.vue";
import BranchModal from "@/components/Settings/BranchModal.vue";
import BranchRow from "@/components/Settings/BranchRow.vue";
import CustomTable from "@/components/shared/CustomTable.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";
import RowMenu from "@/components/shared/RowMenu.vue";
import { EventEnum } from "@/data/event";
import Event from "@/event";
import { useSettingsStore } from "@/stores/settings";
import { computed, onMounted, ref } from "vue";

const top = ref(0);
const selectedId = ref(0);
const isEdit = ref(false);
const searchText = ref("");
const showModal = ref(false);
const showRowMenu = ref(false);
const showConfirmModal = ref(false);
const settingsStore = useSettingsStore();

/** ================================================
 * COMPUTED
 ** ================================================*/
const filterData = computed(() => {
  return settingsStore.branches.filter((branch) => {
    const searchCondition = `${branch.id} ${branch.name} ${branch.status} ${branch.address.address1} ${branch.address.address2} ${branch.address.city} ${branch.address.postal} ${branch.manager.first_name} ${branch.manager.last_name}`;

    return searchText.value
      ? searchCondition.toLowerCase().includes(searchText.value.toLowerCase())
      : branch;
  });
});

/** ================================================
 * EVENTS
 ** ================================================*/
Event.emit(EventEnum.IS_PAGE_LOADING, true);

Event.on(
  EventEnum.GLOBAL_CLICK,
  function () {
    showRowMenu.value = false;
  },
  true
);

const rowPropInit = "branch-init-rows";
Event.on(rowPropInit, function (data) {
  return { branch: data };
});

/** ================================================
 * METHODS
 ** ================================================*/
const onSelectRow = (id) => {
  selectedId.value = id;
  top.value = event.target.offsetTop;
  showRowMenu.value = true;
};

const viewRow = () => {
  isEdit.value = true;
  showModal.value = true;
};

const deleteRow = () => {
  showConfirmModal.value = true;
};

const onAfterDelete = async () => {
  await settingsStore.fetchAllBranches();
};

const onSetCurrentBranch = async () => {
  // get the current branch
  const currentBranch = settingsStore.branches.find(
    (branch) => branch.is_current
  );

  if (currentBranch) {
    await settingsStore.updateBranch(currentBranch.id, {
      branch: { is_current: false },
    });
  }

  const toUpdateBranch = settingsStore.branches.find(
    (branch) => branch.id == selectedId.value
  );

  if (toUpdateBranch) {
    await settingsStore.updateBranch(toUpdateBranch.id, {
      branch: { is_current: true },
    });
  }

  await settingsStore.fetchAllBranches();
};

/** ================================================
 * LIFE CYCLE HOOKS
 ** ================================================*/
onMounted(async () => {
  await settingsStore.fetchAllBranches();

  Event.emit(EventEnum.IS_PAGE_LOADING, false);
});
</script>
