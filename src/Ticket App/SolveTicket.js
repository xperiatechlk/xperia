import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Card,
    CardHeader,
    CardContent,
    Divider,
    Grid,
    Typography,
    ThemeProvider,
    TextField,
    InputAdornment
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    Person,
    Description,
    CalendarToday,
    Note,
    Feedback,
    SaveAlt,
    ArrowBack,
    Cancel,
    Email,
    Phone,
    Home,
    Work
} from "@mui/icons-material";
import theme from "../theme/Theme";

const SolveTicket = () => {
    const id = localStorage.getItem('ticketId');
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [department, setDepartment] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('staff')) 
 
    useEffect(() => {
        const fetchTicketData = async () => {
            try {
                const ticketRes = await axios.get(`http://localhost:8070/api/tickets/${id}`);
                setTicket(ticketRes.data);

                const customerRes = await axios.get(`http://localhost:8070/api/customers/${ticketRes.data.customerID}`);
                setCustomer(customerRes.data);

                const departmentRes = await axios.get(`http://localhost:8070/api/departments/${ticketRes.data.departmentID}`);
                setDepartment(departmentRes.data); 

                setIsLoading(false);
            } catch (error) {
                toast.error("Failed to fetch ticket data");
            }
        };

        fetchTicketData();
    }, [id]);

    const handleFeedbackChange = (e) => {
        setFeedback(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `http://localhost:8070/api/tickets/${id}`,
                {
                    ...ticket,
                    feedback,
                    status: "Solved",
                    staffID:user.id,
                    closedDate: new Date().toISOString() // Sets the closed date to today
                }
            );
            toast.success("Ticket updated successfully");
            navigate("/ticket");
        } catch (error) {
            toast.error("Failed to update ticket");
        }
    };

    return (
        <ThemeProvider theme={theme}>
            
        <div style={{ paddingTop: '20px' }}>
            <Card
                sx={{
                    width: "97%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginTop: "20px",
                    marginBottom: "20px",
                    textAlign:'left'
                }}
            >
                <CardHeader
                    subheader="Update ticket feedback and status"
                    title="Solve Ticket"
                />
                <form onSubmit={handleSubmit}>
                    <Card
                        sx={{
                            width: "97%",
                            marginLeft: "auto",
                            marginRight: "auto",
                            marginTop: "20px",
                            marginBottom: "20px",
                            boxShadow: "none",
                        }}
                    >
                        <Divider />
                        <CardContent sx={{ marginTop: '20px' }}>
                            {isLoading ? (
                                <Typography>Loading...</Typography>
                            ) : (
                                <>
                                    <Typography variant="h6" sx={{ marginBottom: '20px' }}>
                                        Customer Details
                                    </Typography>
                                    <Grid container spacing={4}>
                                        <Grid item md={6} xs={12}>
                                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Person sx={{ marginRight: '8px' }} />
                                                Name :  {customer.firstName} {customer.lastName}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Description sx={{ marginRight: '8px' }} />
                                                NIC : {customer.NIC}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Email sx={{ marginRight: '8px' }} />
                                                Email :   {customer.emailAddress}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Phone sx={{ marginRight: '8px' }} />
                                                Mobile : {customer.phoneNumber}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Home sx={{ marginRight: '8px' }} />
                                                Address : {customer.address}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    <Typography variant="h6" sx={{ marginBottom: '20px', marginTop: '30px' }}>
                                        Department Details
                                    </Typography>

                                    <Grid container spacing={4}>
                                        <Grid item md={6} xs={12}>
                                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Work sx={{ marginRight: '8px' }} />
                                                Department :  {department.departmentName}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Typography variant="h6" sx={{ marginBottom: '20px', marginTop: '30px' }}>
                                        Ticket Details
                                    </Typography>

                                    <Grid container spacing={4}>
                                        <Grid item md={6} xs={12}>
                                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Description sx={{ marginRight: '8px' }} />
                                                Topic : {ticket.issueDescription}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Description sx={{ marginRight: '8px' }} />
                                                Description : {ticket.notes}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Note sx={{ marginRight: '8px' }} />
                                                Status : {ticket.status}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                                <CalendarToday sx={{ marginRight: '8px' }} />
                                                Create Date : {new Date(ticket.createdDate).toLocaleDateString()}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                                                <CalendarToday sx={{ marginRight: '8px' }} />
                                                Appointment Date : {ticket.appointmentDate ? new Date(ticket.appointmentDate).toLocaleDateString() : 'Not Closed'}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    <Typography variant="h6" sx={{ marginBottom: '20px', marginTop: '30px' }}>
                                        Add Feedback
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        label="Feedback"
                                        name="feedback"
                                        value={feedback}
                                        onChange={handleFeedbackChange}
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Feedback />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

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
                                            onClick={() => navigate("/ticket")}
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
                                            color="secondary"
                                            type="reset"
                                            variant="contained"
                                            startIcon={<Cancel />}
                                            sx={{
                                                height: "30px",
                                                width: "100px",
                                                marginRight: "10px",
                                            }}
                                        >
                                            Cancel
                                        </Button>

                                        <Button
                                            color="primary"
                                            type="submit"
                                            variant="contained"
                                            startIcon={<SaveAlt />}
                                            sx={{
                                                height: "30px",
                                                width: "100px",
                                            }}
                                        >
                                            Save
                                        </Button>
                                    </Box>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </form>
            </Card>
            </div>
            <ToastContainer />
        </ThemeProvider>
    );
};

export default SolveTicket;
