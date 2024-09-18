import React, { useEffect, useState } from "react";
import {
    MaterialReactTable,
    createMRTColumnHelper,
    useMaterialReactTable,
} from 'material-react-table';
import { Box, Button, Card, MenuItem, ThemeProvider, Typography, Input, IconButton } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile'; // Icon for bulk upload
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'; // Icons for show/hide
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

const ItemList = () => {
    const [data, setData] = useState([]);
    const [bulkFile, setBulkFile] = useState(null); // Store the file for bulk insert
    const [priceVisibility, setPriceVisibility] = useState([]); // Track unit price visibility for each row
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("staff"));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(API_URL + "/items");
                setData(response.data);
                setPriceVisibility(response.data.map(() => false)); // Set initial visibility to false for all rows
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Error fetching items");
            }
        };
        fetchData();
    }, []);

    const handleTogglePriceVisibility = (index) => {
        const newVisibility = [...priceVisibility];
        newVisibility[index] = !newVisibility[index]; // Toggle the visibility of the specific row
        setPriceVisibility(newVisibility);
    };

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
                            await axios.delete(API_URL + `/items/${id}`);
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

    const handleBulkFileChange = (event) => {
        setBulkFile(event.target.files[0]);
    };

    const handleBulkInsert = async () => {
        if (!bulkFile) {
            toast.error("Please select a file for bulk insert.");
            return;
        }

        const formData = new FormData();
        formData.append("file", bulkFile);

        try {
            await axios.post(API_URL + "/items/bulk", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Bulk insert successful!");
            // Fetch updated data after bulk insert
            const response = await axios.get(API_URL + "/items");
            setData(response.data);
        } catch (error) {
            toast.error("Bulk insert failed.");
            console.error("Bulk insert error:", error);
        }
    };

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
            size: 150,
            Cell: ({ cell, row }) => {
                const index = row.index;  
                const price = cell.getValue();
                const isAdmin = user?.role === 'admin';
                return (
                    isAdmin ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <span>{priceVisibility[index] ? `Rs. ${price}.00` : '****'}</span>
                            <IconButton
                                onClick={() => handleTogglePriceVisibility(index)}
                                size="small"
                                sx={{ marginLeft: '8px' }}
                            >
                                {priceVisibility[index] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                        </Box>
                    ) : (
                        <div>******</div>
                    )
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Button
                                onClick={() => handleAddNew()}
                                startIcon={<AddIcon />}
                            >
                                Add New
                            </Button>

                            {/* Bulk Insert Button */}
                            <Input
                                type="file"
                                onChange={handleBulkFileChange}
                                sx={{ display: 'none' }}
                                id="bulk-insert-file"
                            />
                            <label htmlFor="bulk-insert-file">
                                <Button
                                    component="span"
                                    startIcon={<UploadFileIcon />}
                                >
                                    Bulk Insert
                                </Button>
                            </label>
                            <Button
                                onClick={handleBulkInsert}
                                startIcon={<UploadFileIcon />}
                                color="primary"
                                variant="contained"
                            >
                                Submit Bulk Insert
                            </Button>
                        </div>
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

export default ItemList;
