import { GoogleGenerativeAI } from '@google/generative-ai';

export const analyzeWithGemini = async (profileStats: any, repos: any[]) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `
    You are an expert software engineering recruiter and technical assessor. Analyze the following GitHub profile data and repository statistics.
    Provide a JSON response with the following exact structure:
    {
      "score": <number between 0 and 100>,
      "skillLevel": <"Beginner" | "Intermediate" | "Advanced">,
      "strengths": [<array of 3-5 strings>],
      "improvements": [<array of 3-5 strings>],
      "tips": [<array of 3-5 strings>]
    }

    Scoring Logic:
    - Base score on number of repos (more is generally better up to 30), total stars, language diversity, README presence, and apparent commit regularity.
    
    Data:
    Profile Stats: ${JSON.stringify(profileStats)}
    Repositories: ${JSON.stringify(repos.slice(0, 30))} // up to 30 repos
    
    Return ONLY valid JSON. Do not use markdown blocks (\`\`\`json).
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    const parsedData = JSON.parse(text);
    return parsedData;
  } catch (error) {
    console.error('Gemini Analysis failed', error);
    throw new Error('AI Analysis failed');
  }
};

export const compareWithGemini = async (user1Stats: any, user2Stats: any) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `
    You are an expert technical recruiter. Compare these two GitHub developer profiles based on their statistics.
    Provide a concise, 2-3 sentence conclusion stating which profile appears stronger overall and why, or if they have different areas of expertise. At the last mention which one is better
    
    Developer 1: ${JSON.stringify(user1Stats)}
    Developer 2: ${JSON.stringify(user2Stats)}
    
    Return ONLY the raw text conclusion. No markdown formatting.
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Gemini Compare failed', error);
    return "AI comparison is currently unavailable. Both developers show strong potential based on their public statistics.";
  }
};
