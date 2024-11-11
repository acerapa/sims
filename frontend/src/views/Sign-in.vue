<template>
  <div
    class="fixed bg-gray-400 top-0 left-0 w-full h-full flex items-center justify-center"
  >
    <div
      class="bg-white max-w-screen-md min-w-[320px] rounded-md shadow-sm px-5 py-4"
    >
      <div class="logo"></div>
      <div class="relative">
        <p class="text-xl text-gray-900 text-center mt-5">Login</p>
        <small
          class="text-red-500 absolute -bottom-4 w-full text-center"
          v-if="credentialErrors.responseErr"
          >{{ credentialErrors.responseErr }}</small
        >
      </div>
      <form class="flex flex-col gap-4 mt-6" @submit.prevent="onSubmit">
        <CustomInput
          type="text"
          placeholder="Username"
          :has-label="true"
          label="Username"
          name="username"
          @focus="
            credentialErrors.username = ''
            credentialErrors.password = ''
            credentialErrors.responseErr = ''
          "
          v-model="credentials.username"
          :error="credentialErrors.username"
        />
        <CustomInput
          type="password"
          placeholder="Password"
          :has-label="true"
          label="Password"
          name="password"
          @focus="
            credentialErrors.username = ''
            credentialErrors.password = ''
            credentialErrors.responseErr = ''
          "
          v-model="credentials.password"
          :error="credentialErrors.password"
        />
        <button
          class="text-white bg-gray-600 max-w-fit mt-4 px-5 py-2 rounded mx-auto text-sm"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Event from '@/event'
import { useRouter } from 'vue-router'
import { EventEnum } from '@/data/event'
import { useAuthStore } from '@/stores/auth'
import { AuthSchema } from 'shared/validators/auth'
import CustomInput from '@/components/shared/CustomInput.vue'

const router = useRouter()

const authStore = useAuthStore()

const credentials = ref({
  username: '',
  password: ''
})

const credentialErrors = ref({
  username: '',
  password: '',
  responseErr: ''
})

const onSubmit = async () => {
  // validate
  const { error } = AuthSchema.validate(credentials.value, {
    abortEarly: false
  })

  if (error) {
    // process error details
    error.details.forEach((detail) => {
      // capture the text inside the `""`
      const regex = /"(.*?)"/
      const key = detail.message.match(regex)[0].replaceAll(`"`, '')

      credentialErrors.value[key] = detail.message
    })
    return
  }

  Event.emit(EventEnum.IS_PAGE_LOADING, true)
  const res = await authStore.authenticate(credentials.value)
  if (res.status == 200 && res.data) {
    router.push({ name: 'dashboard' })
  } else {
    credentialErrors.value.responseErr = res.message
    credentialErrors.value.username = ' '
    credentialErrors.value.password = ' '
  }
  Event.emit(EventEnum.IS_PAGE_LOADING, false)
}
</script>

<style scoped>
.logo {
  background-size: cover;
  background-image: url('@/assets/logo-icon.png');
  @apply w-24 h-24 rounded-full mx-auto -mt-16 border-white border text-white flex items-center justify-center;
}
</style>
