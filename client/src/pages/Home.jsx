import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Menu, MenuItem, IconButton, InputBase, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
    const [anchorElEvents, setAnchorElEvents] = useState(null);
    const [anchorElLocations, setAnchorElLocations] = useState(null);

    const handleMenuEventsClick = (event) => {
        setAnchorElEvents(event.currentTarget);
    };

    const handleMenuEventsClose = () => {
        setAnchorElEvents(null);
    };

    const handleMenuLocationsClick = (event) => {
        setAnchorElLocations(event.currentTarget);
    };

    const handleMenuLocationsClose = () => {
        setAnchorElLocations(null);
    };

    return (
        <Box>
            <Box
                component="div"
                sx={{
                    height: 'calc(100vh - 128px)', // adjust height as necessary
                    backgroundImage: 'url(/src/assets/home-background.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    textAlign: 'center',
                    p: 2,
                }}
            >
                <Typography variant="h3" gutterBottom>
                    FIND EVERYTHING YOU NEED
                </Typography>
                <Typography variant="h4" gutterBottom>
                    IN ONE PLACE
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" sx={{ mr: 2, backgroundColor: '#00796b' }} 
                    component={Link} to="/locations">
                        EXPLORE
                    </Button>
                    <Button variant="contained" sx={{ backgroundColor: '#212121' }}
                    component={Link} to="/learning">
                        LEARN MORE
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default Home;
