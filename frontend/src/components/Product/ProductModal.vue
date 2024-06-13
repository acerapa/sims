<template>
  <ModalWrapper :title="title" v-model="showModal" @submit="onSubmit">
		<div class="flex flex-col gap-6 my-7">
			<div class="flex flex-col gap-3 w-[calc(50%-6px)]">
				<p class="text-base font-semibold">Product Type</p>
				<select class="input">
					<option value="">Select type</option>
					<option value="inventory">Inventory</option>
					<option value="non-inventory">Non Inventory</option>
				</select>
			</div>
			<div class="flex flex-col gap-3">
				<p class="text-base font-semibold">Basic Info</p>
				<div class="flex flex-col gap-4">
					<div class="flex gap-3">
						<input type="text" class="input flex-1" placeholder="Name" />
						<input type="text" class="input flex-1" placeholder="Brand" />
					</div>
					<div class="flex gap-3">
						<select name="" id="" class="input flex-1">
							<option value="" hidden>Select Preferred Supplier</option>
						</select>
						<select name="" id="" class="input flex-1">
							<option value="" hidden>Category</option>
						</select>
					</div>
				</div>
			</div>
			<div class="flex flex-col gap-3">
				<p class="text-base font-semibold">Inventory and Sales info</p>
				<div class="flex flex-col gap-4">
					<div class="flex gap-3">
						<input type="number" class="input flex-1" placeholder="Purchase Price" />
						<input type="number" class="input flex-1" placeholder="Sale Price" />
					</div>
					<div class="flex gap-3">
						<select name="" id="" class="input flex-1">
							<option value="" hidden>Income Account</option>
						</select>
						<select name="" id="" class="input flex-1">
							<option value="" hidden>Expense Account</option>
						</select>
					</div>
					<div class="flex gap-3">
						<input type="number" class="input flex-1" placeholder="Quantity in stock" />
						<input type="number" class="input flex-1" placeholder="Item Code" disabled />
					</div>
				</div>
			</div>
		</div>
	</ModalWrapper>
</template>

<script setup>
import { Method, authenticatedApi } from "@/api";
import ModalWrapper from "@/components/wrappers/ModalWrapper.vue";
import { useProductStore } from "@/stores/product";
import { ref } from "vue";

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
});

const showModal = defineModel();

const model = ref({
	name: "",
	purchase_description: "",
	selling_description: "",
	purchase_price: 0.00,
	selling_price: 0.00,
	sku: "", // can be aliased as item code
	category: "",
	brand: "",
	quantityInStock: 0,
	imageUrl: "",
	status: ""
});

const title = ref(props.isEdit ? "Edit Product" : "New Product");
const apiPath = ref(props.isEdit ? "products/update" : "products/register");
const productStore = useProductStore();

const onSubmit = async () => {
	await authenticatedApi(apiPath.value, Method.POST, model.value);
	await productStore.fetchAllProducts();
	showModal.value = false;
}
</script>
