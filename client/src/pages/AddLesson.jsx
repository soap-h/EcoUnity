import React, { useState } from 'react';
import { Button, TextField, Typography, Paper, Grid, IconButton } from '@mui/material';
import { AddCircleOutline, Delete } from '@mui/icons-material';
import http from '../http';

const AddLesson = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [lessonName, setLessonName] = useState('');
    const [slidesPath, setSlidesPath] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [tags, setTags] = useState([]);

    const handleAddQuestion = () => {
      setQuestions([
        ...questions,
        {
          question_text: '',
          options: ['', '', '', ''],
          correct_answer: '',
          points: '',
          explanation: ''
        }
      ]);
    };
  
    const handleQuestionChange = (index, field, value) => {
      const newQuestions = [...questions];
      newQuestions[index][field] = value;
      setQuestions(newQuestions);
    };
  
    const handleOptionChange = (questionIndex, optionIndex, value) => {
      const newQuestions = [...questions];
      newQuestions[questionIndex].options[optionIndex] = value;
      setQuestions(newQuestions);
    };
  
    const handleCorrectAnswerChange = (questionIndex, value) => {
      const newQuestions = [...questions];
      newQuestions[questionIndex].correct_answer = value;
      setQuestions(newQuestions);
    };
  
    const handleFileChange = (e) => {
      setSlidesPath(e.target.files[0]);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('lessonName', lessonName);
        formData.append('slidesPath', slidesPath);
  
        // Append questions as a JSON string
        formData.append('questions', JSON.stringify(questions));
  
        const response = await http.post('/createQuiz', formData);
  
        console.log(response.message);
        // Handle successful quiz creation, like redirecting or showing a success message
      } catch (error) {
        console.error('Error creating quiz:', error);
      }
    };
  
    return (
        <Paper sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Create a New Quiz
        </Typography>
  
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <TextField
            label="Quiz Title"
            variant="outlined"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
  
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
  
          <TextField
            label="Lesson Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={lessonName}
            onChange={(e) => setLessonName(e.target.value)}
            required
          />
  
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ marginBottom: 2 }}
          >
            Upload Lesson Slides (PDF/PPTX)
            <input
              type="file"
              accept=".pdf,.pptx"
              hidden
              onChange={handleFileChange}
              required
            />
          </Button>
  
          {questions.map((question, qIndex) => (
            <Paper key={qIndex} sx={{ padding: 2, marginBottom: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label={`Question ${qIndex + 1} Text`}
                    variant="outlined"
                    fullWidth
                    value={question.question_text}
                    onChange={(e) => handleQuestionChange(qIndex, 'question_text', e.target.value)}
                    required
                  />
                </Grid>
  
                {question.options.map((option, oIndex) => (
                  <Grid item xs={6} key={oIndex}>
                    <TextField
                      label={`Option ${oIndex + 1}`}
                      variant="outlined"
                      fullWidth
                      value={option}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      required
                    />
                    <input
                      type="radio"
                      name={`correct_answer_${qIndex}`}
                      value={option}
                      checked={question.correct_answer === option}
                      onChange={(e) => handleCorrectAnswerChange(qIndex, option)}
                    />
                    Correct Answer
                  </Grid>
                ))}
  
                <Grid item xs={12}>
                  <TextField
                    label="Points"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={question.points}
                    onChange={(e) => handleQuestionChange(qIndex, 'points', e.target.value)}
                    required
                  />
                </Grid>
  
                <Grid item xs={12}>
                  <TextField
                    label="Explanation"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    value={question.explanation}
                    onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                  />
                </Grid>
  
                <Grid item xs={12} textAlign="right">
                  <IconButton color="error" onClick={() => handleRemoveQuestion(qIndex)}>
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          ))}
  
          <Button
            variant="outlined"
            startIcon={<AddCircleOutline />}
            onClick={handleAddQuestion}
            fullWidth
            sx={{ marginBottom: 2 }}
          >
            Add Question
          </Button>
  
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Create Quiz
          </Button>
        </form>
      </Paper>
    );
  };
  

export default AddLesson;
