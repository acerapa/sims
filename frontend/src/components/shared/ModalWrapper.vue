<template>
  <div class="overlay"></div>
  <div
    class="fixed w-full max-h-[calc(100vh-80px)] max-w-[614px] rounded-xl top-10 left-1/2 -translate-x-1/2 p-4 z-40 bg-white"
  >
    <div class="flex justify-between items-center">
      <p class="font-semibold text-xl">{{ props.title }}</p>
      <img
        src="@/assets/icons/close.svg"
        alt="close"
        class="cursor-pointer"
        @click="showModal = false"
      />
    </div>
    <form :action="props.action">
      <div class="max-h-[calc(100vh-241.33px)] h-auto overflow-y-auto w-full">
        <slot></slot>
      </div>
    </form>
    <div class="flex gap-3 mt-10 mx-auto justify-center">
      <button
        class="btn-outline !border-danger !text-danger"
        @click="showModal = false"
      >
        Cancel
      </button>
      <button class="btn" @click="onSave">{{ props.saveBtn }}</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  action: String,
  saveBtn: {
    type: String,
    default: "Save",
  },
});

const showModal = defineModel();

const emit = defineEmits(["submit"]);

const onSave = () => {
  emit("submit");
};
</script>

<style scoped>
.overlay {
  @apply bg-black opacity-45 fixed top-0 left-0 w-screen h-screen z-40;
}
</style>
