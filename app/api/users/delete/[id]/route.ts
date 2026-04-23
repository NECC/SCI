import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { response: 'error', error: "You don't have permission to delete a user" },
      { status: 403 }
    );
  }

  try {
    const userId = id;

    // Delete related records first (cascade handled by schema, but explicit for safety)
    await prisma.enrollments.deleteMany({
      where: { userId: userId }
    });

    // Delete accounts and sessions associated with user
    await prisma.account.deleteMany({
      where: { userId: userId }
    });

    await prisma.session.deleteMany({
      where: { userId: userId }
    });

    // Delete the user
    await prisma.user.delete({
      where: { id: userId }
    });

    return NextResponse.json({ 
      response: 'success', 
      message: 'User and related data deleted successfully' 
    });

  } catch (error: any) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { response: 'error', error: error.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}
