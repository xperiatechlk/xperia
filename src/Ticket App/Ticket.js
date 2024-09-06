import React, { useState, useEffect } from "react";
import { Box, Button, Card, MenuItem, ThemeProvider, Typography } from '@mui/material';
import {
    MaterialReactTable,
    createMRTColumnHelper,
    useMaterialReactTable,
} from 'material-react-table';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { jsPDF } from 'jspdf'; //or use your library of choice here
import autoTable from 'jspdf-autotable';
import tableTheme from "../theme/TableTheme";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert'; // Import confirmation dialog
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css for confirmation dialog 
import dayjs from 'dayjs';


// Column definitions
const columnHelper = createMRTColumnHelper();
const columns = [
    columnHelper.accessor('_id', {
        header: 'ID',
        size: 40,
    }),
    columnHelper.accessor('customerID', {
        header: 'Customer ID',
        size: 120,
    }),
    columnHelper.accessor('issueDescription', {
        header: 'Issue Description',
        size: 300,
    }),
    columnHelper.accessor('status', {
        header: 'Status',
    }),
    columnHelper.accessor('createdDate', {
        header: 'Created Date',
        size: 220,
        cell: info => dayjs(info.getValue()).format('YYYY-MM-DD HH:mm'), // Format the date
    }),
    columnHelper.accessor('appointmentDate', {
        header: 'Appointment Date',
        cell: info => dayjs(info.getValue()).format('YYYY-MM-DD HH:mm'), // Format the date
    }),
];

const TicketApp = () => {
    const user = JSON.parse(localStorage.getItem('staff'))
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8070/api/tickets');
                if (user?.role == 'admin') {
                    setData(response.data);
                } else {
                    setData(response.data.filter((item) => item.departmentID == user?.departmentID))
                }
            } catch (error) {
                toast.error('Error fetching tickets.');
                console.error('Error fetching tickets:', error);
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

        doc.save('tickets.pdf');
    };

    const gotoView = (id) => {
        localStorage.setItem('ticketId', id)
        navigate('/viewTicket')
    }

    const gotoEdit = (id) => {
        localStorage.setItem('ticketId', id)
        navigate('/editTicket')
    }
    const gotoSolve = (id) => {
        localStorage.setItem('ticketId', id)
        navigate('/solveTicket')
    }

    const deleteTicket = (id) => {
        confirmAlert({
            title: 'Confirm to Delete',
            message: 'Are you sure you want to delete this ticket?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            // Call the delete API
                            await axios.delete(`http://localhost:8070/api/tickets/${id}`);
                            toast.success('Ticket deleted successfully');
                            setData(prevTickets => prevTickets.filter(ticket => ticket._id !== id));
                        } catch (error) {
                            toast.error('Failed to delete ticket');
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
            row.original.status != 'Solved' && <MenuItem key="solve" onClick={() => gotoSolve(row.original._id)}>
                Solve Ticket
            </MenuItem>,
            <MenuItem key="view" onClick={() => gotoView(row.original._id)}>
                View
            </MenuItem>,
            <MenuItem key="edit" onClick={() => gotoEdit(row.original._id)}>
                Edit
            </MenuItem>,
            <MenuItem key="delete" onClick={() => deleteTicket(row.original._id)}>
                Delete
            </MenuItem>,
        ].filter(Boolean),
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

    return (
        <>
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
                            Tickets
                        </Typography>
                    </div>
                    <ThemeProvider theme={tableTheme}>
                        <MaterialReactTable table={table} />
                    </ThemeProvider>
                </Card>
            </div>
            <ToastContainer />
        </>
    );
};

export default TicketApp;
