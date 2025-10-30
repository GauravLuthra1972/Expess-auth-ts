import { createRouter, createWebHistory } from "vue-router";
import Register from "../views/Register.vue";
import Users from "../views/Users.vue";
import MyPosts from "../views/MyPosts.vue";
import Posts from "../views/Posts.vue";
import { useUserStore } from "../stores/userStore";

const routes = [
    { path: "/", name: "register", component: Register },
    { path: "/users", name: "users", component: Users, meta: { requiresAuth: true } },
    { path: "/posts", name: "posts", component: Posts, meta: { requiresAuth: true } },
    { path: "/myposts", name: "myposts", component: MyPosts, meta: { requiresAuth: true } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    const accessToken = userStore.accessToken;
    const role = userStore.user?.role;
    console.log(userStore.user)
    console.log(accessToken)
    console.log(role)


    if (to.meta.requiresAuth && !accessToken) {
        return next({ name: "register" });
    }


    if (accessToken) {
        if (role == "admin") {
            if (to.name === "register") {
                return next({ name: "users" });
            }
            return next();
        }

        else if (role == "user") {
            if (to.name === "users" || to.name === "register") {
                return next({ name: "posts" });
            }
            return next();
        }
    }


    next();
});

export default router;