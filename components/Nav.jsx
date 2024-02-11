"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { PiSignOutDuotone } from "react-icons/pi";
import { Avatar, Button, Divider, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const Nav = (props) => {
  const [user, setUser] = useState({});
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const router = useRouter();

  const { data: session, status } = useSession({
    required: false,
  });

  // console.log(session)

  useEffect(() => {
    if (session) setUser(session.user);
  }, [session]);

  useEffect(() => {
    if (toggleDropdown) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [toggleDropdown]);

  return (
    <nav className="relative z-50">
      {/* Desktop Navigation */}
      
      <div className="md:flex hidden gap-3 md:gap-5 md:w-4/5  m-auto justify-between   py-4 ">
        <div className="flex gap-3 lg:gap-5 items-center">
          <Link href="/" className="outline_btn transition">
            Home
          </Link>

          <Divider orientation="vertical" className="bg-white/30 h-[60%]" />

          <Link href="/schedule" className="outline_btn">
            Schedule
          </Link>
          <Divider orientation="vertical" className="bg-white/30 h-[60%]" />
          <Link href="/faqs" className="outline_btn">
            FAQs
          </Link>


          {user.role == "ADMIN" && (
            <>
              <Divider orientation="vertical" className="bg-white/30 h-[60%]" />
              <Link href="/admin" className="outline_btn">
                Backoffice
              </Link>
            </>

          )}
        </div>

        {user.name ? (
          <div className="flex gap-3 md:gap-5">
            <Button
              color="danger"
              variant="shadow"
              className="font-comfortaa font-bold text-white"
              onClick={signOut}
            >
              Sign Out
            </Button>

            <Link
              href={`/profile/${user.id}`}
              className="flex justify-center items-center gap-4"
            >
              <Avatar src="/user.svg" alt="profile" />
              <span className="text-white font-comfortaa text-sm">
                Logged as <strong className="font-bold">{user.name}</strong>
              </span>
            </Link>
          </div>
        ) : status == "loading" && !user.name ? (
          <div className="flex items-center gap-3 md:gap-5">
            <Spinner color="white" size="sm" />
            <span className="text-white font-poppins text-sm">Loading</span>
          </div>
        ) : (
          <Button
            color="success"
            variant="ghost"
            className="font-comfortaa font-bold"
            onClick={() => router.push("/auth/signin")}
          >
            Sign In
          </Button>
        )}
      </div>

      {/* Mobile  */}


      <div className="md:hidden flex">
        <div className={`absolute w-full h-screen flex flex-col justify-center items-center backdrop-blur-sm bg-neutral-500/50 duration-1000 ${toggleDropdown ? "transform-none" : "-translate-x-full"}`}>
          <div className="flex flex-col gap-4 w-full">
            <Link
              href="/"
              className="dropdown_link "
              onClick={() => setToggleDropdown(false)}>
              Home
            </Link>

            <Link
              href="/schedule"
              className="dropdown_link"
              onClick={() => setToggleDropdown(false)}>
              Schedule
            </Link>

            <Link
              href="/faqs"
              className="dropdown_link"
              onClick={() => setToggleDropdown(false)}>
              FAQs
            </Link>

            {user ? (
              <>
                <Link
                  href={`/profile/${user.id}`}
                  className="dropdown_link"
                  onClick={() => setToggleDropdown(false)}>
                  Profile
                </Link>

                <button
                  type="button"
                  onClick={() => setToggleDropdown(false)}
                  className="black_btn w-11/12 m-auto mt-20 ">
                  Sign Out
                  <span className="ml-[24px]">
                    <PiSignOutDuotone
                      size={22}
                      color="white hover:black"
                    />
                  </span>
                </button>
              </>
            ) : (
              <button type="button" className="black_btn w-full mt-5">
                Sign in
              </button>
            )}
          </div>
        </div>
        <div onClick={() => setToggleDropdown(!toggleDropdown)} className="flex-col flex gap-1 items-end   w-11/12  m-auto py-4 cursor-pointer">

          <div className={`h-[4px] w-[24px] rounded-3xl bg-white  transition-all ${toggleDropdown && "rotate-45 translate-y-2"}`}>
          </div>
          <div className={`h-[4px] w-[24px] bg-white rounded-3xl duration-700  ${toggleDropdown && "-translate-y-32 -translate-x-32 rotate-180"}`}>
          </div>
          <div className={`h-[4px] w-[24px] bg-white rounded-3xl transition-all  ${toggleDropdown && "-rotate-45 -translate-y-2"}`}>
          </div>

        </div>
      </div>

    </nav>
  );
};

export default Nav;
