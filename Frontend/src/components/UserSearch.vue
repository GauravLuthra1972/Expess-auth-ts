<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :offset-y="true"
    max-width="400"
    min-width="300"
    transition="scale-transition"
  >
    <template #activator="{ props }">
      <v-text-field
        v-model="searchQuery"
        label="Search users"
        placeholder="Type username or email..."
        outlined
        dense
        hide-details
        v-bind="props"
        @input="searchUsers"
        style="width: 100%;"
      />
    </template>

    <div v-if="suggestedUsers.length" class="search-cards">
      <v-card
        v-for="user in suggestedUsers"
        :key="user.id"
        class="pa-3 mb-2 d-flex align-center"
        style="background-color:#2a2a2a; border-radius:12px; transition:0.2s; cursor:pointer;"
        @click="goToUserProfile(user.id)"
        @mouseover="hover = user.id"
        @mouseleave="hover = null"
        :elevation="hover === user.id ? 6 : 1"
      >
        <v-avatar size="44" class="mr-3">
          <v-img :src="user.profile_pic || defaultPic"></v-img>
        </v-avatar>
        <div class="flex-grow-1">
          <div style="font-weight:600; font-size:15px;">{{ user.username || user.name }}</div>
          <div style="font-size:13px; color:#aaa;">{{ user.email }}</div>
        </div>
        <v-btn
          color="pink"
          size="small"
          rounded
          variant="flat"
          style="text-transform:none;"
          @click.stop="followUser(user.id)"
        >
          Follow
        </v-btn>
      </v-card>
    </div>


  </v-menu>
</template>

<script setup>
import { ref } from 'vue'
import api from '../plugins/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const suggestedUsers = ref([])
const menu = ref(false)
const hover = ref(null)
const defaultPic = 'https://cdn-icons-png.flaticon.com/512/847/847969.png'

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
    suggestedUsers.value = users.slice(0, 4)
    menu.value = suggestedUsers.value.length > 0
  } catch (err) {
    console.error('Search failed:', err)
    suggestedUsers.value = []
    menu.value = false
  }
}

const goToUserProfile = (userId) => {
  router.push(`/user/${userId}`)
  suggestedUsers.value = []
  menu.value = false
}

const followUser = (userId) => {
  console.log('Follow user:', userId)
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
