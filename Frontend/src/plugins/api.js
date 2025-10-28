import axios from 'axios'
import { useUserStore } from '../stores/userStore'

const api = axios.create({
  baseURL: 'http://localhost:8080', 
})

api.interceptors.request.use((config)=>{
  const userStore=useUserStore()

  const token=userStore.accessToken
  if(token){
    config.headers.Authorization= `Bearer ${token}`
  }
  return config

})

export default api


// api.interceptors.response.use(
//   response => {
//     console.log("Interceptor");
//     return response;
//   },
//   async error => {
//     const originalRequest = error.config;

//     if (error.response && error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {

//         const newAccessToken = await store.dispatch('refreshAccessToken');

//         if (newAccessToken) {
//           originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//           return api(originalRequest);
//         }
//       } catch (refreshError) {
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );
