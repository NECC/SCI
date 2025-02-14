"use client";

import { Button, Input, Spinner } from "@nextui-org/react";
import { CiMail } from "react-icons/ci";
import { RiLockPasswordLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSchema } from "@prisma/zod";
import { UserPostRegisterResponse } from "@app/api/users/register/route";

export default function SignUpPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting },
  } = useForm({
    resolver: zodResolver(UserSchema),
  });

  const onSubmit = (formData) => {
    setLoading(true);
    axios.post<UserPostRegisterResponse>("/api/users/register", formData).then((res) => {
      if (res.status == 200) {
        console.log(res)
        if (res.data.response == "error") {
          setError(res.data.error);
          setLoading(false);
        } else {
          signIn("credentials", {
            email: formData.email.toLowerCase(),
            password: formData.password,
            redirect: false,
          }).then((res) => {
            console.log(res)
            if (res.error) {
              setError("An error occurred! Try again")
              setLoading(false);
            } else {
              router.push("/");
              setLoading(false);
            }
          });
        }
      }
    });
  };

  return (
    <div className="h-screen bg-gradient-to-l from-custom-blue-3 to-custom-blue-1 flex justify-around items-center">
      <Image
        width={500}
        height={500}
        src="/sci-logo2025.png"
        alt="Logo"
        className="lg:block hidden"
      ></Image>

      <div className="flex justify-center items-center flex-col ">
        <h1 className="font-bold text-4xl text-white cursor-default ">
          Register
        </h1>
        <h2 className="text-md mt-2 -mb-2 text-white cursor-default">
          Let&apos;s discover a new world together!
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-center gap-1 mt-1"
          noValidate
        >
          <Input
            type="text"
            placeholder="First and Last Name"
            labelPlacement="outside"
            className="w-[300px] mt-5 text-white"
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
                "bg-none"
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
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message as string}
            {...register("name")}
          />
          <Input
            type="password"
            placeholder="********"
            labelPlacement="outside"
            className="w-[300px] mt-2 text-white"
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
                "bg-none"
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
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message as string}
            {...register("password")}
          />

          <Input
            type="email"
            placeholder="you@example.com"
            labelPlacement="outside"
            className="w-[300px] mt-2 text-white"
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
                "bg-none"
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
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message as string}
            {...register("email")}
          />

          <Link
            href="/auth/signin"
            className=" text-sm mt-3 text-white cursor-pointer font-normal hover:text-white/80"
          >
            Already have an account? &nbsp;
            <span className="font-bold">Sign In!</span>
          </Link>
          {error && (
            <div className="bg-red-500 p-2 text-white mt-3 rounded">
              {error}
            </div>
          )}
          <Button
            type="submit"
            className="mt-3 w-[300px] lg:font-normal text-lg text-black bg-white font-bold "
            size="lg"
            color="primary"
            variant="shadow"
          >
            {
              (isLoading || loading || isSubmitting) ? <Spinner color="primary" size="md" /> : "Sign Up"
            }
          </Button>
        </form>
      </div>
    </div>
  );
}
