import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    Typography,
    ThemeProvider,
    Button
} from '@mui/material';
import {
    AccountCircle,
    DateRange,
    Assignment,
    AssignmentTurnedIn,
    Description,
    Work,
    EventNote,
    Feedback,
    ArrowBack,
    Edit,
    Print
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import theme from '../theme/Theme';
import { useNavigate } from "react-router-dom";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ViewTicket = () => {
    const id = localStorage.getItem('ticketId')
    const [ticket, setTicket] = useState({});
    const [customer, setCustomer] = useState({});
    const [department, setDepartment] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch ticket details from the API
        const fetchTicket = async () => {
            try {
                // Replace with your API endpoint
                const ticketRes = await axios.get(`http://localhost:8070/api/tickets/${id}`);
                setTicket(ticketRes.data);

                const customerRes = await axios.get(`http://localhost:8070/api/customers/${ticketRes.data.customerID}`);
                setCustomer(customerRes.data);

                const departmentRes = await axios.get(`http://localhost:8070/api/departments/${ticketRes.data.departmentID}`);
                setDepartment(departmentRes.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTicket();
    }, [id]);

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(12);
        doc.text('Ticket Report', 14, 20);
        doc.text(`Ticket ID: ${ticket._id}`, 14, 30);
        doc.text(`Customer ID: ${customer.customerID}`, 14, 40);
        doc.text(`Customer Name: ${customer.firstName} ${customer.lastName}`, 14, 50);
        doc.text(`Staff ID: ${ticket.staffID}`, 14, 60);
        doc.text(`Department ID: ${department.departmentName}`, 14, 70);
        doc.text(`Issue Description: ${ticket.issueDescription}`, 14, 80);
        doc.text(`Status: ${ticket.status}`, 14, 90);
        doc.text(`Created Date: ${ticket.createdDate}`, 14, 100);
        doc.text(`Closed Date: ${ticket.closedDate || 'N/A'}`, 14, 110);
        doc.text(`Notes: ${ticket.notes}`, 14, 120);
        doc.text(`Feedback: ${ticket.feedback}`, 14, 130);

        // Add a table of department and customer details
        doc.autoTable({
            head: [['Department', 'Customer']],
            body: [
                [department.departmentName, `${customer.firstName} ${customer.lastName}`],
                [department.emailAddress, customer.emailAddress],
                [department.phoneNumber, customer.phoneNumber],
                [department.departmentDescription, customer.address],
                [department.operatingHours, customer.dateOfBirth.toString()],
            ],
            startY: 140,
        });

        doc.save('ticket-report.pdf');
    };

    const gotoEdit = (id) => {
        localStorage.setItem('ticketId', id)
        navigate('/editTicket')
    }

    return (
        <ThemeProvider theme={theme}>
            <div style={{ paddingTop: '20px' }}>
                <Card
                    sx={{
                        width: '97%',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginTop: '20px',
                        marginBottom: '20px',
                        textAlign: 'left'
                    }}
                >
                    <CardHeader
                        title="View Ticket Details"
                    />
                    <Divider />
                    <CardContent sx={{ paddingTop: '30px' }}>
                        <Grid container spacing={5}>
                            {/* Display ticket and related data */}
                            <Grid item md={6} xs={12}>
                                <Box display="flex" alignItems="center">
                                    <Assignment style={{ color: theme.palette.primary.dark }} />
                                    <Typography sx={{ marginLeft: '10px' }}>
                                        <strong style={{ color: theme.palette.primary.main }}>Ticket ID:</strong> #{ticket._id}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Box display="flex" alignItems="center">
                                    <AccountCircle style={{ color: theme.palette.primary.dark }} />
                                    <Typography sx={{ marginLeft: '10px' }}>
                                        <strong style={{ color: theme.palette.primary.main }}>Customer ID:</strong> #{customer._id}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Box display="flex" alignItems="center">
                                    <AccountCircle style={{ color: theme.palette.primary.dark }} />
                                    <Typography sx={{ marginLeft: '10px' }}>
                                        <strong style={{ color: theme.palette.primary.main }}>Customer Name:</strong> {customer.firstName} {customer.lastName}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Box display="flex" alignItems="center">
                                    <Work style={{ color: theme.palette.primary.dark }} />
                                    <Typography sx={{ marginLeft: '10px' }}>
                                        <strong style={{ color: theme.palette.primary.main }}>Department:</strong> {department.departmentName}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Box display="flex" alignItems="center">
                                    <Description style={{ color: theme.palette.primary.dark }} />
                                    <Typography sx={{ marginLeft: '10px' }}>
                                        <strong style={{ color: theme.palette.primary.main }}>Issue Description:</strong> {ticket.issueDescription}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Box display="flex" alignItems="center">
                                    <AssignmentTurnedIn style={{ color: theme.palette.primary.dark }} />
                                    <Typography sx={{ marginLeft: '10px' }}>
                                        <strong style={{ color: theme.palette.primary.main }}>Status:</strong> {ticket.status}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Box display="flex" alignItems="center">
                                    <EventNote style={{ color: theme.palette.primary.dark }} />
                                    <Typography sx={{ marginLeft: '10px' }}>
                                        <strong style={{ color: theme.palette.primary.main }}>Created Date:</strong> {ticket.createdDate}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Box display="flex" alignItems="center">
                                    <EventNote style={{ color: theme.palette.primary.dark }} />
                                    <Typography sx={{ marginLeft: '10px' }}>
                                        <strong style={{ color: theme.palette.primary.main }}>Closed Date:</strong> {ticket.closedDate || 'N/A'}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Box display="flex" alignItems="center">
                                    <Assignment style={{ color: theme.palette.primary.dark }} />
                                    <Typography sx={{ marginLeft: '10px' }}>
                                        <strong style={{ color: theme.palette.primary.main }}>Notes:</strong> {ticket.notes}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Box display="flex" alignItems="center">
                                    <Feedback style={{ color: theme.palette.primary.dark }} />
                                    <Typography sx={{ marginLeft: '10px' }}>
                                        <strong style={{ color: theme.palette.primary.main }}>Feedback:</strong> {ticket.feedback}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            p: 2,
                            marginTop: "30px",
                        }}
                    >
                        <Button
                            color="primary"
                            type="button"
                            onClick={() => navigate(-1)}
                            startIcon={<ArrowBack />}
                            sx={{
                                height: "30px",
                                width: "100px",
                                marginRight: "10px",
                            }}
                        >
                            Back
                        </Button>

                        <Button
                            color="primary"
                            type="button"
                            variant="contained"
                            onClick={() => gotoEdit(id)}
                            startIcon={<Edit />}
                            sx={{
                                height: "30px",
                                width: "100px",
                                marginRight: "10px",
                            }}
                        >
                            Edit
                        </Button>

                        <Button
                            color="primary"
                            type="button"
                            variant="contained"
                            onClick={generatePDF}
                            startIcon={<Print />}
                            sx={{
                                height: "30px",
                                width: "100px",
                            }}
                        >
                            PDF
                        </Button>
                    </Box>
                </Card>
            </div>
        </ThemeProvider>
    );
};

export default ViewTicket;
