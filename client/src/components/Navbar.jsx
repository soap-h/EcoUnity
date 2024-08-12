import React, { useEffect, useState, useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, TextField, InputAdornment, Box, Grid, Avatar, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import LoginIcon from '@mui/icons-material/Login';
import EcoUnityLogo from '../assets/Eco Unity.png';
import TrackerLogo from "../assets/images/tracker.png";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MicIcon from '@mui/icons-material/Mic';
import UserContext from '../contexts/UserContext';

function Navbar({ setOpenLogin, setOpenRegister }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(UserContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchText, setSearchText] = useState('');

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const logout = () => {
        localStorage.clear();
        window.location = "/";
    };

    const navItems = [
        { title: "Home", path: "/" },
        { title: "Events", path: "/events" },
        { title: "Forums", path: "/forum" },
        { title: "Learning", path: "/learning" },
        { title: "Merchandise", path: "/merchandise" },
        { title: "Locations", path: "/locations" },
    ];

    const handleVoiceSearch = () => {
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.start();

        recognition.onresult = (event) => {
            const spokenText = event.results[0][0].transcript.toLowerCase();
            setSearchText(spokenText);

            const matchedItem = navItems.find(item => item.title.toLowerCase() === spokenText);
            if (matchedItem) {
                navigate(matchedItem.path);
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
        };
    };

    if (location.pathname.startsWith('/admin')) {
        return null; // Don't render navbar on admin pages
    }

    return (
        <Box sx={{ width: "100%" }}>
            {/* Top Banner */}
            <Box
                sx={{
                    backgroundColor: "#5A9895",
                    color: "white",
                    textAlign: "center",
                    py: 1,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography variant="body1" sx={{ mr: 1 }}>
                    REGISTER TO BE A COMMUNITY VOLUNTEER!
                </Typography>
                <ChevronRightIcon />
            </Box>

            {/* Middle Row */}
            <AppBar position="static" color="default" sx={{ background: "#F6F7F9", py: 0.25 }}>
                <Toolbar>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item sx={{ pl: { sm: 2, md: 6, lg: 10 } }}>
                            <img src={EcoUnityLogo} alt="ECO UNITY Logo" style={{ height: "110px" }} />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="What are you looking for?"
                                size="small"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                sx={{
                                                    backgroundColor: "#075F6B",
                                                    borderRadius: 0,
                                                    color: "white",
                                                    "&:hover": { backgroundColor: "#0f707c !important" },
                                                }}
                                                onClick={handleVoiceSearch}
                                            >
                                                <MicIcon />
                                            </IconButton>
                                            <IconButton
                                                sx={{
                                                    backgroundColor: "#075F6B",
                                                    borderRadius: 0,
                                                    color: "white",
                                                    "&:hover": { backgroundColor: "#0f707c !important" },
                                                }}
                                            >
                                                <SearchIcon />
                                                <Typography sx={{ fontWeight: "bold" }}>Search</Typography>
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    style: { paddingRight: 0 },
                                }}
                                sx={{
                                    outline: 3,
                                    color: "#075F6B",
                                    borderRadius: 2,
                                    border: 0,
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": { border: 0 },
                                        "&:hover fieldset": { border: 0 },
                                        "&.Mui-focused fieldset": { border: 0 },
                                    },
                                }}
                            />
                        </Grid>

                        <Grid item sx={{ pr: { sm: 2, md: 6, lg: 10 }, display: 'flex', flexDirection: 'row' }}>

                            {!user && (
                                <IconButton color="inherit" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mr: 3 }}
                                    onClick={() => setOpenRegister(true)}>
                                    <PersonAddAlt1Icon sx={{ height: 40, width: 40 }} />
                                    <Typography>Sign Up</Typography>
                                </IconButton>
                            )}
                            {!user && (
                                <IconButton color="inherit" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', ml: 3 }}
                                    onClick={() => setOpenLogin(true)}>
                                    <LoginIcon sx={{ height: 40, width: 40 }} />
                                    <Typography>Login</Typography>
                                </IconButton>
                            )}

                            {user && (
                                <IconButton color="inherit" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mr: 3 }}
                                    onClick={() => navigate("/Tracker")}>
                                    <Avatar
                                        alt={`${user.firstName} ${user.lastName}`}
                                        src={TrackerLogo}
                                        sx={{ width: 50, height: 50 }}
                                    />
                                    <Typography>EcoTracker</Typography>
                                </IconButton>
                            )}

                            {user && (
                                <>
                                    <IconButton color="inherit" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', ml: 3 }}
                                        onClick={handleMenuOpen}>
                                        <Avatar
                                            alt={`${user.firstName} ${user.lastName}`}
                                            src={`${import.meta.env.VITE_FILE_PROFILE_URL}${user.imageFile}`}
                                            sx={{ width: 50, height: 50 }}
                                        />
                                        <Typography>{user.firstName}</Typography>
                                    </IconButton>

                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleMenuClose}
                                    >
                                        <MenuItem onClick={() => { handleMenuClose(); navigate(`/profile/${user.id}`) }}>Profile</MenuItem>
                                        <MenuItem onClick={() => { handleMenuClose(); navigate('/inbox') }}>Inbox</MenuItem>
                                        <MenuItem onClick={() => { handleMenuClose(); logout(); }}>Logout</MenuItem>
                                    </Menu>
                                </>
                            )}
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>

            {/* Bottom Row */}
            <AppBar position="static" color="inherit" sx={{ background: "#9FCCC9" }}>
                <Toolbar>
                    <Grid container justifyContent="center">
                        {navItems.map((item) => (
                            <Grid item key={item.title}>
                                <Button
                                    color="inherit"
                                    sx={{
                                        fontFamily: "Inter",
                                        fontSize: 16,
                                        fontWeight: 600,
                                        mx: { sm: 1, md: 2.5, lg: 5.5 },
                                        backgroundColor: location.pathname === item.path ? "#075F6B" : "inherit",
                                        color: location.pathname === item.path ? "white" : "inherit",
                                        "&:hover": { backgroundColor: location.pathname === item.path ? "#064e5b" : "#cde0df" },
                                    }}
                                    onClick={() => navigate(item.path)}
                                >
                                    {item.title}
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
