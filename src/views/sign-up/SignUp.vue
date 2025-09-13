<template>
  <form @submit.prevent="onSubmitForm" action="">
    <h1>Sign Up</h1>
    <div>
      <label for="username">Username</label>
      <input v-model="formData.username" id="username" />
    </div>
    <div>
      <label for="email">E-mail</label>
      <input v-model="formData.email" id="email" />
    </div>
    <div>
      <label for="password">Password</label>
      <input v-model="formData.password" id="password" type="password" />
    </div>
    <div>
      <label for="password-repeat">Password Repeat</label>
      <input v-model="formData.passwordRepeat" id="password-repeat" type="password" />
    </div>
    <button :disabled="!isPasswordTheSame">Sign Up</button>
  </form>
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

const isPasswordTheSame = computed(() => {
  if (!formData.password || !formData.passwordRepeat) return false
  return formData.password === formData.passwordRepeat
})

const onSubmitForm = () => {
  console.log('a')
  const { passwordRepeat, ...payload } = formData
  console.log(formData)

  if (!formData.username || !formData.email || !formData.password) return
  axios.post('/api/v1/users', payload)
  // fetch('/api/v1/users', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(payload),
  // })
}
</script>
