import React, { useState } from 'react';
import axios from 'axios';

const TaskRecommendations = ({ tasks }) => {
    const [recommendations, setRecommendations] = useState([]);

    const getRecommendations = async () => {
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/completions',
                {
                    model: 'gpt-3.5-turbo',
                    prompt: generatePrompt(tasks),
                    max_tokens: 100,
                    n: 3,
                    stop: null,
                    temperature: 0.7,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer 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`,
                    },
                }
            );
            const { choices } = response.data;
            setRecommendations(choices.map(choice => choice.text.trim()));
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    };

    const generatePrompt = (tasks) => {
        const taskList = tasks.map(task => `- ${task.title}`).join('\\n');
        return `Here are some tasks:\\n${taskList}\\nBased on these tasks, recommend three new tasks for the user.`;
    };

    return (
        <div>
            <h3>Task Recommendations</h3>
            <button onClick={getRecommendations}>Get Recommendations</button>
            <ul>
                {recommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                ))}
            </ul>
        </div>
    );
};

export default TaskRecommendations;
