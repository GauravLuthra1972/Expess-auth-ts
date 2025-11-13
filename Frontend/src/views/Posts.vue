<template>
    <v-container class=" d-flex ma-0 pa-0 main-container"
        style="overflow: hidden; justify-content: space-between;  background-color: #121212;" fluid>

          <v-progress-linear 
    v-if="loading" 
    indeterminate 
    color="pink" 
    height="4" 
    class="loader-top"
  ></v-progress-linear>

        <LeftSectionHome class="mt-4"></LeftSectionHome>


        <div class="center-content mt-4">
            


            <v-form @submit.prevent="createPost" enctype="multipart/form-data" class="post-form ">

                <v-textarea v-model="content" label="What's on your mind?" required outlined dense
                    color="pink"></v-textarea>
                <v-file-input @change="handleFileUpload" accept="image/*" label="Upload Image" outlined dense
                    color="pink"></v-file-input>

                <v-btn type="submit" color="pink" class="mt-2" dark :loading="loading" :disabled="loading">
                    Post
                </v-btn>

            </v-form>



            <v-divider class="my-4"></v-divider>

            <div class="posts-feed">
                <v-card v-for="post in posts" :key="post.id" class="post-card dark-card"
                    @click="openCommentsDialog(post)">

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




                        <v-img
                            :src="post.attachment || 'https://img.freepik.com/free-photo/vertical-shot-river-surrounded-by-mountains-meadows-scotland_181624-27881.jpg?semt=ais_hybrid&w=740&q=80'"
                            class="mt-2 mb-3" height="500" width="100%" cover></v-img>


                        <p class="post-content fs-5">{{ post.content }}</p>


                    </v-card-text>

                    <v-card-actions>
                        <v-btn color="pink darken-1" text @click.stop="">
                            <v-icon left>mdi-heart</v-icon>
                            {{ post.likes_count }}
                        </v-btn>

                        <v-btn color="pink darken-1" @click="openCommentsDialog(post)">
                            <v-icon left>mdi-message</v-icon> {{ post.comments_count }}
                        </v-btn>

                    </v-card-actions>

                </v-card>
            </div>


            <v-dialog v-model="showCommentsDialog" max-width="64vw" persistent>
                <v-card class="dialog-card large-dialog">


                    <v-card-text class="d-flex flex-row p-0">


                        <div class="left-side pa-4">
                            <div class="post-header d-flex align-center mb-3">
                                <v-avatar size="40" class="mr-3">
                                    <v-img
                                        :src="selectedPost?.user?.profile_pic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'"></v-img>
                                </v-avatar>
                                <div>
                                    <div class="username">{{ selectedPost?.user?.username || 'User' }}</div>
                                    <div class="text-caption grey--text">{{ new
                                        Date(selectedPost?.created_at).toLocaleString() }}</div>
                                </div>
                            </div>

                            <p class="post-content mb-3">{{ selectedPost?.content }}</p>

                            <v-img
                                :src="selectedPost?.attachment || 'https://img.freepik.com/free-photo/vertical-shot-river-surrounded-by-mountains-meadows-scotland_181624-27881.jpg?semt=ais_hybrid&w=740&q=80'"
                                height="600" cover></v-img>
                        </div>



                        <div class="right-side pa-4 d-flex flex-column ">
                            <h3 class="text-pink mb-3">Comments</h3>
                            <div v-if="loadingComments" class="d-flex justify-center align-center"
                                style="height: 200px;">
                                <v-progress-circular indeterminate color="pink" size="50"></v-progress-circular>
                            </div>


                            <div v-else class="comments-list-scroll flex-grow-1 mb-3">

                                <div v-if="comments.length === 0" class="text-center grey--text" style="margin: auto;">
                                    No Comments Yet
                                </div>

                                <div v-for="comment in comments" :key="comment.id"
                                    class="comment-item d-flex align-start mb-2">
                                    <v-avatar size="30" class="mr-2 flex-shrink-0">
                                        <v-img
                                            :src="comment.user.profile_pic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'"></v-img>
                                    </v-avatar>
                                    <div class="comment-content flex-grow-1">
                                        <span class="comment-username">{{ comment.user.username }}</span>
                                        <span class="comment-text ml-1">{{ comment.text }}</span>
                                    </div>
                                    <v-icon small class="ml-1 comment-heart" :color="comment.liked ? 'red' : 'grey'"
                                        @click.stop="toggleLike(comment)">
                                        mdi-heart
                                    </v-icon>

                                    <v-icon v-if="comment.user.username == user.username" small color="red"
                                        style="cursor:pointer;" @click="openDeleteDialog(comment.id)">
                                        mdi-delete
                                    </v-icon>


                                </div>
                            </div>



                            <div class="comment-input-section mt-auto">
                                <v-textarea v-model="newComment" label="Add a comment..." dense outlined color="pink"
                                    hide-details rows="2"></v-textarea>
                                <v-btn color="pink" class="mt-2" block @click="addComment">Post Comment</v-btn>
                            </div>

                        </div>
                        <v-icon color="pink" class="ml-auto mb-2"
                            style="cursor:pointer; font-size:26px; position:absolute; top:10px; right:10px; z-index:10;"
                            @click="showCommentsDialog = false">
                            mdi-close
                        </v-icon>


<!-- Left and Right Arrows -->
<v-btn icon color="pink" class="nav-left" :disabled="selectedPostIndex === 0" @click="prevPost">
  <v-icon>mdi-chevron-left</v-icon>
</v-btn>
<v-btn icon color="pink" class="nav-right" :disabled="selectedPostIndex === posts.length - 1" @click="nextPost">
  <v-icon>mdi-chevron-right</v-icon>
</v-btn>









                    </v-card-text>


                    <!-- <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text color="pink" @click="showCommentsDialog = false">Close</v-btn>
                </v-card-actions> -->
                </v-card>
            </v-dialog>

            <v-dialog v-model="showDeleteDialog" max-width="400px">
                <v-card class="pa-4 text-center" style="background-color:#1e1e1e; color:#fff; border-radius:12px;">
                    <v-icon color="pink" size="48" class="mb-3">mdi-alert-circle-outline</v-icon>
                    <h3>Delete Comment?</h3>
                    <p class="mt-2 mb-4" style="color:#bbb;">Are you sure you want to delete this comment? This action
                        cannot be undone.</p>
                    <v-card-actions class="d-flex justify-center">
                        <v-btn color="grey" variant="text" @click="showDeleteDialog = false">Cancel</v-btn>
                        <v-btn color="pink" @click="confirmDelete">Delete</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>

        <RightSectionHome class="mt-4"></RightSectionHome>












    </v-container>







</template>




<script setup>
import Swal from 'sweetalert2'
import { ref, onMounted, computed } from 'vue'
import api from '../plugins/api'
import { useUserStore } from '../stores/userStore'
import LeftSectionHome from '../components/LeftSectionHome.vue'
import RightSectionHome from '../components/RightSectionHome.vue'


const userStore = useUserStore()
const user = computed(() => userStore.user)

const comments = ref([])
const newComment = ref('')
const loading = ref(false)
const loadingComments = ref(false)



const content = ref('')
const tags = ref('')
const attachment = ref(null)
const posts = ref([])

const showCommentsDialog = ref(false)
const selectedPost = ref(null)
const selectedPostIndex = ref(null)



async function addComment() {
    if (!newComment.value.trim()) return

    try {
        const payload = {
            post_id: selectedPost.value.id,
            user_id: user.value.id,
            content: newComment.value
        }

        const res = await api.post('comments/add', payload)

        comments.value.push({
            id: res.data.id,
            text: res.data.content,
            user: res.data.user,
            liked: false
        })

        newComment.value = ''
    }

    catch (err) {
        console.log(err)
    }
}

async function fetchComments(postId) {
    console.log("called")
    try {
        const res = await api.get(`comments?post_id=${postId}`)
        const allComments = comments.value = res.data.map(c => ({
            id: c.id,
            text: c.content,
            user: c.user,
            liked: false
        }))

        console.log(comments.value)
        comments.value = allComments.sort((a, b) => {
            if (a.user.username === user.value.username && b.user.username !== user.value.username) return -1
            if (a.user.username !== user.value.username && b.user.username === user.value.username) return 1
            return 0
        })
    }

    catch (err) {
        console.error("Error fetching comments:", err)
    }



}

const toggleLike = (comment) => {
    comment.liked = !comment.liked

}

const showDeleteDialog = ref(false)
const commentToDelete = ref(null)

function openDeleteDialog(id) {
    commentToDelete.value = id
    showDeleteDialog.value = true
}

async function confirmDelete() {
    try {
        await api.delete('/comments/delete', { params: { comment_id: commentToDelete.value } })
        showDeleteDialog.value = false
        await fetchComments(selectedPost.value.id)
    } catch (error) {
        console.error('Failed to delete comment', error)
    }
}

async function openCommentsDialog(post) {
    loadingComments.value = true
    selectedPost.value = post
    showCommentsDialog.value = true
    selectedPostIndex.value = posts.value.findIndex(p => p.id === post.id)

    const minDelay = new Promise(res => setTimeout(res, 2000))

    try {
        await Promise.all([fetchComments(post.id), minDelay])
    } catch (err) {
        console.error(err)
    } finally {
        loadingComments.value = false
    }
}

const nextPost = async () => {
    if (selectedPostIndex.value < posts.value.length - 1) {
        selectedPostIndex.value++
        selectedPost.value = posts.value[selectedPostIndex.value]
        loadingComments.value = true
        await fetchComments(selectedPost.value.id)
        loadingComments.value = false
    }
}

const prevPost = async () => {
    if (selectedPostIndex.value > 0) {
        selectedPostIndex.value--
        selectedPost.value = posts.value[selectedPostIndex.value]
        loadingComments.value = true
        await fetchComments(selectedPost.value.id)
        loadingComments.value = false
    }
}



function getPosts() {
    console.log(posts.value)
}

const handleFileUpload = (e) => {
    attachment.value = e.target.files[0]
}

const createPost = async () => {
    loading.value = true
    try {
        const formData = new FormData()
        formData.append('user_id', user.value.id)
        formData.append('content', content.value)
        formData.append('tags', tags.value)
        if (attachment.value) formData.append('attachment', attachment.value)

        const res = await api.post('posts/add', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })

        await userStore.fetchUser()
        await fetchPosts()


    } catch (err) {
        console.error(err)
    } finally {
        loading.value = false
        content.value = ''
        tags.value = ''
        attachment.value = null
    }
}


const fetchPosts = async () => {
    try {
        const res = await api.get('posts')
        posts.value = res.data.data.reverse()
        console.log(posts.value)
        console.log(user.value)
        await userStore.fetchUser()

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
.center-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #121212;
    width: 100%;
    color: #e0e0e0;
    font-family: "Poppins", sans-serif;


}

.page-title {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    text-align: center;
    color: #ff4081;
}

.post-form {
    width: 100%;
    max-width: 55rem;
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
    max-width: 32vw;
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

.dialog-card {
    background-color: #1e1e1e;
    color: #e0e0e0;
}

.left-side {
    flex: 1;
    border-right: 1px solid #333;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-right: 2rem;
    max-width: 37rem;
}

.right-side {
    flex: 1;
    display: flex;
    flex-direction: column;

    padding-left: 2rem;
}

.text-pink {
    color: #ff4081;
}

.large-dialog {
    height: 90vh;
    max-height: 90vh;
}

.comment-item {
    font-size: 1rem;
    display: flex;
    align-items: flex-start;
}

.comment-username {
    font-weight: bold;
    color: #ff4081;
}

.comment-text {
    color: #ccc;
    word-break: break-word;
}

.comments-list-scroll {
    flex: 1;
    overflow-y: auto;
    max-height: 60vh;
    padding-right: 8px;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.comments-list-scroll::-webkit-scrollbar {
    display: none;
}


.comment-input-section {
    margin-top: 8px;
}

.swal2-container {
    z-index: 99999 !important;
}

.nav-left, .nav-right {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 15;
  background-color: rgba(30,30,30,0.6); /* optional: makes arrows visible */
}

.nav-left {
  left: 5px;
}

.nav-right {
  right: 5px;
}








.center-content {

    overflow-y: auto;
    height: 100vh;
    scrollbar-width: none;


}

.center-content::-webkit-scrollbar {
    display: none;
}


.main-container {
    height: 100%;
    overflow: hidden;
    background-color: #121212;
}

body::-webkit-scrollbar {
    display: none;
}

.loader-top {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9999;
}

</style>
