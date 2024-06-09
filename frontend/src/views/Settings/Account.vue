<template>
	<div>
    <AccountModal v-model="showModal" :is-edit="isEdit" v-if="showModal" />
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
          <AccountRow :account="{id: 1, name: 'Sample', type: 'income', createdAt: '02/03/2024'}" />
          <AccountRow :account="{id: 2, name: 'Sample', type: 'income', createdAt: '02/04/2024'}" />
        </div>
      </div>
		</div>
	</div>
</template>

<script setup>
import { useSettingsStore } from '@/stores/settings';
import { ref, onMounted } from 'vue';
import AccountModal from '@/components/Settings/AccountModal.vue';
import AccountRow from '@/components/Settings/AccountRow.vue';

const settingsStore = useSettingsStore();
const showModal = ref(false);
const isEdit = ref(false);

onMounted(async () => {
	await settingsStore.fetchAllAccounts();
});
</script>
