import { AffindaAPI, AffindaCredential } from '@affinda/affinda';
import OpenAI from 'openai';

// --- Affinda Setup ---
const credential = new AffindaCredential(process.env.AFFINDA_API_KEY || '');
const affindaClient = new AffindaAPI(credential);

// --- Groq AI Setup (FREE, OpenAI-compatible) ---
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || '',
  baseURL: 'https://api.groq.com/openai/v1',
});

/**
 * Parse resume using Affinda API — extracts structured data (skills, experience, education, etc.)
 */
export const parseResumeWithAffinda = async (buffer: Buffer, fileName: string) => {
  try {
    console.log(`[Affinda] Starting parse for file: ${fileName}`);
    const document = await affindaClient.createDocument({
      file: buffer,
      fileName,
      wait: 'true',
      workspace: process.env.AFFINDA_WORKSPACE || undefined,
      collection: process.env.AFFINDA_COLLECTION || undefined, 
    });

    // If data is empty, it means collection/document type wasn't specified correctly in .env
    const data: any = document.data || {};
    
    if (Object.keys(data).length === 0) {
      console.warn('[Affinda] WARNING: No data extracted. Please ensure AFFINDA_COLLECTION in .env is a "Resume" type collection.');
    }
    console.log('[Affinda] Raw data keys received:', Object.keys(data || {}));

    // Extract structured sections from Affinda's response
    const parsed = {
      name: data?.name?.raw || 'N/A',
      email: data?.emails?.[0] || 'N/A',
      phone: data?.phoneNumbers?.[0] || 'N/A',
      skills: (data?.skills || []).map((s: any) => s.name || s).filter(Boolean),
      experience: (data?.workExperience || []).map((exp: any) => ({
        title: exp.jobTitle || '',
        company: exp.organization || '',
        dates: exp.dates?.rawText || '',
        description: exp.jobDescription || '',
      })),
      education: (data?.education || []).map((edu: any) => ({
        degree: edu.accreditation?.education || edu.accreditation?.inputStr || '',
        institution: edu.organization || '',
        dates: edu.dates?.rawText || '',
      })),
      summary: data?.summary || '',
      rawText: data?.rawText || '',
    };

    console.log('[Affinda] Extraction complete:', {
      name: parsed.name,
      skillsCount: parsed.skills.length,
      expCount: parsed.experience.length,
      eduCount: parsed.education.length
    });

    return parsed;
  } catch (error: any) {
    console.error('Affinda Resume Parsing failed:', error.message || error);
    throw new Error('Resume parsing failed. Please check your file and try again.');
  }
};

/**
 * Analyze parsed resume data with Groq AI (Llama 3) for ATS scoring and feedback
 */
export const analyzeResumeWithGemini = async (
  parsedData: ReturnType<typeof formatParsedForPrompt>,
  jobDescription?: string
) => {
  const prompt = `
    You are an expert ATS (Applicant Tracking System) and HR specialist.
    Analyze the following STRUCTURED resume data (parsed by Affinda AI) and provide feedback.
    ${jobDescription ? 'Also compare it against this job description: ' + jobDescription : ''}

    Resume Data:
    - Name: ${parsedData.name}
    - Skills: ${parsedData.skills}
    - Experience: ${parsedData.experience}
    - Education: ${parsedData.education}
    - Summary: ${parsedData.summary}

    Return ONLY valid JSON with this exact structure:
    {
      "atsScore": <number 0-100>,
      "strengths": [<3-5 strings>],
      "improvements": [<3-5 strings>],
      "tips": [<3-5 strings>]
    }
  `;

  console.log('[Groq] Sending prompt to AI...');

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const text = completion.choices[0]?.message?.content || '';
    console.log('[Groq] AI Response received');
    const cleanJson = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error: any) {
    console.error('Groq AI Resume Analysis failed', error);

    let userFriendlyMessage = 'AI analysis is currently unavailable. Please try again later.';

    if (error.status === 429) {
      userFriendlyMessage = 'AI rate limit reached. Please wait a moment and try again.';
    } else if (error.status === 401) {
      userFriendlyMessage = 'Invalid Groq API key. Please check your configuration.';
    }

    return { error: userFriendlyMessage };
  }
};

/**
 * Helper: Format parsed Affinda data into a readable string for the Gemini prompt
 */
export const formatParsedForPrompt = (parsed: Awaited<ReturnType<typeof parseResumeWithAffinda>>) => {
  return {
    name: parsed.name,
    skills: parsed.skills.join(', ') || 'None listed',
    experience: parsed.experience
      .map((e: any) => `${e.title} at ${e.company} (${e.dates})`)
      .join('; ') || 'None listed',
    education: parsed.education
      .map((e: any) => `${e.degree} from ${e.institution} (${e.dates})`)
      .join('; ') || 'None listed',
    summary: parsed.summary || 'No summary provided',
  };
};
