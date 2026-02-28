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
4. Copy the generated key (it looks like: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)

### Step 3: Add Your API Key

1. Open the file `.env.local` in the root folder of the project
2. Replace `your_gemini_api_key_here` with your actual API key:

```bash
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

3. Save the file

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
4. **View Dashboard** - See your report summary with:
   - Key findings explained in simple terms
   - Test results breakdown
   - Medication recommendations
   - Suggested questions for your doctor

---

## 🔍 Supported Files

- **PDF** files (.pdf)
- **Images** (.png, .jpg, .jpeg)
- **Maximum size**: 10MB

---

## ⚠️ Troubleshooting

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

**Note**: This is a demo application. Always consult with healthcare professionals for medical advice.
