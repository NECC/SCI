"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { FiX } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

// TODO: Mobile navbar with transition
// TODO: Transform the Navbar in a Server Component -> This will let the navbar be rendered in the server and not in the client, so it won't load the state of the session

// WARN: Eu so fiz a conexão da navbar com backend para desktop, mobile ainda nao esta feito

const Navbar = (props) => {
  const [user, setUser] = useState({});
  const [toggleDropdown, setToggleDropdown] = useState(false);

  const { data: session } = useSession({
    required: false,
  });

  useEffect(() => {
    if (session) setUser(session.user);
  }, [session]);

  return (
    <div className="w-full bg-gradient-to-r from-custom-blue-1 from-25% via via-30% to-emerald-500 to-90% relative">
      <nav className="flex justify-between w-11/12 m-auto p-4 sm:w-4/5 ">
        <Link href="/" className="flex items-end gap-2 ">
          <Image
            src="/logo_4.png"
            alt="logo"
            width={70}
            height={70}
            className="object-contain"
          />
        </Link>

        {/* Desktop Navigation */}

        <div className="sm:flex hidden gap-3 md:gap-5">
          <div className="flex gap-3 md:gap-5">
            <Link href="/" className="outline_btn ">
              Home
            </Link>

            <Link href="/schedule" className="outline_btn font-poppin">
              schedule
            </Link>
          </div>

          {user.name ? (
            <div className="flex gap-3 md:gap-5">
              <button onClick={signOut} type="button" className="black_btn">
                Sign Out
              </button>

              <Link href="/profile" className="flex items-center">
                <Image
                  src="/user.svg"
                  width={37}
                  height={37}
                  className="rounded-full"
                  alt="profile"
                />
                Logged as {user.name}
              </Link>
            </div>
          ) : (
            <div className="flex gap-3 md:gap-5">
              <Link
                href="/api/auth/signin"
                className="flex items-center black_btn"
              >
                SignIn
              </Link>
            </div>
          )}
        </div>

        {/* Mobile  */}

        <div className="sm:hidden flex">
          <div
            className="text-3xl flex items-center "
            onClick={() => setToggleDropdown(!toggleDropdown)}
          >
            {toggleDropdown ? <FiX /> : <IoMenu />}
          </div>

          {toggleDropdown && (
            <div className="dropdown">
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
                    className="black_btn w-full mt-5"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button type="button" className="black_btn w-full mt-5">
                  Sign in
                </button>
              )}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
