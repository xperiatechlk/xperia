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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
    Description,
    PriceCheck,
    Inventory,
    Category,
    SaveAlt,
    Save,
    ArrowBack,
    Cancel,
} from "@mui/icons-material";
import theme from "../theme/Theme";
import { API_URL } from "../Constent/Constent";

const AddEditItem = () => {
    const id = localStorage.getItem("editId");
    const navigate = useNavigate();
    const [item, setItem] = useState({
        itemName: "",
        category: "",
        quantity: 0,
        unitPrice: 0,
        sellingPrice: 0,
        description: "",
    });
    const [isEdit, setIsEdit] = useState(false);
    const [errors, setErrors] = useState({
        itemName: "",
        category: "",
        quantity: "",
        unitPrice: "",
        sellingPrice: "",
    });

    useEffect(() => {
        if (id) {
            fetchItemDetails();
        }
    }, [id]);

    const validateInputs = () => {
        let tempErrors = {};
        if (!/^[a-zA-Z0-9 ]{2,100}$/.test(item.itemName)) {
            tempErrors.itemName = "Item Name should be 2-100 characters long.";
        }
        if (!item.category.trim()) {
            tempErrors.category = "Category is required.";
        }
        if (item.quantity <= 0) {
            tempErrors.quantity = "Quantity must be greater than 0.";
        }
        if (item.unitPrice <= 0) {
            tempErrors.unitPrice = "Unit Price must be greater than 0.";
        }
        if (item.sellingPrice <= 0) {
            tempErrors.sellingPrice = "Selling Price must be greater than 0.";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const fetchItemDetails = async () => {
        try {
            const response = await axios.get(API_URL + `/items/${id}`);
            setItem(response.data);
            setIsEdit(true);
        } catch (error) {
            console.error("Error fetching item details:", error);
            toast.error("Error fetching item details");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setItem({ ...item, [name]: value });
        setErrors({ ...errors, [name]: "" });
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
                await axios.put(API_URL + `/items/${id}`, item);
                toast.success("Item updated successfully");
            } else {
                await axios.post("http://localhost:8070/api/items", item);
                toast.success("Item added successfully");
            }
            navigate("/items");
            localStorage.removeItem("editId");
        } catch (error) {
            console.error("API error:", error);
            toast.error(error.response?.data?.message || "Failed to save item");
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
                        subheader={isEdit ? "The information can be edited" : "Enter item details"}
                        title={isEdit ? "Edit Item" : "Add Item"}
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
                                            label="Item Name"
                                            name="itemName"
                                            value={item.itemName}
                                            onChange={handleInputChange}
                                            required
                                            variant="outlined"
                                            error={!!errors.itemName}
                                            helperText={errors.itemName}
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
                                        <TextField
                                            fullWidth
                                            label="Category"
                                            name="category"
                                            value={item.category}
                                            onChange={handleInputChange}
                                            required
                                            variant="outlined"
                                            error={!!errors.category}
                                            helperText={errors.category}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Category />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Quantity"
                                            name="quantity"
                                            type="number"
                                            value={item.quantity}
                                            onChange={handleInputChange}
                                            required
                                            variant="outlined"
                                            error={!!errors.quantity}
                                            helperText={errors.quantity}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Inventory />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Unit Price"
                                            name="unitPrice"
                                            type="number"
                                            value={item.unitPrice}
                                            onChange={handleInputChange}
                                            required
                                            variant="outlined"
                                            error={!!errors.unitPrice}
                                            helperText={errors.unitPrice}
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
                                        <TextField
                                            fullWidth
                                            label="Selling Price"
                                            name="sellingPrice"
                                            type="number"
                                            value={item.sellingPrice}
                                            onChange={handleInputChange}
                                            required
                                            variant="outlined"
                                            error={!!errors.sellingPrice}
                                            helperText={errors.sellingPrice}
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
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            name="description"
                                            value={item.description}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            multiline
                                            rows={4}
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
                                    onClick={() => navigate("/items")}
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

export default AddEditItem;
