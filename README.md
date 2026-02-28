# MedSight - Medical Report Analysis Platform

MedSight is a modern web application that helps patients understand their medical reports by translating complex medical jargon into clear, actionable summaries using Google's Gemini AI.

## Features

- 🏥 **Landing Page**: Beautiful marketing page showcasing MedSight's features
- 📤 **Upload Interface**: Drag-and-drop file upload supporting PDF and images
- 🤖 **AI Analysis**: Powered by Google Gemini AI to analyze medical reports
- 📊 **Dashboard**: Split-pane interface showing original medical reports alongside AI-generated summaries
- 🎨 **Modern UI**: Built with Tailwind CSS featuring a clean, accessible design
- 🔒 **Privacy First**: Reports are processed in real-time and not stored permanently
- ⚡ **Fast**: Built with Next.js 14 and App Router for optimal performance

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Generative AI (Gemini)
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
│   ├── dashboard/
│   │   └── page.tsx           # Dashboard page with report viewer
│   ├── upload/
│   │   └── page.tsx           # Upload page for new reports
│   ├── globals.css            # Global styles and Tailwind imports
│   ├── layout.tsx             # Root layout with fonts and metadata
│   └── page.tsx               # Landing page
├── .env.local                 # Environment variables (create this)
├── .env.example              # Example environment file
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

## How It Works

### 1. Landing Page (`/`)
- Marketing page with feature highlights
- Call-to-action buttons to upload reports or view sample
- Trust indicators and security features

### 2. Upload Page (`/upload`)
- Drag-and-drop file upload interface
- Supports PDF, PNG, JPG, JPEG files (max 10MB)
- Real-time file validation
- Uploads file to Gemini API for analysis
- Redirects to dashboard with results

### 3. Dashboard (`/dashboard`)
- Split-pane layout:
  - **Left**: Original medical report document preview
  - **Right**: AI-generated summary with:
    - Key findings with severity indicators
    - Test results analysis
    - Medication recommendations
    - Questions to ask your doctor
    - Overall health summary
- Shows sample data if no report is uploaded
- Shows uploaded report analysis when available

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

## Customization

### Colors

The color scheme can be customized in `tailwind.config.js`:

```js
colors: {
  'primary': '#37ec13',              // Main brand color (green)
  'background-light': '#f6f8f6',     // Light mode background
  'background-dark': '#132210',      // Dark mode background
  'slate-custom': '#475569',         // Custom slate
  'sage-custom': '#688961',          // Custom sage
}
```

### Gemini Model

You can change the Gemini model in `app/api/analyze-report/route.ts`:

```typescript
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
// or use 'gemini-1.5-pro' for more advanced analysis
```

## Build for Production

```bash
npm run build
npm start
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | Yes |

## Security & Privacy

- Reports are processed in real-time using Gemini AI
- No reports are stored on the server permanently
- Analysis results are stored in browser sessionStorage only
- Files are validated for type and size before upload
- All API routes use proper error handling

## Supported File Types

- **PDF**: `.pdf`
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
