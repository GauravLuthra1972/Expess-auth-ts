import { defineStore } from 'pinia'
import api from '../plugins/api'
import router from '../routes/router'
import Swal from 'sweetalert2'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    flag:false,
    isRemember:false
  }),

  actions: {
    setTokens(accessToken, refreshToken) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
    },

    toggleremember(){
      this.isRemember=!this.isRemember

    }
    ,
    async fetchUser() {
      console.log("fetchhhiiiiimmmmmmg")
      try {
        const { data } = await api.get('/users/userinfo')
        console.log(data.info)
        this.user = data.info
        console.log(this.user)

      } catch (error) {
        console.error('Error fetching user info:', error)
      }
    },

    async login(username, password) {
      try {
        const { data } = await api.post('/auth/login', { username, password })
        console.log(data)
        if (data.accesstoken && data.refreshtoken) {
          this.accessToken = data.accesstoken
          this.refreshToken = data.refreshtoken
          await this.fetchUser()
          alert('User Logged in')
          router.push('/posts')
        } else {
          Swal.fire('Error', data.message || 'Login failed', 'error')

          if(data.message=='User is not registered'){
          this.toggleFlag()

        }
          
        }
      } catch (error) {
        Swal.fire('Error', error.response?.data?.message || 'Login failed', 'error')

        
        
        
      }
    },

    async register(username, password, name, email) {
      try {
        const { data } = await api.post('/auth/register', { username, password, name, email })
        console.log(data)
        if (data.accesstoken && data.refreshtoken) {
          this.accessToken = data.accesstoken
          this.refreshToken = data.refreshtoken
          alert('User Registered')
          await this.fetchUser()
          alert('User Registered')
          router.push('/posts')
        } else {
          Swal.fire('Error', data.message || 'Registration failed', 'error')
          this.toggleFlag()
        }
      } catch (error) {
        Swal.fire('Error', error.response?.data?.message || 'Registration failed', 'error')
      }
    },

    async updateUser(updates) {
      
      try {
        await api.put('/users/update', updates)
        this.user = { ...this.user, ...updates }
        alert('Changes Saved')
      } catch {
        alert('Error saving changes')
      }
    },

    async deleteUser() {
      try {
        await api.delete('/users/delete')
        alert('User Deleted')
        this.logout()
      } catch {
        alert('Error Occurred')
      }
    },

    async uploadProfile(file) {
      try {
        const formData = new FormData()
        formData.append('image', file)
        formData.append('id', this.user.id)
        const res = await fetch('http://localhost:8080/users/profile', {
          method: 'POST',
          body: formData
        })
        const data = await res.json()
        if (data.file) this.user.profile_pic = data.file
        alert('Upload successful!')
      } catch {
        alert('Error uploading file')
      }
    },

    toggleFlag(){
      this.flag=!this.flag

    },

    logout() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      router.push('/')
    }
  },
  persist: true
})