import React, { useEffect, useState } from 'react';
import DashboardStyle from './Dashboard.style';
import { Avatar, Box, Card, CardContent, MenuItem, Select, Grid, Typography, TextField, InputAdornment } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';
import CountCard from '../Components/CountCard';
import theme from '../theme/Theme';
import SearchIcon from '@mui/icons-material/Search';

const AdminDashboard = () => {
    const classes = DashboardStyle();

    const [departmentCount, setDepartmentCount] = useState(0);
    const [solvedTicketCount, setSolvedTicketCount] = useState(0);
    const [staffCount, setStaffCount] = useState(0);
    const [customerCount, setCustomerCount] = useState(0);
    const [repairData, setRepairData] = useState({});
    const [lowStockItems, setLowStockItems] = useState([]);
    const [filteredStockData, setFilteredStockData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    repairDataRes, // New API call for repair data
                    lowStockRes    // New API call for low stock items
                ] = await Promise.all([
                    axios.get('http://localhost:8070/api/dashboard/repairs/statusCounts'),  // Fetch repair data
                    axios.get('http://localhost:8070/api/dashboard/items/lowQuantity') // Fetch low stock items
                ]);

                // Set repair data and low stock details in the state
                setRepairData(repairDataRes.data);
                setLowStockItems(lowStockRes.data);
                setFilteredStockData(lowStockRes.data)

            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (searchTerm.length != 0 || searchTerm != '') {
            const filteredItems = lowStockItems.filter(item =>
                item.itemName.toLowerCase().includes(searchTerm)
            );
            setFilteredStockData(filteredItems)
        }
        else {
            setFilteredStockData(lowStockItems)
        }
    }, [searchTerm])


    const transformRepairData = (data) => {
        const result = {
            pendingCounts: [],
            completedCounts: [],
            deliveredCounts: []
        };

        data.forEach(item => {
            if (item.status === 'Pending') {
                result.pendingCounts.push(item.count);
            } else if (item.status === 'Done') {
                result.completedCounts.push(item.count);
            } else if (item.status === 'Delivered') {
                result.deliveredCounts.push(item.count);
            }
        });

        return result;
    };

    const repairChartOptions = {
        title: {
            text: 'Repair Data Over Time',
            left: 'center'
        },
        xAxis: {
            type: 'category',
            data: repairData.dates,  // Replace with your repair data field
        },
        yAxis: {
            type: 'value'
        },
        color: ['#7058c6', '#9887d6', '#211354'],
        series: [
            {
                name: 'Pending Repairs',
                data: repairData.pendingCounts,  // Replace with your repair data field
                type: 'line',
                smooth: true
            },
            {
                name: 'Completed Repairs',
                data: repairData.completedCounts,  // Replace with your repair data field
                type: 'line',
                smooth: true
            },
            {
                name: 'Deliverd Repairs',
                data: repairData.deliveredCounts,  // Replace with your repair data field
                type: 'line',
                smooth: true
            }
        ],
        legend: {
            data: ['Pending Repairs', 'Completed Repairs', 'Deliverd Repairs'],
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
                                Stock
                            </Typography>
                            <div style={{ display: 'flex', flexDirection: 'row', position: 'relative' }}>
                                <div style={{ display: 'flex', alignItems: 'center', position: 'relative', width: '200px', marginRight: '15px' }}>
                                    <SearchIcon
                                        style={{
                                            position: 'absolute',
                                            left: '10px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: '#7058c6'
                                        }} />
                                    <input
                                        type="search"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        style={{
                                            height: '30px',
                                            padding: '0 10px 0 35px',  // Padding to account for the icon
                                            backgroundColor: '#FFFFFF',
                                            border: '1px solid #d1d1d1',  // Light gray border
                                            borderRadius: '5px',
                                            color: '#7058c6',  // Primary color for the text
                                            outline: 'none',
                                            transition: 'border-color 0.3s',
                                        }}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onFocus={(e) => e.target.style.borderColor = '#7058c6'}  // Border color on focus
                                        onBlur={(e) => e.target.style.borderColor = '#d1d1d1'}  // Border color on blur
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{ width: '100%' }}>
                            {filteredStockData.map((item, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '15px',
                                        padding: '15px',
                                        backgroundColor: '#ffffff',
                                        borderRadius: '8px',
                                        border: '1px solid #d1d1d1',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    }}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ color: '#7058c6' }}
                                    >
                                        {item.itemName}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{ color: '#FF6961' }}  // Red color for low stock warning
                                    >
                                        Stock: {item.quantity}
                                    </Typography>
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
                            <ReactECharts option={repairChartOptions} style={{ height: '100%' }} />
                        </Card>
                    </Grid>
                </Grid>
            </Grid >
        </div >
    );
}

export default AdminDashboard;
