"use client";

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardBody, CardHeader, Spinner, Button } from '@nextui-org/react';
import { Scanner } from '@yudiel/react-qr-scanner';
import axios from 'axios';
import { ActivityGetResponseById } from "@/app/api/activities/[id]/route";
import type { ActivityEnrolleesResponse } from "@/app/api/activities/[id]/enrolled/route";



interface Enrollment {
  id: number;
  userId: string;
  userName: string;
  attended: boolean;
  createdAt: string;
}

export default function ActivityQRScanner() {
  const [user, setUser] = useState<{ user: { email: string; role: string } | null; loaded: boolean }>({ user: null, loaded: false });
  const router = useRouter();
  const params = useParams();
  const [activityId, setActivityId] = useState<number | null>(null);
  const [activity, setActivity] = useState<ActivityGetResponseById["activity"][0] | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [isHttps, setIsHttps] = useState(false);

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/api/auth/signin');
    }
  });

  useEffect(() => {
    if (session?.user) {
      setUser({ user: session.user as any, loaded: true });
    }
  }, [session]);

  useEffect(() => {
    const id = parseInt(params.activityId as string);
    if (id && !isNaN(id)) {
      setActivityId(id);
      fetchActivity(id);
      fetchEnrollments(id);
    }
  }, [params.activityId]);

  const fetchActivity = useCallback(async (id: number) => {
    try {
      const response = await axios.get<ActivityGetResponseById>(`/api/activities/${id}`);
      setActivity(response.data.activity[0] ?? null);
    } catch (err) {
      console.error('Failed to fetch activity', err);
    }
  }, []);


  const fetchEnrollments = useCallback(async (id: number) => {
    try {
      const response = await axios.get<ActivityEnrolleesResponse>(`/api/activities/${id}/enrolled`);
      // API returns userNames, but UI expects Enrollment[]. Convert minimally for now
      setEnrollments(response.data.userNames?.map((userName, index) => ({
        id: index + 1,
        userId: `user_${index + 1}`,
        userName,
        attended: false, // API doesn't provide attended status
        createdAt: new Date().toISOString()
      })) || []);
    } catch (err) {
      console.error('Failed to fetch enrollments', err);
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  }, []);


  const startScanner = () => {
    setScanning(true);
    setScannerError(null);
  };

  const stopScanner = () => {
    setScanning(false);
    setScannerError(null);
  };

  const handleScan = async (qrCode: string) => {
    if (!activityId) return;
    try {
      const response = await axios.post<{ response: string; awardedPoints?: number; message?: string; error?: string }>('/api/enrollments/attend/qrcode', { 
        code: qrCode, 
        activityId: activityId!
      });
      if (response.data.response === 'success') {
        fetchEnrollments(activityId);
        const awarded = response.data.awardedPoints || 0;
        const msg = response.data.message || (awarded > 0 ? `Check-in successful! Awarded ${awarded} points.` : 'Check-in successful!');
        alert(msg);
      } else {
        alert(response.data.error || 'Invalid QR code');
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Scan failed');
    }
  };


  useEffect(() => {
    setIsHttps(window.location.protocol === 'https:');
  }, []);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (user.user?.role !== 'ADMIN' && user.user?.role !== 'STAFF' && user.loaded) {
    router.push('/admin/activities');
    return null;
  }

  if (!activityId || !activity) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl font-bold text-white mb-2">Activity not found</h3>
        <Button onClick={() => router.push('/admin/activities')}>Back to Activities</Button>
      </div>
    );
  }

  const attendedCount = enrollments.filter(e => e.attended).length;
  const totalEnrollments = enrollments.length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="space-y-4">
        <Button onClick={() => router.back()} className="text-white/70 hover:text-white">
          ← Back to Activities
        </Button>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent drop-shadow-lg">
          QR Scanner - {activity.title}
        </h1>
        <p className="text-white/70 text-lg">Scan attendee QR codes for check-in. Activity ID: {activityId}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="admin-gradient-card bg-gradient-to-r from-emerald-500/20 to-teal-600/20">
          <CardBody className="text-center p-6">
            <p className="text-emerald-100 text-sm uppercase tracking-wide">Total Enrollments</p>
            <p className="text-4xl font-bold text-white mt-2">{totalEnrollments}</p>
          </CardBody>
        </Card>
        <Card className="admin-gradient-card bg-gradient-to-r from-blue-500/20 to-indigo-600/20">
          <CardBody className="text-center p-6">
            <p className="text-blue-100 text-sm uppercase tracking-wide">Attended</p>
            <p className="text-4xl font-bold text-white mt-2">{attendedCount}</p>
          </CardBody>
        </Card>
        <Card className="admin-gradient-card bg-gradient-to-r from-orange-500/20 to-red-600/20">
          <CardBody className="text-center p-6">
            <p className="text-orange-100 text-sm uppercase tracking-wide">Pending</p>
            <p className="text-4xl font-bold text-white mt-2">{totalEnrollments - attendedCount}</p>
          </CardBody>
        </Card>
      </div>

      <Card className="admin-gradient-card">
        <CardHeader>
          <h3 className="text-2xl font-bold text-white">QR Scanner</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex gap-4">
            {!scanning ? (
              <Button 
                onClick={startScanner} 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-6 px-8 text-lg"
                size="lg"
              >
                Start Scanner
              </Button>
            ) : (
              <Button 
                onClick={stopScanner} 
                className="bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold py-6 px-8 text-lg"
                size="lg"
              >
                Stop Scanner
              </Button>
            )}
            <Button onClick={() => fetchEnrollments(activityId!)} color="primary" variant="flat">
              Refresh List
            </Button>
          </div>

          {scanning && (
            <>
              <div className="bg-black rounded-xl overflow-hidden shadow-2xl max-w-md mx-auto">
                <Scanner 
                  onScan={(detectedCodes) => {
                    const code = detectedCodes[0]?.rawValue;
                    if (code) handleScan(code);
                  }}
                  onError={(error: unknown) => {
                    console.error('Scanner error:', error);
                    setScannerError('Scan error: ' + (error as Error)?.message || 'Unknown');
                  }}
                  constraints={{
                    facingMode: { ideal: 'environment' }
                  }}
                />
              </div>
              {scannerError && (
                <div className="bg-red-500/20 border border-red-400 text-red-100 p-4 rounded-lg mt-4">
                  {scannerError}
                </div>
              )}
              {!isHttps && (
                <div className="bg-yellow-500/20 border border-yellow-400 text-yellow-100 p-4 rounded-lg mt-4">
                  ⚠️ Camera may not work over HTTP. Use HTTPS (localhost ok, Vercel required).
                </div>
              )}
              <div className="text-center text-white/70 text-sm mt-4">
                Point QR code at center scanner area
              </div>
            </>
          )}
        </CardBody>
      </Card>

      <Card className="admin-gradient-card">
        <CardHeader>
          <h3 className="text-xl font-bold text-white">Recent Enrollments ({enrollments.length})</h3>
        </CardHeader>
        <CardBody>
          {enrollments.slice(0, 10).map((enrollment) => (
            <div key={enrollment.id} className={`p-4 rounded-lg mb-2 flex items-center justify-between ${
              enrollment.attended ? 'bg-emerald-500/20 border-emerald-400/30' : 'bg-gray-800/50 border-gray-600/30'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${enrollment.attended ? 'bg-emerald-400' : 'bg-orange-400'}`}></div>
                <div>
                  <p className="font-semibold text-white">{enrollment.userName}</p>
                  <p className="text-white/60 text-sm">ID: {enrollment.userId.slice(-8)}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                enrollment.attended ? 'bg-emerald-500/20 text-emerald-200' : 'bg-orange-500/20 text-orange-200'
              }`}>
                {enrollment.attended ? 'CHECKED IN' : 'PENDING'}
              </span>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
