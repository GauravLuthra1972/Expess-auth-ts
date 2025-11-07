<template>
  <v-container fluid class="pa-0 ma-0">
    <DxDataGrid :remote-operations="true" :show-borders="true" :column-auto-width="true" :row-alternation-enabled="true"
      :paging="{ pageSize: 10 }" :filter-row="{ visible: true, showOperationChooser: true }
      "
      :data-source="postData.store"
      >
      
      
      <DxColumn data-field="id" caption="Post ID" width="80" />
      <DxColumn data-field="title" caption="Title" />
      <DxColumn data-field="content" caption="Content" />
      <DxColumn data-field="status" caption="Status" width="100" />
      <DxColumn data-field="likes_count" caption="Likes" width="80" />
      <DxColumn data-field="comments_count" caption="Comments" width="100" />
      <DxColumn data-field="attachment" caption="Attachment" cell-template="attachmentTemplate" />
      <DxColumn data-field="tags" caption="Tags" />
      <DxColumn data-field="created_at" caption="Created At" width="200"  />
    </DxDataGrid>
    
  </v-container>
</template>


<script setup>
import { ref } from 'vue';
import DxDataGrid, { DxColumn, DxToolbar, DxItem, DxButton } from "devextreme-vue/data-grid";
import dataSource from '../composables/dataSource';

const postData=dataSource("posts",{})



</script>
