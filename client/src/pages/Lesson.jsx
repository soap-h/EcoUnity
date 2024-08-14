import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Route, Routes, Navigate } from 'react-router-dom';
import { Grid, Box, Button, Paper } from '@mui/material';
import Slides from './Slides';
import Quiz from './Quiz';
import CorrectAnswers from './CorrectAnswers';
import http from '../http';

function Lesson() {
  const { id } = useParams(); // Get the lesson ID from the route
  const [quizState, setQuizState] = useState(null); // Store quiz data
  const navigate = useNavigate();
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
  const [slidesPath, setSlidesPath] = useState('');

  useEffect(() => {
    // Fetch lesson details
    const fetchLessonDetails = async () => {
      try {
        const lessonResponse = await http.get(`/lesson/${id}`);
        setSlidesPath(lessonResponse.data.slidesPath);
        console.log('Slide Path:', lessonResponse.data.slidesPath);
      } catch (error) {
        console.error('Error fetching lesson details:', error);
      }
    };

    // Fetch quiz completion status and quiz data
    const fetchQuizData = async () => {
      try {
        const quizResponse = await http.get(`/lesson/${id}/quiz`);
        setQuizState(
            {...quizResponse.data,
            lessonId: id,}
        );
        setHasCompletedQuiz(quizResponse.data.hasCompletedQuiz);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    fetchLessonDetails();
    fetchQuizData();
  }, [id]);

  const handleNavigate = (path) => {
    navigate(`/learning/${id}/${path}`);
  };

  return (
    <Grid container>
      {/* Sidebar Navigation */}
      <Grid item xs={2} sx={{ margin: 'auto' }}>
        <Paper sx={{ padding: 1, backgroundColor: '#e3e3e3', boxShadow: '0px 0px 3px 0px', margin: 'auto', mt: 5 }}>
          <Box sx={{ padding: 2 }}>
            <Button fullWidth onClick={() => handleNavigate('slides')}>Slides</Button>
            <Button fullWidth onClick={() => handleNavigate('quiz')}>Quiz</Button>
          </Box>
        </Paper>
      </Grid>

      {/* Main Content */}
      <Grid item xs={9}>
        <Routes>
          {slidesPath && (
            <Route path="slides/*" element={<Slides slidesPath={slidesPath} />} />
          )}
          <Route
            path="quiz"
            element={
              hasCompletedQuiz ? (
                <Navigate to={`/learning/${id}/correctanswers`} />
              ) : (
                quizState && <Quiz quizState={quizState} setQuizState={setQuizState} />
              )
            }
          />
          <Route path="correctanswers/*" element={<CorrectAnswers />} />
        </Routes>
      </Grid>
    </Grid>
  );
}

export default Lesson;
