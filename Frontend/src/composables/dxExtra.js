import dataSource from "./dataSource";
const usersData = dataSource("/users", {}, "/users/adminupdate", "/users/deletebyid");

export default function dxExtra() {

    const formatDate = (rowData) => {
        if (!rowData.created_at) return "";
        const date = new Date(rowData.created_at);
        return date.toLocaleDateString("en-In");
    };

    const refreshTableData = () => {
        console.log("refreshing")

        usersData.refreshTable(usersData.dataGridRef);
    };

    return {
        formatDate,
        refreshTableData
    }


}