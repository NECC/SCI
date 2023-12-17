"use client";

import Nav from "@components/Nav";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";


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
      <Nav />
      <div className="bg-[url('/banner.png')] bg-no-repeat bg-cover h-[600px] w-full flex justify-center ">
        <div className="w-4/5 flex items-center relative">
          <div className="w-6/12 flex flex-col gap-4">
            <h1 className="text-white text-6xl font-extrabold leading-tight">SEMANA DA CIÊNCIA E INOVAÇÃO</h1>
            <p className='text-white text-xl'>14 - 15 MARÇO</p>
            <div className="mt-4">
              <Link
                href="/"
                className='bg-white font-monteserrat text-black py-2 px-4 rounded-md text-sm font-medium leading-5 hover:text-gray-600'>
                EVENTOS
              </Link>
            </div>
            <div className='absolute bottom-4 right-0 w-[500px] h-[500px] bg-black'>
              <div className="relative">
                <div className="p-5 bg-yellow-400 w-2 rounded-full absolute left-1/2 -translate-x-1/2 z-10"></div>
                <div className="p-2 w-40 bg-white rounded-lg absolute -rotate-[40deg] translate-y-[70px] translate-x-[95px] z-10"></div>
                <div className="p-2 w-40 bg-white rounded-lg absolute rotate-[40deg]  translate-y-[70px] -translate-x-[95px] right-0 z-10"></div>
                <div className="p-5 bg-yellow-400 w-2 rounded-full absolute  translate-x-[85px] translate-y-[120px] z-0"></div>
                <div className="p-5 bg-yellow-400 w-2 rounded-full absolute  -translate-x-[85px] translate-y-[120px] z-0 right-0"></div>
              </div>

            </div>

          </div>


        </div>
      </div>
    </main>
  );
}
