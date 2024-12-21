"use client";

import { useState } from "react";
import axios from "axios";
import { Card, CardBody, CardHeader, Divider, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { UserPostResponse } from "@app/api/users/route";

export default function CreateUser() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    // console.log(formData);
    const value = e.target.value;
    const name = e.target.name;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    axios
      .post<UserPostResponse>("/api/users", formData)
      .then((res) => {
        if (res.status == 200) {
          router.push("/admin");
        } else {
          setErrorMessage(res.data.error);
        }
      })
      .catch((err) => {
        setErrorMessage(err.message);
      });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-1 mt-1"
      >
        <Card className="w-[250px]">
          <CardHeader className="flex justify-center bg-black text-white">
            Create New User
          </CardHeader>
          <Divider />
          <CardBody className="flex flex-col items-center justify-center gap-1">
            <Input
              key="primary"
              color="default"
              type="text"
              label="Name"
              className="max-w-[220px]"
              required={true}
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <Input
              key="email"
              color="default"
              type="email"
              label="Email"
              name="email"
              className="max-w-[220px]"
              required={true}
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              key="password"
              color="default"
              type="password"
              label="Password"
              name="password"
              className="max-w-[220px]"
              required={true}
              value={formData.password}
              onChange={handleChange}
            />
            <select
              name="role"
              onChange={handleChange}
              required={true}
              value={formData.role}
              className="mx-2 rounded border p-2"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </CardBody>
          <button
            type="submit"
            className="bg-black hover:bg-slate-800 text-white"
          >
            Create User
          </button>
        </Card>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </form>
    </>
  );
}
