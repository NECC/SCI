import Image from 'next/image'
import { IoLogoGithub } from "react-icons/io";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import Linker from 'next/link'
const Footer = () => {
  return (
    <div className='w-full'>
      <div className='flex md:flex-row flex-col justify-between items-center gap-4 p-4 w-11/12 m-auto z-50'>
        <div className="flex gap-4">
          <IoLogoGithub className="hover:opacity-60 cursor-pointer" size={25} color={"white"} />
          <FaInstagram className="hover:opacity-60 cursor-pointer" size={25} color={"white"} />
          <FaLinkedin className="hover:opacity-60 cursor-pointer" size={25} color={"white"} />
        </div>
        <Linker href="/#footer" className='order-first md:order-none'><Image src="/sci-logo.png " alt="logo" width={70} height={70} className='cursor-pointer' /> </Linker>
        <a className='hover:underline decoration-1 cursor-pointer text-white'>General Information</a>
      </div>
    </div>
  )
}

export default Footer

