"use client";

import CreateActivity from "@components/admin/CreateActivity";
import GetDataTable from "@components/admin/GetDataTable";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ActivityGetResponse } from "@app/api/activities/route";
import { Card, CardBody, Spinner, Button } from "@nextui-org/react";
import { FiActivity, FiPlus, FiUsers, FiList, FiCheckCircle } from "react-icons/fi";

export default function ActivitiesAdmin() {
  const [user, setUser] = useState<{
    user: { email: string; role: string } | null;
    loaded: boolean;
  }>({ user: null, loaded: false });
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [more, setMore] = useState(true);
  const router = useRouter();

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/api/auth/signin");
    },
  });

  useEffect(() => {
    if (session) {
      setUser({ user: session.user, loaded: true });
    }
  }, [session]);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<ActivityGetResponse>(`/api/activities?skip=${page * 10}&take=10`);
      if (data.activities.length === 0) {
        setMore(false);
      } else {
        setMore(true);
        if (page === 0) {
          setActivities(data.activities);
        } else {
          setActivities((prev) => [...prev, ...data.activities]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch activities", err);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    if (user.user?.role === "ADMIN") {
      fetchActivities();
    }
  }, [fetchActivities, user]);

  const handleDeleteActivity = async (id: string) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;
    try {
      await axios.delete(`/api/activities/delete/${id}`);
      setActivities(activities.filter((act) => act.id !== id));
    } catch (err) {
      console.error("Failed to delete activity");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (user.user?.role !== "ADMIN" && user.user?.role !== "STAFF" && user.loaded) {
    router.push("/");
    return null;
  }

  const totalActivities = activities.length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent drop-shadow-lg">Activities Management</h1>
        </div>
        <p className="text-white/70 text-xl">Manage activities, schedules, and capacities</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="admin-gradient-card admin-stats-card bg-gradient-to-r from-emerald-500/20 to-teal-600/20 border-emerald-400/40">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-semibold uppercase tracking-wide">Total Activities</p>
                <p className="text-4xl font-bold text-white mt-2">{totalActivities}</p>
              </div>
              <FiActivity className="text-emerald-300 text-5xl" />
            </div>
          </CardBody>
        </Card>

        <Card className="admin-gradient-card admin-stats-card bg-gradient-to-r from-blue-500/20 to-indigo-600/20 border-blue-400/40">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-semibold uppercase tracking-wide">Upcoming</p>
                <p className="text-4xl font-bold text-white mt-2">12</p>
              </div>
              <FiList className="text-blue-300 text-5xl" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Actions + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Create Form */}
        <Card className="lg:col-span-1 admin-gradient-card border-white/20">
          <CardBody className="p-0">
            <div className="p-6 border-b border-white/10 bg-white/5">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FiPlus className="text-emerald-400" />
                New Activity
              </h3>
            </div>
            <div className="p-6">
              <CreateActivity />
            </div>
          </CardBody>
        </Card>

        {/* Activities Table */}
        <div className="lg:col-span-3">
          <Card className="admin-gradient-card shadow-2xl border-white/10">
            <CardBody className="p-0">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Spinner size="lg" />
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-20">
                  <FiActivity className="mx-auto h-16 w-16 text-white/30 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">No activities yet</h3>
                  <p className="text-white/60 mb-6">Create your first activity to get started.</p>
                  <CreateActivity />
                </div>
              ) : (
                <GetDataTable
                  data={activities}
                  active="activities"
                  page={page}
                  changePage={setPage}
                  more={more}
                  deleteActivities={handleDeleteActivity}
                />
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

