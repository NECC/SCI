"use client";
import React, { useState } from "react";
import Image from "next/image";

export default function Team() {
  const [visibleTeam, setVisibleTeam] = useState<string>("necaum"); // Default team

  const handleTeamChange = (teamId: string) => {
    setVisibleTeam(teamId);
  };

  return (
    <div className="h-screen bg-gradient-to-l from-custom-blue-3 to-custom-blue-1">
      <h1 className="text-center text-white md:text-5xl text-4xl font-poppins font-bold pt-8">
        Núcleos Organizadores
      </h1>
      <div className="flex justify-center items-center gap-[30px] flex-wrap max-w-[1500px] mx-auto my-10 pt-5">
        <button
          onClick={() => handleTeamChange("nebaum")}
          className="px-0 py-0 rounded-full transition-all duration-200 hover:bg-black/5 bg-transparent"
        >
          <Image src="/nucleos/nebaum.svg" alt="NEBAUM" width={150} height={150} />
        </button>
        <button
          onClick={() => handleTeamChange("necc")}
          className="px-0 py-0 rounded-full transition-all duration-200 hover:bg-black/5 bg-transparent"
        >
          <Image src="/nucleos/necc.svg" alt="NECC" width={150} height={150} />
        </button>
        <button
          onClick={() => handleTeamChange("necaum")}
          className="px-0 py-0 rounded-full transition-all duration-200 hover:bg-black/5 bg-transparent"
        >
          <Image src="/nucleos/necaum.png" alt="NECAUM" width={150} height={150} />
        </button>
        <button
          onClick={() => handleTeamChange("negum")}
          className="px-0 py-0 rounded-full transition-all duration-200 hover:bg-black/5 bg-transparent"
        >
          <Image src="/nucleos/negum.svg" alt="NEGUM" width={120} height={120} />
        </button>
        <button
          onClick={() => handleTeamChange("nebqum")}
          className="px-0 py-0 rounded-full transition-all duration-200 hover:bg-black/5 bg-transparent"
        >
          <Image src="/nucleos/nebqum.png" alt="NEBQUM" width={150} height={150} />
        </button>
        <button
          onClick={() => handleTeamChange("staff")}
          className="px-0 py-0 rounded-full transition-all duration-200 hover:bg-black/5 bg-transparent"
        >
          <Image src="/nucleos/staff.png" alt="Staff" width={135} height={135} />
        </button>
      </div>
      <div className="bg-gradient-to-b from-black/10 via-black/5 to-transparent shadow-[0_-1px_20px_rgba(0,0,0,0.05)] grow mt-10 px-5 py-[60px] rounded-[40px_40px_0_0]">
        <div
          className={`grid grid-cols-[repeat(4,1fr)] gap-10 max-w-[1000px] mx-auto my-0 ${
            visibleTeam === "nebaum" ? "block" : "hidden"
          }`}
          id="nebaumTeam"
        ></div>
        <div
          className={`grid grid-cols-[repeat(4,1fr)] gap-10 max-w-[1000px] mx-auto my-0 ${
            visibleTeam === "necc" ? "block" : "hidden"
          }`}
          id="neccTeam"
        ></div>
        <div
          className={`grid grid-cols-[repeat(4,1fr)] gap-10 max-w-[1000px] mx-auto my-0 ${
            visibleTeam === "necaum" ? "block" : "hidden"
          }`}
          id="necaumTeam"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-[200px] h-[200px] overflow-hidden mb-5 rounded-[50%]">
              <Image src="" className="w-full h-full object-cover" alt="Hugo Correia" />
            </div>
            <div className="p-[15px]">
              <div className="text-white font-poppins font-bold text-lg mb-2">Hugo Correia</div>
              <div className="text-white font-poppins text-sm leading-[1.4] mb-3">Coordenador</div>
            </div>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-[200px] h-[200px] overflow-hidden mb-5 rounded-[50%]">
              <Image
                src=""
                className="w-full h-full object-cover"
                alt="Carolina Marques Prata"
              />
            </div>
            <div className="p-[15px]">
              <div className="text-white font-poppins font-bold text-lg mb-2">Carolina Marques Prata</div>
              <div className="text-white font-poppins text-sm leading-[1.4] mb-3">Vice-Coordenador</div>
            </div>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-[200px] h-[200px] overflow-hidden mb-5 rounded-[50%]">
              <Image src="" className="w-full h-full object-cover" alt="Regina Tavares" />
            </div>
            <div className="p-[15px]">
              <div className="text-white font-poppins font-bold text-lg mb-2">Regina Tavares</div>
              <div className="text-white font-poppins text-sm leading-[1.4] mb-3">Responsável Financeiro</div>
            </div>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-[200px] h-[200px] overflow-hidden mb-5 rounded-[50%]">
              <Image src="" className="w-full h-full object-cover" alt="Vasco Vouzela" />
            </div>
            <div className="p-[15px]">
              <div className="text-white font-poppins font-bold text-lg mb-2">Vasco Vouzela</div>
              <div className="text-white font-poppins text-sm leading-[1.4] mb-3">
                Vogal da Secção Académica
              </div>
            </div>
          </div>
        </div>
        <div
          className={`grid grid-cols-[repeat(4,1fr)] gap-10 max-w-[1000px] mx-auto my-0 ${
            visibleTeam === "negum" ? "block" : "hidden"
          }`}
          id="negumTeam"
        ></div>
        <div
          className={`grid grid-cols-[repeat(4,1fr)] gap-10 max-w-[1000px] mx-auto my-0 ${
            visibleTeam === "nebqum" ? "block" : "hidden"
          }`}
          id="nebqumTeam"
        ></div>
        <div
          className={`grid grid-cols-[repeat(4,1fr)] gap-10 max-w-[1000px] mx-auto my-0 ${
            visibleTeam === "staff" ? "block" : "hidden"
          }`}
          id="staffTeam"
        ></div>
      </div>
    </div>
  );
}

