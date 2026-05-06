import { Queue, Worker } from 'bullmq';
import { redisClient } from '../config/redis';
import { analyzeWithGemini } from './gemini.service';
import AnalysisReport from '../models/analysisReport.model';

const queueName = 'gemini-analysis';
const redisUrl = process.env.UPSTASH_REDIS_URL;

// Only init BullMQ if Redis is configured
let analysisQueueInstance: Queue | null = null;

if (redisUrl) {
  analysisQueueInstance = new Queue(queueName, { connection: redisClient as any });

  const worker = new Worker(
    queueName,
    async (job) => {
      const { username, profileStats, repos, userId } = job.data;
      try {
        const aiResult = await analyzeWithGemini(profileStats, repos);
        
        if (aiResult.error) {
          throw new Error(aiResult.error);
        }

        await AnalysisReport.findOneAndUpdate(
          { githubUsername: username },
          {
            userId,
            githubUsername: username,
            score: aiResult.score,
            skillLevel: aiResult.skillLevel,
            strengths: aiResult.strengths,
            improvements: aiResult.improvements,
            tips: aiResult.tips,
            status: 'completed',
            createdAt: new Date(),
          },
          { upsert: true }
        );
        console.log(` Job completed for ${username}`);
      } catch (error) {
        console.error(`Job failed for ${username}`, error);
        await AnalysisReport.findOneAndUpdate(
          { githubUsername: username },
          { status: 'failed' },
          { upsert: true }
        );
      }
    },
    { connection: redisClient as any }
  );

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed: ${err.message}`);
  });
} else {
  console.warn('  UPSTASH_REDIS_URL not set — queue disabled. Gemini analysis will run inline.');
}


export const enqueueAnalysis = async (data: {
  username: string;
  profileStats: any;
  repos: any[];
  userId?: string;
}) => {
  if (analysisQueueInstance) {
    await analysisQueueInstance.add('analyze', data);
  } else {

    setImmediate(async () => {
      try {
        const aiResult = await analyzeWithGemini(data.profileStats, data.repos);
        
        if (aiResult.error) {
           throw new Error(aiResult.error);
        }

        await AnalysisReport.findOneAndUpdate(
          { githubUsername: data.username },
          {
            userId: data.userId,
            githubUsername: data.username,
            score: aiResult.score,
            skillLevel: aiResult.skillLevel,
            strengths: aiResult.strengths,
            improvements: aiResult.improvements,
            tips: aiResult.tips,
            status: 'completed',
            createdAt: new Date(),
          },
          { upsert: true }
        );
        console.log(`Inline analysis completed for ${data.username}`);
      } catch (error) {
        console.error(` Inline analysis failed for ${data.username}`, error);
        await AnalysisReport.findOneAndUpdate(
          { githubUsername: data.username },
          { status: 'failed' },
          { upsert: true }
        );
      }
    });
  }
};
