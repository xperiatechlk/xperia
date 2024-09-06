import React from 'react';
import { Card, Typography, Button, Stack, Grid } from '@mui/material';
import {
    Description as DescriptionIcon,
    Assignment as AssignmentIcon,
    Event as EventIcon,
    Note as NoteIcon,
    Feedback as FeedbackIcon,
    CheckCircle as CheckCircleIcon,
    Edit as EditIcon,
    Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const RecentlySolvedTicketCard = ({ ticket }) => {

    const navigate = useNavigate()

    const gotoView = (id) => {
        localStorage.setItem('ticketId', id)
        navigate('/viewTicket')
    }

    const gotoEdit = (id) => {
        localStorage.setItem('ticketId', id)
        navigate('/editTicket')
    } 
    
    return (
        <Card
            sx={{
                boxShadow: '1px 1px 3px 0px #BF7EFF',
                borderRadius: '5px',
                padding: '10px',
                width: '99%',
                marginLeft: '1%',
                marginTop: '10px',
                height: 'auto',
                overflow: 'hidden',
            }}
        >
            {ticket?._id ? (
                <Stack spacing={1} alignItems="flex-start">
                    {/* Main Title and Subtitle */}
                    <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                        Last Solved Ticket
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: '#555', marginBottom: '10px' }}>
                        Ticket ID: {ticket._id}
                    </Typography>

                    <Grid container spacing={2}>
                        {/* First Column */}
                        <Grid item xs={6}>
                            <Typography variant="body2" sx={{ color: '#555', display: 'flex', alignItems: 'center' }}>
                                <AssignmentIcon sx={{ marginRight: '5px' }} />
                                Issue: {ticket.issueDescription}
                            </Typography>

                            <Typography variant="body2" sx={{ color: '#555', display: 'flex', alignItems: 'center' }}>
                                <DescriptionIcon sx={{ marginRight: '5px' }} />
                                Status: {ticket.status}
                            </Typography>

                            <Typography variant="body2" sx={{ color: '#555', display: 'flex', alignItems: 'center' }}>
                                <EventIcon sx={{ marginRight: '5px' }} />
                                Created: {new Date(ticket.createdDate).toLocaleString()}
                            </Typography>
                        </Grid>

                        {/* Second Column */}
                        <Grid item xs={6}>
                            <Typography variant="body2" sx={{ color: '#555', display: 'flex', alignItems: 'center' }}>
                                <EventIcon sx={{ marginRight: '5px' }} />
                                Appointment: {new Date(ticket.appointmentDate).toLocaleString()}
                            </Typography>

                            <Typography variant="body2" sx={{ color: '#555', display: 'flex', alignItems: 'center' }}>
                                <NoteIcon sx={{ marginRight: '5px' }} />
                                Notes: {ticket.notes}
                            </Typography>

                            <Typography variant="body2" sx={{ color: '#555', display: 'flex', alignItems: 'center' }}>
                                <CheckCircleIcon sx={{ marginRight: '5px' }} />
                                Closed: {new Date(ticket.closedDate).toLocaleString()}
                            </Typography>

                            <Typography variant="body2" sx={{ color: '#555', display: 'flex', alignItems: 'center' }}>
                                <FeedbackIcon sx={{ marginRight: '5px' }} />
                                Feedback: {ticket.feedback}
                            </Typography>
                        </Grid>
                    </Grid>

                    {/* Buttons */}
                    <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ marginTop: '10px' }}>
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
                            color="primary"
                            onClick={()=> gotoEdit(ticket._id)}
                        >
                            Edit
                        </Button>
                    </Stack>
                </Stack>
            ): 'No last solved ticket data to display'}
        </Card>
    );
};

export default RecentlySolvedTicketCard;
