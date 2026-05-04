import { Request, Response } from 'express';
import { fetchGithubProfile } from '../services/github.service';

import { compareWithGemini } from '../services/gemini.service';

export const compareUsers = async (req: Request, res: Response) => {
  const { username1, username2 } = req.body;

  try {
    let user1Data, user2Data;

    try {
      user1Data = await fetchGithubProfile(username1);
    } catch (error) {
      return res.status(404).json({ success: false, field: 'username1', message: `User '${username1}' not found` });
    }

    try {
      user2Data = await fetchGithubProfile(username2);
    } catch (error) {
      return res.status(404).json({ success: false, field: 'username2', message: `User '${username2}' not found` });
    }

    const aiComparison = await compareWithGemini(
      { username: username1, ...user1Data.profile?.stats },
      { username: username2, ...user2Data.profile?.stats }
    );

    res.json({
      success: true,
      comparison: {
        user1: {
          profile: user1Data.profile,
          repositories: user1Data.repos
        },
        user2: {
          profile: user2Data.profile,
          repositories: user2Data.repos
        },
        aiComparison
      }
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
