import { Response } from 'express';
import { AuthRequest } from '../types';
import ResumeAnalysis from '../models/resumeAnalysis.model';
import { parseResumeWithAffinda, analyzeResumeWithGemini, formatParsedForPrompt } from '../services/resume.service';
import { enqueueResumeAnalysis } from '../services/resumeQueue.service';

export const analyzeResume = async (req: AuthRequest, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: 'Please upload a resume file' });
    }

    const { jobDescription } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    // Step 1: Parse resume with Affinda (structured extraction)
    const parsedData = await parseResumeWithAffinda(file.buffer, file.originalname);
    const formattedData = formatParsedForPrompt(parsedData);

    const result = await enqueueResumeAnalysis({
      userId,
      fileName: file.originalname,
      parsedData: formattedData,
      jobDescription,
    });

    if (result && result.error) {
      return res.status(400).json({ success: false, message: result.error });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Analyze Resume Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'AI analysis failed, please try again',
    });
  }
};

export const getResumeHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const history = await ResumeAnalysis.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error: any) {
    console.error('Get Resume History Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resume history',
    });
  }
};
