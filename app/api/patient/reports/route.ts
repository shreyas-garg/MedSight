import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'PATIENT') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  const reports = await prisma.report.findMany({
    where: { patientId: user.id },
    include: { doctor: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({
    reports: reports.map((r) => ({
      id: r.id,
      fileName: r.fileName,
      status: r.status,
      feedback: r.feedback,
      createdAt: r.createdAt,
      reviewedAt: r.reviewedAt,
      hasFile: Boolean(r.storageKey),
      mimeType: r.mimeType,
      doctorName: r.doctor?.name ?? null,
      analysis: JSON.parse(r.analysisJson),
    })),
  })
}
