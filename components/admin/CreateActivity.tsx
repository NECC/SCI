"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  Card,
  CardBody,
  CardHeader,
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
  const [isLoading, setIsLoading] = useState(false);

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
    reset,
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

    try {
      const response = await axios.post('/api/activities', parsedData);
      const data = response.data as { response: string; error?: string };
      if (data.response === 'success') {
        reset();
        router.push('/admin');
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err: any) {
      console.error(err);
      alert('Erro ao criar atividade: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      noValidate
    >
      <Card className="admin-gradient-card border-white/20 shadow-lg backdrop-blur-md">
        <CardHeader className="bg-white/5 border-b border-white/10 p-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FiPlus className="text-emerald-400" />
            New Activity
          </h3>
        </CardHeader>
        <CardBody className="p-6 space-y-4">
          <Input
            label="Title *"
            {...register('title')}
            isInvalid={!!errors.title}
            errorMessage={errors.title?.message as string}
            variant="bordered"
            className="bg-white/10 border-white/20"
            color="default"
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
                {errors.startTime && <span className="text-danger text-[10px] mt-1 block">{errors.startTime.message as string}</span>}
              </div>
              <div>
                <label className="text-xs text-white/70 mb-1 block">End Time *</label>
                <Controller
                  name="endTime"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="time"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.endTime && <span className="text-danger text-[10px] mt-1 block">{errors.endTime.message as string}</span>}
              </div>
            </div>
          </div>

          <Input
            label="Description"
            {...register('description')}
            isInvalid={!!errors.description}
            errorMessage={errors.description?.message as string}
            variant="bordered"
            className="bg-white/10 border-white/20"
          />
          
          <Input
            label="Location"
            {...register('location')}
            isInvalid={!!errors.location}
            errorMessage={errors.location?.message as string}
            variant="bordered"
            className="bg-white/10 border-white/20"
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
            label="Speakers"
            {...register('speakers')}
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
                label="Type *"
                isInvalid={!!errors.type}
                errorMessage={errors.type?.message as string}
                selectedKeys={value ? [value] : []}
                onSelectionChange={(keys) => onChange(Array.from(keys)[0] || Types[0])}
                variant="bordered"
                className="bg-white/10 border-white/20"
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
        <div className="p-6 pt-0 border-t border-white/10">
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold shadow-lg transition-all py-3 rounded-xl text-base"
            isLoading={isLoading}
            startContent={isLoading ? <Spinner size="sm" /> : <FiPlus size={18} />}
          >
            {isLoading ? 'Creating...' : 'Create Activity'}
          </Button>
        </div>
      </Card>
    </form>
  );
}
