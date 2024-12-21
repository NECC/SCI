"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@nextui-org/react";
import { RankingPostResponse } from "@app/api/ranking/route";
import { EnrollmentAttendQRCodePostResponse } from "@app/api/enrollments/attend/qrcode/route";

export default function QRCodesAdmin({
  params: { ids },
}: {
  params: { ids: string[] };
}) {
  const [user, setUser] = useState<{
    user: { email: string; role: string } | null;
    loaded: boolean;
  }>({ user: null, loaded: false });
  const [error, setError] = useState("");
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

  const updateUserAttendance = async () => {
    setLoading(true);
    const res = await axios.post<EnrollmentAttendQRCodePostResponse>(
      `/api/enrollments/attend/qrcode`,
      {
        userId: ids[1],
        activityId: parseInt(ids[0]),
      }
    );

    const res2 = await axios.post<RankingPostResponse>("/api/ranking", {
      id: ids[1],
    });

    if (res.data.response === "error")
      setError(res.data.error || "An error occurred") ??
        setError(res2.data.error);
    else setSuccess(true);

    setLoading(false);
  };

  if (status == "loading") return <p>Loading...</p>;
  if (user.user?.role != "ADMIN" && user.loaded) router.push("/");

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
          onClick={updateUserAttendance}
          color="primary"
          size="lg"
        >
          Update User Attendance
        </Button>
      )}
    </div>
  );
}
