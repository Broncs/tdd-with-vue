<template>
  <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
    <form class="card" @submit.prevent="onSubmitForm" action="">
      <div class="card-header text-center">
        <h1>Sign Up</h1>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label" for="username">Username</label>
          <input class="form-control" v-model="formData.username" id="username" />
        </div>
        <div class="mb-3">
          <label class="form-label" for="email">E-mail</label>
          <input class="form-control" v-model="formData.email" id="email" />
        </div>
        <div class="mb-3">
          <label class="form-label" for="password">Password</label>
          <input class="form-control" v-model="formData.password" id="password" type="password" />
        </div>
        <div class="mb-3">
          <label class="form-label" for="password-repeat">Password Repeat</label>
          <input
            class="form-control"
            v-model="formData.passwordRepeat"
            id="password-repeat"
            type="password"
          />
        </div>
        <div class="text-center">
          <button class="btn btn-primary" :disabled="!isPasswordTheSame || apiProgress">
            <span v-if="apiProgress" class="spinner-border spinner-border-sm" role="status"></span>
            Sign Up
          </button>
        </div>
      </div>
    </form>
    <template v-if="APIresponse.data && APIresponse.data.message">
      <div
        class="alert alert-success"
        :class="{ 'alert-success': (APIresponse.statusText = 'OK') }"
        data-testid="response-message"
        role="alert"
      >
        {{ APIresponse.data.message }}
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import axios from 'axios'

const formData = reactive({
  username: '',
  email: '',
  password: '',
  passwordRepeat: '',
})
const APIresponse = ref({})
const apiProgress = ref(false)
const isPasswordTheSame = computed(() => {
  if (!formData.password || !formData.passwordRepeat) return false
  return formData.password === formData.passwordRepeat
})

const onSubmitForm = async () => {
  apiProgress.value = true
  const { passwordRepeat, ...payload } = formData
  if (!formData.username || !formData.email || !formData.password) return

  try {
    const response = await axios.post('/api/v1/users', payload)
    if (response.statusText == 'OK') {
      APIresponse.value = response
    }
  } catch (error) {
    console.log(error)
  }

  // fetch('/api/v1/users', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(payload),
  // })
}
</script>

<style scoped>
h1 {
  color: black;
}
</style>
