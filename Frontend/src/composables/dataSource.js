import { ref, computed } from "vue";
import CustomStore from "devextreme/data/custom_store";
import api from "../plugins/api";
import Swal from 'sweetalert2'

import ExcelJS from "exceljs";
import { exportDataGrid } from "devextreme/excel_exporter";
import { saveAs } from "file-saver";

import DataGrid from "devextreme/ui/data_grid";

const { Workbook } = ExcelJS;


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

const onExporting = async (e) => {
  const selectedData = e.component.getSelectedRowsData();

  if (!selectedData.length) {
    await Swal.fire({
      icon: "info",
      title: "No rows selected",
      text: "Please select at least one row to export.",
      confirmButtonText: "OK",
    });
    e.cancel = true;
    return;
  }

  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet("Selected Rows");

  const columns = Object.keys(selectedData[0]);
  worksheet.addRow(columns);

  selectedData.forEach((row) => {
    worksheet.addRow(columns.map((col) => row[col]));
  });

  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.font = { name: "Arial", size: 12 };
      cell.alignment = { horizontal: "left" };
    });
  });

  try {
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: "application/octet-stream" }), "SelectedRows.xlsx");

    Swal.fire({
      icon: "success",
      title: "Exported successfully",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Export failed",
      text: err.message || "",
    });
  }
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

  const getDataGridRefName = (ref_name) => {
    return (dataGridRefName.value = "dataGrid_" + ref_name);
  };

  const refName = computed(() => {
    return getDataGridRefName(refKey.value);
  });

  const dxGrid = computed(() => {
    return dataGridRefName ? dataGridRefName.value.instance : null;
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
    getDataGridRefName,
    onExporting,

  
    isMobile,



  };
}
