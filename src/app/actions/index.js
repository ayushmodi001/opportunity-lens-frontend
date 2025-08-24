"use server"

import { signIn, signOut } from "@/auth"
import { GoogleGenerativeAI } from "@google/generative-ai";
import { User } from "@/model/user-model";
import { auth } from "@/auth";

export async function toggleModuleCompletion(moduleTitle, completed) {
    "use server";
    const session = await auth();
    if (!session?.user?.email) {
        throw new Error("User not authenticated.");
    }

    try {
        const result = await User.updateOne(
            { email: session.user.email, "learningPath.title": moduleTitle },
            { $set: { "learningPath.$.completed": completed } }
        );

        if (result.nModified === 0) {
            // This can happen if the module title doesn't match.
            // You might want to handle this case, e.g., by returning an error.
            console.warn(`No module found with title: ${moduleTitle} for user: ${session.user.email}`);
        }
        
        // No need to revalidate if you're handling state on the client
        // revalidatePath("/learn"); 

        return { success: true };

    } catch (error) {
        console.error("Error updating module completion:", error);
        return { error: "Failed to update module status." };
    }
}


export async function generatePersonalizedCourse(topics) {
    const session = await auth();
    if (!session?.user?.email) {
        return { error: "User not authenticated." };
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const jsonFormat = `
    [
        {
            "title": "Module 1: Topic Name",
            "chapters": [
                {
                    "title": "Chapter 1: Sub-topic",
                    "subTopics": [
                        { "title": "State-a Component's  Memory", "demoLink": "https://react.dev/learn/state-a-components-memory" },
                        { "title": "Stacks", "demoLink": "https://www.geeksforgeeks.org/dsa/stack-data-structure/" }
                    ]
                }
            ],
            "completed": false
        }
    ]
    `;

    const prompt = `
    Based on the following topics: ${topics.join(", ")}. 
    Generate a structured learning path for a beginner.
    The output MUST be a valid JSON array, following this exact structure and format: ${jsonFormat}.
    Do not include any text, explanations, or markdown formatting like \`\`\`json before or after the JSON array.
    Do NOT include any quizzes or assessments. The path is for learning only.
    Create 2-3 modules, each with 2-3 chapters. Each chapter should have 2-3 sub-topics Those subtopics should have a link to a valid page like gfg or w3schools for eg a react module would include link to react doc.
    The demoLink paths should be structured logically based on the module and chapter titles.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const learningPathData = JSON.parse(text);

        await User.updateOne(
            { email: session.user.email },
            { $set: { learningPath: learningPathData } }
        );

        return { success: true };

    } catch (error) {
        console.error("Error generating or saving personalized course:", error);
        return { error: "Failed to generate the learning path. Please try again." };
    }
}

export  async function doSocialLogin(formData) {
        const action = formData.get('action')
        await signIn (action, {redirectTo  : "/dashboard"})
        // console.log(action)
}

export async function doLogout(){
    await signOut ({redirectTo : "/"})
}

export async function doCredLogin(formData) {
    try {
        const response = await signIn("credentials", {
            email: formData.get('email'),
            password: formData.get('password'),
            redirect: false
        });

        // This part is for successful logins or other non-throwing errors
        if (response && response.error) {
            return { error: "Invalid credentials or user not found." };
        }
        
        return response; // Success case

    } catch (error) {
        // This catches errors thrown by signIn, like invalid credentials
        if (error.type === 'CredentialsSignin' || error.message.includes('CredentialsSignin')) {
            return { error: "Invalid credentials or user not found." };
        }
        // For any other unexpected errors
        console.error("Catch block error in doCredLogin:", error);
        return { error: "An internal server error occurred." };
    }
}

export async function getLearningSuggestions(skills) {
    if (!skills || skills.length === 0) {
        return { error: "No skills provided to get suggestions for." };
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an expert course recommender. Your goal is to provide high-quality, relevant online courses for a user looking to improve their technical skills.

            The user is weak in these topics: **${skills.join(', ')}**.

            Find 3-4 courses for them, following these strict rules:

            **CRITICAL INSTRUCTIONS:**
            1.  **RELEVANCE IS KEY:** The course content must be directly relevant to the listed skills.
            2.  **VERIFY LINKS:** Ensure every course link is currently active and leads to the course landing page.
            3.  **DIVERSE PLATFORMS:** Suggest courses from reputable platforms like Udemy, Coursera, freeCodeCamp, Pluralsight, or official documentation tutorials.

            **OUTPUT FORMAT:**
            - You MUST return **ONLY** a valid JSON array of objects.
            - NO other text, explanations, or markdown.
            - Each object MUST contain these keys: "title", "link", "platform", and "description".

            Example of a perfect, verified response:
            \`\`\`json
            [
              {
                "title": "The Complete 2024 Web Development Bootcamp",
                "link": "https://www.udemy.com/course/the-complete-web-development-bootcamp/",
                "platform": "Udemy",
                "description": "A comprehensive course covering HTML, CSS, Javascript, Node, React, MongoDB, and more."
              },
              {
                "title": "Google Data Analytics Professional Certificate",
                "link": "https://www.coursera.org/professional-certificates/google-data-analytics",
                "platform": "Coursera",
                "description": "Gain an immersive understanding of the practices and processes used by a junior or associate data analyst in their day-to-day job."
              }
            ]
            \`\`\`
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        
        let jsonString = text.replace(/```json|```/g, '').trim();
        
        // A more robust way to find the JSON part
        if (jsonString.indexOf('[') > -1 && jsonString.lastIndexOf(']') > -1) {
            jsonString = jsonString.substring(jsonString.indexOf('['), jsonString.lastIndexOf(']') + 1);
        }

        try {
            const suggestions = JSON.parse(jsonString);
            return suggestions;
        } catch (parseError) {
            console.error("Failed to parse JSON response from AI:", parseError);
            console.error("Raw AI response:", text);
            return { error: "The AI returned an invalid response. Please try again." };
        }

    } catch (error) {
        console.error("Error fetching learning suggestions:", error);
        if (error.message.includes('API key not valid')) {
            return { error: "The AI service API key is not valid. Please check your configuration." };
        }
        return { error: "Could not connect to the AI service. Please try again later." };
    }
}