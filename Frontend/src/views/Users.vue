<template>
  <v-container fluid class="pa-0 ma-0">
    <DxDataGrid :data-source="usersData.store" :remote-operations="true" :show-borders="true" :column-auto-width="true"
      :row-alternation-enabled="true" :paging="{ pageSize: 10 }" :pager="usersData.paginationOption"
      :filter-row="{ visible: true, showOperationChooser: true }" :export="{ enabled: true, fileName: 'DataGrid' }"
      @exporting="usersData.onExporting" :ref="usersData.dataGridRef"
      :selection="{ mode: 'multiple', showCheckBoxesMode: 'always' }"
       @option-changed="onOptionChanged"
      @editing-start="openEditModal" @row-removing="openDeleteModal" :editing="{
        mode: 'row',

        allowUpdating: true,
        allowDeleting: true,
        allowAdding: true,
        useIcons: true,
        confirmDelete: false
      }">
      <DxMasterDetail :enabled="true" template="master_detail" />

      <template #master_detail="">
        <v-card class="ma-4 pa-4" elevation="2">
          <v-card-title>User Details Preview</v-card-title>
          <v-card-text>
            <div><strong>ID:</strong> jfdjwkbh</div>
            <div><strong>Name:</strong>egfsdgfre</div>
            <div><strong>Email:</strong> gfhdzsh</div>
            <div><strong>Username:</strong> ghfd</div>
          </v-card-text>
        </v-card>
      </template>




      <DxToolbar>
        <DxItem name="exportButton" location="after" />

        <DxItem location="after" widget="dxButton"
          :options="{ icon: 'trash', text: 'Delete Selected', type: 'danger', onClick: deleteAllUsers }" />

        <DxItem location="before" widget="dxButton" :options="{
          icon: 'refresh', text: 'Refresh', type: 'default', onClick: refreshTableData
        }" />

        <DxItem location="before" widget="dxButton" :options="{
          icon: 'add', text: 'Add', type: 'success', onClick: openAddUserModal
        }" />
      </DxToolbar>




      <DxColumn data-field="profile_pic" caption="Profile" cell-template="profileTemplate" width="100" />
      <DxColumn data-field="name" caption="Name" />
      <DxColumn data-field="username" caption="Username" />
      <DxColumn data-field="email" caption="Email" />
      <DxColumn data-field="created_at" caption="Joined Date" width="250" :calculate-cell-value="formatDate" />
      <DxColumn data-field="role" caption="Role" width="100" />







      <template #profileTemplate="{ data }">
        <div style="display:flex; justify-content:center; align-items:center; gap:8px;">
          <img :src="data.data.profile_pic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'"
            style="width:50px; height:50px; border-radius:50%;" />

        </div>
      </template>






    </DxDataGrid>




    <v-dialog v-model="showEditModal" max-width="500px">
      <v-card>
        <v-card-title>Edit User</v-card-title>
        <v-card-text>
          <v-text-field v-model="selectedUser.name" label="Name" />
          <v-text-field v-model="selectedUser.username" label="Username" />
          <v-text-field v-model="selectedUser.email" label="Email" />
          <v-select v-model="selectedUser.role" :items="['admin', 'user', 'moderator', 'guest']" label="Role" />
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="showEditModal = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveUser">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showAddModal" max-width="500px">
      <v-card>
        <v-card-title>Add User</v-card-title>
        <v-card-text>
          <v-text-field v-model="selectedUser1.name" label="Name" />
          <v-text-field v-model="selectedUser1.username" label="Username" />
          <v-text-field v-model="selectedUser1.email" label="Email" />
          <v-text-field v-model="selectedUser1.password" type="password" label="Password" />
          <v-select v-model="selectedUser1.role" :items="['admin', 'user', 'moderator', 'guest']" label="Role" />
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="showAddModal = false">Cancel</v-btn>
          <v-btn color="primary" @click="addUser">Add </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>


<script setup>
import Swal from "sweetalert2";
import { ref } from "vue"

import api from "../plugins/api";
import DxDataGrid, { DxColumn, DxToolbar, DxItem, DxButton } from "devextreme-vue/data-grid";
import dataSource from "../composables/dataSource";
import dxExtra from "../composables/dxExtra";


const userPostsCache = ref({});

function getUserPosts(data) {
  const userId = data.data.id; // Extract user ID correctly
  console.log("Detail row data:", data);
  console.log("User ID:", userId);

  if (!userPostsCache.value[userId]) {
    userPostsCache.value[userId] = [];
    api.get(`/posts/fetchUser?user_id=${userId}`).then(response => {
      userPostsCache.value[userId] = response.data.data;
      userPostsCache.value = { ...userPostsCache.value }; // trigger reactivity
    }).catch(error => {
      console.error("Failed to fetch posts:", error);
    });
  }

  return userPostsCache.value[userId];
}



const usersData = dataSource("/users", {}, "/users/adminupdate", "/users/deletebyid");
const { formatDate } = dxExtra()

const refreshTableData = () => {
  console.log("refreshing")

  usersData.refreshTable(usersData.dataGridRef);
};

function onOptionChanged(e) {

  usersData.refreshTable(usersData.dataGridRef);

}



const deleteAllUsers = async () => {
  const grid = usersData.dataGridRef.value.instance;
  const selectedRows = grid.getSelectedRowsData();

  if (selectedRows.length === 0) {
    Swal.fire({
      icon: "info",
      title: "No users selected!",
      showConfirmButton: true
    });
    return;
  }

  const result = await Swal.fire({
    title: `Are you sure you want to delete ${selectedRows.length} user(s)?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete them!",
    cancelButtonText: "Cancel"
  });

  if (result.isConfirmed) {
    try {
      const ids = selectedRows.map(user => user.id);
      await api.delete("/users/delete-multiple", { data: { ids } });

      grid.refresh();

      Swal.fire({
        icon: "success",
        title: `${ids.length} users deleted successfully`,
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Failed to delete users",
        text: error.message || "",
      });
    }
  }
};



const showEditModal = ref(false)
const selectedUser = ref({});




function openEditModal(e) {
  console.log(e.data)

  const data = e.data
  selectedUser.value = { ...data };
  showEditModal.value = true;
  e.cancel = true
}

async function saveUser() {
  console.log("running save i")
  try {
    await usersData.store.update(selectedUser.value.id, {
      name: selectedUser.value.name,
      username: selectedUser.value.username,
      email: selectedUser.value.email,
      role: selectedUser.value.role
    });

    Swal.fire({
      icon: "success",
      title: "User updated successfully",
      timer: 2000,
      showConfirmButton: false
    });

    showEditModal.value = false;
    usersData.refreshTable(usersData.dataGridRef);

  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: "Failed to update user",
      text: error.response?.data?.message || error.message || "",
    });
  }
}




async function openDeleteModal(e) {
  e.cancel = true
  console.log(e)
  const user = e.data;
  const result = await Swal.fire({
    title: `Are you sure you want to delete ${user.name}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete!",
    cancelButtonText: "Cancel"
  });

  if (!result.isConfirmed) return;
  try {
    await usersData.store.remove(user.id);


    Swal.fire({
      icon: "success",
      title: "User deleted successfully",
      timer: 2000,
      showConfirmButton: false
    });

    usersData.refreshTable(usersData.dataGridRef);
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: "Failed to delete user",
      text: error.message || "",
    });
  }
}






const showAddModal = ref(false);

const selectedUser1 = ref({
  name: '',
  username: '',
  email: '',
  password: '',
  role: ''
});


function openAddUserModal() {
  selectedUser1.value = { name: '', username: '', email: '', password: '', role: '' };
  showAddModal.value = true;
}

async function addUser() {
  try {
    await usersData.store.insert(selectedUser1.value);
    showAddModal.value = false;
    usersData.refreshTable(usersData.dataGridRef);
  } catch (error) {

    showAddModal.value = false;
  }
}
</script>