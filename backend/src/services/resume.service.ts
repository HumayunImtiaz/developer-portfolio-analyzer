import { GoogleGenerativeAI } from '@google/generative-ai';
const pdfParse = require('pdf-parse');
import mammoth from 'mammoth';

export const extractTextFromFile = async (buffer: Buffer, mimetype: string): Promise<string> => {
  try {
    if (mimetype === 'application/pdf') {
      const data = await pdfParse(buffer);
      return data.text;
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }
    throw new Error('Unsupported file type for extraction');
  } catch (error) {
    console.error('File extraction failed', error);
    throw new Error('Could not read file content');
  }
};

export const analyzeResumeWithGemini = async (extractedText: string, jobDescription?: string) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

  console.log(`Original Extracted Text Length: ${extractedText.length} characters`);

  // Truncate text to prevent exceeding API token limits (10,000 chars ~ 2,500 tokens)
  // A standard resume is rarely over 3,000 characters.
  const safeText = extractedText.substring(0, 10000);

  const prompt = `
    You are an expert ATS (Applicant Tracking System) and HR specialist.
    Analyze the following resume text and provide feedback.
    ${jobDescription ? 'Also compare it against this job description: ' + jobDescription : ''}

    Return ONLY valid JSON with this exact structure:
    {
      "atsScore": <number 0-100>,
      "strengths": [<3-5 strings>],
      "improvements": [<3-5 strings>],
      "tips": [<3-5 strings>]
    }

    Resume Text: ${safeText}
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(text);
    return parsedData;
  } catch (error) {
    console.error('Gemini Resume Analysis failed', error);
    throw new Error('AI analysis failed, please try again');
  }
};
