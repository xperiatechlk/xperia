import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Grid, IconButton, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import CloseIcon from '@mui/icons-material/Close';

const CustomerDetailsDialog = ({ openDialog, handleCloseDialog, customerData }) => {
    return (
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
            <DialogTitle>
                Customer Details
                <IconButton
                    aria-label="close"
                    onClick={handleCloseDialog}
                    sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container alignItems="center">
                            <VpnKeyIcon sx={{ marginRight: 1 }} />
                            <Typography variant="body1">Customer ID: {customerData._id}</Typography>
                        </Grid>
                    </Grid>
                    <Divider sx={{ width: '100%', marginY: 2 }} />

                    <Grid item xs={12}>
                        <Grid container alignItems="center">
                            <PersonIcon sx={{ marginRight: 1 }} />
                            <Typography variant="body1">Name: {customerData.firstName} {customerData.lastName}</Typography>
                        </Grid>
                    </Grid>
                    <Divider sx={{ width: '100%', marginY: 2 }} />

                    <Grid item xs={12}>
                        <Grid container alignItems="center">
                            <EmailIcon sx={{ marginRight: 1 }} />
                            <Typography variant="body1">Email: {customerData.emailAddress}</Typography>
                        </Grid>
                    </Grid>
                    <Divider sx={{ width: '100%', marginY: 2 }} />

                    <Grid item xs={12}>
                        <Grid container alignItems="center">
                            <PhoneIcon sx={{ marginRight: 1 }} />
                            <Typography variant="body1">Phone: {customerData.phoneNumber}</Typography>
                        </Grid>
                    </Grid>
                    <Divider sx={{ width: '100%', marginY: 2 }} />

                    <Grid item xs={12}>
                        <Grid container alignItems="center">
                            <CalendarTodayIcon sx={{ marginRight: 1 }} />
                            <Typography variant="body1">Date of Birth: {new Date(customerData.dateOfBirth).toLocaleDateString()}</Typography>
                        </Grid>
                    </Grid>
                    <Divider sx={{ width: '100%', marginY: 2 }} />

                    <Grid item xs={12}>
                        <Grid container alignItems="center">
                            <LocationOnIcon sx={{ marginRight: 1 }} />
                            <Typography variant="body1">Address: {customerData.address}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog} color="primary" variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CustomerDetailsDialog;
