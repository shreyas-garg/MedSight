# MedSight - Medical Report Analysis Platform

MedSight is a modern web application that helps patients understand their medical reports by translating complex medical jargon into clear, actionable summaries using Google's Gemini AI.

## Features

- 🏥 **Landing Page**: Beautiful marketing page showcasing MedSight's features
- 📤 **Upload Interface**: Drag-and-drop file upload supporting PDF and images
- 🤖 **AI Analysis**: Powered by Google Gemini AI to analyze medical reports
- 📊 **Dashboard**: Split-pane interface showing original medical reports alongside AI-generated summaries
- 🎨 **Modern UI**: Built with Tailwind CSS featuring a clean, accessible design
- 📈 **Health Profile**: Past analyses kept in your browser's localStorage
- 📄 **PDF Export**: "Share with Doctor" downloads a one-page summary to send or print
- ✅ **Doctor Checklist**: Tick off questions as you ask them, or copy them all at once
- 🌗 **Dark Mode**: Follows your OS by default, with a toggle that remembers your choice
- 🔒 **No Server Storage**: Reports are analysed in-request and never written to a database
- ⚡ **Fast**: Built with Next.js 14 and App Router for optimal performance

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Generative AI (Gemini 2.5 Flash, falling back to 2.0 Flash)
- **PDF Export**: jsPDF
- **Icons**: Google Material Symbols
- **Font**: Inter (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Google Gemini API key (get one at [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

Create a `.env.local` file in the root directory and add your Gemini API key:

```bash
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Important**: Replace `your_actual_gemini_api_key_here` with your actual Gemini API key from Google AI Studio.

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Get a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Paste it in your `.env.local` file

## Project Structure

```
medi/
├── app/
│   ├── api/
│   │   └── analyze-report/
│   │       └── route.ts        # API endpoint for report analysis
│   ├── components/
│   │   ├── Sidebar.tsx        # Shared app nav (dashboard + health profile)
│   │   ├── SampleDocument.tsx # Rendered sample lab report
│   │   └── ThemeToggle.tsx    # Light/dark switch
│   ├── lib/
│   │   └── sample-report.ts   # Sample data + shared report types
│   ├── dashboard/
│   │   └── page.tsx           # Dashboard: original document + AI summary
│   ├── health-profile/
│   │   └── page.tsx           # History of past analyses (localStorage)
│   ├── upload/
│   │   └── page.tsx           # Upload page for new reports
│   ├── globals.css            # Global styles and Tailwind imports
│   ├── layout.tsx             # Root layout with fonts and metadata
│   └── page.tsx               # Landing page
├── utils/
│   └── pdf.ts                 # jsPDF summary export
├── .env.local                 # Environment variables (create this)
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

## How It Works

### 1. Landing Page (`/`)
- Marketing page with feature highlights
- Call-to-action buttons to upload a report or view the sample

### 2. Upload Page (`/upload`)
- Drag-and-drop file upload interface
- Supports PDF, PNG, JPG, JPEG files (max 10MB)
- Real-time file validation
- Uploads file to Gemini API for analysis
- Redirects to dashboard with results

### 3. Dashboard (`/dashboard`)
- Split-pane layout:
  - **Left**: your actual uploaded file — images render with zoom controls, PDFs in
    the browser's built-in viewer. The file is cached in `sessionStorage` for the
    session only, so opening an older analysis from the Health Profile shows a
    placeholder rather than the wrong document.
  - **Right**: AI-generated summary with key findings (colour-coded by severity),
    the test-results table, medications named in the report, questions to ask your
    doctor, and a medical disclaimer.
- **Sample mode**: with nothing uploaded, *both* panes show the same fictional
  patient — a rendered sample lab report on the left and its summary on the right,
  with a banner and badges making clear it is not your data. The sample document and
  the sample summary are generated from one object in `app/lib/sample-report.ts`, so
  they cannot drift apart.
- **Questions for your Doctor** is a working checklist: tick items off during the
  appointment (with a running count), or copy them all to the clipboard
- **Share with Doctor** exports the summary as a paginated PDF

### 4. Health Profile (`/health-profile`)
- Lists every report analysed in this browser (`localStorage`, key `healthReports`)
- Re-opens any past analysis in the dashboard
- Clearing browser data clears this history — it is not synced anywhere

## API Routes

### POST `/api/analyze-report`

Analyzes a medical report using Gemini AI.

**Request**: 
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData with 'file' field

**Response**:
```json
{
  "success": true,
  "fileName": "report.pdf",
  "fileSize": 123456,
  "analysis": {
    "patientName": "John Doe",
    "reportDate": "2024-01-15",
    "reportType": "Blood Test",
    "keyFindings": [...],
    "testResults": [...],
    "medications": [...],
    "questions": [...],
    "summary": "..."
  }
}
```

## Dark Mode

Tailwind's `darkMode: 'class'` strategy. A small inline script in `app/layout.tsx`
applies the stored or system theme **before first paint**, so there is no flash of the
wrong colours on load. `ThemeToggle` reads the `dark` class off `<html>` rather than
re-deriving it, keeping the button and the page in sync, and writes an explicit choice
to `localStorage`. With no explicit choice stored the app follows the OS and keeps
following it if the OS setting changes mid-session.

## Customization

### Colors

The color scheme can be customized in `tailwind.config.js`:

```js
colors: {
  'primary': '#37ec13',              // Main brand color (green)
  'primary-dark': '#1a7a08',         // Same brand color, readable as text on light
  'background-light': '#f6f8f6',     // Light mode background
  'background-dark': '#132210',      // Dark mode background
  'slate-custom': '#475569',         // Custom slate
  'sage-custom': '#688961',          // Custom sage
}
```

### Gemini Model

The route tries `gemini-2.5-flash` and falls back to `gemini-2.0-flash` if the first
model is unavailable for your key. Both are set at the top of
`app/api/analyze-report/route.ts`:

```typescript
const PRIMARY_MODEL = 'gemini-2.5-flash'
const FALLBACK_MODEL = 'gemini-2.0-flash'
```

The prompt describes only the **output schema** and instructs the model to use values
from the attached file exclusively. Do not add filled-in example values to it — the
model will echo them back instead of reading the report.

## Build for Production

```bash
npm run build
npm start
```

## Before a Demo

Run the preflight check — it calls Gemini exactly the way the upload route does, so
whatever it reports is what your audience will see:

```bash
npm run check-api
```

`Ready.` means uploads will work. Anything else means the upload flow will fail, and
the message tells you why. The common one is:

> `403 Your project has been denied access`

That is the API key's Google Cloud project being blocked — no code change fixes it.
Generate a fresh key at https://aistudio.google.com/apikey, put it in `.env.local`,
restart the dev server and re-run the check.

If the AI is unavailable at demo time, **/dashboard still works completely offline** —
it shows the full sample report with no API call, and the upload page offers a link to
it when an analysis fails.

## Scripts

- `npm run check-api` - Verify the Gemini key works (run this before presenting)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |

## Security & Privacy

- Reports are sent to Google's Gemini API for analysis and are subject to Google's
  data-handling terms — read those before uploading real patient data
- Nothing is written to a server-side database; there is no backend storage at all
- The uploaded file lives in `sessionStorage`; analyses live in `localStorage`. Both
  are on the user's device, unencrypted, and readable by anything with access to that
  browser profile
- Files are validated for type and size (10MB) before upload
- There is **no authentication**. Anyone who can reach the deployment can use the
  API key configured on the server. Add auth and rate limiting before deploying
  publicly

## Not Medical Advice

MedSight produces AI-generated summaries for education and appointment preparation.
It is not a medical device, does not provide diagnosis, and can be wrong. Every
finding should be confirmed with a qualified clinician.

## Supported File Types

- **PDF**: `.pdf` (sent directly to the AI model; no local parsing required)
- **Images**: `.png`, `.jpg`, `.jpeg`
- **Max Size**: 10MB per file

## Troubleshooting

### "Gemini API key not configured" error
- Make sure you've created the `.env.local` file
- Verify the API key is correctly set in `.env.local`
- Restart the development server after adding the API key

### File upload fails
- Check file size (must be under 10MB)
- Verify file type is PDF or image
- Check browser console for errors

### Analysis takes too long
- Large PDF files may take 20-30 seconds to process
- Try using a smaller file or image instead
- Check your internet connection

## Future Enhancements

- User authentication and report history
- Support for more file formats
- Multi-language support
- Export analysis as PDF
- Share reports securely with doctors
- Dark mode support

## License

This project is for educational/demonstration purposes.

## Acknowledgments

- Design inspired by modern healthcare applications
- Icons from Google Material Symbols
- AI powered by Google Gemini
- Built with Next.js and Tailwind CSS
