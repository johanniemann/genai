const OPENAI_API_KEY = 'xxx'; // Replace with your actual OpenAI API key

const form = document.querySelector("#ingredient-form");
const suggestionsElement = document.querySelector("#suggestions");

// Base prompt for dish suggestions
const basePrompt = "Give me the top 10 most famous people from the following city, and make it a list: ";

form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent page reload
    const ingredient = document.querySelector("#ingredient").value.trim();

    if (!ingredient) {
        suggestionsElement.textContent = "Please enter a valid ingredient.";
        return;
    }

    suggestionsElement.textContent = "Loading...";
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [{
                    role: 'user',
                    content: `${basePrompt}${ingredient}`
                }],
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const suggestionData = await response.json();
        console.log("API Response:", suggestionData);

        // Extract and display the AI's response
        const generatedText = suggestionData?.choices?.[0]?.message?.content;
        if (generatedText) {
            suggestionsElement.textContent = generatedText;
        } else {
            suggestionsElement.textContent = "No suggestions were generated. Please try again.";
        }
    } catch (error) {
        console.error("Error:", error);
        suggestionsElement.textContent = `An error occurred: ${error.message}`;
    }
});
