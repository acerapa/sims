<template>
  <div
    class="bg-white rounded-lg absolute top-0 right-12 flex flex-col shadow-md z-30"
  >
    <button
      class="border-b last:border-none px-3 py-1 hover:bg-blue-100 rounded-t-lg"
      @click.stop="emit('view')"
    >
      View
    </button>
    <button
      class="border-b last:border-none px-3 py-1 hover:bg-blue-100 rounded-b-lg"
      @click.stop="emit('delete')"
    >
      Delete
    </button>
  </div>
</template>
<script setup>
const emit = defineEmits(["view", "delete"]);
</script>
