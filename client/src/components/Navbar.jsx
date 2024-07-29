import React, { useEffect, useState, useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, TextField, InputAdornment, Box, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import LoginIcon from '@mui/icons-material/Login'
import EcoUnityLogo from '../assets/Eco Unity.png';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import UserContext from '../contexts/UserContext';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(UserContext);
    const logout = () => {
        localStorage.clear();
        window.location = "/";
      };

    const navItems = [
        { title: 'Home', path: '/' },
        { title: 'Events', path: '/events' },
        { title: 'Forums', path: '/forums' },
        { title: 'Learning', path: '/learning' },
        { title: 'Merchandise', path: '/merchandise' },
        { title: 'Locations', path: '/locations' },
    ];

    return (
        <Box sx={{ width: '100%' }}>
            {/* Top Banner */}
            <Box sx={{ backgroundColor: '#5A9895', color: 'white', textAlign: 'center', py: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                <Typography variant="h6" sx={{ mr: 1 }}>
                    REGISTER TO BE A COMMUNITY VOLUNTEER!
                </Typography>
                <ChevronRightIcon />
            </Box>

            {/* Middle Row */}
            <AppBar position="static" color="default" sx={{ background: '#F6F7F9', py: 0.25 }}>
                <Toolbar>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item sx={{ pl: { sm: 2, md: 6, lg: 10 } }}>
                            <img src={EcoUnityLogo} alt="ECO UNITY Logo" style={{ height: '110px' }} />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="What are you looking for?"
                                size="small"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton sx={{
                                                backgroundColor: '#075F6B', borderRadius: 0, color: "white",
                                                '&:hover': { backgroundColor: '#0f707c !important' }
                                            }}>
                                                <SearchIcon />
                                                <Typography sx={{ fontWeight: "bold" }}>
                                                    Search
                                                </Typography>
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    style: { paddingRight: 0 },
                                }}
                                sx={{
                                    outline: 3,
                                    color: '#075F6B',
                                    borderRadius: 2,
                                    border: 0,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { border: 0 },
                                        '&:hover fieldset': { border: 0 },
                                        '&.Mui-focused fieldset': { border: 0 },
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item sx={{ pr: { sm: 2, md: 6, lg: 10 }, display: 'flex', flexDirection: 'row' }}>

                            {
                                !user && (
                                    <IconButton color="inherit" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mr: 3 }}
                                        onClick={() => navigate("/Register")}>
                                        <PersonAddAlt1Icon sx={{ height: 40, width: 40 }} />
                                        <Typography>Sign Up</Typography>
                                    </IconButton>


                                )
                            }
                            {
                                
                                !user && (
                                    <IconButton color="inherit" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', ml: 3 }}
                                        onClick={() => navigate("/Login")}>
                                        <LoginIcon sx={{ height: 40, width: 40 }} />
                                        <Typography>Login</Typography>
                                    </IconButton>
                                )
                            }

                                                        {
                                user && (
                                    <IconButton color="inherit" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mr: 3 }}
                                        onClick={() => navigate(`/profile/${user.id}`)}>
                                        <PersonAddAlt1Icon sx={{ height: 40, width: 40 }} />
                                        <Typography>{user.firstName}</Typography>
                                    </IconButton>


                                )
                            }
                            {
                                user && (
                                    <IconButton color="inherit" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', ml: 3 }}
                                        onClick={logout}>
                                        <LoginIcon sx={{ height: 40, width: 40 }} />
                                        <Typography>Logout</Typography>
                                    </IconButton>
                                )
                            }

                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>

            {/* Bottom Row */}
            <AppBar position="static" color="inherit" sx={{ background: '#9FCCC9' }}>
                <Toolbar>

                    <Grid container justifyContent="center">
                        {navItems.map((item) => (
                            <Grid item key={item.title}>
                                <Button color="inherit"
                                    sx={{
                                        fontFamily: 'Inter',
                                        fontSize: 16,
                                        fontWeight: 600,
                                        mx: { sm: 1, md: 2.5, lg: 5.5 },
                                        backgroundColor: location.pathname === item.path ? '#075F6B' : 'inherit',
                                        color: location.pathname === item.path ? 'white' : 'inherit',
                                        '&:hover': { backgroundColor: location.pathname === item.path ? '#064e5b' : '#cde0df' }
                                    }}
                                    onClick={() => navigate(item.path)}>{item.title}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>

                </Toolbar>
            </AppBar>

        </Box>
    );
}

export default Navbar;
