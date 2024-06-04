<template>
  <div
    class="bg-white rounded-lg absolute -right-2 top-0 flex flex-col shadow-md z-30"
    v-if="showActionMenu"
  >
    <button
      class="border-b last:border-none px-3 py-1 hover:bg-blue-100 rounded-t-lg"
    >
      View
    </button>
    <button
      class="border-b last:border-none px-3 py-1 hover:bg-blue-100 rounded-b-lg"
    >
      Delete
    </button>
  </div>
</template>
<script setup>
const showActionMenu = defineModel(false);
</script>
