import React, { useState } from 'react';
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

const TicketList = ({ tickets }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCustomerID, setSelectedCustomerID] = useState('');
    const navigate = useNavigate()

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
                Pending Ticket
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
                                    <Avatar sx={{ bgcolor: '#9ad6d7', marginRight: '10px' }}>{ticket.issueDescription[0].trim()}</Avatar>
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
                                        onClick={() => gotoSolve(ticket._id)}
                                    >
                                        Solve
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
            ) : 'No data to display'}

            {/* Dialog for showing customer details */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Customer Details</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        Customer ID: {selectedCustomerID}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Name: John Doe
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Email: johndoe@example.com
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Phone: +1 234 567 890
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default TicketList;
