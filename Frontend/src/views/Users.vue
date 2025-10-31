<template>
  <v-container fluid class="pa-0 ma-0">
    <DxDataGrid
      :data-source="usersData.dataSource"
      :remote-operations="true"
      :show-borders="true"
      :column-auto-width="true"
      :row-alternation-enabled="true"
      :paging="{ pageSize: 10 }"
      :pager="usersData.paginationOption"
      :filter-row="{ visible: true, showOperationChooser: true }"
      ref="usersData.dataGridRef"
      :editing="{ mode: 'row', allowUpdating: true, allowDeleting: true }"
      
    >
      <DxColumn data-field="profile_pic" caption="Profile" cell-template="profileTemplate" width="100" />
      <DxColumn data-field="name" caption="Name" />
      <DxColumn data-field="username" caption="Username" />
      <DxColumn data-field="email" caption="Email" />
      <DxColumn data-field="created_at" caption="Joined Date" width="250" />
      <DxColumn data-field="role" caption="Role" width="100" />

      <DxColumn type="buttons" width="120">
        <DxButton name="edit" />
        <DxButton name="delete" />
      </DxColumn>

      <template #profileTemplate="{ data }">
        <div style="display:flex;justify-content:center;">
          <img :src="data.data.profile_pic" style="width:50px;height:50px;border-radius:50%;" />
        </div>
      </template>
    </DxDataGrid>
  </v-container>
</template>

<script setup>
import DxDataGrid, { DxColumn, DxButton } from "devextreme-vue/data-grid";
import useUsersData from '../composables/useUsersData'

const usersData = useUsersData();
</script>
