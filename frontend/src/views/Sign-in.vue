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
          class="text-red-500 absolute -bottom-5 w-full text-center"
          v-if="responseError"
          >{{ responseError }}</small
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
            () => {
              errors.username = ''
              errors.password = ''
              responseError = ''
            }
          "
          v-model="credentials.username"
          :error="errors.username"
          :error-has-text="true"
        />
        <CustomInput
          type="password"
          placeholder="Password"
          :has-label="true"
          label="Password"
          name="password"
          @focus="
            () => {
              errors.username = ''
              errors.password = ''
              responseError = ''
            }
          "
          v-model="credentials.password"
          :error="errors.password"
          :error-has-text="true"
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
import { AuthSchema } from 'shared'
import CustomInput from '@/components/shared/CustomInput.vue'
import { useValidation } from '@/composables/useValidation'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()

const credentials = ref({
  username: '',
  password: ''
})

const responseError = ref('')

// composables
const { errors, hasErrors, validateData } = useValidation(
  AuthSchema,
  credentials.value
)
const { signIn } = useAuth()

const onSubmit = async () => {
  // validate
  validateData()
  if (hasErrors.value) return

  Event.emit(EventEnum.IS_PAGE_LOADING, true)
  const res = await signIn(credentials.value)
  if (res.status == 200) {
    router.push({ name: 'dashboard' })
  } else {
    responseError.value = res.message
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
