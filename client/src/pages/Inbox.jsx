import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, Divider, Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';
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
                            sx={{ bgcolor: selectedMail && mail.id === selectedMail.id ? 'action.selected' : 'transparent' }}
                        >
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>{mail.title[0]}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={mail.title}
                                secondary={`From: ${getUserEmailById(mail.userId)}`}
                            />
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
            {selectedMail && (
                <Box sx={{ flex: 1, p: 3, bgcolor: 'grey.100' }}>
                    <Typography variant="h5">{selectedMail.title}</Typography>
                    <Typography variant="subtitle1">From: {getUserEmailById(selectedMail.userId)}</Typography>
                    <Typography variant="body1">{selectedMail.content}</Typography>
                </Box>
            )}
        </Box>
    );
}

export default Inbox;
