import { Request, Response } from 'express';
import AnalysisReport from '../models/analysisReport.model';

export const getAnalysis = async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const report = await AnalysisReport.findOne({ githubUsername: new RegExp(`^${username}$`, 'i') }).sort({ createdAt: -1 });
    
    if (!report) {
      return res.status(404).json({ success: false, message: 'Analysis report not found' });
    }

    res.json({
      success: true,
      analysis: report,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
