import { defineStore } from 'pinia'
import api from '../plugins/api'
import router from '../routes/router'
import Swal from 'sweetalert2'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    flag: true,
  }),

  actions: {
    toggleFlag() {
      this.flag = !this.flag
    },

    async login(username, password) {
      try {
        const { data } = await api.post('/login', { username, password })

        if (data.accesstoken && data.refreshtoken) {
          this.user = { id: '', username, name: '', email: '' } 
          this.accessToken = data.accesstoken
          this.refreshToken = data.refreshtoken
          router.push('/users')
        } else {
          Swal.fire('Error', data.message || 'Login failed', 'error')
        }
      } catch (error) {
        Swal.fire('Error', error.response?.data?.message || 'Login failed', 'error')
      }
    },

    async register(username, password, name, email) {
      try {
        const { data } = await api.post('/register', { username, password, name, email })

        if (data.accesstoken && data.refreshtoken) {
          this.user = { id: '', username, name, email }
          this.accessToken = data.accesstoken
          this.refreshToken = data.refreshtoken
          router.push('/users')
        } else {
          Swal.fire('Error', data.message || 'Registration failed', 'error')
        }
      } catch (error) {
        Swal.fire('Error', error.response?.data?.message || 'Registration failed', 'error')
      }
    },

    logout() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      router.push('/login')
    }
  }
})
