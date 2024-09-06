import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';

const StaffPerformanceChart = ({ performanceData }) => {
    const [duration, setDuration] = useState('weekly');

    const handleDurationChange = (event) => {
        setDuration(event.target.value);
        // Fetch the data again based on the selected duration
    };

    const chartOptions = {
        title: {
            text: '',
            left: 'left',
        },
        xAxis: {
            type: 'category',
            data: performanceData?.days,
        },
        yAxis: {
            type: 'value',
        },
        color: '#9ad6d7',
        series: [
            {
                data: performanceData?.count,
                type: 'bar',
            }
        ],
        tooltip: {
            trigger: 'axis',
            formatter: '{b0}: {c0}' // Format: Date: Count
        }
    };

    return (
        <div style={{ height: '100%', width: '100%' }} >
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px', marginLeft: '20px', textAlign: 'left' }}>
                Your past week performance
            </Typography>
            {performanceData  ? (
                <ReactECharts option={chartOptions} style={{ height: '100%', width: '100%' }} />

            ) : (
                <div style={{ height: '100%', width: '100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center' }} >
                    <Typography variant="p" sx={{ fontWeight: 'bold', marginBottom: '10px', marginLeft: '20px', textAlign: 'left' }}>
                        No performance data to display
                    </Typography>
                </div>
            )}
        </div>
    );
};

export default StaffPerformanceChart;
