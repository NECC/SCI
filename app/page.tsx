"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Nucleos_logo from "../data/nucleos.json";
import Hexa from "@components/Hexa";
import { images } from "@next.config";
import Image from "next/image";
import Sponsor from "@components/Sponsor";
import sponsorData from "../data/sponsor.json";
import Footer from "@components/Footer";
import Nucleos from "@components/Nucleos";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@nextui-org/react";

const nucleos = Nucleos_logo.logo;
const sponsor = sponsorData.Patrocinadores;

export default function Home() {
  const [user, setUser] = useState({});

  const { data: session } = useSession({
    required: false,
  });

  useEffect(() => {
    if (session) {
      setUser(session.user);
      // console.log(session)
    }
  }, [session]);

  const [ref, inView] = useInView({
    triggerOnce: true, // Set to false to trigger the animation every time the element comes in view
  });

  const [ref_2, inView_2] = useInView({
    triggerOnce: true, //
  });

  const [ref_3, inView_3] = useInView({
    triggerOnce: true,
  });

  const [ref_4, inView_4] = useInView({
    triggerOnce: true,
  });

  return (
    <div className="bg-gradient-to-l from-custom-blue-3 to-custom-blue-1 h-screen">
      <div className="lg:relative ">
        <div className="sm:w-4/5 w-11/12 m-auto">
          <div className="lg:w-4/5 w-full flex-col gap-12 flex md:pt-20 pt-10 ">
            <Image src="/sci-logo2025.png" alt="Banner" width={400} height={400} />
            <p className="text-white lg:text-7xl md:text-6xl text-5xl text-start font-extrabold cursor-default">
              SEMANA DA CIÊNCIA E INOVAÇÃO
            </p>
            <div className="flex justify-start items-center gap-4 mb-[70px]">
              <Link href="/schedule">
                <Button
                  color="warning"
                  variant="shadow"
                  className=" rounded-lg text-white font-bold"
                >
                  Explore
                </Button>
              </Link>

              <p className="text-white text-xl text-start cursor-default">22 - 24 APRIL</p>
            </div>
          </div>
        </div>
        <Hexa />

        <div className="bg-custom-blue-3 w-full">
          <div className="sm:w-[80%] w-[90%]  lg:w-full  relative m-auto">
            <h1 className="text-white md:text-5xl text-4xl font-extrabold leading-tight lg:text-right text-left lg:-inline block lg:bg-gradient-to-l lg:from-blue-700/60 lg:to-custom-blue-3 to-60% bg-gradient-to-l  from-custom-blue-3 to-blue-700/60  lg:mr-[220px] lg:px-[150px] lg:border-l-0 border-l-4 p-3">
              WHAT IS IT?
            </h1>
            <div className="absolute w-4 h-4 top-0 left-0 -translate-y-2/4 -translate-x-1/3 rounded-full bg-yellow-300 lg:hidden block"></div>
            <div className="absolute w-4 h-4 bottom-0 left-0 translate-y-2/4 -translate-x-1/3 rounded-full bg-yellow-300 lg:hidden block"></div>

            <div className="w-[72px] h-[72px] border-4 -translate-y-2/4 top-1/2 right-[215px] absolute lg:block hidden">
              <div className="w-full h-full relative">
                <Bolas />
              </div>
            </div>
          </div>

          <motion.div
            ref={ref}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ duration: 0.8, delay: 0.5, transition: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="sm:w-4/5 w-11/12 m-auto mt-[70px] ">
              <p className="text-white font-poppins font-light leading-8 lg:w-[70%] ">
                Prepare to embark on a journey of exploration and discovery as we delve into the realms of science and innovation over the course of four exhilarating days. Our event is designed to ignite curiosity, foster collaboration, and inspire the next generation of innovators. Throughout the week, we will host a diverse array of workshops, thought-provoking talks, and engaging pitches from pioneering companies. Whether you&apos;re passionate about cutting-edge research, eager to learn new skills, or seeking inspiration for your own entrepreneurial endeavors, there&apos;s something here for everyone.
              </p>
            </div>
          </motion.div>

          <div className="sm:w-[80%] w-[90%]  lg:w-full  relative m-auto mt-[70px] ">
            <h1 className="text-white md:text-5xl text-4xl font-extrabold leading-tight lg:text-right text-left lg:-inline block lg:bg-gradient-to-l lg:from-blue-700/60 lg:to-custom-blue-3 to-60% bg-gradient-to-l  from-custom-blue-3 to-blue-700/60  lg:mr-[220px] lg:px-[150px] lg:border-l-0 border-l-4 p-3">
              SPONSORS
            </h1>
            <div className="absolute w-4 h-4 top-0 left-0 -translate-y-2/4 -translate-x-1/3 rounded-full bg-yellow-300 lg:hidden block"></div>
            <div className="absolute w-4 h-4 bottom-0 left-0 translate-y-2/4 -translate-x-1/3 rounded-full bg-yellow-300 lg:hidden block"></div>

            <div className="w-[72px] h-[72px] border-4 -translate-y-2/4 top-1/2 right-[215px] absolute  lg:block hidden">
              <div className="w-full h-full relative">
                <Bolas />
              </div>
            </div>
          </div>

          <motion.div
            ref={ref_2}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate={inView_2 ? "visible" : "hidden"}
            transition={{ duration: 0.8, delay: 0.5, transition: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="sm:w-4/5 w-11/12 m-auto mt-[70px] ">
              <div className="lg:w-4/5 w-full mt-9 flex flex-wrap justify-between gap-12 ">
                {/* Estes sponsors estao fora do compoenete pq são "gold" */}
                <div className="py-8 w-[40%] flex justify-start items-center">
                  <a href="https://jordao.com/en" target="blank">
                    <Image
                      src="/sponsor/jordao.svg"
                      alt="Jordão"
                      width={400}
                      height={270}
                      className="hover:scale-105 md:-mt-10"
                    />
                  </a>
                </div>
                <div className="py-8 w-[40%] flex justify-start items-center">
                  <a
                    href="https://www.dstsgps.com/intro-pt-pt/#/#intro"
                    target="blank"
                  >
                    <Image
                      src="/sponsor/dst.svg"
                      alt="DST"
                      width={400}
                      height={270}
                      className="hover:scale-105"
                    />
                  </a>
                </div>

                {sponsor.map((singleSponsor, index) => (
                  <Sponsor {...singleSponsor} key={index} />
                ))}
              </div>
            </div>
          </motion.div>

          <div className="sm:w-[80%] w-[90%]  lg:w-full  relative m-auto mt-[70px] ">
            <h1 className="text-white md:text-5xl text-4xl font-extrabold leading-tight lg:text-right text-left lg:-inline block lg:bg-gradient-to-l lg:from-blue-700/60 lg:to-custom-blue-3 to-60% bg-gradient-to-l  from-custom-blue-3 to-blue-700/60  lg:mr-[220px] lg:px-[150px] lg:border-l-0 border-l-4 p-3">
              ORGANIZATION
            </h1>
            <div className="absolute w-4 h-4 top-0 left-0 -translate-y-2/4 -translate-x-1/3 rounded-full bg-yellow-300 lg:hidden block"></div>
            <div className="absolute w-4 h-4 bottom-0 left-0 translate-y-2/4 -translate-x-1/3 rounded-full bg-yellow-300 lg:hidden block"></div>
            <div className="w-[72px] h-[72px] border-4 -translate-y-2/4 top-1/2 right-[215px] absolute lg:block hidden">
              <div className="w-full h-full relative">
                <Bolas />
              </div>
            </div>
          </div>

          <motion.div
            ref={ref_3}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate={inView_3 ? "visible" : "hidden"}
            transition={{ duration: 0.8, delay: 0.5, transition: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="sm:w-4/5 w-11/12 m-auto mt-[70px] ">
              <div className="lg:w-4/5 w-full mt-9 flex flex-wrap gap-12 justify-between sm:justify-start ">
                {nucleos.map((logos, index) => (
                  <Nucleos {...logos} key={index} />
                ))}
              </div>
            </div>
          </motion.div>

          <div className="sm:w-[80%] w-[90%] lg:w-full relative m-auto mt-[70px]">
            <h1 className="text-white md:text-5xl text-4xl font-extrabold leading-tight lg:text-right text-left lg:-inline block lg:bg-gradient-to-l lg:from-blue-700/60 lg:to-custom-blue-3 to-60% bg-gradient-to-l  from-custom-blue-3 to-blue-700/60  lg:mr-[220px] lg:px-[150px] lg:border-l-0 border-l-4 p-3">
              FIND US
            </h1>
            <div className="absolute w-4 h-4 top-0 left-0 -translate-y-2/4 -translate-x-1/3 rounded-full bg-yellow-300 lg:hidden block"></div>
            <div className="absolute w-4 h-4 bottom-0 left-0 translate-y-2/4 -translate-x-1/3 rounded-full bg-yellow-300 lg:hidden block"></div>

            <div className="w-[72px] h-[72px] border-4 -translate-y-2/4 top-1/2 right-[215px] absolute lg:block hidden">
              <div className="w-full h-full relative">
                <Bolas />
              </div>
            </div>
          </div>

          <motion.div
            ref={ref_4}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate={inView_4 ? "visible" : "hidden"}
            transition={{ duration: 0.8, delay: 0.5, transition: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="sm:w-4/5 w-11/12 m-auto mt-[70px]">
              <div className="lg:w-4/5 w-full md:flex md:justify-start flex-row justify-center items-center mt-9">
                <div className="relative lg:w-[400px] lg:h-[400px] w-[300px] h-[300px]  m-auto md:ml-0">
                  <Image src={"/location.svg"} alt="Banner" fill />
                </div>
                <div className="md:w-5/12 md:mt-0 mt-9 text-white font-poppins font-light leading-8">
                  <p>
                    We&apos;re excited to have you join us at Universidade do Minho. Whether you&apos;re looking to explore the latest innovations or delve into scientific discoveries, our event has something for everyone. Join us and be part of this celebration of knowledge and creativity.
                  </p>
                  <p>The event will take place at CP 2, University of Minho, Gualtar Campus. We hope to see you there!</p>
                  <h1 className="mt-4 text-xl font-extrabold leading-tight">
                    Contact us:
                  </h1>
                  <p>
                    Email: sci.uminho@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="h-[100px] sm:w-[80%] w-[90%] lg:w-full relative m-auto mt-[70px]">
            <div className="bottom-0 right-[160px] absolute lg:block hidden">
              <Image src={"/robot.png"} alt="Banner" width={100} height={100} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
const Bolas = () => {
  return (
    <>
      <div className="bg-yellow-300 h-5 w-5 rounded-full -translate-y-2/4 translate-x-2/4 absolute top-0 right-0 "></div>
      <div className="bg-yellow-300 h-5 w-5 rounded-full translate-y-2/4 translate-x-2/4 absolute bottom-0 right-0 "></div>
      <div className="bg-blue-950 h-5 w-5 rounded-full -translate-y-2/4 -translate-x-2/4 absolute top-0 left-0 "></div>
      <div className="bg-yellow-300 h-5 w-5 rounded-full translate-y-2/4 -translate-x-2/4 absolute bottom-0 left-0 "></div>
    </>
  );
}
