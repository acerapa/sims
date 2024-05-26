<template>
    <div class="fixed bg-gray-400 top-0 left-0 w-full h-full flex items-center justify-center">
        <div class="bg-white max-w-screen-md min-w-[320px] rounded-md shadow-sm px-5 py-4">
            <div class="w-24 h-24 rounded-full bg-orange-400 mx-auto -mt-16 border-white border text-white flex items-center justify-center">Logo</div>
            <p class="text-xl text-gray-900 text-center mt-5">Login</p>
            <div class="flex flex-col gap-4 mt-3">
                <input type="text" v-model="credentials.username" class="input" placeholder="Username" name="username" id="username">
                <input type="password" v-model="credentials.password" class="input" placeholder="Password" name="password" id="password">
                <button class="text-white bg-gray-600 max-w-fit px-5 py-2 rounded mx-auto text-sm" @click="onSubmit">Login</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';

const router = useRouter();

const authStore = useAuthStore();

const credentials = ref({
    username: '',
    password: ''
});

const onSubmit = async () => {
    const res = await authStore.authenticate(credentials.value);
    console.log(res);
    if (res.status == 200 && res.data) {
        router.push({ name: 'dashboard' });
    }
}
</script>
