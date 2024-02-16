"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Select,
  SelectItem
} from "@nextui-org/react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Types, ActivitySchema } from "/prisma/zod";

export default function CreateActivity() {
  const router = useRouter();
  const onSubmit = (formData) => {
    console.log(formData)
    axios
      .post("/api/activities", formData)
      .then((res) => {
        if (res.status == 200) {
          router.push("/admin");
        } else {
          console.log(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err.message)
      });
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ActivitySchema),
  });

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center gap-1 mt-1"
        noValidate
      >
        <Card className="w-[250px]">
          <CardHeader className="flex justify-center bg-black text-white">
            Create New Activity
          </CardHeader>
          <Divider />
          <CardBody className="flex flex-col items-center justify-center gap-1">
            <Input
              color="default"
              type="text"
              label="Title"
              className="max-w-[220px]"
              isInvalid={!!errors.title}
              errorMessage={errors.title?.message}
              {...register('title')}
            />
            <Input
              color="default"
              type="date"
              label="Date"
              className="max-w-[220px]"
              isInvalid={!!errors.date}
              errorMessage={errors.date?.message}
              {...register('date')}
            />
            <Input
              color="default"
              type="time"
              label="Start Time"
              className="max-w-[220px]"
              isInvalid={!!errors.startTime}
              errorMessage={errors.startTime?.message}
              {...register('startTime')}
            />
            <Input
              color="default"
              type="time"
              label="End Time"
              className="max-w-[220px]"
              isInvalid={!!errors.endTime}
              errorMessage={errors.endTime?.message}
              {...register('endTime')}
            />
            <Input
              color="default"
              type="text"
              label="Description"
              className="max-w-[220px]"
              isInvalid={!!errors.description}
              errorMessage={errors.description?.message}
              {...register('description')}
            />
            <Input
              color="default"
              type="text"
              label="Location"
              className="max-w-[220px]"
              isInvalid={!!errors.location}
              errorMessage={errors.location?.message}
              {...register('location')}
            />
            <Input
              color="default"
              type="number"
              placeholder="0"
              label="Capacity"
              className="max-w-[220px]"
              isInvalid={!!errors.capacity}
              errorMessage={errors.capacity?.message}
              {...register('capacity')}
            />
            <Input
              color="default"
              type="text"
              label="Speakers"
              className="max-w-[220px]"
              isInvalid={!!errors.speakers}
              errorMessage={errors.speakers?.message}
              {...register('speakers')}
            />
            <Select
              label="Type"
              className="max-w-xs"
              isInvalid={!!errors.type}
              errorMessage={errors.type?.message}
              defaultSelectedKeys={Types[0]}
              {...register('type')}
            >
              {Types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </Select>
          </CardBody>
          <button type="submit" className="bg-black hover:bg-slate-800 text-white">
            Create Activity
          </button>
        </Card>
      </form>
    </>
  );
}
