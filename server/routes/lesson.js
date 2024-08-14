const yup = require('yup');
const { Lesson, Attempt } = require('../models'); // Adjust the path as necessary
const express = require('express');

const router = express.Router();

// Validation Schema for creating a lesson
const lessonSchema = yup.object().shape({
    title: yup.string().required(),
    description: yup.string().required(),
    slidesPath: yup.string().nullable(),
    questions: yup.array().of(
        yup.object().shape({
            question_text: yup.string().required(),
            options: yup.array().of(yup.string().required()).required(),
            correct_answer: yup.number().required(),  // Since correct_answer is an index
            points: yup.number().required(),
            explanation: yup.string().nullable(),
        })
    ).required(),
});

// POST /lessons - Create a new lesson
router.post('/', async (req, res) => {
    try {
   

        // Parse questions from JSON string
        const questions = JSON.parse(req.body.questions);

        // Validate the rest of the data
        const validatedData = await lessonSchema.validate({
            ...req.body,
            questions
        });

        // Create the new lesson
        const newLesson = await Lesson.create(validatedData);
        return res.status(201).json(newLesson);
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Error creating lesson:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /lessons - Get all lessons
router.get('/', async (req, res) => {
    try {
        const lessons = await Lesson.findAll();
        return res.status(200).json(lessons);
    } catch (error) {
        console.error('Error fetching lessons:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /lessons/:id - Get a lesson by ID
router.get('/:id/quiz', async (req, res) => {
    try {
        const lesson = await Lesson.findByPk(req.params.id);
        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }
        return res.status(200).json(lesson);
    } catch (error) {
        console.error('Error fetching lesson:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /lessons/:id - Get a lesson by ID
router.get('/:id', async (req, res) => {
    try {
        const lesson = await Lesson.findByPk(req.params.id);
        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }
        return res.status(200).json(lesson);
    } catch (error) {
        console.error('Error fetching lesson:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});



const quizResultSchema = yup.object({
    results: yup.array().of(
        yup.object({
            questionId: yup.number().required(),
            userAnswer: yup.number().required(),
            isCorrect: yup.boolean().required(),
            points: yup.number().required(),
        })
    ).required(),
});

router.post('/:id/submit-quiz', async (req, res) => {
    const { id } = req.params; // Lesson ID (or Quiz ID)
    const { userId, results } = req.body;

    try {
        // Validate the quiz results
        await quizResultSchema.validate({ results });

        // Fetch the lesson to ensure it exists
        const lesson = await Lesson.findByPk(id);
        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        // Calculate the total points earned by the user
        const totalPoints = results.reduce((sum, result) => sum + (result.isCorrect ? result.points : 0), 0);

        // Save a single record of the overall attempt to the database
        const newAttempt = await Attempt.create({
            userId,
            quizId: id, // Assuming quizId is equivalent to lessonId in this context
            pointsEarned: totalPoints,
        });

        // Return feedback with details for each question
        const feedback = results.map((result, index) => ({
            questionIndex: result.questionIndex,
            userAnswer: result.userAnswer,
            isCorrect: result.isCorrect,
            explanation: result.questionIndex.explanation,
            points: result.points,
        }));

        return res.status(200).json({
            message: 'Quiz submitted successfully',
            attempt: newAttempt,
            totalPoints,
            feedback,
        });
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            return res.status(400).json({ error: error.errors });
        }
        console.error('Error submitting quiz:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
