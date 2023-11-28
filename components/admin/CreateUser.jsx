"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function CreateUser() {
  const router = useRouter();
  const [formData, setFormData] = useState({ role: "USER" });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    axios
      .post("/api/users", formData)
      .then((res) => {
        if (res.status == 200) {
          router.push("/");
        } else {
          setErrorMessage(res.data.message);
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
        className="flex flex-col items-center justify-center gap-1"
      >
        <h1> Create New User </h1>
        <input
          type="text"
          name="name"
          placeholder="Name"
          required={true}
          value={formData.name}
          onChange={handleChange}
          className="mx-2 rounded border p-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required={true}
          value={formData.email}
          className="mx-2 rounded border p-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required={true}
          value={formData.password}
          className="mx-2 rounded border p-2"
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
        <button type="submit" className="bg-blue-300 hover:bg-blue-100">
          Create User
        </button>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </form>
    </>
  );
}
