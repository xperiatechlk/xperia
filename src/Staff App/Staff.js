
import React, { useEffect, useState } from "react";
import {
    MaterialReactTable,
    createMRTColumnHelper,
    useMaterialReactTable,
} from 'material-react-table';
import { Box, Button, Card, MenuItem, ThemeProvider, Typography } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import AddIcon from '@mui/icons-material/Add';
import tableTheme from "../theme/TableTheme";
import theme from "../theme/Theme";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { confirmAlert } from 'react-confirm-alert'; // Import confirmation dialog
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css for confirmation dialog 



const columnHelper = createMRTColumnHelper();
const columns = [
    columnHelper.accessor("_id", {
        header: "ID",
        size: 120,
    }),
    columnHelper.accessor("firstName", {
        header: "First Name",
        size: 120,
    }),
    columnHelper.accessor("lastName", {
        header: "Last Name",
        size: 120,
    }),
    columnHelper.accessor("emailAddress", {
        header: "Email Address",
        size: 200,
    }),
    columnHelper.accessor("phoneNumber", {
        header: "Phone Number",
        size: 150,
    }),
    columnHelper.accessor("role", {
        header: "Role",
        size: 150,
    }),
];


const StaffApp = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8070/api/staff");
                setData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Error fetching staff members");
            }
        };
        fetchData();
    }, []);

    const handleExportRows = (rows) => {
        const doc = new jsPDF();
        const tableData = rows.map((row) => Object.values(row.original));
        const tableHeaders = columns.map((c) => c.header);

        autoTable(doc, {
            head: [tableHeaders],
            body: tableData,
        });

        doc.save('mrt-pdf-example.pdf');
    };

    const gotoViewPage = (id) => {
        navigate('/viewStaff')
        localStorage.setItem("viewId", id)
    };

    const handleUpdate = (id) => {
        navigate(`/addStaff`);
        localStorage.setItem("editId", id);
    };

    const handleDelete = async (id) => {
        confirmAlert({
            title: 'Confirm to Delete',
            message: "Are you sure you want to delete this staff member?",
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            // Call the delete API
                            await axios.delete(`http://localhost:8070/api/staff/${id}`);
                            toast.success("Staff member deleted successfully");
                            setData(prevData => prevData.filter(staff => staff._id !== id));
                        } catch (error) {
                            toast.error('Failed to delete staff member');
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
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        enableRowActions: true,
        positionActionsColumn: 'last',
        enableColumnFilters: true,
        enableColumnFilterModes: true,
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
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
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
        navigate('/addStaff', {});
    };

    return (

        <div style={{ paddingTop: '20px' }}>
            <Card
                sx={{
                    width: '97%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: '20px',
                    marginBottom: '20px',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '2rem',
                            marginLeft: '25px',
                            marginTop: '20px',
                        }}>
                        Staff Members
                    </Typography>

                    <ThemeProvider theme={theme}>
                        <Button
                            onClick={() => handleAddNew()}
                            startIcon={<AddIcon />}
                        >
                            Add New
                        </Button>
                    </ThemeProvider>
                </div>
                <ThemeProvider theme={tableTheme}>
                    <MaterialReactTable table={table} />
                </ThemeProvider>
            </Card >
        </div>
    );
};

export default StaffApp;