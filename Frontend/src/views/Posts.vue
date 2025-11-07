<template>
    <v-container class="posts-page" fluid>
        <h1 class="page-title">Posts</h1>

        <v-form @submit.prevent="createPost" enctype="multipart/form-data" class="post-form">
            <v-text-field v-model="title" label="Post title" required outlined dense color="pink"></v-text-field>
            <v-textarea v-model="content" label="What's on your mind?" required outlined dense
                color="pink"></v-textarea>
            <v-file-input @change="handleFileUpload" accept="image/*" label="Upload Image" outlined dense
                color="pink"></v-file-input>
       
            <v-btn type="submit" color="pink" class="mt-2" dark>Post</v-btn>
        </v-form>



        <v-divider class="my-4"></v-divider>

        <div class="posts-feed">
            <v-card v-for="post in posts" :key="post.id" class="post-card dark-card">
                <v-card-title class="post-header d-flex align-center">
                    <v-avatar size="40" class="mr-3">
                        <v-img
                            :src="post.user.profile_pic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'"></v-img>
                    </v-avatar>
                    <div>
                        <div class="username">{{ post.user?.username || 'User' }}</div>
                        <div class="text-caption grey--text">{{ new Date(post.created_at).toLocaleString() }}</div>
                    </div>
                </v-card-title>


                <v-card-text>
                    <h1 class="post-title">{{ post.title }}</h1>


                    <v-img
                        :src="post.attachment || 'https://img.freepik.com/free-photo/vertical-shot-river-surrounded-by-mountains-meadows-scotland_181624-27881.jpg?semt=ais_hybrid&w=740&q=80'"
                        class="mt-2 mb-3"  height="500" width="100%" cover></v-img>


                    <p class="post-content fs-5">{{ post.content }}</p>


                </v-card-text>

                <v-card-actions>
                    <v-chip class="ma-1" color="pink darken-1" text-color="white">{{ post.likes_count }} Likes</v-chip>
                    <v-chip class="ma-1" color="pink darken-1" text-color="white">{{ post.comments_count }}
                        Comments</v-chip>
                </v-card-actions>
            </v-card>
        </div>
    </v-container>
</template>




<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../plugins/api'
import { useUserStore } from '../stores/userStore'

const userStore = useUserStore()
const user = computed(() => userStore.user)


const title = ref('')
const content = ref('')
const tags = ref('')
const attachment = ref(null)
const posts = ref([])

function getPosts() {
    console.log(posts.value)
}

const handleFileUpload = (e) => {
    attachment.value = e.target.files[0]
}

const createPost = async () => {
    const formData = new FormData()
    formData.append('user_id', user.value.id)
    formData.append('title', title.value)
    formData.append('content', content.value)
    formData.append('tags', tags.value)
    if (attachment.value) {
        formData.append('attachment', attachment.value)
    }

    try {
        const res = await api.post('posts/add', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        await fetchPosts()
    } catch (err) {
        console.error(err)
    }

    title.value = ''
    content.value = ''
    tags.value = ''
    attachment.value = null
}

const fetchPosts = async () => {
    try {
        const res = await api.get('posts')
        posts.value = res.data.data.reverse()
        console.log(posts.value)
        console.log(user.value)

    } catch (err) {
        console.error(err)
    }
}

const showPostModal = ref(false)

const submitAndClose = async () => {
    await createPost()
    showPostModal.value = false
}


onMounted(fetchPosts)
</script>

<style scoped>
.posts-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #121212;
    min-height: 100vh;
    color: #e0e0e0;
    font-family: "Poppins", sans-serif;
    padding: 2rem;
}

.page-title {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    text-align: center;
    color: #ff4081;
}

.post-form {
    width: 100%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background-color: #1e1e1e;
    padding: 1.5rem;
    border-radius: 10px;

}

.posts-feed {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
    max-width: 500px;
}

.post-card {
    width: 100%;
    border-radius: 10px;
    overflow: hidden;
}

.dark-card {
    background-color: #1e1e1e;
    color: #e0e0e0;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.6);
}

.post-header {
    border-bottom: 1px solid #333;
}

.username {
    font-weight: bold;
    color: #ff4081;
}

.post-title {
    margin: 0 0 5px 0;
    font-size: 18px;
    color: #ffffff;
}

.post-content {
    color: #cccccc;
}

.tags {
    margin-top: 8px;
    font-size: 13px;
    color: #ff80ab;
}
</style>