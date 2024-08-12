import React, { useState } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import { Button, TextField, Typography, Paper, Grid, IconButton, FormControlLabel, Radio, Box, FormControl, FormLabel, FormGroup, Checkbox } from '@mui/material';
import { AddCircleOutline, Delete } from '@mui/icons-material';
import http from '../http';

function AddLesson() {
    const [slideFile, setSlideFile] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);

    const categories = [
        { name: 'Biodiversity', color: 'red' },
        { name: 'Energy', color: 'orange' },
        { name: 'Conservation', color: 'green' },
        { name: 'Agriculture', color: 'blue' },
        { name: 'Recycling', color: 'purple' },
        { name: 'Climate Change', color: 'cyan' },
    ];

    const onFileChange = (e, setFieldValue) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024 * 10) { // 10MB limit
                alert('Maximum file size is 10MB');
                return;
            }
            setSlideFile(file);
            setPreviewURL(URL.createObjectURL(file));
            setFieldValue('file', file);
        }
    };

    const validateForm = (values) => {
        const errors = {};
        if (!slideFile) {
            errors.slidesPath = 'Slide file is required';
        }
        // Additional validation logic...
        return errors;
    };

    return (
        <Paper sx={{ padding: 3, maxWidth: '800px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>
                Create a New Quiz and Lesson
            </Typography>
    
            <Formik
                initialValues={{
                    title: '',
                    description: '',
                    slidesPath: '',
                    categories: [],
                    questions: []
                }}
                validate={validateForm}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        let slidesPath = '';
                        
                        if (slideFile) {
                            const formData = new FormData();
                            formData.append('file', slideFile);
                
                            const uploadResponse = await http.post('file/upload/slides', formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                            });
                            console.log('Upload response:', uploadResponse.data); // Log the entire response to see what is returned

                            slidesPath = uploadResponse.data.filename;
                            console.log('Assigned slidesPath:', slidesPath);
                        }

                        const formData = new FormData();
                        formData.append('title', values.title);
                        formData.append('description', values.description);
                        formData.append('slidesPath', slidesPath);
                        formData.append('categories', JSON.stringify(values.categories));
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
                {({ values, handleChange, setFieldValue, isSubmitting, errors }) => (
                    <Form encType="multipart/form-data">
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Field
                                    as={TextField}
                                    label="Title"
                                    variant="outlined"
                                    margin="normal"
                                    name="title"
                                    required
                                    sx={{ width: '85%' }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    as={TextField}
                                    label="Description"
                                    variant="outlined"
                                    margin="normal"
                                    multiline
                                    rows={4}
                                    name="description"
                                    required
                                    sx={{ width: '85%' }}
                                />
                            </Grid>
    
                            {/* Categories (tags) selection */}
                            <Grid item xs={12}>
                                <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
                                    <FormLabel component="legend">Categories</FormLabel>
                                    <FormGroup row>
                                        {categories.map((category) => (
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        name="categories"
                                                        value={category.name}
                                                        onChange={handleChange}
                                                    />
                                                }
                                                label={category.name}
                                                key={category.name}
                                                sx={{
                                                    '& .MuiFormControlLabel-label': {
                                                        color: 'white',
                                                        backgroundColor: category.color,
                                                        borderRadius: '15px',
                                                        padding: '5px 10px',
                                                        marginRight: '10px',
                                                    },
                                                }}
                                            />
                                        ))}
                                    </FormGroup>
                                </FormControl>
                            </Grid>
    
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    component="label"
                                    sx={{ width: '60%', marginBottom: 2 }}
                                >
                                    Upload Lesson Slides (PDF/PPTX)
                                    <input
                                        type="file"
                                        accept=".pdf,.pptx"
                                        name="slidesPath"
                                        hidden
                                        onChange={(e) => onFileChange(e, setFieldValue)}
                                    />
                                </Button>
    
                                {errors.slidesPath && (
                                    <Typography color="error" variant="body2">
                                        {errors.slidesPath}
                                    </Typography>
                                )}
    
                                {previewURL && (
                                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                                        <Typography variant="body1">Preview:</Typography>
                                        <iframe
                                            src={previewURL}
                                            style={{ width: '100%', height: '300px' }}
                                            frameBorder="0"
                                            title="Slides Preview"
                                        ></iframe>
                                    </Box>
                                )}
                            </Grid>
    
                            <Grid item xs={12}>
                                <FieldArray name="questions">
                                    {({ push, remove }) => (
                                        <>
                                            {values.questions.map((question, qIndex) => (
                                                <Paper key={qIndex} sx={{ padding: 0, marginBottom: 2 }}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12}>
                                                            <Typography variant='h6'>{`Question ${qIndex + 1}.`}</Typography>
                                                            <Field
                                                                as={TextField}
                                                                label={`Question ${qIndex + 1} Text`}
                                                                variant="outlined"
                                                                name={`questions.${qIndex}.question_text`}
                                                                required
                                                                sx={{ width: '80%' }}
                                                            />
                                                        </Grid>
    
                                                        <FieldArray name={`questions.${qIndex}.options`}>
                                                            {({ push: pushOption }) => (
                                                                <>
                                                                    {question.options.map((option, oIndex) => (
                                                                        <Grid
                                                                            item
                                                                            xs={12}
                                                                            container
                                                                            alignItems="center"
                                                                            key={oIndex}
                                                                            spacing={1}
                                                                        >
                                                                            <Grid item>
                                                                                <Field
                                                                                    as={Radio}
                                                                                    type="radio"
                                                                                    name={`questions.${qIndex}.correct_answer`}
                                                                                    value={oIndex}
                                                                                    checked={
                                                                                        values.questions[qIndex].correct_answer === oIndex
                                                                                    }
                                                                                    onChange={() =>
                                                                                        setFieldValue(`questions.${qIndex}.correct_answer`, oIndex)
                                                                                    }
                                                                                />
                                                                            </Grid>
                                                                            <Grid item xs>
                                                                                <Field
                                                                                    as={TextField}
                                                                                    label={`Option ${oIndex + 1}`}
                                                                                    variant="outlined"
                                                                                    name={`questions.${qIndex}.options.${oIndex}`}
                                                                                    required
                                                                                    sx={{ width: '50%' }}
                                                                                />
                                                                            </Grid>
                                                                        </Grid>
                                                                    ))}
                                                                </>
                                                            )}
                                                        </FieldArray>
    
                                                        <Grid item xs={6}>
                                                            <Field
                                                                as={TextField}
                                                                label="Points"
                                                                type="number"
                                                                variant="outlined"
                                                                name={`questions.${qIndex}.points`}
                                                                required
                                                                sx={{ width: '50%' }}
                                                            />
                                                        </Grid>
    
                                                        <Grid item xs={12}>
                                                            <Field
                                                                as={TextField}
                                                                label="Explanation"
                                                                variant="outlined"
                                                                multiline
                                                                rows={3}
                                                                name={`questions.${qIndex}.explanation`}
                                                                sx={{ width: '85%' }}
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
                                                sx={{ width: '40%', marginBottom: 2 }}
                                            >
                                                Add Question
                                            </Button>
                                        </>
                                    )}
                                </FieldArray>
                            </Grid>
    
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{ width: '50%' }}
                                    disabled={isSubmitting}
                                >
                                    Create Quiz
                                </Button>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Paper>
    );
    
}

export default AddLesson;
