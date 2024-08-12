import React, { useState, useEffect } from 'react';
import { InputLabel, FormControl, Box, Typography, Select, MenuItem, IconButton, Grid, CircularProgress } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import http from '../http';
import dayjs from 'dayjs';
import AdminSidebar from '../components/AdminSidebar';
import EditIcon from '@mui/icons-material/Edit';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const statusOptions = ['Pending', 'Resolved', 'Rejected'];

function IncidentReportingUsers() {
  const [IncidentReportUsersList, setIncidentReportUsers] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reviewerNoteMap, setReviewerNoteMap] = useState({});
  const [actionStatusMap, setActionStatusMap] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    http.get('/IncidentReporting').then((res) => {
      setIncidentReportUsers(res.data);
      const statusMap = {};
      const noteMap = {};
      res.data.forEach((item) => {
        statusMap[item.id] = item.ActionStatus || '';
        noteMap[item.id] = item.ReviewerNote || '';
      });
      console.log('Status Map:', res.data);
      setActionStatusMap(statusMap);
      setReviewerNoteMap(noteMap);
    }).catch((error) => {
      console.error('Error fetching data:', error);
    });
  }, []);

  const handleStatusChange = (event, id) => {
    const newStatusMap = { ...actionStatusMap };
    newStatusMap[id] = event.target.value;
    setActionStatusMap(newStatusMap);
  };

  const handleEditOpen = (report) => {
    setSelectedReport(report);
    setOpenDialog(true);
  };

  const handleEditClose = () => {
    setOpenDialog(false);
    setSelectedReport(null);
  };

  const handleSave = () => {
    if (selectedReport) {
      http.put(`/IncidentReporting/updateStatus/${selectedReport.id}`, { ActionTaken: actionStatusMap[selectedReport.id] })
        .then((res) => {
          toast.success('Admin status updated successfully!');
          window.location.reload();
          handleEditClose();
        })
        .catch((error) => {
          console.error('Error updating admin status:', error);
          toast.error('Error updating admin status.');
        });
    }
  };

  // Calculate the dashboard metrics
  const totalReports = IncidentReportUsersList.length;
  const pendingReports = IncidentReportUsersList.filter((report) => report.ActionTaken === 'Pending').length;
  const approvedReports = IncidentReportUsersList.filter((report) => report.ActionTaken === 'Approved').length;

  // Calculate percentages for the circular progress
  const pendingPercentage = totalReports ? (pendingReports / totalReports) * 100 : 0;
  const approvedPercentage = totalReports ? (approvedReports / totalReports) * 100 : 0;

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AdminSidebar /> {/* Sidebar Component */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h3" className="events-participant-text">Incident Reporting</Typography>

        {/* Dashboard Grid */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={4}>
            <Box sx={{ p: 2, bgcolor: '#3f51b5', borderRadius: '8px', textAlign: 'center', color: 'white' }}>
              <Typography variant="h6">Total Reports</Typography>
              <Typography variant="h4">{totalReports}</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ p: 2, bgcolor: '#ff9800', borderRadius: '8px', textAlign: 'center', color: 'white', position: 'relative' }}>
              <Typography variant="h6">Pending Reports</Typography>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                  variant="determinate"
                  value={pendingPercentage}
                  size={60}
                  thickness={5}
                  sx={{ color: 'white' }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" component="div" color="white">
                    {pendingReports}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ p: 2, bgcolor: '#4caf50', borderRadius: '8px', textAlign: 'center', color: 'white', position: 'relative' }}>
              <Typography variant="h6">resolved Reports</Typography>
              <CircularProgress
                variant="determinate"
                value={approvedPercentage}
                size={60}
                thickness={5}
                sx={{ color: 'white', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              />
              <Typography variant="h4" sx={{ mt: 2 }}>{approvedReports}</Typography>
            </Box>
          </Grid>
        </Grid>

        <TableContainer component={Paper} sx={{ bgcolor: '', maxHeight: 400, overflowY: 'auto' }} className="Table">
          <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Report Details</TableCell>
                <TableCell align="center">Action Status</TableCell>
                <TableCell align="center">Edit Status</TableCell>
                <TableCell align="center"></TableCell>
                <TableCell align="center">Reviewer Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {IncidentReportUsersList.map((IncidentReportSubmits) => (
                <TableRow
                  key={IncidentReportSubmits.id} // Assuming each row has a unique 'id'
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {dayjs(IncidentReportSubmits.createdAt).format('YYYY-MM-DD')} {/* Format date as needed */}
                  </TableCell>
                  <TableCell align="center">{IncidentReportSubmits.user?.firstName}</TableCell>
                  <TableCell align="center">{IncidentReportSubmits.user?.email}</TableCell>
                  <TableCell align="center">
                    <a href={`/admin/IncidentReportAdmin/${IncidentReportSubmits.id}`}>View Details</a>
                  </TableCell>
                  <TableCell align="center">
                    {IncidentReportSubmits.ActionTaken || 'Pending'} {/* Display status */}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleEditOpen(IncidentReportSubmits)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => setOpen(!open)}
                    >
                      {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    {IncidentReportSubmits.Note}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleEditClose}>
          <DialogTitle>Edit Action Status</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Change the ACTIONSTATUS for ID:{selectedReport?.id}.
            </DialogContentText>
            <FormControl fullWidth>
              <InputLabel>ActionStatus</InputLabel>
              <Select
                label="Status"
                value={actionStatusMap[selectedReport?.id] || ''}
                onChange={(e) => handleStatusChange(e, selectedReport?.id)}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button onClick={handleSave} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>

      </Box>
      <ToastContainer />
    </Box>
  );
}

export default IncidentReportingUsers;
