"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function RankingId({ params: { id } }) {
    const [user, setUser] = useState({});
    const [isIncremented, setIsIncremented] = useState(false);
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


    const increment = async () => {
        const res = await axios.post("/api/ranking", { id });

        if (res.data.response == "success") {
            setIsIncremented(true);
        } else {
            setError(res.data.response);
        }
    }

    if (status == "loading") return <p>Loading...</p>;
    if (user.user?.role != "ADMIN" && user.loaded) router.push("/");  

    return (
        <div className="flex justify-center items-center w-full h-screen">
            {
                isIncremented ? (
                    <div className="bg-green-500 p-4 rounded-md w-[300px] h-[250px]">
                        <h1 className="text-white">Incremented</h1>
                    </div>
                ) : (
                    <button onClick={increment} className="bg-blue-500 text-white p-4 rounded-md w-[300px] h-[250px]">Increment</button>       
                )
            }
            {
                error && (
                    <div className="bg-red-500 p-4 rounded-md w-[300px] h-[250px]">
                        <h1 className="text-white">{error}</h1>
                    </div>
                )
            }
        </div>
    );
}
