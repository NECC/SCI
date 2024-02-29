"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@nextui-org/react";

export default function QRCodesAdmin({ params: { ids } }) {
  const [user, setUser] = useState({});
  const [error, setError] = useState("");
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
    const res = await axios.post(`/api/enrollments/attend`, {
      userId: ids[1],
      activityId: parseInt(ids[0]),
    });

    if (res.data.response === "error") setError(res.data.error);
  };

  if (status == "loading") return <p>Loading...</p>;
  if (user.user?.role != "ADMIN" && user.loaded) router.push("/");

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <Button
        color="danger"
        variant="solid"
        size="lg"
        onClick={updateUserAttendance}
      >
        Update User Attendance
      </Button>

      {error && (
        <div className="bg-red-500 p-4 rounded-md w-[300px] h-[250px]">
          <h1 className="text-white">{error}</h1>
        </div>
      )}
    </div>
  );
}
