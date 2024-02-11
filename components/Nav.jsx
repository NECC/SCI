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
    <div className="w-full block z-50 bg-sky-400">
      <nav className="flex justify-between w-auto m-auto py-4 md:w-4/5 bg-transparent">
        {/* Desktop Navigation */}
        <div className="md:flex hidden gap-3 md:gap-5">
          <div className="flex gap-3 md:gap-5 relative items-center justify-center">
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

          <div className="float-right">
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
            ) : (
              <div className="flex gap-3 md:gap-5">
                <Button
                  className="hidden md:flex text-white bg-transparent border-1 float-right font-bold"
                  onClick={() => router.push("/auth/signin")}
                >
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile  */}

        <div className="md:hidden flex z-10">
          <div className="flex w-full justify-center items-center">
            <div
              onClick={() => setToggleDropdown(!toggleDropdown)}
              className="flex-col flex gap-1 h-full  items-center justify-center"
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
                } `}
              ></div>
            </div>
          </div>
          <div
            className={`absolute right-0 top-full w-full min-w-[210px] flex backdrop-blur-sm bg-neutral-500/50 duration-1000 h-screen  ${
              toggleDropdown ? "transform-none" : "-translate-x-full"
            }`}
          >
            <div className="m-auto w-full">
              <div className="flex flex-col gap-4 ">
                <Link
                  href="/"
                  className="dropdown_link "
                  onClick={() => setToggleDropdown(false)}
                >
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
                      className="black_btn w-11/12 m-auto mt-20 "
                    >
                      Sign Out
                      <span className="ml-[24px]">
                        <PiSignOutDuotone size={22} color="white hover:black" />
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
          </div>

        </div>
      </nav>
    </div>

  );
};

export default Nav;
