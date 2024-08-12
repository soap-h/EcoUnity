import React from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import { Button, TextField, Typography, Paper, Grid, IconButton, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { AddCircleOutline, Delete } from '@mui/icons-material';
import http from '../http';

const AddLesson = () => {
  return (
    <Paper sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create a New Quiz and Lesson
      </Typography>

      <Formik
        initialValues={{
          title: '',
          description: '',
          slidesPath: null,
          questions: []
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('description', values.description);
            formData.append('slidesPath', values.slidesPath);
            

            // Append the questions as a JSON string
            formData.append('questions', JSON.stringify(values.questions));

            const response = await http.post('/lesson', formData);
            console.log(response.data);
          } catch (error) {
            console.error('Error creating quiz:', error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, handleChange, setFieldValue, isSubmitting }) => (
          <Form encType="multipart/form-data">
            <Field
              as={TextField}
              label="Title"
              variant="outlined"
              fullWidth
              margin="normal"
              name="title"
              required
            />

            <Field
              as={TextField}
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              name="description"
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
                onChange={(e) => setFieldValue('slidesPath', e.target.files[0])}
                required
              />
            </Button>

            <FieldArray name="questions">
              {({ push, remove }) => (
                <>
                  {values.questions.map((question, qIndex) => (
                    <Paper key={qIndex} sx={{ padding: 2, marginBottom: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Field
                            as={TextField}
                            label={`Question ${qIndex + 1} Text`}
                            variant="outlined"
                            fullWidth
                            name={`questions.${qIndex}.question_text`}
                            required
                          />
                        </Grid>

                        <FieldArray name={`questions.${qIndex}.options`}>
                          {({ push: pushOption }) => (
                            <>
                              {question.options.map((option, oIndex) => (
                                <Grid item xs={6} key={oIndex}>
                                  <Field
                                    as={TextField}
                                    label={`Option ${oIndex + 1}`}
                                    variant="outlined"
                                    fullWidth
                                    name={`questions.${qIndex}.options.${oIndex}`}
                                    required
                                  />
                                  <FormControlLabel
                                    control={
                                      <Field
                                        as={Radio}
                                        type="radio"
                                        name={`questions.${qIndex}.correct_answer`}
                                        value={oIndex}
                                        checked={values.questions[qIndex].correct_answer === oIndex}
                                        onChange={() => setFieldValue(`questions.${qIndex}.correct_answer`, oIndex)}
                                      />
                                    }
                                    label="Correct Answer"
                                  />
                                </Grid>
                              ))}
                            </>
                          )}
                        </FieldArray>

                        <Grid item xs={12}>
                          <Field
                            as={TextField}
                            label="Points"
                            type="number"
                            variant="outlined"
                            fullWidth
                            name={`questions.${qIndex}.points`}
                            required
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Field
                            as={TextField}
                            label="Explanation"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={3}
                            name={`questions.${qIndex}.explanation`}
                          />
                        </Grid>

                        <Grid item xs={12} textAlign="right">
                          <IconButton color="error" onClick={() => remove(qIndex)}>
                            <Delete />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}

                  <Button
                    variant="outlined"
                    startIcon={<AddCircleOutline />}
                    onClick={() =>
                      push({
                        question_text: '',
                        options: ['', '', '', ''],
                        correct_answer: '',
                        points: '',
                        explanation: ''
                      })
                    }
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  >
                    Add Question
                  </Button>
                </>
              )}
            </FieldArray>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
            >
              Create Quiz
            </Button>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default AddLesson;
