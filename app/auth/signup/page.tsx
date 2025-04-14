"use client";

import { Button, Input, Spinner, Select, SelectItem } from "@nextui-org/react";
import { CiMail } from "react-icons/ci";
import { FaIdCard, FaUniversity } from "react-icons/fa";
import { FaGraduationCap } from "react-icons/fa6";
import { RiLockPasswordLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CourseSchema, UserSchema } from "@prisma/zod";
import { UserPostRegisterResponse } from "@app/api/users/register/route";

const Courses = CourseSchema.options;

const FormattedCourses = ["Biologia Aplicada", 
                          "Biologia e Geologia", 
                          "Bioquímica", 
                          "Ciência de Dados", 
                          "Ciências da Computação", 
                          "Ciências do Ambiente", 
                          "Estatística Aplicada", 
                          "Física", 
                          "Geologia", 
                          "Matemática", 
                          "Optometria e Ciências da Visão ", 
                          "Química"
                        ]

export default function SignUpPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isPart, setIsPart] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    unregister,
    formState: { errors, isLoading, isSubmitting, },
  } = useForm<FormData>({
    resolver: zodResolver(UserSchema),
    shouldUnregister: false,
  });

  const handleNext = async () => {
    const isStepValid = await trigger(["name","email","password"]);
    if (isStepValid) {setPage(1)};
  };

  interface FormData {
    name: string;
    email: string;
    password: string;
    academicNumber?: number;
    graduation?: string;
    courseYear?: number;
  }

  const onSubmit = (formData: FormData): void => {
    setLoading(true);
    axios.post<UserPostRegisterResponse>("/api/users/register", formData).then((res) => {
      if (res.status == 200) {
        if (res.data.error && res.data.response == "error") {
          setError(res.data.error);
          setLoading(false);
        } else {
          signIn("credentials", {
            email: formData.email.toLowerCase(),
            password: formData.password,
            redirect: false,
          }).then((res) => {
            console.log(res)
            if (res && res.error) {
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
          className="flex flex-col items-center justify-center"
          noValidate
        >
          {page == 0 && (
            <div className="flex flex-col items-center justify-center gap-1 mt-1">
              <Input
              type="text"
              placeholder="First and Last Name"
              defaultValue={watch("name")}
              labelPlacement="outside"
              className="w-[350px] mt-5 text-white"
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
              defaultValue={watch("password")}
              labelPlacement="outside"
              className="w-[350px] mt-2 text-white"
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
              isRequired
              type="email"
              placeholder="you@example.com"
              defaultValue={watch("email")}
              labelPlacement="outside"
              className="w-[350px] mt-2 text-white"
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
              type="button"
              className="mt-3 w-[350px] lg:font-normal text-lg text-black bg-white font-bold "
              size="lg"
              color="primary"
              variant="shadow"
              onClick={handleNext}
            >
              {
                (isLoading || loading ) ? <Spinner color="primary" size="md" /> : "Next"
              }
            </Button>
          </div>)} 
          { page == 1 &&(
            <div className="flex flex-col items-center justify-center gap-1 mt-1">
              <Select
                disallowEmptySelection
                defaultSelectedKeys={isPart ? ["YES"] : ["NO"]}
                label="Are you part of the School of Sciences?"
                placeholder=""
                labelPlacement="inside"
                className="w-[350px] mt-5 text-white"
                classNames={{
                  label: ["text-white/60"],
                  value: ["text-white"],
                  mainWrapper: [
                      "border-none",
                      "border-b-2",
                      "rounded-none",
                      "rounded-b-lg",
                      "light:text-black",
                      "dark:text-white",
                      "overflow-hidden",
                      "font-normal",
                      "text-md",
                      "placeholder:text-white/60",
                      "bg-none"
                    ],
                    innerWrapper: ["bg-transparent"],
                    listboxWrapper: [
                      "dark:text-white",
                      "light:text-black",
                      "shadow-md",
                      "bg-white",
                      "backdrop-blur-xl",
                      "backdrop-saturate-200",
                      "hover:bg-default-0/70",
                      "dark:hover:bg-default/70",
                      "group-data-[focused=true]:bg-default-200/50",
                      "dark:group-data-[focused=true]:bg-default/60",
                      "!cursor-text",
                    ],
                    trigger: [
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
                  <FaUniversity className="text-2xl text-white pointer-events-none flex-shrink-0" />
                }
              >
                <SelectItem
                  key="YES"
                  value="YES"
                  onClick={() => {
                    setIsPart(true);
                  }}
                >
                  Yes
                </SelectItem>
                <SelectItem
                  key="NO"
                  value="NO"
                  onClick={() => {
                    setIsPart(false);
                    {unregister(["academicNumber","graduation","courseYear"])}
                  }}
                >
                  No
                </SelectItem>
              </Select>
              { isPart && (
                <div>
                  <Select
                    disallowEmptySelection
                    label="Course"
                    labelPlacement="inside"
                    className="w-[350px] mt-2 text-white"
                    classNames={{
                      label: ["text-white/60"],
                      value: ["text-white"],
                      base: [
                          "border-none",
                          "border-b-2",
                          "rounded-none",
                          "rounded-b-lg",
                          "light:text-black",
                          "dark:text-white",
                          "overflow-hidden",
                          "font-normal",
                          "text-md",
                          "placeholder:text-white/60",
                          "bg-none"
                        ],
                        innerWrapper: ["bg-transparent"],
                        listboxWrapper: [
                          "dark:text-white",
                          "light:text-black",
                          "shadow-md",
                          "bg-white",
                          "backdrop-blur-xl",
                          "backdrop-saturate-200",
                          "hover:bg-default-0/70",
                          "dark:hover:bg-default/70",
                          "group-data-[focused=true]:bg-default-200/50",
                          "dark:group-data-[focused=true]:bg-default/60",
                          "!cursor-text",
                        ],
                        trigger: [
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
                        <FaGraduationCap className="text-2xl text-white pointer-events-none flex-shrink-0" />
                      }
                      isInvalid={!!errors.graduation}
                      errorMessage={errors.graduation?.message as string}
                      defaultSelectedKeys={watch("graduation") ? [watch("graduation") as string] : [Courses[4]]}
                      {...register("graduation")}
                    > 
                    {Courses.map((course,index) => 
                      <SelectItem key={course} value={course}>{FormattedCourses[index]}</SelectItem>
                    )}
                  </Select>
                  <Input
                    type="number"
                    placeholder="123456"
                    defaultValue={watch("academicNumber") ? String(watch("academicNumber")) : "0"}
                    labelPlacement="outside"
                    className="w-[350px] mt-2 text-white"
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
                      <FaIdCard className="text-2xl text-white pointer-events-none flex-shrink-0" />
                    }
                    isInvalid={!!errors.academicNumber}
                    errorMessage={errors.academicNumber?.message as string}
                    {...register("academicNumber", {valueAsNumber: true})}
                  />
                  <Input
                    type="number"
                    placeholder="2"
                    defaultValue={watch("courseYear") ? String(watch("courseYear")) : ""}
                    labelPlacement="outside"
                    className="w-[350px] mt-2 text-white"
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
                    endContent={
                      <AiOutlineFieldNumber className="text-2xl text-white pointer-events-none flex-shrink-0" />
                    }
                    isInvalid={!!errors.courseYear}
                    errorMessage={errors.courseYear?.message as string}
                    {...register("courseYear", {valueAsNumber: true})}
                  />
              </div>
            )}

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
              <div className="gap-1 flex flex-row">
                <Button
                  type="button"
                  className="mt-3 w-[175px] lg:font-normal text-lg text-black bg-white font-bold "
                  size="lg"
                  color="primary"
                  variant="shadow"
                  onClick={() => {
                    setPage(0);
                  }}
                >
                  {
                    (isLoading || loading || isSubmitting) ? <Spinner color="primary" size="md" /> : "Back"
                  }
                </Button>
                <Button
                  type="submit"
                  className="mt-3 w-[175px] lg:font-normal text-lg text-black bg-white font-bold "
                  size="lg"
                  color="primary"
                  variant="shadow"
                >
                  {
                    (isLoading || loading || isSubmitting) ? <Spinner color="primary" size="md" /> : "Sign Up"
                  }
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
