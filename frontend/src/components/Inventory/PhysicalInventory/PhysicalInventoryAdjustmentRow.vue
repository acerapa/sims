<template>
  <div class="grid grid-cols-6 gap-3 items-center">
    <p class="col-span-3 text-sm">{{ adjustedBy }}</p>
    <p class="col-span-2 text-sm">
    	{{
    		new Date(props.adjustment.date_recorded).toLocaleString('default', {
    			day: '2-digit',
    			month: 'short',
    			year: 'numeric'
    		})
    	}}
  	</p>
  	<RouterLink
  		class="btn-outline w-fit !py-1 !px-2 !text-xs"
  		:to="{
  			name: InventoryConst.PHYSICAL_INVENTORY_ADJUSTMENT_FORM,
  			params: {
  				physical_inventory_id: props.adjustment.physical_inventory_id
  			},
  			query: {
  				id: props.adjustment.id
  			}
  		}"
  	>
  		view
  	</RouterLink>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { InventoryConst } from '@/const/route.constants'

const props = defineProps({
	adjustment: {
		type: Object,
		default: () => ({})
	}
})

const adjustedBy = computed(() => {
	const { first_name, last_name } = props.adjustment.adjusted_by
	return `${first_name} ${last_name}`
})
</script>
