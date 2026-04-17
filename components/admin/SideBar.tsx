"use client";

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaBars } from 'react-icons/fa';
import { IoMdPerson } from 'react-icons/io';
import { MdLocalActivity, MdScreenRotationAlt } from 'react-icons/md';
import { ImExit } from 'react-icons/im';
import { PiCertificateFill } from 'react-icons/pi';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  const getLinkClass = (path: string): string => `p-4 font-comfortaa transition-all duration-200 text-white hover:bg-white/20 flex items-center w-full rounded-r-lg group ${pathname === path ? 'admin-sidebar-link-active bg-white/30' : ''}`;

  const Icons = "text-xl mr-3";

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-black/80 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-all duration-200"
        onClick={toggleMobile}
      >
        <FaBars size={20} />
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-0 h-screen w-72 md:w-64 bg-gradient-to-b from-gray-900 to-black border-r border-white/20 z-40 transition-all duration-300 transform ${isCollapsed ? '-translate-x-full md:-translate-x-0' : 'translate-x-0'} ${isMobileOpen && !isCollapsed ? 'translate-x-0' : ''}`}>
        <div className="border-b border-white/30 p-6 flex flex-col items-center">
          <Image 
            src="/sci-logo2025.png" 
            width={80} 
            height={80} 
            alt="SCI Logo" 
            className="rounded-xl shadow-lg p-3 bg-white/10" 
            priority
          />
          <span className={`text-white text-sm font-montserrat mt-2 font-bold transition-all duration-200 ${isCollapsed ? 'opacity-0 scale-95 -translate-x-2' : 'opacity-100 scale-100 translate-x-0'}`}>
            Admin Dashboard
          </span>
          <button 
            className="md:hidden mt-2 p-1 hover:bg-white/20 rounded transition-all"
            onClick={toggleCollapse}
          >
            <FaBars size={16} />
          </button>
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
