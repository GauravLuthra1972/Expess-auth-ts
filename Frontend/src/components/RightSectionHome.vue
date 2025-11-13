<template>
  <div class="right-profile mx-8">
    <div class="suggested-container pa-4">
      <h4 class="text-center mb-4" style="color:#ff4081; font-weight:400; text-transform:uppercase;">
        Suggested Users
      </h4>

      <div class="suggested-list" v-if="suggestedUsers.length">
        <v-card v-for="user in suggestedUsers" :key="user.id" class="pa-3 mb-3 d-flex align-center"
          style="background-color:#2a2a2a; border-radius:12px; transition:0.2s; width: 100%;"
          @mouseover="hover = user.id" @mouseleave="hover = null" :elevation="hover === user.id ? 6 : 1">
          <v-avatar size="44" class="mr-3">
            <v-img :src="user.profile_pic || defaultPic"></v-img>
          </v-avatar>
          <div class="flex-grow-1">
            <div style="font-weight:600; font-size:15px;">{{ user.username }}</div>

          </div>
          <v-btn :color="user.isFollowing ? 'grey' : 'pink'" size="small" rounded variant="flat"
            style="text-transform:none;" @click.stop="toggleFollow(user)">
            {{ user.isFollowing ? 'Unfollow' : 'Follow' }}
          </v-btn>
        </v-card>
      </div>

      <div v-else class="d-flex flex-column align-center justify-center" style="height:50vh; color:#999;">
        No users yet
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../plugins/api";
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();
const currentUserId = userStore.user.id;

const hover = ref(null);
const defaultPic = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
const suggestedUsers = ref([]);
const followingIds = ref([]);

// Fetch list of users the current user is following
const fetchFollowing = async () => {
  try {
    const res = await api.get("/follow/getfollowing", {
      params: { userId: currentUserId },
    });
    followingIds.value = res.data.map((user) => user.id);
  } catch {
    followingIds.value = [];
  }
};

// Fetch suggested users and add isFollowing
const fetchSuggestedUsers = async () => {
  try {
    const response = await api.get("/users/suggested", {
      params: { userId: currentUserId },
    });

    suggestedUsers.value = response.data.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      profile_pic: user.profile_pic,
      isFollowing: followingIds.value.includes(user.id),
    }));
  } catch (error) {
    console.error("Error fetching suggested users:", error);
  }
};

// Follow/Unfollow logic
const toggleFollow = async (user) => {
  try {
    if (!user.isFollowing) {
      await api.post("/follow/follow", null, {
        params: { followerId: currentUserId, followingId: user.id },
      });
      user.isFollowing = true;
      followingIds.value.push(user.id);
    } else {
      await api.post("/follow/unfollow", null, {
        params: { followerId: currentUserId, followingId: user.id },
      });
      user.isFollowing = false;
      followingIds.value = followingIds.value.filter((id) => id !== user.id);
    }

    // Optional: Update global user data if needed
    await userStore.fetchUser();
  } catch (error) {
    console.error("Follow/unfollow failed:", error);
    alert("Action failed. Please try again.");
  }
};

// Initialize data
onMounted(async () => {
  await fetchFollowing();
  await fetchSuggestedUsers();
});
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
