# AI Realtime Chatbot

A full-stack MERN application featuring real-time communication via Socket.io and AI capabilities using Google Gemini. This application focuses on a seamless, text-only chat experience.

## Features

- **Real-time Messaging**: Instant text communication using Socket.io.
- **AI Chatbot**: Intelligent conversations powered by Google Gemini AI.
- **User Authentication**: Secure signup and login with JWT (JSON Web Tokens).
- **Text-only Chat**: streamlined interface focused on text interaction.
- **Responsive Design**: Modern UI built with Tailwind CSS.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-time**: Socket.io
- **AI Integration**: Google Gemini API

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- Google Gemini API Key

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository_url>
cd ai-chatbot
```

### 2. Backend Setup

 Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=mongodb://localhost:27017/ai-chatbot  # Or your MongoDB Atlas URI

# Security
JWT_SECRET=your_super_secret_jwt_key_here

# AI Service
GEMINI_API_KEY=your_google_gemini_api_key_here
```

Start the backend server:

```bash
npm run dev
# or
node server.js
```

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000

# Socket Configuration
VITE_SOCKET_URL=http://localhost:5000
```

Start the frontend development server:

```bash
npm run dev
```

### 4. Running the App

- The backend will run on `http://localhost:5000` (default).
- The frontend will run on `http://localhost:5173` (default Vite port).
- Open your browser and navigate to `http://localhost:5173` to start chatting!

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.
