import React, { useState, useEffect } from 'react';
import { InputLabel, FormControl, Box, Typography, Select, MenuItem, CircularProgress } from '@mui/material';
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
import { useFormik } from 'formik';
import * as yup from 'yup';

const statusOptions = ['Pending', 'Approved', 'Rejected']; // Example options

function IncidentReportingUsers() {
  const [IncidentReportUsersList, setIncidentReportUsers] = useState([]);
  const [actionStatusMap, setActionStatusMap] = useState({}); // Track status for each row
  const [reviewerNoteMap, setReviewerNoteMap] = useState({}); // Track note for each row

  useEffect(() => {
    http.get('/IncidentReporting').then((res) => {
      console.log(res.data);
      setIncidentReportUsers(res.data);
      const statusMap = {};
      const noteMap = {};
      res.data.forEach(item => {
        statusMap[item.id] = item.ActionStatus || ''; // Assume item.id is unique
        noteMap[item.id] = item.ReviewerNote || '';
      });
      setActionStatusMap(statusMap);
      setReviewerNoteMap(noteMap);
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
  }, []);

  const handleStatusChange = (event, id) => {
    const newStatus = event.target.value;
    setActionStatusMap(prev => ({ ...prev, [id]: newStatus }));
    
    // Submit the new status to the server
    http.put(`/IncidentReporting/${id}`, { status: newStatus })
      .then(response => {
        console.log('Status updated successfully:', response.data);
      })
      .catch(error => {
        console.error('Error updating status:', error);
      });
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AdminSidebar /> {/* Sidebar Component */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h3" className="events-participant-text">Incident Reporting</Typography>

        <Box sx={{ flexGrow: 1, p: 3, m: 5, bgcolor: '#9FCCC9' }} style={{ borderRadius: '16px' }}>
          <TableContainer component={Paper} sx={{ bgcolor: '#D7CAB7' }} className='Table'>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Report Details</TableCell>
                  <TableCell align="center">Action Status</TableCell>
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
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          label="Status"
                          value={actionStatusMap[IncidentReportSubmits.id] || ''}
                          onChange={(e) => handleStatusChange(e, IncidentReportSubmits.id)}
                          error={!actionStatusMap[IncidentReportSubmits.id]}
                        >
                          {statusOptions.map(option => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="center">
                      {reviewerNoteMap[IncidentReportSubmits.id] || 'No Note Available'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}

export default IncidentReportingUsers;
