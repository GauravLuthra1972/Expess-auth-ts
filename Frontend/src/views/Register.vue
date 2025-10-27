<template>


    <v-container class="d-flex align-center justify-center h-100">

        <v-card class="bg-black" style="width: 100%; max-width: 500px;" >

            <v-form>
                <div class="text-center mb-4">
                    <h1 class="text-white">{{ !flag? 'Login':'Signup' }}</h1>
                </div>

                <div class="d-flex " style="gap: 10px;" v-if="flag">
                    <v-text-field label="First Name" ></v-text-field>
                    <v-text-field label="Last Name"></v-text-field>
                
                </div>
                  <v-text-field label="Username" v-model="username"></v-text-field>
            <v-text-field label="Password" v-model="pass"></v-text-field>

                <div v-if="flag">

              

                
                <v-text-field label="Confirm Password"></v-text-field>
            </div>

          


            <div class="d-flex align-center flex-column " style="gap: 10px;">
            <v-btn variant="flat" @click="!flag?onlogin({username,pass}):onregister({username,pass}) " width="80%" color="primary" rounded >{{ !flag? "Login" : "Signup" }}</v-btn>
            <p style="cursor: pointer;" @click="toggle">{{ !flag?"New to Site? Register now": "Already have an account? Login" }}</p>
            </div>


            
            </v-form>
            


        </v-card>
    </v-container>

</template>

<script>
import { mapActions,mapState } from 'vuex';


export default{
    data(){
        return{
            username:"",
            pass:""
        }
    },

    computed:{
        ...mapState(['flag'])
    },
   


    methods:{

        ...mapActions(['onlogin','onregister','toggle']),
      
        

      
    }
}
</script>