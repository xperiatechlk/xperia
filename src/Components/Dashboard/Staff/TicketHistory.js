import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Avatar,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack
} from '@mui/material';
import { Visibility as VisibilityIcon, Edit as EditIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomerDetailsDialog from './CustomerDetailsDialog';

const TicketHistory = ({ tickets }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCustomerID, setSelectedCustomerID] = useState('');
    const [customerData, setCustomerData] = useState({})

    const navigate = useNavigate()

    useEffect(() => {
        const fetchRecentSolvedTickets = async () => {
            try {
                const response = await axios.get(`http://localhost:8070/api/customers/${selectedCustomerID}`);
                setCustomerData(response.data);

            } catch (error) {
                console.error('Error fetching customer data', error);
            }
        };

        fetchRecentSolvedTickets();
    }, [openDialog]);
    console.log(customerData)
    const gotoView = (id) => {
        localStorage.setItem('ticketId', id)
        navigate('/viewTicket')
    }

    const gotoEdit = (id) => {
        localStorage.setItem('ticketId', id)
        navigate('/editTicket')
    }

    const handleCustomerClick = (customerID) => {
        setSelectedCustomerID(customerID);
        setOpenDialog(true);

    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <div style={{ width: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px', textAlign: 'left' }}>
                Recent Solved Ticket
            </Typography>
            {tickets ? (
                <div>
                    {
                        tickets.map((ticket, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '15px',
                                    padding: '15px',
                                    backgroundColor: '#ffffff',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d1d1',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar sx={{ bgcolor: '#9ad6d7', marginRight: '10px' }}>{ticket.issueDescription[0]}</Avatar>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ color: '#9ad6d7', paddingLeft: '8px' }}
                                        >
                                            # {ticket._id}
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{ color: '#9ad6d7', paddingLeft: '8px' }}
                                        >
                                            Title: {ticket.issueDescription}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ paddingLeft: '8px' }}>
                                            Appointment: {new Date(ticket.appointmentDate).toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ paddingLeft: '8px' }}>
                                            Description: {ticket.feedback}
                                        </Typography>
                                        <Button
                                            variant="text"
                                            sx={{ padding: '5px 8px', textTransform: 'none', boxShadow: 'none' }}
                                            onClick={() => handleCustomerClick(ticket.customerID)}
                                        >
                                            Customer ID: {ticket.customerID}
                                        </Button>
                                    </div>
                                </div>
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<CheckCircleIcon />}
                                        color="success"
                                        disabled
                                    >
                                        Solved
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<VisibilityIcon />}
                                        color="success"
                                        onClick={() => gotoView(ticket._id)}
                                    >
                                        View
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<EditIcon />}
                                        color="success"
                                        onClick={() => gotoEdit(ticket._id)}
                                    >
                                        Edit
                                    </Button>
                                </Stack>
                            </Box>
                        ))
                    }
                </div>
            ) : 'No ticket history data to display'}

            {/* Dialog for showing customer details */}
            <CustomerDetailsDialog openDialog={openDialog} handleCloseDialog={handleCloseDialog} customerData={customerData} />
        </div>
    );
};

export default TicketHistory;
