"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Spinner } from '@nextui-org/react';
import { FiUsers, FiAward, FiBarChart, FiTrendingUp } from 'react-icons/fi';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from '@nextui-org/react';

export default function RankingPage() {
  const [user, setUser] = useState<{
    user: { email: string; role: string } | null;
    loaded: boolean;
  }>({ user: null, loaded: false });
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [rankings, setRankings] = useState<any[]>([]);

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/api/auth/signin');
    },
  });

  useEffect(() => {
    if (session) {
      setUser({ user: session.user, loaded: true });
      setTimeout(() => {
        setRankings([
          { rank: 1, userName: 'John Doe', points: 1250, activities: 8 },
          { rank: 2, userName: 'Jane Smith', points: 1150, activities: 7 },
          { rank: 3, userName: 'Bob Johnson', points: 980, activities: 6 },
        ]);
        setLoading(false);
      }, 1000);
    }
  }, [session]);

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
    { key: 'rank', label: 'RANK' },
    { key: 'userName', label: 'USER' },
    { key: 'points', label: 'POINTS' },
    { key: 'activities', label: 'ACTIVITIES' },
    { key: 'actions', label: '' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-2xl">
          Leaderboard & Ranking
        </h1>
        <p className="text-white/70 text-xl">View and manage user rankings and leaderboards</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="admin-gradient-card admin-stats-card bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border-yellow-400/30">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-semibold uppercase tracking-wide">#1 Rank</p>
                <p className="text-4xl font-bold text-white mt-2">{rankings[0]?.userName || 'TBD'}</p>
              </div>
              <FiAward className="text-yellow-300 text-5xl" />
            </div>
          </CardBody>
        </Card>

        <Card className="admin-gradient-card admin-stats-card from-blue-500/20 to-indigo-600/20 border-blue-400/30">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-semibold uppercase tracking-wide">Total Users</p>
                <p className="text-4xl font-bold text-white mt-2">{rankings.length}</p>
              </div>
              <FiUsers className="text-blue-300 text-5xl" />
            </div>
          </CardBody>
        </Card>

        <Card className="admin-gradient-card admin-stats-card from-emerald-500/20 to-green-600/20 border-emerald-400/30">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-semibold uppercase tracking-wide">Avg Points</p>
                <p className="text-4xl font-bold text-white mt-2">950</p>
              </div>
              <FiBarChart className="text-emerald-300 text-5xl" />
            </div>
          </CardBody>
        </Card>

        <Card className="admin-gradient-card admin-stats-card from-purple-500/20 to-violet-600/20 border-purple-400/30">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-semibold uppercase tracking-wide">Trend</p>
                <p className="text-4xl font-bold text-white mt-2">+12%</p>
              </div>
              <FiTrendingUp className="text-purple-300 text-5xl" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Leaderboard Table */}
      <Card className="admin-gradient-card shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-b border-white/10">
          <h3 className="text-2xl font-bold text-white">Top Rankings</h3>
        </CardHeader>
        <CardBody className="p-0">
          {rankings.length === 0 ? (
            <div className="text-center py-20">
              <FiAward className="mx-auto h-16 w-16 text-yellow-400/30 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No rankings yet</h3>
              <p className="text-white/60">Rankings will appear here as users earn points.</p>
            </div>
          ) : (
            <Table aria-label="Leaderboard">
              <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
              </TableHeader>
              <TableBody items={rankings}>
                {(item) => (
                  <TableRow key={item.rank} className={item.rank === 1 ? "bg-yellow-500/10" : ""}>
                    {(columnKey) => (
                      <TableCell className={item.rank === 1 ? "font-bold text-yellow-400" : ""}>
                        {columnKey === "rank" ? (
                          <span className="text-2xl font-black text-yellow-400">#{item.rank}</span>
                        ) : columnKey === "actions" ? (
                          <Button size="sm" color="warning" variant="light">
                            Adjust Points
                          </Button>
                        ) : (
                          item[columnKey as keyof typeof item]
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
