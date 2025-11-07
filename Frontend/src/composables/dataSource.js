import { ref, computed } from "vue";
import CustomStore from "devextreme/data/custom_store";
import api from "../plugins/api";
import Swal from 'sweetalert2'
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
const { Workbook } = ExcelJS;
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { exportDataGrid } from "devextreme/excel_exporter";



const isNotEmpty = (value) => {
  return value !== undefined && value !== null && value !== "";
};

export default function dataSource(
  url,
  params = {},
  updateURL = null,
  deleteURL = null,
  customRefName = null
) {
  const skipLoader = ref(true);
  
  const dataGridRef = ref(null);
  const refKey = ref("dataGrid");
  const dateFormat = "MM/dd/yyyy";

  const paginationOption = {
    visible: true,
    displayMode: "compact",
    allowedPageSizes: [5, 10, 20],
    childAllowedPageSizes: [3, 8, 15],
    showPageSizeSelector: true,
    showInfo: true,
    showNavigationButton: true,
  };

  const store = new CustomStore({
    byKey: async (key) => {
      try {
        console.log("bykey357")
        const response = await api.get(`${url}?id=${key}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching by key:", error);
        throw new Error("Error fetching record");
      }
    },

    load: async function (loadOptions) {
      console.log("load running esfgrds")
      const dxKeys = ["skip", "take", "requireTotalCount", "requireGroupCount", "sort", "filter"];
      let queryParams = { ...params };


      Object.keys(params).forEach((key) => {
        if (dxKeys.includes(key)) delete queryParams[key];
      });


      dxKeys.forEach((key) => {
        if (key in loadOptions && isNotEmpty(loadOptions[key])) {
          queryParams[key] = JSON.stringify(loadOptions[key]);
        }
      });

      console.log("Query Params:", queryParams);

      try {
        const response = await api.get(url, { params: queryParams });
        console.log(response)
        if (skipLoader.value) skipLoader.value = false;

        return {
          data: response.data.data || [],
          totalCount: response.data.totalCount ?? 0,
          summary: response.data.summary || [],
        };
      } catch (error) {
        console.error("Error loading data:", error);
        if (skipLoader.value) skipLoader.value = false;
        throw new Error("Data Loading Error");
      }
    },

   insert: async (values) => {
    console.log("called")
    if (!values.name || !values.username || !values.email || !values.password) {
      Swal.fire({
        icon: "warning",
        title: "All fields are required",
        showConfirmButton: true
      });
      throw new Error("Validation failed");
    }


    try {
      const response = await api.post("/auth/register", {
        name: values.name,
        username: values.username,
        email: values.email,
        password: values.password,
        role: values.role
      });

    
      Swal.fire({
        icon: "success",
        title: "User added successfully",
        timer: 2000,
        showConfirmButton: false
      });

      return response.data;
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Failed to add user",
        text: error.response?.data?.message || error.message || "",
      });
      throw error;
    }
  },

    update: async (key, values) => {

      console.log("updating")
      console.log(key)

      if (!updateURL) throw new Error("Update URL not provided");
      try {
        const payload = { id: key, ...values };
        await api.put(updateURL, payload);
        return true;
      } catch (error) {
        console.error("Error updating record:", error);
        throw new Error("Error updating record");
      }
    },

    remove: async (key) => {
      console.log("deleting")
      if (!deleteURL) throw new Error("Delete URL not provided");
      try {
        await api.delete(`${deleteURL}/${key}`);
        return true;
      } catch (error) {
        console.error("Error deleting record:", error);
        throw new Error("Error deleting record");
      }
    },
  });
  //    const onExporting = (e) => {
    
  //   const workbook = new Workbook();
  //   const worksheet = workbook.addWorksheet("Main sheet");
  //   exportDataGrid({
  //     component: e.component,
  //     worksheet,
  //     customizeCell: function (options) {
  //       options.excelCell.font = { name: "Arial", size: 12 };
  //       options.excelCell.alignment = { horizontal: "left" };
  //     },
  //   }).then(function () {
  //     workbook.xlsx.writeBuffer().then(function (buffer) {
  //       saveAs(
  //         new Blob([buffer], { type: "application/octet-stream" }),
  //         "DataGrid.xlsx",
  //       );
  //     });
  //   });
  // };

  const onExporting = async (e) => {
    const result = await Swal.fire({
      title: "Export Options",
      text: "Choose what you want to export",
      icon: "question",
      showDenyButton: true,
      confirmButtonText: "Export Selected",
      denyButtonText: "Export All",

    });

    if (result.isDismissed) return;


    let exportData = [];

    if (result.isConfirmed) {
      const selectedData = e.component.getSelectedRowsData();
      if (!selectedData.length) {
        await Swal.fire({
          icon: "info",
          title: "No rows selected",
          text: "Please select at least one row to export.",
          confirmButtonText: "OK",
        });
        return;
      }
      exportData = selectedData;
    } else if (result.isDenied) {
      try {
        const response = await api.get("/users");
        exportData = response.data.rows || [];
        if (!exportData.length) {
          await Swal.fire({
            icon: "info",
            title: "No users found",
            text: "There are no users to export.",
          });
          return;
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Failed to fetch all users",
          text: err.message || "",
        });
        return;
      }
    }

    const formatResult = await Swal.fire({
      title: "Choose Export Format",
      icon: "question",
      showDenyButton: true,
      confirmButtonText: "Export to PDF",
      denyButtonText: "Export to Excel",
    });
    if (formatResult.isDismissed) return;

    if (formatResult.isConfirmed) {
      const doc = new jsPDF();
      const columns = Object.keys(exportData[0]);
      const rows = exportData.map(row => columns.map(col => row[col]));

      autoTable(doc, {
        head: [columns],
        body: rows,
        styles: { font: "helvetica", fontSize: 5, halign: "left" },
      });

      const fileName = result.isConfirmed ? "SelectedRows.pdf" : "AllUsers.pdf";
      doc.save(fileName);
    } else if (formatResult.isDenied) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Main Sheet");

      const columns = Object.keys(exportData[0]);
      worksheet.addRow(columns);
      exportData.forEach((row) =>
        worksheet.addRow(columns.map((col) => row[col]))
      );

      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.font = { name: "Arial", size: 12 };
          cell.alignment = { horizontal: "left" };
        });
      });

      try {
        const buffer = await workbook.xlsx.writeBuffer();
        const fileName = result.isConfirmed ? "SelectedRows.xlsx" : "AllUsers.xlsx";
        saveAs(
          new Blob([buffer], { type: "application/octet-stream" }),
          fileName
        );
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Export failed",
          text: err.message || "",
        });
        return;
      }
    }

    Swal.fire({
      icon: "success",
      title: "Exported successfully",
      timer: 1500,
      showConfirmButton: false,
    });
  };


  const refreshTable = (dataGridRef, changedOnly = false) => {
    if (!dataGridRef) {
      console.error("DataGrid ref not provided.");
      return;
    }
    const dataGrid = dataGridRef.value.instance;
    if (!dataGrid) {
      console.error("DataGrid instance not found.");
      return;
    }

    dataGrid.refresh(changedOnly);
  };


  const refName = computed(() => {
    return getDataGridRefName(refKey.value);
  });



  const isMobile = computed(() => {
    return window.innerWidth <= 768;
  });


  return {
    dataGridRef,
    refKey,
    skipLoader,
    store,
    dateFormat,
    paginationOption,
    refName,
    refreshTable,
    onExporting,
    isMobile,
  };
}
