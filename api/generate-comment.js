// For local development, load environment variables from .env file
require('dotenv').config();

// Import the OpenAI library
const OpenAI = require('openai');

// Create an OpenAI client with the API key from environment variables
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Keep a short history (last 5) of the AI messages we have already shown
const funHistory = [];
const eduHistory = [];
const HISTORY_LIMIT = 10;

// Helper to push a new message into the correct history array
function remember(commentType, message) {
    const historyArr = commentType === 'fun' ? funHistory : eduHistory;
    historyArr.push(message);
    if (historyArr.length > HISTORY_LIMIT) historyArr.shift(); // drop oldest
}

// The main function that will be executed by Vercel
module.exports = async (req, res) => {
    // We only want to handle POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    try {
        const { userPrompt, commentType, lastGenerations = [] } = req.body;
        console.log(`\n--- New Request ---`);
        console.log(`Received request for comment type: "${commentType}"`);
        console.log(`User Prompt: "${userPrompt}"`);
        console.log(`History:`, lastGenerations);

        if (!userPrompt || !commentType) {
            return res.status(400).json({ message: 'Missing userPrompt or commentType in request body' });
        }

        let systemPrompt;

        // Define the two "base prompts" to control the AI's response
        if (commentType === 'fun') {
            systemPrompt = `You are a witty, sarcastic assistant. A user is generating an image with the prompt: "${userPrompt}". Write a short, single-sentence, fun, and quirky comment about the creative process. For example, if the prompt is 'a cat in a hat', you could say 'Finding a cat that agreed to wear a hat...' or 'Negotiating modeling fees with the feline.'. Keep your text below 15 words.`;
        } else if (commentType === 'educational') {
            systemPrompt = `You are an expert in AI image generation for marketing. A user is generating an image with the prompt: "${userPrompt}". Provide a one-sentence educational tip to help them write better prompts for marketing images in the future, inspired by their original prompt. Keep your text below 15 words.`;
        } else {
            return res.status(400).json({ message: 'Invalid commentType' });
        }

        // Add history to avoid repetition
        if (lastGenerations && lastGenerations.length > 0) {
            const historyText = lastGenerations.join(' | ');
            systemPrompt += ` Here are the last generations to help you avoid repetition: ${historyText}. Now generate a NEW comment.`;
        }

        console.log('--- Full Prompt Sent to OpenAI ---');
        console.log(systemPrompt);
        console.log('----------------------------------');

        // Call the OpenAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-4.1-mini-2025-04-14",
            messages: [
                { role: "system", content: systemPrompt },
            ],
            max_tokens: 60, // Limit the response length
            temperature: 0.7, // Add some creativity
        });

        const AImessage = completion.choices[0].message.content;

        console.log('--- Received from OpenAI ---');
        console.log(`AI Message: ${AImessage}`);
        console.log('--------------------------');

        // Send the AI's response back to the frontend
        res.status(200).json({ message: AImessage });

    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).json({ message: 'Error generating AI comment' });
    }
}; 