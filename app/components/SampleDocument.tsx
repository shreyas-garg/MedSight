import { SAMPLE_ANALYSIS, SAMPLE_LAB } from '../lib/sample-report'

/**
 * A rendered stand-in for "the report you uploaded", shown only in sample mode.
 * It is driven by SAMPLE_ANALYSIS, so the document and the AI summary beside it
 * always show the same patient and the same values. It is badged as a sample so
 * it can never be mistaken for a real scan.
 */
export default function SampleDocument({ zoom = 1 }: { zoom?: number }) {
  return (
    <div
      className="mx-auto w-full max-w-[800px] origin-top transition-transform"
      style={{ transform: `scale(${zoom})` }}
    >
      <div className="relative bg-white rounded-xl shadow-xl border border-stone-200 p-10 text-stone-800">
        {/* Sample badge - this document is illustrative, not a real report */}
        <div className="absolute top-4 right-4 px-2.5 py-1 rounded-md bg-amber-100 border border-amber-300 text-[10px] font-black uppercase tracking-widest text-amber-700">
          Sample
        </div>

        <div className="border-b-2 border-stone-100 pb-6 mb-6">
          <h2 className="text-2xl font-bold">{SAMPLE_LAB.name}</h2>
          <p className="text-stone-500 text-sm">{SAMPLE_LAB.division}</p>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs mb-8">
          <div className="flex justify-between border-b border-stone-100 pb-1">
            <span className="text-stone-400 font-semibold uppercase tracking-wide">Patient</span>
            <span className="font-medium">{SAMPLE_ANALYSIS.patientName}</span>
          </div>
          <div className="flex justify-between border-b border-stone-100 pb-1">
            <span className="text-stone-400 font-semibold uppercase tracking-wide">Accession</span>
            <span className="font-medium">{SAMPLE_LAB.accession}</span>
          </div>
          <div className="flex justify-between border-b border-stone-100 pb-1">
            <span className="text-stone-400 font-semibold uppercase tracking-wide">Collected</span>
            <span className="font-medium">{SAMPLE_LAB.collected}</span>
          </div>
          <div className="flex justify-between border-b border-stone-100 pb-1">
            <span className="text-stone-400 font-semibold uppercase tracking-wide">Reported</span>
            <span className="font-medium">{SAMPLE_LAB.reported}</span>
          </div>
        </div>

        <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-3">
          {SAMPLE_ANALYSIS.reportType}
        </h3>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] font-bold text-stone-400 uppercase border-b border-stone-200">
              <th className="text-left py-2">Test Name</th>
              <th className="text-left py-2">Result</th>
              <th className="text-left py-2">Reference Range</th>
              <th className="text-left py-2 w-12">Flag</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_ANALYSIS.testResults.map((test) => (
              <tr key={test.testName} className="border-b border-stone-50">
                <td className="py-2.5 font-medium">{test.testName}</td>
                <td
                  className={`py-2.5 font-bold ${
                    test.status === 'low'
                      ? 'text-red-600'
                      : test.status === 'high'
                      ? 'text-amber-600'
                      : ''
                  }`}
                >
                  {test.result}
                </td>
                <td className="py-2.5 text-stone-500">{test.referenceRange}</td>
                <td className="py-2.5 font-bold text-stone-500">
                  {test.status === 'low' ? 'L' : test.status === 'high' ? 'H' : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 pt-4 border-t border-stone-100 text-[11px] text-stone-400 leading-relaxed">
          <p className="mb-1">
            <span className="font-bold">L</span> = below reference range,{' '}
            <span className="font-bold">H</span> = above reference range.
          </p>
          <p>
            Illustrative sample data generated for demonstration. Not a real patient record.
          </p>
        </div>
      </div>
    </div>
  )
}
