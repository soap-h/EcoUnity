import React from 'react';
import http from '../http';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function IndividualFeedback() {
    const { id } = useParams();
    const [Feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await http.get(`/EventFeedback/${id}`);
                console.log('Fetched report:', res.data); // Log the data received
                setFeedback(res.data);
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
    if (!Feedback) return <p>No data available</p>;
  return (
    <Box>
    <Typography variant="h3" className="events-participant-text">
        {Feedback.user?.firstName || 'N/A'}
    </Typography>
    <h1>Feedback</h1>
    <p>Feedback Date: {Feedback.CreatedAt || 'N/A'}</p>
    <p>NAme: {Feedback.EventName || 'N/A'}</p>
    <p>improvement: {Feedback.Improvement || 'N/A'}</p>
    <p>Enjoyemnt: {Feedback.Enjoy || 'N/A'}</p>
    <p>rating: {Feedback.rating || 'N/A'}</p>
</Box>
  )
}

export default IndividualFeedback