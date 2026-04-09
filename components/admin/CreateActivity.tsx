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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Types, ActivitySchema } from "@prisma/zod";

export default function CreateActivity() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ActivitySchema),
    defaultValues: {
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      description: "",
      location: "",
      capacity: 0,
      speakers: "",
      points: 0,
      type: Types[0],
    },
  });

  const onSubmit = (formData: any) => {
    //console.log("Dados capturados com sucesso:", formData);
    
    const parsedData = {
      ...formData,
      date: new Date(formData.date),
    };

    axios
      .post("/api/activities", parsedData)
      .then((res) => {
        if (res.status === 200) {
          router.push("/admin");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Erro ao criar atividade");
      });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-center gap-1 mt-1"
      noValidate
    >
      <Card className="w-[250px] pb-4">
        <CardHeader className="flex justify-center bg-black text-white rounded-t-xl">
          Create New Activity
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col items-center justify-center gap-3">
          
          <Input
            color="default"
            type="text"
            label="Title"
            className="max-w-[220px]"
            isInvalid={!!errors.title}
            errorMessage={errors.title?.message as string}
            {...register('title')}
          />

          <div className="flex flex-col w-full max-w-[220px]">
            <label className="text-xs text-gray-500 mb-1 ml-1">Date</label>
            <input
              type="date"
              className="bg-default-100 hover:bg-default-200 focus:bg-default-200 px-3 py-2.5 rounded-xl text-sm outline-none transition-colors w-full"
              {...register('date')}
            />
            {errors.date && (
              <span className="text-danger text-[10px] mt-1 ml-1">{errors.date.message as string}</span>
            )}
          </div>

          <div className="flex flex-col w-full max-w-[220px]">
            <label className="text-xs text-gray-500 mb-1 ml-1">Start Time</label>
            <Controller
              name="startTime"
              control={control}
              render={({ field }) => (
                <input
                  type="time"
                  className="bg-default-100 hover:bg-default-200 focus:bg-default-200 px-3 py-2.5 rounded-xl text-sm outline-none transition-colors w-full"
                  value={field.value || ""}
                  onChange={(e) => {
                    console.log("Tempo digitado (Start):", e.target.value);
                    field.onChange(e.target.value); 
                  }}
                />
              )}
            />
            {errors.startTime && (
              <span className="text-danger text-[10px] mt-1 ml-1">{errors.startTime.message as string}</span>
            )}
          </div>

   
          <div className="flex flex-col w-full max-w-[220px]">
            <label className="text-xs text-gray-500 mb-1 ml-1">End Time</label>
            <Controller
              name="endTime"
              control={control}
              render={({ field }) => (
                <input
                  type="time"
                  className="bg-default-100 hover:bg-default-200 focus:bg-default-200 px-3 py-2.5 rounded-xl text-sm outline-none transition-colors w-full"
                  value={field.value || ""}
                  onChange={(e) => {
                    console.log("Tempo digitado (End):", e.target.value);
                    field.onChange(e.target.value); 
                  }}
                />
              )}
            />
            {errors.endTime && (
              <span className="text-danger text-[10px] mt-1 ml-1">{errors.endTime.message as string}</span>
            )}
          </div>
          <Input
            color="default"
            type="text"
            label="Description"
            className="max-w-[220px]"
            isInvalid={!!errors.description}
            errorMessage={errors.description?.message as string}
            {...register('description')}
          />
          
          <Input
            color="default"
            type="text"
            label="Location"
            className="max-w-[220px]"
            isInvalid={!!errors.location}
            errorMessage={errors.location?.message as string}
            {...register('location')}
          />
          
          <Input
            color="default"
            type="number"
            placeholder="0"
            label="Capacity"
            className="max-w-[220px]"
            isInvalid={!!errors.capacity}
            errorMessage={errors.capacity?.message as string}
            {...register('capacity', { valueAsNumber: true })}
          />
          
          <Input
            color="default"
            type="text"
            label="Speakers"
            className="max-w-[220px]"
            isInvalid={!!errors.speakers}
            errorMessage={errors.speakers?.message as string}
            {...register('speakers')}
          />
          
          <Input
            color="default"
            type="number"
            label="Points"
            placeholder="0"
            className="max-w-[220px]"
            isInvalid={!!errors.points}
            errorMessage={errors.points?.message as string}
            {...register('points', { valueAsNumber: true })}
          />

          {/* Select Controlado */}
          <Controller
            name="type"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                label="Type"
                className="max-w-[220px]"
                isInvalid={!!errors.type}
                errorMessage={errors.type?.message as string}
                selectedKeys={value ? [value] : [Types[0]]}
                onChange={(e) => onChange(e.target.value)}
              >
                {Types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
        </CardBody>
        
        <div className="px-4 w-full flex justify-center mt-2">
          <button 
            type="submit" 
            className="w-[220px] py-2.5 rounded-xl bg-black hover:bg-slate-800 text-white transition-colors shadow-md text-sm font-medium"
          >
            Create Activity
          </button>
        </div>
      </Card>
    </form>
  );
}