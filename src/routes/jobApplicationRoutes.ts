import { Router } from 'express';
import { JobApplicationController } from '../controllers/jobApplicationController';

const router = Router();
const jobApplicationController = new JobApplicationController();

// POST /api/job-applications - Create a new job application
router.post('/', jobApplicationController.createJobApplication.bind(jobApplicationController));

// POST /api/job-applications/generate - Generate content immediately
router.post('/generate', jobApplicationController.generateContent.bind(jobApplicationController));

// GET /api/job-applications/:id/status - Get job application status
router.get('/:id/status', jobApplicationController.getJobApplicationStatus.bind(jobApplicationController));

// GET /api/job-applications/:id - Get a specific job application
router.get('/:id', jobApplicationController.getJobApplication.bind(jobApplicationController));

// GET /api/job-applications - Get all job applications (with pagination)
router.get('/', jobApplicationController.getAllJobApplications.bind(jobApplicationController));

// DELETE /api/job-applications/:id - Delete a job application
router.delete('/:id', jobApplicationController.deleteJobApplication.bind(jobApplicationController));

export default router;