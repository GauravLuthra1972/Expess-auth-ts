
import { createRouter,createWebHistory } from "vue-router";
import Register from "../views/Register.vue";
import Vuex from "../views/Users.vue";
import Users from "../views/Users.vue";
import store from "../stores/vuexStore";


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

router.beforeEach((to,from,next)=>{
    const flag=store.getters.getaccess!=null

    if(flag && to.name=='register'){
        return next({name:'users'})
    }
    else if(!flag && to.name=='users'){
        return next({name:'register'})
    }

    next()

})
export default router