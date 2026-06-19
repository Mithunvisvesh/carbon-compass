# CarbonCompass

### *Not Just Measure. Guide.*

CarbonCompass is a modern, high-fidelity personal sustainability application designed to help individuals transition from tracking carbon guilt to taking small, actionable steps toward reduction. Built for the PromptWars Virtual Hackathon, it combines frictionless onboarding, zero-latency impact simulations, and secure AI-driven behavioral coaching.

---

## 🎯 The Problem & Our Solution

### Why Traditional Carbon Tracking Fails
1. **High Friction**: Users are forced to dig up utility bills or estimate complex figures before they can even see a number.
2. **Guilt-Driven**: Showing a massive emissions number without a clear, achievable path forward leads to user disengagement and eco-anxiety.
3. **Out-of-Touch Recommendations**: Suggesting high-cost, long-term changes (like "install solar panels" or "buy an electric car") is irrelevant to everyday actions.

### How CarbonCompass Solves It
- **Instant Micro-Onboarding**: An elegant onboarding interface with pre-configured personas allows users to begin in under 10 seconds.
- **Frictionless Insights**: Focuses on immediate, actionable, and low-cost "Small Wins" rather than overwhelming structural overhauls.
- **Interactive Simulation**: Zero-latency, slide-based impact simulations show users exactly how small adjustments to their routines yield massive cumulative reductions.

---

## ✨ Key Features

- **⚡ Zero-Latency Impact Simulator**: Instantly visualizes the weight of individual habit changes (e.g., carpooling, meatless days) in real-time, letting users slide to compare different scenarios dynamically.
- **📚 Transparent Methodology**: A dedicated education center outlining the exact formulas, metrics, and regional averages (such as transport, energy, and diet averages) sourced from validated environmental databases.
- **🎭 Onboarding Persona Loader**: Jump-start the experience with one-click profiles (e.g., Suburban Commuter, Eco-Conscious Student, Urban Professional) or complete a quick custom baseline calculation.
- **🦉 AI Habit Coach**: Highly personalized insight generation that shifts from passive measurement to active, structured mentorship.

---

## 🤖 How CarbonCompass Uses Google AI

CarbonCompass leverages **Gemini 2.0 Flash** to provide personalized, context-aware coaching while maintaining enterprise-grade safety and performance.

### 🔒 Secure Serverless Proxy Architecture
To protect our API key and maintain strict access control for production deployment, the frontend never directly accesses the Gemini API. Instead:
1. The client sends the structured baseline metrics and the user's routine description to a serverless proxy route `/api/gemini`.
2. The proxy reads the secure `GEMINI_API_KEY` from environment variables on Vercel's backend and communicates with the `@google/generative-ai` SDK.
3. The serverless function returns the generated JSON text back to the client, keeping the API key fully hidden.

### ⚙️ Prompt Engineering & Schema Enforcement
For a predictable and high-fidelity user experience, we enforce strict constraints on the model via prompt design and SDK-level schema specifications:
- **Strict JSON Output**: We configure the API with `responseMimeType: "application/json"`.
- **Constraint Enforcement**: The model is forbidden from performing math calculations (relying instead on our client-side calculator) and is forced to only suggest **"Small Wins"** (challenges under ₹500/month, taking less than 10 minutes, and directly addressing the user's highest emission category).

---

## 🚀 Running Locally

Follow these quick steps to get CarbonCompass running on your local machine:

### 1. Clone & Install Dependencies
Clone the repository and install the project dependencies:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and add your Google Gemini API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 3. Run the Development Server
Start the local development server:
```bash
npm run dev
```
Open your browser to the local address provided by Vite (usually `http://localhost:5173`).
