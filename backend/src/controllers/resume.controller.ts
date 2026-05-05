import { Response } from 'express';
import { AuthRequest } from '../types';
import ResumeAnalysis from '../models/resumeAnalysis.model';
import { extractTextFromFile } from '../services/resume.service';
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

    // Extract text from the buffer synchronously
    const extractedText = await extractTextFromFile(file.buffer, file.mimetype);

    // Enqueue the AI processing to BullMQ and wait for result
    const result = await enqueueResumeAnalysis({
      userId,
      fileName: file.originalname,
      extractedText,
      jobDescription,
    });

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
