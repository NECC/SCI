import Image from 'next/image'
import { IoLogoGithub } from "react-icons/io";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <div className='w-full bg-gradient-to-l from-custom-blue-3 to-custom-blue-1'>
      <div className='flex md:flex-row flex-col justify-between items-center gap-4 p-4 w-11/12 m-auto z-50'>
        <div className="flex gap-4 md:order-1">
          <a href='https://github.com/NECC/Sci' target="_blank" ><IoLogoGithub className="hover:opacity-60 cursor-pointer" size={25} color={"white"} /></a>
          <a href='https://www.instagram.com/sci.uminho/' target="_blank"><FaInstagram className="hover:opacity-60 cursor-pointer" size={25} color={"white"} /> </a>
        </div>
        <Image src="/sci-logo.png" alt="logo" width={80} height={80} className='md:order-2 order-first' />
        <a href="/docs/regulamento.pdf" className='hover:underline decoration-1 cursor-pointer text-white md:order-3' target='_blank'>General Information</a>
      </div>
    </div>
  )
}

export default Footer

