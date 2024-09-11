import React, { useState } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Email, Lock } from "@mui/icons-material";
import theme from "../theme/Theme";
import LoginImage from "../assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../Constent/Constent";

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Replace with your login API endpoint
            const res = await axios.post(API_URL +"/staff/login", credentials);

            // Save token and user data to localStorage
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("staff", JSON.stringify(res.data.staff));

            toast.success("Login successful");
            navigate("/");
            window.location.reload();
        } catch (error) {
            toast.error("Login failed! " + error.response.data.message);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    marginTop: '-100px',
                    paddingTop: "100px", 
                    backgroundColor: "#d0f2f2",
                }}
            >
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#ffffff",
                    justifyContent: "center",
                    width: "45%",
                    height: "50%",  
                    boxShadow: '1px 1px 4px #BF7EFF',
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "50%",
                        height: "90%",
                        padding: "20px",
                        backgroundColor: "#f4f6f8",
                    }}>
                        <img src={LoginImage} alt="logo" style={{ width: "400px" }} />
                    </div>
                    <Card sx={{ width: 400, boxShadow: 'none' }}>
                        <CardHeader title="Login" />
                        <Divider />
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            name="email"
                                            onChange={handleInputChange}
                                            required
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Email />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Password"
                                            name="password"
                                            onChange={handleInputChange}
                                            type="password"
                                            required
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Lock />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                </Grid>
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
                                        type="submit"
                                        variant="contained"
                                        sx={{
                                            height: "30px",
                                            width: "100px",
                                        }}
                                    >
                                        Login
                                    </Button>
                                </Box>
                            </form>
                        </CardContent>
                    </Card>
                </div>
                <ToastContainer />
            </Box>
        </ThemeProvider >
    );
};

export default Login;
