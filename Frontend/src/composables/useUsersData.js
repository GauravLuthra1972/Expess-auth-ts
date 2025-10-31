import { ref, computed } from "vue";
import CustomStore from "devextreme/data/custom_store";
import api from "../plugins/api";

export default function useUsersData() {
  const Loader = ref(true);


  const paginationOption = {
    visible: true,
    displayMode: "compact",
    allowedPageSizes: [5, 10, 20],
    showPageSizeSelector: true,
    showInfo: true,
  };

  const dataSource = new CustomStore({
    key:"id",
     load: async (loadOptions) => {
      console.log(loadOptions)
    const skip = loadOptions.skip ?? 0;
    const take = loadOptions.take ?? 10;
    const sort = JSON.stringify(loadOptions.sort || []);
    try {
      const response = await api.get("/users", { params: { skip, take, sort } });

        const data = response.data.data.map((user) => ({
          ...user,
          created_at: new Date(user.created_at).toLocaleDateString(),
          profile_pic: user.profile_pic || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        }));

        if (Loader.value) Loader.value = false;
        return { data, totalCount: response.data.totalCount ?? 0 };
      } catch (error) {
        if (Loader.value) Loader.value = false;
        return { data: [], totalCount: 0 };
      }
    },
    remove: async (key) => {
      console.log(key)
      await api.delete(`/users/deletebyid/${key}`);
      return true;
    },
    update: async (key, values) => {

      const payload = {
        id: key,
        name: values.name,
        username: values.username ,
        email: values.email,
        role: values.role 
      };
      console.log(payload)

      await api.put("/users/adminupdate", payload);
      return true;
    }
    ,
  });


  return {

    dataSource,
    paginationOption,
    Loader,
  
  };
}
