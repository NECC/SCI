"use client";


import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import ImageData from "../data/nucleos.json"
import Hexa from "@components/Hexa";
import { images } from "@next.config";
import Image from "next/image";
import Sponsor from "@components/Sponsor";
import sponsorData from "../data/sponsor.json"
import ColorModeToggle from "@components/ColorModeToggle";
import Footer from "@components/Footer";
import Nav from "@components/Nav";
import Nucleos from "@components/Nucleos";


const image = ImageData.images
const sponsor = sponsorData.Patrocinadores


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


  return (

    <div id="footer" className="bg-gradient-to-r from-custom-blue-3 via-custom-blue-1 to-custom-blue-3 dark:bg-gradient-to-r dark:from-black dark:via-black dark:to-black">
      <Nav />
      <div className="w-full">
        <div className="lg:h-[560px] md:h-[300px] h-[200px] relative ">
          <Image src="/banner.png" alt="Banner" layout="fill" objectFit="cover" />
        </div>
        <div className="flex flex-col gap-4 itens-center justify-center p-2  ">
          <p className="text-white md:text-2xl text-1xl font-extrabold leading-tight text-center tracking-[0.2npmem]">14 - 15 MARÇO</p>
        </div>
        <Hexa />
      </div>

      <div className="sm:w-4/5 w-11/12 m-auto mt-[79px] ">

        <h1 className="text-white  md:text-5xl text-4xl font-extrabold leading-tight lg:text-left lg:w-4/5 tracking-[0.1em]">WHATS IS IT?</h1>

        <p className="text-white  mt-9 font-poppins font-light leading-8 lg:w-4/5 w-full"> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ad repellat soluta aspernatur natus nobis quos porro velit, illum nihil magni cupiditate! Sunt pariatur ratione, maiores velit officiis quod eum quisquam!</p>

        <div className="w-[15%] h-[4px] bg-white mt-20 "></div>
        <h1 className="text-white  md:text-5xl text-4xl font-extrabold leading-tight lg:text-left lg:w-4/5 mt-6 tracking-[0.1em]">SPONSORS</h1>

        <div className="lg:w-4/5 w-full mt-9 flex flex-wrap justify-between gap-12 ">

          {
            sponsor.map((singleSponsor, index) => (
              <Sponsor {...singleSponsor} key={index}

              />
            ))
          }

        </div>

        <div className="md:w-[15%] w-[30%] h-[4px]  bg-white mt-20"></div>

        <h1 className="text-white md:text-5xl text-4xl font-extrabold leading-tight after:lg:text-left lg:w-4/5 mt-6 tracking-[0.1em]">ORGANIZATION</h1>

        <div className="lg:w-4/5 w-full mt-10 flex flex-wrap gap-12">
          {
            image.map((singleImage, index) => (
              <Nucleos {...singleImage} key={index} />
            ))
          }
        </div>
        
        <div className="w-full lg:w-4/5 flex md:flex-row flex-col md:justify-between items-center justify-center gap-12 mt-40">
          <div className="w-full p-6 md:w-1/2 shadow-2xl shadow-custom-blue-2 bg-custom-blue-2 dark:bg-black  rounded-xl">
            <p className="text-white md:text-5xl text-4xl font-extrabold leading-tight after:lg:text-left lg:w-4/5 tracking-[0.1em]">FIND US</p>
            <p className="text-white  mt-2 font-poppins font-light leading-8"> The JOIN is free for participants and is organized by volunteers from CeSIUM, NECC, NEFUM, the Department of Informatics, and the School of Science from the university of Minho.
              This years event will take place at Pedagocic Complex 1, Building 1, Gualtar Campus.
            </p>
          </div>
          <div className="relative  lg:w-96 lg:h-96 md:w-80 md:h-80 w-72 h-72">
            <Image src={"/location.svg"} alt="Banner" layout="fill" objectFit="cover" />
          </div>
        </div>

      </div>
      <div>
        <ColorModeToggle />
      </div>
      <Footer />
    </div>
  );
}





