# Quick Setup Guide

## 🚀 Getting Your MedSight App Running

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Get Your Gemini API Key

1. Go to **[Google AI Studio](https://makersuite.google.com/app/apikey)**
2. Sign in with your Google account
3. Click **"Create API Key"** or **"Get API Key"**
4. Copy the generated key (Google issues these in a couple of formats, e.g.
   `AIzaSy...` or `AQ.Ab8...` — paste whatever it gives you verbatim)

### Step 3: Add Your API Key

1. Open the file `.env.local` in the root folder of the project
2. Replace the placeholder with your actual API key:

```bash
GEMINI_API_KEY=paste_your_key_here
```

3. Save the file

### Step 3b: Verify the key works

```bash
npm run check-api
```

This calls Gemini the same way the app does. If it does not print `Ready.`, uploading a
report will fail — fix it before relying on the live analysis.

### Step 4: Run the Application
```bash
npm run dev
```

### Step 5: Open Your Browser
Go to: **http://localhost:3000**

---

## 📝 How to Use MedSight

1. **Landing Page** - Click "Upload Report" or "Get Started"
2. **Upload Page** - Drag and drop your medical report (PDF or image)
3. **Click "Analyze with AI"** - Wait 10-30 seconds for analysis
4. **View Dashboard** - Your uploaded document on the left, summary on the right:
   - Key findings explained in simple terms
   - Test results breakdown
   - Medications named in the report
   - Suggested questions for your doctor
5. **Share with Doctor** - Downloads the summary as a one-page PDF
6. **Health Profile** - Revisit past analyses (saved in this browser only)
7. **Dark mode** - Toggle in the sidebar (or the header on the landing/upload pages).
   Follows your OS until you pick one explicitly.

No report to hand? Open **/dashboard** with nothing uploaded and you get a complete
sample — a rendered sample lab report next to its AI summary — so you can see the whole
flow before uploading anything of your own.

---

## 🔍 Supported Files

- **PDF** files (.pdf)
- **Images** (.png, .jpg, .jpeg)
- **Maximum size**: 10MB

---

## ⚠️ Troubleshooting

### Error: "Model not available or not permitted for your key"
- The route tries `gemini-2.5-flash`, then falls back to `gemini-2.0-flash`
- If neither works, check which models your key can access in Google AI Studio and
  update `PRIMARY_MODEL` / `FALLBACK_MODEL` in `app/api/analyze-report/route.ts`

### Summary looks generic or mentions a patient who isn't you
- The prompt in `app/api/analyze-report/route.ts` must describe the JSON **schema**
  only. If example values are added back to it, Gemini echoes those instead of
  reading your file.
- Otherwise the upload is probably too blurry to read — retake the photo in good light

### Error: "Gemini API key not configured"
- Make sure `.env.local` file exists in the root folder
- Check that you've pasted your API key correctly
- Restart the dev server: Stop it (Ctrl+C) and run `npm run dev` again

### Upload not working
- Check file size (must be under 10MB)
- Make sure file is PDF or image format
- Check your internet connection

### Port already in use
- If port 3000 is already in use, Next.js will automatically use port 3001 or 3002
- Check the terminal output for the actual port number

---

## 🎉 That's It!

Your MedSight application is now ready to analyze medical reports using AI!

**Note**: This is a demo application with no authentication and no server-side
storage. Uploaded reports are sent to Google's Gemini API for analysis, and summaries
are saved only in your browser. Always consult a healthcare professional for medical
advice — AI summaries can be wrong.
