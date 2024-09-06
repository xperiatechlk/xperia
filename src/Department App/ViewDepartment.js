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
    Business,
    Description,
    Phone,
    Email,
    Person,
    AccessTime,
    ArrowBack,
    Edit
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import theme from '../theme/Theme';

const ViewDepartment = () => {
    const id = localStorage.getItem('viewId');
    const [department, setDepartment] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch department details from the API
        const fetchDepartment = async () => {
            try {
                const res = await axios.get(`http://localhost:8070/api/departments/${id}`);
                setDepartment(res.data);
                localStorage.setItem('departmentId', id);
            } catch (error) {
                console.error(error);
            }
        };

        fetchDepartment();

        return () => {
            localStorage.removeItem('departmentId');
        };
    }, [id]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleEdit = () => {
        localStorage.setItem('edited', true);
        navigate(`/editDepartment/${id}`);
    };

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
                        textAlign: 'left',
                    }}
                >
                    <CardHeader
                        title="View Department Details"
                    />
                    <Divider />
                    <CardContent sx={{ paddingTop: '30px' }}>
                        <Grid container spacing={5}>
                            <Grid item md={6} xs={12} >
                                <Box display="flex" alignItems="center">
                                    <Business style={{ color: theme.palette.primary.dark }} />
                                    <Typography sx={{ marginLeft: '10px' }}>
                                        <strong style={{ marginLeft: '10px', color: theme.palette.primary.main }}>Department ID:</strong> {department._id}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Box display="flex" alignItems="center">
                                    <Business style={{ color: theme.palette.primary.dark }} />
                                    <Typography sx={{ marginLeft: '10px' }}>
                                        <strong style={{ marginLeft: '10px', color: theme.palette.primary.main }}>Department Name:</strong> {department.departmentName}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Box display="flex" alignItems="center">
                                    <Description style={{ color: theme.palette.primary.dark }} />
                                    <Typography sx={{ marginLeft: '10px' }}>
                                        <strong style={{ marginLeft: '10px', color: theme.palette.primary.main }}>Description:</strong> {department.departmentDescription}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Box display="flex" alignItems="center">
                                    <Phone style={{ color: theme.palette.primary.dark }} />
                                    <Typography sx={{ marginLeft: '10px' }}>
                                        <strong style={{ marginLeft: '10px', color: theme.palette.primary.main }}>Phone Number:</strong> {department.phoneNumber}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Box display="flex" alignItems="center">
                                    <Email style={{ color: theme.palette.primary.dark }} />
                                    <Typography sx={{ marginLeft: '10px' }}>
                                        <strong style={{ marginLeft: '10px', color: theme.palette.primary.main }}>Email Address:</strong> {department.emailAddress}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Box display="flex" alignItems="center">
                                    <Person style={{ color: theme.palette.primary.dark }} />
                                    <Typography sx={{ marginLeft: '10px' }}>
                                        <strong style={{ marginLeft: '10px', color: theme.palette.primary.main }}>Department Head ID:</strong> {department.departmentHeadID}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Box display="flex" alignItems="center">
                                    <AccessTime style={{ color: theme.palette.primary.dark }} />
                                    <Typography sx={{ marginLeft: '10px' }}>
                                        <strong style={{ marginLeft: '10px', color: theme.palette.primary.main }}>Operating Hours:</strong> {department.operatingHours}
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
                            onClick={handleBack}
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
                            type="submit"
                            variant="contained"
                            onClick={handleEdit}
                            startIcon={<Edit />}
                            sx={{
                                height: "30px",
                                width: "100px",
                            }}
                        >
                            Edit
                        </Button>
                    </Box>
                </Card>
            </div>
        </ThemeProvider>
    );
};

export default ViewDepartment;
