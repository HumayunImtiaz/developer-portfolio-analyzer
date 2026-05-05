import { Queue, Worker, QueueEvents } from 'bullmq';
import { redisClient } from '../config/redis';
import { analyzeResumeWithGemini } from './resume.service';
import ResumeAnalysis from '../models/resumeAnalysis.model';
import { ResumeAnalysisJobData } from '../types';

const queueName = 'resume-analysis-queue';
const redisUrl = process.env.UPSTASH_REDIS_URL;

let resumeQueueInstance: Queue | null = null;
let resumeQueueEvents: QueueEvents | null = null;

if (redisUrl) {
  resumeQueueInstance = new Queue(queueName, { connection: redisClient as any });
  resumeQueueEvents = new QueueEvents(queueName, { connection: redisClient as any });

  const worker = new Worker(
    queueName,
    async (job) => {
      const { userId, fileName, extractedText, jobDescription } = job.data as ResumeAnalysisJobData;
      
      try {
        const aiResult = await analyzeResumeWithGemini(extractedText, jobDescription);
        
        const newAnalysis = new ResumeAnalysis({
          userId,
          fileName,
          atsScore: aiResult.atsScore,
          strengths: aiResult.strengths,
          improvements: aiResult.improvements,
          tips: aiResult.tips,
          jobDescription,
        });

        await newAnalysis.save();
        
        return {
          atsScore: aiResult.atsScore,
          strengths: aiResult.strengths,
          improvements: aiResult.improvements,
          tips: aiResult.tips,
        };
      } catch (error: any) {
        throw new Error(error.message || 'AI analysis failed, please try again');
      }
    },
    { connection: redisClient as any }
  );

  worker.on('failed', (job, err) => {
    console.error(`Resume Job ${job?.id} failed: ${err.message}`);
  });
} else {
  console.warn('UPSTASH_REDIS_URL not set — resume queue disabled. Resume analysis will run inline.');
}

export const enqueueResumeAnalysis = async (data: ResumeAnalysisJobData) => {
  if (resumeQueueInstance && resumeQueueEvents) {
    const job = await resumeQueueInstance.add('analyze-resume', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 15000 }, // Wait 15s, then 30s before retrying
    });
    const result = await job.waitUntilFinished(resumeQueueEvents);
    return result;
  } else {
    // Fallback to inline
    const aiResult = await analyzeResumeWithGemini(data.extractedText, data.jobDescription);
    const newAnalysis = new ResumeAnalysis({
      userId: data.userId,
      fileName: data.fileName,
      atsScore: aiResult.atsScore,
      strengths: aiResult.strengths,
      improvements: aiResult.improvements,
      tips: aiResult.tips,
      jobDescription: data.jobDescription,
    });
    await newAnalysis.save();
    return {
      atsScore: aiResult.atsScore,
      strengths: aiResult.strengths,
      improvements: aiResult.improvements,
      tips: aiResult.tips,
    };
  }
};
