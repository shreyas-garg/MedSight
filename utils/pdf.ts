import jsPDF from 'jspdf';

export function generateSummaryPDF(analysis: any, fileName: string = 'MedSight_Summary.pdf') {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('MedSight Summary', 10, 15);
  doc.setFontSize(12);
  doc.text(`Patient: ${analysis.patientName || ''}`, 10, 25);
  doc.text(`Report Date: ${analysis.reportDate || ''}`, 10, 32);
  doc.text(`Report Type: ${analysis.reportType || ''}`, 10, 39);

  let y = 48;
  doc.setFontSize(14);
  doc.text('Key Findings:', 10, y);
  y += 7;
  doc.setFontSize(11);
  analysis.keyFindings?.forEach((finding: any, i: number) => {
    doc.text(`- ${finding.description}`, 12, y);
    y += 6;
  });
  y += 4;
  doc.setFontSize(14);
  doc.text('Test Results:', 10, y);
  y += 7;
  doc.setFontSize(11);
  analysis.testResults?.forEach((test: any) => {
    doc.text(`- ${test.testName}: ${test.result} (Ref: ${test.referenceRange})`, 12, y);
    y += 6;
  });
  y += 4;
  doc.setFontSize(14);
  doc.text('Medications:', 10, y);
  y += 7;
  doc.setFontSize(11);
  analysis.medications?.forEach((med: any) => {
    doc.text(`- ${med.name} (${med.dosage}): ${med.purpose}`, 12, y);
    y += 6;
  });
  y += 4;
  doc.setFontSize(14);
  doc.text('Questions for Doctor:', 10, y);
  y += 7;
  doc.setFontSize(11);
  analysis.questions?.forEach((q: string) => {
    doc.text(`- ${q}`, 12, y);
    y += 6;
  });
  y += 4;
  doc.setFontSize(12);
  doc.text('Summary:', 10, y);
  y += 7;
  doc.setFontSize(11);
  doc.text(analysis.summary || '', 12, y);

  doc.save(fileName);
}
