"use client";

import { Button, Input } from "@nextui-org/react";
import { CiMail } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SignUpPage() {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    // console.log(formData);
    const value = e.target.value;
    const name = e.target.name;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    try {
      const res = await axios.post("/api/users/register", formData);
      if (res.status == 200) {
        signIn("credentials", {
          email: formData.email,
          password: formData.password,
          callbackUrl: "/",
        });
      }
    } catch (error) {
      // TODO: Error handling
      console.log(error);
    }
  };

  return (
    //     <div className="flex">
    //       <div className="hidden dark:bg-[url('/rectangle.png')] dark:bg-no-repeat dark:bg-bottom dark:bg-cover bg-gradient-to-br to-80% from-custom-blue-1  to-blue-700 h-screen dark:w-full flex-1 lg:flex dark:justify-start justify-center items-center gap-3 shadow-[15px_0px_30px_rgba(0,0,0,0.3)] border-black">
    //         <div className="h-[300px] w-[300px] bg-[url('/sci-logo.png')] dark:ml-[100px] dark:xl:ml-[250px] bg-no-repeat bg-contain bg-center"></div>
    //       </div>
    //       <div className="h-screen flex flex-1 justify-center items-center flex-col dark:lg:bg-none dark:bg-[url('/rectangle.png')] dark:bg-no-repeat dark:bg-bottom dark:bg-cover bg-gradient-to-br to-80% from-custom-blue-1 to-blue-700 lg:bg-none light:bg-white dark:lg:absolute dark:right-[200px] dark:xl:right-[300px]">
    //       <h1 className=" font-bold text-4xl dark:lg:text-white lg:text-custom-blue-1 text-white">
    //           Register
    //         </h1>
    //         <h2 className="font-comfortaa text-md lg:font-bold mt-2 -mb-2 dark:lg:text-white lg:text-black text-white">
    //           Let&apos;s discover a new world together!
    //         </h2>
    //         <Link href='/auth/signin' className="font-comfortaa text-sm mt-3 dark:lg:text-white lg:text-black text-white cursor-pointer  font-bold underline"
    // >
    //           Already have an account?
    //         </Link>

    //         <Button
    //           className="mt-3 w-[300px] lg:font-normal  text-lg dark:lg:bg-white dark:lg:text-black bg-white text-black lg:bg-blue-600 lg:text-white font-comfortaa"
    //           size="large"
    //           auto
    //           color="primary"
    //           variant="shadow"
    //           onPress={handleSubmit}
    //         >
    //           Submit
    //         </Button>
    //       </div>
    //     </div>

    <div className="h-screen bg-gradient-to-b to-20% from-custom-blue-1 to-custom-blue-3 flex justify-around items-center">

      <Image width={500} height={500} src="/sci-logo.png" alt="Logo" className="md:block hidden"></Image>

      <div className="flex justify-center items-center flex-col ">
        <h1 className="font-bold text-4xl text-white cursor-default ">Register</h1>
        <h2 className="text-md mt-2 -mb-2 text-white cursor-default">
          Let&apos;s discover a new world together!
        </h2>
        <Input
          type="text"
          placeholder="Username"
          labelPlacement="outside"
          className="w-[300px] mt-5 text-white"
          name="name"
          value={formData.name}
          onChange={handleChange}
          classNames={{
            input: [
              "border-none",
              "border-b-2",
              "rounded-none",
              "rounded-b-lg",
              "light:text-black",
              "",
              "font-normal",
              "text-md",
              "placeholder:text-white/60",
            ],
            innerWrapper: ["bg-transparent"],
            inputWrapper: [
              "shadow-md",
              "bg-custom-blue-3",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-0/70",
              "dark:hover:bg-default/70",
              "group-data-[focused=true]:bg-default-200/50",
              "dark:group-data-[focused=true]:bg-default/60",
              "!cursor-text",
            ],
          }}
          color="primary"
          variant="bordered"
          size="lg"
          startContent={
            <CgProfile className="text-2xl text-white pointer-events-none flex-shrink-0" />
          }
        />
        <Input
          type="password"
          placeholder="********"
          labelPlacement="outside"
          className="w-[300px] mt-2 text-white"
          name="password"
          value={formData.password}
          onChange={handleChange}
          classNames={{
            input: [
              "border-none",
              "border-b-2",
              "border-custom-blue-2",
              "rounded-none",
              "rounded-b-lg",
              "light:text-black",
              "dark:text-white",
              "",
              "font-normal",
              "text-xl",
              "placeholder:text-white/60",
            ],
            innerWrapper: ["bg-transparent"],
            inputWrapper: [
              "shadow-md",
              "bg-custom-blue-3",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-0/70",
              "dark:hover:bg-default/70",
              "group-data-[focused=true]:bg-default-200/50",
              "dark:group-data-[focused=true]:bg-default/60",
              "!cursor-text",
            ],
          }}
          color="primary"
          variant="bordered"
          size="lg"
          startContent={
            <RiLockPasswordLine className="text-2xl text-white pointer-events-none flex-shrink-0" />
          }
        />

        <Input
          type="email"
          placeholder="you@example.com"
          labelPlacement="outside"
          className="w-[300px] mt-2 text-white"
          name="email"
          value={formData.email}
          onChange={handleChange}
          classNames={{
            input: [
              "border-none",
              "border-b-2",
              "border-custom-blue-2",
              "rounded-none",
              "rounded-b-lg",
              "light:text-black",
              "dark:text-white",
              "",
              "font-normal",
              "text-md",
              "placeholder:text-white/60",
            ],
            innerWrapper: ["bg-transparent"],
            inputWrapper: [
              "shadow-md",
              "bg-custom-blue-3",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-0/70",
              "dark:hover:bg-default/70",
              "group-data-[focused=true]:bg-default-200/50",
              "dark:group-data-[focused=true]:bg-default/60",
              "!cursor-text",
            ],
          }}
          size="lg"
          color="primary"
          variant="bordered"
          startContent={
            <CiMail className="text-2xl text-white pointer-events-none flex-shrink-0" />
          }
        />

        <Link
          href="/auth/signin"
          className=" text-sm mt-3 text-white cursor-pointer font-normal hover:text-white/80"
        >
          Already have an account? &nbsp;
          <span className="font-bold">
            Sign In!
          </span>
        </Link>

        <Button
          className="mt-3 w-[300px] lg:font-normal text-lg text-black bg-white font-bold "
          size="large"
          auto
          color="primary"
          variant="shadow"
          onPress={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
