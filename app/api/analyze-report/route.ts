import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { saveReportFile, deleteReportFile, isSupportedMimeType } from '@/lib/storage'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
const MAX_FILE_BYTES = 10 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'PATIENT') {
      return NextResponse.json(
        { error: 'You must be logged in as a patient to upload a report' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    // Read file content
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Convert to base64
    const base64Data = buffer.toString('base64')
    let mimeType = file.type
    
    // Handle file type detection
    if (!mimeType || mimeType === 'application/octet-stream') {
      const fileName = file.name.toLowerCase()
      if (fileName.endsWith('.pdf')) mimeType = 'application/pdf'
      else if (fileName.endsWith('.png')) mimeType = 'image/png'
      else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) mimeType = 'image/jpeg'
    }

    // Enforce the same limits as the upload form, since the client can be bypassed
    if (!isSupportedMimeType(mimeType)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload a PDF or image (PNG, JPG, JPEG).' },
        { status: 400 }
      )
    }
    if (buffer.byteLength > MAX_FILE_BYTES) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 })
    }

    console.log('Processing file:', { name: file.name, type: mimeType, size: file.size })

    // Models are tried in order. Flash models first (these carry free-tier
    // quota); the pro model last, since it has zero free-tier quota and only
    // works on a project with billing enabled. Google retires versions and
    // closes older ones to new keys, so keep a floating alias in the list.
    const MODEL_CHAIN = [
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-3.7-flash',
      'gemini-flash-latest',
      'gemini-pro-latest',
    ]

    // The prompt describes only the OUTPUT SCHEMA. It must never contain filled-in
    // example values: with a populated example the model echoes that sample back
    // instead of reading the attached file.
    const prompt = `You are a medical assistant AI. Read ONLY the medical report in the attached file and summarise it for the patient in plain language.

Return a single JSON object with exactly these keys:

{
  "patientName": string  - the patient name printed on the report, or "Not stated" if absent,
  "reportDate": string   - the report/collection date as printed, or "Not stated",
  "reportType": string   - e.g. "Complete Blood Count", "MRI Brain", "Lipid Profile",
  "keyFindings": [       - one entry per notable finding, most important first
    {
      "severity": "normal" | "warning" | "critical",
      "description": string - plain-English explanation of what this means for the patient
    }
  ],
  "testResults": [       - every measured value present in the report
    {
      "testName": string,
      "result": string          - value with units, exactly as printed,
      "value": number | null     - the numeric part of the result, or null if not numeric,
      "unit": string             - the unit on its own (e.g. "g/dL"), or "" if none,
      "referenceRange": string   - as printed, or "Not stated",
      "status": "normal" | "low" | "high"
    }
  ],
  "medications": [       - only medications or supplements named in the report itself
    { "name": string, "dosage": string, "purpose": string }
  ],
  "questions": [string]  - 3 to 5 questions this patient should ask their doctor,
  "summary": string      - 2 to 3 sentence overview
}

Rules:
- Use ONLY values that appear in the attached file. Never invent a name, date, test, value or reference range.
- "value" and "unit" must be split out of the printed result so results can be tracked over time. If the result is not numeric, use null for "value" and "" for "unit".
- If the file contains no medications, return an empty array. Do not suggest treatments the report does not mention.
- If the file is unreadable or is not a medical report, return keyFindings with a single "warning" entry saying so, and empty testResults and medications.
- Respond with the JSON object only. No markdown fences, no commentary.`

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    }

    let result
    let lastError: any
    for (const modelName of MODEL_CHAIN) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName })
        result = await model.generateContent([prompt, imagePart])
        lastError = undefined
        break
      } catch (err: any) {
        lastError = err
        console.warn(`Model ${modelName} failed:`, err.message)
        // An invalid key fails identically on every model, so stop early. Quota
        // and permission errors are per-model, so keep going down the chain.
        const msg = (err.message || '').toLowerCase()
        if (msg.includes('api key not valid') || msg.includes('api_key_invalid')) {
          break
        }
      }
    }

    if (!result) {
      throw lastError ?? new Error('No Gemini model was able to process this file')
    }

    const response = result.response
    const text = response.text()
    
    // Try to parse the JSON response
    let analysisData
    try {
      // Remove markdown code blocks if present
      const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      analysisData = JSON.parse(jsonText)
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', text)
      
      // If parsing fails, return sample data
      analysisData = {
        patientName: "Sample Patient",
        reportDate: new Date().toLocaleDateString('en-US'),
        reportType: "Medical Report",
        keyFindings: [
          {
            severity: "warning",
            description: "Unable to extract detailed findings from this file. Please ensure the report is clear and readable."
          }
        ],
        testResults: [],
        medications: [],
        questions: [
          "Could you provide a clearer image of the report?",
          "Are there any specific values you'd like me to explain?"
        ],
        summary: "The AI had difficulty reading the report. Please try uploading a clearer image or contact support."
      }
    }

    // Normalise the shape so the UI never receives undefined arrays. Done before
    // the DB write so stored rows are consistent too.
    const asArray = (v: any) => (Array.isArray(v) ? v : [])
    analysisData = {
      patientName: analysisData?.patientName || 'Not stated',
      reportDate: analysisData?.reportDate || 'Not stated',
      reportType: analysisData?.reportType || 'Medical Report',
      keyFindings: asArray(analysisData?.keyFindings),
      testResults: asArray(analysisData?.testResults),
      medications: asArray(analysisData?.medications),
      questions: asArray(analysisData?.questions),
      summary: analysisData?.summary || '',
    }

    // Keep the original document so the doctor can check the AI against the source
    const storageKey = await saveReportFile(buffer, mimeType)

    let report
    try {
      report = await prisma.report.create({
        data: {
          patientId: user.id,
          doctorId: user.doctorId,
          fileName: file.name,
          fileSize: file.size,
          mimeType,
          storageKey,
          analysisJson: JSON.stringify(analysisData),
        },
      })
    } catch (dbError) {
      // Don't leave the file behind with no row pointing at it
      await deleteReportFile(storageKey)
      throw dbError
    }

    const doctor = user.doctorId
      ? await prisma.user.findUnique({ where: { id: user.doctorId }, select: { name: true } })
      : null

    // Return the analysis
    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileSize: file.size,
      analysis: analysisData,
      reportId: report.id,
      reportStatus: report.status,
      doctorName: doctor?.name ?? null,
    })

  } catch (error: any) {
    console.error('Error analyzing report:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    })
    
    // Provide more specific error messages
    let errorMessage = 'Failed to analyze report'
    if (error.message?.includes('API key')) {
      errorMessage = 'Invalid or missing API key. Please check your Gemini API configuration.'
    } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
      errorMessage =
        'Every available model is out of quota. Free-tier limits reset daily; run `npm run check-api` for details.'
    } else if (error.message?.includes('model')) {
      errorMessage =
        'No available Gemini model could process this report. Your API key may not have access to the models listed in MODEL_CHAIN - run `npm run check-api`.'
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error.message },
      { status: 500 }
    )
  }
}
