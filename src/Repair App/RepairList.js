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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import dayjs from "dayjs";
import moment from "moment";
import { API_URL } from "../Constent/Constent";

const columnHelper = createMRTColumnHelper();
const columns = [
    columnHelper.accessor("date", {
        header: "Date",
        size: 120,
        Cell: ({ cell }) => {
            return (
                <div>{moment(cell.getValue()).format('YYYY-MM-DD HH:mm')}</div>
            );
        },
    }),
    columnHelper.accessor("name", {
        header: "Name",
        size: 120,
    }),
    columnHelper.accessor("deviceType", {
        header: "Device Type",
        size: 120,
    }),
    columnHelper.accessor("fault", {
        header: "Fault",
        size: 150,
    }),
    columnHelper.accessor("contactNumber", {
        header: "Contact Number",
        size: 130,
    }),
    columnHelper.accessor("price", {
        header: "Price",
        size: 100,
        Cell: ({ cell }) => {
            return (
                <div>Rs. {cell.getValue()}.00</div>
            );
        },
    }),
    columnHelper.accessor("status", {
        header: "Status",
        size: 100,
        Cell: ({ cell }) => {
            const status = cell.getValue();
            return (
                <span
                    style={{
                        color:
                            status === "Pending"
                                ? "orange"
                                : status === "Done"
                                    ? "green"
                                    : "blue",
                    }}
                >
                    {status}
                </span>
            );
        },
    }),
];

const RepairList = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(API_URL +"/repairs");
                setData(response.data);
            } catch (error) {
                console.error("Error fetching repair data:", error);
                toast.error("Error fetching repair data");
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

        doc.save('repairs-pdf-export.pdf');
    };

    const gotoViewPage = (id) => {
        navigate('/viewRepair');
        localStorage.setItem("viewId", id);
    };

    const handleUpdate = (id) => {
        navigate(`/addRepair`);
        localStorage.setItem("editId", id);
    };

    const handleDelete = async (id) => {
        confirmAlert({
            title: 'Confirm to Delete',
            message: "Are you sure you want to delete this repair?",
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await axios.delete(API_URL +`/repairs/${id}`);
                            toast.success("Repair deleted successfully");
                            setData(prevData => prevData.filter(repair => repair._id !== id));
                        } catch (error) {
                            toast.error('Failed to delete repair');
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
        navigate('/addRepair', {});
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
                        Repair List
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

export default RepairList;
