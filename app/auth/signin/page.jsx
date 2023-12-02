"use client";

import { Button, Input } from "@nextui-org/react";
import { CiMail } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function SignInPage() {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    // console.log(formData);
    const value = e.target.value;
    const name = e.target.name;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    signIn("credentials", {
      email: formData.email,
      password: formData.password,
      callbackUrl: "/",
    });
  };

  return (
    <div className="flex">
      <div className="hidden bg-gradient-to-br to-80% from-custom-blue-1  to-blue-700 h-screen flex-1 lg:flex justify-center items-center gap-3 shadow-[15px_0px_30px_rgba(0,0,0,0.3)] border-black ">
        <div className="h-[300px] w-[300px] bg-[url('/sci-logo.png')] bg-no-repeat bg-contain bg-center"></div>
      </div>
      <div className="h-screen flex flex-1 justify-center items-center flex-col bg-gradient-to-br to-80% from-custom-blue-1 to-blue-700 lg:bg-none">
        <h1 className="font-poppins font-bold text-4xl lg:text-custom-blue-1 text-white">
          Login
        </h1>
        <h2 className="font-comfortaa text-md lg:font-bold  lg:text-black text-white">
          The science of today is the technology of tomorrow.
        </h2>
        <Input
          type="email"
          placeholder="you@example.com"
          labelPlacement="outside"
          className="w-[300px] mt-5"
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
              "text-black",
              "font-comfortaa",
              "font-bold",
              "text-md",
              "placeholder-black",
              "placeholder-opacity-50",
              "placeholder-[#6C63FF]",
            ],
            inputWrapper: [
              "shadow-xl",
              "bg-default-100",
              "dark:bg-default/60",
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
          variant="faded"
          startContent={
            <CiMail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
        />
        <Input
          type="password"
          placeholder="********"
          labelPlacement="outside"
          className="w-[300px] mt-2"
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
              "text-black",
              "font-comfortaa",
              "font-bold",
              "text-md",
              "placeholder-black",
              "placeholder-opacity-50",
              "placeholder-[#6C63FF]",
            ],
            inputWrapper: [
              "shadow-xl",
              "bg-default-100",
              "dark:bg-default/60",
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
          variant="faded"
          startContent={
            <RiLockPasswordLine className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
        />

        <Link
          href="/auth/signup"
          className="font-comfortaa text-sm mt-3 lg:text-black text-white cursor-pointer  font-bold underline"
        >
          Don&apos;t have an account? Sign Up!
        </Link>

        <Button
          className="mt-3 w-[300px] lg:font-normal  text-lg text-black bg-white lg:bg-blue-600 lg:text-white font-comfortaa"
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
