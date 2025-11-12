<template>
  <v-container class="d-flex align-center justify-center h-100">
    <v-card class="bg-black" style="width: 100%; max-width: 500px;">
      <v-form>
        <div class="text-center mb-4">
          <h1 class="text-white">
            {{ !flag && !twofaRequired ? 'Login' : flag ? 'Signup' : 'Two-Factor Authentication' }}
          </h1>
        </div>

        <div v-if="flag">

          <div class="d-flex ga-4"> 
            <v-text-field label="Name" v-model="name"></v-text-field>
            <v-text-field label="Email" v-model="email"></v-text-field>

          </div>

          <v-text-field label="Username" v-model="username"></v-text-field>
          <v-text-field label="Password" v-model="password"></v-text-field>
          <v-text-field label="Confirm Password" v-model="confirmPassword"></v-text-field>
            <v-checkbox v-model="store.isRemember" label="Remember Me" class="ma-0" @click="toggleremember"></v-checkbox>
        </div>

        <div v-if="!flag && !twofaRequired">
          <v-text-field label="Username" v-model="username"></v-text-field>
          <v-text-field label="Password" v-model="password"></v-text-field>
          <v-checkbox v-model="store.isRemember" label="Remember Me" class="ma-0" @click="toggleremember"></v-checkbox>
        </div>

        <div v-if="twofaRequired">
          <p class="text-white">Enter your 6-digit code from your Authenticator app</p>
          <v-text-field v-model="twofaCode" label="Enter code from app" maxlength="6"></v-text-field>

          <div class="d-flex" style="gap: 10px; margin-top: 10px;">
            <v-btn color="secondary" @click="backToLogin">
              Back
            </v-btn>
            <v-btn color="primary" @click="verifyTwoFA">
              Verify
            </v-btn>
          </div>
        </div>

        <div class="d-flex align-center flex-column" style="gap: 10px;" v-if="!twofaRequired">
          <v-btn variant="flat" @click="!flag ? login(username, password) : register()" width="80%" color="primary"
            rounded>
            {{ !flag ? 'Login' : 'Signup' }}
          </v-btn>

          <p style="cursor: pointer;" @click="toggleFlag">
            {{ !flag ? 'New to Site? Register now' : 'Already have an account? Login' }}
          </p>
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/userStore'
import api from '../plugins/api'
import Swal from 'sweetalert2'
import router from '../routes/router'

const store = useUserStore()

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const name = ref('')
const email = ref('')
const tempUserId = ref('')

const twofaRequired = ref(false)
const twofaCode = ref('')

const flag = computed(() => store.flag)

function toggleFlag() {
  store.toggleFlag()
}

function toggleremember() {
  store.toggleremember()
}

function register() {
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match!')
    return
  }
  store.register(username.value, password.value, name.value, email.value)
}

async function login(username, password) {
  try {
    const { data } = await api.post('/auth/login', { username, password })

    if (data.accesstoken && data.refreshtoken) {
      store.accessToken = data.accesstoken
      store.refreshToken = data.refreshtoken
      await store.fetchUser()
      alert('User Logged in')
      router.push('/posts')
      return
    } else if (data.twofaRequired) {
    
      twofaRequired.value = true
      tempUserId.value = data.userId
    } else {
      Swal.fire('Error', data.message || 'Login failed', 'error')
      if (data.message == 'User is not registered') {
        toggleFlag()
      }
    }
  } catch (error) {
    Swal.fire('Error', error.response?.data?.message || 'Login failed', 'error')
  }
}

function backToLogin() {
  twofaRequired.value = false
  twofaCode.value = ''
  password.value = ''
}

async function verifyTwoFA() {
  try {
    const res = await api.post('/auth/twofacverify', {
      userId: tempUserId.value,
      code: twofaCode.value,
      login:true
    });
    console.log(res)

    if (res.data.success) {
      twofaRequired.value = false
      twofaCode.value = ''

     

      console.log("storetoken")
      console.log(store.accessToken)
      console.log(store.refreshToken)
      store.accessToken = res.data.accesstoken
      store.refreshToken =res. data.refreshtoken
      await store.fetchUser()
       alert(res.data.message)
    
     
      router.push('/posts')
      return
    } else {
      alert(res.data.message || 'Invalid code, please try again.')
    }
  } catch (error) {
    const msg = error.response?.data?.message || error.response?.data?.error || 'Something went wrong. Try again.'
    alert(msg)
  }
}
</script>
