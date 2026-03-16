"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@nextui-org/react";
import { RankingPostResponse } from "@app/api/ranking/route";
import { EnrollmentAttendQRCodePostResponse } from "@app/api/enrollments/attend/qrcode/route";
import { UserUpdateResponse } from "@app/api/users/[id]/route";
import { ActivityPointsResponse } from "@app/api/activities/points/[id]/route";
// search params are read from window in an effect to avoid CSR bailout warning
// (useSearchParams triggers a suspense requirement during prerender)

export default function QRCodesAdmin() {
  const [userParam, setUserParam] = useState<string | null>(null);
  const [activityParam, setActivityParam] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setUserParam(params.get("userId"));
      setActivityParam(params.get("activityId"));
    }
  }, []);
  const [user, setUser] = useState<{
    user: { email: string; role: string } | null;
    loaded: boolean;
  }>({ user: null, loaded: false });
  const [error, setError] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  //   console.log(ids);
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

  const updateUserAttendanceAndPoints = async () => {
    setLoading(true);
    if (!activityParam) {
      setError("Activity ID is missing");
      setLoading(false);
      return;
    }
    const res = await axios.post<EnrollmentAttendQRCodePostResponse>(
      `/api/enrollments/attend/qrcode`,
      {
        userId: userParam ?? undefined,
        activityId: parseInt(activityParam),
      }
    );

    const res2 = await axios.post<RankingPostResponse>("/api/ranking", {
      id: userParam,
    });

    const res3 = await axios.put<ActivityPointsResponse>(`api/activities/${activityParam}`);

    if (res3.data.response !== "error"){
      const res4 = await axios.put<UserUpdateResponse>(
        `/api/users/${activityParam}`,{points: res3.data.points})
      }

    if (res.data.response === "error")
      setError(res.data.error || "An error occurred") ??
        setError(res2.data.error);
    else setSuccess(true);

    setLoading(false);
  };

  if (status == "loading") return <p>Loading...</p>;
  if (user.user?.role == "USER" && user.loaded) router.push("/");

  return (
    <div className="flex justify-center flex-col items-center w-full h-screen">
      {success && (
        <div className="bg-green-500 p-4 rounded-md">
          <h1 className="text-white">User attendance updated successfully</h1>
        </div>
      )}

      {loading && (
        <div className="bg-blue-500 p-4 rounded-md">
          <h1 className="text-white">Loading...</h1>
        </div>
      )}

      {error && (
        <div className="bg-red-500 p-4 rounded-md">
          <h1 className="text-white">{error}</h1>
        </div>
      )}

      {!loading && !success && !error && (
        <Button
          onClick={updateUserAttendanceAndPoints}
          color="primary"
          size="lg"
        >
          Update User Attendance
        </Button>
      )}
    </div>
  );
}
