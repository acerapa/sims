<template>
	<div class="bg-white shadow h-15 pl-5 flex items-center">
		<p class="text-xl font-bold">{{ appStore.currentNav.text }}</p>
	</div>
</template>

<script setup>
import { useAppStore } from '@/stores/app';
const appStore = useAppStore();
</script>
