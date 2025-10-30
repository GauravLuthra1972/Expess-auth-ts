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

api.interceptors.response.use(
  response => response,
  async error => {
    
  
    console.log("refreshing")
    const userStore = useUserStore();
      console.log(userStore.isRemember)

      if(!userStore.isRemember){
        userStore.logout();
      }

      else{
        const originalRequest = error.config;
    

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await api.post("/auth/refresh", { refreshtoken: userStore.refreshToken });
        userStore.setTokens(data.accesstoken, data.refreshtoken);
        originalRequest.headers.Authorization = `Bearer ${data.accesstoken}`;
        return api(originalRequest);
      } catch {
        userStore.logout();
        return Promise.reject(error);
      }
    }


      }
    
    return Promise.reject(error);
  }
);



export default api


