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
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    IconButton,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
import dayjs from 'dayjs';
import {
    Person,
    PersonOutline,
    DateRange,
    Event,
    Phone,
    Email,
    Home,
    Work,
    Lock,
    Visibility,
    VisibilityOff,
    ArrowBack,
    Cancel,
    SaveAlt,
    Save,
    Person2,
} from "@mui/icons-material";
import theme from "../theme/Theme";
import { API_URL } from "../Constent/Constent";

const AddEditStaff = () => {
    const roles = ["admin", "staff"];
    const id = localStorage.getItem("editId");
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [staff, setStaff] = useState({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        phoneNumber: "",
        emailAddress: "",
        address: "",
        role: "",
        password: "",
        hireDate: "",
    });
    const [errors, setErrors] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [showHidePassword, setShowHidePassword] = useState(false);

    useEffect(() => {
        if (id) {
            fetchStaffDetails(id);
            setIsEdit(true);
        }
    }, [id]);

    const fetchStaffDetails = async (staffId) => {
        try {
            const res = await axios.get(API_URL +`/staff/${staffId}`);
            setStaff({
                ...res.data,
                hireDate: dayjs(res.data.hireDate).format('YYYY-MM-DD'),
                dateOfBirth: dayjs(res.data.dateOfBirth).format('YYYY-MM-DD')
            });
            setSelectedDepartment(departments.find((department) => department._id === res.data.departmentID));
        } catch (error) {
            enqueueSnackbar(error.response.data.message, {
                variant: "error",
            });
        }
    };


    const validate = () => {
        let tempErrors = {};
        const today = dayjs().format("YYYY-MM-DD");

        if (!staff.firstName) tempErrors.firstName = "First Name is required";
        if (!staff.lastName) tempErrors.lastName = "Last Name is required";
        if (!staff.dateOfBirth) {
            tempErrors.dateOfBirth = "Date of Birth is required";
        } else if (staff.dateOfBirth > today) {
            tempErrors.dateOfBirth = "Date of Birth cannot be in the future";
        }
        if (!staff.hireDate) tempErrors.hireDate = "Hire Date is required";
        if (!staff.emailAddress) {
            tempErrors.emailAddress = "Email Address is required";
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(staff.emailAddress)) {
            tempErrors.emailAddress = "Email is not valid";
        }
        if (!staff.phoneNumber) {
            tempErrors.phoneNumber = "Phone Number is required";
        } else if (!/^\d{10}$/.test(staff.phoneNumber)) {
            tempErrors.phoneNumber = "Phone Number is not valid";
        }
        if (!staff.password) {
            tempErrors.password = "Password is required";
        } else if (!/(?=.*[0-9])(?=.*[a-zA-Z]).{8,}/.test(staff.password)) {
            tempErrors.password = "Password must be at least 8 characters and include both letters and numbers";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStaff({ ...staff, [name]: value });

        let tempErrors = { ...errors };

        switch (name) {
            case 'firstName':
                tempErrors.firstName = value ? '' : 'First Name is required';
                break;
            case 'lastName':
                tempErrors.lastName = value ? '' : 'Last Name is required';
                break;
            case 'dateOfBirth':
                if (!value) {
                    tempErrors.dateOfBirth = 'Date of Birth is required';
                } else if (dayjs(value).isAfter(dayjs())) {
                    tempErrors.dateOfBirth = 'Date of Birth cannot be in the future';
                } else {
                    tempErrors.dateOfBirth = '';
                }
                break;
            case 'hireDate':
                tempErrors.hireDate = value ? '' : 'Hire Date is required';
                break;
            case 'emailAddress':
                if (!value) {
                    tempErrors.emailAddress = 'Email Address is required';
                } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
                    tempErrors.emailAddress = 'Email is not valid';
                } else {
                    tempErrors.emailAddress = '';
                }
                break;
            case 'phoneNumber':
                if (!value) {
                    tempErrors.phoneNumber = 'Phone Number is required';
                } else if (!/^\d{10}$/.test(value)) {
                    tempErrors.phoneNumber = 'Phone Number is not valid';
                } else {
                    tempErrors.phoneNumber = '';
                }
                break;
            case 'address':
                if (!value) {
                    tempErrors.address = 'Address is required';
                }
                break;
            case 'role':
                if (!value) {
                    tempErrors.address = 'Role is required';
                }
                break;
            case 'password':
                if (!value) {
                    tempErrors.password = 'Password is required';
                } else if (!/(?=.*[0-9])(?=.*[a-zA-Z]).{8,}/.test(value)) {
                    tempErrors.password = 'Password must be at least 8 characters and include both letters and numbers';
                } else {
                    tempErrors.password = '';
                }
                break;
            default:
                break;
        }

        setErrors(tempErrors);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            if (isEdit) {
                await axios.put(API_URL +`/staff/${id}`, staff);
                enqueueSnackbar("Staff updated successfully", {
                    variant: "success",
                });
            } else {
                await axios.post(API_URL +"/staff", staff);
                enqueueSnackbar("Staff added successfully", {
                    variant: "success",
                });
            }
            navigate(-1);
        } catch (error) {
            enqueueSnackbar(error.response.data.message, {
                variant: "error",
            });
        }
    };

    const goBack = () => {
        localStorage.removeItem('editId');
        navigate(-1);
    }

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
                        textAlign: 'left'
                    }}
                >
                    <CardHeader
                        subheader="The information can be edited"
                        title={isEdit ? "Edit Staff" : "Add Staff"}
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
                            <CardContent sx={{ marginTop: "20px" }}>
                                <Grid container spacing={4}>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="First Name"
                                            name="firstName"
                                            onChange={handleInputChange}
                                            required
                                            variant="outlined"
                                            value={staff.firstName}
                                            error={!!errors.firstName}
                                            helperText={errors.firstName}
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
                                            label="Last Name"
                                            name="lastName"
                                            onChange={handleInputChange}
                                            required
                                            variant="outlined"
                                            value={staff.lastName}
                                            error={!!errors.lastName}
                                            helperText={errors.lastName}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonOutline />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Date of Birth"
                                            name="dateOfBirth"
                                            onChange={handleInputChange}
                                            type="date"
                                            value={staff.dateOfBirth}
                                            required
                                            variant="outlined"
                                            error={!!errors.dateOfBirth}
                                            helperText={errors.dateOfBirth}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
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
                                            label="Hire Date"
                                            name="hireDate"
                                            onChange={handleInputChange}
                                            required
                                            type="date"
                                            variant="outlined"
                                            value={staff.hireDate}
                                            error={!!errors.hireDate}
                                            helperText={errors.hireDate}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Event />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Email Address"
                                            name="emailAddress"
                                            onChange={handleInputChange}
                                            required
                                            type="email"
                                            value={staff.emailAddress}
                                            variant="outlined"
                                            error={!!errors.emailAddress}
                                            helperText={errors.emailAddress}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Email />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            name="phoneNumber"
                                            onChange={handleInputChange}
                                            required
                                            value={staff.phoneNumber}
                                            variant="outlined"
                                            error={!!errors.phoneNumber}
                                            helperText={errors.phoneNumber}
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
                                        <FormControl component="fieldset">
                                            <FormLabel component="legend">Gender</FormLabel>
                                            <RadioGroup
                                                row
                                                name="gender"
                                                value={staff.gender}
                                                onChange={handleInputChange}
                                            >
                                                <FormControlLabel
                                                    value="male"
                                                    control={<Radio />}
                                                    label="Male"
                                                />
                                                <FormControlLabel
                                                    value="female"
                                                    control={<Radio />}
                                                    label="Female"
                                                />
                                                <FormControlLabel
                                                    value="other"
                                                    control={<Radio />}
                                                    label="Other"
                                                />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Address"
                                            name="address"
                                            onChange={handleInputChange}
                                            required
                                            error={!!errors.address}
                                            value={staff.address}
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Home />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={6} xs={12} sx={{marginTop:'-20px'}}>
                                        <label style={{ marginBottom: '10px' }}>Role</label>
                                        <FormControl fullWidth required variant="outlined">
                                            <Select
                                                name="role"
                                                value={staff.role}
                                                onChange={handleInputChange}
                                                label="Role"
                                                error={!!errors.role}
                                                helperText={errors.role}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Person2 />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            >
                                                {roles.map((role) => (
                                                    <MenuItem key={role} value={role} selected={staff.role == role ? true : false}>
                                                        {role}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Password"
                                            name="password"
                                            type={showHidePassword ? "text" : "password"}
                                            onChange={handleInputChange}
                                            required
                                            variant="outlined"
                                            value={staff.password}
                                            error={!!errors.password}
                                            helperText={errors.password}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Lock />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={() => setShowHidePassword(!showHidePassword)}
                                                            edge="end"
                                                        >
                                                            {showHidePassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
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
                                    variant="text"
                                    onClick={() => goBack()}
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

export default AddEditStaff;
