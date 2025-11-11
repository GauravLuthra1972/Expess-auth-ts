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

      <v-btn block color="pink" class="mt-4" dark>My Profile</v-btn>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useUserStore } from '../stores/userStore'

const userStore = useUserStore();
const user = computed(() => userStore.user);
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
