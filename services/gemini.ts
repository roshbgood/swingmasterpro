import { GoogleGenAI } from "@google/genai";
import { AnalysisResult } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeTicker = async (ticker: string, timeframe: string): Promise<AnalysisResult> => {
  try {
    const ai = getAiClient();
    
    // Using search grounding to get real-time info
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the ticker symbol ${ticker} for a swing trading setup on the ${timeframe} timeframe.
      
      Focus on:
      1. Upcoming catalysts (earnings, fda approvals, macro events) in the next 2 weeks.
      2. Recent major news headlines.
      3. Overall sector sentiment.
      
      Provide a concise summary, a sentiment rating (bullish, bearish, neutral), and a list of specific upcoming catalysts.
      `,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a professional swing trader assistant. Be concise, objective, and risk-focused.",
        temperature: 0.3,
      },
    });

    const text = response.text || "No analysis generated.";
    
    // Extract grounding chunks for sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const newsLinks = groundingChunks
      .filter((chunk: any) => chunk.web?.uri && chunk.web?.title)
      .map((chunk: any) => ({
        title: chunk.web.title,
        url: chunk.web.uri,
        source: "Web Source" 
      }));

    // Basic heuristic parsing of the unstructured text for the demo
    // In a production app, we would ask for JSON schema, but Search Grounding doesn't support JSON schema yet.
    const sentiment = text.toLowerCase().includes("bullish") ? 'bullish' : 
                      text.toLowerCase().includes("bearish") ? 'bearish' : 'neutral';

    // Extract list items as catalysts roughly
    const lines = text.split('\n');
    const catalysts = lines
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*') || line.trim().match(/^\d+\./))
      .slice(0, 5) // Take top 5 bullet points
      .map(line => line.replace(/^[-*]\s*|^\d+\.\s*/, '').trim());

    return {
      summary: text,
      sentiment,
      catalysts: catalysts.length > 0 ? catalysts : ["See summary for details"],
      newsLinks
    };

  } catch (error) {
    console.error("Error analyzing ticker:", error);
    throw error;
  }
};
