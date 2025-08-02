<template>
	<div class="text-center">
		<!-- TODO: Later on Branch name should be coming from the active current branch -->
		<p class="font-bold text-lg">ORM BRANCH - RAM TECH VENTURES INC</p>
		<p class="font-bold text-lg">{{ props.name }}</p>
		<p class="text-base">{{props.sub_desctiption || "" }}</p>
	</div>
</template>

<script setup>
const props = defineProps({
	name: {
		type: String,
		required: true
	},
	sub_desctiption: {
		type: String,
		required: false
	}
})
</script>
