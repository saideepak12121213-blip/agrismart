# 🌾 AgriSmart AI — Enterprise AI-Powered Agriculture Crop Advisory Assistant

AgriSmart AI is an enterprise-grade full-stack precision agriculture and agronomy advisory platform. It bridges plant pathology, soil chemistry stoichiometry, agro-meteorology, and generative AI (powered by Google Gemini) into a unified platform for farmers, agronomists, and agricultural extension workers.

---

## 🚀 Key Modules & Capabilities

1. **Farmer Command Center (`/dashboard`)**:
   - Real-time weather telemetry and Reference Evapotranspiration ($ET_0$) calculation.
   - **Spray Feasibility Warning System**: Automatically alerts `OPTIMAL`, `CAUTION`, or `PROHIBITED` chemical spraying windows based on wind drift hazard ($>15\text{ km/h}$), rain wash-off hazard ($\ge 40\%$), and foliar scorch temperature ($>35^\circ\text{C}$).
   - Soil NPK chemistry index cards & farm acreage overview.

2. **Multimodal Crop Pathology Scanner (`/diagnostics`)**:
   - Image upload / camera capture of infected leaves, fruits, or stems.
   - **Google Gemini 2.5 Flash Vision Triage**: Diagnostic identification, confidence score, pathogen classification (Fungal, Bacterial, Viral, Insect Pest, Abiotic Stress), and foliar symptom breakdown.
   - **Organic & Biocontrol Alternatives** vs **Synthetic Chemical Remedies** with commercial formulations, dilution dosage per liter, Pre-Harvest Intervals (PHI) in days, and personal protective equipment (PPE) guidelines.
   - Interactive cultural preventive sanitation checklist.

3. **Precision NPK Fertilizer & Nutrient Calculator (`/fertilizer-calc`)**:
   - Stoichiometric calculation converting soil deficits into commercial fertilizer recipes:
     - **DAP (18-46-0)**: Satisfies Phosphorus ($P_2O_5$) deficit first.
     - **Urea (46-0-0)**: Satisfies remaining Nitrogen ($N$) after subtracting incidental nitrogen from DAP.
     - **MOP (0-0-60)**: Satisfies Potassium ($K_2O$) deficit.
   - Metric kilograms and standard 50kg bag counts.
   - 3-stage split application timetable (Basal at sowing, Vegetative split, and Flowering/Fruit set split).
   - Visual **Soil NPK Radar Chart**.

4. **Seasonal Crop Rotation Advisor (`/crop-planner`)**:
   - Powered by **Google Gemini 2.5 Pro**.
   - Evaluates soil type, NPK chemistry, pH, irrigation infrastructure, and planting season to rank top crop recommendations ($0-100\%$ suitability), maturity timeline, expected yield range, and growth milestones.

5. **Weather-Adaptive Irrigation & Chemical Spraying Scheduler (`/irrigation`)**:
   - 7-Day weather forecast and irrigation run times (minutes & mm) based on localized reference evapotranspiration ($ET_0$).
   - Explicit daily spray feasibility chips to prevent pesticide drift and groundwater contamination.

6. **Conversational AI Agronomist — "Dr. Agro" (`/assistant`)**:
   - Multi-turn, context-aware chatbot with automatic retention of your registered farm plots and soil health history.
   - Multilingual consultation supporting **English, Hindi (हिंदी), Spanish (Español), Swahili (Kiswahili), and French (Français)**.
   - Audio text-to-speech playback and copy-to-clipboard functionality.

7. **Field Audit History & Diagnostic Archive (`/history`)**:
   - Chronological historical log of all plant pathology scans, confidence ratings, and fertilizer prescriptions.
   - Filterable by severity and resolution status.
   - Printable field audit report generator.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React icons, TanStack React Query v5, Recharts.
- **Backend**: Node.js, Express.js, TypeScript, Multer, Helmet, CORS, Express Rate Limit.
- **AI Engine**: Google GenAI SDK (`@google/genai`) utilizing `gemini-2.5-flash` for multimodal vision pathology triage and `gemini-2.5-pro` for seasonal crop planning.
- **Database**: PostgreSQL / SQLite abstraction layer with schema migrations and sample agronomy seed records.

---

## 📦 Getting Started

### 1. Prerequisites
- Node.js (v18+ or v20+)
- npm or yarn

### 2. Installation
```bash
git clone https://github.com/saideepak12121213-blip/agrismart.git
cd agrismart
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Set your environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=super_secret_jwt_key_at_least_32_characters_long
```

### 4. Running Locally
Build the frontend and run the application:
```bash
npm run build
npm start
```
Or run both client and server in development mode:
```bash
npm run dev
```

Open your browser at:
```
http://localhost:5000
```

---

## 📄 License
MIT License. Built for sustainable agriculture and precision farming.
