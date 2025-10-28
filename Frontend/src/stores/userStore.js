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

    getcurr(){
      console.log(this.user)
      console.log(this.accessToken)
      console.log(this.refreshToken)

    },

    async login(username, password) {
      try {
        const { data } = await api.post('/login', { username, password })
        console.log(data)

        if (data.accesstoken && data.refreshtoken) {
          this.user = { id: '', username, name: '', email: '' } 
          this.accessToken = data.accesstoken
          this.refreshToken = data.refreshtoken
          alert("User Logged in")
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
        console.log(data)

        if(data.accesstoken && data.refreshtoken) {
          this.user = { id: '', username, name, email }
          this.accessToken = data.accesstoken
          this.refreshToken = data.refreshtoken
          alert("User Registered")
          router.push('/users')
          this.getcurr()
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
      router.push('/')
    }
  },
  persist:true
})
