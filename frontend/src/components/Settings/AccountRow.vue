<template>
  <div class="grid grid-cols-9 gap-3">
    <div class="col-span-1 flex gap-3 items-center">
      <input type="checkbox" class="input" />
      <p class="table-header">{{ props.account.id }}</p>
    </div>
    <p class="col-span-3 text-sm">{{ props.account.name }}</p>
    <p class="col-span-2 text-sm">{{ props.account.type }}</p>
    <p class="col-span-2 text-sm">{{ props.account.createdAt }}</p>
    <p class="col-span-1 text-sm">Some image</p>
  </div>
</template>

<script setup>
const props = defineProps({
	account: {
		type: Object,
		default: () => ({})
	}
});
</script>
