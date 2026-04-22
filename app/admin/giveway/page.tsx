"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import { UsersGetResponse } from "@app/api/users/route";
import axios from "axios";
import {
  Button,
  Spinner,
  Card,
  CardBody,
  User,
  Chip,
} from "@nextui-org/react";
import { FiArrowLeft, FiAward, FiZap } from "react-icons/fi";
import confetti from "canvas-confetti";

export default function SponsorSpinWheel() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<any>(null);
  
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });

  const contestants = useMemo(() => {
    return users.filter((u) => u.sponsor_badge === true);
  }, [users]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get<UsersGetResponse>("/api/users");
      if (data.response === "success") setUsers(data.users);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch users", error);
      setLoading(false);
    }
  };

  const spinTheWheel = () => {
    if (isSpinning || contestants.length === 0) return;
    setIsSpinning(true);
    setWinner(null);

    const segmentSize = 360 / contestants.length;
    const randomIndex = Math.floor(Math.random() * contestants.length);
    const extraSpins = 8 * 360; // More spins for a more dramatic full-screen effect
    const finalRotation = rotation + extraSpins + (360 - (randomIndex * segmentSize));
    
    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const win = contestants[randomIndex];
      setWinner(win);
      confetti({
        particleCount: 250,
        spread: 100,
        origin: { y: 0.5 },
        //scale: 1.2
      });
    }, 5000);
  };

  if (status === "loading" || loading) {
    return (
      <div className="bg-[#0f172a] h-screen w-screen flex items-center justify-center">
        <Spinner color="primary" size="lg" label="Loading Sponsors..." />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-black h-screen w-screen overflow-hidden relative flex flex-col">
      
      {/* Absolute Header - Floating so it doesn't push the wheel down */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
        <Button isIconOnly variant="flat" onClick={() => router.back()} className="text-white bg-white/10 backdrop-blur-md">
          <FiArrowLeft size={24} />
        </Button>
        <div className="text-right">
          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tighter flex items-center gap-2 justify-end">
            <FiAward className="text-yellow-400" /> SPONSOR RAFFLE
          </h1>
          <p className="text-blue-300/60 font-bold uppercase text-xs tracking-widest">{contestants.length} Eligible</p>
        </div>
      </div>

      {/* Main Stage - Centered using flex-grow */}
      <div className="flex-grow flex items-center justify-center relative px-4">
        
        {/* The Wheel Stage */}
        <div className="relative flex flex-col items-center justify-center">
          
          {/* Indicator (Top) */}
          <div className="absolute top-[-20px] z-30 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">
            <div className="w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-t-[50px] border-t-current" />
          </div>

          {/* Visual Wheel - Dynamic Sizing: 80% of the smallest screen dimension */}
          <div 
            className="relative w-[80vw] h-[80vw] max-w-[75vh] max-h-[75vh] rounded-full border-[12px] border-white/10 shadow-[0_0_100px_rgba(59,130,246,0.2)] overflow-hidden transition-transform duration-[5000ms] cubic-bezier(0.15, 0, 0.15, 1)"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              background: contestants.length > 0 
                ? `conic-gradient(${contestants.map((_, i) => 
                    `${i % 2 === 0 ? '#1e293b' : '#3b82f6'} ${i * (360/contestants.length)}deg ${(i+1) * (360/contestants.length)}deg`
                  ).join(', ')})`
                : '#1e293b'
            }}
          >
            {contestants.map((u, i) => (
              <div
                key={u.id}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold origin-left"
                style={{ 
                    transform: `rotate(${i * (360 / contestants.length) + (360 / contestants.length / 2)}deg)`,
                    width: '45%' // Keeps text away from the center
                }}
              >
                <div className="text-right pr-4 md:pr-10">
                    <span className="text-[1.2vw] md:text-[1.5vh] uppercase tracking-wide">
                        {u.name.split(' ')[0]}
                    </span>
                </div>
              </div>
            ))}
          </div>

          {/* Spin Button - Floating over the wheel center or bottom */}
          <div className="absolute z-40">
             <Button
                size="lg"
                color="primary"
                variant="shadow"
                onClick={spinTheWheel}
                isLoading={isSpinning}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white/20 text-xl font-black shadow-2xl bg-blue-600 hover:bg-blue-500 transition-all scale-100 hover:scale-110 active:scale-95"
              >
                {isSpinning ? "" : "SPIN"}
              </Button>
          </div>
        </div>
      </div>

      {/* Winner Overlay - Full screen blur when someone wins */}
      {winner && !isSpinning && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md animate-appearance-in p-6">
          <Card className="w-full max-w-lg bg-gradient-to-b from-slate-800 to-slate-950 border-2 border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.3)]">
            <CardBody className="p-12 flex flex-col items-center gap-6 text-center">
              <Chip color="warning" variant="shadow" className="px-6 py-4 text-lg font-bold animate-bounce">
                🎉 WINNER FOUND!
              </Chip>
              <User
                name={winner.name}
                description={winner.email}
                avatarProps={{
                  src: winner.image,
                  className: "w-32 h-32 text-large ring-4 ring-yellow-400 mb-4"
                }}
                classNames={{
                  name: "text-4xl font-black text-white",
                  description: "text-blue-200 text-xl"
                }}
              />
              <Button 
                variant="bordered" 
                className="mt-4 text-white border-white/20"
                onClick={() => setWinner(null)}
              >
                Close
              </Button>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}