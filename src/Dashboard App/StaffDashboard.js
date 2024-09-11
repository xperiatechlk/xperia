import React, { useEffect, useState } from 'react';
import DashboardStyle from './Dashboard.style';
import { Avatar, Box, Card, CardContent, MenuItem, Select, Grid, Typography, Stack, Button } from '@mui/material';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';
import theme from '../theme/Theme';
import { CalendarViewMonthRounded } from '@mui/icons-material';
import {
    Description as DescriptionIcon,
    Assignment as AssignmentIcon,
    Event as EventIcon,
    Note as NoteIcon,
    Feedback as FeedbackIcon,
    CheckCircle as CheckCircleIcon,
    Edit as EditIcon,
    Visibility as VisibilityIcon,
} from '@mui/icons-material';
import RecentlySolvedTicketCard from '../Components/Dashboard/Staff/RecentlySolvedTicket'
import TicketHistory from '../Components/Dashboard/Staff/TicketHistory'
import TicketList from '../Components/Dashboard/Staff/TicketList';
import StaffPerformanceChart from '../Components/Dashboard/Staff/StaffPerformanceChart';
import { API_URL } from '../Constent/Constent';

const StaffDashboard = () => {
    const classes = DashboardStyle();
    const user = JSON.parse(localStorage.getItem('staff'))

    const [userSolvedTicket, setUserSolvedTicket] = useState(0);
    const [topStaff, setTopStaff] = useState([]);
    const [duration, setDuration] = useState('today');
    const [userDuration, setUserDuration] = useState('today');
    const [performance, setPerformance] = useState('best');
    const [recentSolvedTickets, setRecentSolvedTickets] = useState([]);
    const [userTicketHistory, setUserTicketHistory] = useState([]);
    const [userPerformence, setUserPerformence] = useState([]);
    const [chartRange, setChartRange] = useState('today');
    const [pendingTickets, setPendingTickets] = useState([])

    useEffect(() => {
        const fetchSolvedAndPendingTickets = async () => {
            try {
                const response = await axios.post(API_URL + '/dashboard/staff/performance', { staffID: user?.id });
                setUserPerformence(response.data[user?.id]);
            } catch (error) {
                console.error('Error fetching solved and pending tickets', error);
            }
        };

        fetchSolvedAndPendingTickets();
    }, [user?.id]);

    useEffect(() => {
        const fetchTopStaff = async () => {
            try {
                const response = await axios.post(API_URL + '/dashboard/staff/solvedTickets', { duration, performance });
                setTopStaff(response.data);
            } catch (error) {
                console.error('Error fetching top staff', error);
            }
        };

        fetchTopStaff();
    }, [duration, performance]);

    useEffect(() => {
        const fetchRecentSolvedTickets = async () => {
            try {
                const response = await axios.get(`http://localhost:8070/api/dashboard/staff/recentSolvedTickets/${user?.id}`);
                setRecentSolvedTickets(response.data);
            } catch (error) {
                console.error('Error fetching recent solved tickets', error);
            }
        };

        fetchRecentSolvedTickets();
    }, [user?.id]);

    useEffect(() => {
        const fetchUserTicketHistory = async () => {
            try {
                const response = await axios.get(`http://localhost:8070/api/dashboard/staff/solvedTicketsHistory/${user?.id}`);
                setUserTicketHistory(response.data);
            } catch (error) {
                console.error('Error fetching user ticket history', error);
            }
        };

        fetchUserTicketHistory();
    }, [user?.id]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.post(API_URL + '/dashboard/staff/solvedTickets/' + user?.id, { duration: userDuration })
                setUserSolvedTicket(res.data);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData();
    }, [userDuration]);

    useEffect(() => {
        const getPendingTickets = async () => {
            try {
                const res = await axios.get(API_URL + '/tickets')
                let ticketList = res.data.filter((item) => item.status == 'Pending' && item.departmentID == user?.departmentID)
                setPendingTickets(ticketList);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        getPendingTickets();
    }, [userDuration,pendingTickets]);

    const onDurationchange = (value) => {
        setDuration(value);
    };

    const onPerformancechange = (value) => {
        setPerformance(value);
    };
 
    function stringToColor(string) {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    }

    function stringAvatar(name) {
        return {
            sx: {
                bgcolor: stringToColor(name),
                marginRight: '20px'
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    }

    return (
        <div className={classes.container}>
            <Grid container spacing={1}>
                <Grid item md={6} xs={12} >
                    <Grid container spacing={2}>
                        <Grid item md={12} xs={12} >
                            <Card
                                sx={{
                                    borderRadius: '4px',
                                    padding: '20px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    minHeight: '400px',
                                    maxHeight: '400px',
                                    overflowY: 'scroll',
                                    height: 'auto',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center', 
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    width: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '30px',
                                    borderBottom: '2px solid #7058c6', // Adding a bottom border to the header
                                    paddingBottom: '10px'
                                }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: '#7058c6', // Primary color for the text
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Staff Performance
                                    </Typography>
                                    <div>
                                        <Select
                                            value={duration}
                                            onChange={(e) => onDurationchange(e.target.value)}
                                            sx={{
                                                width: '150px',
                                                height: '30px',
                                                backgroundColor: '#FFFFFF',
                                                border: '1px solid #d1d1d1', // Light gray border
                                                borderRadius: '5px',
                                                marginLeft: '10px',
                                                '& .MuiSelect-select': {
                                                    color: '#7058c6', // Primary color for the text
                                                },
                                                '& .MuiSelect-icon': {
                                                    color: '#7058c6' // Primary color for the icon
                                                }
                                            }}
                                        >
                                            <MenuItem value="today">Today</MenuItem>
                                            <MenuItem value="thisWeek">This week</MenuItem>
                                            <MenuItem value="lastWeek">Last week</MenuItem>
                                            <MenuItem value="thisMonth">This Month</MenuItem>
                                            <MenuItem value="lastMonth">Last Month</MenuItem>
                                            <MenuItem value="thisYear">This Year</MenuItem>
                                            <MenuItem value="lastYear">Last Year</MenuItem>
                                        </Select>
                                        <Select
                                            value={performance}
                                            onChange={(e) => onPerformancechange(e.target.value)}
                                            sx={{
                                                width: '150px',
                                                height: '30px',
                                                backgroundColor: '#FFFFFF',
                                                border: '1px solid #d1d1d1', // Light gray border
                                                borderRadius: '5px',
                                                marginLeft: '10px',
                                                '& .MuiSelect-select': {
                                                    color: '#7058c6', // Primary color for the text
                                                },
                                                '& .MuiSelect-icon': {
                                                    color: '#7058c6' // Primary color for the icon
                                                }
                                            }}
                                        >
                                            <MenuItem value="best">Best Performed</MenuItem>
                                            <MenuItem value="worst">Worst Performed</MenuItem>
                                        </Select>
                                    </div>
                                </div>
                                <div style={{ width: '100%' }}>
                                    {topStaff.map((staff, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: '15px',
                                                padding: '5px 15px',
                                                backgroundColor: '#ffffff', // White background for staff details
                                                borderRadius: '8px',
                                                border: '1px solid #d1d1d1', // Light gray border for staff details
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar {...stringAvatar(staff.staffName)} />
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{ color: '#7058c6' }} // Primary color for staff name
                                                    >
                                                        {staff.staffName}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="textSecondary"
                                                    >
                                                        {staff.staffRole}
                                                    </Typography>
                                                </div>
                                            </div>
                                            <div>
                                                <Typography
                                                    variant="body1"
                                                    sx={{ color: '#7058c6' }} // Primary color for resolved tickets text
                                                >
                                                    Resolved: {staff.count}
                                                </Typography>
                                            </div>
                                        </Box>
                                    ))}
                                </div>
                            </Card>
                        </Grid>
                        <Grid item md={12} xs={12} >
                            <Card
                                sx={{
                                    boxShadow: '1px 1px 3px 0px #BF7EFF',
                                    borderRadius: '5px',
                                    width: '100%',
                                    height: '400px',
                                    overflow: 'hidden',
                                    paddingTop: '10px',
                                    textAlign: 'left',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >

                                <StaffPerformanceChart performanceData={userPerformence} />
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={6} xs={12} >
                    <Grid item md={12} xs={12} >
                        <Grid container spacing={1}>
                            <Grid item md={12} xs={12} >
                                <Card
                                    sx={{
                                        width: '100%',
                                        marginLeft: '10px',
                                        paddingRight: '10px', 
                                        borderRadius: '5px',
                                    }}>
                                    <CardContent>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                gap: '20px',
                                            }}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    gap: '20px',
                                                    color: theme.palette.primary.main
                                                }}>
                                                <CalendarViewMonthRounded
                                                    sx={{
                                                        height: '40px',
                                                        width: '40px',
                                                        color: theme.palette.primary.main
                                                    }}
                                                /> Solved issues
                                            </div>
                                            <div>
                                                <Select
                                                    value={userDuration}
                                                    onChange={(e) => setUserDuration(e.target.value)}
                                                    sx={{
                                                        width: '250px',
                                                        height: '30px',
                                                        backgroundColor: '#FFFFFF',
                                                        border: '1px solid #d1d1d1', // Light gray border
                                                        borderRadius: '5px',
                                                        marginLeft: '10px',
                                                        '& .MuiSelect-select': {
                                                            color: '#7058c6', // Primary color for the text
                                                        },
                                                        '& .MuiSelect-icon': {
                                                            color: '#7058c6' // Primary color for the icon
                                                        }
                                                    }}
                                                >
                                                    <MenuItem value="today">Today</MenuItem>
                                                    <MenuItem value="thisWeek">This week</MenuItem>
                                                    <MenuItem value="lastWeek">Last week</MenuItem>
                                                    <MenuItem value="thisMonth">This Month</MenuItem>
                                                    <MenuItem value="lastMonth">Last Month</MenuItem>
                                                    <MenuItem value="thisYear">This Year</MenuItem>
                                                    <MenuItem value="lastYear">Last Year</MenuItem>
                                                </Select>
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'flex-end',
                                                }}>
                                                <div
                                                    style={{
                                                        fontSize: '40px',
                                                        fontWeight: 'bold',
                                                        color: theme.palette.primary.main,
                                                    }}>
                                                    {userSolvedTicket.count}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item md={12} xs={12} >
                        <RecentlySolvedTicketCard ticket={recentSolvedTickets} />
                    </Grid>
                    <Grid item md={12} xs={12} >
                        <Card
                            sx={{
                                boxShadow: '1px 1px 3px 0px #BF7EFF',
                                borderRadius: '5px',
                                padding: '10px',
                                width: '99%',
                                marginLeft: '1%',
                                maxHeight: '484px',
                                height: '484px',
                                marginTop: '10px',
                                overflowY: 'scroll',
                            }}
                        >
                            <TicketHistory tickets={userTicketHistory} />
                        </Card>
                    </Grid>
                </Grid>
            </Grid >
            <Grid container spacing={1} sx={{
                marginBottom: '30px', marginLeft: '-40px'
            }}>
                <Grid item md={12} xs={12} >
                    <Card
                        sx={{
                            boxShadow: '1px 1px 3px 0px #BF7EFF',
                            borderRadius: '5px',
                            padding: '10px',
                            width: '100%',
                            marginLeft: '1%',
                            marginTop: '10px',
                            minHeight: '484px',
                            height: '484px',
                        }}
                    >
                        {pendingTickets.length != 0 ? <TicketList tickets={pendingTickets} /> :
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%'
                            }}>
                                No pending ticket data to display
                            </div>}
                    </Card>
                </Grid>
            </Grid>
        </div >
    );
}

export default StaffDashboard;
