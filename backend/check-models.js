
require("dotenv").config();

async function checkModels() {
    try {
        const response = await fetch(
            "http://127.0.0.1:31415/v1/models",
            {
                headers: {
                    Authorization: `Bearer ${process.env.FREEAPI_KEY}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`API returned status ${response.status}`);
        }

        const result = await response.json();

        const models = result.data || [];

        const availableModels = models.filter(
            model => model.available === true
        );

        console.log("\nAvailable models:\n");

        if (availableModels.length === 0) {
            console.log("No models marked as available.");
            return;
        }

        availableModels.forEach(model => {
            console.log(`Model ID: ${model.id}`);
            console.log(`Name: ${model.name}`);
            console.log("---------------------------");
        });

    } catch (error) {
        console.error("Error:", error.message);
    }
}

checkModels();
