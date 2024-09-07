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
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
    PhoneAndroid,
    Build,
    DateRange,
    Phone,
    PriceCheck,
    ArrowBack,
    Cancel,
    SaveAlt,
    Save,
    DeviceHub,
    Person
} from "@mui/icons-material";
import theme from "../theme/Theme";

const statuses = ["Pending", "Done", "Delivered"];

const AddEditRepair = () => {
    const id = localStorage.getItem("editId");
    const navigate = useNavigate();
    const [repair, setRepair] = useState({
        date: "",
        name: "",
        deviceType: "",
        fault: "",
        contactNumber: "",
        price: 0,
        status: statuses[0] // Default to "Pending"
    });
    const [isEdit, setIsEdit] = useState(false);
    const [errors, setErrors] = useState({
        date: "",
        name: "",
        deviceType: "",
        fault: "",
        contactNumber: "",
        price: "",
        status: ""
    });

    useEffect(() => {
        if (id) {
            fetchRepairDetails();
        }
    }, [id]);

    const validateInputs = () => {
        let tempErrors = {};
        if (!/^[a-zA-Z ]{2,100}$/.test(repair.name)) {
            tempErrors.name = "Name should be 2-100 characters long.";
        }
        if (!repair.deviceType.trim()) {
            tempErrors.deviceType = "Device Type is required.";
        }
        if (!repair.fault.trim()) {
            tempErrors.fault = "Fault description is required.";
        }
        if (!/^\d{10}$/.test(repair.contactNumber)) {
            tempErrors.contactNumber = "Contact Number must be 10 digits.";
        }
        if (repair.price <= 0) {
            tempErrors.price = "Price must be greater than 0.";
        }
        if (!statuses.includes(repair.status)) {
            tempErrors.status = "Invalid status.";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const fetchRepairDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8070/api/repairs/${id}`);
            setRepair(response.data);
            setIsEdit(true);
        } catch (error) {
            console.error("Error fetching repair details:", error);
            toast.error("Error fetching repair details");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRepair({ ...repair, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const handleStatusChange = (e) => {
        setRepair({ ...repair, status: e.target.value });
        setErrors({ ...errors, status: "" });
    };

    const goBack = () => {
        localStorage.removeItem('editId');
        navigate(-1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            toast.error("Please fix the validation errors.");
            return;
        }

        try {
            if (isEdit) {
                await axios.put(`http://localhost:8070/api/repairs/${id}`, repair);
                toast.success("Repair updated successfully");
            } else {
                await axios.post("http://localhost:8070/api/repairs", repair);
                toast.success("Repair added successfully");
            }
            navigate(-1);
            localStorage.removeItem("editId");
        } catch (error) {
            console.error("API error:", error);
            toast.error(error.response?.data?.message || "Failed to save repair");
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <div style={{ paddingTop: '20px' }}>
                <Card
                    sx={{
                        width: "97%",
                        margin: "auto",
                        marginTop: "20px",
                        marginBottom: "20px",
                        textAlign: 'left',
                    }}
                >
                    <CardHeader
                        subheader={isEdit ? "The information can be edited" : "Enter repair details"}
                        title={isEdit ? "Edit Repair" : "Add Repair"}
                    />
                    <form onSubmit={handleSubmit}>
                        <Card
                            sx={{
                                width: "97%",
                                margin: "auto",
                                marginTop: "20px",
                                marginBottom: "20px",
                                boxShadow: "none",
                            }}
                        >
                            <Divider />
                            <CardContent sx={{ marginTop: "20px" }}>
                                <Grid container spacing={4}>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Date"
                                            name="date"
                                            type="date"
                                            value={repair.date}
                                            onChange={handleInputChange}
                                            required
                                            variant="outlined"
                                            InputLabelProps={{ shrink: true }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <DateRange />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Name"
                                            name="name"
                                            value={repair.name}
                                            onChange={handleInputChange}
                                            required
                                            variant="outlined"
                                            error={!!errors.name}
                                            helperText={errors.name}
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
                                            label="Device Type"
                                            name="deviceType"
                                            value={repair.deviceType}
                                            onChange={handleInputChange}
                                            required
                                            variant="outlined"
                                            error={!!errors.deviceType}
                                            helperText={errors.deviceType}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PhoneAndroid />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Fault"
                                            name="fault"
                                            value={repair.fault}
                                            onChange={handleInputChange}
                                            required
                                            variant="outlined"
                                            error={!!errors.fault}
                                            helperText={errors.fault}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Build />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Contact Number"
                                            name="contactNumber"
                                            value={repair.contactNumber}
                                            onChange={handleInputChange}
                                            required
                                            variant="outlined"
                                            error={!!errors.contactNumber}
                                            helperText={errors.contactNumber}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Phone />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Price"
                                            name="price"
                                            type="number"
                                            value={repair.price}
                                            onChange={handleInputChange}
                                            required
                                            variant="outlined"
                                            error={!!errors.price}
                                            helperText={errors.price}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PriceCheck />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <FormControl fullWidth required variant="outlined">
                                            <InputLabel>Status</InputLabel>
                                            <Select
                                                name="status"
                                                value={repair.status}
                                                onChange={handleStatusChange}
                                                label="Status"
                                                error={!!errors.status}
                                                helperText={errors.status}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Build />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            >
                                                {statuses.map((status) => (
                                                    <MenuItem key={status} value={status}>
                                                        {status}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
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
                                    variant="text"
                                    onClick={goBack}
                                    startIcon={<ArrowBack />}
                                    sx={{ height: "30px", width: "100px", marginRight: "10px" }}
                                >
                                    Back
                                </Button>
                                <Button
                                    color="secondary"
                                    variant="contained"
                                    startIcon={<Cancel />}
                                    onClick={() => navigate(-1)}
                                    sx={{ height: "30px", width: "100px", marginRight: "10px" }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    type="submit"
                                    variant="contained"
                                    startIcon={isEdit ? <SaveAlt /> : <Save />}
                                    sx={{ height: "30px", width: "100px" }}
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

export default AddEditRepair;