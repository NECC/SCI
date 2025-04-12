"use client";

import { useState } from "react";
import axios from "axios";
import { Card, CardBody, CardHeader, Divider, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";

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
}