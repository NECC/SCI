"use client";


import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Nucleos_logo from "../data/nucleos.json"
import Hexa from "@components/Hexa";
import { images } from "@next.config";
import Image from "next/image";
import Sponsor from "@components/Sponsor";
import sponsorData from "../data/sponsor.json"
import Footer from "@components/Footer";
import Nucleos from "@components/Nucleos";
import { motion, useAnimation } from "framer-motion";
import { useInView } from 'react-intersection-observer';



const nucleos = Nucleos_logo.logo
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
    if (session) {
      setUser(session.user);
      console.log(session)
    }
  }, [session]);



  const [ref, inView] = useInView({
    triggerOnce: false, // Set to false to trigger the animation every time the element comes in view
    threshold: 0.2, // 0.5 means the animation will trigger when 50% of the element is in view
  });

  const [ref_2, inView_2] = useInView({
    triggerOnce: false, // Set to false to trigger the animation every time the element comes in view
    threshold: 0.3, // 0.5 means the animation will trigger when 50% of the element is in view
  });




  return (
    <div className="bg-gradient-to-l from-custom-blue-3 to-custom-blue-1">
      <div className="lg:relative ">
        <div className="sm:w-4/5 w-11/12 m-auto">
          <div className="lg:w-4/5 w-full flex-col gap-12 flex pt-20 ">
            <Image src="/sci-logo.png" alt="Banner" width={400} height={400} />
            <p className='text-white lg:text-7xl md:text-6xl text-5xl text-start font-extrabold'>SEMANA DA CIÊNCIA E INOVAÇÃO</p>
            <div className="flex justify-start items-center gap-4 mb-[70px]">
              <button className="py-2 px-6 bg-yellow-300 rounded-lg hover:opacity-80">Events </button>
              <p className='text-white text-xl text-start '>14 - 15 MARCH</p>
            </div>
          </div>
        </div>
        <Hexa

        />

        <div className="bg-custom-blue-3 w-full">


          <div className="sm:w-[80%] w-[90%]  lg:w-full  relative m-auto">
            <h1 className="text-white md:text-5xl text-4xl font-extrabold leading-tight lg:text-right text-left lg:-inline block lg:bg-gradient-to-l lg:from-blue-700/60 lg:to-custom-blue-3 bg-gradient-to-l  from-custom-blue-3 to-blue-700/60  lg:mr-[220px] lg:px-[150px] lg:border-l-0 border-l-4 p-3">WHAT IS IT?</h1>
            <div className="absolute w-4 h-4 top-0 left-0 -translate-y-2/4 -translate-x-1/3 rounded-full bg-yellow-300 lg:hidden block"></div>
            <div className="absolute w-4 h-4 bottom-0 left-0 translate-y-2/4 -translate-x-1/3 rounded-full bg-yellow-300 lg:hidden block"></div>

            <div className="w-[72px] h-[72px] border-4 -translate-y-2/4 top-1/2 right-[215px] absolute lg:block hidden">
              <div className="w-full h-full relative">
                <div className="bg-yellow-300 h-5 w-5 rounded-full -translate-y-2/4 translate-x-2/4 absolute top-0 right-0 "></div>
                <div className="bg-yellow-300 h-5 w-5 rounded-full translate-y-2/4 translate-x-2/4 absolute bottom-0 right-0 "></div>
                <div className="bg-blue-950 h-5 w-5 rounded-full -translate-y-2/4 -translate-x-2/4 absolute top-0 left-0 "></div>
                <div className="bg-yellow-300 h-5 w-5 rounded-full translate-y-2/4 -translate-x-2/4 absolute bottom-0 left-0 "></div>
              </div>
            </div>
          </div>

          <div className="sm:w-4/5 w-11/12 m-auto mt-[70px] ">
            <p className="text-white font-poppins font-light leading-8 lg:w-[70%] "> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ad repellat soluta aspernatur natus nobis quos porro velit, illum nihil magni cupiditate! Sunt pariatur ratione, maiores velit officiis quod eum quisquam!</p>
          </div>



          <div className="sm:w-[80%] w-[90%]  lg:w-full  relative m-auto mt-[70px] ">
            <h1 className="text-white md:text-5xl text-4xl font-extrabold leading-tight lg:text-right text-left lg:-inline block lg:bg-gradient-to-l lg:from-blue-700/60 lg:to-custom-blue-3 bg-gradient-to-l  from-custom-blue-3 to-blue-700/60  lg:mr-[220px] lg:px-[150px] lg:border-l-0 border-l-4 p-3">SPONSORS</h1>
            <div className="absolute w-4 h-4 top-0 left-0 -translate-y-2/4 -translate-x-1/3 rounded-full bg-yellow-300 lg:hidden block"></div>
            <div className="absolute w-4 h-4 bottom-0 left-0 translate-y-2/4 -translate-x-1/3 rounded-full bg-yellow-300 lg:hidden block"></div>

            <div className="w-[72px] h-[72px] border-4 -translate-y-2/4 top-1/2 right-[215px] absolute  lg:block hidden">
              <div className="w-full h-full relative">
                <div className="bg-yellow-300 h-5 w-5 rounded-full -translate-y-2/4 translate-x-2/4 absolute top-0 right-0 "></div>
                <div className="bg-yellow-300 h-5 w-5 rounded-full translate-y-2/4 translate-x-2/4 absolute bottom-0 right-0 "></div>
                <div className="bg-blue-950 h-5 w-5 rounded-full -translate-y-2/4 -translate-x-2/4 absolute top-0 left-0 "></div>
                <div className="bg-yellow-300 h-5 w-5 rounded-full translate-y-2/4 -translate-x-2/4 absolute bottom-0 left-0 "></div>
              </div>
            </div>
          </div>

          <motion.div
            ref={ref_2}
            variants={{
              hidden: { opacity: 0, y: 60 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate={inView_2 ? 'visible' : 'hidden'}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="overflow-hidden"
          >

          <div className="sm:w-4/5 w-11/12 m-auto mt-[70px] ">
            <div className="lg:w-4/5 w-full mt-9 flex flex-wrap justify-between gap-12 ">

              {
                sponsor.map((singleSponsor, index) => (
                  <Sponsor {...singleSponsor} key={index}

                  />
                ))
              }

            </div>
          </div>
          </motion.div>



          <div className="sm:w-[80%] w-[90%]  lg:w-full  relative m-auto mt-[70px] ">
            <h1 className="text-white md:text-5xl text-4xl font-extrabold leading-tight lg:text-right text-left lg:-inline block lg:bg-gradient-to-l lg:from-blue-700/60 lg:to-custom-blue-3 bg-gradient-to-l  from-custom-blue-3 to-blue-700/60  lg:mr-[220px] lg:px-[150px] lg:border-l-0 border-l-4 p-3">ORGANIZATION</h1>
            <div className="absolute w-4 h-4 top-0 left-0 -translate-y-2/4 -translate-x-1/3 rounded-full bg-yellow-300 lg:hidden block"></div>
            <div className="absolute w-4 h-4 bottom-0 left-0 translate-y-2/4 -translate-x-1/3 rounded-full bg-yellow-300 lg:hidden block"></div>
            <div className="w-[72px] h-[72px] border-4 -translate-y-2/4 top-1/2 right-[215px] absolute lg:block hidden">
              <div className="w-full h-full relative">
                <div className="bg-yellow-300 h-5 w-5 rounded-full -translate-y-2/4 translate-x-2/4 absolute top-0 right-0 "></div>
                <div className="bg-yellow-300 h-5 w-5 rounded-full translate-y-2/4 translate-x-2/4 absolute bottom-0 right-0 "></div>
                <div className="bg-blue-950 h-5 w-5 rounded-full -translate-y-2/4 -translate-x-2/4 absolute top-0 left-0 "></div>
                <div className="bg-yellow-300 h-5 w-5 rounded-full translate-y-2/4 -translate-x-2/4 absolute bottom-0 left-0 "></div>
              </div>
            </div>
          </div>

          <div className="sm:w-4/5 w-11/12 m-auto mt-[70px] ">
            <div className="lg:w-4/5 w-full mt-9 flex flex-wrap gap-9 ">

              {
                nucleos.map((logos, index) => (
                  <Nucleos {...logos} key={index}

                  />
                ))
              }

            </div>
          </div>



          <div className="sm:w-[80%] w-[90%] lg:w-full relative m-auto mt-[70px]">
            <h1 className="text-white md:text-5xl text-4xl font-extrabold leading-tight lg:text-right text-left lg:-inline block lg:bg-gradient-to-l lg:from-blue-700/60 lg:to-custom-blue-3 bg-gradient-to-l  from-custom-blue-3 to-blue-700/60  lg:mr-[220px] lg:px-[150px] lg:border-l-0 border-l-4 p-3">FIND US</h1>
            <div className="absolute w-4 h-4 top-0 left-0 -translate-y-2/4 -translate-x-1/3 rounded-full bg-yellow-300 lg:hidden block"></div>
            <div className="absolute w-4 h-4 bottom-0 left-0 translate-y-2/4 -translate-x-1/3 rounded-full bg-yellow-300 lg:hidden block"></div>


            <div className="w-[72px] h-[72px] border-4 -translate-y-2/4 top-1/2 right-[215px] absolute lg:block hidden">
              <div className="w-full h-full relative">
                <div className="bg-yellow-300 h-5 w-5 rounded-full -translate-y-2/4 translate-x-2/4 absolute top-0 right-0 "></div>
                <div className="bg-yellow-300 h-5 w-5 rounded-full translate-y-2/4 translate-x-2/4 absolute bottom-0 right-0 "></div>
                <div className="bg-blue-950 h-5 w-5 rounded-full -translate-y-2/4 -translate-x-2/4 absolute top-0 left-0 "></div>
                <div className="bg-yellow-300 h-5 w-5 rounded-full translate-y-2/4 -translate-x-2/4 absolute bottom-0 left-0 "></div>
              </div>
            </div>
          </div>


          <motion.div
            ref={ref}
            variants={{
              hidden: { opacity: 0, y: 60 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{ duration: 0.4, delay: 0.4}}
            className="overflow-hidden"
          >

            <div className="sm:w-4/5 w-11/12 m-auto mt-[70px]">
              <div className="lg:w-4/5 w-full md:flex md:justify-start flex-row justify-center items-center mt-9">
                <div className="relative lg:w-[400px] lg:h-[400px] w-[300px] h-[300px]  m-auto md:ml-0">
                  <Image src={"/location.svg"} alt="Banner" fill />
                </div>
                <div className="md:w-5/12 md:mt-0 mt-9 text-white font-poppins font-light leading-8">
                  <p>Lorem  ipsum dolor sit amet consectetur adipisicing elit. Quam ea ipsa consequatur culpa assumenda atque eius suscipit veritatis neque dolore sed explicabo perferendis quae mollitia provident, optio facere voluptatum. Dolores?
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, ut facere eos, voluptate repellendus iusto praesentium totam quas natus quo, libero veritatis! Magni, voluptatum laborum beatae dolorum saepe recusandae numquam?
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





        </div >

      </div>
      <Footer />
    </div >

  );
}





