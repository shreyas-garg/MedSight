/**
 * The sample report shown on /dashboard when nothing has been uploaded.
 * Kept in one place so the summary pane and the sample document preview can
 * never drift apart - previously the document was hardcoded separately and
 * showed a different lab, patient and set of values from the summary.
 */

export interface TestResult {
  testName: string
  result: string
  referenceRange: string
  status: 'normal' | 'low' | 'high'
}

export interface KeyFinding {
  severity: 'normal' | 'warning' | 'critical'
  description: string
}

export interface Medication {
  name: string
  dosage: string
  purpose: string
}

export interface ReportAnalysis {
  patientName: string
  reportDate: string
  reportType: string
  keyFindings: KeyFinding[]
  testResults: TestResult[]
  medications: Medication[]
  questions: string[]
  summary: string
}

export const SAMPLE_LAB = {
  name: 'City General Hospital',
  division: 'Pathology & Laboratory Division',
  accession: 'ACC-2023-104882',
  collected: '10 Oct 2023, 08:15',
  reported: '12 Oct 2023, 16:40',
}

export const SAMPLE_FILE_NAME = 'Blood Test Summary - Oct 2023'

export const SAMPLE_ANALYSIS: ReportAnalysis = {
  patientName: 'Alex Rivera',
  reportDate: '12 Oct 2023',
  reportType: 'Blood Test Summary',
  keyFindings: [
    {
      severity: 'critical',
      description:
        'Your Hemoglobin is low (11.2 g/dL), suggesting mild anemia. This may explain any recent tiredness or shortness of breath.',
    },
    {
      severity: 'warning',
      description:
        'Your Vitamin D levels are slightly below the optimal range. This is common and can contribute to feelings of fatigue.',
    },
    {
      severity: 'normal',
      description: 'Your Cholesterol and WBC counts are within perfectly healthy ranges.',
    },
  ],
  testResults: [
    { testName: 'Hemoglobin (Hb)', result: '11.2 g/dL', referenceRange: '13.5 - 17.5 g/dL', status: 'low' },
    { testName: 'WBC Count', result: '7.4 x10^9/L', referenceRange: '4.5 - 11.0 x10^9/L', status: 'normal' },
    { testName: 'Platelet Count', result: '265 x10^9/L', referenceRange: '150 - 400 x10^9/L', status: 'normal' },
    { testName: 'Vitamin D, 25-OH', result: '22 ng/mL', referenceRange: '30 - 100 ng/mL', status: 'low' },
    { testName: 'Serum Cholesterol', result: '188 mg/dL', referenceRange: '< 200 mg/dL', status: 'normal' },
    { testName: 'Serum Ferritin', result: '14 ng/mL', referenceRange: '20 - 250 ng/mL', status: 'low' },
  ],
  medications: [
    {
      name: 'Vitamin D3 (2000 IU)',
      dosage: 'Daily',
      purpose: 'Daily supplement to normalize levels.',
    },
    {
      name: 'Ferrous Sulfate',
      dosage: 'As prescribed',
      purpose: 'Iron supplement to address mild anemia.',
    },
  ],
  questions: [
    'Is my anemia related to my diet or a separate underlying cause?',
    'Should I re-test my Vitamin D levels in 3 months or 6 months?',
    'Are there specific iron-rich foods I should prioritize in my daily meals?',
    'Does my low ferritin change how long I should take iron for?',
  ],
  summary:
    'Overall health indicators show some areas requiring attention, particularly Vitamin D and Hemoglobin levels. Iron stores are also low, which fits the mild anemia picture. Cholesterol, platelets and white cell counts are all healthy.',
}
