import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function generateCongestionReport(congestionData) {
  try {
    console.log('Generating report with data:', congestionData);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      Analyze the following parking congestion data and generate a detailed report:
      ${JSON.stringify(congestionData, null, 2)}
      
      Please provide:
      1. Executive Summary
      2. Key Findings
      3. Trends by Time Period (Morning, Afternoon, Evening)
      4. Recommendations for Traffic Management
      5. Areas of Concern
      
      Format the response in markdown with proper line breaks and sections.
      Use ## for headers and ensure text wraps properly at around 80 characters per line.
      Add blank lines between paragraphs.
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const response = await result.response;
    
    // Format the text to ensure proper line breaks
    let formattedText = response.text();
    
    // Ensure headers have proper spacing
    formattedText = formattedText.replace(/\n(#{1,6}\s)/g, '\n\n$1');
    
    // Add line breaks if paragraphs are too long
    formattedText = formattedText.replace(/([.!?])\s+(?=[A-Z])/g, '$1\n\n');
    
    return formattedText;
  } catch (error) {
    console.error('Error in generateCongestionReport:', error);
    throw error;
  }
} 
