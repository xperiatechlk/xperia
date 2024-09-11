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
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { API_URL } from "../Constent/Constent";

const columnHelper = createMRTColumnHelper();
const columns = [
    columnHelper.accessor("date", {
        header: "Date",
        size: 100,
        Cell: ({ cell }) => {
            const date = new Date(cell.getValue()).toLocaleDateString();
            return <div>{date}</div>;
        }
    }),
    columnHelper.accessor("name", {
        header: "Customer Name",
        size: 150,
    }),
    columnHelper.accessor("address", {
        header: "Address",
        size: 200,
    }),
    columnHelper.accessor("itemName", {
        header: "Item Name",
        size: 150,
    }),
    columnHelper.accessor("contactNumber", {
        header: "Contact Number",
        size: 130,
    }),
    columnHelper.accessor("amount", {
        header: "Amount",
        size: 100,
        Cell: ({ cell }) => {
            return <div>Rs. {cell.getValue()}.00</div>;
        },
    }),
    columnHelper.accessor("paymentType", {
        header: "Payment Type",
        size: 120,
    }),
    columnHelper.accessor("bankName", {
        header: "Bank Name",
        size: 120,
        Cell: ({ cell }) => cell.getValue() || 'N/A',
    }),
    columnHelper.accessor("trackingID", {
        header: "Tracking ID",
        size: 150,
        Cell: ({ cell }) => cell.getValue() || 'N/A',
    }),
];

const SalesList = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(API_URL + "/sales");
                setData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching sales data:", error);
                toast.error("Error fetching sales data");
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

        doc.save('sales-pdf-export.pdf');
    };

    const gotoViewPage = (id) => {
        navigate('/viewSale');
        localStorage.setItem("viewId", id);
    };

    const handleUpdate = (id) => {
        navigate(`/addSale`);
        localStorage.setItem("editId", id);
    };

    const handleDelete = async (id) => {
        confirmAlert({
            title: 'Confirm to Delete',
            message: "Are you sure you want to delete this sale?",
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await axios.delete(API_URL + `/sales/${id}`);
                            toast.success("Sale deleted successfully");
                            setData(prevData => prevData.filter(sale => sale._id !== id));
                        } catch (error) {
                            toast.error('Failed to delete sale');
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
        navigate('/addSale', {});
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
                        Sales List
                    </Typography>

                    <ThemeProvider theme={theme}>
                        <Button
                            onClick={() => handleAddNew()}
                            startIcon={<AddIcon />}
                        >
                            Add New Sale
                        </Button>
                    </ThemeProvider>
                </div>
                <ThemeProvider theme={tableTheme}>
                    <MaterialReactTable table={table} />
                </ThemeProvider>
            </Card>
            <ToastContainer />
        </div>
    );
};

export default SalesList;
