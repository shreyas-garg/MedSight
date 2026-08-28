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

  // No stored original: reports created before file storage existed. The extracted
  // values are shown in full in the analysis panel, so don't duplicate them here.
  return (
    <div className="shrink-0 bg-white rounded-xl shadow-xl border border-stone-200 p-8 sm:p-12 min-h-[320px] mx-auto w-full max-w-[800px] flex flex-col items-center justify-center text-center">
      <div className="size-14 rounded-full bg-stone-100 flex items-center justify-center mb-5">
        <span className="material-symbols-outlined text-3xl text-stone-400">hide_image</span>
      </div>
      <h2 className="text-lg font-bold text-stone-800 mb-1 break-words max-w-full">{fileName}</h2>
      {(reportDate || reportType) && (
        <p className="text-sm text-stone-500 mb-4">
          {[reportType, reportDate && `Date: ${reportDate}`].filter(Boolean).join(' • ')}
        </p>
      )}
      <p className="text-sm text-stone-600 max-w-sm">
        The original file wasn&apos;t saved for this report — it predates document storage. All{' '}
        {testResults.length} extracted value{testResults.length === 1 ? '' : 's'} are listed under{' '}
        <span className="font-semibold">All Test Results</span>.
      </p>
      <p className="text-xs text-stone-400 mt-4">Newer uploads keep the original document.</p>
    </div>
  )
}
