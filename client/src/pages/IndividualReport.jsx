import React, { useState, useEffect, useContext } from 'react';
import http from '../http';
import { Box, Typography, Grid, Card, CardContent, IconButton } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AdminSidebar from '../components/AdminSidebar';
import UserContext from "../contexts/UserContext";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import { Button, TextareaAutosize } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';



function IndividualReport() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [note, setNote] = useState("");
  const { user } = useContext(UserContext);
  const navigate = useNavigate();


  const [open, setOpen] = useState(false);

  const handleEditClick = () => {
    setOpen(true);
  };

  const handleSaveClick = () => {

    setOpen(false);
  };

  const NoteFormik = useFormik({
    initialValues: {
      Note: "",
    },
    validationSchema: yup.object({
      Note: yup.string().trim()
        .min(3, 'Note must be at least 3 characters'),
    }),
    onSubmit: (data) => {
      data.Note = data.Note.trim();
      data.EditNoteUser = user.id;
      http.put(`/IncidentReporting/UpdateNote/${id}`, data)
        .then((res) => {
          setOpen(false);
          toast.success('Note added successfully');
          window.location.reload();
        })
        .catch((error) => {
          toast.error('Failed to add note');
          console.log(error);
        });
    }
  });



  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await http.get(`/IncidentReporting/${id}`);
        console.log('Fetched report:', res.data); // Log the data received
        setReport(res.data);
      } catch (err) {
        console.error('Error fetching data:', err); // Log any errors
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!report) return <p>No data available</p>;

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AdminSidebar /> {/* Sidebar Component */}
      <Box sx={{ flexGrow: 1, p: 3, }} >
        <Typography variant="h3" className="events-participant-text">
          {report.user?.firstName || 'N/A'} Feedback
        </Typography>
        <Box sx={{ flexGrow: 1, p: 3 }} style={{ backgroundColor: '#9FCCC9', borderRadius: '16px' }}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Card sx={{ height: '100%', bgcolor: '#D7CAB7' }}>
                <CardContent>
                  <Typography variant="h6">Report Type</Typography>
                  <Typography variant="body1">Response: {report.ReportType || 'N/A'}</Typography>
                  <Typography variant="h6">Details of Report</Typography>
                  <Typography variant="body1">Response: {report.ReportDetails || 'N/A'}</Typography>
                  <Typography variant="h6">Location</Typography>
                  <Typography variant="body1">Response: {report.Location || 'N/A'}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{ height: '100%', bgcolor: '#D7CAB7' }}>
                <CardContent>
                  <Typography variant="h6">Report evidence</Typography>
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <img
                      alt="some picture"
                      src={`${import.meta.env.VITE_FILE_BASE_URL}${report.imageFile}`}
                      style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>


            <Grid item xs={12}>
              <Card sx={{ height: '100%', bgcolor: '#D7CAB7' }}>
                <CardContent>
                  {open ? (
                    <Box component="form" onSubmit={NoteFormik.handleSubmit}>
                      <TextareaAutosize
                        minRows={5}
                        style={{ width: '70%', padding: '10px', borderRadius: '8px' }}
                        name="Note"
                        value={NoteFormik.values.Note}
                        onChange={NoteFormik.handleChange}
                        onBlur={NoteFormik.handleBlur}
                        placeholder="Enter Review"
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          backgroundColor: '#5A9895',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: '#4A7C73', // Optional: Darker shade for hover effect
                          },
                        }}
                      >
                        Add Note
                      </Button>
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  ) : (
                    <>
                      <Grid container justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Reviewer Notes:</Typography>
                        {console.log(report.EditNoteId, user.id)}
                        {(report.EditNoteId === null || String(report.EditNoteId) === String(user.id)) &&(
                          <IconButton onClick={handleEditClick}>
                          <EditIcon />
                        </IconButton>
    
                      )}  
                        
                      </Grid>
                      <Typography variant="body1">
                        {report.Note}
                      </Typography>
                      <Typography variant="body2" align="right">
                        Report by: {report.EditNoteUser?.firstName || 'N/A'}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box >
      </Box >
      <ToastContainer />
    </Box >
  );
}

export default IndividualReport;
