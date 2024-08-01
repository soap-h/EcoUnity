import React, { useState, useEffect } from 'react'
import {InputLabel, FormControl,  Box, Typography, Select, MenuItem, Link} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import UserContext from '../contexts/UserContext';



function FeedbackAdmin() {
    const [FeedbackList, setFeedback] = useState([]);
    const [FeedbackCount, setFeedbackCount] = useState(0);
  
    useEffect(() => {
      http.get('/EventFeedback').then((res) => {
        console.log(res.data);
        setFeedback(res.data);

      }).catch(error => {
        console.error('Error fetching data:', error);
      });
    }, []);
  
    const itemCount = FeedbackList.length;

  
    return (
      <Box className="events-participant-title">
        <Typography variant="h3" className="events-participant-text">Incident Reporting {itemCount}</Typography>
        <div className="table-space">
          <TableContainer component={Paper} sx={{ bgcolor: '#D7CAB7' }} className='Table'>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Email</TableCell>
                  <TableCell align="center">Feedback Response</TableCell>
                  <TableCell align="center"> Send Reply </TableCell>
                  
                </TableRow>
              </TableHead>
              <TableBody>
                {FeedbackList.map((Feedback, i) => (
                  <TableRow
                    key={Feedback.id} // Assuming each row has a unique 'id'
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {dayjs(Feedback.createdAt).format('YYYY-MM-DD')} {/* Format date as needed */}
                    </TableCell>
                    <TableCell align="center">{Feedback.user?.firstName}</TableCell>
                    <TableCell align="center">{Feedback.user?.email}</TableCell>
                     <TableCell align="center"><a href={`/FeedbackAdmin/${Feedback.id}`}>hi</a></TableCell>
                    <TableCell align="center">Send Some reply</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Box>
    );
  }

export default FeedbackAdmin