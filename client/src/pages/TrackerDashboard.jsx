import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import http from '../http';
import AdminSidebar from '../components/AdminSidebar';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [data, setData] = useState({});
    const [timeframe, setTimeframe] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchData(timeframe);
    }, [timeframe]);

    const fetchData = async (timeframe) => {
        try {
            const response = await http.get(`/tracker/dashboard?timeframe=${timeframe}`);
            setData(response.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        }
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    const renderPieChart = (data) => {
        const pieData = data.map(item => ({
            name: item.title,
            value: parseInt(item.totalPoints, 10)
        }));

        return (
            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie
                        dataKey="value"
                        isAnimationActive={false}
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend layout="vertical" align="right" verticalAlign="middle" />
                </PieChart>
            </ResponsiveContainer>
        );
    };

    const renderLineChart = (data) => (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="co2Saved" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );

    const calculateTreesPlanted = (co2Saved) => {
        return (co2Saved / 100).toFixed(0);
    };

    const calculateKmDriven = (co2Saved) => {
        return (co2Saved / 500).toFixed(0);
    };

    const calculateWaterGallonsSaved = (co2Saved) => {
        return (co2Saved / 200).toFixed(0);
    };

    const calculateLightBulbHours = (co2Saved) => {
        return (co2Saved / 50).toFixed(0);
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <AdminSidebar /> {/* Sidebar Component */}
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Grid item>
                        <Typography variant="h4">Dashboard</Typography>
                    </Grid>
                    <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => navigate("/activities")}
                                sx={{ textDecoration: 'none' }}
                            >
                                Go to Activities
                            </Button>
                        </Grid>
                        <Grid item>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6">Filter</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                                    <Button variant="contained" onClick={() => setTimeframe('all')}>All</Button>
                                    <Button variant="contained" onClick={() => setTimeframe('year')}>Year</Button>
                                    <Button variant="contained" onClick={() => setTimeframe('month')}>Month</Button>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6">Total CO2 Saved</Typography>
                            <Typography variant="h4">{data.totalCo2Saved / 1000 || 0} Kg</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6">Average CO2 Saved</Typography>
                            <Typography variant="h4">{(data.averageCo2Saved / 1000).toFixed(2) || 0} Kg</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6">Active Users</Typography>
                            <Typography variant="h4">{data.activeUsers || 0}</Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Grid container spacing={3} sx={{ mt: 3 }}>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6">Top Activities Contributing to CO2 Savings</Typography>
                            {renderPieChart(data.topActivities || [])}
                        </Paper>
                    </Grid>
                </Grid>

                <Grid container spacing={3} sx={{ mt: 3 }}>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6">Total CO2 Saved Over Time</Typography>
                            {renderLineChart(data.co2SavedOverTime || [])}
                        </Paper>
                    </Grid>
                </Grid>

                <Grid container spacing={3} sx={{ mt: 3 }}>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" align="center">Environmental Impact</Typography>
                            <Grid container spacing={2} justifyContent="center">
                                <Grid item xs={12} sm={3}>
                                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                                        <Typography variant="h3">{calculateTreesPlanted(data.totalCo2Saved)}</Typography>
                                        <Typography variant="body1">Trees Planted</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                                        <Typography variant="h3">{calculateKmDriven(data.totalCo2Saved)}</Typography>
                                        <Typography variant="body1">Km Driven by Cars</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                                        <Typography variant="h3">{calculateWaterGallonsSaved(data.totalCo2Saved)}</Typography>
                                        <Typography variant="body1">Water Gallons Saved</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                                        <Typography variant="h3">{calculateLightBulbHours(data.totalCo2Saved)}</Typography>
                                        <Typography variant="body1">Light Bulb Hours</Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Dashboard;
