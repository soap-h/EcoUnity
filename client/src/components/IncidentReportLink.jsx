import React from 'react';
import { Button } from '@mui/material';
import './FixedButton.css'; // Import the CSS file for animations
import { useNavigate } from 'react-router-dom';

const FixedButton = () => {
    const navigate = useNavigate(); // Call useNavigate hook here

    const handleClick = () => {
      navigate('/IncidentReporting'); // Use navigate function in event handler
    };
  return (
    <div className="fixed-button-container">
      <Button
        variant="contained"
        className="fixed-button"
        onClick={() => navigate('/AddincidentReporting')}
      >
        Report
      </Button>
      <div className="button-text"></div>
    </div>
  );
};

export default FixedButton;