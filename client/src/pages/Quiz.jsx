import React, { useState, useEffect, useContext } from 'react';
import { Box, Paper, Typography, Radio, RadioGroup, FormControlLabel, Button } from '@mui/material';
import http from '../http'
import UserContext from '../contexts/UserContext';
import QuizResults from "./QuizResults.jsx";

function Quiz({ quizState, setQuizState }) {
  const { user } = useContext(UserContext);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Track selected answers

  const handleAnswerChange = (questionId, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionIndex,
    });
  };

  // Ensure quizState is not null or undefined and has questions
  if (!quizState || !quizState.questions) {
    return <Typography variant="h6">Loading quiz...</Typography>;
  }

  const handleSubmit = async () => {
    // Process the quiz submission
    const results = quizState.questions.map((question, qIndex) => {
      const userAnswer = selectedAnswers[qIndex];
      const isCorrect = userAnswer === question.correctAnswer;
      return {
        questionId: qIndex,
        userAnswer,
        isCorrect,
        points: isCorrect ? question.points : 0,
      };
    });

    try {
        const response = await http.post(`/lesson/${quizState.lessonId}/submit-quiz`, { userId: user.id, results });
        // Optionally handle the result of the submission, like showing feedback
        const { feedback, totalPoints } = response.data;
        setQuizState((prev) => ({
            ...prev,
            showResults: true,
            feedback,
            totalPoints,
          }));
      } catch (error) {
        console.error('Error submitting quiz:', error);
      }
    };
  

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quiz
      </Typography>
      {quizState.questions.map((question, qIndex) => (
        <Paper key={qIndex} sx={{ padding: 2, marginBottom: 2 }}>
          <Typography variant="h6" gutterBottom>
            {qIndex + 1}. {question.question_text}
          </Typography>
          <RadioGroup
            value={selectedAnswers[qIndex] || ''}
            onChange={(e) => handleAnswerChange(qIndex, parseInt(e.target.value))}
          >
            {question.options.map((option, oIndex) => (
              <FormControlLabel
                key={`${qIndex}-${oIndex}`} // Combine the question index and option index for a unique key
                value={oIndex}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
        </Paper>
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ marginTop: 2 }}
      >
        Submit Quiz
      </Button>
    </Box>
  );
}

export default Quiz;
