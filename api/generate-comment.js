// For local development, load environment variables from .env file
require('dotenv').config();

// Import the OpenAI library
const OpenAI = require('openai');

// Create an OpenAI client with the API key from environment variables
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// The main function that will be executed by Vercel
module.exports = async (req, res) => {
    // We only want to handle POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    try {
        const { userPrompt, commentType } = req.body;
        console.log(`\n--- New Request ---`);
        console.log(`Received request for comment type: "${commentType}"`);
        console.log(`User Prompt: "${userPrompt}"`);

        if (!userPrompt || !commentType) {
            return res.status(400).json({ message: 'Missing userPrompt or commentType in request body' });
        }

        let systemPrompt;

        // Define the two "base prompts" to control the AI's response
        if (commentType === 'fun') {
            systemPrompt = `You are a witty, sarcastic assistant. A user is generating an image with the prompt: "${userPrompt}". Write a short, single-sentence, fun, and quirky comment about the creative process. For example, if the prompt is 'a cat in a hat', you could say 'Finding a cat that agreed to wear a hat...' or 'Negotiating modeling fees with the feline.'. Keep your text short`;
        } else if (commentType === 'educational') {
            systemPrompt = `You are an expert in AI image generation for marketing. A user is generating an image with the prompt: "${userPrompt}". Provide a one-sentence educational tip to help them write better prompts for marketing images in the future, inspired by their original prompt. For example, if the prompt mentions a 'person', you could say 'Did you know that specifying the exact number of people in your prompt leads to more consistent results?' Keep your explainers short`;
        } else {
            return res.status(400).json({ message: 'Invalid commentType' });
        }

        console.log('--- Sending to OpenAI ---');
        console.log(`System Prompt: ${systemPrompt}`);
        console.log('-------------------------');

        // Call the OpenAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-4.1-mini-2025-04-14",
            messages: [
                { role: "system", content: systemPrompt },
            ],
            max_tokens: 10, // Limit the response length
            temperature: 1.3, // Add some creativity
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