import Image from 'next/image'
import { IoLogoGithub } from "react-icons/io";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
const Footer = () => {
  return (
    <div className='flex mt-24 pb-4 justify-between w-4/5 items-center m-auto'>
      <div className="flex gap-4">
        <IoLogoGithub className="mr-4 hover:opacity-60 cursor-pointer" size={25} />
        <FaInstagram className="mr-4 hover:opacity-60 cursor-pointer" size={25} />
        <FaLinkedin className="mr-4 hover:opacity-60 cursor-pointer" size={25} />
      </div>
      <Image src="/sci-logo.png" alt="logo" width={80} height={80} />
      <a className='text-white font-bold underline'>General Regulation</a>


    </div>
  )
}

export default Footer