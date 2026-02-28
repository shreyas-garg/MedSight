import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
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

    console.log('Processing file:', { name: file.name, type: mimeType, size: file.size })

    // For PDFs, we need to inform user they should convert to image
    // Free tier doesn't support PDF analysis well
    if (mimeType === 'application/pdf') {
      return NextResponse.json({
        error: 'PDF analysis requires conversion',
        message: 'Please convert your PDF to a PNG or JPG image and try again.',
        suggestion: 'You can screenshot the relevant pages or use a free PDF-to-image converter.'
      }, { status: 400 })
    }

    // Initialize Gemini model - try gemini-1.5-flash (most common free tier model)
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' })

    // Create a detailed prompt for medical report analysis
    const prompt = `You are a medical assistant AI. Analyze the medical report in the image/document provided and provide a comprehensive summary in the following JSON format:

{
  "patientName": "Alex Rivera",
  "reportDate": "2024-01-15",
  "reportType": "Blood Test Summary",
  "keyFindings": [
    {
      "severity": "warning",
      "icon": "info",
      "color": "amber-500",
      "description": "Vitamin D levels are slightly below optimal range, which could contribute to fatigue."
    },
    {
      "severity": "critical",
      "icon": "warning",
      "color": "red-500",
      "description": "Hemoglobin is low (11.2 g/dL), suggesting mild anemia that may cause tiredness."
    },
    {
      "severity": "normal",
      "icon": "check_circle",
      "color": "primary",
      "description": "Cholesterol and WBC counts are within healthy ranges."
    }
  ],
  "testResults": [
    {
      "testName": "Hemoglobin (Hb)",
      "result": "11.2 g/dL",
      "referenceRange": "13.5 - 17.5 g/dL",
      "status": "low"
    },
    {
      "testName": "WBC Count",
      "result": "7.4 x10^9/L",
      "referenceRange": "4.5 - 11.0 x10^9/L",
      "status": "normal"
    },
    {
      "testName": "Vitamin D, 25-OH",
      "result": "22 ng/mL",
      "referenceRange": "30 - 100 ng/mL",
      "status": "low"
    }
  ],
  "medications": [
    {
      "name": "Vitamin D3 (2000 IU)",
      "dosage": "Daily",
      "purpose": "To normalize vitamin D levels and reduce fatigue."
    },
    {
      "name": "Ferrous Sulfate",
      "dosage": "As prescribed",
      "purpose": "Iron supplement to address mild anemia."
    }
  ],
  "questions": [
    "Is my anemia diet-related or due to another underlying cause?",
    "When should I retest my Vitamin D levels?",
    "What iron-rich foods should I prioritize in my meals?"
  ],
  "summary": "The report shows some areas needing attention, particularly low Vitamin D and Hemoglobin levels, while cholesterol and WBC counts are healthy."
}

Generate a similar comprehensive medical report analysis. Respond ONLY with the JSON object, no other text.`

    // Generate content with the image/document
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    }

    const result = await model.generateContent([prompt, imagePart])

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
        reportDate: new Date().toLocaleDateString(),
        reportType: "Medical Report",
        keyFindings: [
          {
            severity: "normal",
            icon: "check_circle",
            color: "primary",
            description: "Unable to extract detailed findings from the image. Please ensure the image is clear and readable."
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

    // Return the analysis
    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileSize: file.size,
      analysis: analysisData
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
      errorMessage = 'API quota exceeded. Please try again later or upgrade your API plan.'
    } else if (error.message?.includes('model')) {
      errorMessage = 'Model not available. Please check your API key permissions.'
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error.message },
      { status: 500 }
    )
  }
}
