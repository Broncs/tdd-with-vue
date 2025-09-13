<template>
  <h1>Sign Up</h1>
  <div>
    <label for="username">Username</label>
    <input v-model="username" id="username" />
  </div>
  <div>
    <label for="email">E-mail</label>
    <input v-model="email" id="email" />
  </div>
  <div>
    <label for="password">Password</label>
    <input v-model="password" id="password" type="password" />
  </div>
  <div>
    <label for="password-repeat">Password Repeat</label>
    <input v-model="passwordRepeat" id="password-repeat" type="password" />
  </div>
  <button @click="onSubmitForm" :disabled="!isPasswordTheSame">Sign Up</button>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
const username = ref('')
const email = ref('')
const password = ref('')
const passwordRepeat = ref('')

const isPasswordTheSame = computed(() => {
  if (!password.value || !passwordRepeat.value) return false
  return password.value === passwordRepeat.value
})

const onSubmitForm = () => {
  console.log('a')

  if (!username.value || !email.value || !password.value) return
  axios.post('/api/v1/users', {
    username: username.value,
    email: email.value,
    password: password.value,
  })
}
</script>
