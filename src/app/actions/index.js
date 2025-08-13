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

export async function doCredLogin(formData){
    try {
        const response = await signIn("credentials", {
            email : formData.get('email'),
            password : formData.get('password'),
            redirect : false
        })
        return response;
    } catch (error) {
        console.log(error)
        return { error: "Invalid credentials. Please try again." };
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
            Based on the following list of technical skills, please suggest 3-5 relevant YouTube videos that can help someone improve in these areas. The user is weak in these topics: ${skills.join(', ')}.

            For each video, provide the following information in a clear JSON format:
            - Title
            - A direct link to the video
            - The name of the YouTube channel
            - A direct link to the video thumbnail image

            Return ONLY a valid JSON array of objects, with no other text or explanations. Each object in the array should represent a single video and have the keys: "title", "link", "channel", and "thumbnail".
            Example format:
            [
              {
                "title": "Full React Course 2024",
                "link": "https://www.youtube.com/watch?v=...",
                "channel": "FreeCodeCamp",
                "thumbnail": "https://i.ytimg.com/vi/.../hqdefault.jpg"
              }
            ]
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