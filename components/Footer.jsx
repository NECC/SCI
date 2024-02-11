import Image from 'next/image'
import { IoLogoGithub } from "react-icons/io";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <div className='w-full'>
      <div className='flex md:flex-row flex-col justify-between items-center gap-4 p-4 w-11/12 m-auto z-50'>
        <div className="flex gap-4">
          <IoLogoGithub className="hover:opacity-60 cursor-pointer" size={25} color={"white"} />
          <FaInstagram className="hover:opacity-60 cursor-pointer" size={25} color={"white"} />
          <FaLinkedin className="hover:opacity-60 cursor-pointer" size={25} color={"white"} />
        </div>
      </div>
      <Image src="/sci-logo.png" alt="logo" width={80} height={80} />
      <a className='text-white font-bold underline'>General Regulation</a>


    </div>
  )
}

export default Footer

