"use client"
import useSWR, { Fetcher } from "swr";
import { LineDots } from "@components/LineDots"
import LeaderBoardCards from "@components/LeaderBoardCards"
import { useMemo } from "react"
import { Spinner } from "@nextui-org/react"
import { useSession } from "next-auth/react";
import axios from "axios";

interface UsersApiResponse {
  users: {
    id: string;
    name: string;
    points: number;
    role: string;
  }[];
}

const fetcher: Fetcher<UsersApiResponse, string> = async (url: string) => {
  const res = await axios.get<UsersApiResponse>(url);
  return res.data;
};

export default function LeaderBoard() {
  const { data, isLoading } = useSWR('/api/users', fetcher, {
    refreshInterval: 3600000,
    revalidateOnFocus: false
  })

  const { data: session } = useSession({ required: false })

  const users = useMemo(() => {
    return data?.users
      ?.filter((u: any) => u.role === "USER")
      // map filtra só as informações essenciais
      .map((u: any) =>({
        id : u.id,
        name : u.name,
        points : u.points,
        role : u.role
      }))
      .sort((a: any, b: any) => b.points - a.points) || []
  }, [data])  

  const currentUserStats = useMemo(() => {
    if (!session?.user || users.length === 0) return null;

    const index = users.findIndex((u: any) => u.id === session.user.id);
    if (index === -1) return null;

    return {
      rank: index + 1,
      name: session.user.name,
      points: users[index].points,
      role: session.user.role
    };
  }, [session, users]);

  if (isLoading) return <Spinner />

  return (
    <div className="h-[96vh] flex flex-col bg-gradient-to-l from-custom-blue-3 to-custom-blue-1">
      <div className="pl-3 py-7 w-full justify-start overflow-visible flex flex-row bg-custombutton text-white font-extrabold border-l-2">
        <span className="flex items-center"><LineDots /></span>
        <p className="md:text-5xl text-4xl leading-5">LEADERBOARD</p>
      </div>

      <div className="m-12 flex justify-center items-end">
        <div className={`w-32 h-32 z-10 bg-zinc-400 rounded-2xl shadow-lg -mt-0 -mr-2 -ml-2 hover:bg-yellow-200 hover:shadow-xl transition-all duration-300 ease-in-out ${users.length < 2 ? "hidden" : ""}`}>
          <div className="relative -top-6 flex justify-center">
            <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-xl font-bold border-2 border-yellow-400">2º</div>
          </div>
          <div className="text-center -mt-2">
            <h2 className="font-bold text-lg">{users[1]?.name}</h2>
            <p className="text-gray-500">{users[1]?.points}</p>
          </div>
        </div>

        <div className={`w-32 h-44 z-20 bg-yellow-300 rounded-t-2xl shadow-lg -mt-4 relative hover:bg-yellow-400 hover:shadow-xl transition-all duration-300 ease-in-out ${users.length < 1 ? "hidden" : ""}`}>
          <div className="relative -top-6 flex justify-center">
            <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-xl font-bold border-2 border-yellow-400">1º</div>
          </div>
          <div className="text-center -mt-2">
            <h2 className="font-bold text-lg">{users[0]?.name}</h2>
            <p className="text-gray-500">{users[0]?.points}</p>
          </div>
        </div>

        <div className={`w-32 h-38 z-10 bg-gray-300 rounded-2xl shadow-lg -mt-0 -mr-2 -ml-2 hover:bg-yellow-200 hover:shadow-xl transition-all duration-300 ease-in-out ${users.length < 3 ? "hidden" : ""}`}>
          <div className="relative -top-6 flex justify-center">
            <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-xl font-bold border-2 border-yellow-400">3º</div>
          </div>
          <div className="text-center -mt-2">
            <h2 className="font-bold text-lg">{users[2]?.name}</h2>
            <p className="text-gray-500">{users[2]?.points}</p>
          </div>
        </div>
      </div>

      <div className="flex grow flex-col mx-8 mt-8 overflow-y-scroll">
        <p className="flex-none text-white md:text-5xl text-4xl font-poppins font-bold pt-0 pb-5 p-10 mt-2 flex justify-center">
          Global Score
        </p>
        <div className="flex-1">
          <LeaderBoardCards
            players={users}
            userId={session?.user?.id || ""}
          />
        </div>
      </div>

      {currentUserStats && currentUserStats.role === "USER" && (
        <div className="relative sticky bottom-0 w-full bg-gradient-to-l rounded-t-2xl to-custom-blue-2 from-custom-blue-2 pt-4 pb-8 hover:shadow-md hover:scale-[1.02] transition-all duration-200">
          <div className="max-w-md mx-auto px-4 space-y-4">
            <div className="bg-white rounded-xl py-2 cursor-pointer px-6 flex justify-between items-center shadow-lg m-5">
              <div className="flex items-center gap-2">
                <span className="text-black font-semibold text-lg">{currentUserStats.rank}</span>
                <span className="text-black font-semibold text-lg">{currentUserStats.name}</span>
              </div>
              <span className="text-black font-semibold text-lg">{currentUserStats.points}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}