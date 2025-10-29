<template>
  <v-container fluid >


    <v-data-table
      :headers="headers"
      :items="users"
      class="elevation-2"
      :items-per-page="10"
      show-header
    >

      <template #item.profile_pic="{ item }">
        <v-avatar size="50">
          <v-img :src="item.profile_pic || defaultprofile" />
        </v-avatar>
      </template>

      <template #item.actions="{ item }">
        <v-btn color="red-darken-3" @click="deleteUser(item.id)">
          Delete
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      defaultprofile: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      headers: [
        { title: "Profile", key: "profile_pic"},
        { title: "Name", key: "name" },
        { title: "Username", key: "username" },
        { title: "Email", key: "email" },
        { title: "Joined Date", key: "created_at" },
        { title: "Actions", key: "actions"},
      ],
    };
  },

  mounted() {
    this.$api.get("/users")
      .then(({ data }) => {
      
        this.users = data.map(user => ({
          ...user,
          created_at: this.formatDate(user.created_at),
          profile_pic: user.profile_pic || this.defaultprofile
        }));
      })
      .catch(err => console.error("Error fetching users:", err));
  },

  methods: {
    formatDate(dateStr) {
      if (!dateStr) return "N/A";
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    },

    deleteUser(id) {
      if (!confirm("Are you sure you want to delete this user?")) return;

      this.$api.delete(`/users/deletebyid/${id}`)
        .then(() => {
          this.users = this.users.filter(user => user.id !== id);
          alert("User Deleted");
        })
        .catch(err => {
          console.error(err);
          alert("Failed to delete user");
        });
    },
  },
};
</script>

<style scoped>
.v-data-table {
  border-radius: 10px;
  overflow: hidden;
}

.v-avatar img {
  border-radius: 50%;
  width: 50px;
  height: 50px;
}

h1 {
  font-weight: bold;
}
</style>
