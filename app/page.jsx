"use client";

import Navbar from "@components/Nav";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * @session {
 *  email:"pedroaugennes@gmail.com",
 *  exp: 1703690045,
 *  iat: 1701098045,
 *  id: "de48905f-44e5-482c-80e4-533de1f160f8",
 *  jti: "56ea8bf1-74b9-4da1-8dbc-a3080ab849dc",
 *  name:"pedro",
 *  points:0,
 *  role:"USER",
 *  sub:"de48905f-44e5-482c-80e4-533de1f160f8"
 * }
 */

export default function Home() {
  const [user, setUser] = useState({});

  const { data: session } = useSession({
    required: false,
  });

  useEffect(() => {
    if (session) setUser(session.user);
  }, [session]);

  // console.log(user);

  return (
    <main className="">
      <Navbar />
      <h1 className="text-2xl">Welcome {user.name}</h1>
    </main>
  );
}
