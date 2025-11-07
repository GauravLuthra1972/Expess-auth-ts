<template>
  <v-container class="posts-page" fluid>
    <h1 class="page-title">My Posts</h1>

    <div v-if="posts.length === 0" class="text-center mt-4">
      No posts yet.
    </div>

   <v-row class="posts-feed" dense>
  <v-col
    v-for="post in posts"
    :key="post.id"
    cols="12"
    sm="6"
    md="3"
  >
    <v-card class="post-card dark-card">
      <!-- <v-card-title class="post-header d-flex align-center">
        <v-avatar size="40" class="mr-3">
          <v-img :src="post.user?.profile_pic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'"></v-img>
        </v-avatar>
        <div>
          <div class="username">{{ post.user?.username || 'User' }}</div>
          <div class="text-caption grey--text">{{ new Date(post.created_at).toLocaleString() }}</div>
        </div>
      </v-card-title> -->

      <v-card-text>
        <h3 class="post-title mb-3">{{ post.title }}</h3>
        <v-img
          :src="post.attachment || 'https://img.freepik.com/free-photo/vertical-shot-river-surrounded-by-mountains-meadows-scotland_181624-27881.jpg?semt=ais_hybrid&w=740&q=80'"
          class="mt-2 mb-3"
          height="400"
          cover
        ></v-img>
        <p class="post-content">{{ post.content }}</p>
    
      </v-card-text>

      <v-card-actions>
        <v-chip class="ma-1" color="pink darken-1" text-color="white">{{ post.likes_count }} Likes</v-chip>
        <v-chip class="ma-1" color="pink darken-1" text-color="white">{{ post.comments_count }} Comments</v-chip>
      </v-card-actions>
    </v-card>
  </v-col>
</v-row>

  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../plugins/api'
import { useUserStore } from '../stores/userStore'

const userStore = useUserStore()
const user = computed(() => userStore.user)

const posts = ref([])

const fetchPosts = async () => {
  try {
    const res = await api.get('posts')
    console.log(res.data.data)
 
    posts.value = res.data.data.filter(p => p.user.id == user.value.id)
    console.log(posts.value)
  } catch (err) {
    console.error(err)
  }
}

onMounted(fetchPosts)
</script>

<style scoped>
.posts-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #121212;
  min-height: 100vh;
  color: #e0e0e0;
  font-family: "Poppins", sans-serif;
  padding: 2rem;
}

.page-title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #ff4081;
}

.posts-feed {
  width: 100%;
  margin: 0 auto;

}


.post-card {
  width: 100%;
  border-radius: 10px;
  
  overflow: hidden;
}

.dark-card {
  background-color: #1e1e1e;
  color: #e0e0e0;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.6);
}

.post-header {
  border-bottom: 1px solid #333;
}

.username {
  font-weight: bold;
  color: #ff4081;
}

.post-title {
  margin: 0 0 5px 0;
  font-size: 18px;
  color: #ffffff;
}

.post-content {
  color: #cccccc;
}

.tags {
  margin-top: 8px;
  font-size: 13px;
  color: #ff80ab;
}
</style>
