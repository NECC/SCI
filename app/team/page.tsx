"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CoreTypes } from "@lib/types";

const MOBILE_BREAKPOINT = 768;

const coreThisYear: {
  name: CoreTypes;
  logo: string;
  width?: number;
  height?: number;
}[] = [
  { name: "necc", logo: "/nucleos/necc.svg" },
  { name: "necaum", logo: "/nucleos/necaum.png" },
  { name: "negum", logo: "/nucleos/negum.svg", width: 120, height: 120 },
  { name: "nebqum", logo: "/nucleos/nebqum.png" },
  { name: "nebaum", logo: "/nucleos/nebaum.svg" },
  { name: "staff", logo: "/nucleos/staff.png", width: 135, height: 135 },
];

const teams: {
  [key in CoreTypes]: { name: string; role: string; photo: string }[];
} = {
  necc: [
    { name: "Renato Garcia", role: "Organização", photo: "/team/RenatoGarcia.png" },
    { name: "Pedro Camargo", role: "Tecnológico", photo: "/team/PedroCamargo.jpg" },
    { name: "Miguel Calçado", role: "Tecnológico", photo: "/team/MiguelCalcado.png" },
    { name: "Edgar Araujo", role: "Tecnológico e Marketing", photo: "/team/EdgarAraujo.png" },
    { name: "Gabriel Costa", role: "Tecnológico", photo: "/team/GabrielCosta.png" },
    { name: "Afonso Martins", role: "Recreativo", photo: "/team/AfonsoMartins.png" },
    { name: "Davide Santos", role: "Marketing", photo: "/team/DavideSantos.png" },
  ],
  necaum: [
    { name: "Hugo Correia", role: "Coordenador", photo: "" },
    { name: "Carolina Marques Prata", role: "Vice-Coordenadora", photo: "" },
    { name: "Regina Tavares", role: "Responsável Financeira", photo: "" },
    { name: "Vasco Vouzela", role: "Vogal da Secção Académica", photo: "" },
  ],
  negum: [
    { name: "Mariana Silva", role: "Coordenadora", photo: "" },
    { name: "Mariana Silva", role: "Vice-Coordenadora", photo: "" },
    { name: "Mariana Silva", role: "Responsável Financeira", photo: "" },
    { name: "Mariana Silva", role: "Vogal da Secção Académica", photo: "" },
  ],
  nebqum: [
    { name: "Mariana Silva", role: "Coordenadora", photo: "" },
    { name: "Mariana Silva", role: "Responsável Financeira", photo: "" },
    { name: "Mariana Silva", role: "Vice-Coordenadora", photo: "" },
    { name: "Mariana Silva", role: "Vogal da Secção Académica", photo: "" },
  ],
  nebaum: [],
  nefum: [],
  staff: [],
}

export default function Team() {
  const [visibleTeam, setVisibleTeam] = useState<CoreTypes>("necaum"); // Default team
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTeamChange = (teamId: CoreTypes) => {
    setVisibleTeam(teamId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-l from-custom-blue-3 to-custom-blue-1">
      <h1 className="text-center text-white md:text-5xl text-4xl font-poppins font-bold pt-8">
        Núcleos Organizadores
      </h1>
      <div className={`
	grid
	${isMobile ? 'grid-cols-3 grid-rows-2' : 'grid-cols-6'}
	gap-4 md:gap-[30px]
	max-w-[1500px]
	mx-auto
	my-5 md:my-10
	pt-3 md:pt-5
	px-4
	place-items-center
     `}>
        {coreThisYear.map((core, i) => (
          <button
            key={i}
            onClick={() => handleTeamChange(core.name)}
            className="px-0 py-0 rounded-full transition-all duration-200 hover:bg-black/5 bg-transparent"
          >
            <Image 
              src={core.logo} 
              alt={`${core.name} logo`} 
              width={isMobile ? (core.width ?? 150) * 0.55 : core.width ?? 150} 
              height={isMobile ? (core.height ?? 150) * 0.55 : core.height ?? 150} 
            />
          </button>
        ))}
      </div>
      <div className="bg-gradient-to-b from-black/10 via-black/5 to-transparent shadow-[0_-1px_20px_rgba(0,0,0,0.05)] grow mt-10 px-5 py-[60px] rounded-[40px_40px_0_0]">
        {coreThisYear.map((core, i) => (
          <div
            key={i}
            className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-[repeat(4,1fr)]'} gap-10 max-w-[1000px] mx-auto my-0 ${
              visibleTeam === core.name ? "block" : "hidden"
            }`}
          >
            {teams[core.name].map((team, j) => (
              <div key={j} className="flex flex-col items-center text-center">
	        <div className={`${isMobile ? 'w-[100px] h-[100px]' : 'w-[200px] h-[200px]'} overflow-hidden mb-5 rounded-[50%]`}>
		  <Image src={team.photo} width={isMobile ? 100 : 200} height={isMobile ? 100 : 200} className="w-full h-full object-cover" alt={team.name}/>
                </div>
                <div className="p-[15px]">
                  <div className="text-white font-poppins font-bold text-lg mb-2">{team.name}</div>
                  <div className="text-white font-poppins text-sm leading-[1.4] mb-3">{team.role}</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

