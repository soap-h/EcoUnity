import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, Divider, Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Paper } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import UserContext from "../contexts/UserContext";
import http from "../http";
import { toast } from 'react-toastify';

function Inbox() {
    const { user } = useContext(UserContext);
    const [mails, setMails] = useState([]);
    const [selectedMail, setSelectedMail] = useState(null);
    const [filter, setFilter] = useState('all');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteMailId, setDeleteMailId] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchMails();
        fetchUsers();
    }, []);

    const fetchMails = () => {
        http.get("/inbox").then((res) => {
            const sortedMails = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setMails(sortedMails);
        }).catch(err => console.error("Failed to fetch mails:", err));
    };

    const fetchUsers = () => {
        http.get("/user/userinfo").then((res) => {
            setUsers(res.data);
        }).catch(err => console.error("Failed to fetch user info:", err));
    };

    const getUserEmailById = (userId) => {
        const user = users.find(u => u.id === userId);
        return user ? user.email : "Unknown sender";
    };

    const handleSelectMail = (mail) => {
        setSelectedMail(mail);
        if (mail.unread === 1) {
            markAsRead(mail.id);
        }
    };

    const markAsRead = (id) => {
        http.put(`/inbox/${id}/read`).then(() => {
            setMails(prevMails =>
                prevMails.map(mail =>
                    mail.id === id ? { ...mail, unread: 0 } : mail
                )
            );
        }).catch(err => console.error("Failed to mark mail as read:", err));
    };

    const filterMails = (category) => {
        setFilter(category);
    };

    const handleDeleteMail = (id) => {
        setOpenDeleteDialog(true);
        setDeleteMailId(id);
    };

    const confirmDeleteMail = () => {
        http.delete(`/inbox/${deleteMailId}`).then(() => {
            setMails(mails.filter(mail => mail.id !== deleteMailId));
            setOpenDeleteDialog(false);
            setSelectedMail(null); // Deselect the mail after deletion
            toast.success("Mail deleted successfully");
        }).catch(err => {
            console.error("Error deleting mail:", err);
            toast.error("Failed to delete mail");
        });
    };

    const closeDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const filteredMails = filter === 'all' ? mails : mails.filter(mail => mail.category.toLowerCase() === filter.toLowerCase());

    const getCategoryButton = (category, key) => (
        <Button
            key={key}
            variant={filter.toLowerCase() === category.toLowerCase() ? "contained" : "outlined"}
            onClick={() => filterMails(category.toLowerCase())}
            fullWidth
            sx={{ mb: 1 }}
        >
            {category.charAt(0).toUpperCase() + category.slice(1)}
        </Button>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', p: 3 }}>
            <Box sx={{ width: 200, mr: 2 }}>
                <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>Categories</Typography>
                {['all', 'events', 'forum', 'misc'].map((category) =>
                    getCategoryButton(category, category)
                )}
            </Box>

            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', overflow: 'auto', mr: 2 }}>
                <Typography variant="h6" sx={{ p: 2, textAlign: 'center' }}>Your Inbox</Typography>
                {filteredMails.map(mail => (
                    <React.Fragment key={mail.id}>
                        <ListItem
                            button
                            onClick={() => handleSelectMail(mail)}
                            selected={selectedMail && mail.id === selectedMail.id}
                            sx={{
                                bgcolor: mail.unread ? '#e3f2fd' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                borderLeft: selectedMail && mail.id === selectedMail.id ? '4px solid #1976d2' : 'none', 
                                transition: 'background-color 0.3s, border-left 0.3s',
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar>{mail.title[0]}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={mail.title}
                                secondary={`From: ${getUserEmailById(mail.userId)}`}
                                sx={{
                                    '& .MuiListItemText-primary': {
                                        fontWeight: mail.unread ? 'bold' : 'normal',
                                    },
                                    '& .MuiListItemText-secondary': {
                                        color: selectedMail && mail.id === selectedMail.id ? 'text.primary' : 'text.secondary',
                                    }
                                }}
                            />
                            {selectedMail && mail.id === selectedMail.id && (
                                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteMail(mail.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            )}
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                ))}
            </List>
            <Dialog open={openDeleteDialog} onClose={closeDeleteDialog}>
                <DialogTitle>Delete Message</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this message?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog}>Cancel</Button>
                    <Button onClick={confirmDeleteMail} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
            {selectedMail ? (
                <Paper elevation={3} sx={{ flex: 1, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
                    <Typography variant="h5" sx={{ mb: 2, borderBottom: '2px solid #1976d2', pb: 1 }}>{selectedMail.title}</Typography>
                    <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
                        From: {getUserEmailById(selectedMail.userId)}
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                        {selectedMail.content}
                    </Typography>
                </Paper>
            ) : (
                <Paper elevation={3} sx={{ flex: 1, p: 3, bgcolor: 'background.paper', borderRadius: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        Select a message to view its content.
                    </Typography>
                </Paper>
            )}
        </Box>
    );
}

export default Inbox;
