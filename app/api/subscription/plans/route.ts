import { prisma } from '@/db'

// Public endpoint — returns active plans for the nominees form
export async function GET() {
  const plans = await prisma.subscriptionPlan.findMany({
    where: { isActive: true },
    orderBy: { amount: 'asc' },
    select: { id: true, name: true, description: true, amount: true, intervalCount: true, durationMonths: true },
  })
  return Response.json(plans)
}
