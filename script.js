const apiKeyInput = document.getElementById("apikey");
const category = document.getElementById("category");
const promptInput = document.getElementById("prompt");
const output = document.getElementById("output");
const generateBtn = document.getElementById("generate");
const copyBtn = document.getElementById("copy");
const clearBtn = document.getElementById("clear");
const loading = document.getElementById("loading");

// Load saved API key
window.onload = () => {
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) {
        apiKeyInput.value = savedKey;
    }
};

// Save API key
apiKeyInput.addEventListener("input", () => {
    localStorage.setItem("gemini_api_key", apiKeyInput.value.trim());
});

// Prompt templates
function getSystemPrompt(type) {

    switch(type){

        case "Coding":
            return `You are an expert Prompt Engineer.

Rewrite the user's coding prompt.

Improve it by adding:
- Programming language
- Framework
- Requirements
- Best practices
- Expected output

Return ONLY the improved prompt.`;

        case "Writing":
            return `Rewrite the prompt to be detailed, creative and professional.

Return ONLY the improved prompt.`;

        case "Marketing":
            return `Rewrite the marketing prompt to maximize conversions.

Return ONLY the improved prompt.`;

        case "Image Generation":
            return `Rewrite the prompt for AI image generators.

Include:
- Style
- Lighting
- Camera
- Composition
- Colors
- Details

Return ONLY the improved prompt.`;

        default:
            return `You are an expert AI Prompt Engineer.

Rewrite the user's prompt.

Make it:
- Clear
- Detailed
- Specific
- Professional
- AI optimized

Return ONLY the improved prompt.`;
    }

}

generateBtn.addEventListener("click", async () => {

    const apiKey = apiKeyInput.value.trim();
    const prompt = promptInput.value.trim();

    if (!apiKey) {
        alert("Please enter your Gemini API Key.");
        return;
    }

    if (!prompt) {
        alert("Please enter a prompt.");
        return;
    }

    loading.classList.remove("hidden");
    output.value = "";
    generateBtn.disabled = true;

    try {

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text:
`${getSystemPrompt(category.value)}

User Prompt:

${prompt}`
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if(data.error){
            throw new Error(data.error.message);
        }

        output.value =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response received.";

    }
    catch(error){

        output.value =
`Error:

${error.message}

Make sure your API key is valid.`;

    }

    loading.classList.add("hidden");
    generateBtn.disabled = false;

});

// Copy Output
copyBtn.addEventListener("click",()=>{

    if(!output.value){
        alert("Nothing to copy.");
        return;
    }

    navigator.clipboard.writeText(output.value);

    copyBtn.textContent="Copied!";

    setTimeout(()=>{
        copyBtn.textContent="Copy";
    },2000);

});

// Clear
clearBtn.addEventListener("click",()=>{

    promptInput.value="";
    output.value="";

});
