"use client";

import Navbar from "@components/Nav";
import CreateActivity from "@components/admin/CreateActivity";
import CreateUser from "@components/admin/CreateUser";
import GetDataTable from "@components/admin/GetDataTable";
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
      <div className="flex justify-start items-start gap-3 my-4 mx-12">
        <CreateActivity />
        <CreateUser />
      </div>
      <GetDataTable />
    </>
  );
}
