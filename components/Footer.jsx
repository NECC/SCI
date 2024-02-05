import Image from 'next/image'
import { IoLogoGithub } from "react-icons/io";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
const Footer = () => {
  return (
    <div className='flex justify-between w-11/12 items-center m-auto '>
      <div className="flex gap-4">
        <IoLogoGithub className="hover:opacity-60 cursor-pointer" size={25} />
        <FaInstagram className="hover:opacity-60 cursor-pointer" size={25} />
        <FaLinkedin className="hover:opacity-60 cursor-pointer" size={25} />
      </div>
      <Image src="/sci-logo.png" alt="logo" width={70} height={70} />
      <a>General</a>


    </div>
  )
}

export default Footer