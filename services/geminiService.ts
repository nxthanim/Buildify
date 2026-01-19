
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedApp } from '../types';

// This function simulates a call to the Gemini API to get a structured app definition.
// In a real application, you would replace the setTimeout with a real API call.
export const generateAppFromPrompt = async (prompt: string): Promise<Omit<GeneratedApp, 'id' | 'userId' | 'createdAt' | 'liveUrl' | 'status' | 'updatedAt' | 'icon'>> => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using mock data.");
    // Fallback to mock data if API key is not available
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                name: "Mock Pet Social App",
                tagline: "Connecting pets and their people.",
                description: prompt,
                coreFeatures: ["User Profiles", "Photo Feed", "Event Scheduling", "Direct Messaging"],
                colorPalette: {
                    primary: '#3B82F6',
                    secondary: '#10B981',
                    background: '#1F2937',
                },
            });
        }, 8000); // Simulate network and generation delay
    });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "A catchy, short name for the application." },
      tagline: { type: Type.STRING, description: "A brief, memorable slogan for the app." },
      description: { type: Type.STRING, description: "A one-paragraph summary of the app's purpose and features, based on the user's prompt." },
      coreFeatures: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of 4-6 essential features for the application."
      },
      colorPalette: {
        type: Type.OBJECT,
        properties: {
          primary: { type: Type.STRING, description: "A hex code for the primary brand color." },
          secondary: { type: Type.STRING, description: "A hex code for an accent or secondary color." },
          background: { type: Type.STRING, description: "A hex code for the main background, suitable for a dark or light theme." },
        },
        required: ["primary", "secondary", "background"]
      }
    },
    required: ["name", "tagline", "description", "coreFeatures", "colorPalette"]
  };

  const fullPrompt = `Based on the following user prompt, generate a detailed plan for a web application.
  
  USER PROMPT: "${prompt}"
  
  Your response must be a JSON object that strictly follows the provided schema. Generate creative but plausible details.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: fullPrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    },
  });

  try {
    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    return parsedJson as Omit<GeneratedApp, 'id' | 'userId' | 'createdAt' | 'liveUrl' | 'status' | 'updatedAt' | 'icon'>;
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    throw new Error("Failed to parse AI response. The generated JSON was invalid.");
  }
};
