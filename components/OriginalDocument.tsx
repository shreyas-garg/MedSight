'use client'

type TestResult = {
  testName: string
  result: string
  referenceRange?: string
  status?: string
}

/**
 * Shows the real uploaded file when one was stored. Reports created before
 * file storage existed have no original, so we fall back to the values the
 * AI extracted — labelled as such, so it is never mistaken for the source.
 */
export default function OriginalDocument({
  reportId,
  mimeType,
  fileName,
  testResults,
  reportDate,
  reportType,
}: {
  reportId: string | null
  mimeType: string | null
  fileName: string
  testResults: TestResult[]
  reportDate?: string
  reportType?: string
}) {
  const fileUrl = reportId ? `/api/reports/${reportId}/file` : null

  if (fileUrl && mimeType === 'application/pdf') {
    return (
      <div className="shrink-0 bg-white rounded-xl shadow-xl border border-stone-200 mx-auto w-full max-w-[800px] overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-stone-100">
          <p className="text-sm font-semibold text-background-dark truncate">{fileName}</p>
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-primary hover:underline whitespace-nowrap shrink-0"
          >
            Open full size
          </a>
        </div>
        <object data={fileUrl} type="application/pdf" className="w-full h-[900px]">
          <div className="p-8 text-center">
            <p className="text-sm text-stone-600 mb-3">This browser can&apos;t display the PDF inline.</p>
            <a href={fileUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary hover:underline">
              Open the original PDF
            </a>
          </div>
        </object>
      </div>
    )
  }

  if (fileUrl && mimeType?.startsWith('image/')) {
    return (
      <div className="shrink-0 bg-white rounded-xl shadow-xl border border-stone-200 mx-auto w-full max-w-[800px] overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-stone-100">
          <p className="text-sm font-semibold text-background-dark truncate">{fileName}</p>
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-primary hover:underline whitespace-nowrap shrink-0"
          >
            Open full size
          </a>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={fileUrl} alt={`Original medical report: ${fileName}`} className="w-full h-auto" />
      </div>
    )
  }

  // No stored original (pre-existing report, or file unavailable)
  return (
    <div className="shrink-0 bg-white rounded-xl shadow-xl border border-stone-200 p-6 sm:p-12 min-h-[500px] mx-auto w-full max-w-[800px]">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-8 flex items-start gap-2">
        <span className="material-symbols-outlined text-amber-600 text-lg">info</span>
        <p className="text-xs text-amber-800">
          The original file wasn&apos;t saved for this report. Shown below are the values MedSight extracted — not the
          source document.
        </p>
      </div>

      <div className="border-b-2 border-stone-100 pb-6 mb-8 flex justify-between items-start gap-4 flex-wrap">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-stone-800 truncate">{fileName}</h2>
          <p className="text-stone-500 text-sm">Extracted values</p>
        </div>
        <div className="text-right text-sm text-stone-500 min-w-0">
          {reportDate && <p className="truncate">Date: {reportDate}</p>}
          {reportType && <p className="truncate">Type: {reportType}</p>}
        </div>
      </div>

      <div className="space-y-6 min-w-0">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs font-bold text-stone-400 border-b border-stone-100 pb-2">
          <div className="min-w-0">TEST NAME</div>
          <div className="min-w-0">RESULT</div>
          <div className="min-w-0">REFERENCE RANGE</div>
        </div>
        {testResults.map((test, index) => (
          <div key={index} className="grid grid-cols-3 gap-2 sm:gap-4 text-sm items-center py-2 border-b border-stone-50">
            <div className="font-medium min-w-0 break-words">{test.testName}</div>
            <div
              className={`font-bold min-w-0 break-words ${
                test.status === 'low' ? 'text-red-600' : test.status === 'high' ? 'text-amber-600' : 'text-stone-800'
              }`}
            >
              {test.result}
            </div>
            <div className="text-stone-500 min-w-0 break-words">{test.referenceRange}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
