"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import axios from 'axios';

interface Enrollment {
  id: number;
  userId: string;
  activityId: number;
  attended: boolean;
  createdAt: string;
  user?: { name: string; email: string };
  activity?: { title: string; date: string };
}

export default function EnrollmentsPage() {
  const [user, setUser] = useState<{ user: { email: string; role: string } | null; loaded: boolean }>({ user: null, loaded: false });
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/api/auth/signin');
    },
  });

  useEffect(() => {
    if (session) {
      setUser({ user: session.user as any, loaded: true });
      fetchEnrollments();
    }
  }, [session]);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/enrollments');
      setEnrollments((response.data as any).enrollments || []);
    } catch (error) {
      console.error('Failed to fetch enrollments', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (user.user?.role !== 'ADMIN' && user.loaded) {
    router.push('/');
    return null;
  }

  const columns = [
    { key: 'user', label: 'User' },
    { key: 'activity', label: 'Activity' },
    { key: 'attended', label: 'Attended' },
    { key: 'createdAt', label: 'Enrolled' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
          Enrollments
        </h1>
        <p className="text-white/70 text-xl">Manage user enrollments and attendance</p>
      </div>

      <Card className="admin-gradient-card shadow-2xl">
        <CardHeader className="bg-white/5 border-b border-white/10">
          <h3 className="text-xl font-bold text-white">All Enrollments</h3>
        </CardHeader>
        <CardBody className="p-0">
          {enrollments.length === 0 ? (
            <div className="text-center py-20">
              <div className="mx-auto h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                📝
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No enrollments yet</h3>
              <p className="text-white/60">Enrollments will appear here when users sign up for activities.</p>
            </div>
          ) : (
            <Table aria-label="Enrollments table">
              <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
              </TableHeader>
              <TableBody items={enrollments}>
                {(item) => (
                  <TableRow key={item.id}>
                    {(columnKey) => (
                      <TableCell>
                        {columnKey === 'user' ? (
                          item.user?.name || item.user?.email || 'Unknown'
                        ) : columnKey === 'activity' ? (
                          item.activity?.title || 'Unknown'
                        ) : columnKey === 'attended' ? (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.attended 
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400/50 border' 
                              : 'bg-orange-500/20 text-orange-400 border-orange-400/50 border'
                          }`}>
                            {item.attended ? 'Attended' : 'Pending'}
                          </span>
                        ) : (
                          new Date(item.createdAt).toLocaleDateString()
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
