
import { createRouter,createWebHistory } from "vue-router";
import Register from "../views/Register.vue";

import Users from "../views/Users.vue";



const routes=[
    {
        path:"/register",
        name:"register",
        component:Register
    },

    {
        path:"/users",
        name:"users",
        component:Users
    }
]

const router=createRouter({
    history:createWebHistory(),
    routes
})


export default router