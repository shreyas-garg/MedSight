# Quick Setup Guide

## 🚀 Getting Your MedSight App Running

### Step 1: Install Dependencies
```bash
npm install
```

Prisma and `better-sqlite3` need their install scripts to run. If npm reports them as blocked:

```bash
npm install-scripts approve prisma @prisma/engines better-sqlite3
npm rebuild prisma @prisma/engines better-sqlite3
```

### Step 2: Get Your Gemini API Key

1. Go to **[Google AI Studio](https://aistudio.google.com/app/apikey)**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated key

New keys start with `AQ.` — Google retired the older `AIzaSy…` format in 2026, so an `AQ.` key
is expected and correct.

### Step 3: Add Your API Key

Copy the template, then paste your key into it:

```bash
cp .env.example .env
```

Open `.env` and replace `your_gemini_api_key_here` with your real key. The database URL
(`DATABASE_URL="file:./dev.db"`) is already filled in.

### Step 3b: Verify the key works

```bash
npm run check-api
```

This calls Gemini the same way the app does. If it does not print `Ready.`, uploading
a report will fail — fix that before relying on live analysis.

### Step 4: Set Up the Database
```bash
npx prisma migrate dev
npx prisma generate
```

This creates `dev.db` with the tables for users, reports, and rehab tasks.

### Step 5: Run the Application
```bash
npm run dev
```

### Step 6: Open Your Browser
Go to **http://localhost:3000**

---

## 📝 How to Use MedSight

MedSight has two roles, so create one account of each to see the whole flow.

### 1. Create a doctor account
**Sign up** → choose **I'm a Doctor** → you land on the doctor dashboard.

### 2. Create a patient account
Log out, **Sign up** again → choose **I'm a Patient**.

### 3. Connect the patient to the doctor
On the patient dashboard, under **Connect with a doctor**, search by name or email and pick
your doctor. (You can change this later with **Change doctor**.)

### 4. Upload a report
**Upload** → drag in a PDF or image → **Analyze with AI**. Analysis takes 30–60 seconds.
You'll land on the dashboard showing the original document beside the AI summary, plus a
banner confirming it was sent to your doctor.

### 5. Review it as the doctor
Log back in as the doctor. The dashboard shows a **pending reviews** count, the AI summary,
and a **View original document** link. Click **Give feedback** and send a note.

### 6. See the feedback as the patient
Log back in as the patient — the feedback appears on your dashboard and in **Health Profile**.

### 7. Try the extras
- **Patient History** (doctor) — pick a patient for a visit timeline, trend charts for test
  values with 2+ readings, and rehab task assignment
- **Daily Rehabilitation** (patient) — check off assigned tasks and build a streak

---

## 🔍 Supported Files

- **PDF** files (.pdf)
- **Images** (.png, .jpg, .jpeg)
- **Maximum size**: 10MB

---

## ⚠️ Troubleshooting

### Error: "You must be logged in as a patient to upload a report"
Uploading requires a signed-in **patient** account. Doctor accounts get redirected to their
own dashboard.

### Error: "Gemini API key not configured"
- Make sure `.env.local` exists in the root folder and contains `GEMINI_API_KEY`
- Restart the dev server (Ctrl+C, then `npm run dev`) — env files are only read at startup

### Error: "Model not available or not permitted for your key"
The server tries `gemini-3.6-flash`, then falls back to older models. If they all fail, check
your terminal — the real error there is more specific than the message in the UI.

### Error about a "driver adapter" from Prisma
Run `npx prisma generate`. Prisma 7 needs the generated client plus the SQLite adapter.

### Upload not working
- Check file size (under 10MB) and type (PDF or image)
- Check your internet connection — analysis calls Google's API

### Analysis takes too long
30–60 seconds is normal. Large PDFs and rate-limited keys can take longer.

### Port already in use
Next.js will offer the next free port, or free it with `lsof -ti:3000 | xargs kill`.

---

## 🎉 That's It!

**Note**: This is a demo application. Data is stored unencrypted in a local SQLite file. Always
consult a healthcare professional for medical advice — see the Limitations section in
[README.md](README.md).
