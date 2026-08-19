# Learn Your Way

> You don't have to learn it their way. Learn it your way.

**Learn Your Way** is an AI-powered learning tool built for the **Suvidha AI Hackathon 2026**.

It is designed for learners who may understand a concept but struggle when the information is presented in a format that does not work for them.

## The problem

Sometimes the concept isn't the problem — **the way it is explained is**.

A dense textbook explanation may not click for one learner, while the same concept can become understandable when presented using simpler language, a familiar analogy, a visual explanation, or a step-by-step breakdown.

Traditional learning often gives the learner one explanation and expects them to adapt to it.

Learn Your Way takes the opposite approach:

> **Instead of making the learner adapt to the explanation, change the explanation.**

## The solution

Learn Your Way lets learners explore the same concept through different explanation styles:

- **Simple** — plain language with less jargon
- **Analogy** — connects the concept to a familiar real-world idea
- **Visual** — explains using visual or structured representations
- **Step-by-step** — breaks the concept into sequential steps

If one explanation does not click, the learner can try another style.

The goal is not to give more information.

**The goal is to find a way of presenting the information that works for the learner.**

## Features

- AI-powered concept explanations
- Multiple explanation styles
- Switch explanation styles during a learning session
- PDF upload and text extraction
- Image upload and AI-powered image understanding
- Image text extraction and visual description
- Learning workspace for working with uploaded material
- Text-to-speech using the browser's Web Speech API
- Server-side AI API integration
- Deployed on Vercel

## How it works

```text
                    Learning material
                          │
              ┌───────────┴───────────┐
              │                       │
            Text                PDF / Image
              │                       │
              └───────────┬───────────┘
                          ↓
                 Learn Your Way
                          ↓
                    AI processing
                          ↓
        ┌─────────┬─────────┬─────────┐
        ↓         ↓         ↓         ↓
      Simple   Analogy    Visual   Step-by-step
        │         │         │         │
        └─────────┴─────────┴─────────┘
                          ↓
                 Learner chooses
              what works best for them
```

### Uploaded PDFs

PDF files are processed by the Python backend using `pypdf` to extract their text.

### Uploaded images

Images are processed using `Pillow` and sent to the configured vision model for text extraction and description of important visual information.

## Technology

### Frontend

- HTML
- CSS
- JavaScript

### Backend

- Python
- Flask
- Vercel

### AI

- NVIDIA API
  - Text model: `nvidia/nemotron-3-ultra-550b-a55b`
  - Vision model: `meta/llama-3.2-11b-vision-instruct`

### File processing

- `pypdf` — PDF text extraction
- `Pillow` — image processing

### Browser features

- Web Speech API — browser-based text-to-speech

## Architecture

The project uses a lightweight frontend with a Python/Flask backend deployed through Vercel.

```text
Browser
   │
   ├── Frontend
   │
   ├── /api/chat
   │       ↓
   │   Flask backend
   │       ↓
   │   NVIDIA API
   │
   └── /api/upload
           ↓
       Flask backend
           ├── PDF → pypdf
           └── Image → Pillow → Vision model
```

## API endpoints

### Health check

```
GET /api/health
```

Returns the service status.

### AI chat

```
POST /api/chat
```

Accepts a `messages` array and returns an AI-generated response.

Example:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Explain photosynthesis simply."
    }
  ]
}
```

### File upload

```
POST /api/upload
```

Accepts supported PDF and image files.

- For PDFs, the endpoint extracts text.
- For images, the endpoint processes the image using the configured vision model.

## Environment variables

The application uses server-side environment variables for API credentials.

Required variables:

```
TEXT_API_KEY
VISION_API_KEY
```

API keys are not stored in the repository.

For local development, pull the development environment variables using:

```bash
vercel env pull .env.local
```

The `.env.local` file is ignored by Git and must never be committed.

For production, the variables are configured through the Vercel project's environment-variable settings.

## Running locally

Clone the repository:

```bash
git clone https://github.com/devrohit2007/learn-your-way.git
cd learn-your-way
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Pull the development environment variables:

```bash
vercel env pull .env.local
```

Start the Vercel development environment:

```bash
vercel dev
```

The application will be available at:

```
http://localhost:3000
```

## Live demo

[Learn Your Way](https://learn-your-way-one.vercel.app)

## Project repository

[GitHub](https://github.com/devrohit2007/learn-your-way)

## AI disclosure

The following AI tools/models were used in the project:

- **NVIDIA API** — provides the AI inference used by the application.
- **nvidia/nemotron-3-ultra-550b-a55b** — used for text-based explanations and other text-generation tasks inside the application.
- **meta/llama-3.2-11b-vision-instruct** — used for understanding uploaded images, including text extraction and visual description.
- **Claude (Anthropic)** — used as a coding assistant during development.

The application sends AI requests through server-side API endpoints. API credentials are kept in environment variables and are not committed to the repository.

## Current status

The current prototype supports:

- AI-generated explanations
- Multiple explanation styles
- Text input
- PDF processing
- Image processing
- Vision-based image understanding
- Text-to-speech through the browser
- Vercel deployment

The project is a hackathon prototype and may require further optimization for larger-scale production usage.

## Built for

Suvidha AI Hackathon 2026

## Built by

rohitdev
