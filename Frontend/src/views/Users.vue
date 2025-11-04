<template>
  <v-container fluid class="pa-0 ma-0">
    <DxDataGrid
      :data-source="usersData.store"
      :remote-operations="true"
      :show-borders="true"
      :column-auto-width="true"
      :row-alternation-enabled="true"
      :paging="{ pageSize: 10 }"
      :pager="usersData.paginationOption"
      :filter-row="{ visible: true, showOperationChooser: true }"
      :editing="{ mode: 'row', allowUpdating: true, allowDeleting: true }"
      :export="{ enabled: true, fileName: 'DataGrid' }"
      @exporting="usersData.onExporting"
      :ref="usersData.dataGridRef"
      :selection="{ mode: 'multiple', showCheckBoxesMode: 'always' }"
    >
     <DxToolbar>
  <DxItem
    name="exportButton"
    location="after"
  />

  <DxItem
    location="after"
    widget="dxButton"
    :options="{
      icon: 'trash',
      text: 'Delete Selected',
      type: 'danger',
      onClick: deleteAllUsers
    }"
  />

  <DxItem
    location="before"
    widget="dxButton"
    :options="{
      icon: 'refresh',
      text: 'Refresh',
      type: 'default',
      onClick: refreshTableData
    }"
  />
</DxToolbar>

     


      <DxColumn data-field="profile_pic" caption="Profile" cell-template="profileTemplate" width="100" />
      <DxColumn data-field="name" caption="Name" />
      <DxColumn data-field="username" caption="Username" />
      <DxColumn data-field="email" caption="Email" />
      <DxColumn data-field="created_at" caption="Joined Date" width="250" :calculate-cell-value="formatDate" />
      <DxColumn data-field="role" caption="Role" width="100" />

      <DxColumn type="buttons" width="120">
        <DxButton name="edit" />
        <DxButton name="delete" />
      </DxColumn>

   <template #profileTemplate="{ data }">
  <div style="display:flex; justify-content:center; align-items:center; gap:8px;">
    <img 
      :src="data.data.profile_pic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'" 
      style="width:50px; height:50px; border-radius:50%;" 
    />

  </div>
</template>



      
    </DxDataGrid>
    
  </v-container>
</template>

<script setup>
import Swal from "sweetalert2";

import api from "../plugins/api";
import DxDataGrid, { DxColumn, DxToolbar, DxItem, DxButton } from "devextreme-vue/data-grid";
import dataSource from "../composables/dataSource";

const formatDate = (rowData) => {
  if (!rowData.created_at) return "";
  const date = new Date(rowData.created_at);
  return date.toLocaleDateString("en-In");
};

const usersData = dataSource("/users", {}, "/users/adminupdate", "/users/deletebyid");

const refreshTableData = () => {
  console.log("refreshing")

  usersData.refreshTable(usersData.dataGridRef);
};


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
</script>
