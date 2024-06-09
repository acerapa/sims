<template>
	<ModalWrapper title="New Account" @submit="onSubmit" v-model="showModal">
		<div class="flex gap-3 my-7">
			<input type="text" class="input flex-1" placeholder="Name">
			<select name="" id="" class="input flex-1">
				<option value="">Select Account Type</option>
			</select>
		</div>
	</ModalWrapper>
</template>

<script setup>
import { Method, authenticatedApi } from '@/api';
import ModalWrapper from '@/components/wrappers/ModalWrapper.vue';
import { useSettingsStore } from '@/stores/settings';
import { ref } from 'vue';

const settingsStore = useSettingsStore();
const model = ref({
	name: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	}
});

const props = defineProps({
	isEdit: {
		type: String,
		default: true
	},
	selectedId: {
		type: Number,
	}
});

const showModal = defineModel();

const apiPath = props.isEdit ? 'settings/accounts/update' : 'settings/accounts/register';

const onSubmit = async () => {
	const res = await authenticatedApi(apiPath, Method.POST, model.value);
	showModal.value = false;

	await settingsStore.fetchAllAccounts();
}
</script>