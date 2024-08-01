import React, { useState, useEffect } from 'react';
import http from '../http';
import { Box, Typography, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AdminSidebar from '../components/AdminSidebar';

function IndividualReport() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
            <Grid item>
              <h1>Incident Report</h1>
              <p>Incident Date: {report.ReportType || 'N/A'}</p>
              <p>Incident Location: {report.Location || 'N/A'}</p>
              <p>Incident Description: {report.ReportDetails || 'N/A'}</p>
              <p>Incident Status: {report.ActionStatus || 'N/A'}</p>
            </Grid>
            <Grid item>
              <img alt="some picture"
                src={`${import.meta.env.VITE_FILE_BASE_URL}${report.imageFile}`}
                style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}>
              </img>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

export default IndividualReport;
