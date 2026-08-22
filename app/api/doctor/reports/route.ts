import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'DOCTOR') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  const reports = await prisma.report.findMany({
    where: { doctorId: user.id },
    include: { patient: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const pendingCount = reports.filter((r) => r.status === 'PENDING').length

  return NextResponse.json({
    pendingCount,
    reports: reports.map((r) => ({
      id: r.id,
      fileName: r.fileName,
      status: r.status,
      feedback: r.feedback,
      createdAt: r.createdAt,
      reviewedAt: r.reviewedAt,
      analysis: JSON.parse(r.analysisJson),
      patient: r.patient,
    })),
  })
}
