# 🏋️ FitTrack – AI Powered Fitness Tracker

FitTrack is a **full-stack AI-powered fitness tracking application** built using **React, Strapi, and Tailwind CSS**.

The application helps users **set fitness goals, track calories, log workouts, and analyze food images using Google Gemini AI to estimate calorie intake automatically.**

This project demonstrates a **real-world full stack architecture with AI integration.**

---

# 🌐 Live Application

Frontend  
https://fitness-tracker-three-rosy.vercel.app/

Backend API  
https://timely-passion-8556e12d20.strapiapp.com/

GitHub Repository  
https://github.com/Varun30501/Fitness-Tracker

---

# 🚀 Features

- User authentication (Sign up / Login)
- Profile onboarding and fitness goal setup
- Track food intake (calories consumed)
- Track physical activities (calories burned)
- AI-powered food recognition using images
- Automatic calorie estimation using Gemini AI
- Daily calorie tracking dashboard
- Activity tracking and summaries
- Dark / Light theme support
- Responsive UI design
- Online deployment

---

# 🛠 Tech Stack

## Frontend
- React
- Vite
- TypeScript
- Tailwind CSS

## Backend
- Strapi Headless CMS

## Database
- SQLite

## AI Integration
- Google Gemini API

## Authentication
- JWT Authentication

## Deployment
- Frontend → Vercel
- Backend → Strapi Cloud

---

# 📦 Project Structure
Fitness-Tracker
│
├── Frontend
│ ├── src
│ ├── components
│ ├── pages
│ ├── context
│ └── configs
│
└── Server
├── src
├── api
└── services

VITE_STRAPI_API_URL=https://timely-passion-8556e12d20.strapiapp.com


---

# 🧑‍💻 Installation Guide

## 1️⃣ Clone the Repository


git clone https://github.com/Varun30501/Fitness-Tracker.git

cd Fitness-Tracker


---

## 2️⃣ Install Frontend


cd Frontend
npm install
npm run dev


---

## 3️⃣ Install Backend


cd Server
npm install
npm run develop


---

# 🤖 AI Food Image Analysis

Users can upload food images and the system will:

1. Upload image to backend
2. Convert image to Base64
3. Send it to Google Gemini AI
4. Extract:

- Food name
- Estimated calories

The detected food and calories are automatically added to the **food log**.

---

# 📊 Dashboard Analytics

The dashboard shows:

- Calories consumed
- Calories burned
- Daily calorie targets
- Active minutes
- Number of meals logged
- BMI calculation
- User fitness goals

---

# 🎯 What This Project Demonstrates

- Full stack React application
- Headless CMS integration
- AI integration into web apps
- Authentication and protected APIs
- Real world UI design with Tailwind CSS
- Cloud deployment workflow

---

# 👨‍💻 Author

**Varun**

GitHub  
https://github.com/Varun30501

---

# ⭐ If you like this project

Give the repository a ⭐ on GitHub.