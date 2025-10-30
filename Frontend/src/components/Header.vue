<template>
  <v-app-bar :elevation="2">
    <v-app-title class="px-15 text-h5">Temp</v-app-title>
    <v-spacer></v-spacer>

    <v-list class="d-flex ga-4 px-15">
      <v-list-item to="/myposts" v-if="user?.role === 'user'">My Posts</v-list-item>
      <v-list-item to="/posts" >Posts</v-list-item>
      <v-list-item to="/users" v-if="user?.role === 'admin'">Users</v-list-item>

      <v-menu offset-y>
        <template #activator="{ props }">
          <v-btn v-bind="props" icon>
            <v-avatar>
              <v-img :src="user?.profile_pic || defaultprofile" />
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <div class="d-flex justify-center py-4" style="cursor:pointer" @click="openUploadDialog">
            <v-avatar size="80">
              <v-img :src="user?.profile_pic || defaultprofile" />
            </v-avatar>
          </div>

          <v-list-item>
            <v-list-item-title class="text-center">{{ user?.name }}</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item @click="editAccount">
            <v-list-item-title>Edit Account</v-list-item-title>
          </v-list-item>

          <v-list-item @click="deleteAccount">
            <v-list-item-title>Delete Account</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-list>

    <v-dialog v-model="editDialog" max-width="500">
      <v-card>
        <v-card-title>Edit Account</v-card-title>
        <v-card-text>
          <v-text-field label="Name" v-model="user.name" />
          <v-text-field label="Username" v-model="user.username" />
          <v-text-field label="Email" v-model="user.email" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="editDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveChanges">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="uploadDialog" max-width="500">
      <v-card>
        <v-card-title>Upload Profile Picture</v-card-title>
        <v-card-text>
          <input type="file" @change="handleFile" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="uploadDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="uploadFile">Upload</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app-bar>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useUserStore } from '../stores/userStore'

export default {
  data() {
    return {
      editDialog: false,
      uploadDialog: false,
      selectedFile: null,
      defaultprofile: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    }
  },

  computed: {
    ...mapState(useUserStore, ['user'])
  },

  methods: {
    ...mapActions(useUserStore, ['logout', 'fetchUser', 'updateUser', 'deleteUser', 'uploadProfile']),

    openUploadDialog() {
      this.uploadDialog = true
    },

    handleFile(event) {
      this.selectedFile = event.target.files[0]
    },

    uploadFile() {
      if (this.selectedFile) this.uploadProfile(this.selectedFile)
      this.uploadDialog = false
    },

    editAccount() {
      this.editDialog = true
    },

    saveChanges() {
      this.updateUser(this.user)
      this.editDialog = false
    },

    deleteAccount() {
      this.deleteUser()
    }
  },

  mounted() {
    console.log(this.user)
  }
}
</script>