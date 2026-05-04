import mongoose, { Schema, Document } from 'mongoose';

export interface IGithubProfile extends Document {
  username: string;
  avatarUrl: string;
  bio: string;
  location: string;
  repoList: mongoose.Types.ObjectId[];
  stats: {
    totalStars: number;
    totalForks: number;
    reposWithReadme: number;
    languageMap: Record<string, number>;
  };
  fetchedAt: Date;
}

const GithubProfileSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true, index: true },
  avatarUrl: { type: String },
  bio: { type: String },
  location: { type: String },
  repoList: [{ type: Schema.Types.ObjectId, ref: 'Repository' }],
  stats: {
    totalStars: { type: Number, default: 0 },
    totalForks: { type: Number, default: 0 },
    reposWithReadme: { type: Number, default: 0 },
    languageMap: { type: Map, of: Number, default: {} }
  },
  fetchedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IGithubProfile>('GithubProfile', GithubProfileSchema);
