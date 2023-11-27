"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState({});

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      return redirect("/api/auth/signin");
    },
  });

  useEffect(() => {
    if (session) setUser(session.user);
  }, [session]);

  console.log(user);

  return (
    <main className="">
      <h1 className="text-2xl">Welcome {user.name}</h1>
    </main>
  );
}
