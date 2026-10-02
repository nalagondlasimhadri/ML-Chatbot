# ML Chatbot for Intelligent Conversational Support

A modern full-stack machine learning chatbot project built with Python, Flask, and React. This application demonstrates how to train a lightweight NLP model for intent classification, expose it through a REST API, and deliver a responsive conversational UI in the browser.

This repository is designed as a practical learning project and can be extended for customer support, helpdesk workflows, or hospital/service desk assistant scenarios.

## Table of Contents

- [Overview](#overview)
- [Why this project matters](#why-this-project-matters)
- [Features](#features)
- [Architecture](#architecture)
- [Technology stack](#technology-stack)
- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Training the ML model](#training-the-ml-model)
- [Running the application](#running-the-application)
- [API documentation](#api-documentation)
- [How the chatbot works](#how-the-chatbot-works)
- [Model details](#model-details)
- [Customization guide](#customization-guide)
- [Troubleshooting](#troubleshooting)
- [Future enhancements](#future-enhancements)
- [License](#license)

## Overview

The project combines:

- a Python-based ML backend for natural language understanding,
- a Flask REST API for serving chatbot responses,
- a React frontend for an interactive chat interface,
- a simple intent-based training dataset stored in JSON.

Users type a message in the UI, the backend cleans and tokenizes the text, transforms it into a numeric representation using TF-IDF, predicts the intent using a trained Logistic Regression model, and returns the most relevant response.

This repository is especially useful for understanding the full lifecycle of an ML chatbot:

1. data collection and intent definition,
2. text preprocessing and normalization,
3. model training and evaluation,
4. API deployment,
5. frontend integration.

## Why this project matters

This project is a strong foundation for learning and prototyping AI-powered assistants in real-world environments such as:

- hospital front-desk assistance,
- clinic inquiry bots,
- customer support chatbots,
- internal knowledge assistants,
- onboarding and FAQ bots.

It is intentionally lightweight, easy to understand, and production-friendly enough to extend with more advanced NLP systems such as transformers, semantic search, or conversation memory.

## Features

- Natural language understanding using tokenization and lemmatization
- Intent classification with TF-IDF vectorization and Logistic Regression
- Randomized responses for each matched intent
- REST API endpoint for chatbot interaction
- Responsive chat interface in React
- Lightweight local deployment with minimal setup
- Easy dataset expansion for additional intents
- Clean separation between frontend, backend, and ML training logic

## Architecture

The system is structured as a classic client-server AI application.

```text
+-------------------+      HTTP JSON      +-------------------+
| React Frontend    | ------------------> | Flask Backend     |
| (Vite + React)    |                     | (Python + Flask) |
+-------------------+                     +-------------------+
                                                 |
                                                 v
                                      +-------------------+
                                      | NLP + ML Layer    |
                                      | - Tokenization    |
                                      | - Lemmatization   |
                                      | - TF-IDF          |
                                      | - LogisticReg     |
                                      +-------------------+
                                                 |
                                                 v
                                      +-------------------+
                                      | intents.json      |
                                      | chatbot_model.pkl |
                                      | vectorizer.pkl    |
                                      +-------------------+
```

## Technology stack

### Frontend

- React 19
- Vite
- JavaScript / JSX
- Lucide React icons
- CSS for UI styling

### Backend

- Python 3
- Flask
- Flask-CORS
- NLTK
- scikit-learn

### ML pipeline

- Tokenization
- Word normalization via lemmatization
- TF-IDF feature extraction
- Logistic Regression classifier
- Model serialization using pickle

## Project structure

```text
ML-Chatbot/
├── backend/
│   ├── app.py
│   ├── intents.json
│   ├── train.py
│   ├── chatbot_model.pkl
│   ├── vectorizer.pkl
│   └── __pycache__/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── index.html
│   └── README.md
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Prerequisites

Before getting started, ensure you have the following installed:

- Python 3.9+
- Node.js 18+
- npm
- Git

Optional but recommended:

- a virtual environment tool such as `venv` or `conda`
- VS Code with Python and JavaScript support

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ML-Chatbot.git
cd ML-Chatbot
```

### 2. Set up the backend environment

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment:

- Windows:

```bash
.venv\Scripts\activate
```

- macOS / Linux:

```bash
source .venv/bin/activate
```

Install backend dependencies:

```bash
pip install flask flask-cors nltk scikit-learn
```

If required, download the NLTK data manually:

```bash
python -c "import nltk; nltk.download('punkt'); nltk.download('punkt_tab'); nltk.download('wordnet')"
```

### 3. Set up the frontend

From the project root:

```bash
cd frontend
npm install
```

## Training the ML model

The project includes a training script that builds the intent classification model and saves the artifacts used by the backend.

```bash
cd backend
python train.py
```

This script:

- loads the intent dataset from `intents.json`,
- preprocesses the patterns,
- converts them into TF-IDF vectors,
- trains a Logistic Regression model,
- evaluates model accuracy,
- saves the model and vectorizer as:
  - `chatbot_model.pkl`
  - `vectorizer.pkl`

If you modify the training intent dataset, rerun this command before starting the API server.

## Running the application

### Start the backend

From the `backend` directory:

```bash
python app.py
```

The Flask server will run on:

```text
http://localhost:5000
```

### Start the frontend

Open a new terminal and run:

```bash
cd frontend
npm run dev
```

The Vite app will typically run on:

```text
http://localhost:5173
```

## API documentation

### Health check

**Endpoint**: `GET /`

**Response**:

```json
{
  "status": "success",
  "message": "ML Chatbot Backend is running! 🤖"
}
```

### Chat endpoint

**Endpoint**: `POST /api/chat`

**Request body**:

```json
{
  "message": "What can you do?"
}
```

**Successful response**:

```json
{
  "status": "success",
  "user_message": "What can you do?",
  "intent": "help",
  "response": "I can answer questions, understand simple conversations and respond using NLP. 🤖"
}
```

**Invalid request response**:

```json
{
  "status": "error",
  "message": "Please enter a message."
}
```

## How the chatbot works

The core flow is as follows:

1. A user enters a message in the frontend.
2. The frontend sends the message to the Flask API as JSON.
3. The backend receives the request and reads `message` from the request body.
4. The message is normalized:
   - lowercased,
   - tokenized,
   - filtered to alphanumeric tokens,
   - lemmatized.
5. The cleaned text is turned into a TF-IDF vector using the saved vectorizer.
6. The model predicts the most likely intent tag.
7. The backend matches the predicted tag against `intents.json` and selects a random response.
8. The response is returned to the frontend and displayed in the chat window.

## Model details

The model uses a lightweight and interpretable machine learning approach:

- `TfidfVectorizer`: converts text to numerical features based on term frequency and inverse document frequency.
- `LogisticRegression`: learns classification boundaries between intents.

This approach is ideal for a smaller intent-based chatbot where the number of intents is limited and explainability matters.

### Why this is a good beginner-friendly model

- simple to understand,
- low computational cost,
- easy to retrain as the dataset grows,
- fast enough for local and demo deployments,
- suitable for educational and prototype environments.

## Customization guide

### Add new intents

Edit [backend/intents.json](./backend/intents.json) and add a new object like:

```json
{
  "tag": "appointment",
  "patterns": [
    "book an appointment",
    "schedule a visit",
    "I need to meet a doctor"
  ],
  "responses": [
    "You can schedule an appointment through the hospital desk.",
    "I can help guide you to the appointment process."
  ]
}
```

After that, retrain the model:

```bash
cd backend
python train.py
```

### Improve the chatbot

Possible upgrades include:

- more intents and realistic conversational flows,
- user session memory,
- contextual conversation history,
- better entity extraction,
- integration with a database or CRM,
- deployment to Azure or cloud hosting,
- production-grade authentication and monitoring,
- advanced NLP models such as BERT or sentence-transformers.

## Troubleshooting

### Issue: `ModuleNotFoundError` for `flask` or `nltk`

Install dependencies in the virtual environment:

```bash
pip install flask flask-cors nltk scikit-learn
```

### Issue: NLTK data not found

Run:

```bash
python -c "import nltk; nltk.download('punkt'); nltk.download('punkt_tab'); nltk.download('wordnet')"
```

### Issue: model files not found

Ensure the model was trained and the files exist in the backend directory:

```bash
cd backend
ls
```

You should see:

- `chatbot_model.pkl`
- `vectorizer.pkl`
- `intents.json`

### Issue: frontend cannot connect to backend

Check the backend is running and the frontend is calling the correct URL:

```text
http://localhost:5000/api/chat
```

Also verify that CORS is enabled in the backend using Flask-CORS.

## Future enhancements

This project can be evolved into a more robust real-world chatbot through:

- multilingual support,
- conversation memory and context tracking,
- sentiment analysis,
- smarter retrieval systems,
- database-backed user history,
- admin dashboard for training and analytics,
- embedding-based semantic matching,
- deployment to cloud containers and Kubernetes,
- integration with hospital/service management systems.

## License

This project is provided for educational and demonstration purposes. You can use, modify, and extend it according to your project needs.

## Summary

This repository demonstrates a full machine learning chatbot workflow from model training to browser-based user interaction. It is practical, beginner-friendly, and extensible, making it an excellent base for learning AI chat systems and building more advanced conversational experiences.

If you want, I can also generate:

- a more polished GitHub-ready README with badges and screenshots,
- a production-grade README for a hospital management chatbot variant,
- a README tailored specifically for a portfolio project or academic submission.
