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
  SelectItem,
  Button,
  Spinner
} from '@nextui-org/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Types, ActivitySchema } from '@prisma/zod';
import { FiPlus } from 'react-icons/fi';

export default function CreateActivity() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(ActivitySchema),
    defaultValues: {
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      description: '',
      location: '',
      capacity: 0,
      speakers: '',
      points: 0,
      type: Types[0],
    },
  });

  const onSubmit = async (formData: any) => {
    setIsLoading(true);
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-white/80 mb-2 block">Date *</label>
              <input
                type="date"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                {...register('date')}
              />
              {errors.date && <span className="text-danger text-xs mt-1 block">{errors.date.message as string}</span>}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-white/70 mb-1 block">Start Time *</label>
                <Controller
                  name="startTime"
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Capacity"
              type="number"
              placeholder="0"
              {...register('capacity', { valueAsNumber: true })}
              isInvalid={!!errors.capacity}
              errorMessage={errors.capacity?.message as string}
              variant="bordered"
              className="bg-white/10 border-white/20"
            />
            <Input
              label="Points"
              type="number"
              placeholder="0"
              {...register('points', { valueAsNumber: true })}
              isInvalid={!!errors.points}
              errorMessage={errors.points?.message as string}
              variant="bordered"
              className="bg-white/10 border-white/20"
            />
          </div>
          
          <Input
            label="Speakers"
            {...register('speakers')}
            isInvalid={!!errors.speakers}
            errorMessage={errors.speakers?.message as string}
            variant="bordered"
            className="bg-white/10 border-white/20"
          />

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
