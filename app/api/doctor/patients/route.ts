import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'DOCTOR') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  const patients = await prisma.user.findMany({
    where: { doctorId: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      _count: { select: { reportsAsPatient: true } },
    },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json({
    patients: patients.map((p) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      connectedSince: p.createdAt,
      reportCount: p._count.reportsAsPatient,
    })),
  })
}
