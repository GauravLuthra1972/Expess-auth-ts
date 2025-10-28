
import { createRouter,createWebHistory } from "vue-router";
import Register from "../views/Register.vue";

import Users from "../views/Users.vue";
import { useUserStore } from "../stores/userStore";


const routes=[
    {
        path:"/",
        name:"register",
        component:Register
    },

    {
        path:"/users",
        name:"users",
        component:Users,
        meta:{requiresAuth:true}
    }
]

const router=createRouter({
    history:createWebHistory(),
    routes
})

router.beforeEach((to,from,next)=>{
    const userStore=useUserStore()
    const accessToken=userStore.accessToken
    console.log(accessToken)

    if(to.meta.requiresAuth && !accessToken){
        next({name:"register"})
    }
   else if ((to.name === "register" || to.path === "/") && accessToken) {
    next({ name: "users" });
  }
    else{
        next();
    }


})

export default router