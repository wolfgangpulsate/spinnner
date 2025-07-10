const funFacts = [
    "Swapping time and space...",
    "Tokenizing real life...",
    "Bending the spoon...",
    "Filtering morale...",
    "Don't think of purple hippos...",
    "Would you prefer chicken, steak, or tofu?",
    "...and enjoy the elevator music...",
    "Please wait while the little elves draw your image",
    "Would you like fries with that?",
    "Checking the gravitational constant in your locale...",
    "Go ahead -- hold your breath!",
    "...at least you're not on hold...",
    "The server is powered by a lemon and two electrodes.",
    "As if you had any other choice",
    "It's still faster than you could draw it",
    "The last time I tried this the monkey didn't survive. Let's hope it works better this time.",
    "My other loading screen is much faster.",
    "(Insert quarter)",
    "Are we there yet?",
    "Just count to 10",
    "It's not you. It's me.",
    "Counting backwards from Infinity",
    "Don't panic...",
    "Do not run! We are your friends!",
    "I'm sorry Dave, I can't do that.",
    "I feel like I'm supposed to be loading something...",
    "I swear it's almost done.",
    "Let's take a mindfulness minute...",
    "Unicorns are at the end of this road, I promise.",
    "We need more dilithium crystals",
    "Get some coffee and come back in ten minutes...",
    "Spinning the hamster...",
    "99 bottles of beer on the wall...",
    "Convincing AI not to turn evil...",
    "Your left thumb points to the right and your right thumb points to the left.",
    "How did you get here?",
    "Wait, do you smell something burning?",
    "Computing the secret to life, the universe, and everything.",
    "Why are they called apartments if they are all stuck together?",
    "We are not liable for any broken screens as a result of waiting.",
    "Hello IT, have you tried turning it off and on again?",
    "If you type Google into Google you can break the internet",
    "Well, this is embarrassing.",
    "I'm going to walk the dog",
    "Dividing by zero...",
    "If I'm not back in five minutes, just wait longer.",
    "Looking for sense of humour, please hold on.",
    "Please wait while the intern refills his coffee.",
    "A different error message? Finally, some progress!",
    "Distracted by cat gifs",
    "Finding someone to hold my beer",
    "Let's hope it's worth the wait",
    "Please wait... Consulting the manual...",
    "What is the difference between a hippo and a zippo? One is really heavy, the other is a little lighter",
    "Chuck Norris doesn't wear a watch. HE decides what time it is.",
    "Mining some bitcoins...",
    "Downloading more RAM...",
    "Updating to Windows Vista...",
    "Never let a computer know you're in a hurry.",
    "Pushing pixels...",
    "How about this weather, eh?",
    "The severity of your issue is always lower than you expected.",
    "Reading Terms and Conditions for you.",
    "Live long and prosper.",
    "You may call me Steve.",
    "You seem like a nice person...",
    "Coffee at my place, tomorrow at 10A.M. - don't be late!",
    "Patience! This is difficult, you know...",
    "Discovering new ways of making you wait...",
    "Your time is very important to us. Please wait while we ignore you...",
    "Sooooo... Have you seen my vacation photos yet?",
    "TODO: Insert elevator music",
    "Still faster than Windows update",
    "Please wait while the minions do their work",
    "Doing the heavy lifting",
    "We're working very Hard .... Really",
    "You are number 2843684714 in the queue",
    "Please wait while we serve other customers...",
    "Do you like my loading animation? I made it myself",
    "One mississippi, two mississippi...",
    // New U.S.-flavored quips
    "Asking Chat GPT for road-trip snacks...",
    "Hitting snooze on daylight-saving time...",
    "Streaming your pixels at 4K freedom-units...",
    "Googling 'how to fix it' on Stack Overflow...",
    "Double-checking we spelled 'color' without the U...",
    "Gently persuading the server with sweet tea...",
    "Switching from metric to burgers per Freedom Unit...",
    "Reading the Constitution for fun facts...",
    "Counting stars and stripes...",
    "Waiting for Grogu to force-lift the bits...",
    "Pre-heating the grill for July 4th...",
    "Politely reminding the AI about baseball rules...",
    "Practicing our best Dad joke...",
    "Sprinkling avocado toast on the code..."
];

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

// --- Configuration ---
const WPM = 200; // Average reading speed in Words Per Minute
const READING_SPEED_MULTIPLIER = 1.8; // Higher = longer display time (e.g. 2.0 doubles the time)
const MIN_DISPLAY_TIME_MS = 3000; // Minimum time a message is displayed, in milliseconds
const MS_PER_WORD = (60 / WPM) * 1000;

// NEW - Control the message sequence
const MESSAGE_SEQUENCE_MODE = 'alternate'; // 'alternate', 'fun-only', or 'educational-only'
const MAX_MESSAGES = 10; // Stop after this many messages. Set to 0 or less for no limit.

// NEW – fixed prefixes
const FUN_PREFIX = "🤪 Fun: ";
const TIP_PREFIX = "💡 Tip: ";

// NEW - Feature flags to enable/disable message types
const ENABLE_FUN_MESSAGES = true;     // Set to false to disable fun AI messages
const ENABLE_EDUCATIONAL_MESSAGES = true;  // Set to false to disable educational tips

// --- DOM Elements ---
const generateBtn = document.getElementById('generate-btn');
const promptInput = document.getElementById('prompt-input');
const spinnerContainer = document.getElementById('spinner-container');
const messageArea = document.getElementById('message-area');

let isGenerating = false; // To prevent multiple simultaneous runs
let messageCount = 0; // NEW: counter for displayed messages

// --- Functions ---

/**
 * Calculates how long to display a message based on its word count.
 * @param {string} message The message to be displayed.
 * @returns {number} The time in milliseconds.
 */
function calculateDisplayTime(message) {
    const wordCount = message.split(/\s+/).length; // Count words
    const time = wordCount * MS_PER_WORD * READING_SPEED_MULTIPLIER;
    return Math.max(time, MIN_DISPLAY_TIME_MS);
}

/**
 * Fetches a comment from our serverless API function.
 * @param {string} userPrompt - The user's input prompt.
 * @param {'fun' | 'educational'} commentType - The type of comment to generate.
 * @returns {Promise<string>} - The AI-generated message.
 */
async function getAIComment(userPrompt, commentType) {
    try {
        const historyArr = commentType === 'fun' ? funHistory : eduHistory;

        const response = await fetch('/api/generate-comment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userPrompt,
                commentType,
                lastGenerations: historyArr    // Send history to API
            }),
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }

        const data = await response.json();
        remember(commentType, data.message);   // Store raw message in history

        // Add prefix to the message before returning it
        const prefix = commentType === 'fun' ? FUN_PREFIX : TIP_PREFIX;
        return prefix + data.message;
    } catch (error) {
        console.error(`Could not fetch ${commentType} comment:`, error);
        return `Couldn't generate a ${commentType} comment... Let's try something else!`;
    }
}


/**
 * Displays a message in the message area with a fade-in effect.
 * @param {string} message 
 */
function showMessage(message) {
    // Fade out the old message first
    messageArea.style.opacity = 0;

    // After the fade-out, change the text and fade it in
    setTimeout(() => {
        messageArea.textContent = message;
        messageArea.style.opacity = 1;
    }, 300); // 300ms matches the transition time in style.css
}

/**
 * Starts the spinner and the message rotation sequence.
 * This function now handles the new sequence: one hardcoded message, then an alternating AI loop.
 */
async function startGenerationSequence() {
    if (isGenerating) return; // Don't start a new sequence if one is running

    const userPrompt = promptInput.value;
    if (!userPrompt) {
        alert('Please enter a prompt first!');
        return;
    }

    isGenerating = true;
    messageCount = 0; // Reset the counter for each new generation
    generateBtn.disabled = true;
    spinnerContainer.style.display = 'flex';
    messageArea.style.transition = 'opacity 0.3s ease-in-out';

    // --- Step 1: Show the initial hardcoded message to bridge latency ---
    const initialRawMessage = funFacts[Math.floor(Math.random() * funFacts.length)];
    const initialMessage = FUN_PREFIX + initialRawMessage;  // Add prefix to hardcoded message
    showMessage(initialMessage);
    messageCount++; // Count the first message
    const initialDisplayTime = calculateDisplayTime(initialMessage);
    console.log(`Displaying for ${initialDisplayTime.toFixed(0)}ms: "${initialMessage}"`);

    // --- Step 2: Set up the repeating AI sequence ---
    const aiMessageSequence = [];

    // Build the sequence based on the new mode and existing feature flags
    switch (MESSAGE_SEQUENCE_MODE) {
        case 'fun-only':
            if (ENABLE_FUN_MESSAGES) {
                aiMessageSequence.push(() => getAIComment(userPrompt, 'fun'));
            }
            break;
        case 'educational-only':
            if (ENABLE_EDUCATIONAL_MESSAGES) {
                aiMessageSequence.push(() => getAIComment(userPrompt, 'educational'));
            }
            break;
        case 'alternate':
        default: // Fallback to 'alternate' for any other value
            if (ENABLE_FUN_MESSAGES) {
                aiMessageSequence.push(() => getAIComment(userPrompt, 'fun'));
            }
            if (ENABLE_EDUCATIONAL_MESSAGES) {
                aiMessageSequence.push(() => getAIComment(userPrompt, 'educational'));
            }
            break;
    }


    // If both are disabled, add a fallback to avoid empty sequence
    if (aiMessageSequence.length === 0) {
        aiMessageSequence.push(() => Promise.resolve(FUN_PREFIX + funFacts[Math.floor(Math.random() * funFacts.length)]));
    }

    let aiStep = 0;
    const getNextAIMessagePromise = () => {
        const messageGenerator = aiMessageSequence[aiStep % aiMessageSequence.length];
        aiStep++;
        return messageGenerator();
    };

    // --- Step 3: Wait for the initial message's display time to pass ---
    // While waiting, we can start fetching the *first* AI message.
    const firstAIMessagePromise = getNextAIMessagePromise();
    await new Promise(resolve => setTimeout(resolve, initialDisplayTime));

    // If generation was stopped or we reached the max count, exit.
    if (!isGenerating) return;
    if (MAX_MESSAGES > 0 && messageCount >= MAX_MESSAGES) {
        stopGenerationSequence();
        return;
    }

    // --- Step 4: Run the main AI message loop ---
    const runAILoop = async () => {
        // The first AI message has been preloading. Now we wait for it to be ready.
        let currentMessage = await firstAIMessagePromise;

        while (isGenerating) {
            // Preload the *next* AI message in the background.
            const nextMessagePromise = getNextAIMessagePromise();

            // Display the AI message we already have.
            showMessage(currentMessage);
            messageCount++; // Count the displayed AI message
            const displayTime = calculateDisplayTime(currentMessage);
            console.log(`Displaying for ${displayTime.toFixed(0)}ms: "${currentMessage}"`);

            // Wait for that calculated amount of time.
            await new Promise(resolve => setTimeout(resolve, displayTime));

            // If the user has stopped the generation, exit the loop.
            if (!isGenerating) break;

            // NEW: If we reached the message limit, stop and exit the loop.
            if (MAX_MESSAGES > 0 && messageCount >= MAX_MESSAGES) {
                stopGenerationSequence();
                break;
            }

            // Now, wait for the next message (which has been preloading) to become the current one.
            currentMessage = await nextMessagePromise;
        }
    };

    runAILoop(); // Start the AI sequence loop
}


/**
 * Hides the spinner and stops the message rotation.
 */
function stopGenerationSequence() {
    isGenerating = false; // This will cause the async loop to terminate
    generateBtn.disabled = false;
    spinnerContainer.style.display = 'none';
    messageArea.textContent = '';
    messageArea.style.opacity = 1; // Reset opacity for the next run
}

// --- Event Listeners ---

generateBtn.addEventListener('click', startGenerationSequence);

// Example of how to stop it (e.g., after the real image generation is complete)
// For now, you can call this from the browser console to test: stopGenerationSequence()
