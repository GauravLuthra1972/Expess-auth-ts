<template>
    <v-app-bar :elevation="2">
        <v-app-title class="px-15 text-h5">Auth</v-app-title>

        <v-spacer></v-spacer>

        <v-list class="d-flex ga-4 px-15">
            <v-list-item to="/users">Users</v-list-item>

            <v-menu offset-y>
                <template #activator="{ props }">
                    <v-btn v-bind="props" icon>
                        <v-avatar>
                            <v-img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" />
                        </v-avatar>
                    </v-btn>
                </template>

                <v-list>

                    <v-list-item>
                        <v-list-item-title>{{ name }}</v-list-item-title>
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
    </v-app-bar>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { useUserStore } from '../stores/userStore';
import axios from 'axios';

export default {

    data() {
        return {
            name:""

        }
    },
    methods: {
        ...mapActions(useUserStore, ['logout']),

        async getdata(){
            const {data}=await this.$api.post("/userinfo",{token:this.accessToken})
            console.log(data.info)
            this.name=data.info.name
            


        },
        editAccount() {
            alert('Edit account clicked')
        },
        deleteAccount() {
            alert('Delete account clicked')
        }

    },
    computed: {
        ...mapState(useUserStore, ['accessToken']),



    },
    mounted(){
        this.getdata()
        
    }
}
</script>
