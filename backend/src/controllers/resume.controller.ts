import { Response } from 'express';
import { AuthRequest } from '../types';
import ResumeAnalysis from '../models/resumeAnalysis.model';
import { parseAndAnalyzeResume } from '../services/resume.service';

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

    // New Free Method: Parses text and analyze with AI in one go
    const analysis = await parseAndAnalyzeResume(file.buffer, file.originalname, jobDescription);

    // Save to Database
    const savedAnalysis = await ResumeAnalysis.create({
      userId,
      fileName: file.originalname,
      name: analysis.name,
      skills: analysis.skills,
      summary: analysis.summary,
      atsScore: analysis.atsScore,
      strengths: analysis.strengths,
      improvements: analysis.improvements,
      tips: analysis.tips,
      status: 'completed'
    });

    res.status(200).json({
      success: true,
      data: savedAnalysis,
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
