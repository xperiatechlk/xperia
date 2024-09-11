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
    InputLabel,
    FormControlLabel,
    Checkbox
} from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete'; // Updated import for Autocomplete component
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Phone,
    DateRange,
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

const paymentTypes = ["Cash", "Card", "Bank"];
const statuses = ["Pending", "Done", "Delivered"];

const AddEditSale = () => {
    const id = localStorage.getItem("editId");
    const navigate = useNavigate();
    const [sale, setSale] = useState({
        date: moment().format('YYYY-MM-DD'),
        name: "",
        address: "",
        itemName: "",
        contactNumber: "",
        amount: 0,
        quantity: 1,
        paymentType: paymentTypes[0],
        bankName: "",
        trackingID: "",
        isShipped: false
    });
    const [isEdit, setIsEdit] = useState(false);
    const [errors, setErrors] = useState({});
    const [items, setItems] = useState([]); // For storing item list

    useEffect(() => {
        if (id) {
            fetchSaleDetails();
        }
        fetchItems(); // Fetch items for autocomplete
    }, [id]);

    const fetchItems = async () => {
        try {
            const response = await axios.get(API_URL + "/items"); // Adjust the endpoint to fetch items
            setItems(response.data); // Assuming response.data is an array of items
        } catch (error) {
            console.error("Error fetching items:", error);
            toast.error("Error fetching items");
        }
    };

    const validateField = (name, value) => {
        let errorMsg = "";
        switch (name) {
            case "name":
                if (!/^[a-zA-Z ]{2,100}$/.test(value)) {
                    errorMsg = "Name should be 2-100 characters long.";
                }
                break;
            case "address":
                if (!value.trim()) {
                    errorMsg = "Address is required.";
                }
                break;
            case "itemName":
                if (!value.trim()) {
                    errorMsg = "Item Name is required.";
                }
                break;
            case "contactNumber":
                if (!/^\d{10}$/.test(value)) {
                    errorMsg = "Contact Number must be 10 digits.";
                }
                break;
            case "amount":
                if (value <= 0) {
                    errorMsg = "Amount must be greater than 0.";
                }
                break;
            case "quantity":
                if (value < 1) {
                    errorMsg = "Quantity must be at least 1.";
                }
                break;
            case "date":
                if (!value) {
                    errorMsg = "Date is required.";
                }
                break;
            case "bankName":
                if (sale.paymentType === "Bank" && !value.trim()) {
                    errorMsg = "Bank Name is required for Bank payment.";
                }
                break;
            case "trackingID":
                if (sale.isShipped && !value.trim()) {
                    errorMsg = "Tracking ID is required if the item is shipped.";
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
        setSale({ ...sale, [name]: value });
        setErrors({ ...errors, [name]: errorMsg });
    };

    const handlePaymentTypeChange = (e) => {
        const value = e.target.value;
        const errorMsg = paymentTypes.includes(value) ? "" : "Invalid payment type.";
        setSale({ ...sale, paymentType: value });
        setErrors({ ...errors, paymentType: errorMsg });
    };

    const handleIsShippedChange = (e) => {
        const value = e.target.checked;
        setSale({ ...sale, isShipped: value, trackingID: value ? sale.trackingID : "" });
        if (value) {
            setErrors({ ...errors, trackingID: validateField("trackingID", sale.trackingID) });
        } else {
            setErrors({ ...errors, trackingID: "" });
        }
    };

    const fetchSaleDetails = async () => {
        try {
            const response = await axios.get(API_URL + `/sales/${id}`);
            setSale(response.data);
            setIsEdit(true);
        } catch (error) {
            console.error("Error fetching sale details:", error);
            toast.error("Error fetching sale details");
        }
    };

    const validateInputs = () => {
        let valid = true;
        let tempErrors = {};
        for (const field in sale) {
            if (field !== "trackingID" && field !== "bankName") {
                const errorMsg = validateField(field, sale[field]);
                if (errorMsg) {
                    valid = false;
                    tempErrors[field] = errorMsg;
                }
            } else if (field === "trackingID" && sale.isShipped) {
                const errorMsg = validateField(field, sale[field]);
                if (errorMsg) {
                    valid = false;
                    tempErrors[field] = errorMsg;
                }
            } else if (field === "bankName" && sale.paymentType === "Bank") {
                const errorMsg = validateField(field, sale[field]);
                if (errorMsg) {
                    valid = false;
                    tempErrors[field] = errorMsg;
                }
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
                await axios.put(API_URL + `/sales/${id}`, sale);
                toast.success("Sale updated successfully");
            } else {
                await axios.post(API_URL + "/sales", sale);
                toast.success("Sale added successfully");
            }
            navigate(-1);
            localStorage.removeItem("editId");
        } catch (error) {
            console.error("API error:", error);
            toast.error(error.response?.data?.message || "Failed to save sale");
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
                        subheader={isEdit ? "The information can be edited" : "Enter sale details"}
                        title={isEdit ? "Edit Sale" : "Add Sale"}
                    />
                    <form onSubmit={handleSubmit}>
                        <Card sx={{ width: "97%", margin: "auto", marginTop: "20px", marginBottom: "20px", boxShadow: "none" }}>
                            <Divider />
                            <CardContent sx={{ marginTop: "20px" }}>
                                <Grid container spacing={4}>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Name"
                                            name="name"
                                            value={sale.name}
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
                                            label="Address"
                                            name="address"
                                            value={sale.address}
                                            onChange={handleInputChange}
                                            required
                                            variant="outlined"
                                            error={!!errors.address}
                                            helperText={errors.address}
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
                                            label="Date"
                                            name="date"
                                            type="date"
                                            value={moment(sale.date).format('YYYY-MM-DD') || moment().format('YYYY-MM-DD')}
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
                                        <Autocomplete
                                            options={items.map(item => item.name)} // Adjust according to your data structure
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Item Name"
                                                    name="itemName"
                                                    value={sale.itemName}
                                                    onChange={(e) => handleInputChange({ target: { name: 'itemName', value: e.target.value } })}
                                                    required
                                                    variant="outlined"
                                                    error={!!errors.itemName}
                                                    helperText={errors.itemName}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <PriceCheck />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            )}
                                            onInputChange={(event, newValue) => handleInputChange({ target: { name: 'itemName', value: newValue } })}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Contact Number"
                                            name="contactNumber"
                                            value={sale.contactNumber}
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
                                            label="Amount"
                                            name="amount"
                                            type="number"
                                            value={sale.amount}
                                            onChange={handleInputChange}
                                            required
                                            variant="outlined"
                                            error={!!errors.amount}
                                            helperText={errors.amount}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        $
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Quantity"
                                            name="quantity"
                                            type="number"
                                            value={sale.quantity}
                                            onChange={handleInputChange}
                                            required
                                            variant="outlined"
                                            error={!!errors.quantity}
                                            helperText={errors.quantity}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel>Payment Type</InputLabel>
                                            <Select
                                                value={sale.paymentType}
                                                onChange={handlePaymentTypeChange}
                                                label="Payment Type"
                                                required
                                                error={!!errors.paymentType}
                                            >
                                                {paymentTypes.map(type => (
                                                    <MenuItem key={type} value={type}>
                                                        {type}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    {sale.paymentType === "Bank" && (
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Bank Name"
                                                name="bankName"
                                                value={sale.bankName}
                                                onChange={handleInputChange}
                                                required={sale.paymentType === "Bank"}
                                                variant="outlined"
                                                error={!!errors.bankName}
                                                helperText={errors.bankName}
                                            />
                                        </Grid>
                                    )}
                                    <Grid item md={6} xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={sale.isShipped}
                                                    onChange={handleIsShippedChange}
                                                />
                                            }
                                            label="Shipped"
                                        />
                                    </Grid>
                                    {sale.isShipped && (
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Tracking ID"
                                                name="trackingID"
                                                value={sale.trackingID}
                                                onChange={handleInputChange}
                                                variant="outlined"
                                                error={!!errors.trackingID}
                                                helperText={errors.trackingID}
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                            </CardContent>
                            <Divider />
                            <Box sx={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    startIcon={isEdit ? <SaveAlt /> : <Save />}
                                    sx={{ marginRight: "10px" }}
                                >
                                    {isEdit ? "Update Sale" : "Add Sale"}
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={goBack}
                                    startIcon={<Cancel />}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Card>
                    </form>
                </Card>
                <ToastContainer />
            </div>
        </ThemeProvider>
    );
};

export default AddEditSale;
