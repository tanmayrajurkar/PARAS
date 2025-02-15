import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateCongestionReport(congestionData) {
  try {
    console.log('Generating report with data:', congestionData);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Analyze the following parking congestion data and generate a detailed report:
      ${JSON.stringify(congestionData, null, 2)}
      
      Please provide:
      1. Executive Summary
      2. Key Findings
      3. Trends by Time Period (Morning, Afternoon, Evening)
      4. Recommendations for Traffic Management
      5. Areas of Concern
      
      Format the response in markdown.
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in generateCongestionReport:', error);
    throw error;
  }
} 