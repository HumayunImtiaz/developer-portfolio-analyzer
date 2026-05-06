import OpenAI from 'openai';

// --- Groq AI Setup (FREE, OpenAI-compatible) ---
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || '',
  baseURL: 'https://api.groq.com/openai/v1',
});

export const analyzeWithGemini = async (profileStats: any, repos: any[]) => {
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
    - Base score on number of repos, total stars, language diversity, README presence, and commit regularity.
    
    Data:
    Profile Stats: ${JSON.stringify(profileStats)}
    Repositories: ${JSON.stringify(repos.slice(0, 30))}
    
    Return ONLY valid JSON.
  `;

  console.log('[Groq] Analyzing GitHub profile for:', profileStats?.login || profileStats?.username || 'User');
  console.log('[Groq] Repos count:', repos?.length);

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const text = completion.choices[0]?.message?.content || '';
    const cleanJson = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error: any) {
    console.error('Groq Analysis failed:', error.message);
    
    let userFriendlyMessage = 'AI analysis is currently unavailable. Please try again later.';
    
    if (error.status === 429) {
      userFriendlyMessage = 'AI rate limit reached. Please wait a moment and try again.';
    } else if (error.status === 401) {
      userFriendlyMessage = 'Invalid Groq API key. Please check your configuration.';
    }

    return { error: userFriendlyMessage };
  }
};

export const compareWithGemini = async (user1Stats: any, user2Stats: any) => {
  const prompt = `
    You are an expert technical recruiter. Compare these two GitHub developer profiles.
    Provide a concise 2-3 sentence conclusion stating which profile is stronger and why.
    
    Developer 1: ${JSON.stringify(user1Stats)}
    Developer 2: ${JSON.stringify(user2Stats)}
    
    Return ONLY plain text. No markdown formatting.
  `;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content?.trim() || "AI comparison is currently unavailable.";
  } catch (error) {
    console.error('Groq Compare failed', error);
    return "AI comparison is currently unavailable.";
  }
};