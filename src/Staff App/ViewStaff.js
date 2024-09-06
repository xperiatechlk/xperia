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
    AccountCircle,
    DateRange,
    Email,
    Phone,
    Home,
    Badge,
    Work,
    Lock,
    AssignmentInd,
    CalendarToday,
    Security,
    Wc,
    ArrowBack,
    Edit
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import theme from '../theme/Theme';

const ViewStaff = () => {
    const id = localStorage.getItem('viewId');
    const [staff, setStaff] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch staff details from the API
        const fetchStaff = async () => {
            try {
                const res = await axios.get(`http://localhost:8070/api/staff/${id}`);
                setStaff(res.data);
                console.log(res.data); 
            } catch (error) {
                console.error(error);
            }
        };

        fetchStaff();

        return () => {
            localStorage.removeItem('userId');
        };
    }, [id]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleEdit = () => {
        localStorage.setItem('edited', true);
        navigate(`/editStaff/${id}`);
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
                    textAlign:'left'
                }}
            >
                <CardHeader
                    title="View Staff Details"
                />
                <Divider />
                <CardContent sx={{ paddingTop: '30px' }}>
                    <Grid container spacing={5}>
                        <Grid item md={6} xs={12}>
                            <Box display="flex" alignItems="center">
                                <AccountCircle style={{ color: theme.palette.primary.dark }} />
                                <Typography sx={{ marginLeft: '10px' }}>
                                    <strong style={{ marginLeft: '10px', color: theme.palette.primary.main }}>Staff ID:</strong> {staff._id}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Box display="flex" alignItems="center">
                                <AccountCircle style={{ color: theme.palette.primary.dark }} />
                                <Typography sx={{ marginLeft: '10px' }}>
                                    <strong style={{ marginLeft: '10px', color: theme.palette.primary.main }}>First Name:</strong> {staff.firstName}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Box display="flex" alignItems="center">
                                <AccountCircle style={{ color: theme.palette.primary.dark }} />
                                <Typography sx={{ marginLeft: '10px' }}>
                                    <strong style={{ marginLeft: '10px', color: theme.palette.primary.main }}>Last Name:</strong> {staff.lastName}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Box display="flex" alignItems="center">
                                <DateRange style={{ color: theme.palette.primary.dark }} />
                                <Typography sx={{ marginLeft: '10px' }}>
                                    <strong style={{ marginLeft: '10px', color: theme.palette.primary.main }}>Date of Birth:</strong> {staff.dateOfBirth}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Box display="flex" alignItems="center">
                                <Wc style={{ color: theme.palette.primary.dark }} />
                                <Typography sx={{ marginLeft: '10px' }}>
                                    <strong style={{ marginLeft: '10px', color: theme.palette.primary.main }}>Gender:</strong> {staff.gender}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Box display="flex" alignItems="center">
                                <Phone style={{ color: theme.palette.primary.dark }} />
                                <Typography sx={{ marginLeft: '10px' }}>
                                    <strong style={{ marginLeft: '10px', color: theme.palette.primary.main }}>Phone Number:</strong> {staff.phoneNumber}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Box display="flex" alignItems="center">
                                <Email style={{ color: theme.palette.primary.dark }} />
                                <Typography sx={{ marginLeft: '10px' }}>
                                    <strong style={{ marginLeft: '10px', color: theme.palette.primary.main }}>Email Address:</strong> {staff.emailAddress}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Box display="flex" alignItems="center">
                                <Home style={{ color: theme.palette.primary.dark }} />
                                <Typography sx={{ marginLeft: '10px' }}>
                                    <strong style={{ marginLeft: '10px', color: theme.palette.primary.main }}>Address:</strong> {staff.address}
                                </Typography>
                            </Box>
                        </Grid> 
                        <Grid item md={6} xs={12}>
                            <Box display="flex" alignItems="center">
                                <Work style={{ color: theme.palette.primary.dark }} />
                                <Typography sx={{ marginLeft: '10px' }}>
                                    <strong style={{ marginLeft: '10px', color: theme.palette.primary.main }}>Department ID:</strong> {staff.departmentID}
                                </Typography>
                            </Box>
                        </Grid> 
                        <Grid item md={6} xs={12}>
                            <Box display="flex" alignItems="center">
                                <CalendarToday style={{ color: theme.palette.primary.dark }} />
                                <Typography sx={{ marginLeft: '10px' }}>
                                    <strong style={{ marginLeft: '10px', color: theme.palette.primary.main }}>Hire Date:</strong> {staff.hireDate}
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

export default ViewStaff;
