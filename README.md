# Aesculai Health App

**An AI-powered clinical assistant that helps healthcare professionals overcome diagnostic complexity, time limitations, and information overload through smart, simulated patient assessment and continuous learning tools.**

---

## 🩺 Overview

Aesculai is a mobile application that combines AI technology with clinical simulation to assist healthcare professionals—such as practicing doctors and medical students—in evaluating symptoms, reviewing drug information, analyzing medical imaging, and engaging in AI-guided clinical reasoning.

This app is strictly for educational and simulated purposes. **It is not designed or authorized for real-world patient care.**

---

## 🚀 Key Features

- **AI-Powered Patient History & Assessment**
  Structured questioning follows standard clinical formats (CC, HPI, PMH, Meds, Allergies, FH, SH, ROS).

- **Role-Based Experience**
  Tailored features for different user types: "Practicing Doctor" or "Medical Student".

- **Drug Lookup by Name & Image**
  Search drugs via text input or image upload, powered by a global database.

- **Medical Image Analysis**
  Upload X-rays, MRIs, or scans to receive AI-powered medical impressions, differential diagnoses, and test recommendations.

- **AI Clinical Chatbot**
  Simulate real-world consultations, medical research, or idea brainstorming in free-form chat mode.

- **Anonymized Reports**
  Option to download assessments as anonymized PDFs for offline study or sharing.

---

## ⚙️ Tech Stack

- **Framework**: Expo (React Native)
- **Authentication**: Supabase Auth (email + password)
- **AI Engine**: Google Gemini API (Gemini 2.0 Flash)
- **Backend Services**: Supabase (DB & Storage)
- **Medical Data APIs**: RapidAPI drug database

---

## 🔐 Authentication

Users sign up using their **email address and password**. Authentication is managed securely via Supabase Auth. User roles and profiles are stored and managed in Supabase.

---

## 🧠 How the AI Works

- **Structured Questioning**: Follows standard clinical history-taking protocols.
- **Image Interpretation**: AI interprets uploaded medical imaging and provides feedback.
- **Drug Identification**: AI identifies drugs via OCR from text or uploaded pill image.
- **Conversational Chatbot**: Ask medical or general clinical questions. AI maintains context for more natural flow.
- **Real-Time Responses**: All AI interactions are live with full conversation memory support.

---

## 🛡️ Privacy & Data Handling

- **No Real Patient Data** is collected or stored.
- All entered data is treated as simulated.
- **User Data Stored** includes: email, encrypted password, full name, profile picture, and selected role—all securely stored via Supabase.
- Users may optionally **download anonymized reports** in PDF format.

---

## 📱 Running the App

### Install packages & dependencies (also for **SDK 53** compatibility)

```bash
npm install
npx expo install
```

### Run via **Expo Go** (for easy preview)

```bash
npx expo start
```

### Run via **EAS Build** (build app to test on your mobile device)

```bash
eas build --profile development
```

⚠️ Don’t forget to push your secrets before building:

```bash
eas env:push --path .env
```

---

## 🌐 Required Environment Variables

Add these in your `.env` file:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key

GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_MODEL="gemini-2.0-flash"
GEMINI_API_VERSION="v1beta"

RAPIDAPI_KEY=your_rapidapi_key
RAPIDAPI_HOST="all-meds-database.p.rapidapi.com"

GOOGLE_WEB_CLIENT_SECRET=your_google_client_secret
```

Create a `.env.example` file to share a safe boilerplate:

```bash
cp .env .env.example
```

---

## 🧪 Extending or Switching AI Providers

If you'd like to switch from Google Gemini to another LLM:

- Update `GEMINI_API_MODEL`, `API_KEY`, and adjust endpoint logic.
- Ensure the new AI service supports streaming, context retention, and HIPAA-compliant use if needed.

---

## 📦 Production Notes

- Project is ready for production use.
- Further optimization and feature additions are supported as needed.

---

## 📬 Contact

For support, feedback, or inquiries, contact: **[aesculaiorg1@gmail.com](mailto:aesculaiorg1@gmail.com)**

---

**© 2025 Aesculai. All rights reserved.**
