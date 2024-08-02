// ReportThreadAdmin.jsx
import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Menu, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import http from '../../http';
import AdminSidebar from '../../components/AdminSidebar';
import UserContext from '../../contexts/UserContext';
import ReportThreadCard from '../../components/Forum/ReportThreadCard';
import dayjs from 'dayjs';

const ReportThreadAdmin = () => {
    const { user } = React.useContext(UserContext);
    const [reports, setReports] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);
    const [openView, setOpenView] = useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [openApproveConfirm, setOpenApproveConfirm] = useState(false);

    const fetchReports = async () => {
        try {
            const res = await http.get('/reportthread');
            setReports(res.data);
        } catch (error) {
            console.error('Failed to fetch reports:', error);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleMenuOpen = (event, report) => {
        setSelectedReport(report);
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleOpenViewDialog = () => {
        setOpenView(true);
    };

    const handleCloseViewDialog = () => {
        setOpenView(false);
    };

    const handleOpenDeleteConfirmDialog = () => {
        setOpenDeleteConfirm(true);
    };

    const handleCloseDeleteConfirmDialog = () => {
        setOpenDeleteConfirm(false);
    };

    const handleOpenApproveConfirmDialog = () => {
        setOpenApproveConfirm(true);
    };

    const handleCloseApproveConfirmDialog = () => {
        setOpenApproveConfirm(false);
    };

    const handleDeleteReport = async () => {
        try {
            await http.delete(`/reportthread/${selectedReport.id}`);
            handleCloseDeleteConfirmDialog();
            fetchReports();
        } catch (error) {
            console.error('Failed to delete report:', error);
        }
    };

    const handleDeleteThread = async () => {
        try {
            await http.delete(`/reportthread/thread/${selectedReport.thread.id}`);
            handleCloseDeleteConfirmDialog();
            fetchReports();
        } catch (error) {
            console.error('Failed to delete thread:', error);
        }
    };

    const handleApproveReport = async () => {
        try {
            await http.delete(`/reportthread/${selectedReport.id}`);
            handleCloseApproveConfirmDialog();
            fetchReports();
        } catch (error) {
            console.error('Failed to approve report:', error);
        }
    };

    const renderReportsTable = () => (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Thread Owner</strong></TableCell>
                        <TableCell><strong>Thread ID</strong></TableCell>
                        <TableCell><strong>Category</strong></TableCell>
                        <TableCell><strong>Problem</strong></TableCell>
                        <TableCell><strong>Actions</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {reports.length > 0 ? (
                        reports.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell>
                                    <Box display="flex" alignItems="center">
                                        <img
                                            src={`${import.meta.env.VITE_FILE_PROFILE_URL}${report.thread.user?.imageFile}`}
                                            // src={report.thread.user.imageFile}
                                            alt={report.thread.user.firstName}
                                            style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 8 }}
                                        />
                                        <Typography>{report.thread.user.firstName} {report.thread.user.lastName}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>{report.thread.id}</TableCell>
                                <TableCell>{report.thread.category}</TableCell>
                                <TableCell>{report.problem}</TableCell>
                                <TableCell>
                                    <IconButton onClick={(e) => handleMenuOpen(e, report)}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl) && selectedReport?.id === report.id}
                                        onClose={handleMenuClose}
                                    >
                                        <MenuItem onClick={() => { handleMenuClose(); handleOpenViewDialog(); }}>View</MenuItem>
                                        <MenuItem onClick={() => { handleMenuClose(); handleOpenApproveConfirmDialog(); }}>Approve</MenuItem>
                                        <MenuItem onClick={() => { handleMenuClose(); handleOpenDeleteConfirmDialog(); }}>Delete</MenuItem>
                                    </Menu>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5}>No reports available</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AdminSidebar username={user?.firstName || 'User'} />
            <Box sx={{ flexGrow: 1, padding: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h4">Report Threads</Typography>
                </Box>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="report threads tabs">
                    <Tab label="Reports" />
                </Tabs>
                <Box sx={{ paddingTop: 3 }}>
                    {tabValue === 0 && renderReportsTable()}
                </Box>
                {selectedReport && (
                    <Dialog open={openView} onClose={handleCloseViewDialog}>
                        <DialogTitle>View Thread</DialogTitle>
                        <DialogContent>
                            <ReportThreadCard thread={selectedReport.thread} />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseViewDialog} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
                {selectedReport && (
                    <Dialog open={openApproveConfirm} onClose={handleCloseApproveConfirmDialog}>
                        <DialogTitle>Approve Report</DialogTitle>
                        <DialogContent>
                            <Typography>Are you sure you want to approve this report?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseApproveConfirmDialog} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleApproveReport} color="primary">
                                Approve
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
                {selectedReport && (
                    <Dialog open={openDeleteConfirm} onClose={handleCloseDeleteConfirmDialog}>
                        <DialogTitle>Delete Report or Thread</DialogTitle>
                        <DialogContent>
                            <Typography>Are you sure you want to delete this report or the entire thread?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDeleteConfirmDialog} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleDeleteThread} color="secondary">
                                Delete Thread
                            </Button>
                            <Button onClick={handleDeleteReport} color="primary">
                                Delete Report
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
            </Box>
        </Box>
    );
};

export default ReportThreadAdmin;
