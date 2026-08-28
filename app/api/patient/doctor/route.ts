import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'PATIENT') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  const { doctorId } = await request.json()
  if (!doctorId) {
    return NextResponse.json({ error: 'doctorId is required' }, { status: 400 })
  }

  const doctor = await prisma.user.findUnique({ where: { id: doctorId } })
  if (!doctor || doctor.role !== 'DOCTOR') {
    return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { doctorId },
  })

  // Reports uploaded before this patient had a doctor connected were saved
  // with no doctor attached — route those into the newly connected doctor's queue.
  await prisma.report.updateMany({
    where: { patientId: user.id, doctorId: null },
    data: { doctorId },
  })

  return NextResponse.json({ success: true, doctor: { id: doctor.id, name: doctor.name } })
}
