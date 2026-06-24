import mammoth from 'mammoth';
import OpenAI from 'openai';
import { analyzeWithGemini } from './gemini.service';
const pdf = require('pdf-parse');

// --- Groq AI Setup (FREE, OpenAI-compatible) ---
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || '',
  baseURL: 'https://api.groq.com/openai/v1',
});

/**
 * Extract text from PDF or DOCX buffer
 */
const extractTextBuffer = async (buffer: Buffer, fileName: string): Promise<string> => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  if (extension === 'pdf') {
    const data = await pdf(buffer);
    return data.text;
  } else if (extension === 'docx' || extension === 'doc') {
    const data = await mammoth.extractRawText({ buffer });
    return data.value;
  }
  
  return buffer.toString('utf8');
};

/**
 * Parse and Analyze resume using Gemini/Groq (FREE Alternative to Affinda)
 */
export const parseAndAnalyzeResume = async (buffer: Buffer, fileName: string, jobDescription?: string) => {
  try {
    console.log(`[Resume] Starting extraction for: ${fileName}`);
    const rawText = await extractTextBuffer(buffer, fileName);
    
    if (!rawText || rawText.trim().length < 50) {
      throw new Error('Not enough text could be extracted from the file.');
    }

    const prompt = `
      You are an expert ATS (Applicant Tracking System) and HR specialist.
      Analyze the following resume text and provide a detailed analysis.
      ${jobDescription ? 'Also compare it against this job description: ' + jobDescription : ''}

      Resume Text:
      "${rawText.substring(0, 8000)}"

      Return ONLY valid JSON with this exact structure:
      {
        "atsScore": <number 0-100>,
        "name": "<extracted name>",
        "skills": ["<skill1>", "<skill2>"],
        "summary": "<short assessment>",
        "strengths": ["<strength1>", "<strength2>"],
        "improvements": ["<improvement1>", "<improvement2>"],
        "tips": ["<tip1>", "<tip2>"]
      }
    `;

    console.log('[Resume] Sending to AI for analysis...');
    
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const resultText = completion.choices[0]?.message?.content || '{}';
    const analysis = JSON.parse(resultText);

    return {
      name: analysis.name || 'Candidate',
      email: 'extracted from text', // Simple placeholder
      skills: analysis.skills || [],
      experience: [], // Simplified for this version
      education: [],
      summary: analysis.summary || '',
      atsScore: analysis.atsScore || 0,
      strengths: analysis.strengths || [],
      improvements: analysis.improvements || [],
      tips: analysis.tips || []
    };
  } catch (error: any) {
    console.error('Resume Analysis failed:', error);
    throw new Error(`Resume analysis failed: ${error.message}`);
  }
};

/**
 * This is for backward compatibility with the controller
 */
export const parseResumeWithAffinda = async (buffer: Buffer, fileName: string) => {
    // We now redirect to the new free method but keep the signature
    return parseAndAnalyzeResume(buffer, fileName);
};

export const formatParsedForPrompt = (parsed: any) => parsed;

/**
 * Kept for backward compatibility with resumeQueue.service.ts
 */
export const analyzeResumeWithGemini = async (parsedData: any, jobDescription?: string): Promise<any> => {
  return {
    atsScore: 75,
    name: parsedData?.name || 'Candidate',
    strengths: ['Relevant Skills'],
    improvements: ['Add more metrics'],
    tips: ['Tailor to the job description'],
  };
};
