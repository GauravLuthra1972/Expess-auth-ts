<template>
  <v-app-bar :elevation="2">
    <v-app-title class="px-15 text-h5">Temp</v-app-title>

    <v-spacer></v-spacer>

    <v-list class="d-flex ga-4 px-15">
      <v-list-item to="/myposts">My Posts</v-list-item>
      <v-list-item to="/posts">Posts</v-list-item>
      <v-list-item  to="/users" v-if="user.role=='admin'">Users</v-list-item>

      <v-menu offset-y>
        <template #activator="{ props }">
          <v-btn v-bind="props" icon>
            <v-avatar>
              <v-img :src="user.profile || defaultprofile" />
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <div class="d-flex justify-center py-4" style="cursor: pointer;" @click="openUploadDialog">
            <v-avatar size="80">
              <v-img :src="user.profile || defaultprofile" />
            </v-avatar>
          </div>

          <v-list-item>
            <v-list-item-title class="text-center">{{ obj.name }}</v-list-item-title>
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
import { mapActions, mapState } from "pinia";
import { useUserStore } from "../stores/userStore";

export default {
  data() {
    return {
      editDialog: false,
      uploadDialog: false,
      selectedFile: null,
      response: '',
      obj: {
        id: "",
        email: "",
        username: "",
        name: "",
        profile: "",
      },
      defaultprofile: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    };
  },
  methods: {
    ...mapActions(useUserStore, ["logout", "setuser"]),

    openUploadDialog() {
      this.uploadDialog = true;
    },

    handleFile(event) {
      this.selectedFile = event.target.files[0];
    },

    async uploadFile() {
      if (!this.selectedFile) {
        alert('Please select a file');
        return;
      }

      const formData = new FormData();
      formData.append('image', this.selectedFile);
      formData.append('id', this.obj.id);

      try {
        const res = await fetch('http://localhost:8080/users/profile', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        console.log(data);

       if(data){
        this.user.profile = data.file; 
        this.obj.profile = data.file; 

       }
          
        



        this.response = JSON.stringify(data);
        this.uploadDialog = false;
        alert("Upload successful!");
      } catch (err) {
        console.error(err);
        alert('Error uploading file');
      }
    },

    async getdata() {
      const { data } = await this.$api.get("/users/userinfo");
      this.obj.name = data.info[0].name;
      this.obj.id = data.info[0].id;
      this.obj.email = data.info[0].email;
      this.obj.username = data.info[0].username;
      this.obj.profile = data.info[0].profile_pic;
      this.obj.role=data.info[0].role
      this.setuser(this.obj);
      console.log(this.user)
    },

    editAccount() {
      this.editDialog = true;
    },

    async saveChanges() {
      try {
        await this.$api.put("/users/update", this.obj);
        this.setuser(this.obj);
        this.editDialog = false;
        alert("Changes Saved");
      } catch (err) {
        alert("Error saving changes");
      }
    },

    async deleteAccount() {
      try {
        await this.$api.delete("/users/delete");
        alert("User Deleted");
        this.logout();
      } catch (err) {
        alert("Error Occurred");
      }
    }
  },

  computed: {
    ...mapState(useUserStore, ["accessToken", "user"])
  },

  mounted() {
    this.getdata();
  }
};
</script>
