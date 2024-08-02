import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Avatar, Typography, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DataSaverOffIcon from '@mui/icons-material/DataSaverOff';
import EventIcon from '@mui/icons-material/Event';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ReportIcon from '@mui/icons-material/Report';
import ForumIcon from '@mui/icons-material/Forum';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import QuizIcon from '@mui/icons-material/Quiz';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LogoutIcon from '@mui/icons-material/Logout';
import EcoUnityLogo from '../assets/Eco Unity.png';
import { Link } from 'react-router-dom';

const AdminSidebar = ({ username }) => {
    return (
        <Box sx={{ width: 240, height: '95vh', backgroundColor: '#5a9895', borderRadius: '20px', margin: 2, color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2 }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Avatar alt="Eco Unity Logo" src={EcoUnityLogo} sx={{ width: 80, height: 80 }} />
                    </Link>
                </Box>
                <Box sx={{ overflowY: 'auto', height: 'calc(100% - 100px)', paddingRight: 2 }} className="sidebar-scrollbar">
                    <List>
                        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
                        <ListItem button component={Link} to="/admin">
                            <ListItemIcon sx={{ color: 'white' }}>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItem>
                        <ListItem button component={Link} to="/admin/trackerdashboard">
                            <ListItemIcon sx={{ color: 'white' }}>
                                <DataSaverOffIcon />
                            </ListItemIcon>
                            <ListItemText primary="Personal Eco-Tracker" />
                        </ListItem>
                        <ListItem button component={Link} to="/admin/events">
                            <ListItemIcon sx={{ color: 'white' }}>
                                <EventIcon />
                            </ListItemIcon>
                            <ListItemText primary="Events" />
                        </ListItem>
                        <ListItem button component={Link} to="/admin/event-feedback">
                            <ListItemIcon sx={{ color: 'white' }}>
                                <FeedbackIcon />
                            </ListItemIcon>
                            <ListItemText primary="Event Feedback" />
                        </ListItem>
                        <ListItem button component={Link} to="/admin/incident-reports">
                            <ListItemIcon sx={{ color: 'white' }}>
                                <ReportIcon />
                            </ListItemIcon>
                            <ListItemText primary="Incident Reports" />
                        </ListItem>
                        <ListItem button component={Link} to="/admin/reportthread">
                            <ListItemIcon sx={{ color: 'white' }}>
                                <ForumIcon />
                            </ListItemIcon>
                            <ListItemText primary="Forum Moderation" />
                        </ListItem>
                        <ListItem button component={Link} to="/admin/manageusers">
                            <ListItemIcon sx={{ color: 'white' }}>
                                <AccountBoxIcon />
                            </ListItemIcon>
                            <ListItemText primary="Account Management" />
                        </ListItem>
                        <ListItem button component={Link} to="/admin/merchandise-management">
                            <ListItemIcon sx={{ color: 'white' }}>
                                <ShoppingBagIcon />
                            </ListItemIcon>
                            <ListItemText primary="Merchandise Management" />
                        </ListItem>
                        <ListItem button component={Link} to="/admin/quiz-management">
                            <ListItemIcon sx={{ color: 'white' }}>
                                <QuizIcon />
                            </ListItemIcon>
                            <ListItemText primary="Quiz Management" />
                        </ListItem>
                    </List>
                </Box>
            </Box>
            <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', padding: 2, borderRadius: '0 0 20px 20px' }}>
                <ListItem button component={Link} to="/logout">
                    <ListItemIcon sx={{ color: 'white' }}>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </Box>
        </Box>
    );
};

export default AdminSidebar;
