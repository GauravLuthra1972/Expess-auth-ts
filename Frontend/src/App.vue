<template>
  <v-app style="overflow: hidden; background-color: #121212;">
    
    <!-- Header stays fixed on top -->
    <Header
      v-if="accessToken"
      app
      fixed
      style="background-color: #121212; color: white;"
    />

    <!-- Main content area below header -->
    <v-main class="bg-black">
      <router-view></router-view>
    </v-main>

  </v-app>
</template>

<script>
import { useUserStore } from './stores/userStore'
import { mapState } from 'pinia'

export default {
  computed: {
    ...mapState(useUserStore, ['accessToken'])
  }
}
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  overflow: hidden;
  background-color: #121212;
}
.v-main {
  overflow-y: auto;
}
</style>
