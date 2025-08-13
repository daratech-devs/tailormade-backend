import OpenAI from 'openai';
import { config } from 'dotenv';
config(); 

export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async generateTailoredSummary(resumeContent: string, jobDescription: string): Promise<string> {
    try {
      const prompt = `
You are an expert resume writer and career coach. Your task is to create a tailored professional summary based on the provided resume content and job description.

RESUME CONTENT:
${resumeContent}

JOB DESCRIPTION:
${jobDescription}

CRITICAL INSTRUCTIONS:
- DO NOT include any placeholders like [Your Name], [Your Phone Number], [Your Email], [Your Address], etc.
- DO NOT include contact information, personal details, or placeholder text
- Use ONLY information that can be directly inferred from the provided resume content
- If specific details cannot be inferred, omit them entirely rather than using placeholders
- Focus on skills, experience, achievements, and qualifications mentioned in the resume

Instructions:
1. Analyze the job requirements and key skills mentioned in the job description
2. Identify relevant experience, skills, and achievements from the resume that match the job requirements
3. Create a compelling 3-4 sentence professional summary that:
   - Highlights the most relevant experience and skills for this specific role
   - Uses keywords from the job description naturally
   - Quantifies achievements where possible
   - Shows clear value proposition for the employer
   - Maintains a professional, confident tone
   - Contains NO placeholders or contact information

Write ONLY the tailored professional summary, nothing else.
`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume writer who creates compelling, tailored professional summaries that help job seekers stand out to employers.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      const summary = completion.choices[0]?.message?.content?.trim();
      
      if (!summary) {
        throw new Error('Failed to generate tailored summary');
      }

      return summary;
    } catch (error) {
      console.error('Error generating tailored summary:', error);
      throw new Error('Failed to generate tailored summary');
    }
  }

  async generateCoverLetter(resumeContent: string, jobDescription: string): Promise<string> {
    try {
      const prompt = `
You are an expert career coach and cover letter writer. Your task is to create a personalized, compelling cover letter based on the provided resume content and job description.

RESUME CONTENT:
${resumeContent}

JOB DESCRIPTION:
${jobDescription}

CRITICAL INSTRUCTIONS:
- DO NOT include any placeholders like [Your Name], [Your Phone Number], [Your Email], [Your Address], [Date], [Company Address], etc.
- DO NOT include contact information, addresses, or placeholder text
- Use ONLY information that can be directly inferred from the provided resume content and job description
- If specific details like company name, hiring manager name, or personal contact info cannot be inferred, use generic but professional alternatives
- Start with "Dear Hiring Manager" if no specific contact is mentioned
- End with "Sincerely," followed by a line break (no name placeholder)
- Focus on experience, skills, and achievements from the resume

Instructions:
1. Analyze the job requirements, company culture, and key qualifications mentioned
2. Identify the most relevant experience, skills, and achievements from the resume
3. Create a professional cover letter that:
   - Opens with enthusiasm for the specific role and company
   - Highlights 2-3 most relevant experiences/achievements that match job requirements
   - Uses specific examples with quantifiable results where possible
   - Shows understanding of the company's needs and how you can address them
   - Closes with a strong call to action
   - Maintains a professional yet personable tone
   - Is concise (3-4 paragraphs)
   - Contains NO placeholders or contact information

Format the cover letter properly with:
- Professional greeting (use "Dear Hiring Manager")
- 3-4 well-structured paragraphs
- Professional closing with "Sincerely," (no name)

Write ONLY the cover letter content, nothing else.
`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert career coach who writes compelling, personalized cover letters that help job seekers get interviews.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 600,
        temperature: 0.7,
      });

      const coverLetter = completion.choices[0]?.message?.content?.trim();
      
      if (!coverLetter) {
        throw new Error('Failed to generate cover letter');
      }

      return coverLetter;
    } catch (error) {
      console.error('Error generating cover letter:', error);
      throw new Error('Failed to generate cover letter');
    }
  }

  async generateBothContent(resumeContent: string, jobDescription: string): Promise<{
    tailoredSummary: string;
    coverLetter: string;
  }> {
    try {
      // Generate both pieces of content in parallel for better performance
      const [tailoredSummary, coverLetter] = await Promise.all([
        this.generateTailoredSummary(resumeContent, jobDescription),
        this.generateCoverLetter(resumeContent, jobDescription)
      ]);

      return {
        tailoredSummary,
        coverLetter
      };
    } catch (error) {
      console.error('Error generating content:', error);
      throw new Error('Failed to generate tailored content');
    }
  }
}