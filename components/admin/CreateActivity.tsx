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
import { Types, ActivitySchema, Sponsor } from "@prisma/zod";
import { useEffect } from "react";
import sponsors from "@data/sponsor.json"

export default function CreateActivity() {
  const router = useRouter();

  const plans: Record<string, string> = {
    standard: "silver",
    premium: "gold",
    main: "diamond",
  };

  const achivements : Record<string,number> = 
  {
    bronze : 10,
    silver : 20,
    gold : 50,
    diamond : 100,
    emerald : 200
  }

  const {
    register,
    handleSubmit,
    control,
    watch,      
    setValue,
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
      capacity: 1,
      speakers: "",
      points: 0,
      achievement: "",
      type: Types[0],
      sponsor : Sponsor[0],
    },
  });

  //Sponsor selecionado
  const selectedSponsorName = watch("sponsor");
  const currentSponsorObj = sponsors.Patrocinadores.find(
    (s) => s.name === selectedSponsorName
  );
  const hasPlan = currentSponsorObj && currentSponsorObj.plan !== "";

  useEffect(() => {
    if (hasPlan && currentSponsorObj?.plan) {
      const planTier = plans[currentSponsorObj.plan.toLowerCase()];
      if (planTier) {
        const pointsValue = achivements[planTier] || 0;
        setValue("points", pointsValue);
        setValue("achievement",planTier)
      }
    }
  }, [selectedSponsorName, hasPlan, setValue]);

  const onSubmit = async (formData: any) => {
    console.log("Dados capturados com sucesso:", formData);
    
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
            placeholder="1"
            label="Capacity"
            className="max-w-[220px]"
            min={1}
            
            isInvalid={!!errors.capacity}
            errorMessage={errors.capacity?.message as string}
            {...register('capacity', { valueAsNumber: true })}
          />
           <Controller
            name="sponsor"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                label="Sponsor"
                className="max-w-[220px]"
                isInvalid={!!errors.sponsor}
                errorMessage={errors.sponsor?.message as string}
                selectedKeys={value ? [value] : [Sponsor[0]]}
                onChange={(e) => onChange(e.target.value)}
              >
                {Sponsor.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </Select>
            )}
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
          
          {hasPlan ? (
          /* Adicionar pontos associados a um plano de patrocionio */
          <>
          <Input
            key="fixed-points"
            type="number"
            label={`Points (${currentSponsorObj.plan})`}
            className="max-w-[220px]"
            isDisabled
            variant="flat"
            color="primary"
            {...register('points', { valueAsNumber: true })}
          />
          <input type="hidden" {...register('achievement')} />
        </>
        ) : (
          /* Adicionar pontos quando não há plano associado */
          <Controller
            name="points"
            control={control}
            render={({ field }) => (
              <Select
                label="Select Achievement Points"
                className="max-w-[220px]"
                isInvalid={!!errors.points}
                errorMessage={errors.points?.message as string}
                selectedKeys={field.value ? [field.value.toString()] : []}
                onChange={(e) => {
                const val = Number(e.target.value);
                field.onChange(val);
                
                // Find the tier name based on the points value selected
                const tierName = Object.keys(achivements).find(key => achivements[key] === val);
                if (tierName) setValue("achievement", tierName);
              }}
            >
              {Object.entries(achivements).map(([tier, value]) => (
                <SelectItem key={value} value={value} textValue={`${value} pts`}>
                  {tier.toUpperCase()} ({value} pts)
                </SelectItem>
              ))}
            </Select>
            )}
          />
        )}

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