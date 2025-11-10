
<template>
  <v-app style="overflow: hidden;">

    <Header v-if="accessToken" style="background-color: #121212; color: white;"></Header>

    

    <v-main v-if="$route.name!='users'" class="bg-black">



      <router-view></router-view>

    </v-main>
     <v-main v-if="$route.name === 'users'">
      <router-view></router-view>
    </v-main>
    
  </v-app>
</template>

<script>
import { useUserStore } from './stores/userStore';
import { mapState } from 'pinia';
export default{
  data(){
    return{

    }
  },

  computed:{
    ...mapState(useUserStore,['accessToken'])
  }
}
</script>
