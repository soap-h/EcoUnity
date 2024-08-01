import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, Divider, Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';
import UserContext from "../contexts/UserContext";
import http from "../http";

function Inbox() {
    const { user } = useContext(UserContext);
    const [mails, setMails] = useState([]);
    const [selectedMail, setSelectedMail] = useState(null);
    const [filter, setFilter] = useState('All');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteMailId, setDeleteMailId] = useState(null);
    const [users, setUsers] = useState([]);


    useEffect(() => {
        fetchMails();
        fetchUsers();
    }, []);

    const fetchMails = () => {
        http.get("/inbox").then((res) => {
            console.log(res.data); 
            setMails(res.data);
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

    const filteredMails = filter === 'All' ? mails : mails.filter(mail => mail.category === filter);

    const getCategoryButton = (category, key) => (
        <Button
            key={key}  // Add key here
            variant={filter === category ? "contained" : "outlined"}
            onClick={() => filterMails(category)}
            fullWidth
            sx={{ mb: 1 }}
        >
            {category}
        </Button>
    );


    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', p: 3 }}>
            <Box sx={{ width: 200, mr: 2 }}>
                <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>Categories</Typography>
                {['All', 'Events', 'Forum', 'Misc'].map((category) =>
                    getCategoryButton(category, category)  // Pass category as a key
                )}
            </Box>

            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', overflow: 'auto', mr: 2 }}>
                <Typography variant="h6" sx={{ p: 2, textAlign: 'center' }}>Your Inbox</Typography>
                {mails.map(mail => (
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
                                secondary={`From: ${getUserEmailById(mail.userId)}`}  // Display sender email instead of ID
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
