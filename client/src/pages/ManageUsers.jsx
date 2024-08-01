import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Avatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import http from '../http';
import AdminSidebar from '../components/AdminSidebar';
import UserContext from '../contexts/UserContext';

function AdminPage() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [adminStatus, setAdminStatus] = useState("");

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        http.get("user/userinfo")
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Failed to fetch users:', error);
                toast.error('Failed to fetch users');
            });
    };

    const handleDelete = (userId) => {
        http.delete(`/user/${userId}`)
            .then((res) => {
                getUsers();
            }).catch((error) => {
                console.error('Error deleting user:', error);
                toast.error('Error deleting user.');
            });
    };

    const handleEditOpen = (user) => {
        setSelectedUser(user);
        setAdminStatus(user.isAdmin ? '1' : '0');
        setOpenDialog(true);
    };

    const handleEditClose = () => {
        setOpenDialog(false);
        setSelectedUser(null);
    };

    const handleStatusChange = (e) => {
        setAdminStatus(e.target.value);
    };

    const handleSave = () => {
        if (selectedUser) {
            http.put(`/user/${selectedUser.id}`, { isAdmin: adminStatus === '1' })
                .then((res) => {
                    console.log(res.data);
                    toast.success('Admin status updated successfully!');
                    getUsers();
                    handleEditClose();
                })
                .catch((error) => {
                    console.error('Error updating admin status:', error);
                    toast.error('Error updating admin status.');
                });
        }
    };

    const filteredUsers = users.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const adminCount = users.filter(user => user.isAdmin).length;

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Box sx={{ width: '250px' }}>
                <AdminSidebar username={user?.firstName || 'User'} />
            </Box>
            <Box sx={{ flexGrow: 1, padding: 3 }}>
                <Typography variant="h5" sx={{ my: 2 }}>
                    Account Management
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6">Site Members</Typography>
                            <Typography variant="h4">{users.length}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6">Admin</Typography>
                            <Typography variant="h4">{adminCount}</Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <TextField
                        label="Search"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Admin Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <Avatar
                                            src={`${import.meta.env.VITE_FILE_PROFILE_URL}/${user.imageFile}`}
                                            alt={`${user.firstName} ${user.lastName}`}
                                        />
                                    </TableCell>
                                    <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.isAdmin ? 'ADMIN' : 'USER'}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEditOpen(user)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(user.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={openDialog} onClose={handleEditClose}>
                    <DialogTitle>Edit Admin Status</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Change the admin status for {selectedUser?.firstName} {selectedUser?.lastName}.
                        </DialogContentText>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="admin-status-label">Admin Status</InputLabel>
                            <Select
                                labelId="admin-status-label"
                                value={adminStatus}
                                onChange={handleStatusChange}
                                label="Admin Status"
                            >
                                <MenuItem value="1">ADMIN</MenuItem>
                                <MenuItem value="0">USER</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditClose}>Cancel</Button>
                        <Button onClick={handleSave} variant="contained">Save</Button>
                    </DialogActions>
                </Dialog>

                <ToastContainer />
            </Box>
        </Box>
    );
}

export default AdminPage;
