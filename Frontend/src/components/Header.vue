<template>
  <v-app-bar :elevation="2">
    <v-app-title class="px-15 text-h5">SocialSphere</v-app-title>
    <v-spacer></v-spacer>

    <v-list class="d-flex ga-4 px-15" style="background-color: #121212; color: white;">
      <v-list-item to="/myposts">My Posts</v-list-item>
      <v-list-item to="/posts">Posts</v-list-item>
      <v-list-item to="/users" v-if="user?.role === 'admin'">Users</v-list-item>

      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" icon>
            <v-avatar>
              <v-img :src="user?.profile_pic || defaultprofile" />
            </v-avatar>
          </v-btn>
        </template>

        <v-list style="background-color: #121212; color: white;">
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


          <v-switch v-model="user.isTwofaEnabled" @change="toggleTwoFA" inset
            :label="`2FA ${user.isTwofaEnabled ? 'On' : 'Off'}`" />





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


    <v-dialog v-model="twofaDialog" max-width="400">
      <v-card>
        <v-card-title>Two-Factor Authentication</v-card-title>
        <v-card-text class="text-center">


          <div v-if="user.twofaSecret">
            <p>Enter your 6-digit code from your Authenticator app</p>

            <v-text-field v-model="twofaCode" label="Enter code from app" maxlength="6"></v-text-field>

            <v-btn color="primary" class="mt-2" @click="verifyTwoFA">
              Verify
            </v-btn>
          </div>


          <div v-else>
            <div v-if="qrCodeImage">
              <v-img :src="qrCodeImage" max-width="250" class="mx-auto"></v-img>
              <p class="mt-2">Scan this QR code with your Authenticator app</p>

              <v-btn color="primary" class="mt-3" @click="scanned = true" v-if="!scanned">
                I have scanned the QR code
              </v-btn>

              <div v-if="scanned" class="mt-3">
                <v-text-field v-model="twofaCode" label="Enter code from app" maxlength="6"></v-text-field>

                <v-btn color="primary" class="mt-2" @click="verifyTwoFA">
                  Verify
                </v-btn>
              </div>
            </div>
            <div v-else>
              <p>Loading QR code...</p>
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="twofaDialog = false">Close</v-btn>
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
      defaultprofile: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      twofaDialog: false,
      qrCodeImage: null,
      secret: null,
      scanned: false,
      twofaCode: ""
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
    async toggleTwoFA() {
      if (this.user.twofaSecret) {
        this.secret = this.user.twofaSecret;
        this.twofaDialog = true;
        this.qrCodeImage = null;
        this.scanned = true;
        return;
      }

      try {
        const res = await this.$api.post("/auth/twofac", { userId: this.user.id });
        this.qrCodeImage = res.data.qrCodeImage;
        this.secret = res.data.secret;
        this.twofaDialog = true;
        this.scanned = false;
        await this.fetchUser();
      } catch (error) {
        console.error(error);
        alert("Failed to load QR code. Try again.");
      }
    },

    async verifyTwoFA() {
      if (!this.twofaCode) {
        alert("Please enter the code from your Authenticator app.");
        return;
   
      }

      try {
        console.log("useri",this.user.id)
        console.log(this.twofaCode)
        console.log("secretee",String(this.secret || this.user.twofaSecret)  )
        const res = await this.$api.post("/auth/twofacverify", {
          userId: this.user.id,
          code: this.twofaCode,
          secret: String(this.secret || this.user.twofaSecret)  



        });

        if (res.data.success) {
          this.twofaDialog = false;
          this.secret = null;
          alert(res.data.message);
          await this.fetchUser();
        } else {
          alert("Invalid code, please try again.");
        }
      } 
      catch (error) {
        console.error(error);
        alert("Something went wrong. Try again.");
      }
    }
    ,

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