import Image from "next/image";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import { MdLocalActivity } from "react-icons/md";
import { ImExit } from "react-icons/im";

export default function Sidebar() {

    const LinkClass = "p-3 font-comfortaa transition text-white hover:bg-white hover:text-black flex"
    const Icons = "text-lg mr-2 mt-[2px]"

    return (
        <div className="min-w-[170px] h-screen bg-black flex flex-col items-center">
            <div className="border-b border-white/30 w-full flex flex-col items-center pb-3">
                <Image src="/sci-logo.png" width={100} height={100} alt="logo" className="p-4"/>
                <span className="text-white text-[.8em] -mt-4 font-montserrat">Admin Dashboard</span>
            </div>
            <div className="flex flex-col w-full">
                <Link href="/admin" className={`${LinkClass}`}>
                    <FaHome className="mt-[2px] text-lg mr-2"/> Home
                </Link>
                <Link href="/admin/users" className={`${LinkClass}`}>
                    <IoMdPerson className={`${Icons}`}/> Users
                </Link>
                <Link href="/admin/activities" className={`${LinkClass}`}>
                    <MdLocalActivity className={`${Icons}`}/> Activities
                </Link>
                <Link href="/" className={`${LinkClass} border-t border-white/30`}>
                    <ImExit className={`${Icons}`}/> Back to Home
                </Link>
            </div>
        </div>
    )
}