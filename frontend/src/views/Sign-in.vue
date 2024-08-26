<template>
  <div
    class="fixed bg-gray-400 top-0 left-0 w-full h-full flex items-center justify-center"
  >
    <div
      class="bg-white max-w-screen-md min-w-[320px] rounded-md shadow-sm px-5 py-4"
    >
      <div class="logo"></div>
      <p class="text-xl text-gray-900 text-center mt-5">Login</p>
      <form class="flex flex-col gap-4 mt-3" @submit.prevent="onSubmit">
        <input
          type="text"
          v-model="credentials.username"
          class="input"
          placeholder="Username"
          name="username"
          id="username"
        />
        <input
          type="password"
          v-model="credentials.password"
          class="input"
          placeholder="Password"
          name="password"
          id="password"
        />
        <button
          class="text-white bg-gray-600 max-w-fit px-5 py-2 rounded mx-auto text-sm"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";
import Event from "@/event";
import { EventEnum } from "@/data/event";

const router = useRouter();

const authStore = useAuthStore();

const credentials = ref({
  username: "",
  password: "",
});

const onSubmit = async () => {
  Event.emit(EventEnum.IS_PAGE_LOADING, true);
  const res = await authStore.authenticate(credentials.value);
  if (res.status == 200 && res.data) {
    Event.emit(EventEnum.IS_PAGE_LOADING, false);
    router.push({ name: "dashboard" });
  }
};
</script>

<style scoped>
.logo {
  background-size: cover;
  background-image: url("../assets/logo-icon.png");
  @apply w-24 h-24 rounded-full mx-auto -mt-16 border-white border text-white flex items-center justify-center;
}
</style>
