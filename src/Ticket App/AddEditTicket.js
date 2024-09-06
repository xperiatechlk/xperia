import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    TextField,
    InputAdornment,
    ThemeProvider,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
    ConfirmationNumber,
    Person,
    AssignmentInd,
    Business,
    Description,
    ListAlt,
    CalendarToday,
    Note,
    Feedback,
    SaveAlt,
    Save,
    ArrowBack,
    Cancel
} from "@mui/icons-material";
import theme from "../theme/Theme";

const AddEditTicket = () => {
    const id = localStorage.getItem('ticketId')
    const navigate = useNavigate();
    const [ticket, setTicket] = useState({
        customerID: "",
        staffID: "",
        departmentID: "",
        issueDescription: "",
        status: "",
        createdDate: "",
        closedDate: "",
        notes: "",
        feedback: "",
    });
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        if (id) {
            // Fetch ticket details if editing
            const fetchTicketDetails = async () => {
                try {
                    const res = await axios.get(`http://localhost:8070/api/tickets/${id}`);
                    setTicket(res.data);
                    setIsEdit(true);
                } catch (error) {
                    toast.error("Failed to fetch ticket details");
                }
            };
            fetchTicketDetails();
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTicket({ ...ticket, [name]: value });
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setTicket({ ...ticket, [name]: new Date(value).toISOString() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await axios.put(`http://localhost:8070/api/tickets/${id}`, ticket);
                toast.success("Ticket updated successfully");
            } else {
                await axios.post("http://localhost:8070/api/tickets", ticket);
                toast.success("Ticket added successfully");
            }
            navigate("/ticket");
        } catch (error) {
            toast.error("Failed to save ticket");
        }
    };

    return (
        <ThemeProvider theme={theme}>
            
    <div style={{ paddingTop: '20px' }}>
            <ToastContainer />
            <Card
                sx={{
                    width: "97%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginTop: "20px",
                    marginBottom: "20px",
                }}
            >
                <CardHeader
                    subheader="The information can be edited"
                    title={isEdit ? "Edit Ticket" : "Add Ticket"}
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
                            <Grid container spacing={4}>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Customer ID"
                                        name="customerID"
                                        value={ticket.customerID}
                                        onChange={handleInputChange}
                                        required
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Person />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Staff ID"
                                        name="staffID"
                                        value={ticket.staffID}
                                        onChange={handleInputChange}
                                        required
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AssignmentInd />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Department ID"
                                        name="departmentID"
                                        value={ticket.departmentID}
                                        onChange={handleInputChange}
                                        required
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Business />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Issue Description"
                                        name="issueDescription"
                                        value={ticket.issueDescription}
                                        onChange={handleInputChange}
                                        required
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Description />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            label="Status"
                                            name="status"
                                            value={ticket.status}
                                            onChange={handleInputChange}
                                            required
                                            startAdornment={<ListAlt />}
                                        >
                                            <MenuItem value="Pending">Pending</MenuItem> 
                                            <MenuItem value="Solved">Solved</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Created Date"
                                        name="createdDate"
                                        type="date"
                                        value={ticket.createdDate.split('T')[0]} // Formatting for date input
                                        onChange={handleDateChange}
                                        required
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CalendarToday />
                                                </InputAdornment>
                                            ),
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Closed Date"
                                        name="closedDate"
                                        type="date"
                                        value={ticket.closedDate ? ticket.closedDate.split('T')[0] : ''}
                                        onChange={handleDateChange}
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CalendarToday />
                                                </InputAdornment>
                                            ),
                                        }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Notes"
                                        name="notes"
                                        value={ticket.notes}
                                        onChange={handleInputChange}
                                        required
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Note />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Feedback"
                                        name="feedback"
                                        value={ticket.feedback}
                                        onChange={handleInputChange}
                                        required
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Feedback />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
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
                                startIcon={isEdit ? <SaveAlt /> : <Save />}
                                sx={{
                                    height: "30px",
                                    width: "100px",
                                }}
                            >
                                {isEdit ? "Update" : "Save"}
                            </Button>
                        </Box>
                    </Card>
                </form>
            </Card>
            </div>
        </ThemeProvider>
    );
};

export default AddEditTicket;
