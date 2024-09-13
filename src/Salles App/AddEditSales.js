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
    IconButton,
    ThemeProvider,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Typography
} from "@mui/material";
import Autocomplete from '@mui/lab/Autocomplete';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    ArrowBack,
    Cancel,
    SaveAlt,
    Save,
    Person,
    Visibility,
    VisibilityOff
} from "@mui/icons-material";
import theme from "../theme/Theme";
import { API_URL } from "../Constent/Constent";
import moment from 'moment';

const paymentTypes = ["Cash", "Card", "Bank"];

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
        isShipped: false,
    });

    const [errors, setErrors] = useState({});
    const [items, setItems] = useState([]);
    const [showUnitPrice, setShowUnitPrice] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [realPrice, setRealPrice] = useState(0);

    useEffect(() => {
        if (id) {
            fetchSaleDetails();
        }
        fetchItems();
    }, [id]);

    const fetchSaleDetails = async () => {
        try {
            const response = await axios.get(`${API_URL}/sales/${id}`);
            setSale(response.data);
        } catch (error) {
            toast.error("Error fetching sale details");
        }
    };

    const fetchItems = async () => {
        try {
            const response = await axios.get(`${API_URL}/items`);
            setItems(response.data);
        } catch (error) {
            toast.error("Error fetching items");
        }
    };

    const validateFields = () => {
        const newErrors = {};
        if (!sale.name.trim()) newErrors.name = "Name is required";
        if (!/^[a-zA-Z ]{2,100}$/.test(sale.name)) newErrors.name = "Name should be 2-100 characters";
        if (!sale.address.trim()) newErrors.address = "Address is required";
        if (!/^\d{10}$/.test(sale.contactNumber)) newErrors.contactNumber = "Contact number must be 10 digits";
        if (sale.amount <= 0) newErrors.amount = "Amount must be greater than 0";
        if (sale.quantity < 1) newErrors.quantity = "Quantity must be at least 1";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Returns true if no errors
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSale((prev) => ({ ...prev, [name]: value }));

        // Update total amount dynamically
        if (name === "quantity" || name === "amount") {
            const quantity = name === "quantity" ? value : sale.quantity;
            const amount = name === "amount" ? value : sale.amount;
            setTotalAmount(quantity * amount);
        }
    };

    const handleItemSelect = (event, newValue) => {
        setRealPrice(newValue?.unitPrice || 0);
        setSale((prev) => ({
            ...prev,
            itemName: newValue?.itemName || "",
            amount: newValue?.sellingPrice || 0
        }));
        setTotalAmount(sale.quantity * (newValue?.sellingPrice || 0));
    };

    const handleToggleUnitPriceVisibility = () => {
        setShowUnitPrice(!showUnitPrice);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateFields()) {
            toast.error("Please fix validation errors.");
            return;
        }

        try {
            if (id) {
                await axios.put(`${API_URL}/sales/${id}`, sale);
                toast.success("Sale updated successfully");
            } else {
                await axios.post(`${API_URL}/sales`, sale);
                toast.success("Sale added successfully");
            }
            navigate(-1);
            localStorage.removeItem("editId");
        } catch (error) {
            toast.error("Failed to save sale");
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
                        subheader={id ? "The information can be edited" : "Enter sale details"}
                        title={id ? "Edit Sale" : "Add Sale"}
                    />
                    <form onSubmit={handleSubmit}>
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
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Date"
                                        name="date"
                                        type="date"
                                        value={moment(sale.date).format("YYYY-MM-DD")}
                                        onChange={handleInputChange}
                                        required
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>

                                <Grid item md={6} xs={12}>
                                    <Autocomplete
                                        fullWidth
                                        options={items}
                                        getOptionLabel={(option) => option.itemName || ""}
                                        value={items.find(item => item.itemName === sale.itemName) || null}
                                        onChange={handleItemSelect}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Item Name"
                                                variant="outlined"
                                                error={!!errors.itemName}
                                                helperText={errors.itemName}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Unit Price"
                                        name="unit"
                                        type={showUnitPrice ? "text" : "password"}
                                        value={"Rs " + realPrice + ".00"}
                                        required
                                        disabled
                                        variant="outlined"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={handleToggleUnitPriceVisibility}>
                                                        {showUnitPrice ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>

                                <Grid item md={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Selling Price"
                                        name="amount"
                                        type='number'
                                        value={sale.amount}
                                        onChange={handleInputChange}
                                        required
                                        variant="outlined"
                                        error={!!errors.amount}
                                        helperText={errors.amount}
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
                                    <FormControl fullWidth required variant="outlined">
                                        <InputLabel>Payment Type</InputLabel>
                                        <Select
                                            name="paymentType"
                                            value={sale.paymentType}
                                            onChange={handleInputChange}
                                            label="Payment Type"
                                        >
                                            {paymentTypes.map((type) => (
                                                <MenuItem key={type} value={type}>
                                                    {type}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </CardContent>

                        {/* Billing Information */}
                        <CardContent sx={{ marginTop: "20px", backgroundColor: "#f5f5f5" }}>
                            <Typography variant="h6">Billing Information</Typography>
                            <Divider sx={{ marginBottom: "10px" }} />
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body1">Unit Price: Rs {sale.amount}.00</Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body1">Quantity: {sale.quantity}.00</Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        Total Amount: Rs {totalAmount}.00
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>

                        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
                            <Button
                                color="primary"
                                variant="text"
                                onClick={goBack}
                                startIcon={<ArrowBack />}
                                sx={{ marginRight: "10px" }}
                            >
                                Back
                            </Button>
                            <Button
                                color="secondary"
                                variant="contained"
                                onClick={() => navigate(-1)}
                                startIcon={<Cancel />}
                                sx={{ marginRight: "10px" }}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                type="submit"
                                variant="contained"
                                startIcon={id ? <SaveAlt /> : <Save />}
                            >
                                {id ? "Update" : "Save"}
                            </Button>
                        </Box>
                    </form>
                </Card>
            </div>
        </ThemeProvider>
    );
};

export default AddEditSale;
