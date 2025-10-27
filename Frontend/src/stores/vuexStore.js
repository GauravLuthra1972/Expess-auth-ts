import { createStore } from "vuex";
import createPersistedState from 'vuex-persistedstate'
import api from "../plugins/api";
import Swal from "sweetalert2";
import router from "../routes/router";


const store = createStore({
    state: {
        user: null,
        accessToken: null,
        refreshToken: null,
        users1: [],
        flag: true
    },

    mutations: {
        setuser(state, user) {
            state.user = user
        },
        setaccess(state, access) {
            state.accessToken = access
        }
        ,
        setrefresh(state, refresh) {
            state.refreshToken = refresh
        },
        setusers(state, obj) {
            state.users1.push(obj)
        },
        setToggle(state) {
            state.flag = !state.flag
        },
        delUser(state, id) {
            state.users1 = state.users1.filter(item => item.id != id)

        },

        setsave(state,data){
            console.log("setsave run")
            console.log(data.id)
            console.log(data.name)
            console.log(data.username)
            console.log(data.email)
            

            const index=state.users1.findIndex(item=> item.id==data.id)

            console.log("index",index)

            state.users1[index]=data







            

        }
        ,
        logoutmut(state){
            state.user=null
            state.accessToken=null
            state.refreshToken=null
        }
    },

    actions: {
        toggle({ commit }) {
            commit('setToggle')
            console.log("flagchnaged")
        },
        onlogin({ commit, state, dispatch }, obj) {
            const { username, pass } = obj

            api.post('/login', {
                username: username,
                password: pass
            })

                .then(({ data }) => {
                    console.log(data.accessToken)

                    const flag = state.users1.some(item => item.id == data.id)
                    console.log(flag)

                    if (flag) {
                        commit('setuser', data),
                        commit('setaccess', data.accessToken)
                        commit('setrefresh', data.refreshToken)
                        router.push("/users")
                    }

                    else {
                        Swal.fire({
                            icon: 'error',
                            title: 'User not registered',
                            text: 'Please register first.',
                        });

                        dispatch('toggle')

                    }




                })


        },

        onregister({ commit, state, dispatch }, obj) {

            const { username, pass } = obj

            api.post("/login", {
                username: username,
                password: pass
            })
                .then(({ data }) => {

                    const flag = state.users1.some(item => item.id == data.id)
                    console.log(flag)

                    if (flag) {
                        alert("User is already Registered!Login ")
                        dispatch('toggle')
                    }

                    else {
                        console.log(data)
                        commit('setusers', { id: data.id, name: data.firstName + " " + data.lastName, email: data.email, username: data.username })
                        commit('setuser', data),
                        commit('setaccess', data.accessToken)
                        commit('setrefresh', data.refreshToken)
                        router.push("/users")


                    }
                })

        },


        deleteUser({ commit }, id) {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger"
                },
                buttonsStyling: false
            });
            swalWithBootstrapButtons.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    commit('delUser',id)
                    swalWithBootstrapButtons.fire({
                        title: "Deleted!",
                        text: "Your Account has been deleted.",
                        icon: "success"
                    });
                } else if (

                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    swalWithBootstrapButtons.fire({
                        title: "Cancelled",
                        text: "Your account is safe",
                        icon: "error"
                    });
                }
            });

        },

         logout({commit}){
        
        commit('logoutmut')
        router.push("/register")

    }


    },

   
    
    getters:{
        getaccess(state){
            return state.accessToken
        }

    },

    plugins: [createPersistedState()]
})


export default store