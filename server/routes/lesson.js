const yup = require('yup');
const { Lesson } = require('../models'); // Adjust the path as necessary
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

module.exports = router;
