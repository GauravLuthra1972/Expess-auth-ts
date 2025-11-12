<template>
  <div class="right-profile mx-8">
    <div class="suggested-container pa-4">
      <h3
        class="text-center mb-4"
        style="color:#ff4081; font-weight:600; text-transform:uppercase;"
      >
        Suggested Users
      </h3>

      <div class="suggested-list" v-if="suggestedUsers.length">
        <v-card
          v-for="user in suggestedUsers"
          :key="user.id"
          class="pa-3 mb-3 d-flex align-center"
          style="background-color:#2a2a2a; border-radius:12px; transition:0.2s;"
          @mouseover="hover = user.id"
          @mouseleave="hover = null"
          :elevation="hover === user.id ? 6 : 1"
        >
          <v-avatar size="44" class="mr-3">
            <v-img :src="user.profile_pic || defaultPic"></v-img>
          </v-avatar>
          <div class="flex-grow-1">
            <div style="font-weight:600; font-size:15px;">{{ user.username }}</div>
            <div style="font-size:13px; color:#aaa;">{{ user.email }}</div>
          </div>
          <v-btn
            color="pink"
            size="small"
            rounded
            variant="flat"
            style="text-transform:none;"
          >
            Follow
          </v-btn>
        </v-card>
      </div>

      <div
        v-else
        class="d-flex flex-column align-center justify-center"
        style="height:50vh; color:#999;"
      >
        No users yet
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const hover = ref(null);
const defaultPic = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const suggestedUsers = ref([
  { id: 1, username: "gagan22", email: "gagan22@gmail.com", profile_pic: "https://cdn-icons-png.flaticon.com/512/4139/4139981.png" },
  { id: 2, username: "aryan98", email: "aryan98@gmail.com", profile_pic: "https://cdn-icons-png.flaticon.com/512/4139/4139983.png" },
  { id: 3, username: "riya_k", email: "riyak@gmail.com", profile_pic: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png" },
  { id: 4, username: "devraj", email: "devraj07@gmail.com", profile_pic: "https://cdn-icons-png.flaticon.com/512/4140/4140037.png" },
  { id: 5, username: "megha_p", email: "meghap@gmail.com", profile_pic: "https://cdn-icons-png.flaticon.com/512/4140/4140057.png" },
  { id: 6, username: "rohan_s", email: "rohans@gmail.com", profile_pic: "https://cdn-icons-png.flaticon.com/512/4140/4140087.png" },
  { id: 7, username: "ananya", email: "ananya02@gmail.com", profile_pic: "https://cdn-icons-png.flaticon.com/512/4140/4140040.png" },
  { id: 8, username: "vishal", email: "vishal09@gmail.com", profile_pic: "https://cdn-icons-png.flaticon.com/512/4140/4140088.png" },
  { id: 9, username: "priya", email: "priya21@gmail.com", profile_pic: "https://cdn-icons-png.flaticon.com/512/4140/4140050.png" },
  { id: 10, username: "harshit", email: "harshit11@gmail.com", profile_pic: "https://cdn-icons-png.flaticon.com/512/4140/4140083.png" }
]);
</script>

<style scoped>
.right-profile {
  width: 100%;
  max-width: 21rem;
  position: sticky;
  top: 4rem;
}

.suggested-container {
  background: none;
  border: none;
  color: #fff;
  height: calc(100vh - 5rem);
  display: flex;
  flex-direction: column;
}

.suggested-list {
  overflow-y: auto;
  flex: 1;
  scrollbar-width: none;
}

.suggested-list::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
