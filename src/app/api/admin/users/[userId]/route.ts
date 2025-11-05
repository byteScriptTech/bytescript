import { NextResponse } from 'next/server';

import { updateUserRole } from '@/lib/admin';

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { role } = await request.json();
    const success = await updateUserRole(params.userId, role);

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
