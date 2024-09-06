import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  MenuItem,
  ThemeProvider,
  Typography,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import AddIcon from "@mui/icons-material/Add";
import tableTheme from "../theme/TableTheme";
import theme from "../theme/Theme";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import {
  MaterialReactTable,
  createMRTColumnHelper,
  useMaterialReactTable,
} from "material-react-table";
import { confirmAlert } from 'react-confirm-alert'; // Import confirmation dialog
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css for confirmation dialog 


const columnHelper = createMRTColumnHelper();

const columns = [
  columnHelper.accessor("_id", {  // Assuming _id is unique identifier
    header: "ID",
    size: 40,
  }),
  columnHelper.accessor("departmentName", {
    header: "Department Name",
    size: 120,
  }),
  columnHelper.accessor("phoneNumber", {
    header: "Phone Number",
    size: 120,
  }),
  columnHelper.accessor("emailAddress", {
    header: "Email Address",
    size: 220,
  }),
  columnHelper.accessor("departmentHeadID", {
    header: "Department Head",
    size: 150,
    Cell: ({ cell }) => {
      const [name, setName] = useState(null);
      const navigate = useNavigate();

      useEffect(() => {
        const fetchName = async () => {
          try {
            const response = await axios.get(`http://localhost:8070/api/staff/${cell.getValue()}`);
            const firstName = response.data.firstName || 'No data found';
            const lastName = response.data.lastName || '';
            setName(`${firstName} ${lastName}`.trim());
          } catch (error) {
            console.error("Error fetching department head name:", error);
          }
        };
        cell.getValue() && fetchName() ;
      }, [cell]);

      const handleClick = () => {
        navigate('/viewStaff');
        localStorage.setItem("viewId", cell.getValue());
      };

      return (
        <Button onClick={handleClick} variant="text"
          disabled={!name || name === 'No data found'}
          sx={{
            borderRadius: '0px',
            '&:hover': {
              borderBottom: '1px solid',
              borderColor: theme.palette.primary.main,
              boxShadow: 'none',
            }
          }}
        >
          {name || "No data"}
        </Button>
      );
    },
  }),
  columnHelper.accessor("operatingHours", {
    header: "Operating Hours",
  }),
];

const DepartmentApp = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8070/api/departments");
      setData(response.data);
    } catch (error) {
      toast.error("Failed to fetch departments");
    }
  };

  const handleExportRows = (rows) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save("departments.pdf");
  };

  const handleUpdate = (id) => {
    navigate(`/addDepartment`);
    localStorage.setItem("editId", id);
  };

  const gotoViewPage = (id) => {
    navigate('/viewDepartment');
    localStorage.setItem("viewId", id);
  };

  const handleDelete = async (id) => {
    confirmAlert({
      title: 'Confirm to Delete',
      message: "Are you sure you want to delete this department?",
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              // Call the delete API
              await axios.delete(`http://localhost:8070/api/departments/${id}`);
              toast.success("Department deleted successfully");
              fetchData();
            } catch (error) {
              toast.error('Failed to delete department');
              console.error(error);
            }
          }
        },
        {
          label: 'No',
          onClick: () => toast.info('Deletion canceled')
        }
      ]
    });
  };

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    enableRowActions: true,
    enableColumnFilters: true,
    enableColumnFilterModes: true,
    positionActionsColumn: "last",
    renderRowActionMenuItems: ({ row }) => [
      <MenuItem key="view" onClick={() => gotoViewPage(row.original._id)}>
        View
      </MenuItem>,
      <MenuItem key="edit" onClick={() => handleUpdate(row.original._id)}>
        Edit
      </MenuItem>,
      <MenuItem key="delete" onClick={() => handleDelete(row.original._id)}>
        Delete
      </MenuItem>,
    ],
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
          startIcon={<FileDownloadIcon />}
        >
          Export All Rows
        </Button>
        <Button
          disabled={table.getRowModel().rows.length === 0}
          onClick={() => handleExportRows(table.getRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Page Rows
        </Button>
        <Button
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Selected Rows
        </Button>
      </Box>
    ),
  });

  const handleAddNew = () => {
    localStorage.removeItem('editId');
    navigate("/addDepartment");
  };

  return (
    <div style={{ paddingTop: '20px' }}>
      <Card
        sx={{
          width: "97%",
          marginLeft: "auto",
          marginRight: "auto", 
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              fontSize: "2rem",
              marginLeft: "25px",
              marginTop: "20px",
            }}
          >
            Departments
          </Typography>

          <ThemeProvider theme={theme}>
            <Button onClick={handleAddNew} startIcon={<AddIcon />}>
              Add New
            </Button>
          </ThemeProvider>
        </div>
        <ThemeProvider theme={tableTheme}>
          <MaterialReactTable table={table} />
        </ThemeProvider>
      </Card>
    </div>
  );
};

export default DepartmentApp;
