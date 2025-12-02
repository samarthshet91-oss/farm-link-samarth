import { GoogleGenAI, Type } from "@google/genai";

// Ensure we have an API key (in a real app, this comes from env)
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to check if AI is available
export const isAiAvailable = () => !!apiKey;

/**
 * Analyzes a crop image to extract details using Gemini Vision.
 */
export const analyzeCropImage = async (base64Image: string) => {
  if (!apiKey) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: 'Analyze this crop image. Identify the crop name, estimate a quality grade (A, B, or C), and suggest a competitive market price per kg in INR (Indian Rupee) based on visual quality. Return JSON.' }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cropName: { type: Type.STRING },
            qualityGrade: { type: Type.STRING, enum: ['A', 'B', 'C'] },
            estimatedPrice: { type: Type.NUMBER },
            description: { type: Type.STRING },
            confidence: { type: Type.NUMBER }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI Image Analysis Error:", error);
    return null;
  }
};

/**
 * Predicts price based on text inputs.
 */
export const predictPrice = async (crop: string, location: string, season: string) => {
  if (!apiKey) return null;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Predict the current market price range for ${crop} in ${location} during ${season}. Return a JSON object with minPrice, maxPrice, and currency (use INR).`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            minPrice: { type: Type.NUMBER },
            maxPrice: { type: Type.NUMBER },
            currency: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI Price Prediction Error:", error);
    return null;
  }
};

/**
 * Matches buyers and farmers based on unstructured data.
 */
export const matchOpportunities = async (listings: any[], requests: any[]) => {
  if (!apiKey) return [];
  
  try {
    const prompt = `
      Act as a matching engine.
      Listings: ${JSON.stringify(listings.map(l => ({ id: l.id, crop: l.cropName, loc: l.location, qty: l.quantity })))}
      Requests: ${JSON.stringify(requests.map(r => ({ id: r.id, crop: r.cropName, loc: r.location, qty: r.quantityNeeded })))}
      
      Find the best matches. Return a JSON array of objects.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              listingId: { type: Type.STRING },
              requestId: { type: Type.STRING },
              matchScore: { type: Type.NUMBER, description: "0 to 100" },
              reason: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("AI Matching Error:", error);
    return [];
  }
};

/**
 * Chat Assistant helper
 */
export const getChatAssistance = async (history: string[], userMessage: string) => {
  if (!apiKey) return "I'm offline right now (No API Key).";
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "You are a helpful AI assistant for farmers and buyers. Keep responses concise and professional."
      }
    });
    
    // In a real app we'd load history properly, here we just send the message
    const result = await chat.sendMessage({ message: userMessage });
    return result.text;
  } catch (error) {
    return "Sorry, I couldn't process that.";
  }
};