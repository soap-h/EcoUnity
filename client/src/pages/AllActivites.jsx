import React, { useEffect, useState, useContext } from 'react';
import UserContext from '../contexts/UserContext';
import { Link } from 'react-router-dom';
import { Box, Typography, Input, IconButton, Button } from '@mui/material';
import { Search, Clear, Edit, Add } from '@mui/icons-material';
import dayjs from 'dayjs';
import global from '../global';
import http from '../http';

import bannerImage from '../assets/images/Picture1.png';

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
    }
    const onClickClear = () => {
        setSearch('');
        getActivites();
    };

    useEffect(() => {
        http.get('/activities').then((res) => {
            console.log(res.data);
            setTrackerList(res.data);
        });
    }, []);
    return (
        <Box sx={{ p: 2 }}>
            <Box
                component="img"
                src={bannerImage}
                alt="Banner"
                sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    mb: 2,
                }}
            />

            <Typography variant="h5" sx={{ my: 2 }}>
                All Activities
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, width: '100%' }}>
                <Input value={search} placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown} />
                <IconButton color="primary" onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary" onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                <Link to="/createActivity" style={{ textDecoration: 'none' }}>
                    <Button variant='contained'>
                        <Add></Add>
                    </Button>
                </Link>
            </Box>
            <Box sx={{ width: '96%', height: '80vh', maxHeight: '80vh', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '8px', p: 3, mr: 8, position: "relative" }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '98%', mb: 2, bgcolor: '#f5f5f5', p: 1, borderRadius: '4px', }}>
                    <Typography variant="body1" sx={{ width: '30%' }}>
                        Date
                    </Typography>
                    <Typography variant="body1" sx={{ width: '55%' }}>
                        Activity
                    </Typography>
                    <Typography variant="body1" sx={{ width: '19%' }}>
                        Points
                    </Typography>
                </Box>
                {
                    trackerList.length === 0 ? (
                        <Typography sx={{ textAlign: 'center', color: 'gray' }}>No Recorded activities</Typography>
                    ) : (
                        trackerList.map((tracker) => (
                            <Box key={tracker.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, p: 1, bgcolor: '#fff', borderBottom: '1px solid #ddd' }}>
                                <Typography variant="body2" sx={{ width: '30%' }}>
                                    {dayjs(tracker.createdAt).format(global.datetimeFormat)}
                                </Typography>
                                <Typography variant="body2" sx={{ width: '55%' }}>
                                    {tracker.title}
                                </Typography>
                                <Typography variant="body2" sx={{ width: '15%' }}>
                                    {tracker.points}
                                </Typography>

                                <Link to={`/editactivity/${tracker.id}`}>
                                    <IconButton color="primary" sx={{ padding: '4px' }}>
                                        <Edit />
                                    </IconButton>
                                </Link>

                            </Box>
                        ))
                    )
                }
            </Box>
        </Box>
    )
}
export default Activities;