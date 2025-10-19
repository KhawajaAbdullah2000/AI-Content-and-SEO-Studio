
import { GoogleGenAI, Type } from "@google/genai";
import { SEOAnalysis } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const seoAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    suggestedTitles: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of 5 suggested SEO-friendly titles for the content.",
    },
    metaDescription: {
      type: Type.STRING,
      description: "A concise and compelling meta description, maximum 160 characters.",
    },
    primaryKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of the main keywords found in the text.",
    },
    secondaryKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of secondary or LSI keywords that could be included to improve SEO.",
    },
    readabilityAnalysis: {
      type: Type.OBJECT,
      properties: {
        score: {
          type: Type.STRING,
          description: "A readability score, e.g., 'Good', 'Needs Improvement', 'Excellent'.",
        },
        feedback: {
          type: Type.STRING,
          description: "A brief explanation for the readability score and how to improve it.",
        },
      },
      required: ['score', 'feedback'],
    },
  },
  required: ['suggestedTitles', 'metaDescription', 'primaryKeywords', 'secondaryKeywords', 'readabilityAnalysis'],
};


export const generateContentForTopic = async (topic: string): Promise<string> => {
  try {
    const prompt = `You are an expert content writer and SEO specialist. Write a high-quality, engaging, and SEO-friendly blog post about the following topic: "${topic}". The article should be well-structured with a clear introduction, body, and conclusion. Use headings, subheadings, and lists where appropriate. The tone should be professional yet accessible. Output the entire content in Markdown format.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content. Please check your API key and try again.");
  }
};

export const getSeoAnalysis = async (content: string): Promise<SEOAnalysis> => {
    try {
        const prompt = `You are a world-class SEO expert. Analyze the following text content and provide SEO optimization suggestions. Your response must be in JSON format matching the provided schema. Content to analyze: \n\n${content}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: seoAnalysisSchema,
            },
        });
        
        const jsonText = response.text.trim();
        // The Gemini API with responseSchema should return a valid JSON string.
        return JSON.parse(jsonText) as SEOAnalysis;

    } catch (error) {
        console.error("Error analyzing SEO:", error);
        throw new Error("Failed to analyze content. The API may have returned an unexpected format.");
    }
};
