<template>
  <v-container fluid class="pa-0 ma-0">
    <DxDataGrid  :data-source="{ store: users }" :show-borders="true" :column-auto-width="true"
      :row-alternation-enabled="true" :show-column-lines="true" :show-row-lines="true" :paging="{ pageSize: pageSize }"
      :filter-row="{
        visible: true,
        applyFilter: 'auto',
        showOperationChooser: true
      }" :pager="{
    showPageSizeSelector: true,
    allowedPageSizes: [5, 10, 20],
    showInfo: true,
    visible: true
  }" @option-changed="onOptionChanged">


      <DxColumn data-field="profile_pic" caption="Profile" cell-template="profileTemplate" width="100" />
      <DxColumn data-field="name" caption="Name" />
      <DxColumn data-field="username" caption="Username" />
      <DxColumn data-field="email" caption="Email" />
      <DxColumn data-field="created_at" caption="Joined Date" width="250" />
      <DxColumn data-field="role" caption="Role" width="100" />
      <DxColumn caption="Actions" cell-template="actionsTemplate" width="200" />

      <template #profileTemplate="{ data }">
        <div style="display:flex;justify-content:center;">
          <img :src="data.data.profile_pic || defaultprofile" style="width:50px;height:50px;border-radius:50%;" />
        </div>
      </template>

      <template #actionsTemplate="{ data }">
        <div class="d-flex ga-3">
          <v-btn color="primary" @click="openedit(data.data)">Edit</v-btn>
          <v-btn color="red-darken-3" @click="deleteUser(data.data.id)">Delete</v-btn>
        </div>
      </template>
    </DxDataGrid>

    <div class="d-flex justify-center align-center pa-0 ma-0 ">
      <v-btn :disabled="currentPage <= 1" @click="goToPreviousPage" color="primary">Previous</v-btn>
      <v-btn :disabled="currentPage >= totalPages" @click="goToNextPage" color="primary" class="ml-2">Next</v-btn>
      <span class="ml-4">Page {{ currentPage }} of {{ totalPages }}</span>
    </div>

    <v-dialog v-model="editDialog" max-width="500">
      <v-card>
        <v-card-title>Edit User</v-card-title>
        <v-card-text>
          <v-text-field label="Name" v-model="selectedUser.name" />
          <v-text-field label="Username" v-model="selectedUser.username" />
          <v-text-field label="Email" v-model="selectedUser.email" />
          <v-select v-model="selectedUser.role" :items="roles" dense outlined label="role" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="editDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveEditedUser">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import DxDataGrid, { DxColumn } from "devextreme-vue/data-grid";
import Swal from "sweetalert2";
import { useUserStore } from "../stores/userStore";
import { mapState } from "pinia";

export default {
  components: { DxDataGrid, DxColumn },
  data() {
    return {
      users: [],
      pageSize: 10,
      currentPage: 1,
      totalUsers: 0,
      totalPages: 0,
      editDialog: false,
      defaultprofile: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      selectedUser: { id: null, name: "", username: "", email: "", role: "" },
      roles: ["user", "admin", "moderator", "editor", "guest", "superadmin"]
    };
  },
  mounted() {
    this.fetchUsers(this.currentPage, this.pageSize);
  },
  computed: {
    ...mapState(() => useUserStore(), ['accessToken'])
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return "N/A";
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    },
    async fetchUsers(page = 1, pageSize = this.pageSize) {
      try {
        const { data } = await this.$api.get('/users', { params: { pageNo: page, count: pageSize } });
        console.log(data)
        this.users = data.data.map(user => ({
          ...user,
          created_at: this.formatDate(user.created_at),
          profile_pic: user.profile_pic || this.defaultprofile
        }));
        this.currentPage = data.currpage;
        this.totalPages = data.totalPages;
        this.totalUsers = data.totalUsers;
      } catch (err) {
        console.error(err);
      }
    },
    async deleteUser(id) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        try {
          await this.$api.delete(`/users/deletebyid/${id}`);
          this.users = this.users.filter(user => user.id !== id);
          Swal.fire({ title: "Deleted!", text: "User has been deleted.", icon: "success", timer: 1500, showConfirmButton: false });
        } catch {
          Swal.fire({ title: "Error!", text: "Failed to delete user.", icon: "error" });
        }
      }
    },
    onOptionChanged(e) {
      if (e.fullName === "paging.pageSize") {
        this.pageSize = e.value;
        this.fetchUsers(this.currentPage, this.pageSize);
      }
    },
    async saveEditedUser() {
      this.editDialog = false;
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to save changes to this user?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, save it!",
        cancelButtonText: "Cancel",
      });
      if (result.isConfirmed) {
        try {
          const { id, name, username, email, role } = this.selectedUser;
          await this.$api.put(`/users/adminupdate`, { id, name, username, email, role });
          const index = this.users.findIndex(u => u.id === id);
          if (index !== -1) {
            this.users[index].name = name;
            this.users[index].username = username;
            this.users[index].email = email;
            this.users[index].role = role;
          }
          this.editDialog = false;
          Swal.fire("Success", "User updated successfully", "success");
        } catch {
          Swal.fire("Error", "Failed to update user", "error");
        }
      } else {
        this.editDialog = true;
      }
    },
    openedit(data) {
      this.selectedUser = { ...data };
      this.editDialog = true;
    },
    async goToNextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        await this.fetchUsers(this.currentPage, this.pageSize);
      }
    },
    async goToPreviousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        await this.fetchUsers(this.currentPage, this.pageSize);
      }
    }
  }
};
</script>

<style scoped>
.dx-datagrid {
  border-radius: 10px;
  overflow: hidden;
}
</style>
