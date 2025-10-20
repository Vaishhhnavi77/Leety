const chatInput = document.getElementById('chat-input');
const chatArea = document.getElementById('chat-area');
const initialMessage = document.getElementById('initial-message');
const chatMessages = document.getElementById('chat-messages');

// Modal elements
const apiKeyModal = document.getElementById('api-key-modal');
const mainContent = document.getElementById('main-content');
const apiKeyInput = document.getElementById('api-key-input');
const saveApiKeyBtn = document.getElementById('save-api-key-btn');
const apiKeyError = document.getElementById('api-key-error');

const converter = new showdown.Converter();
chrome.runtime.sendMessage({ type: "getApiKey" }, (response) => {
    if (response && response.apiKey) {
        // Key exists, hide modal and show content
        apiKeyModal.style.display = 'none';
        mainContent.classList.remove('blurred');
    } else {
        // No key, show modal and blur content
        apiKeyModal.style.display = 'flex';
        mainContent.classList.add('blurred');
    }
});

saveApiKeyBtn.addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
        apiKeyError.textContent = 'Please enter an API key.';
        return;
    }

    saveApiKeyBtn.disabled = true;
    saveApiKeyBtn.textContent = 'Verifying...';
    apiKeyError.textContent = '';

    try {
        // 3. Send key to background for verification
        const response = await chrome.runtime.sendMessage({ type: 'verifyApiKey', apiKey });
        
        if (response.success) {
            // 4. If successful, save the key
            await chrome.runtime.sendMessage({ type: 'saveApiKey', apiKey });
            apiKeyModal.style.display = 'none';
            mainContent.classList.remove('blurred');
        } else {
            apiKeyError.textContent = 'Invalid API Key. Please check and try again.';
        }
    } catch (error) {
        console.error('Error verifying API key:', error);
        apiKeyError.textContent = 'An error occurred. Check console for details.';
    } finally {
        saveApiKeyBtn.disabled = false;
        saveApiKeyBtn.textContent = 'Save & Verify';
    }
});

// Auto-resize text area
chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = chatInput.scrollHeight + 'px';
});

// Handle 'Enter' key press
chatInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        const prompt = chatInput.value.trim();
        if (prompt) {
            getPromptAnswer(prompt);
            chatInput.value = '';
            chatInput.style.height = 'auto';
        }
    }
});

// Function to scroll the chat area to the bottom
function scrollToBottom() {
    chatArea.scrollTop = chatArea.scrollHeight;
}

async function getPromptAnswer(prompt) {
    // Hide initial message and show chat container
    if (initialMessage.style.display !== 'none') {
        initialMessage.style.display = 'none';
        chatMessages.style.display = 'flex';
    }

    // 1. Create and append the user's message
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message user-message';
    
    const userMessageText = document.createElement('p');
    userMessageText.innerText = prompt; // Use innerText for user prompt
    userMessage.appendChild(userMessageText);
    
    chatMessages.appendChild(userMessage);
    scrollToBottom();

    // 2. Get the bot's response
    // Add a temporary loading message (optional)
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'chat-message bot-message';
    loadingMessage.innerHTML = '<p>...</p>'; 
    chatMessages.appendChild(loadingMessage);
    scrollToBottom();

    try {
        const response = await chrome.runtime.sendMessage({ type: "chat", userPrompt: prompt });
        const htmlOutput = converter.makeHtml(response.output);
        // 3. Replace loading message with the actual response
        loadingMessage.innerHTML = htmlOutput; // Use innerHTML for bot response
        
        console.log(response);

    } catch (error) {
        console.error("Error getting response:", error);
        loadingMessage.innerHTML = `<p>Error: Could not get a response.</p>`;
    }
    
    scrollToBottom();
}