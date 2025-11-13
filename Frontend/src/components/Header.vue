<template>
  <v-app-bar :elevation="2">
    <v-app-title class="px-15 text-h5">SocialSphere</v-app-title>

    <div style="flex: 1; max-width: 25rem; ">
      <UserSearch></UserSearch>
    </div>
    <v-spacer></v-spacer>



    <v-list class="d-flex ga-4 px-15" style="background-color: #121212; color: white;">
      <!-- <v-list-item to="/myposts">My Posts</v-list-item> -->
      <v-list-item to="/posts">Home</v-list-item>
      <v-list-item to="/users" v-if="user?.role === 'admin'">Users</v-list-item>
      <v-list-item to="/communities">Communities</v-list-item>
      <v-list-item to="/chats">Chats</v-list-item>


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


          <div class="d-flex align-center justify center mt-3 mb-2 ml-5 ga-3">
            <span class="text-subtitle-1">2 FA</span>
            <v-switch v-model="user.isTwofaEnabled" @change="toggleTwoFA" inset hide-details density="compact"
              class="ma-0 pa-0" />
          </div>






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


    <v-dialog v-model="twofaDialog" max-width="600">
      <v-card>
        <v-card-title class="text-center">Two-Factor Authentication</v-card-title>
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

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useUserStore } from '../stores/userStore'
import api from '../plugins/api'
import UserSearch from './UserSearch.vue'


const userStore = useUserStore()
const { logout, fetchUser, updateUser, deleteUser, uploadProfile } = userStore


const editDialog = ref(false)
const uploadDialog = ref(false)
const selectedFile = ref(null)
const defaultprofile = ref('https://cdn-icons-png.flaticon.com/512/149/149071.png')
const twofaDialog = ref(false)
const qrCodeImage = ref(null)
const secret = ref(null)
const scanned = ref(false)
const twofaCode = ref('')

const user = computed(() => userStore.user)

function openUploadDialog() {
  uploadDialog.value = true
}

function handleFile(event) {
  selectedFile.value = event.target.files[0]
}

function uploadFile() {
  if (selectedFile.value) uploadProfile(selectedFile.value)
  uploadDialog.value = false
}

function editAccount() {
  editDialog.value = true
}

async function toggleTwoFA() {
  if (user.value.twofaSecret) {
    secret.value = user.value.twofaSecret
    twofaDialog.value = true
    qrCodeImage.value = null
    scanned.value = true
    return
  }

  try {
    const res = await api.post('/auth/twofac', { userId: user.value.id })
    qrCodeImage.value = res.data.qrCodeImage
    secret.value = res.data.secret
    twofaDialog.value = true
    scanned.value = false
    await fetchUser()
  } catch (error) {
    console.error(error)
    alert('Failed to load QR code. Try again.')
  }
}

async function verifyTwoFA() {
  if (!twofaCode.value) {
    alert('Please enter the code from your Authenticator app.')
    return
  }

  try {
    const res = await api.post('/auth/twofacverify', {
      userId: user.value.id,
      code: twofaCode.value,
      secret: String(secret.value || user.value.twofaSecret)
    })

    if (res.data.success) {
      twofaDialog.value = false
      secret.value = null
      alert(res.data.message)
      await fetchUser()
    } else {
      alert('Invalid code, please try again.')
      await fetchUser()
    }
  } catch (error) {
    console.error(error)
    const msg = error.response?.data?.message || error.response?.data?.error || 'Something went wrong. Try again.'
    alert(msg)
  }
}



watch(twofaDialog, async (newVal, oldVal) => {

  if (oldVal && !newVal) {
    await fetchUser()
  }
})


function saveChanges() {
  updateUser(user.value)
  editDialog.value = false
}

function deleteAccount() {
  deleteUser()
}

onMounted(() => {
  console.log(user.value)
})
</script>