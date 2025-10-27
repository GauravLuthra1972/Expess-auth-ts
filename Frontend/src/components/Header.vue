<template>
    <v-app-bar :elevation="2">
        <v-app-title>Eval Prac</v-app-title>

        <v-spacer></v-spacer>

        <v-list class="d-flex">
            <v-list-item to="/register">Register</v-list-item>
            <v-list-item to="/users"> Users</v-list-item>
            <v-list-item v-if="getaccess!=null" @click="logout">Logout</v-list-item>
            
        </v-list>
    </v-app-bar>
</template>


<script>
import { mapGetters,mapActions} from 'vuex';

export default{
    computed:{
        ...mapGetters(['getaccess'])
    },
    methods:{
        ...mapActions(['logout'])
    }
}
</script>