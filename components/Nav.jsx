"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { PiSignOutDuotone } from "react-icons/pi";
import { Button, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";

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

  useEffect(() => {
    if (toggleDropdown) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [toggleDropdown]);

  return (
    // do not delete h[72px] and flex items-center
    <nav className="relative z-50 bg-gradient-to-l from-custom-blue-3 to-custom-blue-1 h-[72px] flex items-center">
      {/* Desktop Navigation */}

      <div className="md:flex hidden lg:gap-5 gap-3 items-center w-4/5 m-auto py-4">
        <Link href="/" className="nav_btn text-base">
          Home
        </Link>
        <div className="w-[1px] h-[20px] rounded-full bg-white/50"></div>
        <Link href="/schedule" className="nav_btn text-base">
          Schedule
        </Link>
        <div className="w-[1px] h-[20px] rounded-full bg-white/50"></div>
        <Link href="/faqs" className="nav_btn text-base">
          FAQs
        </Link>
        {user.role == "ADMIN" && (
          <>
            <div className="w-[1px] h-[20px] rounded-full bg-white/50"></div>
            <Link href="/admin" className="nav_btn text-base">
              Backoffice
            </Link>
          </>
        )}

        {user.name ? (
          <div className="flex w-full justify-end items-center lg:gap-3 gap-2">
            <Link href={`/profile/${user.id}`} className="nav_btn text-base">
              Logged as{" "}
              <strong className="font-bold text-lg ml-2">{user.name}</strong>
            </Link>

            <Button
              className="font-poppins font-normal text-base text-white bg-blue-950"
              onClick={signOut}
            >
              Sign Out
            </Button>
          </div>
        ) : status == "loading" && !user.name ? (
          <div className="flex items-center lg:gap-5 gap-3 ">
            <Spinner color="white" size="sm" />
            <span className="text-white font-poppins text-sm">Loading</span>
          </div>
        ) : (
          <>
            <div className="w-[1px] h-[20px] rounded-full bg-white/50"></div>

            <Button
              color="white"
              variant="ghost"
              className="font-comfortaa font-bold text-white"
              onClick={() => router.push("/auth/signin")}
            >
              Sign In
            </Button>
          </>
        )}
      </div>

      {/* Mobile  */}

      <div className="md:hidden flex">
        <div
          className={`absolute w-full h-screen flex flex-col justify-center items-center backdrop-blur-sm bg-neutral-500/50 duration-1000 -mt-[10px] ${
            toggleDropdown ? "transform-none" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col gap-4 w-full">
            <Link
              href="/"
              className="nav_btn text-2xl "
              onClick={() => setToggleDropdown(false)}
            >
              Home
            </Link>

            <Link
              href="/schedule"
              className="nav_btn text-2xl"
              onClick={() => setToggleDropdown(false)}
            >
              Schedule
            </Link>

            <Link
              href="/faqs"
              className="nav_btn text-2xl"
              onClick={() => setToggleDropdown(false)}
            >
              FAQs
            </Link>

            {user.name ? (
              <>
                <Link
                  href={`/profile/${user.id}`}
                  className="nav_btn text-2xl "
                  onClick={() => setToggleDropdown(false)}
                >
                  Profile
                </Link>

                <Button
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut();
                  }}
                  className="blue_btn"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                className="blue_btn"
                onClick={() => {
                  router.push("/auth/signin");
                  setToggleDropdown(false);
                }}
              >
                Sign in
              </Button>
            )}
          </div>
        </div>
        <div
          onClick={() => setToggleDropdown(!toggleDropdown)}
          className="flex-col flex gap-1 items-end w-11/12 ml-4 m-auto py-4 cursor-pointer"
        >
          <div
            className={`h-[4px] w-[24px] rounded-3xl bg-white  transition-all ${
              toggleDropdown && "rotate-45 translate-y-2"
            }`}
          ></div>
          <div
            className={`h-[4px] w-[24px] bg-white rounded-3xl duration-700  ${
              toggleDropdown && "-translate-y-32 -translate-x-32 rotate-180"
            }`}
          ></div>
          <div
            className={`h-[4px] w-[24px] bg-white rounded-3xl transition-all  ${
              toggleDropdown && "-rotate-45 -translate-y-2"
            }`}
          ></div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
