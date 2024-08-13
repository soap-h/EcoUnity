import React, { useState } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';

function CorrectAnswers({ feedback, totalPoints, onRetry }) {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quiz Results
      </Typography>
      {feedback.map((result, index) => (
        <Paper key={index} sx={{ padding: 2, marginBottom: 2 }}>
          <Typography variant="h6" gutterBottom>
            Question {index + 1}
          </Typography>
          <Typography>
            Your Answer: {result.userAnswer !== null ? result.userAnswer : 'No answer selected'}
          </Typography>
          <Typography color={result.isCorrect ? 'green' : 'red'}>
            {result.isCorrect ? 'Correct!' : 'Incorrect.'}
          </Typography>
          <Typography variant="body2">
            Explanation: {result.explanation}
          </Typography>
          <Typography variant="body2">
            Points Earned: {result.points}
          </Typography>
        </Paper>
      ))}
      <Typography variant="h5" sx={{ marginTop: 2 }}>
        Total Points: {totalPoints}
      </Typography>
      <Button variant="contained" color="primary" onClick={onRetry} sx={{ marginTop: 2 }}>
        Retry Quiz
      </Button>
    </Box>
  );
}

export default CorrectAnswers;
