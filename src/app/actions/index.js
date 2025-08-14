"use server"

import { signIn, signOut } from "@/auth"
import { GoogleGenerativeAI } from "@google/generative-ai";

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
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

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
        
        // Clean the response to ensure it's valid JSON
        const jsonString = text.replace(/```json|```/g, '').trim();
        
        const suggestions = JSON.parse(jsonString);
        return suggestions;

    } catch (error) {
        console.error("Error fetching learning suggestions:", error);
        return { error: "Failed to get suggestions from AI. The API key might be invalid or the service may be down." };
    }
}