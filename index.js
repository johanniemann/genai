const API_KEY = "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"; // Replace with your actual API key
const MODEL_ID = "tiiuae/falcon-7b-instruct"; // Confirm this model ID is correct

const form = document.querySelector("#question-form");
const answerElement = document.querySelector("#answer");

// The base prompt to send to the AI
const basePrompt = "In the following city, give me the top 10 most famous people from that city, it has to be people!!!!!: ";

form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent page reload
    const city = document.querySelector("#city").value.trim();

    if (!city) {
        answerElement.textContent = "Please enter a valid city.";
        return;
    }

    answerElement.textContent = "Loading...";

    try {
        const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL_ID}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: `${basePrompt}${city}`, // Combine the base prompt with the city
                parameters: { max_length: 1000 }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();

        // Extract and display only the answer from the response
        const generatedText = data?.[0]?.generated_text;
        if (generatedText) {
            answerElement.textContent = generatedText;
        } else {
            answerElement.textContent = "No suggestion was generated. Please try again.";
        }
    } catch (error) {
        console.error("Error:", error);
        answerElement.textContent = `An error occurred: ${error.message}`;
    }
});
