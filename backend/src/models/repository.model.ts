import mongoose, { Schema, Document } from 'mongoose';

export interface IRepository extends Document {
  name: string;
  language: string;
  commits: number;
  stargazers_count: number;
  forks_count: number;
  hasReadme: boolean;
  owner: string;
  fork: boolean;
  updated_at: string;
  html_url: string;
  description: string;
}

const RepositorySchema: Schema = new Schema({
  name: { type: String, required: true },
  language: { type: String },
  commits: { type: Number, default: 0 },
  stargazers_count: { type: Number, default: 0 },
  forks_count: { type: Number, default: 0 },
  hasReadme: { type: Boolean, default: false },
  owner: { type: String, required: true, index: true },
  fork: { type: Boolean, default: false },
  updated_at: { type: String },
  html_url: { type: String },
  description: { type: String },
});

export default mongoose.model<IRepository>('Repository', RepositorySchema);
