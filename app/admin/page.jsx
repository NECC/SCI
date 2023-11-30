"use client";

import Navbar from "@components/Nav";
import CreateUser from "@components/admin/CreateUser";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Auth() {
  const [user, setUser] = useState({});
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

  if (status == "loading") return <p>Loading...</p>;
  if (user.user?.role != "ADMIN" && user.loaded) router.push("/");

  return (
    <>
      <Navbar />
      <CreateUser />
    </>
  );
}
