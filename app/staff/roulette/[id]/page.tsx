"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { UserPutRouletteResponse } from "@app/api/users/roulette/[id]/spend/route";

export default function RouletteId({
  params: { id },
}: {
  params: { id: string };
}) {
  // const [pdf, setPdf] = useState(false);
  const [user, setUser] = useState<{
    user: { email: string; role: string; } | null;
    loaded: boolean;
  }>({ user: null, loaded: false });
  const [hasTicket, setHasTicket] = useState(false);
  const [error, setError] = useState("");
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

  const spend = async () => {
    const res = await axios.post<UserPutRouletteResponse>(`/api/users/roulette/${id}/spend`);

    if (res.data.response == "success") {
      setHasTicket(true);
    } else {
      setError(res.data.response);
    }
  };

  if (status == "loading") return <p>Loading...</p>;
  if ((user.user?.role == "USER") && user.loaded) router.push("/");

  return (
    <div className="flex justify-center items-center w-full h-screen">
      {!hasTicket ? (
        <div className="bg-green-500 p-4 rounded-md">
          <p className="text-white">Ticket Spent</p>
        </div>
      ) : (
        <button
          onClick={spend}
          className="bg-blue-500 hover:bg-blue-700 text-white p-4 rounded-md "
        >
          Spend Ticket
        </button>
      )}
      {error && (
        <div className="bg-red-500 p-4 rounded-md w-[300px] h-[250px]">
          <h1 className="text-white">{error}</h1>
        </div>
      )}
    </div>
  );
}