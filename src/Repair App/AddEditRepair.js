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
    Person
} from "@mui/icons-material";
import theme from "../theme/Theme";
import moment from 'moment';
import { API_URL } from "../Constent/Constent";

const statuses = ["Pending", "Done", "Delivered"];

const AddEditRepair = () => {
    const id = localStorage.getItem("editId");
    const navigate = useNavigate();
    const [repair, setRepair] = useState({
        date: new moment().format('YYYY-MM-DD'),
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

    const validateField = (name, value) => {
        let errorMsg = "";
        switch (name) {
            case "name":
                if (!/^[a-zA-Z ]{2,100}$/.test(value)) {
                    errorMsg = "Name should be 2-100 characters long.";
                }
                break;
            case "deviceType":
                if (!value.trim()) {
                    errorMsg = "Device Type is required.";
                }
                break;
            case "fault":
                if (!value.trim()) {
                    errorMsg = "Fault description is required.";
                }
                break;
            case "contactNumber":
                if (!/^\d{10}$/.test(value)) {
                    errorMsg = "Contact Number must be 10 digits.";
                }
                break;
            case "price":
                if (value <= 0) {
                    errorMsg = "Price must be greater than 0.";
                }
                break;
            case "date":
                if (!value) {
                    errorMsg = "Date is required.";
                }
                break;
            default:
                break;
        }
        return errorMsg;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const errorMsg = validateField(name, value);
        setRepair({ ...repair, [name]: value });
        setErrors({ ...errors, [name]: errorMsg });
    };

    const handleStatusChange = (e) => {
        const value = e.target.value;
        const errorMsg = statuses.includes(value) ? "" : "Invalid status.";
        setRepair({ ...repair, status: value });
        setErrors({ ...errors, status: errorMsg });
    };

    const fetchRepairDetails = async () => {
        try {
            const response = await axios.get(API_URL +`/repairs/${id}`);
            setRepair(response.data);
            setIsEdit(true);
        } catch (error) {
            console.error("Error fetching repair details:", error);
            toast.error("Error fetching repair details");
        }
    };

    const validateInputs = () => {
        let valid = true;
        let tempErrors = {};
        for (const field in repair) {
            const errorMsg = validateField(field, repair[field]);
            if (errorMsg) {
                valid = false;
                tempErrors[field] = errorMsg;
            }
        }
        setErrors(tempErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateInputs()) {
            toast.error("Please fix the validation errors.");
            return;
        }

        try {
            if (isEdit) {
                await axios.put(API_URL +`/repairs/${id}`, repair);
                toast.success("Repair updated successfully");
            } else {
                await axios.post(API_URL +"/repairs", repair);
                toast.success("Repair added successfully");
            }
            navigate(-1);
            localStorage.removeItem("editId");
        } catch (error) {
            console.error("API error:", error);
            toast.error(error.response?.data?.message || "Failed to save repair");
        }
    };

    const goBack = () => {
        localStorage.removeItem("editId");
        navigate(-1);
    };

    return (
        <ThemeProvider theme={theme}>
            <div style={{ paddingTop: "20px" }}>
                <Card sx={{ width: "97%", margin: "auto", marginTop: "20px", marginBottom: "20px", textAlign: "left" }}>
                    <CardHeader
                        subheader={isEdit ? "The information can be edited" : "Enter repair details"}
                        title={isEdit ? "Edit Repair" : "Add Repair"}
                    />
                    <form onSubmit={handleSubmit}>
                        <Card sx={{ width: "97%", margin: "auto", marginTop: "20px", marginBottom: "20px", boxShadow: "none" }}>
                            <Divider />
                            <CardContent sx={{ marginTop: "20px" }}>
                                <Grid container spacing={4}>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Date"
                                            name="date"
                                            type="date"
                                            value={moment(repair.date).format('YYYY-MM-DD') || moment().format('YYYY-MM-DD')}
                                            onChange={handleInputChange}
                                            required
                                            variant="outlined"
                                            error={!!errors.date}
                                            helperText={errors.date}
                                            InputLabelProps={{ shrink: true }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <DateRange />
                                                    </InputAdornment>
                                                )
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
                                                )
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
                                                )
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
                                                )
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
                                                )
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
                                                )
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