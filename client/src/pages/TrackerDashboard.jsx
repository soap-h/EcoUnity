import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import http from '../http';
import AdminSidebar from '../components/AdminSidebar';
import { useNavigate } from 'react-router-dom';
import TableauDashboard from '../components/TableauDashboard';

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
        <Box>
        <h2>Tracker Dashboard</h2>
        
        <TableauDashboard />
        
        </Box>
        </Box>
    );
};

export default Dashboard;
