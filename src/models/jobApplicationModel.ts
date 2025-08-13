import mongoose, { Schema } from 'mongoose';
import { IJobApplication } from '../types/jobApplication';

const jobApplicationSchema = new Schema<IJobApplication>(
  {
    resumeContent: {
      type: String,
      required: [true, 'Resume content is required'],
      trim: true,
      maxlength: [50000, 'Resume content cannot exceed 50,000 characters']
    },
    jobDescription: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
      maxlength: [10000, 'Job description cannot exceed 10,000 characters']
    },
    tailoredSummary: {
      type: String,
      trim: true,
      maxlength: [2000, 'Tailored summary cannot exceed 2,000 characters']
    },
    coverLetter: {
      type: String,
      trim: true,
      maxlength: [5000, 'Cover letter cannot exceed 5,000 characters']
    },
    originalFileName: {
      type: String,
      trim: true,
      maxlength: [255, 'File name cannot exceed 255 characters']
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Indexes for better query performance
jobApplicationSchema.index({ createdAt: -1 });
jobApplicationSchema.index({ status: 1 });

export const JobApplication = mongoose.model<IJobApplication>('JobApplication', jobApplicationSchema);