<template>
	<SideNav />
	<div class="flex">
		<div class="w-64">
		</div>
		<div class="flex-1">
			<Header />
			<div class="w-full px-5 mt-5">
				<RouterView />
			</div>
		</div>
	</div>
</template>

<script setup>
import Header from '@/components/Header.vue';
import SideNav from '@/components/SideNav.vue';
</script>