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
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const router = useRouter();

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
        }).then((res) => {
          if (res.ok) {
            router.push("/");
            setError(false);
          } else {
            setError(true);
          }
        })
      }

    } catch (error) {
      // TODO: Error handling
      console.log(error);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b to-20% from-custom-blue-1 to-custom-blue-3 flex justify-around items-center">

      <Image width={500} height={500} src="/sci-logo.png" alt="Logo" className="lg:block hidden"></Image>

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
        {error && <div className="bg-red-500 p-2 text-white mt-3 rounded">An error happened</div>}
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
