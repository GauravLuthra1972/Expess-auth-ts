<template>
  <v-container class="d-flex align-center justify-center h-100">
    <v-card class="bg-black" style="width: 100%; max-width: 500px;">
      <v-form>
        <div class="text-center mb-4">
          <h1 class="text-white">{{ !flag ? 'Login' : 'Signup' }}</h1>
        </div>

        <div class="d-flex" style="gap: 10px;" v-if="flag">
          <v-text-field label="Name" v-model="name"></v-text-field>
          <v-text-field label="Email" v-model="email"></v-text-field>
        </div>

        <v-text-field label="Username" v-model="username"></v-text-field>
        <v-text-field label="Password" v-model="password"></v-text-field>

        <div v-if="flag">
          <v-text-field label="Confirm Password" v-model="confirmPassword"></v-text-field>
        </div>

        <div class="d-flex align-center flex-column" style="gap: 10px;">
          <v-btn
            variant="flat"
            @click="!flag ? login() : register()"
            width="80%"
            color="primary"
            rounded
          >
            {{ !flag ? 'Login' : 'Signup' }}
          </v-btn>
          <p style="cursor: pointer;" @click="toggle">
            {{ !flag ? 'New to Site? Register now' : 'Already have an account? Login' }}
          </p>
        </div>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/userStore'

export default {
  setup() {
    const store = useUserStore()

    const username = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const name = ref('')
    const email = ref('')

    const flag = computed(() => store.flag)

    const toggle = () => store.toggleFlag()

    const login = () => {
      store.login(username.value, password.value)
    }

    const register = () => {
      if (password.value !== confirmPassword.value) {
        alert('Passwords do not match!')
        return
      }
      store.register(username.value, password.value, name.value, email.value)
 
    }

    return { username, password, confirmPassword, name, email, flag, toggle, login, register }
  }
}
</script>
