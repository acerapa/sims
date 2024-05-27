<template>
    <div>
        <h1>Hello World</h1>
    </div>
</template>

<script setup>
// testing api and getting refresh tokens
import { onMounted } from 'vue';
import { authenticatedApi } from '@/api'

onMounted(async() => {
    console.log(await authenticatedApi('auth/all'));
})
</script>