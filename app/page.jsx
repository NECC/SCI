"use client";


import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import ImageData from "../data/images.json"
import Hexa from "@components/Hexa";
import { images } from "@next.config";
import Image from "next/image";
import Sponsor from "@components/Sponsor";
import sponsorData from "../data/sponsor.json"
import ColorModeToggle from "@components/ColorModeToggle";
import Footer from "@components/Footer";

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

  // console.log(user);


  const [darkMode, setDarkMode] = useState(false);

  // Função para buscar o elemento <html> com a classe 'dark'
  const findDarkHtmlElement = () => {
    const htmlElement = document.querySelector('html.dark');
    if (htmlElement) {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  };
  useEffect(findDarkHtmlElement, []);

  return (

    <div className="bg-white dark:bg-black">
      <div className=" w-full lg:relative lg:pt-[68px] pt-[59px]">
        <div className="lg:h-[560px] md:h-[300px] h-[200px] relative ">
          <Image src="/banner.png" alt="Banner" layout="fill" objectFit="cover" />
        </div>
        <div className="flex flex-col gap-4 itens-center justify-center bg-custom-blue-1 p-2">
          <p className='text-white text-xl text-center'>14 - 15 MARÇO</p>
        </div>
        <Hexa />
      </div>

      <div className="sm:w-4/5 w-11/12 m-auto mt-[79px] ">
        <div className="lg:w-4/5 w-full flex lg:flex-wrap overflow-x-auto gap-2 snap-mandatory snap-x">
          {
            image.map((images, index) => (
              <Image
                key={index}
                src={images.path}
                alt='logo'
                width={400}
                height={400}
                className="lg:w-[32%] snap-center"
              />
            ))
          }
        </div>

        <div className="w-[15%] h-[4px] dark:bg-white bg-black mt-[79px] "></div>
        <h1 className="dark:text-white text-black md:text-5xl text-4xl font-extrabold leading-tight lg:text-left lg:w-4/5 mt-[23px]">O QUE É</h1>
        <p className="dark:text-white text-black mt-[39px] font-poppins font-light leading-8 lg:w-4/5 w-full"> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ad repellat soluta aspernatur natus nobis quos porro velit, illum nihil magni cupiditate! Sunt pariatur ratione, maiores velit officiis quod eum quisquam!</p>

        <div className="w-[15%] h-[4px] dark:bg-white bg-black mt-[70px] "></div>
        <h1 className="dark:text-white text-black md:text-5xl text-4xl font-extrabold leading-tight after:lg:text-left lg:w-4/5 mt-[23px]">PATROCÍNIOS</h1>

        <div className="lg:w-4/5 w-full mt-[39px] flex flex-wrap justify-between gap-12 ">

          {
            sponsor.map((singleSponsor, index) => (
              <Sponsor key={index}
                name={singleSponsor.name}
                path={!darkMode ? singleSponsor.path_black : singleSponsor.path}
                link={singleSponsor.link}
              />
            ))
          }

        </div>
        <div className="w-[15%] h-[4px] dark:bg-white bg-black mt-[70px]"></div>
        <h1 className="dark:text-white text-black md:text-5xl text-4xl font-extrabold leading-tight after:lg:text-left lg:w-4/5 mt-[23px]">NÚCLEOS ORGANIZADORES</h1>
        <div className="lg:w-4/5 w-full flex justify-end items-center ">
          <div className="lg:w-[400px] lg:h-[400px] md:w-[300px] md:h-[300px] h-[200px] w-[200px]  relative ">
            <Image src={darkMode ? "/location.svg" : "location_dark.svg"} alt="Banner" layout="fill" objectFit="cover" />
          </div>
        </div>
      </div>
      <div onClick={findDarkHtmlElement}>
        <ColorModeToggle />
      </div>
      <Footer />
    </div>
  );
}
