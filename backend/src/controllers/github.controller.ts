import { Request, Response } from 'express';
import { fetchGithubProfile } from '../services/github.service';
import { enqueueAnalysis } from '../services/queue.service';
import GithubProfile from '../models/githubProfile.model';
import AnalysisReport from '../models/analysisReport.model';

export const analyzeUser = async (req: Request, res: Response) => {
  const { username } = req.body;
  const userId = (req as any).user?.id;

  try {
    const { profile, repos } = await fetchGithubProfile(username);

    // Check if an analysis is already completed recently
    const existingReport = await AnalysisReport.findOne({ githubUsername: new RegExp(`^${username}$`, 'i') });
    
    if (existingReport && existingReport.status === 'completed') {
      const hoursSinceFetch = (Date.now() - existingReport.createdAt.getTime()) / (1000 * 60 * 60);
      if (hoursSinceFetch < 24) {
        return res.json({
          success: true,
          profile,
          repositories: repos,
          analysis: existingReport,
        });
      }
    }

    // Set analysis status to pending in DB before enqueuing
    let pendingAnalysis = await AnalysisReport.findOne({ githubUsername: new RegExp(`^${username}$`, 'i') });
    if (pendingAnalysis) {
      pendingAnalysis.status = 'pending';
      pendingAnalysis.createdAt = new Date();
      await pendingAnalysis.save();
    } else {
      pendingAnalysis = await AnalysisReport.create({
        githubUsername: username,
        status: 'pending',
        createdAt: new Date()
      });
    }

    // Enqueue the job for Gemini
    await enqueueAnalysis({
      username,
      profileStats: profile?.stats,
      repos,
      userId,
    });
    
    res.json({
      success: true,
      profile,
      repositories: repos,
      analysis: { ...(pendingAnalysis ? pendingAnalysis.toObject() : {}), pending: true },
    });
  } catch (error: any) {
    if (error.response?.status === 404 || error.message.includes('404')) {
      return res.status(404).json({ success: false, message: 'User not found on GitHub' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const profile = await GithubProfile.findOne({ username: new RegExp(`^${username}$`, 'i') }).populate('repoList');
    
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found in database' });
    }

    res.json({
      success: true,
      profile,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
