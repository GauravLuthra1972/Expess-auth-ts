<!-- <template>
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
      :export="{ enabled: true, fileName: 'DataGrid' }"
      @exporting="usersData.onExporting" :ref="usersData.dataGridRef"
      :selection="{ mode: 'multiple', showCheckBoxesMode: 'always' }"
      :master-detail="{ enabled: true, template: detailTemplate }" 

      @editing-start="openEditModal"
    @row-removing="openDeleteModal"

      :editing="{
        mode: 'row',  
       
        allowUpdating: true,
        allowDeleting: true,
        allowAdding: true,
        useIcons: true,
         confirmDelete: false
      }">


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




      <DxColumn data-field="" caption="" />
      <DxColumn data-field="name" caption="Name" />
      <DxColumn data-field="username" caption="Username" />
      <DxColumn data-field="email" caption="Email" />
      <DxColumn data-field="created_at" caption="Joined Date" width="250" :calculate-cell-value="formatDate" />
      <DxColumn data-field="role" caption="Role" width="100" />



  
      


 



    </DxDataGrid>
    
  </v-container>
</template> -->

<template>
    
</template>