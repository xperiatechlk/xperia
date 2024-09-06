import React, { useEffect, useState } from 'react';
import DashboardStyle from './Dashboard.style';
import { Avatar, Box, Card, CardContent, MenuItem, Select, Grid, Typography } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';
import CountCard from '../Components/CountCard';
import theme from '../theme/Theme';

const AdminDashboard = () => {
    const classes = DashboardStyle();

    const [departmentCount, setDepartmentCount] = useState(0);
    const [solvedTicketCount, setSolvedTicketCount] = useState(0);
    const [staffCount, setStaffCount] = useState(0);
    const [customerCount, setCustomerCount] = useState(0);
    const [topStaff, setTopStaff] = useState([]);
    const [duration, setDuration] = useState('today');
    const [performance, setPerformance] = useState('best');
    const [departmentSolvedTicket, setDepartmentSolvedTicket] = useState([]);
    const [solvedAndUnsolvedTicketCount, setSolvedAndUnsolvedTicketCount] = useState({});
    const [ticketDetailsForWeek, setTicketDetailsForWeek] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    departmentRes,
                    solvedTicketRes,
                    staffRes,
                    customerRes,
                    departmentSolvedTicketRes,
                    solvedTicketCountRes,
                    solvedAndPendingTicketsRes,
                    topStaffRes
                ] = await Promise.all([
                    axios.get('http://localhost:8070/api/dashboard/departments/count'),
                    axios.get('http://localhost:8070/api/dashboard/tickets/solved/count'),
                    axios.get('http://localhost:8070/api/dashboard/staff/count'),
                    axios.get('http://localhost:8070/api/dashboard/customers/count'),
                    axios.get('http://localhost:8070/api/dashboard/departments/solvedTickets'),
                    axios.get('http://localhost:8070/api/dashboard/tickets/solvedTickets'),
                    axios.get('http://localhost:8070/api/dashboard/tickets/solvedAndPendingTickets'),
                    axios.post('http://localhost:8070/api/dashboard/staff/solvedTickets', { duration, performance })
                ]);

                console.log(solvedAndPendingTicketsRes.data)
                setTicketDetailsForWeek(solvedAndPendingTicketsRes.data)
                setSolvedAndUnsolvedTicketCount(solvedTicketCountRes.data)
                setDepartmentSolvedTicket(departmentSolvedTicketRes.data)
                setDepartmentCount(departmentRes.data.count);
                setSolvedTicketCount(solvedTicketRes.data.count);
                setStaffCount(staffRes.data.count);
                setCustomerCount(customerRes.data.count);
                setTopStaff(topStaffRes.data);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData();
    }, [duration, performance]);

    const onDurationchange = (value) => {
        setDuration(value);
    };

    const onPerformancechange = (value) => {
        setPerformance(value);
    };

    // Department Distribution Chart
    const departmentChartOptions = {
        title: {
            text: 'Department Solved Ticket Distribution',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)' // Format: Name: Value (Percentage)
        },
        color: ['#9ad6d7', '#80f8a0', '#80f8d4', '#80f8c2', '#80f8b2'],
        series: [
            {
                name: 'Departments',
                type: 'pie',
                radius: '50%',
                data: departmentSolvedTicket.map((item) => ({
                    value: item.count,
                    name: item.departmentName
                })),
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    // Staff Performance Chart
    const staffPerformanceChartOptions = {
        title: {
            text: 'Staff Performance',
            left: 'center'
        },
        xAxis: {
            type: 'category',
            data: topStaff.map(staff => staff.staffName)
        },
        yAxis: {
            type: 'value'
        },
        color: '#9ad6d7',
        series: [
            {
                data: topStaff.map(staff => staff.count),
                type: 'bar'
            }
        ],
        tooltip: {
            trigger: 'axis',
            formatter: '{b0}: {c0}' // Format: Staff Name: Count
        }
    };

    // Solved Cases Over Time Chart
    const solvedCasesChartOptions = {
        title: {
            text: 'Solved Cases Over Time',
            left: 'center'
        },
        xAxis: {
            type: 'category',
            data: ticketDetailsForWeek.dates,
        },
        yAxis: {
            type: 'value'
        },
        color: ['#9ad6d7', '#84f89c'],
        series: [
            {
                name: 'Pending Tickets',
                data: ticketDetailsForWeek.pendingCounts,
                type: 'line',
                smooth: true
            },
            {
                name: 'Solved Tickets',
                data: ticketDetailsForWeek.solvedCounts,
                type: 'line',
                smooth: true
            }
        ],
        legend: {
            data: ['Pending Tickets', 'Solved Tickets'],
            top: 'bottom'
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                let tooltipHtml = '';
                params.forEach(param => {
                    tooltipHtml += `${param.marker} ${param.seriesName}: ${param.data}<br/>`;
                });
                return tooltipHtml;
            }
        }
    };

    // Department-Wise Solved Tickets Chart
    const departmentSolvedTicketsOptions = {
        title: {
            text: 'Department-Wise Solved Tickets',
            left: 'center'
        },
        xAxis: {
            type: 'category',
            data: departmentSolvedTicket.map(item => item.departmentName) || []
        },
        yAxis: {
            type: 'value'
        },
        color: '#9ad6d7',
        series: [
            {
                data: departmentSolvedTicket.map(item => item.count) || [],
                type: 'bar'
            }
        ],
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                let tooltipHtml = '';
                params.forEach(param => {
                    tooltipHtml += `${param.marker} ${param.name}: ${param.value}<br/>`;
                });
                return tooltipHtml;
            }
        }
    };

    // Solved vs. Pending Tickets Chart
    const solvedPendingTicketsOptions = {
        title: {
            text: 'Solved vs. Pending Tickets',
            left: 'center'
        },
        legend: {
            top: 'bottom'
        },
        color: ['#80f8a0', '#9ad6d7'],
        series: [
            {
                name: 'Tickets',
                type: 'pie',
                radius: ['40%', '70%'],
                data: [
                    { value: solvedAndUnsolvedTicketCount.solved, name: 'Solved' },
                    { value: solvedAndUnsolvedTicketCount.pending, name: 'Pending' }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ],
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)' // Format: Name: Value (Percentage)
        }
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
            <Grid container spacing={5}>
                <Grid item md={6} xs={12} >
                    <Card
                        sx={{
                            borderRadius: '8px',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            width: '99%',
                            minHeight: '640px',
                            maxHeight: '640px',
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
                                        padding: '15px',
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
                <Grid item md={6} xs={12} >
                    <Grid item md={12} xs={12} >
                        <Grid container spacing={5}>
                            <Grid item md={6} xs={12} >
                                <CountCard
                                    icon={<BusinessIcon sx={{
                                        color: theme.palette.primary.main,
                                        fontSize: 40,
                                    }} />}
                                    label="Departments"
                                    count={departmentCount}
                                />
                            </Grid>
                            <Grid item md={6} xs={12} >
                                <CountCard
                                    icon={<WorkIcon sx={{
                                        color: theme.palette.primary.main,
                                        fontSize: 40,
                                    }} />}
                                    label="Staff"
                                    count={staffCount}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <CountCard
                                    icon={<PeopleIcon sx={{
                                        color: theme.palette.primary.main,
                                        fontSize: 40,
                                    }} />}
                                    label="Customers"
                                    count={customerCount}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <CountCard
                                    icon={<AssignmentTurnedInIcon sx={{
                                        color: theme.palette.primary.main,
                                        fontSize: 40,
                                    }} />}
                                    label="Solved Tickets"
                                    count={solvedTicketCount}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item md={12} xs={12} >
                        <Card
                            sx={{
                                boxShadow: '1px 1px 3px 0px #BF7EFF',
                                borderRadius: '5px',
                                padding: '10px',
                                width: '99%',
                                marginLeft: '1%',
                                height: '350px',
                                marginTop: '50px',
                                overflow: 'hidden',
                            }}
                        >
                            <ReactECharts option={departmentChartOptions} style={{ height: '100%' }} />
                        </Card>
                    </Grid>
                </Grid>
            </Grid >
            <Grid container spacing={1} sx={{ marginBottom: '30px' }}>
                <Grid item md={12} xs={12} >
                    <Card
                        sx={{
                            boxShadow: '1px 1px 3px 0px #BF7EFF',
                            borderRadius: '5px',
                            padding: '10px',
                            width: '100%',
                            height: '450px',
                            overflow: 'hidden',
                            marginTop: '30px',
                        }}
                    >
                        <ReactECharts option={staffPerformanceChartOptions} style={{ height: '100%' }} />
                    </Card>
                </Grid>
                <Grid item md={12} xs={12} >
                    <Grid container spacing={5}>
                        <Grid item md={7} xs={12} >
                            <Card
                                sx={{
                                    boxShadow: '1px 1px 3px 0px #BF7EFF',
                                    borderRadius: '5px',
                                    padding: '10px',
                                    width: '100%',
                                    height: '450px',
                                    overflow: 'hidden',
                                    marginTop: '30px',
                                }}
                            >
                                <ReactECharts option={departmentSolvedTicketsOptions} style={{ height: '100%' }} />
                            </Card>
                        </Grid>
                        <Grid item md={5} xs={12} >
                            <Card
                                sx={{
                                    boxShadow: '1px 1px 3px 0px #BF7EFF',
                                    borderRadius: '5px',
                                    padding: '10px',
                                    width: '100%',
                                    height: '450px',
                                    overflow: 'hidden',
                                    marginTop: '30px',
                                }}
                            >
                                <ReactECharts option={solvedPendingTicketsOptions} style={{ height: '100%' }} />
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={12} xs={12} >
                    <Card
                        sx={{
                            boxShadow: '1px 1px 3px 0px #BF7EFF',
                            borderRadius: '5px',
                            padding: '10px',
                            width: '100%',
                            height: '450px',
                            overflow: 'hidden',
                            marginTop: '30px',
                        }}
                    >
                        <ReactECharts option={solvedCasesChartOptions} style={{ height: '100%' }} />
                    </Card>
                </Grid>
            </Grid>
        </div >
    );
}

export default AdminDashboard;
