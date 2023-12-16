"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { PiSignOutDuotone } from "react-icons/pi";
import { Avatar, Button, Divider, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";

// TODO: Mobile navbar with transition
// TODO: Transform the Navbar in a Server Component -> This will let the navbar be rendered in the server and not in the client, so it won't load the state of the session

// WARN: Eu so fiz a conexão da navbar com backend para desktop, mobile ainda nao esta feito

const Nav = (props) => {
  const [user, setUser] = useState({});
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const router = useRouter();

  const { data: session, status } = useSession({
    required: false,
  });

  useEffect(() => {
    if (session) setUser(session.user);
  }, [session]);  

  return (
    <div className="w-full bg-black  relative">
      <nav className="flex justify-between w-11/12 m-auto p-4 sm:w-4/5 ">
        <Link href="/" className="flex items-center gap-2 ">
          <Image
            src="/sci-logo.png"
            alt="logo"
            width={70}
            height={70}
          />
        </Link>

        {/* Desktop Navigation */}

        <div className="sm:flex hidden gap-3 md:gap-5">
          <div className="flex gap-3 md:gap-5 relative items-center justify-center">
            <Link href="/" className="outline_btn transition">
              Home
            </Link>

            <Divider orientation="vertical" className="bg-white/30 h-[60%]" />

            <Link href="/schedule" className="outline_btn">
              Schedule
            </Link>

            <Divider orientation="vertical" className="bg-white/30 h-[60%]" />
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
                href="/profile"
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
            <div className="flex gap-3 md:gap-5">
              <Button
                color="success"
                variant="ghost"
                className="font-comfortaa font-bold"
                onClick={() => router.push("/auth/signin")}
              >
                Sign In
              </Button>
            </div>
          )}
        </div>

        {/* Mobile  */}

        <div className="sm:hidden flex">
          <div className="flex w-full justify-center items-center ">
            <div
              onClick={() => setToggleDropdown(!toggleDropdown)}
              className="flex-col flex gap-1 h-full  items-center justify-center"
            >
              <div
                className={`h-[4px] w-[24px] rounded-3xl bg-white  transition-all ${
                  toggleDropdown ? "rotate-45 translate-y-2" : ""
                }`}
              ></div>
              <div
                className={`h-[4px] w-[24px] bg-white rounded-3xl duration-700  ${
                  toggleDropdown
                    ? "-translate-y-32 -translate-x-32 rotate-180"
                    : ""
                }`}
              ></div>
              <div
                className={`h-[4px] w-[24px] bg-white rounded-3xl transition-all  ${
                  toggleDropdown ? "-rotate-45 -translate-y-2" : ""
                } `}
              ></div>
            </div>
          </div>
          <div
            className={`dropdown duration-1000 h-screen ${
              toggleDropdown ? "transform-none" : "-translate-x-full "
            }`}
          >
            <Link
              href="/"
              className="dropdown_link"
              onClick={() => setToggleDropdown(false)}
            >
              Home
            </Link>

            <Link
              href="/schedule"
              className="dropdown_link"
              onClick={() => setToggleDropdown(false)}
            >
              Schedule
            </Link>

            {user ? (
              <>
                <Link
                  href="/profile"
                  className="dropdown_link"
                  onClick={() => setToggleDropdown(false)}
                >
                  Profile
                </Link>

                <button
                  type="button"
                  onClick={() => setToggleDropdown(false)}
                  className="black_btn w-11/12 m-auto mt-20 "
                >
                  Sign Out
                  <span className="ml-[24px]">
                    {" "}
                    <PiSignOutDuotone
                      size={22}
                      color="white hover:black"
                    />{" "}
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
      </nav>
    </div>
  );
};

export default Nav;
