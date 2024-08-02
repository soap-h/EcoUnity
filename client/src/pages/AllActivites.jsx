import React, { useEffect, useState, useContext } from 'react';
import UserContext from '../contexts/UserContext';
import { Link } from 'react-router-dom';
import { Box, Typography, Input, IconButton, Button, Paper, Grid } from '@mui/material';
import { Search, Clear, Edit, Add } from '@mui/icons-material';
import dayjs from 'dayjs';
import global from '../global';
import http from '../http';
import AdminSidebar from '../components/AdminSidebar'; // Import the AdminSidebar component

function Activities() {
    const [trackerList, setTrackerList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getActivites = () => {
        http.get('/activities').then((res) => {
            setTrackerList(res.data);
        });
    };

    const searchActivites = () => {
        http.get(`/activities?search=${search}`).then((res) => {
            setTrackerList(res.data);
        });
    };

    useEffect(() => {
        getActivites();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchActivites();
        }
    };

    const onClickSearch = () => {
        searchActivites();
    };

    const onClickClear = () => {
        setSearch('');
        getActivites();
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <AdminSidebar /> {/* Use the AdminSidebar component for navigation */}
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h4" sx={{ mb: 3 }}>
                    All Activities
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Input
                        value={search}
                        placeholder="Search"
                        onChange={onSearchChange}
                        onKeyDown={onSearchKeyDown}
                        sx={{ flexGrow: 1, mr: 1 }}
                    />
                    <IconButton color="primary" onClick={onClickSearch}>
                        <Search />
                    </IconButton>
                    <IconButton color="primary" onClick={onClickClear}>
                        <Clear />
                    </IconButton>
                    <Link to="/createActivity" style={{ textDecoration: 'none', marginLeft: 'auto' }}>
                        <Button variant='contained' startIcon={<Add />}>
                            Add Activity
                        </Button>
                    </Link>
                </Box>

                <Paper sx={{ width: '100%', height: '80vh', maxHeight: '80vh', overflowY: 'auto', borderRadius: 2, p: 3 }}>
                    <Grid container sx={{ mb: 2, bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}>
                        <Grid item xs={4}>
                            <Typography variant="body1">Date</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">Activity</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant="body1">Points</Typography>
                        </Grid>
                    </Grid>
                    {
                        trackerList.length === 0 ? (
                            <Typography sx={{ textAlign: 'center', color: 'gray' }}>No Recorded activities</Typography>
                        ) : (
                            trackerList.map((tracker) => (
                                <Grid container key={tracker.id} sx={{ mb: 2, p: 1, bgcolor: '#fff', borderBottom: '1px solid #ddd' }}>
                                    <Grid item xs={4}>
                                        <Typography variant="body2">
                                            {dayjs(tracker.createdAt).format(global.datetimeFormat)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2">
                                            {tracker.title}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Typography variant="body2">
                                            {tracker.points}
                                        </Typography>
                                        <Link to={`/editactivity/${tracker.id}`}>
                                            <IconButton color="primary" sx={{ padding: '4px' }}>
                                                <Edit />
                                            </IconButton>
                                        </Link>
                                    </Grid>
                                </Grid>
                            ))
                        )
                    }
                </Paper>
            </Box>
        </Box>
    );
}

export default Activities;
