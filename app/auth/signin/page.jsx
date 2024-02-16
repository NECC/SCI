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
    <div className="h-screen w-screen bg-gradient-to-b to-20% from-custom-blue-1  to-custom-blue-3 flex justify-around items-center ">
      <div className="h-[500px] w-[500px] bg-[url('/sci-logo.png')] dark:ml-[100px] dark:xl:ml-[250px] bg-no-repeat bg-contain bg-center"></div>

      <div className="flex justify-center items-center flex-col">
        <h1 className="font-bold text-4xl text-white cursor-default">Login</h1>
        <h2 className="text-md font-normal lg:font-bold mt-2 -mb-2 text-white cursor-default">
          The science of today is the technology of tomorrow.
        </h2>
        <Input
          type="email"
          placeholder="you@example.com"
          labelPlacement="outside"
          className="w-[300px] mt-5 text-white"
          name="email"
          value={formData.email}
          onChange={handleChange}
          classNames={{
            input: [
              "border-none",
              "border-b-2",
              "rounded-none",
              "rounded-b-lg",
              "light:text-black",
              "",
              "font-bold",
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
            <CiMail className="text-2xl text-white pointer-events-none flex-shrink-0" />
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
              "font-bold",
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
        <Link
          href="/auth/signup"
          className=" text-sm mt-3 text-white cursor-pointer font-normal hover:text-white/80"
        >
          Don&apos;t have an account? &nbsp;
          <span className="font-bold">
            Sign Up!
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
