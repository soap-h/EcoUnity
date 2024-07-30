import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Avatar, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DataSaverOffIcon from '@mui/icons-material/DataSaverOff';
import EventIcon from '@mui/icons-material/Event';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ReportIcon from '@mui/icons-material/Report';
import ForumIcon from '@mui/icons-material/Forum';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import QuizIcon from '@mui/icons-material/Quiz';
import LogoutIcon from '@mui/icons-material/Logout';
import EcoUnityLogo from '../assets/Eco Unity.png';
import { Link } from 'react-router-dom';

const AdminSidebar = ({ username }) => {
    return (
        <Box sx={{ width: 200, height: '90vh', backgroundColor: '#5a9895', borderRadius: '20px', margin: 2, color: 'white', padding: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2 }}>
                <Avatar alt="Eco Unity Logo" src={EcoUnityLogo} sx={{ width: 80, height: 80 }} />
            </Box>
            <List>
                <ListItem button component={Link} to="/admin">
                    <ListItemIcon sx={{ color: 'white' }}>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button component={Link} to="/admin/eco-tracker">
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
                <ListItem button component={Link} to="/admin/forum-moderation">
                    <ListItemIcon sx={{ color: 'white' }}>
                        <ForumIcon />
                    </ListItemIcon>
                    <ListItemText primary="Forum Moderation" />
                </ListItem>
                <ListItem button component={Link} to="/admin/account-management">
                    <ListItemIcon sx={{ color: 'white' }}>
                        <AccountBoxIcon />
                    </ListItemIcon>
                    <ListItemText primary="Account Management" />
                </ListItem>
                <ListItem button component={Link} to="/admin/quiz-management">
                    <ListItemIcon sx={{ color: 'white' }}>
                        <QuizIcon />
                    </ListItemIcon>
                    <ListItemText primary="Quiz Management" />
                </ListItem>
                <ListItem button component={Link} to="/logout">
                    <ListItemIcon sx={{ color: 'white' }}>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </Box>
    );
};

export default AdminSidebar;
