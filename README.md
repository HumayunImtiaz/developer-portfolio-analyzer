# AI Resume Tailor & Profile Analyzer

A full-stack modern application designed to intelligently tailor resumes using AI (Google Gemini / OpenAI), optimizing them for specific job descriptions and Applicant Tracking Systems (ATS).

## 🌟 Features

- **AI-Powered Resume Tailoring:** Leverages Gemini/OpenAI to deeply align your existing resume with specific job requirements and skill sets.
- **ATS Evaluation System:** Provides detailed Before/After ATS scoring, identifying key missing keywords and suggesting actionable improvements.
- **Seamless Document Parsing:** Extracts content directly from uploaded PDF (`pdf-parse`) and DOCX (`mammoth`) files.
- **Pixel-Perfect Export:** Generate and download your tailored resume in professionally formatted PDF or DOCX formats.
- **Responsive Dashboard:** A beautiful, highly responsive frontend built with React, Vite, and Tailwind CSS.
- **Background Processing:** Ensures seamless user experiences with asynchronous background task processing handled by BullMQ and Redis.
- **Secure Authentication:** Complete JWT-based authentication flow with protected routes and password hashing.

## 💻 Tech Stack

### Frontend
- **Framework:** React 19 (via Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v4)
- **Routing:** React Router DOM (v7)
- **State/Form Management:** React Hook Form + Zod for validation
- **Data Visualization:** Recharts

### Backend
- **Framework:** Node.js with Express.js
- **Language:** TypeScript
- **Database:** MongoDB (via Mongoose)
- **Queue/Cache:** Redis + BullMQ
- **Generative AI Integrations:** `@google/generative-ai`, `openai`
- **Security:** Helmet, Express Rate Limit, bcryptjs, jsonwebtoken

## 📁 Project Structure

```text
├── backend/          # Express API server
│   ├── src/          # Source code (routes, controllers, models, services)
│   ├── package.json  # Backend dependencies
│   └── .env          # Backend environment variables (to be created)
└── frontend/         # React application
    ├── src/          # UI components, pages, hooks, utils
    ├── package.json  # Frontend dependencies
    └── vite.config.ts
```

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)
- [Redis](https://redis.io/) (Required for background task queues via BullMQ)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd "Github Profile Analysis"
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   ```
   *Create a `.env` file in the `backend/` directory with your specific configuration keys:*
   ```env
   # Example backend/.env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/resume-tailor
   JWT_SECRET=your_jwt_secret_key
   REDIS_URL=redis://localhost:6379
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

3. **Setup the Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application (Development)

You will need to start both the backend and frontend servers. Open two terminal instances:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The frontend will typically be accessible at `http://localhost:5173` and will communicate with the backend running on `http://localhost:5000` (or whichever port you specified).

## 📄 License
This project is open-source and available under the MIT License.
