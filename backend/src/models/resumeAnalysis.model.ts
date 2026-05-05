import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IResumeAnalysis extends Document {
  userId: Types.ObjectId;
  fileName: string;
  atsScore: number;
  strengths: string[];
  improvements: string[];
  tips: string[];
  jobDescription?: string;
  createdAt: Date;
}

const resumeAnalysisSchema = new Schema<IResumeAnalysis>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  atsScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  strengths: {
    type: [String],
    required: true,
  },
  improvements: {
    type: [String],
    required: true,
  },
  tips: {
    type: [String],
    required: true,
  },
  jobDescription: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IResumeAnalysis>('ResumeAnalysis', resumeAnalysisSchema);
