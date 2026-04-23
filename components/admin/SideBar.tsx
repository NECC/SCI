import Image from "next/image";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import { MdLocalActivity, MdScreenRotationAlt } from "react-icons/md";
import { ImExit } from "react-icons/im";
import { PiCertificateFill } from "react-icons/pi";
import { FaMicrophoneAlt } from "react-icons/fa";
import { GiVuvuzelas } from "react-icons/gi";

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  const getLinkClass = (path: string): string => `p-4 font-comfortaa transition-all duration-200 text-white hover:bg-white/20 flex items-center w-full rounded-r-lg group ${pathname === path ? 'admin-sidebar-link-active bg-white/30' : ''}`;

  const Icons = "text-xl mr-3";

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

    const LinkClass = "p-3 font-comfortaa transition text-white hover:bg-white hover:text-black flex"
    const Icons = "text-lg mr-2 mt-[2px]"

    return (
        <div className="min-w-[170px] h-screen bg-black md:flex hidden flex-col items-center ">
            <div className="border-b border-white/30 w-full flex flex-col items-center pb-3">
                <Image src="/sci-logo2025.png" width={100} height={100} alt="logo" className="p-4"/>
                <span className="text-white text-[.8em] -mt-4 font-montserrat">Admin Dashboard</span>
            </div>
            <div className="flex flex-col w-full">
                <Link href="/admin" className={`${LinkClass}`}>
                    <FaHome className="mt-[2px] text-lg mr-2"/> Home
                </Link>
                {/* <Link href="/admin/users" className={`${LinkClass}`}>
                    <IoMdPerson className={`${Icons}`}/> Users
                </Link> */}
                <Link href="/admin/activities" className={`${LinkClass}`}>
                    <MdLocalActivity className={`${Icons}`}/> Activities
                </Link>
                <Link href="/admin" className={`${LinkClass}`}>
                    <MdScreenRotationAlt className={`${Icons}`}/> Enrollments
                </Link>
                <Link href="/admin/certificates" className={`${LinkClass}`}>
                    <PiCertificateFill className={`${Icons}`}/> Certificates
                </Link>
                <Link href="/admin/speakers" className={`${LinkClass}`}>
                    <FaMicrophoneAlt className={`${Icons}`}/> Speakers
                </Link>
                <Link href="/admin/giveway" className={`${LinkClass}`}>
                    <GiVuvuzelas className={`${Icons}`}/> Giveway
                </Link>
                <Link href="/" className={`${LinkClass} border-t border-white/30`}>
                    <ImExit className={`${Icons}`}/> Back to Home
                </Link>
            </div>
        </div>
        
        <div className="flex flex-col w-full px-2 py-4 space-y-1">
          <Link href="/admin" className={getLinkClass('/admin').replace('rounded-r-lg', 'rounded-lg')}>
            <FaHome className={Icons} />
            <span className={`${isCollapsed ? 'opacity-0 scale-95 -translate-x-2' : 'opacity-100 scale-100 translate-x-0'} transition-all duration-200 group-hover:opacity-100`}>Dashboard</span>
          </Link>
          <Link href="/admin/users" className={getLinkClass('/admin/users')}>
            <IoMdPerson className={Icons} />
            <span className={`${isCollapsed ? 'opacity-0 scale-95 -translate-x-2' : 'opacity-100 scale-100 translate-x-0'} transition-all duration-200 group-hover:opacity-100`}>Users</span>
          </Link>
          <Link href="/admin/activities" className={getLinkClass('/admin/activities')}>
            <MdLocalActivity className={Icons} />
            <span className={`${isCollapsed ? 'opacity-0 scale-95 -translate-x-2' : 'opacity-100 scale-100 translate-x-0'} transition-all duration-200 group-hover:opacity-100`}>Activities</span>
          </Link>
          <Link href="/admin/enrollments" className={getLinkClass('/admin/enrollments')}>
            <MdScreenRotationAlt className={Icons} />
            <span className={`${isCollapsed ? 'opacity-0 scale-95 -translate-x-2' : 'opacity-100 scale-100 translate-x-0'} transition-all duration-200 group-hover:opacity-100`}>Enrollments</span>
          </Link>
          <Link href="/admin/certificates" className={getLinkClass('/admin/certificates')}>
            <PiCertificateFill className={Icons} />
            <span className={`${isCollapsed ? 'opacity-0 scale-95 -translate-x-2' : 'opacity-100 scale-100 translate-x-0'} transition-all duration-200 group-hover:opacity-100`}>Certificates</span>
          </Link>
          <div className="border-t border-white/20 mt-auto pt-4">
            <Link href="/" className={`${getLinkClass('/') } hover:bg-red-500/20`}>
              <ImExit className={Icons} />
              <span className={`${isCollapsed ? 'opacity-0 scale-95 -translate-x-2' : 'opacity-100 scale-100 translate-x-0'} transition-all duration-200 group-hover:opacity-100`}>Exit</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={toggleMobile}
        />
      )}
    </>
  );
}
