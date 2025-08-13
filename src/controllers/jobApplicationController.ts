import { Request, Response } from 'express';
import { JobApplication } from '../models/jobApplicationModel';
import { CreateJobApplicationRequest, JobApplicationResponse } from '../types/jobApplication';
import { OpenAIService } from '../services/openaiService';

export class JobApplicationController {
  private openaiService: OpenAIService;

  constructor() {
    this.openaiService = new OpenAIService();
  }

  // Create a new job application
  public async createJobApplication(req: Request<{}, JobApplicationResponse, CreateJobApplicationRequest>, res: Response<JobApplicationResponse>): Promise<void> {
    try {
      const { resumeContent, jobDescription, originalFileName } = req.body;

      // Validation
      if (!resumeContent || !jobDescription) {
        res.status(400).json({
          success: false,
          message: 'Resume content and job description are required'
        });
        return;
      }

      // Create new job application
      const jobApplication = new JobApplication({
        resumeContent,
        jobDescription,
        originalFileName,
        status: 'pending'
      });

      const savedJobApplication = await jobApplication.save();

      // Process with OpenAI in the background
      this.processJobApplicationWithAI(savedJobApplication._id.toString(), resumeContent, jobDescription);

      res.status(201).json({
        success: true,
        data: savedJobApplication,
        message: 'Job application created successfully'
      });
    } catch (error) {
      console.error('Error creating job application:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Private method to process job application with OpenAI
  private async processJobApplicationWithAI(jobApplicationId: string, resumeContent: string, jobDescription: string): Promise<void> {
    try {
      // Update status to processing
      await JobApplication.findByIdAndUpdate(jobApplicationId, {
        status: 'processing'
      });

      // Generate content using OpenAI
      const { tailoredSummary, coverLetter } = await this.openaiService.generateBothContent(
        resumeContent,
        jobDescription
      );

      // Update job application with generated content
      await JobApplication.findByIdAndUpdate(jobApplicationId, {
        tailoredSummary,
        coverLetter,
        status: 'completed'
      });

      console.log(`✅ Successfully processed job application ${jobApplicationId}`);
    } catch (error) {
      console.error(`❌ Error processing job application ${jobApplicationId}:`, error);
      
      // Update status to failed
      await JobApplication.findByIdAndUpdate(jobApplicationId, {
        status: 'failed'
      });
    }
  }

  // Generate content immediately (for real-time requests)
  public async generateContent(req: Request, res: Response): Promise<void> {
    try {
      const { resumeContent, jobDescription } = req.body;

      // Validation
      if (!resumeContent || !jobDescription) {
        res.status(400).json({
          success: false,
          message: 'Resume content and job description are required'
        });
        return;
      }

      // Generate content using OpenAI
      const { tailoredSummary, coverLetter } = await this.openaiService.generateBothContent(
        resumeContent,
        jobDescription
      );

      res.status(200).json({
        success: true,
        data: {
          tailoredSummary,
          coverLetter
        },
        message: 'Content generated successfully'
      });
    } catch (error) {
      console.error('Error generating content:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate content',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get job application status (for polling)
  public async getJobApplicationStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const jobApplication = await JobApplication.findById(id).select('status tailoredSummary coverLetter updatedAt');

      if (!jobApplication) {
        res.status(404).json({
          success: false,
          message: 'Job application not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          status: jobApplication.status,
          tailoredSummary: jobApplication.tailoredSummary,
          coverLetter: jobApplication.coverLetter,
          updatedAt: jobApplication.updatedAt
        }
      });
    } catch (error) {
      console.error('Error fetching job application status:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Legacy method - keeping for backward compatibility but updating to use OpenAI
  public async createJobApplicationLegacy(req: Request<{}, JobApplicationResponse, CreateJobApplicationRequest>, res: Response<JobApplicationResponse>): Promise<void> {
    try {
      const { resumeContent, jobDescription, originalFileName } = req.body;

      // Validation
      if (!resumeContent || !jobDescription) {
        res.status(400).json({
          success: false,
          message: 'Resume content and job description are required'
        });
        return;
      }

      // Create new job application
      const jobApplication = new JobApplication({
        resumeContent,
        jobDescription,
        originalFileName,
        status: 'pending'
      });

      const savedJobApplication = await jobApplication.save();

      // Process with OpenAI (keeping the async pattern for compatibility)
      setTimeout(async () => {
        try {
          const { tailoredSummary, coverLetter } = await this.openaiService.generateBothContent(
            resumeContent,
            jobDescription
          );

          await JobApplication.findByIdAndUpdate(savedJobApplication._id.toString(), {
            tailoredSummary,
            coverLetter,
            status: 'completed'
          });
        } catch (error) {
          await JobApplication.findByIdAndUpdate(savedJobApplication._id.toString(), {
            status: 'failed'
          });
        }
      }, 1000); // Reduced delay since we're using real AI now

      res.status(201).json({
        success: true,
        data: savedJobApplication,
        message: 'Job application created successfully'
      });
    } catch (error) {
      console.error('Error creating job application:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get job application by ID
  public async getJobApplication(req: Request, res: Response<JobApplicationResponse>): Promise<void> {
    try {
      const { id } = req.params;

      const jobApplication = await JobApplication.findById(id);

      if (!jobApplication) {
        res.status(404).json({
          success: false,
          message: 'Job application not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: jobApplication
      });
    } catch (error) {
      console.error('Error fetching job application:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get all job applications (with pagination)
  public async getAllJobApplications(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const jobApplications = await JobApplication.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await JobApplication.countDocuments();

      res.status(200).json({
        success: true,
        data: jobApplications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching job applications:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Delete job application
  public async deleteJobApplication(req: Request, res: Response<JobApplicationResponse>): Promise<void> {
    try {
      const { id } = req.params;

      const deletedJobApplication = await JobApplication.findByIdAndDelete(id);

      if (!deletedJobApplication) {
        res.status(404).json({
          success: false,
          message: 'Job application not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Job application deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting job application:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}