import React, { useContext } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import AdminSidebar from '../components/AdminSidebar';
import UserContext from '../contexts/UserContext';

const AdminDashboard = () => {
    const { user } = useContext(UserContext);

    return (
        <Box sx={{ display: 'flex' }}>
            <AdminSidebar username={user?.firstName || 'User'} />
            <Box sx={{ flexGrow: 1, padding: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Hello {user?.firstName || 'User'}, it's good to see you again!
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ padding: 2, backgroundColor: '#f5f5f5', textAlign: 'center' }}>
                            <Typography variant="h6">
                                Pending Proposals
                            </Typography>
                            <Typography variant="h4" sx={{ color: '#4CAF50' }}>
                                6
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default AdminDashboard;
