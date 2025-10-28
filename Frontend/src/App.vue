
<template>
  <v-app>

    <Header v-if="accessToken"></Header>
    

    <v-main class="bg-black">



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
