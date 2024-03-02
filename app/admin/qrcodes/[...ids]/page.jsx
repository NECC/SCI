"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@nextui-org/react";

export default function QRCodesAdmin({ params: { ids } }) {
  const [user, setUser] = useState({});
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
    const res = await axios.post(`/api/enrollments/attend/qrcode`, {
      userId: ids[1],
      activityId: parseInt(ids[0]),
    });

    if (res.data.response === "error") setError(res.data.error);
    else setSuccess(true);

    setLoading(false);
  };

  if (status == "loading") return <p>Loading...</p>;
  if (user.user?.role != "ADMIN" && user.loaded) router.push("/");

  return (
    <div className="flex justify-center flex-col items-center w-full h-screen">
        {
            success && (
                <div className="bg-green-500 p-4 rounded-md">
                    <h1 className="text-white">User attendance updated successfully</h1>
                </div>
            )
        }
      
      {
            loading && (
                <div className="bg-blue-500 p-4 rounded-md">
                    <h1 className="text-white">Loading...</h1>
                </div>
            )
      }

      {
            error && (
                <div className="bg-red-500 p-4 rounded-md">
                    <h1 className="text-white">{error}</h1>
                </div>
            )
      }

      {
            !loading && !success && !error && (
                <Button
                    onClick={updateUserAttendance}
                    color="primary"
                    size="large"
                    auto
                >
                    Update User Attendance
                </Button>
            )
      }
    </div>
  );
}
