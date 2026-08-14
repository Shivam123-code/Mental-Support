// POST   /api/circles/[id]/join  — take a place
// DELETE /api/circles/[id]/join  — give it back

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';

async function caller(request: NextRequest) {
  const h = request.headers.get('authorization');
  if (!h?.startsWith('Bearer ')) return null;
  return getUserFromToken(h.substring(7));
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await caller(request);
    if (!user) return unauthorizedResponse();
    const { id } = await params;

    const circle = await prisma.supportCircle.findUnique({
      where: { id },
      select: { id: true, capacity: true, isActive: true, title: true, professionalId: true },
    });
    if (!circle) return errorResponse('Circle not found', 404);
    if (!circle.isActive) return errorResponse('This circle is closed', 409);

    try {
      // Count and insert inside one transaction. Checking the count first and
      // inserting after would let two simultaneous joins both see the last free
      // place and take it, putting the circle over capacity.
      const member = await prisma.$transaction(async (tx) => {
        const taken = await tx.circleMember.count({ where: { circleId: id } });
        if (taken >= circle.capacity) throw new Error('CIRCLE_FULL');
        return tx.circleMember.create({ data: { circleId: id, userId: user.id } });
      });

      const joined = await prisma.circleMember.count({ where: { circleId: id } });
      return successResponse(
        { joinedAt: member.joinedAt, joined, capacity: circle.capacity },
        `You have joined ${circle.title}`
      );
    } catch (err: any) {
      if (err?.message === 'CIRCLE_FULL') return errorResponse('This circle is full', 409);
      // The unique pair on (circleId, userId) is what makes a double-tap safe.
      if (err?.code === 'P2002') return errorResponse('You have already joined this circle', 409);
      throw err;
    }
  } catch (error: any) {
    console.error('Circle join error:', error);
    return errorResponse('Failed to join: ' + (error?.message ?? 'Unknown'), 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await caller(request);
    if (!user) return unauthorizedResponse();
    const { id } = await params;

    // Scoped to this member's own row, so nobody can remove anyone else.
    const removed = await prisma.circleMember.deleteMany({
      where: { circleId: id, userId: user.id },
    });
    if (removed.count === 0) return errorResponse('You are not in this circle', 404);

    const joined = await prisma.circleMember.count({ where: { circleId: id } });
    return successResponse({ joined }, 'You have left the circle');
  } catch (error: any) {
    console.error('Circle leave error:', error);
    return errorResponse('Failed to leave: ' + (error?.message ?? 'Unknown'), 500);
  }
}
