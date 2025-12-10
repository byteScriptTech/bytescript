import { NextRequest, NextResponse } from 'next/server';

import { updateUserRole } from '@/lib/admin';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;
    const { role } = await request.json();

    const success = await updateUserRole(userId, role);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update user role' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    );
  }
}
