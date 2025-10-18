
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    console.warn("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateSummary = async (content: string): Promise<string> => {
    if (!process.env.API_KEY) {
        return Promise.resolve("AI summarization is disabled. API key not configured.");
    }
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Summarize the following blog post in three concise bullet points. Use Markdown for formatting:\n\n---\n\n${content}`,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating summary:", error);
        return "Sorry, I couldn't generate a summary for this post right now.";
    }
};
