"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
} from "@nextui-org/react";

export default function CreateActivity() {
  const router = useRouter();
  const [formData, setFormData] = useState({ type: "WORKSHOP" });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    console.log(formData);
    const value = e.target.value;
    const name = e.target.name;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    axios
      .post("/api/activities", {
        title: formData.title,
        date: formData.day,
        startTime: formData.start,
        endTime: formData.end,
        description: formData.description,
        location: formData.location,
        capacity: parseInt(formData.capacity),
        speakers: formData.speakers,
        type: formData.type,
      })
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
        className="flex flex-col items-center justify-center gap-1 mt-1"
      >
        <Card className="w-[250px]">
          <CardHeader className="flex justify-center bg-black text-white">
            Create New Activity
          </CardHeader>
          <Divider />
          <CardBody className="flex flex-col items-center justify-center gap-1">
            <Input
              key="primary"
              color="default"
              type="text"
              label="Title"
              className="max-w-[220px]"
              required={true}
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            <Input
              key="day"
              color="default"
              type="date"
              name="day"
              label="Date"
              placeholder="Date"
              className="max-w-[220px]"
              required={true}
              value={formData.day}
              onChange={handleChange}
            />
            <Input
              key="start"
              color="default"
              type="time"
              name="start"
              label="Start Time"
              placeholder="Start Time"
              className="max-w-[220px]"
              required={true}
              value={formData.start}
              onChange={handleChange}
            />
            <Input
              key="end"
              color="default"
              type="time"
              name="end"
              label="End Time"
              placeholder="End Time"
              className="max-w-[220px]"
              required={true}
              value={formData.end}
              onChange={handleChange}
            />
            <Input
              key="description"
              color="default"
              type="text"
              name="description"
              label="Description"
              placeholder="Description"
              className="max-w-[220px]"
              required={true}
              value={formData.description}
              onChange={handleChange}
            />
            <Input
              key="location"
              color="default"
              type="text"
              name="location"
              label="Location"
              placeholder="Location"
              className="max-w-[220px]"
              required={true}
              value={formData.location}
              onChange={handleChange}
            />
            <Input
              key="capacity"
              color="default"
              type="number"
              name="capacity"
              label="Capacity"
              placeholder="Capacity"
              className="max-w-[220px]"
              required={true}
              value={formData.capacity}
              onChange={handleChange}
            />
            <Input
              key="speakers"
              color="default"
              type="text"
              name="speakers"
              label="Speakers"
              placeholder="Speakers"
              className="max-w-[220px]"
              required={true}
              value={formData.speakers}
              onChange={handleChange}
            />
            <select
              name="type"
              onChange={handleChange}
              required={true}
              value={formData.type}
              className="mx-2 rounded border p-2"
            >
              <option value="WORKSHOP">WORKSHOP</option>
              <option value="TALK">TALK</option>
              <option value="OTHER">OTHER</option>
            </select>
          </CardBody>
          <button type="submit" className="bg-black hover:bg-slate-800 text-white">
            Create Activity
          </button>
        </Card>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </form>
    </>
  );
}
