# Multi-Agent Chat Application

A Next.js application that allows you to chat with multiple AI assistants simultaneously. Each assistant has a unique personality and can interact with both you and other assistants.

## Features

- Chat with multiple AI assistants at once
- Each assistant has a unique personality and background
- Real-time responses from all assistants
- Modern, responsive UI
- Easy deployment to Vercel

## Prerequisites

- Node.js 18+ and npm
- OpenAI API key

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This application is designed to be deployed on Vercel:

1. Push your code to a GitHub repository
2. Import the repository in Vercel
3. Add your OpenAI API key in the Vercel environment variables
4. Deploy!

## Customization

You can customize the assistants by modifying the `defaultAssistants` array in `src/app/page.tsx`. Each assistant has:
- A unique ID
- Name
- Avatar emoji
- Personality description
- System prompt for the AI

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- OpenAI API
- Vercel (for deployment)
