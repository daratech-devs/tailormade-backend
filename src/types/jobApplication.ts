import { Document } from 'mongoose';

export interface IJobApplication extends Document {
  _id: string;
  resumeContent: string;
  jobDescription: string;
  tailoredSummary?: string;
  coverLetter?: string;
  originalFileName?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateJobApplicationRequest {
  resumeContent: string;
  jobDescription: string;
  originalFileName?: string;
}

export interface JobApplicationResponse {
  success: boolean;
  data?: IJobApplication;
  message?: string;
  error?: string;
}