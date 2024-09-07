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

const columnHelper = createMRTColumnHelper();
const columns = [
    columnHelper.accessor("itemName", {
        header: "Name",
        size: 120,
    }),
    columnHelper.accessor("category", {
        header: "Category",
        size: 120,
    }),
    columnHelper.accessor("quantity", {
        header: "Quantity",
        size: 100,
        Cell: ({ cell }) => {
            return (
                <div style={{ color: cell.getValue() < 5 && '#ff0000' }}>{cell.getValue()}</div>
            );
        },
    }),
    columnHelper.accessor("unitPrice", {
        header: "Unit Price",
        size: 100,
        Cell: ({ cell }) => {
            return (
                <div>Rs. {cell.getValue()}.00</div>
            );
        },
    }),
    columnHelper.accessor("sellingPrice", {
        header: "Selling Price",
        size: 120,
        Cell: ({ cell }) => {
            return (
                <div>Rs. {cell.getValue()}.00</div>
            );
        },
    }),
    columnHelper.accessor("description", {
        header: "Description",
        size: 200,
    }),
];

const ItemList = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8070/api/items");
                setData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Error fetching items");
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

        doc.save('items-pdf-export.pdf');
    };

    const gotoViewPage = (id) => {
        navigate('/viewItem');
        localStorage.setItem("viewId", id);
    };

    const handleUpdate = (id) => {
        navigate(`/addItem`);
        localStorage.setItem("editId", id);
    };

    const handleDelete = async (id) => {
        confirmAlert({
            title: 'Confirm to Delete',
            message: "Are you sure you want to delete this item?",
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await axios.delete(`http://localhost:8070/api/items/${id}`);
                            toast.success("Item deleted successfully");
                            setData(prevData => prevData.filter(item => item._id !== id));
                        } catch (error) {
                            toast.error('Failed to delete item');
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
        navigate('/addItem', {});
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
                        Item List
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
            </Card>
        </div>
    );
};

export default ItemList;
