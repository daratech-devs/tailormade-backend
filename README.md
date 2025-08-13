# TailorMade Backend API

A TypeScript-based backend API for the TailorMade AI Job Search application, built with Node.js, Express, and MongoDB.

## Features

- **TypeScript**: Full type safety and modern JavaScript features
- **Express.js**: Fast, unopinionated web framework
- **MongoDB**: Document-based database with Mongoose ODM
- **CORS**: Cross-origin resource sharing support
- **Error Handling**: Comprehensive error handling middleware
- **Environment Configuration**: Secure environment variable management

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # Database configuration
│   ├── controllers/
│   │   └── jobApplicationController.ts  # Business logic
│   ├── middleware/
│   │   └── errorHandler.ts      # Error handling middleware
│   ├── models/
│   │   └── jobApplicationModel.ts       # Mongoose schemas
│   ├── routes/
│   │   └── jobApplicationRoutes.ts      # API routes
│   ├── types/
│   │   └── jobApplication.ts    # TypeScript interfaces
│   └── server.ts                # Application entry point
├── dist/                        # Compiled JavaScript (generated)
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone and navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/tailormade
   JWT_SECRET=your-super-secret-jwt-key-here
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB:**
   - For local MongoDB: `mongod`
   - For MongoDB Atlas: Use your connection string in `MONGO_URI`

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Job Applications

- **POST** `/api/job-applications` - Create a new job application
- **GET** `/api/job-applications/:id` - Get a specific job application
- **GET** `/api/job-applications` - Get all job applications (paginated)
- **DELETE** `/api/job-applications/:id` - Delete a job application

### Health Check

- **GET** `/api/health` - Check API status

## API Usage Examples

### Create Job Application

```bash
curl -X POST http://localhost:5000/api/job-applications \
  -H "Content-Type: application/json" \
  -d '{
    "resumeContent": "Your resume content here...",
    "jobDescription": "Job description here...",
    "originalFileName": "resume.pdf"
  }'
```

### Get Job Application

```bash
curl http://localhost:5000/api/job-applications/[job-id]
```

## Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run clean` - Remove compiled files

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/tailormade` |
| `JWT_SECRET` | JWT signing secret | Required for auth |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

## Error Handling

The API includes comprehensive error handling for:
- Validation errors
- Database connection issues
- Invalid ObjectIds
- Duplicate entries
- Server errors

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Real LLM integration (OpenAI, Claude, etc.)
- [ ] File upload handling for resumes
- [ ] Rate limiting
- [ ] API documentation with Swagger
- [ ] Unit and integration tests
- [ ] Logging with Winston
- [ ] Docker containerization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.