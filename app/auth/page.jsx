"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

// TODO: Use Axios for http requests instead of fetch()

export default function Auth() {
  const router = useRouter();
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const { message } = await res.json();
      setErrorMessage(message);
    } else {
      router.refresh();
      router.push("/");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-3 w-1/2">
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
        <button type="submit" className="bg-blue-300 hover:bg-blue-100">
          Create User
        </button>
        <p>{errorMessage}</p>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </>
  );
};
