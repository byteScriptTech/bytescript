import { NextResponse } from 'next/server';

import { getAdminUsers } from '@/lib/admin';

export async function GET() {
  try {
    console.log('Fetching admin users...');
    const users = await getAdminUsers();
    console.log('Fetched users:', users);
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error in GET /api/admin/users:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    });
    return NextResponse.json(
      {
        error: 'Failed to fetch users',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
