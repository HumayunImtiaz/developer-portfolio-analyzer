import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalysisReport extends Document {
  userId?: mongoose.Types.ObjectId;
  githubUsername: string;
  score: number;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  strengths: string[];
  improvements: string[];
  tips: string[];
  createdAt: Date;
  status: 'pending' | 'completed' | 'failed';
}

const AnalysisReportSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  githubUsername: { type: String, required: true, index: true },
  score: { type: Number },
  skillLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  strengths: [{ type: String }],
  improvements: [{ type: String }],
  tips: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' }
});

export default mongoose.model<IAnalysisReport>('AnalysisReport', AnalysisReportSchema);
