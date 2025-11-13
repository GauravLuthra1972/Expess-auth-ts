<template>
  <v-container fluid class="d-flex justify-center pa-0 ma-0 " style="background-color:#121212; height: 100%; ">
    <v-card color="#1E1E1E" elevation="8" rounded="xl" class="overflow-hidden profile-card" width="850" >
     
      <div class="cover-wrapper">
        <v-img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
          height="160"
          cover
          class="cover-img"
        ></v-img>
      </div>

  
      <div class="avatar-wrapper">
        <v-avatar size="130" class="elevation-6">
          <v-img src="https://cdn-icons-png.flaticon.com/512/149/149071.png"></v-img>
        </v-avatar>
      </div>


      <div class="text-center mt-14">
        <h2 class="text-h6 font-weight-bold white--text mb-1">Gaurav928</h2>

        <div class="d-flex justify-center grey--text text--lighten-1 mb-4">
          <span class="mx-3">2 posts</span>
          <span class="mx-3">10 followers</span>
          <span class="mx-3">5 following</span>
        </div>

        <!-- Follow Button -->
        <v-btn
          :color="isFollowing ? '#333' : '#ff007f'"
          class="white--text font-weight-bold px-8"
          rounded
          elevation="2"
          @click="toggleFollow"
        >
          {{ isFollowing ? 'Following' : 'Follow' }}
        </v-btn>
      </div>

      <v-divider class="my-6" color="grey darken-3"></v-divider>

      <!-- TABS -->
      <v-tabs v-model="tab" align-tabs="center" color="#ff007f" slider-color="#ff007f">
        <v-tab>Posts</v-tab>
        <v-tab>Saved</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item value="0">
          <v-card-text class="text-center grey--text text--lighten-1">No posts yet</v-card-text>
        </v-window-item>
        <v-window-item value="1">
          <v-card-text class="text-center grey--text text--lighten-1">No saved posts</v-card-text>
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
const tab = ref(0);
const isFollowing = ref(false);
const toggleFollow = () => (isFollowing.value = !isFollowing.value);
</script>

<style scoped>
.profile-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  transition: all 0.3s ease;
}
.profile-card:hover {
  border-color: #ff007f;
}
.cover-wrapper {
  position: relative;
  width: 100%;
}
.cover-img {
  object-fit: cover;
  width: 100%;
}
.avatar-wrapper {
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
}
</style>