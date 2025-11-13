<template>
  <div class="left-profile mt-2 mx-8">
    <v-card class="profile-card">
      <v-img
        :src="'https://res.cloudinary.com/dn6thwmgm/image/upload/v1762753671/Post_Attachments/onci0mgjuafreydv8isd.jpg'"
        height="100"
        cover
      ></v-img>

      <v-avatar size="80" class="mt-n10 mx-auto">
        <v-img
          :src="user.profile_pic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'"
        ></v-img>
      </v-avatar>

      <div class="text-center mt-3">
        <h4>{{ user.name }}</h4>
        <p class="grey--text">@{{ user.username }}</p>
      </div>

      <div class="d-flex justify-space-around mt-3">
        <div>
          <strong>{{user.postsCount}}</strong>
          <div class="caption">Posts</div>
        </div>
        <div>
          <strong>{{user.followersCount}}</strong>
          <div class="caption">Followers</div>
        </div>
        <div>
          <strong>{{user.followingCount}}</strong>
          <div class="caption">Following</div>
        </div>
      </div>

      <v-btn block color="pink" class="mt-4" dark @click="router.push('myposts')">My Profile</v-btn>
    </v-card>






<v-card class="profile-card my-15 pa-4">
  <div class="d-flex justify-space-between align-center mb-3">
    <h4>My Communities</h4>
    <v-btn icon size="small" color="pink" @click="createDialog = true">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>

  <v-list dense>
    <v-list-item
      v-for="community in communities"
      :key="community.id"
      class="hover:bg-[#2a2a2a] rounded-lg"
    >

      <v-list-item-title>{{ community.name }}</v-list-item-title>
    </v-list-item>
  </v-list>
</v-card>


  </div>
</template>

<script setup>
import { computed ,ref} from "vue";
import { useUserStore } from '../stores/userStore'
import router from "../routes/router";

const userStore = useUserStore();
const user = computed(() => userStore.user);


const createDialog = ref(false);
const communities = ref([
  { id: 1, name: "Vue Devs", icon: "https://cdn-icons-png.flaticon.com/512/5968/5968672.png" },
  { id: 2, name: "AI Talks", icon: "https://cdn-icons-png.flaticon.com/512/4712/4712109.png" },
  { id: 3, name: "Tech Memes", icon: "https://cdn-icons-png.flaticon.com/512/5968/5968282.png" },
    { id: 1, name: "Vue Devs", icon: "https://cdn-icons-png.flaticon.com/512/5968/5968672.png" },
  { id: 2, name: "AI Talks", icon: "https://cdn-icons-png.flaticon.com/512/4712/4712109.png" },

]);







</script>

<style scoped>
.left-profile {
  width: 100%;
  max-width: 21rem;
  position: sticky;

}

.profile-card {
  background-color: #1e1e1e;
  border-radius: 12px;
  color: #fff;
  text-align: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.5);
}
</style>
