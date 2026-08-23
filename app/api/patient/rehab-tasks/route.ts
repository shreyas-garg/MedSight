import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'PATIENT') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  const tasks = await prisma.rehabTask.findMany({
    where: { patientId: user.id, active: true },
    include: { completions: { orderBy: { date: 'desc' }, take: 7 } },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json({
    tasks: tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      recentCompletions: t.completions.map((c) => c.date),
    })),
  })
}
