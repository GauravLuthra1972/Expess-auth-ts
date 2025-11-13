<template>
  <v-menu v-model="menu" :close-on-content-click="false" :offset-y="true" transition="scale-transition">
    <template #activator="{ props }">
      <v-text-field v-model="searchQuery" label="Search users" placeholder="Type username or email..." outlined dense
        hide-details v-bind="props" @input="searchUsers" style="width: 100%;" />
    </template>

    <div v-if="suggestedUsers.length" class="search-cards">
      <v-card v-for="user in suggestedUsers" :key="user.id" class="pa-3 mb-2 d-flex align-center"
        style="background-color:#2a2a2a; border-radius:12px; transition:0.2s; cursor:pointer;"
        @click="goToUserProfile(user.id)" @mouseover="hover = user.id" @mouseleave="hover = null"
        :elevation="hover === user.id ? 6 : 1">
        <v-avatar size="44" class="mr-3">
          <v-img :src="user.profile_pic || defaultPic"></v-img>
        </v-avatar>
        <div class="flex-grow-1">
          <div style="font-weight:600; font-size:15px;">{{ user.username || user.name }}</div>
          <div style="font-size:13px; color:#aaa;">{{ user.email }}</div>
        </div>
        <v-btn :color="user.isFollowing ? 'grey' : 'pink'" size="small" rounded variant="flat"
          style="text-transform:none;" @click.stop="toggleFollow(user)">
          {{ user.isFollowing ? 'Unfollow' : 'Follow' }}
        </v-btn>
      </v-card>
    </div>
  </v-menu>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../plugins/api'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"




const userStore = useUserStore()

const router = useRouter()
const searchQuery = ref('')
const suggestedUsers = ref([])
const menu = ref(false)
const hover = ref(null)
const defaultPic = 'https://cdn-icons-png.flaticon.com/512/847/847969.png'
const followingIds = ref([])


const fetchFollowing = async () => {
  try {
    const res = await api.get("/follow/getfollowing", {
      params: { userId: userStore.user.id }
    })
    followingIds.value = res.data.map(user => user.id)
  } catch {
    followingIds.value = []
  }
}

onMounted(() => {
  fetchFollowing()
})

const searchUsers = async () => {
  
  if (!searchQuery.value) {
    suggestedUsers.value = []
    menu.value = false
    return
  }
  try {
    const res = await api.get("/users/search", {
      params: { query: searchQuery.value }
    })
    const users = res.data.users || res.data || []
    suggestedUsers.value = users.slice(0, 4).map(user => ({
      ...user,
      isFollowing: followingIds.value.includes(user.id)
    }))
    console.log(suggestedUsers.value)
    menu.value = suggestedUsers.value.length > 0
  } catch {
    suggestedUsers.value = []
    menu.value = false
  }
}

const goToUserProfile = (userId) => {
  router.push(`/user/${userId}`)
  suggestedUsers.value = []
  menu.value = false
}

const toggleFollow = async (user) => {
  try {
    if (!user.isFollowing) {

      alert("Follow caalled")
      console.log(userStore.user.id)
      console.log(user.id)
      const res = await api.post("/follow/follow", null, {
        params: { followerId: userStore.user.id, followingId: user.id }
      })
      console.log(res)
      user.isFollowing = true
      followingIds.value.push(user.id)
      Toastify({
        text: `You are now following ${user.username}`,
        duration: 3000, 
        gravity: "top", 
        position: "right", 
        backgroundColor: "#4CAF50", 
      }).showToast()

      await userStore.fetchUser()
    } else {
      alert("unfollow called")
      await api.post("/follow/unfollow", null, {
        params: { followerId: userStore.user.id, followingId: user.id }
      })
      user.isFollowing = false
      followingIds.value = followingIds.value.filter(id => id !== user.id)
      Toastify({
        text: `You unfollowed ${user.username}`,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#4CAF50", 
      }).showToast()

      await userStore.fetchUser()
    }
  } catch {
    alert('Action failed. Please try again.')
  }
}
</script>

<style scoped>
.search-cards {
  max-height: 400px;
  overflow-y: auto;
  padding: 8px;
  background-color: #1e1e1e;
  border-radius: 12px;
}

.search-cards::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}
</style>
