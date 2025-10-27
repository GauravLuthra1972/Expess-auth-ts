<template>
    <h1>All users</h1>

    <div class="d-flex flex-wrap  " style="gap: 10px; ">

        <v-card v-for="item in users1" :key="item.id" class="pa-4" style="max-width: 380px;">

            <v-card-text class="text-primary text-h5 text-center">{{ item.name }}</v-card-text>


            <div class="mb-3">
                <strong class="pr-2">Name</strong>
                <span>{{ item.name }}</span>
            </div>


            <div class="mb-3">
                <strong class="pr-2">Username</strong>
                <span>{{ item.username }}</span>
            </div>


            <div class="mb-3">
                <strong class="pr-2">Email</strong>
                <span>{{ item.email }}</span>
            </div>


            <div class="d-flex" style="gap: 10px;">
                <v-btn color="primary" @click="opendialog(item.name, item.email, item.username, item.id)">Edit</v-btn>
                <v-btn color="red-darken-4" @click="deleteUser(item.id)">Delete</v-btn>

            </div>








        </v-card>



        <v-dialog v-model="edit" style="max-width: 500px;">
            <v-card>
                <v-card-title>
                    Edit your Acount
                </v-card-title>

                <v-text-field v-model="name" label="Name"></v-text-field>
                <v-text-field v-model="email" label="Email"></v-text-field>
                <v-text-field v-model="username" label="Username"></v-text-field>


                <v-btn @click="save({ id, name, email, username })">Save Changes</v-btn>
            </v-card>
        </v-dialog>



    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Swal from 'sweetalert2';
import { mapMutations } from 'vuex/dist/vuex.cjs.js';
export default {
    data() {
        return {
            edit: false,
            id: -1,

            name: "",
            email: "",
            username: ""


        }
    },

    computed: {
        ...mapState(['users1'])
    },

    methods: {
        ...mapActions(['deleteUser']),
        ...mapMutations(['setsave']),
        get() {
            console.log(this.users1)
        },

        opendialog(name, email, username, id) {
            this.edit = true
            this.name = name,
                this.email = email,
                this.username = username
            this.id = id

        },
        save(id, name, email, username) {

            this.setsave(id, name, email, username)
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Changes have been saved",
                showConfirmButton: false,
                timer: 1500
            });
            this.edit = false

        }


    },

    mounted() {
        this.get()

    }

}

</script>